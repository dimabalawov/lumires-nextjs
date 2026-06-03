/**
 * Read-only auth diagnostic for the seed flow. Signs in ONE seeded user and
 * reports why the Lumires API rejects the token. No mass writes.
 *
 * Run: npm run seed:diag
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.SEED_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const API = process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "https://lumires-api.supabase.win";
const email = process.env.DIAG_EMAIL ?? "seed-user-01@lumires.test";
const password = process.env.SEED_PASSWORD ?? "SeedPass123!";

const b64 = (s: string) =>
  JSON.parse(Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());

async function main() {
  const client = createClient(url, anon, { auth: { persistSession: false } });

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    console.error("sign-in failed:", error?.message ?? "no session");
    process.exit(1);
  }
  const token = data.session.access_token;

  const [h, p] = token.split(".");
  console.log("=== access token ===");
  console.log("header :", JSON.stringify(b64(h)));
  console.log("payload:", JSON.stringify(b64(p), null, 1));

  // 1) Is the token valid against Supabase itself?
  const me = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anon, Authorization: `Bearer ${token}` },
  });
  console.log(`\nGET ${url}/auth/v1/user -> ${me.status}`);

  // 2) What does the Lumires API say to this exact token?
  const reg = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: "diag_probe", email }),
  });
  console.log(`POST ${API}/auth/register -> ${reg.status}`);
  console.log("  body:", (await reg.text()) || "(empty)");

  // 3) Does the API expose how it expects to validate tokens?
  for (const path of ["/.well-known/openid-configuration", "/auth/v1/.well-known/jwks.json"]) {
    try {
      const r = await fetch(`${url}${path}`);
      console.log(`\nGET ${url}${path} -> ${r.status}`);
      if (r.ok) console.log("  ", (await r.text()).slice(0, 400));
    } catch {
      /* ignore */
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
