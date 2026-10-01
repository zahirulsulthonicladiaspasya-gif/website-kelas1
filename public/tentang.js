"use strict";
initPage((D) => {
  $("#content").innerHTML = head("Tentang " + esc(D.className), D.about) +
    `<div class="stats">${D.stats.map((s) => `<div class="glass"><b>${s.n}</b><span>${esc(s.l)}</span></div>`).join("")}</div>`;
}, "Tentang");
