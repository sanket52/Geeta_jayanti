import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

const HERO_IMAGE = "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=1600&h=900&fit=crop&auto=format";
const STUDENTS_IMAGE = "https://images.unsplash.com/photo-1692269725911-87697c558be1?w=800&h=600&fit=crop&auto=format";
const STUDENTS_IMAGE2 = "https://images.unsplash.com/photo-1692269725827-699e04a11cdf?w=800&h=600&fit=crop&auto=format";
const TEMPLE_IMAGE = "https://images.unsplash.com/photo-1603766806347-54cdf3745953?w=800&h=600&fit=crop&auto=format";
const TEMPLE_IMAGE2 = "https://images.unsplash.com/photo-1677434654722-69e7ba88b4ef?w=800&h=600&fit=crop&auto=format";

const stats = [
  { label: "Registered Students", value: 3847, suffix: "+" },
  { label: "Competitions Conducted", value: 24, suffix: "" },
  { label: "Students Participated", value: 12500, suffix: "+" },
  { label: "Awards Conferred", value: 680, suffix: "+" },
  { label: "Years of Service", value: 13, suffix: "" },
];

const notices = [
  {
    date: "05 Sep 2026",
    badge: "Important",
    title: "Vedic Knowledge Competition 2026 — Registration Open",
    body: "Registration for the annual Vedic Knowledge Competition is now open. Last date: 30 September 2026.",
  },
  {
    date: "01 Sep 2026",
    badge: "Exam",
    title: "Online MCQ Examination Schedule Released",
    body: "The schedule for MCQ examinations has been published. Admit cards will be available from 10 Oct 2026.",
  },
  {
    date: "28 Aug 2026",
    badge: "Notice",
    title: "New Sanskrit Study Material Available in Library",
    body: "Fresh Vedic texts and Sanskrit learning PDFs have been added to the digital library portal.",
  },
  {
    date: "20 Aug 2026",
    badge: "Result",
    title: "Sanskrit Saptah Competition 2026 Results Declared",
    body: "Results for Sanskrit Saptah Competition 2026 have been published. Download your certificate from the portal.",
  },
];

const gallery = [
  { src: STUDENTS_IMAGE, caption: "Students in Sanskrit Class", category: "Students" },
  { src: TEMPLE_IMAGE, caption: "Vedic Architecture", category: "Gurukul" },
  { src: STUDENTS_IMAGE2, caption: "Examination Session", category: "Events" },
  { src: TEMPLE_IMAGE2, caption: "Annual Convocation", category: "Events" },
  { src: STUDENTS_IMAGE, caption: "Group Study", category: "Students" },
  { src: TEMPLE_IMAGE, caption: "Cultural Activities", category: "Activities" },
];

