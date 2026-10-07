import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import { clearAdminSession, getAdminSession } from "../lib/adminAuth";

const sidebarGroups = [
  {
    label: "Overview",
    links: [
      { to: "/admin", label: "Dashboard", icon: "⊞", end: true },
      { to: "/admin/statistics", label: "Statistics", icon: "📈" },
    ],
  },
  {
    label: "Students",
    links: [
      { to: "/admin/students", label: "All Students", icon: "👥" },
      { to: "/admin/students", label: "Registrations", icon: "📋" },
      { to: "/admin/students", label: "Verification", icon: "✅" },
    ],
  },
  {
    label: "Competitions",
    links: [
      { to: "/admin/competitions", label: "Competitions", icon: "🏆" },
      { to: "/admin/exam-organizer", label: "Exam Organizer", icon: "✍" },
      { to: "/admin/questions", label: "Questions", icon: "❓" },
      { to: "/admin/competitions", label: "Oral Exams", icon: "🎥" },
    ],
  },
  {
    label: "Results",
    links: [
      { to: "/admin/results", label: "Results & Certificates", icon: "📊" },
    ],
  },
  {
    label: "Finance",
    links: [
      { to: "/admin/students", label: "Donations", icon: "💰" },
      { to: "/admin/students", label: "Receipts", icon: "🧾" },
    ],
  },
  {
    label: "Content",
    links: [
      { to: "/admin/notices", label: "Notices", icon: "📢" },
      { to: "/admin/notices", label: "Gallery", icon: "🖼" },
      { to: "/admin/notices", label: "Library", icon: "📚" },
    ],
  },
  {
    label: "System",
    links: [
      { to: "/admin/staff", label: "Teachers & Roles", icon: "🔐" },
      { to: "/admin/students", label: "Audit Logs", icon: "📜" },
      { to: "/admin/students", label: "Exports", icon: "⬇" },
      { to: "/admin/students", label: "Settings", icon: "⚙" },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [session] = useState(getAdminSession);
  const navigate = useNavigate();
  const visibleGroups = session.isSuperAdmin
    ? sidebarGroups
    : sidebarGroups
        .map((group) => ({ ...group, links: group.links.filter((link) => session.allowedPaths.some((path) => link.to === path || (path === "/admin" && link.to === "/admin"))) }))
        .filter((group) => group.links.length > 0);

  return (
    <div className="min-h-full flex bg-cream">
      <aside className={`${sidebarOpen ? "w-60" : "w-14"} transition-all duration-200 bg-brown text-cream flex flex-col shrink-0 overflow-hidden`}>
        <div className="h-16 flex items-center gap-3 px-3 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-brown font-bold text-sm shrink-0">ॐ</div>
          {sidebarOpen && (
            <div className="overflow-hidden flex-1">
              <div style={{ fontFamily: "var(--font-display)" }} className="text-sm font-bold leading-tight">Admin ERP</div>
              <div className="text-gold text-xs opacity-80">{session.role}</div>
            </div>
          )}
          <button className="ml-auto text-white/40 hover:text-white shrink-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mb-1">
              {sidebarOpen && (
                <div className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gold/60">
                  {group.label}
                </div>
              )}
              {group.links.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-xs transition-all ${
                      isActive
                        ? "bg-gold/20 text-gold border-r-2 border-gold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <span className="text-sm shrink-0 w-5 text-center">{link.icon}</span>
                  {sidebarOpen && <span className="truncate">{link.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0">
          <button
            onClick={() => { clearAdminSession(); navigate("/admin/login"); }}
            className="flex items-center gap-3 text-xs text-white/50 hover:text-red-300 transition-colors w-full"
          >
            <span className="w-5 text-center">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-cream border-b-2 border-gold flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 style={{ fontFamily: "var(--font-display)" }} className="text-maroon font-semibold text-lg">Admin ERP</h1>
            <p className="text-xs text-brown-light">Maharshi Panini Ved Vedang Vidhyapeeth Gurukul</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-brown-mid">
              <span className="font-medium">{session.name}</span>
              <span className="ml-2 text-xs bg-maroon text-cream px-2 py-0.5 rounded">{session.role}</span>
            </div>
            <Link to="/" className="text-sm text-brown-mid hover:text-maroon">← Public Site</Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
