import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", subject: "", message: "" });

  return (
    <div>
      <section className="bg-maroon-dark text-cream py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">Get In Touch</span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold mt-2 mb-3">Contact Us</h1>
          <p className="text-cream/70">We are here to answer your questions about admissions, competitions, and Vedic education.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-cream border-2 border-gold/30 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-brown mb-2">Message Sent!</h3>
              <p className="text-brown-mid text-sm mb-6">We have received your message and will respond within 24–48 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", mobile: "", subject: "", message: "" }); }}
                className="bg-maroon text-cream px-6 py-2.5 rounded font-semibold text-sm hover:bg-maroon-dark transition-colors">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="bg-cream border border-cream-dark rounded-2xl p-8 shadow-sm">
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-brown mb-6">Send Us a Message</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { key: "name", label: "Full Name *", placeholder: "Your name" },
                  { key: "email", label: "Email *", placeholder: "you@email.com", type: "email" },
                  { key: "mobile", label: "Mobile", placeholder: "+91 98765 43210", type: "tel" },
                  { key: "subject", label: "Subject *", placeholder: "How can we help?" },
                ].map(({ key, label, placeholder, type = "text" }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-brown-mid mb-1">{label}</label>
                    <input type={type} placeholder={placeholder} required={label.includes("*")}
                      value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none" />
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium text-brown-mid mb-1">Message *</label>
                <textarea rows={5} required placeholder="Write your message..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-cream-dark rounded-lg px-4 py-3 text-sm text-brown focus:border-gold focus:outline-none resize-none" />
              </div>
              <button type="submit" className="w-full bg-maroon text-cream py-3.5 rounded-xl font-semibold hover:bg-maroon-dark transition-colors">
                Send Message →
              </button>
            </form>
          )}
        </div>

        <div className="space-y-5">
          {[
            { icon: "📍", title: "Address", body: "Greater Noida, Gautam Buddha Nagar\nUttar Pradesh — 201310" },
            { icon: "📞", title: "Phone", body: "+91 98765 43210\n+91 73500 XXXXX" },
            { icon: "✉", title: "Email", body: "info@gurukul.edu\nadmissions@gurukul.edu" },
            { icon: "🕐", title: "Office Hours", body: "Monday to Saturday\n9:00 AM — 5:00 PM IST" },
          ].map((item) => (
            <div key={item.title} className="bg-cream-dark rounded-xl p-5 border border-gold/20">
              <div className="flex gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-brown text-sm mb-1">{item.title}</div>
                  <div className="text-brown-mid text-xs leading-relaxed whitespace-pre-line">{item.body}</div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-maroon text-cream rounded-xl p-5">
            <h4 className="font-semibold mb-3 text-sm">For Specific Enquiries</h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li>🎓 Admissions: admissions@gurukul.edu</li>
              <li>📝 Competitions: competition@gurukul.edu</li>
              <li>📚 Library: library@gurukul.edu</li>
              <li>💰 Donations: donate@gurukul.edu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
