"use strict";
let D, PAGE = 1, ZOOM = null;
const PER_PAGE = 6;

function renderGallery() {
  const total = Math.max(1, Math.ceil(D.gallery.length / PER_PAGE));
  PAGE = Math.min(PAGE, total);
  const items = D.gallery.slice((PAGE - 1) * PER_PAGE, PAGE * PER_PAGE);
  $("#galwrap").innerHTML = `<div class="gal">${items.map((g, i) => {
    const gi = (PAGE - 1) * PER_PAGE + i;
    const photos = g.photos || [];
    const cover = photos[0] || "";
    return `<button class="glass" data-zoom="${gi}"><div class="ph" ${bg(cover)}>${cover ? "" : "❖"}${photos.length > 1 ? `<span class="badge">+${photos.length - 1}</span>` : ""}</div><span>${esc(g.title)}</span></button>`;
  }).join("")}</div>
    <div class="pg"><button data-pg="${PAGE - 1}" ${PAGE === 1 ? "disabled" : ""}>Prev</button>
    ${Array.from({ length: total }, (_, i) => `<button data-pg="${i + 1}" class="${i + 1 === PAGE ? "on" : ""}">${i + 1}</button>`).join("")}
    <button data-pg="${PAGE + 1}" ${PAGE === total ? "disabled" : ""}>Next</button></div>`;
}

function openZoom(gi, pi) {
  const g = D.gallery[gi];
  const photos = g.photos && g.photos.length ? g.photos : [""];
  pi = ((pi % photos.length) + photos.length) % photos.length;
  ZOOM = { gi, pi };
  const multi = photos.length > 1;
  $("#lightbox").innerHTML = `<div class="lbwrap">
      <div class="ph" ${bg(photos[pi])}>${photos[pi] ? "" : "❖"}</div>
      <p class="lbtitle">${esc(g.title)}${multi ? ` <small>(${pi + 1}/${photos.length})</small>` : ""}</p>
      ${multi ? `<button class="lbnav prev" data-zd="-1" aria-label="Foto sebelumnya">←</button><button class="lbnav next" data-zd="1" aria-label="Foto berikutnya">→</button>` : ""}
    </div>`;
  $("#lightbox").hidden = false;
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const p = t.closest("[data-pg]");
  if (p && !p.disabled) { PAGE = Number(p.dataset.pg); renderGallery(); }
  const zd = t.closest("[data-zd]");
  if (zd) { e.stopPropagation(); if (ZOOM) openZoom(ZOOM.gi, ZOOM.pi + Number(zd.dataset.zd)); return; }
  const z = t.closest("[data-zoom]");
  if (z) { openZoom(Number(z.dataset.zoom), 0); return; }
  if (t.closest("#lightbox")) { $("#lightbox").hidden = true; ZOOM = null; }
});
document.addEventListener("keydown", (e) => {
  if ($("#lightbox").hidden) return;
  if (e.key === "Escape") { $("#lightbox").hidden = true; ZOOM = null; }
  if (e.key === "ArrowLeft" && ZOOM) openZoom(ZOOM.gi, ZOOM.pi - 1);
  if (e.key === "ArrowRight" && ZOOM) openZoom(ZOOM.gi, ZOOM.pi + 1);
});

initPage((data) => {
  D = data;
  $("#content").innerHTML = head("Gallery", "Sebagian momen yang berhasil kami abadikan. Klik salah satu untuk melihat semua foto momen itu.") + `<div id="galwrap"></div>`;
  renderGallery();
}, "Gallery");
