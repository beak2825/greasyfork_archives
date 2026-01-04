// ==UserScript==
// @name         ChatGPT Auto Cleaner — v2.6 (navigation synced with KEEP_LAST)
// @namespace    https://presinfo.com/
// @version      2.6
// @author       Vladyslav Shyshlov
// @description  Навигация и элементы управления остаются только у последних сообщений (связано с KEEP_LAST)
// @match        https://chatgpt.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553046/ChatGPT%20Auto%20Cleaner%20%E2%80%94%20v26%20%28navigation%20synced%20with%20KEEP_LAST%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553046/ChatGPT%20Auto%20Cleaner%20%E2%80%94%20v26%20%28navigation%20synced%20with%20KEEP_LAST%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEEP_LAST      = 30;       // сколько сообщений хранить                         how many messages to keep
  const BUFFER_TURNS   = 2;        // небольшой запас, чтобы не удалить поток           small buffer to avoid deleting an active stream
  const INTERVAL       = 90000;    // каждые 20 секунд это 20000 сейчас 90000 это 1.30 минуты       Every 20 seconds — right now it’s 90000, which is 1.30 minutes
  const FIRST_DELAY    = 3000;     // первая мягкая очистка                             first soft cleanup
  const IDLE_MS        = 5000;     // тайм-аут покоя                                    idle timeout

  let lastActivity = performance.now();

  const poke = () => { lastActivity = performance.now(); };
  window.addEventListener('keydown', poke, true);
  window.addEventListener('pointerdown', poke, true);
  window.addEventListener('input', poke, true);

  const moStream = new MutationObserver(poke);
  moStream.observe(document.documentElement, {subtree: true, childList: true, attributes: true});

  const safeForEach = (nodes, fn) =>
    Array.from(nodes).forEach(el => { try { if (el && el.isConnected) fn(el); } catch {} });

  const isCalm = () => {
    const now = performance.now();
    if (now - lastActivity < IDLE_MS) return false;
    if (document.querySelector('form textarea:focus')) return false;
    if (document.querySelector('.result-streaming,[data-writing-block]')) return false;
    return true;
  };

  function removeOldMessages() {
    const main = document.querySelector('main');
    if (!main) return 0;

    const messages = main.querySelectorAll(
      'article[data-testid^="conversation-turn"], article[data-turn], div[data-message-author-role]'
    );
    const limit = KEEP_LAST + BUFFER_TURNS;
    if (messages.length <= limit) return 0;

    // старые сообщения
    const toRemove = Array.from(messages).slice(0, messages.length - limit);

    safeForEach(toRemove, el => {
      // перед удалением — удаляем навигацию, связанную с этим блоком
      const nav = el.querySelectorAll(
        'div.z-0.flex.min-h-\\[46px\\].justify-start,' +
        'div[aria-label*="actions"],' +
        'div[data-testid*="turn-actions"],' +
        'div[class*="pointer-events-none"][class*="opacity-0"][class*="group-hover/turn-messages"]'
      );
      safeForEach(nav, n => n.remove());

      // теперь сам элемент
      el.remove();
    });

    return toRemove.length;
  }

  function removeEmptyBlocks() {
    // белые квадраты
    safeForEach(document.querySelectorAll('article[data-turn]'), a => {
      const hasText  = a.textContent?.trim().length > 0;
      const hasMedia = a.querySelector('img, picture, video');
      const hasInput = a.querySelector('textarea, input, [contenteditable="true"]');
      if (!hasText && !hasMedia && !hasInput) a.remove();
    });

    // пустые контейнеры
    safeForEach(document.querySelectorAll('.flex.max-w-full.flex-col.grow, .text-base.my-auto.mx-auto'), div => {
      const hasText  = div.textContent?.trim().length > 0;
      const hasMedia = div.querySelector('img, video, picture');
      if (!hasText && !hasMedia) div.remove();
    });

    // зависшие навигации, если остались вне article
    const allNavs = document.querySelectorAll(
      '#thread div.z-0.flex.min-h-\\[46px\\].justify-start,' +
      'div[aria-label*="actions"],' +
      'div[data-testid*="turn-actions"],' +
      'div[class*="pointer-events-none"][class*="opacity-0"][class*="group-hover/turn-messages"]'
    );

    // сохраняем только последние KEEP_LAST (синхронно с сообщениями)
    if (allNavs.length > KEEP_LAST) {
      const toRemove = Array.from(allNavs).slice(0, allNavs.length - KEEP_LAST);
      safeForEach(toRemove, n => n.remove());
    }
  }

  const schedule = (fn) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setTimeout(fn, 0), { timeout: 1200 });
    } else {
      setTimeout(fn, 0);
    }
  };

  function clean() {
    if (!isCalm()) return;
    schedule(() => {
      const removed = removeOldMessages();
      removeEmptyBlocks();
      if (removed > 0)
        console.log(`🧹 Удалено ${removed} сообщений и связанных панелей, оставлено ${KEEP_LAST}`);
    });
  }

  console.log(`✅ ChatGPT Auto Cleaner v2.6 запущен (навигация синхронизирована с KEEP_LAST = ${KEEP_LAST})`);
  setTimeout(clean, FIRST_DELAY);
  setInterval(clean, INTERVAL);
})();