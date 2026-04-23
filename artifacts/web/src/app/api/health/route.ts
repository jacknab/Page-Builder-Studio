import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok({ ok: true, time: new Date().toISOString() });
}
