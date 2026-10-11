/**
 * reveal.ts — 滚动进场动画
 * ---------------------------------------------------------------------------
 * 给带 [data-reveal] 的元素在进入视口时加上 .is-in，配合 global.css 里的
 * transition 实现位移/淡入。使用 IntersectionObserver，无第三方依赖。
 *
 * 支持：
 *   data-reveal           默认上移淡入
 *   data-reveal="left"    左移淡入
 *   data-reveal="right"   右移淡入
 *   data-reveal="scale"   缩放淡入
 *   style="--reveal-delay:120ms"   错峰延迟
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function initReveal() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')
  if (!nodes.length) return

  if (reduceMotion) {
    nodes.forEach((n) => n.classList.add('is-in'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  )

  nodes.forEach((n) => io.observe(n))
}

/** 数字滚动：<span data-count="9000">0</span> */
function initCounters() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-count]')
  if (!nodes.length) return

  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count ?? '0')
    const decimals = Number(el.dataset.decimals ?? '0')
    const duration = Number(el.dataset.duration ?? '1500')
    const suffix = el.dataset.suffix ?? ''

    if (reduceMotion) {
      el.textContent = target.toFixed(decimals) + suffix
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      // easeOutExpo，收尾更自然
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      el.textContent = (target * eased).toFixed(decimals) + suffix
      if (p < 1) requestAnimationFrame(tick)
      else el.textContent = target.toFixed(decimals) + suffix
    }
    requestAnimationFrame(tick)
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        run(entry.target as HTMLElement)
        io.unobserve(entry.target)
      }
    },
    { threshold: 0.4 },
  )
  nodes.forEach((n) => io.observe(n))
}

/** 首屏 Hero 的轻微视差 */
function initParallax() {
  if (reduceMotion) return
  const nodes = document.querySelectorAll<HTMLElement>('[data-parallax]')
  if (!nodes.length) return

  let raf = 0
  const update = () => {
    raf = 0
    const y = window.scrollY
    if (y > window.innerHeight * 1.3) return
    for (const n of nodes) {
      const speed = Number(n.dataset.parallax || '0.12')
      n.style.transform = `translate3d(0, ${(y * speed).toFixed(2)}px, 0)`
    }
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!raf) raf = requestAnimationFrame(update)
    },
    { passive: true },
  )
  update()
}

function boot() {
  initReveal()
  initCounters()
  initParallax()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}

/* 视图切换（Astro 的 ClientRouter 若启用）后重新绑定 */
document.addEventListener('astro:page-load', boot)
