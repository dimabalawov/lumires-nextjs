# Backend bug: `POST /films/{id}/watch` doesn't unwatch (not a toggle)

## Symptom

On the web app, marking a film **Watched** then clicking again to **Unwatch** appears to work
in the UI, but after a page refresh the film is **still watched**. `GET /films/{id}` (authed)
keeps returning `isWatchedByMe: true`.

## Root cause

`POST /films/{id}/watch` only **inserts** a watched record (mark-watched). It never removes one,
so it can't toggle off. By contrast `POST /films/{id}/like` is a proper toggle (and returns the
new `isLiked` state), which is why liking/unliking works correctly.

Probe (unauthenticated, so 401 = exists / 405 = method not allowed):

```
POST   /films/122/like    -> 401   (toggle, works)
POST   /films/122/watch   -> 401   (mark-only, the bug)
DELETE /films/122/watch   -> 405   (no unwatch route)
PUT    /films/122/watch   -> 405
```

## Fix

Make **`POST /films/{id}/watch` a toggle**, mirroring `POST /films/{id}/like`:

- If the current user already has a `WatchedFilms` row for this film → **delete it** (unwatch).
- If not → **insert it** (watch).
- Auth required (Bearer JWT), same as `/like`.

And return the **new state** as JSON so the client doesn't need a follow-up read:

```
POST /films/{id}/watch   (Bearer required)
200 → { "isWatched": true|false }
```

(`/like` already returns `{ "isLiked": ..., "likesCount": ... }`; please match that style.)

## Acceptance criteria

- [ ] `POST /films/{id}/watch` when not watched → inserts the row, returns `{ "isWatched": true }`.
- [ ] `POST /films/{id}/watch` when already watched → deletes the row, returns `{ "isWatched": false }`.
- [ ] After unwatch, `GET /films/{id}` (same token) returns `isWatchedByMe: false`.
- [ ] Idempotent under rapid double-clicks (each POST flips the row exactly once).

## Notes

- The web app already trusts the returned `isWatched` field and reads `isWatchedByMe` from
  `GET /films/{id}` — no further frontend change is needed once this ships.
- If a DELETE-based design is strongly preferred instead (`DELETE /films/{id}/watch` to unwatch),
  that's acceptable too — just say so and the frontend will call DELETE for the off-toggle. The
  single-POST toggle is preferred for parity with `/like`.
