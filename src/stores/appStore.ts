import { reactive, ref } from 'vue'
import confetti from 'canvas-confetti'
import type { 
  UserProfile, 
  TaskItem, 
  LeaderboardUser, 
  KnowledgeDoc, 
  FaqItem, 
  BadgeItem, 
  ShopItem, 
  ChatMessage 
} from '../types'

// Initial User Profile
export const user = reactive<UserProfile>({
  name: '张晓航',
  role: '新员工',
  major: '民航飞行学院飞行技术专业',
  department: '飞行部',
  safetyUnit: '安全运行部',
  base: '承德训练基地',
  avatar: '', // Modern avatar rendered via initials / SVG badge
  level: '初级副驾驶 (学员)',
  points: 2890,
  growthScore: 1280,
  studyHours: 32.5,
  studyHoursWeekChange: 8.5,
  taskCompletionRate: 78,
  taskRateWeekChange: 12,
  checkinDays: 12,
  checkinBeatenPercent: 91,
  isCheckedInToday: false
})

// Current Navigation Tab
export const currentTab = ref<string>('dashboard')

// Recommended Learning Tasks
export const tasks = ref<TaskItem[]>([
  {
    id: 't1',
    title: '基础机型系统理论学习',
    category: 'theory',
    categoryLabel: '理论 3.5学时',
    duration: '3.5h',
    progress: 35,
    status: 'ongoing',
    icon: 'Search',
    description: '涵盖波音737/A320全机液压、电气、增压环控系统基础原理及操作指标要求。',
    totalChapters: 8,
    completedChapters: 3
  },
  {
    id: 't2',
    title: 'VR 翼面操作仿真',
    category: 'vr',
    categoryLabel: 'VR实操 40分钟',
    duration: '40min',
    progress: 60,
    status: 'ongoing',
    icon: 'Monitor',
    description: '通过高保真三维仿真座舱，演练副翼、升降舵、方向舵以及襟缝翼的联锁检查操作。',
    totalChapters: 5,
    completedChapters: 3
  },
  {
    id: 't3',
    title: '安全规范与避障演练',
    category: 'safety',
    categoryLabel: '安全规范 2.0学时',
    duration: '2.0h',
    progress: 90,
    status: 'review',
    icon: 'ShieldCheck',
    description: '民航最新防撞系统(TCAS)避让指令复诵及复飞决断动作规范。',
    totalChapters: 4,
    completedChapters: 4
  },
  {
    id: 't4',
    title: '高原机场特殊起降程序',
    category: 'theory',
    categoryLabel: '理论 1.5学时',
    duration: '1.5h',
    progress: 10,
    status: 'not_started',
    icon: 'Compass',
    description: '针对高高原及复杂地形机场的单发失效超障程序解析。',
    totalChapters: 3,
    completedChapters: 0
  }
])

// Leaderboard list
export const leaderboardUsers = ref<LeaderboardUser[]>([
  { rank: 1, name: '张晓航 (我)', points: 2890, avatar: 'ZH', department: '承德基地 · 飞行部', change: 'up', badge: '学霸标兵', likes: 142, hasLiked: false },
  { rank: 2, name: '李浩然', points: 2750, avatar: 'LH', department: '深圳总部 · 飞行部', change: 'same', badge: '操纵能手', likes: 98, hasLiked: false },
  { rank: 3, name: '王飞宇', points: 2610, avatar: 'WF', department: '广州基地 · 航务部', change: 'up', badge: '规章达人', likes: 85, hasLiked: false },
  { rank: 4, name: '林若汐', points: 2480, avatar: 'LR', department: '承德基地 · 运控部', change: 'down', badge: '全勤先锋', likes: 62, hasLiked: false },
  { rank: 5, name: '陈建国', points: 2320, avatar: 'CJ', department: '北京分部 · 机务维修', change: 'same', badge: '安全卫士', likes: 49, hasLiked: false },
  { rank: 6, name: '赵梓彤', points: 2190, avatar: 'ZZ', department: '承德基地 · 飞行部', change: 'up', badge: '新锐学员', likes: 37, hasLiked: false },
])

