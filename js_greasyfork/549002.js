// ==UserScript==
// @name         GoBattle.io Spam A and D
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Maximum-speed alternating A and D movement in GoBattle.io.
// @author       GbGuest
// @match        *://gobattle.io/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/549002/GoBattleio%20Spam%20A%20and%20D.user.js
// @updateURL https://update.greasyfork.org/scripts/549002/GoBattleio%20Spam%20A%20and%20D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let holdMs = 10;     // ultra jitter default
  const minHold = 5;   // absolute fastest
  const maxHold = 500;
  let running = false;
  let dirA = true;

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = '12px';
  overlay.style.bottom = '12px';
  overlay.style.zIndex = 999999;
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.color = 'white';
  overlay.style.padding = '6px 8px';
  overlay.style.borderRadius = '8px';
  overlay.style.fontFamily = 'Arial, sans-serif';
  overlay.style.fontSize = '12px';
  overlay.style.lineHeight = '1.2';
  overlay.style.userSelect = 'none';
  overlay.innerHTML = 'A-D mover: OFF<br>hold: ' + holdMs + ' ms';
  document.documentElement.appendChild(overlay);

  function updateOverlay() {
    overlay.innerHTML = `A-D mover: ${running ? 'ON' : 'OFF'}<br>hold: ${holdMs} ms<br>F=toggle • +/-=speed`;
  }

  function makeKeyboardEvent(type, key, code, keyCodeVal) {
    let ev = new KeyboardEvent(type, { key, code, bubbles: true, cancelable: true });
    try {
      Object.defineProperty(ev, 'keyCode', { get: () => keyCodeVal });
      Object.defineProperty(ev, 'which', { get: () => keyCodeVal });
    } catch {}
    return ev;
  }

  function multiDispatch(ev) {
    [window, document, document.body, document.documentElement, document.querySelector('canvas')]
      .forEach(t => { if (t) try { t.dispatchEvent(ev); } catch {} });
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function pressAndHold(keyObj) {
    multiDispatch(makeKeyboardEvent('keydown', keyObj.key, keyObj.code, keyObj.codeNum));
    await sleep(holdMs);
    multiDispatch(makeKeyboardEvent('keyup', keyObj.key, keyObj.code, keyObj.codeNum));
  }

  async function runnerLoop() {
    while (running) {
      const keyObj = dirA ? { key: 'a', code: 'KeyA', codeNum: 65 } : { key: 'd', code: 'KeyD', codeNum: 68 };
      await pressAndHold(keyObj);
      dirA = !dirA; // instantly flip with no gap
    }
    updateOverlay();
  }

  document.addEventListener('keydown', (e) => {
    if (['INPUT','TEXTAREA'].includes((document.activeElement?.tagName) || '') || document.activeElement?.isContentEditable) return;

    if (e.key.toLowerCase() === 'f') {
      running = !running;
      if (running) runnerLoop();
      updateOverlay();
    }
    if (e.key === '+' || (e.key === '=' && e.shiftKey)) {
      holdMs = Math.max(minHold, holdMs - 1);
      updateOverlay();
    }
    if (e.key === '-') {
      holdMs = Math.min(maxHold, holdMs + 1);
      updateOverlay();
    }
  });

  console.log('[GB Move] MAX Jitter — F toggles, + / - tweaks speed');
})();
