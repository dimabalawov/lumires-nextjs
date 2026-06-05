/**
 * Dev-only seeding script for the Lumires API.
 *
 * Creates confirmed Supabase auth users, registers their Lumires profiles, and
 * posts reviews (unevenly distributed across real films) so that
 * `GET /films/most-reviewed/weekly` returns a meaningful ranking — which is
 * what the Trending carousel on /films reads from.
 *
 * Run:  npm run seed          (create + review)
 *       npm run seed:reset    (delete previously-seeded users)
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (gitignored). Loaded via the
 * package.json script's `--env-file=.env.local` flag (Node 20.6+).
 *
 * NOTE: This deliberately does NOT import src/lib/api/* — those are
 * `server-only` and read the JWT from SSR cookies. Request paths and body
 * shapes here mirror src/lib/api/{auth,reviews,films}.ts and were verified
 * against the live OpenAPI spec.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  USERNAMES,
  REVIEW_OPENERS,
  REVIEW_BEATS,
  REVIEW_TITLES,
  RATING_POOL,
  REPLY_TEXTS,
} from "./seedData";

// --- Config ----------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Key used by the auth client for sign-in. Self-hosted GoTrue may only accept
// the legacy JWT anon key, not the new `sb_publishable_…` format the app uses —
// SEED_ANON_KEY lets the seed override it without touching the app's key.
const ANON_KEY = process.env.SEED_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_BASE =
  process.env.NEXT_PUBLIC_LUMIRES_API_URL ?? "https://lumires-api.supabase.win";

const USER_COUNT = Number(process.env.USERS ?? 30);
const TOTAL_REVIEWS = Number(process.env.TOTAL_REVIEWS ?? 150);
const REPLIES_PER_REVIEW = Number(process.env.REPLIES_PER_REVIEW ?? 3);
const REVIEW_PAGE_SIZE = 100;
const SEED_DOMAIN = "lumires.test";
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "SeedPass123!";

const isReset = process.argv.includes("--reset");
// --replies: skip review creation, just post replies on every existing review.
const isReplies = process.argv.includes("--replies");

function requireEnv(): { url: string; anon: string; service: string | null } {
  const missing: string[] = [];
  if (!SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (missing.length) {
    console.error(`Missing required env var(s): ${missing.join(", ")}. Add them to .env.local.`);
    process.exit(1);
  }
  // Service-role key is optional: with it we use the admin API (pre-confirmed
  // users); without it we fall back to public signUp (needs "Confirm email" OFF).
  return { url: SUPABASE_URL!, anon: ANON_KEY!, service: SERVICE_ROLE_KEY || null };
}

// --- Small helpers ----------------------------------------------------------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pick = <T>(arr: T[], i: number): T => arr[i % arr.length];

/** Thin authenticated fetch against the Lumires API. Throws with the body on error. */
async function api<T = unknown>(
  method: "GET" | "POST",
  path: string,
  opts: { token?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status} ${res.statusText}: ${text || "(no body)"}`);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

interface SeedUser {
  id: string;
  email: string;
  username: string;
  token: string;
}

interface Film {
  externalId: number;
  slug: string;
  title: string;
}

// --- Steps ------------------------------------------------------------------

/**
 * Create N users and sign each in to capture a JWT.
 * - `admin` set  → admin.createUser with email_confirm (pre-confirmed).
 * - `admin` null → public signUp (requires "Confirm email" OFF in Auth settings).
 */
async function createUsers(
  authClient: SupabaseClient,
  admin: SupabaseClient | null,
): Promise<SeedUser[]> {
  const users: SeedUser[] = [];
  let confirmationLikelyOn = false;

  for (let i = 0; i < USER_COUNT; i++) {
    const n = String(i + 1).padStart(2, "0");
    // reserve 3 chars for the "_NN" suffix so the result is ≤ 20 (API limit)
    const base = pick(USERNAMES, i).slice(0, 17);
    const username = `${base}_${n}`;
    const email = `seed-user-${n}@${SEED_DOMAIN}`;

    if (admin) {
      const { error } = await admin.auth.admin.createUser({
        email,
        password: SEED_PASSWORD,
        email_confirm: true,
        user_metadata: { username },
      });
      if (error && !/already.*regist|exist/i.test(error.message)) {
        console.warn(`  ! createUser(${email}) failed: ${error.message}`);
        continue;
      }
    } else {
      const { error } = await authClient.auth.signUp({
        email,
        password: SEED_PASSWORD,
        options: { data: { username } },
      });
      if (error && !/already|registered/i.test(error.message)) {
        console.warn(`  ! signUp(${email}) failed: ${error.message}`);
        continue;
      }
    }

    const { data, error: signInErr } = await authClient.auth.signInWithPassword({
      email,
      password: SEED_PASSWORD,
    });
    if (signInErr || !data.session) {
      if (!admin) confirmationLikelyOn = true;
      console.warn(`  ! signIn(${email}) failed: ${signInErr?.message ?? "no session"}`);
      continue;
    }
    users.push({ id: data.session.user.id, email, username, token: data.session.access_token });
    process.stdout.write(`\r  users ready: ${users.length}/${USER_COUNT}`);
  }
  process.stdout.write("\n");

  if (!users.length && confirmationLikelyOn) {
    console.error(
      "\nNo users could sign in. In signUp (no service key) mode this usually means\n" +
        '"Confirm email" is ENABLED in Supabase Auth settings — disable it, or provide\n' +
        "SUPABASE_SERVICE_ROLE_KEY in .env.local to use the admin API instead.",
    );
  }
  return users;
}

/** Register each user's Lumires profile (POST /auth/register). Tolerates duplicates. */
async function registerProfiles(users: SeedUser[]): Promise<void> {
  let ok = 0;
  for (const u of users) {
    try {
      await api("POST", "/auth/register", {
        token: u.token,
        body: { id: u.id, username: u.username, email: u.email },
      });
      ok++;
    } catch (err) {
      const msg = (err as Error).message;
      if (/already|exist|conflict|409/i.test(msg)) ok++; // already registered
      else console.warn(`  ! register(${u.username}): ${msg}`);
    }
    process.stdout.write(`\r  profiles registered: ${ok}/${users.length}`);
  }
  process.stdout.write("\n");
}

/** Pull real films (externalId + slug) to review. */
async function fetchFilms(): Promise<Film[]> {
  const { items } = await api<{ items: Film[] }>("GET", "/films/popular/weekly");
  return (items ?? []).filter((f) => f.externalId && f.slug);
}

/** Allocate TOTAL_REVIEWS across films, weighted by rank so #1 gets the most. */
function allocate(filmCount: number, total: number): number[] {
  const totalWeight = (filmCount * (filmCount + 1)) / 2;
  const counts = Array.from({ length: filmCount }, (_, i) =>
    Math.max(1, Math.round((total * (filmCount - i)) / totalWeight)),
  );
  return counts;
}

/** Post reviews film-by-film, rotating reviewers. Returns count posted. */
async function postReviews(users: SeedUser[], films: Film[]): Promise<number> {
  const counts = allocate(films.length, TOTAL_REVIEWS);
  let posted = 0;
  let reviewerIdx = 0;
  const failures: string[] = [];

  for (let f = 0; f < films.length; f++) {
    const film = films[f];
    for (let r = 0; r < counts[f]; r++) {
      const user = users[reviewerIdx % users.length];
      reviewerIdx++;
      const body = {
        title: pick(REVIEW_TITLES, reviewerIdx),
        text: `${pick(REVIEW_OPENERS, reviewerIdx)} ${pick(REVIEW_BEATS, reviewerIdx + 1)}`,
        rating: pick(RATING_POOL, reviewerIdx),
        isSpoilerFree: reviewerIdx % 3 !== 0,
      };
      try {
        await api("POST", `/films/${encodeURIComponent(film.slug)}/${film.externalId}/reviews`, {
          token: user.token,
          body,
        });
        posted++;
      } catch (err) {
        failures.push((err as Error).message);
      }
      process.stdout.write(`\r  reviews posted: ${posted}/${TOTAL_REVIEWS}`);
      await sleep(40); // gentle pacing to avoid rate limits
    }
  }
  process.stdout.write("\n");

  if (failures.length) {
    console.warn(`  ! ${failures.length} review(s) failed. First few:`);
    for (const m of failures.slice(0, 5)) console.warn(`    - ${m}`);
  }
  return posted;
}

interface ReviewRow {
  id: string;
  userId: string;
  username: string;
}

/** Fetch every review for a film, following pagination. */
async function fetchReviews(film: Film): Promise<ReviewRow[]> {
  const all: ReviewRow[] = [];
  let page = 1;
  for (;;) {
    const res = await api<{ results: ReviewRow[]; totalPages: number }>(
      "GET",
      `/films/${encodeURIComponent(film.slug)}/${film.externalId}/reviews?page=${page}&pageSize=${REVIEW_PAGE_SIZE}`,
    );
    all.push(...(res.results ?? []));
    if (!res.totalPages || page >= res.totalPages) break;
    page++;
  }
  return all;
}

/**
 * Post REPLIES_PER_REVIEW replies on every review of every film. The replier is
 * always someone other than the review's author, and targetedUserId points back
 * at the author so the reply renders as "→ reply to @author". Returns count posted.
 */
async function postReplies(users: SeedUser[], films: Film[]): Promise<number> {
  let posted = 0;
  let attempted = 0;
  let reviewerIdx = 0;
  const failures: string[] = [];

  for (const film of films) {
    const reviews = await fetchReviews(film);
    for (const review of reviews) {
      for (let r = 0; r < REPLIES_PER_REVIEW; r++) {
        attempted++;
        // Pick a replier who isn't the review's author.
        let user = users[reviewerIdx % users.length];
        if (user.id === review.userId) {
          reviewerIdx++;
          user = users[reviewerIdx % users.length];
        }
        reviewerIdx++;
        const body = {
          text: pick(REPLY_TEXTS, reviewerIdx + r),
          targetedUserId: review.userId,
          isSpoilerFree: reviewerIdx % 3 !== 0,
        };
        try {
          await api(
            "POST",
            `/films/${encodeURIComponent(film.slug)}/${film.externalId}/reviews/${encodeURIComponent(review.id)}/reply`,
            { token: user.token, body },
          );
          posted++;
        } catch (err) {
          failures.push((err as Error).message);
        }
        process.stdout.write(`\r  replies posted: ${posted}/${attempted}`);
        await sleep(40); // gentle pacing to avoid rate limits
      }
    }
  }
  process.stdout.write("\n");

  if (failures.length) {
    console.warn(`  ! ${failures.length} reply(ies) failed. First few:`);
    for (const m of failures.slice(0, 5)) console.warn(`    - ${m}`);
  }
  return posted;
}

/** Delete previously-seeded auth users (email @lumires.test). */
async function resetUsers(admin: SupabaseClient): Promise<void> {
  let page = 1;
  let deleted = 0;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      console.error(`listUsers failed: ${error.message}`);
      break;
    }
    const seeded = data.users.filter((u) => u.email?.endsWith(`@${SEED_DOMAIN}`));
    for (const u of seeded) {
      await admin.auth.admin.deleteUser(u.id);
      deleted++;
      process.stdout.write(`\r  deleted: ${deleted}`);
    }
    if (data.users.length < 200) break;
    page++;
  }
  process.stdout.write("\n");
  console.log(`Reset complete. Deleted ${deleted} seeded user(s).`);
  console.log("(Reviews already posted on the backend are not removed by this step.)");
}

// --- Main -------------------------------------------------------------------

async function main() {
  const { url, anon, service } = requireEnv();

  const admin = service
    ? createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })
    : null;

  if (isReset) {
    if (!admin) {
      console.error("--reset requires SUPABASE_SERVICE_ROLE_KEY (admin API) in .env.local.");
      process.exit(1);
    }
    console.log(`Resetting seeded users (@${SEED_DOMAIN})...`);
    await resetUsers(admin);
    return;
  }

  const authClient = createClient(url, anon, { auth: { persistSession: false } });

  if (isReplies) {
    console.log(
      `Seeding ~${REPLIES_PER_REVIEW} replies per review against ${API_BASE}\n` +
        `Mode: ${admin ? "admin API (service-role key)" : "public signUp (no service key)"}\n`,
    );

    console.log("1/3  Creating / signing in users...");
    const users = await createUsers(authClient, admin);
    if (!users.length) {
      console.error("No users available — aborting.");
      process.exit(1);
    }

    console.log("2/3  Registering Lumires profiles...");
    await registerProfiles(users);

    console.log("3/3  Fetching films & posting replies on every review...");
    const films = await fetchFilms();
    if (!films.length) {
      console.error("No films returned from /films/popular/weekly — aborting.");
      process.exit(1);
    }
    const posted = await postReplies(users, films);

    console.log(`\nDone. ${posted} replies posted across ${films.length} films.`);
    return;
  }

  console.log(
    `Seeding ~${USER_COUNT} users and ~${TOTAL_REVIEWS} reviews against ${API_BASE}\n` +
      `Mode: ${admin ? "admin API (service-role key)" : "public signUp (no service key)"}\n`,
  );

  console.log("1/4  Creating users...");
  const users = await createUsers(authClient, admin);
  if (!users.length) {
    console.error("No users available — aborting.");
    process.exit(1);
  }

  console.log("2/4  Registering Lumires profiles...");
  await registerProfiles(users);

  console.log("3/4  Fetching films to review...");
  const films = await fetchFilms();
  if (!films.length) {
    console.error("No films returned from /films/popular/weekly — aborting.");
    process.exit(1);
  }
  console.log(`     ${films.length} films: ${films.map((f) => f.title).join(", ")}`);

  console.log("4/4  Posting reviews...");
  const posted = await postReviews(users, films);

  console.log(`\nDone. ${users.length} users, ${posted} reviews posted.`);
  console.log("Verify:  curl https://lumires-api.supabase.win/films/most-reviewed/weekly");
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
