// ==UserScript==
// @name        Telegram Message Hide (fixed)
// @version     0.5.1
// @description Filters messages by blacklisted users in groups. [!] script relies on usernames (which can be changed). All images sent by the blacklisted are blank
// @license     MIT
// @namespace   Telegram-Message-Hide
// @include     https://web.telegram.org/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548959/Telegram%20Message%20Hide%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548959/Telegram%20Message%20Hide%20%28fixed%29.meta.js
// ==/UserScript==

(function main() {
  'use strict';

  const defaultList = ["user1293847293847129083471029384", "user02938421057293084572930584"];
  let userNames = GM_getValue("user-names", defaultList);

  if (typeof userNames === 'string') {
    try { userNames = JSON.parse(userNames); } catch {
      userNames = userNames.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (!Array.isArray(userNames)) userNames = [String(userNames).trim()];

  let delay = parseInt(GM_getValue("update-interval", 3000), 10) || 3000;
  let eventTimeout = null;

  console.log("[TMH] Initialized with filters:", userNames, "interval:", delay);

  GM_addStyle(`
    .tmh-placeholder {
      padding: 6px 12px;
      margin: 2px 0;
      border-radius: 8px;
      background: #eee;
      color: #555;
      font-style: italic;
      cursor: pointer;
      opacity: 0.8;
    }
    .tmh-placeholder:hover {
      opacity: 1;
      background: #ddd;
    }
  `);

  function shouldHide(wrapper) {
    if (!wrapper) return false;
    const group = wrapper.closest('.sender-group-container');

    // Sender candidates
    const senderEl = wrapper.querySelector('.sender-title, .message-title-name')
                   || group?.querySelector('.sender-title, .message-title-name')
                   || group?.querySelector('.Avatar');
    const sender = senderEl
      ? (senderEl.getAttribute('aria-label') || senderEl.textContent || '').trim()
      : '';

    // Message text
    const bodyEl = wrapper.querySelector('.text-content, .message-text');
    let body = bodyEl ? (bodyEl.textContent || '').trim() : '';
    if (!body) {
      const img = wrapper.querySelector('img[alt]');
      if (img) body = img.alt;
    }

    const hay = (sender + ' ' + body).toLowerCase();
    const match = userNames.find(entry => {
      const s = entry.toLowerCase().trim();
      const sNoAt = s.replace(/^@/, '');
      return (s && hay.includes(s)) || (sNoAt && hay.includes(sNoAt));
    });

    if (match) {
      console.log(`[TMH] Filter match "${match}" in sender="${sender}" body="${body}"`);
      return { match, sender };
    }
    return null;
  }

function replaceWithPlaceholder(target, sender) {
        if (!target || (target.dataset.tmhHidden && target.querySelectorAll("img").length === target.dataset.imgCount)) return;
  target.dataset.tmhHidden = '1';
target.dataset.imgCount = target.querySelectorAll("img").length;
    for (const msg of target.querySelectorAll('.text-content, .message-text')){
        msg.textContent = `Removed message from ${sender || "unknown"}`;
    }
  target.style.opacity = '0.3';
  target.style.fontStyle = 'italic';
        for (const img of target.querySelectorAll("img")){
            console.log(img);
    img.style.visibility = "hidden";
    }
}


  function applyStyles(wrappers) {
    Array.from(wrappers).forEach(wrapper => {
      const result = shouldHide(wrapper);
      if (result) {
        const group = wrapper.closest('.sender-group-container');
        if (group) {
          console.log(`[TMH] Replacing group for "${result.sender}" with placeholder`);
          replaceWithPlaceholder(group, result.sender);
        } else {
          console.log(`[TMH] Replacing single message with placeholder`);
          replaceWithPlaceholder(wrapper, result.sender);
        }
      }
    });
  }

  function scanMessages() {
    console.log("[TMH] Scanning for messages...");
    const nodes = document.querySelectorAll(
      '.Message.message-list-item, .message-list-item, [data-message-id], .sender-group-container'
    );
    console.log("[TMH] Found", nodes.length, "nodes");
    if (!nodes || nodes.length === 0) return;
    applyStyles(nodes);
  }

  function eventThrottler(timeout) {
    if (eventTimeout) return;
    eventTimeout = setTimeout(() => {
      eventTimeout = null;
      console.log("[TMH] Throttled scan triggered");
      scanMessages();
    }, timeout);
  }

  GM_registerMenuCommand("Filter list", () => {
    let current = GM_getValue("user-names", userNames);
    if (Array.isArray(current)) current = current.join(', ');
    let val = prompt("Enter usernames to filter, separated by comma:", current);
    if (val !== null && typeof val === "string") {
      const arr = val.split(",").map(v => v.trim()).filter(Boolean);
      userNames = arr;
      GM_setValue("user-names", arr);
      console.log("[TMH] Updated filter list:", userNames);
      scanMessages();
    }
  });

  GM_registerMenuCommand("Update interval", () => {
    const updateInterval = GM_getValue("update-interval", delay);
    const val = prompt("Enter message scanning frequency (in ms):", String(updateInterval));
    if (val !== null && typeof val === "string") {
      const n = parseInt(val, 10);
      if (!Number.isNaN(n) && n > 0) {
        delay = n;
        GM_setValue("update-interval", n);
        console.log("[TMH] Updated interval:", delay);
      }
    }
  });

  function init() {
    console.log("[TMH] Starting script...");
    scanMessages();
    const observer = new MutationObserver(() => {
      console.log("[TMH] DOM mutation detected");
      eventThrottler(delay);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("message", () => {
      console.log("[TMH] Window message event fired");
      eventThrottler(delay);
    }, false);

    window.TMH = {
      scan: scanMessages,
      list: () => Array.from(userNames),
      setList: (arr) => {
        userNames = Array.isArray(arr)
          ? arr
          : String(arr).split(',').map(s => s.trim()).filter(Boolean);
        GM_setValue('user-names', userNames);
        console.log("[TMH] List updated via debug API:", userNames);
        scanMessages();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
