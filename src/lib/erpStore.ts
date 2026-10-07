import { getStudentRecord, saveStudentRecord, type StudentRecord } from "./studentRecord";

export const ERP_STUDENTS_KEY = "mpvvg_erp_students_v2";
export const ERP_UPDATED_EVENT = "mpvvg:erp-updated";

export type ErpStudentStatus = "Pending" | "Approved" | "Rejected";

export type ErpStudent = {
  id: string;
  name: string;
  fatherName: string;
  state: string;
  district: string;
  category: string;
  subject: string;
  status: ErpStudentStatus;
  date: string;
  email: string;
  mobile: string;
  dob: string;
  writtenExamStatus: "Not Started" | "Submitted";
  writtenScore: string;
  oralExamStatus: "Not Started" | "Submitted" | "Evaluated";
  oralScore: string;
  resultStatus: "Draft" | "Published";
  certificateStatus: "Not Issued" | "Issued";
  lastUpdated: string;
};

const testStudents: ErpStudent[] = [
  ["MPVVG-2026-000123", "Ravi Kumar Sharma", "Shri Ram Kumar Sharma", "Uttar Pradesh", "Varanasi", "Junior", "Sanskrit", "Approved", "01 Sep 2026", "ravi.sharma@example.com", "+91 94XXX XXXXX", "12 Mar 2012"],
  ["MPVVG-2026-000568", "Anjali Tiwari", "Ramesh Tiwari", "Uttar Pradesh", "Lucknow", "Junior", "Sanskrit", "Pending", "07 Sep 2026", "anjali@example.com", "+91 98765 41001", "14 May 2013"],
  ["MPVVG-2026-000567", "Suresh Pandey", "Mohan Pandey", "Madhya Pradesh", "Indore", "Senior", "Vedas", "Approved", "07 Sep 2026", "suresh@example.com", "+91 98765 41002", "22 Jan 2010"],
  ["MPVVG-2026-000566", "Priya Sharma", "Dinesh Sharma", "Bihar", "Patna", "Junior", "Sanskrit", "Pending", "07 Sep 2026", "priya@example.com", "+91 98765 41003", "09 Aug 2012"],
  ["MPVVG-2026-000565", "Karan Mishra", "Rajiv Mishra", "Rajasthan", "Jaipur", "Youth", "Indian Culture", "Approved", "06 Sep 2026", "karan@example.com", "+91 98765 41004", "18 Nov 2005"],
  ["MPVVG-2026-000564", "Divya Yadav", "Mahesh Yadav", "Delhi", "New Delhi", "Senior", "Vedas", "Rejected", "06 Sep 2026", "divya@example.com", "+91 98765 41005", "04 Apr 2009"],
  ["MPVVG-2026-000563", "Rahul Gupta", "Sanjay Gupta", "Gujarat", "Ahmedabad", "Junior", "Sanskrit", "Approved", "05 Sep 2026", "rahul@example.com", "+91 98765 41006", "26 Feb 2013"],
  ["MPVVG-2026-000562", "Sita Devi", "Arun Kumar", "Uttar Pradesh", "Varanasi", "Senior", "Vedas", "Pending", "05 Sep 2026", "sita@example.com", "+91 98765 41007", "11 Jul 2010"],
  ["MPVVG-2026-000561", "Amit Shukla", "Vinod Shukla", "Madhya Pradesh", "Bhopal", "Youth", "Indian Culture", "Approved", "04 Sep 2026", "amit@example.com", "+91 98765 41008", "30 Dec 2004"],
  ["MPVVG-2026-000560", "Neha Joshi", "Pradeep Joshi", "Uttarakhand", "Haridwar", "Junior", "Vedangas", "Approved", "04 Sep 2026", "neha@example.com", "+91 98765 41009", "16 Jun 2012"],
  ["MPVVG-2026-000559", "Rohit Verma", "Ashok Verma", "Haryana", "Gurugram", "Senior", "Sanskrit", "Pending", "03 Sep 2026", "rohit@example.com", "+91 98765 41010", "08 Oct 2009"],
  ["MPVVG-2026-000558", "Meera Nair", "Vijay Nair", "Maharashtra", "Pune", "Youth", "Vedas", "Approved", "03 Sep 2026", "meera@example.com", "+91 98765 41011", "21 Mar 2005"],
  ["MPVVG-2026-000557", "Aditya Singh", "Rakesh Singh", "Uttar Pradesh", "Noida", "Junior", "Indian Culture", "Approved", "02 Sep 2026", "aditya@example.com", "+91 98765 41012", "12 Dec 2012"],
].map(([id, name, fatherName, state, district, category, subject, status, date, email, mobile, dob]) => ({
  id,
  name,
  fatherName,
  state,
  district,
  category,
  subject,
  status: status as ErpStudentStatus,
  date,
  email,
  mobile,
  dob,
  writtenExamStatus: "Not Started",
  writtenScore: "—",
  oralExamStatus: "Not Started",
  oralScore: "—",
  resultStatus: "Draft",
  certificateStatus: "Not Issued",
  lastUpdated: "Seed testing data",
}));

