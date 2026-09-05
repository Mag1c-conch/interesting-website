import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import EntranceScreen from './components/EntranceScreen'

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
  tags: { text: string; color: 'red' | 'dark' | 'orange' }[]
  duration: string
  users: string
  pts: string
  img: string
}

const COURSES: CourseItem[] = [
  {
    id: 'c1',
    title: '客舱紧急撤离演练',
    desc: '模拟紧急情况下乘客疏散全流程，提升实战应对能力',
    tags: [{ text: '必修', color: 'red' }, { text: '安全培训', color: 'dark' }],
    duration: '45分钟',
    users: '1,840 人',
    pts: '+150 积分',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'c2',
    title: '飞行机舱巡视服务',
    desc: '模拟客机飞行中常规巡视、饮食服务规范流程',
    tags: [{ text: '必修', color: 'red' }, { text: '乘务服务', color: 'dark' }],
    duration: '30分钟',
    users: '2,210 人',
    pts: '+120 积分',
    img: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'c3',
    title: '特殊旅客服务处理',
    desc: '演练老幼病残旅客及特殊状况的专业应对方案',
    tags: [{ text: '进阶', color: 'orange' }, { text: '服务培训', color: 'dark' }],
    duration: '35分钟',
    users: '1,320 人',
    pts: '+130 积分',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'c4',
    title: '深圳宝安机场导航',
    desc: '虚拟还原深圳宝安国际机场，熟悉航站环境与设施',
    tags: [{ text: '入门', color: 'red' }, { text: '机场航站', color: 'dark' }],
    duration: '25分钟',
    users: '3,050 人',
    pts: '+100 积分',
    img: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=700&q=80'
  }
]

interface KnowledgeDoc {
  id: string
  title: string
  cat: string
  time: string
  reads: string
  badges: { text: string; type: 'official' | 'required' | 'hot' | 'featured' }[]
  content: string
}

const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'd1',
    title: '深圳航空服务标准手册 (2024版)',
    cat: '规章制度',
    time: '15分钟',
    reads: '4,320',
    badges: [{ text: '官方', type: 'official' }, { text: '必读', type: 'required' }],
    content: '第一章：乘务员仪容仪表与站姿仪态规范\n1.1 妆容要求遵循深航职业形象指引，发网整洁无杂发...\n1.2 登机迎客鞠躬礼仪与问候手势标准...\n第二章：机上餐饮服务动线与防烫伤规范\n2.1 热饮分发温度控制与递送原则...'
  },
  {
    id: 'd2',
    title: '民用航空安全法规要点精解',
    cat: '安全法规',
    time: '20分钟',
    reads: '3,180',
    badges: [{ text: '官方', type: 'official' }, { text: '热门', type: 'hot' }],
    content: '第一部分：中国民用航空局 CCAR-121 部法规精髓\n针对空勤人员执勤时间限制、机上安保违规行为处置法则...\n第二部分：非法干扰行为处置 SOP\n机组协同配合流程与客舱安全员处突联动机制。'
  },
  {
    id: 'd3',
    title: '客舱空气质量与健康管理指南',
    cat: '乘务知识',
    time: '8分钟',
    reads: '2,040',
    badges: [],
    content: '高空巡航环境座舱增压气压相当于海拔 1800-2400 米高度，湿度通常低于 15%。机组应指导旅客适当饮水，并监控空调环控系统分配情况。'
  },
  {
    id: 'd4',
    title: '跨文化服务礼仪：国际航线乘客沟通',
    cat: '服务技能',
    time: '12分钟',
    reads: '2,870',
    badges: [{ text: '精选', type: 'featured' }],
    content: '国际及地区航线中，涉及宗教饮食禁忌、文化手势差异及外语专业服务用语。乘务人员应保持微笑、倾听并准确提供定制化协助。'
  },
  {
    id: 'd5',
    title: '航空气象基础：乘务员须知',
    cat: '航空知识',
    time: '10分钟',
    reads: '1,960',
    badges: [],
    content: '对流层颠簸与晴空颠簸 (CAT) 的特征分析。听到机长发出“机组请立即就座系好安全带”指令后，乘务员应就近锁定餐车并立刻在最近空座就座。'
  },
  {
    id: 'd6',
    title: '机上医疗急救流程与操作规范',
    cat: '安全培训',
    time: '18分钟',
    reads: '5,610',
    badges: [{ text: '官方', type: 'official' }, { text: '热门', type: 'hot' }],
    content: '心脏骤停急救全流程：AED 除颤仪定位与电极片黏贴要领；成人与儿童心肺复苏 (CPR) 按压频率与人工呼吸比例 (30:2)；机上急救药箱开启授权。'
  }
]

