import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/get-profile";
import type { UserRole } from "@/lib/types/database";

export async function requireRole(...roles: UserRole[]) {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (!roles.includes(profile.role)) redirect("/dashboard");
  return profile;
}
