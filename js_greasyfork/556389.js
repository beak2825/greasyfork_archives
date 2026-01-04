// ==UserScript==
// @name         Sparx Solve (Gemini v1beta) - v14.56 (Custom Alert & Apple-Notes Style + Floating Cards)
// @namespace    http://tampermonkey.net/
// @version      14.56
// @description  Adds a History UI, fixes layout shifts when toggling panels, Apple-Notes-like visual improvements, animations, tilted floating cards for API & History, and a custom non-blocking alert system. Waits for SUCCESS mutation to log Bookwork Code and the correct answer from the HTML.
// @author       brehdd (patched)
// @match        *://*.sparx-learning.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556389/Sparx%20Solve%20%28Gemini%20v1beta%29%20-%20v1456%20%28Custom%20Alert%20%20Apple-Notes%20Style%20%2B%20Floating%20Cards%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556389/Sparx%20Solve%20%28Gemini%20v1beta%29%20-%20v1456%20%28Custom%20Alert%20%20Apple-Notes%20Style%20%2B%20Floating%20Cards%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Configuration & Constants ---
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const IMAGE_MIME_TYPE = 'image/png';
  const BOOKWORK_CODE_KEY = 'sparxSavedBookworkCodes';
  const QUESTION_WRAPPER_SELECTOR = '._QuestionWrapper_ypayp_46';
  const BOOKWORK_CODE_CHIP_SELECTOR = 'div[class*="_Chip_"][class*="_Selected_"]';
  const ANSWER_INPUT_SELECTORS = [
    'input[type="text"][value]:not([value=""])',
    'input[type="number"][value]:not([value=""])',
    'textarea:not([value=""]):not(:empty)',
    '._AnswerContainer_ypayp_1 input:not([value=""])',
    '._AnswerContainer_ypayp_1 ._Input_s208e_1',
    '._AnswerCorrect_ypayp_1 ._AnswerText_ypayp_1',
    '._AnswerIncorrect_ypayp_1 ._AnswerText_ypayp_1',
    '._CardContentSelected_vniiy_1006'
  ];

  // --- Global UI State Variables ---
  let container;
  let solverBarWrapper, progressBar, timerRect, answerLabel, explanationPanel, explanationToggleBtn, explanationContent, hoverOverlayText;
  let apiButton, apiKeyPanel, apiKeyInput, apiOkButton;
  let historyButton, historyView, historyContent, clearHistoryBtn;
  let customAlert;
  let dimOverlay;
  let stripeInterval = null;
  let isSolving = false;
  let explanationOpen = false;
  let historyOpen = false;
  let apiPanelOpen = false;
  let answerFinalText = '';
  let resizeObserver = null;
  let questionRemovalObserver = null;
  let answerCompletionObserver = null;
  let isAnswerSaved = false;
  let clearHistoryConfirmationTimer = null;

  // ------------------------------------
  // I. Asset Loading & Initialization
  // ------------------------------------

  function loadAssets() {
    // 1. Load Inter font (Main UI Font)
    if (!document.getElementById('sparx-inter-font')) {
      const fontLink = document.createElement('link');
      fontLink.id = 'sparx-inter-font';
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap';
      document.head.appendChild(fontLink);
    }

    // 2. Load SF Mono font (Timer UI Font)
    if (!document.getElementById('sparx-sfmono-font')) {
      const sfMonoLink = document.createElement('link');
      sfMonoLink.id = 'sparx-sfmono-font';
      sfMonoLink.rel = 'stylesheet';
      sfMonoLink.href = 'https://cdn.jsdelivr.net/npm/sf-mono-webfont@1.0.0/stylesheet.min.css';
      document.head.appendChild(sfMonoLink);
    }

    // 3. Load KaTeX CSS and JS (Needed for rendering the detailed explanation)
    if (!document.getElementById('sparx-katex-css')) {
      const katexCSS = document.createElement('link');
      katexCSS.id = 'sparx-katex-css';
      katexCSS.rel = 'stylesheet';
      katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      const katexJS = document.createElement('script');
      katexJS.id = 'sparx-katex-js';
      katexJS.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      katexJS.defer = true;
      document.head.appendChild(katexCSS);
      document.head.appendChild(katexJS);
    }
  }

  // ------------------------------------
  // II. Utility & State Functions
  // ------------------------------------

  function getApiKey() { return localStorage.getItem('sparxSolverApiKey'); }
  function setApiKey(key) { localStorage.setItem('sparxSolverApiKey', key); }

  function getSavedCodes() {
    try {
      return JSON.parse(localStorage.getItem(BOOKWORK_CODE_KEY)) || [];
    } catch (e) {
      console.error('Error reading saved codes:', e);
      return [];
    }
  }

  function getBookworkCode() {
    const chip = document.querySelector(BOOKWORK_CODE_CHIP_SELECTOR);
    if (chip) {
      const text = chip.textContent.trim();
      const match = text.match(/(?:Bookwork code|Bookwork):\s*([A-Z0-9]+)/i);
      if (match) return match[1].toUpperCase();
    }
    const url = window.location.href;
    const match = url.match(/bookworkCode=([^&]+)/i);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return 'N/A';
  }

  function getSiteExpectedAnswer() {
    for (const selector of ANSWER_INPUT_SELECTORS) {
      const el = document.querySelector(selector);
      if (el) {
        let value = '';
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          value = el.value.trim();
        } else {
          value = el.textContent.trim();
        }

        if (value.length > 0) {
          if (el.closest && el.closest('._AnswerCorrect_ypayp_1')) {
            return 'Correct: ' + value;
          } else if (el.closest && el.closest('._AnswerIncorrect_ypayp_1')) {
            return 'Incorrect: ' + value;
          }
          if (el.classList && el.classList.contains('_CardContentSelected_vniiy_1006')) {
            return value;
          }
          return value;
        }
      }
    }
    return 'N/A';
  }

  function saveBookworkCode(code, questionText, siteAnswer) {
    if (!code || code === 'N/A' || !siteAnswer || siteAnswer === 'N/A') return;
    code = code.toUpperCase();
    const codes = getSavedCodes();
    const existingIndex = codes.findIndex(item => item.code === code);

    if (existingIndex === -1) {
      codes.push({
        code: code,
        question: questionText.substring(0, 150) + (questionText.length > 150 ? '...' : ''),
        siteAnswer: siteAnswer,
        timestamp: new Date().toISOString(),
      });
      console.log(`Sparx Solver: Saved NEW bookwork code ${code} with answer: ${siteAnswer}`);
    } else if (codes[existingIndex].siteAnswer === 'N/A' && siteAnswer !== 'N/A') {
      codes[existingIndex].siteAnswer = siteAnswer;
      console.log(`Sparx Solver: UPDATED site answer for existing code ${code} to: ${siteAnswer}`);
    } else {
      return;
    }

    localStorage.setItem(BOOKWORK_CODE_KEY, JSON.stringify(codes));
    isAnswerSaved = true;
  }

  function clearAllBookworkCodes() {
    localStorage.removeItem(BOOKWORK_CODE_KEY);
    console.log('[ACT] All Bookwork Code history cleared.');
    if (historyOpen) {
      renderHistory();
    }
  }

  function urlToBase64(url, mime) {
    return new Promise((resolve, reject) => {
      if (!url) return reject(new Error('URL is empty'));
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        onload: (response) => {
          try {
            if (response.status !== 200) {
              return reject(new Error(`API ${response.status}: Failed to fetch image.`));
            }
            const base64 = btoa(
              new Uint8Array(response.response).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            resolve(base64);
          } catch (e) {
            reject(e);
          }
        },
        onerror: (error) => {
          reject(new Error(`Network error: ${error.statusText || 'unknown'}`));
        },
      });
    });
  }

  // ------------------------------------
  // III. KaTeX & Formatting
  // ------------------------------------

  function katexReady() {
    return !!(window.katex && typeof window.katex.render === 'function');
  }

  function renderKaTeXInto(element, latex, maxTries = 12) {
    if (!element) return;
    const cleaned = (latex || '').toString().trim();
    let triesLeft = maxTries;

    function attempt() {
      if (katexReady()) {
        try {
          element.innerHTML = '';
          window.katex.render(cleaned, element, { throwOnError: false, displayMode: false });
        } catch (e) {
          element.textContent = cleaned;
        }
      } else if (triesLeft > 0) {
        triesLeft--;
        setTimeout(attempt, 150);
      } else {
        element.textContent = cleaned;
      }
    }
    attempt();
  }

  function cleanKaTeXString(text, stripDelimiters = false) {
    if (!text) return '';
    let cleaned = text.toString();

    cleaned = cleaned.replace(/\\sqrt\[3\]\{([^}]+)\}/g, '³√($1)');
    cleaned = cleaned.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    cleaned = cleaned.replace(/\\times/g, '×');
    cleaned = cleaned.replace(/\\div/g, '÷');
    cleaned = cleaned.replace(/\\pounds/g, '£');
    cleaned = cleaned.replace(/\\\$/g, '$');
    cleaned = cleaned.replace(/\\euro|\\EUR/g, '€');
    cleaned = cleaned.replace(/\/pounds'([^']+)'\'/g, '£$1');
    cleaned = cleaned.replace(/\\frac\{([^}]+?)\}\{([^}]+?)\}/g, '($1)/($2)');
    cleaned = cleaned.replace(/\\boxed\{([^}]+)\}/g, '$1');
    cleaned = cleaned.replace(/\\text\{(.+?)\}/gs, '$1');
    cleaned = cleaned.replace(
      /\\(?!times|div|frac|sqrt|text|boxed|sqrt\[3\]|text|left|right|cdot|pi|alpha|beta|gamma|pounds|euro|EUR|\$)(?:[a-z]+|.)/gi,
      ''
    );
    cleaned = cleaned.replace(/\^\{([^}]+)\}/g, '^$1');
    cleaned = cleaned.replace(/_\{([^}]+)\}/g, '_$1');
    cleaned = cleaned.replace(/\{\{([^}]+)\}\}/g, '$1');
    cleaned = cleaned.replace(/\\left\(|\\right\)|\\left\[|\\right\]|\(|\)/g, '');
    cleaned = cleaned.replace(/\*\*([^\*]+?)\*\*/g, '<b>$1</b>');
    cleaned = cleaned.replace(/\*([^\*]+?)\*/g, '<b>$1</b>');
    cleaned = cleaned.replace(/^(#+\s*)(.*)$/gm, '<b>$2</b>');
    if (stripDelimiters) {
      cleaned = cleaned.replace(/\$/g, '');
      cleaned = cleaned.replace(/\$\$/g, '');
    }
    cleaned = cleaned.trim().replace(/\.$/, '');
    return cleaned;
  }

  function parseFinalAndExplanation(responseText) {
    if (!responseText) return { final: 'not found', explanation: '' };
    const lines = responseText.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
    let final = 'not found';
    let explanation = responseText;
    let finalAnswerLine = null;

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      let match = lastLine.match(/Final\s*Answer:\s*(.+)/i);

      if (match) {
        final = match[1].trim();
        finalAnswerLine = lastLine;
        explanation = lines.slice(0, -1).join('\n').trim();
      } else if (lines.length >= 2) {
        const secondToLastLine = lines[lines.length - 2];
        match = secondToLastLine.match(/Final\s*Answer:\s*(.+)/i);

        if (match) {
          final = match[1].trim();
          finalAnswerLine = secondToLastLine;
          explanation = responseText.replace(finalAnswerLine, '').trim();
        } else {
          final = cleanKaTeXString(lastLine, true);
          explanation = responseText.replace(lastLine, '').trim();
        }
      } else {
        final = cleanKaTeXString(lastLine, true);
        explanation = '';
      }
    }

    if (final !== 'not found') {
      final = final.replace(/^(the\s*final\s*answer\s*is|the\s*answer\s*is|answer\s*is)\s*[:\s]*/i, '').trim();
    }

    return { final, explanation: explanation || responseText };
  }

  // ------------------------------------
  // IV. UI Creation & Management (Apple Notes style + floating cards)
  // ------------------------------------

  function showCustomAlert(message) {
    if (!customAlert) return;
    const content = customAlert.querySelector('#customAlertContent');
    content.textContent = message;
    customAlert.style.opacity = '1';
    customAlert.style.transform = 'translateX(-50%) translateY(0)';
    customAlert.style.display = 'flex';
    clearTimeout(customAlert.timer);
    customAlert.timer = setTimeout(() => {
      customAlert.style.opacity = '0';
      customAlert.style.transform = 'translateX(-50%) translateY(-10px)';
      setTimeout(() => {
        if (customAlert) customAlert.style.display = 'none';
      }, 250);
    }, 3800);
  }

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
    /* Apple-Notes inspired visual language: frosted glass, soft shadows, rounded corners */

    #sparxSolver_container {
      position: fixed;
      top: 56px;
      right: 28px;
      width: 620px;
      padding: 20px;
      background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,250,250,0.8));
      border-radius: 22px;
      backdrop-filter: blur(8px) saturate(1.05);
      -webkit-backdrop-filter: blur(8px) saturate(1.05);
      box-shadow: 0 18px 40px rgba(14,18,24,0.12), inset 0 1px 0 rgba(255,255,255,0.6);
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
      z-index: 999999;
      transition: opacity 320ms cubic-bezier(.2,.9,.2,1), transform 300ms cubic-bezier(.2,.9,.2,1);
      opacity: 0;
      min-height: 104px;
      max-height: 86vh;
      display: none;
      transform-origin: top right;
      border: 1px solid rgba(0,0,0,0.04);
    }

    /* Subtle floating entrance */
    #sparxSolver_container.enter {
      transform: translateY(-6px) scale(1.002);
    }

    /* Solver View Wrapper */
    #solver_view {
      display: flex;
      flex-direction: column;
      transition: opacity 220ms ease, transform 240ms ease;
      opacity: 1;
      pointer-events: auto;
    }

    /* History View Wrapper (will become floating card) */
    #history_view.sparx-floating-card {
      display: block !important;
      box-sizing: border-box;
      width: 420px;
      max-width: 94vw;
      padding: 18px;
      border-radius: 18px;
      background: linear-gradient(180deg,#fff9d6,#fff6c7);
      box-shadow: 0 26px 60px rgba(0,0,0,0.26), 0 10px 30px rgba(0,0,0,0.14);
      position: fixed;
      transform-origin: center;
      z-index: 1000002;
      border: 1px solid rgba(0,0,0,0.06);
      opacity: 0;
      pointer-events: none;
      transition: transform 520ms cubic-bezier(.2,1,.22,1), opacity 320ms ease;
      backface-visibility: hidden;
    }

    /* API Key Panel as floating card */
    #apiKeyPanel.sparx-floating-card {
      display: block !important;
      box-sizing: border-box;
      width: 420px;
      max-width: 94vw;
      padding: 18px;
      border-radius: 18px;
      background: linear-gradient(180deg,#fff9d6,#fff6c7);
      box-shadow: 0 26px 60px rgba(0,0,0,0.26), 0 10px 30px rgba(0,0,0,0.14);
      position: fixed;
      transform-origin: center;
      z-index: 1000002;
      border: 1px solid rgba(0,0,0,0.06);
      opacity: 0;
      pointer-events: none;
      transition: transform 520ms cubic-bezier(.2,1,.22,1), opacity 320ms ease;
      backface-visibility: hidden;
    }

    /* Open/close states */
    .sparx-floating-card.open {
      opacity: 1 !important;
      pointer-events: auto !important;
      transform: translate3d(-50%, -12px, 0) rotate(-6deg) scale(1);
    }
    .sparx-floating-card.entering {
      opacity: 1 !important;
      pointer-events: auto !important;
      transform: translate3d(-50%, -18px, 0) rotate(-6deg) scale(1.01);
      transition: transform 420ms cubic-bezier(.2,1,.22,1), opacity 260ms ease;
    }
    .sparx-floating-card.closing {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translate3d(-50%, 12px, 0) rotate(3deg) scale(.96) !important;
    }

    /* Dim overlay */
    #sparxDimOverlay {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.28);
      backdrop-filter: blur(2px);
      z-index: 1000000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 240ms ease;
    }
    #sparxDimOverlay.visible {
      opacity: 1;
      pointer-events: auto;
    }

    /* Small card details */
    .sparx-floating-card h2 { margin: 0 0 10px 0; font-size: 18px; color: #222; }
    .sparx-floating-card .close-btn {
      position: absolute; right: 12px; top: 10px; background: transparent; border: none; cursor: pointer;
      font-weight: 700; font-size: 13px;
    }

    /* Progress Bar Wrapper */
    .sparx-progress-wrapper {
      display: flex;
      align-items: center;
      height: 60px;
      position: relative;
      gap: 12px;
    }

    /* Progress Bar (Main Answer Display) */
    .sparx-progress-bar {
      flex: 1;
      height: 100%;
      min-width: 420px;
      border-radius: 18px;
      background: repeating-linear-gradient(45deg, #e9e9eb 0, #e9e9eb 8px, #f3f3f5 8px, #f3f3f5 16px);
      overflow: hidden;
      position: relative;
      transition: all 320ms cubic-bezier(.2,.9,.2,1), filter 220ms;
      cursor: pointer;
      user-select: none;
      box-shadow: inset 0 -4px 18px rgba(0,0,0,0.03);
    }

    .sparx-progress-bar.processing {
      /* subtle animated sheen when processing */
      background-size: 200% 200%;
      animation: sheen 2.2s linear infinite;
    }

    @keyframes sheen {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }

    .sparx-progress-bar.solved {
      transition: background 420ms cubic-bezier(.2,.9,.2,1), transform 260ms;
      transform-origin: center;
    }
    .sparx-progress-bar.solved:hover { transform: translateY(-3px) scale(1.002); }

    /* Timer Rectangle */
    .sparx-timer-rect {
      position: absolute; left: 0; top: 0; height: 100%;
      width: 78px; color: rgba(255,255,255,0.95);
      display: flex; align-items: center; justify-content: center;
      font-family: 'SF Mono', monospace; font-weight: 600;
      border-radius: 18px 0 0 18px; transition: all 220ms ease;
      pointer-events: none; box-sizing: border-box; font-size: 13px;
      background: linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0.16));
      text-shadow: 0 2px 6px rgba(0,0,0,0.18);
    }

    /* Answer Label */
    .sparx-answer-label {
      position: absolute; left: 0; top: 0; width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Inter', sans-serif; font-weight: 800; font-size: 22px;
      color: #0b0b0b; text-transform: none; opacity: 0;
      transform: translateY(-10px) scale(0.98);
      transition: opacity 420ms cubic-bezier(.2,.9,.2,1), transform 420ms cubic-bezier(.2,.9,.2,1);
      padding: 0 18px; box-sizing: border-box; text-align: center; pointer-events: none;
      word-wrap: break-word; white-space: normal;
    }

    /* Explanation Panel */
    .sparx-explanation-panel {
      margin-top: 14px; padding: 10px; background: rgba(255,255,255,0.7);
      border-radius: 14px; font-family: 'Inter', sans-serif;
      font-size: 14px; line-height: 1.45; overflow: hidden;
      transition: max-height 260ms ease, opacity 220ms ease;
      box-sizing: border-box; display: none;
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 6px 18px rgba(14,18,24,0.04);
    }

    .sparx-explanation-panel .sparx-toggle-btn {
      width: 100%; padding: 10px; border: none; background: transparent;
      border-radius: 10px; cursor: pointer; font-weight: 700;
      margin-bottom: 6px; display: block; text-align: left; font-size: 13px;
    }

    .sparx-explanation-panel .sparx-content {
      max-height: 280px; overflow-y: auto; padding: 10px;
      border-radius: 12px; background: rgba(255,255,255,0.92); display: none;
      color: #111; font-weight: 400; box-sizing: border-box; white-space: pre-wrap;
      margin-top: 8px; border: 1px solid rgba(0,0,0,0.03);
    }

    /* KaTeX styling inheritance */
    .sparx-answer-label .katex, .sparx-explanation-panel .katex { font-family: 'Inter', -apple-system, system-ui !important; }

    /* API Key Panel inputs */
    #apiKeyPanel input[type="password"], #apiKeyPanel button {
      border-radius: 12px !important; padding: 10px 12px !important;
    }

    /* Fixed Buttons */
    .sparx-fixed-btn {
        position: fixed;
        top: 30px;
        width: 52px;
        height: 52px;
        border-radius: 14px;
        border: none;
        background: rgba(255,255,255,0.95);
        box-shadow: 0 10px 26px rgba(14,18,24,0.12);
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 999999;
        transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms, background 220ms;
        transform-origin: center;
        border: 1px solid rgba(0,0,0,0.04);
    }

    .sparx-fixed-btn:hover { transform: translateY(-6px); box-shadow: 0 16px 34px rgba(14,18,24,0.14); }
    .sparx-fixed-btn.active { background: linear-gradient(180deg,#fff,#f7f7f7); transform: scale(1.02); }

    /* Custom Alert */
    #customAlert {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      padding: 12px 20px;
      background: rgba(20,20,20,0.92);
      color: #fff;
      border-radius: 12px;
      box-shadow: 0 6px 26px rgba(0,0,0,0.28);
      font-size: 15px;
      font-weight: 600;
      z-index: 1000001;
      display: none;
      align-items: center;
      justify-content: center;
      text-align: center;
      opacity: 0;
      transition: opacity 220ms ease, transform 220ms ease;
    }

    /* tiny responsiveness tweaks */
    @media (max-width: 860px) {
      #sparxSolver_container { right: 14px; left: 14px; width: auto; min-width: 320px; }
      .sparx-progress-bar { min-width: 260px; }
      #history_view.sparx-floating-card, #apiKeyPanel.sparx-floating-card { width: calc(100% - 48px); left: 24px !important; transform: translate3d(0, -12px, 0) rotate(-6deg) !important; }
    }
    `;
    document.head.appendChild(s);
  }

  function renderHistory() {
    const codes = getSavedCodes().reverse();
    historyContent.innerHTML = '';

    const historyHeader = document.createElement('h2');
    historyHeader.textContent = `Bookwork History (${codes.length} saved)`;
    // clear and rebuild
    historyContent.appendChild(historyHeader);

    if (codes.length === 0) {
      const p = document.createElement('p');
      p.style.textAlign = 'center';
      p.style.color = '#888';
      p.style.marginTop = '20px';
      p.textContent = 'No bookwork codes have been saved yet.';
      historyContent.appendChild(p);
    } else {
      const ul = document.createElement('ul');
      ul.style.listStyle = 'none';
      ul.style.padding = '8px 0';
      ul.style.margin = '0';
      codes.forEach(item => {
        const li = document.createElement('li');
        const date = new Date(item.timestamp).toLocaleDateString() + ' ' + new Date(item.timestamp).toLocaleTimeString();

        li.style.background = 'rgba(255,255,255,0.85)';
        li.style.padding = '12px 14px';
        li.style.marginBottom = '10px';
        li.style.borderRadius = '12px';
        li.style.boxShadow = '0 6px 16px rgba(14,18,24,0.06)';
        li.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <b>Code: ${item.code}</b>
                <span style="color: #777; font-weight: 500; font-size:12px;">${date}</span>
            </div>
            <p style="margin:6px 0 0 0; color:#444; font-size:13px;">Q: ${item.question}</p>
            <p style="margin:4px 0 0 0;">A: <code style="background:transparent; padding:0; border-radius:6px; font-weight:700;">${item.siteAnswer}</code></p>
        `;
        ul.appendChild(li);
      });
      historyContent.appendChild(ul);
    }

    clearHistoryBtn.style.display = codes.length > 0 ? 'block' : 'none';
  }

  function handleClearHistoryClick() {
    if (clearHistoryConfirmationTimer) {
      clearAllBookworkCodes();
      clearHistoryBtn.innerHTML = 'Clear All History';
      clearHistoryBtn.classList.remove('confirm');
      clearTimeout(clearHistoryConfirmationTimer);
      clearHistoryConfirmationTimer = null;
      showCustomAlert('Bookwork History Cleared!');
      renderHistory();
    } else {
      clearHistoryBtn.innerHTML = 'Click AGAIN to Confirm Clear!';
      clearHistoryBtn.classList.add('confirm');
      clearHistoryConfirmationTimer = setTimeout(() => {
        clearHistoryBtn.innerHTML = 'Clear All History';
        clearHistoryBtn.classList.remove('confirm');
        clearHistoryConfirmationTimer = null;
      }, 5000);
    }
  }

  // ------------------------------------
  // Floating Card Helpers & Positioning
  // ------------------------------------

  function createDimOverlay() {
    dimOverlay = document.createElement('div');
    dimOverlay.id = 'sparxDimOverlay';
    document.body.appendChild(dimOverlay);
    dimOverlay.addEventListener('click', () => {
      if (apiPanelOpen) toggleApiPanel();
      if (historyOpen) toggleHistoryView();
    });
  }

  function positionFloatingCardOverProgress(el) {
    // compute position: centered horizontally over progressBar, a bit above it
    if (!progressBar) return;
    const barRect = progressBar.getBoundingClientRect();
    const elWidth = Math.min(420, window.innerWidth * 0.94);
    const left = barRect.left + barRect.width / 2 - elWidth / 2;
    const top = barRect.top - 12 - 18 - 6; // slightly above the bar
    el.style.left = `${Math.max(8, left)}px`;
    el.style.top = `${Math.max(12, top)}px`;
    el.style.width = `${elWidth}px`;
    // set transform to center translate(-50%, ... ) appearance handled by classes
    el.style.transform = `translate3d(-50%, 0, 0) rotate(-6deg)`;
    el.style.left = (barRect.left + barRect.width / 2) + 'px';
    // using translateX(-50%) in transform to visually center at the computed left
  }

  function openFloatingCard(el) {
    if (!el) return;
    positionFloatingCardOverProgress(el);
    dimOverlay.classList.add('visible');
    el.classList.remove('closing');
    el.classList.add('sparx-floating-card', 'entering');
    // ensure small delay then settle into open state with slight spring
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.classList.remove('entering');
        el.classList.add('open');
      }, 80);
    });
  }

  function closeFloatingCard(el) {
    if (!el) return;
    el.classList.remove('open', 'entering');
    el.classList.add('closing');
    dimOverlay.classList.remove('visible');
    setTimeout(() => {
      el.classList.remove('closing');
      // keep hidden
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    }, 420);
  }

  // ------------------------------------
  // Existing UI toggles (patched to floating cards)
  // ------------------------------------

  function toggleHistoryView() {
    if (apiPanelOpen) return;
    historyOpen = !historyOpen;
    historyButton.classList.toggle('active', historyOpen);

    if (historyOpen) {
      solverBarWrapper.style.opacity = '0';
      solverBarWrapper.style.pointerEvents = 'none';
      explanationPanel.style.display = 'none';
      renderHistory();
      container.style.padding = '28px';
      openFloatingCard(historyView);
    } else {
      solverBarWrapper.style.opacity = '1';
      solverBarWrapper.style.pointerEvents = 'auto';
      if (progressBar.classList.contains('solved')) {
        explanationPanel.style.display = 'block';
      }
      container.style.padding = '20px';
      closeFloatingCard(historyView);
    }
  }

  function toggleApiPanel() {
    if (historyOpen) return;
    apiPanelOpen = !apiPanelOpen;
    apiButton.classList.toggle('active', apiPanelOpen);

    if (apiPanelOpen) {
      solverBarWrapper.style.opacity = '0';
      solverBarWrapper.style.pointerEvents = 'none';
      explanationPanel.style.display = 'none';
      apiKeyInput.value = getApiKey() || '';
      openFloatingCard(apiKeyPanel);
    } else {
      solverBarWrapper.style.opacity = '1';
      solverBarWrapper.style.pointerEvents = 'auto';
      if (progressBar.classList.contains('solved')) {
        explanationPanel.style.display = 'block';
      }
      closeFloatingCard(apiKeyPanel);
    }
  }

  // ------------------------------------
  // Rest of the UI creation & logic (mostly unchanged)
  // ------------------------------------

  function createUI() {
    container = document.createElement('div');
    container.id = 'sparxSolver_container';
    document.body.appendChild(container);

    const solverView = document.createElement('div');
    solverView.id = 'solver_view';
    container.appendChild(solverView);

    solverBarWrapper = document.createElement('div');
    solverBarWrapper.className = 'sparx-progress-wrapper';
    solverView.appendChild(solverBarWrapper);

    progressBar = document.createElement('div');
    progressBar.className = 'sparx-progress-bar';
    solverBarWrapper.appendChild(progressBar);

    timerRect = document.createElement('div');
    timerRect.className = 'sparx-timer-rect';
    timerRect.textContent = '0.0s';
    progressBar.appendChild(timerRect);

    answerLabel = document.createElement('div');
    answerLabel.className = 'sparx-answer-label';
    progressBar.appendChild(answerLabel);

    hoverOverlayText = document.createElement('div');
    hoverOverlayText.className = 'sparx-hover-overlay-text';
    hoverOverlayText.textContent = 'Tap to Solve';
    solverBarWrapper.appendChild(hoverOverlayText);

    explanationPanel = document.createElement('div');
    explanationPanel.className = 'sparx-explanation-panel';

    explanationToggleBtn = document.createElement('button');
    explanationToggleBtn.className = 'sparx-toggle-btn';
    explanationToggleBtn.textContent = 'show explanation';

    explanationContent = document.createElement('div');
    explanationContent.className = 'sparx-content';

    explanationPanel.appendChild(explanationToggleBtn);
    explanationPanel.appendChild(explanationContent);
    solverView.appendChild(explanationPanel);

    // history view will be a floating card (append to body)
    historyView = document.createElement('div');
    historyView.id = 'history_view';
    historyView.classList.add('sparx-floating-card');
    historyContent = document.createElement('div');
    historyContent.id = 'historyContent';
    historyView.appendChild(historyContent);
    // close button for history card
    const hClose = document.createElement('button');
    hClose.className = 'close-btn';
    hClose.innerText = 'Close';
    hClose.addEventListener('click', () => { toggleHistoryView(); });
    historyView.appendChild(hClose);
    document.body.appendChild(historyView); // floating

    // API Key Panel as floating card appended to body
    apiKeyPanel = document.createElement('div');
    apiKeyPanel.id = 'apiKeyPanel';
    apiKeyPanel.classList.add('sparx-floating-card');
    Object.assign(apiKeyPanel.style, {
      display: 'block',
      boxSizing: 'border-box'
    });

    const apiTitle = document.createElement('h2');
    apiTitle.textContent = 'API Key';
    apiKeyPanel.appendChild(apiTitle);

    apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'password';
    apiKeyInput.placeholder = 'enter gemini api key';
    Object.assign(apiKeyInput.style, {
      width: '100%',
      padding: '10px 12px',
      border: 'none',
      borderRadius: '10px',
      boxSizing: 'border-box',
      fontSize: '14px',
      background: 'rgba(255,249,230,0.9)',
      fontFamily: 'Inter, sans-serif',
      marginBottom: '8px'
    });

    apiOkButton = document.createElement('button');
    apiOkButton.textContent = 'save key';
    Object.assign(apiOkButton.style, {
      width: '100%',
      padding: '10px',
      marginTop: '0',
      border: 'none',
      borderRadius: '12px',
      background: '#34c759',
      color: '#fff',
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 8px 22px rgba(52,199,89,0.12)'
    });

    const apiClose = document.createElement('button');
    apiClose.className = 'close-btn';
    apiClose.innerText = 'Close';
    apiClose.addEventListener('click', () => { toggleApiPanel(); });

    apiKeyPanel.appendChild(apiKeyInput);
    apiKeyPanel.appendChild(apiOkButton);
    apiKeyPanel.appendChild(apiClose);
    document.body.appendChild(apiKeyPanel);

    apiButton = document.createElement('button');
    apiButton.className = 'sparx-fixed-btn';
    Object.assign(apiButton.style, { right: '640px' });
    apiButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11c1.333 0 4-1 4-4S13.333 3 12 3 8 4 8 7s2.667 4 4 4z"></path><path d="M12 11v10"></path></svg>`;
    document.body.appendChild(apiButton);

    historyButton = document.createElement('button');
    historyButton.className = 'sparx-fixed-btn';
    Object.assign(historyButton.style, { right: '700px' });
    historyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    document.body.appendChild(historyButton);

    customAlert = document.createElement('div');
    customAlert.id = 'customAlert';
    customAlert.innerHTML = '<span id="customAlertContent"></span>';
    document.body.appendChild(customAlert);

    // dim overlay
    createDimOverlay();

    apiButton.addEventListener('click', toggleApiPanel);
    historyButton.addEventListener('click', toggleHistoryView);

    apiOkButton.addEventListener('click', () => {
      const k = apiKeyInput.value.trim();
      if (k) {
        setApiKey(k);
        toggleApiPanel();
        showCustomAlert('API key saved successfully!');
      } else {
        showCustomAlert('Please enter a valid key.');
      }
    });

    explanationToggleBtn.addEventListener('click', () => {
      if (!historyOpen && !apiPanelOpen) {
        toggleExplanation();
      }
    });

    progressBar.addEventListener('click', () => {
      if (!isSolving && !apiPanelOpen && !historyOpen) {
        startSolveFromProgressBar();
      }
    });

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        if (answerFinalText) {
          answerLabel.textContent = cleanKaTeXString(answerFinalText, true);
          const barRect = progressBar.getBoundingClientRect();
          const labelRect = answerLabel.getBoundingClientRect();
          if (labelRect.width + 36 > barRect.width) {
            progressBar.style.minWidth = `${labelRect.width + 36}px`;
          }
          // reposition floating cards if open
          if (apiPanelOpen) positionFloatingCardOverProgress(apiKeyPanel);
          if (historyOpen) positionFloatingCardOverProgress(historyView);
        }
      });
      resizeObserver.observe(progressBar);
    }
  }

  // ------------------------------------
  // V. Animation & Solve Flow (unchanged)
  // ------------------------------------

  let stripeOffset = 0;
  function startStripes() {
    if (stripeInterval) clearInterval(stripeInterval);
    stripeOffset = 0;
    stripeInterval = setInterval(() => {
      stripeOffset += 2;
      progressBar.style.background = `repeating-linear-gradient(45deg,#e9e9eb ${stripeOffset}px,#e9e9eb ${8 + stripeOffset}px,#f3f3f5 ${8 + stripeOffset}px,#f3f3f5 ${16 + stripeOffset}px)`;
    }, 40);
    progressBar.classList.add('processing');
  }

  function stopStripes() {
    if (stripeInterval) {
      clearInterval(stripeInterval);
      stripeInterval = null;
    }
    progressBar.classList.remove('processing');
  }

  function startProgressUI() {
    progressBar.style.height = '60px';
    progressBar.style.transition = 'all 240ms ease';
    progressBar.style.background = 'repeating-linear-gradient(45deg,#e9e9eb 0,#e9e9eb 8px,#f3f3f5 8px,#f3f3f5 16px)';
    progressBar.style.minWidth = '420px';
    progressBar.classList.remove('solved');

    answerLabel.style.transition = 'opacity 300ms ease, transform 300ms ease';
    answerLabel.style.opacity = 0;
    answerLabel.style.transform = 'translateY(-10px) scale(0.98)';
    setTimeout(() => { answerLabel.textContent = ''; }, 300);

    timerRect.textContent = '0.0s';
    explanationContent.style.display = 'none';
    explanationToggleBtn.textContent = 'show explanation';
    explanationPanel.style.display = 'none';
    explanationOpen = false;
    answerFinalText = '';

    startStripes();
  }

  async function finishProgressUI(success = true, text = '') {
    const finalText = cleanKaTeXString(text || 'no result', true);
    answerFinalText = finalText;
    answerLabel.textContent = finalText;

    progressBar.style.transition = 'background 260ms ease, transform 300ms ease';
    progressBar.style.background = success
      ? 'linear-gradient(90deg,#34c759,#37d06a)'
      : 'linear-gradient(90deg,#ff6b6b,#ff4b4b)';

    progressBar.classList.add('solved');

    requestAnimationFrame(() => {
      answerLabel.style.transition = 'opacity 500ms cubic-bezier(.2,.68,.2,1.25), transform 500ms cubic-bezier(.2,.68,.2,1.25)';
      answerLabel.style.opacity = 1;
      answerLabel.style.transform = 'translateY(0) scale(1)';
    });

    if (!historyOpen && !apiPanelOpen) {
      explanationPanel.style.display = 'block';
    }
    explanationToggleBtn.textContent = 'show explanation';
    explanationContent.style.display = 'none';
  }

  function toggleExplanation() {
    if (!explanationPanel.style.display || explanationPanel.style.display === 'none') {
      return;
    }
    if (!explanationOpen) {
      explanationContent.style.opacity = '0';
      explanationContent.style.display = 'block';
      setTimeout(() => {
        explanationContent.style.transition = 'opacity 260ms ease';
        explanationContent.style.opacity = '1';
      }, 20);
      explanationToggleBtn.textContent = 'hide explanation';
      explanationOpen = true;
    } else {
      explanationContent.style.transition = 'opacity 200ms ease';
      explanationContent.style.opacity = '0';
      setTimeout(() => {
        explanationContent.style.display = 'none';
        explanationToggleBtn.textContent = 'show explanation';
        explanationOpen = false;
      }, 220);
    }
  }

  async function getQuestionParts() {
    const questionEl = document.querySelector(QUESTION_WRAPPER_SELECTOR);
    if (!questionEl) throw new Error('Question element not found.');

    const parts = [];
    const imagePromises = [];
    const imgNodes = Array.from(questionEl.querySelectorAll('img'));

    const primaryText = (questionEl.innerText || questionEl.textContent || '').trim();
    const mathElements = questionEl.querySelectorAll('.katex');
    let extractedMath = '';

    mathElements.forEach((mathEl) => {
      const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
      const parentDataExpr = mathEl.closest('[data-expr]');

      if (annotation && annotation.textContent) {
        extractedMath += ` $$${annotation.textContent.trim()}$$ `;
      } else if (parentDataExpr && parentDataExpr.dataset.expr) {
        extractedMath += ` $$${parentDataExpr.dataset.expr.trim()}$$ `;
      }
    });

    for (const img of imgNodes) {
      if (img.src) {
        imagePromises.push(
          urlToBase64(img.src, IMAGE_MIME_TYPE)
            .then((base64) => ({ inlineData: { mimeType: IMAGE_MIME_TYPE, data: base64 } }))
            .catch((e) => {
              console.error('Skipping image due to encoding error:', e);
              return null;
            })
        );
      }
    }

    const validImageParts = (await Promise.all(imagePromises)).filter((p) => p !== null);

    let initialPromptText = 'Solve this math problem step-by-step. ';
    if (validImageParts.length > 0) {
      initialPromptText += 'Analyze the image(s) and the question text. ';
    }
    initialPromptText += `Here is the question text from the page: **${primaryText}**`;
    if (extractedMath) {
      initialPromptText += `\n\nCRITICAL: The extracted raw LaTeX code for the math expressions is: ${extractedMath.trim()}`;
    }
    initialPromptText += '\n\nUse KaTeX delimiters ($...$ for inline and $$...$$ for display) for all mathematical expressions, variables, and equations in the **explanation**. Do not use any listing format (e.g., a), 1) etc.) in the explanation.\n\n';
    initialPromptText += 'CRITICAL FINAL STEP: Your absolute last line of output MUST contain ONLY the final numerical or algebraic answer, with NO other text. Use the format "Final Answer: VALUE". The VALUE should use LaTeX commands where applicable.';

    parts.push(...validImageParts);
    parts.push({ text: initialPromptText });

    return parts;
  }

  async function startSolveFromProgressBar() {
    const apiKey = getApiKey();
    if (!apiKey) {
      showCustomAlert("Hold up! You need to tap the User icon (👤) and enter your Gemini API key first.");
      return;
    }
    if (isSolving || apiPanelOpen || historyOpen) return;

    isSolving = true;
    progressBar.classList.add('processing');
    startProgressUI();

    const startTime = Date.now();
    const timerTicker = setInterval(() => {
      timerRect.textContent = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
    }, 100);

    try {
      const parts = await getQuestionParts();
      const body = { contents: [{ role: 'user', parts }] };

      const responseText = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: GEMINI_API_URL,
          headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
          data: JSON.stringify(body),
          onload: (r) => {
            if (r.status >= 400) return reject(new Error(`API ${r.status}: ${r.responseText}`));
            try {
              resolve(JSON.parse(r.responseText)?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response');
            } catch (e) {
              reject(e);
            }
          },
          onerror: (e) => reject(new Error(`Network error: ${e.statusText || 'unknown'}`)),
        });
      });

      const { final, explanation } = parseFinalAndExplanation(responseText);
      renderKaTeXInto(explanationContent, explanation || responseText || '', false);
      await finishProgressUI(true, final || 'not found');
    } catch (err) {
      const fullErrorMessage = (err.message || 'Unknown Error').toString();
      let errorCode = 'GEN';
      const apiMatch = fullErrorMessage.match(/API (\d+):/i);
      if (apiMatch && apiMatch[1]) {
        errorCode = apiMatch[1];
      } else if (fullErrorMessage.includes('Network error')) {
        errorCode = 'NET';
      }
      const displayMessage = `error [${errorCode}]`;
      renderKaTeXInto(explanationContent, fullErrorMessage);
      await finishProgressUI(false, displayMessage);
    } finally {
      clearInterval(timerTicker);
      stopStripes();
      progressBar.classList.remove('processing');
      isSolving = false;
      timerRect.textContent = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
    }
  }

  // ------------------------------------
  // VI. Observers (Automation)
  // ------------------------------------

  function disconnectAnswerCompletionObserver() {
    if (answerCompletionObserver) {
      answerCompletionObserver.disconnect();
      answerCompletionObserver = null;
      console.log('[ACT] Answer Completion Observer Disconnected.');
    }
  }

  function checkAndSaveAnswer() {
    const bookworkCode = getBookworkCode();
    const questionEl = document.querySelector(QUESTION_WRAPPER_SELECTOR);

    if (bookworkCode === 'N/A' || !questionEl) {
      return;
    }

    const completionIndicator = questionEl.querySelector('[class*="_AnswerCorrect_"], [class*="_AnswerIncorrect_"]');
    const siteAnswer = getSiteExpectedAnswer();

    if (siteAnswer !== 'N/A' && completionIndicator) {
      if (isAnswerSaved) return;
      const questionText = (questionEl.innerText || questionEl.textContent || '').trim();

      if (questionText) {
        console.log(`[ACT] QUESTION MUTATED - SUCCESS DETECTED. Saving Bookwork Code: ${bookworkCode} and Answer: ${siteAnswer}`);
        console.log(`[Sparx Solver] LOG: Bookwork Code: ${bookworkCode}, Final Answer: ${siteAnswer}`);
        saveBookworkCode(bookworkCode, questionText, siteAnswer);
        disconnectAnswerCompletionObserver();
      }
    }
  }

  function observeAnswerCompletion() {
    disconnectAnswerCompletionObserver();
    isAnswerSaved = false;

    const targetNode = document.querySelector(QUESTION_WRAPPER_SELECTOR);
    if (!targetNode) return;

    checkAndSaveAnswer();

    if (!isAnswerSaved) {
      answerCompletionObserver = new MutationObserver((mutationsList) => {
        checkAndSaveAnswer();
      });

      answerCompletionObserver.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value', 'class']
      });

      console.log('[ACT] Answer Completion Observer Started.');
    }
  }

  function observeWacStart() {
    const targetNode = document.querySelector('body');
    if (!targetNode) return;

    const observer = new MutationObserver((mutationsList, observerRef) => {
      const bookworkCode = getBookworkCode();
      if (bookworkCode !== 'N/A') {
        const questionEl = document.querySelector(QUESTION_WRAPPER_SELECTOR);
        if (questionEl) {
          const questionText = (questionEl.innerText || questionEl.textContent || '').trim();
          if (questionText) {
            saveBookworkCode(bookworkCode, questionText, 'N/A');
            observerRef.disconnect();
          }
        }
      }
    });
    observer.observe(targetNode, { childList: true, subtree: true });
  }

  function observeQuestionRemoval() {
    if (questionRemovalObserver) {
      questionRemovalObserver.disconnect();
    }

    const targetNode = document.querySelector('body');
    if (!targetNode) return;

    questionRemovalObserver = new MutationObserver((mutationsList, observer) => {
      const q = document.querySelector(QUESTION_WRAPPER_SELECTOR);
      if (!q) {
        console.log('[ACT] Question element removed. Hiding UI.');
        observer.disconnect();
        questionRemovalObserver = null;

        container.style.opacity = '0';
        container.style.display = 'none';
        apiButton.style.display = 'none';
        historyButton.style.display = 'none';

        disconnectAnswerCompletionObserver();

        historyOpen = false;
        apiPanelOpen = false;
        explanationOpen = false;
        historyView.style.display = 'none';
        apiKeyPanel.style.display = 'none';
        container.style.padding = '20px';
        solverBarWrapper.style.opacity = '1';
        solverBarWrapper.style.pointerEvents = 'auto';

        setTimeout(autoOpenWhenQuestionAppears, 400);
      }
    });

    questionRemovalObserver.observe(targetNode, { childList: true, subtree: true });
  }

  function autoOpenWhenQuestionAppears() {
    try {
      const q = document.querySelector(QUESTION_WRAPPER_SELECTOR);
      if (q) {
        console.log('[ACT] New question detected. Showing UI.');

        container.style.display = 'block';
        container.style.opacity = '1';
        container.classList.add('enter');
        apiButton.style.display = 'flex';
        historyButton.style.display = 'flex';

        solverBarWrapper.style.opacity = '1';
        solverBarWrapper.style.pointerEvents = 'auto';
        historyView.style.display = 'none';
        apiKeyPanel.style.display = 'none';

        observeWacStart();
        observeQuestionRemoval();
        observeAnswerCompletion();

        if (getApiKey()) {
          console.log('[ACT] API key found. Starting autosolve...');
          setTimeout(startSolveFromProgressBar, 120);
        }
      } else {
        setTimeout(autoOpenWhenQuestionAppears, 400);
      }
    } catch (e) {
      console.error('Error in autoOpenWhenQuestionAppears:', e);
      setTimeout(autoOpenWhenQuestionAppears, 400);
    }
  }

  // ------------------------------------
  // VII. Initial Execution
  // ------------------------------------

  loadAssets();
  injectStyles();
  createUI();
  autoOpenWhenQuestionAppears();

  // Helpful console exports
  window.SparxSolver_startSolve = startSolveFromProgressBar;
  window.SparxSolver_toggleHistory = toggleHistoryView;

})();