// Knowledge Base Documents
export const knowledgeDocs = ref<KnowledgeDoc[]>([
  {
    id: 'doc-1',
    title: '民航安全管理手册 (SMS) 第九版',
    category: 'general',
    type: 'pdf',
    size: '1.25 MB',
    date: '2026-08-15',
    tag: '安全规范',
    downloads: 1420,
    views: 3890,
    isBookmarked: true,
    description: '民航局最新安全生产管理体系核心指导规范，涵盖风险识别、安全政策与应急处置总则。',
    contentSnippet: '第一章 安全管理方针\n1.1 航空安全是民航生存与发展的生命线...\n1.2 责任体系与双重预防机制...'
  },
  {
    id: 'doc-2',
    title: '民航机组安全排查规范',
    category: 'general',
    type: 'pdf',
    size: '890 KB',
    date: '2026-08-10',
    tag: '飞行实操',
    downloads: 980,
    views: 2540,
    isBookmarked: false,
    description: '出航前绕机检查单标准流程图解，包含起落架轮舱、皮托管静压孔等关键点位检查要领。',
    contentSnippet: '2.1 绕机检查基本路线及关键探头保护套移除规范...'
  },
  {
    id: 'doc-3',
    title: '员工培训与考核制度',
    category: 'general',
    type: 'pdf',
    size: '1.1MB',
    date: '2026-07-28',
    tag: '业务流程',
    downloads: 820,
    views: 1950,
    isBookmarked: false,
    description: '新员工入职 180 天达标培训考核大纲，含理论考试、带飞小时数及定期复训要求。',
    contentSnippet: '3.1 初始改装与转机型训练学时分配及通关考评标准...'
  },
  {
    id: 'doc-4',
    title: 'BOEING 737NG 快速参考手册 (QRH)',
    category: 'specialized',
    type: 'manual',
    size: '3.8 MB',
    date: '2026-08-18',
    tag: '波音手册',
    downloads: 2310,
    views: 6540,
    isBookmarked: true,
    description: '波音737NG机型非正常与紧急程序快速查阅手册，包含发电机失效、液压失压处置动作。',
    contentSnippet: 'SECTION 1: 记忆项目 (Memory Items)\nAPU FIRE / ENGINE FIRE / RAPID DEPRESSURIZATION...'
  },
  {
    id: 'doc-5',
    title: 'A320 飞行机组操作手册 (FCOM)',
    category: 'specialized',
    type: 'manual',
    size: '4.5 MB',
    date: '2026-08-12',
    tag: '空客手册',
    downloads: 1890,
    views: 4890,
    isBookmarked: false,
    description: '空客A320系列标准操作程序(SOP)、自动化飞行指引(FMGC)与电传操纵法则详解。',
    contentSnippet: 'PRO-NOR-SOP-01 标准起飞滑跑及爬升功率设定...'
  },
  {
    id: 'doc-6',
    title: '承德普宁机场进离场航图与空域说明',
    category: 'specialized',
    type: 'pdf',
    size: '2.1 MB',
    date: '2026-08-01',
    tag: '机场空域',
    downloads: 750,
    views: 1680,
    isBookmarked: true,
    description: '承德基地专属航图包，涵盖跑道物理特性、盲降(ILS)进近图及复飞高度限制。',
    contentSnippet: 'RWY 13/31 盲降进近最低标准表与地形障碍物规避路线...'
  }
])

// FAQs
export const faqs = ref<FaqItem[]>([
  {
    id: 'faq-1',
    question: '新员工入职实操模拟机考核标准是什么？',
    answer: '新员工需完成30小时基础D级全动模拟机训练，考核内容包含标准盲降仪表进近、单发复飞决断及侧风起降，合格线为85分以上。',
    category: '考核制度',
    hotCount: 320
  },
  {
    id: 'faq-2',
    question: '如何申领VR实操模拟头显与训练工位？',
    answer: '在平台“技能模拟训练”模块提交预约申请，系统将自动分配承德基地模拟训练中心3楼A02工位及专属VR设备。',
    category: '实训指南',
    hotCount: 285
  },
  {
    id: 'faq-3',
    question: '航线气象雷达回波图如何快速判读？',
    answer: '绿色代表弱降水（轻度颠簸），黄色代表中度降水，红色及紫色代表强对流云团（伴有严重颠簸及风切变，必须绕飞至少20海里）。',
    category: '飞行气象',
    hotCount: 240
  },
  {
    id: 'faq-4',
    question: '每日打卡积分与排行榜结算周期？',
    answer: '每日打卡可获 +20 积分并累计连续天数，排行榜每周日 24:00 自动结算周榜并发放专属虚拟荣誉徽章。',
    category: '积分规则',
    hotCount: 198
  }
])

