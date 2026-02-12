drop extension if exists "pg_net";


  create table "public"."email_subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "email_lc" text not null,
    "is_unsubscribed" boolean not null default false,
    "unsubscribed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "host_name" text not null,
    "host_email" text not null,
    "keyword" text not null,
    "slug_suffix" text not null,
    "title" text not null,
    "description" text,
    "starts_at" timestamp with time zone,
    "ends_at" timestamp with time zone,
    "location" text,
    "cover_image_url" text,
    "gif_key" text,
    "status" text not null default 'active'::text,
    "manage_handle" text not null,
    "manage_token_hash" text not null,
    "expires_at" timestamp with time zone,
    "first_shared_at" timestamp with time zone,
    "last_changed_summary" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."events" enable row level security;


  create table "public"."notifications_outbox" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "recipient_email" text not null,
    "template" text not null,
    "payload" jsonb not null,
    "status" text not null default 'pending'::text,
    "attempts" integer not null default 0,
    "last_error" text,
    "created_at" timestamp with time zone not null default now(),
    "processed_at" timestamp with time zone
      );



  create table "public"."rsvps" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "guest_token" text,
    "name" text not null,
    "email" text,
    "email_lc" text generated always as (lower(TRIM(BOTH FROM email))) stored,
    "status" text not null,
    "message" text,
    "responded_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."rsvps" enable row level security;

CREATE UNIQUE INDEX email_subscriptions_event_id_email_lc_key ON public.email_subscriptions USING btree (event_id, email_lc);

CREATE UNIQUE INDEX email_subscriptions_pkey ON public.email_subscriptions USING btree (id);

CREATE UNIQUE INDEX events_manage_handle_key ON public.events USING btree (manage_handle);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX events_slug_key ON public.events USING btree (slug);

CREATE UNIQUE INDEX notifications_outbox_pkey ON public.notifications_outbox USING btree (id);

CREATE UNIQUE INDEX rsvps_event_id_email_lc_key ON public.rsvps USING btree (event_id, email_lc);

CREATE UNIQUE INDEX rsvps_pkey ON public.rsvps USING btree (id);

alter table "public"."email_subscriptions" add constraint "email_subscriptions_pkey" PRIMARY KEY using index "email_subscriptions_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."notifications_outbox" add constraint "notifications_outbox_pkey" PRIMARY KEY using index "notifications_outbox_pkey";

alter table "public"."rsvps" add constraint "rsvps_pkey" PRIMARY KEY using index "rsvps_pkey";

alter table "public"."email_subscriptions" add constraint "email_subscriptions_event_id_email_lc_key" UNIQUE using index "email_subscriptions_event_id_email_lc_key";

alter table "public"."email_subscriptions" add constraint "email_subscriptions_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."email_subscriptions" validate constraint "email_subscriptions_event_id_fkey";

alter table "public"."events" add constraint "events_manage_handle_key" UNIQUE using index "events_manage_handle_key";

alter table "public"."events" add constraint "events_slug_key" UNIQUE using index "events_slug_key";

alter table "public"."notifications_outbox" add constraint "notifications_outbox_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."notifications_outbox" validate constraint "notifications_outbox_event_id_fkey";

alter table "public"."rsvps" add constraint "rsvps_event_id_email_lc_key" UNIQUE using index "rsvps_event_id_email_lc_key";

