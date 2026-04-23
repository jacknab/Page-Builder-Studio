import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { eq, and, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { usersTable, passwordResetTokensTable } from "@workspace/db/schema";
import { handleErrors, ok, badRequest } from "@/lib/api";

const schema = z.object({ token: z.string().min(1), password: z.string().min(6) });

export async function POST(req: NextRequest) {
  return handleErrors(async () => {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");

    const now = new Date();
    const [record] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(
        and(
          eq(passwordResetTokensTable.token, parsed.data.token),
          gt(passwordResetTokensTable.expiresAt, now),
          isNull(passwordResetTokensTable.usedAt),
        ),
      )
      .limit(1);
    if (!record) return badRequest("Invalid or expired reset token.");

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await db.update(usersTable).set({ passwordHash, updatedAt: now }).where(eq(usersTable.id, record.userId));
    await db
      .update(passwordResetTokensTable)
      .set({ usedAt: now })
      .where(eq(passwordResetTokensTable.id, record.id));

    return ok({ message: "Password reset successfully." });
  });
}
