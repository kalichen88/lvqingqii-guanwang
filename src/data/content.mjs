/**
 * 站内内容 / Editorial content
 * ---------------------------------------------------------------------------
 * 全部为原创内容（非照搬厂家文案），用于 FAQ 富摘要、资讯板块与页面正文。
 * 正文用结构化 block 数组描述，便于统一排版：
 *   { t: 'p' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'table', ... }
 */

/* ==========================================================================
   常见问题 —— 同时用于 FAQPage 结构化数据
   ========================================================================== */
export const faqs = [
  {
    q: { zh: '你们是富滤盛的授权代理吗？产品是原厂正品吗？', en: 'Are you an authorized FILTERSUN distributor? Are the filters genuine?' },
    a: {
      zh: '是。我们是富滤盛（FILTERSUN）授权代理服务商，货源来自厂家正规渠道，可提供授权文件、批次与出入库记录用于溯源。我们不做翻新件、不做来路不明的低价货——因为一旦因为一只滤芯导致发动机拉缸或液压阀卡滞，省下的钱远不够修机器。',
      en: 'Yes. We are an authorized FILTERSUN distributor buying through the manufacturer’s official channel. We can provide authorization documents and batch records for traceability. We do not sell refurbished or grey-market stock — one failed filter that scores a cylinder or sticks a hydraulic valve costs far more than the money saved.',
    },
  },
  {
    q: { zh: '只提供件号，能帮我查到对应的滤芯吗？', en: 'I only have a part number. Can you match the filter?' },
    a: {
      zh: '可以。把件号发给我们（微信、WhatsApp、邮件或在线询价都可以），我们会核对规格尺寸、螺纹与密封形式，并给出对应的富滤盛件号与交期。如果你的件号不在我们已收录的 1500+ 条目录里，我们会向厂家核实后再回复，不会用「差不多的」件号糊弄你。',
      en: 'Yes. Send us the part number by WeChat, WhatsApp, email or the enquiry form. We verify dimensions, thread and seal type, then reply with the matching FILTERSUN part number and lead time. If it is not in our 1,500+ item catalogue we check with the factory — we will not substitute a “close enough” number.',
    },
  },
  {
    q: { zh: '没有件号，只有设备机型，能配吗？', en: 'I do not have a part number, only the machine model.' },
    a: {
      zh: '能。提供品牌 + 型号（例如「小松 PC200-8」「卡特 320D」），我们按机型配置全车滤芯清单：空气滤芯、安全滤芯（内芯）、机油滤芯、柴油滤芯（含油水分离）、液压滤芯、先导滤芯、回油滤芯。也可以直接拍一张旧滤芯的照片，连同外形尺寸一起发来，人工比对。',
      en: 'Yes. Give us the brand and model (e.g. “Komatsu PC200-8”, “CAT 320D”) and we build a complete filter list for that machine: air filter, safety inner element, lube filter, fuel filter with water separator, hydraulic filter, pilot filter and return filter. You can also send a photo of the old filter with its outside dimensions and we will match it manually.',
    },
  },
  {
    q: { zh: '起订量是多少？可以混批吗？', en: 'What is the minimum order quantity? Can I mix part numbers?' },
    a: {
      zh: '常规件号 1 只起订，支持多件号混批，按实际数量结算。批量采购（单件号 50 只以上或单笔满额）可申请阶梯价，车队和经销商长期合作可签年度框架协议并月结。',
      en: 'One piece is enough for standard part numbers, and you can mix part numbers in a single order. Volume pricing applies from 50 pieces of one number, or above a single-order threshold. Fleets and resellers can work on an annual framework agreement with monthly settlement.',
    },
  },
  {
    q: { zh: '交期多久？有现货吗？', en: 'What is the lead time? Do you hold stock?' },
    a: {
      zh: '常备的 3000+ 件号现货，工作日 16:00 前确认订单当日发出。非备货件号一般 2–5 个工作日从厂家调货，特殊定制件 7–15 个工作日。急件请在下单时说明，我们会优先安排并可以选择顺丰/航空件。',
      en: 'More than 3,000 fast-moving part numbers are held in stock and ship the same day if the order is confirmed before 16:00 on a working day. Non-stock numbers typically take 2–5 working days from the factory; custom items take 7–15 working days. Tell us at order time if it is urgent and we will prioritise it, with express or air freight if needed.',
    },
  },
  {
    q: { zh: '质量出问题怎么办？有质保吗？', en: 'What if there is a quality problem? Is there a warranty?' },
    a: {
      zh: '富滤盛全系产品由中国太平洋保险公司承保产品责任险，并承诺质量三包。如果确认是产品本身的质量问题，我们包退包换并承担往返运费。我们建议保留原包装与批次标签，这样索赔与溯源会快很多。',
      en: 'The full FILTERSUN range carries product liability insurance from CPIC and a three-guarantee quality commitment. If a genuine manufacturing defect is confirmed we replace or refund it and cover freight both ways. Keep the original packaging and batch label — it makes claims and traceability much faster.',
    },
  },
  {
    q: { zh: '可以出口吗？能提供报关资料和英文包装吗？', en: 'Can you export? Do you provide customs documents and English packaging?' },
    a: {
      zh: '可以。我们支持 FOB / CIF / DDP 等贸易方式，可提供商业发票、装箱单、原产地证等报关资料，并可按客户要求使用中性包装或英文包装。结算支持人民币、美元与多币种，已有 70 多个国家和地区的发货经验。',
      en: 'Yes. We work on FOB, CIF and DDP terms, provide commercial invoices, packing lists and certificates of origin, and can supply neutral or English-language packaging. We settle in RMB, USD and other currencies and have shipped to more than 70 countries and regions.',
    },
  },
  {
    q: { zh: '非标件、异型滤芯可以定制吗？', en: 'Can you make custom or non-standard filters?' },
    a: {
      zh: '可以。提供图纸、样品或关键尺寸（外径、内径、高度、接口形式、过滤精度、介质与工作温度）即可评估。常规定制 7–15 个工作日，开模件另议。小批量我们也接，不要求一定上量。',
      en: 'Yes. Send a drawing, a sample or the key dimensions — outside diameter, inside diameter, height, connection type, micron rating, media and working temperature. Standard custom builds take 7–15 working days; tooling required for moulded parts is quoted separately. Small batches are welcome.',
    },
  },
  {
    q: { zh: '滤芯应该多久换一次？', en: 'How often should filters be changed?' },
    a: {
      zh: '不存在「一刀切」的周期。空气滤芯看进气阻力（一般达到 6–8 kPa 或堵塞指示器报警时更换），液压滤芯看压差与油液清洁度检测，机油与柴油滤芯按发动机小时数并结合油品检测。同样的机型，在矿山和厂区作业的更换周期能差一倍以上。我们会按你的实际工况给出建议值，而不是照抄说明书。',
      en: 'There is no universal interval. Air filters are changed on restriction (typically 6–8 kPa or when the indicator trips); hydraulic filters on pressure drop and oil cleanliness testing; lube and fuel filters on engine hours combined with oil analysis. The same machine can need filters twice as often in a quarry as in a factory yard. We give recommendations based on your actual duty cycle, not a copied service sheet.',
    },
  },
  {
    q: { zh: '可以先要样品或小批量试用吗？', en: 'Can I get a sample or a small trial order?' },
    a: {
      zh: '可以。常用件号可以按只提供样品；批量订单前建议先试用 1–2 台设备，观察一个保养周期（进气阻力、压差、滤纸强度、密封件状态），确认没问题再放量。我们对自家产品有信心，也欢迎你用这种方式验证。',
      en: 'Yes. Common numbers can be supplied singly as samples. Before a bulk order we recommend trialling one or two machines over a full service interval and checking restriction, pressure drop, media strength and seal condition. We are confident in the product and welcome that kind of verification.',
    },
  },
]

