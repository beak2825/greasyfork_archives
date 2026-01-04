// ==UserScript==
// @name         Facebook Mobile Home Blocker (Dashboard)
// @version      3.0
// @description  Replaces m.facebook.com homepage feed with a clean custom dashboard (Search, Messages, Notifications, Settings)
// @author       You
// @match        https://m.facebook.com/
// @match        https://mobile.facebook.com/
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1524991
// @downloadURL https://update.greasyfork.org/scripts/552214/Facebook%20Mobile%20Home%20Blocker%20%28Dashboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552214/Facebook%20Mobile%20Home%20Blocker%20%28Dashboard%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DASHBOARD_HTML = `
    <style>
      body {
        background: #ffffff;
        color: #333;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .fb-dashboard {
        text-align: center;
        padding: 20px;
      }
      .fb-dashboard h1 {
        font-size: 1.5em;
        margin-bottom: 1em;
      }
      .fb-dashboard a {
        display: inline-block;
        text-decoration: none;
        background: #1877f2;
        color: white;
        padding: 10px 18px;
        margin: 6px;
        border-radius: 8px;
        font-weight: 500;
      }
      .fb-dashboard a:hover {
        background: #145dbf;
      }
      .fb-dashboard input {
        width: 80%;
        max-width: 300px;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1em;
        margin-top: 20px;
      }
    </style>

    <div class="fb-dashboard">
      <h1>🧭 Facebook Quick Access</h1>
      <div>
        <a href="/messages/">💬 Messages</a>
        <a href="/notifications/">🔔 Notifications</a>
        <a href="/friends/">👥 Friends</a>
        <a href="/settings/">⚙️ Settings</a>
      </div>
      <input type="text" id="fbSearchBox" placeholder="Search Facebook..." />
    </div>
  `;

  function replaceHomepage() {
    document.documentElement.innerHTML = DASHBOARD_HTML;

    const input = document.getElementById('fbSearchBox');
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `/search/?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
  }

  // Run only on homepage root
  if (location.pathname === '/' || location.pathname === '') {
    replaceHomepage();
  }
})();
