import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, QrCode, CreditCard, Landmark, Upload, CheckCircle2, Copy, Check, ShieldCheck, Zap } from 'lucide-react';

export default function FundsPage() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [depositMethod, setDepositMethod] = useState('crypto');
  const [amount, setAmount] = useState('500');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);

  const handleSubmitDeposit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  const usdtAddress = "T9zXX9Kpq7aK9qP8291mLaZ387nK";

  return (
    <div className="space-y-6">
      
      {/* Header Tabs: Deposit vs Withdrawal */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Funds & Payment Gateway</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Deposit cash securely into your CRM wallet or request fast withdrawals to external accounts.
          </p>
        </div>

        <div className="flex bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 shrink-0">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-5 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
              activeTab === 'deposit' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deposit Funds
          </button>
          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`px-5 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer ${
              activeTab === 'withdrawal' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Withdrawal
          </button>
        </div>
      </div>

      {/* Main Content Form */}
      {activeTab === 'deposit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Method Selector */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">1. Select Payment Gateway</h3>

            <div 
              onClick={() => setDepositMethod('crypto')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                depositMethod === 'crypto' ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200/80 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <QrCode className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Crypto USDT (Cregis)</h4>
                <p className="text-[11px] text-slate-500 font-semibold">TRC20 / ERC20 Instant Blockchain</p>
              </div>
            </div>

            <div 
              onClick={() => setDepositMethod('card')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                depositMethod === 'card' ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200/80 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <CreditCard className="w-5.5 h-5.5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Credit / Debit Card</h4>
                <p className="text-[11px] text-slate-500 font-semibold">Jexipay Instant Gateway</p>
              </div>
            </div>

            <div 
              onClick={() => setDepositMethod('bank')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                depositMethod === 'bank' ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200/80 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <Landmark className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Bank Wire Transfer</h4>
                <p className="text-[11px] text-slate-500 font-semibold">Manual Receipt Verification</p>
              </div>
            </div>
          </div>

          {/* Form Action */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                {depositMethod === 'crypto' && 'Instant Crypto Payment Invoice'}
                {depositMethod === 'card' && 'Online Card Gateway Checkout'}
                {depositMethod === 'bank' && 'Upload Bank Wire Receipt'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Enter your deposit amount and fulfill the gateway instructions below.</p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50/90 rounded-3xl border border-emerald-200 space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="font-black text-xl text-emerald-950">Deposit Invoice Created & Logged!</h4>
                <p className="text-xs font-semibold text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Your deposit request for <span className="font-bold text-emerald-950 font-mono text-sm">${amount} USD</span> has been sent to our back-office operations desk. Your CRM wallet balance will update automatically once verified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDeposit} className="space-y-5">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">Deposit Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-slate-400 text-base">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-black text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="500"
                      required
                    />
                  </div>
                </div>

                {depositMethod === 'crypto' && (
                  <div className="p-5 bg-slate-50/90 rounded-3xl border border-slate-200 text-center space-y-4">
                    <div className="w-40 h-40 bg-white p-3 border border-slate-200/80 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                      <QrCode className="w-32 h-32 text-slate-950" />
                    </div>
                    
                    <div className="bg-white p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-2 max-w-md mx-auto">
                      <div className="text-left min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TRC20 Wallet Address</span>
                        <span className="text-xs font-mono font-black text-slate-800 truncate block">{usdtAddress}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(usdtAddress);
                          setCopiedWallet(true);
                          setTimeout(() => setCopiedWallet(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedWallet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedWallet ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium">Scan QR code with your Crypto wallet app or copy address above.</p>
                  </div>
                )}

                {depositMethod === 'bank' && (
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1.5">Upload Receipt Screenshot (.jpg, .png, .pdf)</label>
                    <div 
                      onClick={() => setFileUploaded(true)}
                      className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                        fileUploaded ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-300 hover:border-emerald-400 bg-slate-50'
                      }`}
                    >
                      <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-800">
                        {fileUploaded ? '✓ Receipt Attached: bank_transfer_receipt_500usd.pdf' : 'Click to upload deposit proof file'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Maximum file size: 15MB</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-full transition-all shadow-lg shadow-emerald-600/25 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Proceed to Complete Deposit (${amount} USD)</span>
                </button>
              </form>
            )}

          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow max-w-xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-black text-slate-900">Submit Withdrawal Request</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Withdrawals are processed back to your registered payout account within 24 hours.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Withdrawal request submitted for review!'); }} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Withdrawal Amount (USD)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-black text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Payout Method</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer">
                <option>Crypto USDT Wallet (TRC20)</option>
                <option>Bank Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Destination Address / Bank Details</label>
              <input
                type="text"
                placeholder="Enter TRC20 wallet address or IBAN bank account"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-full transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              Submit Withdrawal Request
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

