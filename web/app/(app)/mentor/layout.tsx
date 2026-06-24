import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  await requireRole("mentor", "admin");

  return (
    <div className="pt-6">
      <span className="eyebrow">Mentor / Admin</span>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link href="/mentor" className="rounded-lg border border-line-cool px-3.5 py-1.5 text-[0.86rem] text-muted hover:border-amber hover:text-amber-bright">
          Overview
        </Link>
        <Link href="/mentor/content" className="rounded-lg border border-line-cool px-3.5 py-1.5 text-[0.86rem] text-muted hover:border-amber hover:text-amber-bright">
          Content
        </Link>
        <Link href="/mentor/live" className="rounded-lg border border-line-cool px-3.5 py-1.5 text-[0.86rem] text-muted hover:border-amber hover:text-amber-bright">
          Live classes
        </Link>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
