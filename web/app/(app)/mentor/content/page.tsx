import { createClient } from "@/lib/supabase/server";
import { createPaper, createTopic, createLesson, uploadAttachment, toggleFreePreview } from "@/lib/actions/content";

export default async function MentorContentPage() {
  const supabase = await createClient();

  const [{ data: papers }, { data: topics }, { data: lessons }, { data: attachments }] = await Promise.all([
    supabase.from("papers").select("*").order("sort_order"),
    supabase.from("topics").select("*").order("sort_order"),
    supabase.from("lessons").select("*").order("sort_order"),
    supabase.from("attachments").select("*"),
  ]);

  const topicsByPaper = new Map<string, typeof topics>();
  for (const t of topics ?? []) {
    topicsByPaper.set(t.paper_id, [...(topicsByPaper.get(t.paper_id) ?? []), t]);
  }
  const lessonsByTopic = new Map<string, typeof lessons>();
  for (const l of lessons ?? []) {
    lessonsByTopic.set(l.topic_id, [...(lessonsByTopic.get(l.topic_id) ?? []), l]);
  }
  const attachmentsByLesson = new Map<string, typeof attachments>();
  for (const a of attachments ?? []) {
    attachmentsByLesson.set(a.lesson_id, [...(attachmentsByLesson.get(a.lesson_id) ?? []), a]);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[18px] border border-line-cool bg-surface p-6">
        <h2 className="text-[1.2rem]">Add a paper</h2>
        <form action={createPaper} className="mt-3 flex flex-wrap gap-3">
          <input name="code" placeholder="C-01" required className="w-28 rounded-lg border border-line-cool bg-surface-2 px-3 py-2 text-sm" />
          <input name="title" placeholder="Essay" required className="flex-1 rounded-lg border border-line-cool bg-surface-2 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-[#241400]">Add paper</button>
        </form>
      </div>

      {(papers ?? []).map((paper) => (
        <div key={paper.id} className="rounded-[18px] border border-line-cool bg-surface p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-line px-1.5 py-0.5 font-data text-[0.7rem] text-amber">{paper.code}</span>
            <h3 className="text-[1.3rem]">{paper.title}</h3>
          </div>

          <form action={createTopic} className="mt-4 flex flex-wrap gap-3">
            <input type="hidden" name="paper_id" value={paper.id} />
            <input name="title" placeholder="New topic title" required className="flex-1 rounded-lg border border-line-cool bg-surface-2 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-lg border border-line-cool px-4 py-2 text-sm text-amber-bright hover:border-amber">+ Topic</button>
          </form>

          <div className="mt-4 grid gap-3">
            {(topicsByPaper.get(paper.id) ?? []).map((topic) => (
              <div key={topic.id} className="rounded-xl border border-line-cool bg-surface-2 p-4">
                <h4 className="text-[1.05rem]">{topic.title}</h4>

                <form action={createLesson} className="mt-3 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="topic_id" value={topic.id} />
                  <input name="title" placeholder="Lesson title" required className="flex-1 rounded-lg border border-line-cool bg-bg-2 px-3 py-2 text-sm" />
                  <input name="video_id" placeholder="Video ID (optional)" className="w-44 rounded-lg border border-line-cool bg-bg-2 px-3 py-2 text-sm" />
                  <label className="flex items-center gap-1.5 text-[0.8rem] text-muted">
                    <input type="checkbox" name="is_free_preview" /> Free preview
                  </label>
                  <button type="submit" className="rounded-lg border border-line-cool px-3 py-2 text-sm text-amber-bright hover:border-amber">+ Lesson</button>
                </form>

                <div className="mt-3 grid gap-2">
                  {(lessonsByTopic.get(topic.id) ?? []).map((lesson) => (
                    <div key={lesson.id} className="rounded-lg border border-line-cool bg-bg-2 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-data text-[0.66rem] uppercase text-muted">{lesson.type}</span>
                          <span>{lesson.title}</span>
                        </div>
                        <form action={toggleFreePreview.bind(null, lesson.id, !lesson.is_free_preview)}>
                          <button
                            type="submit"
                            className={`rounded-md border px-2 py-1 font-data text-[0.68rem] ${
                              lesson.is_free_preview
                                ? "border-live text-live"
                                : "border-line-cool text-muted"
                            }`}
                          >
                            {lesson.is_free_preview ? "Free preview" : "Make free preview"}
                          </button>
                        </form>
                      </div>

                      <ul className="mt-2 flex flex-wrap gap-2">
                        {(attachmentsByLesson.get(lesson.id) ?? []).map((a) => (
                          <li key={a.id} className="rounded-md border border-line-cool px-2 py-1 font-data text-[0.68rem] text-muted">
                            {a.kind}: {a.title}
                          </li>
                        ))}
                      </ul>

                      <form action={uploadAttachment} className="mt-2 flex flex-wrap items-center gap-2">
                        <input type="hidden" name="lesson_id" value={lesson.id} />
                        <select name="kind" className="rounded-lg border border-line-cool bg-surface px-2 py-1.5 text-[0.8rem]">
                          <option value="notes">Notes</option>
                          <option value="slides">Slides</option>
                          <option value="pastpaper">Past paper</option>
                        </select>
                        <input type="file" name="file" required className="text-[0.8rem]" />
                        <button type="submit" className="rounded-lg border border-line-cool px-3 py-1.5 text-[0.78rem] text-amber-bright hover:border-amber">
                          Upload
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
