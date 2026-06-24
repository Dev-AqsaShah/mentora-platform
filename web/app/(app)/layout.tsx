import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/auth/get-profile";
import { signOutAction } from "@/lib/actions/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const navLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/live", label: "Live classes" },
    { href: "/doubts", label: "Doubt desk" },
    { href: "/membership", label: "Membership" },
  ];
  if (profile.role === "mentor" || profile.role === "admin") {
    navLinks.push({ href: "/mentor", label: "Mentor dashboard" });
  }

  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-[1140px] flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-display text-[1.3rem] font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--amber-bright),var(--amber))] font-bold text-[#241400]">
            ✒
          </span>
          Mentora
        </Link>
        <div className="flex flex-wrap items-center gap-5">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[0.9rem] text-muted transition-colors hover:text-text">
              {l.label}
            </Link>
          ))}
          <Link href="/settings" className="text-[0.9rem] text-muted transition-colors hover:text-text">
            Settings
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="rounded-lg border border-line-cool px-3.5 py-1.5 text-[0.86rem] text-muted hover:border-amber hover:text-amber-bright">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="mx-auto max-w-[1140px] px-6 pb-16">{children}</main>
    </div>
  );
}
