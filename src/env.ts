// src/env.ts
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "CRON_SECRET",
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `\n❌ MISSING ENVIRONMENT VARIABLES:\n${missing
        .map((v) => `   - ${v}`)
        .join("\n")}\n\nCheck your Fly.io secrets or .env.local\n`
    );
  }
}