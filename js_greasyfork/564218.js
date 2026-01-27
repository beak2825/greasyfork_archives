// ==UserScript==
// @name         HH: Скрыть + автодобавить в чёрный список и удалить из страницы
// @namespace    tm-hh-magritte-remove
// @version      1.3
// @description  Нажимает "Скрыть", затем автоматически жмёт "добавить вакансию в ЧС", после чего удаляет карточку из DOM
// @license      MIT
// @match        https://hh.ru/*
// @match        https://*.hh.ru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564218/HH%3A%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%2B%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%B2%20%D1%87%D1%91%D1%80%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%B8%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%B8%D0%B7%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564218/HH%3A%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%2B%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%B2%20%D1%87%D1%91%D1%80%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%B8%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%B8%D0%B7%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const HIDE_ARIA = 'Скрыть';
  const CARD_CLASS = 'magritte-redesign';

  const BLACKLIST_BTN_SELECTOR = 'button[data-qa="vacancy__blacklist-menu-add-vacancy"]';

  function isHideButton(el) {
    return !!(el && el.nodeType === 1 && el.matches(`button[aria-label="${CSS.escape(HIDE_ARIA)}"]`));
  }

  function removeClosestCard(fromEl) {
    const card = fromEl.closest(`.${CARD_CLASS}`);
    if (!card) return false;
    card.remove();
    return true;
  }

  function waitForElement(selector, { root = document, timeoutMs = 3000 } = {}) {
    return new Promise((resolve) => {
      const found = root.querySelector(selector);
      if (found) return resolve(found);

      const obs = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });

      obs.observe(root.documentElement || root, { childList: true, subtree: true });

      if (timeoutMs > 0) {
        setTimeout(() => {
          obs.disconnect();
          resolve(null);
        }, timeoutMs);
      }
    });
  }

  document.addEventListener('click', async (e) => {
    const btn = e.target?.closest?.('button');
    if (!btn || !isHideButton(btn)) return;

    // Даём сайту обработать клик "Скрыть" (чтобы появилось меню/кнопка ЧС)
    // Поэтому НЕ блокируем событие.
    // e.preventDefault();
    // e.stopPropagation();

    // Ждём появления кнопки "добавить в ЧС" и кликаем по ней
    const blacklistBtn = await waitForElement(BLACKLIST_BTN_SELECTOR, { timeoutMs: 3000 });
    if (blacklistBtn) {
      blacklistBtn.click();
    }

    // После клика по ЧС удаляем карточку/контейнер
    // Небольшая задержка на всякий случай, чтобы клик точно ушёл
    setTimeout(() => {
      removeClosestCard(btn);
    }, 50);
  }, true);
})();
