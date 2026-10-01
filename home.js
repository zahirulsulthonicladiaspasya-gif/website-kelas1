"use strict";
initPage((D) => {
  if (D.heroImage) $("#home").style.setProperty("--hero", `url('${D.heroImage}')`);
  $("#home").innerHTML = `<span class="pill">WEBSITE RESMI</span><div class="orn" aria-hidden="true">❖ ❖ ❖</div><h1>Sugeng Rawuh<span>${esc(D.className)}</span></h1><p>"${esc(D.tagline)}"</p><div><a class="btn" href="tentang.html">Masuk Pendhapa</a></div>`;
  const links = [
    ["tentang.html", "Tentang", "Kenali kelas kami"],
    ["media.html", "Media Sosial", "Ikuti kami di sosial media"],
    ["struktur.html", "Our Hero", "Para pembimbing kami"],
    ["anggota.html", "Anggota", "Keluarga besar kami"],
    ["gallery.html", "Gallery", "Momen yang kami abadikan"],
    ["prestasi.html", "Prestasi", "Pencapaian bersama"],
    ["pesan.html", "Pesan Kenangan", "Tulis pesan untuk teman sekelas"],
  ];
  $("#quicklinks").innerHTML = head("Jelajahi", "Pilih halaman yang ingin kamu lihat.") +
    `<div class="grid">${links.map(([href, t, s]) => `<a class="glass" href="${href}"><h3>${esc(t)}</h3><small>${esc(s)}</small></a>`).join("")}</div>`;
}, "");
