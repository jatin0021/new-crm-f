import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordStrengthBar from '../../components/common/PasswordStrengthBar';

export default function ResetPasswordPage({ onNavigate = () => {} }) {
  // Extract token & email from URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validate Token on Component Mount
  useEffect(() => {
    if (!token || !emailParam) {
      setValidating(false);
      setTokenValid(false);
      setErrorMessage('Missing password reset token or email address in URL.');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email: emailParam })
        });

        const data = await response.json();
        if (response.ok && (data.ok || data.success)) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setErrorMessage(data.message || 'Password reset token is invalid or has expired.');
        }
      } catch (err) {
        setTokenValid(false);
        setErrorMessage('Failed to connect to verification server. Please try again.');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token, emailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailParam,
          token,
          new_password: newPassword,
          turnstile_token: turnstileToken
        })
      });

      const data = await response.json();

      if (response.ok && (data.ok || data.success)) {
        setSuccessMessage('Your password has been updated successfully! You can now sign in with your new password.');
      } else {
        setErrorMessage(data.message || 'Failed to update password. Please try again.');
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
            Reset Password Portal
          </h2>
          <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
            Set a new secure password for trader account <strong className="text-emerald-400">{emailParam}</strong>
          </p>
        </div>

        {/* Validating Spinner State */}
        {validating && (
          <div className="py-8 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-400">Verifying cryptographic reset token...</p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-left animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Invalid Token State */}
        {!validating && !tokenValid && (
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This password reset token is invalid, expired, or has already been used.
            </p>
            <button
              onClick={() => onNavigate('forgot-password')}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-emerald-600/30"
            >
              Request New Reset Link
            </button>
          </div>
        )}

        {/* Reset Password Form */}
        {!validating && tokenValid && !successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4 text-left animate-in fade-in">
            
            <div className="bg-emerald-950/40 border border-emerald-500/20 p-2.5 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Token Integrity Validated. Enter your new password.</span>
            </div>

            {/* New Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password *"
                  className="w-full pl-10 pr-10 py-3 bg-[#021814]/70 border-b-2 border-emerald-800/60 focus:border-emerald-400 rounded-t-lg text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Visualizer */}
              <PasswordStrengthBar password={newPassword} />
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password *"
                className="w-full pl-10 pr-4 py-3 bg-[#021814]/70 border-b-2 border-emerald-800/60 focus:border-emerald-400 rounded-t-lg text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Update Password Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-emerald-600/35 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Update Password</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Success Screen */}
        {successMessage && (
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-extrabold text-emerald-300">Password Updated Successfully!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {successMessage}
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-full transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Return to Login */}
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
