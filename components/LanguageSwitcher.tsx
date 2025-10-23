import React from 'react';
import { GlobeIcon } from './icons';

interface LanguageSwitcherProps {
  language: string;
  supportedLanguages: string[];
  onChange: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, supportedLanguages, onChange }) => {
  return (
    <div className="relative inline-flex items-center">
        <GlobeIcon className="absolute left-3 w-5 h-5 text-stone-400 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-stone-800 border border-stone-700 text-stone-300 py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
        aria-label="Select language"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;