import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { usersTable } from "@workspace/db/schema";
import { signSession, setSessionCookie } from "@/lib/session";
import { badRequest, handleErrors, ok } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function POST(req: NextRequest) {
  return handleErrors(async () => {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");

    const email = parsed.data.email.trim().toLowerCase();
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    if (existing.length > 0) return badRequest("An account with this email already exists.");

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({ email, passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email, isAdmin: usersTable.isAdmin });

    const token = signSession({ userId: user.id, email: user.email });
    await setSessionCookie(token);
    return ok({ user });
  });
}
