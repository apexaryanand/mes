export type Locale = "ml" | "en";

export type AppRole = "super_admin" | "war_room" | "media_team";

export type EventStatus =
  | "upcoming"
  | "live"
  | "completed"
  | "delayed"
  | "cancelled";

export type ResultSetStatus =
  | "draft"
  | "entered"
  | "verified"
  | "published"
  | "archived"
  | "correction_draft";

export type AppealStatus = "none" | "open" | "under_review" | "closed";

export type GradeCode = "A" | "B" | "C";
export type ItemKind = "individual" | "group";
export type MediaKind = "photo" | "video";
export type MediaSection = "gallery" | "reporting";
export type MediaStatus = "pending" | "approved" | "rejected";
export type LiveStatus = "upcoming" | "live" | "concluded";
export type HouseColor = "blue" | "red" | "yellow" | "green";

export const HOUSE_COLOR_HEX: Record<HouseColor, string> = {
  blue: "#2563eb",
  red: "#dc2626",
  yellow: "#eab308",
  green: "#16a34a",
};

export type ScoringRules = {
  grade_points: Record<GradeCode, number>;
  rank_points: Record<"1" | "2" | "3", number>;
  group_multiplier: number;
  grade_thresholds: Record<GradeCode, number>;
  max_marks: number;
};

export const DEFAULT_SCORING_RULES: ScoringRules = {
  grade_points: { A: 5, B: 3, C: 1 },
  rank_points: { "1": 0, "2": 0, "3": 0 },
  group_multiplier: 1,
  grade_thresholds: { A: 80, B: 70, C: 60 },
  max_marks: 100,
};

export type EventSettings = {
  id: string;
  slug: string;
  name_en: string;
  name_ml: string;
  venue_en: string;
  venue_ml: string;
  location_en: string;
  location_ml: string;
  start_date: string;
  end_date: string;
  current_day: number | null;
  live_status: LiveStatus;
  scoring_rules: ScoringRules;
};

export type House = {
  id: string;
  slug: string;
  code: string | null;
  name_en: string;
  name_ml: string;
  short_name: string | null;
  color: HouseColor | null;
};

export type Participant = {
  id: string;
  house_id: string;
  full_name: string;
  full_name_ml: string | null;
  class_name: string | null;
  chest_number: string | null;
  created_at: string;
  house?: House;
};

export type Category = {
  id: string;
  code: string;
  name_en: string;
  name_ml: string;
  sort_order: number;
};

export type Programme = {
  id: string;
  slug: string;
  code: string | null;
  name_en: string;
  name_ml: string;
  item_kind: ItemKind;
  allows_multiple_per_house: boolean;
};

export type Stage = {
  id: string;
  slug: string;
  name_en: string;
  name_ml: string;
  location_en: string | null;
  location_ml: string | null;
  sort_order: number;
};

export type ScheduledEvent = {
  id: string;
  slug: string;
  programme_id: string;
  category_id: string;
  stage_id: string;
  day_number: number;
  event_date: string;
  start_time: string;
  end_time: string | null;
  status: EventStatus;
  notes: string | null;
};

export type ScheduledEventView = ScheduledEvent & {
  programme: Programme;
  category: Category;
  stage: Stage;
};

export type ResultSet = {
  id: string;
  scheduled_event_id: string;
  version: number;
  status: ResultSetStatus;
  supersedes_id: string | null;
  entered_by: string | null;
  verified_by: string | null;
  published_by: string | null;
  entered_at: string | null;
  verified_at: string | null;
  published_at: string | null;
  appeal_status: AppealStatus;
  official_sheet_url: string | null;
  official_sheet_signed_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ResultEntry = {
  id: string;
  result_set_id: string;
  house_id: string;
  participant_id: string | null;
  participant_name: string | null;
  marks: number | null;
  grade: GradeCode | null;
  rank: number | null;
  points: number;
};

export type ResultEntryView = ResultEntry & {
  house: House;
};

export type PublishedResultView = {
  event: ScheduledEventView;
  result_set: ResultSet;
  entries: ResultEntryView[];
};

export type HouseStanding = {
  house_id: string;
  house: House;
  total_points: number;
  grade_a_count: number;
  grade_b_count: number;
  grade_c_count: number;
  wins_count: number;
  overall_rank: number | null;
};

export type LiveUpdate = {
  id: string;
  stage_id: string | null;
  scheduled_event_id: string | null;
  reporter_name: string;
  body: string;
  media_url: string | null;
  media_kind: MediaKind | null;
  created_at: string;
  is_removed: boolean;
};

export type LiveUpdateView = LiveUpdate & {
  stage: Stage | null;
  event: ScheduledEventView | null;
};

export type Article = {
  id: string;
  slug: string;
  title_en: string;
  title_ml: string;
  excerpt_en: string;
  excerpt_ml: string;
  body_en: string;
  body_ml: string;
  cover_image_url: string | null;
  author_name: string;
  category: string;
  related_event_id: string | null;
  related_house_id: string | null;
  published_at: string | null;
  is_published: boolean;
};

export type Interview = {
  id: string;
  slug: string;
  winner_name: string;
  house_id: string;
  programme_id: string;
  scheduled_event_id: string | null;
  rank: number | null;
  description_en: string;
  description_ml: string;
  video_url: string;
  published_at: string | null;
  is_published: boolean;
};

export type InterviewView = Interview & {
  house: House;
  programme: Programme;
  event: ScheduledEventView | null;
};

export type MediaItem = {
  id: string;
  kind: MediaKind;
  section: MediaSection;
  title_en: string;
  title_ml: string;
  caption_en: string | null;
  caption_ml: string | null;
  url: string;
  thumbnail_url: string | null;
  scheduled_event_id: string | null;
  house_id: string | null;
  submitted_by_name: string | null;
  status: MediaStatus;
  published_at: string | null;
  created_at: string;
};

export type MediaItemView = MediaItem & {
  event: ScheduledEventView | null;
  house: House | null;
};

export type Profile = {
  id: string;
  display_name: string;
  role: AppRole;
  email: string | null;
  is_active: boolean;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export type SearchHit = {
  type: "house" | "programme" | "event" | "article";
  id: string;
  slug?: string;
  title_en: string;
  title_ml: string;
  href: string;
  subtitle_en?: string;
  subtitle_ml?: string;
};
