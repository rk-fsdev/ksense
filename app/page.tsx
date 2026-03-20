"use client";

import { useEffect, useState } from "react";
import type { AssessmentSubmissionResponse, DashboardData } from "@/lib/assessment";
import { PaginationControls } from "@/components/PaginationControls";
import { PatientsTable } from "@/components/PatientsTable";
import { RiskPatientsTable } from "@/components/RiskPatientsTable";

type DashboardResponse = DashboardData & {
  error?: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [submission, setSubmission] = useState<AssessmentSubmissionResponse | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [riskPage, setRiskPage] = useState(1);
  const pageSize = 10;
  const riskPageSize = 10;

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard");
      const data = (await response.json()) as DashboardResponse;
      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }
      setDashboard(data);
      setPage(1);
      setRiskPage(1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function submitResult() {
    if (!dashboard?.payload) return;
    setSubmitting(true);
    setError("");
    setSubmission(null);
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(dashboard.payload),
      });
      const data = (await response.json()) as { submission?: AssessmentSubmissionResponse; error?: string };
      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }
      setSubmission(data.submission ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const patients = dashboard?.patients ?? [];
  const riskPatients = dashboard?.riskPatients ?? [];
  const payload = dashboard?.payload;
  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize));
  const start = (page - 1) * pageSize;
  const pagedPatients = patients.slice(start, start + pageSize);
  const riskTotalPages = Math.max(1, Math.ceil(riskPatients.length / riskPageSize));
  const riskStart = (riskPage - 1) * riskPageSize;
  const pagedRiskPatients = riskPatients.slice(riskStart, riskStart + riskPageSize);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Clinical Risk Intelligence</p>
        <h1 className="title">KSENSE Dashboard</h1>
        <p className="subtitle">
          Data loads automatically from backend on page load.
        </p>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">Total Patients</span>
          <strong className="stat-value">{patients.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">High Risk</span>
          <strong className="stat-value">{payload?.high_risk_patients.length ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Fever</span>
          <strong className="stat-value">{payload?.fever_patients.length ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Data Issues</span>
          <strong className="stat-value">{payload?.data_quality_issues.length ?? 0}</strong>
        </article>
      </section>

      <div className="card">
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={loadDashboard} disabled={loading}>
            {loading ? "Loading..." : "Refresh Data"}
          </button>
          <button type="button" className="btn" onClick={submitResult} disabled={submitting || loading || !dashboard}>
            {submitting ? "Submitting..." : "Submit Result"}
          </button>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <section className="section">
        <h2 className="section-title">Patients ({patients.length})</h2>
        <PatientsTable patients={pagedPatients} />
        {patients.length > 0 &&
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrevious={() => setPage((prev) => prev - 1)}
            onNext={() => setPage((prev) => prev + 1)}
          />
        }
      </section>

      <section className="section">
        <h2 className="section-title">Risk Patients ({riskPatients.length})</h2>
        <RiskPatientsTable riskPatients={pagedRiskPatients} />
        {riskPatients.length > 0 &&
          <PaginationControls
            page={riskPage}
            totalPages={riskTotalPages}
            onPrevious={() => setRiskPage((prev) => prev - 1)}
            onNext={() => setRiskPage((prev) => prev + 1)}
          />
        }
      </section>

      {payload ? (
        <section className="section">
          <h2 className="section-title">Computed Risk Lists</h2>
          <pre className="code-block">{JSON.stringify(payload, null, 2)}</pre>
        </section>
      ) : null}

      {submission ? (
        <section className="section">
          <h2 className="section-title">Submission Response</h2>
          <p className="hint">
            Status: <strong>{submission.results.status}</strong> | Score:{" "}
            <strong>{submission.results.score}</strong> | Percentage:{" "}
            <strong>{submission.results.percentage}%</strong>
          </p>
          <pre className="code-block">{JSON.stringify(submission, null, 2)}</pre>
        </section>
      ) : null}
    </main>
  );
}
