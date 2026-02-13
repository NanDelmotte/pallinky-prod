// src/env.ts
const requiredEnvVars = [

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