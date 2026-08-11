import React from 'react';
import { ArrowRight, AlertCircle, Layers } from 'lucide-react';

export default function TradingAccountCard({ onSetup = () => {} }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow card-shadow-hover flex flex-col justify-between">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 font-extrabold text-lg">Trading Account Setup</h3>
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 uppercase tracking-wider">
          Instant MetaTrader 5
        </span>
      </div>

      {/* Modern Indigo Promo Banner Box */}
      <div 
        onClick={onSetup}
        className="bg-gradient-to-r from-indigo-50/80 via-slate-50 to-indigo-50/40 border border-indigo-100/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-300 transition-all group"
      >
        
        {/* Left Side: MT5 graphic icon & Message */}
        <div className="flex items-center gap-4">
          
          {/* MT5 Badge Graphic */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-indigo-500/30 shadow-xs flex items-center justify-center text-white font-extrabold text-xs tracking-tighter transform group-hover:scale-105 transition-transform">
              <div className="flex flex-col items-center">
                <span className="text-[9px] uppercase font-mono text-indigo-400 leading-none">META</span>
                <span className="text-sm font-black text-white leading-none mt-0.5">MT5</span>
              </div>
            </div>
            
            {/* Alert Exclamation Dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-white flex items-center justify-center font-bold text-[10px]">
              !
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Your MetaTrader 5 account is ready for setup!
            </h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Configure leverage credentials to start live trading on{' '}
              <span className="font-bold text-indigo-600">1,000+ global financial assets</span>.
            </p>
          </div>

        </div>

        {/* Right Arrow Button */}
        <div className="shrink-0">
          <button 
            className="w-9 h-9 rounded-full bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center transition-all shadow-xs group-hover:translate-x-0.5"
            title="Complete MT5 Account Setup"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

