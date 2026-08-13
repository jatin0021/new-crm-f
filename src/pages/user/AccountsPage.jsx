import React, { useState } from 'react';
import { Plus, Shield, Sliders, Key, ArrowRightLeft, CheckCircle2, Layers, Cpu, ExternalLink } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([
    { login: 5019284, type: 'Live MT5 Standard', leverage: '1:500', balance: 0.00, equity: 0.00, currency: 'USD', status: 'Active' },
    { login: 9028174, type: 'Demo MT5 Practice', leverage: '1:100', balance: 10000.00, equity: 10000.00, currency: 'USD', status: 'Demo' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [accountType, setAccountType] = useState('Live');
  const [leverage, setLeverage] = useState('1:500');

  const handleCreateAccount = (e) => {
    e.preventDefault();
    const newAcc = {
      login: Math.floor(1000000 + Math.random() * 9000000),
      type: `${accountType} MT5 ${accountType === 'Live' ? 'Standard' : 'Practice'}`,
      leverage,
      balance: accountType === 'Demo' ? 10000.00 : 0.00,
      equity: accountType === 'Demo' ? 10000.00 : 0.00,
      currency: 'USD',
      status: accountType === 'Live' ? 'Active' : 'Demo',
    };
    setAccounts([newAcc, ...accounts]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">MT5 Trading Accounts</h2>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
              {accounts.length} Active Accounts
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage live MetaTrader 5 trading accounts, demo balances, leverage ratios, and server credentials.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-full transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Open New MT5 Account</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div 
            key={acc.login} 
            className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow card-shadow-hover space-y-5 relative overflow-hidden group"
          >
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-mono font-black text-xs">
                    MT5
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900 text-base font-mono">#{acc.login}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">{acc.type}</p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                acc.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
              }`}>
                {acc.status}
              </span>
            </div>

            {/* Account Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Balance</p>
                <p className="text-base font-black text-slate-900 font-mono mt-0.5">
                  ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Equity</p>
                <p className="text-base font-black text-emerald-600 font-mono mt-0.5">
                  ${acc.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Leverage</p>
                <p className="text-xs font-black text-slate-800 mt-1 flex items-center gap-1 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  {acc.leverage}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-800 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60 hover:border-emerald-200">
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" /> Deposit / Transfer
              </button>
              <button 
                onClick={() => alert(`Credentials details for Account #${acc.login}\nServer: VintageLive-Server 1\nLeverage: ${acc.leverage}`)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center gap-1 border border-slate-200/60" 
                title="Account Credentials"
              >
                <Key className="w-4 h-4 text-slate-600" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal for Creating Account */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900">Create MetaTrader 5 Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('Live')}
                    className={`py-3 font-extrabold text-xs rounded-2xl border transition-all cursor-pointer ${
                      accountType === 'Live' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Live Real Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('Demo')}
                    className={`py-3 font-extrabold text-xs rounded-2xl border transition-all cursor-pointer ${
                      accountType === 'Demo' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Demo Practice Account
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Leverage Ratio</label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="1:100">1:100 Standard Leverage</option>
                  <option value="1:200">1:200 High Leverage</option>
                  <option value="1:500">1:500 Maximum Leverage</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-full transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Create Account Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

