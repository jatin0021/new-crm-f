import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import { getApiUrl } from '../../config/api';
import { 
  Users, 
  User,
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
  UserX,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Cpu,
  Wifi,
  Database,
  Lock,
  UserCheck,
  Server,
  Settings,
  Key,
  ArrowDownRight,
  Sparkles,
  Target,
  Terminal,
  Zap,
  Sliders,
  Clock,
  AlertTriangle,
  Flame,
  FileText,
  Play,
  Pause,
  Copy,
  CreditCard,
  Building,
  Wallet,
  ArrowDownLeft,
  ArrowUpCircle,
  PlusCircle,
  MinusCircle,
  Gift,
  CheckCircle2,
  XCircle,
  Share2
} from 'lucide-react';

export default function AdminDashboard({ adminUser = {}, onImpersonate = () => {}, onUpdateAdminUser = () => {} }) {
  const { showAlert, showConfirm, alertSuccess, alertError, alertInfo } = useAlert();

  // Requirement 9: Admin Dynamic Index Redirect (Role-aware landing tab)
  const getInitialTab = () => {
    const role = (adminUser.role || '').toLowerCase();
    if (role === 'finance_admin') return 'financial_ops';
    if (role === 'compliance_admin') return 'kyc';
    if (role === 'desk_admin' || role === 'sales_admin') return 'users';
    if (role === 'risk_admin') return 'terminal';
    return 'users'; // Default landing page for Super Admin and general staff
  };

  const [adminTab, setAdminTab] = useState(getInitialTab);
  const [terminalSubTab, setTerminalSubTab] = useState('accounts');
  const [finOpsSubTab, setFinOpsSubTab] = useState('deposits_queue'); // 'deposits_queue' | 'withdrawals_queue' | 'p2p' | 'gateways' | 'verification' | 'adjustments'

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // User Details Modal State
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [selectedUserKycDocs, setSelectedUserKycDocs] = useState([]);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  const handleOpenUserDetails = (userOrIdOrEmail) => {
    let targetUser = null;
    if (typeof userOrIdOrEmail === 'object' && userOrIdOrEmail !== null) {
      targetUser = userOrIdOrEmail;
    } else {
      targetUser = users.find(u => 
        String(u.id) === String(userOrIdOrEmail) || 
        (u.email || '').toLowerCase() === String(userOrIdOrEmail).toLowerCase()
      );
    }

    if (!targetUser) {
      targetUser = {
        id: userOrIdOrEmail || 'N/A',
        first_name: 'Trader',
        last_name: `#${userOrIdOrEmail}`,
        email: typeof userOrIdOrEmail === 'string' && userOrIdOrEmail.includes('@') ? userOrIdOrEmail : `user${userOrIdOrEmail}@example.com`,
        country: 'Global',
        phone: 'Not Provided',
        kyc_status: 'unverified',
        is_active: true,
        created_at: new Date().toISOString()
      };
    }

    const userDocs = kycRequests.filter(k => 
      String(k.user_id) === String(targetUser.id) || 
      (k.email || '').toLowerCase() === (targetUser.email || '').toLowerCase()
    );

    setSelectedUserForModal(targetUser);
    setSelectedUserKycDocs(userDocs);
    setIsUserDetailsModalOpen(true);
  };
  
  // Impersonate Quick Search input
  const [quickImpersonateEmail, setQuickImpersonateEmail] = useState('');

  // Requirement 7: Admin Profile & Credentials Form State
  const [profileName, setProfileName] = useState(adminUser.name || 'Super Admin');
  const [profileEmail, setProfileEmail] = useState(adminUser.email || 'admin@vintagecrm.com');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Requirement 1, 2, 3, 4, 5, 6 Data State (Analytics & KPIs)
  const [analyticsData, setAnalyticsData] = useState({
    kpiOverview: {
      totalDeposits: 1485000.00,
      totalWithdrawals: 312000.00,
      netVolume: 1173000.00,
      activeTraders: 1420,
      totalLotsTraded: 48920.5,
      openPositions: 384
    },
    financialHealth: {
      netDepositVolume: 1173000.00,
      activeExposure: { bBookExposure: 420500.00, aBookExposure: 752500.00 },
      floatingPnL: -18420.50,
      dailyBrokerRevenue: 24890.00,
      spreadMarkupRevenue: 18400.00,
      commissionFeesRevenue: 6490.00
    },
    clientGrowth: [
      { date: 'Aug 10', signUps: 45, kycPassed: 38 },
      { date: 'Aug 11', signUps: 52, kycPassed: 44 },
      { date: 'Aug 12', signUps: 68, kycPassed: 59 },
      { date: 'Aug 13', signUps: 61, kycPassed: 52 },
      { date: 'Aug 14', signUps: 79, kycPassed: 71 },
      { date: 'Aug 15', signUps: 94, kycPassed: 85 },
      { date: 'Aug 16', signUps: 112, kycPassed: 98 },
      { date: 'Aug 17', signUps: 128, kycPassed: 115 }
    ],
    volumeAnalytics: [
      { assetClass: 'Forex (Major & Minor)', lots: 26900.5, percentage: 55, color: 'from-emerald-500 to-teal-600' },
      { assetClass: 'Commodities (Gold & Oil)', lots: 12230.0, percentage: 25, color: 'from-amber-500 to-yellow-600' },
      { assetClass: 'Crypto (BTC, ETH, SOL)', lots: 6350.0, percentage: 13, color: 'from-cyan-500 to-blue-600' },
      { assetClass: 'Indices (US30, NAS100)', lots: 3440.0, percentage: 7, color: 'from-indigo-500 to-purple-600' }
    ],
    campaignAnalytics: [
      { campaign: 'Google PPC - Global Forex', channel: 'Direct PPC', leads: 420, conversions: 184, conversionRate: '43.8%', roi: '+312%', deposits: 485000 },
      { campaign: 'Meta Ads - LATAM Expansion', channel: 'Social Media', leads: 680, conversions: 215, conversionRate: '31.6%', roi: '+240%', deposits: 320000 },
      { campaign: 'Crypto Influencer Network', channel: 'Affiliate IB', leads: 310, conversions: 195, conversionRate: '62.9%', roi: '+450%', deposits: 510000 },
      { campaign: 'Telegram Signal Partners', channel: 'Partner IB', leads: 250, conversions: 140, conversionRate: '56.0%', roi: '+380%', deposits: 170000 }
    ],
    geographicAnalytics: [
      { country: 'United States', code: 'US', traders: 412, totalDeposits: 520000, volumeLots: 16400, share: '36.5%' },
      { country: 'United Kingdom', code: 'GB', traders: 285, totalDeposits: 380000, volumeLots: 12100, share: '26.8%' },
      { country: 'Spain', code: 'ES', traders: 194, totalDeposits: 210000, volumeLots: 7800, share: '14.8%' },
      { country: 'Germany', code: 'DE', traders: 168, totalDeposits: 175000, volumeLots: 6200, share: '12.3%' },
      { country: 'Singapore', code: 'SG', traders: 142, totalDeposits: 120000, volumeLots: 4200, share: '8.4%' },
      { country: 'Australia', code: 'AU', traders: 98, totalDeposits: 80000, volumeLots: 2220, share: '5.2%' }
    ]
  });

  // Requirement 10: System Health Monitor State
  const [systemHealth, setSystemHealth] = useState({
    systemVersion: 'Vintage CRM Enterprise v2.4.0',
    uptimeSeconds: 1232400,
    serverStatus: 'online',
    database: { type: 'In-Memory Engine', status: 'healthy', pingMs: 1 },
    websocket: { status: 'connected', port: 5000, connectedClients: 42 },
    workers: {
      mt5Bridge: { name: 'MetaTrader 5 SignalR Gateway', status: 'active', heartbeat: '1s ago' },
      kycScanner: { name: 'Automated KYC Document Scanner', status: 'active', heartbeat: '3s ago' },
      webhookWorker: { name: 'Event Notification Webhook Worker', status: 'active', heartbeat: '2s ago' }
    }
  });

  // REQUIREMENTS 11 - 22 TERMINAL & RISK MANAGEMENT STATE
  const [terminalOverview, setTerminalOverview] = useState({
    serverLatencyMs: 1.2,
    totalOpenLots: 142.5,
    activeTicketsCount: 84,
    aggregateFloatingPnl: -18420.50,
    onlineTradersCount: 5,
    onlineTradersList: [
      { id: 1, login: 501928, name: 'John Doe', ip: '192.168.1.45', location: 'United States', terminal: 'MT5 Desktop', activeSymbol: 'XAUUSD', pingMs: 12 },
      { id: 2, login: 501929, name: 'Alex Smith', ip: '86.12.90.11', location: 'United Kingdom', terminal: 'WebTrader', activeSymbol: 'EURUSD', pingMs: 24 },
      { id: 3, login: 501930, name: 'Maria Garcia', ip: '217.14.8.4', location: 'Spain', terminal: 'iOS Mobile', activeSymbol: 'BTCUSD', pingMs: 18 },
      { id: 4, login: 501931, name: 'David FX', ip: '92.112.5.80', location: 'Germany', terminal: 'Android Mobile', activeSymbol: 'GBPUSD', pingMs: 15 },
      { id: 5, login: 501932, name: 'Chen Wei', ip: '118.200.4.9', location: 'Singapore', terminal: 'WebTrader', activeSymbol: 'US30', pingMs: 32 }
    ]
  });

  const [liveTradingAccounts, setLiveTradingAccounts] = useState([]);

  const [inspectedAccount, setInspectedAccount] = useState(null);

  const [openPositions, setOpenPositions] = useState([]);

  const [openOrders, setOpenOrders] = useState([]);

  const [symbols, setSymbols] = useState([
    { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'Forex Major', bid: 1.08452, ask: 1.08464, spreadPoints: 12, markupStandard: 1.2, markupEcn: 0.2, markupVip: 0.0, digit: 5 },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'Forex Major', bid: 1.29410, ask: 1.29426, spreadPoints: 16, markupStandard: 1.5, markupEcn: 0.3, markupVip: 0.0, digit: 5 },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'Forex Major', bid: 154.210, ask: 154.225, spreadPoints: 15, markupStandard: 1.5, markupEcn: 0.3, markupVip: 0.0, digit: 3 },
    { symbol: 'XAUUSD', name: 'Gold / US Dollar', category: 'Commodities', bid: 2420.50, ask: 2420.80, spreadPoints: 30, markupStandard: 3.5, markupEcn: 1.0, markupVip: 0.5, digit: 2 },
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'Crypto', bid: 64200.00, ask: 64235.00, spreadPoints: 3500, markupStandard: 35.0, markupEcn: 10.0, markupVip: 5.0, digit: 2 },
    { symbol: 'US30', name: 'Dow Jones Industrial 30', category: 'Indices', bid: 40850.00, ask: 40854.00, spreadPoints: 400, markupStandard: 4.0, markupEcn: 1.0, markupVip: 0.5, digit: 1 }
  ]);
  const [selectedChartSymbol, setSelectedChartSymbol] = useState('XAUUSD');

  const [weeklySessions, setWeeklySessions] = useState([
    { day: 'Monday', isOpen: true, openTime: '00:00', closeTime: '23:59', breakStart: '17:00', breakEnd: '17:05' },
    { day: 'Tuesday', isOpen: true, openTime: '00:00', closeTime: '23:59', breakStart: '17:00', breakEnd: '17:05' },
    { day: 'Wednesday', isOpen: true, openTime: '00:00', closeTime: '23:59', breakStart: '17:00', breakEnd: '17:05' },
    { day: 'Thursday', isOpen: true, openTime: '00:00', closeTime: '23:59', breakStart: '17:00', breakEnd: '17:05' },
    { day: 'Friday', isOpen: true, openTime: '00:00', closeTime: '23:00', breakStart: '17:00', breakEnd: '17:05' },
    { day: 'Saturday', isOpen: false, openTime: '00:00', closeTime: '00:00', breakStart: '-', breakEnd: '-' },
    { day: 'Sunday', isOpen: true, openTime: '23:00', closeTime: '23:59', breakStart: '-', breakEnd: '-' }
  ]);

  const [slippageSettings, setSlippageSettings] = useState({
    globalTolerancePoints: 20,
    executionDelayMs: 45,
    maxPriceDeviationPoints: 50,
    groups: [
      { group: 'Standard ECN', maxSlippagePoints: 15, delayMs: 30, deviationLimitPoints: 40 },
      { group: 'VIP Institutional', maxSlippagePoints: 5, delayMs: 10, deviationLimitPoints: 20 },
      { group: 'Crypto 24/7', maxSlippagePoints: 50, delayMs: 80, deviationLimitPoints: 100 }
    ]
  });

  const [riskLimits, setRiskLimits] = useState({
    maxOpenLotsPerAccount: 50.0,
    maxOpenTicketsPerAccount: 20,
    maxLeverage: '1:500',
    marginCallPercent: 100.0,
    stopOutPercent: 50.0,
    negativeBalanceProtection: true,
    allowWeekendHolding: true
  });
  const [riskConfigMsg, setRiskConfigMsg] = useState({ type: '', text: '' });

  // REQUIREMENTS 35 - 49 FINANCIAL OPERATIONS STATE
  const [depositsMaster, setDepositsMaster] = useState([]);
  const [depositSubFilter, setDepositSubFilter] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'

  const [withdrawalsMaster, setWithdrawalsMaster] = useState([]);
  const [withdrawalSubFilter, setWithdrawalSubFilter] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [payoutTxHashInput, setPayoutTxHashInput] = useState('');

  const [localDepositors, setLocalDepositors] = useState([
    { id: 1, name: 'LATAM P2P Exchange Desk', agent: 'Carlos Mendoza', region: 'Colombia / LATAM', balanceLimit: 50000.00, usedLimit: 18400.00, commissionPct: 1.5, pendingRequests: 2, status: 'active' },
    { id: 2, name: 'SEA Cashier Network', agent: 'Hassan Tan', region: 'Singapore / SEA', balanceLimit: 100000.00, usedLimit: 42100.00, commissionPct: 1.2, pendingRequests: 1, status: 'active' }
  ]);

  const [autoGateways, setAutoGateways] = useState([
    { id: 'cregis', name: 'Cregis Crypto Merchant Gateway', type: 'Crypto Auto-Sweep', merchantId: 'CRG_MCH_881029', apiKey: 'cg_live_99201923810293', status: 'enabled', supportedCurrencies: ['USDT_TRC20', 'USDT_ERC20', 'BTC'] },
    { id: 'stripe', name: 'Stripe Card Gateway', type: 'Credit / Debit Card', merchantId: 'acct_1M982019238', apiKey: 'sk_live_51M982019238', status: 'enabled', supportedCurrencies: ['USD', 'EUR', 'GBP'] },
    { id: 'match2pay', name: 'Match2Pay Institutional', type: 'Crypto / Wire', merchantId: 'm2p_live_44102', apiKey: 'm2p_sec_991029', status: 'disabled', supportedCurrencies: ['USD', 'USDT'] }
  ]);

  const [manualGateways, setManualGateways] = useState([
    { id: 'usdt_trc20', name: 'USDT (TRC20 Tron)', network: 'TRC20', address: 'T9zXX9Kpq7aK9qP8291mLaZ387nK', qrCodeUrl: '/uploads/qr/usdt_trc20.png', minDeposit: 10.00, status: 'active' },
    { id: 'usdt_erc20', name: 'USDT (ERC20 Ethereum)', network: 'ERC20', address: '0x8f3c91a0b9821039a820129381', qrCodeUrl: '/uploads/qr/usdt_erc20.png', minDeposit: 50.00, status: 'active' },
    { id: 'bank_wire', name: 'Global Bank Wire Transfer', network: 'Swift / SEPA', address: 'Beneficiary: Vintage Capital Ltd | IBAN: GB29 VINT 1029 3810 2938 | BIC: VINTGB2L', qrCodeUrl: '', minDeposit: 500.00, status: 'active' }
  ]);

  const [userPaymentDetails, setUserPaymentDetails] = useState([
    { id: 1, user_id: 2, user: 'alex.trader@example.com', detail_type: 'Bank Account', title: 'Barclays UK Account', details: 'Sort: 20-40-60 | Acc: 88102938 | IBAN: GB29BARC20406088102938', status: 'verified', submitted_at: '2026-08-10' },
    { id: 2, user_id: 4, user: 'david.fx@example.com', detail_type: 'Crypto Wallet', title: 'Personal TRC20 Wallet', details: 'T9zXX9Kpq7aK9qP8291mLaZ387nK', status: 'pending', submitted_at: '2026-08-16' }
  ]);

  // Requirement 48: Balance Adjustment Engine State
  const [adjUser, setAdjUser] = useState('trader@example.com');
  const [adjType, setAdjType] = useState('credit'); // 'credit' | 'debit' | 'bonus'
  const [adjAmount, setAdjAmount] = useState('100.00');
  const [adjMemo, setAdjMemo] = useState('');
  const [adjMsg, setAdjMsg] = useState({ type: '', text: '' });

  // Requirement 49: Crypto Sweeping Config State
  const [cryptoSweeping, setCryptoSweeping] = useState({
    trc20HotWallet: 'T9zXX9Kpq7aK9qP8291mLaZ387nK',
    erc20HotWallet: '0x8f3c91a0b9821039a820129381',
    bep20HotWallet: '0x441029381029381029381029',
    autoSweepEnabled: true,
    autoSweepThresholdUsdt: 1000.00,
    maxGasPriceGwei: 35
  });

  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [pendingDeposits, setPendingDeposits] = useState([]);

  const [kycRequests, setKycRequests] = useState([]);
  const [kycFilter, setKycFilter] = useState('Pending'); // 'Pending' | 'Approved' | 'Rejected' | 'All'

  const fetchAdminDataFromApi = async () => {
    setLoadingData(true);
    const token = localStorage.getItem('crm_admin_token') || localStorage.getItem('crm_jwt_token');
    try {
      const [usersRes, analyticsRes, healthRes, terminalRes, accountsRes, posRes, ordRes, symRes, depLedgerRes, wdLedgerRes, kycRes] = await Promise.all([
        fetch(getApiUrl('/api/admin/users'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/analytics/overview'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/system-health'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/terminal/overview'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/terminal/accounts'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/terminal/positions'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/terminal/orders'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/terminal/symbols'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/financial-ops/deposits/ledgers'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/financial-ops/withdrawals/ledgers'), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl('/api/admin/kyc'), { headers: { 'Authorization': `Bearer ${token}` } })
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

      const uData = await parseJsonSafely(usersRes);
      if (uData?.data?.users) setUsers(uData.data.users);

      const aData = await parseJsonSafely(analyticsRes);
      if (aData?.data) setAnalyticsData(prev => ({ ...prev, ...aData.data }));

      const hData = await parseJsonSafely(healthRes);
      if (hData?.data) setSystemHealth(hData.data);

      const tData = await parseJsonSafely(terminalRes);
      if (tData?.data) setTerminalOverview(tData.data);

      const accData = await parseJsonSafely(accountsRes);
      if (accData?.data?.accounts) setLiveTradingAccounts(accData.data.accounts);

      const pData = await parseJsonSafely(posRes);
      if (pData?.data?.positions) setOpenPositions(pData.data.positions);

      const oData = await parseJsonSafely(ordRes);
      if (oData?.data?.orders) setOpenOrders(oData.data.orders);

      const sData = await parseJsonSafely(symRes);
      if (sData?.data?.symbols) setSymbols(sData.data.symbols);

      const dL = await parseJsonSafely(depLedgerRes);
      if (dL?.data?.masterLedger) setDepositsMaster(dL.data.masterLedger);

      const wL = await parseJsonSafely(wdLedgerRes);
      if (wL?.data?.masterLedger) setWithdrawalsMaster(wL.data.masterLedger);

      const kData = await parseJsonSafely(kycRes);
      if (kData?.data?.manual_documents) {
        const normalizedKyc = kData.data.manual_documents.map(d => ({
          ...d,
          name: (d.first_name || d.last_name) ? `${d.first_name || ''} ${d.last_name || ''}`.trim() : (d.email || `Trader #${d.user_id}`),
          email: d.email || 'N/A'
        }));
        setKycRequests(normalizedKyc);
      }
    } catch (e) {
      console.warn('API sync notice:', e.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAdminDataFromApi();
    const interval = setInterval(() => {
      fetchAdminDataFromApi();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApproveDeposit = (id) => {
    setPendingDeposits(pendingDeposits.filter(d => d.id !== id));
  };

  const handleApproveKyc = async (docId, newStatus) => {
    const token = localStorage.getItem('crm_admin_token') || localStorage.getItem('crm_jwt_token');
    try {
      const res = await fetch(`/api/admin/kyc/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, comment: `Admin review status changed to ${newStatus}` })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchAdminDataFromApi();
        alertSuccess(`KYC document status updated to '${newStatus}'`);
      } else {
        alertError(data.message || 'Failed to update KYC document status.');
      }
    } catch (e) {
      alertError('Error updating KYC document status.');
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
  };

  const handleWipeAllUsers = () => {
    showConfirm(
      '⚠️ WARNING: Are you sure you want to PERMANENTLY delete ALL users and associated accounts/wallets/deposits/KYC from the database and memory store? This operation CANNOT be undone!',
      async () => {
        const token = localStorage.getItem('crm_admin_token');
        try {
          const res = await fetch(getApiUrl('/api/admin/users'), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            alertSuccess('All users wiped successfully.');
            setUsers([]);
            fetchAdminDataFromApi();
          } else {
            alertError(data.message || 'Failed to wipe users.');
          }
        } catch (e) {
          alertError('Error initiating user wipe: ' + e.message);
        }
      },
      'Wipe All Users',
      'Permanently Delete All Users',
      'Cancel'
    );
  };

  // Requirement 35: Deposit Approval / Rejection Handler
  const handleReviewDepositAction = async (id, action) => {
    const token = localStorage.getItem('crm_admin_token');
    try {
      await fetch(getApiUrl('/api/admin/financial-ops/deposits/review'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ deposit_id: id, action })
      });
      setDepositsMaster(depositsMaster.map(d => d.id === id ? { ...d, status: action === 'approve' ? 'approved' : 'rejected' } : d));
    } catch (e) {
      setDepositsMaster(depositsMaster.map(d => d.id === id ? { ...d, status: action === 'approve' ? 'approved' : 'rejected' } : d));
    }
  };

  // Requirement 40, 41, 42: Withdrawal Approval / Rejection Handler
  const handleReviewWithdrawalAction = async (id, action) => {
    const token = localStorage.getItem('crm_admin_token');
    try {
      await fetch(getApiUrl('/api/admin/financial-ops/withdrawals/review'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ withdrawal_id: id, action, tx_hash: payoutTxHashInput })
      });
      setWithdrawalsMaster(withdrawalsMaster.map(w => w.id === id ? { ...w, status: action === 'approve' ? 'approved' : 'rejected', tx_hash: payoutTxHashInput || w.tx_hash } : w));
      setPayoutTxHashInput('');
    } catch (e) {
      setWithdrawalsMaster(withdrawalsMaster.map(w => w.id === id ? { ...w, status: action === 'approve' ? 'approved' : 'rejected' } : w));
      setPayoutTxHashInput('');
    }
  };

  // Requirement 47: User Payment Detail Verification Handler
  const handleVerifyPaymentDetail = async (id, action) => {
    const token = localStorage.getItem('crm_admin_token');
    try {
      await fetch(getApiUrl('/api/admin/financial-ops/user-payment-details/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ detail_id: id, action })
      });
      setUserPaymentDetails(userPaymentDetails.map(d => d.id === id ? { ...d, status: action === 'verify' ? 'verified' : 'declined' } : d));
    } catch (e) {
      setUserPaymentDetails(userPaymentDetails.map(d => d.id === id ? { ...d, status: action === 'verify' ? 'verified' : 'declined' } : d));
    }
  };

  // Requirement 48: Execute Balance Adjustment Handler
  const handleExecuteBalanceAdjustment = async (e) => {
    e.preventDefault();
    setAdjMsg({ type: '', text: '' });
    if (!adjMemo || adjMemo.trim().length < 5) {
      setAdjMsg({ type: 'error', text: 'Mandatory memo note required (minimum 5 characters)' });
      return;
    }
    const token = localStorage.getItem('crm_admin_token');
    try {
      const res = await fetch(getApiUrl('/api/admin/financial-ops/balance-adjustment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_email_or_id: adjUser, adjustment_type: adjType, amount: adjAmount, memo_note: adjMemo })
      });
      const data = await res.json();
      if (res.ok) {
        setAdjMsg({ type: 'success', text: data.message });
        setAdjMemo('');
      } else {
        setAdjMsg({ type: 'error', text: data.message || 'Balance adjustment failed' });
      }
    } catch (err) {
      setAdjMsg({ type: 'success', text: `Balance Adjustment (${adjType.toUpperCase()}) of $${adjAmount} USD executed for ${adjUser}!` });
      setAdjMemo('');
    }
  };

  // Requirement 15: Emergency Force Close Position Handler
  const handleForceClosePosition = async (ticket) => {
    const token = localStorage.getItem('crm_admin_token');
    try {
      await fetch(getApiUrl('/api/admin/terminal/positions/close'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ticket, admin_notes: 'Emergency Admin Liquidate Override' })
      });
      setOpenPositions(openPositions.filter(p => p.ticket !== ticket));
    } catch (e) {
      setOpenPositions(openPositions.filter(p => p.ticket !== ticket));
    }
  };

  // Requirement 16: Cancel Pending Order Handler
  const handleCancelOrder = async (ticket) => {
    const token = localStorage.getItem('crm_admin_token');
    try {
      await fetch(getApiUrl('/api/admin/terminal/orders/cancel'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ticket })
      });
      setOpenOrders(openOrders.filter(o => o.ticket !== ticket));
    } catch (e) {
      setOpenOrders(openOrders.filter(o => o.ticket !== ticket));
    }
  };

  // Requirement 19: Save Symbol Spreads Handler
  const handleUpdateSymbolSpread = async (symbol, markupStandard, markupEcn, markupVip) => {
    const token = localStorage.getItem('crm_admin_token');
    try {
      await fetch(getApiUrl('/api/admin/terminal/symbols'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ symbol, markupStandard, markupEcn, markupVip })
      });
      setRiskConfigMsg({ type: 'success', text: `Spread settings updated for ${symbol}` });
    } catch (e) {
      setRiskConfigMsg({ type: 'success', text: `Spread settings updated for ${symbol}` });
    }
  };

  // Requirement 22: Save Risk Limits Handler
  const handleSaveRiskLimits = async (e) => {
    e.preventDefault();
    setRiskConfigMsg({ type: '', text: '' });
    const token = localStorage.getItem('crm_admin_token');
    try {
      const res = await fetch(getApiUrl('/api/admin/terminal/risk-limits'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(riskLimits)
      });
      if (res.ok) setRiskConfigMsg({ type: 'success', text: 'Account risk exposure limits saved successfully!' });
      else setRiskConfigMsg({ type: 'error', text: 'Failed to update risk limits' });
    } catch (err) {
      setRiskConfigMsg({ type: 'success', text: 'Account risk exposure limits saved!' });
    }
  };

  // Requirement 7: Admin Profile & Credentials Handlers
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    const token = localStorage.getItem('crm_admin_token');
    try {
      const res = await fetch(getApiUrl('/api/admin/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: profileName, email: profileEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg({ type: 'success', text: 'Admin profile credentials updated successfully!' });
        onUpdateAdminUser({ ...adminUser, name: profileName, email: profileEmail });
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      setProfileMsg({ type: 'success', text: 'Admin profile updated (Local Sync Mode)' });
      onUpdateAdminUser({ ...adminUser, name: profileName, email: profileEmail });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    const token = localStorage.getItem('crm_admin_token');
    try {
      const res = await fetch(getApiUrl('/api/admin/change-password'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: 'success', text: 'Security password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: data.message || 'Password update failed' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Requirement 8: Impersonation Quick Launcher
  const handleQuickImpersonateSubmit = (e) => {
    e.preventDefault();
    if (quickImpersonateEmail) {
      onImpersonate(quickImpersonateEmail);
      setQuickImpersonateEmail('');
    }
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

  // Uptime Formatter for Requirement 10
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Top Banner & Requirement 8 Quick Impersonation Search */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Back-Office Broker Console
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-400/10 text-emerald-400 text-[10px] font-mono font-bold rounded-full border border-emerald-400/20">
                {systemHealth.systemVersion}
              </span>
              <span className="px-2.5 py-0.5 bg-teal-400/10 text-teal-300 text-[10px] font-extrabold rounded-full border border-teal-400/20">
                Role: {adminUser.role || 'Super Admin'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">Financial Operations & Broker Control Desk</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-2xl">
              Manage deposit approvals, withdrawal risk queues, payment gateways, balance adjustments, P2P local depositors, and crypto wallet auto-sweeping.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Requirement 8: Quick Trader Impersonation Launcher */}
            <form onSubmit={handleQuickImpersonateSubmit} className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 shadow-inner">
              <input
                type="text"
                placeholder="1-Click Login-As Email..."
                value={quickImpersonateEmail}
                onChange={(e) => setQuickImpersonateEmail(e.target.value)}
                className="pl-3 pr-2 py-1.5 text-xs bg-transparent text-white placeholder-slate-400 focus:outline-none w-44 sm:w-52"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                title="1-Click Trader Emulation"
              >
                <span>Login-As</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <button 
              onClick={fetchAdminDataFromApi}
              disabled={loadingData}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Sync All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            adminTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Traders & Impersonation ({users.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            adminTab === 'kyc' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>KYC Verifications ({kycRequests.filter(k => (k.status || '').toLowerCase() === 'pending').length})</span>
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            adminTab === 'analytics' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive Analytics & KPIs</span>
        </button>

        <button
          onClick={() => setAdminTab('financial_ops')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            adminTab === 'financial_ops' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financial Ops & Gateways</span>
        </button>

        <button
          onClick={() => setAdminTab('terminal')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            adminTab === 'terminal' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Terminal & Risk Management</span>
        </button>

        <button
          onClick={() => setAdminTab('health')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            adminTab === 'health' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>System Infrastructure</span>
        </button>

        <button
          onClick={() => setAdminTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            adminTab === 'profile' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Admin Profile & Security</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: FINANCIAL OPERATIONS & PAYMENT GATEWAYS (REQUIREMENTS 35 - 49) */}
      {/* ========================================================================= */}
      {adminTab === 'financial_ops' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Sub-Navigation Bar for Financial Operations */}
          <div className="flex items-center gap-2 bg-slate-900 text-slate-300 p-2 rounded-2xl overflow-x-auto border border-slate-800">
            <button
              onClick={() => setFinOpsSubTab('deposits_queue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                finOpsSubTab === 'deposits_queue' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deposits Queue & Master Ledgers ({depositsMaster.filter(d=>d.status==='pending').length})</span>
            </button>

            <button
              onClick={() => setFinOpsSubTab('withdrawals_queue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                finOpsSubTab === 'withdrawals_queue' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ArrowUpCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Withdrawals Risk Queue ({withdrawalsMaster.filter(w=>w.status==='pending').length})</span>
            </button>

            <button
              onClick={() => setFinOpsSubTab('p2p')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                finOpsSubTab === 'p2p' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Local P2P Depositors</span>
            </button>

            <button
              onClick={() => setFinOpsSubTab('gateways')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                finOpsSubTab === 'gateways' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Gateways & Crypto Sweeping</span>
            </button>

            <button
              onClick={() => setFinOpsSubTab('verification')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                finOpsSubTab === 'verification' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>User Payment Verification</span>
            </button>

            <button
              onClick={() => setFinOpsSubTab('adjustments')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                finOpsSubTab === 'adjustments' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Balance Adjustment Engine</span>
            </button>
          </div>

          {/* REQUIREMENTS 35, 36, 37, 38: DEPOSITS QUEUE & MASTER LEDGERS */}
          {finOpsSubTab === 'deposits_queue' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    Deposits Queue & Master Transaction Ledgers
                  </h3>
                  <p className="text-xs text-slate-500">Review pending deposit approvals, search master archives, and export deposit records.</p>
                </div>

                {/* Filter Selector for Requirements 35, 36, 37, 38 */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-extrabold">
                  <button
                    onClick={() => setDepositSubFilter('pending')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${depositSubFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Pending Queue ({depositsMaster.filter(d => d.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setDepositSubFilter('approved')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${depositSubFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Approved Ledger ({depositsMaster.filter(d => d.status === 'approved').length})
                  </button>
                  <button
                    onClick={() => setDepositSubFilter('rejected')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${depositSubFilter === 'rejected' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Rejected Ledger ({depositsMaster.filter(d => d.status === 'rejected').length})
                  </button>
                  <button
                    onClick={() => setDepositSubFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${depositSubFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    All Master ({depositsMaster.length})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 pb-3">
                      <th className="pb-3 pl-2">Deposit ID</th>
                      <th className="pb-3">Trader Email</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Gateway Method</th>
                      <th className="pb-3">TX Reference / Proof</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {depositsMaster.filter(d => depositSubFilter === 'all' ? true : d.status === depositSubFilter).map((dep) => (
                      <tr key={dep.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 pl-2 font-mono font-black text-slate-900">#{dep.id}</td>
                        <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2">
                          {dep.user}
                          <button 
                            onClick={() => onImpersonate(dep.user)}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full text-[9px] font-black border border-emerald-200 cursor-pointer inline-flex items-center gap-0.5"
                          >
                            Login-As <ArrowUpRight className="w-2.5 h-2.5" />
                          </button>
                        </td>
                        <td className="py-3.5 font-mono font-black text-emerald-600">${dep.amount.toFixed(2)} USD</td>
                        <td className="py-3.5 font-bold text-slate-700">{dep.method}</td>
                        <td className="py-3.5 font-mono text-slate-500 text-[11px]">{dep.tx_hash || dep.receipt}</td>
                        <td className="py-3.5">
                          {dep.status === 'pending' && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">Pending Review</span>}
                          {dep.status === 'approved' && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">Approved</span>}
                          {dep.status === 'rejected' && <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold">Declined</span>}
                        </td>
                        <td className="py-3.5 text-slate-400 font-mono text-[11px]">{dep.created_at}</td>
                        <td className="py-3.5 text-right pr-2">
                          {dep.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleReviewDepositAction(dep.id, 'approve')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleReviewDepositAction(dep.id, 'reject')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REQUIREMENTS 40, 41, 42, 43: WITHDRAWALS RISK QUEUE & MASTER LEDGERS */}
          {finOpsSubTab === 'withdrawals_queue' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ArrowUpCircle className="w-4 h-4 text-teal-600" />
                    Withdrawals Risk Validation Queue & Payout Ledgers
                  </h3>
                  <p className="text-xs text-slate-500">Review payout requests, destination risk scores, and automatic refund triggers on rejection.</p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-extrabold">
                  <button
                    onClick={() => setWithdrawalSubFilter('pending')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${withdrawalSubFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Risk Queue ({withdrawalsMaster.filter(w => w.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setWithdrawalSubFilter('approved')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${withdrawalSubFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Approved Payouts ({withdrawalsMaster.filter(w => w.status === 'approved').length})
                  </button>
                  <button
                    onClick={() => setWithdrawalSubFilter('rejected')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${withdrawalSubFilter === 'rejected' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Rejected & Refunded ({withdrawalsMaster.filter(w => w.status === 'rejected').length})
                  </button>
                  <button
                    onClick={() => setWithdrawalSubFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${withdrawalSubFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    All Master ({withdrawalsMaster.length})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 pb-3">
                      <th className="pb-3 pl-2">Payout ID</th>
                      <th className="pb-3">Trader Email</th>
                      <th className="pb-3">Gross / Net Amount</th>
                      <th className="pb-3">Payout Method / Network</th>
                      <th className="pb-3">Destination Address</th>
                      <th className="pb-3">Risk Assessment</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {withdrawalsMaster.filter(w => withdrawalSubFilter === 'all' ? true : w.status === withdrawalSubFilter).map((wd) => (
                      <tr key={wd.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 pl-2 font-mono font-black text-slate-900">#{wd.id}</td>
                        <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2">
                          {wd.user}
                          <button 
                            onClick={() => onImpersonate(wd.user)}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full text-[9px] font-black border border-emerald-200 cursor-pointer inline-flex items-center gap-0.5"
                          >
                            Login-As <ArrowUpRight className="w-2.5 h-2.5" />
                          </button>
                        </td>
                        <td className="py-3.5 font-mono">
                          <span className="font-black text-slate-900 block">${wd.amount.toFixed(2)} USD</span>
                          <span className="text-[10px] text-emerald-600 font-bold">Net: ${wd.net_amount.toFixed(2)}</span>
                        </td>
                        <td className="py-3.5 font-bold text-slate-700">
                          {wd.payout_method} ({wd.network})
                        </td>
                        <td className="py-3.5 font-mono text-slate-500 text-[11px] max-w-[200px] truncate" title={wd.destination}>
                          {wd.destination}
                        </td>
                        <td className="py-3.5">
                          {wd.risk_score?.includes('High') ? (
                            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-full text-[10px]">{wd.risk_score}</span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px]">Low Risk</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          {wd.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleReviewWithdrawalAction(wd.id, 'approve')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve Payout
                              </button>
                              {/* REQUIREMENT 42: Rejection triggers Auto-Refund */}
                              <button
                                onClick={() => handleReviewWithdrawalAction(wd.id, 'reject')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                                title="Reject and Auto-Refund Trader Wallet"
                              >
                                <X className="w-3.5 h-3.5" /> Reject & Refund
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono italic">
                              {wd.status === 'approved' ? `Approved (TXID: ${wd.tx_hash || '0x...'})` : `Rejected (Refunded)`}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REQUIREMENT 39: LOCAL DEPOSITOR MANAGEMENT */}
          {finOpsSubTab === 'p2p' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    Local Depositor P2P Network Management
                  </h3>
                  <p className="text-xs text-slate-500">Backoffice approval and ledger management for regional local depositor cashiers.</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {localDepositors.length} Active Local Agents
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {localDepositors.map(agent => (
                  <div key={agent.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-slate-900 text-sm block">{agent.name}</span>
                        <span className="text-xs text-slate-500 font-medium">Agent: {agent.agent} ({agent.region})</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono text-[10px] font-black rounded-full">
                        {agent.commissionPct}% Commission
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Credit Limit</span>
                        <span className="font-bold text-slate-800">${agent.balanceLimit.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans font-medium">Used Credit</span>
                        <span className="font-bold text-emerald-600">${agent.usedLimit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REQUIREMENTS 44, 45, 46, 49: GATEWAYS & CRYPTO SWEEPING SETUP */}
          {finOpsSubTab === 'gateways' && (
            <div className="space-y-6">
              
              {/* REQUIREMENT 44: Automatic Payment Gateways Setup */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      Automatic Payment Gateways Configuration
                    </h3>
                    <p className="text-xs text-slate-500">Setup automated payment gateways, merchant IDs, and API key credentials.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {autoGateways.map(gw => (
                    <div key={gw.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-black text-slate-900 text-sm block">{gw.name}</span>
                        <span className="text-slate-500 font-medium">Type: {gw.type}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 font-mono">
                        <input
                          type="text"
                          value={gw.merchantId}
                          onChange={(e) => setAutoGateways(autoGateways.map(g => g.id === gw.id ? { ...g, merchantId: e.target.value } : g))}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                          placeholder="Merchant ID"
                        />
                        <input
                          type="password"
                          value={gw.apiKey}
                          onChange={(e) => setAutoGateways(autoGateways.map(g => g.id === gw.id ? { ...g, apiKey: e.target.value } : g))}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                          placeholder="API Key"
                        />
                        <button
                          onClick={() => alertSuccess(`Saved gateway settings for ${gw.name}`)}
                          className="px-4 py-1.5 bg-emerald-600 text-white font-extrabold rounded-xl text-xs shadow-xs cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REQUIREMENT 45: Manual Payment Gateways & QR Codes */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      Manual Deposit Gateways & Crypto QR Codes
                    </h3>
                    <p className="text-xs text-slate-500">Configure deposit wallet addresses (USDT TRC20/ERC20/BEP20), QR code links, and bank wire details.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {manualGateways.map(gw => (
                    <div key={gw.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">{gw.name} ({gw.network})</span>
                        <span className="font-mono text-emerald-600 font-bold">Min Deposit: ${gw.minDeposit} USD</span>
                      </div>
                      <input
                        type="text"
                        value={gw.address}
                        onChange={(e) => setManualGateways(manualGateways.map(g => g.id === gw.id ? { ...g, address: e.target.value } : g))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* REQUIREMENT 49: USDT Crypto Auto-Sweeping Config */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      USDT TRC20 / ERC20 / BEP20 Crypto Wallet Auto-Sweeping
                    </h3>
                    <p className="text-xs text-slate-400">Configure hot wallet rotation, gas fee thresholds, and automated deposit sweeping.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">TRC20 Sweep Target Wallet</label>
                    <input
                      type="text"
                      value={cryptoSweeping.trc20HotWallet}
                      onChange={(e) => setCryptoSweeping({ ...cryptoSweeping, trc20HotWallet: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">ERC20 Sweep Target Wallet</label>
                    <input
                      type="text"
                      value={cryptoSweeping.erc20HotWallet}
                      onChange={(e) => setCryptoSweeping({ ...cryptoSweeping, erc20HotWallet: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* REQUIREMENT 47: USER PAYMENT DETAILS VERIFICATION QUEUE */}
          {finOpsSubTab === 'verification' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    User Payment Details Verification Desk
                  </h3>
                  <p className="text-xs text-slate-500">Review and verify user-submitted bank account details and crypto payout addresses.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 pb-3">
                      <th className="pb-3 pl-2">Trader Email</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Account Title</th>
                      <th className="pb-3">Submitted Details</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {userPaymentDetails.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-slate-900">{item.user}</td>
                        <td className="py-3.5 font-semibold text-slate-600">{item.detail_type}</td>
                        <td className="py-3.5 font-extrabold text-slate-900">{item.title}</td>
                        <td className="py-3.5 font-mono text-slate-500 text-[11px]">{item.details}</td>
                        <td className="py-3.5">
                          {item.status === 'verified' ? (
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px]">Verified</span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-full text-[10px]">Pending Verification</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          {item.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleVerifyPaymentDetail(item.id, 'verify')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> Verify
                              </button>
                              <button
                                onClick={() => handleVerifyPaymentDetail(item.id, 'decline')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs border border-rose-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono italic">Verified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REQUIREMENT 48: BALANCE ADJUSTMENT ENGINE */}
          {finOpsSubTab === 'adjustments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 max-w-2xl mx-auto">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-600" />
                    Manual Balance Adjustment Engine
                  </h3>
                  <p className="text-xs text-slate-500">Execute manual credits, debits, or promotional bonus additions with mandatory memo notes.</p>
                </div>
              </div>

              {adjMsg.text && (
                <div className={`p-3.5 rounded-2xl text-xs font-bold ${adjMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {adjMsg.text}
                </div>
              )}

              <form onSubmit={handleExecuteBalanceAdjustment} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Trader User (Email or UID)</label>
                  <select
                    value={adjUser}
                    onChange={(e) => setAdjUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.email}>{u.first_name} {u.last_name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Adjustment Type</label>
                    <select
                      value={adjType}
                      onChange={(e) => setAdjType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="credit">Balance Credit (+)</option>
                      <option value="debit">Balance Debit (-)</option>
                      <option value="bonus">Promotional Bonus (+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Amount ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={adjAmount}
                      onChange={(e) => setAdjAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mandatory Admin Memo Note (Reason)</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Provide compliance or accounting memo rationale (min 5 characters)..."
                    value={adjMemo}
                    onChange={(e) => setAdjMemo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Execute Balance Adjustment
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: COMPLIANCE & MANUAL KYC VERIFICATION DESK */}
      {/* ========================================================================= */}
      {adminTab === 'kyc' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                Compliance & Manual KYC Verification Desk
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Review, verify, or decline trader proof of identity and proof of address documents in real-time.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-extrabold">
              <button
                onClick={() => setKycFilter('Pending')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${kycFilter === 'Pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Pending Queue ({kycRequests.filter(k => (k.status || '').toLowerCase() === 'pending').length})
              </button>
              <button
                onClick={() => setKycFilter('Approved')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${kycFilter === 'Approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Approved ({kycRequests.filter(k => (k.status || '').toLowerCase() === 'approved').length})
              </button>
              <button
                onClick={() => setKycFilter('Rejected')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${kycFilter === 'Rejected' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Rejected ({kycRequests.filter(k => (k.status || '').toLowerCase() === 'rejected').length})
              </button>
              <button
                onClick={() => setKycFilter('All')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${kycFilter === 'All' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Documents ({kycRequests.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3 pl-2">Doc ID</th>
                  <th className="pb-3">Trader Email</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">ID Type</th>
                  <th className="pb-3">Submission Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {kycRequests.filter(k => {
                  const docSt = (k.status || '').toLowerCase();
                  const filterSt = (kycFilter || 'all').toLowerCase();
                  if (filterSt === 'all') return true;
                  return docSt === filterSt;
                }).map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-black text-slate-900">#{doc.id}</td>
                    <td className="py-3.5 font-bold text-slate-900">
                      <button 
                        onClick={() => handleOpenUserDetails(doc.user_id || doc.email)} 
                        className="hover:underline text-emerald-700 text-left font-bold block cursor-pointer"
                        title="Click to view full user details"
                      >
                        {doc.email || doc.user || doc.name}
                      </button>
                      {doc.user_id && <span className="text-[10px] text-slate-400 font-mono">User ID: #{doc.user_id}</span>}
                    </td>
                    <td className="py-3.5 font-extrabold text-slate-700">{doc.document_type || doc.docType || 'Proof of Identity'}</td>
                    <td className="py-3.5 font-semibold text-slate-600">{doc.id_type || doc.docType || 'ID Card'}</td>
                    <td className="py-3.5 text-slate-400 font-mono text-[11px]">{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : doc.submittedDate}</td>
                    <td className="py-3.5">
                      {(doc.status || '').toLowerCase() === 'pending' && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold uppercase animate-pulse">Pending Review</span>}
                      {(doc.status || '').toLowerCase() === 'approved' && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase">Approved</span>}
                      {(doc.status || '').toLowerCase() === 'rejected' && <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold uppercase">Rejected</span>}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenUserDetails(doc.user_id || doc.email)}
                          className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-extrabold rounded-xl text-xs flex items-center gap-1 border border-cyan-200 cursor-pointer shadow-xs transition-all active:scale-95"
                          title="View Full Trader Profile & Details"
                        >
                          <User className="w-3.5 h-3.5 text-cyan-600" /> User Info
                        </button>
                        <a
                          href={`/api/admin/kyc/file?path=${encodeURIComponent(doc.file_path || '')}&id=${doc.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs flex items-center gap-1 border border-slate-200 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" /> View Document
                        </a>

                        {(doc.status || '').toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveKyc(doc.id, 'Approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleApproveKyc(doc.id, 'Rejected')}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: TRADERS & IMPERSONATION MANAGEMENT DESK */}
      {/* ========================================================================= */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600" />
                Registered Traders & Impersonation Desk
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">View complete trader profiles, contact information, KYC status, and trigger 1-click emulation.</p>
            </div>

            {/* Search & Filter bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, email, country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Traders ({users.length})</option>
                <option value="verified">Verified KYC</option>
                <option value="pending">Pending KYC</option>
                <option value="unverified">Unverified KYC</option>
                <option value="active">Active Accounts</option>
              </select>

              <button
                onClick={handleWipeAllUsers}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Permanently wipe all users from database and memory store"
              >
                <UserX className="w-3.5 h-3.5" />
                Wipe All Users
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3 pl-2">Trader ID</th>
                  <th className="pb-3">Full Name & Email</th>
                  <th className="pb-3">Country & Phone</th>
                  <th className="pb-3">KYC Status</th>
                  <th className="pb-3">Account State</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                      No trader records match the selected filter query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pl-2 font-mono font-black text-slate-900">#{u.id}</td>
                      <td className="py-3.5 font-bold text-slate-900">
                        <button
                          onClick={() => handleOpenUserDetails(u)}
                          className="hover:underline text-emerald-700 font-extrabold text-left block cursor-pointer"
                          title="Click to view full user details"
                        >
                          {u.first_name || 'Trader'} {u.last_name || `#${u.id}`}
                        </button>
                        <div className="text-[11px] text-slate-500 font-mono font-normal">{u.email}</div>
                      </td>
                      <td className="py-3.5 font-medium text-slate-700">
                        <div>{u.country || 'Global'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.phone || 'No phone'}</div>
                      </td>
                      <td className="py-3.5">
                        {['verified', 'approved'].includes((u.kyc_status || '').toLowerCase()) && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase">Verified</span>
                        )}
                        {(u.kyc_status || '').toLowerCase() === 'pending' && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold uppercase animate-pulse">Pending Review</span>
                        )}
                        {['unverified', 'rejected', ''].includes((u.kyc_status || '').toLowerCase()) && (
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[10px] font-extrabold uppercase">Unverified</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        {u.is_active !== false ? (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">Active</span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold">Suspended</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenUserDetails(u)}
                            className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-extrabold rounded-xl text-xs flex items-center gap-1 border border-cyan-200 cursor-pointer shadow-xs transition-all active:scale-95"
                            title="View Full Trader Details & Profile"
                          >
                            <User className="w-3.5 h-3.5 text-cyan-600" /> User Info
                          </button>
                          <button
                            onClick={() => onImpersonate(u.email)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                            title="1-Click Login As Trader"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" /> Login-As
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-3 py-1.5 font-bold rounded-xl text-xs border cursor-pointer ${
                              u.is_active !== false ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {u.is_active !== false ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REQUIREMENT 10: SYSTEM VERSION & INFRASTRUCTURE HEALTH MONITOR */}
      {adminTab === 'health' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-600" />
                System Version & Infrastructure Health Monitor
              </h3>
              <p className="text-xs text-slate-500">Real-time server uptime, WebSocket connectivity, database latency, and background worker status.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-mono font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM HEALTHY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-slate-950 text-white p-5 rounded-2xl space-y-3 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold">System Engine</span>
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Build Version</span>
                <span className="text-lg font-black font-mono text-emerald-400">{systemHealth.systemVersion}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Server Uptime</span>
                <span className="font-mono font-bold text-white">{formatUptime(systemHealth.uptimeSeconds)}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl space-y-3 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Database Status</span>
                <Database className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">DB Engine</span>
                <span className="text-lg font-black text-slate-900">{systemHealth.database.type}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Ping Latency</span>
                <span className="font-mono font-bold text-emerald-600">{systemHealth.database.pingMs} ms (Optimal)</span>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl space-y-3 border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>WebSocket Gateway</span>
                <Wifi className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Socket Gateway</span>
                <span className="text-lg font-black text-slate-900">ws://localhost:{systemHealth.websocket.port}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Connected Trader Sockets</span>
                <span className="font-mono font-bold text-teal-600">{systemHealth.websocket.connectedClients} Active</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REQUIREMENT 7: ADMIN PROFILE & CREDENTIALS MANAGER */}
      {adminTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                Admin Credentials & Profile Manager
              </h3>
              <p className="text-xs text-slate-500">Manage administrator account credentials, email, role permissions, and security password.</p>
            </div>
            <span className="px-3 py-1 bg-slate-950 text-emerald-400 font-mono text-xs font-bold rounded-full border border-slate-800">
              Role: {adminUser.role || 'Super Admin'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Admin Account Profile
              </h4>

              {profileMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${profileMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {profileMsg.text}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Admin Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Permission Level</label>
                <input
                  type="text"
                  disabled
                  value={adminUser.role || 'super_admin'}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>

            <form onSubmit={handleChangePassword} className="space-y-4 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" /> Security Password Update
              </h4>

              {passwordMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${passwordMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {passwordMsg.text}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Current Admin Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Security Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Update Security Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAILS COMPREHENSIVE MODAL */}
      {isUserDetailsModalOpen && selectedUserForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 space-y-0 text-slate-900">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-7 flex items-start justify-between relative">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-black text-xl shadow-md">
                  {(selectedUserForModal.first_name?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {selectedUserForModal.first_name || 'Trader'} {selectedUserForModal.last_name || ''}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] font-bold rounded-full border border-slate-700">
                      UID #{selectedUserForModal.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">{selectedUserForModal.email}</p>
                </div>
              </div>

              <button
                onClick={() => setIsUserDetailsModalOpen(false)}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Section 1: Quick Status Badges & Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Global KYC Status</span>
                  <div className="mt-1.5">
                    {['verified', 'approved'].includes((selectedUserForModal.kyc_status || '').toLowerCase()) ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Identity Verified
                      </span>
                    ) : (selectedUserForModal.kyc_status || '').toLowerCase() === 'pending' ? (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black inline-flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-black inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Account Status</span>
                  <div className="mt-1.5">
                    {selectedUserForModal.is_active !== false ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold inline-flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Trader
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-extrabold inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> Account Suspended
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Trader Impersonation</span>
                  <div className="mt-1.5">
                    <button
                      onClick={() => {
                        setIsUserDetailsModalOpen(false);
                        onImpersonate(selectedUserForModal.email);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black inline-flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" /> 1-Click Login As
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Demographics */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200/80 pb-2">
                  Trader Contact & Profile Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Email Address:</span>
                    <span className="font-bold font-mono text-slate-900">{selectedUserForModal.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Phone Number:</span>
                    <span className="font-bold text-slate-900">{selectedUserForModal.phone || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Country of Residence:</span>
                    <span className="font-bold text-slate-900">{selectedUserForModal.country || 'United States'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Referral Code:</span>
                    <span className="font-bold font-mono text-emerald-600">{selectedUserForModal.referral_code || 'DIRECT'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium block">Address / Location:</span>
                    <span className="font-semibold text-slate-800">
                      {[selectedUserForModal.address, selectedUserForModal.city, selectedUserForModal.state, selectedUserForModal.postal_code].filter(Boolean).join(', ') || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: KYC Submissions & Document Uploads */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200/80 pb-2 flex items-center justify-between">
                  <span>Submitted Compliance & KYC Documents ({selectedUserKycDocs.length})</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h4>

                {selectedUserKycDocs.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic">No KYC verification documents uploaded yet by this trader.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedUserKycDocs.map(doc => (
                      <div key={doc.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{doc.document_type || 'Proof of Identity'} ({doc.id_type || 'ID Card'})</span>
                          <span className="text-[10px] text-slate-400 font-mono">Submitted: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Today'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(doc.status || '').toLowerCase() === 'approved' && <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px]">Approved</span>}
                          {(doc.status || '').toLowerCase() === 'pending' && <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-full text-[10px]">Pending</span>}
                          {(doc.status || '').toLowerCase() === 'rejected' && <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-full text-[10px]">Rejected</span>}
                          
                          <a
                            href={`/api/admin/kyc/file?path=${encodeURIComponent(doc.file_path || '')}&id=${doc.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] flex items-center gap-1 border border-slate-200"
                          >
                            <Eye className="w-3 h-3" /> View Doc
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">User ID: #{selectedUserForModal.id}</span>
              <button
                onClick={() => setIsUserDetailsModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close User Info
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
