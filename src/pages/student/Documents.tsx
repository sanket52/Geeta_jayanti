import { useState } from "react";
import { Link } from "react-router";
import { downloadParticipationReceiptPdf, downloadRegistrationConfirmationPdf } from "../../lib/documentPdf";
import { getStudentRecord } from "../../lib/studentRecord";

export default function StudentDocuments() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState("");
  const record = getStudentRecord();

  const downloadDocument = async (name: string) => {
    setDownloading(name);
    setDownloadError("");
    try {
      if (name === "Registration Confirmation") await downloadRegistrationConfirmationPdf(record);
      if (name === "Competition Participation Receipt") await downloadParticipationReceiptPdf(record);
    } catch {
      setDownloadError("The PDF could not be generated. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const docs = [
    { name: "Registration Confirmation", type: "PDF", size: "245 KB", date: "05 Sep 2026", status: "available", icon: "📋", to: "" },
    { name: "Admit Card", type: "PDF", size: "Auto-generated", date: "10 Oct 2026", status: "available", icon: "🪪", to: "/student/admit-card" },
    { name: "Competition Participation Receipt", type: "PDF", size: "156 KB", date: "05 Sep 2026", status: "available", icon: "🧾", to: "" },
    { name: "Examination Result", type: "PDF", size: "—", date: "25 Oct 2026", status: "pending", icon: "📊", to: "" },
    { name: "Merit Certificate", type: "PDF", size: "Auto-generated", date: "30 Oct 2026", status: "available", icon: "🏅", to: "/student/certificate" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">My Documents</h1>
      {downloadError && <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{downloadError}</div>}

      <div className="bg-cream border border-cream-dark rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-cream-dark bg-cream-dark/50">
          <p className="text-sm text-brown-mid">All your official documents are available here for download. Documents become available as your examination progresses.</p>
        </div>
        <div className="divide-y divide-cream-dark">
          {docs.map((doc) => (
            <div key={doc.name} className="flex items-center gap-4 p-5 hover:bg-cream-dark/30 transition-colors">
              <span className="text-3xl">{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-brown text-sm">{doc.name}</div>
                <div className="text-xs text-brown-mid mt-0.5">{doc.type} • {doc.size} • Available: {doc.date}</div>
              </div>
              {doc.status === "available" ? (
                doc.to ? (
                  <Link to={doc.to} className="px-4 py-2 bg-maroon text-cream text-xs font-semibold rounded-lg hover:bg-maroon-dark transition-colors shrink-0">
                    Open & Download
                  </Link>
                ) : (
                  <button onClick={() => void downloadDocument(doc.name)} disabled={downloading !== null} className="px-4 py-2 bg-maroon text-cream text-xs font-semibold rounded-lg hover:bg-maroon-dark transition-colors shrink-0 disabled:opacity-60">
                    {downloading === doc.name ? "Preparing PDF…" : "Download"}
                  </button>
                )
              ) : (
                <span className="px-4 py-2 bg-cream-dark text-brown-light text-xs font-semibold rounded-lg shrink-0">
                  Not Yet Available
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
