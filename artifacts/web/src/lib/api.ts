import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

export function badRequest(error: string, details?: unknown): NextResponse {
  return NextResponse.json({ error, details }, { status: 400 });
}

export function unauthorized(error = "Not authenticated."): NextResponse {
  return NextResponse.json({ error }, { status: 401 });
}

export function forbidden(error = "Forbidden."): NextResponse {
  return NextResponse.json({ error }, { status: 403 });
}

export function notFound(error = "Not found."): NextResponse {
  return NextResponse.json({ error }, { status: 404 });
}

export function serverError(error = "Internal server error."): NextResponse {
  return NextResponse.json({ error }, { status: 500 });
}

export async function handleErrors(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ZodError) {
      return badRequest("Validation failed", e.flatten());
    }
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHORIZED") return unauthorized();
    if (msg === "FORBIDDEN") return forbidden();
    console.error("API error:", e);
    return serverError();
  }
}
