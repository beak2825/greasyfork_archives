// ==UserScript==
// @name         Grok Rate Limit Display
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Displays remaining queries and cooldowns on grok.com.
// @author       KHROTU, ported from Blankspeaker & CursedAtom
// @match        https://grok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @grant        none
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/558017-grok-rate-limit-display
// @downloadURL https://update.greasyfork.org/scripts/558017/Grok%20Rate%20Limit%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/558017/Grok%20Rate%20Limit%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastHigh = { remaining: null, wait: null };
    let lastLow = { remaining: null, wait: null };
    let lastBoth = { high: null, low: null, wait: null };

    const MODEL_MAP = {
        "Grok 4": "grok-4",
        "Grok 3": "grok-3",
        "Grok 4 Heavy": "grok-4-heavy",
        "Grok 4 With Effort Decider": "grok-4-auto",
        "Auto": "grok-4-auto",
        "Fast": "grok-3",
        "Expert": "grok-4",
        "Heavy": "grok-4-heavy",
        "Grok 4 Fast": "grok-4-mini-thinking-tahoe",
        "Grok 4.1": "grok-4-1-non-thinking-w-tool",
        "Grok 4.1 Thinking": "grok-4-1-thinking-1129",
    };

    const DEFAULT_MODEL = "grok-4-auto";
    const DEFAULT_KIND = "DEFAULT";
    const POLL_INTERVAL_MS = 30000;
    const MODEL_SELECTOR = "button[aria-label='Model select']";
    const QUERY_BAR_SELECTOR = ".query-bar";
    const RATE_LIMIT_CONTAINER_ID = "grok-rate-limit";

    const cachedRateLimits = {};

    let countdownTimer = null;
    let isCountingDown = false;
    let lastQueryBar = null;
    let lastModelObserver = null;
    let lastThinkObserver = null;
    let lastSearchObserver = null;
    let lastInputElement = null;
    let lastSubmitButton = null;
    let pollInterval = null;
    let lastModelName = null;
    let overlapCheckInterval = null;
    let isHiddenDueToOverlap = false;

    const commonFinderConfigs = {
        thinkButton: {
            selector: "button",
            ariaLabel: "Think",
            svgPartialD: "M19 9C19 12.866",
        },
        deepSearchButton: {
            selector: "button",
            ariaLabelRegex: /Deep(er)?Search/i,
        },
        attachButton: {
            selector: "button",
            ariaLabel: "Attach",
            classContains: ["group/attach-button"],
            svgPartialD: "M10 9V15",
        },
        submitButton: {
            selector: "button",
            ariaLabel: "Submit",
            svgPartialD: "M5 11L12 4M12 4L19 11M12 4V21",
        }
    };

    function isImaginePage() {
        return window.location.pathname.startsWith('/imagine');
    }

    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    function findElement(config, root = document) {
        const elements = root.querySelectorAll(config.selector);
        for (const el of elements) {
            let satisfied = 0;

            if (config.ariaLabel) {
                if (el.getAttribute('aria-label') === config.ariaLabel) satisfied++;
            }

            if (config.ariaLabelRegex) {
                const aria = el.getAttribute('aria-label');
                if (aria && config.ariaLabelRegex.test(aria)) satisfied++;
            }

            if (config.svgPartialD) {
                const path = el.querySelector('path');
                if (path && path.getAttribute('d')?.includes(config.svgPartialD)) satisfied++;
            }

            if (config.classContains) {
                if (config.classContains.some(cls => el.classList.contains(cls))) satisfied++;
            }

            if (satisfied > 0) {
                return el;
            }
        }
        return null;
    }

    function formatTimer(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    function checkTextOverlap(queryBar) {
      const rateLimitContainer = document.getElementById(RATE_LIMIT_CONTAINER_ID);
      if (!rateLimitContainer) return;

      const contentEditable = queryBar.querySelector('div[contenteditable="true"]');
      const textArea = queryBar.querySelector('textarea[aria-label*="Ask Grok"]');
      const inputElement = contentEditable || textArea;

      if (!inputElement) return;

      const textContent = inputElement.value || inputElement.textContent || '';
      const textLength = textContent.trim().length;
      const queryBarWidth = queryBar.offsetWidth;
      const rateLimitWidth = rateLimitContainer.offsetWidth;
      const availableSpace = queryBarWidth - rateLimitWidth - 100;
      const isSmallScreen = window.innerWidth < 900 ||
                           availableSpace < 200 ||
                           window.screen?.width < 500 ||
                           document.documentElement.clientWidth < 500;
      const characterLimit = isSmallScreen ? 0 : 28;
      const shouldHide = textLength > characterLimit;

      if (shouldHide && !isHiddenDueToOverlap) {
        rateLimitContainer.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        rateLimitContainer.style.transform = 'translateX(100%)';
        rateLimitContainer.style.opacity = '0';

        setTimeout(() => {
          if (isHiddenDueToOverlap) {
            rateLimitContainer.style.display = 'none';
          }
        }, 200);

        isHiddenDueToOverlap = true;
      } else if (!shouldHide && isHiddenDueToOverlap) {
        rateLimitContainer.style.display = '';
        rateLimitContainer.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        rateLimitContainer.offsetHeight;
        rateLimitContainer.style.transform = 'translateX(0)';
        rateLimitContainer.style.opacity = '0.8';
        isHiddenDueToOverlap = false;
      }
    }

    function startOverlapChecking(queryBar) {
      if (overlapCheckInterval) {
        clearInterval(overlapCheckInterval);
      }
      overlapCheckInterval = setInterval(() => {
        if (document.body.contains(queryBar)) {
          checkTextOverlap(queryBar);
        } else {
          clearInterval(overlapCheckInterval);
          overlapCheckInterval = null;
        }
      }, 500);
    }

    function stopOverlapChecking() {
      if (overlapCheckInterval) {
        clearInterval(overlapCheckInterval);
        overlapCheckInterval = null;
      }
      isHiddenDueToOverlap = false;
    }

    function removeExistingRateLimit() {
      const existing = document.getElementById(RATE_LIMIT_CONTAINER_ID);
      if (existing) {
        existing.remove();
      }
    }

    function getCurrentModelKey(queryBar) {
        const modelButton = queryBar.querySelector(MODEL_SELECTOR);
        if (!modelButton) return DEFAULT_MODEL;

        const textElement = modelButton.querySelector('span.font-semibold');
        if (textElement) {
            const modelText = textElement.textContent.trim();
            return MODEL_MAP[modelText] || DEFAULT_MODEL;
        }

        const oldTextElement = modelButton.querySelector('span.inline-block');
        if (oldTextElement) {
            const modelText = oldTextElement.textContent.trim();
            return MODEL_MAP[modelText] || DEFAULT_MODEL;
        }

        const svg = modelButton.querySelector('svg');
        if (svg) {
            const pathsD = Array.from(svg.querySelectorAll('path'))
                .map(p => p.getAttribute('d') || '')
                .filter(d => d.length > 0)
                .join(' ');
            const hasBrainFill = svg.querySelector('path[class*="fill-yellow-100"]') !== null;
            if (pathsD.includes('M6.5 12.5L11.5 17.5')) return 'grok-4-auto';
            if (pathsD.includes('M5 14.25L14 4')) return 'grok-3';
            if (hasBrainFill || pathsD.includes('M19 9C19 12.866')) return 'grok-4';
            if (pathsD.includes('M12 3a6 6 0 0 0 9 9')) return 'grok-4-mini-thinking-tahoe';
            if (pathsD.includes('M11 18H10C7.79086 18 6 16.2091 6 14V13')) return 'grok-4-heavy';
        }
        return DEFAULT_MODEL;
    }

    function getEffortLevel(modelName) {
      if (modelName === 'grok-4-auto') return 'both';
      if (modelName === 'grok-3') return 'low';
      if (modelName === 'grok-4-1-non-thinking-w-tool') return 'low';
      if (modelName === 'grok-4-1-thinking-1129') return 'high';
      return 'high';
    }

    function updateRateLimitDisplay(queryBar, response, effort) {
      if (isImaginePage()) {
        removeExistingRateLimit();
        return;
      }

      let rateLimitContainer = document.getElementById(RATE_LIMIT_CONTAINER_ID);
      if (!rateLimitContainer) {
        const bottomBar = queryBar.querySelector('.flex.gap-1\\.5.absolute.inset-x-0.bottom-0');
        if (!bottomBar) return;

        const modelSelectDiv = bottomBar.querySelector('div.z-20');
        const submitButton = findElement(commonFinderConfigs.submitButton, bottomBar);
        const attachButton = findElement(commonFinderConfigs.attachButton, bottomBar);

        let insertPoint = modelSelectDiv || submitButton || attachButton || bottomBar;

        rateLimitContainer = document.createElement('div');
        rateLimitContainer.id = RATE_LIMIT_CONTAINER_ID;
        rateLimitContainer.className = 'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:duration-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 select-none text-fg-primary hover:bg-button-ghost-hover hover:border-border-l2 disabled:hover:bg-transparent h-10 px-3.5 py-2 text-sm rounded-full group/rate-limit transition-colors duration-100 relative overflow-hidden border border-transparent cursor-pointer';
        rateLimitContainer.style.opacity = '0.8';
        rateLimitContainer.style.transition = 'opacity 0.1s ease-in-out';
        rateLimitContainer.style.zIndex = '20';
        rateLimitContainer.addEventListener('click', () => fetchAndUpdateRateLimit(queryBar, true));

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        Object.entries({
            width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none',
            stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round',
            'stroke-linejoin': 'round', class: 'lucide lucide-gauge stroke-[2] text-fg-secondary transition-colors duration-100',
            'aria-hidden': 'true'
        }).forEach(([key, value]) => svg.setAttribute(key, value));

        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex items-center';
        rateLimitContainer.append(svg, contentDiv);
        insertPoint === bottomBar ? bottomBar.appendChild(rateLimitContainer) : insertPoint.insertAdjacentElement('beforebegin', rateLimitContainer);
      }

      const contentDiv = rateLimitContainer.lastChild;
      const svg = rateLimitContainer.querySelector('svg');
      contentDiv.innerHTML = '';
      const isBoth = effort === 'both';

      if (response.error) {
        if (isBoth) {
          if (lastBoth.high !== null && lastBoth.low !== null) {
            appendNumberSpan(contentDiv, lastBoth.high, '');
            appendDivider(contentDiv);
            appendNumberSpan(contentDiv, lastBoth.low, '');
            rateLimitContainer.title = `High: ${lastBoth.high} | Low: ${lastBoth.low} queries remaining`;
            setGaugeSVG(svg);
          } else {
            appendNumberSpan(contentDiv, 'Unavailable', '');
            rateLimitContainer.title = 'Unavailable';
            setGaugeSVG(svg);
          }
        } else {
          const lastForEffort = (effort === 'high') ? lastHigh : lastLow;
          if (lastForEffort.remaining !== null) {
            let displayRemaining = lastForEffort.remaining;
            let tooltipText = `${lastForEffort.remaining} queries remaining`;
            if (lastForEffort.isFreeAccount && lastForEffort.cost && lastForEffort.cost > 1) {
              displayRemaining = Math.floor(lastForEffort.originalRemaining / lastForEffort.cost);
              tooltipText = `${displayRemaining} queries (${lastForEffort.originalRemaining} tokens ÷ ${lastForEffort.cost} cost)`;
            }
            appendNumberSpan(contentDiv, displayRemaining, '');
            rateLimitContainer.title = tooltipText;
            setGaugeSVG(svg);
          } else {
            appendNumberSpan(contentDiv, 'Unavailable', '');
            rateLimitContainer.title = 'Unavailable';
            setGaugeSVG(svg);
          }
        }
      } else {
        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = null;

        const startCountdown = (duration, timerSpan) => {
          let currentCountdown = duration;
          isCountingDown = true;
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
          countdownTimer = setInterval(() => {
            currentCountdown--;
            if (currentCountdown <= 0) {
              clearInterval(countdownTimer);
              countdownTimer = null;
              isCountingDown = false;
              fetchAndUpdateRateLimit(queryBar, true);
              if (document.visibilityState === 'visible' && lastQueryBar) {
                pollInterval = setInterval(() => fetchAndUpdateRateLimit(lastQueryBar, true), POLL_INTERVAL_MS);
              }
            } else {
              timerSpan.textContent = formatTimer(currentCountdown);
            }
          }, 1000);
        };

        if (isBoth) {
          Object.assign(lastBoth, {
              high: response.highRemaining, low: response.lowRemaining, wait: response.waitTimeSeconds,
              originalHigh: response.originalHighRemaining, highCost: response.highCost, isFreeAccount: response.isFreeAccount
          });
          const { high, low, wait } = lastBoth;
          if (high > 0) {
            appendNumberSpan(contentDiv, high, '');
            appendDivider(contentDiv);
            appendNumberSpan(contentDiv, low, '');
            rateLimitContainer.title = (response.isFreeAccount && response.highCost > 1)
                ? `High: ${high} queries (${response.originalHighRemaining} tokens ÷ ${response.highCost} cost) | Low: ${low} queries remaining`
                : `High: ${high} | Low: ${low} queries remaining`;
            setGaugeSVG(svg);
          } else if (wait > 0) {
            const timerSpan = appendNumberSpan(contentDiv, formatTimer(wait), '#ff6347');
            if (low > 0) {
              appendDivider(contentDiv);
              appendNumberSpan(contentDiv, low, '');
              rateLimitContainer.title = `High: Time until reset | Low: ${low} queries remaining`;
            } else {
              rateLimitContainer.title = `Time until reset`;
            }
            setClockSVG(svg);
            startCountdown(wait, timerSpan);
          } else {
            appendNumberSpan(contentDiv, '0', '#ff6347');
            if (low > 0) {
              appendDivider(contentDiv);
              appendNumberSpan(contentDiv, low, '');
              rateLimitContainer.title = `High: Limit reached | Low: ${low} queries remaining`;
            } else {
              rateLimitContainer.title = `Limit reached. Awaiting reset.`;
            }
            setGaugeSVG(svg);
          }
        } else {
          const lastForEffort = (effort === 'high') ? lastHigh : lastLow;
          Object.assign(lastForEffort, {
              remaining: response.remainingQueries, wait: response.waitTimeSeconds, originalRemaining: response.originalRemaining,
              cost: response.cost, isFreeAccount: response.isFreeAccount
          });
          const { remaining, wait } = lastForEffort;
          if (remaining > 0) {
            appendNumberSpan(contentDiv, remaining, '');
            rateLimitContainer.title = (response.isFreeAccount && response.cost > 1)
                ? `${remaining} queries (${response.originalRemaining} tokens ÷ ${response.cost} cost)`
                : `${remaining} queries remaining`;
            setGaugeSVG(svg);
          } else if (wait > 0) {
            const timerSpan = appendNumberSpan(contentDiv, formatTimer(wait), '#ff6347');
            rateLimitContainer.title = `Time until reset`;
            setClockSVG(svg);
            startCountdown(wait, timerSpan);
          } else {
            appendNumberSpan(contentDiv, '0', '#ff6347');
            rateLimitContainer.title = 'Limit reached. Awaiting reset.';
            setGaugeSVG(svg);
          }
        }
      }
    }

    function appendNumberSpan(parent, text, color) {
      const span = document.createElement('span');
      span.textContent = text;
      if (color) span.style.color = color;
      parent.appendChild(span);
      return span;
    }

    function appendDivider(parent) {
      const divider = document.createElement('div');
      divider.className = 'h-6 w-[2px] bg-border-l2 mx-1';
      parent.appendChild(divider);
    }

    function setGaugeSVG(svg) {
      if (svg) {
        while (svg.firstChild) {
          svg.removeChild(svg.firstChild);
        }
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'm12 14 4-4');
        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M3.34 19a10 10 0 1 1 17.32 0');
        svg.appendChild(path1);
        svg.appendChild(path2);
        svg.setAttribute('class', 'lucide lucide-gauge stroke-[2] text-fg-secondary transition-colors duration-100');
      }
    }

    function setClockSVG(svg) {
      if (svg) {
        while (svg.firstChild) {
          svg.removeChild(svg.firstChild);
        }
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '8');
        circle.setAttribute('stroke', 'currentColor');
        circle.setAttribute('stroke-width', '2');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 12L12 6');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(circle);
        svg.appendChild(path);
        svg.setAttribute('class', 'stroke-[2] text-fg-secondary group-hover/rate-limit:text-fg-primary transition-colors duration-100');
      }
    }

    async function fetchRateLimit(modelName, requestKind, force = false) {
      const now = Date.now();
      if (!force) {
        const cached = cachedRateLimits[modelName]?.[requestKind];
        if (cached?.timestamp && (now - cached.timestamp) < 10000) {
          return cached.data;
        }
      }
      if (cachedRateLimits._lastRequest && (now - cachedRateLimits._lastRequest) < 2000) {
        const cached = cachedRateLimits[modelName]?.[requestKind];
        return cached?.data ?? { error: true, reason: 'Rate limited' };
      }
      cachedRateLimits._lastRequest = now;

      try {
        const response = await fetch(`${window.location.origin}/rest/rate-limits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestKind, modelName }),
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP error: Status ${response.status}`);
        const data = await response.json();
        if (!cachedRateLimits[modelName]) cachedRateLimits[modelName] = {};
        cachedRateLimits[modelName][requestKind] = { data, timestamp: now };
        return data;
      } catch (error) {
        if (!cachedRateLimits[modelName]) cachedRateLimits[modelName] = {};
        const errorData = { error: true, reason: error.message };
        cachedRateLimits[modelName][requestKind] = { data: errorData, timestamp: now };
        return errorData;
      }
    }

    function processRateLimitData(data, effortLevel) {
      if (data.error) return data;
      const isFreeAccount = data.totalTokens <= 80;

      if (effortLevel === 'both') {
        const high = data.highEffortRateLimits?.remainingQueries;
        const low = data.lowEffortRateLimits?.remainingQueries;
        const highCost = data.highEffortRateLimits?.cost || 1;
        const waitTimeSeconds = Math.max(data.highEffortRateLimits?.waitTimeSeconds || 0, data.lowEffortRateLimits?.waitTimeSeconds || 0, data.waitTimeSeconds || 0);
        if (high === undefined || low === undefined) return { error: true, reason: 'Missing effort data' };
        return {
          highRemaining: isFreeAccount ? Math.floor(high / highCost) : high,
          lowRemaining: low,
          waitTimeSeconds: waitTimeSeconds,
          originalHighRemaining: high,
          highCost: highCost,
          isFreeAccount: isFreeAccount
        };
      } else {
        const key = effortLevel === 'high' ? 'highEffortRateLimits' : 'lowEffortRateLimits';
        let remaining = data[key]?.remainingQueries;
        if (remaining === undefined) remaining = data.remainingQueries;
        let cost = data[key]?.cost || 1;
        if (remaining === undefined) return { error: true, reason: `Missing ${effortLevel} effort data` };
        return {
          remainingQueries: isFreeAccount ? Math.floor(remaining / cost) : remaining,
          waitTimeSeconds: data[key]?.waitTimeSeconds || data.waitTimeSeconds || 0,
          originalRemaining: remaining,
          cost: cost,
          isFreeAccount: isFreeAccount
        };
      }
    }

    async function fetchAndUpdateRateLimit(queryBar, force = false) {
      if (isImaginePage() || !queryBar || !document.body.contains(queryBar)) return;
      const modelName = getCurrentModelKey(queryBar);
      if (modelName !== lastModelName) force = true;
      if (isCountingDown && !force) return;

      const effortLevel = getEffortLevel(modelName);
      let requestKind = DEFAULT_KIND;
      if (modelName === 'grok-3') {
        const thinkButton = findElement(commonFinderConfigs.thinkButton, queryBar);
        const searchButton = findElement(commonFinderConfigs.deepSearchButton, queryBar);
        if (thinkButton?.getAttribute('aria-pressed') === 'true') {
          requestKind = 'REASONING';
        } else if (searchButton?.getAttribute('aria-pressed') === 'true') {
          const searchAria = searchButton.getAttribute('aria-label') || '';
          if (/deeper/i.test(searchAria)) requestKind = 'DEEPERSEARCH';
          else if (/deep/i.test(searchAria)) requestKind = 'DEEPSEARCH';
        }
      }
      const data = await fetchRateLimit(modelName, requestKind, force);
      const processedData = processRateLimitData(data, effortLevel);
      updateRateLimitDisplay(queryBar, processedData, effortLevel);
      lastModelName = modelName;
    }

    function observeDOM() {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && lastQueryBar && !isImaginePage()) {
          fetchAndUpdateRateLimit(lastQueryBar, true);
          if (!isCountingDown) {
            if (pollInterval) clearInterval(pollInterval);
            pollInterval = setInterval(() => fetchAndUpdateRateLimit(lastQueryBar, true), POLL_INTERVAL_MS);
          }
        } else {
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      };
      const handleResize = debounce(() => {
        if (lastQueryBar) checkTextOverlap(lastQueryBar);
      }, 300);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('resize', handleResize);

      const setupForQueryBar = (queryBar) => {
          removeExistingRateLimit();
          fetchAndUpdateRateLimit(queryBar);
          lastQueryBar = queryBar;
          setupQueryBarObserver(queryBar);
          setupGrok3Observers(queryBar);
          setupSubmissionListeners(queryBar);
          startOverlapChecking(queryBar);
          setTimeout(() => checkTextOverlap(queryBar), 100);
          if (document.visibilityState === 'visible' && !isCountingDown) {
              if (pollInterval) clearInterval(pollInterval);
              pollInterval = setInterval(() => fetchAndUpdateRateLimit(lastQueryBar, true), POLL_INTERVAL_MS);
          }
      };

      const cleanup = () => {
          removeExistingRateLimit();
          stopOverlapChecking();
          if (lastModelObserver) lastModelObserver.disconnect();
          if (lastThinkObserver) lastThinkObserver.disconnect();
          if (lastSearchObserver) lastSearchObserver.disconnect();
          if (pollInterval) clearInterval(pollInterval);
          lastQueryBar = lastModelObserver = lastThinkObserver = lastSearchObserver = lastInputElement = lastSubmitButton = pollInterval = null;
      };

      if (!isImaginePage()) {
        const initialQueryBar = document.querySelector(QUERY_BAR_SELECTOR);
        if (initialQueryBar) setupForQueryBar(initialQueryBar);
      }

      const observer = new MutationObserver(() => {
        if (isImaginePage()) {
          if (lastQueryBar) cleanup();
          return;
        }
        const queryBar = document.querySelector(QUERY_BAR_SELECTOR);
        if (queryBar && queryBar !== lastQueryBar) {
            if (lastQueryBar) cleanup();
            setupForQueryBar(queryBar);
        } else if (!queryBar && lastQueryBar) {
            cleanup();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      function setupQueryBarObserver(queryBar) {
        const debouncedUpdate = debounce(() => {
          fetchAndUpdateRateLimit(queryBar);
          setupGrok3Observers(queryBar);
        }, 300);
        lastModelObserver = new MutationObserver(debouncedUpdate);
        lastModelObserver.observe(queryBar, { childList: true, subtree: true, attributes: true, characterData: true });
      }

      function setupGrok3Observers(queryBar) {
        const currentModel = getCurrentModelKey(queryBar);
        if (currentModel === 'grok-3') {
          const thinkButton = findElement(commonFinderConfigs.thinkButton, queryBar);
          if (thinkButton) {
            if (lastThinkObserver) lastThinkObserver.disconnect();
            lastThinkObserver = new MutationObserver(() => fetchAndUpdateRateLimit(queryBar));
            lastThinkObserver.observe(thinkButton, { attributes: true, attributeFilter: ['aria-pressed', 'class'] });
          }
          const searchButton = findElement(commonFinderConfigs.deepSearchButton, queryBar);
          if (searchButton) {
            if (lastSearchObserver) lastSearchObserver.disconnect();
            lastSearchObserver = new MutationObserver(() => fetchAndUpdateRateLimit(queryBar));
            lastSearchObserver.observe(searchButton, { attributes: true, attributeFilter: ['aria-pressed', 'class'], childList: true, subtree: true, characterData: true });
          }
        } else {
            if (lastThinkObserver) { lastThinkObserver.disconnect(); lastThinkObserver = null; }
            if (lastSearchObserver) { lastSearchObserver.disconnect(); lastSearchObserver = null; }
        }
      }

      function setupSubmissionListeners(queryBar) {
        const contentEditable = queryBar.querySelector('div[contenteditable="true"]');
        const textArea = queryBar.querySelector('textarea[aria-label*="Ask Grok"]');
        const inputElement = contentEditable || textArea;
        if (inputElement && inputElement !== lastInputElement) {
          lastInputElement = inputElement;
          const debouncedOverlapCheck = debounce(() => checkTextOverlap(queryBar), 300);
          inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              setTimeout(() => fetchAndUpdateRateLimit(queryBar, true), 3000);
            }
          });
          inputElement.addEventListener('input', debouncedOverlapCheck);
          inputElement.addEventListener('focus', debouncedOverlapCheck);
          inputElement.addEventListener('blur', () => setTimeout(() => checkTextOverlap(queryBar), 200));
        }

        const submitButton = findElement(commonFinderConfigs.submitButton, queryBar);
        if (submitButton && submitButton !== lastSubmitButton) {
          lastSubmitButton = submitButton;
          submitButton.addEventListener('click', () => setTimeout(() => fetchAndUpdateRateLimit(queryBar, true), 3000));
        }
      }
    }
    observeDOM();
})();