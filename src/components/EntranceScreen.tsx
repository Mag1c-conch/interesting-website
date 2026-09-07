import { useState, useEffect } from 'react'
import a350PlaneImg from '../assets/a350_shenzhen_transparent.png'

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
        // User-approved warm sunset twilight background
        background: 'linear-gradient(130deg, #070A14 0%, #101228 26%, #1D1533 52%, #321932 76%, #421E26 100%)',
      }}
    >
      {/* ── Atmospheric Twilight Sky & Shenzhen Sunset Glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft twinkling stars in the deep dusk sky */}
        {[
          { top: '6%', left: '8%', delay: '0s', size: '2px' },
          { top: '12%', left: '78%', delay: '1.2s', size: '2px' },
          { top: '18%', left: '46%', delay: '0.6s', size: '2px' },
          { top: '8%', left: '32%', delay: '2s', size: '1.5px' },
          { top: '24%', left: '16%', delay: '1.5s', size: '2px' },
          { top: '16%', left: '88%', delay: '0.8s', size: '2px' },
          { top: '5%', left: '60%', delay: '1.8s', size: '2.5px' },
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

        {/* Dusky evening clouds */}
        <div className="absolute top-[26%] left-[10%] w-[50vw] h-20 rounded-full bg-[#3B2050]/20 blur-3xl pointer-events-none" />
        <div className="absolute top-[30%] right-[15%] w-[42vw] h-24 rounded-full bg-[#522238]/25 blur-3xl pointer-events-none" />

        {/* Warm sunset afterglow on the right horizon */}
        <div className="absolute bottom-20 right-0 w-[55vw] max-w-[850px] h-[340px] bg-gradient-to-tl from-amber-500/25 via-rose-600/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-12 right-[8%] w-[35vw] max-w-[500px] h-[200px] bg-gradient-to-t from-orange-400/20 via-amber-300/10 to-transparent rounded-full blur-[70px] pointer-events-none" />

        {/* Ambient subtle center crimson glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-[#E60026]/8 rounded-full blur-[150px]" />
      </div>

      {/* ── Continuous Uniform Looping Shenzhen Airlines A350 with Realistic Contrail ── */}
      <div className="absolute top-[13%] sm:top-[15%] left-0 w-full pointer-events-none z-15">
        <div
          className="will-change-transform"
          style={{
            animation: isAccelerating
              ? 'none'
              : 'flightCruiseLinear 15s linear infinite',
            transform: isAccelerating ? 'translate(135vw, -35px) scale(1.15)' : undefined,
            transition: isAccelerating ? 'transform 0.75s cubic-bezier(0.2, 0.9, 0.2, 1)' : undefined,
          }}
        >
          <div
            className="will-change-transform"
            style={{
              animation: isAccelerating ? 'none' : 'flightGentleFloat 5.5s ease-in-out infinite',
            }}
          >
            <ShenzhenAirlinesA350WithContrail isAccelerating={isAccelerating} />
          </div>
        </div>
      </div>

      {/* ── Top Left Logo & Status ── */}
      <header className="relative z-20 px-8 sm:px-12 py-7 sm:py-9">
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

      {/* ── Center Stage: Clean & Elegant Title & Action Button ── */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-8 sm:-mt-4">
        {/* Main Platform Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wider leading-tight drop-shadow-lg">
          深航飞飞
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-slate-200 mt-2 tracking-wide">
          深圳航空数字化实训平台
        </p>

        {/* English Subtitle */}
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase mt-3">
          SHENZHEN AIRLINES DIGITAL LEARNING &amp; TRAINING PLATFORM
        </p>

        {/* Slogan */}
        <p className="text-sm sm:text-base text-amber-200/90 font-medium tracking-[0.25em] mt-5">
          翼展鹏城 · 笃行致远
        </p>

        {/* Action Button */}
        <div className="mt-8 sm:mt-10">
          <button
            onClick={handleTriggerEnter}
            disabled={isAccelerating}
            style={{
              boxShadow: '0 0 35px rgba(230, 0, 38, 0.55), 0 10px 25px rgba(0, 0, 0, 0.6)',
            }}
            className="group px-11 py-3.5 bg-[#E60026] hover:bg-[#CC0022] active:scale-95 text-white font-bold text-base rounded-full transition-all duration-200 cursor-pointer flex items-center gap-3 border border-red-400/40 hover:border-red-300"
          >
            <span>{isAccelerating ? '正在登机加速中...' : '进入平台'}</span>
            <span className="text-lg transition-transform duration-200 group-hover:translate-x-1.5">➔</span>
          </button>
        </div>
      </main>

      {/* ── Bottom: Precision-Proportioned Shenzhen Skyline Silhouette ── */}
      <div className="relative z-10 w-full pointer-events-none mt-auto">
        <ShenzhenPrecisionSkyline />
      </div>
    </div>
  )
}

// ── Authentic Shenzhen Airlines Airbus A350-900 Photographic Asset ("深圳号" / "寻梦鹏城" B-32FQ) with Contrail ──
// 100% authentic photographic asset provided by the user, enhanced with:
// 1. Physically-aligned Trent XWB engine condensation vapor contrail (starting precisely at engine exhaust x=59.3%, y=60.0%)
// 2. High scimitar winglet tip vortex wisp (at x=39.1%, y=7.8%)
// 3. Realistic pulsating wingtip red navigation strobe light
// 4. Clean cruise aerodynamics and smooth left-to-right sky glide
function ShenzhenAirlinesA350WithContrail({ isAccelerating }: { isAccelerating: boolean }) {
  return (
    <div className="relative inline-flex items-center pointer-events-none select-none">
      {/* ── Realistic Condensation Contrails Streaming Directly from Trent XWB Turbofans ── */}
      {/* Rolls-Royce Trent XWB engine exhaust plug is at x=51.6%, y=51.6% */}
      <div
        className="absolute left-[51.6%] top-[51.6%] -translate-y-1/2 pointer-events-none"
        style={{ animation: 'contrailPulse 3.5s ease-in-out infinite' }}
      >
        {/* Core Dense Jet Stream Plume */}
        <div
          className="w-44 sm:w-60 md:w-76 lg:w-96 h-2 sm:h-2.5 -translate-x-full rounded-full opacity-90"
          style={{
            background: 'linear-gradient(to left, rgba(255,255,255,0.98) 0%, rgba(240,249,255,0.85) 25%, rgba(224,242,254,0.4) 65%, transparent 100%)',
            filter: 'blur(1px)',
          }}
        />
        {/* Outer Expanding Billowing Vapor Stream */}
        <div
          className="w-52 sm:w-72 md:w-96 lg:w-[440px] h-4 sm:h-5 -translate-x-full -mt-3 sm:-mt-4 rounded-full opacity-75"
          style={{
            background: 'linear-gradient(to left, rgba(255,255,255,0.85) 0%, rgba(235,245,255,0.6) 30%, rgba(210,235,255,0.22) 70%, transparent 100%)',
            filter: 'blur(2.6px)',
          }}
        />
        {/* Upper Atmospheric Vapor Wisp */}
        <div
          className="w-40 sm:w-56 md:w-72 lg:w-80 h-1.5 -translate-x-full -mt-4 sm:-mt-5 ml-6 rounded-full opacity-50"
          style={{
            background: 'linear-gradient(to left, rgba(255,255,255,0.7) 0%, rgba(224,242,254,0.3) 50%, transparent 100%)',
            filter: 'blur(1.8px)',
          }}
        />
      </div>

      {/* ── Wingtip Vortex Contrail from Scimitar Winglet (at x=42.2%, y=4.7%) ── */}
      <div
        className="absolute left-[42.2%] top-[4.7%] -translate-y-1/2 pointer-events-none opacity-40"
        style={{ animation: 'contrailPulse 3.5s ease-in-out infinite 0.5s' }}
      >
        <div
          className="w-28 sm:w-40 md:w-52 lg:w-64 h-1 -translate-x-full rounded-full"
          style={{
            background: 'linear-gradient(to left, rgba(255,255,255,0.7) 0%, rgba(186,230,253,0.2) 60%, transparent 100%)',
            filter: 'blur(0.8px)',
          }}
        />
      </div>

      {/* ── Wingtip Navigation Red Strobe Light (at x=42.2%, y=4.7%) ── */}
      <div className="absolute left-[42.2%] top-[4.7%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping opacity-90" />
        <div className="w-1 h-1 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_#EF4444]" />
      </div>

      {/* ── Authentic Shenzhen Airlines A350-900 Photographic Asset ── */}
      <img
        src={a350PlaneImg}
        alt="深圳航空 A350-900 寻梦鹏城彩绘客机 (B-32FQ)"
        className={`w-[270px] sm:w-[350px] md:w-[440px] lg:w-[520px] max-w-none h-auto object-contain transition-transform duration-700 select-none pointer-events-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] ${
          isAccelerating ? 'scale-110' : ''
        }`}
        draggable={false}
      />
    </div>
  )
}

// ── Precision-Proportioned Shenzhen Skyline Silhouette ──
// Accurately incorporates user's newest feedback:
// 1. PAFC (平安金融中心 599.1m): TALLER (Apex at y=6, height = 314px!), exact crystalline truncated pyramid profile, sharp corner columns & chevron braces
// 2. Spring Bamboo (华润春笋 392m): Ultra-smooth continuous parabolic curvature, refined vertical light stripes (竖条纹流线光带) and soft glowing apex
// 3. Shenzhen Bay Stadium (深圳湾体育中心「春茧」): Clear, distinct curved white arch shell with vertical structural ribs and inner bowl glow
// 4. KK100 (京基100 441.8m): Asymmetric aerodynamic curved top with vertical pinstripe curtain wall lighting
// 5. Clean, refined architectural lighting (no cartoonish rooftop red spots)
function ShenzhenPrecisionSkyline() {
  return (
    <div className="relative w-full h-46 sm:h-56 md:h-66 lg:h-74 overflow-hidden pointer-events-none select-none">
      {/* Subtle Ground Fog & Atmospheric Ambient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#01040A] via-[#030610]/40 to-transparent pointer-events-none" />

      {/* ── Shenzhen Grand Landmarks SVG Panorama ── */}
      <svg
        className="w-full h-full object-cover object-bottom"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Deep Building Silhouette Gradients */}
          <linearGradient id="mainTowerGrad" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#0B1527" />
            <stop offset="40%" stopColor="#070D1A" />
            <stop offset="100%" stopColor="#020409" />
          </linearGradient>

          <linearGradient id="pafcTowerGrad" x1="0" y1="0" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#091424" />
            <stop offset="18%" stopColor="#1E2D48" />
            <stop offset="50%" stopColor="#0E192D" />
            <stop offset="82%" stopColor="#1E2D48" />
            <stop offset="100%" stopColor="#091424" />
          </linearGradient>

          <linearGradient id="bkgTowerGrad" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#050B16" />
            <stop offset="100%" stopColor="#010307" />
          </linearGradient>

          {/* Spring Bamboo Vertical Glow Gradient */}
          <linearGradient id="bambooStripeGrad" x1="0" y1="100%" x2="0" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* ── Layer 1: Background Distant Skyline Silhouette ── */}
        <g fill="url(#bkgTowerGrad)" opacity="0.65">
          <rect x="35" y="170" width="46" height="150" />
          <rect x="88" y="150" width="38" height="170" />
          <rect x="180" y="160" width="40" height="160" />
          <rect x="228" y="145" width="42" height="175" />
          <rect x="278" y="165" width="38" height="155" />
          {/* Space around Spring Cocoon kept clean */}
          <rect x="525" y="155" width="44" height="165" />
          <rect x="575" y="135" width="42" height="185" />
          <rect x="625" y="125" width="46" height="195" />
          <rect x="765" y="130" width="46" height="190" />
          <rect x="820" y="155" width="42" height="165" />
          <rect x="870" y="140" width="44" height="180" />
          <rect x="975" y="130" width="42" height="190" />
          <polygon points="975,130 996,112 1017,130" />
          <rect x="1030" y="145" width="40" height="175" />
          <rect x="1075" y="160" width="36" height="160" />
          <rect x="1178" y="150" width="42" height="170" />
          <rect x="1230" y="165" width="44" height="155" />
          <rect x="1285" y="140" width="46" height="180" />
          <rect x="1340" y="170" width="52" height="150" />
        </g>

        {/* ── Layer 2: Main Urban Building Masses (Grounded at y=320) ── */}
        <g fill="url(#mainTowerGrad)">
          {/* West Coast / Nanshan highrises */}
          <rect x="0" y="200" width="40" height="120" />
          <rect x="34" y="185" width="38" height="135" />
          <rect x="68" y="160" width="44" height="160" />

          {/* ── 深圳湾一号 (One Shenzhen Bay 350m) ── */}
          <rect x="126" y="115" width="44" height="205" rx="1.5" />

          {/* Mid-West commercial towers */}
          <rect x="176" y="160" width="36" height="160" />
          <rect x="210" y="140" width="38" height="180" />
          <rect x="244" y="165" width="40" height="155" />

          {/* Transition highrises framing Spring Bamboo */}
          <rect x="280" y="155" width="32" height="165" />

          {/* Mid-City towers between Spring Cocoon and PAFC */}
          <rect x="525" y="175" width="42" height="145" />
          <rect x="575" y="150" width="40" height="170" />
          <rect x="620" y="130" width="42" height="190" />
          <rect x="660" y="145" width="34" height="175" />

          {/* Futian CBD towers framing PAFC */}
          <rect x="754" y="140" width="42" height="180" />
          <rect x="792" y="160" width="38" height="160" />
          <rect x="826" y="145" width="42" height="175" />
          <rect x="864" y="160" width="38" height="160" />

          {/* Towers framing KK100 */}
          <rect x="965" y="150" width="40" height="170" />
          <rect x="1002" y="135" width="36" height="185" />
          <rect x="1036" y="155" width="38" height="165" />
          <rect x="1072" y="165" width="36" height="155" />

          {/* ── 地王大厦 (Diwang Building 383.9m) ── */}
          <rect x="1114" y="115" width="52" height="205" />

          {/* East Coast / Luohu high-rises */}
          <rect x="1172" y="150" width="38" height="170" />
          <rect x="1208" y="160" width="42" height="160" />
          <rect x="1248" y="140" width="40" height="180" />
          <rect x="1288" y="160" width="42" height="160" />
          <rect x="1328" y="175" width="40" height="145" />
          <rect x="1366" y="190" width="46" height="130" />
        </g>

        {/* ══════════════════════════════════════════════════════════════════
            ICON 1: 华润春笋 (China Resources Tower "Spring Bamboo" 392m)
            ULTRA-SMOOTH PARABOLIC CURVATURE & REFINED VERTICAL LIGHT STRIPES
           ══════════════════════════════════════════════════════════════════ */}
        <g id="spring-bamboo-smooth">
          {/* Main Bamboo Shoot Silhouette (Continuous Smooth Cubic Bézier, Reaches y=72, Height = 248px) */}
          <path
            d="M 296,320 
               C 298,215 316,110 330,72 
               C 344,110 362,215 364,320 Z"
            fill="url(#mainTowerGrad)"
            filter="drop-shadow(0 -4px 14px rgba(56, 189, 248, 0.2))"
          />

          {/* ── Ultra-Smooth Vertical Light Stripes (连续圆滑竖条纹流线光带) ── */}
          {/* Outer Boundary Luminous Ribs */}
          <path
            d="M 297,320 C 299,215 316,110 330,72"
            stroke="url(#bambooStripeGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 363,320 C 361,215 344,110 330,72"
            stroke="url(#bambooStripeGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Inner Smooth Converging Light Stripes */}
          <path
            d="M 308,320 C 311,215 321,114 330,72"
            stroke="#FEF08A"
            strokeWidth="1.4"
            opacity="0.9"
            strokeLinecap="round"
          />
          <path
            d="M 352,320 C 349,215 339,114 330,72"
            stroke="#FEF08A"
            strokeWidth="1.4"
            opacity="0.9"
            strokeLinecap="round"
          />
          <path
            d="M 319,320 C 321,215 326,118 330,72"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            opacity="0.95"
            strokeLinecap="round"
          />
          <path
            d="M 341,320 C 339,215 334,118 330,72"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            opacity="0.95"
            strokeLinecap="round"
          />

          {/* Central Vertical Spine Light Stripe */}
          <line
            x1="330"
            y1="320"
            x2="330"
            y2="72"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            opacity="1"
            strokeLinecap="round"
          />

          {/* Subtle Horizontal Structural Dividing Rings */}
          <ellipse cx="330" cy="125" rx="14" ry="2.2" stroke="#FEF08A" strokeWidth="0.8" fill="none" opacity="0.45" />
          <ellipse cx="330" cy="175" rx="20" ry="2.6" stroke="#FEF08A" strokeWidth="0.8" fill="none" opacity="0.4" />
          <ellipse cx="330" cy="225" rx="25" ry="3.0" stroke="#FEF08A" strokeWidth="0.8" fill="none" opacity="0.35" />
          <ellipse cx="330" cy="275" rx="29" ry="3.4" stroke="#FEF08A" strokeWidth="0.8" fill="none" opacity="0.3" />

          {/* Radiant Spire Apex Crown (Soft Architectural Glow, No Red Dot) */}
          <circle cx="330" cy="71" r="2.2" fill="#FFFFFF" />
          <circle cx="330" cy="71" r="5" fill="#FEF08A" opacity="0.45" />
        </g>

        {/* ══════════════════════════════════════════════════════════════════
            ICON 2: 华润深圳湾体育中心「春茧」 (Shenzhen Bay Stadium "Spring Cocoon")
            CLEAR, CRISP, PROMINENT CURVED ARCH SHELL & INNER STADIUM GLOW
           ══════════════════════════════════════════════════════════════════ */}
        <g id="spring-cocoon-clear-stadium">
          {/* Stadium Dark Silhouette Body */}
          <path
            d="M 376,320 Q 446,225 516,320 Z"
            fill="url(#mainTowerGrad)"
          />

          {/* Inner Stadium Bowl Light Opening */}
          <path
            d="M 400,320 Q 446,275 492,320 Z"
            fill="#051228"
          />
          <ellipse cx="446" cy="305" rx="42" ry="12" fill="#38BDF8" opacity="0.3" filter="blur(4px)" />
          <ellipse cx="446" cy="310" rx="35" ry="8" fill="#FDE047" opacity="0.25" filter="blur(3px)" />

          {/* Crisp Outer Double-Curved White Canopy */}
          <path
            d="M 375,320 Q 446,222 517,320"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgba(255,255,255,0.7))"
          />
          <path
            d="M 384,320 Q 446,236 508,320"
            stroke="#BAE6FD"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Distinct Vertical Structural Support Ribs */}
          <line x1="395" y1="320" x2="408" y2="278" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
          <line x1="412" y1="320" x2="422" y2="252" stroke="#FFFFFF" strokeWidth="1.3" opacity="0.85" />
          <line x1="432" y1="320" x2="437" y2="236" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.9" />
          <line x1="446" y1="320" x2="446" y2="228" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.95" />
          <line x1="460" y1="320" x2="455" y2="236" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.9" />
          <line x1="480" y1="320" x2="470" y2="252" stroke="#FFFFFF" strokeWidth="1.3" opacity="0.85" />
          <line x1="497" y1="320" x2="484" y2="278" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />

          {/* Stadium Rim Floodlight Nodes */}
          <circle cx="446" cy="226" r="2.2" fill="#FFFFFF" />
          <circle cx="420" cy="238" r="1.8" fill="#FFFFFF" opacity="0.9" />
          <circle cx="472" cy="238" r="1.8" fill="#FFFFFF" opacity="0.9" />

          {/* Curved Stadium Base Strip */}
          <path d="M 406,320 Q 446,295 486,320" stroke="#FDE047" strokeWidth="1.8" opacity="0.85" />
        </g>

        {/* ══════════════════════════════════════════════════════════════════
            ICON 3: 平安金融中心 (Ping An Finance Centre 599.1m)
            MUCH TALLER (Apex at y=6, Height = 314px!), PRECISE CRYSTAL PYRAMID SHAPE
           ══════════════════════════════════════════════════════════════════ */}
        <g id="pafc-tall-landmark">
          {/* Main Tower Body (Clean, soaring, tapered octagonal prism, flat cap at y=6!) */}
          <path
            d="M 688,320 
               L 699,65 
               L 714,6 
               L 726,6 
               L 741,65 
               L 752,320 Z"
            fill="url(#pafcTowerGrad)"
            filter="drop-shadow(0 -6px 20px rgba(0,0,0,0.85))"
          />

          {/* ── PAFC Flat Top Crown Deck (Truncated Crystal Observation Platform) ── */}
          <line x1="714" y1="6" x2="726" y2="6" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="715" y="7" width="10" height="2" fill="#FEF08A" opacity="0.95" />
          <circle cx="714" cy="6" r="1.2" fill="#FFFFFF" />
          <circle cx="726" cy="6" r="1.2" fill="#FFFFFF" />

          {/* Crown Facet Converging Edges */}
          <line x1="705" y1="65" x2="717" y2="6" stroke="#E2E8F0" strokeWidth="1.2" opacity="0.8" />
          <line x1="735" y1="65" x2="723" y2="6" stroke="#E2E8F0" strokeWidth="1.2" opacity="0.8" />

          {/* ── 4 Massive Stainless Steel Corner Megacolumns (外框角柱) ── */}
          {/* Left Corner Megacolumn */}
          <line x1="688" y1="320" x2="699" y2="65" stroke="#CBD5E1" strokeWidth="2.4" />
          <line x1="693" y1="320" x2="703" y2="65" stroke="#94A3B8" strokeWidth="1.2" opacity="0.75" />

          {/* Right Corner Megacolumn */}
          <line x1="752" y1="320" x2="741" y2="65" stroke="#CBD5E1" strokeWidth="2.4" />
          <line x1="747" y1="320" x2="737" y2="65" stroke="#94A3B8" strokeWidth="1.2" opacity="0.75" />

          {/* Center Vertical Axis Spine */}
          <line x1="720" y1="320" x2="720" y2="6" stroke="#CBD5E1" strokeWidth="1.6" opacity="0.8" />

          {/* ── 6 Stacked Chevron / V-shaped Mega-Trusses (人字形巨型斜撑，与真实大厦完全一致) ── */}
          <g stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            {/* Tier 1 (y=65 to y=105) */}
            <line x1="700" y1="65" x2="720" y2="105" />
            <line x1="740" y1="65" x2="720" y2="105" />
            <line x1="700" y1="105" x2="740" y2="105" strokeWidth="1" stroke="#94A3B8" />

            {/* Tier 2 (y=105 to y=148) */}
            <line x1="720" y1="105" x2="698" y2="148" />
            <line x1="720" y1="105" x2="742" y2="148" />
            <line x1="698" y1="148" x2="742" y2="148" strokeWidth="1" stroke="#94A3B8" />

            {/* Tier 3 (y=148 to y=191) */}
            <line x1="698" y1="148" x2="720" y2="191" />
            <line x1="742" y1="148" x2="720" y2="191" />
            <line x1="696" y1="191" x2="744" y2="191" strokeWidth="1" stroke="#94A3B8" />

            {/* Tier 4 (y=191 to y=234) */}
            <line x1="720" y1="191" x2="695" y2="234" />
            <line x1="720" y1="191" x2="745" y2="234" />
            <line x1="695" y1="234" x2="745" y2="234" strokeWidth="1" stroke="#94A3B8" />

            {/* Tier 5 (y=234 to y=277) */}
            <line x1="695" y1="234" x2="720" y2="277" />
            <line x1="745" y1="234" x2="720" y2="277" />
            <line x1="692" y1="277" x2="748" y2="277" strokeWidth="1" stroke="#94A3B8" />

            {/* Tier 6 (y=277 to y=320) */}
            <line x1="720" y1="277" x2="690" y2="320" />
            <line x1="720" y1="277" x2="750" y2="320" />
          </g>

          {/* Warm Floor Windows between Chevron Trusses */}
          <g fill="#FDE047" opacity="0.9">
            <rect x="712" y="72" width="16" height="2" />
            <rect x="710" y="85" width="20" height="2" />
            <rect x="708" y="97" width="24" height="2" />
            <rect x="706" y="115" width="28" height="2.5" />
            <rect x="705" y="127" width="30" height="2.5" />
            <rect x="704" y="139" width="32" height="2.5" />
            <rect x="703" y="158" width="34" height="2.5" />
            <rect x="702" y="170" width="36" height="2.5" />
            <rect x="701" y="182" width="38" height="2.5" />
            <rect x="700" y="201" width="40" height="2.5" />
            <rect x="699" y="213" width="42" height="2.5" />
            <rect x="698" y="225" width="44" height="2.5" />
            <rect x="697" y="244" width="46" height="2.5" />
            <rect x="696" y="256" width="48" height="2.5" />
            <rect x="695" y="268" width="50" height="2.5" />
            <rect x="694" y="287" width="52" height="2.5" />
            <rect x="693" y="299" width="54" height="2.5" />
          </g>
        </g>

        {/* ══════════════════════════════════════════════════════════════════
            ICON 4: 京基100 (KK100 441.8m)
            PROPER HEIGHT (y=55, Height = 265px) & VERTICAL STRIPES LIGHTING
           ══════════════════════════════════════════════════════════════════ */}
        <g id="kk100-vertical-stripes">
          {/* Main Tower with Asymmetric Curved Arc Crown */}
          <path
            d="M 914,320 L 914,130 Q 914,50 936,40 Q 958,50 958,130 L 958,320 Z"
            fill="url(#mainTowerGrad)"
          />

          {/* Aerodynamic Curved Top Arc Rim (Clean Architectural Glow, No Red Spot) */}
          <path
            d="M 916,125 Q 916,52 936,42 Q 956,52 956,125"
            stroke="#38BDF8"
            strokeWidth="1.6"
            fill="none"
            opacity="0.85"
          />
          <circle cx="936" cy="41" r="1.5" fill="#FFFFFF" />

          {/* KK100 Vertical Pinstripe Curtain Wall Lighting (竖条纹幕墙) */}
          <line x1="922" y1="75" x2="922" y2="320" stroke="#38BDF8" strokeWidth="1.1" opacity="0.65" />
          <line x1="928" y1="58" x2="928" y2="320" stroke="#BAE6FD" strokeWidth="1.1" opacity="0.75" />
          <line x1="936" y1="42" x2="936" y2="320" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.9" />
          <line x1="944" y1="58" x2="944" y2="320" stroke="#BAE6FD" strokeWidth="1.1" opacity="0.75" />
          <line x1="950" y1="75" x2="950" y2="320" stroke="#38BDF8" strokeWidth="1.1" opacity="0.65" />

          {/* KK100 Horizontal Office Windows */}
          <g fill="#FDE047" opacity="0.85">
            <rect x="922" y="88" width="28" height="2.5" />
            <rect x="922" y="104" width="28" height="2.5" />
            <rect x="922" y="120" width="28" height="2.5" />
            <rect x="922" y="136" width="28" height="2.5" />
            <rect x="922" y="152" width="28" height="2.5" />
            <rect x="922" y="168" width="28" height="2.5" />
            <rect x="922" y="184" width="28" height="2.5" />
            <rect x="922" y="200" width="28" height="2.5" />
            <rect x="922" y="216" width="28" height="2.5" />
            <rect x="922" y="232" width="28" height="2.5" />
            <rect x="922" y="248" width="28" height="2.5" />
            <rect x="922" y="264" width="28" height="2.5" />
            <rect x="922" y="280" width="28" height="2.5" />
            <rect x="922" y="296" width="28" height="2.5" />
          </g>
        </g>

        {/* ══════════════════════════════════════════════════════════════════
            ICON 5: 地王大厦 (Shun Hing Square / Diwang 383.9m)
            CLASSIC TWIN NEEDLE SPIRES (Silver-White Needles)
           ══════════════════════════════════════════════════════════════════ */}
        <g id="diwang-landmark">
          <line x1="1127" y1="115" x2="1127" y2="62" stroke="#CBD5E1" strokeWidth="1.6" />
          <circle cx="1127" cy="62" r="1.5" fill="#FFFFFF" />

          <line x1="1153" y1="115" x2="1153" y2="62" stroke="#CBD5E1" strokeWidth="1.6" />
          <circle cx="1153" cy="62" r="1.5" fill="#FFFFFF" />

          <polygon points="1120,115 1160,115 1156,106 1124,106" fill="#0A1628" />

          {/* Diwang Windows */}
          <g fill="#FDE047" opacity="0.85">
            <rect x="1120" y="125" width="16" height="2.5" />
            <rect x="1144" y="125" width="16" height="2.5" />
            <rect x="1120" y="138" width="16" height="2.5" />
            <rect x="1144" y="138" width="16" height="2.5" />
            <rect x="1120" y="152" width="40" height="2.5" />
            <rect x="1120" y="166" width="40" height="2.5" />
            <rect x="1120" y="180" width="40" height="2.5" />
            <rect x="1120" y="194" width="40" height="2.5" />
            <rect x="1120" y="208" width="40" height="2.5" />
            <rect x="1120" y="222" width="40" height="2.5" />
            <rect x="1120" y="236" width="40" height="2.5" />
            <rect x="1120" y="250" width="40" height="2.5" />
            <rect x="1120" y="264" width="40" height="2.5" />
            <rect x="1120" y="278" width="40" height="2.5" />
            <rect x="1120" y="292" width="40" height="2.5" />
            <rect x="1120" y="306" width="40" height="2.5" />
          </g>
        </g>

        {/* ── One Shenzhen Bay (深圳湾一号) ── */}
        <g id="one-sz-bay">
          <rect x="128" y="117" width="40" height="3" fill="#FFFFFF" opacity="0.95" />
          <g fill="#FDE047" opacity="0.85">
            <rect x="133" y="128" width="30" height="2.5" />
            <rect x="133" y="140" width="30" height="2.5" />
            <rect x="133" y="152" width="30" height="2.5" />
            <rect x="133" y="164" width="30" height="2.5" />
            <rect x="133" y="176" width="30" height="2.5" />
            <rect x="133" y="188" width="30" height="2.5" />
            <rect x="133" y="200" width="30" height="2.5" />
            <rect x="133" y="212" width="30" height="2.5" />
            <rect x="133" y="224" width="30" height="2.5" />
            <rect x="133" y="236" width="30" height="2.5" />
            <rect x="133" y="248" width="30" height="2.5" />
            <rect x="133" y="260" width="30" height="2.5" />
            <rect x="133" y="272" width="30" height="2.5" />
            <rect x="133" y="284" width="30" height="2.5" />
            <rect x="133" y="296" width="30" height="2.5" />
            <rect x="133" y="308" width="30" height="2.5" />
          </g>
        </g>

        {/* ── Surrounding Urban Windows (Harmonious City Night Lights) ── */}
        <g fill="#FDE047" opacity="0.8">
          <rect x="72" y="170" width="34" height="2.5" />
          <rect x="72" y="182" width="34" height="2.5" />
          <rect x="72" y="194" width="34" height="2.5" />
          <rect x="72" y="206" width="34" height="2.5" />
          <rect x="72" y="218" width="34" height="2.5" />

          <rect x="214" y="150" width="28" height="2.5" />
          <rect x="214" y="162" width="28" height="2.5" />
          <rect x="214" y="174" width="28" height="2.5" />
          <rect x="214" y="186" width="28" height="2.5" />

          <rect x="580" y="160" width="30" height="2.5" />
          <rect x="580" y="172" width="30" height="2.5" />
          <rect x="580" y="184" width="30" height="2.5" />
          <rect x="580" y="196" width="30" height="2.5" />

          <rect x="626" y="140" width="30" height="2.5" />
          <rect x="626" y="152" width="30" height="2.5" />
          <rect x="626" y="164" width="30" height="2.5" />
          <rect x="626" y="176" width="30" height="2.5" />

          <rect x="760" y="150" width="30" height="2.5" />
          <rect x="760" y="162" width="30" height="2.5" />
          <rect x="760" y="174" width="30" height="2.5" />
          <rect x="760" y="186" width="30" height="2.5" />

          <rect x="832" y="155" width="30" height="2.5" />
          <rect x="832" y="167" width="30" height="2.5" />
          <rect x="832" y="179" width="30" height="2.5" />

          <rect x="1008" y="145" width="24" height="2.5" />
          <rect x="1008" y="157" width="24" height="2.5" />
          <rect x="1008" y="169" width="24" height="2.5" />

          <rect x="1214" y="170" width="30" height="2.5" />
          <rect x="1214" y="182" width="30" height="2.5" />
          <rect x="1214" y="194" width="30" height="2.5" />

          <rect x="1254" y="150" width="28" height="2.5" />
          <rect x="1254" y="162" width="28" height="2.5" />
          <rect x="1254" y="174" width="28" height="2.5" />
        </g>

        {/* ── Soft Tech Cyan Window Accents ── */}
        <g fill="#38BDF8" opacity="0.75">
          <rect x="704" y="142" width="6" height="2" />
          <rect x="730" y="142" width="6" height="2" />
          <rect x="702" y="188" width="6" height="2" />
          <rect x="732" y="188" width="6" height="2" />
          <rect x="700" y="234" width="6" height="2" />
          <rect x="734" y="234" width="6" height="2" />

          <rect x="180" y="170" width="26" height="2.5" />
          <rect x="180" y="182" width="26" height="2.5" />

          <rect x="664" y="155" width="24" height="2.5" />
          <rect x="664" y="167" width="24" height="2.5" />

          <rect x="868" y="170" width="26" height="2.5" />
          <rect x="868" y="182" width="26" height="2.5" />

          <rect x="1042" y="165" width="26" height="2.5" />
          <rect x="1042" y="177" width="26" height="2.5" />
        </g>

        {/* ── Ground Boulevard Lighting Strip ── */}
        <line x1="0" y1="319" x2="1440" y2="319" stroke="#F59E0B" strokeWidth="1.2" opacity="0.4" />
        <line x1="120" y1="320" x2="1320" y2="320" stroke="#E60026" strokeWidth="1.5" opacity="0.3" />
      </svg>
    </div>
  )
}
