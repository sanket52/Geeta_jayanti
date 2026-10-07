import { useEffect, useMemo, useState } from "react";
import { downloadCsv } from "../../lib/adminExport";
import { getQuestions, saveQuestions, type Question, type QuestionStatus } from "../../lib/questionStore";

const blankQuestion: Omit<Question, "id"> = {
  question: "",
  subject: "Sanskrit",
  difficulty: "Easy",
  marks: 1,
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  answer: "A",
  status: "Draft",
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>(getQuestions);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState(blankQuestion);
  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  const filtered = useMemo(() => questions.filter((question) => {
    const matchesSearch = !search || question.question.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (subjectFilter === "All" || question.subject === subjectFilter) && (statusFilter === "All" || question.status === statusFilter);
  }), [questions, search, subjectFilter, statusFilter]);

  const openNew = () => {
    setEditingId(null);
    setDraft(blankQuestion);
    setFormOpen(true);
    setMessage("");
  };

  const openEdit = (question: Question) => {
    const { id, ...values } = question;
    setEditingId(id);
    setDraft(values);
    setFormOpen(true);
    setMessage("");
  };

  const saveQuestion = () => {
    if (!draft.question.trim() || !draft.optionA.trim() || !draft.optionB.trim() || !draft.optionC.trim() || !draft.optionD.trim()) {
      setMessage("Complete the question and all four answer options.");
      return;
    }
    if (editingId) {
      setQuestions((current) => current.map((question) => question.id === editingId ? { ...draft, id: editingId } : question));
      setMessage("Question updated successfully.");
    } else {
      const nextId = Math.max(0, ...questions.map((question) => question.id)) + 1;
      setQuestions((current) => [{ ...draft, id: nextId }, ...current]);
      setMessage("Question added successfully.");
      setEditingId(nextId);
    }
  };

  const deleteQuestion = (id: number) => {
    setQuestions((current) => current.filter((question) => question.id !== id));
    setSelected((current) => current.filter((questionId) => questionId !== id));
    if (editingId === id) setFormOpen(false);
  };

  const togglePublished = (id: number) => {
    setQuestions((current) => current.map((question) => question.id === id
      ? { ...question, status: question.status === "Published" ? "Draft" : "Published" }
      : question
    ));
  };

  const bulkPublish = () => {
    setQuestions((current) => current.map((question) => selected.includes(question.id) ? { ...question, status: "Published" } : question));
    setMessage(`${selected.length} selected questions published.`);
    setSelected([]);
  };

  const exportQuestions = () => {
    downloadCsv(
      "question-bank-2026.csv",
      ["ID", "Question", "Subject", "Difficulty", "Marks", "Option A", "Option B", "Option C", "Option D", "Correct Answer", "Status"],
      questions.map((question) => [question.id, question.question, question.subject, question.difficulty, question.marks, question.optionA, question.optionB, question.optionC, question.optionD, question.answer, question.status])
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Competition Management</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown mt-1">Question Bank</h1>
          <p className="text-sm text-brown-mid">Create, review, publish, and export examination questions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportQuestions} className="px-4 py-2 border border-maroon text-maroon rounded-lg font-semibold text-sm hover:bg-maroon/5">Export Questions</button>
          <button onClick={openNew} className="px-4 py-2 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark">Add Question</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ["Total Questions", questions.length],
          ["Published", questions.filter((question) => question.status === "Published").length],
          ["Draft", questions.filter((question) => question.status === "Draft").length],
          ["Total Marks", questions.reduce((total, question) => total + question.marks, 0)],
        ].map(([label, value]) => (
          <div key={label} className="bg-cream border border-cream-dark rounded-xl p-4">
            <p className="text-xs text-brown-mid">{label}</p>
            <p className="text-2xl font-bold text-maroon mt-1">{value}</p>
          </div>
        ))}
      </div>

      {formOpen && (
        <section className="bg-cream border-2 border-gold/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div><h2 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown">{editingId ? "Edit Question" : "Add Question"}</h2><p className="text-xs text-brown-mid">Configure the question, options, answer, marks, and publication status.</p></div>
            <button onClick={() => setFormOpen(false)} className="text-sm text-brown-mid hover:text-maroon">Close</button>
          </div>
          <label className="block">
            <span className="block text-xs text-brown-mid mb-1">Question *</span>
            <textarea value={draft.question} onChange={(event) => setDraft({ ...draft, question: event.target.value })} rows={3} className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none resize-none" />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {(["A", "B", "C", "D"] as const).map((letter) => {
              const key = `option${letter}` as "optionA" | "optionB" | "optionC" | "optionD";
              return (
                <label key={letter} className="block">
                  <span className="block text-xs text-brown-mid mb-1">Option {letter} *</span>
                  <input value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm text-brown focus:border-gold focus:outline-none" />
                </label>
              );
            })}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
            <label><span className="block text-xs text-brown-mid mb-1">Subject</span><select value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm"><option>Sanskrit</option><option>Vedas</option><option>Vedangas</option><option>Indian Culture</option><option>General Knowledge</option></select></label>
            <label><span className="block text-xs text-brown-mid mb-1">Difficulty</span><select value={draft.difficulty} onChange={(event) => setDraft({ ...draft, difficulty: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm"><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
            <label><span className="block text-xs text-brown-mid mb-1">Marks</span><input type="number" min={1} value={draft.marks} onChange={(event) => setDraft({ ...draft, marks: Number(event.target.value) })} className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm" /></label>
            <label><span className="block text-xs text-brown-mid mb-1">Correct Answer</span><select value={draft.answer} onChange={(event) => setDraft({ ...draft, answer: event.target.value })} className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm"><option>A</option><option>B</option><option>C</option><option>D</option></select></label>
            <label><span className="block text-xs text-brown-mid mb-1">Status</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as QuestionStatus })} className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm"><option>Draft</option><option>Published</option></select></label>
          </div>
          <div className="flex items-center gap-4 mt-5">
            <button onClick={saveQuestion} className="px-6 py-2.5 bg-maroon text-cream rounded-lg text-sm font-semibold hover:bg-maroon-dark">{editingId ? "Save Changes" : "Add to Question Bank"}</button>
            {message && <p className={`text-xs font-medium ${message.includes("Complete") ? "text-red-700" : "text-green-700"}`}>{message}</p>}
          </div>
        </section>
      )}

      <div className="bg-cream border border-cream-dark rounded-xl p-4 flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search question text" className="flex-1 min-w-64 border border-cream-dark rounded-lg px-4 py-2 text-sm focus:border-gold focus:outline-none" />
        <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} className="border border-cream-dark rounded-lg px-3 py-2 text-sm"><option value="All">All subjects</option><option>Sanskrit</option><option>Vedas</option><option>Vedangas</option><option>Indian Culture</option><option>General Knowledge</option></select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border border-cream-dark rounded-lg px-3 py-2 text-sm"><option value="All">All statuses</option><option>Published</option><option>Draft</option></select>
        <button onClick={bulkPublish} disabled={!selected.length} className="px-4 py-2 bg-gold text-brown rounded-lg text-sm font-semibold disabled:opacity-40">Publish Selected ({selected.length})</button>
      </div>

      <div className="space-y-3">
        {filtered.map((question) => (
          <article key={question.id} className="bg-cream border border-cream-dark rounded-xl p-5 flex gap-4">
            <input type="checkbox" checked={selected.includes(question.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, question.id] : current.filter((id) => id !== question.id))} className="mt-1 accent-maroon" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-maroon">Q{question.id}</span>
                <span className="text-xs bg-cream-dark text-brown-mid px-2 py-0.5 rounded">{question.subject}</span>
                <span className="text-xs bg-cream-dark text-brown-mid px-2 py-0.5 rounded">{question.difficulty}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${question.status === "Published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{question.status}</span>
              </div>
              <p className="font-medium text-brown">{question.question}</p>
              <p className="text-xs text-brown-mid mt-2">Correct answer: <strong className="text-maroon">{question.answer}</strong> · {question.marks} mark{question.marks > 1 ? "s" : ""}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => openEdit(question)} className="text-xs font-semibold text-maroon hover:underline">Edit</button>
              <button onClick={() => togglePublished(question.id)} className="text-xs font-semibold text-gold hover:underline">{question.status === "Published" ? "Unpublish" : "Publish"}</button>
              <button onClick={() => deleteQuestion(question.id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
            </div>
          </article>
        ))}
        {!filtered.length && <div className="bg-cream border border-cream-dark rounded-xl p-10 text-center text-sm text-brown-mid">No questions match the selected filters.</div>}
      </div>
    </div>
  );
}
