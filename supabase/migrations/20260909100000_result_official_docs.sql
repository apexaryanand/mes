-- Official result sheets and appeal tracking
create type public.appeal_status as enum ('none', 'open', 'under_review', 'closed');

alter table public.result_sets
  add column if not exists appeal_status public.appeal_status not null default 'none',
  add column if not exists official_sheet_url text,
  add column if not exists official_sheet_signed_by text;
