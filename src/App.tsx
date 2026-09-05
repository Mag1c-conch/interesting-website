import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'

type Page = 'home' | 'points' | 'ai' | 'vr' | 'knowledge' | 'leaderboard'

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: '主页', icon: '⊞' },
  { id: 'points', label: '积分激励', icon: '◆' },
  { id: 'ai', label: 'AI 助手', icon: '✦' },
  { id: 'vr', label: 'VR 学习', icon: '◉' },
  { id: 'knowledge', label: '知识库', icon: '≡' },
  { id: 'leaderboard', label: '排行榜', icon: '▲' },
]

interface Course {
  id: number
  title: string
  category: string
  progress: number
  total: number
  done: number
  color: string
  img: string
  description?: string
}

const COURSES: Course[] = [
  { id: 1, title: '机器学习基础与神经网络', category: '人工智能', progress: 72, total: 24, done: 17, color: '#6D4AFF', img: 'photo-1677442135703-1787eea5ce01', description: '深入理解梯度下降、反向传播与深度网络架构原理。' },
  { id: 2, title: '民航机载仪表与自动飞行系统', category: '航空工程', progress: 38, total: 18, done: 7, color: '#A78BFA', img: 'photo-1540959733332-eab4deabeeaf', description: '全动模拟机驾驶舱核心总线、姿态指引与航道截获SOP。' },
  { id: 3, title: 'Web3 与区块链底层架构', category: '前沿技术', progress: 55, total: 20, done: 11, color: '#7C3AED', img: 'photo-1639762681057-408e52192e55', description: '去中心化网络共识机制与智能合约安全性验证。' },
]

const BADGES = [
  { name: '七日连续', icon: '🔥', desc: '连续学习7天', earned: true },
  { name: '速度之星', icon: '⚡', desc: '单日完成5节课', earned: true },
  { name: '知识猎手', icon: '🎯', desc: '通过10次测验', earned: true },
  { name: '深渊潜者', icon: '🌊', desc: '完成高级实操科目', earned: false },
  { name: '领袖先锋', icon: '👑', desc: '登上排行榜前3名', earned: false },
  { name: '全能学者', icon: '🏛️', desc: '涉猎6个不同专业领域', earned: false },
]

const LEADERBOARD_INITIAL = [
  { rank: 1, name: '陈思远', avatar: 'CS', points: 12480, streak: 45, badge: '🏆', change: 0, likes: 89 },
  { rank: 2, name: '林晓薇', avatar: 'LX', points: 11320, streak: 38, badge: '🥈', change: 1, likes: 67 },
  { rank: 3, name: '王浩然', avatar: 'WH', points: 10950, streak: 30, badge: '🥉', change: -1, likes: 52 },
  { rank: 4, name: '张雨桐', avatar: 'ZY', points: 9840, streak: 27, badge: '', change: 2, likes: 41 },
  { rank: 5, name: '李明杰', avatar: 'LM', points: 9210, streak: 22, badge: '', change: -1, likes: 35 },
  { rank: 6, name: '张晓航 (你)', avatar: 'ZH', points: 8760, streak: 18, badge: '', change: 3, isMe: true, likes: 124 },
  { rank: 7, name: '赵诗涵', avatar: 'ZS', points: 8340, streak: 14, badge: '', change: -2, likes: 28 },
  { rank: 8, name: '刘子轩', avatar: 'LZ', points: 7980, streak: 11, badge: '', change: 0, likes: 19 },
]

interface KnowledgeArticle {
  id: string
  title: string
  cat: string
  reads: number
  time: string
  tag: string
  desc: string
  content: string
}

const KNOWLEDGE_TOPICS: KnowledgeArticle[] = [
  { id: 'k1', title: '神经网络架构设计与反向传播算法', cat: '人工智能', reads: 3420, time: '8 分钟', tag: '热门', desc: '详解梯度下降、张量运算与多层感知机的权重更新机制。', content: '第一章：前向传播与损失函数定义\n在深度学习中，前向传播计算输入样本经过各层权重变换后的预测输出值...\n第二章：链式法则求导\n通过微积分链式法则逐层反向传递误差梯度，完成参数迭代。' },
  { id: 'k2', title: '民航飞行机组快速参考手册 (QRH)', cat: '飞行规章', reads: 2890, time: '12 分钟', tag: '精选', desc: '非正常与突发紧急特情记忆项目处置动作流程。', content: '第一节：记忆项目 (Memory Items)\n1. 驾驶舱快速释压：戴好机组氧气面罩，接通100%模式。\n2. 发动机火警：确认故障发动机推力杆收回慢车并提拉灭火手柄。' },
  { id: 'k3', title: 'Transformer 模型与注意力机制解析', cat: '深度学习', reads: 5640, time: '15 分钟', tag: '热门', desc: '自注意力机制(Self-Attention)数学原理及大模型应用。', content: '注意力权重计算公式：Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V...\n多头注意力机制有效提升了模型在不同子空间表征语义的能力。' },
  { id: 'k4', title: '去中心化自治组织（DAO）治理机制', cat: 'Web3', reads: 1870, time: '6 分钟', tag: '新增', desc: '智能合约投票治理与资产管理体系分析。', content: 'DAO通过链上代币持有量实现治理权重的量化，智能合约保障决议自动执行。' },
  { id: 'k5', title: '强化学习与自主决策控制', cat: '人工智能', reads: 2990, time: '10 分钟', tag: '', desc: '马尔可夫决策过程(MDP)及Q-learning算法实战。', content: 'Agent在与外部环境交互中通过探索与利用平衡，最大化长期累积奖励回报。' },
  { id: 'k6', title: '高高原机场起降程序与风切变规避', cat: '飞行规章', reads: 4110, time: '18 分钟', tag: '精选', desc: '复杂地形盲降进近最低气象标准与复飞决断。', content: '标高2438米以上高高原机场空气密度稀薄，真速大幅高于表速，机组必须严格执行复飞决策程序。' },
]

