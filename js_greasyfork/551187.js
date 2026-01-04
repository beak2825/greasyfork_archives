// ==UserScript==
// @name         TamperGram
// @namespace    https://greasyfork.org/ru/scripts/551187-tampergram
// @version      0.1
// @description  Telegram multi-channel reader with folders, unread counters and discussions
// @author       TesterTV
// @homepageURL  https://github.com/testertv/TamperGram
// @license      GPL v.3 or any later version.
// @match        file:///*TamperGram.html
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @connect      t.me
// @downloadURL https://update.greasyfork.org/scripts/551187/TamperGram.user.js
// @updateURL https://update.greasyfork.org/scripts/551187/TamperGram.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  // ===== Bootstrap, Constants & Defaults =====
  const ALL = "All";
  const EXISTS_TTL = 5 * 60 * 1000;
  const PROBE_START = 200;
  const BISECT_DELAY_MS = 60;
  const EXP_DELAY_MS = 100;
  const LOAD_UP_TRIGGER_PX = 350;
  const NEAR_BOTTOM_PX = 150;
  const META_TTL_MS = 60 * 60 * 1000;
  const POST_WIDTH_PX = 560;
  const CFG_KEY = "tg_cfg";

  // One concurrency knob for all network pools
  const NET_CONCURRENCY = 3;

  document.body.replaceChildren();

  const DEF_SETTINGS = {
    initialCount: 12,
    olderBatch: 5,
    darkTheme: true,
    refreshSec: 60,
    titleBadge: true,
    loadDelayInitial: 300,
    loadDelayScroll: 150,
    pinStartAtBottom: true,
  };
  function normalizeSettings(s) {
    const st = { ...DEF_SETTINGS, ...(s || {}) };
    if (!("refreshSec" in st)) st.refreshSec = st.autoRefreshSec ?? st.bgPollSec ?? 60;
    delete st.autoRefreshSec;
    delete st.bgPollSec;
    return st;
  }
  let savedTabs, activeTab, allChannels, tabMap, mainTab, sidebarWidth, lastIndexMap, scrollState, lastSeenMap, settings, channelMeta, discussionWidth, activeChannelSlug;

  // ===== Config Normalize, Load, Snapshot & Save =====
  function normalizeCfg(c) {
    const cfg = { ...c };
    if (!Array.isArray(cfg.tabs)) cfg.tabs = [ALL];
    if (!cfg.tabs.includes(ALL)) cfg.tabs.unshift(ALL);
    cfg.tabs = [ALL, ...cfg.tabs.filter((t) => t !== ALL)];
    if (!Array.isArray(cfg.channels) || cfg.channels.length === 0) {
      cfg.channels = ["durov", "telegram", "bloomberg", "notcoin"];
    }
    if (!cfg.tabMap || typeof cfg.tabMap !== "object") cfg.tabMap = {};
    if (!cfg.tabs.includes(cfg.mainTab)) cfg.mainTab = ALL;
    cfg.activeTab = cfg.mainTab;
    cfg.sidebarWidth = Number.isFinite(+cfg.sidebarWidth) ? +cfg.sidebarWidth : 280;
    cfg.discussionWidth = Number.isFinite(+cfg.discussionWidth) ? +cfg.discussionWidth : 420;
    cfg.lastIndexMap = cfg.lastIndexMap || {};
    cfg.scrollState = cfg.scrollState || {};
    cfg.lastSeenMap = cfg.lastSeenMap || {};
    cfg.channelMeta = cfg.channelMeta || {};
    cfg.settings = normalizeSettings(cfg.settings);
    return cfg;
  }
  async function loadCfg() {
    let cfg = await GM.getValue(CFG_KEY, null);
    if (!cfg) {
      cfg = {
        tabs: [ALL],
        activeTab: ALL,
        channels: ["durov", "telegram", "bloomberg", "notcoin"],
        tabMap: {},
        mainTab: ALL,
        sidebarWidth: 280,
        discussionWidth: 420,
        lastIndexMap: {},
        scrollState: {},
        lastSeenMap: {},
        settings: { ...DEF_SETTINGS },
        activeChannel: null,
        channelMeta: {},
      };
      await GM.setValue(CFG_KEY, cfg);
    }
    cfg = normalizeCfg(cfg);
    savedTabs = cfg.tabs.slice();
    activeTab = cfg.activeTab;
    allChannels = cfg.channels.slice();
    tabMap = JSON.parse(JSON.stringify(cfg.tabMap || {}));
    mainTab = cfg.mainTab;
    sidebarWidth = cfg.sidebarWidth;
    discussionWidth = cfg.discussionWidth;
    lastIndexMap = { ...cfg.lastIndexMap };
    scrollState = { ...cfg.scrollState };
    lastSeenMap = { ...cfg.lastSeenMap };
    settings = { ...cfg.settings };
    channelMeta = { ...(cfg.channelMeta || {}) };
    activeChannelSlug = cfg.activeChannel || null;
  }
  function snapshotCfg() {
    return {
      tabs: savedTabs.slice(),
      activeTab,
      channels: allChannels.slice(),
      tabMap: JSON.parse(JSON.stringify(tabMap || {})),
      mainTab,
      sidebarWidth,
      discussionWidth,
      lastIndexMap: { ...lastIndexMap },
      scrollState: { ...scrollState },
      lastSeenMap: { ...lastSeenMap },
      settings: { ...settings },
      activeChannel: activeChannelSlug || null,
      channelMeta: { ...channelMeta },
    };
  }
  let saveTimer = null;
  function save(immediate = false) {
    const doSave = () => GM.setValue(CFG_KEY, snapshotCfg());
    if (immediate) return doSave();
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 150);
  }
  await loadCfg();

  // ===== Telegram Page Parsing & HTTP Utilities =====
  const NOT_FOUND_SELECTORS = [
    ".tgme_widget_message_error",
    ".tgme_widget_error",
    ".tgme_page_error",
    ".tgme_page_wrap .tgme_page_content .tgme_page_description",
  ];
  const NOT_FOUND_REGEX = new RegExp(
    [
      "Post not found",
      "Пост не найден",
      "Запись не найдена",
      "Публікацію не знайдено",
      "Posta bulunamadı",
      "Post nicht gefunden",
      "Publicación no encontrada",
      "投稿が見つかりません",
      "文章未找到",
      "Channel not found",
      "Канал не найден",
    ].join("|"),
    "i"
  );
  const PRIVATE_REGEX = new RegExp(
    [
      "This channel is private",
      "Этот канал приватный",
      "Этот канал закрыт",
      "Bu kanal özeldir",
      "Dieser Kanal ist privat",
      "Этот канал недоступен",
    ].join("|"),
    "i"
  );
  function normalizeSlug(input) {
    if (!input) return null;
    let s = String(input).trim();
    s = s.replace(/^https?:\/\/(www\.)?t\.me\//i, "");
    s = s.replace(/^@/, "");
    s = s.replace(/^s\//i, "");
    s = s.split(/[/?#]/)[0];
    if (!/^[A-Za-z0-9_]{3,64}$/.test(s)) return null;
    return s;
  }
  let backoffMs = 0;
  function handleBackoff(status) {
    if (status === 429 || status === 0 || status === -1) {
      backoffMs = Math.min((backoffMs || 500) * 2, 8000) + Math.floor(Math.random() * 250);
    } else {
      backoffMs = 0;
    }
  }
  function gmFetch(url, timeout = 15000) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { Accept: "text/html" },
        timeout,
        onload: (res) => resolve({ status: res.status, text: res.responseText || "" }),
        onerror: () => resolve({ status: 0, text: "" }),
        ontimeout: () => resolve({ status: -1, text: "" }),
      });
    });
  }
  async function fetchHtmlWithBackoff(url, timeout = 15000) {
    if (backoffMs > 0) await sleep(backoffMs);
    const res = await gmFetch(url, timeout);
    handleBackoff(res.status);
    return res;
  }
  async function gmFetchEmbed(slug, n, timeout = 15000) {
    const { status, text } = await fetchHtmlWithBackoff(`https://t.me/${slug}/${n}?embed=1`, timeout);
    if (status !== 200) return { ok: false, reason: `HTTP ${status}` };
    if (PRIVATE_REGEX.test(text)) return { ok: false, reason: "private" };
    if (NOT_FOUND_REGEX.test(text)) return { ok: false, reason: "not_found" };
    try {
      const doc = new DOMParser().parseFromString(text, "text/html");
      const isErrorDom = NOT_FOUND_SELECTORS.some((sel) => doc.querySelector(sel));
      if (isErrorDom) return { ok: false, reason: "not_found" };
    } catch {}
    return { ok: true };
  }

  // ===== Existence Cache (post availability) =====
  const existsCache = new Map();
  function pruneExistsCache(limit = 3000) {
    if (existsCache.size < limit) return;
    const now = Date.now();
    for (const [k, v] of existsCache) {
      if (now - v.t > EXISTS_TTL) existsCache.delete(k);
    }
    if (existsCache.size > limit) {
      const arr = [...existsCache.entries()].sort((a, b) => a[1].t - b[1].t);
      const cut = Math.floor(arr.length / 2);
      for (let i = 0; i < cut; i++) existsCache.delete(arr[i][0]);
    }
  }
  async function checkExistsWithCache(slug, n) {
    pruneExistsCache();
    const key = `${slug}#${n}`;
    const now = Date.now();
    const cached = existsCache.get(key);
    if (cached && now - cached.t < EXISTS_TTL) return { exists: cached.v, reason: cached.reason };
    const res = await gmFetchEmbed(slug, n);
    const ok = !!res.ok;
    const reason = res.reason || null;
    existsCache.set(key, { v: ok, reason, t: now });
    return { exists: ok, reason };
  }

  // ===== Channel Last-ID & Metadata Basics =====
  async function fetchLastIdViaS(slug, timeout = 15000) {
    const { status, text } = await fetchHtmlWithBackoff(`https://t.me/s/${slug}`, timeout);
    if (status !== 200) {
      return { last: null, status };
    }
    if (PRIVATE_REGEX.test(text)) return { last: -1, status: 200 };
    if (NOT_FOUND_REGEX.test(text)) return { last: 0, status: 200 };
    let max = 0, m;
    const re = new RegExp(`data-post="${slug}\\/(\\d+)"`, "g");
    while ((m = re.exec(text))) max = Math.max(max, +m[1]);
    const reHref = new RegExp(`href="/${slug}\\/(\\d+)"`, "g");
    while ((m = reHref.exec(text))) max = Math.max(max, +m[1]);
    return { last: max || null, status: 200 };
  }
  function needMeta(slug) {
    const m = channelMeta[slug];
    if (!m) return true;
    if (!m.title && !m.avatar) return true;
    if (!m.t || Date.now() - m.t > META_TTL_MS) return true;
    return false;
  }
  function setMeta(slug, data) {
    channelMeta[slug] = { ...(channelMeta[slug] || {}), ...data, t: Date.now() };
    save(true);
  }
  function getMeta(slug) {
    return channelMeta[slug] || null;
  }
  function extractBgUrlFromStyle(styleStr = "") {
    // Properly extract url("...") from style string
    const m = /urlKATEX_INLINE_OPEN(['"]?)(.*?)\1KATEX_INLINE_CLOSE/i.exec(styleStr);
    return m ? m[2] : null;
  }
  function textOrNull(el) {
    if (!el) return null;
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    return t || null;
  }
  function urlOrNull(el) {
    if (!el) return null;
    const src = el.getAttribute("src");
    if (src) return src;
    let style = el.getAttribute("style") || "";
    let bg = extractBgUrlFromStyle(style);
    if (!bg && el.style && el.style.backgroundImage) {
      bg = extractBgUrlFromStyle(el.style.backgroundImage);
    }
    if (!bg) return null;
    if (bg.startsWith("//")) bg = "https:" + bg;
    return bg;
  }

  // ===== Channel Metadata Fetching & Entity Type Detection =====
  async function fetchChannelMetaFromS(slug) {
    const { status, text } = await fetchHtmlWithBackoff(`https://t.me/s/${slug}`, 15000);
    if (status !== 200) return { title: null, avatar: null };
    try {
      const doc = new DOMParser().parseFromString(text, "text/html");
      let title =
        textOrNull(doc.querySelector(".tgme_channel_info_header_title")) ||
        textOrNull(doc.querySelector(".tgme_page_title")) ||
        textOrNull(doc.querySelector(".tgme_widget_message_owner_name")) ||
        null;
      let avatar = null;
      const og = doc.querySelector('meta[property="og:image"]');
      if (og && og.getAttribute("content")) {
        avatar = og.getAttribute("content");
      }
      if (!avatar) {
        const el1 = doc.querySelector(".tgme_page_photo_image");
        const el2 = doc.querySelector(".tgme_widget_message_user_photo");
        avatar = urlOrNull(el1) || urlOrNull(el2) || null;
      }
      if (avatar && avatar.startsWith("//")) avatar = "https:" + avatar;
      return { title, avatar };
    } catch {
      return { title: null, avatar: null };
    }
  }
  const metaInFlight = new Map();
  function ensureChannelMeta(slug) {
    if (!slug) return Promise.resolve(getMeta(slug));
    if (!needMeta(slug)) return Promise.resolve(getMeta(slug));
    if (metaInFlight.has(slug)) return metaInFlight.get(slug);
    const p = (async () => {
      try {
        const m = await fetchChannelMetaFromS(slug);
        if (m.title || m.avatar) {
          setMeta(slug, m);
          updateChannelHeader(slug);
          renderChats();
        }
      } finally {
        metaInFlight.delete(slug);
      }
      return getMeta(slug);
    })();
    metaInFlight.set(slug, p);
    return p;
  }
  function getType(slug) {
    const m = channelMeta[slug];
    return m && m.type ? m.type : null;
  }
  function setType(slug, type) {
    if (!slug || !type) return;
    channelMeta[slug] = { ...(channelMeta[slug] || {}), type, t: Date.now() };
    save(true);
  }
  function parseTypeFromExtraText(extraText) {
    const t = (extraText || "").toLowerCase();
    if (t.includes("subscribers")) return "channel";
    if (t.includes("members") && t.includes("online")) return "chat";
    return null;
  }
  async function fetchEntityTypeFromPage(slug) {
    const { status, text } = await fetchHtmlWithBackoff(`https://t.me/${slug}`, 15000);
    if (status !== 200) return null;
    try {
      const doc = new DOMParser().parseFromString(text, "text/html");
      const extra = textOrNull(doc.querySelector(".tgme_page_extra")) || "";
      return parseTypeFromExtraText(extra);
    } catch {
      return null;
    }
  }
  const typeInFlight = new Map();
  function ensureEntityType(slug) {
    if (!slug) return Promise.resolve(getType(slug));
    if (getType(slug)) return Promise.resolve(getType(slug));
    if (typeInFlight.has(slug)) return typeInFlight.get(slug);
    const p = (async () => {
      try {
        const t = await fetchEntityTypeFromPage(slug);
        if (t) setType(slug, t);
      } finally {
        typeInFlight.delete(slug);
      }
      return getType(slug);
    })();
    typeInFlight.set(slug, p);
    return p;
  }

  // ===== Root Container & Static Layout =====
  const container = document.createElement("div");
  container.id = "tg-container";
  document.body.appendChild(container);
  document.documentElement.style.setProperty('--post-width', POST_WIDTH_PX ? POST_WIDTH_PX + 'px' : 'auto');
  container.innerHTML = `
    <div id="sidebar" style="width:${sidebarWidth}px">
      <div class="sidebar-header">
        <div class="settings" title="Settings">⚙️</div>
        <div class="search-wrapper">
          <input type="text" class="search" placeholder="Search channels (@handle or t.me)...">
          <button class="clear-search hidden" title="Clear">❌</button>
        </div>
      </div>
      <div class="tabs-wrapper">
        <div class="tabs"></div>
        <button class="add-tab" title="Add folder">＋</button>
      </div>
      <div class="chat-list"></div>
      <button class="add-channel" title="Add channel/chat">📢</button>
      <div class="sidebar-resizer"></div>
    </div>
    <div id="chat-area">
      <div class="empty-hint">Pick a channel/chat on the left 👈</div>
    </div>
    <ul id="context-menu" class="hidden" role="menu"></ul>
    <div id="settings-modal" class="hidden" aria-hidden="true">
      <div class="settings-backdrop"></div>
      <div class="settings-panel">
        <div class="settings-header">
          <div class="settings-title">Settings</div>
          <button class="settings-close" title="Close">✖</button>
        </div>
        <div class="settings-content">
          <div class="settings-row">
            <label>Initial posts to load (initialCount):</label>
            <input type="number" id="st-initialCount" min="1" max="1000" value="${settings.initialCount}">
          </div>
          <div class="settings-row">
            <label>Batch size when loading older (olderBatch):</label>
            <input type="number" id="st-olderBatch" min="1" max="100" value="${settings.olderBatch}">
          </div>
          <div class="settings-row">
            <label>Dark theme (widget):</label>
            <input type="checkbox" id="st-darkTheme" ${settings.darkTheme ? "checked" : ""}>
          </div>
          <div class="settings-row">
            <label>Refresh interval (sec, 0=off):</label>
            <input type="number" id="st-refresh" min="5" value="${settings.refreshSec}">
          </div>
          <div class="settings-row">
            <label>Unread counter in browser tab title:</label>
            <input type="checkbox" id="st-titleBadge" ${settings.titleBadge ? "checked" : ""}>
          </div>
          <div class="settings-row">
            <label>Initial load delay (ms):</label>
            <input type="number" id="st-loadDelayInitial" min="0" max="2000" value="${settings.loadDelayInitial}">
          </div>
          <div class="settings-row">
            <label>Scroll load delay (ms):</label>
            <input type="number" id="st-loadDelayScroll" min="0" max="2000" value="${settings.loadDelayScroll}">
          </div>
          <div class="settings-row">
            <label>Start at bottom:</label>
            <input type="checkbox" id="st-pinBottom" ${settings.pinStartAtBottom ? "checked" : ""}>
          </div>
          <div class="settings-actions">
            <button id="st-save">Save</button>
            <button id="st-cancel">Cancel</button>
          </div>
          <hr>
          <div class="settings-row two-col">
            <button id="st-export">Export profile</button>
            <label class="import-label">
              Import profile
              <input id="st-import" type="file" accept="application/json" style="display:none;">
            </label>
            <button id="st-reset">Reset all</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // ===== Element References =====
  const sidebar = container.querySelector("#sidebar");
  const tabsContainer = container.querySelector(".tabs");
  const chatList = container.querySelector(".chat-list");
  const searchInput = container.querySelector(".search");
  const clearSearchBtn = container.querySelector(".clear-search");
  const contextMenu = container.querySelector("#context-menu");
  const addTabBtn = container.querySelector(".add-tab");
  const addChannelBtn = container.querySelector(".add-channel");
  const resizer = container.querySelector(".sidebar-resizer");
  const chatArea = container.querySelector("#chat-area");
  const settingsBtn = container.querySelector(".settings");
  const modal = container.querySelector("#settings-modal");
  const modalClose = container.querySelector(".settings-close");
  const modalBackdrop = container.querySelector(".settings-backdrop");

  // ===== Generic Helpers & Utilities =====
  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
  function setStatus(el, msg) { if (el) el.textContent = msg; }
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
  function highlightMatch(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return `${escapeHtml(before)}<mark>${escapeHtml(match)}</mark>${escapeHtml(after)}`;
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }
  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function colorIndexFor(slug, modulo = 8) {
    return (hashStr(slug) % modulo) + 1; // 1..8
  }
  function extractIdFromUrl(url) {
    if (!url) return null;
    const match = url.match(/\/(\d+)\/?$/);
    return match && match[1] ? parseInt(match[1], 10) : null;
  }
  function setupHorizontalResizer(handleEl, getWidth, setWidth, onEnd = () => {}, invert = false) {
    let resizing = false, startX = 0, startW = 0;
    handleEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      resizing = true;
      startX = e.clientX;
      startW = getWidth();
      document.body.style.cursor = "col-resize";
    });
    document.addEventListener("mousemove", (e) => {
      if (!resizing) return;
      const delta = e.clientX - startX;
      const newW = invert ? (startW - delta) : (startW + delta);
      setWidth(newW);
    });
    document.addEventListener("mouseup", () => {
      if (!resizing) return;
      resizing = false;
      document.body.style.cursor = "";
      onEnd();
    });
  }

  // ===== Concurrency & Probing Helpers =====
  async function runPool(items, concurrency, worker) {
    let idx = 0;
    let any = false;
    const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
      while (idx < items.length) {
        const i = idx++;
        try {
          any = (await worker(items[i], i)) || any;
        } catch {}
      }
    });
    await Promise.all(workers);
    return any;
  }
  async function binarySearchLastTrue(lowTrue, highFalseExclusive, exists, delayMs = 0) {
    let L = lowTrue, H = highFalseExclusive;
    while (H - L > 1) {
      const mid = (L + H) >> 1;
      if (await exists(mid)) L = mid; else H = mid;
      if (delayMs) await sleep(delayMs);
    }
    return L;
  }
  async function expandUpperBound(low, step, exists, delayMs = 0) {
    let curLow = low;
    let curStep = Math.max(1, step);
    let probe = curLow + curStep;
    while (await exists(probe)) {
      curLow = probe;
      curStep *= 2;
      probe = curLow + curStep;
      if (delayMs) await sleep(delayMs);
    }
    return { low: curLow, high: probe };
  }

  // ===== Title Badge & Unread Counters =====
  const BASE_TITLE = document.title || "TamperGram";
  const link = document.querySelector('link[rel~="icon"]') || document.head.appendChild(document.createElement('link'));
  link.rel = 'icon';
  link.href = 'https://telegram.org/favicon.ico';
  function getUnreadCountForSlug(slug) {
    const lastKnown = +lastIndexMap[slug] || 0;
    const lastSeen = +lastSeenMap[slug] || 0;
    return Math.max(0, lastKnown - lastSeen);
  }
  function totalUnreadCount() {
    return allChannels.reduce((acc, slug) => acc + getUnreadCountForSlug(slug), 0);
  }
  function updateTitleUnread() {
    if (!settings.titleBadge) {
      document.title = BASE_TITLE;
      return;
    }
    const total = totalUnreadCount();
    document.title = total > 0 ? `(${total > 999 ? "999+" : total}) ${BASE_TITLE}` : BASE_TITLE;
  }

  // ===== Sidebar Resizer =====
  setupHorizontalResizer(
    resizer,
    () => sidebar.getBoundingClientRect().width,
    (w) => {
      sidebarWidth = clamp(w, 200, window.innerWidth - 100);
      sidebar.style.width = sidebarWidth + "px";
    },
    () => save()
  );

  // ===== Tabs: State & Rendering =====
  let firstRenderTabs = true;
  let draggingTabName = null;
  function unreadForTab(tab) {
    const list = tab === ALL ? allChannels : (tabMap[tab] || []);
    return list.reduce((sum, slug) => sum + getUnreadCountForSlug(slug), 0);
  }
  function renderTabs() {
    tabsContainer.innerHTML = "";
    savedTabs.forEach((tab) => {
      const tabEl = document.createElement("div");
      tabEl.className = "tab" + (tab === activeTab ? " active" : "");
      const labelText = tab === mainTab ? `🏠 ${tab}` : tab;
      const unread = unreadForTab(tab);
      const badge = unread > 0 ? `<span class="tbadge">${unread > 999 ? "999+" : unread}</span>` : "";
      tabEl.innerHTML = `<span class="tab-label">${escapeHtml(labelText)}</span>${badge}`;
      if (tab !== ALL) {
        tabEl.draggable = true;
        tabEl.addEventListener("dragstart", () => {
          draggingTabName = tab;
          tabEl.classList.add("dragging");
        });
        tabEl.addEventListener("dragend", () => {
          draggingTabName = null;
          tabEl.classList.remove("dragging");
        });
        tabEl.addEventListener("dragover", (e) => e.preventDefault());
        tabEl.addEventListener("drop", () => {
          if (!draggingTabName || draggingTabName === tab) return;
          const arr = savedTabs.filter((t) => t !== ALL);
          const fromIdx = arr.indexOf(draggingTabName);
          const toIdx = arr.indexOf(tab);
          if (fromIdx < 0 || toIdx < 0) return;
          arr.splice(toIdx, 0, arr.splice(fromIdx, 1)[0]);
          savedTabs = [ALL, ...arr];
          save();
          renderTabs();
        });
      }
      tabEl.addEventListener("click", () => {
        activeTab = tab;
        save();
        renderTabs();
        renderChats();
        pollSidebarOnce();
        setTimeout(() => tabEl.scrollIntoView({ behavior: "smooth", inline: "center" }), 0);
      });
      tabEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (tab === ALL) {
          contextMenu.innerHTML = `
            <li data-action="make-main" data-tab="${tab}">🏠 Set "${tab}" as main</li>
            <li data-action="mark-all-read-tab" data-tab="${tab}">✅ Mark all as read in "${tab}"</li>
          `;
        } else {
          contextMenu.innerHTML = `
            <li data-action="make-main" data-tab="${tab}">🏠 Set "${tab}" as main</li>
            <li data-action="rename-tab" data-tab="${tab}">✏️ Rename folder</li>
            <li data-action="del-tab" data-tab="${tab}">❌ Delete folder "${tab}"</li>
            <li data-action="mark-all-read-tab" data-tab="${tab}">✅ Mark all as read in "${tab}"</li>
          `;
        }
        openContextMenu(e.pageX, e.pageY);
      });
      tabsContainer.appendChild(tabEl);
      if (firstRenderTabs && tab === mainTab) {
        setTimeout(() => tabEl.scrollIntoView({ behavior: "auto", inline: "center" }), 0);
      }
    });
    firstRenderTabs = false;
    updateTitleUnread();
  }

  // ===== Channels List Rendering =====
  function getVisibleChannels() {
    return activeTab === ALL ? allChannels : (tabMap[activeTab] || []).slice();
  }
  function displayName(slug) {
    const m = getMeta(slug);
    return (m && m.title) ? m.title : slug;
  }
  function renderChats() {
    const prevTop = chatList.scrollTop;
    chatList.innerHTML = "";
    const filter = (searchInput.value || "").toLowerCase();
    const visibleChannels = getVisibleChannels();
    const baseIndex = new Map(visibleChannels.map((s, i) => [s, i]));
    const filtered = visibleChannels
      .filter((c) => c.toLowerCase().includes(filter) || (displayName(c).toLowerCase().includes(filter)));
    filtered.sort((a, b) => {
      const ua = getUnreadCountForSlug(a);
      const ub = getUnreadCountForSlug(b);
      if (ua !== ub) return ub - ua;
      const la = +lastIndexMap[a] || 0;
      const lb = +lastIndexMap[b] || 0;
      if (la !== lb) return lb - la;
      return (baseIndex.get(a) ?? 0) - (baseIndex.get(b) ?? 0);
    });
    filtered.forEach((slug) => {
      const m = getMeta(slug) || {};
      const item = document.createElement("div");
      item.className = "chat-item" + (slug === activeChannelSlug ? " active" : "");
      item.draggable = true;
      item.dataset.slug = slug;
      item.title = "Open channel/chat";
      const lastKnown = +lastIndexMap[slug] || 0;
      const lastSeen = +lastSeenMap[slug] || 0;
      const diff = Math.max(0, lastKnown - lastSeen);
      const titleText = (m.title || slug);
      const titleHtml = highlightMatch(titleText, filter);
      const slugHtml = highlightMatch("@" + slug, filter);
      let avatarHtml = "";
      if (m.avatar) {
        avatarHtml = `<img class="ci-ava-img" referrerpolicy="no-referrer" loading="lazy"
        src="${escapeHtml(m.avatar)}" alt="@${escapeHtml(slug)}">`;
      } else {
        const ch = (titleText || slug).trim();
        const letter = (ch[0] || slug[0] || "?").toUpperCase();
        const idx = colorIndexFor(slug);
        avatarHtml = `<div class="ci-ava-fallback bgc${idx}">${escapeHtml(letter)}</div>`;
      }
      item.innerHTML = `
        <div class="ci-ava">${avatarHtml}</div>
        <div class="ci-main">
          <div class="ci-top">
            <span class="ci-title">${titleHtml}</span>
            <span class="ci-badges">${diff > 0 ? `<span class="badge">${diff > 999 ? "999+" : diff}</span>` : ""}</span>
          </div>
          <div class="ci-sub">${slugHtml}</div>
        </div>
      `;
      chatList.appendChild(item);
    });
    chatList.scrollTop = prevTop;
    updateTitleUnread();
    warmupVisibleMeta();
  }

  // ===== Channels List: Interactions (click, context menu, DnD) =====
  chatList.addEventListener("click", (e) => {
    const item = e.target.closest(".chat-item");
    if (!item) return;
    openChannel(item.dataset.slug);
  });
  chatList.addEventListener("contextmenu", (e) => {
    const item = e.target.closest(".chat-item");
    if (!item) return;
    e.preventDefault();
    const ch = item.dataset.slug;
    let html = `
      <li class="submenu">📂 Add to folder ▸
        <ul class="submenu-list">
          <li data-action="create-tab" data-channel="${ch}"><strong>✚ Create a new folder and add</strong></li>`;
    const otherTabs = savedTabs.filter((t) => t !== ALL);
    otherTabs.forEach((tab) => {
      html += `<li data-action="add-to" data-tab="${tab}" data-channel="${ch}">📁 ${tab}</li>`;
    });
    html += `</ul></li>`;
    if (activeTab !== ALL) {
      html += `<li data-action="remove-from-tab" data-tab="${activeTab}" data-channel="${ch}">🗑 Remove from "${activeTab}"</li>`;
    }
    html += `
      <li data-action="mark-read" data-channel="${ch}">✅ Mark as read</li>
      <li data-action="rename-channel" data-channel="${ch}">✏️ Rename (@handle)</li>
      <li data-action="delete-channel" data-channel="${ch}">❌ Delete channel</li>`;
    contextMenu.innerHTML = html;
    openContextMenu(e.pageX, e.pageY);
  });
  let draggingSlug = null;
  chatList.addEventListener("dragstart", (e) => {
    const item = e.target.closest(".chat-item");
    if (!item) return;
    draggingSlug = item.dataset.slug;
    item.classList.add("dragging");
  });
  chatList.addEventListener("dragend", (e) => {
    const item = e.target.closest(".chat-item");
    if (item) item.classList.remove("dragging");
    draggingSlug = null;
  });
  chatList.addEventListener("dragover", (e) => {
    const over = e.target.closest(".chat-item");
    if (!over) return;
    e.preventDefault();
  });
  chatList.addEventListener("drop", (e) => {
    const over = e.target.closest(".chat-item");
    if (!over || !draggingSlug) return;
    const toSlug = over.dataset.slug;
    if (toSlug === draggingSlug) return;
    if (activeTab === ALL) {
      const arr = allChannels.slice();
      const fromIdx = arr.indexOf(draggingSlug);
      const toIdx = arr.indexOf(toSlug);
      if (fromIdx < 0 || toIdx < 0) return;
      arr.splice(toIdx, 0, arr.splice(fromIdx, 1)[0]);
      allChannels = arr;
    } else {
      const arr = (tabMap[activeTab] || []).slice();
      const fromIdx = arr.indexOf(draggingSlug);
      const toIdx = arr.indexOf(toSlug);
      if (fromIdx < 0 || toIdx < 0) return;
      arr.splice(toIdx, 0, arr.splice(fromIdx, 1)[0]);
      tabMap[activeTab] = arr;
    }
    save();
    renderChats();
  });

  // ===== Context Menu: Open/Close & Actions =====
  function openContextMenu(x, y) {
    contextMenu.style.left = x + "px";
    contextMenu.style.top = y + "px";
    contextMenu.classList.remove("hidden");
    requestAnimationFrame(() => {
      const rect = contextMenu.getBoundingClientRect();
      let nx = rect.left, ny = rect.top;
      if (rect.right > window.innerWidth) nx = window.innerWidth - rect.width - 8;
      if (rect.bottom > window.innerHeight) ny = window.innerHeight - rect.height - 8;
      contextMenu.style.left = Math.max(8, nx) + "px";
      contextMenu.style.top = Math.max(8, ny) + "px";
    });
  }
  function closeContextMenu() {
    contextMenu.classList.add("hidden");
  }
  document.addEventListener("click", () => closeContextMenu());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeContextMenu();
      if (document.activeElement === searchInput && searchInput.value) {
        searchInput.value = "";
        renderChats();
      }
    }
  });
  contextMenu.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-action]");
    if (!li) return;
    const action = li.dataset.action;
    const tab = li.dataset.tab;
    const ch = li.dataset.channel;
    switch (action) {
      case "make-main":
        mainTab = tab; activeTab = tab; save(); renderTabs(); renderChats(); break;
      case "rename-tab": {
        const oldName = tab;
        const next = prompt("New folder name:", oldName);
        if (next == null) break;
        const newName = next.trim();
        if (!newName) return alert("Folder name cannot be empty.");
        if (newName === ALL) return alert(`The name "${ALL}" is reserved.`);
        if (newName === oldName) break;
        if (savedTabs.includes(newName)) return alert("A folder with this name already exists.");
        savedTabs = savedTabs.map((t) => (t === oldName ? newName : t));
        tabMap[newName] = (tabMap[oldName] || []).slice();
        delete tabMap[oldName];
        if (activeTab === oldName) activeTab = newName;
        if (mainTab === oldName) mainTab = newName;
        save(); renderTabs(); renderChats();
        break;
      }
      case "del-tab":
        savedTabs = savedTabs.filter((t) => t !== tab);
        delete tabMap[tab];
        if (activeTab === tab) activeTab = ALL;
        if (mainTab === tab) mainTab = ALL;
        save(); renderTabs(); renderChats(); break;
      case "add-to":
        if (!tabMap[tab]) tabMap[tab] = [];
        if (!tabMap[tab].includes(ch)) tabMap[tab].push(ch);
        save();
        break;
      case "create-tab": {
        const name = prompt("New folder name:");
        if (!name) break;
        const trimmed = name.trim();
        if (!trimmed || savedTabs.includes(trimmed) || trimmed === ALL)
          return alert("Error: the name is invalid, reserved, or already exists.");
        savedTabs.push(trimmed);
        tabMap[trimmed] = [ch];
        activeTab = trimmed;
        save(); renderTabs(); renderChats();
        break;
      }
      case "remove-from-tab":
        tabMap[tab] = (tabMap[tab] || []).filter((x) => x !== ch);
        save(); renderChats(); break;
      case "delete-channel": {
        allChannels = allChannels.filter((c) => c !== ch);
        for (const t in tabMap) tabMap[t] = (tabMap[t] || []).filter((x) => x !== ch);
        delete lastIndexMap[ch];
        delete lastSeenMap[ch];
        delete scrollState[ch];
        delete channelMeta[ch];
        const view = channelViews.get(ch);
        if (view) {
          try { view.loader?.destroy?.(); } catch {}
          try { view.wrap.remove(); } catch {}
          channelViews.delete(ch);
        }
        if (activeChannelSlug === ch) {
          activeChannelSlug = null;
          const hint = chatArea.querySelector(".empty-hint");
          if (hint) hint.style.display = "";
          chatArea.querySelectorAll(".channel-wrap").forEach(w => w.style.display = "none");
        }
        save(); renderTabs(); renderChats();
        break;
      }
      case "rename-channel": {
        const current = ch;
        const next = prompt("Enter @handle or a t.me link:", current.startsWith("@") ? current : "@" + current);
        if (!next) break;
        const slug = normalizeSlug(next);
        if (!slug) return alert("Invalid @handle. Example: durov or https://t.me/durov");
        if (allChannels.includes(slug) && slug !== current) return alert("A channel with this @handle already exists.");
        allChannels = allChannels.map((c) => (c === current ? slug : c));
        for (const t in tabMap) tabMap[t] = (tabMap[t] || []).map((x) => (x === current ? slug : x));
        if (lastIndexMap[current] != null) { lastIndexMap[slug] = lastIndexMap[current]; delete lastIndexMap[current]; }
        if (lastSeenMap[current] != null) { lastSeenMap[slug] = lastSeenMap[current]; delete lastSeenMap[current]; }
        if (scrollState[current]) { scrollState[slug] = scrollState[current]; delete scrollState[current]; }
        if (channelMeta[current]) { channelMeta[slug] = channelMeta[current]; delete channelMeta[current]; }
        const view = channelViews.get(current);
        if (view) {
          try { view.loader?.destroy?.(); } catch {}
          try { view.wrap.remove(); } catch {}
          channelViews.delete(current);
        }
        if (activeChannelSlug === current) activeChannelSlug = slug;
        save(); renderTabs(); renderChats();
        if (activeChannelSlug === slug) openChannel(slug);
        break;
      }
      case "mark-read":
        lastSeenMap[ch] = +lastIndexMap[ch] || 0;
        save(); renderTabs(); renderChats();
        if (activeChannelSlug === ch) {
          refreshUnreadUI(ch);
        }
        break;
      case "mark-all-read-tab": {
        const list = (tab === ALL) ? allChannels : (tabMap[tab] || []);
        list.forEach((slug) => { lastSeenMap[slug] = +lastIndexMap[slug] || 0; });
        save(); renderTabs(); renderChats();
        if (list.includes(activeChannelSlug)) {
          refreshUnreadUI(activeChannelSlug);
        }
        break;
      }
      case "open-post":
        window.open(li.dataset.url, "_blank"); break;
      case "copy-link": {
        const u = li.dataset.url;
        if (typeof GM_setClipboard === "function") GM_setClipboard(u);
        else if (navigator.clipboard) navigator.clipboard.writeText(u);
        break;
      }
    }
    closeContextMenu();
  });

  // ===== Add Tab & Add Channel Actions =====
  addTabBtn.addEventListener("click", () => {
    const name = prompt("New folder name:");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed || savedTabs.includes(trimmed) || trimmed === ALL)
      return alert("Error: the name is invalid, reserved, or already exists.");
    savedTabs.push(trimmed);
    tabMap[trimmed] = [];
    activeTab = trimmed;
    save(); renderTabs(); renderChats();
  });
  addChannelBtn.addEventListener("click", () => {
    const v = prompt(
      "You can enter:\n\n\ @handle\n handle\n https://t.me/handle\n\nℹ️ Technical limitations of Telegram ℹ️\nIn some cases, the number of the last post/comment may be incorrect or not determined at all. In this case, enter it manually \ne.g. https://t.me/handle/42\n",
      "https://t.me/"
    );
    if (!v) return;
    const slug = normalizeSlug(v);
    const initialPostId = extractIdFromUrl(v);
    if (!slug) return alert("Invalid @handle. Example: durov or https://t.me/durov");
    if (allChannels.includes(slug)) return alert("Error: a channel with this @handle already exists.");
    allChannels.push(slug);
    if (initialPostId) {
      lastIndexMap[slug] = initialPostId;
    }
    if (activeTab !== ALL) {
      if (!tabMap[activeTab]) tabMap[activeTab] = [];
      tabMap[activeTab].push(slug);
    }
    save();
    renderTabs();
    renderChats();
    ensureChannelMeta(slug);
    ensureEntityType(slug);
    openChannel(slug);
  });

  // ===== Search (filter channels) =====
  let searchDebounce = null;
  function applySearch() {
    renderChats();
    if (searchInput.value.trim() !== "") clearSearchBtn.classList.remove("hidden");
    else clearSearchBtn.classList.add("hidden");
  }
  searchInput.addEventListener("input", () => {
    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(applySearch, 120);
  });
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.classList.add("hidden");
    renderChats();
    searchInput.focus();
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = chatList.querySelector(".chat-item");
      if (first) first.click();
    }
  });

  // ===== Tabs Horizontal Scroll (wheel) =====
  tabsContainer.addEventListener("wheel", (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      tabsContainer.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // ===== Post Placeholder & Embed Loader =====
  function createPostPlaceholder(n) {
    const wrap = document.createElement("div");
    wrap.className = "tg-post";
    wrap.dataset.n = String(n);
    wrap.dataset.loaded = "0";
    wrap.innerHTML = `
      <div class="post-inner">
        <div class="post-skel">Post #${n}…</div>
      </div>
    `;
    return wrap;
  }
  function loadPostInto(el, slug, n) {
    if (!el || el.dataset.loaded === "1") return;
    el.dataset.loaded = "1";
    const inner = el.querySelector(".post-inner") || el;
    (async () => {
      let type = getType(slug);
      if (!type) {
        try { await ensureEntityType(slug); type = getType(slug); } catch {}
      }
      const isChannel = type === "channel";
      const isChat = type === "chat";
      if (isChannel) {
        if (!inner.querySelector(".post-discuss-btn")) {
          const btn = document.createElement("button");
          btn.className = "post-discuss-btn";
          btn.type = "button";
          btn.title = "Open discussion";
          btn.setAttribute("aria-label", "Open discussion");
          btn.textContent = "💬";
          inner.appendChild(btn);
        }
      } else {
        inner.querySelector(".post-discuss-btn")?.remove();
      }
      const sc = document.createElement("script");
      sc.async = true;
      sc.src = "https://telegram.org/js/telegram-widget.js?22";
      sc.setAttribute("data-telegram-post", `${slug}/${n}`);
      sc.setAttribute("data-width", "100%");
      sc.setAttribute("data-userpic", isChat ? "true" : "false");
      sc.setAttribute("data-dark", settings.darkTheme ? "1" : "0");
      inner.querySelector(".post-skel")?.remove?.();
      inner.appendChild(sc);
    })();
  }

  // ===== Lazy Loader (IntersectionObserver) =====
  function setupLazyLoader(rootEl, slug) {
    function makeIO() {
      return new IntersectionObserver((entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const el = en.target;
          const n = +el.dataset.n;
          if (el.dataset.loaded !== "1") {
            loadPostInto(el, slug, n);
          }
        }
      }, { root: rootEl, rootMargin: "600px 0px" });
    }
    let io = makeIO();
    return {
      observe(el) { io && io.observe(el); },
      disconnect() { if (io) io.disconnect(); },
      reconnect() {
        if (io) { try { io.disconnect(); } catch {} }
        io = makeIO();
        rootEl.querySelectorAll('.tg-post[data-loaded="0"]').forEach((el) => io.observe(el));
      },
    };
  }

  // ===== Finding Last Post Number =====
  async function findLastPostForChannel(slug, statusEl, stillActive) {
    async function exists(n, label = "") {
      if (!stillActive()) throw new Error("aborted");
      if (label) setStatus(statusEl, `Checking post #${n} (${label})…`);
      const r = await checkExistsWithCache(slug, n);
      if (!stillActive()) throw new Error("aborted");
      if (r.reason === "private") throw new Error("private");
      return r.exists;
    }

    try {
      const quick = await fetchLastIdViaS(slug);
      if (!stillActive()) throw new Error("aborted");
      if (quick && typeof quick.last === "number") {
        const last = quick.last;
        if (last === -1) { setStatus(statusEl, "The channel is private or restricted. Posts are unavailable."); return -1; }
        if (last === 0) return 0;
        if (last > 0) {
          const r = await checkExistsWithCache(slug, last);
          if (!stillActive()) throw new Error("aborted");
          if (r.exists) return last;
        }
      }
    } catch (e) {
      if (e.message === "aborted") throw e;
    }

    const saved = Number.isFinite(+lastIndexMap[slug]) ? +lastIndexMap[slug] : null;

    try {
      if (saved && saved > 0) {
        if (await exists(saved + 1, "ahead")) {
          const { low, high } = await expandUpperBound(saved + 1, PROBE_START, (n) => exists(n, "exp"), EXP_DELAY_MS);
          return await binarySearchLastTrue(low, high, (n) => exists(n, "bisect"), BISECT_DELAY_MS);
        } else if (await exists(saved, "saved")) {
          return saved;
        } else {
          if (!(await exists(1, "base"))) return 0;
          return await binarySearchLastTrue(1, saved + 1, (n) => exists(n, "bisect"), BISECT_DELAY_MS);
        }
      }
    } catch (e) {
      if (e.message === "aborted") throw e;
      if (e.message === "private") { setStatus(statusEl, "The channel is private or restricted. Posts are unavailable."); return -1; }
    }

    try {
      if (!(await exists(1, "base"))) return 0;
      if (await exists(PROBE_START, "probe")) {
        const { low, high } = await expandUpperBound(PROBE_START, PROBE_START, (n) => exists(n, "exp"), EXP_DELAY_MS);
        return await binarySearchLastTrue(low, high, (n) => exists(n, "bisect"), BISECT_DELAY_MS);
      }
      return await binarySearchLastTrue(1, PROBE_START + 1, (n) => exists(n, "bisect"), BISECT_DELAY_MS);
    } catch (e) {
      if (e.message === "aborted") throw e;
      setStatus(statusEl, "Error while searching for the last post.");
      return -2;
    }
  }

  // ===== Channel View: Build & Register =====
  const channelViews = new Map();
  function buildChannelView(slug) {
    const m = getMeta(slug);
    const nice = (m && m.title) ? m.title : null;
    const titleText = nice || `Channel`;
    const subText = `@${slug}`;
    let avatarHtml = "";
    if (m?.avatar) {
      avatarHtml = `<img class="ch-ava-img" src="${escapeHtml(m.avatar)}" alt="@${escapeHtml(slug)}">`;
    } else {
      const letter = (titleText[0] || slug[0] || "?").toUpperCase();
      const idx = colorIndexFor(slug);
      avatarHtml = `<div class="ch-ava-fallback bgc${idx}">${escapeHtml(letter)}</div>`;
    }
    const wrap = document.createElement("div");
    wrap.className = "channel-wrap";
    wrap.dataset.slug = slug;
    wrap.style.display = "none";
    wrap.innerHTML = `
      <div class="channel-header">
        <div class="ch-wrap">
          <div class="ch-ava">${avatarHtml}</div>
          <div class="ch-main">
            <div class="ch-title">${escapeHtml(titleText)}</div>
            <div class="ch-sub">${escapeHtml(subText)}</div>
          </div>
        </div>
      </div>
      <div class="status-line">
        <span class="status-text">Ready.</span>
      </div>
      <div class="content-row">
        <div class="posts-scroll">
          <div class="posts"></div>
        </div>
        <div class="discussion-resizer hidden" title="Resize"></div>
        <div class="discussion-panel hidden" style="width:${discussionWidth}px">
          <div class="discussion-header">
            <div class="discussion-title">Discussion</div>
            <button class="discussion-close" title="Close">✖</button>
          </div>
          <div class="discussion-body"></div>
        </div>
      </div>
      <button class="new-bubble hidden" type="button" title="Show new">↓ <span class="cnt">0</span> new</button>
    `;
    chatArea.appendChild(wrap);
    const statusEl = wrap.querySelector(".status-text");
    const scrollEl = wrap.querySelector(".posts-scroll");
    const postsEl = wrap.querySelector(".posts");
    const newBtn = wrap.querySelector(".new-bubble");
    const discussionPanel = wrap.querySelector(".discussion-panel");
    const discussionResizer = wrap.querySelector(".discussion-resizer");
    const discussionBody = wrap.querySelector(".discussion-body");
    const discussionTitle = wrap.querySelector(".discussion-title");
    const discussionClose = wrap.querySelector(".discussion-close");
    const st = scrollState[slug];
    setTimeout(() => {
      if (st && Number.isFinite(st.top)) scrollEl.scrollTop = st.top;
    }, 0);
    const onScrollPersist = () => {
      scrollState[slug] = { top: scrollEl.scrollTop };
      save();
    };
    scrollEl.addEventListener("scroll", onScrollPersist);
    newBtn.addEventListener("click", () => {
      const rec = channelViews.get(slug);
      if (!rec || !rec.loader) return;
      rec.scrollEl.scrollTo({ top: rec.scrollEl.scrollHeight, behavior: "smooth" });
      lastSeenMap[slug] = rec.loader.newest;
      save(); renderTabs(); renderChats();
      refreshUnreadUI(slug, rec);
    });
    discussionClose.addEventListener("click", () => closeDiscussion(slug));
    setupHorizontalResizer(
      discussionResizer,
      () => discussionPanel.getBoundingClientRect().width,
      (w) => {
        const nw = clamp(w, 280, Math.min(window.innerWidth * 0.7, 900));
        discussionPanel.style.width = nw + "px";
      },
      () => {
        discussionWidth = parseInt(discussionPanel.getBoundingClientRect().width, 10) || discussionWidth;
        save();
      },
      true
    );
    return {
      wrap, statusEl, scrollEl, postsEl, onScrollPersist, newBtn,
      discussionPanel, discussionBody, discussionTitle, discussionClose, discussionResizer,
      currentDiscussion: null,
    };
  }

  // ===== Channel Header Update & Empty Hint =====
  function updateChannelHeader(slug) {
    const rec = channelViews.get(slug);
    if (!rec) return;
    const m = getMeta(slug);
    const titleEl = rec.wrap.querySelector(".ch-title");
    const subEl = rec.wrap.querySelector(".ch-sub");
    const avaEl = rec.wrap.querySelector(".ch-ava");
    if (titleEl) titleEl.textContent = (m?.title || "Channel");
    if (subEl) subEl.textContent = `@${slug}`;
    if (avaEl) {
      if (m?.avatar) {
        avaEl.innerHTML = `<img class="ch-ava-img" referrerpolicy="no-referrer" loading="lazy"
        src="${escapeHtml(m.avatar)}" alt="@${escapeHtml(slug)}">`;
      } else {
        const letter = ((m?.title || slug)[0] || "?").toUpperCase();
        const idx = colorIndexFor(slug);
        avaEl.innerHTML = `<div class="ch-ava-fallback bgc${idx}">${escapeHtml(letter)}</div>`;
      }
    }
  }
  function showEmptyHintIfNoActive() {
    const hint = chatArea.querySelector(".empty-hint");
    const anyVisible = [...chatArea.querySelectorAll(".channel-wrap")].some(el => el.style.display !== "none");
    if (hint) hint.style.display = anyVisible ? "none" : "";
  }

  // ===== Discussion Panel: Open/Close & Button Handler =====
  function openDiscussion(slug, n) {
    if (!slug || !Number.isFinite(+n)) return;
    const rec = channelViews.get(slug);
    if (!rec) return;
    rec.discussionPanel.classList.remove("hidden");
    rec.discussionResizer.classList.remove("hidden");
    rec.discussionPanel.style.width = clamp(discussionWidth, 280, Math.min(window.innerWidth * 0.7, 900)) + "px";
    rec.discussionTitle.textContent = `Discussion of post #${n}`;
    rec.discussionBody.innerHTML = "";
    const sc = document.createElement("script");
    sc.async = true;
    sc.src = "https://telegram.org/js/telegram-widget.js?22";
    sc.setAttribute("data-telegram-discussion", `${slug}/${n}`);
    sc.setAttribute("data-comments-limit", "50");
    sc.setAttribute("data-dark", settings.darkTheme ? "1" : "0");
    rec.discussionBody.appendChild(sc);
    rec.currentDiscussion = { slug, n: +n };
  }
  function closeDiscussion(slug) {
    const rec = channelViews.get(slug);
    if (!rec) return;
    rec.discussionBody.innerHTML = "";
    rec.discussionPanel.classList.add("hidden");
    rec.discussionResizer.classList.add("hidden");
    rec.currentDiscussion = null;
  }
  chatArea.addEventListener("click", (e) => {
    const btn = e.target.closest(".post-discuss-btn");
    if (!btn) return;
    const postEl = btn.closest(".tg-post");
    if (!postEl) return;
    const n = +postEl.dataset.n;
    const slug = activeChannelSlug;
    openDiscussion(slug, n);
  });

  // ===== Unread & Bottom Detection =====
  function isNearBottom(scrollEl) {
    return scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight) < NEAR_BOTTOM_PX;
  }
  function updateNewBubble(slug, rec) {
    if (!rec?.newBtn) return;
    const loaderNewest = rec.loader?.newest || 0;
    const lastSeen = +lastSeenMap[slug] || 0;
    const unread = Math.max(0, loaderNewest - lastSeen);
    const show = unread > 0 && !isNearBottom(rec.scrollEl);
    const cntEl = rec.newBtn.querySelector(".cnt");
    if (cntEl) cntEl.textContent = unread > 999 ? "999+" : String(unread);
    rec.newBtn.classList.toggle("hidden", !show);
  }
  function findFirstUnreadElement(postsEl, afterN) {
    for (const el of postsEl.children) {
      if (el.classList.contains("tg-post")) {
        const n = +el.dataset.n;
        if (n > afterN) return el;
      }
    }
    return null;
  }
  function updateUnreadSeparator(slug, rec) {
    const postsEl = rec?.postsEl;
    if (!postsEl) return;
    const lastSeen = +lastSeenMap[slug] || 0;
    const newest = rec.loader?.newest || (+lastIndexMap[slug] || 0);
    const hasUnread = newest > lastSeen;
    const existing = postsEl.querySelector(".unread-sep");
    if (!hasUnread) {
      if (existing) existing.remove();
      return;
    }
    const anchor = findFirstUnreadElement(postsEl, lastSeen);
    if (!anchor) {
      if (existing) existing.remove();
      return;
    }
    let sep = existing;
    if (!sep) {
      sep = document.createElement("div");
      sep.className = "unread-sep";
      sep.innerHTML = "<span>Unread messages</span>";
    }
    postsEl.insertBefore(sep, anchor);
  }
  function refreshUnreadUI(slug, rec = channelViews.get(slug)) {
    if (!rec) return;
    updateNewBubble(slug, rec);
    updateUnreadSeparator(slug, rec);
  }
  function maybeMarkSeen(slug, scrollEl, newest) {
    const nearBottom = isNearBottom(scrollEl);
    let changed = false;
    if (nearBottom && newest > 0) {
      if ((+lastSeenMap[slug] || 0) !== newest) {
        lastSeenMap[slug] = newest;
        changed = true;
        save();
        renderTabs(); renderChats();
      }
    }
    refreshUnreadUI(slug);
    return changed;
  }

  // ===== Open Channel (activate view) =====
  function openChannel(inputName) {
    const slug = normalizeSlug(inputName);
    if (!slug) {
      alert("This doesn't look like an @handle.\nRight‑click → 'Rename (@handle)' — enter an @username or a t.me link.");
      return;
    }
    const prev = activeChannelSlug;
    activeChannelSlug = slug;
    save();
    renderChats();
    const item = chatList.querySelector(`.chat-item[data-slug="${slug}"]`);
    if (item) item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (prev && prev !== slug) {
      const prevView = channelViews.get(prev);
      if (prevView && prevView.loader && typeof prevView.loader.pause === "function") {
        prevView.loader.pause();
      }
    }
    chatArea.querySelectorAll(".channel-wrap").forEach((w) => w.style.display = "none");
    const hint = chatArea.querySelector(".empty-hint");
    if (hint) hint.style.display = "none";
    let rec = channelViews.get(slug);
    const firstTime = !rec;
    if (!rec) {
      const view = buildChannelView(slug);
      rec = { ...view, loader: null, token: 0 };
      channelViews.set(slug, rec);
    }
    rec.wrap.style.display = "flex";
    if (rec.loader && typeof rec.loader.resume === "function") {
      rec.loader.resume();
    }
    ensureChannelMeta(slug).then(() => updateChannelHeader(slug)).catch(()=>{});
    ensureEntityType(slug).catch(()=>{});
    refreshUnreadUI(slug, rec);
    refreshChannelFor(slug, firstTime);
  }

  // ===== Sequential Loader (bottom-up posts) =====
  function setupSequentialBottomUp(scrollEl, postsEl, slug, lastN, stillActive) {
    const lazy = setupLazyLoader(scrollEl, slug);
    let newestLoaded = lastN;
    let oldestLoaded = lastN;
    let destroyed = false;
    let loadingOlder = false;
    let loadingNewer = false;
    let paused = false;
    function isAlive() {
      return !destroyed && stillActive() && document.body.contains(scrollEl) && document.body.contains(postsEl);
    }
    const hasPost = (n) => !!postsEl.querySelector(`.tg-post[data-n="${n}"]`);
    const touchBounds = (n) => {
      if (n > newestLoaded) newestLoaded = n;
      if (n < oldestLoaded) oldestLoaded = n;
    };
    const callUi = () => refreshUnreadUI(slug);
    function createAtBottom(n, pinBottom = true, forceLoad = false) {
      if (!isAlive()) return;
      if (hasPost(n)) { touchBounds(n); return; }
      const prevNearBottom = isNearBottom(scrollEl);
      const ph = createPostPlaceholder(n);
      postsEl.appendChild(ph);
      lazy.observe(ph);
      touchBounds(n);
      if (forceLoad) loadPostInto(ph, slug, n);
      if (pinBottom || prevNearBottom) scrollEl.scrollTop = scrollEl.scrollHeight;
    }
    function prependOlderOne(n, keepViewStable) {
      if (!isAlive()) return;
      if (hasPost(n)) { touchBounds(n); return; }
      const prevH = scrollEl.scrollHeight;
      const prevTop = scrollEl.scrollTop;
      const ph = createPostPlaceholder(n);
      postsEl.insertBefore(ph, postsEl.firstChild);
      lazy.observe(ph);
      touchBounds(n);
      if (keepViewStable) {
        const newH = scrollEl.scrollHeight;
        scrollEl.scrollTop = prevTop + (newH - prevH);
      }
    }
    postsEl.innerHTML = "";
    createAtBottom(lastN, settings.pinStartAtBottom, true);
    (async () => {
      const initialCount = Math.max(1, settings.initialCount);
      const targetOldest = Math.max(1, lastN - initialCount + 1);
      for (let n = lastN - 1; n >= targetOldest; n--) {
        if (!isAlive()) break;
        prependOlderOne(n, false);
        if (settings.pinStartAtBottom) scrollEl.scrollTop = scrollEl.scrollHeight;
        await sleep(settings.loadDelayInitial);
      }
      callUi();
    })();
    const onScroll = async () => {
      if (!isAlive()) return;
      let loadedOlder = false;
      if (scrollEl.scrollTop < LOAD_UP_TRIGGER_PX && !loadingOlder && oldestLoaded > 1) {
        loadingOlder = true;
        const batchSize = Math.max(1, settings.olderBatch);
        const to = Math.max(1, oldestLoaded - batchSize);
        for (let n = oldestLoaded - 1; n >= to; n--) {
          if (!isAlive()) break;
          prependOlderOne(n, true);
          loadedOlder = true;
          await sleep(settings.loadDelayScroll);
        }
        loadingOlder = false;
      }
      if (loadedOlder) callUi();
      maybeMarkSeen(slug, scrollEl, newestLoaded);
    };
    scrollEl.addEventListener("scroll", onScroll);
    async function appendNewer(newLast) {
      if (loadingNewer || newLast <= newestLoaded) return;
      loadingNewer = true;
      const nearBottom = isNearBottom(scrollEl);
      for (let n = newestLoaded + 1; n <= newLast; n++) {
        if (!isAlive()) break;
        createAtBottom(n, nearBottom, nearBottom);
        await sleep(settings.loadDelayScroll);
      }
      loadingNewer = false;
      callUi();
      maybeMarkSeen(slug, scrollEl, newestLoaded);
    }
    function pause() {
      if (paused) return;
      paused = true;
      lazy.disconnect();
      scrollEl.removeEventListener("scroll", onScroll);
    }
    function resume() {
      if (!paused) return;
      paused = false;
      scrollEl.addEventListener("scroll", onScroll);
      lazy.reconnect();
    }
    function destroy() {
      destroyed = true;
      try { scrollEl.removeEventListener("scroll", onScroll); } catch {}
      try { lazy.disconnect(); } catch {}
    }
    return {
      get oldest() { return oldestLoaded; },
      get newest() { return newestLoaded; },
      get scrollEl() { return scrollEl; },
      appendNewer,
      pause,
      resume,
      destroy,
    };
  }

  // ===== Refresh Channel (initial + updates) =====
  async function refreshChannelFor(slug, initial = false) {
    const rec = channelViews.get(slug);
    if (!rec) return;
    const { statusEl, scrollEl, postsEl } = rec;
    rec.token = (rec.token || 0) + 1;
    const myToken = rec.token;
    const stillActive = () => rec.token === myToken && activeChannelSlug === slug;
    setStatus(statusEl, initial ? "Looking for the last post…" : "Checking for new posts…");
    let last = -2;
    try {
      last = await findLastPostForChannel(slug, statusEl, stillActive);
    } catch (e) {
      if (e.message === "aborted") return;
    }
    if (!stillActive()) return;
    if (last <= 0 && getType(slug) === 'chat') {
      const userUrl = prompt(
        `Could not automatically determine the last message in the chat "${slug}".\n\n` +
        `This is normal for chats. To continue, paste a link to any (preferably the latest) message from this chat.\n\n` +
        `Example: https://t.me/${slug}/174`,
        `https://t.me/${slug}/`
      );
      if (userUrl) {
        const extractedId = extractIdFromUrl(userUrl);
        if (extractedId && Number.isFinite(extractedId)) {
          last = extractedId;
          setStatus(statusEl, `Using ID #${last} from the provided link.`);
          await sleep(500);
        } else {
          alert("Invalid link. Message ID not found. Loading canceled.");
        }
      }
    }
    if (last <= 0) {
      if (last === -1) setStatus(statusEl, "The channel is private or restricted. Posts are unavailable.");
      else if (last === 0) {
        lastIndexMap[slug] = 0; save();
        postsEl.innerHTML = ""; setStatus(statusEl, "There are no posts in the channel.");
        renderTabs(); renderChats();
      } else setStatus(statusEl, "Search error. A link may be required for chats.");
      return;
    }
    lastIndexMap[slug] = last; save(); renderTabs(); renderChats();
    if (!rec.loader) {
      setStatus(statusEl, `Latest post: #${last}. Rendering…`);
      const loader = setupSequentialBottomUp(scrollEl, postsEl, slug, last, stillActive);
      rec.loader = loader;
      setStatus(statusEl, `Done. Latest: #${last}. Scroll up for older.`);
      maybeMarkSeen(slug, loader.scrollEl, loader.newest);
      refreshUnreadUI(slug, rec);
    } else {
      if (last > rec.loader.newest) {
        await rec.loader.appendNewer(last);
        setStatus(statusEl, `Updated. Latest: #${last}.`);
        maybeMarkSeen(slug, rec.loader.scrollEl, rec.loader.newest);
        refreshUnreadUI(slug, rec);
      } else {
        setStatus(statusEl, `No new posts. Latest: #${last}.`);
      }
    }
  }

  // ===== Settings Modal: Open/Close & Save =====
  function openSettings() { modal.classList.remove("hidden"); modal.setAttribute("aria-hidden", "false"); }
  function closeSettings() { modal.classList.add("hidden"); modal.setAttribute("aria-hidden", "true"); }
  settingsBtn.addEventListener("click", openSettings);
  modalClose.addEventListener("click", closeSettings);
  modalBackdrop.addEventListener("click", closeSettings);
  container.querySelector("#st-save").addEventListener("click", () => {
    const getNum = (id, min, max, def) => {
      const v = parseInt(container.querySelector(id).value, 10);
      return Number.isFinite(v) ? clamp(v, min, max) : def;
    };
    settings.initialCount = getNum("#st-initialCount", 1, 1000, settings.initialCount);
    settings.olderBatch = getNum("#st-olderBatch", 1, 100, settings.olderBatch);
    settings.darkTheme = container.querySelector("#st-darkTheme").checked;
    settings.refreshSec = getNum("#st-refresh", 0, Number.POSITIVE_INFINITY, settings.refreshSec);
    settings.titleBadge = container.querySelector("#st-titleBadge").checked;
    settings.loadDelayInitial = getNum("#st-loadDelayInitial", 0, 2000, settings.loadDelayInitial);
    settings.loadDelayScroll = getNum("#st-loadDelayScroll", 0, 2000, settings.loadDelayScroll);
    settings.pinStartAtBottom = container.querySelector("#st-pinBottom").checked;
    save();
    closeSettings();
    startSidebarPolling();
    setTimeout(pollSidebarOnce, 200);
    if (activeChannelSlug) openChannel(activeChannelSlug);
  });
  container.querySelector("#st-cancel").addEventListener("click", closeSettings);

  // ===== Export / Import / Reset =====
  container.querySelector("#st-export").addEventListener("click", () => {
    const data = {
      tabs: savedTabs,
      activeTab,
      channels: allChannels,
      tabMap,
      mainTab,
      sidebarWidth,
      discussionWidth,
      lastIndexMap,
      scrollState,
      lastSeenMap,
      settings,
      activeChannel: activeChannelSlug,
      channelMeta,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tampergram-config.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  container.querySelector("#st-import").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data.channels)) return alert("Invalid import file");
      savedTabs = data.tabs || [ALL];
      if (!savedTabs.includes(ALL)) savedTabs.unshift(ALL);
      activeTab = data.activeTab || ALL;
      allChannels = data.channels || [];
      tabMap = data.tabMap || {};
      mainTab = data.mainTab || ALL;
      sidebarWidth = data.sidebarWidth || sidebarWidth;
      discussionWidth = data.discussionWidth || discussionWidth;
      lastIndexMap = data.lastIndexMap || {};
      scrollState = data.scrollState || {};
      lastSeenMap = data.lastSeenMap || {};
      settings = normalizeSettings(data.settings || settings);
      activeChannelSlug = data.activeChannel || null;
      channelMeta = data.channelMeta || {};
      for (const [s, v] of channelViews) {
        try { v.loader?.destroy?.(); } catch {}
        try { v.wrap.remove(); } catch {}
      }
      channelViews.clear();
      save();
      renderTabs(); renderChats(); closeSettings();
      startSidebarPolling();
      setTimeout(pollSidebarOnce, 200);
      if (activeChannelSlug) openChannel(activeChannelSlug);
      else showEmptyHintIfNoActive();
    } catch (err) {
      alert("Import error: " + err.message);
    } finally {
      e.target.value = "";
    }
  });

  container.querySelector("#st-reset").addEventListener("click", async () => {
    if (!confirm("Reset all settings and data?")) return;
    try {
      stopSidebarPolling();
      if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }

      if (typeof GM.listValues === "function") {
        const keys = await GM.listValues();
        await Promise.all(keys.map(k => GM.deleteValue(k)));
      } else {
        await GM.deleteValue(CFG_KEY);
      }
    } catch (e) {
      console.error("Failed to reset config:", e);
    } finally {
      location.reload();
    }
  });

  // ===== Post Context Menu (open/copy link) =====
  chatArea.addEventListener("contextmenu", (e) => {
    const post = e.target.closest(".tg-post");
    if (!post) return;
    e.preventDefault();
    const n = post.dataset.n;
    const slug = activeChannelSlug;
    if (!slug) return;
    const url = `https://t.me/${slug}/${n}`;
    contextMenu.innerHTML = `
      <li data-action="open-post" data-url="${url}">🔗 Open original</li>
      <li data-action="copy-link" data-url="${url}">📋 Copy link</li>
    `;
    openContextMenu(e.pageX, e.pageY);
  });

  // ===== Sidebar Polling: Refresh Last IDs & Update UI =====
  let sidebarPollTimer = null;
  let sidebarPolling = false;

  async function pollSingleChannelLast(slug) {
    if (!slug) return false;
    const { last } = await fetchLastIdViaS(slug);
    if (typeof last === "number" && last >= 0) {
      const prev = +lastIndexMap[slug];
      if (prev !== last) {
        lastIndexMap[slug] = last;
        return true;
      }
    }
    return false;
  }

  async function pollSingleChatLast(slug) {
    const base = +lastIndexMap[slug] || 0;
    if (base <= 0) return false;

    const exists = (n) => checkExistsWithCache(slug, n).then(r => r.exists);

    if (!(await exists(base + 1))) return false;

    const { low, high } = await expandUpperBound(base + 1, PROBE_START, exists, EXP_DELAY_MS);
    const last = await binarySearchLastTrue(low, high, exists, BISECT_DELAY_MS);

    if (last > base) {
      lastIndexMap[slug] = last;
      return true;
    }
    return false;
  }

  async function pollSingleEntityLast(slug) {
    if (!slug) return false;
    let type = getType(slug);
    if (!type) {
      try { type = await ensureEntityType(slug); } catch {}
    }
    if (type === "chat") {
      return await pollSingleChatLast(slug);
    }
    return await pollSingleChannelLast(slug);
  }

  async function pollSidebarOnce() {
    if (sidebarPolling || settings.refreshSec <= 0) return;
    if (document.visibilityState !== "visible") return;
    if (typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine) return;

    sidebarPolling = true;
    try {
      const chans = allChannels.slice().sort(() => Math.random() - 0.5);
      if (activeChannelSlug) {
        const i = chans.indexOf(activeChannelSlug);
        if (i > 0) { chans.splice(i, 1); chans.unshift(activeChannelSlug); }
      }

      const changed = await runPool(chans, NET_CONCURRENCY, async (slug) => {
        try {
          if (backoffMs > 0) await sleep(backoffMs);
          const updated = await pollSingleEntityLast(slug);
          await sleep(220 + Math.floor(Math.random() * 160));
          return updated;
        } catch {
          return false;
        }
      });

      if (changed) { save(); renderTabs(); renderChats(); }

      if (activeChannelSlug) {
        const rec = channelViews.get(activeChannelSlug);
        const newLast = +lastIndexMap[activeChannelSlug] || 0;
        if (rec && rec.loader && newLast > 0 && newLast > rec.loader.newest) {
          await rec.loader.appendNewer(newLast);
          if (rec.loader.scrollEl) {
            maybeMarkSeen(activeChannelSlug, rec.loader.scrollEl, rec.loader.newest);
          }
          refreshUnreadUI(activeChannelSlug, rec);
        }
      }
      warmupVisibleMeta();
    } finally {
      sidebarPolling = false;
    }
  }
  function startSidebarPolling() {
    stopSidebarPolling();
    if (settings.refreshSec > 0) {
      const jitter = Math.floor(Math.random() * 400);
      const period = Math.max(5, settings.refreshSec) * 1000 + jitter;
      sidebarPollTimer = setInterval(pollSidebarOnce, period);
    }
  }
  function stopSidebarPolling() {
    if (sidebarPollTimer) {
      clearInterval(sidebarPollTimer);
      sidebarPollTimer = null;
    }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startSidebarPolling();
      setTimeout(pollSidebarOnce, 500);
    } else {
      stopSidebarPolling();
    }
  });
  window.addEventListener("online", () => { startSidebarPolling(); setTimeout(pollSidebarOnce, 300); });
  window.addEventListener("offline", () => { stopSidebarPolling(); });

  // ===== Warmup Visible Meta/Types (uses shared pool) =====
  async function warmupVisibleMeta() {
    const visible = getVisibleChannels();
    const targets = visible.filter((s) => needMeta(s) || !getType(s));
    if (targets.length === 0) return;

    await runPool(targets, NET_CONCURRENCY, async (slug) => {
      try {
        await Promise.allSettled([ensureChannelMeta(slug), ensureEntityType(slug)]);
      } catch {}
      await sleep(120);
      return false;
    });
  }

  // ===== Styles Injection (CSS) =====
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; }
    html, body { margin:0; padding:0; height:100%; overflow:hidden; font-family:"Segoe UI", Arial, sans-serif; background:#181a1f; color:#e1e1e1; }
    #tg-container { display:flex; height:100vh; width:100vw; }
    #sidebar { background:#202329; border-right:1px solid #2c2f36; display:flex; flex-direction:column; position:relative; }
    .sidebar-header { display:flex; align-items:center; gap:8px; padding:10px; border-bottom:1px solid #2c2f36; }
    .settings { cursor:pointer; font-size:18px; }
    .settings:hover { opacity:.85; }
    .search-wrapper { flex:1; position:relative; }
    .search { width:100%; padding:6px 32px 6px 10px; border:none; border-radius:6px; background:#2c2f36; color:#e1e1e1; }
    .search::placeholder { color:#888; }
    .clear-search { position:absolute; right:6px; top:50%; transform:translateY(-50%); background:none; border:none; color:#aaa; font-size:14px; cursor:pointer; padding:2px; }
    .clear-search:hover { color:#fff; }
    .clear-search.hidden { display:none; }
    .tabs-wrapper { display:flex; align-items:center; border-bottom:1px solid #2c2f36; padding:6px; }
    .tabs { flex:1; display:flex; gap:6px; overflow-x:auto; scrollbar-color:#3a3d44 #202329; scrollbar-width:thin; }
    .tabs::-webkit-scrollbar { height:6px; }
    .tabs::-webkit-scrollbar-thumb { background:#3a3d44; border-radius:3px; }
    .tabs::-webkit-scrollbar-track { background:#202329; }
    .tab { background:#2a2d34; padding:6px 12px; border-radius:6px; cursor:pointer; transition:background .2s; white-space:nowrap; flex-shrink:0; display:flex; align-items:center; gap:6px; }
    .tab.active { background:#3390ec; color:white; font-weight:bold; }
    .tab:hover:not(.active) { background:#3a3d44; }
    .tab.dragging { opacity:.6; }
    .tbadge { background:#b8ff99; color:#000; border-radius:10px; padding:0 6px; font-size:12px; line-height:18px; height:18px; display:inline-flex; align-items:center; }
    .add-tab { margin-left:6px; padding:6px 12px; border:none; background:#3b8ef3; color:white; font-size:16px; cursor:pointer; border-radius:6px; transition:background .2s; flex-shrink:0; }
    .add-tab:hover { background:#2f7bd6; }
    .chat-list { flex:1; overflow-y:auto; }
    .chat-item { position:relative; padding:10px 12px; border-bottom:1px solid #2c2f36; cursor:pointer; transition:background .2s; display:flex; align-items:center; gap:10px; }
    .chat-item:hover { background:#2d3139; }
    .chat-item.dragging { opacity:.6; }
    .chat-item.active { background:#2f3340; }
    .chat-item.active::before { content: ""; position:absolute; left:0; top:0; bottom:0; width:3px; background:#3390ec; }
    .ci-ava { width:40px; height:40px; border-radius:50%; overflow:hidden; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
    .ci-ava-img { width:100%; height:100%; object-fit:cover; display:block; }
    .ci-ava-fallback { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; }
    .bgc1 { background:#5865F2; } .bgc2 { background:#F26522; } .bgc3 { background:#2AA876; } .bgc4 { background:#FF5A5F; }
    .bgc5 { background:#3B82F6; } .bgc6 { background:#8B5CF6; } .bgc7 { background:#EAB308; } .bgc8 { background:#10B981; }
    .ci-main { min-width:0; flex:1; display:flex; flex-direction:column; gap:2px; }
    .ci-top { display:flex; align-items:center; gap:10px; }
    .ci-title { font-weight:600; color:#eaeaea; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ci-sub { color:#9aa3b2; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .badge { background:#b8ff99; color:#000; border-radius:10px; padding:0 6px; font-size:12px; margin-left:auto; }
    mark { background:#3b8ef3; color:#fff; padding:0 3px; border-radius:3px; }
    #chat-area { flex:1; background:#1c1f26; display:flex; align-items:stretch; justify-content:center; color:#bbb; font-size:14px; position:relative; }
    #chat-area .empty-hint { margin:auto; color:#666; }
    #context-menu { position:absolute; background:#2a2d34; border:1px solid #2c2f36; list-style:none; padding:4px 0; margin:0; z-index:1000; min-width:260px; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.4); }
    #context-menu li { padding:8px 14px; cursor:pointer; white-space:nowrap; transition:background .2s; }
    #context-menu li:hover { background:#3a3d44; }
    #context-menu.hidden { display:none; }
    #context-menu li.submenu { position:relative; }
    .submenu-list { display:none; position:absolute; top:0; left:100%; background:#2a2d34; border:1px solid #2c2f36; border-radius:6px; list-style:none; padding:4px 0; margin:0; min-width:180px; z-index:2000; }
    #context-menu li.submenu:hover > .submenu-list { display:block; }
    .submenu-list li { padding:8px 14px; }
    .submenu-list li:hover { background:#3a3d44; }
    .add-channel { position:absolute; bottom:16px; right:16px; width:44px; height:44px; border-radius:50%; border:none; background:#3b8ef3; color:white; font-size:20px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.4); transition:background .2s, transform .1s; display:inline-flex; align-items:center; justify-content:center; }
    .add-channel:hover { background:#2f7bd6; transform:scale(1.05); }
    .sidebar-resizer { position:absolute; top:0; right:0; width:6px; height:100%; cursor:col-resize; background:transparent; }
    .sidebar-resizer:hover { background:rgba(255,255,255,0.05); }
    .channel-wrap { display:flex; flex-direction:column; height:100%; width:100%; position:relative; }
    .channel-header { display:flex; align-items:center; justify-content:center; padding:10px 14px; border-bottom:1px solid #2c2f36; background:#1f222a; }
    .ch-wrap { display:flex; align-items:center; gap:12px; }
    .ch-ava { width:36px; height:36px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; }
    .ch-ava-img { width:100%; height:100%; object-fit:cover; display:block; }
    .ch-ava-fallback { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; }
    .ch-main { display:flex; flex-direction:column; line-height:1.2; }
    .ch-title { font-weight:600; color:#e1e1e1; }
    .ch-sub { font-size:12px; color:#9aa3b2; }
    .status-line { padding:8px 14px; color:#aeb4be; border-bottom:1px solid #2c2f36; background:#1d2027; font-size:13px; }
    .content-row { flex:1; display:flex; min-height:0; }
    .posts-scroll { flex:1; overflow-y:auto; padding:0; }
    .posts { display:flex; flex-direction:column; gap:8px; }
    .discussion-resizer { width:6px; cursor:col-resize; background:transparent; }
    .discussion-resizer:hover { background:rgba(255,255,255,0.05); }
    .discussion-resizer.hidden { display:none; }
    .discussion-panel { width:420px; max-width:70vw; min-width:280px; display:flex; flex-direction:column; border-left:1px solid #2c2f36; background:#1f222a; }
    .discussion-panel.hidden { display:none; }
    .discussion-header { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-bottom:1px solid #2c2f36; }
    .discussion-title { font-weight:600; color:#e1e1e1; }
    .discussion-close { background:none; border:none; color:#e1e1e1; cursor:pointer; font-size:16px; }
    .discussion-close:hover { color:#fff; }
    .discussion-body { flex:1; overflow-y:auto; padding:8px; }
    .tg-post { display:flex; align-items:flex-start; gap:8px; }
    .tg-post iframe { display:block; width:100% !important; min-width:0 !important; border:0 !important; }
    .post-inner { flex:1 1 auto; min-width:0; position:relative; }
    .post-skel { color:#8a93a3; font-size:13px; padding:0; }
    .post-aside { width:52px; flex:0 0 52px; display:flex; align-items:flex-start; justify-content:flex-end; padding-right:6px; padding-top:4px; }
    .post-discuss-btn { width:44px; height:44px; border-radius:50%; border:none; background:#3b8ef3; color:white; font-size:18px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.4); transition:background .2s, transform .1s, opacity .15s; display:inline-flex; align-items:center; justify-content:center; }
    .post-discuss-btn:hover { background:#2f7bd6; transform:scale(1.05); }
    .tg-post { position: relative; display: block; text-align: center; }
    .post-inner { position: relative; display: inline-block; text-align: left; width: var(--post-width, auto); max-width: 100%; }
    .post-discuss-btn { position: absolute; bottom: 8px; left: calc(100% - 24px) !important; z-index: 5; }
    .tg-post iframe { width: 100% !important; max-width: 100% !important; min-width: 0 !important; border: 0 !important; }
    #settings-modal.hidden { display:none; }
    #settings-modal { position:fixed; inset:0; z-index:2000; }
    .settings-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.5); }
    .settings-panel { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:520px; max-width:90vw; background:#23262e; border:1px solid #2c2f36; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.5); }
    .settings-header { display:flex; align-items:center; justify-content:space-between; padding:12px; border-bottom:1px solid #2c2f36; }
    .settings-title { font-weight:600; font-size:16px; }
    .settings-close { background:none; border:none; color:#e1e1e1; font-size:18px; cursor:pointer; }
    .settings-content { padding:12px; }
    .settings-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 0; }
    .settings-row.two-col { display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; }
    .settings-row label { color:#fff; }
    .settings-actions { display:flex; gap:8px; padding:8px 0; }
    #st-save, #st-cancel, #st-export, #st-reset, .import-label { background:#2f7bd6; color:#fff; border:none; border-radius:6px; padding:6px 12px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; font-family:inherit; font-size:14px; transition: background-color 0.2s, opacity 0.2s; flex:1; }
    #st-save:hover, #st-export:hover, .import-label:hover { background-color:#2566b0; }
    #st-cancel { background:#525a6b; }
    #st-cancel:hover { background-color:#414856; }
    #st-reset { background:#b8ff99; color:#000; }
    #st-reset:hover { opacity:.9; }
    .new-bubble { position:absolute; right:18px; bottom:18px; background:#3390ec; color:#fff; border:none; padding:8px 12px; border-radius:18px; box-shadow:0 6px 16px rgba(0,0,0,0.35); font-weight:600; cursor:pointer; z-index:20; transition: transform .08s ease, opacity .12s ease, background-color .2s; }
    .new-bubble:hover { background:#2f7bd6; transform: translateY(-1px); }
    .new-bubble.hidden { display:none; }
    .unread-sep { position:relative; display:flex; align-items:center; justify-content:center; gap:10px; margin:6px 0; color:#b8ff99; font-weight:600; font-size:12px; user-select:none; }
    .unread-sep::before, .unread-sep::after { content:""; flex:1; height:1px; background:#2c2f36; }
    .unread-sep > span { border:1px solid #2c2f36; background:#1c1f26; border-radius:999px; padding:2px 8px; }
  `;
  document.head.appendChild(style);

  // ===== Init: State Reset, Render & Start Polling =====
  activeChannelSlug = null;
  save(true);
  renderTabs();
  renderChats();
  startSidebarPolling();
  pollSidebarOnce();
  showEmptyHintIfNoActive();
})();