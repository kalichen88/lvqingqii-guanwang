/**
 * drive.mjs — 用 CDP 驱动一个已打开的 Chrome（用于代替人工点击网页）
 * ---------------------------------------------------------------------------
 * 连接到你自己启动的 Chrome（需带 --remote-debugging-port），按顺序执行命令。
 * 适合「我已经登录了，你来点界面」这种场景：账号密码始终由你输入，
 * 脚本只负责导航、点击、填表、截图。
 *
 * 启动 Chrome（可见窗口，由你自己登录）：
 *   chrome.exe --remote-debugging-port=9222 --user-data-dir=<某个目录> https://example.com
 *
 * 用法：
 *   node scripts/drive.mjs "goto|https://dash.cloudflare.com/" "wait|3000" "shot|.shots/a.png"
 *   node scripts/drive.mjs "dump"                       # 列出页面上可点的元素
 *   node scripts/drive.mjs "clicktext|Create" "wait|2000" "shot|.shots/b.png"
 *   node scripts/drive.mjs "fill|input[name=q]|hello"
 *
 * 支持的命令：
 *   goto|<url>              导航
 *   wait|<ms>               等待
 *   shot|<path>             视口截图（写入文件）
 *   shotfull|<path>         整页截图
 *   click|<css>             CSS 选择器点击
 *   clicktext|<text>        按可见文字点击（含次级匹配）
 *   fill|<css>|<value>      填入输入框（触发 input/change 事件）
 *   select|<css>|<value>    选择下拉项
 *   eval|<js>               执行 JS 并打印结果
 *   text|<css>              打印元素文本
 *   dump                    列出按钮/链接/输入框（用于发现可点目标）
 *   url                     打印当前 URL
 * ---------------------------------------------------------------------------
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const PORT = Number((process.argv.find((a) => a.startsWith('--port=')) ?? '--port=9222').split('=')[1])
const FILE_ARG = process.argv.find((a) => a.startsWith('--file='))

/**
 * 命令来源：
 *   1) --file=<path>  从文件读取，每行一条命令（推荐，避免 shell 转义问题）
 *   2) 其余参数直接作为命令
 */
const commands = FILE_ARG
  ? (await readFile(resolve(process.cwd(), FILE_ARG.split('=')[1]), 'utf8'))
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
  : process.argv.slice(2).filter((a) => !a.startsWith('--'))

const log = (m) => console.log(m)

/** 极简 CDP 客户端 */
class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: res, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : res(msg.result)
      }
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    return new Promise((res, rej) => {
      this.pending.set(id, { resolve: res, reject: rej })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', {
      expression: `(() => { ${expression} })()`,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true,
    })
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.exception?.description ?? 'eval 失败')
    }
    return r.result.value
  }
}

async function findPageTarget() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const list = await res.json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page
    } catch {
      /* devtools 还没起来 */
    }
    await delay(400)
  }
  throw new Error(`连接不上 CDP（127.0.0.1:${PORT}），请确认 Chrome 带 --remote-debugging-port 启动`)
}

/** 按可见文字找元素并点击（返回命中的文字，便于确认点对了） */
const CLICK_TEXT_JS = (text) => `
  const want = ${JSON.stringify(String(text).toLowerCase())};
  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };
  const cands = [...document.querySelectorAll('a,button,[role="button"],[role="tab"],[role="menuitem"],summary,label,div,span')]
    .filter(isVisible)
    .map(el => ({ el, t: (el.innerText || el.textContent || '').trim() }))
    .filter(x => x.t && x.t.toLowerCase().includes(want));
  if (!cands.length) return { ok: false, reason: 'not-found' };
  // 优先最短文本（最贴近按钮本身），并且优先可交互元素
  cands.sort((a, b) => {
    const scoreA = (a.el.tagName === 'BUTTON' || a.el.tagName === 'A' ? 0 : 1) * 1000 + a.t.length;
    const scoreB = (b.el.tagName === 'BUTTON' || b.el.tagName === 'A' ? 0 : 1) * 1000 + b.t.length;
    return scoreA - scoreB;
  });
  const pick = cands[0];
  pick.el.scrollIntoView({ block: 'center' });
  pick.el.click();
  return { ok: true, clicked: pick.t.slice(0, 60), tag: pick.el.tagName };
`

