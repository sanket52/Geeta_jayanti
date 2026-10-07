import { useEffect, useMemo, useState } from "react";
import { downloadCsv } from "../../lib/adminExport";
import { getErpStudents, subscribeToErp, updateStudentResult, type ErpStudent } from "../../lib/erpStore";
import { getOralSubmissionVideo, getOralSubmissions, setOralSubmissionEvaluated, type OralSubmission } from "../../lib/oralExamSubmissions";

export default function AdminResults() {
  const [students, setStudents] = useState(getErpStudents);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ErpStudent | null>(null);
  const [writtenScore, setWrittenScore] = useState("");
  const [oralScore, setOralScore] = useState("");
  const [message, setMessage] = useState("");
  const [oralSubmissions, setOralSubmissions] = useState<OralSubmission[]>([]);
  const [oralMessage, setOralMessage] = useState("Loading private video submissions…");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => subscribeToErp(() => {
    const updated = getErpStudents();
    setStudents(updated);
    setSelected((current) => current ? updated.find((student) => student.id === current.id) ?? null : null);
  }), []);

  const loadOralSubmissions = async () => {
    try {
      setOralSubmissions(await getOralSubmissions());
      setOralMessage("");
    } catch (error) {
      setOralMessage(error instanceof Error ? error.message : "Could not load video submissions.");
    }
  };

  useEffect(() => { void loadOralSubmissions(); }, []);

  const openVideo = async (path: string) => {
    try {
      setVideoUrl(await getOralSubmissionVideo(path));
    } catch (error) {
      setOralMessage(error instanceof Error ? error.message : "Could not open video.");
    }
  };

  const markEvaluated = async (submission: OralSubmission) => {
    try {
      await setOralSubmissionEvaluated(submission.id);
      await loadOralSubmissions();
    } catch (error) {
      setOralMessage(error instanceof Error ? error.message : "Could not update submission.");
    }
  };

  const filtered = useMemo(() => students.filter((student) => {
    const term = search.toLowerCase();
    return !term || student.name.toLowerCase().includes(term) || student.id.toLowerCase().includes(term);
  }), [students, search]);

  const openEditor = (student: ErpStudent) => {
    setSelected(student);
    setWrittenScore(student.writtenScore === "—" ? "" : student.writtenScore);
    setOralScore(student.oralScore === "—" ? "" : student.oralScore);
    setMessage("");
  };

  const saveScores = () => {
    if (!selected) return;
    updateStudentResult(selected.id, {
      writtenScore: writtenScore || "—",
      oralScore: oralScore || "—",
      oralExamStatus: oralScore ? "Evaluated" : selected.oralExamStatus,
    });
    setMessage("Scores saved to the connected ERP record.");
  };

  const setResultStatus = (status: "Draft" | "Published") => {
    if (!selected) return;
    updateStudentResult(selected.id, { resultStatus: status });
    setMessage(status === "Published" ? "Result published to the Student Portal." : "Result moved back to draft.");
  };

  const setCertificateStatus = (status: "Not Issued" | "Issued") => {
    if (!selected) return;
    updateStudentResult(selected.id, { certificateStatus: status });
    setMessage(status === "Issued" ? "Certificate issued and enabled for student download." : "Certificate access revoked.");
  };

  const exportResults = () => downloadCsv(
    "student-test-results.csv",
    ["Registration", "Student", "Written Status", "Written Score", "Oral Status", "Oral Score", "Result", "Certificate"],
    students.map((student) => [student.id, student.name, student.writtenExamStatus, student.writtenScore, student.oralExamStatus, student.oralScore, student.resultStatus, student.certificateStatus])
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Separate Examination Records</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown mt-1">Results & Certificates</h1>
          <p className="text-sm text-brown-mid">Evaluate tests, publish results, and control certificate access separately from student profiles.</p>
        </div>
        <button onClick={exportResults} className="px-4 py-2 bg-maroon text-cream rounded-lg text-sm font-semibold hover:bg-maroon-dark">Export Results CSV</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ["Written Submitted", students.filter((student) => student.writtenExamStatus === "Submitted").length],
          ["Oral Submitted", students.filter((student) => student.oralExamStatus === "Submitted").length],
          ["Results Published", students.filter((student) => student.resultStatus === "Published").length],
          ["Certificates Issued", students.filter((student) => student.certificateStatus === "Issued").length],
        ].map(([label, value]) => (
          <div key={label} className="bg-cream border border-cream-dark rounded-xl p-4"><p className="text-xs text-brown-mid">{label}</p><p className="text-2xl font-bold text-maroon mt-1">{value}</p></div>
        ))}
      </div>

      <section className="bg-cream border border-cream-dark rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-brown">Oral video submissions</h2>
            <p className="text-xs text-brown-mid mt-1">Videos are private. Playback links expire after five minutes.</p>
          </div>
          <button onClick={() => void loadOralSubmissions()} className="px-3 py-2 border border-maroon text-maroon rounded-lg text-xs font-semibold">Refresh</button>
        </div>
        {oralMessage && <p className="text-sm text-amber-800 bg-amber-50 rounded-lg p-3">{oralMessage}</p>}
        {oralSubmissions.length === 0 && !oralMessage && <p className="text-sm text-brown-mid">No video submissions yet.</p>}
        <div className="divide-y divide-cream-dark">
          {oralSubmissions.map((submission) => (
            <div key={submission.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brown">{submission.student_name} <span className="font-normal text-brown-mid">· {submission.registration_number}</span></p>
                <p className="text-xs text-brown-mid">{submission.subject} · {new Date(submission.uploaded_at).toLocaleString()} · {(submission.file_size / (1024 * 1024)).toFixed(1)} MB · {submission.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => void openVideo(submission.storage_path)} className="px-3 py-2 bg-maroon text-cream rounded-lg text-xs font-semibold">Watch video</button>
                {submission.status !== "Evaluated" && <button onClick={() => void markEvaluated(submission)} className="px-3 py-2 border border-green-700 text-green-700 rounded-lg text-xs font-semibold">Mark evaluated</button>}
              </div>
            </div>
          ))}
        </div>
        {videoUrl && <div className="fixed inset-0 z-50 bg-brown/80 flex items-center justify-center p-4" onMouseDown={() => setVideoUrl(null)}><div className="w-full max-w-3xl bg-black rounded-xl overflow-hidden" onMouseDown={(event) => event.stopPropagation()}><div className="flex justify-end p-2 bg-cream"><button onClick={() => setVideoUrl(null)} className="text-sm font-semibold text-maroon">Close</button></div><video src={videoUrl} controls autoPlay className="w-full max-h-[75vh]" /></div></div>}
      </section>

      <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student or registration number" className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm focus:border-gold focus:outline-none" />

      <div className="bg-cream border border-cream-dark rounded-2xl overflow-x-auto">
        <table className="w-full min-w-200 text-sm">
          <thead><tr className="bg-cream-dark/60">{["Student", "Written Test", "Oral Test", "Result", "Certificate", "Action"].map((heading) => <th key={heading} className="text-left px-4 py-3 text-xs uppercase tracking-wide text-brown-mid">{heading}</th>)}</tr></thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id} className="border-t border-cream-dark hover:bg-cream-dark/30">
                <td className="px-4 py-3"><p className="font-semibold text-brown">{student.name}</p><p className="text-xs text-brown-mid">{student.id}</p></td>
                <td className="px-4 py-3"><p className="text-brown">{student.writtenExamStatus}</p><p className="text-xs text-maroon font-semibold">{student.writtenScore}</p></td>
                <td className="px-4 py-3"><p className="text-brown">{student.oralExamStatus}</p><p className="text-xs text-maroon font-semibold">{student.oralScore}</p></td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${student.resultStatus === "Published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{student.resultStatus}</span></td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${student.certificateStatus === "Issued" ? "bg-green-100 text-green-700" : "bg-cream-dark text-brown-mid"}`}>{student.certificateStatus}</span></td>
                <td className="px-4 py-3"><button onClick={() => openEditor(student)} className="px-3 py-1.5 border border-maroon text-maroon rounded-lg text-xs font-semibold hover:bg-maroon hover:text-cream">Manage Result</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-brown/60 flex justify-end" onMouseDown={() => setSelected(null)}>
          <aside className="w-full sm:w-112 h-full bg-cream border-l-2 border-gold shadow-2xl overflow-y-auto" onMouseDown={(event) => event.stopPropagation()}>
            <div className="bg-maroon-dark text-cream px-6 py-5 flex justify-between">
              <div><p className="text-gold text-xs uppercase tracking-widest">Result Manager</p><h2 className="text-xl font-bold mt-1">{selected.name}</h2><p className="text-xs text-cream/60">{selected.id}</p></div>
              <button onClick={() => setSelected(null)} className="text-sm text-cream/70">Close</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <label><span className="block text-xs text-brown-mid mb-1">Written Score</span><input value={writtenScore} onChange={(event) => setWrittenScore(event.target.value)} placeholder="e.g. 8/10" className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm" /></label>
                <label><span className="block text-xs text-brown-mid mb-1">Oral Score</span><input value={oralScore} onChange={(event) => setOralScore(event.target.value)} placeholder="e.g. 18/20" className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm" /></label>
              </div>
              <button onClick={saveScores} className="w-full bg-maroon text-cream rounded-lg py-3 text-sm font-semibold hover:bg-maroon-dark">Save Scores</button>
              <div className="border-t border-cream-dark pt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brown-mid mb-3">Result Publication</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setResultStatus("Published")} className="border border-green-600 text-green-700 rounded-lg py-2.5 text-xs font-semibold hover:bg-green-50">Publish Result</button>
                  <button onClick={() => setResultStatus("Draft")} className="border border-gold text-gold rounded-lg py-2.5 text-xs font-semibold hover:bg-gold/10">Move to Draft</button>
                </div>
              </div>
              <div className="border-t border-cream-dark pt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brown-mid mb-3">Certificate Access</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setCertificateStatus("Issued")} className="bg-gold text-brown rounded-lg py-2.5 text-xs font-semibold hover:bg-gold-light">Issue Certificate</button>
                  <button onClick={() => setCertificateStatus("Not Issued")} className="border border-red-600 text-red-700 rounded-lg py-2.5 text-xs font-semibold hover:bg-red-50">Revoke</button>
                </div>
              </div>
              {message && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{message}</p>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
