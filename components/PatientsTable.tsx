import type { PatientRecord } from "@/lib/assessment";

type PatientsTableProps = {
  patients: PatientRecord[];
};

export function PatientsTable({ patients }: PatientsTableProps) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Blood Pressure</th>
            <th>Temperature</th>
            <th>Visit Date</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={typeof patient.patient_id === "string" ? patient.patient_id : `row-${index}`}>
              <td>{typeof patient.patient_id === "string" ? patient.patient_id : "-"}</td>
              <td>{typeof patient.name === "string" ? patient.name : "-"}</td>
              <td>{typeof patient.age === "number" || typeof patient.age === "string" ? patient.age : "-"}</td>
              <td>{typeof patient.gender === "string" ? patient.gender : "-"}</td>
              <td>{typeof patient.blood_pressure === "string" ? patient.blood_pressure : "-"}</td>
              <td>
                {typeof patient.temperature === "number" || typeof patient.temperature === "string"
                  ? patient.temperature
                  : "-"}
              </td>
              <td>{typeof patient.visit_date === "string" ? patient.visit_date : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
