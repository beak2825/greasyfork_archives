// ==UserScript==
// @name         Freebitco Auto Roll – works with enabled CAPTCHA
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Every 20s checks if PLAY WITHOUT CAPTCHA → PLAY → wait 10s → ROLL → after 10s reloads the page
// @match        *://freebitco.in/*
// @match        *://*.freebitco.in/*
// @match        *://freebitco.in/static/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555623/Freebitco%20Auto%20Roll%20%E2%80%93%20works%20with%20enabled%20CAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/555623/Freebitco%20Auto%20Roll%20%E2%80%93%20works%20with%20enabled%20CAPTCHA.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('[FB-Auto] loaded');

  // --- ADDED: status box ---
  const box = document.createElement('div');
  box.id = 'fbAutoStatusBox';
  box.textContent = 'Auto-roll: ON';
  Object.assign(box.style, {
    position: 'fixed',
    right: '10px',
    bottom: '10px',
    padding: '8px 12px',
    background: '#222',
    color: '#0f0',
    fontSize: '14px',
    zIndex: 999999,
    borderRadius: '6px',
    fontFamily: 'monospace',
    opacity: '0.85',
    pointerEvents: 'none'
  });
  document.body.appendChild(box);


  const START_DELAY_MS    = 10_000;   // start 10s after entering the page
  const WAIT_AFTER_PLAY   = 10_000;   // wait 10s after PLAY before ROLL
  const LOOP_INTERVAL_MS  = 20_000;   // check every 20s
  const RELOAD_AFTER_ROLL = 10_000;   // 10s after roll → reload page

  const SEL = {
    playId:  '#play_without_captchas_button',
    playCls: '.play_without_captcha_button',
    rollId:  '#free_play_form_button'
  };

  function log(...a){ console.log('[FB-Auto]', ...a); }

  function clickEl(el) {
    try {
      el.scrollIntoView({block:'center'});
      el.focus?.();
      el.click();
      return true;
    } catch(e) {
      console.warn('[FB-Auto] click failed:', e);
      return false;
    }
  }

  function findPlay() {
    return document.querySelector(SEL.playId)
        || document.querySelector(SEL.playCls)
        || [...document.querySelectorAll('button,div,a,span')]
           .find(n => (n.innerText||'').toUpperCase().includes('PLAY WITHOUT CAPTCHA'));
  }

  function findRoll() {
    return document.querySelector(SEL.rollId)
        || [...document.querySelectorAll('input[type="submit"],button,div,a,span')]
           .find(n => ((n.value||n.innerText||'').toUpperCase().includes('ROLL')));
  }

  let busy = false;

  async function cycle() {
    if (busy) return;
    busy = true;

    try {
      log('Cycle @', new Date().toLocaleTimeString());

      const playBtn = findPlay();

      if (!playBtn) {
        log('PLAY not available → skip');
        return;
      }

      log('Clicking PLAY WITHOUT CAPTCHA');
      clickEl(playBtn);

      await new Promise(r => setTimeout(r, WAIT_AFTER_PLAY));

      const rollBtn = findRoll();
      if (rollBtn) {
        log('Clicking ROLL!');
        clickEl(rollBtn);

        log('ROLL done → reloading page in 10s...');
        setTimeout(() => location.reload(), RELOAD_AFTER_ROLL);

      } else {
        log('ROLL not found after PLAY');
      }

    } catch(e) {
      console.error('[FB-Auto] error:', e);
    } finally {
      busy = false;
    }
  }

  setTimeout(cycle, START_DELAY_MS);
  setInterval(cycle, LOOP_INTERVAL_MS);

})();
