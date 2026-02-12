[
  {
    "database_state": {
      "tables": [
        {
          "columns": [
            {
              "name": "id",
              "type": "uuid",
              "default": "gen_random_uuid()",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "event_id",
              "type": "uuid",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "email_lc",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "is_unsubscribed",
              "type": "boolean",
              "default": "false",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "unsubscribed_at",
              "type": "timestamp with time zone",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "created_at",
              "type": "timestamp with time zone",
              "default": "now()",
              "nullable": "NO",
              "is_generated": "NEVER"
            }
          ],
          "table_name": "email_subscriptions"
        },
        {
          "columns": [
            {
              "name": "id",
              "type": "uuid",
              "default": "gen_random_uuid()",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "slug",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "host_name",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "host_email",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "keyword",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "slug_suffix",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "title",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "description",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "starts_at",
              "type": "timestamp with time zone",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "ends_at",
              "type": "timestamp with time zone",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "location",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "cover_image_url",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "gif_key",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "status",
              "type": "text",
              "default": "'active'::text",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "manage_handle",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "manage_token_hash",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "expires_at",
              "type": "timestamp with time zone",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "first_shared_at",
              "type": "timestamp with time zone",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "last_changed_summary",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "created_at",
              "type": "timestamp with time zone",
              "default": "now()",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "updated_at",
              "type": "timestamp with time zone",
              "default": "now()",
              "nullable": "NO",
              "is_generated": "NEVER"
            }
          ],
          "table_name": "events"
        },
        {
          "columns": [
            {
              "name": "id",
              "type": "uuid",
              "default": "gen_random_uuid()",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "event_id",
              "type": "uuid",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "recipient_email",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "template",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "payload",
              "type": "jsonb",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "status",
              "type": "text",
              "default": "'pending'::text",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "attempts",
              "type": "integer",
              "default": "0",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "last_error",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "created_at",
              "type": "timestamp with time zone",
              "default": "now()",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "processed_at",
              "type": "timestamp with time zone",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            }
          ],
          "table_name": "notifications_outbox"
        },
        {
          "columns": [
            {
              "name": "id",
              "type": "uuid",
              "default": "gen_random_uuid()",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "event_id",
              "type": "uuid",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "guest_token",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "name",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "email",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "email_lc",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "ALWAYS"
            },
            {
              "name": "status",
              "type": "text",
              "default": null,
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "message",
              "type": "text",
              "default": null,
              "nullable": "YES",
              "is_generated": "NEVER"
            },
            {
              "name": "responded_at",
              "type": "timestamp with time zone",
              "default": "now()",
              "nullable": "NO",
              "is_generated": "NEVER"
            },
            {
              "name": "updated_at",
              "type": "timestamp with time zone",
              "default": "now()",
              "nullable": "NO",
              "is_generated": "NEVER"
            }
          ],
          "table_name": "rsvps"
        }
      ],
      "functions": [
        {
          "args": "",
          "name": "handle_new_rsvp_notification",
          "returns": "trigger",
          "definition": "CREATE OR REPLACE FUNCTION public.handle_new_rsvp_notification()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n    IF (NEW.guest_token NOT LIKE 'HOST-%') THEN\n        INSERT INTO public.notifications_outbox (event_id, recipient_email, template, payload)\n        SELECT \n            e.id, \n            e.host_email, \n            'host_rsvp_notification', \n            jsonb_build_object(\n                'event_title', e.title,\n                'guest_name', NEW.name,\n                'response', NEW.status,\n                'manage_url', 'https://pallinky.com/m/' || e.manage_handle\n            )\n        FROM public.events e\n        WHERE e.id = NEW.event_id;\n    END IF;\n    RETURN NEW;\nEND;\n$function$\n"
        },
        {
          "args": "p_id uuid",
          "name": "mark_outbox_sent",
          "returns": "void",
          "definition": "CREATE OR REPLACE FUNCTION public.mark_outbox_sent(p_id uuid)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE public.notifications_outbox\n  SET status = 'sent'\n  WHERE id = p_id;\nEND;\n$function$\n"
        },
        {
          "args": "p_manage_token text, p_subject text, p_body text",
          "name": "send_host_message_by_manage_token",
          "returns": "void",
          "definition": "CREATE OR REPLACE FUNCTION public.send_host_message_by_manage_token(p_manage_token text, p_subject text, p_body text)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  v_event_id uuid;\n  v_event_title text;\n  v_host_name text;\n  v_slug text;\nBEGIN\n  -- 1. Get event details\n  SELECT id, title, host_name, slug \n  INTO v_event_id, v_event_title, v_host_name, v_slug\n  FROM public.events \n  WHERE manage_handle = p_manage_token;\n\n  IF v_event_id IS NULL THEN\n    RAISE EXCEPTION 'Event not found';\n  END IF;\n\n  -- 2. Insert into outbox for all guests who have an email and haven't unsubscribed\n  INSERT INTO public.notifications_outbox (event_id, recipient_email, template, payload)\n  SELECT \n    v_event_id, \n    r.email, \n    'host_message', \n    jsonb_build_object(\n      'event_title', v_event_title,\n      'host_name', v_host_name,\n      'subject', p_subject,\n      'message', p_body,\n      'slug', v_slug\n    )\n  FROM public.rsvps r\n  WHERE r.event_id = v_event_id \n    AND r.email IS NOT NULL \n    AND r.email <> '';\n\nEND;\n$function$\n"
        },
        {
          "args": "p_id uuid, p_error text",
          "name": "mark_outbox_failed",
          "returns": "void",
          "definition": "CREATE OR REPLACE FUNCTION public.mark_outbox_failed(p_id uuid, p_error text)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  v_attempts int;\nBEGIN\n  UPDATE notifications_outbox\n  SET attempts = attempts + 1,\n      last_error = p_error,\n      last_attempt_at = now()\n  WHERE id = p_id\n  RETURNING attempts INTO v_attempts;\n\n  -- If it failed for the 3rd time, raise a notice that shows up in Supabase Logs\n  IF v_attempts >= 3 THEN\n    RAISE WARNING 'CRITICAL_EMAIL_FAILURE: Message % failed after 3 attempts. Error: %', p_id, p_error;\n  END IF;\nEND;\n$function$\n"
        },
        {
          "args": "p_slug text",
          "name": "get_guest_list",
          "returns": "TABLE(name text, status text, responded_at timestamp with time zone, message text)",
          "definition": "CREATE OR REPLACE FUNCTION public.get_guest_list(p_slug text)\n RETURNS TABLE(name text, status text, responded_at timestamp with time zone, message text)\n LANGUAGE sql\n SECURITY DEFINER\nAS $function$\n  select r.name, r.status, r.responded_at, r.message\n  from public.events e\n  join public.rsvps r on r.event_id = e.id\n  where e.slug = p_slug\n  order by r.responded_at desc;\n$function$\n"
        },
        {
          "args": "p_manage_token text",
          "name": "cancel_event_by_manage_token",
          "returns": "TABLE(ok boolean, slug text, enqueued_count integer)",
          "definition": "CREATE OR REPLACE FUNCTION public.cancel_event_by_manage_token(p_manage_token text)\n RETURNS TABLE(ok boolean, slug text, enqueued_count integer)\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\ndeclare\n  v_event public.events%rowtype;\nbegin\n  select * into v_event from public.events where manage_handle = p_manage_token limit 1;\n\n  if v_event.id is null then raise exception 'invalid_manage_handle'; end if;\n\n  update public.events set status = 'cancelled', updated_at = now() where id = v_event.id;\n\n  insert into public.notifications_outbox(event_id, recipient_email, template, payload)\n  select v_event.id, s.email_lc, 'event_cancelled', jsonb_build_object('slug', v_event.slug, 'title', v_event.title)\n  from public.email_subscriptions s\n  where s.event_id = v_event.id and s.is_unsubscribed = false;\n\n  get diagnostics enqueued_count = row_count;\n  ok := true;\n  slug := v_event.slug;\n  return next;\nend;\n$function$\n"
        },
        {
          "args": "p_title text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_location text, p_description text, p_host_name text, p_host_email text, p_keyword text, p_cover_image_url text, p_gif_key text, p_expires_in_days integer",
          "name": "create_event_draft",
          "returns": "TABLE(event_id uuid, slug text, manage_token text)",
          "definition": "CREATE OR REPLACE FUNCTION public.create_event_draft(p_title text, p_starts_at timestamp with time zone DEFAULT NULL::timestamp with time zone, p_ends_at timestamp with time zone DEFAULT NULL::timestamp with time zone, p_location text DEFAULT NULL::text, p_description text DEFAULT NULL::text, p_host_name text DEFAULT NULL::text, p_host_email text DEFAULT NULL::text, p_keyword text DEFAULT NULL::text, p_cover_image_url text DEFAULT NULL::text, p_gif_key text DEFAULT NULL::text, p_expires_in_days integer DEFAULT 30)\n RETURNS TABLE(event_id uuid, slug text, manage_token text)\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\ndeclare\n  v_manage text;\n  v_suffix text;\n  v_slug text;\n  v_event_id uuid;\nbegin\n  v_manage := md5(random()::text || clock_timestamp()::text);\n  v_suffix := substring(md5(random()::text), 1, 4);\n  v_slug := lower(p_keyword) || '-' || v_suffix;\n\n  INSERT INTO public.events (\n    title, slug, keyword, slug_suffix, manage_handle, manage_token_hash,\n    host_name, host_email, starts_at, ends_at, location, description, \n    cover_image_url, gif_key, status, expires_at\n  )\n  VALUES (\n    p_title, v_slug, p_keyword, v_suffix, v_manage, encode(digest(v_manage, 'sha256'), 'hex'),\n    p_host_name, lower(trim(p_host_email)), p_starts_at, p_ends_at, p_location, p_description, \n    p_cover_image_url, p_gif_key, 'active', now() + (p_expires_in_days || ' days')::interval\n  )\n  RETURNING id INTO v_event_id;\n\n  INSERT INTO public.rsvps (event_id, name, email, status, guest_token)\n  VALUES (v_event_id, p_host_name, lower(trim(p_host_email)), 'yes', 'HOST-' || v_manage);\n\n  INSERT INTO public.notifications_outbox (event_id, recipient_email, template, payload)\n  VALUES (\n    v_event_id, \n    lower(trim(p_host_email)), \n    'host_manage_link', \n    jsonb_build_object(\n      'event_title', p_title,\n      'event_date', p_starts_at,\n      'manage_url', 'https://pallinky.com/m/' || v_manage\n    )\n  );\n\n  RETURN QUERY SELECT v_event_id, v_slug, v_manage;\nend;\n$function$\n"
        },
        {
          "args": "p_manage_token text",
          "name": "get_event_by_manage_token",
          "returns": "SETOF events",
          "definition": "CREATE OR REPLACE FUNCTION public.get_event_by_manage_token(p_manage_token text)\n RETURNS SETOF events\n LANGUAGE sql\n SECURITY DEFINER\nAS $function$\n  SELECT * FROM public.events\n  WHERE manage_handle = p_manage_token\n     OR manage_token_hash = encode(digest(p_manage_token, 'sha256'), 'hex')\n  LIMIT 1;\n$function$\n"
        },
        {
          "args": "p_limit integer",
          "name": "get_pending_outbox",
          "returns": "TABLE(out_id uuid, out_event_id uuid, out_recipient_email text, out_template text, out_payload jsonb, out_attempts integer)",
          "definition": "CREATE OR REPLACE FUNCTION public.get_pending_outbox(p_limit integer)\n RETURNS TABLE(out_id uuid, out_event_id uuid, out_recipient_email text, out_template text, out_payload jsonb, out_attempts integer)\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  RETURN QUERY\n  UPDATE public.notifications_outbox AS n\n  SET status = 'pending',\n      attempts = n.attempts + 1\n  WHERE n.id IN (\n    SELECT sub.id\n    FROM public.notifications_outbox sub\n    WHERE (sub.status IS NULL OR sub.status = 'failed')\n      AND sub.attempts < 5\n    ORDER BY sub.created_at ASC\n    LIMIT p_limit\n    FOR UPDATE SKIP LOCKED\n  )\n  RETURNING \n    n.id, \n    n.event_id, \n    n.recipient_email, \n    n.template, \n    n.payload, \n    n.attempts;\nEND;\n$function$\n"
        },
        {
          "args": "p_slug text, p_name text, p_status text, p_guest_token text, p_email text, p_message text",
          "name": "submit_rsvp",
          "returns": "json",
          "definition": "CREATE OR REPLACE FUNCTION public.submit_rsvp(p_slug text, p_name text, p_status text, p_guest_token text DEFAULT NULL::text, p_email text DEFAULT NULL::text, p_message text DEFAULT NULL::text)\n RETURNS json\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  v_event_id UUID;\n  v_result JSON;\nBEGIN\n  SELECT id INTO v_event_id FROM public.events WHERE slug = p_slug;\n  \n  IF v_event_id IS NULL THEN\n    RETURN json_build_object('error', 'Event not found');\n  END IF;\n\n  -- Insert or Update based ONLY on the email/event combo\n  INSERT INTO public.rsvps (\n    event_id, name, status, guest_token, email, message\n  )\n  VALUES (\n    v_event_id, p_name, p_status, \n    COALESCE(p_guest_token, encode(gen_random_bytes(16), 'hex')), \n    p_email, p_message\n  )\n  ON CONFLICT ON CONSTRAINT rsvps_event_id_email_lc_key\n  DO UPDATE SET \n    name = EXCLUDED.name, \n    status = EXCLUDED.status,\n    message = EXCLUDED.message,\n    -- We update the token to whichever one was used most recently (Host or Cookie)\n    guest_token = EXCLUDED.guest_token \n  RETURNING json_build_object('success', true, 'guest_token', rsvps.guest_token) \n  INTO v_result;\n\n  RETURN v_result;\nEND;\n$function$\n"
        },
        {
          "args": "p_manage_token text, p_title text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_location text, p_description text, p_cover_image_url text, p_expires_at timestamp with time zone, p_gif_key text",
          "name": "update_event_by_manage_token",
          "returns": "void",
          "definition": "CREATE OR REPLACE FUNCTION public.update_event_by_manage_token(p_manage_token text, p_title text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_location text, p_description text, p_cover_image_url text, p_expires_at timestamp with time zone, p_gif_key text)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nbegin\n  update public.events\n  set\n    title = p_title,\n    starts_at = p_starts_at,\n    ends_at = p_ends_at,\n    location = p_location,\n    description = p_description,\n    cover_image_url = p_cover_image_url,\n    expires_at = p_expires_at,\n    gif_key = p_gif_key,\n    updated_at = now()\n  where manage_handle = p_manage_token;\nend;\n$function$\n"
        }
      ],
      "timestamp": "2026-02-12T13:02:49.282145+00:00"
    }
  }
]