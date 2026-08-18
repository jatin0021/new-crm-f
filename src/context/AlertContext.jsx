import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, ShieldAlert, X } from 'lucide-react';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState(null);

  const showAlert = useCallback(({
    title = '',
    message = '',
    type = 'info',
    confirmText = 'OK',
    cancelText = null,
    onConfirm = null,
    onCancel = null
  }) => {
    return new Promise((resolve) => {
      setAlertConfig({
        title,
        message,
        type,
        confirmText,
        cancelText,
        onConfirm: () => {
          setAlertConfig(null);
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setAlertConfig(null);
          if (onCancel) onCancel();
          resolve(false);
        }
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    if (alertConfig?.onCancel) {
      alertConfig.onCancel();
    } else if (alertConfig?.onConfirm) {
      alertConfig.onConfirm();
    } else {
      setAlertConfig(null);
    }
  }, [alertConfig]);

  const alertSuccess = useCallback((message, title = 'Success') => {
    return showAlert({ title, message, type: 'success' });
  }, [showAlert]);

  const alertError = useCallback((message, title = 'Error') => {
    return showAlert({ title, message, type: 'error' });
  }, [showAlert]);

  const alertWarning = useCallback((message, title = 'Warning') => {
    return showAlert({ title, message, type: 'warning' });
  }, [showAlert]);

  const alertInfo = useCallback((message, title = 'Notice') => {
    return showAlert({ title, message, type: 'info' });
  }, [showAlert]);

  const showConfirm = useCallback((message, onConfirm, title = 'Confirm Action', confirmText = 'Confirm', cancelText = 'Cancel') => {
    return showAlert({
      title,
      message,
      type: 'warning',
      confirmText,
      cancelText,
      onConfirm
    });
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, alertSuccess, alertError, alertWarning, alertInfo, closeAlert }}>
      {children}

      {/* Global Beautiful Popup Modal Container */}
      {alertConfig && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Ambient Background Glow based on type */}
            <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
              alertConfig.type === 'success' ? 'bg-emerald-500/20' :
              alertConfig.type === 'error' ? 'bg-rose-500/20' :
              alertConfig.type === 'warning' ? 'bg-amber-500/20' :
              'bg-cyan-500/20'
            }`} />

            {/* Close Cross Button */}
            <button
              onClick={alertConfig.onCancel || alertConfig.onConfirm}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer p-1 rounded-full hover:bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content Header & Icon */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-md ${
                alertConfig.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                alertConfig.type === 'error' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                alertConfig.type === 'warning' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
              }`}>
                {alertConfig.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                {alertConfig.type === 'error' && <XCircle className="w-6 h-6" />}
                {alertConfig.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                {alertConfig.type === 'info' && <Info className="w-6 h-6" />}
              </div>

              <div className="pt-0.5 space-y-1 pr-6">
                <h3 className="text-lg font-black text-white tracking-tight">
                  {alertConfig.title || (
                    alertConfig.type === 'success' ? 'Success' :
                    alertConfig.type === 'error' ? 'Error' :
                    alertConfig.type === 'warning' ? 'Attention' : 'Notice'
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed break-words">
                  {alertConfig.message}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
              {alertConfig.cancelText && (
                <button
                  type="button"
                  onClick={alertConfig.onCancel}
                  className="px-4.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer"
                >
                  {alertConfig.cancelText}
                </button>
              )}

              <button
                type="button"
                onClick={alertConfig.onConfirm}
                className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer ${
                  alertConfig.type === 'error'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                    : alertConfig.type === 'warning'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 font-extrabold'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-emerald-500/25'
                }`}
              >
                {alertConfig.confirmText}
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
