const TOKEN_KEY = "launchsite-token";
const USER_KEY = "launchsite-user";

export interface AuthUser {
  id: number;
  email: string;
  isAdmin?: boolean;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function setUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

export function isAdmin(): boolean {
  return getUser()?.isAdmin === true;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function signup(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error ?? "Signup failed." };
    setToken(data.token);
    setUser(data.user);
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error ?? "Login failed." };
    setToken(data.token);
    setUser(data.user);
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function forgotPassword(
  email: string
): Promise<{ success: boolean; error?: string; resetToken?: string; expiresAt?: string }> {
  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error ?? "Request failed." };
    return { success: true, resetToken: data.resetToken, expiresAt: data.expiresAt };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error ?? "Reset failed." };
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/me", {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    setUser(data.user);
    return data.user;
  } catch {
    return null;
  }
}
