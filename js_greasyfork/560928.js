// ==UserScript==
// @name         DegenIdle Toolkit
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Multi-Character Monitor + World Boss Queue + DPS Display + Guild Donations + Dungeon Tracking + Auto-Sell + Auto-Feed + Global Auto Mode + Combat/Dungeon/Task Join + Market Affix Filter - Unified toolkit for DegenIdle
// @author       Seisen
// @match        https://degenidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560928/DegenIdle%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/560928/DegenIdle%20Toolkit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ════════════════════════════════════════════════════════════════════════════
  // ██████╗ ███████╗ ██████╗ ███████╗███╗   ██╗    ████████╗ ██████╗  ██████╗ ██╗
  // ██╔══██╗██╔════╝██╔════╝ ██╔════╝████╗  ██║    ╚══██╔══╝██╔═══██╗██╔═══██╗██║
  // ██║  ██║█████╗  ██║  ███╗█████╗  ██╔██╗ ██║       ██║   ██║   ██║██║   ██║██║
  // ██║  ██║██╔══╝  ██║   ██║██╔══╝  ██║╚██╗██║       ██║   ██║   ██║██║   ██║██║
  // ██████╔╝███████╗╚██████╔╝███████╗██║ ╚████║       ██║   ╚██████╔╝╚██████╔╝███████╗
  // ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝       ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
  // ════════════════════════════════════════════════════════════════════════════
  // DegenIdle Toolkit v6.0
  // Multi-Character Monitor + World Boss Queue + DPS Display + Guild Donations + Dungeon Tracking + Auto-Sell + Combat Join + Market Affix Filter
  // ════════════════════════════════════════════════════════════════════════════

  console.log('═══════════════════════════════════════════════════════');
  console.log('DegenIdle Toolkit v6.0');
  console.log('Multi-Character Monitor + World Boss Queue + DPS Display + Guild Donations + Auto-Sell + Market Affix Filter');
  console.log('═══════════════════════════════════════════════════════');

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1: SHARED CORE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // DEBUG MODE - Set to true for verbose logging
  // ============================================
  const DEBUG_MODE = true;

  function debugLog(...args) {
    if (DEBUG_MODE) {
      console.log('[DEBUG]', ...args);
    }
  }

  console.log('DEBUG_MODE:', DEBUG_MODE ? 'ENABLED' : 'DISABLED');

  const API_ROOT = "https://api-v1.degenidle.com/api/";
  const ACTION_DELAY_MIN = 1000;  // 1s
  const ACTION_DELAY_MAX = 1500;  // 1.5s

  // ============================================
  // COMBAT ZONES DATA (for Combat Join feature)
  // ============================================
  const COMBAT_ZONES = [
    // Zone 1 (Levels 1-9)
    { id: 1, zone: 1, level: 1 },
    { id: 2, zone: 1, level: 2 },
    { id: 3, zone: 1, level: 3 },
    { id: 4, zone: 1, level: 5 },
    { id: 5, zone: 1, level: 6 },
    { id: 6, zone: 1, level: 7 },
    { id: 7, zone: 1, level: 8 },
    { id: 8, zone: 1, level: 9 },
    // Zone 10 (Levels 10-18)
    { id: 9, zone: 10, level: 10 },
    { id: 10, zone: 10, level: 12 },
    { id: 11, zone: 10, level: 15 },
    { id: 12, zone: 10, level: 18 },
    // Zone 20 (Levels 20-28)
    { id: 13, zone: 20, level: 20 },
    { id: 14, zone: 20, level: 22 },
    { id: 15, zone: 20, level: 24 },
    { id: 16, zone: 20, level: 26 },
    { id: 17, zone: 20, level: 28 },
    // Zone 30 (Levels 30-38)
    { id: 18, zone: 30, level: 30 },
    { id: 19, zone: 30, level: 32 },
    { id: 20, zone: 30, level: 34 },
    { id: 21, zone: 30, level: 36 },
    { id: 22, zone: 30, level: 38 },
    // Zone 40 (Levels 40-48)
    { id: 23, zone: 40, level: 40 },
    { id: 24, zone: 40, level: 42 },
    { id: 25, zone: 40, level: 44 },
    { id: 26, zone: 40, level: 46 },
    { id: 27, zone: 40, level: 48 },
    // Zone 50 (Levels 50-58)
    { id: 28, zone: 50, level: 50 },
    { id: 29, zone: 50, level: 52 },
    { id: 30, zone: 50, level: 54 },
    { id: 31, zone: 50, level: 56 },
    { id: 32, zone: 50, level: 58 },
    // Zone 60 (Levels 60-68)
    { id: 33, zone: 60, level: 60 },
    { id: 34, zone: 60, level: 62 },
    { id: 35, zone: 60, level: 64 },
    { id: 36, zone: 60, level: 66 },
    { id: 37, zone: 60, level: 68 },
    // Zone 70 (Levels 70-78)
    { id: 38, zone: 70, level: 70 },
    { id: 39, zone: 70, level: 72 },
    { id: 40, zone: 70, level: 74 },
    { id: 41, zone: 70, level: 76 },
    { id: 42, zone: 70, level: 78 },
    // Zone 80 (Levels 80-88)
    { id: 43, zone: 80, level: 80 },
    { id: 44, zone: 80, level: 82 },
    { id: 45, zone: 80, level: 84 },
    { id: 46, zone: 80, level: 86 },
    { id: 47, zone: 80, level: 88 }
  ];

  // ============================================
  // SVG ICONS (to avoid emoji encoding issues)
  // ============================================
  const ICONS = {
    // Combat - Sword (green)
    combat: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line></svg>`,
    // Idle / No task - Circle stop
    idle: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6" rx="1"></rect></svg>`,
    // Task - Crossed hammers
    task: `<svg viewBox="0 0 512 512" width="14" height="14" fill="currentColor"><path d="m512.274 178.804c-.585-28.553-12.036-55.406-32.243-75.613l-42.11-42.11c-2.813-2.813-6.628-4.394-10.607-4.394-3.978 0-7.793 1.581-10.606 4.394l-.47.47c-2.896 2.896-6.736 4.445-10.844 4.403-4.093-.056-7.903-1.73-10.728-4.714-5.539-5.851-5.205-15.451.773-21.429 5.858-5.857 5.858-15.355 0-21.213l-13.89-13.89c-2.813-2.813-6.628-4.394-10.607-4.394-3.978 0-7.793 1.581-10.606 4.394l-84.988 84.988c-2.813 2.813-4.394 6.629-4.394 10.606 0 3.979 1.581 7.794 4.394 10.607l13.892 13.891c5.858 5.858 15.387 5.827 21.244-.031 5.555-5.554 14.205-6.244 20.121-1.605 7.488 5.675 7.774 16.994.847 23.186l-80.454 80.453-63.919-63.919 53.596-53.596c2.813-2.813 4.394-6.628 4.394-10.606 0-3.979-1.581-7.794-4.394-10.606l-83.369-83.368c-5.857-5.858-15.355-5.858-21.213 0l-131.7 131.7c-2.812 2.812-4.393 6.628-4.393 10.606v100.66c0 3.979 1.581 7.793 4.394 10.606l33.038 33.038c2.929 2.929 6.768 4.393 10.606 4.393 3.839 0 7.678-1.464 10.607-4.394l65.02-65.02 63.919 63.919-154.22 154.22c-2.813 2.813-4.394 6.628-4.394 10.606s1.58 7.794 4.394 10.607l41.878 41.878c2.813 2.813 6.628 4.393 10.606 4.393s7.793-1.581 10.606-4.393l154.22-154.22 154.283 154.283c2.813 2.813 6.628 4.393 10.606 4.393s7.793-1.581 10.606-4.393l42.202-42.202c5.858-5.858 5.858-15.355 0-21.213l-154.283-154.282 80.549-80.55c.032-.032.058-.067.09-.1 6.113-6.064 14.213-9.404 22.829-9.404 8.66 0 16.802 3.372 22.926 9.497 6.124 6.124 9.496 14.265 9.496 22.925s-3.373 16.802-9.496 22.925c-.003.003-.005.006-.007.008l-12.14 12.14c-5.858 5.858-5.858 15.355 0 21.213 2.929 2.929 6.768 4.393 10.606 4.393 3.839 0 7.678-1.464 10.607-4.393l32.869-32.869c.086-.085.17-.172.254-.26 19.679-20.657 30.192-47.866 29.603-76.614zm-464.236 80.694-18.038-18.037v-88.233l116.7-116.7 62.154 62.154zm96.839-54.413 20.989-20.989 63.919 63.919-20.989 20.989zm291.674 249.697-20.988 20.988-143.677-143.676 20.989-20.989zm-350.704 20.925-20.665-20.665 276.971-276.97 20.664 20.664zm390.479-264.574c-3.069-8.553-8.016-16.394-14.632-23.01-11.79-11.79-27.465-18.283-44.139-18.283-11.551 0-22.62 3.121-32.253 8.956l-23.585-23.585c3.494-7.001 5.151-14.87 4.671-22.842-.775-12.854-7.071-24.815-17.273-32.814-9.33-7.315-20.812-10.333-31.977-9.223l43.906-43.907c-1.289 12.657 2.63 25.714 11.837 35.439 8.44 8.916 19.841 13.919 32.103 14.088 7.301.097 14.358-1.522 20.697-4.687l33.139 33.138c14.704 14.705 23.037 34.242 23.462 55.015.226 11.082-1.843 21.83-5.956 31.715z"></path></svg>`,
    // Dungeon - Door
    dungeon: `<svg viewBox="0 0 512 512" width="14" height="14" fill="currentColor"><path d="m482 422v-196c0-60.134-23.572-116.823-66.375-159.625-42.802-42.803-99.491-66.375-159.625-66.375s-116.823 23.572-159.625 66.375c-42.803 42.802-66.375 99.491-66.375 159.625v196c-16.542 0-30 13.458-30 30v45c0 8.284 6.716 15 15 15h482c8.284 0 15-6.716 15-15v-45c0-16.542-13.458-30-30-30zm-30-196v16h-30v-16c0-13.303-1.587-26.376-4.651-39.016.061-.016.123-.027.184-.044l28.757-7.94c3.721 15.063 5.71 30.803 5.71 47zm-30 106v-60h30v60zm30 30v60h-30v-60zm-15.141-211.519-27.31 7.541c-.646.178-1.263.41-1.864.665-7.193-16.068-17.004-31.032-29.209-44.372l22.395-20.192c15.01 16.471 27.249 35.506 35.988 56.358zm-60.859 147.019h16v124.5h-70.667v-315.247c42.083 23.148 70.667 67.92 70.667 119.247v41.5h-16c-8.284 0-15 6.716-15 15s6.716 15 15 15zm-52.45-255.501c20.242 7.455 38.919 18.168 55.407 31.488l-22.703 20.47c-14.353-10.98-30.217-19.45-47.055-25.183zm-67.55-11.999c12.985 0 25.674 1.282 37.959 3.703l-14.955 27.9c-7.564-1.055-15.244-1.603-23.004-1.603s-15.441.548-23.005 1.603l-14.954-27.9c12.285-2.421 24.974-3.703 37.959-3.703zm35.333 64.665v327.335h-70.667v-327.335c11.273-3.036 23.116-4.665 35.334-4.665s24.061 1.629 35.333 4.665zm-102.883-52.666 14.351 26.774c-15.784 5.374-30.712 13.151-44.342 23.148l-22.777-20.537c15.833-12.348 33.6-22.325 52.768-29.385zm2.217 64.753v315.248h-70.667v-196c0-51.327 28.584-96.099 70.667-119.248zm-77.271-15.067 22.394 20.191c-12.912 13.574-23.271 28.923-30.854 45.459l-29.277-8.084c9.144-21.406 21.995-40.861 37.737-57.566zm-53.396 134.315c0-16.658 2.095-32.834 6.025-48.286l28.931 7.989c-3.271 13.035-4.956 26.545-4.956 40.297v16h-30zm0 46h30v60h-30zm0 90h30v60h-30zm422 120h-452.001l-.002-30h452.003z"></path></svg>`,
    // HP - Heart (red)
    hp: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>`,
    // Energy - Sparkles (yellow)
    energy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>`,
    // Time - Clock
    time: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6l4 2"></path><circle cx="12" cy="12" r="10"></circle></svg>`,
    // Chevron down - Expand arrow
    chevron: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`
  };

  // ============================================
  // TOKEN MANAGER (SHARED)
  // ============================================
  const TokenManager = {
    authToken: null,
    lastUpdate: null,
    onTokenCapturedCallbacks: [], // Array of callbacks for multiple modules

    update(token) {
      debugLog('[TokenManager] update() called with token:', token ? 'YES (length: ' + token.length + ')' : 'NO/NULL');

      if (token && token !== this.authToken) {
        const isFirstCapture = !this.authToken;
        this.authToken = token;
        this.lastUpdate = Date.now();
        console.log('[TokenManager] Token captured!');
        console.log('[TokenManager] Token length:', token.length);
        console.log('[TokenManager] Token starts with:', token.substring(0, 20) + '...');

        // Trigger all callbacks on first capture
        if (isFirstCapture && this.onTokenCapturedCallbacks.length > 0) {
          console.log('[TokenManager] First token capture - triggering', this.onTokenCapturedCallbacks.length, 'callback(s)');
          this.onTokenCapturedCallbacks.forEach(callback => {
            try {
              callback();
            } catch (error) {
              console.error('[TokenManager] Error in callback:', error);
            }
          });
        }
      } else if (token && token === this.authToken) {
        debugLog('[TokenManager] Token unchanged (same as before)');
      } else if (!token) {
        debugLog('[TokenManager] update() called with null/undefined token');
      }
    },

    registerCallback(callback) {
      this.onTokenCapturedCallbacks.push(callback);
      debugLog('[TokenManager] Registered callback, total:', this.onTokenCapturedCallbacks.length);
    },

    isReady() {
      return !!this.authToken;
    },

    getStatus() {
      return {
        hasToken: !!this.authToken,
        tokenAge: this.lastUpdate ? Math.floor((Date.now() - this.lastUpdate) / 1000) : null
      };
    }
  };

  // ============================================
  // FETCH INTERCEPTOR - Capture Authorization Token
  // ============================================
  debugLog('Installing fetch interceptor...');

  const originalFetch = window.fetch;
  if (!originalFetch) {
    console.error('[CRITICAL] window.fetch is not available! This browser may not support fetch.');
  }

  window.fetch = async function(...args) {
    const [url, options] = args;

    // Capture Authorization header from OUTGOING requests
    const urlStr = typeof url === 'string' ? url : url?.url || '';

    debugLog('Fetch intercepted:', urlStr.substring(0, 80) + (urlStr.length > 80 ? '...' : ''));

    if (urlStr.includes('api-v1.degenidle.com')) {
      debugLog('   This is a DegenIdle API call');
      debugLog('   Options present:', !!options);
      debugLog('   Headers present:', !!options?.headers);

      if (options?.headers) {
        let authHeader = null;
        const headersType = options.headers instanceof Headers ? 'Headers' :
                           Array.isArray(options.headers) ? 'Array' :
                           typeof options.headers === 'object' ? 'Object' : 'Unknown';

        debugLog('   Headers type:', headersType);

        // Handle different header formats
        if (options.headers instanceof Headers) {
          authHeader = options.headers.get('Authorization');
          debugLog('   Headers.get("Authorization"):', authHeader ? 'FOUND' : 'NOT FOUND');
        } else if (Array.isArray(options.headers)) {
          const entry = options.headers.find(h => h[0].toLowerCase() === 'authorization');
          if (entry) authHeader = entry[1];
          debugLog('   Array search for authorization:', authHeader ? 'FOUND' : 'NOT FOUND');
        } else if (typeof options.headers === 'object') {
          authHeader = options.headers['Authorization'] || options.headers['authorization'] || options.headers['AUTHORIZATION'];
          debugLog('   Object keys:', Object.keys(options.headers).join(', '));
          debugLog('   Authorization in object:', authHeader ? 'FOUND' : 'NOT FOUND');
        }

        if (authHeader) {
          debugLog('   Auth header captured! Length:', authHeader.length);
          debugLog('   Auth header preview:', authHeader.substring(0, 30) + '...');
          TokenManager.update(authHeader);
        } else {
          debugLog('   No Authorization header found in this request');
        }
      } else {
        debugLog('   No headers in this request');
      }
    }

    // Execute the fetch and capture response for DPS handlers
    const resp = await originalFetch.apply(this, args);

    // Handle DPS-related API responses
    if (urlStr.startsWith(API_ROOT)) {
      resp.clone().json().then(json => {
        try {
          handleDPSApiResponse(urlStr, json);
        } catch (e) {
          // Silently ignore DPS handler errors
        }

        // Handle Market API responses for affix filter
        try {
          if (urlStr.includes('/market/items/') && urlStr.includes('/market')) {
            if (json.success && json.data) {
              handleMarketApiResponse(urlStr, json.data);
            }
          }
        } catch (e) {
          // Silently ignore market handler errors
        }
      }).catch(() => {});
    }

    return resp;
  };

  debugLog('Fetch interceptor installed');

  // ============================================
  // XHR INTERCEPTOR - Capture Authorization Token from XMLHttpRequest
  // ============================================
  debugLog('Installing XHR interceptor...');

  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._degenIdleUrl = url;
    this._degenIdleHeaders = {};
    debugLog('XHR.open intercepted:', method, url?.substring(0, 60) + (url?.length > 60 ? '...' : ''));

    // Add listener for DPS and Market response handling
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 4 && this.responseURL?.startsWith(API_ROOT)) {
        // Handle DPS API responses
        try {
          handleDPSApiResponse(this.responseURL, JSON.parse(this.responseText));
        } catch (e) {
          // Silently ignore DPS handler errors
        }

        // Handle Market API responses for affix filter
        try {
          if (this.responseURL?.includes('/market/items/') && this.responseURL?.includes('/market')) {
            const json = JSON.parse(this.responseText);
            if (json.success && json.data) {
              handleMarketApiResponse(this.responseURL, json.data);
            }
          }
        } catch (e) {
          // Silently ignore market handler errors
        }
      }
    });

    return originalXHROpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (this._degenIdleHeaders) {
      this._degenIdleHeaders[name.toLowerCase()] = value;
    }

    debugLog('XHR.setRequestHeader:', name, '=', name.toLowerCase() === 'authorization' ? '[REDACTED]' : value?.substring(0, 30));

    // Capture Authorization header for api-v1.degenidle.com
    if (name.toLowerCase() === 'authorization' && this._degenIdleUrl?.includes('api-v1.degenidle.com')) {
      debugLog('   XHR Auth header captured for DegenIdle API!');
      TokenManager.update(value);
    }

    return originalXHRSetRequestHeader.apply(this, arguments);
  };

  debugLog('XHR interceptor installed');

  console.log('[TokenManager] Token interceptor installed (fetch + XHR)');
  console.log('[TokenManager] Waiting for game to make API calls...');

  // ============================================
  // API HELPER FUNCTIONS (SHARED)
  // ============================================
  async function apiCall(endpoint) {
    if (!TokenManager.isReady()) {
      throw new Error('Token not available yet');
    }

    const url = `${API_ROOT}${endpoint}`;
    const response = await originalFetch(url, {
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async function apiPost(endpoint, body) {
    if (!TokenManager.isReady()) {
      throw new Error('Token not available yet');
    }

    const url = `${API_ROOT}${endpoint}`;
    const response = await originalFetch(url, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API POST failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================
  // UTILITY FUNCTIONS (SHARED)
  // ============================================
  function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2: DPS DISPLAY MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // DPS STATE
  // ============================================
  const DPSState = {
    characterId: null,
    inCombat: false,
    combatData: null,
    personalDPS: 0,
    overlayCollapsed: false,
    // World Boss / Guild Boss state
    worldBoss: {
      active: false,
      type: null,  // 'world' ou 'guild'
      spawnId: null,
      characterName: null,
      stats: null,
      bossHp: null,
      bossMaxHp: null,
      bossPercentage: null,
      lastUpdate: 0,
      finished: false,
      dismissed: false
    },
    wbOverlayCollapsed: false,
    // Dungeon state (for current character DPS tracking)
    dungeon: {
      active: false,
      taskId: null,
      dungeonId: null,
      dungeonName: null,
      characterId: null,
      currentRoom: 0,
      chainPosition: 0,
      chainTotal: 0,
      chainLength: 16,
      combatStats: null,
      lastUpdate: 0
    }
  };

  // ============================================
  // DPS UTILITY FUNCTIONS
  // ============================================
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toLocaleString('en-US');
  }

  function isMobile() {
    // Detect mobile via width OR touch capability (for "Desktop site" mode on phones)
    return window.innerWidth < 768 ||
           ('ontouchstart' in window && window.innerWidth < 1200) ||
           (navigator.maxTouchPoints > 0 && window.innerWidth < 1200);
  }

  function isOnCombatPage() {
    const path = window.location.pathname;
    return path.includes('/skills/combat') || path.includes('/skills/view/combat');
  }

  function shouldShowDPSOverlay() {
    if (!DPSState.inCombat) return false;
    // Show overlay on mobile OR if HTML injection failed (fallback for desktop site mode)
    if (isMobile()) {
      return isOnCombatPage();
    }
    // Desktop: check if HTML injection is working, otherwise show overlay as fallback
    const hasInjectedDPS = document.querySelector('[data-dps-inject]');
    return isOnCombatPage() && !hasInjectedDPS;
  }

  function calculateDPS(damage, duration) {
    return duration > 0 ? damage / duration : 0;
  }

  function calculateParticipantDuration(joinedAt) {
    return (Date.now() - joinedAt) / 1000;
  }

  function formatWBDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  // ============================================
  // DPS API RESPONSE HANDLER
  // ============================================
  function handleDPSApiResponse(url, json) {
    // Idle Combat handler
    if (url.includes('/idle-combat/status/')) {
      const charIdMatch = url.match(/\/idle-combat\/status\/([a-f0-9-]{36})/);
      if (charIdMatch) DPSState.characterId = charIdMatch[1];

      if (json.success && json.data) {
        DPSState.inCombat = json.data.in_combat;
        DPSState.combatData = json.data;

        if (json.data.participant_stats && json.data.participant_duration > 0) {
          DPSState.personalDPS = json.data.participant_stats.damage_dealt / json.data.participant_duration;
        }
      }
      return;
    }

    // World Boss participant handler
    const wbParticipantMatch = url.match(/\/worldboss\/participant\/([a-f0-9-]+)\/([a-f0-9-]+)/);
    if (wbParticipantMatch && json.success && json.data) {
      const data = json.data;
      const newSpawnId = wbParticipantMatch[1];

      // Reset if new boss spawn
      if (DPSState.worldBoss.spawnId !== newSpawnId) {
        DPSState.worldBoss.finished = false;
        DPSState.worldBoss.dismissed = false;
      }

      DPSState.worldBoss.active = true;
      DPSState.worldBoss.type = 'world';
      DPSState.worldBoss.spawnId = newSpawnId;
      DPSState.worldBoss.characterName = data.characterName;
      DPSState.worldBoss.stats = data.combatStats;
      DPSState.worldBoss.lastUpdate = Date.now();
      return;
    }

    // World Boss HP handler
    const wbHpMatch = url.match(/\/worldboss\/hp\/([a-f0-9-]+)/);
    if (wbHpMatch && json.success && json.data) {
      const data = json.data;
      DPSState.worldBoss.bossHp = data.current_hp;
      DPSState.worldBoss.bossMaxHp = data.max_hp;
      DPSState.worldBoss.bossPercentage = data.percentage;
      DPSState.worldBoss.lastUpdate = Date.now();

      // Detect boss finished (status not active or HP <= 0)
      if (data.status !== 'active' || data.current_hp <= 0) {
        DPSState.worldBoss.active = false;
        DPSState.worldBoss.finished = true;
      }
      return;
    }

    // Guild World Boss participant handler
    const guildWbParticipantMatch = url.match(/\/guild-worldboss\/participant\/([a-f0-9-]+)\/([a-f0-9-]+)/);
    if (guildWbParticipantMatch && json.success && json.data) {
      const data = json.data;
      const newSpawnId = guildWbParticipantMatch[1];

      // Reset if new boss spawn
      if (DPSState.worldBoss.spawnId !== newSpawnId) {
        DPSState.worldBoss.finished = false;
        DPSState.worldBoss.dismissed = false;
      }

      DPSState.worldBoss.active = true;
      DPSState.worldBoss.type = 'guild';
      DPSState.worldBoss.spawnId = newSpawnId;
      DPSState.worldBoss.characterName = data.characterName;
      DPSState.worldBoss.stats = data.combatStats;  // camelCase pour guild
      DPSState.worldBoss.lastUpdate = Date.now();
      return;
    }

    // Guild World Boss HP handler
    const guildWbHpMatch = url.match(/\/guild-worldboss\/hp\/([a-f0-9-]+)/);
    if (guildWbHpMatch && json.success && json.data) {
      const data = json.data;
      DPSState.worldBoss.bossHp = data.current_hp;
      DPSState.worldBoss.bossMaxHp = data.max_hp;
      DPSState.worldBoss.bossPercentage = (data.current_hp / data.max_hp) * 100;  // calculé
      DPSState.worldBoss.lastUpdate = Date.now();

      // Detect boss finished (HP <= 0)
      if (data.current_hp <= 0) {
        DPSState.worldBoss.active = false;
        DPSState.worldBoss.finished = true;
      }
      return;
    }
  }

  // ============================================
  // DPS CALCULATION FUNCTIONS
  // ============================================
  function getDPSForCharacter(characterName) {
    if (!characterName || !DPSState.combatData) return null;
    const data = DPSState.combatData;

    // Check if player's character
    const myLog = data.combat_log?.participants?.[DPSState.characterId];
    if (characterName === myLog?.character_name) return DPSState.personalDPS;

    // Check group members
    for (const p of data.session_stats?.other_participants || []) {
      if (p.character_name === characterName) {
        const pLog = data.combat_log?.participants?.[p.character_id];
        if (pLog) {
          const duration = pLog.joined_at ? calculateParticipantDuration(pLog.joined_at) : 0;
          return calculateDPS(pLog.combat_stats?.damage_dealt || 0, duration);
        }
      }
    }
    return null;
  }

  function getAllDPS() {
    if (!DPSState.combatData) return [];
    const data = DPSState.combatData;
    const results = [];

    // Player's character
    const myLog = data.combat_log?.participants?.[DPSState.characterId];
    if (myLog) {
      results.push({
        name: myLog.character_name,
        dps: DPSState.personalDPS,
        isPlayer: true
      });
    }

    // Group members
    for (const p of data.session_stats?.other_participants || []) {
      const pLog = data.combat_log?.participants?.[p.character_id];
      if (pLog) {
        const duration = pLog.joined_at ? calculateParticipantDuration(pLog.joined_at) : 0;
        const dps = calculateDPS(pLog.combat_stats?.damage_dealt || 0, duration);
        results.push({
          name: p.character_name,
          dps: dps,
          isPlayer: false
        });
      }
    }

    // Sort by DPS descending
    return results.sort((a, b) => b.dps - a.dps);
  }

  // ============================================
  // DPS INJECTION INTO COMBAT CARDS
  // ============================================
  function injectDPS() {
    if (!DPSState.inCombat || !DPSState.combatData) return;

    document.querySelectorAll('.bg-\\[\\#2A3041\\].p-2.rounded-lg.overflow-hidden.relative.border.transition-all').forEach(card => {
      const statsGrid = card.querySelector('.grid.grid-cols-3.gap-x-2.gap-y-1.text-xs.relative.z-10');
      if (!statsGrid) return;

      const characterName = card.querySelector('.font-semibold.text-white.truncate')?.textContent?.trim();
      const dps = getDPSForCharacter(characterName);
      if (dps === null) return;

      const existing = statsGrid.querySelector('[data-dps-inject]');
      if (existing) {
        existing.querySelector('.dps-val').textContent = formatNumber(dps);
        return;
      }

      const el = document.createElement('div');
      el.className = 'flex items-center gap-1';
      el.setAttribute('data-dps-inject', 'true');
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame w-3 h-3 text-purple-400">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
        <span class="text-purple-300 font-medium"><span class="dps-val">${formatNumber(dps)}</span> DPS</span>
      `;
      statsGrid.insertBefore(el, statsGrid.firstChild);
    });
  }

  // ============================================
  // DPS OVERLAY (MOBILE / FALLBACK)
  // ============================================
  function createDPSOverlay() {
    let overlay = document.getElementById('dps-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'dps-overlay';
    overlay.innerHTML = `
      <div id="dps-overlay-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
        <span style="font-weight: 500;">DPS</span>
        <svg id="dps-overlay-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>
      <div id="dps-overlay-content"></div>
    `;

    overlay.querySelector('#dps-overlay-header').addEventListener('click', () => {
      DPSState.overlayCollapsed = !DPSState.overlayCollapsed;
      overlay.classList.toggle('collapsed', DPSState.overlayCollapsed);
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function updateDPSOverlay() {
    const overlay = document.getElementById('dps-overlay');

    if (!shouldShowDPSOverlay()) {
      if (overlay) overlay.style.display = 'none';
      return;
    }

    const el = overlay || createDPSOverlay();
    el.style.display = 'block';

    const content = el.querySelector('#dps-overlay-content');
    const allDPS = getAllDPS();

    if (allDPS.length === 0) {
      content.innerHTML = '<div style="color: rgba(255,255,255,0.5); padding: 4px 0;">No data</div>';
      return;
    }

    content.innerHTML = allDPS.map(p => `
      <div class="dps-row">
        <span class="dps-name ${p.isPlayer ? 'player' : ''}">${p.name}</span>
        <span class="dps-value">${formatNumber(p.dps)}</span>
      </div>
    `).join('');
  }

  // ============================================
  // WORLD BOSS DPS OVERLAY
  // ============================================
  function createWBDPSOverlay() {
    let overlay = document.getElementById('wb-dps-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'wb-dps-overlay';
    overlay.innerHTML = `
      <div id="wb-dps-overlay-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 9h.01"></path>
          <path d="M15 9h.01"></path>
          <path d="M8 13a4 4 0 0 0 8 0"></path>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.5 0 1-.04 1.5-.12a8.5 8.5 0 0 1-1.5-3.88c0-4.7 3.8-8.5 8.5-8.5.5 0 1 .04 1.5.12C21.96 4.5 17.5 2 12 2"></path>
        </svg>
        <span id="wb-dps-overlay-title" style="font-weight: 500;">World Boss</span>
        <svg id="wb-dps-overlay-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
        <div id="wb-dps-overlay-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
      </div>
      <div id="wb-dps-overlay-content"></div>
    `;

    overlay.querySelector('#wb-dps-overlay-header').addEventListener('click', (e) => {
      // Don't toggle if clicking the close button
      if (e.target.closest('#wb-dps-overlay-close')) return;
      DPSState.wbOverlayCollapsed = !DPSState.wbOverlayCollapsed;
      overlay.classList.toggle('collapsed', DPSState.wbOverlayCollapsed);
    });

    overlay.querySelector('#wb-dps-overlay-close').addEventListener('click', (e) => {
      e.stopPropagation();
      DPSState.worldBoss.dismissed = true;
      overlay.style.display = 'none';
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function updateWBDPSOverlay() {
    const overlay = document.getElementById('wb-dps-overlay');
    const wb = DPSState.worldBoss;

    // Hide if dismissed by user or no stats available
    if (wb.dismissed || !wb.stats) {
      if (overlay) overlay.style.display = 'none';
      return;
    }

    // Hide if not active and not finished (no data to show)
    if (!wb.active && !wb.finished) {
      if (overlay) overlay.style.display = 'none';
      return;
    }

    const el = overlay || createWBDPSOverlay();
    el.style.display = 'block';

    // Update title dynamically with finished badge
    const title = el.querySelector('#wb-dps-overlay-title');
    if (title) {
      const bossType = wb.type === 'guild' ? 'Guild Boss' : 'World Boss';
      const finishedBadge = wb.finished ? '<span class="wb-finished-badge">- Finished</span>' : '';
      title.innerHTML = `${bossType}${finishedBadge}`;
    }

    const content = el.querySelector('#wb-dps-overlay-content');
    const stats = wb.stats;
    const durationSec = stats.totalCombatDuration / 1000;

    const dps = durationSec > 0 ? stats.damageDealt / durationSec : 0;
    const dtps = durationSec > 0 ? stats.damageTaken / durationSec : 0;
    const hps = durationSec > 0 ? stats.healthRecovered / durationSec : 0;

    content.innerHTML = `
      <div class="wb-char-name-dps">${wb.characterName || 'Unknown'}</div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">DPS</span>
        <span class="wb-stat-value">${formatNumber(dps)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Total Damage</span>
        <span class="wb-stat-value">${formatNumber(stats.damageDealt)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Total Duration</span>
        <span class="wb-stat-value">${formatWBDuration(stats.totalCombatDuration)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Dmg Taken/s</span>
        <span class="wb-stat-value">${formatNumber(dtps)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Heal/s</span>
        <span class="wb-stat-value">${formatNumber(hps)}</span>
      </div>
      ${wb.bossPercentage !== null ? `
      <div class="wb-stat-row">
        <span class="wb-stat-label">Boss HP</span>
        <span class="wb-stat-value boss-hp">${wb.bossPercentage.toFixed(1)}%</span>
      </div>
      ` : ''}
    `;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 3: CHARACTER MONITOR MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // CHARACTER DATA STORAGE
  // ============================================
  window.allCharactersData = {
    characters: {},
    charactersList: [],
    charactersMap: {},         // Map of character_id -> full character info (name, class, pfp, etc.)
    portraitsOrder: [],        // Array of character names in navbar order
    portraitImages: {},        // Map of character name -> portrait URL
    lastUpdate: null
  };

  // ============================================
  // WAIT FOR PORTRAITS IN DOM
  // ============================================
  async function waitForPortraits(maxWaitMs = 10000) {
    return new Promise((resolve) => {
      const checkPortraits = () => {
        const allPortraits = document.querySelectorAll('button img[alt]');
        const portraits = Array.from(allPortraits).filter(img => {
          const parentClasses = img.parentElement?.className || '';
          return parentClasses.includes('relative') &&
                 parentClasses.includes('w-9') &&
                 parentClasses.includes('h-9') &&
                 parentClasses.includes('rounded-lg') &&
                 !parentClasses.includes('md:hidden');
        });

        if (portraits.length > 0) {
          console.log(`[Monitor] Found ${portraits.length} portraits in DOM`);
          return portraits;
        }
        return null;
      };

      // Try immediately
      const immediate = checkPortraits();
      if (immediate) {
        resolve(immediate);
        return;
      }

      // Otherwise, poll every 200ms
      const startTime = Date.now();
      const interval = setInterval(() => {
        const found = checkPortraits();
        if (found) {
          clearInterval(interval);
          resolve(found);
        } else if (Date.now() - startTime > maxWaitMs) {
          console.warn('[Monitor] Timeout waiting for portraits in DOM');
          clearInterval(interval);
          resolve([]);
        }
      }, 200);
    });
  }

  // ============================================
  // SCAN PORTRAITS FROM DOM
  // ============================================
  function scanPortraitsMonitor(portraits) {
    const portraitsData = portraits.map(img => ({
      name: img.alt,
      imageUrl: img.src
    }));

    window.allCharactersData.portraitsOrder = portraitsData.map(p => p.name);
    window.allCharactersData.portraitImages = Object.fromEntries(
      portraitsData.map(p => [p.name, p.imageUrl])
    );

    console.log(`[Monitor] Scanned portraits:`, portraitsData.map(p => p.name));
  }

  // ============================================
  // LOAD CHARACTER NAMES AND INFO
  // ============================================
  window.loadCharacterNames = async function(waitForDom = true) {
    try {
      if (!TokenManager.isReady()) {
        console.log('[Monitor] Token not ready yet, cannot load character names');
        return false;
      }

      // Step 1: Wait for portraits in DOM (if requested)
      if (waitForDom) {
        console.log('[Monitor] Waiting for portraits in DOM...');
        const portraits = await waitForPortraits();
        if (portraits.length > 0) {
          scanPortraitsMonitor(portraits);
        }
      }

      // Step 2: Load character data from API
      console.log('[Monitor] Loading character names from API...');
      const allCharsData = await apiCall('characters/all');

      if (!allCharsData.success || !allCharsData.characters) {
        console.error('[Monitor] Failed to get character list');
        return false;
      }

      const charactersList = allCharsData.characters;
      window.allCharactersData.charactersList = charactersList;

      // Create a map of character_id -> character info for easy lookup
      window.allCharactersData.charactersMap = Object.fromEntries(
        charactersList.map(char => [char.id, char])
      );

      console.log(`[Monitor] Loaded ${charactersList.length} character names`);

      // Step 3: Update toggle icon with proper pfp
      updateMonitorToggleIcon();

      return true;
    } catch (error) {
      console.error('[Monitor] Error loading character names:', error);
      return false;
    }
  };

  // ============================================
  // REFRESH ALL CHARACTERS
  // ============================================
  window.refreshAllCharacters = async function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('[Monitor] Refreshing all characters via API...');
    console.log('═══════════════════════════════════════════════════════');

    // Update UI refresh button state
    const refreshBtn = document.getElementById('mc-refresh-btn');
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.style.opacity = '0.5';
    }

    try {
      // Check token
      if (!TokenManager.isReady()) {
        console.error('[Monitor] Token not captured yet!');
        console.log('[Monitor] Navigate in the game (visit a skill page) to capture the token');
        return;
      }

      console.log('[Monitor] Token ready');

      // Step 1: Get list of all characters with their names
      console.log('\n[Monitor] Step 1: Fetching character list...');
      const allCharsData = await apiCall('characters/all');

      if (!allCharsData.success || !allCharsData.characters) {
        console.error('[Monitor] Failed to get character list');
        return;
      }

      const charactersList = allCharsData.characters;
      window.allCharactersData.charactersList = charactersList;

      // Create a map of character_id -> character info for easy lookup
      window.allCharactersData.charactersMap = Object.fromEntries(
        charactersList.map(char => [char.id, char])
      );

      console.log(`[Monitor] Found ${charactersList.length} characters:`);
      charactersList.forEach((char, i) => {
        console.log(`   ${i + 1}. ${char.name} (${char.class}) - ${char.id.substring(0, 8)}...`);
      });

      // Step 2: Scan DOM to get portrait order (optional, for sorting)
      console.log('\n[Monitor] Step 2: Scanning navbar for portrait order...');
      const portraits = await waitForPortraits();
      if (portraits.length > 0) {
        scanPortraitsMonitor(portraits);
        // Update toggle button icon with first character's portrait
        updateMonitorToggleIcon();
      } else {
        console.warn('[Monitor] No portraits found in DOM');
      }

      // Step 3: Fetch data for each character
      console.log('\n[Monitor] Step 3: Fetching character data...');

      for (let i = 0; i < charactersList.length; i++) {
        const char = charactersList[i];
        const charId = char.id;

        // Get character name from the map we created
        const characterName = window.allCharactersData.charactersMap[charId]?.name || charId.substring(0, 8) + '...';

        console.log(`\n[${i + 1}/${charactersList.length}] Fetching data for ${characterName} (${charId.substring(0, 8)}...)...`);

        try {
          const data = await apiCall(`batch/periodic-status/${charId}`);

          if (!data.success) {
            console.error(`   [Monitor] API returned success=false`);
            continue;
          }

          // Extract combat info
          const combat = data.data.activeCombat;
          let combatInfo = null;

          if (combat) {
            // Extract energy from combat_log
            let energy = null;
            if (combat.combat_log?.participants?.[charId]) {
              const participant = combat.combat_log.participants[charId];
              energy = {
                current: participant.current_energy,
                max: participant.max_energy,
                percent: Math.round((participant.current_energy / participant.max_energy) * 100)
              };
            }

            combatInfo = {
              in_combat: combat.in_combat,
              current_hp: combat.in_combat ? combat.participant_stats?.current_hp : null,
              max_hp: combat.in_combat ? combat.participant_stats?.max_hp : null,
              hp_percent: combat.in_combat ? combat.participant_stats?.hp_percentage : null,
              actions_performed: combat.in_combat ? combat.participant_stats?.actions_performed : 0,
              monsters_killed: combat.in_combat ? combat.participant_stats?.monsters_killed : 0,
              location_id: combat.in_combat ? combat.location_id : null,
              current_monster: combat.in_combat ? combat.current_monster : null,
              energy: energy,
              participant_duration: combat.participant_duration || 0
            };
          }

          // Extract tasks info
          const tasks = data.data.activeTasks || [];
          const tasksInfo = tasks.map(t => ({
            id: t.id,
            skill: t.skill_name,
            item: t.item_name,
            progress: `${t.actions_completed}/${t.total_actions}`,
            actions_completed: t.actions_completed,
            total_actions: t.total_actions,
            percent: Math.round((t.actions_completed / t.total_actions) * 100),
            exp_earned: t.exp_earned
          }));

          // Fetch dungeon status (only if not in combat - can't be in both)
          let dungeonInfo = null;
          if (!combatInfo?.in_combat) {
            try {
              const dungeonData = await getDungeonStatus(charId);
              if (dungeonData.tasks && dungeonData.tasks.length > 0 && dungeonData.tasks[0].is_active) {
                const dg = dungeonData.tasks[0];
                dungeonInfo = {
                  active: true,
                  taskId: dg.id,
                  dungeonId: dg.dungeon_id,
                  dungeonName: dg.dungeon?.dungeon_name || 'Unknown',
                  currentRoom: dg.current_room || 0,
                  chainPosition: dg.chain_position || 0,
                  chainTotal: dg.chain_total || 16,
                  chainLength: 16
                };
              }
            } catch (dgError) {
              console.log(`   [Monitor] No dungeon data for ${characterName}`);
            }
          }

          // Store character data
          window.allCharactersData.characters[charId] = {
            character_id: charId,
            character_name: characterName,
            lastUpdate: new Date().toISOString(),
            combat: combatInfo,
            dungeon: dungeonInfo,
            tasks: tasksInfo
          };

          // Update UI after each character (real-time feedback)
          updateMonitorPanel();

          // Log summary
          console.log(`   [Monitor] ${characterName}`);
          if (combatInfo?.in_combat) {
            console.log(`      HP: ${combatInfo.current_hp}/${combatInfo.max_hp} (${combatInfo.hp_percent}%)`);
            if (combatInfo.energy) {
              console.log(`      Energy: ${combatInfo.energy.current}/${combatInfo.energy.max} (${combatInfo.energy.percent}%)`);
            }
            console.log(`      Actions: ${combatInfo.actions_performed.toLocaleString()} | Kills: ${combatInfo.monsters_killed}`);
          } else if (dungeonInfo?.active) {
            console.log(`      DUNGEON: ${dungeonInfo.dungeonName}`);
            console.log(`      Room: ${dungeonInfo.currentRoom} | Chain: ${dungeonInfo.chainPosition}/${dungeonInfo.chainTotal}`);
          } else {
            console.log(`      Not in combat`);
          }

          if (tasksInfo.length > 0) {
            const task = tasksInfo[0];
            console.log(`      Task: ${task.skill} - ${task.item} (${task.percent}%)`);
          } else {
            console.log(`      No active task`);
          }

          // Random delay between API calls to appear more natural (300-800ms)
          if (i < charactersList.length - 1) {
            const delay = Math.random() * 500 + 300; // Random between 300-800ms
            await sleep(delay);
          }

        } catch (error) {
          console.error(`   [Monitor] Error fetching data:`, error.message);
        }
      }

      window.allCharactersData.lastUpdate = new Date().toISOString();

      console.log('\n═══════════════════════════════════════════════════════');
      console.log('[Monitor] Refresh complete!');
      console.log('═══════════════════════════════════════════════════════');

      // Update UI
      updateMonitorPanel();

    } catch (error) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('[Monitor] Error during refresh:');
      console.error(error);
      console.error('═══════════════════════════════════════════════════════');
    } finally {
      // Restore refresh button
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.style.opacity = '1';
      }
    }
  };

  // ============================================
  // RESTART TASK FOR A CHARACTER
  // ============================================
  window.restartTask = async function(taskId, characterId, characterName) {
    console.log(`[Monitor] Restarting task for ${characterName}...`);

    if (!TokenManager.isReady()) {
      console.error('[Monitor] Token not ready');
      return false;
    }

    try {
      const response = await originalFetch(`${API_ROOT}tasks/${taskId}/restart`, {
        method: 'POST',
        headers: {
          'Authorization': TokenManager.authToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'https://degenidle.com',
          'Referer': 'https://degenidle.com/'
        },
        body: JSON.stringify({
          characterId: characterId
        })
      });

      if (!response.ok) {
        throw new Error(`Restart failed: ${response.status}`);
      }

      const result = await response.json();
      console.log(`[Monitor] Task restarted for ${characterName}`);

      // Auto-refresh character data after 500ms
      setTimeout(async () => {
        console.log(`[Monitor] Refreshing ${characterName} data...`);
        const data = await apiCall(`batch/periodic-status/${characterId}`);

        if (data.success) {
          const tasks = data.data.activeTasks || [];
          const tasksInfo = tasks.map(t => ({
            id: t.id,
            skill: t.skill_name,
            item: t.item_name,
            progress: `${t.actions_completed}/${t.total_actions}`,
            actions_completed: t.actions_completed,
            total_actions: t.total_actions,
            percent: Math.round((t.actions_completed / t.total_actions) * 100),
            exp_earned: t.exp_earned
          }));

          window.allCharactersData.characters[characterId].tasks = tasksInfo;
          window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();

          updateMonitorPanel();
          showMonitorNotification(`Task restarted for ${characterName}`, 'success', 2000);
          console.log(`[Monitor] ${characterName} data refreshed`);
        }
      }, 500);

      return result;

    } catch (error) {
      const errorMsg = `Error restarting task for ${characterName}: ${error.message}`;
      showMonitorNotification(errorMsg, 'error');
      console.error(`[Monitor] ${errorMsg}`);
      return false;
    }
  };

  // ============================================
  // RESTART ALL TASKS
  // ============================================
  window.restartAllTasks = async function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('[Monitor] Restarting all active tasks...');
    console.log('═══════════════════════════════════════════════════════');

    const characters = Object.values(window.allCharactersData.characters)
      .filter(char => char.tasks && char.tasks.length > 0 && char.tasks[0].id);

    if (characters.length === 0) {
      const msg = 'No active tasks to restart';
      showMonitorNotification(msg, 'info');
      console.log(`[Monitor] ${msg}`);
      return;
    }

    showMonitorNotification(`Restarting ${characters.length} task(s)...`, 'info');
    let count = 0;

    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const task = char.tasks[0];

      showMonitorNotification(`Restarting task for ${char.character_name}...`, 'info', 2000);
      await restartTask(task.id, char.character_id, char.character_name);
      count++;

      // Random delay between restarts to appear more natural (800-1300ms)
      if (i < characters.length - 1) {
        const delay = Math.random() * 500 + 800;
        await sleep(delay);
      }
    }

    const finalMsg = `All tasks restarted (${count}/${characters.length})`;
    showMonitorNotification(finalMsg, 'success', 5000);
    console.log(`[Monitor] ${finalMsg}`);
    console.log('═══════════════════════════════════════════════════════');
  };

  // ============================================
  // LEAVE COMBAT
  // ============================================
  async function leaveCombat(characterId) {
    const response = await originalFetch(`${API_ROOT}idle-combat/leave`, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify({
        characterId: characterId
      })
    });

    if (!response.ok) {
      throw new Error(`Leave combat failed: ${response.status}`);
    }

    return await response.json();
  }

  // ============================================
  // JOIN COMBAT
  // ============================================
  async function joinCombat(characterId, combatId) {
    const response = await originalFetch(`${API_ROOT}idle-combat/join`, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify({
        characterId: characterId,
        combatId: combatId
      })
    });

    if (!response.ok) {
      throw new Error(`Join combat failed: ${response.status}`);
    }

    return await response.json();
  }

  // ============================================
  // GET DUNGEON STATUS
  // ============================================
  async function getDungeonStatus(characterId) {
    const url = `${API_ROOT}dungeons/history/${characterId}?activeOnly=true&page=1&limit=10`;
    const response = await originalFetch(url, {
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      }
    });

    if (!response.ok) {
      throw new Error(`Get dungeon status failed: ${response.status}`);
    }

    return await response.json();
  }

  // ============================================
  // CANCEL DUNGEON
  // ============================================
  async function cancelDungeon(taskId, characterId) {
    const response = await originalFetch(`${API_ROOT}dungeons/cancel/${taskId}`, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify({ characterId: characterId })
    });

    if (!response.ok) {
      throw new Error(`Cancel dungeon failed: ${response.status}`);
    }

    return await response.json();
  }

  // ============================================
  // START DUNGEON
  // ============================================
  async function startDungeon(characterIds, dungeonId, chainLength = 16) {
    const response = await originalFetch(`${API_ROOT}dungeons/start`, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify({
        characterIds: characterIds,
        dungeonId: dungeonId,
        leaderId: characterIds[0],
        chainLength: chainLength,
        mode: "solo"
      })
    });

    if (!response.ok) {
      throw new Error(`Start dungeon failed: ${response.status}`);
    }

    return await response.json();
  }

  // ============================================
  // CALCULATE TASK (get maxActions)
  // ============================================
  async function calculateTask(characterId, skillName, itemName) {
    return await apiPost('tasks/calculate', {
      characterId: characterId,
      skillName: skillName,
      itemName: itemName
    });
  }

  // ============================================
  // START TASK
  // ============================================
  async function startTask(characterId, skillName, itemName, totalActions) {
    return await apiPost('tasks/start', {
      characterId: characterId,
      skillName: skillName,
      itemName: itemName,
      totalActions: totalActions
    });
  }

  // ============================================
  // RESTART COMBAT FOR A CHARACTER
  // ============================================
  window.restartCombat = async function(characterId, locationId, characterName, skipAutoRefresh = false) {
    showMonitorNotification(`Restarting combat for ${characterName}...`, 'info');
    console.log(`[Monitor] Restarting combat for ${characterName}...`);

    if (!TokenManager.isReady()) {
      const errorMsg = 'Token not ready';
      showMonitorNotification(errorMsg, 'error');
      console.error('[Monitor]', errorMsg);
      return false;
    }

    try {
      // Step 1: Leave combat
      console.log(`[Monitor]   1/3: Leaving combat...`);
      await leaveCombat(characterId);

      // Step 2: Wait random delay (1200-2100ms)
      const delay = Math.random() * 900 + 1200;
      console.log(`[Monitor]   2/3: Waiting ${Math.round(delay)}ms...`);
      await sleep(delay);

      // Step 3: Join combat again
      console.log(`[Monitor]   3/3: Rejoining combat...`);
      await joinCombat(characterId, locationId);

      console.log(`[Monitor] Combat restarted for ${characterName}`);

      // Step 4: Refresh character data after 500ms (only if not skipping auto-refresh)
      if (!skipAutoRefresh) {
        setTimeout(async () => {
          const data = await apiCall(`batch/periodic-status/${characterId}`);

          if (data.success) {
            const combat = data.data.activeCombat;
            let combatInfo = null;

            if (combat) {
              let energy = null;
              if (combat.combat_log?.participants?.[characterId]) {
                const participant = combat.combat_log.participants[characterId];
                energy = {
                  current: participant.current_energy,
                  max: participant.max_energy,
                  percent: Math.round((participant.current_energy / participant.max_energy) * 100)
                };
              }

              combatInfo = {
                in_combat: combat.in_combat,
                current_hp: combat.in_combat ? combat.participant_stats?.current_hp : null,
                max_hp: combat.in_combat ? combat.participant_stats?.max_hp : null,
                hp_percent: combat.in_combat ? combat.participant_stats?.hp_percentage : null,
                actions_performed: combat.in_combat ? combat.participant_stats?.actions_performed : 0,
                monsters_killed: combat.in_combat ? combat.participant_stats?.monsters_killed : 0,
                location_id: combat.in_combat ? combat.location_id : null,
                current_monster: combat.in_combat ? combat.current_monster : null,
                energy: energy,
                participant_duration: combat.participant_duration || 0
              };
            }

            window.allCharactersData.characters[characterId].combat = combatInfo;
            window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();

            updateMonitorPanel();
            showMonitorNotification(`Combat restarted for ${characterName}`, 'success');
          }
        }, 500);
      }

      return true;

    } catch (error) {
      const errorMsg = `Error restarting combat for ${characterName}: ${error.message}`;
      showMonitorNotification(errorMsg, 'error');
      console.error('[Monitor]', errorMsg);
      return false;
    }
  };

  // ============================================
  // RESTART ALL COMBATS
  // ============================================
  window.restartAllCombats = async function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('[Monitor] Restarting all active combats...');
    console.log('═══════════════════════════════════════════════════════');

    const characters = Object.values(window.allCharactersData.characters)
      .filter(char => char.combat?.in_combat && char.combat?.location_id);

    if (characters.length === 0) {
      const msg = 'No characters in combat';
      showMonitorNotification(msg, 'info');
      console.log(`[Monitor] ${msg}`);
      return;
    }

    showMonitorNotification(`Restarting ${characters.length} combat(s)...`, 'info');
    let successCount = 0;
    const restartedCharacterIds = [];

    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];

      // Skip auto-refresh for each individual restart
      const result = await restartCombat(char.character_id, char.combat.location_id, char.character_name, true);
      if (result) {
        successCount++;
        restartedCharacterIds.push(char.character_id);
      }

      // Random delay between characters (1800-2300ms)
      if (i < characters.length - 1) {
        const delay = Math.random() * 500 + 1800;
        console.log(`[Monitor] Waiting ${Math.round(delay)}ms before next character...`);
        await sleep(delay);
      }
    }

    // Wait a bit then do a single global refresh for all restarted characters
    console.log('[Monitor] Waiting 1000ms before global refresh...');
    await sleep(1000);

    console.log('[Monitor] Refreshing all restarted characters...');
    for (const characterId of restartedCharacterIds) {
      try {
        const data = await apiCall(`batch/periodic-status/${characterId}`);

        if (data.success) {
          const combat = data.data.activeCombat;
          let combatInfo = null;

          if (combat) {
            let energy = null;
            if (combat.combat_log?.participants?.[characterId]) {
              const participant = combat.combat_log.participants[characterId];
              energy = {
                current: participant.current_energy,
                max: participant.max_energy,
                percent: Math.round((participant.current_energy / participant.max_energy) * 100)
              };
            }

            combatInfo = {
              in_combat: combat.in_combat,
              current_hp: combat.in_combat ? combat.participant_stats?.current_hp : null,
              max_hp: combat.in_combat ? combat.participant_stats?.max_hp : null,
              hp_percent: combat.in_combat ? combat.participant_stats?.hp_percentage : null,
              actions_performed: combat.in_combat ? combat.participant_stats?.actions_performed : 0,
              monsters_killed: combat.in_combat ? combat.participant_stats?.monsters_killed : 0,
              location_id: combat.in_combat ? combat.location_id : null,
              current_monster: combat.in_combat ? combat.current_monster : null,
              energy: energy,
              participant_duration: combat.participant_duration || 0
            };
          }

          window.allCharactersData.characters[characterId].combat = combatInfo;
          window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();
        }
      } catch (error) {
        console.error(`[Monitor] Error refreshing character ${characterId}:`, error.message);
      }
    }

    // Single panel update at the end
    updateMonitorPanel();

    const finalMsg = `All combats restarted (${successCount}/${characters.length})`;
    showMonitorNotification(finalMsg, 'success', 5000);
    console.log(`[Monitor] ${finalMsg}`);
    console.log('═══════════════════════════════════════════════════════');
  };

  // ============================================
  // RESTART DUNGEON FOR A CHARACTER
  // ============================================
  window.restartDungeon = async function(characterId, dungeonId, characterName, taskId, skipAutoRefresh = false) {
    showMonitorNotification(`Restarting dungeon for ${characterName}...`, 'info');
    console.log(`[Monitor] Restarting dungeon for ${characterName}...`);

    if (!TokenManager.isReady()) {
      const errorMsg = 'Token not ready';
      showMonitorNotification(errorMsg, 'error');
      console.error('[Monitor]', errorMsg);
      return false;
    }

    try {
      // Step 1: Cancel dungeon
      console.log(`[Monitor]   1/3: Cancelling dungeon...`);
      await cancelDungeon(taskId, characterId);

      // Step 2: Wait random delay (1200-2100ms)
      const delay = Math.random() * 900 + 1200;
      console.log(`[Monitor]   2/3: Waiting ${Math.round(delay)}ms...`);
      await sleep(delay);

      // Step 3: Start dungeon again
      console.log(`[Monitor]   3/3: Starting new dungeon...`);
      await startDungeon([characterId], dungeonId, 16);

      console.log(`[Monitor] Dungeon restarted for ${characterName}`);

      // Step 4: Refresh character data after 500ms (only if not skipping auto-refresh)
      if (!skipAutoRefresh) {
        setTimeout(async () => {
          try {
            const dungeonData = await getDungeonStatus(characterId);
            let dungeonInfo = null;

            if (dungeonData.tasks && dungeonData.tasks.length > 0 && dungeonData.tasks[0].is_active) {
              const dg = dungeonData.tasks[0];
              dungeonInfo = {
                active: true,
                taskId: dg.id,
                dungeonId: dg.dungeon_id,
                dungeonName: dg.dungeon?.dungeon_name || 'Unknown',
                currentRoom: dg.current_room || 0,
                chainPosition: dg.chain_position || 0,
                chainTotal: dg.chain_total || 16,
                chainLength: 16
              };
            }

            window.allCharactersData.characters[characterId].dungeon = dungeonInfo;
            window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();

            updateMonitorPanel();
            showMonitorNotification(`Dungeon restarted for ${characterName}`, 'success');
          } catch (error) {
            console.error(`[Monitor] Error refreshing dungeon status:`, error.message);
          }
        }, 500);
      }

      return true;

    } catch (error) {
      const errorMsg = `Error restarting dungeon for ${characterName}: ${error.message}`;
      showMonitorNotification(errorMsg, 'error');
      console.error('[Monitor]', errorMsg);
      return false;
    }
  };

  // ============================================
  // RESTART ALL DUNGEONS
  // ============================================
  window.restartAllDungeons = async function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('[Monitor] Restarting all active dungeons...');
    console.log('═══════════════════════════════════════════════════════');

    const characters = Object.values(window.allCharactersData.characters)
      .filter(char => char.dungeon?.active && char.dungeon?.taskId && char.dungeon?.dungeonId);

    if (characters.length === 0) {
      const msg = 'No characters in dungeons';
      showMonitorNotification(msg, 'info');
      console.log(`[Monitor] ${msg}`);
      return;
    }

    showMonitorNotification(`Restarting ${characters.length} dungeon(s)...`, 'info');
    let successCount = 0;
    const restartedCharacterIds = [];

    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];

      // Skip auto-refresh for each individual restart
      const result = await restartDungeon(
        char.character_id,
        char.dungeon.dungeonId,
        char.character_name,
        char.dungeon.taskId,
        true
      );
      if (result) {
        successCount++;
        restartedCharacterIds.push(char.character_id);
      }

      // Random delay between characters (1800-2300ms)
      if (i < characters.length - 1) {
        const delay = Math.random() * 500 + 1800;
        console.log(`[Monitor] Waiting ${Math.round(delay)}ms before next character...`);
        await sleep(delay);
      }
    }

    // Wait a bit then do a single global refresh for all restarted characters
    console.log('[Monitor] Waiting 1000ms before global refresh...');
    await sleep(1000);

    console.log('[Monitor] Refreshing all restarted characters...');
    for (const characterId of restartedCharacterIds) {
      try {
        const dungeonData = await getDungeonStatus(characterId);
        let dungeonInfo = null;

        if (dungeonData.tasks && dungeonData.tasks.length > 0 && dungeonData.tasks[0].is_active) {
          const dg = dungeonData.tasks[0];
          dungeonInfo = {
            active: true,
            taskId: dg.id,
            dungeonId: dg.dungeon_id,
            dungeonName: dg.dungeon?.dungeon_name || 'Unknown',
            currentRoom: dg.current_room || 0,
            chainPosition: dg.chain_position || 0,
            chainTotal: dg.chain_total || 16,
            chainLength: 16
          };
        }

        window.allCharactersData.characters[characterId].dungeon = dungeonInfo;
        window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();
      } catch (error) {
        console.error(`[Monitor] Error refreshing character ${characterId}:`, error.message);
      }
    }

    // Single panel update at the end
    updateMonitorPanel();

    const finalMsg = `All dungeons restarted (${successCount}/${characters.length})`;
    showMonitorNotification(finalMsg, 'success', 5000);
    console.log(`[Monitor] ${finalMsg}`);
    console.log('═══════════════════════════════════════════════════════');
  };

  // ============================================
  // CONSOLE HELPER - Display all characters
  // ============================================
  window.showAllCharacters = function() {
    console.log("\n" + "=".repeat(60));
    console.log("ALL CHARACTERS STATUS");
    console.log("=".repeat(60));

    const data = window.allCharactersData;

    if (Object.keys(data.characters).length === 0) {
      console.log("No data yet - run refreshAllCharacters()");
      return;
    }

    Object.values(data.characters).forEach((charData, i) => {
      console.log(`\nCharacter ${i + 1}: ${charData.character_name}`);
      console.log(`   ID: ${charData.character_id}`);

      if (charData.combat?.in_combat) {
        console.log(`   COMBAT:`);
        console.log(`      HP: ${charData.combat.current_hp}/${charData.combat.max_hp} (${charData.combat.hp_percent}%)`);
        if (charData.combat.energy) {
          console.log(`      Energy: ${charData.combat.energy.current}/${charData.combat.energy.max} (${charData.combat.energy.percent}%)`);
        }
        console.log(`      Actions: ${charData.combat.actions_performed.toLocaleString()} | Kills: ${charData.combat.monsters_killed}`);
        console.log(`      Location: ${charData.combat.location_id}`);
        if (charData.combat.current_monster) {
          console.log(`      Fighting: ${charData.combat.current_monster.name} Lv${charData.combat.current_monster.level} (${charData.combat.current_monster.hp_percentage}% HP)`);
        }
      } else {
        console.log(`   Not in combat`);
      }

      if (charData.tasks.length > 0) {
        charData.tasks.forEach(task => {
          console.log(`   TASK: ${task.skill} - ${task.item}`);
          console.log(`      Progress: ${task.progress} (${task.percent}%) | XP: ${task.exp_earned}`);
        });
      } else {
        console.log(`   No active task`);
      }

      console.log(`   Last update: ${new Date(charData.lastUpdate).toLocaleTimeString()}`);
    });

    console.log("\n" + "=".repeat(60));
  };

  // ============================================
  // CHECK TOKEN STATUS
  // ============================================
  window.checkToken = function() {
    const status = TokenManager.getStatus();
    console.log('═══════════════════════════════════════════════════════');
    console.log('Token Manager Status:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Token captured:', status.hasToken ? 'YES' : 'NO');
    if (status.tokenAge !== null) {
      console.log('Token age:', status.tokenAge + 's');
    }
    console.log('═══════════════════════════════════════════════════════');

    if (TokenManager.isReady()) {
      console.log('Ready! Run refreshAllCharacters() to fetch data');
    } else {
      console.log('Not ready yet. Navigate in the game (visit a skill page)');
    }
  };

  // ============================================
  // DIAGNOSTIC FUNCTION - For troubleshooting
  // ============================================
  window.diagnoseMonitor = function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('DIAGNOSTIC REPORT - DegenIdle Toolkit v4.9');
    console.log('═══════════════════════════════════════════════════════');

    // 1. Check if script is loaded properly
    console.log('\n1. SCRIPT STATUS:');
    console.log('   diagnoseMonitor function exists (script loaded)');
    console.log('   DEBUG_MODE:', DEBUG_MODE);

    // 2. Check fetch/XHR interceptors
    console.log('\n2. INTERCEPTORS:');
    console.log('   window.fetch modified:', window.fetch !== originalFetch ? 'YES' : 'NO');
    console.log('   XHR.open modified:', XMLHttpRequest.prototype.open !== originalXHROpen ? 'YES' : 'NO');
    console.log('   XHR.setRequestHeader modified:', XMLHttpRequest.prototype.setRequestHeader !== originalXHRSetRequestHeader ? 'YES' : 'NO');

    // 3. Check token status
    console.log('\n3. TOKEN STATUS:');
    const status = TokenManager.getStatus();
    console.log('   Token captured:', status.hasToken ? 'YES' : 'NO');
    if (status.hasToken) {
      console.log('   Token length:', TokenManager.authToken?.length);
      console.log('   Token age:', status.tokenAge + 's');
    }

    // 4. Check data storage
    console.log('\n4. DATA STORAGE:');
    console.log('   window.allCharactersData exists:', !!window.allCharactersData);
    console.log('   Characters loaded:', Object.keys(window.allCharactersData?.characters || {}).length);
    console.log('   Characters list:', window.allCharactersData?.charactersList?.length || 0);
    console.log('   Characters map:', Object.keys(window.allCharactersData?.charactersMap || {}).length);
    console.log('   Portraits order:', window.allCharactersData?.portraitsOrder?.length || 0);

    // 5. Check UI
    console.log('\n5. UI STATUS:');
    console.log('   Monitor toggle button exists:', !!document.getElementById('mc-monitor-toggle'));
    console.log('   Monitor panel exists:', !!document.getElementById('mc-monitor-panel'));
    console.log('   Monitor content container exists:', !!document.getElementById('mc-content'));
    console.log('   WB toggle button exists:', !!document.getElementById('wb-toggle'));
    console.log('   WB panel exists:', !!document.getElementById('wb-panel'));

    // 6. Check browser environment
    console.log('\n6. BROWSER ENVIRONMENT:');
    console.log('   Current URL:', window.location.href);
    console.log('   Origin:', window.location.origin);
    console.log('   User Agent:', navigator.userAgent.substring(0, 50) + '...');

    // 7. Suggestions
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('TROUBLESHOOTING SUGGESTIONS:');

    if (!status.hasToken) {
      console.log('   Token not captured. Try:');
      console.log('      1. Refresh the page with Ctrl+Shift+R (hard refresh)');
      console.log('      2. Make sure you are logged in to DegenIdle');
      console.log('      3. Navigate in the game (click skills, change character)');
      console.log('      4. Check if Tampermonkey is enabled');
      console.log('      5. Check if there are any console errors above');
      console.log('      6. Try disabling other userscripts/extensions');
    } else {
      console.log('   Token is captured! Run refreshAllCharacters() to fetch data');
    }

    console.log('═══════════════════════════════════════════════════════');

    return {
      tokenCaptured: status.hasToken,
      debugMode: DEBUG_MODE,
      charactersLoaded: Object.keys(window.allCharactersData?.characters || {}).length,
      monitorUiLoaded: !!document.getElementById('mc-monitor-panel'),
      wbUiLoaded: !!document.getElementById('wb-panel')
    };
  };

  // ============================================
  // EXPORT CREDENTIALS - For CLI Usage
  // ============================================
  window.exportCredentials = function() {
    if (!TokenManager.isReady()) {
      console.log('Token not captured yet!');
      console.log('Navigate in the game first to capture the token');
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('CREDENTIALS FOR CLI');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nTOKEN:');
    console.log(TokenManager.authToken);
    console.log('\nCHARACTER IDs:');

    if (window.allCharactersData.charactersList.length > 0) {
      window.allCharactersData.charactersList.forEach((char, i) => {
        console.log(`\n${i + 1}. ${char.name} (${char.class})`);
        console.log(`   ID: ${char.id}`);
      });
    } else {
      console.log('No characters loaded yet');
      console.log('Run: await loadCharacterNames()');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Copy these values for CLI configuration');
    console.log('═══════════════════════════════════════════════════════');
  };

  // ============================================
  // MONITOR NOTIFICATION SYSTEM
  // ============================================
  let monitorNotificationIdCounter = 0;

  function showMonitorNotification(message, type = 'info', duration = 3000) {
    const id = `mc-notification-${monitorNotificationIdCounter++}`;
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `mc-notification mc-notification-${type}`;
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Position stacked notifications
    const allNotifications = document.querySelectorAll('.mc-notification');
    let offset = 20;
    allNotifications.forEach((notif) => {
      notif.style.top = `${offset}px`;
      offset += notif.offsetHeight + 10;
    });

    // Auto-remove after duration
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }

  // ============================================
  // MONITOR UI PANEL
  // ============================================
  function createMonitorUI() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      #mc-monitor-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #161922;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 9998;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      #mc-monitor-toggle:hover {
        background: #1E2330;
        transform: scale(1.05);
      }

      #mc-monitor-toggle:active {
        transform: scale(0.95);
      }

      #mc-monitor-panel {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 450px;
        max-height: 700px;
        background: #0B0E14;
        border: 1px solid #1E2330;
        border-radius: 0.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: mcSlideIn 0.3s ease;
      }

      @keyframes mcSlideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      #mc-monitor-panel.visible {
        display: flex;
      }

      .mc-header {
        background: #0B0E14;
        padding: 16px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1E2330;
      }

      .mc-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mc-header-buttons {
        display: flex;
        gap: 8px;
      }

      .mc-header button {
        background: transparent;
        border: none;
        color: #9ca3af;
        padding: 4px;
        cursor: pointer;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mc-header button:hover {
        color: white;
      }

      .mc-header button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .mc-header button svg {
        width: 20px;
        height: 20px;
      }

      #mc-refresh-btn {
        background: transparent;
        color: #9ca3af;
        padding: 4px;
      }

      #mc-refresh-btn:hover {
        background: transparent;
        color: white;
      }

      #mc-refresh-btn svg {
        width: 20px;
        height: 20px;
      }

      .mc-content {
        padding: 16px;
        overflow-y: auto;
        max-height: 60vh;
      }

      .mc-content::-webkit-scrollbar {
        width: 8px;
      }

      .mc-content::-webkit-scrollbar-track {
        background: #1E2330;
        border-radius: 4px;
      }

      .mc-content::-webkit-scrollbar-thumb {
        background: #2A3041;
        border-radius: 4px;
      }

      .mc-content::-webkit-scrollbar-thumb:hover {
        background: #363d52;
      }

      .mc-character {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 0.5rem;
        margin-bottom: 12px;
        transition: all 0.2s;
        overflow: hidden;
      }

      .mc-character:hover {
        border-color: #4f46e5;
        background: #252B3B;
      }

      .mc-character:last-child {
        margin-bottom: 0;
      }

      .mc-char-header {
        display: grid;
        grid-template-columns: 32px minmax(70px, 110px) minmax(100px, 160px) auto 24px;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        cursor: pointer;
        user-select: none;
      }

      .mc-char-header:hover {
        background: rgba(79, 70, 229, 0.05);
      }

      .mc-char-header-pfp {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .mc-char-header-name {
        font-size: 0.9rem;
        font-weight: 600;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mc-char-header-status {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.85rem;
        color: #9ca3af;
      }

      .mc-char-header-combat,
      .mc-char-header-task {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .mc-char-header-expand {
        color: #9ca3af;
        font-size: 1.25rem;
        transition: transform 0.2s;
        text-align: center;
      }

      .mc-char-restart-group {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: flex-end;
      }

      .mc-character.expanded .mc-char-header-expand {
        transform: rotate(180deg);
      }

      .mc-char-details {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        padding: 0 16px;
      }

      .mc-character.expanded .mc-char-details {
        max-height: 500px;
        padding: 0 16px 16px 16px;
      }

      .mc-char-restart-btn {
        background: transparent;
        border: none;
        color: #9ca3af;
        padding: 4px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .mc-char-restart-btn:hover {
        color: #4f46e5;
        transform: rotate(-15deg) scale(1.1);
      }

      .mc-char-restart-btn:active {
        transform: rotate(-15deg) scale(0.95);
      }

      .mc-char-restart-btn svg {
        width: 16px;
        height: 16px;
      }

      .mc-char-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: white;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mc-char-hp {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        font-size: 13px;
        color: #cbd5e1;
      }

      .mc-hp-bar {
        flex: 1;
        height: 6px;
        background: #2A3041;
        border-radius: 3px;
        overflow: hidden;
      }

      .mc-hp-fill {
        height: 100%;
        transition: width 0.3s ease, background-color 0.3s ease;
        border-radius: 3px;
      }

      .mc-hp-fill.high {
        background: linear-gradient(90deg, #10b981, #34d399);
      }

      .mc-hp-fill.medium {
        background: linear-gradient(90deg, #f59e0b, #fbbf24);
      }

      .mc-hp-fill.low {
        background: linear-gradient(90deg, #ef4444, #f87171);
      }

      .mc-char-info {
        font-size: 0.875rem;
        color: #9ca3af;
        line-height: 1.6;
      }

      .mc-char-info div {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
      }

      .mc-task-progress {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 6px;
      }

      .mc-progress-bar {
        flex: 1;
        height: 6px;
        background: #2A3041;
        border-radius: 3px;
        overflow: hidden;
      }

      .mc-progress-fill {
        height: 100%;
        background: #4f46e5;
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .mc-progress-fill.combat {
        background: linear-gradient(90deg, #ef4444, #f87171);
      }

      .mc-no-data {
        text-align: center;
        padding: 40px 20px;
        color: #9ca3af;
      }

      .mc-no-data div {
        font-size: 48px;
        margin-bottom: 12px;
      }

      /* Notifications Toast */
      .mc-notification {
        position: fixed;
        right: 20px;
        min-width: 320px;
        max-width: 400px;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        font-weight: 500;
        font-size: 14px;
        z-index: 999999;
        transition: all 0.3s ease;
        animation: mcSlideInRight 0.3s ease;
      }

      @keyframes mcSlideInRight {
        from {
          opacity: 0;
          transform: translateX(400px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .mc-notification-info {
        background: #3b82f6;
        color: white;
        border-left: 4px solid #2563eb;
      }

      .mc-notification-success {
        background: #10b981;
        color: white;
        border-left: 4px solid #059669;
      }

      .mc-notification-error {
        background: #ef4444;
        color: white;
        border-left: 4px solid #dc2626;
      }

      /* ============================================ */
      /* TABS SYSTEM */
      /* ============================================ */
      .mc-tabs {
        display: flex;
        background: #0B0E14;
        border-bottom: 1px solid #1E2330;
      }

      .mc-tab {
        flex: 1;
        padding: 8px 6px;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: #9ca3af;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.75rem;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-width: 0;
      }

      .mc-tab:hover:not(.active) {
        color: #cbd5e1;
        background: rgba(255,255,255,0.02);
      }

      .mc-tab.active {
        color: white;
        border-bottom-color: #4f46e5;
      }

      .mc-tab svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }

      .mc-tab-content {
        display: none;
      }

      .mc-tab-content.active {
        display: block;
      }

      /* ============================================ */
      /* GUILD DONATIONS TAB */
      /* ============================================ */
      .gd-container {
        padding: 16px;
      }

      .gd-status-card {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 12px;
      }

      .gd-status-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .gd-status-row:last-child {
        margin-bottom: 0;
      }

      .gd-status-label {
        color: #9ca3af;
        font-size: 0.85rem;
      }

      .gd-status-value {
        color: white;
        font-weight: 500;
        font-size: 0.85rem;
      }

      .gd-status-value.completed {
        color: #10b981;
      }

      .gd-status-value.pending {
        color: #f59e0b;
      }

      .gd-start-btn {
        width: 100%;
        padding: 12px;
        margin-bottom: 16px;
        background: #4f46e5;
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .gd-start-btn:hover:not(:disabled) {
        background: #4338ca;
        transform: translateY(-1px);
      }

      .gd-start-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .gd-start-btn.running {
        background: #6b7280;
      }

      .gd-progress-section {
        margin-bottom: 16px;
      }

      .gd-progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 0.85rem;
      }

      .gd-progress-label {
        color: #9ca3af;
      }

      .gd-progress-value {
        color: white;
        font-weight: 500;
      }

      .gd-progress-bar {
        height: 8px;
        background: #2A3041;
        border-radius: 4px;
        overflow: hidden;
      }

      .gd-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4f46e5, #6366f1);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .gd-char-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        max-height: 180px;
        overflow-y: auto;
        margin-bottom: 12px;
        padding-right: 4px;
      }

      .gd-char-list::-webkit-scrollbar {
        width: 6px;
      }

      .gd-char-list::-webkit-scrollbar-track {
        background: #1E2330;
        border-radius: 3px;
      }

      .gd-char-list::-webkit-scrollbar-thumb {
        background: #2A3041;
        border-radius: 3px;
      }

      .gd-char-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 10px 6px;
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 6px;
        transition: all 0.2s;
        text-align: center;
      }

      .gd-char-item.active {
        border-color: #4f46e5;
        background: #252B3B;
      }

      .gd-char-pfp {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .gd-char-name {
        font-size: 0.75rem;
        font-weight: 500;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .gd-char-status {
        font-size: 0.65rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
        flex-shrink: 0;
      }

      .gd-char-status.ready {
        background: #374151;
        color: #9ca3af;
      }

      .gd-char-status.donating {
        background: #3b82f6;
        color: white;
      }

      .gd-char-status.done {
        background: #10b981;
        color: white;
      }

      .gd-char-status.no-guild {
        background: #f59e0b;
        color: white;
      }

      .gd-char-status.error {
        background: #ef4444;
        color: white;
      }

      .gd-char-donate-btn {
        padding: 4px 8px;
        background: #4f46e5;
        border: none;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        font-size: 0.65rem;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .gd-char-donate-btn:hover:not(:disabled) {
        background: #4338ca;
      }

      .gd-char-donate-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .gd-char-donate-btn.done {
        background: #10b981;
      }

      /* Bottom progress bar for donations */
      .gd-bottom-progress {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 12px;
        margin-top: auto;
      }

      .gd-bottom-progress-text {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #9ca3af;
        margin-bottom: 8px;
      }

      .gd-bottom-progress-text span:last-child {
        color: #10b981;
        font-weight: 500;
      }

      .gd-bottom-progress-bar {
        height: 8px;
        background: #2A3041;
        border-radius: 4px;
        overflow: hidden;
      }

      .gd-bottom-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4f46e5, #6366f1);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .gd-bottom-progress-fill.complete {
        background: linear-gradient(90deg, #10b981, #34d399);
      }

      .gd-completed-banner {
        background: linear-gradient(135deg, #065f46, #047857);
        border: 1px solid #10b981;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        margin-bottom: 16px;
      }

      .gd-completed-banner h4 {
        margin: 0 0 8px 0;
        color: white;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .gd-completed-banner p {
        margin: 0;
        color: #a7f3d0;
        font-size: 0.85rem;
      }

      .gd-run-again-btn {
        width: 100%;
        padding: 10px;
        margin-top: 12px;
        background: transparent;
        border: 1px solid #2A3041;
        border-radius: 6px;
        color: #9ca3af;
        font-weight: 500;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .gd-run-again-btn:hover {
        border-color: #4f46e5;
        color: white;
      }

      /* ============================================ */
      /* GLOBAL AUTO MODE STYLES */
      /* ============================================ */
      .global-mode-card {
        background: linear-gradient(135deg, #1a1f2e 0%, #1E2330 100%);
        border: 1px solid #3b82f6;
        border-radius: 8px;
        padding: 12px;
        margin-top: 12px;
      }

      .global-mode-card.active {
        border-color: #22c55e;
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.15);
      }

      .global-mode-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .global-mode-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #60a5fa;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .global-mode-card.active .global-mode-title {
        color: #4ade80;
      }

      .global-mode-icon {
        width: 16px;
        height: 16px;
      }

      .global-mode-desc {
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: 6px;
      }

      .global-mode-status {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #2A3041;
        font-size: 0.75rem;
        color: #9ca3af;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .global-mode-status-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .global-mode-status-value {
        color: #d1d5db;
      }

      .global-mode-countdown {
        color: #fbbf24;
        font-weight: 500;
      }

      .global-mode-progress {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fbbf24;
        font-weight: 500;
        padding: 6px 0;
      }

      .global-mode-progress .gm-spinner {
        width: 12px;
        height: 12px;
        border: 2px solid #fbbf24;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .global-mode-results {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-top: 4px;
        font-size: 0.7rem;
      }

      .global-mode-result-row {
        display: flex;
        justify-content: space-between;
      }

      .global-mode-result-label {
        color: #6b7280;
      }

      .global-mode-result-value {
        color: #9ca3af;
      }

      .global-mode-result-value.success {
        color: #4ade80;
      }

      /* ============================================ */
      /* GLOBAL TAB STYLES */
      /* ============================================ */
      .gl-container {
        padding: 16px;
        overflow-y: auto;
        max-height: 500px;
      }

      .gl-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #2A3041;
      }

      .gl-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .gl-title {
        font-size: 1rem;
        font-weight: 600;
        color: #60a5fa;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .gl-title svg {
        width: 18px;
        height: 18px;
      }

      .gl-interval-select {
        background: #1E2330;
        border: 1px solid #3b4559;
        border-radius: 6px;
        padding: 6px 10px;
        color: #d1d5db;
        font-size: 0.8rem;
        cursor: pointer;
      }

      .gl-interval-select:focus {
        outline: none;
        border-color: #4f46e5;
      }

      .gl-start-btn {
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        border: none;
        border-radius: 6px;
        padding: 8px 16px;
        color: white;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
      }

      .gl-start-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
      }

      .gl-start-btn.running {
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      }

      .gl-start-btn.running:hover {
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
      }

      .gl-characters-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .gl-char-row {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s;
      }

      .gl-char-row:hover {
        border-color: #3b4559;
      }

      .gl-char-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .gl-char-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #2A3041;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        overflow: hidden;
      }

      .gl-char-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .gl-char-name {
        font-weight: 500;
        color: #e5e7eb;
        font-size: 0.9rem;
      }

      .gl-char-toggles {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .gl-toggle-group {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .gl-toggle-label {
        font-size: 0.75rem;
        color: #9ca3af;
      }

      .gl-toggle-label.disabled {
        color: #6b7280;
      }

      .gl-config-btn {
        background: transparent;
        border: 1px solid #3b4559;
        border-radius: 4px;
        padding: 4px 8px;
        color: #9ca3af;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        transition: all 0.2s;
      }

      .gl-config-btn:hover {
        border-color: #4f46e5;
        color: #818cf8;
      }

      .gl-config-btn svg {
        width: 12px;
        height: 12px;
      }

      .gl-status-bar {
        margin-top: 16px;
        padding: 12px;
        background: #1a1f2e;
        border: 1px solid #2A3041;
        border-radius: 8px;
      }

      .gl-status-bar.running {
        border-color: #22c55e;
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, #1a1f2e 100%);
      }

      .gl-status-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
      }

      .gl-status-label {
        color: #9ca3af;
      }

      .gl-status-value {
        color: #e5e7eb;
        font-weight: 500;
      }

      .gl-status-value.countdown {
        color: #fbbf24;
      }

      .gl-status-value.success {
        color: #4ade80;
      }

      .gl-status-running {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fbbf24;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .gl-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid #fbbf24;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .gl-no-config-warning {
        font-size: 0.7rem;
        color: #f59e0b;
        margin-top: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .gl-global-active-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(34, 197, 94, 0.15);
        border: 1px solid #22c55e;
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 0.7rem;
        color: #4ade80;
        font-weight: 500;
      }

      /* ============================================ */
      /* AUTO-SELL MINI TAB STYLES (in main panel) */
      /* ============================================ */
      .as-mini-container {
        padding: 16px;
      }

      .as-mini-card {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 16px;
      }

      .as-mini-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .as-mini-title {
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
      }

      .as-mini-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
      }

      .as-mini-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .as-mini-status-dot.on {
        background: #22c55e;
        box-shadow: 0 0 6px #22c55e;
      }

      .as-mini-status-dot.off {
        background: #6b7280;
      }

      .as-mini-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 16px;
        padding: 10px;
        background: #161922;
        border-radius: 6px;
      }

      .as-mini-info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
      }

      .as-mini-info-label {
        color: #6b7280;
      }

      .as-mini-info-value {
        color: #9ca3af;
      }

      .as-mini-info-value.warning {
        color: #f59e0b;
      }

      .as-mini-history {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #2A3041;
      }

      .as-mini-history-title {
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .as-mini-history-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .as-mini-history-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.75rem;
      }

      .as-mini-history-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .as-mini-history-gold {
        color: #fbbf24;
        font-weight: 500;
        flex-shrink: 0;
      }

      .as-mini-history-time {
        color: #6b7280;
        font-size: 0.65rem;
        flex-shrink: 0;
      }

      .as-mini-no-history {
        font-size: 0.75rem;
        color: #6b7280;
        font-style: italic;
      }

      .as-open-panel-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .as-open-panel-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
      }

      /* ============================================ */
      /* AUTO-SELL DEDICATED PANEL STYLES (modal) */
      /* ============================================ */
      .as-panel-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(2px);
      }

      .as-panel-overlay.visible {
        display: flex;
      }

      .as-panel {
        background: #0B0E14;
        border: 1px solid #1E2330;
        border-radius: 12px;
        width: 640px;
        max-width: 95vw;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        animation: asPanelSlideIn 0.3s ease;
      }

      @keyframes asPanelSlideIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .as-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: #0B0E14;
        border-bottom: 1px solid #1E2330;
      }

      .as-panel-title {
        display: flex;
        align-items: center;
        gap: 10px;
        color: white;
        font-size: 1.1rem;
        font-weight: 700;
      }

      .as-panel-title svg {
        width: 20px;
        height: 20px;
        color: #ef4444;
      }

      .as-panel-close {
        background: transparent;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .as-panel-close:hover {
        background: #1E2330;
        color: white;
      }

      .as-status-message {
        background: rgba(255, 193, 7, 0.15);
        border: 1px solid #ffc107;
        color: #ffc107;
        padding: 10px 16px;
        border-radius: 6px;
        margin: 12px 20px 0 20px;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .as-status-message.error {
        background: rgba(239, 68, 68, 0.15);
        border-color: #ef4444;
        color: #ef4444;
      }

      .as-panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      /* Settings Section */
      .as-settings-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
      }

      .as-settings-card {
        flex: 1;
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 14px;
      }

      .as-settings-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .as-settings-card-label {
        color: #9ca3af;
        font-size: 0.85rem;
      }

      .as-toggle {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
      }

      .as-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .as-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #2A3041;
        transition: 0.3s;
        border-radius: 24px;
      }

      .as-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }

      .as-toggle input:checked + .as-toggle-slider {
        background-color: #22c55e;
      }

      .as-toggle input:checked + .as-toggle-slider:before {
        transform: translateX(20px);
      }

      .as-interval-control {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .as-interval-control input {
        width: 60px;
        padding: 6px 10px;
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        color: white;
        font-size: 0.9rem;
        text-align: center;
      }

      .as-interval-control input:focus {
        outline: none;
        border-color: #4f46e5;
      }

      .as-interval-control span {
        color: #6b7280;
        font-size: 0.85rem;
      }

      /* Section Styles */
      .as-section {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        margin-bottom: 16px;
        overflow: visible;
      }

      .as-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #161922;
        border-bottom: 1px solid #2A3041;
        font-size: 0.9rem;
        font-weight: 600;
        color: white;
        cursor: pointer;
        user-select: none;
      }

      .as-section-header:hover {
        background: #1a1f2e;
      }

      .as-section-toggle {
        color: #6b7280;
        font-size: 0.8rem;
        transition: transform 0.2s;
      }

      .as-section-toggle.collapsed {
        transform: rotate(-90deg);
      }

      .as-section-content {
        padding: 16px;
      }

      .as-section-content.collapsed {
        display: none;
      }

      /* Rules Grid */
      .as-rules-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .as-rule-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #161922;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        color: #9ca3af;
        transition: all 0.2s;
        border: 1px solid transparent;
      }

      .as-rule-item:hover {
        border-color: #374151;
        color: white;
      }

      .as-rule-item input {
        cursor: pointer;
        accent-color: #4f46e5;
      }

      .as-rule-item input:checked ~ span {
        color: white;
      }

      .as-rule-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      /* Affixes Section */
      .as-affixes-selected {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
        min-height: 32px;
      }

      .as-no-affixes {
        color: #6b7280;
        font-size: 0.85rem;
        font-style: italic;
      }

      .as-affix-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: #4f46e5;
        border-radius: 6px;
        font-size: 0.8rem;
        color: white;
        text-transform: capitalize;
      }

      .as-affix-remove {
        background: none;
        border: none;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
        padding: 0;
        margin-left: 2px;
      }

      .as-affix-remove:hover {
        color: white;
      }

      .as-affixes-grid-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        color: #9ca3af;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
        justify-content: center;
      }

      .as-affixes-grid-toggle:hover {
        background: #1a1f2e;
        border-color: #4f46e5;
        color: white;
      }

      .as-affixes-grid-toggle svg {
        transition: transform 0.2s;
      }

      .as-affixes-grid-toggle.expanded svg {
        transform: rotate(180deg);
      }

      .as-affixes-grid {
        display: none;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 12px;
        padding: 12px;
        background: #161922;
        border-radius: 8px;
      }

      .as-affixes-grid.expanded {
        display: grid;
      }

      .as-affix-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        background: #1E2330;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        color: #9ca3af;
        transition: all 0.2s;
        text-transform: capitalize;
      }

      .as-affix-checkbox:hover {
        background: #2A3041;
        color: white;
      }

      .as-affix-checkbox input {
        cursor: pointer;
        accent-color: #4f46e5;
      }

      .as-affix-checkbox input:checked ~ span {
        color: #a78bfa;
      }

      /* Inventory Section */
      .as-inventory-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .as-refresh-btn {
        background: #161922;
        border: 1px solid #374151;
        color: #9ca3af;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 6px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
      }

      .as-refresh-btn:hover {
        border-color: #4f46e5;
        color: white;
      }

      .as-refresh-btn.loading svg {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .as-inventory-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        max-height: 240px;
        overflow-y: auto;
        padding: 4px;
      }

      .as-item {
        position: relative;
        background: #161922;
        border: 2px solid #374151;
        border-radius: 8px;
        padding: 8px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .as-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }

      .as-item.selected {
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
      }

      .as-item.auto-sell {
        background: rgba(239, 68, 68, 0.1);
      }

      .as-item img {
        width: 40px;
        height: 40px;
        object-fit: contain;
      }

      .as-item-name {
        font-size: 0.6rem;
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      .as-auto-sell-badge {
        position: absolute;
        top: 3px;
        right: 3px;
        background: #ef4444;
        color: white;
        font-size: 0.55rem;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
      }

      .as-selected-badge {
        position: absolute;
        top: 3px;
        left: 3px;
        background: #4f46e5;
        color: white;
        font-size: 0.7rem;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .as-no-items {
        grid-column: 1 / -1;
        text-align: center;
        color: #6b7280;
        font-size: 0.9rem;
        padding: 40px 20px;
      }

      /* Actions */
      .as-actions {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: #161922;
        border-top: 1px solid #2A3041;
      }

      .as-sell-selected-btn {
        flex: 1;
        padding: 12px;
        background: #ef4444;
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .as-sell-selected-btn:hover {
        background: #dc2626;
        transform: translateY(-1px);
      }

      .as-sell-selected-btn:disabled {
        background: #374151;
        cursor: not-allowed;
        transform: none;
      }

      .as-clear-selection-btn {
        padding: 12px 20px;
        background: transparent;
        border: 1px solid #2A3041;
        border-radius: 8px;
        color: #9ca3af;
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .as-clear-selection-btn:hover {
        border-color: #4f46e5;
        color: white;
      }

      /* History Section */
      .as-history-list {
        max-height: 150px;
        overflow-y: auto;
      }

      .as-no-history {
        color: #6b7280;
        font-size: 0.85rem;
        font-style: italic;
        text-align: center;
        padding: 20px;
      }

      .as-history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid #2A3041;
        font-size: 0.85rem;
      }

      .as-history-item:last-child {
        border-bottom: none;
      }

      .as-history-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .as-history-gold {
        color: #fbbf24;
        font-weight: 600;
      }

      .as-history-time {
        color: #6b7280;
        font-size: 0.75rem;
      }

      .as-history-affixes {
        color: #9ca3af;
        font-size: 0.75rem;
        padding: 2px 6px;
        background: #252836;
        border-radius: 4px;
        cursor: help;
      }

      .as-history-item {
        position: relative;
      }

      /* Global Tooltip (position: fixed, outside containers) */
      #as-global-tooltip {
        position: fixed;
        display: none;
        opacity: 0;
        background: #1a1d24;
        border: 1px solid #374151;
        border-radius: 8px;
        padding: 10px 12px;
        min-width: 180px;
        max-width: 260px;
        z-index: 10010;
        pointer-events: none;
        box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        transition: opacity 0.15s ease-out;
      }

      #as-global-tooltip.visible {
        display: block;
        opacity: 1;
      }

      .as-tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }

      .as-tooltip-name {
        font-weight: 600;
        font-size: 0.9rem;
      }

      .as-tooltip-type {
        font-size: 0.7rem;
        color: #6b7280;
        padding: 2px 6px;
        background: #252836;
        border-radius: 4px;
      }

      .as-tooltip-rarity {
        font-size: 0.75rem;
        margin-bottom: 8px;
        text-transform: capitalize;
      }

      .as-tooltip-affixes {
        display: flex;
        flex-direction: column;
        gap: 4px;
        border-top: 1px solid #2A3041;
        padding-top: 8px;
        margin-top: 4px;
      }

      .as-tooltip-affix {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
      }

      .as-tooltip-affix-name {
        color: #9ca3af;
      }

      .as-tooltip-affix-value {
        color: #22c55e;
        font-weight: 500;
      }

      .as-tooltip-no-affixes {
        color: #6b7280;
        font-size: 0.8rem;
        font-style: italic;
      }

      .as-tooltip-slots {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 4px;
      }

      /* Item Slots Section */
      .as-slots-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .as-slots-category {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .as-slots-category-label {
        font-size: 0.7rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }

      .as-slots-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .as-slot-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: #161922;
        border: 1px solid #2A3041;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.85rem;
        color: #d1d5db;
      }

      .as-slot-item:hover {
        border-color: #4f46e5;
      }

      .as-slot-item input {
        accent-color: #4f46e5;
      }

      .as-slot-item.dimmed {
        opacity: 0.7;
      }

      .as-slot-note {
        font-size: 0.65rem;
        color: #6b7280;
        margin-left: 4px;
      }

      .as-no-affixes-available {
        color: #6b7280;
        font-size: 0.85rem;
        font-style: italic;
        padding: 12px;
        text-align: center;
        background: #161922;
        border-radius: 6px;
      }

      /* Legacy: Item Types Section (deprecated but kept for compatibility) */
      .as-types-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .as-type-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #161922;
        border: 1px solid #2A3041;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .as-type-item:hover {
        border-color: #4f46e5;
      }

      .as-type-item input {
        accent-color: #4f46e5;
      }

      .as-type-item span {
        font-size: 0.85rem;
        color: #d1d5db;
      }

      /* Affix Protection Mode */
      .as-affix-mode {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #2A3041;
      }

      .as-affix-mode-option {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }

      .as-affix-mode-option input[type="radio"] {
        accent-color: #4f46e5;
      }

      .as-affix-mode-option label {
        font-size: 0.85rem;
        color: #d1d5db;
        cursor: pointer;
      }

      .as-min-affixes-control {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 4px;
      }

      .as-min-affixes-control select {
        background: #161922;
        border: 1px solid #2A3041;
        border-radius: 4px;
        color: white;
        padding: 2px 6px;
        font-size: 0.85rem;
      }

      /* Confirmation Modal */
      .as-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
      }

      .as-modal-content {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 12px;
        width: 90%;
        max-width: 420px;
        overflow: hidden;
      }

      .as-modal-header {
        padding: 16px 20px;
        background: #161922;
        border-bottom: 1px solid #2A3041;
      }

      .as-modal-header h3 {
        margin: 0;
        color: white;
        font-size: 1rem;
      }

      .as-modal-body {
        padding: 20px;
      }

      .as-modal-body p {
        margin: 0 0 12px 0;
        color: #9ca3af;
        font-size: 0.9rem;
      }

      .as-modal-warning {
        color: #ef4444 !important;
        font-weight: 500;
      }

      .as-modal-items {
        max-height: 150px;
        overflow-y: auto;
      }

      .as-modal-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
      }

      .as-modal-item img {
        width: 28px;
        height: 28px;
        object-fit: contain;
      }

      .as-modal-more {
        color: #6b7280;
        font-size: 0.85rem;
        margin-top: 8px;
      }

      .as-modal-footer {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid #2A3041;
      }

      .as-modal-btn {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .as-modal-cancel {
        background: #2A3041;
        color: #9ca3af;
      }

      .as-modal-cancel:hover {
        background: #374151;
        color: white;
      }

      .as-modal-confirm {
        background: #ef4444;
        color: white;
      }

      .as-modal-confirm:hover {
        background: #dc2626;
      }

      /* ============================================ */
      /* DPS OVERLAY STYLES */
      /* ============================================ */
      #dps-overlay {
        position: fixed;
        bottom: 16px;
        left: 16px;
        background: #2A3041;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 12px;
        color: white;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      }

      #dps-overlay-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        cursor: pointer;
        user-select: none;
      }

      #dps-overlay-header:hover {
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
      }

      #dps-overlay-content {
        padding: 0 12px 8px 12px;
        overflow: hidden;
        transition: max-height 0.2s ease, opacity 0.2s ease;
      }

      #dps-overlay.collapsed #dps-overlay-content {
        max-height: 0;
        padding: 0 12px;
        opacity: 0;
      }

      #dps-overlay.collapsed #dps-overlay-header {
        border-radius: 8px;
      }

      #dps-overlay-chevron {
        transition: transform 0.2s ease;
      }

      #dps-overlay.collapsed #dps-overlay-chevron {
        transform: rotate(180deg);
      }

      .dps-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 3px 0;
      }

      .dps-name {
        color: rgba(255,255,255,0.7);
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dps-name.player {
        color: #a78bfa;
      }

      .dps-value {
        color: #c4b5fd;
        font-weight: 500;
      }

      /* ============================================ */
      /* WORLD BOSS DPS OVERLAY STYLES */
      /* ============================================ */
      #wb-dps-overlay {
        position: fixed;
        bottom: 16px;
        left: 16px;
        background: #2A3041;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 12px;
        color: white;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        min-width: 180px;
      }

      #wb-dps-overlay-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        cursor: pointer;
        user-select: none;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      #wb-dps-overlay-header:hover {
        background: rgba(255,255,255,0.05);
        border-radius: 8px 8px 0 0;
      }

      #wb-dps-overlay-content {
        padding: 8px 12px;
        overflow: hidden;
        transition: max-height 0.2s ease, opacity 0.2s ease;
      }

      #wb-dps-overlay.collapsed #wb-dps-overlay-content {
        max-height: 0;
        padding: 0 12px;
        opacity: 0;
      }

      #wb-dps-overlay.collapsed #wb-dps-overlay-header {
        border-radius: 8px;
        border-bottom: none;
      }

      #wb-dps-overlay-chevron {
        transition: transform 0.2s ease;
      }

      #wb-dps-overlay.collapsed #wb-dps-overlay-chevron {
        transform: rotate(180deg);
      }

      #wb-dps-overlay-close {
        margin-left: auto;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s ease;
        padding: 2px;
      }

      #wb-dps-overlay-close:hover {
        opacity: 1;
      }

      .wb-finished-badge {
        color: #4ade80;
        font-size: 10px;
        margin-left: 4px;
      }

      .wb-char-name-dps {
        color: #a78bfa;
        font-weight: 600;
        margin-bottom: 6px;
      }

      .wb-stat-row {
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
      }

      .wb-stat-label {
        color: rgba(255,255,255,0.6);
      }

      .wb-stat-value {
        color: #c4b5fd;
        font-weight: 500;
      }

      .wb-stat-value.boss-hp {
        color: #f87171;
      }

      /* ============================================ */
      /* MARKET AFFIX FILTER STYLES */
      /* ============================================ */
      .dg-mf-container {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 12px;
      }

      .dg-mf-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .dg-mf-row + .dg-mf-row {
        margin-top: 8px;
      }

      .dg-mf-select {
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        padding: 6px 10px;
        color: white;
        font-size: 0.85rem;
        min-width: 140px;
        cursor: pointer;
      }

      .dg-mf-select:focus {
        outline: none;
        border-color: #4f46e5;
      }

      .dg-mf-input {
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        padding: 6px 10px;
        color: white;
        font-size: 0.85rem;
        flex: 1;
        min-width: 100px;
      }

      .dg-mf-input::placeholder {
        color: #6b7280;
      }

      .dg-mf-input:focus {
        outline: none;
        border-color: #4f46e5;
      }

      .dg-mf-reset-btn {
        background: #374151;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        color: #9ca3af;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.85rem;
      }

      .dg-mf-reset-btn:hover {
        background: #ef4444;
        color: white;
      }

      .dg-mf-checkbox {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        color: #9ca3af;
        cursor: pointer;
      }

      .dg-mf-checkbox input {
        accent-color: #4f46e5;
        cursor: pointer;
      }

      .dg-mf-checkbox:hover {
        color: white;
      }

      .dg-mf-count {
        margin-left: auto;
        font-size: 0.8rem;
        color: #6b7280;
      }

      .dg-mf-label {
        font-size: 0.75rem;
        color: #6b7280;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Affix details row (injected under each order row) */
      .dg-mf-affix-details {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 4px 8px 8px 24px;
        margin-top: -4px;
        margin-bottom: 4px;
        border-left: 2px solid #4f46e5;
        margin-left: 8px;
      }

      /* Affix tag badge */
      .dg-mf-affix-tag {
        background: #4f46e5;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      /* Highlight when matches the active filter */
      .dg-mf-affix-tag.matched {
        background: #22c55e;
        box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
      }

      /* Row hidden by filter */
      .dg-mf-hidden {
        display: none !important;
      }

      /* Filter active indicator */
      .dg-mf-filter-active {
        color: #22c55e;
        font-weight: 500;
      }

      /* Mobile responsive */
      @media (max-width: 640px) {
        .dg-mf-container {
          padding: 8px 10px;
        }

        .dg-mf-select {
          min-width: 120px;
          font-size: 0.8rem;
        }

        .dg-mf-input {
          min-width: 80px;
          font-size: 0.8rem;
        }

        .dg-mf-affix-details {
          padding-left: 16px;
        }

        .dg-mf-affix-tag {
          font-size: 0.7rem;
          padding: 2px 6px;
        }
      }

      /* ============================================ */
      /* COMBAT JOIN TAB STYLES */
      /* ============================================ */
      .cj-container {
        padding: 16px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .cj-current-char {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .cj-current-char-pfp {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .cj-current-char-info {
        flex: 1;
      }

      .cj-current-char-label {
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 2px;
      }

      .cj-current-char-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: white;
      }

      .cj-current-char-name.no-char {
        color: #9ca3af;
        font-style: italic;
      }

      .cj-status {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 10px 14px;
        margin-bottom: 12px;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cj-status.success {
        background: rgba(16, 185, 129, 0.15);
        border-color: #10b981;
        color: #34d399;
      }

      .cj-status.error {
        background: rgba(239, 68, 68, 0.15);
        border-color: #ef4444;
        color: #f87171;
      }

      .cj-status-icon {
        font-size: 1rem;
      }

      .cj-zone-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cj-zone {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        overflow: hidden;
        transition: border-color 0.2s;
      }

      .cj-zone:hover {
        border-color: #374151;
      }

      .cj-zone-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        cursor: pointer;
        user-select: none;
        background: #161922;
        transition: background 0.2s;
      }

      .cj-zone-header:hover {
        background: #1a1f2e;
      }

      .cj-zone-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: white;
        font-size: 0.9rem;
      }

      .cj-zone-title svg {
        width: 14px;
        height: 14px;
        color: #9ca3af;
        transition: transform 0.2s;
      }

      .cj-zone.expanded .cj-zone-title svg {
        transform: rotate(90deg);
      }

      .cj-zone-range {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .cj-zone-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }

      .cj-zone.expanded .cj-zone-content {
        max-height: 500px;
      }

      .cj-combat-list {
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .cj-combat-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        background: #0B0E14;
        border-radius: 6px;
        transition: background 0.2s;
      }

      .cj-combat-row:hover {
        background: #161922;
      }

      .cj-combat-level {
        font-size: 0.85rem;
        color: #d1d5db;
      }

      .cj-combat-level span {
        color: #6b7280;
        font-size: 0.75rem;
        margin-left: 6px;
      }

      .cj-join-btn {
        padding: 5px 12px;
        background: #4f46e5;
        border: none;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cj-join-btn:hover:not(:disabled) {
        background: #4338ca;
        transform: translateY(-1px);
      }

      .cj-join-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .cj-join-btn.loading {
        background: #6b7280;
      }

      .cj-no-char-warning {
        background: rgba(245, 158, 11, 0.15);
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 12px;
        color: #fbbf24;
        font-size: 0.85rem;
        text-align: center;
      }

      /* Dungeon section in each zone */
      /* Custom join section */
      .cj-custom-section {
        margin-top: 16px;
        padding: 14px;
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
      }

      .cj-custom-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: #9ca3af;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .cj-custom-row {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }

      .cj-custom-type {
        padding: 8px 12px;
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        color: white;
        font-size: 0.85rem;
        cursor: pointer;
      }

      .cj-custom-type:focus {
        outline: none;
        border-color: #4f46e5;
      }

      .cj-custom-id {
        width: 80px;
        padding: 8px 12px;
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        color: white;
        font-size: 0.85rem;
        text-align: center;
      }

      .cj-custom-id:focus {
        outline: none;
        border-color: #4f46e5;
      }

      .cj-custom-chain {
        width: 60px;
        padding: 8px 10px;
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        color: white;
        font-size: 0.85rem;
        text-align: center;
      }

      .cj-custom-chain:focus {
        outline: none;
        border-color: #7c3aed;
      }

      .cj-custom-chain-wrapper {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .cj-custom-chain-wrapper.hidden {
        display: none;
      }

      .cj-custom-chain-label {
        color: #6b7280;
        font-size: 0.75rem;
      }

      .cj-custom-join-btn {
        padding: 8px 16px;
        background: #4f46e5;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-left: auto;
      }

      .cj-custom-join-btn:hover:not(:disabled) {
        background: #4338ca;
      }

      .cj-custom-join-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .cj-custom-join-btn.dungeon {
        background: #7c3aed;
      }

      .cj-custom-join-btn.dungeon:hover:not(:disabled) {
        background: #6d28d9;
      }

      .cj-custom-join-btn.task {
        background: #059669;
      }

      .cj-custom-join-btn.task:hover:not(:disabled) {
        background: #047857;
      }

      .cj-custom-id.hidden {
        display: none;
      }

      .cj-custom-task-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cj-custom-task-wrapper.hidden {
        display: none;
      }

      .cj-custom-skill,
      .cj-custom-item {
        width: 120px;
        padding: 8px 12px;
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        color: white;
        font-size: 0.85rem;
      }

      .cj-custom-skill:focus,
      .cj-custom-item:focus {
        outline: none;
        border-color: #059669;
      }

      .cj-custom-skill::placeholder,
      .cj-custom-item::placeholder {
        color: #6b7280;
      }

      /* ============================================ */
      /* PET AUTO-FEED TAB STYLES */
      /* ============================================ */
      .pf-container {
        padding: 16px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .pf-pet-card {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 14px 16px;
        margin-bottom: 12px;
      }

      .pf-pet-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .pf-pet-icon {
        width: 48px;
        height: 48px;
        background: #161922;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
      }

      .pf-pet-info {
        flex: 1;
      }

      .pf-pet-name {
        font-size: 1rem;
        font-weight: 600;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pf-pet-level {
        font-size: 0.75rem;
        color: #6b7280;
        background: #161922;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .pf-pet-rarity {
        font-size: 0.8rem;
        margin-top: 2px;
      }

      .pf-pet-rarity.common { color: #9ca3af; }
      .pf-pet-rarity.uncommon { color: #22c55e; }
      .pf-pet-rarity.rare { color: #3b82f6; }
      .pf-pet-rarity.epic { color: #a855f7; }
      .pf-pet-rarity.legendary { color: #f59e0b; }

      .pf-fullness-section {
        margin-top: 8px;
      }

      .pf-fullness-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        font-size: 0.85rem;
      }

      .pf-fullness-label {
        color: #9ca3af;
      }

      .pf-fullness-value {
        color: white;
        font-weight: 500;
      }

      .pf-fullness-bar {
        height: 8px;
        background: #2A3041;
        border-radius: 4px;
        overflow: hidden;
      }

      .pf-fullness-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease, background 0.3s ease;
      }

      .pf-fullness-fill.high {
        background: linear-gradient(90deg, #10b981, #34d399);
      }

      .pf-fullness-fill.medium {
        background: linear-gradient(90deg, #f59e0b, #fbbf24);
      }

      .pf-fullness-fill.low {
        background: linear-gradient(90deg, #ef4444, #f87171);
      }

      .pf-fullness-fill.empty {
        background: #374151;
      }

      .pf-food-card {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 14px 16px;
        margin-bottom: 12px;
      }

      .pf-food-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .pf-food-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: white;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .pf-food-select-wrapper {
        position: relative;
        margin-bottom: 10px;
      }

      .pf-food-select {
        width: 100%;
        padding: 10px 12px;
        background: #161922;
        border: 1px solid #374151;
        border-radius: 6px;
        color: white;
        font-size: 0.9rem;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 36px;
      }

      .pf-food-select:focus {
        outline: none;
        border-color: #4f46e5;
      }

      .pf-food-select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .pf-food-stats {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #9ca3af;
      }

      .pf-food-stat {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .pf-food-stat-value {
        color: white;
        font-weight: 500;
      }

      .pf-autofeed-card {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 8px;
        padding: 14px 16px;
        margin-bottom: 12px;
      }

      .pf-autofeed-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .pf-autofeed-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: white;
      }

      .pf-toggle {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
      }

      .pf-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .pf-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #2A3041;
        transition: 0.3s;
        border-radius: 24px;
      }

      .pf-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }

      .pf-toggle input:checked + .pf-toggle-slider {
        background-color: #22c55e;
      }

      .pf-toggle input:checked + .pf-toggle-slider:before {
        transform: translateX(20px);
      }

      .pf-autofeed-desc {
        font-size: 0.8rem;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .pf-autofeed-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
      }

      .pf-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .pf-status-dot.active {
        background: #22c55e;
        box-shadow: 0 0 6px #22c55e;
      }

      .pf-status-dot.inactive {
        background: #6b7280;
      }

      .pf-status-text {
        color: #9ca3af;
      }

      .pf-status-text.active {
        color: #22c55e;
      }

      .pf-feed-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .pf-feed-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
      }

      .pf-feed-btn:disabled {
        background: #374151;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .pf-feed-btn.loading {
        background: #6b7280;
      }

      .pf-feed-hint {
        text-align: center;
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: 8px;
      }

      .pf-no-pet {
        text-align: center;
        padding: 40px 20px;
        color: #9ca3af;
      }

      .pf-no-pet-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }

      .pf-no-pet-text {
        font-size: 0.9rem;
      }

      .pf-no-food-warning {
        background: rgba(245, 158, 11, 0.15);
        border: 1px solid #f59e0b;
        border-radius: 6px;
        padding: 10px 12px;
        margin-bottom: 12px;
        color: #fbbf24;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pf-session-stats {
        background: #161922;
        border-radius: 6px;
        padding: 10px 12px;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
      }

      .pf-session-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .pf-session-stat-label {
        color: #6b7280;
        font-size: 0.7rem;
      }

      .pf-session-stat-value {
        color: white;
        font-weight: 600;
      }

      /* ============================================ */
      /* RESPONSIVE MOBILE STYLES */
      /* ============================================ */
      @media (max-width: 768px) {
        #mc-monitor-toggle {
          bottom: 100px;
          right: 15px;
          width: 50px;
          height: 50px;
          font-size: 20px;
        }

        #mc-monitor-panel {
          bottom: 160px;
          right: 10px;
          left: 10px;
          width: auto;
          max-width: calc(100vw - 20px);
          max-height: 70vh;
        }

        .mc-content {
          max-height: calc(70vh - 120px);
        }

        .mc-char-header {
          grid-template-columns: 28px minmax(60px, 90px) minmax(80px, 130px) auto 20px;
          gap: 8px;
          padding: 10px 12px;
        }

        .mc-char-header-name {
          font-size: 0.85rem;
        }

        .mc-char-header-status {
          gap: 8px;
          font-size: 0.8rem;
        }

        .mc-char-header-pfp {
          width: 28px;
          height: 28px;
        }

        .mc-header h3 {
          font-size: 1.1rem;
        }

        .mc-header button svg {
          width: 18px;
          height: 18px;
        }

        .mc-notification {
          right: 10px;
          left: 10px;
          min-width: auto;
          max-width: calc(100vw - 20px);
        }

        /* Tabs mobile */
        .mc-tabs {
          font-size: 0.7rem;
        }

        .mc-tab {
          padding: 6px 4px;
          font-size: 0.7rem;
          gap: 3px;
        }

        .mc-tab svg {
          width: 12px;
          height: 12px;
        }

        /* Guild Donations mobile */
        .gd-container {
          padding: 12px;
        }

        .gd-start-btn {
          padding: 10px;
          font-size: 0.9rem;
        }

        .gd-char-list {
          grid-template-columns: repeat(2, 1fr);
          max-height: 150px;
        }

        .gd-char-item {
          padding: 8px 6px;
        }

        .gd-char-pfp {
          width: 28px;
          height: 28px;
        }

        .gd-char-name {
          font-size: 0.7rem;
        }

        /* DPS Overlays mobile */
        #dps-overlay {
          bottom: 100px;
          left: 10px;
          font-size: 11px;
        }

        #wb-dps-overlay {
          bottom: 100px;
          left: 10px;
          min-width: 160px;
          font-size: 11px;
        }
      }

      @media (max-width: 480px) {
        #mc-monitor-toggle {
          bottom: 120px;
        }

        #mc-monitor-panel {
          bottom: 180px;
          max-height: 65vh;
        }

        .mc-content {
          max-height: calc(65vh - 130px);
        }

        .mc-char-header {
          grid-template-columns: 26px minmax(50px, 80px) minmax(70px, 110px) auto 18px;
          gap: 6px;
          padding: 8px 10px;
        }

        .mc-char-header-pfp {
          width: 26px;
          height: 26px;
        }

        .mc-char-header-name {
          font-size: 0.8rem;
        }

        .mc-char-header-status {
          gap: 6px;
          font-size: 0.75rem;
        }

        .mc-char-restart-group {
          gap: 4px;
        }

        .mc-char-restart-btn svg {
          width: 14px;
          height: 14px;
        }

        /* Tabs very small screens */
        .mc-tab {
          padding: 6px 8px;
          font-size: 0.75rem;
          gap: 4px;
        }

        .mc-tab svg {
          width: 12px;
          height: 12px;
        }

        /* Guild Donations very small */
        .gd-char-list {
          grid-template-columns: repeat(2, 1fr);
          max-height: 130px;
        }

        .gd-char-item {
          gap: 4px;
          padding: 6px 4px;
        }

        .gd-char-pfp {
          width: 24px;
          height: 24px;
        }

        .gd-char-status {
          font-size: 0.6rem;
          padding: 2px 4px;
        }

        /* DPS Overlays very small */
        #dps-overlay,
        #wb-dps-overlay {
          bottom: 120px;
          font-size: 10px;
        }

        #wb-dps-overlay {
          min-width: 140px;
        }
      }
    `;
    document.head.appendChild(style);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mc-monitor-toggle';
    toggleBtn.innerHTML = '';
    toggleBtn.title = 'Toggle Character Monitor';
    document.body.appendChild(toggleBtn);

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'mc-monitor-panel';
    panel.innerHTML = `
      <div class="mc-header">
        <h3>Character Monitor</h3>
        <div class="mc-header-buttons">
          <button id="mc-refresh-btn" title="Refresh All Characters Data">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-download">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/>
              <path d="m8 17 4 4 4-4"/>
            </svg>
          </button>
          <button id="mc-restart-all-combats-btn" title="Restart All Active Combats">
            <svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
              <path d="m512 154.661-.001-154.66-154.66-.001-188.771 241.813c-31.807-17.618-72.738-12.969-99.7 13.993l-10.607 10.607 50.483 50.483-45.402 45.402c-35.858 5.762-63.342 36.911-63.342 74.369 0 41.539 33.794 75.333 75.333 75.333 37.61 0 68.868-27.704 74.446-63.776l45.146-45.146 50.661 50.661 10.607-10.607c15.799-15.799 24.5-36.805 24.5-59.148 0-14.434-3.651-28.299-10.481-40.573zm-261.307 229.324c0 9.181-2.291 18.009-6.601 25.833l-141.896-141.896c20.37-11.17 46.517-8.139 63.753 9.098l69.03 69.03c10.134 10.133 15.714 23.605 15.714 37.935zm-220.693 52.682c0-24.997 20.336-45.333 45.333-45.333s45.333 20.336 45.333 45.333-20.336 45.333-45.333 45.333-45.333-20.336-45.333-45.333zm71.887-70.487 28.07-28.07 43.755 43.755-27.993 27.993c-7.678-20.089-23.709-36.072-43.832-43.678zm149.51-46.139-59.438-59.438 157.7-202.012.001 82.536-85.203 85.203 21.213 21.213 85.204-85.204 82.537.001zm128.263-187.701-.001-102.34 102.34.001.001 102.34z"/>
            </svg>
          </button>
          <button id="mc-restart-all-dungeons-btn" title="Restart All Active Dungeons">
            <svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
              <path d="m482 422v-196c0-60.134-23.572-116.823-66.375-159.625-42.802-42.803-99.491-66.375-159.625-66.375s-116.823 23.572-159.625 66.375c-42.803 42.802-66.375 99.491-66.375 159.625v196c-16.542 0-30 13.458-30 30v45c0 8.284 6.716 15 15 15h482c8.284 0 15-6.716 15-15v-45c0-16.542-13.458-30-30-30zm-30-196v16h-30v-16c0-13.303-1.587-26.376-4.651-39.016.061-.016.123-.027.184-.044l28.757-7.94c3.721 15.063 5.71 30.803 5.71 47zm-30 106v-60h30v60zm30 30v60h-30v-60zm-15.141-211.519-27.31 7.541c-.646.178-1.263.41-1.864.665-7.193-16.068-17.004-31.032-29.209-44.372l22.395-20.192c15.01 16.471 27.249 35.506 35.988 56.358zm-60.859 147.019h16v124.5h-70.667v-315.247c42.083 23.148 70.667 67.92 70.667 119.247v41.5h-16c-8.284 0-15 6.716-15 15s6.716 15 15 15zm-52.45-255.501c20.242 7.455 38.919 18.168 55.407 31.488l-22.703 20.47c-14.353-10.98-30.217-19.45-47.055-25.183zm-67.55-11.999c12.985 0 25.674 1.282 37.959 3.703l-14.955 27.9c-7.564-1.055-15.244-1.603-23.004-1.603s-15.441.548-23.005 1.603l-14.954-27.9c12.285-2.421 24.974-3.703 37.959-3.703zm35.333 64.665v327.335h-70.667v-327.335c11.273-3.036 23.116-4.665 35.334-4.665s24.061 1.629 35.333 4.665zm-102.883-52.666 14.351 26.774c-15.784 5.374-30.712 13.151-44.342 23.148l-22.777-20.537c15.833-12.348 33.6-22.325 52.768-29.385zm2.217 64.753v315.248h-70.667v-196c0-51.327 28.584-96.099 70.667-119.248zm-77.271-15.067 22.394 20.191c-12.912 13.574-23.271 28.923-30.854 45.459l-29.277-8.084c9.144-21.406 21.995-40.861 37.737-57.566zm-53.396 134.315c0-16.658 2.095-32.834 6.025-48.286l28.931 7.989c-3.271 13.035-4.956 26.545-4.956 40.297v16h-30zm0 46h30v60h-30zm0 90h30v60h-30zm422 120h-452.001l-.002-30h452.003z"/>
            </svg>
          </button>
          <button id="mc-restart-all-tasks-btn" title="Restart All Active Tasks">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button id="mc-close-btn" title="Close Panel">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="mc-tabs">
        <button class="mc-tab active" data-tab="characters">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Chars
        </button>
        <button class="mc-tab" data-tab="donations">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          Donate
        </button>
        <button class="mc-tab" data-tab="autosell">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          Sell
        </button>
        <button class="mc-tab" data-tab="combat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
            <line x1="13" x2="19" y1="19" y2="13"></line>
            <line x1="16" x2="20" y1="16" y2="20"></line>
            <line x1="19" x2="21" y1="21" y2="19"></line>
          </svg>
          Combat
        </button>
        <button class="mc-tab" data-tab="petfeed">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22l-.75-12.07A4.001 4.001 0 0 1 12 2Z"/>
            <path d="M9 6.12a7 7 0 0 0-7 7c0 1.1.9 2 2 2 .68 0 1.29-.35 1.65-.88"/>
            <path d="M15 6.12a7 7 0 0 1 7 7c0 1.1-.9 2-2 2-.68 0-1.29-.35-1.65-.88"/>
          </svg>
          Pet
        </button>
        <button class="mc-tab" data-tab="global">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            <path d="M2 12h20"/>
          </svg>
          Global
        </button>
      </div>
      <div class="mc-tab-content active" id="mc-tab-characters">
        <div class="mc-content" id="mc-content">
          <div class="mc-no-data">
            <p>Click the cloud icon to load character data</p>
          </div>
        </div>
      </div>
      <div class="mc-tab-content" id="mc-tab-donations">
        <div class="gd-container" id="gd-container">
          <!-- Guild Donations content will be rendered here -->
        </div>
      </div>
      <div class="mc-tab-content" id="mc-tab-autosell">
        <div class="as-container" id="as-container">
          <!-- Auto-Sell content will be rendered here -->
        </div>
      </div>
      <div class="mc-tab-content" id="mc-tab-combat">
        <div class="cj-container" id="cj-container">
          <!-- Combat Join content will be rendered here -->
        </div>
      </div>
      <div class="mc-tab-content" id="mc-tab-petfeed">
        <div class="pf-container" id="pf-container">
          <!-- Pet Feed content will be rendered here -->
        </div>
      </div>
      <div class="mc-tab-content" id="mc-tab-global">
        <div class="gl-container" id="gl-container">
          <!-- Global Auto Mode content will be rendered here -->
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listeners
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('visible');
    });

    document.getElementById('mc-close-btn').addEventListener('click', () => {
      panel.classList.remove('visible');
    });

    document.getElementById('mc-refresh-btn').addEventListener('click', () => {
      window.refreshAllCharacters();
    });

    document.getElementById('mc-restart-all-tasks-btn').addEventListener('click', () => {
      window.restartAllTasks();
    });

    document.getElementById('mc-restart-all-combats-btn').addEventListener('click', () => {
      window.restartAllCombats();
    });

    document.getElementById('mc-restart-all-dungeons-btn').addEventListener('click', () => {
      window.restartAllDungeons();
    });

    // Tab switching
    document.querySelectorAll('.mc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Update tab buttons
        document.querySelectorAll('.mc-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update tab content
        document.querySelectorAll('.mc-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`mc-tab-${tabName}`).classList.add('active');

        // Render tab content when switching
        if (tabName === 'donations') {
          renderGuildDonationsTab();
          hideAutoSellPanel(); // Close auto-sell panel when switching away
        } else if (tabName === 'autosell') {
          renderSellTabMini();
          // Don't auto-open the full panel - user clicks "Open Full Panel" button
        } else if (tabName === 'combat') {
          renderCombatJoinTab();
          hideAutoSellPanel(); // Close auto-sell panel when switching away
        } else if (tabName === 'petfeed') {
          renderPetFeedTab();
          // Auto-load pet data if not cached yet
          if (!PetFeedState.cachedPetData && TokenManager.isReady()) {
            window.pfRefreshData();
          }
          hideAutoSellPanel(); // Close auto-sell panel when switching away
        } else if (tabName === 'global') {
          renderGlobalTab();
          hideAutoSellPanel(); // Close auto-sell panel when switching away
        } else {
          hideAutoSellPanel(); // Close auto-sell panel when switching away
        }
      });
    });

    // Initialize Auto-Sell character watcher (handles timer start automatically)
    initAutoSellCharacterWatcher();

    // Initialize Pet Feed watcher (handles timer start automatically based on saved settings)
    initPetFeedWatcher();

    // Initial render of tabs
    renderGuildDonationsTab();
    renderSellTabMini();
    renderCombatJoinTab();
    renderPetFeedTab();
    renderGlobalTab();
  }

  function updateMonitorToggleIcon() {
    const toggleBtn = document.getElementById('mc-monitor-toggle');
    if (!toggleBtn) return;

    let iconUrl = null;

    // Priority 1: Use first character from DOM order (portraitsOrder)
    if (window.allCharactersData.portraitsOrder.length > 0) {
      const firstCharName = window.allCharactersData.portraitsOrder[0];

      // Find this character in charactersMap by name
      const charEntry = Object.values(window.allCharactersData.charactersMap).find(
        char => char.name === firstCharName
      );

      if (charEntry?.pfp) {
        iconUrl = charEntry.pfp;
      } else {
        // Fallback to portrait from navbar
        iconUrl = window.allCharactersData.portraitImages[firstCharName];
      }
    }

    // Priority 2: If no portraits order yet, use first from charactersList
    if (!iconUrl && window.allCharactersData.charactersList.length > 0) {
      iconUrl = window.allCharactersData.charactersList[0]?.pfp;
    }

    // Priority 3: Use first portrait from navbar
    if (!iconUrl) {
      iconUrl = Object.values(window.allCharactersData.portraitImages)[0];
    }

    if (iconUrl) {
      toggleBtn.innerHTML = `<img src="${iconUrl}"
        style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
      toggleBtn.innerHTML = ''; // Fallback
    }
  }

  function getHPClass(percent) {
    if (percent >= 80) return 'high';
    if (percent >= 40) return 'medium';
    return 'low';
  }

  function getCombatDurationClass(percent) {
    if (percent >= 75) return 'low';      // Rouge (critique)
    if (percent >= 50) return 'medium';   // Orange (attention)
    return 'high';                         // Vert (safe)
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  function updateMonitorPanel() {
    const content = document.getElementById('mc-content');
    if (!content) return;

    const data = window.allCharactersData;

    if (Object.keys(data.characters).length === 0) {
      content.innerHTML = `
        <div class="mc-no-data">
          <p>No character data available yet</p>
          <p style="font-size: 11px; margin-top: 8px;">Click "Refresh All" to collect data</p>
        </div>
      `;
      return;
    }

    let html = '';

    // Get all characters sorted by navbar portrait order
    const characters = Object.values(data.characters).sort((a, b) => {
      const nameA = a.character_name;
      const nameB = b.character_name;
      const indexA = data.portraitsOrder.indexOf(nameA);
      const indexB = data.portraitsOrder.indexOf(nameB);

      // If both are in the portraits order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only one is in the portraits order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      // Otherwise, sort alphabetically
      return nameA.localeCompare(nameB);
    });

    characters.forEach((charData) => {
      const charName = charData.character_name;
      const charId = charData.character_id;

      // Get portrait URL - prefer API pfp, fallback to navbar portrait
      const charInfo = data.charactersMap[charId];
      const portraitUrl = charInfo?.pfp || data.portraitImages[charName] || '';

      // ========== PRE-CALCULATE COMBAT DURATION (used in both collapsed and expanded views) ==========
      let durationPercent = null;
      let formattedDuration = null;
      let durationClass = null;

      if (charData.combat?.in_combat && charData.combat.participant_duration !== undefined) {
        const MAX_COMBAT_DURATION = 8 * 60 * 60; // 8 heures en secondes
        const currentDuration = charData.combat.participant_duration || 0;
        durationPercent = Math.min(100, Math.round((currentDuration / MAX_COMBAT_DURATION) * 100));
        durationClass = getCombatDurationClass(durationPercent);
        formattedDuration = formatDuration(currentDuration);
      }

      // ========== COMPACT HEADER INFO ==========
      let headerCombatStatus = '';
      let headerTaskStatus = '';

      if (charData.combat?.in_combat) {
        // Show combat duration percentage instead of HP
        if (durationPercent !== null) {
          headerCombatStatus = `<span class="mc-char-header-combat">${ICONS.combat} ${durationPercent}%</span>`;
        } else {
          headerCombatStatus = `<span class="mc-char-header-combat">${ICONS.combat} In combat</span>`;
        }
      } else if (charData.dungeon?.active) {
        // Dungeon status
        headerCombatStatus = `<span class="mc-char-header-combat">${ICONS.dungeon} ${charData.dungeon.currentRoom}/5 | ${charData.dungeon.chainPosition}/${charData.dungeon.chainTotal}</span>`;
      } else {
        headerCombatStatus = `<span class="mc-char-header-combat">${ICONS.idle} Idle</span>`;
      }

      if (charData.tasks.length > 0) {
        const task = charData.tasks[0];
        headerTaskStatus = `<span class="mc-char-header-task">${ICONS.task} ${task.percent}%</span>`;
      } else {
        headerTaskStatus = `<span class="mc-char-header-task">${ICONS.idle} No task</span>`;
      }

      // ========== DETAILED INFO (for expanded view) ==========
      let statsHTML = '';
      if (charData.combat?.in_combat) {
        const hpPercent = charData.combat.hp_percent || 0;

        // HP text
        const hpText = `${Math.round(charData.combat.current_hp)}/${charData.combat.max_hp}`;

        // Energy text
        let energyText = '';
        if (charData.combat.energy) {
          energyText = ` | ${ICONS.energy} ${charData.combat.energy.current}/${charData.combat.energy.max}`;
        }

        statsHTML = `
          <div class="mc-char-info" style="margin-bottom: 8px;">
            <div style="font-size: 13px; color: #cbd5e1; display: flex; align-items: center; gap: 4px;">
              ${ICONS.hp} ${hpText} HP (${hpPercent}%)${energyText}
            </div>
          </div>
        `;
      }

      // Combat duration progress bar (reuse pre-calculated values)
      let combatActionsHTML = '';
      if (charData.combat?.in_combat && durationPercent !== null) {
        combatActionsHTML = `
          <div class="mc-char-info" style="margin-bottom: 6px;">
            <div style="font-size: 12px; display: flex; align-items: center; gap: 4px;">${ICONS.combat} Combat Duration:</div>
            <div class="mc-task-progress">
              <div class="mc-progress-bar">
                <div class="mc-progress-fill ${durationClass}" style="width: ${durationPercent}%"></div>
              </div>
              <span style="min-width: 95px; text-align: right; font-size: 11px;">${formattedDuration} (${durationPercent}%)</span>
            </div>
          </div>
        `;
      }

      // Combat status (simple message if not in combat and not in dungeon)
      let combatHTML = '';
      if (!charData.combat?.in_combat && !charData.dungeon?.active) {
        combatHTML = `<div style="display: flex; align-items: center; gap: 4px;">${ICONS.idle} Not in combat</div>`;
      }

      // Task info
      let taskHTML = '';
      if (charData.tasks.length > 0) {
        const task = charData.tasks[0];
        taskHTML = `
          <div style="margin-top: 6px; display: flex; align-items: center; gap: 4px;">${ICONS.task} ${task.skill} - ${task.item}</div>
          <div class="mc-task-progress">
            <div class="mc-progress-bar">
              <div class="mc-progress-fill" style="width: ${task.percent}%"></div>
            </div>
            <span style="min-width: 80px; text-align: right; font-size: 11px;">${task.percent}% (${task.actions_completed}/${task.total_actions})</span>
          </div>
        `;
      } else {
        taskHTML = `<div style="margin-top: 6px; display: flex; align-items: center; gap: 4px;">${ICONS.idle} No active task</div>`;
      }

      // Last update
      const updateTime = new Date(charData.lastUpdate).toLocaleTimeString();

      html += `
        <div class="mc-character" data-char-id="${charId}">
          <div class="mc-char-header" onclick="toggleCharacterExpand('${charId}')">
            <img src="${portraitUrl}" class="mc-char-header-pfp">
            <div class="mc-char-header-name" title="${charName}">${charName}</div>
            <div class="mc-char-header-status">
              ${headerCombatStatus}
              ${headerTaskStatus}
            </div>
            <div class="mc-char-restart-group">
              ${charData.combat?.in_combat && charData.combat?.location_id ? `
                <button class="mc-char-restart-btn" onclick="event.stopPropagation(); restartCombat('${charId}', ${charData.combat.location_id}, '${charName}');" title="Restart this character's combat">
                  <svg viewBox="0 0 512 512" width="16" height="16" fill="currentColor">
                    <path d="m512 154.661-.001-154.66-154.66-.001-188.771 241.813c-31.807-17.618-72.738-12.969-99.7 13.993l-10.607 10.607 50.483 50.483-45.402 45.402c-35.858 5.762-63.342 36.911-63.342 74.369 0 41.539 33.794 75.333 75.333 75.333 37.61 0 68.868-27.704 74.446-63.776l45.146-45.146 50.661 50.661 10.607-10.607c15.799-15.799 24.5-36.805 24.5-59.148 0-14.434-3.651-28.299-10.481-40.573zm-261.307 229.324c0 9.181-2.291 18.009-6.601 25.833l-141.896-141.896c20.37-11.17 46.517-8.139 63.753 9.098l69.03 69.03c10.134 10.133 15.714 23.605 15.714 37.935zm-220.693 52.682c0-24.997 20.336-45.333 45.333-45.333s45.333 20.336 45.333 45.333-20.336 45.333-45.333 45.333-45.333-20.336-45.333-45.333zm71.887-70.487 28.07-28.07 43.755 43.755-27.993 27.993c-7.678-20.089-23.709-36.072-43.832-43.678zm149.51-46.139-59.438-59.438 157.7-202.012.001 82.536-85.203 85.203 21.213 21.213 85.204-85.204 82.537.001zm128.263-187.701-.001-102.34 102.34.001.001 102.34z"/>
                  </svg>
                </button>
              ` : ''}
              ${charData.dungeon?.active && charData.dungeon?.taskId && charData.dungeon?.dungeonId ? `
                <button class="mc-char-restart-btn" onclick="event.stopPropagation(); restartDungeon('${charId}', ${charData.dungeon.dungeonId}, '${charName}', '${charData.dungeon.taskId}');" title="Restart this character's dungeon">
                  <svg viewBox="0 0 512 512" width="16" height="16" fill="currentColor">
                    <path d="m482 422v-196c0-60.134-23.572-116.823-66.375-159.625-42.802-42.803-99.491-66.375-159.625-66.375s-116.823 23.572-159.625 66.375c-42.803 42.802-66.375 99.491-66.375 159.625v196c-16.542 0-30 13.458-30 30v45c0 8.284 6.716 15 15 15h482c8.284 0 15-6.716 15-15v-45c0-16.542-13.458-30-30-30zm-30-196v16h-30v-16c0-13.303-1.587-26.376-4.651-39.016.061-.016.123-.027.184-.044l28.757-7.94c3.721 15.063 5.71 30.803 5.71 47zm-30 106v-60h30v60zm30 30v60h-30v-60zm-15.141-211.519-27.31 7.541c-.646.178-1.263.41-1.864.665-7.193-16.068-17.004-31.032-29.209-44.372l22.395-20.192c15.01 16.471 27.249 35.506 35.988 56.358zm-60.859 147.019h16v124.5h-70.667v-315.247c42.083 23.148 70.667 67.92 70.667 119.247v41.5h-16c-8.284 0-15 6.716-15 15s6.716 15 15 15zm-52.45-255.501c20.242 7.455 38.919 18.168 55.407 31.488l-22.703 20.47c-14.353-10.98-30.217-19.45-47.055-25.183zm-67.55-11.999c12.985 0 25.674 1.282 37.959 3.703l-14.955 27.9c-7.564-1.055-15.244-1.603-23.004-1.603s-15.441.548-23.005 1.603l-14.954-27.9c12.285-2.421 24.974-3.703 37.959-3.703zm35.333 64.665v327.335h-70.667v-327.335c11.273-3.036 23.116-4.665 35.334-4.665s24.061 1.629 35.333 4.665zm-102.883-52.666 14.351 26.774c-15.784 5.374-30.712 13.151-44.342 23.148l-22.777-20.537c15.833-12.348 33.6-22.325 52.768-29.385zm2.217 64.753v315.248h-70.667v-196c0-51.327 28.584-96.099 70.667-119.248zm-77.271-15.067 22.394 20.191c-12.912 13.574-23.271 28.923-30.854 45.459l-29.277-8.084c9.144-21.406 21.995-40.861 37.737-57.566zm-53.396 134.315c0-16.658 2.095-32.834 6.025-48.286l28.931 7.989c-3.271 13.035-4.956 26.545-4.956 40.297v16h-30zm0 46h30v60h-30zm0 90h30v60h-30zm422 120h-452.001l-.002-30h452.003z"/>
                  </svg>
                </button>
              ` : ''}
              ${charData.tasks.length > 0 && charData.tasks[0].id ? `
                <button class="mc-char-restart-btn" onclick="event.stopPropagation(); restartTask('${charData.tasks[0].id}', '${charId}', '${charName}');" title="Restart this character's task">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                </button>
              ` : ''}
            </div>
            <div class="mc-char-header-expand">${ICONS.chevron}</div>
          </div>
          <div class="mc-char-details">
            ${statsHTML}
            ${combatActionsHTML}
            <div class="mc-char-info">
              ${combatHTML}
              ${taskHTML}
              <div style="margin-top: 6px; font-size: 11px; opacity: 0.7; display: flex; align-items: center; gap: 4px;">${ICONS.time} ${updateTime}</div>
            </div>
          </div>
        </div>
      `;
    });

    content.innerHTML = html;
  }

  // ============================================
  // TOGGLE CHARACTER EXPAND/COLLAPSE
  // ============================================
  window.toggleCharacterExpand = function(charId) {
    const charElement = document.querySelector(`.mc-character[data-char-id="${charId}"]`);
    if (charElement) {
      charElement.classList.toggle('expanded');
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4: GUILD DONATIONS MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // GUILD DONATIONS STATE & CONSTANTS
  // ============================================
  const DONATION_RESOURCE = "gold";
  const DONATION_QUANTITY = 100;
  const DONATION_MIN_DELAY = 200;  // .2s
  const DONATION_MAX_DELAY = 300;  // .3s
  const DONATION_CHAR_DELAY_MIN = 1500; // 1.5s entre chaque personnage
  const DONATION_CHAR_DELAY_MAX = 2500; // 2.5s
  const DONATION_MAX_RETRIES = 3;
  const DONATION_RETRY_DELAY = 3000; // 3s avant retry
  const DONATION_STORAGE_KEY = 'degenIdle_guildDonations_lastRun';

  const GuildDonationsState = {
    isRunning: false,
    results: [],       // Array of { name, status, donations }
    totalDonationsMade: 0,
    currentCharacter: null,
    currentCharacterDonations: 0,
    completedToday: false
  };

  // ============================================
  // GUILD DONATIONS - DAILY RUN TRACKER
  // ============================================
  function getTodayUTC() {
    return new Date().toISOString().split('T')[0];
  }

  function getDonationLastRunDate() {
    return localStorage.getItem(DONATION_STORAGE_KEY);
  }

  function setDonationLastRunDate() {
    localStorage.setItem(DONATION_STORAGE_KEY, getTodayUTC());
  }

  function hasDonationRunToday() {
    return getDonationLastRunDate() === getTodayUTC();
  }

  // ============================================
  // GUILD DONATIONS - UI RENDERING
  // ============================================
  function renderGuildDonationsTab() {
    const container = document.getElementById('gd-container');
    if (!container) return;

    // Save scroll position before re-rendering
    const charListEl = container.querySelector('.gd-char-list');
    const savedScrollTop = charListEl?.scrollTop || 0;

    const hasRun = hasDonationRunToday();
    const lastRun = getDonationLastRunDate();
    const isRunning = GuildDonationsState.isRunning;
    const characters = window.allCharactersData.charactersList || [];

    let html = '';

    // Show completed banner if done today
    if (hasRun && !isRunning) {
      html += `
        <div class="gd-completed-banner">
          <h4>Donations completed for today!</h4>
          <p>Last run: ${lastRun} (UTC)</p>
        </div>
      `;
    }

    // Status card
    html += `
      <div class="gd-status-card">
        <div class="gd-status-row">
          <span class="gd-status-label">Status</span>
          <span class="gd-status-value ${hasRun ? 'completed' : 'pending'}">${isRunning ? 'Running...' : (hasRun ? 'Completed' : 'Ready')}</span>
        </div>
        <div class="gd-status-row">
          <span class="gd-status-label">Last Run</span>
          <span class="gd-status-value">${lastRun || 'Never'}</span>
        </div>
        ${GuildDonationsState.totalDonationsMade > 0 ? `
        <div class="gd-status-row">
          <span class="gd-status-label">Total Donations</span>
          <span class="gd-status-value">${GuildDonationsState.totalDonationsMade}</span>
        </div>
        ` : ''}
      </div>
    `;

    // Start button or progress section
    if (isRunning) {
      const totalChars = characters.length;
      const completedChars = GuildDonationsState.results.length;
      const progressPercent = totalChars > 0 ? Math.round((completedChars / totalChars) * 100) : 0;

      html += `
        <button class="gd-start-btn running" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Donating...
        </button>
        <div class="gd-progress-section">
          <div class="gd-progress-header">
            <span class="gd-progress-label">Progress</span>
            <span class="gd-progress-value">${completedChars}/${totalChars} characters</span>
          </div>
          <div class="gd-progress-bar">
            <div class="gd-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>
      `;
    } else {
      html += `
        <button class="gd-start-btn" onclick="window.startGuildDonations()" ${characters.length === 0 ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          ${hasRun ? 'Run Again' : 'Start Guild Donations'}
        </button>
      `;
    }

    // Character list
    if (characters.length > 0) {
      html += '<div class="gd-char-list">';

      characters.forEach(char => {
        // Check if we have result for this character
        const result = GuildDonationsState.results.find(r => r.id === char.id);
        const isCurrentChar = GuildDonationsState.currentCharacter === char.id;

        let statusClass = 'ready';
        let statusText = 'Ready';

        if (result) {
          if (result.status === 'done') {
            statusClass = 'done';
            statusText = `${result.donations}/20`;
          } else if (result.status === 'no_guild') {
            statusClass = 'no-guild';
            statusText = 'No Guild';
          } else if (result.status === 'error') {
            statusClass = 'error';
            statusText = 'Error';
          }
        } else if (isCurrentChar) {
          statusClass = 'donating';
          statusText = `Donating... ${GuildDonationsState.currentCharacterDonations}/20`;
        }

        const portraitUrl = char.pfp || window.allCharactersData.portraitImages?.[char.name] || '';

        // Determine button state for individual donation
        const isDone = result?.donations >= 20;
        const isNoGuild = result?.status === 'no_guild';
        const btnDisabled = isRunning || isCurrentChar || isDone || isNoGuild;
        const btnText = isDone ? 'Done' : (isNoGuild ? '-' : 'Donate');
        const btnClass = isDone ? 'done' : '';

        html += `
          <div class="gd-char-item ${isCurrentChar ? 'active' : ''}">
            ${portraitUrl ? `<img src="${portraitUrl}" class="gd-char-pfp">` : ''}
            <span class="gd-char-name">${char.name}</span>
            <span class="gd-char-status ${statusClass}">${statusText}</span>
            <button class="gd-char-donate-btn ${btnClass}" onclick="window.donateForSingleCharacter('${char.id}')" ${btnDisabled ? 'disabled' : ''}>
              ${btnText}
            </button>
          </div>
        `;
      });

      html += '</div>';
    } else {
      html += `
        <div class="mc-no-data" style="padding: 20px;">
          <p>No characters loaded yet</p>
          <p style="font-size: 11px;">Click the cloud icon to load character data first</p>
        </div>
      `;
    }

    // Bottom progress bar (always visible during/after donations)
    const totalChars = characters.length;
    const completedChars = GuildDonationsState.results.length;
    const progressPercent = totalChars > 0 ? Math.round((completedChars / totalChars) * 100) : 0;
    const isComplete = completedChars === totalChars && totalChars > 0 && !isRunning;

    if (totalChars > 0 && (isRunning || GuildDonationsState.results.length > 0)) {
      html += `
        <div class="gd-bottom-progress">
          <div class="gd-bottom-progress-text">
            <span>${completedChars}/${totalChars} characters</span>
            <span>${GuildDonationsState.totalDonationsMade} donations</span>
          </div>
          <div class="gd-bottom-progress-bar">
            <div class="gd-bottom-progress-fill ${isComplete ? 'complete' : ''}" style="width: ${progressPercent}%"></div>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Restore scroll position after re-rendering
    requestAnimationFrame(() => {
      const newCharListEl = container.querySelector('.gd-char-list');
      if (newCharListEl && savedScrollTop > 0) {
        newCharListEl.scrollTop = savedScrollTop;
      }
    });
  }

  // ============================================
  // GUILD DONATIONS - MAIN LOGIC
  // ============================================
  window.startGuildDonations = async function() {
    if (GuildDonationsState.isRunning) {
      console.log('[GuildDonations] Already running!');
      return;
    }

    if (!TokenManager.isReady()) {
      showMonitorNotification('Token not ready yet. Navigate in the game first.', 'error');
      return;
    }

    const characters = window.allCharactersData.charactersList || [];
    if (characters.length === 0) {
      showMonitorNotification('No characters loaded. Click refresh first.', 'error');
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('[GuildDonations] Starting donations for all characters...');
    console.log('═══════════════════════════════════════════════════════');

    // Reset state
    GuildDonationsState.isRunning = true;
    GuildDonationsState.results = [];
    GuildDonationsState.totalDonationsMade = 0;
    GuildDonationsState.currentCharacter = null;
    GuildDonationsState.currentCharacterDonations = 0;
    GuildDonationsState.completedToday = false;

    renderGuildDonationsTab();
    console.log(`[GuildDonations] Starting donations for ${characters.length} character(s)...`);

    try {
      for (let i = 0; i < characters.length; i++) {
        const char = characters[i];
        GuildDonationsState.currentCharacter = char.id;
        GuildDonationsState.currentCharacterDonations = 0;
        renderGuildDonationsTab();

        console.log(`\n[GuildDonations] Processing ${char.name} (${char.id.substring(0, 8)}...)`);

        try {
          // Get guild info
          const guildInfo = await apiCall(`guilds/character/${char.id}`);

          if (!guildInfo.success || !guildInfo.guild) {
            console.log(`[GuildDonations] ${char.name} is not in a guild, skipping`);
            GuildDonationsState.results.push({ id: char.id, name: char.name, status: 'no_guild', donations: 0 });
            renderGuildDonationsTab();
            continue;
          }

          const guildId = guildInfo.guild.id;
          const guildName = guildInfo.guild.name;
          console.log(`[GuildDonations] ${char.name}: Guild "${guildName}"`);

          // Do the donations - try until donations_remaining_today === 0
          let donationsMade = 0;
          let remaining = 20; // Max possible
          let used = 0;

          while (remaining > 0) {
            let success = false;
            let retryCount = 0;

            while (!success && retryCount < DONATION_MAX_RETRIES) {
              try {
                const result = await apiPost(`guilds/${guildId}/donate`, {
                  characterId: char.id,
                  resource: DONATION_RESOURCE,
                  quantity: DONATION_QUANTITY
                });

                if (result.success) {
                  donationsMade++;
                  GuildDonationsState.totalDonationsMade++;
                  GuildDonationsState.currentCharacterDonations = donationsMade;
                  remaining = result.donations_remaining_today;
                  used = result.donations_used_today;
                  success = true;
                  renderGuildDonationsTab();
                  console.log(`[GuildDonations] ${char.name}: Donation successful (${used}/20, ${remaining} remaining)`);
                } else {
                  // Check if it's because already maxed out
                  if (result.donations_remaining_today === 0 || result.message?.includes('maximum')) {
                    console.log(`[GuildDonations] ${char.name}: Already at max donations`);
                    remaining = 0;
                  } else {
                    console.log(`[GuildDonations] ${char.name}: Donation failed`, result);
                  }
                  break;
                }
              } catch (error) {
                retryCount++;
                // Check if error indicates max donations reached
                if (error.message?.includes('400') || error.message?.includes('limit')) {
                  console.log(`[GuildDonations] ${char.name}: Donation limit reached`);
                  remaining = 0;
                  break;
                } else if (error.message?.includes('500') && retryCount < DONATION_MAX_RETRIES) {
                  // Server error - retry
                  console.log(`[GuildDonations] ${char.name}: Server error, retry ${retryCount}/${DONATION_MAX_RETRIES}`);
                  await sleep(DONATION_RETRY_DELAY * retryCount); // Increasing delay
                } else {
                  console.error(`[GuildDonations] Donation error:`, error);
                  remaining = 0;
                  break;
                }
              }
            }

            // If we exhausted retries without success, stop
            if (!success && retryCount >= DONATION_MAX_RETRIES) {
              console.log(`[GuildDonations] ${char.name}: Max retries reached`);
              break;
            }

            // Random delay between donations
            if (remaining > 0 && success) {
              const delay = randomDelay(DONATION_MIN_DELAY, DONATION_MAX_DELAY);
              await sleep(delay);
            }
          }

          if (donationsMade > 0) {
            console.log(`[GuildDonations] ${char.name}: Completed ${donationsMade} donations (now ${used}/20)`);
          } else {
            console.log(`[GuildDonations] ${char.name}: Already done (${used}/20)`);
          }
          GuildDonationsState.results.push({ id: char.id, name: char.name, status: 'done', donations: used });
          renderGuildDonationsTab();

        } catch (error) {
          console.error(`[GuildDonations] Error processing ${char.name}:`, error);
          GuildDonationsState.results.push({ id: char.id, name: char.name, status: 'error', donations: 0 });
          renderGuildDonationsTab();
        }

        // Delay between characters
        if (i < characters.length - 1) {
          const charDelay = randomDelay(DONATION_CHAR_DELAY_MIN, DONATION_CHAR_DELAY_MAX);
          await sleep(charDelay);
        }
      }

      // Final summary
      console.log('\n═══════════════════════════════════════════════════════');
      console.log('[GuildDonations] Donations completed!');
      console.log(`   Total donations made: ${GuildDonationsState.totalDonationsMade}`);
      console.log('═══════════════════════════════════════════════════════');

      // Check if all characters are done (20/20 or not in guild)
      const allDone = GuildDonationsState.results.every(r => r.donations >= 20 || r.status === 'no_guild');
      if (allDone) {
        setDonationLastRunDate();
        GuildDonationsState.completedToday = true;
        console.log('[GuildDonations] All characters completed! Marked as done for today (UTC)');
      }

      showMonitorNotification(`Guild donations completed! ${GuildDonationsState.totalDonationsMade} donations made.`, 'success', 5000);

    } catch (error) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('[GuildDonations] Donations failed:', error);
      console.error('═══════════════════════════════════════════════════════');

      showMonitorNotification(`Guild donations failed: ${error.message}`, 'error');
    } finally {
      GuildDonationsState.isRunning = false;
      GuildDonationsState.currentCharacter = null;
      renderGuildDonationsTab();
    }
  };

  // ============================================
  // GUILD DONATIONS - SINGLE CHARACTER
  // ============================================
  window.donateForSingleCharacter = async function(charId) {
    if (GuildDonationsState.isRunning) {
      console.log('[GuildDonations] Already running!');
      showMonitorNotification('Donations already in progress', 'error');
      return;
    }

    if (!TokenManager.isReady()) {
      showMonitorNotification('Token not ready yet. Navigate in the game first.', 'error');
      return;
    }

    // Find character info
    const characters = window.allCharactersData.charactersList || [];
    const char = characters.find(c => c.id === charId);

    if (!char) {
      showMonitorNotification('Character not found', 'error');
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log(`[GuildDonations] Starting donations for ${char.name}...`);
    console.log('═══════════════════════════════════════════════════════');

    // Set running state
    GuildDonationsState.isRunning = true;
    GuildDonationsState.currentCharacter = charId;
    GuildDonationsState.currentCharacterDonations = 0;

    renderGuildDonationsTab();

    try {
      // Get guild info
      const guildInfo = await apiCall(`guilds/character/${charId}`);

      if (!guildInfo.success || !guildInfo.guild) {
        console.log(`[GuildDonations] ${char.name} is not in a guild`);

        // Update or add result
        const existingIndex = GuildDonationsState.results.findIndex(r => r.id === charId);
        const resultEntry = { id: charId, name: char.name, status: 'no_guild', donations: 0 };
        if (existingIndex >= 0) {
          GuildDonationsState.results[existingIndex] = resultEntry;
        } else {
          GuildDonationsState.results.push(resultEntry);
        }

        showMonitorNotification(`${char.name} is not in a guild`, 'error');
        return;
      }

      const guildId = guildInfo.guild.id;
      const guildName = guildInfo.guild.name;
      console.log(`[GuildDonations] ${char.name}: Guild "${guildName}"`);

      // Do the donations
      let donationsMade = 0;
      let remaining = 20;
      let used = 0;

      while (remaining > 0) {
        let success = false;
        let retryCount = 0;

        while (!success && retryCount < DONATION_MAX_RETRIES) {
          try {
            const result = await apiPost(`guilds/${guildId}/donate`, {
              characterId: charId,
              resource: DONATION_RESOURCE,
              quantity: DONATION_QUANTITY
            });

            if (result.success) {
              donationsMade++;
              GuildDonationsState.totalDonationsMade++;
              GuildDonationsState.currentCharacterDonations = donationsMade;
              remaining = result.donations_remaining_today;
              used = result.donations_used_today;
              success = true;
              renderGuildDonationsTab();
              console.log(`[GuildDonations] ${char.name}: Donation successful (${used}/20, ${remaining} remaining)`);
            } else {
              if (result.donations_remaining_today === 0 || result.message?.includes('maximum')) {
                console.log(`[GuildDonations] ${char.name}: Already at max donations`);
                remaining = 0;
              } else {
                console.log(`[GuildDonations] ${char.name}: Donation failed`, result);
              }
              break;
            }
          } catch (error) {
            retryCount++;
            if (error.message?.includes('400') || error.message?.includes('limit')) {
              console.log(`[GuildDonations] ${char.name}: Donation limit reached`);
              remaining = 0;
              break;
            } else if (error.message?.includes('500') && retryCount < DONATION_MAX_RETRIES) {
              console.log(`[GuildDonations] ${char.name}: Server error, retry ${retryCount}/${DONATION_MAX_RETRIES}`);
              await sleep(DONATION_RETRY_DELAY * retryCount);
            } else {
              console.error(`[GuildDonations] Donation error:`, error);
              remaining = 0;
              break;
            }
          }
        }

        if (!success && retryCount >= DONATION_MAX_RETRIES) {
          console.log(`[GuildDonations] ${char.name}: Max retries reached`);
          break;
        }

        if (remaining > 0 && success) {
          const delay = randomDelay(DONATION_MIN_DELAY, DONATION_MAX_DELAY);
          await sleep(delay);
        }
      }

      // Update or add result
      const existingIndex = GuildDonationsState.results.findIndex(r => r.id === charId);
      const resultEntry = { id: charId, name: char.name, status: 'done', donations: used };
      if (existingIndex >= 0) {
        GuildDonationsState.results[existingIndex] = resultEntry;
      } else {
        GuildDonationsState.results.push(resultEntry);
      }

      console.log(`[GuildDonations] ${char.name}: Completed ${donationsMade} donations (now ${used}/20)`);
      showMonitorNotification(`Donations completed for ${char.name}! ${used}/20`, 'success', 5000);

    } catch (error) {
      console.error(`[GuildDonations] Error for ${char.name}:`, error);

      // Update or add error result
      const existingIndex = GuildDonationsState.results.findIndex(r => r.id === charId);
      const resultEntry = { id: charId, name: char.name, status: 'error', donations: 0 };
      if (existingIndex >= 0) {
        GuildDonationsState.results[existingIndex] = resultEntry;
      } else {
        GuildDonationsState.results.push(resultEntry);
      }

      showMonitorNotification(`Donation failed for ${char.name}: ${error.message}`, 'error');
    } finally {
      GuildDonationsState.isRunning = false;
      GuildDonationsState.currentCharacter = null;
      renderGuildDonationsTab();
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4B: AUTO-SELL MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // ITEM DATABASE - Equipment items with images
  // ============================================
  const ITEM_DATABASE = {
    88: {n:'Copper Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/copperhelmet.png'},
    89: {n:'Copper Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/copperbodyarmor.png'},
    90: {n:'Copper Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/copperboots.png'},
    91: {n:'Copper Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/coppergloves.png'},
    92: {n:'Copper Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/coppersword.png'},
    93: {n:'Copper Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/coppershield.png'},
    94: {n:'Iron Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/ironhelmet.png'},
    95: {n:'Iron Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/ironbodyarmor.png'},
    96: {n:'Iron Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/ironboots.png'},
    97: {n:'Iron Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/irongloves.png'},
    98: {n:'Iron Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/ironsword.png'},
    99: {n:'Iron Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/ironshield.png'},
    112: {n:'Silver Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/silverhelmet.png'},
    113: {n:'Silver Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/silverbodyarmor.png'},
    114: {n:'Silver Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/silverboots.png'},
    115: {n:'Silver Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/silvergloves.png'},
    116: {n:'Silver Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/silversword.png'},
    117: {n:'Silver Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/silvershield.png'},
    118: {n:'Gold Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/goldhelmet.png'},
    119: {n:'Gold Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/goldbodyarmor.png'},
    120: {n:'Gold Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/goldboots.png'},
    121: {n:'Gold Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/goldgloves.png'},
    122: {n:'Gold Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/goldsword.png'},
    123: {n:'Gold Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/goldshield.png'},
    124: {n:'Platinum Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/platinumhelmet.png'},
    125: {n:'Platinum Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/platinumbodyarmor.png'},
    126: {n:'Platinum Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/platinumboots.png'},
    127: {n:'Platinum Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/platinumgloves.png'},
    128: {n:'Platinum Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/platinumsword.png'},
    129: {n:'Platinum Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/platinumshield.png'},
    130: {n:'Mithril Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/mithrilhelmet.png'},
    131: {n:'Mithril Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/mithrilbodyarmor.png'},
    132: {n:'Mithril Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/mithrilboots.png'},
    133: {n:'Mithril Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/mithrilgloves.png'},
    134: {n:'Mithril Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/mithrilsword.png'},
    135: {n:'Mithril Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/mithrilshield.png'},
    136: {n:'Adamantite Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/adamantitehelmet.png'},
    137: {n:'Adamantite Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/adamantitebodyarmor.png'},
    138: {n:'Adamantite Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/adamantiteboots.png'},
    139: {n:'Adamantite Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/adamantitegloves.png'},
    140: {n:'Adamantite Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/adamantitesword.png'},
    141: {n:'Adamantite Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/adamantiteshield.png'},
    142: {n:'Eternium Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/eterniumhelmet.png'},
    143: {n:'Eternium Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/eterniumbodyarmor.png'},
    144: {n:'Eternium Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/eterniumboots.png'},
    145: {n:'Eternium Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/eterniumgloves.png'},
    146: {n:'Eternium Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/eterniumsword.png'},
    147: {n:'Eternium Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/eterniumshield.png'},
    159: {n:'Leather Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/leatherhat.png'},
    160: {n:'Leather Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/leatherbodyarmor.png'},
    161: {n:'Leather Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/leatherboots.png'},
    162: {n:'Leather Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/leathergloves.png'},
    171: {n:'Thick Leather Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/thickleatherhat.png'},
    172: {n:'Thick Leather Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/thickleatherbodyarmor.png'},
    173: {n:'Thick Leather Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/thickleatherboots.png'},
    174: {n:'Thick Leather Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/thickleathergloves.png'},
    175: {n:'Sturdy Leather Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/sturdyleatherhat.png'},
    176: {n:'Sturdy Leather Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/sturdyleatherbodyarmor.png'},
    177: {n:'Sturdy Leather Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/sturdyleatherboots.png'},
    178: {n:'Sturdy Leather Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/sturdyleathergloves.png'},
    179: {n:'Heavy Leather Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/heavyleatherhat.png'},
    180: {n:'Heavy Leather Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/heavyleatherbodyarmor.png'},
    181: {n:'Heavy Leather Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/heavyleatherboots.png'},
    182: {n:'Heavy Leather Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/heavyleathergloves.png'},
    183: {n:'Tough Leather Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/toughleatherhat.png'},
    184: {n:'Tough Leather Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/toughleatherbodyarmor.png'},
    185: {n:'Tough Leather Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/toughleatherboots.png'},
    186: {n:'Tough Leather Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/toughleathergloves.png'},
    187: {n:'Reinforced Leather Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/reinforcedleatherhat.png'},
    188: {n:'Reinforced Leather Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/reinforcedleatherbodyarmor.png'},
    189: {n:'Reinforced Leather Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/reinforcedleatherboots.png'},
    190: {n:'Reinforced Leather Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/reinforcedleathergloves.png'},
    191: {n:'Shadowhide Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/shadowleatherhat.png'},
    192: {n:'Shadowhide Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/shadowleatherbodyarmor.png'},
    193: {n:'Shadowhide Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/shadowleatherboots.png'},
    194: {n:'Shadowhide Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/shadowleathergloves.png'},
    195: {n:'Dragonhide Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/dragonleatherhat.png'},
    196: {n:'Dragonhide Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/dragonleatherbodyarmor.png'},
    197: {n:'Dragonhide Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/dragonleatherboots.png'},
    198: {n:'Dragonhide Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/dragonleathergloves.png'},
    199: {n:'Abyssal Hat',i:'https://cdn.degendungeon.com/Leatherworking/Armor/abyssalleatherhat.png'},
    200: {n:'Abyssal Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/abyysalleatherbodyarmor.png'},
    201: {n:'Abyssal Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/abyssalleatherboots.png'},
    202: {n:'Abyssal Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/abyssalleathergloves.png'},
    214: {n:'Wool Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/woolwizardhat.png'},
    215: {n:'Wool Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/woolrobe.png'},
    216: {n:'Wool Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/woolshoes.png'},
    217: {n:'Wool Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/woolgloves.png'},
    226: {n:'Silk Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/silkwizardhat.png'},
    227: {n:'Silk Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/silkrobe.png'},
    228: {n:'Silk Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/silkshoes.png'},
    229: {n:'Silk Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/silkgloves.png'},
    230: {n:'Moonlit Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/moonlitwizardhat.png'},
    231: {n:'Moonlit Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/moonlitrobe.png'},
    232: {n:'Moonlit Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/moonlitshoes.png'},
    233: {n:'Moonlit Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/moonlitgloves.png'},
    234: {n:'Etheric Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/ethericwizardhat.png'},
    235: {n:'Etheric Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/ethericrobe.png'},
    236: {n:'Etheric Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/ethericshoes.png'},
    237: {n:'Etheric Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/ethericgloves.png'},
    238: {n:'Shadow Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/shadowwizardhat.png'},
    239: {n:'Shadow Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/shadowrobe.png'},
    240: {n:'Shadow Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/shadowshoes.png'},
    241: {n:'Shadow Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/shadowgloves.png'},
    242: {n:'Mystic Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/celestialwizardhat.png'},
    243: {n:'Mystic Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/celestialrobe.png'},
    244: {n:'Mystic Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/celestialshoes.png'},
    245: {n:'Mystic Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/celestialgloves.png'},
    246: {n:'Arcane Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/arcanewizardhat.png'},
    247: {n:'Arcane Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/arcanerobe.png'},
    248: {n:'Arcane Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/arcaneshoes.png'},
    249: {n:'Arcane Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/arcanegloves.png'},
    250: {n:'Aether Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/aetherwizardhat.png'},
    251: {n:'Aether Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/aetherrobe.png'},
    252: {n:'Aether Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/aethershoes.png'},
    253: {n:'Aether Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/aethergloves.png'},
    254: {n:'Astral Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/astralwizardhat.png'},
    255: {n:'Astral Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/astralrobe.png'},
    256: {n:'Astral Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/astralshoes.png'},
    257: {n:'Astral Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/astralgloves.png'},
    271: {n:'Wool Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/woolstaff.png'},
    272: {n:'Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/leatherbow.png'},
    277: {n:'Leather Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/leatherpouch.png'},
    278: {n:'Wool Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/woolbasket.png'},
    279: {n:'Silk Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/silkstaff.png'},
    280: {n:'Thick Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/thickleatherbow.png'},
    281: {n:'Copper Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/copperpickaxe.png'},
    282: {n:'Copper Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/copperaxe.png'},
    283: {n:'Copper Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/copperfishingrod.png'},
    284: {n:'Copper Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/coppertrap.png'},
    287: {n:'Moonlit Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/moonlitstaff.png'},
    288: {n:'Sturdy Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/sturdyleatherbow.png'},
    289: {n:'Iron Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/ironpickaxe.png'},
    290: {n:'Iron Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/ironaxe.png'},
    291: {n:'Iron Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/ironfishingrod.png'},
    292: {n:'Iron Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/irontrap.png'},
    295: {n:'Etheric Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/ethericstaff.png'},
    296: {n:'Heavy Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/heavyleatherbow.png'},
    301: {n:'Thick Leather Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/thickleatherpouch.png'},
    302: {n:'Silk Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/silkbasket.png'},
    309: {n:'Sturdy Leather Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/sturdyleatherpouch.png'},
    310: {n:'Moonlit Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/moonlitbasket.png'},
    313: {n:'Silver Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/silverpickaxe.png'},
    314: {n:'Silver Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/silveraxe.png'},
    315: {n:'Silver Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/silverfishingrod.png'},
    316: {n:'Silver Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/silvertrap.png'},
    317: {n:'Heavy Leather Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/heavyleatherpouch.png'},
    318: {n:'Etheric Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/ethericbasket.png'},
    319: {n:'Shadow Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/shadowstaff.png'},
    320: {n:'Tough Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/toughleatherbow.png'},
    321: {n:'Gold Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/goldpickaxe.png'},
    322: {n:'Gold Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/goldaxe.png'},
    323: {n:'Gold Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/goldfishingrod.png'},
    324: {n:'Gold Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/goldtrap.png'},
    325: {n:'Tough Leather Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/toughleatherpouch.png'},
    326: {n:'Shadow Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/shadowbasket.png'},
    327: {n:'Mystweave Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/mystweavestaff.png'},
    328: {n:'Reinforced Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/reinforcedleatherbow.png'},
    329: {n:'Platinum Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/platinumpickaxe.png'},
    330: {n:'Platinum Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/platinumaxe.png'},
    331: {n:'Platinum Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/platinumfishingrod.png'},
    332: {n:'Platinum Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/platinumtrap.png'},
    333: {n:'Reinforced Leather Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/reinforcedleatherpouch.png'},
    334: {n:'Celestial Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/celestialbasket.png'},
    335: {n:'Arcane Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/arcanestaff.png'},
    336: {n:'Shadowhide Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/shadowhideleatherbow.png'},
    337: {n:'Mithril Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/mithrilpickaxe.png'},
    338: {n:'Mithril Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/mithrilaxe.png'},
    339: {n:'Mithril Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/mithrilfishingrod.png'},
    340: {n:'Mithril Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/mithriltrap.png'},
    341: {n:'Shadowhide Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/shadowleatherpouch.png'},
    342: {n:'Arcane Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/arcanebasket.png'},
    343: {n:'Aether Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/aetherstaff.png'},
    344: {n:'Dragonhide Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/dragonhideleatherbow.png'},
    345: {n:'Adamantite Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/adamantitepickaxe.png'},
    346: {n:'Adamantite Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/adamantiteaxe.png'},
    347: {n:'Adamantite Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/adamantitefishingrod.png'},
    348: {n:'Adamantite Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/adamantitetrap.png'},
    349: {n:'Dragonhide Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/dragonleatherpouch.png'},
    350: {n:'Aether Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/aetherbasket.png'},
    351: {n:'Astral Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/astralstaff.png'},
    352: {n:'Abyssal Leather Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/abyssalleatherbow.png'},
    353: {n:'Eternium Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/eterniumpickaxe.png'},
    354: {n:'Eternium Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/eterniumaxe.png'},
    355: {n:'Eternium Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/eterniumfishingrod.png'},
    356: {n:'Eternium Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/eterniumtrap.png'},
    357: {n:'Abyssal Pouch',i:'https://cdn.degendungeon.com/Crafting/Tools/Pouches/abyssalpouch.png'},
    358: {n:'Astral Basket',i:'https://cdn.degendungeon.com/Crafting/Tools/Baskets/astralbasket.png'},
    595: {n:'Nyxium Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/nyxiumhelmet.png'},
    596: {n:'Nyxium Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/nyxiumbodyarmor.png'},
    597: {n:'Nyxium Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/nyxiumgloves.png'},
    598: {n:'Nyxium Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/nyxiumboots.png'},
    599: {n:'Nyxium Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/nyxiumshield.png'},
    600: {n:'Nyxium Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/nyxiumsword.png'},
    601: {n:'Nyxium Pickaxe',i:'https://cdn.degendungeon.com/Crafting/Tools/Pickaxes/nyxiumpickaxe.png'},
    603: {n:'Nyxium Axe',i:'https://cdn.degendungeon.com/Crafting/Tools/Axes/nyxiumaxe.png'},
    605: {n:'Nyxium Fishing Rod',i:'https://cdn.degendungeon.com/Crafting/Tools/Fishingrods/nyxiumfishingrod.png'},
    607: {n:'Nyxium Trap',i:'https://cdn.degendungeon.com/Crafting/Tools/Traps/nyxiumtrap.png'},
    715: {n:'Cursed Bastion Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t1forginghelmet.png'},
    716: {n:'Cursed Bastion Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t1forgingbodyarmor.png'},
    717: {n:'Cursed Bastion Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t1forginggloves.png'},
    718: {n:'Cursed Bastion Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t1forgingboots.png'},
    719: {n:'Cursed Bastion Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/t1forgingsword.png'},
    720: {n:'Cursed Bastion Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/t1forgingshield.png'},
    721: {n:'Abyssal Bastion Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t2forginghelmet.png'},
    722: {n:'Abyssal Bastion Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t2forgingbodyarmor.png'},
    723: {n:'Abyssal Bastion Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t2forginggloves.png'},
    724: {n:'Abyssal Bastion Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t2forgingboots.png'},
    725: {n:'Abyssal Bastion Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/t2forgingsword.png'},
    726: {n:'Abyssal Bastion Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/t2forgingshield.png'},
    727: {n:'Corrupted Bastion Helmet',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t3forginghelmet.png'},
    728: {n:'Corrupted Bastion Bodyarmor',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t3forgingbodyarmor.png'},
    729: {n:'Corrupted Bastion Gloves',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t3forginggloves.png'},
    730: {n:'Corrupted Bastion Boots',i:'https://cdn.degendungeon.com/Blacksmithing/Armor/t3forgingboots.png'},
    731: {n:'Corrupted Bastion Sword',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/t3forgingsword.png'},
    732: {n:'Corrupted Bastion Shield',i:'https://cdn.degendungeon.com/Blacksmithing/Weapons/t3forgingshield.png'},
    733: {n:'Cursed Slayer Hood',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t1leatherworkinghat.png'},
    734: {n:'Cursed Slayer Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t1leatherworkingbodyarmor.png'},
    735: {n:'Cursed Slayer Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t1leatherworkinggloves.png'},
    736: {n:'Cursed Slayer Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t1leatherworkingboots.png'},
    737: {n:'Cursed Slayer Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/t1leatherworkingbow.png'},
    738: {n:'Abyssal Slayer Hood',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t2leatherworkinghat.png'},
    739: {n:'Abyssal Slayer Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t2leatherworkingbodyarmor.png'},
    740: {n:'Abyssal Slayer Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t2leatherworkinggloves.png'},
    741: {n:'Abyssal Slayer Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t2leatherworkingboots.png'},
    742: {n:'Abyssal Slayer Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/t2leatherworkingbow.png'},
    743: {n:'Corrupted Slayer Hood',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t3leatherworkinghat.png'},
    744: {n:'Corrupted Slayer Bodyarmor',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t3leatherworkingbodyarmor.png'},
    745: {n:'Corrupted Slayer Gloves',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t3leatherworkinggloves.png'},
    746: {n:'Corrupted Slayer Boots',i:'https://cdn.degendungeon.com/Leatherworking/Armor/t3leatherworkingboots.png'},
    747: {n:'Corrupted Slayer Bow',i:'https://cdn.degendungeon.com/Crafting/Bow/t3leatherworkingbow.png'},
    748: {n:'Cursed Invoker Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/t1tailoringhat.png'},
    749: {n:'Cursed Invoker Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/t1tailoringrobe.png'},
    750: {n:'Cursed Invoker Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/t1tailoringgloves.png'},
    751: {n:'Cursed Invoker Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/t1tailoringshoes.png'},
    752: {n:'Cursed Invoker Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/t1tailoringstaff.png'},
    753: {n:'Abyssal Invoker Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/t2tailoringhat.png'},
    754: {n:'Abyssal Invoker Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/t2tailoringrobe.png'},
    755: {n:'Abyssal Invoker Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/t2tailoringgloves.png'},
    756: {n:'Abyssal Invoker Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/t2tailoringshoes.png'},
    757: {n:'Abyssal Invoker Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/t2tailoringstaff.png'},
    758: {n:'Corrupted Invoker Hat',i:'https://cdn.degendungeon.com/Tailoring/Armor/t3tailoringhat.png'},
    759: {n:'Corrupted Invoker Robe',i:'https://cdn.degendungeon.com/Tailoring/Armor/t3tailoringrobe.png'},
    760: {n:'Corrupted Invoker Gloves',i:'https://cdn.degendungeon.com/Tailoring/Armor/t3tailoringgloves.png'},
    761: {n:'Corrupted Invoker Shoes',i:'https://cdn.degendungeon.com/Tailoring/Armor/t3tailoringshoes.png'},
    762: {n:'Corrupted Invoker Staff',i:'https://cdn.degendungeon.com/Crafting/Staff/t3tailoringstaff.png'},
    775: {n:'Platinum Ring',i:'https://cdn.degendungeon.com/Crafting/Accessories/platinumring.png'},
    776: {n:'Platinum Amulet',i:'https://cdn.degendungeon.com/Crafting/Accessories/platinumamulet.png'},
    777: {n:'Nyxium Ring',i:'https://cdn.degendungeon.com/Crafting/Accessories/nyxiumring.png'},
    778: {n:'Nyxium Amulet',i:'https://cdn.degendungeon.com/Crafting/Accessories/nyxiumamulet.png'},
    779: {n:'Cursed Ring',i:'https://cdn.degendungeon.com/Crafting/Accessories/cursedring.png'},
    780: {n:'Cursed Amulet',i:'https://cdn.degendungeon.com/Crafting/Accessories/cursedamulet.png'},
    781: {n:'Abyssal Ring',i:'https://cdn.degendungeon.com/Crafting/Accessories/abyssalring.png'},
    782: {n:'Abyssal Amulet',i:'https://cdn.degendungeon.com/Crafting/Accessories/abyssalamulet.png'},
    783: {n:'Corrupted Ring',i:'https://cdn.degendungeon.com/Crafting/Accessories/corruptedring.png'},
    784: {n:'Corrupted Amulet',i:'https://cdn.degendungeon.com/Crafting/Accessories/corruptedamulet.png'}
  };

  // ============================================
  // AUTO-SELL STATE
  // ============================================
  const AutoSellState = {
    characterId: null,      // Track current character for security
    isRunning: false,
    timer: null,
    inventory: [],
    selectedItems: new Set(),
    equippedIds: new Set(), // Track equipped items
    config: null,
    lastScanTime: null,
    statusMessage: null     // Status message to display in panel
  };

  // Known affixes in the game (exact API names from affix_stats)
  const KNOWN_AFFIXES = [
    'max_health', 'max_energy', 'attack_power', 'attack_speed', 'defense',
    'crit_chance', 'crit_damage', 'defense_penetration', 'resource_efficiency',
    'damage_reflect', 'dodge', 'block_chance', 'perfect_block',
    'health_on_hit', 'health_on_crit', 'health_on_dodge', 'health_on_block',
    'energy_on_hit', 'energy_on_crit', 'energy_on_dodge', 'energy_on_block',
    'combat_exp', 'pet_exp', 'drop_chance', 'gold_find'
  ];

  // Affixes available per equipment slot
  const SLOT_AFFIXES = {
    helmet: ['max_health', 'max_energy', 'attack_power', 'crit_chance', 'crit_damage',
             'defense_penetration', 'resource_efficiency', 'damage_reflect',
             'health_on_crit', 'energy_on_dodge'],
    bodyarmor: ['max_health', 'max_energy', 'defense', 'defense_penetration',
                'resource_efficiency', 'damage_reflect', 'dodge',
                'health_on_hit', 'health_on_dodge', 'energy_on_hit'],
    gloves: ['attack_power', 'attack_speed', 'crit_chance', 'crit_damage',
             'defense_penetration', 'resource_efficiency',
             'health_on_hit', 'health_on_crit', 'energy_on_hit', 'energy_on_crit'],
    boots: ['max_health', 'max_energy', 'attack_speed', 'defense', 'crit_damage',
            'dodge', 'health_on_crit', 'health_on_dodge', 'energy_on_crit', 'energy_on_dodge'],
    amulet: ['max_health', 'max_energy', 'defense', 'resource_efficiency',
             'damage_reflect', 'perfect_block', 'health_on_dodge', 'health_on_block',
             'energy_on_dodge', 'combat_exp', 'pet_exp'],
    ring: ['max_health', 'max_energy', 'attack_power', 'defense', 'crit_damage',
           'defense_penetration', 'health_on_hit', 'health_on_crit',
           'energy_on_hit', 'energy_on_crit', 'drop_chance', 'gold_find'],
    weapon: ['attack_power', 'attack_speed', 'crit_chance', 'crit_damage',
             'defense_penetration', 'resource_efficiency',
             'health_on_hit', 'health_on_crit', 'energy_on_hit', 'energy_on_crit'],
    shield: ['max_health', 'max_energy', 'attack_power', 'defense',
             'resource_efficiency', 'damage_reflect', 'block_chance', 'perfect_block',
             'health_on_block', 'energy_on_block']
  };

  const SLOT_LABELS = {
    helmet: 'Helmet',
    bodyarmor: 'Body Armor',
    gloves: 'Gloves',
    boots: 'Boots',
    weapon: 'Sword/Staff',
    shield: 'Shield',
    amulet: 'Amulet',
    ring: 'Ring',
    tool: 'Tools'
  };

  // ============================================
  // AUTO-SELL CHARACTER CHANGE DETECTION
  // ============================================
  function resetAutoSellState(newCharId) {
    const oldCharId = AutoSellState.characterId;

    // Stop timer of the old character
    stopAutoSellTimer();

    // Clear the state
    AutoSellState.characterId = newCharId;
    AutoSellState.inventory = [];
    AutoSellState.selectedItems.clear();
    AutoSellState.equippedIds = new Set();
    AutoSellState.lastScanTime = null;
    AutoSellState.isRunning = false;

    // Reload config for the new character
    AutoSellState.config = loadAutoSellConfig();

    // Status message if character actually changed
    if (oldCharId && oldCharId !== newCharId) {
      AutoSellState.statusMessage = 'Character switched - inventory reloaded';
      console.log(`[AutoSell] Character changed: ${oldCharId} → ${newCharId}`);
      // Clear the message after 3 seconds
      setTimeout(() => {
        AutoSellState.statusMessage = null;
        renderSellTabMini();
        if (document.getElementById('as-panel-overlay')) {
          renderAutoSellFullPanel();
        }
      }, 3000);
    }

    // Restart timer if enabled for this character
    if (AutoSellState.config.enabled) {
      startAutoSellTimer();
    }

    // Refresh UI
    renderSellTabMini();
    if (document.getElementById('as-panel-overlay')) {
      // Dedicated panel is open → refresh inventory
      refreshAutoSellInventory();
    }

    console.log(`[AutoSell] State reset for character ${newCharId}`);
  }

  function validateCharacterMatch() {
    const currentCharId = localStorage.getItem('activeCharacterId');
    if (currentCharId !== AutoSellState.characterId) {
      console.warn(`[AutoSell] Character mismatch! State: ${AutoSellState.characterId}, Current: ${currentCharId}`);
      resetAutoSellState(currentCharId);
      return false;
    }
    return true;
  }

  function initAutoSellCharacterWatcher() {
    // Store initial characterId
    AutoSellState.characterId = localStorage.getItem('activeCharacterId');
    AutoSellState.config = loadAutoSellConfig();

    console.log(`[AutoSell] Watching character: ${AutoSellState.characterId}`);

    // The 'storage' event only fires for changes made by other tabs.
    // For the same tab, we need to poll.
    setInterval(() => {
      const currentCharId = localStorage.getItem('activeCharacterId');
      if (currentCharId && currentCharId !== AutoSellState.characterId) {
        resetAutoSellState(currentCharId);

        // Also re-render Combat tab if it's active
        const combatTab = document.getElementById('mc-tab-combat');
        if (combatTab && combatTab.classList.contains('active')) {
          renderCombatJoinTab();
        }
      }
    }, 1000);

    // Start timer if enabled for this character
    if (AutoSellState.config.enabled) {
      if (TokenManager.isReady()) {
        startAutoSellTimer();
      } else {
        // Register callback to start when token is ready
        TokenManager.registerCallback(() => {
          const config = loadAutoSellConfig();
          if (config.enabled && !AutoSellState.timer && !GlobalAutoState.timer) {
            console.log('[AutoSell] Token ready, starting deferred timer');
            startAutoSellTimer();
          }
        });
      }
    }
  }

  // ============================================
  // AUTO-SELL LOCALSTORAGE FUNCTIONS
  // ============================================
  function getAutoSellConfigKey() {
    const charId = localStorage.getItem('activeCharacterId');
    return charId ? `degenIdle_autoSell_${charId}` : null;
  }

  function loadAutoSellConfig() {
    const key = getAutoSellConfigKey();
    if (!key) {
      return getDefaultAutoSellConfig();
    }
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const config = JSON.parse(saved);

        // Migration: sellTypes → sellSlots (v5.3 → v5.4)
        if (config.rules && config.rules.sellTypes && !config.rules.sellSlots) {
          const oldTypes = config.rules.sellTypes;
          config.rules.sellSlots = {
            helmet: oldTypes.armor ?? true,
            bodyarmor: oldTypes.armor ?? true,
            gloves: oldTypes.armor ?? true,
            boots: oldTypes.armor ?? true,
            weapon: oldTypes.weapon ?? true,
            shield: oldTypes.weapon ?? true,
            amulet: oldTypes.accessory ?? true,
            ring: oldTypes.accessory ?? true,
            tool: oldTypes.tool ?? false
          };
          delete config.rules.sellTypes;
          console.log('[AutoSell] Migrated config from sellTypes to sellSlots');
        }

        // Merge with defaults to ensure all keys exist
        const merged = { ...getDefaultAutoSellConfig(), ...config };
        // Deep merge rules
        merged.rules = { ...getDefaultAutoSellConfig().rules, ...config.rules };
        if (config.rules?.sellSlots) {
          merged.rules.sellSlots = { ...getDefaultAutoSellConfig().rules.sellSlots, ...config.rules.sellSlots };
        }
        return merged;
      }
    } catch (e) {
      console.error('[AutoSell] Error loading config:', e);
    }
    return getDefaultAutoSellConfig();
  }

  function saveAutoSellConfig(config) {
    const key = getAutoSellConfigKey();
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(config));
      AutoSellState.config = config;
    } catch (e) {
      console.error('[AutoSell] Error saving config:', e);
    }
  }

  function getDefaultAutoSellConfig() {
    return {
      enabled: false,
      scanIntervalMinutes: 5,
      rules: {
        // Rarity rules
        sellCommon: false,
        sellUncommon: false,
        sellRare: false,
        sellEpic: false,
        sellNoRarity: false,
        // Item slot rules (granular control per slot)
        sellSlots: {
          helmet: true,
          bodyarmor: true,
          gloves: true,
          boots: true,
          weapon: true,
          shield: true,
          amulet: true,
          ring: true,
          tool: false  // Tools OFF by default (no affixes)
        },
        // Affix protection rules
        keepWithAffixes: [],
        affixProtectionMode: 'any',  // 'any' = keep if ANY selected affix, 'minimum' = keep if X selected affixes
        minProtectedAffixes: 1       // Minimum count when mode = 'minimum'
      },
      sellHistory: []
    };
  }

  function addToSellHistory(item, goldGained) {
    const config = loadAutoSellConfig();
    const historyEntry = {
      timestamp: Date.now(),
      itemName: item.name || ITEM_DATABASE[item.item_id]?.n || `Item #${item.item_id}`,
      itemId: item.item_id,
      rarity: item.rarity || 'none',
      goldGained: goldGained,
      affixStats: item.affix_stats || {}  // Store the full affix_stats object
    };
    config.sellHistory.unshift(historyEntry);
    // Keep max 50 entries
    if (config.sellHistory.length > 50) {
      config.sellHistory = config.sellHistory.slice(0, 50);
    }
    saveAutoSellConfig(config);
  }

  // ============================================
  // AUTO-SELL API FUNCTIONS
  // ============================================
  function getEquippedItemIds(equipment) {
    if (!equipment) return new Set();
    const slotKeys = [
      'helmet', 'bodyarmor', 'gloves', 'boots', 'sword', 'shield',
      'twohanded', 'pickaxe', 'axe', 'fishingrod', 'trap', 'pouch', 'basket',
      'ring1', 'ring2', 'amulet', 'profile_picture', 'profile_cover', 'equipped_pet'
    ];
    const ids = new Set();
    for (const key of slotKeys) {
      if (equipment[key]) {
        ids.add(equipment[key]);
      }
    }
    return ids;
  }

  async function getCharacterInventory() {
    const charId = localStorage.getItem('activeCharacterId');
    if (!charId) {
      console.error('[AutoSell] No active character ID found');
      return null;
    }
    try {
      const data = await apiCall(`characters/${charId}/all-data`);
      if (data.success && data.data) {
        // API returns inventory.items (array), character.gold, and equipment (equipped item IDs)
        const equippedIds = getEquippedItemIds(data.data.equipment);
        return {
          inventory: data.data.inventory?.items || [],
          gold: data.data.character?.gold || 0,
          equippedIds: equippedIds
        };
      }
    } catch (e) {
      console.error('[AutoSell] Error fetching inventory:', e);
    }
    return null;
  }

  async function sellItem(itemInstanceId) {
    try {
      const response = await fetch(`${API_ROOT}vendor/${itemInstanceId}/sell`, {
        method: 'POST',
        headers: {
          'Authorization': TokenManager.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
      });
      const data = await response.json();
      return data.success;
    } catch (e) {
      console.error('[AutoSell] Error selling item:', e);
      return false;
    }
  }

  // ============================================
  // AUTO-SELL BUSINESS LOGIC
  // ============================================
  function isEquipment(item) {
    return ITEM_DATABASE.hasOwnProperty(item.item_id);
  }

  function getItemRarity(item) {
    // Rarity can be: common, uncommon, rare, epic, legendary, or undefined/null
    return item.rarity?.toLowerCase() || 'none';
  }

  function getItemAffixes(item) {
    // API returns affixes in affix_stats object (e.g., { crit_damage: 2.75, health_on_crit: 0.88 })
    if (item.affix_stats && typeof item.affix_stats === 'object') {
      return Object.keys(item.affix_stats);
    }
    if (Array.isArray(item.affixes)) {
      return item.affixes;
    }
    return [];
  }

  function shouldAutoSell(item, config) {
    if (!isEquipment(item)) return false;

    const rarity = getItemRarity(item);
    const affixes = getItemAffixes(item);
    const slot = getItemSlot(item);
    const rules = config.rules;

    // Check item slot rules first
    const sellSlots = rules.sellSlots || getDefaultSellSlots();
    if (!sellSlots[slot]) return false;

    // Check if item has protected affixes
    if (rules.keepWithAffixes && rules.keepWithAffixes.length > 0) {
      const matchingAffixes = affixes.filter(affix =>
        rules.keepWithAffixes.includes(affix)
      );

      const mode = rules.affixProtectionMode || 'any';
      const minRequired = rules.minProtectedAffixes || 1;

      if (mode === 'any') {
        // Keep if ANY selected affix is present
        if (matchingAffixes.length > 0) return false;
      } else if (mode === 'minimum') {
        // Keep only if at least X selected affixes are present
        if (matchingAffixes.length >= minRequired) return false;
      }
    }

    // Check rarity rules
    switch (rarity) {
      case 'common': return rules.sellCommon;
      case 'uncommon': return rules.sellUncommon;
      case 'rare': return rules.sellRare;
      case 'epic': return rules.sellEpic;
      case 'none': return rules.sellNoRarity;
      default: return false;
    }
  }

  function getRarityColor(rarity) {
    switch (rarity?.toLowerCase()) {
      case 'common': return '#9ca3af';
      case 'uncommon': return '#22c55e';
      case 'rare': return '#3b82f6';
      case 'epic': return '#a855f7';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  function getRarityBorderColor(rarity) {
    switch (rarity?.toLowerCase()) {
      case 'common': return '#4b5563';
      case 'uncommon': return '#166534';
      case 'rare': return '#1e40af';
      case 'epic': return '#7c3aed';
      case 'legendary': return '#d97706';
      default: return '#374151';
    }
  }

  function getItemSlot(item) {
    const dbItem = ITEM_DATABASE[item.item_id];
    if (!dbItem) return 'unknown';

    const name = dbItem.n.toLowerCase();
    const url = dbItem.i.toLowerCase();

    // Tools first (no affixes)
    if (url.includes('/tools/')) return 'tool';
    if (name.includes('pickaxe') || name.includes('fishing') ||
        name.includes('trap') || (name.includes('axe') && !name.includes('pickaxe'))) return 'tool';

    // Armor slots
    if (name.includes('helmet') || name.includes('hat')) return 'helmet';
    if (name.includes('bodyarmor') || name.includes('robe')) return 'bodyarmor';
    if (name.includes('gloves')) return 'gloves';
    if (name.includes('boots') || name.includes('shoes')) return 'boots';

    // Weapons
    if (name.includes('shield')) return 'shield';
    if (name.includes('sword') || name.includes('staff')) return 'weapon';

    // Accessories
    if (name.includes('amulet')) return 'amulet';
    if (name.includes('ring')) return 'ring';

    // Fallback by URL
    if (url.includes('/armor/') || url.includes('/tailoring/armor/')) return 'bodyarmor';
    if (url.includes('/weapons/') || url.includes('/staff/')) return 'weapon';
    if (url.includes('/accessories/')) return 'ring';

    return 'unknown';
  }

  function getItemType(item) {
    const slot = getItemSlot(item);
    if (['helmet', 'bodyarmor', 'gloves', 'boots'].includes(slot)) return 'armor';
    if (['weapon', 'shield'].includes(slot)) return 'weapon';
    if (['amulet', 'ring'].includes(slot)) return 'accessory';
    if (slot === 'tool') return 'tool';
    return 'unknown';
  }

  function getItemTypeLabel(type) {
    switch (type) {
      case 'armor': return 'Armor';
      case 'weapon': return 'Weapon';
      case 'tool': return 'Tool';
      case 'accessory': return 'Accessory';
      default: return 'Unknown';
    }
  }

  function getDefaultSellSlots() {
    return {
      helmet: true,
      bodyarmor: true,
      gloves: true,
      boots: true,
      weapon: true,
      shield: true,
      amulet: true,
      ring: true,
      tool: false  // Tools OFF by default (no affixes)
    };
  }

  function getAffixSlots(affix) {
    const slots = [];
    for (const [slot, affixes] of Object.entries(SLOT_AFFIXES)) {
      if (affixes.includes(affix)) {
        slots.push(slot);
      }
    }
    return slots;
  }

  function getRelevantAffixes(sellSlots) {
    const relevantAffixes = new Set();

    for (const [slot, enabled] of Object.entries(sellSlots)) {
      if (enabled && SLOT_AFFIXES[slot]) {
        for (const affix of SLOT_AFFIXES[slot]) {
          relevantAffixes.add(affix);
        }
      }
    }

    // Sort alphabetically for consistent display
    return Array.from(relevantAffixes).sort();
  }

  function formatAffixName(affix) {
    // 'crit_damage' → 'Crit Damage'
    return affix.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  function formatAffixValue(affix, value) {
    // Most affixes are percentages, some are flat values
    const flatAffixes = ['max_health', 'max_energy', 'attack_power', 'defense'];
    if (flatAffixes.includes(affix)) {
      return `+${Math.round(value)}`;
    }
    return `+${value.toFixed(2)}%`;
  }

  function buildItemTooltipHtml(item) {
    const dbItem = ITEM_DATABASE[item.item_id];
    const itemName = dbItem?.n || 'Unknown';
    const rarity = item.rarity || 'No Rarity';
    const type = getItemType(item);
    const affixStats = item.affix_stats || {};
    const affixKeys = Object.keys(affixStats);

    let affixesHtml = '';
    if (affixKeys.length > 0) {
      affixesHtml = `
        <div class="as-tooltip-affixes">
          ${affixKeys.map(affix => `
            <div class="as-tooltip-affix">
              <span class="as-tooltip-affix-name">${formatAffixName(affix)}</span>
              <span class="as-tooltip-affix-value">${formatAffixValue(affix, affixStats[affix])}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      affixesHtml = '<div class="as-tooltip-no-affixes">No affixes</div>';
    }

    return `
      <div class="as-tooltip-header">
        <span class="as-tooltip-name" style="color: ${getRarityColor(rarity)}">${itemName}</span>
        <span class="as-tooltip-type">${getItemTypeLabel(type)}</span>
      </div>
      <div class="as-tooltip-rarity" style="color: ${getRarityColor(rarity)}">${rarity}</div>
      ${affixesHtml}
    `;
  }

  function buildHistoryTooltipHtml(entry) {
    const affixStats = entry.affixStats || {};
    const affixKeys = Object.keys(affixStats);

    let affixesHtml = '';
    if (affixKeys.length > 0) {
      affixesHtml = `
        <div class="as-tooltip-affixes">
          ${affixKeys.map(affix => `
            <div class="as-tooltip-affix">
              <span class="as-tooltip-affix-name">${formatAffixName(affix)}</span>
              <span class="as-tooltip-affix-value">${formatAffixValue(affix, affixStats[affix])}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      affixesHtml = '<div class="as-tooltip-no-affixes">No affixes</div>';
    }

    return `
      <div class="as-tooltip-header">
        <span class="as-tooltip-name" style="color: ${getRarityColor(entry.rarity)}">${entry.itemName}</span>
      </div>
      <div class="as-tooltip-rarity" style="color: ${getRarityColor(entry.rarity)}">${entry.rarity || 'No Rarity'}</div>
      ${affixesHtml}
    `;
  }

  function buildAffixTooltipHtml(affix) {
    const slots = getAffixSlots(affix);
    const slotsLabels = slots.map(s => SLOT_LABELS[s] || s).join(', ');

    return `
      <div class="as-tooltip-header">
        <span class="as-tooltip-name">${formatAffixName(affix)}</span>
      </div>
      <div class="as-tooltip-slots">
        <span style="color: #6b7280; font-size: 0.75rem;">Available on:</span>
        <span style="color: #d1d5db; font-size: 0.8rem;">${slotsLabels}</span>
      </div>
    `;
  }

  // ============================================
  // GLOBAL TOOLTIP MANAGEMENT
  // ============================================
  let tooltipTimeout = null;

  function createGlobalTooltip() {
    if (document.getElementById('as-global-tooltip')) return;

    const tooltip = document.createElement('div');
    tooltip.id = 'as-global-tooltip';
    document.body.appendChild(tooltip);
  }

  function showGlobalTooltip(targetElement, content) {
    const tooltip = document.getElementById('as-global-tooltip');
    if (!tooltip) return;

    const rect = targetElement.getBoundingClientRect();

    // Set content first to get dimensions
    tooltip.innerHTML = content;
    tooltip.classList.add('visible');

    // Calculate position after content is set
    requestAnimationFrame(() => {
      const tooltipRect = tooltip.getBoundingClientRect();

      // Vertical position: prefer above, fallback to below
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceAbove > tooltipRect.height + 10 || spaceAbove > spaceBelow) {
        tooltip.style.top = (rect.top - tooltipRect.height - 8) + 'px';
      } else {
        tooltip.style.top = (rect.bottom + 8) + 'px';
      }

      // Horizontal position: centered, but clamped to viewport
      let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
      if (left < 10) left = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      tooltip.style.left = left + 'px';
    });
  }

  function hideGlobalTooltip() {
    const tooltip = document.getElementById('as-global-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }

  function clearTooltipTimeout() {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  }

  // ============================================
  // AUTO-SELL TIMER MANAGEMENT
  // ============================================
  function startAutoSellTimer() {
    // Don't start individual timer if global mode is active
    if (GlobalAutoState.timer) {
      console.log('[AutoSell] Skipping individual timer - global mode active');
      return;
    }

    // Don't start if token is not ready yet
    if (!TokenManager.isReady()) {
      console.log('[AutoSell] Token not ready, deferring timer start');
      return;
    }

    const config = loadAutoSellConfig();
    if (!config.enabled) return;

    stopAutoSellTimer();
    const intervalMs = config.scanIntervalMinutes * 60 * 1000;

    console.log(`[AutoSell] Starting auto-scan every ${config.scanIntervalMinutes} minutes`);

    AutoSellState.timer = setInterval(async () => {
      await runAutoSellScan();
    }, intervalMs);

    // Run immediately on start
    runAutoSellScan();
  }

  function stopAutoSellTimer() {
    if (AutoSellState.timer) {
      clearInterval(AutoSellState.timer);
      AutoSellState.timer = null;
      console.log('[AutoSell] Auto-scan stopped');
    }
  }

  async function runAutoSellScan() {
    if (AutoSellState.isRunning) return;

    // SECURITY: Verify character hasn't changed
    if (!validateCharacterMatch()) {
      console.log('[AutoSell] Scan aborted: character changed');
      return;
    }

    const config = loadAutoSellConfig();
    if (!config.enabled) {
      stopAutoSellTimer();
      return;
    }

    AutoSellState.isRunning = true;
    AutoSellState.lastScanTime = Date.now();
    console.log('[AutoSell] Running auto-scan...');

    try {
      const charData = await getCharacterInventory();
      if (!charData) {
        console.error('[AutoSell] Failed to get inventory');
        return;
      }

      const goldBefore = charData.gold;
      // Filter items: must pass auto-sell rules AND not be equipped
      const itemsToSell = charData.inventory.filter(item =>
        shouldAutoSell(item, config) && !charData.equippedIds.has(item.id)
      );

      if (itemsToSell.length === 0) {
        console.log('[AutoSell] No items to sell');
        renderSellTabMini();
        return;
      }

      console.log(`[AutoSell] Found ${itemsToSell.length} items to sell`);

      // Collect successfully sold items
      const soldItems = [];
      for (const item of itemsToSell) {
        const success = await sellItem(item.id);
        if (success) {
          soldItems.push(item);
          // Small delay between sells
          await sleep(randomDelay(300, 500));
        }
      }

      // Get gold after selling and calculate per-item gold
      const charDataAfter = await getCharacterInventory();
      const goldAfter = charDataAfter?.gold || goldBefore;
      const goldGained = goldAfter - goldBefore;
      const goldPerItem = soldItems.length > 0 ? Math.round(goldGained / soldItems.length) : 0;

      // Add only successfully sold items to history
      for (const item of soldItems) {
        addToSellHistory(item, goldPerItem);
      }

      console.log(`[AutoSell] Sold ${soldItems.length} items, gained ${goldGained} gold`);

      // Play notification sound
      if (soldItems.length > 0) {
        playAutoSellSound();
      }

      // Refresh UI
      await refreshAutoSellInventory();

    } catch (e) {
      console.error('[AutoSell] Error during scan:', e);
    } finally {
      AutoSellState.isRunning = false;
      renderSellTabMini();
    }
  }

  // ============================================
  // AUTO-SELL FOR SPECIFIC CHARACTER (Global Mode)
  // ============================================
  async function runAutoSellForCharacter(charId, config) {
    const result = { itemsSold: 0, goldGained: 0, error: null };

    if (!config || !config.enabled) {
      return result;
    }

    try {
      // Fetch character inventory directly via API
      const charData = await apiCall(`characters/${charId}/all-data`);
      if (!charData.success || !charData.data) {
        throw new Error('Failed to fetch character data');
      }

      const inventory = charData.data.inventory?.items || [];
      const equipment = charData.data.equipment || {};

      // Build set of equipped item IDs (slot values are UUID strings directly, not objects)
      const equippedIds = new Set();
      Object.values(equipment).forEach(slot => {
        if (slot && typeof slot === 'string') equippedIds.add(slot);
      });

      const goldBefore = charData.data.character?.gold || 0;

      // Filter items: equipment that passes auto-sell rules and not equipped
      const itemsToSell = inventory.filter(item => {
        if (!isEquipment(item)) return false;
        if (equippedIds.has(item.id)) return false;
        return shouldAutoSell(item, config);
      });

      if (itemsToSell.length === 0) {
        return result;
      }

      console.log(`[GlobalAuto] Found ${itemsToSell.length} items to sell for character ${charId}`);

      // Sell items
      for (const item of itemsToSell) {
        const success = await sellItemForCharacter(item.id, charId);
        if (success) {
          result.itemsSold++;
          // Small delay between sells
          await sleep(randomDelay(300, 500));
        }
      }

      // Get gold after selling
      if (result.itemsSold > 0) {
        const charDataAfter = await apiCall(`characters/${charId}/all-data`);
        const goldAfter = charDataAfter.data?.character?.gold || goldBefore;
        result.goldGained = goldAfter - goldBefore;

        // Add to sell history for this character
        const goldPerItem = Math.round(result.goldGained / result.itemsSold);
        for (const item of itemsToSell.slice(0, result.itemsSold)) {
          addToSellHistoryForChar(charId, item, goldPerItem);
        }
      }

    } catch (e) {
      console.error(`[GlobalAuto] Auto-sell error for ${charId}:`, e);
      result.error = e.message;
    }

    return result;
  }

  // Sell item for a specific character (used by global mode)
  async function sellItemForCharacter(itemInstanceId, charId) {
    try {
      const response = await originalFetch(`${API_ROOT}vendor/${itemInstanceId}/sell`, {
        method: 'POST',
        headers: {
          'Authorization': TokenManager.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
      });

      if (!response.ok) {
        throw new Error(`Sell failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (e) {
      console.error(`[GlobalAuto] Error selling item ${itemInstanceId}:`, e);
      return false;
    }
  }

  // Add to sell history for a specific character
  function addToSellHistoryForChar(charId, item, goldGained) {
    const key = `degenIdle_autoSell_${charId}`;
    try {
      const saved = localStorage.getItem(key);
      const config = saved ? JSON.parse(saved) : getDefaultAutoSellConfig();

      const dbItem = ITEM_DATABASE[item.item_id];
      const entry = {
        itemId: item.item_id,
        itemName: dbItem?.n || 'Unknown',
        rarity: item.rarity,
        goldGained: goldGained,
        timestamp: Date.now(),
        affixStats: item.affix_stats || {}
      };

      config.sellHistory = config.sellHistory || [];
      config.sellHistory.unshift(entry);
      config.sellHistory = config.sellHistory.slice(0, 50); // Keep last 50

      localStorage.setItem(key, JSON.stringify(config));
    } catch (e) {
      console.error('[GlobalAuto] Error adding to sell history:', e);
    }
  }

  // ============================================
  // AUTO-SELL SOUND NOTIFICATION
  // ============================================
  function playAutoSellSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Silently fail if audio not supported
    }
  }

  // ============================================
  // AUTO-SELL UI REFRESH
  // ============================================
  async function refreshAutoSellInventory() {
    const charData = await getCharacterInventory();
    if (!charData) {
      console.error('[AutoSell] Failed to refresh inventory');
      return;
    }

    // SECURITY: Verify character hasn't changed during the fetch
    const currentCharId = localStorage.getItem('activeCharacterId');
    if (currentCharId !== AutoSellState.characterId) {
      console.warn('[AutoSell] Character changed during inventory fetch, discarding');
      resetAutoSellState(currentCharId);
      return;
    }

    // Filter to only equipment items AND exclude equipped items
    AutoSellState.inventory = charData.inventory.filter(item =>
      isEquipment(item) && !charData.equippedIds.has(item.id)
    );
    // Store equipped IDs for later use
    AutoSellState.equippedIds = charData.equippedIds;

    // Update both mini tab and full panel if visible
    renderSellTabMini();
    const panelOverlay = document.getElementById('as-panel-overlay');
    if (panelOverlay && panelOverlay.classList.contains('visible')) {
      renderAutoSellFullPanel();
    }
  }

  // ============================================
  // AUTO-SELL CONFIRMATION MODAL
  // ============================================
  function showSellConfirmModal(items, onConfirm) {
    // Remove existing modal if any
    const existing = document.getElementById('as-confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'as-confirm-modal';
    modal.innerHTML = `
      <div class="as-modal-overlay">
        <div class="as-modal-content">
          <div class="as-modal-header">
            <h3>Confirm Sale</h3>
          </div>
          <div class="as-modal-body">
            <p>Are you sure you want to sell ${items.length} item(s)?</p>
            <p class="as-modal-warning">This includes Rare/Epic items that cannot be recovered!</p>
            <div class="as-modal-items">
              ${items.slice(0, 5).map(item => `
                <div class="as-modal-item">
                  <img src="${ITEM_DATABASE[item.item_id]?.i || ''}" alt="">
                  <span style="color: ${getRarityColor(item.rarity)}">${ITEM_DATABASE[item.item_id]?.n || 'Unknown'}</span>
                </div>
              `).join('')}
              ${items.length > 5 ? `<p class="as-modal-more">...and ${items.length - 5} more</p>` : ''}
            </div>
          </div>
          <div class="as-modal-footer">
            <button class="as-modal-btn as-modal-cancel">Cancel</button>
            <button class="as-modal-btn as-modal-confirm">Sell All</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.as-modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.as-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) modal.remove();
    });
    modal.querySelector('.as-modal-confirm').addEventListener('click', () => {
      modal.remove();
      onConfirm();
    });
  }

  // ============================================
  // AUTO-SELL PANEL STATE
  // ============================================
  const AutoSellPanelState = {
    affixesExpanded: false,
    sectionsCollapsed: {
      rules: false,
      slots: false,
      affixes: false,
      inventory: false,
      history: true
    }
  };

  // ============================================
  // AUTO-SELL MINI TAB (in main panel)
  // ============================================
  function renderSellTabMini() {
    const container = document.getElementById('as-container');
    if (!container) return;

    const config = loadAutoSellConfig();
    const inventory = AutoSellState.inventory.filter(item => isEquipment(item));
    const itemsToSell = inventory.filter(item => shouldAutoSell(item, config)).length;

    const html = `
      <div class="as-mini-container">
        <div class="as-mini-card">
          <div class="as-mini-header">
            <span class="as-mini-title">Auto-Sell</span>
            <div class="as-mini-status">
              <span class="as-mini-status-dot ${config.enabled ? 'on' : 'off'}"></span>
              <span style="color: ${config.enabled ? '#22c55e' : '#6b7280'}">${config.enabled ? 'Active' : 'Disabled'}</span>
            </div>
          </div>

          <div class="as-mini-info">
            <div class="as-mini-info-row">
              <span class="as-mini-info-label">Scan Interval</span>
              <span class="as-mini-info-value">${config.scanIntervalMinutes} min</span>
            </div>
            <div class="as-mini-info-row">
              <span class="as-mini-info-label">Last Scan</span>
              <span class="as-mini-info-value">${AutoSellState.lastScanTime ? new Date(AutoSellState.lastScanTime).toLocaleTimeString() : 'Never'}</span>
            </div>
            <div class="as-mini-info-row">
              <span class="as-mini-info-label">Items to Sell</span>
              <span class="as-mini-info-value ${itemsToSell > 0 ? 'warning' : ''}">${itemsToSell}</span>
            </div>
            <div class="as-mini-info-row">
              <span class="as-mini-info-label">Items Sold</span>
              <span class="as-mini-info-value">${config.sellHistory.length}</span>
            </div>
            <div class="as-mini-info-row">
              <span class="as-mini-info-label">Protected Affixes</span>
              <span class="as-mini-info-value">${config.rules.keepWithAffixes.length}</span>
            </div>
          </div>

          ${AutoSellState.statusMessage ? `
            <div class="as-status-message" style="margin: 12px 0;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              ${AutoSellState.statusMessage}
            </div>
          ` : ''}

          <div class="as-mini-history">
            <div class="as-mini-history-title">Recent Sales</div>
            ${config.sellHistory.length === 0
              ? '<div class="as-mini-no-history">No items sold yet</div>'
              : `<div class="as-mini-history-list">
                  ${config.sellHistory.slice(0, 5).map(entry => `
                    <div class="as-mini-history-item">
                      <span class="as-mini-history-name" style="color: ${getRarityColor(entry.rarity)}">${entry.itemName}</span>
                      <span class="as-mini-history-gold">+${entry.goldGained}g</span>
                      <span class="as-mini-history-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                  `).join('')}
                </div>`
            }
          </div>

          <button class="as-open-panel-btn" id="as-open-panel-btn" style="margin-top: 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3v18"/>
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M3 15h18"/>
            </svg>
            Open Auto-Sell Manager
          </button>

          ${GlobalAutoState.timer ? `
            <div style="margin-top: 12px; text-align: center;">
              <span class="gl-global-active-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                </svg>
                Global Mode Active
              </span>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach event listener
    const openBtn = document.getElementById('as-open-panel-btn');
    if (openBtn) {
      openBtn.addEventListener('click', showAutoSellPanel);
    }
  }

  // ============================================
  // AUTO-SELL DEDICATED PANEL (modal)
  // ============================================
  function createAutoSellPanelOverlay() {
    let overlay = document.getElementById('as-panel-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'as-panel-overlay';
    overlay.className = 'as-panel-overlay';
    overlay.innerHTML = `
      <div class="as-panel" id="as-panel">
        <div class="as-panel-header">
          <div class="as-panel-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Auto-Sell Manager
          </div>
          <button class="as-panel-close" id="as-panel-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        <div class="as-panel-content" id="as-panel-content">
          <!-- Content rendered by renderAutoSellFullPanel -->
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close button
    overlay.querySelector('#as-panel-close').addEventListener('click', hideAutoSellPanel);

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        hideAutoSellPanel();
      }
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('visible')) {
        hideAutoSellPanel();
      }
    });

    return overlay;
  }

  function showAutoSellPanel() {
    const overlay = createAutoSellPanelOverlay();
    overlay.classList.add('visible');

    // Create global tooltip container
    createGlobalTooltip();

    // Auto-load inventory if empty
    if (AutoSellState.inventory.length === 0) {
      refreshAutoSellInventory();
    }

    renderAutoSellFullPanel();
  }

  function hideAutoSellPanel() {
    const overlay = document.getElementById('as-panel-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
    }
  }

  function renderAutoSellFullPanel() {
    const content = document.getElementById('as-panel-content');
    if (!content) return;

    const config = loadAutoSellConfig();
    const inventory = AutoSellState.inventory.filter(item => isEquipment(item));
    const selectedItems = AutoSellState.selectedItems;

    let html = '';

    // Status message (character switch, errors, etc.)
    if (AutoSellState.statusMessage) {
      const isError = AutoSellState.statusMessage.toLowerCase().includes('cancelled') ||
                      AutoSellState.statusMessage.toLowerCase().includes('error');
      html += `
        <div class="as-status-message ${isError ? 'error' : ''}" style="margin: 0 0 16px 0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          ${AutoSellState.statusMessage}
        </div>
      `;
    }

    // Settings row
    html += `
      <div class="as-settings-row">
        <div class="as-settings-card">
          <div class="as-settings-card-header">
            <span class="as-settings-card-label">Auto-Sell</span>
            <label class="as-toggle">
              <input type="checkbox" id="as-enabled-toggle" ${config.enabled ? 'checked' : ''}>
              <span class="as-toggle-slider"></span>
            </label>
          </div>
        </div>
        <div class="as-settings-card">
          <div class="as-settings-card-header">
            <span class="as-settings-card-label">Scan Interval</span>
            <div class="as-interval-control">
              <input type="number" id="as-interval-input" value="${config.scanIntervalMinutes}" min="1" max="60">
              <span>min</span>
            </div>
          </div>
        </div>
        <div class="as-settings-card">
          <div class="as-settings-card-header">
            <span class="as-settings-card-label">Last Scan</span>
            <span style="color: white; font-weight: 500; font-size: 0.85rem;">
              ${AutoSellState.lastScanTime ? new Date(AutoSellState.lastScanTime).toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    `;

    // Global Mode Badge (if timer is running)
    if (GlobalAutoState.timer) {
      html += `
        <div style="margin-bottom: 16px; text-align: center;">
          <span class="gl-global-active-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
            </svg>
            Global Mode Active - Configure in Global tab
          </span>
        </div>
      `;
    } else {
      // Show indicator if this character has auto-sell enabled in Global tab (but global timer not running)
      const currentCharId = localStorage.getItem('activeCharacterId');
      const charGlobalConfig = currentCharId ? getCharGlobalConfig(currentCharId) : null;
      if (charGlobalConfig?.autoSell) {
        html += `
          <div style="margin-bottom: 16px; text-align: center;">
            <span class="gl-global-active-badge" style="background: rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.3); color: #4ade80;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
              </svg>
              Enabled in Global Mode
            </span>
          </div>
        `;
      }
    }

    // Rules section
    html += `
      <div class="as-section">
        <div class="as-section-header" data-section="rules">
          <span>Sell Rules by Rarity</span>
          <span class="as-section-toggle ${AutoSellPanelState.sectionsCollapsed.rules ? 'collapsed' : ''}">▼</span>
        </div>
        <div class="as-section-content ${AutoSellPanelState.sectionsCollapsed.rules ? 'collapsed' : ''}">
          <div class="as-rules-grid">
            <label class="as-rule-item">
              <input type="checkbox" data-rule="sellNoRarity" ${config.rules.sellNoRarity ? 'checked' : ''}>
              <span class="as-rule-dot" style="background: #6b7280"></span>
              <span>No Rarity</span>
            </label>
            <label class="as-rule-item">
              <input type="checkbox" data-rule="sellCommon" ${config.rules.sellCommon ? 'checked' : ''}>
              <span class="as-rule-dot" style="background: #9ca3af"></span>
              <span>Common</span>
            </label>
            <label class="as-rule-item">
              <input type="checkbox" data-rule="sellUncommon" ${config.rules.sellUncommon ? 'checked' : ''}>
              <span class="as-rule-dot" style="background: #22c55e"></span>
              <span>Uncommon</span>
            </label>
            <label class="as-rule-item">
              <input type="checkbox" data-rule="sellRare" ${config.rules.sellRare ? 'checked' : ''}>
              <span class="as-rule-dot" style="background: #3b82f6"></span>
              <span>Rare</span>
            </label>
            <label class="as-rule-item">
              <input type="checkbox" data-rule="sellEpic" ${config.rules.sellEpic ? 'checked' : ''}>
              <span class="as-rule-dot" style="background: #a855f7"></span>
              <span>Epic</span>
            </label>
          </div>
        </div>
      </div>
    `;

    // Item Slots section
    const sellSlots = config.rules.sellSlots || getDefaultSellSlots();
    const activeSlotCount = Object.values(sellSlots).filter(v => v).length;
    html += `
      <div class="as-section">
        <div class="as-section-header" data-section="slots">
          <span>Item Slots to Sell (${activeSlotCount}/9)</span>
          <span class="as-section-toggle ${AutoSellPanelState.sectionsCollapsed.slots ? 'collapsed' : ''}">▼</span>
        </div>
        <div class="as-section-content ${AutoSellPanelState.sectionsCollapsed.slots ? 'collapsed' : ''}">
          <div class="as-slots-container">
            <div class="as-slots-category">
              <span class="as-slots-category-label">Armor</span>
              <div class="as-slots-row">
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="helmet" ${sellSlots.helmet ? 'checked' : ''}>
                  <span>${SLOT_LABELS.helmet}</span>
                </label>
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="bodyarmor" ${sellSlots.bodyarmor ? 'checked' : ''}>
                  <span>${SLOT_LABELS.bodyarmor}</span>
                </label>
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="gloves" ${sellSlots.gloves ? 'checked' : ''}>
                  <span>${SLOT_LABELS.gloves}</span>
                </label>
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="boots" ${sellSlots.boots ? 'checked' : ''}>
                  <span>${SLOT_LABELS.boots}</span>
                </label>
              </div>
            </div>
            <div class="as-slots-category">
              <span class="as-slots-category-label">Weapons</span>
              <div class="as-slots-row">
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="weapon" ${sellSlots.weapon ? 'checked' : ''}>
                  <span>${SLOT_LABELS.weapon}</span>
                </label>
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="shield" ${sellSlots.shield ? 'checked' : ''}>
                  <span>${SLOT_LABELS.shield}</span>
                </label>
              </div>
            </div>
            <div class="as-slots-category">
              <span class="as-slots-category-label">Accessories</span>
              <div class="as-slots-row">
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="amulet" ${sellSlots.amulet ? 'checked' : ''}>
                  <span>${SLOT_LABELS.amulet}</span>
                </label>
                <label class="as-slot-item">
                  <input type="checkbox" data-slot="ring" ${sellSlots.ring ? 'checked' : ''}>
                  <span>${SLOT_LABELS.ring}</span>
                </label>
              </div>
            </div>
            <div class="as-slots-category">
              <span class="as-slots-category-label">Tools</span>
              <div class="as-slots-row">
                <label class="as-slot-item ${!sellSlots.tool ? 'dimmed' : ''}">
                  <input type="checkbox" data-slot="tool" ${sellSlots.tool ? 'checked' : ''}>
                  <span>${SLOT_LABELS.tool}</span>
                  <span class="as-slot-note">(no affixes)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Protected affixes section (filtered by selected slots)
    const affixMode = config.rules.affixProtectionMode || 'any';
    const minAffixes = config.rules.minProtectedAffixes || 1;
    const relevantAffixes = getRelevantAffixes(sellSlots);
    const hasAffixSlots = Object.entries(sellSlots).some(([slot, enabled]) => enabled && slot !== 'tool');

    html += `
      <div class="as-section">
        <div class="as-section-header" data-section="affixes">
          <span>Protected Affixes (${config.rules.keepWithAffixes.length})</span>
          <span class="as-section-toggle ${AutoSellPanelState.sectionsCollapsed.affixes ? 'collapsed' : ''}">▼</span>
        </div>
        <div class="as-section-content ${AutoSellPanelState.sectionsCollapsed.affixes ? 'collapsed' : ''}">
          <div class="as-affixes-selected">
            ${config.rules.keepWithAffixes.length === 0
              ? '<span class="as-no-affixes">No protected affixes - items with any affix will be sold</span>'
              : config.rules.keepWithAffixes.map(affix => `
                  <span class="as-affix-tag">
                    ${affix.replace(/_/g, ' ')}
                    <button class="as-affix-remove" data-affix="${affix}">&times;</button>
                  </span>
                `).join('')
            }
          </div>

          <button class="as-affixes-grid-toggle ${AutoSellPanelState.affixesExpanded ? 'expanded' : ''}" id="as-affixes-grid-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
            ${AutoSellPanelState.affixesExpanded ? 'Hide Affix List' : `Show Affixes (${relevantAffixes.length})`}
          </button>

          <div class="as-affixes-grid ${AutoSellPanelState.affixesExpanded ? 'expanded' : ''}" id="as-affixes-grid">
            ${!hasAffixSlots
              ? '<div class="as-no-affixes-available">No item slots with affixes selected. Enable armor, weapons, or accessories above.</div>'
              : relevantAffixes.map(affix => `
                  <label class="as-affix-checkbox" data-affix-hover="${affix}">
                    <input type="checkbox" data-affix="${affix}" ${config.rules.keepWithAffixes.includes(affix) ? 'checked' : ''}>
                    <span>${affix.replace(/_/g, ' ')}</span>
                  </label>
                `).join('')
            }
          </div>

          <div class="as-affix-mode">
            <div class="as-affix-mode-option">
              <input type="radio" name="affix-mode" id="affix-mode-any" value="any" ${affixMode === 'any' ? 'checked' : ''}>
              <label for="affix-mode-any">Keep if <strong>any</strong> selected affix is present</label>
            </div>
            <div class="as-affix-mode-option">
              <input type="radio" name="affix-mode" id="affix-mode-minimum" value="minimum" ${affixMode === 'minimum' ? 'checked' : ''}>
              <label for="affix-mode-minimum">Keep only if at least
                <span class="as-min-affixes-control">
                  <select id="as-min-affixes" ${affixMode !== 'minimum' ? 'disabled' : ''}>
                    ${[1,2,3,4,5].map(n => `<option value="${n}" ${minAffixes === n ? 'selected' : ''}>${n}</option>`).join('')}
                  </select>
                </span>
                selected affix(es) present
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inventory section
    html += `
      <div class="as-section">
        <div class="as-section-header as-inventory-header" data-section="inventory">
          <span>Equipment Inventory (${inventory.length})</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="as-refresh-btn ${AutoSellState.isRunning ? 'loading' : ''}" id="as-refresh-inventory-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Refresh
            </button>
            <span class="as-section-toggle ${AutoSellPanelState.sectionsCollapsed.inventory ? 'collapsed' : ''}">▼</span>
          </div>
        </div>
        <div class="as-section-content ${AutoSellPanelState.sectionsCollapsed.inventory ? 'collapsed' : ''}">
          <div class="as-inventory-grid">
            ${inventory.length === 0
              ? '<div class="as-no-items">No equipment found. Click Refresh to load inventory.</div>'
              : inventory.map((item) => {
                  const dbItem = ITEM_DATABASE[item.item_id];
                  const isSelected = selectedItems.has(item.id);
                  const wouldAutoSell = shouldAutoSell(item, config);
                  return `
                    <div class="as-item ${isSelected ? 'selected' : ''} ${wouldAutoSell ? 'auto-sell' : ''}"
                         data-instance-id="${item.id}"
                         data-item-id="${item.item_id}"
                         style="border-color: ${getRarityBorderColor(item.rarity)}">
                      ${isSelected ? '<div class="as-selected-badge">✓</div>' : ''}
                      ${wouldAutoSell ? '<div class="as-auto-sell-badge">AUTO</div>' : ''}
                      <img src="${dbItem?.i || ''}" alt="${dbItem?.n || 'Unknown'}">
                    </div>
                  `;
                }).join('')
            }
          </div>
        </div>
      </div>
    `;

    // History section
    html += `
      <div class="as-section">
        <div class="as-section-header" data-section="history">
          <span>Sell History (${config.sellHistory.length})</span>
          <span class="as-section-toggle ${AutoSellPanelState.sectionsCollapsed.history ? 'collapsed' : ''}">▼</span>
        </div>
        <div class="as-section-content ${AutoSellPanelState.sectionsCollapsed.history ? 'collapsed' : ''}">
          <div class="as-history-list">
            ${config.sellHistory.length === 0
              ? '<div class="as-no-history">No items sold yet</div>'
              : config.sellHistory.slice(0, 15).map((entry, index) => {
                  const affixStats = entry.affixStats || {};
                  const affixCount = Object.keys(affixStats).length;

                  return `
                    <div class="as-history-item" data-history-index="${index}">
                      <span class="as-history-name" style="color: ${getRarityColor(entry.rarity)}">${entry.itemName}</span>
                      ${affixCount > 0 ? `<span class="as-history-affixes">${affixCount} affix${affixCount > 1 ? 'es' : ''}</span>` : ''}
                      <span class="as-history-gold">+${entry.goldGained}g</span>
                      <span class="as-history-time">${new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                  `;
                }).join('')
            }
          </div>
        </div>
      </div>
    `;

    content.innerHTML = html;

    // Add actions bar if items selected
    const panel = document.getElementById('as-panel');
    let actionsBar = panel.querySelector('.as-actions');

    if (selectedItems.size > 0) {
      if (!actionsBar) {
        actionsBar = document.createElement('div');
        actionsBar.className = 'as-actions';
        panel.appendChild(actionsBar);
      }
      actionsBar.innerHTML = `
        <button class="as-sell-selected-btn" id="as-sell-selected-btn" ${AutoSellState.isRunning ? 'disabled' : ''}>
          ${AutoSellState.isRunning ? 'Selling...' : `Sell Selected (${selectedItems.size})`}
        </button>
        <button class="as-clear-selection-btn" id="as-clear-selection-btn">
          Clear
        </button>
      `;
    } else if (actionsBar) {
      actionsBar.remove();
    }

    // Attach event listeners
    attachAutoSellPanelEventListeners();
  }

  function attachAutoSellPanelEventListeners() {
    // Toggle auto-sell
    const enabledToggle = document.getElementById('as-enabled-toggle');
    if (enabledToggle) {
      enabledToggle.addEventListener('change', (e) => {
        const config = loadAutoSellConfig();
        config.enabled = e.target.checked;
        saveAutoSellConfig(config);
        if (config.enabled) {
          startAutoSellTimer();
        } else {
          stopAutoSellTimer();
        }
        renderSellTabMini();
      });
    }

    // Interval input
    const intervalInput = document.getElementById('as-interval-input');
    if (intervalInput) {
      intervalInput.addEventListener('change', (e) => {
        const config = loadAutoSellConfig();
        config.scanIntervalMinutes = Math.max(1, Math.min(60, parseInt(e.target.value) || 5));
        saveAutoSellConfig(config);
        if (config.enabled) {
          startAutoSellTimer();
        }
        renderSellTabMini();
      });
    }

    // Section collapse toggles
    document.querySelectorAll('.as-section-header[data-section]').forEach(header => {
      header.addEventListener('click', (e) => {
        // Don't toggle if clicking refresh button
        if (e.target.closest('.as-refresh-btn')) return;

        const section = header.dataset.section;
        AutoSellPanelState.sectionsCollapsed[section] = !AutoSellPanelState.sectionsCollapsed[section];
        renderAutoSellFullPanel();
      });
    });

    // Rule checkboxes
    document.querySelectorAll('.as-rule-item input[data-rule]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        const config = loadAutoSellConfig();
        const rule = e.target.dataset.rule;
        config.rules[rule] = e.target.checked;
        saveAutoSellConfig(config);
        renderAutoSellFullPanel();
        renderSellTabMini();
      });
    });

    // Affixes grid toggle
    const affixesToggle = document.getElementById('as-affixes-grid-toggle');
    if (affixesToggle) {
      affixesToggle.addEventListener('click', () => {
        AutoSellPanelState.affixesExpanded = !AutoSellPanelState.affixesExpanded;
        renderAutoSellFullPanel();
      });
    }

    // Affix checkboxes in grid
    document.querySelectorAll('.as-affix-checkbox input[data-affix]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const affix = e.target.dataset.affix;
        const config = loadAutoSellConfig();
        if (e.target.checked) {
          if (!config.rules.keepWithAffixes.includes(affix)) {
            config.rules.keepWithAffixes.push(affix);
          }
        } else {
          config.rules.keepWithAffixes = config.rules.keepWithAffixes.filter(a => a !== affix);
        }
        saveAutoSellConfig(config);
        renderAutoSellFullPanel();
        renderSellTabMini();
      });
    });

    // Remove affix buttons
    document.querySelectorAll('.as-affix-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const affix = e.target.dataset.affix;
        const config = loadAutoSellConfig();
        config.rules.keepWithAffixes = config.rules.keepWithAffixes.filter(a => a !== affix);
        saveAutoSellConfig(config);
        renderAutoSellFullPanel();
        renderSellTabMini();
      });
    });

    // Item slot checkboxes
    document.querySelectorAll('.as-slot-item input[data-slot]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        const config = loadAutoSellConfig();
        const slot = e.target.dataset.slot;
        if (!config.rules.sellSlots) {
          config.rules.sellSlots = getDefaultSellSlots();
        }
        config.rules.sellSlots[slot] = e.target.checked;
        saveAutoSellConfig(config);
        renderAutoSellFullPanel();
        renderSellTabMini();
      });
    });

    // Affix protection mode radio buttons
    document.querySelectorAll('input[name="affix-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const config = loadAutoSellConfig();
        config.rules.affixProtectionMode = e.target.value;
        saveAutoSellConfig(config);
        // Enable/disable the min affixes select
        const minSelect = document.getElementById('as-min-affixes');
        if (minSelect) {
          minSelect.disabled = e.target.value !== 'minimum';
        }
        renderAutoSellFullPanel();
        renderSellTabMini();
      });
    });

    // Min affixes select
    const minAffixesSelect = document.getElementById('as-min-affixes');
    if (minAffixesSelect) {
      minAffixesSelect.addEventListener('change', (e) => {
        const config = loadAutoSellConfig();
        config.rules.minProtectedAffixes = parseInt(e.target.value) || 1;
        saveAutoSellConfig(config);
        renderAutoSellFullPanel();
        renderSellTabMini();
      });
    }

    // Refresh inventory button
    const refreshBtn = document.getElementById('as-refresh-inventory-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        refreshAutoSellInventory();
      });
    }

    // Item selection
    document.querySelectorAll('.as-item').forEach(item => {
      item.addEventListener('click', () => {
        const instanceId = item.dataset.instanceId;
        if (AutoSellState.selectedItems.has(instanceId)) {
          AutoSellState.selectedItems.delete(instanceId);
        } else {
          AutoSellState.selectedItems.add(instanceId);
        }
        renderAutoSellFullPanel();
      });
    });

    // Sell selected button
    const sellSelectedBtn = document.getElementById('as-sell-selected-btn');
    if (sellSelectedBtn) {
      sellSelectedBtn.addEventListener('click', () => {
        const selectedIds = Array.from(AutoSellState.selectedItems);
        const selectedItemsList = AutoSellState.inventory.filter(item => selectedIds.includes(item.id));

        const hasHighRarity = selectedItemsList.some(item =>
          ['rare', 'epic', 'legendary'].includes(item.rarity?.toLowerCase())
        );

        if (hasHighRarity) {
          showSellConfirmModal(selectedItemsList, () => sellSelectedItems());
        } else {
          sellSelectedItems();
        }
      });
    }

    // Clear selection button
    const clearSelectionBtn = document.getElementById('as-clear-selection-btn');
    if (clearSelectionBtn) {
      clearSelectionBtn.addEventListener('click', () => {
        AutoSellState.selectedItems.clear();
        renderAutoSellFullPanel();
      });
    }

    // Item tooltip hover listeners
    document.querySelectorAll('.as-item[data-instance-id]').forEach(itemEl => {
      itemEl.addEventListener('mouseenter', () => {
        clearTooltipTimeout();
        tooltipTimeout = setTimeout(() => {
          const instanceId = itemEl.dataset.instanceId;
          const item = AutoSellState.inventory.find(i => i.id === instanceId);
          if (item) {
            const tooltipHtml = buildItemTooltipHtml(item);
            showGlobalTooltip(itemEl, tooltipHtml);
          }
        }, 150);
      });
      itemEl.addEventListener('mouseleave', () => {
        clearTooltipTimeout();
        hideGlobalTooltip();
      });
    });

    // History item tooltip hover listeners
    const config = loadAutoSellConfig();
    document.querySelectorAll('.as-history-item[data-history-index]').forEach(historyEl => {
      historyEl.addEventListener('mouseenter', () => {
        clearTooltipTimeout();
        tooltipTimeout = setTimeout(() => {
          const index = parseInt(historyEl.dataset.historyIndex);
          const entry = config.sellHistory[index];
          if (entry) {
            const tooltipHtml = buildHistoryTooltipHtml(entry);
            showGlobalTooltip(historyEl, tooltipHtml);
          }
        }, 150);
      });
      historyEl.addEventListener('mouseleave', () => {
        clearTooltipTimeout();
        hideGlobalTooltip();
      });
    });

    // Affix checkbox tooltip hover listeners (show compatible slots)
    document.querySelectorAll('.as-affix-checkbox[data-affix-hover]').forEach(affixEl => {
      affixEl.addEventListener('mouseenter', () => {
        clearTooltipTimeout();
        tooltipTimeout = setTimeout(() => {
          const affix = affixEl.dataset.affixHover;
          if (affix) {
            const tooltipHtml = buildAffixTooltipHtml(affix);
            showGlobalTooltip(affixEl, tooltipHtml);
          }
        }, 150);
      });
      affixEl.addEventListener('mouseleave', () => {
        clearTooltipTimeout();
        hideGlobalTooltip();
      });
    });
  }

  async function sellSelectedItems() {
    // SECURITY: Verify character hasn't changed
    if (!validateCharacterMatch()) {
      console.error('[AutoSell] Sell aborted: character changed');
      AutoSellState.statusMessage = 'Character changed - operation cancelled';
      renderAutoSellFullPanel();
      setTimeout(() => {
        AutoSellState.statusMessage = null;
        renderAutoSellFullPanel();
      }, 3000);
      return;
    }

    const selectedIds = Array.from(AutoSellState.selectedItems);
    if (selectedIds.length === 0) return;

    AutoSellState.isRunning = true;
    renderAutoSellFullPanel();

    try {
      const charDataBefore = await getCharacterInventory();
      const goldBefore = charDataBefore?.gold || 0;

      // Collect successfully sold items
      const soldItems = [];
      for (const instanceId of selectedIds) {
        const item = AutoSellState.inventory.find(i => i.id === instanceId);
        const success = await sellItem(instanceId);
        if (success && item) {
          soldItems.push(item);
        }
        await sleep(randomDelay(300, 500));
      }

      // Calculate gold gained AFTER all sales
      const charDataAfter = await getCharacterInventory();
      const goldGained = (charDataAfter?.gold || 0) - goldBefore;
      const goldPerItem = soldItems.length > 0 ? Math.round(goldGained / soldItems.length) : 0;

      // Add to history with calculated gold
      for (const item of soldItems) {
        addToSellHistory(item, goldPerItem);
      }

      console.log(`[AutoSell] Sold ${soldItems.length} items, gained ${goldGained} gold`);

      if (soldItems.length > 0) {
        playAutoSellSound();
      }

      AutoSellState.selectedItems.clear();
      await refreshAutoSellInventory();

    } catch (e) {
      console.error('[AutoSell] Error selling items:', e);
    } finally {
      AutoSellState.isRunning = false;
      renderAutoSellFullPanel();
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4.5: COMBAT JOIN MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // COMBAT JOIN STATE
  // ============================================
  const CombatJoinState = {
    expandedZones: new Set(), // All zones collapsed by default
    lastResult: null, // { success: bool, message: string, timestamp: Date, level: number }
    isJoining: false,
    // Custom join state (for events)
    customId: '',
    customType: 'combat', // 'combat', 'dungeon', or 'task'
    customChainLength: 16,
    // Task-specific fields
    customSkillName: '',
    customItemName: ''
  };

  // ============================================
  // COMBAT JOIN HELPER FUNCTIONS
  // ============================================
  function getActiveCharacterId() {
    return localStorage.getItem('activeCharacterId');
  }

  function getActiveCharacterInfo() {
    const charId = getActiveCharacterId();
    if (!charId) return null;

    // Try to get from charactersMap
    const charInfo = window.allCharactersData?.charactersMap?.[charId];
    if (charInfo) return charInfo;

    // Fallback: try to find in charactersList
    const charFromList = window.allCharactersData?.charactersList?.find(c => c.id === charId);
    return charFromList || null;
  }

  function groupCombatsByZone() {
    const zones = {};
    COMBAT_ZONES.forEach(combat => {
      if (!zones[combat.zone]) {
        zones[combat.zone] = [];
      }
      zones[combat.zone].push(combat);
    });
    return zones;
  }

  function getZoneLevelRange(zone) {
    const combats = COMBAT_ZONES.filter(c => c.zone === zone);
    if (combats.length === 0) return '';
    const levels = combats.map(c => c.level);
    const min = Math.min(...levels);
    const max = Math.max(...levels);
    return `Lvl ${min}-${max}`;
  }

  // ============================================
  // JOIN COMBAT DIRECT FUNCTION
  // ============================================
  async function joinCombatDirect(combatId, level) {
    const charId = getActiveCharacterId();
    const charInfo = getActiveCharacterInfo();
    const charName = charInfo?.name || 'Unknown';

    if (!charId) {
      CombatJoinState.lastResult = {
        success: false,
        message: 'No character selected',
        timestamp: new Date(),
        level: level
      };
      renderCombatJoinTab();
      showMonitorNotification('No character selected!', 'error');
      return;
    }

    if (!TokenManager.isReady()) {
      CombatJoinState.lastResult = {
        success: false,
        message: 'Token not captured yet - navigate in game first',
        timestamp: new Date(),
        level: level
      };
      renderCombatJoinTab();
      showMonitorNotification('Token not ready! Navigate in the game first.', 'error');
      return;
    }

    CombatJoinState.isJoining = true;
    renderCombatJoinTab();

    console.log(`[CombatJoin] Attempting to join combat ID ${combatId} (Lvl ${level}) with ${charName}...`);

    try {
      const result = await joinCombat(charId, combatId);

      console.log('[CombatJoin] API Response:', result);

      CombatJoinState.lastResult = {
        success: true,
        message: `Joined Lvl ${level} combat!`,
        timestamp: new Date(),
        level: level,
        sessionId: result?.data?.sessionId
      };

      showMonitorNotification(`${charName} joined Lvl ${level} combat!`, 'success');
      console.log(`[CombatJoin] SUCCESS - ${charName} joined combat ID ${combatId} (Lvl ${level})`);

    } catch (error) {
      console.error('[CombatJoin] Error:', error);

      CombatJoinState.lastResult = {
        success: false,
        message: error.message || 'Join failed',
        timestamp: new Date(),
        level: level
      };

      showMonitorNotification(`Failed to join: ${error.message}`, 'error');
    } finally {
      CombatJoinState.isJoining = false;
      renderCombatJoinTab();
    }
  }

  // ============================================
  // JOIN CUSTOM (EVENTS) FUNCTION
  // ============================================
  async function joinCustomDirect() {
    const customType = CombatJoinState.customType;
    const charId = getActiveCharacterId();
    const charInfo = getActiveCharacterInfo();
    const charName = charInfo?.name || 'Unknown';

    if (!charId) {
      showMonitorNotification('No character selected!', 'error');
      return;
    }

    if (!TokenManager.isReady()) {
      showMonitorNotification('Token not ready! Navigate in the game first.', 'error');
      return;
    }

    // Handle Task type
    if (customType === 'task') {
      const skillName = CombatJoinState.customSkillName.trim();
      const itemName = CombatJoinState.customItemName.trim();

      if (!skillName || !itemName) {
        showMonitorNotification('Please enter Skill and Item names', 'error');
        return;
      }

      CombatJoinState.isJoining = true;
      renderCombatJoinTab();

      console.log(`[CombatJoin] Attempting to start task: ${skillName} - ${itemName} for ${charName}...`);

      try {
        // Step 1: Calculate to get maxActions
        console.log(`[CombatJoin] Step 1: Calculating task...`);
        const calcResult = await calculateTask(charId, skillName, itemName);
        const maxActions = calcResult.maxActions;

        console.log(`[CombatJoin] Calculated maxActions: ${maxActions}`);

        // Step 2: Small delay (300-500ms)
        const delayMs = randomDelay(300, 500);
        console.log(`[CombatJoin] Step 2: Waiting ${delayMs}ms...`);
        await sleep(delayMs);

        // Step 3: Start task
        console.log(`[CombatJoin] Step 3: Starting task with ${maxActions} actions...`);
        const result = await startTask(charId, skillName, itemName, maxActions);
        console.log('[CombatJoin] Task API Response:', result);

        CombatJoinState.lastResult = {
          success: true,
          message: `Started ${skillName}: ${itemName} (${maxActions.toLocaleString()} actions)`,
          timestamp: new Date()
        };

        showMonitorNotification(`${charName} started ${skillName}: ${itemName}!`, 'success');

      } catch (error) {
        console.error('[CombatJoin] Task Error:', error);

        CombatJoinState.lastResult = {
          success: false,
          message: error.message || 'Start task failed',
          timestamp: new Date()
        };

        showMonitorNotification(`Failed to start task: ${error.message}`, 'error');
      } finally {
        CombatJoinState.isJoining = false;
        renderCombatJoinTab();
      }
      return;
    }

    // For combat/dungeon, we need a valid ID
    const customId = parseInt(CombatJoinState.customId, 10);
    if (!customId || isNaN(customId) || customId <= 0) {
      showMonitorNotification('Please enter a valid ID', 'error');
      return;
    }

    if (customType === 'dungeon') {
      // Start dungeon (requires being in correct zone)
      const chainLength = parseInt(CombatJoinState.customChainLength, 10) || 16;
      CombatJoinState.isJoining = true;
      renderCombatJoinTab();

      console.log(`[CombatJoin] Attempting to start dungeon ID ${customId} with ${charName}, chain: ${chainLength}...`);

      try {
        const result = await startDungeon([charId], customId, chainLength);
        console.log('[CombatJoin] Dungeon API Response:', result);

        CombatJoinState.lastResult = {
          success: true,
          message: `Started Dungeon ID ${customId} (${chainLength} chains)!`,
          timestamp: new Date()
        };

        showMonitorNotification(`${charName} started Dungeon ID ${customId} (${chainLength} chains)!`, 'success');

      } catch (error) {
        console.error('[CombatJoin] Dungeon Error:', error);

        CombatJoinState.lastResult = {
          success: false,
          message: error.message || 'Start dungeon failed',
          timestamp: new Date()
        };

        showMonitorNotification(`Failed to start dungeon: ${error.message}`, 'error');
      } finally {
        CombatJoinState.isJoining = false;
        renderCombatJoinTab();
      }
    } else {
      // Join combat
      await joinCombatDirect(customId, customId); // Use ID as level for display
    }
  }

  // ============================================
  // CUSTOM JOIN HELPERS
  // ============================================
  function updateCustomType(value) {
    CombatJoinState.customType = value;
    renderCombatJoinTab();
  }

  function updateCustomId(value) {
    CombatJoinState.customId = value;
  }

  function updateCustomChainLength(value) {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 16) {
      CombatJoinState.customChainLength = parsed;
    }
  }

  function updateCustomSkillName(value) {
    CombatJoinState.customSkillName = value;
  }

  function updateCustomItemName(value) {
    CombatJoinState.customItemName = value;
  }

  // ============================================
  // COMBAT JOIN TAB RENDER
  // ============================================
  function renderCombatJoinTab() {
    const container = document.getElementById('cj-container');
    if (!container) return;

    const charId = getActiveCharacterId();
    const charInfo = getActiveCharacterInfo();
    const zones = groupCombatsByZone();
    const zoneNumbers = Object.keys(zones).map(Number).sort((a, b) => a - b);

    let html = '';

    // Current character display
    if (charInfo) {
      const pfpUrl = charInfo.pfp || window.allCharactersData?.portraitImages?.[charInfo.name] || '';
      html += `
        <div class="cj-current-char">
          ${pfpUrl ? `<img class="cj-current-char-pfp" src="${pfpUrl}" alt="${charInfo.name}">` : ''}
          <div class="cj-current-char-info">
            <div class="cj-current-char-label">Active Character</div>
            <div class="cj-current-char-name">${charInfo.name}</div>
          </div>
        </div>
      `;
    } else if (charId) {
      // We have a charId but no info loaded yet
      html += `
        <div class="cj-current-char">
          <div class="cj-current-char-info">
            <div class="cj-current-char-label">Active Character</div>
            <div class="cj-current-char-name">${charId.substring(0, 8)}...</div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="cj-no-char-warning">
          No character selected. Please select a character in the game.
        </div>
      `;
    }

    // Last result status
    if (CombatJoinState.lastResult) {
      const result = CombatJoinState.lastResult;
      const statusClass = result.success ? 'success' : 'error';
      const icon = result.success ? '✓' : '✗';
      const timeAgo = formatTimeAgo(result.timestamp);

      html += `
        <div class="cj-status ${statusClass}">
          <span class="cj-status-icon">${icon}</span>
          <span>${result.message}</span>
          <span style="margin-left: auto; opacity: 0.7; font-size: 0.75rem;">${timeAgo}</span>
        </div>
      `;
    }

    // Zone list
    html += '<div class="cj-zone-list">';

    for (const zoneNum of zoneNumbers) {
      const combats = zones[zoneNum];
      const isExpanded = CombatJoinState.expandedZones.has(zoneNum);
      const levelRange = getZoneLevelRange(zoneNum);

      html += `
        <div class="cj-zone ${isExpanded ? 'expanded' : ''}" data-zone="${zoneNum}">
          <div class="cj-zone-header" onclick="window.toggleCombatZone(${zoneNum})">
            <div class="cj-zone-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              Zone ${zoneNum}
            </div>
            <div class="cj-zone-range">${levelRange}</div>
          </div>
          <div class="cj-zone-content">
            <div class="cj-combat-list">
      `;

      for (const combat of combats) {
        const isDisabled = CombatJoinState.isJoining || !charId;
        const btnClass = CombatJoinState.isJoining ? 'loading' : '';

        html += `
          <div class="cj-combat-row">
            <div class="cj-combat-level">
              Level ${combat.level}
              <span>(ID: ${combat.id})</span>
            </div>
            <button class="cj-join-btn ${btnClass}"
                    onclick="window.joinCombatDirect(${combat.id}, ${combat.level})"
                    ${isDisabled ? 'disabled' : ''}>
              ${CombatJoinState.isJoining ? 'Joining...' : 'Join'}
            </button>
          </div>
        `;
      }

      html += `
            </div>
          </div>
        </div>
      `;
    }

    html += '</div>';

    // Custom join section for events
    const customType = CombatJoinState.customType;
    const showIdInput = customType === 'combat' || customType === 'dungeon';
    const showChainInput = customType === 'dungeon';
    const showTaskInputs = customType === 'task';
    const btnClass = customType === 'dungeon' ? 'dungeon' : (customType === 'task' ? 'task' : '');

    html += `
      <div class="cj-custom-section">
        <div class="cj-custom-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Custom Join (Events)
        </div>
        <div class="cj-custom-row">
          <select class="cj-custom-type" onchange="window.updateCustomType(this.value)">
            <option value="combat" ${customType === 'combat' ? 'selected' : ''}>Combat</option>
            <option value="dungeon" ${customType === 'dungeon' ? 'selected' : ''}>Dungeon</option>
            <option value="task" ${customType === 'task' ? 'selected' : ''}>Task</option>
          </select>
          <input type="number" class="cj-custom-id ${showIdInput ? '' : 'hidden'}" placeholder="ID" value="${CombatJoinState.customId}"
                 onchange="window.updateCustomId(this.value)"
                 oninput="window.updateCustomId(this.value)">
          <div class="cj-custom-chain-wrapper ${showChainInput ? '' : 'hidden'}">
            <input type="number" class="cj-custom-chain" placeholder="16" value="${CombatJoinState.customChainLength}" min="1" max="16"
                   onchange="window.updateCustomChainLength(this.value)"
                   oninput="window.updateCustomChainLength(this.value)">
            <span class="cj-custom-chain-label">chains</span>
          </div>
          <div class="cj-custom-task-wrapper ${showTaskInputs ? '' : 'hidden'}">
            <input type="text" class="cj-custom-skill" placeholder="Skill (Mining)"
                   value="${CombatJoinState.customSkillName}"
                   onchange="window.updateCustomSkillName(this.value)"
                   oninput="window.updateCustomSkillName(this.value)">
            <input type="text" class="cj-custom-item" placeholder="Item (Coal Ore)"
                   value="${CombatJoinState.customItemName}"
                   onchange="window.updateCustomItemName(this.value)"
                   oninput="window.updateCustomItemName(this.value)">
          </div>
          <button class="cj-custom-join-btn ${btnClass}"
                  onclick="window.joinCustomDirect()"
                  ${CombatJoinState.isJoining || !charId ? 'disabled' : ''}>
            ${CombatJoinState.isJoining ? 'Starting...' : 'Start'}
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  // ============================================
  // COMBAT JOIN GLOBAL FUNCTIONS
  // ============================================
  window.toggleCombatZone = function(zoneNum) {
    if (CombatJoinState.expandedZones.has(zoneNum)) {
      CombatJoinState.expandedZones.delete(zoneNum);
    } else {
      CombatJoinState.expandedZones.add(zoneNum);
    }
    renderCombatJoinTab();
  };

  window.joinCombatDirect = joinCombatDirect;
  window.joinCustomDirect = joinCustomDirect;
  window.updateCustomType = updateCustomType;
  window.updateCustomId = updateCustomId;
  window.updateCustomChainLength = updateCustomChainLength;
  window.updateCustomSkillName = updateCustomSkillName;
  window.updateCustomItemName = updateCustomItemName;

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5: WORLD BOSS QUEUE MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // WORLD BOSS DATA STORAGE
  // ============================================
  const WBData = {
    characters: [],
    charactersMap: {},
    portraitImages: {},
    currentBoss: null,
    characterStatuses: {} // Track join status per character
  };

  // ============================================
  // WORLD BOSS FUNCTIONS
  // ============================================
  async function getActiveWorldBoss() {
    try {
      const data = await apiCall('worldboss/schedule?limit=5');

      if (!data.success || !data.data || data.data.length === 0) {
        return null;
      }

      // Find the first boss with status "queuing"
      const queuingBoss = data.data.find(boss => boss.status === 'queuing');

      if (queuingBoss) {
        return queuingBoss;
      }

      // If no queuing boss, return the next scheduled one for info
      return data.data[0];
    } catch (error) {
      console.error('[WBQueue] Error fetching world boss schedule:', error);
      return null;
    }
  }

  // ============================================
  // GET CHARACTERS LOCATIONS (for WB zone check)
  // ============================================
  async function getCharactersLocations() {
    // Get character IDs from already loaded data
    const characterIds = WBData.characters.map(c => c.id);

    if (characterIds.length === 0) {
      throw new Error('No characters loaded');
    }

    // API requires POST with characterIds in body
    const data = await apiPost('characters/social-info', { characterIds });
    return Object.fromEntries(
      data.characters.map(c => [c.id, c.location])
    );
  }

  // ============================================
  // GET CHARACTER STATUS (combat/dungeon state)
  // ============================================
  async function getCharacterStatus(characterId) {
    const data = await apiCall(`batch/periodic-status/${characterId}`);
    const activeDungeon = data.data?.dungeonHistory?.find(d => d.is_active);

    return {
      inCombat: data.data?.activeCombat?.in_combat || false,
      inDungeon: !!activeDungeon,
      dungeonTaskId: activeDungeon?.id || null
    };
  }

  async function teleportToLocation(characterId, locationName) {
    console.log(`[WBQueue] Teleporting to ${locationName}...`);

    const result = await apiPost(`map/${characterId}/teleport/managed`, {
      locationName: locationName,
      cancel: {
        tasks: true,
        altar: true,
        idleCombat: true,
        dungeon: true,
        worldBossQueues: true
      },
      dryRun: false
    });

    return result;
  }

  async function joinWorldBossQueue(characterId, worldBossId) {
    console.log(`[WBQueue] Joining WB queue...`);

    const result = await apiPost(`worldboss/queue/${worldBossId}`, {
      characterId: characterId
    });

    return result;
  }

  // Check if a character is already in the WB queue
  async function checkCharacterQueueStatus(characterId, worldBossId) {
    try {
      const result = await apiCall(`worldboss/queue/${worldBossId}?characterId=${characterId}`);
      return result.data?.is_queued || false;
    } catch (error) {
      console.error(`[WBQueue] Error checking queue status:`, error);
      return false;
    }
  }

  async function joinWBForCharacter(characterId, characterName, currentLocation) {
    const boss = WBData.currentBoss;

    if (!boss || boss.status !== 'queuing') {
      showWBNotification(`No active World Boss queue available`, 'error');
      return false;
    }

    const wbLocation = boss.boss.location;
    const wbId = boss.id;
    const bossName = boss.boss.name;

    // Check if already in queue
    const alreadyQueued = await checkCharacterQueueStatus(characterId, wbId);
    if (alreadyQueued) {
      WBData.characterStatuses[characterId] = 'joined';
      showWBNotification(`${characterName}: Already in queue!`, 'success');
      console.log(`[WBQueue] ${characterName}: Already in queue, skipping`);
      updateWBPanel();
      return true;
    }

    // Update status to "joining"
    WBData.characterStatuses[characterId] = 'joining';
    updateWBPanel();

    try {
      // Check if character is in the same zone as the WB
      if (currentLocation !== wbLocation) {
        // NOT in the right zone -> Teleport (current behavior with cancel all)
        showWBNotification(`${characterName}: Teleporting to ${wbLocation}...`, 'info', 2000);
        console.log(`[WBQueue] ${characterName}: Not in ${wbLocation} (currently in ${currentLocation}), teleporting...`);

        try {
          await teleportToLocation(characterId, wbLocation);
        } catch (tpError) {
          // If already at location, that's fine - continue to join queue
          const errorMsg = tpError.message.toLowerCase();
          if (errorMsg.includes('already at location') || errorMsg.includes('already at')) {
            console.log(`[WBQueue] ${characterName}: Already at ${wbLocation}, skipping teleport`);
          } else {
            throw tpError; // Re-throw if it's a different error
          }
        }
      } else {
        // ALREADY in the right zone -> Only cancel combat/dungeon if active (preserve tasks)
        showWBNotification(`${characterName}: Already in ${wbLocation}, preparing...`, 'info', 2000);
        console.log(`[WBQueue] ${characterName}: Already in ${wbLocation}, checking combat/dungeon status...`);

        // Get character's current combat/dungeon status
        const status = await getCharacterStatus(characterId);

        // Delay after API call
        await sleep(randomDelay(ACTION_DELAY_MIN, ACTION_DELAY_MAX));

        if (status.inCombat) {
          console.log(`[WBQueue] ${characterName}: Leaving combat...`);
          await leaveCombat(characterId);
        } else if (status.inDungeon && status.dungeonTaskId) {
          console.log(`[WBQueue] ${characterName}: Cancelling dungeon...`);
          await cancelDungeon(status.dungeonTaskId, characterId);
        } else {
          console.log(`[WBQueue] ${characterName}: Not in combat or dungeon, ready to join`);
        }
      }

      // Delay between actions
      const delay = randomDelay(ACTION_DELAY_MIN, ACTION_DELAY_MAX);
      await sleep(delay);

      // Join the queue
      showWBNotification(`${characterName}: Joining ${bossName} queue...`, 'info', 2000);
      console.log(`[WBQueue] ${characterName}: Joining queue...`);

      try {
        const result = await joinWorldBossQueue(characterId, wbId);

        if (result.success) {
          WBData.characterStatuses[characterId] = 'joined';
          showWBNotification(`${characterName}: Joined queue! Position: ${result.data.position}`, 'success');
          console.log(`[WBQueue] ${characterName}: Joined! Position ${result.data.position}/${result.data.queue_count}`);
          updateWBPanel();
          return true;
        } else {
          WBData.characterStatuses[characterId] = 'error';
          showWBNotification(`${characterName}: Failed to join queue`, 'error');
          updateWBPanel();
          return false;
        }
      } catch (joinError) {
        // If already in queue, mark as joined
        const errorMsg = joinError.message.toLowerCase();
        if (errorMsg.includes('already in queue') || errorMsg.includes('already queued') || errorMsg.includes('already joined')) {
          WBData.characterStatuses[characterId] = 'joined';
          showWBNotification(`${characterName}: Already in queue!`, 'success');
          console.log(`[WBQueue] ${characterName}: Already in queue`);
          updateWBPanel();
          return true;
        } else {
          throw joinError; // Re-throw if it's a different error
        }
      }

    } catch (error) {
      console.error(`[WBQueue] Error for ${characterName}:`, error);
      WBData.characterStatuses[characterId] = 'error';
      showWBNotification(`${characterName}: ${error.message}`, 'error');
      updateWBPanel();
      return false;
    }
  }

  async function joinAllWBCharacters() {
    const boss = WBData.currentBoss;

    if (!boss || boss.status !== 'queuing') {
      showWBNotification('No active World Boss queue available', 'error');
      return;
    }

    showWBNotification(`Joining all characters to ${boss.boss.name}...`, 'info');

    // Get all character locations ONCE at the start
    console.log('[WBQueue] Fetching character locations...');
    let characterLocations = {};
    try {
      characterLocations = await getCharactersLocations();
      console.log('[WBQueue] Character locations:', characterLocations);
      // Delay after API call
      await sleep(randomDelay(ACTION_DELAY_MIN, ACTION_DELAY_MAX));
    } catch (error) {
      console.error('[WBQueue] Failed to fetch character locations:', error);
      showWBNotification('Failed to fetch character locations', 'error');
      return;
    }

    let successCount = 0;

    for (let i = 0; i < WBData.characters.length; i++) {
      const char = WBData.characters[i];

      // Skip already joined characters
      if (WBData.characterStatuses[char.id] === 'joined') {
        console.log(`[WBQueue] ${char.name}: Already joined, skipping`);
        continue;
      }

      // Get current location for this character
      const currentLocation = characterLocations[char.id];
      const success = await joinWBForCharacter(char.id, char.name, currentLocation);
      if (success) successCount++;

      // Delay between characters
      if (i < WBData.characters.length - 1) {
        const delay = randomDelay(ACTION_DELAY_MIN, ACTION_DELAY_MAX);
        await sleep(delay);
      }
    }

    showWBNotification(`Joined ${successCount}/${WBData.characters.length} characters!`, 'success', 5000);
  }

  // ============================================
  // LOAD WORLD BOSS DATA
  // ============================================
  async function loadWBData() {
    try {
      if (!TokenManager.isReady()) {
        console.log('[WBQueue] Token not ready yet');
        return false;
      }

      console.log('[WBQueue] Loading data...');

      // Load characters
      const charsData = await apiCall('characters/all');
      if (charsData.success && charsData.characters) {
        WBData.characters = charsData.characters;
        WBData.charactersMap = Object.fromEntries(
          charsData.characters.map(char => [char.id, char])
        );
        console.log(`[WBQueue] Loaded ${charsData.characters.length} characters`);
      }

      // Load world boss info
      WBData.currentBoss = await getActiveWorldBoss();
      if (WBData.currentBoss) {
        console.log(`[WBQueue] Current WB: ${WBData.currentBoss.boss.name} (${WBData.currentBoss.status})`);

        // Check queue status for each character if boss is queuing
        if (WBData.currentBoss.status === 'queuing') {
          console.log('[WBQueue] Checking queue status for each character...');
          for (const char of WBData.characters) {
            const isQueued = await checkCharacterQueueStatus(char.id, WBData.currentBoss.id);
            if (isQueued) {
              WBData.characterStatuses[char.id] = 'joined';
              console.log(`[WBQueue] ${char.name}: Already in queue`);
            }
            // Small delay between API calls
            await sleep(200);
          }
        }
      }

      // Scan portraits from DOM
      scanWBPortraits();

      updateWBPanel();
      updateWBToggleIcon();
      return true;

    } catch (error) {
      console.error('[WBQueue] Error loading data:', error);
      return false;
    }
  }

  function scanWBPortraits() {
    const allPortraits = document.querySelectorAll('button img[alt]');
    const portraits = Array.from(allPortraits).filter(img => {
      const parentClasses = img.parentElement?.className || '';
      return parentClasses.includes('relative') &&
             parentClasses.includes('w-9') &&
             parentClasses.includes('h-9') &&
             parentClasses.includes('rounded-lg') &&
             !parentClasses.includes('md:hidden');
    });

    portraits.forEach(img => {
      WBData.portraitImages[img.alt] = img.src;
    });
  }

  async function refreshWBBossInfo() {
    if (!TokenManager.isReady()) {
      console.log('[WBQueue] Token not ready, skipping boss refresh');
      return;
    }
    WBData.currentBoss = await getActiveWorldBoss();
    updateWBPanel();
    updateWBToggleIcon();
  }

  // ============================================
  // WORLD BOSS NOTIFICATION SYSTEM
  // ============================================
  let wbNotificationIdCounter = 0;

  function showWBNotification(message, type = 'info', duration = 3000) {
    const id = `wb-notification-${wbNotificationIdCounter++}`;
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `wb-notification wb-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    const allNotifications = document.querySelectorAll('.wb-notification');
    let offset = 20;
    allNotifications.forEach((notif) => {
      notif.style.top = `${offset}px`;
      offset += notif.offsetHeight + 10;
    });

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }

  // ============================================
  // WORLD BOSS TOGGLE ICON
  // ============================================
  function getWBToggleFallbackIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>';
  }

  function updateWBToggleIcon() {
    const toggleBtn = document.getElementById('wb-toggle');
    if (!toggleBtn) return;

    // Check if we have a current boss with an image
    if (WBData.currentBoss?.boss?.image_url) {
      toggleBtn.innerHTML = `<img src="${WBData.currentBoss.boss.image_url}"
        style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
        onerror="this.parentElement.innerHTML = getWBToggleFallbackIcon();">`;
      toggleBtn.title = `World Boss: ${WBData.currentBoss.boss.name}`;
    } else {
      // Fallback to default icon
      toggleBtn.innerHTML = getWBToggleFallbackIcon();
      toggleBtn.title = 'World Boss Queue';
    }
  }

  // ============================================
  // WORLD BOSS UI PANEL
  // ============================================
  function createWBUI() {
    const style = document.createElement('style');
    style.textContent = `
      #wb-toggle {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #161922;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 9998;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      #wb-toggle:hover {
        background: #1E2330;
        transform: scale(1.05);
      }

      #wb-toggle:active {
        transform: scale(0.95);
      }

      #wb-panel {
        position: fixed;
        bottom: 160px;
        right: 20px;
        width: 380px;
        max-height: 500px;
        background: #0B0E14;
        border: 1px solid #1E2330;
        border-radius: 0.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: wbSlideIn 0.3s ease;
      }

      @keyframes wbSlideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      #wb-panel.visible {
        display: flex;
      }

      .wb-header {
        background: #0B0E14;
        padding: 16px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1E2330;
      }

      .wb-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .wb-header-buttons {
        display: flex;
        gap: 8px;
      }

      .wb-header button {
        background: transparent;
        border: none;
        color: #9ca3af;
        padding: 4px;
        cursor: pointer;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .wb-header button:hover {
        color: white;
      }

      .wb-header button svg {
        width: 20px;
        height: 20px;
      }

      .wb-boss-info {
        padding: 12px 16px;
        background: #1E2330;
        border-bottom: 1px solid #2A3041;
      }

      .wb-boss-name {
        font-size: 1rem;
        font-weight: 600;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .wb-boss-details {
        font-size: 0.8rem;
        color: #9ca3af;
        margin-top: 6px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .wb-boss-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .wb-boss-status.queuing {
        background: #10b981;
        color: white;
      }

      .wb-boss-status.scheduled {
        background: #f59e0b;
        color: white;
      }

      .wb-boss-status.none {
        background: #6b7280;
        color: white;
      }

      .wb-content {
        padding: 12px 16px;
        overflow-y: auto;
        max-height: 350px;
      }

      .wb-content::-webkit-scrollbar {
        width: 8px;
      }

      .wb-content::-webkit-scrollbar-track {
        background: #1E2330;
        border-radius: 4px;
      }

      .wb-content::-webkit-scrollbar-thumb {
        background: #2A3041;
        border-radius: 4px;
      }

      .wb-join-all-btn {
        width: 100%;
        padding: 10px;
        margin-bottom: 12px;
        background: #4f46e5;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .wb-join-all-btn:hover {
        background: #4338ca;
        transform: translateY(-1px);
      }

      .wb-join-all-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .wb-character {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 6px;
        margin-bottom: 8px;
        transition: all 0.2s;
      }

      .wb-character:hover {
        border-color: #4f46e5;
        background: #252B3B;
      }

      .wb-character:last-child {
        margin-bottom: 0;
      }

      .wb-char-pfp {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .wb-char-info {
        flex: 1;
        min-width: 0;
      }

      .wb-char-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .wb-char-class {
        font-size: 0.75rem;
        color: #9ca3af;
      }

      .wb-char-status {
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
      }

      .wb-char-status.pending {
        background: #374151;
        color: #9ca3af;
      }

      .wb-char-status.joining {
        background: #3b82f6;
        color: white;
      }

      .wb-char-status.joined {
        background: #10b981;
        color: white;
      }

      .wb-char-status.error {
        background: #ef4444;
        color: white;
      }

      .wb-join-btn {
        padding: 6px 14px;
        background: #4f46e5;
        border: none;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .wb-join-btn:hover {
        background: #4338ca;
      }

      .wb-join-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .wb-no-data {
        text-align: center;
        padding: 30px 20px;
        color: #9ca3af;
      }

      .wb-no-data div {
        font-size: 40px;
        margin-bottom: 10px;
      }

      .wb-notification {
        position: fixed;
        right: 20px;
        min-width: 300px;
        max-width: 380px;
        padding: 14px 18px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        font-weight: 500;
        font-size: 13px;
        z-index: 999999;
        transition: all 0.3s ease;
        animation: wbSlideInRight 0.3s ease;
      }

      @keyframes wbSlideInRight {
        from {
          opacity: 0;
          transform: translateX(400px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .wb-notification-info {
        background: #3b82f6;
        color: white;
        border-left: 4px solid #2563eb;
      }

      .wb-notification-success {
        background: #10b981;
        color: white;
        border-left: 4px solid #059669;
      }

      .wb-notification-error {
        background: #ef4444;
        color: white;
        border-left: 4px solid #dc2626;
      }

      @media (max-width: 768px) {
        #wb-toggle {
          bottom: 170px;
          right: 15px;
          width: 50px;
          height: 50px;
        }

        #wb-panel {
          bottom: 230px;
          right: 10px;
          left: 10px;
          width: auto;
          max-width: calc(100vw - 20px);
        }
      }

      @media (max-width: 480px) {
        #wb-toggle {
          bottom: 190px;
        }

        #wb-panel {
          bottom: 250px;
        }
      }
    `;
    document.head.appendChild(style);

    // Create toggle button (will be updated with boss image later)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'wb-toggle';
    toggleBtn.innerHTML = getWBToggleFallbackIcon();
    toggleBtn.title = 'World Boss Queue';
    document.body.appendChild(toggleBtn);

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'wb-panel';
    panel.innerHTML = `
      <div class="wb-header">
        <h3>World Boss Queue</h3>
        <div class="wb-header-buttons">
          <button id="wb-refresh-btn" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button id="wb-close-btn" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="wb-boss-info" id="wb-boss-info">
        <div class="wb-boss-name">Loading...</div>
      </div>
      <div class="wb-content" id="wb-content">
        <div class="wb-no-data">
          <div>Loading...</div>
          <p>Fetching character data...</p>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listeners
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('visible');
      if (panel.classList.contains('visible')) {
        refreshWBBossInfo();
      }
    });

    document.getElementById('wb-close-btn').addEventListener('click', () => {
      panel.classList.remove('visible');
    });

    document.getElementById('wb-refresh-btn').addEventListener('click', async () => {
      // Reset all statuses
      WBData.characterStatuses = {};
      await loadWBData();
    });
  }

  function updateWBPanel() {
    const bossInfoEl = document.getElementById('wb-boss-info');
    const contentEl = document.getElementById('wb-content');

    if (!bossInfoEl || !contentEl) return;

    // Update boss info
    const boss = WBData.currentBoss;
    if (boss) {
      const statusClass = boss.status === 'queuing' ? 'queuing' : 'scheduled';
      bossInfoEl.innerHTML = `
        <div class="wb-boss-name">
          <img src="${boss.boss.image_url}" style="width: 32px; height: 32px; border-radius: 4px;">
          ${boss.boss.name}
          <span class="wb-boss-status ${statusClass}">${boss.status}</span>
        </div>
        <div class="wb-boss-details">
          <span>Lv.${boss.boss.level}</span>
          <span>${boss.boss.location}</span>
          <span>Queue: ${boss.queue_count}</span>
          <span>${boss.time_until_spawn}</span>
        </div>
      `;
    } else {
      bossInfoEl.innerHTML = `
        <div class="wb-boss-name">
          <span class="wb-boss-status none">No Boss</span>
          No World Boss scheduled
        </div>
      `;
    }

    // Update character list
    if (WBData.characters.length === 0) {
      contentEl.innerHTML = `
        <div class="wb-no-data">
          <div>Loading...</div>
          <p>Navigate in the game to load characters</p>
        </div>
      `;
      return;
    }

    const canJoin = boss && boss.status === 'queuing';

    let html = '';

    // Join All button
    if (canJoin) {
      html += `
        <button class="wb-join-all-btn" onclick="window.wbJoinAll()" ${!canJoin ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Join All Characters
        </button>
      `;
    }

    // Character list
    WBData.characters.forEach(char => {
      const status = WBData.characterStatuses[char.id] || 'pending';
      const portraitUrl = char.pfp || WBData.portraitImages[char.name] || '';

      const statusLabels = {
        pending: 'Ready',
        joining: 'Joining...',
        joined: 'Joined!',
        error: 'Error'
      };

      const isJoining = status === 'joining';
      const isJoined = status === 'joined';
      const btnDisabled = !canJoin || isJoining || isJoined;

      html += `
        <div class="wb-character">
          ${portraitUrl ? `<img src="${portraitUrl}" class="wb-char-pfp">` : ''}
          <div class="wb-char-info">
            <div class="wb-char-name">${char.name}</div>
            <div class="wb-char-class">${char.class}</div>
          </div>
          <span class="wb-char-status ${status}">${statusLabels[status]}</span>
          <button class="wb-join-btn" onclick="window.wbJoinChar('${char.id}', '${char.name}')" ${btnDisabled ? 'disabled' : ''}>
            ${isJoined ? 'Done' : 'Join'}
          </button>
        </div>
      `;
    });

    contentEl.innerHTML = html;
  }

  // ============================================
  // WORLD BOSS GLOBAL FUNCTIONS
  // ============================================
  window.wbJoinChar = async function(charId, charName) {
    // Fetch location for this character
    try {
      const locations = await getCharactersLocations();
      // Delay after API call
      await sleep(randomDelay(ACTION_DELAY_MIN, ACTION_DELAY_MAX));
      const currentLocation = locations[charId];
      await joinWBForCharacter(charId, charName, currentLocation);
    } catch (error) {
      console.error(`[WBQueue] Error joining ${charName}:`, error);
      showWBNotification(`${charName}: Failed to get location`, 'error');
    }
  };

  window.wbJoinAll = function() {
    joinAllWBCharacters();
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 7: PET AUTO-FEED MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // PET FEED CONSTANTS & STATE
  // ============================================
  const PET_FOOD_ITEMS = {
    703: { name: 'Pet Food', fullnessPerUnit: 5 }
    // Extensible: add more food types here when needed
    // e.g., 750: { name: 'Premium Pet Food', fullnessPerUnit: 10 }
  };

  const PET_FEED_STORAGE_KEY = 'degenIdle_petFeed_settings';
  const PET_FEED_CHECK_INTERVAL = 60000; // 1 minute

  const PetFeedState = {
    enabled: false,
    selectedFoodItemId: 703,
    checkIntervalId: null,
    totalFedThisSession: 0,
    lastFeedTime: null,
    lastCheckTime: null,
    cachedPetData: null,
    cachedInventory: null,
    isFeeding: false,
    lastError: null
  };

  // ============================================
  // GLOBAL AUTO MODE STATE & CONSTANTS
  // ============================================
  const GLOBAL_AUTO_STORAGE_KEY = 'degenIdle_globalAuto';
  const GLOBAL_INTERVAL_OPTIONS = [
    { value: 60000, label: '1 min' },
    { value: 180000, label: '3 min' },
    { value: 300000, label: '5 min' },
    { value: 600000, label: '10 min' }
  ];

  const GlobalAutoState = {
    timer: null,
    isRunning: false,
    isActive: false,          // Whether global mode should be running (persisted)
    interval: 180000,         // Default 3 minutes (configurable)
    lastCycleTime: null,
    nextCycleTime: null,      // For countdown display
    currentCharacterName: null,
    processedCount: 0,
    totalCount: 0,
    errors: [],
    // Per-character config: { charId: { autoSell: bool, autoFeed: bool } }
    characters: {},
    lastCycleResults: {       // Store results of last cycle for display
      autoSell: { processed: 0, itemsSold: 0, goldGained: 0 },
      autoFeed: { processed: 0, petsFed: 0 }
    }
  };

  // ============================================
  // GLOBAL AUTO MODE CONFIG FUNCTIONS
  // ============================================
  function loadGlobalAutoConfig() {
    try {
      const saved = localStorage.getItem(GLOBAL_AUTO_STORAGE_KEY);
      if (saved) {
        const config = JSON.parse(saved);
        GlobalAutoState.interval = config.interval || 180000;
        GlobalAutoState.characters = config.characters || {};
        GlobalAutoState.isActive = config.isActive || false;
        console.log('[GlobalAuto] Config loaded:', config);
      }
    } catch (e) {
      console.error('[GlobalAuto] Error loading config:', e);
    }
  }

  function saveGlobalAutoConfig() {
    try {
      const config = {
        interval: GlobalAutoState.interval,
        characters: GlobalAutoState.characters,
        isActive: GlobalAutoState.isActive
      };
      localStorage.setItem(GLOBAL_AUTO_STORAGE_KEY, JSON.stringify(config));
      console.log('[GlobalAuto] Config saved:', config);
    } catch (e) {
      console.error('[GlobalAuto] Error saving config:', e);
    }
  }

  // Check if any character has global auto enabled
  function hasAnyGlobalAutoEnabled() {
    return Object.values(GlobalAutoState.characters).some(c => c.autoSell || c.autoFeed);
  }

  // Get character global config (with defaults)
  function getCharGlobalConfig(charId) {
    return GlobalAutoState.characters[charId] || { autoSell: false, autoFeed: false };
  }

  // Set character global config
  function setCharGlobalConfig(charId, autoSell, autoFeed) {
    GlobalAutoState.characters[charId] = { autoSell, autoFeed };
    saveGlobalAutoConfig();
  }

  // ============================================
  // GLOBAL AUTO MODE HELPER FUNCTIONS
  // ============================================
  // Load auto-sell config for a specific character (not the active one)
  function loadAutoSellConfigForChar(charId) {
    const key = `degenIdle_autoSell_${charId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const config = JSON.parse(saved);
        // Merge with defaults
        const merged = { ...getDefaultAutoSellConfig(), ...config };
        merged.rules = { ...getDefaultAutoSellConfig().rules, ...config.rules };
        return merged;
      }
    } catch (e) {
      console.error(`[GlobalAuto] Error loading auto-sell config for ${charId}:`, e);
    }
    return getDefaultAutoSellConfig();
  }

  // Load pet feed settings for a specific character (not the active one)
  function loadPetFeedSettingsForChar(charId) {
    const key = `${PET_FEED_STORAGE_KEY}_${charId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(`[GlobalAuto] Error loading pet feed settings for ${charId}:`, e);
    }
    return { enabled: false, selectedFoodItemId: 703 };
  }

  // Format time remaining for display
  function formatTimeRemaining(ms) {
    if (ms <= 0) return 'Now';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  // ============================================
  // GLOBAL AUTO MODE TIMER CONTROL
  // ============================================
  async function startGlobalAutoMode() {
    // Verify characters are loaded
    if (!window.allCharactersData.charactersList?.length) {
      console.log('[GlobalAuto] Characters not loaded, loading now...');
      showMonitorNotification('Loading characters...', 'info', 2000);
      await loadCharacterNames(false);
    }

    if (!window.allCharactersData.charactersList?.length) {
      showMonitorNotification('Failed to load characters. Try refreshing the page.', 'error');
      return false;
    }

    if (GlobalAutoState.timer) {
      console.log('[GlobalAuto] Already running');
      return true;
    }

    // Stop individual timers (Global takes over, but preserve configs)
    stopAutoSellTimer();
    stopAutoFeedTimer();

    const intervalLabel = GLOBAL_INTERVAL_OPTIONS.find(o => o.value === GlobalAutoState.interval)?.label || `${GlobalAutoState.interval / 60000} min`;
    console.log(`[GlobalAuto] Starting global auto mode (interval: ${intervalLabel})`);
    showMonitorNotification(`Global Auto Mode started (${intervalLabel})`, 'success', 3000);

    // Mark as active and save
    GlobalAutoState.isActive = true;
    saveGlobalAutoConfig();

    // Create the interval timer FIRST (so UI shows "Running" immediately)
    GlobalAutoState.timer = setInterval(async () => {
      GlobalAutoState.nextCycleTime = Date.now() + GlobalAutoState.interval;
      await runGlobalAutoCycle();
    }, GlobalAutoState.interval);

    // Start countdown update intervals
    startGlobalAutoCountdown();
    startGlobalTabCountdown();

    // Set next cycle time for countdown display
    GlobalAutoState.nextCycleTime = Date.now() + GlobalAutoState.interval;

    // Run first cycle immediately (timer already exists, so UI will show "Running")
    await runGlobalAutoCycle();

    return true;
  }

  function stopGlobalAutoMode() {
    if (GlobalAutoState.timer) {
      clearInterval(GlobalAutoState.timer);
      GlobalAutoState.timer = null;
    }

    stopGlobalAutoCountdown();

    GlobalAutoState.isRunning = false;
    GlobalAutoState.isActive = false;
    GlobalAutoState.nextCycleTime = null;
    saveGlobalAutoConfig();
    console.log('[GlobalAuto] Global auto mode stopped');

    // Restart individual timers if their configs are enabled for the active character
    const currentCharId = localStorage.getItem('activeCharacterId');
    if (currentCharId) {
      // Only restart if global mode is fully off
      if (!GlobalAutoState.timer) {
        const sellConfig = loadAutoSellConfigForChar(currentCharId);
        if (sellConfig.enabled) {
          console.log('[GlobalAuto] Restarting individual auto-sell timer');
          startAutoSellTimer();
        }

        const feedSettings = loadPetFeedSettingsForChar(currentCharId);
        if (feedSettings.enabled) {
          console.log('[GlobalAuto] Restarting individual auto-feed timer');
          startAutoFeed();
        }
      }
    }
  }

  // Restart global mode if at least one character has global auto enabled
  function restartGlobalAutoModeIfNeeded() {
    const shouldRun = hasAnyGlobalAutoEnabled();

    if (shouldRun && !GlobalAutoState.timer) {
      startGlobalAutoMode();
    } else if (!shouldRun && GlobalAutoState.timer) {
      stopGlobalAutoMode();
    }
  }

  // Countdown display update
  let globalAutoCountdownInterval = null;

  function startGlobalAutoCountdown() {
    stopGlobalAutoCountdown();
    globalAutoCountdownInterval = setInterval(() => {
      // Update UI elements showing countdown
      updateGlobalAutoCountdownDisplay();
    }, 1000);
  }

  function stopGlobalAutoCountdown() {
    if (globalAutoCountdownInterval) {
      clearInterval(globalAutoCountdownInterval);
      globalAutoCountdownInterval = null;
    }
  }

  function updateGlobalAutoCountdownDisplay() {
    const countdownElements = document.querySelectorAll('.global-mode-countdown');
    if (countdownElements.length === 0) return;

    const now = Date.now();
    const remaining = GlobalAutoState.nextCycleTime ? GlobalAutoState.nextCycleTime - now : 0;
    const displayText = remaining > 0 ? formatTimeRemaining(remaining) : 'Running...';

    countdownElements.forEach(el => {
      el.textContent = displayText;
    });
  }

  // ============================================
  // GLOBAL AUTO CYCLE
  // ============================================
  async function runGlobalAutoCycle() {
    if (GlobalAutoState.isRunning) {
      console.log('[GlobalAuto] Cycle already running, skipping');
      return;
    }

    // Check if any character has global auto enabled
    if (!hasAnyGlobalAutoEnabled()) {
      console.log('[GlobalAuto] No characters have global auto enabled, skipping cycle');
      return;
    }

    if (!TokenManager.isReady()) {
      console.log('[GlobalAuto] Token not ready, skipping cycle');
      showMonitorNotification('Global Auto: Token not ready', 'error', 3000);
      return;
    }

    GlobalAutoState.isRunning = true;
    GlobalAutoState.errors = [];
    GlobalAutoState.lastCycleTime = Date.now();

    // Reset cycle results
    GlobalAutoState.lastCycleResults = {
      autoSell: { processed: 0, itemsSold: 0, goldGained: 0 },
      autoFeed: { processed: 0, petsFed: 0 }
    };

    const characters = window.allCharactersData.charactersList || [];
    GlobalAutoState.totalCount = characters.length;
    GlobalAutoState.processedCount = 0;

    console.log(`[GlobalAuto] Starting cycle for ${characters.length} characters`);

    showMonitorNotification(`Global cycle starting (${characters.length} chars)`, 'info', 2500);

    // Update UI to show running state
    renderSellTabMini();
    renderPetFeedTab();
    renderGlobalTab();

    for (const char of characters) {
      GlobalAutoState.currentCharacterName = char.name;
      GlobalAutoState.processedCount++;

      // Get this character's global config
      const charGlobalConfig = getCharGlobalConfig(char.id);

      console.log(`[GlobalAuto] Processing ${char.name} (${GlobalAutoState.processedCount}/${characters.length}) - Sell: ${charGlobalConfig.autoSell}, Feed: ${charGlobalConfig.autoFeed}`);

      try {
        // Auto-Sell (if enabled for this character in Global tab)
        if (charGlobalConfig.autoSell) {
          // Load the detailed config (which items/slots to sell)
          const sellConfig = loadAutoSellConfigForChar(char.id);
          // Force enabled since we're using global config
          sellConfig.enabled = true;

          const sellResult = await runAutoSellForCharacter(char.id, sellConfig);
          GlobalAutoState.lastCycleResults.autoSell.processed++;

          if (sellResult.itemsSold > 0) {
            GlobalAutoState.lastCycleResults.autoSell.itemsSold += sellResult.itemsSold;
            GlobalAutoState.lastCycleResults.autoSell.goldGained += sellResult.goldGained;
            showMonitorNotification(`${char.name}: Sold ${sellResult.itemsSold} items (+${sellResult.goldGained}g)`, 'success', 2500);
          }

          if (sellResult.error) {
            GlobalAutoState.errors.push({ character: char.name, type: 'sell', error: sellResult.error });
          }
        }

        // Auto-Feed (if enabled for this character in Global tab)
        if (charGlobalConfig.autoFeed) {
          const feedResult = await runAutoFeedForCharacter(char.id);
          GlobalAutoState.lastCycleResults.autoFeed.processed++;

          if (feedResult.fed) {
            GlobalAutoState.lastCycleResults.autoFeed.petsFed++;
            showMonitorNotification(`${char.name}: Fed ${feedResult.amount} food to ${feedResult.petName}`, 'success', 2500);
          }

          if (feedResult.error) {
            GlobalAutoState.errors.push({ character: char.name, type: 'feed', error: feedResult.error });
          }
        }

      } catch (e) {
        console.error(`[GlobalAuto] Error for ${char.name}:`, e);
        GlobalAutoState.errors.push({ character: char.name, type: 'general', error: e.message });
        showMonitorNotification(`${char.name}: ${e.message}`, 'error', 3000);
      }

      // Update Global tab during cycle
      renderGlobalTab();

      // Delay between characters (1-2s)
      if (GlobalAutoState.processedCount < characters.length) {
        await sleep(randomDelay(1000, 2000));
      }
    }

    GlobalAutoState.isRunning = false;
    GlobalAutoState.currentCharacterName = null;

    // Summary notification
    const errorCount = GlobalAutoState.errors.length;
    const sellSummary = GlobalAutoState.lastCycleResults.autoSell;
    const feedSummary = GlobalAutoState.lastCycleResults.autoFeed;

    let summaryParts = [];
    if (sellSummary.itemsSold > 0) {
      summaryParts.push(`Sold ${sellSummary.itemsSold} items (+${sellSummary.goldGained}g)`);
    }
    if (feedSummary.petsFed > 0) {
      summaryParts.push(`Fed ${feedSummary.petsFed} pets`);
    }

    if (summaryParts.length > 0) {
      showMonitorNotification(`Cycle complete: ${summaryParts.join(', ')}`, 'success', 4000);
    } else if (errorCount > 0) {
      showMonitorNotification(`Cycle complete with ${errorCount} error(s)`, 'error', 4000);
    } else {
      showMonitorNotification(`Cycle complete - nothing to process`, 'info', 3000);
    }

    console.log('[GlobalAuto] Cycle complete:', {
      autoSell: sellSummary,
      autoFeed: feedSummary,
      errors: GlobalAutoState.errors
    });

    // Refresh UI
    renderSellTabMini();
    renderPetFeedTab();
    renderGlobalTab();
  }

  // ============================================
  // PET FEED SETTINGS PERSISTENCE (per character)
  // ============================================
  function getPetFeedStorageKey() {
    const charId = getActiveCharacterId();
    if (!charId) return null;
    return `${PET_FEED_STORAGE_KEY}_${charId}`;
  }

  function loadPetFeedSettings() {
    // Reset to defaults first
    PetFeedState.enabled = false;
    PetFeedState.selectedFoodItemId = 703;

    const key = getPetFeedStorageKey();
    if (!key) {
      console.log('[PetFeed] No character ID, using default settings');
      return;
    }

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const settings = JSON.parse(saved);
        PetFeedState.enabled = settings.enabled || false;
        PetFeedState.selectedFoodItemId = settings.selectedFoodItemId || 703;
        console.log('[PetFeed] Settings loaded for character:', key, settings);
      } else {
        console.log('[PetFeed] No saved settings for character, using defaults');
      }
    } catch (e) {
      console.error('[PetFeed] Error loading settings:', e);
    }
  }

  function savePetFeedSettings() {
    const key = getPetFeedStorageKey();
    if (!key) {
      console.warn('[PetFeed] Cannot save settings - no character ID');
      return;
    }

    try {
      const settings = {
        enabled: PetFeedState.enabled,
        selectedFoodItemId: PetFeedState.selectedFoodItemId
      };
      localStorage.setItem(key, JSON.stringify(settings));
      console.log('[PetFeed] Settings saved for character:', key, settings);
    } catch (e) {
      console.error('[PetFeed] Error saving settings:', e);
    }
  }

  // ============================================
  // PET FEED API FUNCTIONS
  // ============================================
  async function getPetAndInventoryData() {
    const charId = getActiveCharacterId();
    if (!charId) {
      console.error('[PetFeed] No active character ID found');
      return null;
    }

    try {
      const data = await apiCall(`characters/${charId}/all-data`);
      if (data.success && data.data) {
        return {
          pet: data.data.equippedPet,
          inventory: data.data.inventory?.items || [],
          characterName: data.data.character?.name,
          characterId: charId
        };
      }
    } catch (e) {
      console.error('[PetFeed] Error fetching pet/inventory data:', e);
      PetFeedState.lastError = e.message;
    }
    return null;
  }

  async function feedPetAPI(characterId, foodInventoryId, amount) {
    try {
      const result = await apiPost(`pets/${characterId}/feed`, {
        foodInventoryId: foodInventoryId,
        amount: amount
      });
      console.log('[PetFeed] Feed API response:', result);
      return result;
    } catch (e) {
      console.error('[PetFeed] Error feeding pet:', e);
      throw e;
    }
  }

  // ============================================
  // PET FEED HELPER FUNCTIONS
  // ============================================

  // Returns ALL pet food items in inventory as an array
  function getAllPetFoodInInventory(inventory) {
    if (!inventory || !Array.isArray(inventory)) return [];

    const foodItems = [];
    for (const item of inventory) {
      if (PET_FOOD_ITEMS[item.item_id]) {
        foodItems.push({
          inventoryId: item.id,
          itemId: item.item_id,
          quantity: item.quantity,
          name: PET_FOOD_ITEMS[item.item_id].name,
          fullnessPerUnit: PET_FOOD_ITEMS[item.item_id].fullnessPerUnit
        });
      }
    }
    return foodItems;
  }

  // Returns a SPECIFIC pet food item by itemId, or null if not found
  function findPetFoodInInventory(inventory, itemId) {
    const targetItemId = itemId || PetFeedState.selectedFoodItemId;
    const allFood = getAllPetFoodInInventory(inventory);
    return allFood.find(f => f.itemId === targetItemId) || null;
  }

  function calculateFeedAmount(pet, foodItem) {
    if (!pet || !foodItem) return 0;

    const currentFullness = pet.current_fullness || 0;
    const maxFullness = pet.max_fullness || 100;
    const fullnessNeeded = maxFullness - currentFullness;
    const fullnessPerUnit = foodItem.fullnessPerUnit || 5;

    // Calculate how many food units we need
    const unitsNeeded = Math.ceil(fullnessNeeded / fullnessPerUnit);

    // Don't exceed available quantity
    return Math.min(unitsNeeded, foodItem.quantity);
  }

  function getFullnessPercent(pet) {
    if (!pet || !pet.max_fullness) return 0;
    return Math.round((pet.current_fullness / pet.max_fullness) * 100);
  }

  function getFullnessClass(percent) {
    if (percent <= 0) return 'empty';
    if (percent <= 25) return 'low';
    if (percent <= 60) return 'medium';
    return 'high';
  }

  // ============================================
  // PET FEED CORE LOGIC
  // ============================================
  async function checkAndFeedPet() {
    if (PetFeedState.isFeeding) {
      console.log('[PetFeed] Already feeding, skipping check');
      return;
    }

    if (!TokenManager.isReady()) {
      console.log('[PetFeed] Token not ready, skipping check');
      return;
    }

    PetFeedState.lastCheckTime = new Date();

    try {
      // Fetch current data
      const data = await getPetAndInventoryData();
      if (!data) {
        console.log('[PetFeed] Could not get pet/inventory data');
        return;
      }

      // Cache the data for UI
      PetFeedState.cachedPetData = data.pet;
      PetFeedState.cachedInventory = data.inventory;

      // Update UI with fresh data
      renderPetFeedTab();

      // Check if pet exists and needs feeding
      if (!data.pet) {
        console.log('[PetFeed] No pet equipped');
        return;
      }

      const pet = data.pet;
      const currentFullness = pet.current_fullness || 0;

      // Only auto-feed when fullness = 0
      if (currentFullness > 0) {
        console.log(`[PetFeed] Pet fullness at ${currentFullness}/${pet.max_fullness}, no feed needed`);
        return;
      }

      console.log('[PetFeed] Pet fullness is 0, triggering auto-feed...');

      // Find selected food in inventory
      const foodItem = findPetFoodInInventory(data.inventory, PetFeedState.selectedFoodItemId);
      if (!foodItem || foodItem.quantity <= 0) {
        console.log('[PetFeed] No food available for selected type');
        PetFeedState.lastError = 'No food available';
        showMonitorNotification('Pet hungry but no food available!', 'error');
        return;
      }

      // Calculate amount to feed
      const amount = calculateFeedAmount(pet, foodItem);
      if (amount <= 0) {
        console.log('[PetFeed] No feeding needed');
        return;
      }

      // Feed the pet
      await performFeed(data.characterId, foodItem.inventoryId, amount, pet.name);

    } catch (e) {
      console.error('[PetFeed] Error in checkAndFeedPet:', e);
      PetFeedState.lastError = e.message;
    }
  }

  async function performFeed(characterId, foodInventoryId, amount, petName) {
    PetFeedState.isFeeding = true;

    try {
      console.log(`[PetFeed] Feeding ${amount} food to ${petName}...`);

      const result = await feedPetAPI(characterId, foodInventoryId, amount);

      if (result.success) {
        PetFeedState.totalFedThisSession += amount;
        PetFeedState.lastFeedTime = new Date();
        PetFeedState.lastError = null;

        // Update cached pet data with response
        if (result.pet) {
          PetFeedState.cachedPetData = result.pet;
        }

        console.log(`[PetFeed] SUCCESS - Fed ${amount} food to ${petName}`);
        showMonitorNotification(`Fed ${amount} food to ${petName}!`, 'success');

        // Refresh UI
        renderPetFeedTab();
      } else {
        throw new Error(result.message || 'Feed failed');
      }

    } catch (e) {
      console.error('[PetFeed] Feed error:', e);
      PetFeedState.lastError = e.message;
      showMonitorNotification(`Failed to feed pet: ${e.message}`, 'error');
    } finally {
      PetFeedState.isFeeding = false;
    }
  }

  // ============================================
  // AUTO-FEED FOR SPECIFIC CHARACTER (Global Mode)
  // ============================================
  async function runAutoFeedForCharacter(charId) {
    const result = { fed: false, amount: 0, petName: null, error: null };

    try {
      // Load settings for this specific character (for food selection)
      // Note: We don't check settings.enabled here - the Global Mode cycle
      // already checks GlobalAutoState.characters[charId].autoFeed before calling this
      const settings = loadPetFeedSettingsForChar(charId);

      // Fetch character data
      const charData = await apiCall(`characters/${charId}/all-data`);
      if (!charData.success || !charData.data) {
        throw new Error('Failed to fetch character data');
      }

      const pet = charData.data.equippedPet;
      const inventory = charData.data.inventory?.items || [];

      if (!pet) {
        // No pet equipped, skip silently
        return result;
      }

      result.petName = pet.name || pet.pet_type || 'Pet';
      const currentFullness = pet.current_fullness || 0;

      // Only feed when fullness = 0
      if (currentFullness > 0) {
        return result;
      }

      // Find selected food in inventory
      const selectedFoodId = settings.selectedFoodItemId || 703;
      const foodItem = inventory.find(item => item.item_id === selectedFoodId);

      if (!foodItem || foodItem.quantity <= 0) {
        throw new Error('No food available');
      }

      // Calculate amount to feed
      const maxFullness = pet.max_fullness || 100;
      const fullnessNeeded = maxFullness - currentFullness;
      const fullnessPerUnit = PET_FOOD_ITEMS[selectedFoodId]?.fullnessPerUnit || 5;
      const unitsNeeded = Math.ceil(fullnessNeeded / fullnessPerUnit);
      const amount = Math.min(unitsNeeded, foodItem.quantity);

      if (amount <= 0) {
        return result;
      }

      // Feed the pet
      console.log(`[GlobalAuto] Feeding ${amount} food to ${result.petName} for character ${charId}`);
      const feedResult = await apiPost(`pets/${charId}/feed`, {
        foodInventoryId: foodItem.id,
        amount: amount
      });

      if (feedResult.success) {
        result.fed = true;
        result.amount = amount;
        console.log(`[GlobalAuto] Successfully fed ${amount} food to ${result.petName}`);
      } else {
        throw new Error(feedResult.message || 'Feed failed');
      }

    } catch (e) {
      console.error(`[GlobalAuto] Auto-feed error for ${charId}:`, e);
      result.error = e.message;
    }

    return result;
  }

  // ============================================
  // PET FEED TIMER CONTROL
  // ============================================
  function startAutoFeed() {
    // Don't start individual timer if global mode is active
    if (GlobalAutoState.timer) {
      console.log('[PetFeed] Skipping individual timer - global mode active');
      return;
    }

    // Don't start if token is not ready yet
    if (!TokenManager.isReady()) {
      console.log('[PetFeed] Token not ready, deferring timer start');
      return;
    }

    if (PetFeedState.checkIntervalId) {
      console.log('[PetFeed] Auto-feed already running');
      return;
    }

    console.log('[PetFeed] Starting auto-feed timer (interval: 1 min)');
    PetFeedState.enabled = true;
    savePetFeedSettings();

    // Initial check
    checkAndFeedPet();

    // Start interval
    PetFeedState.checkIntervalId = setInterval(() => {
      if (PetFeedState.enabled) {
        checkAndFeedPet();
      }
    }, PET_FEED_CHECK_INTERVAL);

    renderPetFeedTab();
  }

  function stopAutoFeed() {
    console.log('[PetFeed] Stopping auto-feed timer');

    if (PetFeedState.checkIntervalId) {
      clearInterval(PetFeedState.checkIntervalId);
      PetFeedState.checkIntervalId = null;
    }

    PetFeedState.enabled = false;
    savePetFeedSettings();
    renderPetFeedTab();
  }

  // Stop only the timer without changing the enabled state (used by Global Mode)
  function stopAutoFeedTimer() {
    if (PetFeedState.checkIntervalId) {
      clearInterval(PetFeedState.checkIntervalId);
      PetFeedState.checkIntervalId = null;
      console.log('[PetFeed] Timer stopped (config preserved)');
    }
  }

  // ============================================
  // PET FEED UI HANDLERS
  // ============================================
  async function handleFeedNow() {
    if (PetFeedState.isFeeding) {
      console.log('[PetFeed] Already feeding...');
      return;
    }

    if (!TokenManager.isReady()) {
      showMonitorNotification('Token not ready! Navigate in the game first.', 'error');
      return;
    }

    PetFeedState.isFeeding = true;
    renderPetFeedTab();

    try {
      // Fetch fresh data
      const data = await getPetAndInventoryData();
      if (!data) {
        throw new Error('Could not get character data');
      }

      if (!data.pet) {
        throw new Error('No pet equipped');
      }

      // Update cache
      PetFeedState.cachedPetData = data.pet;
      PetFeedState.cachedInventory = data.inventory;

      // Check if already full
      if (data.pet.current_fullness >= data.pet.max_fullness) {
        showMonitorNotification('Pet is already full!', 'info');
        PetFeedState.isFeeding = false;
        renderPetFeedTab();
        return;
      }

      // Find food
      const foodItem = findPetFoodInInventory(data.inventory, PetFeedState.selectedFoodItemId);
      if (!foodItem || foodItem.quantity <= 0) {
        throw new Error('No food available');
      }

      // Calculate and feed
      const amount = calculateFeedAmount(data.pet, foodItem);
      if (amount <= 0) {
        showMonitorNotification('Pet is already full!', 'info');
        PetFeedState.isFeeding = false;
        renderPetFeedTab();
        return;
      }

      await performFeed(data.characterId, foodItem.inventoryId, amount, data.pet.name);

    } catch (e) {
      console.error('[PetFeed] Manual feed error:', e);
      showMonitorNotification(`Feed failed: ${e.message}`, 'error');
      PetFeedState.isFeeding = false;
    }

    renderPetFeedTab();
  }

  function handleFoodSelect(itemId) {
    PetFeedState.selectedFoodItemId = parseInt(itemId);
    savePetFeedSettings();
    renderPetFeedTab();
  }

  function handleAutoFeedToggle() {
    if (PetFeedState.enabled) {
      stopAutoFeed();
    } else {
      startAutoFeed();
    }
  }

  // ============================================
  // PET FEED UI RENDER
  // ============================================
  function renderPetFeedTab() {
    const container = document.getElementById('pf-container');
    if (!container) return;

    const charId = getActiveCharacterId();
    const charInfo = getActiveCharacterInfo();
    const pet = PetFeedState.cachedPetData;
    const inventory = PetFeedState.cachedInventory || [];

    let html = '';

    // No character selected warning
    if (!charId) {
      html = `
        <div class="pf-no-pet">
          <div class="pf-no-pet-icon">&#128566;</div>
          <div class="pf-no-pet-text">No character selected</div>
          <div style="font-size: 0.75rem; color: #6b7280; margin-top: 8px;">
            Navigate in the game to select a character
          </div>
        </div>
      `;
      container.innerHTML = html;
      return;
    }

    // Token not ready warning
    if (!TokenManager.isReady()) {
      html = `
        <div class="pf-no-pet">
          <div class="pf-no-pet-icon">&#128274;</div>
          <div class="pf-no-pet-text">Token not captured</div>
          <div style="font-size: 0.75rem; color: #6b7280; margin-top: 8px;">
            Navigate in the game to capture the API token
          </div>
        </div>
      `;
      container.innerHTML = html;
      return;
    }

    // No pet equipped
    if (!pet) {
      html = `
        <div class="pf-no-pet">
          <div class="pf-no-pet-icon">&#128062;</div>
          <div class="pf-no-pet-text">No pet equipped</div>
          <div style="font-size: 0.75rem; color: #6b7280; margin-top: 8px;">
            ${charInfo?.name || 'Character'} doesn't have a pet equipped
          </div>
          <button class="pf-feed-btn" style="margin: 16px auto 0 auto; max-width: 200px;" onclick="window.pfRefreshData()">
            Refresh Data
          </button>
        </div>
      `;
      container.innerHTML = html;
      return;
    }

    // Pet Card
    const fullnessPercent = getFullnessPercent(pet);
    const fullnessClass = getFullnessClass(fullnessPercent);
    const rarityClass = (pet.rarity || 'common').toLowerCase();

    html += `
      <div class="pf-pet-card">
        <div class="pf-pet-header">
          <div class="pf-pet-icon">&#128062;</div>
          <div class="pf-pet-info">
            <div class="pf-pet-name">
              ${pet.name || pet.pet_type || 'Pet'}
              <span class="pf-pet-level">Lv.${pet.level || 1}</span>
            </div>
            <div class="pf-pet-rarity ${rarityClass}">${pet.rarity || 'Common'}</div>
          </div>
        </div>
        <div class="pf-fullness-section">
          <div class="pf-fullness-header">
            <span class="pf-fullness-label">Fullness</span>
            <span class="pf-fullness-value">${pet.current_fullness || 0}/${pet.max_fullness || 100} (${fullnessPercent}%)</span>
          </div>
          <div class="pf-fullness-bar">
            <div class="pf-fullness-fill ${fullnessClass}" style="width: ${fullnessPercent}%"></div>
          </div>
        </div>
      </div>
    `;

    // Food Card
    const foodItems = getAllPetFoodInInventory(inventory);
    const selectedFood = foodItems.find(f => f.itemId === PetFeedState.selectedFoodItemId);
    const hasFood = foodItems.length > 0;

    html += `<div class="pf-food-card">`;
    html += `<div class="pf-food-header">
      <span class="pf-food-title">&#127830; Food Selection</span>
    </div>`;

    if (!hasFood) {
      html += `
        <div class="pf-no-food-warning">
          <span>&#9888;</span>
          <span>No pet food in inventory</span>
        </div>
      `;
    } else {
      html += `
        <div class="pf-food-select-wrapper">
          <select class="pf-food-select" onchange="window.pfSelectFood(this.value)" ${PetFeedState.isFeeding ? 'disabled' : ''}>
            ${foodItems.map(food => `
              <option value="${food.itemId}" ${food.itemId === PetFeedState.selectedFoodItemId ? 'selected' : ''}>
                ${food.name} (x${food.quantity})
              </option>
            `).join('')}
          </select>
        </div>
        <div class="pf-food-stats">
          <div class="pf-food-stat">
            <span>Stock:</span>
            <span class="pf-food-stat-value">${selectedFood?.quantity || 0}</span>
          </div>
          <div class="pf-food-stat">
            <span>Fullness/unit:</span>
            <span class="pf-food-stat-value">+${selectedFood?.fullnessPerUnit || 5}</span>
          </div>
        </div>
      `;
    }

    // Session stats
    html += `
      <div class="pf-session-stats">
        <div class="pf-session-stat">
          <span class="pf-session-stat-label">Fed this session</span>
          <span class="pf-session-stat-value">${PetFeedState.totalFedThisSession}</span>
        </div>
        <div class="pf-session-stat">
          <span class="pf-session-stat-label">Last feed</span>
          <span class="pf-session-stat-value">${PetFeedState.lastFeedTime ? new Date(PetFeedState.lastFeedTime).toLocaleTimeString() : 'Never'}</span>
        </div>
      </div>
    `;

    html += `</div>`;

    // Auto-Feed Card
    // Only disable checkbox when trying to ENABLE auto-feed without food
    // Always allow disabling (unchecking) even when no food is available
    const autoFeedDisabled = !hasFood && !PetFeedState.enabled;
    html += `
      <div class="pf-autofeed-card">
        <div class="pf-autofeed-header">
          <span class="pf-autofeed-title">Auto-Feed</span>
          <label class="pf-toggle">
            <input type="checkbox" ${PetFeedState.enabled ? 'checked' : ''} onchange="window.pfToggleAutoFeed()" ${autoFeedDisabled ? 'disabled' : ''}>
            <span class="pf-toggle-slider"></span>
          </label>
        </div>
        <div class="pf-autofeed-desc">
          Automatically feeds pet when fullness reaches 0
        </div>
        <div class="pf-autofeed-status">
          <span class="pf-status-dot ${PetFeedState.enabled ? 'active' : 'inactive'}"></span>
          <span class="pf-status-text ${PetFeedState.enabled ? 'active' : ''}">
            ${PetFeedState.enabled ? 'Monitoring...' : 'Disabled'}
            ${PetFeedState.lastCheckTime ? ` (last check: ${new Date(PetFeedState.lastCheckTime).toLocaleTimeString()})` : ''}
          </span>
        </div>
      </div>
    `;

    // Global Mode Badge (if timer is running)
    if (GlobalAutoState.timer) {
      html += `
        <div style="margin-top: 12px; text-align: center;">
          <span class="gl-global-active-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
            </svg>
            Global Mode Active - Configure in Global tab
          </span>
        </div>
      `;
    } else {
      // Show indicator if this character has auto-feed enabled in Global tab (but global timer not running)
      const charGlobalConfig = charId ? getCharGlobalConfig(charId) : null;
      if (charGlobalConfig?.autoFeed) {
        html += `
          <div style="margin-top: 12px; text-align: center;">
            <span class="gl-global-active-badge" style="background: rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.3); color: #4ade80;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
              </svg>
              Enabled in Global Mode
            </span>
          </div>
        `;
      }
    }

    // Feed Now Button
    const isFull = fullnessPercent >= 100;
    const feedAmount = selectedFood ? calculateFeedAmount(pet, selectedFood) : 0;
    const btnDisabled = PetFeedState.isFeeding || !hasFood || isFull;
    const btnText = PetFeedState.isFeeding
      ? 'Feeding...'
      : isFull
        ? 'Already Full'
        : !hasFood
          ? 'No Food Available'
          : `Feed Now (${feedAmount} food)`;

    html += `
      <button class="pf-feed-btn ${PetFeedState.isFeeding ? 'loading' : ''}"
              onclick="window.pfFeedNow()"
              ${btnDisabled ? 'disabled' : ''}>
        &#127830; ${btnText}
      </button>
    `;

    if (!isFull && hasFood && feedAmount > 0) {
      const expectedFullness = Math.min(pet.max_fullness, (pet.current_fullness || 0) + (feedAmount * (selectedFood?.fullnessPerUnit || 5)));
      html += `
        <div class="pf-feed-hint">
          Will restore fullness to ${expectedFullness}/${pet.max_fullness}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // ============================================
  // GLOBAL TAB RENDER
  // ============================================
  function renderGlobalTab() {
    const container = document.getElementById('gl-container');
    if (!container) return;

    // Get all characters from the stored data
    const characters = (window.allCharactersData.charactersList || []).map(char => ({
      id: char.id,
      name: char.name || 'Unknown',
      pfp: char.pfp || window.allCharactersData.portraitImages?.[char.name] || null,
      level: char.level || 1
    }));

    // Check if characters have auto-sell config
    const getCharacterHasAutoSellConfig = (charId) => {
      const key = `degenIdle_autoSell_${charId}`;
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const config = JSON.parse(saved);
          return config.rules && Object.keys(config.rules).length > 0;
        }
      } catch (e) {}
      return false;
    };

    const isRunning = GlobalAutoState.isRunning;
    const hasTimer = GlobalAutoState.timer !== null;

    let html = `
      <div class="gl-header">
        <div class="gl-header-left">
          <div class="gl-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              <path d="M2 12h20"/>
            </svg>
            Global Auto Mode
          </div>
          <select class="gl-interval-select" id="gl-interval-select">
            ${GLOBAL_INTERVAL_OPTIONS.map(opt => `
              <option value="${opt.value}" ${GlobalAutoState.interval === opt.value ? 'selected' : ''}>${opt.label}</option>
            `).join('')}
          </select>
        </div>
        <button class="gl-start-btn ${hasTimer ? 'running' : ''}" id="gl-start-btn">
          ${hasTimer ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
            STOP
          ` : `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            START
          `}
        </button>
      </div>
    `;

    // Characters list
    if (characters.length === 0) {
      html += `
        <div style="text-align: center; padding: 32px; color: #6b7280;">
          <div style="font-size: 2rem; margin-bottom: 12px;">&#128566;</div>
          <div>No characters loaded</div>
          <div style="font-size: 0.75rem; margin-top: 8px;">Click the refresh button in the Chars tab first</div>
        </div>
      `;
    } else {
      html += `<div class="gl-characters-list">`;

      for (const char of characters) {
        const charConfig = getCharGlobalConfig(char.id);
        const hasAutoSellConfig = getCharacterHasAutoSellConfig(char.id);

        html += `
          <div class="gl-char-row" data-char-id="${char.id}">
            <div class="gl-char-info">
              <div class="gl-char-avatar">
                ${char.pfp ? `<img src="${char.pfp}" alt="${char.name}">` : char.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="gl-char-name">${char.name}</div>
                ${!hasAutoSellConfig ? `
                  <div class="gl-no-config-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    No sell config
                  </div>
                ` : ''}
              </div>
            </div>
            <div class="gl-char-toggles">
              <div class="gl-toggle-group">
                <span class="gl-toggle-label ${!hasAutoSellConfig ? 'disabled' : ''}">Sell</span>
                <label class="pf-toggle" style="transform: scale(0.85);">
                  <input type="checkbox" class="gl-char-sell-toggle" data-char-id="${char.id}" ${charConfig.autoSell ? 'checked' : ''} ${!hasAutoSellConfig ? 'disabled' : ''}>
                  <span class="pf-toggle-slider"></span>
                </label>
              </div>
              <button class="gl-config-btn" data-char-id="${char.id}" title="Configure Auto-Sell for ${char.name}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <div class="gl-toggle-group">
                <span class="gl-toggle-label">Feed</span>
                <label class="pf-toggle" style="transform: scale(0.85);">
                  <input type="checkbox" class="gl-char-feed-toggle" data-char-id="${char.id}" ${charConfig.autoFeed ? 'checked' : ''}>
                  <span class="pf-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        `;
      }

      html += `</div>`;
    }

    // Status bar
    if (hasTimer || GlobalAutoState.lastCycleTime) {
      html += `
        <div class="gl-status-bar ${hasTimer ? 'running' : ''}">
          ${isRunning ? `
            <div class="gl-status-running">
              <div class="gl-spinner"></div>
              Processing ${GlobalAutoState.currentCharacterName || '...'} (${GlobalAutoState.processedCount}/${GlobalAutoState.totalCount})
            </div>
          ` : ''}
          <div class="gl-status-row">
            <span class="gl-status-label">Status:</span>
            <span class="gl-status-value ${hasTimer ? 'success' : ''}">${hasTimer ? 'Running' : 'Stopped'}</span>
          </div>
          ${hasTimer && GlobalAutoState.nextCycleTime ? `
            <div class="gl-status-row" style="margin-top: 4px;">
              <span class="gl-status-label">Next cycle:</span>
              <span class="gl-status-value countdown" id="gl-countdown">${formatTimeRemaining(GlobalAutoState.nextCycleTime - Date.now())}</span>
            </div>
          ` : ''}
          ${GlobalAutoState.lastCycleTime ? `
            <div class="gl-status-row" style="margin-top: 4px;">
              <span class="gl-status-label">Last run:</span>
              <span class="gl-status-value">${new Date(GlobalAutoState.lastCycleTime).toLocaleTimeString()}</span>
            </div>
          ` : ''}
          ${GlobalAutoState.lastCycleResults.autoSell.itemsSold > 0 || GlobalAutoState.lastCycleResults.autoFeed.petsFed > 0 ? `
            <div class="gl-status-row" style="margin-top: 4px;">
              <span class="gl-status-label">Results:</span>
              <span class="gl-status-value success">
                ${GlobalAutoState.lastCycleResults.autoSell.itemsSold > 0 ? `${GlobalAutoState.lastCycleResults.autoSell.itemsSold} sold (+${GlobalAutoState.lastCycleResults.autoSell.goldGained}g)` : ''}
                ${GlobalAutoState.lastCycleResults.autoSell.itemsSold > 0 && GlobalAutoState.lastCycleResults.autoFeed.petsFed > 0 ? ' | ' : ''}
                ${GlobalAutoState.lastCycleResults.autoFeed.petsFed > 0 ? `${GlobalAutoState.lastCycleResults.autoFeed.petsFed} fed` : ''}
              </span>
            </div>
          ` : ''}
        </div>
      `;
    }

    container.innerHTML = html;

    // Attach event handlers
    attachGlobalTabEventHandlers();
  }

  function attachGlobalTabEventHandlers() {
    // Interval select
    const intervalSelect = document.getElementById('gl-interval-select');
    if (intervalSelect) {
      intervalSelect.addEventListener('change', (e) => {
        GlobalAutoState.interval = parseInt(e.target.value);
        saveGlobalAutoConfig();
        console.log(`[GlobalAuto] Interval changed to ${GlobalAutoState.interval}ms`);

        // If timer is running, restart with new interval
        if (GlobalAutoState.timer) {
          stopGlobalAutoMode();
          startGlobalAutoMode();
        }
      });
    }

    // Start/Stop button
    const startBtn = document.getElementById('gl-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', async () => {
        if (GlobalAutoState.timer) {
          stopGlobalAutoMode();
        } else {
          // Check if any character has auto enabled
          if (!hasAnyGlobalAutoEnabled()) {
            showMonitorNotification('Enable at least one toggle first', 'error', 3000);
            return;
          }
          await startGlobalAutoMode();
        }
        renderGlobalTab();
      });
    }

    // Character sell toggles
    document.querySelectorAll('.gl-char-sell-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const charId = e.target.dataset.charId;
        const currentConfig = getCharGlobalConfig(charId);
        setCharGlobalConfig(charId, e.target.checked, currentConfig.autoFeed);
        console.log(`[GlobalAuto] ${charId} autoSell: ${e.target.checked}`);
      });
    });

    // Character feed toggles
    document.querySelectorAll('.gl-char-feed-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const charId = e.target.dataset.charId;
        const currentConfig = getCharGlobalConfig(charId);
        setCharGlobalConfig(charId, currentConfig.autoSell, e.target.checked);
        console.log(`[GlobalAuto] ${charId} autoFeed: ${e.target.checked}`);
      });
    });

    // Config buttons (switch character and open auto-sell panel)
    document.querySelectorAll('.gl-config-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const charId = e.currentTarget.dataset.charId;
        await switchCharacterAndOpenConfig(charId);
      });
    });
  }

  // Switch character by clicking navbar portrait and open auto-sell config panel
  async function switchCharacterAndOpenConfig(charId) {
    const currentCharId = getActiveCharacterId();

    if (currentCharId !== charId) {
      // Get character name from our map
      const charInfo = window.allCharactersData.charactersMap[charId];
      if (!charInfo) {
        showMonitorNotification('Character not found in data. Try refreshing first.', 'error', 3000);
        return;
      }

      const charName = charInfo.name;

      // Find the portrait button in navbar by character name (img alt attribute)
      const navbarContainer = document.querySelector('.w-\\[50px\\].bg-\\[\\#0B0E14\\]');
      if (!navbarContainer) {
        showMonitorNotification(`Please switch to ${charName} manually using the navbar.`, 'info', 4000);
        return;
      }

      const portraitImg = navbarContainer.querySelector(`img[alt="${charName}"]`);
      if (!portraitImg) {
        showMonitorNotification(`Portrait for ${charName} not found. Please switch manually.`, 'info', 4000);
        return;
      }

      const portraitButton = portraitImg.closest('button');
      if (!portraitButton) {
        showMonitorNotification(`Please switch to ${charName} manually using the navbar.`, 'info', 4000);
        return;
      }

      // Click the portrait to switch character
      showMonitorNotification(`Switching to ${charName}...`, 'info', 2000);
      portraitButton.click();

      // Wait for the game to update (poll until localStorage changes or timeout)
      const maxWait = 2000;
      const startTime = Date.now();
      let switched = false;

      while (Date.now() - startTime < maxWait) {
        await sleep(100);
        if (getActiveCharacterId() === charId) {
          switched = true;
          break;
        }
      }

      if (!switched) {
        showMonitorNotification(`Switch to ${charName} may have failed. Please try again.`, 'error', 3000);
        return;
      }

      showMonitorNotification(`Switched to ${charName}!`, 'success', 1500);
    }

    // Open auto-sell panel
    showAutoSellPanel();
  }

  // Start countdown update timer for Global tab
  function startGlobalTabCountdown() {
    setInterval(() => {
      const countdownEl = document.getElementById('gl-countdown');
      if (countdownEl && GlobalAutoState.nextCycleTime) {
        const remaining = GlobalAutoState.nextCycleTime - Date.now();
        countdownEl.textContent = formatTimeRemaining(remaining);
      }
    }, 1000);
  }

  // ============================================
  // PET FEED CHARACTER WATCHER
  // ============================================
  function initPetFeedCharacterWatcher() {
    let lastCharacterId = getActiveCharacterId();

    setInterval(() => {
      const currentCharacterId = getActiveCharacterId();

      if (currentCharacterId && currentCharacterId !== lastCharacterId) {
        console.log(`[PetFeed] Character changed: ${lastCharacterId} -> ${currentCharacterId}`);
        lastCharacterId = currentCharacterId;

        // Clear cached data
        PetFeedState.cachedPetData = null;
        PetFeedState.cachedInventory = null;
        PetFeedState.lastError = null;

        // Stop current auto-feed timer if running
        if (PetFeedState.checkIntervalId) {
          clearInterval(PetFeedState.checkIntervalId);
          PetFeedState.checkIntervalId = null;
          console.log('[PetFeed] Stopped auto-feed timer for old character');
        }

        // Load settings for new character
        loadPetFeedSettings();

        // Restart auto-feed if enabled for this character
        if (PetFeedState.enabled && TokenManager.isReady()) {
          console.log('[PetFeed] Auto-feed enabled for new character, starting...');
          startAutoFeed();
        }

        // Check if Pet tab is currently active
        const petTabActive = document.querySelector('.mc-tab[data-tab="petfeed"]')?.classList.contains('active');

        // Refresh data if token ready
        if (TokenManager.isReady()) {
          if (petTabActive) {
            // If tab is active, refresh data immediately
            window.pfRefreshData();
          } else {
            // Just re-render to show new character's settings
            renderPetFeedTab();
          }
        } else {
          renderPetFeedTab();
        }
      }
    }, 1500); // Check every 1.5 seconds

    console.log('[PetFeed] Character watcher started');
  }

  // ============================================
  // PET FEED INITIALIZATION
  // ============================================
  function initPetFeedWatcher() {
    // Load saved settings
    loadPetFeedSettings();

    // Start character watcher
    initPetFeedCharacterWatcher();

    // If auto-feed was enabled, restart it
    if (PetFeedState.enabled) {
      console.log('[PetFeed] Auto-feed was enabled, restarting...');
      // Wait a bit for token to be ready
      setTimeout(() => {
        if (TokenManager.isReady()) {
          startAutoFeed();
        } else {
          // Register callback to start when token is ready
          TokenManager.registerCallback(() => {
            if (PetFeedState.enabled && !PetFeedState.checkIntervalId) {
              startAutoFeed();
            }
          });
        }
      }, 1000);
    }

    console.log('[PetFeed] Watcher initialized');
  }

  // ============================================
  // PET FEED GLOBAL FUNCTIONS
  // ============================================
  window.pfFeedNow = function() {
    handleFeedNow();
  };

  window.pfSelectFood = function(itemId) {
    handleFoodSelect(itemId);
  };

  window.pfToggleAutoFeed = function() {
    handleAutoFeedToggle();
  };

  window.pfRefreshData = async function() {
    if (!TokenManager.isReady()) {
      showMonitorNotification('Token not ready!', 'error');
      return;
    }

    const data = await getPetAndInventoryData();
    if (data) {
      PetFeedState.cachedPetData = data.pet;
      PetFeedState.cachedInventory = data.inventory;
      renderPetFeedTab();
      showMonitorNotification('Pet data refreshed!', 'success');
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 8: MARKET AFFIX FILTER MODULE
  // ════════════════════════════════════════════════════════════════════════════

  // ============================================
  // MARKET FILTER CONSTANTS
  // ============================================
  const MARKET_FILTER_STORAGE_KEY = 'degenIdle_marketFilter';

  // Priority affixes (shown first in dropdown)
  const PRIORITY_AFFIXES = [
    'health_on_hit', 'health_on_crit', 'crit_chance', 'crit_damage', 'resource_efficiency'
  ];

  // Short names for compact display
  const AFFIX_SHORT_NAMES = {
    'crit_chance': 'crit%',
    'crit_damage': 'critD',
    'max_health': 'HP',
    'max_energy': 'EN',
    'health_on_hit': 'HoH',
    'health_on_crit': 'HoC',
    'energy_on_hit': 'EoH',
    'energy_on_crit': 'EoC',
    'energy_on_dodge': 'EoD',
    'health_on_dodge': 'HoD',
    'health_on_block': 'HoB',
    'energy_on_block': 'EoB',
    'defense_penetration': 'pen',
    'resource_efficiency': 'res%',
    'damage_reflect': 'refl',
    'attack_power': 'atk',
    'attack_speed': 'spd',
    'defense': 'def',
    'dodge': 'dodge',
    'block_chance': 'blk%',
    'perfect_block': 'pBlk',
    'combat_exp': 'cXP',
    'pet_exp': 'pXP',
    'drop_chance': 'drop',
    'gold_find': 'gold'
  };

  // ============================================
  // MARKET FILTER STATE
  // ============================================
  const MarketFilterState = {
    currentItemId: null,
    currentData: null,
    activeFilter: null,
    searchQuery: '',
    showOnlyWithAffixes: false,
    isInjected: false,
    observer: null
  };

  // ============================================
  // MARKET FILTER UTILITY FUNCTIONS
  // ============================================
  function formatAffixShort(affix, value) {
    const shortName = AFFIX_SHORT_NAMES[affix] || affix.replace(/_/g, ' ').substring(0, 8);
    // Format value: most are displayed with + sign
    const formattedValue = typeof value === 'number' ? `+${value.toFixed(2)}` : value;
    return `${shortName} ${formattedValue}`;
  }

  function formatAffixName(affix) {
    return affix.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  function getSortedAffixes() {
    // Get all known affixes, priority ones first
    const allAffixes = [...KNOWN_AFFIXES];
    const sorted = [];

    // Add priority affixes first
    for (const affix of PRIORITY_AFFIXES) {
      if (allAffixes.includes(affix)) {
        sorted.push(affix);
      }
    }

    // Add remaining affixes sorted alphabetically
    const remaining = allAffixes.filter(a => !PRIORITY_AFFIXES.includes(a)).sort();
    sorted.push(...remaining);

    return sorted;
  }

  // ============================================
  // MARKET FILTER PERSISTENCE
  // ============================================
  function saveMarketFilterPrefs() {
    try {
      const prefs = {
        activeFilter: MarketFilterState.activeFilter,
        showOnlyWithAffixes: MarketFilterState.showOnlyWithAffixes
      };
      localStorage.setItem(MARKET_FILTER_STORAGE_KEY, JSON.stringify(prefs));
      debugLog('[MarketFilter] Prefs saved:', prefs);
    } catch (e) {
      console.error('[MarketFilter] Error saving prefs:', e);
    }
  }

  function loadMarketFilterPrefs() {
    try {
      const saved = localStorage.getItem(MARKET_FILTER_STORAGE_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        MarketFilterState.activeFilter = prefs.activeFilter || null;
        MarketFilterState.showOnlyWithAffixes = prefs.showOnlyWithAffixes || false;
        debugLog('[MarketFilter] Prefs loaded:', prefs);
      }
    } catch (e) {
      console.error('[MarketFilter] Error loading prefs:', e);
    }
  }

  function resetMarketFilter() {
    MarketFilterState.activeFilter = null;
    MarketFilterState.searchQuery = '';
    MarketFilterState.showOnlyWithAffixes = false;
    localStorage.removeItem(MARKET_FILTER_STORAGE_KEY);

    // Update UI if injected
    const dropdown = document.getElementById('dg-mf-dropdown');
    const searchInput = document.getElementById('dg-mf-search');
    const checkbox = document.getElementById('dg-mf-only-affixes');

    if (dropdown) dropdown.value = '';
    if (searchInput) searchInput.value = '';
    if (checkbox) checkbox.checked = false;

    applyMarketFilter();
    console.log('[MarketFilter] Filter reset');
  }

  // ============================================
  // MARKET API RESPONSE HANDLER
  // ============================================
  function handleMarketApiResponse(url, data) {
    // Extract item_id from URL: /market/items/94/market
    const match = url.match(/\/market\/items\/(\d+)\/market/);
    if (!match) return;

    const itemId = parseInt(match[1]);
    debugLog('[MarketFilter] Market API response for item:', itemId);

    // Check if this is a different item - if so, clean up old UI elements
    const isNewItem = MarketFilterState.currentItemId !== itemId;
    if (isNewItem) {
      debugLog('[MarketFilter] Switching to new item, cleaning up...');
      // Remove old affix details
      document.querySelectorAll('.dg-mf-affix-details').forEach(el => el.remove());
      // Remove old filter container so it gets recreated with fresh data
      const oldContainer = document.getElementById('dg-mf-container');
      if (oldContainer) oldContainer.remove();
      MarketFilterState.isInjected = false;
    }

    MarketFilterState.currentItemId = itemId;
    MarketFilterState.currentData = data;

    // Wait for DOM to update, then inject UI
    setTimeout(() => {
      injectMarketFilterUI();
    }, 150);
  }

  // ============================================
  // MARKET FILTER UI INJECTION
  // ============================================
  function injectMarketFilterUI() {
    // Check if we're on a market item page
    const sellOrdersHeader = document.querySelector('h4.text-green-400');
    if (!sellOrdersHeader || !sellOrdersHeader.textContent.includes('Purchase Now')) {
      debugLog('[MarketFilter] Not on sell orders page, skipping injection');
      return;
    }

    // Check if already injected
    if (document.getElementById('dg-mf-container')) {
      debugLog('[MarketFilter] Already injected, updating display');
      updateMarketAffixDisplay();
      applyMarketFilter();
      return;
    }

    debugLog('[MarketFilter] Injecting filter UI...');

    // Find the header row (Price | Quantity | Affix | Rarity)
    const headerRow = document.querySelector('.space-y-3 > div.flex.gap-4.text-xs.text-gray-400');
    if (!headerRow) {
      debugLog('[MarketFilter] Header row not found');
      return;
    }

    // Create the filter container
    const filterContainer = document.createElement('div');
    filterContainer.id = 'dg-mf-container';
    filterContainer.className = 'dg-mf-container';

    // Build dropdown options
    const affixes = getSortedAffixes();
    const dropdownOptions = affixes.map(affix => {
      const isPriority = PRIORITY_AFFIXES.includes(affix);
      return `<option value="${affix}" ${isPriority ? 'style="font-weight: 500;"' : ''}>${formatAffixName(affix)}</option>`;
    }).join('');

    filterContainer.innerHTML = `
      <div class="dg-mf-row">
        <span class="dg-mf-label">Filter:</span>
        <select id="dg-mf-dropdown" class="dg-mf-select">
          <option value="">All affixes</option>
          <optgroup label="Popular">
            ${PRIORITY_AFFIXES.map(a => `<option value="${a}">${formatAffixName(a)}</option>`).join('')}
          </optgroup>
          <optgroup label="All Affixes">
            ${affixes.filter(a => !PRIORITY_AFFIXES.includes(a)).map(a => `<option value="${a}">${formatAffixName(a)}</option>`).join('')}
          </optgroup>
        </select>
        <input type="text" id="dg-mf-search" class="dg-mf-input" placeholder="Search affix...">
        <button id="dg-mf-reset" class="dg-mf-reset-btn" title="Reset filter">Reset</button>
      </div>
      <div class="dg-mf-row">
        <label class="dg-mf-checkbox">
          <input type="checkbox" id="dg-mf-only-affixes">
          <span>Only show items with affixes</span>
        </label>
        <span id="dg-mf-count" class="dg-mf-count"></span>
      </div>
    `;

    // Insert before the header row
    headerRow.parentNode.insertBefore(filterContainer, headerRow);

    // Apply saved preferences
    const dropdown = document.getElementById('dg-mf-dropdown');
    const searchInput = document.getElementById('dg-mf-search');
    const checkbox = document.getElementById('dg-mf-only-affixes');

    if (MarketFilterState.activeFilter && dropdown) {
      dropdown.value = MarketFilterState.activeFilter;
    }
    if (MarketFilterState.showOnlyWithAffixes && checkbox) {
      checkbox.checked = true;
    }

    // Attach event listeners
    dropdown.addEventListener('change', (e) => {
      MarketFilterState.activeFilter = e.target.value || null;
      MarketFilterState.searchQuery = ''; // Clear search when using dropdown
      searchInput.value = '';
      saveMarketFilterPrefs();
      applyMarketFilter();
    });

    searchInput.addEventListener('input', (e) => {
      MarketFilterState.searchQuery = e.target.value.toLowerCase();
      MarketFilterState.activeFilter = null; // Clear dropdown when using search
      dropdown.value = '';
      applyMarketFilter();
    });

    checkbox.addEventListener('change', (e) => {
      MarketFilterState.showOnlyWithAffixes = e.target.checked;
      saveMarketFilterPrefs();
      applyMarketFilter();
    });

    document.getElementById('dg-mf-reset').addEventListener('click', resetMarketFilter);

    MarketFilterState.isInjected = true;

    // Update display and apply filter
    updateMarketAffixDisplay();
    applyMarketFilter();

    console.log('[MarketFilter] UI injected successfully');
  }

  // ============================================
  // MARKET AFFIX DISPLAY (Sub-rows)
  // ============================================
  function updateMarketAffixDisplay() {
    const data = MarketFilterState.currentData;
    if (!data || !data.sell_orders) return;

    debugLog('[MarketFilter] Updating affix display for', data.sell_orders.length, 'orders');

    // IMPORTANT: Remove ALL existing affix detail rows first to prevent accumulation
    document.querySelectorAll('.dg-mf-affix-details').forEach(el => el.remove());

    // Also clear any data-affixes attributes from old rows
    document.querySelectorAll('[data-affixes]').forEach(el => {
      delete el.dataset.affixes;
      delete el.dataset.orderIndex;
    });

    // Find all order rows (skip the header row)
    const container = document.querySelector('.space-y-3');
    if (!container) return;

    const rows = container.querySelectorAll(':scope > div.flex.gap-4.items-center');

    rows.forEach((row, index) => {
      // Skip if we don't have data for this index
      if (index >= data.sell_orders.length) return;

      const order = data.sell_orders[index];
      const affixStats = order.affix_stats || {};
      const affixKeys = Object.keys(affixStats);

      // Remove existing affix details row if any
      const existingDetails = row.nextElementSibling;
      if (existingDetails && existingDetails.classList.contains('dg-mf-affix-details')) {
        existingDetails.remove();
      }

      // Only add details row if there are affixes
      if (affixKeys.length === 0) return;

      // Store affix data on the row for filtering
      row.dataset.affixes = affixKeys.join(',');
      row.dataset.orderIndex = index;

      // Create the affix details row
      const detailsRow = document.createElement('div');
      detailsRow.className = 'dg-mf-affix-details';
      detailsRow.dataset.orderIndex = index;

      // Add affix tags
      detailsRow.innerHTML = affixKeys.map(affix => {
        const value = affixStats[affix];
        return `<span class="dg-mf-affix-tag" data-affix="${affix}">${formatAffixShort(affix, value)}</span>`;
      }).join('');

      // Insert after the order row
      row.parentNode.insertBefore(detailsRow, row.nextSibling);
    });
  }

  // ============================================
  // MARKET FILTER APPLICATION
  // ============================================
  function applyMarketFilter() {
    const data = MarketFilterState.currentData;
    if (!data || !data.sell_orders) return;

    const filter = MarketFilterState.activeFilter;
    const search = MarketFilterState.searchQuery;
    const onlyAffixes = MarketFilterState.showOnlyWithAffixes;

    debugLog('[MarketFilter] Applying filter:', { filter, search, onlyAffixes });

    // Find all order rows
    const container = document.querySelector('.space-y-3');
    if (!container) return;

    const rows = container.querySelectorAll(':scope > div.flex.gap-4.items-center');
    let visibleCount = 0;
    const totalCount = data.sell_orders.length;

    rows.forEach((row, index) => {
      if (index >= data.sell_orders.length) return;

      const order = data.sell_orders[index];
      const affixStats = order.affix_stats || {};
      const affixKeys = Object.keys(affixStats);
      const hasAffixes = affixKeys.length > 0;

      let shouldShow = true;

      // Filter: only affixes
      if (onlyAffixes && !hasAffixes) {
        shouldShow = false;
      }

      // Filter: dropdown selection
      if (shouldShow && filter && !affixKeys.includes(filter)) {
        shouldShow = false;
      }

      // Filter: search query
      if (shouldShow && search) {
        const matchesSearch = affixKeys.some(a => a.includes(search) || formatAffixName(a).toLowerCase().includes(search));
        if (!matchesSearch) {
          shouldShow = false;
        }
      }

      // Apply visibility
      if (shouldShow) {
        row.classList.remove('dg-mf-hidden');
        visibleCount++;
      } else {
        row.classList.add('dg-mf-hidden');
      }

      // Also hide/show the details row
      const detailsRow = row.nextElementSibling;
      if (detailsRow && detailsRow.classList.contains('dg-mf-affix-details')) {
        if (shouldShow) {
          detailsRow.classList.remove('dg-mf-hidden');

          // Highlight matching affix tags
          detailsRow.querySelectorAll('.dg-mf-affix-tag').forEach(tag => {
            const tagAffix = tag.dataset.affix;
            const isMatch = (filter && tagAffix === filter) ||
                            (search && (tagAffix.includes(search) || formatAffixName(tagAffix).toLowerCase().includes(search)));
            tag.classList.toggle('matched', isMatch);
          });
        } else {
          detailsRow.classList.add('dg-mf-hidden');
        }
      }
    });

    // Update count
    const countEl = document.getElementById('dg-mf-count');
    if (countEl) {
      const hasFilter = filter || search || onlyAffixes;
      countEl.textContent = hasFilter ? `${visibleCount}/${totalCount} orders` : `${totalCount} orders`;
      countEl.classList.toggle('dg-mf-filter-active', hasFilter && visibleCount < totalCount);
    }
  }

  // ============================================
  // MARKET FILTER OBSERVER (for SPA navigation)
  // ============================================
  function initMarketFilterObserver() {
    // Disconnect existing observer if any
    if (MarketFilterState.observer) {
      MarketFilterState.observer.disconnect();
    }

    // Create observer to detect when market page changes
    MarketFilterState.observer = new MutationObserver((mutations) => {
      // Check if we're on a market sell orders page
      const sellOrdersHeader = document.querySelector('h4.text-green-400');
      const isOnMarketPage = sellOrdersHeader && sellOrdersHeader.textContent.includes('Purchase Now');

      if (isOnMarketPage && MarketFilterState.currentData) {
        // Check if our UI is still there
        if (!document.getElementById('dg-mf-container')) {
          debugLog('[MarketFilter] UI disappeared, re-injecting...');
          MarketFilterState.isInjected = false;
          setTimeout(() => injectMarketFilterUI(), 100);
        }
      } else if (!isOnMarketPage) {
        MarketFilterState.isInjected = false;
      }
    });

    // Observe the main content area
    MarketFilterState.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    debugLog('[MarketFilter] Observer initialized');
  }

  // ============================================
  // MARKET FILTER GLOBAL FUNCTIONS
  // ============================================
  window.resetMarketFilter = resetMarketFilter;

  window.setMarketFilter = function(affix) {
    MarketFilterState.activeFilter = affix;
    MarketFilterState.searchQuery = '';
    saveMarketFilterPrefs();

    const dropdown = document.getElementById('dg-mf-dropdown');
    const searchInput = document.getElementById('dg-mf-search');

    if (dropdown) dropdown.value = affix || '';
    if (searchInput) searchInput.value = '';

    applyMarketFilter();
    console.log('[MarketFilter] Filter set to:', affix);
  };

  window.getMarketAffixes = function() {
    const data = MarketFilterState.currentData;
    if (!data || !data.sell_orders) {
      console.log('[MarketFilter] No market data available');
      return null;
    }

    // Collect all unique affixes from current market
    const affixCounts = {};
    data.sell_orders.forEach(order => {
      if (order.affix_stats) {
        Object.keys(order.affix_stats).forEach(affix => {
          affixCounts[affix] = (affixCounts[affix] || 0) + 1;
        });
      }
    });

    console.log('[MarketFilter] Affixes in current market:');
    Object.entries(affixCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([affix, count]) => {
        console.log(`   ${formatAffixName(affix)}: ${count} orders`);
      });

    return affixCounts;
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 9: INITIALIZATION
  // ════════════════════════════════════════════════════════════════════════════

  debugLog('Starting initialization...');

  // Register callbacks for both modules when token is captured
  TokenManager.registerCallback(async () => {
    debugLog('[onTokenCaptured] Character Monitor callback triggered!');
    // Auto-load character names (will wait for portraits in DOM)
    if (Object.keys(window.allCharactersData.charactersMap).length === 0) {
      console.log('[Monitor] Starting auto-load of character data...');
      await loadCharacterNames(true); // true = wait for DOM
      console.log('[Monitor] Auto-load complete!');
    } else {
      debugLog('[onTokenCaptured] Characters map already populated, skipping auto-load');
    }
  });

  TokenManager.registerCallback(async () => {
    debugLog('[onTokenCaptured] World Boss callback triggered!');
    setTimeout(async () => {
      await loadWBData();
    }, 500);
  });

  // Global Auto Mode callback - start if enabled
  TokenManager.registerCallback(async () => {
    debugLog('[onTokenCaptured] Global Auto Mode callback triggered!');
    // Load saved config
    loadGlobalAutoConfig();

    // If global mode was active (user clicked START), restart it after page load
    // Only restart if isActive is true AND at least one character has toggles enabled
    if (GlobalAutoState.isActive && hasAnyGlobalAutoEnabled()) {
      console.log('[GlobalAuto] Global mode was active, will start after character data loads...');
      setTimeout(async () => {
        if (window.allCharactersData.charactersList?.length > 0) {
          console.log('[GlobalAuto] Starting global auto mode...');
          await startGlobalAutoMode();
        } else {
          console.log('[GlobalAuto] Waiting for character data to load...');
          // Try again after another delay
          setTimeout(async () => {
            if (GlobalAutoState.isActive && hasAnyGlobalAutoEnabled()) {
              await startGlobalAutoMode();
            }
          }, 3000);
        }
      }, 2000);
    }
  });

  debugLog('TokenManager callbacks registered');

  // Create UIs after page loads
  setTimeout(() => {
    debugLog('setTimeout callback executing (500ms delay passed)');

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('DegenIdle Toolkit v5.6 Loaded!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('DEBUG_MODE:', DEBUG_MODE ? 'ENABLED - verbose logs active' : 'DISABLED');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Commands:');
    console.log('   - checkToken()                        : Check if token is captured');
    console.log('   - diagnoseMonitor()                   : Full diagnostic report (for debugging)');
    console.log('   - exportCredentials()                 : Export token & character IDs for CLI');
    console.log('   - loadCharacterNames()                : Load character names and pfp');
    console.log('   - refreshAllCharacters()              : Fetch all character data via API');
    console.log('   - restartTask(id, charId, name)       : Restart a specific task');
    console.log('   - restartAllTasks()                   : Restart all active tasks');
    console.log('   - restartCombat(charId, locId, name)  : Restart a specific combat');
    console.log('   - restartAllCombats()                 : Restart all active combats');
    console.log('   - showAllCharacters()                 : Display summary in console');
    console.log('   - wbJoinChar(charId, charName)        : Join WB queue for one character');
    console.log('   - wbJoinAll()                         : Join WB queue for all characters');
    console.log('   - startGuildDonations()               : Start guild donations for all characters');
    console.log('   - resetMarketFilter()                 : Reset market affix filter');
    console.log('   - setMarketFilter(affix)              : Set market filter (e.g. "crit_chance")');
    console.log('   - getMarketAffixes()                  : Show affixes in current market');
    console.log('Access raw data via: window.allCharactersData');
    console.log('\nUI Panels:');
    console.log('   - Character Monitor: Bottom-right button (portrait icon)');
    console.log('     - Tab: Chars - View and manage all characters');
    console.log('     - Tab: Donate - Donate to guild for all characters');
    console.log('     - Tab: Sell - Auto-sell equipment by rarity');
    console.log('     - Tab: Combat - Join any combat zone directly (test feature)');
    console.log('     - Tab: Pet - Auto-feed pet when fullness reaches 0');
    console.log('   - World Boss Queue: Above Character Monitor (boss image or checkmark icon)');
    console.log('   - DPS Overlay: Bottom-left (auto-shown during combat on mobile)');
    console.log('   - World Boss DPS: Bottom-left (auto-shown during WB/Guild Boss)');
    console.log('   - Market Affix Filter: Auto-injected on market item pages');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Waiting for token to be captured...');
    console.log('Navigate in the game (click on a skill, change character, etc.)');
    console.log('═══════════════════════════════════════════════════════');
    console.log('TROUBLESHOOTING:');
    console.log('   1. Make sure Tampermonkey is enabled');
    console.log('   2. Try refreshing the page (Ctrl+F5)');
    console.log('   3. Navigate in the game to trigger API calls');
    console.log('   4. Check for [DEBUG] logs above - they show API interception');
    console.log('   5. Run checkToken() to see current token status');
    console.log('═══════════════════════════════════════════════════════\n');

    // Create UIs
    debugLog('Creating Monitor UI...');
    createMonitorUI();
    debugLog('Monitor UI created');

    debugLog('Creating World Boss UI...');
    createWBUI();
    debugLog('World Boss UI created');

    // Start DPS intervals
    debugLog('Starting DPS intervals...');
    setInterval(injectDPS, 250);
    setInterval(updateDPSOverlay, 500);
    setInterval(updateWBDPSOverlay, 500);
    debugLog('DPS intervals started');

    // Initialize Market Affix Filter
    debugLog('Initializing Market Affix Filter...');
    loadMarketFilterPrefs();
    initMarketFilterObserver();
    debugLog('Market Affix Filter initialized');

    // Check current token status
    debugLog('Current token status:', TokenManager.isReady() ? 'READY' : 'NOT READY');

    // If token is already captured (unlikely but possible), load immediately
    if (TokenManager.isReady()) {
      console.log('[AutoLoad] Token already ready, loading now...');
      if (Object.keys(window.allCharactersData.charactersMap).length === 0) {
        loadCharacterNames(true);
      }
      loadWBData();
    }

    // Periodic check to help debug (only in debug mode)
    if (DEBUG_MODE) {
      let checkCount = 0;
      const debugInterval = setInterval(() => {
        checkCount++;
        if (TokenManager.isReady()) {
          console.log(`[DEBUG] Token is captured after ${checkCount * 5}s`);
          clearInterval(debugInterval);
        } else if (checkCount <= 6) { // Check for 30 seconds
          console.log(`[DEBUG] Still waiting for token... (${checkCount * 5}s elapsed)`);
          console.log(`[DEBUG] Navigate in the game to trigger API calls`);
        } else {
          console.log(`[DEBUG] Token not captured after 30s. Possible issues:`);
          console.log(`[DEBUG]    - Game might use a different API method`);
          console.log(`[DEBUG]    - Script might have loaded after game initialized`);
          console.log(`[DEBUG]    - Try refreshing the page with Ctrl+Shift+R`);
          clearInterval(debugInterval);
        }
      }, 5000);
    }
  }, 500);

  console.log('[DegenIdle] Toolkit v6.0 - DPS Display + Guild Donations + Auto-Sell + Combat Join + Global Auto Mode + Market Affix Filter integrated');

})();
