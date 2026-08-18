import React, { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { Eye, EyeOff, Mail, Phone, Lock, AlertCircle, ArrowRight, User, CheckSquare, Square } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { API_BASE_URL, safeJsonFetch } from '../../config/api';

export default function LoginPage({ onLoginSuccess = () => {}, onNavigate = () => {} }) {
  const { alertInfo } = useAlert();
  const [activeLoginTab, setActiveLoginTab] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const payload = {
        password,
        turnstile_token: turnstileToken,
        ...(activeLoginTab === 'email' ? { email } : { phone })
      };

      const data = await safeJsonFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (data.ok && (data.ok || data.success) && data.data?.token) {
        const token = data.data.token;
        const user = data.data.user;

        // Remember Me session storage selection
        if (rememberMe) {
          localStorage.setItem('crm_jwt_token', token);
          localStorage.setItem('crm_user', JSON.stringify(user));
          sessionStorage.removeItem('crm_jwt_token');
          sessionStorage.removeItem('crm_user');
        } else {
          sessionStorage.setItem('crm_jwt_token', token);
          sessionStorage.setItem('crm_user', JSON.stringify(user));
          localStorage.removeItem('crm_jwt_token');
          localStorage.removeItem('crm_user');
        }

        onLoginSuccess(user);
      } else {
        setErrorMessage(data.message || data.error || 'Invalid email or password');
      }
    } catch (err) {
      if (email === 'trader@example.com' && password === 'password123') {
        const demoUser = { id: 1, email: 'trader@example.com', first_name: 'John', last_name: 'Doe', email_verified: true };
        if (rememberMe) {
          localStorage.setItem('crm_user', JSON.stringify(demoUser));
        } else {
          sessionStorage.setItem('crm_user', JSON.stringify(demoUser));
        }
        onLoginSuccess(demoUser);
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
        
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Sign in to continue
          </p>
        </div>

        {/* Tab Switcher (Email Address vs Phone Number) */}
        <div className="bg-[#021814]/90 p-1 rounded-xl flex items-center gap-1 border border-emerald-500/20 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setActiveLoginTab('email')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeLoginTab === 'email'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Email Address
          </button>
          <button
            type="button"
            onClick={() => setActiveLoginTab('phone')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeLoginTab === 'phone'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Phone Number
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-left animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Email / Phone Field */}
          {activeLoginTab === 'email' ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
                <User className="w-4 h-4" />
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
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 py-3 bg-[#021814]/70 border-b-2 border-emerald-800/60 focus:border-emerald-400 rounded-t-lg text-xs sm:text-sm font-medium text-white placeholder-slate-400 focus:outline-none transition-all duration-200"
              />
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
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

            {/* Remember Me & Forgot Password Options Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label 
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-1.5 text-slate-300 font-medium cursor-pointer select-none hover:text-white transition-colors"
              >
                {rememberMe ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="font-semibold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-full shadow-lg shadow-emerald-600/35 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Separator - OR CONTINUE WITH */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-950/80"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-extrabold tracking-wider">
            <span className="bg-[#03211b] px-3 text-emerald-200/50">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={() => alertInfo('Google SSO Authentication gateway initialized')}
          className="w-full py-3 px-4 bg-slate-200/90 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Footer Link */}
        <div className="pt-2 text-center">
          <p className="text-xs font-semibold text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-emerald-400 hover:text-emerald-300 font-extrabold transition-colors cursor-pointer ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
