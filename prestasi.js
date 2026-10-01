"use strict";
initPage((D) => {
  $("#content").innerHTML = head("Prestasi", "Kami bangga dengan prestasi yang diraih bersama.") +
    rail("r2", D.achievements.map((a) => `<article class="glass ach"><div class="ph" ${bg(a.photo)}>${a.photo ? "" : "♛"}</div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join(""));
}, "Prestasi");
