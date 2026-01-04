// ==UserScript==
// @name         语雀美化
// @namespace    https://tampermonkey.net/
// @version      1.0.6
// @description  有序编号改为 1/1.1/1.1.1；无序符号统一；缩进紧凑；标题加粗；H3~H6字号与配色美化及自动编号（修复：阅读界面列表编号乱跳；标题空不显示编号；滚动不跳号；折叠展开不闪动）
// @match        https://www.yuque.com/*
// @match        https://yuque.com/*
// @match        https://*.yuque.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560269/%E8%AF%AD%E9%9B%80%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560269/%E8%AF%AD%E9%9B%80%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ===== 可调参数 =====
  const BULLET_CHAR = "●";
  const ORDERED_JOIN = ".";

  const LEVEL_STEP_EM = 1;
  const OLI_L0_EM = 1.5;
  const OLI_L1_EM = 2.0;
  const OLI_L2_EM = 2.0;
  const ULI_L0_EM = 1.0;

  const SYMBOL_FONT_WEIGHT = 700;

  const H_SIZES = { h3: 23, h4: 20, h5: 17, h6: 15 };
  const H_COLORS = {
    h3: "#1f77b4",
    h4: "#2ca02c",
    h5: "#de2323d8",
    h6: "#555555",
  };

  const OBSERVE_ROOT = document.body;
  const STYLE_ID = "tm-yuque-list-heading-tweaks";

  // ===== utils =====
  const toInt = (v, fallback = 0) => {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  };

  const cssEscape = (s) => {
    try {
      if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(s);
    } catch (_) {}
    return String(s).replace(/["\\]/g, "\\$&");
  };

  const readPureNumber = (s) => {
    const m = String(s || "").match(/\d+/);
    return m ? toInt(m[0], 0) : 0;
  };

  // ordered level：优先读 span.ne-list-symbol[data-level]；退化读 ne-oli[ne-level]
  const getOrderedLevel = (oliEl, symbolEl) => {
    const byDataset = symbolEl?.dataset?.level;
    if (byDataset != null) return toInt(byDataset, 0);
    const byAttr = oliEl.getAttribute("ne-level");
    return toInt(byAttr, 0);
  };

  // ===== root/key：阅读态分块渲染时必须稳定 =====
  const getStableListRoot = (el, preferOl = false) => {
    const ol = el.closest("ne-ol");
    const ul = el.closest("ne-ul");
    if (preferOl && ol) return ol;
    if (!preferOl && ul) return ul;
    if (ol) return ol;
    if (ul) return ul;

    const renderUnit =
      el.closest('[ne-role="render-unit"]') ||
      el.closest("[data-lake-id]") ||
      el.closest("[data-lake-node]");

    return renderUnit || el.parentElement || document.body;
  };

  // 用于缓存计数的 key（比 root 节点更重要：阅读态 root 可能换，但 key 应该尽量不换）
  const getListKey = (el, kind) => {
    const root = getStableListRoot(el, kind === "ol");
    const parts = [];
    parts.push(kind);

    const ids = [
      root?.getAttribute?.("data-lake-id"),
      root?.getAttribute?.("id"),
      root?.getAttribute?.("data-id"),
      root?.getAttribute?.("data-node-id"),
      root?.getAttribute?.("data-lake-node"),
    ].filter(Boolean);

    if (ids.length) {
      parts.push(ids[0]);
      return parts.join(":");
    }

    // 兜底：用 DOM 路径片段（尽量稳定）
    const tag = (root?.tagName || "ROOT").toLowerCase();
    const cls = (root?.className || "").toString().split(/\s+/).slice(0, 2).join(".");
    parts.push(`${tag}.${cls}`.replace(/\.+$/, ""));
    return parts.join(":");
  };

  const injectStyle = () => {
    if (document.getElementById(STYLE_ID)) return;

    const css = `
/* =========================
  列表：阅读/编辑通用
  ========================= */
ne-oli[index-type="0"] { padding-left: ${OLI_L0_EM}em !important; }
ne-oli[index-type="0"][ne-level="1"] { padding-left: ${OLI_L1_EM}em !important; }
ne-oli[index-type="0"][ne-level="2"] { padding-left: ${OLI_L2_EM}em !important; }

ne-uli[index-type="0"],
ne-tli[index-type="0"] { padding-left: ${ULI_L0_EM}em !important; }

ne-uli[index-type="0"][ne-level="1"],
ne-tli[index-type="0"][ne-level="1"] { padding-left: ${ULI_L0_EM + LEVEL_STEP_EM * 1}em !important; }

ne-uli[index-type="0"][ne-level="2"],
ne-tli[index-type="0"][ne-level="2"] { padding-left: ${ULI_L0_EM + LEVEL_STEP_EM * 2}em !important; }

ne-uli[index-type="0"][ne-level="3"],
ne-tli[index-type="0"][ne-level="3"] { padding-left: ${ULI_L0_EM + LEVEL_STEP_EM * 3}em !important; }

span.ne-list-symbol { font-weight: ${SYMBOL_FONT_WEIGHT} !important; }
span.ne-list-symbol > span { font-weight: ${SYMBOL_FONT_WEIGHT} !important; }
ne-oli-c, ne-uli-c { font-weight: 400 !important; }

/* =========================
  H3~H6 美化
  ========================= */
ne-h3 { margin-top: 0.9em !important; margin-bottom: 0.9em !important; }
ne-h4 { margin-top: 0.7em !important; margin-bottom: 0.7em !important; }
ne-h5 { margin-top: 0.5em !important; margin-bottom: 0.5em !important; }

ne-h3 ne-heading-content, ne-h3 ne-heading-content ne-text { font-size: ${H_SIZES.h3}px !important; font-weight: 700 !important; color: ${H_COLORS.h3} !important; }
ne-h4 ne-heading-content, ne-h4 ne-heading-content ne-text { font-size: ${H_SIZES.h4}px !important; font-weight: 700 !important; color: ${H_COLORS.h4} !important; }
ne-h5 ne-heading-content, ne-h5 ne-heading-content ne-text { font-size: ${H_SIZES.h5}px !important; font-weight: 700 !important; color: ${H_COLORS.h5} !important; }
ne-h6 ne-heading-content, ne-h6 ne-heading-content ne-text { font-size: ${H_SIZES.h6}px !important; font-weight: 700 !important; color: ${H_COLORS.h6} !important; }

ne-heading-anchor .ne-icon { opacity: 0.85 !important; }

ne-h3, ne-h4, ne-h5, ne-h6 { display: flex !important; align-items: center !important; }
ne-h3 > ne-heading-ext, ne-h4 > ne-heading-ext, ne-h5 > ne-heading-ext, ne-h6 > ne-heading-ext,
ne-h3 > ne-heading-content, ne-h4 > ne-heading-content, ne-h5 > ne-heading-content, ne-h6 > ne-heading-content { display: inline-flex !important; align-items: center !important; }

ne-h3 ne-heading-content ne-text { line-height: ${H_SIZES.h3}px !important; }
ne-h4 ne-heading-content ne-text { line-height: ${H_SIZES.h4}px !important; }
ne-h5 ne-heading-content ne-text { line-height: ${H_SIZES.h5}px !important; }
ne-h6 ne-heading-content ne-text { line-height: ${H_SIZES.h6}px !important; }

ne-h3.tm-heading-has-text ne-heading-content .ne-b-filler,
ne-h4.tm-heading-has-text ne-heading-content .ne-b-filler,
ne-h5.tm-heading-has-text ne-heading-content .ne-b-filler,
ne-h6.tm-heading-has-text ne-heading-content .ne-b-filler,
ne-h3.tm-heading-has-text ne-heading-content .ne-viewer-b-filler,
ne-h4.tm-heading-has-text ne-heading-content .ne-viewer-b-filler,
ne-h5.tm-heading-has-text ne-heading-content .ne-viewer-b-filler,
ne-h6.tm-heading-has-text ne-heading-content .ne-viewer-b-filler { display: none !important; }

/* =========================
  标题编号：写到 ne-heading-content[data-tm-prefix]，用 ::before 显示
  ========================= */
ne-heading-content > span.tm-heading-prefix { display: none !important; }

ne-heading-content[data-tm-prefix]::before {
  content: attr(data-tm-prefix);
  font-weight: 700 !important;
  display: inline-block;
  white-space: pre;
}
`.trim();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  };

  // =========================
  // 有序列表：阅读界面稳定编号（核心修复）
  // =========================
  // 缓存每个列表块的 counters，解决阅读态分块渲染导致的反复重置
  const orderedCountersCache = new Map(); // listKey -> number[]

  const updateOrderedInRoot = (rootEl, listKey) => {
    const items = Array.from(rootEl.querySelectorAll("ne-oli"));
    if (!items.length) return;

    // 取缓存 counters（克隆一份在本次更新里使用）
    const cached = orderedCountersCache.get(listKey) || [];
    const counters = cached.slice();

    const ensureLen = (len) => {
      while (counters.length < len) counters.push(0);
    };

    for (const item of items) {
      const symbol = item.querySelector("span.ne-list-symbol[data-type='0']");
      if (!symbol) continue;

      // 读取/保存语雀原始序号（作为锚点，阅读态分块渲染时非常关键）
      const innerSpan = symbol.querySelector("span");
      const currentDisplayed = innerSpan ? innerSpan.textContent : symbol.textContent;

      if (!symbol.dataset.tmOrig) {
        const orig = readPureNumber(currentDisplayed);
        if (orig > 0) symbol.dataset.tmOrig = String(orig);
      }

      const level = getOrderedLevel(item, symbol);
      ensureLen(level + 1);

      // 用原始序号做定位：如果能读到 orig，就直接把该层计数设置为 orig
      const origIdx = toInt(symbol.dataset.tmOrig, 0);

      if (origIdx > 0) {
        counters[level] = origIdx;
      } else {
        // 兜底：没法读到 orig 才用递增
        counters[level] += 1;
      }

      // 更深层全部清零（保证 1.2 后面出现 1.2.1，而不是继承旧值）
      for (let i = level + 1; i < counters.length; i++) counters[i] = 0;

      // 生成显示文本：只取到当前 level
      const numbering = counters
        .slice(0, level + 1)
        .map((n) => String(n || 0))
        .join(ORDERED_JOIN);

      const setText = (v) => {
        if (innerSpan) {
          if (innerSpan.textContent !== v) innerSpan.textContent = v;
        } else {
          if (symbol.textContent !== v) symbol.textContent = v;
        }
      };

      setText(numbering);
    }

    // 回写缓存：让下一次分块渲染接着走，不会重置
    orderedCountersCache.set(listKey, counters);
  };

  // ===== 无序：统一符号 =====
  const updateUnorderedInRoot = (rootEl) => {
    const items = Array.from(rootEl.querySelectorAll("ne-uli, ne-tli"));
    if (!items.length) return;

    for (const item of items) {
      const hasUliI = item.querySelector("ne-uli-i span.ne-list-symbol");
      if (!hasUliI) continue;

      const symbol = item.querySelector("ne-uli-i span.ne-list-symbol");
      if (!symbol) continue;

      const innerSpan = symbol.querySelector("span");
      if (innerSpan) {
        if (innerSpan.textContent !== BULLET_CHAR) innerSpan.textContent = BULLET_CHAR;
      } else {
        if (symbol.textContent !== BULLET_CHAR) symbol.textContent = BULLET_CHAR;
      }
    }
  };

  // =========================
  // 标题编号（稳定 + 不闪 + 空标题不显示）
  // =========================
  const HEADING_NUMBER_SPACE = " ";

  let isWritingHeading = false;
  const headingLevelCache = new Map();   // key -> 3/4/5
  const headingPrefixCache = new Map();  // key -> prefix string

  const toCnOrdinal = (n) => {
    const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (n <= 0) return "零";
    if (n < 10) return digits[n];
    if (n === 10) return "十";
    if (n < 20) return "十" + digits[n % 10];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return digits[tens] + "十" + (ones ? digits[ones] : "");
  };

  // 更严格：只认 ne-text 的真实文本，过滤零宽字符/空白
  const headingHasText = (hEl) => {
    const t = hEl.querySelector("ne-heading-content ne-text");
    const raw = (t?.textContent || "")
      .replace(/\u00A0/g, " ")
      .replace(/\u200B/g, "")
      .replace(/\uFEFF/g, "")
      .trim();
    return raw.length > 0;
  };

  const getHeadingKey = (hEl) => {
    const lakeId = hEl.getAttribute("data-lake-id");
    if (lakeId) return lakeId;
    const id = hEl.getAttribute("id");
    if (id) return id;
    const dataId = hEl.getAttribute("data-id");
    if (dataId) return dataId;
    const t = hEl.querySelector("ne-heading-content ne-text")?.textContent || "";
    return t.replace(/\u00A0/g, " ").trim();
  };

  const getHeadingContentEl = (hEl) => hEl.querySelector("ne-heading-content");

  const findHeadingByKey = (key) => {
    if (!key) return null;
    const byId = document.getElementById(key);
    if (byId && /ne-h[3-6]/i.test(byId.tagName || "")) return byId;

    const esc = cssEscape(key);
    const byLake = document.querySelector(
      `ne-h3[data-lake-id="${esc}"], ne-h4[data-lake-id="${esc}"], ne-h5[data-lake-id="${esc}"]`
    );
    if (byLake) return byLake;

    const byData = document.querySelector(
      `ne-h3[data-id="${esc}"], ne-h4[data-id="${esc}"], ne-h5[data-id="${esc}"]`
    );
    if (byData) return byData;

    return null;
  };

  const findBestOutlineContainer = () => {
    const candidates = Array.from(document.querySelectorAll(
      "aside, nav, .ne-outline, .lake-outline, [class*='outline'], [class*='toc'], [data-testid*='outline'], [data-testid*='toc']"
    ));
    let best = null;
    let bestCount = 0;
    for (const c of candidates) {
      const cnt = c.querySelectorAll("a[href*='#']").length;
      if (cnt > bestCount) {
        best = c;
        bestCount = cnt;
      }
    }
    return bestCount >= 3 ? best : null;
  };

  // 每次从目录顺序重新计算：H4 在每个 H3 下重置；H5 在每个 H4 下重置
  const buildNumberingFromOutline = () => {
    const container = findBestOutlineContainer();
    if (!container) return null;

    const links = Array.from(container.querySelectorAll("a[href*='#']"));
    if (!links.length) return null;

    let h3 = 0, h4 = 0, h5 = 0;
    const map = new Map();

    for (const a of links) {
      const href = a.getAttribute("href");
      if (!href || !href.includes("#")) continue;
      const key = href.split("#").pop();
      if (!key) continue;

      let level = null;
      const hEl = findHeadingByKey(key);

      if (hEl) {
        const tag = (hEl.tagName || "").toLowerCase();
        if (tag === "ne-h3") level = 3;
        else if (tag === "ne-h4") level = 4;
        else if (tag === "ne-h5") level = 5;
        if (level) headingLevelCache.set(key, level);
      } else {
        level = headingLevelCache.get(key) || null;
      }

      if (!level) continue;

      if (level === 3) {
        h3 += 1; h4 = 0; h5 = 0;
        map.set(key, `${toCnOrdinal(h3)}.${HEADING_NUMBER_SPACE}`);
      } else if (level === 4) {
        if (h3 === 0) h3 = 1;
        h4 += 1; h5 = 0;
        map.set(key, `${h3}.${h4}${HEADING_NUMBER_SPACE}`);
      } else if (level === 5) {
        if (h3 === 0) h3 = 1;
        if (h4 === 0) h4 = 1;
        h5 += 1;
        map.set(key, `${h3}.${h4}.${h5}${HEADING_NUMBER_SPACE}`);
      }
    }

    return map.size ? map : null;
  };

  const writeHeadingPrefix = (hEl, prefixText) => {
    const content = getHeadingContentEl(hEl);
    if (!content) return;

    if (!headingHasText(hEl)) {
      hEl.classList.remove("tm-heading-has-text");
      content.removeAttribute("data-tm-prefix");
      return;
    }

    hEl.classList.add("tm-heading-has-text");

    const key = getHeadingKey(hEl);
    if (key) headingPrefixCache.set(key, prefixText);

    if (content.getAttribute("data-tm-prefix") !== prefixText) {
      content.setAttribute("data-tm-prefix", prefixText);
    }
  };

  let headingScheduled = false;
  const scheduleHeadingUpdate = () => {
    if (headingScheduled) return;
    headingScheduled = true;
    requestAnimationFrame(() => {
      headingScheduled = false;
      updateHeadingNumbers();
    });
  };

  const updateHeadingNumbers = () => {
    const headings = Array.from(document.querySelectorAll("ne-h3, ne-h4, ne-h5"));
    if (!headings.length) return;

    const outlineMap = buildNumberingFromOutline();

    isWritingHeading = true;
    try {
      if (outlineMap) {
        for (const h of headings) {
          const key = getHeadingKey(h);
          const txt = outlineMap.get(key);
          if (!txt) {
            const c = getHeadingContentEl(h);
            if (c && !headingHasText(h)) c.removeAttribute("data-tm-prefix");
            continue;
          }
          writeHeadingPrefix(h, txt);
        }
        return;
      }

      // fallback：目录不可用时按 DOM 顺序重算（仍满足“按层级重置”）
      let h3 = 0, h4 = 0, h5 = 0;
      for (const h of headings) {
        const tag = (h.tagName || "").toLowerCase();
        if (tag === "ne-h3") {
          h3 += 1; h4 = 0; h5 = 0;
          writeHeadingPrefix(h, `${toCnOrdinal(h3)}.${HEADING_NUMBER_SPACE}`);
        } else if (tag === "ne-h4") {
          if (h3 === 0) h3 = 1;
          h4 += 1; h5 = 0;
          writeHeadingPrefix(h, `${h3}.${h4}${HEADING_NUMBER_SPACE}`);
        } else if (tag === "ne-h5") {
          if (h3 === 0) h3 = 1;
          if (h4 === 0) h4 = 1;
          h5 += 1;
          writeHeadingPrefix(h, `${h3}.${h4}.${h5}${HEADING_NUMBER_SPACE}`);
        }
      }
    } finally {
      requestAnimationFrame(() => { isWritingHeading = false; });
    }
  };

  // =========================
  // 总更新
  // =========================
  const updateAll = () => {
    injectStyle();

    // 有序列表：按 listKey 分组更新（阅读态分块渲染仍能延续计数）
    const orderedGroups = new Map(); // listKey -> rootEl(Set)
    document.querySelectorAll("ne-oli").forEach((oli) => {
      const key = getListKey(oli, "ol");
      const root = getStableListRoot(oli, true);
      if (!orderedGroups.has(key)) orderedGroups.set(key, new Set());
      orderedGroups.get(key).add(root);
    });
    for (const [key, roots] of orderedGroups.entries()) {
      for (const r of roots) updateOrderedInRoot(r, key);
    }

    // 无序列表：仍按稳定 root 分组即可
    const unorderedRoots = new Set();
    document.querySelectorAll("ne-uli, ne-tli").forEach((li) => {
      unorderedRoots.add(getStableListRoot(li, false));
    });
    unorderedRoots.forEach((root) => updateUnorderedInRoot(root));

    scheduleHeadingUpdate();
  };

  // ===== 动态渲染兼容 =====
  let scheduled = false;
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateAll();
    });
  };

  const observer = new MutationObserver((mutations) => {
    if (isWritingHeading) return;

    let hitHeading = false;
    let hitList = false;

    for (const m of mutations) {
      if (m.type === "childList") {
        for (const n of m.addedNodes) {
          if (!(n instanceof Element)) continue;

          // 新标题节点：缓存瞬时补（但空标题不补）
          if (n.matches?.("ne-h3, ne-h4, ne-h5")) {
            const key = getHeadingKey(n);
            const cached = key ? headingPrefixCache.get(key) : null;
            const c = getHeadingContentEl(n);
            if (c) {
              if (cached && headingHasText(n)) c.setAttribute("data-tm-prefix", cached);
              else c.removeAttribute("data-tm-prefix");
            }
          }

          if (
            n.matches?.("ne-h3, ne-h4, ne-h5, ne-h6, ne-heading-content, ne-heading-ext, ne-heading-fold, ne-heading-anchor") ||
            n.querySelector?.("ne-h3, ne-h4, ne-h5, ne-h6, ne-heading-content, ne-heading-ext, ne-heading-fold, ne-heading-anchor")
          ) hitHeading = true;

          if (
            n.matches?.("ne-oli, ne-uli, ne-tli, span.ne-list-symbol") ||
            n.querySelector?.("ne-oli, ne-uli, ne-tli, span.ne-list-symbol")
          ) hitList = true;

          if (hitHeading && hitList) break;
        }
      } else if (m.type === "characterData") {
        const p = m.target?.parentElement;
        if (p?.closest?.("ne-h3, ne-h4, ne-h5, ne-h6")) hitHeading = true;
        if (p?.closest?.("ne-oli, ne-uli, ne-tli")) hitList = true;
      }

      if (hitHeading && hitList) break;
    }

    if (hitList) scheduleUpdate();
    if (hitHeading) scheduleHeadingUpdate();
  });

  // 初次执行 + 兜底重试（阅读态首屏可能延迟渲染列表/目录）
  updateAll();
  let retry = 0;
  const retryTimer = setInterval(() => {
    retry += 1;
    updateAll();
    if (retry >= 12) clearInterval(retryTimer);
  }, 250);

  observer.observe(OBSERVE_ROOT, { childList: true, subtree: true, characterData: true });

  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("popstate", scheduleUpdate);
})();
