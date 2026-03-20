import { NextResponse } from "next/server";
import { getApiKeyOrThrow, getPatientsPage } from "@/lib/assessment";

function readPositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

export async function GET(request: Request) {
  try {
    const apiKey = getApiKeyOrThrow();
    const { searchParams } = new URL(request.url);
    const page = readPositiveInt(searchParams.get("page"), 1);
    const limit = readPositiveInt(searchParams.get("limit"), 5);

    const patients = await getPatientsPage(apiKey, page, limit);
    return NextResponse.json(patients);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
