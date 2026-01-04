// ==UserScript==
// @name         Recaptcha Solver — Debuggable (Draggable Overlay + Test)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Debuggable reCAPTCHA audio solver — overlay, ping/test servers, DOM dump, runs in recaptcha frames
// @author       you
// @match        https://www.google.com/recaptcha/api2/*
// @match        https://www.recaptcha.net/recaptcha/api2/*
// @match        *://*/recaptcha/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      engageub.pythonanywhere.com
// @connect      engageub1.pythonanywhere.com
// @downloadURL https://update.greasyfork.org/scripts/549619/Recaptcha%20Solver%20%E2%80%94%20Debuggable%20%28Draggable%20Overlay%20%2B%20Test%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549619/Recaptcha%20Solver%20%E2%80%94%20Debuggable%20%28Draggable%20Overlay%20%2B%20Test%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // CONFIG
  const MAX_ATTEMPTS = 6;
  const serversList = ["https://engageub.pythonanywhere.com","https://engageub1.pythonanywhere.com"];
  let latencyList = Array(serversList.length).fill(99999);
  let requestCount = 0;
  let waitingForAudioResponse = false;
  let audioUrl = "";
  const recaptchaLanguage = document.documentElement?.lang || 'en-US';

  // SELECTOR CANDIDATES (проверяем несколько вариантов)
  const CHECKBOX_CANDS = ['.recaptcha-checkbox-border', '#recaptcha-anchor', '.recaptcha-checkbox-checkmark'];
  const AUDIO_BUTTON_CANDS = ['#recaptcha-audio-button', '.rc-audiochallenge-playing .rc-button', '.rc-audiochallenge-tdownload-link'];
  const AUDIO_SOURCE_CANDS = ['#audio-source', 'audio[src]', 'audio > source', '.rc-audiochallenge-tdownload-link a'];
  const AUDIO_RESPONSE_CANDS = ['#audio-response', '.rc-audiochallenge-response-field', 'input[name="audio-response"]'];
  const RELOAD_BUTTON_CANDS = ['#recaptcha-reload-button', '.rc-audiochallenge-tdreload-link', 'button[aria-label="Reload"]'];
  const VERIFY_BUTTON_CANDS = ['#recaptcha-verify-button', 'button#recaptcha-verify-button', 'button[aria-label="Verify"]'];
  const RECAPTCHA_STATUS = '#recaptcha-accessible-status';
  const DOSCAPTCHA = '.rc-doscaptcha-body';

  // UTILS
  const q = s => document.querySelector(s);
  function findFirst(list) {
    for (const s of list) {
      const el = document.querySelector(s);
      if (el) return el;
    }
    return null;
  }
  function now() { return (new Date()).toLocaleTimeString(); }
  function addConsole(msg) { console.log(`[RecaptchaSolver:${now()}] ${msg}`); }

  // OVERLAY (draggable + buttons)
  const overlayPosDefault = { left: (window.innerWidth - 340) + 'px', top: (window.innerHeight - 200) + 'px' };
  const storedPos = GM_getValue('overlayPos', overlayPosDefault);
  const collapsed = GM_getValue('overlayCollapsed', false);
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed; left:${storedPos.left}; top:${storedPos.top}; width:340px; z-index:2147483647; font:12px monospace;`;
  overlay.id = 'recaptcha-solver-overlay';
  overlay.innerHTML = `
    <div id="rs-header" style="background:#222;color:#fff;padding:6px;cursor:move;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-weight:700">Recaptcha Solver (debug)</div>
      <div>
        <button id="rs-toggle" style="margin-right:6px"> ${collapsed ? '▸' : '▾'} </button>
        <button id="rs-ping" title="Ping servers">Ping</button>
        <button id="rs-test" title="Send current audio to server">Test</button>
        <button id="rs-dump" title="Dump DOM selectors">Dump</button>
      </div>
    </div>
    <div id="rs-body" style="background:#000;color:#0f0;padding:8px;height:180px;overflow:auto;display:${collapsed ? 'none' : 'block'};">
      <div id="rs-log"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  const header = document.getElementById('rs-header');
  const bodyBox = document.getElementById('rs-body');
  const logBox = document.getElementById('rs-log');
  function log(message) {
    const line = document.createElement('div');
    line.innerHTML = `[${now()}] ${message}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
    addConsole(message);
  }

  // Dragging
  (function makeDraggable() {
    let isDown = false, startX=0, startY=0, startLeft=0, startTop=0;
    header.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.clientX; startY = e.clientY;
      const rect = overlay.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!isDown) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      overlay.style.left = (startLeft + dx) + 'px';
      overlay.style.top = (startTop + dy) + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      GM_setValue('overlayPos', { left: overlay.style.left, top: overlay.style.top });
    });
  })();

  // Toggle collapse
  document.getElementById('rs-toggle').addEventListener('click', () => {
    const btn = document.getElementById('rs-toggle');
    const isHidden = bodyBox.style.display === 'none';
    bodyBox.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? '▾' : '▸';
    GM_setValue('overlayCollapsed', !isHidden);
  });

  // Helper: ping server (show responseText and latency)
  async function pingServer(index) {
    const url = serversList[index];
    log(`Pinging ${url} ...`);
    const start = Date.now();
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      timeout: 8000,
      onload: function (r) {
        const ms = Date.now() - start;
        latencyList[index] = ms;
        log(`Ping ${url} → status ${r.status}, text: "${(r.responseText||'').slice(0,200)}", latency ${ms}ms`);
      },
      onerror: function (e) { log(`Ping error ${url} → ${String(e)}`); },
      ontimeout: function () { log(`Ping timeout ${url}`); }
    });
  }

  // Button handlers
  document.getElementById('rs-ping').addEventListener('click', () => {
    for (let i=0; i<serversList.length; i++) pingServer(i);
  });

  document.getElementById('rs-dump').addEventListener('click', () => {
    dumpSelectors();
  });

  document.getElementById('rs-test').addEventListener('click', () => {
    const src = discoverAudioSrc();
    if (!src) { log('No audio-src found to test. Open audio challenge first.'); return; }
    log(`Testing servers with audio: ${src}`);
    testServersWithAudio(src);
  });

  // DISCOVERY helpers
  function discoverAudioSrc() {
    // try many variants
    for (const sel of AUDIO_SOURCE_CANDS) {
      const el = document.querySelector(sel);
      if (!el) continue;
      // if <source> inside <audio>
      if (el.tagName && el.tagName.toLowerCase() === 'source' && el.src) return el.src;
      if (el.tagName && el.tagName.toLowerCase() === 'audio' && el.src) return el.src;
      // link
      if (el.href) return el.href;
      // if audio element has nested source
      const nested = el.querySelector && el.querySelector('source');
      if (nested && nested.src) return nested.src;
    }
    // fallback: search any audio element
    const aud = document.querySelector('audio');
    if (aud && aud.src) return aud.src;
    const s = document.querySelector('audio source');
    if (s && s.src) return s.src;
    return null;
  }

  function dumpSelectors() {
    log('=== DUMP SELECTORS START ===');
    log('Current URL: ' + window.location.href);
    log('Document title: ' + document.title);
    for (const s of ['#recaptcha-anchor', '.recaptcha-checkbox-border', '#recaptcha-accessible-status']) {
      log(`${s} → ${document.querySelector(s) ? 'FOUND' : 'missing'}`);
    }
    const src = discoverAudioSrc();
    log('audio-src: ' + (src || 'not found'));
    log('audio-response input present?: ' + (findFirst(AUDIO_RESPONSE_CANDS) ? 'yes' : 'no'));
    log('reload button?: ' + (findFirst(RELOAD_BUTTON_CANDS) ? 'yes' : 'no'));
    log('verify button?: ' + (findFirst(VERIFY_BUTTON_CANDS) ? 'yes' : 'no'));
    log('doscapcha text?: ' + (document.querySelector(DOSCAPTCHA) ? document.querySelector(DOSCAPTCHA).innerText.slice(0,120) : 'no'));
    log('=== DUMP SELECTORS END ===');
  }

  // choose fastest server (or fallback)
  function chooseServer() {
    let idx = 0;
    try {
      idx = latencyList.indexOf(Math.min(...latencyList));
      if (!isFinite(latencyList[idx]) || latencyList[idx] > 90000) idx = 0;
    } catch(e) { idx = 0; }
    return { url: serversList[idx], idx };
  }

  // send audio url to server(s) sequentially until valid response
  function testServersWithAudio(audioSrc) {
    let tried = 0;
    function tryIndex(i) {
      if (i >= serversList.length) { log('All servers tried — no valid response.'); return; }
      const url = serversList[i];
      log(`POST -> ${url} (audio=${audioSrc.slice(0,80)}...)`);
      GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {"Content-Type":"application/x-www-form-urlencoded"},
        data: `input=${encodeURIComponent(audioSrc)}&lang=${encodeURIComponent(recaptchaLanguage)}`,
        timeout: 60000,
        onload: function(r) {
          log(`Server ${url} responded (status ${r.status}): "${(r.responseText||'').slice(0,300)}"`);
          const t = (r.responseText||'').trim();
          if (t && t !== '0' && !t.includes('<') && t.length >= 1 && t.length <= 200) {
            log(`Using server ${url} result: "${t}" → will attempt to insert into response field.`);
            const inp = findFirst(AUDIO_RESPONSE_CANDS);
            const verify = findFirst(VERIFY_BUTTON_CANDS);
            if (inp) {
              inp.value = t;
              inp.dispatchEvent(new Event('input',{bubbles:true}));
              log('Inserted result into input field.');
              if (verify) { verify.click(); log('Clicked verify.'); }
            } else {
              log('No audio-response input found on page to insert value into.');
            }
          } else {
            log(`Invalid/empty result from ${url}: "${t}" — trying next server...`);
            tryIndex(i+1);
          }
        },
        onerror: function(e){ log(`Request error to ${url}: ${String(e)}`); tryIndex(i+1); },
        ontimeout: function(){ log(`Timeout to ${url}`); tryIndex(i+1); }
      });
    }
    tryIndex(0);
  }

  // main interval: try to click checkbox / open audio / send
  const mainInterval = setInterval(() => {
    try {
      // If recaptcha status shows changed → solved -> stop
      const statusEl = document.querySelector(RECAPTCHA_STATUS);
      if (statusEl && statusEl.innerText && statusEl.innerText.trim().length > 0) {
        // note: this may change text; we just log
        log('Recaptcha status text: ' + statusEl.innerText.slice(0,120));
      }

      // if automated-queries shown -> stop
      const dos = document.querySelector(DOSCAPTCHA);
      if (dos && dos.innerText && dos.innerText.length > 3) {
        log('Detected automated-queries / dos message: ' + dos.innerText.slice(0,120));
        clearInterval(mainInterval);
        return;
      }

      // Attempt to click checkbox (must run IN the recaptcha iframe)
      const cb = findFirst(CHECKBOX_CANDS);
      if (cb && cb.offsetParent !== null) {
        log('Checkbox element found — clicking it.');
        cb.click();
      }

      // If audio button is present — click it to open audio challenge
      const audioBtn = findFirst(AUDIO_BUTTON_CANDS);
      if (audioBtn && audioBtn.offsetParent !== null) {
        log('Audio-button found — clicking it.');
        try { audioBtn.click(); } catch(e) { log('Click audio button failed: ' + e.message); }
      }

      // After audio opened, find audio src
      const src = discoverAudioSrc();
      if (src && src !== audioUrl && !waitingForAudioResponse) {
        audioUrl = src;
        log('Found new audio src: ' + audioUrl.slice(0,100));
        waitingForAudioResponse = true;
        requestCount = 0;
        // choose server by latency first
        const {url, idx} = chooseServer();
        log(`Selected server ${url} (idx ${idx}) — sending audio`);
        // try servers sequentially
        testServersWithAudio(audioUrl);
        waitingForAudioResponse = false;
      }

    } catch (err) {
      log('Main loop exception: ' + err.message);
      clearInterval(mainInterval);
    }
  }, 1500);

  // initial auto-ping
  for (let i = 0; i < serversList.length; i++) {
    pingServer(i);
  }

  // initial dump for debugging
  setTimeout(() => dumpSelectors(), 800);

  // small helper to instruct user
  log('Script loaded. Если не работает — нажми "Ping" и "Test" чтобы увидеть ответы серверов и dump DOM.');
  log('Важно: скрипт должен выполняться в recaptcha iframe (https://www.google.com/recaptcha/api2/*).');

})();
