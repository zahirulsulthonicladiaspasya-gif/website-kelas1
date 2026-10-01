"use strict";
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const NAV = [["index.html", "Home"], ["tentang.html", "Tentang"], ["media.html", "Media"], ["struktur.html", "Our Hero"], ["anggota.html", "Anggota"], ["gallery.html", "Gallery"], ["prestasi.html", "Prestasi"], ["pesan.html", "Pesan"]];
const bg = (p) => (p ? `style="background-image:url('${esc(p)}')"` : "");
const ini = (n) => esc((n || "").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase());
const head = (t, sub) => `<h2>${t}</h2>${sub ? `<p class="lead">${esc(sub)}</p>` : ""}`;

function rail(id, items) {
  return `<div class="rail" id="${id}">${items}</div>
    <div class="ctl"><button data-rail="${id}" data-d="-1" aria-label="Sebelumnya">←</button><button data-rail="${id}" data-d="1" aria-label="Berikutnya">→</button></div>`;
}

function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

function thisPage() {
  const p = location.pathname.split("/").pop();
  return p === "" ? "index.html" : p;
}

function renderChrome(D, titleSuffix) {
  document.title = `${titleSuffix ? titleSuffix + " - " : ""}${D.className} - ${D.brand}`;
  const brandEl = $("#brand");
  if (brandEl) brandEl.innerHTML = `${esc(D.brand.slice(0, -4))}<b>${esc(D.brand.slice(-4))}</b>`;
  const here = thisPage();
  const menuEl = $("#menu");
  if (menuEl) menuEl.innerHTML = NAV.map(([href, t]) => `<a href="${href}" class="${href === here ? "on" : ""}">${t}</a>`).join("");
  const footEl = $("#foot");
  if (footEl) footEl.textContent = `© 2026 ${D.className}. Dibuat dengan penuh kenangan.`;
}

function revealSections() {
  const io = new IntersectionObserver((es) => es.forEach((x) => x.isIntersecting && x.target.classList.add("in")), { threshold: 0.12 });
  document.querySelectorAll(".sec").forEach((s) => { s.classList.add("rv"); io.observe(s); });
}

function initPage(renderFn, titleSuffix) {
  fetch("data.json").then((r) => r.json()).then((D) => {
    renderChrome(D, titleSuffix);
    renderFn(D);
    revealSections();
  }).catch(() => {
    const m = document.querySelector("main");
    if (m) m.innerHTML = `<p class="lead" style="padding:120px 20px">Gagal memuat data. Pastikan file data.json ada.</p>`;
  });
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const r = t.closest("[data-rail]");
  if (r) { const el = $("#" + r.dataset.rail); if (el) el.scrollBy({ left: el.clientWidth * 0.8 * Number(r.dataset.d), behavior: "smooth" }); }
  if (t.closest("#menu a")) { const m = $("#menu"); if (m) m.classList.remove("open"); }
});
const burger = $("#burger");
if (burger) burger.onclick = () => burger.setAttribute("aria-expanded", $("#menu").classList.toggle("open"));
