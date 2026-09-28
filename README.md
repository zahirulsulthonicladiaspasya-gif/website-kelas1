# Website Kelas

Struktur:
- `public/`  → semua file website (index.html, style.css, app.js, data.json, img/)
- `api/messages.js` → backend pesan untuk Vercel (Upstash Redis)
- `server.py` → server lokal (`python server.py`, buka http://localhost:8000)

Edit isi website cukup lewat `public/data.json`. Taruh foto di `public/img/`
lalu tulis path-nya seperti `"img/nama-foto.jpg"` (tanpa `/` di depan).
