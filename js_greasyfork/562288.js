// ==UserScript==
// @name         Perplexity.ai Chat Exporter (Robust)
// @namespace    https://github.com/ckep1/pplxport
// @version      2.4.0
// @description  Export Perplexity.ai conversations as markdown with configurable citation styles - robust/slow version
// @author       Chris Kephart (modified for robustness)
// @match        https://www.perplexity.ai/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562288/Perplexityai%20Chat%20Exporter%20%28Robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562288/Perplexityai%20Chat%20Exporter%20%28Robust%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ============================================================================
  // CONFIGURATION & CONSTANTS
  // ============================================================================

  const DEBUG = false;
  const console = DEBUG ? window.console : { log() {}, warn() {}, error() {} };

  // Timing configuration - all delays in milliseconds
  const TIMING = {
    // Startup delays
    INIT_DELAY: 3000,              // Initial delay before first check
    IDLE_CHECK_INTERVAL: 500,      // How often to check if page is idle
    IDLE_STABLE_COUNT: 6,          // Number of stable checks before proceeding
    MIN_STARTUP_DELAY: 5000,       // Minimum time to wait before adding button
    
    // Scroll and extraction delays
    SCROLL_DELAY: 200,             // Delay after each scroll operation
    SCROLL_SETTLE: 300,            // Extra settle time after scroll
    BUTTON_CLICK_DELAY: 150,       // Delay after clicking a button
    CLIPBOARD_READ_DELAY: 120,     // Delay before reading clipboard
    CLIPBOARD_RETRY_DELAY: 100,    // Delay between clipboard retries
    CLIPBOARD_MAX_RETRIES: 5,      // Maximum clipboard read attempts
    
    // Focus and preload
    FOCUS_CHECK_INTERVAL: 150,     // How often to check for focus
    FOCUS_TIMEOUT: 45000,          // Maximum time to wait for focus
    PRELOAD_SCROLL_DELAY: 200,     // Delay during preload scroll
    PRELOAD_STABLE_COUNT: 4,       // Stable checks during preload
    
    // Extraction stability
    EXTRACTION_STABLE_COUNT: 8,    // Stable checks before ending extraction
    MAX_SCROLL_ATTEMPTS: 300,      // Maximum scroll attempts during extraction
    EXPANDER_CLICK_DELAY: 200,     // Delay after clicking expanders
    EXPANDER_SETTLE: 400,          // Settle time after expansion
    
    // DOM observation
    DOM_SETTLE: 150,               // Time to let DOM settle after changes
    HOVER_DELAY: 80,               // Delay after simulating hover
  };

  // Style options
  const CITATION_STYLES = {
    ENDNOTES: "endnotes",
    FOOTNOTES: "footnotes",
    INLINE: "inline",
    PARENTHESIZED: "parenthesized",
    NAMED: "named",
    NONE: "none",
  };

  const CITATION_STYLE_LABELS = {
    [CITATION_STYLES.ENDNOTES]: "Endnotes",
    [CITATION_STYLES.FOOTNOTES]: "Footnotes",
    [CITATION_STYLES.INLINE]: "Inline",
    [CITATION_STYLES.PARENTHESIZED]: "Parenthesized",
    [CITATION_STYLES.NAMED]: "Named",
    [CITATION_STYLES.NONE]: "No Citations",
  };

  const CITATION_STYLE_DESCRIPTIONS = {
    [CITATION_STYLES.ENDNOTES]: "[1] in text with sources listed at the end",
    [CITATION_STYLES.FOOTNOTES]: "[^1] in text with footnote definitions at the end",
    [CITATION_STYLES.INLINE]: "[1](url) - Clean inline citations",
    [CITATION_STYLES.PARENTHESIZED]: "([1](url)) - Inline citations in parentheses",
    [CITATION_STYLES.NAMED]: "[wikipedia](url) - Uses domain names",
    [CITATION_STYLES.NONE]: "Remove all citations from the text",
  };

  const FORMAT_STYLES = {
    FULL: "full",
    CONCISE: "concise",
  };

  const FORMAT_STYLE_LABELS = {
    [FORMAT_STYLES.FULL]: "Full",
    [FORMAT_STYLES.CONCISE]: "Concise",
  };

  const EXPORT_METHODS = {
    DOWNLOAD: "download",
    CLIPBOARD: "clipboard",
  };

  const EXPORT_METHOD_LABELS = {
    [EXPORT_METHODS.DOWNLOAD]: "Download File",
    [EXPORT_METHODS.CLIPBOARD]: "Copy to Clipboard",
  };

  // Global citation tracking
  const globalCitations = {
    urlToNumber: new Map(),
    citationRefs: new Map(),
    nextCitationNumber: 1,

    reset() {
      this.urlToNumber.clear();
      this.citationRefs.clear();
      this.nextCitationNumber = 1;
    },

    addCitation(url, sourceName = null) {
      const normalizedUrl = normalizeUrl(url);
      if (!this.urlToNumber.has(normalizedUrl)) {
        this.urlToNumber.set(normalizedUrl, this.nextCitationNumber);
        this.citationRefs.set(this.nextCitationNumber, {
          href: url,
          sourceName,
          normalizedUrl,
        });
        this.nextCitationNumber++;
      }
      return this.urlToNumber.get(normalizedUrl);
    },

    getCitationNumber(url) {
      const normalizedUrl = normalizeUrl(url);
      return this.urlToNumber.get(normalizedUrl);
    },
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getPreferences() {
    return {
      citationStyle: GM_getValue("citationStyle", CITATION_STYLES.PARENTHESIZED),
      formatStyle: GM_getValue("formatStyle", FORMAT_STYLES.FULL),
      addExtraNewlines: GM_getValue("addExtraNewlines", false),
      exportMethod: GM_getValue("exportMethod", EXPORT_METHODS.DOWNLOAD),
      includeFrontmatter: GM_getValue("includeFrontmatter", true),
      titleAsH1: GM_getValue("titleAsH1", false),
    };
  }

  function extractSourceName(text) {
    if (!text) return null;
    text = text.trim();
    const plusMatch = text.match(/^([a-zA-Z]+)\+\d+$/);
    if (plusMatch) return plusMatch[1];
    const cleanName = text.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
    if (cleanName && cleanName.length > 0) return cleanName;
    return null;
  }

  function normalizeUrl(url) {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      urlObj.hash = "";
      return urlObj.toString();
    } catch (e) {
      return url.split("#")[0];
    }
  }

  function extractDomainName(url) {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname.toLowerCase().replace(/^www\./, "");
      const parts = domain.split(".");
      if (parts.length >= 2) {
        if (parts[parts.length - 2].length <= 3 && parts.length > 2) {
          return parts[parts.length - 3];
        } else {
          return parts[parts.length - 2];
        }
      }
      return parts[0];
    } catch (e) {
      return null;
    }
  }

  // ============================================================================
  // PAGE STATE DETECTION
  // ============================================================================

  function isPageLoading() {
    // Check for Perplexity's loading indicators
    const loadingIndicators = [
      '[class*="loading"]',
      '[class*="spinner"]',
      '[class*="skeleton"]',
      '[data-loading="true"]',
      '.animate-pulse',
      '[class*="animate-spin"]',
    ];
    
    for (const selector of loadingIndicators) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (el.offsetParent !== null) { // Is visible
            return true;
          }
        }
      } catch (e) {
        // Ignore selector errors
      }
    }
    return false;
  }

  function hasConversationContent() {
    return !!(
      document.querySelector(".prose.text-pretty.dark\\:prose-invert") ||
      document.querySelector("[class*='prose'][class*='prose-invert']") ||
      document.querySelector("span[data-lexical-text='true']")
    );
  }

  async function waitForPageIdle() {
    console.log("Waiting for page to become idle...");
    
    let stableCount = 0;
    let lastContentHash = "";
    const startTime = Date.now();
    const maxWait = 30000; // 30 second maximum wait
    
    while (stableCount < TIMING.IDLE_STABLE_COUNT && (Date.now() - startTime) < maxWait) {
      await sleep(TIMING.IDLE_CHECK_INTERVAL);
      
      const loading = isPageLoading();
      const content = document.body.innerHTML.length;
      const contentHash = `${content}-${loading}`;
      
      if (!loading && contentHash === lastContentHash) {
        stableCount++;
        console.log(`Page stable check ${stableCount}/${TIMING.IDLE_STABLE_COUNT}`);
      } else {
        stableCount = 0;
        lastContentHash = contentHash;
      }
    }
    
    console.log("Page appears idle after", Date.now() - startTime, "ms");
  }

  async function waitForNetworkIdle(timeout = 5000) {
    // Use PerformanceObserver if available to detect network activity
    if (typeof PerformanceObserver === 'undefined') {
      await sleep(timeout);
      return;
    }

    return new Promise(resolve => {
      let lastActivity = Date.now();
      let resolved = false;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          lastActivity = Date.now();
        }
      });
      
      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (e) {
        // Not supported, fall back to timeout
        setTimeout(resolve, timeout);
        return;
      }
      
      const checkIdle = setInterval(() => {
        if (resolved) return;
        
        const idleTime = Date.now() - lastActivity;
        if (idleTime > 2000) { // 2 seconds of no network activity
          resolved = true;
          clearInterval(checkIdle);
          observer.disconnect();
          resolve();
        }
      }, 500);
      
      // Timeout fallback
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          clearInterval(checkIdle);
          observer.disconnect();
          resolve();
        }
      }, timeout);
    });
  }

  // ============================================================================
  // DOM HELPER FUNCTIONS
  // ============================================================================

  function getThreadContainer() {
    return document.querySelector('.max-w-threadContentWidth, [class*="threadContentWidth"]') || 
           document.querySelector("main") || 
           document.body;
  }

  function getScrollRoot() {
    const thread = getThreadContainer();
    const candidates = [];
    let node = thread;
    while (node && node !== document.body) {
      candidates.push(node);
      node = node.parentElement;
    }
    const scrollingElement = document.scrollingElement || document.documentElement;
    candidates.push(scrollingElement);

    let best = null;
    for (const el of candidates) {
      try {
        const style = getComputedStyle(el);
        const overflowY = (style.overflowY || style.overflow || "").toLowerCase();
        const canScroll = el.scrollHeight - el.clientHeight > 50;
        const isScrollable = /auto|scroll|overlay/.test(overflowY) || el === scrollingElement;
        if (canScroll && isScrollable) {
          if (!best || el.scrollHeight > best.scrollHeight) {
            best = el;
          }
        }
      } catch (e) {
        // ignore
      }
    }
    return best || scrollingElement;
  }

  function isInViewport(el, margin = 8) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return rect.bottom > -margin && rect.top < vh + margin && 
           rect.right > -margin && rect.left < vw + margin;
  }

  function isCodeCopyButton(btn) {
    const testId = btn.getAttribute("data-testid");
    const ariaLower = (btn.getAttribute("aria-label") || "").toLowerCase();
    if (testId === "copy-code-button" || testId === "copy-code" || 
        (testId && testId.includes("copy-code"))) return true;
    if (ariaLower.includes("copy code")) return true;
    if (btn.closest("pre") || btn.closest("code")) return true;
    return false;
  }

  function findUserMessageRootFromElement(el) {
    let node = el;
    let depth = 0;
    while (node && node !== document.body && depth < 10) {
      if (node.querySelector && (
        node.querySelector("button[data-testid='copy-query-button']") || 
        node.querySelector("button[aria-label='Copy Query']") || 
        node.querySelector("span[data-lexical-text='true']")
      )) {
        return node;
      }
      node = node.parentElement;
      depth++;
    }
    return el.parentElement || el;
  }

  function findUserMessageRootFrom(button) {
    let node = button;
    let depth = 0;
    while (node && node !== document.body && depth < 10) {
      if (node.querySelector && (
        node.querySelector(".whitespace-pre-line.text-pretty.break-words") || 
        node.querySelector("span[data-lexical-text='true']")
      )) {
        return node;
      }
      node = node.parentElement;
      depth++;
    }
    return button.parentElement || button;
  }

  function findAssistantMessageRootFrom(button) {
    let node = button;
    let depth = 0;
    while (node && node !== document.body && depth < 10) {
      if (node.querySelector && node.querySelector(
        ".prose.text-pretty.dark\\:prose-invert, [class*='prose'][class*='prose-invert'], [data-testid='answer'], [data-testid='assistant']"
      )) {
        return node;
      }
      node = node.parentElement;
      depth++;
    }
    return button.parentElement || button;
  }

  // ============================================================================
  // SCROLL & NAVIGATION HELPERS
  // ============================================================================

  async function pageDownOnce(scroller, delayMs = TIMING.SCROLL_DELAY, factor = 0.85) {
    if (!scroller) scroller = getScrollRoot();
    const delta = Math.max(200, Math.floor(scroller.clientHeight * factor));
    const beforeTop = scroller.scrollTop;
    scroller.scrollTop = Math.min(scroller.scrollTop + delta, scroller.scrollHeight);
    await sleep(delayMs);
    
    // Extra settle time if we actually scrolled
    if (scroller.scrollTop !== beforeTop) {
      await sleep(TIMING.SCROLL_SETTLE);
    }
  }

  async function preloadPageFully() {
    try {
      const scroller = getScrollRoot();
      window.focus();
      scroller.scrollTop = 0;
      await sleep(TIMING.PRELOAD_SCROLL_DELAY);

      let lastHeight = scroller.scrollHeight;
      let stableCount = 0;
      const maxTries = 40;

      for (let i = 0; i < maxTries && stableCount < TIMING.PRELOAD_STABLE_COUNT; i++) {
        scroller.scrollTop = scroller.scrollHeight;
        await sleep(TIMING.PRELOAD_SCROLL_DELAY);
        
        const newHeight = scroller.scrollHeight;
        if (newHeight > lastHeight + 10) {
          lastHeight = newHeight;
          stableCount = 0;
        } else {
          stableCount++;
        }
      }
      
      // Return to top
      scroller.scrollTop = 0;
      await sleep(TIMING.PRELOAD_SCROLL_DELAY);
    } catch (e) {
      console.warn("Preload scroll encountered an issue:", e);
    }
  }

  function simulateHover(element) {
    try {
      const rect = element.getBoundingClientRect();
      const x = rect.left + Math.min(20, Math.max(2, rect.width / 3));
      const y = rect.top + Math.min(20, Math.max(2, rect.height / 3));
      const opts = { bubbles: true, clientX: x, clientY: y };
      element.dispatchEvent(new MouseEvent("mouseenter", opts));
      element.dispatchEvent(new MouseEvent("mouseover", opts));
      element.dispatchEvent(new MouseEvent("mousemove", opts));
    } catch (e) {
      // best effort
    }
  }

  async function waitForFocus(timeoutMs = TIMING.FOCUS_TIMEOUT) {
    if (document.hasFocus()) return true;

    const startTime = Date.now();
    const overlay = document.getElementById('perplexity-focus-overlay');
    if (overlay) overlay.style.display = 'flex';

    while (!document.hasFocus() && (Date.now() - startTime) < timeoutMs) {
      window.focus();
      await sleep(TIMING.FOCUS_CHECK_INTERVAL);
    }

    if (overlay) overlay.style.display = 'none';
    return document.hasFocus();
  }

  async function readClipboardWithRetries(maxRetries = TIMING.CLIPBOARD_MAX_RETRIES, delayMs = TIMING.CLIPBOARD_RETRY_DELAY) {
    let last = "";
    for (let i = 0; i < maxRetries; i++) {
      if (!document.hasFocus()) {
        const gotFocus = await waitForFocus(10000);
        if (!gotFocus) {
          console.warn('Lost focus during clipboard read, retrying...');
        }
      }

      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim() && text !== last) {
          return text;
        }
        last = text;
      } catch (e) {
        // keep retrying
      }
      await sleep(delayMs);
    }
    try {
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  }

  // Expander handling
  const clickedExpanders = new WeakSet();

  function findExpanders(limit = 8) {
    const candidates = [];
    const patterns = /(show more|read more|view more|see more|expand|load more|view full|show all|continue reading)/i;
    const els = document.querySelectorAll('button, a, [role="button"]');
    for (const el of els) {
      if (candidates.length >= limit) break;
      if (clickedExpanders.has(el)) continue;
      const label = (el.getAttribute("aria-label") || "").trim();
      const text = (el.textContent || "").trim();
      if (patterns.test(label) || patterns.test(text)) {
        if (el.closest("pre, code")) continue;
        if (el.tagName && el.tagName.toLowerCase() === "a") {
          const href = (el.getAttribute("href") || "").trim();
          const target = (el.getAttribute("target") || "").trim().toLowerCase();
          const isExternal = /^https?:\/\//i.test(href);
          if (isExternal || target === "_blank") continue;
        }
        candidates.push(el);
      }
    }
    return candidates;
  }

  async function clickExpandersOnce(limit = 6) {
    const expanders = findExpanders(limit);
    if (expanders.length === 0) return false;
    for (const el of expanders) {
      try {
        clickedExpanders.add(el);
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        await sleep(TIMING.EXPANDER_CLICK_DELAY / 2);
        el.click();
        await sleep(TIMING.EXPANDER_CLICK_DELAY);
      } catch {}
    }
    await sleep(TIMING.EXPANDER_SETTLE);
    return true;
  }

  // ============================================================================
  // BUTTON HELPER FUNCTIONS
  // ============================================================================

  function getViewportQueryButtons() {
    const buttons = Array.from(document.querySelectorAll(
      'button[data-testid="copy-query-button"], button[aria-label="Copy Query"]'
    ));
    return buttons.filter((btn) => isInViewport(btn) && !btn.closest("pre,code"));
  }

  function getViewportResponseButtons() {
    const buttons = Array.from(document.querySelectorAll('button[aria-label="Copy"]')).filter((btn) => {
      return btn.querySelector("svg.tabler-icon") || 
             btn.querySelector("svg.tabler-icon-copy") || 
             btn.querySelector("svg");
    });
    return buttons.filter((btn) => isInViewport(btn) && !btn.closest("pre,code"));
  }

  async function clickVisibleButtonAndGetClipboard(button) {
    try {
      window.focus();
      simulateHover(button);
      await sleep(TIMING.HOVER_DELAY);
      button.focus();
      button.click();
      await sleep(TIMING.CLIPBOARD_READ_DELAY);
      return await readClipboardWithRetries(TIMING.CLIPBOARD_MAX_RETRIES, TIMING.CLIPBOARD_RETRY_DELAY);
    } catch (e) {
      return "";
    }
  }

  async function clickButtonAndGetClipboard(button) {
    window.focus();
    button.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
    await sleep(TIMING.DOM_SETTLE);
    simulateHover(button);
    await sleep(TIMING.HOVER_DELAY);
    button.focus();
    button.click();
    await sleep(TIMING.BUTTON_CLICK_DELAY);
    window.focus();
    return await readClipboardWithRetries(TIMING.CLIPBOARD_MAX_RETRIES, TIMING.CLIPBOARD_RETRY_DELAY);
  }

  function collectAnchoredMessageRootsOnce() {
    const roots = new Map();

    const queryButtons = Array.from(document.querySelectorAll(
      'button[data-testid="copy-query-button"], button[aria-label="Copy Query"]'
    ));
    for (const btn of queryButtons) {
      if (isCodeCopyButton(btn)) continue;
      const root = findUserMessageRootFrom(btn);
      const top = root.getBoundingClientRect().top + window.scrollY || 
                  btn.getBoundingClientRect().top + window.scrollY;
      const obj = roots.get(root) || { rootEl: root, top, queryButton: null, responseButton: null };
      obj.queryButton = obj.queryButton || btn;
      obj.top = Math.min(obj.top, top);
      roots.set(root, obj);
    }

    const responseButtons = Array.from(document.querySelectorAll('button[aria-label="Copy"]')).filter((btn) => {
      return btn.querySelector("svg.tabler-icon") || 
             btn.querySelector("svg.tabler-icon-copy") || 
             btn.querySelector("svg");
    });
    for (const btn of responseButtons) {
      if (isCodeCopyButton(btn)) continue;
      const root = findAssistantMessageRootFrom(btn);
      const hasAnswer = !!root.querySelector(
        ".prose.text-pretty.dark\\:prose-invert, [class*='prose'][class*='prose-invert']"
      );
      if (!hasAnswer) continue;
      const top = root.getBoundingClientRect().top + window.scrollY || 
                  btn.getBoundingClientRect().top + window.scrollY;
      const obj = roots.get(root) || { rootEl: root, top, queryButton: null, responseButton: null };
      obj.responseButton = obj.responseButton || btn;
      obj.top = Math.min(obj.top, top);
      roots.set(root, obj);
    }

    return Array.from(roots.values()).sort((a, b) => a.top - b.top);
  }

  // ============================================================================
  // EXTRACTION METHODS
  // ============================================================================

  // Method 1: Page-down with button clicking (most reliable)
  async function extractByPageDownClickButtons(citationStyle) {
    const conversation = [];
    const processedContent = new Set();
    const processedQueryButtons = new WeakSet();
    const processedAnswerButtons = new WeakSet();

    const scroller = getScrollRoot();
    scroller.scrollTop = 0;
    await sleep(TIMING.SCROLL_SETTLE);

    let stableBottomCount = 0;
    let scrollAttempt = 0;

    while (scrollAttempt < TIMING.MAX_SCROLL_ATTEMPTS && stableBottomCount < TIMING.EXTRACTION_STABLE_COUNT) {
      scrollAttempt++;
      let processedSomething = false;

      const qButtons = getViewportQueryButtons().map((btn) => ({ btn, role: "User" }));
      const rButtons = getViewportResponseButtons().map((btn) => ({ btn, role: "Assistant" }));
      const allButtons = [...qButtons, ...rButtons].sort((a, b) => {
        const at = a.btn.getBoundingClientRect().top;
        const bt = b.btn.getBoundingClientRect().top;
        return at - bt;
      });

      for (const item of allButtons) {
        const { btn, role } = item;
        if (role === "User") {
          if (processedQueryButtons.has(btn)) continue;
          processedQueryButtons.add(btn);
          const text = (await clickVisibleButtonAndGetClipboard(btn))?.trim();
          if (text) {
            const hash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length + "|U";
            if (!processedContent.has(hash)) {
              processedContent.add(hash);
              conversation.push({ role: "User", content: text });
              processedSomething = true;
            }
          }
        } else {
          if (processedAnswerButtons.has(btn)) continue;
          processedAnswerButtons.add(btn);
          const raw = (await clickVisibleButtonAndGetClipboard(btn))?.trim();
          if (raw) {
            const hash = raw.substring(0, 200) + raw.substring(Math.max(0, raw.length - 50)) + raw.length;
            if (!processedContent.has(hash)) {
              processedContent.add(hash);
              const processedMarkdown = processCopiedMarkdown(raw, citationStyle);
              conversation.push({ role: "Assistant", content: processedMarkdown });
              processedSomething = true;
            }
          }
        }
      }

      if (!processedSomething) {
        await clickExpandersOnce(6);
      }

      const beforeBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      await pageDownOnce(scroller, TIMING.SCROLL_DELAY, 0.85);
      const afterBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      
      if (beforeBottom && afterBottom && !processedSomething) {
        stableBottomCount++;
      } else {
        stableBottomCount = 0;
      }
    }

    return conversation;
  }

  // Method 2: Single-pass DOM scan (no button clicking)
  async function extractByDomScanSinglePass(citationStyle) {
    const processedContent = new Set();
    const collected = [];

    const scroller = getScrollRoot();
    scroller.scrollTop = 0;
    await sleep(TIMING.SCROLL_SETTLE);

    let stableBottomCount = 0;
    let scrollAttempt = 0;

    while (scrollAttempt < TIMING.MAX_SCROLL_ATTEMPTS && stableBottomCount < TIMING.EXTRACTION_STABLE_COUNT) {
      scrollAttempt++;
      const beforeCount = collected.length;

      const batch = collectDomMessagesInOrderOnce(citationStyle, processedContent);
      if (batch.length > 0) {
        for (const item of batch) {
          collected.push(item);
        }
      } else {
        const expanded = await clickExpandersOnce(8);
        if (expanded) {
          const batch2 = collectDomMessagesInOrderOnce(citationStyle, processedContent);
          if (batch2.length > 0) {
            for (const item of batch2) collected.push(item);
          }
        }
      }

      const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      await pageDownOnce(scroller, TIMING.SCROLL_DELAY, 0.85);
      const atBottomAfter = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;

      if (atBottom && atBottomAfter && collected.length === beforeCount) {
        stableBottomCount++;
      } else {
        stableBottomCount = 0;
      }
    }

    return collected;
  }

  function collectDomMessagesInOrderOnce(citationStyle, processedContent) {
    const results = [];
    const container = getThreadContainer();

    const assistantSelector = ".prose.text-pretty.dark\\:prose-invert, [class*='prose'][class*='prose-invert']";
    const userSelectors = [
      ".whitespace-pre-line.text-pretty.break-words", 
      ".group\\/query span[data-lexical-text='true']", 
      "h1.group\\/query span[data-lexical-text='true']", 
      "span[data-lexical-text='true']"
    ];
    const combined = `${assistantSelector}, ${userSelectors.join(", ")}`;

    const nodes = container.querySelectorAll(combined);
    nodes.forEach((node) => {
      if (node.matches(assistantSelector)) {
        const cloned = node.cloneNode(true);
        const md = htmlToMarkdown(cloned.innerHTML, citationStyle).trim();
        if (!md) return;
        const hash = md.substring(0, 200) + md.substring(Math.max(0, md.length - 50)) + md.length;
        if (processedContent.has(hash)) return;
        processedContent.add(hash);
        results.push({ role: "Assistant", content: md });
      } else {
        const root = findUserMessageRootFromElement(node);
        if (root.closest && (
          root.closest(".prose.text-pretty.dark\\:prose-invert") || 
          root.closest("[class*='prose'][class*='prose-invert']")
        )) return;
        
        const spans = root.querySelectorAll("span[data-lexical-text='true']");
        let text = "";
        if (spans.length > 0) {
          text = Array.from(spans)
            .map((s) => (s.textContent || "").trim())
            .join(" ")
            .trim();
        } else {
          text = (node.textContent || "").trim();
        }
        if (!text || text.length < 2) return;
        
        const hasCopyQueryButton = !!(root.querySelector && (
          root.querySelector("button[data-testid='copy-query-button']") || 
          root.querySelector("button[aria-label='Copy Query']")
        ));
        if (!hasCopyQueryButton && text.length < 10) return;
        
        const hash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length + "|U";
        if (processedContent.has(hash)) return;
        processedContent.add(hash);
        results.push({ role: "User", content: text });
      }
    });

    return results;
  }

  // Method 3: Anchored copy button approach
  async function extractUsingCopyButtons(citationStyle) {
    globalCitations.reset();

    try {
      const anchored = await processAnchoredButtonsWithProgressiveScroll(citationStyle);
      if (anchored.length > 0) {
        return anchored;
      }
      return await scrollAndProcessButtons(citationStyle);
    } catch (e) {
      console.error("Copy button extraction failed:", e);
      return [];
    }
  }

  async function processAnchoredButtonsWithProgressiveScroll(citationStyle) {
    const conversation = [];
    const processedContent = new Set();
    const processedButtons = new WeakSet();

    await preloadPageFully();

    const scroller = getScrollRoot();
    scroller.scrollTop = 0;
    await sleep(TIMING.SCROLL_SETTLE);

    let stableCount = 0;
    let scrollAttempt = 0;

    while (scrollAttempt < TIMING.MAX_SCROLL_ATTEMPTS && stableCount < TIMING.EXTRACTION_STABLE_COUNT) {
      scrollAttempt++;

      const roots = collectAnchoredMessageRootsOnce();
      let processedSomethingThisPass = false;

      for (const item of roots) {
        const { queryButton, responseButton } = item;

        if (queryButton && !processedButtons.has(queryButton)) {
          try {
            const text = (await clickButtonAndGetClipboard(queryButton))?.trim();
            if (text) {
              const contentHash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length;
              if (!processedContent.has(contentHash)) {
                processedContent.add(contentHash);
                conversation.push({ role: "User", content: text });
                processedSomethingThisPass = true;
              }
            }
          } catch (e) {
            console.warn("Query copy failed:", e);
          } finally {
            processedButtons.add(queryButton);
          }
        }

        if (responseButton && !processedButtons.has(responseButton)) {
          try {
            const raw = (await clickButtonAndGetClipboard(responseButton))?.trim();
            if (raw) {
              const contentHash = raw.substring(0, 200) + raw.substring(Math.max(0, raw.length - 50)) + raw.length;
              if (!processedContent.has(contentHash)) {
                processedContent.add(contentHash);
                const processedMarkdown = processCopiedMarkdown(raw, citationStyle);
                conversation.push({ role: "Assistant", content: processedMarkdown });
                processedSomethingThisPass = true;
              }
            }
          } catch (e) {
            console.warn("Response copy failed:", e);
          } finally {
            processedButtons.add(responseButton);
          }
        }
      }

      if (!processedSomethingThisPass) {
        stableCount++;
      } else {
        stableCount = 0;
      }

      await pageDownOnce(scroller, TIMING.SCROLL_DELAY, 0.85);
    }

    // Final scan
    const finalRoots = collectAnchoredMessageRootsOnce();
    for (const { queryButton, responseButton } of finalRoots) {
      if (queryButton && !processedButtons.has(queryButton)) {
        try {
          const text = (await clickButtonAndGetClipboard(queryButton))?.trim();
          if (text) {
            const contentHash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length;
            if (!processedContent.has(contentHash)) {
              processedContent.add(contentHash);
              conversation.push({ role: "User", content: text });
            }
          }
        } catch {}
      }
      if (responseButton && !processedButtons.has(responseButton)) {
        try {
          const raw = (await clickButtonAndGetClipboard(responseButton))?.trim();
          if (raw) {
            const contentHash = raw.substring(0, 200) + raw.substring(Math.max(0, raw.length - 50)) + raw.length;
            if (!processedContent.has(contentHash)) {
              processedContent.add(contentHash);
              const processedMarkdown = processCopiedMarkdown(raw, citationStyle);
              conversation.push({ role: "Assistant", content: processedMarkdown });
            }
          }
        } catch {}
      }
    }

    scroller.scrollTop = 0;
    await sleep(TIMING.SCROLL_SETTLE);

    return conversation;
  }

  async function scrollAndProcessButtons(citationStyle) {
    console.log("Starting robust scroll and process...");

    const conversation = [];
    const processedContent = new Set();
    const processedButtons = new Set();

    window.focus();

    const scroller = getScrollRoot();
    scroller.scrollTop = 0;
    await sleep(TIMING.SCROLL_SETTLE);

    let stableCount = 0;
    let scrollAttempt = 0;
    let lastButtonCount = 0;

    while (scrollAttempt < TIMING.MAX_SCROLL_ATTEMPTS && stableCount < TIMING.EXTRACTION_STABLE_COUNT) {
      scrollAttempt++;

      const currentButtonCount = document.querySelectorAll(
        'button[data-testid="copy-query-button"], button[aria-label="Copy Query"], button[aria-label="Copy"]'
      ).length;

      console.log(`Page Down attempt ${scrollAttempt}: buttons=${currentButtonCount}`);

      await processVisibleButtons();

      if (currentButtonCount > lastButtonCount) {
        console.log(`Button count increased from ${lastButtonCount} to ${currentButtonCount}`);
        lastButtonCount = currentButtonCount;
        stableCount = 0;
      } else {
        stableCount++;
        console.log(`Button count stable at ${currentButtonCount} (stability: ${stableCount}/${TIMING.EXTRACTION_STABLE_COUNT})`);
      }

      await pageDownOnce(scroller, TIMING.SCROLL_DELAY, 0.85);
    }

    console.log(`Scroll complete after ${scrollAttempt} attempts. Found ${conversation.length} conversation items`);

    scroller.scrollTop = 0;
    await sleep(TIMING.SCROLL_SETTLE);

    return conversation;

    async function processVisibleButtons() {
      const allButtons = document.querySelectorAll("button");
      const copyButtons = [];

      allButtons.forEach((btn) => {
        if (processedButtons.has(btn)) return;

        const testId = btn.getAttribute("data-testid");
        const ariaLower = (btn.getAttribute("aria-label") || "").toLowerCase();
        if (testId === "copy-code-button" || testId === "copy-code" || 
            testId?.includes("copy-code") || ariaLower.includes("copy code") || 
            btn.closest("pre") || btn.closest("code")) {
          return;
        }

        const isQueryCopyButton = testId === "copy-query-button" || 
                                  btn.getAttribute("aria-label") === "Copy Query";
        const isResponseCopyButton = btn.getAttribute("aria-label") === "Copy" && (
          btn.querySelector("svg.tabler-icon") || 
          btn.querySelector("svg.tabler-icon-copy") || 
          btn.querySelector("svg")
        );

        if (isQueryCopyButton) {
          copyButtons.push({ el: btn, role: "User" });
        } else if (isResponseCopyButton) {
          copyButtons.push({ el: btn, role: "Assistant" });
        }
      });

      copyButtons.sort((a, b) => {
        const aTop = a.el.getBoundingClientRect().top + window.scrollY;
        const bTop = b.el.getBoundingClientRect().top + window.scrollY;
        return aTop - bTop;
      });

      console.log(`Found ${copyButtons.length} copy buttons in DOM`);

      for (const { el: button, role } of copyButtons) {
        if (processedButtons.has(button)) continue;

        try {
          processedButtons.add(button);
          window.focus();

          button.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "center",
          });
          await sleep(TIMING.DOM_SETTLE);

          button.focus();
          button.click();

          await sleep(TIMING.BUTTON_CLICK_DELAY);
          window.focus();

          const clipboardText = await navigator.clipboard.readText();

          if (clipboardText && clipboardText.trim().length > 0) {
            const trimmedContent = clipboardText.trim();
            const contentHash = trimmedContent.substring(0, 200) + 
                               trimmedContent.substring(Math.max(0, trimmedContent.length - 50)) + 
                               trimmedContent.length;

            if (processedContent.has(contentHash)) {
              console.log(`Skipping duplicate content (${clipboardText.length} chars)`);
              continue;
            }

            processedContent.add(contentHash);

            if (role === "User") {
              conversation.push({
                role: "User",
                content: trimmedContent,
              });
            } else {
              const processedMarkdown = processCopiedMarkdown(clipboardText, citationStyle);
              conversation.push({
                role: "Assistant",
                content: processedMarkdown,
              });
            }
          }
        } catch (e) {
          console.error(`Failed to copy from button:`, e);
        }
      }
    }
  }

  // MAIN EXTRACTION ORCHESTRATOR
  async function extractConversation(citationStyle) {
    globalCitations.reset();

    // Wait for page to settle before extraction
    await waitForPageIdle();
    await sleep(TIMING.SCROLL_SETTLE);

    // Method 1: Page-down with button clicking
    console.log("Trying Method 1: Page-down with button clicking...");
    const viaButtons = await extractByPageDownClickButtons(citationStyle);
    console.log(`Method 1 found ${viaButtons.length} items`);
    if (viaButtons.length >= 2) {
      console.log("✅ Using Method 1: Button clicking extraction");
      return viaButtons;
    }

    // Method 2: Single-pass DOM scan
    console.log("Trying Method 2: Single-pass DOM scan...");
    const domSingle = await extractByDomScanSinglePass(citationStyle);
    console.log(`Method 2 found ${domSingle.length} items`);
    if (domSingle.length >= 2) {
      console.log("✅ Using Method 2: DOM scan extraction");
      return domSingle;
    }

    // Method 3: Anchored copy button approach
    console.log("Trying Method 3: Anchored copy button approach...");
    const copyButtonApproach = await extractUsingCopyButtons(citationStyle);
    console.log(`Method 3 found ${copyButtonApproach.length} items`);
    if (copyButtonApproach.length >= 2) {
      console.log("✅ Using Method 3: Anchored button extraction");
      return copyButtonApproach;
    }

    console.log("❌ No content found with any method");
    return [];
  }

  // ============================================================================
  // MARKDOWN PROCESSING FUNCTIONS
  // ============================================================================

  function processCopiedMarkdown(markdown, citationStyle) {
    const referenceMatches = markdown.match(/\[(\d+)\]\(([^)]+)\)/g) || [];
    const localReferences = new Map();

    const plainRefs = markdown.match(/^\s*(\d+)\s+(https?:\/\/[^\s\n]+)/gm) || [];
    plainRefs.forEach((ref) => {
      const match = ref.match(/(\d+)\s+(https?:\/\/[^\s\n]+)/);
      if (match) {
        localReferences.set(match[1], match[2]);
      }
    });

    referenceMatches.forEach((ref) => {
      const match = ref.match(/\[(\d+)\]\(([^)]+)\)/);
      if (match) {
        localReferences.set(match[1], match[2]);
      }
    });

    let content = markdown
      .replace(/^\s*\d+\s+https?:\/\/[^\s\n]+$/gm, "")
      .replace(/^\s*\[(\d+)\]\([^)]+\)$/gm, "")
      .replace(/\n{3,}/g, "\n\n");

    const localToGlobalMap = new Map();

    localReferences.forEach((url, localNum) => {
      const globalNum = globalCitations.addCitation(url);
      localToGlobalMap.set(localNum, globalNum);
    });

    content = content.replace(/\[(\d+)\]\(([^)]+)\)/g, (m, localNum, url) => {
      if (!localReferences.has(localNum)) {
        localReferences.set(localNum, url);
        if (!localToGlobalMap.has(localNum)) {
          const globalNum = globalCitations.addCitation(url);
          localToGlobalMap.set(localNum, globalNum);
        }
      }
      return `[${localNum}]`;
    });

    function buildEndnotesRun(localNums) {
      return localNums.map((n) => {
        const g = localToGlobalMap.get(n) || n;
        return `[${g}]`;
      }).join("");
    }

    function buildFootnotesRun(localNums) {
      return localNums.map((n) => {
        const g = localToGlobalMap.get(n) || n;
        return `[^${g}]`;
      }).join("");
    }

    function buildInlineRun(localNums) {
      return localNums.map((n) => {
        const url = localReferences.get(n) || "";
        const g = localToGlobalMap.get(n) || n;
        return url ? `[${g}](${url})` : `[${g}]`;
      }).join("");
    }

    function buildParenthesizedRun(localNums) {
      return localNums.map((n) => {
        const url = localReferences.get(n) || "";
        const g = localToGlobalMap.get(n) || n;
        const core = url ? `[${g}](${url})` : `[${g}]`;
        return `(${core})`;
      }).join(" ");
    }

    function buildNamedRun(localNums) {
      return localNums.map((n) => {
        const url = localReferences.get(n) || "";
        const domain = extractDomainName(url) || "source";
        const core = url ? `[${domain}](${url})` : `[${domain}]`;
        return `(${core})`;
      }).join(" ");
    }

    content = content.replace(/(?:\s*\[\d+\])+/g, (run) => {
      const nums = Array.from(run.matchAll(/\[(\d+)\]/g)).map((m) => m[1]);
      if (nums.length === 0) return run;
      if (citationStyle === CITATION_STYLES.NONE) return "";
      if (citationStyle === CITATION_STYLES.ENDNOTES) return buildEndnotesRun(nums);
      if (citationStyle === CITATION_STYLES.FOOTNOTES) return buildFootnotesRun(nums);
      if (citationStyle === CITATION_STYLES.INLINE) return buildInlineRun(nums);
      if (citationStyle === CITATION_STYLES.PARENTHESIZED) return buildParenthesizedRun(nums);
      if (citationStyle === CITATION_STYLES.NAMED) return buildNamedRun(nums);
      return run;
    });

    content = content.replace(/\){3,}/g, "))");
    content = content.replace(/\(\({2,}/g, "((");

    const prefs = getPreferences();
    if (prefs.addExtraNewlines) {
      content = content.replace(/\n{3,}/g, "\n\n");
    } else {
      content = content
        .replace(/\n+/g, "\n")
        .replace(/\n\s*\n/g, "\n");
    }

    content = content.trim();

    return content;
  }

  function htmlToMarkdown(html, citationStyle = CITATION_STYLES.PARENTHESIZED) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll("code").forEach((codeElem) => {
      if (codeElem.style.whiteSpace && codeElem.style.whiteSpace.includes("pre-wrap")) {
        if (codeElem.parentElement.tagName.toLowerCase() !== "pre") {
          const pre = document.createElement("pre");
          let language = "";
          const prevDiv = codeElem.closest("div.pr-lg")?.previousElementSibling;
          if (prevDiv) {
            const langDiv = prevDiv.querySelector(".text-text-200");
            if (langDiv) {
              language = langDiv.textContent.trim().toLowerCase();
              langDiv.remove();
            }
          }
          pre.dataset.language = language;
          pre.innerHTML = "<code>" + codeElem.innerHTML + "</code>";
          codeElem.parentNode.replaceChild(pre, codeElem);
        }
      }
    });

    const citations = [
      ...tempDiv.querySelectorAll("a.citation"),
      ...tempDiv.querySelectorAll(".citation.inline"),
    ];

    const urlToNumber = new Map();
    const citationRefs = new Map();
    let nextCitationNumber = 1;

    citations.forEach((citation) => {
      let href = null;
      let sourceName = null;
      let isMultiCitation = false;

      if (citation.tagName === "A" && citation.classList.contains("citation")) {
        href = citation.getAttribute("href");
      } else if (citation.classList.contains("citation") && citation.classList.contains("inline")) {
        const ariaLabel = citation.getAttribute("aria-label");
        if (ariaLabel) {
          sourceName = extractSourceName(ariaLabel);
        }

        if (!sourceName) {
          const numberSpan = citation.querySelector('.text-3xs, [class*="text-3xs"]');
          if (numberSpan) {
            const spanText = numberSpan.textContent;
            sourceName = extractSourceName(spanText);
            isMultiCitation = /\+\d+$/.test(spanText.trim());
          }
        }

        const nestedAnchor = citation.querySelector("a[href]");
        href = nestedAnchor ? nestedAnchor.getAttribute("href") : null;

        if (isMultiCitation) {
          citation.setAttribute("data-is-multi-citation", "true");
        }
      }

      if (href) {
        const normalizedUrl = normalizeUrl(href);
        if (!urlToNumber.has(normalizedUrl)) {
          urlToNumber.set(normalizedUrl, nextCitationNumber);
          citationRefs.set(nextCitationNumber, {
            href,
            sourceName,
            normalizedUrl,
            isMultiCitation,
          });
          nextCitationNumber++;
        }
      }
    });

    tempDiv.querySelectorAll(".citation").forEach((el) => {
      let href = null;
      let sourceName = null;
      let isMultiCitation = false;

      if (el.tagName === "A" && el.classList.contains("citation")) {
        href = el.getAttribute("href");
      } else if (el.classList.contains("citation") && el.classList.contains("inline")) {
        const ariaLabel = el.getAttribute("aria-label");
        if (ariaLabel) {
          sourceName = extractSourceName(ariaLabel);
        }

        if (!sourceName) {
          const numberSpan = el.querySelector('.text-3xs, [class*="text-3xs"]');
          if (numberSpan) {
            const spanText = numberSpan.textContent;
            sourceName = extractSourceName(spanText);
            isMultiCitation = /\+\d+$/.test(spanText.trim());
          }
        }

        const nestedAnchor = el.querySelector("a[href]");
        href = nestedAnchor ? nestedAnchor.getAttribute("href") : null;
      }

      if (href) {
        const normalizedUrl = normalizeUrl(href);
        const number = urlToNumber.get(normalizedUrl);

        if (number) {
          let citationText = "";
          let citationUrl = href;

          if (isMultiCitation) {
            const numberSpan = el.querySelector('.text-3xs, [class*="text-3xs"]');
            const countMatch = numberSpan ? numberSpan.textContent.match(/\+(\d+)$/) : null;
            const count = countMatch ? parseInt(countMatch[1]) : 2;

            if (citationStyle === CITATION_STYLES.NONE) {
              citationText = "";
            } else if (citationStyle === CITATION_STYLES.NAMED && sourceName) {
              citationText = ` [${sourceName} +${count} more](${citationUrl}) `;
            } else {
              citationText = ` [${number} +${count} more](${citationUrl}) `;
            }
          } else {
            if (citationStyle === CITATION_STYLES.NONE) {
              citationText = "";
            } else if (citationStyle === CITATION_STYLES.INLINE) {
              citationText = ` [${number}](${citationUrl}) `;
            } else if (citationStyle === CITATION_STYLES.PARENTHESIZED) {
              citationText = ` ([${number}](${citationUrl})) `;
            } else if (citationStyle === CITATION_STYLES.NAMED && sourceName) {
              citationText = ` [${sourceName}](${citationUrl}) `;
            } else if (citationStyle === CITATION_STYLES.FOOTNOTES) {
              citationText = ` [^${number}] `;
            } else {
              citationText = ` [${number}] `;
            }
          }

          el.replaceWith(citationText);
        }
      }
    });

    let text = tempDiv.innerHTML;

    text = text
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "# $1")
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "## $1")
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "### $1")
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, "#### $1")
      .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/g, "##### $1")
      .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/g, "###### $1")
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, content) => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? `${content}\n\n` : `${content}\n`;
      })
      .replace(/<br\s*\/?>(?!\n)/g, () => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? "\n\n" : "\n";
      })
      .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
      .replace(/<em>([\s\S]*?)<\/em>/g, "*$1*")
      .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (_, content) => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? `${content}\n\n` : `${content}\n`;
      })
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, content) => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? ` - ${content}\n\n` : ` - ${content}\n`;
      });

    // Handle tables
    text = text.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (match) => {
      const tableDiv = document.createElement("div");
      tableDiv.innerHTML = match;
      const rows = [];

      const headerRows = tableDiv.querySelectorAll("thead tr");
      if (headerRows.length > 0) {
        headerRows.forEach((row) => {
          const cells = [...row.querySelectorAll("th, td")].map((cell) => cell.textContent.trim() || " ");
          if (cells.length > 0) {
            rows.push(`| ${cells.join(" | ")} |`);
            rows.push(`| ${cells.map(() => "---").join(" | ")} |`);
          }
        });
      }

      const bodyRows = tableDiv.querySelectorAll("tbody tr");
      bodyRows.forEach((row) => {
        const cells = [...row.querySelectorAll("td")].map((cell) => cell.textContent.trim() || " ");
        if (cells.length > 0) {
          rows.push(`| ${cells.join(" | ")} |`);
        }
      });

      return rows.length > 0 ? `\n\n${rows.join("\n")}\n\n` : "";
    });

    text = text
      .replace(/<pre[^>]*data-language="([^"]*)"[^>]*><code>([\s\S]*?)<\/code><\/pre>/g, "```$1\n$2\n```")
      .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, "```\n$1\n```")
      .replace(/<code>(.*?)<\/code>/g, "`$1`")
      .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
      .replace(/<[^>]+>/g, "");

    text = text.replace(/^(\s*)\*\*([^*\n]+)\*\*(?!.*\n\s*-)/gm, "$1### $2");
    text = text.replace(/^(\s*-\s+)###\s+([^\n]+)/gm, function (_, listPrefix, content) {
      if (content.includes("**")) {
        return `${listPrefix}${content}`;
      } else {
        return `${listPrefix}**${content}**`;
      }
    });

    text = text.replace(/\n\s*-\s+/g, "\n- ");
    text = text.replace(/([^\n])(\n#{1,3} )/g, "$1\n\n$2");
    text = text.replace(/^(\s*-\s+.*?)(\s\*\*\s*)$/gm, "$1");
    text = text.replace(/\*\*([^*]+)(\[[0-9]+\]\([^)]+\))\s*\*\*/g, "**$1**$2");
    text = text.replace(/\*\*([^*]+)(\(\[[0-9]+\]\([^)]+\)\))\s*\*\*/g, "**$1**$2");
    text = text.replace(/(\[[0-9]+\]\([^)]+\))\s*\*\*/g, "$1");
    text = text.replace(/(\(\[[0-9]+\]\([^)]+\)\))\s*\*\*/g, "$1");

    text = text
      .replace(/^[\s\n]+|[\s\n]+$/g, "")
      .replace(/^\s+/gm, "")
      .replace(/[ \t]+$/gm, "")
      .trim();

    const prefs = getPreferences();
    if (prefs.addExtraNewlines) {
      text = text.replace(/\n{3,}/g, "\n\n");
    } else {
      text = text
        .replace(/\n+/g, "\n")
        .replace(/\n\s*\n/g, "\n");
    }

    if (citationStyle === CITATION_STYLES.INLINE || citationStyle === CITATION_STYLES.PARENTHESIZED) {
      text = text.replace(/ (?=\.)/g, "");
    }

    if (citationStyle === CITATION_STYLES.ENDNOTES && citationRefs.size > 0) {
      text += "\n\n### Sources\n";
      for (const [number, { href }] of citationRefs) {
        text += `[${number}] ${href}\n`;
      }
    }

    if (citationStyle === CITATION_STYLES.FOOTNOTES && citationRefs.size > 0) {
      text += "\n\n";
      for (const [number, { href }] of citationRefs) {
        text += `[^${number}]: ${href}\n`;
      }
    }

    return text;
  }

  function formatMarkdown(conversations) {
    const title = document.title.replace(" | Perplexity", "").trim();
    const timestamp = new Date().toISOString().split("T")[0];
    const prefs = getPreferences();

    let markdown = "";

    if (prefs.includeFrontmatter) {
      markdown += "---\n";
      markdown += `title: ${title}\n`;
      markdown += `date: ${timestamp}\n`;
      markdown += `source: ${window.location.href}\n`;
      markdown += "---\n\n";
    }

    if (prefs.titleAsH1) {
      markdown += `# ${title}\n\n`;
    }

    conversations.forEach((conv, index) => {
      if (conv.role === "Assistant") {
        let cleanContent = conv.content.trim();

        if (cleanContent.match(/^#+ /)) {
          if (prefs.formatStyle === FORMAT_STYLES.FULL) {
            markdown += `**${conv.role}:**\n\n${cleanContent}\n\n`;
          } else {
            markdown += `${cleanContent}\n\n`;
          }
        } else {
          if (prefs.formatStyle === FORMAT_STYLES.FULL) {
            markdown += `**${conv.role}:** ${cleanContent}\n\n`;
          } else {
            markdown += `${cleanContent}\n\n`;
          }
        }

        const nextAssistant = conversations.slice(index + 1).find((c) => c.role === "Assistant");
        if (nextAssistant) {
          markdown += "---\n\n";
        }
      } else if (conv.role === "User" && prefs.formatStyle === FORMAT_STYLES.FULL) {
        markdown += `**${conv.role}:** ${conv.content.trim()}\n\n`;
        markdown += "---\n\n";
      }
    });

    if (prefs.citationStyle === CITATION_STYLES.ENDNOTES && globalCitations.citationRefs.size > 0) {
      markdown += "\n\n### Sources\n";
      for (const [number, { href }] of globalCitations.citationRefs) {
        markdown += `\n[${number}] ${href}`;
      }
      markdown += "\n";
    }

    if (prefs.citationStyle === CITATION_STYLES.FOOTNOTES && globalCitations.citationRefs.size > 0) {
      markdown += "\n\n";
      for (const [number, { href }] of globalCitations.citationRefs) {
        markdown += `[^${number}]: ${href}\n`;
      }
    }

    return markdown.trim();
  }

  // ============================================================================
  // UI FUNCTIONS
  // ============================================================================

  function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard(content) {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }

  function installNavBlocker() {
    const clickBlocker = (e) => {
      try {
        const anchor = e.target && e.target.closest && e.target.closest('a[href], area[href]');
        if (!anchor) return;
        const href = (anchor.getAttribute('href') || '').trim();
        const target = (anchor.getAttribute('target') || '').trim().toLowerCase();
        const isExternal = /^https?:\/\//i.test(href);
        if (isExternal || target === '_blank') {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      } catch {}
    };
    document.addEventListener('click', clickBlocker, true);

    const originalOpen = window.open;
    window.open = function () { return null; };

    return function removeNavBlocker() {
      try { document.removeEventListener('click', clickBlocker, true); } catch {}
      try { window.open = originalOpen; } catch {}
    };
  }

  function addExportButton() {
    const existingControls = document.getElementById("perplexity-export-controls");
    if (existingControls) {
      existingControls.remove();
    }

    const container = document.createElement("div");
    container.id = "perplexity-export-controls";
    container.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      align-items: stretch;
      z-index: 99999;
      font-family: inherit;
    `;

    const exportButton = document.createElement("button");
    exportButton.id = "perplexity-export-btn";
    exportButton.type = "button";
    exportButton.textContent = "Save as Markdown";
    exportButton.style.cssText = `
      padding: 4px 8px;
      background-color: #30b8c6;
      color: black;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background-color 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const optionsWrapper = document.createElement("div");
    optionsWrapper.style.cssText = `position: relative; display: flex;`;

    const optionsButton = document.createElement("button");
    optionsButton.id = "perplexity-export-options-btn";
    optionsButton.type = "button";
    optionsButton.setAttribute("aria-haspopup", "true");
    optionsButton.setAttribute("aria-expanded", "false");
    optionsButton.style.cssText = `
      padding: 4px 8px;
      background-color: #30b8c6;
      color: black;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background-color 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      white-space: nowrap;
    `;

    const menu = document.createElement("div");
    menu.id = "perplexity-export-options-menu";
    menu.style.cssText = `
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      display: none;
      flex-direction: column;
      gap: 10px;
      min-width: 280px;
      background: #1F2121;
      color: white;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    `;

    optionsWrapper.appendChild(optionsButton);
    container.appendChild(exportButton);
    container.appendChild(optionsWrapper);
    container.appendChild(menu);

    function updateOptionsButtonLabel() {
      optionsButton.textContent = `Options`;
      optionsButton.setAttribute("aria-label", `Export options`);
    }

    function updateExportButtonLabel() {
      const prefs = getPreferences();
      const label = prefs.exportMethod === EXPORT_METHODS.CLIPBOARD ? "Copy as Markdown" : "Save as Markdown";
      exportButton.textContent = label;
    }

    function createOptionButton(label, value, currentValue, onSelect, tooltip) {
      const optionBtn = document.createElement("button");
      optionBtn.type = "button";
      optionBtn.textContent = label;
      if (tooltip) {
        optionBtn.setAttribute("title", tooltip);
      }
      optionBtn.style.cssText = `
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid ${value === currentValue ? "#30b8c6" : "#4a5568"};
        background-color: ${value === currentValue ? "#30b8c6" : "#2d3748"};
        color: ${value === currentValue ? "#0a0e13" : "#f7fafc"};
        font-size: 11px;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      optionBtn.addEventListener("mouseenter", () => {
        if (value !== currentValue) {
          optionBtn.style.borderColor = "#30b8c6";
          optionBtn.style.backgroundColor = "#4a5568";
        }
      });
      optionBtn.addEventListener("mouseleave", () => {
        if (value !== currentValue) {
          optionBtn.style.borderColor = "#4a5568";
          optionBtn.style.backgroundColor = "#2d3748";
        }
      });
      optionBtn.addEventListener("click", () => {
        onSelect(value);
        renderOptionsMenu();
        updateOptionsButtonLabel();
        updateExportButtonLabel();
      });
      return optionBtn;
    }

    function appendOptionGroup(sectionEl, label, options, currentValue, onSelect, labelTooltip) {
      const group = document.createElement("div");
      group.style.display = "flex";
      group.style.flexDirection = "column";
      group.style.gap = "6px";

      if (label) {
        const groupLabel = document.createElement("div");
        groupLabel.textContent = label;
        groupLabel.style.cssText = "font-size: 12px; font-weight: 600; color: #d1d5db;";
        if (labelTooltip) {
          groupLabel.setAttribute("title", labelTooltip);
          groupLabel.style.cursor = "help";
        }
        group.appendChild(groupLabel);
      }

      const list = document.createElement("div");
      list.style.display = "grid";
      list.style.gridTemplateColumns = "1fr 1fr";
      list.style.gap = "4px";

      options.forEach((opt) => {
        list.appendChild(createOptionButton(opt.label, opt.value, currentValue, onSelect, opt.tooltip));
      });

      group.appendChild(list);
      sectionEl.appendChild(group);
    }

    function renderOptionsMenu() {
      const prefs = getPreferences();
      menu.innerHTML = "";

      const citationSection = document.createElement("div");
      citationSection.style.display = "flex";
      citationSection.style.flexDirection = "column";
      citationSection.style.gap = "6px";

      const citationHeading = document.createElement("div");
      citationHeading.textContent = "Citation Style";
      citationHeading.style.cssText = "font-size: 13px; font-weight: 700; color: #f9fafb;";
      citationSection.appendChild(citationHeading);

      appendOptionGroup(
        citationSection,
        "Format",
        [
          { label: "Endnotes", value: CITATION_STYLES.ENDNOTES, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.ENDNOTES] },
          { label: "Footnotes", value: CITATION_STYLES.FOOTNOTES, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.FOOTNOTES] },
          { label: "Inline", value: CITATION_STYLES.INLINE, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.INLINE] },
          { label: "Parenthesized", value: CITATION_STYLES.PARENTHESIZED, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.PARENTHESIZED] },
          { label: "Named", value: CITATION_STYLES.NAMED, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.NAMED] },
          { label: "No Citations", value: CITATION_STYLES.NONE, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.NONE] },
        ],
        prefs.citationStyle,
        (next) => GM_setValue("citationStyle", next)
      );

      menu.appendChild(citationSection);

      const outputSection = document.createElement("div");
      outputSection.style.display = "flex";
      outputSection.style.flexDirection = "column";
      outputSection.style.gap = "6px";

      const outputHeading = document.createElement("div");
      outputHeading.textContent = "Output Style";
      outputHeading.style.cssText = "font-size: 13px; font-weight: 700; color: #f9fafb;";
      outputSection.appendChild(outputHeading);

      appendOptionGroup(
        outputSection,
        "Layout",
        [
          { label: "Full (User & Assistant)", value: FORMAT_STYLES.FULL },
          { label: "Concise (content only)", value: FORMAT_STYLES.CONCISE },
        ],
        prefs.formatStyle,
        (next) => GM_setValue("formatStyle", next)
      );

      appendOptionGroup(
        outputSection,
        "Spacing",
        [
          { label: "Standard", value: false },
          { label: "Extra newlines", value: true },
        ],
        prefs.addExtraNewlines,
        (next) => GM_setValue("addExtraNewlines", next)
      );

      appendOptionGroup(
        outputSection,
        "Frontmatter",
        [
          { label: "Include", value: true, tooltip: "Include YAML metadata (title, date, source URL) at the top" },
          { label: "Exclude", value: false, tooltip: "Export just the conversation content without metadata" },
        ],
        prefs.includeFrontmatter,
        (next) => GM_setValue("includeFrontmatter", next),
        "YAML metadata section at the top with title, date, and source URL"
      );

      appendOptionGroup(
        outputSection,
        "Title as H1",
        [
          { label: "Include", value: true, tooltip: "Add the conversation title as a level 1 heading" },
          { label: "Exclude", value: false, tooltip: "Don't add title as heading (use frontmatter only)" },
        ],
        prefs.titleAsH1,
        (next) => GM_setValue("titleAsH1", next),
        "Add the conversation title as a # heading at the top"
      );

      menu.appendChild(outputSection);

      const exportSection = document.createElement("div");
      exportSection.style.display = "flex";
      exportSection.style.flexDirection = "column";
      exportSection.style.gap = "6px";

      const exportHeading = document.createElement("div");
      exportHeading.textContent = "Export Options";
      exportHeading.style.cssText = "font-size: 13px; font-weight: 700; color: #f9fafb;";
      exportSection.appendChild(exportHeading);

      appendOptionGroup(
        exportSection,
        "Output Method",
        [
          { label: "Download File", value: EXPORT_METHODS.DOWNLOAD },
          { label: "Copy to Clipboard", value: EXPORT_METHODS.CLIPBOARD },
        ],
        prefs.exportMethod,
        (next) => GM_setValue("exportMethod", next)
      );

      menu.appendChild(exportSection);
    }

    function openMenu() {
      renderOptionsMenu();
      menu.style.display = "flex";
      optionsButton.setAttribute("aria-expanded", "true");
      document.addEventListener("mousedown", handleOutsideClick, true);
      document.addEventListener("keydown", handleEscapeKey, true);
    }

    function closeMenu() {
      menu.style.display = "none";
      optionsButton.setAttribute("aria-expanded", "false");
      document.removeEventListener("mousedown", handleOutsideClick, true);
      document.removeEventListener("keydown", handleEscapeKey, true);
    }

    function toggleMenu() {
      if (menu.style.display === "none" || menu.style.display === "") {
        openMenu();
      } else {
        closeMenu();
      }
    }

    function handleOutsideClick(event) {
      if (!menu.contains(event.target) && !optionsButton.contains(event.target)) {
        closeMenu();
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    optionsButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    updateOptionsButtonLabel();
    updateExportButtonLabel();

    const positionContainer = () => {
      let mainContainer = document.querySelector(".max-w-threadContentWidth") || 
                          document.querySelector('[class*="threadContentWidth"]');

      if (!mainContainer) {
        const inputArea = document.querySelector("textarea[placeholder]") || 
                          document.querySelector('[role="textbox"]') || 
                          document.querySelector("form");
        if (inputArea) {
          let parent = inputArea.parentElement;
          while (parent && parent !== document.body) {
            const width = parent.getBoundingClientRect().width;
            if (width > 400 && width < window.innerWidth * 0.8) {
              mainContainer = parent;
              break;
            }
            parent = parent.parentElement;
          }
        }
      }

      if (!mainContainer) {
        mainContainer = document.querySelector("main") || 
                        document.querySelector('[role="main"]') || 
                        document.querySelector('[class*="main-content"]');
      }

      if (mainContainer) {
        const rect = mainContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        container.style.transition = "none";
        container.style.left = `${centerX}px`;
        container.style.transform = "translateX(-50%)";
        requestAnimationFrame(() => {
          container.style.transition = "left 0.2s";
        });
      } else {
        container.style.transition = "none";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        requestAnimationFrame(() => {
          container.style.transition = "left 0.2s";
        });
      }
    };

    positionContainer();

    window.addEventListener("resize", positionContainer);
    window.addEventListener("orientationchange", () => setTimeout(positionContainer, 100));

    const observer = new MutationObserver(() => positionContainer());
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: false,
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: false,
    });

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => positionContainer());
      resizeObserver.observe(document.body);
      resizeObserver.observe(document.documentElement);

      const containers = [
        document.querySelector(".max-w-threadContentWidth"),
        document.querySelector('[class*="threadContentWidth"]'),
        document.querySelector("main"),
        document.querySelector('[role="main"]'),
      ].filter(Boolean);

      containers.forEach((candidate) => {
        resizeObserver.observe(candidate);
        if (candidate.parentElement) {
          resizeObserver.observe(candidate.parentElement);
        }
      });
    }

    setInterval(() => {
      const currentLeft = parseFloat(container.style.left) || 0;
      const rect = (
        document.querySelector(".max-w-threadContentWidth") || 
        document.querySelector('[class*="threadContentWidth"]') || 
        document.querySelector("main")
      )?.getBoundingClientRect();

      if (rect) {
        const expectedX = rect.left + rect.width / 2;
        if (Math.abs(currentLeft - expectedX) > 20) {
          positionContainer();
        }
      }
    }, 2000);

    exportButton.addEventListener("click", async () => {
      const originalText = exportButton.textContent;
      exportButton.textContent = "Exporting...";
      exportButton.disabled = true;

      const removeNavBlocker = installNavBlocker();
      try {
        window.focus();
        await sleep(TIMING.SCROLL_SETTLE);

        const prefs = getPreferences();
        const conversation = await extractConversation(prefs.citationStyle);
        if (conversation.length === 0) {
          alert("No conversation content found to export.");
          return;
        }

        const markdown = formatMarkdown(conversation);

        if (prefs.exportMethod === EXPORT_METHODS.CLIPBOARD) {
          const success = await copyToClipboard(markdown);
          if (success) {
            exportButton.textContent = "Copied!";
            setTimeout(() => {
              exportButton.textContent = originalText;
            }, 2000);
          } else {
            alert("Failed to copy to clipboard. Please try again.");
          }
        } else {
          const title = document.title.replace(" | Perplexity", "").trim();
          const safeTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .replace(/^-+|-+$/g, "");
          const filename = `${safeTitle}.md`;
          downloadMarkdown(markdown, filename);
        }
      } catch (error) {
        console.error("Export failed:", error);
        alert("Export failed. Please try again.");
      } finally {
        try {
          removeNavBlocker();
        } catch {}
        if (exportButton.textContent !== "Copied!") {
          exportButton.textContent = originalText;
        }
        exportButton.disabled = false;
        closeMenu();
      }
    });

    document.body.appendChild(container);

    // Focus overlay
    const focusOverlay = document.createElement('div');
    focusOverlay.id = 'perplexity-focus-overlay';
    focusOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      cursor: pointer;
    `;
    focusOverlay.innerHTML = `
      <div style="
        background: #1F2121;
        color: white;
        padding: 24px 32px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      ">
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Click here to continue export</div>
        <div style="font-size: 14px; color: #9ca3af;">Export paused - page needs focus to read clipboard</div>
      </div>
    `;
    focusOverlay.addEventListener('click', () => {
      window.focus();
      focusOverlay.style.display = 'none';
    });
    document.body.appendChild(focusOverlay);

    console.log("Perplexity Export button added successfully");
  }

  // ============================================================================
  // INITIALIZATION - SLOW & ROBUST
  // ============================================================================

  async function init() {
    console.log("Perplexity Exporter: Starting initialization...");
    
    // Initial delay before doing anything
    await sleep(TIMING.INIT_DELAY);
    console.log(`Perplexity Exporter: Passed initial ${TIMING.INIT_DELAY}ms delay`);
    
    // Wait for page to be idle
    await waitForPageIdle();
    console.log("Perplexity Exporter: Page idle detected");
    
    // Wait for network to settle
    await waitForNetworkIdle(5000);
    console.log("Perplexity Exporter: Network idle detected");
    
    // Ensure minimum startup delay has passed
    const startupDelay = Math.max(0, TIMING.MIN_STARTUP_DELAY - TIMING.INIT_DELAY);
    if (startupDelay > 0) {
      await sleep(startupDelay);
      console.log(`Perplexity Exporter: Passed minimum startup delay`);
    }
    
    // Check for conversation content
    if (!hasConversationContent()) {
      console.log("Perplexity Exporter: No conversation content yet, setting up observer...");
      
      // Set up observer for when content appears
      const observer = new MutationObserver(async () => {
        if (hasConversationContent() && !document.getElementById("perplexity-export-btn")) {
          observer.disconnect();
          
          // Additional delay after content appears
          await sleep(2000);
          await waitForPageIdle();
          
          if (hasConversationContent()) {
            addExportButton();
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      
      return;
    }
    
    // Content exists, add button after final check
    await sleep(1000);
    if (hasConversationContent() && !document.getElementById("perplexity-export-btn")) {
      addExportButton();
    }
  }

  // Start initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Extra delay even after DOMContentLoaded
      setTimeout(init, 1000);
    });
  } else {
    // Extra delay for already-loaded pages
    setTimeout(init, 1000);
  }
})();