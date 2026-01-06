// ==UserScript==
// @name         FCX
// @namespace    https://github.com/mdmrk/fcx
// @version      0.1.0
// @description  Mejora la navegación en ForoCoches.
// @license      GNU General Public License v3.0
// @author       mdmrk
// @match        https://forocoches.com/*
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/560544/FCX.user.js
// @updateURL https://update.greasyfork.org/scripts/560544/FCX.meta.js
// ==/UserScript==

// src/style.css
var style_default = ".infinite-scroll-separator{justify-content:center;align-items:center;margin:20px 0;display:flex;position:relative}.infinite-scroll-separator-line{background-color:var(--border-color,#e5e7eb);z-index:1;height:1px;position:absolute;left:0;right:0}.infinite-scroll-separator-text{background-color:var(--bg-color,#fff);color:var(--text-secondary,#6b7280);z-index:2;border:1px solid var(--border-color,#e5e7eb);border-radius:9999px;padding:0 16px;font-size:.875rem;font-weight:500}#fcx-config-backdrop{z-index:9998;background:#00000080;width:100%;height:100%;position:fixed;top:0;left:0}#fcx-config-panel{color:#ccc;z-index:9999;opacity:0;background:#1e1e1e;border:1px solid #444;border-radius:4px;flex-direction:column;width:900px;max-width:95%;max-height:90vh;font-size:13px;display:flex;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)scale(.95);box-shadow:0 10px 25px #00000080}#fcx-config-header{color:#fff;background:linear-gradient(#2a2a2a,#1a1a1a);border-bottom:1px solid #000;padding:8px 10px;font-weight:700}#fcx-config-content{flex:1;padding:0;overflow-y:auto}#fcx-config-table{border-collapse:collapse;width:100%}#fcx-config-table th,#fcx-config-table td{text-align:left;border-bottom:1px solid #333;padding:10px}#fcx-config-table th{color:#fe5e00;z-index:10;background:#252525;font-weight:700;position:sticky;top:0}#fcx-config-table th.fcx-col-opt{width:auto}#fcx-config-table th.fcx-col-chk{text-align:center;width:80px}#fcx-config-table td.fcx-col-chk{text-align:center}.fcx-desc{color:#888;margin-top:4px;font-size:11px;display:block}.fcx-label{color:#eee;font-weight:700}.fcx-disabled{opacity:.3;pointer-events:none}#fcx-footer{text-align:right;color:#666;background:#1a1a1a;border-top:1px solid #333;padding:5px 10px;font-size:11px}#fcx-footer a{color:#888;cursor:pointer;margin-left:10px;text-decoration:none}#fcx-footer a:hover{color:#ccc}";

// src/utils/inject-console.ts
var consoleMethodsThatDontBreakWhenArgumentIsString = [
  "log",
  "error",
  "warn",
  "info",
  "debug",
  "trace"
];
function injectConsole(prefix) {
  const originalConsole = globalThis.console;
  globalThis.console = new Proxy(originalConsole, {
    get(target, prop, receiver) {
      const method = Reflect.get(target, prop, receiver);
      return consoleMethodsThatDontBreakWhenArgumentIsString.some((propName) => propName === prop) ? method.bind(target, `[${prefix}]
`) : method;
    }
  });
}

// src/config.ts
var devMode = false;
var theme = {
  enhancedCommentClass: "enhanced-comment"
};
var oldSelectors = {
  feedContainer: "#posts",
  commentItem: "table[id^='post']",
  avatar: ".avatar",
  authorName: ".bigusername",
  content: "div[id^='post_message_']",
  nextPageLink: "a[rel='next']",
  prevPageLink: "a[rel='prev']",
  activePage: "td.alt2 .mfont strong"
};
var newSelectors = {
  feedContainer: "#posts",
  commentItem: ".postbit_wrapper",
  avatar: ".thread-profile-image",
  authorName: "div[id^='postmenu_'] > a",
  content: "div[id^='post_message_']",
  nextPageLink: "a:has(span[style*='--next-right-icon'])",
  prevPageLink: "a:has(span[style*='--next-left-icon'])",
  activePage: "span[title*='Mostrando resultados'] > strong"
};

