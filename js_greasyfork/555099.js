// ==UserScript==
// @name         LearnCpp Comment Antispam
// @namespace    https://github.com/rawafh
// @version      1.2
// @author       rawafh
// @license      MIT
// @description  Hide obvious wpDiscuz spam without breaking page behaviour
// @match        https://www.learncpp.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555099/LearnCpp%20Comment%20Antispam.user.js
// @updateURL https://update.greasyfork.org/scripts/555099/LearnCpp%20Comment%20Antispam.meta.js
// ==/UserScript==

(() => {
  const MAX_BR = 80;           // was too low; wpDiscuz uses many <br> for layout
  const MAX_SHORT_LINES = 80;  // raise threshold so normal long comments stay
  const MAX_LENGTH = 8000;     // only nuke absurd walls
  const BAD_WORDS = [
    /nigg/i, /retard/i, /antisemit/i, /hamas/i, /zion/i, /kill all/i, /israel/i, /zion/i
  ];

  function isSpam(text, html) {
    if (!text) return false;

    // ignore normal spacing wpDiscuz uses
    const brCount = (html.match(/<br/gi) || []).length;
    if (brCount > MAX_BR) return true;

    const shortLines = text.split(/\r?\n/).filter(l => l.trim().length <= 2).length;
    if (shortLines > MAX_SHORT_LINES) return true;

    if (text.length > MAX_LENGTH) return true;
    if (BAD_WORDS.some(rx => rx.test(text))) return true;

    return false;
  }

  function cleanComment(el) {
    const body = el.querySelector('.wpd-comment-text');
    if (!body) return;

    const txt = body.innerText;
    const html = body.innerHTML;

    if (isSpam(txt, html)) {
      body.textContent = '[Spam comment hidden]';
      body.style.color = '#888';
    }
  }

  function scan() {
    document.querySelectorAll('.wpd-comment').forEach(cleanComment);
  }

  // run once after DOM settles
  window.addEventListener('load', () => {
    setTimeout(scan, 1500);
  });

  // observe only comment container to avoid global interference
  const target = document.querySelector('.wpd-thread') || document.body;
  const obs = new MutationObserver(() => scan());
  obs.observe(target, { childList: true, subtree: true });
})();
