// ==UserScript==
// @name         Sparx Sidebar History v2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Logs Sparx Q&As and injects a “History” link under Compulsory. Works across SPA navigation.
// @match        https://maths.sparx-learning.com/student/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548435/Sparx%20Sidebar%20History%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/548435/Sparx%20Sidebar%20History%20v2.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('✅ History Script Loaded');

  const STORAGE_KEY = 'sparxQuestionHistory';
  let originalMainHTML = null;

  // ————————————————————————————————
  // 1) Q&A LOGGER
  // ————————————————————————————————
  function logQA() {
    const qEl = document.querySelector('[data-test-id="question-text"]');
    const aEl = document.querySelector('input[data-test-id="answer-input"]');
    const rEl = document.querySelector('[data-test-id="result-indicator"]');
    if (!qEl || !aEl || !rEl) return;

    const entry = {
      timestamp: new Date().toLocaleString(),
      question:  qEl.textContent.trim(),
      answer:    aEl.value.trim(),
      correct:   /correct/i.test(rEl.textContent)
    };

    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const last    = history[history.length - 1];
    if (!last || last.question !== entry.question || last.answer !== entry.answer) {
      history.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      console.log('📝 Logged QA:', entry.question, entry.answer, entry.correct);
    }
  }

  const loggerObs = new MutationObserver(muts => {
    for (let m of muts) {
      for (let n of m.addedNodes) {
        if (n.nodeType === 1 && n.querySelector('[data-test-id="result-indicator"]')) {
          logQA();
        }
      }
    }
  });
  loggerObs.observe(document.body, { childList: true, subtree: true });

  // ————————————————————————————————
  // 2) SHOW / RESTORE MAIN CONTENT
  // ————————————————————————————————
  function showHistoryMain() {
    const main = document.querySelector('main');
    if (!main) return;
    if (originalMainHTML === null) originalMainHTML = main.innerHTML;
    main.innerHTML = '<h2 style="padding:16px">📘 Complete Question History</h2>';

    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!history.length) {
      main.innerHTML += '<p style="padding:0 16px">No questions logged yet.</p>';
      return;
    }
    history.forEach(e => {
      const d = document.createElement('div');
      d.style.borderBottom = '1px solid #ddd';
      d.style.margin      = '12px 16px';
      d.style.padding     = '8px 0';
      d.innerHTML = `
        <strong>${e.timestamp}</strong><br>
        <em>${e.question}</em><br>
        Answer: ${e.answer}<br>
        Result: ${e.correct ? '✅ Correct' : '❌ Incorrect'}
      `;
      main.appendChild(d);
    });
  }

  function restoreOriginalMain() {
    const main = document.querySelector('main');
    if (!main || originalMainHTML === null) return;
    main.innerHTML = originalMainHTML;
    originalMainHTML = null;
  }

  // ————————————————————————————————
  // 3) SIDEBAR INJECTION
  // ————————————————————————————————
  function injectHistoryLink() {
    // find all <a> whose text is “Compulsory”
    const compA = Array.from(document.querySelectorAll('a'))
      .find(a => a.textContent.trim() === 'Compulsory');
    if (!compA) {
      console.warn('⚠️ [History] Could not find Compulsory link yet.');
      return;
    }

    // prevent double-injection
    if (document.getElementById('sparx-history-link')) return;

    // clone its <li> if inside one, or just insert after <a>
    const parentLi = compA.closest('li');
    let container, referenceNode;
    if (parentLi) {
      container = parentLi.parentElement;
      referenceNode = parentLi.nextSibling;
    } else {
      container = compA.parentElement;
      referenceNode = compA.nextSibling;
    }

    const newLi = parentLi ? parentLi.cloneNode(false) : document.createElement('li');
    const newA  = document.createElement('a');

    newA.id          = 'sparx-history-link';
    newA.href        = '#';
    newA.textContent = 'History';
    newA.style.cursor = 'pointer';

    newA.addEventListener('click', e => {
      e.preventDefault();
      console.log('🔍 Showing History view');
      showHistoryMain();
      highlightActive(newA);
    });

    newLi.appendChild(newA);
    container.insertBefore(newLi, referenceNode);

    // restore original on any real nav click
    const navLinks = Array.from(container.querySelectorAll('a'))
      .filter(a => a.id !== 'sparx-history-link');
    navLinks.forEach(a => {
      a.addEventListener('click', () => {
        console.log('🔄 Restoring Sparx UI');
        restoreOriginalMain();
        highlightActive(a);
      });
    });

    console.log('✅ History link injected');
  }

  function highlightActive(el) {
    document.querySelectorAll('aside a').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
  }

  // ————————————————————————————————
  // 4) SPA NAV SUPPORT
  // ————————————————————————————————
  (function(orig) {
    window.history.pushState = function() {
      orig.apply(this, arguments);
      window.dispatchEvent(new Event('spa-nav'));
    };
  })(window.history.pushState.bind(window.history));

  window.addEventListener('popstate',  () => window.dispatchEvent(new Event('spa-nav')));
  window.addEventListener('spa-nav',  () => {
    console.log('🌐 SPA nav detected, reinjecting...');
    restoreOriginalMain();
    setTimeout(injectHistoryLink, 500);
  });

  // ————————————————————————————————
  // 5) INITIALIZE
  // ————————————————————————————————
  function init() {
    injectHistoryLink();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();