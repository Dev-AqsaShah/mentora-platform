import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MentorOverviewPage() {
  const supabase = await createClient();
  const [{ count: studentCount }, { count: lessonCount }, { count: liveCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("live_classes").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-[18px] border border-line-cool bg-surface p-6">
        <div className="font-data text-[0.72rem] uppercase tracking-[0.1em] text-muted">Students</div>
        <div className="mt-2 font-display text-[2rem] font-bold">{studentCount ?? 0}</div>
      </div>
      <div className="rounded-[18px] border border-line-cool bg-surface p-6">
        <div className="font-data text-[0.72rem] uppercase tracking-[0.1em] text-muted">Lessons published</div>
        <div className="mt-2 font-display text-[2rem] font-bold">{lessonCount ?? 0}</div>
        <Link href="/mentor/content" className="mt-3 inline-block text-[0.86rem] text-amber-bright">
          Manage content →
        </Link>
      </div>
      <div className="rounded-[18px] border border-line-cool bg-surface p-6">
        <div className="font-data text-[0.72rem] uppercase tracking-[0.1em] text-muted">Scheduled classes</div>
        <div className="mt-2 font-display text-[2rem] font-bold">{liveCount ?? 0}</div>
        <Link href="/mentor/live" className="mt-3 inline-block text-[0.86rem] text-amber-bright">
          Manage live classes →
        </Link>
      </div>
    </div>
  );
}
