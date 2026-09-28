"""Website kenangan kelas - server Python murni (tanpa framework).
Jalankan: python server.py  ->  http://localhost:8000
"""
import json
import mimetypes
import os
import threading
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.realpath(os.path.join(BASE, "public"))
MSGS = os.path.join(BASE, "messages.json")
lock = threading.Lock()


def week_id():
    """Tanggal Senin minggu ini (WIB). Ganti minggu -> pesan lama tidak tampil lagi."""
    d = datetime.now(timezone(timedelta(hours=7))).date()
    return (d - timedelta(days=d.weekday())).isoformat()


def read_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


class Handler(BaseHTTPRequestHandler):
    def send_json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/messages":
            w = week_id()
            cur = [m for m in read_json(MSGS, []) if m.get("w") == w]
            return self.send_json(200, cur[-30:][::-1])
        rel = "index.html" if path == "/" else path.lstrip("/")
        full = os.path.realpath(os.path.join(STATIC, rel))
        if not full.startswith(STATIC) or not os.path.isfile(full):
            return self.send_json(404, {"error": "Tidak ditemukan"})
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        with open(full, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype + ("; charset=utf-8" if ctype.startswith("text") or "javascript" in ctype else ""))
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path != "/api/messages":
            return self.send_json(404, {"error": "Tidak ditemukan"})
        try:
            n = int(self.headers.get("Content-Length") or 0)
            body = json.loads(self.rfile.read(min(n, 4096)) or b"{}")
        except (ValueError, TypeError):
            return self.send_json(400, {"error": "Data tidak valid"})
        name, text = str(body.get("name", "")).strip()[:40], str(body.get("text", "")).strip()[:200]
        if not name or not text:
            return self.send_json(400, {"error": "Nama dan pesan wajib diisi"})
        with lock:
            msgs = read_json(MSGS, [])
            msgs.append({"name": name, "text": text, "w": week_id()})
            with open(MSGS, "w", encoding="utf-8") as f:
                json.dump(msgs[-500:], f, ensure_ascii=False)
        self.send_json(200, {"ok": True})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Berjalan di http://localhost:{port}  (Ctrl+C untuk berhenti)")
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
