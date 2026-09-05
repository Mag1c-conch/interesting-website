import { useState, useEffect } from 'react'

interface EntranceScreenProps {
  onEnter: () => void
}

export default function EntranceScreen({ onEnter }: EntranceScreenProps) {
  const [isAccelerating, setIsAccelerating] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Listen to Enter / Space shortcut key for PPT presenter clickers
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

    // Subtle audio chime for takeoff
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(240, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.5)
        gain.gain.setValueAtTime(0.05, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.5)
      }
    } catch {
      // Audio not supported or blocked
    }

    // Smooth transition into study homepage
    setTimeout(() => {
      setIsFadingOut(true)
    }, 380)

    setTimeout(() => {
      onEnter()
    }, 700)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none font-sans transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0F223D 0%, #0B192C 48%, #050A12 100%)',
      }}
    >
      {/* ── Atmospheric Sky & Twilight Horizon ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft starry sky */}
        {[
          { top: '12%', left: '8%', delay: '0s', size: '2px' },
          { top: '18%', left: '82%', delay: '1.2s', size: '2.5px' },
          { top: '28%', left: '68%', delay: '0.6s', size: '2px' },
          { top: '15%', left: '40%', delay: '2s', size: '2px' },
          { top: '42%', left: '16%', delay: '1.5s', size: '2px' },
          { top: '55%', left: '86%', delay: '0.8s', size: '2.5px' },
          { top: '68%', left: '22%', delay: '2.4s', size: '2px' },
          { top: '10%', left: '58%', delay: '1.8s', size: '2px' },
        ].map((s, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `starTwinkle 3.5s ease-in-out infinite ${s.delay}`,
            }}
          />
        ))}

        {/* Ambient subtle center glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#E60026]/8 rounded-full blur-[140px]" />

        {/* High-altitude horizon dusk glow at bottom */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[160vw] h-[300px] rounded-[100%] bg-gradient-to-t from-sky-400/10 via-amber-500/5 to-transparent blur-xl pointer-events-none" />
      </div>

      {/* ── Elegant Airplane Cruising Naturally (No weird laser beams) ── */}
      <div className="absolute top-[20%] left-0 w-full pointer-events-none z-10">
        <div
          className="will-change-transform"
          style={{
            animation: isAccelerating
              ? 'none'
              : 'flightCruise 18s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            transform: isAccelerating ? 'translate(130vw, -25px) scale(1.15)' : undefined,
            transition: isAccelerating ? 'transform 0.75s cubic-bezier(0.2, 0.9, 0.2, 1)' : undefined,
          }}
        >
          <CleanAirliner isAccelerating={isAccelerating} />
        </div>
      </div>

      {/* ── Top Left Logo (Clean & Minimal) ── */}
      <header className="relative z-20 px-12 py-10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E60026] text-white flex items-center justify-center font-bold text-base shadow-lg shadow-red-950/40">
            ✈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-wider">深圳航空</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300 border border-amber-400/25">
                ZH · AIRLINES
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-widest font-mono">SHENZHEN AIRLINES</p>
          </div>
        </div>
      </header>

      {/* ── Center Stage: Minimal, Executive & Atmospheric ── */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-10">
        {/* Main Platform Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wide leading-tight drop-shadow-md">
          深圳航空数字化实训平台
        </h1>

        {/* English Subtitle */}
        <p className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-slate-400 uppercase mt-3.5">
          SHENZHEN AIRLINES DIGITAL LEARNING &amp; TRAINING PLATFORM
        </p>

        {/* Slogan */}
        <p className="text-base sm:text-lg text-slate-300 font-medium tracking-[0.2em] mt-7 opacity-90">
          翼展鹏城 · 笃行致远
        </p>

        {/* Single Refined Action Button */}
        <div className="mt-12">
          <button
            onClick={handleTriggerEnter}
            disabled={isAccelerating}
            style={{
              boxShadow: '0 0 30px rgba(230, 0, 38, 0.45), 0 10px 25px rgba(0, 0, 0, 0.5)',
            }}
            className="group px-11 py-3.5 bg-[#E60026] hover:bg-[#CC0022] active:scale-95 text-white font-bold text-base rounded-full transition-all duration-200 cursor-pointer flex items-center gap-3 border border-red-400/30 hover:border-red-300"
          >
            <span>{isAccelerating ? '正在进入...' : '进入平台'}</span>
            <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">➔</span>
          </button>
        </div>
      </main>

      {/* ── Subtle Bottom Padding (Completely Clean) ── */}
      <div className="relative z-20 py-8" />
    </div>
  )
}

