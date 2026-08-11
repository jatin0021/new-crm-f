import React, { useState } from 'react';
import { Users, DollarSign, ShieldAlert, Check, X, UserCheck, Eye, Search, Layers } from 'lucide-react';

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
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-900/30 flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
            Back-Office Admin Console
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2.5">Operations & Risk Desk</h2>
          <p className="text-xs text-slate-400 mt-1">Manage user accounts, approve financial deposits/withdrawals, review KYC, and inspect MT5 metrics.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Traders</p>
          <p className="text-2xl font-black text-slate-900 mt-1 font-mono">1,420</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Deposits Queue</p>
          <p className="text-2xl font-black text-amber-600 mt-1 font-mono">$16,500.00</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active MT5 Logins</p>
          <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">2,180</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending KYC Reviews</p>
          <p className="text-2xl font-black text-indigo-600 mt-1 font-mono">14</p>
        </div>
      </div>

      {/* Pending Deposits Review Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">Pending Financial Deposit Approvals</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 pb-3">
                <th className="pb-3">Trader Email</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Gateway Method</th>
                <th className="pb-3">Receipt / Tx</th>
                <th className="pb-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pendingDeposits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    {item.user}
                    <button 
                      onClick={() => onImpersonate(item.user)}
                      className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-full text-[10px] font-extrabold border border-indigo-100"
                      title="Login-As Trader Impersonation"
                    >
                      Login-As
                    </button>
                  </td>
                  <td className="py-3.5 font-mono font-extrabold text-slate-900">${item.amount.toFixed(2)}</td>
                  <td className="py-3.5 font-semibold text-slate-600">{item.method}</td>
                  <td className="py-3.5 text-slate-400 font-mono">{item.receipt}</td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApproveDeposit(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleApproveDeposit(item.id)}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg text-xs flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingDeposits.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400 font-medium">
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

