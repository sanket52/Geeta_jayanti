import { useState } from "react";

const noticesList = [
  { id: 1, title: "Vedic Knowledge Competition 2026 — Registration Open", category: "Competition", date: "01 Sep 2026", expiry: "30 Sep 2026", published: true },
  { id: 2, title: "Online MCQ Examination Schedule Released", category: "Exam", date: "01 Sep 2026", expiry: "20 Oct 2026", published: true },
  { id: 3, title: "New Sanskrit Study Material in Library", category: "Notice", date: "28 Aug 2026", expiry: "30 Oct 2026", published: true },
  { id: 4, title: "Sanskrit Saptah Competition 2025 — Results Declared", category: "Result", date: "20 Aug 2026", expiry: "30 Dec 2026", published: true },
  { id: 5, title: "Holiday Notice — Janmashtami (16 Aug 2026)", category: "Holiday", date: "12 Aug 2026", expiry: "17 Aug 2026", published: false },
];

export default function AdminNotices() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">Notice Board</h1>
          <p className="text-sm text-brown-mid">Manage public announcements and notices</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">
          + Create Notice
        </button>
      </div>

      {showForm && (
        <div className="bg-cream border-2 border-gold/30 rounded-2xl p-6 shadow-sm">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="font-bold text-brown mb-5">Create New Notice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brown-mid mb-1">Notice Title *</label>
              <input type="text" placeholder="Notice title" className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brown-mid mb-1">Category</label>
              <select className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none">
                <option>Competition</option><option>Exam</option><option>Result</option><option>Notice</option><option>Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brown-mid mb-1">Expiry Date</label>
              <input type="date" className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brown-mid mb-1">Description</label>
              <textarea rows={3} placeholder="Notice description..." className="w-full border border-cream-dark rounded-lg px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-5 py-2.5 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">
              Publish Notice
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-cream-dark text-brown-mid rounded-lg font-semibold text-sm hover:bg-cream-dark transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-cream border border-cream-dark rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-dark/60 border-b border-cream-dark">
              <th className="text-left px-5 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Expiry</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-brown-mid uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {noticesList.map((n) => (
              <tr key={n.id} className="border-t border-cream-dark hover:bg-cream-dark/30 transition-colors">
                <td className="px-5 py-3.5 font-medium text-brown max-w-xs truncate">{n.title}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs bg-maroon/10 text-maroon px-2 py-0.5 rounded-full">{n.category}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-brown-mid">{n.date}</td>
                <td className="px-5 py-3.5 text-xs text-brown-mid">{n.expiry}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.published ? "bg-green-100 text-green-700" : "bg-cream-dark text-brown-light"}`}>
                    {n.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button className="text-xs text-maroon hover:underline font-medium">Edit</button>
                    <button className="text-xs text-brown-mid hover:text-red-600 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
