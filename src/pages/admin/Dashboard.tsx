import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { downloadCsv } from "../../lib/adminExport";
import { getErpStudents, subscribeToErp } from "../../lib/erpStore";

const registrationData = [
  { day: "1 Sep", count: 1 },
  { day: "5 Sep", count: 3 },
  { day: "10 Sep", count: 5 },
  { day: "15 Sep", count: 7 },
  { day: "20 Sep", count: 9 },
  { day: "25 Sep", count: 11 },
  { day: "30 Sep", count: 12 },
];

export default function AdminDashboard() {
  const [students, setStudents] = useState(getErpStudents);

  useEffect(() => subscribeToErp(() => setStudents(getErpStudents())), []);

  const approved = students.filter((student) => student.status === "Approved").length;
  const pending = students.filter((student) => student.status === "Pending").length;
  const writtenSubmitted = students.filter((student) => student.writtenExamStatus === "Submitted").length;
  const oralPending = students.filter((student) => student.oralExamStatus === "Submitted").length;
  const stateData = Object.entries(students.reduce<Record<string, number>>((totals, student) => {
    totals[student.state] = (totals[student.state] || 0) + 1;
    return totals;
  }, {})).map(([state, count]) => ({ state: state.split(" ")[0], count }));
  const recentRegistrations = students.slice(0, 5).map((student) => ({
    name: student.name,
    reg: student.id,
    state: student.state,
    time: student.lastUpdated,
    status: student.status,
  }));
  const pendingActions = [
    { action: "Registrations Pending Approval", count: pending, link: "/admin/students", urgent: pending > 0, icon: "📋" },
    { action: "Written Exams Submitted", count: writtenSubmitted, link: "/admin/students", urgent: false, icon: "✍" },
    { action: "Oral Evaluations Pending", count: oralPending, link: "/admin/students", urgent: oralPending > 0, icon: "🎥" },
  ];

  const exportData = () => downloadCsv(
    "erp-student-summary.csv",
    ["Registration", "Name", "Status", "Written Exam", "Written Score", "Oral Exam"],
    students.map((student) => [student.id, student.name, student.status, student.writtenExamStatus, student.writtenScore, student.oralExamStatus])
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Admin Dashboard</h1>
          <p className="text-sm text-brown-mid">Vedic Knowledge Competition 2026 — Overview • 7 September 2026</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/statistics" className="px-4 py-2 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">
            📈 Full Statistics
          </Link>
          <button onClick={exportData} className="px-4 py-2 border border-maroon text-maroon rounded-lg font-semibold text-sm hover:bg-maroon/5 transition-colors">
            Export ERP Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Testing Students", value: students.length, change: "Shared ERP records", icon: "👥", color: "text-maroon", bg: "bg-maroon/10" },
          { label: "Approved", value: approved, change: `${pending} pending review`, icon: "📋", color: "text-gold", bg: "bg-gold/10" },
          { label: "Written Submitted", value: writtenSubmitted, change: "Auto-synced from exam", icon: "✍", color: "text-saffron", bg: "bg-saffron/10" },
          { label: "Oral Submitted", value: oralPending, change: "Awaiting evaluation", icon: "🎥", color: "text-green-700", bg: "bg-green-50" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-cream border border-cream-dark rounded-2xl p-5 hover:border-gold/30 hover:shadow-sm transition-all">
            <div className={`w-11 h-11 ${kpi.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{kpi.icon}</div>
            <div className={`text-2xl font-bold ${kpi.color} mb-0.5`}>{kpi.value}</div>
            <div className="text-sm font-medium text-brown">{kpi.label}</div>
            <div className="text-xs text-brown-mid mt-0.5">{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Approval", value: pending, icon: "⏳", color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Oral Evaluations Pending", value: oralPending, icon: "🎥", color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Testing Records", value: students.length, icon: "📅", color: "text-purple-700", bg: "bg-purple-50" },
          { label: "Active Competitions", value: "1", icon: "🏆", color: "text-maroon", bg: "bg-maroon/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-cream border border-cream-dark rounded-xl p-4">
            <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center text-sm mb-2`}>{kpi.icon}</div>
            <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-brown-mid">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Chart */}
        <div className="lg:col-span-2 bg-cream border border-cream-dark rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown">Daily Registration Trend — September 2026</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">↑ Registration Active</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={registrationData}>
              <defs>
                <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B1A1A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B1A1A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2E4CC" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B4226" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B4226" }} />
              <Tooltip
                contentStyle={{ background: "#FDF6EE", border: "1px solid #C8902B", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#2C1508", fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="count" stroke="#8B1A1A" strokeWidth={2} fill="url(#regGradient)" name="Registrations" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Actions */}
        <div className="bg-cream border border-cream-dark rounded-2xl p-5">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown mb-4">Pending Actions</h3>
          <div className="space-y-3">
            {pendingActions.map((p) => (
              <Link key={p.action} to={p.link}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-dark transition-colors group">
                <span className="text-lg shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-brown truncate">{p.action}</div>
                </div>
                <span className={`text-sm font-bold shrink-0 ${p.urgent ? "text-red-600" : "text-brown-mid"}`}>
                  {p.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State-wise Bar */}
        <div className="bg-cream border border-cream-dark rounded-2xl p-6">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown mb-5">State-wise Registrations</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stateData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2E4CC" />
              <XAxis dataKey="state" tick={{ fontSize: 11, fill: "#6B4226" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B4226" }} />
              <Tooltip contentStyle={{ background: "#FDF6EE", border: "1px solid #C8902B", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#8B1A1A" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Registrations */}
        <div className="bg-cream border border-cream-dark rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown">Recent Registrations</h3>
            <Link to="/admin/students" className="text-xs text-maroon font-semibold hover:underline">View All →</Link>
          </div>
          <div className="space-y-3">
            {recentRegistrations.map((r) => (
              <div key={r.reg} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream-dark transition-colors">
                <div className="w-9 h-9 rounded-full bg-maroon/10 text-maroon flex items-center justify-center font-bold text-sm shrink-0">
                  {r.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-brown truncate">{r.name}</div>
                  <div className="text-xs text-brown-mid">{r.reg} • {r.state} • {r.time}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  r.status === "Approved" ? "bg-green-100 text-green-700" :
                  r.status === "Rejected" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
