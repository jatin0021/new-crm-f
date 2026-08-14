import React, { useState } from 'react';
import { Info, ChevronDown, ArrowDownRight, ArrowUpRight, Repeat, History, Wallet, Shield } from 'lucide-react';

export default function AssetsEstimateCard({ 
  balance = 0.00, 
  currency = 'USD', 
  onAction = () => {} 
}) {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const currencies = [
    { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
    { code: 'USDT', flag: '🪙', name: 'Tether Crypto' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow card-shadow-hover flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative Subtle Background Pattern */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-br from-emerald-500/5 to-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Wallet className="w-4 h-4" />
            </div>
            <h3>Total Assets Estimate</h3>
            <button 
              className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer" 
              title="Estimated net value across all wallet cash and MT5 trading balances"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60 uppercase tracking-wider">
            Live Portfolio
          </span>
        </div>

        {/* Balance Amount & Currency Selector */}
        <div className="relative mb-6">
          <div className="flex items-center gap-3">
            {/* Flag Icon */}
            <span className="text-2xl sm:text-3xl leading-none select-none p-2 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-xs">
              {currencies.find(c => c.code === selectedCurrency)?.flag || '🇺🇸'}
            </span>
            
            {/* Amount */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              
              {/* Currency Pill Dropdown */}
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-600 px-3 py-1 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-full transition-all cursor-pointer shadow-xs"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Breakdown Mini Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Wallet Cash</span>
              <span className="text-xs font-black text-slate-800 font-mono">$0.00 USD</span>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">MT5 Equity</span>
              <span className="text-xs font-black text-emerald-600 font-mono">$0.00 USD</span>
            </div>
          </div>

          {/* Currency Dropdown Menu */}
          {showCurrencyDropdown && (
            <div 
              className="absolute left-10 top-14 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in duration-150"
              onMouseLeave={() => setShowCurrencyDropdown(false)}
            >
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setSelectedCurrency(c.code); setShowCurrencyDropdown(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold flex items-center justify-between text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <button
          onClick={() => onAction('deposit')}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-full transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Deposit</span>
        </button>

        <button
          onClick={() => onAction('withdrawal')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-800 font-bold text-xs rounded-full transition-all border border-slate-200/80 hover:border-emerald-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Withdrawal</span>
        </button>

        <button
          onClick={() => onAction('transfer')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-800 font-bold text-xs rounded-full transition-all border border-slate-200/80 hover:border-emerald-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Transfer</span>
        </button>

        <button
          onClick={() => onAction('history')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-800 font-bold text-xs rounded-full transition-all border border-slate-200/80 hover:border-emerald-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

    </div>
  );
}