alter table "public"."rsvps" add constraint "rsvps_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."rsvps" validate constraint "rsvps_event_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cancel_event_by_manage_token(p_manage_token text)
 RETURNS TABLE(ok boolean, slug text, enqueued_count integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_event public.events%rowtype;
begin
  select * into v_event from public.events where manage_handle = p_manage_token limit 1;

  if v_event.id is null then raise exception 'invalid_manage_handle'; end if;

  update public.events set status = 'cancelled', updated_at = now() where id = v_event.id;

  insert into public.notifications_outbox(event_id, recipient_email, template, payload)
  select v_event.id, s.email_lc, 'event_cancelled', jsonb_build_object('slug', v_event.slug, 'title', v_event.title)
  from public.email_subscriptions s
  where s.event_id = v_event.id and s.is_unsubscribed = false;

  get diagnostics enqueued_count = row_count;
  ok := true;
  slug := v_event.slug;
  return next;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_event_draft(p_title text, p_starts_at timestamp with time zone DEFAULT NULL::timestamp with time zone, p_ends_at timestamp with time zone DEFAULT NULL::timestamp with time zone, p_location text DEFAULT NULL::text, p_description text DEFAULT NULL::text, p_host_name text DEFAULT NULL::text, p_host_email text DEFAULT NULL::text, p_keyword text DEFAULT NULL::text, p_cover_image_url text DEFAULT NULL::text, p_gif_key text DEFAULT NULL::text, p_expires_in_days integer DEFAULT 30)
 RETURNS TABLE(event_id uuid, slug text, manage_token text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_manage text;
  v_suffix text;
  v_slug text;
  v_event_id uuid;
begin
  v_manage := md5(random()::text || clock_timestamp()::text);
  v_suffix := substring(md5(random()::text), 1, 4);
  v_slug := lower(p_keyword) || '-' || v_suffix;

  INSERT INTO public.events (
    title, slug, keyword, slug_suffix, manage_handle, manage_token_hash,
    host_name, host_email, starts_at, ends_at, location, description, 
    cover_image_url, gif_key, status, expires_at
  )
  VALUES (
    p_title, v_slug, p_keyword, v_suffix, v_manage, encode(digest(v_manage, 'sha256'), 'hex'),
    p_host_name, lower(trim(p_host_email)), p_starts_at, p_ends_at, p_location, p_description, 
    p_cover_image_url, p_gif_key, 'active', now() + (p_expires_in_days || ' days')::interval
  )
  RETURNING id INTO v_event_id;

  INSERT INTO public.rsvps (event_id, name, email, status, guest_token)
  VALUES (v_event_id, p_host_name, lower(trim(p_host_email)), 'yes', 'HOST-' || v_manage);

  INSERT INTO public.notifications_outbox (event_id, recipient_email, template, payload)
  VALUES (
    v_event_id, 
    lower(trim(p_host_email)), 
    'host_manage_link', 
    jsonb_build_object(
      'event_title', p_title,
      'event_date', p_starts_at,
      'manage_url', 'https://pallinky.com/m/' || v_manage
    )
  );

  RETURN QUERY SELECT v_event_id, v_slug, v_manage;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_event_by_manage_token(p_manage_token text)
 RETURNS SETOF public.events
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT * FROM public.events
  WHERE manage_handle = p_manage_token
     OR manage_token_hash = encode(digest(p_manage_token, 'sha256'), 'hex')
  LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.get_guest_list(p_slug text)
 RETURNS TABLE(name text, status text, responded_at timestamp with time zone, message text)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  select r.name, r.status, r.responded_at, r.message
  from public.events e
  join public.rsvps r on r.event_id = e.id
  where e.slug = p_slug
  order by r.responded_at desc;
$function$
;

CREATE OR REPLACE FUNCTION public.get_pending_outbox(p_limit integer)
 RETURNS TABLE(out_id uuid, out_event_id uuid, out_recipient_email text, out_template text, out_payload jsonb, out_attempts integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  UPDATE public.notifications_outbox AS n
  SET status = 'pending',
      attempts = n.attempts + 1
  WHERE n.id IN (
    SELECT sub.id
    FROM public.notifications_outbox sub
    WHERE (sub.status IS NULL OR sub.status = 'failed')
      AND sub.attempts < 5
    ORDER BY sub.created_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING 
    n.id, 
    n.event_id, 
    n.recipient_email, 
    n.template, 
    n.payload, 
    n.attempts;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_rsvp_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    IF (NEW.guest_token NOT LIKE 'HOST-%') THEN
        INSERT INTO public.notifications_outbox (event_id, recipient_email, template, payload)
        SELECT 
            e.id, 
            e.host_email, 
            'host_rsvp_notification', 
            jsonb_build_object(
                'event_title', e.title,
                'guest_name', NEW.name,
                'response', NEW.status,
                'manage_url', 'https://pallinky.com/m/' || e.manage_handle
            )
        FROM public.events e
        WHERE e.id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_outbox_failed(p_id uuid, p_error text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.notifications_outbox
  SET status = 'failed'
  WHERE id = p_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_outbox_sent(p_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.notifications_outbox
  SET status = 'sent'
  WHERE id = p_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.send_host_message_by_manage_token(p_manage_token text, p_subject text, p_body text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_event_id uuid;
  v_event_title text;
  v_host_name text;
  v_slug text;
BEGIN
  -- 1. Get event details
  SELECT id, title, host_name, slug 
  INTO v_event_id, v_event_title, v_host_name, v_slug
  FROM public.events 
  WHERE manage_handle = p_manage_token;

  IF v_event_id IS NULL THEN
    RAISE EXCEPTION 'Event not found';
  END IF;

  -- 2. Insert into outbox for all guests who have an email and haven't unsubscribed
  INSERT INTO public.notifications_outbox (event_id, recipient_email, template, payload)
  SELECT 
    v_event_id, 
    r.email, 
    'host_message', 
    jsonb_build_object(
      'event_title', v_event_title,
      'host_name', v_host_name,
      'subject', p_subject,
      'message', p_body,
      'slug', v_slug
    )
  FROM public.rsvps r
  WHERE r.event_id = v_event_id 
    AND r.email IS NOT NULL 
    AND r.email <> '';

END;
$function$
;

CREATE OR REPLACE FUNCTION public.submit_rsvp(p_slug text, p_name text, p_status text, p_guest_token text DEFAULT NULL::text, p_email text DEFAULT NULL::text, p_message text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_event_id UUID;
  v_result JSON;
BEGIN
  SELECT id INTO v_event_id FROM public.events WHERE slug = p_slug;
  
  IF v_event_id IS NULL THEN
    RETURN json_build_object('error', 'Event not found');
  END IF;

  -- Insert or Update based ONLY on the email/event combo
  INSERT INTO public.rsvps (
    event_id, name, status, guest_token, email, message
  )
  VALUES (
    v_event_id, p_name, p_status, 
    COALESCE(p_guest_token, encode(gen_random_bytes(16), 'hex')), 
    p_email, p_message
  )
  ON CONFLICT ON CONSTRAINT rsvps_event_id_email_lc_key
  DO UPDATE SET 
    name = EXCLUDED.name, 
    status = EXCLUDED.status,
    message = EXCLUDED.message,
    -- We update the token to whichever one was used most recently (Host or Cookie)
    guest_token = EXCLUDED.guest_token 
  RETURNING json_build_object('success', true, 'guest_token', rsvps.guest_token) 
  INTO v_result;

  RETURN v_result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_event_by_manage_token(p_manage_token text, p_title text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_location text, p_description text, p_cover_image_url text, p_expires_at timestamp with time zone, p_gif_key text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update public.events
  set
    title = p_title,
    starts_at = p_starts_at,
    ends_at = p_ends_at,
    location = p_location,
    description = p_description,
    cover_image_url = p_cover_image_url,
    expires_at = p_expires_at,
    gif_key = p_gif_key,
    updated_at = now()
  where manage_handle = p_manage_token;
end;
$function$
;

grant delete on table "public"."email_subscriptions" to "anon";

grant insert on table "public"."email_subscriptions" to "anon";

grant references on table "public"."email_subscriptions" to "anon";

grant select on table "public"."email_subscriptions" to "anon";

grant trigger on table "public"."email_subscriptions" to "anon";

grant truncate on table "public"."email_subscriptions" to "anon";

grant update on table "public"."email_subscriptions" to "anon";

grant delete on table "public"."email_subscriptions" to "authenticated";

grant insert on table "public"."email_subscriptions" to "authenticated";

grant references on table "public"."email_subscriptions" to "authenticated";

grant select on table "public"."email_subscriptions" to "authenticated";

grant trigger on table "public"."email_subscriptions" to "authenticated";

grant truncate on table "public"."email_subscriptions" to "authenticated";

grant update on table "public"."email_subscriptions" to "authenticated";

grant delete on table "public"."email_subscriptions" to "service_role";

grant insert on table "public"."email_subscriptions" to "service_role";

grant references on table "public"."email_subscriptions" to "service_role";

grant select on table "public"."email_subscriptions" to "service_role";

grant trigger on table "public"."email_subscriptions" to "service_role";

grant truncate on table "public"."email_subscriptions" to "service_role";

grant update on table "public"."email_subscriptions" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."notifications_outbox" to "anon";

grant insert on table "public"."notifications_outbox" to "anon";

grant references on table "public"."notifications_outbox" to "anon";

grant select on table "public"."notifications_outbox" to "anon";

grant trigger on table "public"."notifications_outbox" to "anon";

grant truncate on table "public"."notifications_outbox" to "anon";

grant update on table "public"."notifications_outbox" to "anon";

grant delete on table "public"."notifications_outbox" to "authenticated";

grant insert on table "public"."notifications_outbox" to "authenticated";

grant references on table "public"."notifications_outbox" to "authenticated";

grant select on table "public"."notifications_outbox" to "authenticated";

grant trigger on table "public"."notifications_outbox" to "authenticated";

grant truncate on table "public"."notifications_outbox" to "authenticated";

grant update on table "public"."notifications_outbox" to "authenticated";

grant delete on table "public"."notifications_outbox" to "service_role";

grant insert on table "public"."notifications_outbox" to "service_role";

grant references on table "public"."notifications_outbox" to "service_role";

grant select on table "public"."notifications_outbox" to "service_role";

grant trigger on table "public"."notifications_outbox" to "service_role";

grant truncate on table "public"."notifications_outbox" to "service_role";

grant update on table "public"."notifications_outbox" to "service_role";

grant delete on table "public"."rsvps" to "anon";

grant insert on table "public"."rsvps" to "anon";

grant references on table "public"."rsvps" to "anon";

grant select on table "public"."rsvps" to "anon";

grant trigger on table "public"."rsvps" to "anon";

grant truncate on table "public"."rsvps" to "anon";

grant update on table "public"."rsvps" to "anon";

grant delete on table "public"."rsvps" to "authenticated";

grant insert on table "public"."rsvps" to "authenticated";

grant references on table "public"."rsvps" to "authenticated";

grant select on table "public"."rsvps" to "authenticated";

grant trigger on table "public"."rsvps" to "authenticated";

grant truncate on table "public"."rsvps" to "authenticated";

grant update on table "public"."rsvps" to "authenticated";

grant delete on table "public"."rsvps" to "service_role";

grant insert on table "public"."rsvps" to "service_role";

grant references on table "public"."rsvps" to "service_role";

grant select on table "public"."rsvps" to "service_role";

grant trigger on table "public"."rsvps" to "service_role";

grant truncate on table "public"."rsvps" to "service_role";

grant update on table "public"."rsvps" to "service_role";


  create policy "Allow public read-only access to events by slug"
  on "public"."events"
  as permissive
  for select
  to public
using (true);



  create policy "Allow update access via manage_handle"
  on "public"."events"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Service role full access"
  on "public"."notifications_outbox"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Allow individual rsvp updates via token"
  on "public"."rsvps"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Allow public read access to rsvps"
  on "public"."rsvps"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public rsvp submission"
  on "public"."rsvps"
  as permissive
  for insert
  to public
with check (true);


CREATE TRIGGER on_rsvp_created AFTER INSERT ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.handle_new_rsvp_notification();


  create policy "Anon Uploads"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'cover-images'::text));



  create policy "Public Access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'cover-images'::text));



  create policy "Public Upload Covers"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'covers'::text));



