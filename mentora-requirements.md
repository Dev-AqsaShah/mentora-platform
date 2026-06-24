# Mentora — Full Build Requirements Document

**For:** Claude Code (hand this whole file over to build the product, top to bottom)
**Product:** Mentora — a subscription learning platform where one mentor teaches CSS / competitive-exam prep through live classes that are auto-recorded into a secure, watermarked, non-downloadable library, with tests, essay feedback, and an AI study assistant.
**Reference design:** Build the UI to match `mentora-design.html` exactly — same colors, fonts, the secure player with moving watermark, calm animations, and the scroll-highlight statement.

> **Audience:** CSS (Central Superior Services) and competitive-exam aspirants in Pakistan (plus international members). Single mentor to start; the architecture should allow more mentors later.

---

## 1. What we are building (one paragraph)

A web app where a mentor conducts live classes that are automatically saved as recordings. Students subscribe monthly to attend live and rewatch recordings. Recordings stream through protected (DRM) playback with no download option, and a moving per-viewer watermark (name + email) rides across every frame to trace leaks. Before subscribing, visitors can browse the syllabus and a few free previews; a 3-day free trial unlocks everything; after the trial, content locks and only the catalogue stays visible. The platform also provides tests/mock exams, assignment submission with mentor feedback, an AI study assistant, a progress dashboard, and a mentor/admin dashboard. Accounts are protected against sharing via device and login limits.

---

## 2. The 9 core features (all required)

1. **Account-sharing protection** — device binding + concurrent-login cap so one membership can't be shared across a batch.
2. **Live classes** — low-latency live video with live chat, raise-hand, polls; class calendar + reminders; attendance tracking.
3. **Secure recordings** — auto-saved after each class into a library; encrypted/DRM streaming, no download, moving per-viewer watermark.
4. **Organised content** — syllabus by paper/topic; mentor can upload lectures, notes, slides, and past papers anytime.
5. **Tests & assignments** — auto-graded MCQ quizzes, timed mock exams/past papers, and essay/précis submission with mentor feedback.
6. **AI study assistant** — essay/précis evaluation, lecture summaries, flashcards, generated practice questions (Anthropic Claude API).
7. **Free trial & paywall** — catalogue visible before paying; 3-day full-access trial; content locks after trial.
8. **Mentor / Admin dashboard** — upload content, schedule classes, manage students, grade assignments, view revenue.
9. **Notifications** — class starting, new recording, new assignment/test, trial/renewal reminders.
10. **Doubt desk (in-platform Q&A with office hours)** — students ask questions on the platform instead of WhatsApp; the mentor's number stays private; questions are answered during mentor-set office hours; answers build a searchable FAQ so repeats drop.

---

## 3. Tech stack (recommended)

- **Framework:** Next.js (App Router) + TypeScript + React
- **Styling:** Tailwind CSS, reproducing the exact design tokens in Section 5 (no default Tailwind palette)
- **Database:** PostgreSQL via **Supabase**
- **Auth:** Supabase Auth (email+password and Google)
- **Video — recordings:** a managed video platform that supports **DRM + dynamic/forensic watermarking** and HLS streaming with signed, expiring URLs — e.g. **Mux**, **Cloudflare Stream**, or **Bunny Stream**. Do NOT serve raw mp4 files.
- **Video — live:** start simple by embedding a live provider (e.g. Zoom/Meet or **LiveKit/Agora**); auto-push the recording into the video platform after class. LiveKit/Agora give the most control for in-app live + chat.
- **File storage:** Supabase Storage (private) for notes/slides/past papers, served via signed URLs (view-only PDFs where possible).
- **AI:** Anthropic Claude API (server-side only).
- **Email:** transactional provider (e.g. Resend) for notifications.
- **Hosting:** Vercel; scheduled jobs via Vercel Cron (trial/subscription expiry, reminders).
- **Payments:** Easypaisa + JazzCash (Pakistan), Payoneer (international) — Section 10.

All secrets live in environment variables only — never client-side, never in git.

---

## 4. Pages / screens

1. **Landing page** — exactly as `mentora-design.html`.
2. **Sign up / Log in.**
3. **Catalogue (public/preview)** — syllabus, lecture titles, free preview lectures.
4. **Dashboard / Home** — upcoming live class, continue watching, progress, streak.
5. **Live class room** — video + chat + raise-hand + polls.
6. **Recordings library** — by paper/topic, searchable; secure player.
7. **Lesson page** — recording + attached notes/slides + lesson MCQ.
8. **Tests & mock exams** — list, timed test runner, results.
9. **Assignments** — submit essay/précis, view mentor feedback.
10. **AI assistant** — chat + essay evaluation + tools.
11. **My progress** — watched %, scores, streak, attendance.
12. **Membership** — trial status, subscribe, manage/cancel, devices.
13. **Settings** — account, notifications, registered devices, delete account.
14. **Mentor/Admin dashboard** — Section 9.

