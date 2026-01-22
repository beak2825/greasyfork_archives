// ==UserScript==
// @name         Bitcointalk BRDb Score (Profile + Threads) - Lazy Load + Cache + Fix URL + Auto-Refresh
// @namespace    http://tampermonkey.net/
// @version      0.14.0
// @description  BRDb score + Dormant/Former/Reactivated + 120-day posts/merits chart (profile + threads) with lazy load, localStorage caching, URL fix, and auto-refresh
// @author       Ace
// @match        https://bitcointalk.org/index.php?action=profile*
// @match        https://bitcointalk.org/index.php?topic=*
// @grant        GM_xmlhttpRequest
// @connect      bitlist.co
// @connect      bitcointalk.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562627/Bitcointalk%20BRDb%20Score%20%28Profile%20%2B%20Threads%29%20-%20Lazy%20Load%20%2B%20Cache%20%2B%20Fix%20URL%20%2B%20Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/562627/Bitcointalk%20BRDb%20Score%20%28Profile%20%2B%20Threads%29%20-%20Lazy%20Load%20%2B%20Cache%20%2B%20Fix%20URL%20%2B%20Auto-Refresh.meta.js
// ==/UserScript==

(function() {
'use strict';

/* ---------------- RATE LIMIT QUEUE ---------------- */
const QUEUE = [];
let RUNNING = false;
const RATE_MS = 1100;

function enqueue(fn) {
  QUEUE.push(fn);
  if (!RUNNING) runQueue();
}

async function runQueue() {
  RUNNING = true;
  while (QUEUE.length) {
    const fn = QUEUE.shift();
    try { await fn(); } catch (e) { console.error(e); }
    await new Promise(r => setTimeout(r, RATE_MS));
  }
  RUNNING = false;
}

/* ---------------- DATE HELPERS ---------------- */
function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

/* ---------------- EXTRACT USERID ---------------- */
function extractUserIdFromPage() {
  let uid = location.search.match(/u=(\d+)/)?.[1];
  if (uid) return uid;

  const meritLink = document.querySelector('a[href*="action=merit;u="]');
  if (meritLink) {
    const href = meritLink.getAttribute('href');
    const match = href.match(/u=(\d+)/);
    if (match) return match[1];
  }

  const profileLink = document.querySelector('a[href*="action=profile;u="]');
  if (profileLink) {
    const href = profileLink.getAttribute('href');
    const match = href.match(/u=(\d+)/);
    if (match) return match[1];
  }

  return null;
}

function extractUserIdFromUrl(url) {
  return url.match(/u=(\d+)/)?.[1] || null;
}

/* ---------------- FETCH PROFILE HTML (THREADS) ---------------- */
function fetchProfileHTML(uid) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://bitcointalk.org/index.php?action=profile;u=${uid}&_=${Date.now()}`,
      onload: r => resolve(r.responseText),
      onerror: reject
    });
  });
}

/* ---------------- PROFILE PARSING ---------------- */
function getProfileNumberFromDoc(doc, label) {
  for (const r of doc.querySelectorAll('tr')) {
    const b = r.querySelector('td b');
    if (b && b.textContent.includes(label)) {
      const text = r.querySelectorAll('td')[1].textContent.trim();
      const m = text.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    }
  }
  return 0;
}

function getProfileDateFromDoc(doc, label) {
  for (const r of doc.querySelectorAll('tr')) {
    const b = r.querySelector('td b');
    if (b && b.textContent.includes(label)) {
      const t = r.querySelectorAll('td')[1].textContent;
      if (t && t !== '(Recently)') return new Date(t);
    }
  }
  return new Date();
}

function getProfileNumber(label) { return getProfileNumberFromDoc(document, label); }
function getProfileDate(label) { return getProfileDateFromDoc(document, label); }

