import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import RevealText from "@/components/RevealText";
import SecurePlayer from "@/components/SecurePlayer";

const wrap = "mx-auto w-full max-w-[1140px] px-6";

const btnPrimary =
  "inline-block rounded-xl bg-[linear-gradient(180deg,var(--amber-bright),var(--amber))] px-[26px] py-3.5 text-[0.94rem] font-semibold text-[#241400] shadow-[0_10px_28px_rgba(240,162,75,0.25)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(240,162,75,0.38)]";

const btnGhost =
  "inline-block rounded-xl border border-line-cool px-[26px] py-3.5 text-[0.94rem] font-semibold text-text transition-colors hover:border-amber hover:text-amber-bright";

const syllabus = [
  { code: "C-01", title: "Essay", meta: "12 lectures · notes" },
  { code: "C-02", title: "English (Précis & Composition)", meta: "10 lectures · past papers" },
  { code: "C-03", title: "General Science & Ability", meta: "14 lectures · MCQs" },
  { code: "C-04", title: "Current Affairs", meta: "weekly live · quizzes" },
  { code: "C-05", title: "Pakistan Affairs", meta: "11 lectures · notes" },
  { code: "C-06", title: "Islamic Studies", meta: "9 lectures · slides" },
];

const practiceCards = [
  {
    icon: "📝",
    title: "Tests & mock exams",
    body: "Auto-graded MCQs after each lesson, plus timed mock exams and real past papers.",
  },
  {
    icon: "✍",
    title: "Essay & précis feedback",
    body: "Submit your writing; get marked feedback from the mentor — the heart of CSS prep.",
  },
  {
    icon: "🤖",
    title: "AI study assistant",
    body: "Instant essay evaluation, lecture summaries, flashcards, and generated practice questions.",
  },
];

const accessSteps = [
  { n: "BEFORE", title: "Browse the catalogue", body: "See the full syllabus, lecture titles, and a couple of free preview classes before you pay." },
  { n: "3 DAYS", title: "Free trial — full access", body: "Watch lectures, join live, and try the practice tools with no limits for 3 days." },
  { n: "AFTER", title: "Subscribe to keep watching", body: "When the trial ends, content locks and only the catalogue stays visible until you subscribe." },
];

