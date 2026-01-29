// ==UserScript==
// @name         Houzz Reviews Exporter (Load + Export JSON/CSV/XLSX + Copy)
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  Loads Houzz reviews (scroll + expand) and exports to JSON/CSV/XLSX (plus Copy JSON).
// @author       sharmanhall
// @match        https://www.houzz.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=houzz.com
// @downloadURL https://update.greasyfork.org/scripts/564378/Houzz%20Reviews%20Exporter%20%28Load%20%2B%20Export%20JSONCSVXLSX%20%2B%20Copy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564378/Houzz%20Reviews%20Exporter%20%28Load%20%2B%20Export%20JSONCSVXLSX%20%2B%20Copy%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // =========================
  // CONFIG / STATE
  // =========================
  const CONFIG = {
    scrollDelayMs: 900,
    clickDelayMs: 180,
    maxScrollAttempts: 160,
    noChangeBreakCount: 6,
    // Expand buttons commonly seen on Houzz:
    expandButtonText: ['read more', 'see more', 'more', 'read full review', 'show more'],
    // If true, try to scroll within a detected reviews container; otherwise scroll the page.
    preferInnerScrollContainer: true,
  };

  const STATE = {
    running: false,
    stop: false,
    loadedCount: 0,
    totalEstimate: null,
    profile: null,
  };

  const log = (...args) => console.log('[Houzz Exporter]', ...args);
  const warn = (...args) => console.warn('[Houzz Exporter]', ...args);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // =========================
  // HELPERS
  // =========================
  const sanitizeFilename = (name) =>
    String(name || 'houzz')
      .replace(/[\\/:*?"<>|]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 140) || 'houzz';

  const dateStamp = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseIntSafe = (v) => {
    const n = parseInt(String(v || '').replace(/[^\d]/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const csvEscape = (value) => {
    const s = String(value ?? '');
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const blobDownload = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    GM_download({
      url,
      name: filename,
      saveAs: true,
      onload: () => URL.revokeObjectURL(url),
      onerror: (e) => {
        URL.revokeObjectURL(url);
        warn('Download error:', e);
        alert('Download failed. Check console for details.');
      },
    });
  };

  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();

  // =========================
  // FIND REVIEWS + CONTAINER
  // =========================
  function getReviewCards() {
    // Houzz DOM can vary a lot; keep this broad but targeted.
    const selectors = [
      '[data-qa*="review"]',
      '[class*="review"]',
      'article',
      'li',
    ];

    // Collect candidates and filter to "looks like a review"
    const nodes = new Set();
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) nodes.add(el);
    }

    const out = [];
    for (const el of nodes) {
      if (!(el instanceof Element)) continue;

      const text = (el.innerText || '').toLowerCase();
      // Heuristics: star rating or "review" phrasing or common review metadata.
      const hasStars =
        el.querySelector('[aria-label*="star"]') ||
        el.querySelector('[class*="star"]') ||
        /(\b[1-5](?:\.\d)?\b)\s*(stars?|star rating)/i.test(el.getAttribute('aria-label') || '') ||
        /\b[1-5](?:\.\d)?\b\s*stars?\b/.test(text);

      const hasReviewerClue =
        /reviewed|would recommend|project|client|verified|houzz user|homeowner/i.test(text) ||
        !!el.querySelector('time') ||
        !!el.querySelector('a[href*="/user/"]');

      const hasBodyClue =
        (el.querySelector('p') && (el.querySelector('p')?.textContent || '').length > 30) ||
        /\b(read more|see more)\b/.test(text);

      if (hasStars && (hasReviewerClue || hasBodyClue)) out.push(el);
    }

    // De-dupe by DOM reference (already) and prefer smaller cards (avoid huge containers)
    // Sort so inner cards come before giant wrappers.
    out.sort((a, b) => (a.querySelectorAll('*').length - b.querySelectorAll('*').length));

    // Reduce to distinct cards by preventing parent containers from dominating:
    const filtered = [];
    for (const el of out) {
      if (filtered.some((x) => x.contains(el))) continue; // keep the more specific node
      filtered.push(el);
    }

    return filtered;
  }

  function findReviewsScrollContainer() {
    if (!CONFIG.preferInnerScrollContainer) return document.scrollingElement || document.documentElement;

    const candidates = [
      '[data-qa*="reviews"]',
      '[id*="review"]',
      '[class*="review"]',
      'main',
      'section',
      'div',
    ];

    // First: any element that looks like a review list AND actually scrolls.
    const els = [];
    for (const sel of candidates) {
      for (const el of document.querySelectorAll(sel)) {
        if (!(el instanceof Element)) continue;
        const style = getComputedStyle(el);
        const canScroll = /(auto|scroll)/.test(style.overflowY || '') && el.scrollHeight > el.clientHeight + 80;
        if (!canScroll) continue;

        const t = (el.innerText || '').toLowerCase();
        if (t.includes('review') || t.includes('reviews')) els.push(el);
      }
    }
    if (els.length) return els.sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

    // Fallback to page scroll
    return document.scrollingElement || document.documentElement;
  }

  // =========================
  // PROFILE INFO EXTRACTION
  // =========================
  function extractProfileInfo() {
    const info = {
      name: '',
      url: location.href,
      rating: null,
      totalReviews: 0,
      category: '',
      location: '',
      scraped_at: new Date().toISOString(),
    };

    // Name
    const h1 = document.querySelector('h1') || document.querySelector('[data-qa="profile-name"]');
    if (h1?.textContent) info.name = norm(h1.textContent);

    if (!info.name) {
      const t = document.title || '';
      info.name = norm(t.replace(/\s*\|\s*Houzz.*$/i, '')) || '';
    }

    // Rating + total reviews: attempt from visible text near "Reviews"
    const bodyText = document.body?.innerText || '';
    const ratingMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*(?:out of\s*5)?\s*(?:stars?|star rating)/i);
    if (ratingMatch) {
      const r = parseFloat(ratingMatch[1]);
      if (r >= 0 && r <= 5) info.rating = r;
    } else {
      // Some UIs have aria-label like "4.9 star rating"
      const starEl = document.querySelector('[aria-label*="star rating" i]') || document.querySelector('[aria-label*="stars" i]');
      const al = starEl?.getAttribute?.('aria-label') || '';
      const m = al.match(/(\d+(?:\.\d+)?)/);
      if (m) {
        const r = parseFloat(m[1]);
        if (r >= 0 && r <= 5) info.rating = r;
      }
    }

    const totalMatch =
      bodyText.match(/([\d,]+)\s+reviews?\b/i) ||
      bodyText.match(/Reviews?\s*\(?([\d,]+)\)?/i);
    if (totalMatch) {
      const n = parseIntSafe(totalMatch[1]);
      if (n > 0 && n < 5_000_000) info.totalReviews = n;
    }

    // Category/location (best-effort: look for common header subtext blocks)
    const headerTextCandidates = [
      '[data-qa*="pro-category"]',
      '[data-qa*="category"]',
      '[class*="category"]',
      '[class*="location"]',
      '[data-qa*="location"]',
    ];

    for (const sel of headerTextCandidates) {
      const el = document.querySelector(sel);
      const t = norm(el?.textContent);
      if (!t) continue;

      // crude split; Houzz often shows "Category • Location"
      if (!info.category && /[A-Za-z]/.test(t) && t.length < 80 && !/review/i.test(t)) info.category = t;
      if (!info.location && /[A-Za-z]/.test(t) && t.length < 80 && !/review/i.test(t)) info.location = t;
    }

    return info;
  }

  // =========================
  // REVIEW EXTRACTION
  // =========================
  function parseReviewDateRaw(raw) {
    const text = norm(raw);
    if (!text) return { raw: '', estimated: 'unknown', timestamp: null };

    // Try <time datetime="">
    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) {
      return { raw: text, estimated: parsed.toISOString().slice(0, 10), timestamp: parsed.getTime() };
    }

    return { raw: text, estimated: 'unknown', timestamp: null };
  }

  function extractStars(card) {
    // Try aria-labels first
    const ariaStar =
      card.querySelector('[aria-label*="star" i]') ||
      card.querySelector('[role="img"][aria-label*="star" i]') ||
      card.querySelector('[class*="star"][aria-label]');

    const aria = ariaStar?.getAttribute?.('aria-label') || '';
    let m = aria.match(/(\d+(?:\.\d+)?)/);
    if (m) {
      const r = parseFloat(m[1]);
      if (r >= 0 && r <= 5) return r;
    }

    // Try counting filled stars by classes (very variable)
    const stars = card.querySelectorAll('[class*="star"]');
    if (stars?.length) {
      // If there are 5 icons and some are "filled"/"active"
      const filled = [...stars].filter((s) => /(filled|active|on)/i.test(s.className)).length;
      if (filled >= 0 && filled <= 5) return filled || null;
    }

    // Text fallback: "5 stars"
    const t = (card.innerText || '').match(/\b([1-5](?:\.\d)?)\s*stars?\b/i);
    if (t) return parseFloat(t[1]);

    return null;
  }

  function extractReviewer(card) {
    const out = { name: '', profileUrl: '', location: '' };

    // Name
    const nameCandidates = [
      '[data-qa*="reviewer" i]',
      '[class*="reviewer" i]',
      'a[href*="/user/"]',
      'a[href*="/users/"]',
      'strong',
    ];

    for (const sel of nameCandidates) {
      const el = card.querySelector(sel);
      const txt = norm(el?.textContent);
      if (!txt) continue;
      // avoid grabbing "Read more" etc
      if (txt.length < 2) continue;
      if (/read more|see more|more$/i.test(txt)) continue;

      out.name = txt;
      if (el?.closest('a')?.href) out.profileUrl = el.closest('a').href;
      if (el?.tagName === 'A' && el.href) out.profileUrl = el.href;
      break;
    }

    // Location (sometimes near name)
    const locEl =
      card.querySelector('[data-qa*="reviewer-location" i]') ||
      card.querySelector('[class*="reviewerLocation" i]') ||
      card.querySelector('[class*="location" i]');
    const loc = norm(locEl?.textContent);
    if (loc && loc.length < 80 && !/review/i.test(loc)) out.location = loc;

    return out;
  }

  function extractReviewText(card) {
    // Prefer longer text blocks
    const candidates = [
      '[data-qa*="review-text" i]',
      '[class*="reviewText" i]',
      '[class*="review-text" i]',
      'p',
      'div',
    ];

    let best = '';
    for (const sel of candidates) {
      const els = card.querySelectorAll(sel);
      for (const el of els) {
        const t = norm(el?.textContent);
        if (!t) continue;
        // avoid UI labels
        if (/read more|see more|helpful|report|share/i.test(t) && t.length < 40) continue;
        if (t.length > best.length) best = t;
      }
      if (best.length > 120) break;
    }
    return best;
  }

  function extractReviewTitle(card) {
    // Some Houzz reviews have a short title/headline
    const titleCandidates = [
      '[data-qa*="review-title" i]',
      '[class*="reviewTitle" i]',
      'h3',
      'h4',
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

    // Project details (best effort from the card text)
    const raw = card.innerText || '';
    const projectTypeMatch = raw.match(/\bProject\s*(?:Type)?\s*[:\-]\s*(.+?)(?:\n|$)/i);
    const projectLocationMatch = raw.match(/\bProject\s*(?:Location)?\s*[:\-]\s*(.+?)(?:\n|$)/i);

    return {
      review_id: makeStableReviewId(card, idx),
      reviewer_name: reviewer.name,
      reviewer_profile_url: reviewer.profileUrl,
      reviewer_location: reviewer.location,
      star_rating: stars,
      review_date_raw: dateInfo.raw,
      review_date_estimated: dateInfo.estimated,
      review_date_timestamp: dateInfo.timestamp,
      review_title: title,
      review_text: text,
      review_photos: photos,
      review_photo_count: photos.length,
      project_type: projectTypeMatch ? norm(projectTypeMatch[1]) : '',
      project_location: projectLocationMatch ? norm(projectLocationMatch[1]) : '',
      pro_response: response,
      has_pro_response: !!response,
      scraped_at: new Date().toISOString(),
    };
  }

  // =========================
  // EXPAND + LOAD
  // =========================
  async function expandAllVisible() {
    const cards = getReviewCards();
    if (!cards.length) return;

    let clicked = 0;
    const texts = CONFIG.expandButtonText.map((t) => t.toLowerCase());
    const seen = new Set();

    for (const card of cards) {
      if (STATE.stop) break;

      // buttons/links inside the card that match our "expand" text
      const clickable = [
        ...card.querySelectorAll('button'),
        ...card.querySelectorAll('a'),
        ...card.querySelectorAll('[role="button"]'),
      ];

      for (const el of clickable) {
        if (STATE.stop) break;
        if (!el || seen.has(el)) continue;

        const t = (el.textContent || '').trim().toLowerCase();
        if (!t) continue;
        if (!texts.some((x) => t === x || t.includes(x))) continue;

        // Avoid clicking unrelated "More" in nav/menus
        const rect = el.getBoundingClientRect();
        if (rect.width < 20 || rect.height < 10) continue;

        seen.add(el);
        try {
          el.click();
          clicked++;
          await sleep(CONFIG.clickDelayMs);
        } catch (_) {}
      }
    }

    if (clicked) log(`Expanded ${clicked} truncated review(s).`);
  }

  async function loadAllReviews(update) {
    const scrollEl = findReviewsScrollContainer();

    let attempts = 0;
    let noChange = 0;
    let lastCount = 0;

    while (!STATE.stop && attempts < CONFIG.maxScrollAttempts) {
      attempts++;

      // Scroll down
      try {
        if (scrollEl === document.scrollingElement || scrollEl === document.documentElement || scrollEl === document.body) {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        } else {
          scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
        }
      } catch (_) {}

      await sleep(CONFIG.scrollDelayMs);
      await expandAllVisible();

      const count = getReviewCards().length;
      STATE.loadedCount = count;
      if (update) update(count, STATE.totalEstimate, attempts, noChange);

      if (count <= lastCount) {
        noChange++;
        if (noChange >= CONFIG.noChangeBreakCount) break;
      } else {
        noChange = 0;
        lastCount = count;
      }
    }

    // slight scroll up so the page doesn't look "stuck" at the bottom
    try {
      if (scrollEl !== document.scrollingElement && scrollEl !== document.documentElement && scrollEl !== document.body) {
        scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (_) {}

    log(`Load complete. Review cards detected: ${STATE.loadedCount}`);
  }

  // =========================
  // SCRAPE + EXPORT
  // =========================
  function scrapeAllLoadedReviews() {
    const cards = getReviewCards();

    const out = [];
    const seen = new Set();

    cards.forEach((card, idx) => {
      try {
        const r = extractReview(card, idx);

        // De-dupe key
        const key = [
          r.reviewer_name || '',
          r.review_date_estimated || '',
          r.star_rating ?? '',
          (r.review_text || '').slice(0, 80),
        ].join('|');

        if (seen.has(key)) return;
        seen.add(key);

        out.push(r);
      } catch (e) {
        warn('Failed extracting a review:', e);
      }
    });

    return out;
  }

  function buildPayload(reviews) {
    return {
      metadata: {
        profile: STATE.profile,
        exported_at: new Date().toISOString(),
        review_count: reviews.length,
        source: 'Houzz DOM scrape (client-side)',
      },
      reviews,
    };
  }

  function exportJSON() {
    const reviews = scrapeAllLoadedReviews();
    const payload = buildPayload(reviews);
    const name = `${sanitizeFilename(STATE.profile?.name)}_houzz_reviews_${dateStamp()}.json`;
    blobDownload(JSON.stringify(payload, null, 2), name, 'application/json;charset=utf-8');
  }

  function exportCSV() {
    const reviews = scrapeAllLoadedReviews();
    const p = STATE.profile || {};

    const headers = [
      'profile_name',
      'profile_url',
      'profile_rating',
      'profile_total_reviews',
      'profile_category',
      'profile_location',
      'review_id',
      'reviewer_name',
      'reviewer_profile_url',
      'reviewer_location',
      'star_rating',
      'review_date_raw',
      'review_date_estimated',
      'review_title',
      'review_text',
      'review_photo_count',
      'review_photos',
      'project_type',
      'project_location',
      'has_pro_response',
      'pro_response_text',
      'scraped_at',
    ];

    const rows = reviews.map((r) => ([
      p.name || '',
      p.url || location.href,
      p.rating ?? '',
      p.totalReviews ?? '',
      p.category || '',
      p.location || '',
      r.review_id || '',
      r.reviewer_name || '',
      r.reviewer_profile_url || '',
      r.reviewer_location || '',
      r.star_rating ?? '',
      r.review_date_raw || '',
      r.review_date_estimated || '',
      r.review_title || '',
      r.review_text || '',
      r.review_photo_count ?? 0,
      (r.review_photos || []).join(' | '),
      r.project_type || '',
      r.project_location || '',
      r.has_pro_response ? 'yes' : 'no',
      r.pro_response?.response_text || '',
      r.scraped_at || '',
    ]));

    const csv =
      headers.map(csvEscape).join(',') + '\n' +
      rows.map((row) => row.map(csvEscape).join(',')).join('\n');

    const name = `${sanitizeFilename(STATE.profile?.name)}_houzz_reviews_${dateStamp()}.csv`;
    blobDownload(csv, name, 'text/csv;charset=utf-8');
  }

  function exportXLSX() {
    if (typeof XLSX === 'undefined') {
      alert('XLSX library not available. Use CSV export instead.');
      return;
    }

    const reviews = scrapeAllLoadedReviews();
    const p = STATE.profile || {};

    const flat = reviews.map((r) => ({
      profile_name: p.name || '',
      profile_url: p.url || location.href,
      profile_rating: p.rating ?? '',
      profile_total_reviews: p.totalReviews ?? '',
      profile_category: p.category || '',
      profile_location: p.location || '',
      review_id: r.review_id || '',
      reviewer_name: r.reviewer_name || '',
      reviewer_profile_url: r.reviewer_profile_url || '',
      reviewer_location: r.reviewer_location || '',
      star_rating: r.star_rating ?? '',
      review_date_raw: r.review_date_raw || '',
      review_date_estimated: r.review_date_estimated || '',
      review_title: r.review_title || '',
      review_text: r.review_text || '',
      review_photo_count: r.review_photo_count ?? 0,
      review_photos: (r.review_photos || []).join(' | '),
      project_type: r.project_type || '',
      project_location: r.project_location || '',
      has_pro_response: r.has_pro_response ? 'yes' : 'no',
      pro_response_text: r.pro_response?.response_text || '',
      scraped_at: r.scraped_at || '',
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
      const total = totalMaybe && totalMaybe > 0 ? totalMaybe : null;
      countEl.textContent = `Loaded: ${loaded}${total ? ` / ~${total}` : ''}  (scroll ${attempt}, no-change ${noChange})`;
      const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : Math.min(100, loaded > 0 ? 30 : 0);
      barEl.style.width = `${pct}%`;
    };

    function refreshProfileDisplay() {
      STATE.profile = extractProfileInfo();
      const p = STATE.profile || {};
      const rating = p.rating != null ? `⭐ ${p.rating}` : '';
      const total = p.totalReviews ? `(${p.totalReviews} reviews)` : '';
      const meta = [p.category, p.location].filter(Boolean).join(' • ');
      profEl.innerHTML = `
        <div style="font-weight:700;">${(p.name || 'Unknown profile')}</div>
        <div style="margin-top:4px;opacity:0.9;">${rating} ${total}</div>
        ${meta ? `<div style="margin-top:4px;opacity:0.85;">${meta}</div>` : ''}
      `;
      STATE.totalEstimate = p.totalReviews || null;
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

      const finalCount = getReviewCards().length;
      setProgress(finalCount, STATE.totalEstimate, 0, 0);

      setStatus('Exporting JSON + CSV + XLSX…');
      try { exportJSON(); } catch (e) { warn('JSON export failed:', e); }
      try { exportCSV(); } catch (e) { warn('CSV export failed:', e); }
      try { exportXLSX(); } catch (e) { warn('XLSX export failed:', e); }

      setStatus(`Done. Extracted ${scrapeAllLoadedReviews().length} review(s).`);
      STATE.running = false;
    });

    // Initial hidden state
    if (GM_getValue('uiHiddenHouzz', false)) wrap.style.display = 'none';

    return { setStatus, setProgress, refreshProfileDisplay };
  }

  // =========================
  // MENU COMMANDS
  // =========================
  GM_registerMenuCommand('Houzz: Load reviews (scroll + expand)', async () => {
    if (STATE.running) return;
    STATE.stop = false;
    STATE.running = true;
    STATE.profile = extractProfileInfo();
    await loadAllReviews();
    STATE.running = false;
    alert(`Load done. Review cards detected: ${getReviewCards().length}`);
  });

  GM_registerMenuCommand('Houzz: Export JSON (loaded only)', () => {
    STATE.profile = extractProfileInfo();
    exportJSON();
  });

  GM_registerMenuCommand('Houzz: Export CSV (loaded only)', () => {
    STATE.profile = extractProfileInfo();
    exportCSV();
  });

  GM_registerMenuCommand('Houzz: Export XLSX (loaded only)', () => {
    STATE.profile = extractProfileInfo();
    exportXLSX();
  });

  GM_registerMenuCommand('Houzz: Copy JSON (loaded only)', () => {
    STATE.profile = extractProfileInfo();
    copyJSONToClipboard();
  });

  // =========================
  // BOOT
  // =========================
  function boot() {
    makeUI();
    log('Ready. Open a Houzz page with visible reviews, then export.');
  }

  setTimeout(boot, 1200);
})();