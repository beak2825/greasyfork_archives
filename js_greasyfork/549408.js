// ==UserScript==
// @name         Google AI Mode Auto Switcher
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically decide whether a Google search query should open in AI mode by adding udm=50, or stay as normal search, based on URL query analysis (script detection + rule-based scoring). Toggle UI retained. Force modes: ? = Google search, ! = AI mode.
// @author       djshigel
// @match        https://www.google.com/*
// @match        https://www.google.co.jp/*
// @match        https://www.google.*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549408/Google%20AI%20Mode%20Auto%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/549408/Google%20AI%20Mode%20Auto%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const sessionKey = 'gm_ai_auto_redirect_flag';
    const STORAGE_KEY_ENABLED = 'gm_ai_auto_enabled_v0_5';
    const FORCE_NAV_BLOCK_DURATION_MS = 5000; // Block redirects for 5 seconds after "?" query
    const FORCE_NAV_TIMESTAMP_KEY = 'gm_ai_force_nav_timestamp';

    // Auto tooltip timing (per request)
    const AUTO_TOOLTIP_DELAY_MS = 1000; // wait 1s before auto tooltip flow
    const AUTO_TOOLTIP_SHOW_MS = 2000;  // show message for 2s
    const AUTO_TOOLTIP_RESTORE_DELAY_MS = 0; // Immediately after restoring tip, return to non-hover

    // -----------------------------
    // Simple hash function for session keys (handles multi-byte characters)
    // -----------------------------
    function simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(36);
    }

    // -----------------------------
    // Storage helpers (use GM_getValue/GM_setValue when available)
    // -----------------------------
    function setStorageEnabled(v) {
      try {
        if (typeof GM_setValue === 'function') {
          GM_setValue(STORAGE_KEY_ENABLED, v ? '1' : '0');
          return;
        }
      } catch (e) { /* ignore */ }
      try { localStorage.setItem(STORAGE_KEY_ENABLED, v ? '1' : '0'); } catch (e) {}
    }

    function getStorageEnabled() {
      try {
        if (typeof GM_getValue === 'function') {
          const val = GM_getValue(STORAGE_KEY_ENABLED, '0');
          return val === '1';
        }
      } catch (e) { /* ignore */ }
      try { return localStorage.getItem(STORAGE_KEY_ENABLED) === '1'; } catch (e) { return false; }
    }

    // -----------------------------
    // Mobile detection
    // -----------------------------
    function isMobile() {
      return navigator.userAgent.includes('Mobile');
    }

    // -----------------------------
    // Navigation type detection
    // -----------------------------
    function getNavigationType() {
      try {
        // Modern way using Navigation Timing API
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries && perfEntries.length > 0) {
          const navEntry = perfEntries[0];
          // type: 'navigate', 'reload', 'back_forward', 'prerender'
          return navEntry.type;
        }
      } catch (e) { /* ignore */ }

      // Fallback: check performance.navigation (deprecated but still works)
      try {
        if (performance.navigation) {
          // 0: TYPE_NAVIGATE, 1: TYPE_RELOAD, 2: TYPE_BACK_FORWARD
          switch (performance.navigation.type) {
            case 0: return 'navigate';
            case 1: return 'reload';
            case 2: return 'back_forward';
            default: return 'navigate';
          }
        }
      } catch (e) { /* ignore */ }

      return 'navigate'; // default fallback
    }

    // -----------------------------
    // Decision logic (Score-based)
    // Scoring elements:
    // - Average token length × weight
    // - Token count × weight
    // - Question marks (+30 points)
    // - Japanese particles (+10 points)
    // - Sentence ending patterns (+10 points)
    // - Too short penalty (-20 points)
    // Threshold: Score >= 30 = AI mode
    //
    // Examples:
    // "ごちうさ op 2期 歌詞" → score < 60 → nav (short keywords)
    // "北海道でのクワガタの捕まえ方教えて" → score 60+ → ai (sentence)
    // "Python エラー解決" → score 15 → nav (short keywords)
    // "Pythonでファイルが読み込めないエラーを解決する方法について" → ai (long sentence)
    // -----------------------------

    function decideModeByQuery(q) {
      if (!q) return 'nav';

      // Very long queries (>30 chars) should go to AI mode
      // These are likely code snippets, logs, or document pastes
      if (q.length > 30) return 'ai';

      const normalized = q.trim().replace(/\s+/g, ' ');
      const tokens = normalized.split(' ').filter(Boolean);
      const tokenCount = tokens.length;
      const totalLength = normalized.length;

      // Quick URL-like detection: dot or slash likely a URL -> nav
      if (/[./]/.test(normalized)) return 'nav';

      // Calculate complexity score
      let score = 0;

      // 1. Average token length (weight: important)
      const avgTokenLength = totalLength / Math.max(tokenCount, 1);

      // For Japanese/Chinese (no spaces), consider character-based scoring
      const hasJapaneseChinese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(normalized);

      if (hasJapaneseChinese) {
        // Japanese/Chinese scoring:
        // - Single token >= 9 chars = +50 points (likely sentence)
        // - Average token length × 8
        // - Token count × 3
        if (tokenCount === 1) {
          if (totalLength >= 9) {
            score += 50;
          }
          // Also add length-based score for single tokens
          score += totalLength * 2;
        } else {
          // Multiple tokens: check if keywords or sentence
          score += avgTokenLength * 8;
          score += tokenCount * 3;
        }
      } else {
        // English/Latin scoring:
        // - Average token length × 3
        // - Token count × 5
        // - Length > 40 chars = +20 points
        score += avgTokenLength * 3;
        score += tokenCount * 5;

        if (totalLength > 40) score += 20;
      }

      // 2. Question marks = strong AI signal (+30 points)
      if (/[?？]/.test(normalized)) {
        score += 30;
      }

      // 3. Sentence-like patterns
      // Japanese particles that indicate sentences (+10 points)
      if (/[をはがでにへとのも]/.test(normalized)) {
        score += 10;
      }
      // English question words/auxiliaries (+15 points)
      if (/\b(what|how|why|when|where|who|can|could|should|would|will|is|are|was|were)\b/i.test(normalized)) {
        score += 15;
      }

      // 4. Too short penalty (likely navigation, -20 points)
      if (totalLength < 6) {
        score -= 20;
      }

      // 5. Sentence ending patterns (+10 points)
      if (/[。．.!！]$/.test(normalized)) {
        score += 10;
      }
      // Japanese sentence endings (+10 points)
      if (/て$|か$|す$|ます$|です$|した$|ました$/.test(normalized)) {
        score += 10;
      }

      // Decision threshold
      // Score >= 60 = AI mode
      // Score < 60 = nav mode
      return score >= 60 ? 'ai' : 'nav';
    }

    // -----------------------------
    // Toggle UI
    // -----------------------------
    function createToggleUI() {
      // Skip UI creation on mobile devices when in AI mode
      const currentUrl = new URL(window.location.href);
      const params = currentUrl.searchParams;
      const hasUdm50 = params.get('udm') === '50';

      if (isMobile() && hasUdm50) {
        return null; // Hide toggle on mobile when in AI mode
      }

      const existing = document.getElementById('ai-mode-toggle-container');
      if (existing) return existing; // reuse

      const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      let isEnabled = getStorageEnabled();

      const container = document.createElement('div');
      container.id = 'ai-mode-toggle-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.left = '20px';
      container.style.zIndex = '2147483647';
      container.style.opacity = '0.1';
      container.style.transform = 'scale(0.7)';
      container.style.transformOrigin = 'bottom left';
      container.style.transition = 'opacity 0.3s, transform 0.3s, box-shadow 0.3s';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '12px';
      container.style.padding = '8px 16px';
      container.style.borderRadius = '24px';
      container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      container.style.background = darkMode ? 'rgba(48,49,52,0.95)' : 'rgba(255,255,255,0.95)';
      container.style.border = '1px solid ' + (darkMode ? '#5f6368' : '#dadce0');
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.fontSize = '14px';

      container.innerHTML = `
        <span id="ai-mode-label" style="color: ${darkMode ? '#e8eaed' : '#5f6368'}; white-space:nowrap">Auto AI Mode</span>
        <div id="ai-mode-toggle" style="width:48px;height:24px;border-radius:24px;position:relative;cursor:pointer;background:${isEnabled ? '#1a73e8' : (darkMode ? '#5f6368' : '#ccc')}">
          <div id="ai-mode-toggle-knob" style="width:18px;height:18px;background:#fff;border-radius:50%;position:absolute;top:3px;left:${isEnabled ? '27px' : '3px'};transition:left 0.3s;box-shadow:0 2px 4px rgba(0,0,0,0.2)"></div>
        </div>
        <span id="ai-mode-status" style="color:${isEnabled ? '#1a73e8' : (darkMode ? '#9aa0a6' : '#80868b')};font-weight:500;white-space:nowrap">${isEnabled ? 'ON' : 'OFF'}</span>
      `;

      let isHover = false;
      let autoTooltipTimers = [];

      function clearAutoTooltipTimers() {
        while (autoTooltipTimers.length) {
          clearTimeout(autoTooltipTimers.shift());
        }
        container.dataset.autoTooltipActive = '0';
      }

      container.addEventListener('mouseover', () => {
        isHover = true;
        clearAutoTooltipTimers();
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
      });
      container.addEventListener('mouseout', () => {
        isHover = false;
        container.style.opacity = '0.1';
        container.style.transform = 'scale(0.7)';
      });

      container.querySelector('#ai-mode-toggle').addEventListener('click', () => {
        isEnabled = !isEnabled;
        setStorageEnabled(isEnabled);
        const knob = container.querySelector('#ai-mode-toggle-knob');
        const status = container.querySelector('#ai-mode-status');
        container.querySelector('#ai-mode-toggle').style.background = isEnabled ? '#1a73e8' : (darkMode ? '#5f6368' : '#ccc');
        knob.style.left = isEnabled ? '27px' : '3px';
        status.textContent = isEnabled ? 'ON' : 'OFF';
        status.style.color = isEnabled ? '#1a73e8' : (darkMode ? '#9aa0a6' : '#80868b');

        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;
        const hasSearchQuery =
            (params.has('q') && params.get('q').trim().length > 0) ||
            (params.has('as_q') && params.get('as_q').trim().length > 0);
        const hasUdm50 = params.get('udm') === '50';
        const isNormalSearch = !hasUdm50;
        if (isEnabled && !hasUdm50 && hasSearchQuery && isNormalSearch) {
          try {
            // Clear session storage for new redirect
            const currentQ = params.get('q') || params.get('as_q') || '';
            const isSiri = params.has('as_q') && !params.has('q');
            const currentQueryHash = simpleHash(currentQ);
            const sessionKeyToUse = isSiri ?
                                   sessionKey + '_siri_' + currentQueryHash :
                                   sessionKey + '_' + currentQueryHash;
            sessionStorage.removeItem(sessionKeyToUse);
          } catch (e) {}

          // For Siri searches, move as_q to q parameter for AI mode compatibility
          if (params.has('as_q') && !params.has('q')) {
            const query = params.get('as_q');
            params.set('q', query);
            params.delete('as_q');
            params.delete('as_occt');
            params.delete('as_qdr');
          }

          params.set('udm', '50');
          currentUrl.search = params.toString();
          window.location.href = currentUrl.toString();
        }
      });

      // Expose auto-tooltip flow but guard against double runs
      container._triggerAutoTooltip = function() {
        if (isHover) return; // user hovered, cancel
        if (container.dataset.autoTooltipActive === '1') return; // already active
        container.dataset.autoTooltipActive = '1';

        clearAutoTooltipTimers();

        const originalOpacity = container.style.opacity;
        const originalTransform = container.style.transform;
        const labelEl = container.querySelector('#ai-mode-label');
        const originalLabel = labelEl ? labelEl.textContent : '';

        const t1 = setTimeout(() => {
          if (isHover) { clearAutoTooltipTimers(); if (labelEl) labelEl.textContent = originalLabel; return; }
          container.style.opacity = '1';
          container.style.transform = 'scale(1)';
          if (labelEl) labelEl.textContent = 'Long queries activate AI mode';

          const t2 = setTimeout(() => {
            if (isHover) { clearAutoTooltipTimers(); if (labelEl) labelEl.textContent = originalLabel; return; }
            if (labelEl) labelEl.textContent = originalLabel;

            const t3 = setTimeout(() => {
              if (isHover) { clearAutoTooltipTimers(); return; }
              container.style.opacity = originalOpacity;
              container.style.transform = originalTransform;
              container.dataset.autoTooltipActive = '0';
            }, AUTO_TOOLTIP_RESTORE_DELAY_MS);
            autoTooltipTimers.push(t3);
          }, AUTO_TOOLTIP_SHOW_MS);
          autoTooltipTimers.push(t2);
        }, AUTO_TOOLTIP_DELAY_MS);
        autoTooltipTimers.push(t1);
      };

      try { document.body.appendChild(container); } catch (e) { console.error('Failed to append AI toggle UI', e); }
      container.dataset.autoTooltipActive = '0';
      return container;
    }

    // Main flow
    (function main() {
      try {
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;

        // Get query from either 'q' or 'as_q' parameter (Siri uses as_q)
        let q = params.get('q') || params.get('as_q') || '';
        const isSiriSearch = params.has('as_q') && !params.has('q');

        if (!q) return; // nothing to do on pages without a search query

        // Check for force search mode prefixes (? = Google search, ! = AI mode)
        let forcedMode = null;
        let cleanedQuery = q;

        // Check if we're within the 5-second block period for "?" queries
        const lastForceNavTimestamp = sessionStorage.getItem(FORCE_NAV_TIMESTAMP_KEY);
        const now = Date.now();
        const isWithinBlockPeriod = lastForceNavTimestamp &&
                                   (now - parseInt(lastForceNavTimestamp, 10)) < FORCE_NAV_BLOCK_DURATION_MS;

        if (q.startsWith('?') && (q.length === 1 || q.charAt(1) === ' ')) {
          forcedMode = 'nav';
          cleanedQuery = q.charAt(1) === ' ' ? q.substring(2) : q.substring(1); // Remove "?" or "? " prefix

          // If within block period, prevent redirect and just clean the query
          if (isWithinBlockPeriod) {
            // Update the query parameter with cleaned query but don't redirect
            if (isSiriSearch) {
              params.set('as_q', cleanedQuery);
            } else {
              params.set('q', cleanedQuery);
            }
            // Force normal Google search by removing AI mode parameter
            params.delete('udm');

            // Update URL without redirect
            currentUrl.search = params.toString();
            window.history.replaceState({}, '', currentUrl.toString());

            // Create UI and return early
            createToggleUI();
            return;
          }

          // Record timestamp when processing "?" query
          sessionStorage.setItem(FORCE_NAV_TIMESTAMP_KEY, now.toString());
        } else if (q.startsWith('!') && (q.length === 1 || q.charAt(1) === ' ')) {
          forcedMode = 'ai';
          cleanedQuery = q.charAt(1) === ' ' ? q.substring(2) : q.substring(1); // Remove "!" or "! " prefix
        }

        // If we have a forced mode, update the URL and redirect
        if (forcedMode && cleanedQuery.trim().length > 0) {
          // Update the query parameter with cleaned query
          if (isSiriSearch) {
            params.set('as_q', cleanedQuery);
          } else {
            params.set('q', cleanedQuery);
          }

          // Apply forced mode
          if (forcedMode === 'ai') {
            // For Siri searches, move as_q to q parameter for AI mode compatibility
            if (isSiriSearch) {
              params.set('q', cleanedQuery);
              params.delete('as_q');
              params.delete('as_occt');
              params.delete('as_qdr');
            }
            params.set('udm', '50');
          } else {
            // Force normal Google search by removing AI mode parameter
            params.delete('udm');
          }

          // Set a flag to prevent auto-detection on the redirected page
          const queryHash = simpleHash(cleanedQuery);
          const sessionKeyToUse = 'forced_' + sessionKey + '_' + queryHash;
          sessionStorage.setItem(sessionKeyToUse, 'true');

          currentUrl.search = params.toString();
          window.location.href = currentUrl.toString();
          return;
        }

        // Check if this query was already processed with forced mode
        const queryHash = simpleHash(cleanedQuery);
        const forcedSessionKey = 'forced_' + sessionKey + '_' + queryHash;
        const wasForcedMode = sessionStorage.getItem(forcedSessionKey) === 'true';

        // If this was a forced mode redirect, skip auto-detection
        if (wasForcedMode) {
          // Clear the flag and create UI only
          sessionStorage.removeItem(forcedSessionKey);
          createToggleUI();
          return;
        }

        const userEnabled = getStorageEnabled();
        const hasUdm50 = params.get('udm') === '50';
        const desiredMode = decideModeByQuery(cleanedQuery); // 'ai'|'nav'

        // Additional protection: If we're within the 5-second block period, prevent any auto-redirect to AI mode
        if (isWithinBlockPeriod && desiredMode === 'ai' && userEnabled) {
          // Just create UI without redirecting
          createToggleUI();
          return;
        }

        // Special search detection
        const specialUdmValues = ['2','7','28','36','39']; // images, videos, shopping, etc.
        const specialTbmValues = ['nws','flm','fin','lcl','isch','vid','shop','bks'];

        const udmValue = params.get('udm');
        const tbmValue = params.get('tbm');
        const hasSpecialUdm = udmValue && specialUdmValues.includes(udmValue);
        const hasSpecialTbm = tbmValue && specialTbmValues.includes(tbmValue);

        const isNormalSearch = !hasSpecialUdm && !hasSpecialTbm;

        // Check navigation type - only redirect on navigate/reload, not back_forward
        const navType = getNavigationType();
        const isBackForward = navType === 'back_forward';

        // Check if this is from tab navigation (source=lnms indicates tab switching)
        const isFromTabNavigation = params.get('source') === 'lnms';

        // Check if this is from a new tab action (sa=X parameter is often present)
        const hasNewTabIndicator = params.has('sa') && params.get('sa') === 'X';

        // Check if this is a new tab opened from Google search
        // Exception: Siri searches (as_q) should be treated as new searches, not tab navigation
        const isFromGoogleNewTab = !isSiriSearch && (
                                   (document.referrer &&
                                    document.referrer.includes('google.com') &&
                                    document.referrer.includes('/search')) ||
                                   isFromTabNavigation ||
                                   hasNewTabIndicator);

        // Check if there are Maps links that suggest this is a location/address search
        const hasMapsLinks = document.querySelector('a[data-url^="/maps/place/"], a[data-url^="/maps/dir/"]') !== null;

        // Don't redirect if:
        // 1. User navigated back/forward (tab switching)
        // 2. Already in AI mode
        // 3. Special search type
        // 4. Feature disabled
        // 5. Query doesn't warrant AI mode
        // 6. New tab opened from Google search results or tab navigation (except Siri)
        // 7. Maps links detected (location/address searches)
        const shouldRedirect = (desiredMode === 'ai') &&
                              userEnabled &&
                              isNormalSearch &&
                              !hasUdm50 &&
                              !isBackForward &&
                              !isFromGoogleNewTab &&
                              !hasMapsLinks;

        if (shouldRedirect) {
          try {
            // Use a more specific session key that includes the query to prevent duplicate redirects
            // For Siri searches, use a different approach since they don't follow normal tab flow
            // Use simple hash to handle multi-byte characters
            const autoQueryHash = simpleHash(cleanedQuery);
            const sessionKeyToUse = isSiriSearch ?
                                   sessionKey + '_siri_' + autoQueryHash :
                                   sessionKey + '_' + autoQueryHash;
            const alreadyRedirected = sessionStorage.getItem(sessionKeyToUse) === 'true';
            if (!alreadyRedirected) {
              sessionStorage.setItem(sessionKeyToUse, 'true');

              // For Siri searches, move as_q to q parameter for AI mode compatibility
              if (isSiriSearch) {
                params.set('q', cleanedQuery);
                params.delete('as_q');
                params.delete('as_occt');
                params.delete('as_qdr');
              }

              params.set('udm', '50');
              currentUrl.search = params.toString();
              window.location.href = currentUrl.toString();
              return;
            }
          } catch (e) {
            console.error('Redirect error:', e);
          }
        }

        // Create or reuse toggle UI (returns null on mobile+AI mode)
        const container = createToggleUI();

        // If we started in nav mode and have UI, trigger the auto-tooltip flow to inform users
        if (container && desiredMode === 'nav') {
          try { container._triggerAutoTooltip(); } catch (e) {}
        }

      } catch (e) {
        console.error('AI Mode Auto Switcher main error', e);
      }
    })();

  })();
