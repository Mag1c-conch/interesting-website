import { useState, useEffect } from 'react'

interface EntranceScreenProps {
  onEnter: () => void
}

export default function EntranceScreen({ onEnter }: EntranceScreenProps) {
  const [isAccelerating, setIsAccelerating] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Handle Enter / Space shortcut key for PPT presenter clickers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault()
        handleTriggerEnter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAccelerating])

  const handleTriggerEnter = () => {
    if (isAccelerating) return
    setIsAccelerating(true)

    // Subtle Web Audio sound for takeoff chime
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(260, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.6)
        gain.gain.setValueAtTime(0.06, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.6)
      }
    } catch {
      // Audio not supported or blocked
    }

    // Step 1: Airplane accelerates across screen
    // Step 2: Overlay fades out smoothly after 450ms
    setTimeout(() => {
      setIsFadingOut(true)
    }, 450)

    // Step 3: Transition completes, trigger onEnter into study homepage
    setTimeout(() => {
      onEnter()
    }, 780)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none font-sans transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 30%, #112642 0%, #0B192C 45%, #050B14 100%)',
      }}
    >
      {/* ── Background Atmosphere & Starfield ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle coordinate flight grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Ambient Shenzhen Red Glow in center */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#E60026]/12 rounded-full blur-[120px]" />
        {/* Ambient Gold glow */}
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] bg-amber-500/8 rounded-full blur-[100px]" />

        {/* Twinkling Stars */}
        {[
          { top: '15%', left: '10%', delay: '0s', size: '2px' },
          { top: '22%', left: '85%', delay: '1.2s', size: '3px' },
          { top: '35%', left: '70%', delay: '0.6s', size: '2px' },
          { top: '18%', left: '42%', delay: '2s', size: '2.5px' },
          { top: '48%', left: '18%', delay: '1.5s', size: '2px' },
          { top: '65%', left: '80%', delay: '0.8s', size: '3px' },
          { top: '78%', left: '25%', delay: '2.4s', size: '2px' },
          { top: '12%', left: '60%', delay: '1.8s', size: '2px' },
        ].map((s, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `starTwinkle 3s ease-in-out infinite ${s.delay}`,
            }}
          />
        ))}

        {/* Horizon Arc / Earth curvature glow at bottom */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[180vw] h-[280px] rounded-[100%] bg-gradient-to-t from-sky-400/10 via-transparent to-transparent blur-md pointer-events-none" />
      </div>

      {/* ── Airplane Flight Track (Left to Right) ── */}
      <div className="absolute top-[28%] left-0 w-full pointer-events-none z-10">
        <div
          className="will-change-transform"
          style={{
            animation: isAccelerating
              ? 'none'
              : 'flightCruise 16s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            transform: isAccelerating ? 'translate(135vw, -40px) scale(1.3)' : undefined,
            transition: isAccelerating ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
          }}
        >
          <AirplaneSilhouette isAccelerating={isAccelerating} />
        </div>
      </div>

      {/* ── Top Header Navigation Bar ── */}
      <header className="relative z-20 flex items-center justify-between px-10 py-8">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E60026] text-white flex items-center justify-center font-bold text-base shadow-lg shadow-rose-900/40">
            ✈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-wider">深圳航空</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300 border border-amber-400/30">
                ZH · AIRLINES
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide">SHENZHEN AIRLINES DIGITAL TRAINING</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>数字化实训专网 · 运行正常</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">v2.4 (2026)</span>
        </div>
      </header>

      {/* ── Center Stage: Title, Slogan & Highlights ── */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-4">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-slate-200 text-xs font-semibold mb-6 shadow-sm">
          <span className="text-amber-400">✦</span>
          <span>新入职空勤与地服人员数字化培训系统</span>
          <span className="text-slate-400">|</span>
          <span className="text-[#E60026] font-bold">卓越服务 · 从心启航</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
          深圳航空数字化实训平台
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium tracking-wide mt-4 max-w-2xl">
          「 翼展鹏城 · 笃行致远 · 启航卓越飞行生涯 」
        </p>

        {/* 4 Feature Highlight Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 max-w-2xl">
          {[
            { icon: '🥽', text: '3D 虚拟客舱实操' },
            { icon: '🤖', text: 'AI 规程智能伴学' },
            { icon: '★', text: '里程实训激励体系' },
            { icon: '📖', text: '官方服务手册底座' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 text-xs font-medium backdrop-blur-sm shadow-xs hover:border-[#E60026]/50 transition-colors"
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA Button */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            onClick={handleTriggerEnter}
            disabled={isAccelerating}
            style={{
              animation: 'pulseRedGlow 2.5s infinite ease-in-out',
            }}
            className="group relative px-10 py-4 bg-[#E60026] hover:bg-[#CC0022] active:scale-95 text-white font-bold text-base rounded-2xl transition-all duration-200 cursor-pointer shadow-xl flex items-center gap-3 border border-red-400/40"
          >
            <span>{isAccelerating ? '正在登机启航...' : '进入实训系统'}</span>
            <span className="text-lg transition-transform group-hover:translate-x-1">➔</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 text-[10px]">Enter ↵</span>
            <span>或</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 text-[10px]">Space</span>
            <span>键快速进入平台 · 适合 PPT 演示</span>
          </div>
        </div>
      </main>

      {/* ── Footer Navigation / Credentials ── */}
      <footer className="relative z-20 flex items-center justify-between px-10 py-6 border-t border-white/10 text-slate-400 text-xs">
        <div className="flex items-center gap-6">
          <span>深圳航空有限责任公司 · 培训部数字中心</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">SZX · 承德/深圳实训基地联动</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-500">© 2026 Shenzhen Airlines. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  )
}

