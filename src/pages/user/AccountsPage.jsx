import React, { useState } from 'react';
import { Plus, Shield, Sliders, Key, ArrowRightLeft, CheckCircle2, Layers } from 'lucide-react';

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
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">MT5 Trading Accounts</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your live MetaTrader 5 trading accounts, demo practice balances, leverage, and credentials.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-full transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 shrink-0"
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
            className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow card-shadow-hover space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-extrabold text-xs">
                  MT5
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-base font-mono">#{acc.login}</p>
                  <p className="text-xs text-slate-500 font-medium">{acc.type}</p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                acc.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
              }`}>
                {acc.status}
              </span>
            </div>

            {/* Account Metrics */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Balance</p>
                <p className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
                  ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Leverage</p>
                <p className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-1 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  {acc.leverage}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 py-2.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer Funds
              </button>
              <button className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors" title="Change Password">
                <Key className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal for Creating Account */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-xl font-extrabold text-slate-900">Create MetaTrader 5 Account</h3>
            
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Account Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('Live')}
                    className={`py-2.5 font-bold text-xs rounded-xl border transition-all ${
                      accountType === 'Live' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Live Real Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('Demo')}
                    className={`py-2.5 font-bold text-xs rounded-xl border transition-all ${
                      accountType === 'Demo' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200'
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="1:100">1:100 Standard</option>
                  <option value="1:200">1:200 High</option>
                  <option value="1:500">1:500 Maximum</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-sm"
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
