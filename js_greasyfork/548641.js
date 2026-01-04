// ==UserScript==
// @name         Neopets Faerie Crossword — Fill word from TDN on clue click (no submit)
// @namespace    neopets
// @version      1.0.0
// @description  When you click a clue, fills the Word box with the matching answer from TDN. Does not submit.
// @match        https://www.neopets.com/games/crossword/crossword.phtml*
// @match        http://www.neopets.com/games/crossword/crossword.phtml*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      thedailyneopets.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548641/Neopets%20Faerie%20Crossword%20%E2%80%94%20Fill%20word%20from%20TDN%20on%20clue%20click%20%28no%20submit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548641/Neopets%20Faerie%20Crossword%20%E2%80%94%20Fill%20word%20from%20TDN%20on%20clue%20click%20%28no%20submit%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- tiny helper ---
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // --- fetch & parse TDN (https://thedailyneopets.com/index/fca) ---
  async function fetchTDN() {
    const url = "https://thedailyneopets.com/index/fca";
    const html = await gmGet(url);
    return parseTDN(html);
  }

  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (r) => {
          if (r.status >= 200 && r.status < 300) resolve(r.responseText);
          else reject(new Error(`${url} -> ${r.status}`));
        },
        onerror: () => reject(new Error(`${url} -> network error`)),
      });
    });
  }

  function textify(html) {
    // turn HTML into simple text so the simple regex works regardless of tags/brs
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\u00A0/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }

  function parseTDN(html) {
    const txt = textify(html);
    // Grab the Across block and the Down block
    const acrossBlock = /Across:\s*([\s\S]*?)\bDown:/i.exec(txt)?.[1] || "";
    const downBlock = /\bDown:\s*([\s\S]*)$/i.exec(txt)?.[1] || "";

    const across = extractNumWordPairs(acrossBlock);
    const down = extractNumWordPairs(downBlock);

    return { across, down }; // maps: number -> UPPERCASE word
  }

  function extractNumWordPairs(blockText) {
    // Accept lines like: "4. bbq" (maybe mixed case / punctuation)
    const map = new Map();
    const lines = blockText.split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*(\d{1,2})\s*[\.\:\-)]\s*([A-Za-z'-]+)\s*$/);
      if (m) {
        const num = Number(m[1]);
        const word = m[2].toUpperCase(); // puzzle takes letters; upper is convenient
        if (!map.has(num)) map.set(num, word);
      }
    }
    return map;
  }

  function parseSetClueArgs(el) {
    // Extract (row, col, dir, num) from the onclick="set_clue(r,c,dir,num)"
    const s = (el.getAttribute("onclick") || "").replace(/\s+/g, "");
    const m = s.match(/set_clue\((\d+),(\d+),(\d+),(\d+)\)/);
    if (!m) return null;
    return { row: +m[1], col: +m[2], dir: +m[3], num: +m[4] };
  }

  // --- main wiring ---
  const answersPromise = fetchTDN().catch(() => ({ across: new Map(), down: new Map() }));

  document.addEventListener(
    "click",
    async (evt) => {
      const a = evt.target?.closest('a[onclick*="set_clue("]');
      if (!a) return;

      // Let the page's set_clue() run first so it updates the “Active Clue” box
      await sleep(0);

      const args = parseSetClueArgs(a);
      if (!args) return;

      const form = document.forms?.clueform;
      const wordInput = form?.elements?.x_word;
      if (!wordInput) return;

      const { across, down } = await answersPromise;
      const isAcross = args.dir === 1;
      const map = isAcross ? across : down;

      const answer = map.get(args.num);
      if (answer) {
        wordInput.value = answer; // FILL ONLY — no submit
      } else {
        // If today’s page hasn’t updated yet, do nothing silently.
        // (You can manually type the word or refresh later.)
      }
    },
    true
  );
})();
