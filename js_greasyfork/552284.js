// ==UserScript==
// @name         Discourse 新标签页
// @name:en      Discourse New Tab
// @namespace    https://github.com/selaky/discourse-new-tab
// @version      1.2.1
// @description  专注优化 Discourse 论坛多种情况下点击链接的体验，可在新标签页打开主题帖等页面，支持大量可自定义细节，自动识别 Discourse 站点
// @description:en Optimize link-click experience on Discourse: open topics and related pages in new tabs, highly customizable, auto-detects Discourse
// @author       selaky
// @homepageURL  https://github.com/selaky/discourse-new-tab
// @supportURL   https://github.com/selaky/discourse-new-tab/issues
// @match        http*://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM.openInTab
// @grant        GM_openInTab
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552284/Discourse%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/552284/Discourse%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/storage/gm.ts
  function isPromise(v) {
    return v && typeof v.then === "function";
  }
  async function gmGet(key, def) {
    try {
      const gmg = globalThis.GM_getValue;
      if (typeof gmg === "function") {
        const r = gmg(key, def);
        return isPromise(r) ? await r : r;
      }
      const GM = globalThis.GM;
      if (GM?.getValue) {
        return await GM.getValue(key, def);
      }
    } catch (err) {
      console.warn(LABEL, "GM_getValue \u8C03\u7528\u5931\u8D25\uFF0C\u5C1D\u8BD5\u4F7F\u7528 localStorage", err);
    }
    try {
      const raw = localStorage.getItem(`dnt:${key}`);
      return raw == null ? def : JSON.parse(raw);
    } catch (err) {
      console.warn(LABEL, "localStorage \u8BFB\u53D6\u5931\u8D25", err);
      return def;
    }
  }
  async function gmSet(key, value) {
    try {
      const gms = globalThis.GM_setValue;
      if (typeof gms === "function") {
        const r = gms(key, value);
        if (isPromise(r)) await r;
        return;
      }
      const GM = globalThis.GM;
      if (GM?.setValue) {
        await GM.setValue(key, value);
        return;
      }
    } catch (err) {
      console.warn(LABEL, "GM_setValue \u8C03\u7528\u5931\u8D25\uFF0C\u5C1D\u8BD5\u4F7F\u7528 localStorage", err);
    }
    try {
      localStorage.setItem(`dnt:${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn(LABEL, "localStorage \u5199\u5165\u5931\u8D25", err);
    }
  }
  function gmRegisterMenu(label, cb) {
    try {
      const reg = globalThis.GM_registerMenuCommand;
      if (typeof reg === "function") {
        reg(label, cb);
        return;
      }
    } catch (err) {
      console.warn(LABEL, "GM_registerMenuCommand \u8C03\u7528\u5931\u8D25\uFF0C\u5FFD\u7565", err);
    }
  }
  function gmOnValueChange(key, handler) {
    try {
      const addLegacy = globalThis.GM_addValueChangeListener;
      if (typeof addLegacy === "function") {
        const id = addLegacy(key, (_k, oldV, newV, remote) => handler(oldV, newV, remote));
        return () => {
          try {
            const rm = globalThis.GM_removeValueChangeListener;
            if (typeof rm === "function") rm(id);
          } catch (err) {
            console.warn(LABEL, "GM_removeValueChangeListener \u5931\u8D25", err);
          }
        };
      }
      const GM = globalThis.GM;
      if (GM?.addValueChangeListener) {
        const id = GM.addValueChangeListener(key, (_k, oldV, newV, remote) => handler(oldV, newV, remote));
        return () => {
          try {
            GM.removeValueChangeListener?.(id);
          } catch (err) {
            console.warn(LABEL, "GM.removeValueChangeListener \u5931\u8D25", err);
          }
        };
      }
    } catch (err) {
      console.warn(LABEL, "GM_valueChangeListener \u4E0D\u53EF\u7528\uFF0C\u964D\u7EA7\u4E3A storage \u4E8B\u4EF6", err);
    }
    try {
      const storageKey = `dnt:${key}`;
      const listener = (e) => {
        if (e.key !== storageKey) return;
        let ov = void 0;
        let nv = void 0;
        try {
          ov = e.oldValue != null ? JSON.parse(e.oldValue) : void 0;
        } catch {
        }
        try {
          nv = e.newValue != null ? JSON.parse(e.newValue) : void 0;
        } catch {
        }
        handler(ov, nv, true);
      };
      window.addEventListener("storage", listener);
      return () => window.removeEventListener("storage", listener);
    } catch (err) {
      console.warn(LABEL, "storage \u4E8B\u4EF6\u76D1\u542C\u5931\u8D25", err);
      return () => {
      };
    }
  }
  var LABEL;
  var init_gm = __esm({
    "src/storage/gm.ts"() {
      LABEL = "[discourse-new-tab]";
    }
  });

  // src/debug/settings.ts
  async function getDebugEnabled() {
    const v = await gmGet(KEY_DEBUG_ENABLED, false);
    return !!v;
  }
  async function setDebugEnabled(enabled) {
    await gmSet(KEY_DEBUG_ENABLED, !!enabled);
  }
  async function getDebugCategories() {
    const saved = await gmGet(KEY_DEBUG_CATEGORIES, {}) || {};
    return { ...DEFAULT_DEBUG_CATEGORIES, ...saved };
  }
  async function setDebugCategory(cat, enabled) {
    const cats = await getDebugCategories();
    cats[cat] = !!enabled;
    await gmSet(KEY_DEBUG_CATEGORIES, cats);
  }
  async function setAllDebugCategories(enabled) {
    const all = {
      site: enabled,
      click: enabled,
      link: enabled,
      rules: enabled,
      final: enabled,
      bg: enabled
    };
    await gmSet(KEY_DEBUG_CATEGORIES, all);
  }
  var DEBUG_LABEL, KEY_DEBUG_ENABLED, KEY_DEBUG_CATEGORIES, DEFAULT_DEBUG_CATEGORIES;
  var init_settings = __esm({
    "src/debug/settings.ts"() {
      init_gm();
      DEBUG_LABEL = "[discourse-new-tab]";
      KEY_DEBUG_ENABLED = "debug:enabled";
      KEY_DEBUG_CATEGORIES = "debug:categories";
      DEFAULT_DEBUG_CATEGORIES = {
        site: true,
        click: true,
        link: true,
        rules: true,
        final: true,
        bg: true
      };
    }
  });

  // src/utils/url.ts
  function toAbsoluteUrl(href, base) {
    try {
      if (!href || typeof href !== "string") return null;
      return new URL(href, base);
    } catch (err) {
      void logError("link", "URL \u7EDD\u5BF9\u5316\u5931\u8D25", err);
      return null;
    }
  }
  function extractTopicId(pathname) {
    try {
      const p = (pathname || "").toLowerCase();
      const patterns = [
        /\/t\/[\w%\-\.]+\/(\d+)(?:\/|$)/i,
        // 带 slug
        /\/t\/(\d+)(?:\/|$)/i
        // 仅 id
      ];
      for (const re of patterns) {
        const m = p.match(re);
        if (m && m[1]) {
          const id = parseInt(m[1], 10);
          if (!Number.isNaN(id)) return id;
        }
      }
    } catch (err) {
      void logError("link", "\u89E3\u6790\u4E3B\u9898\u5E16 ID \u5931\u8D25", err);
    }
    return void 0;
  }
  function extractUsername(pathname) {
    try {
      const p = (pathname || "").toLowerCase();
      const m = p.match(/\/u\/([\w%\-\.]+)/i);
      if (m && m[1]) return decodeURIComponent(m[1]);
    } catch (err) {
      void logError("link", "\u89E3\u6790\u7528\u6237\u540D\u5931\u8D25", err);
    }
    return void 0;
  }
  function isLikelyAttachment(pathname) {
    const p = (pathname || "").toLowerCase();
    if (p.includes("/uploads/")) return true;
    if (/\.(png|jpe?g|gif|webp|svg|zip|rar|7z|pdf|mp4|mp3)$/i.test(p)) return true;
    return false;
  }
  var init_url = __esm({
    "src/utils/url.ts"() {
      init_logger();
    }
  });

  // src/debug/logger.ts
  async function shouldLog(category) {
    const enabled = await getDebugEnabled();
    if (!enabled) return false;
    const cats = await getDebugCategories();
    return !!cats[category];
  }
  async function logSiteDetection(result) {
    if (!await shouldLog("site")) return;
    const head = `${DEBUG_LABEL} \u8BC6\u522B\u4E3A Discourse \u7AD9\u70B9\uFF08\u5F97\u5206\uFF1A${result.score}/${result.threshold}\uFF09`;
    const signals = result.matchedSignals.map((s) => `${s.name}(+${s.weight})`).join(" | ");
    console.log(head + "\u3002");
    if (signals) console.log(signals);
  }
  async function logClickFilter(reason) {
    if (!await shouldLog("click")) return;
    console.log(`${DEBUG_LABEL} \u70B9\u51FB\u4E8B\u4EF6\u5FFD\u7565\uFF1A${reason}`);
  }
  async function logClickNote(note) {
    if (!await shouldLog("click")) return;
    console.log(`${DEBUG_LABEL} \u70B9\u51FB\uFF1A${note}`);
  }
  async function logLinkInfo(ctx) {
    if (!await shouldLog("link")) return;
    const current = ctx.currentUrl?.href;
    const target = ctx.targetUrl?.href;
    const currentTopicId = extractTopicId(ctx.currentUrl.pathname);
    const targetTopicId = extractTopicId(ctx.targetUrl.pathname);
    const currentUser = extractUsername(ctx.currentUrl.pathname);
    const targetUser = extractUsername(ctx.targetUrl.pathname);
    const parts = [];
    if (currentTopicId != null) parts.push(`currentTopicId=${currentTopicId}`);
    if (targetTopicId != null) parts.push(`targetTopicId=${targetTopicId}`);
    if (currentUser) parts.push(`currentUser=${currentUser}`);
    if (targetUser) parts.push(`targetUser=${targetUser}`);
    const extra = parts.length ? `\uFF08${parts.join("\uFF0C")}\uFF09` : "";
    console.log(`${DEBUG_LABEL} \u94FE\u63A5\uFF1A\u5F53\u524D ${current} \u2192 \u76EE\u6807 ${target}${extra}`);
  }
  async function logRuleDetail(rule, enabled, matched, action, meta) {
    if (!await shouldLog("rules")) return;
    const cats = await getDebugCategories();
    void cats;
    const enabledText = enabled ? "\u5F00" : "\u5173";
    const hit = matched ? "\u547D\u4E2D" : "\u672A\u547D\u4E2D";
    const act = action ? action === "new_tab" ? "\u65B0\u6807\u7B7E\u9875" : action === "same_tab" ? "\u540C\u9875" : "\u4FDD\u7559\u539F\u751F" : "\u2014";
    console.log(`${DEBUG_LABEL} \u89C4\u5219\uFF1A${rule.name}\uFF08${enabledText}\uFF09 \u2192 ${hit}${action ? `\uFF0C\u52A8\u4F5C\uFF1A${act}` : ""}`);
    if (matched && meta && (meta.note || meta.data)) {
      const note = meta.note ? `\u8BF4\u660E\uFF1A${meta.note}` : "";
      const data = meta.data ? `\u6570\u636E\uFF1A${safeInline(meta.data)}` : "";
      const line = [note, data].filter(Boolean).join("\uFF1B");
      if (line) console.log(`${DEBUG_LABEL} ${line}`);
    }
  }
  async function logFinalDecision(ruleId, action) {
    if (!await shouldLog("final")) return;
    const act = action === "new_tab" ? "\u65B0\u6807\u7B7E\u9875" : action === "same_tab" ? "\u540C\u9875" : "\u4FDD\u7559\u539F\u751F";
    console.log(`${DEBUG_LABEL} \u6700\u7EC8\u89C4\u5219\u4E0E\u52A8\u4F5C\uFF1A${ruleId} \u2192 ${act}`);
  }
  async function logBackgroundOpenApplied(mode) {
    if (!await shouldLog("final")) return;
    const m = mode === "all" ? "\u5168\u90E8" : "\u4EC5\u4E3B\u9898\u5E16";
    console.log(`${DEBUG_LABEL} \u540E\u53F0\u6253\u5F00\uFF1A${m}`);
  }
  function safeInline(obj) {
    const parts = [];
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v == null) continue;
      parts.push(`${k}=${String(v)}`);
    }
    return parts.join(", ");
  }
  async function logError(category, message, err) {
    if (!await shouldLog(category)) return;
    console.error(`${DEBUG_LABEL} \u9519\u8BEF\uFF1A${message}`, err);
  }
  async function logBgBallVisibility(visible) {
    if (!await shouldLog("bg")) return;
    console.log(`${DEBUG_LABEL} \u60AC\u6D6E\u7403\uFF1A${visible ? "\u663E\u793A" : "\u9690\u85CF"}`);
  }
  async function logBgModeChange(mode, source) {
    if (!await shouldLog("bg")) return;
    const m = mode === "all" ? "\u5168\u90E8" : mode === "topic" ? "\u4EC5\u4E3B\u9898\u5E16" : "\u65E0";
    const s = source === "ball" ? "\u60AC\u6D6E\u7403" : "\u8BBE\u7F6E";
    console.log(`${DEBUG_LABEL} \u540E\u53F0\u6253\u5F00\u5207\u6362\uFF08${s}\uFF09\uFF1A${m}`);
  }
  var init_logger = __esm({
    "src/debug/logger.ts"() {
      init_settings();
      init_url();
    }
  });

  // src/detectors/siteDetector.ts
  function detectDiscourse(doc = document, win = window) {
    const url = win.location?.href || "";
    const signals = [
      // 强信号：meta generator 包含 Discourse（官方默认输出）
      metaGeneratorSignal(doc),
      // 强信号：窗口上暴露 Discourse 对象（不少站点保留）
      windowDiscourseSignal(win),
      // 中等信号：常见的 Discourse 专用 meta
      metaDiscourseSpecificSignal(doc),
      // 中等信号：常见的 DOM 结构（保守选择）
      domStructureSignal(doc),
      // 弱信号：URL 路径包含 Discourse 常见路由段
      urlPathPatternSignal(url)
    ];
    const matchedSignals = signals.filter((s) => s.matched).map(({ name, weight, note }) => ({ name, weight, note }));
    const score = matchedSignals.reduce((sum, s) => sum + s.weight, 0);
    const isDiscourse = score >= THRESHOLD;
    return { isDiscourse, score, threshold: THRESHOLD, matchedSignals };
  }
  function metaGeneratorSignal(doc) {
    try {
      const meta = doc.querySelector('meta[name="generator"]');
      const content = meta?.content?.toLowerCase?.() || "";
      const matched = content.includes("discourse");
      return { name: "meta:generator=Discourse", weight: 3, matched, note: content || void 0 };
    } catch (err) {
      void logError("site", '\u8BFB\u53D6 meta[name="generator"] \u5931\u8D25', err);
      return { name: "meta:generator=Discourse", weight: 3, matched: false };
    }
  }
  function windowDiscourseSignal(win) {
    try {
      const matched = typeof win.Discourse !== "undefined";
      return { name: "window.Discourse \u5B58\u5728", weight: 3, matched };
    } catch (err) {
      void logError("site", "\u63A2\u6D4B window.Discourse \u5931\u8D25", err);
      return { name: "window.Discourse \u5B58\u5728", weight: 3, matched: false };
    }
  }
  function metaDiscourseSpecificSignal(doc) {
    try {
      const metas = Array.from(doc.querySelectorAll("meta[name]"));
      const names = metas.map((m) => m.getAttribute("name") || "");
      const hasDiscourseMeta = names.some((n) => n.startsWith("discourse_")) || !!doc.querySelector('meta[name="application-name"][content*="Discourse" i]');
      return { name: "meta:discourse_* \u6216 application-name=Discourse", weight: 2, matched: !!hasDiscourseMeta };
    } catch (err) {
      void logError("site", "\u8BFB\u53D6 Discourse \u76F8\u5173 meta \u5931\u8D25", err);
      return { name: "meta:discourse_* \u6216 application-name=Discourse", weight: 2, matched: false };
    }
  }
  function domStructureSignal(doc) {
    try {
      const matched = !!(doc.getElementById("main-outlet") || doc.querySelector(".topic-list") || doc.querySelector('meta[property="og:site_name"]'));
      return { name: "DOM: #main-outlet/.topic-list/og:site_name", weight: 2, matched };
    } catch (err) {
      void logError("site", "\u68C0\u67E5 DOM \u7ED3\u6784\u5931\u8D25", err);
      return { name: "DOM: #main-outlet/.topic-list/og:site_name", weight: 2, matched: false };
    }
  }
  function urlPathPatternSignal(url) {
    try {
      const u = new URL(url);
      const p = u.pathname.toLowerCase();
      const patterns = ["/t/", "/u/", "/c/", "/tags", "/latest", "/top"];
      const matched = patterns.some((s) => p.includes(s));
      return { name: "URL \u8DEF\u5F84\u5305\u542B Discourse \u5E38\u89C1\u6BB5", weight: 1, matched, note: p };
    } catch (err) {
      void logError("site", "URL \u89E3\u6790\u5931\u8D25", err);
      return { name: "URL \u8DEF\u5F84\u5305\u542B Discourse \u5E38\u89C1\u6BB5", weight: 1, matched: false };
    }
  }
  var THRESHOLD;
  var init_siteDetector = __esm({
    "src/detectors/siteDetector.ts"() {
      init_logger();
      THRESHOLD = 3;
    }
  });

  // src/storage/domainLists.ts
  function normalizeDomain(input) {
    try {
      const s = (input || "").trim().toLowerCase();
      if (/^https?:\/\//i.test(s)) {
        return new URL(s).hostname;
      }
      return s.split(":")[0];
    } catch (err) {
      void logError("final", "\u57DF\u540D\u89C4\u8303\u5316\u5931\u8D25", err);
      return (input || "").trim().toLowerCase();
    }
  }
  function uniqSort(arr) {
    return Array.from(new Set(arr.filter(Boolean).map(normalizeDomain))).sort();
  }
  async function getLists() {
    const whitelist = await gmGet(KEY_WHITE, []) || [];
    const blacklist = await gmGet(KEY_BLACK, []) || [];
    return { whitelist: uniqSort(whitelist), blacklist: uniqSort(blacklist) };
  }
  async function addToWhitelist(domain) {
    const { whitelist } = await getLists();
    const d = normalizeDomain(domain);
    if (!whitelist.includes(d)) {
      whitelist.push(d);
      await gmSet(KEY_WHITE, uniqSort(whitelist));
      return { added: true, list: uniqSort(whitelist) };
    }
    return { added: false, list: whitelist };
  }
  async function removeFromWhitelist(domain) {
    const { whitelist } = await getLists();
    const d = normalizeDomain(domain);
    const next = whitelist.filter((x) => x !== d);
    const removed = next.length !== whitelist.length;
    if (removed) await gmSet(KEY_WHITE, uniqSort(next));
    return { removed, list: uniqSort(next) };
  }
  async function addToBlacklist(domain) {
    const { blacklist } = await getLists();
    const d = normalizeDomain(domain);
    if (!blacklist.includes(d)) {
      blacklist.push(d);
      await gmSet(KEY_BLACK, uniqSort(blacklist));
      return { added: true, list: uniqSort(blacklist) };
    }
    return { added: false, list: blacklist };
  }
  async function removeFromBlacklist(domain) {
    const { blacklist } = await getLists();
    const d = normalizeDomain(domain);
    const next = blacklist.filter((x) => x !== d);
    const removed = next.length !== blacklist.length;
    if (removed) await gmSet(KEY_BLACK, uniqSort(next));
    return { removed, list: uniqSort(next) };
  }
  function getCurrentHostname() {
    try {
      return location.hostname.toLowerCase();
    } catch (err) {
      void logError("final", "\u8BFB\u53D6\u5F53\u524D\u4E3B\u673A\u540D\u5931\u8D25", err);
      return "";
    }
  }
  async function getEnablement(autoIsDiscourse, host) {
    const { whitelist, blacklist } = await getLists();
    const h = normalizeDomain(host || getCurrentHostname());
    if (blacklist.includes(h)) return { enabled: false, reason: "blacklist" };
    if (whitelist.includes(h)) return { enabled: true, reason: "whitelist" };
    if (autoIsDiscourse) return { enabled: true, reason: "auto" };
    return { enabled: false, reason: "disabled" };
  }
  var KEY_WHITE, KEY_BLACK;
  var init_domainLists = __esm({
    "src/storage/domainLists.ts"() {
      init_gm();
      init_logger();
      KEY_WHITE = "whitelist";
      KEY_BLACK = "blacklist";
    }
  });

  // src/storage/settings.ts
  async function getRuleFlags() {
    const saved = await gmGet(KEY_RULES, {}) || {};
    return { ...DEFAULTS, ...saved };
  }
  async function getRuleEnabled(ruleId) {
    const flags = await getRuleFlags();
    const v = flags[ruleId];
    return typeof v === "boolean" ? v : DEFAULTS[ruleId] ?? true;
  }
  async function setRuleEnabled(ruleId, enabled) {
    const flags = await getRuleFlags();
    flags[ruleId] = enabled;
    await gmSet(KEY_RULES, flags);
  }
  var RULE_TOPIC_OPEN_NEW_TAB, RULE_TOPIC_IN_TOPIC_OPEN_OTHER, RULE_TOPIC_SAME_TOPIC_KEEP_NATIVE, RULE_USER_OPEN_NEW_TAB, RULE_USER_IN_PROFILE_OPEN_OTHER, RULE_USER_SAME_PROFILE_KEEP_NATIVE, RULE_ATTACHMENT_KEEP_NATIVE, RULE_POPUP_USER_CARD, RULE_POPUP_USER_MENU, RULE_POPUP_SEARCH_MENU, RULE_POPUP_CHAT_WINDOW, RULE_SIDEBAR_NON_TOPIC_KEEP_NATIVE, RULE_SIDEBAR_IN_TOPIC_NEW_TAB, DEFAULTS, KEY_RULES;
  var init_settings2 = __esm({
    "src/storage/settings.ts"() {
      init_gm();
      RULE_TOPIC_OPEN_NEW_TAB = "topic:open-new-tab";
      RULE_TOPIC_IN_TOPIC_OPEN_OTHER = "topic:in-topic-open-other";
      RULE_TOPIC_SAME_TOPIC_KEEP_NATIVE = "topic:same-topic-keep-native";
      RULE_USER_OPEN_NEW_TAB = "user:open-new-tab";
      RULE_USER_IN_PROFILE_OPEN_OTHER = "user:in-profile-open-other";
      RULE_USER_SAME_PROFILE_KEEP_NATIVE = "user:same-profile-keep-native";
      RULE_ATTACHMENT_KEEP_NATIVE = "attachment:keep-native";
      RULE_POPUP_USER_CARD = "popup:user-card";
      RULE_POPUP_USER_MENU = "popup:user-menu";
      RULE_POPUP_SEARCH_MENU = "popup:search-menu-results";
      RULE_POPUP_CHAT_WINDOW = "popup:chat-window-native";
      RULE_SIDEBAR_NON_TOPIC_KEEP_NATIVE = "sidebar:non-topic-keep-native";
      RULE_SIDEBAR_IN_TOPIC_NEW_TAB = "sidebar:in-topic-open-new-tab";
      DEFAULTS = {
        [RULE_TOPIC_OPEN_NEW_TAB]: true,
        [RULE_TOPIC_IN_TOPIC_OPEN_OTHER]: true,
        [RULE_TOPIC_SAME_TOPIC_KEEP_NATIVE]: true,
        [RULE_USER_OPEN_NEW_TAB]: true,
        [RULE_USER_IN_PROFILE_OPEN_OTHER]: true,
        [RULE_USER_SAME_PROFILE_KEEP_NATIVE]: true,
        [RULE_ATTACHMENT_KEEP_NATIVE]: true,
        [RULE_POPUP_USER_CARD]: true,
        [RULE_POPUP_USER_MENU]: true,
        [RULE_POPUP_SEARCH_MENU]: true,
        [RULE_POPUP_CHAT_WINDOW]: true,
        [RULE_SIDEBAR_NON_TOPIC_KEEP_NATIVE]: true,
        [RULE_SIDEBAR_IN_TOPIC_NEW_TAB]: true
      };
      KEY_RULES = "ruleFlags";
    }
  });

  // src/storage/openMode.ts
  async function getBackgroundOpenMode() {
    const v = await gmGet(KEY_BG_MODE, DEFAULT_BG_MODE);
    if (v === "topic" || v === "all" || v === "none") return v;
    return DEFAULT_BG_MODE;
  }
  async function setBackgroundOpenMode(mode) {
    await gmSet(KEY_BG_MODE, mode);
  }
  var KEY_BG_MODE, DEFAULT_BG_MODE;
  var init_openMode = __esm({
    "src/storage/openMode.ts"() {
      init_gm();
      KEY_BG_MODE = "open:bg-mode";
      DEFAULT_BG_MODE = "none";
    }
  });

  // src/storage/floatBall.ts
  async function getFloatBallEnabled() {
    const v = await gmGet(KEY_FB_ENABLED, true);
    return !!v;
  }
  async function setFloatBallEnabled(enabled) {
    await gmSet(KEY_FB_ENABLED, !!enabled);
  }
  async function getFloatBallFixed() {
    const v = await gmGet(KEY_FB_FIXED, false);
    return !!v;
  }
  async function setFloatBallFixed(fixed2) {
    await gmSet(KEY_FB_FIXED, !!fixed2);
  }
  async function getFloatBallPos() {
    const pos = await gmGet(KEY_FB_POS, DEFAULT_POS);
    const xr = Math.min(0.98, Math.max(0.02, pos?.xRatio ?? DEFAULT_POS.xRatio));
    const yr = Math.min(0.98, Math.max(0.02, pos?.yRatio ?? DEFAULT_POS.yRatio));
    return { xRatio: xr, yRatio: yr };
  }
  async function setFloatBallPos(pos) {
    const xr = Math.min(0.98, Math.max(0.02, pos.xRatio));
    const yr = Math.min(0.98, Math.max(0.02, pos.yRatio));
    await gmSet(KEY_FB_POS, { xRatio: xr, yRatio: yr });
  }
  async function resetFloatBallPos() {
    await gmSet(KEY_FB_POS, DEFAULT_POS);
    return DEFAULT_POS;
  }
  async function getAllowedModes() {
    const saved = await gmGet(KEY_FB_ALLOWED, DEFAULT_ALLOWED) || DEFAULT_ALLOWED;
    return normalizeAllowed(saved);
  }
  async function setAllowedModes(m) {
    const nm = normalizeAllowed(m);
    await gmSet(KEY_FB_ALLOWED, nm);
    return nm;
  }
  function normalizeAllowed(m) {
    const nm = {
      none: !!m?.none,
      topic: !!m?.topic,
      all: !!m?.all
    };
    const count = (nm.none ? 1 : 0) + (nm.topic ? 1 : 0) + (nm.all ? 1 : 0);
    if (count >= 2) return nm;
    if (!nm.topic) nm.topic = true;
    if (!nm.all && (nm.none ? 1 : 0) + (nm.topic ? 1 : 0) < 2) nm.all = true;
    return nm;
  }
  var KEY_FB_ENABLED, KEY_FB_FIXED, KEY_FB_POS, KEY_FB_ALLOWED, DEFAULT_POS, DEFAULT_ALLOWED, __keys;
  var init_floatBall = __esm({
    "src/storage/floatBall.ts"() {
      init_gm();
      KEY_FB_ENABLED = "ui:floatball:enabled";
      KEY_FB_FIXED = "ui:floatball:fixed";
      KEY_FB_POS = "ui:floatball:pos";
      KEY_FB_ALLOWED = "ui:floatball:allowed-modes";
      DEFAULT_POS = { xRatio: 0.94, yRatio: 0.66 };
      DEFAULT_ALLOWED = { none: true, topic: true, all: true };
      __keys = {
        KEY_FB_ENABLED,
        KEY_FB_FIXED,
        KEY_FB_POS,
        KEY_FB_ALLOWED
      };
    }
  });

  // src/ui/i18n.ts
  async function initI18n() {
    currentLang = await gmGet(KEY_LANG) || "zh";
  }
  function getLanguage() {
    return currentLang;
  }
  async function setLanguage(lang) {
    currentLang = lang;
    await gmSet(KEY_LANG, lang);
  }
  async function toggleLanguage() {
    const idx = LANGUAGES.indexOf(currentLang);
    const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
    await setLanguage(next);
  }
  function t(key) {
    const keys = key.split(".");
    let obj = translations[currentLang];
    for (const k of keys) {
      if (obj && typeof obj === "object") {
        obj = obj[k];
      } else {
        return key;
      }
    }
    return typeof obj === "string" ? obj : key;
  }
  var KEY_LANG, LANGUAGES, LanguageIcon, currentLang, translations;
  var init_i18n = __esm({
    "src/ui/i18n.ts"() {
      init_gm();
      KEY_LANG = "ui-language";
      LANGUAGES = ["zh", "en"];
      LanguageIcon = {
        zh: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
    <text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">\u4E2D</text>
  </svg>`,
        en: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
    <text x="12" y="16" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor" stroke="none">EN</text>
  </svg>`
      };
      currentLang = "zh";
      translations = {
        zh: {
          settings: {
            title: "\u8BBE\u7F6E",
            close: "\u5173\u95ED",
            theme: {
              light: "\u65E5\u95F4\u6A21\u5F0F",
              dark: "\u591C\u95F4\u6A21\u5F0F",
              auto: "\u81EA\u52A8\u6A21\u5F0F"
            },
            language: {
              zh: "\u4E2D\u6587",
              en: "English"
            },
            categories: {
              recognition: "\u8BBA\u575B\u8BC6\u522B",
              rules: "\u8DF3\u8F6C\u89C4\u5219",
              open: "\u540E\u53F0\u6253\u5F00",
              debug: "\u8C03\u8BD5"
            },
            status: {
              title: "\u5F53\u524D\u72B6\u6001",
              domain: "\u5F53\u524D\u57DF\u540D",
              enabled: "\u5DF2\u542F\u7528",
              disabled: "\u672A\u542F\u7528",
              reason: {
                auto: "\u81EA\u52A8\u8BC6\u522B",
                whitelist: "\u767D\u540D\u5355",
                blacklist: "\u9ED1\u540D\u5355",
                disabled: "\u672A\u8BC6\u522B\u4E3A Discourse"
              }
            },
            domain: {
              title: "\u9ED1\u767D\u540D\u5355",
              whitelist: "\u767D\u540D\u5355 - \u5F3A\u5236\u542F\u7528\u811A\u672C",
              blacklist: "\u9ED1\u540D\u5355 - \u5F3A\u5236\u7981\u7528\u811A\u672C",
              placeholder: "\u8F93\u5165\u57DF\u540D",
              add: "\u6DFB\u52A0",
              addCurrent: "\u6DFB\u52A0\u5F53\u524D\u57DF\u540D",
              edit: "\u7F16\u8F91",
              delete: "\u5220\u9664",
              empty: "\u6682\u65E0\u57DF\u540D"
            },
            rules: {
              title: "\u8DF3\u8F6C\u89C4\u5219",
              topic: {
                title: "\u4E3B\u9898\u5E16",
                openNewTab: "\u4ECE\u4EFB\u610F\u9875\u9762\u6253\u5F00\u4E3B\u9898\u5E16\u65F6\uFF0C\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00",
                inTopicOpenOther: "\u5728\u4E3B\u9898\u5E16\u5185\u90E8\u70B9\u51FB\u5176\u4ED6\u94FE\u63A5\u65F6,\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00",
                sameTopicKeepNative: "\u697C\u5C42\u8DF3\u8F6C\u65F6\u4FDD\u7559\u539F\u751F\u8DF3\u8F6C\u65B9\u5F0F"
              },
              user: {
                title: "\u4E2A\u4EBA\u4E3B\u9875",
                openNewTab: "\u4ECE\u4EFB\u610F\u9875\u9762\u6253\u5F00\u7528\u6237\u4E2A\u4EBA\u4E3B\u9875\u65F6,\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00",
                inProfileOpenOther: "\u5728\u7528\u6237\u4E2A\u4EBA\u4E3B\u9875\u5185\u70B9\u51FB\u5176\u4ED6\u94FE\u63A5\u65F6,\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00",
                sameProfileKeepNative: "\u540C\u4E00\u7528\u6237\u4E3B\u9875\u5185\u8DF3\u8F6C\u65F6\u4FDD\u7559\u539F\u751F\u65B9\u5F0F"
              },
              attachment: {
                title: "\u9644\u4EF6",
                keepNative: "\u6253\u5F00\u56FE\u7247\u7B49\u9644\u4EF6\u65F6,\u4FDD\u7559\u539F\u751F\u8DF3\u8F6C\u65B9\u5F0F"
              },
              popup: {
                title: "\u5F39\u7A97",
                userCard: "\u7528\u6237\u5361\u7247\u5185\u94FE\u63A5\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00",
                userMenu: "\u7528\u6237\u83DC\u5355\u5185\u94FE\u63A5\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00",
                // 新增：搜索框结果与“更多”按钮
                searchMenu: "\u641C\u7D22\u6846\u94FE\u63A5\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00",
                // 新增：聊天窗口
                chatWindowNative: "\u804A\u5929\u7A97\u53E3\u4F7F\u7528\u539F\u751F\u5F39\u7A97\u6253\u5F00"
              },
              sidebar: {
                title: "\u4FA7\u8FB9\u680F",
                nonTopicKeepNative: "\u975E\u4E3B\u9898\u5E16\u5185\u4FA7\u8FB9\u680F\u7528\u539F\u751F\u65B9\u5F0F",
                inTopicNewTab: "\u4E3B\u9898\u5E16\u5185\u4FA7\u8FB9\u680F\u7528\u65B0\u6807\u7B7E\u9875\u6253\u5F00"
              }
            },
            openMode: {
              title: "\u6253\u5F00\u65B9\u5F0F",
              description: "\u540E\u53F0\u6253\u5F00\u662F\u6307\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00\u94FE\u63A5\u65F6,\u4FDD\u6301\u5F53\u524D\u9875\u9762\u4E3A\u6D3B\u52A8\u6807\u7B7E,\u65B0\u6807\u7B7E\u5728\u540E\u53F0\u6253\u5F00",
              selectLabel: "\u5F53\u524D\u6A21\u5F0F",
              options: {
                none: "\u524D\u53F0\u6253\u5F00",
                topic: "\u4E3B\u9898\u5E16\u540E\u53F0",
                all: "\u5168\u90E8\u540E\u53F0"
              },
              optionDesc: {
                none: "\u65B0\u6807\u7B7E\u7ACB\u5373\u6FC0\u6D3B",
                topic: "\u6253\u5F00\u4E3B\u9898\u5E16\u65F6\u5728\u540E\u53F0",
                all: "\u6240\u6709\u65B0\u6807\u7B7E\u90FD\u5728\u540E\u53F0"
              },
              floatball: {
                title: "\u60AC\u6D6E\u7403\u8BBE\u7F6E",
                tip: "\u82E5\u9700\u8981\u7ECF\u5E38\u5207\u6362\u524D\u540E\u53F0\u6253\u5F00\u65B9\u5F0F,\u53EF\u5F00\u542F\u60AC\u6D6E\u7403,\u968F\u65F6\u70B9\u51FB\u5207\u6362",
                displayTitle: "\u663E\u793A\u8BBE\u7F6E",
                switchTitle: "\u5207\u6362\u8BBE\u7F6E",
                show: "\u663E\u793A\u60AC\u6D6E\u7403",
                showDesc: "\u5728\u9875\u9762\u4E0A\u663E\u793A\u5FEB\u901F\u5207\u6362\u6309\u94AE",
                reset: "\u91CD\u7F6E\u4F4D\u7F6E",
                fixed: "\u56FA\u5B9A\u4F4D\u7F6E",
                fixedDesc: "\u7981\u7528\u62D6\u52A8,\u9501\u5B9A\u60AC\u6D6E\u7403\u4F4D\u7F6E",
                modes: "\u60AC\u6D6E\u7403\u53EF\u5207\u6362\u7684\u6A21\u5F0F",
                modesDesc: "\u81F3\u5C11\u4FDD\u75592\u4E2A\u9009\u9879\u4EE5\u4FBF\u5207\u6362"
              }
            },
            debug: {
              title: "\u8C03\u8BD5",
              enable: "\u8C03\u8BD5\u6A21\u5F0F",
              allOn: "\u5168\u90E8\u5F00\u542F",
              allOff: "\u5168\u90E8\u5173\u95ED",
              categories: {
                site: "\u7AD9\u70B9\u8BC6\u522B",
                click: "\u70B9\u51FB\u8FC7\u6EE4\u539F\u56E0",
                link: "\u94FE\u63A5\u4FE1\u606F",
                rules: "\u89C4\u5219\u7EC6\u8282",
                final: "\u6700\u7EC8\u89C4\u5219\u4E0E\u52A8\u4F5C",
                bg: "\u540E\u53F0\u6253\u5F00"
              }
            }
          }
        },
        en: {
          settings: {
            title: "Settings",
            close: "Close",
            theme: {
              light: "Light Mode",
              dark: "Dark Mode",
              auto: "Auto Mode"
            },
            language: {
              zh: "\u4E2D\u6587",
              en: "English"
            },
            categories: {
              recognition: "Forum Recognition",
              rules: "Navigation Rules",
              open: "Background Open",
              debug: "Debug"
            },
            status: {
              title: "Current Status",
              domain: "Current Domain",
              enabled: "Enabled",
              disabled: "Disabled",
              reason: {
                auto: "Auto-detected",
                whitelist: "Whitelist",
                blacklist: "Blacklist",
                disabled: "Not a Discourse forum"
              }
            },
            domain: {
              title: "Blacklist & Whitelist",
              whitelist: "Whitelist - Force Enable Script",
              blacklist: "Blacklist - Force Disable Script",
              placeholder: "Enter domain",
              add: "Add",
              addCurrent: "Add Current Domain",
              edit: "Edit",
              delete: "Delete",
              empty: "No domains"
            },
            rules: {
              title: "Navigation Rules",
              topic: {
                title: "Topics",
                openNewTab: "Open topics in new tab from any page",
                inTopicOpenOther: "Open other links in new tab within topics",
                sameTopicKeepNative: "Keep native behavior for floor jumps"
              },
              user: {
                title: "User Profiles",
                openNewTab: "Open user profiles in new tab from any page",
                inProfileOpenOther: "Open other links in new tab within profiles",
                sameProfileKeepNative: "Keep native behavior within same profile"
              },
              attachment: {
                title: "Attachments",
                keepNative: "Keep native behavior for images and attachments"
              },
              popup: {
                title: "Popups",
                userCard: "Open user card links in new tab",
                userMenu: "Open user menu links in new tab",
                // New: search popup results and "more" button
                searchMenu: "Open search box links in new tab",
                // New: chat window
                chatWindowNative: "Open chat window in native popup"
              },
              sidebar: {
                title: "Sidebar",
                nonTopicKeepNative: "Keep native behavior in non-topic pages",
                inTopicNewTab: "Open sidebar links in new tab within topics"
              }
            },
            openMode: {
              title: "Open Behavior",
              description: "Background open means opening links in a new tab while keeping the current page active, with the new tab opened in the background",
              selectLabel: "Current Mode",
              options: {
                none: "Foreground",
                topic: "Topics Background",
                all: "All Background"
              },
              optionDesc: {
                none: "New tab activates immediately",
                topic: "Topics open in background",
                all: "All new tabs in background"
              },
              floatball: {
                title: "Float Ball Settings",
                tip: "If you need to frequently switch between foreground/background modes, enable the float ball to toggle anytime",
                displayTitle: "Display Settings",
                switchTitle: "Switch Settings",
                show: "Show Float Ball",
                showDesc: "Display quick toggle button on page",
                reset: "Reset Position",
                fixed: "Pin Position",
                fixedDesc: "Lock float ball position",
                modes: "Switchable Modes",
                modesDesc: "Keep at least 2 options for switching"
              }
            },
            debug: {
              title: "Debug",
              enable: "Debug Mode",
              allOn: "Enable All",
              allOff: "Disable All",
              categories: {
                site: "Site Detection",
                click: "Click Filter Reasons",
                link: "Link Info",
                rules: "Rule Details",
                final: "Final Rule & Action",
                bg: "Background Open"
              }
            }
          }
        }
      };
    }
  });

  // src/floatball/index.ts
  var floatball_exports = {};
  __export(floatball_exports, {
    __floatBall: () => __floatBall,
    initFloatBall: () => initFloatBall,
    resetFloatBallPosition: () => resetFloatBallPosition,
    setFloatBallFixedMode: () => setFloatBallFixedMode,
    setFloatBallShown: () => setFloatBallShown,
    syncCurrentModeFromStorage: () => syncCurrentModeFromStorage,
    updateAllowedModes: () => updateAllowedModes
  });
  function ensureStyle() {
    if (document.getElementById("dnt-fb-style")) return;
    const s = document.createElement("style");
    s.id = "dnt-fb-style";
    s.textContent = `
  .dnt-fb {
    position: fixed;
    z-index: 2147483646;
    width: ${SIZE}px;
    height: ${SIZE}px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(12px) saturate(150%);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
    will-change: transform;
  }
  .dnt-fb-dark {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.15);
  }
  .dnt-fb:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2), 0 3px 10px rgba(0, 0, 0, 0.12);
  }
  .dnt-fb-dark:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 3px 12px rgba(0, 0, 0, 0.35);
  }
  .dnt-fb-dragging {
    transform: scale(1.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: grabbing !important;
  }
  .dnt-fb-dark.dnt-fb-dragging {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6), 0 4px 14px rgba(0, 0, 0, 0.4);
  }
  .dnt-fb-fixed {
    cursor: default;
  }
  .dnt-fb-fixed:hover {
    transform: scale(1.02);
  }
  .dnt-fb-drag-handle {
    position: absolute;
    top: 4px;
    width: 16px;
    height: 3px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 2px;
    opacity: 0.6;
  }
  .dnt-fb-fixed .dnt-fb-drag-handle {
    display: none;
  }
  .dnt-fb-icon {
    color: #fff;
    line-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dnt-fb-tip {
    position: absolute;
    bottom: ${SIZE + 8}px;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    pointer-events: none;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .dnt-fb:hover .dnt-fb-tip {
    opacity: 1;
    transform: translateY(0);
  }
  .dnt-fb-dragging .dnt-fb-tip {
    display: none;
  }
  `;
    document.head.appendChild(s);
  }
  function getThemeClass() {
    const theme = window.__dntThemeCache;
    const fallback = theme ?? (function() {
      try {
        return localStorage.getItem("dnt:ui-theme")?.replace(/"/g, "") || "auto";
      } catch {
        return "auto";
      }
    })();
    if (fallback === "dark") return "dnt-fb-dark";
    if (fallback === "auto") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dnt-fb-dark" : "dnt-fb-light";
    }
    return "dnt-fb-light";
  }
  function pxLeftFromRatio(xRatio) {
    const vw = window.innerWidth;
    const left = Math.round(vw * xRatio - SIZE / 2);
    return clamp(left, MARGIN, vw - SIZE - MARGIN);
  }
  function pxTopFromRatio(yRatio) {
    const vh = window.innerHeight;
    const top = Math.round(vh * yRatio - SIZE / 2);
    return clamp(top, MARGIN, vh - SIZE - MARGIN);
  }
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  function setElPosFromRatio(el, pos) {
    el.style.left = pxLeftFromRatio(pos.xRatio) + "px";
    el.style.top = pxTopFromRatio(pos.yRatio) + "px";
  }
  function getTipText(mode) {
    const map = {
      none: `\u540E\u53F0\u6253\u5F00: ${t("settings.openMode.options.none")}`,
      topic: `\u540E\u53F0\u6253\u5F00: ${t("settings.openMode.options.topic")}`,
      all: `\u540E\u53F0\u6253\u5F00: ${t("settings.openMode.options.all")}`
    };
    return map[mode] || "";
  }
  function applyModeVisual() {
    if (!rootEl || !iconEl) return;
    const color = ModeColor[curMode];
    rootEl.style.background = color;
    iconEl.innerHTML = Icons[curMode];
    const tip = getTipText(curMode);
    rootEl.title = tip;
    if (tipEl) tipEl.textContent = tip;
  }
  async function cycleMode() {
    const order = ["none", "topic", "all"];
    const enabledModes = order.filter((m) => allowed[m]);
    if (enabledModes.length < 2) {
      if (!allowed.all) {
        allowed.all = true;
        await setAllowedModes(allowed);
      }
      enabledModes.push("all");
    }
    const idx = enabledModes.indexOf(curMode);
    const next = enabledModes[(idx + 1) % enabledModes.length];
    if (next !== curMode) {
      curMode = next;
      await setBackgroundOpenMode(curMode);
      applyModeVisual();
      await logBgModeChange(curMode, "ball");
    }
  }
  function onMouseDown(ev) {
    if (!rootEl) return;
    dragging = !fixed;
    const rect = rootEl.getBoundingClientRect();
    dragStart = { x: ev.clientX, y: ev.clientY, left: rect.left, top: rect.top };
    if (dragging) {
      rootEl.classList.add("dnt-fb-dragging");
      rootEl.style.cursor = "grabbing";
    }
  }
  function onMouseMove(ev) {
    if (!rootEl || !dragging || !dragStart) return;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      if (!rootEl || !dragStart) return;
      const dx = ev.clientX - dragStart.x;
      const dy = ev.clientY - dragStart.y;
      const left = clamp(dragStart.left + dx, MARGIN, window.innerWidth - SIZE - MARGIN);
      const top = clamp(dragStart.top + dy, MARGIN, window.innerHeight - SIZE - MARGIN);
      rootEl.style.left = `${left}px`;
      rootEl.style.top = `${top}px`;
      rafId = null;
    });
  }
  async function onMouseUp(ev) {
    if (!rootEl) return;
    if (!dragStart) return;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    rootEl.classList.remove("dnt-fb-dragging");
    rootEl.style.cursor = fixed ? "default" : "pointer";
    const dx = Math.abs(ev.clientX - dragStart.x);
    const dy = Math.abs(ev.clientY - dragStart.y);
    const wasDragging = dragging && (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD);
    dragging = false;
    if (wasDragging) {
      const rect = rootEl.getBoundingClientRect();
      const xRatio = (rect.left + SIZE / 2) / window.innerWidth;
      const yRatio = (rect.top + SIZE / 2) / window.innerHeight;
      await setFloatBallPos({ xRatio, yRatio });
    }
    dragStart = null;
    if (!wasDragging) {
      await cycleMode();
    }
  }
  function onWindowResize() {
    if (!rootEl) return;
    getFloatBallPos().then((pos) => setElPosFromRatio(rootEl, pos)).catch((e) => void logError("bg", "\u7A97\u53E3\u53D8\u5316\u5B9A\u4F4D\u5931\u8D25", e));
  }
  function updateThemeClass() {
    if (!rootEl) return;
    rootEl.classList.remove("dnt-fb-light", "dnt-fb-dark");
    rootEl.classList.add(getThemeClass());
  }
  function observeTheme() {
    const mo = new MutationObserver(() => updateThemeClass());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-dnt-theme"] });
    if (window.matchMedia) {
      try {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => updateThemeClass());
      } catch {
      }
    }
  }
  function createRoot() {
    const el = document.createElement("div");
    el.id = "dnt-float-ball";
    el.className = `dnt-fb ${getThemeClass()}`;
    el.setAttribute("aria-label", "\u540E\u53F0\u6253\u5F00\u5207\u6362");
    const dragHandle = document.createElement("div");
    dragHandle.className = "dnt-fb-drag-handle";
    el.appendChild(dragHandle);
    const icon = document.createElement("div");
    icon.className = "dnt-fb-icon";
    el.appendChild(icon);
    const tip = document.createElement("div");
    tip.className = "dnt-fb-tip";
    tip.textContent = "";
    el.appendChild(tip);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return el;
  }
  async function mount() {
    if (rootEl) return;
    await ensureDomReady();
    ensureStyle();
    curMode = await getBackgroundOpenMode();
    fixed = await getFloatBallFixed();
    allowed = await getAllowedModes();
    rootEl = createRoot();
    iconEl = rootEl.querySelector(".dnt-fb-icon");
    tipEl = rootEl.querySelector(".dnt-fb-tip");
    applyModeVisual();
    if (fixed) rootEl.classList.add("dnt-fb-fixed");
    const pos = await getFloatBallPos();
    setElPosFromRatio(rootEl, pos);
    if (document.body) document.body.appendChild(rootEl);
    observeTheme();
    window.addEventListener("resize", onWindowResize);
    if (unsubPos) {
      try {
        unsubPos();
      } catch {
      }
      ;
      unsubPos = null;
    }
    unsubPos = gmOnValueChange(__keys.KEY_FB_POS, (_oldV, newV) => {
      if (!rootEl || !newV) return;
      setElPosFromRatio(rootEl, newV);
    });
    await logBgBallVisibility(true);
  }
  async function unmount() {
    if (!rootEl) return;
    window.removeEventListener("resize", onWindowResize);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    if (unsubPos) {
      try {
        unsubPos();
      } catch {
      }
      ;
      unsubPos = null;
    }
    rootEl.remove();
    rootEl = null;
    iconEl = null;
    await logBgBallVisibility(false);
  }
  async function initFloatBall() {
    const enabled = await getFloatBallEnabled();
    if (enabled) await mount();
  }
  async function setFloatBallShown(on) {
    await setFloatBallEnabled(on);
    if (on) await mount();
    else await unmount();
  }
  async function setFloatBallFixedMode(on) {
    fixed = on;
    await setFloatBallFixed(on);
    if (rootEl) {
      if (on) rootEl.classList.add("dnt-fb-fixed");
      else rootEl.classList.remove("dnt-fb-fixed");
    }
  }
  async function resetFloatBallPosition() {
    const pos = await resetFloatBallPos();
    if (rootEl) setElPosFromRatio(rootEl, pos);
  }
  async function updateAllowedModes(next) {
    allowed = await setAllowedModes(next);
  }
  async function syncCurrentModeFromStorage() {
    curMode = await getBackgroundOpenMode();
    applyModeVisual();
  }
  async function ensureDomReady() {
    if (document.head && document.body && document.readyState !== "loading") return;
    await new Promise((resolve) => {
      const check = () => {
        if (document.head && document.body && document.readyState !== "loading") {
          document.removeEventListener("DOMContentLoaded", check);
          document.removeEventListener("readystatechange", check);
          resolve();
        }
      };
      document.addEventListener("DOMContentLoaded", check, { once: true });
      document.addEventListener("readystatechange", check);
      const timer = setInterval(() => {
        if (document.head && document.body && document.readyState !== "loading") {
          clearInterval(timer);
          check();
        }
      }, 30);
    });
  }
  var rootEl, iconEl, tipEl, dragging, dragStart, fixed, allowed, curMode, unsubPos, rafId, DRAG_THRESHOLD, SIZE, MARGIN, Icons, ModeColor, __floatBall;
  var init_floatball = __esm({
    "src/floatball/index.ts"() {
      init_openMode();
      init_floatBall();
      init_gm();
      init_floatBall();
      init_i18n();
      init_logger();
      rootEl = null;
      iconEl = null;
      tipEl = null;
      dragging = false;
      dragStart = null;
      fixed = false;
      allowed = { none: true, topic: true, all: true };
      curMode = "none";
      unsubPos = null;
      rafId = null;
      DRAG_THRESHOLD = 5;
      SIZE = 44;
      MARGIN = 8;
      Icons = {
        none: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8" /></svg>`,
        topic: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h10M4 17h16"/></svg>`,
        all: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></svg>`
      };
      ModeColor = {
        none: "#909399",
        topic: "#409eff",
        all: "#67c23a"
      };
      __floatBall = {
        get state() {
          return { mounted: !!rootEl, fixed, allowed, mode: curMode };
        }
      };
    }
  });

  // src/ui/theme.ts
  async function initTheme() {
    currentTheme = await gmGet(KEY_THEME) || "auto";
    applyTheme();
  }
  function getTheme() {
    return currentTheme;
  }
  async function setTheme(theme) {
    currentTheme = theme;
    await gmSet(KEY_THEME, theme);
    applyTheme();
  }
  async function toggleTheme() {
    const idx = THEMES.indexOf(currentTheme);
    const next = THEMES[(idx + 1) % THEMES.length];
    await setTheme(next);
  }
  function applyTheme() {
    const root = document.documentElement;
    if (currentTheme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-dnt-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-dnt-theme", currentTheme);
    }
  }
  var KEY_THEME, THEMES, ThemeIcon, currentTheme;
  var init_theme = __esm({
    "src/ui/theme.ts"() {
      init_gm();
      KEY_THEME = "ui-theme";
      THEMES = ["light", "dark", "auto"];
      ThemeIcon = {
        light: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>`,
        dark: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>`,
        auto: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2 A 10 10 0 0 1 12 22 Z" fill="currentColor"></path>
  </svg>`
      };
      currentTheme = "auto";
      if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
          if (currentTheme === "auto") {
            applyTheme();
          }
        });
      }
    }
  });

  // src/ui/sections/categories.ts
  var CATEGORIES;
  var init_categories = __esm({
    "src/ui/sections/categories.ts"() {
      CATEGORIES = [
        {
          id: "recognition",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
      <path d="M2 17L12 22L22 17"></path>
      <path d="M2 12L12 17L22 12"></path>
    </svg>`,
          labelKey: "settings.categories.recognition"
        },
        {
          id: "rules",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>`,
          labelKey: "settings.categories.rules"
        },
        {
          id: "open",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <rect x="6" y="6" width="12" height="12" rx="1" ry="1" opacity="0.5"></rect>
      <path d="M9 9h6M9 12h4" opacity="0.3"></path>
    </svg>`,
          labelKey: "settings.categories.open"
        },
        {
          id: "debug",
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>`,
          labelKey: "settings.categories.debug"
        }
      ];
    }
  });

  // src/ui/sections/status.ts
  function renderStatusSection() {
    const section = document.createElement("div");
    section.className = "dnt-section";
    const title = document.createElement("h3");
    title.className = "dnt-section-title";
    title.textContent = t("settings.status.title");
    section.appendChild(title);
    const content = document.createElement("div");
    content.className = "dnt-status-content";
    content.id = STATUS_CONTENT_ID;
    section.appendChild(content);
    updateStatusContent(content);
    return section;
  }
  async function updateStatusContent(content) {
    const host = getCurrentHostname();
    const result = detectDiscourse();
    const enable = await getEnablement(result.isDiscourse, host);
    content.innerHTML = "";
    const domainRow = document.createElement("div");
    domainRow.className = "dnt-status-row";
    const domainLabel = document.createElement("span");
    domainLabel.className = "dnt-status-label";
    domainLabel.textContent = t("settings.status.domain") + ":";
    const domainValue = document.createElement("span");
    domainValue.className = "dnt-status-value dnt-domain-text";
    domainValue.textContent = host;
    domainRow.appendChild(domainLabel);
    domainRow.appendChild(domainValue);
    content.appendChild(domainRow);
    const statusRow = document.createElement("div");
    statusRow.className = "dnt-status-row";
    const statusLabel = document.createElement("span");
    statusLabel.className = "dnt-status-label";
    statusLabel.textContent = t(enable.enabled ? "settings.status.enabled" : "settings.status.disabled");
    const reasonBadge = document.createElement("span");
    reasonBadge.className = `dnt-badge dnt-badge-${enable.reason}`;
    reasonBadge.textContent = t(`settings.status.reason.${enable.reason}`);
    statusRow.appendChild(statusLabel);
    statusRow.appendChild(reasonBadge);
    content.appendChild(statusRow);
  }
  async function refreshStatusSection() {
    const content = document.getElementById(STATUS_CONTENT_ID);
    if (content) {
      await updateStatusContent(content);
    }
  }
  var STATUS_CONTENT_ID;
  var init_status = __esm({
    "src/ui/sections/status.ts"() {
      init_domainLists();
      init_siteDetector();
      init_i18n();
      STATUS_CONTENT_ID = "dnt-status-content";
    }
  });

  // src/ui/sections/domain.ts
  function renderDomainSection() {
    const section = document.createElement("div");
    section.className = "dnt-section";
    const title = document.createElement("h3");
    title.className = "dnt-section-title";
    title.textContent = t("settings.domain.title");
    section.appendChild(title);
    const content = document.createElement("div");
    content.className = "dnt-domain-content";
    const whitelistBlock = createListBlock("whitelist");
    content.appendChild(whitelistBlock);
    const blacklistBlock = createListBlock("blacklist");
    content.appendChild(blacklistBlock);
    section.appendChild(content);
    return section;
  }
  function createListBlock(type) {
    const block = document.createElement("div");
    block.className = "dnt-list-block";
    const subtitle = document.createElement("h4");
    subtitle.className = "dnt-list-subtitle";
    subtitle.textContent = t(`settings.domain.${type}`);
    block.appendChild(subtitle);
    const list = document.createElement("div");
    list.className = "dnt-domain-list";
    list.id = `dnt-${type}`;
    block.appendChild(list);
    const inputRow = document.createElement("div");
    inputRow.className = "dnt-input-row";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "dnt-input";
    input.placeholder = t("settings.domain.placeholder");
    inputRow.appendChild(input);
    const addBtn = document.createElement("button");
    addBtn.className = "dnt-btn dnt-btn-primary";
    addBtn.textContent = t("settings.domain.add");
    addBtn.addEventListener("click", async () => {
      const domain = input.value.trim();
      if (domain) {
        await handleAdd(type, domain);
        input.value = "";
      }
    });
    inputRow.appendChild(addBtn);
    block.appendChild(inputRow);
    const addCurrentBtn = document.createElement("button");
    addCurrentBtn.className = "dnt-btn dnt-btn-secondary";
    addCurrentBtn.textContent = t("settings.domain.addCurrent");
    addCurrentBtn.addEventListener("click", () => {
      const host = getCurrentHostname();
      handleAdd(type, host);
    });
    block.appendChild(addCurrentBtn);
    refreshList(type);
    return block;
  }
  async function refreshList(type) {
    const lists = await getLists();
    const domains = lists[type];
    const container = document.getElementById(`dnt-${type}`);
    if (!container) return;
    container.innerHTML = "";
    if (domains.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dnt-empty-text";
      empty.textContent = t("settings.domain.empty");
      container.appendChild(empty);
      return;
    }
    domains.forEach((domain) => {
      const item = document.createElement("div");
      item.className = "dnt-domain-item";
      const text = document.createElement("span");
      text.className = "dnt-domain-text";
      text.textContent = domain;
      item.appendChild(text);
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "dnt-btn dnt-btn-danger dnt-btn-sm";
      deleteBtn.textContent = t("settings.domain.delete");
      deleteBtn.addEventListener("click", () => handleDelete(type, domain));
      item.appendChild(deleteBtn);
      container.appendChild(item);
    });
  }
  async function handleAdd(type, domain) {
    if (!domain) return;
    const fn = type === "whitelist" ? addToWhitelist : addToBlacklist;
    const result = await fn(domain);
    if (result.added) {
      await refreshList(type);
      await refreshStatusSection();
    }
  }
  async function handleDelete(type, domain) {
    const fn = type === "whitelist" ? removeFromWhitelist : removeFromBlacklist;
    const result = await fn(domain);
    if (result.removed) {
      await refreshList(type);
      await refreshStatusSection();
    }
  }
  var init_domain = __esm({
    "src/ui/sections/domain.ts"() {
      init_domainLists();
      init_i18n();
      init_status();
    }
  });

  // src/ui/sections/recognition.ts
  function renderRecognitionCategory() {
    const container = document.createElement("div");
    container.className = "dnt-category-content";
    container.appendChild(renderStatusSection());
    container.appendChild(renderDomainSection());
    return container;
  }
  var init_recognition = __esm({
    "src/ui/sections/recognition.ts"() {
      init_status();
      init_domain();
    }
  });

  // src/ui/sections/rules.ts
  function renderRulesSection() {
    const section = document.createElement("div");
    section.className = "dnt-section";
    const title = document.createElement("h3");
    title.className = "dnt-section-title";
    title.textContent = t("settings.rules.title");
    section.appendChild(title);
    const content = document.createElement("div");
    content.className = "dnt-rules-content";
    (async () => {
      const flags = await getRuleFlags();
      RULE_GROUPS.forEach((group) => {
        const groupBlock = document.createElement("div");
        groupBlock.className = "dnt-rule-group";
        const groupTitle = document.createElement("h4");
        groupTitle.className = "dnt-rule-group-title";
        groupTitle.textContent = t(group.title);
        groupBlock.appendChild(groupTitle);
        group.rules.forEach((rule) => {
          const ruleItem = createRuleItem(rule.id, t(rule.label), flags[rule.id] ?? true);
          groupBlock.appendChild(ruleItem);
        });
        content.appendChild(groupBlock);
      });
    })();
    section.appendChild(content);
    return section;
  }
  function createRuleItem(ruleId, label, enabled) {
    const item = document.createElement("div");
    item.className = "dnt-rule-item";
    const labelEl = document.createElement("label");
    labelEl.className = "dnt-rule-label";
    labelEl.textContent = label;
    const toggle = createToggle(ruleId, enabled);
    item.appendChild(labelEl);
    item.appendChild(toggle);
    return item;
  }
  function createToggle(ruleId, enabled) {
    const toggle = document.createElement("div");
    toggle.className = `dnt-toggle ${enabled ? "dnt-toggle-on" : "dnt-toggle-off"}`;
    toggle.setAttribute("data-rule-id", ruleId);
    const track = document.createElement("div");
    track.className = "dnt-toggle-track";
    const thumb = document.createElement("div");
    thumb.className = "dnt-toggle-thumb";
    track.appendChild(thumb);
    toggle.appendChild(track);
    toggle.addEventListener("click", async () => {
      const currentState = toggle.classList.contains("dnt-toggle-on");
      const newState = !currentState;
      await setRuleEnabled(ruleId, newState);
      toggle.classList.remove("dnt-toggle-on", "dnt-toggle-off");
      toggle.classList.add(newState ? "dnt-toggle-on" : "dnt-toggle-off");
    });
    return toggle;
  }
  var RULE_GROUPS;
  var init_rules = __esm({
    "src/ui/sections/rules.ts"() {
      init_settings2();
      init_settings2();
      init_i18n();
      RULE_GROUPS = [
        {
          title: "settings.rules.topic.title",
          rules: [
            { id: RULE_TOPIC_OPEN_NEW_TAB, label: "settings.rules.topic.openNewTab" },
            { id: RULE_TOPIC_IN_TOPIC_OPEN_OTHER, label: "settings.rules.topic.inTopicOpenOther" },
            { id: RULE_TOPIC_SAME_TOPIC_KEEP_NATIVE, label: "settings.rules.topic.sameTopicKeepNative" }
          ]
        },
        {
          title: "settings.rules.user.title",
          rules: [
            { id: RULE_USER_OPEN_NEW_TAB, label: "settings.rules.user.openNewTab" },
            { id: RULE_USER_IN_PROFILE_OPEN_OTHER, label: "settings.rules.user.inProfileOpenOther" },
            { id: RULE_USER_SAME_PROFILE_KEEP_NATIVE, label: "settings.rules.user.sameProfileKeepNative" }
          ]
        },
        {
          title: "settings.rules.attachment.title",
          rules: [{ id: RULE_ATTACHMENT_KEEP_NATIVE, label: "settings.rules.attachment.keepNative" }]
        },
        {
          title: "settings.rules.popup.title",
          rules: [
            { id: RULE_POPUP_USER_CARD, label: "settings.rules.popup.userCard" },
            { id: RULE_POPUP_USER_MENU, label: "settings.rules.popup.userMenu" },
            { id: RULE_POPUP_SEARCH_MENU, label: "settings.rules.popup.searchMenu" },
            { id: RULE_POPUP_CHAT_WINDOW, label: "settings.rules.popup.chatWindowNative" }
          ]
        },
        {
          title: "settings.rules.sidebar.title",
          rules: [
            { id: RULE_SIDEBAR_NON_TOPIC_KEEP_NATIVE, label: "settings.rules.sidebar.nonTopicKeepNative" },
            { id: RULE_SIDEBAR_IN_TOPIC_NEW_TAB, label: "settings.rules.sidebar.inTopicNewTab" }
          ]
        }
      ];
    }
  });

  // src/ui/sections/open.ts
  function renderOpenSection() {
    const section = document.createElement("div");
    section.className = "dnt-section";
    const title = document.createElement("h3");
    title.className = "dnt-section-title";
    title.textContent = t("settings.openMode.title");
    section.appendChild(title);
    const infoBox = createInfoBox(t("settings.openMode.description"));
    section.appendChild(infoBox);
    const modeBlock = document.createElement("div");
    modeBlock.className = "dnt-list-block";
    modeBlock.style.marginTop = "16px";
    const modeLabel = document.createElement("div");
    modeLabel.className = "dnt-list-subtitle";
    modeLabel.textContent = t("settings.openMode.selectLabel");
    modeBlock.appendChild(modeLabel);
    const segmentedControl = createSegmentedControl();
    modeBlock.appendChild(segmentedControl);
    section.appendChild(modeBlock);
    const floatballTitle = document.createElement("h3");
    floatballTitle.className = "dnt-section-title";
    floatballTitle.textContent = t("settings.openMode.floatball.title");
    floatballTitle.style.marginTop = "32px";
    section.appendChild(floatballTitle);
    const floatballTip = createInfoBox(t("settings.openMode.floatball.tip"));
    section.appendChild(floatballTip);
    const displayBlock = document.createElement("div");
    displayBlock.className = "dnt-list-block";
    displayBlock.style.marginTop = "16px";
    const displayTitle = document.createElement("div");
    displayTitle.className = "dnt-list-subtitle";
    displayTitle.textContent = t("settings.openMode.floatball.displayTitle");
    displayBlock.appendChild(displayTitle);
    const showRow = createToggleRow(
      t("settings.openMode.floatball.show"),
      t("settings.openMode.floatball.showDesc"),
      false,
      async (on) => {
        await setFloatBallShown(on);
      }
    );
    displayBlock.appendChild(showRow.row);
    const fixedRow = createToggleRow(
      t("settings.openMode.floatball.fixed"),
      t("settings.openMode.floatball.fixedDesc"),
      false,
      async (on) => {
        await setFloatBallFixedMode(on);
      }
    );
    displayBlock.appendChild(fixedRow.row);
    const resetRow = document.createElement("div");
    resetRow.style.marginTop = "12px";
    const resetBtn = document.createElement("button");
    resetBtn.className = "dnt-btn dnt-btn-secondary";
    resetBtn.textContent = t("settings.openMode.floatball.reset");
    resetBtn.addEventListener("click", async () => {
      await resetFloatBallPosition();
    });
    resetRow.appendChild(resetBtn);
    displayBlock.appendChild(resetRow);
    section.appendChild(displayBlock);
    const switchBlock = document.createElement("div");
    switchBlock.className = "dnt-list-block";
    switchBlock.style.marginTop = "16px";
    const switchTitle = document.createElement("div");
    switchTitle.className = "dnt-list-subtitle";
    switchTitle.textContent = t("settings.openMode.floatball.switchTitle");
    switchBlock.appendChild(switchTitle);
    const modesLabel = document.createElement("div");
    modesLabel.className = "dnt-subsection-label";
    modesLabel.textContent = t("settings.openMode.floatball.modes");
    modesLabel.style.marginTop = "12px";
    modesLabel.style.marginBottom = "8px";
    switchBlock.appendChild(modesLabel);
    const modesDesc = document.createElement("div");
    modesDesc.className = "dnt-hint-text";
    modesDesc.textContent = t("settings.openMode.floatball.modesDesc");
    modesDesc.style.marginBottom = "12px";
    switchBlock.appendChild(modesDesc);
    const modeCards = createModeCardSelector();
    switchBlock.appendChild(modeCards.container);
    section.appendChild(switchBlock);
    (async () => {
      const mode = await getBackgroundOpenMode();
      const enabled = await getFloatBallEnabled();
      const fixed2 = await getFloatBallFixed();
      const allowed2 = await getAllowedModes();
      setSegmentedValue(segmentedControl, mode);
      setToggleVisual(showRow.toggle, enabled);
      setToggleVisual(fixedRow.toggle, fixed2);
      setModeCardsValue(modeCards, allowed2);
    })();
    return section;
  }
  function createInfoBox(text) {
    const box = document.createElement("div");
    box.className = "dnt-info-box";
    const icon = document.createElement("span");
    icon.className = "dnt-info-icon";
    icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>`;
    box.appendChild(icon);
    const textEl = document.createElement("span");
    textEl.className = "dnt-info-text";
    textEl.textContent = text;
    box.appendChild(textEl);
    return box;
  }
  function createSegmentedControl() {
    const container = document.createElement("div");
    container.className = "dnt-segmented-control";
    container.setAttribute("role", "radiogroup");
    container.setAttribute("aria-label", t("settings.openMode.selectLabel"));
    const modes = ["none", "topic", "all"];
    modes.forEach((mode, index) => {
      const button = document.createElement("button");
      button.className = "dnt-segment-btn";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");
      button.setAttribute("data-mode", mode);
      const label = document.createElement("span");
      label.className = "dnt-segment-label";
      label.textContent = t(`settings.openMode.options.${mode}`);
      button.appendChild(label);
      const desc = document.createElement("span");
      desc.className = "dnt-segment-desc";
      desc.textContent = t(`settings.openMode.optionDesc.${mode}`);
      button.appendChild(desc);
      button.addEventListener("click", async () => {
        await setBackgroundOpenMode(mode);
        await syncCurrentModeFromStorage();
        await logBgModeChange(mode, "settings");
        setSegmentedValue(container, mode);
      });
      container.appendChild(button);
    });
    return container;
  }
  function setSegmentedValue(container, mode) {
    const buttons = container.querySelectorAll(".dnt-segment-btn");
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-mode") === mode;
      if (isActive) {
        btn.classList.add("dnt-segment-active");
        btn.setAttribute("aria-checked", "true");
      } else {
        btn.classList.remove("dnt-segment-active");
        btn.setAttribute("aria-checked", "false");
      }
    });
  }
  function createToggleRow(label, description, initial, onChange) {
    const row = document.createElement("div");
    row.className = "dnt-toggle-row";
    const labelWrap = document.createElement("div");
    labelWrap.className = "dnt-toggle-label-wrap";
    const labelEl = document.createElement("div");
    labelEl.className = "dnt-toggle-label";
    labelEl.textContent = label;
    labelWrap.appendChild(labelEl);
    const descEl = document.createElement("div");
    descEl.className = "dnt-toggle-desc";
    descEl.textContent = description;
    labelWrap.appendChild(descEl);
    row.appendChild(labelWrap);
    const toggle = createToggle2(initial, onChange);
    row.appendChild(toggle);
    return { row, toggle };
  }
  function createToggle2(initial, onChange) {
    const toggle = document.createElement("div");
    toggle.className = `dnt-toggle ${initial ? "dnt-toggle-on" : "dnt-toggle-off"}`;
    toggle.setAttribute("role", "switch");
    toggle.setAttribute("aria-checked", initial ? "true" : "false");
    const track = document.createElement("div");
    track.className = "dnt-toggle-track";
    const thumb = document.createElement("div");
    thumb.className = "dnt-toggle-thumb";
    track.appendChild(thumb);
    toggle.appendChild(track);
    toggle.addEventListener("click", async () => {
      const current = toggle.classList.contains("dnt-toggle-on");
      const next = !current;
      await onChange(next);
      setToggleVisual(toggle, next);
    });
    return toggle;
  }
  function setToggleVisual(el, on) {
    el.classList.remove("dnt-toggle-on", "dnt-toggle-off");
    el.classList.add(on ? "dnt-toggle-on" : "dnt-toggle-off");
    el.setAttribute("aria-checked", on ? "true" : "false");
  }
  function createModeCardSelector() {
    const container = document.createElement("div");
    container.className = "dnt-mode-cards";
    container.setAttribute("role", "group");
    container.setAttribute("aria-label", t("settings.openMode.floatball.modes"));
    const modes = ["none", "topic", "all"];
    const cards = [];
    modes.forEach((mode) => {
      const card = document.createElement("label");
      card.className = "dnt-mode-card";
      card.setAttribute("data-mode", mode);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "dnt-mode-card-checkbox";
      checkbox.setAttribute("data-mode", mode);
      card.appendChild(checkbox);
      const content = document.createElement("div");
      content.className = "dnt-mode-card-content";
      const icon = document.createElement("div");
      icon.className = "dnt-mode-card-icon";
      icon.innerHTML = getModeIcon(mode);
      content.appendChild(icon);
      const label = document.createElement("div");
      label.className = "dnt-mode-card-label";
      label.textContent = t(`settings.openMode.options.${mode}`);
      content.appendChild(label);
      const desc = document.createElement("div");
      desc.className = "dnt-mode-card-desc";
      desc.textContent = t(`settings.openMode.optionDesc.${mode}`);
      content.appendChild(desc);
      const checkmark = document.createElement("div");
      checkmark.className = "dnt-mode-card-checkmark";
      checkmark.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
      content.appendChild(checkmark);
      card.appendChild(content);
      container.appendChild(card);
      cards.push({ el: card, mode, checkbox });
    });
    const updateCards = async () => {
      const selected = cards.filter((c) => c.checkbox.checked);
      const count = selected.length;
      cards.forEach((c) => {
        const isLastTwo = count === 2 && c.checkbox.checked;
        if (isLastTwo) {
          c.el.classList.add("dnt-mode-card-min-required");
          c.el.title = t("settings.openMode.floatball.modesDesc");
        } else {
          c.el.classList.remove("dnt-mode-card-min-required");
          c.el.title = "";
        }
        if (c.checkbox.checked) {
          c.el.classList.add("dnt-mode-card-checked");
        } else {
          c.el.classList.remove("dnt-mode-card-checked");
        }
      });
      const allowedModes = {
        none: cards.find((c) => c.mode === "none").checkbox.checked,
        topic: cards.find((c) => c.mode === "topic").checkbox.checked,
        all: cards.find((c) => c.mode === "all").checkbox.checked
      };
      await setAllowedModes(allowedModes);
      await updateAllowedModes(allowedModes);
    };
    cards.forEach((c) => {
      c.checkbox.addEventListener("change", async (e) => {
        const selected = cards.filter((card) => card.checkbox.checked);
        if (!c.checkbox.checked && selected.length < 2) {
          c.checkbox.checked = true;
          e.preventDefault();
          return;
        }
        await updateCards();
      });
    });
    return { container, cards };
  }
  function setModeCardsValue(modeCards, allowed2) {
    modeCards.cards.forEach((c) => {
      c.checkbox.checked = allowed2[c.mode];
      if (c.checkbox.checked) {
        c.el.classList.add("dnt-mode-card-checked");
      } else {
        c.el.classList.remove("dnt-mode-card-checked");
      }
    });
    const selected = modeCards.cards.filter((c) => c.checkbox.checked);
    if (selected.length === 2) {
      selected.forEach((c) => {
        c.el.classList.add("dnt-mode-card-min-required");
        c.el.title = t("settings.openMode.floatball.modesDesc");
      });
    }
  }
  function getModeIcon(mode) {
    const icons = {
      none: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`,
      topic: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>`,
      all: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>`
    };
    return icons[mode];
  }
  var init_open = __esm({
    "src/ui/sections/open.ts"() {
      init_i18n();
      init_openMode();
      init_floatBall();
      init_floatball();
      init_logger();
    }
  });

  // src/ui/sections/debug.ts
  function renderDebugSection() {
    const section = document.createElement("div");
    section.className = "dnt-section";
    const title = document.createElement("h3");
    title.className = "dnt-section-title";
    title.textContent = t("settings.debug.title");
    section.appendChild(title);
    const content = document.createElement("div");
    content.className = "dnt-rules-content";
    const mainRow = document.createElement("div");
    mainRow.className = "dnt-rule-item";
    const mainLabel = document.createElement("label");
    mainLabel.className = "dnt-rule-label";
    mainLabel.textContent = t("settings.debug.enable");
    const mainToggle = createToggle3(false, async (on) => {
      await setDebugEnabled(on);
      detailsBlock.style.display = on ? "" : "none";
    });
    mainToggle.id = "dnt-debug-main-toggle";
    mainRow.appendChild(mainLabel);
    mainRow.appendChild(mainToggle);
    content.appendChild(mainRow);
    const detailsBlock = document.createElement("div");
    detailsBlock.style.marginTop = "8px";
    const opsRow = document.createElement("div");
    opsRow.className = "dnt-input-row";
    const allOn = document.createElement("button");
    allOn.className = "dnt-btn dnt-btn-secondary";
    allOn.textContent = t("settings.debug.allOn");
    allOn.addEventListener("click", async () => {
      await setAllDebugCategories(true);
      refreshDetailToggles(detailsBlock);
    });
    const allOff = document.createElement("button");
    allOff.className = "dnt-btn dnt-btn-secondary";
    allOff.textContent = t("settings.debug.allOff");
    allOff.addEventListener("click", async () => {
      await setAllDebugCategories(false);
      refreshDetailToggles(detailsBlock);
    });
    opsRow.appendChild(allOn);
    opsRow.appendChild(allOff);
    detailsBlock.appendChild(opsRow);
    const cats = [
      { key: "site", label: t("settings.debug.categories.site") },
      { key: "click", label: t("settings.debug.categories.click") },
      { key: "link", label: t("settings.debug.categories.link") },
      { key: "rules", label: t("settings.debug.categories.rules") },
      { key: "final", label: t("settings.debug.categories.final") },
      { key: "bg", label: t("settings.debug.categories.bg") }
    ];
    const listBlock = document.createElement("div");
    listBlock.className = "dnt-rule-group";
    cats.forEach((c) => {
      const row = document.createElement("div");
      row.className = "dnt-rule-item";
      const l = document.createElement("label");
      l.className = "dnt-rule-label";
      l.textContent = c.label;
      const toggle = createToggle3(true, async (on) => {
        await setDebugCategory(c.key, on);
      });
      toggle.setAttribute("data-debug-cat", c.key);
      row.appendChild(l);
      row.appendChild(toggle);
      listBlock.appendChild(row);
    });
    detailsBlock.appendChild(listBlock);
    content.appendChild(detailsBlock);
    (async () => {
      const on = await getDebugEnabled();
      setToggleVisual2(mainToggle, on);
      detailsBlock.style.display = on ? "" : "none";
      await refreshDetailToggles(detailsBlock);
    })();
    section.appendChild(content);
    return section;
  }
  async function refreshDetailToggles(container) {
    const cats = await getDebugCategories();
    container.querySelectorAll("[data-debug-cat]").forEach((el) => {
      const key = el.getAttribute("data-debug-cat");
      const on = cats[key] ?? true;
      setToggleVisual2(el, on);
    });
  }
  function createToggle3(initial, onChange) {
    const toggle = document.createElement("div");
    toggle.className = `dnt-toggle ${initial ? "dnt-toggle-on" : "dnt-toggle-off"}`;
    const track = document.createElement("div");
    track.className = "dnt-toggle-track";
    const thumb = document.createElement("div");
    thumb.className = "dnt-toggle-thumb";
    track.appendChild(thumb);
    toggle.appendChild(track);
    toggle.addEventListener("click", async () => {
      const current = toggle.classList.contains("dnt-toggle-on");
      const next = !current;
      await onChange(next);
      setToggleVisual2(toggle, next);
    });
    return toggle;
  }
  function setToggleVisual2(el, on) {
    el.classList.remove("dnt-toggle-on", "dnt-toggle-off");
    el.classList.add(on ? "dnt-toggle-on" : "dnt-toggle-off");
  }
  var init_debug = __esm({
    "src/ui/sections/debug.ts"() {
      init_i18n();
      init_settings();
    }
  });

  // src/ui/panel.ts
  function createSettingsPanel() {
    const overlay = document.createElement("div");
    overlay.id = "dnt-settings-overlay";
    overlay.className = "dnt-overlay";
    const dialog = document.createElement("div");
    dialog.className = "dnt-dialog";
    const header = createHeader();
    dialog.appendChild(header);
    const body = document.createElement("div");
    body.className = "dnt-body";
    const sidebar = createSidebar();
    body.appendChild(sidebar);
    const contentArea = document.createElement("div");
    contentArea.className = "dnt-content-area";
    contentArea.id = "dnt-content-area";
    const defaultRenderer = categoryRenderers["recognition"];
    if (defaultRenderer) {
      contentArea.appendChild(defaultRenderer());
    }
    body.appendChild(contentArea);
    dialog.appendChild(body);
    overlay.appendChild(dialog);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeSettings();
      }
    });
    return overlay;
  }
  function createHeader() {
    const header = document.createElement("div");
    header.className = "dnt-header";
    const title = document.createElement("h2");
    title.className = "dnt-title";
    title.textContent = t("settings.title");
    header.appendChild(title);
    const controls = document.createElement("div");
    controls.className = "dnt-controls";
    const themeBtn = document.createElement("button");
    themeBtn.className = "dnt-icon-btn";
    themeBtn.title = t(`settings.theme.${getTheme()}`);
    themeBtn.innerHTML = ThemeIcon[getTheme()];
    themeBtn.addEventListener("click", () => {
      toggleTheme();
      themeBtn.innerHTML = ThemeIcon[getTheme()];
      themeBtn.title = t(`settings.theme.${getTheme()}`);
    });
    controls.appendChild(themeBtn);
    const langBtn = document.createElement("button");
    langBtn.className = "dnt-icon-btn";
    langBtn.title = t(`settings.language.${getLanguage()}`);
    langBtn.innerHTML = LanguageIcon[getLanguage()];
    langBtn.addEventListener("click", () => {
      toggleLanguage();
      langBtn.innerHTML = LanguageIcon[getLanguage()];
      closeSettings();
      Promise.resolve().then(() => (init_settings3(), settings_exports)).then(({ openSettings: openSettings2 }) => openSettings2());
    });
    controls.appendChild(langBtn);
    const closeBtn = document.createElement("button");
    closeBtn.className = "dnt-icon-btn";
    closeBtn.title = t("settings.close");
    closeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`;
    closeBtn.addEventListener("click", closeSettings);
    controls.appendChild(closeBtn);
    header.appendChild(controls);
    return header;
  }
  function createSidebar() {
    const sidebar = document.createElement("div");
    sidebar.className = "dnt-sidebar";
    CATEGORIES.forEach((category, index) => {
      const btn = document.createElement("button");
      btn.className = "dnt-category-btn";
      btn.setAttribute("data-category", category.id);
      if (index === 0) {
        btn.classList.add("dnt-category-active");
      }
      const icon = document.createElement("span");
      icon.className = "dnt-category-icon";
      icon.innerHTML = category.icon;
      btn.appendChild(icon);
      const label = document.createElement("span");
      label.className = "dnt-category-label";
      label.textContent = t(category.labelKey);
      btn.appendChild(label);
      btn.addEventListener("click", () => {
        switchCategory(category.id);
      });
      sidebar.appendChild(btn);
    });
    return sidebar;
  }
  function switchCategory(categoryId) {
    const buttons = document.querySelectorAll(".dnt-category-btn");
    buttons.forEach((btn) => {
      if (btn.getAttribute("data-category") === categoryId) {
        btn.classList.add("dnt-category-active");
      } else {
        btn.classList.remove("dnt-category-active");
      }
    });
    const contentArea = document.getElementById("dnt-content-area");
    if (contentArea) {
      contentArea.innerHTML = "";
      const renderer = categoryRenderers[categoryId];
      if (renderer) {
        contentArea.appendChild(renderer());
      }
    }
  }
  var categoryRenderers;
  var init_panel = __esm({
    "src/ui/panel.ts"() {
      init_settings3();
      init_theme();
      init_i18n();
      init_i18n();
      init_categories();
      init_recognition();
      init_rules();
      init_open();
      init_debug();
      categoryRenderers = {
        recognition: renderRecognitionCategory,
        rules: renderRulesSection,
        open: renderOpenSection,
        debug: renderDebugSection
      };
    }
  });

  // src/ui/styles.css
  var styles_default;
  var init_styles = __esm({
    "src/ui/styles.css"() {
      styles_default = `/* \u8BBE\u7F6E\u754C\u9762\u6837\u5F0F - \u7B80\u7EA6\u8BBE\u8BA1 */\r
\r
/* CSS\u53D8\u91CF - \u65E5\u95F4\u4E3B\u9898 */\r
:root[data-dnt-theme="light"] {\r
  --dnt-bg-overlay: rgba(0, 0, 0, 0.5);\r
  --dnt-bg-dialog: #ffffff;\r
  --dnt-bg-section: #f8f9fa;\r
  --dnt-bg-input: #ffffff;\r
  --dnt-bg-hover: #f0f0f0;\r
\r
  --dnt-text-primary: #2c3e50;\r
  --dnt-text-secondary: #6c757d;\r
  --dnt-text-muted: #999999;\r
\r
  --dnt-border: #e1e4e8;\r
  --dnt-border-focus: #67c23a;\r
\r
  --dnt-primary: #67c23a;\r
  --dnt-primary-hover: #85ce61;\r
  --dnt-danger: #f56c6c;\r
  --dnt-danger-hover: #f78989;\r
\r
  --dnt-badge-auto: #409eff;\r
  --dnt-badge-whitelist: #67c23a;\r
  --dnt-badge-blacklist: #f56c6c;\r
  --dnt-badge-disabled: #909399;\r
\r
  --dnt-toggle-on: #67c23a;\r
  --dnt-toggle-off: #dcdfe6;\r
  --dnt-toggle-thumb: #ffffff;\r
\r
  --dnt-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);\r
}\r
\r
/* CSS\u53D8\u91CF - \u591C\u95F4\u4E3B\u9898 */\r
:root[data-dnt-theme="dark"] {\r
  --dnt-bg-overlay: rgba(0, 0, 0, 0.7);\r
  --dnt-bg-dialog: #1e1e1e;\r
  --dnt-bg-section: #2a2a2a;\r
  --dnt-bg-input: #363636;\r
  --dnt-bg-hover: #3a3a3a;\r
\r
  --dnt-text-primary: #e4e4e4;\r
  --dnt-text-secondary: #b0b0b0;\r
  --dnt-text-muted: #888888;\r
\r
  --dnt-border: #404040;\r
  --dnt-border-focus: #4a9e2a;\r
\r
  --dnt-primary: #4a9e2a;\r
  --dnt-primary-hover: #5fb83a;\r
  --dnt-danger: #d85a5a;\r
  --dnt-danger-hover: #e67272;\r
\r
  --dnt-badge-auto: #3b7fb8;\r
  --dnt-badge-whitelist: #4a9e2a;\r
  --dnt-badge-blacklist: #d85a5a;\r
  --dnt-badge-disabled: #909399;\r
\r
  --dnt-toggle-on: #4a9e2a;\r
  --dnt-toggle-off: #4a4a4a;\r
  --dnt-toggle-thumb: #ffffff;\r
\r
  --dnt-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);\r
}\r
\r
/* \u91CD\u7F6E\u6837\u5F0F */\r
.dnt-overlay *,\r
.dnt-overlay *::before,\r
.dnt-overlay *::after {\r
  box-sizing: border-box;\r
  margin: 0;\r
  padding: 0;\r
}\r
\r
/* \u906E\u7F69\u5C42 */\r
.dnt-overlay {\r
  position: fixed;\r
  top: 0;\r
  left: 0;\r
  right: 0;\r
  bottom: 0;\r
  background: var(--dnt-bg-overlay);\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  z-index: 999999;\r
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\r
  font-size: 14px;\r
  line-height: 1.6;\r
}\r
\r
/* \u5BF9\u8BDD\u6846 */\r
.dnt-dialog {\r
  background: var(--dnt-bg-dialog);\r
  border-radius: 8px;\r
  box-shadow: var(--dnt-shadow);\r
  width: 90%;\r
  max-width: 920px;\r
  height: 85vh;\r
  max-height: 680px;\r
  display: flex;\r
  flex-direction: column;\r
  overflow: hidden;\r
}\r
\r
/* \u5934\u90E8 */\r
.dnt-header {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  padding: 20px 24px;\r
  border-bottom: 1px solid var(--dnt-border);\r
}\r
\r
.dnt-title {\r
  font-size: 20px;\r
  font-weight: 600;\r
  color: var(--dnt-text-primary);\r
}\r
\r
.dnt-controls {\r
  display: flex;\r
  gap: 8px;\r
}\r
\r
.dnt-icon-btn {\r
  width: 36px;\r
  height: 36px;\r
  border: none;\r
  background: transparent;\r
  color: var(--dnt-text-secondary);\r
  cursor: pointer;\r
  border-radius: 4px;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  transition: all 0.2s;\r
}\r
\r
.dnt-icon-btn:hover {\r
  background: var(--dnt-bg-hover);\r
  color: var(--dnt-text-primary);\r
}\r
\r
/* \u4E3B\u4F53\u533A\u57DF - \u5DE6\u53F3\u5206\u680F */\r
.dnt-body {\r
  flex: 1;\r
  display: flex;\r
  overflow: hidden;\r
  min-height: 0;\r
}\r
\r
/* \u5DE6\u4FA7\u5BFC\u822A\u680F */\r
.dnt-sidebar {\r
  width: 160px;\r
  flex-shrink: 0;\r
  background: var(--dnt-bg-section);\r
  border-right: 1px solid var(--dnt-border);\r
  display: flex;\r
  flex-direction: column;\r
  padding: 12px 0;\r
  overflow-y: auto;\r
}\r
\r
.dnt-sidebar::-webkit-scrollbar {\r
  width: 4px;\r
}\r
\r
.dnt-sidebar::-webkit-scrollbar-thumb {\r
  background: var(--dnt-border);\r
  border-radius: 2px;\r
}\r
\r
/* \u5206\u7C7B\u6309\u94AE */\r
.dnt-category-btn {\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
  padding: 12px 16px;\r
  border: none;\r
  background: transparent;\r
  color: var(--dnt-text-secondary);\r
  cursor: pointer;\r
  font-size: 14px;\r
  text-align: left;\r
  transition: all 0.2s;\r
  border-left: 3px solid transparent;\r
}\r
\r
.dnt-category-btn:hover {\r
  background: var(--dnt-bg-hover);\r
  color: var(--dnt-text-primary);\r
}\r
\r
.dnt-category-active {\r
  background: var(--dnt-bg-dialog);\r
  color: var(--dnt-primary);\r
  border-left-color: var(--dnt-primary);\r
  font-weight: 600;\r
}\r
\r
.dnt-category-icon {\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  flex-shrink: 0;\r
}\r
\r
.dnt-category-label {\r
  flex: 1;\r
}\r
\r
/* \u53F3\u4FA7\u5185\u5BB9\u533A\u57DF */\r
.dnt-content-area {\r
  flex: 1;\r
  overflow-y: auto;\r
  padding: 20px 24px;\r
  min-width: 0;\r
}\r
\r
.dnt-content-area::-webkit-scrollbar {\r
  width: 8px;\r
}\r
\r
.dnt-content-area::-webkit-scrollbar-track {\r
  background: transparent;\r
}\r
\r
.dnt-content-area::-webkit-scrollbar-thumb {\r
  background: var(--dnt-border);\r
  border-radius: 4px;\r
}\r
\r
.dnt-content-area::-webkit-scrollbar-thumb:hover {\r
  background: var(--dnt-text-muted);\r
}\r
\r
/* \u5206\u7C7B\u5185\u5BB9\u5BB9\u5668 */\r
.dnt-category-content {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 24px;\r
}\r
\r
/* \u5185\u5BB9\u533A(\u65E7\u7248,\u4FDD\u7559\u517C\u5BB9) */\r
.dnt-content {\r
  flex: 1;\r
  overflow-y: auto;\r
  padding: 20px 24px;\r
}\r
\r
.dnt-content::-webkit-scrollbar {\r
  width: 8px;\r
}\r
\r
.dnt-content::-webkit-scrollbar-track {\r
  background: transparent;\r
}\r
\r
.dnt-content::-webkit-scrollbar-thumb {\r
  background: var(--dnt-border);\r
  border-radius: 4px;\r
}\r
\r
.dnt-content::-webkit-scrollbar-thumb:hover {\r
  background: var(--dnt-text-muted);\r
}\r
\r
/* \u533A\u5757 */\r
.dnt-section {\r
  margin-bottom: 24px;\r
}\r
\r
.dnt-section:last-child {\r
  margin-bottom: 0;\r
}\r
\r
.dnt-section-title {\r
  font-size: 16px;\r
  font-weight: 600;\r
  color: var(--dnt-text-primary);\r
  margin-bottom: 12px;\r
  padding-bottom: 8px;\r
  border-bottom: 2px solid var(--dnt-primary);\r
}\r
\r
/* \u72B6\u6001\u533A\u57DF */\r
.dnt-status-content {\r
  background: var(--dnt-bg-section);\r
  border-radius: 6px;\r
  padding: 16px;\r
}\r
\r
.dnt-status-row {\r
  display: flex;\r
  align-items: center;\r
  gap: 12px;\r
  margin-bottom: 8px;\r
}\r
\r
.dnt-status-row:last-child {\r
  margin-bottom: 0;\r
}\r
\r
.dnt-status-label {\r
  color: var(--dnt-text-primary);\r
  font-weight: 500;\r
}\r
\r
.dnt-status-value {\r
  color: var(--dnt-text-secondary);\r
}\r
\r
.dnt-domain-text {\r
  font-family: "Consolas", "Monaco", monospace;\r
  font-size: 13px;\r
}\r
\r
/* \u5FBD\u7AE0 */\r
.dnt-badge {\r
  display: inline-block;\r
  padding: 2px 10px;\r
  border-radius: 12px;\r
  font-size: 12px;\r
  font-weight: 500;\r
  color: #ffffff;\r
}\r
\r
.dnt-badge-auto {\r
  background: var(--dnt-badge-auto);\r
}\r
\r
.dnt-badge-whitelist {\r
  background: var(--dnt-badge-whitelist);\r
}\r
\r
.dnt-badge-blacklist {\r
  background: var(--dnt-badge-blacklist);\r
}\r
\r
.dnt-badge-disabled {\r
  background: var(--dnt-badge-disabled);\r
}\r
\r
/* \u57DF\u540D\u7BA1\u7406\u533A\u57DF */\r
.dnt-domain-content {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 20px;\r
}\r
\r
.dnt-list-block {\r
  background: var(--dnt-bg-section);\r
  border-radius: 6px;\r
  padding: 16px;\r
}\r
\r
.dnt-list-subtitle {\r
  font-size: 14px;\r
  font-weight: 600;\r
  color: var(--dnt-text-primary);\r
  margin-bottom: 12px;\r
}\r
\r
.dnt-domain-list {\r
  margin-bottom: 12px;\r
  min-height: 40px;\r
  max-height: 180px;\r
  overflow-y: auto;\r
}\r
\r
.dnt-domain-list::-webkit-scrollbar {\r
  width: 6px;\r
}\r
\r
.dnt-domain-list::-webkit-scrollbar-thumb {\r
  background: var(--dnt-border);\r
  border-radius: 3px;\r
}\r
\r
.dnt-domain-item {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  padding: 8px 12px;\r
  background: var(--dnt-bg-input);\r
  border: 1px solid var(--dnt-border);\r
  border-radius: 4px;\r
  margin-bottom: 8px;\r
}\r
\r
.dnt-domain-item:last-child {\r
  margin-bottom: 0;\r
}\r
\r
.dnt-empty-text {\r
  color: var(--dnt-text-muted);\r
  font-size: 13px;\r
  text-align: center;\r
  padding: 20px;\r
}\r
\r
/* \u8F93\u5165\u6846 */\r
.dnt-input-row {\r
  display: flex;\r
  gap: 8px;\r
  margin-bottom: 8px;\r
}\r
\r
.dnt-input {\r
  flex: 1;\r
  padding: 8px 12px;\r
  border: 1px solid var(--dnt-border);\r
  border-radius: 4px;\r
  background: var(--dnt-bg-input);\r
  color: var(--dnt-text-primary);\r
  font-size: 14px;\r
  outline: none;\r
  transition: border-color 0.2s;\r
}\r
\r
.dnt-input:focus {\r
  border-color: var(--dnt-border-focus);\r
}\r
\r
.dnt-input::placeholder {\r
  color: var(--dnt-text-muted);\r
}\r
\r
/* \u6309\u94AE */\r
.dnt-btn {\r
  padding: 8px 16px;\r
  border: none;\r
  border-radius: 4px;\r
  font-size: 14px;\r
  font-weight: 500;\r
  cursor: pointer;\r
  transition: all 0.2s;\r
  outline: none;\r
}\r
\r
.dnt-btn-primary {\r
  background: var(--dnt-primary);\r
  color: #ffffff;\r
}\r
\r
.dnt-btn-primary:hover {\r
  background: var(--dnt-primary-hover);\r
}\r
\r
.dnt-btn-secondary {\r
  background: var(--dnt-bg-input);\r
  color: var(--dnt-text-primary);\r
  border: 1px solid var(--dnt-border);\r
  width: 100%;\r
}\r
\r
.dnt-btn-secondary:hover {\r
  background: var(--dnt-bg-hover);\r
}\r
\r
.dnt-btn-danger {\r
  background: var(--dnt-danger);\r
  color: #ffffff;\r
}\r
\r
.dnt-btn-danger:hover {\r
  background: var(--dnt-danger-hover);\r
}\r
\r
.dnt-btn-sm {\r
  padding: 4px 12px;\r
  font-size: 13px;\r
}\r
\r
/* \u89C4\u5219\u533A\u57DF */\r
.dnt-rules-content {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 16px;\r
}\r
\r
.dnt-rule-group {\r
  background: var(--dnt-bg-section);\r
  border-radius: 6px;\r
  padding: 16px;\r
}\r
\r
.dnt-rule-group-title {\r
  font-size: 14px;\r
  font-weight: 600;\r
  color: var(--dnt-text-primary);\r
  margin-bottom: 12px;\r
}\r
\r
.dnt-rule-item {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  padding: 10px 0;\r
  border-bottom: 1px solid var(--dnt-border);\r
}\r
\r
.dnt-rule-item:last-child {\r
  border-bottom: none;\r
  padding-bottom: 0;\r
}\r
\r
.dnt-rule-label {\r
  color: var(--dnt-text-primary);\r
  font-size: 14px;\r
  flex: 1;\r
  cursor: default;\r
}\r
\r
/* \u5F00\u5173 */\r
.dnt-toggle {\r
  width: 44px;\r
  height: 24px;\r
  border-radius: 12px;\r
  cursor: pointer;\r
  position: relative;\r
  transition: background-color 0.3s;\r
}\r
\r
.dnt-toggle-on {\r
  background: var(--dnt-toggle-on);\r
}\r
\r
.dnt-toggle-off {\r
  background: var(--dnt-toggle-off);\r
}\r
\r
.dnt-toggle-track {\r
  width: 100%;\r
  height: 100%;\r
  position: relative;\r
}\r
\r
.dnt-toggle-thumb {\r
  width: 20px;\r
  height: 20px;\r
  border-radius: 50%;\r
  background: var(--dnt-toggle-thumb);\r
  position: absolute;\r
  top: 2px;\r
  transition: left 0.3s;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\r
}\r
\r
.dnt-toggle-on .dnt-toggle-thumb {\r
  left: 22px;\r
}\r
\r
.dnt-toggle-off .dnt-toggle-thumb {\r
  left: 2px;\r
}\r
\r
/* \u54CD\u5E94\u5F0F */\r
@media (max-width: 768px) {\r
  .dnt-dialog {\r
    width: 95%;\r
    height: 90vh;\r
    max-height: none;\r
  }\r
\r
  .dnt-header,\r
  .dnt-content,\r
  .dnt-content-area {\r
    padding: 16px;\r
  }\r
\r
  .dnt-title {\r
    font-size: 18px;\r
  }\r
\r
  /* \u5C0F\u5C4F\u5E55\u4E0B\u4FA7\u8FB9\u680F\u6536\u7A84 */\r
  .dnt-sidebar {\r
    width: 120px;\r
  }\r
\r
  .dnt-category-btn {\r
    padding: 10px 12px;\r
    font-size: 13px;\r
  }\r
}\r
\r
@media (max-width: 560px) {\r
  .dnt-dialog {\r
    width: 100%;\r
    height: 100vh;\r
    max-height: none;\r
    border-radius: 0;\r
  }\r
\r
  /* \u8D85\u5C0F\u5C4F\u5E55\u4E0B\u9690\u85CF\u56FE\u6807\u6587\u5B57 */\r
  .dnt-sidebar {\r
    width: 60px;\r
  }\r
\r
  .dnt-category-btn {\r
    padding: 12px;\r
    justify-content: center;\r
  }\r
\r
  .dnt-category-label {\r
    display: none;\r
  }\r
\r
  .dnt-content-area {\r
    padding: 12px;\r
  }\r
\r
  /* \u79FB\u52A8\u7AEF\u5361\u7247\u8C03\u6574 */\r
  .dnt-mode-cards {\r
    flex-direction: column;\r
  }\r
\r
  .dnt-mode-card {\r
    width: 100%;\r
  }\r
\r
  .dnt-segmented-control {\r
    flex-direction: column;\r
  }\r
\r
  .dnt-segment-btn {\r
    width: 100%;\r
  }\r
}\r
\r
/* ========== \u65B0\u589E: \u540E\u53F0\u6253\u5F00UI\u7EC4\u4EF6\u6837\u5F0F ========== */\r
\r
/* \u4FE1\u606F\u63D0\u793A\u6846 */\r
.dnt-info-box {\r
  display: flex;\r
  align-items: flex-start;\r
  gap: 10px;\r
  padding: 12px 14px;\r
  background: var(--dnt-bg-section);\r
  border-left: 3px solid var(--dnt-primary);\r
  border-radius: 4px;\r
  margin-bottom: 16px;\r
}\r
\r
.dnt-info-icon {\r
  flex-shrink: 0;\r
  color: var(--dnt-primary);\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  margin-top: 2px;\r
}\r
\r
.dnt-info-text {\r
  flex: 1;\r
  color: var(--dnt-text-secondary);\r
  font-size: 13px;\r
  line-height: 1.6;\r
}\r
\r
/* \u5206\u6BB5\u63A7\u5236\u5668 */\r
.dnt-segmented-control {\r
  display: flex;\r
  gap: 0;\r
  background: var(--dnt-bg-section);\r
  border: 1px solid var(--dnt-border);\r
  border-radius: 6px;\r
  padding: 4px;\r
  margin-top: 8px;\r
}\r
\r
.dnt-segment-btn {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  padding: 10px 16px;\r
  border: none;\r
  background: transparent;\r
  color: var(--dnt-text-secondary);\r
  cursor: pointer;\r
  border-radius: 4px;\r
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\r
  outline: none;\r
  min-height: 52px;\r
}\r
\r
.dnt-segment-btn:hover {\r
  background: var(--dnt-bg-hover);\r
  color: var(--dnt-text-primary);\r
}\r
\r
.dnt-segment-btn:focus-visible {\r
  box-shadow: 0 0 0 2px var(--dnt-border-focus);\r
}\r
\r
.dnt-segment-active {\r
  background: var(--dnt-primary) !important;\r
  color: #ffffff !important;\r
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\r
}\r
\r
.dnt-segment-label {\r
  font-size: 14px;\r
  font-weight: 600;\r
  margin-bottom: 2px;\r
}\r
\r
.dnt-segment-desc {\r
  font-size: 11px;\r
  opacity: 0.85;\r
}\r
\r
.dnt-segment-active .dnt-segment-desc {\r
  opacity: 0.95;\r
}\r
\r
/* \u5F00\u5173\u884C\uFF08\u5E26\u8BF4\u660E\u6587\u672C\uFF09 */\r
.dnt-toggle-row {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  padding: 12px 0;\r
  border-bottom: 1px solid var(--dnt-border);\r
}\r
\r
.dnt-toggle-row:last-child {\r
  border-bottom: none;\r
}\r
\r
.dnt-toggle-label-wrap {\r
  flex: 1;\r
  display: flex;\r
  flex-direction: column;\r
  gap: 4px;\r
}\r
\r
.dnt-toggle-label {\r
  color: var(--dnt-text-primary);\r
  font-size: 14px;\r
  font-weight: 500;\r
}\r
\r
.dnt-toggle-desc {\r
  color: var(--dnt-text-secondary);\r
  font-size: 12px;\r
}\r
\r
/* \u5B50\u6807\u9898 */\r
.dnt-subsection-label {\r
  color: var(--dnt-text-primary);\r
  font-size: 13px;\r
  font-weight: 600;\r
}\r
\r
.dnt-hint-text {\r
  color: var(--dnt-text-muted);\r
  font-size: 12px;\r
}\r
\r
/* \u6A21\u5F0F\u5361\u7247\u9009\u62E9\u5668 */\r
.dnt-mode-cards {\r
  display: flex;\r
  gap: 12px;\r
  flex-wrap: wrap;\r
}\r
\r
.dnt-mode-card {\r
  flex: 1;\r
  min-width: 140px;\r
  position: relative;\r
  cursor: pointer;\r
  display: block;\r
}\r
\r
.dnt-mode-card-checkbox {\r
  position: absolute;\r
  opacity: 0;\r
  pointer-events: none;\r
}\r
\r
.dnt-mode-card-content {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 8px;\r
  padding: 16px 12px;\r
  background: var(--dnt-bg-input);\r
  border: 2px solid var(--dnt-border);\r
  border-radius: 8px;\r
  transition: all 0.2s ease;\r
  position: relative;\r
}\r
\r
.dnt-mode-card:hover .dnt-mode-card-content {\r
  border-color: var(--dnt-primary);\r
  background: var(--dnt-bg-hover);\r
  transform: translateY(-2px);\r
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\r
}\r
\r
.dnt-mode-card-checked .dnt-mode-card-content {\r
  border-color: var(--dnt-primary);\r
  background: var(--dnt-bg-dialog);\r
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.15);\r
}\r
\r
.dnt-mode-card-icon {\r
  color: var(--dnt-text-secondary);\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  transition: color 0.2s ease;\r
}\r
\r
.dnt-mode-card-checked .dnt-mode-card-icon {\r
  color: var(--dnt-primary);\r
}\r
\r
.dnt-mode-card-label {\r
  font-size: 14px;\r
  font-weight: 600;\r
  color: var(--dnt-text-primary);\r
  text-align: center;\r
}\r
\r
.dnt-mode-card-desc {\r
  font-size: 11px;\r
  color: var(--dnt-text-secondary);\r
  text-align: center;\r
  line-height: 1.4;\r
}\r
\r
.dnt-mode-card-checkmark {\r
  position: absolute;\r
  top: 8px;\r
  right: 8px;\r
  color: var(--dnt-primary);\r
  opacity: 0;\r
  transform: scale(0.5);\r
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\r
}\r
\r
.dnt-mode-card-checked .dnt-mode-card-checkmark {\r
  opacity: 1;\r
  transform: scale(1);\r
}\r
\r
/* \u6700\u5C11\u9700\u8981\u4E24\u4E2A\u7684\u89C6\u89C9\u63D0\u793A */\r
.dnt-mode-card-min-required .dnt-mode-card-content {\r
  cursor: not-allowed;\r
  opacity: 0.8;\r
}\r
\r
.dnt-mode-card-min-required .dnt-mode-card-content::after {\r
  content: '';\r
  position: absolute;\r
  inset: -2px;\r
  border: 2px solid var(--dnt-primary);\r
  border-radius: 8px;\r
  pointer-events: none;\r
  animation: pulse-border 2s ease-in-out infinite;\r
}\r
\r
@keyframes pulse-border {\r
  0%, 100% {\r
    opacity: 0.3;\r
  }\r
  50% {\r
    opacity: 0.6;\r
  }\r
}\r
`;
    }
  });

  // src/ui/inject-styles.ts
  function injectStyles() {
    if (injected) return;
    const styleEl = document.createElement("style");
    styleEl.id = "dnt-settings-styles";
    styleEl.textContent = styles_default;
    document.head.appendChild(styleEl);
    injected = true;
  }
  var injected;
  var init_inject_styles = __esm({
    "src/ui/inject-styles.ts"() {
      init_styles();
      injected = false;
    }
  });

  // src/ui/settings.ts
  var settings_exports = {};
  __export(settings_exports, {
    closeSettings: () => closeSettings,
    openSettings: () => openSettings
  });
  async function openSettings() {
    injectStyles();
    await initTheme();
    await initI18n();
    const panel = createSettingsPanel();
    document.body.appendChild(panel);
  }
  function closeSettings() {
    const existing = document.getElementById("dnt-settings-overlay");
    if (existing) {
      existing.remove();
    }
  }
  var init_settings3 = __esm({
    "src/ui/settings.ts"() {
      init_panel();
      init_theme();
      init_i18n();
      init_inject_styles();
    }
  });

  // src/main.ts
  init_siteDetector();
  init_gm();
  init_domainLists();

  // src/decision/engine.ts
  init_settings2();
  init_logger();
  async function evaluateRules(rules, ctx) {
    let lastDecision = null;
    for (const rule of rules) {
      let match = null;
      match = rule.match(ctx);
      const enabled = await getRuleEnabled(rule.id);
      if (!match) {
        await logRuleDetail(rule, enabled, false, void 0, void 0);
        continue;
      }
      const action = enabled ? rule.enabledAction : rule.disabledAction;
      lastDecision = {
        action,
        ruleId: rule.id
      };
      await logRuleDetail(rule, enabled, true, action, match);
    }
    if (!lastDecision) {
      return { action: "keep_native", ruleId: "default" };
    }
    return lastDecision;
  }

  // src/rules/topic.ts
  init_url();
  init_settings2();
  var ruleTopicOpenNewTab = {
    id: RULE_TOPIC_OPEN_NEW_TAB,
    name: "\u4ECE\u4EFB\u610F\u9875\u9762\u6253\u5F00\u4E3B\u9898\u5E16\uFF1A\u65B0\u6807\u7B7E\u9875",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const tId = extractTopicId(ctx.targetUrl.pathname);
      if (tId == null) return null;
      return { matched: true, data: { targetTopicId: tId } };
    }
  };
  var ruleInTopicOpenOther = {
    id: RULE_TOPIC_IN_TOPIC_OPEN_OTHER,
    name: "\u4E3B\u9898\u5E16\u5185\u90E8\u70B9\u51FB\u5176\u4ED6\u94FE\u63A5\uFF1A\u65B0\u6807\u7B7E\u9875",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const currentTopicId = extractTopicId(ctx.currentUrl.pathname);
      if (currentTopicId == null) return null;
      const targetTopicId = extractTopicId(ctx.targetUrl.pathname);
      if (targetTopicId && targetTopicId === currentTopicId) return null;
      return { matched: true, data: { currentTopicId, targetTopicId: targetTopicId ?? null } };
    }
  };
  var ruleSameTopicKeepNative = {
    id: RULE_TOPIC_SAME_TOPIC_KEEP_NATIVE,
    name: "\u540C\u4E00\u4E3B\u9898\u5185\u697C\u5C42\u8DF3\u8F6C\uFF1A\u4FDD\u7559\u539F\u751F",
    enabledAction: "keep_native",
    disabledAction: "new_tab",
    match: (ctx) => {
      const currentTopicId = extractTopicId(ctx.currentUrl.pathname);
      const targetTopicId = extractTopicId(ctx.targetUrl.pathname);
      if (currentTopicId == null || targetTopicId == null) return null;
      if (currentTopicId !== targetTopicId) return null;
      return {
        matched: true,
        note: "\u540C\u4E00\u4E3B\u9898\u7F16\u53F7\uFF08\u5E38\u89C1\u4E3A\u697C\u5C42\u8DF3\u8F6C\uFF09",
        data: { currentTopicId, targetTopicId }
      };
    }
  };
  var topicRules = [
    // 越靠后优先级越高（规则 3 覆盖规则 1/2）
    ruleTopicOpenNewTab,
    ruleInTopicOpenOther,
    ruleSameTopicKeepNative
  ];

  // src/rules/user.ts
  init_url();
  init_settings2();
  var ruleUserOpenNewTab = {
    id: RULE_USER_OPEN_NEW_TAB,
    name: "\u4ECE\u4EFB\u610F\u9875\u9762\u6253\u5F00\u4E2A\u4EBA\u4E3B\u9875\uFF1A\u65B0\u6807\u7B7E\u9875",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const uname = extractUsername(ctx.targetUrl.pathname);
      if (!uname) return null;
      return { matched: true, data: { targetUser: uname } };
    }
  };
  var ruleInProfileOpenOther = {
    id: RULE_USER_IN_PROFILE_OPEN_OTHER,
    name: "\u4E2A\u4EBA\u4E3B\u9875\u5185\u90E8\u70B9\u51FB\u5176\u4ED6\u94FE\u63A5\uFF1A\u65B0\u6807\u7B7E\u9875",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const currentUser = extractUsername(ctx.currentUrl.pathname);
      if (!currentUser) return null;
      const targetUser = extractUsername(ctx.targetUrl.pathname);
      if (targetUser && targetUser === currentUser) return null;
      return { matched: true, data: { currentUser, targetUser: targetUser ?? null } };
    }
  };
  var ruleSameProfileKeepNative = {
    id: RULE_USER_SAME_PROFILE_KEEP_NATIVE,
    name: "\u540C\u4E00\u7528\u6237\u4E3B\u9875\uFF1A\u4FDD\u7559\u539F\u751F",
    enabledAction: "keep_native",
    disabledAction: "new_tab",
    match: (ctx) => {
      const currentUser = extractUsername(ctx.currentUrl.pathname);
      const targetUser = extractUsername(ctx.targetUrl.pathname);
      if (!currentUser || !targetUser) return null;
      if (currentUser !== targetUser) return null;
      return { matched: true, data: { currentUser, targetUser } };
    }
  };
  var userRules = [
    // 越靠后优先级越高（规则 3 覆盖规则 1/2）
    ruleUserOpenNewTab,
    ruleInProfileOpenOther,
    ruleSameProfileKeepNative
  ];

  // src/rules/attachment.ts
  init_url();
  init_settings2();
  var ruleAttachmentKeepNative = {
    id: RULE_ATTACHMENT_KEEP_NATIVE,
    name: "\u9644\u4EF6\u94FE\u63A5\uFF1A\u4FDD\u7559\u539F\u751F",
    enabledAction: "keep_native",
    disabledAction: "new_tab",
    match: (ctx) => {
      const p = ctx.targetUrl.pathname || "";
      if (!isLikelyAttachment(p)) return null;
      return { matched: true, data: { pathname: p } };
    }
  };
  var attachmentRules = [ruleAttachmentKeepNative];

  // src/rules/popup.ts
  init_settings2();

  // src/utils/dom.ts
  init_logger();
  function closestAny(el, selectors) {
    if (!el) return null;
    for (const sel of selectors) {
      const hit = el.closest?.(sel);
      if (hit) return hit;
    }
    return null;
  }
  var USER_CARD_SELECTORS = ["#user-card", ".user-card", ".user-card-container"];
  var USER_MENU_SELECTORS = [
    "#user-menu",
    ".user-menu",
    ".user-menu-panel",
    "#user-menu .quick-access-panel",
    ".user-menu .quick-access-panel",
    "#user-menu .menu-panel",
    ".user-menu .menu-panel"
  ];
  var HEADER_SELECTORS = ["header", ".d-header", "#site-header"];
  var USER_MENU_NAV_SELECTORS = [
    ".user-menu .navigation",
    '.user-menu [role="tablist"]',
    ".user-menu .menu-tabs",
    ".user-menu .categories",
    "#user-menu .navigation"
  ];
  function isInUserCard(el) {
    return !!closestAny(el, USER_CARD_SELECTORS);
  }
  function isInUserMenu(el) {
    return !!closestAny(el, USER_MENU_SELECTORS);
  }
  function isInHeader(el) {
    return !!closestAny(el, HEADER_SELECTORS);
  }
  function isInUserMenuNav(el) {
    return !!closestAny(el, USER_MENU_NAV_SELECTORS);
  }
  var SIDEBAR_SELECTORS = [
    "#sidebar",
    ".sidebar",
    ".d-sidebar",
    ".sidebar-container",
    ".discourse-sidebar",
    ".sidebar-section",
    ".sidebar-wrapper"
  ];
  function isInSidebar(el) {
    return !!closestAny(el, SIDEBAR_SELECTORS);
  }
  function isUserCardTrigger(a) {
    if (!a) return false;
    if (a.hasAttribute("data-user-card")) return true;
    const cls = (a.className || "").toString().toLowerCase();
    if (/user-card|avatar|trigger-user-card/.test(cls) && a.pathname?.toLowerCase?.().startsWith("/u/")) {
      return true;
    }
    return false;
  }
  function isUserMenuTrigger(a) {
    if (!a) return false;
    if (!isInHeader(a)) return false;
    if (a.hasAttribute("aria-haspopup") || a.hasAttribute("aria-expanded")) return true;
    const cls = (a.className || "").toString().toLowerCase();
    if (/current-user|header-dropdown-toggle|user-menu|avatar/.test(cls)) return true;
    return false;
  }
  function isActiveTab(a) {
    if (!a) return false;
    if (a.getAttribute("aria-selected") === "true") return true;
    const cls = (a.className || "").toString().toLowerCase();
    return /active|selected/.test(cls);
  }
  var SEARCH_MENU_SELECTORS = [
    "#search-menu",
    ".search-menu",
    ".header .search-menu",
    ".d-header .search-menu"
  ];
  var SEARCH_RESULTS_SELECTORS = [
    "#search-menu .results",
    ".search-menu .results",
    "#search-menu .search-results",
    ".search-menu .search-results",
    ".quick-access-panel .results",
    ".menu-panel .results",
    ".menu-panel .search-results"
  ];
  function isInSearchMenu(el) {
    return !!closestAny(el, SEARCH_MENU_SELECTORS);
  }
  function isInSearchResults(el) {
    if (!isInSearchMenu(el)) return false;
    return !!closestAny(el, SEARCH_RESULTS_SELECTORS);
  }
  function resolveSearchResultLink(a) {
    if (!a) return null;
    if (!isInSearchResults(a)) return null;
    const attrNames = ["data-url", "data-href", "data-link", "data-topic-url"];
    const readAttrs = (el) => {
      if (!el) return null;
      for (const k of attrNames) {
        const v = el.getAttribute?.(k);
        if (v) return v;
      }
      const topicId = el.getAttribute?.("data-topic-id") || el.getAttribute?.("data-topicid");
      if (topicId && /\d+/.test(topicId)) return `/t/${topicId}`;
      return null;
    };
    let node = a;
    for (let i = 0; i < 4 && node; i++) {
      const v = readAttrs(node);
      if (v) return v;
      node = node.parentElement;
    }
    const container = a.closest?.(".search-link, .search-result, .fps-result, li, article, .search-row") || a.parentElement;
    if (container) {
      const inner = container.querySelector?.("a[href]");
      if (inner && inner.getAttribute("href")) return inner.getAttribute("href");
      const v = readAttrs(container);
      if (v) return v;
    }
    return null;
  }
  function isChatHeaderTrigger(a) {
    if (!a) return false;
    if (!isInHeader(a)) return false;
    const li = a.closest?.("li");
    const cls = `${(a.className || "").toString()} ${(li?.className || "").toString()}`.toLowerCase();
    if (cls.includes("chat-header-icon")) return true;
    const hasIcon = !!a.querySelector?.(".d-icon-d-chat, .d-icon.d-icon-d-chat, svg.d-icon-d-chat");
    if (hasIcon) return true;
    const title = (a.getAttribute("title") || "").toLowerCase();
    if (/\bchat\b|聊天/.test(title)) return true;
    try {
      const href = a.getAttribute("href") || a.href || "";
      const url = new URL(href, location.href);
      if (url.pathname === "/chat" || url.pathname.startsWith("/chat/")) return true;
    } catch (err) {
      void logError("link", "\u89E3\u6790\u804A\u5929\u89E6\u53D1\u94FE\u63A5\u5931\u8D25", err);
    }
    return false;
  }
  function isChatLink(a) {
    if (!a) return false;
    try {
      const href = a.getAttribute("href") || a.href || "";
      const url = new URL(href, location.href);
      return url.pathname === "/chat" || url.pathname.startsWith("/chat/");
    } catch (err) {
      void logError("link", "\u89E3\u6790\u804A\u5929\u94FE\u63A5\u5931\u8D25", err);
      return false;
    }
  }

  // src/rules/popup.ts
  var ruleUserCardTriggerKeepNative = {
    id: RULE_POPUP_USER_CARD,
    name: "\u7528\u6237\u5361\u7247\uFF1A\u89E6\u53D1\u94FE\u63A5=\u4FDD\u7559\u539F\u751F",
    enabledAction: "keep_native",
    disabledAction: "keep_native",
    // 关闭时也保留原生
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (isUserCardTrigger(a) && !isInUserCard(a)) {
        return { matched: true, note: "\u7528\u6237\u5361\u7247\u89E6\u53D1\u94FE\u63A5" };
      }
      return null;
    }
  };
  var ruleUserCardInsideNewTab = {
    id: RULE_POPUP_USER_CARD,
    name: "\u7528\u6237\u5361\u7247\uFF1A\u5361\u7247\u5185\u94FE\u63A5=\u65B0\u6807\u7B7E",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (isInUserCard(a)) {
        return { matched: true, note: "\u7528\u6237\u5361\u7247\u5185\u94FE\u63A5" };
      }
      return null;
    }
  };
  var ruleUserMenuTriggerKeepNative = {
    id: RULE_POPUP_USER_MENU,
    name: "\u7528\u6237\u83DC\u5355\uFF1A\u89E6\u53D1\u94FE\u63A5=\u4FDD\u7559\u539F\u751F",
    enabledAction: "keep_native",
    disabledAction: "keep_native",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (isUserMenuTrigger(a) && !isInUserMenu(a)) {
        return { matched: true, note: "\u7528\u6237\u83DC\u5355\u89E6\u53D1\u94FE\u63A5" };
      }
      return null;
    }
  };
  var ruleUserMenuNavKeepOrNew = {
    id: RULE_POPUP_USER_MENU,
    name: "\u7528\u6237\u83DC\u5355\uFF1A\u5BFC\u822A\u533A\u70B9\u51FB\uFF08\u6FC0\u6D3B=\u65B0\u6807\u7B7E/\u672A\u6FC0\u6D3B=\u539F\u751F\uFF09",
    enabledAction: "keep_native",
    // 默认保留原生，下面在激活情况下用后置规则覆盖
    disabledAction: "keep_native",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (!isInUserMenu(a)) return null;
      if (!isInUserMenuNav(a)) return null;
      if (!isActiveTab(a)) {
        return { matched: true, note: "\u7528\u6237\u83DC\u5355\u5BFC\u822A\uFF08\u672A\u6FC0\u6D3B\uFF09" };
      }
      return null;
    }
  };
  var ruleUserMenuNavActiveNewTab = {
    id: RULE_POPUP_USER_MENU,
    name: "\u7528\u6237\u83DC\u5355\uFF1A\u5BFC\u822A\u533A\u6FC0\u6D3B\u9879=\u65B0\u6807\u7B7E",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (!isInUserMenu(a)) return null;
      if (!isInUserMenuNav(a)) return null;
      if (isActiveTab(a)) {
        return { matched: true, note: "\u7528\u6237\u83DC\u5355\u5BFC\u822A\uFF08\u6FC0\u6D3B\uFF09" };
      }
      return null;
    }
  };
  var ruleUserMenuContentNewTab = {
    id: RULE_POPUP_USER_MENU,
    name: "\u7528\u6237\u83DC\u5355\uFF1A\u5185\u5BB9\u533A\u94FE\u63A5=\u65B0\u6807\u7B7E",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (!isInUserMenu(a)) return null;
      if (isInUserMenuNav(a)) return null;
      return { matched: true, note: "\u7528\u6237\u83DC\u5355\u5185\u5BB9\u533A\u94FE\u63A5" };
    }
  };
  var ruleChatWindow = {
    id: RULE_POPUP_CHAT_WINDOW,
    name: "\u804A\u5929\u7A97\u53E3\u539F\u751F\u5F39\u7A97\u6253\u5F00",
    enabledAction: "keep_native",
    disabledAction: "new_tab",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (isChatHeaderTrigger(a) || isChatLink(a)) {
        return { matched: true, note: "\u804A\u5929\u5F39\u7A97/\u94FE\u63A5" };
      }
      return null;
    }
  };
  var popupRules = [
    // 用户卡片（触发→保留；卡片内→新标签）
    ruleUserCardTriggerKeepNative,
    ruleUserCardInsideNewTab,
    // 用户菜单（触发→保留；导航未激活→保留；导航激活→新标签；内容区→新标签）
    ruleUserMenuTriggerKeepNative,
    ruleUserMenuNavKeepOrNew,
    ruleUserMenuNavActiveNewTab,
    ruleUserMenuContentNewTab,
    // 聊天窗口（启用=保留原生；关闭=新标签页）
    ruleChatWindow,
    // 搜索弹窗（结果列表与底部“更多”按钮 → 新标签；其余保持原生）
    // 说明：搜索历史、建议项等（不在结果区内）一律不改写。
    {
      id: RULE_POPUP_SEARCH_MENU,
      name: "\u641C\u7D22\u5F39\u7A97\uFF1A\u7ED3\u679C\u4E0E\u201C\u66F4\u591A\u201D=\u65B0\u6807\u7B7E",
      enabledAction: "new_tab",
      disabledAction: "keep_native",
      match: (ctx) => {
        const a = ctx.anchor;
        if (!a) return null;
        if (!isInSearchResults(a)) return null;
        const p = ctx.targetUrl?.pathname || "";
        if (/\/t\//.test(p) || p.startsWith("/search")) {
          return { matched: true, note: "\u641C\u7D22\u5F39\u7A97\u7ED3\u679C\u6216\u66F4\u591A" };
        }
        return null;
      }
    }
  ];

  // src/rules/sidebar.ts
  init_url();
  init_settings2();
  var ruleSidebarNonTopicKeepNative = {
    id: RULE_SIDEBAR_NON_TOPIC_KEEP_NATIVE,
    name: "\u975E\u4E3B\u9898\u9875-\u4FA7\u8FB9\u680F\u94FE\u63A5\uFF1A\u4FDD\u7559\u539F\u751F",
    enabledAction: "keep_native",
    disabledAction: "new_tab",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (!isInSidebar(a)) return null;
      const currentTopicId = extractTopicId(ctx.currentUrl.pathname);
      if (currentTopicId != null) return null;
      return { matched: true, note: "\u975E\u4E3B\u9898\u9875\u7684\u4FA7\u8FB9\u680F\u94FE\u63A5" };
    }
  };
  var ruleSidebarInTopicNewTab = {
    id: RULE_SIDEBAR_IN_TOPIC_NEW_TAB,
    name: "\u4E3B\u9898\u9875-\u4FA7\u8FB9\u680F\u94FE\u63A5\uFF1A\u65B0\u6807\u7B7E\u9875",
    enabledAction: "new_tab",
    disabledAction: "keep_native",
    match: (ctx) => {
      const a = ctx.anchor;
      if (!a) return null;
      if (!isInSidebar(a)) return null;
      const currentTopicId = extractTopicId(ctx.currentUrl.pathname);
      if (currentTopicId == null) return null;
      return { matched: true, note: "\u4E3B\u9898\u9875\u5185\u7684\u4FA7\u8FB9\u680F\u94FE\u63A5", data: { currentTopicId } };
    }
  };
  var sidebarRules = [
    // 顺序与《需求文档》一致：非主题页→保留原生；主题页→新标签
    ruleSidebarNonTopicKeepNative,
    ruleSidebarInTopicNewTab
  ];

  // src/rules/index.ts
  function getAllRules() {
    return [
      ...topicRules,
      ...userRules,
      ...attachmentRules,
      ...popupRules,
      ...sidebarRules
    ];
  }

  // src/listeners/click.ts
  init_url();
  init_logger();
  init_openMode();

  // src/utils/open.ts
  init_logger();
  function openNewTabForeground(url) {
    try {
      window.open(url, "_blank", "noopener");
    } catch (err) {
      void logError("final", "window.open \u5931\u8D25\uFF0C\u964D\u7EA7\u4E3A location.href", err);
      try {
        location.href = url;
      } catch (e2) {
        void logError("final", "location.href \u8DF3\u8F6C\u5931\u8D25", e2);
      }
    }
  }
  function openNewTabBackground(url) {
    try {
      const GM = globalThis.GM;
      if (GM?.openInTab) {
        GM.openInTab(url, { active: false, setParent: true });
        return;
      }
    } catch (err) {
      void logError("final", "GM.openInTab \u8C03\u7528\u5931\u8D25", err);
    }
    try {
      const gmo = globalThis.GM_openInTab;
      if (typeof gmo === "function") {
        gmo(url, { active: false, setParent: true });
        return;
      }
    } catch (err) {
      void logError("final", "GM_openInTab \u8C03\u7528\u5931\u8D25", err);
    }
    openNewTabForeground(url);
  }

  // src/listeners/click.ts
  init_url();
  function isPlainLeftClick(ev) {
    return ev.button === 0 && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey && !ev.altKey;
  }
  function findAnchor(el) {
    let node = el;
    while (node) {
      const elem = node;
      if (elem && elem.tagName === "A") return elem;
      node = elem && elem.parentElement ? elem.parentElement : null;
    }
    return null;
  }
  function resolveTopicAnchorFromBlankClick(target) {
    const el = target;
    if (!el) return null;
    const row = el.closest?.("tr.topic-list-item, .topic-list-item");
    if (!row) return null;
    const titleCell = el.closest?.("td.main-link, .main-link") || row.querySelector?.("td.main-link, .main-link");
    if (!titleCell) return null;
    const titleLine = el.closest?.(".link-top-line") || titleCell.querySelector?.(".link-top-line");
    const isPointer = (node) => {
      if (!node) return false;
      try {
        return getComputedStyle(node).cursor === "pointer";
      } catch {
        return false;
      }
    };
    const clickable = isPointer(el) || isPointer(titleLine) || isPointer(titleCell) || isPointer(row);
    if (!clickable) return null;
    const a = titleCell.querySelector?.("a.raw-topic-link, a.raw-link.raw-topic-link") || row.querySelector?.("a.raw-topic-link, a.raw-link.raw-topic-link");
    if (!a) return null;
    const visible = !!(a.offsetParent || (a.getClientRects?.().length ?? 0) > 0);
    if (!visible) return null;
    return a;
  }
  function attachClickListener(label = "[discourse-new-tab]") {
    const handler = async (ev) => {
      try {
        if (!isPlainLeftClick(ev)) {
          await logClickFilter("\u975E\u5DE6\u952E\u6216\u7EC4\u5408\u952E\u70B9\u51FB");
          return;
        }
        let a = findAnchor(ev.target);
        if (!a) {
          const inferred = resolveTopicAnchorFromBlankClick(ev.target);
          if (inferred) {
            a = inferred;
            await logClickNote("\u7A7A\u767D\u6807\u9898\u533A\u57DF\u70B9\u51FB\uFF1A\u63A8\u65AD\u4E3A\u4E3B\u9898\u94FE\u63A5");
          } else {
            await logClickFilter("\u672A\u627E\u5230 <a> \u5143\u7D20");
            return;
          }
        }
        let rawHref = a.getAttribute("href") || a.href || "";
        if (!rawHref || rawHref === "#") {
          if (isInSearchResults(a)) {
            const fallback = resolveSearchResultLink(a);
            if (fallback) rawHref = fallback;
          }
        }
        if (!rawHref) {
          await logClickFilter("\u94FE\u63A5\u65E0 href");
          return;
        }
        if (a.hasAttribute("download")) {
          await logClickFilter("\u4E0B\u8F7D\u94FE\u63A5");
          return;
        }
        if (a.getAttribute("data-dnt-ignore") === "1") {
          await logClickFilter("\u663E\u5F0F\u5FFD\u7565\u6807\u8BB0 data-dnt-ignore=1");
          return;
        }
        const targetUrl = toAbsoluteUrl(rawHref, location.href);
        if (!targetUrl) {
          await logClickFilter("\u76EE\u6807 URL \u89E3\u6790\u5931\u8D25");
          return;
        }
        const ctx = { anchor: a, targetUrl, currentUrl: new URL(location.href) };
        await logLinkInfo(ctx);
        const decision = await evaluateRules(getAllRules(), ctx);
        if (decision.action === "new_tab") {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          try {
            const mode = await getBackgroundOpenMode();
            const isTopic = extractTopicId(targetUrl.pathname) != null;
            const useBg = mode === "all" || mode === "topic" && isTopic;
            if (useBg) {
              openNewTabBackground(targetUrl.href);
              a.setAttribute("data-dnt-handled", "1");
              await logFinalDecision(decision.ruleId, decision.action);
              await logBackgroundOpenApplied(mode === "all" ? "all" : "topic");
              return;
            }
          } catch (err) {
            await logError("click", "\u8BFB\u53D6\u540E\u53F0\u6253\u5F00\u8BBE\u7F6E\u5931\u8D25\uFF0C\u964D\u7EA7\u4E3A\u524D\u53F0", err);
          }
          openNewTabForeground(targetUrl.href);
          a.setAttribute("data-dnt-handled", "1");
          await logFinalDecision(decision.ruleId, decision.action);
          return;
        } else if (decision.action === "same_tab") {
          await logFinalDecision(decision.ruleId, decision.action);
        } else {
          await logFinalDecision(decision.ruleId, decision.action);
        }
      } catch (err) {
        await logError("click", "\u70B9\u51FB\u5904\u7406\u5F02\u5E38", err);
      }
    };
    document.addEventListener("click", handler, true);
  }

  // src/main.ts
  init_logger();
  (async () => {
    const label = "[discourse-new-tab]";
    const isTop = (() => {
      try {
        return window.top === window;
      } catch (err) {
        void logError("site", "window.top \u8BBF\u95EE\u5F02\u5E38\uFF0C\u6309\u9876\u5C42\u5904\u7406", err);
        return true;
      }
    })();
    if (!isTop) return;
    const result = detectDiscourse();
    await logSiteDetection(result);
    const host = getCurrentHostname();
    const enable = await getEnablement(result.isDiscourse, host);
    if (enable.enabled) {
      attachClickListener(label);
      try {
        const { initFloatBall: initFloatBall2 } = await Promise.resolve().then(() => (init_floatball(), floatball_exports));
        await initFloatBall2();
      } catch (err) {
        void logError("bg", "\u60AC\u6D6E\u7403\u521D\u59CB\u5316\u5931\u8D25", err);
      }
    }
    gmRegisterMenu("\u8BBE\u7F6E", async () => {
      const { openSettings: openSettings2 } = await Promise.resolve().then(() => (init_settings3(), settings_exports));
      await openSettings2();
    });
  })();
})();
