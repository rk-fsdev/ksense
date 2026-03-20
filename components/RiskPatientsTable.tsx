import type { PatientRisk } from "@/lib/assessment";

type RiskPatientsTableProps = {
  riskPatients: PatientRisk[];
};

export function RiskPatientsTable({ riskPatients }: RiskPatientsTableProps) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>BP Score</th>
            <th>Temp Score</th>
            <th>Age Score</th>
            <th>Total Score</th>
            <th>Data Quality</th>
          </tr>
        </thead>
        <tbody>
          {riskPatients.map((risk) => (
            <tr key={risk.patient_id}>
              <td>{risk.patient_id}</td>
              <td>{risk.bpScore}</td>
              <td>{risk.tempScore}</td>
              <td>{risk.ageScore}</td>
              <td>{risk.totalScore}</td>
              <td>{risk.hasDataQualityIssue ? "Issue" : "OK"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
