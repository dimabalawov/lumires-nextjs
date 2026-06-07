import { q } from './_pgq.mjs';

const TMDB_KEY = process.env.TMDB_KEY;
if (!TMDB_KEY) { console.error('Set TMDB_KEY'); process.exit(1); }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// 1. Genre map: TMDB ExternalId -> Genres.Id (uuid)
const genres = await q('select "Id","ExternalId" from "Genres"');
const genreByExt = new Map(genres.map(g => [g.ExternalId, g.Id]));

// 2. Films missing any FilmGenres row
const films = await q(`
  select f."Id", f."ExternalId"
  from "Films" f
  left join (select distinct "FilmId" from "FilmGenres") fg on fg."FilmId" = f."Id"
  where fg."FilmId" is null and f."ExternalId" is not null
  order by f."ExternalId"`);
console.log(`${films.length} films missing genres`);

let linked = 0, noTmdbGenres = 0, failed = 0;
const values = [];
for (let i = 0; i < films.length; i++) {
  const f = films[i];
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${f.ExternalId}?api_key=${TMDB_KEY}`);
    if (!res.ok) { failed++; console.warn(`  ! ${f.ExternalId} -> ${res.status}`); await sleep(60); continue; }
    const d = await res.json();
    const ids = (d.genres ?? []).map(g => g.id).filter(id => genreByExt.has(id));
    if (!ids.length) { noTmdbGenres++; }
    for (const gid of ids) values.push(`('${f.Id}','${genreByExt.get(gid)}')`);
    linked += ids.length;
  } catch (e) { failed++; console.warn(`  ! ${f.ExternalId}: ${e.message}`); }
  process.stdout.write(`\r  fetched ${i+1}/${films.length}, pairs ${values.length}`);
  await sleep(60);
}
process.stdout.write('\n');

// 3. Bulk insert, skip any that somehow already exist
if (values.length) {
  // chunk to keep statements reasonable
  const CHUNK = 500;
  for (let i = 0; i < values.length; i += CHUNK) {
    const slice = values.slice(i, i + CHUNK).join(',');
    await q(`insert into "FilmGenres" ("FilmId","GenresId") values ${slice}
             on conflict do nothing`);
  }
}
console.log(`Inserted ${values.length} film-genre links across ${films.length - noTmdbGenres - failed} films.`);
console.log(`(${noTmdbGenres} films had no matching TMDB genres, ${failed} fetch failures.)`);
