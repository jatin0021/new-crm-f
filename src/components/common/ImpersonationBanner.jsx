import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function ImpersonationBanner({ currentUser, onExitImpersonation = () => {} }) {
  if (!currentUser || !currentUser.isImpersonating) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 border-b border-amber-500/40 shadow-md sticky top-0 z-50 animate-in slide-in-from-top duration-300">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold">
        
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold uppercase tracking-wide bg-black/20 px-2 py-0.5 rounded text-[10px] mr-2">
              ADMIN IMPERSONATION MODE
            </span>
            <span>
              You are currently logged in on behalf of trader: <strong className="underline font-black">{currentUser.email}</strong> (ID #{currentUser.id})
            </span>
          </div>
        </div>

        <button
          onClick={onExitImpersonation}
          className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white rounded-full font-extrabold transition-all border border-amber-400/40 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Impersonation & Return to Admin Desk</span>
        </button>

      </div>
    </div>
  );
}
