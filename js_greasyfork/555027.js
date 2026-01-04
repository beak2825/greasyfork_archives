// ==UserScript==
// @name         P3 - Daily Auto Quest
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Sticky auto-quest bar loads first, stays visible, auto quest with NPC exclusions, unique storage ID
// @match        https://pocketpumapets.com/quest*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/555027/P3%20-%20Daily%20Auto%20Quest.user.js
// @updateURL https://update.greasyfork.org/scripts/555027/P3%20-%20Daily%20Auto%20Quest.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ----------------- CONFIG -----------------
  const LS_KEY = 'p3_auto_quest_bar_v2_5'; // unique ID for storage
  const CHECK_INTERVAL_MS = 3500;
  const RELOAD_AFTER_CLICK_MS = 1600;
  const MAX_CONSECUTIVE_MISSES = 5; // increased persistence
  const EXCLUDED_NPCS = ['npc=5', 'npc=9']; // pages to skip
  // ------------------------------------------

  // ---------- Utilities ----------
  function ciIncludes(hay, needle) {
    return (hay || '').toLowerCase().includes((needle || '').toLowerCase());
  }

  function isExcludedPage() {
    return EXCLUDED_NPCS.some(npc => window.location.href.includes(npc));
  }

  // ---------- Sticky Bar ----------
  function createStickyBar() {
    if (document.getElementById('autoquest_sticky_bar')) return;

    const stickyBar = document.createElement('div');
    stickyBar.id = 'autoquest_sticky_bar';
    Object.assign(stickyBar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      backgroundColor: '#2d3e1f',
      padding: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      zIndex: '99999',
      borderBottom: '2px solid black'
    });

    const left = document.createElement('div');
    Object.assign(left.style, { display: 'flex', gap: '20px', alignItems: 'center' });

    const right = document.createElement('div');
    Object.assign(right.style, { display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' });

    // Auto controls
    const startBtn = document.createElement('button');
    startBtn.textContent = '▶️ Start Auto-Quest';
    Object.assign(startBtn.style, {
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backgroundColor: '#3a5a40',
      color: 'white',
      border: '2px solid #1b2b1f'
    });

    const stopBtn = document.createElement('button');
    stopBtn.textContent = '⏹ Stop Auto-Quest';
    Object.assign(stopBtn.style, {
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backgroundColor: '#7b3535',
      color: 'white',
      border: '2px solid #3a1a1a'
    });
    stopBtn.disabled = true;

    const status = document.createElement('span');
    status.textContent = 'Status: Stopped';
    Object.assign(status.style, { fontWeight: '600', color: 'white', padding: '4px 8px' });

    right.appendChild(status);
    right.appendChild(startBtn);
    right.appendChild(stopBtn);

    stickyBar.appendChild(left);
    stickyBar.appendChild(right);
    document.body.prepend(stickyBar); // inject at very top
    document.body.style.marginTop = '80px';

    return { stickyBar, startBtn, stopBtn, status };
  }

  const { startBtn, stopBtn, status } = createStickyBar();

  // ---------- Quest Button Finder ----------
  function findQuestButton(label) {
    const submits = Array.from(document.querySelectorAll('input[type="submit"], button'));
    const visible = submits.filter(el => {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (el.disabled) return false;
      const txt = (el.value || el.textContent || '').trim();
      return ciIncludes(txt, label);
    });
    visible.sort((a, b) => {
      const af = a.closest('form');
      const bf = b.closest('form');
      const ascore = af && (ciIncludes(af.id, 'quest') || ciIncludes(af.className, 'quest')) ? 0 : 1;
      const bscore = bf && (ciIncludes(bf.id, 'quest') || ciIncludes(bf.className, 'quest')) ? 0 : 1;
      return ascore - bscore;
    });
    return visible[0] || null;
  }

  function clickAndReload(btn) {
    btn.click();
    setTimeout(() => location.reload(), RELOAD_AFTER_CLICK_MS);
  }

  // ---------- Auto Quest Loop ----------
  let intervalId = null;
  let consecutiveMisses = 0;

  function setRunningUI(running) {
    if (running) {
      status.textContent = 'Status: Auto-Questing…';
      startBtn.disabled = true;
      stopBtn.disabled = false;
    } else {
      status.textContent = 'Status: Stopped';
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  }

  function stopAuto(reason = '') {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    localStorage.removeItem(LS_KEY);
    setRunningUI(false);
    if (reason) console.log('AutoQuest stopped:', reason);
  }

  function runOnce() {
    if (isExcludedPage()) {
      stopAuto('Excluded NPC page.');
      return;
    }

    const turnIn = findQuestButton('Turn In Quest');
    if (turnIn) {
      status.textContent = 'Status: Turning in quest…';
      clickAndReload(turnIn);
      consecutiveMisses = 0;
      return;
    }

    const start = findQuestButton('Start Quest');
    if (start) {
      status.textContent = 'Status: Starting quest…';
      clickAndReload(start);
      consecutiveMisses = 0;
      return;
    }

    consecutiveMisses += 1;
    status.textContent = `Status: Waiting… (${consecutiveMisses}/${MAX_CONSECUTIVE_MISSES})`;
    if (consecutiveMisses >= MAX_CONSECUTIVE_MISSES) {
      stopAuto('No Start/Turn In buttons available.');
    }
  }

  function startAuto() {
    if (intervalId) return;
    consecutiveMisses = 0;
    localStorage.setItem(LS_KEY, '1');
    setRunningUI(true);
    const firstDelay = 600 + Math.floor(Math.random() * 400);
    setTimeout(() => {
      runOnce();
      intervalId = setInterval(runOnce, CHECK_INTERVAL_MS);
    }, firstDelay);
  }

  startBtn.addEventListener('click', startAuto);
  stopBtn.addEventListener('click', () => stopAuto('Stopped by user'));

  // Resume if previously running
  if (localStorage.getItem(LS_KEY) === '1') {
    startAuto();
  }

})();