const DUMP_JS = `
  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const uniq = (arr) => [...new Set(arr)];
  const btn = [...document.querySelectorAll('button,[role="button"],a,input[type="submit"]')]
    .filter(isVisible).map(e => ((e.innerText||e.value||e.getAttribute('aria-label')||'').trim().slice(0,40))).filter(Boolean);
  const inp = [...document.querySelectorAll('input,select,textarea')]
    .filter(isVisible).map(e => ({ tag: e.tagName.toLowerCase(), type: e.type||'', name: e.name||'', id: e.id||'', ph: e.placeholder||'', label: (e.getAttribute('aria-label')||'') }));
  const head = [...document.querySelectorAll('h1,h2,h3')].filter(isVisible).map(e => e.innerText.trim().slice(0,80)).filter(Boolean);
  return JSON.stringify({ url: location.href, headings: uniq(head).slice(0,10), buttons: uniq(btn).slice(0,60), inputs: inp.slice(0,30) }, null, 2);
`

async function main() {
  const target = await findPageTarget()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true })
    ws.addEventListener('error', () => rej(new Error('WebSocket 连接失败')), { once: true })
  })
  const cdp = new CDP(ws)
  await cdp.send('Page.enable')
  await cdp.send('Runtime.enable')
  log(`已连接：${target.title}\n${target.url}\n`)

  for (const raw of commands) {
    const [cmd, ...rest] = raw.split('|')
    const arg = rest.join('|')

    switch (cmd) {
      case 'goto': {
        await cdp.send('Page.navigate', { url: arg })
        await delay(2500)
        log(`▸ goto ${arg}`)
        break
      }
      case 'wait': {
        await delay(Number(arg) || 1000)
        log(`▸ wait ${arg}ms`)
        break
      }
      case 'scroll': {
        const y = arg === 'bottom' ? 'document.documentElement.scrollHeight' : arg
        await cdp.eval(`window.scrollTo(0, ${y}); return 'ok';`)
        await delay(500)
        log(`▸ scroll → ${arg}`)
        break
      }
      case 'url': {
        const u = await cdp.eval('return location.href')
        log(`URL: ${u}`)
        break
      }
      case 'shot':
      case 'shotfull': {
        const full = cmd === 'shotfull'
        let clip
        if (full) {
          const size = JSON.parse(await cdp.eval(`return JSON.stringify({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight})`))
          clip = { x: 0, y: 0, width: size.w, height: Math.min(size.h, 20000), scale: 1 }
        }
        const shot = await cdp.send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: full,
          ...(clip ? { clip } : {}),
        })
        const abs = resolve(process.cwd(), arg)
        await mkdir(dirname(abs), { recursive: true })
        await writeFile(abs, Buffer.from(shot.data, 'base64'))
        log(`▸ 截图已保存 ${arg}`)
        break
      }
      case 'click': {
        const r = await cdp.eval(`
          const el = document.querySelector(${JSON.stringify(arg)});
          if (!el) return 'not-found';
          el.scrollIntoView({block:'center'});
          el.click();
          return (el.innerText || el.tagName).trim().slice(0,60);
        `)
        log(`▸ click ${arg} → ${r}`)
        await delay(1200)
        break
      }
      case 'clicktext': {
        const r = await cdp.eval(CLICK_TEXT_JS(arg))
        log(`▸ clicktext "${arg}" → ${JSON.stringify(r)}`)
        await delay(1500)
        break
      }
      case 'fill': {
        const [sel, val] = [rest[0], rest.slice(1).join('|')]
        const r = await cdp.eval(`
          const el = document.querySelector(${JSON.stringify(sel)});
          if (!el) return 'not-found';
          const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value')?.set;
          if (setter) setter.call(el, ${JSON.stringify(val)}); else el.value = ${JSON.stringify(val)};
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return el.value;
        `)
        log(`▸ fill ${sel} → ${r}`)
        break
      }
      case 'select': {
        const [sel, val] = [rest[0], rest.slice(1).join('|')]
        const r = await cdp.eval(`
          const el = document.querySelector(${JSON.stringify(sel)});
          if (!el) return 'not-found';
          el.value = ${JSON.stringify(val)};
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return el.value;
        `)
        log(`▸ select ${sel} → ${r}`)
        await delay(800)
        break
      }
      case 'text': {
        const r = await cdp.eval(`
          const el = document.querySelector(${JSON.stringify(arg)});
          return el ? el.innerText.trim().slice(0,2000) : 'not-found';
        `)
        log(`── text ${arg} ──\n${r}\n`)
        break
      }
      case 'eval': {
        const r = await cdp.eval(`return (${arg})`)
        log(`── eval ──\n${typeof r === 'string' ? r : JSON.stringify(r, null, 2)}\n`)
        break
      }
      case 'dump': {
        const r = await cdp.eval(DUMP_JS)
        log(`── 页面可交互元素 ──\n${r}\n`)
        break
      }
      default:
        log(`✘ 未知命令：${cmd}`)
    }
  }

  ws.close()
}

main().catch((e) => {
  console.error('✘', e.message)
  process.exit(1)
})