/* ==========================================================================
   新闻 / 技术文章（原创）
   ========================================================================== */
export const news = [
  {
    slug: 'air-filter-change-interval',
    date: '2026-03-18',
    category: { zh: '选型指南', en: 'Selection Guide' },
    title: {
      zh: '工程机械空气滤芯多久换一次？别再看说明书上的小时数了',
      en: 'How often should you change a construction machine air filter? Stop using the handbook hours',
    },
    summary: {
      zh: '同一台挖机，在矿山和厂区作业的滤芯寿命能差一倍以上。判断更换时机最可靠的不是小时数，而是进气阻力。本文给出可落地的判断方法和现场检查清单。',
      en: 'The same excavator can get twice the filter life in a factory yard as in a quarry. The reliable trigger is restriction, not hours. Here is a practical method and a field checklist.',
    },
    cover: '/media/factory/1258ce5d1737594.jpg',
    body: [
      { t: 'p', zh: '很多机手按说明书上的「500 小时更换空气滤芯」执行，结果在粉尘大的工地，滤芯早就被吸穿了；而在厂区里干轻活的机器，500 小时拆下来的滤芯其实还能再用一半时间。问题不在说明书，在于说明书假设的是一个「标准工况」，而现场从来没有标准工况。', en: 'Many operators follow the handbook figure of “change the air filter every 500 hours”. In a dusty pit the element is already torn by then; in a clean factory yard the same element at 500 hours has half its life left. The handbook is not wrong — it simply assumes a standard duty cycle, and no site ever has one.' },
      { t: 'h2', zh: '为什么小时数不可靠', en: 'Why hours are a poor trigger' },
      { t: 'p', zh: '空气滤芯的寿命本质上是「容尘量」被消耗完的过程。进气中的粉尘浓度、湿度、颗粒粒径分布，决定容尘量消耗的速度。矿山爆破区、砂石料场、水泥搅拌站的粉尘浓度可能是普通厂区的 5–10 倍，容尘量自然消耗得快得多。', en: 'Air filter life is really the consumption of dust-holding capacity. Dust concentration, humidity and particle size distribution decide how fast that capacity is used. Blasting areas, aggregate yards and batching plants can carry 5–10 times the dust load of an ordinary yard, so capacity is consumed far faster.' },
      { t: 'h2', zh: '正确的判断依据：进气阻力', en: 'The right trigger: intake restriction' },
      { t: 'p', zh: '大多数工程机械在空滤总成上装有堵塞指示器（真空报警器）。当进气负压达到设定值（常见为 6–8 kPa，具体看机型），指示器会显示红色，此时才需要更换。有条件的可以用压差计直接测，数据更准。', en: 'Most construction machines have a restriction indicator on the air cleaner housing. When intake vacuum reaches the set point — commonly 6–8 kPa depending on the model — the indicator shows red and the element is due. A differential pressure gauge gives a more precise reading where available.' },
      { t: 'ul', zh: ['每班次检查指示器状态，不要在报警后长期拖延', '没有指示器的机器，配备手持压差计，按 250 小时实测一次', '更换时同时清理空滤壳体内部，避免残留粉尘瞬时吸入', '高粉尘工况建议在粗滤上加装预滤器或集尘杯，可延长主滤芯寿命 30% 以上'], en: ['Check the indicator every shift and do not run long after it trips', 'For machines without an indicator, measure with a handheld gauge every 250 hours', 'Clean the housing when changing, so residual dust is not ingested at once', 'In heavy dust, add a pre-cleaner or dust bowl — it can extend main element life by over 30%'] },
      { t: 'h2', zh: '一个容易被忽略的点：内芯（安全滤芯）', en: 'The commonly missed part: the safety element' },
      { t: 'p', zh: '双级空滤的外芯负责过滤，内芯（安全滤芯）的作用是「外芯失效时的最后一道防线」，同时防止拆装外芯时粉尘直接进入发动机。因此内芯不能随外芯一起频繁更换——通常外芯换 3 次才换 1 次内芯，拆卸外芯时不要取出内芯。如果发现内芯上已经有明显积尘，说明外芯曾经破损或密封失效，需要同时检查密封面。', en: 'In a two-stage air cleaner the outer element does the filtering while the inner safety element is the last line of defence and stops dust entering during servicing. It should not be changed as often as the outer — typically once every three outer changes — and must stay in place while the outer is removed. Visible dust on the safety element means the outer element or its seal has failed, so check the sealing faces too.' },
      { t: 'quote', zh: '一句话总结：空气滤芯按阻力换，不按小时换；内芯按外芯次数换，不按时间换。', en: 'In one line: change the air filter on restriction, not on hours; change the safety element on outer-element count, not on the calendar.' },
    ],
  },
  {
    slug: 'hydraulic-filter-micron-rating',
    date: '2026-03-06',
    category: { zh: '技术科普', en: 'Technical' },
    title: {
      zh: '3μm、10μm、25μm 液压滤芯怎么选？选错了不是省钱是赔钱',
      en: '3 μm, 10 μm or 25 μm hydraulic filters — picking wrong costs more than it saves',
    },
    summary: {
      zh: '过滤精度不是越高越好。精度越高，压差越大、滤芯寿命越短、能耗越高。关键是让过滤精度与系统的「清洁度目标」匹配。',
      en: 'Finer is not automatically better: finer media means higher pressure drop, shorter life and more energy use. The goal is matching filtration rating to the system’s target cleanliness level.',
    },
    cover: '/media/factory/978d796e67dd442.jpg',
    body: [
      { t: 'p', zh: '很多采购在替换液压滤芯时，倾向于「买精度最高的那个」，觉得这样最保险。实际结果往往是：滤芯压差迅速升高，旁通阀频繁开启，脏油直接绕过滤芯进入系统——既没起到过滤作用，还多花了钱。', en: 'When replacing hydraulic filters, many buyers reach for the finest rating available, assuming it is safest. The usual outcome is a rapid rise in pressure drop, frequent bypass valve opening and dirty oil going straight around the element — no filtration benefit, and a higher bill.' },
      { t: 'h2', zh: '过滤精度到底在说什么', en: 'What a micron rating actually means' },
      { t: 'p', zh: '标称精度（例如「10μm」）通常指该滤芯对某一尺寸颗粒的过滤效率达到某个比例，不同厂家的定义并不统一。更严谨的表述是「β 值」：β₁₀(c) = 200 表示对 10μm 颗粒的过滤比为 200（即上游 200 个颗粒，下游剩 1 个）。只看标称值容易踩坑，最好结合过滤比一起看。', en: 'A nominal rating such as “10 μm” usually means the element captures a certain proportion of particles at that size, and definitions vary between manufacturers. The stricter expression is the beta ratio: β₁₀(c) = 200 means 200 particles of 10 μm upstream for every one downstream. Relying on the nominal figure alone is risky — look at the beta ratio as well.' },
      { t: 'h2', zh: '按系统选精度的经验法则', en: 'Rules of thumb by system type' },
      { t: 'table', head: { zh: ['系统类型', '建议精度', '常见目标清洁度'], en: ['System type', 'Suggested rating', 'Typical target cleanliness'] }, rows: { zh: [['高压伺服 / 比例阀系统', '3–5 μm', 'ISO 16/14/11 或更严'], ['注塑机、机床液压', '5–10 μm', 'ISO 18/16/13'], ['工程机械主液压', '10 μm', 'ISO 19/17/14'], ['回油过滤', '10–20 μm', 'ISO 20/18/15'], ['吸油过滤（滤网）', '80–150 μm（保护泵）', '不作为清洁度控制手段']], en: [['High-pressure servo / proportional', '3–5 μm', 'ISO 16/14/11 or tighter'], ['Injection moulding, machine tools', '5–10 μm', 'ISO 18/16/13'], ['Construction machinery main hydraulics', '10 μm', 'ISO 19/17/14'], ['Return line filtration', '10–20 μm', 'ISO 20/18/15'], ['Suction strainer', '80–150 μm (pump protection)', 'Not a cleanliness control measure']] } },
      { t: 'h2', zh: '三个实际决策要点', en: 'Three practical decision points' },
      { t: 'ol', zh: ['先确认原厂规定的精度等级。替换件低于原厂精度，等于放弃质保；高于原厂精度，要重新核算压差与旁通阀设定值。', '关注纳污量而不只是精度。同为 10μm，滤材面积大、褶皱设计合理的产品，寿命可以是普通产品的 2 倍以上。', '用油液检测验证。按 ISO 4406 做颗粒计数，连续 3 次检测稳定达标，说明选型正确；一直不达标就要考虑提高精度或增加过滤级数。'], en: ['Confirm the OEM-specified rating first. Going coarser than OEM abandons your warranty; going finer means recalculating pressure drop and bypass settings.', 'Look at dirt-holding capacity, not just rating. At the same 10 μm, a larger media area and better pleat design can more than double service life.', 'Verify with oil analysis. If ISO 4406 particle counts meet target over three consecutive samples, the selection is right; if they never do, go finer or add a filtration stage.'] },
      { t: 'quote', zh: '精度只是参数之一，压差、纳污量和旁通阀设定值要一起算。选型的目标是「稳定达标」，不是「数字最小」。', en: 'Rating is only one parameter — pressure drop, dirt-holding capacity and bypass settings must be considered together. The goal is stable compliance, not the smallest number on the label.' },
    ],
  },
  {
    slug: 'genuine-filter-checks',
    date: '2026-02-24',
    category: { zh: '采购防坑', en: 'Buying Guide' },
    title: {
      zh: '滤芯真假辨别：5 个在收货现场就能做的检查',
      en: 'Spotting a counterfeit filter: five checks you can do on the loading dock',
    },
    summary: {
      zh: '仿冒滤芯的外观可以做得非常接近，但滤纸、端盖胶和旁通阀这三处最难作假。下面是五个不需要仪器、当场就能做的检查。',
      en: 'A counterfeit can look almost identical. Media, end-cap adhesive and the bypass valve are the hardest things to fake — here are five checks that need no instruments.',
    },
    cover: '/media/factory/1bdb5aca568b6db.jpg',
    body: [
      { t: 'p', zh: '滤芯是典型的「外观不决定性能」的产品。仿冒件能把印刷、包装、甚至防伪标都做得八九不离十，但滤纸的纤维结构、端盖胶的耐油耐温性能、旁通阀的开启压力，这三点需要真材料和真工艺，造假成本高，也最容易露馅。', en: 'A filter is a classic case of appearance not determining performance. A counterfeit can get the printing, packaging and even the anti-counterfeit label close, but media fibre structure, end-cap adhesive resistance and bypass valve cracking pressure need real materials and real process — expensive to fake and the easiest place to catch one out.' },
      { t: 'h2', zh: '检查一：折数与褶皱均匀度', en: 'Check 1: pleat count and evenness' },
      { t: 'p', zh: '把滤芯对着光看，正品褶皱间距均匀、折痕挺括、没有明显的塌陷或疏密不均。仿冒品为了省滤纸，常把折数减少 10–20%，或者褶皱歪斜、局部粘连。折数少意味着过滤面积小，直接结果是压差上升快、寿命短。', en: 'Hold the element to the light. Genuine pleats are evenly spaced, crisp and free of collapse or bunching. Counterfeits save on media by cutting pleat count by 10–20%, or by uneven, partly glued pleats. Fewer pleats means less area, which means faster pressure rise and shorter life.' },
      { t: 'h2', zh: '检查二：端盖胶的颜色与硬度', en: 'Check 2: end-cap adhesive colour and hardness' },
      { t: 'p', zh: '正品端盖胶固化均匀，颜色一致，用手指按压有韧性而不是发脆或发软。劣质胶在高温机油中长期浸泡后会变软脱落，脱落的胶块会堵住油道——这比滤芯失效本身更危险。', en: 'Genuine adhesive cures evenly with consistent colour and feels tough rather than brittle or spongy under a fingernail. Cheap adhesive softens and sheds after long exposure to hot oil, and the shed fragments block oil galleries — more dangerous than the filter simply failing.' },
      { t: 'h2', zh: '检查三：密封圈材质与回弹', en: 'Check 3: seal material and rebound' },
      { t: 'p', zh: '把密封圈拆下来对折再松开，正品应快速回弹且没有发白裂纹。廉价丁腈胶在低温下会变硬失去密封能力，表现为「换了新滤芯还是渗油」，很多人误以为是安装问题。', en: 'Fold the seal in half and release. A genuine seal rebounds quickly with no whitening or cracking. Cheap nitrile hardens in the cold and stops sealing, which shows up as “the new filter still weeps” — often misdiagnosed as an installation problem.' },
      { t: 'h2', zh: '检查四：旁通阀开启压力', en: 'Check 4: bypass valve cracking pressure' },
      { t: 'p', zh: '旁通阀决定滤芯堵塞时是否保护发动机/系统。开启压力过低，脏油长期绕过滤芯；过高，则滤芯堵塞时供油不足。这一项需要专用设备，但可以用一个简单替代方法：用手按压阀片感受弹簧力度，并对比正品件。明显偏软的需要警惕。', en: 'The bypass valve decides whether the engine or system is protected when the element clogs. Too low and dirty oil bypasses continuously; too high and flow starves when the element blocks. This needs proper equipment, but a substitute is to press the valve disc by hand and compare spring feel against a known-genuine part. Noticeably softer is a warning sign.' },
      { t: 'h2', zh: '检查五：批次与包装信息是否可追溯', en: 'Check 5: batch and packaging traceability' },
      { t: 'p', zh: '正品包装上的批次号、生产日期、防伪码应当能对应到具体的生产记录。收货时把批次号拍照留存，出问题时能快速定位到批次、判断是个案还是批次性问题。仿冒件往往批次号重复、印刷模糊，或者干脆没有。', en: 'Batch number, production date and anti-counterfeit code on genuine packaging should map to real production records. Photograph the batch number on receipt so a problem can be traced quickly and judged as one-off or batch-wide. Counterfeits often repeat batch numbers, print poorly, or omit them entirely.' },
      { t: 'quote', zh: '便宜 30% 的滤芯，通常在滤纸面积、胶水耐温或密封件材质上省出来的。这三样恰恰是决定发动机寿命的东西。', en: 'A filter that is 30% cheaper usually saves on media area, adhesive temperature resistance or seal material — exactly the three things that decide engine life.' },
    ],
  },
  {
    slug: 'china-vi-truck-fuel-filter',
    date: '2026-02-11',
    category: { zh: '选型指南', en: 'Selection Guide' },
    title: {
      zh: '国六重卡柴油滤清器选型：为什么不能沿用国五的件号',
      en: 'China VI truck fuel filtration: why China V part numbers no longer apply',
    },
    summary: {
      zh: '国六发动机的高压共轨系统压力更高、喷油器间隙更小，对燃油清洁度和含水量的要求显著提高。沿用国五滤芯看似省钱，代价可能是整套喷油器。',
      en: 'China VI engines run higher common-rail pressure with tighter injector clearances, so fuel cleanliness and water separation requirements are much stricter. Reusing China V filters can cost you a full set of injectors.',
    },
    cover: '/media/factory/c002b39ef339a07.jpg',
    body: [
      { t: 'p', zh: '国六排放法规实施后，很多车队在保养时发现原来的柴油滤芯件号「用不上了」。这不是厂家故意改号，而是发动机本身变了：高压共轨压力从国五的 1600–1800 bar 提升到 2000–2500 bar，喷油器针阀偶件的配合间隙缩小到微米级，对燃油中的颗粒和水分都更敏感。', en: 'Since China VI took effect, many fleets have found their old fuel filter numbers no longer fit. This is not the manufacturer renumbering for its own sake — the engine changed: common-rail pressure rose from 1,600–1,800 bar to 2,000–2,500 bar, and injector needle clearances are now measured in microns, making the system far more sensitive to particles and water.' },
      { t: 'h2', zh: '国六对燃油过滤的三个硬要求', en: 'Three hard requirements for China VI fuel filtration' },
      { t: 'ul', zh: ['更高的过滤效率：主流要求对 4μm 颗粒的过滤效率达到 95% 以上，部分平台要求 99%。', '更强的水分离能力：高压共轨系统的水分离效率要求通常在 95% 以上，且要有可靠的水位传感器。', '更大的纳污量：国六发动机对燃油品质的容忍度更低，滤芯需要更大的容尘冗余来应对劣质油品。'], en: ['Higher efficiency: mainstream specification is over 95% at 4 μm, with some platforms requiring 99%.', 'Stronger water separation: typically above 95%, plus a reliable water-in-fuel sensor.', 'Greater dirt capacity: China VI engines tolerate poor fuel less well, so elements need more margin.'] },
      { t: 'h2', zh: '常见的三个错误做法', en: 'Three common mistakes' },
      { t: 'ol', zh: ['直接换用国五件号。尺寸可能装得上，但过滤效率与纳污量都不达标，短期看不出问题，几万公里后喷油器开始出故障。', '只换滤芯不换油水分离器总成。总成上的水位传感器和加热器同样有寿命，传感器失效会导致水进入高压油泵而毫无预警。', '长期不排积水。再好的分离器也需要定期放水，建议每次加油时检查并排放集水杯。'], en: ['Fitting a China V number. It may physically fit, but efficiency and capacity fall short — nothing shows up early, then injectors start failing tens of thousands of kilometres later.', 'Changing the element but not the separator assembly. Water sensors and heaters have a service life too, and a failed sensor lets water reach the high-pressure pump with no warning.', 'Never draining water. Even the best separator needs periodic draining — check and drain the bowl at every refuel.'] },
      { t: 'h2', zh: '采购时怎么确认件号正确', en: 'How to confirm the right number when ordering' },
      { t: 'p', zh: '最稳妥的方式是提供车辆 VIN 码或发动机铭牌照片，由我们对照厂家目录确认。如果手上有旧件，把旧件上的件号和品牌一起拍照发来也可以——注意国六车型经常出现「原车装的是 A 品牌、服务站给的是 B 品牌」的情况，跨品牌对照需要更仔细。', en: 'The safest route is to give us the VIN or a photo of the engine plate so we can check the factory catalogue. A photo of the old part showing its number and brand also works — but note that China VI trucks often leave the factory with one brand and get serviced with another, so cross-brand matching needs extra care.' },
    ],
  },
  {
    slug: 'compressor-separator-pressure-drop',
    date: '2026-01-28',
    category: { zh: '运维要点', en: 'Maintenance' },
    title: {
      zh: '空压机油气分离器该换了？看压差，不要看运行时间',
      en: 'Time to change the compressor separator? Watch pressure drop, not the hour meter',
    },
    summary: {
      zh: '油气分离器每上升 0.1 bar 压差，螺杆空压机的能耗就上升约 0.7%。按固定时间更换，要么浪费滤芯，要么在电费上悄悄多花钱。',
      en: 'Every 0.1 bar of extra separator pressure drop adds roughly 0.7% to a screw compressor’s energy use. Calendar-based changes either waste elements or quietly inflate your power bill.',
    },
    cover: '/media/factory/22b0b72ca20e915.jpg',
    body: [
      { t: 'p', zh: '螺杆空压机的油气分离器是整个系统里最贵的一只耗材，也是最能影响能耗的一只。很多用户按「4000 小时更换」执行，但实际寿命受排气温度、油品质量、环境粉尘和加载率影响，差距可以到一倍。', en: 'The oil–air separator is the most expensive consumable on a screw compressor and the one that most affects energy use. Many users change it at a fixed 4,000 hours, but real life varies by a factor of two depending on discharge temperature, oil quality, ambient dust and load factor.' },
      { t: 'h2', zh: '为什么压差比时间可靠', en: 'Why pressure drop beats the clock' },
      { t: 'p', zh: '分离器堵塞的直接表现就是压差上升。压差每增加 0.1 bar，压缩机就要多消耗约 0.7% 的电能来维持同样的排气压力。一只分离器按 0.6 bar 的额外压差运行 4000 小时，多耗的电费往往超过分离器本身的价格。', en: 'A clogging separator shows up directly as rising pressure drop. Each additional 0.1 bar costs about 0.7% more energy to hold the same discharge pressure. Running a separator at 0.6 bar of extra drop for 4,000 hours usually costs more in electricity than the separator itself.' },
      { t: 'h2', zh: '判断标准', en: 'The criteria' },
      { t: 'table', head: { zh: ['压差读数', '建议动作'], en: ['Pressure drop reading', 'Recommended action'] }, rows: { zh: [['< 0.6 bar', '正常运行，按月记录趋势'], ['0.6 – 1.0 bar', '安排备件，列入下次保养计划'], ['> 1.0 bar', '尽快更换，并检查油品与进气'], ['突然升高', '检查是否油品乳化或滤材破损']], en: [['< 0.6 bar', 'Normal — log the trend monthly'], ['0.6 – 1.0 bar', 'Order the part and schedule the change'], ['> 1.0 bar', 'Replace promptly and check oil and intake'], ['Sudden rise', 'Check for emulsified oil or ruptured media']] } },
      { t: 'h2', zh: '三个配套检查', en: 'Three accompanying checks' },
      { t: 'ul', zh: ['回油管路：分离器底部的回油管（scavenge line）如果堵塞，分离下来的油排不回去，会导致排气含油量升高。更换分离器时务必同时检查回油管和节流孔。', '最小压力阀：保持油气罐内压力，压力不足会导致分离器前后压差测量失真，也会影响分离效果。', '油品与油滤：油品氧化变质会加速分离器堵塞，换分离器的同时应当换油和油滤，否则新分离器寿命会明显缩短。'], en: ['Scavenge line: if the line returning separated oil from the separator base is blocked, oil cannot drain back and carry-over rises. Always check the scavenge line and orifice when changing the separator.', 'Minimum pressure valve: it holds pressure in the receiver; if it leaks, pressure-drop readings become misleading and separation suffers.', 'Oil and oil filter: oxidised oil accelerates separator clogging. Change oil and oil filter with the separator or the new one will have a shortened life.'] },
      { t: 'quote', zh: '把压差记进点检表，比记住「4000 小时」有用得多。', en: 'Writing pressure drop into the daily check sheet is worth far more than remembering “4,000 hours”.' },
    ],
  },
  {
    slug: 'filter-stock-planning-fleet',
    date: '2026-01-15',
    category: { zh: '运维要点', en: 'Maintenance' },
    title: {
      zh: '车队滤芯库存怎么备？按「停机成本」而不是按「用量」',
      en: 'How should a fleet stock filters? By downtime cost, not by usage volume',
    },
    summary: {
      zh: '很多车队按历史用量备货，结果常坏的件缺货、不常坏的件积压。更合理的方式是按「停机成本 × 缺货概率」分级，把资金压在真正关键的位置。',
      en: 'Many fleets stock by historical usage and end up short on the parts that fail often and overstocked on the ones that do not. Ranking by downtime cost times stock-out probability puts money where it actually matters.',
    },
    cover: '/media/factory/5a4877badb1c9.jpg',
    body: [
      { t: 'p', zh: '滤芯备货的常见做法是「按去年用了多少，今年备多少」。这个方法的问题在于，它把「用量大」等同于「重要」，而真正决定要不要备货的，是缺货时停机一天要损失多少钱，以及这个件缺货的概率有多大。', en: 'The usual approach is to stock what you used last year. The flaw is that it treats high usage as high importance, whereas the real question is how much a day of downtime costs and how likely a stock-out is.' },
      { t: 'h2', zh: '按三个维度分级', en: 'Classify on three dimensions' },
      { t: 'table', head: { zh: ['级别', '特征', '备货策略'], en: ['Class', 'Characteristics', 'Stocking policy'] }, rows: { zh: [['A 类（关键件）', '停机成本高 + 用量稳定', '常备 1–2 个保养周期的量，设安全库存红线'], ['B 类（常规件）', '停机成本中等 + 用量稳定', '按季度备货，允许 3–5 天调货'], ['C 类（长尾件）', '用量小或仅特定机型', '不备货，依赖供应商现货与快速调货'], ['D 类（应急件）', '停机成本极高 + 缺货概率低', '小量常备，宁可积压不可缺货']], en: [['A — critical', 'High downtime cost, steady usage', 'Hold 1–2 service intervals, with a reorder point'], ['B — routine', 'Moderate downtime cost, steady usage', 'Quarterly replenishment, 3–5 days acceptable'], ['C — long tail', 'Low usage or single-machine', 'Do not stock; rely on supplier stock and fast transfer'], ['D — emergency', 'Very high downtime cost, low stock-out chance', 'Hold a small buffer — better idle than absent']] } },
      { t: 'h2', zh: '两个容易被忽略的成本', en: 'Two costs that get overlooked' },
      { t: 'ul', zh: ['资金占用与老化：滤芯有保质期，特别是带密封橡胶件的产品。备太多，密封件老化后反而不能用。建议先进先出，并在包装上标注入库日期。', '紧急采购溢价：缺货时临时找现货，价格通常比正常采购高 20–50%，还要加上加急运费。把这部分钱预算进「不备货」的成本里，很多 C 类件其实值得备一点。'], en: ['Capital tie-up and ageing: filters have a shelf life, especially where rubber seals are involved. Overstock goes to waste. Rotate first-in-first-out and mark the receipt date on the box.', 'Emergency premium: sourcing at short notice typically costs 20–50% more plus expedited freight. Budget that into the cost of not stocking, and many C-class parts suddenly justify a small buffer.'] },
      { t: 'h2', zh: '和供应商的分工', en: 'Dividing the work with your supplier' },
      { t: 'p', zh: 'A 类和 D 类放在自己仓里，B 类交给供应商备货并按月配送，C 类完全依赖供应商现货——这是最省资金也最稳的组合。前提是供应商真的压了库存，并且能在 24 小时内发出。这正是我们对自己的要求：3000+ 件号常备现货，工作日 16:00 前下单当日发出。', en: 'Keep A and D in your own store, let the supplier hold B with monthly deliveries, and rely entirely on supplier stock for C. It is the combination that ties up the least capital while staying safe — provided the supplier genuinely holds stock and can ship within 24 hours. That is exactly the standard we set ourselves: 3,000+ numbers on the shelf, same-day dispatch for orders confirmed before 16:00 on a working day.' },
    ],
  },
]