/* ---------------- FETCH 120D DATA ---------------- */
async function fetchMeritsAndPosts120(userUid) {
  const dateMin = getDateNDaysAgo(120);
  const dMax = new Date(); dMax.setDate(dMax.getDate() + 1);
  const dateMax = dMax.toISOString().split('T')[0];
  const cacheBust = Date.now();

  const url = `https://bitlist.co/trpc/posts.posts_per_day_histogram,merits.user_merits_per_day_histogram,posts.top_boards_by_post_count?batch=1&input=${
    encodeURIComponent(JSON.stringify({
      "0": { "json": { "date_min": dateMin, "date_max": dateMax, "author_uid": +userUid, "interval": "day" } },
      "1": { "json": { "date_min": dateMin, "date_max": dateMax, "user_uid": +userUid, "type": "received", "interval": "day" } },
      "2": { "json": { "date_min": dateMin, "date_max": dateMax, "author_uid": +userUid, "interval": "day" } }
    }))
  }&_=${cacheBust}`;

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: r => {
        try {
          const d = JSON.parse(r.responseText);
          const postsHistogram = d[0]?.result?.data?.json?.histogram || [];
          const meritsHistogram = d[1]?.result?.data?.json?.histogram || [];
          const posts120 = d[2]?.result?.data?.json?.total_posts_count || 0;

          const postsLast120 = Array(120).fill(0);
          const meritsLast120 = Array(120).fill(0);
          const baseDate = new Date(dateMin);

          postsHistogram.forEach(day => {
            const date = new Date(day.key_as_string);
            const index = Math.round((date - baseDate) / 86400000);
            if (index >= 0 && index < 120) postsLast120[index] = day.doc_count || 0;
          });

          meritsHistogram.forEach(day => {
            const date = new Date(day.key_as_string);
            const index = Math.round((date - baseDate) / 86400000);
            if (index >= 0 && index < 120) {
              // Debug: log the day data to check structure
              console.log("Merit day data:", day);
              meritsLast120[index] += day.merits_sum?.value || day.value || day.sum || 0;
            }
          });

          const merit120 = meritsLast120.reduce((s, m) => s + m, 0);
          resolve({ merit120, posts120, postsLast120, meritsLast120 });
        } catch (e) { reject(e); }
      },
      onerror: reject
    });
  });
}

/* ---------------- LOCALSTORAGE CACHING ---------------- */
function getCacheKey(uid) {
  return `BRDb_${uid}`;
}

function getCachedData(uid) {
  const key = getCacheKey(uid);
  const cached = localStorage.getItem(key);
  return cached ? JSON.parse(cached) : null;
}

function setCachedData(uid, data) {
  const key = getCacheKey(uid);
  localStorage.setItem(key, JSON.stringify(data));
}

function isCacheValid(cachedData) {
  if (!cachedData || !cachedData.timestamp) return false;
  const now = Date.now();
  const cacheAgeHours = (now - cachedData.timestamp) / (1000 * 60 * 60);
  return cacheAgeHours < 1; // Cache valida per 1 ora
}

/* ---------------- FORMULAS ---------------- */
function calculateScores(posts, meritTotal, posts120, merit120, postsLast120, regDate, lastActiveDate) {
  const ageDays = Math.max((Date.now() - regDate) / 86400000, 1);
  const inactiveDays = Math.max((Date.now() - lastActiveDate) / 86400000, 0);

  const isHistoricalUser = ageDays > 365 * 10 && posts120 === 0 && merit120 === 0;
  if (isHistoricalUser) { postsLast120 = Array(120).fill(0); merit120 = 0; }

  const Q_hist = (meritTotal / Math.max(posts, 1)) * Math.sqrt(posts);
  const Q_120 = (posts120 > 0) ? (merit120 / posts120) * Math.sqrt(posts120) : 0;

  const Reputation = 0.7 * Q_hist + 0.3 * Q_120;
  const relPosts = Math.min(posts / 100, 1);
  const relAge = Math.min(ageDays / 180, 1);
  const Reliability = relPosts * relAge;

  let badgeDormant = false, badgeFormer = false, badgeReactivated = false;
  if (inactiveDays > 730 && posts120 === 0 && merit120 === 0) badgeFormer = true;
  else if (inactiveDays > 120 && posts120 === 0) badgeDormant = true;

  const activeDays120 = postsLast120.filter(p => p > 0).length;
  if (badgeDormant && merit120 > 0 && activeDays120 >= 8 && !isHistoricalUser) {
    badgeReactivated = true; badgeDormant = false;
  }

  let FinalScore = Reputation * (0.4 + 0.6 * Reliability);
  if (badgeFormer || isHistoricalUser) FinalScore = 0;

  const promising = ageDays < 60 && posts < 10 && meritTotal < 100;

  return { Reputation, Reliability, FinalScore, promising, badgeDormant, badgeFormer, badgeReactivated, isHistoricalUser };
}