// src/utils/logger.ts
var logger = {
  log: (...args) => {
    if (devMode)
      console.log(...args);
  },
  warn: (...args) => {
    if (devMode)
      console.warn(...args);
  },
  error: (...args) => {
    if (devMode)
      console.error(...args);
  },
  info: (...args) => {
    if (devMode)
      console.info(...args);
  }
};

// src/utils/detect-interface.ts
var isNewInterface = () => {
  return !!document.getElementById("fc-desktop-version-tag-for-monitoring");
};

// src/utils/page-state.ts
var detectPageType = () => {
  const url = window.location.href;
  if (url.includes("showthread.php")) {
    return "THREAD" /* THREAD */;
  }
  if (url.includes("forumdisplay.php")) {
    return "CATEGORY" /* CATEGORY */;
  }
  if (/\/foro\/?($|\?|#)/.test(url)) {
    return "HOME" /* HOME */;
  }
  if (/^https?:\/\/[^/]+\/?(?:$|\?|#)/.test(url)) {
    return "HOME" /* HOME */;
  }
  return "UNKNOWN" /* UNKNOWN */;
};
var currentPageType = detectPageType();

// src/config-registry.ts
var CONFIG_KEYS = {
  REMOVE_SIDEBAR: "remove_sidebar",
  INFINITE_SCROLL: "infinite_scroll",
  REMOVE_BANNERS: "remove_banners"
};
var configs = [
  {
    key: CONFIG_KEYS.REMOVE_SIDEBAR,
    label: "Eliminar Barra Lateral",
    description: "Elimina la barra lateral derecha y expande el área de contenido principal.",
    defaultValue: false,
    type: "checkbox",
    scopes: ["new"]
  },
  {
    key: CONFIG_KEYS.INFINITE_SCROLL,
    label: "Scroll Infinito",
    description: "Carga automáticamente la siguiente página de hilos al llegar al final.",
    defaultValue: true,
    type: "checkbox"
  },
  {
    key: CONFIG_KEYS.REMOVE_BANNERS,
    label: "Eliminar Publicidad",
    description: "Oculta los banners de publicidad.",
    defaultValue: true,
    type: "checkbox"
  }
];

// src/utils/storage.ts
var getConfig = (key, defaultValue) => {
  if (typeof GM_getValue !== "undefined") {
    return GM_getValue(key, defaultValue);
  }
  const val = localStorage.getItem(`fcx_${key}`);
  if (val === null)
    return defaultValue;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};
var setConfig = (key, value) => {
  if (typeof GM_setValue !== "undefined") {
    GM_setValue(key, value);
    return;
  }
  localStorage.setItem(`fcx_${key}`, JSON.stringify(value));
};
var resetConfig = (key, defaultValue) => {
  setConfig(key, defaultValue);
};
var getScopedConfigKey = (key, scope) => {
  return `${key}_${scope}`;
};
var getEffectiveConfig = (key, scope) => {
  const general = getConfig(key, false);
  if (general === true)
    return true;
  const scopedKey = getScopedConfigKey(key, scope);
  return getConfig(scopedKey, false);
};

// src/ui/config-panel.ts
var createCheckbox = (checked, onChange) => {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.onchange = (e) => {
    onChange(e.target.checked);
  };
  return input;
};
var renderRow = (item) => {
  const tr = document.createElement("tr");
  const tdName = document.createElement("td");
  const label = document.createElement("div");
  label.className = "fcx-label";
  label.textContent = item.label;
  const desc = document.createElement("span");
  desc.className = "fcx-desc";
  desc.textContent = item.description;
  tdName.append(label, desc);
  const tdGeneral = document.createElement("td");
  tdGeneral.className = "fcx-col-chk";
  const generalChecked = getConfig(item.key, item.defaultValue);
  const updateRowState = (isGeneralChecked) => {
    if (isGeneralChecked) {
      tdNew.classList.add("fcx-disabled");
      tdOld.classList.add("fcx-disabled");
    } else {
      tdNew.classList.remove("fcx-disabled");
      tdOld.classList.remove("fcx-disabled");
    }
  };
  const checkGeneral = createCheckbox(generalChecked, (val) => {
    setConfig(item.key, val);
    updateRowState(val);
  });
  tdGeneral.append(checkGeneral);
  const tdNew = document.createElement("td");
  tdNew.className = "fcx-col-chk";
  if (!item.scopes || item.scopes.includes("new")) {
    const keyNew = getScopedConfigKey(item.key, "new");
    const checkNew = createCheckbox(getConfig(keyNew, false), (val) => setConfig(keyNew, val));
    tdNew.append(checkNew);
  }
  const tdOld = document.createElement("td");
  tdOld.className = "fcx-col-chk";
  if (!item.scopes || item.scopes.includes("old")) {
    const keyOld = getScopedConfigKey(item.key, "old");
    const checkOld = createCheckbox(getConfig(keyOld, false), (val) => setConfig(keyOld, val));
    tdOld.append(checkOld);
  }
  updateRowState(generalChecked);
  tr.append(tdName, tdGeneral, tdNew, tdOld);
  return tr;
};
var toggleConfigPanel = () => {
  if (document.getElementById("fcx-config-panel")) {
    closePanel();
    return;
  }
  openPanel();
};
var openPanel = () => {
  const backdrop = document.createElement("div");
  backdrop.id = "fcx-config-backdrop";
  backdrop.onclick = closePanel;
  const panel = document.createElement("div");
  panel.id = "fcx-config-panel";
  const header = document.createElement("div");
  header.id = "fcx-config-header";
  header.textContent = "Configuración FCX";
  const content = document.createElement("div");
  content.id = "fcx-config-content";
  const table = document.createElement("table");
  table.id = "fcx-config-table";
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  const thName = document.createElement("th");
  thName.className = "fcx-col-opt";
  thName.textContent = "Opción";
  const thGen = document.createElement("th");
  thGen.className = "fcx-col-chk";
  thGen.textContent = "General";
  const thNew = document.createElement("th");
  thNew.className = "fcx-col-chk";
  thNew.textContent = "Nuevo";
  const thOld = document.createElement("th");
  thOld.className = "fcx-col-chk";
  thOld.textContent = "Antiguo";
  trHead.append(thName, thGen, thNew, thOld);
  thead.append(trHead);
  table.append(thead);
  const tbody = document.createElement("tbody");
  configs.forEach((item) => {
    if (item.type === "checkbox") {
      tbody.append(renderRow(item));
    }
  });
  table.append(tbody);
  content.append(table);
  const footer = document.createElement("div");
  footer.id = "fcx-footer";
  const closeLink = document.createElement("a");
  closeLink.textContent = "Cerrar";
  closeLink.onclick = closePanel;
  const resetLink = document.createElement("a");
  resetLink.textContent = "Restaurar todo";
  resetLink.onclick = () => {
    if (confirm("¿Restaurar toda la configuración?")) {
      configs.forEach((c) => {
        resetConfig(c.key, c.defaultValue);
        if (!c.scopes || c.scopes.includes("new")) {
          resetConfig(getScopedConfigKey(c.key, "new"), false);
        }
        if (!c.scopes || c.scopes.includes("old")) {
          resetConfig(getScopedConfigKey(c.key, "old"), false);
        }
      });
      closePanel();
      openPanel();
    }
  };
  footer.append(resetLink, document.createTextNode(" | "), closeLink);
  panel.append(header, content, footer);
  document.body.append(backdrop, panel);
  requestAnimationFrame(() => {
    backdrop.style.opacity = "1";
    panel.style.opacity = "1";
    panel.style.transform = "translate(-50%, -50%) scale(1)";
  });
};
var closePanel = () => {
  const b = document.getElementById("fcx-config-backdrop");
  const p = document.getElementById("fcx-config-panel");
  if (b && p) {
    b.style.opacity = "0";
    p.style.opacity = "0";
    setTimeout(() => {
      b.remove();
      p.remove();
    }, 200);
  }
};

// src/lib/style-comment.ts
var styleComment = (element, _selectors) => {
  if (element.dataset.processed === "true")
    return;
  element.dataset.processed = "true";
  element.classList.add(theme.enhancedCommentClass);
};

// src/lib/watch-feed.ts
var watchFeed = (selectors) => {
  if (!window.location.href.includes("showthread.php")) {
    logger.log("Watch Feed: Not a thread page.");
    return () => {};
  }
  const feed = document.querySelector(selectors.feedContainer);
  if (!feed) {
    logger.warn("Feed container not found, retrying in 1s...");
    const timer = setTimeout(() => watchFeed(selectors), 1000);
    return () => clearTimeout(timer);
  }
  logger.log("Feed found, starting watcher...");
  const existing = feed.querySelectorAll(selectors.commentItem);
  existing.forEach((el) => {
    styleComment(el, selectors);
  });
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) {
          if (node.matches(selectors.commentItem)) {
            styleComment(node, selectors);
          } else {
            const children = node.querySelectorAll(selectors.commentItem);
            children.forEach((el) => {
              styleComment(el, selectors);
            });
          }
        }
      }
    }
  });
  observer.observe(feed, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    logger.log("Feed watcher stopped");
  };
};

