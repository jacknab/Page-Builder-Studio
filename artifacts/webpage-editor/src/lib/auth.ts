const USERS_KEY = "launchsite-users";
const SESSION_KEY = "launchsite-session";

export interface User {
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Session {
  email: string;
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36) + password.length.toString(36);
}

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { success: false, error: "Email and password are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const user: User = {
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);
  setSession({ email: normalizedEmail });
  return { success: true };
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return { success: false, error: "Invalid email or password." };
  }

  setSession({ email: normalizedEmail });
  return { success: true };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}
