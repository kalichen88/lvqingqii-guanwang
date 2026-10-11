/**
 * 产品大类与细分品类 / Product taxonomy
 * ---------------------------------------------------------------------------
 * 这里不照搬厂家的分类树，而是按「客户采购视角」重组为 8 个大类，
 * 每个大类对应一个独立落地页（利于 SEO 与投放定向）。
 *
 * catids 对应爬虫抓取的厂家分类 id（见 scripts/crawl-catalog.mjs），
 * 用于把产品数据归入正确的大类。
 */

export const groups = [
  {
    slug: 'construction',
    no: '01',
    nameZh: '工程机械滤清器',
    nameEn: 'Construction Machinery Filters',
    shortZh: '工程机械',
    shortEn: 'Construction',
    taglineZh: '挖机、装载机、旋挖钻机的全车滤芯方案',
    taglineEn: 'Complete filter sets for excavators, loaders and drill rigs',
    descZh:
      '覆盖小松、卡特、日立、神钢、沃尔沃、三一、徐工、柳工等 40 余个主流品牌机型的空气、机油、柴油、液压、先导、水滤全系列滤芯，按原厂 OE 标准选材，进气压损与容尘量对标原厂件。',
    descEn:
      'Air, lube, fuel, hydraulic, pilot and water filters for 40+ mainstream machine brands including Komatsu, Caterpillar, Hitachi, Kobelco, Volvo, SANY, XCMG and LiuGong — built to original OE specifications.',
    catids: [90, 92, 93],
    icon: 'excavator',
    image: '/media/categories/cp1.jpg',
    highlightsZh: ['按机型一键匹配', '空气/液压/燃油全车系', '常用件号现货备货'],
    highlightsEn: ['Match by machine model', 'Full air / hydraulic / fuel range', 'Fast-moving parts in stock'],
    applications: ['excavator', 'loader', 'crane', 'drill'],
  },
  {
    slug: 'truck',
    no: '02',
    nameZh: '商用车滤清器',
    nameEn: 'Commercial Vehicle Filters',
    shortZh: '商用车',
    shortEn: 'Trucks',
    taglineZh: '重卡、客车、物流车队的降本之选',
    taglineEn: 'Cost-efficient filtration for heavy trucks and bus fleets',
    descZh:
      '适配国五/国六排放平台的重卡、客车、工程自卸车，提供机油、柴油、空气、空调及天然气/尿素滤芯。针对车队客户提供按里程的保养套餐与集中配送。',
    descEn:
      'Lube, fuel, air, cabin and CNG/urea filters for China V/VI heavy trucks, buses and tippers. Fleet customers get mileage-based service kits and consolidated delivery.',
    catids: [171],
    icon: 'truck',
    image: '/media/categories/cp2.jpg',
    highlightsZh: ['国五/国六全平台', '车队保养套餐', '按里程配货'],
    highlightsEn: ['China V / VI platforms', 'Fleet service kits', 'Mileage-based supply'],
    applications: ['truck', 'bus', 'fleet'],
  },
  {
    slug: 'compressor',
    no: '03',
    nameZh: '空压机滤清器',
    nameEn: 'Air Compressor Filters',
    shortZh: '空压机',
    shortEn: 'Compressor',
    taglineZh: '螺杆机三滤一站配齐',
    taglineEn: 'Air, oil and separator — the complete screw compressor kit',
    descZh:
      '螺杆空压机空气滤芯、油气分离滤芯、机油滤芯及精密/EL 系列滤芯，适配阿特拉斯、寿力、英格索兰、复盛等主流机型，油气分离效率与压差表现稳定。',
    descEn:
      'Air filters, oil separators, oil filters plus precision and EL-series elements for Atlas Copco, Sullair, Ingersoll Rand, Fusheng and more — stable separation efficiency and pressure drop.',
    catids: [105, 102],
    icon: 'compressor',
    image: '/media/categories/cp6.jpg',
    highlightsZh: ['油气分离效率稳定', '三滤成套供应', '压差与能耗可控'],
    highlightsEn: ['Stable separation efficiency', 'Complete 3-filter kits', 'Controlled pressure drop'],
    applications: ['compressor', 'pneumatic'],
  },
  {
    slug: 'hydraulic',
    no: '04',
    nameZh: '液压油滤芯',
    nameEn: 'Hydraulic Oil Filters',
    shortZh: '液压滤芯',
    shortEn: 'Hydraulic',
    taglineZh: '高清洁度液压系统的最后一道防线',
    taglineEn: 'The last line of defence for high-cleanliness hydraulics',
    descZh:
      '泵车、注塑机、机床、冶金与船舶液压系统的吸油、回油、压力管路滤芯，提供 3–25 μm 多档过滤精度，支持按图纸与样品定制。',
    descEn:
      'Suction, return and pressure-line elements for concrete pumps, injection moulding machines, metallurgy and marine hydraulics — 3–25 μm ratings, custom builds from drawing or sample.',
    catids: [167, 113],
    icon: 'hydraulic',
    image: '/media/categories/cp16.jpg',
    highlightsZh: ['3–25 μm 多精度可选', '支持图纸/样品定制', '高纳污量长寿命'],
    highlightsEn: ['3–25 μm options', 'Custom from drawing or sample', 'High dirt-holding capacity'],
    applications: ['concrete-pump', 'injection', 'machine-tool', 'metallurgy'],
  },
  {
    slug: 'industrial',
    no: '05',
    nameZh: '工业与精密滤芯',
    nameEn: 'Industrial & Precision Elements',
    shortZh: '工业滤芯',
    shortEn: 'Industrial',
    taglineZh: '线切割、火花机、喷涂回收、高流量过滤',
    taglineEn: 'EDM, spark erosion, powder recovery and high-flow filtration',
    descZh:
      '线切割机水滤芯、电火花机油滤芯、喷涂粉末回收滤芯、高流量滤芯、铜烧结与盘片滤芯，以及非标异型滤清器定制。',
    descEn:
      'Wire-cut water filters, EDM oil filters, powder-coating recovery cartridges, high-flow elements, sintered bronze and disc filters, plus custom non-standard designs.',
    catids: [106, 107, 111, 116],
    icon: 'precision',
    image: '/media/categories/cp4.jpg',
    highlightsZh: ['非标定制能力强', '耐高温/耐腐蚀选材', '小批量也可接单'],
    highlightsEn: ['Strong custom capability', 'High-temp / corrosion-resistant media', 'Low MOQ accepted'],
    applications: ['edm', 'coating', 'machine-tool', 'chemical'],
  },
  {
    slug: 'purifier',
    no: '06',
    nameZh: '净化与新风滤芯',
    nameEn: 'Purification & Air Filters',
    shortZh: '净化滤芯',
    shortEn: 'Purification',
    taglineZh: '从车间除尘到洁净新风',
    taglineEn: 'From workshop dust control to clean fresh air',
    descZh:
      '新风净化滤芯、初/中/高效空气隔尘网、纯水过滤、吸尘器与扫地机滤芯、电动送风口罩滤芯，覆盖 G4–H13 效率等级。',
    descEn:
      'Fresh-air purifier cartridges, G4–H13 pre/medium/HEPA panels, water filtration, vacuum and sweeper filters, and powered-respirator cartridges.',
    catids: [109, 110, 103],
    icon: 'air',
    image: '/media/categories/cp5.jpg',
    highlightsZh: ['G4–H13 全效率段', '可清洗/可更换结构', '批量交期稳定'],
    highlightsEn: ['G4–H13 coverage', 'Washable or replaceable', 'Reliable lead times'],
    applications: ['cleanroom', 'hvac', 'coating', 'vacuum'],
  },
  {
    slug: 'separator',
    no: '07',
    nameZh: '油水分离器与配件',
    nameEn: 'Water Separators & Parts',
    shortZh: '油水分离',
    shortEn: 'Separators',
    taglineZh: '总成、滤芯、底座、传感器一站配齐',
    taglineEn: 'Assemblies, elements, heads and sensors in one place',
    descZh:
      '柴油油水分离器总成与滤芯、滤清器底座、集水杯、油格扳手、柴油滤网、浮子式水位传感器等通用易损件，解决「只差一个小件停产」的尴尬。',
    descEn:
      'Diesel water-separator assemblies and elements, filter heads, sediment bowls, filter wrenches, strainers and float-type water sensors — the small parts that stop a line.',
    catids: [94, 95],
    icon: 'separator',
    image: '/media/categories/cp10.jpg',
    highlightsZh: ['总成+配件齐套', '通用件兼容性好', '小件也能单发'],
    highlightsEn: ['Assembly + parts together', 'Wide cross-compatibility', 'Single-piece shipping'],
    applications: ['truck', 'genset', 'marine'],
  },
  {
    slug: 'genset',
    no: '08',
    nameZh: '发电机与农机滤芯',
    nameEn: 'Genset & Agricultural Filters',
    shortZh: '发电机/农机',
    shortEn: 'Genset & Agri',
    taglineZh: '发电机组、割草机、摩托车、游艇',
    taglineEn: 'Generator sets, mowers, motorcycles and yachts',
    descZh:
      '柴油发电机组三滤、割草机滤芯、摩托车滤芯、游艇与船用滤芯，适配康明斯、帕金斯、久保田、洋马等动力平台。',
    descEn:
      'Three-filter sets for diesel gensets plus mower, motorcycle, yacht and marine filters for Cummins, Perkins, Kubota, Yanmar and similar power platforms.',
    catids: [91, 101, 99],
    icon: 'genset',
    image: '/media/categories/cp15.jpg',
    highlightsZh: ['常用动力平台全覆盖', '出口包装可选', '成套报价更快'],
    highlightsEn: ['All common power platforms', 'Export packaging available', 'Fast kit quotations'],
    applications: ['genset', 'agriculture', 'marine', 'moto'],
  },
]

