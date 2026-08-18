import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { getApiUrl } from '../../config/api';

export default function VerificationBanner({ currentUser = null, onVerify = () => {} }) {
  const [userProfile, setUserProfile] = useState(() => {
    try {
      return currentUser || JSON.parse(localStorage.getItem('crm_user') || '{}');
    } catch (e) {
      return {};
    }
  });

  const [kycStatus, setKycStatus] = useState(() => {
    try {
      const u = currentUser || JSON.parse(localStorage.getItem('crm_user') || '{}');
      return (u?.kyc_status || u?.status || 'unverified').toLowerCase();
    } catch (e) {
      return 'unverified';
    }
  });

  // Keep state in sync with prop updates from App/Dashboard
  useEffect(() => {
    if (currentUser) {
      setUserProfile(prev => ({ ...prev, ...currentUser }));
      if (currentUser.kyc_status || currentUser.status) {
        setKycStatus((currentUser.kyc_status || currentUser.status).toLowerCase());
      }
    }
  }, [currentUser]);

  const checkStatusAndProfile = async () => {
    const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
    if (!token) return;
    try {
      const [kycRes, profileRes] = await Promise.all([
        fetch(getApiUrl('/api/kyc/status'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/user/profile'), { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const parseJsonSafely = async (res) => {
        if (!res || !res.ok) return null;
        try {
          const text = await res.text();
          if (!text || text.trim().startsWith('<')) return null;
          return JSON.parse(text);
        } catch (e) {
          return null;
        }
      };

      const kycData = await parseJsonSafely(kycRes);
      const fetchedKycSt = (kycData?.data?.kyc_status || kycData?.data?.status || '').toLowerCase();
      if (fetchedKycSt) {
        setKycStatus(fetchedKycSt);
        try {
          const userObj = JSON.parse(localStorage.getItem('crm_user') || '{}');
          if (userObj.kyc_status !== fetchedKycSt) {
            userObj.kyc_status = fetchedKycSt;
            localStorage.setItem('crm_user', JSON.stringify(userObj));
          }
        } catch (err) {}
      }

      const profData = await parseJsonSafely(profileRes);
      if (profData?.data?.profile) {
        setUserProfile(prev => ({ ...prev, ...profData.data.profile }));
        if (profData.data.profile.kyc_status) {
          setKycStatus(profData.data.profile.kyc_status.toLowerCase());
        }
      }
    } catch (e) {
      // Silent catch
    }
  };

  useEffect(() => {
    checkStatusAndProfile();
    const interval = setInterval(checkStatusAndProfile, 3000);
    return () => clearInterval(interval);
  }, []);

  const firstName = userProfile?.first_name || userProfile?.name?.split(' ')[0] || 'Trader';
  const lastName = userProfile?.last_name || userProfile?.name?.split(' ').slice(1).join(' ') || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const isVerified = ['verified', 'approved', 'passed', 'completed'].includes(kycStatus);
  const isPending = ['pending', 'in_review', 'under_review'].includes(kycStatus);
  const isRejected = ['rejected', 'failed', 'declined'].includes(kycStatus);

  const getProgressPercentage = () => {
    if (isVerified) return 100;
    if (isPending) return 50;
    if (isRejected) return 25;
    return 25;
  };

  const percentage = getProgressPercentage();
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getChecklist = () => {
    if (isVerified) {
      return [
        { label: 'Account opened', status: 'done' },
        { label: 'Compliance', status: 'done' },
        { label: 'Legal & Bank verified', status: 'done' },
        { label: 'Trading enabled', status: 'done' }
      ];
    }
    if (isPending) {
      return [
        { label: 'Account opened', status: 'done' },
        { label: 'Compliance review', status: 'pending' },
        { label: 'Legal & Bank pending', status: 'pending' },
        { label: 'Trading restricted', status: 'locked' }
      ];
    }
    if (isRejected) {
      return [
        { label: 'Account opened', status: 'done' },
        { label: 'Compliance rejected', status: 'rejected' },
        { label: 'Resubmission needed', status: 'rejected' },
        { label: 'Trading restricted', status: 'locked' }
      ];
    }
    return [
      { label: 'Account opened', status: 'done' },
      { label: 'Compliance required', status: 'action' },
      { label: 'Legal & Bank unverified', status: 'action' },
      { label: 'Trading restricted', status: 'locked' }
    ];
  };

  const checklist = getChecklist();

  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white border border-emerald-500/30 p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl hover:border-emerald-400">
      {/* Ambient Decorative Glow */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tl from-emerald-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Greeting & Subtitle */}
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">👋</span>
            <span>Hello {fullName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
            Welcome to your dashboard. Here you can review balances, switch accounts, and jump to deposits or trading.
          </p>

          {!isVerified && (
            <div className="pt-2">
              <button
                onClick={onVerify}
                className={`px-4.5 py-2 text-xs font-extrabold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                  isPending
                    ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 hover:bg-amber-400/30'
                    : isRejected
                    ? 'bg-rose-400/20 text-rose-200 border border-rose-400/40 hover:bg-rose-400/30'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                }`}
              >
                <span>
                  {isPending
                    ? 'Check Verification Status'
                    : isRejected
                    ? 'Re-upload KYC Documents'
                    : 'Complete Identity Verification'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Circular Progress Ring & Vertical Checklist */}
        <div className="flex items-center gap-5 sm:gap-6 shrink-0 bg-slate-950/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-inner relative z-10">
          
          {/* Circular SVG Gauge */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-white/10"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className={`transition-all duration-1000 ease-out ${
                  percentage === 100
                    ? 'stroke-emerald-400'
                    : percentage === 50
                    ? 'stroke-amber-400'
                    : percentage === 25 && isRejected
                    ? 'stroke-rose-400'
                    : 'stroke-teal-400'
                }`}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-lg font-black text-white font-sans tracking-tight">
                {percentage}%
              </span>
              <span className="text-[8px] sm:text-[9px] font-black text-emerald-300 tracking-wider uppercase">
                STATUS
              </span>
            </div>
          </div>

          {/* Vertical Checklist */}
          <div className="space-y-1.5 text-xs font-semibold">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {item.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {item.status === 'pending' && <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />}
                {item.status === 'rejected' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {item.status === 'action' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                {item.status === 'locked' && <Lock className="w-4 h-4 text-slate-400 shrink-0" />}

                <span
                  className={
                    item.status === 'done'
                      ? 'text-white font-bold'
                      : item.status === 'pending'
                      ? 'text-amber-200 font-bold'
                      : item.status === 'rejected'
                      ? 'text-rose-200 font-bold'
                      : 'text-slate-300/80'
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
