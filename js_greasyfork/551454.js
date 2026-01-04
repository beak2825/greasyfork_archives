// ==UserScript==
// @name         Erome Enhancer (beta)
// @namespace    http://violentmonkey.net/
// @version      2.9
// @license      MIT
// @author       LisaTurtlesCuck
// @description  Filters albums, infinite scroll, duration filtering on album pages, hide viewed albums
// @match        https://www.erome.com/a
// @match        https://www.erome.com/explore*
// @match        https://www.erome.com/search*
// @match        https://www.erome.com/user/feed*
// @match        https://www.erome.com/user/liked*
// @match        https://www.erome.com/user/saved*
// @match        https://www.erome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551454/Erome%20Enhancer%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551454/Erome%20Enhancer%20%28beta%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'eromeEnhancerSettings';
  const VIEWED_KEY = 'eromeViewedAlbums';
  const DEFAULTS = {
    filterMode: 'videos', // 'videos' | 'images' | 'all'
    autoScroll: true,
    hideViewed: false,
    minVideoSeconds: 0, // album: hide videos shorter than this (0 = off)
  };

  let settings = loadSettings();
  let viewedAlbums = loadViewed();
  let currentPage = 1;
  let loading = false;
  const MAX_PAGES = 50;

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
    console.log('Parsing duration text:', text);
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

  /* ---------- Grid Filtering (FIXED) ---------- */
  function matchesFilter(albumEl) {
      const videoSpan = albumEl.querySelector('.album-videos');
      const imageSpan = albumEl.querySelector('.album-images');
      const vCount = videoSpan ? Number((videoSpan.textContent.match(/\d+/) || [0])[0]) : 0;
      const iCount = imageSpan ? Number((imageSpan.textContent.match(/\d+/) || [0])[0]) : 0;
      const anchor = albumEl.querySelector('a');
      const url = anchor ? anchor.href : null;

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

      // FIX: Listen for 'mousedown' and include all buttons (0, 1, 2)
      link.addEventListener('mousedown', (event) => {
          // Button 0: Left-click (direct navigation)
          // Button 1: Middle-click / Scroll Wheel (open in new tab)
          // Button 2: Right-click (used to open context menu, where 'open in new tab' is selected)
          if (event.button === 0 || event.button === 1 || event.button === 2) {
              if (!viewedAlbums.includes(link.href)) {
                  viewedAlbums.push(link.href);
                  saveViewed();
                  console.log(`Album marked as viewed: ${link.href} (Button: ${event.button})`);
              }
          }
      });
  }

  function applyInitialFilter() {
    const container = document.querySelector('#albums');
    if (!container) return;
    Array.from(container.querySelectorAll('.album')).forEach(album => {
      if (!matchesFilter(album)) album.remove();
      else {
        fixLazyImages(album);
        markAlbumClick(album);
      }
    });
  }

  /* ---------- Infinite Scroll ---------- */
  async function loadNextPage() {
    if (loading || currentPage >= MAX_PAGES) return;
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
      const res = await fetch(url);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      fixLazyImages(doc);
      const newAlbums = doc.querySelectorAll('.album');
      const container = document.querySelector('#albums');
      if (container) {
        newAlbums.forEach(n => {
          const clone = document.importNode(n, true);
          if (matchesFilter(clone)) {
            fixLazyImages(clone);
            markAlbumClick(clone);
            container.appendChild(clone);
          }
        });
      }
      currentPage = nextPage;
    } catch (err) {
      console.error('loadNextPage error', err);
    }
    loading = false;
  }

  function setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
      if (!settings.autoScroll) return;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 800) {
        loadNextPage();
      }
    });
  }

  /* ---------- Album Pages (duration filtering) ---------- */
  function getMediaGroups() {
    // FIXED: Use correct selectors for album pages
    return Array.from(document.querySelectorAll('.media-group, .album-media, [class*="media"]'));
  }

  function isVideoGroup(g) {
    // FIXED: Better video detection
    return !!(g.querySelector('.duration, video, [class*="video"], .fa-video'));
  }

  function getGroupDurationSeconds(g) {
    // FIXED: More robust duration extraction
    let durationText = '';

    // Try direct duration element first
    const durationEl = g.querySelector('.duration');
    if (durationEl) {
      durationText = durationEl.textContent || durationEl.innerText || '';
      console.log('Found duration element:', durationText);
    }

    // Try data attributes
    if (!durationText && g.dataset.duration) {
      durationText = g.dataset.duration;
    }

    // Try HTML data attribute
    if (!durationText && g.getAttribute('data-duration')) {
      durationText = g.getAttribute('data-duration');
    }

    // Fallback: search in inner HTML
    if (!durationText) {
      const html = g.innerHTML;
      const durationMatch = html.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (durationMatch) {
        durationText = durationMatch[0];
      }
    }

    // Clean up the text
    durationText = (durationText || '').trim();
    console.log('Final duration text:', durationText, 'for element:', g);

    return parseDurationText(durationText);
  }

  function updateHiddenCounter(n) {
    const num = document.getElementById('eeCountNum');
    if (num) num.textContent = String(n);
  }

  function applyAlbumEnhancements() {
    // FIXED: Don't use #albums on album pages
    if (!location.pathname.startsWith('/a/')) return;

    const groups = getMediaGroups();
    console.log('Found media groups:', groups.length);

    if (!groups.length) {
      console.log('No media groups found');
      updateHiddenCounter(0);
      return;
    }

    let hidden = 0;
    groups.forEach(g => {
      if (isVideoGroup(g)) {
        const secs = getGroupDurationSeconds(g);
        console.log('Video duration:', secs, 'seconds');

        if (settings.minVideoSeconds > 0 && secs > 0 && secs < settings.minVideoSeconds) {
          g.style.display = 'none';
          hidden++;
          console.log('Hiding video with duration:', secs, 'seconds');
        } else {
          g.style.display = '';
        }
      } else {
        g.style.display = '';
      }
    });

    updateHiddenCounter(hidden);
    console.log('Duration filter applied:', hidden, 'videos hidden');
  }

  function observeAlbumChanges() {
    if (!location.pathname.startsWith('/a/')) return;

    // FIXED: Use body or main container for album pages
    const container = document.body;
    if (!container) return;

    const mo = new MutationObserver(() => {
      clearTimeout(window.__ee_album_timeout);
      window.__ee_album_timeout = setTimeout(() => {
        applyAlbumEnhancements();
      }, 500);
    });
    mo.observe(container, { childList: true, subtree: true });
  }

  /* ---------- UI ---------- */
  function ensureEnhancerNav() {
    const nav = document.querySelector('.nav.navbar-nav.navbar-right') || document.querySelector('.navbar-right .nav');
    if (!nav) return null;
    if (document.getElementById('enhancerNavItem')) return document.getElementById('enhancerBtn');

    const li = document.createElement('li');
    li.id = 'enhancerNavItem';
    li.innerHTML = `
      <a href="#" id="enhancerBtn" style="display:inline-flex;align-items:center;gap:8px;">
        <i class="fa fa-sliders"></i>
        <span>Enhancer</span>
        <span style="display:inline-flex;align-items:center;gap:4px;color:#eb6395;margin-left:8px;font-weight:600;font-size:13px;">
          <i class="fa fa-eye-slash"></i>
          <span id="eeCountNum">0</span>
        </span>
      </a>`;
    nav.insertBefore(li, nav.firstChild);
    return document.getElementById('enhancerBtn');
  }

  function addSettingsUI() {
    const anchor = ensureEnhancerNav();
    if (!anchor) return;

    if (document.getElementById('enhancerModal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'enhancerModal';

    // Option 1 - Comprehensive Premium Design
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content" style="background:#2b2b2b;color:#fff;">
          <div class="modal-header" style="border-bottom:1px solid #444;padding:20px 25px 15px;">
            <button type="button" class="close" data-dismiss="modal" style="color:#fff;opacity:0.8;font-size:24px;margin-top:-5px;">×</button>
            <h4 class="modal-title" style="font-weight:600;font-size:18px;">
              <i class="fa fa-sliders" style="margin-right:10px;color:#eb6395;"></i>Erome Enhancer Settings
            </h4>
          </div>
          <div class="modal-body" style="padding:25px;">
            <!-- Main Content Filters -->
            <div class="settings-section">
              <div class="section-header">
                <i class="fa fa-th-large" style="margin-right:8px;"></i>Grid View Filters
              </div>
              <div class="section-content">
                <div class="form-group">
                  <label class="control-label">Content Filter</label>
                  <select id="filterMode" class="form-control">
                    <option value="all">Show All Albums</option>
                    <option value="videos">Videos Only</option>
                    <option value="images">Images Only (No Videos)</option>
                  </select>
                </div>
                <div class="form-group">
                  <div class="checkbox">
                    <label>
                      <input type="checkbox" id="autoScroll"> Auto-load pages (infinite scroll)
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <div class="checkbox">
                    <label>
                      <input type="checkbox" id="hideViewed"> Hide viewed albums
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <hr style="border-color:#444;margin:25px 0;">

            <!-- Album Page Filters -->
            <div class="settings-section">
              <div class="section-header">
                <i class="fa fa-film" style="margin-right:8px;"></i>Album Page Filters
              </div>
              <div class="section-content" style="background:#333;padding:20px;border-radius:8px;margin-top:12px;border:1px solid #444;">
                <div class="form-group" style="margin-bottom:20px;">
                  <label class="control-label" style="font-size:14px;color:#ddd;font-weight:500;">
                    <i class="fa fa-clock-o" style="margin-right:6px;"></i>Minimum Video Duration
                  </label>
                  <div style="display:flex;align-items:center;gap:12px;margin-top:8px;">
                    <input type="number" id="minVideoSeconds" class="form-control"
                           min="0" placeholder="0 = disabled"
                           style="flex:1;background:#444;border:1px solid #555;color:#fff;">
                    <span style="color:#888;font-size:13px;white-space:nowrap;font-weight:500;">seconds</span>
                  </div>
                  <div style="font-size:12px;color:#777;margin-top:8px;line-height:1.4;">
                    <i class="fa fa-info-circle" style="margin-right:5px;"></i>
                    Videos shorter than this duration will be hidden on album pages
                  </div>
                </div>

                <div style="background:#3a3a3a;padding:12px 15px;border-radius:6px;margin-top:15px;border-left:3px solid #eb6395;">
                  <div style="font-size:12px;color:#999;display:flex;align-items:center;">
                    <i class="fa fa-exclamation-circle" style="margin-right:8px;font-size:14px;"></i>
                    <span>These settings only apply when viewing individual albums</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Debug Info
            <div style="margin-top:20px;padding:12px 15px;background:#333;border-radius:6px;border:1px solid #444;">
              <div style="font-size:12px;color:#888;text-align:center;">
                <i class="fa fa-bug" style="margin-right:6px;"></i>
                Check browser console (F12) for detailed debug information
              </div>
            </div> -->
          </div>
          <div class="modal-footer" style="border-top:1px solid #444;padding:20px 25px;">
            <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
              <div style="display:flex;gap:10px;">
                <button id="clearViewed" class="btn btn-default"
                        style="background:#555;border-color:#666;color:#ccc;padding:8px 16px;">
                  <i class="fa fa-trash" style="margin-right:6px;"></i>Clear Viewed
                </button>
                <button id="resetAlbumFilters" class="btn btn-default"
                        style="border-color:#eb6395;color:#eb6395;background:transparent;padding:8px 16px;">
                  <i class="fa fa-refresh" style="margin-right:6px;"></i>Reset Filters
                </button>
              </div>
              <button id="saveEnhancer" class="btn btn-primary"
                      style="background:#eb6395;border-color:#eb6395;font-weight:600;padding:10px 20px;">
                <i class="fa fa-check" style="margin-right:8px;"></i>Apply Settings
              </button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.appendChild(modal);

    // Add comprehensive CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .settings-section {
        margin-bottom: 25px;
      }
      .section-header {
        font-weight: 600;
        color: #eb6395;
        font-size: 15px;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 2px solid #444;
        display: flex;
        align-items: center;
      }
      .section-content {
        padding-left: 10px;
      }
      .form-group {
        margin-bottom: 20px;
      }
      .control-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #ddd;
      }
      .form-control {
        background: #444;
        border: 1px solid #555;
        color: #fff;
        border-radius: 6px;
        padding: 10px 14px;
        font-size: 14px;
        transition: all 0.3s ease;
      }
      .form-control:focus {
        border-color: #eb6395;
        box-shadow: 0 0 0 3px rgba(235, 99, 149, 0.2);
        background: #444;
        color: #fff;
        outline: none;
      }
      .checkbox {
        margin-bottom: 12px;
      }
      .checkbox label {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #ddd;
        cursor: pointer;
        transition: color 0.2s ease;
      }
      .checkbox label:hover {
        color: #fff;
      }
      .checkbox input[type="checkbox"] {
        margin-right: 10px;
        transform: scale(1.2);
        accent-color: #eb6395;
      }
      .btn {
        border-radius: 6px;
        font-size: 13px;
        padding: 10px 18px;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-weight: 500;
      }
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      #clearViewed:hover {
        background: #666 !important;
        border-color: #777 !important;
      }
      #resetAlbumFilters:hover {
        background: rgba(235, 99, 149, 0.15) !important;
        box-shadow: 0 4px 12px rgba(235, 99, 149, 0.2);
      }
      #saveEnhancer:hover {
        background: #d85585 !important;
        border-color: #d85585 !important;
        box-shadow: 0 6px 16px rgba(235, 99, 149, 0.4);
      }
      .modal-content {
        border-radius: 12px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.6);
        border: 1px solid #444;
      }
      .modal-header {
        background: linear-gradient(135deg, #2b2b2b 0%, #333 100%);
      }
      .modal-body {
        background: linear-gradient(135deg, #2b2b2b 0%, #2f2f2f 100%);
      }
    `;
    document.head.appendChild(style);

    anchor.addEventListener('click', e => {
      e.preventDefault();
      // Initialize modal values
      document.getElementById('filterMode').value = settings.filterMode;
      document.getElementById('autoScroll').checked = settings.autoScroll;
      document.getElementById('hideViewed').checked = settings.hideViewed;
      document.getElementById('minVideoSeconds').value = settings.minVideoSeconds || 0;

      if (typeof $ === 'function') {
        $('#enhancerModal').modal('show');
      } else {
        modal.style.display = 'block';
      }
    });

    modal.querySelector('#saveEnhancer').addEventListener('click', () => {
      settings.filterMode = document.getElementById('filterMode').value;
      settings.autoScroll = document.getElementById('autoScroll').checked;
      settings.hideViewed = document.getElementById('hideViewed').checked;
      settings.minVideoSeconds = parseInt(document.getElementById('minVideoSeconds').value) || 0;
      saveSettings();

      if (typeof $ === 'function') {
        $('#enhancerModal').modal('hide');
      } else {
        modal.style.display = 'none';
      }

      setTimeout(() => {
        if (location.pathname.startsWith('/a/')) {
          applyAlbumEnhancements();
        } else {
          location.reload();
        }
      }, 300);
    });

    modal.querySelector('#clearViewed').addEventListener('click', clearViewed);

    modal.querySelector('#resetAlbumFilters').addEventListener('click', () => {
      settings.minVideoSeconds = 0;
      saveSettings();
      document.getElementById('minVideoSeconds').value = 0;
      if (location.pathname.startsWith('/a/')) {
        applyAlbumEnhancements();
      }
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (typeof $ === 'function') {
          $('#enhancerModal').modal('hide');
        } else {
          modal.style.display = 'none';
        }
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    fixLazyImages();
    if (location.pathname.startsWith('/a/')) {
      // FIXED: Longer delay for album pages to ensure media is loaded
      setTimeout(() => {
        console.log('Applying album enhancements...');
        applyAlbumEnhancements();
        observeAlbumChanges();
      }, 2000);
    } else {
      applyInitialFilter();
      setupInfiniteScroll();
    }
    addSettingsUI();
    console.log('Erome Enhancer v2.8.8 loaded - Premium UI');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();