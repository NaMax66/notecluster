import { gatewayPath } from './apiGateway';

const SESSION_STORAGE_KEY = 'notecluster:analytics-session-id';

function getSessionId() {
  const existingSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

export function trackHumanAction(action: string) {
  const endpoint = gatewayPath('/api/analytics');
  const payload = {
    event: 'human_action',
    path: window.location.pathname,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    properties: {
      app: 'notecluster',
      action,
    },
  };
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon(endpoint, blob)) {
      return;
    }
  }

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  }).catch(() => {});
}
