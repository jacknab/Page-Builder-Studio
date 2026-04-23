import { clearSessionCookie } from "@/lib/session";
import { handleErrors, ok } from "@/lib/api";

export async function POST() {
  return handleErrors(async () => {
    await clearSessionCookie();
    return ok({ ok: true });
  });
}
