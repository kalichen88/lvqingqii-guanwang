/**
 * shot.mjs — 基于 Chrome DevTools Protocol 的截图 / 页面诊断工具
 * ---------------------------------------------------------------------------
 * 比 `chrome --screenshot` 更强：支持整页截图、多个视口、自定义视口尺寸，
 * 以及在真实渲染后执行一段 JS 并把结果打印出来（用于排查布局问题）。
 *
 * 前提：本机装有 Chrome（默认自动探测常见路径，可用 CHROME_PATH 覆盖）。
 *
 * 用法：
 *   node scripts/shot.mjs http://127.0.0.1:4321/ --out=.shots/home.png
 *   node scripts/shot.mjs http://127.0.0.1:4321/ --w=414 --h=900 --full
 *   node scripts/shot.mjs http://127.0.0.1:4321/ --eval="document.documentElement.scrollWidth"
 *   node scripts/shot.mjs http://127.0.0.1:4321/ --overflow     # 找出横向溢出的元素
 * ---------------------------------------------------------------------------
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a) => {
    if (a.startsWith('--')) {
      const [k, v = 'true'] = a.replace(/^--/, '').split('=')
      return [[k, v]]
    }
    return []
  }),
)
const URL_ARG = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'http://127.0.0.1:4321/'
const WIDTH = Number(args.w ?? 1440)
const HEIGHT = Number(args.h ?? 900)
const FULL = 'full' in args
const OUT = args.out ?? null
const EVAL = args.eval ?? null
const OVERFLOW = 'overflow' in args
const WAIT = Number(args.wait ?? 2500)
/** 截图前先滚动到指定位置（用于分段查看长页面） */
const SCROLL = args.scroll != null ? Number(args.scroll) : null
/** 截图前点击某个选择器（用于展开菜单/手风琴） */
const CLICK = args.click ?? null

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

async function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    try {
      await access(c)
      return c
    } catch {
      /* keep looking */
    }
  }
  throw new Error('未找到 Chrome，请设置环境变量 CHROME_PATH')
}

const PORT = 9222 + Math.floor(Math.random() * 300)

/** 极简 CDP 客户端（Node 22+ 自带全局 WebSocket） */
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
    return new Promise((res, reject) => {
      this.pending.set(id, { resolve: res, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }
  static async connect(wsUrl) {
    const ws = new WebSocket(wsUrl)
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true })
      ws.addEventListener('error', () => rej(new Error('WebSocket 连接失败')), { once: true })
    })
    return new CDP(ws)
  }
}

async function fetchJson(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url)
      if (r.ok) return await r.json()
    } catch {
      /* devtools not up yet */
    }
    await delay(250)
  }
  throw new Error(`无法连接 DevTools: ${url}`)
}

const OVERFLOW_PROBE = `
(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'absolute') {
      // 绝对/固定定位元素只要在视口内就算正常，除非明显超出
    }
    const over = Math.round(r.right - vw);
    if (over > 2) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 110),
        text: (el.textContent || '').trim().slice(0, 40),
        right: Math.round(r.right),
        width: Math.round(r.width),
        over,
        pos: cs.position,
      });
    }
  });
  out.sort((a, b) => b.over - a.over);
  return JSON.stringify({
    viewport: vw,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    count: out.length,
    top: out.slice(0, 14),
  }, null, 2);
})()
`

async function main() {
  const chrome = await findChrome()
  const child = spawn(
    chrome,
    [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      '--remote-allow-origins=*',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + resolve(process.cwd(), '.shots/.chrome-profile'),
      `--window-size=${WIDTH},${HEIGHT}`,
      'about:blank',
    ],
    { stdio: 'ignore', detached: false },
  )

  try {
    const version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`)
    // 新版 Chrome 要求用 PUT 创建 target，旧版用 GET；两种都试
    const target = await (async () => {
      try {
        const r = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(URL_ARG)}`, {
          method: 'PUT',
        })
        if (r.ok) return await r.json()
      } catch {
        /* fall through */
      }
      return await fetchJson(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(URL_ARG)}`, 20)
    })()

    const cdp = await CDP.connect(target.webSocketDebuggerUrl)
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    // 用 Emulation 精确控制视口，避免窗口大小与内容尺寸不一致
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: WIDTH < 640,
    })

    // 等待加载完成
    await new Promise((res) => {
      const t = setTimeout(res, WAIT + 5000)
      const onMsg = (ev) => {
        const m = JSON.parse(ev.data)
        if (m.method === 'Page.loadEventFired') {
          clearTimeout(t)
          res()
        }
      }
      cdp.ws.addEventListener('message', onMsg)
    })
    await delay(WAIT)

    if (EVAL) {
      const r = await cdp.send('Runtime.evaluate', {
        expression: EVAL,
        returnByValue: true,
        awaitPromise: true,
      })
      console.log(typeof r.result.value === 'string' ? r.result.value : JSON.stringify(r.result.value, null, 2))
      return
    }

    if (OVERFLOW) {
      const r = await cdp.send('Runtime.evaluate', {
        expression: OVERFLOW_PROBE,
        returnByValue: true,
      })
      console.log(r.result.value)
      return
    }

    if (CLICK) {
      await cdp.send('Runtime.evaluate', {
        expression: `document.querySelector(${JSON.stringify(CLICK)})?.click()`,
        returnByValue: true,
      })
      await delay(900)
    }

    if (SCROLL != null) {
      await cdp.send('Runtime.evaluate', {
        expression: `window.scrollTo(0, ${SCROLL}); 'ok'`,
        returnByValue: true,
      })
      // 等滚动动画与 IntersectionObserver 触发完成
      await delay(1400)
    }

    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: FULL,
      ...(FULL ? { clip: await fullClip(cdp) } : {}),
    })

    if (OUT) {
      const abs = resolve(process.cwd(), OUT)
      await mkdir(dirname(abs), { recursive: true })
      await writeFile(abs, Buffer.from(shot.data, 'base64'))
      console.log(`saved ${OUT} (${WIDTH}x${FULL ? 'full' : HEIGHT})`)
    } else {
      process.stdout.write(Buffer.from(shot.data, 'base64'))
    }
  } finally {
    child.kill()
  }
}

/** 计算整页尺寸用于 full 截图 */
async function fullClip(cdp) {
  const r = await cdp.send('Runtime.evaluate', {
    expression: `JSON.stringify({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight })`,
    returnByValue: true,
  })
  const { w, h } = JSON.parse(r.result.value)
  return { x: 0, y: 0, width: w, height: Math.min(h, 20000), scale: 1 }
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
