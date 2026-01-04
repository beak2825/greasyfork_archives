// ==UserScript==
// @name         SubsPlease Fine Enhancer
// @namespace    https://github.com/SonGokussj4/tampermonkey-subsplease-FineEnhancer
// @version      1.3.3
// @description  Adds image previews and AniList ratings to SubsPlease release listings. Click ratings to refresh. Settings via menu commands. Also manage favorites with visual highlights.
// @author       SonGokussj4
// @license      MIT
// @match        https://subsplease.org/
// @grant        GM_xmlhttpRequest
// @connect      graphql.anilist.co
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551548/SubsPlease%20Fine%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/551548/SubsPlease%20Fine%20Enhancer.meta.js
// ==/UserScript==

/* ------------------------------------------------------------------
 * CONFIG & CONSTANTS
 * ---------------------------------------------------------------- */
const DEBOUNCE_TIMER = 300; // ms
const CACHE_KEY = 'ratingCache';
const FAVORITES_KEY = 'spFavorites';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Menu commands for quick settings
GM_registerMenuCommand('Settings', showSettingsDialog);

/* ------------------------------------------------------------------
 * UTILITY FUNCTIONS
 * ---------------------------------------------------------------- */

/** Simple debounce wrapper */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/** Normalize anime title:
 * - Remove episode markers like "— 01" / "- 03"
 * - Remove episode ranges like "— 01-24"
 * - Remove version markers like "— 01v2"
 * - Remove "(Batch)" or other bracketed notes at the end
 */
function normalizeTitle(raw) {
  const normalized = raw
    .replace(/\s*\(Batch\)$/i, '') // remove "(Batch)" suffix
    .replace(/\s*[–—-]\s*\d+(?:[vV]\d+)?(?:\s*-\s*\d+(?:[vV]\d+)?)?$/i, '')
    .trim();
  console.debug(`normalizeTitle: ${raw} --> ${normalized}`);
  return normalized;
}

/** Convert milliseconds → "Xh Ym" */
function msToTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/** Normalize CSS size input into "NNpx" */
function normalizeSize(raw) {
  if (typeof raw === 'number') return raw + 'px';
  if (typeof raw === 'string') {
    raw = raw.trim();
    if (/^\d+$/.test(raw)) return raw + 'px';
    if (/^\d+px$/.test(raw)) return raw;
  }
  return '64px';
}

function readRatingCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    console.error('Failed to parse rating cache, clearing it.', e);
    localStorage.removeItem(CACHE_KEY);
    return {};
  }
}

function writeRatingCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to write rating cache.', e);
  }
}

const mediaRegistry = new Map();
const ratingFetches = new Map();

function getMediaEntry(normalizedTitle) {
  let entry = mediaRegistry.get(normalizedTitle);
  if (!entry) {
    entry = {
      releaseWrappers: new Set(),
      releaseStars: new Set(),
      ratingSpans: new Set(),
      scheduleRows: new Set(),
      scheduleStars: new Set(),
      primaryTitle: null,
    };
    mediaRegistry.set(normalizedTitle, entry);
  }
  return entry;
}

function pruneDisconnected(set) {
  for (const node of set) {
    if (!node.isConnected) {
      set.delete(node);
    }
  }
}

function applyFavoriteVisuals(normalizedTitle, isFav) {
  const entry = getMediaEntry(normalizedTitle);

  pruneDisconnected(entry.releaseWrappers);
  for (const wrapper of entry.releaseWrappers) {
    wrapper.classList.toggle('sp-favorite', isFav);
  }

  pruneDisconnected(entry.releaseStars);
  for (const star of entry.releaseStars) {
    star.innerHTML = isFav ? '★' : '☆';
    star.style.color = isFav ? '#ffd700' : '#666';
    star.title = isFav ? 'Click to remove favorite' : 'Click to add favorite';
  }

  pruneDisconnected(entry.scheduleRows);
  for (const row of entry.scheduleRows) {
    row.classList.toggle('sp-schedule-favorite', isFav);
  }

  pruneDisconnected(entry.scheduleStars);
  for (const star of entry.scheduleStars) {
    star.innerHTML = isFav ? '★' : '☆';
    star.style.color = isFav ? '#ffd700' : '#666';
    star.title = isFav ? 'Click to remove favorite' : 'Click to add favorite';
  }
}