export default function Home() {
  return (
    <>
      <div className={wrap}>
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5 font-display text-[1.4rem] font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--amber-bright),var(--amber))] font-bold text-[#241400]">
              ✒
            </span>
            Mentora
          </div>
          <div className="hidden items-center gap-[30px] md:flex">
            <a href="#live" className="text-[0.92rem] text-muted transition-colors hover:text-text">Live classes</a>
            <a href="#secure" className="text-[0.92rem] text-muted transition-colors hover:text-text">Secure recordings</a>
            <a href="#practice" className="text-[0.92rem] text-muted transition-colors hover:text-text">Practice</a>
            <a href="#doubts" className="text-[0.92rem] text-muted transition-colors hover:text-text">Doubt desk</a>
            <a href="#pricing" className="text-[0.92rem] text-muted transition-colors hover:text-text">Pricing</a>
            <Link href="/login" className="text-[0.92rem] text-muted transition-colors hover:text-text">Sign in</Link>
          </div>
          <Link href="/signup" className={btnPrimary}>Start free trial</Link>
        </nav>

        <header className="grid grid-cols-1 items-center gap-[46px] py-[42px] pb-[76px] text-center md:grid-cols-[1.02fr_0.98fr] md:text-left">
          <div>
            <span className="eyebrow">CSS &amp; competitive exam prep</span>
            <h1 className="my-4 text-[clamp(2.6rem,5.4vw,4.1rem)]">
              Learn CSS from one mentor — <span className="text-amber-bright">live, then on replay</span>.
            </h1>
            <p className="mx-auto mb-7 max-w-[36ch] text-[1.1rem] text-muted md:mx-0">
              Attend live classes, then rewatch the recordings anytime. Lectures are locked to you — no downloads, and your name rides on every frame.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/signup" className={btnPrimary}>Start 3-day free trial</Link>
              <a href="#secure" className={btnGhost}>See how it&apos;s protected</a>
            </div>
            <div className="mt-[30px] flex flex-wrap justify-center gap-7 md:justify-start">
              <div className="flex flex-col">
                <span className="font-display text-[1.5rem] font-bold">6</span>
                <span className="font-data text-[0.7rem] uppercase tracking-[0.1em] text-muted">Compulsory papers</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[1.5rem] font-bold">Live</span>
                <span className="font-data text-[0.7rem] uppercase tracking-[0.1em] text-muted">+ recorded</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[1.5rem] font-bold">AI</span>
                <span className="font-data text-[0.7rem] uppercase tracking-[0.1em] text-muted">essay feedback</span>
              </div>
            </div>
          </div>

          <div className="order-first flex justify-center md:order-none">
            <SecurePlayer badge="LIVE · Current Affairs" live caption="YOUR NAME FOLLOWS THE VIDEO" />
          </div>
        </header>
      </div>

      <section className="py-[70px]">
        <div className={wrap}>
          <RevealText
            text="CSS rewards discipline over shortcuts. Mentora gives you the structure, the mentor, and the practice — so every week of effort actually counts."
            keyWords={["structure", "counts"]}
          />
        </div>
      </section>

      <section id="live" className="py-[70px]">
        <div className={wrap}>
          <FadeIn>
            <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-[50px]">
              <div>
                <span className="eyebrow">01 · Live classes</span>
                <h3 className="mt-3 text-[clamp(1.6rem,3.4vw,2.2rem)]">Be in the room — then keep the room.</h3>
                <p className="mt-3 text-muted">
                  Join the mentor live with Q&amp;A, polls, and raise-hand. The moment a class ends, the recording lands in your library automatically.
                </p>
                <ul className="mt-[18px] grid gap-2.5">
                  {[
                    "Live chat, raise hand, and instant polls",
                    "Class calendar with reminders before each session",
                    "Auto-saved recording, ready right after class",
                    "Attendance tracked for every session",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.96rem]">
                      <span className="text-amber">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[18px] border border-line-cool bg-surface p-[22px]">
                <div className="mb-3.5 flex items-center justify-between border-b border-line-cool pb-3.5">
                  <span className="flex items-center gap-1.5 font-data text-[0.66rem] tracking-[0.08em]">
                    <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" /> LIVE
                  </span>
                  <span className="font-data text-[0.72rem] text-muted">142 watching</span>
                </div>
                <div className="mb-2.5 flex gap-2.5 text-[0.86rem]">
                  <b className="font-semibold text-amber-bright">Sana:</b>
                  <span className="text-muted">Sir, can you repeat the précis rule?</span>
                </div>
                <div className="mb-2.5 flex gap-2.5 text-[0.86rem]">
                  <b className="font-semibold text-amber-bright">Mentor:</b>
                  <span className="text-muted">Sure — one-third length, own words.</span>
                </div>
                <div className="mb-2.5 flex gap-2.5 text-[0.86rem]">
                  <b className="font-semibold text-amber-bright">Bilal:</b>
                  <span className="text-muted">Poll: ready for a mock essay? ✅</span>
                </div>
                <div className="mt-3.5 flex justify-between rounded-[10px] border border-line-cool bg-surface-2 px-3 py-2.5 text-[0.85rem] text-muted">
                  <span>Ask a question…</span>
                  <span className="text-amber-bright">Raise hand ✋</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="secure" className="py-[70px]">
        <div className={wrap}>
          <FadeIn>
            <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-[50px]">
              <div className="order-2 md:order-1">
                <span className="eyebrow">02 · Secure recordings</span>
                <h3 className="mt-3 text-[clamp(1.6rem,3.4vw,2.2rem)]">Your lectures stay yours.</h3>
                <p className="mt-3 text-muted">
                  Recordings stream through encrypted, protected playback — there&apos;s no download button and no raw file to grab. And a moving watermark with the viewer&apos;s name and email rides across every frame.
                </p>
                <ul className="mt-[18px] grid gap-2.5">
                  {[
                    "Encrypted streaming (DRM) — no downloadable file",
                    "Personal watermark on every frame to trace any leak",
                    "If a recording is leaked, the watermark shows whose it was",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.96rem]">
                      <span className="text-amber">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3.5 text-[0.82rem] text-muted">
                  An honest note: no website can fully stop screen recording. The watermark is what makes leaking risky — anyone who shares it is named on the footage.
                </p>
              </div>
              <div className="order-1 flex justify-center md:order-2">
                <SecurePlayer badge="▶ REPLAY · Pakistan Affairs" caption="WATERMARK MOVES SO IT CAN'T BE CROPPED" progressPct={62} showWave={false} downloadLabel="Download disabled" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="content" className="py-[70px]">
        <div className={wrap}>
          <FadeIn>
            <div className="mb-[42px] max-w-[620px]">
              <span className="eyebrow">03 · Organised syllabus</span>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)]">Every paper, in its place.</h2>
              <p className="mt-3 text-[1.02rem] text-muted">
                Content is organised by paper and topic, so you always know what&apos;s next — and the mentor can upload notes, slides, and past papers anytime.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="grid gap-2.5">
              {syllabus.map((s) => (
                <div
                  key={s.code}
                  className="flex items-center justify-between rounded-xl border border-line-cool bg-surface px-4 py-3.5 transition-colors hover:border-amber"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-md border border-line px-1.5 py-0.5 font-data text-[0.7rem] text-amber">{s.code}</span>
                    <span>{s.title}</span>
                  </div>
                  <span className="font-data text-[0.72rem] text-muted">{s.meta}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="practice" className="py-[70px]">
        <div className={wrap}>
          <FadeIn>
            <div className="mx-auto mb-[42px] max-w-[620px] text-center">
              <span className="eyebrow">04 · Practice &amp; feedback</span>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)]">Where marks are actually made.</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {practiceCards.map((c) => (
              <FadeIn key={c.title}>
                <div className="h-full rounded-[18px] border border-line-cool bg-surface p-[26px] transition-[transform,border-color] hover:-translate-y-1 hover:border-amber">
                  <div className="mb-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-[rgba(240,162,75,0.12)] text-[1.2rem] text-amber-bright">
                    {c.icon}
                  </div>
                  <h3 className="mb-1.5 text-[1.2rem]">{c.title}</h3>
                  <p className="text-[0.9rem] text-muted">{c.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-[22px]">
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-[18px] border border-line-cool bg-surface p-[22px]">
              <div className="flex items-center gap-5">
                <svg viewBox="0 0 96 96" className="h-24 w-24 flex-none">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="var(--surface-2)" strokeWidth="9" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray="251"
                    strokeDashoffset="75"
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                <div>
                  <div className="font-display text-[1.2rem] font-semibold">Your progress</div>
                  <div className="text-[0.9rem] text-muted">70% of Current Affairs complete · 3-day streak</div>
                </div>
              </div>
              <div className="max-w-[34ch] text-[0.9rem] text-muted">
                A dashboard tracks what you&apos;ve watched, your test scores, and your study streak — so momentum is visible.
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="doubts" className="py-[70px]">
        <div className={wrap}>
          <FadeIn>
            <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-[50px]">
              <div>
                <span className="eyebrow">05 · Doubt desk</span>
                <h3 className="mt-3 text-[clamp(1.6rem,3.4vw,2.2rem)]">Questions live here — not your WhatsApp.</h3>
                <p className="mt-3 text-muted">
                  No sharing the mentor&apos;s number, no midnight messages, no chaotic group. Students ask on the platform; the mentor answers during the hours they choose. Boundaries for the teacher, clear answers for everyone.
                </p>
                <ul className="mt-[18px] grid gap-2.5">
                  {[
                    "The mentor's phone number is never shared",
                    "Mentor sets office hours — questions are answered then",
                    "Answers are saved to a searchable FAQ, so repeats fade",
                    "Ask by subject; a daily limit keeps it civil",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.96rem]">
                      <span className="text-amber">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[18px] border border-line-cool bg-surface p-[22px]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-cool pb-3.5">
                  <span className="font-data text-[0.72rem] text-muted">OFFICE HOURS</span>
                  <span className="font-data text-[0.7rem] text-live">🔒 Number stays private</span>
                </div>
                <div className="my-3.5 flex flex-wrap gap-2">
                  {["Mon 8–9 PM", "Wed 8–9 PM", "Sat 5–6 PM"].map((t) => (
                    <span key={t} className="rounded-md border border-line px-2.5 py-1.5 font-data text-[0.72rem] text-amber">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mb-3 text-[0.86rem]">
                  <div className="text-muted">
                    <b className="text-text">Sana</b> · <span className="font-data text-[0.66rem]">Précis</span>
                  </div>
                  <div className="mt-0.5">How strict is the one-third length rule?</div>
                  <div className="mt-1.5 rounded-md border-l-2 border-live bg-[rgba(47,184,160,0.1)] px-2.5 py-2 text-muted">
                    <b className="text-amber-bright">Mentor:</b> Aim for one-third, ±10% is fine. <span className="text-live">✓ Answered</span>
                  </div>
                </div>
                <div className="text-[0.86rem]">
                  <div className="text-muted">
                    <b className="text-text">Bilal</b> · <span className="font-data text-[0.66rem]">Current Affairs</span>
                  </div>
                  <div className="mt-0.5">Best source for IMF updates?</div>
                  <div className="mt-1.5 font-data text-[0.72rem] text-muted">⏳ Queued · answered in next office hours</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="access" className="py-[70px]">
        <div className={wrap}>
          <FadeIn>
            <div className="mb-[42px] max-w-[620px]">
              <span className="eyebrow">06 · Access &amp; trial</span>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)]">See what&apos;s inside. Try it free. Then unlock.</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {accessSteps.map((s) => (
              <FadeIn key={s.n}>
                <div className="h-full rounded-[18px] border border-line-cool bg-surface p-6">
                  <div className="font-data text-[0.8rem] text-amber">{s.n}</div>
                  <h3 className="my-2.5 text-[1.15rem]">{s.title}</h3>
                  <p className="text-[0.9rem] text-muted">{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-5">
            <div className="flex items-center gap-3.5 rounded-[18px] border border-line-cool bg-surface p-[22px]">
              <span className="text-[1.4rem]">🔐</span>
              <div>
                <b>One account, your devices only.</b>{" "}
                <span className="text-muted">Each membership is limited to a small number of devices with a login cap — no sharing one account across a whole batch.</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="pricing" className="py-[70px]">
        <div className={wrap}>
          <FadeIn>
            <div className="mx-auto mb-[42px] max-w-[620px] text-center">
              <span className="eyebrow">Membership</span>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)]">One plan. Everything included.</h2>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="mx-auto max-w-[460px] rounded-3xl border border-amber bg-[linear-gradient(180deg,var(--surface),var(--bg-2))] p-[38px] text-center shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
              <span className="mb-4 inline-block rounded-full bg-[rgba(47,184,160,0.15)] px-[15px] py-[7px] font-data text-[0.74rem] text-live">
                3 days free — full access
              </span>
              <div className="font-display text-[3.2rem] font-bold">
                Rs 5,000<small className="font-body text-[1rem] font-normal text-muted"> / month</small>
              </div>
              <p className="text-[0.9rem] text-muted">Cancel anytime. During the trial you can watch everything and join live.</p>
              <ul className="my-[22px] grid gap-2.5 text-left">
                {[
                  "All live classes + full recordings library",
                  "Notes, slides & past papers",
                  "Tests, mock exams & essay feedback",
                  "AI study assistant",
                  "Secure, watermarked playback",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.94rem]">
                    <span className="font-bold text-live">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`${btnPrimary} w-full`}>Start 3-day free trial</Link>
              <div className="mt-4 font-data text-[0.72rem] text-muted">Easypaisa &amp; JazzCash (Pakistan) · Payoneer (international)</div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="mt-[30px] border-t border-line-cool py-[42px] pb-[56px]">
        <div className={`${wrap} flex flex-wrap justify-between gap-6`}>
          <div>
            <div className="flex items-center gap-2.5 font-display text-[1.4rem] font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--amber-bright),var(--amber))] font-bold text-[#241400]">
                ✒
              </span>
              Mentora
            </div>
            <p className="mt-3 max-w-[44ch] text-[0.78rem] text-muted">
              Mentora is an independent learning platform for CSS and competitive-exam aspirants. Lectures are protected and licensed for personal study only.
            </p>
          </div>
          <div className="flex gap-[38px]">
            <div>
              <a href="#live" className="block py-1.5 text-[0.88rem] text-muted hover:text-amber-bright">Live classes</a>
              <a href="#secure" className="block py-1.5 text-[0.88rem] text-muted hover:text-amber-bright">Secure recordings</a>
              <a href="#practice" className="block py-1.5 text-[0.88rem] text-muted hover:text-amber-bright">Practice</a>
            </div>
            <div>
              <a href="#pricing" className="block py-1.5 text-[0.88rem] text-muted hover:text-amber-bright">Pricing</a>
              <Link href="/login" className="block py-1.5 text-[0.88rem] text-muted hover:text-amber-bright">Sign in</Link>
              <a href="#" className="block py-1.5 text-[0.88rem] text-muted hover:text-amber-bright">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
