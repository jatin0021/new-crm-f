import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  Globe, 
  Calendar, 
  Zap, 
  Layers, 
  Search, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Newspaper, 
  ShieldCheck,
  ChevronRight,
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function MarketAnalysisPage() {
  const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'chart' | 'news' | 'calendar' | 'indicators'

  // Symbol Selection
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');

  // Insights State
  const [insights, setInsights] = useState([
    {
      symbol: 'EURUSD',
      name: 'Euro / US Dollar',
      timeframe: 'H4',
      conviction_bullish: 78,
      conviction_bearish: 22,
      trend: 'Bullish Continuation',
      pattern: 'Ascending Triangle Breakout',
      support: 1.0850,
      resistance: 1.0920,
      target: 1.0980,
      indicators: {
        rsi: { value: 62.4, status: 'Bullish' },
        macd: { value: '0.0014 (Crossover)', status: 'Bullish' },
        stochastic: { value: '74.2 / 68.5', status: 'Neutral' },
        bollinger: { value: 'Expanding Width', status: 'Volatile' },
        ema20_50: { value: 'EMA 20 > EMA 50', status: 'Golden Cross' },
        supertrend: { value: '1.0835 Green Line', status: 'Buy Signal' }
      }
    },
    {
      symbol: 'XAUUSD',
      name: 'Gold / US Dollar',
      timeframe: 'D1',
      conviction_bullish: 84,
      conviction_bearish: 16,
      trend: 'Strong Uptrend',
      pattern: 'Cup & Handle Accumulation',
      support: 2420.00,
      resistance: 2480.00,
      target: 2520.00,
      indicators: {
        rsi: { value: 68.1, status: 'Strong Bullish' },
        macd: { value: '12.4 (Expanding)', status: 'Bullish' },
        stochastic: { value: '82.0 (Overbought)', status: 'Bullish' },
        bollinger: { value: 'Upper Band Touch', status: 'High Momentum' },
        ema20_50: { value: 'EMA 20 > EMA 200', status: 'Bullish' },
        supertrend: { value: '2410.00 Green', status: 'Buy Signal' }
      }
    },
    {
      symbol: 'BTCUSD',
      name: 'Bitcoin / US Dollar',
      timeframe: 'H1',
      conviction_bullish: 45,
      conviction_bearish: 55,
      trend: 'Bearish Correction',
      pattern: 'Double Top Rejection',
      support: 58500.00,
      resistance: 62000.00,
      target: 56200.00,
      indicators: {
        rsi: { value: 41.2, status: 'Bearish' },
        macd: { value: '-120.5 (Divergence)', status: 'Bearish' },
        stochastic: { value: '32.1', status: 'Bearish' },
        bollinger: { value: 'Lower Band Contraction', status: 'Consolidating' },
        ema20_50: { value: 'EMA 20 < EMA 50', status: 'Death Cross' },
        supertrend: { value: '61200 Red Line', status: 'Sell Signal' }
      }
    }
  ]);

  // Calendar State
  const [calendar, setCalendar] = useState([
    { id: 1, title: 'US Non-Farm Payrolls (NFP)', time: '13:30 GMT', country: 'USD', impact: 'HIGH', forecast: '185K', previous: '175K', actual: '192K' },
    { id: 2, title: 'US Consumer Price Index (CPI YoY)', time: '13:30 GMT', country: 'USD', impact: 'HIGH', forecast: '3.1%', previous: '3.3%', actual: '3.0%' },
    { id: 3, title: 'ECB Interest Rate Decision', time: '12:15 GMT', country: 'EUR', impact: 'HIGH', forecast: '3.75%', previous: '4.00%', actual: '3.75%' },
    { id: 4, title: 'UK Retail Sales (MoM)', time: '07:00 GMT', country: 'GBP', impact: 'MEDIUM', forecast: '0.4%', previous: '-0.2%', actual: '0.5%' }
  ]);

  // News State
  const [news, setNews] = useState([
    { id: 101, category: 'Forex', title: 'ECB Signals Interest Rate Cut as Eurozone Inflation Cools to Target', time: '10 Mins Ago', source: 'Reuters Financial' },
    { id: 102, category: 'Crypto', title: 'Bitcoin Rebounds Above $60,000 as Institutional ETF Inflows Resume', time: '25 Mins Ago', source: 'CoinDesk Macro' },
    { id: 103, category: 'Commodities', title: 'Gold Surges Near All-Time Highs Amid Central Bank Accumulation', time: '1 Hour Ago', source: 'Bloomberg Markets' }
  ]);

  const [newsFilter, setNewsFilter] = useState('All');

  // Legacy URL Forwarder Check
  useEffect(() => {
    if (window.location.pathname.includes('/market-analysis')) {
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Fetch Insights & Calendar
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const insRes = await fetch('/api/analysis/insights');
        if (insRes.ok) {
          const insData = await insRes.json();
          if (insData.data?.insights) setInsights(insData.data.insights);
        }

        const calRes = await fetch('/api/analysis/calendar');
        if (calRes.ok) {
          const calData = await calRes.json();
          if (calData.data?.calendar) setCalendar(calData.data.calendar);
        }

        const newsRes = await fetch('/api/analysis/news');
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (newsData.data?.news) setNews(newsData.data.news);
        }
      } catch (e) {
        console.warn('Analysis fetch warning:', e.message);
      }
    };
    fetchAnalysisData();
  }, []);

  const activeInsight = insights.find(i => i.symbol === selectedSymbol) || insights[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Research Terminal</h1>
              <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase">
                Live Price Feed • AI Technicals
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time setups, algorithmic bullish/bearish conviction bars, and multi-indicator technical readings.</p>
          </div>
        </div>

        {/* Live Market Context Ticker */}
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-md flex items-center gap-4 w-full md:w-auto shrink-0 font-mono text-xs">
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-emerald-400">EURUSD</span>
            <span>1.0885</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">XAUUSD</span>
            <span>2,455.20</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Workspace Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'insights' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Technical Insights & Conviction</span>
        </button>

        <button
          onClick={() => setActiveTab('chart')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'chart' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>TradingView Charting Suite</span>
        </button>

        <button
          onClick={() => setActiveTab('indicators')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'indicators' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Multi-Indicator Suite</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'calendar' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Economic Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'news' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Live Financial News</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TECHNICAL INSIGHTS & CONVICTION BARS */}
      {/* ========================================================================= */}
      {activeTab === 'insights' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Symbol Selector List */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-3">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Select Target Instrument</h3>
              {insights.map(item => {
                const isSelected = selectedSymbol === item.symbol;
                return (
                  <div
                    key={item.symbol}
                    onClick={() => setSelectedSymbol(item.symbol)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs' 
                        : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.symbol}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{item.name}</p>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      item.conviction_bullish >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.conviction_bullish}% Bullish
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Symbol Deep-Dive Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{activeInsight.name} ({activeInsight.symbol})</h3>
                  <span className="text-xs font-bold text-teal-700 font-mono">Setup Timeframe: {activeInsight.timeframe} • Trend: {activeInsight.trend}</span>
                </div>

                <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded-full">
                  Pattern: {activeInsight.pattern}
                </span>
              </div>

              {/* Bullish vs Bearish Conviction Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase">
                  <span className="text-emerald-600">Bullish Conviction ({activeInsight.conviction_bullish}%)</span>
                  <span className="text-rose-600">Bearish Conviction ({activeInsight.conviction_bearish}%)</span>
                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    style={{ width: `${activeInsight.conviction_bullish}%` }} 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  ></div>
                  <div 
                    style={{ width: `${activeInsight.conviction_bearish}%` }} 
                    className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* Key Support & Resistance Matrix */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Support Level</span>
                  <span className="text-base font-black text-emerald-700 font-mono mt-0.5 block">{activeInsight.support}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Projected Target</span>
                  <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">{activeInsight.target}</span>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Resistance Level</span>
                  <span className="text-base font-black text-rose-700 font-mono mt-0.5 block">{activeInsight.resistance}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRADINGVIEW CHARTING SUITE */}
      {/* ========================================================================= */}
      {activeTab === 'chart' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">TradingView Technical Charting Suite</h2>
              <p className="text-xs text-slate-500">Interactive charting workspace with drawing tools, indicators, and multi-symbol switching.</p>
            </div>

            <div className="flex items-center gap-2">
              {['EURUSD', 'XAUUSD', 'BTCUSD', 'GBPUSD'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSymbol(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-mono cursor-pointer ${
                    selectedSymbol === s ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[520px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center text-white relative">
            <iframe
              title="TradingView Chart"
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${selectedSymbol}&interval=60&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC`}
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MULTI-INDICATOR TECHNICAL SUITE */}
      {/* ========================================================================= */}
      {activeTab === 'indicators' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Multi-Indicator Technical Suite ({activeInsight.symbol})
            </h3>
            <p className="text-xs text-slate-500 font-medium">Real-time technical indicator readings for RSI, MACD, Stochastic, Bollinger Bands, EMAs, and SuperTrend.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(activeInsight.indicators).map(([key, ind]) => (
              <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{key.toUpperCase()} Reading</span>
                <span className="text-base font-black text-slate-900 font-mono block">{ind.value}</span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full inline-block border border-teal-200">
                  {ind.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ECONOMIC MARKET CALENDAR */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              High-Impact Economic Market Calendar
            </h3>
            <p className="text-xs text-slate-500 font-medium">Macroeconomic event calendar filtered by country and volatility impact.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3">Country</th>
                  <th className="py-3 px-3">Event Title</th>
                  <th className="py-3 px-3">Volatility Impact</th>
                  <th className="py-3 px-3 text-right">Forecast</th>
                  <th className="py-3 px-3 text-right">Previous</th>
                  <th className="py-3 px-3 text-right">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {calendar.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{ev.time}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{ev.country}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">{ev.title}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                        ev.impact === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ev.impact}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">{ev.forecast}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">{ev.previous}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-600">{ev.actual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: LIVE FINANCIAL NEWS STREAM */}
      {/* ========================================================================= */}
      {activeTab === 'news' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-teal-600" />
              Live Financial Market News Stream
            </h3>
            <p className="text-xs text-slate-500 font-medium">Curated real-time financial news stream categorized by Forex, Crypto, Commodities, and Indices.</p>
          </div>

          <div className="space-y-3">
            {news.map(item => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{item.time} • {item.source}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
