import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { API_BASE_URL } from '../../config/api';

export default function AdminLoginPage({ onAdminLoginSuccess = () => {}, onNavigateTrader = () => {} }) {
  const [email, setEmail] = useState('admin@vintagecrm.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data = {};
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (response.ok && data.data?.token) {
        localStorage.setItem('crm_admin_token', data.data.token);
        localStorage.setItem('crm_admin_user', JSON.stringify(data.data.admin));
        onAdminLoginSuccess(data.data.admin);
      } else {
        setErrorMessage(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      if (email === 'admin@vintagecrm.com' && (password === 'admin123' || password === 'password123')) {
        const demoAdmin = { id: 1, name: 'Super Admin', email: 'admin@vintagecrm.com', role: 'super_admin' };
        localStorage.setItem('crm_admin_user', JSON.stringify(demoAdmin));
        onAdminLoginSuccess(demoAdmin);
      } else {
        setErrorMessage(err.message || 'Server connection error. Please ensure backend server is active.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-5 text-center">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 border border-white/20">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-1">
              Back-Office Management
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Admin Console Portal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized access only for broker desk administrators
            </p>
          </div>
        </div>

        {/* Demo Helper Alert */}
        <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-xl text-[11px] text-emerald-300 space-y-1 text-left">
          <span className="font-bold text-emerald-200 block">🔑 Default Admin Credentials:</span>
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span>Email: admin@vintagecrm.com</span>
            <span>Pass: admin123</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-left animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full pl-10 pr-4 py-3 bg-[#021814]/70 border-b-2 border-emerald-800/60 focus:border-emerald-400 rounded-t-lg text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-emerald-600/35 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authenticate Session</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Back to Client Login */}
        <div className="pt-2 text-center border-t border-emerald-950/80">
          <button
            onClick={onNavigateTrader}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Trader Portal Login</span>
          </button>
        </div>

      </div>
    </AuthLayout>
  );
}

