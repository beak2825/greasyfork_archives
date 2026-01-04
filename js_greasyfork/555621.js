// ==UserScript==
// @name         Ups - Forum Picker Giveaway
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Pick a random user that posted on a forum page.
// @author       Upsilon[3212478]
// @match        https://www.torn.com/forums.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idles
// @license       All rights reserved 
// @downloadURL https://update.greasyfork.org/scripts/555621/Ups%20-%20Forum%20Picker%20Giveaway.user.js
// @updateURL https://update.greasyfork.org/scripts/555621/Ups%20-%20Forum%20Picker%20Giveaway.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /*** === CONFIGURATION === ***/
  const SHOW_LIST = true; // Hide / Show Participants list
  const ALLOW_TOGGLE = true; // Activate button "Show/Hide participants list"

  const box = document.createElement('li');
  box.id = 'tm-random-picker-box';
  Object.assign(box.style, {
    listStyle: 'none',
    background: 'rgba(40,40,40,0.95)',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '8px',
    margin: '6px 0',
    padding: '12px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
  });

  box.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;">🎲 Random Picker</div>
    ${ALLOW_TOGGLE ? `<button id="tm-toggle" style="margin-bottom:8px;padding:6px 10px;border:none;border-radius:6px;cursor:pointer;background:#444;color:#fff;">${SHOW_LIST ? 'Hide' : 'Show'} list</button>` : ''}
    <div id="tm-list" style="max-height:180px;overflow:auto;border:1px solid #444;border-radius:6px;padding:6px;margin-bottom:8px;${SHOW_LIST ? '' : 'display:none;'}">
    </div>
    <button id="tm-pick" style="width:100%;padding:8px;border:none;border-radius:6px;cursor:pointer;background:#1f8feb;color:#fff;">
      Pick someone
    </button>
    <div id="tm-result" style="margin-top:8px;font-weight:700;"></div>
  `;

    function waitForElm(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(`Timeout waiting for ${selector}`);
            }, timeout);
        });
    }

  function insertBox() {
      waitForElm('ul.thread-list')
          .then(ul => {
          const firstPost = ul.querySelector('li');
          if (firstPost) ul.insertBefore(box, firstPost);
          else ul.appendChild(box);
      })
          .catch(err => {
          console.warn(err);
          document.body.insertBefore(box, document.body.firstChild);
      });
  }
  insertBox();

  function scanPosts() {
    const posts = document.querySelectorAll('ul.thread-list li[data-id]');
    const counts = new Map();

    posts.forEach(post => {
      const user = post.querySelector('a.user.name');
      if (!user) return;

      const name = user.textContent.trim();
      const href = user.getAttribute('href') || '';
      const match = href.match(/XID=(\d+)/);
      const id = match ? match[1] : 'unknown';

      const fullName = `${name} [${id}]`;
      counts.set(fullName, (counts.get(fullName) || 0) + 1);
    });

    return counts;
  }

  function renderList(counts) {
    const listDiv = document.getElementById('tm-list');
    if (!listDiv) return;

    if (!counts || counts.size === 0) {
      listDiv.innerHTML = '<em>Aucun post trouvé.</em>';
      return;
    }

    const rows = [...counts.entries()]
      .sort((a,b) => b[1]-a[1])
      .map(([name, cnt]) => `<div>${escapeHTML(name)} — <strong>${cnt}</strong></div>`)
      .join('');
    listDiv.innerHTML = rows;
  }

  function pickRandom(counts) {
    if (!counts || counts.size === 0) return null;
    let total = 0;
    counts.forEach(c => total += c);
    let r = Math.random() * total;
    for (const [name, cnt] of counts.entries()) {
      if (r < cnt) return name;
      r -= cnt;
    }
    return [...counts.keys()][0];
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[s]));
  }

  let CURRENT_COUNTS = scanPosts();
  renderList(CURRENT_COUNTS);

  const pickBtn = box.querySelector('#tm-pick');
  const out = box.querySelector('#tm-result');
  pickBtn.addEventListener('click', () => {
    CURRENT_COUNTS = scanPosts();
    renderList(CURRENT_COUNTS);
    const winner = pickRandom(CURRENT_COUNTS);

    if (winner) {
      out.textContent = `Winner : ${winner}`;
      try {
        if (typeof GM_setClipboard === 'function') GM_setClipboard(winner);
        else navigator.clipboard?.writeText(winner);
      } catch (e) {
        console.warn('Clipboard error:', e);
      }
    } else {
      out.textContent = 'Aucun nom trouvé.';
    }
  });

  if (ALLOW_TOGGLE) {
    const toggleBtn = box.querySelector('#tm-toggle');
    const listDiv = box.querySelector('#tm-list');
    toggleBtn.addEventListener('click', () => {
      if (listDiv.style.display === 'none') {
        listDiv.style.display = 'block';
        toggleBtn.textContent = 'Hide list';
      } else {
        listDiv.style.display = 'none';
        toggleBtn.textContent = 'Show list';
      }
    });
  }

    window.addEventListener('popstate', () => {
        const existing = document.querySelector('#tm-random-picker-box');
        if (existing) existing.remove();
        setTimeout(insertBox, 500);
    });
})();