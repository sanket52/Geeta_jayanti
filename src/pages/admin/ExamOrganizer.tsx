import { useState } from "react";

type ExamStatus = "Scheduled" | "Check-in Open" | "Live" | "Completed";

const sessions = [
  { time: "09:00 AM", name: "Junior Sanskrit", candidates: 4, room: "Hall A", status: "Check-in Open" as ExamStatus },
  { time: "11:30 AM", name: "Senior Vedic Studies", candidates: 4, room: "Hall B", status: "Scheduled" as ExamStatus },
  { time: "02:30 PM", name: "Open Indian Culture", candidates: 4, room: "Hall C", status: "Scheduled" as ExamStatus },
];

const readiness = [
  { label: "Question paper", detail: "100 questions · Version 4", ready: true },
  { label: "Candidate verification", detail: "7 of 12 approved", ready: true },
  { label: "Proctor allocation", detail: "2 of 3 assigned", ready: false },
  { label: "Backup server", detail: "Synced 2 minutes ago", ready: true },
];

export default function ExamOrganizer() {
  const [sessionStatuses, setSessionStatuses] = useState<ExamStatus[]>(sessions.map((session) => session.status));
  const [activeSession, setActiveSession] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [sentAnnouncement, setSentAnnouncement] = useState("");

  const updateStatus = (status: ExamStatus) => {
    setSessionStatuses((current) => current.map((item, index) => index === activeSession ? status : item));
  };

  const sendAnnouncement = () => {
    const message = announcement.trim();
    if (!message) return;
    setSentAnnouncement(message);
    setAnnouncement("");
  };

  const activeStatus = sessionStatuses[activeSession];
  const statusStyles: Record<ExamStatus, string> = {
    Scheduled: "bg-cream-dark text-brown-mid",
    "Check-in Open": "bg-gold/15 text-gold",
    Live: "bg-green-100 text-green-700",
    Completed: "bg-maroon/10 text-maroon",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Examination Operations</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown mt-1">Exam Organizer</h1>
          <p className="text-sm text-brown-mid">Schedule, launch, monitor, and close every examination from one workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-brown-mid">15 October 2026</span>
          <button className="px-4 py-2 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">
            Create Exam Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ["Testing Records", "12", "Connected ERP students"],
          ["Checked in", "3", "Testing candidates"],
          ["Live now", activeStatus === "Live" ? "4" : "0", "Active attempts"],
          ["Support cases", "2", "1 needs attention"],
        ].map(([label, value, detail]) => (
          <div key={label} className="bg-cream border border-cream-dark rounded-xl p-4">
            <p className="text-xs text-brown-mid mb-2">{label}</p>
            <p className="text-2xl font-bold text-maroon">{value}</p>
            <p className="text-xs text-brown-light mt-1">{detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-cream border border-cream-dark rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-cream-dark flex items-center justify-between">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown">Today&apos;s Sessions</h2>
              <p className="text-xs text-brown-mid mt-1">Select a session to manage its live controls.</p>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">Systems Operational</span>
          </div>
          <div className="divide-y divide-cream-dark">
            {sessions.map((session, index) => (
              <button
                key={session.name}
                onClick={() => setActiveSession(index)}
                className={`w-full text-left px-6 py-4 grid grid-cols-2 md:grid-cols-[90px_1fr_110px_130px] gap-3 items-center transition-colors ${
                  activeSession === index ? "bg-gold/10 border-l-4 border-gold" : "hover:bg-cream-dark/40 border-l-4 border-transparent"
                }`}
              >
                <span className="text-sm font-semibold text-maroon">{session.time}</span>
                <span>
                  <span className="block text-sm font-semibold text-brown">{session.name}</span>
                  <span className="block text-xs text-brown-mid">{session.candidates.toLocaleString()} candidates · {session.room}</span>
                </span>
                <span className="text-xs text-brown-mid">120 minutes</span>
                <span className={`justify-self-start text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[sessionStatuses[index]]}`}>
                  {sessionStatuses[index]}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 bg-cream-dark/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-brown-light font-semibold">Selected Session</p>
                <h3 className="font-semibold text-brown mt-1">{sessions[activeSession].name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => updateStatus("Check-in Open")} className="px-3 py-2 text-xs font-semibold border border-gold text-gold rounded-lg hover:bg-gold/10 transition-colors">
                  Open Check-in
                </button>
                <button onClick={() => updateStatus("Live")} className="px-3 py-2 text-xs font-semibold bg-maroon text-cream rounded-lg hover:bg-maroon-dark transition-colors">
                  Start Examination
                </button>
                <button onClick={() => updateStatus("Completed")} className="px-3 py-2 text-xs font-semibold border border-maroon text-maroon rounded-lg hover:bg-maroon/5 transition-colors">
                  Close Session
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="bg-cream border border-cream-dark rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown">Readiness Check</h2>
              <span className="text-xs font-semibold text-gold">3 of 4 ready</span>
            </div>
            <div className="space-y-3">
              {readiness.map((item) => (
                <div key={item.label} className="flex gap-3 items-start">
                  <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.ready ? "bg-green-100 text-green-700" : "bg-gold/15 text-gold"
                  }`}>
                    {item.ready ? "✓" : "!"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brown">{item.label}</p>
                    <p className="text-xs text-brown-mid">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-maroon-dark text-cream rounded-2xl p-5">
            <h2 style={{ fontFamily: "var(--font-display)" }} className="font-bold">Candidate Announcement</h2>
            <p className="text-xs text-cream/60 mt-1 mb-4">Send an instruction to all candidates in the selected session.</p>
            <textarea
              value={announcement}
              onChange={(event) => setAnnouncement(event.target.value)}
              placeholder="Type an announcement..."
              rows={3}
              className="w-full bg-white/10 border border-white/15 rounded-lg p-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold resize-none"
            />
            <button onClick={sendAnnouncement} className="w-full mt-3 bg-gold text-brown rounded-lg py-2.5 text-sm font-semibold hover:bg-gold-light transition-colors">
              Send to Candidates
            </button>
            {sentAnnouncement && (
              <p className="mt-3 text-xs text-cream/70 border-t border-white/10 pt-3">
                Sent: {sentAnnouncement}
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
