import type { AssessmentPayload, DashboardData, PatientRecord, PatientRisk } from "@/lib/types";

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseBloodPressure(value: unknown): { systolic: number; diastolic: number } | null {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (!match) {
    return null;
  }

  const systolic = Number(match[1]);
  const diastolic = Number(match[2]);
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
    return null;
  }

  return { systolic, diastolic };
}

function bpRiskFromSystolic(systolic: number): number {
  if (systolic >= 140) return 3;
  if (systolic >= 130) return 2;
  if (systolic >= 120) return 1;
  return 0;
}

function bpRiskFromDiastolic(diastolic: number): number {
  if (diastolic >= 90) return 3;
  if (diastolic >= 80) return 2;
  return 0;
}

function temperatureRisk(temperature: number): number {
  if (temperature >= 101.0) return 2;
  if (temperature >= 99.6) return 1;
  return 0;
}

function ageRisk(age: number): number {
  if (age > 65) return 2;
  if (age >= 40) return 1;
  return 0;
}

function patientId(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function evaluatePatientRisk(patient: PatientRecord): PatientRisk | null {
  const id = patientId(patient.patient_id);
  if (!id) {
    return null;
  }

  const age = parseNumber(patient.age);
  const temp = parseNumber(patient.temperature);
  const bp = parseBloodPressure(patient.blood_pressure);
  const bpScore = bp ? Math.max(bpRiskFromSystolic(bp.systolic), bpRiskFromDiastolic(bp.diastolic)) : 0;
  const tempScore = temp !== null ? temperatureRisk(temp) : 0;
  const ageScore = age !== null ? ageRisk(age) : 0;

  return {
    patient_id: id,
    bpScore,
    tempScore,
    ageScore,
    totalScore: bpScore + tempScore + ageScore,
    hasDataQualityIssue: age === null || temp === null || bp === null,
  };
}

function buildPayload(patients: PatientRecord[], risks: PatientRisk[]): AssessmentPayload {
  const highRisk = new Set<string>();
  const fever = new Set<string>();
  const quality = new Set<string>();

  for (const [index, risk] of risks.entries()) {
    if (risk.totalScore >= 4) {
      highRisk.add(risk.patient_id);
    }

    const temp = parseNumber(patients[index].temperature);
    if (temp !== null && temp >= 99.6) {
      fever.add(risk.patient_id);
    }

    if (risk.hasDataQualityIssue) {
      quality.add(risk.patient_id);
    }
  }

  return {
    high_risk_patients: [...highRisk],
    fever_patients: [...fever],
    data_quality_issues: [...quality],
  };
}

export function buildAssessmentFromPatients(patients: PatientRecord[]): DashboardData {
  const paired = patients
    .map((patient) => ({ patient, risk: evaluatePatientRisk(patient) }))
    .filter((item): item is { patient: PatientRecord; risk: PatientRisk } => item.risk !== null);

  const payload = buildPayload(
    paired.map((item) => item.patient),
    paired.map((item) => item.risk),
  );

  return {
    patients,
    payload,
    riskPatients: paired.map((item) => item.risk).filter((risk) => risk.totalScore >= 4),
  };
}
