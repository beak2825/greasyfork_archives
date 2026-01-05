// ==UserScript==
// @name         LINUX DO - 调色板/配色增强（Discourse）
// @namespace    https://greasyfork.org/zh-CN/users/yourname
// @version      0.1.0
// @description  给 linux.do（Discourse）注入更丰富的配色：覆盖主题变量 + 渐变页头 + 卡片化 + hover 高亮（支持浅/深色与调色板切换）
// @match        https://linux.do/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558880/LINUX%20DO%20-%20%E8%B0%83%E8%89%B2%E6%9D%BF%E9%85%8D%E8%89%B2%E5%A2%9E%E5%BC%BA%EF%BC%88Discourse%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558880/LINUX%20DO%20-%20%E8%B0%83%E8%89%B2%E6%9D%BF%E9%85%8D%E8%89%B2%E5%A2%9E%E5%BC%BA%EF%BC%88Discourse%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const KEY_PALETTE = "ld_palette_v1";
  const KEY_MODE = "ld_mode_v1"; // auto | light | dark
  const DEFAULT_PALETTE = "aurora";
  const DEFAULT_MODE = "auto";

  const palettes = {
    aurora: {
      light: {
        bg0: "#f6f8ff",
        bg1: "#ffffff",
        card: "#ffffffcc",
        border: "#e5e7eb",
        text: "#1f2937",
        muted: "#6b7280",
        accent: "#4f46e5",   // indigo
        accent2: "#06b6d4",  // cyan
        headerText: "#ffffff",
      },
      dark: {
        bg0: "#0b1020",
        bg1: "#0f172a",
        card: "#0f172acc",
        border: "#1f2937",
        text: "#e5e7eb",
        muted: "#94a3b8",
        accent: "#818cf8",
        accent2: "#22d3ee",
        headerText: "#0b1020",
      },
    },
    sakura: {
      light: {
        bg0: "#fff7fb",
        bg1: "#ffffff",
        card: "#ffffffcc",
        border: "#f1d7e4",
        text: "#2b1b1e",
        muted: "#7a4b5a",
        accent: "#ec4899",  // pink
        accent2: "#f97316", // orange
        headerText: "#ffffff",
      },
      dark: {
        bg0: "#170810",
        bg1: "#200f18",
        card: "#200f18cc",
        border: "#3b1628",
        text: "#fce7f3",
        muted: "#f9a8d4",
        accent: "#fb7185",  // rose
        accent2: "#fbbf24", // amber
        headerText: "#1a0b13",
      },
    },
  };

  const gmGet = (k, d) => {
    try { return GM_getValue(k, d); } catch { return localStorage.getItem(k) ?? d; }
  };
  const gmSet = (k, v) => {
    try { GM_setValue(k, v); } catch { localStorage.setItem(k, v); }
  };

  const hexToRgb = (hex) => {
    const h = (hex || "").replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map(ch => ch + ch).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `${r},${g},${b}`;
  };

  const getNonce = () => {
    const s = document.querySelector("script[nonce]");
    return s?.nonce || s?.getAttribute("nonce") || "";
  };

  const getScheme = () => {
    const mode = gmGet(KEY_MODE, DEFAULT_MODE);
    if (mode === "light" || mode === "dark") return mode;
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  };

  let adoptedSheet = null;
  let styleEl = null;

  const injectCss = (cssText) => {
    // 优先用 adoptedStyleSheets（通常不受 style tag nonce 限制）
    try {
      if ("adoptedStyleSheets" in document && "replaceSync" in CSSStyleSheet.prototype) {
        if (!adoptedSheet) {
          adoptedSheet = new CSSStyleSheet();
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, adoptedSheet];
        }
        adoptedSheet.replaceSync(cssText);
        return;
      }
    } catch (_) {}

    // fallback：style tag（尝试带 nonce）
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "ld-palette-userscript";
      const nonce = getNonce();
      if (nonce) styleEl.setAttribute("nonce", nonce);
      (document.head || document.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = cssText;
  };

  const buildCss = (paletteName, scheme) => {
    const p = palettes[paletteName] || palettes[DEFAULT_PALETTE];
    const c = p[scheme] || p.light;

    const accentRgb = hexToRgb(c.accent);
    const accent2Rgb = hexToRgb(c.accent2);
    const bg1Rgb = hexToRgb(c.bg1);

    // 说明：
    // - Discourse 常用变量：--primary/--secondary/--tertiary/--header_background/--header_primary/--highlight 等
    // - 同时加一些“卡片化 + 渐变 + hover”的选择器（不会改结构，只改观感）
    return `
:root{
  --ld-bg0:${c.bg0};
  --ld-bg1:${c.bg1};
  --ld-bg1-rgb:${bg1Rgb};
  --ld-card:${c.card};
  --ld-border:${c.border};
  --ld-text:${c.text};
  --ld-muted:${c.muted};
  --ld-accent:${c.accent};
  --ld-accent-rgb:${accentRgb};
  --ld-accent2:${c.accent2};
  --ld-accent2-rgb:${accent2Rgb};
  --ld-headerText:${c.headerText};

  /* 覆盖 Discourse 常用配色变量（尽量“温和”覆盖，避免炸 UI） */
  --primary: var(--ld-text);
  --secondary: var(--ld-bg1);
  --tertiary: var(--ld-accent);
  --quaternary: var(--ld-accent2);

  --header_background: rgba(var(--ld-accent-rgb), .92);
  --header_primary: var(--ld-headerText);
  --highlight: rgba(var(--ld-accent-rgb), .14);

  --danger: #ef4444;
  --success: #22c55e;
  --love: #f43f5e;

  --d-hover: rgba(var(--ld-accent-rgb), .08);
  --d-selected: rgba(var(--ld-accent-rgb), .14);
}

html, body{
  color: var(--ld-text) !important;
  background: linear-gradient(135deg, var(--ld-bg0), var(--ld-bg1)) !important;
  background-attachment: fixed !important;
}

/* 顶部 Header：渐变 + 更明显的质感 */
.d-header{
  background: linear-gradient(90deg, var(--ld-accent), var(--ld-accent2)) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,.10) !important;
  border-bottom: 1px solid rgba(255,255,255,.18) !important;
}
.d-header .title, .d-header a, .d-header .d-icon, .d-header .header-dropdown-toggle{
  color: var(--header_primary) !important;
}
.d-header .header-buttons .btn,
.d-header .header-buttons .btn .d-icon{
  color: var(--header_primary) !important;
}

/* 链接：主色 -> 副色 */
a{ color: var(--ld-accent) !important; }
a:hover{ color: var(--ld-accent2) !important; }

/* 主要内容区：轻微上移一点（更“呼吸感”） */
#main-outlet{ padding-top: 1rem !important; }

/* 卡片化：话题列表、帖子、侧边栏块等（尽量覆盖常见容器） */
.topic-list-item,
.topic-post,
.topic-body,
.topic-map,
.user-card,
.group-card,
.sidebar-section,
#reply-control,
.composer-popup,
.select-kit .select-kit-body,
.search-menu .results,
.menu-panel,
.modal-inner-container{
  background: var(--ld-card) !important;
  border: 1px solid var(--ld-border) !important;
  border-radius: 14px !important;
  box-shadow: 0 12px 30px rgba(0,0,0,.08) !important;
  backdrop-filter: saturate(1.15) blur(6px);
}

.topic-list-item:hover{
  background: rgba(var(--ld-accent-rgb), .06) !important;
  border-color: rgba(var(--ld-accent-rgb), .25) !important;
}

/* 分类/标签：更圆润一点 */
.badge-wrapper,
.badge-category,
.discourse-tag{
  border-radius: 999px !important;
}
.discourse-tag{
  background: rgba(var(--ld-accent-rgb), .10) !important;
  border: 1px solid rgba(var(--ld-accent-rgb), .18) !important;
}
.discourse-tag:hover{
  background: rgba(var(--ld-accent2-rgb), .10) !important;
  border-color: rgba(var(--ld-accent2-rgb), .22) !important;
}

/* 主按钮：渐变强调 */
.btn-primary,
.btn.btn-primary{
  background: linear-gradient(90deg, var(--ld-accent), var(--ld-accent2)) !important;
  border: none !important;
  box-shadow: 0 10px 24px rgba(0,0,0,.12) !important;
}
.btn-primary:hover{ filter: brightness(1.06) saturate(1.05); }

/* 普通按钮：更圆 */
.btn, button, .btn-default{
  border-radius: 999px !important;
}

/* 输入框/搜索框：统一质感 */
input[type="text"], input[type="search"], input[type="password"], textarea, .select-kit .select-kit-header{
  border-radius: 12px !important;
  border-color: var(--ld-border) !important;
  background: rgba(var(--ld-bg1-rgb), .65) !important;
}
input:focus, textarea:focus, .select-kit .select-kit-header:focus-within{
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(var(--ld-accent-rgb), .20) !important;
  border-color: rgba(var(--ld-accent-rgb), .45) !important;
}

/* 代码块：更清晰 */
pre, code{
  border-radius: 12px !important;
}
pre{
  border: 1px solid var(--ld-border) !important;
  background: rgba(0,0,0,${scheme === "dark" ? "0.28" : "0.04"}) !important;
}

/* 滚动条（支持的浏览器会生效） */
*{
  scrollbar-color: rgba(var(--ld-accent-rgb), .40) rgba(var(--ld-bg1-rgb), .35);
}
`;
  };

  const apply = () => {
    const palette = gmGet(KEY_PALETTE, DEFAULT_PALETTE);
    const scheme = getScheme();
    injectCss(buildCss(palette, scheme));
  };

  const cyclePalette = () => {
    const names = Object.keys(palettes);
    const cur = gmGet(KEY_PALETTE, DEFAULT_PALETTE);
    const idx = Math.max(0, names.indexOf(cur));
    const next = names[(idx + 1) % names.length];
    gmSet(KEY_PALETTE, next);
    apply();
  };

  const cycleMode = () => {
    const order = ["auto", "light", "dark"];
    const cur = gmGet(KEY_MODE, DEFAULT_MODE);
    const idx = Math.max(0, order.indexOf(cur));
    const next = order[(idx + 1) % order.length];
    gmSet(KEY_MODE, next);
    apply();
  };

  const registerMenu = () => {
    if (typeof GM_registerMenuCommand !== "function") return;

    GM_registerMenuCommand("切换调色板（Alt+Shift+P）", () => cyclePalette());
    GM_registerMenuCommand("切换模式 auto/light/dark（Alt+Shift+M）", () => cycleMode());
    GM_registerMenuCommand("重置为默认", () => {
      gmSet(KEY_PALETTE, DEFAULT_PALETTE);
      gmSet(KEY_MODE, DEFAULT_MODE);
      apply();
    });
  };

  // 监听系统深浅色变化（mode=auto 时才跟随）
  try {
    const mql = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    mql?.addEventListener?.("change", () => {
      if (gmGet(KEY_MODE, DEFAULT_MODE) === "auto") apply();
    });
  } catch (_) {}

  // 快捷键
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.shiftKey && e.code === "KeyP") { e.preventDefault(); cyclePalette(); }
    if (e.altKey && e.shiftKey && e.code === "KeyM") { e.preventDefault(); cycleMode(); }
  }, true);

  registerMenu();
  apply();
})();
