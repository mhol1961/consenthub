import patientsData from "@/data/patients.json";
import PatientDetailClient from "./PatientDetailClient";

export function generateStaticParams() {
  return patientsData.map((p) => ({ id: p.id }));
}

export default function PatientDetailPage() {
  return <PatientDetailClient />;
}
