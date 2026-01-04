// ==UserScript==
// @name         YouTube Chat Display Name Restorer
// @namespace    yt-chat-display-names
// @version      2026-01-03
// @description  Replace @usernames in YouTube live chat with display names
// @author       Jach + ChatGPT
// @license      Unlicense / Public Domain
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561300/YouTube%20Chat%20Display%20Name%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/561300/YouTube%20Chat%20Display%20Name%20Restorer.meta.js
// ==/UserScript==

/*
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org/>
*/

(() => {
  "use strict";

  const cache = new Map(); // "@username" -> "Display Name"
  const pending = new Map(); // "@username" -> Promise
  
  function extractTitle(html) {
    // In Firefox, could do new DOMParser().parseFromString(html, "text/html").title
    // but in Chromium, this created an error about the document requiring a 'TrustedHTML' assignment.
    // Thus we'll just extract the title with a match and hope Zalgo stays away...
    const m = html.match(/<title>([^<]+)<\/title>/i);
    return m ? m[1].trim() : null;
  }

  function fetchDisplayName(username) {
    if (cache.has(username)) {
      return Promise.resolve(cache.get(username));
    }

    if (pending.has(username)) {
      return pending.get(username);
    }

    const p = fetch(`https://www.youtube.com/${username}`)
      .then(r => r.text())
      .then(html => {
        const title = extractTitle(html);

        if (!title) return null;

        // Usually "Display Name - YouTube"
        const name = title.replace(/\s*-\s*YouTube\s*$/, "").trim();
        cache.set(username, name);
        return name;
      })
      .catch(() => null)
      .finally(() => {
        pending.delete(username);
      });

    pending.set(username, p);
    return p;
  }

  function processMessage(node) {
    // YouTube chat name nodes typically look like:
    // <span id="author-name">@blah</span>
    if (!(node instanceof HTMLElement)) return;

    if (node.id !== "author-name") return;

    const text = node.textContent;
    if (!text || !text.startsWith("@")) return;

    fetchDisplayName(text).then(name => {
      if (!name) return;
      node.textContent = name;
    });
  }

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.id === "author-name") {
          processMessage(node);
        } else {
          // Catch nested author-name spans
          node.querySelectorAll?.("#author-name").forEach(processMessage);
        }
      }
    }
  });

  function waitForChat() {
    const chat = document.querySelector("yt-live-chat-app");
    if (!chat) {
      setTimeout(waitForChat, 500);
      return;
    }

    observer.observe(chat, {
      childList: true,
      subtree: true
    });
  }

  waitForChat();


})();