// Badges
export const badges = ref<BadgeItem[]>([
  { id: 'b1', title: '展翅首飞', icon: 'Plane', desc: '完成第一堂机型理论课程', unlocked: true, unlockedDate: '2026-08-01', rarity: 'common' },
  { id: 'b2', title: '全勤先锋', icon: 'CalendarCheck', desc: '连续签到打卡满10天', unlocked: true, unlockedDate: '2026-08-11', rarity: 'rare' },
  { id: 'b3', title: '规章达人', icon: 'BookOpenCheck', desc: '通读5本民航标准手册', unlocked: true, unlockedDate: '2026-08-15', rarity: 'rare' },
  { id: 'b4', title: 'VR 王牌', icon: 'Glasses', desc: 'VR模拟操作满分通关', unlocked: true, unlockedDate: '2026-08-20', rarity: 'epic' },
  { id: 'b5', title: '特情处置专家', icon: 'ShieldAlert', desc: '特情应急模拟全部一次通过', unlocked: false, rarity: 'legendary' },
  { id: 'b6', title: '金牌机长', icon: 'Award', desc: '综合考核达98分以上', unlocked: false, rarity: 'legendary' }
])

// Shop Items
export const shopItems = ref<ShopItem[]>([
  { id: 's1', title: '波音 737 官方合金金属机模 (1:200)', cost: 1500, category: '精美周边', image: 'plane', stock: 8, exchanged: false },
  { id: 's2', title: '航校定制 防风飞行夹克与学员勋章', cost: 800, category: '飞行文创', image: 'jacket', stock: 15, exchanged: false },
  { id: 's3', title: 'D级全动模拟机 额外体验 1 小时抵用券', cost: 2200, category: '实训进阶', image: 'ticket', stock: 3, exchanged: false },
  { id: 's4', title: '真皮飞行员日志夹 & 专属定制姓名牌', cost: 1200, category: '专业装备', image: 'book', stock: 12, exchanged: false }
])

// AI Chat Messages
export const chatMessages = ref<ChatMessage[]>([
  {
    id: 'm1',
    sender: 'ai',
    text: '您好，晓航！我是您的专属数字化伴学智能助手“深航飞飞”。今天为您规划了【VR 翼面操作仿真】实操课程，预计还需要 20 分钟即可结业。有什么疑问随时向我提问！',
    time: '09:00',
    options: ['查看今日待学任务', '查询波音737起飞前检查单', '高原机场起降标准', '模拟考官答题模式']
  }
])

// Interactive Modals State
export const modalState = reactive({
  isCourseModalOpen: false,
  activeTask: null as TaskItem | null,
  isDocModalOpen: false,
  activeDoc: null as KnowledgeDoc | null,
  isCheckinModalOpen: false,
  isVRModalOpen: false,
  isChecklistModalOpen: false
})

// Search State
export const globalSearchQuery = ref('')

// Notification list
export const notifications = ref([
  { id: 1, title: '【课程更新】波音 737NG 新版系统理论已上线', time: '10分钟前', read: false },
  { id: 2, title: '【打卡提醒】今日连续打卡第 12 天，继续保持！', time: '1小时前', read: false },
  { id: 3, title: '【实训安排】明日 14:00 承德基地模拟机实训预约成功', time: '昨天', read: true }
])

// Actions
export const triggerCheckIn = () => {
  if (user.isCheckedInToday) return
  user.isCheckedInToday = true
  user.checkinDays += 1
  user.points += 20
  user.growthScore += 10
  
  // Confetti celebration
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
  } catch (e) {
    // ignore
  }

  modalState.isCheckinModalOpen = true
}

export const openTaskDetail = (task: TaskItem) => {
  modalState.activeTask = task
  modalState.isCourseModalOpen = true
}

export const completeCurrentTask = (taskId: string) => {
  const target = tasks.value.find(t => t.id === taskId)
  if (target) {
    target.progress = 100
    target.status = 'completed'
    target.completedChapters = target.totalChapters
    user.points += 50
    user.growthScore += 30
    user.taskCompletionRate = Math.min(100, user.taskCompletionRate + 7)
    
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 }
    })
  }
}

