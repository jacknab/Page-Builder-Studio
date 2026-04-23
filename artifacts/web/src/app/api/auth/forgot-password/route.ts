import { NextRequest } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { usersTable, passwordResetTokensTable } from "@workspace/db/schema";
import { handleErrors, ok, badRequest } from "@/lib/api";

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  return handleErrors(async () => {
    const parsed = z.object({ email: z.string().email() }).safeParse(await req.json());
    if (!parsed.success) return badRequest("Email is required.");

    const email = parsed.data.email.trim().toLowerCase();
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) return ok({ message: "If an account exists, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
    await db.insert(passwordResetTokensTable).values({ userId: user.id, token, expiresAt });

    return ok({
      message: "Reset token generated successfully.",
      resetToken: token,
      expiresAt: expiresAt.toISOString(),
    });
  });
}
