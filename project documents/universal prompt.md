Prompt 1: The Identity & Manifesto
I am building a web app called Pallinky. I am a solo, non-developer; simplicity and maintenance are my absolute priorities. I am going to provide my project context in three stages.

Stage 1 is my Project Manifesto. Please read this to understand my tech stack, the branding logic, and my current architectural status. Do not write any code yet. Just confirm you have understood the 'Solo Creator' stance and the 'Tarti-flette' (Local Dev) vs 'Pallinky' (Production) standards.

[PASTE THE V3.7 MANIFESTO HERE]

Prompt 2: The Database & Security
Stage 2 is my Database State. It contains Supabase schemas and RPCs.

Key Focus Areas:

Host Management: We have transitioned to manage_handle. Pay close attention to the create_event_draft function and how get_event_by_manage_token resolves the handle.

Security Model: Almost all logic is moved into SECURITY DEFINER RPCs to bypass RLS for simplicity.

Constraint Warning: rsvps.email_lc is a generated column. DO NOT include it in INSERT statements or the DB will throw error 428C9.

Hashing: Consistency is key. Always use public.sha256_hex(p_token) for token security inside the database.

[PASTE THE DATABASE_STATE_JSON.MD CONTENT HERE]

Prompt 3: The Core Implementation & Infrastructure
Stage 3 Part 1: The Engines.
These files are for context. Do not refactor them unless explicitly asked. Use them to learn my URL-parameter state management, the Guest/Host view logic, and the "Tikkie-style" progression.

[PASTE: src/app/create/details/page.tsx] (The creation flow)

[PASTE: src/app/m/[token]/page.tsx] (The Host Management dashboard)

[PASTE: src/app/e/[slug]/page.tsx] (The Guest RSVP view)

Stage 3 Part 2: The Infrastructure.
Use these to understand the 'Shell' (mobile-first UI), the dynamic branding logic, and the Supabase connection.

CRITICAL TIME LOGIC: The "Amsterdam Standard"

Local-First: All user inputs (dates/times) are treated as Europe/Amsterdam time.

DB Storage: Times are stored in Supabase as UTC.

ICS Rules: Calendar invites must handle the Amsterdam offset correctly. Do not use generic UTC for guest-facing calendar links. Ask for src/lib/time.ts if a task involves date calculations.

[PASTE: src/app/layout.tsx] (Dynamic Title: Pallinky vs. Tarti-flette)

[PASTE: src/app/api/worker/outbox/route.ts] (Dynamic baseUrl logic)

[PASTE: src/components/Shell.tsx] (The UI wrapper and notch support)

[PASTE: src/components/ArrowNav.tsx] (The navigation standard)

You are now my Senior Developer. Confirm you are ready for your first task and summarize the project based on these three stages.