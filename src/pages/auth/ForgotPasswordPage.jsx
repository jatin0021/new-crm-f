import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function ForgotPasswordPage({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  
  // Step: 'request' | 'sent' | 'reset' | 'success'
  const [step, setStep] = useState('request');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetLink, setResetLink] = useState('');

  // Step 1: Request Password Reset Token / Link
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstile_token: turnstileToken })
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        throw new Error(`Server returned error (${response.status})`);
      }

      if (response.ok && (data.ok || data.success)) {
        setStep('sent');
        if (data.data?.reset_link) {
          setResetLink(data.data.reset_link);
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
                We have generated a secure password reset link and sent it to <strong className="text-white">{email}</strong>. Please click the link in your email to set a new password.
              </p>
            </div>

            {/* Dev Fallback Direct Link Preview */}
            {resetLink && (
              <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-left space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Development Quick Link:</span>
                <a href={resetLink} className="text-xs text-teal-300 hover:underline break-all font-mono">
                  {resetLink}
                </a>
              </div>
            )}

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-full transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
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
