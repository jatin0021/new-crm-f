import React, { useState } from 'react';
import { Users, DollarSign, ShieldAlert, Check, X, UserCheck, Eye, Search, Layers, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard({ onImpersonate = () => {} }) {
  const [pendingDeposits, setPendingDeposits] = useState([
    { id: 101, user: 'alex.trader@example.com', amount: 5000.00, method: 'Bank Wire', date: '2026-08-10 14:20', receipt: 'receipt_101.jpg' },
    { id: 102, user: 'maria.investor@example.com', amount: 1500.00, method: 'Cregis USDT', date: '2026-08-10 15:05', receipt: 'tx_hash_0x892a...' },
    { id: 103, user: 'david.fx@example.com', amount: 10000.00, method: 'Bank Wire', date: '2026-08-10 15:40', receipt: 'receipt_103.pdf' },
  ]);

  const handleApproveDeposit = (id) => {
    setPendingDeposits(pendingDeposits.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Back-Office Operations Console
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2.5">Risk & Financial Desk</h2>
          <p className="text-xs text-slate-300 font-medium mt-1">Manage user accounts, approve financial deposits/withdrawals, review KYC, and inspect live MT5 trading metrics.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Registered Traders</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">1,420</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">+12% this month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Pending Deposits Queue</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-teal-600 font-mono">$16,500.00</p>
          <span className="text-[10px] text-teal-700 font-bold mt-1 inline-block">{pendingDeposits.length} pending review</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Active MT5 Logins</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">2,180</p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">Real-time live connections</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Pending KYC Reviews</span>
            <ShieldAlert className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-black text-cyan-600 font-mono">14</p>
          <span className="text-[10px] text-cyan-700 font-bold mt-1 inline-block">SLA &lt; 30 mins</span>
        </div>
      </div>

      {/* Pending Deposits Review Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">Pending Financial Deposit Approvals</h3>
          <span className="text-xs font-mono font-bold text-slate-500">{pendingDeposits.length} Pending</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                <th className="pb-3 pl-2">Trader Email</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Gateway Method</th>
                <th className="pb-3">Receipt / Tx</th>
                <th className="pb-3 text-right pr-2">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pendingDeposits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 pl-2 font-bold text-slate-900 flex items-center gap-2">
                    {item.user}
                    <button 
                      onClick={() => onImpersonate(item.user)}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full text-[10px] font-black border border-emerald-200 cursor-pointer transition-colors inline-flex items-center gap-0.5"
                      title="Login-As Trader Impersonation"
                    >
                      Login-As <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="py-4 font-mono font-black text-slate-900">${item.amount.toFixed(2)}</td>
                  <td className="py-4 font-bold text-slate-600">{item.method}</td>
                  <td className="py-4 text-slate-400 font-mono text-[11px]">{item.receipt}</td>
                  <td className="py-4 text-right pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApproveDeposit(item.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleApproveDeposit(item.id)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all border border-rose-200"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingDeposits.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-semibold">
                    No pending deposits in review queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}


