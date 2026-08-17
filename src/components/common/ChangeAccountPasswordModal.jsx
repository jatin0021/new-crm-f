import React, { useState } from 'react';
import { Key, Lock, Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';
import PasswordStrengthBar from './PasswordStrengthBar';

export default function ChangeAccountPasswordModal({
  isOpen = false,
  onClose = () => {},
  accountLogin = null,
  onSuccess = () => {}
}) {
  const [passwordType, setPasswordType] = useState('master'); // 'master' or 'investor'
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/trading-accounts/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          login: accountLogin,
          password_type: passwordType,
          new_password: newPassword
        })
      });

      const data = await res.json();
      if (res.ok && (data.ok || data.success)) {
        setSuccessMsg(data.message || 'Account password updated successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Password update failed.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Change Credentials</h3>
            <p className="text-xs text-slate-400 font-mono">MT5 Account #{accountLogin || '501928'}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Password Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">Select Password Category</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPasswordType('master')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  passwordType === 'master' ? 'bg-emerald-600 text-white border border-emerald-500' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                Master Trading Pass
              </button>
              <button
                type="button"
                onClick={() => setPasswordType('investor')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  passwordType === 'investor' ? 'bg-emerald-600 text-white border border-emerald-500' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                }`}
              >
                Investor (Read-Only)
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              {passwordType === 'master' ? 'Full execution access for WebTrader / MT5 terminal.' : 'View-only password for sharing performance without trade authorization.'}
            </p>
          </div>

          {/* New Password Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">New {passwordType === 'master' ? 'Master' : 'Investor'} Password *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password *"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrengthBar password={newPassword} />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || newPassword.length < 8}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-full shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
