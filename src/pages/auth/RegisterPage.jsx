import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User, Globe, Phone, Lock, Tag, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { API_BASE_URL } from '../../config/api';

export default function RegisterPage({ onRegisterSuccess = () => {}, onNavigate = () => {} }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: 'United States',
    phone: '',
    password: '',
    confirm_password: '',
    referral_code: '',
    agree_terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'United Arab Emirates',
    'Canada', 'Australia', 'Singapore', 'France', 'Saudi Arabia', 'Japan', 'India'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!formData.agree_terms) {
      setErrorMessage('Please agree to the Terms of Business');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data = {};
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(`Server connection error (${response.status}). Please check API URL setting.`);
      }

      if (response.ok && (data.ok || data.success) && data.data?.token) {
        localStorage.setItem('crm_jwt_token', data.data.token);
        localStorage.setItem('crm_user', JSON.stringify(data.data.user));
        onRegisterSuccess(data.data.user);
      } else {
        setErrorMessage(data.message || data.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-3.5 text-center">
        
        {/* Title Section */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Open Live Account
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Register your trader profile in 2 minutes & start live trading
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Grid Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                First Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Last Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="trader@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 0199"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Row 3: Country & Referral Code */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referral_code"
                value={formData.referral_code}
                onChange={handleChange}
                placeholder="E.G. REF1001"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all uppercase placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password <span className="text-orange-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirm_password"
                required
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="agree_terms"
              name="agree_terms"
              checked={formData.agree_terms}
              onChange={handleChange}
              className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="agree_terms" className="text-xs font-medium text-slate-600 leading-tight">
              I agree to the <a href="#terms" className="text-orange-600 font-bold underline">Terms of Business</a> & Privacy Policy.
            </label>
          </div>

          {/* Register Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>Create Live Account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-1">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-orange-600 hover:text-orange-700 font-extrabold underline decoration-orange-300 transition-colors cursor-pointer"
            >
              Client Portal Login
            </button>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
