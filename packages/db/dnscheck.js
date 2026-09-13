const { execSync } = require("child_process");
const refs = ["zxelsngwbwztxeirqov", "zxelsngwbwzttxeirqov"];
for (const r of refs) {
  for (const dns of ["8.8.8.8", "1.1.1.1"]) {
    try {
      const o = execSync(`nslookup db.${r}.supabase.co ${dns} 2>&1`).toString();
      const ok = o.includes("Addresses:") && !o.includes("Non-existent");
      console.log(`db.${r} via ${dns}:`, ok ? "RESOLVES" : "NXDOMAIN");
    } catch {
      console.log(`db.${r} via ${dns}: NXDOMAIN`);
    }
  }
}
