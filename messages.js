// Vercel Serverless Function - pesan disimpan di Upstash Redis, dipisah per minggu (Senin, WIB).
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// ID minggu = tanggal Senin (WIB, UTC+7). Ganti minggu -> daftar pesan otomatis kosong.
function weekId() {
  const d = new Date(Date.now() + 7 * 3600e3);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!URL_ || !TOKEN) return res.status(503).json({ error: "Database belum dikonfigurasi" });
  const KEY = `kelas:messages:${weekId()}`;
  try {
    if (req.method === "GET") {
      const rows = await redis(["LRANGE", KEY, 0, 29]); // terbaru di depan
      return res.status(200).json(rows.map((x) => JSON.parse(x)));
    }
    if (req.method === "POST") {
      const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const name = String(b.name || "").trim().slice(0, 40);
      const text = String(b.text || "").trim().slice(0, 200);
      if (!name || !text) return res.status(400).json({ error: "Nama dan pesan wajib diisi" });
      await redis(["LPUSH", KEY, JSON.stringify({ name, text })]);
      await redis(["LTRIM", KEY, 0, 499]);
      await redis(["EXPIRE", KEY, 60 * 24 * 3600]); // arsip disimpan 60 hari
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  } catch (e) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
