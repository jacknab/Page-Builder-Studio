import { getCurrentUser } from "@/lib/session";
import { handleErrors, ok } from "@/lib/api";

export async function GET() {
  return handleErrors(async () => {
    const user = await getCurrentUser();
    return ok({ user });
  });
}
