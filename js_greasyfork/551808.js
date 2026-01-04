// ==UserScript==
// @name         JanitorAI Chat Brancher
// @namespace    http://tampermonkey.net/
// @version      0.1.4-beta
// @description  Adds buttons to clone chat from any point
// @author       IWasTheSyntaxError
// @match        https://janitorai.com/chats/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551808/JanitorAI%20Chat%20Brancher.user.js
// @updateURL https://update.greasyfork.org/scripts/551808/JanitorAI%20Chat%20Brancher.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // Helper to grab the numeric ID of the chat from the current page URL
  function getChatIdFromUrl() {
    const m = window.location.pathname.match(/\/chats\/(\d+)/);
    if (!m) {
      console.error('No chat id in URL.');
      return null;
    }
    return m[1];
  }

  // JanitorAI uses Supabase for auth. This function hunts for the login token
  // in every possible corner: chunked cookies, standard cookies, and browser storage.
    function getAuthTokenFromCookie() {
      // Supabase sometimes splits the token into multiple small cookies (chunking)
      const parts = document.cookie
        .split("; ")
        .map(c => c.split("="))
        .filter(([name]) => name.startsWith("sb-auth-auth-token."))
        .sort((a, b) => {
          const ai = Number(a[0].split(".").pop());
          const bi = Number(b[0].split(".").pop());
          return ai - bi;
        })
        .map(([, value]) => value);
    
      if (parts.length) {
        const joined = parts.join("");
        try {
          if (joined.startsWith("base64-")) {
            return JSON.parse(atob(joined.replace(/^base64-/, ""))).access_token;
          }
        } catch (e) {
          console.error("Failed to parse chunked auth token", e);
        }
      }
    
      // Fallback: Check for the standard single cookie format
      const match = document.cookie.match(/sb-auth-auth-token=base64-([^;]+)/);
      if (match) {
        try {
          return JSON.parse(atob(match[1])).access_token;
        } catch (e) {}
      }
    
      // Fallback: Check for the older Supabase cookie style
      const match2 = document.cookie.match(/sb-auth=([^;]+)/);
      if (match2) {
        try {
          return JSON.parse(decodeURIComponent(match2[1])).access_token;
        } catch (e) {}
      }
    
      // Fallback: Look in Local Storage if cookies are missing
      const ls = localStorage.getItem("sb-auth-auth-token");
      if (ls) {
        try {
          return JSON.parse(ls).access_token;
        } catch (e) {}
      }
    
      // Final attempt: Check Session Storage
      const ss = sessionStorage.getItem("sb-auth-auth-token");
      if (ss) {
        try {
          return JSON.parse(ss).access_token;
        } catch (e) {}
      }
    
      return null;
    }

  // A standardized wrapper for API calls that automatically attaches the user's auth token
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

  // This script is "teleported" into the newly created chat tab. 
  // It handles the actual rebuilding of the chat history.
