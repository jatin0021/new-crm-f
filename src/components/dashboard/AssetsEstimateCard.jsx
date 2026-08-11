import React, { useState } from 'react';
import { Info, ChevronDown, ArrowDownRight, ArrowUpRight, Repeat, History } from 'lucide-react';

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
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow card-shadow-hover flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-lg mb-4">
          <h3>Total Assets Estimate</h3>
          <button 
            className="text-slate-400 hover:text-indigo-600 transition-colors" 
            title="Estimated net value across all wallet cash and MT5 trading balances"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Amount & Currency Selector */}
        <div className="relative mb-6">
          <div className="flex items-center gap-3">
            {/* Flag Icon */}
            <span className="text-2xl sm:text-3xl leading-none select-none p-2 bg-slate-50 border border-slate-200/60 rounded-2xl">
              {currencies.find(c => c.code === selectedCurrency)?.flag || '🇺🇸'}
            </span>
            
            {/* Amount */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              
              {/* Currency Pill Dropdown */}
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 px-2.5 py-1 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-lg transition-all"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
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
                  className="w-full px-4 py-2 text-left text-xs font-semibold flex items-center justify-between text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
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
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-xs hover:shadow active:scale-95 flex items-center gap-1.5"
        >
          <span>Deposit</span>
        </button>

        <button
          onClick={() => onAction('withdrawal')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>Withdrawal</span>
        </button>

        <button
          onClick={() => onAction('transfer')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>Transfer</span>
        </button>

        <button
          onClick={() => onAction('history')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>History</span>
        </button>
      </div>

    </div>
  );
}
