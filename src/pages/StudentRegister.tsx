import { useState } from "react";
import { Link, useNavigate } from "react-router";
import OTPVerification from "../components/OTPVerification";
import { saveStudentRecord, type StudentRecord } from "../lib/studentRecord";
import { upsertStudentFromRecord } from "../lib/erpStore";

const REGISTRATION_NUMBER = "MPVVG-2026-000124";

function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read photograph"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Invalid image file"));
      image.onload = () => {
        const maxWidth = 480;
        const maxHeight = 600;
        const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

const STEPS = [
  "Basic Information",
  "Educational Details",
  "Identity & Documents",
  "Competition Selection",
  "Declaration & Submit",
];

const indianStates = [
  "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Gujarat", "Maharashtra",
  "Bihar", "Jharkhand", "Uttarakhand", "Himachal Pradesh", "Delhi",
  "Haryana", "Punjab", "Chhattisgarh", "Odisha", "West Bengal", "Other",
];

export default function StudentRegister() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [awaitingOTP, setAwaitingOTP] = useState(false);
  const navigate = useNavigate();

  const [basic, setBasic] = useState({
    fullName: "", fatherName: "", motherName: "", dob: "", gender: "", mobile: "", email: "",
    address: "", village: "", district: "", state: "", pinCode: "",
  });

  const [education, setEducation] = useState({
    school: "", classYear: "", board: "", passingYear: "", qualification: "", sanskritLevel: "", prevParticipation: "No",
  });

  const [competition, setCompetition] = useState({
    competition: "Vedic Knowledge Competition 2026", category: "Junior (10–14 years)", subject: "Sanskrit", language: "Hindi",
  });
  const [identity, setIdentity] = useState({
    idType: "Aadhaar Card",
    idReference: "",
    photo: "",
    photoName: "",
    educationalDocumentName: "",
  });

  const [agreed, setAgreed] = useState({ info: false, rules: false, privacy: false });

  const isStepValid = () => {
    if (step === 0) return basic.fullName && basic.fatherName && basic.dob && basic.gender && basic.mobile && basic.email && basic.state;
    if (step === 1) return education.school && education.board && education.qualification;
    if (step === 2) return identity.idReference.length === 4 && Boolean(identity.photo) && Boolean(identity.educationalDocumentName);
    if (step === 3) return competition.competition && competition.category;
    if (step === 4) return agreed.info && agreed.rules && agreed.privacy;
    return true;
  };

  const completeRegistration = () => {
    const record: StudentRecord = {
      registrationNumber: REGISTRATION_NUMBER,
      ...basic,
      ...education,
      ...competition,
      idType: identity.idType,
      idReference: identity.idReference,
      educationalDocumentName: identity.educationalDocumentName,
      photo: identity.photo,
      examDate: "15 October 2026",
      examTime: "10:00 AM – 12:00 PM",
      examMode: "Online Proctored Examination",
      rollNumber: "VK26-JR-00124",
      certificateNumber: "MPVVG-CERT-2026-00124",
    };
    saveStudentRecord(record);
    upsertStudentFromRecord(record);
    setAwaitingOTP(false);
    setSubmitted(true);
  };

  /* OTP gate: triggered when step 4 (Declaration) is submitted */
  if (awaitingOTP) {
    return (
      <OTPVerification
        email={basic.email || "your-email@example.com"}
        purpose="registration"
        onVerified={completeRegistration}
        onBack={() => setAwaitingOTP(false)}
      />
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
        <div className="bg-cream border-2 border-gold/40 rounded-2xl p-10 max-w-lg w-full text-center shadow-xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-maroon mb-2">Registration Successful!</h2>
          <p className="text-brown-mid mb-6 text-sm leading-relaxed">
            Congratulations! Your registration has been submitted successfully.
            Your unique registration number is:
          </p>
          <div className="bg-maroon text-cream rounded-xl py-4 px-6 mb-6">
            <div className="text-xs text-gold/80 mb-1">Registration Number</div>
            <div style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold tracking-wider">{REGISTRATION_NUMBER}</div>
          </div>
          <div className="bg-cream-dark rounded-xl p-4 text-sm text-left space-y-2 mb-6">
            <div className="flex justify-between"><span className="text-brown-mid">Name</span><span className="font-semibold text-brown">{basic.fullName || "Ravi Kumar Sharma"}</span></div>
            <div className="flex justify-between"><span className="text-brown-mid">Competition</span><span className="font-semibold text-brown">{competition.competition}</span></div>
            <div className="flex justify-between"><span className="text-brown-mid">Category</span><span className="font-semibold text-brown">{competition.category}</span></div>
            <div className="flex justify-between"><span className="text-brown-mid">Exam Date</span><span className="font-semibold text-brown">15 October 2026</span></div>
            <div className="flex justify-between"><span className="text-brown-mid">Status</span><span className="text-amber-600 font-semibold">Under Verification</span></div>
          </div>
          <p className="text-xs text-brown-mid mb-6">A confirmation email with your login credentials and next steps has been sent to your registered email address.</p>
          <div className="flex gap-3">
            <button className="flex-1 bg-maroon text-cream py-3 rounded-xl font-semibold text-sm hover:bg-maroon-dark transition-colors">
              ⬇ Download Confirmation
            </button>
            <button onClick={() => navigate("/student/admit-card")} className="flex-1 border-2 border-maroon text-maroon py-3 rounded-xl font-semibold text-sm hover:bg-maroon/5 transition-colors">
              View Admit Card →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-dark py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-maroon text-cream flex items-center justify-center text-xl font-bold mx-auto mb-3">ॐ</div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Competition Registration</h1>
          <p className="text-sm text-brown-mid">Vedic Knowledge Competition 2026 • Maharshi Panini Ved Vedang Vidhyapeeth Gurukul</p>
        </div>

        {/* Progress */}
        <div className="bg-cream rounded-2xl border border-gold/20 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-brown-mid">Step {step + 1} of {STEPS.length}</span>
            <span className="text-xs font-semibold text-maroon">{STEPS[step]}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < step ? "bg-gold" : i === step ? "bg-maroon" : "bg-cream-dark"}`} />
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="bg-cream rounded-2xl border border-gold/20 p-8 shadow-sm mb-6">
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-brown mb-6 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-maroon text-cream text-sm flex items-center justify-center font-bold">{step + 1}</span>
            {STEPS[step]}
          </h2>

          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "fullName", label: "Full Name *", placeholder: "As per ID proof" },
                { key: "fatherName", label: "Father's Name *", placeholder: "Father's full name" },
                { key: "motherName", label: "Mother's Name", placeholder: "Mother's full name" },
                { key: "dob", label: "Date of Birth *", type: "date" },
                { key: "mobile", label: "Mobile Number *", placeholder: "+91 98765 43210", type: "tel" },
                { key: "email", label: "Email Address *", placeholder: "you@email.com", type: "email" },
                { key: "village", label: "Village / Town", placeholder: "Village or town name" },
                { key: "district", label: "District *", placeholder: "District" },
                { key: "pinCode", label: "PIN Code", placeholder: "456010", type: "number" },
              ].map(({ key, label, placeholder, type = "text" }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-brown-mid mb-1">{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={basic[key as keyof typeof basic]}
                    onChange={(e) => setBasic({ ...basic, [key]: e.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-brown-mid mb-1">Gender *</label>
                <select value={basic.gender} onChange={(e) => setBasic({ ...basic, gender: e.target.value })}
                  className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-mid mb-1">State *</label>
                <select value={basic.state} onChange={(e) => setBasic({ ...basic, state: e.target.value })}
                  className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                  <option value="">Select state</option>
                  {indianStates.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-brown-mid mb-1">Full Address</label>
                <textarea rows={2} placeholder="House/flat, street, area"
                  value={basic.address} onChange={(e) => setBasic({ ...basic, address: e.target.value })}
                  className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none resize-none" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "school", label: "School / College Name *", placeholder: "Institution name" },
                { key: "classYear", label: "Current Class / Year *", placeholder: "e.g. Class 10 / B.A. 2nd Year" },
                { key: "board", label: "Board / University *", placeholder: "e.g. CBSE, MP Board, University of Delhi" },
                { key: "passingYear", label: "Last Passing Year", placeholder: "2025", type: "number" },
              ].map(({ key, label, placeholder, type = "text" }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-brown-mid mb-1">{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={education[key as keyof typeof education]}
                    onChange={(e) => setEducation({ ...education, [key]: e.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-brown-mid mb-1">Educational Qualification *</label>
                <select value={education.qualification} onChange={(e) => setEducation({ ...education, qualification: e.target.value })}
                  className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                  <option value="">Select</option>
                  {["Below Class 8", "Class 8–9", "Class 10", "Class 11–12", "Undergraduate", "Postgraduate", "Other"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-mid mb-1">Sanskrit Education Level</label>
                <select value={education.sanskritLevel} onChange={(e) => setEducation({ ...education, sanskritLevel: e.target.value })}
                  className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                  <option value="">Select</option>
                  {["Beginner", "Prathama", "Madhyama", "Shastri", "Acharya", "Formal School Only"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-mid mb-1">Previous Competition Participation</label>
                <select value={education.prevParticipation} onChange={(e) => setEducation({ ...education, prevParticipation: e.target.value })}
                  className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                  <option>No</option><option>Yes — 1 time</option><option>Yes — 2+ times</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>🔒 Privacy Notice:</strong> The following information is collected only for identity verification as required by competition rules. Sensitive data is encrypted and never publicly displayed.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brown-mid mb-1">Government ID Type</label>
                  <select
                    value={identity.idType}
                    onChange={(event) => setIdentity({ ...identity, idType: event.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none"
                  >
                    <option>Aadhaar Card</option><option>School ID</option><option>Voter ID</option><option>Passport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown-mid mb-1">ID Reference / Last 4 digits</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={identity.idReference}
                    onChange={(event) => setIdentity({ ...identity, idReference: event.target.value.replace(/\D/g, "") })}
                    placeholder="Last 4 digits only"
                    className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div className="border-2 border-dashed border-cream-dark rounded-xl p-8 text-center">
                {identity.photo ? (
                  <img src={identity.photo} alt="Photograph preview" className="w-24 h-28 object-cover rounded-lg border-2 border-gold/40 mx-auto mb-3" />
                ) : (
                  <div className="text-3xl mb-2">📷</div>
                )}
                <div className="text-sm font-semibold text-brown mb-1">Upload Photograph</div>
                <div className="text-xs text-brown-mid mb-3">
                  {identity.photoName || "Recent passport-size photo • JPG/PNG • Max 2 MB"}
                </div>
                <label className="inline-flex px-4 py-2 bg-maroon text-cream text-xs font-semibold rounded hover:bg-maroon-dark transition-colors cursor-pointer">
                  {identity.photo ? "Change Photograph" : "Choose Photograph"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file || file.size > 2 * 1024 * 1024) return;
                      const photo = await resizePhoto(file);
                      setIdentity((current) => ({ ...current, photo, photoName: file.name }));
                    }}
                  />
                </label>
              </div>
              <div className="border-2 border-dashed border-cream-dark rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-sm font-semibold text-brown mb-1">Upload Educational Certificate</div>
                <div className="text-xs text-brown-mid mb-3">
                  {identity.educationalDocumentName || "Last passing certificate or school ID • PDF/JPG • Max 5 MB"}
                </div>
                <label className="inline-flex px-4 py-2 bg-maroon text-cream text-xs font-semibold rounded hover:bg-maroon-dark transition-colors cursor-pointer">
                  {identity.educationalDocumentName ? "Change Document" : "Choose Document"}
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file || file.size > 5 * 1024 * 1024) return;
                      setIdentity({ ...identity, educationalDocumentName: file.name });
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-cream-dark rounded-xl p-5 border border-gold/20">
                <h3 className="font-semibold text-brown mb-3 text-sm">Selected Competition</h3>
                <div className="bg-maroon text-cream rounded-lg px-4 py-3 flex justify-between items-center">
                  <span className="font-semibold">Vedic Knowledge Competition 2026</span>
                  <span className="text-gold text-xs">🟢 Open</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brown-mid mb-1">Category / Age Group *</label>
                  <select value={competition.category} onChange={(e) => setCompetition({ ...competition, category: e.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                    <option>Junior (10–14 years)</option>
                    <option>Senior (15–18 years)</option>
                    <option>Youth (19–25 years)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown-mid mb-1">Primary Subject</label>
                  <select value={competition.subject} onChange={(e) => setCompetition({ ...competition, subject: e.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                    <option>Sanskrit</option><option>Vedas</option><option>Indian Culture</option><option>General Knowledge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown-mid mb-1">Exam Language</label>
                  <select value={competition.language} onChange={(e) => setCompetition({ ...competition, language: e.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                    <option>Hindi</option><option>English</option><option>Sanskrit</option>
                  </select>
                </div>
              </div>
              <div className="bg-cream-dark rounded-xl p-5">
                <h4 className="text-sm font-semibold text-brown mb-3">Exam Format</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[["MCQ Questions", "100"], ["Duration", "2 hours"], ["Negative Marking", "¼ per wrong answer"], ["Oral Exam", "20 minutes video"], ["Total Marks", "120"], ["Passing Marks", "60"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between bg-cream rounded p-2">
                      <span className="text-brown-mid">{k}</span>
                      <span className="font-semibold text-brown">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-cream-dark rounded-xl p-5 text-sm space-y-2">
                <h3 className="font-semibold text-brown">Registration Summary</h3>
                {[
                  ["Name", basic.fullName || "Ravi Kumar Sharma"],
                  ["Email", basic.email || "ravi@example.com"],
                  ["Mobile", basic.mobile || "+91 98765 43210"],
                  ["State", basic.state || "Uttar Pradesh"],
                  ["Qualification", education.qualification || "Class 10"],
                  ["Competition", competition.competition],
                  ["Category", competition.category],
                  ["Subject", competition.subject],
                  ["Language", competition.language],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-cream-dark pb-2 last:border-0">
                    <span className="text-brown-mid">{k}</span>
                    <span className="font-medium text-brown">{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { key: "info", label: "I confirm that all information provided is true and correct to the best of my knowledge." },
                  { key: "rules", label: "I have read and agree to the Competition Rules and Code of Conduct." },
                  { key: "privacy", label: "I agree to the Privacy Policy and consent to the processing of my data for competition purposes." },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={agreed[key as keyof typeof agreed]}
                      onChange={(e) => setAgreed({ ...agreed, [key]: e.target.checked })}
                      className="mt-0.5 accent-maroon" />
                    <span className="text-sm text-brown-mid group-hover:text-brown transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-6 py-3 border-2 border-maroon text-maroon font-semibold rounded-xl text-sm disabled:opacity-40 hover:bg-maroon/5 transition-colors"
          >
            ← Previous
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => isStepValid() && setStep(step + 1)}
              className={`px-8 py-3 bg-maroon text-cream font-semibold rounded-xl text-sm transition-colors ${isStepValid() ? "hover:bg-maroon-dark" : "opacity-50 cursor-not-allowed"}`}
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => isStepValid() && setAwaitingOTP(true)}
              className={`px-8 py-3 bg-saffron text-cream font-semibold rounded-xl text-sm transition-colors ${isStepValid() ? "hover:bg-saffron-light" : "opacity-50 cursor-not-allowed"}`}
            >
              Submit Registration 🙏
            </button>
          )}
        </div>

        <p className="text-center text-xs text-brown-mid mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-maroon font-semibold hover:underline">Login to Student Portal →</Link>
        </p>
      </div>
    </div>
  );
}
