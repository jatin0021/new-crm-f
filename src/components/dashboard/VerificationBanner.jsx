import React from 'react';
import { ArrowRight, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';

export default function VerificationBanner({ onVerify = () => {} }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white p-6 sm:p-7 shadow-xl border border-emerald-500/25">
      {/* Background Ambient Glows */}
      <div className="absolute right-6 -top-16 w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute left-1/3 -bottom-16 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Illustration Icon & Text */}
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
          {/* Card / Graphic Icon */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-[2px] shadow-lg shadow-emerald-500/30 flex items-center justify-center transform -rotate-1 hover:rotate-0 transition-all duration-300">
              <div className="w-full h-full bg-slate-950/90 backdrop-blur-md rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-400 rounded-full border-2 border-slate-950 flex items-center justify-center font-black text-[11px] text-slate-950 shadow-md">
                  ✓
                </div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-300 absolute -top-1 -left-1 animate-pulse" />
          </div>

          {/* Heading and Subtext */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> KYC Verification Required
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Complete Account Identity Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Verify your profile today to unlock live MT5 trading and remove the default{' '}
              <span className="font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-md border border-cyan-400/30 font-mono">
                $5,000 deposit cap
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="w-full md:w-auto flex justify-end shrink-0">
          <button
            onClick={onVerify}
            className="w-full md:w-auto px-7 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Verify Profile Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}


