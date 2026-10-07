import { useEffect, useState } from "react";
import { Link } from "react-router";
import { downloadCsv } from "../../lib/adminExport";
import { getErpStudents, subscribeToErp } from "../../lib/erpStore";

export default function AdminCompetitions() {
  const [students, setStudents] = useState(getErpStudents);
  const [showCompetitionForm, setShowCompetitionForm] = useState(false);
  const [formMode, setFormMode] = useState<"new" | "edit">("new");
  const [competitionName, setCompetitionName] = useState("Vedic Knowledge Competition 2026");
  const [examDate, setExamDate] = useState("2026-10-15");
  const [registrationEnd, setRegistrationEnd] = useState("2026-09-30");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => subscribeToErp(() => setStudents(getErpStudents())), []);

  const approved = students.filter((student) => student.status === "Approved").length;
  const pending = students.filter((student) => student.status === "Pending").length;
  const oralSubmitted = students.filter((student) => student.oralExamStatus === "Submitted").length;

  const openForm = (mode: "new" | "edit") => {
    setFormMode(mode);
    if (mode === "new") {
      setCompetitionName("");
      setExamDate("");
      setRegistrationEnd("");
    } else {
      setCompetitionName("Vedic Knowledge Competition 2026");
      setExamDate("2026-10-15");
      setRegistrationEnd("2026-09-30");
    }
    setSavedMessage("");
    setShowCompetitionForm(true);
  };

  const saveCompetition = () => {
    if (!competitionName || !examDate || !registrationEnd) {
      setSavedMessage("Complete all required competition details.");
      return;
    }
    setSavedMessage(formMode === "new" ? "Competition created successfully." : "Competition updated successfully.");
  };

  const generateAdmitCards = () => {
    downloadCsv(
      "admit-card-generation-batch.csv",
      ["Registration Number", "Candidate Name", "Roll Number", "Exam Date", "Exam Time", "Status"],
      [
        ["MPVVG-2026-000568", "Anjali Tiwari", "VK26-JR-00568", "15 Oct 2026", "10:00 AM", "Ready"],
        ["MPVVG-2026-000567", "Suresh Pandey", "VK26-SR-00567", "15 Oct 2026", "10:00 AM", "Ready"],
        ["MPVVG-2026-000566", "Priya Sharma", "VK26-JR-00566", "15 Oct 2026", "10:00 AM", "Ready"],
      ]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Competition Management</h1>
          <p className="text-sm text-brown-mid">Manage competitions, exams, and question banks</p>
        </div>
        <button onClick={() => openForm("new")} className="px-4 py-2 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">
          + New Competition
        </button>
      </div>

      {showCompetitionForm && (
        <div className="bg-cream border-2 border-gold/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown">{formMode === "new" ? "Create Competition" : "Edit Competition"}</h2>
              <p className="text-xs text-brown-mid">Configure registration and examination dates.</p>
            </div>
            <button onClick={() => setShowCompetitionForm(false)} className="text-sm text-brown-mid hover:text-maroon">Close</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="md:col-span-3"><span className="block text-xs text-brown-mid mb-1">Competition Name *</span><input value={competitionName} onChange={(event) => setCompetitionName(event.target.value)} className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">Registration Closing Date *</span><input type="date" value={registrationEnd} onChange={(event) => setRegistrationEnd(event.target.value)} className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">Examination Date *</span><input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm focus:border-gold focus:outline-none" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">Status</span><select className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm"><option>Draft</option><option>Registration Open</option><option>Active</option><option>Completed</option></select></label>
          </div>
          <div className="flex items-center gap-4 mt-5">
            <button onClick={saveCompetition} className="px-6 py-2.5 bg-maroon text-cream rounded-lg text-sm font-semibold hover:bg-maroon-dark">{formMode === "new" ? "Create Competition" : "Save Changes"}</button>
            {savedMessage && <p className={`text-xs font-medium ${savedMessage.includes("Complete") ? "text-red-700" : "text-green-700"}`}>{savedMessage}</p>}
          </div>
        </div>
      )}

      {/* Active Competition */}
      <div className="bg-cream border-2 border-gold/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-maroon to-maroon-dark text-cream px-6 py-4 flex justify-between items-center">
          <div>
            <div className="text-gold text-xs font-semibold uppercase tracking-wider mb-1">🟢 Active</div>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold">Vedic Knowledge Competition 2026</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openForm("edit")} className="px-3 py-1.5 bg-white/15 text-cream text-xs font-semibold rounded hover:bg-white/25 transition-colors">Edit</button>
            <button onClick={generateAdmitCards} className="px-3 py-1.5 bg-gold text-brown text-xs font-semibold rounded hover:bg-gold-light transition-colors">Generate Admit Cards</button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Testing Registrations", String(students.length)],
            ["Approved", String(approved)],
            ["Pending", String(pending)],
            ["Exam Date", "15 Oct 2026"],
          ].map(([k, v]) => (
            <div key={k} className="bg-cream-dark rounded-xl p-3 text-center">
              <div className="font-bold text-maroon text-lg">{v}</div>
              <div className="text-xs text-brown-mid">{k}</div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "MCQ Questions", stats: [["Total Questions", "5"], ["Published", "3"], ["Draft", "2"]], icon: "📝", action: "Manage Questions", to: "/admin/questions" },
            { title: "Exam Sections", stats: [["Sanskrit", "2Q"], ["Vedas", "2Q"], ["Culture", "1Q"], ["GK", "0Q"]], icon: "📚", action: "Manage Sections", to: "/admin/questions" },
            { title: "Oral Examination", stats: [["Questions", "1"], ["Assigned", String(students.length)], ["Submitted", String(oralSubmitted)], ["Evaluated", "0"]], icon: "🎥", action: "Manage Oral", to: "/admin/exam-organizer" },
          ].map((c) => (
            <div key={c.title} className="bg-cream border border-cream-dark rounded-xl p-4">
              <h4 className="font-semibold text-brown text-sm mb-3 flex items-center gap-2">{c.icon} {c.title}</h4>
              <div className="space-y-2 mb-3">
                {c.stats.map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-brown-mid">{k}</span>
                    <span className="font-semibold text-brown">{v}</span>
                  </div>
                ))}
              </div>
              <Link to={c.to} className="block w-full text-center text-xs font-semibold text-maroon border border-maroon rounded-lg py-1.5 hover:bg-maroon hover:text-cream transition-colors">
                {c.action} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Past Competitions */}
      <div className="bg-cream border border-cream-dark rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-dark">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown">Past Competitions</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-dark/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Competition</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Year</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Registrations</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Appeared</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Passed</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Vedic Knowledge Competition", "2025", "20", "18", "14", "Testing"],
              ["Sanskrit Saptah Competition", "2025", "16", "15", "12", "Testing"],
              ["Vedic Knowledge Competition", "2024", "18", "17", "13", "Testing"],
              ["Junior Sanskrit Olympiad", "2024", "12", "11", "10", "Testing"],
            ].map(([name, year, reg, app, pass, status]) => (
              <tr key={`${name}${year}`} className="border-t border-cream-dark hover:bg-cream-dark/30 transition-colors">
                <td className="px-6 py-3 font-medium text-brown">{name}</td>
                <td className="px-6 py-3 text-brown-mid">{year}</td>
                <td className="px-6 py-3 text-brown-mid">{reg}</td>
                <td className="px-6 py-3 text-brown-mid">{app}</td>
                <td className="px-6 py-3 text-brown-mid">{pass}</td>
                <td className="px-6 py-3">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