export function getErpStudents(): ErpStudent[] {
  try {
    const stored = window.localStorage.getItem(ERP_STUDENTS_KEY);
    if (stored) {
      const normalized = (JSON.parse(stored) as ErpStudent[]).map((student) => ({
        ...student,
        oralScore: student.oralScore ?? "—",
        resultStatus: student.resultStatus ?? "Draft" as const,
        certificateStatus: student.certificateStatus ?? "Not Issued" as const,
      }));
      if (!normalized.some((student) => student.id === testStudents[0].id)) {
        const migrated = [testStudents[0], ...normalized].slice(0, 20);
        window.localStorage.setItem(ERP_STUDENTS_KEY, JSON.stringify(migrated));
        return migrated;
      }
      return normalized;
    }
    saveErpStudents(testStudents);
    return testStudents;
  } catch {
    return testStudents;
  }
}

export function saveErpStudents(students: ErpStudent[]) {
  window.localStorage.setItem(ERP_STUDENTS_KEY, JSON.stringify(students));
  const localRecord = getStudentRecord();
  const synchronized = students.find((student) => student.id === localRecord.registrationNumber);
  if (synchronized) {
    saveStudentRecord({
      ...localRecord,
      fullName: synchronized.name,
      fatherName: synchronized.fatherName,
      state: synchronized.state,
      district: synchronized.district,
      category: synchronized.category,
      subject: synchronized.subject,
      email: synchronized.email,
      mobile: synchronized.mobile,
      dob: synchronized.dob,
    });
  }
  window.dispatchEvent(new CustomEvent(ERP_UPDATED_EVENT));
}

export function subscribeToErp(callback: () => void) {
  window.addEventListener(ERP_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(ERP_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function upsertStudentFromRecord(record: StudentRecord) {
  const students = getErpStudents();
  const current = students.find((student) => student.id === record.registrationNumber);
  const updated: ErpStudent = {
    id: record.registrationNumber,
    name: record.fullName,
    fatherName: record.fatherName,
    state: record.state,
    district: record.district,
    category: record.category.split(" ")[0],
    subject: record.subject,
    status: current?.status ?? "Pending",
    date: current?.date ?? new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    email: record.email,
    mobile: record.mobile,
    dob: record.dob,
    writtenExamStatus: current?.writtenExamStatus ?? "Not Started",
    writtenScore: current?.writtenScore ?? "—",
    oralExamStatus: current?.oralExamStatus ?? "Not Started",
    oralScore: current?.oralScore ?? "—",
    resultStatus: current?.resultStatus ?? "Draft",
    certificateStatus: current?.certificateStatus ?? "Not Issued",
    lastUpdated: new Date().toLocaleString("en-IN"),
  };
  saveErpStudents(current
    ? students.map((student) => student.id === updated.id ? updated : student)
    : [updated, ...students].slice(0, 20)
  );
}

export function recordWrittenExam(registrationNumber: string, answered: number, total: number) {
  const students = getErpStudents();
  saveErpStudents(students.map((student) => student.id === registrationNumber ? {
    ...student,
    writtenExamStatus: "Submitted",
    writtenScore: `${answered}/${total}`,
    lastUpdated: new Date().toLocaleString("en-IN"),
  } : student));
}

export function recordOralExam(registrationNumber: string) {
  const students = getErpStudents();
  saveErpStudents(students.map((student) => student.id === registrationNumber ? {
    ...student,
    oralExamStatus: "Submitted",
    lastUpdated: new Date().toLocaleString("en-IN"),
  } : student));
}

export function updateStudentResult(
  registrationNumber: string,
  updates: Partial<Pick<ErpStudent, "writtenScore" | "oralScore" | "oralExamStatus" | "resultStatus" | "certificateStatus">>
) {
  const students = getErpStudents();
  saveErpStudents(students.map((student) => student.id === registrationNumber ? {
    ...student,
    ...updates,
    lastUpdated: new Date().toLocaleString("en-IN"),
  } : student));
}
