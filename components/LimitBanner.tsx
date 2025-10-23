import React from 'react';
import { CreditCardIcon, WarningIcon } from './icons';

interface LimitBannerProps {
  limitBannerText: string;
  upgradeButtonText: string;
}

const LimitBanner: React.FC<LimitBannerProps> = ({ limitBannerText, upgradeButtonText }) => {
  const handleUpgradeClick = () => {
    console.log('Stripe integration point: Upgrade button clicked.');
    // Future Stripe integration would be initiated here.
  };

  return (
    <div className="bg-amber-900/50 border border-amber-700 text-amber-200 px-4 py-3 rounded-lg relative my-4 flex flex-col sm:flex-row items-center justify-between gap-4" role="alert">
      <div className="flex items-center">
        <WarningIcon className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="font-semibold">{limitBannerText}</span>
      </div>
      <button
        onClick={handleUpgradeClick}
        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-stone-950 bg-amber-400 rounded-md hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-900/50 focus:ring-amber-300 disabled:opacity-50 transition-colors flex-shrink-0"
      >
        <CreditCardIcon className="w-5 h-5 mr-2" />
        {upgradeButtonText}
      </button>
    </div>
  );
};

export default LimitBanner;
