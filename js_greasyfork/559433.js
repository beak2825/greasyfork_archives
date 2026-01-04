// ==UserScript==
// @name         Dead Frontier + DFProfiler Bossmap Enhanced
// @namespace    Dead Frontier + DFProfiler Bossmap Enhanced
// @version      1.2
// @description  Mini Boss Map embed + DFProfiler tools + CTRL Click cell popup
// @author       Zega, Runonstof, Cezinha
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D*
// @match        https://*.dfprofiler.com/profile/view/*
// @match        https://*.dfprofiler.com/bossmap
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559433/Dead%20Frontier%20%2B%20DFProfiler%20Bossmap%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/559433/Dead%20Frontier%20%2B%20DFProfiler%20Bossmap%20Enhanced.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const url = location.href.toLowerCase();

  /* ============================================================
     PART 1 — MINI BOSS MAP
  ============================================================ */
  if (url.includes('deadfrontier.com') && !url.includes('dfprofiler')) {

    if (document.getElementById('df-mini-bossmap')) return;

    let playerId = localStorage.getItem('dfProfilerPlayerId');
    if (!playerId) {
      playerId = prompt('Enter DFProfiler Player ID:', '8119603');
      if (!/^\d+$/.test(playerId)) return;
      localStorage.setItem('dfProfilerPlayerId', playerId);
    }

    const profileUrl = `https://www.dfprofiler.com/profile/view/${playerId}`;

    const container = document.createElement('div');
    container.id = 'df-mini-bossmap';
    Object.assign(container.style, {
      position: 'fixed',
      top: '1vh',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999,
      background: '#111',
      border: '2px solid #444',
      borderRadius: '8px',
      overflow: 'hidden'
    });

    const controls = document.createElement('div');
    controls.style.textAlign = 'center';
    controls.style.padding = '6px';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Show Map';

    const changeBtn = document.createElement('button');
    changeBtn.textContent = 'Change ID';

    [toggleBtn, changeBtn].forEach(b => {
      Object.assign(b.style, {
        margin: '4px',
        background: '#222',
        color: '#ffd700',
        border: 'none',
        padding: '6px',
        cursor: 'pointer'
      });
    });

    controls.append(toggleBtn, changeBtn);
    container.append(controls);
    document.body.append(container);

    let iframe = null;

    function createIframe() {
      if (iframe) return;
      iframe = document.createElement('iframe');
      iframe.src = profileUrl;
      iframe.loading = 'lazy';
      iframe.style.width = '80vw';
      iframe.style.height = '80vh';
      iframe.style.border = 'none';
      container.append(iframe);
    }

    function destroyIframe() {
      if (!iframe) return;
      iframe.src = 'about:blank';
      iframe.remove();
      iframe = null;
    }

    toggleBtn.onclick = () => {
      if (iframe) {
        destroyIframe();
        toggleBtn.textContent = 'Show Map';
      } else {
        createIframe();
        toggleBtn.textContent = 'Hide Map';
      }
    };

    changeBtn.onclick = () => {
      const id = prompt('New Player ID:', playerId);
      if (!/^\d+$/.test(id)) return;
      localStorage.setItem('dfProfilerPlayerId', id);
      location.reload();
    };
  }

  /* ============================================================
     PART 2 — DFPROFILER
  ============================================================ */
  if (url.includes('dfprofiler.com') && window.self !== window.top) {

    window.addEventListener('load', () => {
      document.getElementById('showLast')?.textContent.includes('[Yes]') &&
        document.getElementById('showLast').click();

      document.querySelector('[href="#view-gps"]')?.click();
    }, { once: true });

    const KEY = 'df_scroll';
    let last = 0;

    addEventListener('scroll', () => {
      const now = performance.now();
      if (now - last > 300) {
        sessionStorage.setItem(KEY, scrollY);
        last = now;
      }
    });

    const saved = sessionStorage.getItem(KEY);
    if (saved) requestAnimationFrame(() => scrollTo(0, +saved));
  }

  /* ============================================================
     PART 3 — CTRL + CLICK CELL MAP (FULL VERSION)
  ============================================================ */
  if (url.includes('dfprofiler.com')) {

    if (!document.getElementById('df-cell-style')) {
      const style = document.createElement('style');
      style.id = 'df-cell-style';
      style.textContent = `
        td.coord:hover { cursor:pointer; opacity:.5 }
        #df-cell-popup {
          position:fixed;
          top:1.5vh;
          left:50%;
          transform:translateX(-50%);
          background:#111;
          border:2px solid #444;
          border-radius:8px;
          padding:10px;
          z-index:100000;
          color:#eee;
          max-width:90vw;
        }
        #df-cell-popup h3 {
          margin:0 0 6px;
          color:#ffd700;
          text-align:center;
        }
        #df-cell-popup img {
          max-width:100%;
          border-radius:6px;
        }
      `;
      document.head.append(style);
    }

    let popup = null;

    function closePopup() {
      popup?.remove();
      popup = null;
      document.removeEventListener('mousedown', outsideClick, true);
    }

    function outsideClick(e) {
      if (popup && !popup.contains(e.target)) closePopup();
    }

    document.addEventListener('click', e => {
      if (!e.ctrlKey) return;

      const cell = e.target.closest('td.coord');
      if (!cell) return;

      e.preventDefault();
      e.stopPropagation();

      closePopup();

      const x = [...cell.classList].find(c => c.startsWith('x'))?.slice(1);
      const y = [...cell.classList].find(c => c.startsWith('y'))?.slice(1);

      const bosses = cell.dataset.title
        ? cell.dataset.title.split(/<br>|,/).map(b => b.trim())
        : [];

      popup = document.createElement('div');
      popup.id = 'df-cell-popup';

      popup.innerHTML = `
        <h3>Cell X:${x} | Y:${y}</h3>
        ${
          bosses.length
            ? `<ul>${bosses.map(b => `<li>${b}</li>`).join('')}</ul>`
            : '<div>No bosses reported</div>'
        }
        <img src="https://deadfrontier.info/map/Fairview_${x}x${y}.png">
      `;

      document.body.append(popup);
      document.addEventListener('mousedown', outsideClick, true);
    });
  }
})();
