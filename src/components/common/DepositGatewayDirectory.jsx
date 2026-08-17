import React from 'react';
import { QrCode, CreditCard, Landmark, Zap, ShieldCheck, ArrowRight, Smartphone, Coins } from 'lucide-react';

export default function DepositGatewayDirectory({
  selectedGateway = 'usdt_trc20',
  onSelectGateway = () => {}
}) {
  const categories = [
    {
      title: 'Cryptocurrency Gateways',
      items: [
        { id: 'usdt_trc20', name: 'USDT (TRC-20)', badge: 'Low Fee', speed: 'Instant (1-3 Confs)', limit: '$10 - $100,000', icon: QrCode, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        { id: 'usdt_erc20', name: 'USDT (ERC-20)', badge: 'Ethereum', speed: '5-10 Mins', limit: '$50 - $250,000', icon: QrCode, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
        { id: 'usdt_bep20', name: 'USDT (BEP-20)', badge: 'BSC Network', speed: 'Instant', limit: '$10 - $100,000', icon: QrCode, color: 'text-amber-600 bg-amber-50 border-amber-200' },
        { id: 'btc_onchain', name: 'Bitcoin (BTC)', badge: 'On-Chain', speed: '2-3 Confirmations', limit: '$100 - $500,000', icon: Coins, color: 'text-orange-600 bg-orange-50 border-orange-200' },
        { id: 'eth_native', name: 'Ethereum (ETH)', badge: 'Native ETH', speed: '12 Confirmations', limit: '$50 - $250,000', icon: Coins, color: 'text-blue-600 bg-blue-50 border-blue-200' },
        { id: 'cregis_crypto', name: 'Cregis Merchant (Auto)', badge: 'Automated Multi-Token', speed: 'Real-Time Polling', limit: '$20 - $500,000', icon: Zap, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
        { id: 'manual_crypto', name: 'Other / Manual Crypto', badge: 'Manual TXID', speed: '15-30 Mins', limit: '$10 - $50,000', icon: QrCode, color: 'text-purple-600 bg-purple-50 border-purple-200' }
      ]
    },
    {
      title: 'Fiat On-Ramp & Mobile Checkout',
      items: [
        { id: 'card_visa_mastercard', name: 'Credit / Debit Card', badge: 'Visa / Mastercard', speed: 'Instant Fiat', limit: '$20 - $10,000', icon: CreditCard, color: 'text-slate-900 bg-slate-100 border-slate-300' },
        { id: 'apple_pay', name: 'Apple Pay Direct', badge: '1-Tap Mobile', speed: 'Instant', limit: '$20 - $5,000', icon: Smartphone, color: 'text-slate-900 bg-slate-100 border-slate-300' },
        { id: 'google_pay', name: 'Google Pay Direct', badge: 'Browser & Mobile', speed: 'Instant', limit: '$20 - $5,000', icon: Smartphone, color: 'text-teal-700 bg-teal-50 border-teal-200' }
      ]
    },
    {
      title: 'Bank Transfer & Wire',
      items: [
        { id: 'bank_wire', name: 'International Bank Wire', badge: 'SWIFT / IBAN', speed: '1-2 Business Days', limit: '$500 - $1,000,000', icon: Landmark, color: 'text-teal-800 bg-teal-50 border-teal-300' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {categories.map((cat, idx) => (
        <div key={idx} className="space-y-3">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider text-left">{cat.title}</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {cat.items.map(item => {
              const isSelected = selectedGateway === item.id;
              const IconComp = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectGateway(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 text-left ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-md scale-[1.01]' 
                      : 'border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0 ${item.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-xs">{item.name}</h5>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.speed}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                    <span>Limits: <strong>{item.limit}</strong></span>
                    <span className="text-emerald-600 font-bold">0% Fee</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
