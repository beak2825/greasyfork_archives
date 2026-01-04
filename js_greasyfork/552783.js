// ==UserScript==
// @name         Töff-Forum Chat – ShoutboxHeight gezielt setzen
// @namespace    https://www.toeff-forum.ch/
// @version      1.2
// @description  Setzt --shoutboxHeight auf 75vh direkt am Shoutbox-Element
// @match        https://www.toeff-forum.ch/wcf/chat/*
// @run-at       document-start
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552783/T%C3%B6ff-Forum%20Chat%20%E2%80%93%20ShoutboxHeight%20gezielt%20setzen.user.js
// @updateURL https://update.greasyfork.org/scripts/552783/T%C3%B6ff-Forum%20Chat%20%E2%80%93%20ShoutboxHeight%20gezielt%20setzen.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1) Stylesheet-Regel mit hoher Spezifität (inkl. !important)
  const css = `
    /* exakt das Element */
    html body#tpl_wcf_cms div#pageContainer.pageContainer section#main.main div.layoutBoundary div#content.content div.boxesContentTop div.boxContainer div.box.scroller.chatbox div.boxContent div#shoutbox_1.shoutbox.modernDesign.asc {
      --shoutboxHeight: 75vh !important;
    }
    /* Fallback: alle Shoutboxen */
    .shoutbox.modernDesign.asc, .shoutbox {
      --shoutboxHeight: 75vh !important;
    }
  `;
  try {
    if (typeof GM_addStyle === 'function') GM_addStyle(css);
    else {
      const style = document.createElement('style');
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }
  } catch (e) {
    console.warn('[TM] Style inject failed:', e);
  }

  // 2) Inline-Setzen auf dem Zielknoten (gewinnt i. d. R. gegen alles)
  function setInline(el) {
    if (!el) return false;
    el.style.setProperty('--shoutboxHeight', '75vh', 'important');
    console.log('[TM] --shoutboxHeight per inline gesetzt auf', el);
    return true;
  }

  // 3) Warten bis das Element existiert (SPA/Delayed render)
  const SELECTOR_EXACT = 'html body#tpl_wcf_cms div#pageContainer.pageContainer section#main.main div.layoutBoundary div#content.content div.boxesContentTop div.boxContainer div.box.scroller.chatbox div.boxContent div#shoutbox_1.shoutbox.modernDesign.asc';
  const SELECTOR_FALLBACK = '#shoutbox_1.shoutbox.modernDesign.asc, .shoutbox.modernDesign.asc, .shoutbox';

  function trySet() {
    let el = document.querySelector(SELECTOR_EXACT) || document.querySelector(SELECTOR_FALLBACK);
    if (el) {
      setInline(el);
      // zur Sicherheit auch auf dem Container (falls Variable dort gelesen wird)
      const container = el.closest('.chatbox') || el.parentElement;
      if (container) container.style.setProperty('--shoutboxHeight', '75vh', 'important');
      return true;
    }
    return false;
  }

  // Sofort versuchen; wenn nicht da, weiter beobachten
  if (!trySet()) {
    const obs = new MutationObserver(() => {
      if (trySet()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  // 4) Diagnose-Log (in DevTools -> Konsole)
  const check = () => {
    const el = document.querySelector(SELECTOR_EXACT) || document.querySelector(SELECTOR_FALLBACK);
    if (!el) return console.log('[TM] Shoutbox noch nicht gefunden.');
    const val = getComputedStyle(el).getPropertyValue('--shoutboxHeight').trim();
    console.log('[TM] --shoutboxHeight an Shoutbox ist:', val || '(leer)');
  };
  setTimeout(check, 0);
  setTimeout(check, 600);
  setTimeout(check, 2000);
})();
