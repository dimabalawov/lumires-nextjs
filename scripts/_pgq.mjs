import { readFileSync } from 'node:fs';
for (const l of readFileSync('.env.local','utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g,'');
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export async function q(sql){
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(`${URL}/pg/query`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', apikey:KEY, Authorization:`Bearer ${KEY}` },
      body: JSON.stringify({ query: sql }),
    });
    const t = await r.text();
    if (r.ok) return t ? JSON.parse(t) : null;
    if ([502,503,504].includes(r.status) && attempt < 4) {
      await new Promise(res => setTimeout(res, 800 * (attempt + 1)));
      continue;
    }
    throw new Error(`${r.status} ${t.slice(0,200)}`);
  }
}
if (process.argv[2]) q(process.argv[2]).then(x=>console.log(JSON.stringify(x,null,2))).catch(e=>{console.error(e.message);process.exit(1)});
