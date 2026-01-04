// ==UserScript==
// @name         Sinister Streets Tower UI - TornPDA Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adapter that ensures Tower UI runs smoothly inside TornPDA WebView
// @match        https://sinisterstreets.com/tower.php
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/555482/Sinister%20Streets%20Tower%20UI%20-%20TornPDA%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/555482/Sinister%20Streets%20Tower%20UI%20-%20TornPDA%20Loader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- Detect TornPDA environment ---
  const isPDA = /TornPDA/i.test(navigator.userAgent);
  if (!isPDA) {
    console.log('[Tower UI PDA Loader] Not in TornPDA, skipping loader.');
    return;
  }

  console.log('[Tower UI PDA Loader] Detected TornPDA environment.');

  // --- Apply PDA-safe styles ---
  GM_addStyle(`
    #ss-tower-ui {
      position: relative !important;
      top: auto !important;
      left: 0 !important;
      transform: none !important;
      width: 95% !important;
      margin: 10px auto !important;
      z-index: 9999999 !important;
    }
    html, body {
      overflow-y: auto !important;
      overscroll-behavior: contain;
    }
  `);

  // Force non-floating UI for TornPDA
  try {
    localStorage.ss_floating = false;
    localStorage.ss_anchorPos = 'center';
  } catch (e) {
    console.warn('[Tower UI PDA Loader] localStorage may be sandboxed:', e);
  }

  // --- Dynamically load your main Tower UI script ---
  const MAIN_URL = "https://update.greasyfork.org/scripts/554695/Sinister%20Streets%20Tower%20UI%20-%20New%20-%20Tower.user.js";

  GM_xmlhttpRequest({
    method: "GET",
    url: MAIN_URL + "?_=" + Date.now(),
    onload: (response) => {
      const script = document.createElement("script");
      script.textContent = response.responseText;
      document.body.appendChild(script);
      console.log("[Tower UI PDA Loader] Tower UI loaded successfully inside TornPDA.");
    },
    onerror: () => {
      console.error("[Tower UI PDA Loader] Failed to load Tower UI script.");
    }
  });

  // --- Fallback re-run if PDA delays DOM loading ---
  let retries = 0;
  const ensureUI = setInterval(() => {
    retries++;
    if (document.getElementById("ss-tower-ui") || retries > 20) clearInterval(ensureUI);
    else if (typeof init === "function") try { init(); clearInterval(ensureUI); } catch {}
  }, 1000);

})();
