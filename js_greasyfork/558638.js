// ==UserScript==
// @name         Auto Reply Komubot
// @namespace    http://tampermonkey.net/
// @version      2025-12-12.1
// @description  Auto click on button
// @author       Thaibm
// @match        https://mezon.ai/chat/direct/message/1836948396888297472/3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mezon.ai
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558638/Auto%20Reply%20Komubot.user.js
// @updateURL https://update.greasyfork.org/scripts/558638/Auto%20Reply%20Komubot.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("[TM] Flexible auto-click script started");

  let lastClickedId = null;

  function checkLastMessage() {
    console.log("[TM] Check last message auto-click script started");
    const items = document.querySelectorAll(".message-list-item");
    if (!items.length) return;

    // Lấy message cuối cùng
    const last = items[items.length - 1];
    const msgId = last.id;

    // Nếu đã click message này rồi -> bỏ qua
    if (msgId === lastClickedId) return;

    // Tìm tất cả button đúng format
    const buttons = last.querySelectorAll(
      "button.px-5.py-1.rounded.bg-buttonPrimary.text-white.font-medium"
    );

    // Nếu không có button -> bỏ qua
    if (buttons.length === 0) return;

    // Chọn random 1 button
    const btn = buttons[Math.floor(Math.random() * buttons.length)];

    console.log(
      `[TM] Clicking button "${btn.textContent.trim()}" in message ${msgId}`
    );

    btn.click();
    lastClickedId = msgId; // đánh dấu đã click
  }

  // Chạy lần đầu sau khi DOM load
  setTimeout(checkLastMessage, 1500);

  let debounceTimer = null;

  function initObserver() {
    const wrap = document.querySelector(".messages-wrap");
    if (!wrap) {
      // Retry sau khi DOM load đủ
      setTimeout(initObserver, 300);
      return;
    }

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        checkLastMessage();
      }, 150);
    });

    observer.observe(wrap, {
      childList: true,
      subtree: true,
    });

    console.log("[TM] Optimized observer initialized");
  }

  initObserver();
})();