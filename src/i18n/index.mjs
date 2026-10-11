/**
 * 国际化 / i18n
 * ---------------------------------------------------------------------------
 * - 中文为默认语言，路径不带前缀：/products/
 * - 英文站在 /en/ 前缀下：/en/products/
 * - 所有界面文案集中在此，新增页面时同步补充即可。
 */

/** @typedef {'zh' | 'en'} Lang */

export const LANGS = /** @type {const} */ (['zh', 'en'])
export const DEFAULT_LANG = 'zh'

/** 语言元信息 */
export const langMeta = {
  zh: { code: 'zh-CN', label: '中文', short: '中', htmlLang: 'zh-CN', ogLocale: 'zh_CN' },
  en: { code: 'en', label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
}

/**
 * 把站内路径本地化。
 * localizePath('/products/', 'en') -> '/en/products/'
 * localizePath('/', 'en')         -> '/en/'
 */
export function localizePath(path, lang) {
  const clean = '/' + String(path).replace(/^\/+/, '')
  if (lang === DEFAULT_LANG) return clean
  return clean === '/' ? '/en/' : `/en${clean}`
}

/**
 * 从当前 URL 路径判断语言。
 * '/en/about/' -> 'en'，其余 -> 'zh'
 */
export function langFromPath(pathname) {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'zh'
}

/**
 * 去掉语言前缀，拿到「中性路径」，用于语言切换。
 * '/en/about/' -> '/about/'
 */
export function neutralPath(pathname) {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '')
  return stripped === '' ? '/' : stripped
}

/** 生成另一个语言版本的路径 */
export function altLangPath(pathname, target) {
  return localizePath(neutralPath(pathname), target)
}

/* ==========================================================================
   界面文案字典
   ========================================================================== */
