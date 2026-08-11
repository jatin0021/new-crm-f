import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, QrCode, CreditCard, Landmark, Upload, CheckCircle2 } from 'lucide-react';

export default function FundsPage() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [depositMethod, setDepositMethod] = useState('crypto');
  const [amount, setAmount] = useState('500');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitDeposit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Tabs: Deposit vs Withdrawal */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Funds & Payment Gateway</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Deposit cash securely into your CRM wallet or request fast withdrawals.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-full shrink-0">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${
              activeTab === 'deposit' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deposit Funds
          </button>
          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${
              activeTab === 'withdrawal' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            <h3 className="text-base font-bold text-slate-900 mb-2">Select Payment Method</h3>

            <div 
              onClick={() => setDepositMethod('crypto')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                depositMethod === 'crypto' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Crypto USDT (Cregis)</h4>
                <p className="text-[11px] text-slate-500">TRC20 / ERC20 Instant Blockchain</p>
              </div>
            </div>

            <div 
              onClick={() => setDepositMethod('card')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                depositMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Credit / Debit Card</h4>
                <p className="text-[11px] text-slate-500">Jexipay Instant Card Gateway</p>
              </div>
            </div>

            <div 
              onClick={() => setDepositMethod('bank')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                depositMethod === 'bank' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Bank Wire Transfer</h4>
                <p className="text-[11px] text-slate-500">Manual Receipt Verification</p>
              </div>
            </div>
          </div>

          {/* Form Action */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900">
              {depositMethod === 'crypto' && 'Instant Crypto Payment Invoice'}
              {depositMethod === 'card' && 'Online Card Checkout'}
              {depositMethod === 'bank' && 'Upload Bank Transfer Receipt'}
            </h3>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg text-emerald-900">Deposit Request Submitted!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your deposit request for ${amount} USD has been logged and sent to the admin processing desk. Your balance will update automatically once verified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDeposit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Deposit Amount (USD)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Enter amount e.g. 500"
                    required
                  />
                </div>

                {depositMethod === 'crypto' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="w-36 h-36 bg-white p-2 border border-slate-200 rounded-xl mx-auto flex items-center justify-center shadow-xs">
                      <QrCode className="w-28 h-28 text-slate-900" />
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-700 break-all">
                      USDT Address (TRC20): T9zXX...77aK9qP
                    </p>
                    <p className="text-[11px] text-slate-400">Scan QR or copy address to send funds directly.</p>
                  </div>
                )}

                {depositMethod === 'bank' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Upload Receipt Screenshot (.jpg, .pdf)</label>
                    <div 
                      onClick={() => setFileUploaded(true)}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                        fileUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'
                      }`}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">
                        {fileUploaded ? 'Receipt Attached: bank_receipt_500usd.jpg' : 'Click to select payment proof image'}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-full transition-all shadow-md active:scale-98"
                >
                  Proceed to Complete Deposit (${amount} USD)
                </button>
              </form>
            )}

          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow max-w-xl mx-auto space-y-5">
          <h3 className="text-lg font-bold text-slate-900">Submit Withdrawal Request</h3>
          <p className="text-xs text-slate-500">Withdrawals are processed back to your registered payout account within 24 hours.</p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Withdrawal request submitted!'); }} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Withdrawal Amount (USD)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Payout Method</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option>Crypto USDT Wallet (TRC20)</option>
                <option>Bank Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Destination Address / Account Info</label>
              <input
                type="text"
                placeholder="Enter wallet address or bank account number"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-xs"
            >
              Submit Withdrawal Request
            </button>
          </form>
        </div>
      )}


    </div>
  );
}