// ── Clean & Refined Shenzhen Airlines Jet (No artificial light beams) ──
function CleanAirliner({ isAccelerating }: { isAccelerating: boolean }) {
  return (
    <div className="relative flex items-center">
      {/* Sleek Commercial Airliner SVG */}
      <svg
        className={`w-48 h-20 filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)] transition-transform duration-700 ${
          isAccelerating ? 'scale-115' : ''
        }`}
        viewBox="0 0 240 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="planeFuselage" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="20%" stopColor="#CBD5E1" />
            <stop offset="65%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <linearGradient id="tailFinRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E60026" />
            <stop offset="100%" stopColor="#8A0014" />
          </linearGradient>
        </defs>

        {/* Horizontal Tail Stabilizer */}
        <polygon points="12,38 38,40 48,43 18,43" fill="#94A3B8" />

        {/* Fuselage (Clean Airliner Body) */}
        <path
          d="M22,42 C45,42 160,42 200,45 C215,46 232,49 238,51 C230,54 210,56 180,56 C130,56 50,56 22,50 C16,49 14,44 22,42 Z"
          fill="url(#planeFuselage)"
        />

        {/* Vertical Stabilizer (Shenzhen Airlines Signature Red Tail Fin) */}
        <polygon points="15,42 42,42 32,8 18,8" fill="url(#tailFinRed)" />
        {/* Iconic Golden Feather Curve on Red Fin */}
        <path d="M22,12 Q30,24 36,42" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Swept-back Main Wing */}
        <polygon points="90,48 145,48 105,78 78,78" fill="#E2E8F0" />
        <polygon points="95,50 140,50 103,74 84,74" fill="#CBD5E1" />
        {/* Red Wingtip Winglet */}
        <polygon points="76,80 82,78 85,69 78,70" fill="#E60026" />
        {/* Strobe Light */}
        <circle cx="77" cy="76" r="1.5" fill="#EF4444" className="animate-ping" />

        {/* Turbofan Jet Engine Under Wing */}
        <rect x="98" y="54" width="28" height="9" rx="4.5" fill="#64748B" />
        <rect x="100" y="55" width="5" height="7" rx="2.5" fill="#1E293B" />
        <rect x="122" y="56" width="3" height="5" rx="1.5" fill="#E60026" />

        {/* Cockpit Windshield */}
        <polygon points="218,46 228,48 225,50 216,49" fill="#0B192C" />
        <polygon points="220,47 226,48 224,49 219,48" fill="#38BDF8" opacity="0.85" />

        {/* Passenger Cabin Windows */}
        <g fill="#0B192C" opacity="0.55">
          <circle cx="70" cy="47" r="1.2" />
          <circle cx="76" cy="47" r="1.2" />
          <circle cx="82" cy="47" r="1.2" />
          <circle cx="88" cy="47" r="1.2" />
          <circle cx="94" cy="47" r="1.2" />
          <circle cx="100" cy="47" r="1.2" />
          <circle cx="148" cy="47" r="1.2" />
          <circle cx="154" cy="47" r="1.2" />
          <circle cx="160" cy="47" r="1.2" />
          <circle cx="166" cy="47" r="1.2" />
          <circle cx="172" cy="47" r="1.2" />
          <circle cx="178" cy="47" r="1.2" />
          <circle cx="184" cy="47" r="1.2" />
          <circle cx="190" cy="47" r="1.2" />
          <circle cx="196" cy="47" r="1.2" />
          <circle cx="202" cy="47" r="1.2" />
        </g>
      </svg>
    </div>
  )
}