---

## 5. Design system (must match the design file)

**Colors (CSS variables):**
- `--bg:#0A1820` (background) · `--bg-2:#0E2430` · `--surface:#12303C` · `--surface-2:#163745`
- `--amber:#F0A24B` · `--amber-bright:#FBBF6B` (primary accent / CTAs)
- `--live:#2FB8A0` (LIVE / online / success)
- `--text:#EAF1F1` · `--muted:#8FA6AE`
- `--line:rgba(240,162,75,.18)` · `--line-cool:rgba(143,166,174,.18)`

**Typography (Google Fonts):**
- Display / headings: **Sora** (600/700)
- Body / UI: **DM Sans**
- Data, labels, timers, codes, "LIVE": **JetBrains Mono**

**Signature elements to carry through the app:**
- The **secure player** with a moving per-viewer watermark is the core, recognizable pattern — reuse it everywhere recordings play.
- Calm motion: fade-up on scroll, scroll-word-highlight on key statements, pulsing LIVE dot, audio waveform on live, hover lifts. Respect `prefers-reduced-motion`.
- **Quality floor:** mobile-responsive, visible keyboard focus, reduced-motion respected.
- **Tone:** focused, encouraging, plain-spoken — discipline and momentum, not hype.

---

## 6. Detailed feature requirements

### 6.1 Account-sharing protection
- Each membership allows a **small device limit** (e.g. 2 devices) and a **concurrent-session cap** (e.g. 1 active stream at a time).
- Register device fingerprints; new device beyond the limit must replace an old one (with a cooldown to prevent rotation abuse).
- Block simultaneous playback from multiple IPs/devices on one account.

### 6.2 Live classes
- Low-latency live video; **live chat, raise-hand, and polls** during class.
- **Class calendar** with reminders (in-app + email) before each session.
- **Attendance** recorded per student per session.
- On class end, the recording is **automatically** processed and published to the library.

### 6.3 Secure recordings (critical)
- Stream via **DRM-protected HLS** with **signed, expiring URLs**; never expose a raw downloadable file; hide/disable download UI.
- **Moving per-viewer watermark** (student name + email + id) rendered over playback, drifting position so it can't be cropped out.
- **Honesty in product + docs:** web playback cannot fully prevent screen recording; the watermark is a deterrent and a forensic trace, not a guarantee. (A future mobile app can use FLAG_SECURE on Android and capture detection on iOS for stronger protection.)
- Recordings organised by paper/topic, searchable.

### 6.4 Organised content & mentor uploads
- Syllabus structured as **paper → topic → lesson**.
- Mentor can upload: recorded lectures (outside live), notes, slides, and **past papers**.
- Documents served as **view-only / watermarked** where possible; never public URLs.

### 6.5 Tests & assignments
- **MCQ quizzes** per lesson, auto-graded, with explanations.
- **Timed mock exams / past papers** with a countdown and auto-submit.
- **Assignment submission** (essay/précis): student submits text; **mentor grades and leaves feedback**. This is the highest-value feature for CSS — make it smooth.
- Scores feed the progress dashboard.

### 6.6 AI study assistant (Anthropic Claude API)
- **Essay/précis evaluation:** structured feedback (structure, argument, language, relevance) with a suggested band — clearly marked as AI guidance, not the official mark.
- **Lecture summaries & flashcards** generated from lesson material.
- **Practice MCQ generation** by topic; **current-affairs quizzes**.
- **Q&A** about lessons. Server-side only; cache where possible; cap usage for cost.

### 6.7 Free trial & paywall logic
- **Before subscribing:** catalogue (syllabus + lesson titles) and a few **free preview lectures** are visible.
- **3-day free trial:** full access (live + recordings + practice). Set `trial_ends_at = now + 3 days`.
- **After trial (no active subscription):** content locks; only the catalogue + previews stay visible. Access is open while `trial_ends_at` OR `premium_until` is in the future.

### 6.8 Progress & engagement
- Dashboard: watched %, test scores, attendance, and **study streak**.
- "Continue watching" and "next up" suggestions.
- Optional doubt-solving: a Q&A thread per lesson or scheduled doubt sessions.

---

