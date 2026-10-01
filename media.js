"use strict";
initPage((D) => {
  $("#content").innerHTML = head("Media Sosial", "Ikuti kami untuk melihat momen dan cerita terbaru.") +
    `<div class="grid">${D.social.map((s) => `<a class="glass" href="${esc(s.url)}" target="_blank" rel="noopener"><h3>${esc(s.name)}</h3><small>${esc(s.handle)}</small></a>`).join("")}</div>`;
}, "Media Sosial");
