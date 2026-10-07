import { createBrowserRouter } from "react-router";
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";
import ExamLayout from "./layouts/ExamLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Competitions from "./pages/Competitions";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentRegister from "./pages/StudentRegister";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentDocuments from "./pages/student/Documents";
import StudentExamination from "./pages/student/Examination";
import StudentResults from "./pages/student/Results";
import StudentOralExam from "./pages/student/OralExam";
import AdmitCard from "./pages/student/AdmitCard";
import Certificate from "./pages/student/Certificate";
import VerifyDocument from "./pages/VerifyDocument";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminStatistics from "./pages/admin/Statistics";
import AdminCompetitions from "./pages/admin/Competitions";
import ExamOrganizer from "./pages/admin/ExamOrganizer";
import AdminNotices from "./pages/admin/Notices";
import AdminQuestions from "./pages/admin/Questions";
import AdminResults from "./pages/admin/Results";
import AdminStaff from "./pages/admin/Staff";
import ExamPortal from "./pages/exam/ExamPortal";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "activities", Component: Activities },
      { path: "competitions", Component: Competitions },
      { path: "donate", Component: Donate },
      { path: "contact", Component: Contact },
      { path: "login", Component: StudentLogin },
      { path: "register", Component: StudentRegister },
      { path: "admin/login", Component: AdminLogin },
      { path: "verify", Component: VerifyDocument },
    ],
  },
  {
    path: "/student",
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "profile", Component: StudentProfile },
      { path: "documents", Component: StudentDocuments },
      { path: "exam", Component: StudentExamination },
      { path: "oral-exam", Component: StudentOralExam },
      { path: "results", Component: StudentResults },
      { path: "admit-card", Component: AdmitCard },
      { path: "certificate", Component: Certificate },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "students", Component: AdminStudents },
      { path: "statistics", Component: AdminStatistics },
      { path: "competitions", Component: AdminCompetitions },
      { path: "exam-organizer", Component: ExamOrganizer },
      { path: "questions", Component: AdminQuestions },
      { path: "results", Component: AdminResults },
      { path: "staff", Component: AdminStaff },
      { path: "notices", Component: AdminNotices },
    ],
  },
  {
    path: "/competition/exam",
    Component: ExamLayout,
    children: [{ index: true, Component: ExamPortal }],
  },
  { path: "*", Component: NotFound },
]);
