import { Link } from "react-router";

const teachers = [
  { name: "Pandit Ramakrishna Tripathi", role: "Principal & Head of Vedas", exp: "35 years", initial: "R" },
  { name: "Dr. Savita Shastri", role: "Sanskrit Grammar (Vyakaran)", exp: "22 years", initial: "S" },
  { name: "Acharya Suresh Pandey", role: "Vedic Mathematics & Astronomy", exp: "28 years", initial: "A" },
  { name: "Dr. Meena Mishra", role: "Indian Philosophy & Culture", exp: "18 years", initial: "M" },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-maroon-dark text-cream py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">About Us</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold mt-2 mb-4">
            Our Sacred Heritage & Mission
          </h1>
          <p className="text-cream/70 leading-relaxed">
            Founded in 2013 in Greater Noida, Uttar Pradesh, under the guidance of revered Sanskrit scholars, our Gurukul carries forward
            the 5000-year-old tradition of Vedic learning in a modern, accessible form.
          </p>
        </div>
      </section>

      {/* History & Vision */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {[
            {
              icon: "📜",
              title: "Our History",
              body: "Maharshi Panini Ved Vedang Vidhyapeeth Gurukul was established in 2013 by dedicated Sanskrit scholars and social workers in Greater Noida, Uttar Pradesh, with the vision of making authentic Vedic education accessible to every learner.",
            },
            {
              icon: "👁",
              title: "Our Vision",
              body: "To create a global center of excellence for Vedic and Sanskrit education where traditional wisdom and modern knowledge converge to produce scholars who are both spiritually grounded and professionally capable.",
            },
            {
              icon: "🎯",
              title: "Our Mission",
              body: "To preserve and propagate the authentic knowledge of the Vedas, Vedangas, Sanskrit grammar and Indian philosophy through structured education, competitions, and accessible digital learning resources.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-cream-dark rounded-2xl p-8 border border-gold/20">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-maroon mb-3">
                {item.title}
              </h3>
              <p className="text-brown-mid leading-relaxed text-sm">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vedic Education */}
      <section className="py-20 bg-maroon text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Curriculum</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold mt-2">
              Vedic Education Framework
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Rigveda", icon: "🔥", desc: "Hymns to the Divine" },
              { name: "Samaveda", icon: "🎵", desc: "Songs & Melodies" },
              { name: "Yajurveda", icon: "🙏", desc: "Ritual Formulas" },
              { name: "Atharvaveda", icon: "💫", desc: "Knowledge of Life" },
              { name: "Vyakaran", icon: "📝", desc: "Sanskrit Grammar" },
              { name: "Jyotish", icon: "⭐", desc: "Vedic Astrology" },
            ].map((v) => (
              <div key={v.name} className="text-center bg-white/10 rounded-xl p-5 hover:bg-white/15 transition-colors">
                <div className="text-3xl mb-2">{v.icon}</div>
                <div className="font-semibold text-gold text-sm mb-1">{v.name}</div>
                <div className="text-cream/60 text-xs">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Faculty</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-brown mt-2">Our Respected Teachers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((t) => (
              <div key={t.name} className="bg-cream border border-cream-dark rounded-2xl p-6 text-center hover:border-gold/40 hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-full bg-maroon text-cream flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {t.initial}
                </div>
                <h4 className="font-semibold text-brown mb-1">{t.name}</h4>
                <p className="text-sm text-maroon font-medium mb-2">{t.role}</p>
                <p className="text-xs text-brown-mid">{t.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-cream-dark">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-brown mb-8">
            Our Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🏆", title: "National Recognition", body: "Awarded 'Best Vedic Institution' by Sanskrit Bharati, New Delhi — 2024" },
              { icon: "📚", title: "Digital Library", body: "Over 2,000 Sanskrit texts and Vedic manuscripts digitized and made freely available" },
              { icon: "🌏", title: "Global Reach", body: "Students from 18 states and 5 countries have participated in our competitions" },
            ].map((a) => (
              <div key={a.title} className="bg-cream rounded-xl p-6 border border-gold/20">
                <div className="text-4xl mb-3">{a.icon}</div>
                <h4 style={{ fontFamily: "var(--font-display)" }} className="font-semibold text-brown mb-2">{a.title}</h4>
                <p className="text-sm text-brown-mid">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-maroon-dark text-center text-cream">
        <div className="max-w-xl mx-auto px-6">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold mb-4">Join Our Community</h3>
          <p className="text-cream/70 mb-6 text-sm">Register for our competition or support our mission through donation.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="px-6 py-3 bg-saffron text-cream font-semibold rounded hover:bg-saffron-light transition-all text-sm">
              Register Now
            </Link>
            <Link to="/donate" className="px-6 py-3 border-2 border-cream/40 text-cream font-semibold rounded hover:bg-cream/10 transition-all text-sm">
              Donate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
