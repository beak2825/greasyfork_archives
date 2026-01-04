// ==UserScript==
// @name         CRG Mark ShowTopics
// @namespace    http://lamansion-crg.net
// @version      0.1.2
// @description  Añade iconos a los hilos para marcarlos como leído/pendiente/ignorado/favorito y valoraciones.
// @author       Pinocchio
// @match        *://*lamansion-crg.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/winbox@0.2.82/dist/winbox.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557357/CRG%20Mark%20ShowTopics.user.js
// @updateURL https://update.greasyfork.org/scripts/557357/CRG%20Mark%20ShowTopics.meta.js
// ==/UserScript==

(() => { 'use strict';

  // Signal for UX script to detect core presence
  window.coreScriptLoaded = true;

  // Create IndexedDB instance for markers
  const markersDB = localforage.createInstance({
    name: "CRG_Comicteca_DB",
    storeName: "markers"
  });

  // Global variable to track backup window instance
  let backupWindowInstance = null;

  // Simple tooltip function for user feedback
  function showTooltip(message, isError = false) {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${isError ? '#d32f2f' : '#000000dd'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 100000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.style.opacity = '1', 10);
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 300);
    }, 2000);
  }

  // ===== ALL UPDATE FUNCTIONS FIRST =====

  let currentPrefs = null; // Global prefs cache for synchronous access

  let cachedDB = null;         // The parsed DB object
  let cachedVersion = null;    // Stringified version for quick comparison

  async function getTagColorPrefs() {
    try {
      const saved = await GM_getValue(PREF_KEY, null);
      if (saved && typeof saved === 'object') {
        // Validate and merge saved preferences with defaults
        const validatedPrefs = validatePreferences(saved);
        currentPrefs = { ...DEFAULT_PREFS, ...validatedPrefs };
      } else {
        currentPrefs = DEFAULT_PREFS;
      }
      return currentPrefs;
    } catch (error) {
      console.error('[CRG] Error loading preferences:', error);
      currentPrefs = DEFAULT_PREFS;
      return DEFAULT_PREFS;
    }
  }

  async function updateGlobalTagStyles() {
    const prefs = await getTagColorPrefs();
    const style = document.getElementById('crg-tagbadge-dynamic');
    if (style) {
      style.textContent = `.tag-badge {
        border: ${prefs.borderWidth}px solid rgba(0,0,0,0.2);
        border-radius: ${prefs.borderRadius}px;
        font-weight: ${prefs.fontWeight};
        font-style: ${prefs.fontStyle};
        box-shadow: ${prefs.boxShadow == 0 ? 'none' : prefs.boxShadow == 1 ? '0 1px 3px rgba(0,0,0,0.2)' : prefs.boxShadow == 2 ? '0 2px 6px rgba(0,0,0,0.25)' : '0 4px 12px rgba(0,0,0,0.3)'};
      }`;
    }

    // Set comment dot color CSS variable
    document.documentElement.style.setProperty('--comment-dot-color', prefs.commentDotColor);
  }

  async function updateAllTagColors() {
    const prefs = await getTagColorPrefs();
    if (prefs.useFlatColors) {
      document.querySelectorAll('.tag-badge').forEach(badge => {
        badge.style.background = prefs.flatBackgroundColor;
        badge.style.color = prefs.flatTextColor;
      });
      return;
    }

    const goldenRatio = 0.618033988749895;
    document.querySelectorAll('.tag-badge').forEach(badge => {
      const tag = '#' + badge.textContent.trim();
      let h = 0;
      for (let i = 0; i < tag.length; i++) {
        h += tag.charCodeAt(i) * goldenRatio;
        h -= Math.floor(h);
      }
      h -= Math.floor(h);
      const hue = Math.floor((h * 360 + prefs.hueOffset) % 360);
      const background = `hsl(${hue}, ${prefs.saturation}%, ${prefs.lightness}%)`;
      const color = prefs.forceBlackText ? '#000' : (prefs.lightness > 60 ? '#000' : '#fff');

      badge.style.background = background;
      badge.style.color = color;
    });
  }

  function updateAllStarColors() {
    document.querySelectorAll('.rating-stars').forEach(container => {
      const stars = container.querySelectorAll('svg');
      const rating = parseFloat(container.dataset.rating) || 0;
      updateStars(stars, rating);
    });
  }



  // ===== NOW CREATE THE MARKER (functions exist) =====
  if (!document.getElementById('crg-core-marker')) {
    const marker = document.createElement('div');
    marker.id = 'crg-core-marker';
    marker.style.display = 'none';

    marker.savePreferencesToCore = async function(prefsObject) {
      try {
        // Validate preferences before saving
        const validatedPrefs = validatePreferences(prefsObject);
        currentPrefs = validatedPrefs; // Update cached prefs immediately
        await GM_setValue(PREF_KEY, validatedPrefs);
        await updateGlobalTagStyles();
        await updateAllTagColors();
        updateAllStarColors(); // Update star colors for all existing ratings
        updateAllMarkerIcons(); // Update marker icons for all existing markers
      } catch (error) {
        console.error('[CRG] Error saving preferences:', error);
        // Fall back to current preferences if validation fails
        await updateGlobalTagStyles();
        await updateAllTagColors();
        updateAllStarColors();
        updateAllMarkerIcons();
      }
    };

    document.documentElement.appendChild(marker);
  }



  const PREF_KEY = 'savedPrefs';
  const DEFAULT_PREFS = {
    saturation: 75,
    lightness: 65,
    hueOffset: 0,
    forceBlackText: true,
    borderWidth: 1,
    borderRadius: 3,
    fontWeight: 700,
    fontStyle: 'normal',
    boxShadow: 1,

    useFlatColors: false,
    flatBackgroundColor: '#ffffff',
    flatTextColor: '#000000',

    commentDotColor: '#00ff00',
    starColors: {
      empty: [0, 0, 0],
      half: [30, 70, 50],
      full: [0, 70, 50],
      perfect: [120, 70, 50]
    },
    iconSet: 'default'
  };

  // Default icon set for when core runs standalone
  const defaultIconSet = {'0':'🗒', '1':'✅', '2':'☑️', '3':'⛔️', '4':'💙'};
  // Ratings are now always enabled - removed toggle

  function validatePreferences(prefs) {
    // Validate and sanitize preferences to prevent errors from corrupted data
    const validated = {};

    // Validate numeric ranges
    validated.saturation = Math.max(0, Math.min(100, typeof prefs.saturation === 'number' ? prefs.saturation : DEFAULT_PREFS.saturation));
    validated.lightness = Math.max(0, Math.min(100, typeof prefs.lightness === 'number' ? prefs.lightness : DEFAULT_PREFS.lightness));
    validated.hueOffset = Math.max(0, Math.min(359, typeof prefs.hueOffset === 'number' ? prefs.hueOffset : DEFAULT_PREFS.hueOffset));

    // Validate boolean values
    validated.forceBlackText = typeof prefs.forceBlackText === 'boolean' ? prefs.forceBlackText : DEFAULT_PREFS.forceBlackText;
    validated.useFlatColors = typeof prefs.useFlatColors === 'boolean' ? prefs.useFlatColors : DEFAULT_PREFS.useFlatColors;

    // Validate style values
    validated.borderWidth = Math.max(0, Math.min(3, typeof prefs.borderWidth === 'number' ? prefs.borderWidth : DEFAULT_PREFS.borderWidth));
    validated.borderRadius = Math.max(0, Math.min(8, typeof prefs.borderRadius === 'number' ? prefs.borderRadius : DEFAULT_PREFS.borderRadius));
    validated.fontWeight = [400, 700, 900].includes(prefs.fontWeight) ? prefs.fontWeight : DEFAULT_PREFS.fontWeight;
    validated.fontStyle = ['normal', 'italic'].includes(prefs.fontStyle) ? prefs.fontStyle : DEFAULT_PREFS.fontStyle;
    validated.boxShadow = Math.max(0, Math.min(3, typeof prefs.boxShadow === 'number' ? prefs.boxShadow : DEFAULT_PREFS.boxShadow));

    // Validate colors
    validated.flatBackgroundColor = typeof prefs.flatBackgroundColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(prefs.flatBackgroundColor) ? prefs.flatBackgroundColor : DEFAULT_PREFS.flatBackgroundColor;
    validated.flatTextColor = typeof prefs.flatTextColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(prefs.flatTextColor) ? prefs.flatTextColor : DEFAULT_PREFS.flatTextColor;
    validated.commentDotColor = typeof prefs.commentDotColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(prefs.commentDotColor) ? prefs.commentDotColor : DEFAULT_PREFS.commentDotColor;

    // Validate star colors
    validated.starColors = {};
    ['empty', 'half', 'full', 'perfect'].forEach(type => {
      if (prefs.starColors && Array.isArray(prefs.starColors[type]) && prefs.starColors[type].length === 3) {
        validated.starColors[type] = [
          Math.max(0, Math.min(360, prefs.starColors[type][0])),
          Math.max(0, Math.min(100, prefs.starColors[type][1])),
          Math.max(0, Math.min(100, prefs.starColors[type][2]))
        ];
      } else {
        validated.starColors[type] = DEFAULT_PREFS.starColors[type].slice();
      }
    });

    // Validate icon set
    if (prefs.iconSet && typeof prefs.iconSet === 'object' && !Array.isArray(prefs.iconSet)) {
      // Validate it's a proper icon set object with status keys 0-4
      const iconSet = {};
      for (let i = 0; i <= 4; i++) {
        if (typeof prefs.iconSet[i] === 'string' && prefs.iconSet[i].length > 0) {
          iconSet[i] = prefs.iconSet[i];
        } else {
          iconSet[i] = defaultIconSet[i];
        }
      }
      validated.iconSet = iconSet;
    } else {
      validated.iconSet = DEFAULT_PREFS.iconSet;
    }

    return validated;
  }

  const SKIP_QUERIES = new Set(['showtopic=32666', 'showtopic=30202', 'showtopic=32667', 'showtopic=110414', 'showtopic=109282', 'showforum=5']);
  let activeRatingDiv = null;
  let dragging = false;
  let dragCurrentRating = 0;

  function parseData(val) {
    if (!val) return {status: 0, rating: 0, comment: ''};
    const parts = val.split(':');
    const status = Math.max(0, Math.min(4, parts[0] ? +parts[0] : 0));
    const rating = Math.round(Math.max(0, Math.min(5, parts[1] ? +parts[1] : 0)) * 2) / 2;
    const encodedComment = parts.slice(2).join(':');
    const comment = encodedComment ? decodeComment(encodedComment) : '';
    return {status, rating, comment};
  }

  function encodeComment(c) {
    if (!c) return '';
    return btoa(unescape(encodeURIComponent(c)));
  }

  function decodeComment(c) {
    if (!c) return '';
    try {
      return decodeURIComponent(escape(atob(c)));
    } catch (e) {
      return c;
    }
  }

  function extractTags(comment) {
    return comment.match(/#[^\s#]+/g) || [];
  }

  async function getTagColors(tag) {
    const prefs = await getTagColorPrefs();

    // Check if flat colors are enabled
    if (prefs.useFlatColors) {
      return {
        background: prefs.flatBackgroundColor,
        color: prefs.flatTextColor
      };
    }

    // Random colors using golden ratio algorithm
    const goldenRatio = 0.618033988749895;
    let h = 0;

    for (let i = 0; i < tag.length; i++) {
      h += tag.charCodeAt(i) * goldenRatio;
      h -= Math.floor(h);
    }
    h -= Math.floor(h);

    const hue = Math.floor((h * 360 + prefs.hueOffset) % 360);
    const saturation = prefs.saturation;
    const lightness = prefs.lightness;

    const background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const textColor = prefs.forceBlackText ? '#000' : (lightness > 60 ? '#000' : '#fff');

    return { background, color: textColor };
  }

  // CRG_Utils is defined in both scripts to ensure availability
  // regardless of load order or if only one script is installed.
  // The guard prevents overwriting when both are present.
  if (!window.CRG_Utils) window.CRG_Utils = {
    parseData,
    encodeComment,
    decodeComment,
    extractTags,
    normalize
  };

  async function updateTags(anchorElement, comment) {
    // Remove existing tag badges after the anchor
    let existing = anchorElement.nextElementSibling;
    while (existing && existing.classList.contains('tag-badges')) {
      const next = existing.nextElementSibling;
      existing.remove();
      existing = next;
    }

    const tags = extractTags(comment);
    if (tags.length > 0) {
      const tagDiv = document.createElement('span');
      tagDiv.className = 'tag-badges';

      for (const tag of tags) {
        const badge = document.createElement('span');
        badge.className = 'tag-badge';
        badge.textContent = tag.slice(1); // Hide the # symbol

        const colors = await getTagColors(tag);
        badge.style.background = colors.background;
        badge.style.color = colors.color;

        tagDiv.appendChild(badge);
      }
      anchorElement.after(tagDiv);
    }
  }

  function updateMarkerIcon(el, status, hasComment) {
    el.className = `lm-tm status-${status}`;
    const effectiveIconSet = (currentPrefs?.iconSet && typeof currentPrefs.iconSet === 'object') ? currentPrefs.iconSet : defaultIconSet;
    const icon = effectiveIconSet[status] || '🗒';
    el.textContent = icon;
    if (hasComment) {
      el.classList.add('has-comment');
    } else {
      el.classList.remove('has-comment');
    }
  }

  function updateAllMarkerIcons(iconSetOverride = null) {
    const effectiveIconSet = iconSetOverride || ((currentPrefs?.iconSet && typeof currentPrefs.iconSet === 'object') ? currentPrefs.iconSet : defaultIconSet);
    document.querySelectorAll('.lm-tm').forEach(marker => {
      const status = marker.className.match(/status-(\d)/)?.[1] || '0';
      const hasComment = marker.classList.contains('has-comment');
      // Temporarily update icon
      const icon = effectiveIconSet[status] || '🗒';
      marker.textContent = icon;
      // Keep other classes
    });
  }

  // Expose for UX live preview
  window.updateAllMarkerIcons = updateAllMarkerIcons;

  async function getDB(forceRefresh = false) {
    // Fast path: try DOM export first (always up-to-date if core is running)
    const domEl = document.getElementById('crg-markers-data');
    if (domEl && domEl.textContent && !forceRefresh) {
      if (domEl.textContent !== cachedVersion) {
        try {
          cachedDB = JSON.parse(domEl.textContent);
          cachedVersion = domEl.textContent;
          return cachedDB;
        } catch (e) {
          // fall through to storage
        }
      } else if (cachedDB !== null) {
        return cachedDB;  // Instant memory hit
      }
    }

    // If no cache or forced refresh, load from IndexedDB
    if (cachedDB !== null && !forceRefresh) {
      return cachedDB;
    }

    const db = {};
    await markersDB.iterate((value, key) => {
      db[key] = normalize(value.status, value.rating, value.comment);
    });

    cachedDB = db;
    cachedVersion = JSON.stringify(db);

    // Update DOM export for consistency
    if (domEl) {
      domEl.textContent = cachedVersion;
    }

    return cachedDB;
  }

  async function saveTagColorPrefs(prefs) {
    await GM_setValue(PREF_KEY, prefs);
  }

  function normalize(status, rating, comment = '') {
    const c = encodeComment(comment.trim());
    if (status === 0 && rating === 0 && !c) return '0:0';
    return `${status}:${rating}:${c}`;
  }

  function updateDOMExport(db) {
    const markerEl = document.head.querySelector('#crg-markers-data');
    if (markerEl) markerEl.textContent = JSON.stringify(db);
  }

  async function saveImmediate(id, status, rating, comment = '') {
    try {
      const value = window.CRG_Utils.normalize(status, rating, comment);
      console.log('[CRG] saveImmediate:', id, status, rating, comment, '->', value);

      // Update DOM immediately for live filtering
      const markerEl = document.head.querySelector('#crg-markers-data');
      if (markerEl) {
        const db = JSON.parse(markerEl.textContent || '{}');
        if (value === '0:0') delete db[id];
        else db[id] = value;
        markerEl.textContent = JSON.stringify(db);
      }

      // Save to DB immediately
      if (value === '0:0') {
        console.log('[CRG] Removing from DB:', id);
        await markersDB.removeItem(id);
      } else {
        const data = parseData(value);
        console.log('[CRG] Saving to DB:', id, data);
        await markersDB.setItem(id, data);
      }

      // Update cache
      cachedDB = null;
      await getDB(true);
      console.log('[CRG] saveImmediate completed for:', id);
    } catch (error) {
      console.error('[CRG] saveImmediate failed:', id, error);
      // Fallback: try to update DOM at least
      const markerEl = document.head.querySelector('#crg-markers-data');
      if (markerEl) {
        try {
          const db = JSON.parse(markerEl.textContent || '{}');
          const value = window.CRG_Utils.normalize(status, rating, comment);
          if (value === '0:0') delete db[id];
          else db[id] = value;
          markerEl.textContent = JSON.stringify(db);
        } catch (domError) {
          console.error('[CRG] DOM update also failed:', domError);
        }
      }
    }
  }

  document.head.insertAdjacentHTML('beforeend', `<style>
  .lm-tm {
    cursor: pointer;
    margin-left: 6px;
    user-select: none;
    position: relative;
    font-size: 0.9em;
  }
  .lm-tm.has-comment::before {
    content: '●';
    position: absolute;
    top: -9px;
    left: 50%;
    transform: translateX(-49.7%);
    font-size: 5px;
    color: var(--comment-dot-color, green);
    pointer-events: none;
    z-index: 1;
  }
  .rating-stars{cursor:pointer;margin-left:4px;}
  .rating-stars svg{pointer-events:none;}
  .tag-badges{margin-left:4px;font-size:0.7em;}
  .tag-badge{display:inline-block;background:#e0e0e0;padding:1px 3px;margin:0 2px;border-radius:3px;color:#333;font-weight:bold;}
  </style>`);

  const createStar = (fill = 'grey') => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 10 10');
    svg.style.width = '10px';
    svg.style.height = '10px';
    svg.style.display = 'inline-block';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M5 0 L6.3 3 L9.5 3 L7 5 L7.8 8 L5 6.5 L2.2 8 L3 5 L0.5 3 L3.7 3 Z');
    path.setAttribute('fill', fill);
    path.setAttribute('stroke', 'transparent');
    path.setAttribute('stroke-width', '0.5');
    svg.appendChild(path);
    return svg;
  };

  const updateStars = (stars, rating) => {
    const prefs = currentPrefs; // Use cached prefs
    stars.forEach((star, i) => {
      let fill = 'transparent';
      let stroke = 'lightgrey';
      const isActive = rating >= i + 0.5;
      if (!isActive) {
        // Empty stars - keep transparent for collapsing
        fill = 'transparent';
        stroke = 'grey';
      } else {
        const isFull = rating >= i + 1;
        let starType, color;
        if (rating === 5) { // Perfect/5-star - all stars get perfect color
          starType = 'perfect';
        } else if (isFull) {
          starType = 'full';
        } else {
          starType = 'half';
        }
        color = prefs?.starColors?.[starType] || [0, 70, 50]; // fallback HSL
        fill = `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`;
        stroke = 'transparent';
      }
      star.querySelector('path').setAttribute('fill', fill);
      star.querySelector('path').setAttribute('stroke', stroke);
    });
  };

  const updateDisplay = (stars) => {
    stars.forEach((star) => {
      const fill = star.querySelector('path').getAttribute('fill');
      star.style.display = fill === 'transparent' ? 'none' : 'inline-block';
    });
  };

  (async () => {
    // One-time migration for users coming from published v0.1.0
    const migrated = await GM_getValue('markers_migrated', false);
    if (!migrated) {
      const oldDataRaw = await GM_getValue('readTopics', null);
      if (oldDataRaw) {
        try {
          const oldData = JSON.parse(oldDataRaw);
          if (oldData && typeof oldData === 'object' && Object.keys(oldData).length > 0) {
            console.log('[CRG] Migrating markers from readTopics...');
            for (const [id, val] of Object.entries(oldData)) {
              if (val && val !== '0:0') {
                const parts = val.split(':');
                const status = Math.max(0, Math.min(4, parts[0] ? +parts[0] : 0));
                const rating = Math.round(Math.max(0, Math.min(5, parts[1] ? +parts[1] : 0)) * 2) / 2;
                const encodedComment = parts.slice(2).join(':');
                const comment = encodedComment ? decodeComment(encodedComment) : '';
                await markersDB.setItem(id, {status, rating, comment});
              }
            }
            await GM_deleteValue('readTopics');
            await GM_setValue('markers_migrated', true);
            console.log('[CRG] Migration complete');
          }
        } catch (e) {
          console.warn('[CRG] Failed to parse old data, skipping migration', e);
        }
      }
    }

    // Load preferences before processing any markers
    await getTagColorPrefs();

    // Ratings are now always enabled
    const db = await getDB();

    const addMarkerToLink = async (a) => {
      const query = a.href.split('?')[1]?.split('#')[0] || '';
      if (SKIP_QUERIES.has(query) || query.includes('act=Search')) return;
      if (!/^(?:showtopic=\d+|act=ST.*&t=\d+)(?:&hl=)?$/.test(query)) return;
      if (a.closest('.signature')) return;

      const match = query.match(/(?:showtopic|t)=(\d+)/);
      if (!match) return;
      const id = match[1];

      const data = window.CRG_Utils.parseData(db[id]);

      // Remove existing markers if any
      let existing = a.nextElementSibling;
      while (existing && (existing.classList.contains('lm-tm') || existing.classList.contains('rating-stars') || existing.classList.contains('tag-badges'))) {
        const next = existing.nextElementSibling;
        existing.remove();
        existing = next;
      }

      const m = document.createElement('span');
      m.className = 'lm-tm';
      m.title = data.comment || '';
      updateMarkerIcon(m, data.status, !!data.comment);

      // Store current data in closure for optimistic updates
      let currentData = data;
      let lastElement = m;

      m.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.ctrlKey || e.metaKey) {
          const newComment = prompt('Escribe un comentario:', currentData.comment);
          if (newComment === null) return;
          const trimmedComment = newComment.trim();

          // Update local data and UI immediately
          currentData.comment = trimmedComment;
          m.title = trimmedComment || '';
          updateMarkerIcon(m, currentData.status, !!trimmedComment);
          updateTags(lastElement, currentData.comment);

          const value = window.CRG_Utils.normalize(currentData.status, currentData.rating, trimmedComment);
          if (value === '0:0') {
            delete db[id];
          } else {
            db[id] = value;
          }
          updateDOMExport(db);

          // Save immediately
          await saveImmediate(id, currentData.status, currentData.rating, trimmedComment);

          // Update topic data immediately
          if (window.updateTopicData) {
            window.updateTopicData(id, currentData.status, currentData.rating, trimmedComment, window.CRG_Utils.extractTags(trimmedComment));
          }

          // Refresh list filter if popup is open
          if (document.getElementById('crg-list-popup') && typeof window.refreshListFilter === 'function') {
              window.refreshListFilter();
          }

          // Update cache with new DB state
          cachedDB = db;
          cachedVersion = JSON.stringify(db);
        } else {
          // Cycle status optimistically
          const nextStatus = currentData.status >= 4 ? 0 : currentData.status + 1;
          currentData.status = nextStatus;

          // Update UI immediately
          updateMarkerIcon(m, nextStatus, !!currentData.comment);
          m.title = currentData.comment || '';

          const value = window.CRG_Utils.normalize(nextStatus, currentData.rating, currentData.comment);
          if (value === '0:0') {
            delete db[id];
          } else {
            db[id] = value;
          }
          updateDOMExport(db);

          // Save immediately
          await saveImmediate(id, nextStatus, currentData.rating, currentData.comment);

          // Update topic data immediately
          if (window.updateTopicData) {
            window.updateTopicData(id, nextStatus, currentData.rating, currentData.comment, window.CRG_Utils.extractTags(currentData.comment));
          }

          // Refresh list filter if popup is open
          if (document.getElementById('crg-list-popup') && typeof window.refreshListFilter === 'function') {
              window.refreshListFilter();
          }

          // Update cache with new DB state
          cachedDB = db;
          cachedVersion = JSON.stringify(db);
        }
      };

      a.after(m);

      // Ratings are now always enabled
      const ratingDiv = document.createElement('div');
      ratingDiv.className = 'rating-stars';
      ratingDiv.style.display = 'inline-block';
      ratingDiv.style.verticalAlign = 'top';
      const collapsed = data.rating === 0;
      const stars = [];
      for (let i = 0; i < 5; i++) {
        const star = createStar();
        ratingDiv.appendChild(star);
        stars.push(star);
      }
      updateStars(stars, data.rating);
      updateDisplay(stars);
      if (collapsed) {
        for (let i = 1; i < 5; i++) stars[i].style.display = 'none';
        stars[0].style.display = 'inline-block';
      }
      m.after(ratingDiv);
      ratingDiv.dataset.id = id;
      ratingDiv.dataset.rating = data.rating;
      ratingDiv.dataset.collapsed = collapsed ? '1' : '0';
      ratingDiv.currentData = currentData; // Store reference for updating rating
      lastElement = ratingDiv;

      updateTags(lastElement, data.comment);
    };

    const processLinks = async (links) => {
      for (const link of links) {
        try {
          await addMarkerToLink(link);
        } catch (err) {
          console.error('CRG Mark: Failed to process link', link.href, err);
        }
      }
    };

    // Initial load
    const initialLinks = document.querySelectorAll('a[href^="http://lamansion-crg.net/forum/index.php?"][href*="showtopic="], a[href^="http://lamansion-crg.net/forum/index.php?"][href*="act=ST"]');
    await processLinks(initialLinks);

    // Rating drag handlers
    document.addEventListener('mousedown', e => {
      if (e.target.closest('.rating-stars')) {
        activeRatingDiv = e.target.closest('.rating-stars');
        dragging = true;
        if (activeRatingDiv.dataset.collapsed === '1') {
          activeRatingDiv.dataset.collapsed = '0';
          dragCurrentRating = 0;
          const stars = activeRatingDiv.querySelectorAll('svg');
          updateStars(stars, 0);
          updateDisplay(stars);
          stars.forEach(star => star.style.display = 'inline-block');
        }
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', e => {
      if (!dragging || !activeRatingDiv) return;
      const rect = activeRatingDiv.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const rating_calc = Math.round((x / rect.width) * 10) * 0.5 || 0;
      dragCurrentRating = rating_calc;
      const stars = activeRatingDiv.querySelectorAll('svg');
      updateStars(stars, dragCurrentRating);
      stars.forEach(star => star.style.display = 'inline-block');
    });

    document.addEventListener('mouseup', async () => {
      if (dragging && activeRatingDiv) {
        dragging = false;
        const stars = activeRatingDiv.querySelectorAll('svg');
        if (dragCurrentRating === 0) {
          activeRatingDiv.dataset.collapsed = '1';
          updateDisplay(stars);
          for (let i = 1; i < 5; i++) stars[i].style.display = 'none';
          stars[0].style.display = 'inline-block';
        } else {
          activeRatingDiv.dataset.collapsed = '0';
          updateDisplay(stars);
        }

        const id = activeRatingDiv.dataset.id;
        const freshData = window.CRG_Utils.parseData(db[id]);
        const value = window.CRG_Utils.normalize(freshData.status, dragCurrentRating, freshData.comment);
        if (value === '0:0') {
          delete db[id];
        } else {
          db[id] = value;
        }
        updateDOMExport(db);
        await saveImmediate(id, freshData.status, dragCurrentRating, freshData.comment);

        // Update the currentData reference in the marker closure
        if (activeRatingDiv.currentData) {
          activeRatingDiv.currentData.rating = dragCurrentRating;
        }

        // Update topic data immediately
        if (window.updateTopicData) {
          window.updateTopicData(id, freshData.status, dragCurrentRating, freshData.comment, window.CRG_Utils.extractTags(freshData.comment));
        }

        // Refresh list filter if popup is open
        if (document.getElementById('crg-list-popup') && typeof window.refreshListFilter === 'function') {
            window.refreshListFilter();
        }

        activeRatingDiv = null;

        // Update cache with new DB state
        cachedDB = db;
        cachedVersion = JSON.stringify(db);
      }
    });



    const el = document.createElement('script');
    el.type = 'application/json';
    el.id = 'crg-markers-data';
    el.textContent = JSON.stringify(await getDB());
    document.head.appendChild(el);

    // ===== BACKUP SYSTEM =====

    // Backup settings storage key
    const BACKUP_SETTINGS_KEY = 'CRG_BackupSettings';

    // Default backup settings
    const DEFAULT_BACKUP_SETTINGS = {
      includePrefs: true,
      includeScraped: false, // Future-proof for scraped data
      autoBackup: {
        enabled: false,
        interval: 24, // hours
        lastBackup: 0
      }
    };

    // Load backup settings
    async function loadBackupSettings() {
      try {
        const settings = await GM_getValue(BACKUP_SETTINGS_KEY, null);
        return settings ? { ...DEFAULT_BACKUP_SETTINGS, ...settings } : DEFAULT_BACKUP_SETTINGS;
      } catch (e) {
        console.warn('[CRG] Error loading backup settings:', e);
        return DEFAULT_BACKUP_SETTINGS;
      }
    }

    // Save backup settings
    async function saveBackupSettings(settings) {
      try {
        await GM_setValue(BACKUP_SETTINGS_KEY, settings);
      } catch (e) {
        console.warn('[CRG] Error saving backup settings:', e);
      }
    }

    // Create backup data
    async function createBackupData(includePrefs = true, includeScraped = false) {
      console.log('[CRG] Creating backup data - includes prefs:', includePrefs);

      // Always include markers
      const markers = {};
      await markersDB.iterate((value, key) => {
        markers[key] = value;
      });

      const data = { markers };

      // Include preferences if requested and they exist
      if (includePrefs) {
        try {
          const prefs = await GM_getValue('UX_Prefs', {});
          console.log('[CRG] Loaded prefs keys:', Object.keys(prefs));
          if (prefs && Object.keys(prefs).length > 0) {
            data.prefs = prefs;
            console.log('[CRG] Preferences included:', Object.keys(prefs).length, 'settings');
          } else {
            console.warn('[CRG] No preferences found in UX_Prefs');
          }
        } catch (e) {
          console.warn('[CRG] Error reading preferences for backup:', e);
        }
      }

      // Scraped data removed - owned by GList script and re-scrapable
      console.log('[CRG] Backup data keys:', Object.keys(data));
      return {
        version: 1,
        timestamp: Date.now(),
        settings: { includePrefs, includeScraped: false }, // Always false now
        data: data
      };
    }

    // Compress data using CompressionStream
    async function compressData(data) {
      const jsonString = JSON.stringify(data);
      const stream = new CompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();

      writer.write(new TextEncoder().encode(jsonString));
      writer.close();

      const chunks = [];
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }

      return new Blob(chunks, { type: 'application/gzip' });
    }

    // Decompress data using DecompressionStream
    async function decompressData(blob) {
      const stream = new DecompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();

      writer.write(await blob.arrayBuffer());
      writer.close();

      const chunks = [];
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(...value);
      }

      const jsonString = new TextDecoder().decode(new Uint8Array(chunks));
      return JSON.parse(jsonString);
    }

    // Export backup
    async function exportBackup(includePrefs = true, includeScraped = false) {
      try {
        console.log('[CRG] Starting backup export...');

        const backupData = await createBackupData(includePrefs, includeScraped);
        const compressedBlob = await compressData(backupData);

        // Create filename
        const date = new Date().toISOString().slice(0, 10);
        const filename = `crg-backup-${date}.json.gz`;

        // Download
        const url = URL.createObjectURL(compressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        console.log('[CRG] Backup exported successfully:', filename);
        return true;
      } catch (e) {
        console.error('[CRG] Backup export failed:', e);
        alert('Error al crear la copia de seguridad: ' + e.message);
        return false;
      }
    }

    // Import backup
    async function importBackup() {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.crg-backup-*.json.gz';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return resolve(false);

          try {
            console.log('[CRG] Importing backup from:', file.name);

            const decompressed = await decompressData(file);
            if (!decompressed.version || !decompressed.data) {
              throw new Error('Formato de archivo inválido');
            }

            // Confirm import
            const confirmMsg = `¿Importar copia de seguridad?\n\n` +
              `Marcadores: ${Object.keys(decompressed.data.markers || {}).length}\n` +
              `Preferencias: ${decompressed.data.prefs ? 'Sí' : 'No'}\n\n` +
              `Esto sobrescribirá los datos existentes.`;

            if (!confirm(confirmMsg)) return resolve(false);

            // Import markers
            if (decompressed.data.markers) {
              await markersDB.clear();
              for (const [id, marker] of Object.entries(decompressed.data.markers)) {
                await markersDB.setItem(id, marker);
              }
            }

            // Import preferences
            if (decompressed.data.prefs) {
              await GM_setValue('UX_Prefs', decompressed.data.prefs);
            }

            console.log('[CRG] Backup imported successfully');
            alert('Copia de seguridad importada correctamente. La página se recargará.');
            location.reload();
            resolve(true);

          } catch (e) {
            console.error('[CRG] Backup import failed:', e);
            alert('Error al importar la copia: ' + e.message);
            resolve(false);
          }
        };
        input.click();
      });
    }

    // Auto-backup check
    async function checkAutoBackup() {
      try {
        const settings = await loadBackupSettings();
        if (!settings.autoBackup.enabled) return;

        const now = Date.now();
        const hoursSinceLast = (now - settings.autoBackup.lastBackup) / (1000 * 60 * 60);

        if (hoursSinceLast >= settings.autoBackup.interval) {
          console.log('[CRG] Performing auto-backup...');

          // Check if data has changed (simple check - could be improved)
          const markersCount = await markersDB.length();
          if (markersCount > 0) {
            const success = await exportBackup(settings.includePrefs, settings.includeScraped);
            if (success) {
              settings.autoBackup.lastBackup = now;
              await saveBackupSettings(settings);
              console.log('[CRG] Auto-backup completed');
            }
          }
        }
      } catch (e) {
        console.warn('[CRG] Auto-backup check failed:', e);
      }
    }

    // Show backup panel
    async function showBackupPanel() {
      // Check if backup panel already exists
      if (backupWindowInstance) {
        // Focus existing window
        backupWindowInstance.focus();
        return;
      }

      const content = document.createElement('div');
      content.style.cssText = 'display: flex; flex-direction: column; color: #000; padding: 15px; font-family: Arial, sans-serif;';

      // Load current settings
      const backupSettings = await loadBackupSettings();

      content.innerHTML = `
        <div style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #333;">Contenido a incluir</h3>

          <label style="display: block; margin-bottom: 10px;">
            <input type="checkbox" id="backup-markers" checked disabled style="margin-right: 8px;">
            Marcadores y comentarios (siempre incluido)
          </label>

          <label style="display: block; margin-bottom: 10px;">
            <input type="checkbox" id="backup-prefs" ${backupSettings.includePrefs ? 'checked' : ''} style="margin-right: 8px;">
            Preferencias de apariencia
          </label>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #333;">Copia automática</h3>

          <label style="display: block; margin-bottom: 10px;">
            <input type="checkbox" id="auto-backup-enabled" ${backupSettings.autoBackup.enabled ? 'checked' : ''} style="margin-right: 8px;">
            Habilitar copias automáticas
          </label>

          <div style="margin-left: 20px;">
            <label style="display: block; margin-bottom: 5px;">
              Intervalo:
              <select id="auto-backup-interval" ${backupSettings.autoBackup.enabled ? '' : 'disabled'} style="margin-left: 8px; padding: 2px;">
                <option value="12" ${backupSettings.autoBackup.interval === 12 ? 'selected' : ''}>Cada 12 horas</option>
                <option value="24" ${backupSettings.autoBackup.interval === 24 ? 'selected' : ''}>Cada 24 horas</option>
                <option value="48" ${backupSettings.autoBackup.interval === 48 ? 'selected' : ''}>Cada 48 horas</option>
                <option value="168" ${backupSettings.autoBackup.interval === 168 ? 'selected' : ''}>Cada 7 días</option>
              </select>
            </label>

            <div style="margin-top: 10px;">
              <span style="color: #666;">Las copias se guardarán en la carpeta de descargas por defecto</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; color: #333;">Acciones manuales</h3>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="manual-export" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Exportar copia
            </button>
            <button id="manual-import" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Importar copia
            </button>
          </div>
        </div>

        <div style="text-align: center; padding-top: 15px;">
          <button id="backup-save" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">
            Guardar configuración
          </button>
          <button id="backup-cancel" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Cancelar
          </button>
        </div>
      `;

      // Create WinBox window
      const win = new WinBox({
        id: "crg-backup-panel",
        title: "Copias de Seguridad",
        width: "400px",
        height: "500px",
        x: "center",
        y: "center",
        mount: content,
        class: "no-shadow",
        index: 9999,
        background: "#343a40",
        onclose: () => {
          backupWindowInstance = null;
          // Cleanup
        }
      });

      // Store window instance
      backupWindowInstance = win;

      // Event handlers
      const autoBackupToggle = content.querySelector('#auto-backup-enabled');
      const intervalSelect = content.querySelector('#auto-backup-interval');

      autoBackupToggle.onchange = () => {
        const enabled = autoBackupToggle.checked;
        intervalSelect.disabled = !enabled;
      };

      content.querySelector('#manual-export').onclick = async () => {
        const includePrefs = content.querySelector('#backup-prefs').checked;
        console.log('[CRG] Manual export with prefs:', includePrefs);
        await exportBackup(includePrefs, false);
      };

      content.querySelector('#manual-import').onclick = async () => {
        await importBackup();
      };

      content.querySelector('#backup-save').onclick = async () => {
        try {
          const includePrefs = content.querySelector('#backup-prefs')?.checked ?? true;
          const autoBackupEnabled = content.querySelector('#auto-backup-enabled')?.checked ?? false;
          const autoBackupInterval = parseInt(content.querySelector('#auto-backup-interval')?.value ?? '24');

          const newSettings = {
            includePrefs: includePrefs,
            includeScraped: false, // Always false - scraped data removed
            autoBackup: {
              enabled: autoBackupEnabled,
              interval: autoBackupInterval,
              lastBackup: backupSettings.autoBackup.lastBackup // Preserve
            }
          };

          await saveBackupSettings(newSettings);
          win.close();
          showTooltip('Configuración de copias guardada');
        } catch (e) {
          console.error('[CRG] Error saving backup settings:', e);
          showTooltip('Error al guardar configuración', true);
        }
      };

      content.querySelector('#backup-cancel').onclick = () => win.close();
    }

    // Run only in the top-level frame (not in iframes)
    if (window.top === window.self) {
      // Add backup menu - the comprehensive backup system replaces all old import/export menus
      GM_registerMenuCommand('💾 Copias de Seguridad', showBackupPanel);
    }

    // Add dynamic CSS for permanent tag styles
    document.head.insertAdjacentHTML('beforeend', `
<style id="crg-tagbadge-dynamic">
.tag-badge {
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 3px;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>`);

    // Functions are now defined above the marker, no need to expose globally



    // Apply saved styles on script load
    updateGlobalTagStyles();
    // Re-apply colors to all existing tags (fixes persistence after save)
    updateAllTagColors();

    // Mutation observer
    const observer = new MutationObserver((mutations) => {
      const addedLinks = new Set();
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            node.querySelectorAll('a[href^="http://lamansion-crg.net/forum/index.php?"][href*="showtopic="], a[href^="http://lamansion-crg.net/forum/index.php?"][href*="act=ST"]')
              .forEach(l => addedLinks.add(l));
          }
        });
      });
      if (addedLinks.size > 0) setTimeout(() => processLinks(addedLinks), 0);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.CRG_MutationObserver = observer;
    window.addCRGMarkerToLink = addMarkerToLink;
  })();

})();
