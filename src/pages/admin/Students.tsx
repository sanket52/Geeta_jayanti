import { useEffect, useMemo, useState } from "react";
import { downloadCsv, downloadStudentsPdf } from "../../lib/adminExport";
import {
  getErpStudents,
  saveErpStudents,
  subscribeToErp,
  type ErpStudent as Student,
  type ErpStudentStatus as StudentStatus,
} from "../../lib/erpStore";

const statusColors: Record<StudentStatus, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>(getErpStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Student | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    return subscribeToErp(() => setStudents(getErpStudents()));
  }, []);

  const filtered = useMemo(() => students.filter((student) => {
    const term = search.toLowerCase();
    const matchesSearch = !term || [student.name, student.id, student.mobile, student.email].some((value) => value.toLowerCase().includes(term));
    return matchesSearch && (statusFilter === "All" || student.status === statusFilter) && (stateFilter === "All" || student.state === stateFilter);
  }), [students, search, statusFilter, stateFilter]);

  const states = [...new Set(students.map((student) => student.state))].sort();

  const openStudent = (student: Student) => {
    setSelectedId(student.id);
    setDraft({ ...student });
    setSavedMessage("");
  };

  const saveStudent = () => {
    if (!draft) return;
    const updated = students.map((student) => student.id === draft.id ? { ...draft, lastUpdated: new Date().toLocaleString("en-IN") } : student);
    saveErpStudents(updated);
    setSavedMessage("Student details saved successfully.");
  };

  const updateStatus = (status: StudentStatus) => {
    if (!draft) return;
    const updated = { ...draft, status, lastUpdated: new Date().toLocaleString("en-IN") };
    setDraft(updated);
    saveErpStudents(students.map((student) => student.id === updated.id ? updated : student));
    setSavedMessage(`Student marked as ${status.toLowerCase()}.`);
  };

  const exportStudents = (records: Student[], suffix: string) => {
    downloadCsv(
      `students-${suffix}-2026.csv`,
      ["Registration Number", "Name", "Father Name", "Date of Birth", "Email", "Mobile", "State", "District", "Category", "Subject", "Status", "Written Exam", "Written Score", "Oral Exam", "Oral Score", "Result Status", "Certificate Status", "Registration Date", "Last Updated"],
      records.map((student) => [student.id, student.name, student.fatherName, student.dob, student.email, student.mobile, student.state, student.district, student.category, student.subject, student.status, student.writtenExamStatus, student.writtenScore, student.oralExamStatus, student.oralScore, student.resultStatus, student.certificateStatus, student.date, student.lastUpdated])
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Student Management</h1>
          <p className="text-sm text-brown-mid">{filtered.length} students shown · {students.filter((student) => student.status === "Pending").length} pending approval</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => downloadStudentsPdf(students)} className="px-4 py-2 border border-gold text-gold rounded-lg font-semibold text-sm hover:bg-gold/10 transition-colors">
            Export All PDF
          </button>
          <button onClick={() => exportStudents(filtered, "filtered")} className="px-4 py-2 border border-maroon text-maroon rounded-lg font-semibold text-sm hover:bg-maroon/5 transition-colors">
            Export Filtered
          </button>
          <button onClick={() => exportStudents(students, "all")} className="px-4 py-2 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">
            Export All Students
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ["Total Students", students.length],
          ["Approved", students.filter((student) => student.status === "Approved").length],
          ["Pending", students.filter((student) => student.status === "Pending").length],
          ["Rejected", students.filter((student) => student.status === "Rejected").length],
        ].map(([label, value]) => (
          <div key={label} className="bg-cream border border-cream-dark rounded-xl p-4">
            <p className="text-xs text-brown-mid">{label}</p>
            <p className="text-2xl font-bold text-maroon mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-cream border border-cream-dark rounded-xl p-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, registration, mobile, or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1 min-w-64 border border-cream-dark rounded-lg px-4 py-2 text-sm text-brown focus:border-gold focus:outline-none"
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border border-cream-dark rounded-lg px-3 py-2 text-sm text-brown focus:border-gold focus:outline-none">
          <option value="All">All statuses</option>
          <option>Pending</option><option>Approved</option><option>Rejected</option>
        </select>
        <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} className="border border-cream-dark rounded-lg px-3 py-2 text-sm text-brown focus:border-gold focus:outline-none">
          <option value="All">All states</option>
          {states.map((state) => <option key={state}>{state}</option>)}
        </select>
      </div>

      <div>
        <div className="bg-cream border border-cream-dark rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm min-w-200">
            <thead>
              <tr className="bg-cream-dark/60">
                {["Student", "Contact", "Location", "Category", "Registered", "Status", "Action"].map((heading) => (
                  <th key={heading} className="text-left px-4 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className={`border-t border-cream-dark hover:bg-cream-dark/30 ${selectedId === student.id ? "bg-gold/10" : ""}`}>
                  <td className="px-4 py-3"><p className="font-semibold text-brown">{student.name}</p><p className="text-xs text-brown-mid">{student.id}</p></td>
                  <td className="px-4 py-3"><p className="text-brown">{student.email}</p><p className="text-xs text-brown-mid">{student.mobile}</p></td>
                  <td className="px-4 py-3 text-brown-mid">{student.district}, {student.state}</td>
                  <td className="px-4 py-3"><p className="text-brown">{student.category}</p><p className="text-xs text-brown-mid">{student.subject}</p></td>
                  <td className="px-4 py-3 text-brown-mid">{student.date}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[student.status]}`}>{student.status}</span></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => openStudent(student)} className="px-3 py-1.5 border border-maroon text-xs font-semibold text-maroon rounded-lg hover:bg-maroon hover:text-cream transition-colors">
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <p className="text-center text-sm text-brown-mid py-10">No students match the selected filters.</p>}
        </div>

      </div>

      {draft && (
        <div className="fixed inset-0 z-50 bg-brown/60 flex justify-end" onMouseDown={() => { setDraft(null); setSelectedId(null); }}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${draft.name}`}
            className="w-full sm:w-112 h-full bg-cream border-l-2 border-gold shadow-2xl overflow-y-auto"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-maroon-dark text-cream px-6 py-5 flex items-start justify-between border-b-2 border-gold">
              <div>
                <p className="text-gold text-xs font-semibold uppercase tracking-widest">Student Record</p>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold mt-1">View & Edit Student</h2>
                <p className="text-xs text-cream/60 mt-1">{draft.id}</p>
              </div>
              <button type="button" onClick={() => { setDraft(null); setSelectedId(null); }} className="text-cream/70 hover:text-cream text-sm border border-white/20 rounded-lg px-3 py-1.5">
                Close
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between bg-cream-dark rounded-xl p-4 mb-5">
                <div>
                  <p className="text-xs text-brown-mid">Current status</p>
                  <p className="font-semibold text-brown mt-1">{draft.status}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[draft.status]}`}>{draft.status}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["name", "Full Name", "text"],
                  ["fatherName", "Father's Name", "text"],
                  ["dob", "Date of Birth", "text"],
                  ["email", "Email", "email"],
                  ["mobile", "Mobile", "tel"],
                  ["district", "District", "text"],
                  ["state", "State", "text"],
                  ["subject", "Subject", "text"],
                ].map(([key, label, type]) => (
                  <label key={key} className={`block ${key === "name" || key === "email" ? "sm:col-span-2" : ""}`}>
                    <span className="block text-xs font-medium text-brown-mid mb-1">{label}</span>
                    <input type={type} value={String(draft[key as keyof Student] ?? "")} onChange={(event) => { setDraft({ ...draft, [key]: event.target.value }); setSavedMessage(""); }} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm text-brown focus:border-gold focus:outline-none" />
                  </label>
                ))}
                <label className="block">
                  <span className="block text-xs font-medium text-brown-mid mb-1">Category</span>
                  <select value={draft.category} onChange={(event) => { setDraft({ ...draft, category: event.target.value }); setSavedMessage(""); }} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                    <option>Junior</option><option>Senior</option><option>Youth</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-brown-mid mb-1">Registration Date</span>
                  <input value={draft.date} onChange={(event) => { setDraft({ ...draft, date: event.target.value }); setSavedMessage(""); }} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm text-brown focus:border-gold focus:outline-none" />
                </label>
              </div>

              {savedMessage && <p className="mt-4 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{savedMessage}</p>}

              <div className="sticky bottom-0 bg-cream pt-5 pb-1 mt-2">
                <button type="button" onClick={saveStudent} className="w-full bg-maroon text-cream rounded-lg py-3 text-sm font-semibold hover:bg-maroon-dark transition-colors">
                  Save Student Changes
                </button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button type="button" onClick={() => updateStatus("Approved")} className="border border-green-600 text-green-700 rounded-lg py-2.5 text-xs font-semibold hover:bg-green-50">Approve Student</button>
                  <button type="button" onClick={() => updateStatus("Rejected")} className="border border-red-600 text-red-700 rounded-lg py-2.5 text-xs font-semibold hover:bg-red-50">Reject Student</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
