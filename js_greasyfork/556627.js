// ==UserScript==
// @name 苹方字体网页替换脚本
// @namespace http://tampermonkey.net/
// @version 1.0
// @author Wolfe
// @description 将网页字体替换为苹方字体，资源使用外部注入
// @match *://*/*
// @run-at document-start
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556627/%E8%8B%B9%E6%96%B9%E5%AD%97%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/556627/%E8%8B%B9%E6%96%B9%E5%AD%97%E4%BD%93%E7%BD%91%E9%A1%B5%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ======================
  // 配置
  // ======================
  const PROTECTED_TAGS = new Set([
    "script",
    "style",
    "link",
    "meta",
    "noscript",
    "svg",
    "path",
  ]);
  const CODE_TAGS = new Set(["code", "pre", "kbd", "samp", "tt"]);
  const processed = new WeakSet();

  // 字体栈配置 (来自v13.3)
  // [MODIFIED v3] 完整实现 Inter -> PingFang (SC/TC/HK) -> Noto (CJK) 栈
  const UNIFIED_STACK =
    'Inter, "PingFang SC", "PingFang TC", "PingFang HK", "Noto Sans SC", "Noto Sans TC", "Noto Sans HK", "Noto Sans JP", "Noto Sans KR"';

  // [MODIFIED v4] 遵照用户要求：代码字体使用 Maple Mono -> Noto Sans Mono (思源等宽)
  const MONO_STACK = '"Maple Mono", "Noto Sans Mono", "SF Mono"';

  const FONTS = {
    latin: UNIFIED_STACK,
    cjk: UNIFIED_STACK,
    mixed: UNIFIED_STACK,
    mono: MONO_STACK, // <--- MODIFIED
  };

  // CDN配置 (来自v9.7)
  const CONFIG = {
    CDN: {
      PINGFANG: "https://cdn.jsdelivr.net/gh/ZWolken/PingFang/",
      GOOGLE_FONTS: "https://fonts.googleapis.com/css2",
    },
  };

  // ======================
  // FontLoader（来自v9.7 - 字体注入系统）
  // ======================
  class FontLoader {
    constructor() {
      this.loaded = false;
    }

    loadFonts() {
      if (this.loaded) return;
      const style = document.createElement("style");
      style.id = "font-replacement-loader";

      // [INFO] Noto Sans 字体在这里被 @import
      style.textContent = `
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Inter:wght@100..900&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Roboto:wght@100;300;400;500;700;900&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Open+Sans:wght@300..800&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Lato:wght@100;300;400;700;900&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Noto+Sans+SC:wght@100..900&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Noto+Sans+TC:wght@100..900&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Noto+Sans+HK:wght@100..900&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Noto+Sans+JP:wght@100..900&display=swap');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Noto+Sans+KR:wght@100..900&display=swap');

/* [MODIFIED v4] 注入 Maple Mono 和 Noto Sans Mono (思源等宽) */
@import url('https://cdn.jsdelivr.net/npm/maple-mono/maple.css');
@import url('${
        CONFIG.CDN.GOOGLE_FONTS
      }?family=Noto+Sans+Mono:wght@100..900&display=swap');

${this.generatePingFangFontFaces()}
`;
      (document.head || document.documentElement).appendChild(style);
      this.loaded = true;
    }

    generatePingFangFontFaces() {
      // [INFO] PingFang SC, TC, HK 字体在这里被 @font-face 注入
      const variants = ["SC", "TC", "HK"];
      const weights = [
        { name: "Thin", weight: 100 },
        { name: "Ultralight", weight: 200 },
        { name: "Light", weight: 300 },
        { name: "Regular", weight: 400 },
        { name: "Medium", weight: 500 },
        { name: "Semibold", weight: 600 },
        { name: "Semibold", weight: 700 },
        { name: "Heavy", weight: 800 },
        { name: "Heavy", weight: 900 },
      ];
      const cjkUnicodeRange =
        "U+2E80-2EFF, U+3000-303F, U+3040-309F, U+30A0-30FF, U+3100-312F, U+3130-318F, U+3190-319F, U+31A0-31BF, U+31C0-31EF, U+31F0-31FF, U+3200-32FF, U+3300-33FF, U+3400-4DBF, U+4DC0-4DFF, U+4E00-9FFF, U+A000-A48F, U+A490-A4CF, U+AC00-D7AF, U+F900-FAFF, U+FE30-FE4F, U+FF00-FFEF, U+20000-2A6DF, U+2A700-2B73F, U+2B740-2B81F, U+2B820-2CEAF, U+2CEB0-2EBEF, U+30000-3134F";
      let css = "";
      variants.forEach((variant) => {
        weights.forEach((style) => {
          css += `
@font-face {
    font-family: 'PingFang ${variant}';
    src: url('${CONFIG.CDN.PINGFANG}PingFang${variant}-${style.name}.otf') format('opentype');
    font-weight: ${style.weight};
    font-style: normal;
    font-display: swap;
    unicode-range: ${cjkUnicodeRange};
}
`;
        });
      });
      return css;
    }
  }

  // ======================
  // 快速文本类型检测（保留，但逻辑中已不再依赖其区分cjk/latin）
  // ======================
  function getTextType(text) {
    if (!text || text.length === 0) return "empty";
    const sample = text.substring(0, 30);
    const hasLatin = /[a-zA-Z]/.test(sample);
    const hasCJK =
      /[\u4e00-\u9fff\u3000-\u303f\u3040-\u309f\u30a0-\u30ff]/.test(sample);

    if (!hasLatin && !hasCJK) return "empty";
    if (hasLatin && !hasCJK) return "latin";
    if (!hasLatin && hasCJK) return "cjk";

    const latinCount = (sample.match(/[a-zA-Z]/g) || []).length;
    const cjkCount = (sample.match(/[\u4e00-\u9fff]/g) || []).length;
    if (cjkCount < latinCount * 0.3) return "latin";

    return "mixed";
  }

  // ======================
  // 处理元素（核心函数）
  // ======================
  function processElement(el) {
    if (processed.has(el)) return;

    const tag = el.tagName?.toLowerCase();
    if (!tag || PROTECTED_TAGS.has(tag)) {
      processed.add(el);
      return;
    }

    if (tag === "i") {
      processed.add(el);
      return;
    }

    const className = el.className;
    if (className && typeof className === "string") {
      if (/icon|fa-|fa\s|glyph|emoji|symbol/i.test(className)) {
        processed.add(el);
        return;
      }
    }

    const text = el.textContent?.trim();
    if (text && text.length <= 2) {
      const code = text.charCodeAt(0);
      if (
        (code >= 0xe000 && code <= 0xf8ff) ||
        (code >= 0x2600 && code <= 0x27bf) ||
        code >= 0x1f000
      ) {
        processed.add(el);
        return;
      }
    }

    // 确定字体类型
    let fontStack;

    // [INFO] 统一使用 FONTS.mixed (指向 UNIFIED_STACK)
    if (CODE_TAGS.has(tag)) {
      fontStack = FONTS.mono; // <--- MODIFIED: 将使用新的 MONO_STACK
    } else {
      fontStack = FONTS.mixed;
    }

    // 直接应用样式
    if (fontStack) {
      // [INFO] 保留 !important 强制覆盖
      el.style.setProperty("font-family", fontStack, "important");
      el.style.setProperty("text-rendering", "optimizeLegibility", "important");
      el.style.setProperty(
        "-webkit-font-smoothing",
        "antialiased",
        "important"
      );
    }
    processed.add(el);
  }

  // ======================
  // 处理所有元素
  // ======================
  function processAll() {
    const elements = document.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
      processElement(elements[i]);
    }
    processShadowRoots();
  }

  // ======================
  // 处理Shadow DOM
  // ======================
  function processShadowRoots() {
    const elements = document.querySelectorAll("*");
    for (let el of elements) {
      if (el.shadowRoot) {
        const shadowElements = el.shadowRoot.querySelectorAll("*");
        for (let shadowEl of shadowElements) {
          processElement(shadowEl);
        }
      }
    }
  }

  // ======================
  // MutationObserver
  // ======================
  function setupObserver() {
    let pending = [];
    let scheduled = false;

    const processPending = () => {
      scheduled = false;
      processShadowRoots();
      for (let el of pending) {
        processElement(el);
      }
      pending = [];
    };

    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
          for (let node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              pending.push(node);
              const children = node.getElementsByTagName?.("*");
              if (children) {
                for (let child of children) {
                  pending.push(child);
                }
              }
            }
          }
        }
      }

      if (pending.length && !scheduled) {
        scheduled = true;
        if (window.requestIdleCallback) {
          requestIdleCallback(processPending, { timeout: 50 });
        } else {
          setTimeout(processPending, 0);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // ======================
  // 初始化
  // ======================
  const fontLoader = new FontLoader();

  function init() {
    fontLoader.loadFonts();
    processAll();
    setupObserver();

    setInterval(processAll, 5000);

    setInterval(() => {
      const iframes = document.querySelectorAll("iframe");
      for (let iframe of iframes) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc && !doc.__fontPatched) {
            doc.__fontPatched = true;
            const elements = doc.getElementsByTagName("*");
            for (let el of elements) {
              processElement(el);
            }
          }
        } catch (e) {
          // 跨域
        }
      }
    }, 3000);
  }

  if (document.body || document.documentElement) {
    init();
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }

  window.__fontEngine = {
    processAll: processAll,
    processElement: processElement,
    reload: () => {
      processed.clear();
      processAll();
    },
  };

  console.log(
    "[Font v13.3.4-Modified] Initialized with full font stack (Inter -> PingFang -> Noto) and Code (Maple -> Noto Mono)."
  );
})();