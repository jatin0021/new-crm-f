import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, KeyRound, Copy, Check } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { API_BASE_URL, safeJsonFetch } from '../../config/api';

export default function ForgotPasswordPage({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [devToken, setDevToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  
  // Step: 'request' | 'sent' | 'reset' | 'success'
  const [step, setStep] = useState('request');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Step 1: Request Password Reset Token / Link
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const data = await safeJsonFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstile_token: turnstileToken })
      });

      if (data.ok && (data.ok || data.success)) {
        setStep('sent');
        const rawToken = data.data?.reset_token;
        const serverLink = data.data?.reset_link;
        if (rawToken) {
          setResetLink(`${window.location.origin}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`);
        } else if (serverLink) {
          // Replace localhost with live origin if needed
          const formatted = serverLink.replace(/http:\/\/localhost:\d+/, window.location.origin);
          setResetLink(formatted);
        }
      } else {
        setErrorMessage(data.message || data.error || 'No registered account found with this email.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit New Password to Backend
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await safeJsonFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          new_password: newPassword
        })
      });

      if (data.ok && (data.ok || data.success)) {
        setStep('success');
      } else {
        setErrorMessage(data.message || data.error || 'Failed to update password. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-5 text-center">
        
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {step === 'sent' ? 'Reset Link Sent' : 'Reset Password'}
          </h2>
          <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
            {step === 'sent'
              ? `Check your email inbox for ${email} to reset password`
              : 'Enter your registered email address to receive password reset instructions'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-left animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Request Reset */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-4 text-left">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full pl-10 pr-4 py-3 bg-[#021814]/70 border-b-2 border-emerald-800/60 focus:border-emerald-400 rounded-t-lg text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-emerald-600/35 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Sent Confirmation Screen */}
        {step === 'sent' && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-emerald-300">Email Dispatched!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We have generated a secure password reset link and sent it to <strong className="text-white">{email}</strong>. Please check your email inbox to update your password.
              </p>
            </div>

            {/* Direct Password Reset Link Box */}
            {resetLink && (
              <div className="p-3.5 bg-slate-900/90 border border-emerald-500/40 rounded-xl text-left space-y-2">
                <span className="text-[10px] uppercase font-extrabold text-emerald-400 block tracking-wider">Direct Password Reset Link:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={resetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-300 hover:underline truncate flex-1 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800"
                  >
                    {resetLink}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(resetLink);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-2.5 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <a
                  href={resetLink}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Open Reset Page Now</span>
                </a>
              </div>
            )}

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm rounded-full transition-all cursor-pointer border border-slate-700"
            >
              Return to Sign In
            </button>
          </div>
        )}

        {/* Return to Login Link */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
          </button>
        </div>

      </div>
    </AuthLayout>
  );
}
