// ==UserScript==
// @name         Free.in on
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Faucet automation with debug panel, Turnstile timeout, loop and popup auto-dismiss
// @author       xandreoc
// @match        https://freeshib.in/faucet*
// @match        https://freebnb.in/faucet*
// @match        https://freetoncoin.in/faucet*
// @match        https://freetron.in/faucet*
// @match        https://freesui.in/faucet*
// @match        https://freexrp.in/faucet*
// @match        https://usdpick.io/faucet*
// @match        https://freetrump.in/faucet*
// @match        https://freearb.in/faucet*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551088/Freein%20on.user.js
// @updateURL https://update.greasyfork.org/scripts/551088/Freein%20on.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 📌 Painel de debug
  const debugPanel = document.createElement('div');
  debugPanel.style.position = 'fixed';
  debugPanel.style.bottom = '10px';
  debugPanel.style.right = '10px';
  debugPanel.style.width = '300px';
  debugPanel.style.maxHeight = '200px';
  debugPanel.style.overflowY = 'auto';
  debugPanel.style.background = 'rgba(0,0,0,0.85)';
  debugPanel.style.color = '#0f0';
  debugPanel.style.fontSize = '12px';
  debugPanel.style.fontFamily = 'monospace';
  debugPanel.style.padding = '5px';
  debugPanel.style.border = '1px solid #0f0';
  debugPanel.style.borderRadius = '6px';
  debugPanel.style.zIndex = '99999';
  debugPanel.style.cursor = 'move';
  debugPanel.innerHTML = '<b>Debug Panel</b><hr style="border:0;border-top:1px solid #0f0;margin:4px 0;">';
  document.body.appendChild(debugPanel);

  // Permite arrastar o painel
  let isDragging = false, offsetX, offsetY;
  debugPanel.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - debugPanel.getBoundingClientRect().left;
    offsetY = e.clientY - debugPanel.getBoundingClientRect().top;
  });
  document.addEventListener('mouseup', () => isDragging = false);
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      debugPanel.style.left = (e.clientX - offsetX) + 'px';
      debugPanel.style.top = (e.clientY - offsetY) + 'px';
      debugPanel.style.bottom = 'auto';
      debugPanel.style.right = 'auto';
    }
  });

  // Função para logar no painel e no console
  function debugLog(msg) {
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    debugPanel.appendChild(line);
    debugPanel.scrollTop = debugPanel.scrollHeight;
    console.log(msg);
  }

  const FLOW = [
    'https://freeshib.in/faucet',
    'https://freebnb.in/faucet',
    'https://freetoncoin.in/faucet',
    'https://freetron.in/faucet',
    'https://freesui.in/faucet',
    'https://freexrp.in/faucet',
    'https://usdpick.io/faucet',
    'https://freetrump.in/faucet',
    'https://freearb.in/faucet'
  ];

  const PAGE_LOAD_DELAY = 5000;
  const CLAIM_DELAY_AFTER_SOLVE = 2000;
  const RELOAD_DELAY = 15000;
  const CHECK_INTERVAL = 2000;
  const WAIT_IF_TIMER_PRESENT = 60000;
  const TURNSTILE_TIMEOUT = 30000; // ⏳ 30s para resolver captcha

  let claimClicked = false;
  let skipWaiting = false;

  const currentURL = window.location.href.split('?')[0];
  debugLog('⏳ Script starting...');

  setTimeout(() => {
    if (!FLOW.includes(currentURL)) {
      debugLog('❓ Página desconhecida. Redirecionando para o primeiro faucet.');
      window.location.href = FLOW[0];
      return;
    }

    const timerText = document.body.innerText || '';
    if (timerText.includes('Please wait until the clock stops.')) {
      debugLog('⏳ "Please wait until the clock stops." detectado. Aguardando 60s...');
      if (!skipWaiting) {
        skipWaiting = true;
        setTimeout(() => {
          debugLog('⏭️ Tempo esgotado. Indo para o próximo faucet.');
          moveToNext();
        }, WAIT_IF_TIMER_PRESENT);
      }
      return;
    }

    if (!isTurnstileSolved()) {
      debugLog('❌ Turnstile não resolvido. Aguardando... (30s timeout)');
      let solved = false;

      // Timeout de 30s para resolver
      const timeout = setTimeout(() => {
        if (!solved) {
          debugLog('⏭️ Turnstile não resolvido em 30s. Pulando para o próximo faucet.');
          moveToNext();
        }
      }, TURNSTILE_TIMEOUT);

      waitUntilTurnstileSolved(() => {
        solved = true;
        clearTimeout(timeout);
        debugLog('✅ Turnstile resolvido. Aguardando 2s antes de clicar em claim...');
        setTimeout(() => {
          waitForClaimButtonAndClick(() => {
            moveToNext();
          });
        }, CLAIM_DELAY_AFTER_SOLVE);
      });
      return;
    }

    waitForClaimButtonAndClick(() => {
      moveToNext();
    });

  }, PAGE_LOAD_DELAY);

  function isTurnstileSolved() {
    const input = document.querySelector('input[name="cf-turnstile-response"]');
    return input && input.value && input.value.trim().length > 0;
  }

  function waitUntilTurnstileSolved(callback) {
    if (isTurnstileSolved()) {
      callback();
    } else {
      setTimeout(() => waitUntilTurnstileSolved(callback), CHECK_INTERVAL);
    }
  }

  function findClaimButton() {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (
        btn.textContent.trim().toLowerCase() === 'reivindicar' &&
        !btn.disabled &&
        btn.offsetParent !== null
      ) {
        return btn;
      }
    }
    return null;
  }

  function waitForClaimButtonAndClick(callback) {
    if (claimClicked) return;
    const btn = findClaimButton();

    if (btn) {
      if (!btn.disabled) {
        debugLog('🚀 Clicando no botão Claim...');
        claimClicked = true;
        btn.click();
        setTimeout(callback, RELOAD_DELAY);
      } else {
        debugLog('⏳ Botão Claim encontrado mas desabilitado. Aguardando...');
        setTimeout(() => waitForClaimButtonAndClick(callback), CHECK_INTERVAL);
      }
    } else {
      debugLog('⏳ Aguardando o botão Claim aparecer...');
      setTimeout(() => waitForClaimButtonAndClick(callback), CHECK_INTERVAL);
    }
  }

  function getNextTarget(current) {
    const idx = FLOW.indexOf(current);
    return idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : FLOW[0]; // 🔄 volta ao primeiro sem Yahoo
  }

  function moveToNext() {
    const nextTarget = getNextTarget(currentURL);
    if (nextTarget) {
      debugLog(`➡️ Redirecionando para o próximo faucet: ${nextTarget}`);
      window.location.href = nextTarget;
    }
  }

  // 🛑 Auto clique no botão "Dispensar"
  function autoDismissPopup() {
    const dismissBtn = [...document.querySelectorAll("button")]
      .find(b => b.textContent.trim().toLowerCase() === "dispensar");
    if (dismissBtn) {
      debugLog('🛑 Popup detectado. Clicando em "Dispensar"...');
      dismissBtn.click();
      return true;
    }
    return false;
  }

  // 🔁 Verificar popups a cada 2s
  setInterval(autoDismissPopup, 2000);

})();