function refreshFavoriteVisuals(normalizedTitle) {
  const favorites = getFavorites();
  const isFav = !!favorites[normalizedTitle];
  applyFavoriteVisuals(normalizedTitle, isFav);
  return isFav;
}

function registerReleaseElements(normalizedTitle, { wrapper, star, ratingSpan, originalTitle }) {
  const entry = getMediaEntry(normalizedTitle);
  if (wrapper) entry.releaseWrappers.add(wrapper);
  if (star) entry.releaseStars.add(star);
  if (ratingSpan) entry.ratingSpans.add(ratingSpan);
  if (originalTitle && !entry.primaryTitle) entry.primaryTitle = originalTitle;
  refreshFavoriteVisuals(normalizedTitle);
}

function registerScheduleElements(normalizedTitle, { row, star, originalTitle }) {
  const entry = getMediaEntry(normalizedTitle);
  if (row) entry.scheduleRows.add(row);
  if (star) entry.scheduleStars.add(star);
  if (originalTitle && !entry.primaryTitle) entry.primaryTitle = originalTitle;
  refreshFavoriteVisuals(normalizedTitle);
}

/* ------------------------------------------------------------------
 * FAVORITES MANAGEMENT
 * ---------------------------------------------------------------- */

/** Get all favorites from localStorage */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '{}');
  } catch (e) {
    console.error('Failed to parse favorites:', e);
    return {};
  }
}

/** Save favorites to localStorage */
function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

/** Check if a show is favorited */
function isFavorite(title) {
  const normalizedTitle = normalizeTitle(title);
  const favorites = getFavorites();
  return !!favorites[normalizedTitle];
}

/** Toggle favorite status of a show */
function toggleFavorite(title) {
  const normalizedTitle = normalizeTitle(title);
  const favorites = getFavorites();
  let isFav;

  if (favorites[normalizedTitle]) {
    delete favorites[normalizedTitle];
    isFav = false;
  } else {
    favorites[normalizedTitle] = {
      originalTitle: title,
      timestamp: Date.now(),
    };
    isFav = true;
  }

  saveFavorites(favorites);
  applyFavoriteVisuals(normalizedTitle, isFav);
  return isFav;
}

/** Clear all favorites */
function clearAllFavorites() {
  if (confirm('Are you sure you want to clear all favorites? This cannot be undone.')) {
    localStorage.removeItem(FAVORITES_KEY);
    location.reload(); // Refresh to update UI
  }
}

/** Add favorite star to the time column */
function addFavoriteStar(cell, titleText, normalizedTitle) {
  // Find the table row and the time cell
  const row = cell.closest('tr');
  if (!row) return;

  const timeCell = row.querySelector('.release-item-time');
  if (!timeCell) return;

  // Create favorite star
  const favoriteSpan = document.createElement('span');
  favoriteSpan.className = 'sp-favorite-star';
  favoriteSpan.style.cursor = 'pointer';
  favoriteSpan.style.userSelect = 'none';
  favoriteSpan.innerHTML = '☆';
  favoriteSpan.style.color = '#666';
  favoriteSpan.title = 'Click to toggle favorite';
  favoriteSpan.dataset.title = titleText;
  favoriteSpan.dataset.normalizedTitle = normalizedTitle;

  favoriteSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(titleText);
  });

  // Position the star at the top-right of the time cell
  timeCell.style.position = 'relative';
  timeCell.appendChild(favoriteSpan);

  return favoriteSpan;
}

/* ------------------------------------------------------------------
 * ANILIST FETCH + CACHE
 * ---------------------------------------------------------------- */

/** Perform AniList GraphQL request */
function gmFetchAniList(query, variables) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://graphql.anilist.co',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: JSON.stringify({ query, variables }),
      onload: (response) => {
        try {
          console.log('Fetching ratings for:', JSON.stringify(variables.search));
          resolve(JSON.parse(response.responseText));
        } catch (e) {
          reject(e);
        }
      },
      onerror: reject,
    });
  });
}

