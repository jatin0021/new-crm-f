import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/user/Dashboard';
import AccountsPage from './pages/user/AccountsPage';
import FundsPage from './pages/user/FundsPage';
import KYCPage from './pages/user/KYCPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LiveChatWidget from './components/common/LiveChatWidget';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area - Expansive Layout Container */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        
        {/* Render Tab Content */}
        {activeTab === 'Home' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'Accounts' && <AccountsPage />}
        {activeTab === 'Funds' && <FundsPage />}
        {activeTab === 'KYC' && <KYCPage />}
        {activeTab === 'Admin' && <AdminDashboard onImpersonate={(user) => { alert(`Switched session: Impersonating ${user}`); setActiveTab('Home'); }} />}
        
        {/* Fallbacks for Trade, Copy Trading, V-Wallet, Webinar */}
        {(activeTab === 'Trade' || activeTab === 'Copy Trading' || activeTab === 'V-Wallet' || activeTab === 'Webinar' || activeTab === 'IBProgramme' || activeTab === 'Analysis' || activeTab === 'Support') && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-black text-xl">
              {activeTab.charAt(0)}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{activeTab} Module</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You are currently viewing the {activeTab} section of Succeed Capital CRM. All interactive trading components, live execution routing, and account metrics are active.
            </p>
            <button
              onClick={() => setActiveTab('Home')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-xs hover:shadow"
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

