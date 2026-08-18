import React from 'react';
import { Check, X } from 'lucide-react';

export default function PasswordStrengthBar({ password = '' }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;

  const getLabel = () => {
    if (!password) return { text: 'Enter Password', color: 'text-slate-400', barBg: 'bg-slate-700', percent: '0%' };
    if (score <= 2) return { text: 'Weak', color: 'text-rose-400', barBg: 'bg-rose-500', percent: '25%' };
    if (score === 3) return { text: 'Medium', color: 'text-amber-400', barBg: 'bg-amber-500', percent: '50%' };
    if (score === 4) return { text: 'Strong', color: 'text-emerald-400', barBg: 'bg-emerald-500', percent: '75%' };
    return { text: 'Excellent Standards', color: 'text-teal-300', barBg: 'bg-gradient-to-r from-emerald-500 to-teal-400', percent: '100%' };
  };

  const info = getLabel();

  if (!password) return null;

  return (
    <div className="space-y-1.5 pt-1 animate-in fade-in">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-400">Password Strength:</span>
        <span className={info.color}>{info.text}</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-slate-800">
        <div 
          className={`h-full ${info.barBg} transition-all duration-300 rounded-full`} 
          style={{ width: info.percent }}
        />
      </div>

      {/* Interactive Criteria Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1 text-[10px] font-medium">
        <div className={`flex items-center gap-1 ${checks.length ? 'text-emerald-400' : 'text-slate-500'}`}>
          {checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>8+ Characters</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.uppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
          {checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Uppercase (A-Z)</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.lowercase ? 'text-emerald-400' : 'text-slate-500'}`}>
          {checks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Lowercase (a-z)</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.number ? 'text-emerald-400' : 'text-slate-500'}`}>
          {checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Number (0-9)</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.special ? 'text-emerald-400' : 'text-slate-500'}`}>
          {checks.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Symbol (!@#$)</span>
        </div>
      </div>
    </div>
  );
}
