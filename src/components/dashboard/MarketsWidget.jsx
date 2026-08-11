import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Star, ChevronRight } from 'lucide-react';

export default function MarketsWidget({ onTradeSymbol = () => {} }) {
  const [activeCategory, setActiveCategory] = useState('Forex');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Forex', 'Crypto', 'Shares', 'Indices', 'Metals', 'Energy', 'ETFs'];

  // Initial Market Instruments Data
  const [marketData, setMarketData] = useState({
    Forex: [
      { symbol: 'EURUSD', name: 'Euro / US Dollar', flag1: '🇪🇺', flag2: '🇺🇸', bid: 1.1560, change: -0.0010, percent: -0.08, points: [40, 38, 42, 35, 30, 28, 26, 25] },
      { symbol: 'GBPUSD', name: 'British Pound / USD', flag1: '🇬🇧', flag2: '🇺🇸', bid: 1.2742, change: 0.0031, percent: 0.24, points: [10, 15, 20, 25, 30, 38, 42, 50] },
      { symbol: 'USDJPY', name: 'USD / Japanese Yen', flag1: '🇺🇸', flag2: '🇯🇵', bid: 154.200, change: -0.120, percent: -0.078, points: [60, 58, 55, 50, 45, 42, 40, 38] },
      { symbol: 'AUDUSD', name: 'Australian Dollar / USD', flag1: '🇦🇺', flag2: '🇺🇸', bid: 0.6520, change: 0.0018, percent: 0.28, points: [20, 22, 28, 30, 35, 38, 40, 45] },
      { symbol: 'USDCAD', name: 'USD / Canadian Dollar', flag1: '🇺🇸', flag2: '🇨🇦', bid: 1.3850, change: -0.0022, percent: -0.16, points: [50, 48, 45, 40, 38, 35, 32, 30] },
    ],
    Crypto: [
      { symbol: 'BTCUSD', name: 'Bitcoin / USD', flag1: '🪙', flag2: '🇺🇸', bid: 96450.00, change: 1250.00, percent: 1.31, points: [10, 20, 15, 30, 45, 60, 55, 70] },
      { symbol: 'ETHUSD', name: 'Ethereum / USD', flag1: '🔹', flag2: '🇺🇸', bid: 2750.10, change: -45.20, percent: -1.61, points: [60, 55, 50, 40, 35, 30, 28, 25] },
      { symbol: 'SOLUSD', name: 'Solana / USD', flag1: '🟣', flag2: '🇺🇸', bid: 198.40, change: 8.50, percent: 4.47, points: [20, 30, 45, 40, 60, 75, 80, 95] },
    ],
    Metals: [
      { symbol: 'XAUUSD', name: 'Gold / US Dollar', flag1: '🥇', flag2: '🇺🇸', bid: 2865.40, change: 12.30, percent: 0.43, points: [25, 30, 35, 40, 48, 52, 58, 65] },
      { symbol: 'XAGUSD', name: 'Silver / US Dollar', flag1: '🥈', flag2: '🇺🇸', bid: 32.15, change: -0.22, percent: -0.68, points: [50, 48, 42, 38, 35, 30, 28, 24] },
    ],
    Indices: [
      { symbol: 'US30', name: 'Dow Jones Industrial', flag1: '🇺🇸', flag2: '📊', bid: 43890.0, change: 180.5, percent: 0.41, points: [15, 25, 30, 40, 45, 50, 60, 68] },
      { symbol: 'US500', name: 'S&P 500 Index', flag1: '🇺🇸', flag2: '📊', bid: 5980.20, change: 24.10, percent: 0.40, points: [20, 30, 35, 45, 50, 58, 62, 70] },
      { symbol: 'NAS100', name: 'Nasdaq 100 Index', flag1: '🇺🇸', flag2: '💻', bid: 21150.0, change: -85.0, percent: -0.40, points: [65, 60, 55, 48, 42, 38, 32, 30] },
    ],
    Shares: [
      { symbol: 'AAPL', name: 'Apple Inc.', flag1: '🍎', flag2: '🇺🇸', bid: 232.50, change: 1.80, percent: 0.78, points: [30, 35, 40, 48, 52, 58, 62, 68] },
      { symbol: 'NVDA', name: 'NVIDIA Corp', flag1: '🟢', flag2: '🇺🇸', bid: 138.20, change: 4.10, percent: 3.06, points: [10, 25, 40, 55, 70, 85, 90, 100] },
    ],
    Energy: [
      { symbol: 'USOIL', name: 'WTI Crude Oil', flag1: '🛢️', flag2: '🇺🇸', bid: 72.40, change: -0.85, percent: -1.16, points: [60, 55, 48, 42, 38, 32, 28, 25] },
    ],
    ETFs: [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', flag1: '📈', flag2: '🇺🇸', bid: 596.80, change: 2.10, percent: 0.35, points: [20, 30, 35, 42, 48, 52, 58, 62] },
    ]
  });

  // Simulated Tick Updates for dynamic UI feel
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) => {
        const categoryItems = prev[activeCategory] || [];
        if (categoryItems.length === 0) return prev;
        
        const randomIndex = Math.floor(Math.random() * categoryItems.length);
        const item = categoryItems[randomIndex];
        const delta = (Math.random() - 0.49) * (item.bid * 0.001);
        const newBid = +(item.bid + delta).toFixed(item.bid > 100 ? 2 : 4);
        
        const updatedItems = [...categoryItems];
        updatedItems[randomIndex] = {
          ...item,
          bid: newBid,
        };

        return { ...prev, [activeCategory]: updatedItems };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeCategory]);

  const currentInstruments = (marketData[activeCategory] || []).filter(item => 
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-slate-900 font-extrabold text-xl tracking-tight">Financial Markets</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time quotes, spreads & streaming price updates across global asset classes.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symbol (e.g. EURUSD, BTCUSD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Category Tabs Header */}
      <div className="flex items-center gap-6 border-b border-slate-100 overflow-x-auto no-scrollbar mb-6 pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pb-3 text-xs sm:text-sm font-bold transition-colors relative whitespace-nowrap ${
                isActive ? 'text-indigo-600 font-extrabold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {cat}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Markets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 pb-3">
              <th className="pb-3 font-medium">Instrument</th>
              <th className="pb-3 font-medium">Bid Price</th>
              <th className="pb-3 font-medium">Change</th>
              <th className="pb-3 font-medium">Mini Chart</th>
              <th className="pb-3 font-medium text-right">24h Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentInstruments.map((item) => {
              const isPositive = item.percent >= 0;
              return (
                <tr 
                  key={item.symbol} 
                  onClick={() => onTradeSymbol(item.symbol)}
                  className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                >
                  {/* Symbol & Pair Icons */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-1 shrink-0 p-1 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-lg leading-none">{item.flag1}</span>
                        <span className="text-lg leading-none">{item.flag2}</span>
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                          {item.symbol}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">{item.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Bid Price */}
                  <td className="py-4 font-extrabold text-slate-900 font-mono">
                    {item.bid.toLocaleString('en-US', { minimumFractionDigits: item.bid > 100 ? 2 : 4 })}
                  </td>

                  {/* Price Change */}
                  <td className={`py-4 font-bold font-mono text-xs ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isPositive ? `+${item.change}` : item.change}
                  </td>

                  {/* Sparkline Graph SVG */}
                  <td className="py-4">
                    <div className="w-24 h-6">
                      <svg className="w-full h-full" viewBox="0 0 100 30">
                        <path
                          d={`M ${item.points.map((p, i) => `${i * 14},${30 - (p / 100) * 25}`).join(' L ')}`}
                          fill="none"
                          stroke={isPositive ? '#10B981' : '#F43F5E'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </td>

                  {/* Percentage */}
                  <td className="py-4 text-right">
                    <span className={`inline-flex items-center gap-0.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                      isPositive 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? `+${item.percent.toFixed(2)}%` : `${item.percent.toFixed(2)}%`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

