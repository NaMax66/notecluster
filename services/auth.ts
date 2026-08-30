import { gatewayPath } from "./apiGateway";

export type NoteclusterLimits = {
  dailyAnalyses: number;
  dailyCharacters: number;
  maxCharactersPerAnalysis: number;
};

export type NoteclusterQuota = {
  used: { analyses: number; characters: number };
  remaining: { analyses: number; characters: number };
  limits: NoteclusterLimits;
};

export type AuthUser = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
};

export type AuthStatus =
  | { authenticated: false; limits: NoteclusterLimits }
  | { authenticated: true; user: AuthUser; quota: NoteclusterQuota };

type AuthConfig = {
  clientId: string;
  limits: NoteclusterLimits;
};

type GoogleAuthResponse = {
  success: true;
  user: AuthUser;
  quota: NoteclusterQuota;
  isNewUser: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { message?: string };
  if (!response.ok) throw new Error(body.message || `HTTP ${response.status}`);
  return body;
}

export async function getAuthConfig(): Promise<AuthConfig> {
  return parseResponse<AuthConfig>(
    await fetch(gatewayPath("/api/ai/auth/config"), { credentials: "include" })
  );
}

export async function getAuthStatus(): Promise<AuthStatus> {
  return parseResponse<AuthStatus>(
    await fetch(gatewayPath("/api/ai/auth/me"), { credentials: "include" })
  );
}

export async function signInWithGoogle(idToken: string): Promise<GoogleAuthResponse> {
  return parseResponse<GoogleAuthResponse>(
    await fetch(gatewayPath("/api/ai/auth/google"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_token: idToken }),
    })
  );
}

export async function signOut(): Promise<void> {
  await parseResponse<{ success: true }>(
    await fetch(gatewayPath("/api/ai/auth/logout"), {
      method: "POST",
      credentials: "include",
    })
  );
}
