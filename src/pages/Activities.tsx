import { Link } from "react-router";

const activities = [
  { number: "01", title: "Daily Veda Path", body: "Guided recitation with precise swara, mantra meaning, memorisation, and personal correction from Acharyas.", schedule: "Daily · 5:30 AM" },
  { number: "02", title: "Sanskrit Sambhashan", body: "Conversation circles, storytelling, vocabulary games, and public speaking that make Sanskrit a living language.", schedule: "Tuesday & Thursday" },
  { number: "03", title: "Yoga & Pranayama", body: "Age-appropriate asana, breathwork, meditation, and wellbeing practices for focus, discipline, and balance.", schedule: "Daily · 6:30 AM" },
  { number: "04", title: "Yajna & Anushthan", body: "Students learn the meaning, preparation, pronunciation, and responsible practice of traditional Vedic rituals.", schedule: "Wednesday & Sunday" },
  { number: "05", title: "Shastra Charcha", body: "Mentored discussions on the Vedas, Upanishads, Vedangas, and Indian philosophy with practical reflection.", schedule: "Saturday Scholar Forum" },
  { number: "06", title: "Gau Seva & Nature Care", body: "Service activities develop compassion through campus care, gardening, conservation, and responsible stewardship.", schedule: "Weekly Seva Hour" },
  { number: "07", title: "Music & Shloka Recitation", body: "Classical rhythm, devotional music, group chanting, and stage presentation strengthen expression and confidence.", schedule: "Friday Cultural Sabha" },
  { number: "08", title: "Leadership & Life Skills", body: "Team projects, peer mentoring, event responsibility, and communication practice prepare students to lead with values.", schedule: "Monthly Workshop" },
];

export default function Activities() {
  return (
    <div>
      <section className="bg-maroon-dark text-cream py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">Life at the Gurukul</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl lg:text-5xl font-bold mt-3 mb-5 max-w-3xl">
            Learning beyond the classroom
          </h1>
          <p className="text-cream/70 leading-relaxed max-w-2xl">
            Our daily programme combines Vedic study, Sanskrit, wellbeing, service, culture, and leadership to nurture
            knowledgeable, compassionate, and confident students.
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activities.map((activity) => (
              <article key={activity.title} className="bg-cream-dark border border-gold/20 rounded-2xl p-6 flex gap-5 hover:border-gold/50 hover:shadow-lg transition-all">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-maroon text-gold flex items-center justify-center font-bold">{activity.number}</div>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-maroon mb-2">{activity.title}</h2>
                  <p className="text-sm text-brown-mid leading-relaxed mb-3">{activity.body}</p>
                  <span className="text-xs font-semibold text-gold uppercase tracking-wide">{activity.schedule}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream-dark">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">A Balanced Day</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-brown mt-2">The Gurukul daily rhythm</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["05:30", "Veda Path & Prayer"],
              ["06:30", "Yoga & Pranayama"],
              ["09:00", "Academic Learning"],
              ["16:00", "Seva, Sports & Sabha"],
            ].map(([time, label]) => (
              <div key={time} className="bg-cream border border-gold/20 rounded-xl p-5 text-center">
                <p className="text-2xl font-bold text-maroon">{time}</p>
                <p className="text-sm text-brown-mid mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-maroon text-cream">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold">Experience Gurukul life</h2>
            <p className="text-sm text-cream/70 mt-2">Contact our team to learn about programmes, schedules, and participation.</p>
          </div>
          <Link to="/contact" className="shrink-0 px-6 py-3 bg-gold text-brown font-semibold rounded hover:bg-gold-light transition-colors text-sm">
            Contact the Gurukul
          </Link>
        </div>
      </section>
    </div>
  );
}
