import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  ShieldAlert, 
  Check, 
  X, 
  Eye, 
  Search, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight,
  RefreshCw,
  Mail,
  Globe,
  Tag,
  UserX
} from 'lucide-react';

export default function AdminDashboard({ onImpersonate = () => {} }) {
  const [adminTab, setAdminTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  // Default / Mock Users list fallback for instant rich demo view
  const defaultUsers = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'trader@example.com',
      country: 'United States',
      phone: '+1 555-0199',
      referral_code: 'REF1001',
      kyc_status: 'verified',
      is_active: true,
      created_at: '2026-08-01T10:30:00Z',
      accountsCount: 2,
      equity: 15890.20,
      walletBalance: 2500.00
    },
    {
      id: 2,
      first_name: 'Alex',
      last_name: 'Smith',
      email: 'alex.trader@example.com',
      country: 'United Kingdom',
      phone: '+44 7700 900077',
      referral_code: 'REF1002',
      kyc_status: 'pending',
      is_active: true,
      created_at: '2026-08-05T14:15:00Z',
      accountsCount: 1,
      equity: 5000.00,
      walletBalance: 500.00
    },
    {
      id: 3,
      first_name: 'Maria',
      last_name: 'Garcia',
      email: 'maria.investor@example.com',
      country: 'Spain',
      phone: '+34 612 345 678',
      referral_code: 'REF1003',
      kyc_status: 'verified',
      is_active: true,
      created_at: '2026-08-08T09:40:00Z',
      accountsCount: 3,
      equity: 32400.00,
      walletBalance: 4200.00
    },
    {
      id: 4,
      first_name: 'David',
      last_name: 'FX',
      email: 'david.fx@example.com',
      country: 'Germany',
      phone: '+49 151 23456789',
      referral_code: 'REF1004',
      kyc_status: 'unverified',
      is_active: true,
      created_at: '2026-08-10T16:20:00Z',
      accountsCount: 1,
      equity: 10000.00,
      walletBalance: 0.00
    },
    {
      id: 5,
      first_name: 'Chen',
      last_name: 'Wei',
      email: 'chen.wei@example.com',
      country: 'Singapore',
      phone: '+65 9123 4567',
      referral_code: 'REF1005',
      kyc_status: 'verified',
      is_active: false,
      created_at: '2026-08-12T11:05:00Z',
      accountsCount: 1,
      equity: 0.00,
      walletBalance: 0.00
    }
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [pendingDeposits, setPendingDeposits] = useState([
    { id: 101, user: 'alex.trader@example.com', amount: 5000.00, method: 'Bank Wire', date: '2026-08-10 14:20', receipt: 'receipt_101.jpg', status: 'pending' },
    { id: 102, user: 'maria.investor@example.com', amount: 1500.00, method: 'Cregis USDT', date: '2026-08-10 15:05', receipt: 'tx_hash_0x892a...', status: 'pending' },
    { id: 103, user: 'david.fx@example.com', amount: 10000.00, method: 'Bank Wire', date: '2026-08-10 15:40', receipt: 'receipt_103.pdf', status: 'pending' },
  ]);

  const [kycRequests, setKycRequests] = useState([
    { id: 201, name: 'Alex Smith', email: 'alex.trader@example.com', docType: 'Passport', submittedDate: '2026-08-11', status: 'pending' },
    { id: 202, name: 'David FX', email: 'david.fx@example.com', docType: 'National ID Card', submittedDate: '2026-08-12', status: 'pending' },
  ]);

  const fetchUsersFromApi = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('crm_admin_token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.users && data.data.users.length > 0) {
          setUsers(data.data.users);
        }
      }
    } catch (e) {
      console.warn('Backend API connection unavailable, displaying active in-memory user desk data.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsersFromApi();
  }, []);

  const handleApproveDeposit = (id) => {
    setPendingDeposits(pendingDeposits.filter(d => d.id !== id));
  };

  const handleApproveKyc = (id, newStatus) => {
    setKycRequests(kycRequests.map(k => k.id === id ? { ...k, status: newStatus } : k));
    setUsers(users.map(u => u.id === id ? { ...u, kyc_status: newStatus } : u));
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
  };

  // Filter users based on Search and Filter tab
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const country = (user.country || '').toLowerCase();
    const ref = (user.referral_code || '').toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          email.includes(searchQuery.toLowerCase()) || 
                          country.includes(searchQuery.toLowerCase()) ||
                          ref.includes(searchQuery.toLowerCase());

    if (statusFilter === 'verified') return matchesSearch && user.kyc_status === 'verified';
    if (statusFilter === 'pending') return matchesSearch && user.kyc_status === 'pending';
    if (statusFilter === 'unverified') return matchesSearch && user.kyc_status === 'unverified';
    if (statusFilter === 'active') return matchesSearch && user.is_active;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Back-Office Broker Console
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-400/10 text-emerald-400 text-[10px] font-mono font-bold rounded-full border border-emerald-400/20">
                Live Interop Sync
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">Risk, User & Financial Control Desk</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-2xl">
              Inspect registered trader profiles, perform session impersonations, manage identity verification, and approve deposit requests in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={fetchUsersFromApi}
              disabled={loadingUsers}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
              <span>Sync Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Registered Traders</span>
            <Users className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">{users.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">+100% active in-system</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Pending Deposits Queue</span>
            <DollarSign className="w-4.5 h-4.5 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-teal-600 font-mono">${pendingDeposits.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}</p>
          <span className="text-[10px] text-teal-700 font-bold mt-1 inline-block">{pendingDeposits.length} deposits pending review</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Active MT5 Logins</span>
            <Layers className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 font-mono">2,180</p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">Real-time live connections</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 card-shadow card-shadow-hover">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Pending KYC Reviews</span>
            <ShieldAlert className="w-4.5 h-4.5 text-cyan-600" />
          </div>
          <p className="text-3xl font-black text-cyan-600 font-mono">{kycRequests.filter(k => k.status === 'pending').length}</p>
          <span className="text-[10px] text-cyan-700 font-bold mt-1 inline-block">SLA &lt; 30 mins</span>
        </div>
      </div>

      {/* Admin Section Tabs Navigation */}
      <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl max-w-fit">
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Registered Traders ({users.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('deposits')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'deposits' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financial Deposits ({pendingDeposits.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'kyc' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>KYC Verifications ({kycRequests.filter(k => k.status === 'pending').length})</span>
        </button>
      </div>

      {/* TAB 1: ALL REGISTERED USERS MANAGEMENT */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow space-y-5 animate-in fade-in duration-200">
          
          {/* Header Controls: Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                Traders & Account Profiles Directory
              </h3>
              <p className="text-xs text-slate-500">Comprehensive overview of all accounts, contact info, referral tags, and KYC statuses.</p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search user name, email, ref code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-64 sm:w-72"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Filter: All Statuses</option>
                <option value="verified">KYC Verified</option>
                <option value="pending">KYC Pending</option>
                <option value="unverified">Unverified</option>
                <option value="active">Active Session Only</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3 pl-3">Trader UID / Profile</th>
                  <th className="pb-3">Contact Details</th>
                  <th className="pb-3">Ref Code</th>
                  <th className="pb-3">KYC Status</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3">Registered Date</th>
                  <th className="pb-3 text-right pr-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((user) => {
                  const uid = 10000000 + user.id;
                  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Trader User';
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* UID & Profile */}
                      <td className="py-4 pl-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                            {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block text-sm group-hover:text-emerald-600 transition-colors">
                              {fullName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              UID: {uid}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 font-medium text-slate-700">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user.country || 'N/A'}</span>
                            {user.phone && <span className="ml-1">({user.phone})</span>}
                          </div>
                        </div>
                      </td>

                      {/* Referral Code */}
                      <td className="py-4 font-mono font-bold text-slate-600">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black border border-slate-200/70 inline-flex items-center gap-1">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          {user.referral_code || 'DIRECT'}
                        </span>
                      </td>

                      {/* KYC Status */}
                      <td className="py-4">
                        {user.kyc_status === 'verified' && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        )}
                        {user.kyc_status === 'pending' && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-amber-600" /> Pending Review
                          </span>
                        )}
                        {user.kyc_status !== 'verified' && user.kyc_status !== 'pending' && (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[10px] font-bold">
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="py-4">
                        {user.is_active ? (
                          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-600 text-[10px] font-extrabold rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Suspended
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 text-slate-500 text-[11px] font-mono">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026-08-01'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right pr-3">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Login-As Impersonation */}
                          <button
                            onClick={() => onImpersonate(user.email)}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                            title="Login-As Trader Impersonation"
                          >
                            <span>Login-As</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          {/* View Full Details Modal */}
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
                            title="Inspect User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold space-y-2">
                      <UserX className="w-8 h-8 text-slate-300 mx-auto" />
                      <p>No matching trader records found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: FINANCIAL DEPOSITS REVIEW */}
      {adminTab === 'deposits' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Pending Financial Deposit Approvals</h3>
              <p className="text-xs text-slate-500">Review wire receipts and blockchain transactions before crediting trader MT5 balances.</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              {pendingDeposits.length} Pending Approval
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3 pl-2">Trader Email</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Gateway Method</th>
                  <th className="pb-3">Receipt / Tx Reference</th>
                  <th className="pb-3 text-right pr-2">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pendingDeposits.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 font-bold text-slate-900 flex items-center gap-2">
                      {item.user}
                      <button 
                        onClick={() => onImpersonate(item.user)}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full text-[10px] font-black border border-emerald-200 cursor-pointer transition-colors inline-flex items-center gap-0.5"
                      >
                        Login-As <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="py-4 font-mono font-black text-slate-900">${item.amount.toFixed(2)} USD</td>
                    <td className="py-4 font-bold text-slate-600">{item.method}</td>
                    <td className="py-4 text-slate-400 font-mono text-[11px]">{item.receipt}</td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveDeposit(item.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Credit
                        </button>
                        <button
                          onClick={() => handleApproveDeposit(item.id)}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all border border-rose-200"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingDeposits.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-semibold">
                      No pending deposits in review queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KYC VERIFICATION DESK */}
      {adminTab === 'kyc' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">KYC Identity Verification Queue</h3>
              <p className="text-xs text-slate-500">Verify government ID and proof of address documents uploaded by traders.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3 pl-2">Trader Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Submitted Document</th>
                  <th className="pb-3">Date Submitted</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {kycRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 font-bold text-slate-900">{req.name}</td>
                    <td className="py-4 text-slate-600 font-medium">{req.email}</td>
                    <td className="py-4 font-mono font-bold text-emerald-600">{req.docType}</td>
                    <td className="py-4 text-slate-400 font-mono text-[11px]">{req.submittedDate}</td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveKyc(req.id, 'verified')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve KYC
                        </button>
                        <button
                          onClick={() => handleApproveKyc(req.id, 'rejected')}
                          className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer border border-rose-200"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USER DETAILS INSPECTION MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative">
            
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {selectedUser.first_name ? selectedUser.first_name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  UID: {10000000 + selectedUser.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedUser.first_name} {selectedUser.last_name || ''}
                </h3>
                <span className="text-xs text-slate-500 font-medium">{selectedUser.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Country</span>
                <span className="font-extrabold text-slate-800">{selectedUser.country || 'United States'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone</span>
                <span className="font-extrabold text-slate-800">{selectedUser.phone || '+1 555-0199'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Referral Partner</span>
                <span className="font-mono font-bold text-emerald-600">{selectedUser.referral_code || 'REF1001'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">KYC Status</span>
                <span className="font-bold text-slate-800 capitalize">{selectedUser.kyc_status || 'verified'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => toggleUserStatus(selectedUser.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer border ${
                  selectedUser.is_active ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {selectedUser.is_active ? 'Suspend User Access' : 'Activate User Session'}
              </button>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  onImpersonate(selectedUser.email);
                }}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Login-As {selectedUser.first_name}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
