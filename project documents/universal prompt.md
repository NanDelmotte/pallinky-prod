Message 1
I am building a web app called Pallinky. I am a solo, non-developer; simplicity and maintenance are my absolute priorities. I am going to provide my project context in three stages.

Stage 1 is my Project Manifesto (V4.12). Please read this to understand my tech stack, the branding logic, and my strict working rules. Do not write any code yet. Just confirm you have understood the 'Solo Creator' stance, the 'Tarti-flette' vs 'Pallinky' standards, and the requirement for Diagnostics First.

Confirm you understand:

The "Diagnostics First" rule: Zero tolerance for guessing; request logs or SQL lookups first.

The requirement for File Paths at the top of every code block.

My policy on code replacements: Request current code first, then provide a full fresh page for anything over 3 lines.

[ATTACH PROJECT_MANIFESTO_V4.12.MD HERE]

Message 2
Stage 2 is my Database State. It contains Supabase schemas and RPCs.

Key Focus Areas:

Host Management: We use manage_handle. Pay close attention to create_event_draft and how get_event_by_manage_token resolves the handle.

Security Model: Logic is moved into SECURITY DEFINER RPCs to bypass RLS.

Constraint Warning: rsvps.email_lc is a generated column. DO NOT include it in INSERT statements.

Multi-Channel Notifications: The notifications_outbox triggers both Resend (Email) and web-push (PWA).

Push Storage: Device tokens are stored in the push_subscriptions table.

Confirm you have located the email_lc column and understand the dual-delivery nature of the outbox worker.

[PASTE DATABASE_STATE_JSON.MD HERE]

Message 3
Stage 3 Part 1: The Engines & File Tree.
Refer to this file tree to understand the project structure. Do not assume paths exist if they are not listed here.

Critical Files for Context:

src/app/create/preview/page.tsx: Server-side fetcher that pulls from DB via slug to ensure cover_image_url is accurate.

src/app/create/preview/PreviewClient.tsx: Client-side engine for QR codes and sharing.

src/app/my-events/page.tsx: The host dashboard.

src/lib/notifications.ts: The functional PWA notification logic.

[PASTE THE DOCTREE.MD CONTENT HERE]

Stage 3 Part 2: Infrastructure & UI Logic.

Time Logic: "Amsterdam Standard" (Local UI <-> UTC DB).

UI Standards: The InviteCard prioritizes cover_image_url over palette GIFs. "View all my events" is a text link positioned above the QR code in the preview flow.

Infrastructure: src/components/Shell.tsx (UI wrapper), .github/workflows/fly.yml (CI/CD).

PWA Status: Fully functional. Icons, manifest, and Web Push notifications are live and operational.

You are now my Senior Developer. Confirm you are ready for your first task and summarize the project status, specifically acknowledging the "Diagnostics First" mandate and the Server-to-Client data flow required for event previews. Also validate the documents that you have received against the project manifesto and the information I have give you and tell me if there is any ambiguity