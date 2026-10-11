// @ts-check
/**
 * 站点唯一配置源 / Single source of truth
 * ===========================================================================
 * ★★★ 部署前只需要改这一个文件 ★★★
 *
 * 这里集中了品牌名、电话、地址、备案号、域名等全部「会变的信息」。
 * 改完执行 `pnpm build` 即可，全站页面、SEO 标签、结构化数据会同步更新。
 *
 * 字段前带 [必改] 的是上线前必须替换成你自己公司信息的内容。
 * ===========================================================================
 */

/** @typedef {'zh' | 'en'} Lang */

export const siteConfig = {
  /* ---------------------------------------------------------------------
   * 1. 域名与站点
   * ------------------------------------------------------------------- */
  // 正式域名（结尾不要带 /）
  // ⚠️ 目前先用 Cloudflare Pages 分配的地址。绑定自定义域名后，把这里改成
  //    你自己的域名（例如 https://lvqingqii.xj18.cc）并重新构建即可。
  //
  // 也可以用环境变量覆盖，不必改代码（适合两个平台分别构建的场景）：
  //    SITE_URL=https://lvqingqii.xj18.cc pnpm build
  url:
    (typeof process !== 'undefined' && process.env?.SITE_URL?.replace(/\/+$/, '')) ||
    'https://lvqingqii-guanwang.pages.dev',

  // 是否允许搜索引擎收录。上线前建议先设为 false，内容确认后再改 true 并重新构建。
  indexingEnabled: true,

  /* ---------------------------------------------------------------------
   * 2. 品牌与主体信息
   * ------------------------------------------------------------------- */
  brand: {
    // [必改] 中文公司全称（用于页脚版权、结构化数据、备案信息）
    legalNameZh: '东莞市××滤清器设备有限公司',
    // [必改] 中文品牌简称（用于页头 Logo 旁文字、标题）
    shortNameZh: '××滤清',
    // [必改] 英文品牌名（用于英文站、Logo 副标）
    shortNameEn: 'XXFILTER',
    // [必改] 英文公司全称
    legalNameEn: 'XX Filter Equipment Co., Ltd.',
    // [必改] Logo 图形文字（1–3 个字符，作为占位 Logo 显示；替换为真实 Logo 后可忽略）
    logoMark: 'XX',
    // 品牌主张（中文）
    taglineZh: '正品授权 · 现货直供 · 选型无忧',
    // 品牌主张（英文）
    taglineEn: 'Authorized Genuine Parts · In-Stock Supply · Expert Fitment',
    // [必改] 一句话定位，用于首页副标题与 meta description
    positioningZh:
      '富滤盛（FILTERSUN）授权代理服务商，专注工程机械、商用车、空压机与工业滤清器的正品供应与选型支持。',
    positioningEn:
      'Authorized distributor of FILTERSUN filtration products for construction machinery, commercial vehicles, air compressors and industrial applications.',
  },

  /* ---------------------------------------------------------------------
   * 3. 被代理的厂家（用于「授权代理 / 品牌实力」板块）
   * ------------------------------------------------------------------- */
  principal: {
    nameZh: '富滤盛集团 · 富滤盛滤清器（东莞）有限公司',
    nameEn: 'FILTERSUN Group · Filtersun Filter (Dongguan) Co., Ltd.',
    brands: ['富滤盛', 'FILTERSUN'],
    officialSite: 'https://filtersun.cn',
    founded: 2005,
    // 下列数字来自厂家公开资料，可保留；如你只代理部分品类请自行删减
    facts: {
      yearsExperience: 20,
      skuCount: 9000,
      patents: 100,
      exportCountries: 70,
      plantAreaSqm: 85000,
      agencyCountries: 28,
    },
    certifications: [
      'IATF 16949:2016',
      'ISO 9001:2015',
      'ISO 14001:2015',
      'ISO 45001:2018',
      'TÜV · GMC 中国出口优质供应商',
    ],
    basesZh: [
      '广东东莞 · 集团总部 / 生产基地',
      '江苏宿迁 · 华东生产基地',
      '湖北大悟 · 精密智造产业园',
    ],
    basesEn: [
      'Dongguan, Guangdong · HQ & main plant',
      'Suqian, Jiangsu · East China plant',
      'Dawu, Hubei · Precision manufacturing park',
    ],
  },

  /* ---------------------------------------------------------------------
   * 4. 联系方式
   * ------------------------------------------------------------------- */
  contact: {
    // [必改] 主要销售热线（会显示在页头、悬浮按钮、所有 CTA）
    salesPhone: '139 2641 0788',
    // 座机 / 固话（显示在联系方式区，可为空）
    landline: '020-82199699',
    // [必改] 备用/技术热线
    techPhone: '139 2641 0788',
    // [必改] 微信号（默认取手机号，请改成你实际的微信号）
    wechatId: '13926410788',
    // [必改] WhatsApp 国际格式，不带 + 号
    whatsapp: '8613926410788',
    // 业务邮箱
    email: '13926410788@163.com',
    // 售后邮箱（与业务邮箱相同；有独立售后邮箱时替换）
    serviceEmail: '13926410788@163.com',
    // [必改] 办公地址
    addressZh: '广州市天河区珠吉路科珠工程机械市场 B09-10',
    addressEn: 'B09-10, Kezhu Construction Machinery Market, Zhuji Road, Tianhe District, Guangzhou, China',
    // [必改] 仓库地址（如与办公地址相同可留空，留空则不显示）
    warehouseZh: '',
    warehouseEn: '',
    // [必改] 工作时间
    hoursZh: '周一至周六 08:30 – 18:00',
    hoursEn: 'Mon – Sat, 08:30 – 18:00 (GMT+8)',
    // 腾讯地图 / 高德地图坐标（用于联系我们页面地图与结构化数据）
    // ⚠️ 目前为科珠工程机械市场的大致位置，请用你的实际坐标替换（高德拾取坐标工具）
    geo: { lat: 23.1353, lng: 113.4127 },
  },

  /* ---------------------------------------------------------------------
   * 5. 备案与合规（部署到 EdgeOne 香港节点可免备案，此处留空即可隐藏）
   * ------------------------------------------------------------------- */
  compliance: {
    // [必改] 若绑定国内节点/域名需填写；香港节点可留空字符串
    icpZh: '',
    // [必改] 公安备案号，可留空
    policeZh: '',
    // 版权起始年份
    since: 2015,
  },

  /* ---------------------------------------------------------------------
   * 6. 表单提交
   * ------------------------------------------------------------------- */
  forms: {
    /**
     * [必改] 询价表单的接收地址。三种选择：
     *   1) 留空 '' —— 表单会退化为「打开邮件客户端 + 显示电话/微信」，零后端可用；
     *   2) 填写你自己的 EdgeOne 边缘函数地址，如 '/api/inquiry'
     *      （仓库内已附 functions/api/inquiry.js 示例，见 README「表单接入」）；
     *   3) 填写第三方表单服务地址（Formspree / Getform / 飞书多维表格 Webhook 等）。
     */
    endpoint: '',
    /** 提交成功后的跳转页（留空则原地显示成功提示） */
    successPath: '',
  },

  /* ---------------------------------------------------------------------
   * 7. 件号详情页生成策略
   * ------------------------------------------------------------------- */
  /**
   * 决定哪些件号会生成独立的详情页（/p/<件号>/）。件号本身无论是否生成详情页，
   * 都会进入「件号查询」数据库与大类清单表，客户始终能搜到。
   *
   *   'complete'  有实物图 **或** 有规格尺寸的件号才生成（推荐）
   *               —— 页面有实质内容，利于收录，文件数适中
   *   'withImage' 只有带实物图的件号才生成（页面最少、构建最快）
   *   'all'       全部件号都生成（页面最多，注意部署平台单次部署文件数上限：
   *               Cloudflare Pages 免费版 20000 个文件、EdgeOne Pages 请查阅最新配额）
   */
  productPagePolicy: 'complete',

  /* ---------------------------------------------------------------------
   * 8. 站长验证 / 统计（按需填写，留空则输出中不包含对应标签）
   * ------------------------------------------------------------------- */
  verification: {
    google: '',
    bing: '',
    baidu: '',
    // 腾讯云 EdgeOne 的站点验证值（如有）
    tencent: '',
  },

  /* ---------------------------------------------------------------------
   * 9. 主推品类（首页产品矩阵按此顺序展示，slug 见 src/data/groups.mjs）
   * ------------------------------------------------------------------- */
  featuredGroups: [
    'construction',
    'truck',
    'compressor',
    'hydraulic',
    'industrial',
    'purifier',
  ],

  /* ---------------------------------------------------------------------
   * 10. 服务承诺（首页「为什么选择我们」区块）
   * ------------------------------------------------------------------- */
  promisesZh: [
    { title: '原厂正品', desc: '厂家直供渠道，可提供授权文件与批次溯源，杜绝翻新与仿冒。' },
    { title: '现货充足', desc: '常规机型备货 3000+ 件号，当天 16:00 前下单当日发出。' },
    { title: '选型支持', desc: '提供件号 / 机型 / 尺寸三向查询，拍张旧滤芯照片也能帮你对上号。' },
    { title: '技术支持', desc: '工程师协助判断故障原因，避免「换了滤芯还是报故障」的反复。' },
    { title: '质保无忧', desc: '产品由中国太平洋保险公司承保产品责任险，质量问题包退包换。' },
    { title: '跨境履约', desc: '支持出口报关、海运空运与多币种结算，服务海外 70+ 国家客户。' },
  ],
  promisesEn: [
    { title: 'Genuine Only', desc: 'Direct factory channel with authorization documents and batch traceability.' },
    { title: 'In-Stock Supply', desc: '3,000+ part numbers stocked. Orders before 16:00 ship the same day.' },
    { title: 'Fitment Support', desc: 'Part number, machine model or dimension — even a photo of your old filter works.' },
    { title: 'Technical Backup', desc: 'Engineers help diagnose root causes, not just replace the filter.' },
    { title: 'Warranty Covered', desc: 'Product liability insured by CPIC. Defective items replaced without argument.' },
    { title: 'Export Ready', desc: 'Customs clearance, sea/air freight and multi-currency settlement for 70+ countries.' },
  ],
}

export default siteConfig

