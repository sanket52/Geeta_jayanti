import { useState } from "react";
import { Link, useNavigate } from "react-router";
import OTPVerification from "../components/OTPVerification";
import { supabase } from "../lib/supabase";

type Tab = "password" | "otp" | "forgot";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("password");
  const [form, setForm] = useState({ credential: "", password: "" });
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!supabase) {
      setLoginError("Student sign-in is not configured yet. Connect Supabase Auth before logging in.");
      return;
    }
    if (!form.credential.includes("@")) {
      setLoginError("Use the email address registered to your student account.");
      return;
    }
    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.credential.trim().toLowerCase(),
      password: form.password,
    });
    if (error || !data.user) {
      setLoginError("Email or password is incorrect.");
      setLoginLoading(false);
      return;
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    if (profileError || profile?.role !== "student") {
      await supabase.auth.signOut();
      setLoginError("This account is not set up as a student account.");
      setLoginLoading(false);
      return;
    }
    navigate("/student");
  };

  const handleSendLoginOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail) return;
    setLoginError("");
    if (!supabase) {
      setLoginError("Email OTP sign-in is not configured yet. Connect Supabase Auth first.");
      return;
    }
    setOtpSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: otpEmail.trim().toLowerCase(),
      options: { shouldCreateUser: false },
    });
    setOtpSending(false);
    if (error) {
      setLoginError(error.message);
      return;
    }
    setOtpSent(true);
  };

  const verifyStudentOtpAccount = async () => {
    if (!supabase) throw new Error("Supabase Auth is not configured.");
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw new Error("The OTP could not sign you in. Please try again.");
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();
    if (error || profile?.role !== "student") {
      await supabase.auth.signOut();
      throw new Error("This account is not set up as a student account.");
    }
    navigate("/student");
  };

  /* OTP login flow */
  if (tab === "otp" && otpSent) {
    return (
      <OTPVerification
        email={otpEmail}
        purpose="login"
        useSupabaseAuth
        onVerified={verifyStudentOtpAccount}
        onBack={() => { setOtpSent(false); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-maroon text-cream flex items-center justify-center text-2xl font-bold mx-auto mb-3">ॐ</div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Student Portal Login</h1>
          <p className="text-sm text-brown-mid mt-1">Maharshi Panini Ved Vedang Vidhyapeeth Gurukul</p>
        </div>

        <div className="bg-cream rounded-2xl shadow-xl border border-gold/20 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-cream-dark">
            {([["password", "Password Login"], ["otp", "Email OTP"], ["forgot", "Forgot Password"]] as const).map(([t, label]) => (
              <button
                key={t}
                onClick={() => { setTab(t); setOtpSent(false); }}
                className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === t ? "bg-maroon text-cream" : "text-brown-mid hover:text-brown"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ── PASSWORD LOGIN ── */}
            {tab === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-brown-mid mb-1.5">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ravi@email.com  •  MPG-2026-000123"
                    value={form.credential}
                    onChange={(e) => setForm({ ...form, credential: e.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brown-mid mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <label className="flex items-center gap-2 text-brown-mid cursor-pointer">
                    <input type="checkbox" className="accent-maroon" /> Remember me
                  </label>
                  <button type="button" onClick={() => setTab("forgot")} className="text-maroon hover:underline font-medium">
                    Forgot Password?
                  </button>
                </div>
                {loginError && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{loginError}</p>}
                <button type="submit" disabled={loginLoading} className="w-full bg-maroon text-cream py-3.5 rounded-xl font-semibold text-sm hover:bg-maroon-dark transition-colors shadow-lg disabled:opacity-60">
                  Login to Portal →
                </button>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-cream-dark" />
                  <span className="text-xs text-brown-mid">or</span>
                  <div className="flex-1 h-px bg-cream-dark" />
                </div>

                <button
                  type="button"
                  onClick={() => setTab("otp")}
                  className="w-full border-2 border-maroon/30 text-maroon py-3 rounded-xl font-semibold text-sm hover:bg-maroon/5 hover:border-maroon transition-all"
                >
                  Login with OTP (Email)
                </button>

                <p className="text-center text-xs text-brown-mid">
                  Not registered?{" "}
                  <Link to="/register" className="text-maroon font-semibold hover:underline">Register for Competition</Link>
                </p>
              </form>
            )}

            {/* ── OTP LOGIN ── */}
            {tab === "otp" && !otpSent && (
              <form onSubmit={handleSendLoginOTP} className="space-y-5">
                <div className="bg-maroon/5 border border-maroon/10 rounded-xl p-4 text-sm text-brown-mid leading-relaxed">
                  Enter your registered email address and we will send a one-time password (OTP) to log in without a password.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brown-mid mb-1.5">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={otpSending}
                  className="w-full bg-maroon text-cream py-3.5 rounded-xl font-semibold text-sm hover:bg-maroon-dark transition-colors disabled:opacity-60"
                >
                  {otpSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" />
                      </svg>
                      Sending OTP…
                    </span>
                  ) : (
                    "Send OTP to Email →"
                  )}
                </button>
                <button type="button" onClick={() => setTab("password")} className="w-full text-sm text-brown-mid hover:text-brown transition-colors">
                  ← Login with Password
                </button>
              </form>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {tab === "forgot" && (
              <ForgotPasswordForm onBack={() => setTab("password")} />
            )}
          </div>
        </div>

        <div className="mt-6 bg-cream border border-cream-dark rounded-xl p-4 text-center">
          <p className="text-xs text-brown-mid">Are you an administrator?</p>
          <Link to="/admin/login" className="text-sm text-maroon font-semibold hover:underline">Admin Login Portal →</Link>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setStep("otp");
  };

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setPwError("Passwords do not match."); return; }
    setPwError("");
    setStep("done");
  };

  if (step === "otp") {
    return (
      <OTPVerification
        email={email}
        purpose="reset"
        onVerified={() => setStep("reset")}
        onBack={() => setStep("email")}
      />
    );
  }

  if (step === "otp") return null; // handled above as full-screen

  if (step === "reset") {
    return (
      <form onSubmit={resetPassword} className="space-y-4">
        <div className="text-center mb-2">
          <div className="text-2xl mb-1">🔑</div>
          <p className="text-sm font-semibold text-brown">Set New Password</p>
          <p className="text-xs text-brown-mid mt-0.5">Choose a strong password for your account.</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-brown-mid mb-1">New Password</label>
          <input type="password" required minLength={8} placeholder="Min. 8 characters"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brown-mid mb-1">Confirm Password</label>
          <input type="password" required placeholder="Re-enter password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none" />
        </div>
        {pwError && <p className="text-xs text-red-600">{pwError}</p>}
        <button type="submit" className="w-full bg-maroon text-cream py-3.5 rounded-xl font-semibold text-sm hover:bg-maroon-dark transition-colors">
          Reset Password →
        </button>
      </form>
    );
  }

  if (step === "done") {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-brown">Password Reset Successful!</h3>
        <p className="text-sm text-brown-mid">Your password has been updated. You can now log in with your new password.</p>
        <button onClick={onBack} className="w-full bg-maroon text-cream py-3.5 rounded-xl font-semibold text-sm hover:bg-maroon-dark transition-colors">
          Back to Login →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={sendReset} className="space-y-5">
      <div className="bg-maroon/5 border border-maroon/10 rounded-xl p-4 text-sm text-brown-mid leading-relaxed">
        Enter your registered email address. We will send a 6-digit OTP to reset your password.
      </div>
      <div>
        <label className="block text-xs font-semibold text-brown-mid mb-1.5">Registered Email Address</label>
        <input type="email" required placeholder="you@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none" />
      </div>
      <button type="submit" disabled={sending}
        className="w-full bg-maroon text-cream py-3.5 rounded-xl font-semibold text-sm hover:bg-maroon-dark transition-colors disabled:opacity-60">
        {sending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" />
            </svg>
            Sending OTP…
          </span>
        ) : "Send Reset OTP →"}
      </button>
      <button type="button" onClick={onBack} className="w-full text-sm text-brown-mid hover:text-brown transition-colors">
        ← Back to Login
      </button>
    </form>
  );
}
