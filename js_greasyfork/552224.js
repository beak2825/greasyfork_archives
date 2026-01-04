// ==UserScript==
// @name         Roblox: Rename Connections → Friends (targeted final)
// @namespace    https://example.com
// @version      1.3
// @description  Targeted replacements: /home H2 Connections -> Friends (preserve span), /users/friends H1 My Connections -> My Friends, /games/*/game-instances H2.server-list-header "Servers My Connections Are In" -> "Servers My Friends Are In". SPA-aware.
// @match        *://*.roblox.com/home*
// @match        *://roblox.com/home*
// @match        *://*.roblox.com/users/friends*
// @match        *://roblox.com/users/friends*
// @match        *://*.roblox.com/games/*/game-instances*
// @match        *://roblox.com/games/*/game-instances*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552224/Roblox%3A%20Rename%20Connections%20%E2%86%92%20Friends%20%28targeted%20final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552224/Roblox%3A%20Rename%20Connections%20%E2%86%92%20Friends%20%28targeted%20final%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const LOG = '[TM]';
  const FROM_H2_RE = /\bConnections\b/;
  const TO_H2 = 'Friends';
  const FROM_H1_RE = /\bMy\s+Connections\b/;
  const TO_H1 = 'My Friends';
  const FROM_SERVERS_H2_TEXT = 'Servers My Connections Are In';
  const TO_SERVERS_H2_TEXT = 'Servers My Friends Are In';

  // ---------- home H2 (preserve span.friends-count) ----------
  function replaceHomeH2(h2) {
    if (!h2 || h2.tagName !== 'H2') return false;
    if (!h2.querySelector || !h2.querySelector('span.friends-count')) return false;
    let did = false;
    for (const node of Array.from(h2.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const orig = node.nodeValue || '';
        if (FROM_H2_RE.test(orig)) {
          node.nodeValue = orig.replace(FROM_H2_RE, TO_H2);
          console.log(LOG, '[home] Replaced H2 text:', JSON.stringify(orig), '→', JSON.stringify(node.nodeValue), h2);
          did = true;
        }
      }
    }
    // fallback
    if (!did) {
      const totalText = (h2.textContent || '').trim();
      if (FROM_H2_RE.test(totalText)) {
        const span = h2.querySelector('span.friends-count');
        if (span) {
          try { Array.from(h2.childNodes).forEach(n => h2.removeChild(n)); } catch(e){}
          h2.appendChild(document.createTextNode(TO_H2));
          h2.appendChild(span);
          console.log(LOG, '[home] Fallback replaced H2 and preserved span', h2);
          did = true;
        }
      }
    }
    return did;
  }

  // ---------- friends page H1 ----------
  function replaceFriendsH1(h1) {
    if (!h1 || h1.tagName !== 'H1') return false;
    const txt = (h1.textContent || '').trim();
    if (!FROM_H1_RE.test(txt)) return false;
    // replace text nodes only to preserve children
    let did = false;
    for (const node of Array.from(h1.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const orig = node.nodeValue || '';
        if (FROM_H1_RE.test(orig)) {
          node.nodeValue = orig.replace(FROM_H1_RE, TO_H1);
          console.log(LOG, '[friends] Replaced H1 text-node:', JSON.stringify(orig), '→', JSON.stringify(node.nodeValue), h1);
          did = true;
        }
      }
    }
    if (!did) {
      // fallback: replace the visible text and re-append children
      const children = Array.from(h1.querySelectorAll('*'));
      try { Array.from(h1.childNodes).forEach(n => h1.removeChild(n)); } catch(e){}
      h1.appendChild(document.createTextNode(TO_H1 + ' '));
      children.forEach(c => h1.appendChild(c));
      console.log(LOG, '[friends] Fallback replaced H1 and re-appended children', h1);
      did = true;
    }
    return did;
  }

  // ---------- game instances H2 (server-list-header) ----------
  function replaceServersH2(h2) {
    if (!h2 || h2.tagName !== 'H2') return false;
    // target exact class for reliability
    if (!h2.classList || !h2.classList.contains('server-list-header')) return false;
    const txt = (h2.textContent || '').trim();
    if (txt !== FROM_SERVERS_H2_TEXT) return false;
    // if simple text, replace directly
    const hasElChildren = Array.from(h2.childNodes).some(n => n.nodeType === Node.ELEMENT_NODE);
    if (!hasElChildren) {
      h2.textContent = TO_SERVERS_H2_TEXT;
      console.log(LOG, '[servers] Replaced server-list-header H2:', txt, '→', h2.textContent, h2);
      return true;
    }
    // otherwise replace any text nodes containing phrase
    let did = false;
    for (const node of Array.from(h2.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const orig = node.nodeValue || '';
        if (orig.trim() === FROM_SERVERS_H2_TEXT) {
          node.nodeValue = TO_SERVERS_H2_TEXT;
          console.log(LOG, '[servers] Replaced server-list-header text-node:', JSON.stringify(orig), '→', JSON.stringify(node.nodeValue), h2);
          did = true;
        }
      }
    }
    if (!did) {
      // fallback: replace visible text and keep children
      const children = Array.from(h2.querySelectorAll('*'));
      try { Array.from(h2.childNodes).forEach(n => h2.removeChild(n)); } catch(e){}
      h2.appendChild(document.createTextNode(TO_SERVERS_H2_TEXT + ' '));
      children.forEach(c => h2.appendChild(c));
      console.log(LOG, '[servers] Fallback replaced H2 and re-appended children', h2);
      did = true;
    }
    return did;
  }

  // ---------- processing & mutation handling ----------
  function processRoot(root = document) {
    try {
      // home H2s
      const h2s = root.querySelectorAll ? Array.from(root.querySelectorAll('h2')) : [];
      h2s.forEach(h2 => { replaceHomeH2(h2); replaceServersH2(h2); });
      // h1s
      const h1s = root.querySelectorAll ? Array.from(root.querySelectorAll('h1')) : [];
      h1s.forEach(replaceFriendsH1);
      // also target server-list-header specifically
      const serverH2s = root.querySelectorAll ? Array.from(root.querySelectorAll('h2.server-list-header')) : [];
      serverH2s.forEach(replaceServersH2);
    } catch (e) {
      console.error(LOG, 'processRoot error', e);
    }
  }

  function handleAdded(node) {
    if (!node) return;
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'H2') { replaceHomeH2(node); replaceServersH2(node); }
      if (node.tagName === 'H1') replaceFriendsH1(node);
      try {
        const h2s = node.querySelectorAll && node.querySelectorAll('h2') || [];
        h2s.forEach(n => { replaceHomeH2(n); replaceServersH2(n); });
        const h1s = node.querySelectorAll && node.querySelectorAll('h1') || [];
        h1s.forEach(replaceFriendsH1);
      } catch (e) {}
      if (node.shadowRoot) {
        try {
          Array.from(node.shadowRoot.querySelectorAll('h2')).forEach(n => { replaceHomeH2(n); replaceServersH2(n); });
          Array.from(node.shadowRoot.querySelectorAll('h1')).forEach(replaceFriendsH1);
        } catch (e) {}
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
      const p = node.parentElement;
      if (p.tagName === 'H2') { replaceHomeH2(p); replaceServersH2(p); }
      if (p.tagName === 'H1') replaceFriendsH1(p);
    }
  }

  let mo = null;
  function startObserver() {
    if (mo) return;
    processRoot(document);
    mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length) {
          m.addedNodes.forEach(n => handleAdded(n));
        } else if (m.type === 'characterData' && m.target && m.target.parentElement) {
          const p = m.target.parentElement;
          if (p.tagName === 'H2') { replaceHomeH2(p); replaceServersH2(p); }
          if (p.tagName === 'H1') replaceFriendsH1(p);
        } else if (m.type === 'attributes' && m.target) {
          const t = m.target;
          if (t.tagName === 'H2') { replaceHomeH2(t); replaceServersH2(t); }
          if (t.tagName === 'H1') replaceFriendsH1(t);
        }
      }
    });

    mo.observe(document.documentElement || document, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    console.log(LOG, 'Observer started');
  }

  function stopObserver() {
    if (!mo) return;
    mo.disconnect();
    mo = null;
    console.log(LOG, 'Observer stopped');
  }

  // ---------- SPA hooks & activation ----------
  (function(hist){
    const p = hist.pushState, r = hist.replaceState;
    hist.pushState = function () { const ret = p.apply(hist, arguments); setTimeout(onLocationChange, 50); return ret; };
    hist.replaceState = function () { const ret = r.apply(hist, arguments); setTimeout(onLocationChange, 50); return ret; };
  })(window.history);

  window.addEventListener('popstate', () => setTimeout(onLocationChange, 50));

  function isGameInstances(url) {
    try {
      const u = new URL(url, location.origin);
      const p = u.pathname || '';
      const h = u.hash || '';
      return p.includes('/games/') && (p.includes('/game-instances') || h.includes('game-instances') || h.includes('#!/game-instances'));
    } catch (e) {
      return (url || '').includes('/games/') && (url || '').includes('game-instances');
    }
  }

  function onLocationChange() {
    const href = location.href;
    const path = location.pathname || '';
    const onHome = path.includes('/home') || href.includes('/home');
    const onUsersFriends = path.includes('/users/friends') || href.includes('/users/friends');
    const onGameInstances = isGameInstances(href);

    if (onHome || onUsersFriends || onGameInstances) {
      startObserver();
      if (onHome) processRoot(document);
      if (onUsersFriends) processRoot(document);
      if (onGameInstances) processRoot(document);
      setTimeout(() => processRoot(document), 300);
      setTimeout(() => processRoot(document), 900);
    } else {
      stopObserver();
    }
  }

  onLocationChange();
  // fallback poll for path changes
  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      onLocationChange();
    }
  }, 800);

  window.addEventListener('beforeunload', () => stopObserver());

})();
