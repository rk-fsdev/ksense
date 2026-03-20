import { NextResponse } from "next/server";
import {
  AssessmentPayload,
  AssessmentSubmissionResponse,
  getApiKeyOrThrow,
  submitAssessment,
} from "@/lib/assessment";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export async function POST(request: Request) {
  try {
    const apiKey = getApiKeyOrThrow();

    const body = (await request.json()) as AssessmentPayload;
    if (
      !isStringArray(body?.high_risk_patients) ||
      !isStringArray(body?.fever_patients) ||
      !isStringArray(body?.data_quality_issues)
    ) {
      return NextResponse.json(
        { error: "Invalid payload. Expected high_risk_patients, fever_patients, data_quality_issues arrays." },
        { status: 400 },
      );
    }

    const payload: AssessmentPayload = {
      high_risk_patients: body.high_risk_patients,
      fever_patients: body.fever_patients,
      data_quality_issues: body.data_quality_issues,
    };

    const submission: AssessmentSubmissionResponse = await submitAssessment(apiKey, payload);

    return NextResponse.json({ payload, submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