interface VRScenarioItem {
  id: string
  title: string
  desc: string
  cat: string
  difficulty: '入门' | '中级' | '高级'
  duration: string
  users: number
  img: string
  hudData: { alt: string; speed: string; heading: string; throttle: string }
}

const VR_COURSES: VRScenarioItem[] = [
  { id: 'vr-1', title: '航前准备与全动座舱盲操', desc: '1:1座舱全景盲操，演练顶板全电门检查单复核', cat: '标准程序', difficulty: '入门', duration: '25分钟', users: 2340, img: 'photo-1540959733332-eab4deabeeaf', hudData: { alt: '0 FT', speed: '0 KT', heading: '180°', throttle: 'IDLE' } },
  { id: 'vr-2', title: '极限侧风起飞与抬轮决断', desc: '在25节强侧风下演练副翼与方向舵协同滑跑修正', cat: '操纵技能', difficulty: '中级', duration: '35分钟', users: 1820, img: 'photo-1559757148-5c350d0d3c56', hudData: { alt: '120 FT', speed: '154 KT', heading: '090°', throttle: '98% N1' } },
  { id: 'vr-3', title: 'CAT II 低能见度盲降着陆', desc: '大雾低视程进近，严谨执行DH决断高度目视确认', cat: '复杂气象', difficulty: '高级', duration: '40分钟', users: 3150, img: 'photo-1552832230-c0197dd311b5', hudData: { alt: '250 FT', speed: '138 KT', heading: '270°', throttle: 'AUTO' } },
  { id: 'vr-4', title: '高空座舱快速释压与紧急下降', desc: '模拟巡航高度释压警报，全速下降至安全平飞层', cat: '应急特情', difficulty: '高级', duration: '50分钟', users: 980, img: 'photo-1628258334105-2a0b3d6efee1', hudData: { alt: '10,000 FT', speed: '290 KT', heading: '245°', throttle: 'SPEEDBRK' } },
]

type ChatMsg = { role: 'user' | 'ai'; text: string; time: string; refDoc?: string }

const INITIAL_MSGS: ChatMsg[] = [
  { role: 'ai', text: '你好！我是你的 AI 学习助手。我可以帮你解答课程疑问、制定学习计划、分析知识点，或者进行考试测验。今天想从哪里开始？', time: '刚刚' },
]

const AI_RESPONSES: Record<string, { text: string; ref?: string }> = {
  default: {
    text: '这是一个很好的问题！让我为你详细解析这个知识点。根据你当前的学习进度，建议你从基础概念入手，循序渐进地理解核心原理。你希望我用哪种方式来解释？',
  },
  机器学习: {
    text: '机器学习的核心是让计算机从数据中自动学习规律。主要分为：\n\n1. **监督学习** — 有标签数据训练\n2. **无监督学习** — 发现数据内在结构\n3. **强化学习** — 通过奖励信号优化决策\n\n你目前在第17课，即将进入神经网络部分，需要我重点讲解反向传播算法吗？',
    ref: '神经网络架构设计与反向传播算法'
  },
  计划: {
    text: '根据你的学习数据，我为你制定了本周计划：\n\n• **周一/三/五** — 理论课程，每次45分钟\n• **周二/四** — VR模拟实操训练，每次30分钟\n• **周末** — 复习与小测验\n\n预计本周可获得 +480 积分，冲刺排行榜前5！'
  },
  检查单: {
    text: '标准航前检查单关键记忆项目规范：\n1. 氧气面罩测试 (100% 正压送气并指示正常)\n2. 导航控制源与备用高度表场压校准 (QNH)\n3. 发电机电门及交联汇流条联锁确认\n4. 起飞襟翼设定与绿灯常亮。\n\n具体操作参数可查看受控手册《飞行机组快速参考手册 (QRH)》。',
    ref: '民航飞行机组快速参考手册 (QRH)'
  }
}

function getAIResponse(input: string): { text: string; ref?: string } {
  if (input.includes('机器学习') || input.includes('神经网络')) return AI_RESPONSES['机器学习']
  if (input.includes('计划') || input.includes('安排')) return AI_RESPONSES['计划']
  if (input.includes('检查单') || input.includes('规程') || input.includes('手册')) return AI_RESPONSES['检查单']
  return AI_RESPONSES['default']
}

