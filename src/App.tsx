import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import EntranceScreen from './components/EntranceScreen'
import AIAssistant from './components/AIAssistant'

// ── 8 款深航专属 3D IP 形象资源引入 ─────────────────────────────────────────
import feifeiImg from './assets/8款IP人偶-3D图/飞飞三维效果.png'
import shenXiaoHangImg from './assets/8款IP人偶-3D图/深小航.png'
import shenXiaoChengImg from './assets/8款IP人偶-3D图/深小乘2.png'
import shenXiaoBaoImg from './assets/8款IP人偶-3D图/深小保.png'
import shenXiaoWeiImg from './assets/8款IP人偶-3D图/深小维.png'
import shenXiaoFuImg from './assets/8款IP人偶-3D图/深小服.png'
import shenXiaoChuImg from './assets/8款IP人偶-3D图/深小厨.png'
import shenXiaoPengImg from './assets/8款IP人偶-3D图/深小鹏.png'

// ── VR 实训视频资源引入 ───────────────────────────────────────────────────
// 【替换视频方法指引】：
// 1. 将您准备好的新 VR 视频文件拷贝至项目的 src/assets/视频/ 目录下；
// 2. 修改下方 import 后的文件名即可替换视频；或者在此处 import 更多新视频！
import vrEmergencyEvacuationVideo from './assets/视频/Desktop 2026.09.07 - 17.56.20.02.mp4'

type Page = 'home' | 'points' | 'ai' | 'vr' | 'knowledge' | 'leaderboard'

const NAV_ITEMS: { id: Page; label: string; iconType: 'home' | 'points' | 'ai' | 'vr' | 'knowledge' | 'leaderboard' }[] = [
  { id: 'home', label: '学习主页', iconType: 'home' },
  { id: 'points', label: '积分激励', iconType: 'points' },
  { id: 'ai', label: 'AI 飞行助手', iconType: 'ai' },
  { id: 'vr', label: 'VR 模拟训练', iconType: 'vr' },
  { id: 'knowledge', label: '航空知识库', iconType: 'knowledge' },
  { id: 'leaderboard', label: '学员排行榜', iconType: 'leaderboard' },
]

// ── Shared Data ─────────────────────────────────────────────────────────────

interface CourseItem {
  id: string
  title: string
  desc: string
  category: 'flight' | 'cabin' | 'maintenance' | 'ground' | 'inspect'
  categoryLabel: string
  tags: { text: string; color: 'red' | 'dark' | 'orange' | 'emerald' | 'blue' }[]
  duration: string
  users: string
  pts: string
  img: string // 3D IP 形象图片
  roleName: string
  roleTitle: string
  dept: string
  accentColor: string
  bgGradient: string
  instructorTip: string
  videoUrl?: string // ★【VR 视频地址】：点击方片播放此视频
}

const COURSES: CourseItem[] = [
  {
    id: 'c-cheng',
    title: '客舱紧急撤离与释压全景演练',
    desc: '模拟万米高空客舱快速释压迫降全流程，演练舱门开启、滑梯释放与乘客秩序引导防冲击姿态',
    category: 'cabin',
    categoryLabel: '客舱乘务',
    tags: [{ text: '必修', color: 'red' }, { text: '乘务安全', color: 'dark' }],
    duration: '45分钟',
    users: '3,840 人',
    pts: '+150 积分',
    img: shenXiaoChengImg,
    roleName: '深小乘',
    roleTitle: '客舱服务 · 资深乘务长',
    dept: '客舱服务部',
    accentColor: '#E60026',
    bgGradient: 'from-rose-950 via-slate-900 to-slate-950',
    instructorTip: '“我是乘务教官深小乘。紧急释压警报响起，请立即确认氧气面罩脱落，下达口令指挥乘客完成防冲击姿势！”',
    // ★★★【第一个方片绑定的 VR 内容视频】：如需更换，修改上方 import 路径或直接修改此处即可 ★★★
    videoUrl: vrEmergencyEvacuationVideo
  },
  {
    id: 'c-hang',
    title: '驾驶舱全动模拟起降与进近实操',
    desc: '模拟空客 A350 复杂气象仪表盲降进近（ILS CAT III）、大侧风着陆与单发失效返航操纵规范',
    category: 'flight',
    categoryLabel: '飞行机组',
    tags: [{ text: '必修', color: 'red' }, { text: '飞行操控', color: 'dark' }],
    duration: '60分钟',
    users: '2,940 人',
    pts: '+180 积分',
    img: shenXiaoHangImg,
    roleName: '深小航',
    roleTitle: '飞行运行 · 机长教官',
    dept: '飞行运行部',
    accentColor: '#1E3A8A',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    instructorTip: '“我是机长教官深小航。当前下滑道已稳定捕获，请密切注意保持进近速度 140 节，平稳接地！”'
  },
  {
    id: 'c-bao',
    title: '机上空防反恐与非法干扰处置',
    desc: '模拟高空客舱突发暴力扰序实战情景，演练防暴约束器械使用、机组成员协同与人质安全防护',
    category: 'flight',
    categoryLabel: '空防安保',
    tags: [{ text: '重点', color: 'orange' }, { text: '空防安全', color: 'dark' }],
    duration: '40分钟',
    users: '2,150 人',
    pts: '+140 积分',
    img: shenXiaoBaoImg,
    roleName: '深小保',
    roleTitle: '保卫部 · 航空安全员',
    dept: '保卫部',
    accentColor: '#0F172A',
    bgGradient: 'from-slate-900 via-slate-900 to-zinc-950',
    instructorTip: '“我是安全教官深小保。发现客舱非法干扰行为，启动警械控制，机组成员保持驾驶舱门完全隔离！”'
  },
  {
    id: 'c-wei',
    title: '航线机务维修与发动机排故实操',
    desc: '虚拟拆解排查 Trent XWB 发动机高压涡轮，实训短停过站目测检查与起落架液压管路维护',
    category: 'maintenance',
    categoryLabel: '机务工程',
    tags: [{ text: '进阶', color: 'orange' }, { text: '机务工程', color: 'dark' }],
    duration: '50分钟',
    users: '1,760 人',
    pts: '+160 积分',
    img: shenXiaoWeiImg,
    roleName: '深小维',
    roleTitle: '维修工程部 · 放行工程师',
    dept: '维修工程部',
    accentColor: '#0D9488',
    bgGradient: 'from-teal-950 via-slate-900 to-slate-950',
    instructorTip: '“我是机务工程师深小维。正在对 1 号发动机反推进行内窥镜探测，注意校准扭力扳手力矩数值！”'
  },
  {
    id: 'c-fu',
    title: '智慧机场值机与特殊旅客离港服务',
    desc: '虚拟还原深圳宝安国际机场 T3 航站楼智能登机口，演练无人陪伴儿童接力护送与延误旅客保障',
    category: 'ground',
    categoryLabel: '地面服务',
    tags: [{ text: '推荐', color: 'dark' }, { text: '航站服务', color: 'dark' }],
    duration: '30分钟',
    users: '3,210 人',
    pts: '+110 积分',
    img: shenXiaoFuImg,
    roleName: '深小服',
    roleTitle: '地面服务部 · 迎送主管',
    dept: '地面服务部',
    accentColor: '#BE123C',
    bgGradient: 'from-pink-950 via-slate-900 to-slate-950',
    instructorTip: '“我是地服主管深小服。宝安 T3 航站楼 28 号登机口注意轮椅旅客无缝转运，践行任何时候自然体贴！”'
  },
  {
    id: 'c-chu',
    title: '万米高空航食美食品控与配餐礼仪',
    desc: '演练机上两舱“深航辣子鸡”特色餐品标准烤制复热温控时效、摆盘美学呈现与航食冷链溯源',
    category: 'cabin',
    categoryLabel: '航食配餐',
    tags: [{ text: '特色', color: 'dark' }, { text: '航食美学', color: 'dark' }],
    duration: '35分钟',
    users: '1,450 人',
    pts: '+120 积分',
    img: shenXiaoChuImg,
    roleName: '深小厨',
    roleTitle: '航空配餐部 · 航食主厨',
    dept: '航空配餐部',
    accentColor: '#C2410C',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    instructorTip: '“我是航食大厨深小厨。烤箱升温至 165℃ 恒温烘烤 18 分钟，锁住辣子鸡外酥里嫩，传递岭南心意！”'
  },
  {
    id: 'c-peng',
    title: '运行控制签派与复杂气象决策',
    desc: '模拟雷雨大风季节航路动态改航决策、中低空颠簸区智能规避及航程关键燃油政策精准研判',
    category: 'maintenance',
    categoryLabel: '运控签派',
    tags: [{ text: '核心', color: 'orange' }, { text: '运控决策', color: 'dark' }],
    duration: '45分钟',
    users: '1,620 人',
    pts: '+150 积分',
    img: shenXiaoPengImg,
    roleName: '深小鹏',
    roleTitle: '运行控制中心 · 签派主任',
    dept: '运行控制中心 (OCC)',
    accentColor: '#4338CA',
    bgGradient: 'from-indigo-950 via-slate-900 to-slate-950',
    instructorTip: '“我是签派主任深小鹏。雷达显示 A599 航路有强雷雨单体发展，已为您重新计算备降场燃油并申请绕飞！”'
  },
  {
    id: 'c-feifei',
    title: '空客 A350 全机三维外表巡检与试飞',
    desc: '由深航吉祥物飞飞领航，360° 沉浸式环绕巡检空客 A350 机身蒙皮、静压孔、皮托管与起落架舱',
    category: 'inspect',
    categoryLabel: '全景巡检',
    tags: [{ text: '热门', color: 'red' }, { text: '飞飞特训', color: 'dark' }],
    duration: '25分钟',
    users: '4,850 人',
    pts: '+130 积分',
    img: feifeiImg,
    roleName: '飞飞',
    roleTitle: '深航领航吉祥物 · 伴学领航员',
    dept: '飞行训练中心',
    accentColor: '#0369A1',
    bgGradient: 'from-sky-950 via-slate-900 to-slate-950',
    instructorTip: '“嗨！我是深航领航机飞飞！跟我一起环绕 A350 巡检吧，看看红金大鹏展翅的尾翼有多帅气！”'
  },
]


