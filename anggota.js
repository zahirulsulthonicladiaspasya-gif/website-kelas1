"use strict";
initPage((D) => {
  $("#content").innerHTML = head("Anggota Angkatan", "Daftar lengkap keluarga besar kami.") +
    rail("r1", D.members.map((m) => `<article class="glass member"><div class="avatar" ${bg(m.photo)}>${m.photo ? "" : ini(m.name)}</div><h3>${esc(m.name)}</h3><small>${esc(m.ig)}</small></article>`).join(""));
}, "Anggota");
