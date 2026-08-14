import React from 'react';
import { ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

export default function TradingAccountCard({ onSetup = () => {} }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow card-shadow-hover flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute right-0 bottom-0 w-44 h-44 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Cpu className="w-4 h-4" />
            </div>
            <h3>Trading Account Setup</h3>
          </div>

          <span className="text-[10px] font-black px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full border border-teal-200/60 uppercase tracking-wider">
            MetaTrader 5 Active
          </span>
        </div>
      </div>

      {/* Modern Emerald Promo Banner Box */}
      <div 
        onClick={onSetup}
        className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-400 transition-all group shadow-md"
      >
        
        {/* Left Side: MT5 graphic icon & Message */}
        <div className="flex items-center gap-4">
          
          {/* MT5 Badge Graphic */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-[1.5px] shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] uppercase font-mono text-emerald-400 leading-none tracking-widest font-black">META</span>
                  <span className="text-xs font-black text-white leading-none mt-0.5 font-mono">MT5</span>
                </div>
              </div>
            </div>
            
            {/* Alert Exclamation Dot */}
            <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-emerald-400 rounded-full text-slate-950 flex items-center justify-center font-black text-[10px] shadow-sm">
              !
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
              Your MetaTrader 5 account is ready!
            </h4>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              Configure leverage credentials to trade{' '}
              <span className="font-bold text-emerald-400">1,000+ financial assets</span>.
            </p>
          </div>

        </div>

        {/* Right Arrow Button */}
        <div className="shrink-0">
          <button 
            className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 group-hover:from-emerald-300 group-hover:to-cyan-300 text-slate-950 flex items-center justify-center transition-all shadow-md group-hover:translate-x-0.5 cursor-pointer font-black"
            title="Complete MT5 Account Setup"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}


