// ==UserScript==
// @name         Double-click Math Formula to Copy to Word (No CN Sites)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      GPLv3
// @description  Double-click on a math formula to copy MathML (best for Word). Supports ChatGPT, Wikipedia, Gemini, Google AI Studio, StackExchange, IEEE Xplore, ChatBoxAI. Hover highlight + robust SPA keep-alive.
// @match        *://*.wikipedia.org/*
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @match        *://gemini.google.com/*
// @match        *://aistudio.google.com/*
// @match        *://*.stackexchange.com/*
// @match        *://ieeexplore.ieee.org/*
// @match        *://*.chatboxai.app/*
// @require      https://cdn.jsdelivr.net/npm/temml-ts@0.10.14-12/dist/temml.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560453/Double-click%20Math%20Formula%20to%20Copy%20to%20Word%20%28No%20CN%20Sites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560453/Double-click%20Math%20Formula%20to%20Copy%20to%20Word%20%28No%20CN%20Sites%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Optimize: event delegation + debounced scan + SPA keep-alive
  // Enhance: copy MathML as text/plain + text/html (better paste to Word)
  // No China sites included.

  const KEY = "dblclick_math_copy_v2";
  const siteKey = () => `${KEY}:${location.host}`;

  const defaultCfg = { enabled: true, hover: true, toast: true, toastMs: 900 };

  const cfg = (() => {
    try {
      const raw = GM_getValue(siteKey(), "");
      if (!raw) return { ...defaultCfg };
      return { ...defaultCfg, ...(JSON.parse(raw) || {}) };
    } catch {
      return { ...defaultCfg };
    }
  })();

  const saveCfg = () => {
    try { GM_setValue(siteKey(), JSON.stringify(cfg)); } catch {}
  };

  /******************************************************************
   * Menu (rebuildable, no refresh needed)
   ******************************************************************/
  const menu = (() => {
    /** @type {number[]} */
    let ids = [];

    const unregisterAll = () => {
      if (typeof GM_unregisterMenuCommand !== "function") return;
      for (const id of ids) {
        try { GM_unregisterMenuCommand(id); } catch {}
      }
      ids = [];
    };

    const reg = (title, fn) => {
      try {
        const id = GM_registerMenuCommand(title, fn);
        if (typeof id === "number") ids.push(id);
      } catch {}
    };

    const rebuild = () => {
      unregisterAll();

      reg(
        cfg.enabled ? "✅ Math Copy: Enabled (click to disable)" : "⛔ Math Copy: Disabled (click to enable)",
        () => {
          cfg.enabled = !cfg.enabled;
          saveCfg();
          toast.show(cfg.enabled ? "Math Copy: enabled" : "Math Copy: disabled");
          rebuild();
        }
      );

      reg(
        cfg.hover ? "🎯 Hover highlight: ON (click OFF)" : "🎯 Hover highlight: OFF (click ON)",
        () => {
          cfg.hover = !cfg.hover;
          saveCfg();
          toast.show(cfg.hover ? "Hover highlight: ON" : "Hover highlight: OFF");
          rebuild();
        }
      );

      reg(
        cfg.toast ? "🔕 Toast: ON (click OFF)" : "🔔 Toast: OFF (click ON)",
        () => {
          cfg.toast = !cfg.toast;
          saveCfg();
          toast.show(cfg.toast ? "Toast: ON" : "Toast: OFF");
          rebuild();
        }
      );

      reg("♻️ Reset settings (this site)", () => {
        cfg.enabled = defaultCfg.enabled;
        cfg.hover = defaultCfg.hover;
        cfg.toast = defaultCfg.toast;
        cfg.toastMs = defaultCfg.toastMs;
        saveCfg();
        toast.show("Reset");
        rebuild();
      });
    };

    return { rebuild };
  })();

  /******************************************************************
   * CSS
   ******************************************************************/
  const css = `
    .math-hover-effect-v2 {
      background-color: rgba(255, 215, 0, 0.22) !important;
      transition: background-color 0.15s ease;
      cursor: pointer !important;
      border-radius: 4px;
    }
    .mathml-copy-toast-v2 {
      position: fixed;
      right: 14px;
      bottom: 14px;
      background: rgba(0, 0, 0, 0.80);
      color: #fff;
      padding: 6px 10px;
      border-radius: 10px;
      font-size: 12px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      z-index: 2147483647;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity .12s ease, transform .12s ease;
      pointer-events: none;
      box-shadow: 0 6px 20px rgba(0,0,0,.25);
      white-space: nowrap;
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.documentElement.appendChild(style);

  /******************************************************************
   * Toast
   ******************************************************************/
  const toast = (() => {
    let el = null;
    let t = null;
    const ensure = () => {
      if (el && el.isConnected) return el;
      el = document.createElement("div");
      el.className = "mathml-copy-toast-v2";
      document.addEventListener("DOMContentLoaded", () => {
        if (!el.isConnected) document.body.appendChild(el);
      });
      return el;
    };
    const show = (msg) => {
      if (!cfg.toast) return;
      const node = ensure();
      node.textContent = msg;
      node.style.opacity = "1";
      node.style.transform = "translateY(0)";
      clearTimeout(t);
      t = setTimeout(() => {
        node.style.opacity = "0";
        node.style.transform = "translateY(6px)";
      }, Math.max(250, cfg.toastMs || 900));
    };
    return { show };
  })();

  /******************************************************************
   * Site support (Non-CN only)
   ******************************************************************/
  const SITES = [
    { name: "ChatGPT", match: (h) => /(^|\.)chatgpt\.com$/.test(h) || /(^|\.)chat\.openai\.com$/.test(h), selectors: [".katex","span.katex"], type: "mathml" },
    { name: "Wikipedia", match: (h) => h.includes("wikipedia.org"), selectors: ["span.mwe-math-element"], type: "mathml" },
    { name: "StackExchange", match: (h) => h.includes("stackexchange.com"), selectors: ["span.math-container",".math-container",".katex","span.katex"], type: "mathml" },
    { name: "IEEE Xplore", match: (h) => h.includes("ieeexplore.ieee.org"), selectors: ['span[id^="MathJax-Element-"][id$="-Frame"]',"mjx-container.MathJax","mjx-container"], type: "mathml" },
    { name: "Gemini (data-math)", match: (h) => h.includes("gemini.google.com"), selectors: ["[data-math]"], type: "latex" },
    { name: "Gemini (KaTeX)", match: (h) => h.includes("gemini.google.com"), selectors: [".katex","span.katex",".math-inline"], type: "mathml" },
    { name: "AI Studio", match: (h) => h.includes("aistudio.google.com"), selectors: ["span.katex",".katex"], type: "mathml" },
    { name: "ChatBoxAI", match: (h) => h.includes("chatboxai.app"), selectors: ["span.katex",".katex"], type: "mathml" },
  ];
  const activeSites = SITES.filter((s) => s.match(location.host));
  if (!activeSites.length) return;

  /******************************************************************
   * Gemini preprocessing: convert data-math LaTeX to MathML (Temml)
   ******************************************************************/
  let sanitizer = { createHTML: (x) => x };
  if (window.trustedTypes?.createPolicy) {
    try { sanitizer = window.trustedTypes.createPolicy("mathml-copy-policy-v2", { createHTML: (s) => s }); } catch {}
  }

  function convertLatexToMathML(latex, isDisplayMode = false) {
    try { return temml.renderToString(latex, { xml: true, displayMode: isDisplayMode }); }
    catch (e) { console.error("[MathCopy] Temml failed:", e); return null; }
  }

  function processGeminiDisplay(element) {
    if (!element || element.getAttribute("data-mathml-converted") === "true") return;
    const latex = element.getAttribute("data-math");
    if (!latex) return;
    const isDisplayMode = element.classList.contains("math-block");
    const mathmlHTML = convertLatexToMathML(latex, isDisplayMode);
    if (!mathmlHTML) return;

    element.innerHTML = sanitizer.createHTML(mathmlHTML);
    element.style.fontFamily = "Latin Modern Math, STIX Two Math, Cambria Math, serif";
    element.style.fontSize = "1.1em";
    element.setAttribute("data-mathml-converted", "true");
    const mathTag = element.querySelector("math");
    if (mathTag) mathTag.setAttribute("display", isDisplayMode ? "block" : "inline");
  }

  /******************************************************************
   * Extraction
   ******************************************************************/
  function extractMathML(element) {
    if (!element) return null;
    let math = element.querySelector?.("math") || null;
    if (!math && element.tagName?.toLowerCase() === "mjx-container") math = element.querySelector("math");
    if (math && !math.getAttribute("xmlns")) math.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
    return math ? math.outerHTML : null;
  }

  function extractMathString(element, type) {
    if (type === "mathml") return extractMathML(element);
    if (type === "latex") {
      const existing = extractMathML(element);
      if (existing) return existing;
      const latex = element.getAttribute?.("data-math");
      return latex ? convertLatexToMathML(latex, false) : null;
    }
    return null;
  }

  /******************************************************************
   * Clipboard: write both text/plain and text/html when possible
   ******************************************************************/
  async function writeToClipboard(mathml) {
    if (!mathml) return false;

    if (window.ClipboardItem && navigator.clipboard?.write) {
      try {
        const html = `<!doctype html><html><body>${mathml}</body></html>`;
        const item = new ClipboardItem({
          "text/plain": new Blob([mathml], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        });
        await navigator.clipboard.write([item]);
        return true;
      } catch {}
    }

    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(mathml); return true; } catch {}
    }

    try {
      const ta = document.createElement("textarea");
      ta.value = mathml;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  /******************************************************************
   * Matching + delegation
   ******************************************************************/
  const selector = activeSites.map((s) => s.selectors).flat().filter(Boolean).join(",");
  const seen = new WeakSet();

  function closestFormula(target) {
    let el = target?.nodeType === 1 ? target : target?.parentElement;
    while (el && el !== document.body) {
      if (el.matches?.(selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function preprocessIfNeeded(el) {
    if (el?.hasAttribute?.("data-math")) processGeminiDisplay(el);
  }

  function getTypeForElement(el) {
    return el?.hasAttribute?.("data-math") ? "latex" : "mathml";
  }

  // Hover (delegation)
  let lastHover = null;
  function applyHover(el, on) {
    if (!cfg.hover || !el) return;
    if (on) el.classList.add("math-hover-effect-v2");
    else el.classList.remove("math-hover-effect-v2");
  }

  document.addEventListener("pointermove", (e) => {
    if (!cfg.enabled || !cfg.hover) return;
    const el = closestFormula(e.target);
    if (el === lastHover) return;
    if (lastHover) applyHover(lastHover, false);
    lastHover = el;
    if (el) { seen.add(el); applyHover(el, true); }
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    if (lastHover) applyHover(lastHover, false);
    lastHover = null;
  }, { passive: true });

  // Double-click copy (delegation)
  document.addEventListener("dblclick", async (event) => {
    if (!cfg.enabled) return;
    const el = closestFormula(event.target);
    if (!el) return;

    event.stopPropagation();
    event.preventDefault();

    preprocessIfNeeded(el);

    const type = getTypeForElement(el);
    const math = extractMathString(el, type);

    if (!math) {
      toast.show("No math found");
      try { window.getSelection?.().removeAllRanges?.(); } catch {}
      return;
    }

    const ok = await writeToClipboard(math);
    toast.show(ok ? "Copied MathML" : "Copy failed (clipboard blocked)");
    try { window.getSelection?.().removeAllRanges?.(); } catch {}
  }, true);

  /******************************************************************
   * SPA keep-alive: Gemini conversion as nodes appear
   ******************************************************************/
  let scanScheduled = false;
  const scheduleScan = () => {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => { scanScheduled = false; scanNow(); });
  };

  function scanNow() {
    if (!cfg.enabled) return;
    if (location.host.includes("gemini.google.com")) {
      document.querySelectorAll("[data-math]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        processGeminiDisplay(el);
      });
    }
  }

  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) { scheduleScan(); break; }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  scanNow();
  menu.rebuild();
  toast.show("Math Copy ready (double-click)");
})();
