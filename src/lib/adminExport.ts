import type { ErpStudent } from "./erpStore";

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const escape = (value: string | number) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };
  const content = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadStudentsPdf(students: ErpStudent[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const headers = ["Registration", "Name", "State", "Category", "Status", "Written", "Oral", "Result", "Certificate"];
  const widths = [35, 38, 28, 24, 20, 28, 28, 22, 24];
  const startX = 10;

  const drawHeader = () => {
    doc.setFillColor(92, 15, 15);
    doc.rect(0, 0, 297, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Maharshi Panini Ved Vedang Vidhyapeeth Gurukul", 10, 9);
    doc.setFontSize(9);
    doc.text(`Complete Student ERP Export · ${students.length} records`, 10, 16);
    doc.setFillColor(242, 228, 204);
    doc.rect(10, 27, 277, 9, "F");
    doc.setTextColor(44, 21, 8);
    doc.setFontSize(7);
    let x = startX;
    headers.forEach((header, index) => {
      doc.text(header, x + 1, 33);
      x += widths[index];
    });
  };

  drawHeader();
  let y = 42;
  students.forEach((student, rowIndex) => {
    if (y > 190) {
      doc.addPage();
      drawHeader();
      y = 42;
    }
    if (rowIndex % 2 === 0) {
      doc.setFillColor(253, 246, 238);
      doc.rect(10, y - 5, 277, 10, "F");
    }
    const values = [
      student.id,
      student.name,
      student.state,
      student.category,
      student.status,
      `${student.writtenExamStatus} ${student.writtenScore}`,
      `${student.oralExamStatus} ${student.oralScore}`,
      student.resultStatus,
      student.certificateStatus,
    ];
    doc.setTextColor(44, 21, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    let x = startX;
    values.forEach((value, index) => {
      doc.text(doc.splitTextToSize(value, widths[index] - 2)[0] || "", x + 1, y);
      x += widths[index];
    });
    y += 10;
  });

  doc.setFontSize(7);
  doc.setTextColor(107, 66, 38);
  doc.text("Generated from the connected Admin ERP testing dataset.", 148.5, 204, { align: "center" });
  doc.save("all-students-erp-data.pdf");
}
