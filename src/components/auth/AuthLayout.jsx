import React, { useState } from 'react';
import { Globe, ChevronDown, MessageCircle, Sparkles } from 'lucide-react';

export default function AuthLayout({ children, currentLang = 'EN', onLangChange = () => {} }) {
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
    <div className="h-screen w-full flex flex-col lg:flex-row font-sans selection:bg-orange-500 selection:text-white bg-slate-50 overflow-hidden">
      
      {/* LEFT PANEL - 60% Width Premium Brand & 3D Artwork Section */}
      <div className="lg:w-[60%] bg-gradient-to-br from-[#072d3b] via-[#0b485b] to-[#f05a28] p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden text-white h-full shrink-0">
        
        {/* Ambient Decorative Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Left Brand Identity */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xl shadow-lg">
            <span className="text-orange-400 font-serif italic">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center gap-1 leading-none">
              Succeed<span className="text-orange-400">Capital</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-200/90 font-bold leading-none mt-1">
              Broker Web Platform
            </span>
          </div>
        </div>

        {/* Center Artwork & Tagline (Scaled for 60% left section width) */}
        <div className="my-auto py-4 relative z-10 flex flex-col items-center text-center space-y-6 max-w-lg mx-auto">
          
          {/* Floating 3D Artwork Badge Container */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
            
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-60 lg:h-60 rounded-3xl p-4 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
              <img 
                src="/auth_branding_3d.png" 
                alt="Succeed Capital 3D Branding"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] animate-bounce-subtle"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-600 to-orange-500 items-center justify-center text-white text-5xl font-black shadow-inner flex-col">
                <Sparkles className="w-16 h-16 text-amber-300 animate-pulse" />
                <span className="text-xs uppercase tracking-widest mt-2 font-bold">SUCCEED</span>
              </div>
            </div>
          </div>

          {/* Copywriting Tagline */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm leading-tight">
              Succeed <span className="text-orange-400">|</span> Trading, Redefined.
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/90 max-w-md mx-auto leading-relaxed">
              Login to your Succeed Capital Client Portal for Seamless Trading Experiences, Real-Time Execution & Institutional Liquidity.
            </p>
          </div>

        </div>

        {/* Bottom Footer Details */}
        <div className="relative z-10 flex items-center justify-between text-xs text-cyan-200/80 border-t border-white/10 pt-3.5">
          <span>© 2026 Succeed Capital Ltd. All Rights Reserved.</span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            Live Broker Engine Active
          </span>
        </div>

      </div>

      {/* RIGHT PANEL - 40% Width Authentication Form Container */}
      <div className="lg:w-[40%] bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative h-full overflow-hidden shrink-0">
        
        {/* Top Header Controls: Language Selector Dropdown */}
        <div className="flex justify-end items-center relative z-20 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 border border-slate-200 shadow-xs cursor-pointer"
            >
              <span>{currentLangObj.flag}</span>
              <span>{currentLangObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangDropdown && (
              <div 
                className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowLangDropdown(false)}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { onLangChange(lang.code); setShowLangDropdown(false); }}
                    className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center justify-between ${
                      currentLang === lang.code ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="text-[10px] uppercase text-slate-400 font-mono">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Main Form Children */}
        <div className="my-auto py-2 max-w-[420px] w-full mx-auto">
          {children}
        </div>

        {/* Floating Support Widget Button (Bottom Right) */}
        <div className="absolute bottom-6 right-6 z-40">
          <button 
            className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all group cursor-pointer"
            title="Live Support Chat"
          >
            <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
}
