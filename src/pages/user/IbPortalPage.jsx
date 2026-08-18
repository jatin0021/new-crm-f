import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import { 
  Users, 
  Share2, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Check, 
  GitMerge, 
  PieChart, 
  Calculator, 
  Download, 
  Award, 
  CheckCircle2, 
  Zap, 
  Layers, 
  ArrowRight, 
  FileText,
  Building2,
  Globe,
  Briefcase
} from 'lucide-react';

export default function IbPortalPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tree' | 'clients' | 'calculator' | 'plans' | 'apply' | 'marketing'

  // IB Profile State
  const [ibProfile, setIbProfile] = useState({
    ib_code: 'IB-9921',
    tier: 'Master IB',
    total_clients: 12,
    total_lots: 345.50,
    commission_balance: 1420.50
  });

  const [referralLink, setReferralLink] = useState('https://vintage-crm.com/register?ref=IB-9921');
  const [copiedLink, setCopiedLink] = useState(false);
  const [transferringComm, setTransferringComm] = useState(false);
  const [commMsg, setCommMsg] = useState('');

  // Pip Calculator State
  const [calcLots, setCalcLots] = useState(100);
  const [calcTier, setCalcTier] = useState(8.00); // $8 per lot

  // IB Clients List
  // Fetch IB Profile and Clients on Mount
  useEffect(() => {
    const fetchIbData = async () => {
      try {
        const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
        const [profRes, clientRes] = await Promise.all([
          fetch('/api/ib/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/ib/clients', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (profRes.ok) {
          const pData = await profRes.json();
          if (pData.data?.ib) {
            setIbProfile(pData.data.ib);
          }
        }

        if (clientRes.ok) {
          const cData = await clientRes.json();
          if (cData.data?.clients) {
            setReferredClients(cData.data.clients);
          }
        }
      } catch (e) {
        console.warn('IB fetch warning:', e.message);
      }
    };

    fetchIbData();
  }, []);

  // 1-Click Transfer Commission to Main Trader Wallet Handler
  const handleTransferCommission = async () => {
    if (ibProfile.commission_balance <= 0) {
      alertWarning('No available commission balance to transfer');
      return;
    }

    setTransferringComm(true);
    setCommMsg('');

    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/ib/transfer-commission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: ibProfile.commission_balance })
      });

      const data = await res.json();
      if (res.ok) {
        setCommMsg(`Successfully transferred $${ibProfile.commission_balance.toFixed(2)} USD into main wallet!`);
        alertSuccess(`Successfully transferred $${ibProfile.commission_balance.toFixed(2)} USD into main wallet!`);
        setIbProfile(prev => ({ ...prev, commission_balance: 0.00 }));
      } else {
        alertError(data.message || 'Transfer failed');
      }
    } catch (e) {
      alertError('Server connection error during transfer');
    } finally {
      setTransferringComm(false);
    }
  };

  // Submit Partner Application Handler
  const handlePartnerAppSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/ib/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          experience: appExperience,
          expected_monthly_lots: appLots,
          region: appRegion,
          marketing_strategy: appStrategy
        })
      });
      const data = await res.json();
      if (res.ok) setAppSubmitted(true);
    } catch (e) {
      alertError('Server error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      
      {/* Top Banner & IB Profile Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Introducing Broker (IB) Portal</h1>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                {ibProfile.tier} • Code: {ibProfile.ib_code}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your referral network, monitor client trading volumes, and collect instant rebate payouts.</p>
          </div>
        </div>

        {/* 1-Click Commission Transfer Box */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-4 rounded-2xl shadow-lg flex items-center gap-4 w-full md:w-auto shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Earned Commission</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              ${parseFloat(ibProfile.commission_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleTransferCommission}
            disabled={transferringComm || ibProfile.commission_balance <= 0}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{transferringComm ? 'Transferring...' : 'Transfer to Wallet'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Workspace Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard & Link Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('tree')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tree' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <GitMerge className="w-4 h-4" />
          <span>Visual Multi-Level Network Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'clients' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>My Clients Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'calculator' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Pip Rebate Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'plans' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Commission Plan Comparator</span>
        </button>

        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'marketing' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Marketing Assets</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW DASHBOARD & DYNAMIC REFERRAL LINK GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {commMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{commMsg}</span>
            </div>
          )}

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 card-shadow space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Earned Rebates</span>
              <span className="text-2xl font-black text-slate-900 font-mono">${(parseFloat(ibProfile.commission_balance) + 1850).toFixed(2)}</span>
              <span className="text-[11px] text-emerald-600 font-bold block">+18.4% from last month</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 card-shadow space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Referred Clients</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{ibProfile.total_clients} Traders</span>
              <span className="text-[11px] text-blue-600 font-bold block">3 new registered this week</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 card-shadow space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Traded Volume</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{parseFloat(ibProfile.total_lots).toFixed(2)} Lots</span>
              <span className="text-[11px] text-slate-500 font-bold block">Avg $8.00 rebate per lot</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 card-shadow space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Available Commission</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">${parseFloat(ibProfile.commission_balance).toFixed(2)}</span>
              <span className="text-[11px] text-emerald-600 font-bold block">Ready for 1-click transfer</span>
            </div>
          </div>

          {/* Dynamic Referral Link Generator Card */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/50 flex items-center justify-center font-bold text-blue-300">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">Dynamic Referral Link & Campaign Tracking Generator</h3>
                <p className="text-xs text-slate-300">Share your personalized tracking link to automatically pre-fill your IB referral code upon client registration.</p>
              </div>
            </div>

            <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="min-w-0 w-full text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Official Affiliate Tracking URL:</span>
                <span className="text-sm font-mono font-black text-cyan-300 truncate block">{referralLink}</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Tracking Link'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VISUAL MULTI-LEVEL IB NETWORK TREE */}
      {/* ========================================================================= */}
      {activeTab === 'tree' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <GitMerge className="w-6 h-6 text-blue-600" />
              Visual Multi-Level IB Network Tree Chart
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Interactive organizational chart mapping your direct Master IB node, Sub-IBs, and Tier-3 affiliate networks.</p>
          </div>

          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 text-white space-y-6 font-sans">
            
            {/* Master IB Node */}
            <div className="p-4 bg-blue-950/80 border-2 border-blue-500 rounded-2xl max-w-md mx-auto shadow-lg space-y-1 text-center">
              <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2.5 py-0.5 rounded-full">Root Node (Master IB)</span>
              <h4 className="text-base font-black text-white">Master Partner (IB-9921)</h4>
              <p className="text-xs font-mono text-cyan-300">12 Direct Clients • $1,420.50 Commission</p>
            </div>

            <div className="w-0.5 h-6 bg-blue-500 mx-auto"></div>

            {/* Sub-IB Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-4 bg-slate-850 bg-slate-950 border border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-extrabold text-cyan-400">Sub-IB: Alpha Trading Network (IB-4091)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">5 Clients</span>
                </div>

                <div className="space-y-1.5 pl-3 border-l-2 border-cyan-500 text-xs font-mono text-slate-300">
                  <p>• Trader #501928 (Alex Smith) - 120.5 Lots ($602.50 Rebate)</p>
                  <p>• Trader #725249 (Elena Rostova) - 85.0 Lots ($425.00 Rebate)</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-extrabold text-indigo-400">Sub-IB: Apex Forex Regional (IB-8812)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">4 Clients</span>
                </div>

                <div className="space-y-1.5 pl-3 border-l-2 border-indigo-500 text-xs font-mono text-slate-300">
                  <p>• Trader #301920 (David Miller) - 60.0 Lots ($300.00 Rebate)</p>
                  <p>• Trader #901821 (Sam Wilson) - 40.0 Lots ($200.00 Rebate)</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MY CLIENTS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Referred Client Directory & Lot Performance
            </h3>
            <p className="text-xs text-slate-500 font-medium">Detailed tracking table displaying registration dates, client equity, and traded lot volumes.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3">Client Name</th>
                  <th className="py-3 px-3">MT5 Account</th>
                  <th className="py-3 px-3">Registration Date</th>
                  <th className="py-3 px-3 text-right">Account Equity</th>
                  <th className="py-3 px-3 text-right">Traded Volume</th>
                  <th className="py-3 px-3 text-right">Rebate Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {clients.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-extrabold text-slate-900">{c.name} <span className="text-[10px] text-slate-400 font-normal">({c.email})</span></td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">MT5 #{c.login}</td>
                    <td className="py-3 px-3 text-slate-500">{c.registered_at}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">${parseFloat(c.equity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">{c.traded_lots} Lots</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-600">${parseFloat(c.rebate_earned).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PIP REBATE CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Partner Pip & Commission Earnings Calculator
            </h3>
            <p className="text-xs text-slate-500 font-medium">Estimate your potential daily and monthly commission payouts based on referred lot volume.</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                <span>Monthly Client Volume (Lots)</span>
                <span className="font-mono text-blue-700 font-black text-sm">{calcLots} Lots / Month</span>
              </div>
              <input
                type="range"
                min={10}
                max={2000}
                step={10}
                value={calcLots}
                onChange={(e) => setCalcLots(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Partnership Rebate Tier Rate</label>
              <select
                value={calcTier}
                onChange={(e) => setCalcTier(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value={5.00}>Bronze Tier - $5.00 / Lot</option>
                <option value={8.00}>Silver Tier - $8.00 / Lot</option>
                <option value={12.00}>Gold VIP Tier - $12.00 / Lot</option>
                <option value={15.00}>Platinum Master Tier - $15.00 / Lot</option>
              </select>
            </div>

            {/* Calculated Results */}
            <div className="p-6 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl text-white space-y-3 text-center">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">Estimated Monthly IB Payout</span>
              <span className="text-3xl font-black font-mono text-cyan-300 block">
                ${(calcLots * calcTier).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
              <span className="text-xs text-slate-300 block">
                ≈ ${(calcLots * calcTier / 22).toFixed(2)} USD / Trading Day
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PARTNERSHIP PLAN COMPARATOR */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              IB Commission Partnership Plan Comparator
            </h3>
            <p className="text-xs text-slate-500 font-medium">Side-by-side comparison matrix of available partnership rebate tiers and spread cuts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Bronze Tier', minVol: '0 - 50 Lots', rebate: '$5.00 / Lot', color: 'border-amber-200 bg-amber-50/50' },
              { name: 'Silver Tier', minVol: '51 - 200 Lots', rebate: '$8.00 / Lot', color: 'border-slate-300 bg-slate-50' },
              { name: 'Gold VIP Tier', minVol: '201 - 500 Lots', rebate: '$12.00 / Lot', color: 'border-amber-300 bg-amber-50' },
              { name: 'Platinum Master', minVol: '500+ Lots', rebate: '$15.00 / Lot', color: 'border-blue-300 bg-blue-50 ring-2 ring-blue-500/20' }
            ].map(plan => (
              <div key={plan.name} className={`p-5 rounded-3xl border text-center space-y-3 ${plan.color}`}>
                <span className="text-xs font-black text-slate-900 uppercase block">{plan.name}</span>
                <span className="text-xl font-black text-blue-700 font-mono block">{plan.rebate}</span>
                <p className="text-[11px] text-slate-500 font-semibold">Min Monthly Volume: <strong>{plan.minVol}</strong></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PARTNER MARKETING ASSETS */}
      {/* ========================================================================= */}
      {activeTab === 'marketing' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Partner Marketing Assets Directory
            </h3>
            <p className="text-xs text-slate-500 font-medium">Download high-converting promotional banners, badges, and marketing collateral for your affiliate campaigns.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Leaderboard Banner (728x90)', desc: 'PNG & GIF Web Banner' },
              { title: 'Instagram / Telegram Story (1080x1920)', desc: 'Mobile Banner Asset' },
              { title: 'Vintage CRM Logo Pack & Badges', desc: 'Vector SVG & PNG Logos' }
            ].map(asset => (
              <div key={asset.title} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <h4 className="font-extrabold text-xs text-slate-900">{asset.title}</h4>
                <p className="text-[11px] text-slate-500">{asset.desc}</p>
                <button
                  onClick={() => alertInfo(`Downloading ${asset.title}...`)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Asset</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
