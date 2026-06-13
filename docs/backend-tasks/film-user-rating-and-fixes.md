# Backend tasks — film user-rating + two open bugs

Prompt for the backend (C#) agent. Three independent items; #1 is the priority.
All probed live against `https://lumires-api.supabase.win` on 2026-06-14 with a
seeded user (`seed-user-01@lumires.test`).

---

> **UPDATE 2026-06-14:** Item #1 is **already implemented in the backend source**
> (`lumires.Api/Features/Films/GetFilm/` — `Response` has `float? MyRating` and
> `DataAccess.cs` computes it from `m.UserRatings.Where(ur => ur.UserId == currentUserId)`).
> The live probe below predates the deploy: the **deployed API is behind `main`**.
> So #1 is a **deploy/merge** task, not a code task — verify it's released, no new code needed.

## 1. (PRIORITY) Expose the current user's own rating on `GET /films/{id}`

### Symptom

On the web app, a logged-in user rates a film in the quick-rate modal, refreshes the
page, reopens the modal — and it shows **0 stars**, as if they never rated. The rating
*is* persisted (the next POST overwrites it fine); the UI just has no way to read it
back.

### Root cause

`GET /films/{id}` (authed) already returns per-user `isLikedByMe` and `isWatchedByMe`,
but **does not return the current user's own rating**. There is no `myRating`-style
field anywhere on the response, and no other endpoint exposes "my rating for this film."

Probe (authed, `seed-user-01`):

```
POST /films/27205/rate   {rating: 3.5}        -> 204 (saved OK)
GET  /films/27205  (same token)               -> 200
   top-level keys: id, releaseDate, trailerUrl, posterPath, backdropPath,
   localization, genres, cast, directors, productionCompany, runtime,
   voteAverage, voteCount, isLikedByMe, isWatchedByMe
   ^ no myRating / userRating / ratingByMe field at all
```

### Fix

Add the current user's rating to the `GET /films/{id}` response, **next to
`isLikedByMe`/`isWatchedByMe`**, populated only when the request is authenticated.

- Field name: **`myRating`** (matches the frontend type already in place).
- Type: nullable number. `null` (or omitted) when the user hasn't rated.
- Scale: same 0.5-step 0–5 scale that `POST /films/{id}/rate` accepts (the modal sends
  e.g. `3.5`). Return exactly what was stored — do **not** round to an integer.
- Anonymous requests: omit it or return `null` (same treatment as `isLikedByMe`).

```
GET /films/{id}   (Bearer)
200 → { ...existing fields..., "isLikedByMe": bool, "isWatchedByMe": bool, "myRating": 3.5 | null }
```

### Acceptance criteria

- [ ] After `POST /films/{id}/rate {rating:3.5}`, `GET /films/{id}` (same token) returns `myRating: 3.5`.
- [ ] After `POST /films/{id}/unrate`, `GET /films/{id}` returns `myRating: null` (or field omitted).
- [ ] Half-star values survive the round-trip (3.5 stays 3.5, not 3 or 4).
- [ ] Anonymous `GET /films/{id}` is unchanged (no `myRating`, or `null`).

### Frontend note

No further frontend change needed beyond reading `movie.myRating` — the `MovieDetail`
type already declares `myRating?: number | null`. Once shipped, the page passes it into
the rate modal as the initial star value.

---

## 2. Review-detail replies are all attributed to the review author

### Symptom

Every reply under a review shows the **review author's** username instead of the
person who actually wrote the reply.

Probe (authed):

```
GET /films/27205/reviews/8c7060a2-8976-4e00-8aa3-62371b384636
  review author: reel_talk_03
  6 replies, reported authors: reel_talk_03 | reel_talk_03 | reel_talk_03 |
                               reel_talk_03 | reel_talk_03 | reel_talk_03
```

All six replies were written by different seeded users, but every one is credited to
`reel_talk_03` (the review's author).

### Likely cause

The reply→user join (or the projection that builds each reply DTO) is keying off the
parent review's `UserId`/author instead of the reply row's own `UserId`. Each reply
should carry its own author's `userId` / `username` / `avatarUrl`.

### Acceptance criteria

- [ ] Each reply in the review-detail response reports its own author (`userId`,
      `username`, avatar), not the review author's.
- [ ] A review with replies from N distinct users shows N distinct authors.

> Note: the text of replies returns correctly (that was fixed 2026-06-12); only the
> **author attribution** is still wrong.

---

## 3. `POST /films/{id}/watch` is mark-only, not a toggle

Already written up in detail in **`docs/backend-tasks/watch-toggle.md`** — still open.
Short version: marking Watched then clicking Unwatch reverts after refresh because
`POST /watch` only inserts a row and never deletes it. Make it a toggle returning
`{ "isWatched": bool }`, mirroring `POST /like`. See that file for probes + acceptance
criteria.

---

## Already verified fixed (no action)

- `POST /films/{id}/reviews/{reviewId}/replies/{replyId}/like` — previously 500'd; now
  returns `200 { "isLiked": true, "likesCount": 1 }`. ✅ Working as of 2026-06-14.