const testimonials = [
  {
    name: "Smt. Sudha Mishra",
    role: "Parent, Prayagraj",
    text: "My son has transformed completely after joining the Gurukul. The blend of Vedic values and modern education is truly remarkable.",
    initial: "S",
  },
  {
    name: "Pandit Shyam Lal Sharma",
    role: "Sanskrit Teacher, Varanasi",
    text: "I have seen many educational institutions, but Maharshi Panini Ved Vedang Vidhyapeeth Gurukul stands apart in its commitment to authentic Sanskrit education.",
    initial: "P",
  },
  {
    name: "Arjun Kumar",
    role: "Student, Rank 1 — 2025 Competition",
    text: "Winning the Vedic Knowledge Competition changed my life. The examination platform is professional and the learning materials are excellent.",
    initial: "A",
  },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [activeGallery, setActiveGallery] = useState("All");

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 bg-brown">
          <img
            src={HERO_IMAGE}
            alt="Vedic temple architecture"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brown/90 via-maroon-dark/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Sanskrit decoration */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">Est. 2013 — Greater Noida, Uttar Pradesh</span>
            </div>

            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl lg:text-6xl font-bold text-cream leading-tight mb-4"
            >
              Maharshi Panini
              <br />
              <span className="text-gold">Ved Vedang Vidhyapeeth</span>
              <br />
              Gurukul
            </h1>

            <p
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl text-gold/80 italic mb-2"
            >
              ॐ सहनाववतु सहनौ भुनक्तु सह वीर्यं करवावहै
            </p>
            <p className="text-cream/60 text-sm mb-8">
              "May we be protected together, may we be nourished together, may we work together with great energy."
            </p>

            <p className="text-cream/80 text-lg leading-relaxed mb-10 max-w-xl">
              Preserving the eternal wisdom of the Vedas through traditional Sanskrit education,
              combined with the excellence of modern learning for a dharmic generation.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-saffron text-cream font-semibold rounded hover:bg-saffron-light transition-all text-sm shadow-lg shadow-saffron/30 hover:shadow-xl"
              >
                Register for Competition →
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 border-2 border-cream/50 text-cream font-semibold rounded hover:border-cream hover:bg-cream/10 transition-all text-sm"
              >
                Student Login
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 text-gold font-semibold hover:underline text-sm"
              >
                Learn More ↓
              </Link>
            </div>
          </div>

          {/* Floating competition card */}
          <div className="hidden lg:block">
            <div className="bg-cream rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border border-gold/30 max-w-sm ml-auto">
              <div className="bg-maroon px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gold uppercase tracking-widest">Upcoming Competition</span>
                  <span className="text-xs bg-saffron text-cream px-2 py-0.5 rounded-full font-semibold animate-pulse">Registration Open</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)" }} className="text-cream text-lg font-bold">
                  Vedic Knowledge Competition 2026
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  ["Registration Opens", "01 September 2026"],
                  ["Last Date", "30 September 2026"],
                  ["Examination Date", "15 October 2026"],
                  ["Eligibility", "Class 6 to Graduation"],
                  ["Subjects", "Sanskrit, Vedas, Indian Culture, GK"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-brown-mid font-medium">{label}</span>
                    <span className="text-brown font-semibold">{value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-cream-dark">
                  <div className="text-xs text-brown-mid mb-3">🏆 Prizes worth ₹5,00,000 — Medals, Certificates & Scholarships</div>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-maroon text-cream py-3 rounded font-semibold text-sm hover:bg-maroon-dark transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-cream/40 text-xs">
          <span>Scroll to explore</span>
          <div className="w-5 h-8 border border-cream/30 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-cream/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={STUDENTS_IMAGE}
              alt="Students studying"
              className="rounded-2xl w-full h-80 object-cover shadow-xl"
            />
            <img
              src={TEMPLE_IMAGE}
              alt="Gurukul"
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-xl object-cover shadow-xl border-4 border-cream"
            />
            <div className="absolute top-4 left-4 bg-maroon text-cream px-4 py-2 rounded text-sm font-semibold">
              Est. 2013
            </div>
          </div>

          <div className="pt-8 lg:pt-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">About Our Gurukul</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-brown leading-tight mb-6">
              Ancient Wisdom,
              <br /><span className="text-maroon">Modern Excellence</span>
            </h2>
            <p className="text-brown-mid leading-relaxed mb-4">
              Founded under the blessings of revered Vedic scholars, Maharshi Panini Ved Vedang Vidhyapeeth Gurukul
              is dedicated to propagating the knowledge of Vedas, Sanskrit grammar, and Indian scriptures
              in a structured and accessible manner.
            </p>
            <p className="text-brown-mid leading-relaxed mb-8">
              Our mission is to nurture students in the tradition of Maharshi Panini — the father of
              Sanskrit grammar — while equipping them with the skills for modern education and values
              grounded in dharmic living.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Vedic Education", icon: "📖", desc: "Rigveda, Samaveda, Yajurveda, Atharvaveda" },
                { label: "Sanskrit Grammar", icon: "✍", desc: "Ashtadhyayi, Mahabhashya, Nirukt" },
                { label: "Traditional Values", icon: "🪔", desc: "Dharma, Karma, Seva, Satya" },
                { label: "Modern Learning", icon: "💻", desc: "Digital resources & online exams" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 bg-cream-dark rounded-xl p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-brown">{item.label}</div>
                    <div className="text-xs text-brown-mid mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/about" className="inline-flex items-center gap-2 text-maroon font-semibold hover:gap-3 transition-all">
              Learn More About Us <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATISTICS ── */}
      <section className="py-16 bg-maroon">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Our Impact</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-cream mt-2">
              18 Years of Vedic Excellence
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-gold mb-2">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-cream/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPETITION CTA ── */}
      <section className="py-20 bg-cream-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-cream rounded-2xl shadow-xl overflow-hidden border border-gold/20">
            <div className="bg-gradient-to-r from-maroon to-maroon-dark text-cream px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">⭐ Featured Competition</div>
                <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold">Vedic Knowledge Competition 2026</h3>
                <p className="text-cream/70 text-sm mt-1">Maharshi Panini Ved Vedang Vidhyapeeth Gurukul — National Level</p>
              </div>
              <div className="shrink-0">
                <span className="bg-saffron text-cream px-4 py-2 rounded-full text-sm font-semibold">
                  🟢 Registration Open
                </span>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-brown text-sm uppercase tracking-wide">Important Dates</h4>
                {[
                  ["Registration Start", "01 Sep 2026"],
                  ["Registration Last Date", "30 Sep 2026"],
                  ["Admit Card", "10 Oct 2026"],
                  ["Examination", "15 Oct 2026"],
                  ["Result Declaration", "25 Oct 2026"],
                ].map(([label, date]) => (
                  <div key={label} className="flex justify-between text-sm border-b border-cream-dark pb-2">
                    <span className="text-brown-mid">{label}</span>
                    <span className="text-brown font-semibold">{date}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-brown text-sm uppercase tracking-wide">Eligibility & Subjects</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-cream-dark rounded p-3">
                    <div className="font-medium text-brown mb-1">Age Groups</div>
                    <div className="text-brown-mid text-xs">Junior (10–14 yrs) • Senior (15–18 yrs) • Youth (19–25 yrs)</div>
                  </div>
                  <div className="bg-cream-dark rounded p-3">
                    <div className="font-medium text-brown mb-1">Subjects</div>
                    <div className="text-brown-mid text-xs">Sanskrit • Vedas • Indian Culture • Astronomy • General Knowledge</div>
                  </div>
                  <div className="bg-cream-dark rounded p-3">
                    <div className="font-medium text-brown mb-1">Exam Mode</div>
                    <div className="text-brown-mid text-xs">Online MCQ + Oral/Video Examination</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-brown text-sm uppercase tracking-wide">Prize Information</h4>
                <div className="space-y-3">
                  {[
                    { rank: "🥇 Rank 1", prize: "₹50,000 + Gold Medal + Certificate" },
                    { rank: "🥈 Rank 2", prize: "₹30,000 + Silver Medal" },
                    { rank: "🥉 Rank 3", prize: "₹20,000 + Bronze Medal" },
                    { rank: "🏅 Rank 4–10", prize: "₹5,000 + Merit Certificate" },
                    { rank: "📜 Participants", prize: "Participation Certificate" },
                  ].map(({ rank, prize }) => (
                    <div key={rank} className="text-sm">
                      <div className="font-semibold text-brown">{rank}</div>
                      <div className="text-brown-mid text-xs">{prize}</div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/register"
                  className="block w-full text-center bg-maroon hover:bg-maroon-dark text-cream py-3 rounded-lg font-semibold text-sm transition-colors mt-4"
                >
                  Register Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTICE BOARD ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-10 bg-gold" />
                <span className="text-gold text-xs font-semibold uppercase tracking-widest">Latest Updates</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-brown">Notice Board</h2>
            </div>
            <Link to="/about" className="text-maroon text-sm font-semibold hover:underline">View All →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice, i) => (
              <div
                key={i}
                className="flex gap-4 bg-cream border border-cream-dark rounded-xl p-5 hover:border-gold/40 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-lg bg-maroon/10 flex flex-col items-center justify-center shrink-0 group-hover:bg-maroon/20 transition-colors">
                  <span className="text-maroon text-xs font-bold leading-none">{notice.date.split(" ")[0]}</span>
                  <span className="text-maroon-light text-[10px]">{notice.date.split(" ")[1]}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      notice.badge === "Important" ? "bg-red-100 text-red-700" :
                      notice.badge === "Exam" ? "bg-blue-100 text-blue-700" :
                      notice.badge === "Result" ? "bg-green-100 text-green-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {notice.badge}
                    </span>
                    <span className="text-[10px] text-brown-light">{notice.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-brown mb-1 leading-snug group-hover:text-maroon transition-colors">{notice.title}</h4>
                  <p className="text-xs text-brown-mid leading-relaxed">{notice.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-20 bg-maroon-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Glimpses</span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-cream mt-2">Photo Gallery</h2>
          </div>

          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {["All", "Students", "Gurukul", "Events", "Activities"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveGallery(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeGallery === cat
                    ? "bg-gold text-brown"
                    : "bg-white/10 text-cream/70 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery
              .filter((g) => activeGallery === "All" || g.category === activeGallery)
              .map((item, i) => (
                <div key={i} className="relative group overflow-hidden rounded-xl bg-brown">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-52 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <div className="text-xs text-gold font-semibold">{item.category}</div>
                      <div className="text-cream text-sm font-medium">{item.caption}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center gap-3 justify-center mb-2">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">Testimonials</span>
              <div className="h-px w-10 bg-gold" />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-brown">Words of Honour</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-cream border border-cream-dark rounded-2xl p-6 hover:border-gold/40 hover:shadow-lg transition-all">
                <div className="text-gold text-4xl font-serif mb-4">"</div>
                <p className="text-brown-mid text-sm leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maroon text-cream flex items-center justify-center font-bold">
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-brown">{t.name}</div>
                    <div className="text-xs text-brown-mid">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DONATION CTA ── */}
      <section className="py-16 bg-gradient-to-r from-maroon to-maroon-dark text-cream text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">Support Vedic Education</span>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold mt-2 mb-4">
            Contribute to Our Sacred Mission
          </h2>
          <p className="text-cream/70 mb-8 leading-relaxed">
            Your donation helps us provide free and subsidized education to deserving students from rural
            India, preserve ancient Sanskrit manuscripts, and conduct national-level Vedic competitions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/donate" className="px-8 py-3.5 bg-gold hover:bg-gold-light text-brown font-semibold rounded transition-all shadow-lg">
              Donate Now 🙏
            </Link>
            <Link to="/about" className="px-8 py-3.5 border-2 border-cream/40 text-cream hover:bg-cream/10 rounded transition-all font-semibold">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
