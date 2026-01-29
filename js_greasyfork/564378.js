// ==UserScript==
// @name         Houzz Reviews Exporter (Load + Export JSON/CSV/XLSX + Copy)
// @namespace    https://tampermonkey.net/
// @version      1.0.1
// @description  Loads Houzz reviews (scroll + expand) and exports to JSON/CSV/XLSX (plus Copy JSON).
// @author       sharmanhall
// @match        https://www.houzz.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=houzz.com
// @downloadURL https://update.greasyfork.org/scripts/564378/Houzz%20Reviews%20Exporter%20%28Load%20%2B%20Export%20JSONCSVXLSX%20%2B%20Copy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564378/Houzz%20Reviews%20Exporter%20%28Load%20%2B%20Export%20JSONCSVXLSX%20%2B%20Copy%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // CONFIG
  // =========================
  const CONFIG = {
    scrollDelayMs: 900,
    clickDelayMs: 180,
    maxNoChangeLoops: 7,
    maxTotalLoops: 260,
    debug: true,
    // If Houzz uses an inner scroll container, prefer it.
    preferInnerScrollContainer: true,
    // Bonus: when true, also click Houzz's dedicated “Read More” buttons during Load.
    autoExpandReadMoreDuringLoad: false,
  };

  const STATE = {
    running: false,
    stop: false,
    lastCount: 0,
    noChange: 0,
    attempt: 0,
    profile: null,
    totalEstimate: null,
  };

  const log = (...a) => CONFIG.debug && console.log('[HZ-Exporter]', ...a);
  const warn = (...a) => console.warn('[HZ-Exporter]', ...a);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

  const parseIntSafe = (v) => {
    const s = String(v ?? '').replace(/[^\d]/g, '');
    const n = parseInt(s || '0', 10);
    return Number.isFinite(n) ? n : 0;
  };

  // =========================
  // PROFILE INFO EXTRACTION
  // =========================
  const parseFloatSafe = (v) => {
    const m = String(v ?? '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    if (!m) return null;
    const n = parseFloat(m[0]);
    return Number.isFinite(n) ? n : null;
  };

  const isSaneRating = (r) => Number.isFinite(r) && r >= 0 && r <= 5;
  const isSaneTotalReviews = (n) => Number.isFinite(n) && n > 0 && n < 1_000_000;

  function getReviewAggregationContainer() {
    return (
      document.querySelector('.hz-review-aggregation') ||
      document.querySelector('[class*="ReviewAggregation__StyledContainer"]')
    );
  }

  function extractAggregationStats(aggEl) {
    const out = { rating: null, totalReviews: 0 };
    if (!(aggEl instanceof Element)) return out;

    // Rating sources (best-first)
    const ratingEl = aggEl.querySelector('[class*="StyledRating"]');
    const r1 = parseFloatSafe(ratingEl?.textContent);
    if (isSaneRating(r1)) out.rating = r1;

    if (out.rating == null) {
      const sr = [...aggEl.querySelectorAll('.sr-only')]
        .map((el) => norm(el.textContent))
        .find((t) => /average rating/i.test(t));

      if (sr) {
        const m =
          sr.match(/average rating:\s*([0-9]+(?:\.[0-9]+)?)/i) ||
          sr.match(/([0-9]+(?:\.[0-9]+)?)\s*out of\s*5/i);
        const r2 = m ? parseFloat(m[1]) : NaN;
        if (isSaneRating(r2)) out.rating = r2;
      }
    }

    // Total reviews sources (best-first)
    const totalEl = aggEl.querySelector('[class*="StyledReviewNumber"]');
    const n1 = parseIntSafe(totalEl?.textContent);
    if (isSaneTotalReviews(n1)) out.totalReviews = n1;

    if (!out.totalReviews) {
      const t = norm(aggEl.textContent);
      const m = t.match(/(\d[\d,]*)\s+reviews?\b/i);
      const n2 = m ? parseIntSafe(m[1]) : 0;
      if (isSaneTotalReviews(n2)) out.totalReviews = n2;
    }

    return out;
  }

  function extractProfileInfo() {
    const info = {
      name: '',
      rating: null,
      totalReviews: 0,
      category: '',
      location: '',
      url: location.href,
    };

    // Name: try H1 first
    const h1 = document.querySelector('h1');
    const name = norm(h1?.textContent);
    if (name) info.name = name;

    // Rating + total reviews (prefer the review aggregation block)
    const aggEl = getReviewAggregationContainer();
    if (aggEl) {
      const agg = extractAggregationStats(aggEl);
      if (agg.rating != null) info.rating = agg.rating;
      if (agg.totalReviews) info.totalReviews = agg.totalReviews;
    }

    // LAST resort: scan body text for a review count (only if aggregation-based methods failed)
    if (!info.totalReviews) {
      // Exclude our own UI from text matching (it can contain "### reviews")
      let bodyText = document.body?.innerText || '';
      const ui = document.querySelector('#hzr-exporter-ui');
      if (ui?.innerText) bodyText = bodyText.replace(ui.innerText, '');

      const totalMatch =
        bodyText.match(/([\d,]+)\s+reviews?\b/i) ||
        bodyText.match(/Reviews?\s*\(?([\d,]+)\)?/i);

      if (totalMatch) {
        const n = parseIntSafe(totalMatch[1]);
        if (isSaneTotalReviews(n)) info.totalReviews = n;
      }
    }

    // Category/location (best-effort from breadcrumbs / meta)
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDesc) {
      // Often: "Colorado Homes & Design - ... - Denver, CO"
      const parts = metaDesc.split(' - ').map((x) => norm(x)).filter(Boolean);
      if (parts.length >= 2) {
        info.location = parts[parts.length - 1] || '';
      }
    }

    // Category from URL path segment "professionals/<category>/..."
    const pathParts = location.pathname.split('/').filter(Boolean);
    const idx = pathParts.indexOf('professionals');
    if (idx >= 0 && pathParts[idx + 1]) {
      info.category = norm(pathParts[idx + 1].replace(/-/g, ' '));
    }

    return info;
  }

  // =========================
  // FIND REVIEW CARDS
  // =========================
  function getReviewCards() {
    // Houzz uses .review-item on many pages (as in saved HTML).
    const candidates = [
      '.review-item',
      '[data-objid]',
      '[class*="review-item"]',
      '[class*="ReviewItem"]',
      '[class*="ReviewCard"]',
      '[data-qa*="review"]',
    ];

    for (const sel of candidates) {
      const nodes = Array.from(document.querySelectorAll(sel));
      if (nodes.length >= 3) return nodes;
    }

    // Fallback: any element that looks like a review container
    const nodes = Array.from(document.querySelectorAll('article, li, div'));
    return nodes.filter((n) => {
      const t = norm(n.textContent);
      return t.length > 120 && /helpful|read more|read less|stars/i.test(t);
    });
  }

  function getScrollableContainer() {
    if (!CONFIG.preferInnerScrollContainer) return window;

    // Houzz sometimes uses inner scroll containers for review lists.
    const candidates = [
      '[data-qa*="reviews" i]',
      '[class*="reviews" i]',
      '.reviews-wrapper',
      '[class*="Reviews" i]',
      '[class*="Scroll" i]',
    ];

    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      if (!/auto|scroll/i.test(overflowY)) continue;
      if (el.scrollHeight <= el.clientHeight + 50) continue;
      return el;
    }

    return window;
  }

  function scrollToBottom(scroller) {
    if (scroller === window) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      return;
    }
    scroller.scrollTop = scroller.scrollHeight;
  }

  // =========================
  // EXPAND + LOAD
  // =========================
  async function expandAllReadMoreButtons(opts = {}) {
    const { onStatus, maxPasses = 12 } = opts;

    let clicked = 0;
    let passes = 0;

    while (!STATE.stop && passes < maxPasses) {
      passes++;

      const btns = [...document.querySelectorAll('button[data-compid="read_more"]')];
      if (onStatus) onStatus(`Expand All: found ${btns.length} Read More button(s)…`);

      if (!btns.length) break;

      for (const btn of btns) {
        if (STATE.stop) break;
        try {
          btn.click();
          clicked++;
        } catch (_) {}
        await sleep(CONFIG.clickDelayMs);
      }

      // Give the DOM a moment to update/remove clicked buttons
      await sleep(60);
    }

    if (onStatus) onStatus(`Expand All: clicked ${clicked} button(s).`);
    return { clicked, passes };
  }

  async function expandAllVisible() {
    // Expand any "Read more" toggles inside loaded reviews.
    // This is conservative and tries not to click random site buttons.

    const cards = getReviewCards();
    let clicks = 0;

    // Prefer Houzz peekable toggle button inside each card
    for (const card of cards) {
      if (STATE.stop) break;

      const expandButtonSelectors = [
        'button[data-compid="read_more"]',
        'button[data-component*="Read More" i]',
        'button.hz-peekable__toggle',
        'button',
        '[role="button"]',
        'a',
      ];

      for (const sel of expandButtonSelectors) {
        const btns = Array.from(card.querySelectorAll(sel));
        for (const btn of btns) {
          const t = norm(btn.textContent);
          if (!t) continue;
          if (!/read more|more/i.test(t)) continue;
          if (/read less/i.test(t)) continue;
          try {
            btn.click();
            clicks++;
            await sleep(CONFIG.clickDelayMs);
          } catch (_) {}
        }
      }
    }

    if (clicks) log(`Expanded ${clicks} “Read more” toggles`);
    return clicks;
  }

  async function loadAllReviews(onProgress) {
    const scroller = getScrollableContainer();

    STATE.noChange = 0;
    STATE.attempt = 0;
    STATE.lastCount = getReviewCards().length;

    while (!STATE.stop && STATE.attempt < CONFIG.maxTotalLoops) {
      STATE.attempt++;

      // Expand currently visible cards (helps extract full text)
      await expandAllVisible();
      if (CONFIG.autoExpandReadMoreDuringLoad) {
        await expandAllReadMoreButtons({ maxPasses: 2 });
      }

      // Scroll down
      scrollToBottom(scroller);

      await sleep(CONFIG.scrollDelayMs);

      // Count loaded reviews
      const count = getReviewCards().length;
      if (count <= STATE.lastCount) {
        STATE.noChange++;
      } else {
        STATE.noChange = 0;
      }
      STATE.lastCount = count;

      onProgress && onProgress(count, STATE.totalEstimate, STATE.attempt, STATE.noChange);

      if (STATE.noChange >= CONFIG.maxNoChangeLoops) break;
    }
  }

  // =========================
  // SCRAPE REVIEWS
  // =========================
  function extractStars(card) {
    // Try to parse "Average rating: X out of 5 stars" from sr-only, but avoid using the aggregation one.
    const sr = card.querySelector('.sr-only');
    const srText = norm(sr?.textContent);
    if (srText && /average rating/i.test(srText)) {
      const m = srText.match(/average rating:\s*([0-9]+(?:\.[0-9]+)?)/i);
      if (m) {
        const n = parseFloat(m[1]);
        if (Number.isFinite(n) && n >= 0 && n <= 5) return n;
      }
    }

    // Fallback: count highlighted stars
    const stars = card.querySelectorAll('.hz-star-rate--highlighted, .hz-star-rate--highlighted');
    if (stars && stars.length) return Math.min(5, stars.length);

    return null;
  }

  function parseReviewDateRaw(raw) {
    const t = norm(raw);
    if (!t) return { raw: '', estimated: 'unknown', timestamp: null };

    // Try ISO date in <time datetime>
    if (/^\d{4}-\d{2}-\d{2}/.test(t)) {
      const d = new Date(t);
      return { raw: t, estimated: 'iso', timestamp: isNaN(d) ? null : d.getTime() };
    }

    // "January 12, 2025" etc
    const d2 = new Date(t);
    if (!isNaN(d2)) {
      return { raw: t, estimated: 'parsed', timestamp: d2.getTime() };
    }

    return { raw: t, estimated: 'unknown', timestamp: null };
  }

  function extractReviewer(card) {
    // Prefer .hzHouzzer name within reviewer block
    const nameEl =
      card.querySelector('.hzHouzzer') ||
      card.querySelector('.hz-user-name') ||
      card.querySelector('[class*="user-name" i]') ||
      card.querySelector('a');

    const name = norm(nameEl?.textContent);
    return name || '';
  }

  function extractReviewText(card) {
    // Common in saved HTML: .review-item__body-string
    const bodyEl =
      card.querySelector('.review-item__body-string') ||
      card.querySelector('[class*="body-string" i]') ||
      card.querySelector('[class*="ReviewText" i]') ||
      card.querySelector('[data-qa*="reviewText" i]');

    const t = norm(bodyEl?.textContent);
    if (t && t.length > 5) return t;

    // Fallback: find a big block of text inside the card
    const text = norm(card.textContent);
    return text;
  }

  function extractReviewTitle(card) {
    // Many Houzz cards don't have explicit title; try for a bold/heading within card
    const titleCandidates = [
      'h3',
      'h4',
      '[class*="title" i]',
      '[data-qa*="title" i]',
      'strong',
      'b',
    ];

    for (const sel of titleCandidates) {
      const el = card.querySelector(sel);
      const t = norm(el?.textContent);
      if (!t) continue;
      if (t.length < 3 || t.length > 160) continue;
      if (/reviews?/i.test(t)) continue;
      return t;
    }
    return '';
  }

  function extractReviewDate(card) {
    const timeEl = card.querySelector('time');
    const dt = timeEl?.getAttribute?.('datetime');
    if (dt) return parseReviewDateRaw(dt);

    const dateCandidates = [
      '[data-qa*="date" i]',
      '[class*="date" i]',
      '[class*="timestamp" i]',
      'span',
    ];

    for (const sel of dateCandidates) {
      const els = card.querySelectorAll(sel);
      for (const el of els) {
        const t = norm(el?.textContent);
        if (!t) continue;
        // Look for date-like patterns
        if (/\b\d{4}\b/.test(t) || /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(t)) {
          const info = parseReviewDateRaw(t);
          if (info.raw) return info;
        }
      }
    }

    return { raw: '', estimated: 'unknown', timestamp: null };
  }

  function extractPhotos(card) {
    const urls = [];
    const seen = new Set();

    for (const img of card.querySelectorAll('img')) {
      const u = img.currentSrc || img.src;
      if (!u) continue;
      // Skip tiny icons
      const w = parseInt(img.getAttribute('width') || '0', 10);
      const h = parseInt(img.getAttribute('height') || '0', 10);
      if ((w && w < 60) || (h && h < 60)) continue;

      if (!seen.has(u)) { seen.add(u); urls.push(u); }
    }

    return urls;
  }

  function makeStableReviewId(card, idx) {
    const explicit =
      card.getAttribute('data-review-id') ||
      card.getAttribute('data-id') ||
      card.getAttribute('id') ||
      '';
    if (explicit) return String(explicit);

    // Hash-ish from reviewer+date+text
    const t = (card.innerText || '').slice(0, 220);
    const base = `${location.pathname}|${idx}|${t}`;
    let hash = 0;
    for (let i = 0; i < base.length; i++) hash = ((hash << 5) - hash) + base.charCodeAt(i), hash |= 0;
    return `hz_${Math.abs(hash)}`;
  }

  function extractProResponse(card) {
    // Look for "Response" blocks inside the card (varies)
    const text = (card.innerText || '');
    // Heuristic: find a sub-block that contains "Response" and has text after it
    const responseEl =
      card.querySelector('[data-qa*="response" i]') ||
      card.querySelector('[class*="response" i]');

    const responseText = norm(responseEl?.textContent);
    if (responseText && responseText.length > 10) return { response_text: responseText, response_date_raw: '' };

    // Fallback: try parsing by label
    const m = text.match(/Response(?:\s*from\s*.*)?\s*[:\n]\s*([\s\S]{20,})/i);
    if (m) return { response_text: norm(m[1]).slice(0, 5000), response_date_raw: '' };

    return null;
  }

  function extractReview(card, idx) {
    const reviewer = extractReviewer(card);
    const stars = extractStars(card);
    const dateInfo = extractReviewDate(card);
    const title = extractReviewTitle(card);
    const text = extractReviewText(card);
    const photos = extractPhotos(card);
    const response = extractProResponse(card);

    const helpfulEl = card.querySelector('[data-component="Like"]')?.parentElement;
    const helpfulText = norm(helpfulEl?.textContent);
    let helpfulCount = null;
    if (helpfulText) {
      const m = helpfulText.match(/Helpful\s*\(?(\d+)\)?/i);
      if (m) helpfulCount = parseInt(m[1], 10);
      else if (/Helpful/i.test(helpfulText)) helpfulCount = 0;
    }

    return {
      review_id: makeStableReviewId(card, idx),
      reviewer_name: reviewer,
      stars,
      title,
      review_text: text,
      review_date_raw: dateInfo.raw,
      review_date_estimated: dateInfo.estimated,
      review_timestamp: dateInfo.timestamp,
      helpful_count: helpfulCount,
      photos,
      pro_response: response,
    };
  }

  function scrapeAllLoadedReviews() {
    const cards = getReviewCards();
    const out = [];
    for (let i = 0; i < cards.length; i++) {
      try {
        out.push(extractReview(cards[i], i));
      } catch (e) {
        warn('Failed to parse review idx', i, e);
      }
    }
    return out;
  }

  // =========================
  // EXPORT
  // =========================
  function dateStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  function sanitizeFilename(s) {
    return (s || 'houzz_profile')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);
  }

  function blobDownload(data, filename, mime) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  function buildPayload(reviews) {
    const profile = STATE.profile || extractProfileInfo();
    return {
      exported_at: new Date().toISOString(),
      source_url: location.href,
      profile,
      reviews,
    };
  }

  function exportJSON() {
    const reviews = scrapeAllLoadedReviews();
    const payload = buildPayload(reviews);
    const name = `${sanitizeFilename(STATE.profile?.name)}_houzz_reviews_${dateStamp()}.json`;
    blobDownload(JSON.stringify(payload, null, 2), name, 'application/json');
  }

  function exportCSV() {
    const reviews = scrapeAllLoadedReviews();
    const payload = buildPayload(reviews);

    const rows = [];
    const cols = [
      'review_id',
      'reviewer_name',
      'stars',
      'title',
      'review_text',
      'review_date_raw',
      'review_date_estimated',
      'review_timestamp',
      'helpful_count',
      'photos',
      'pro_response_text',
      'pro_response_date_raw',
    ];
    rows.push(cols.join(','));

    for (const r of payload.reviews) {
      const photos = Array.isArray(r.photos) ? r.photos.join(' | ') : '';
      const proText = r.pro_response?.response_text || '';
      const proDate = r.pro_response?.response_date_raw || '';

      const vals = [
        r.review_id,
        r.reviewer_name,
        r.stars ?? '',
        r.title ?? '',
        r.review_text ?? '',
        r.review_date_raw ?? '',
        r.review_date_estimated ?? '',
        r.review_timestamp ?? '',
        r.helpful_count ?? '',
        photos,
        proText,
        proDate,
      ].map((v) => {
        const s = String(v ?? '');
        // CSV escape
        if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
      });

      rows.push(vals.join(','));
    }

    const name = `${sanitizeFilename(STATE.profile?.name)}_houzz_reviews_${dateStamp()}.csv`;
    blobDownload(rows.join('\n'), name, 'text/csv');
  }

  // XLSX export using SheetJS if present (optional)
  // You can paste a minified SheetJS into this script if you already do; keeping structure unchanged.
  function exportXLSX() {
    if (typeof XLSX === 'undefined') {
      alert('XLSX export requires SheetJS (XLSX) to be available on the page or bundled into the script.');
      return;
    }
    const reviews = scrapeAllLoadedReviews();
    const payload = buildPayload(reviews);

    const flat = payload.reviews.map((r) => ({
      review_id: r.review_id,
      reviewer_name: r.reviewer_name,
      stars: r.stars ?? '',
      title: r.title ?? '',
      review_text: r.review_text ?? '',
      review_date_raw: r.review_date_raw ?? '',
      review_date_estimated: r.review_date_estimated ?? '',
      review_timestamp: r.review_timestamp ?? '',
      helpful_count: r.helpful_count ?? '',
      photos: Array.isArray(r.photos) ? r.photos.join(' | ') : '',
      pro_response_text: r.pro_response?.response_text || '',
      pro_response_date_raw: r.pro_response?.response_date_raw || '',
    }));

    const ws = XLSX.utils.json_to_sheet(flat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reviews');

    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const name = `${sanitizeFilename(STATE.profile?.name)}_houzz_reviews_${dateStamp()}.xlsx`;
    blobDownload(out, name, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  function copyJSONToClipboard() {
    const reviews = scrapeAllLoadedReviews();
    const payload = buildPayload(reviews);
    GM_setClipboard(JSON.stringify(payload, null, 2), { type: 'text', mimetype: 'application/json' });
    alert(`Copied JSON to clipboard (${reviews.length} reviews).`);
  }

  // =========================
  // UI
  // =========================
  function makeUI() {
    const wrap = document.createElement('div');
    wrap.id = 'hzr-exporter-ui';
    wrap.style.cssText = `
      position: fixed;
      right: 14px;
      bottom: 14px;
      z-index: 999999;
      width: 320px;
      background: rgba(20,20,20,0.92);
      color: #fff;
      font: 13px/1.3 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      padding: 10px;
    `;

    wrap.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="font-weight:700;">Houzz Reviews Exporter</div>
        <button id="hzr-hide" style="cursor:pointer;border:0;border-radius:8px;padding:6px 8px;background:#333;color:#fff;">Hide</button>
      </div>

      <div id="hzr-prof" style="margin-top:8px;opacity:0.95;"></div>

      <div id="hzr-status" style="margin-top:8px;opacity:0.9;">Idle.</div>
      <div style="margin-top:6px;">
        <div style="height:8px;background:rgba(255,255,255,0.12);border-radius:999px;overflow:hidden;">
          <div id="hzr-bar" style="height:100%;width:0%;background:rgba(255,255,255,0.65);"></div>
        </div>
        <div id="hzr-count" style="margin-top:6px;opacity:0.9;">Loaded: 0</div>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
        <button id="hzr-run" style="cursor:pointer;border:0;border-radius:8px;padding:8px 10px;background:#1f6feb;color:#fff;font-weight:700;">Load + Export</button>
        <button id="hzr-stop" style="cursor:pointer;border:0;border-radius:8px;padding:8px 10px;background:#b42318;color:#fff;font-weight:700;">Stop</button>
        <button id="hzr-expand" style="cursor:pointer;border:0;border-radius:8px;padding:8px 10px;background:#333;color:#fff;font-weight:700;">Expand All</button>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
        <button id="hzr-json" style="cursor:pointer;border:0;border-radius:8px;padding:7px 10px;background:#333;color:#fff;">Export JSON</button>
        <button id="hzr-csv" style="cursor:pointer;border:0;border-radius:8px;padding:7px 10px;background:#333;color:#fff;">Export CSV</button>
        <button id="hzr-xlsx" style="cursor:pointer;border:0;border-radius:8px;padding:7px 10px;background:#333;color:#fff;">Export XLSX</button>
        <button id="hzr-copy" style="cursor:pointer;border:0;border-radius:8px;padding:7px 10px;background:#333;color:#fff;">Copy JSON</button>
      </div>

      <div style="margin-top:10px;font-size:12px;opacity:0.75;">
        Tip: Open the <b>Reviews</b> section/tab first for best results.
      </div>
    `;

    document.body.appendChild(wrap);

    const statusEl = wrap.querySelector('#hzr-status');
    const barEl = wrap.querySelector('#hzr-bar');
    const countEl = wrap.querySelector('#hzr-count');
    const profEl = wrap.querySelector('#hzr-prof');

    const setStatus = (s) => { statusEl.textContent = s; };
    const setProgress = (loaded, totalMaybe, attempt, noChange) => {
      const total = isSaneTotalReviews(totalMaybe) && totalMaybe >= loaded ? totalMaybe : null;
      countEl.textContent = `Loaded: ${loaded}${total ? ` / ~${total}` : ''}  (scroll ${attempt}, no-change ${noChange})`;
      const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : Math.min(100, loaded > 0 ? 30 : 0);
      barEl.style.width = `${pct}%`;
    };

    function refreshProfileDisplay() {
      STATE.profile = extractProfileInfo();
      const p = STATE.profile || {};
      const rating = isSaneRating(p.rating) ? `⭐ ${p.rating}` : '';
      const total = isSaneTotalReviews(p.totalReviews) ? `(${p.totalReviews} reviews)` : '';
      const meta = [p.category, p.location].filter(Boolean).join(' • ');
      profEl.innerHTML = `
        <div style="font-weight:700;">${(p.name || 'Unknown profile')}</div>
        <div style="margin-top:4px;opacity:0.9;">${rating} ${total}</div>
        ${meta ? `<div style="margin-top:4px;opacity:0.85;">${meta}</div>` : ''}
      `;
      STATE.totalEstimate = isSaneTotalReviews(p.totalReviews) ? p.totalReviews : null;
    }

    refreshProfileDisplay();

    // Hide/show
    wrap.querySelector('#hzr-hide').addEventListener('click', () => {
      const hidden = GM_getValue('uiHiddenHouzz', false);
      GM_setValue('uiHiddenHouzz', !hidden);
      wrap.style.display = hidden ? 'block' : 'none';
    });

    // Stop
    wrap.querySelector('#hzr-stop').addEventListener('click', () => {
      STATE.stop = true;
      STATE.running = false;
      setStatus('Stopping...');
    });

    // Expand All (Read More)
    wrap.querySelector('#hzr-expand').addEventListener('click', async () => {
      const found = document.querySelectorAll('button[data-compid="read_more"]').length;
      setStatus(`Expand All: found ${found} Read More button(s)…`);

      try {
        const res = await expandAllReadMoreButtons({ onStatus: setStatus });
        const count = getReviewCards().length;
        setProgress(count, STATE.totalEstimate, 0, 0);
        if (!STATE.running) setStatus(`Expand All: clicked ${res.clicked} button(s).`);
      } catch (e) {
        warn('Expand All failed:', e);
        setStatus('Expand All failed (see console).');
      }
    });

    // Exports
    wrap.querySelector('#hzr-json').addEventListener('click', () => {
      refreshProfileDisplay();
      exportJSON();
    });

    wrap.querySelector('#hzr-csv').addEventListener('click', () => {
      refreshProfileDisplay();
      exportCSV();
    });

    wrap.querySelector('#hzr-xlsx').addEventListener('click', () => {
      refreshProfileDisplay();
      exportXLSX();
    });

    wrap.querySelector('#hzr-copy').addEventListener('click', () => {
      refreshProfileDisplay();
      copyJSONToClipboard();
    });

    // Load + Export
    wrap.querySelector('#hzr-run').addEventListener('click', async () => {
      if (STATE.running) return;

      STATE.stop = false;
      STATE.running = true;

      refreshProfileDisplay();

      // sanity check
      const initial = getReviewCards().length;
      setProgress(initial, STATE.totalEstimate, 0, 0);

      setStatus('Loading reviews (scrolling + expanding)…');
      await loadAllReviews(setProgress);

      if (STATE.stop) {
        setStatus('Stopped.');
        STATE.running = false;
        return;
      }

      // Final expand pass
      await expandAllVisible();

      const count = getReviewCards().length;
      setProgress(count, STATE.totalEstimate, STATE.attempt, STATE.noChange);

      setStatus(`Done. Extracted ${count} review container(s).`);

      // Auto-export JSON after load (existing behavior)
      try {
        exportJSON();
        setStatus(`Done. Exported ${count} review(s) to JSON.`);
      } catch (e) {
        warn('Export failed', e);
        setStatus('Loaded, but export failed (see console).');
      }

      STATE.running = false;
    });

    return { setStatus, setProgress, refreshProfileDisplay };
  }

  // =========================
  // INIT
  // =========================
  function init() {
    const uiHidden = GM_getValue('uiHiddenHouzz', false);
    const ui = makeUI();
    if (uiHidden) document.querySelector('#hzr-exporter-ui').style.display = 'none';

    // Menu command for quick action
    GM_registerMenuCommand('Houzz Exporter: Load reviews (JSON)', async () => {
      if (STATE.running) return;
      STATE.stop = false;
      STATE.running = true;

      ui.refreshProfileDisplay();

      const initial = getReviewCards().length;
      ui.setProgress(initial, STATE.totalEstimate, 0, 0);

      ui.setStatus('Loading reviews (scrolling + expanding)…');
      await loadAllReviews(ui.setProgress);

      if (STATE.stop) {
        ui.setStatus('Stopped.');
        STATE.running = false;
        return;
      }

      await expandAllVisible();

      const count = getReviewCards().length;
      ui.setProgress(count, STATE.totalEstimate, STATE.attempt, STATE.noChange);
      ui.setStatus(`Done. Exporting ${count} reviews…`);
      exportJSON();
      ui.setStatus(`Done. Exported ${count} review(s).`);
      STATE.running = false;
    });
  }

  init();
})();