// ── Stylized Modern Jet Airliner Component ──
function AirplaneSilhouette({ isAccelerating }: { isAccelerating: boolean }) {
  return (
    <div className="relative flex items-center">
      {/* Jet Contrails / Vapor Trails behind the plane */}
      <div
        className={`absolute right-[82%] top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ${
          isAccelerating ? 'w-[65vw] opacity-95 h-5' : 'w-[32vw] opacity-65 h-3'
        }`}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(230,0,38,0.08) 25%, rgba(245,158,11,0.25) 55%, rgba(255,255,255,0.75) 100%)',
          filter: 'blur(3px)',
          borderRadius: '9999px',
        }}
      />
      {/* Secondary thin high-speed light beam */}
      <div
        className={`absolute right-[85%] top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ${
          isAccelerating ? 'w-[80vw] opacity-100 h-1.5' : 'w-[40vw] opacity-45 h-0.5'
        }`}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(230,0,38,0.3) 30%, rgba(255,255,255,0.95) 100%)',
          boxShadow: '0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(230,0,38,0.7)',
        }}
      />

      {/* Modern Stylized Commercial Airliner SVG */}
      <svg
        className={`w-52 h-24 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] transition-transform duration-700 ${
          isAccelerating ? 'scale-125' : ''
        }`}
        viewBox="0 0 240 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="25%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <linearGradient id="tailRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E60026" />
            <stop offset="100%" stopColor="#8A0014" />
          </linearGradient>
          <linearGradient id="engineThrust" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="40%" stopColor="#60A5FA" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Engine exhaust thrust glow */}
        <polygon
          points="50,62 5,65 5,59"
          fill="url(#engineThrust)"
          opacity={isAccelerating ? 1 : 0.75}
        />

        {/* Horizontal Stabilizer (tail wing) */}
        <polygon points="12,42 38,44 48,47 18,47" fill="#94A3B8" />

        {/* Fuselage (Main Airplane Body) */}
        <path
          d="M22,46 C45,46 160,46 200,49 C215,50 232,53 238,55 C230,58 210,60 180,60 C130,60 50,60 22,54 C16,53 14,48 22,46 Z"
          fill="url(#fuselageGrad)"
        />

        {/* Vertical Stabilizer (Tail Fin with Shenzhen Red) */}
        <polygon points="15,46 42,46 32,12 18,12" fill="url(#tailRedGrad)" />
        {/* Golden curve on vertical fin */}
        <path d="M22,16 Q30,28 36,46" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Swept-back Main Wing */}
        <polygon points="90,52 145,52 105,82 78,82" fill="#E2E8F0" />
        {/* Wing flap / shadow */}
        <polygon points="95,54 140,54 103,78 84,78" fill="#CBD5E1" />
        {/* Red Wingtip Winglet */}
        <polygon points="76,84 82,82 85,73 78,74" fill="#E60026" />
        {/* Wingtip strobe light */}
        <circle cx="77" cy="80" r="1.5" fill="#EF4444" className="animate-ping" />

        {/* Jet Engine Under Wing */}
        <rect x="98" y="58" width="30" height="9" rx="4.5" fill="#64748B" />
        <rect x="100" y="59" width="6" height="7" rx="3" fill="#1E293B" />
        <rect x="124" y="60" width="4" height="5" rx="2" fill="#E60026" />

        {/* Cockpit Windshield (Cyan/Dark Blue Glasses) */}
        <polygon points="218,50 228,52 225,54 216,53" fill="#0B192C" />
        <polygon points="220,51 226,52 224,53 219,52" fill="#38BDF8" opacity="0.8" />

        {/* Passenger Cabin Windows (Row of sleek cabin portholes) */}
        <g fill="#0B192C" opacity="0.6">
          <circle cx="70" cy="51" r="1.2" />
          <circle cx="76" cy="51" r="1.2" />
          <circle cx="82" cy="51" r="1.2" />
          <circle cx="88" cy="51" r="1.2" />
          <circle cx="94" cy="51" r="1.2" />
          <circle cx="100" cy="51" r="1.2" />
          <circle cx="148" cy="51" r="1.2" />
          <circle cx="154" cy="51" r="1.2" />
          <circle cx="160" cy="51" r="1.2" />
          <circle cx="166" cy="51" r="1.2" />
          <circle cx="172" cy="51" r="1.2" />
          <circle cx="178" cy="51" r="1.2" />
          <circle cx="184" cy="51" r="1.2" />
          <circle cx="190" cy="51" r="1.2" />
          <circle cx="196" cy="51" r="1.2" />
          <circle cx="202" cy="51" r="1.2" />
        </g>
      </svg>
    </div>
  )
}
