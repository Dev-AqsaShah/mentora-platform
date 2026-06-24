export type UserRole = "student" | "mentor" | "admin";
export type UserStatus = "active" | "suspended" | "banned";
export type LessonType = "live" | "recorded";
export type AttachmentKind = "notes" | "slides" | "pastpaper";
export type LiveClassStatus = "scheduled" | "live" | "ended" | "cancelled";
export type QuizType = "mcq" | "mock";
export type AssignmentType = "essay" | "precis";
export type SubmissionStatus = "pending" | "ai_reviewed" | "graded";
export type DoubtStatus = "queued" | "answered";
export type DoubtVisibility = "public" | "private";
export type PaymentProvider = "easypaisa" | "jazzcash" | "payoneer";
export type PaymentStatus = "pending" | "verified" | "failed";

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<{
        id: string;
        email: string;
        full_name: string | null;
        role: UserRole;
        status: UserStatus;
        trial_ends_at: string | null;
        premium_until: string | null;
        created_at: string;
      }>;
      devices: Table<{
        id: string;
        user_id: string;
        device_fingerprint: string;
        label: string | null;
        last_seen: string;
        created_at: string;
      }>;
      sessions_active: Table<{
        id: string;
        user_id: string;
        stream_token: string;
        lesson_id: string | null;
        started_at: string;
        last_heartbeat: string;
      }>;
      papers: Table<{
        id: string;
        code: string;
        title: string;
        sort_order: number;
        created_at: string;
      }>;
      topics: Table<{
        id: string;
        paper_id: string;
        title: string;
        sort_order: number;
        created_at: string;
      }>;
      lessons: Table<{
        id: string;
        topic_id: string;
        title: string;
        type: LessonType;
        video_id: string | null;
        is_free_preview: boolean;
        sort_order: number;
        published_at: string | null;
        created_by: string | null;
        created_at: string;
      }>;
      attachments: Table<{
        id: string;
        lesson_id: string;
        kind: AttachmentKind;
        title: string;
        storage_path: string;
        created_at: string;
      }>;
      live_classes: Table<{
        id: string;
        lesson_id: string | null;
        title: string;
        scheduled_at: string;
        status: LiveClassStatus;
        room_name: string;
        recording_video_id: string | null;
        started_at: string | null;
        ended_at: string | null;
        created_by: string;
        created_at: string;
      }>;
      attendance: Table<{
        id: string;
        user_id: string;
        live_class_id: string;
        joined_at: string;
        left_at: string | null;
        minutes: number;
      }>;
      live_chat_messages: Table<{
        id: string;
        live_class_id: string;
        user_id: string;
        body: string;
        created_at: string;
      }>;
      polls: Table<{
        id: string;
        live_class_id: string;
        question: string;
        options: string[];
        created_by: string;
        created_at: string;
        closed_at: string | null;
      }>;
      poll_votes: Table<{
        id: string;
        poll_id: string;
        user_id: string;
        option_index: number;
        created_at: string;
      }>;
      raised_hands: Table<{
        id: string;
        live_class_id: string;
        user_id: string;
        raised_at: string;
        cleared_at: string | null;
      }>;
      quizzes: Table<{
        id: string;
        lesson_id: string | null;
        title: string;
        type: QuizType;
        time_limit_minutes: number | null;
        created_by: string | null;
        created_at: string;
      }>;
      questions: Table<{
        id: string;
        quiz_id: string;
        prompt: string;
        options: string[];
        correct_index: number;
        explanation: string | null;
        sort_order: number;
      }>;
      attempts: Table<{
        id: string;
        user_id: string;
        quiz_id: string;
        score: number | null;
        answers: Record<string, number>;
        submitted_at: string;
      }>;
      assignments: Table<{
        id: string;
        lesson_id: string | null;
        title: string;
        prompt: string;
        type: AssignmentType;
        created_by: string | null;
        created_at: string;
      }>;
      submissions: Table<{
        id: string;
        assignment_id: string;
        user_id: string;
        text: string;
        ai_feedback: Record<string, unknown> | null;
        mentor_marks: number | null;
        mentor_feedback: string | null;
        status: SubmissionStatus;
        created_at: string;
      }>;
      progress: Table<{
        id: string;
        user_id: string;
        lesson_id: string;
        watched_pct: number;
        last_position: number;
        completed: boolean;
        updated_at: string;
      }>;
      office_hours: Table<{
        id: string;
        mentor_id: string;
        weekday: number;
        start_time: string;
        end_time: string;
      }>;
      doubts: Table<{
        id: string;
        student_id: string;
        paper_id: string | null;
        lesson_id: string | null;
        question: string;
        status: DoubtStatus;
        visibility: DoubtVisibility;
        created_at: string;
      }>;
      doubt_answers: Table<{
        id: string;
        doubt_id: string;
        mentor_id: string;
        answer: string;
        answered_at: string;
      }>;
      payments: Table<{
        id: string;
        user_id: string;
        provider: PaymentProvider;
        amount: number;
        currency: string;
        txn_id: string;
        status: PaymentStatus;
        raw_payload: Record<string, unknown> | null;
        created_at: string;
      }>;
      notifications: Table<{
        id: string;
        user_id: string;
        type: string;
        payload: Record<string, unknown>;
        read: boolean;
        created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      lesson_type: LessonType;
      attachment_kind: AttachmentKind;
      live_class_status: LiveClassStatus;
      quiz_type: QuizType;
      assignment_type: AssignmentType;
      submission_status: SubmissionStatus;
      doubt_status: DoubtStatus;
      doubt_visibility: DoubtVisibility;
      payment_provider: PaymentProvider;
      payment_status: PaymentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
