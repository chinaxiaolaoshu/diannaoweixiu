// 直接查 Supabase 权威 NS 的完整响应（含 DNSSEC/权威应答码）
const dgram = require("dgram");

function query(nameserver, name) {
  return new Promise((res) => {
    // 构造 DNS 查询包 (A 记录)
    const header = Buffer.from([0x12, 0x34, 0x01, 0x00, 0, 1, 0, 0, 0, 0, 0, 0]);
    const q = Buffer.concat([
      ...name.split(".").map((label) => {
        const l = Buffer.from([label.length]);
        return Buffer.concat([l, Buffer.from(label)]);
      }),
      Buffer.from([0]),
      Buffer.from([0, 1, 0, 1]), // A, IN
    ]);
    const packet = Buffer.concat([header, q]);
    const s = dgram.createSocket("udp4");
    const timer = setTimeout(() => { s.close(); res("TIMEOUT"); }, 8000);
    s.on("message", (msg) => {
      clearTimeout(timer);
      s.close();
      const rcode = msg[3] & 0x0f;
      const ancount = msg.readUInt16BE(6);
      const codes = ["NOERROR", "FORMERR", "SERVFAIL", "NXDOMAIN", "NOTIMP", "REFUSED", "6", "7"];
      res(`rcode=${codes[rcode]} answers=${ancount} raw=${msg.slice(msg.length - 16).toString("hex")}`);
    });
    s.on("error", (e) => { clearTimeout(timer); s.close(); res("SOCKET " + e.code); });
    s.send(packet, 53, nameserver);
  });
}

(async () => {
  for (const ns of ["108.162.194.193", "108.162.192.193"]) {
    console.log(`via ${ns}:`);
    console.log("  19ref:", await query(ns, "zxelsngwbwztxeirqov.supabase.co"));
    console.log("  20ref:", await query(ns, "zxelsngwbwzttxeirqov.supabase.co"));
  }
})();
