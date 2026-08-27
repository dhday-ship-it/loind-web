-- 새 Supabase 프로젝트에서 SQL Editor에 붙여넣고 실행하세요.
-- (기존 프로젝트에 있던 stories 테이블 + RLS 정책 + storage 버킷을 재현합니다)

-- 1. stories 테이블
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  img text not null,
  text text not null,
  summary text,
  detail text not null,
  link text,
  is_recommended boolean not null default false,
  is_home_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- 기존 프로젝트용: 컬럼이 없으면 추가 (메인페이지 노출 스토리 선택용)
alter table public.stories
  add column if not exists is_home_featured boolean not null default false;

alter table public.stories enable row level security;

-- 누구나(비로그인 포함) 조회 가능
create policy "Public can read stories"
  on public.stories for select
  to anon, authenticated
  using (true);

-- 로그인한 사용자(관리자)만 작성/수정/삭제 가능
create policy "Authenticated can insert stories"
  on public.stories for insert
  to authenticated
  with check (true);

create policy "Authenticated can update stories"
  on public.stories for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete stories"
  on public.stories for delete
  to authenticated
  using (true);

-- 2. 이미지 업로드용 storage 버킷
insert into storage.buckets (id, name, public)
values ('story-images', 'story-images', true)
on conflict (id) do nothing;

create policy "Public can read story images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'story-images');

create policy "Authenticated can upload story images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'story-images');

create policy "Authenticated can update story images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'story-images');

create policy "Authenticated can delete story images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'story-images');
