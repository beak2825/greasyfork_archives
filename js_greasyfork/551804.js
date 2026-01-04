// ==UserScript==
// @name         JanitorAI Chat Brancher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds buttons to clone the chat from any point
// @author       IWasTheSyntaxError
// @match        https://janitorai.com/chats/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551804/JanitorAI%20Chat%20Brancher.user.js
// @updateURL https://update.greasyfork.org/scripts/551804/JanitorAI%20Chat%20Brancher.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const NEW_TITLE = 'My Branched Dialogue (debug)';

  // Utility: get chat ID from URL
  function getChatIdFromUrl() {
    const m = window.location.pathname.match(/\/chats\/(\d+)/);
    if (!m) {
      console.error('No chat id in URL.');
      return null;
    }
    return m[1];
  }

  // Utility: get auth token from cookie
  function getAuthTokenFromCookie() {
    const match = document.cookie.match(/sb-auth-auth-token=base64-([^;]+)/);
    if (!match) return null;
    try {
      const decoded = JSON.parse(atob(match[1]));
      return decoded.access_token;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  // Utility: fetch JSON with auth token
  async function fetchJSON(url, options = {}) {
    const token = getAuthTokenFromCookie();
    if (!token) throw new Error('No auth token');

    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const text = await res.text().catch(() => '');
    let body = text;
    try {
      body = text ? JSON.parse(text) : text;
    } catch (e) {
      /* not JSON */
    }

    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body;
  }

  // Injected script string for the new tab to post messages
  function getInjectedScriptString() {
    return `
(function () {
  console.log('%c[cloner] Injected script active', 'color: cyan; font-weight:700');
  window._cloned_results = [];
  window._cloned_done = false;

  try {
    const banner = document.createElement('div');
    banner.id = 'cloner-debug-banner';
    banner.style.position = 'fixed';
    banner.style.right = '12px';
    banner.style.bottom = '12px';
    banner.style.zIndex = 2147483647;
    banner.style.padding = '8px 10px';
    banner.style.background = 'rgba(0,0,0,0.6)';
    banner.style.color = 'white';
    banner.style.borderRadius = '8px';
    banner.style.fontSize = '12px';
    banner.style.fontFamily = 'sans-serif';
    banner.innerText = 'Cloner: waiting for messages...';
    document.documentElement.appendChild(banner);
  } catch (e) {}

  window.addEventListener('message', function (ev) {
    if (!ev.data || ev.data.type !== 'clonedChatMessages') return;
    (async function () {
      const info = ev.data;
      const messages = Array.isArray(info.messages) ? info.messages : [];
      const chatId = info.chatId;
      const token = info.token;
      console.log('[cloner] Received', messages.length, 'messages for chat', chatId);

      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      const postUrl = 'https://janitorai.com/hampter/chats/' + chatId + '/messages';

      console.log(messages)

      // Send messages in reverse order (last to first)
      for (let i = messages.length; i >= 0; --i) {
        const msg = messages[i];
        const record = { index: i, ok: false, attempts: [] };

        const variants = [];

        try {
          variants.push(JSON.stringify(msg)); // full original
        } catch (e) { /* skip if circular */ }


        // remove duplicates
        const seen = new Set();
        const uniqVariants = variants.filter(v => {
          if (!v || seen.has(v)) return false;
          seen.add(v);
          return true;
        });

        let success = false;
        for (let pv = 0; pv < uniqVariants.length && !success; ++pv) {
          const payloadText = uniqVariants[pv];
          for (let attempt = 1; attempt <= 3 && !success; ++attempt) {
            try {
              const res = await fetch(postUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                },
                body: payloadText
              });

              const text = await res.text().catch(() => '');
              let parsed;
              try { parsed = text ? JSON.parse(text) : text; } catch (e) { parsed = text; }

              record.attempts.push({ variantIndex: pv, attempt, status: res.status, response: parsed, payload: payloadText });

              if (res.ok) {
                record.ok = true;
                record.status = res.status;
                record.response = parsed;
                success = true;
                console.log('[cloner] message', i, 'posted OK (variant', pv, 'attempt', attempt, ')', msg);
                break;
              } else {
                console.warn('[cloner] message', i, 'POST returned', res.status, parsed, '(variant', pv, 'attempt', attempt, ')');
              }
            } catch (err) {
              record.attempts.push({ variantIndex: pv, attempt, error: (err && err.message) ? err.message : String(err), payload: payloadText });
              console.error('[cloner] fetch error for message', i, 'variant', pv, 'attempt', attempt, err);
            }
            await sleep(150 + attempt * 150);
          }
        }

        if (!record.ok) {
          console.error('[cloner] FAILED to post message', i, 'record:', record);
        }
        window._cloned_results.push(record);

        await sleep(200);
      } // for messages

      window._cloned_done = true;
      console.log('[cloner] done posting. inspect window._cloned_results');
      try {
        const banner = document.getElementById('cloner-debug-banner');
        if (banner) banner.innerText = 'Cloner: finished';
      } catch (e) {}

      // Reload page to reflect new messages
      await new Promise(r => setTimeout(r, 500));
      console.log('[cloner] forcing full reload after message post');
      window.location.reload();
    })();
  }, false);
})();
`.trim();
  }

  // Wait for chat message elements that have data-item-index attribute
  function waitForMessages() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        // New selector using data-item-index attribute on messages
        const messages = document.querySelectorAll('[data-item-index]');
        if (messages.length > 0) {
          clearInterval(interval);
          resolve(messages);
        }
      }, 500);
    });
  }

  // Add "Clone from here" buttons to messages
  function addCloneButtons(messages) {
    messages.forEach((msgEl) => {
      if (msgEl.querySelector('.clone-from-here-btn')) return; // skip if already added

      const btn = document.createElement('button');
      btn.textContent = 'Clone from here';
      btn.className = 'clone-from-here-btn';
      btn.style.marginLeft = '8px';
      btn.style.fontSize = '10px';
      btn.style.cursor = 'pointer';

      // Read index from data attribute (should be integer)
      const index = Number(msgEl.getAttribute('data-item-index'));
      if (isNaN(index)) return;

      btn.addEventListener('click', () => {
        console.log(`[Tampermonkey] Clone from message index: ${index}`);
        window.postMessage({ type: 'startPartialClone', startIndex: index }, '*');
      });

      msgEl.appendChild(btn);
    });
  }

  // Main listener to start cloning partial chats
  window.addEventListener('message', async (ev) => {
    if (!ev.data || ev.data.type !== 'startPartialClone') return;

    const startIndex = ev.data.startIndex;
    console.log('[cloner] Partial clone requested from index:', startIndex);

    try {
      const originalChatId = getChatIdFromUrl();
      if (!originalChatId) throw new Error('No chat id in URL');

      const source = await fetchJSON(`https://janitorai.com/hampter/chats/${originalChatId}`);
      const characterId = source.chat?.character_id;
      const messages = Array.isArray(source.chatMessages) ? source.chatMessages : [];

      

      if (!characterId) throw new Error('source chat missing character_id');

      if (startIndex < 0 || startIndex >= messages.length) {
        alert(`Start index (${startIndex}) out of range. Max index: ${messages.length - 1}`);
        return;
      }

      // Slice messages from 0 up to startIndex inclusive, then reverse
      const reversedMessagesToClone = messages.slice(messages.length - (startIndex+1));
      reversedMessagesToClone.pop();
      // const reversedMessagesToClone = messagesToClone.slice().reverse();

      console.log(reversedMessagesToClone);

      console.log(`[cloner] Cloning ${reversedMessagesToClone.length} messages (indexes 0 to ${startIndex})`);

      const created = await fetchJSON('https://janitorai.com/hampter/chats', {
        method: 'POST',
        body: JSON.stringify({ character_id: characterId, title: NEW_TITLE }),
      });
      const newChatId = created.id;
      console.log('[cloner] Created new chat with id', newChatId);

      const newTab = window.open(`https://janitorai.com/chats/${newChatId}`, '_blank');

      const token = getAuthTokenFromCookie();
      if (!token) throw new Error('Missing auth token for posting');

      // Wait for new tab document to be ready and inject script + post messages
      await new Promise((resolve, reject) => {
        const start = Date.now();
        const maxWait = 15000;
        const iv = setInterval(() => {
          try {
            if (Date.now() - start > maxWait) {
              clearInterval(iv);
              return;
            }
            if (!newTab.document || !newTab.document.documentElement) return;

            const s = newTab.document.createElement('script');
            s.type = 'text/javascript';
            s.textContent = getInjectedScriptString();
            newTab.document.documentElement.appendChild(s);

            newTab.postMessage({
              type: 'clonedChatMessages',
              chatId: newChatId,
              messages: reversedMessagesToClone,
              token: token,
            }, '*');

            clearInterval(iv);
            resolve();
          } catch (e) {
            // still waiting for document
          }
        }, 250);
      });

      console.log('[cloner] Injection done. New tab should receive messages and start POSTing.');
      // alert(`Started cloning ${reversedMessagesToClone.length} messages (0 to ${startIndex}) to new chat ID ${newChatId}.`);

    } catch (err) {
      console.error('[cloner] error during partial clone:', err);
      alert('Error: ' + err.message);
    }
  });

  // Wait for messages and add buttons, re-check every 3 seconds (dynamic updates)
  async function run() {
    while (true) {
      try {
        const messages = await waitForMessages();
        addCloneButtons(messages);
      } catch (e) {
        console.error('Error adding clone buttons:', e);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  run();

})();