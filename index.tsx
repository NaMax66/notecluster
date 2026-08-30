
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PrivacyPolicy from './components/PrivacyPolicy';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const isPrivacyPage = window.location.pathname === '/privacy';
const Page = isPrivacyPage ? PrivacyPolicy : App;
const canonicalUrl = isPrivacyPage
  ? 'https://notecluster.selfkit.org/privacy'
  : 'https://notecluster.selfkit.org/';

document.title = isPrivacyPage
  ? 'Privacy Policy | NoteCluster'
  : 'NoteCluster — AI Note Organizer & Thought Clustering';

const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
canonicalLink?.setAttribute('href', canonicalUrl);

if (isPrivacyPage) {
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute(
      'content',
      'Learn how NoteCluster handles Google account data, submitted notes, usage information, and account deletion requests.'
    );
}

root.render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
