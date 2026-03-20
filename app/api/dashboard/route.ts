import { NextResponse } from "next/server";
import { buildAssessmentFromPatients, getAllPatients, getApiKeyOrThrow } from "@/lib/assessment";

export async function GET() {
  try {
    const apiKey = getApiKeyOrThrow();
    const patients = await getAllPatients(apiKey);
    const dashboard = buildAssessmentFromPatients(patients);
    return NextResponse.json(dashboard);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
