import React, { useState } from 'react';
import { MailWarning, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ActivationBanner({ currentUser, onResendVerification = () => {} }) {
  const [loading, setLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  if (!currentUser || currentUser.email_verified !== false) return null;

  const handleResend = async () => {
    setLoading(true);
    setSentMessage('');
    try {
      await onResendVerification(currentUser.email);
      setSentMessage('Activation link resent to your email!');
    } catch (e) {
      setSentMessage('Resent request initialized.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-slate-100 border-b border-sky-800/40 px-4 py-2.5 shadow-md">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        
        <div className="flex items-center gap-2 text-center sm:text-left font-semibold">
          <MailWarning className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong className="text-sky-300">Account Pending Verification:</strong> Please check your email inbox ({currentUser.email}) to activate full live trading & deposit features.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {sentMessage ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {sentMessage}
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="px-3.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-bold transition-all border border-sky-400/40 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Resend Activation Email</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
