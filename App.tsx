import React, { useState, useCallback, useEffect } from 'react';
import type { Cluster } from './types';
import { analyzeNotes } from './services/geminiService';
import NoteInput from './components/NoteInput';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorMessage from './components/ErrorMessage';
import LanguageSwitcher from './components/LanguageSwitcher';
import AccountBar from './components/AccountBar';
import { SparklesIcon } from './components/icons';
import { translations } from './translations';
import { trackHumanAction } from './services/analytics';
import { getAuthStatus, type AuthStatus } from './services/auth';

const SIGNED_OUT_CHAR_LIMIT = 3000;

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
  const [auth, setAuth] = useState<AuthStatus | null>(null);

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
    getAuthStatus()
      .then(setAuth)
      .catch((reason) => {
        console.error(reason);
        setAuth({
          authenticated: false,
          limits: {
            dailyAnalyses: 10,
            dailyCharacters: 60000,
            maxCharactersPerAnalysis: 12000,
          },
        });
      });
  }, []);

  const charLimit = auth?.authenticated
    ? auth.quota.limits.maxCharactersPerAnalysis
    : SIGNED_OUT_CHAR_LIMIT;
  const isDayLimitExceeded = Boolean(
    auth?.authenticated &&
      (auth.quota.remaining.analyses <= 0 || auth.quota.remaining.characters <= 0)
  );

  const handleAnalyze = useCallback(async () => {
    if (!auth?.authenticated) {
      setError(t.signInRequired);
      return;
    }
    if (!notesInput.trim()) {
      setError('Please enter some notes to analyze.');
      return;
    }

    trackHumanAction('analyze_notes_submit');

    setIsLoading(true);
    setError(null);
    setClusters(null);

    const notesArray = notesInput.split('\n').filter(note => note.trim() !== '');
    setOriginalNotes(notesArray);

    try {
      const result = await analyzeNotes(notesInput, language);
      setClusters(result.clusters);
      setAuth({ ...auth, quota: result.quota });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [auth, notesInput, language, t.signInRequired]);
  
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
          <AccountBar
            auth={auth}
            copy={t.auth}
            language={language}
            onChange={setAuth}
          />

          {notesInput.length > charLimit && (
            <div className="my-4 rounded-lg border border-amber-700 bg-amber-900/50 px-4 py-3 text-amber-200">
              {t.characterLimit.replace('{limit}', charLimit.toLocaleString())}
            </div>
          )}
          {isDayLimitExceeded && notesInput.length <= charLimit && (
            <div className="my-4 rounded-lg border border-amber-700 bg-amber-900/50 px-4 py-3 text-amber-200">
              {t.dailyLimitReached}
            </div>
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
            charLimit={charLimit}
            disableSubmit={!auth?.authenticated || notesInput.length > charLimit || isDayLimitExceeded}
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