### 6.9 Doubt desk (in-platform Q&A + office hours) — solves the WhatsApp problem
The problem this replaces: the mentor's personal number leaks to students, and they message in groups at all hours. Mentora keeps all questions inside the platform.
- **Mentor's contact stays private** — no phone numbers shared; all Q&A happens in-app.
- **Office hours:** the mentor sets availability windows (e.g. Mon/Wed/Sat evenings). Students can post questions anytime, but they sit in a **queue** and are answered during those windows. Outside hours, the desk clearly shows "answered during office hours."
- **Ask by subject/lesson:** each question is tagged to a paper/lesson and threaded, so nothing gets lost the way it does in a group.
- **Public vs private:** a question can be answered publicly (visible to all students) or privately. Public answers feed a **searchable FAQ / knowledge base**, so the same question isn't asked repeatedly.
- **Etiquette controls:** a per-student daily question limit and AI moderation on questions (same pipeline as chat) to keep it civil and spam-free.
- **Optional live doubt sessions:** the mentor can run a scheduled, time-boxed group doubt session that ends automatically — a structured alternative to an always-on group.
- **Boundaries by design:** students are notified when their question is answered; the mentor clears the queue during chosen hours instead of being on call 24/7.

---

## 7. Monetization

- **One main plan** (display: **Rs 5,000/month** placeholder — make configurable; show PKR for Pakistani users, USD for international).
- Optional later: a recordings-only **Basic** tier vs a **Premium** tier (live + assignment feedback + mock evaluation); one-time subject bundles or mock-exam packs.
- **3-day free trial** then monthly subscription (Section 6.7).

---

## 8. Payments

Use one internal, provider-agnostic interface: `createPayment → confirmPayment(webhook/callback, verified server-side) → extend premium_until by 30 days`.

- **Pakistan:** Easypaisa + JazzCash. Weak at automatic recurring billing, so implement subscriptions as **manual monthly renewal** (pay → 30 days access → reminder → pay again). Funds settle to the founder's National Bank of Pakistan account.
- **International:** Payoneer (also manual renewal given limited recurring support).
- Verify every payment **server-side** with the provider secret (env vars) before extending access.
- Store payment records; keep the layer provider-agnostic so a Merchant of Record (Paddle/Lemon Squeezy) or Stripe-via-foreign-company can be added later.
- **Security:** real merchant/Payoneer credentials and bank details go into deployment env vars / each provider's dashboard — never in code, this doc, or chat.

---

## 9. Mentor / Admin dashboard

- **Content:** create papers/topics/lessons; upload lectures, notes, slides, past papers; mark lessons as free previews.
- **Live:** schedule classes (calendar), start a live session, see attendance.
- **Practice:** build MCQ quizzes and mock exams; set timers.
- **Grading:** queue of submitted essays/précis; leave marks + written feedback.
- **Doubt desk:** set/edit office hours; see the question queue; answer (publicly to FAQ or privately); run scheduled live doubt sessions; set per-student daily question limit.
- **Students:** list, status (trial/active/expired), devices, suspend/ban.
- **Revenue:** payments list, active subscribers, trial conversions, basic metrics.
- **Moderation:** review reported chat messages (live class chat is AI-moderated too).

---

## 10. Notifications (email + in-app)

- Live class starting soon (e.g. 30 min before) and "we're live now"
- New recording available
- New assignment / new test posted; assignment feedback returned
- Test result ready
- Trial ending soon and trial ended
- Subscription renewal reminder; payment confirmed/failed
- New device login on your account (security)
- Your question was answered (student); office hours starting / new questions in queue (mentor)

Users manage preferences in Settings.

---

## 11. Database schema (starting point)

- **users:** id, email, auth_provider, role (student/mentor/admin), status, created_at, `trial_ends_at`, `premium_until`.
- **devices:** user_id, device_fingerprint, last_seen, created_at.
- **sessions_active:** user_id, stream_token, started_at (for concurrent-stream cap).
- **papers:** id, code, title, order.
- **topics:** id, paper_id, title, order.
- **lessons:** id, topic_id, title, type (live/recorded), video_id (DRM provider ref), is_free_preview, published_at.
- **attachments:** lesson_id, kind (notes/slides/pastpaper), storage_path.
- **live_classes:** id, lesson_id, scheduled_at, status, recording_video_id.
- **attendance:** user_id, live_class_id, joined_at, minutes.
- **quizzes:** id, lesson_id, type (mcq/mock), time_limit.
- **questions:** quiz_id, prompt, options, correct, explanation.
- **attempts:** user_id, quiz_id, score, answers, submitted_at.
- **assignments:** id, lesson_id/title, prompt, type (essay/precis).
- **submissions:** assignment_id, user_id, text, ai_feedback, mentor_marks, mentor_feedback, status, created_at.
- **progress:** user_id, lesson_id, watched_pct, last_position, completed.
- **office_hours:** mentor_id, weekday, start_time, end_time.
- **doubts:** id, student_id, paper_id/lesson_id, question, status (queued/answered), visibility (public/private), created_at.
- **doubt_answers:** doubt_id, mentor_id, answer, answered_at.
- **payments:** id, user_id, provider, amount, currency, txn_id, status, created_at.
- **notifications:** id, user_id, type, payload, read, created_at.

