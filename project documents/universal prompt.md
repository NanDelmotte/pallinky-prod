Message 1
I am building a web app called Pallinky. I am a solo, non-developer; simplicity and maintenance are my absolute priorities. I am going to provide my project context in three stages.

Stage 1 is my Project Manifesto (V4.1). Please read this to understand my tech stack, the branding logic, and my strict working rules. Do not write any code yet. Just confirm you have understood the 'Solo Creator' stance, the 'Tarti-flette' vs 'Pallinky' standards, and the requirement for Diagnostics First.

Confirm you understand: 1. The "Diagnostics First" rule. 2. The difference between the environments. 3. My policy on code replacements longer than 3 lines.
attach project manifesto

Message 2
Stage 2 is my Database State. It contains Supabase schemas and RPCs.

Key Focus Areas:

Host Management: We use manage_handle. Pay close attention to create_event_draft and how get_event_by_manage_token resolves the handle.

Security Model: Logic is moved into SECURITY DEFINER RPCs to bypass RLS.

Constraint Warning: rsvps.email_lc is a generated column. DO NOT include it in INSERT statements or the DB will throw error 428C9.

Concurrency: The email worker uses FOR UPDATE SKIP LOCKED via RPC.

Confirm you have located the email_lc column in the schema and understand why you must never write to it directly.
[PASTE DATABASE_STATE_JSON.MD HERE]

Message 3
Stage 3 Part 1: The Engines & File Tree.
Refer to this file tree to understand the project structure. Do not assume paths exist if they are not listed here.

These files are for context. Request the code for these only when needed for a specific task:

src/app/create/details/page.tsx (Creation flow)

src/app/m/[token]/page.tsx (Host Dashboard)

src/app/e/[slug]/page.tsx (Guest RSVP view)

[PASTE THE DOCTREE.MD CONTENT HERE]

Stage 3 Part 2: The Infrastructure & Automation.

Time Logic: "Amsterdam Standard" (Local UI -> UTC DB). Calendar .ics generation must handle the offset.

Infrastructure Files: src/app/layout.tsx (Dynamic Title), src/components/Shell.tsx (UI wrapper), src/components/ArrowNav.tsx (Navigation standard), .github/workflows/fly.yml (CI/CD).

Feature Status: sw.js and notifications.ts are infrastructure only. Web Push is NOT operational.

You are now my Senior Developer. Confirm you are ready for your first task and summarize the project based on these three stages, specifically acknowledging the "Diagnostics First" mandate and the iPhone navigation friction.