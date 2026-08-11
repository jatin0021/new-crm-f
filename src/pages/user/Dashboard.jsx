import React from 'react';
import VerificationBanner from '../../components/dashboard/VerificationBanner';
import AssetsEstimateCard from '../../components/dashboard/AssetsEstimateCard';
import TradingAccountCard from '../../components/dashboard/TradingAccountCard';
import MarketsWidget from '../../components/dashboard/MarketsWidget';

export default function Dashboard({ onNavigate = () => {} }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Banner: Verification Alert */}
      <section>
        <VerificationBanner onVerify={() => onNavigate('KYC')} />
      </section>

      {/* Two Column Cards Grid: Total Assets Estimate + Trading Account setup */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetsEstimateCard 
          balance={0.00} 
          currency="USD" 
          onAction={(action) => {
            if (action === 'deposit' || action === 'withdrawal') onNavigate('Funds');
            else if (action === 'transfer') onNavigate('Accounts');
            else onNavigate('Funds');
          }} 
        />
        
        <TradingAccountCard 
          onSetup={() => onNavigate('Accounts')} 
        />
      </section>

      {/* Markets Widget Section */}
      <section>
        <MarketsWidget 
          onTradeSymbol={(symbol) => onNavigate('Trade')} 
        />
      </section>

    </div>
  );
}
