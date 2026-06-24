import Link from "next/link";
import { getProfile, hasAccess } from "@/lib/auth/get-profile";

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) return null;

  const access = hasAccess(profile);
  const trialEnds = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;

  return (
    <div className="pt-6">
      <span className="eyebrow">Welcome back</span>
      <h1 className="mt-2 text-[2rem]">{profile.full_name || profile.email}</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[18px] border border-line-cool bg-surface p-6">
          <div className="font-data text-[0.72rem] uppercase tracking-[0.1em] text-muted">Access status</div>
          <div className="mt-2 text-[1.3rem]">
            {access ? (
              <span className="text-live">Active</span>
            ) : (
              <span className="text-[#ff8a8a]">Locked — trial/subscription ended</span>
            )}
          </div>
          {trialEnds && (
            <p className="mt-1 text-[0.86rem] text-muted">
              Trial {trialEnds.getTime() > Date.now() ? "ends" : "ended"} {trialEnds.toLocaleDateString()}
            </p>
          )}
          {!access && (
            <Link href="/membership" className="mt-4 inline-block rounded-xl bg-[linear-gradient(180deg,var(--amber-bright),var(--amber))] px-5 py-2.5 text-[0.9rem] font-semibold text-[#241400]">
              Subscribe now
            </Link>
          )}
        </div>

        <div className="rounded-[18px] border border-line-cool bg-surface p-6">
          <div className="font-data text-[0.72rem] uppercase tracking-[0.1em] text-muted">Continue where you left off</div>
          <p className="mt-2 text-[0.94rem] text-muted">No lessons watched yet — browse the catalogue to get started.</p>
          <Link href="/catalogue" className="mt-4 inline-block text-[0.9rem] text-amber-bright">
            Open catalogue →
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-[18px] border border-line-cool bg-surface p-6">
        <div className="font-data text-[0.72rem] uppercase tracking-[0.1em] text-muted">Upcoming live classes</div>
        <p className="mt-2 text-[0.94rem] text-muted">Nothing scheduled yet.</p>
        <Link href="/live" className="mt-4 inline-block text-[0.9rem] text-amber-bright">
          View live class calendar →
        </Link>
      </div>
    </div>
  );
}