interface KnowledgeDoc {
  id: string
  title: string
  scope: 'general' | 'professional'
  dept?: string
  cat: string
  time: string
  reads: string
  desc: string
  badges: { text: string; type: 'official' | 'required' | 'hot' | 'featured' }[]
  content: string
}

const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  // ── 通用知识库 (General Knowledge Base) ───────────────────────────────────
  {
    id: 'g1',
    title: '深圳航空企业文化纲领与全员行为准则 (2026最新版)',
    scope: 'general',
    dept: '企业文化部',
    cat: '企业文化',
    time: '15分钟',
    reads: '6,820',
    desc: '阐述深航精神“敢为人先、追求卓越”，明确全员安全第一红线与廉洁诚信自律守则。',
    badges: [{ text: '官方', type: 'official' }, { text: '全员必读', type: 'required' }],
    content: `【第一章：深圳航空企业核心价值观与发展纲领】
1.1 企业使命：为旅客创造安全、快捷、准点、舒适的美好出行体验；
1.2 核心理念：“敢为人先、追求卓越”，弘扬新时代深圳特区拼搏创新精神；
1.3 安全第一原则：安全是民航的生命线，任何工作安排必须以安全运行为最高前提。

【第二章：全员职业行为与廉洁自律红线】
2.1 廉洁诚信：杜绝任何利益冲突，严格遵照招采、审批合规纪律；
2.2 保密义务：严格保护航空器技术资料、旅客隐私数据及未公开商业秘密；
2.3 职场形象：上班时间规范着装、仪容整洁，践行“任何时候、自然体贴”的深航礼仪。`
  },
  {
    id: 'g2',
    title: '民用航空安全通用法规与九大职业红线守则',
    scope: 'general',
    dept: '航空安全部',
    cat: '安全法规',
    time: '20分钟',
    reads: '5,430',
    desc: '全面解读中国民航 CCAR 体系核心法理，严申全员不可逾越的安全九大红线与隐患自愿报告制度。',
    badges: [{ text: '官方', type: 'official' }, { text: '全员红线', type: 'required' }],
    content: `【第一部分：民航安全九大红线通用禁令】
1. 严禁隐瞒、漏报、迟报飞行与地面安全差错事件；
2. 严禁无资质操作或超执照权限签署航空器放行及签派文件；
3. 严禁酒精测试不合格执勤或饮酒后违规进入受限运行区；
4. 严禁违规带入、遗留外来物(FOD)进入跑道及滑行道。

【第二部分：安全隐患主动自愿报告(吹哨人)制度】
公司设立全天候匿名安全隐患上报通道，对主动发现并消除重大安全隐患的员工予以重奖并严格免除责任。`
  },
  {
    id: 'g3',
    title: '深航全员数字化办公协同与网络信息安全规范',
    scope: 'general',
    dept: '信息技术部',
    cat: '通用规范',
    time: '12分钟',
    reads: '3,890',
    desc: '涵盖移动OA系统安全使用、涉密数据分类分级保护及防范网络钓鱼邮件指南。',
    badges: [{ text: '官方', type: 'official' }],
    content: `【第一章：数字化协同系统日常操作】
1. 办公终端强制开启双因素认证(2FA)与强密码策略；
2. 严禁将内部涉密公文、航班调度信息上传至未经授权的公有云网盘；
3. 离岗必须锁屏，定期更新内网杀毒软件病毒库。

【第二章：防范社工欺诈与钓鱼演练】
收到索要密码、转账通知或异常发票附件的外部邮件，必须点击“一键举报”移交安全中心处置。`
  },
  {
    id: 'g4',
    title: '突发公共安全事件全员应急避险与初级急救常识',
    scope: 'general',
    dept: '后勤保卫部',
    cat: '安全防护',
    time: '10分钟',
    reads: '4,150',
    desc: '办公楼宇与场区火灾疏散、地震避险响应，以及常见晕厥、中暑的初期救助与急救热线。',
    badges: [{ text: '实用', type: 'featured' }],
    content: `【第一章：楼宇火灾紧急疏散 SOP】
听到火警广播后，立刻停止作业，沿绿色疏散通道俯身撤离，严禁乘坐电梯；就近按压火警报警器。

【第二章：初级急救响应要领】
1. 确认现场环境安全，判断倒地人员有无呼吸与颈动脉搏动；
2. 立即呼叫公司应急值班电话 8888 并拨打 120；
3. 协助就近取用 AED 自动体外除颤仪，按语音指引贴附电极片。`
  },
  {
    id: 'g5',
    title: '深圳航空品牌视觉识别系统(VI)与对外发声合规指南',
    scope: 'general',
    dept: '品牌公关部',
    cat: '品牌制度',
    time: '10分钟',
    reads: '2,980',
    desc: '企业标识正确应用场景、官方发声口径及社交媒体员工合规规范。',
    badges: [{ text: '规范', type: 'official' }],
    content: `【第一章：深圳航空 VI 视觉规范】
1. 标准色值：深航红 PANTONE 186C (#E60026)，金色 PANTONE 123C (#F59E0B)；
2. 严禁擅自拉伸、变形标志或反转羽毛图形走向；

【第二章：全员社交媒体发声规范】
个人社交平台不得发布涉航非公开信息、旅客私密图像或在敏感运行区域违规自拍视频。`
  },
  {
    id: 'g6',
    title: '员工心理健康调适(EAP)与跨部门高效协同指南',
    scope: 'general',
    dept: '人力资源部',
    cat: '综合素养',
    time: '8分钟',
    reads: '3,210',
    desc: '高强度倒班岗位心理减压技巧、跨部门业务协同礼仪及全天候 EAP 心理援助热线。',
    badges: [{ text: '精选', type: 'featured' }],
    content: `【第一部分：倒班与轮休节律心理调适】
长航线飞行及机坪夜班作业人员需建立科学的光照与睡眠节律，善用4-7-8呼吸法缓解高压紧张。

【第二部分：深航 24 小时 EAP 暖心热线】
拨打 400-880-9999 获得资深国家级心理咨询师免费专属陪伴与情绪疏导，全程严格加密匿名。`
  },

  // ── 专业知识库 (Professional / Specialty Knowledge Base) ──────────────────
  {
    id: 'p1',
    title: '客舱乘务员标准操作程序手册 (SOP 2024版)',
    scope: 'professional',
    dept: '客舱乘务',
    cat: '乘务SOP',
    time: '18分钟',
    reads: '8,920',
    desc: '覆盖12大客舱服务章节，包含登离机迎客仪态、空中热饮餐食动线、释压处置与紧急撤离口令。',
    badges: [{ text: '客舱核心', type: 'required' }, { text: '官方', type: 'official' }],
    content: `【第一章：迎送客仪容与服务动线】
1. 乘务员登机迎客保持 15° 鞠躬，双手自然交叠于腹前，面带微笑问候；
2. 餐饮服务推车动线严禁单人越过安全界限，热饮装杯不超过容积 70%，递送时温馨提醒小心烫伤。

【第二章：客舱紧急释压处置】
氧气面罩脱落后，乘务员立即就近拉下并戴上面罩，坐下并系牢安全带；平稳后携带便携式氧气瓶巡视客舱。`
  },
  {
    id: 'p2',
    title: '机组晴空颠簸规避决策与机组资源管理(CRM)协同规范',
    scope: 'professional',
    dept: '飞行运行',
    cat: '飞行技术',
    time: '22分钟',
    reads: '6,450',
    desc: '气象雷达回波判读决策、颠簸等级判定话术、单发失效飘降程序与机组协同(CRM)要领。',
    badges: [{ text: '飞行核心', type: 'required' }, { text: '官方', type: 'official' }],
    content: `【第一部分：晴空颠簸(CAT)预防与雷达决策】
巡航阶段监控气压梯度与急流轴交汇区；遭遇中度以上颠簸，机长应立即下达“乘务员就座”指令并开启系好安全带信号灯。

【第二部分：机组资源管理(CRM)沟通准则】
坚持简短明确的封闭环口令指令（Readback-Hearback），副驾驶对飞行参数偏差享有主动质疑权。`
  },
  {
    id: 'p3',
    title: '机坪作业安全红线与航空器地面保障标准工作流程',
    scope: 'professional',
    dept: '地面服务',
    cat: '地服运营',
    time: '16分钟',
    reads: '4,780',
    desc: '航空器进出机位指挥引导手势、轮挡反光锥规范摆放、客梯车与登机桥对接防擦碰规程。',
    badges: [{ text: '地服标准', type: 'official' }],
    content: `【第一章：航空器机位进出引导】
指挥员穿戴高可见反光背心，持发光指挥棒站在机长左侧视线前方；飞机停稳发电机停车后方可安放轮挡。

【第二章：客梯车与登机桥靠接规范】
靠接速度严格控制在 5 km/h 以内，探头微调对准客舱门下沿 5-8cm，确认安全锁扣到位并插好警示链。`
  },
  {
    id: 'p4',
    title: '民用航空器航线例行维修定检与适航放行技术手册',
    scope: 'professional',
    dept: '机务维修',
    cat: '工程适航',
    time: '25分钟',
    reads: '5,310',
    desc: 'A320/B737航前航后机械定检、MEL最低设备清单核签流程、外表除防冰规范及关键系统参数判读。',
    badges: [{ text: '机务核心', type: 'hot' }],
    content: `【第一章：航前定检与绕机检查路线】
从机头前起落架顺时针环绕机身，重点核查皮托管保护套已拆除、轮胎胎纹及刹车磨损指示销、发动机进气道叶片完好无裂痕。

【第二章：MEL 保留故障签署规范】
对允许带缺陷飞行的项目，必须由放行工程师核实限定执勤日历天数，并在机组飞行记录本(TLB)明确签署批注。`
  },
  {
    id: 'p5',
    title: '航空安全员客舱执勤处突与非法干扰应对预案',
    scope: 'professional',
    dept: '空防安保',
    cat: '空防安保',
    time: '15分钟',
    reads: '4,620',
    desc: '非法干扰等级划分、防暴器械使用法定权限、客舱协同处置站位与嫌疑物防爆隔离措施。',
    badges: [{ text: '安保核心', type: 'required' }],
    content: `【第一部分：非法干扰等级与处置原则】
一级扰序（口头挑衅）、二级机闹（推搡破坏）、三级威胁飞行安全（强冲驾驶舱）；保卫人员应果断依法采取约束性措施。

【第二部分：机组空防联动协作】
安全员与乘务长建立暗语代号确认机制，确保驾驶舱门全程保持电控高强度常闭锁死状态。`
  },
  {
    id: 'p6',
    title: '航空货运危险品分类鉴别与机下特种配载监管细则',
    scope: 'professional',
    dept: '货运物流',
    cat: '危险品合规',
    time: '14分钟',
    reads: '3,410',
    desc: 'ICAO-DGR危品运输代码判定、超规锂离子电池拦截、货舱装载重量平衡与活动动物恒温运输。',
    badges: [{ text: '货运法规', type: 'official' }],
    content: `【第一章：锂电池空运准入限制】
额定能量大于 160Wh 的锂电池严禁托运及手提；备用电池必须绝缘独立包装；货舱集中装运须提供 UN38.3 鉴定报告。

【第二章：货舱配载重量平衡(W&B)】
装载前核对装载指令单(LIR)，确保全机重心(CG)严格在包线范围以内，避免起飞尾重或仰角失衡。`
  },
  {
    id: 'p7',
    title: '复杂气象条件与西南高原航线仪表进近实战指引',
    scope: 'professional',
    dept: '飞行运行',
    cat: '航线技术',
    time: '20分钟',
    reads: '4,980',
    desc: '低能见度二类进近(CAT II)、下击暴流风切变告警应对响应与高原单发飘降程序。',
    badges: [{ text: '进阶技术', type: 'featured' }],
    content: `【第一部分：风切变告警(Windshear Ahead)】
起飞或进近听到“WINDSHEAR”语音警告，毫不迟疑执行逃逸机动：油门推至最大起飞推力(TOGA)，维持最大仰角。

【第二部分：高高原机场单发失效飘降】
高原机场地形险峻，预先调定飘降航路航向，遵照逃逸航线爬升至安全越障高度后再行备降决断。`
  },
  {
    id: 'p8',
    title: '客舱机上医疗急救实务与AED自动除颤仪操作SOP',
    scope: 'professional',
    dept: '客舱乘务',
    cat: '医疗急救',
    time: '18分钟',
    reads: '7,150',
    desc: '心脏骤停黄金4分钟心肺复苏按压节拍、AED电极片贴放要领、机上应急药箱调用与空中医疗协助。',
    badges: [{ text: '客舱必修', type: 'hot' }],
    content: `【第一章：高质量心肺复苏(CPR)实施要领】
成人胸外按压深度 5-6 cm，按压频率 100-120 次/分钟；人工呼吸吹气比 30:2；每 2 分钟轮换一次施救人员避免疲劳。

【第二章：AED 自动体外除颤仪使用】
开启 AED 电源后撕开电极片包装，右片贴于右上胸锁骨下方，左片贴于左乳头外侧下方肋骨；分析心律及除颤放电时全员离开患者！`
  }
]

