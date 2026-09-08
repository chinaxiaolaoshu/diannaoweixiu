const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

(async () => {
  const r = await sql`SELECT id, slug, title, status FROM articles ORDER BY id`;
  console.log(JSON.stringify(r, null, 2));
  await sql.end();
})();