export const newsBySlug = Object.fromEntries(news.map((n) => [n.slug, n]))

/* ==========================================================================
   产品共性特性（件号详情页展示，来源为厂家公开的产品特性说明）
   ========================================================================== */
export const productFeatures = [
  {
    no: '01',
    title: { zh: '双层滤纸结构', en: 'Dual-layer media' },
    desc: {
      zh: '采用双层滤纸由粗滤到细滤逐级过滤，阻力更小、容尘量更大，使用寿命更长，防潮除湿、降低油耗。',
      en: 'Dual-layer media filters coarse to fine in stages, giving lower restriction, higher dust capacity, longer life and better moisture resistance.',
    },
  },
  {
    no: '02',
    title: { zh: '滤材来源可控', en: 'Traceable media sourcing' },
    desc: {
      zh: '机油与燃油滤材选用美国 HV、韩国奥斯龙等进口优质材料，过滤精度高、原始阻力小。',
      en: 'Lube and fuel media is sourced from US and Korean suppliers such as HV and Ahlstrom — high efficiency with low initial restriction.',
    },
  },
  {
    no: '03',
    title: { zh: '按 OE 标准选材', en: 'Built to OE specification' },
    desc: {
      zh: '工程机械滤芯根据原厂 OE 配套标准严格精选滤材，保障进气清洁度，减少发动机磨损。',
      en: 'Construction machinery elements are built to original OE standards to protect intake cleanliness and reduce engine wear.',
    },
  },
  {
    no: '04',
    title: { zh: '密封与端盖工艺', en: 'Seals and end caps' },
    desc: {
      zh: '端盖胶耐油耐温，密封圈回弹良好，避免「换了新滤芯仍然渗油」的情况。',
      en: 'Oil- and heat-resistant end-cap adhesive with properly rebounding seals avoids the classic “new filter still weeps” problem.',
    },
  },
  {
    no: '05',
    title: { zh: '净化类抗菌可选', en: 'Antibacterial options' },
    desc: {
      zh: '纳米银抗菌纤维层对大肠杆菌、金黄色葡萄球菌、白色念珠菌等具有抑菌性能（附第三方检测报告）。',
      en: 'Nano-silver antibacterial fibre layers inhibit E. coli, S. aureus, C. albicans and others, with third-party test reports available.',
    },
  },
  {
    no: '06',
    title: { zh: '质量三包 + 责任险', en: 'Warranty and liability cover' },
    desc: {
      zh: '所有产品承诺质量三包，并由中国太平洋保险公司承保产品责任险，质量问题包退包换。',
      en: 'Every product carries a three-guarantee commitment and CPIC product liability insurance; defects are replaced or refunded.',
    },
  },
]