Enforce row-level security: students read only permitted content (and only while trial/subscription is active); mentor/admin have elevated access.

---

## 12. Environment variables (server-side only)

- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL_*`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Video provider: e.g. `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`, `MUX_SIGNING_KEY` (or Cloudflare/Bunny equivalents) + DRM/watermark config
- Live provider: `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` (or Zoom SDK creds)
- `RESEND_API_KEY`
- `JAZZCASH_MERCHANT_ID`, `JAZZCASH_PASSWORD`, `JAZZCASH_INTEGRITY_SALT`
- `EASYPAISA_MERCHANT_ID`, `EASYPAISA_SECRET`
- `PAYONEER_*`
- `PRICE_PKR=5000`, `PRICE_USD`, `TRIAL_DAYS=3`, `DEVICE_LIMIT=2`, `CONCURRENT_STREAMS=1`, `DOUBTS_PER_DAY=3`
- `APP_URL`

The founder adds real values directly in the deployment environment.

---

## 13. Key user flows (step by step)

**A. New student → first class**
1. Sign up → browse catalogue/previews → start 3-day trial.
2. See upcoming live class on dashboard → join live (chat/poll/raise-hand) → attendance recorded.
3. After class, recording appears in library → rewatch with watermark, no download.
4. Take the lesson MCQ → score saved to progress.

**B. Watching a recording**
1. Open lesson → player requests a signed DRM stream URL (server checks active trial/subscription).
2. Per-viewer watermark (name+email+id) drifts across the video.
3. Download is disabled; concurrent-stream cap enforced server-side.

**C. Assignment**
1. Student submits an essay/précis.
2. AI gives instant structured feedback; mentor later adds official marks + feedback.
3. Student notified when mentor feedback is ready.

**D. Trial → subscription**
1. Trial ends in 1 day → reminder.
2. Student pays via Easypaisa/JazzCash/Payoneer → server verifies → `premium_until = now + 30 days`.
3. Near expiry → renewal reminder → repeat. If lapsed → content locks, catalogue stays visible.

---

## 14. Build order (phases)

**Phase 1 — MVP:** landing page; auth; catalogue + previews; recordings library with **secure DRM player + moving watermark**; lessons + notes; 3-day trial + paywall lock; subscription via Easypaisa/JazzCash/Payoneer (manual renewal); account-sharing protection (device + concurrent-stream limits).

**Phase 2 — Live & practice:** live classes (chat/poll/raise-hand) + auto-recording; attendance; MCQ quizzes + mock exams; assignment submission + mentor feedback; **doubt desk (office hours + Q&A + FAQ)**; progress dashboard; notifications; mentor/admin dashboard.

**Phase 3 — AI & polish:** AI study assistant (essay evaluation, summaries, flashcards, generated MCQs); doubt-solving; metrics; tier/bundle options; international refinements.

---

## 15. Non-negotiables / quality bar

- Recordings never downloadable; always DRM-streamed with a moving per-viewer watermark.
- Access checks enforced **server-side** (signed URLs, trial/subscription state, device/stream limits).
- Match exactly the reference design's look and feel.
- Mobile-responsive, keyboard-accessible, `prefers-reduced-motion` respected.
- All secrets server-side / env vars only.
- Be honest in copy: watermark deters and traces leaks; it does not make recording impossible.

---

## 16. Open decisions for the founder

1. Final brand name — **Mentora** (alternatives: Markaz, Manzil, Iqra).
2. Exact monthly price in **PKR** (Rs 5,000 is the current placeholder).
3. Video provider choice (Mux vs Cloudflare Stream vs Bunny) — based on DRM/watermark support and price.
4. Live provider: embed Zoom/Meet to start, or in-app LiveKit/Agora.
5. Which Anthropic model strings for evaluation vs assistant.
6. Device limit and concurrent-stream cap values.
7. Domain name.

---

*End of requirements. Build Phase 1 first, confirm it works, then proceed to Phase 2 and 3.*
