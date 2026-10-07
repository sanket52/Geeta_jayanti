import { useState } from "react";
import { upsertStudentFromRecord } from "../../lib/erpStore";
import { getStudentRecord, saveStudentRecord, type StudentRecord } from "../../lib/studentRecord";

const fields: Array<{ key: keyof StudentRecord; label: string; locked?: boolean }> = [
  { key: "fullName", label: "Full Name", locked: true },
  { key: "fatherName", label: "Father's Name" },
  { key: "motherName", label: "Mother's Name" },
  { key: "dob", label: "Date of Birth", locked: true },
  { key: "gender", label: "Gender" },
  { key: "mobile", label: "Mobile" },
  { key: "email", label: "Email" },
  { key: "state", label: "State" },
  { key: "district", label: "District" },
  { key: "pinCode", label: "PIN Code" },
];

export default function StudentProfile() {
  const [editing, setEditing] = useState(false);
  const [record, setRecord] = useState(getStudentRecord);
  const [draft, setDraft] = useState(record);
  const [message, setMessage] = useState("");
  const [photoError, setPhotoError] = useState("");

  const updatePhoto = (file?: File) => {
    setPhotoError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file such as JPG, PNG, or WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("The image must be smaller than 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setPhotoError("The selected image could not be read. Please try another file.");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => setPhotoError("That image file could not be opened. Please try another file.");
      image.onload = () => {
        const maxWidth = 480;
        const maxHeight = 600;
        const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          setPhotoError("Image editing is unavailable in this browser.");
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setDraft((current) => ({ ...current, photo: canvas.toDataURL("image/jpeg", 0.82) }));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const startEditing = () => {
    setDraft(record);
    setMessage("");
    setPhotoError("");
    setEditing(true);
  };

  const saveChanges = () => {
    saveStudentRecord(draft);
    upsertStudentFromRecord(draft);
    setRecord(draft);
    setEditing(false);
    setMessage("Profile changes saved and synchronized with the Admin ERP.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-brown">My Profile</h1>
          <p className="text-sm text-brown-mid">Registration No: {record.registrationNumber}</p>
        </div>
        <button
          onClick={() => editing ? setEditing(false) : startEditing()}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${editing ? "bg-cream-dark text-brown" : "bg-maroon text-cream hover:bg-maroon-dark"}`}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {editing && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Name and date of birth are locked. Other saved changes are automatically synchronized with the Admin ERP.
        </div>
      )}
      {message && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-cream border border-cream-dark rounded-2xl p-5 text-center">
          <div className="w-24 h-24 rounded-full bg-maroon text-cream flex items-center justify-center text-4xl font-bold mx-auto mb-3 overflow-hidden">
            {(editing ? draft.photo : record.photo) ? (
              <img src={editing ? draft.photo : record.photo} alt={record.fullName} className="w-full h-full object-cover" />
            ) : (
              record.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")
            )}
          </div>
          <div className="font-semibold text-brown">{record.fullName}</div>
          <div className="text-xs text-brown-mid mt-1">{record.category}</div>
          {editing && (
            <div className="mt-4 text-left">
              <label className="block text-xs font-semibold text-brown-mid mb-2" htmlFor="student-profile-photo">Profile photo</label>
              <input
                id="student-profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={(event) => updatePhoto(event.target.files?.[0])}
                className="w-full text-xs text-brown file:mr-2 file:rounded-lg file:border-0 file:bg-maroon file:px-3 file:py-2 file:font-semibold file:text-cream"
              />
              <p className="mt-2 text-[11px] text-brown-mid">Image is resized before saving. Maximum original size: 10 MB.</p>
              {draft.photo && <button type="button" onClick={() => setDraft((current) => ({ ...current, photo: "" }))} className="mt-2 text-xs font-semibold text-maroon hover:underline">Remove photo</button>}
              {photoError && <p role="alert" className="mt-2 text-xs text-red-700">{photoError}</p>}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-cream border border-cream-dark rounded-2xl p-6">
          <h2 className="font-semibold text-brown mb-5 text-sm uppercase tracking-wide border-b border-cream-dark pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ key, label, locked }) => (
              <label key={key} className="block">
                <span className="block text-xs text-brown-mid mb-1">{label}{locked ? " · Locked" : ""}</span>
                {editing && !locked ? (
                  <input
                    value={String(draft[key])}
                    onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
                    className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm text-brown focus:border-gold focus:outline-none"
                  />
                ) : (
                  <span className="block text-sm font-medium text-brown px-3 py-2 bg-cream-dark rounded-lg">{String(record[key]) || "—"}</span>
                )}
              </label>
            ))}
          </div>

          {editing && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-cream-dark">
              <button onClick={saveChanges} className="px-6 py-2.5 bg-maroon text-cream rounded-lg font-semibold text-sm hover:bg-maroon-dark transition-colors">Save & Sync Changes</button>
              <button onClick={() => setEditing(false)} className="px-6 py-2.5 border border-cream-dark text-brown rounded-lg font-semibold text-sm hover:bg-cream-dark transition-colors">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
