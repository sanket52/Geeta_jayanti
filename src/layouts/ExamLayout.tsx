import { Outlet } from "react-router";

export default function ExamLayout() {
  return (
    <div className="min-h-full bg-[#0f1117] text-white flex flex-col">
      <header className="h-12 bg-[#1a1e28] border-b border-white/10 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-maroon flex items-center justify-center text-cream text-sm font-bold">ॐ</div>
          <span className="text-sm font-medium text-white/80">Maharshi Panini Ved Vedang Vidhyapeeth Gurukul — Examination Portal</span>
        </div>
        <div className="text-xs text-white/40">Do not refresh or navigate away during exam</div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