export const ui = {
  /* ---- 通用 ---- */
  brandAgent: { zh: '授权代理服务商', en: 'Authorized Distributor' },
  hotline: { zh: '服务热线', en: 'Sales Hotline' },
  consultNow: { zh: '立即咨询', en: 'Enquire Now' },
  getQuote: { zh: '获取报价', en: 'Get a Quote' },
  requestSample: { zh: '索取样品', en: 'Request a Sample' },
  viewDetails: { zh: '查看详情', en: 'View Details' },
  viewAll: { zh: '查看全部', en: 'View All' },
  learnMore: { zh: '了解更多', en: 'Learn More' },
  readMore: { zh: '阅读全文', en: 'Read More' },
  backTo: { zh: '返回', en: 'Back to' },
  home: { zh: '首页', en: 'Home' },
  search: { zh: '搜索', en: 'Search' },
  reset: { zh: '重置', en: 'Reset' },
  loading: { zh: '加载中…', en: 'Loading…' },
  noResult: { zh: '没有找到匹配的结果', en: 'No matching results' },
  copySuccess: { zh: '已复制', en: 'Copied' },
  copy: { zh: '复制', en: 'Copy' },
  whatsapp: { zh: 'WhatsApp', en: 'WhatsApp' },
  wechat: { zh: '微信咨询', en: 'WeChat' },
  email: { zh: '邮箱', en: 'Email' },
  phone: { zh: '电话', en: 'Phone' },
  address: { zh: '地址', en: 'Address' },
  workingHours: { zh: '工作时间', en: 'Business Hours' },
  contactUs: { zh: '联系我们', en: 'Contact Us' },
  langSwitch: { zh: 'English', en: '中文' },

  /* ---- 导航 ---- */
  navProducts: { zh: '产品中心', en: 'Products' },
  navSolutions: { zh: '应用领域', en: 'Applications' },
  navService: { zh: '服务与支持', en: 'Service & Support' },
  navQuality: { zh: '品牌与品质', en: 'Brand & Quality' },
  navAbout: { zh: '关于我们', en: 'About Us' },
  navNews: { zh: '新闻资讯', en: 'News' },
  navContact: { zh: '联系我们', en: 'Contact' },
  navSearch: { zh: '件号查询', en: 'Part Finder' },
  navFaq: { zh: '常见问题', en: 'FAQ' },

  /* ---- 页头 ---- */
  headerTopbar: {
    zh: '富滤盛（FILTERSUN）授权代理 · 正品保障 · 现货直发',
    en: 'Authorized FILTERSUN Distributor · Genuine Parts · Same-Day Dispatch',
  },
  headerSearchPlaceholder: {
    zh: '输入件号、机型或关键词，如 FS641A / 小松 PC200',
    en: 'Part number, machine model or keyword, e.g. FS641A',
  },
  menu: { zh: '菜单', en: 'Menu' },
  close: { zh: '关闭', en: 'Close' },

  /* ---- 首页 ---- */
  homeHeroEyebrow: { zh: '工程机械 · 商用车 · 工业过滤', en: 'Construction · Truck · Industrial' },
  homeStats: { zh: '实力数据', en: 'By the Numbers' },
  homeGroupsTitle: { zh: '按应用场景，找到对的滤芯', en: 'Find the right filter by application' },
  homeGroupsDesc: {
    zh: '我们把厂家 9000+ 件号按你的设备类型重新整理成 8 大品类，选型从「翻目录」变成「点两下」。',
    en: 'We reorganised 9,000+ factory part numbers into 8 application groups, so selection takes two clicks instead of a catalogue.',
  },
  homeFinderTitle: { zh: '不确定要哪个件号？', en: 'Not sure which part number?' },
  homeFinderDesc: {
    zh: '三种方式任选：直接搜件号、按机型匹配、或把旧滤芯照片发给我们。',
    en: 'Three ways in: search the part number, match by machine model, or just send us a photo of the old filter.',
  },
  homeWhyTitle: { zh: '为什么客户选择我们', en: 'Why customers choose us' },
  homeBrandTitle: { zh: '背后的制造实力', en: 'The manufacturing behind us' },
  homeBrandDesc: {
    zh: '我们代理的富滤盛集团，是一家有 20 年历史的滤清器集团企业，在东莞、宿迁、大悟设有三大生产基地。',
    en: 'We represent FILTERSUN Group — a 20-year filtration manufacturer with three production bases in Dongguan, Suqian and Dawu.',
  },
  homeAppsTitle: { zh: '服务行业', en: 'Industries We Serve' },
  homeProcessTitle: { zh: '从询价到收货，只要四步', en: 'From enquiry to delivery in four steps' },
  homeFaqTitle: { zh: '采购常见问题', en: 'Common purchasing questions' },
  homeNewsTitle: { zh: '新闻与动态', en: 'News & Updates' },
  homeCtaTitle: { zh: '把件号发过来，剩下的交给我们', en: 'Send us the part number — we handle the rest' },
  homeCtaDesc: {
    zh: '一个工作日内回复报价与货期。批量采购、非标定制、出口订单同样欢迎。',
    en: 'Quotation and lead time within one business day. Bulk orders, custom builds and export enquiries welcome.',
  },

  /* ---- 产品 ---- */
  productsTitle: { zh: '产品中心', en: 'Product Centre' },
  productsDesc: {
    zh: '按应用大类浏览，或直接使用件号查询工具精确定位。',
    en: 'Browse by application group, or jump straight to the part finder.',
  },
  productsCount: { zh: '件号', en: 'part numbers' },
  categoriesTitle: { zh: '细分品类', en: 'Categories' },
  highlightsTitle: { zh: '品类优势', en: 'Highlights' },
  relatedProducts: { zh: '同品类件号', en: 'Related Part Numbers' },
  spec: { zh: '规格尺寸', en: 'Dimensions' },
  type: { zh: '产品类型', en: 'Type' },
  partNo: { zh: '件号', en: 'Part No.' },
  image: { zh: '图片', en: 'Image' },
  oemRef: { zh: '原件号 / OEM', en: 'OEM Reference' },
  oemRefValue: { zh: '请咨询客服核对', en: 'Ask us to cross-check' },
  applicationsOf: { zh: '适用领域', en: 'Applications' },
  featuresTitle: { zh: '产品特性', en: 'Product Features' },
  inquiryAbout: { zh: '询价此件号', en: 'Enquire about this part' },
  allGroups: { zh: '全部大类', en: 'All Groups' },

  /* ---- 件号查询 ---- */
  finderTitle: { zh: '件号 / 机型查询', en: 'Part & Model Finder' },
  finderDesc: {
    zh: '输入件号前缀（如 FS6）、完整件号（如 FS641A）或关键词，实时筛选。',
    en: 'Type a part-number prefix (e.g. FS6), a full number (e.g. FS641A) or a keyword.',
  },
  finderPlaceholder: { zh: '例如：FS641A、CA516、空气滤芯', en: 'e.g. FS641A, CA516, air filter' },
  finderAllGroups: { zh: '全部大类', en: 'All groups' },
  finderAllTypes: { zh: '全部品类', en: 'All types' },
  finderResults: { zh: '条结果', en: 'results' },
  finderHint: {
    zh: '没查到？数据库仍在持续补录，直接把件号或设备铭牌照片发给我们，人工帮你核对。',
    en: "Can't find it? Our database is still growing — send the part number or a photo of the machine plate and we'll check manually.",
  },
  finderLoadMore: { zh: '加载更多', en: 'Load more' },
  finderShowing: { zh: '显示', en: 'Showing' },

  /* ---- 表单 ---- */
  formTitle: { zh: '在线询价', en: 'Online Enquiry' },
  formDesc: {
    zh: '填写后我们会在 1 个工作日内联系您。信息仅用于本次询价。',
    en: 'We reply within one business day. Your details are used only for this enquiry.',
  },
  formName: { zh: '您的称呼', en: 'Your Name' },
  formPhone: { zh: '手机 / 电话', en: 'Phone' },
  formEmail: { zh: '邮箱', en: 'Email' },
  formCompany: { zh: '公司名称', en: 'Company' },
  formPartNo: { zh: '需求件号 / 机型', en: 'Part numbers / machine model' },
  formQuantity: { zh: '采购数量', en: 'Quantity' },
  formMessage: { zh: '补充说明', en: 'Message' },
  formSubmit: { zh: '提交询价', en: 'Send Enquiry' },
  formSubmitting: { zh: '提交中…', en: 'Sending…' },
  formSuccess: {
    zh: '提交成功，我们已收到您的询价，将在 1 个工作日内联系您。',
    en: 'Thank you — your enquiry has been received. We will contact you within one business day.',
  },
  formError: {
    zh: '提交失败，请稍后重试，或直接拨打服务热线。',
    en: 'Submission failed. Please retry, or call our hotline directly.',
  },
  formRequired: { zh: '必填', en: 'required' },
  formPrivacy: {
    zh: '提交即表示同意我们就本次询价与您联系。',
    en: 'By submitting you agree to be contacted about this enquiry.',
  },
  formOrCall: { zh: '或直接致电', en: 'Or call us directly' },

  /* ---- 页脚 ---- */
  footerAbout: { zh: '关于我们', en: 'Company' },
  footerProducts: { zh: '产品分类', en: 'Product Groups' },
  footerSupport: { zh: '服务支持', en: 'Support' },
  footerContact: { zh: '联系方式', en: 'Contact' },
  footerRights: { zh: '版权所有', en: 'All rights reserved' },
  footerPrincipal: {
    zh: '本站所售富滤盛 / FILTERSUN 产品均为厂家正规渠道正品，商标归权利人所有。',
    en: 'All FILTERSUN products on this site are supplied through authorised channels. Trademarks belong to their respective owners.',
  },

  /* ---- 页面标题/描述 ---- */
  metaHomeTitle: {
    zh: '工程机械滤清器_滤芯件号查询_富滤盛授权代理',
    en: 'Construction Machinery Filters & Part Finder | Authorized FILTERSUN Distributor',
  },
  metaHomeDesc: {
    zh: '富滤盛（FILTERSUN）授权代理，供应工程机械、商用车、空压机、工业滤芯 9000+ 件号，支持件号/机型查询、现货直发、出口报关。',
    en: 'Authorized FILTERSUN distributor supplying 9,000+ filter part numbers for construction machinery, trucks, compressors and industry — part finder, in-stock dispatch and export support.',
  },

  /* ---- 404 ---- */
  notFoundTitle: { zh: '页面不存在', en: 'Page not found' },
  notFoundDesc: {
    zh: '链接可能已失效，或地址输入有误。你可以返回首页，或直接使用件号查询。',
    en: 'The link may have expired or the address is incorrect. Go back home, or use the part finder.',
  },
  backHome: { zh: '返回首页', en: 'Back to Home' },
}