/** Fetch AniList rating, with caching (6h TTL) */
async function fetchAniListRating(title, forceRefresh = false) {
  const now = Date.now();
  const cache = readRatingCache();
  const cleanTitle = normalizeTitle(title);
  const entry = cache[cleanTitle];
  const hasEntry = !!entry;
  const timestamp = entry?.timestamp ?? 0;
  const age = hasEntry ? now - timestamp : Infinity;
  const stale = hasEntry ? age >= CACHE_TTL_MS : false;

  if (hasEntry && !forceRefresh) {
    return {
      score: Object.prototype.hasOwnProperty.call(entry, 'score') ? entry.score : null,
      cached: true,
      stale,
      timestamp,
      expires: timestamp + CACHE_TTL_MS,
    };
  }

  const query = `
            query ($search: String) {
              Media(search: $search, type: ANIME) {
                averageScore
              }
            }
        `;

  try {
    const json = await gmFetchAniList(query, { search: cleanTitle });
    const score = json?.data?.Media?.averageScore ?? null;

    const latestCache = readRatingCache();
    latestCache[cleanTitle] = { score, timestamp: now };
    writeRatingCache(latestCache);

    return { score, cached: false, stale: false, timestamp: now, expires: now + CACHE_TTL_MS };
  } catch (err) {
    console.error('AniList fetch failed:', err);
    if (hasEntry) {
      return {
        score: Object.prototype.hasOwnProperty.call(entry, 'score') ? entry.score : null,
        cached: true,
        stale,
        timestamp,
        expires: timestamp + CACHE_TTL_MS,
        failed: true,
      };
    }
    return { score: null, cached: false, stale: false, timestamp: now, expires: now + CACHE_TTL_MS, failed: true };
  }
}

/* ------------------------------------------------------------------
 * RATING BADGE HANDLING
 * ---------------------------------------------------------------- */

function getCachedRatingData(normalizedTitle) {
  const cache = readRatingCache();
  const entry = cache[normalizedTitle];
  if (!entry) return null;
  const timestamp = entry?.timestamp ?? 0;
  const stale = Date.now() - timestamp >= CACHE_TTL_MS;
  return {
    score: Object.prototype.hasOwnProperty.call(entry, 'score') ? entry.score : null,
    cached: true,
    stale,
    timestamp,
    expires: timestamp + CACHE_TTL_MS,
    failed: false,
  };
}

function renderRatingSpan(span, data) {
  if (!span || !span.isConnected) return;

  if (data.loading) {
    span.textContent = '…';
    span.style.color = '#999';
    span.title = data.message || 'Loading rating…';
    return;
  }

  const hasScore = typeof data.score === 'number';

  if (!hasScore) {
    span.textContent = 'N/A';
    span.style.color = '#999';

    if (data.failed) {
      span.title = 'AniList fetch failed\nClick to retry';
    } else if (data.cached) {
      if (data.stale) {
        const age = Date.now() - (data.timestamp ?? Date.now());
        span.title = `AniList rating not available (${msToTime(age)} old)\nRefreshing… Click to force refresh`;
      } else {
        span.title = 'AniList rating not available\nClick to refresh';
      }
    } else {
      span.title = 'AniList rating not available\nClick to refresh';
    }
    return;
  }

  span.textContent = `⭐ ${data.score}%`;

  if (!data.cached) {
    span.style.color = data.failed ? '#cc4444' : '#00cc66';
    span.title = data.failed ? 'AniList fetch failed\nClick to retry' : 'Fresh from AniList\nClick to refresh';
    return;
  }

  const now = Date.now();
  const ageMs = now - (data.timestamp ?? now);

  if (data.stale) {
    span.style.color = '#cc8800';
    const staleDuration = msToTime(Math.max(0, ageMs - CACHE_TTL_MS));
    span.title = data.failed
      ? `Refresh failed — showing cached rating (expired ${staleDuration} ago)\nClick to retry`
      : `Using cached rating (${msToTime(ageMs)} old)\nRefreshing… Click to force refresh`;
    return;
  }

  const remaining = Math.max(0, (data.expires ?? data.timestamp + CACHE_TTL_MS) - now);
  span.style.color = '#ff9900';
  span.title = data.failed
    ? `Refresh failed — showing cached (expires in ${msToTime(remaining)})\nClick to retry`
    : `Loaded from cache (expires in ${msToTime(remaining)})\nClick to refresh`;
}