function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < current ? 'bg-[#6D4AFF] text-white' :
              i === current ? 'bg-[#6D4AFF] text-white ring-4 ring-[#F0EEFF]' :
              'bg-[#F0EEFF] text-[#A78BFA]'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className="text-[10px] text-[#7B7A96] whitespace-nowrap">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mb-3 transition-all duration-300 ${i < current ? 'bg-[#6D4AFF]' : 'bg-[#E8E6F5]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Application Component ───────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [points, setPoints] = useState(8760)
  const [streakDays, setStreakDays] = useState(18)
  const [checkedInToday, setCheckedInToday] = useState(false)

  // Interactive Modals
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [activeDoc, setActiveDoc] = useState<KnowledgeArticle | null>(null)
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false)
  const [selectedVRScenario, setSelectedVRScenario] = useState<VRScenarioItem | null>(null)
  const [isVRRunning, setIsVRRunning] = useState(false)

  // Quick Daily Tasks
  const [tasks, setTasks] = useState([
    { id: 1, task: '完成《反向传播算法与模型调试》课程', pts: 50, done: true },
    { id: 2, task: '参与《航前检查单与仪表标定》小测验', pts: 80, done: false },
    { id: 3, task: '在知识库查阅并收藏一篇专业手册', pts: 20, done: false },
  ])

  // Leaderboard data with likes
  const [leaderboard, setLeaderboard] = useState(LEADERBOARD_INITIAL)

  const handleToggleTask = (taskId: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextDone = !t.done
        if (nextDone) {
          setPoints(p => p + t.pts)
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } })
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
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
  }

  const handleLikeUser = (rank: number) => {
    setLeaderboard(prev => prev.map(u => {
      if (u.rank === rank) {
        return { ...u, likes: u.likes + 1 }
      }
      return u
    }))
  }

  // ── Pages ─────────────────────────────────────────────────────────────────

  function HomePage() {
    return (
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        {/* Greeting & Checkin Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#7B7A96] font-medium mb-1">早上好，张晓航 👋</p>
            <h1 className="text-3xl font-extrabold text-[#1A1A2E] leading-tight">继续你的数字化实训旅程</h1>
            <p className="text-[#7B7A96] text-xs mt-1">
              今日目标：完成 2 节理论课 · 当前连续实训 <span className="text-[#6D4AFF] font-bold">{streakDays} 天</span>
            </p>
          </div>
          <button
            onClick={handleCheckIn}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              checkedInToday 
                ? 'bg-[#E8E6F5] text-[#7B7A96] cursor-default' 
                : 'bg-[#F0EEFF] hover:bg-[#E8E0FF] text-[#6D4AFF] hover:scale-105 shadow-sm'
            }`}
          >
            <span className="text-lg">🔥</span>
            <div className="text-left">
              <p className="text-[10px] text-[#7B7A96] leading-none">{checkedInToday ? '今日已签到' : '点击签到 +30'}</p>
              <p className="text-lg font-extrabold text-[#6D4AFF] leading-tight">{streakDays} 天</p>
            </div>
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '累计总积分', value: points.toLocaleString(), icon: '◆', color: '#6D4AFF', bg: '#F0EEFF' },
            { label: '完成课程', value: '12', icon: '✓', color: '#059669', bg: '#ECFDF5' },
            { label: '学习学时', value: '32.5h', icon: '◷', color: '#D97706', bg: '#FFFBEB' },
            { label: '排行榜名次', value: '#6', icon: '▲', color: '#DC2626', bg: '#FEF2F2' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E8E6F5] rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#7B7A96] font-medium">{s.label}</span>
                <span style={{ color: s.color, background: s.bg }} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold">{s.icon}</span>
              </div>
              <p className="text-2xl font-extrabold text-[#1A1A2E]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Weekly path */}
        <div className="bg-white border border-[#E8E6F5] rounded-xl p-6 shadow-2xs">
          <h2 className="text-xs font-bold text-[#7B7A96] uppercase tracking-wider mb-4">本周实训进阶路径</h2>
          <StepBar steps={['基础理论', '驾驶舱程序', '实操演练', '特情决断', '考核结业']} current={2} />
        </div>

        {/* Current courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1A1A2E]">推荐学习任务</h2>
            <span className="text-xs text-[#7B7A96]">点击卡片可进入微课演练</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {COURSES.map(c => (
              <div
                key={c.id}
                onClick={() => setActiveCourse(c)}
                className="bg-white border border-[#E8E6F5] rounded-xl overflow-hidden hover:shadow-md hover:border-[#A78BFA] transition-all duration-200 cursor-pointer group"
              >
                <div className="h-28 overflow-hidden relative bg-[#1A1A2E]">
                  <img
                    src={`https://images.unsplash.com/${c.img}?w=400&h=200&fit=crop&auto=format`}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-white text-[10px] font-semibold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {c.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1A1A2E] text-sm mb-3 line-clamp-1 group-hover:text-[#6D4AFF] transition-colors">{c.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7B7A96]">{c.done}/{c.total} 节</span>
                    <span className="text-xs font-bold" style={{ color: c.color }}>{c.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F0EEFF] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.progress}%`, background: c.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today tasks */}
        <div className="bg-[#F8F7FF] border border-[#E8E6F5] rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[#7B7A96] uppercase tracking-wider">今日任务（鼠标点击打钩完成）</h2>
            <span className="text-xs text-[#6D4AFF] font-medium">可即时累加积分</span>
          </div>
          <div className="space-y-3">
            {tasks.map(t => (
              <div
                key={t.id}
                onClick={() => handleToggleTask(t.id)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs transition-all ${
                    t.done ? 'bg-[#6D4AFF] border-[#6D4AFF] text-white font-bold' : 'border-[#C4C0E8] bg-white'
                  }`}>
                    {t.done && '✓'}
                  </div>
                  <span className={`text-sm font-medium ${t.done ? 'line-through text-[#A78BFA]' : 'text-[#1A1A2E]'}`}>
                    {t.task}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#6D4AFF] bg-[#F0EEFF] px-2.5 py-1 rounded-full">
                  +{t.pts}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function PointsPage() {
    return (
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A2E]">积分与激励</h1>
          <p className="text-[#7B7A96] text-xs mt-1">追踪你的成就与段位，解锁专属实训权益</p>
        </div>

        {/* Points hero */}
        <div className="bg-gradient-to-br from-[#6D4AFF] to-[#7C3AED] rounded-2xl p-8 text-white relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12 pointer-events-none" />
          <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-white/5 translate-y-8 pointer-events-none" />
          <div className="relative flex items-end justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium mb-1">当前可用积分</p>
              <p className="text-5xl font-extrabold mb-2 font-mono">{points.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">初级副驾驶 (白金学者)</span>
                <span className="text-white/70 text-xs">距升级黄金段位还差 1,240 分</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs mb-1">本周获得</p>
              <p className="text-2xl font-bold font-mono">+480</p>
              <p className="text-white/70 text-xs mt-1">↑ 较上周 +23%</p>
            </div>
          </div>

          {/* Level bar */}
          <div className="relative mt-6">
            <div className="flex justify-between text-xs text-white/70 mb-1.5 font-mono">
              <span>白金阶段 (8,000)</span>
              <span>黄金大师 (10,000)</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (points / 10000) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '连续实训天数', value: `${streakDays}天`, sub: '最高记录 32天', icon: '🔥' },
            { label: '完成实操任务', value: '247', sub: '本月新增 38项', icon: '✓' },
            { label: '理论测验通过', value: '64次', sub: '综合正确率 87%', icon: '🎯' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E8E6F5] rounded-xl p-5 shadow-2xs">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-2xl font-extrabold text-[#1A1A2E]">{s.value}</p>
              <p className="text-xs text-[#7B7A96] font-medium mt-0.5">{s.label}</p>
              <p className="text-xs text-[#A78BFA] mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">成就勋章墙</h2>
          <div className="grid grid-cols-6 gap-3">
            {BADGES.map(b => (
              <div key={b.name} className={`rounded-xl p-4 flex flex-col items-center gap-2 border transition-all ${
                b.earned ? 'bg-white border-[#E8E6F5] hover:border-[#A78BFA] cursor-pointer shadow-2xs' : 'bg-[#F5F4FB] border-transparent opacity-50'
              }`}>
                <span className="text-3xl">{b.icon}</span>
                <p className="text-xs font-bold text-[#1A1A2E] text-center">{b.name}</p>
                <p className="text-[10px] text-[#7B7A96] text-center leading-tight">{b.desc}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${b.earned ? 'bg-[#F0EEFF] text-[#6D4AFF]' : 'text-[#A78BFA]'}`}>
                  {b.earned ? '已获得' : '未解锁'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Points earning guide & Exchange */}
        <div className="bg-white border border-[#E8E6F5] rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[#7B7A96] uppercase tracking-wider">实训进阶权益兑换商城</h2>
            <span className="text-xs text-[#7B7A96]">可用积分：<strong className="text-[#6D4AFF]">{points}</strong> 分</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { act: '波音 737 官方合金机模 (1:200)', pts: 1500, icon: '✈️' },
              { act: 'D级全动模拟机 额外体验 1 小时', pts: 2200, icon: '🥽' },
              { act: '航校定制 防风飞行夹克与学员勋章', pts: 800, icon: '🧥' },
              { act: '真皮飞行员日志夹 & 专属定制姓名牌', pts: 1200, icon: '📔' },
            ].map(a => (
              <div key={a.act} className="flex items-center justify-between p-3 border border-[#E8E6F5] rounded-xl hover:border-[#A78BFA] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <span className="text-xs font-semibold text-[#1A1A2E] block">{a.act}</span>
                    <span className="text-[10px] text-[#7B7A96] font-mono">{a.pts} 积分</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (points < a.pts) {
                      alert('积分不足，快去完成实训任务赚取积分吧！')
                      return
                    }
                    setPoints(p => p - a.pts)
                    confetti({ particleCount: 100, spread: 80 })
                    alert(`兑换成功！兑换凭证码：SZ-${Math.floor(100000 + Math.random() * 900000)}，请前往承德基地训练保障部核销。`)
                  }}
                  disabled={points < a.pts}
                  className="bg-[#6D4AFF] hover:bg-[#5B38E8] disabled:opacity-40 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  兑换
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function AIPage() {
    const [msgs, setMsgs] = useState<ChatMsg[]>(INITIAL_MSGS)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [msgs])

    function send(overrideText?: string) {
      const text = (overrideText || input).trim()
      if (!text) return
      const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      setMsgs(m => [...m, { role: 'user', text, time: now }])
      if (!overrideText) setInput('')
      setLoading(true)

      setTimeout(() => {
        const resp = getAIResponse(text)
        setMsgs(m => [...m, { role: 'ai', text: resp.text, time: now, refDoc: resp.ref }])
        setLoading(false)
      }, 750)
    }

    const SUGGESTIONS = ['帮我制定学习计划', '解释机器学习概念', '波音737起飞前检查单要点', '出航前绕机检查项目']

    return (
      <div className="flex flex-col h-full p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#6D4AFF] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">AI</div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A2E]">AI 学习助手</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-[#7B7A96]">智能知识库伴学模型 · 随时为你解答</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-5 mb-4 pr-1">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-[#6D4AFF] flex items-center justify-center text-white text-xs font-extrabold shrink-0 mt-0.5">AI</div>
              )}
              <div className={`max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#6D4AFF] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E8E6F5] text-[#1A1A2E] rounded-tl-xs shadow-2xs'
                }`}>
                  {m.text}

                  {m.refDoc && (
                    <div 
                      onClick={() => {
                        const found = KNOWLEDGE_TOPICS.find(k => k.title.includes(m.refDoc!))
                        if (found) setActiveDoc(found)
                      }}
                      className="mt-2.5 pt-2 border-t border-[#F0EEFF] text-[11px] text-[#6D4AFF] font-medium flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <span>📖 关联受控资料：{m.refDoc}</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#7B7A96] px-1">{m.time}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6D4AFF] flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
              <div className="bg-white border border-[#E8E6F5] px-4 py-3 rounded-2xl rounded-tl-xs flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 flex-wrap mb-3">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-xs text-[#6D4AFF] bg-[#F0EEFF] hover:bg-[#E8E0FF] px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 bg-white border border-[#E8E6F5] rounded-xl p-1.5 focus-within:border-[#6D4AFF] transition-colors shadow-2xs">
          <input
            className="flex-1 px-3 py-2 text-xs text-[#1A1A2E] outline-none bg-transparent placeholder:text-[#C4C0E8]"
            placeholder="输入你的问题或学习需求..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button onClick={() => send()}
            className="bg-[#6D4AFF] hover:bg-[#5B38E8] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            disabled={!input.trim() || loading}>
            发送
          </button>
        </div>
      </div>
    )
  }

  function VRPage() {
    const activeScenario = selectedVRScenario || VR_COURSES[0]

    return (
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1A1A2E]">VR 沉浸学习与情景仿真</h1>
            <p className="text-[#7B7A96] text-xs mt-1">突破空间限制，在虚拟现实座舱与复杂场景中深度演练</p>
          </div>
          <div className="bg-[#F0EEFF] text-[#6D4AFF] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <span>◉</span> {VR_COURSES.length} 个实训情景可用
          </div>
        </div>

        {/* Device notice */}
        <div className="bg-gradient-to-r from-[#1A1A2E] to-[#2D2B5E] rounded-xl p-5 flex items-center justify-between text-white shadow-xs">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🥽</span>
            <div>
              <p className="font-bold text-sm">连接 VR 头显以获得完整 6-DOF 交互体验</p>
              <p className="text-white/60 text-xs mt-0.5">也可在浏览器中以 3D HUD 仿真仪表模式快速预览</p>
            </div>
          </div>
          <button 
            onClick={() => alert('承德基地 VR 仿真硬件连接检测通过：4K 双目渲染 · 延迟 < 12ms')}
            className="bg-[#6D4AFF] hover:bg-[#5B38E8] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            检测设备
          </button>
        </div>

        {/* VR Viewport Canvas (留空的高科技视界UI) */}
        <div className="relative h-72 rounded-2xl bg-[#0B0D1B] border border-[#2D2B5E] overflow-hidden p-6 flex flex-col justify-between text-white shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-white/60 z-10">
            <div className="flex items-center gap-3">
              <span className="text-[#A78BFA] font-bold">VR HUD SIMULATOR</span>
              <span>·</span>
              <span>情景：{activeScenario.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isVRRunning ? 'bg-green-400 animate-ping' : 'bg-[#A78BFA]'}`} />
              <span className="text-xs">{isVRRunning ? '仿真引擎运行中' : '视界待载入'}</span>
            </div>
          </div>

          <div className="relative z-10 text-center my-auto space-y-3">
            {!isVRRunning ? (
              <>
                <h3 className="text-lg font-bold text-white">{activeScenario.title}</h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">{activeScenario.desc}</p>
                <button
                  onClick={() => {
                    setIsVRRunning(true)
                    confetti({ particleCount: 50, spread: 60 })
                  }}
                  className="bg-[#6D4AFF] hover:bg-[#5B38E8] text-white text-xs font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  <span>▶</span> 载入并启动 VR 场景
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-6 bg-white/10 px-6 py-2.5 rounded-xl backdrop-blur-md font-mono text-xs text-[#A78BFA]">
                  <span>高度: {activeScenario.hudData.alt}</span>
                  <span>空速: {activeScenario.hudData.speed}</span>
                  <span>航向: {activeScenario.hudData.heading}</span>
                  <span>推力: {activeScenario.hudData.throttle}</span>
                </div>
                <p className="text-xs text-green-400 font-bold">✓ 沉浸式视界已就绪，当前正在模拟实训科目中</p>
                <button
                  onClick={() => setIsVRRunning(false)}
                  className="bg-red-500/80 hover:bg-red-500 text-white text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  结束体验
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-white/50 z-10 pt-2 border-t border-white/10">
            <span>难度等级: {activeScenario.difficulty}</span>
            <span>建议时长: {activeScenario.duration}</span>
            <span>获得奖励: +120 积分</span>
          </div>
        </div>

        {/* VR Scenario Selection Cards */}
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">可选实训情景预设</h2>
          <div className="grid grid-cols-2 gap-4">
            {VR_COURSES.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  setSelectedVRScenario(v)
                  setIsVRRunning(false)
                }}
                className={`rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                  activeScenario.id === v.id
                    ? 'border-[#6D4AFF] shadow-md shadow-[#6D4AFF]/10 ring-2 ring-[#F0EEFF]'
                    : 'border-[#E8E6F5] hover:border-[#A78BFA] bg-white'
                }`}
              >
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#6D4AFF] bg-[#F0EEFF] px-2 py-0.5 rounded-full">{v.cat}</span>
                    <span className="text-[10px] text-[#7B7A96]">{v.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] text-xs mb-1">{v.title}</h3>
                  <p className="text-[11px] text-[#7B7A96] mb-3 line-clamp-2">{v.desc}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#7B7A96] pt-2 border-t border-[#F0EEFF]">
                    <span>⏱ {v.duration}</span>
                    <span className="text-[#6D4AFF] font-bold">
                      {activeScenario.id === v.id ? '当前选中 ●' : '点击载入'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function KnowledgePage() {
    const [search, setSearch] = useState('')
    const [cat, setCat] = useState('全部')
    const CATS = ['全部', '人工智能', '飞行规章', '深度学习', 'Web3']
    const filtered = KNOWLEDGE_TOPICS.filter(t =>
      (cat === '全部' || t.cat === cat) &&
      (search === '' || t.title.includes(search) || t.cat.includes(search) || t.desc.includes(search))
    )

    return (
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A2E]">知识库</h1>
          <p className="text-[#7B7A96] text-xs mt-1">精选专业技术手册与前沿文章，拓展学科与操作视野</p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A78BFA]">⌕</span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E8E6F5] rounded-xl text-xs text-[#1A1A2E] outline-none focus:border-[#6D4AFF] transition-colors placeholder:text-[#C4C0E8] shadow-2xs"
            placeholder="搜索知识文章、专业手册、SOP规程..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                cat === c ? 'bg-[#6D4AFF] text-white shadow-xs' : 'bg-[#F0EEFF] text-[#6D4AFF] hover:bg-[#E8E0FF]'
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Featured article */}
        <div 
          onClick={() => setActiveDoc(KNOWLEDGE_TOPICS[0])}
          className="bg-gradient-to-br from-[#1A1A2E] to-[#2D2B5E] rounded-xl overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity shadow-md"
        >
          <div className="relative p-8 text-white">
            <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider">本周精选受控研讨</span>
            <h2 className="text-xl font-extrabold mt-2 mb-2 max-w-lg">神经网络架构设计与反向传播算法深度解析</h2>
            <p className="text-white/70 text-xs max-w-md">详细推导多层前馈网络、自适应学习率优化器以及特情决策系统中的鲁棒性保障。</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-white/60 text-xs">⏱ 8 分钟阅读</span>
              <span className="text-white/60 text-xs">👁 3,420 次查阅</span>
              <span className="bg-[#6D4AFF] text-white text-xs px-3.5 py-1.5 rounded-full font-semibold">开始阅读</span>
            </div>
          </div>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              onClick={() => setActiveDoc(a)}
              className="bg-white border border-[#E8E6F5] rounded-xl p-5 hover:border-[#A78BFA] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2.5">
                <span className="text-xs font-semibold text-[#6D4AFF] bg-[#F0EEFF] px-2.5 py-0.5 rounded-full">{a.cat}</span>
                {a.tag && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    a.tag === '热门' ? 'bg-orange-50 text-orange-500' :
                    a.tag === '精选' ? 'bg-[#F0EEFF] text-[#6D4AFF]' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {a.tag}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-[#1A1A2E] text-xs mb-2 leading-snug group-hover:text-[#6D4AFF] transition-colors">{a.title}</h3>
              <p className="text-[11px] text-[#7B7A96] mb-3 line-clamp-2">{a.desc}</p>
              <div className="flex items-center justify-between text-[11px] text-[#7B7A96] pt-2 border-t border-[#F0EEFF]">
                <span>⏱ {a.time}</span>
                <span>👁 {a.reads.toLocaleString()} 阅读</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-[#A78BFA]">未找到相关文章</div>
          )}
        </div>
      </div>
    )
  }

  function LeaderboardPage() {
    const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')
    return (
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1A1A2E]">排行榜</h1>
            <p className="text-[#7B7A96] text-xs mt-1">与学员共同实训竞技，持续激发成长动力</p>
          </div>
          <div className="flex bg-[#F0EEFF] rounded-xl p-1 gap-1">
            {(['week', 'month', 'all'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  period === p ? 'bg-[#6D4AFF] text-white shadow-xs' : 'text-[#6D4AFF] hover:bg-[#E8E0FF]'
                }`}>
                {p === 'week' ? '本周' : p === 'month' ? '本月' : '总榜'}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-4 items-end">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => (
            <div key={u.rank} className={`rounded-xl p-5 text-center border transition-all ${
              i === 1 ? 'bg-gradient-to-b from-[#6D4AFF] to-[#5B38E8] text-white border-transparent -mt-4 pb-8 shadow-md' :
              'bg-white border-[#E8E6F5] shadow-2xs'
            }`}>
              <div className="text-3xl mb-2">{u.badge || (i === 0 ? '🥈' : '🥉')}</div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2 ${
                i === 1 ? 'bg-white/20 text-white' : 'bg-[#F0EEFF] text-[#6D4AFF]'
              }`}>{u.avatar}</div>
              <p className={`font-bold text-xs ${i === 1 ? 'text-white' : 'text-[#1A1A2E]'}`}>{u.name}</p>
              <p className={`text-xl font-extrabold mt-1 font-mono ${i === 1 ? 'text-white' : 'text-[#6D4AFF]'}`}>
                {u.points.toLocaleString()}
              </p>
              <p className={`text-[11px] mt-0.5 ${i === 1 ? 'text-white/70' : 'text-[#7B7A96]'}`}>积分</p>
            </div>
          ))}
        </div>

        {/* Full table */}
        <div className="bg-white border border-[#E8E6F5] rounded-xl overflow-hidden shadow-2xs">
          <div className="grid grid-cols-[40px_1fr_100px_80px_60px_60px] text-[10px] font-bold text-[#7B7A96] uppercase tracking-wider px-5 py-3 border-b border-[#E8E6F5] bg-[#FAFAFE]">
            <span>#</span><span>实训学员</span><span className="text-right">积分</span><span className="text-right">连续打卡</span><span className="text-right">变化</span><span className="text-right">点赞</span>
          </div>
          <div className="divide-y divide-[#F0EEFF]">
            {leaderboard.map(u => (
              <div key={u.rank} className={`grid grid-cols-[40px_1fr_100px_80px_60px_60px] items-center px-5 py-3.5 transition-colors ${
                (u as any).isMe ? 'bg-[#F0EEFF]' : 'hover:bg-[#FAFAFE]'
              }`}>
                <span className={`text-xs font-bold ${u.rank <= 3 ? 'text-[#6D4AFF]' : 'text-[#7B7A96]'}`}>{u.rank}</span>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    (u as any).isMe ? 'bg-[#6D4AFF] text-white' : 'bg-[#F0EEFF] text-[#6D4AFF]'
                  }`}>{u.avatar}</div>
                  <div>
                    <p className={`text-xs font-semibold ${(u as any).isMe ? 'text-[#6D4AFF] font-bold' : 'text-[#1A1A2E]'}`}>
                      {u.name}
                    </p>
                    <p className="text-[10px] text-[#7B7A96]">🔥 {u.streak}天</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#1A1A2E] text-right font-mono">{u.points.toLocaleString()}</p>
                <p className="text-xs text-[#7B7A96] text-right font-mono">{u.streak}天</p>
                <p className={`text-xs font-bold text-right font-mono ${
                  u.change > 0 ? 'text-green-500' : u.change < 0 ? 'text-red-400' : 'text-[#A78BFA]'
                }`}>
                  {u.change > 0 ? `▲${u.change}` : u.change < 0 ? `▼${Math.abs(u.change)}` : '—'}
                </p>
                <button
                  onClick={() => handleLikeUser(u.rank)}
                  className="text-right text-xs hover:scale-110 transition-transform cursor-pointer"
                  title="点赞"
                >
                  ❤️ {u.likes}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My position callout */}
        <div className="bg-[#F0EEFF] border border-[#C4C0E8] rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-[#1A1A2E] text-sm">你排名第 6 位</p>
            <p className="text-xs text-[#7B7A96] mt-0.5">再获得 <span className="text-[#6D4AFF] font-bold">480 积分</span> 即可超越李明杰，晋升前 5！</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-[#6D4AFF] font-mono">{points.toLocaleString()}</p>
            <p className="text-xs text-[#7B7A96]">当前积分</p>
          </div>
        </div>
      </div>
    )
  }

  const PAGES: Record<Page, React.ReactNode> = {
    home: <HomePage />,
    points: <PointsPage />,
    ai: <AIPage />,
    vr: <VRPage />,
    knowledge: <KnowledgePage />,
    leaderboard: <LeaderboardPage />,
  }

  return (
    <div className="flex h-full bg-[#FAFAFE]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col bg-white border-r border-[#E8E6F5] shrink-0 select-none">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#E8E6F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6D4AFF] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              L
            </div>
            <div>
              <p className="font-extrabold text-[#1A1A2E] text-sm leading-tight">LearnVerse</p>
              <p className="text-[10px] text-[#A78BFA] font-medium">新员工数字化实训平台</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(n => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                page === n.id
                  ? 'bg-[#6D4AFF] text-white shadow-xs'
                  : 'text-[#7B7A96] hover:bg-[#F0EEFF] hover:text-[#6D4AFF]'
              }`}
            >
              <span className="text-base w-5 text-center">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* User Pill Footer */}
        <div className="px-3 py-4 border-t border-[#E8E6F5]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F0EEFF] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D4AFF] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold shrink-0">
              ZH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1A1A2E] truncate">张晓航</p>
              <p className="text-[10px] text-[#A78BFA] truncate font-medium">初级副驾驶 · 白金学者</p>
            </div>
            <span className="text-[#C4C0E8] text-xs">⋯</span>
          </div>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-1 overflow-y-auto">
        {PAGES[page]}
      </main>

      {/* ── Interactive Modals ── */}
      {/* 1. Course Details & Quiz Modal */}
      {activeCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E8E6F5] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6F5]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F0EEFF] text-[#6D4AFF]">
                  {activeCourse.category}
                </span>
                <h3 className="font-bold text-base text-[#1A1A2E]">{activeCourse.title}</h3>
              </div>
              <button onClick={() => setActiveCourse(null)} className="text-[#7B7A96] hover:text-[#1A1A2E] text-sm cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-[#7B7A96] leading-relaxed">{activeCourse.description}</p>

            <div className="h-44 rounded-xl bg-[#1A1A2E] flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl cursor-pointer transition-transform hover:scale-110">
                ▶
              </div>
              <p className="text-xs text-white/70 mt-2">第 04 讲：核心操作程序仿真录屏</p>
            </div>

            <div className="p-3 bg-[#F8F7FF] rounded-xl border border-[#E8E6F5] space-y-2">
              <p className="text-xs font-bold text-[#1A1A2E]">随堂测验：标准流程中首要安全复核要点是？</p>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E8E6F5] cursor-pointer hover:border-[#6D4AFF]">
                  <input type="radio" name="quiz" defaultChecked />
                  <span>A. 检查备用高度表指示并调定当前场压 QNH (正确)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E8E6F5] cursor-pointer hover:border-[#6D4AFF]">
                  <input type="radio" name="quiz" />
                  <span>B. 直接断开主电源供电</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#7B7A96]">完成学习可获 +50 积分</span>
              <div className="flex gap-2">
                <button onClick={() => setActiveCourse(null)} className="px-4 py-2 rounded-lg text-xs font-medium text-[#7B7A96] hover:bg-slate-100 cursor-pointer">稍后</button>
                <button
                  onClick={() => {
                    setPoints(p => p + 50)
                    confetti({ particleCount: 80, spread: 70 })
                    alert(`恭喜完成《${activeCourse.title}》章节，已发放 50 积分！`)
                    setActiveCourse(null)
                  }}
                  className="px-4 py-2 bg-[#6D4AFF] hover:bg-[#5B38E8] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  完成学习并领取积分
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Knowledge Document Modal */}
      {activeDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8E6F5] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6F5]">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0EEFF] text-[#6D4AFF]">{activeDoc.cat}</span>
                <h3 className="font-bold text-base text-[#1A1A2E] mt-1">{activeDoc.title}</h3>
              </div>
              <button onClick={() => setActiveDoc(null)} className="text-[#7B7A96] hover:text-[#1A1A2E] text-sm cursor-pointer">✕</button>
            </div>

            <div className="max-h-72 overflow-y-auto p-4 bg-[#FAFAFE] rounded-xl border border-[#E8E6F5] text-xs leading-relaxed text-[#1A1A2E] space-y-3 whitespace-pre-line font-sans">
              {activeDoc.content}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#7B7A96]">受控编号: CCAR-2026-{activeDoc.id}</span>
              <button
                onClick={() => {
                  alert(`《${activeDoc.title}》离线手册下载成功！`)
                  setActiveDoc(null)
                }}
                className="px-4 py-2 bg-[#6D4AFF] hover:bg-[#5B38E8] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                下载离线文档
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Check-in Modal */}
      {isCheckinModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#E8E6F5]">
            <span className="text-4xl">🔥</span>
            <div>
              <h3 className="text-lg font-bold text-[#1A1A2E]">打卡签到成功！</h3>
              <p className="text-xs text-[#7B7A96] mt-1">已连续实训 <span className="text-[#6D4AFF] font-bold">{streakDays}</span> 天 · 获得 +30 积分奖励</p>
            </div>
            <button
              onClick={() => setIsCheckinModalOpen(false)}
              className="w-full py-2 bg-[#6D4AFF] hover:bg-[#5B38E8] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              太棒了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
