import React from 'react';
import { AnalyzeIcon } from './icons';

interface NoteInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onLoadExample: () => void;
  isLoading: boolean;
  labelText: string;
  placeholder: string;
  loadExampleText: string;
  analyzeButtonText: string;
  analyzingButtonText: string;
  charCount: number;
  charLimit: number;
  disableSubmit?: boolean;
}

const NoteInput: React.FC<NoteInputProps> = ({ 
    value, 
    onChange, 
    onSubmit, 
    onLoadExample, 
    isLoading,
    labelText,
    placeholder,
    loadExampleText,
    analyzeButtonText,
    analyzingButtonText,
    charCount,
    charLimit,
    disableSubmit,
}) => {
  return (
    <div className="mb-8">
      <label htmlFor="notes" className="block text-sm font-medium text-stone-400 mb-2">
        {labelText}
      </label>
      <textarea
        id="notes"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-48 p-4 bg-stone-950 border border-stone-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow duration-200 text-stone-200 placeholder-stone-600"
        disabled={isLoading}
      />
      <div className={`text-right text-sm pr-1 mt-1 ${charCount > charLimit ? 'text-orange-400 font-semibold' : 'text-stone-500'}`}>
        <span>{charCount}</span> / {charLimit}
      </div>
       <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <button
          onClick={onLoadExample}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-amber-300 bg-amber-900/50 rounded-md hover:bg-amber-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadExampleText}
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading || disableSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-amber-600 rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-950 focus:ring-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          {isLoading ? (
            analyzingButtonText
          ) : (
            <>
              <AnalyzeIcon className="w-5 h-5 mr-2" />
              {analyzeButtonText}
            </>
          )}
        </button>
       </div>
    </div>
  );
};

export default NoteInput;