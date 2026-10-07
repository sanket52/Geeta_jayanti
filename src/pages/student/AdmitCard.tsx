import { useEffect, useState } from "react";
import { downloadAdmitCardPdf } from "../../lib/documentPdf";
import { createVerificationUrl, getStudentRecord } from "../../lib/studentRecord";

export default function AdmitCard() {
  const [record] = useState(getStudentRecord);
  const [qrCode, setQrCode] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(createVerificationUrl("admit-card", record), { margin: 1, width: 240 }).then(setQrCode)
    );
  }, [record]);

  const download = async () => {
    setDownloading(true);
    try {
      await downloadAdmitCardPdf(record);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Admit Card</h1>
          <p className="text-sm text-brown-mid">Your details were automatically generated from your verified registration.</p>
        </div>
        <button
          onClick={download}
          disabled={downloading}
          className="px-6 py-3 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark disabled:opacity-60 transition-colors"
        >
          {downloading ? "Preparing PDF..." : "Download Admit Card PDF"}
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm flex items-start gap-3">
        <span className="font-bold">✓</span>
        <p>Admit card issued successfully. No editing is required. Download the PDF and carry it with a valid photo ID.</p>
      </div>

      <section className="bg-cream border-2 border-gold rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-maroon-dark text-cream text-center px-6 py-6 border-b-4 border-gold">
          <p style={{ fontFamily: "var(--font-display)" }} className="text-xl md:text-2xl font-bold">Maharshi Panini Ved Vedang Vidhyapeeth Gurukul</p>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mt-2">Official Examination Admit Card</p>
          <p className="text-cream/70 text-sm mt-2">{record.competition}</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[128px_1fr_112px] gap-6 items-start pb-6 border-b border-cream-dark">
            <div className="w-32 h-40 bg-cream-dark border-2 border-gold/40 rounded-lg overflow-hidden flex items-center justify-center">
              {record.photo ? (
                <img src={record.photo} alt={record.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-maroon font-bold text-3xl">{record.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                ["Candidate Name", record.fullName],
                ["Registration Number", record.registrationNumber],
                ["Roll Number", record.rollNumber],
                ["Father's Name", record.fatherName],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-brown-light uppercase tracking-wide">{label}</p>
                  <p className="font-semibold text-brown mt-1">{value}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              {qrCode && <img src={qrCode} alt="Admit card verification QR code" className="w-28 h-28 mx-auto border border-cream-dark rounded" />}
              <p className="text-xs text-brown-mid mt-2">Scan to verify</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 py-6">
            {[
              ["Category", record.category],
              ["Subject", record.subject],
              ["Language", record.language],
              ["Date of Birth", record.dob],
              ["Exam Date", record.examDate],
              ["Exam Time", record.examTime],
              ["Exam Mode", record.examMode],
              ["Status", "Verified & Issued"],
            ].map(([label, value]) => (
              <div key={label} className="bg-cream-dark rounded-lg p-3">
                <p className="text-xs text-brown-light">{label}</p>
                <p className="text-sm font-semibold text-brown mt-1">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end mb-6">
            <div className="w-full sm:w-64 border-2 border-dashed border-gold/50 rounded-xl p-4 text-center bg-cream-dark/50">
              <div className="h-12 border-b border-brown-mid mb-2" />
              <p className="text-xs font-semibold text-brown">Candidate Signature</p>
              <p className="text-xs text-brown-light mt-1">Sign inside the box before verification</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-maroon text-cream text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">Important</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-maroon">Examination Instructions</p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-brown-mid leading-5">
              <li><strong className="text-maroon">Photo ID required:</strong> Carry this admit card with a valid original photo ID.</li>
              <li><strong className="text-maroon">Report 30 minutes early:</strong> Late entry may not be permitted.</li>
              <li><strong className="text-maroon">Candidate signature:</strong> Sign only in the designated box before verification.</li>
              <li><strong className="text-maroon">QR verification:</strong> Keep the QR code clear, complete, and undamaged.</li>
              <li><strong className="text-maroon">No prohibited items:</strong> Phones, notes, smartwatches, and calculators are not allowed.</li>
              <li><strong className="text-maroon">Follow invigilator instructions:</strong> Unfair means will result in disqualification.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
