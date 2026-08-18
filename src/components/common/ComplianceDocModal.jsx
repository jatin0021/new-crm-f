import React, { useState } from 'react';
import { FileText, Download, X, Check, ShieldCheck, Lock, Cookie, Scale, ExternalLink } from 'lucide-react';

export default function ComplianceDocModal({ 
  isOpen = false, 
  onClose = () => {}, 
  docType = 'risk' // 'risk' | 'cookie' | 'execution' | 'privacy'
}) {
  const [cookieConsent, setCookieConsent] = useState({
    essential: true,
    analytical: true,
    marketing: false
  });

  if (!isOpen) return null;

  const docTitles = {
    risk: { title: 'Risk Disclosure Policy', code: 'REG-RDP-2026', icon: Scale },
    cookie: { title: 'Cookie Policy & Consent Manager', code: 'REG-CKP-2026', icon: Cookie },
    execution: { title: 'Order Execution & Best Execution Policy', code: 'REG-OEP-2026', icon: ShieldCheck },
    privacy: { title: 'Privacy Policy & Anti-Money Laundering (AML) Disclosures', code: 'REG-AML-2026', icon: Lock }
  };

  const currentDoc = docTitles[docType] || docTitles.risk;
  const IconComponent = currentDoc.icon;

  const handleDownloadPdf = () => {
    alert(`Downloading official PDF copy: ${currentDoc.title} (${currentDoc.code}.pdf)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-white max-h-[85vh] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">{currentDoc.title}</h3>
              <p className="text-[11px] font-mono text-emerald-400 font-semibold">Document Reference ID: {currentDoc.code} • Updated August 2026</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Body Reader Content */}
        <div className="flex-1 overflow-y-auto my-4 pr-2 space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
          
          {docType === 'risk' && (
            <>
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-200 text-xs font-semibold flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-amber-400 shrink-0" />
                <span>High Risk Investment Warning: Leveraged financial trading in Foreign Exchange (FX) and Contracts for Difference (CFDs) carries a high degree of risk to your capital.</span>
              </div>

              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">1. Leverage & Margin Risks</h4>
                <p>Trading financial instruments on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange or CFDs, you should carefully consider your investment objectives, level of experience, and risk appetite.</p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">2. Volatility & Liquidity Factors</h4>
                <p>Market prices are influenced by global economic events, interest rate decisions, and geopolitical news. Slippage and execution price gaps may occur during volatile market openings or major high-impact announcements.</p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">3. Platform Technology & Connectivity</h4>
                <p>Vintage CRM and MetaTrader 5 (MT5) bridge systems maintain 99.99% uptime SLAs. However, hardware, internet connectivity disruptions, or client-side latency may delay trade execution or order modifications.</p>
              </section>
            </>
          )}

          {docType === 'cookie' && (
            <>
              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">Cookie Preferences & Privacy Management</h4>
                <p>We use essential cookies for secure session authentication, active session tokens, and compliance logging. You can customize optional analytical and marketing preference tags below.</p>
              </section>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs">Essential Security Cookies</h5>
                    <p className="text-[11px] text-slate-400">Strictly necessary for JWT auth, CSRF protection, and session persistence.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-[10px]">Always Active</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <h5 className="font-bold text-white text-xs">Analytical & Performance Cookies</h5>
                    <p className="text-[11px] text-slate-400">Helps us optimize workstation UI latency and chart rendering speed.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieConsent.analytical}
                    onChange={(e) => setCookieConsent(prev => ({ ...prev, analytical: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <h5 className="font-bold text-white text-xs">Marketing & Referral Tag Cookies</h5>
                    <p className="text-[11px] text-slate-400">Tracks affiliate IB referral parameters for partner commission ledgers.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieConsent.marketing}
                    onChange={(e) => setCookieConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}

          {docType === 'execution' && (
            <>
              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">1. Best Execution Principles</h4>
                <p>Vintage CRM routes orders using Electronic Communication Network (ECN) and Straight-Through Processing (STP) bridges directly to Tier-1 liquidity providers. We take all reasonable steps to obtain the best possible execution result for our clients.</p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">2. Order Types & Execution Speed</h4>
                <p>Market orders are executed at the best available market price. Pending orders (Buy Stop, Sell Stop, Buy Limit, Sell Limit) are executed when the bid/ask price triggers the order threshold with execution latency averaging under 12ms.</p>
              </section>
            </>
          )}

          {docType === 'privacy' && (
            <>
              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">1. Anti-Money Laundering (AML) & Counter-Terrorist Financing (CTF)</h4>
                <p>In accordance with global regulatory standards (FATF guidelines), Vintage CRM enforces strict Know Your Customer (KYC) protocols. We maintain automated transaction monitoring for deposit/withdrawal patterns.</p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-extrabold text-white">2. Data Protection & Encryption Standard</h4>
                <p>All personal identity documents, Government IDs, and proof of address uploads are encrypted at rest using AES-256 encryption and transmitted via TLS 1.3 cryptographic channels.</p>
              </section>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download PDF Copy</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-full shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