function renderRatingForTitle(normalizedTitle, data) {
  const entry = getMediaEntry(normalizedTitle);
  pruneDisconnected(entry.ratingSpans);
  for (const span of entry.ratingSpans) {
    renderRatingSpan(span, data);
  }
}

function setRefreshingState(normalizedTitle) {
  const entry = getMediaEntry(normalizedTitle);
  pruneDisconnected(entry.ratingSpans);
  for (const span of entry.ratingSpans) {
    span.title = 'Refreshing rating…';
  }
}

function ensureRatingForTitle(normalizedTitle, originalTitle, force = false) {
  const cachedData = getCachedRatingData(normalizedTitle);

  if (cachedData) {
    renderRatingForTitle(normalizedTitle, cachedData);
  } else {
    renderRatingForTitle(normalizedTitle, { loading: true });
  }

  const shouldFetch = force || !cachedData || cachedData.stale;
  if (!shouldFetch) {
    return Promise.resolve(cachedData);
  }

  setRefreshingState(normalizedTitle);

  if (ratingFetches.has(normalizedTitle)) {
    return ratingFetches.get(normalizedTitle);
  }

  const entry = getMediaEntry(normalizedTitle);
  const sourceTitle = originalTitle || entry.primaryTitle || normalizedTitle;

  const fetchPromise = fetchAniListRating(sourceTitle, true)
    .then((result) => {
      renderRatingForTitle(normalizedTitle, result);
      return result;
    })
    .catch((err) => {
      console.error('Failed to refresh rating:', err);
      const fallback = cachedData || {
        score: null,
        cached: false,
        stale: false,
        timestamp: Date.now(),
        expires: Date.now() + CACHE_TTL_MS,
        failed: true,
      };
      renderRatingForTitle(normalizedTitle, { ...fallback, failed: true });
      throw err;
    })
    .finally(() => {
      ratingFetches.delete(normalizedTitle);
    });

  ratingFetches.set(normalizedTitle, fetchPromise);
  return fetchPromise;
}

/** Attach rating badge to a title */
function addRatingToTitle(titleDiv, titleText, normalizedTitle) {
  const ratingSpan = document.createElement('span');
  ratingSpan.style.marginLeft = '8px';
  ratingSpan.style.cursor = 'pointer';
  ratingSpan.textContent = '…';
  ratingSpan.dataset.normalizedTitle = normalizedTitle;
  titleDiv.appendChild(ratingSpan);

  ratingSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    ensureRatingForTitle(normalizedTitle, titleText, true);
  });

  return ratingSpan;
}

/* ------------------------------------------------------------------
 * IMAGE PREVIEW + STYLES
 * ---------------------------------------------------------------- */

function initScheduleFavorites() {
  const rows = document.querySelectorAll('#schedule-table tr.schedule-widget-item:not(.sp-schedule-processed)');
  if (!rows.length) return;

  rows.forEach((row) => {
    row.classList.add('sp-schedule-processed');
    const showCell = row.querySelector('.schedule-widget-show');
    const link = showCell?.querySelector('a');
    if (!showCell || !link) return;

    showCell.classList.add('sp-schedule-show');

    const titleText = link.textContent.trim();
    const normalizedTitle = normalizeTitle(titleText);

    const star = document.createElement('span');
    star.className = 'sp-schedule-favorite-star';
    star.innerHTML = '☆';
    star.style.cursor = 'pointer';
    star.style.userSelect = 'none';
    star.title = 'Click to toggle favorite';
    star.dataset.title = titleText;
    star.dataset.normalizedTitle = normalizedTitle;

    star.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(titleText);
    });

    showCell.appendChild(star);

    registerScheduleElements(normalizedTitle, { row, star, originalTitle: titleText });
  });
}

