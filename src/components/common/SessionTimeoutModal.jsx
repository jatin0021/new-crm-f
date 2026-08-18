import React, { useEffect, useState, useRef } from 'react';
import { Clock, ShieldAlert, LogOut, CheckCircle } from 'lucide-react';

export default function SessionTimeoutModal({ 
  onLogout = () => {}, 
  timeoutMs = 15 * 60 * 1000, // 15 minutes
  warningMs = 60 * 1000 // 60 second warning
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
    }
  };

  useEffect(() => {
    // Listen for user interaction events
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetActivity));

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivityRef.current;

      if (idleTime >= timeoutMs) {
        // Exceeded total timeout -> Trigger Logout
        setShowWarning(false);
        onLogout();
      } else if (idleTime >= timeoutMs - warningMs) {
        // Entered warning window -> Show Warning Modal
        if (!showWarning) {
          setShowWarning(true);
        }
        const remaining = Math.max(0, Math.ceil((timeoutMs - idleTime) / 1000));
        setRemainingSeconds(remaining);
      } else {
        if (showWarning) {
          setShowWarning(false);
        }
      }
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, resetActivity));
      clearInterval(checkInterval);
    };
  }, [timeoutMs, warningMs, showWarning, onLogout]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl text-white">
        
        <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
          <Clock className="w-7 h-7 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold tracking-tight">Session Inactivity Warning</h3>
          <p className="text-xs text-slate-400">
            For security compliance, your session will automatically expire due to inactivity.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-3xl font-black text-amber-400 tracking-wider">
            00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
          </span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Seconds Remaining
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={resetActivity}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Stay Logged In</span>
          </button>
          
          <button
            onClick={onLogout}
            className="py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs rounded-full transition-all border border-rose-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}
