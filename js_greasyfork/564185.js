// ==UserScript==
// @name         SEO
// @namespace    tp-wen@tepeng.com
// @description  展示SEO信息
// @version      0.2
// @match        *://*.3d66.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564185/SEO.user.js
// @updateURL https://update.greasyfork.org/scripts/564185/SEO.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STORE_KEY = `__page_hud_clean__:${location.host}`;

  // 你只需要在这里维护你关注的字段（不用 UI 配置）
  const DEFAULT = {
    refreshMs: 1000,
    fields: [{
        label: "title",
        type: "headTagText",
        tagName: "title"
      },
      {
        label: "description",
        type: "meta",
        metaKey: "description"
      },
      {
        label: "keywords",
        type: "meta",
        metaKey: "keywords"
      },
      {
        label: "pubDate",
        type: "meta",
        metaKey: "pubDate"
      },
      {
        label: "upDate",
        type: "meta",
        metaKey: "upDate"
      },
      {
        label: "mobile-agent",
        type: "meta",
        metaKey: "mobile-agent"
      },
      {
        label: "canonical",
        type: "headLinkRelAttr",
        relKey: "canonical",
        attr: "href"
      },
      {
        label: 'link[rel="alternate"] attrs',
        type: "headLinkRelAttrs",
        relKey: "alternate"
      },
      {
        label: 'script[type="application/ld+json"]',
        type: "headScriptTypeTextList",
        scriptType: "application/ld+json"
      },
      {
        label: "H1 count",
        type: "js",
        expr: "(function(){ var hs = Array.prototype.slice.call(document.querySelectorAll('h1')); var texts = []; for (var i=0;i<hs.length;i++){ var t = (hs[i].textContent || '').trim(); if (t) texts.push(t); } return hs.length + '\\n' + texts.join('\\n'); })()",
      },
    ],
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return structuredClone(DEFAULT);
      const cfg = JSON.parse(raw);
      const ms = Number(cfg.refreshMs);
      return {
        refreshMs: Number.isFinite(ms) ? ms : DEFAULT.refreshMs,
        fields: Array.isArray(cfg.fields) ? cfg.fields : DEFAULT.fields,
      };
    }
    catch {
      return structuredClone(DEFAULT);
    }
  };

  const save = (cfg) => localStorage.setItem(STORE_KEY, JSON.stringify(cfg));

  const cfg = load();

  // ---- UI (Shadow DOM, 避免站点 CSS 影响) ----
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:2147483647;";
  const shadow = host.attachShadow({
    mode: "open"
  });

  const style = document.createElement("style");
  style.textContent = `
    *{box-sizing:border-box}
    .hud{
      width:420px;max-height:55vh;overflow:auto;border-radius:12px;
      background:rgba(20,20,20,.92);
      color:#fff;border:1px solid rgba(255,255,255,.14);
      font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
      box-shadow:0 12px 40px rgba(0,0,0,.35);
      scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.25) rgba(20,20,20,.92);
    }
    .hud::-webkit-scrollbar{
      width:10px;height:10px;
    }
    .hud::-webkit-scrollbar-track{
      background:transparent;
    }
    .hud::-webkit-scrollbar-thumb{
      background:rgba(255,255,255,.25);border-radius:8px;border:2px solid rgba(20,20,20,.92);
    }
    .hud::-webkit-scrollbar-thumb:hover{
      background:rgba(255,255,255,.35);
    }
    .hud::-webkit-scrollbar-corner{
      background:transparent;
    }
    .hdr{
      position:sticky;top:0;
      background:#141414; /* 不透明，避免底下文字透出 */
      z-index:1;
      padding:10px;border-bottom:1px solid rgba(255,255,255,.12);
      display:flex;gap:8px;align-items:center;justify-content:space-between;
      border-top-left-radius:12px;border-top-right-radius:12px;
    }
    .title{font-weight:700}
    .btns{display:flex;gap:6px;justify-content:flex-end}
    button{
      cursor:pointer;border-radius:10px;padding:5px 10px;
      border:1px solid rgba(255,255,255,.2);
      background:rgba(255,255,255,.10);color:#fff;
    }
    button:hover{background:rgba(255,255,255,.16)}
    .body{padding:10px}
    .row{padding:10px 0;border-bottom:1px solid rgba(255,255,255,.10)}
    .row:last-child{border-bottom:none}
    .topline{display:flex;gap:8px;align-items:center;justify-content:space-between}
    .lblwrap{display:flex;gap:8px;align-items:baseline;min-width:0}
    .lbl{
      font-weight:700;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    }
    .expr{
      opacity:.55;
      max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    }
    .val{margin-top:6px;opacity:.9;word-break:break-all;white-space:pre-wrap}
    .toggle{
      margin-top:6px;display:flex;justify-content:flex-end;
    }
    .toggle button{
      padding:3px 8px;border-radius:8px;font-size:11px;
    }
    .persistSel{
      background:rgba(255,229,100,.35);border-radius:3px;padding:0 1px;
    }
    .mini{
      display:flex;align-items:center;gap:8px;
      background:#141414;color:#fff;border:1px solid rgba(255,255,255,.14);
      border-radius:999px;padding:8px 10px;
      box-shadow:0 12px 40px rgba(0,0,0,.35);
    }
    .mini .pill{font-weight:700}
    .hint{opacity:.65}
  `;
  shadow.appendChild(style);

  const root = document.createElement("div");
  shadow.appendChild(root);

  let expanded = true;
  const expandedRows = new Set();
  let wheelBound = false;
  let refreshPaused = false;
  // let persistedSel = null; // Removed complex persistence

  const esc = (s) =>
    (s ?? "").toString().replace(/[&<>"]/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    } [c]));

  const getValue = (f) => {
    try {
      if (f.type === "cssText") {
        const el = document.querySelector(f.selector || "");
        return el ? el.textContent.trim() : "";
      }
      if (f.type === "cssAttr") {
        const el = document.querySelector(f.selector || "");
        if (!el) return "";
        const a = (f.attr || "").trim();
        return a ? (el.getAttribute(a) ?? "") : "";
      }
      if (f.type === "meta") {
        const key = (f.metaKey || "").trim();
        if (!key) return "";
        const el =
          document.querySelector(`meta[name="${CSS.escape(key)}"]`) ||
          document.querySelector(`meta[property="${CSS.escape(key)}"]`);
        return el ? (el.getAttribute("content") ?? "") : "";
      }
      if (f.type === "headTagText") {
        const tagName = (f.tagName || "").trim();
        if (!tagName) return "";
        const target = tagName.toLowerCase();
        const el = Array.from(document.head?.children || []).find(
          (node) => node.tagName?.toLowerCase() === target
        );
        return el ? el.textContent?.trim() || "" : "";
      }
      if (f.type === "headLinkRelAttr") {
        const relKey = (f.relKey || "").trim();
        if (!relKey) return "";
        const relNeedle = relKey.toLowerCase();
        const el = Array.from(document.head?.querySelectorAll("link[rel]") || []).find((node) => {
          const rel = node.getAttribute("rel") || "";
          return rel
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
            .includes(relNeedle);
        });
        if (!el) return "";
        const a = (f.attr || "").trim();
        return a ? (el.getAttribute(a) ?? "") : "";
      }
      if (f.type === "headLinkRelAttrs") {
        const relKey = (f.relKey || "").trim();
        if (!relKey) return "";
        const relNeedle = relKey.toLowerCase();
        return JSON.stringify(
          Array.from(document.head?.querySelectorAll("link[rel]") || [])
          .filter((node) => {
            const rel = node.getAttribute("rel") || "";
            return rel
              .toLowerCase()
              .split(/\s+/)
              .filter(Boolean)
              .includes(relNeedle);
          })
          .map((el) => Object.fromEntries(Array.from(el.attributes).map((a) => [a.name, a.value]))),
          null,
          2
        );
      }
      if (f.type === "headScriptTypeTextList") {
        const scriptType = (f.scriptType || "").trim();
        if (!scriptType) return "";
        const typeNeedle = scriptType.toLowerCase();
        const items = Array.from(document.head?.querySelectorAll("script[type]") || [])
          .filter((el) => (el.getAttribute("type") || "").toLowerCase() === typeNeedle)
          .map((el) => el.textContent?.trim())
          .filter(Boolean)
          .map((txt) => {
            try {
              return JSON.parse(txt);
            }
            catch {
              return txt;
            }
          });
        return JSON.stringify(
          items,
          null,
          2
        );
      }
      if (f.type === "js") {
        const expr = (f.expr || "").trim();
        if (!expr) return "";
        // 仅执行你自己写的表达式，建议只在你信任的站点/环境用
        // eslint-disable-next-line no-new-func
        const fn = new Function("document", "window", "return (" + expr + ");");
        const out = fn(document, window);
        return typeof out === "string" ? out : JSON.stringify(out);
      }
      return "";
    }
    catch (e) {
      return `ERR: ${e?.message || e}`;
    }
  };

  const NOFOLLOW_STYLE_ID = "__hud_nofollow_style__";
  const NOFOLLOW_MARK_CLASS = "__hud-nofollow";
  const NOFOLLOW_BADGE_CLASS = "__hud-nofollow-badge";

  const ensureNofollowStyle = () => {
    if (document.getElementById(NOFOLLOW_STYLE_ID)) return;
    const styleEl = document.createElement("style");
    styleEl.id = NOFOLLOW_STYLE_ID;
    styleEl.textContent = `
      a.${NOFOLLOW_MARK_CLASS} .${NOFOLLOW_BADGE_CLASS}{
        position:absolute !important;top:-6px !important;right:-6px !important;z-index:99999 !important;
        pointer-events:none !important;
        display:inline-flex !important;align-items:center !important;
        padding:2px 5px !important;
        font-size:9px !important;line-height:1 !important;border-radius:6px !important;
        border:1px solid rgba(255,255,255,.35) !important;
        color:rgba(255,255,255,.95) !important;
        background:rgba(200,50,50,.85) !important;
        white-space:nowrap !important;
        transform:scale(0.9) !important;
      }
    `;
    document.head.appendChild(styleEl);
  };

  const applyNofollowBadges = () => {
    ensureNofollowStyle();
    document.querySelectorAll("a[rel]").forEach((a) => {
      const rel = (a.getAttribute("rel") || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const hasNofollow = rel.includes("nofollow");
      const badge = a.querySelector(`.${NOFOLLOW_BADGE_CLASS}`);
      if (!hasNofollow) {
        a.classList.remove(NOFOLLOW_MARK_CLASS);
        badge?.remove();
        // 如果我们之前设置了 relative，这里是否要还原？
        // 为了安全起见，暂时不还原，因为很难知道原来的状态。
        // 但大部分情况下，保持 relative 也是无害的。
        return;
      }

      a.classList.add(NOFOLLOW_MARK_CLASS);

      // 确保父元素有定位上下文
      const computed = getComputedStyle(a);
      if (computed.position === "static") {
        a.style.position = "relative";
      }

      if (!badge) {
        const nextBadge = document.createElement("span");
        nextBadge.className = NOFOLLOW_BADGE_CLASS;
        nextBadge.textContent = "✖";
        // 兜底样式
        nextBadge.style.cssText =
          "position:absolute;top:-6px;right:-6px;z-index:99999;pointer-events:none;display:inline-flex;align-items:center;padding:2px 5px;font-size:9px;line-height:1;border-radius:6px;border:1px solid rgba(255,255,255,.35);color:rgba(255,255,255,.95);background:rgba(200,50,50,.85);white-space:nowrap;transform:scale(0.9);";
        a.appendChild(nextBadge);
      }
    });
  };

  const toggle = () => {
    expanded = !expanded;
    render();
  };

  const bindWheel = () => {
    if (wheelBound) return;
    host.addEventListener(
      "wheel",
      (e) => {
        if (!expanded) return;
        const hudEl = root.querySelector(".hud");
        if (!hudEl) return;
        // 简单判断鼠标是否在 HUD 区域内
        const rect = hudEl.getBoundingClientRect();
        const inHud =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (inHud) {
          hudEl.scrollTop += e.deltaY;
          e.preventDefault();
        }
      }, {
        passive: false
      }
    );
    wheelBound = true;
  };

  const hasActiveSelectionInHud = () => {
    // 1. 优先尝试 Shadow DOM 标准 API (Chrome/Edge/Safari newer)
    if (shadow.getSelection) {
      const s = shadow.getSelection();
      if (s && s.rangeCount > 0 && !s.isCollapsed) return true;
    }

    // 2. 降级到 document API
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed) return false;

    // Chrome Shadow DOM selection quirk: anchorNode might be the host element
    if (sel.anchorNode === host || sel.focusNode === host) return true;

    const a = sel.anchorNode;
    const f = sel.focusNode;
    // 检查节点是否在 root 内部（处理文本节点的情况）
    return (a && root.contains(a)) || (f && root.contains(f));
  };

  const render = () => {
    // 双重保险：只要检测到 HUD 内有选区，就绝对禁止自动刷新
    if (hasActiveSelectionInHud() && !window.__HUD_MANUAL_REFRESH__) {
      refreshPaused = true;
      return;
    }

    // 如果处于选择暂停状态，且非手动刷新，则跳过 DOM 更新
    if (refreshPaused && !window.__HUD_MANUAL_REFRESH__) return;

    if (!expanded) {
      root.innerHTML = `
        <div class="mini">
          <div class="pill">SEO</div>
          <button id="__show">Show</button>
        </div>
      `;
      root.querySelector("#__show")?.addEventListener("click", () => toggle());
      applyNofollowBadges();
      return;
    }

    const prevScrollTop = root.querySelector(".hud")?.scrollTop ?? 0;
    const rows = cfg.fields
      .map((f) => {
        const rawVal = getValue(f) ?? "";
        // 任意超过200字符的都支持折叠
        const isLongText = rawVal.length > 200;
        const rowKey = `${f.type}::${f.label || ""}`;
        // const hasPersist = persistedSel && persistedSel.rowKey === rowKey;
        const isExpanded = !isLongText || expandedRows.has(rowKey);
        const shownVal = isLongText && !isExpanded ? `${rawVal.slice(0, 200)}…(已省略)` : rawVal;
        const valHTML = esc(shownVal);
        /*
        let valHTML;
        if (hasPersist && isExpanded) {
          const s = Math.max(0, Math.min(persistedSel.start, rawVal.length));
          const e = Math.max(s, Math.min(persistedSel.end, rawVal.length));
          const before = esc(rawVal.slice(0, s));
          const mid = esc(rawVal.slice(s, e));
          const after = esc(rawVal.slice(e));
          valHTML = `${before}<span class="persistSel">${mid}</span>${after}`;
        } else {
          valHTML = esc(shownVal);
        }
        */
        const expr = f.type === "js" ? (f.expr || "") : "";
        return `
          <div class="row" data-row-key="${esc(rowKey)}">
            <div class="topline">
              <div class="lblwrap" title="${esc(f.label || "")}">
                <div class="lbl">${esc(f.label || "Field")}</div>
                ${expr ? `<div class="expr" title="${esc(expr)}">${esc(expr)}</div>` : ""}
              </div>
            </div>
            <div class="val">${valHTML || '<span style="opacity:.55">—</span>'}</div>
            ${
              isLongText
                ? `<div class="toggle"><button data-toggle="${esc(rowKey)}">${
                    isExpanded ? "收起" : "展开"
                  }</button></div>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    root.innerHTML = `
      <div class="hud">
        <div class="hdr">
          <div>
            <span class="title">查看SEO数据</span>
            <span style="opacity:.65;margin-left:8px">${esc(location.host)}</span>
          </div>
          <div class="btns">
            <button id="__refresh">Refresh</button>
            <button id="__hide">Hide</button>
          </div>
        </div>

        <div class="body">
          ${rows || `<div style="opacity:.75">No fields. Edit DEFAULT.fields in the script.</div>`}
        </div>
      </div>
    `;

    const hudEl = root.querySelector(".hud");
    if (hudEl) hudEl.scrollTop = prevScrollTop;
    root.querySelector("#__hide")?.addEventListener("click", () => toggle());
    root.querySelector("#__refresh")?.addEventListener("click", () => {
      // Manual refresh forces update even if paused
      window.__HUD_MANUAL_REFRESH__ = true;
      render();
      window.__HUD_MANUAL_REFRESH__ = false;
    });
    root.querySelectorAll("[data-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-toggle") || "";
        if (!key) return;
        if (expandedRows.has(key)) expandedRows.delete(key);
        else expandedRows.add(key);
        render();
      });
    });
    applyNofollowBadges();
  };

  // hotkey: Ctrl+Shift+H show/hide (minimize/expand)
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "H" || e.key === "h")) toggle();
  });

  document.documentElement.appendChild(host);
  bindWheel();
  root.addEventListener("mousedown", () => {
    refreshPaused = true;
  });
  document.addEventListener("selectionchange", () => {
    refreshPaused = hasActiveSelectionInHud();
  });
  document.addEventListener("mouseup", () => {
    // 延时检测，确保选区状态稳定
    setTimeout(() => {
      refreshPaused = hasActiveSelectionInHud();
      if (!refreshPaused) render();
    }, 10);
  });
  /*
  root.addEventListener("click", (e) => {
    if (!persistedSel) return;
    const hit = e.target && e.target.closest && e.target.closest(".persistSel");
    if (!hit) {
      persistedSel = null;
      refreshPaused = hasActiveSelectionInHud();
      render();
    }
  });
  */
  render();

  // refresh loop
  let timer = null;
  const startTimer = () => {
    if (timer) clearInterval(timer);
    if (Number(cfg.refreshMs) > 0) {
      timer = setInterval(() => {
        if (!refreshPaused) render();
      }, Number(cfg.refreshMs));
    }
    else {
      timer = null;
    }
  };
  startTimer();

  // 如果你想动态改 refreshMs/fields，也可以在控制台改 cfg 然后 save(cfg)
  // 暴露到 window 方便调试（可删）
  window.__HUD_CFG__ = cfg;
  window.__HUD_SAVE__ = () => {
    save(cfg);
    startTimer();
    render();
  };
})();
