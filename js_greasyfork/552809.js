// ==UserScript==
// @name         Strava - Hide Challenge & Club Join Promotions (static, low-overhead)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ukrywa wpisy: “joined a challenge/club” oraz z przyciskami “Join Challenge/Join Club”, bez observera/interwału (niski narzut pamięci/CPU)
// @author       JOUKI
// @match        https://www.strava.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552809/Strava%20-%20Hide%20Challenge%20%20Club%20Join%20Promotions%20%28static%2C%20low-overhead%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552809/Strava%20-%20Hide%20Challenge%20%20Club%20Join%20Promotions%20%28static%2C%20low-overhead%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Główna funkcja filtra
  function hidePromotions() {
    const feedEntries = document.querySelectorAll('[id^="feed-entry-"]');

    feedEntries.forEach(entry => {
      const headerEl = entry.querySelector('[data-testid="group-header"]');
      const header = headerEl?.textContent?.toLowerCase() || '';

      const hideByHeader =
        header.includes('joined a challenge') ||
        header.includes('joined a club');

      const btns = entry.querySelectorAll('button');
      const hideByButton = [...btns].some(b => {
        const t = (b.textContent || '').toLowerCase();
        return t.includes('join challenge') || t.includes('join club');
      });

      if (hideByHeader || hideByButton) {
        entry.style.display = 'none';
      }
    });
  }

  // Jednorazowe uruchomienie po starcie
  function initOnce() {
    hidePromotions();
  }

  // Delikatny “retry” po akcji użytkownika (bez stałego śledzenia)
  // 1) Po przewinięciu – wiele feedów dorysowuje zawartość przy scrollu
  function onScrollOnce() {
    // kilka krótkich prób po scrollu, aby złapać content dorysowany przez SPA
    [0, 80, 250].forEach(ms => setTimeout(hidePromotions, ms));
  }

  // 2) Po kliknięciu w przyciski “Load more/See more” (jeśli występują)
  function hookLoadMoreButtons() {
    // selektory są defensywne – jeśli Strava zmieni copy, nic się nie stanie
    const candidates = document.querySelectorAll('button, a[role="button"]');
    candidates.forEach(btn => {
      const t = (btn.textContent || '').toLowerCase();
      if (/(load more|see more|show more|zobacz więcej|wczytaj więcej)/.test(t)) {
        if (!btn.dataset.kmHooked) {
          btn.addEventListener('click', () => {
            [0, 120, 400].forEach(ms => setTimeout(hidePromotions, ms));
          }, { passive: true });
          btn.dataset.kmHooked = '1';
        }
      }
    });
  }

  // Setup
  function setup() {
    initOnce();
    // Podczep lekkie triggery – bez observera i bez interwału
    window.addEventListener('scroll', onScrollOnce, { passive: true });
    // jednorazowo sprawdź i podczep “load more”
    hookLoadMoreButtons();
    // proste retry, gdyby feed doładował się chwilę po starcie
    setTimeout(() => { hidePromotions(); hookLoadMoreButtons(); }, 200);
    setTimeout(() => { hidePromotions(); hookLoadMoreButtons(); }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();