function calcBRDb(Reputation, merit120, posts120, badgeFormer, isHistoricalUser) {
  if (isHistoricalUser) return 1;
  let base = Math.log10(Reputation + 1) * 3;
  const activityBoost = Math.min((merit120 + posts120 / 2) / 300, 1) * 2;
  let score = base + activityBoost;
  if (badgeFormer) score = Math.max(1, Math.min(score, 5));
  return Math.max(1, Math.min(10, score));
}

function statusLabel(p, d, f, r, h) {
  if (h) return 'Historical';
  if (p) return 'Promising';
  if (r) return 'Reactivated';
  if (f) return 'Former';
  if (d) return 'Dormant';
  return 'Active';
}

function statusColor(s) {
  if (s === 'Active') return '#22c55e';
  if (s === 'Dormant') return '#facc15';
  if (s === 'Reactivated') return '#38bdf8';
  if (s === 'Former') return '#ef4444';
  if (s === 'Promising') return '#a855f7';
  if (s === 'Historical') return '#999';
  return '#999';
}

/* ---------------- UI PROFILE ---------------- */
function insertBRDbRow(data) {
  const meritLink = document.querySelector('a[href*="action=merit"]');
  if (!meritLink) return;
  const baseRow = meritLink.closest('tr');

  const tr = document.createElement('tr');
  tr.innerHTML = `<td><b>BRDb:</b></td>
  <td id="brdb-cell" style="cursor:pointer">
      <b>⭐ ${data.BRDb.toFixed(1)}</b>
      <span style="color:${data.color};font-weight:bold"> — ${data.status}</span>
  </td>`;
  baseRow.after(tr);

  attachDashboardTooltip(tr.querySelector('#brdb-cell'), data);
}

/* ---------------- UI THREAD ---------------- */
function insertThreadBadge(nameEl, data) {
  const s = document.createElement('span');
  s.textContent = ` ⭐${data.BRDb.toFixed(1)}`;
  s.style.cssText = `color:${data.color};font-weight:bold;margin-left:4px;cursor:pointer`;
  nameEl.after(s);
  attachDashboardTooltip(s, data);
}