const LEADERBOARD_USERS = [
  { rank: 1, name: '陈思远', dept: '乘务一队', avatar: '陈', points: 12480, streak: 45, change: 0 },
  { rank: 2, name: '林晓薇', dept: '乘务二队', avatar: '林', points: 11320, streak: 38, change: 1 },
  { rank: 3, name: '王浩然', dept: '地勤部门', avatar: '王', points: 10950, streak: 30, change: -1 },
  { rank: 4, name: '张雨桐', dept: '乘务一队', avatar: '张', points: 9840, streak: 27, change: 2 },
  { rank: 5, name: '李明杰', dept: '安全地服', avatar: '李', points: 9210, streak: 22, change: -1 },
  { rank: 6, name: '你 (我)', dept: '新入职学员', avatar: '你', points: 8760, streak: 18, change: 3, isMe: true },
  { rank: 7, name: '赵诗涵', dept: '乘务二队', avatar: '赵', points: 8340, streak: 14, change: -2 },
]

type ChatMsg = { role: 'user' | 'ai'; text: string; time: string; refDoc?: string }

// ── Main Shell ──────────────────────────────────────────────────────────────

export default function App() {
  const [showEntrance, setShowEntrance] = useState(true)
  const [page, setPage] = useState<Page>('home')
  const [points, setPoints] = useState(8760)
  const [streakDays, setStreakDays] = useState(18)
  const [checkedInToday, setCheckedInToday] = useState(false)

  // Listen to Esc key to return to entrance screen for PPT demonstrations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showEntrance) {
        setShowEntrance(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showEntrance])

  const handleEnterPlatform = () => {
    setShowEntrance(false)
    setPage('home')
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } })
  }

  // Interactive Modals
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null)
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false)
  const [isVRRunning, setIsVRRunning] = useState(false)

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

  // ── Page 1: 学习主页 ───────────────────────────────────────────────────────
  function HomePage() {
    return (
      <div className="p-8 space-y-7 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#0B192C]">学习主页</h1>
          <p className="text-xs text-slate-500 mt-0.5">深圳航空全员数字化业务实训与今日学习任务</p>
        </div>

        {/* Hero Card */}
        <div className="relative rounded-2xl bg-[#0D1B2A] text-white p-7 overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E60026] text-white">
                  深圳航空 · 数字化培训
                </span>
                <span className="text-xs text-slate-300">持续实训 18 天</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                欢迎回来，李明杰！
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                今日建议优先完成【客舱紧急撤离演练】VR 实操课，已为您分配承德实训基地模拟客舱工位。
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setPage('vr')}
                  className="px-4 py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  进入 VR 模拟训练
                </button>
                <button
                  onClick={() => setPage('knowledge')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  查阅服务标准手册
                </button>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400">当前里程积分</p>
              <p className="text-4xl font-extrabold text-white font-mono mt-0.5">{points.toLocaleString()}</p>
              <span className="inline-block mt-2 text-[10px] px-2.5 py-1 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                高级乘务员 · 冲刺乘务长
              </span>
            </div>
          </div>
        </div>

        {/* 3 Stats Overview */}
        <div className="grid grid-cols-3 gap-5">
          <div 
            onClick={handleCheckIn}
            className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4 cursor-pointer hover:border-[#E60026] transition-colors"
          >
            <div className="text-3xl">🔥</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">{streakDays}天</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">连续学习</div>
              <div className="text-[11px] text-[#E60026] mt-0.5">{checkedInToday ? '今日已签到' : '点击打卡 +30分'}</div>
            </div>
          </div>

          <div className="bg-white border border-[#EEF0F4] rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">✓</div>
            <div>
              <div className="text-2xl font-extrabold text-[#0B192C] font-mono">247个</div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">完成实操任务</div>
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

        {/* Tasks Section */}
        <div className="bg-white border border-[#EEF0F4] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#0B192C]">今日实训任务（点击打钩完成）</h2>
            <span className="text-xs text-slate-400">完成可自动累加里程积分</span>
          </div>

          <div className="space-y-3">
            {dailyTasks.map(t => (
              <div
                key={t.id}
                onClick={() => handleToggleDailyTask(t.id)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold transition-colors ${
                    t.done ? 'bg-[#E60026] border-[#E60026] text-white' : 'border-slate-300 bg-white'
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
                onClick={() => alert(`【${b.title}】\n获得条件：${b.desc}\n状态：${b.earned ? '已获得' : '待解锁'}`)}
                className={`bg-white border rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all cursor-pointer shadow-2xs ${
                  b.earned ? 'border-[#EEF0F4] hover:border-[#E60026]' : 'border-[#EEF0F4] opacity-50'
                }`}
              >
                <div className="text-3xl my-1">{b.icon}</div>
                <div>
                  <h3 className="text-xs font-bold text-[#0B192C]">{b.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{b.desc}</p>
                </div>
                <span className={`text-[9px] mt-2 px-1.5 py-0.5 rounded font-medium ${
                  b.earned ? 'bg-rose-50 text-[#E60026]' : 'bg-slate-100 text-slate-400'
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

  // ── Page 3: VR 模拟训练 (EXACT REPLICA OF SCREENSHOT 2) ───────────────────
  function VRPage() {
    return (
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C]">VR 模拟训练舱</h1>
            <p className="text-xs text-slate-500 mt-0.5">沉浸式飞行模拟，提前感受真实客舱工作场景</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#E60026] text-[#E60026] bg-rose-50/50">
            ➔ 4 个训练模块可用
          </span>
        </div>

        {/* Notice Banner */}
        <div className="bg-[#0D1B2A] text-white rounded-2xl p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🥽</div>
            <div>
              <p className="font-bold text-sm">连接 VR 头显设备获得沉浸体验</p>
              <p className="text-xs text-slate-400 mt-0.5">支持 Meta Quest · Pico 4 · HTC Vive；也可在浏览器中 3D 预览</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => alert('检测到承德基地实训工位 VR 设备：Pico 4 Pro 已联机')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              检测设备
            </button>
            <button
              onClick={() => {
                setIsVRRunning(true)
                setSelectedCourse(COURSES[0])
              }}
              className="px-4 py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              进入模拟舱
            </button>
          </div>
        </div>

        {/* 4 Large Course Cards Grid (2x2) */}
        <div className="grid grid-cols-2 gap-5">
          {COURSES.map(c => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedCourse(c)
                setIsVRRunning(true)
              }}
              className="bg-white border border-[#EEF0F4] rounded-2xl overflow-hidden hover:border-[#E60026] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {c.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.color === 'red' ? 'bg-[#E60026] text-white' :
                        t.color === 'orange' ? 'bg-amber-600 text-white' :
                        'bg-slate-800/80 text-white backdrop-blur-xs'
                      }`}
                    >
                      {{ ...t }.text}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-sm text-[#0B192C] group-hover:text-[#E60026] transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
                  {c.desc}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span>⏱ {c.duration}</span>
                    <span>👤 {c.users}</span>
                  </div>
                  <span className="font-bold text-[#E60026]">{c.pts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Page 4: 航空知识库 (EXACT REPLICA OF SCREENSHOT 3) ─────────────────────
  function KnowledgePage() {
    const [selectedCat, setSelectedCat] = useState('全部')
    const [searchQ, setSearchQ] = useState('')

    const CATS = ['全部', '规章制度', '安全法规', '乘务知识', '服务技能', '航空知识', '安全培训']

    const filteredDocs = KNOWLEDGE_DOCS.filter(d => {
      if (selectedCat !== '全部' && d.cat !== selectedCat) return false
      if (searchQ.trim() && !d.title.includes(searchQ) && !d.cat.includes(searchQ)) return false
      return true
    })

    return (
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B192C]">航空知识库</h1>
            <p className="text-xs text-slate-500 mt-0.5">深圳航空官方规章与专业知识文章</p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#FEF9EE] text-[#B45309] border border-[#FDE68A]">
            官方规章已收录 48 篇
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">🔍</span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#EEF0F4] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#E60026] transition-colors shadow-2xs"
            placeholder="搜索规章、服务规范、知识文章..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-[#E60026] text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hero Featured Article Banner */}
        <div 
          onClick={() => setSelectedDoc(KNOWLEDGE_DOCS[0])}
          className="relative rounded-2xl bg-[#0D1B2A] text-white p-7 overflow-hidden shadow-md cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80"
              alt="Airplane wing in clouds"
              className="w-full h-full object-cover opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/80 to-[#0D1B2A]/70" />
          </div>

          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
              官方文件 2024 最新版
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              《深圳航空乘务员服务操作手册》全文 · 2024年修订版
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              包含 12 大服务章节，覆盖仪容仪表、餐食服务、应急处置等全部操作规范，新入职员工必读。
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span>⏱ 45分钟</span>
              <span>👁 18,240 阅读</span>
              <button className="px-3.5 py-1.5 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer">
                立即阅读
              </button>
            </div>
          </div>
        </div>

        {/* Document Cards Grid (2 Columns) */}
        <div className="grid grid-cols-2 gap-4">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-white border border-[#EEF0F4] rounded-2xl p-5 hover:border-[#E60026] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#E60026]">
                    {doc.cat}
                  </span>
                  <div className="flex items-center gap-1">
                    {doc.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          b.type === 'required' ? 'bg-rose-100 text-[#E60026]' :
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
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-3">
                <span>⏱ {doc.time}</span>
                <span>👁 {doc.reads}</span>
              </div>
            </div>
          ))}
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
                className={`px-4 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  tab === t ? 'bg-[#E60026] text-white' : 'text-slate-600 hover:text-slate-900'
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
                className={`grid grid-cols-[40px_1fr_120px_90px_60px] items-center px-6 py-3.5 transition-colors ${
                  u.isMe ? 'bg-[#FFF1F2]' : 'hover:bg-slate-50/60'
                }`}
              >
                <span className={`font-bold ${u.rank <= 3 ? 'text-[#E60026]' : 'text-slate-400'}`}>
                  {u.rank}
                </span>

                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    u.isMe ? 'bg-[#E60026] text-white' : 'bg-slate-100 text-slate-700'
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
                <span className={`font-bold text-right ${
                  u.change > 0 ? 'text-emerald-600' : u.change < 0 ? 'text-rose-500' : 'text-slate-300'
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

  // ── Page 6: AI 飞行助手 (Clean Chatbot) ────────────────────────────────────
  function AIPage() {
    const [messages, setMessages] = useState<ChatMsg[]>([
      { role: 'ai', text: '您好，李明杰！我是深圳航空专属 AI 伴学助手。您可以向我咨询《深圳航空服务标准手册》、应急撤离 SOP、服务礼仪或进行模拟问答。', time: '刚刚' }
    ])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = (textToSend?: string) => {
      const q = (textToSend || query).trim()
      if (!q || loading) return
      const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      setMessages(m => [...m, { role: 'user', text: q, time: now }])
      if (!textToSend) setQuery('')
      setLoading(true)

      setTimeout(() => {
        let answer = '根据《深圳航空乘务员服务操作手册》2024版规程，请务必严格遵照标准程序执行。您还可以查阅左侧知识库获取受控原文。'
        let ref = ''

        if (q.includes('撤离') || q.includes('应急') || q.includes('客舱')) {
          answer = '【客舱紧急撤离规程】\n1. 听到机长指令“撤离！撤离！”后，立即开启对应应急舱门并确认滑梯充气膨胀正常。\n2. 疏散口令标准用语：“松开安全带！抛弃所有行李！脱掉高跟鞋！往这边跑！”\n3. 确认所有区域旅客撤离完毕后，乘务长携带应急物资最后离机。'
          ref = '深圳航空服务标准手册 (2024版)'
        } else if (q.includes('礼仪') || q.includes('服务') || q.includes('问候')) {
          answer = '【服务礼仪规范】\n乘务员迎客时保持 15° 鞠躬，右手自然叠放在左手之上置于腹前；递送饮品时需使用托盘，热饮装杯不超过 70%，并温馨提示“请小心烫”。'
          ref = '跨文化服务礼仪：国际航线乘客沟通'
        } else if (q.includes('计划') || q.includes('学习')) {
          answer = '为您规划本周实训节奏：\n• 周一/周三：客舱安全法规与理论测验\n• 周二/周四：VR 紧急撤离与机舱巡视实操演练\n• 周五/周末：知识库深读与每周排行榜冲刺！'
        }

        setMessages(m => [...m, { role: 'ai', text: answer, time: now, refDoc: ref || undefined }])
        setLoading(false)
      }, 650)
    }

    return (
      <div className="flex flex-col h-full p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-[#E60026] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            ✦
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0B192C]">AI 飞行助手</h1>
            <p className="text-[11px] text-slate-400">深圳航空知识库伴学模型 · 实时在线</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${
                m.role === 'user' ? 'bg-[#E60026] text-white' : 'bg-[#0B192C] text-white'
              }`}>
                {m.role === 'user' ? '李' : 'AI'}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#E60026] text-white rounded-tr-xs'
                  : 'bg-white border border-[#EEF0F4] text-slate-800 rounded-tl-xs shadow-2xs whitespace-pre-line'
              }`}>
                {m.text}
                {m.refDoc && (
                  <div
                    onClick={() => {
                      const found = KNOWLEDGE_DOCS.find(d => d.title.includes(m.refDoc!))
                      if (found) setSelectedDoc(found)
                    }}
                    className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-[#E60026] font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>📖 参考依据：{m.refDoc}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-xl w-fit">
              <span className="animate-spin">⏳</span>
              <span>深航 AI 助手正在检索官方规章...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="flex gap-2 flex-wrap mb-3">
          {['客舱紧急撤离程序要点', '服务礼仪与问候规范', '机上医疗急救流程', '制定本周学习计划'].map(s => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="text-xs text-[#E60026] bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2 bg-white border border-[#EEF0F4] rounded-xl p-1.5 focus-within:border-[#E60026] transition-colors shadow-2xs">
          <input
            className="flex-1 px-3 py-2 text-xs text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
            placeholder="输入您要咨询的专业问题（如：紧急撤离口令、餐食服务规范）..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || loading}
            className="bg-[#E60026] hover:bg-[#CC0022] disabled:opacity-40 text-white text-xs px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer"
          >
            发送
          </button>
        </div>
      </div>
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  page === n.id
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
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.72c-.6-.34-1-.98-1-1.72a2 2 0 0 1 2-2m-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-6 5h6v1H9v-1z"/>
                  </svg>
                )}
                {n.iconType === 'vr' && (
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7H4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h4.3a2 2 0 0 0 1.7-1l1-1.5a1 1 0 0 1 1.6 0l1 1.5a2 2 0 0 0 1.7 1H20a3 3 0 0 0 3-3v-4a3 3 0 0 0-3-3zm-13 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
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
              李
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">李明杰</p>
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
        onClick={() => alert('深圳航空数字化学习中心 · 服务热线：400-777-9999\n当前版本：v2.4 (2026)')}
        className="fixed bottom-5 right-5 w-8 h-8 rounded-full bg-[#0B192C] hover:bg-[#E60026] text-white font-bold text-xs flex items-center justify-center shadow-lg cursor-pointer transition-colors z-40"
        title="帮助与支持"
      >
        ?
      </div>

      {/* ── Interactive Modals ── */}
      {/* VR Cockpit Simulation Modal */}
      {isVRRunning && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D1B2A] rounded-2xl max-w-xl w-full p-6 text-white space-y-4 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E60026]">VR SIMULATION</span>
                <h3 className="font-bold text-sm">{selectedCourse.title}</h3>
              </div>
              <button onClick={() => setIsVRRunning(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="h-48 rounded-xl bg-black border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 font-mono text-xs text-blue-300">
              <div className="flex justify-between">
                <span>SIM ENGINE: ACTIVE</span>
                <span className="text-emerald-400">90.0 FPS</span>
              </div>
              <div className="text-center my-auto space-y-2">
                <p className="text-base font-bold text-white tracking-wider">正在运行全景模拟实操...</p>
                <div className="flex justify-center gap-4 text-[11px] text-slate-400">
                  <span>客舱压强: 8.2 PSI</span>
                  <span>机组状态: NORMAL</span>
                  <span>环境音效: 开启</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>科目学时: {selectedCourse.duration}</span>
                <span>实训加分: {selectedCourse.pts}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">请使用手柄或鼠标核对客舱应急设备</span>
              <button
                onClick={() => {
                  setPoints(p => p + 120)
                  confetti({ particleCount: 70, spread: 60 })
                  alert(`恭喜完成《${selectedCourse.title}》实训科目！已奖励 120 里程积分！`)
                  setIsVRRunning(false)
                }}
                className="px-4 py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                完成本次实训并结算积分
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Reader Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#E60026]">{selectedDoc.cat}</span>
                <h3 className="font-bold text-base text-[#0B192C] mt-1">{selectedDoc.title}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <div className="max-h-72 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 space-y-2 whitespace-pre-line">
              {selectedDoc.content}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <span>阅读学时: {selectedDoc.time} · 受控版本: 2024-V3</span>
              <button
                onClick={() => {
                  alert(`《${selectedDoc.title}》离线 PDF 已保存至本地！`)
                  setSelectedDoc(null)
                }}
                className="px-4 py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                下载离线受控版
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check-in Celebration Modal */}
      {isCheckinModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="text-4xl">🔥</div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C]">签到打卡成功！</h3>
              <p className="text-xs text-slate-500 mt-1">已连续实训 <strong className="text-[#E60026]">{streakDays}</strong> 天 · 获得 +30 里程积分</p>
            </div>
            <button
              onClick={() => setIsCheckinModalOpen(false)}
              className="w-full py-2 bg-[#E60026] hover:bg-[#CC0022] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              确定
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
