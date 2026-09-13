const net = require("net");
function tryUser(host, port, user) {
  return new Promise((res) => {
    const s = net.Socket();
    s.setTimeout(12000);
    s.on("connect", () => {
      const startup = Buffer.concat([
        Buffer.from([0, 0, 0, 0]),
        Buffer.from(`user\0${user}\0database\0postgres\0\0`),
      ]);
      const len = Buffer.alloc(4);
      len.writeUInt32BE(startup.length + 4);
      s.write(Buffer.concat([len, startup]));
    });
    s.on("data", (d) => {
      const body = d.slice(5).toString("utf8").replace(/\0/g, " | ");
      console.log(`[${host}:${port}] user=${user} =>`, body.slice(0, 140));
      s.destroy();
      res();
    });
    s.on("error", (e) => {
      console.log(`[${host}:${port}] user=${user} ERR`, e.code);
      res();
    });
    s.on("timeout", () => {
      console.log(`[${host}:${port}] user=${user} TIMEOUT`);
      s.destroy();
      res();
    });
    s.connect(port, host);
  });
}
(async () => {
  // 正确 ref（JWT 精确解码）：zxelsngwbwzttxeirqov（20位）
  await tryUser("aws-0-ap-southeast-1.pooler.supabase.com", 5432, "postgres.zxelsngwbwzttxeirqov");
  // 错误 ref（19位）
  await tryUser("aws-0-ap-southeast-1.pooler.supabase.com", 5432, "postgres.zxelsngwbwztxeirqov");
})();
