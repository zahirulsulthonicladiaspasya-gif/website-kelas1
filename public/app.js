"use strict";
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const NAV = [["home", "Home"], ["tentang", "Tentang"], ["media", "Media"], ["struktur", "Our Hero"], ["anggota", "Anggota"], ["gallery", "Gallery"], ["prestasi", "Prestasi"], ["pesan", "Pesan"]];
const PER_PAGE = 6;
let D = {}, page = 1;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}
const bg = (p) => (p ? `style="background-image:url('${esc(p)}')"` : "");
const ini = (n) => esc(n.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase());
const head = (t, sub) => `<h2>${t}</h2>${sub ? `<p class="lead">${esc(sub)}</p>` : ""}`;

function rail(id, items) {
  return `<div class="rail" id="${id}">${items}</div>
    <div class="ctl"><button data-rail="${id}" data-d="-1" aria-label="Sebelumnya">←</button><button data-rail="${id}" data-d="1" aria-label="Berikutnya">→</button></div>`;
}

function renderGallery() {
  const total = Math.max(1, Math.ceil(D.gallery.length / PER_PAGE));
  page = Math.min(page, total);
  const items = D.gallery.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  $("#galwrap").innerHTML = `<div class="gal">${items.map((g, i) => `<button class="glass" data-zoom="${(page - 1) * PER_PAGE + i}"><div class="ph" ${bg(g.photo)}>${g.photo ? "" : "❖"}</div><span>${esc(g.title)}</span></button>`).join("")}</div>
    <div class="pg"><button data-pg="${page - 1}" ${page === 1 ? "disabled" : ""}>Prev</button>
    ${Array.from({ length: total }, (_, i) => `<button data-pg="${i + 1}" class="${i + 1 === page ? "on" : ""}">${i + 1}</button>`).join("")}
    <button data-pg="${page + 1}" ${page === total ? "disabled" : ""}>Next</button></div>`;
}


function render() {
  document.title = `Website Resmi ${D.className} - ${D.brand}`;
  $("#brand").innerHTML = `${esc(D.brand.slice(0, -4))}<b>${esc(D.brand.slice(-4))}</b>`;
  $("#menu").innerHTML = NAV.map(([id, t]) => `<a href="${id === "pesan" ? "pesan.html" : "#" + id}">${t}</a>`).join("");
  if (D.heroImage) $("#home").style.setProperty("--hero", `url('${D.heroImage}')`);
  $("#home").innerHTML = `<span class="pill">WEBSITE RESMI</span><div class="orn" aria-hidden="true">❖ ❖ ❖</div><h1>Sugeng Rawuh<span>${esc(D.className)}</span></h1><p>“${esc(D.tagline)}”</p><div><a class="btn" href="#tentang">Masuk Pendhapa</a></div>`;
  $("#tentang").innerHTML = head("Tentang " + esc(D.className), D.about) + `<div class="stats">${D.stats.map((s) => `<div class="glass"><b>${s.n}</b><span>${esc(s.l)}</span></div>`).join("")}</div>`;
  $("#media").innerHTML = head("Media Sosial", "Ikuti kami untuk melihat momen dan cerita terbaru.") + `<div class="grid">${D.social.map((s) => `<a class="glass" href="${esc(s.url)}" target="_blank" rel="noopener"><h3>${esc(s.name)}</h3><small>${esc(s.handle)}</small></a>`).join("")}</div>`;
  const H = D.heroes || {};
  const li = (arr) => (arr || []).map((n) => `<li>${esc(n)}</li>`).join("");
  $("#struktur").innerHTML = head("Our Hero", "Terima kasih kepada para guru yang telah membimbing kami.") +
    `<div class="glass mudir"><div class="avatar" ${bg(H.mudir?.photo)}>${H.mudir?.photo ? "" : ini(H.mudir?.name || "M")}</div><small>${esc(H.mudir?.role || "Mudir PTNQ")}</small><h3>${esc(H.mudir?.name)}</h3></div>` +
    `<div class="heroes"><div class="glass"><h3>Ustadz</h3><ul class="hlist">${li(H.ustadz)}</ul></div><div class="glass"><h3>Ustadzah</h3><ul class="hlist">${li(H.ustadzah)}</ul></div></div>`;
  $("#anggota").innerHTML = head("Anggota Angkatan", "Daftar lengkap keluarga besar kami.") +
    rail("r1", D.members.map((m) => `<article class="glass member"><div class="avatar" ${bg(m.photo)}>${m.photo ? "" : ini(m.name)}</div><h3>${esc(m.name)}</h3><small>${esc(m.ig)}</small></article>`).join(""));
  $("#gallery").innerHTML = head("Gallery", "Sebagian momen yang berhasil kami abadikan.") + `<div id="galwrap"></div>`;
  $("#prestasi").innerHTML = head("Prestasi", "Kami bangga dengan prestasi yang diraih bersama.") +
    rail("r2", D.achievements.map((a) => `<article class="glass ach"><div class="ph" ${bg(a.photo)}>${a.photo ? "" : "♛"}</div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join(""));
  $("#pesan").innerHTML = head("Pesan Kenangan", "Tulis satu kalimat untuk teman-teman sekelas. Pesan diperbarui setiap minggu.") + `<div style="text-align:center"><a class="btn" href="pesan.html">Tulis &amp; Baca Pesan</a></div>`;
  $("#foot").textContent = `© 2026 ${D.className}. Dibuat dengan penuh kenangan.`;
  renderGallery(); observe();
}

/* ---------- interaksi ---------- */
document.addEventListener("click", (e) => {
  const t = e.target;
  const r = t.closest("[data-rail]");
  if (r) { const el = $("#" + r.dataset.rail); el.scrollBy({ left: el.clientWidth * 0.8 * Number(r.dataset.d), behavior: "smooth" }); }
  const p = t.closest("[data-pg]");
  if (p && !p.disabled) { page = Number(p.dataset.pg); renderGallery(); }
  const z = t.closest("[data-zoom]");
  if (z) { const g = D.gallery[Number(z.dataset.zoom)]; $("#lightbox").innerHTML = `<div class="ph" ${bg(g.photo)}>${g.photo ? "" : "❖"}</div>`; $("#lightbox").hidden = false; }
  if (t.closest("#lightbox")) $("#lightbox").hidden = true;
  if (t.closest("#menu a")) $("#menu").classList.remove("open");
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("#lightbox").hidden = true; });
$("#burger").onclick = () => $("#burger").setAttribute("aria-expanded", $("#menu").classList.toggle("open"));

function observe() {
  const io = new IntersectionObserver((es) => es.forEach((x) => x.isIntersecting && x.target.classList.add("in")), { threshold: 0.12 });
  document.querySelectorAll(".sec").forEach((s) => { s.classList.add("rv"); io.observe(s); });
  const spy = new IntersectionObserver((es) => es.forEach((x) => {
    if (x.isIntersecting) document.querySelectorAll("#menu a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + x.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section").forEach((s) => spy.observe(s));
}

fetch("data.json").then((r) => r.json()).then((d) => { D = d; render(); })
  .catch(() => { document.querySelector("main").innerHTML = `<p class="lead" style="padding:120px 20px">Gagal memuat data. Pastikan server.py berjalan.</p>`; });
