import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Helper to add top-right corner floating toast notification (Matching Screenshot)
  const addToast = useCallback((message, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, title }]);

    // Auto dismiss toast after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const alertSuccess = useCallback((message, title = '') => {
    addToast(message, 'success', title);
  }, [addToast]);

  const alertError = useCallback((message, title = '') => {
    addToast(message, 'error', title);
  }, [addToast]);

  const alertWarning = useCallback((message, title = '') => {
    addToast(message, 'warning', title);
  }, [addToast]);

  const alertInfo = useCallback((message, title = '') => {
    addToast(message, 'info', title);
  }, [addToast]);

  const showAlert = useCallback(({ message, type = 'info', title = '' }) => {
    addToast(message, type, title);
  }, [addToast]);

  // Interactive Confirmation Modal (For critical action confirms like Delete User)
  const showConfirm = useCallback((message, onConfirm, title = 'Confirm Action', confirmText = 'Confirm', cancelText = 'Cancel') => {
    return new Promise((resolve) => {
      setConfirmConfig({
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirmConfig(null);
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setConfirmConfig(null);
          resolve(false);
        }
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    setToasts([]);
    setConfirmConfig(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, alertSuccess, alertError, alertWarning, alertInfo, closeAlert }}>
      {children}

      {/* TOP-RIGHT CORNER FLOATING TOAST NOTIFICATIONS (EXACTLY MATCHING SCREENSHOT 2) */}
      <div className="fixed top-5 right-5 z-[9999] space-y-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 animate-in slide-in-from-top-5 fade-in"
          >
            {/* Green / Color Checkmark Circle Icon */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' :
              toast.type === 'error' ? 'bg-rose-500 text-white' :
              toast.type === 'warning' ? 'bg-amber-500 text-slate-950' :
              'bg-blue-500 text-white'
            }`}>
              {toast.type === 'success' && <Check className="w-4 h-4 stroke-[3]" />}
              {toast.type === 'error' && <X className="w-4 h-4 stroke-[3]" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 stroke-[3]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 stroke-[3]" />}
            </div>

            {/* Message Text Container */}
            <div className="flex-1 min-w-0 text-left">
              {toast.title && <h4 className="text-xs font-black text-slate-900 tracking-tight block">{toast.title}</h4>}
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            {/* Dismiss Cross Icon */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* CONFIRMATION MODAL FOR DESTRUCTIVE / CRITICAL ACTIONS */}
      {confirmConfig && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 pt-0.5">
                <h3 className="text-lg font-black text-white tracking-tight">{confirmConfig.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  {confirmConfig.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={confirmConfig.onCancel}
                className="px-4.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
              >
                {confirmConfig.cancelText || 'Cancel'}
              </button>

              <button
                type="button"
                onClick={confirmConfig.onConfirm}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md transition cursor-pointer"
              >
                {confirmConfig.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