// src/lib/infinite-scroll.ts
var isLoading = false;
var nextUrl = null;
var prevUrl = null;
var currentSelectors = null;
var initInfiniteScroll = (selectors) => {
  currentSelectors = selectors;
  if (currentPageType !== "THREAD" /* THREAD */) {
    logger.log("Infinite Scroll: Not a thread page.");
    return;
  }
  const prevLink = document.querySelector(selectors.prevPageLink);
  if (prevLink) {
    prevUrl = prevLink.href;
    logger.log("Infinite Scroll: Prev page is", prevUrl);
    const topSentry = document.createElement("div");
    topSentry.id = "infinite-scroll-top-sentry";
    topSentry.innerHTML = "<p style='color: #666; font-weight: bold;'>Cargando página anterior...</p>";
    topSentry.style.textAlign = "center";
    topSentry.style.padding = "40px";
    const feed = document.querySelector(selectors.feedContainer);
    if (feed)
      feed.before(topSentry);
    const topObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && prevUrl) {
        loadPrevPage();
      }
    }, { rootMargin: "300px" });
    topObserver.observe(topSentry);
  }
  const nextLink = document.querySelector(selectors.nextPageLink);
  if (!nextLink) {
    logger.log("Infinite Scroll: No next page found.");
  } else {
    nextUrl = nextLink.href;
    logger.log("Infinite Scroll: Next page is", nextUrl);
    const bottomSentry = document.createElement("div");
    bottomSentry.id = "infinite-scroll-bottom-sentry";
    bottomSentry.innerHTML = "<p style='color: #666; font-weight: bold;'>Cargando página siguiente...</p>";
    bottomSentry.style.textAlign = "center";
    bottomSentry.style.padding = "40px";
    const feed = document.querySelector(selectors.feedContainer);
    if (feed)
      feed.after(bottomSentry);
    const bottomObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && nextUrl) {
        loadNextPage();
      }
    }, { rootMargin: "300px" });
    bottomObserver.observe(bottomSentry);
  }
};
var getPageNumber = (url) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get("page");
  } catch (e) {
    console.error("Error parsing URL for page number", e);
    return null;
  }
};
var getPageNumberFromDoc = (doc) => {
  if (currentSelectors?.activePage) {
    const activePageEl = doc.querySelector(currentSelectors.activePage);
    if (activePageEl?.textContent) {
      return activePageEl.textContent.trim();
    }
  }
  return null;
};
var createSeparator = (pageNumber) => {
  const div = document.createElement("div");
  div.classList.add("infinite-scroll-separator");
  const line = document.createElement("div");
  line.classList.add("infinite-scroll-separator-line");
  const span = document.createElement("span");
  span.textContent = `Página ${pageNumber}`;
  span.classList.add("infinite-scroll-separator-text");
  div.appendChild(line);
  div.appendChild(span);
  return div;
};
var loadPrevPage = async () => {
  if (!prevUrl)
    return;
  isLoading = true;
  try {
    const response = await fetch(prevUrl);
    const text = await response.text();
    const parser = new DOMParser;
    const doc = parser.parseFromString(text, "text/html");
    const newFeed = doc.querySelector(currentSelectors.feedContainer);
    const currentFeed = document.querySelector(currentSelectors.feedContainer);
    if (newFeed && currentFeed) {
      const oldScrollHeight = document.documentElement.scrollHeight;
      const oldScrollTop = document.documentElement.scrollTop;
      Array.from(newFeed.children).reverse().forEach((child) => {
        const importedNode = document.importNode(child, true);
        currentFeed.insertBefore(importedNode, currentFeed.firstChild);
      });
      const pageNum = getPageNumberFromDoc(doc) || getPageNumber(prevUrl);
      if (pageNum) {
        const separator = createSeparator(pageNum);
        currentFeed.insertBefore(separator, currentFeed.firstChild);
      }
      const newScrollHeight = document.documentElement.scrollHeight;
      document.documentElement.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
    }
    const prevLink = doc.querySelector(currentSelectors.prevPageLink);
    if (prevLink) {
      prevUrl = prevLink.href;
    } else {
      prevUrl = null;
      document.querySelector("#infinite-scroll-top-sentry")?.remove();
    }
  } catch (err) {
    console.error("Infinite Scroll (Prev) Error:", err);
  } finally {
    isLoading = false;
  }
};
var loadNextPage = async () => {
  if (!nextUrl)
    return;
  isLoading = true;
  try {
    const response = await fetch(nextUrl);
    const text = await response.text();
    const parser = new DOMParser;
    const doc = parser.parseFromString(text, "text/html");
    const newFeed = doc.querySelector(currentSelectors.feedContainer);
    const currentFeed = document.querySelector(currentSelectors.feedContainer);
    if (newFeed && currentFeed) {
      const pageNum = getPageNumberFromDoc(doc) || getPageNumber(nextUrl);
      if (pageNum) {
        const separator = createSeparator(pageNum);
        currentFeed.appendChild(separator);
      }
      Array.from(newFeed.children).forEach((child) => {
        const importedNode = document.importNode(child, true);
        currentFeed.appendChild(importedNode);
      });
    }
    const nextLink = doc.querySelector(currentSelectors.nextPageLink);
    if (nextLink) {
      nextUrl = nextLink.href;
    } else {
      nextUrl = null;
      document.querySelector("#infinite-scroll-bottom-sentry")?.remove();
    }
  } catch (err) {
    console.error("Infinite Scroll Error:", err);
  } finally {
    isLoading = false;
  }
};