/** slug -> group */
export const groupBySlug = Object.fromEntries(groups.map((g) => [g.slug, g]))

/** catid -> slug */
export const groupByCatid = (() => {
  const m = {}
  for (const g of groups) for (const id of g.catids) m[id] = g.slug
  return m
})()

/**
 * 产品类型（厂家分类名）中英对照
 * 未收录的类型会自动回退为中文原文，可在抓到新数据后补充。
 */
export const typeI18n = {
  空气滤芯: 'Air Filter',
  '空气滤芯系列': 'Air Filter Series',
  空调滤芯: 'Cabin / AC Filter',
  液压回油滤芯: 'Hydraulic Return Filter',
  旋装机油滤芯: 'Spin-on Lube Filter',
  旋装柴油滤芯: 'Spin-on Fuel Filter',
  旋装液压滤: 'Spin-on Hydraulic Filter',
  旋装先导滤芯: 'Spin-on Pilot Filter',
  旋装管路滤: 'Spin-on Line Filter',
  水滤芯: 'Water Filter',
  铜网滤芯: 'Brass Mesh Filter',
  先导滤芯: 'Pilot Filter',
  纸质柴油滤芯: 'Paper Fuel Element',
  纸质机油滤芯: 'Paper Lube Element',
  '油滤芯、油水分离滤芯': 'Oil & Water-Separator Element',
  泵车液压油滤芯: 'Concrete-Pump Hydraulic Element',
  油滤芯: 'Oil Filter Element',
  '油滤芯系列': 'Oil Filter Series',
  油气分离滤芯: 'Oil–Air Separator Element',
  精密滤芯系列: 'Precision Filter Series',
  EL系列精密滤芯: 'EL-Series Precision Element',
  火花机油滤芯: 'EDM Oil Filter',
  注塑机吸油滤网: 'Injection Moulding Suction Strainer',
  超精密油滤芯: 'Ultra-Precision Oil Element',
  注塑机液压油滤芯: 'Injection Moulding Hydraulic Element',
  油水分离器系列: 'Water Separator Series',
  '柴油/机油格底座': 'Fuel / Lube Filter Head',
  通用易损件系列: 'General Wear Parts',
  '集水杯(油杯)': 'Sediment Bowl',
  油格扳手系列: 'Filter Wrench Series',
  柴油滤网: 'Diesel Strainer',
  浮子式水位传感器: 'Float-Type Water Sensor',
  异型滤清器: 'Custom-Shape Filter',
  铜烧结滤芯: 'Sintered Bronze Element',
  盘片滤芯: 'Disc Filter Element',
  塑料机械用滤芯: 'Plastic Machinery Element',
  液压油滤芯: 'Hydraulic Oil Element',
  机油滤清器: 'Lube Oil Filter',
  柴油滤清器: 'Fuel Filter',
  空气滤清器: 'Air Filter',
  空调滤清器: 'Cabin Air Filter',
  '天然汽、尿素滤芯': 'CNG / Urea Filter',
  金属框高效隔层网: 'Metal-Frame HEPA Panel',
  板式粗效率隔层网: 'Panel Pre-Filter',
  袋式中效率隔层网: 'Bag Medium Filter',
  折叠式中效率隔层网: 'Pleated Medium Filter',
  喷涂粉末回收滤芯: 'Powder Recovery Cartridge',
  油水分离器: 'Water Separator',
  空滤总成: 'Air Cleaner Assembly',
  纯水过滤器: 'Water Purifier Filter',
  线切割机水滤芯: 'Wire-Cut Water Filter',
  注塑机吸油滤网: 'Injection Moulding Suction Strainer',
  叉车空气滤芯: 'Forklift Air Filter',
  叉车油滤芯: 'Forklift Oil Filter',
  工程汽车空气滤芯: 'Vehicle Air Filter',
  工程汽车油滤芯: 'Vehicle Oil Filter',
  工程汽车旋装机油滤芯: 'Vehicle Spin-on Lube Filter',
  工程汽车旋装柴油滤芯: 'Vehicle Spin-on Fuel Filter',
  商用车机油滤清器: 'Truck Lube Filter',
  商用车柴油滤清器: 'Truck Fuel Filter',
  商用车空气滤清器: 'Truck Air Filter',
  商用车空调滤清器: 'Truck Cabin Filter',
  空压机空气滤芯: 'Compressor Air Filter',
  空压机旋装机油滤芯: 'Compressor Spin-on Oil Filter',
  发电机空气滤芯: 'Genset Air Filter',
  '发电机油滤芯/油水分离': 'Genset Oil & Water-Separator Element',
  发电机旋装机油滤芯: 'Genset Spin-on Lube Filter',
  发电机旋装柴油滤芯: 'Genset Spin-on Fuel Filter',
  割草机滤芯: 'Mower Filter',
  摩托车滤芯: 'Motorcycle Filter',
  游艇滤芯: 'Marine Filter',
  扫地机吸尘器滤芯: 'Vacuum & Sweeper Filter',
  电动口罩滤芯: 'Powered Respirator Filter',
  高流量滤芯: 'High-Flow Element',
  水滤芯: 'Water Filter',
}

/** 把产品类型翻成英文（找不到就回退） */
export const typeEn = (zh) => typeI18n[zh] ?? zh
