-- Align storage policies with the three-role staff model.

drop policy if exists pending_staff_read on storage.objects;
create policy pending_staff_read on storage.objects for select
  using (
    bucket_id = 'media-pending'
    and private.has_role(array['super_admin','war_room','media_team']::public.app_role[])
  );

drop policy if exists public_media_staff_write on storage.objects;
create policy public_media_staff_write on storage.objects for insert
  with check (
    bucket_id = 'media-public'
    and private.has_role(array['super_admin','war_room','media_team']::public.app_role[])
  );

drop policy if exists public_media_staff_update on storage.objects;
create policy public_media_staff_update on storage.objects for update
  using (
    bucket_id = 'media-public'
    and private.has_role(array['super_admin','war_room','media_team']::public.app_role[])
  );
