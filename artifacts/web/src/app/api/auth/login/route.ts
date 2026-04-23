import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { usersTable } from "@workspace/db/schema";
import { signSession, setSessionCookie } from "@/lib/session";
import { badRequest, handleErrors, ok, unauthorized } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  return handleErrors(async () => {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Email and password are required.");

    const email = parsed.data.email.trim().toLowerCase();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return unauthorized("Invalid email or password.");
    }

    const token = signSession({ userId: user.id, email: user.email });
    await setSessionCookie(token);
    return ok({ user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
  });
}
