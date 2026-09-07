const { hash } = require('bcryptjs');
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

(async () => {
  const h = await hash('WeinanIT2026Secure!', 12);
  await sql`INSERT INTO users (email, password_hash, name, role) VALUES ('admin@0913610.xyz', ${h}, '管理员', 'admin')`;
  console.log('Admin created: admin@0913610.xyz');
  await sql.end();
})();
