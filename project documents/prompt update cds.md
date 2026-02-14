# On Mac/Linux
find . -maxdepth 4 -not -path '*/.*' -not -path '*/node_modules*'


SELECT jsonb_build_object(
  'timestamp', now(),
  'tables', (
    SELECT jsonb_agg(t) FROM (
      SELECT 
        table_name, 
        jsonb_agg(jsonb_build_object(
          'name', column_name,
          'type', data_type,
          'nullable', is_nullable,
          'default', column_default,
          'is_generated', is_generated
        ) ORDER BY ordinal_position) as columns
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      GROUP BY table_name
    ) t
  ),
  'functions', (
    SELECT jsonb_agg(f) FROM (
      SELECT 
        p.proname as name,
        pg_get_function_identity_arguments(p.oid) as args,
        pg_get_function_result(p.oid) as returns,
        pg_get_functiondef(p.oid) as definition
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
    ) f
  )
) as database_state;