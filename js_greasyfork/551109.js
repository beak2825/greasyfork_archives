// ==UserScript==
// @name         Times Crossword Extractor
// @namespace    xwd-snitch
// @version      0.4.1
// @description  Extract grid, clues, and answers from The Times crossword page
// @match        https://www.thetimes.com/*
// @match        https://www.thetimes.co.uk/*
// @match        https://feeds.thetimes.com/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551109/Times%20Crossword%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/551109/Times%20Crossword%20Extractor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- detection ----------
  function looksLikePuzzleDoc() {
    return !!($('svg g.row') || $('.clue-set--across') || $('.clue-list'));
  }
  async function waitForGame() {
    for (let i = 0; i < 300; i++) {
      if (looksLikePuzzleDoc()) return true;
      await sleep(100);
    }
    return false;
  }

  // ---------- UI (bottom-left) ----------
  function makeButton() {
    if (document.getElementById('xwd-extract-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'xwd-extract-btn';
    btn.textContent = 'Extract Blog Skeleton';
    Object.assign(btn.style, {
      position: 'fixed',
      left: '18px',
      bottom: '18px',
      zIndex: 2147483647,
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid #999',
      background: '#fff',
      font: '14px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,.15)'
    });
    btn.addEventListener('click', extract);
    document.body.appendChild(btn);
  }

    // ---------- header/meta ----------
    function extractPuzzleMeta() {
      const getText = (sel) => (document.querySelector(sel)?.textContent || '').trim();

      // Timer (shows the live/finished time in the header)
      const timerRaw = getText('.puzzle-header .timer, [role="timer"]'); // e.g. "16:44"

      // Title (e.g. "Times Cryptic" / "Times Quick Cryptic")
      const title = getText('.puzzle-title__name').replace(/\s+/g, ' ').trim();

      // Number (strip leading "No ")
      const number = getText('.puzzle-title__meta span, .puzzle-title__meta')
                        .replace(/^No\s*/i, '')
                        .trim() || null;

      // Setter (if present; strip leading "By ")
      let setterRaw = getText('#setter') || getText('.setter') || '';
      const setter = setterRaw.replace(/^By\s*/i, '').trim() || null;

      return {
        timer: timerRaw || null,
        title: title || null,
        number,
        setter
      };
    }


  // ---------- grid (letters + printed numbers) ----------
    function readGridWithNumbers() {
      // Collect all cells (works whether they’re grouped under g.row or flat)
      const cells = Array.from(document.querySelectorAll('svg g.cell-group, svg g.row g.cell-group'));
      if (!cells.length) return null;

      // Find grid dimensions via aria row/col indexes (1-based in the Times SVG)
      let R = 0, C = 0;
      const triples = cells.map(cell => {
        const rect = cell.querySelector('rect.cell, rect[role="cell"]');
        const r1 = parseInt(rect?.getAttribute('aria-rowindex') || '', 10);
        const c1 = parseInt(rect?.getAttribute('aria-colindex') || '', 10);
        // Fallback if aria-* missing — derive from DOM order (less robust, but safer than dying)
        const r = Number.isFinite(r1) ? r1 : 1;
        const c = Number.isFinite(c1) ? c1 : 1;

        const letterEl = cell.querySelector('.cell-letter');
        const numEl    = cell.querySelector('.cell-number');

        const letter = (letterEl?.textContent || '').trim().toUpperCase();
        const printedNumber = (numEl?.textContent || '').trim(); // e.g. "9" (may be empty)

        R = Math.max(R, r);
        C = Math.max(C, c);
        return { r, c, letter, printedNumber };
      });

      // Build matrices
      const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => '#'));
      const nums = Array.from({ length: R }, () => Array.from({ length: C }, () => null));

      for (const { r, c, letter, printedNumber } of triples) {
        // Times uses empty letter for a block; treat non-letters as blocks
        grid[r - 1][c - 1] = letter ? letter : '#';
        nums[r - 1][c - 1] = printedNumber || null;
      }

      return { grid, numbers: nums };
    }

    function extractEntries(grid, numbers) {
      const R = grid.length, C = grid[0]?.length || 0;
      const isBlock = (r, c) => r < 0 || c < 0 || r >= R || c >= C || grid[r][c] === '#';
      const across = [], down = [];

      let fallbackNumCounter = 1; // used only if a start square lacks a printed number

      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          if (grid[r][c] === '#') continue;

          const startsAcross = isBlock(r, c - 1);
          const startsDown   = isBlock(r - 1, c);

          if (startsAcross || startsDown) {
            // Prefer the printed number in the SVG; otherwise fallback
            const printed = numbers?.[r]?.[c];
            const num = printed && /^\d+$/.test(printed) ? parseInt(printed, 10) : (fallbackNumCounter++);

            if (startsAcross) {
              let cc = c, s = '';
              while (!isBlock(r, cc)) { s += grid[r][cc]; cc++; }
              across.push({ number: num, row: r + 1, col: c + 1, answer: s });
            }
            if (startsDown) {
              let rr = r, s = '';
              while (!isBlock(rr, c)) { s += grid[rr][c]; rr++; }
              down.push({ number: num, row: r + 1, col: c + 1, answer: s });
            }
          }
        }
      }
      return { across, down };
    }


  // ---------- clues ----------
  function extractClues() {
    const html2text = (h) => h.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    const readSet = (rootSel) => {
      const root = $(rootSel);
      if (!root) return [];
      const items = [];
      (root.querySelectorAll('.clue-list li') || []).forEach(li => {
        const num = li.querySelector('.clue__number')?.textContent?.trim() || '';
        const textHtml = li.querySelector('.clue__text')?.innerHTML?.trim() || '';
        const fmt = li.querySelector('.clue__length')?.textContent?.trim() || '';
        const ansHtml = li.querySelector('.clue-answer__answer')?.innerHTML?.trim() || '';
        items.push({
          number: num,
          text: html2text(textHtml),
          format: fmt || null, // e.g. "(5,5)" "(7-2-3)" "(3-2,4)"
          answer: ansHtml ? html2text(ansHtml).toUpperCase() : null
        });
      });
      return items;
    };

    let across = readSet('.clue-set--across');
    let down   = readSet('.clue-set--down');

    // Fallback for alternate markup
    if (!across.length && !down.length) {
      const allLis = $$('.clue-list li');
      if (allLis.length) {
        const both = allLis.map(li => {
          const sec = li.closest('[data-direction]')?.getAttribute('data-direction') || 'across';
          const num = li.querySelector('[data-testid="clue-number"], .clue__number')?.textContent?.trim() || '';
          const txt = li.querySelector('[data-testid="clue-text"], .clue__text')?.textContent?.trim() || '';
          const fmt = li.querySelector('.clue__length')?.textContent?.trim() || null;
          const ans = li.querySelector('.clue-answer__answer')?.textContent?.trim().toUpperCase() || null;
          return { section: sec.toLowerCase(), number: num, text: txt, format: fmt, answer: ans };
        });
        across = both.filter(x => x.section === 'across').map(({section, ...r}) => r);
        down   = both.filter(x => x.section === 'down').map(({section, ...r}) => r);
      }
    }
    return { across, down };
  }

  // ---------- format helpers (apply to CLUE answers only) ----------
  function parseFormat(fmt) {
    // returns {sizes:[...], seps:[...]} where seps length = sizes.length-1
    if (!fmt) return null;
    const inner = fmt.replace(/[()\s]/g, '');
    if (!/^\d+([,\-–]\d+)*$/.test(inner)) return null;
    const sizes = [];
    const seps = [];
    const re = /(\d+)|([,\-–])/g;
    let m, lastWasNum = false;
    while ((m = re.exec(inner))) {
      if (m[1]) { sizes.push(parseInt(m[1], 10)); lastWasNum = true; }
      else if (m[2] && lastWasNum) {
        seps.push(m[2] === ',' ? ' ' : '-'); // comma → space; hyphen/en-dash → '-'
        lastWasNum = false;
      }
    }
    if (!sizes.length) return null;
    while (seps.length < sizes.length - 1) seps.push(' ');
    return { sizes, seps };
  }

  function lettersOnly(s) { return (s || '').toUpperCase().replace(/[^A-Z]/g, ''); }

  function applyFormatToAnswer(raw, fmt) {
    // Insert separators per format; if not enough letters, return original raw
    const spec = parseFormat(fmt);
    if (!spec || !raw) return raw;
    const clean = lettersOnly(raw);
    const total = spec.sizes.reduce((a,b)=>a+b,0);
    if (clean.length < total) return raw; // don’t truncate
    let out = '', i = 0;
    for (let g = 0; g < spec.sizes.length; g++) {
      out += clean.slice(i, i + spec.sizes[g]);
      i += spec.sizes[g];
      if (g < spec.seps.length) out += spec.seps[g];
    }
    return out;
  }

  function formatClueAnswersInPlace(clues) {
    // Mutates clues.across/down: answer → formatted
    for (const list of [clues.across, clues.down]) {
      for (const c of list) {
        if (c.answer && c.format) {
          c.answer = applyFormatToAnswer(c.answer, c.format);
        }
      }
    }
  }

    // === BEGIN: Blog HTML export (add to Times Crossword Extractor-0.4.0.user.js) ===

    function escapeHtml(s) {
        return String(s ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function rowHtml(entry) {
        const num = escapeHtml(entry.number);
        const clue = escapeHtml(entry.text);
        const enm = escapeHtml(entry.format || "");
        const ans = escapeHtml(entry.answer || "");
        return `
    <tr>
      <td class="num">${num}</td>
      <td class="clue"><span style="color: #071ff7">${clue} ${enm}</span></td>
    </tr>
    <tr>
      <td></td>
      <td class="ans"><strong>${escapeHtml(ans)}</strong>&nbsp;-&nbsp;</td>
    </tr>`;
    }

    function tableHtml(title, entries) {
        return `
  <table class="clues">
    <thead>
      <tr>
        <th style="text-align:left;" colspan="2">${title}</th>
      </tr>
    </thead>
    <tbody>
      ${entries.map(e => rowHtml(e)).join("\n")}
    </tbody>
  </table>`;
    }

    function buildBlogHtml(meta, across, down) {
      // Normalise title
      let cleanTitle = meta.title || '';
      cleanTitle = cleanTitle.replace(/^Times\s+Quick/, 'Quick');  // strips a leading "Times " for the Quick

      const blogTitle = `<p>${cleanTitle} ${meta.number}${meta.setter ? ` by ${meta.setter}` : ''}</p>`;

      const solverTime = `<p>Time: ${meta.timer}&nbsp;<span style="color:#ff0000;"><== check this is correct</span></p>`;
      const introA = `<p>&nbsp;<span style="color:#ff0000;">Cut title above and paste into post title. Delete this paragraph and add your introduction here</span>&nbsp;</p>`;
      const introB = `<p>Definitions <u><span style="color:#071ff7;"><i><b>underlined in bold italics</b></i></span></u>, (<i><b>Abc</b></i>)* indicating anagram of Abc, <strike>deletions</strike> and [] other indicators.</p>`;

    return `<!-- BEGIN crossword blog skeleton -->
<section class="xwd-blog">
  <div class="intro">
    ${blogTitle}
    ${solverTime}
    ${introA}
    ${introB}
  </div>

  ${tableHtml("Across", across || [])}
  ${tableHtml("Down",   down   || [])}
</section>
<!-- END crossword blog skeleton -->`;
    }

    // === END: Blog HTML export ===

  // ---------- utils ----------
  function download(filename, text) {
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }

  // (NEW) Backfill missing clue answers from grid entries (by matching number)
  function backfillAnswers(clueList, entryList) {
    const byNumber = new Map(entryList.map(e => [String(e.number), e]));
      // Debug-print contents
      console.log(
        'byNumber:',
        Object.fromEntries(Array.from(byNumber.entries()).map(([k, v]) => [k, { number: v.number, answer: v.answer, row: v.row, col: v.col }]))
      );

    for (const c of clueList) {
      const key = String(c.number);
      if ((!c.answer || !lettersOnly(c.answer)) && byNumber.has(key)) {
        const e = byNumber.get(key);
        if (e && lettersOnly(e.answer)) {
          // Copy raw entry answer into clue answer, then format if clue has a format
          c.answer = e.answer;
          if (c.format) c.answer = applyFormatToAnswer(c.answer, c.format);
        }
      }
    }
  }


  // ---------- main ----------
  async function extract() {
    try {

      const meta = extractPuzzleMeta();
      console.log('Puzzle meta:', meta);
      // meta.timer, meta.title, meta.number, meta.setter

      const g = readGridWithNumbers();
      if (!g) {
        alert('Could not find the grid in this frame.');
        return;
      }
      const { grid, numbers } = g;

      const size = { rows: grid.length, cols: grid[0].length };
      const entries = extractEntries(grid, numbers);
      const clues = extractClues();

      // Filter 1-letter grid-derived entries only (keep clues as-is)
      const acrossEntries = entries.across.filter(e => lettersOnly(e.answer).length > 1);
      const downEntries   = entries.down.filter(e => lettersOnly(e.answer).length > 1);

      // For any empty answers in the clue list, copy from the grid if they are filled in
      backfillAnswers(clues.across, acrossEntries);
      backfillAnswers(clues.down,   downEntries);

      // (NEW) Only format the CLUE answers; leave grid-derived answers untouched
      formatClueAnswersInPlace(clues);

      const payload = buildBlogHtml(meta, clues.across, clues.down);

      if (typeof GM_setClipboard === 'function') GM_setClipboard(payload);
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(payload);

      // console.log('Times Crossword Extractor:', payload);
      alert(`Extracted ${size.rows}×${size.cols} grid, ${clues.across.length} across clues, ${clues.down.length} down clues.`);
    } catch (e) {
      console.error(e);
      alert('Extraction failed. See console for details.');
    }
  }

  (async function init() {
    const ok = await waitForGame();
    if (!ok) {
      console.warn('Times XWD Extractor: game not found in this frame.');
      return;
    }
    makeButton();
  })();
})();
