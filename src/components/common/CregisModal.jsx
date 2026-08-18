import React, { useState, useEffect } from 'react';
import { QrCode, Zap, CheckCircle2, Copy, Check, X, RefreshCw, ShieldCheck } from 'lucide-react';

export default function CregisModal({
  isOpen = false,
  onClose = () => {},
  amount = 500,
  tokenType = 'USDT_TRC20',
  onSuccess = () => {}
}) {
  const [copied, setCopied] = useState(false);
  const [pollingStatus, setPollingStatus] = useState('pending'); // 'pending' | 'confirming' | 'approved'
  const [confirmations, setConfirmations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins countdown

  const address = tokenType.includes('TRC20') 
    ? 'T9zXX9Kpq7aK9qP8291mLaZ387nK' 
    : '0x8f3c91a0b9821039a82012938102938';

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Real-time status polling simulation
  useEffect(() => {
    if (!isOpen) return;
    const pollTimer = setTimeout(() => {
      setPollingStatus('confirming');
      setConfirmations(2);
      setTimeout(() => {
        setPollingStatus('approved');
        setConfirmations(3);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }, 3000);
    }, 3000);

    return () => clearTimeout(pollTimer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white space-y-5 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="w-12 h-12 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-600/30">
          <Zap className="w-6 h-6 text-white" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black">Cregis Automated Crypto Merchant</h3>
          <p className="text-xs text-slate-400">Invoice Amount: <strong className="text-white font-mono text-sm">${amount} USD ({tokenType})</strong></p>
        </div>

        {/* Polling Banner */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Invoice Expires In:</span>
          <span className="font-mono font-bold text-amber-400">{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </div>

        {pollingStatus === 'approved' ? (
          <div className="p-6 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-extrabold text-base text-emerald-300">Payment Confirmed!</h4>
            <p className="text-xs text-emerald-200">3/3 Blockchain confirmations received. Balance credited.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* QR Code */}
            <div className="w-40 h-40 bg-white p-3 rounded-2xl border-2 border-cyan-500 mx-auto flex items-center justify-center shadow-lg">
              <QrCode className="w-32 h-32 text-slate-950" />
            </div>

            {/* Address Box */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 text-left">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Send {tokenType} To:</span>
                <span className="text-xs font-mono font-bold text-cyan-300 truncate block">{address}</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Real-time Status Polling Status Bar */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>
                  {pollingStatus === 'confirming' ? `Confirming (${confirmations}/3)` : 'Waiting for Blockchain Broadcast...'}
                </span>
              </div>
              <span className="text-cyan-400 font-mono">Cregis Polling Active</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
