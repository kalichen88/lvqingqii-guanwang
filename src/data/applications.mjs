/**
 * 应用领域 / Industries
 * ---------------------------------------------------------------------------
 * 每个领域生成独立落地页（/applications/<slug>/），是承接 Google / 百度
 * 「某机型滤芯」类搜索的主要着陆页，也是投放定向页。
 *
 * groups 字段指明该领域主要用到的产品大类（对应 groups.mjs 的 slug）。
 */

export const applications = [
  {
    slug: 'excavator',
    nameZh: '挖掘机与土方机械',
    nameEn: 'Excavators & Earthmoving',
    shortZh: '挖掘机',
    shortEn: 'Excavators',
    icon: 'excavator',
    image: '/media/applications/yy_13.jpg',
    leadZh: '进气脏、液压油温高、油耗上升，往往都是滤芯先出了问题。',
    leadEn: 'Dirty intake air, hot hydraulic oil and rising fuel use usually start with the filter.',
    descZh:
      '挖掘机在粉尘、高温、重载的工况下连续作业，空气滤芯的容尘量与液压滤芯的纳污量直接决定大修周期。我们按机型提供全套滤芯，并对易堵塞的先导滤芯、回油滤芯给出更换周期建议。',
    descEn:
      'Excavators run continuously in dust, heat and heavy load. Air-filter dust capacity and hydraulic dirt-holding capacity directly determine overhaul intervals. We supply complete per-model sets and advise realistic change intervals for pilot and return filters.',
    groups: ['construction', 'hydraulic'],
    pointsZh: [
      '按机型（小松 PC / 卡特 320 / 三一 SY 等）成套配货',
      '外层粗滤 + 内层精滤双层结构，容尘量更大',
      '先导滤芯、回油滤芯按工况给出更换周期',
    ],
    pointsEn: [
      'Complete kits by model (Komatsu PC, CAT 320, SANY SY …)',
      'Dual-layer coarse + fine media for higher dust capacity',
      'Change intervals advised by actual working condition',
    ],
  },
  {
    slug: 'loader',
    nameZh: '装载机与铲运设备',
    nameEn: 'Loaders & Wheel Loaders',
    shortZh: '装载机',
    shortEn: 'Loaders',
    icon: 'loader',
    image: '/media/applications/yy_12.jpg',
    leadZh: '粉尘最重的工况，最考验空气滤芯。',
    leadEn: 'The dustiest duty cycle — and the hardest test for an air filter.',
    descZh:
      '砂石料场、搅拌站、矿山装卸的装载机常年高粉尘作业。我们提供高容尘量空气滤芯与加强型油滤，并可按班次粉尘浓度调整保养间隔。',
    descEn:
      'Loaders in quarries, batching plants and mines work in permanent dust. We supply high-capacity air filters and reinforced oil filters, with service intervals tuned to shift-level dust concentration.',
    groups: ['construction'],
    pointsZh: ['高容尘量空气滤芯', '安全滤芯（内芯）成套供应', '按粉尘浓度定制保养间隔'],
    pointsEn: ['High dust-holding air filters', 'Safety inner elements supplied together', 'Intervals tuned to dust load'],
  },
  {
    slug: 'crane',
    nameZh: '起重机与高空作业',
    nameEn: 'Cranes & Aerial Platforms',
    shortZh: '起重机',
    shortEn: 'Cranes',
    icon: 'crane',
    image: '/media/applications/y2_05.jpg',
    leadZh: '液压系统一旦污染，代价是整机停工。',
    leadEn: 'Once the hydraulic system is contaminated, the whole machine stops.',
    descZh:
      '汽车吊、履带吊、高空作业车的液压系统对油液清洁度要求高。我们提供多精度等级的液压滤芯与油水分离方案，配合定期取样检测建议，把污染度控制在目标区间。',
    descEn:
      'Truck cranes, crawler cranes and aerial platforms demand high hydraulic cleanliness. We supply multi-rating hydraulic elements and water-separation solutions, plus oil-sampling advice to keep contamination within target.',
    groups: ['hydraulic', 'construction'],
    pointsZh: ['3–25 μm 多精度可选', '吸油/回油/压力管路全覆盖', '可提供油液取样与污染度建议'],
    pointsEn: ['3–25 μm ratings', 'Suction, return and pressure lines', 'Oil sampling and cleanliness advice'],
  },
  {
    slug: 'drill',
    nameZh: '旋挖钻与桩工机械',
    nameEn: 'Piling & Drilling Rigs',
    shortZh: '旋挖钻',
    shortEn: 'Piling Rigs',
    icon: 'drill',
    image: '/media/applications/yy_14.jpg',
    leadZh: '连续成孔作业，靠的就是油液和进气都干净。',
    leadEn: 'Continuous boring depends on clean oil and clean intake air.',
    descZh:
      '旋挖钻机、连续墙设备长时间连续作业，液压系统发热大、粉尘侵入快。我们提供大流量回油滤芯与高容尘空气滤芯，并按项目工期预备备件包。',
    descEn:
      'Rotary drilling rigs and diaphragm-wall machines run long continuous shifts with heavy hydraulic heating and fast dust ingress. We supply high-flow return elements and high-capacity air filters, plus project-duration spare kits.',
    groups: ['hydraulic', 'construction'],
    pointsZh: ['大流量回油滤芯', '项目备件包按工期配货', '可提供现场更换指导'],
    pointsEn: ['High-flow return elements', 'Project spare kits sized to schedule', 'On-site change guidance'],
  },
  {
    slug: 'truck',
    nameZh: '重卡与干线物流',
    nameEn: 'Heavy Trucks & Logistics',
    shortZh: '重卡物流',
    shortEn: 'Truck Fleets',
    icon: 'truck',
    image: '/media/applications/yy_12.jpg',
    leadZh: '车队最在意的不是单价，是每公里成本。',
    leadEn: 'For a fleet, cost per kilometre beats unit price every time.',
    descZh:
      '国五/国六重卡对燃油清洁度与尿素品质敏感。我们按车型和运行里程配置机油、柴油、空气、空调四滤套餐，支持多车队长途线路的集中配送与月度结算。',
    descEn:
      'China V/VI trucks are sensitive to fuel cleanliness and urea quality. We build lube, fuel, air and cabin filter kits by model and mileage, with consolidated delivery and monthly settlement for long-haul fleets.',
    groups: ['truck', 'separator'],
    pointsZh: ['国五/国六全平台适配', '按里程定制保养套餐', '车队集中配送 + 月结'],
    pointsEn: ['China V / VI coverage', 'Mileage-based service kits', 'Consolidated delivery & monthly billing'],
  },
  {
    slug: 'bus',
    nameZh: '客车与公共交通',
    nameEn: 'Buses & Public Transport',
    shortZh: '客车公交',
    shortEn: 'Buses',
    icon: 'bus',
    image: '/media/applications/yy_05.jpg',
    leadZh: '车厢空气，乘客的第一感受。',
    leadEn: 'Cabin air is the first thing passengers notice.',
    descZh:
      '公交、客运、旅游大巴的空调滤芯关系到车内空气质量。我们提供含活性炭与抗菌层的空调滤芯，同时配套发动机四滤，方便车队一次性采购。',
    descEn:
      'Cabin filters decide onboard air quality for city buses, coaches and tour vehicles. We supply activated-carbon and antibacterial cabin filters alongside engine filter sets, so fleets order once.',
    groups: ['truck', 'purifier'],
    pointsZh: ['活性炭 / 抗菌层空调滤芯', '发动机四滤一次配齐', '适合车队批量采购'],
    pointsEn: ['Carbon and antibacterial cabin filters', 'Full engine filter sets', 'Built for fleet batch orders'],
  },
  {
    slug: 'compressor',
    nameZh: '空气压缩系统',
    nameEn: 'Compressed Air Systems',
    shortZh: '空压机',
    shortEn: 'Compressors',
    icon: 'compressor',
    image: '/media/applications/y2_07.jpg',
    leadZh: '油气分离器压差每上升 0.1 bar，电费就跟着涨。',
    leadEn: 'Every 0.1 bar of extra separator pressure drop shows up on the power bill.',
    descZh:
      '螺杆空压机的三滤（空气、机油、油气分离）决定排气含油量与能耗。我们按机型提供成套三滤，并建议按压差而非固定周期更换油气分离器。',
    descEn:
      'The three filters on a screw compressor — air, oil and separator — set both oil carry-over and energy use. We supply matched kits by model and recommend replacing separators on pressure drop rather than a fixed calendar.',
    groups: ['compressor'],
    pointsZh: ['三滤成套，压差表现稳定', '按机型（阿特拉斯/寿力/英格索兰等）配货', '提供压差更换判据'],
    pointsEn: ['Matched kits, stable pressure drop', 'By model — Atlas Copco, Sullair, Ingersoll Rand …', 'Pressure-drop based replacement criteria'],
  },
  {
    slug: 'concrete-pump',
    nameZh: '泵车与混凝土机械',
    nameEn: 'Concrete Pumps & Machinery',
    shortZh: '泵车',
    shortEn: 'Concrete Pumps',
    icon: 'pump',
    image: '/media/applications/yy_13.jpg',
    leadZh: '泵送系统一停，整条浇筑线都要等。',
    leadEn: 'If the pump stops, the whole pour waits.',
    descZh:
      '泵车、搅拌车、搅拌站的液压与润滑系统过滤需求明确。我们提供泵车液压油滤芯、搅拌车滤芯与搅拌站除尘滤芯，并常备高频件号。',
    descEn:
      'Concrete pumps, mixer trucks and batching plants have well-defined hydraulic and lubrication filtration needs. We stock pump hydraulic elements, mixer filters and batching-plant dust cartridges — the fast movers always on the shelf.',
    groups: ['hydraulic', 'industrial'],
    pointsZh: ['高频件号常备现货', '耐高压差结构', '可配套搅拌站除尘滤芯'],
    pointsEn: ['Fast movers always in stock', 'High differential-pressure construction', 'Batching-plant dust cartridges too'],
  },
  {
    slug: 'injection',
    nameZh: '注塑与塑料机械',
    nameEn: 'Injection Moulding & Plastics',
    shortZh: '注塑机',
    shortEn: 'Injection Moulding',
    icon: 'injection',
    image: '/media/applications/y2_12.jpg',
    leadZh: '液压阀卡滞，多半是油太脏。',
    leadEn: 'Sticking hydraulic valves are almost always dirty oil.',
    descZh:
      '注塑机的比例阀、伺服阀对油液清洁度极敏感。我们提供吸油滤网、超精密油滤芯与回油滤芯，提供 3–10 μm 精度选择，减少阀件维修。',
    descEn:
      'Proportional and servo valves in injection moulding machines are highly sensitive to oil cleanliness. We supply suction strainers, ultra-precision elements and return filters in 3–10 μm ratings to cut valve repairs.',
    groups: ['hydraulic', 'industrial'],
    pointsZh: ['3–10 μm 超精密过滤', '吸油滤网 / 回油滤芯 / 精密滤芯全套', '支持按样品与图纸定制'],
    pointsEn: ['3–10 μm ultra-precision', 'Strainers, return and precision elements', 'Custom from sample or drawing'],
  },
  {
    slug: 'machine-tool',
    nameZh: '数控机床与电加工',
    nameEn: 'CNC & Electrical Discharge Machining',
    shortZh: '线切割/火花机',
    shortEn: 'EDM & Wire Cut',
    icon: 'precision',
    image: '/media/applications/y2_12.jpg',
    leadZh: '水浊了、油脏了，加工精度就守不住。',
    leadEn: 'Cloudy water and dirty oil cost you accuracy.',
    descZh:
      '线切割机水滤芯、电火花机油滤芯、加工中心切削液过滤，直接影响加工表面质量与电极损耗。我们提供多规格过滤精度与耐腐蚀选材。',
    descEn:
      'Wire-cut water filters, EDM oil filters and coolant filtration directly affect surface finish and electrode wear. We offer multiple micron ratings and corrosion-resistant media options.',
    groups: ['industrial'],
    pointsZh: ['多规格过滤精度', '耐腐蚀滤材可选', '小批量、多规格也可接单'],
    pointsEn: ['Multiple micron ratings', 'Corrosion-resistant media', 'Small batches and mixed specs accepted'],
  },
  {
    slug: 'genset',
    nameZh: '柴油发电机组',
    nameEn: 'Diesel Generator Sets',
    shortZh: '发电机组',
    shortEn: 'Gensets',
    icon: 'genset',
    image: '/media/applications/yy_14.jpg',
    leadZh: '备用电源，最怕需要时不启动。',
    leadEn: 'Backup power is worthless if it will not start.',
    descZh:
      '数据中心、医院、工地的柴油发电机组长期待机，燃油品质与滤芯状态决定能否可靠启动。我们提供康明斯、帕金斯、久保田、洋马等平台的成套三滤。',
    descEn:
      'Data-centre, hospital and site gensets sit idle for long periods — fuel quality and filter condition decide whether they start. We supply matched filter sets for Cummins, Perkins, Kubota, Yanmar and more.',
    groups: ['genset', 'separator'],
    pointsZh: ['常用动力平台全覆盖', '成套三滤 + 油水分离器', '出口包装与认证文件可选'],
    pointsEn: ['All common power platforms', 'Filter sets plus water separators', 'Export packing and documents available'],
  },
  {
    slug: 'cleanroom',
    nameZh: '洁净室与中央空调',
    nameEn: 'Cleanrooms & HVAC',
    shortZh: '洁净室/新风',
    shortEn: 'Cleanroom & HVAC',
    icon: 'air',
    image: '/media/applications/y2_14.jpg',
    leadZh: '从 G4 到 H13，效率等级要配得刚刚好。',
    leadEn: 'From G4 to H13 — the right efficiency at the right stage.',
    descZh:
      '新风机、中央空调、无尘车间、医药化工与喷涂车间的空气过滤，需要按效率等级逐级配置。我们提供初效、中效、高效过滤网与净化滤芯，并给出阻力与更换周期建议。',
    descEn:
      'Fresh-air units, central HVAC, cleanrooms, pharma and coating booths need staged filtration by efficiency class. We supply pre, medium and HEPA panels plus purifier cartridges, with pressure-drop and change-cycle guidance.',
    groups: ['purifier', 'industrial'],
    pointsZh: ['G4–H13 全效率段', '金属框 / 袋式 / 折叠式可选', '可清洗结构降低长期成本'],
    pointsEn: ['G4–H13 full range', 'Metal-frame, bag or pleated', 'Washable options to cut lifetime cost'],
  },
  {
    slug: 'agriculture',
    nameZh: '农业机械',
    nameEn: 'Agricultural Machinery',
    shortZh: '农机',
    shortEn: 'Agriculture',
    icon: 'agriculture',
    image: '/media/applications/yy_20.jpg',
    leadZh: '农忙就那么几天，配件必须当天到。',
    leadEn: 'Harvest season is short — parts must arrive the same day.',
    descZh:
      '拖拉机、收割机、割草机在农忙季节连续作业，停机成本极高。我们按品牌机型提供空气、机油、柴油滤芯与液压滤芯，农忙前可提前备货到经销商仓。',
    descEn:
      'Tractors, harvesters and mowers run flat out in season, and downtime is expensive. We supply air, lube, fuel and hydraulic filters by brand and model, with pre-season stocking to your local warehouse.',
    groups: ['genset', 'construction'],
    pointsZh: ['农忙前预投备货', '割草机/农机专用滤芯', '常用机型现货'],
    pointsEn: ['Pre-season stocking', 'Mower and agri-specific filters', 'Common models in stock'],
  },
  {
    slug: 'coating',
    nameZh: '粉末喷涂与除尘回收',
    nameEn: 'Powder Coating & Dust Recovery',
    shortZh: '喷涂回收',
    shortEn: 'Coating Recovery',
    icon: 'coating',
    image: '/media/applications/y2_13.jpg',
    leadZh: '回收率上不去，粉都跑到滤芯里了。',
    leadEn: 'If recovery is low, your powder is going into the filter.',
    descZh:
      '静电喷涂线的粉末回收滤芯决定回收率与排放。我们提供聚酯、覆膜、防静电等不同滤材的回收滤芯，兼顾回收效率与清灰寿命。',
    descEn:
      'Recovery cartridges on electrostatic coating lines decide both recovery rate and emissions. We offer polyester, PTFE-membrane and anti-static media, balancing capture efficiency against pulse-clean life.',
    groups: ['industrial', 'purifier'],
    pointsZh: ['聚酯 / 覆膜 / 防静电滤材', '端盖密封结构减少漏粉', '按设备型号配尺寸'],
    pointsEn: ['Polyester, membrane, anti-static media', 'Sealed end caps to stop bypass', 'Sized to your equipment'],
  },
  {
    slug: 'marine',
    nameZh: '船舶与游艇',
    nameEn: 'Marine & Yachts',
    shortZh: '船舶游艇',
    shortEn: 'Marine',
    icon: 'marine',
    image: '/media/applications/y2_18.jpg',
    leadZh: '海上没有配件店，出海前就要备足。',
    leadEn: 'There is no parts shop at sea — stock up before you leave.',
    descZh:
      '船用主机、辅机、液压舵机与游艇发动机的滤清器需求，强调耐盐雾与可靠性。我们提供船用滤芯与成套备件包，支持出口报关与海外直发。',
    descEn:
      'Marine main engines, auxiliaries, hydraulic steering and yacht engines demand salt-spray resistance and reliability. We supply marine filters and complete spare kits with export clearance and overseas delivery.',
    groups: ['genset', 'separator', 'hydraulic'],
    pointsZh: ['耐盐雾防腐处理', '出海备件包配置建议', '支持出口报关与海外直发'],
    pointsEn: ['Salt-spray resistant finishes', 'Voyage spare-kit planning', 'Export clearance and direct shipping'],
  },
  {
    slug: 'metallurgy',
    nameZh: '冶金与重工业',
    nameEn: 'Metallurgy & Heavy Industry',
    shortZh: '冶金重工',
    shortEn: 'Metallurgy',
    icon: 'metallurgy',
    image: '/media/applications/y2_03.jpg',
    leadZh: '高温、高压、连续生产，滤芯不能掉链子。',
    leadEn: 'High temperature, high pressure, no stops allowed.',
    descZh:
      '冶金、造纸、化工的液压与润滑系统过滤，需要耐高温滤材与高纳污量结构。我们提供金属网、烧结、盘片等耐用型滤芯。',
    descEn:
      'Hydraulic and lubrication filtration in metallurgy, paper and chemical plants needs high-temperature media and high dirt-holding structures. We supply metal-mesh, sintered and disc elements built to last.',
    groups: ['hydraulic', 'industrial'],
    pointsZh: ['耐高温滤材', '金属网 / 烧结 / 盘片结构', '可清洗重复使用'],
    pointsEn: ['High-temperature media', 'Mesh, sintered and disc types', 'Cleanable and reusable'],
  },
  {
    slug: 'vacuum',
    nameZh: '吸尘与清扫设备',
    nameEn: 'Vacuum & Sweeping Equipment',
    shortZh: '吸尘清扫',
    shortEn: 'Vacuum & Sweeping',
    icon: 'vacuum',
    image: '/media/applications/y2_20.jpg',
    leadZh: '滤芯堵了，吸力就没了。',
    leadEn: 'A clogged filter means no suction.',
    descZh:
      '工业吸尘器、扫地机、洗地机的滤芯与尘隔，直接影响吸力与排放。我们提供褶皱式、袋式与筒式滤芯，可清洗与可更换结构均有。',
    descEn:
      'Filters and dust bags in industrial vacuums, sweepers and scrubbers decide suction and emissions. We supply pleated, bag and cartridge types, in both washable and replaceable constructions.',
    groups: ['purifier', 'industrial'],
    pointsZh: ['褶皱式 / 袋式 / 筒式可选', '可清洗结构', '按设备型号配尺寸'],
    pointsEn: ['Pleated, bag or cartridge', 'Washable options', 'Sized to your machine'],
  },
  {
    slug: 'chemical',
    nameZh: '医药与化工',
    nameEn: 'Pharmaceutical & Chemical',
    shortZh: '医药化工',
    shortEn: 'Pharma & Chemical',
    icon: 'chemical',
    image: '/media/applications/y2_13.jpg',
    leadZh: '腐蚀性介质，普通滤芯撑不住。',
    leadEn: 'Standard filters do not survive corrosive media.',
    descZh:
      '医药、化工、电镀、水处理场景的过滤，需要耐酸碱滤材与洁净材质。我们提供聚丙烯、PTFE、不锈钢烧结等耐腐蚀滤芯。',
    descEn:
      'Filtration in pharma, chemicals, plating and water treatment needs acid- and alkali-resistant, clean materials. We supply PP, PTFE and stainless-steel sintered elements.',
    groups: ['industrial', 'purifier'],
    pointsZh: ['PP / PTFE / 不锈钢烧结', '耐酸碱腐蚀', '可按图纸定制'],
    pointsEn: ['PP, PTFE, stainless sintered', 'Acid and alkali resistant', 'Custom to drawing'],
  },
]

export const applicationBySlug = Object.fromEntries(applications.map((a) => [a.slug, a]))

/** 应用领域按名称索引（供 groups.mjs 的 applications 字段引用） */
export const applicationName = (slug, lang = 'zh') => {
  const a = applicationBySlug[slug]
  if (!a) return slug
  return lang === 'en' ? a.nameEn : a.nameZh
}
