// ==UserScript==
// @name  BT Search Buttons / Mouse Forward Integration for manko.fun / solji.kim
// @namespace http://tampermonkey.net/
// @version 2.0
// @description  Add inline FC2 search buttons (BTDig / BTSearch) and integrate mouse forward key behavior.
//               Includes customizable toggles for showing buttons and choosing which site opens via mouse forward.
// @author       VanillaMilk
// @license      MIT
// @match        https://manko.fun/*
// @match        https://solji.kim/*
// @run-at document-end
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/554355/BT%20Search%20Buttons%20%20Mouse%20Forward%20Integration%20for%20mankofun%20%20soljikim.user.js
// @updateURL https://update.greasyfork.org/scripts/554355/BT%20Search%20Buttons%20%20Mouse%20Forward%20Integration%20for%20mankofun%20%20soljikim.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const showBTDigMain = await GM_getValue('showBTDigMain', true);
  const showBTDig = await GM_getValue('showBTDig', true);
  const showBTSearch = await GM_getValue('showBTSearch', true);

  const enableMouseBTDigMain = await GM_getValue('enableMouseBTDigMain', false);
  const enableMouseBTDig = await GM_getValue('enableMouseBTDig', true);
  const enableMouseBTSearch = await GM_getValue('enableMouseBTSearch', false);

  // --- Menu toggles ---

  GM_registerMenuCommand(
    (showBTDigMain ? '☑ ' : '☐ ') + 'Show BTDig MAIN (btdig.com)',
    async () => { await GM_setValue('showBTDigMain', !showBTDigMain); location.reload(); }
  );

  GM_registerMenuCommand(
    (showBTDig ? '☑ ' : '☐ ') + 'Show BTDig(en) (en.btdig.com)',
    async () => { await GM_setValue('showBTDig', !showBTDig); location.reload(); }
  );

  GM_registerMenuCommand(
    (showBTSearch ? '☑ ' : '☐ ') + 'Show BTSearch (btsearch.love)',
    async () => { await GM_setValue('showBTSearch', !showBTSearch); location.reload(); }
  );

  GM_registerMenuCommand(
    (enableMouseBTDigMain ? '☑ ' : '☐ ') + 'Mouse forward → BTDig(Main)',
    async () => {
      const newVal = !enableMouseBTDigMain;
      await GM_setValue('enableMouseBTDigMain', newVal);
      if (newVal) {
        await GM_setValue('enableMouseBTDig', false);
        await GM_setValue('enableMouseBTSearch', false);
      }
      location.reload();
    }
  );

  GM_registerMenuCommand(
    (enableMouseBTDig ? '☑ ' : '☐ ') + 'Mouse forward → BTDig(en)',
    async () => {
      const newVal = !enableMouseBTDig;
      await GM_setValue('enableMouseBTDig', newVal);
      if (newVal) {
        await GM_setValue('enableMouseBTDigMain', false);
        await GM_setValue('enableMouseBTSearch', false);
      }
      location.reload();
    }
  );

  GM_registerMenuCommand(
    (enableMouseBTSearch ? '☑ ' : '☐ ') + 'Mouse forward → BTSearch',
    async () => {
      const newVal = !enableMouseBTSearch;
      await GM_setValue('enableMouseBTSearch', newVal);
      if (newVal) {
        await GM_setValue('enableMouseBTDigMain', false);
        await GM_setValue('enableMouseBTDig', false);
      }
      location.reload();
    }
  );

  let searchKey = null; // ★ replaces latestNum

  // --- Enhanced scanner (Now supports non-FC2 titles) ---
  function scan() {
    const el = document.querySelector('div.text-\\[\\#ffc94d\\].underline.cursor-pointer');
    if (!el) return false;

    const text = el.textContent.trim();

    // FC2? If yes → extract number only
    const fc2Match = text.match(/FC2[- ]?PPV[- ]?(\d{5,})/i);

    if (fc2Match) {
      searchKey = fc2Match[1];
    } else {
      // Not FC2 → use full title (e.g., START-456)
      searchKey = text;
    }

    insertButtons(el, searchKey);
    return true;
  }

  // --- Insert search buttons ---
  function insertButtons(target, key) {
    if (target.__fc2_buttons__) return;
    target.__fc2_buttons__ = true;

    const box = document.createElement('span');
    box.style.display = 'inline-flex';
    box.style.alignItems = 'center';
    box.style.gap = '6px';
    box.style.marginLeft = '10px';

    const sites = [];

    if (showBTDigMain)
      sites.push({ name: 'BTDig (Main)', url: `https://btdig.com/search?q=${encodeURIComponent(key)}` });

    if (showBTDig)
      sites.push({ name: 'BTDig (En)', url: `https://en.btdig.com/search?q=${encodeURIComponent(key)}` });

    if (showBTSearch)
      sites.push({ name: 'BTSearch', url: `https://www.btsearch.love/search?keyword=${encodeURIComponent(key)}` });

    for (const s of sites) {
      const a = document.createElement('a');
      a.textContent = s.name;
      a.href = s.url;
      a.target = '_blank';

      a.style.padding = '3px 8px';
      a.style.border = '1px solid #ffc94d';
      a.style.borderRadius = '6px';
      a.style.background = '#353535';
      a.style.color = '#ffc94d';
      a.style.textDecoration = 'none';
      a.style.fontSize = '12px';

      a.addEventListener('mouseenter', () => {
        a.style.background = '#ffc94d';
        a.style.color = '#000';
      });
      a.addEventListener('mouseleave', () => {
        a.style.background = '#353535';
        a.style.color = '#ffc94d';
      });

      box.appendChild(a);
    }

    target.insertAdjacentElement('afterend', box);
  }

  // --- Mouse forward behavior ---
  window.addEventListener('mouseup', (e) => {
    if (e.button !== 4 || !searchKey) return;

    const encoded = encodeURIComponent(searchKey);

    if (enableMouseBTDigMain) {
      window.open(`https://btdig.com/search?q=${encoded}`, '_blank');
    } else if (enableMouseBTSearch) {
      window.open(`https://www.btsearch.love/search?keyword=${encoded}`, '_blank');
    } else if (enableMouseBTDig) {
      window.open(`https://en.btdig.com/search?q=${encoded}`, '_blank');
    }
  }, true);

  scan();
  const iv = setInterval(() => { if (scan()) clearInterval(iv); }, 1000);
  setTimeout(() => clearInterval(iv), 20000);

})();
