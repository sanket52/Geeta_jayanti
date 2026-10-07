import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPublishedQuestions, subscribeToQuestions } from "../../lib/questionStore";

export default function StudentExamination() {
  const [questions, setQuestions] = useState(getPublishedQuestions);

  useEffect(() => subscribeToQuestions(() => setQuestions(getPublishedQuestions())), []);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Examination</h1>

      {/* MCQ Exam */}
      <div className="bg-cream border-2 border-gold/20 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">MCQ Examination</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-brown mt-1">Vedic Knowledge Competition 2026</h2>
          </div>
          <span className="bg-saffron/10 text-saffron text-xs font-bold px-3 py-1 rounded-full">Upcoming</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[["Date", "15 Oct 2026"], ["Time", "10:00 AM"], ["Duration", "2 Hours"], ["Questions", `${questions.length} Published`]].map(([k, v]) => (
            <div key={k} className="bg-cream-dark rounded-xl p-3 text-center">
              <div className="text-xs text-brown-mid">{k}</div>
              <div className="font-bold text-brown text-sm mt-0.5">{v}</div>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-4">
          <strong>Instructions:</strong> Questions are synchronized directly from the Admin ERP question bank. Ensure a stable internet connection and do not refresh or navigate away during the exam.
        </div>
        <Link
          to="/competition/exam"
          className="block w-full text-center bg-maroon hover:bg-maroon-dark text-cream py-3.5 rounded-xl font-semibold transition-colors"
        >
          Enter MCQ Examination Portal →
        </Link>
      </div>

      {/* Oral Exam */}
      <div className="bg-cream border-2 border-maroon/15 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-semibold text-brown-mid uppercase tracking-wider">Oral / Video Examination</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-brown mt-1">Oral Response Submission</h2>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Open Now</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[["Date Window", "18–20 Oct"], ["Format", "Video Upload"], ["Duration", "Up to 5 min"], ["Evaluated by", "Examiner"]].map(([k, v]) => (
            <div key={k} className="bg-cream-dark rounded-xl p-3 text-center">
              <div className="text-xs text-brown-mid">{k}</div>
              <div className="font-bold text-brown text-sm mt-0.5">{v}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-brown-mid mb-5">
          You will be presented a Sanskrit question/prompt and must record a video response using your
          camera and microphone. Videos are stored securely and evaluated only by authorized examiners.
          You have one retake before final submission.
        </p>
        <Link
          to="/student/oral-exam"
          className="block w-full text-center bg-gradient-to-r from-maroon to-maroon-dark hover:from-maroon-dark hover:to-brown text-cream py-3.5 rounded-xl font-semibold transition-all"
        >
          🎥 Enter Oral Examination →
        </Link>
      </div>
    </div>
  );
}
