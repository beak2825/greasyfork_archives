// ==UserScript==
// @name         Yandex Mail - Remove Ads & Iframes
// @name:ru      Яндекс Почта - Удаление рекламы
// @name:en      Yandex Mail - Remove Ads & Iframes
// @namespace    https://github.com/abyss-soft/yandex-Mail-Remove-Ads-and-Banners
// @version      0.8
// @description  Удаляет рекламу и баннеры с Yandex Mail (поддерживает SPA, легковесный)
// @description:en Removes ads, banners and iframe ads from Yandex Mail (SPA-friendly, lightweight) 
// @author       github.com/abyss-soft
// @match        https://mail.yandex.ru/*
// @match        http://mail.yandex.ru/*
// @match        https://mail.yandex.com/*
// @match        http://mail.yandex.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564351/Yandex%20Mail%20-%20Remove%20Ads%20%20Iframes.user.js
// @updateURL https://update.greasyfork.org/scripts/564351/Yandex%20Mail%20-%20Remove%20Ads%20%20Iframes.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    /* Верхние баннеры */
    div:has(> [data-testid="toolbar-layout_container"])
    > :not([data-testid="toolbar-layout_container"]) {
      display: none !important;
    }

    /* Правая колонка */
    div[data-testid^="page-layout_right-column_container_"] {
      display: none !important;
    }

    /* Роскомнадзор */
    .Warning_type_roskomnadzor,
    .Modal {
      display: none !important;
    }

    /* iframe реклама */
    iframe[src*="an.yandex.ru"],
    iframe[src*="doubleclick"],
    iframe[src*="ads"],
    iframe[src*="banner"] {
      display: none !important;
    }
  `);


  let scheduled = false;

  function removeDynamicAds() {
    scheduled = false;


    const btn = [...document.querySelectorAll('a')]
      .find(a => a.textContent.trim() === 'Отключить рекламу');

    if (btn) {
      const block = btn.closest('div')?.parentElement?.nextElementSibling;
      if (block && !block.dataset.hiddenByScript) {
        block.style.display = 'none';
        block.dataset.hiddenByScript = 'true';
      }
    }
  }

  // debounce
  function scheduleCleanup() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(removeDynamicAds);
    }
  }

  // Убираем сразу
  removeDynamicAds();

  // наблюдение за SPA
  const observer = new MutationObserver(scheduleCleanup);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
