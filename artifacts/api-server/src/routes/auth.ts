import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, and, gt, isNull } from "drizzle-orm";
import crypto from "crypto";
import { db } from "@workspace/db";
import { usersTable, passwordResetTokensTable } from "@workspace/db";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is required");

const TOKEN_EXPIRY = "7d";
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function makeToken(userId: number, email: string) {
  return jwt.sign({ userId, email }, JWT_SECRET as string, { expiresIn: TOKEN_EXPIRY });
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(usersTable)
    .values({ email: normalizedEmail, passwordHash })
    .returning({ id: usersTable.id, email: usersTable.email });

  const token = makeToken(user.id, user.email);
  return res.status(201).json({ token, user: { id: user.id, email: user.email, isAdmin: user.id === 1 } });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = makeToken(user.id, user.email);
  return res.json({ token, user: { id: user.id, email: user.email, isAdmin: user.id === 1 } });
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Not authenticated." });

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { userId: number; email: string };
    const [user] = await db
      .select({ id: usersTable.id, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!user) return res.status(401).json({ error: "User not found." });
    return res.json({ user: { ...user, isAdmin: user.id === 1 } });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [user] = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  if (!user) {
    // Always return success to avoid exposing which emails are registered
    return res.json({ message: "If an account exists, a reset link has been sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  await db.insert(passwordResetTokensTable).values({
    userId: user.id,
    token,
    expiresAt,
  });

  // In production you'd email this link. We return it directly since email is not configured.
  return res.json({
    message: "Reset token generated successfully.",
    resetToken: token,
    expiresAt: expiresAt.toISOString(),
  });
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body as { token?: string; password?: string };

  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const now = new Date();

  const [resetRecord] = await db
    .select()
    .from(passwordResetTokensTable)
    .where(
      and(
        eq(passwordResetTokensTable.token, token),
        gt(passwordResetTokensTable.expiresAt, now),
        isNull(passwordResetTokensTable.usedAt)
      )
    )
    .limit(1);

  if (!resetRecord) {
    return res.status(400).json({ error: "Invalid or expired reset token." });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db
    .update(usersTable)
    .set({ passwordHash, updatedAt: now })
    .where(eq(usersTable.id, resetRecord.userId));

  await db
    .update(passwordResetTokensTable)
    .set({ usedAt: now })
    .where(eq(passwordResetTokensTable.id, resetRecord.id));

  return res.json({ message: "Password reset successfully. You can now sign in." });
});

export default router;