/* ==========================================================================
   服务与支持页
   ========================================================================== */
export const serviceContent = {
  eyebrow: { zh: '服务与支持', en: 'Service & Support' },
  title: { zh: '不只卖滤芯，还帮你把滤芯用对', en: 'We do not just sell filters — we help you use the right one' },
  desc: {
    zh: '滤清器是典型的「选错比买贵更亏」的产品。我们把选型、供货、技术支持和售后做成一条完整的链路，让你在采购环节少踩坑。',
    en: 'Filtration is a category where choosing wrong costs far more than paying more. We run selection, supply, technical support and after-sales as one chain so procurement stops being a gamble.',
  },
  steps: [
    { no: '01', icon: 'search', title: { zh: '需求确认', en: 'Requirement' }, desc: { zh: '提供件号、设备机型或旧件照片，我们核对规格、接口与密封形式。', en: 'Send a part number, machine model or photo of the old part; we verify dimensions, connection and seal.' }, time: { zh: '当天', en: 'Same day' } },
    { no: '02', icon: 'layers', title: { zh: '选型报价', en: 'Selection & quote' }, desc: { zh: '给出对应件号、替代方案、单价与阶梯价，附货期说明。', en: 'We return matching numbers, alternatives, unit and volume pricing, with lead times.' }, time: { zh: '1 个工作日', en: '1 business day' } },
    { no: '03', icon: 'box', title: { zh: '备货发货', en: 'Pick & dispatch' }, desc: { zh: '现货当日发出；调货件 2–5 个工作日；支持指定物流与出口报关。', en: 'Stock ships same day; transferred items take 2–5 working days. Nominated carriers and export clearance supported.' }, time: { zh: '当日–5 日', en: 'Same day – 5 days' } },
    { no: '04', icon: 'headset', title: { zh: '使用跟踪', en: 'Follow-up' }, desc: { zh: '一个保养周期后回访，确认压差、寿命与密封状态，必要时调整选型。', en: 'We check back after one service interval to confirm pressure drop, life and seal condition, and adjust if needed.' }, time: { zh: '持续', en: 'Ongoing' } },
  ],
  capabilities: [
    { icon: 'database', title: { zh: '件号 + 机型双库查询', en: 'Part number and model database' }, desc: { zh: '已收录 1500+ 件号并持续补录，支持按件号前缀、品类、应用场景检索。', en: 'Over 1,500 part numbers catalogued and growing, searchable by prefix, category and application.' } },
    { icon: 'wrench', title: { zh: '工程师技术支持', en: 'Engineer-backed support' }, desc: { zh: '协助判断「换了滤芯仍报警」类问题，避免反复更换浪费成本。', en: 'We help diagnose “still alarming after a filter change” cases so you stop paying for repeat swaps.' } },
    { icon: 'truck-fast', title: { zh: '现货与快速调货', en: 'Stock and fast transfer' }, desc: { zh: '3000+ 件号常备现货，工作日 16:00 前确认当日发出。', en: '3,000+ numbers held in stock; same-day dispatch before 16:00 on working days.' } },
    { icon: 'globe', title: { zh: '出口与报关支持', en: 'Export and customs' }, desc: { zh: 'FOB / CIF / DDP，提供商业发票、装箱单、原产地证与中性包装。', en: 'FOB, CIF and DDP with commercial invoice, packing list, certificate of origin and neutral packaging.' } },
    { icon: 'shield', title: { zh: '质保与产品责任险', en: 'Warranty and liability cover' }, desc: { zh: '全系产品由中国太平洋保险公司承保产品责任险，质量问题包退包换。', en: 'The full range carries CPIC product liability insurance; defects are replaced or refunded.' } },
    { icon: 'recycle', title: { zh: '定制与非标开发', en: 'Custom development' }, desc: { zh: '支持按图纸、样品与关键尺寸定制，小批量亦可接单。', en: 'Custom builds from drawing, sample or key dimensions — small batches accepted.' } },
  ],
}

