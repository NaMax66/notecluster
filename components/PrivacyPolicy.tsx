import React from "react";

const PrivacyPolicy: React.FC = () => (
  <div className="min-h-screen bg-stone-950 px-4 py-12 font-sans text-stone-300 antialiased">
    <main className="mx-auto max-w-3xl rounded-2xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/20 md:p-10">
      <a className="text-sm text-amber-400 hover:text-amber-300" href="/">
        ← Back to NoteCluster
      </a>
      <h1 className="mt-6 text-3xl font-bold text-stone-100">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone-500">Effective August 30, 2026</p>

      <div className="mt-8 space-y-6 leading-7">
        <section>
          <h2 className="text-xl font-semibold text-stone-100">What NoteCluster processes</h2>
          <p className="mt-2">
            When you sign in with Google, NoteCluster receives your Google account ID,
            email address, name, and profile picture. Google authentication is used only
            to identify your account and apply daily usage limits.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-100">Your notes</h2>
          <p className="mt-2">
            Notes you submit are sent to the Gemini API to generate the requested
            analysis. NoteCluster does not store the text of your notes in its user or
            quota database.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-100">Usage and security data</h2>
          <p className="mt-2">
            NoteCluster stores daily analysis counts and input character totals. It also
            records limited operational analytics such as a random browser session ID,
            page path, action name, timestamp, app version, and browser user agent. Login
            sessions are kept in a secure HTTP-only cookie for up to 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-stone-100">Sharing and deletion</h2>
          <p className="mt-2">
            Account data is not sold. It is shared only with service providers needed to
            operate authentication, hosting, analytics, and AI analysis. To request
            deletion of your NoteCluster account data, email
            {" "}
            <a className="text-amber-400 hover:text-amber-300" href="mailto:max.naidovich@gmail.com">
              max.naidovich@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  </div>
);

export default PrivacyPolicy;
