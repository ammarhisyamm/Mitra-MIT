import { SESSION_DAYS, type Account, type AccountId, type BusinessUnit } from "@/lib/demo";

const KEY = "mitra-session";

export type Session = { accountId: AccountId; unit: BusinessUnit | null; until: number };

/** The 30-day session lives in localStorage so a reload resumes it like the real app. */
export function readSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    return session.until > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function writeSession(accountId: AccountId, unit: BusinessUnit | null) {
  const session: Session = { accountId, unit, until: Date.now() + SESSION_DAYS * 86_400_000 };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Storage can be unavailable (private mode); the prototype still works for this visit.
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

const ACCOUNTS_KEY = "mitra-accounts";

/** Remembers PIN, password and enrolment changes so a resumed session can verify them. */
export function readAccounts(fallback: Account[]): Account[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Account[]) : fallback;
  } catch {
    return fallback;
  }
}

export function writeAccounts(accounts: Account[]) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}