// src/lib/remove-banners.ts
var removeBanners = (scope) => {
  const shouldRemove = getEffectiveConfig(CONFIG_KEYS.REMOVE_BANNERS, scope);
  if (!shouldRemove)
    return;
  const banner = document.getElementById("notices-wrapper");
  if (banner) {
    banner.remove();
  }
};

// src/adapters/new-adapter.ts
class NewSiteAdapter {
  name = "New Interface";
  selectors;
  constructor() {
    this.selectors = newSelectors;
  }
  init() {
    logger.log(`Initializing ${this.name} adapter...`);
    this.removeSidebar();
    removeBanners("new");
  }
  removeSidebar() {
    const shouldRemove = getEffectiveConfig(CONFIG_KEYS.REMOVE_SIDEBAR, "new");
    if (!shouldRemove)
      return;
    const sidebar = document.querySelector("#sidebar");
    if (sidebar)
      sidebar.remove();
    const main = document.querySelector("main");
    if (main)
      main.style.display = "block";
  }
  setupFeatures() {
    watchFeed(this.selectors);
    if (getEffectiveConfig(CONFIG_KEYS.INFINITE_SCROLL, "new")) {
      initInfiniteScroll(this.selectors);
    }
  }
}

// src/adapters/old-adapter.ts
class OldSiteAdapter {
  name = "Old Interface";
  selectors;
  constructor() {
    this.selectors = oldSelectors;
  }
  init() {
    logger.log(`Initializing ${this.name} adapter...`);
    removeBanners("old");
  }
  setupFeatures() {
    watchFeed(this.selectors);
    if (getEffectiveConfig(CONFIG_KEYS.INFINITE_SCROLL, "old")) {
      initInfiniteScroll(this.selectors);
    }
  }
}

// src/index.ts
(() => {
  injectConsole("FCX");
  GM_addStyle(style_default);
  const isNew = isNewInterface();
  logger.log("Script initializing...");
  logger.log(`Interface: ${isNew ? "New" : "Old"}`);
  logger.log(`Page Type: ${currentPageType}`);
  const adapter = isNew ? new NewSiteAdapter : new OldSiteAdapter;
  adapter.init();
  adapter.setupFeatures();
  GM_registerMenuCommand("Configuración", toggleConfigPanel);
  return () => {
    logger.log("Script unloaded");
  };
})();