/** Inject styles (only once) */
function ensureStyles() {
  if (document.getElementById('sp-styles')) return;
  const css = `
    #releases-table td .sp-img-wrapper {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 6px 0;
      transition: all 0.3s ease;
      border-radius: 8px;
      position: relative;
    }
    .sp-thumb {
      width: var(--sp-thumb-size, 64px);
      height: auto;
      object-fit: cover;
      border-radius: 6px;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }
    .sp-text {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .sp-title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .sp-badges {
      margin-top: 6px;
    }
    .sp-favorite {
      background: linear-gradient(90deg,
        rgba(255, 215, 0, 0.2) 0%,
        rgba(255, 215, 0, 0.14) 35%,
        rgba(255, 215, 0, 0.08) 70%,
        rgba(255, 215, 0, 0.03) 100%);
      border-left: 3px solid rgba(255, 215, 0, 0.75);
      padding-left: 10px;
      margin-left: -3px;
      box-shadow: 0 3px 12px rgba(255, 215, 0, 0.18);
    }
    .sp-favorite::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(to bottom,
        rgba(255, 215, 0, 0.95) 0%,
        rgba(255, 215, 0, 0.45) 50%,
        rgba(255, 215, 0, 0.95) 100%);
      border-radius: 1px;
    }
    .sp-favorite .sp-thumb {
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
      border: 1px solid rgba(255, 215, 0, 0.45);
    }
    .sp-favorite:hover {
      background: linear-gradient(90deg,
        rgba(255, 215, 0, 0.24) 0%,
        rgba(255, 215, 0, 0.16) 35%,
        rgba(255, 215, 0, 0.1) 70%,
        rgba(255, 215, 0, 0.04) 100%);
    }
    .sp-favorite-star {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 16px;
      z-index: 10;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      transition: all 0.2s ease;
      opacity: 0.7;
      line-height: 1;
    }
    .sp-favorite-star:hover {
      opacity: 1;
      transform: scale(1.15);
    }
    .release-item-time {
      position: relative;
    }
    .sp-schedule-show {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: space-between;
    }
    .sp-schedule-show a {
      flex: 1;
    }
    .sp-schedule-favorite {
      background: linear-gradient(90deg,
        rgba(255, 215, 0, 0.18) 0%,
        rgba(255, 215, 0, 0.1) 65%,
        rgba(255, 215, 0, 0.05) 100%);
      border-left: 3px solid rgba(255, 215, 0, 0.7);
    }
    .sp-schedule-favorite .schedule-widget-show a {
      font-weight: 600;
    }
    .sp-schedule-favorite-star {
      font-size: 16px;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
      opacity: 0.75;
      transition: all 0.2s ease;
      color: #666;
    }
    .sp-schedule-favorite-star:hover {
      opacity: 1;
      transform: scale(1.15);
    }
    `;
  const style = document.createElement('style');
  style.id = 'sp-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

/** Attach images + ratings to release table */
function addImages() {
  ensureStyles();
  initScheduleFavorites();

  // Load thumbnail size
  const thumbSize = normalizeSize(GM_getValue('imageSize', '64px'));
  document.documentElement.style.setProperty('--sp-thumb-size', thumbSize);

  const links = document.querySelectorAll('#releases-table a[data-preview-image]:not(.processed)');
  links.forEach((link) => {
    if (!link || link.classList.contains('processed')) return;
    link.classList.add('processed');

    const imgUrl = link.getAttribute('data-preview-image') || '';
    const cell = link.closest('td');
    if (!cell) return;

    // Build wrapper layout
    const wrapper = document.createElement('div');
    wrapper.className = 'sp-img-wrapper';

    const img = document.createElement('img');
    img.className = 'sp-thumb';
    img.src = imgUrl;
    img.alt = link.textContent.trim() || 'preview';

    const textDiv = document.createElement('div');
    textDiv.className = 'sp-text';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'sp-title';
    titleDiv.appendChild(link);

    const titleText = link.textContent.trim();
    const normalizedTitle = normalizeTitle(titleText);

    // Add favorite star to time column
    const star = addFavoriteStar(cell, titleText, normalizedTitle);

    const ratingSpan = addRatingToTitle(titleDiv, titleText, normalizedTitle);

    const badge = cell.querySelector('.badge-wrapper');
    if (badge) {
      badge.classList.add('sp-badges');
      textDiv.appendChild(titleDiv);
      textDiv.appendChild(badge);
    } else {
      textDiv.appendChild(titleDiv);
    }

    wrapper.appendChild(img);
    wrapper.appendChild(textDiv);

    cell.innerHTML = '';
    cell.appendChild(wrapper);

    registerReleaseElements(normalizedTitle, { wrapper, star, ratingSpan, originalTitle: titleText });
    ensureRatingForTitle(normalizedTitle, titleText, false);
  });
}

/* ------------------------------------------------------------------
 * SETTINGS DIALOGS
 * ---------------------------------------------------------------- */

/** Modal to change script settings */
function showSettingsDialog() {
  const modal = document.createElement('div');
  modal.id = 'settingsModal';
  Object.assign(modal.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '9999',
  });

  const dialog = document.createElement('div');
  Object.assign(dialog.style, {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '20px',
    width: '350px',
    boxShadow: '0 4px 6px rgba(50,50,93,0.11), 0 1px 3px rgba(0,0,0,0.08)',
  });

  // Image size section
  const imageSizeLabel = document.createElement('label');
  imageSizeLabel.textContent = 'Image Preview Size:';
  imageSizeLabel.style.display = 'block';
  imageSizeLabel.style.marginBottom = '8px';
  imageSizeLabel.style.fontWeight = 'bold';

  const select = document.createElement('select');
  select.id = 'imageSizeSelect';
  select.style.width = '100%';
  select.style.marginBottom = '20px';
  [
    { text: 'Small (64px)', value: '64px' },
    { text: 'Medium (128px)', value: '128px' },
    { text: 'Large (225px)', value: '225px' },
  ].forEach((item) => {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = item.text;
    select.appendChild(option);
  });
  select.value = GM_getValue('imageSize', '64px');

  // Favorites section
  const favoritesLabel = document.createElement('label');
  favoritesLabel.textContent = 'Favorites Management:';
  favoritesLabel.style.display = 'block';
  favoritesLabel.style.marginBottom = '8px';
  favoritesLabel.style.fontWeight = 'bold';

  const favoritesCount = Object.keys(getFavorites()).length;
  const favoritesInfo = document.createElement('div');
  favoritesInfo.textContent = `Current favorites: ${favoritesCount}`;
  favoritesInfo.style.marginBottom = '10px';
  favoritesInfo.style.color = '#666';
  favoritesInfo.style.fontSize = '14px';

  const clearFavoritesButton = document.createElement('button');
  clearFavoritesButton.textContent = 'Clear All Favorites';
  Object.assign(clearFavoritesButton.style, {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%',
    marginBottom: '20px',
  });

  clearFavoritesButton.onclick = () => {
    document.body.removeChild(modal);
    clearAllFavorites();
  };

  // Main buttons
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  Object.assign(saveButton.style, {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
  });

  saveButton.onclick = () => {
    GM_setValue('imageSize', select.value);
    document.body.removeChild(modal);
    document.documentElement.style.setProperty('--sp-thumb-size', select.value);
  };

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  Object.assign(closeButton.style, {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
  });

  closeButton.onclick = () => {
    document.body.removeChild(modal);
  };

  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.display = 'flex';
  buttonsDiv.style.gap = '10px';
  buttonsDiv.style.marginTop = '10px';
  buttonsDiv.appendChild(saveButton);
  buttonsDiv.appendChild(closeButton);

  dialog.appendChild(imageSizeLabel);
  dialog.appendChild(select);
  dialog.appendChild(favoritesLabel);
  dialog.appendChild(favoritesInfo);
  dialog.appendChild(clearFavoritesButton);
  dialog.appendChild(buttonsDiv);
  modal.appendChild(dialog);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/* ------------------------------------------------------------------
 * ENTRYPOINT: Mutation observer
 * ---------------------------------------------------------------- */
(function () {
  'use strict';

  const debouncedAddImages = debounce(addImages, DEBOUNCE_TIMER);

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('a[data-preview-image]:not(.processed)')) {
            debouncedAddImages();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
