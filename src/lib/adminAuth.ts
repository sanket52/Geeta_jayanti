export const ADMIN_SESSION_KEY = "mpvvg_admin_session";

export type AdminSession = {
  name: string;
  email: string;
  role: string;
  access: string;
  allowedPaths: string[];
  isSuperAdmin: boolean;
};

const defaultTeachers = [
  { name: "Acharya Suresh Pandey", role: "Examination Controller", email: "suresh@gurukul.edu", mobile: "+91 98765 40101", password: "Suresh@2026", access: "Exams, Questions, Results", active: true },
  { name: "Dr. Savita Shastri", role: "Sanskrit Examiner", email: "savita@gurukul.edu", mobile: "+91 98765 40102", password: "Savita@2026", access: "Questions, Oral Exams, Results", active: true },
  { name: "Dr. Meena Mishra", role: "Student Coordinator", email: "meena@gurukul.edu", mobile: "+91 98765 40103", password: "Meena@2026", access: "Students, Registrations, Documents", active: true },
];

function pathsForAccess(access: string) {
  if (access.includes("Full ERP")) return ["/admin"];
  const paths = ["/admin"];
  if (access.includes("Students") || access.includes("Registrations") || access.includes("Documents")) paths.push("/admin/students");
  if (access.includes("Exams")) paths.push("/admin/competitions", "/admin/exam-organizer");
  if (access.includes("Questions")) paths.push("/admin/questions");
  if (access.includes("Oral Exams")) paths.push("/admin/exam-organizer");
  if (access.includes("Results")) paths.push("/admin/results");
  return [...new Set(paths)];
}

export function getAdminAccount(email: string): (AdminSession & { mobile: string }) | null {
  const normalizedEmail = email.trim().toLowerCase();
  const isExistingSuperAdmin = ["admin@gurukul.edu", "sanket@gurukul.edu"].includes(normalizedEmail);
  const isSanketBhardwaj = normalizedEmail === "sanketbhardwaj413@gmail.com";
  if (isExistingSuperAdmin || isSanketBhardwaj) {
    return {
      name: "Sanket Sharma",
      email: normalizedEmail,
      role: "Super Admin",
      access: "Full ERP Access",
      allowedPaths: ["/admin"],
      isSuperAdmin: true,
      mobile: "+91 98765 40001",
    };
  }

  let teachers = defaultTeachers;
  try {
    const stored = window.localStorage.getItem("mpvvg_erp_teachers");
    if (stored) teachers = JSON.parse(stored);
  } catch {
    teachers = defaultTeachers;
  }
  const teacher = teachers.find((item) => item.email.toLowerCase() === normalizedEmail && item.active);
  const defaultAccount = defaultTeachers.find((item) => item.email === normalizedEmail);
  const accountMobile = teacher?.mobile || defaultAccount?.mobile;
  if (!teacher || !accountMobile) return null;
  return {
    name: teacher.name,
    email: teacher.email,
    role: teacher.role,
    access: teacher.access,
    allowedPaths: pathsForAccess(teacher.access),
    isSuperAdmin: false,
    mobile: accountMobile,
  };
}

export function authenticateAdmin(email: string, password: string): (AdminSession & { mobile: string }) | null {
  const account = getAdminAccount(email);
  if (!account) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const expectedSuperAdminPassword = normalizedEmail === "sanketbhardwaj413@gmail.com" ? "sanket@123" : "Sanket@2026";
  if (account.isSuperAdmin) return password === expectedSuperAdminPassword ? account : null;

  let teachers = defaultTeachers;
  try {
    const stored = window.localStorage.getItem("mpvvg_erp_teachers");
    if (stored) teachers = JSON.parse(stored);
  } catch {
    teachers = defaultTeachers;
  }
  const teacher = teachers.find((item) => item.email.toLowerCase() === normalizedEmail);
  const defaultAccount = defaultTeachers.find((item) => item.email === normalizedEmail);
  return password === (teacher?.password || defaultAccount?.password) ? account : null;
}

export function saveAdminSession(session: AdminSession) {
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function getAdminSession(): AdminSession {
  try {
    const stored = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Fall back to the scaffold's super-admin session.
  }
  return {
    name: "Sanket Sharma",
    email: "admin@gurukul.edu",
    role: "Super Admin",
    access: "Full ERP Access",
    allowedPaths: ["/admin"],
    isSuperAdmin: true,
  };
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