/**
 * 取界面文案
 * @param {Lang} lang
 * @param {keyof typeof ui} key
 */
export function t(lang, key) {
  const entry = ui[key]
  if (!entry) return String(key)
  return entry[lang] ?? entry.zh
}

/** 从 {zh, en} 这类对象里按语言取值 */
export function pick(lang, obj) {
  if (obj == null) return ''
  if (typeof obj === 'string') return obj
  return obj[lang] ?? obj.zh ?? ''
}

/** 组装导航结构（供页头/页脚/移动菜单共用） */
export function buildNav(lang) {
  const p = (path) => localizePath(path, lang)
  return [
    { key: 'products', label: t(lang, 'navProducts'), href: p('/products/') },
    { key: 'solutions', label: t(lang, 'navSolutions'), href: p('/applications/') },
    { key: 'search', label: t(lang, 'navSearch'), href: p('/search/') },
    { key: 'service', label: t(lang, 'navService'), href: p('/service/') },
    { key: 'quality', label: t(lang, 'navQuality'), href: p('/quality/') },
    { key: 'about', label: t(lang, 'navAbout'), href: p('/about/') },
    { key: 'news', label: t(lang, 'navNews'), href: p('/news/') },
    { key: 'contact', label: t(lang, 'navContact'), href: p('/contact/') },
  ]
}
