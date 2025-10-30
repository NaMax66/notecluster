import React from 'react';
import { MailIcon, WarningIcon } from './icons';

interface LimitBannerProps {
  limitBannerText: string;
  upgradeButtonText: string;
  disableUpgrade?: boolean;
  disableText?: string;
}

const LimitBanner: React.FC<LimitBannerProps> = ({ limitBannerText, upgradeButtonText, disableUpgrade = false, disableText }) => {
  const handleUpgradeClick = async () => {
    try {
      const email = window.prompt('Enter your email (we\'ll contact you when the quota increases):');
      if (!email) return;

      const emailTrimmed = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        window.alert('Please enter a valid email.');
        return;
      }

      const endpoint = import.meta.env.VITE_CLOUDFLARE_EMAIL_ENDPOINT as string | undefined;
      if (!endpoint) {
        console.warn('VITE_CLOUDFLARE_EMAIL_ENDPOINT is not configured');
        window.alert('Service temporarily unavailable. Please try again later.');
        return;
      }
      if (!endpoint) {
        console.warn('VITE_CLOUDFLARE_EMAIL_ENDPOINT is not configured');
        window.alert('Service temporarily unavailable. Please try again later.');
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailTrimmed, service_name: 'notecluster' }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      window.alert('Thank you! We will notify you when we increase the quota.');
    } catch (err) {
      console.error('Failed to send email to Cloudflare:', err);
      window.alert('Failed to send email. Please try again later.');
    }
  };

  return (
    <div className="bg-amber-900/50 border border-amber-700 text-amber-200 px-4 py-3 rounded-lg relative my-4 flex flex-col sm:flex-row items-center justify-between gap-4" role="alert">
      <div className="flex items-center">
        <WarningIcon className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="font-semibold">{limitBannerText}</span>
      </div>
      <div className="flex flex-col items-center gap-1 sm:items-end">
        <button
          onClick={handleUpgradeClick}
          disabled={disableUpgrade}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-stone-950 bg-amber-400 rounded-md hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-900/50 focus:ring-amber-300 disabled:opacity-50 transition-colors flex-shrink-0 mb-0"
        >
          <MailIcon className="w-5 h-5 mr-2" />
          {upgradeButtonText}
        </button>
        {disableUpgrade && disableText && (
            <span className="text-xs text-orange-200 mt-1">{disableText}</span>
        )}
      </div>
    </div>
  );
};

export default LimitBanner;
