"use strict";
const LK = "kenangan_msgs_v2";

function weekId() {
  const d = new Date(Date.now() + 7 * 3600e3);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
function nextReset() {
  const d = new Date(weekId() + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 7);
  return d.toLocaleDateString("id-ID", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
}

const localList = () => { try { const o = JSON.parse(localStorage.getItem(LK) || "{}"); return o.w === weekId() ? o.list || [] : []; } catch { return []; } };
const saveLocal = (list) => localStorage.setItem(LK, JSON.stringify({ w: weekId(), list: list.slice(-100) }));

async function getMessages() {
  try { const r = await fetch("api/messages"); if (!r.ok) throw 0; return { list: await r.json(), shared: true }; }
  catch { return { list: localList().slice(-30).reverse(), shared: false }; }
}

async function load() {
  const { list, shared } = await getMessages();
  $("#note").hidden = shared;
  $("#count").textContent = list.length ? `${list.length} pesan minggu ini` : "";
  $("#wall").innerHTML = list.map((m) => `<div class="glass"><b>${esc(m.name)}</b><br>${esc(m.text)}</div>`).join("")
    || `<p class="lead">Belum ada pesan minggu ini. Jadilah yang pertama!</p>`;
}

document.addEventListener("submit", async (e) => {
  if (e.target.id !== "mf") return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    let res = null;
    try { res = await fetch("api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); } catch {}
    if (res && res.status === 400) throw new Error((await res.json()).error);
    if (!res || !res.ok) {
      const l = localList();
      l.push({ name: data.name.trim().slice(0, 40), text: data.text.trim().slice(0, 200) });
      saveLocal(l);
    }
    e.target.reset(); toast("Pesan terkirim, terima kasih! 🙏"); load();
  } catch (err) { toast(err.message || "Gagal mengirim pesan"); }
});

initPage(() => {
  $("#reset").textContent = `Pesan direset setiap hari Senin. Reset berikutnya: ${nextReset()}.`;
  load();
  setInterval(load, 30000);
}, "Pesan Kenangan");
