// ==UserScript==
// @name         Nitro Type Leaderboards
// @namespace    https://ntleaderboards.onrender.com
// @version      1.7
// @description  Seamlessly embeds NTLeaderboards into Nitro Type with native scrolling
// @match        https://www.nitrotype.com/*
// @grant        none
// @author       SOLICITARY
// @downloadURL https://update.greasyfork.org/scripts/559189/Nitro%20Type%20Leaderboards.user.js
// @updateURL https://update.greasyfork.org/scripts/559189/Nitro%20Type%20Leaderboards.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TAB_CLASS = 'nt-custom-leaderboards';
  const IFRAME_SRC = 'https://ntleaderboards.onrender.com/';
  const IFRAME_HEIGHT = 9290;
  const CROP_TOP = -150;
  const CROP_LEFT = -110;
  const EXTRA_WIDTH = 220;
  const CROP_BOTTOM = 700;
  let injected = false;

  function insertTab() {
    if (document.querySelector('.' + TAB_CLASS)) return;

    const nav = document.querySelector('.nav-list');
    if (!nav) return;

    const ach = Array.from(nav.children).find(li =>
      li.querySelector('a[href="/achievements"]')
    );

    const li = document.createElement('li');
    li.className = `nav-list-item ${TAB_CLASS}`;
    li.innerHTML = `
      <a href="/leaderboards" class="nav-link">
        <span class="has-notify">Leaderboards</span>
      </a>
    `;

    ach ? ach.before(li) : nav.appendChild(li);
  }

  function setActiveTab(isActive) {
    const tab = document.querySelector('.' + TAB_CLASS);
    if (!tab) return;

    if (isActive) {
      const nav = tab.closest('.nav-list');
      if (nav) nav.querySelectorAll('.nav-list-item').forEach(li => li.classList.remove('is-current'));
      tab.classList.add('is-current');
    } else {
      tab.classList.remove('is-current');
    }
  }

  function injectPage() {
    const main = document.querySelector('main.structure-content');
    if (!main) return;

    if (main.querySelector(`iframe[src^="${IFRAME_SRC}"]`)) {
      injected = true;
      document.title = 'Leaderboards | Nitro Type';
      setActiveTab(true);
      return;
    }

    const WRAP_HEIGHT = Math.max(0, IFRAME_HEIGHT - CROP_BOTTOM); // <-- NEW

    main.innerHTML = `
      <section class="card card--b card--shadow card--o card--grit card--f mtxs mbm">
        <div class="well--p well--l_p pll" style="padding:0;">
          <div style="
            max-width:1200px;
            margin:0 auto;
            padding:0 16px;
          ">
            <div style="
              width:100%;
              position:relative;
              overflow:hidden;
              border-radius:8px;
              box-shadow:
                inset 0 0 0 1px rgba(255,255,255,0.06),
                inset 0 8px 24px rgba(0,0,0,0.35);
              background:#0e1420;
              height:${WRAP_HEIGHT}px; /* <-- NEW: crops the bottom */
            ">
              <iframe
                src="${IFRAME_SRC}"
                style="
                  width:calc(100% + ${EXTRA_WIDTH}px);
                  height:${IFRAME_HEIGHT}px;
                  border:none;
                  position:relative;
                  top:${CROP_TOP}px;
                  left:${CROP_LEFT}px;
                  display:block;
                "
                scrolling="no"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </section>
    `;

    injected = true;
    document.title = 'Leaderboards | Nitro Type';
    setActiveTab(true);
  }

  function isLeaderboardsRoute() {
    return location.pathname.startsWith('/leaderboards');
  }

  let t = null;
  function handleRoute() {
    clearTimeout(t);
    t = setTimeout(() => {
      insertTab();

      if (isLeaderboardsRoute()) {
        injectPage();
      } else {
        setActiveTab(false);
        injected = false;
      }
    }, 50);
  }

  function hookHistory(fnName) {
    const orig = history[fnName];
    history[fnName] = function (...args) {
      const ret = orig.apply(this, args);
      window.dispatchEvent(new Event('nt-route-change'));
      return ret;
    };
  }
  hookHistory('pushState');
  hookHistory('replaceState');
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('nt-route-change', handleRoute);

  const observer = new MutationObserver(handleRoute);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  handleRoute();
})();
