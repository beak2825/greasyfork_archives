// ==UserScript==
// @name         Coursepoint Question Hints
// @namespace    http://tampermonkey.net/
// @version      1.8
// @license      MIT
// @description  Display question rationales for Coursepoint quizzes while taking the quiz
// @author       beepbopboop
// @match        https://qp-examengine.hlrptech.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553604/Coursepoint%20Question%20Hints.user.js
// @updateURL https://update.greasyfork.org/scripts/553604/Coursepoint%20Question%20Hints.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*******************************
   * CONFIG
   *******************************/
  const URL_PATTERNS = ['qp-api'];
  const TOGGLE_KEY = { ctrlKey: true, shiftKey: true, key: 'H' };

  const urlRegexes = URL_PATTERNS.map(p => new RegExp(p));
  function matchesUrl(url) {
    try { return urlRegexes.some(r => r.test(url)); } catch { return false; }
  }

  function inject(fn) {
    const s = document.createElement('script');
    s.textContent = '(' + fn.toString() + ')();';
    (document.documentElement || document.head || document.body).appendChild(s);
    s.remove();
  }

  function pageInterceptor() {
    if (window.__api_inspector_installed) return;
    window.__api_inspector_installed = true;

    const urlPatterns = JSON.parse(localStorage.getItem('__api_inspector_patterns') || '[]');

    function matches(url) {
      return urlPatterns.some(p => new RegExp(p).test(url));
    }

    function emit(event) {
      window.dispatchEvent(new CustomEvent('apiInspectorEvent', { detail: event }));
    }

    // ---- fetch ----
    const _fetch = window.fetch;
    window.fetch = function (...args) {
      const input = args[0];
      let url = (typeof input === 'string') ? input : (input && input.url) || '';
      return _fetch.apply(this, args).then(response => {
        if (matches(url)) {
          const clone = response.clone();
          clone.json()
            .then(json => emit({ type: 'fetch', url, status: response.status, bodyType: 'json', body: json, timestamp: Date.now() }))
            .catch(() => {});
        }
        return response;
      });
    };

    // ---- XHR ----
    const XHR = window.XMLHttpRequest;
    function XMLHttpRequestProxy() {
      const xhr = new XHR();
      let requestUrl = null;
      xhr.open = function (m, u, ...rest) {
        requestUrl = u;
        return XHR.prototype.open.apply(xhr, [m, u, ...rest]);
      };
      xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4 && requestUrl && matches(requestUrl)) {
          try {
            const ct = xhr.getResponseHeader('content-type') || '';
            if (ct.includes('application/json')) {
              const json = JSON.parse(xhr.responseText);
              emit({ type: 'xhr', url: requestUrl, status: xhr.status, bodyType: 'json', body: json, timestamp: Date.now() });
            }
          } catch {}
        }
      });
      return xhr;
    }
    XMLHttpRequestProxy.prototype = XHR.prototype;
    window.XMLHttpRequest = XMLHttpRequestProxy;

    window.__apiInspector = {
      setPatterns(arr) { localStorage.setItem('__api_inspector_patterns', JSON.stringify(arr)); },
      getPatterns() { return JSON.parse(localStorage.getItem('__api_inspector_patterns') || '[]'); }
    };
  }

  localStorage.setItem('__api_inspector_patterns', JSON.stringify(URL_PATTERNS));
  inject(pageInterceptor);

  /*******************************
   * Overlay UI
   *******************************/
  const rootId = '__api_inspector_overlay_root';
  if (document.getElementById(rootId)) return;

  const root = document.createElement('div');
  root.id = rootId;
  document.documentElement.appendChild(root);

  const style = document.createElement('style');
  style.textContent = `
  #${rootId} {
    position: fixed;
    left: 12px;
    bottom: 12px;
    width: 420px;
    max-height: 70vh;
    z-index: 2147483647;
    font-family: Inter, Roboto, Arial, sans-serif;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  #${rootId} .ai-header {
    background: rgba(0,0,0,0.1);
    padding: 8px 10px;
    display: flex;
    justify-content:space-between;
    align-items:center;
  }
  #${rootId} .ai-header .title { font-weight:600; font-size:13px; }
  #${rootId} .ai-controls button {
    background: transparent; color: white; border: 1px solid rgba(255,255,255,0.12);
    padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;
  }
  #${rootId} .ai-list { background: #f7f7f8; overflow:auto; }
  #${rootId} .ai-item { padding:10px; border-bottom:1px solid #eee; font-size:12px; color:#111;}
  #${rootId} .ai-item .json { white-space:pre-wrap; font-size:12px; background: #fff; padding:8px; border-radius:6px; border:1px solid #eee; }
  `;
  document.head.appendChild(style);

  root.innerHTML = `
  <div class="ai-header">
    <span class="title">Question Hints — hide with Ctrl+Shift+H</span>
  </div>
  <div class="ai-list" id="ai-list"></div>
  `;

  const listEl = root.querySelector('#ai-list');
  // const hideBtn = root.querySelector('#ai-hide');
  let captures = [];
  let currentIndex = 0;

  function makeItem(event) {
    const item = document.createElement('div');
    item.className = 'ai-item';
    // const ts = new Date(event.timestamp || Date.now()).toLocaleString();
    // const meta = document.createElement('div');
    // meta.className = 'meta';
    // meta.textContent = ts;

    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'json';
    if ((event.body.join("\n\n") === 'N/A') || (event.body.join("\n\n") === 'NA')) {
      bodyWrap.textContent = 'No hint for this question';
    }
    else {
      bodyWrap.textContent = event.body.join("\n\n");
    }

    // item.appendChild(meta);
    item.appendChild(bodyWrap);
    return item;
  }

  function showCurrentCapture() {
    listEl.innerHTML = '';
    const current = captures[currentIndex];
    if (!current) return;
    const item = makeItem(current);
    listEl.appendChild(item);
  }

  function addCapture(event) {
    if (event.bodyType !== 'json' || !event.body || !Array.isArray(event.body.modelFeedback)) return;
    const feedbacks = event.body.modelFeedback.map(f => f.feedbackText).filter(Boolean);
    if (!feedbacks.length) return;

    const minimalEvent = { timestamp: event.timestamp, bodyType: 'feedback', body: feedbacks };
    captures.push(minimalEvent);

    // If it's the first capture, show it immediately
    if (captures.length === 1) {
      currentIndex = 0;
      showCurrentCapture();
    }
  }

  // hideBtn.addEventListener('click', () => { root.style.display = 'none'; });

  // Advance to next capture when "Next Question" button is clicked
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[aria-label="Next Question"]');
    if (btn) {
      if (currentIndex < captures.length - 1) {
        currentIndex++;
        showCurrentCapture();
      }
    }
  });

  window.addEventListener('apiInspectorEvent', (ev) => addCapture(ev.detail));

  // Keyboard toggle
  window.addEventListener('keydown', (ev) => {
    if (
      ev.ctrlKey === TOGGLE_KEY.ctrlKey &&
      ev.shiftKey === TOGGLE_KEY.shiftKey &&
      ev.key.toUpperCase() === TOGGLE_KEY.key.toUpperCase()
    ) {
      root.style.display =
        (root.style.display === 'none' || getComputedStyle(root).display === 'none')
          ? 'flex'
          : 'none';
    }
  });
})();
