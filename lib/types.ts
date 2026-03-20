export type AssessmentPayload = {
  high_risk_patients: string[];
  fever_patients: string[];
  data_quality_issues: string[];
};

export type AssessmentSubmissionResponse = {
  success: boolean;
  message: string;
  results: {
    score: number;
    percentage: number;
    status: string;
    breakdown: {
      high_risk: {
        score: number;
        max: number;
        correct: number;
        submitted: number;
        matches: number;
      };
      fever: {
        score: number;
        max: number;
        correct: number;
        submitted: number;
        matches: number;
      };
      data_quality: {
        score: number;
        max: number;
        correct: number;
        submitted: number;
        matches: number;
      };
    };
    feedback: {
      strengths: string[];
      issues: string[];
    };
    attempt_number: number;
    remaining_attempts: number;
    is_personal_best: boolean;
    can_resubmit: boolean;
  };
};

export type PatientRecord = {
  patient_id?: unknown;
  name?: unknown;
  age?: unknown;
  gender?: unknown;
  blood_pressure?: unknown;
  temperature?: unknown;
  visit_date?: unknown;
  diagnosis?: unknown;
  medications?: unknown;
};

export type PatientsResponse = {
  data?: PatientRecord[] | unknown;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
  metadata?: {
    timestamp?: string;
    version?: string;
    requestId?: string;
  };
};

export type PatientRisk = {
  patient_id: string;
  bpScore: number;
  tempScore: number;
  ageScore: number;
  totalScore: number;
  hasDataQualityIssue: boolean;
};

export type DashboardData = {
  patients: PatientRecord[];
  payload: AssessmentPayload;
  riskPatients: PatientRisk[];
};