const LEADERBOARD_USERS = [
  { rank: 1, name: '陈思远', dept: '客舱服务部', avatar: '陈', points: 12480, streak: 45, change: 0 },
  { rank: 2, name: '林晓薇', dept: '地面服务部', avatar: '林', points: 11320, streak: 38, change: 1 },
  { rank: 3, name: '王浩然', dept: '飞行运行部', avatar: '王', points: 10950, streak: 30, change: -1 },
  { rank: 4, name: '张雨桐', dept: '机务维修部', avatar: '张', points: 9840, streak: 27, change: 2 },
  { rank: 5, name: '张晓航', dept: '航空安全部', avatar: '张', points: 9210, streak: 22, change: -1 },
  { rank: 6, name: '你 (我)', dept: '客舱服务部', avatar: '你', points: 8760, streak: 18, change: 3, isMe: true },
  { rank: 7, name: '赵诗涵', dept: '乘务二队', avatar: '赵', points: 8340, streak: 14, change: -2 },
]

type ChatMsg = { role: 'user' | 'ai'; text: string; time: string; refDoc?: string; isStreaming?: boolean }

// ── Main Shell ──────────────────────────────────────────────────────────────

export default function App() {
  const [showEntrance, setShowEntrance] = useState(true)
  const [page, setPage] = useState<Page>('home')
  const [points, setPoints] = useState(8760)
  const [streakDays, setStreakDays] = useState(18)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [isVRRunning, setIsVRRunning] = useState(false)
  const [isVRVideoPlaying, setIsVRVideoPlaying] = useState(false)

  // Listen to Esc key to close VR video/modal first, or return to entrance screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isVRRunning) {
          setIsVRRunning(false)
          setIsVRVideoPlaying(false)
          return
        }
        if (!showEntrance) {
          setShowEntrance(true)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showEntrance, isVRRunning])

  const handleEnterPlatform = () => {
    setShowEntrance(false)
    setPage('home')
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } })
  }

  // Interactive Modals
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null)
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false)
  const [customAlert, setCustomAlert] = useState<{
    title: string
    content: string
    icon?: string
    tag?: string
    confirmText?: string
  } | null>(null)
  const showAlert = (alertConfig: {
    title: string
    content: string
    icon?: string
    tag?: string
    confirmText?: string
  }) => {
    setCustomAlert(alertConfig)
  }

  // Daily Tasks
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, text: '完成一节《客舱紧急撤离演练》课程', pts: 50, done: true },
    { id: 2, text: '通过《航空安全管理法规》章节测验', pts: 80, done: false },
    { id: 3, text: '在航空知识库查阅并收藏 1 篇规章手册', pts: 20, done: false },
  ])

  const handleToggleDailyTask = (id: number) => {
    setDailyTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextDone = !t.done
        if (nextDone) {
          setPoints(p => p + t.pts)
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } })
        } else {
          setPoints(p => p - t.pts)
        }
        return { ...t, done: nextDone }
      }
      return t
    }))
  }

  const handleCheckIn = () => {
    if (checkedInToday) return
    setCheckedInToday(true)
    setStreakDays(d => d + 1)
    setPoints(p => p + 30)
    setIsCheckinModalOpen(true)
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } })
  }

  // ── 飞飞 3D 飞机吉祥物交互伴学状态 ────────────────────────────────────────
  const [feifeiQuoteIdx, setFeifeiQuoteIdx] = useState(0)
  const [feifeiBonusCollected, setFeifeiBonusCollected] = useState(false)
  const [feifeiIsWobbling, setFeifeiIsWobbling] = useState(false)

  const FEIFEI_QUOTES = [
    '晓航同学，今日飞行气象晴朗！点击我领取今日起飞能量 ✈️',
    '飞飞提示：完成今日 VR 撤离演练可获得 +150 积分，冲刺乘务长！🌟',
    '安全是民航生命线！任何时候，自然体贴，深航有你更精彩 ❤️',
    '今日承德基地 VR 模拟舱已就绪，准备好起飞了吗？🚀',
    '连续学习已达 18 天，飞飞为你点赞加油！👍',
  ]

  const handleFeifeiClick = () => {
    setFeifeiIsWobbling(true)
    setTimeout(() => setFeifeiIsWobbling(false), 600)
    setFeifeiQuoteIdx(prev => (prev + 1) % FEIFEI_QUOTES.length)
    if (!feifeiBonusCollected) {
      setFeifeiBonusCollected(true)
      setPoints(p => p + 10)
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.55 } })
      showAlert({
        title: '飞飞为你加注飞行能量！',
        icon: '✈️',
        tag: '深航伴学礼 · 每日起飞津贴',
        content: '“收到飞飞送来的高空能量啦！+10 里程积分已计入账户。\n保持专注，今天也是闪闪发光的深航人！”',
        confirmText: '感谢飞飞领航'
      })
    } else {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.55 } })
    }
  }

  // ── Page 1: 学习主页 ───────────────────────────────────────────────────────
  function HomePage() {
    return (
      <div className="p-8 space-y-7 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C]">学习主页</h1>
            <p className="text-xs text-slate-500 mt-0.5">深圳航空全员数字化业务实训与今日学习任务</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-[#E60026] border border-rose-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E60026] animate-pulse" />
              伴学领航员 飞飞 在线
            </span> */}
          </div>
        </div>

        {/* Hero Card - Featuring 3D Floating Feifei Mascot */}
        <div className="relative rounded-2xl bg-[#0D1B2A] text-white p-7 overflow-hidden shadow-xl border border-slate-800">
          {/* Aero background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Greeting & Quick CTAs */}
            <div className="space-y-3 max-w-lg flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E60026] text-white flex items-center gap-1 shadow-xs">
                  <span>✈</span> 深圳航空 · 数字化培训
                </span>
                <span className="text-xs text-slate-300">持续实训 18 天</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-wide">
                欢迎回来，张晓航！
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                今日建议优先完成【客舱紧急撤离演练】VR 实操课，已为您分配承德实训基地模拟客舱工位。
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setPage('vr')}
                  className="px-4 py-2.5 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md hover:shadow-rose-900/40 flex items-center gap-1.5 active:scale-98"
                >
                  <span>🥽</span> 进入 VR 模拟训练
                </button>
                <button
                  onClick={() => setPage('knowledge')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer border border-white/10"
                >
                  查阅服务标准手册
                </button>
              </div>
            </div>

            {/* Middle: 3D Feifei Airplane Mascot With Floating & Interactive Bubble */}
            <div className="flex flex-col items-center justify-center relative select-none shrink-0 py-2">
              {/* Dynamic Speech Bubble */}
              <div
                onClick={handleFeifeiClick}
                className="animate-speech-bubble cursor-pointer mb-2 bg-white/95 backdrop-blur-md text-[#0B192C] text-[11px] font-bold px-3.5 py-1.5 rounded-2xl shadow-xl border border-rose-200/80 flex items-center gap-2 hover:scale-105 transition-transform max-w-[260px] text-center"
                title="点击和飞飞互动！"
              >
                <span className="text-rose-600 text-xs">💬</span>
                <span className="line-clamp-2">{FEIFEI_QUOTES[feifeiQuoteIdx]}</span>
              </div>

              {/* 3D Mascot Image with float and aerodynamic shadow */}
              <div
                onClick={handleFeifeiClick}
                className={`relative cursor-pointer group transition-transform ${feifeiIsWobbling ? 'scale-110 rotate-6' : ''}`}
                title="点击与深航吉祥物飞飞互动，领取飞行能量！"
              >
                <div className="w-48 h-44 relative flex items-center justify-center animate-feifei-float">
                  {/* Subtle golden/red radial glow */}
                  <div className="absolute inset-1 bg-radial from-rose-500/40 via-amber-500/20 to-transparent rounded-full blur-xl" />
                  <img
                    src={feifeiImg}
                    alt="深圳航空吉祥物飞飞"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.6)] scale-125 group-hover:scale-135 transition-transform duration-300"
                  />
                </div>
                {/* Aerodynamic flight shadow */}
                <div className="w-28 h-3.5 bg-black/45 rounded-full mx-auto blur-xs animate-feifei-shadow" />
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-medium">领航官 · 飞飞 (伴学中)</span>
                <button
                  onClick={handleFeifeiClick}
                  className="ml-1 text-[9px] px-2 py-0.5 bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 rounded-full border border-rose-400/30 cursor-pointer transition-colors"
                >
                  {feifeiBonusCollected ? '打招呼 ✈️' : '领能量 +10'}
                </button>
              </div>
            </div>

            {/* Right: Mileage Points & Rank */}
            <div className="text-right shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[160px] backdrop-blur-xs">
              <p className="text-xs text-slate-400">当前里程积分</p>
              <p className="text-4xl font-extrabold text-white font-mono mt-0.5">{points.toLocaleString()}</p>
              <div className="mt-2.5">
                <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  高级乘务员 · 冲刺乘务长
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                距乘务长还差 <span className="text-amber-400 font-bold">240</span> 分
              </p>
            </div>
          </div>
        </div>

        {/* 3 Stats Overview */}
        <div className="grid grid-cols-3 gap-5">
          <div
            onClick={handleCheckIn}
            className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4 cursor-pointer hover:border-[#E60026] hover:shadow-md transition-all"
          >
            <div className="text-3xl">🔥</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">{streakDays}天</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">连续学习</div>
              <div className="text-[11px] text-[#E60026] font-semibold mt-0.5">{checkedInToday ? '今日已签到 ✓' : '点击打卡 +30分'}</div>
            </div>
          </div>

          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">✓</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">247个</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">完成实操任务</div>
              <div className="text-[11px] text-[#E60026] font-medium mt-0.5">本月 +38</div>
            </div>
          </div>

          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">64次</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">测验通过</div>
              <div className="text-[11px] text-[#E60026] font-medium mt-0.5">正确率 87%</div>
            </div>
          </div>
        </div>

        {/* Two-Column Section: Left Tasks + Right Feifei Training Station */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Today's Tasks */}
          <div className="lg:col-span-7 bg-white border border-[#EEF0F4] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-[#0B192C]">今日实训任务（点击打钩完成）</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">完成每日科目可自动累加里程积分与学时档案</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                已完成 {dailyTasks.filter(t => t.done).length} / {dailyTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {dailyTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleToggleDailyTask(t.id)}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold transition-colors ${t.done ? 'bg-[#E60026] border-[#E60026] text-white' : 'border-slate-300 bg-white'
                      }`}>
                      {t.done && '✓'}
                    </div>
                    <span className={`text-xs font-medium ${t.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {{ ...t }.text}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#E60026] bg-rose-50 px-2.5 py-0.5 rounded-full">
                    +{t.pts} 积分
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span>💡</span> 每日 00:00 自动更新全员实训任务
              </span>
              <button
                onClick={() => setPage('knowledge')}
                className="text-[#E60026] font-semibold hover:underline cursor-pointer"
              >
                查看规章手册 ➔
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Feifei Co-pilot Training Station */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B192C] via-[#0D1B2A] to-[#172554] text-white border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-white/15">
                    <img src={feifeiImg} alt="飞飞" className="w-full h-full object-contain filter drop-shadow animate-feifei-float" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">飞飞伴学特训站</h3>
                    <p className="text-[10px] text-slate-400">深航专属 3D 伴学领航员</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E60026] text-white">
                  A350 智能领航
                </span>
              </div>

              {/* Today's Recommended Course Spotlight */}
              <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#E60026] transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-400/30">
                    今日强推实操
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">+150 积分</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-11 h-11 shrink-0 rounded-lg bg-slate-900 border border-slate-700 p-0.5 flex items-center justify-center">
                    <img src={shenXiaoChengImg} alt="深小乘" className="w-full h-full object-contain filter drop-shadow" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-white truncate">客舱紧急撤离与释压全景演练</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                      特聘教官 深小乘 · 承德实训基地模拟客舱
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                  <span className="text-[10px] text-slate-400">⏱ 45分钟 · 必修科目</span>
                  <button
                    onClick={() => {
                      setSelectedCourse(COURSES[0])
                      setIsVRRunning(true)
                    }}
                    className="px-3 py-1 bg-[#E60026] hover:bg-[#CC0022] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>进入实操</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>

              {/* Weather & Station Telemetry */}
              <div className="mt-3 space-y-2 text-[11px] text-slate-300">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span>🌤</span> 深圳宝安机场空域
                  </span>
                  <span className="font-mono text-emerald-300 font-semibold">CAVOK · 080° 6节 · 适航</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span>🥽</span> 承德实训工位
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">A02 VR头显设备已联机</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => setPage('vr')}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
              >
                浏览 8 大实训 ➔
              </button>
              <button
                onClick={() => setPage('ai')}
                className="flex-1 py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
              >
                连线 AI 飞行助手
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Page 2: 积分激励 (EXACT REPLICA OF SCREENSHOT 1) ───────────────────────
  function PointsPage() {
    return (
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#0B192C]">积分激励</h1>
          <p className="text-xs text-slate-500 mt-0.5">里程积分记录你的每一步成长，解锁航空职业荣誉</p>
        </div>

        {/* Dark Navy Hero Card with Airplane silhouette */}
        <div className="relative rounded-2xl bg-[#0D1B2A] text-white p-7 overflow-hidden shadow-md">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
              alt="Airplane silhouette"
              className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/70 to-[#0D1B2A]/90" />
          </div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-2">
              <div className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <span className="text-amber-400">✈</span>
                <span>深圳航空 · 里程积分卡</span>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block mb-1">当前等级</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-500/40">
                  高级乘务员
                </span>
              </div>

              <div className="pt-2">
                <div className="text-4xl font-extrabold font-mono tracking-tight">{points.toLocaleString()}</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  距下一等级 <strong className="text-slate-200">乘务长</strong> 还差 240 分
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">本周获得</p>
              <p className="text-2xl font-extrabold font-mono text-white mt-0.5">+480</p>
              <p className="text-[11px] text-emerald-400 mt-1">↑ 较上周 +23%</p>
            </div>
          </div>

          {/* Red to Gold Segmented Progress Bar */}
          <div className="relative mt-7 pt-2">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="w-[65%] h-full bg-[#E60026]" />
              <div className="w-[18%] h-full bg-[#F59E0B]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
              <span>高级乘务员 (5,000)</span>
              <span>乘务长 (9,000)</span>
            </div>
          </div>
        </div>

        {/* 3 Stats Overview Cards */}
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="text-3xl">🔥</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">{streakDays}天</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">连续学习</div>
              <div className="text-[11px] text-[#E60026] mt-0.5">最高记录 32天</div>
            </div>
          </div>

          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">✓</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">247个</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">完成任务</div>
              <div className="text-[11px] text-[#E60026] mt-0.5">本月 +38</div>
            </div>
          </div>

          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">64次</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">测验通过</div>
              <div className="text-[11px] text-[#E60026] mt-0.5">正确率 87%</div>
            </div>
          </div>
        </div>

        {/* 荣誉徽章 */}
        <div>
          <h2 className="text-sm font-bold text-[#0B192C] mb-3">荣誉徽章</h2>
          <div className="grid grid-cols-6 gap-3">
            {[
              { title: '安全先锋', desc: '通过首次安全测验', icon: '🛡️', earned: true },
              { title: '准点达人', desc: '连续7天按时完课', icon: '⏱️', earned: true },
              { title: '乘务之星', desc: '服务礼仪满分通过', icon: '⭐', earned: true },
              { title: '模拟飞行家', desc: '完成3次VR实感', icon: '✈️', earned: false },
              { title: '知识领航', desc: '阅读20篇知识文章', icon: '🧭', earned: false },
              { title: '团队之翼', desc: '帮助3位同学答疑', icon: '🤝', earned: false },
            ].map(b => (
              <div
                key={b.title}
                onClick={() => showAlert({
                  title: b.title,
                  icon: b.icon,
                  tag: b.earned ? '深航荣誉勋章 · 已达成' : '深航荣誉勋章 · 待解锁',
                  content: `获得条件：${b.desc}\n当前状态：${b.earned ? '已获得全部荣誉认证 ✓' : '继续完成实训任务即可点亮该勋章 🔒'}`,
                  confirmText: '我知道了'
                })}
                className={`bg-white border rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all cursor-pointer shadow-2xs ${b.earned ? 'border-[#EEF0F4] hover:border-[#E60026]' : 'border-[#EEF0F4] opacity-50'
                  }`}
              >
                <div className="text-3xl my-1">{b.icon}</div>
                <div>
                  <h3 className="text-xs font-bold text-[#0B192C]">{b.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{b.desc}</p>
                </div>
                <span className={`text-[9px] mt-2 px-1.5 py-0.5 rounded font-medium ${b.earned ? 'bg-rose-50 text-[#E60026]' : 'bg-slate-100 text-slate-400'
                  }`}>
                  {b.earned ? '已获得' : '待解锁'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 积分获取途径 */}
        <div className="bg-white border border-[#EEF0F4] rounded-2xl p-6 shadow-xs">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">积分获取途径</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📚</span>
                <span className="text-xs font-medium text-slate-800">完成一节课程</span>
              </div>
              <span className="text-xs font-bold text-[#E60026]">+50</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📝</span>
                <span className="text-xs font-medium text-slate-800">通过章节测验</span>
              </div>
              <span className="text-xs font-bold text-[#E60026]">+80</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Page 3: VR 模拟训练 (8 大岗位专属 3D IP 沉浸式实训舱) ─────────────────────
  function VRPage() {
    const [vrCategory, setVrCategory] = useState<'all' | 'flight' | 'cabin' | 'maintenance' | 'inspect'>('all')

    const VR_CATS = [
      { id: 'all', label: '全部实训 (8)' },
      { id: 'flight', label: '飞行与安保 (2)' },
      { id: 'cabin', label: '客舱与航食 (2)' },
      { id: 'maintenance', label: '机务与运控 (2)' },
      { id: 'inspect', label: '巡检与地服 (2)' },
    ]

    const filteredCourses = COURSES.filter(c => {
      if (vrCategory === 'all') return true
      if (vrCategory === 'flight') return c.category === 'flight'
      if (vrCategory === 'cabin') return c.category === 'cabin'
      if (vrCategory === 'maintenance') return c.category === 'maintenance'
      if (vrCategory === 'inspect') return c.category === 'inspect' || c.category === 'ground'
      return true
    })

    return (
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C]">VR 模拟训练舱</h1>
            <p className="text-xs text-slate-500 mt-0.5">深圳航空 8 大核心岗位全景实训 · 专属 3D IP 教官全程指导</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#E60026] text-[#E60026] bg-rose-50/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E60026] animate-pulse" />
            8 个专业实操模块已就绪
          </span>
        </div>

        {/* Notice Banner */}
        <div className="bg-[#0D1B2A] text-white rounded-2xl p-5 flex items-center justify-between shadow-md border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🥽</div>
            <div>
              <p className="font-bold text-sm">连接 VR 头显设备获得沉浸式实操体验</p>
              <p className="text-xs text-slate-400 mt-0.5">支持 Meta Quest · Pico 4 · HTC Vive；也可在现代浏览器中开展 3D 全景交互实操</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showAlert({
                title: 'VR 实训设备联机检测',
                icon: '🥽',
                tag: '虚拟客舱实操中心',
                content: '已检测到承德实训基地模拟客舱工位：\n【Pico 4 Pro 全景实操设备】已就绪，网络联机状态良好。',
                confirmText: '确认并就绪'
              })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-700"
            >
              检测设备
            </button>
            <button
              onClick={() => {
                setIsVRRunning(true)
                setSelectedCourse(COURSES[0])
              }}
              className="px-4 py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              快速进入模拟舱
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {VR_CATS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setVrCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${vrCategory === cat.id
                ? 'bg-[#E60026] text-white font-bold shadow-xs'
                : 'bg-white border border-[#EEF0F4] text-slate-600 hover:bg-slate-50'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 8 Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCourses.map(c => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedCourse(c)
                setIsVRRunning(true)
              }}
              className="group bg-white border border-[#EEF0F4] rounded-2xl overflow-hidden hover:border-[#E60026] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* 3D Aerospace Podium & IP Mascot Cover */}
              <div className={`relative h-56 overflow-hidden bg-gradient-to-b ${c.bgGradient} flex flex-col justify-end items-center pb-2 select-none`}>
                {/* Tech grid & radar background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border border-white/10 rounded-full animate-radar-spin pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                {/* Top Tags */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                  {c.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${t.color === 'red' ? 'bg-[#E60026] text-white' :
                        t.color === 'orange' ? 'bg-amber-600 text-white' :
                          'bg-slate-900/80 text-white backdrop-blur-xs'
                        }`}
                    >
                      {t.text}
                    </span>
                  ))}
                </div>

                {/* Role Badge (Top Right) */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/50 text-white/90 backdrop-blur-md border border-white/20">
                    {c.roleName}
                  </span>
                </div>

                {/* 3D IP Mascot Image */}
                <div className="relative z-10 w-full flex justify-center items-end">
                  <img
                    src={c.img}
                    alt={c.roleName}
                    className={`${c.id === 'c-feifei'
                      ? 'h-36 scale-135 translate-y-1 group-hover:scale-145'
                      : 'h-44 group-hover:scale-110'
                      } object-contain filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.7)] group-hover:-translate-y-2 transition-all duration-300`}
                  />
                </div>

                {/* Holographic floor ring under feet */}
                <div className={`${c.id === 'c-feifei' ? 'w-32 h-4' : 'w-24 h-3.5'} rounded-full bg-cyan-400/25 blur-xs border border-cyan-300/40 transform -translate-y-1 relative z-0`} />
              </div>

              {/* Bottom Course Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-400 font-medium">{c.dept}</span>
                    <span className="font-semibold text-slate-500">{c.categoryLabel}</span>
                  </div>
                  <h3 className="font-bold text-xs text-[#0B192C] group-hover:text-[#E60026] transition-colors leading-snug line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-1.5">
                    {c.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>⏱ {c.duration}</span>
                    <span>👤 {c.users}</span>
                  </div>
                  <span className="font-bold text-[#E60026] bg-rose-50 px-2 py-0.5 rounded-md">
                    {c.pts}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Page 4: 航空知识库 (双层架构：通用知识库 + 专业知识库) ─────────────────
  function KnowledgePage() {
    const [scopeTab, setScopeTab] = useState<'general' | 'professional'>('general')
    const [selectedFilter, setSelectedFilter] = useState('全部')
    const [searchQ, setSearchQ] = useState('')

    const GENERAL_CATS = ['全部', '企业文化', '安全法规', '通用规范', '安全防护', '品牌制度', '综合素养']
    const PROF_DEPTS = ['全部专业', '客舱乘务', '飞行运行', '地面服务', '机务维修', '空防安保', '货运物流']

    const handleSwitchScope = (scope: 'general' | 'professional') => {
      setScopeTab(scope)
      setSelectedFilter(scope === 'general' ? '全部' : '全部专业')
    }

    const generalDocs = KNOWLEDGE_DOCS.filter(d => d.scope === 'general')
    const profDocs = KNOWLEDGE_DOCS.filter(d => d.scope === 'professional')

    const filteredDocs = (scopeTab === 'general' ? generalDocs : profDocs).filter(d => {
      if (scopeTab === 'general') {
        if (selectedFilter !== '全部' && d.cat !== selectedFilter) return false
      } else {
        if (selectedFilter !== '全部专业' && d.dept !== selectedFilter) return false
      }
      if (searchQ.trim()) {
        const q = searchQ.toLowerCase()
        const matchTitle = d.title.toLowerCase().includes(q)
        const matchCat = d.cat.toLowerCase().includes(q)
        const matchDesc = d.desc.toLowerCase().includes(q)
        const matchDept = (d.dept || '').toLowerCase().includes(q)
        if (!matchTitle && !matchCat && !matchDesc && !matchDept) return false
      }
      return true
    })

    const heroDoc = scopeTab === 'general'
      ? generalDocs.find(d => d.id === 'g1') || generalDocs[0]
      : profDocs.find(d => d.id === 'p1') || profDocs[0]

    return (
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C]">航空知识库</h1>
            <p className="text-xs text-slate-500 mt-0.5">深圳航空全员通用标准与业务专业规章数字化资产库</p>
          </div>
          <span className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#FEF9EE] text-[#B45309] border border-[#FDE68A]">
            受控规章已收录 {KNOWLEDGE_DOCS.length} 篇 · 全员实时在线更新
          </span>
        </div>

        {/* Top Segmented Dual-Library Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1.5 w-fit border border-slate-200">
          <button
            onClick={() => handleSwitchScope('general')}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${scopeTab === 'general'
              ? 'bg-[#E60026] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
          >
            <span>📘 通用知识库</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${scopeTab === 'general' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
              全员必修 · {generalDocs.length} 篇
            </span>
          </button>

          <button
            onClick={() => handleSwitchScope('professional')}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${scopeTab === 'professional'
              ? 'bg-[#E60026] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
          >
            <span>📙 专业知识库</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${scopeTab === 'professional' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
              分业务岗位 · {profDocs.length} 篇
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 text-sm">🔍</span>
          <input
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#EEF0F4] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#E60026] transition-colors shadow-2xs"
            placeholder={scopeTab === 'general' ? '搜索通用规章、企业文化、全员安全红线、行为规范...' : '搜索专业SOP、飞行技术、客舱服务、机务维修、空防安保规程...'}
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>

        {/* Category / Department Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(scopeTab === 'general' ? GENERAL_CATS : PROF_DEPTS).map(item => (
            <button
              key={item}
              onClick={() => setSelectedFilter(item)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${selectedFilter === item
                ? 'bg-[#E60026] text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Dynamic Pinned Hero Article Banner */}
        {heroDoc && (
          <div
            onClick={() => setSelectedDoc(heroDoc)}
            className="relative rounded-2xl bg-[#0D1B2A] text-white p-7 overflow-hidden shadow-md cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <img
                src={scopeTab === 'general'
                  ? "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
                  : "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80"
                }
                alt="Aircraft"
                className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/80 to-[#0D1B2A]/70" />
            </div>

            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  {scopeTab === 'general' ? '全员通识 · 官方文件 2026' : `${heroDoc.dept} · 核心操作手册`}
                </span>
                <span className="text-[10px] text-slate-300">置顶推荐</span>
              </div>

              <h2 className="text-lg font-bold text-white mt-1">
                {heroDoc.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {heroDoc.desc}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                <span>⏱ {heroDoc.time}</span>
                <span>👁 {heroDoc.reads} 阅读</span>
                <button className="px-3.5 py-1.5 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                  立即阅读
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Cards Grid (2 Columns) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>当前展示：{filteredDocs.length} 篇规章手册</span>
            <span className="text-slate-400">点击卡片可调阅受控全文</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="bg-white border border-[#EEF0F4] rounded-2xl p-5 hover:border-[#E60026] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {doc.scope === 'professional' && doc.dept && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B192C] text-white">
                          {doc.dept}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#E60026]">
                        {doc.cat}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {doc.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${b.type === 'required' ? 'bg-rose-100 text-[#E60026]' :
                            b.type === 'hot' ? 'bg-amber-100 text-amber-700' :
                              b.type === 'featured' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-600'
                            }`}
                        >
                          {{ ...b }.text}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-bold text-xs text-[#0B192C] group-hover:text-[#E60026] transition-colors leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {doc.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-3">
                  <div className="flex items-center gap-3">
                    <span>⏱ {doc.time}</span>
                    <span>👁 {doc.reads}</span>
                  </div>
                  <span className="text-[#E60026] group-hover:translate-x-0.5 transition-transform font-bold text-[10px]">
                    查阅规程 ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Page 5: 学员排行榜 (EXACT REPLICA OF SCREENSHOT 4) ─────────────────────
  function LeaderboardPage() {
    const [tab, setTab] = useState<'week' | 'month' | 'all'>('week')

    return (
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C]">学员排行榜</h1>
            <p className="text-xs text-slate-500 mt-0.5">入职培训积分排名，激励同行共同成长</p>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(['week', 'month', 'all'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${tab === t ? 'bg-[#E60026] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {t === 'week' ? '本周' : t === 'month' ? '本月' : '总榜'}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-3 gap-5 items-end">
          {/* Top 2 */}
          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-6 text-center shadow-xs space-y-2">
            <div className="text-3xl">🥈</div>
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#E60026] font-bold flex items-center justify-center text-sm mx-auto border border-rose-100">
              林
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#0B192C]">林晓薇</h3>
              <p className="text-[10px] text-slate-400">乘务二队</p>
            </div>
            <div className="pt-2">
              <div className="text-xl font-extrabold text-[#E60026] font-mono">11,320</div>
              <p className="text-[10px] text-slate-400">里程积分</p>
            </div>
          </div>

          {/* Top 1 (Deep Navy Hero Card) */}
          <div className="bg-[#0D1B2A] text-white rounded-2xl p-7 text-center shadow-md space-y-2.5 -mt-3">
            <div className="text-3xl">🏆</div>
            <div className="w-14 h-14 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-base mx-auto border border-slate-700">
              陈
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">陈思远</h3>
              <p className="text-[10px] text-slate-400">乘务一队</p>
            </div>
            <div className="pt-2">
              <div className="text-2xl font-extrabold text-white font-mono">12,480</div>
              <p className="text-[10px] text-slate-400">里程积分</p>
            </div>
          </div>

          {/* Top 3 */}
          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-6 text-center shadow-xs space-y-2">
            <div className="text-3xl">🥉</div>
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm mx-auto border border-amber-100">
              王
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#0B192C]">王浩然</h3>
              <p className="text-[10px] text-slate-400">地勤部门</p>
            </div>
            <div className="pt-2">
              <div className="text-xl font-extrabold text-slate-800 font-mono">10,950</div>
              <p className="text-[10px] text-slate-400">里程积分</p>
            </div>
          </div>
        </div>

        {/* Full Rankings Table */}
        <div className="bg-white border border-[#EEF0F4] rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-[40px_1fr_120px_90px_60px] text-[10px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3 border-b border-slate-100 bg-slate-50/50">
            <span>#</span>
            <span>学员</span>
            <span className="text-right">积分</span>
            <span className="text-right">连续</span>
            <span className="text-right">变化</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {LEADERBOARD_USERS.map(u => (
              <div
                key={u.rank}
                className={`grid grid-cols-[40px_1fr_120px_90px_60px] items-center px-6 py-3.5 transition-colors ${u.isMe ? 'bg-[#FFF1F2]' : 'hover:bg-slate-50/60'
                  }`}
              >
                <span className={`font-bold ${u.rank <= 3 ? 'text-[#E60026]' : 'text-slate-400'}`}>
                  {u.rank}
                </span>

                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${u.isMe ? 'bg-[#E60026] text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                    {u.avatar}
                  </div>
                  <div>
                    <span className={`font-medium ${u.isMe ? 'text-[#E60026] font-bold' : 'text-slate-800'}`}>
                      {u.name}
                    </span>
                    <p className="text-[10px] text-slate-400">{u.dept}</p>
                  </div>
                </div>

                <span className="font-mono font-bold text-slate-800 text-right">{u.points.toLocaleString()}</span>
                <span className="text-slate-500 text-right">🔥 {u.streak}天</span>
                <span className={`font-bold text-right ${u.change > 0 ? 'text-emerald-600' : u.change < 0 ? 'text-rose-500' : 'text-slate-300'
                  }`}>
                  {u.change > 0 ? `▲${u.change}` : u.change < 0 ? `▼${Math.abs(u.change)}` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Page 6: AI 飞行助手 (流式输出 + 通义千问 Qwen 后端连接) ─────────────────
  function AIPage() {
    return (
      <AIAssistant
        onOpenDoc={(title) => {
          const found = KNOWLEDGE_DOCS.find(d => d.title.includes(title))
          if (found) setSelectedDoc(found)
        }}
      />
    )
  }

  // ── Render Current Page ───────────────────────────────────────────────────
  const PAGES: Record<Page, React.ReactNode> = {
    home: <HomePage />,
    points: <PointsPage />,
    ai: <AIPage />,
    vr: <VRPage />,
    knowledge: <KnowledgePage />,
    leaderboard: <LeaderboardPage />,
  }

  return (
    <>
      {showEntrance && (
        <EntranceScreen onEnter={handleEnterPlatform} />
      )}

      <div className="flex h-full bg-[#F8F9FB] select-none font-sans">
        {/* Sidebar matching Figma */}
        <aside className="w-60 flex flex-col bg-[#0B192C] text-slate-300 shrink-0 justify-between">
          <div>
            {/* Logo with PPT Return Button */}
            <div className="px-5 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E60026] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  ✈
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">深圳航空</p>
                  <p className="text-[10px] text-slate-400">数字化实训平台</p>
                </div>
              </div>

              <button
                onClick={() => setShowEntrance(true)}
                title="返回开场演示页面 (Esc)"
                className="text-[10px] text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 border border-slate-700"
              >
                <span>⎋</span>
                <span>演示</span>
              </button>
            </div>

            {/* Navigation items */}
            <nav className="px-3 py-4 space-y-1.5">
              {NAV_ITEMS.map(n => (
                <button
                  key={n.id}
                  onClick={() => setPage(n.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${page === n.id
                    ? 'bg-[#E60026] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    }`}
                >
                  {n.iconType === 'home' && (
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  )}
                  {n.iconType === 'points' && (
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  {n.iconType === 'ai' && (
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2m-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-6 5h6v1H9v-1z" />
                    </svg>
                  )}
                  {n.iconType === 'vr' && (
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 7H4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h4.3a2 2 0 0 0 1.7-1l1-1.5a1 1 0 0 1 1.6 0l1 1.5a2 2 0 0 0 1.7 1H20a3 3 0 0 0 3-3v-4a3 3 0 0 0-3-3zm-13 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                    </svg>
                  )}
                  {n.iconType === 'knowledge' && (
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  )}
                  {n.iconType === 'leaderboard' && (
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  )}
                  <span>{n.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User Pill Footer */}
          <div className="p-4 border-t border-slate-800/80 space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-medium">
                <span>业务实训进度</span>
                <span className="text-slate-300">38%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="w-[38%] h-full bg-gradient-to-r from-[#E60026] to-[#F59E0B]" />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-7 h-7 rounded-full bg-[#E60026] text-white flex items-center justify-center font-bold text-xs shrink-0">
                张
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">张晓航</p>
                <p className="text-[10px] text-slate-400 truncate">ZH · 客舱服务部</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto">
          {PAGES[page]}
        </main>

        {/* Floating Question Help Circle (?) in bottom right */}
        <div
          onClick={() => showAlert({
            title: '深航飞飞 · 服务与支持',
            icon: '✈️',
            tag: '深圳航空数字化实训平台',
            content: '深圳航空数字化学习中心 · 服务热线：400-777-9999\n当前运行版本：v2.4 (2026 深航定制正式版)',
            confirmText: '确定'
          })}
          className="fixed bottom-5 right-5 w-8 h-8 rounded-full bg-[#0B192C] hover:bg-[#E60026] text-white font-bold text-xs flex items-center justify-center shadow-lg cursor-pointer transition-colors z-40"
          title="帮助与支持"
        >
          ?
        </div>

        {/* ── Interactive Modals ── */}
        {/* ── Interactive Modals ── */}
        {/* VR Content Video Player Modal (进入确认 + 超大无控件全景沉浸式播放) */}
        {isVRRunning && selectedCourse && (
          <>
            {/* Stage 1: 课前进入确认与教官指引弹窗 */}
            {!isVRVideoPlaying ? (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-modalFadeIn">
                <div className="bg-[#0B1320] rounded-2xl max-w-lg w-full text-white p-6 space-y-5 border border-slate-700/80 shadow-2xl animate-modalPop">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#E60026] text-white tracking-wider">
                        VR 模块准备就绪
                      </span>
                      <span className="text-[11px] text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                        {selectedCourse.dept}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsVRRunning(false)
                        setIsVRVideoPlaying(false)
                      }}
                      className="text-slate-400 hover:text-white cursor-pointer text-lg w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                      title="关闭"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Course Title & IP Instructor */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-1 flex items-center justify-center shadow-md">
                      <img
                        src={selectedCourse.img}
                        alt={selectedCourse.roleName}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-white leading-snug">{selectedCourse.title}</h3>
                      <p className="text-xs text-amber-400 font-semibold mt-1">
                        特聘教官：{selectedCourse.roleName}（{selectedCourse.roleTitle}）
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {selectedCourse.desc}
                      </p>
                    </div>
                  </div>

                  {/* Instructor Tip Speech Box */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs text-slate-200 italic leading-relaxed flex items-start gap-2.5">
                    <span className="text-amber-400 text-sm shrink-0">💬</span>
                    <span>{selectedCourse.instructorTip}</span>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">科目学时</span>
                      <span className="font-bold text-white mt-0.5 block">{selectedCourse.duration}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">已受训</span>
                      <span className="font-bold text-white mt-0.5 block">{selectedCourse.users}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">考核通关</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">{selectedCourse.pts}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      onClick={() => {
                        setIsVRRunning(false)
                        setIsVRVideoPlaying(false)
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      返回
                    </button>
                    <button
                      onClick={() => setIsVRVideoPlaying(true)}
                      className="px-7 py-2.5 bg-[#E60026] hover:bg-[#CC0022] text-white text-sm font-bold rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-rose-900/50 flex items-center gap-2 active:scale-98"
                    >
                      <span>▶</span>
                      <span>进入</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Stage 2: 纯净沉浸式超大无控件模拟器（零播放器UI，最大化全屏画面，按ESC或点叉退出） */
              <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-modalFadeIn select-none overflow-hidden">
                {/* 悬浮右上角点叉退出按钮 (按 ESC 或点叉即可退出) */}
                <button
                  onClick={() => {
                    setIsVRRunning(false)
                    setIsVRVideoPlaying(false)
                  }}
                  className="absolute top-5 right-6 z-50 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-[#E60026] text-white/90 hover:text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer flex items-center gap-2 group"
                  title="点击或按 ESC 退出"
                >
                  <span className="text-sm leading-none font-bold group-hover:rotate-90 transition-transform">✕</span>
                  <span className="text-[11px] text-slate-300 group-hover:text-white">退出 (ESC)</span>
                </button>

                {/* 最大化全屏沉浸画面（完全隐藏所有原生播放器控件与进度条，看起来像真机实操系统） */}
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <video
                    key={selectedCourse.id}
                    src={selectedCourse.videoUrl || vrEmergencyEvacuationVideo}
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Document Reader Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-modalFadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 transform animate-modalPop">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span>知识库</span>
                    <span>/</span>
                    <span className="text-[#E60026] font-bold">
                      {selectedDoc.scope === 'general' ? '通用知识库' : `专业知识库 · ${selectedDoc.dept}`}
                    </span>
                    <span>/</span>
                    <span className="text-slate-600">{selectedDoc.cat}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0B192C]">{selectedDoc.title}</h3>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg">✕</button>
              </div>

              <div className="max-h-72 overflow-y-auto p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 space-y-2 whitespace-pre-line font-mono">
                {selectedDoc.content}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                <span>阅读学时: {selectedDoc.time} · 官方受控规程</span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      showAlert({
                        title: '受控规章下载成功',
                        icon: '📥',
                        tag: '离线规章缓存',
                        content: `《${selectedDoc.title}》已成功缓存下载为离线受控 PDF 格式，支持弱网环境下随时翻阅研读。`,
                        confirmText: '完成'
                      })
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    下载受控 PDF
                  </button>
                  <button
                    onClick={() => {
                      setPoints(p => p + 20)
                      confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } })
                      showAlert({
                        title: '规章研读认证完成',
                        icon: '📖',
                        tag: '合规实训学时',
                        content: `完成《${selectedDoc.title}》阅读学习！\n已记录学时并为您发放 +20 里程积分奖励！`,
                        confirmText: '领取积分'
                      })
                      setSelectedDoc(null)
                    }}
                    className="px-4 py-1.5 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    完成学习 (+20积分)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check-in Celebration Modal */}
        {isCheckinModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-modalFadeIn">
            <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 transform animate-modalPop">
              <div className="text-4xl">🔥</div>
              <div>
                <h3 className="text-base font-bold text-[#0B192C]">签到打卡成功！</h3>
                <p className="text-xs text-slate-500 mt-1">已连续实训 <strong className="text-[#E60026]">{streakDays}</strong> 天 · 获得 +30 里程积分</p>
              </div>
              <button
                onClick={() => setIsCheckinModalOpen(false)}
                className="w-full py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        )}

        {/* ── 深航飞飞 · 全局美化自定义动画弹窗 ── */}
        {customAlert && (
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-modalFadeIn"
            onClick={() => setCustomAlert(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center transform animate-modalPop space-y-4"
              onClick={e => e.stopPropagation()}
            >
              {/* 头部图标徽标 */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-50 to-orange-50 text-[#E60026] flex items-center justify-center text-3xl mx-auto shadow-inner border border-rose-100/80">
                {customAlert.icon || '✈️'}
              </div>

              <div className="space-y-1.5">
                {customAlert.tag && (
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E60026] border border-rose-100">
                    {customAlert.tag}
                  </span>
                )}
                <h3 className="text-base font-bold text-[#1E293B]">
                  {customAlert.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line px-2">
                  {customAlert.content}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCustomAlert(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#E60026] hover:bg-[#CC0022] transition-colors cursor-pointer shadow-sm active:scale-98"
                >
                  {customAlert.confirmText || '我知道了'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
