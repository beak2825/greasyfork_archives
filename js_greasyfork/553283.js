// ==UserScript==
// @name         GPT Branch Tree Navigator (Preview + Jump)
// @namespace    jiaoling.tools.gpt.tree
// @version      1.6.0
// @description  树状分支 + 预览 + 一键跳转；支持隐藏与悬浮按钮恢复；快捷键 Alt+T；/ 聚焦搜索、Esc 关闭；拖拽移动面板；渐进式渲染；Markdown 预览；防抖监听；修复：当前分支已渲染却被误判为“未在该分支”。
// @author       Jiaoling
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553283/GPT%20Branch%20Tree%20Navigator%20%28Preview%20%2B%20Jump%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553283/GPT%20Branch%20Tree%20Navigator%20%28Preview%20%2B%20Jump%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /** *************************** 配置 *************************** */
  const CONFIG = Object.freeze({
    PANEL_WIDTH_MIN: 350,
    PANEL_WIDTH_MAX: 500,
    PANEL_WIDTH_DEFAULT: 400,
    PANEL_WIDTH_STEP: 1,
    CARD_WIDTH_MAX: 400,
    CARD_INDENT: 25,
    PREVIEW_FULL_LINES: 2,
    PREVIEW_TAIL_CHARS: 10,
    HIGHLIGHT_MS: 1400,
    SCROLL_OFFSET: 80,
    LS_KEY: "gtt_prefs_v3",
    RENDER_CHUNK: 120,
    RENDER_IDLE_MS: 12,
    OBS_DEBOUNCE_MS: 250,
    SIG_TEXT_LEN: 200,
    SELECTORS: {
      scrollRoot: "main",
      messageBlocks: [
        "[data-message-author-role]",
        "article:has(.markdown)",
        "main [data-testid^=\"conversation-turn\"]",
        "main .group.w-full",
        "main [data-message-id]"
      ].join(","),
      messageText: [
        ".markdown", ".prose",
        "[data-message-author-role] .whitespace-pre-wrap",
        "[data-message-author-role]"
      ].join(","),
    },
    ENDPOINTS: (cid) => ({
      get: [
        `/backend-api/conversation/${cid}`,
        `/backend-api/conversation/${cid}/`,
      ]
    })
  });

  /** *************************** 样式 *************************** */
  class StyleManager {
    static ensure(cssText) {
      try {
        GM_addStyle(cssText);
      } catch (_) {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.appendChild(style);
      }
    }
  }

  const PANEL_STYLE = `
    :root{--gtt-cur:#fa8c16;}
    #gtt-panel{
      position:fixed;top:64px;right:12px;z-index:999999;
      width:min(var(--gtt-panel-width, ${CONFIG.PANEL_WIDTH_DEFAULT}px), calc(100vw - 24px));
      max-width:min(${CONFIG.PANEL_WIDTH_MAX}px, calc(100vw - 24px));
      min-width:min(${CONFIG.PANEL_WIDTH_MIN}px, calc(100vw - 24px));
      max-height:calc(100vh - 84px);display:flex;flex-direction:column;overflow:hidden;
      border-radius:12px;border:1px solid var(--gtt-bd,#d0d7de);background:var(--gtt-bg,#fff);
      box-shadow:0 8px 28px rgba(0,0,0,.18);font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial;
      user-select:none
    }
    #gtt-header{display:flex;gap:8px;align-items:center;padding:10px 10px 10px 18px;border-bottom:1px solid var(--gtt-bd,#d0d7de);background:var(--gtt-hd,#f6f8fa)}
    #gtt-header .title{font-weight:700;flex:1;cursor:move}
    #gtt-header .btn{border:1px solid var(--gtt-bd,#d0d7de);background:#fff;cursor:pointer;padding:4px 8px;border-radius:8px;font-size:12px}
    #gtt-body{display:flex;flex-direction:column;min-height:0;flex:1 1 auto}
    #gtt-search{margin:8px 10px 8px 18px;padding:6px 8px;border:1px solid var(--gtt-bd,#d0d7de);border-radius:8px;width:calc(100% - 28px);outline:none;background:var(--gtt-bg,#fff)}
    #gtt-resize{position:absolute;top:0;left:0;width:8px;height:100%;cursor:ew-resize;display:flex;align-items:center;justify-content:center;z-index:1;touch-action:none}
    #gtt-resize::after{content:'';width:2px;height:32px;border-radius:1px;background:var(--gtt-bd,#d0d7de);opacity:.55;transition:opacity .2s ease}
    #gtt-resize:hover::after{opacity:.85}
    #gtt-pref{display:flex;gap:10px;align-items:center;padding:0 10px 8px 18px;color:#555;flex-wrap:wrap}
    #gtt-pref .gtt-pref-row{display:flex;align-items:center;gap:8px;flex:1 1 100%;font-size:12px}
    #gtt-pref .gtt-pref-title{white-space:nowrap;opacity:.8}
    #gtt-pref .gtt-pref-value{min-width:44px;text-align:right;opacity:.8}
    #gtt-pref input[type="range"]{flex:1 1 auto}
    #gtt-pref .gtt-pref-reset{border:1px solid var(--gtt-bd,#d0d7de);background:var(--gtt-bg,#fff);color:inherit;padding:2px 6px;border-radius:6px;font-size:11px;cursor:pointer}
    #gtt-tree{overflow:auto;overflow-x:auto;padding:8px 12px 10px 18px;max-width:calc(${CONFIG.PANEL_WIDTH_MAX}px - 30px);flex:1 1 auto;min-height:0;width:100%;max-height:var(--gtt-tree-max-height,360px)}
    .gtt-node{padding:6px 8px;border-radius:8px;margin:2px 0;cursor:pointer;position:relative;display:flex;flex-direction:column;gap:4px;width:100%;max-width:${CONFIG.CARD_WIDTH_MAX}px;flex-shrink:0;box-sizing:border-box}
    .gtt-node:hover{background:rgba(127,127,255,.08)}
    .gtt-node .head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
    .gtt-node .badge{display:inline-flex;align-items:center;justify-content:center;font-size:10px;padding:1px 5px;border-radius:6px;border:1px solid var(--gtt-bd,#d0d7de);opacity:.75;min-width:18px}
    .gtt-node .title{font-weight:600;word-break:break-word;flex:1 1 auto}
    .gtt-node .meta{opacity:.65;font-size:10px;margin-left:auto;white-space:nowrap}
    .gtt-node .pv{display:flex;flex-direction:column;gap:2px;opacity:.88;margin:0;white-space:normal;word-break:break-word}
    .gtt-node .pv-line{display:block}
    .gtt-node .pv-line-more{font-size:12px;opacity:.7}
    .gtt-children{margin-left:${CONFIG.CARD_INDENT}px;border-left:1px dashed var(--gtt-bd,#d0d7de);padding-left:10px}
    .gtt-hidden{display:none!important}
    .gtt-highlight{outline:3px solid rgba(88,101,242,.65)!important;transition:outline-color .6s ease}
    .gtt-node.gtt-current{background:rgba(250,140,22,.12);border-left:2px solid var(--gtt-cur,#fa8c16);padding-left:10px}
    .gtt-node.gtt-current .badge{border-color:var(--gtt-cur,#fa8c16);color:var(--gtt-cur,#fa8c16);opacity:1}
    .gtt-node.gtt-current-leaf{box-shadow:0 0 0 2px rgba(250,140,22,.24) inset}
    .gtt-children.gtt-current-line{border-left:2px dashed var(--gtt-cur,#fa8c16)}
    #gtt-modal{position:fixed;inset:0;z-index:1000000;background:rgba(0,0,0,.42);display:none;align-items:center;justify-content:center}
    #gtt-modal .card{max-width:880px;max-height:80vh;overflow:auto;background:var(--gtt-bg,#fff);border:1px solid var(--gtt-bd,#d0d7de);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.25)}
    #gtt-modal .hd{display:flex;align-items:center;gap:8px;padding:10px;border-bottom:1px solid var(--gtt-bd,#d0d7de);background:var(--gtt-hd,#f6f8fa);position:sticky;top:0;z-index:1}
    #gtt-modal .bd{padding:12px 16px;font-size:14px;line-height:1.65;overflow-x:auto}
    #gtt-modal .bd p{margin:0 0 10px}
    #gtt-modal .bd h1,#gtt-modal .bd h2,#gtt-modal .bd h3,#gtt-modal .bd h4,#gtt-modal .bd h5,#gtt-modal .bd h6{margin:18px 0 10px;font-weight:600}
    #gtt-modal .bd pre{background:rgba(99,110,123,.08);padding:10px 12px;border-radius:8px;margin:12px 0;font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:13px;line-height:1.55;white-space:pre;overflow:auto}
    #gtt-modal .bd code{background:rgba(99,110,123,.2);padding:1px 4px;border-radius:4px;font-family:SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:13px}
    #gtt-modal .bd pre code{background:transparent;padding:0}
    #gtt-modal .bd ul{margin:0 0 12px 18px;padding:0 0 0 12px}
    #gtt-modal .bd li{margin:4px 0}
    #gtt-modal .btn{border:1px solid var(--gtt-bd,#d0d7de);background:#fff;cursor:pointer;padding:4px 8px;border-radius:8px;font-size:12px}
    #gtt-fab{
      position:fixed;right:12px;bottom:16px;z-index:999999;display:none;align-items:center;gap:8px;
      padding:8px 12px;border-radius:999px;border:1px solid var(--gtt-bd,#d0d7de);
      background:var(--gtt-bg,#fff);box-shadow:0 8px 28px rgba(0,0,0,.18);cursor:pointer
    }
    #gtt-fab .dot{width:8px;height:8px;border-radius:50%;background:#5865f2}
    #gtt-fab .txt{font-weight:600}
    @media (prefers-color-scheme: dark){
      :root{--gtt-bg:#0b0e14;--gtt-hd:#0f131a;--gtt-bd:#2b3240;--gtt-cur:#f59b4c;color-scheme:dark}
      #gtt-header .btn,#gtt-modal .btn,#gtt-fab{background:#0b0e14;color:#d1d7e0}
      .gtt-node:hover{background:rgba(120,152,255,.12)}
      .gtt-node.gtt-current{background:rgba(250,140,22,.18)}
    }
  `;

  StyleManager.ensure(PANEL_STYLE);

  /** *************************** 基础工具 *************************** */
  class DOMUtils {
    static query(selector, root = document) { return root.querySelector(selector); }
    static queryAll(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }
  }

  class TextUtils {
    static normalize(value) {
      return (value || "").replace(/\u200b/g, "").replace(/\s+/g, " ").trim();
    }
    static normalizeForPreview(value) {
      return (value || "").replace(/\u200b/g, "").replace(/\r\n?/g, "\n");
    }
    static truncateUnits(value, length) {
      if (!value) return "";
      if (!Number.isFinite(length) || length <= 0) return value;
      const units = Array.from(value);
      if (units.length <= length) return value;
      return units.slice(0, length).join("");
    }
  }

  class HashUtils {
    static of(value) {
      const input = value || "";
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
      }
      return (hash >>> 0).toString(36);
    }
  }

  class HTMLUtils {
    static get ESCAPES() {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    }
    static escape(text = "") {
      return text.replace(/[&<>'"]/g, (ch) => HTMLUtils.ESCAPES[ch] || ch);
    }
    static escapeAttr(text = "") {
      return HTMLUtils.escape(text).replace(/`/g, "&#96;");
    }
    static formatInline(text = "") {
      const holders = [];
      let out = HTMLUtils.escape(text)
        .replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => `<a href="${HTMLUtils.escapeAttr(url)}" target="_blank" rel="noreferrer noopener">${label}</a>`)
        .replace(/<code>[^<]*<\/code>/g, (match) => { holders.push(match); return `\uFFF0${holders.length - 1}\uFFF1`; })
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
        .replace(/__([^_\n]+)__/g, "<strong>$1</strong>")
        .replace(/(\s|^)\*([^*\n]+)\*(?=\s|[\.,!?:;\)\]\}“”"'`]|$)/g, (_m, pre, body) => `${pre}<em>${body}</em>`)
        .replace(/(\s|^)_(?!_)([^_\n]+)_(?=\s|[\.,!?:;\)\]\}“”"'`]|$)/g, (_m, pre, body) => `${pre}<em>${body}</em>`);
      out = out.replace(/\uFFF0(\d+)\uFFF1/g, (_m, idx) => holders[Number(idx)]);
      return out;
    }
  }

  class MarkdownRenderer {
    static renderLite(raw = "") {
      const text = TextUtils.normalizeForPreview(raw || "").trimEnd();
      if (!text) return "<p>(空)</p>";
      const lines = text.split("\n");
      const html = [];
      let inList = false;
      let codeBuffer = null;
      let codeLang = "";
      const flushList = () => {
        if (inList) html.push("</ul>");
        inList = false;
      };
      const flushCode = () => {
        if (!codeBuffer) return;
        const cls = codeLang ? ` class="lang-${HTMLUtils.escapeAttr(codeLang)}"` : "";
        const body = codeBuffer.map(HTMLUtils.escape).join("\n");
        html.push(`<pre><code${cls}>${body}</code></pre>`);
        codeBuffer = null;
        codeLang = "";
      };
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^```/.test(trimmed)) {
          if (codeBuffer) {
            flushCode();
          } else {
            flushList();
            codeBuffer = [];
            codeLang = trimmed.slice(3).trim();
          }
          continue;
        }
        if (codeBuffer) {
          codeBuffer.push(line);
          continue;
        }
        if (!trimmed) {
          flushList();
          html.push("<br>");
          continue;
        }
        const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
          flushList();
          const level = heading[1].length;
          html.push(`<h${level}>${HTMLUtils.formatInline(heading[2])}</h${level}>`);
          continue;
        }
        const listItem = line.match(/^\s*[-*+]\s+(.*)$/);
        if (listItem) {
          if (!inList) {
            html.push("<ul>");
            inList = true;
          }
          html.push(`<li>${HTMLUtils.formatInline(listItem[1])}</li>`);
          continue;
        }
        flushList();
        html.push(`<p>${HTMLUtils.formatInline(line)}</p>`);
      }
      flushCode();
      flushList();
      return html.join("");
    }
  }

  class PreviewBuilder {
    static lines(rawText) {
      const normalized = TextUtils
        .normalizeForPreview(rawText || "")
        .split("\n")
        .map((segment) => TextUtils.normalize(segment))
        .filter(Boolean);
      if (!normalized.length) return ["(空)"];
      const take = CONFIG.PREVIEW_FULL_LINES > 0
        ? Math.min(CONFIG.PREVIEW_FULL_LINES, normalized.length)
        : Math.min(2, normalized.length);
      const result = [];
      for (let i = 0; i < take; i++) {
        result.push(normalized[i]);
      }
      if (normalized.length > take) {
        const rest = TextUtils.normalize(normalized.slice(take).join(" "));
        if (rest) {
          const snippet = CONFIG.PREVIEW_TAIL_CHARS > 0
            ? TextUtils.truncateUnits(rest, CONFIG.PREVIEW_TAIL_CHARS)
            : "";
          result.push(`${snippet}...`);
        }
      }
      return result;
    }
  }

  class PreferenceStore {
    constructor(key, defaults) {
      this.key = key;
      this.defaults = { ...defaults };
      this.state = this.load();
    }
    load() {
      try {
        const raw = localStorage.getItem(this.key) || localStorage.getItem("gtt_prefs_v2");
        const parsed = raw ? JSON.parse(raw) : {};
        return { ...this.defaults, ...parsed };
      } catch (_) {
        return { ...this.defaults };
      }
    }
    snapshot() { return { ...this.state }; }
    get(key) { return this.state[key]; }
    set(key, value, { silent = false } = {}) {
      this.state = { ...this.state, [key]: value };
      if (!silent) this.save();
    }
    assign(patch, { silent = false } = {}) {
      this.state = { ...this.state, ...patch };
      if (!silent) this.save();
    }
    save() {
      try {
        localStorage.setItem(this.key, JSON.stringify(this.state));
      } catch (_) {
        /* ignore */
      }
    }
  }

  class IdleScheduler {
    static rafIdle(fn, ms = CONFIG.RENDER_IDLE_MS) {
      return setTimeout(fn, ms);
    }
    static debounce(fn, wait) {
      let timer = null;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
      };
    }
  }

  class Signature {
    static create(role, text) {
      return (role || "assistant") + "|" + HashUtils.of(TextUtils.normalize(text).slice(0, CONFIG.SIG_TEXT_LEN));
    }
  }

  class BranchState {
    constructor() {
      this.reset();
    }
    reset() {
      this.mapping = null;
      this.latestLinear = [];
      this.domBySig = new Map();
      this.domById = new Map();
      this.currentBranchIds = new Set();
      this.currentBranchSigs = new Set();
      this.currentBranchLeafId = null;
      this.currentBranchLeafSig = null;
    }
    setMapping(mapping) {
      this.mapping = mapping || null;
    }
    collectFromDom() {
      const blocks = DOMUtils.queryAll(CONFIG.SELECTORS.messageBlocks);
      const result = [];
      const ids = new Set();
      const sigs = new Set();
      const domBySig = new Map();
      const domById = new Map();
      for (const el of blocks) {
        const textEl = DOMUtils.query(CONFIG.SELECTORS.messageText, el) || el;
        const raw = (textEl?.innerText || "").trim();
        const text = TextUtils.normalize(raw);
        if (!text) continue;
        let role = el.getAttribute("data-message-author-role");
        if (!role) role = el.querySelector(".markdown,.prose") ? "assistant" : "user";
        const messageId = el.getAttribute("data-message-id")
          || el.dataset?.messageId
          || DOMUtils.query("[data-message-id]", el)?.getAttribute("data-message-id")
          || (el.id?.startsWith("conversation-turn-") ? el.id.split("conversation-turn-")[1] : null);
        const id = messageId ? messageId : (`lin-${HashUtils.of(text.slice(0, 80))}`);
        const sig = Signature.create(role, text);
        const record = { id, role, text, sig, _el: el };
        result.push(record);
        domBySig.set(sig, el);
        if (messageId) domById.set(messageId, el);
        ids.add(id);
        sigs.add(sig);
      }
      this.domBySig = domBySig;
      this.domById = domById;
      this.currentBranchIds = ids;
      this.currentBranchSigs = sigs;
      if (result.length) {
        const leaf = result[result.length - 1];
        this.currentBranchLeafId = leaf?.id || null;
        this.currentBranchLeafSig = leaf?.sig || null;
      } else {
        this.currentBranchLeafId = null;
        this.currentBranchLeafSig = null;
      }
      this.latestLinear = result;
      return result;
    }
    applyHighlight(rootEl) {
      if (!rootEl) return;
      const nodeEls = rootEl.querySelectorAll(".gtt-node");
      const connectorEls = rootEl.querySelectorAll(".gtt-children");
      nodeEls.forEach((el) => el.classList.remove("gtt-current", "gtt-current-leaf"));
      connectorEls.forEach((el) => el.classList.remove("gtt-current-line"));
      const hasBranch = this.currentBranchIds.size || this.currentBranchSigs.size;
      if (!hasBranch) return;
      nodeEls.forEach((el) => {
        const id = el.dataset?.nodeId;
        const sig = el.dataset?.sig;
        const chainIds = Array.isArray(el._chainIds) ? el._chainIds : null;
        const chainSigs = Array.isArray(el._chainSigs) ? el._chainSigs : null;
        const matchesId = id && this.currentBranchIds.has(id);
        const matchesSig = sig && this.currentBranchSigs.has(sig);
        const matchesChainId = chainIds ? chainIds.some((cid) => this.currentBranchIds.has(cid)) : false;
        const matchesChainSig = chainSigs ? chainSigs.some((cs) => this.currentBranchSigs.has(cs)) : false;
        const isCurrent = matchesId || matchesSig || matchesChainId || matchesChainSig;
        if (!isCurrent) return;
        el.classList.add("gtt-current");
        const isLeaf = (
          (this.currentBranchLeafId && (id === this.currentBranchLeafId || (chainIds && chainIds.includes(this.currentBranchLeafId))))
          || (this.currentBranchLeafSig && (sig === this.currentBranchLeafSig || (chainSigs && chainSigs.includes(this.currentBranchLeafSig))))
        );
        if (isLeaf) el.classList.add("gtt-current-leaf");
        const parent = el.parentElement;
        if (parent?.classList?.contains("gtt-children")) {
          parent.classList.add("gtt-current-line");
        }
      });
    }
  }

  class Navigator {
    constructor(branchState, panel) {
      this.branchState = branchState;
      this.panel = panel;
      this.SCROLLABLE_VALUES = new Set(["auto", "scroll", "overlay"]);
    }
    openModal(text, reason) {
      this.panel.showModal(text, reason);
    }
    closeModal() {
      this.panel.hideModal();
    }
    findScrollContainer(el) {
      const rootSel = CONFIG.SELECTORS?.scrollRoot;
      if (rootSel) {
        const root = document.querySelector(rootSel);
        if (root && root.contains(el) && root.scrollHeight > root.clientHeight + 8) {
          return root;
        }
      }
      let cur = el?.parentElement;
      while (cur && cur !== document.body) {
        const style = getComputedStyle(cur);
        if ((this.SCROLLABLE_VALUES.has(style.overflowY) || this.SCROLLABLE_VALUES.has(style.overflow)) && cur.scrollHeight > cur.clientHeight + 8) {
          return cur;
        }
        cur = cur.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    }
    scrollToEl(el) {
      if (!el) return;
      const container = this.findScrollContainer(el);
      if (container && container !== document.body && container !== document.documentElement) {
        const rect = el.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        const offset = rect.top - parentRect.top + container.scrollTop - CONFIG.SCROLL_OFFSET;
        container.scrollTo({ top: offset, behavior: "smooth" });
      } else {
        const offset = el.getBoundingClientRect().top + window.scrollY - CONFIG.SCROLL_OFFSET;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
      el.classList.add("gtt-highlight");
      setTimeout(() => el.classList.remove("gtt-highlight"), CONFIG.HIGHLIGHT_MS);
    }
    locateByText(text) {
      const snippet = TextUtils.normalize(text).slice(0, 120);
      if (!snippet) return null;
      const blocks = DOMUtils.queryAll(CONFIG.SELECTORS.messageBlocks);
      let best = null;
      let score = -1;
      for (const el of blocks) {
        const textEl = DOMUtils.query(CONFIG.SELECTORS.messageText, el) || el;
        const normalized = TextUtils.normalize(textEl?.innerText || "");
        const idx = normalized.indexOf(snippet);
        if (idx >= 0) {
          const sc = 3000 - idx + Math.min(120, snippet.length);
          if (sc > score) {
            score = sc;
            best = el;
          }
        }
      }
      return best;
    }
    async jumpTo(node) {
      if (!node) return;
      let target = this.branchState.domById.get(node.id);
      if (target && target.isConnected) return this.scrollToEl(target);
      const sig = node.sig || Signature.create(node.role, node.text);
      target = this.branchState.domBySig.get(sig);
      if (target && target.isConnected) return this.scrollToEl(target);
      target = this.locateByText(node.text);
      if (target) return this.scrollToEl(target);
      this.openModal(node.text || "(无文本)", "节点预览（未能定位到页面元素，已为你展示文本）");
    }
  }

  class PanelView {
    constructor(prefs) {
      this.prefs = prefs;
      this.panelEl = null;
      this.fabEl = null;
      this.treeEl = null;
      this.statsEl = null;
      this.modalEl = null;
      this.modalBodyEl = null;
      this.modalTitleEl = null;
      this.widthRangeEl = null;
      this.widthValueEl = null;
      this.searchInputEl = null;
      this.dragHandle = null;
      this.resizeHandle = null;
      this.handlers = { refresh: () => {} };
      this.resizeListenerBound = false;
      this.treeHeightScheduled = false;
      this.hiddenState = !!this.prefs.get("hidden");
    }
    ensureMounted() {
      if (this.panelEl) return;
      this.ensureFab();
      this.createPanel();
    }
    ensureFab() {
      if (this.fabEl) return;
      const fab = document.createElement("div");
      fab.id = "gtt-fab";
      fab.innerHTML = `<span class="dot"></span><span class="txt">GPT Tree</span>`;
      fab.addEventListener("click", () => this.setHidden(false));
      document.body.appendChild(fab);
      this.fabEl = fab;
      this.syncFabVisibility();
    }
    createPanel() {
      if (this.panelEl) return;
      const panel = document.createElement("div");
      panel.id = "gtt-panel";
      panel.innerHTML = `
        <div id="gtt-resize" title="拖拽调整宽度"></div>
        <div id="gtt-header">
          <div class="title" id="gtt-drag">GPT Tree</div>
          <button class="btn" id="gtt-btn-refresh">刷新</button>
          <button class="btn" id="gtt-btn-hide" title="隐藏（Alt+T）">隐藏</button>
        </div>
        <div id="gtt-body">
          <input id="gtt-search" placeholder="搜索节点（文本/角色）… / 聚焦，Esc 清除">
          <div id="gtt-pref">
            <span style="opacity:.65" id="gtt-stats"></span>
            <div class="gtt-pref-row">
              <span class="gtt-pref-title">最大宽度</span>
              <input type="range" id="gtt-width-range" step="${CONFIG.PANEL_WIDTH_STEP}">
              <span class="gtt-pref-value" id="gtt-width-value"></span>
              <button type="button" class="gtt-pref-reset" id="gtt-width-reset" title="恢复默认宽度">重置</button>
            </div>
          </div>
          <div id="gtt-tree"></div>
        </div>
        <div id="gtt-modal">
          <div class="card">
            <div class="hd">
              <div style="font-weight:700;flex:1" id="gtt-md-title">节点预览</div>
              <button class="btn" id="gtt-md-close">关闭</button>
            </div>
            <div class="bd" id="gtt-md-body"></div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);
      this.panelEl = panel;
      this.treeEl = DOMUtils.query("#gtt-tree", panel);
      this.statsEl = DOMUtils.query("#gtt-stats", panel);
      this.modalEl = DOMUtils.query("#gtt-modal", panel);
      this.modalBodyEl = DOMUtils.query("#gtt-md-body", panel);
      this.modalTitleEl = DOMUtils.query("#gtt-md-title", panel);
      this.widthRangeEl = DOMUtils.query("#gtt-width-range", panel);
      this.widthValueEl = DOMUtils.query("#gtt-width-value", panel);
      this.searchInputEl = DOMUtils.query("#gtt-search", panel);
      this.dragHandle = DOMUtils.query("#gtt-drag", panel);
      this.resizeHandle = DOMUtils.query("#gtt-resize", panel);
      const btnHide = DOMUtils.query("#gtt-btn-hide", panel);
      const btnRefresh = DOMUtils.query("#gtt-btn-refresh", panel);
      const btnCloseModal = DOMUtils.query("#gtt-md-close", panel);
      const widthResetBtn = DOMUtils.query("#gtt-width-reset", panel);
      if (btnHide) btnHide.addEventListener("click", () => this.setHidden(true));
      if (btnRefresh) btnRefresh.addEventListener("click", () => this.handlers.refresh());
      if (btnCloseModal) btnCloseModal.addEventListener("click", () => this.hideModal());
      if (widthResetBtn) widthResetBtn.addEventListener("click", () => this.resetWidth());
      if (this.searchInputEl) {
        const handleSearch = IdleScheduler.debounce((value) => {
          const query = (typeof value === "string" ? value : this.searchInputEl.value || "").trim().toLowerCase();
          DOMUtils.queryAll("#gtt-tree .gtt-node").forEach((node) => {
            node.style.display = node.textContent.toLowerCase().includes(query) ? "" : "none";
          });
          this.updateTreeHeight();
        }, 120);
        this.searchInputEl.addEventListener("input", (e) => handleSearch(e.target?.value));
      }
      if (this.widthRangeEl) {
        this.widthRangeEl.addEventListener("input", (e) => {
          const value = Number(e.target?.value);
          if (Number.isFinite(value)) this.syncWidth(value, { preview: true });
        });
        this.widthRangeEl.addEventListener("change", (e) => {
          const value = Number(e.target?.value);
          this.setWidth(Number.isFinite(value) ? value : null);
        });
      }
      this.enableDrag();
      this.enableResize();
      this.applyState();
    }
    registerHandlers(handlers) {
      this.handlers = { ...this.handlers, ...handlers };
    }
    panelExists() { return !!this.panelEl; }
    get treeContainer() { return this.treeEl; }
    focusSearch() { this.searchInputEl?.focus(); }
    clearSearch() {
      if (!this.searchInputEl) return;
      this.searchInputEl.value = "";
      this.searchInputEl.dispatchEvent(new Event("input"));
    }
    showModal(text, reason = "节点预览") {
      if (!this.modalEl || !this.modalBodyEl || !this.modalTitleEl) return;
      this.modalBodyEl.innerHTML = MarkdownRenderer.renderLite(text);
      this.modalTitleEl.textContent = reason;
      this.modalEl.style.display = "flex";
    }
    hideModal() {
      if (!this.modalEl || !this.modalBodyEl) return;
      this.modalEl.style.display = "none";
      this.modalBodyEl.innerHTML = "";
    }
    isModalOpen() {
      return this.modalEl?.style?.display === "flex";
    }
    updateStats(total) {
      if (this.statsEl) this.statsEl.textContent = total ? `节点：${total}` : "";
    }
    toggleHidden() {
      this.setHidden(!this.hiddenState);
    }
    setHidden(value, { silent = false } = {}) {
      this.hiddenState = !!value;
      if (this.panelEl) {
        this.panelEl.style.display = this.hiddenState ? "none" : "flex";
        if (!this.hiddenState) this.updateTreeHeight();
      }
      this.syncFabVisibility();
      this.prefs.set("hidden", this.hiddenState, { silent });
    }
    syncFabVisibility() {
      if (!this.fabEl) return;
      this.fabEl.style.display = this.hiddenState ? "inline-flex" : "none";
    }
    applyState() {
      this.setHidden(this.prefs.get("hidden"), { silent: true });
      this.applyPosition();
      this.syncWidth();
      this.ensureResizeListener();
    }
    applyPosition(panel = this.panelEl) {
      if (!panel) return;
      const pos = this.prefs.get("pos");
      if (pos) {
        panel.style.left = `${pos.left}px`;
        panel.style.top = `${pos.top}px`;
        panel.style.right = "auto";
      }
    }
    rememberPosition() {
      if (!this.panelEl) return;
      const rect = this.panelEl.getBoundingClientRect();
      this.prefs.set("pos", { left: Math.round(rect.left), top: Math.round(rect.top) });
    }
    enableDrag() {
      const panel = this.panelEl;
      const handle = this.dragHandle;
      if (!panel || !handle) return;
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let startLeft = 0;
      let startTop = 0;
      handle.addEventListener("mousedown", (e) => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = panel.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        panel.style.right = "auto";
        const onMove = (ev) => {
          if (!dragging) return;
          const left = startLeft + (ev.clientX - startX);
          const top = startTop + (ev.clientY - startY);
          panel.style.left = `${Math.max(8, left)}px`;
          panel.style.top = `${Math.max(8, top)}px`;
        };
        const onUp = () => {
          dragging = false;
          document.removeEventListener("mousemove", onMove);
          this.rememberPosition();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp, { once: true });
      });
    }
    enableResize() {
      const panel = this.panelEl;
      const handle = this.resizeHandle;
      if (!panel || !handle) return;
      let resizing = false;
      let startX = 0;
      let startWidth = 0;
      let previewWidth = null;
      const cleanup = (onMove, onUp) => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove, true);
        document.removeEventListener("touchend", onUp, true);
        document.removeEventListener("touchcancel", onUp, true);
      };
      const startResize = (clientX) => {
        resizing = true;
        startX = clientX;
        startWidth = panel.getBoundingClientRect().width;
        previewWidth = startWidth;
        const prevUserSelect = document.body.style.userSelect;
        const prevCursor = document.body.style.cursor;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "ew-resize";
        const handleMove = (evt) => {
          if (!resizing) return;
          if (evt?.cancelable) evt.preventDefault();
          const point = evt.touches ? evt.touches[0] : evt;
          if (!point) return;
          const delta = startX - point.clientX;
          const next = this.clampWidth(startWidth + delta);
          previewWidth = next;
          this.syncWidth(next, { preview: true });
        };
        const handleUp = () => {
          if (!resizing) return;
          resizing = false;
          cleanup(handleMove, handleUp);
          document.body.style.userSelect = prevUserSelect;
          document.body.style.cursor = prevCursor;
          const stored = this.prefs.get("width");
          if (previewWidth != null && Math.abs(previewWidth - startWidth) >= 1) {
            this.setWidth(previewWidth);
          } else if (!Number.isFinite(stored)) {
            this.syncWidth(null);
          } else {
            this.syncWidth(stored);
          }
        };
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleUp, { once: true });
        document.addEventListener("touchmove", handleMove, { capture: true, passive: false });
        document.addEventListener("touchend", handleUp, { once: true, capture: true });
        document.addEventListener("touchcancel", handleUp, { once: true, capture: true });
      };
      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        startResize(e.clientX);
      });
      handle.addEventListener("touchstart", (e) => {
        const touch = e.touches?.[0];
        if (!touch) return;
        e.preventDefault();
        startResize(touch.clientX);
      }, { passive: false });
      handle.addEventListener("dblclick", (e) => {
        e.preventDefault();
        this.resetWidth();
      });
    }
    clampWidth(value) {
      const max = this.getViewportWidthLimit();
      if (!Number.isFinite(value)) return max;
      return Math.min(Math.max(CONFIG.PANEL_WIDTH_MIN, Math.round(value)), max);
    }
    getViewportWidthLimit() {
      const viewportLimit = Math.max(CONFIG.PANEL_WIDTH_MIN, Math.floor(window.innerWidth - 24));
      return Math.min(CONFIG.PANEL_WIDTH_MAX, viewportLimit);
    }
    getAutoWidth() {
      return this.clampWidth(CONFIG.PANEL_WIDTH_DEFAULT);
    }
    syncWidth(value = this.prefs.get("width"), { preview = false } = {}) {
      if (!this.panelEl) return null;
      this.updateWidthRangeBounds();
      let applied = null;
      if (Number.isFinite(value)) {
        const clamped = this.clampWidth(value);
        this.panelEl.style.setProperty("--gtt-panel-width", `${clamped}px`);
        this.updateWidthDisplay(clamped);
        applied = clamped;
      } else {
        this.panelEl.style.removeProperty("--gtt-panel-width");
        this.updateWidthDisplay(null);
      }
      if (!preview) this.updateTreeHeight();
      return applied;
    }
    setWidth(value, { silent = false } = {}) {
      if (!Number.isFinite(value)) {
        this.prefs.set("width", null, { silent });
        this.syncWidth(null);
        return null;
      }
      const clamped = this.clampWidth(value);
      this.prefs.set("width", clamped, { silent });
      this.syncWidth(clamped);
      return clamped;
    }
    resetWidth() {
      this.setWidth(null);
    }
    updateWidthRangeBounds() {
      if (!this.widthRangeEl) return;
      this.widthRangeEl.min = String(CONFIG.PANEL_WIDTH_MIN);
      this.widthRangeEl.max = String(this.getViewportWidthLimit());
    }
    updateWidthDisplay(value) {
      if (this.widthValueEl) {
        this.widthValueEl.textContent = Number.isFinite(value) ? `${this.clampWidth(value)}px` : "自动";
      }
      if (this.widthRangeEl) {
        const fallback = this.getAutoWidth();
        const displayValue = Number.isFinite(value) ? this.clampWidth(value) : fallback;
        this.widthRangeEl.value = String(displayValue);
      }
    }
    ensureResizeListener() {
      if (this.resizeListenerBound) return;
      this.resizeListenerBound = true;
      window.addEventListener("resize", () => {
        this.syncWidth();
        this.updateTreeHeight();
      });
    }
    updateTreeHeight(immediate = false) {
      if (!this.panelEl) return;
      const measure = () => {
        if (!this.treeEl) return;
        const nodes = Array.from(this.treeEl.querySelectorAll(".gtt-node")).filter((node) => node.offsetParent);
        if (!nodes.length) {
          this.treeEl.style.removeProperty("--gtt-tree-max-height");
          return;
        }
        const take = nodes.slice(0, Math.min(3, nodes.length));
        let total = 0;
        for (const node of take) {
          const style = window.getComputedStyle(node);
          const marginTop = parseFloat(style.marginTop) || 0;
          const marginBottom = parseFloat(style.marginBottom) || 0;
          total += node.offsetHeight + marginTop + marginBottom;
        }
        const treeStyle = window.getComputedStyle(this.treeEl);
        const paddingTop = parseFloat(treeStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(treeStyle.paddingBottom) || 0;
        const height = Math.max(0, Math.ceil(total + paddingTop + paddingBottom));
        if (height > 0) {
          this.treeEl.style.setProperty("--gtt-tree-max-height", `${height}px`);
        } else {
          this.treeEl.style.removeProperty("--gtt-tree-max-height");
        }
      };
      if (immediate) {
        measure();
        return;
      }
      if (this.treeHeightScheduled) return;
      this.treeHeightScheduled = true;
      const runner = () => {
        this.treeHeightScheduled = false;
        measure();
      };
      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(runner);
      } else {
        setTimeout(runner, 16);
      }
    }
  }

  class TreeBuilder {
    static isToolishRole(role) {
      return role === "tool" || role === "system" || role === "function";
    }
    static getRecText(rec) {
      const parts = rec?.message?.content?.parts ?? [];
      if (Array.isArray(parts)) return parts.join("\n");
      if (typeof parts === "string") return parts;
      return "";
    }
    static isVisibleRec(rec) {
      if (!rec) return false;
      const role = rec?.message?.author?.role || "assistant";
      if (TreeBuilder.isToolishRole(role)) return false;
      const text = TreeBuilder.getRecText(rec);
      return !!TextUtils.normalize(text);
    }
    static visibleParentId(mapping, id) {
      let cur = id;
      let guard = 0;
      while (guard++ < 4096) {
        const parentId = mapping[cur]?.parent;
        if (parentId == null) return null;
        const parentRec = mapping[parentId];
        if (TreeBuilder.isVisibleRec(parentRec)) return parentId;
        cur = parentId;
      }
      return null;
    }
    static dedupBySig(ids, mapping) {
      const seen = new Set();
      const out = [];
      for (const cid of ids) {
        const rec = mapping[cid];
        if (!rec) continue;
        const role = rec?.message?.author?.role || "assistant";
        const text = TextUtils.normalize(TreeBuilder.getRecText(rec));
        const sig = Signature.create(role, text);
        if (!seen.has(sig)) {
          seen.add(sig);
          out.push(cid);
        }
      }
      return out;
    }
    static foldSameRoleChain(startId, mapping, childrenMap) {
      let cur = startId;
      let rec = mapping[cur];
      const role = rec?.message?.author?.role || "assistant";
      let text = TreeBuilder.getRecText(rec);
      let guard = 0;
      const chainIds = [];
      const chainSigs = [];
      while (rec && guard++ < 4096) {
        const curText = TreeBuilder.getRecText(rec);
        if (curText) {
          chainIds.push(cur);
          chainSigs.push(Signature.create(role, curText));
        }
        const kids = childrenMap.get(cur) || [];
        if (kids.length !== 1) break;
        const kidId = kids[0];
        const kidRec = mapping[kidId];
        const kidRole = kidRec?.message?.author?.role || "assistant";
        const kidText = TreeBuilder.getRecText(kidRec);
        if (kidRole === role && kidText && text) {
          text = `${text}\n${kidText}`.trim();
          cur = kidId;
          rec = kidRec;
          continue;
        }
        break;
      }
      return { id: cur, role, text, chainIds, chainSigs };
    }
    static fromMapping(mapping) {
      const visibleIds = Object.keys(mapping).filter((id) => TreeBuilder.isVisibleRec(mapping[id]));
      const parentMap = new Map();
      for (const vid of visibleIds) {
        parentMap.set(vid, TreeBuilder.visibleParentId(mapping, vid));
      }
      const childrenMap = new Map(visibleIds.map((id) => [id, []]));
      for (const vid of visibleIds) {
        const parentId = parentMap.get(vid);
        if (parentId && childrenMap.has(parentId)) {
          childrenMap.get(parentId).push(vid);
        }
      }
      for (const [pid, arr] of childrenMap.entries()) {
        childrenMap.set(pid, TreeBuilder.dedupBySig(arr, mapping));
      }
      const roots = visibleIds.filter((id) => parentMap.get(id) == null);
      const toNode = (id) => {
        const folded = TreeBuilder.foldSameRoleChain(id, mapping, childrenMap);
        const currentId = folded.id;
        const currentRole = folded.role;
        const currentText = folded.text;
        const sig = Signature.create(currentRole, currentText);
        const chainIds = folded.chainIds?.length ? folded.chainIds : [currentId];
        const chainSigs = folded.chainSigs?.length ? folded.chainSigs : [sig];
        const children = (childrenMap.get(currentId) || []).map(toNode).filter(Boolean);
        return { id: currentId, role: currentRole, text: currentText, sig, chainIds, chainSigs, children };
      };
      return roots.map(toNode).filter(Boolean);
    }
    static fromLinear(linear) {
      const nodes = [];
      for (let i = 0; i < linear.length; i++) {
        const current = linear[i];
        if (current.role === "user") {
          const next = linear[i + 1];
          const pair = { id: current.id, role: "user", text: current.text, sig: current.sig, children: [] };
          if (next && next.role === "assistant") {
            pair.children.push({ id: next.id, role: "assistant", text: next.text, sig: next.sig, children: [] });
          }
          nodes.push(pair);
        } else {
          nodes.push({ id: current.id, role: "assistant", text: current.text, sig: current.sig, children: [] });
        }
      }
      return nodes;
    }
  }

  class TreeRenderer {
    constructor(panel, branchState, navigator) {
      this.panel = panel;
      this.branchState = branchState;
      this.navigator = navigator;
    }
    render(treeData) {
      const targetEl = this.panel.treeContainer;
      if (!targetEl) return;
      targetEl.innerHTML = "";
      this.panel.updateTreeHeight(true);
      const stats = { total: 0 };
      const container = document.createDocumentFragment();
      const queue = [];
      const pushList = (nodes, parent) => { for (const node of nodes) queue.push({ node, parent }); };
      const createItem = (node) => {
        const item = document.createElement("div");
        item.className = "gtt-node";
        item.dataset.nodeId = node.id;
        item.dataset.sig = node.sig;
        item.title = `${node.id}\n\n${node.text || ""}`;
        if (node.chainIds) item._chainIds = node.chainIds;
        if (node.chainSigs) item._chainSigs = node.chainSigs;
        const head = document.createElement("div");
        head.className = "head";
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = node.role === "user" ? "U" : (node.role === "assistant" ? "A" : (node.role || "·"));
        const title = document.createElement("span");
        title.className = "title";
        title.textContent = node.role === "user" ? "用户" : "Asst";
        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = node.children?.length ? `×${node.children.length}` : "";
        const pv = document.createElement("span");
        pv.className = "pv";
        const pvLines = PreviewBuilder.lines(node.text);
        pvLines.forEach((line, idx) => {
          const lineEl = document.createElement("span");
          lineEl.className = "pv-line";
          if (idx === 2) lineEl.classList.add("pv-line-more");
          lineEl.textContent = line;
          pv.appendChild(lineEl);
        });
        head.append(badge, title);
        if (meta.textContent) head.append(meta);
        item.append(head, pv);
        item.addEventListener("click", () => this.navigator.jumpTo(node));
        return item;
      };
      const rootDiv = document.createElement("div");
      container.appendChild(rootDiv);
      pushList(treeData, rootDiv);
      const step = () => {
        let count = 0;
        while (count < CONFIG.RENDER_CHUNK && queue.length) {
          const { node, parent } = queue.shift();
          const item = createItem(node);
          parent.appendChild(item);
          stats.total++;
          if (node.children?.length) {
            const kids = document.createElement("div");
            kids.className = "gtt-children";
            parent.appendChild(kids);
            pushList(node.children, kids);
          }
          count++;
        }
        if (queue.length) {
          IdleScheduler.rafIdle(step);
        } else {
          targetEl.appendChild(container);
          this.panel.updateStats(stats.total);
          this.applyHighlight();
          this.panel.updateTreeHeight();
        }
      };
      step();
    }
    applyHighlight() {
      const targetEl = this.panel.treeContainer;
      if (!targetEl) return;
      this.branchState.applyHighlight(targetEl);
    }
  }

  class BackendGateway {
    constructor() {
      this.origFetch = window.fetch.bind(window);
      this.lastAuth = null;
      this.patched = false;
    }
    extractAuthHeaders(input, init) {
      try {
        if (input instanceof Request) {
          const headers = Object.fromEntries(input.headers.entries());
          return headers.authorization || headers.Authorization || null;
        }
        const headers = init?.headers;
        if (headers instanceof Headers) {
          return headers.get("authorization") || headers.get("Authorization");
        }
        if (headers && typeof headers === "object") {
          return headers.authorization || headers.Authorization || null;
        }
      } catch (_) {
        return null;
      }
      return null;
    }
    rememberAuth(authHeader) {
      if (!authHeader || this.lastAuth) return;
      this.lastAuth = { Authorization: authHeader };
    }
    async ensureAuth() {
      if (this.lastAuth?.Authorization) return this.lastAuth;
      try {
        const res = await this.origFetch("/api/auth/session", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.accessToken) {
            this.lastAuth = { Authorization: `Bearer ${data.accessToken}` };
            return this.lastAuth;
          }
        }
      } catch (_) {
        /* ignore */
      }
      return this.lastAuth || {};
    }
    withHeaders(extra = {}) {
      return { ...(this.lastAuth || {}), ...extra };
    }
    patchFetch(onMapping) {
      if (this.patched) return;
      this.patched = true;
      window.fetch = async (...args) => {
        const [input, init] = args;
        const authHeader = this.extractAuthHeaders(input, init);
        if (authHeader) this.rememberAuth(authHeader);
        const response = await this.origFetch(...args);
        try {
          const url = typeof input === "string" ? input : (input?.url || "");
          if (/\/backend-api\/conversation\//.test(url)) {
            const clone = response.clone();
            const json = await clone.json();
            if (json?.mapping) {
              onMapping(json.mapping);
            }
          }
        } catch (_) {
          /* ignore */
        }
        return response;
      };
    }
    async fetchMapping(conversationId) {
      if (!conversationId) return null;
      await this.ensureAuth();
      const { get: urls } = CONFIG.ENDPOINTS(conversationId);
      for (const url of urls) {
        try {
          const response = await this.origFetch(url, { credentials: "include", headers: this.withHeaders() });
          if (response.ok) {
            const json = await response.json();
            if (json?.mapping) return json.mapping;
          }
        } catch (_) {
          /* ignore */
        }
      }
      return null;
    }
  }

  class DOMWatcher {
    constructor(onChange) {
      this.observer = new MutationObserver(IdleScheduler.debounce(onChange, CONFIG.OBS_DEBOUNCE_MS));
    }
    start() {
      this.observer.observe(document.body, { childList: true, subtree: true });
    }
    stop() {
      this.observer.disconnect();
    }
  }

  class RouterWatcher {
    constructor(onChange) {
      this.onChange = onChange;
      this.bound = false;
    }
    start() {
      if (this.bound) return;
      this.bound = true;
      const origPush = history.pushState;
      const origReplace = history.replaceState;
      const fire = () => window.dispatchEvent(new Event("gtt:locationchange"));
      history.pushState = function (...args) {
        const result = origPush.apply(this, args);
        fire();
        return result;
      };
      history.replaceState = function (...args) {
        const result = origReplace.apply(this, args);
        fire();
        return result;
      };
      window.addEventListener("popstate", fire);
      window.addEventListener("gtt:locationchange", this.onChange);
      window.addEventListener("popstate", this.onChange);
    }
  }

  class KeyboardController {
    constructor(panel, navigator) {
      this.panel = panel;
      this.navigator = navigator;
    }
    bind() {
      document.addEventListener("keydown", (e) => {
        const searchInput = this.panel.searchInputEl;
        if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          this.panel.focusSearch();
        }
        if (e.key === "Escape") {
          if (this.panel.isModalOpen()) {
            this.navigator.closeModal();
          } else if (searchInput) {
            this.panel.clearSearch();
          }
        }
        if (!e.altKey) return;
        if (e.key === "t" || e.key === "T") {
          e.preventDefault();
          this.panel.toggleHidden();
        }
      });
    }
  }

  class LocationHelper {
    static getConversationId() {
      const match = location.pathname.match(/\/c\/([a-z0-9-]{10,})/i) || [];
      return match[1] || null;
    }
  }

  class GPTBranchTreeNavigatorApp {
    constructor() {
      this.prefs = new PreferenceStore(CONFIG.LS_KEY, { hidden: false, pos: null, width: null });
      this.branchState = new BranchState();
      this.panel = new PanelView(this.prefs);
      this.navigator = new Navigator(this.branchState, this.panel);
      this.renderer = new TreeRenderer(this.panel, this.branchState, this.navigator);
      this.gateway = new BackendGateway();
      this.domWatcher = new DOMWatcher(() => {
        this.branchState.collectFromDom();
        this.renderer.applyHighlight();
      });
      this.routerWatcher = new RouterWatcher(() => {
        this.rebuild({ forceFetch: true, hard: true });
      });
      this.keyboard = new KeyboardController(this.panel, this.navigator);
      this.panel.registerHandlers({ refresh: () => this.rebuild({ forceFetch: true }) });
    }
    async rebuild(opts = {}) {
      this.panel.ensureMounted();
      if (opts.hard) this.branchState.setMapping(null);
      const linearNodes = this.branchState.collectFromDom();
      if (opts.forceFetch || !this.branchState.mapping) {
        const mapping = await this.gateway.fetchMapping(LocationHelper.getConversationId());
        if (mapping) {
          this.applyMapping(mapping);
          return;
        }
      }
      if (this.branchState.mapping) {
        this.renderer.render(TreeBuilder.fromMapping(this.branchState.mapping));
      } else {
        this.renderer.render(TreeBuilder.fromLinear(linearNodes));
      }
    }
    applyMapping(mapping) {
      if (!mapping) return;
      this.branchState.setMapping(mapping);
      this.panel.ensureMounted();
      this.renderer.render(TreeBuilder.fromMapping(mapping));
    }
    boot() {
      this.panel.ensureMounted();
      this.domWatcher.start();
      this.routerWatcher.start();
      this.keyboard.bind();
      this.branchState.collectFromDom();
      this.rebuild();
    }
  }

  const app = new GPTBranchTreeNavigatorApp();
  const gateway = app.gateway;
  gateway.patchFetch((mapping) => app.applyMapping(mapping));
  const readyTimer = setInterval(() => {
    if (document.querySelector("main")) {
      clearInterval(readyTimer);
      app.boot();
    }
  }, 300);

})();

