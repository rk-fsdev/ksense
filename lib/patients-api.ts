import { fetchFromAssessmentApi } from "@/lib/http";
import type {
  AssessmentPayload,
  AssessmentSubmissionResponse,
  PatientRecord,
  PatientsResponse,
} from "@/lib/types";

export async function submitAssessment(
  apiKey: string,
  payload: AssessmentPayload,
): Promise<AssessmentSubmissionResponse> {
  return fetchFromAssessmentApi<AssessmentSubmissionResponse>("/submit-assessment", "POST", apiKey, payload);
}

export async function getPatientsPage(apiKey: string, page = 1, limit = 5): Promise<PatientsResponse> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(20, Math.floor(limit)) : 5;
  return fetchFromAssessmentApi<PatientsResponse>(`/patients?page=${safePage}&limit=${safeLimit}`, "GET", apiKey);
}

export async function getAllPatients(apiKey: string): Promise<PatientRecord[]> {
  const all: PatientRecord[] = [];
  let page = 1;
  const limit = 20;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await getPatientsPage(apiKey, page, limit);
    const patients = Array.isArray(response.data) ? response.data : [];
    all.push(...patients);

    const nextTotalPages =
      typeof response.pagination?.totalPages === "number" && response.pagination.totalPages > 0
        ? response.pagination.totalPages
        : totalPages;
    totalPages = nextTotalPages;

    if (response.pagination?.hasNext === false) {
      break;
    }
    page += 1;
  }

  return all;
}
