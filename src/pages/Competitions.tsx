import { Link } from "react-router";

const competitions = [
  {
    category: "Flagship National Event",
    title: "Vedic Knowledge Competition 2026",
    body: "A comprehensive assessment of the Vedas, Vedangas, Sanskrit, Indian culture, philosophy, and general knowledge.",
    eligibility: "Junior, Senior & Open",
    format: "Online MCQ + Oral Exam",
    date: "15–20 October 2026",
    prize: "Scholarships, medals, and certificates",
  },
  {
    category: "Language Festival",
    title: "Sanskrit Saptah",
    body: "Seven days of speech, essay writing, storytelling, shloka recitation, and rapid Sanskrit grammar challenges.",
    eligibility: "Classes 5–12",
    format: "Online + Campus Events",
    date: "12–18 August 2026",
    prize: "Books, trophies, and certificates",
  },
  {
    category: "Young Scholars",
    title: "Junior Sanskrit Olympiad",
    body: "An age-appropriate national assessment that builds confidence and identifies emerging Sanskrit talent.",
    eligibility: "Ages 10–16",
    format: "Proctored Online Exam",
    date: "22 November 2026",
    prize: "Mentorship and merit awards",
  },
];

export default function Competitions() {
  return (
    <div>
      <section className="bg-maroon-dark text-cream py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">Learn · Compete · Excel</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl lg:text-5xl font-bold mt-3 mb-5 max-w-3xl">
            Competitions for the next generation of scholars
          </h1>
          <p className="text-cream/70 leading-relaxed max-w-2xl">
            Secure, fair, and accessible examinations give learners across India a trusted platform to demonstrate
            knowledge, receive recognition, and continue their scholarly journey.
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {competitions.map((competition, index) => (
              <article key={competition.title} className="bg-cream border border-cream-dark rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-xl transition-all">
                <div className={`h-2 ${index === 0 ? "bg-maroon" : index === 1 ? "bg-gold" : "bg-saffron"}`} />
                <div className="p-6">
                  <span className="text-gold text-xs font-semibold uppercase tracking-wider">{competition.category}</span>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-brown mt-3 mb-3">{competition.title}</h2>
                  <p className="text-sm text-brown-mid leading-relaxed mb-6">{competition.body}</p>
                  <dl className="space-y-3 border-t border-cream-dark pt-4 text-sm">
                    {[
                      ["Eligibility", competition.eligibility],
                      ["Format", competition.format],
                      ["Date", competition.date],
                      ["Recognition", competition.prize],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <dt className="text-brown-light">{label}</dt>
                        <dd className="font-medium text-brown text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream-dark">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Simple & Transparent</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-brown mt-2">How the competition works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              ["01", "Register", "Choose a competition, category, subject, and examination language."],
              ["02", "Get Verified", "Documents are reviewed and the admit card is issued online."],
              ["03", "Take the Exam", "Complete the secure MCQ and oral examination stages."],
              ["04", "Earn Recognition", "View results and download verified certificates from your portal."],
            ].map(([number, title, body]) => (
              <div key={number} className="bg-cream border border-gold/20 rounded-xl p-5">
                <span className="text-2xl font-bold text-gold">{number}</span>
                <h3 className="font-semibold text-maroon mt-4 mb-2">{title}</h3>
                <p className="text-xs text-brown-mid leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-maroon text-cream">
        <div className="max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Registration Open</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold mt-2">Vedic Knowledge Competition 2026</h2>
            <p className="text-sm text-cream/70 mt-2">Last date to register: 30 September 2026</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="px-6 py-3 border border-cream/40 text-cream font-semibold rounded hover:bg-white/10 transition-colors text-sm">
              Student Login
            </Link>
            <Link to="/register" className="px-6 py-3 bg-gold text-brown font-semibold rounded hover:bg-gold-light transition-colors text-sm">
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
