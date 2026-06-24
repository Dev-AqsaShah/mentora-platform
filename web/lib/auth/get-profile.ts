import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  return profile ?? null;
}

export function hasAccess(profile: Pick<Profile, "trial_ends_at" | "premium_until">): boolean {
  const now = Date.now();
  const trialActive = !!profile.trial_ends_at && new Date(profile.trial_ends_at).getTime() > now;
  const premiumActive = !!profile.premium_until && new Date(profile.premium_until).getTime() > now;
  return trialActive || premiumActive;
}
