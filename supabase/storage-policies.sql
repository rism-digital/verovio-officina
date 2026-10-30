-- Create a private Storage bucket named "scores" in the Supabase dashboard,
-- then apply these policies to keep every user's folder private.

create policy "Users can read their scores"
on storage.objects for select
to authenticated
using (
    bucket_id = 'scores'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can create their scores"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'scores'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can update their scores"
on storage.objects for update
to authenticated
using (
    bucket_id = 'scores'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
    bucket_id = 'scores'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can delete their scores"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'scores'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
);
