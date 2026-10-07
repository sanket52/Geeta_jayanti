import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authenticateAdmin, getAdminAccount, saveAdminSession } from "../lib/adminAuth";
import type { AdminSession } from "../lib/adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [error, setError] = useState("");
  const [pendingSession, setPendingSession] = useState<(AdminSession & { mobile: string }) | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otp, setOtp] = useState("");

  const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = mode === "password"
      ? authenticateAdmin(form.email, form.password)
      : getAdminAccount(form.email);
    if (!session) {
      setError(mode === "password" ? "Incorrect email or password, or this ERP account is inactive." : "No active ERP account was found for this email.");
      return;
    }
    if (mode === "password") {
      const { mobile: _, ...adminSession } = session;
      saveAdminSession(adminSession);
      navigate("/admin");
      return;
    }
    setPendingSession(session);
    setGeneratedOtp(createOtp());
    setOtp("");
  };

  const verifyOtp = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pendingSession || otp !== generatedOtp) {
      setError("Incorrect WhatsApp OTP. Please check the six-digit code.");
      return;
    }
    const { mobile: _, ...session } = pendingSession;
    saveAdminSession(session);
    navigate("/admin");
  };

  if (pendingSession) {
    const [name, domain] = pendingSession.email.split("@");
    const maskedEmail = `${name.slice(0, 2)}${"*".repeat(Math.max(2, name.length - 2))}@${domain}`;
    return (
      <div className="min-h-screen bg-brown flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-cream/10 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-gold/20 text-gold border border-gold/20 flex items-center justify-center font-bold text-xl mx-auto">@</div>
            <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-cream text-center mt-5">Email OTP Verification</h1>
            <p className="text-cream/60 text-sm text-center mt-2">A six-digit OTP was sent to {maskedEmail} for {pendingSession.name}.</p>
            <form onSubmit={verifyOtp} className="mt-6 space-y-4">
              <label className="block">
                <span className="block text-xs font-semibold text-cream/70 mb-1.5">Email OTP</span>
                <input
                  value={otp}
                  onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                  inputMode="numeric"
                  autoFocus
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-center tracking-widest text-lg text-cream focus:border-gold focus:outline-none"
                />
              </label>
              <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 text-center">
                <p className="text-xs text-gold">Testing OTP: <strong className="tracking-widest">{generatedOtp}</strong></p>
              </div>
              {error && <p className="text-xs text-red-300 bg-red-950/30 border border-red-400/20 rounded-lg p-3">{error}</p>}
              <button type="submit" className="w-full bg-gold hover:bg-gold-light text-brown py-3.5 rounded-xl font-bold text-sm">Verify & Open ERP</button>
            </form>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button onClick={() => { setGeneratedOtp(createOtp()); setError(""); }} className="text-xs text-gold hover:underline">Resend OTP</button>
              <button onClick={() => { setPendingSession(null); setError(""); }} className="text-xs text-cream/60 hover:text-cream">Change account</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-brown text-2xl font-bold mx-auto mb-3">ॐ</div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-cream">Admin ERP Login</h1>
          <p className="text-cream/50 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        <div className="bg-cream/10 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-2 bg-white/5 rounded-xl p-1 mb-6">
            <button type="button" onClick={() => { setMode("password"); setError(""); }} className={`py-2.5 rounded-lg text-xs font-semibold transition-colors ${mode === "password" ? "bg-gold text-brown" : "text-cream/60 hover:text-cream"}`}>Password Login</button>
            <button type="button" onClick={() => { setMode("otp"); setError(""); }} className={`py-2.5 rounded-lg text-xs font-semibold transition-colors ${mode === "otp" ? "bg-gold text-brown" : "text-cream/60 hover:text-cream"}`}>Email OTP</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-cream/70 mb-1.5">Admin Email</label>
              <input type="email" required placeholder="admin@gurukul.edu"
                value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-white/30 focus:border-gold focus:outline-none" />
            </div>
            {mode === "password" && <div>
              <label className="block text-xs font-semibold text-cream/70 mb-1.5">Password</label>
              <input type="password" required placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-white/30 focus:border-gold focus:outline-none" />
            </div>}
            {error && <p className="text-xs text-red-300 bg-red-950/30 border border-red-400/20 rounded-lg p-3">{error}</p>}
            <button type="submit"
              className="w-full bg-gold hover:bg-gold-light text-brown py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg">
              {mode === "password" ? "Login with Password" : "Send Email OTP"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-cream/40 text-xs">This login is monitored. Unauthorized access is prohibited.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-cream/50 text-sm hover:text-cream transition-colors">← Student Portal Login</Link>
        </div>
      </div>
    </div>
  );
}
