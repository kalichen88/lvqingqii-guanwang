/**
 * 腾讯云 EdgeOne 边缘函数示例：接收询价表单
 * ===========================================================================
 * 部署到 EdgeOne（Pages / 边缘函数）后，把 functions/api/inquiry.js 放到项目
 * 根目录的 functions/ 下，然后在 site.config.mjs 里设置：
 *
 *     forms: { endpoint: '/api/inquiry' }
 *
 * 重新构建并部署，表单就会 POST 到这里。
 *
 * 支持的转发方式（在 EdgeOne 控制台配置环境变量，任一即可）：
 *   1) 企业微信 / 钉钉 / 飞书 群机器人 Webhook —— 最简单，推荐
 *      WEBHOOK_URL = https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx
 *   2) 邮件转发（通过第三方 API，如 Resend）
 *      RESEND_API_KEY = re_xxx
 *      MAIL_TO        = sales@yourdomain.com
 *      MAIL_FROM      = website@yourdomain.com
 *
 * 若两个都没配置，函数会把内容打印到边缘日志，便于调试。
 * ===========================================================================
 */

/** 简单的内存限流：同一 IP 1 分钟最多 5 次 */
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const rec = hits.get(ip) ?? { count: 0, reset: now + 60_000 }
  if (now > rec.reset) {
    rec.count = 0
    rec.reset = now + 60_000
  }
  rec.count++
  hits.set(ip, rec)
  return rec.count > 5
}

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m])

function renderText(data) {
  const rows = [
    ['称呼 / Name', data.name],
    ['电话 / Phone', data.phone],
    ['公司 / Company', data.company],
    ['邮箱 / Email', data.email],
    ['件号机型 / Part', data.partNo],
    ['数量 / Qty', data.quantity],
    ['说明 / Message', data.message],
    ['来源页 / Page', data.page],
    ['语言 / Lang', data.lang],
    ['时间 / At', data.submittedAt],
  ]
  return rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown'

  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ ok: false, error: 'too_many_requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let data
  try {
    data = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 蜜罐命中：伪装成功，不转发
  if (data._company_website) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 必填校验
  if (!data.name || !data.phone) {
    return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const text = renderText(data)
  const results = { webhook: 'skipped', mail: 'skipped' }

  /* ---------- 1) 群机器人 Webhook ---------- */
  if (env.WEBHOOK_URL) {
    try {
      const isFeishu = env.WEBHOOK_URL.includes('feishu') || env.WEBHOOK_URL.includes('larksuite')
      const isDingTalk = env.WEBHOOK_URL.includes('dingtalk')
      const body = isFeishu
        ? { msg_type: 'text', content: { text: `【官网询价】\n${text}` } }
        : isDingTalk
          ? { msgtype: 'text', text: { content: `【官网询价】\n${text}` } }
          : { msgtype: 'text', text: { content: `【官网询价】\n${text}` } }

      const res = await fetch(env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      results.webhook = res.ok ? 'ok' : `http_${res.status}`
    } catch (e) {
      results.webhook = 'error'
    }
  }

  /* ---------- 2) 邮件（Resend 示例） ---------- */
  if (env.RESEND_API_KEY && env.MAIL_TO) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.MAIL_FROM || 'website@example.com',
          to: [env.MAIL_TO],
          subject: `官网询价：${data.partNo || data.name}`,
          html: `<pre style="font-family:ui-monospace,Consolas,monospace;font-size:14px;line-height:1.7">${escapeHtml(text)}</pre>`,
        }),
      })
      results.mail = res.ok ? 'ok' : `http_${res.status}`
    } catch {
      results.mail = 'error'
    }
  }

  // 都没配置时，打到边缘日志便于排查
  if (results.webhook === 'skipped' && results.mail === 'skipped') {
    console.log('[inquiry] no delivery channel configured:\n' + text)
  }

  return new Response(JSON.stringify({ ok: true, delivered: results }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

/** 非 POST 请求直接拒绝 */
export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    })
  }
}