export const openDocPreview = (doc: KnowledgeDoc) => {
  modalState.activeDoc = doc
  modalState.isDocModalOpen = true
  doc.views += 1
}

export const toggleDocBookmark = (docId: string) => {
  const doc = knowledgeDocs.value.find(d => d.id === docId)
  if (doc) {
    doc.isBookmarked = !doc.isBookmarked
  }
}

export const exchangeReward = (item: ShopItem) => {
  if (user.points < item.cost) {
    return { success: false, msg: '积分不足，快去完成实训任务赚取积分吧！' }
  }
  if (item.stock <= 0) {
    return { success: false, msg: '该礼品已被抢光啦！' }
  }
  user.points -= item.cost
  item.stock -= 1
  item.exchanged = true

  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 }
  })
  return { success: true, msg: `兑换成功！兑换码：SZ-${Math.floor(100000 + Math.random() * 900000)}，请前往承德基地训练中心领取。` }
}

export const likeUser = (userRank: number) => {
  const target = leaderboardUsers.value.find(u => u.rank === userRank)
  if (target) {
    if (!target.hasLiked) {
      target.likes += 1
      target.hasLiked = true
    } else {
      target.likes -= 1
      target.hasLiked = false
    }
  }
}

// AI Chat Interaction with typing effect
export const isAiTyping = ref(false)

export const sendAiMessage = (userText: string) => {
  if (!userText.trim() || isAiTyping.value) return

  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // Push user message
  chatMessages.value.push({
    id: 'msg-' + Date.now(),
    sender: 'user',
    text: userText,
    time: timeStr
  })

  isAiTyping.value = true

  // Simulate AI smart response
  setTimeout(() => {
    let replyText = ''
    let refDoc = ''
    let options: string[] = []

    const q = userText.toLowerCase()
    if (q.includes('任务') || q.includes('进度') || q.includes('学习')) {
      replyText = `晓航同学，您当前本周总学时已达 32.5 小时，任务完成率 78%。建议今天优先完成【VR 翼面操作仿真】，该课程已进行至 60%，预计只需 15 分钟即可完成通关！`
      options = ['立即进入 VR 实操', '查看全周学时报表', '查询下一阶段计划']
    } else if (q.includes('检查单') || q.includes('737') || q.includes('波音')) {
      replyText = `波音 737 飞行前检查单关键记忆项目包括：\n1. 氧气面罩测试 (100% 正压送气且指示器变白)\n2. 导航与显示控制源开关 NORMAL\n3. 备用仪表高度设定及场压调校。\n您可以点击下方链接查看完整手册：`
      refDoc = 'BOEING 737NG 快速参考手册 (QRH)'
      options = ['查看检查单演练模块', '打开波音 737 QRH 手册', '练习特情记忆动作']
    } else if (q.includes('高原') || q.includes('气象') || q.includes('风切变')) {
      replyText = `高高原机场（标高2438米以上）空气稀薄，起降具有真速大、转弯半径大、发动机推力减小的特点。遇到风切变警告时，必须立即执行最大推力复飞规程！`
      refDoc = '民航机组安全排查规范'
      options = ['查看承德基地航图', '复飞决策流程树', '咨询带飞教员']
    } else if (q.includes('考官') || q.includes('模拟') || q.includes('答题')) {
      replyText = `【模拟考官提问】在执行起飞滑跑时，如果听到计算机发出“WINDSHEAR”语音警告，且此时指示空速已超过 V1，机组应当采取何种处置措施？\nA: 立即收油门最大刹车中断起飞\nB: 保持起飞，全推力爬升并严格遵循SRS导引\nC: 立即放下全部襟翼`
      options = ['选项 A: 中断起飞', '选项 B: 全推力爬升 (正确)', '选项 C: 放全部襟翼']
    } else {
      replyText = `收到您的提问：“${userText}”。根据深航新员工实训大纲规范，您可以直接查阅对应手册，或者在左侧【知识库】中检索最新规章条目。我随时为您提供专业支持！`
      options = ['查看推荐知识文档', '进入飞行检查单演练', '提问其他技术问题']
    }

    chatMessages.value.push({
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: replyText,
      time: timeStr,
      referenceDoc: refDoc || undefined,
      options: options.length > 0 ? options : undefined
    })

    isAiTyping.value = false
  }, 650)
}
