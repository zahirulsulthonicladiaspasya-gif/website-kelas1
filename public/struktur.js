"use strict";
initPage((D) => {
  const H = D.heroes || {};
  const li = (arr) => (arr || []).map((n) => `<li>${esc(n)}</li>`).join("");
  $("#content").innerHTML = head("Our Hero", "Terima kasih kepada para ustadz dan ustadzah yang telah membimbing kami.") +
    `<div class="glass mudir"><div class="avatar" ${bg(H.mudir && H.mudir.photo)}>${(H.mudir && H.mudir.photo) ? "" : ini((H.mudir && H.mudir.name) || "M")}</div><small>${esc((H.mudir && H.mudir.role) || "Mudir PTNQ")}</small><h3>${esc(H.mudir && H.mudir.name)}</h3></div>` +
    `<div class="heroes"><div class="glass"><h3>Ustadz</h3><ul class="hlist">${li(H.ustadz)}</ul></div><div class="glass"><h3>Ustadzah</h3><ul class="hlist">${li(H.ustadzah)}</ul></div></div>`;
}, "Our Hero");
