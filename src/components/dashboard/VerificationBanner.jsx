import React from 'react';
import { ShieldAlert, ArrowRight, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VerificationBanner({ onVerify = () => {} }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 shadow-md border border-indigo-800/40">
      {/* Background Glowing Shapes */}
      <div className="absolute right-10 -top-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute left-1/3 -bottom-10 w-56 h-56 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Illustration Icon & Text */}
        <div className="flex items-center gap-5 sm:gap-6 w-full md:w-auto">
          {/* Card / Graphic Icon */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-lg flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-all duration-300">
              <div className="w-full h-full bg-slate-950/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-300" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-slate-950 flex items-center justify-center font-black text-[10px] text-slate-950 shadow-sm">
                  ✓
                </div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -left-1 animate-pulse" />
          </div>

          {/* Heading and Subtext */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                Action Required
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Complete Account Identity Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Verify your profile today to unlock unlimited MT5 trading and lift the temporary{' '}
              <span className="font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                $5,000 deposit cap
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="w-full md:w-auto flex justify-end shrink-0">
          <button
            onClick={onVerify}
            className="w-full md:w-auto px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Verify Profile Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}

