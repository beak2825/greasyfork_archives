// ==UserScript==
// @name         Honeys: 一覧にお気に入り数(♥)を表示（画像基準で固定）
// @name:en      Honeys: Display the number of favorites (♥) in the list (fixed based on the image)
// @namespace    https://example.com/
// @version      0.8.0
// @description  一覧/ランキング/最近チェック等のサムネにお気に入り数を重ね表示（詳細#bookmark_icon_detail）
// @description:en  Display the number of favorites overlaid on thumbnails for lists, rankings, and recently checked items (details #bookmark_icon_detail)
// @match        https://www.honeys-onlineshop.com/shop/*
// @match        https://honeys-onlineshop.com/shop/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      www.honeys-onlineshop.com
// @connect      honeys-onlineshop.com
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562367/Honeys%3A%20%E4%B8%80%E8%A6%A7%E3%81%AB%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E6%95%B0%28%E2%99%A5%29%E3%82%92%E8%A1%A8%E7%A4%BA%EF%BC%88%E7%94%BB%E5%83%8F%E5%9F%BA%E6%BA%96%E3%81%A7%E5%9B%BA%E5%AE%9A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562367/Honeys%3A%20%E4%B8%80%E8%A6%A7%E3%81%AB%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E6%95%B0%28%E2%99%A5%29%E3%82%92%E8%A1%A8%E7%A4%BA%EF%BC%88%E7%94%BB%E5%83%8F%E5%9F%BA%E6%BA%96%E3%81%A7%E5%9B%BA%E5%AE%9A%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const CACHE_TTL_MS = 1000 * 60 * 60 * 12;
  const CONCURRENCY = 4;
  const REQUEST_TIMEOUT_MS = 20000;

  const PRODUCT_LINK_SELECTOR = 'a[href^="/shop/g/g"], a[href*="/shop/g/g"]';
  const FAV_COUNT_SELECTOR = "#bookmark_icon_detail";

  GM_addStyle(`
    /* バッジ本体 */
    .honeys-fav-badge{
      position:absolute;
      z-index:10;
      display:inline-flex;
      align-items:center;
      gap:4px;
      padding:4px 7px;
      border-radius:999px;
      font-size:12px;
      line-height:1;
      background: rgba(255,255,255,.92);
      color:#e60033;
      box-shadow: 0 1px 3px rgba(0,0,0,.25);
      user-select:none;
      pointer-events:none;
      white-space:nowrap;
      font-weight:700;
    }
    .honeys-fav-badge[data-state="loading"]{ opacity:.55; }
    .honeys-fav-badge[data-state="error"]{ color:#666; }

    /* 位置 */
    .honeys-fav-pos-tr{ top:6px; right:6px; left:auto; bottom:auto; }
    .honeys-fav-pos-tl{ top:6px; left:6px; right:auto; bottom:auto; }

    /* 画像の箱（relative基準） */
    .honeys-fav-host{ position:relative !important; display:block; }
  `);

  const absUrl = (url) => { try { return new URL(url, location.origin).toString(); } catch { return null; } };

  function makeProductKeyFromHref(href) {
    const u = absUrl(href);
    if (!u) return null;
    const m = u.match(/\/shop\/g\/g(\d+)\//i);
    if (m) return `g:${m[1]}`;
    return `url:${u}`;
  }

  function gmGetJson(key, defVal) {
    const raw = GM_getValue(key, null);
    if (!raw) return defVal;
    try { return JSON.parse(raw); } catch { return defVal; }
  }
  function gmSetJson(key, val) { GM_setValue(key, JSON.stringify(val)); }

  function readCache(productKey) {
    const obj = gmGetJson(`honeys:fav:${productKey}`, null);
    if (!obj) return null;
    if (!obj.ts || (Date.now() - obj.ts) > CACHE_TTL_MS) return null;
    if (typeof obj.count !== "number") return null;
    return obj.count;
  }
  function writeCache(productKey, count) {
    gmSetJson(`honeys:fav:${productKey}`, { ts: Date.now(), count });
  }

  function gmRequest(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: REQUEST_TIMEOUT_MS,
        onload: (res) => resolve(res),
        onerror: (e) => reject(e),
        ontimeout: () => reject(new Error("timeout")),
      });
    });
  }

  function extractFavCountFromHtml(html) {
    if (!html) return null;
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const el = doc.querySelector(FAV_COUNT_SELECTOR);
      if (!el) return null;
      const t = (el.textContent || "").trim().replace(/[^\d]/g, "");
      if (!t) return null;
      return Number(t);
    } catch { return null; }
  }

  // ランキング判定（TRにしたい理由：左上に順位が乗る）
  function isRankingPage() {
    const p = location.pathname.toLowerCase();
    const q = location.search.toLowerCase();
    return p.includes("ranking") || q.includes("ranking");
  }

  // ★ここで「通常一覧もTRにするか」を決める（今は常にTR推奨）
  function positionClass(/*anchorEl*/) {
    // ブランド名が左上に入る可能性があるので、基本TR固定が安全
    return "honeys-fav-pos-tr";

    // もし「ランキングだけTR、通常はTL」に戻したいなら↓に差し替え
    // return isRankingPage() ? "honeys-fav-pos-tr" : "honeys-fav-pos-tl";
  }

  /**
   * バッジを載せる“画像の箱”を決める：
   * - a の中の img を探す
   * - img の親要素（=画像枠になってることが多い）を host にする
   * - host に relative を付けて、その中にバッジを入れる
   */
  function getHostElement(anchorEl) {
    if (!(anchorEl instanceof HTMLAnchorElement)) return null;

    const img = anchorEl.querySelector("img");
    if (!img) return null;

    // 画像の直親が一番安定（多くの場合ここがサムネ枠）
    const host = img.parentElement || anchorEl;

    host.classList.add("honeys-fav-host");
    return host;
  }

  function upsertBadge(anchorEl, state, count) {
    const host = getHostElement(anchorEl);
    if (!host) return;

    let badge = host.querySelector(":scope > .honeys-fav-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "honeys-fav-badge";
      host.appendChild(badge);
    }

    badge.classList.remove("honeys-fav-pos-tr", "honeys-fav-pos-tl");
    badge.classList.add(positionClass(anchorEl));

    badge.dataset.state = state;
    if (state === "ok") badge.textContent = `♥${count}`;
    else if (state === "loading") badge.textContent = `♥…`;
    else badge.textContent = `♥?`;
  }

  async function runQueue(items, concurrency, workerFn) {
    let idx = 0;
    const workers = Array.from({ length: concurrency }, async () => {
      while (idx < items.length) {
        const i = idx++;
        await workerFn(items[i]);
      }
    });
    await Promise.all(workers);
  }

  const processed = new Set();

  function collectAnchors() {
    const all = Array.from(document.querySelectorAll(PRODUCT_LINK_SELECTOR))
      .filter(a => a instanceof HTMLAnchorElement);

    // 画像を含むリンクを優先
    all.sort((a, b) => (b.querySelector("img") ? 1 : 0) - (a.querySelector("img") ? 1 : 0));
    return all;
  }

  async function processAnchor(a) {
    const href = a.getAttribute("href");
    const url = absUrl(href);
    if (!url) return;

    const key = makeProductKeyFromHref(href);
    if (!key) return;

    if (processed.has(key)) return;
    processed.add(key);

    upsertBadge(a, "loading");

    const cached = readCache(key);
    if (typeof cached === "number") {
      upsertBadge(a, "ok", cached);
      return;
    }

    try {
      const res = await gmRequest(url);
      const count = extractFavCountFromHtml(res.responseText || "");
      if (typeof count === "number") {
        writeCache(key, count);
        upsertBadge(a, "ok", count);
      } else {
        upsertBadge(a, "error");
      }
    } catch {
      upsertBadge(a, "error");
    }
  }

  let scheduled = false;
  function scanAndRun() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(async () => {
      scheduled = false;
      const anchors = collectAnchors();
      await runQueue(anchors, CONCURRENCY, processAnchor);
    }, 250);
  }

  scanAndRun();
  const mo = new MutationObserver(() => scanAndRun());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
