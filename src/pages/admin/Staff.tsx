import { useEffect, useState } from "react";

type Teacher = {
  id: number;
  name: string;
  role: string;
  email: string;
  mobile: string;
  password: string;
  duties: string[];
  access: string;
  active: boolean;
};

const initialTeachers: Teacher[] = [
  { id: 1, name: "Acharya Suresh Pandey", role: "Examination Controller", email: "suresh@gurukul.edu", mobile: "+91 98765 40101", password: "Suresh@2026", duties: ["Approve question papers", "Monitor live exams", "Publish final results"], access: "Exams, Questions, Results", active: true },
  { id: 2, name: "Dr. Savita Shastri", role: "Sanskrit Examiner", email: "savita@gurukul.edu", mobile: "+91 98765 40102", password: "Savita@2026", duties: ["Review Sanskrit questions", "Evaluate oral submissions", "Verify student scores"], access: "Questions, Oral Exams, Results", active: true },
  { id: 3, name: "Dr. Meena Mishra", role: "Student Coordinator", email: "meena@gurukul.edu", mobile: "+91 98765 40103", password: "Meena@2026", duties: ["Verify registrations", "Update student records", "Resolve candidate support cases"], access: "Students, Registrations, Documents", active: true },
];

const emptyTeacher = { name: "", role: "Teacher", email: "", mobile: "", password: "", duties: "", access: "Students", active: true };

export default function AdminStaff() {
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const stored = window.localStorage.getItem("mpvvg_erp_teachers");
      return stored ? JSON.parse(stored) : initialTeachers;
    } catch {
      return initialTeachers;
    }
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState(emptyTeacher);

  useEffect(() => window.localStorage.setItem("mpvvg_erp_teachers", JSON.stringify(teachers)), [teachers]);

  const editTeacher = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setDraft({ name: teacher.name, role: teacher.role, email: teacher.email, mobile: teacher.mobile || "", password: teacher.password || "", duties: teacher.duties.join(", "), access: teacher.access, active: teacher.active });
    setFormOpen(true);
  };

  const saveTeacher = () => {
    if (!draft.name || !draft.role || !draft.email || !draft.mobile || !draft.password) return;
    const teacher = {
      ...draft,
      id: editingId ?? Math.max(0, ...teachers.map((item) => item.id)) + 1,
      duties: draft.duties.split(",").map((duty) => duty.trim()).filter(Boolean),
    };
    setTeachers((current) => editingId ? current.map((item) => item.id === editingId ? teacher : item) : [...current, teacher]);
    setFormOpen(false);
    setEditingId(null);
    setDraft(emptyTeacher);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div><span className="text-xs font-semibold uppercase tracking-widest text-gold">ERP Access Control</span><h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown mt-1">Teachers, Roles & Duties</h1><p className="text-sm text-brown-mid">Assign staff responsibilities and define the ERP modules they may handle.</p></div>
        <button onClick={() => { setEditingId(null); setDraft(emptyTeacher); setFormOpen(true); }} className="px-4 py-2 bg-maroon text-cream rounded-lg text-sm font-semibold hover:bg-maroon-dark">Add Teacher</button>
      </div>

      {formOpen && (
        <section className="bg-cream border-2 border-gold/30 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label><span className="block text-xs text-brown-mid mb-1">Teacher Name *</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">ERP Role *</span><input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">Email *</span><input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">WhatsApp Mobile *</span><input value={draft.mobile} onChange={(event) => setDraft({ ...draft, mobile: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">Unique Password *</span><input value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">ERP Access</span><select value={draft.access} onChange={(event) => setDraft({ ...draft, access: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm"><option>Students</option><option>Exams, Questions, Results</option><option>Questions, Oral Exams, Results</option><option>Students, Registrations, Documents</option><option>Full ERP Access</option></select></label>
            <label className="md:col-span-2"><span className="block text-xs text-brown-mid mb-1">Assigned Duties · separate with commas</span><textarea value={draft.duties} onChange={(event) => setDraft({ ...draft, duties: event.target.value })} rows={3} className="w-full border border-cream-dark rounded-lg px-3 py-2.5 text-sm resize-none" /></label>
          </div>
          <div className="flex gap-2 mt-4"><button onClick={saveTeacher} className="px-5 py-2.5 bg-maroon text-cream rounded-lg text-sm font-semibold">{editingId ? "Save Teacher" : "Add Teacher"}</button><button onClick={() => setFormOpen(false)} className="px-5 py-2.5 border border-cream-dark rounded-lg text-sm">Cancel</button></div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teachers.map((teacher) => (
          <article key={teacher.id} className="bg-cream border border-cream-dark rounded-2xl p-5">
            <div className="flex justify-between gap-4">
              <div><h2 className="font-bold text-brown">{teacher.name}</h2><p className="text-sm text-maroon font-medium">{teacher.role}</p><p className="text-xs text-brown-mid mt-1">{teacher.email} · {teacher.mobile || "No WhatsApp number"}</p></div>
              <span className={`h-fit text-xs font-semibold px-2 py-1 rounded-full ${teacher.active ? "bg-green-100 text-green-700" : "bg-cream-dark text-brown-mid"}`}>{teacher.active ? "Active" : "Inactive"}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-cream-dark"><p className="text-xs uppercase tracking-wide font-semibold text-brown-mid">Assigned Duties</p><ul className="mt-2 space-y-1">{teacher.duties.map((duty) => <li key={duty} className="text-sm text-brown">• {duty}</li>)}</ul></div>
            <p className="text-xs text-gold font-semibold mt-4">Access: {teacher.access}</p>
            <div className="flex gap-3 mt-4"><button onClick={() => editTeacher(teacher)} className="text-xs font-semibold text-maroon hover:underline">Edit Role & Duties</button><button onClick={() => setTeachers((current) => current.map((item) => item.id === teacher.id ? { ...item, active: !item.active } : item))} className="text-xs font-semibold text-brown-mid hover:underline">{teacher.active ? "Deactivate" : "Activate"}</button><button onClick={() => setTeachers((current) => current.filter((item) => item.id !== teacher.id))} className="text-xs font-semibold text-red-600 hover:underline">Remove</button></div>
          </article>
        ))}
      </div>
    </div>
  );
}
