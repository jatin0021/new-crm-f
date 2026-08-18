import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import { 
  Headset, 
  Ticket, 
  HelpCircle, 
  MessageSquare, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Paperclip, 
  Send, 
  ChevronRight, 
  FileText, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function SupportHelpdeskPage() {
  const { alertError } = useAlert();
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'new_ticket' | 'faq'

  // Tickets List State
  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticket_number: 'TKT-90182',
      subject: 'USDT TRC20 Deposit Delay Verification',
      category: 'deposits',
      priority: 'High',
      status: 'in_progress',
      created_at: '2026-08-16 14:20',
      messages: [
        { id: 1, sender: 'trader', sender_name: 'John Doe', message: 'I submitted a deposit of $500 USDT TRC20 20 minutes ago. TXID: 0x8f3c91a0b9821039a82.', created_at: '2026-08-16 14:20' },
        { id: 2, sender: 'agent', sender_name: 'Sarah (Support Lead)', message: 'Hello John! We are verifying the 3 blockchain confirmations on TRC20. Your wallet will credit automatically in ~5 mins.', created_at: '2026-08-16 14:25' }
      ]
    },
    {
      id: 2,
      ticket_number: 'TKT-72519',
      subject: 'MT5 Account Leverage Increase to 1:500',
      category: 'trading',
      priority: 'Medium',
      status: 'resolved',
      created_at: '2026-08-14 09:15',
      messages: [
        { id: 1, sender: 'trader', sender_name: 'John Doe', message: 'Please update my Live ECN account #501928 leverage from 1:100 to 1:500.', created_at: '2026-08-14 09:15' },
        { id: 2, sender: 'agent', sender_name: 'Alex (Desk Officer)', message: 'Leverage updated to 1:500 successfully. Happy trading!', created_at: '2026-08-14 09:30' }
      ]
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [replyInput, setReplyInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // New Ticket State
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('deposits');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newMessage, setNewMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState('');

  // FAQ State
  const [faqs, setFaqs] = useState([
    { id: 1, category: 'Deposits & Funding', title: 'How long do USDT TRC20 deposits take to credit?', content: 'USDT TRC20 deposits credit automatically after 3 blockchain network confirmations (typically 2-5 minutes).' },
    { id: 2, category: 'Trading Accounts', title: 'How do I change my MT5 Master or Investor password?', content: 'Navigate to Trading Accounts -> Change Password tab to set a new Master or Investor password instantly.' },
    { id: 3, category: 'Withdrawals', title: 'What are the minimum and maximum withdrawal limits?', content: 'The minimum withdrawal limit is $50.00 USD and maximum limit is $50,000.00 USD per single payout request.' },
    { id: 4, category: 'KYC & Verification', title: 'Which documents are accepted for identity verification?', content: 'We accept government-issued Passport, National ID card, or Driver License via automated Sumsub WebSDK.' }
  ]);
  const [faqSearch, setFaqSearch] = useState('');

  // Fetch Tickets & FAQs
  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
        const res = await fetch(getApiUrl('/api/support/tickets'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.tickets && data.data.tickets.length > 0) {
            setTickets(data.data.tickets);
            setSelectedTicket(data.data.tickets[0]);
          }
        }

        const faqRes = await fetch(getApiUrl('/api/support/faqs'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (faqRes.ok) {
          const faqData = await faqRes.json();
          if (faqData.data?.faqs) setFaqs(faqData.data.faqs);
        }
      } catch (e) {
        console.warn('Support fetch warning:', e.message);
      }
    };
    fetchSupportData();
  }, []);

  // Submit New Support Ticket Handler
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmittingTicket(true);
    setTicketSuccessMsg('');

    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch(getApiUrl('/api/support/tickets'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newSubject,
          category: newCategory,
          priority: newPriority,
          message: newMessage
        })
      });

      const data = await res.json();
      if (res.ok && data.data?.ticket) {
        setTickets(prev => [data.data.ticket, ...prev]);
        setSelectedTicket(data.data.ticket);
        setTicketSuccessMsg(data.message || 'Support ticket created successfully!');
        setNewSubject('');
        setNewMessage('');
        setTimeout(() => {
          setActiveTab('tickets');
          setTicketSuccessMsg('');
        }, 1500);
      } else {
        alertError(data.message || 'Failed to submit ticket');
      }
    } catch (err) {
      alertError('Server connection error');
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Post Threaded Reply Handler
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedTicket) return;

    const newReply = {
      id: Date.now(),
      sender: 'trader',
      sender_name: 'You (Trader)',
      message: replyInput,
      created_at: 'Just now'
    };

    const updatedMessages = [...(selectedTicket.messages || []), newReply];
    const updatedTicket = { ...selectedTicket, messages: updatedMessages };

    setSelectedTicket(updatedTicket);
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setReplyInput('');
  };

  const filteredTickets = tickets.filter(t => statusFilter === 'all' ? true : t.status === statusFilter);
  const filteredFaqs = faqs.filter(f => f.title.toLowerCase().includes(faqSearch.toLowerCase()) || f.content.toLowerCase().includes(faqSearch.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Headset className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Support & Helpdesk Portal</h1>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                Online • 24/7 Agent Available
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Submit formal support tickets, track ticket status, or search the trading knowledge base.</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('new_ticket')}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-full transition-all shadow-md shadow-emerald-600/25 active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Support Ticket</span>
        </button>
      </div>

      {/* Sub-Navigation Workspace Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tickets' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>My Support Tickets</span>
        </button>

        <button
          onClick={() => setActiveTab('new_ticket')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'new_ticket' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ticket</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'faq' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ & Knowledge Base</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUPPORT TICKETS LEDGER & THREADED REPLY VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Ticket List Drawer */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Support Tickets History</h3>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-800 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredTickets.map(t => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200/80 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-800">{t.ticket_number}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{t.subject}</h4>
                    <span className="text-[10px] text-slate-400 block">{t.created_at}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Threaded Message History */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow flex flex-col justify-between h-[580px]">
            {selectedTicket ? (
              <>
                {/* Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-emerald-700">{selectedTicket.ticket_number}</span>
                    <span className="text-xs font-bold text-slate-400">Category: <strong className="text-slate-800 uppercase">{selectedTicket.category}</strong></span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedTicket.subject}</h3>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                  {selectedTicket.messages?.map(m => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                        m.sender === 'trader' ? 'bg-slate-100 text-slate-900 border border-slate-200 ml-6' : 'bg-emerald-50 border border-emerald-200 text-emerald-950 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={m.sender === 'trader' ? 'text-slate-700' : 'text-emerald-800'}>{m.sender_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.created_at}</span>
                      </div>
                      <p className="leading-relaxed font-medium">{m.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-md shadow-emerald-600/25"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="m-auto text-center space-y-2">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400">Select a support ticket to view message thread</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CREATE NEW SUPPORT TICKET */}
      {/* ========================================================================= */}
      {activeTab === 'new_ticket' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">Submit New Support Ticket</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Please provide detailed information so our client support team can assist promptly.</p>
          </div>

          {ticketSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{ticketSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Ticket Subject *</label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Deposit Status Delay Verification"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <option value="deposits">Deposits & Withdrawals</option>
                  <option value="trading">MT5 Trading Accounts</option>
                  <option value="kyc">KYC & Compliance</option>
                  <option value="technical">Technical Portal Support</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 cursor-pointer"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Detailed Description *</label>
              <textarea
                rows={5}
                required
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Describe your issue or request in detail..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingTicket}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-full transition-all shadow-lg shadow-emerald-600/25 active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submittingTicket ? 'Submitting Ticket...' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FAQ & KNOWLEDGE BASE */}
      {/* ========================================================================= */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                Trading Knowledge Base & FAQ
              </h3>
              <p className="text-xs text-slate-500 font-medium">Search through help articles, deposit guides, and platform tutorials.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQ articles..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map(f => (
              <div key={f.id} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  {f.category}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">{f.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{f.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
