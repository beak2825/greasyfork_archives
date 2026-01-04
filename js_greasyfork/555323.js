// ==UserScript==
// @name         E-Hentai Unified Favorites & H@H Toolkit
// @namespace    https://www.e-hentai.org/
// @version      2.0.0
// @description  One script for gallery listings, uploader pages, and gallery detail pages with bulk favorite + H@H download helpers.
// @author       bbb
// @match        https://exhentai.org/
// @match        https://e-hentai.org/
// @match        https://exhentai.org/?*
// @match        https://exhentai.org/tag*
// @match        https://e-hentai.org/?*
// @match        https://e-hentai.org/tag*
// @match        https://exhentai.org/uploader*
// @match        https://e-hentai.org/uploader*
// @match        https://exhentai.org/favorites.php*
// @match        https://e-hentai.org/favorites.php*
// @match        https://exhentai.org/g/*
// @match        https://e-hentai.org/g/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      exhentai.org
// @connect      e-hentai.org
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555323/E-Hentai%20Unified%20Favorites%20%20H%40H%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/555323/E-Hentai%20Unified%20Favorites%20%20H%40H%20Toolkit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG_STORAGE_KEYS = ['hath_unified_config', 'hath_gallery_config', 'hath_config'];

  // *** 在这里自定义你的收藏分类名称 (0-9) ***
  const DEFAULT_FAVCATS = [
      'Normal', // 0
      'NTR',      // 1
      'Incest',          // 2
      'MILF',        // 3
      'Long story',            // 4
      'COS',            // 5
      'Best',            // 6
      '.',            // 7
      'AI Generated',            // 8
      'Lolicon'             // 9
  ];

  let favcats = [...DEFAULT_FAVCATS];

  // *** H@H Download Configuration ***
  const DEFAULT_CONFIG = {
      enabled: true,
      method: 'real',
      xeHentaiUrl: 'http://localhost:8080',
      xeHentaiApiKey: '',
      customDownloadUrl: '',
      quality: 'original',
      retryAttempts: 3,
      retryDelay: 1000,
      showDownloadStatus: true,
      batchDelay: 2000,
      maxConcurrent: 3,
      oneClickMode: true,
      showCategoryNames: true,
      showPanelByDefault: true,
      showFloatingButton: true,
      enablePaginationShortcuts: true,
      immersiveMode: false,
      immersiveShowTitle: true,
      immersiveShowCategory: true,
      immersiveShowRating: true,
      immersiveShowDate: true,
      immersiveShowPages: true,
      immersiveThumbScale: 100,
      immersiveRemoveBorder: true,
      favcats: [...DEFAULT_FAVCATS]
  };

  const HATH_CONFIG = { ...DEFAULT_CONFIG, favcats: [...DEFAULT_FAVCATS] };

  // Global state
  let paginationShortcutHandler = null;
  let isProcessing = false;
  let currentBatch = [];
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  const immersiveState = {
      toppanePlaceholder: null,
      toppaneParent: null,
      hiddenSearchNav: null,
      trackedElements: new Set(),
      wallContainer: null,
      originalOrder: [],
      resizeHandler: null,
      currentColumnWidth: 220,
      currentGap: 12
  };
  let immersiveLayoutScheduled = false;

  // Load saved configuration (handles legacy keys as well)
  loadPersistedConfig();

  init();

  function loadPersistedConfig() {
      for (const key of CONFIG_STORAGE_KEYS) {
          try {
              const stored = GM_getValue(key, null);
              if (stored && typeof stored === 'object') {
                  Object.assign(HATH_CONFIG, stored);
              }
          } catch (error) {
              console.warn(`E-Hentai Unified: Failed to read config from ${key}`, error);
          }
      }
      favcats = normalizeFavcats(HATH_CONFIG.favcats);
      HATH_CONFIG.favcats = [...favcats];
      HATH_CONFIG.immersiveThumbScale = clampThumbScale(HATH_CONFIG.immersiveThumbScale);
  }

  function normalizeFavcats(values) {
      const sanitized = [...DEFAULT_FAVCATS];
      if (Array.isArray(values)) {
          for (let i = 0; i < sanitized.length; i++) {
              const name = typeof values[i] === 'string' ? values[i].trim() : '';
              if (name) {
                  sanitized[i] = name;
              }
          }
      }
      return sanitized;
  }

  function getFavcatName(index) {
      const value = typeof favcats[index] === 'string' ? favcats[index].trim() : '';
      if (value) {
          return value;
      }
      const fallback = typeof DEFAULT_FAVCATS[index] === 'string' ? DEFAULT_FAVCATS[index] : '';
      return fallback || `Category ${index}`;
  }

  function getGalleryButtonLabel(index) {
      if (!HATH_CONFIG.showCategoryNames) {
          return String(index);
      }
      const name = getFavcatName(index);
      return name.length > 4 ? name.slice(0, 4) : name;
  }

  function escapeHtml(value) {
      return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\"/g, '&quot;')
          .replace(/'/g, '&#39;');
  }

  function refreshFavoriteLabels() {
      document.querySelectorAll('.gallery-controls button[data-favcat]').forEach(btn => {
          const index = parseInt(btn.dataset.favcat, 10);
          if (!Number.isInteger(index)) {
              return;
          }
          const name = getFavcatName(index);
          const label = getGalleryButtonLabel(index);
          btn.dataset.originalLabel = label;
          btn.textContent = label;
          btn.title = `Add to ${name}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
          btn.style.minWidth = HATH_CONFIG.showCategoryNames ? '24px' : '16px';
      });

      const bulkFavcatSelect = document.getElementById('bulk-favcat');
      if (bulkFavcatSelect) {
          Array.from(bulkFavcatSelect.options).forEach(option => {
              const index = parseInt(option.value, 10);
              if (Number.isInteger(index)) {
                  option.textContent = getFavcatName(index);
              }
          });
      }

      document.querySelectorAll('.hath-detail-button').forEach(btn => {
          const index = parseInt(btn.dataset.favcat, 10);
          if (!Number.isInteger(index)) {
              return;
          }
          const name = getFavcatName(index);
          const label = HATH_CONFIG.showCategoryNames ? name : String(index);
          btn.dataset.originalText = label;
          btn.dataset.originalLabel = label;
          btn.textContent = label;
          btn.title = `收藏到 ${name}`;
      });
  }

  function init() {
      setupPaginationShortcuts();
      updateImmersiveMode();

      if (isGalleryDetailPage()) {
          initGalleryDetailPage();
          return;
      }

      bootstrapListingEnhancements();
  }

  function setupPaginationShortcuts() {
      teardownPaginationShortcuts();

      if (!HATH_CONFIG.enablePaginationShortcuts) {
          return;
      }

      paginationShortcutHandler = (event) => {
          if (!HATH_CONFIG.enablePaginationShortcuts) {
              return;
          }

          if (event.defaultPrevented || event.repeat) {
              return;
          }

          const target = event.target;
          if (isEditableTarget(target)) {
              return;
          }

          const hasModifiers = event.altKey || event.ctrlKey || event.metaKey;
          if (hasModifiers) {
              return;
          }

          const key = event.key;
          let direction = null;

          if (key === 'ArrowRight' || key === 'Right') {
              direction = 'next';
          } else if (key === 'ArrowLeft' || key === 'Left') {
              direction = 'prev';
          }

          if (!direction) {
              return;
          }

          const link = findPaginationLink(direction);
          if (!link) {
              return;
          }

          event.preventDefault();
          const href = link.href;
          if (href) {
              window.location.href = href;
          } else if (typeof link.click === 'function') {
              link.click();
          }
      };

      document.addEventListener('keydown', paginationShortcutHandler, true);
  }

  function teardownPaginationShortcuts() {
      if (paginationShortcutHandler) {
          document.removeEventListener('keydown', paginationShortcutHandler, true);
          paginationShortcutHandler = null;
      }
  }

  function isEditableTarget(target) {
      if (!target) {
          return false;
      }
      const tagName = target.tagName;
      if (!tagName) {
          return false;
      }
      const upperTag = tagName.toUpperCase();
      if (upperTag === 'INPUT' || upperTag === 'TEXTAREA' || upperTag === 'SELECT') {
          return true;
      }
      return Boolean(target.isContentEditable);
  }

  function findPaginationLink(direction) {
      const navTables = document.querySelectorAll('table.ptt, table.ptb');
      for (const table of navTables) {
          const linkInTable = findPaginationLinkInTable(table, direction);
          if (linkInTable) {
              return linkInTable;
          }
      }

      const fallbackSelectors = direction === 'next'
          ? ['#unext a[href]', '#unextlink', 'a[rel="next"]', '#dnext']
          : ['#uprev a[href]', '#uprevlink', 'a[rel="prev"]', '#dprev'];

      for (const selector of fallbackSelectors) {
          const element = document.querySelector(selector);
          if (!element) {
              continue;
          }
          if (element.tagName && element.tagName.toUpperCase() === 'A') {
              return element;
          }
          const childLink = element.querySelector('a[href]');
          if (childLink) {
              return childLink;
          }
      }

      return findPaginationLinkByText(direction);
  }

  function findPaginationLinkInTable(table, direction) {
      if (!table) {
          return null;
      }

      const currentCell = table.querySelector('td.ptds, td[class*="ptd"]');
      const anchors = Array.from(table.querySelectorAll('a[href]'));
      const currentIndex = getCurrentPageIndexFromCell(currentCell);

      if (Number.isInteger(currentIndex)) {
          const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
          if (targetIndex >= 0) {
              const indexMatch = findAnchorByPageIndex(anchors, targetIndex);
              if (indexMatch) {
                  return indexMatch;
              }
          }
      }

      if (currentCell) {
          let sibling = currentCell;
          const prop = direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';
          while (sibling) {
              sibling = sibling[prop];
              if (!sibling) {
                  break;
              }
              const link = sibling.querySelector('a[href]');
              if (link) {
                  return link;
              }
          }
      }

      if (direction === 'next') {
          for (const anchor of anchors) {
              if (isNextPaginationAnchor(anchor)) {
                  return anchor;
              }
          }
      } else {
          for (let i = anchors.length - 1; i >= 0; i--) {
              const anchor = anchors[i];
              if (isPrevPaginationAnchor(anchor)) {
                  return anchor;
              }
          }
      }

      return null;
  }

  function findPaginationLinkByText(direction) {
      const containerSelectors = [
          'table.ptt',
          'table.ptb',
          '.searchnav',
          '.pagenav',
          '.pagination',
          '.pager',
          '.gtb',
          '#unext',
          '#uprev'
      ];

      let anchors = [];
      for (const selector of containerSelectors) {
          const container = document.querySelector(selector);
          if (container) {
              anchors = anchors.concat(Array.from(container.querySelectorAll('a[href]')));
          }
      }

      if (anchors.length === 0) {
          anchors = Array.from(document.querySelectorAll('a[href]'));
      }

      const nextTexts = ['>', '>>', '›', '»', 'Next', 'NEXT', '下一页', '下一頁', '下页'];
      const prevTexts = ['<', '<<', '‹', '«', 'Prev', 'PREV', 'Previous', '上一页', '上一頁', '上页'];

      for (const anchor of anchors) {
          const rawText = (anchor.textContent || '').trim();
          if (!rawText) {
              continue;
          }
          const text = rawText.replace(/\s+/g, ' ');
          if (direction === 'next') {
              if (nextTexts.includes(text)) {
                  return anchor;
              }
              if (/^next/i.test(text) || /next/i.test(text) || /^下一[页頁]/.test(text) || text.endsWith('›') || text.endsWith('»') || text.endsWith('>')) {
                  return anchor;
              }
          } else {
              if (prevTexts.includes(text)) {
                  return anchor;
              }
              if (/^prev/i.test(text) || /prev/i.test(text) || /^上一[页頁]/.test(text) || text.startsWith('‹') || text.startsWith('«') || text.startsWith('<')) {
                  return anchor;
              }
          }
      }

      return null;
  }

  function updateImmersiveMode() {
      if (HATH_CONFIG.immersiveMode) {
          enableImmersiveMode();
      } else {
          disableImmersiveMode();
      }
      applyImmersiveGalleryVisibility();
      applyImmersiveThumbnailSizing();
  }

  function enableImmersiveMode() {
      if (typeof document === 'undefined') {
          return;
      }
      const toppane = document.getElementById('toppane');
      if (toppane && toppane.parentElement) {
          if (!immersiveState.toppanePlaceholder || !immersiveState.toppanePlaceholder.isConnected) {
              const placeholder = document.createElement('div');
              placeholder.id = 'hath-immersive-toppane-placeholder';
              placeholder.style.display = 'none';
              toppane.parentElement.insertBefore(placeholder, toppane);
              immersiveState.toppanePlaceholder = placeholder;
              immersiveState.toppaneParent = toppane.parentElement;
          }
          immersiveState.toppaneParent.appendChild(toppane);
      }

      const searchNav = findTopSearchNav();
      if (searchNav) {
          immersiveState.hiddenSearchNav = searchNav;
          setImmersiveDisplay(searchNav, false);
      }

      if (document.body) {
          document.body.classList.add('hath-immersive-mode');
      }

      ensureImmersiveWall();
      scheduleImmersiveLayout();
  }

  function disableImmersiveMode() {
      if (typeof document === 'undefined') {
          return;
      }

      teardownImmersiveWall();

      const toppane = document.getElementById('toppane');
      if (immersiveState.toppanePlaceholder && immersiveState.toppanePlaceholder.parentElement && toppane) {
          immersiveState.toppanePlaceholder.parentElement.insertBefore(toppane, immersiveState.toppanePlaceholder);
      }
      if (immersiveState.toppanePlaceholder) {
          immersiveState.toppanePlaceholder.remove();
          immersiveState.toppanePlaceholder = null;
          immersiveState.toppaneParent = null;
      }

      if (immersiveState.hiddenSearchNav && immersiveState.hiddenSearchNav.isConnected) {
          setImmersiveDisplay(immersiveState.hiddenSearchNav, true);
      }
      immersiveState.hiddenSearchNav = null;

      if (document.body) {
          document.body.classList.remove('hath-immersive-mode');
          document.body.style.removeProperty('--hath-immersive-column-width');
          document.body.style.removeProperty('--hath-immersive-column-gap');
      }

      immersiveState.currentColumnWidth = 220;
      immersiveState.currentGap = 12;

      // Restore any tracked elements to their defaults
      immersiveState.trackedElements.forEach((element) => {
          if (!element) return;
          restoreImmersiveDisplay(element);
      });
      immersiveState.trackedElements.clear();
  }

  function findTopSearchNav() {
      const navs = document.querySelectorAll('.searchnav');
      if (navs.length === 0) {
          return null;
      }
      return navs[0];
  }

  function applyImmersiveGalleryVisibility() {
      const on = !!HATH_CONFIG.immersiveMode;
      const showTitle = !on || HATH_CONFIG.immersiveShowTitle;
      const showCategory = !on || HATH_CONFIG.immersiveShowCategory;
      const showRating = !on || HATH_CONFIG.immersiveShowRating;
      const showDate = !on || HATH_CONFIG.immersiveShowDate;
      const showPages = !on || HATH_CONFIG.immersiveShowPages;
      const showMetadataContainer = !on || showCategory || showRating || showDate || showPages;

      updateElementsVisibility('.gl1t .gl4t', showTitle);
      updateElementsVisibility('.gl1t .gl5t .cs', showCategory);
      updateElementsVisibility('.gl1t .gl5t .ir', showRating);
      updateElementsVisibility('.gl1t .gl5t [id^="posted_"]', showDate);
      updatePageCountsVisibility(showPages);
      updateElementsVisibility('.gl1t .gl5t', showMetadataContainer);
      updateElementsPadding('.gl1t', on ? 0 : null);
      if (on) {
          ensureImmersiveWall();
          scheduleImmersiveLayout();
      } else {
          teardownImmersiveWall();
      }
  }

  function updateElementsVisibility(selector, shouldShow) {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
          return;
      }
      elements.forEach((element) => {
      setImmersiveDisplay(element, shouldShow);
    });
  }

  function updateElementsPadding(selector, paddingValue) {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
          return;
      }
      elements.forEach((element) => {
          if (!element) return;
          if (!element.dataset) return;
          if (!('immersiveOriginalPaddingBottom' in element.dataset)) {
              const original = element.style.paddingBottom || '';
              element.dataset.immersiveOriginalPaddingBottom = original ? original : '__default__';
          }
          if (paddingValue === null) {
              const original = element.dataset.immersiveOriginalPaddingBottom === '__default__' ? '' : element.dataset.immersiveOriginalPaddingBottom;
              element.style.paddingBottom = original;
          } else {
              element.style.paddingBottom = `${paddingValue}px`;
          }
      });
  }

  function updatePageCountsVisibility(shouldShow) {
      const elements = document.querySelectorAll('.gl1t .gl5t div');
      if (elements.length === 0) {
          return;
      }
      elements.forEach((element) => {
          if (!element) return;
          if (!element.dataset) return;
          if (!element.dataset.immersivePageChecked) {
              const text = (element.textContent || '').trim();
              if (/\d+\s+pages?/i.test(text)) {
                  element.dataset.immersivePages = 'true';
              }
              element.dataset.immersivePageChecked = 'true';
          }
          if (element.dataset.immersivePages === 'true') {
              setImmersiveDisplay(element, shouldShow);
          }
      });
  }

  function applyImmersiveThumbnailSizing() {
      if (typeof document === 'undefined') {
          return;
      }

      if (!HATH_CONFIG.immersiveMode) {
          document.body.style.removeProperty('--hath-immersive-column-width');
          document.body.style.removeProperty('--hath-immersive-column-gap');
          immersiveState.currentColumnWidth = 220;
          immersiveState.currentGap = 12;
          teardownImmersiveWall();
          return;
      }

      const sanitizedScale = clampThumbScale(HATH_CONFIG.immersiveThumbScale);
      if (sanitizedScale !== HATH_CONFIG.immersiveThumbScale) {
          HATH_CONFIG.immersiveThumbScale = sanitizedScale;
      }

      const baseWidth = 260;
      const columnWidth = Math.max(120, Math.round(baseWidth * sanitizedScale / 100));
      const gap = Math.max(6, Math.round(columnWidth * 0.08));

      immersiveState.currentColumnWidth = columnWidth;
      immersiveState.currentGap = gap;

      document.body.style.setProperty('--hath-immersive-column-width', `${columnWidth}px`);
      document.body.style.setProperty('--hath-immersive-column-gap', `${gap}px`);

      ensureImmersiveWall();
      scheduleImmersiveLayout();
  }

  function adjustImmersiveThumbnail(item, immersiveOn) {
      if (!item) {
          return;
      }
      const thumb = item.querySelector('.gl3t');
      const image = thumb ? thumb.querySelector('img') : null;
  const meta = item.querySelector('.gl5t');
  const torrentLink = item.querySelector('.gldown');
      if (immersiveOn) {
          setImmersiveStyleValue(item, 'minWidth', '0');
          setImmersiveStyleValue(item, 'maxWidth', 'none');
          setImmersiveStyleValue(item, 'margin', '0');
          setImmersiveStyleValue(item, 'padding', '0');
          setImmersiveStyleValue(item, 'borderRight', 'none');
          setImmersiveStyleValue(item, 'borderBottom', 'none');
          setImmersiveStyleValue(item, 'background', 'transparent');
          if (thumb) {
              setImmersiveStyleValue(thumb, 'width', '100%');
              setImmersiveStyleValue(thumb, 'height', 'auto');
              setImmersiveStyleValue(thumb, 'margin', '0');
              setImmersiveStyleValue(thumb, 'padding', '0');
              if (HATH_CONFIG.immersiveRemoveBorder) {
                  setImmersiveStyleValue(thumb, 'border', 'none');
              }
          }
          if (image) {
              setImmersiveStyleValue(image, 'width', '100%');
              setImmersiveStyleValue(image, 'height', 'auto');
              setImmersiveStyleValue(image, 'top', '0');
              setImmersiveStyleValue(image, 'paddingBottom', '0');
          }
          if (torrentLink) {
              setImmersiveDisplay(torrentLink, false);
          }
          if (meta) {
              setImmersiveStyleValue(meta, 'marginTop', '4px');
          }
  } else {
      restoreImmersiveStyleValue(item, 'minWidth');
      restoreImmersiveStyleValue(item, 'maxWidth');
          if (thumb) {
              restoreImmersiveStyleValue(thumb, 'width');
              restoreImmersiveStyleValue(thumb, 'height');
              restoreImmersiveStyleValue(thumb, 'margin');
              restoreImmersiveStyleValue(thumb, 'padding');
              if (!HATH_CONFIG.immersiveRemoveBorder) {
                  restoreImmersiveStyleValue(thumb, 'border');
              } else {
                  setImmersiveStyleValue(thumb, 'border', 'none');
              }
          }
          if (image) {
              restoreImmersiveStyleValue(image, 'width');
              restoreImmersiveStyleValue(image, 'height');
              restoreImmersiveStyleValue(image, 'top');
              restoreImmersiveStyleValue(image, 'paddingBottom');
          }
          restoreImmersiveStyleValue(item, 'margin');
          restoreImmersiveStyleValue(item, 'padding');
          restoreImmersiveStyleValue(item, 'borderRight');
          restoreImmersiveStyleValue(item, 'borderBottom');
          restoreImmersiveStyleValue(item, 'background');
          if (torrentLink) {
              restoreImmersiveDisplay(torrentLink);
          }
          if (meta) {
              restoreImmersiveStyleValue(meta, 'marginTop');
          }
      }
  }

  function ensureImmersiveWall() {
      if (!HATH_CONFIG.immersiveMode) {
          return;
      }
      const listContainer = document.querySelector('.gld');
      const wall = immersiveState.wallContainer;
      let items = [];
      if (listContainer) {
          items = Array.from(listContainer.querySelectorAll('.gl1t'));
      }
      if (items.length === 0 && wall) {
          items = Array.from(wall.querySelectorAll('.gl1t'));
      }
      if (items.length === 0) {
          return;
      }

      if (!immersiveState.wallContainer || !immersiveState.wallContainer.isConnected) {
          const wallContainer = immersiveState.wallContainer || document.createElement('div');
          wallContainer.id = 'hath-immersive-wall';
          wallContainer.style.position = 'relative';
          wallContainer.style.width = '100%';
          wallContainer.style.minHeight = '200px';
          if (listContainer && listContainer.parentElement) {
              listContainer.parentElement.insertBefore(wallContainer, listContainer.nextSibling);
          }
          immersiveState.wallContainer = wallContainer;
      }

      items.forEach(element => {
          if (!element.dataset.hathImmersiveOrigin) {
              immersiveState.originalOrder.push({
                  element,
                  parent: element.parentElement,
                  nextSibling: element.nextSibling
             });
             element.dataset.hathImmersiveOrigin = '1';
         }
         if (immersiveState.wallContainer && element.parentElement !== immersiveState.wallContainer) {
             immersiveState.wallContainer.appendChild(element);
         }
         adjustImmersiveThumbnail(element, true);
      });

      if (listContainer) {
          listContainer.style.display = 'none';
      }

      if (!immersiveState.resizeHandler) {
          immersiveState.resizeHandler = () => scheduleImmersiveLayout();
          window.addEventListener('resize', immersiveState.resizeHandler);
      }

      attachImmersiveImageHooks();
      scheduleImmersiveLayout();
      setTimeout(scheduleImmersiveLayout, 60);
  }

  function attachImmersiveImageHooks() {
      const wall = immersiveState.wallContainer;
      if (!wall) {
          return;
      }
      wall.querySelectorAll('img').forEach(img => {
          img.removeEventListener('load', scheduleImmersiveLayout);
          img.addEventListener('load', scheduleImmersiveLayout);
          if (img.complete) {
              scheduleImmersiveLayout();
          }
      });
  }

  function scheduleImmersiveLayout() {
      if (immersiveLayoutScheduled) {
          return;
      }
      immersiveLayoutScheduled = true;
      requestAnimationFrame(() => {
          layoutImmersiveWall();
          immersiveLayoutScheduled = false;
      });
  }

  function layoutImmersiveWall() {
      const wall = immersiveState.wallContainer;
      if (!wall || !HATH_CONFIG.immersiveMode) {
          return;
      }

      const items = Array.from(wall.children);
      if (items.length === 0) {
          wall.style.height = '0px';
          return;
      }

      const columnWidth = immersiveState.currentColumnWidth || 220;
      const gap = immersiveState.currentGap || 12;
      const containerWidth = wall.clientWidth || wall.offsetWidth || window.innerWidth;
      const columns = Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)));
      const columnHeights = new Array(columns).fill(0);
      const totalWidth = columns * columnWidth + (columns - 1) * gap;
      const offsetX = Math.max(0, (containerWidth - totalWidth) / 2);

      items.forEach(item => {
          item.style.position = 'absolute';
          item.style.width = `${columnWidth}px`;
          const rect = item.getBoundingClientRect();
          const height = Math.ceil(rect.height);
          let targetColumn = 0;
          let minHeight = columnHeights[0];
          for (let i = 1; i < columns; i++) {
              if (columnHeights[i] < minHeight) {
                  minHeight = columnHeights[i];
                  targetColumn = i;
              }
          }
          const left = offsetX + targetColumn * (columnWidth + gap);
          item.style.left = `${left}px`;
          item.style.top = `${minHeight}px`;
          columnHeights[targetColumn] = minHeight + height + gap;
      });

      const wallHeight = Math.max(...columnHeights) - gap;
      wall.style.height = `${Math.max(0, wallHeight)}px`;
  }

  function teardownImmersiveWall() {
      const wall = immersiveState.wallContainer;
      if (!wall) {
          return;
      }

      if (immersiveState.resizeHandler) {
          window.removeEventListener('resize', immersiveState.resizeHandler);
          immersiveState.resizeHandler = null;
      }

      immersiveState.originalOrder.forEach(record => {
          const { element, parent, nextSibling } = record;
          if (!element || !parent) {
              return;
          }
          adjustImmersiveThumbnail(element, false);
          element.style.position = '';
          element.style.left = '';
          element.style.top = '';
          element.style.width = '';
          delete element.dataset.hathImmersiveOrigin;
          if (nextSibling && nextSibling.parentNode === parent) {
              parent.insertBefore(element, nextSibling);
          } else {
              parent.appendChild(element);
          }
      });

      immersiveState.originalOrder = [];

      if (wall.parentElement) {
          wall.parentElement.removeChild(wall);
      }
      immersiveState.wallContainer = null;
      immersiveLayoutScheduled = false;

      const listContainer = document.querySelector('.gld');
      if (listContainer) {
          listContainer.style.display = '';
      }
  }

  function clampThumbScale(value) {
      const numeric = parseInt(value, 10);
      if (!Number.isFinite(numeric)) {
          return 100;
      }
      return Math.min(250, Math.max(40, numeric));
  }

  function setImmersiveDisplay(element, shouldShow) {
      if (!element) {
          return;
      }
      if (!element.dataset) {
          return;
      }
      if (!immersiveState.trackedElements.has(element)) {
          immersiveState.trackedElements.add(element);
      }
      if (!('immersiveOriginalDisplay' in element.dataset)) {
          const currentDisplay = element.style && element.style.display ? element.style.display : '';
          element.dataset.immersiveOriginalDisplay = currentDisplay ? currentDisplay : '__default__';
      }
      const original = element.dataset.immersiveOriginalDisplay === '__default__' ? '' : element.dataset.immersiveOriginalDisplay;
      element.style.display = shouldShow ? original : 'none';
  }

  function restoreImmersiveDisplay(element) {
      if (!element || !element.dataset) {
          return;
      }
      if ('immersiveOriginalDisplay' in element.dataset) {
          const original = element.dataset.immersiveOriginalDisplay === '__default__' ? '' : element.dataset.immersiveOriginalDisplay;
          element.style.display = original;
      } else {
          element.style.display = '';
      }
  }

  function setImmersiveStyleValue(element, property, value) {
      if (!element || !element.dataset) {
          return;
      }
      const key = `immersiveOriginalStyle${property}`;
      if (!(key in element.dataset)) {
          const current = element.style && typeof element.style[property] === 'string' ? element.style[property] : '';
          element.dataset[key] = current ? current : '__unset__';
      }
      element.style[property] = value;
  }

  function restoreImmersiveStyleValue(element, property) {
      if (!element || !element.dataset) {
          return;
      }
      const key = `immersiveOriginalStyle${property}`;
      if (!(key in element.dataset)) {
          element.style[property] = '';
          return;
      }
      const original = element.dataset[key] === '__unset__' ? '' : element.dataset[key];
      element.style[property] = original;
  }

  function getCurrentPageIndexFromCell(cell) {
      if (!cell) {
          return null;
      }
      const text = (cell.textContent || '').trim();
      const numeric = parseInt(text, 10);
      if (Number.isFinite(numeric)) {
          return numeric - 1;
      }
      return null;
  }

  function findAnchorByPageIndex(anchors, index) {
      if (!Array.isArray(anchors)) {
          return null;
      }
      for (const anchor of anchors) {
          const anchorIndex = getPageIndexFromAnchor(anchor);
          if (anchorIndex === index) {
              return anchor;
          }
      }
      return null;
  }

  function getPageIndexFromAnchor(anchor) {
      if (!anchor || !anchor.href) {
          return null;
      }
      try {
          const url = new URL(anchor.href, window.location.href);
          const value = url.searchParams.get('page');
          if (value === null) {
              return null;
          }
          const numeric = parseInt(value, 10);
          if (Number.isFinite(numeric)) {
              return numeric;
          }
      } catch (error) {
          return null;
      }
      return null;
  }

  function isNextPaginationAnchor(anchor) {
      if (!anchor) {
          return false;
      }
      const text = (anchor.textContent || '').trim();
      if (!text) {
          return false;
      }
      const normalized = text.replace(/\s+/g, ' ');
      const lower = normalized.toLowerCase();
      if (normalized === '>' || normalized === '>>' || normalized === 'next >' || normalized === 'next >>') {
          return true;
      }
      if (lower === 'next' || lower === 'next page' || lower === '下一页' || lower === '下一頁' || lower === '下页') {
          return true;
      }
      if (normalized.endsWith('›') || normalized.endsWith('»') || normalized.endsWith('>')) {
          return true;
      }
      if (/\bnext\b/i.test(normalized)) {
          return true;
      }
      return false;
  }

  function isPrevPaginationAnchor(anchor) {
      if (!anchor) {
          return false;
      }
      const text = (anchor.textContent || '').trim();
      if (!text) {
          return false;
      }
      const normalized = text.replace(/\s+/g, ' ');
      const lower = normalized.toLowerCase();
      if (normalized === '<' || normalized === '<<' || normalized === '< prev' || normalized === '<< prev') {
          return true;
      }
      if (lower === 'prev' || lower === 'previous' || lower === '上一页' || lower === '上一頁' || lower === '上页') {
          return true;
      }
      if (normalized.startsWith('‹') || normalized.startsWith('«') || normalized.startsWith('<')) {
          return true;
      }
      if (/\bprev\b/i.test(normalized) || /\bprevious\b/i.test(normalized)) {
          return true;
      }
      return false;
  }

  function isGalleryDetailPage() {
      return /^\/g\/\d+\/[0-9a-f]{10,}/i.test(window.location.pathname);
  }

  function bootstrapListingEnhancements() {
      let attempts = 0;
      const maxAttempts = 100;
      const pollInterval = 200;

      const intervalId = setInterval(() => {
          attempts++;

          const galleryContainer = document.querySelector('#gdt') ||
                                   document.querySelector('.gallery') ||
                                   document.querySelector('#content') ||
                                   document.querySelector('.container');

          const galleryItems = document.querySelectorAll('.gdtm, .gdtl, .gl1t, .gl2t, .gl3t, .gl4t, .gl5t, .gl1c, .gl2c, .gl3c, .gl4c, .gl5c, .gl1e, .gl2e, .gl3e, .gl4e, .gl5e, .gl1m, .gl2m, .gl3m, .gl4m, .gl5m');

          const galleryLinks = document.querySelectorAll('a[href*="/g/"]');

          console.log(`E-Hentai Unified: Attempt ${attempts}, container: ${!!galleryContainer}, items: ${galleryItems.length}, links: ${galleryLinks.length}`);

          if (galleryContainer || galleryItems.length > 0 || galleryLinks.length > 0) {
              clearInterval(intervalId);
              initializeListingFeatures();
          } else if (attempts > maxAttempts) {
              clearInterval(intervalId);
              console.log('E-Hentai Unified: Max attempts reached, giving up on listing enhancements');
          }
      }, pollInterval);
  }

  function initGalleryDetailPage() {
      if (document.getElementById('hath-quick-fav-row')) {
          return;
      }

      let attempts = 0;
      const maxAttempts = 50;
      const pollInterval = 200;

      const intervalId = setInterval(() => {
          attempts++;
          const taglistDiv = document.querySelector('#taglist');
          const favoriteLink = document.querySelector('#favoritelink');

          if (taglistDiv && favoriteLink) {
              clearInterval(intervalId);
              enhanceDetailQuickFavorites(taglistDiv);
          } else if (attempts > maxAttempts) {
              clearInterval(intervalId);
              console.log('E-Hentai Unified: Failed to locate gallery detail elements');
          }
      }, pollInterval);
  }

  function enhanceDetailQuickFavorites(taglistDiv) {
      if (document.getElementById('hath-quick-fav-row')) {
          return;
      }

      const match = window.location.pathname.match(/\/g\/(\d+)\/([0-9a-f]{10,})/i);
      if (!match) {
          console.warn('E-Hentai Unified: Unable to parse gallery id/token for detail page');
          return;
      }

      const gid = match[1];
      const token = match[2];
      const tableBody = taglistDiv.querySelector('table > tbody');

      const row = document.createElement('tr');
      row.id = 'hath-quick-fav-row';

      const labelCell = document.createElement('td');
      labelCell.className = 'tc';
      labelCell.textContent = '快速收藏:';

      const buttonCell = document.createElement('td');
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'hath-detail-fav-container';
      buttonContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; align-items: center;';

      favcats.forEach((_, index) => {
          const button = createDetailFavoriteButton(gid, token, index, buttonContainer);
          buttonContainer.appendChild(button);
      });

      const configButton = document.createElement('button');
      configButton.type = 'button';
      configButton.textContent = 'H@H设置';
      configButton.style.cssText = 'margin-left: 10px; padding: 2px 8px; font-size: 12px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;';
      configButton.addEventListener('click', (event) => {
          event.preventDefault();
          showHathConfigPanel();
      });

      buttonCell.appendChild(buttonContainer);
      buttonCell.appendChild(configButton);
      row.appendChild(labelCell);
      row.appendChild(buttonCell);

      if (tableBody) {
          tableBody.appendChild(row);
      } else {
          const wrapperTable = document.createElement('table');
          wrapperTable.appendChild(row);
          taglistDiv.appendChild(wrapperTable);
      }
  }

  function createDetailFavoriteButton(gid, token, favcatId, container) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'hath-detail-button';

      const name = getFavcatName(favcatId);
      const label = HATH_CONFIG.showCategoryNames ? name : String(favcatId);
      button.textContent = label;
      button.dataset.originalText = label;
      button.dataset.originalLabel = label;
      button.dataset.originalBackground = '#f5f5f5';
      button.dataset.originalColor = '#333333';
      button.dataset.favcat = String(favcatId);
      button.title = `收藏到 ${name}`;

      button.style.cssText = 'padding: 2px 8px; font-size: 12px; border: 1px solid #d0d0d0; background: #f5f5f5; color: #333333; border-radius: 3px; cursor: pointer; transition: all 0.2s ease;';
      button.addEventListener('mouseenter', () => {
          if (button.disabled) return;
          button.style.background = '#e8e8e8';
      });
      button.addEventListener('mouseleave', () => {
          if (button.disabled) return;
          button.style.background = button.dataset.originalBackground;
      });

      button.addEventListener('click', (event) => {
          event.preventDefault();
          handleDetailFavoriteClick(button, gid, token, favcatId, container);
      });

      return button;
  }

  function handleDetailFavoriteClick(button, gid, token, favcatId, container) {
      if (button.disabled) {
          return;
      }

      const buttons = Array.from(container.querySelectorAll('.hath-detail-button'));
      const originalText = button.dataset.originalText || button.textContent;
      const originalBackground = button.dataset.originalBackground || button.style.background || '';
      const originalColor = button.dataset.originalColor || button.style.color || '';
      const originalTitle = button.title;
      const categoryName = getFavcatName(favcatId);

      buttons.forEach(btn => {
          btn.disabled = true;
          btn.style.opacity = '0.7';
      });

      button.textContent = '...';
      button.style.background = '#2196F3';
      button.style.color = '#ffffff';
      button.title = `正在收藏到 ${categoryName}`;

      const restoreState = (delay = 2000) => {
          setTimeout(() => {
              buttons.forEach(btn => {
                  btn.disabled = false;
                  btn.style.opacity = '';
              });
              button.textContent = originalText;
              button.style.background = originalBackground;
              button.style.color = originalColor;
              button.title = originalTitle;
          }, delay);
      };

      addToFavorites(gid, token, favcatId,
          () => {
              button.textContent = '✓';
              button.style.background = '#4CAF50';
              button.style.color = '#ffffff';
              button.title = `已收藏到 ${categoryName}`;

              const shouldDownload = HATH_CONFIG.enabled && HATH_CONFIG.oneClickMode;
              if (shouldDownload) {
                  sendHathDownloadRequest(gid, token, window.location.hostname,
                      () => {
                          if (HATH_CONFIG.showDownloadStatus) {
                              button.textContent = '✓✓';
                          }
                          button.title = `收藏+下载完成:${categoryName}`;
                          restoreState();
                      },
                      (error) => {
                          if (HATH_CONFIG.showDownloadStatus) {
                              button.textContent = '✓!';
                          }
                          button.style.background = '#FF9800';
                          button.title = `收藏成功但下载失败:${error}`;
                          restoreState(2500);
                      }
                  );
              } else {
                  restoreState();
              }
          },
          () => {
              button.textContent = '✗';
              button.style.background = '#f44336';
              button.style.color = '#ffffff';
              button.title = '收藏失败，请稍后重试';
              restoreState(2500);
          }
      );
  }

  function persistConfig() {
      for (const key of CONFIG_STORAGE_KEYS) {
          try {
              GM_setValue(key, HATH_CONFIG);
          } catch (error) {
              console.warn(`E-Hentai Unified: Failed to persist config to ${key}`, error);
          }
      }
  }

  function initializeListingFeatures() {
      // Check if we're on a gallery listing page
      if (!isGalleryPage()) {
          console.log('E-Hentai Unified: Not a gallery page or no galleries found');
          return;
      }

      console.log('E-Hentai Unified: Gallery page detected, adding controls');

      // Add individual gallery controls
      addGalleryControls();

      // Add floating reopen button
      addFloatingButton();

      // Add bulk controls if enabled by default
      if (HATH_CONFIG.showPanelByDefault) {
          addBulkControls();
      }

      applyImmersiveGalleryVisibility();
      applyImmersiveThumbnailSizing();
  }

  function isGalleryPage() {
      // Check if we're on a gallery listing page with multiple possible selectors
      const galleryContainer = document.querySelector('#gdt') ||
                              document.querySelector('.gallery') ||
                              document.querySelector('#content') ||
                              document.querySelector('.container');

      const galleryItems = document.querySelectorAll('.gdtm, .gdtl, .gl1t, .gl2t, .gl3t, .gl4t, .gl5t, .gl1c, .gl2c, .gl3c, .gl4c, .gl5c, .gl1e, .gl2e, .gl3e, .gl4e, .gl5e');
      const galleryLinks = document.querySelectorAll('a[href*="/g/"]');

      console.log('E-Hentai Unified: Found container:', !!galleryContainer);
      console.log('E-Hentai Unified: Found gallery items:', galleryItems.length);
      console.log('E-Hentai Unified: Found gallery links:', galleryLinks.length);

      return galleryItems.length > 0 || galleryLinks.length > 0;
  }

  function addFloatingButton() {
      if (!HATH_CONFIG.showFloatingButton) return;

      // Remove existing floating button if any
      const existingButton = document.getElementById('gallery-floating-button');
      if (existingButton) {
          existingButton.remove();
      }

      // Create floating button
      const floatingButton = document.createElement('div');
      floatingButton.id = 'gallery-floating-button';
      floatingButton.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 9999;
          transition: all 0.3s ease;
          font-size: 20px;
          color: white;
          user-select: none;
      `;

      floatingButton.innerHTML = '⚙️';
      floatingButton.title = 'Open Gallery Controls';

      // Add hover effects
      floatingButton.addEventListener('mouseenter', () => {
          floatingButton.style.transform = 'scale(1.1)';
          floatingButton.style.background = '#45a049';
      });

      floatingButton.addEventListener('mouseleave', () => {
          floatingButton.style.transform = 'scale(1)';
          floatingButton.style.background = '#4CAF50';
      });

      // Add click handler
      floatingButton.addEventListener('click', () => {
          const existingPanel = document.getElementById('bulk-controls');
          if (existingPanel) {
              existingPanel.remove();
              floatingButton.style.display = 'flex';
          } else {
              addBulkControls();
              floatingButton.style.display = 'none';
          }
      });

      document.body.appendChild(floatingButton);
  }

  function addBulkControls() {
      // Remove existing panel if any
      const existingPanel = document.getElementById('bulk-controls');
      if (existingPanel) {
          existingPanel.remove();
      }

      // Create bulk control panel
      const bulkPanel = document.createElement('div');
      bulkPanel.id = 'bulk-controls';
      bulkPanel.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border: 2px solid #4CAF50;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 10000;
          min-width: 300px;
          max-width: 400px;
      `;

      const favcatOptionsHtml = favcats.map((_, i) => `<option value="${i}">${escapeHtml(getFavcatName(i))}</option>`).join('');

      bulkPanel.innerHTML = `
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">🎯 Bulk Gallery Operations</h3>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Favorite Category:</label>
              <select id="bulk-favcat" style="width: 100%; padding: 5px; margin-bottom: 10px;">
                  ${favcatOptionsHtml}
              </select>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Operation:</label>
              <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                  <button id="bulk-favorite" style="flex: 1; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Add to Favorites</button>
                  <button id="bulk-download" style="flex: 1; padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Download Only</button>
              </div>
              <button id="bulk-both" style="width: 100%; padding: 8px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 10px;">Add to Favorites + Download</button>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Selection:</label>
              <div style="display: flex; gap: 10px;">
                  <button id="select-all" style="flex: 1; padding: 5px; background: #607D8B; color: white; border: none; border-radius: 4px; cursor: pointer;">Select All</button>
                  <button id="select-none" style="flex: 1; padding: 5px; background: #607D8B; color: white; border: none; border-radius: 4px; cursor: pointer;">Select None</button>
              </div>
          </div>

          <div id="bulk-status" style="font-size: 12px; color: #666; margin-bottom: 10px;">
              Ready to process galleries
          </div>

          <div style="display: flex; gap: 10px;">
              <button id="bulk-config" style="flex: 1; padding: 5px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">H@H Settings</button>
              <button id="bulk-close" style="flex: 1; padding: 5px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Close</button>
          </div>
      `;

      document.body.appendChild(bulkPanel);

      // Add event listeners
      document.getElementById('bulk-favorite').addEventListener('click', () => processBulkOperation('favorite'));
      document.getElementById('bulk-download').addEventListener('click', () => processBulkOperation('download'));
      document.getElementById('bulk-both').addEventListener('click', () => processBulkOperation('both'));
      document.getElementById('select-all').addEventListener('click', selectAllGalleries);
      document.getElementById('select-none').addEventListener('click', selectNoGalleries);
      document.getElementById('bulk-config').addEventListener('click', showHathConfigPanel);
      document.getElementById('bulk-close').addEventListener('click', () => {
          bulkPanel.remove();
          // Show floating button when panel is closed
          const floatingButton = document.getElementById('gallery-floating-button');
          if (floatingButton) {
              floatingButton.style.display = 'flex';
          }
      });
  }

  function addGalleryControls() {
      // First, try to find gallery items using the most common selectors
      let galleryItems = document.querySelectorAll('.gdtm, .gdtl, .gl1t, .gl2t, .gl3t, .gl4t, .gl5t, .gl1c, .gl2c, .gl3c, .gl4c, .gl5c, .gl1e, .gl2e, .gl3e, .gl4e, .gl5e, .gl1m, .gl2m, .gl3m, .gl4m, .gl5m');

      console.log('E-Hentai Unified: Found gallery items:', galleryItems.length);

      // If no standard gallery items found, try alternative approach
      if (galleryItems.length === 0) {
          console.log('E-Hentai Unified: No standard gallery items found, trying gallery links');
          const allLinks = document.querySelectorAll('a[href*="/g/"]');
          console.log('E-Hentai Unified: Found gallery links:', allLinks.length);

          // Process gallery links and find their containers
          const processedGids = new Set();
          allLinks.forEach((link) => {
              const href = link.href;
              const urlMatch = href.match(/\/g\/(\d+)\/([a-f0-9]{10,})/);
              if (urlMatch) {
                  const gid = urlMatch[1];
                  const token = urlMatch[2];

                  // Skip if already processed this gallery
                  if (processedGids.has(gid)) {
                      return;
                  }
                  processedGids.add(gid);

                  // Find the best container for this link
                  let container = link.closest('.gdtm, .gdtl, .gl1t, .gl2t, .gl3t, .gl4t, .gl5t, .gl1c, .gl2c, .gl3c, .gl4c, .gl5c, .gl1e, .gl2e, .gl3e, .gl4e, .gl5e, .gl1m, .gl2m, .gl3m, .gl4m, .gl5m');
                  if (!container) {
                      // If no standard container, use the link's parent or the link itself
                      container = link.parentElement || link;
                  }

                  console.log('E-Hentai Unified: Processing gallery link', gid);
                  addControlsToElement(container, gid, token, href);
              }
          });
          return;
      }

      // Process standard gallery items
      const processedGids = new Set();
      galleryItems.forEach((item, index) => {
          // Skip if already processed
          if (item.querySelector('.gallery-controls')) {
              return;
          }

          // Extract gallery info - try multiple ways to find the link
          let link = item.querySelector('a');
          if (!link) {
              // Try to find link in parent or child elements
              link = item.closest('a') || item.querySelector('a') || item.parentElement?.querySelector('a');
          }

          if (!link) {
              console.log('E-Hentai Unified: No link found for item', index);
              return;
          }

          const href = link.href;
          const urlMatch = href.match(/\/g\/(\d+)\/([a-f0-9]{10,})/);
          if (!urlMatch) {
              console.log('E-Hentai Unified: No valid gallery URL found for', href);
              return;
          }

          const gid = urlMatch[1];
          const token = urlMatch[2];

          // Skip if already processed this gallery
          if (processedGids.has(gid)) {
              return;
          }
          processedGids.add(gid);

          console.log('E-Hentai Unified: Adding controls for gallery', gid);
          addControlsToElement(item, gid, token, href);
      });
  }

  function addControlsToElement(element, gid, token, href) {
      // Skip if already processed
      if (element.querySelector('.gallery-controls')) {
          return;
      }

      // Create control container
      const controlContainer = document.createElement('div');
      controlContainer.className = 'gallery-controls';
      controlContainer.style.cssText = `
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0,0,0,0.9);
          border-radius: 4px;
          padding: 4px;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          max-width: 200px;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1000;
          font-size: 0;
      `;

      // Add checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'gallery-checkbox';
      checkbox.dataset.gid = gid;
      checkbox.dataset.token = token;
      checkbox.dataset.href = href;
      checkbox.style.cssText = `
          margin: 0;
          width: 16px;
          height: 16px;
      `;

      // Add quick favorite buttons (all 10 categories)
      const favButtons = favcats.map((_, i) => {
          const categoryName = getFavcatName(i);
          const label = getGalleryButtonLabel(i);
          const btn = document.createElement('button');
          btn.textContent = label;
          btn.title = `Add to ${categoryName}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
          btn.dataset.favcat = String(i);
          btn.dataset.originalLabel = label;
          btn.dataset.gid = gid;
          btn.dataset.token = token;
          btn.style.cssText = `
              padding: 2px 4px;
              font-size: 8px;
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 2px;
              cursor: pointer;
              min-width: ${HATH_CONFIG.showCategoryNames ? '24px' : '16px'};
              text-align: center;
              white-space: nowrap;
          `;
          btn.addEventListener('click', (e) => {
              e.stopPropagation();
              if (HATH_CONFIG.oneClickMode) {
                  handleOneClickFavoriteAndDownload(btn, gid, token, i);
              } else {
                  handleQuickFavorite(btn, gid, token);
              }
          });
          return btn;
      });

      // Add download button
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = '⬇';
      downloadBtn.title = 'Download';
      downloadBtn.dataset.gid = gid;
      downloadBtn.dataset.token = token;
      downloadBtn.style.cssText = `
          padding: 2px 4px;
          font-size: 9px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          min-width: 16px;
          text-align: center;
      `;
      downloadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleQuickDownload(downloadBtn, gid, token);
      });

      // Assemble controls
      controlContainer.appendChild(checkbox);
      favButtons.forEach(btn => controlContainer.appendChild(btn));
      controlContainer.appendChild(downloadBtn);

      // Add to element
      element.appendChild(controlContainer);

      // Show controls on hover
      element.addEventListener('mouseenter', () => {
          controlContainer.style.opacity = '1';
      });
      element.addEventListener('mouseleave', () => {
          controlContainer.style.opacity = '0';
      });

      if (element && element.classList && element.classList.contains('gl1t')) {
          adjustImmersiveThumbnail(element, HATH_CONFIG.immersiveMode);
          if (HATH_CONFIG.immersiveMode) {
              ensureImmersiveWall();
              scheduleImmersiveLayout();
          }
      }
  }

  function selectAllGalleries() {
      const checkboxes = document.querySelectorAll('.gallery-checkbox');
      checkboxes.forEach(cb => cb.checked = true);
      updateBulkStatus();
  }

  function selectNoGalleries() {
      const checkboxes = document.querySelectorAll('.gallery-checkbox');
      checkboxes.forEach(cb => cb.checked = false);
      updateBulkStatus();
  }

  function updateBulkStatus() {
      const checkboxes = document.querySelectorAll('.gallery-checkbox');
      const selected = Array.from(checkboxes).filter(cb => cb.checked).length;
      const status = document.getElementById('bulk-status');
      if (status) {
          status.textContent = `${selected} galleries selected`;
      }
  }

  function processBulkOperation(operation) {
      if (isProcessing) {
          alert('Please wait for current operation to complete');
          return;
      }

      const checkboxes = Array.from(document.querySelectorAll('.gallery-checkbox:checked'));
      if (checkboxes.length === 0) {
          alert('Please select at least one gallery');
          return;
      }

      isProcessing = true;
      processedCount = 0;
      successCount = 0;
      errorCount = 0;

      const galleries = checkboxes.map(cb => ({
          gid: cb.dataset.gid,
          token: cb.dataset.token,
          href: cb.dataset.href
      }));

      currentBatch = galleries;
      processNextGallery(operation);
  }

  function processNextGallery(operation) {
      if (processedCount >= currentBatch.length) {
          // All done
          isProcessing = false;
          const status = document.getElementById('bulk-status');
          if (status) {
              status.textContent = `Completed: ${successCount} success, ${errorCount} errors`;
          }
          return;
      }

      const gallery = currentBatch[processedCount];
      processedCount++;

      const status = document.getElementById('bulk-status');
      if (status) {
          status.textContent = `Processing ${processedCount}/${currentBatch.length}: ${gallery.gid}`;
      }

      if (operation === 'favorite' || operation === 'both') {
          const favcatSelect = document.getElementById('bulk-favcat');
          const parsedFavcat = parseInt(favcatSelect ? favcatSelect.value : '0', 10);
          const favcatId = Number.isInteger(parsedFavcat) ? parsedFavcat : 0;
          addToFavorites(gallery.gid, gallery.token, favcatId, () => {
              if (operation === 'both') {
                  // Also download
                  sendHathDownloadRequest(gallery.gid, gallery.token, window.location.hostname,
                      () => successCount++,
                      () => errorCount++
                  );
              } else {
                  successCount++;
              }
              setTimeout(() => processNextGallery(operation), HATH_CONFIG.batchDelay);
          }, () => {
              errorCount++;
              setTimeout(() => processNextGallery(operation), HATH_CONFIG.batchDelay);
          });
      } else if (operation === 'download') {
          sendHathDownloadRequest(gallery.gid, gallery.token, window.location.hostname,
              () => {
                  successCount++;
                  setTimeout(() => processNextGallery(operation), HATH_CONFIG.batchDelay);
              },
              () => {
                  errorCount++;
                  setTimeout(() => processNextGallery(operation), HATH_CONFIG.batchDelay);
              }
          );
      }
  }

  function handleOneClickFavoriteAndDownload(button, gid, token, favcatId) {
      const categoryName = getFavcatName(favcatId);
      const originalText = button.dataset.originalLabel || getGalleryButtonLabel(favcatId);
      button.textContent = '...';
      button.disabled = true;
      button.title = `Adding to ${categoryName}...`;

      // First add to favorites
      addToFavorites(gid, token, favcatId,
          () => {
              // Favorite success, now download
              button.textContent = '✓';
              button.style.background = '#4CAF50';
              button.title = `Added to ${categoryName}`;

              if (HATH_CONFIG.enabled) {
                  sendHathDownloadRequest(gid, token, window.location.hostname,
                      (downloadMessage) => {
                          button.textContent = '✓✓';
                          button.style.background = '#4CAF50';
                          button.title = `Added to ${categoryName} + Downloaded`;
                          setTimeout(() => {
                              button.textContent = originalText;
                              button.style.background = '#2196F3';
                              button.disabled = false;
                              button.title = `Add to ${categoryName}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
                          }, 3000);
                      },
                      (downloadError) => {
                          button.textContent = '✓!';
                          button.style.background = '#FF9800';
                          button.title = `Added to ${categoryName} but download failed`;
                          setTimeout(() => {
                              button.textContent = originalText;
                              button.style.background = '#2196F3';
                              button.disabled = false;
                              button.title = `Add to ${categoryName}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
                          }, 3000);
                      }
                  );
              } else {
                  // Download disabled, just show favorite success
                  button.title = `Added to ${categoryName}`;
                  setTimeout(() => {
                      button.textContent = originalText;
                      button.style.background = '#2196F3';
                      button.disabled = false;
                      button.title = `Add to ${categoryName}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
                  }, 2000);
              }
          },
          () => {
              // Favorite failed
              button.textContent = '✗';
              button.style.background = '#f44336';
              button.title = `Failed to add to ${categoryName}`;
              setTimeout(() => {
                  button.textContent = originalText;
                  button.style.background = '#2196F3';
                  button.disabled = false;
                  button.title = `Add to ${categoryName}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
              }, 2000);
          }
      );
  }

  function handleQuickFavorite(button, gid, token) {
      const parsedFavcat = parseInt(button.dataset.favcat, 10);
      const favcatId = Number.isInteger(parsedFavcat) ? parsedFavcat : 0;
      const categoryName = getFavcatName(favcatId);
      const originalText = button.dataset.originalLabel || getGalleryButtonLabel(favcatId);
      button.textContent = '...';
      button.disabled = true;
      button.title = `Adding to ${categoryName}...`;

      addToFavorites(gid, token, favcatId,
          () => {
              button.textContent = '✓';
              button.style.background = '#4CAF50';
              button.title = `Added to ${categoryName}`;
              setTimeout(() => {
                  button.textContent = originalText;
                  button.style.background = '#2196F3';
                  button.disabled = false;
                  button.title = `Add to ${categoryName}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
              }, 2000);
          },
          () => {
              button.textContent = '✗';
              button.style.background = '#f44336';
              button.title = `Failed to add to ${categoryName}`;
              setTimeout(() => {
                  button.textContent = originalText;
                  button.style.background = '#2196F3';
                  button.disabled = false;
                  button.title = `Add to ${categoryName}${HATH_CONFIG.oneClickMode ? ' + Download' : ''}`;
              }, 2000);
          }
      );
  }

  function handleQuickDownload(button, gid, token) {
      button.textContent = '...';
      button.disabled = true;

      sendHathDownloadRequest(gid, token, window.location.hostname,
          () => {
              button.textContent = '✓';
              button.style.background = '#4CAF50';
              setTimeout(() => {
                  button.textContent = '⬇';
                  button.style.background = '#4CAF50';
                  button.disabled = false;
              }, 2000);
          },
          () => {
              button.textContent = '✗';
              button.style.background = '#f44336';
              setTimeout(() => {
                  button.textContent = '⬇';
                  button.style.background = '#4CAF50';
                  button.disabled = false;
              }, 2000);
          }
      );
  }

  function addToFavorites(gid, token, favcatId, onSuccess, onError) {
      const hostname = window.location.hostname;
      const requestUrl = `https://${hostname}/gallerypopups.php?gid=${gid}&t=${token}&act=addfav`;
      const formData = `favcat=${favcatId}&favnote=&apply=Add+to+Favorites&update=1`;

      GM_xmlhttpRequest({
          method: "POST",
          url: requestUrl,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          data: formData,
          onload: function(response) {
              const successSignature = 'window.opener.document.getElementById("favoritelink")';
              if (response.status === 200 && response.responseText.includes(successSignature)) {
                  onSuccess();
              } else {
                  onError();
              }
          },
          onerror: function() {
              onError();
          }
      });
  }

  // *** H@H Download Functions (same as main script) ***

  function sendHathDownloadRequest(gid, token, hostname, onSuccess, onError) {
      if (!HATH_CONFIG.enabled) {
          onSuccess('H@H download disabled');
          return;
      }

      const galleryUrl = `https://${hostname}/g/${gid}/${token}`;

      switch (HATH_CONFIG.method) {
          case 'xeHentai':
              sendXeHentaiDownloadRequest(gid, token, galleryUrl, onSuccess, onError);
              break;
          case 'real':
              sendRealDownloadRequest(gid, token, hostname, onSuccess, onError);
              break;
          case 'direct':
              sendDirectDownloadRequest(gid, token, hostname, onSuccess, onError);
              break;
          case 'link':
              sendLinkDownloadRequest(gid, token, hostname, onSuccess, onError);
              break;
          case 'custom':
              sendCustomDownloadRequest(gid, token, galleryUrl, onSuccess, onError);
              break;
          default:
              onError('Unknown download method: ' + HATH_CONFIG.method);
      }
  }

  function sendRealDownloadRequest(gid, token, hostname, onSuccess, onError) {
      try {
          const archiverUrl = `https://${hostname}/archiver.php?gid=${gid}&token=${token}`;
          const formData = 'hathdl_xres=org';

          GM_xmlhttpRequest({
              method: 'POST',
              url: archiverUrl,
              headers: {
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                  'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                  'Cache-Control': 'max-age=0',
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'DNT': '1',
                  'Origin': `https://${hostname}`,
                  'Priority': 'u=0, i',
                  'Referer': archiverUrl,
                  'Sec-CH-UA': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                  'Sec-CH-UA-Mobile': '?0',
                  'Sec-CH-UA-Platform': '"macOS"',
                  'Sec-Fetch-Dest': 'document',
                  'Sec-Fetch-Mode': 'navigate',
                  'Sec-Fetch-Site': 'same-origin',
                  'Sec-Fetch-User': '?1',
                  'Upgrade-Insecure-Requests': '1',
                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
              },
              data: formData,
              onload: function(response) {
                  if (response.status === 200) {
                      const responseText = response.responseText.toLowerCase();
                      if (responseText.includes('download') ||
                          responseText.includes('archive') ||
                          responseText.includes('hathdl') ||
                          responseText.includes('success') ||
                          responseText.includes('queued') ||
                          responseText.includes('started')) {
                          onSuccess('Download queued successfully!');
                      } else if (responseText.includes('log on') ||
                                 responseText.includes('login') ||
                                 responseText.includes('password') ||
                                 responseText.includes('authentication')) {
                          onError('Please log in to E-Hentai first');
                      } else {
                          onSuccess('Download request sent');
                      }
                  } else if (response.status === 302 || response.status === 301) {
                      onSuccess('Download initiated (redirected)');
                  } else {
                      onError(`Download failed: HTTP ${response.status}`);
                  }
              },
              onerror: function() {
                  onError('Network error - check connection');
              }
          });
      } catch (error) {
          onError(`Real download failed: ${error.message}`);
      }
  }

  function sendXeHentaiDownloadRequest(gid, token, galleryUrl, onSuccess, onError) {
      const requestData = {
          jsonrpc: '2.0',
          method: 'aria2.addUri',
          params: [
              [galleryUrl],
            {
                'dir': '/downloads',
                'max-connection-per-server': '16',
                'split': '16',
                'min-split-size': '1M',
                'max-tries': '5',
                'retry-wait': '3',
                'user-agent': navigator.userAgent,
                'referer': galleryUrl
            }
          ],
          id: Date.now()
      };

      const headers = {
          'Content-Type': 'application/json'
      };

      if (HATH_CONFIG.xeHentaiApiKey) {
          headers['Authorization'] = `Bearer ${HATH_CONFIG.xeHentaiApiKey}`;
      }

      GM_xmlhttpRequest({
          method: 'POST',
          url: `${HATH_CONFIG.xeHentaiUrl}/jsonrpc`,
          headers: headers,
          data: JSON.stringify(requestData),
          onload: function(response) {
              if (response.status === 200) {
                  try {
                      const result = JSON.parse(response.responseText);
                      if (result.result) {
                          onSuccess(`Download queued: ${result.result}`);
                      } else if (result.error) {
                          onError(`xeHentai error: ${result.error.message}`);
                      } else {
                          onSuccess('Download request sent to xeHentai');
                      }
                  } catch (e) {
                      onError('Invalid JSON response from xeHentai');
                  }
              } else {
                  onError(`xeHentai request failed: ${response.status}`);
              }
          },
          onerror: function() {
              onError('Failed to connect to xeHentai server');
          }
      });
  }

  function sendDirectDownloadRequest(gid, token, hostname, onSuccess, onError) {
      try {
          const archiverUrl = `https://${hostname}/archiver.php?gid=${gid}&token=${token}`;
          const formData = 'hathdl_xres=org';

          GM_xmlhttpRequest({
              method: 'POST',
              url: archiverUrl,
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                  'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                  'Cache-Control': 'max-age=0',
                  'DNT': '1',
                  'Origin': `https://${hostname}`,
                  'Priority': 'u=0, i',
                  'Referer': archiverUrl,
                  'Sec-Fetch-Dest': 'document',
                  'Sec-Fetch-Mode': 'navigate',
                  'Sec-Fetch-Site': 'same-origin',
                  'Sec-Fetch-User': '?1',
                  'Upgrade-Insecure-Requests': '1',
                  'User-Agent': navigator.userAgent
              },
              data: formData,
              onload: function(response) {
                  if (response.status === 200) {
                      if (response.responseText.includes('download') ||
                          response.responseText.includes('archive') ||
                          response.responseText.includes('hathdl') ||
                          response.responseText.includes('Download')) {
                          onSuccess('Download request sent successfully');
                      } else if (response.responseText.includes('log on') ||
                                 response.responseText.includes('login') ||
                                 response.responseText.includes('password')) {
                          onError('Authentication required - please log in to E-Hentai');
                      } else {
                          onSuccess('Download request sent');
                      }
                  } else if (response.status === 302 || response.status === 301) {
                      onSuccess('Download request sent (redirected)');
                  } else {
                      onError(`Download request failed: ${response.status}`);
                  }
              },
              onerror: function() {
                  onError('Failed to send download request');
              }
          });
      } catch (error) {
          onError(`Direct download failed: ${error.message}`);
      }
  }

  function sendLinkDownloadRequest(gid, token, hostname, onSuccess, onError) {
      try {
          const archiverUrl = `https://${hostname}/archiver.php?gid=${gid}&token=${token}`;
          const downloadWindow = window.open(archiverUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

          if (downloadWindow) {
              onSuccess('Archiver page opened in new tab');
              setTimeout(() => {
                  try {
                      if (!downloadWindow.closed) {
                          downloadWindow.close();
                      }
                  } catch (e) {
                      // Ignore errors when closing
                  }
              }, 15000);
          } else {
              onError('Could not open archiver page (popup blocked?)');
          }
      } catch (error) {
          onError(`Link download failed: ${error.message}`);
      }
  }

  function sendCustomDownloadRequest(gid, token, galleryUrl, onSuccess, onError) {
      if (!HATH_CONFIG.customDownloadUrl) {
          onError('Custom download URL not configured');
          return;
      }

      const requestData = {
          gid: gid,
          token: token,
          url: galleryUrl,
          quality: HATH_CONFIG.quality,
          timestamp: Date.now()
      };

      GM_xmlhttpRequest({
          method: 'POST',
          url: HATH_CONFIG.customDownloadUrl,
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify(requestData),
          onload: function(response) {
              if (response.status === 200) {
                  onSuccess('Download request sent to custom endpoint');
              } else {
                  onError(`Custom download failed: ${response.status}`);
              }
          },
          onerror: function() {
              onError('Failed to connect to custom download endpoint');
          }
      });
  }

  function showHathConfigPanel() {
      // Remove existing panel if any
      const existingPanel = document.getElementById('hath-config-panel');
      if (existingPanel) {
          existingPanel.remove();
          return;
      }

      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.id = 'hath-config-panel';
      overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 10001;
          display: flex;
          justify-content: center;
          align-items: center;
      `;

      // Create panel
      const panel = document.createElement('div');
      panel.style.cssText = `
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          max-height: 80%;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      `;

      const favcatInputsHtml = favcats.map((name, index) => {
          const displayIndex = String(index);
          const value = escapeHtml(name);
          const placeholder = escapeHtml(DEFAULT_FAVCATS[index] || '');
          return `
              <label style="display: flex; align-items: center; gap: 6px; font-size: 12px;">
                  <span style="width: 22px; font-weight: bold;">${displayIndex}</span>
                  <input type="text" class="favcat-input" data-favcat-index="${displayIndex}" value="${value}" placeholder="${placeholder}" style="flex: 1; padding: 4px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px;">
              </label>
          `;
      }).join('');

      const sanitizedThumbScale = clampThumbScale(HATH_CONFIG.immersiveThumbScale);

      panel.innerHTML = `
          <h3 style="margin-top: 0; color: #333;">H@H Download Configuration</h3>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Enable H@H Download:</label>
              <input type="checkbox" id="hath-enabled" ${HATH_CONFIG.enabled ? 'checked' : ''} style="margin-right: 5px;">
              <span>Automatically download when adding to favorites</span>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">One-Click Mode:</label>
              <input type="checkbox" id="one-click-mode" ${HATH_CONFIG.oneClickMode ? 'checked' : ''} style="margin-right: 5px;">
              <span>Favorite buttons will also download (one-click operation)</span>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Show Category Names:</label>
              <input type="checkbox" id="show-category-names" ${HATH_CONFIG.showCategoryNames ? 'checked' : ''} style="margin-right: 5px;">
              <span>Show category names on buttons instead of numbers</span>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Panel Behavior:</label>
              <div style="margin-left: 10px;">
                  <div style="margin-bottom: 5px;">
                      <input type="checkbox" id="show-panel-default" ${HATH_CONFIG.showPanelByDefault ? 'checked' : ''} style="margin-right: 5px;">
                      <span>Show control panel by default</span>
                  </div>
                  <div>
                      <input type="checkbox" id="show-floating-button" ${HATH_CONFIG.showFloatingButton ? 'checked' : ''} style="margin-right: 5px;">
                      <span>Show floating reopen button (⚙️)</span>
                  </div>
              </div>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Keyboard Shortcuts:</label>
              <div style="margin-left: 10px;">
                  <div>
                      <input type="checkbox" id="enable-pagination-shortcuts" ${HATH_CONFIG.enablePaginationShortcuts ? 'checked' : ''} style="margin-right: 5px;">
                      <span>Enable Left / Right arrow keys for previous / next page navigation</span>
                  </div>
              </div>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Immersive Mode:</label>
              <div style="margin-left: 10px; display: flex; flex-direction: column; gap: 6px;">
                  <div>
                      <input type="checkbox" id="enable-immersive-mode" ${HATH_CONFIG.immersiveMode ? 'checked' : ''} style="margin-right: 5px;">
                      <span>Move the header below results and hide the top navigation bar</span>
                  </div>
                  <div style="margin-left: 18px; display: grid; gap: 4px; font-size: 12px;">
                      <label style="display: flex; align-items: center; gap: 6px;">
                          <input type="checkbox" id="immersive-show-title" ${HATH_CONFIG.immersiveShowTitle ? 'checked' : ''}>
                          <span>Show gallery titles</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 6px;">
                          <input type="checkbox" id="immersive-show-category" ${HATH_CONFIG.immersiveShowCategory ? 'checked' : ''}>
                          <span>Show category badges</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 6px;">
                          <input type="checkbox" id="immersive-show-rating" ${HATH_CONFIG.immersiveShowRating ? 'checked' : ''}>
                          <span>Show star ratings</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 6px;">
                          <input type="checkbox" id="immersive-show-date" ${HATH_CONFIG.immersiveShowDate ? 'checked' : ''}>
                          <span>Show posted dates</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 6px;">
                          <input type="checkbox" id="immersive-show-pages" ${HATH_CONFIG.immersiveShowPages ? 'checked' : ''}>
                          <span>Show total page counts</span>
                      </label>
                      <label style="display: flex; align-items: center; gap: 6px;">
                          <input type="checkbox" id="immersive-remove-border" ${HATH_CONFIG.immersiveRemoveBorder ? 'checked' : ''}>
                          <span>Remove thumbnail borders</span>
                      </label>
                      <label id="immersive-thumb-scale-wrapper" style="display: flex; align-items: center; gap: 8px;">
                          <span style="flex: 0 0 110px;">Thumbnail size</span>
                          <input type="range" id="immersive-thumb-scale" min="40" max="200" step="5" value="${sanitizedThumbScale}" style="flex: 1;">
                          <span id="immersive-thumb-scale-value" style="width: 48px; text-align: right;">${sanitizedThumbScale}%</span>
                      </label>
                  </div>
              </div>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Category Labels:</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
                  ${favcatInputsHtml}
              </div>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Download Method:</label>
              <select id="hath-method" style="width: 100%; padding: 5px; margin-bottom: 5px;">
                  <option value="real" ${HATH_CONFIG.method === 'real' ? 'selected' : ''}>Real Download (POST) - ⭐ RECOMMENDED - True one-click download</option>
                  <option value="xeHentai" ${HATH_CONFIG.method === 'xeHentai' ? 'selected' : ''}>xeHentai (JSON-RPC) - For xeHentai users</option>
                  <option value="direct" ${HATH_CONFIG.method === 'direct' ? 'selected' : ''}>Direct E-Hentai (Archiver) - Clicks download button or opens archiver</option>
                  <option value="link" ${HATH_CONFIG.method === 'link' ? 'selected' : ''}>Link Download (New Tab) - Opens archiver.php page</option>
                  <option value="custom" ${HATH_CONFIG.method === 'custom' ? 'selected' : ''}>Custom Endpoint - For custom solutions</option>
              </select>
              <div style="font-size: 12px; color: #666; margin-top: 5px;">
                  <strong>Real Download:</strong> Sends actual POST request to archiver.php with hathdl_xres=org for original quality. No popups!
              </div>
          </div>

          <div id="xeHentai-config" style="margin-bottom: 15px; ${HATH_CONFIG.method !== 'xeHentai' ? 'display: none;' : ''}">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">xeHentai Server URL:</label>
              <input type="text" id="xeHentai-url" value="${HATH_CONFIG.xeHentaiUrl}" style="width: 100%; padding: 5px; margin-bottom: 5px;" placeholder="http://localhost:8080">

              <label style="display: block; margin-bottom: 5px; font-weight: bold;">API Key (optional):</label>
              <input type="text" id="xeHentai-key" value="${HATH_CONFIG.xeHentaiApiKey}" style="width: 100%; padding: 5px;" placeholder="Leave empty if not required">
          </div>

          <div id="custom-config" style="margin-bottom: 15px; ${HATH_CONFIG.method !== 'custom' ? 'display: none;' : ''}">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Custom Download URL:</label>
              <input type="text" id="custom-url" value="${HATH_CONFIG.customDownloadUrl}" style="width: 100%; padding: 5px;" placeholder="http://your-server.com/download">
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Download Quality:</label>
              <select id="hath-quality" style="width: 100%; padding: 5px;">
                  <option value="original" ${HATH_CONFIG.quality === 'original' ? 'selected' : ''}>Original Quality</option>
                  <option value="resample" ${HATH_CONFIG.quality === 'resample' ? 'selected' : ''}>Resampled</option>
              </select>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Batch Settings:</label>
              <div style="display: flex; gap: 10px;">
                  <div style="flex: 1;">
                      <label style="font-size: 12px;">Delay (ms):</label>
                      <input type="number" id="batch-delay" value="${HATH_CONFIG.batchDelay}" style="width: 100%; padding: 3px; font-size: 12px;">
                  </div>
                  <div style="flex: 1;">
                      <label style="font-size: 12px;">Max Concurrent:</label>
                      <input type="number" id="max-concurrent" value="${HATH_CONFIG.maxConcurrent}" style="width: 100%; padding: 3px; font-size: 12px;">
                  </div>
              </div>
          </div>

          <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold;">Show Download Status:</label>
              <input type="checkbox" id="hath-status" ${HATH_CONFIG.showDownloadStatus ? 'checked' : ''} style="margin-right: 5px;">
              <span>Display download status in button text</span>
          </div>

          <div style="text-align: right; margin-top: 20px;">
              <button id="hath-save" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 10px; cursor: pointer;">Save</button>
              <button id="hath-cancel" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancel</button>
          </div>
      `;

      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      // Event listeners
      document.getElementById('hath-method').addEventListener('change', function() {
          const method = this.value;
          document.getElementById('xeHentai-config').style.display = method === 'xeHentai' ? 'block' : 'none';
          document.getElementById('custom-config').style.display = method === 'custom' ? 'block' : 'none';
      });

      const immersiveToggle = document.getElementById('enable-immersive-mode');
      const immersiveOptionCheckboxes = [
          document.getElementById('immersive-show-title'),
          document.getElementById('immersive-show-category'),
          document.getElementById('immersive-show-rating'),
          document.getElementById('immersive-show-date'),
          document.getElementById('immersive-show-pages')
      ].filter(Boolean);

      const immersiveThumbSlider = document.getElementById('immersive-thumb-scale');
      const immersiveThumbValue = document.getElementById('immersive-thumb-scale-value');
      const immersiveThumbWrapper = document.getElementById('immersive-thumb-scale-wrapper');

      function updateImmersiveThumbDisplay(value) {
          if (!immersiveThumbValue) {
              return;
          }
          const numeric = clampThumbScale(value);
          immersiveThumbValue.textContent = `${numeric}%`;
      }

      function updateImmersiveOptionState() {
          const enabled = immersiveToggle ? immersiveToggle.checked : false;
          immersiveOptionCheckboxes.forEach((checkbox) => {
              checkbox.disabled = !enabled;
              const label = checkbox.closest('label');
              if (label) {
                  label.style.opacity = enabled ? '1' : '0.6';
              }
          });
          if (immersiveThumbSlider) {
              immersiveThumbSlider.disabled = !enabled;
          }
          if (immersiveThumbWrapper) {
              immersiveThumbWrapper.style.opacity = enabled ? '1' : '0.6';
          }
          updateImmersiveThumbDisplay(immersiveThumbSlider ? immersiveThumbSlider.value : HATH_CONFIG.immersiveThumbScale);
      }

      if (immersiveToggle) {
          immersiveToggle.addEventListener('change', updateImmersiveOptionState);
      }
      if (immersiveThumbSlider) {
          immersiveThumbSlider.addEventListener('input', () => {
              updateImmersiveThumbDisplay(immersiveThumbSlider.value);
          });
      }
      updateImmersiveOptionState();

      document.getElementById('hath-save').addEventListener('click', function() {
          // Save configuration
          HATH_CONFIG.enabled = document.getElementById('hath-enabled').checked;
          HATH_CONFIG.oneClickMode = document.getElementById('one-click-mode').checked;
          HATH_CONFIG.showCategoryNames = document.getElementById('show-category-names').checked;
          HATH_CONFIG.showPanelByDefault = document.getElementById('show-panel-default').checked;
          HATH_CONFIG.showFloatingButton = document.getElementById('show-floating-button').checked;
          HATH_CONFIG.enablePaginationShortcuts = document.getElementById('enable-pagination-shortcuts').checked;
          HATH_CONFIG.immersiveMode = document.getElementById('enable-immersive-mode').checked;
          HATH_CONFIG.immersiveShowTitle = document.getElementById('immersive-show-title').checked;
          HATH_CONFIG.immersiveShowCategory = document.getElementById('immersive-show-category').checked;
          HATH_CONFIG.immersiveShowRating = document.getElementById('immersive-show-rating').checked;
          HATH_CONFIG.immersiveShowDate = document.getElementById('immersive-show-date').checked;
          HATH_CONFIG.immersiveShowPages = document.getElementById('immersive-show-pages').checked;
          HATH_CONFIG.immersiveRemoveBorder = document.getElementById('immersive-remove-border').checked;
          const immersiveThumbScaleInput = document.getElementById('immersive-thumb-scale');
          HATH_CONFIG.immersiveThumbScale = clampThumbScale(immersiveThumbScaleInput ? immersiveThumbScaleInput.value : HATH_CONFIG.immersiveThumbScale);
          HATH_CONFIG.method = document.getElementById('hath-method').value;
          HATH_CONFIG.xeHentaiUrl = document.getElementById('xeHentai-url').value;
          HATH_CONFIG.xeHentaiApiKey = document.getElementById('xeHentai-key').value;
          HATH_CONFIG.customDownloadUrl = document.getElementById('custom-url').value;
          HATH_CONFIG.quality = document.getElementById('hath-quality').value;
          const favcatInputs = Array.from(panel.querySelectorAll('.favcat-input'));
          const updatedFavcats = [...favcats];
          favcatInputs.forEach(input => {
              const idx = parseInt(input.dataset.favcatIndex, 10);
              if (Number.isInteger(idx) && idx >= 0 && idx < updatedFavcats.length) {
                  const value = input.value.trim();
                  updatedFavcats[idx] = value || DEFAULT_FAVCATS[idx] || '';
              }
          });
          favcats = normalizeFavcats(updatedFavcats);
          HATH_CONFIG.favcats = [...favcats];
          const batchDelayValue = parseInt(document.getElementById('batch-delay').value, 10);
          HATH_CONFIG.batchDelay = Number.isFinite(batchDelayValue) && batchDelayValue >= 0 ? batchDelayValue : DEFAULT_CONFIG.batchDelay;
          const maxConcurrentValue = parseInt(document.getElementById('max-concurrent').value, 10);
          HATH_CONFIG.maxConcurrent = Number.isFinite(maxConcurrentValue) && maxConcurrentValue > 0 ? maxConcurrentValue : DEFAULT_CONFIG.maxConcurrent;
          HATH_CONFIG.showDownloadStatus = document.getElementById('hath-status').checked;

          refreshFavoriteLabels();
          setupPaginationShortcuts();
          updateImmersiveMode();

          // Save to storage (new + legacy keys)
          persistConfig();

          // Close panel
          overlay.remove();

          // Show success message
          alert('H@H configuration saved successfully! Please refresh the page to see changes.');
      });

      document.getElementById('hath-cancel').addEventListener('click', function() {
          overlay.remove();
      });

      overlay.addEventListener('click', function(e) {
          if (e.target === overlay) {
              overlay.remove();
          }
      });
  }

})();
