// ==UserScript==
// @name        HijriToGeorgain
// @namespace   Violentmonkey Scripts
// @match       https://edugate.ksu.edu.sa/ksu/ui/student/final_exams/index/forwardFinalExams.faces*
// @grant       none
// @version     1.1
// @author      riyan1215
// @description Converts the hijri dates on the Final exam page to Georgian
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/559324/HijriToGeorgain.user.js
// @updateURL https://update.greasyfork.org/scripts/559324/HijriToGeorgain.meta.js
// ==/UserScript==
(() => {
  "use strict";

  const SELECTOR = ".ContentSec form tbody:nth-child(2)>tr>td:nth-child(7)";

  async function convertCell(td) {
    const h = td.textContent.trim();
    if (!h) return;

    const parts = h.split("-");
    if (parts.length !== 3) return;
    const [d, m, y] = parts.map(s => s.trim());
    if (!/^\d+$/.test(y) || Number(y) >= 1900) return;

    try {
      const res = await fetch(`https://api.aladhan.com/v1/hToG/${d}-${m}-${y}?calendar=ummalqura`);
      const json = await res.json();
      const g = json?.data?.gregorian?.date;
      if (!g) return;

      td.textContent = g;
    } catch (e) {
      console.warn("Hijri->Gregorian conversion failed for:", h, e);
    }
  }

  function run() {
    document.querySelectorAll(SELECTOR).forEach(td => convertCell(td));
  }

  run();
  const mo = new MutationObserver(() => run());
  mo.observe(document.body, { childList: true, subtree: true });
})();