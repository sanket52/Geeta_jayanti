import { useEffect, useState } from "react";
import { downloadCertificatePdf } from "../../lib/documentPdf";
import { createVerificationUrl, getStudentRecord } from "../../lib/studentRecord";
import { getErpStudents, subscribeToErp } from "../../lib/erpStore";

export default function Certificate() {
  const [record] = useState(getStudentRecord);
  const [qrCode, setQrCode] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [issued, setIssued] = useState(() => getErpStudents().find((student) => student.id === record.registrationNumber)?.certificateStatus === "Issued");

  useEffect(() => {
    import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(createVerificationUrl("certificate", record), { margin: 1, width: 240 }).then(setQrCode)
    );
  }, [record]);

  useEffect(() => subscribeToErp(() => {
    setIssued(getErpStudents().find((student) => student.id === record.registrationNumber)?.certificateStatus === "Issued");
  }), [record.registrationNumber]);

  const download = async () => {
    setDownloading(true);
    try {
      await downloadCertificatePdf(record);
    } finally {
      setDownloading(false);
    }
  };

  if (!issued) {
    return (
      <div className="max-w-2xl mx-auto bg-cream border border-cream-dark rounded-2xl p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center font-bold text-xl mx-auto">C</div>
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown mt-5">Certificate Not Yet Issued</h1>
        <p className="text-sm text-brown-mid mt-3">An authorized teacher must publish your result and issue the certificate from Admin ERP before it can be downloaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">My Certificate</h1>
          <p className="text-sm text-brown-mid">Official digital certificate generated from your registration and examination record.</p>
        </div>
        <button
          onClick={download}
          disabled={downloading}
          className="px-6 py-3 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark disabled:opacity-60 transition-colors"
        >
          {downloading ? "Preparing PDF..." : "Download Certificate PDF"}
        </button>
      </div>

      <section className="bg-cream border-4 border-maroon p-2 shadow-xl">
        <div className="border-2 border-gold min-h-128 px-8 py-10 text-center relative">
          <div className="bg-maroon-dark text-cream py-5 px-6">
            <p style={{ fontFamily: "var(--font-display)" }} className="text-xl md:text-2xl font-bold">Maharshi Panini Ved Vedang Vidhyapeeth Gurukul</p>
            <p className="text-gold text-xs tracking-widest uppercase mt-2">Greater Noida, Uttar Pradesh</p>
          </div>

          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl md:text-5xl font-bold text-maroon mt-10">Certificate of Achievement</p>
          <p className="text-brown-mid italic mt-6">This certificate is proudly presented to</p>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl md:text-4xl font-bold text-brown mt-4 border-b-2 border-gold inline-block px-12 pb-2">
            {record.fullName}
          </p>
          <p className="text-brown-mid mt-6">for successfully participating in and completing</p>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-xl md:text-2xl font-bold text-maroon mt-3">{record.competition}</p>
          <p className="text-sm text-brown-mid mt-3">{record.category} · {record.subject} · Session 2026</p>
          <div className="max-w-3xl mx-auto mt-6 text-sm text-brown-mid leading-7">
            <p>
              This honour is awarded in recognition of the candidate&apos;s sincere dedication, disciplined preparation,
              and successful demonstration of knowledge in Vedic studies, Sanskrit, and Indian cultural heritage.
            </p>
            <p className="mt-2">
              The Gurukul commends this achievement and extends its best wishes for continued learning,
              exemplary character, and future scholarly excellence.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 items-end mt-10">
            <div className="border-t border-brown pt-2">
              <p className="font-semibold text-brown text-sm">30 October 2026</p>
              <p className="text-xs text-brown-mid mt-1">Date of Issue</p>
            </div>
            <div className="border-t border-brown pt-2">
              <p className="font-semibold text-brown text-sm">Examination Controller</p>
              <p className="text-xs text-brown-mid mt-1">Authorized Office</p>
            </div>
            <div className="flex items-end justify-center gap-3">
              <div>
                {qrCode && <img src={qrCode} alt="Certificate verification QR code" className="w-20 h-20 border border-cream-dark" />}
                <p className="text-xs text-brown-mid mt-1">Scan to verify</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-brown-light mt-6">Certificate No: {record.certificateNumber}</p>
        </div>
      </section>
    </div>
  );
}
