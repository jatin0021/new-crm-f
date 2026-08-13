import React, { useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children, currentLang = 'EN', onLangChange = () => {}, isWide = false }) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'AR', name: 'العربية', flag: '🇦🇪' },
    { code: 'ZH', name: '中文', flag: '🇨🇳' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLangObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="min-h-screen w-full bg-[#021814] text-white flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* RUNNING SVG ANIMATED BACKGROUND (Emerald / Mint / Cyan Palette) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <svg 
          className="w-full h-full opacity-70"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 900" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients for Emerald/Mint Running SVG Paths */}
            <linearGradient id="gradient-wave-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="gradient-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#00f5a0" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="gradient-glow-particle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <radialGradient id="center-aurora" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#03251e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#021814" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Radial Ambient Center Aurora */}
          <rect width="100%" height="100%" fill="url(#center-aurora)" />

          {/* Running Animated Sine Wave Lines */}
          <g className="animate-pulse" style={{ animationDuration: '6s' }}>
            <path
              d="M-100,200 C300,50 600,450 1000,150 C1300,-50 1600,300 1800,100"
              fill="none"
              stroke="url(#gradient-wave-1)"
              strokeWidth="2.5"
              strokeDasharray="15 8"
              className="running-svg-fast"
            />
            <path
              d="M-100,200 C300,50 600,450 1000,150 C1300,-50 1600,300 1800,100"
              fill="none"
              stroke="#34d399"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>

          <g className="animate-pulse" style={{ animationDuration: '8s' }}>
            <path
              d="M-200,650 C250,850 550,350 950,750 C1250,1000 1550,550 1850,700"
              fill="none"
              stroke="url(#gradient-wave-2)"
              strokeWidth="2"
              strokeDasharray="20 10"
              className="running-svg-slow"
            />
          </g>

          {/* Second Layer of Flowing Dynamic Mesh Curves */}
          <path
            d="M-100,400 Q350,100 720,400 T1550,400"
            fill="none"
            stroke="url(#gradient-wave-1)"
            strokeWidth="1.5"
            opacity="0.6"
            strokeDasharray="12 6"
            className="running-svg-reverse"
          />

          <path
            d="M-100,500 Q400,800 800,450 T1600,500"
            fill="none"
            stroke="url(#gradient-wave-2)"
            strokeWidth="1.5"
            opacity="0.4"
            strokeDasharray="8 4"
            className="running-svg-fast"
          />

          {/* Running Glowing Particle Spheres */}
          <circle cx="200" cy="300" r="4" fill="url(#gradient-glow-particle)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="850" cy="220" r="5" fill="#34d399" className="animate-ping" style={{ animationDuration: '4s' }} />
          <circle cx="1150" cy="620" r="4" fill="#00f5a0" className="animate-ping" style={{ animationDuration: '5s' }} />
          <circle cx="450" cy="720" r="6" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '3.5s' }} />
        </svg>

        {/* Embedded CSS for Running SVG stroke-dashoffset Keyframe Animations */}
        <style>{`
          @keyframes runningSvgFlow {
            0% { stroke-dashoffset: 1000; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes runningSvgReverse {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 1000; }
          }
          .running-svg-fast {
            animation: runningSvgFlow 20s linear infinite;
          }
          .running-svg-slow {
            animation: runningSvgFlow 35s linear infinite;
          }
          .running-svg-reverse {
            animation: runningSvgReverse 25s linear infinite;
          }
        `}</style>
      </div>

      {/* Dynamic Background Emerald/Teal Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-emerald-600/30 via-teal-500/20 to-cyan-500/25 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[650px] h-[650px] bg-gradient-to-br from-teal-700/25 via-emerald-500/20 to-cyan-400/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top Bar: Brand Logo & Language Switcher */}
      <header className="w-full max-w-6xl flex items-center justify-between z-20 shrink-0 mb-4 sm:mb-6">
        {/* Vintage CRM Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-[1px] shadow-lg shadow-emerald-500/25">
            <div className="w-full h-full bg-[#03251e] rounded-[15px] flex items-center justify-center">
              <span className="text-emerald-400 font-serif italic font-black text-xl">V</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1 leading-none">
              Vintage<span className="text-emerald-400">CRM</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-200/80 font-bold leading-none mt-1">
              Trading CRM Portal
            </span>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="px-3.5 py-1.5 bg-[#04251e]/80 hover:bg-[#063328]/90 text-slate-200 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-2 border border-emerald-500/20 shadow-lg backdrop-blur-md cursor-pointer"
          >
            <span>{currentLangObj.flag}</span>
            <span>{currentLangObj.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-400/70" />
          </button>

          {showLangDropdown && (
            <div 
              className="absolute right-0 mt-2 w-40 bg-[#04241e]/95 rounded-2xl shadow-2xl border border-emerald-500/20 py-1.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setShowLangDropdown(false)}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { onLangChange(lang.code); setShowLangDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    currentLang === lang.code ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  <span className="text-[10px] uppercase text-emerald-300/60 font-mono">{lang.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Glassmorphism Card Container */}
      <main className={`relative z-10 w-full ${isWide ? 'max-w-[580px]' : 'max-w-[450px]'} my-auto py-2`}>
        {/* Glow halo behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-cyan-500/30 rounded-[32px] blur-xl opacity-75 pointer-events-none"></div>
        
        <div className="relative bg-[#03211b]/80 backdrop-blur-2xl border border-emerald-500/25 rounded-3xl p-6 sm:p-8 md:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.85)] shadow-emerald-950/70">
          {children}
        </div>
      </main>

    </div>
  );
}



