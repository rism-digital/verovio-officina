# Supabase cloud documents

1. Create a Supabase project.
2. In Storage, create a **private** bucket named `scores`.
3. Run [`storage-policies.sql`](./storage-policies.sql) in the SQL editor.
4. Enable the email authentication method. The app supports magic-link and
   password sign-in.
5. Add the local and deployed application URLs under Authentication → URL
   Configuration.
6. Copy `.env.example` to `.env.local` and set the project URL and publishable
   key. `VITE_SUPABASE_USER_QUOTA_MB` sets the client-enforced storage quota
   for each authenticated user and defaults to 20 MB.
7. Restart the Vite development server after changing environment variables.

The browser must only receive the publishable key. Do not put a secret or
service-role key in a `VITE_` environment variable.

Users can sign in with a magic link, then request a password setup/reset link
from the Account tab in the Cloud Documents dialog. The password form is only
shown after following that verified email link. Afterward, either the password
or another magic link can be used to sign in.

Documents are stored as:

```text
scores/{auth-user-id}/{document-name}.mei
```

The policies restrict listing, downloading, uploading, updating, and deleting
to the authenticated user's folder.

The per-user quota is checked by the browser repository before an upload and is
shown in the Cloud Documents dialog. It is intended as an initial usage guard,
not a security boundary: a user calling the Storage API outside the application
can bypass it. Authoritative quota enforcement requires routing uploads through
a trusted server or Edge Function.
