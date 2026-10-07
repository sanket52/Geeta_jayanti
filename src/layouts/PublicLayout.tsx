import { useState } from "react";
import { Outlet, Link, NavLink, useLocation, useNavigate } from "react-router";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/donate", label: "Donation" },
  { to: "/contact", label: "Contact" },
];

const discoverLinks = [
  { to: "/about", label: "About Gurukul", description: "Our heritage, vision, and faculty" },
  { to: "/activities", label: "Activities", description: "Daily learning, culture, yoga, and seva" },
  { to: "/competitions", label: "Competitions", description: "Events, eligibility, and exam formats" },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const discoverActive = discoverLinks.some((link) => location.pathname === link.to);

  return (
    <div className="min-h-full flex flex-col bg-cream">
      {/* Top bar */}
      <div className="bg-maroon-dark text-cream text-xs py-1.5 px-4 flex justify-between items-center">
        <span className="opacity-80">ॐ तत् सत् — Maharshi Panini Ved Vedang Vidhyapeeth Gurukul</span>
        <div className="flex gap-4">
          <a href="tel:+919876543210" className="opacity-80 hover:opacity-100 transition-opacity">📞 +91 98765 43210</a>
          <a href="mailto:info@gurukul.edu" className="opacity-80 hover:opacity-100 transition-opacity">✉ info@gurukul.edu</a>
        </div>
      </div>

      {/* Main navbar */}
      <header className="bg-cream border-b-2 border-gold sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-maroon flex items-center justify-center text-cream text-xl font-bold shadow-md group-hover:bg-maroon-dark transition-colors">
              ॐ
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)" }} className="text-maroon font-bold text-sm leading-tight">
                Maharshi Panini
              </div>
              <div style={{ fontFamily: "var(--font-display)" }} className="text-gold text-xs font-medium leading-tight">
                Ved Vedang Vidhyapeeth Gurukul
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded transition-colors ${
                  isActive ? "text-maroon bg-cream-dark" : "text-brown hover:text-maroon hover:bg-cream-dark"
                }`
              }
            >
              Home
            </NavLink>
            <div className="relative group">
              <button
                className={`px-3 py-2 text-sm font-medium rounded transition-colors flex items-center gap-1.5 ${
                  discoverActive ? "text-maroon bg-cream-dark" : "text-brown hover:text-maroon hover:bg-cream-dark"
                }`}
              >
                Discover
                <span className="text-xs transition-transform group-hover:rotate-180 group-focus-within:rotate-180">⌄</span>
              </button>
              <div className="absolute left-0 top-full pt-2 w-72 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all">
                <div className="bg-cream border border-cream-dark rounded-xl shadow-xl p-2">
                  {discoverLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 transition-colors ${
                          isActive ? "bg-cream-dark text-maroon" : "text-brown hover:bg-cream-dark"
                        }`
                      }
                    >
                      <span className="block text-sm font-semibold">{link.label}</span>
                      <span className="block text-xs text-brown-mid mt-0.5">{link.description}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            {navLinks.slice(1).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded transition-colors ${
                    isActive
                      ? "text-maroon bg-cream-dark"
                      : "text-brown hover:text-maroon hover:bg-cream-dark"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-semibold text-maroon border-2 border-maroon rounded hover:bg-maroon hover:text-cream transition-all"
            >
              Student Login
            </button>
            <button
              onClick={() => navigate("/admin/login")}
              className="px-4 py-2 text-sm font-semibold bg-maroon text-cream rounded hover:bg-maroon-dark transition-all"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-maroon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-cream border-t border-cream-dark px-4 py-4 flex flex-col gap-2">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-brown hover:text-maroon">
              Home
            </NavLink>
            <div className="border-y border-cream-dark py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-1">Discover</p>
              {discoverLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 pl-3 text-sm font-medium border-l-2 ${
                      isActive ? "border-maroon text-maroon" : "border-cream-dark text-brown hover:text-maroon"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            {navLinks.slice(1).map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-brown hover:text-maroon">
                {link.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2 border-t border-cream-dark">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 py-2 text-center text-sm font-semibold text-maroon border-2 border-maroon rounded">
                Student Login
              </Link>
              <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="flex-1 py-2 text-center text-sm font-semibold bg-maroon text-cream rounded">
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-maroon-dark text-cream">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-maroon-dark text-lg font-bold">ॐ</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)" }} className="font-bold text-sm">Maharshi Panini</div>
                  <div className="text-gold text-xs">Ved Vedang Vidhyapeeth Gurukul</div>
                </div>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                Preserving and propagating the ancient wisdom of Vedic and Sanskrit education through modern means.
              </p>
              <div className="flex gap-3 mt-4">
                {["facebook", "twitter", "youtube", "instagram"].map((s) => (
                  <a key={s} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-maroon-dark transition-all text-xs font-bold capitalize">
                    {s[0].toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {[["Home", "/"], ["About Gurukul", "/about"], ["Activities", "/activities"], ["Competitions", "/competitions"], ["Register", "/register"], ["Donate", "/donate"]].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm opacity-70 hover:opacity-100 hover:text-gold transition-all">
                      → {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Portals</h4>
              <ul className="space-y-2">
                {[["Student Login", "/login"], ["Student Registration", "/register"], ["Admin Login", "/admin/login"], ["Competition Exam", "/competition/exam"], ["Certificate Verify", "/verify"]].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm opacity-70 hover:opacity-100 hover:text-gold transition-all">
                      → {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3 text-sm opacity-70">
                <li className="flex gap-2">
                  <span className="text-gold mt-0.5">📍</span>
                  <span>Greater Noida, Gautam Buddha Nagar, Uttar Pradesh — 201310</span>
                </li>
                <li>📞 +91 98765 43210</li>
                <li>✉ info@gurukul.edu</li>
                <li>🌐 www.gurukul.edu</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
            <span>© 2026 Maharshi Panini Ved Vedang Vidhyapeeth Gurukul. All rights reserved.</span>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:opacity-80">Privacy Policy</Link>
              <Link to="/terms" className="hover:opacity-80">Terms & Conditions</Link>
              <Link to="/contact" className="hover:opacity-80">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
