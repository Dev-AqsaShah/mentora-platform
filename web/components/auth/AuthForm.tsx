"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signInAction, signUpAction, type AuthFormState } from "@/lib/actions/auth";

const inputClass =
  "w-full rounded-xl border border-line-cool bg-surface-2 px-4 py-3 text-text placeholder:text-muted focus:border-amber focus:outline-none";

const initialState: AuthFormState = { error: null };

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function continueWithGoogle() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="mx-auto w-full max-w-[420px] rounded-[20px] border border-line-cool bg-surface p-8">
      <h1 className="text-[1.8rem]">{mode === "login" ? "Welcome back" : "Start your trial"}</h1>
      <p className="mt-2 text-[0.92rem] text-muted">
        {mode === "login"
          ? "Sign in to continue your CSS prep."
          : "3 days free, full access — no card required."}
      </p>

      <form action={formAction} className="mt-6 grid gap-4">
        {mode === "signup" && (
          <input name="full_name" placeholder="Full name" required className={inputClass} />
        )}
        <input name="email" type="email" placeholder="Email" required className={inputClass} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          minLength={8}
          required
          className={inputClass}
        />
        {state.error && <p className="text-[0.86rem] text-[#ff8a8a]">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[linear-gradient(180deg,var(--amber-bright),var(--amber))] px-6 py-3.5 font-semibold text-[#241400] shadow-[0_10px_28px_rgba(240,162,75,0.25)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(240,162,75,0.38)] disabled:opacity-60"
        >
          {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Start 3-day free trial"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[0.78rem] text-muted">
        <span className="h-px flex-1 bg-line-cool" /> or <span className="h-px flex-1 bg-line-cool" />
      </div>

      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={googleLoading}
        className="w-full rounded-xl border border-line-cool px-6 py-3.5 font-semibold text-text transition-colors hover:border-amber hover:text-amber-bright disabled:opacity-60"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-[0.86rem] text-muted">
        {mode === "login" ? (
          <>
            New to Mentora?{" "}
            <Link href="/signup" className="text-amber-bright">
              Start a free trial
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-amber-bright">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
