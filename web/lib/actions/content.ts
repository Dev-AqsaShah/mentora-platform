"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";

export async function createPaper(formData: FormData) {
  await requireRole("mentor", "admin");
  const supabase = await createClient();
  const code = String(formData.get("code") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!code || !title) return;

  await supabase.from("papers").insert({ code, title, sort_order: 0 });
  revalidatePath("/mentor/content");
}

export async function createTopic(formData: FormData) {
  await requireRole("mentor", "admin");
  const supabase = await createClient();
  const paperId = String(formData.get("paper_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!paperId || !title) return;

  await supabase.from("topics").insert({ paper_id: paperId, title, sort_order: 0 });
  revalidatePath("/mentor/content");
}

export async function createLesson(formData: FormData) {
  const profile = await requireRole("mentor", "admin");
  const supabase = await createClient();
  const topicId = String(formData.get("topic_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const videoId = String(formData.get("video_id") ?? "").trim() || null;
  const isFreePreview = formData.get("is_free_preview") === "on";
  if (!topicId || !title) return;

  await supabase.from("lessons").insert({
    topic_id: topicId,
    title,
    type: "recorded",
    video_id: videoId,
    is_free_preview: isFreePreview,
    published_at: new Date().toISOString(),
    created_by: profile.id,
  });
  revalidatePath("/mentor/content");
}

export async function toggleFreePreview(lessonId: string, next: boolean) {
  await requireRole("mentor", "admin");
  const supabase = await createClient();
  await supabase.from("lessons").update({ is_free_preview: next }).eq("id", lessonId);
  revalidatePath("/mentor/content");
}

export async function uploadAttachment(formData: FormData) {
  await requireRole("mentor", "admin");
  const supabase = await createClient();
  const lessonId = String(formData.get("lesson_id") ?? "");
  const kind = String(formData.get("kind") ?? "notes") as "notes" | "slides" | "pastpaper";
  const file = formData.get("file") as File | null;
  if (!lessonId || !file || file.size === 0) return;

  const path = `${lessonId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("lesson-attachments").upload(path, file);
  if (error) throw new Error(error.message);

  await supabase.from("attachments").insert({
    lesson_id: lessonId,
    kind,
    title: file.name,
    storage_path: path,
  });
  revalidatePath("/mentor/content");
}
