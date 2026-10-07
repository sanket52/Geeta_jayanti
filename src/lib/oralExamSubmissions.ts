import { supabase, ORAL_VIDEO_BUCKET } from "./supabase";

export type OralSubmission = {
  id: string;
  student_id: string;
  registration_number: string;
  student_name: string;
  subject: string;
  question: string;
  storage_path: string;
  content_type: string;
  file_size: number;
  status: "Submitted" | "Evaluated";
  uploaded_at: string;
};

export async function uploadOralSubmission(input: {
  blob: Blob;
  registrationNumber: string;
  studentName: string;
  subject: string;
  question: string;
}) {
  if (!supabase) throw new Error("Supabase is not configured. Set the project URL and anon key first.");
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Sign in with the connected student account before uploading.");
  const profile = await supabase.from("profiles").select("registration_number, role").eq("id", auth.user.id).single();
  if (profile.error) throw new Error(`Student profile is not configured: ${profile.error.message}`);
  if (profile.data.role !== "student" || profile.data.registration_number !== input.registrationNumber) {
    throw new Error("This signed-in account is not linked to this student registration.");
  }
  const extension = input.blob.type.includes("mp4") ? "mp4" : "webm";
  const storagePath = `${auth.user.id}/${crypto.randomUUID()}.${extension}`;
  const uploaded = await supabase.storage.from(ORAL_VIDEO_BUCKET).upload(storagePath, input.blob, {
    contentType: input.blob.type || "video/webm",
    upsert: false,
  });
  if (uploaded.error) throw new Error(`Video upload failed: ${uploaded.error.message}`);
  const saved = await supabase.from("oral_exam_submissions").insert({
    student_id: auth.user.id,
    registration_number: input.registrationNumber,
    student_name: input.studentName,
    subject: input.subject,
    question: input.question,
    storage_path: storagePath,
    content_type: input.blob.type || "video/webm",
    file_size: input.blob.size,
  });
  if (saved.error) {
    await supabase.storage.from(ORAL_VIDEO_BUCKET).remove([storagePath]);
    throw new Error(`Submission record could not be saved: ${saved.error.message}`);
  }
}

export async function getOralSubmissions() {
  if (!supabase) throw new Error("Supabase is not configured. Set the project URL and anon key first.");
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Sign in with an authorized teacher account to view submissions.");
  const profile = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile.error || !["teacher", "admin"].includes(profile.data?.role)) {
    throw new Error("This account does not have teacher or admin access.");
  }
  const result = await supabase.from("oral_exam_submissions").select("*").order("uploaded_at", { ascending: false });
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as OralSubmission[];
}

export async function getOralSubmissionVideo(path: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.storage.from(ORAL_VIDEO_BUCKET).createSignedUrl(path, 300);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function setOralSubmissionEvaluated(id: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const result = await supabase.from("oral_exam_submissions").update({ status: "Evaluated" }).eq("id", id);
  if (result.error) throw new Error(result.error.message);
}
