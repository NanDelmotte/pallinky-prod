create extension if not exists "pg_net" with schema "extensions";

drop function if exists "public"."get_pending_outbox"(p_limit integer);


  create table "public"."push_subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "email_lc" text not null,
    "subscription_json" jsonb not null,
    "user_agent" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."push_subscriptions" enable row level security;

CREATE INDEX idx_push_subs_email ON public.push_subscriptions USING btree (email_lc);

CREATE UNIQUE INDEX push_subscriptions_pkey ON public.push_subscriptions USING btree (id);

CREATE UNIQUE INDEX unique_subscription_per_email ON public.push_subscriptions USING btree (email_lc, subscription_json);

alter table "public"."push_subscriptions" add constraint "push_subscriptions_pkey" PRIMARY KEY using index "push_subscriptions_pkey";

alter table "public"."push_subscriptions" add constraint "unique_subscription_per_email" UNIQUE using index "unique_subscription_per_email";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_host_dashboard_by_email(p_email text)
 RETURNS TABLE(id uuid, title text, slug text, status text, created_at timestamp with time zone, rsvp_count bigint, manage_handle text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        e.id, 
        e.title, 
        e.slug, 
        e.status,
        e.created_at,
        (SELECT count(*) FROM public.rsvps r WHERE r.event_id = e.id) as rsvp_count,
        e.manage_handle
    FROM public.events e
    WHERE e.host_email = LOWER(TRIM(p_email))
    ORDER BY e.created_at DESC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.save_push_subscription(p_email text, p_subscription_json jsonb, p_user_agent text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.push_subscriptions (email_lc, subscription_json, user_agent)
    VALUES (lower(trim(p_email)), p_subscription_json, p_user_agent)
    ON CONFLICT (email_lc, subscription_json) 
    DO UPDATE SET 
        updated_at = now(),
        user_agent = EXCLUDED.user_agent;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_pending_outbox(p_limit integer)
 RETURNS SETOF public.notifications_outbox
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.notifications_outbox
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_outbox_failed(p_id uuid, p_error text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_attempts int;
BEGIN
  UPDATE notifications_outbox
  SET attempts = attempts + 1,
      last_error = p_error,
      last_attempt_at = now()
  WHERE id = p_id
  RETURNING attempts INTO v_attempts;

  -- If it failed for the 3rd time, raise a notice that shows up in Supabase Logs
  IF v_attempts >= 3 THEN
    RAISE WARNING 'CRITICAL_EMAIL_FAILURE: Message % failed after 3 attempts. Error: %', p_id, p_error;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_outbox_sent(p_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    UPDATE public.notifications_outbox
    SET status = 'sent',
        attempts = attempts + 1
    WHERE id = p_id;
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
  v_existing_token TEXT;
  v_existing_status TEXT;
BEGIN
  -- 1. Get Event ID
  SELECT id INTO v_event_id FROM public.events WHERE slug = p_slug;
  
  IF v_event_id IS NULL THEN
    RETURN json_build_object('error', 'Event not found');
  END IF;

  -- 2. Check for an existing RSVP to prevent redundant updates (Idempotency)
  -- This prevents "double-tap" logic from re-running the heavy write if nothing changed
  SELECT guest_token, status INTO v_existing_token, v_existing_status
  FROM public.rsvps 
  WHERE event_id = v_event_id 
    AND (email_lc = LOWER(p_email) OR guest_token = p_guest_token);

  IF v_existing_token IS NOT NULL AND v_existing_status = p_status AND v_existing_token = p_guest_token THEN
      RETURN json_build_object('success', true, 'guest_token', v_existing_token, 'note', 'idempotent');
  END IF;

  -- 3. Insert or Update
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
    guest_token = EXCLUDED.guest_token,
    updated_at = now() -- Track when they last changed their mind
  RETURNING json_build_object('success', true, 'guest_token', rsvps.guest_token) 
  INTO v_result;

  RETURN v_result;
END;
$function$
;

grant delete on table "public"."push_subscriptions" to "anon";

grant insert on table "public"."push_subscriptions" to "anon";

grant references on table "public"."push_subscriptions" to "anon";

grant select on table "public"."push_subscriptions" to "anon";

grant trigger on table "public"."push_subscriptions" to "anon";

grant truncate on table "public"."push_subscriptions" to "anon";

grant update on table "public"."push_subscriptions" to "anon";

grant delete on table "public"."push_subscriptions" to "authenticated";

grant insert on table "public"."push_subscriptions" to "authenticated";

grant references on table "public"."push_subscriptions" to "authenticated";

grant select on table "public"."push_subscriptions" to "authenticated";

grant trigger on table "public"."push_subscriptions" to "authenticated";

grant truncate on table "public"."push_subscriptions" to "authenticated";

grant update on table "public"."push_subscriptions" to "authenticated";

grant delete on table "public"."push_subscriptions" to "service_role";

grant insert on table "public"."push_subscriptions" to "service_role";

grant references on table "public"."push_subscriptions" to "service_role";

grant select on table "public"."push_subscriptions" to "service_role";

grant trigger on table "public"."push_subscriptions" to "service_role";

grant truncate on table "public"."push_subscriptions" to "service_role";

grant update on table "public"."push_subscriptions" to "service_role";

CREATE TRIGGER send_rsvp_push AFTER INSERT OR UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://nfoshumnlfsjtfxkyqrq.supabase.co/functions/v1/send-push', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mb3NodW1ubGZzanRmeGt5cXJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg4Njg3NCwiZXhwIjoyMDg2NDYyODc0fQ.-uMo1g7FiqeTiNh6hy0nmMxu-_pnhAJz8aKg6lrF4Eo"}', '{}', '5000');


  create policy "Auth Upload Covers"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'covers'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Public View Covers"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'covers'::text));



