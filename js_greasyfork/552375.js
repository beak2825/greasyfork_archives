// ==UserScript==
// @name         GreasyFork Wishlist 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a ⭐ wishlist button next to script titles on GreasyFork to save for later testing
// @author       Emree
// @match        https://greasyfork.org/*
// @license     MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552375/GreasyFork%20Wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/552375/GreasyFork%20Wishlist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'greasyfork_wishlist';
  const saveWishlist = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  const loadWishlist = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const wishlist = loadWishlist();

  // 🧱 Styles
  GM_addStyle(`
    .wishlist-btn {
      cursor: pointer;
      font-size: 1.3em;
      margin-left: 6px;
      vertical-align: middle;
      transition: 0.2s ease;
    }
    .wishlist-btn:hover { transform: scale(1.1); }
    .wishlist-btn.active { color: gold; }
    .wishlist-modal {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #1a1a1a;
      color: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 0 20px rgba(0,0,0,0.4);
      z-index: 9999;
      width: 400px;
      max-height: 60vh;
      overflow-y: auto;
      display: none;
    }
    .wishlist-modal h2 {
      margin-top: 0;
      font-size: 1.4em;
      border-bottom: 1px solid #333;
      padding-bottom: 6px;
    }
    .wishlist-modal a {
      display: block;
      color: #9ad;
      margin: 5px 0;
      text-decoration: none;
    }
    .wishlist-modal button {
      margin-top: 10px;
      background: crimson;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
    }
    #wishlist-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #222;
      color: white;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 1.5em;
      box-shadow: 0 0 10px rgba(0,0,0,0.4);
      transition: 0.2s;
    }
    #wishlist-toggle:hover { background: #333; }
  `);

  // 🧩 Functions
  const toggleWishlist = (script) => {
    const index = wishlist.findIndex((s) => s.url === script.url);
    if (index > -1) wishlist.splice(index, 1);
    else wishlist.push(script);
    saveWishlist(wishlist);
  };

  const updateModal = () => {
    const container = document.getElementById('wishlist-items');
    if (!container) return;
    container.innerHTML = wishlist.length
      ? wishlist.map((s) => `<a href="${s.url}" target="_blank">${s.name}</a>`).join('')
      : '<p>No scripts saved yet.</p>';
  };

  const createModal = () => {
    const modal = document.createElement('div');
    modal.className = 'wishlist-modal';
    modal.innerHTML = `
      <h2>⭐ My Wishlist</h2>
      <div id="wishlist-items"></div>
      <button id="clear-wishlist">Clear All</button>
    `;
    document.body.appendChild(modal);
    document.getElementById('clear-wishlist').onclick = () => {
      if (confirm('Clear wishlist?')) {
        wishlist.length = 0;
        saveWishlist(wishlist);
        updateModal();
      }
    };
    return modal;
  };

  const createToggleButton = (modal) => {
    const btn = document.createElement('div');
    btn.id = 'wishlist-toggle';
    btn.innerHTML = '⭐';
    document.body.appendChild(btn);
    btn.onclick = () => {
      modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
      updateModal();
    };
  };

  // 🪄 Inject star next to each script title
  const injectButtons = () => {
    document.querySelectorAll('li[data-script-id] h2').forEach((h2) => {
      const link = h2.querySelector('a.script-link');
      if (!link || h2.querySelector('.wishlist-btn')) return;

      const name = link.textContent.trim();
      const url = link.href;
      const isSaved = wishlist.some((s) => s.url === url);

      const btn = document.createElement('span');
      btn.textContent = '⭐';
      btn.className = 'wishlist-btn' + (isSaved ? ' active' : '');
      btn.title = isSaved ? 'Remove from wishlist' : 'Add to wishlist';

      btn.onclick = (e) => {
        e.preventDefault();
        toggleWishlist({ name, url });
        btn.classList.toggle('active');
        btn.title = btn.classList.contains('active')
          ? 'Remove from wishlist'
          : 'Add to wishlist';
      };

      // Insert star right after title link
      link.insertAdjacentElement('afterend', btn);
    });
  };

  // 🚀 Init
  const modal = createModal();
  createToggleButton(modal);
  injectButtons();
  setInterval(injectButtons, 2000); // keep updating while browsing
})();