/* ---------------- DASHBOARD TOOLTIP ---------------- */
function attachDashboardTooltip(td, data) {
  const tip = document.createElement('div');
  tip.style.cssText = `
    position:absolute; display:none; z-index:99999;
    background:linear-gradient(145deg,#0b1220,#111827);
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 20px 50px rgba(0,0,0,.8), inset 0 0 0 1px rgba(255,255,255,.05);
    border-radius:16px; padding:14px; min-width:280px;
    color:#e5e7eb; font-family:system-ui;
  `;

  function generateChart(postsLast120, meritsLast120) {
    const width = 240;
    const height = 80;
    const maxPosts = Math.max(...postsLast120, 1);
    const maxMerits = Math.max(...meritsLast120, 1);

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
      style="background:#020617;border-radius:10px;padding:8px;margin-top:10px;">`;

    svg += `<polyline fill="none" stroke="#22c55e" stroke-width="2"
      points="${postsLast120.map((p, i) =>
        `${i * (width / 119)},${height - (p / maxPosts * (height - 16))}`
      ).join(' ')}"
      style="stroke-linecap:round;stroke-linejoin:round;" />`;

    svg += `<polyline fill="none" stroke="#38bdf8" stroke-width="2"
      points="${meritsLast120.map((m, i) =>
        `${i * (width / 119)},${height - (m / maxMerits * (height - 16))}`
      ).join(' ')}"
      style="stroke-linecap:round;stroke-linejoin:round;" />`;

    svg += `</svg>`;
    return svg;
  }

  const finalRow = Math.abs(data.FinalScore - data.Reputation) > 0.01
    ? `<div style="margin-top:10px;padding:6px;border-radius:10px;background:#1f2933;text-align:center">
         🎯 Final Score <b>${data.FinalScore.toFixed(2)}</b>
       </div>` : '';

  tip.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <div style="font-size:26px">⭐ ${data.BRDb.toFixed(1)}</div>
      <span style="background:${data.color};color:#000;padding:2px 8px;border-radius:999px;font-weight:700">
        ${data.status}
      </span>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Reputation</div>
        <b>${data.Reputation.toFixed(2)}</b>
      </div>

      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Reliability</div>
        <b>${(data.Reliability * 100).toFixed(0)}%</b>
        <div style="height:4px;background:#111;border-radius:5px;margin-top:4px">
          <div style="height:100%;width:${data.Reliability * 100}%;background:#22c55e;border-radius:5px"></div>
        </div>
      </div>

      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Posts (120d)</div>
        <b>${data.posts120}</b>
      </div>

      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Merits (120d)</div>
        <b>${data.merit120}</b>
      </div>

      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Merit/Post</div>
        <b>${data.avgAll.toFixed(2)}</b>
      </div>

      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Merit/Post (120d)</div>
        <b>${data.avg120.toFixed(2)}</b>
      </div>

      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Impact Total</div>
        <b>${data.impactAll.toFixed(0)}</b>
      </div>

      <div style="background:#020617;padding:8px;border-radius:10px">
        <div style="font-size:11px;opacity:.7">Impact (120d)</div>
        <b>${data.impact120.toFixed(0)}</b>
      </div>
    </div>

    <div style="margin-top:10px;text-align:center">
      <div style="font-size:11px;opacity:.7;margin-bottom:4px">Last 120 days</div>
      ${generateChart(data.postsLast120, data.meritsLast120)}

      <div style="display:flex;justify-content:center;gap:14px;margin-top:6px;font-size:11px;opacity:.8">
        <span style="display:flex;align-items:center;gap:4px">
          <span style="width:10px;height:2px;background:#22c55e;display:inline-block"></span> Posts
        </span>
        <span style="display:flex;align-items:center;gap:4px">
          <span style="width:10px;height:2px;background:#38bdf8;display:inline-block"></span> Merits
        </span>
      </div>
    </div>

    ${finalRow}
  `;

  document.body.appendChild(tip);

  function show() {
    const r = td.getBoundingClientRect();
    tip.style.left = r.left + 'px';
    tip.style.top = (r.bottom + 6 + window.scrollY) + 'px';
    tip.style.display = 'block';
  }
  function hide() { tip.style.display = 'none'; }

  td.addEventListener('click', e => { e.stopPropagation(); tip.style.display === 'block' ? hide() : show(); });
  document.addEventListener('click', hide);
  window.addEventListener('scroll', hide);
  window.addEventListener('resize', hide);
}

