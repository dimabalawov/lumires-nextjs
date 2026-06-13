# Backend task — "Add to list" modal endpoints

> **STATUS 2026-06-14: IMPLEMENTED in source (not yet deployed).** All three endpoints
> added under `lumires.Api/Features/FilmsLists/` — `GetMyListsForFilm/`, `AddFilmToList/`,
> `RemoveFilmFromList/` (each Endpoint.cs + DataAccess.cs + Summary.cs). Solution builds
> clean. Routes/fields match this doc exactly. `{filmId}` is the TMDB external id (matched
> on `Film.ExternalId`), invisible to the frontend. Ownership failures → 403 (exists, not
> yours) / 404 (missing). **Requires a backend redeploy before the live API serves them.**
> Frontend (modal + proxies + lib) is wired against these exact shapes.



The frontend is adding an **Add-to-list** modal on the film page (gold "Add to list"
button in the film hero). It shows the current user's own lists with a checkbox per
list (checked if the film is already in it) and toggles membership inline.

The existing API can't power this cleanly: the only way to change a list's films is
`PUT /lists/{id}` (`UpdateFilmsList`), which **replaces the whole list** (race-prone,
needs title/privacy/full filmId set), and there's no "my lists + does this film belong"
read. Please add the three endpoints below in the `FilmsLists` feature area, following
the existing FastEndpoints vertical-slice pattern.

All three require **Bearer auth** (not `AllowAnonymous`). Operate on lists **owned by
the current user** (`currentUserService.UserId`); reject other users' lists with 403/404.

---

## 1. `GET /films/{filmId:int}/lists/mine` — my lists + membership for a film

Returns **all** lists owned by the current user (not the "popular" subset), each
flagged with whether `filmId` is already in it.

```
GET /films/{filmId}/lists/mine        (Bearer required)
200 →
{
  "lists": [
    {
      "id": "guid",
      "title": "Slow Cinema, After Midnight",
      "filmsCount": 5,
      "isPrivate": false,
      "containsFilm": true,
      "films": [ { "posterPath": "/abc.jpg" }, { "posterPath": "/def.jpg" } ]
    }
  ]
}
```

- `containsFilm`: is `{filmId}` in this list (for the pre-checked checkbox).
- `films`: a few poster paths (cap at ~2–3) for the stacked thumbnails in the UI.
- `filmsCount`: total films in the list (the UI shows "5 films").
- 401 if anonymous.
- Mirror the projection style in `GetUserPopularLists`/`GetFilmsLists` `DataAccess.cs`,
  but scope to `UserId == currentUserId` and add `containsFilm` + `isPrivate`.

## 2. `POST /lists/{listId:guid}/films/{filmId:int}` — add a film to my list

Adds `filmId` to the list if not already present. Idempotent.

```
POST /lists/{listId}/films/{filmId}   (Bearer required)
200 → { "containsFilm": true }
```

- 403/404 if the list isn't owned by the current user.
- Use `IFilmResolver.EnsureFilmExistsAsync` (as other film endpoints do) before insert.

## 3. `DELETE /lists/{listId:guid}/films/{filmId:int}` — remove a film from my list

```
DELETE /lists/{listId}/films/{filmId} (Bearer required)
200 → { "containsFilm": false }
```

- Idempotent (removing an absent film still returns `{ "containsFilm": false }`).
- 403/404 if the list isn't owned by the current user.

---

## Acceptance criteria

- [ ] `GET /films/{id}/lists/mine` returns only the caller's lists, each with correct
      `containsFilm`, `filmsCount`, `isPrivate`, and up to 3 `films[].posterPath`.
- [ ] `POST /lists/{listId}/films/{filmId}` inserts membership and returns `{containsFilm:true}`;
      calling twice is harmless.
- [ ] `DELETE …` removes membership and returns `{containsFilm:false}`; calling twice is harmless.
- [ ] Both mutations 403/404 when the list belongs to another user.
- [ ] All three 401 when unauthenticated.

## Frontend contract notes

- C# PascalCase records serialize to camelCase JSON (`ContainsFilm` → `containsFilm`) —
  the frontend reads camelCase.
- The frontend proxies these as `/api/films/{id}/lists/mine` (GET) and
  `/api/lists/{listId}/films/{filmId}` (POST/DELETE) and is being built against the exact
  shapes above. Flag in your report if any route/field has to differ.
- Reminder: the **deployed** API currently lags `main` — after implementing, note that a
  deploy is required before the live web app can use these.
