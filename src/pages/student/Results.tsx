import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getErpStudents, subscribeToErp, type ErpStudent } from "../../lib/erpStore";
import { getStudentRecord } from "../../lib/studentRecord";

export default function StudentResults() {
  const [record] = useState(getStudentRecord);
  const [result, setResult] = useState<ErpStudent | undefined>(() => getErpStudents().find((student) => student.id === record.registrationNumber));

  useEffect(() => subscribeToErp(() => setResult(getErpStudents().find((student) => student.id === record.registrationNumber))), [record.registrationNumber]);

  if (!result || result.resultStatus !== "Published") {
    return (
      <div className="space-y-6 max-w-3xl">
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Result & Certificate</h1>
        <div className="bg-cream border border-cream-dark rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center font-bold text-xl mx-auto">R</div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-brown mt-4 mb-2">Result Awaiting Publication</h2>
          <p className="text-brown-mid text-sm">Your examination record is connected to the Admin ERP. The result will appear here immediately after an authorized teacher publishes it.</p>
          <div className="bg-cream-dark rounded-xl p-5 mt-6 grid grid-cols-2 gap-4 text-left">
            <div><p className="text-xs text-brown-mid">Written Exam</p><p className="font-semibold text-brown mt-1">{result?.writtenExamStatus ?? "Not Started"}</p></div>
            <div><p className="text-xs text-brown-mid">Oral Exam</p><p className="font-semibold text-brown mt-1">{result?.oralExamStatus ?? "Not Started"}</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-green-700">Published by Admin ERP</span>
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown mt-1">Examination Result</h1>
      </div>
      <div className="bg-cream border-2 border-gold/30 rounded-2xl overflow-hidden">
        <div className="bg-maroon-dark text-cream px-6 py-5"><h2 className="text-xl font-bold">{record.fullName}</h2><p className="text-xs text-cream/60 mt-1">{record.registrationNumber} · {record.competition}</p></div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Written Score", result.writtenScore],
            ["Oral Score", result.oralScore],
            ["Result", result.resultStatus],
            ["Certificate", result.certificateStatus],
          ].map(([label, value]) => (
            <div key={label} className="bg-cream-dark rounded-xl p-4 text-center"><p className="text-xs text-brown-mid">{label}</p><p className="font-bold text-maroon text-lg mt-1">{value}</p></div>
          ))}
        </div>
      </div>
      {result.certificateStatus === "Issued" ? (
        <Link to="/student/certificate" className="block w-full text-center bg-maroon text-cream rounded-xl py-3.5 text-sm font-semibold hover:bg-maroon-dark">Download Issued Certificate</Link>
      ) : (
        <p className="text-center text-sm text-brown-mid bg-cream-dark rounded-xl p-4">Your result is published. Certificate issuance is pending admin approval.</p>
      )}
    </div>
  );
}
