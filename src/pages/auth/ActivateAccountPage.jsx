import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function ActivateAccountPage({ onNavigate = () => {} }) {
  const { alertSuccess } = useAlert();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token || !emailParam) {
      setLoading(false);
      setErrorMessage('Missing activation token or email address in link.');
      return;
    }

    const activateUserAccount = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email: emailParam })
        });

        const data = await response.json();
        if (response.ok && (data.ok || data.success)) {
          setActivated(true);
          
          // Update stored user object if exists
          try {
            const stored = localStorage.getItem('crm_user');
            if (stored) {
              const u = JSON.parse(stored);
              u.email_verified = true;
              localStorage.setItem('crm_user', JSON.stringify(u));
            }
          } catch (e) {}
        } else {
          setErrorMessage(data.message || 'Activation token is invalid or has expired.');
        }
      } catch (err) {
        setErrorMessage('Failed to connect to verification server. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    activateUserAccount();
  }, [token, emailParam]);

  return (
    <AuthLayout>
      <div className="space-y-5 text-center">
        
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Account Activation Gateway
          </h2>
          <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
            Verifying trader account <strong className="text-emerald-400">{emailParam}</strong>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-8 space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-400">Verifying cryptographic activation token...</p>
          </div>
        )}

        {/* Success State */}
        {!loading && activated && (
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-emerald-300">Account Activated Successfully!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your email address has been verified. Live MT5 trading accounts, instant deposit gateways, and IB referral tools are now fully active.
              </p>
            </div>

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-emerald-600/35 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Trader Portal</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        )}

        {/* Error State */}
        {!loading && !activated && (
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-6 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-rose-300">Activation Link Invalid or Expired</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={async () => {
                  if (!emailParam) return;
                  await fetch('/api/auth/resend-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailParam })
                  });
                  alertSuccess(`A fresh activation link has been resent to ${emailParam}`);
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Resend Activation Email</span>
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-full transition-all cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}
