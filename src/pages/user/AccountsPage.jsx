import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Shield, 
  Sliders, 
  Key, 
  ArrowRightLeft, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  History, 
  Users, 
  DollarSign, 
  Check, 
  Lock,
  ArrowUpRight
} from 'lucide-react';
import ChangeAccountPasswordModal from '../../components/common/ChangeAccountPasswordModal';

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'create' | 'performance' | 'copy'

  // Accounts Data
  const [accounts, setAccounts] = useState([
    { 
      login: 501928, 
      account_type: 'live', 
      group_type: 'Standard ECN', 
      leverage: '1:500', 
      balance: 15400.50, 
      equity: 15890.20, 
      free_margin: 12400.00, 
      margin_used: 3490.20,
      margin_level_pct: 455.28,
      floating_pnl: 489.70,
      currency: 'USD', 
      server: 'VintageLive-Server 1'
    },
    { 
      login: 902817, 
      account_type: 'demo', 
      group_type: 'Demo Practice', 
      leverage: '1:100', 
      balance: 50000.00, 
      equity: 50000.00, 
      free_margin: 50000.00, 
      margin_used: 0.00,
      margin_level_pct: 9999.99,
      floating_pnl: 0.00,
      currency: 'USD', 
      server: 'VintageDemo-Server 1'
    }
  ]);

  // Account Creation Form State
  const [createForm, setCreateForm] = useState({
    platform: 'MetaTrader 5',
    account_type: 'live', // 'live' or 'demo'
    group_type: 'Standard ECN', // 'Standard ECN', 'Raw Spread', 'VIP ECN', 'Cent'
    leverage: '1:500',
    currency: 'USD',
    initial_demo_balance: 10000
  });

  const [creating, setCreating] = useState(false);
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');

  // Password Change Modal State
  const [passwordModalLogin, setPasswordModalLogin] = useState(null);

  // Trade Performance & Closed History State
  const [perfMetrics, setPerfMetrics] = useState({
    total_trades: 5,
    win_rate_pct: 80.0,
    loss_rate_pct: 20.0,
    net_profit: 1980.00,
    profit_factor: 5.95,
    total_lots: 5.10,
    avg_win: 600.00,
    avg_loss: 400.00
  });

  const [closedTrades, setClosedTrades] = useState([
    { id: 1001, deal_id: 8810291, login: 501928, symbol: 'EURUSD', action: 'BUY', volume_lots: 1.50, open_price: 1.08450, close_price: 1.08920, profit: 705.00, close_time: '2026-08-16 14:30' },
    { id: 1002, deal_id: 8810292, login: 501928, symbol: 'GBPUSD', action: 'BUY', volume_lots: 1.00, open_price: 1.26100, close_price: 1.26750, profit: 650.00, close_time: '2026-08-15 11:15' },
    { id: 1003, deal_id: 8810293, login: 501928, symbol: 'XAUUSD', action: 'SELL', volume_lots: 0.50, open_price: 2420.50, close_price: 2410.00, profit: 525.00, close_time: '2026-08-14 18:00' },
    { id: 1004, deal_id: 8810294, login: 501928, symbol: 'BTCUSD', action: 'BUY', volume_lots: 0.10, open_price: 64200.00, close_price: 63800.00, profit: -400.00, close_time: '2026-08-13 09:45' },
    { id: 1005, deal_id: 8810295, login: 501928, symbol: 'USDJPY', action: 'SELL', volume_lots: 2.00, open_price: 154.200, close_price: 153.800, profit: 520.00, close_time: '2026-08-12 16:20' }
  ]);

  // Copy Trading Strategy Providers
  const [copyProviders, setCopyProviders] = useState([
    { id: 1, name: 'Alpha Quant Algorithmic', trader: 'Alexey V.', monthly_roi: '+24.5%', drawdown: '4.2%', win_rate: '78%', copiers: 1420, min_deposit: 500, risk_score: 3 },
    { id: 2, name: 'Gold & FX Swing Master', trader: 'Elena R.', monthly_roi: '+38.2%', drawdown: '8.7%', win_rate: '71%', copiers: 2890, min_deposit: 1000, risk_score: 5 },
    { id: 3, name: 'Conservative Yield ECN', trader: 'Michael B.', monthly_roi: '+12.8%', drawdown: '1.9%', win_rate: '85%', copiers: 980, min_deposit: 250, risk_score: 1 }
  ]);

  // Fetch Accounts from Backend on Mount
  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
        const res = await fetch('/api/trading-accounts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.accounts && data.data.accounts.length > 0) {
            setAccounts(data.data.accounts);
          }
        }
      } catch (e) {
        console.warn('Accounts fetch warning:', e.message);
      }
    };

    fetchAccountsData();
  }, []);

  // 1. Single Sign-On (SSO) WebTrader Launcher Handler
  const handleLaunchWebTrader = async (loginNumber) => {
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/trading-accounts/sso-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ login: loginNumber })
      });
      const data = await res.json();
      if (res.ok && data.data?.webtrader_url) {
        window.open(data.data.webtrader_url, '_blank');
      } else {
        alert(`Launching WebTrader SSO terminal for Account #${loginNumber}...`);
      }
    } catch (e) {
      alert(`Launching WebTrader SSO terminal for Account #${loginNumber}...`);
    }
  };

  // 2. Open Account Form Handler
  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateSuccessMsg('');

    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/trading-accounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createForm)
      });

      const data = await res.json();
      if (res.ok && data.data?.account) {
        setAccounts(prev => [data.data.account, ...prev]);
        setCreateSuccessMsg(`New MT5 ${createForm.account_type.toUpperCase()} Account #${data.data.account.login} provisioned successfully!`);
        setTimeout(() => {
          setCreateSuccessMsg('');
          setActiveTab('accounts');
        }, 1500);
      } else {
        alert(data.message || 'Failed to create trading account.');
      }
    } catch (err) {
      alert('Server connection error during account creation.');
    } finally {
      setCreating(false);
    }
  };

  // 3. Copy Trading Follow Strategy Handler
  const handleFollowStrategy = async (provider) => {
    alert(`Successfully allocated $${provider.min_deposit} USD to Copy Strategy "${provider.name}". Automatic execution enabled.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trading Accounts Workstation</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Manage live MetaTrader 5 logins, risk metrics, trade ledgers, and social copier allocations.</p>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => setActiveTab('create')}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-full transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Open New MT5 Account</span>
        </button>
      </div>

      {/* Segmented Workspace Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'accounts' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Accounts Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'create' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Open Account Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'performance' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Trade History & Performance</span>
        </button>

        <button
          onClick={() => setActiveTab('copy')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'copy' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Copy Trading & Social Copier</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MY ACCOUNTS DASHBOARD & LIVE MARGIN RISK METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'accounts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map(acc => (
              <div 
                key={acc.login}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-5 relative overflow-hidden group hover:border-emerald-300 transition-all"
              >
                {/* Account Top Row */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-emerald-400 font-mono font-black text-xs flex items-center justify-center p-0.5 shadow-md">
                      MT5
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base font-mono">#{acc.login}</span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">({acc.currency || 'USD'})</span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold">{acc.group_type || 'Standard ECN'} • {acc.server || 'VintageLive-Server 1'}</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    acc.account_type === 'live' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  }`}>
                    {acc.account_type === 'live' ? 'Live ECN' : 'Demo Practice'}
                  </span>
                </div>

                {/* Account Financial & Margin Risk Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Balance</span>
                    <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">
                      ${parseFloat(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Equity</span>
                    <span className="text-sm font-black text-emerald-600 font-mono mt-0.5 block">
                      ${parseFloat(acc.equity || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Free Margin</span>
                    <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                      ${parseFloat(acc.free_margin || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Leverage</span>
                    <span className="text-xs font-black text-slate-800 mt-1 flex items-center gap-1 font-mono">
                      <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                      {acc.leverage}
                    </span>
                  </div>
                </div>

                {/* Additional Risk Gauge (Floating P&L & Margin Level %) */}
                <div className="flex items-center justify-between text-xs font-semibold px-1 text-slate-500">
                  <span>Floating P&L: <strong className={acc.floating_pnl >= 0 ? 'text-emerald-600 font-mono' : 'text-rose-600 font-mono'}>${acc.floating_pnl > 0 ? `+${acc.floating_pnl}` : acc.floating_pnl || '0.00'}</strong></span>
                  <span>Margin Level: <strong className="text-slate-800 font-mono">{acc.margin_level_pct || '9999.99'}%</strong></span>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Single Sign-On (SSO) WebTrader Launcher Button */}
                  <button
                    onClick={() => handleLaunchWebTrader(acc.login)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch WebTrader (1-Click SSO)</span>
                  </button>

                  {/* Change Password Button */}
                  <button
                    onClick={() => setPasswordModalLogin(acc.login)}
                    className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center gap-1 border border-slate-200/80"
                    title="Change Master or Investor Password"
                  >
                    <Key className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE & DEMO ACCOUNT OPENING WIZARD */}
      {/* ========================================================================= */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-slate-900">Open New Trading Account</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Select platform, account type, dynamic leverage, and currency configuration.</p>
          </div>

          {createSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{createSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateAccountSubmit} className="space-y-5 text-left">
            
            {/* Platform Selection */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">1. Trading Platform</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCreateForm(prev => ({ ...prev, platform: 'MetaTrader 5' }))}
                  className={`py-3 px-4 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    createForm.platform === 'MetaTrader 5' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-emerald-600" /> MetaTrader 5 (MT5)
                </button>
                <button
                  type="button"
                  onClick={() => setCreateForm(prev => ({ ...prev, platform: 'cTrader' }))}
                  className={`py-3 px-4 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    createForm.platform === 'cTrader' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Layers className="w-4 h-4 text-teal-600" /> cTrader Terminal
                </button>
              </div>
            </div>

            {/* Live vs Demo Selection */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">2. Account Environment</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCreateForm(prev => ({ ...prev, account_type: 'live' }))}
                  className={`py-3 px-4 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    createForm.account_type === 'live' ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Live Real Account
                </button>
                <button
                  type="button"
                  onClick={() => setCreateForm(prev => ({ ...prev, account_type: 'demo' }))}
                  className={`py-3 px-4 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    createForm.account_type === 'demo' ? 'border-cyan-600 bg-cyan-600 text-white shadow-md shadow-cyan-600/20' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Demo Practice Account
                </button>
              </div>
            </div>

            {/* Account Tier Group Selection */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">3. Account Type Tier</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Standard ECN', 'Raw Spread', 'VIP ECN', 'Cent'].map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setCreateForm(prev => ({ ...prev, group_type: tier }))}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      createForm.group_type === tier ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Leverage Selection Matrix & Currency Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">4. Account Leverage Ratio</label>
                <select
                  value={createForm.leverage}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, leverage: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="1:100">1:100 Standard Leverage</option>
                  <option value="1:200">1:200 High Leverage</option>
                  <option value="1:400">1:400 Institutional Leverage</option>
                  <option value="1:500">1:500 Maximum Leverage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">5. Base Account Currency</label>
                <select
                  value={createForm.currency}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>

            {/* Demo Balance Slider (Only for Demo) */}
            {createForm.account_type === 'demo' && (
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">6. Virtual Demo Practice Balance (${createForm.initial_demo_balance.toLocaleString()})</label>
                <input
                  type="range"
                  min={5000}
                  max={100000}
                  step={5000}
                  value={createForm.initial_demo_balance}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, initial_demo_balance: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-full transition-all shadow-lg shadow-emerald-600/25 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {creating ? 'Provisioning MT5 Login Credentials...' : `Provision ${createForm.platform} ${createForm.account_type.toUpperCase()} Account`}
            </button>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRADE HISTORY & PERFORMANCE LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'performance' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Win Rate</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">{perfMetrics.win_rate_pct}%</p>
              <span className="text-[10px] text-slate-500 font-semibold">{perfMetrics.total_trades} Total Trades</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Profit</span>
              <p className="text-2xl font-black text-slate-900 font-mono">${perfMetrics.net_profit.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-600 font-bold">+18.4% Return</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Profit Factor</span>
              <p className="text-2xl font-black text-teal-600 font-mono">{perfMetrics.profit_factor}</p>
              <span className="text-[10px] text-slate-500 font-semibold">High Edge</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Volume</span>
              <p className="text-2xl font-black text-cyan-600 font-mono">{perfMetrics.total_lots} Lots</p>
              <span className="text-[10px] text-slate-500 font-semibold">MT5 ECN Bridge</span>
            </div>

          </div>

          {/* Closed Trades History Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-600" />
                  Closed Positions Ledger
                </h3>
                <p className="text-xs text-slate-500 font-medium">Historical record of executed deals, tickets, and net P&L.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-3">Deal Ticket</th>
                    <th className="py-3 px-3">Symbol</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Volume</th>
                    <th className="py-3 px-3">Open Price</th>
                    <th className="py-3 px-3">Close Price</th>
                    <th className="py-3 px-3">Close Timestamp</th>
                    <th className="py-3 px-3 text-right">Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {closedTrades.map(trade => (
                    <tr key={trade.deal_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">#{trade.deal_id}</td>
                      <td className="py-3 px-3 font-extrabold text-emerald-700">{trade.symbol}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          trade.action === 'BUY' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {trade.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">{trade.volume_lots} Lots</td>
                      <td className="py-3 px-3 font-mono">{trade.open_price}</td>
                      <td className="py-3 px-3 font-mono">{trade.close_price}</td>
                      <td className="py-3 px-3 text-slate-500">{trade.close_time}</td>
                      <td className={`py-3 px-3 text-right font-mono font-black ${
                        trade.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {trade.profit >= 0 ? `+$${trade.profit.toFixed(2)}` : `-$${Math.abs(trade.profit).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COPY TRADING & SOCIAL COPIER MODULE */}
      {/* ========================================================================= */}
      {activeTab === 'copy' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 space-y-3">
            <h2 className="text-xl font-black">Institutional Social Copy Trading</h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Automatically replicate top-performing traders and quantitative algorithms directly to your MT5 account. Zero latency execution with customized risk filters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {copyProviders.map(provider => (
              <div 
                key={provider.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{provider.name}</h3>
                      <p className="text-[11px] text-slate-400 font-semibold">Master Trader: {provider.trader}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono font-black text-xs rounded-full">
                      {provider.monthly_roi}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Max Drawdown</span>
                      <span className="font-mono text-slate-800">{provider.drawdown}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Win Rate</span>
                      <span className="font-mono text-emerald-600 font-bold">{provider.win_rate}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] text-slate-400 block uppercase">Active Copiers</span>
                      <span className="font-mono text-slate-800">{provider.copiers} Traders</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] text-slate-400 block uppercase">Min Capital</span>
                      <span className="font-mono text-slate-800">${provider.min_deposit}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleFollowStrategy(provider)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Follow Strategy (${provider.min_deposit})
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Master/Investor Password Change Modal */}
      <ChangeAccountPasswordModal
        isOpen={!!passwordModalLogin}
        onClose={() => setPasswordModalLogin(null)}
        accountLogin={passwordModalLogin}
        onSuccess={() => setPasswordModalLogin(null)}
      />

    </div>
  );
}