/* ---------------- MAIN PROFILE (LAZY + CACHE + FIX URL) ---------------- */
async function mainProfile() {
  try {
    const uid = extractUserIdFromPage();
    if (!uid) {
      console.warn("BRDb: User ID not found in URL or page.");
      return;
    }

    // Check cache
    const cachedData = getCachedData(uid);
    if (cachedData && isCacheValid(cachedData)) {
      insertBRDbRow(cachedData);
      return;
    }

    // Fetch fresh data
    const { merit120, posts120, postsLast120, meritsLast120 } = await fetchMeritsAndPosts120(uid);

    const posts = getProfileNumber('Posts');
    const meritTotal = getProfileNumber('Merit');
    const regDate = getProfileDate('Date Registered');
    const lastActiveDate = getProfileDate('Last Active');

    const r = calculateScores(posts, meritTotal, posts120, merit120, postsLast120, regDate, lastActiveDate);
    const BRDb = calcBRDb(r.Reputation, merit120, posts120, r.badgeFormer, r.isHistoricalUser);
    const status = statusLabel(r.promising, r.badgeDormant, r.badgeFormer, r.badgeReactivated, r.isHistoricalUser);

    const data = {
      BRDb, status, color: statusColor(status),
      Reputation: r.Reputation, Reliability: r.Reliability, FinalScore: r.FinalScore,
      posts120, merit120,
      avgAll: posts > 0 ? meritTotal / posts : 0,
      avg120: posts120 > 0 ? merit120 / posts120 : 0,
      impactAll: meritTotal * 1.5 + posts * 0.5,
      impact120: merit120 * 1.5 + posts120 * 0.5,
      postsLast120, meritsLast120,
      timestamp: Date.now()
    };

    setCachedData(uid, data);
    insertBRDbRow(data);

  } catch (e) { console.error("BRDb error:", e); }
}

/* ---------------- MAIN THREAD (LAZY + CACHE) ---------------- */
function mainThread() {
  const users = [...document.querySelectorAll('.poster_info b a[href*="action=profile;u="]')];

  // Lazy load: process only visible users on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const a = entry.target;
        const uid = extractUserIdFromUrl(a.href);
        if (!uid) return;

        enqueue(async () => {
          const cachedData = getCachedData(uid);
          if (cachedData && isCacheValid(cachedData)) {
            insertThreadBadge(a, cachedData);
            return;
          }

          const html = await fetchProfileHTML(uid);
          const doc = new DOMParser().parseFromString(html, 'text/html');

          const posts = getProfileNumberFromDoc(doc, 'Posts');
          const meritTotal = getProfileNumberFromDoc(doc, 'Merit');
          const regDate = getProfileDateFromDoc(doc, 'Date Registered');
          const lastActiveDate = getProfileDateFromDoc(doc, 'Last Active');

          const { merit120, posts120, postsLast120, meritsLast120 } = await fetchMeritsAndPosts120(uid);

          const r = calculateScores(posts, meritTotal, posts120, merit120, postsLast120, regDate, lastActiveDate);
          const BRDb = calcBRDb(r.Reputation, merit120, posts120, r.badgeFormer, r.isHistoricalUser);
          const status = statusLabel(r.promising, r.badgeDormant, r.badgeFormer, r.badgeReactivated, r.isHistoricalUser);

          const data = {
            BRDb, status, color: statusColor(status),
            Reputation: r.Reputation, Reliability: r.Reliability, FinalScore: r.FinalScore,
            posts120, merit120,
            avgAll: posts > 0 ? meritTotal / posts : 0,
            avg120: posts120 > 0 ? merit120 / posts120 : 0,
            impactAll: meritTotal * 1.5 + posts * 0.5,
            impact120: merit120 * 1.5 + posts120 * 0.5,
            postsLast120, meritsLast120,
            timestamp: Date.now()
          };

          setCachedData(uid, data);
          insertThreadBadge(a, data);
        });

        observer.unobserve(a);
      }
    });
  }, { threshold: 0.1 });

  users.forEach(a => observer.observe(a));
}

/* ---------------- AUTO-REFRESH ---------------- */
function setupAutoRefresh() {
  setInterval(() => {
    console.log("BRDb: Auto-refreshing data...");
    if (location.search.includes('action=profile')) {
      mainProfile();
    } else if (location.search.includes('topic=')) {
      const uid = extractUserIdFromPage();
      if (uid) {
        enqueue(async () => {
          const { merit120, posts120, postsLast120, meritsLast120 } = await fetchMeritsAndPosts120(uid);
          console.log("BRDb: Refreshed data - Merit120:", merit120, "Posts120:", posts120);
        });
      }
    }
  }, 1000 * 60 * 5); // 5 minutes
}

/* ---------------- START ---------------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    if (location.search.includes('action=profile')) mainProfile();
    else if (location.search.includes('topic=')) mainThread();
    setupAutoRefresh();
  }, 800);
});
})();