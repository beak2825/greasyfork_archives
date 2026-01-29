// ==UserScript==
// @name         Yandex Global - Removes Ads & Iframes Everywhere
// @name:ru      Яндекс - Удаление рекламы и баннеров
// @name:en      Yandex - Remove Ads & Iframes Everywhere
// @namespace    https://github.com/abyss-soft/Yandex-Remove-Ads-and-Banners-Everywhere
// @version      1.5.0
// @description  Удаляет рекламные баннеры, блоки и iframe на всех страницах Яндекса
// @description:en Removes advertising banners, blocks and iframes on Yandex (SPA-friendly)
// @author       github.com/abyss-soft
// @match        https://yandex.ru/*
// @match        https://yandex.com/*
// @match        http://yandex.com/*
// @match        http://yandex.ru/*
// @match        https://ya.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564349/Yandex%20Global%20-%20Removes%20Ads%20%20Iframes%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/564349/Yandex%20Global%20-%20Removes%20Ads%20%20Iframes%20Everywhere.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'yandex-ads-remover-style';

  const css = `
  /* Баннеры в картинках */
  [aria-label="Рекламный баннер"],
  [data-name="adWrapper"],
  [id^="ImagesViewer"] {
    display: none !important;
  }

  /* Реклама в поиске */
  .serp-item:has([aria-label="Реклама"]),
  .serp-item[data-fast-name="direct"],
  .organic[data-fast-name="direct"] {
    display: none !important;
  }

  /* Правая колонка */
  .main__right .composite,
  .main__right .Card {
    display: none !important;
  }

  /* Общие баннеры */
  [class*="banner"],
  [class*="Banner"],
  [id*="banner"] {
    display: none !important;
  }

  /* iframe реклама */
  iframe[src*="yandex.ru/ads"],
  iframe[src*="an.yandex.ru"],
  iframe[src*="doubleclick.net"],
  iframe[src*="googlesyndication.com"] {
    display: none !important;
  }

  /* Блоки с aria-label="Реклама" */
  [aria-label="Реклама"] {
    display: none !important;
  }
`;


  function injectStyleOnce() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }


  let scheduled = false;
  let lastUrl = location.href;

  function cleanDynamicBlocks() {
    scheduled = false;

    // спец-логика только для yandex.com
    if (location.hostname === 'yandex.com' && location.pathname === '/') {
      document
        .querySelectorAll('[id$="__content"], [class$="__content"]')
        .forEach(el => {
          if (!el.dataset.hiddenByScript) {
            el.style.display = 'none';
            el.dataset.hiddenByScript = 'true';
          }
        });
    }
  }

  function scheduleCleanup() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(cleanDynamicBlocks);
  }

  injectStyleOnce();
  cleanDynamicBlocks();


  const observer = new MutationObserver(() => {
    // реагируем только на смену страницы в SPA
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      scheduleCleanup();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
