# Oral exam video storage setup

1. Create a Supabase project and copy its Project URL and publishable/anon key into `.env` using `.env.example` as a template. These are browser-safe values; never put a service-role key in Vite variables.
2. Run `oral_exam_setup.sql` in the Supabase SQL Editor.
3. Enable Supabase Auth and create student and teacher accounts. The existing app login is a local demo and does not authenticate with Supabase.
4. Create one `public.profiles` row for each Auth user. Set `id` to the Auth user's UUID, `registration_number` for students, and `role` to `student`, `teacher`, or `admin`. Only trusted project administrators should provision profiles and assign staff roles.
5. Connect the student and staff login pages to Supabase Auth before using live uploads. This is required because the storage and database policies reject users without the matching Supabase identity and profile.
6. Restart the Vite app after setting environment variables. Students then upload to the private `oral-exam-videos` bucket; authorized teachers can review videos in Admin → Results & Certificates.

The app stores video bytes in private object storage and metadata in `oral_exam_submissions`. Teachers receive five-minute signed URLs when they open a video. The SQL sets a 500 MiB file limit and accepts WebM, MP4, and QuickTime media.
