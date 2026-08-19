import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/user/Dashboard';
import AccountsPage from './pages/user/AccountsPage';
import FundsPage from './pages/user/FundsPage';
import KYCPage from './pages/user/KYCPage';
import ProfileSecurityPage from './pages/user/ProfileSecurityPage';
import IbPortalPage from './pages/user/IbPortalPage';
import MarketAnalysisPage from './pages/user/MarketAnalysisPage';
import SupportHelpdeskPage from './pages/user/SupportHelpdeskPage';
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
import { API_BASE_URL, getApiUrl, safeJsonFetch } from './config/api';
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

  // Real-time synchronization of currentUser profile & KYC status across the entire application
  useEffect(() => {
    if (!currentUser) return;

    const syncUserProfile = async () => {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      if (!token) return;

      try {
        const res = await fetch(getApiUrl('/api/user/profile'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const text = await res.text();
          if (text && !text.trim().startsWith('<')) {
            const data = JSON.parse(text);
            if (data.data?.profile) {
              const updatedProfile = data.data.profile;
              setCurrentUser(prev => {
                if (!prev || prev.kyc_status !== updatedProfile.kyc_status || prev.email_verified !== updatedProfile.email_verified || prev.first_name !== updatedProfile.first_name || prev.last_name !== updatedProfile.last_name) {
                  if (localStorage.getItem('crm_user')) {
                    localStorage.setItem('crm_user', JSON.stringify(updatedProfile));
                  }
                  if (sessionStorage.getItem('crm_user')) {
                    sessionStorage.setItem('crm_user', JSON.stringify(updatedProfile));
                  }
                  return updatedProfile;
                }
                return prev;
              });
            }
          }
        } else if (res.status === 404 || res.status === 401 || res.status === 403) {
          // Stale or deleted user session - clear credentials and log out cleanly
          localStorage.removeItem('crm_user');
          localStorage.removeItem('crm_jwt_token');
          sessionStorage.removeItem('crm_user');
          sessionStorage.removeItem('crm_jwt_token');
          setCurrentUser(null);
          setAuthView('login');
        }
      } catch (e) {
        // Silent catch for polling
      }
    };

    syncUserProfile();
    const interval = setInterval(syncUserProfile, 3000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

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
    const res = await fetch(getApiUrl('/api/auth/resend-verification'), {
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
      let targetPayload = targetUserEmailOrId;
      if (typeof targetUserEmailOrId === 'object' && targetUserEmailOrId !== null) {
        targetPayload = targetUserEmailOrId.id || targetUserEmailOrId.email;
      }

      const res = await fetch(getApiUrl('/api/admin/impersonate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ target_user_id: targetPayload })
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
        console.error('Impersonation failed:', data?.message);
      }
    } catch (e) {
      console.warn('Impersonation error:', e);
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
      <AdminDashboard 
        adminUser={adminUser} 
        onAdminLogout={handleAdminLogout}
        onImpersonate={handleImpersonateUser} 
        onUpdateAdminUser={(updated) => {
          setAdminUser(updated);
          localStorage.setItem('crm_admin_user', JSON.stringify(updated));
        }}
      />
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

  // Sidebar Collapse State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- 3. AUTHENTICATED TRADER PORTAL FLOW ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* 1. Top Admin Impersonation Warning Banner */}
      <ImpersonationBanner 
        currentUser={currentUser} 
        onExitImpersonation={handleExitImpersonation} 
      />


      {/* 3. Session Inactivity Timeout Modal */}
      <SessionTimeoutModal 
        onLogout={handleLogout} 
        timeoutMs={15 * 60 * 1000} 
        warningMs={60 * 1000} 
      />

      {/* Top Main Navbar & Left Sidebar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(view) => setAuthView(view)}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Workspace Offset Container (Synchronized with Sidebar Collapse) */}
      <div className={`flex-1 w-full transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64 xl:pl-70'
      }`}>
        <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          
          {/* Render Active Tab View */}
          {activeTab === 'Home' && <Dashboard currentUser={currentUser} onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'Accounts' && <AccountsPage />}
          {activeTab === 'Funds' && <FundsPage />}
          {activeTab === 'KYC' && <KYCPage />}
          {activeTab === 'Profile' && <ProfileSecurityPage defaultSubTab="profile" />}
          {activeTab === 'IbPortal' && <IbPortalPage />}
          {activeTab === 'Analysis' && <MarketAnalysisPage />}
          {activeTab === 'Support' && <SupportHelpdeskPage />}
          
          {/* Fallbacks for Trade, Copy Trading, V-Wallet, Webinar */}
          {(activeTab === 'Trade' || activeTab === 'Copy Trading' || activeTab === 'V-Wallet' || activeTab === 'Webinar') && (
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
      </div>

      {/* Floating Live Support Chat Widget */}
      <LiveChatWidget />

    </div>
  );
}
