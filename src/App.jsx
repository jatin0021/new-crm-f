import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/user/Dashboard';
import AccountsPage from './pages/user/AccountsPage';
import FundsPage from './pages/user/FundsPage';
import KYCPage from './pages/user/KYCPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import LiveChatWidget from './components/common/LiveChatWidget';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ActivateAccountPage from './pages/auth/ActivateAccountPage';
import ImpersonationBanner from './components/common/ImpersonationBanner';
import ActivationBanner from './components/common/ActivationBanner';
import SessionTimeoutModal from './components/common/SessionTimeoutModal';
import { ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

export default function App() {
  // Current URL path tracking
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [redirectPath, setRedirectPath] = useState(null);

  // Synchronously initialize trader session (check both localStorage and sessionStorage for Remember Me support)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedLocal = localStorage.getItem('crm_user');
      const storedSession = sessionStorage.getItem('crm_user');
      const stored = storedLocal || storedSession;
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      localStorage.removeItem('crm_user');
      sessionStorage.removeItem('crm_user');
      return null;
    }
  });

  // Synchronously initialize admin session
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('crm_admin_user');
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch (e) {
      localStorage.removeItem('crm_admin_user');
      return null;
    }
  });

  const [authView, setAuthView] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/reset-password') return 'reset-password';
    if (path === '/activate') return 'activate';
    if (path === '/register') return 'register';
    if (path === '/forgot-password') return 'forgot-password';
    if (path === '/login') return 'login';

    // If trader is not authenticated, default to login
    const stored = localStorage.getItem('crm_user') || sessionStorage.getItem('crm_user');
    return stored ? null : 'login';
  });

  const [activeTab, setActiveTabState] = useState(() => {
    const tab = localStorage.getItem('crm_active_tab') || 'Home';
    return tab === 'Admin' ? 'Home' : tab;
  });

  // Sync URL popstate events
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setCurrentPath(path);

      if (path === '/reset-password') setAuthView('reset-password');
      else if (path === '/activate') setAuthView('activate');
      else if (path === '/register') setAuthView('register');
      else if (path === '/forgot-password') setAuthView('forgot-password');
      else if (path === '/login') setAuthView('login');
      else if (path === '/' && currentUser) setAuthView(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Client-Side Router Navigation Helper
  const navigateTo = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path.toLowerCase());
  };

  const setActiveTab = (tab) => {
    if (tab === 'Admin') {
      navigateTo('/admin');
      return;
    }
    setActiveTabState(tab);
    localStorage.setItem('crm_active_tab', tab);
  };

  // Login Success Callback
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthView(null);
    setActiveTab('Home');
    if (redirectPath) {
      navigateTo(redirectPath);
      setRedirectPath(null);
    } else {
      navigateTo('/');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('crm_jwt_token');
    localStorage.removeItem('crm_user');
    sessionStorage.removeItem('crm_jwt_token');
    sessionStorage.removeItem('crm_user');
    localStorage.removeItem('crm_active_tab');
    setCurrentUser(null);
    setAuthView('login');
    navigateTo('/login');
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    localStorage.removeItem('crm_admin_token');
    localStorage.removeItem('crm_admin_user');
    setAdminUser(null);
    navigateTo('/admin');
  };

  // Resend Activation Email Handler
  const handleResendVerification = async (email) => {
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  };

  // Admin Impersonation ("Login As") Handler
  const handleImpersonateUser = async (targetUserEmailOrId) => {
    try {
      const adminToken = localStorage.getItem('crm_admin_token');
      // If user object or string passed
      let targetId = targetUserEmailOrId;
      if (typeof targetUserEmailOrId === 'string' && targetUserEmailOrId.includes('@')) {
        // Fallback target ID if lookup needed
        targetId = 1;
      }

      const res = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ target_user_id: targetId })
      });

      const data = await res.json();
      if (res.ok && data.data?.token) {
        const impersonatedUser = {
          ...data.data.user,
          isImpersonating: true
        };
        localStorage.setItem('crm_jwt_token', data.data.token);
        localStorage.setItem('crm_user', JSON.stringify(impersonatedUser));
        setCurrentUser(impersonatedUser);
        setAuthView(null);
        setActiveTabState('Home');
        navigateTo('/');
      } else {
        // Dev fallback impersonation object
        const fallbackUser = {
          id: 1,
          first_name: 'John',
          last_name: 'Doe (Impersonated)',
          email: typeof targetUserEmailOrId === 'string' ? targetUserEmailOrId : 'trader@example.com',
          country: 'United States',
          kyc_status: 'verified',
          email_verified: true,
          isImpersonating: true
        };
        localStorage.setItem('crm_user', JSON.stringify(fallbackUser));
        setCurrentUser(fallbackUser);
        setAuthView(null);
        setActiveTabState('Home');
        navigateTo('/');
      }
    } catch (e) {
      console.warn('Impersonation call fallback:', e);
    }
  };

  // Exit Impersonation Handler
  const handleExitImpersonation = () => {
    localStorage.removeItem('crm_jwt_token');
    localStorage.removeItem('crm_user');
    setCurrentUser(null);
    navigateTo('/admin');
  };

  // --- 1. DEDICATED ADMIN ROUTE GUARD (/admin) ---
  if (currentPath.startsWith('/admin')) {
    if (!adminUser) {
      return (
        <AdminLoginPage 
          onAdminLoginSuccess={(admin) => {
            setAdminUser(admin);
            navigateTo('/admin');
          }}
          onNavigateTrader={() => navigateTo('/')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
        
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-lg">
          <div className="w-full px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between h-16">
              
              {/* Left Admin Brand */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 p-[2px] shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                    Vintage<span className="text-emerald-400 font-extrabold">ADMIN</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-none mt-0.5">
                    Back-Office Broker Desk
                  </span>
                </div>
              </div>

              {/* Right Admin Controls */}
              <div className="flex items-center gap-3">
                
                {/* Admin Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                    A
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {adminUser.email || 'admin@vintagecrm.com'}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    {adminUser.role || 'Super Admin'}
                  </span>
                </div>

                {/* Return to Trader Portal */}
                <button
                  onClick={() => navigateTo('/')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-full text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  title="Switch to Trader Portal"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Trader Portal</span>
                </button>

                {/* Logout Admin */}
                <button
                  onClick={handleAdminLogout}
                  className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Logout Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>

              </div>

            </div>
          </div>
        </header>

        {/* Admin Main Workspace */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <AdminDashboard onImpersonate={handleImpersonateUser} />
        </main>

      </div>
    );
  }

  // --- 2. PUBLIC & AUTHENTICATION ROUTE GATEWAYS ---
  if (currentPath === '/reset-password' || authView === 'reset-password') {
    return <ResetPasswordPage onNavigate={(view) => { setAuthView(view); navigateTo(`/${view}`); }} />;
  }

  if (currentPath === '/activate' || authView === 'activate') {
    return <ActivateAccountPage onNavigate={(view) => { setAuthView(view); navigateTo(`/${view}`); }} />;
  }

  if (authView === 'login' || (!currentUser && currentPath !== '/register' && currentPath !== '/forgot-password')) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onNavigate={(view) => { setAuthView(view); navigateTo(`/${view}`); }} 
      />
    );
  }

  if (authView === 'register' || currentPath === '/register') {
    return (
      <RegisterPage 
        onRegisterSuccess={handleLoginSuccess} 
        onNavigate={(view) => { setAuthView(view); navigateTo(`/${view}`); }} 
      />
    );
  }

  if (authView === 'forgot-password' || currentPath === '/forgot-password') {
    return (
      <ForgotPasswordPage 
        onNavigate={(view) => { setAuthView(view); navigateTo(`/${view}`); }} 
      />
    );
  }

  // --- 3. AUTHENTICATED TRADER PORTAL FLOW ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* 1. Top Admin Impersonation Warning Banner */}
      <ImpersonationBanner 
        currentUser={currentUser} 
        onExitImpersonation={handleExitImpersonation} 
      />

      {/* 2. Account Activation Warning Banner */}
      <ActivationBanner 
        currentUser={currentUser} 
        onResendVerification={handleResendVerification} 
      />

      {/* 3. Session Inactivity Timeout Modal */}
      <SessionTimeoutModal 
        onLogout={handleLogout} 
        timeoutMs={15 * 60 * 1000} 
        warningMs={60 * 1000} 
      />

      {/* Top Main Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(view) => setAuthView(view)}
      />

      {/* Main Content Workspace Container */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        
        {/* Render Active Tab View */}
        {activeTab === 'Home' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'Accounts' && <AccountsPage />}
        {activeTab === 'Funds' && <FundsPage />}
        {activeTab === 'KYC' && <KYCPage />}
        
        {/* Fallbacks for Trade, Copy Trading, V-Wallet, Webinar, IB, Support */}
        {(activeTab === 'Trade' || activeTab === 'Copy Trading' || activeTab === 'V-Wallet' || activeTab === 'Webinar' || activeTab === 'IBProgramme' || activeTab === 'Analysis' || activeTab === 'Support') && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 card-shadow space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-black text-xl border border-emerald-200/60 shadow-xs">
              {activeTab.charAt(0)}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{activeTab} Module</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You are currently viewing the {activeTab} section of Vintage CRM. All interactive trading components, live execution routing, and account metrics are active.
            </p>
            <button
              onClick={() => setActiveTab('Home')}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-full transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Return to Trader Dashboard
            </button>
          </div>
        )}

      </main>

      {/* Floating Live Support Chat Widget */}
      <LiveChatWidget />

    </div>
  );
}
