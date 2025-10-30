import React, { useState, useCallback, useEffect } from 'react';
import type { Cluster } from './types';
import { analyzeNotes } from './services/geminiService';
import NoteInput from './components/NoteInput';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorMessage from './components/ErrorMessage';
import LanguageSwitcher from './components/LanguageSwitcher';
import LimitBanner from './components/LimitBanner';
import { SparklesIcon } from './components/icons';
import { translations } from './translations';

const CHAR_LIMIT = 3000;

// --- Daily limit helper ---
const getTodayKey = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `notecluster_analyze_${y}-${m}-${d}`;
};

const DAY_LIMIT = 6;

const App: React.FC = () => {
  const [notesInput, setNotesInput] = useState<string>('');
  const [clusters, setClusters] = useState<Cluster[] | null>(null);
  const [originalNotes, setOriginalNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>(() => {
    try {
      const savedLanguage = localStorage.getItem('notecluster_language');
      return savedLanguage || 'English';
    } catch {
      return 'English';
    }
  });
  const [isDayLimitExceeded, setIsDayLimitExceeded] = useState(false);

  const t = translations[language as keyof typeof translations] || translations.English;
  const supportedLanguages = Object.keys(translations);

  useEffect(() => {
    try {
      localStorage.setItem('notecluster_language', language);
    } catch {
      // ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    const key = getTodayKey();
    const count = Number(localStorage.getItem(key) || 0);
    setIsDayLimitExceeded(count >= DAY_LIMIT);
  }, [notesInput, language]);

  const handleAnalyze = useCallback(async () => {

    // Check daily analysis limit
    const todayKey = getTodayKey();
    const count = Number(localStorage.getItem(todayKey) || 0);
    if (count >= DAY_LIMIT) {
      setIsDayLimitExceeded(true);
      setError('Daily analysis limit of 10 reached, please try again tomorrow.');
      return;
    }
    if (!notesInput.trim()) {
      setError('Please enter some notes to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setClusters(null);

    const notesArray = notesInput.split('\n').filter(note => note.trim() !== '');
    setOriginalNotes(notesArray);

    try {
      const result = await analyzeNotes(notesInput, language);
      setClusters(result);
      // Increment usage count
      localStorage.setItem(todayKey, String(count + 1));
      if (count + 1 >= DAY_LIMIT) {
        setIsDayLimitExceeded(true);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [notesInput, language]);
  
  const exampleNotes = `Feeling overwhelmed with the project deadline.
Need to call mom back, feeling a bit guilty.
The sunset was beautiful yesterday, felt so peaceful.
Worried about the presentation tomorrow.
Remembered a happy childhood memory today.
That difficult conversation with my boss is still bothering me.
So excited about the upcoming vacation!
Just finished a great book, feeling inspired.
Anxious about the pile of laundry I need to do.`;

  const handleLoadExample = () => {
      setNotesInput(exampleNotes);
  };


  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-300 antialiased">
      <main className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
        <header className="text-center mb-12">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher 
                    language={language}
                    supportedLanguages={supportedLanguages}
                    onChange={setLanguage}
                />
            </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <SparklesIcon className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
              {t.appTitle}
            </h1>
          </div>
          <p className="text-stone-400 max-w-2xl mx-auto">
            {t.appDescription}
          </p>
        </header>

        <div className="bg-stone-900/70 rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-stone-800 p-6 md:p-8">
          {notesInput.length > CHAR_LIMIT && (
            <LimitBanner 
                limitBannerText={t.limitBannerText}
                upgradeButtonText={t.upgradeButtonText}
                disableUpgrade={true}
                disableText="Please reduce the number of characters to proceed."
            />
           )}
          {isDayLimitExceeded && notesInput.length <= CHAR_LIMIT && (
            <LimitBanner
              limitBannerText={`Daily analysis limit of ${DAY_LIMIT} reached, please try again tomorrow... or leave your email and I will lift the quota for you`}
              upgradeButtonText={t.upgradeButtonText}
            />
          )}

          <NoteInput
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            onSubmit={handleAnalyze}
            onLoadExample={handleLoadExample}
            isLoading={isLoading}
            labelText={t.notesLabel}
            placeholder={t.notesPlaceholder}
            loadExampleText={t.loadExampleButton}
            analyzeButtonText={t.analyzeButton}
            analyzingButtonText={t.analyzingButton}
            charCount={notesInput.length}
            charLimit={CHAR_LIMIT}
            disableSubmit={notesInput.length > CHAR_LIMIT || isDayLimitExceeded}
          />

          {error && <ErrorMessage message={error} errorPrefixText={t.errorPrefix} />}

          <ResultsDisplay
            clusters={clusters}
            originalNotes={originalNotes}
            isLoading={isLoading}
            loaderText={t.loaderText}
            resultsTitle={t.resultsTitle}
            noClustersText={t.noClustersText}
            notesInClusterTitle={t.notesInClusterTitle}
            exportToDocsText={t.exportToDocsButton}
            exportToSheetsText={t.exportToSheetsButton}
          />
        </div>

        <footer className="text-center mt-12 text-stone-500 text-sm">
          <p>{t.footerText}</p>
        </footer>
      </main>
    </div>
  );
};

export default App;