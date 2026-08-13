import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function ForgotPasswordPage({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="space-y-5 text-center">
        
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
            Enter your registered email address and we will send you a reset link
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-sm font-bold text-emerald-300">Reset Email Dispatched!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We have sent password reset instructions to <span className="font-bold text-white">{email}</span>. Please check your inbox.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-emerald-600/30"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
                  placeholder="Email Address"
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

        <div className="pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </button>
        </div>

      </div>
    </AuthLayout>
  );
}