/* ==========================================================================
   品牌与品质页
   ========================================================================== */
export const qualityContent = {
  eyebrow: { zh: '品牌与品质', en: 'Brand & Quality' },
  title: { zh: '我们敢承诺品质，因为背后是有 20 年积累的工厂', en: 'We can stand behind the quality because the factory behind us has 20 years behind it' },
  desc: {
    zh: '富滤盛集团在东莞、宿迁、大悟设三大生产基地，通过 IATF 16949、ISO 9001、ISO 14001、ISO 45001 体系认证，并取得 TÜV 认证的 GMC 中国出口优质供应商资质，产品出口 70 多个国家和地区。',
    en: 'FILTERSUN Group operates three production bases in Dongguan, Suqian and Dawu, is certified to IATF 16949, ISO 9001, ISO 14001 and ISO 45001, holds TÜV-verified GMC “China Quality Supplier” status, and exports to more than 70 countries.',
  },
  features: [
    { no: '01', title: { zh: '进口滤材', en: 'Imported media' }, desc: { zh: '主要滤材来自美国、韩国、德国进口或国内知名厂家，过滤效率与原始阻力有明确指标。', en: 'Core media is imported from the US, Korea and Germany or sourced from leading domestic makers, with defined efficiency and initial restriction figures.' } },
    { no: '02', title: { zh: '专利结构', en: 'Patented construction' }, desc: { zh: '集团拥有 100 余项发明与实用新型专利，双层滤纸、褶皱设计、端盖密封等结构均有积累。', en: 'The group holds over 100 invention and utility-model patents covering dual-layer media, pleat design and end-cap sealing.' } },
    { no: '03', title: { zh: '体系化品控', en: 'Systematic quality control' }, desc: { zh: '按 IATF 16949 体系执行来料、过程与出货检验，关键尺寸与压差逐批抽检。', en: 'Incoming, in-process and outgoing inspection to IATF 16949, with batch sampling of key dimensions and pressure drop.' } },
    { no: '04', title: { zh: '责任险承保', en: 'Liability insured' }, desc: { zh: '全系产品由中国太平洋保险公司承保产品责任险，质量三包。', en: 'The full range is covered by CPIC product liability insurance with a three-guarantee commitment.' } },
  ],
  audiences: [
    { icon: 'excavator', zh: '工程机械主机与维修厂', en: 'OEMs and repair shops' },
    { icon: 'truck', zh: '商用车队与物流企业', en: 'Truck fleets and logistics' },
    { icon: 'compressor', zh: '空压机服务商', en: 'Compressor service providers' },
    { icon: 'injection', zh: '注塑与模具企业', en: 'Moulding and tooling plants' },
    { icon: 'genset', zh: '发电机组与租赁商', en: 'Genset owners and rental fleets' },
    { icon: 'globe', zh: '海外进口商与分销商', en: 'Overseas importers and resellers' },
  ],
}
