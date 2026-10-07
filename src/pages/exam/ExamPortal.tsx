import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { recordWrittenExam } from "../../lib/erpStore";
import { getStudentRecord } from "../../lib/studentRecord";
import { getPublishedQuestions, subscribeToQuestions } from "../../lib/questionStore";

const TOTAL_TIME = 120 * 60; // 2 hours in seconds

const loadExamQuestions = () => getPublishedQuestions().map((question) => ({
  id: question.id,
  section: question.subject,
  text: question.question,
  options: [question.optionA, question.optionB, question.optionC, question.optionD],
  answer: question.answer,
  marks: question.marks,
}));

type Status = "not-answered" | "answered" | "marked";

export default function ExamPortal() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"instructions" | "exam" | "submitted">("instructions");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showConfirm, setShowConfirm] = useState(false);
  const [questions, setQuestions] = useState(loadExamQuestions);

  useEffect(() => subscribeToQuestions(() => {
    if (phase === "instructions") setQuestions(loadExamQuestions());
  }), [phase]);

  useEffect(() => {
    if (phase !== "exam") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); setPhase("submitted"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const selectAnswer = (qIdx: number, optIdx: number) => {
    setAnswers({ ...answers, [qIdx]: optIdx });
    setStatuses({ ...statuses, [qIdx]: "answered" });
  };

  const markForReview = (qIdx: number) => {
    setStatuses({ ...statuses, [qIdx]: "marked" });
  };

  const answered = Object.keys(answers).length;
  const marked = Object.values(statuses).filter((s) => s === "marked").length;
  const notVisited = questions.length - Object.keys(statuses).length;
  const totalMarks = questions.reduce((total, question) => total + question.marks, 0);
  const score = Object.entries(answers).reduce((total, [questionIndex, optionIndex]) => {
    const question = questions[Number(questionIndex)];
    if (!question) return total;
    const correctIndex = ["A", "B", "C", "D"].indexOf(question.answer);
    return total + (optionIndex === correctIndex ? question.marks : 0);
  }, 0);

  useEffect(() => {
    if (phase === "submitted") {
      recordWrittenExam(getStudentRecord().registrationNumber, score, totalMarks);
    }
  }, [phase, score, totalMarks]);

  if (phase === "instructions") {
    return (
      <div className="h-full flex items-center justify-center bg-[#0f1117] px-6 py-10">
        <div className="max-w-2xl w-full bg-[#1a1e28] border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-[#8B1A1A] px-6 py-5">
            <h1 className="text-xl font-bold text-white">Vedic Knowledge Competition 2026</h1>
            <p className="text-white/70 text-sm mt-1">Online MCQ Examination — Maharshi Panini Ved Vedang Vidhyapeeth Gurukul</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[["Duration", "2 Hours"], ["Questions", `${questions.length} MCQ`], ["Total Marks", String(totalMarks)], ["Question Source", "Admin ERP"]].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-white font-bold text-lg">{v}</div>
                  <div className="text-white/40 text-xs">{k}</div>
                </div>
              ))}
            </div>
            <h3 className="text-white font-semibold mb-3 text-sm">Important Instructions</h3>
            <ul className="space-y-2 text-sm text-white/60 mb-6">
              {[
                "Do not refresh or navigate away from this page during the exam.",
                "Each question has exactly one correct answer.",
                "¼ mark will be deducted for each wrong answer. No penalty for unattempted.",
                "Your answers are saved automatically every 30 seconds.",
                "The exam will auto-submit when the timer reaches zero.",
                "You may mark questions for review and return to them later.",
                "Ensure stable internet connection before starting.",
                "Camera and microphone access may be required for proctoring.",
              ].map((inst, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#C8902B] shrink-0">{i + 1}.</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
            <div className="bg-amber-900/30 border border-amber-700/30 rounded-xl p-4 mb-6 text-sm text-amber-300">
              ⚠️ Once you click "Start Examination", the timer will begin and cannot be paused. Make sure you are ready.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPhase("exam")}
                className="flex-1 bg-[#8B1A1A] hover:bg-[#5C0F0F] text-white py-3.5 rounded-xl font-bold text-sm transition-colors">
                Start Examination →
              </button>
              <button onClick={() => navigate("/student/exam")}
                className="px-5 py-3.5 border border-white/20 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "submitted") {
    return (
      <div className="h-full flex items-center justify-center bg-[#0f1117] px-6">
        <div className="max-w-lg w-full bg-[#1a1e28] border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Examination Submitted!</h2>
          <p className="text-white/50 mb-6 text-sm">Your responses have been saved successfully. Results will be declared on 25 October 2026.</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#C8902B]">{score}/{totalMarks}</div>
              <div className="text-white/40 text-xs">Score</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-amber-400">{marked}</div>
              <div className="text-white/40 text-xs">Marked</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-white/30">{questions.length - answered}</div>
              <div className="text-white/40 text-xs">Skipped</div>
            </div>
          </div>
          <button onClick={() => navigate("/student")} className="w-full bg-[#8B1A1A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#5C0F0F] transition-colors">
            Return to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const isLow = timeLeft < 600;

  return (
    <div className="h-full flex bg-[#0f1117] overflow-hidden">
      {/* Main exam area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Exam header */}
        <div className="bg-[#1a1e28] border-b border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="text-sm text-white/60">
            <span className="text-white font-semibold">Q {current + 1}</span> / {questions.length}
            <span className="ml-4 text-white/40">Section: <span className="text-[#C8902B]">{q.section}</span></span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono font-bold text-lg ${isLow ? "bg-red-900/50 text-red-300 animate-pulse" : "bg-white/5 text-white"}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-white/40">Auto-save: Active</div>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start gap-3 mb-8">
              <span className="w-8 h-8 rounded-lg bg-[#8B1A1A]/30 text-[#C8902B] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                {current + 1}
              </span>
              <p className="text-white text-lg leading-relaxed">{q.text}</p>
            </div>

            <div className="space-y-3 mb-8">
              {q.options.map((opt, i) => {
                const label = ["A", "B", "C", "D"][i];
                const selected = answers[current] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(current, i)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all border ${
                      selected
                        ? "bg-[#8B1A1A]/40 border-[#8B1A1A] text-white"
                        : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      selected ? "bg-[#8B1A1A] text-white" : "bg-white/10 text-white/50"
                    }`}>{label}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="px-5 py-2.5 border border-white/20 text-white/60 rounded-lg text-sm disabled:opacity-40 hover:bg-white/5 transition-colors"
              >
                ← Previous
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => markForReview(current)}
                  className="px-4 py-2.5 bg-amber-900/30 border border-amber-700/30 text-amber-400 rounded-lg text-sm hover:bg-amber-800/40 transition-colors"
                >
                  🔖 Mark for Review
                </button>
                <button
                  onClick={() => answers[current] !== undefined && setAnswers({ ...answers })}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 text-white/50 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  Clear
                </button>
              </div>
              <button
                onClick={() => current === questions.length - 1 ? setShowConfirm(true) : setCurrent(current + 1)}
                className="px-5 py-2.5 bg-[#8B1A1A] text-white rounded-lg text-sm hover:bg-[#5C0F0F] transition-colors font-semibold"
              >
                {current === questions.length - 1 ? "Submit Exam →" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="w-64 bg-[#1a1e28] border-l border-white/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <div className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Question Status</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Answered", count: answered, color: "bg-[#8B1A1A]" },
              { label: "Marked", count: marked, color: "bg-amber-600" },
              { label: "Not Answered", count: Object.keys(statuses).length - answered, color: "bg-red-900/60" },
              { label: "Not Visited", count: notVisited, color: "bg-white/10" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${s.color}`} />
                <span className="text-white/40">{s.label}: <span className="text-white">{s.count}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Navigate</div>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((_, i) => {
              const st = statuses[i];
              const isAnswered = answers[i] !== undefined;
              return (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-full aspect-square rounded text-xs font-semibold transition-all ${
                    i === current ? "ring-2 ring-[#C8902B]" : ""
                  } ${
                    st === "marked" ? "bg-amber-600 text-white" :
                    isAnswered ? "bg-[#8B1A1A] text-white" :
                    st ? "bg-red-900/60 text-white/60" :
                    "bg-white/10 text-white/40 hover:bg-white/20"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-[#8B1A1A] hover:bg-[#5C0F0F] text-white py-3 rounded-xl font-bold text-sm transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1e28] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-white font-bold text-lg mb-2">Submit Examination?</h3>
            <p className="text-white/50 text-sm mb-4">
              You have answered <strong className="text-white">{answered}</strong> of {questions.length} questions.
              Once submitted, you cannot change your answers.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setPhase("submitted")}
                className="flex-1 bg-[#8B1A1A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#5C0F0F] transition-colors">
                Yes, Submit
              </button>
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 border border-white/20 text-white/60 py-3 rounded-xl text-sm hover:bg-white/5 transition-colors">
                Continue Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
