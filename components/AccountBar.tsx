import React, { useEffect, useRef, useState } from "react";
import {
  getAuthConfig,
  signInWithGoogle,
  signOut,
  type AuthStatus,
} from "../services/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }): void;
          renderButton(
            parent: HTMLElement,
            options: Record<string, string | number | boolean>
          ): void;
          disableAutoSelect(): void;
        };
      };
    };
  }
}

type Copy = {
  signInPrompt: string;
  signedInAs: string;
  remainingToday: string;
  signOut: string;
  authError: string;
};

type Props = {
  auth: AuthStatus | null;
  copy: Copy;
  language: string;
  onChange: (status: AuthStatus) => void;
};

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Google Sign-In failed to load")), {
      once: true,
    });
    if (!existing) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return googleScriptPromise;
}

const AccountBar: React.FC<Props> = ({ auth, copy, language, onChange }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth?.authenticated !== false || !buttonRef.current) return;
    let cancelled = false;

    Promise.all([loadGoogleScript(), getAuthConfig()])
      .then(([, config]) => {
        if (cancelled || !buttonRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: config.clientId,
          callback: async ({ credential }) => {
            setError("");
            try {
              const result = await signInWithGoogle(credential);
              onChange({ authenticated: true, user: result.user, quota: result.quota });
            } catch (reason) {
              console.error(reason);
              setError(copy.authError);
            }
          },
        });
        buttonRef.current.replaceChildren();
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "filled_black",
          size: "large",
          shape: "pill",
          text: "signin_with",
          locale: language === "Русский" ? "ru" : "en",
        });
      })
      .catch((reason) => {
        console.error(reason);
        if (!cancelled) setError(copy.authError);
      });

    return () => {
      cancelled = true;
    };
  }, [auth?.authenticated, copy.authError, language, onChange]);

  if (auth === null) {
    return <div className="h-11 animate-pulse rounded-xl bg-stone-800" />;
  }

  if (!auth.authenticated) {
    return (
      <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-stone-700 bg-stone-950/70 p-4 sm:flex-row">
        <p className="text-sm text-stone-300">{copy.signInPrompt}</p>
        <div className="flex flex-col items-center gap-2">
          <div ref={buttonRef} />
          {error && <span className="text-xs text-red-300">{error}</span>}
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    setError("");
    try {
      await signOut();
      window.google?.accounts.id.disableAutoSelect();
      onChange({ authenticated: false, limits: auth.quota.limits });
    } catch (reason) {
      console.error(reason);
      setError(copy.authError);
    }
  };

  return (
    <div className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-stone-700 bg-stone-950/70 p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        {auth.user.picture && (
          <img className="h-9 w-9 rounded-full" src={auth.user.picture} alt="" referrerPolicy="no-referrer" />
        )}
        <div>
          <div className="text-sm text-stone-300">
            {copy.signedInAs} <strong className="text-stone-100">{auth.user.email}</strong>
          </div>
          <div className="text-xs text-amber-300">
            {copy.remainingToday}: {auth.quota.remaining.analyses}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm font-medium text-stone-400 hover:text-stone-100"
      >
        {copy.signOut}
      </button>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
};

export default AccountBar;
