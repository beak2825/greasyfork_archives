// ==UserScript==
// @name         Hide MAL-Sync Chapter Popups
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hides MAL-Sync popups that contain "Chapter: X/X" so they don't appear after finishing a chapter.
// @author       YourName
// @match        (Insert your urls here)
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550618/Hide%20MAL-Sync%20Chapter%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/550618/Hide%20MAL-Sync%20Chapter%20Popups.meta.js
// ==/UserScript==

(function () {
  const CHAPTER_PATTERN = /Chapter\s*[:：]\s*\d+(?:\s*[\/／]\s*(?:\d+|[\?？]))?/i;

  const FLASH_SEL = '.flash.type-update.flashinfo';
  const SENTINEL = 'data-hidden-by-hide-malsync'; // avoid double work

  const normalize = (s) =>
    (s || '')
      .replace(/\u00A0/g, ' ') // nbsp -> space
      .replace(/\s+/g, ' ') // collapse whitespace
      .trim();

  function shouldHide(el) {
    const txt = normalize(el.textContent);
    return CHAPTER_PATTERN.test(txt);
  }

  function removeBox(node) {
    const box = node.matches?.(FLASH_SEL) ? node : node.closest?.(FLASH_SEL);
    if (!box || box.getAttribute(SENTINEL) === '1') return;
    box.setAttribute(SENTINEL, '1');
    box.remove();
  }

  function sweep(root = document) {
    root.querySelectorAll(FLASH_SEL).forEach((el) => {
      if (shouldHide(el)) removeBox(el);
    });
  }

  function observe(root) {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType !== 1) return;
            if (n.matches?.(FLASH_SEL)) {
              if (shouldHide(n)) removeBox(n);
            } else {
              n.querySelectorAll?.(FLASH_SEL).forEach((el) => {
                if (shouldHide(el)) removeBox(el);
              });
            }
          });
        } else if (m.type === 'characterData') {
          const el = m.target.parentElement?.closest?.(FLASH_SEL);
          if (el && shouldHide(el)) removeBox(el);
        } else if (m.type === 'attributes') {
          const t = m.target;
          if (t instanceof Element && t.matches(FLASH_SEL) && shouldHide(t)) removeBox(t);
        }
      }
    });

    mo.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  }

  function watchIframe(iframe) {
    const hook = () => {
      try {
        const d = iframe.contentDocument;
        if (!d) return;
        sweep(d);
        observe(d);
      } catch {}
    };
    iframe.addEventListener('load', hook);
    hook();
  }

  function start() {
    sweep(document);
    observe(document);
    document.querySelectorAll('iframe').forEach(watchIframe);
    setInterval(() => sweep(document), 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();