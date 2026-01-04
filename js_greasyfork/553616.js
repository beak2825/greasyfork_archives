// ==UserScript==
// @name         Patreon to Kemono Redirect
// @namespace    https://kemono.cr/
// @version      1.0.3
// @description  Redirect Patreon to Kemono
// @match        https://www.patreon.com/*
// @match        https://patreon.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553616/Patreon%20to%20Kemono%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/553616/Patreon%20to%20Kemono%20Redirect.meta.js
// ==/UserScript==

(() => {
  const excluded = ['/settings', '/home', '/explore', '/messages'];
  const path = window.location.pathname;
  if (excluded.some(p => path.startsWith(p))) return;

  const cwpage = path === '/cw' || path.startsWith('/cw/');
  const regex = cwpage
    ? /https:\/\/www\.patreon\.com\/api\/user\/(\d+)/
    : /"related":"https:\/\/www\.patreon\.com\/api\/user\/(\d+)"/;

  const match = document.documentElement.innerHTML.match(regex);
  if (!match) return;

  const button = document.createElement('a');
  button.href = `https://kemono.cr/patreon/user/${match[1]}`;
  button.target = '_blank';
  button.textContent = 'Kemono';
  Object.assign(button.style, {
    position: 'fixed',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#d19b83',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
    padding: '10px 18px',
    borderRadius: '999px',
    zIndex: 99999,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,.35)'
  });
  document.body.appendChild(button);
})();