// ==UserScript==
// @name         Erome Enhancer (alpha)
// @namespace    http://violentmonkey.net/
// @version      3.2
// @license      MIT
// @author       LisaTurtlesCuck + Claude AI
// @description  Enhanced Erome browsing: Sort albums by views/videos/duration, filter by content type & duration, infinite scroll with auto-load, like counts display, hide watched albums, duration badges, deleted album display, and more!
// @match        https://www.erome.com/a
// @match        https://www.erome.com/explore*
// @match        https://www.erome.com/search*
// @match        https://www.erome.com/user/feed*
// @match        https://www.erome.com/user/liked*
// @match        https://www.erome.com/user/saved*
// @match        https://www.erome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555539/Erome%20Enhancer%20%28alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555539/Erome%20Enhancer%20%28alpha%29.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  // Constants
  const STORAGE_KEY = 'eromeEnhancerSettings';
  const VIEWED_KEY = 'eromeViewedAlbums';
  const DEFAULTS = {
    filterMode: 'videos',
    autoScroll: true,
    hideViewed: false,
    minVideoSeconds: 0,
    showLikes: true,
    enableSorting: true,
  };

  const SELECTORS = {
    albums: '#albums',
    albumLink: '.album-link, a[href*="/a/"]',
    albumThumbnail: '.album-thumbnail-container',
    albumBottomRight: '.album-bottom-right',
    albumVideos: '.album-videos',
    albumImages: '.album-images',
    albumViews: '.album-bottom-views',
    tabs: '#tabs',
    page: '#page',
  };

  // State
  let settings = loadSettings();
  let viewedAlbums = loadViewed();
  let currentPage = 1;
  let loading = false;
  const MAX_PAGES = 100;
  let lastSort = null;
  let pendingFetches = 0;
  let processingQueue = false;

  // Inject CSS once
  const CSS = `
    .ee-duration-badge, .ee-watched-badge, .ee-deleted-overlay {
      position: absolute;
      pointer-events: none;
    }
    .ee-duration-badge {
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      z-index: 12;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      line-height: 1.2;
      font-size: 11px;
    }
    .ee-watched-overlay {
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10;
    }
    .ee-watched-badge {
      top: 8px;
      left: 8px;
      background: rgba(235, 99, 149, 0.9);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      z-index: 11;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .ee-deleted-overlay {
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 15;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s ease;
    }
    .ee-page-separator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 30px 0;
      height: 40px;
      width: 100%;
      clear: both;
      grid-column: 1 / -1;
    }
    #eromeSortControls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
      margin: 16px 0;
      max-width: 600px;
    }
    #eromeSortControls button {
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 600;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      cursor: pointer;
      background: #fff;
      color: #333;
      transition: all 0.2s ease;
      white-space: nowrap;
      min-width: 120px;
      text-align: center;
    }
    #eromeSortControls button:hover {
      background: #f6f6f6;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .settings-section { margin-bottom: 25px; }
    .section-header {
      font-weight: 600; color: #eb6395; font-size: 15px;
      margin-bottom: 15px; padding-bottom: 8px;
      border-bottom: 2px solid #444; display: flex; align-items: center;
    }
    .section-content { padding-left: 10px; }
    .form-group { margin-bottom: 20px; }
    .control-label {
      display: block; margin-bottom: 8px;
      font-size: 14px; font-weight: 500; color: #ddd;
    }
    .form-control {
      background: #444; border: 1px solid #555; color: #fff;
      border-radius: 6px; font-size: 14px; transition: all 0.3s ease;
    }
    .form-control:focus {
      border-color: #eb6395;
      box-shadow: 0 0 0 3px rgba(235, 99, 149, 0.2);
      background: #444; color: #fff; outline: none;
    }
    .checkbox { margin-bottom: 12px; }
    .checkbox label {
      display: flex; align-items: center; font-size: 14px;
      color: #ddd; cursor: pointer; transition: color 0.2s ease;
    }
    .checkbox label:hover { color: #fff; }
    .checkbox input[type="checkbox"] {
      margin-right: 10px; transform: scale(1.2); accent-color: #eb6395;
    }
    .btn {
      border-radius: 6px; font-size: 13px; padding: 10px 18px;
      transition: all 0.3s ease; border: none; cursor: pointer; font-weight: 500;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .ee-action-buttons {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #444;
    }
    .ee-action-btn { width: 100%; white-space: nowrap; }
    #clearViewed { background: #555 !important; border-color: #666 !important; color: #ccc !important; }
    #clearViewed:hover { background: #666 !important; border-color: #777 !important; }
    #resetDurationFilter { border: 1px solid #eb6395 !important; color: #eb6395 !important; background: transparent !important; }
    #resetDurationFilter:hover { background: rgba(235, 99, 149, 0.15) !important; box-shadow: 0 4px 12px rgba(235, 99, 149, 0.2) !important; }
    #saveEnhancer:hover { background: #d85585 !important; border-color: #d85585 !important; box-shadow: 0 6px 16px rgba(235, 99, 149, 0.4) !important; }
    .modal-content { border-radius: 4px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); border: 1px solid #444; }
    .modal-header { background: linear-gradient(135deg, #2b2b2b 0%, #333 100%); }
    .modal-body { background: linear-gradient(135deg, #2b2b2b 0%, #2f2f2f 100%); }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ---------- Storage ---------- */
  function loadSettings() {
    try {
      return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch {
      return Object.assign({}, DEFAULTS);
    }
  }
  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
  function loadViewed() {
    try {
      return JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]');
    } catch {
      return [];
    }
  }
  function saveViewed() {
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewedAlbums));
  }
  function clearViewed() {
    viewedAlbums = [];
    saveViewed();
    alert('Viewed albums cleared!');
    location.reload();
  }

  /* ---------- Utilities ---------- */
  function parseDurationText(text) {
    if (!text) return 0;
    const parts = text.trim().split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number(parts[0]) || 0;
  }

  function fixLazyImages(root = document) {
    root.querySelectorAll('img').forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      if (img.getAttribute('data-src')) img.src = img.getAttribute('data-src');
      if (img.getAttribute('data-srcset')) img.srcset = img.getAttribute('data-srcset');
      img.classList.remove('lazy', 'lazyload', 'lozad');
    });
  }

  function parseAbbrevNumber(text) {
    if (!text) return 0;
    const t = text.replace(/\s+/g, ' ').trim();
    const m = t.match(/(\d[\d.,]*)(\s*[KM])?/i);
    if (!m) return 0;
    const num = parseFloat(m[1].replace(/,/g, '').replace(/\.(?=.*\.)/g, ''));
    if (!isFinite(num)) return 0;
    const unit = (m[2] || '').trim().toUpperCase();
    if (unit === 'K') return num * 1000;
    if (unit === 'M') return num * 1000000;
    return num;
  }

  function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /* ---------- Extraction Functions (Consolidated) ---------- */
  function extractMetric(album, metricName, extractFn) {
    const cacheKey = `_${metricName}Parsed`;
    if (album.dataset[cacheKey]) return +album.dataset[cacheKey];
    const value = extractFn(album);
    album.dataset[cacheKey] = String(value);
    return value;
  }

  function extractViews(album) {
    return extractMetric(album, 'views', (a) => {
      const viewsEl = a.querySelector(SELECTORS.albumViews);
      if (viewsEl) {
        const text = viewsEl.textContent.replace(/\s*views?\s*/i, '').trim();
        const v = parseAbbrevNumber(text);
        if (v) return v;
      }
      const dataEl = a.querySelector('[data-views],[data-view],[data-count-views]');
      if (dataEl) {
        const val = dataEl.getAttribute('data-views') || dataEl.getAttribute('data-view') || dataEl.getAttribute('data-count-views');
        return parseAbbrevNumber(val);
      }
      const icon = a.querySelector('.fa-eye:not(.fa-eye-slash)');
      if (icon?.parentElement?.classList.contains('album-bottom-views')) {
        return parseAbbrevNumber(icon.parentElement.textContent.replace(/\s*views?\s*/i, '').trim());
      }
      return 0;
    });
  }

  function extractVideos(album) {
    return extractMetric(album, 'videos', (a) => {
      const videoSpan = a.querySelector(SELECTORS.albumVideos);
      if (videoSpan) {
        const clone = videoSpan.cloneNode(true);
        clone.querySelectorAll('.fa-heart, .pink').forEach(el => {
          if (el.classList.contains('fa-heart')) {
            el.previousElementSibling?.remove();
            el.remove();
          }
        });
        const match = clone.textContent.trim().match(/(\d+)/);
        if (match) return parseInt(match[1]);
      }
      const dataEl = a.querySelector('[data-videos],[data-video-count],[data-count-videos]');
      if (dataEl) {
        const val = dataEl.getAttribute('data-videos') || dataEl.getAttribute('data-video-count') || dataEl.getAttribute('data-count-videos');
        return parseAbbrevNumber(val);
      }
      const icon = a.querySelector('.fa-video,.fa-film');
      if (icon?.parentElement?.classList.contains('album-videos')) {
        const match = icon.parentElement.textContent.trim().match(/(\d+)/);
        if (match) return parseInt(match[1]);
      }
      return 0;
    });
  }

  function extractDuration(album) {
    return extractMetric(album, 'duration', (a) => {
      const totalDuration = a.dataset.totalVideoDuration;
      return totalDuration ? parseInt(totalDuration) : 0;
    });
  }

  /* ---------- Album Sorting (Consolidated) ---------- */
  function tagOriginalOrder(albums) {
    albums.forEach((a, i) => {
      if (!a.hasAttribute('data-original-index')) {
        a.setAttribute('data-original-index', String(i));
      }
    });
  }

  function sortOrResetAlbums(sortFn = null) {
    const container = document.querySelector(SELECTORS.albums);
    if (!container) return;
    
    const allChildren = Array.from(container.children);
    const albums = [];
    const separatorMap = new Map();
    
    allChildren.forEach((child, index) => {
      if (child.classList.contains('ee-page-separator')) {
        separatorMap.set(index, child);
      } else if (child.classList.contains('album')) {
        albums.push(child);
      }
    });
    
    if (!albums.length) return;
    tagOriginalOrder(albums);

    const sorted = sortFn ? [...albums].sort((a, b) => {
      const kb = sortFn(b), ka = sortFn(a);
      if (kb !== ka) return kb - ka;
      return (parseInt(a.getAttribute('data-original-index')) || 0) - (parseInt(b.getAttribute('data-original-index')) || 0);
    }) : [...albums].sort((a, b) => 
      (parseInt(a.getAttribute('data-original-index')) || 0) - (parseInt(b.getAttribute('data-original-index')) || 0)
    );

    container.innerHTML = '';
    let albumIndex = 0;
    for (let i = 0; i < allChildren.length; i++) {
      if (separatorMap.has(i)) {
        container.appendChild(separatorMap.get(i));
      } else if (albumIndex < sorted.length) {
        container.appendChild(sorted[albumIndex++]);
      }
    }
  }

  function sortAlbums(keyFnDesc) { sortOrResetAlbums(keyFnDesc); }
  function resetAlbums() { sortOrResetAlbums(); }

  function addSortingControls() {
    if (!settings.enableSorting || location.pathname.startsWith('/a/')) return;
    const tabsContainer = document.querySelector(SELECTORS.tabs);
    if (!tabsContainer || document.getElementById('eromeSortControls')) return;

    const bar = document.createElement('div');
    bar.id = 'eromeSortControls';
    
    const buttons = [
      ['↓ Views', 'eromeSortByViews', () => { lastSort = 'views'; sortAlbums(extractViews); }],
      ['↓ Videos', 'eromeSortByVideos', () => { lastSort = 'videos'; sortAlbums(extractVideos); }],
      ['↓ Duration', 'eromeSortByDuration', () => { lastSort = 'duration'; sortAlbums(extractDuration); }],
      ['↺ Reset', 'eromeSortReset', () => { lastSort = null; resetAlbums(); }],
    ];

    buttons.forEach(([text, id, handler]) => {
      const btn = document.createElement('button');
      btn.id = id;
      btn.textContent = text;
      btn.addEventListener('click', (e) => { e.preventDefault(); handler(); });
      bar.appendChild(btn);
    });

    tabsContainer.parentElement.insertBefore(bar, tabsContainer.nextSibling);
  }

  /* ---------- Like Count & Duration Display ---------- */
  async function addLikeCount(albumEl) {
    if (albumEl.dataset.likesProcessed || location.pathname.startsWith('/a/') || !settings.showLikes) return;
    const link = albumEl.querySelector(SELECTORS.albumLink);
    if (!link) return;

    albumEl.dataset.likesProcessed = 'true';
    pendingFetches++;
    const albumIndex = pendingFetches;
    updateLoadingCount(pendingFetches);

    try {
      const response = await fetchWithRetry(link.href, albumIndex);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      if (doc.querySelector('h1')?.textContent.includes('Album deleted')) {
        markAsDeleted(albumEl);
        return;
      }

      let count = 0;
      try {
        const likeCountEl = doc.querySelector('#like_count');
        if (likeCountEl?.textContent) {
          count = likeCountEl.textContent.trim();
        } else {
          const heartIcon = doc.querySelector('.far.fa-heart.fa-lg');
          if (heartIcon?.nextElementSibling?.firstChild) {
            count = heartIcon.nextElementSibling.firstChild.textContent.trim();
          }
        }
        count = parseInt(count) || 0;
      } catch (likeErr) {
        count = 0;
      }

      const videoDurations = [];
      doc.querySelectorAll('.duration').forEach(durEl => {
        const seconds = parseDurationText(durEl.textContent.trim());
        if (seconds > 0) videoDurations.push(seconds);
      });
      
      if (videoDurations.length > 0) {
        const totalSeconds = videoDurations.reduce((sum, dur) => sum + dur, 0);
        const avgSeconds = Math.round(totalSeconds / videoDurations.length);
        albumEl.dataset.videoDurations = JSON.stringify(videoDurations);
        albumEl.dataset.avgVideoDuration = avgSeconds;
        albumEl.dataset.totalVideoDuration = totalSeconds;
        
        addDurationDisplay(albumEl, totalSeconds, avgSeconds, videoDurations.length);
        
        if (settings.minVideoSeconds > 0 && avgSeconds < settings.minVideoSeconds) {
          albumEl.remove();
          return;
        }
      }

      if (count > 0) {
        const bottomRight = albumEl.querySelector(SELECTORS.albumBottomRight);
        if (bottomRight) {
          const likeDisplay = document.createElement('span');
          likeDisplay.className = 'album-likes-display';
          likeDisplay.style.cssText = 'position:relative;display:inline-block;margin-left:4px;';
          likeDisplay.innerHTML = `<i class="fas fa-heart fa-lg" style="color:#eb6395;margin-right:4px;"></i><span style="font-weight:600;">${count}</span>`;
          bottomRight.appendChild(likeDisplay);
        }
      }
    } catch (err) {
      if (err.message === 'ALBUM_DELETED') markAsDeleted(albumEl);
    } finally {
      pendingFetches--;
      updateLoadingCount(pendingFetches);
      if (pendingFetches === 0) {
        hideLoadingIndicator();
        processingQueue = false;
      }
    }
  }

  function addDurationDisplay(albumEl, totalSeconds, avgSeconds, videoCount) {
    const container = albumEl.querySelector(SELECTORS.albumThumbnail);
    if (!container || container.querySelector('.ee-duration-badge')) return;
    if (!container.style.position || container.style.position === 'static') {
      container.style.position = 'relative';
    }
    const badge = document.createElement('div');
    badge.className = 'ee-duration-badge';
    badge.title = `${videoCount} video${videoCount > 1 ? 's' : ''}\nTotal: ${formatDuration(totalSeconds)}\nAverage: ${formatDuration(avgSeconds)}`;
    badge.innerHTML = `<div style="opacity: 0.9;"><i class="fa fa-clock" style="margin-right: 3px;"></i>${formatDuration(totalSeconds)}</div>${videoCount > 1 ? `<div style="font-size: 9px; opacity: 0.7; margin-top: 2px;">${videoCount} videos</div>` : ''}`;
    container.appendChild(badge);
  }

  function processLikesForAlbums(container = document) {
    if (location.pathname.startsWith('/a/') || !settings.showLikes) return;
    const albums = container.querySelectorAll('.album');
    if (albums.length === 0) return;
    
    showLoadingIndicator();
    processingQueue = true;
    albums.forEach((album, index) => {
      if (!album.dataset.likesProcessed) {
        setTimeout(() => addLikeCount(album), index * 100);
      }
    });
  }

  /* ---------- Rate Limit Handling ---------- */
  async function fetchWithRetry(url, albumIndex, maxRetries = 5, initialDelay = 2000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url);
        if (response.status === 404 || response.status === 410) throw new Error('ALBUM_DELETED');
        if (response.status === 429) {
          await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, attempt)));
          continue;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return response;
      } catch (err) {
        if (err.message === 'ALBUM_DELETED' || attempt === maxRetries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, attempt)));
      }
    }
  }

  function showLoadingIndicator() {
    if (document.getElementById('ee-loading-indicator')) return;
    const indicator = document.createElement('div');
    indicator.id = 'ee-loading-indicator';
    indicator.innerHTML = `<div style="position: fixed;bottom: 20px;right: 20px;background: rgba(235, 99, 149, 0.95);color: white;padding: 12px 20px;border-radius: 8px;box-shadow: 0 4px 12px rgba(0,0,0,0.3);z-index: 9999;display: flex;align-items: center;gap: 12px;font-weight: 600;font-size: 14px;"><div style="width: 20px;height: 20px;border: 3px solid rgba(255,255,255,0.3);border-top-color: white;border-radius: 50%;animation: spin 0.8s linear infinite;"></div><span>Loading album data...</span><span id="ee-loading-count" style="background: rgba(255,255,255,0.2);padding: 2px 8px;border-radius: 4px;font-size: 12px;">0</span></div>`;
    document.body.appendChild(indicator);
  }

  function updateLoadingCount(count) {
    const countEl = document.getElementById('ee-loading-count');
    if (countEl) countEl.textContent = count;
  }

  function hideLoadingIndicator() {
    document.getElementById('ee-loading-indicator')?.remove();
  }

  /* ---------- Overlay Creation (Consolidated) ---------- */
  function createOverlay(type, albumEl) {
    const container = albumEl.querySelector(SELECTORS.albumThumbnail);
    if (!container || container.querySelector(`.ee-${type}-overlay`)) return;
    if (!container.style.position || container.style.position === 'static') {
      container.style.position = 'relative';
    }

    const overlay = document.createElement('div');
    overlay.className = `ee-${type}-overlay`;
    
    if (type === 'watched') {
      const badge = document.createElement('div');
      badge.className = 'ee-watched-badge';
      badge.textContent = 'WATCHED';
      container.appendChild(overlay);
      container.appendChild(badge);
    } else if (type === 'deleted') {
      const link = container.querySelector('a');
      if (link) {
        link.addEventListener('click', (e) => e.preventDefault());
        link.style.cursor = 'default';
      }
      const message = document.createElement('div');
      message.style.cssText = 'background: rgba(235, 99, 149, 0.95);color: white;padding: 12px 20px;border-radius: 8px;font-size: 14px;font-weight: 700;letter-spacing: 0.5px;box-shadow: 0 4px 12px rgba(0,0,0,0.5);text-align: center;line-height: 1.4;';
      message.innerHTML = `<i class="fa fa-trash" style="display: block; font-size: 24px; margin-bottom: 8px;"></i>ALBUM DELETED`;
      overlay.appendChild(message);
      container.appendChild(overlay);
      container.addEventListener('mouseenter', () => overlay.style.opacity = '0');
      container.addEventListener('mouseleave', () => overlay.style.opacity = '1');
      const thumbnail = container.querySelector('img');
      if (thumbnail) thumbnail.style.filter = 'grayscale(50%) brightness(0.7)';
    }
  }

  function markAsViewed(albumEl) { createOverlay('watched', albumEl); }
  function markAsDeleted(albumEl) { createOverlay('deleted', albumEl); }

  /* ---------- Grid Filtering ---------- */
  function matchesFilter(albumEl) {
    const videoSpan = albumEl.querySelector(SELECTORS.albumVideos);
    const imageSpan = albumEl.querySelector(SELECTORS.albumImages);
    const vCount = videoSpan ? Number((videoSpan.textContent.match(/(\d+)/) || [0])[0]) : 0;
    const iCount = imageSpan ? Number((imageSpan.textContent.match(/(\d+)/) || [0])[0]) : 0;
    const anchor = albumEl.querySelector('a');
    const url = anchor?.href;

    if (settings.hideViewed && url && viewedAlbums.includes(url)) return false;

    switch (settings.filterMode) {
      case 'videos': return vCount > 0;
      case 'images': return iCount > 0 && vCount === 0;
      default: return true;
    }
  }

  function markAlbumClick(albumEl) {
    const link = albumEl.querySelector('a');
    if (!link || link.dataset.eeBound) return;
    link.dataset.eeBound = '1';

    if (viewedAlbums.includes(link.href)) markAsViewed(albumEl);

    link.addEventListener('mousedown', (event) => {
      if (event.button === 0 || event.button === 1) {
        if (!viewedAlbums.includes(link.href)) {
          viewedAlbums.push(link.href);
          saveViewed();
          markAsViewed(albumEl);
        }
      }
    });
  }

  function applyInitialFilter() {
    const container = document.querySelector(SELECTORS.albums);
    if (!container) return;
    const albums = Array.from(container.querySelectorAll('.album'));
    tagOriginalOrder(albums);
    albums.forEach(album => {
      if (!matchesFilter(album)) {
        album.remove();
      } else {
        fixLazyImages(album);
        markAlbumClick(album);
      }
    });
  }

  /* ---------- Infinite Scroll ---------- */
  function createPageSeparator(pageNum) {
    const separator = document.createElement('div');
    separator.className = 'ee-page-separator';
    separator.dataset.pageNumber = pageNum;
    separator.innerHTML = `<div style="flex: 1;height: 2px;background: linear-gradient(to right, transparent, #444, #444, transparent);"></div><div style="padding: 8px 20px;background: #2b2b2b;border: 2px solid #444;border-radius: 20px;margin: 0 15px;font-weight: 600;color: #eb6395;font-size: 14px;white-space: nowrap;"><i class="fa fa-arrow-down" style="margin-right: 8px;"></i>Page ${pageNum}<i class="fa fa-arrow-down" style="margin-left: 8px;"></i></div><div style="flex: 1;height: 2px;background: linear-gradient(to left, transparent, #444, #444, transparent);"></div>`;
    return separator;
  }

  function setupInfiniteScroll() {
    disableNativeInfiniteScroll();
    let scrollLocked = false;
    window.addEventListener('scroll', () => {
      if (!settings.autoScroll || scrollLocked || processingQueue || pendingFetches > 0) return;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 500) {
        scrollLocked = true;
        loadNextPage().finally(() => setTimeout(() => scrollLocked = false, 1000));
      }
    });
  }

  function disableNativeInfiniteScroll() {
    if (typeof $ === 'function') {
      const $page = $(SELECTORS.page);
      try {
        if ($page.data('infiniteScroll')) $page.infiniteScroll('destroy');
      } catch (e) {}
      $page.off('append.infiniteScroll load.infiniteScroll request.infiniteScroll last.infiniteScroll error.infiniteScroll append');
    }
    if (typeof window.InfiniteScroll !== 'undefined') {
      window.InfiniteScroll = function() {
        return { destroy: () => {}, on: () => {}, off: () => {}, loadNextPage: () => {} };
      };
    }
    if (typeof $ === 'function' && $.fn) {
      $.fn.infiniteScroll = function() { return this; };
    }
    setTimeout(() => {
      const infiniteScrollScript = Array.from(document.querySelectorAll('script')).find(script => 
        script.textContent.includes('infiniteScroll') || script.textContent.includes('infinite-scroll') || script.textContent.includes('.infiniteScroll(')
      );
      if (infiniteScrollScript) infiniteScrollScript.remove();
    }, 100);
  }

  async function loadNextPage() {
    if (loading || currentPage >= MAX_PAGES || processingQueue || pendingFetches > 0) return;
    
    loading = true;
    const nextPage = currentPage + 1;
    const path = location.pathname;
    let url = `?page=${nextPage}`;
    if (path.startsWith('/explore')) url = `/explore?page=${nextPage}`;
    else if (path.startsWith('/search')) {
      const p = new URLSearchParams(location.search);
      p.set('page', nextPage);
      url = `/search?${p.toString()}`;
    } else if (path.startsWith('/user/feed')) url = `/user/feed?page=${nextPage}`;
    else if (path.startsWith('/user/liked')) url = `/user/liked?page=${nextPage}`;
    else if (path.startsWith('/user/saved')) url = `/user/saved?page=${nextPage}`;
    else if (/^\/[^/]+$/.test(path)) url = `${path}?page=${nextPage}`;

    try {
      const res = await fetchWithRetry(url, `Page${nextPage}`);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      fixLazyImages(doc);
      doc.querySelectorAll('.suggested-users, .col-sm-12:has(h2)').forEach(el => el.remove());
      
      const newAlbums = doc.querySelectorAll('.album');
      const container = document.querySelector(SELECTORS.albums);
      
      if (container && newAlbums.length > 0) {
        const frag = document.createDocumentFragment();
        frag.appendChild(createPageSeparator(nextPage));
        
        let addedCount = 0;
        newAlbums.forEach(n => {
          const clone = document.importNode(n, true);
          if (matchesFilter(clone)) {
            fixLazyImages(clone);
            clone.setAttribute('data-original-index', String(container.querySelectorAll('.album').length));
            frag.appendChild(clone);
            addedCount++;
          }
        });
        
        container.appendChild(frag);
        
        setTimeout(() => {
          document.querySelectorAll('.separator .bubble-mobile').forEach(bubble => {
            if (bubble.href?.includes('/o/')) bubble.closest('.separator')?.remove();
          });
          document.querySelectorAll('.suggested-users').forEach(el => el.remove());
        }, 100);
        
        const addedAlbums = Array.from(container.querySelectorAll('.album')).slice(-addedCount);
        addedAlbums.forEach(album => markAlbumClick(album));
        
        showLoadingIndicator();
        processingQueue = true;
        addedAlbums.forEach((album, index) => setTimeout(() => addLikeCount(album), index * 100));
        
        return new Promise((resolve) => {
          const waitForProcessing = setInterval(() => {
            if (!processingQueue && pendingFetches === 0) {
              clearInterval(waitForProcessing);
              if (lastSort === 'views') sortAlbums(extractViews);
              else if (lastSort === 'videos') sortAlbums(extractVideos);
              else if (lastSort === 'duration') sortAlbums(extractDuration);
              currentPage = nextPage;
              loading = false;
              resolve();
            }
          }, 500);
        });
      } else {
        currentPage = nextPage;
        loading = false;
      }
    } catch (err) {
      loading = false;
    }
  }

  /* ---------- Album Pages ---------- */
  function getMediaGroups() {
    return Array.from(document.querySelectorAll('.media-group, .album-media, [class*="media"]'));
  }

  function isVideoGroup(g) {
    return !!(g.querySelector('.duration, video, [class*="video"], .fa-video'));
  }

  function getGroupDurationSeconds(g) {
    let durationText = '';
    const durationEl = g.querySelector('.duration');
    if (durationEl) durationText = durationEl.textContent || durationEl.innerText || '';
    if (!durationText && g.dataset.duration) durationText = g.dataset.duration;
    if (!durationText && g.getAttribute('data-duration')) durationText = g.getAttribute('data-duration');
    if (!durationText) {
      const durationMatch = g.innerHTML.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (durationMatch) durationText = durationMatch[0];
    }
    return parseDurationText(durationText.trim());
  }

  function updateHiddenCounter(n) {
    const num = document.getElementById('eeCountNum');
    if (num) num.textContent = String(n);
  }

  function applyAlbumEnhancements() {
    if (!location.pathname.startsWith('/a/')) return;
    const groups = getMediaGroups();
    if (!groups.length) {
      updateHiddenCounter(0);
      return;
    }
    let hidden = 0;
    groups.forEach(g => {
      if (isVideoGroup(g)) {
        const secs = getGroupDurationSeconds(g);
        if (settings.minVideoSeconds > 0 && secs > 0 && secs < settings.minVideoSeconds) {
          g.style.display = 'none';
          hidden++;
        } else {
          g.style.display = '';
        }
      } else {
        g.style.display = '';
      }
    });
    updateHiddenCounter(hidden);
  }

  function observeAlbumChanges() {
    if (!location.pathname.startsWith('/a/')) return;
    const container = document.body;
    if (!container) return;
    const mo = new MutationObserver(() => {
      clearTimeout(window.__ee_album_timeout);
      window.__ee_album_timeout = setTimeout(() => applyAlbumEnhancements(), 500);
    });
    mo.observe(container, { childList: true, subtree: true });
  }

  /* ---------- UI ---------- */
  function ensureEnhancerNav() {
    const navContainer = document.querySelector('.navbar .container .col-sm-12');
    if (!navContainer) return null;
    if (document.getElementById('enhancerNavItem')) return document.getElementById('enhancerBtn');
    const div = document.createElement('div');
    div.className = 'sp';
    div.id = 'enhancerNavItem';
    div.innerHTML = `<a href="#" id="enhancerBtn" style="display:inline-flex;align-items:center;gap:8px;"><i class="fa fa-sliders"></i><span>Enhancer</span><span style="display:inline-flex;align-items:center;gap:4px;color:#eb6395;margin-left:8px;font-weight:600;font-size:13px;"><i class="fa fa-eye-slash"></i><span id="eeCountNum">0</span></span></a>`;
    const orientationDropdown = navContainer.querySelector('.sp.dropdown.sign-in');
    if (orientationDropdown) {
      orientationDropdown.insertAdjacentElement('afterend', div);
    } else {
      navContainer.insertBefore(div, navContainer.querySelector('.navbar-header'));
    }
    return document.getElementById('enhancerBtn');
  }

  function addSettingsUI() {
    const anchor = ensureEnhancerNav();
    if (!anchor || document.getElementById('enhancerModal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'enhancerModal';
    modal.innerHTML = `<div class="modal-dialog"><div class="modal-content" style="background:#2b2b2b;color:#fff;"><div class="modal-header" style="border-bottom:1px solid #444;padding:20px 25px 15px;"><button type="button" class="close" data-dismiss="modal" style="color:#fff;opacity:0.8;font-size:24px;margin-top:-5px;">×</button><h4 class="modal-title" style="font-weight:600;font-size:18px;"><i class="fa fa-sliders" style="margin-right:10px;color:#eb6395;"></i>Erome Enhancer Settings</h4></div><div class="modal-body" style="padding:25px;"><div class="settings-section"><div class="section-header"><i class="fa fa-th-large" style="margin-right:8px;"></i>Grid View Filters</div><div class="section-content"><div class="form-group"><label class="control-label">Content Filter</label><select id="filterMode" class="form-control"><option value="all">Show All Albums</option><option value="videos">Videos Only</option><option value="images">Images Only (No Videos)</option></select></div><div class="form-group"><div class="checkbox"><label><input type="checkbox" id="autoScroll"> Auto-load pages (infinite scroll)</label></div></div><div class="form-group"><div class="checkbox"><label><input type="checkbox" id="hideViewed"> Hide viewed albums</label></div></div><div class="form-group"><div class="checkbox"><label><input type="checkbox" id="showLikes"> Show like counts on albums</label></div></div><div class="form-group"><div class="checkbox"><label><input type="checkbox" id="enableSorting"> Enable album sorting controls</label></div></div></div></div><hr style="border-color:#444;margin:25px 0;"><div class="settings-section"><div class="section-header"><i class="fa fa-clock-o" style="margin-right:8px;"></i>Video Duration Filter</div><div class="section-content" style="background:#333;padding:20px;border-radius:8px;margin-top:12px;border:1px solid #444;"><div class="form-group" style="margin-bottom:20px;"><label class="control-label" style="font-size:14px;color:#ddd;font-weight:500;"><i class="fa fa-filter" style="margin-right:6px;"></i>Minimum Average Video Duration</label><div style="display:flex;align-items:center;gap:12px;margin-top:8px;"><input type="number" id="minVideoSeconds" class="form-control" min="0" placeholder="0 = disabled" style="flex:1;background:#444;border:1px solid #555;color:#fff;"><span style="color:#888;font-size:13px;white-space:nowrap;font-weight:500;">seconds</span></div><div style="font-size:12px;color:#777;margin-top:8px;line-height:1.4;"><i class="fa fa-info-circle" style="margin-right:5px;"></i>Hide albums where the average video duration is shorter than this</div></div><div style="background:#3a3a3a;padding:12px 15px;border-radius:6px;margin-top:15px;border-left:3px solid #eb6395;"><div style="font-size:12px;color:#999;display:flex;align-items:center;"><i class="fa fa-exclamation-circle" style="margin-right:8px;font-size:14px;"></i><span>Applies to both grid pages and individual album pages</span></div></div><div class="ee-action-buttons"><button id="clearViewed" class="btn btn-default ee-action-btn"><i class="fa fa-trash" style="margin-right:6px;"></i>Clear Viewed</button><button id="resetDurationFilter" class="btn btn-default ee-action-btn"><i class="fa fa-refresh" style="margin-right:6px;"></i>Reset Duration</button></div></div></div></div><div class="modal-footer" style="border-top:1px solid #444;padding:20px 25px;"><button id="saveEnhancer" class="btn btn-primary" style="background:#eb6395 !important;border-color:#eb6395 !important;color:#fff !important;font-weight:600;padding:10px 20px;width:100%;"><i class="fa fa-check" style="margin-right:8px;"></i>Apply Settings</button></div></div></div>`;
    document.body.appendChild(modal);

    anchor.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('filterMode').value = settings.filterMode;
      document.getElementById('autoScroll').checked = settings.autoScroll;
      document.getElementById('hideViewed').checked = settings.hideViewed;
      document.getElementById('showLikes').checked = settings.showLikes;
      document.getElementById('enableSorting').checked = settings.enableSorting;
      document.getElementById('minVideoSeconds').value = settings.minVideoSeconds || 0;
      if (typeof $ === 'function') {
        $('#enhancerModal').modal({ show: true, backdrop: true });
      } else {
        modal.style.display = 'block';
        modal.classList.add('show');
      }
    });

    modal.querySelector('#saveEnhancer').addEventListener('click', () => {
      settings.filterMode = document.getElementById('filterMode').value;
      settings.autoScroll = document.getElementById('autoScroll').checked;
      settings.hideViewed = document.getElementById('hideViewed').checked;
      settings.showLikes = document.getElementById('showLikes').checked;
      settings.enableSorting = document.getElementById('enableSorting').checked;
      settings.minVideoSeconds = parseInt(document.getElementById('minVideoSeconds').value) || 0;
      saveSettings();
      if (typeof $ === 'function') {
        $('#enhancerModal').modal('hide');
      } else {
        modal.style.display = 'none';
        modal.classList.remove('show');
      }
      setTimeout(() => {
        location.pathname.startsWith('/a/') ? applyAlbumEnhancements() : location.reload();
      }, 300);
    });

    modal.querySelector('#clearViewed').addEventListener('click', clearViewed);
    modal.querySelector('#resetDurationFilter').addEventListener('click', () => {
      settings.minVideoSeconds = 0;
      saveSettings();
      document.getElementById('minVideoSeconds').value = 0;
      location.pathname.startsWith('/a/') ? applyAlbumEnhancements() : location.reload();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (typeof $ === 'function') {
          $('#enhancerModal').modal('hide');
        } else {
          modal.style.display = 'none';
          modal.classList.remove('show');
        }
      }
    });
  }

  /* ---------- Cleanup ---------- */
  function disableDisclaimer() {
    const disclaimer = document.getElementById('disclaimer');
    if (!disclaimer) return;
    if (typeof $ === 'function') {
      $.ajax({ type: 'POST', url: '/user/disclaimer', async: true });
      $('#disclaimer').remove();
      $('body').css('overflow', 'visible');
    } else {
      fetch('/user/disclaimer', { method: 'POST' }).catch(() => {});
      disclaimer.remove();
      document.body.style.overflow = 'visible';
    }
  }

  function cleanNavbar() {
    const navContainer = document.querySelector('.navbar .container .col-sm-12');
    if (navContainer) {
      navContainer.querySelectorAll('.sp').forEach(div => {
        const link = div.querySelector('a');
        if (link?.href?.includes('/o/menu-')) div.remove();
      });
    }
    document.querySelector('.sp-mob.hidden-sm.hidden-md.hidden-lg')?.remove();
    document.querySelectorAll('.separator .bubble-mobile').forEach(bubble => {
      if (bubble.href?.includes('/o/')) bubble.closest('.separator')?.remove();
    });
    const navbar = document.querySelector('.navbar.navbar-inverse.navbar-static-top');
    if (navbar && !document.getElementById('ee-navbar-fix')) {
      const style = document.createElement('style');
      style.id = 'ee-navbar-fix';
      style.textContent = `.navbar.navbar-inverse.navbar-static-top { top: 0 !important; }`;
      document.head.appendChild(style);
    }
  }

  /* ---------- Init ---------- */
  function init() {
    disableDisclaimer();
    cleanNavbar();
    fixLazyImages();
    
    const albumsContainer = document.querySelector(SELECTORS.albums);
    if (albumsContainer && !location.pathname.startsWith('/a/')) {
      albumsContainer.style.minHeight = '600px';
    }
    
    if (location.pathname.startsWith('/a/')) {
      setTimeout(() => {
        applyAlbumEnhancements();
        observeAlbumChanges();
      }, 2000);
    } else {
      applyInitialFilter();
      addSortingControls();
      setTimeout(() => setupInfiniteScroll(), 1000);
      setTimeout(() => processLikesForAlbums(), 500);
    }
    addSettingsUI();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();