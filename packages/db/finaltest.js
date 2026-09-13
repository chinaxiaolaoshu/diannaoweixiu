const net = require("net");
function tryUser(user) {
  return new Promise((res) => {
    const s = net.Socket();
    s.setTimeout(12000);
    s.on("connect", () => {
      const startup = Buffer.concat([
        Buffer.from([0, 0, 0, 0]),
        Buffer.from(`user\0${user}\0database\0postgres\0\x00application_name\0test\0`),
      ]);
      const len = Buffer.alloc(4);
      len.writeUInt32BE(startup.length + 4);
      s.write(Buffer.concat([len, startup]));
    });
    s.on("data", (d) => {
      const body = d.slice(5).toString("utf8").replace(/\0/g, " | ");
      console.log(`[${user}] =>`, body.slice(0, 150));
      s.destroy();
      res();
    });
    s.on("error", (e) => { console.log(`[${user}] ERR`, e.code); res(); });
    s.on("timeout", () => { console.log(`[${user}] TIMEOUT`); s.destroy(); res(); });
    s.connect(6543, "aws-0-ap-south-1.pooler.supabase.com");
  });
}
(async () => {
  await tryUser("postgres.zxelsngwbwztxeirqov");
  await tryUser("postgres.zxelsngwbwzttxeirqov");
})();
