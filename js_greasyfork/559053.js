// ==UserScript==
// @name         Instant-Gaming - Auto recherche sur collage depuis la souris
// @name:en         Instant-Gaming - Automate mouse-based pasting searches on Instant-Gaming
// @namespace    https://tampermonkey.net/
// @version      1.1
// @match        https://www.instant-gaming.com/*
// @run-at       document-idle
// @grant        none
// @description        Script visant à rendre automatique la recherche via collage par la souris sur Instant-Gaming
// @description:en        Script to automate mouse-based pasting searches on Instant-Gaming
// @downloadURL https://update.greasyfork.org/scripts/559053/Instant-Gaming%20-%20Auto%20recherche%20sur%20collage%20depuis%20la%20souris.user.js
// @updateURL https://update.greasyfork.org/scripts/559053/Instant-Gaming%20-%20Auto%20recherche%20sur%20collage%20depuis%20la%20souris.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INPUT_ID = 'ig-header-search-box-input';

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
  }

  function fireSearchEvents(input) {
    // Le plugin peut écouter input, change, keyup… on envoie tout.
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const opts = { bubbles: true, cancelable: true, key: 'v', code: 'KeyV', keyCode: 86, which: 86 };
    input.dispatchEvent(new KeyboardEvent('keyup', opts));
  }

  function hookInput(input) {
    if (!input || input.dataset.tmPasteHook === '1') return;

    // Collage via menu contextuel -> paste survient, puis la value est mise à jour juste après.
    input.addEventListener('paste', () => {
      // on attend que la value soit effectivement mise à jour
      setTimeout(() => {
        // Ne déclenche que si la barre est "ouverte" (close visible)
        const closeBtn = document.querySelector('#ig-search > div.close-search');
        if (!isVisible(closeBtn)) return;

        if (input.value && input.value.trim()) {
          fireSearchEvents(input);
        }
      }, 0);
    }, true);

    // Optionnel mais utile : si le menu "Coller" ne déclenche pas paste (cas rares),
    // on détecte aussi un changement de value via input event et on renforce.
    input.addEventListener('input', () => {
      const closeBtn = document.querySelector('#ig-search > div.close-search');
      if (!isVisible(closeBtn)) return;

      // Renfort léger : certains listeners n’écoutent que keyup
      if (input.value && input.value.trim()) {
        const opts = { bubbles: true, cancelable: true, key: 'a', code: 'KeyA', keyCode: 65, which: 65 };
        input.dispatchEvent(new KeyboardEvent('keyup', opts));
      }
    }, true);

    input.dataset.tmPasteHook = '1';
  }

  function tick() {
    hookInput(document.getElementById(INPUT_ID));
  }

  tick();
  new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true });
})();