function getInjectedScriptString() {
  return `
(function () {
  console.log('%c[cloner] High-Speed Pipelined Sequencer Active', 'color: cyan; font-weight:700');

  const MAX_CONCURRENCY = 10; // Max number of messages to send at once
  window.addEventListener('message', async function (ev) {
    if (!ev.data || ev.data.type !== 'clonedChatMessages') return;

    const { messages, chatId, token } = ev.data;
    const postUrl = 'https://janitorai.com/hampter/chats/' + chatId + '/messages';
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const sortedMessages = [...messages].reverse();
    const total = sortedMessages.length;

    // Track state: 'idle' means waiting, 'sending' means in flight, 'done' means confirmed.
    const status = new Array(total).fill('idle');
    let verifiedCount = 0;

    // UI Overlay to show progress in the new tab
    const banner = document.getElementById('cloner-debug-banner') || document.body.appendChild(document.createElement('div'));
    banner.style = "position:fixed;right:12px;bottom:12px;z-index:9999;padding:12px;background:rgba(0,0,0,0.95);color:white;border-radius:8px;font-family:monospace;font-size:11px;border:1px solid cyan;box-shadow: 0 0 10px cyan;";

    // This function blasts messages out as fast as the limit allows.
    // It doesn't care about order yet; it just wants to get them to the server.
    async function startSending() {
      for (let i = 0; i < total; i++) {
        // Stop if we hit the concurrency limit so we don't get rate-limited or crash the tab
        while (status.filter(s => s === 'sending').length >= MAX_CONCURRENCY) {
          await sleep(10);
        }

        send(i); // Fire off the request
        await sleep(50); // Tiny gap to be "polite" to the network socket
      }
    }

    // Handles an individual message upload with built-in retry logic
    async function send(index) {
      status[index] = 'sending';
      let success = false;
      while (!success) {
        try {
          const res = await fetch(postUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(sortedMessages[index])
          });

          if (res.ok) {
            status[index] = 'done';
            success = true;
          } else if (res.status === 429) {
            // If the server says "slow down," wait 3 seconds and try again
            await sleep(3000);
          } else {
            await sleep(1000);
          }
        } catch (e) {
          await sleep(1000);
        }
      }
    }

    // This is the "brain." Even if message #5 finishes before message #1, 
    // this ensures the UI and finalization happen in the correct chronological order.
    async function monitorProgress() {
      for (let i = 0; i < total; i++) {
        // Pause here until this specific message is confirmed by the server
        while (status[i] !== 'done') {
          banner.innerText = 'Syncing: ' + verifiedCount + ' / ' + total + ' (Waiting for msg ' + i + ')';
          await sleep(20);
        }
        verifiedCount++;
        // If the next message in line is already 'done', the loop will skip through it instantly
      }
    }

    try {
      // Run both processes side-by-side
      await Promise.all([startSending(), monitorProgress()]);

      banner.innerText = "Order Verified. Finalizing...";
      banner.style.borderColor = "lime";
      await sleep(2000);
      window.location.reload(); // Refresh to show the newly built chat
    } catch (err) {
      banner.innerText = "Error: " + err.message;
    }
  }, false);
})();
`.trim();
}

  // Scans the page until it finds the chat messages in the DOM
  function waitForMessages() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const messages = document.querySelectorAll('[data-item-index]');
        if (messages.length > 0) {
          clearInterval(interval);
          resolve(messages);
        }
      }, 500);
    });
  }

  // Injects the "Clone from here" button into each message block
  function addCloneButtons(messages) {
    messages.forEach((msgEl) => {
      if (msgEl.querySelector('.clone-from-here-btn')) return; 

      const btn = document.createElement('button');
      btn.textContent = 'Clone from here';
      btn.className = 'clone-from-here-btn';
      btn.style.marginLeft = '8px';
      btn.style.fontSize = '10px';
      btn.style.cursor = 'pointer';

      const index = Number(msgEl.getAttribute('data-item-index'));
      if (isNaN(index)) return;

      btn.addEventListener('click', () => {
        console.log(`[Tampermonkey] Clone from message index: ${index}`);
        // Notify the main listener that we want to start the cloning process
        window.postMessage({ type: 'startPartialClone', startIndex: index }, '*');
      });

      msgEl.appendChild(btn);
    });
  }

  // The primary logic for setting up a branched chat
  window.addEventListener('message', async (ev) => {
    if (!ev.data || ev.data.type !== 'startPartialClone') return;

    const startIndex = ev.data.startIndex;
    console.log('[cloner] Partial clone requested from index:', startIndex);

    try {
      const originalChatId = getChatIdFromUrl();
      if (!originalChatId) throw new Error('No chat id in URL');

      // Fetch the full history of the current chat
      const source = await fetchJSON(`https://janitorai.com/hampter/chats/${originalChatId}`);
      const characterId = source.chat?.character_id;
      const messages = Array.isArray(source.chatMessages) ? source.chatMessages : [];

      if (!characterId) throw new Error('source chat missing character_id');

      if (startIndex < 0 || startIndex >= messages.length) {
        alert(`Start index (${startIndex}) out of range. Max index: ${messages.length - 1}`);
        return;
      }

      // Logic for selecting which messages to keep. 
      // We slice the history up to the point the user clicked.
      const reversedMessagesToClone = messages.slice(messages.length - (startIndex+1));
      reversedMessagesToClone.pop(); 

      console.log(reversedMessagesToClone);
      const personaId = source.chat?.persona_id || null;

      // 1. Create a brand new, empty chat with the same character
      const created = await fetchJSON('https://janitorai.com/hampter/chats', {
        method: 'POST',
        body: JSON.stringify({ character_id: characterId, persona_id: personaId }),
      });
      const newChatId = created.id;
      
      // 2. Open that new chat in a background tab
      const newTab = window.open(`https://janitorai.com/chats/${newChatId}`, '_blank');

      const token = getAuthTokenFromCookie();
      if (!token) throw new Error('Missing auth token for posting');

      // 3. Wait for the new tab to load, then inject the reconstruction script
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

            // Injects the worker script defined above
            const s = newTab.document.createElement('script');
            s.type = 'text/javascript';
            s.textContent = getInjectedScriptString();
            newTab.document.documentElement.appendChild(s);

            // Send the message data to the new tab via postMessage
            newTab.postMessage({
              type: 'clonedChatMessages',
              chatId: newChatId,
              messages: reversedMessagesToClone,
              token: token,
            }, '*');

            clearInterval(iv);
            resolve();
          } catch (e) {
            // Keep trying until the tab is accessible (cross-origin might delay this)
          }
        }, 250);
      });

      console.log('[cloner] Injection done. New tab should receive messages and start POSTing.');

    } catch (err) {
      console.error('[cloner] error during partial clone:', err);
      alert('Error: ' + err.message);
    }
  });

  // Entry point: continuously check for new messages as the user scrolls
  async function run() {
    while (true) {
      try {
        const messages = await waitForMessages();
        addCloneButtons(messages);
      } catch (e) {
        console.error('Error adding clone buttons:', e);
      }
      // Re-scan every 3 seconds to handle dynamically loaded messages
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  run();

})();