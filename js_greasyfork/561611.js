// ==UserScript==
// @name         ニコニコ增强與修復
// @name:en      Niconico Enhance and Fix
// @name:ja      ニコニコ強化＆修正
// @name:zh-CN   Niconico 增强与修复
// @name:zh-TW   Niconico 增强與修復
// @namespace    https://www.nicovideo.jp/
// @version      0.6.11
// @description  統計異常或日區帳號自動切換到嵌入播放器；原播放器嘗試跳過/屏蔽廣告；保留嵌入播放器主要控制。
// @description:en      Auto-switches to the embedded player when watch metrics look abnormal (or for Japanese accounts); skips/blocks ads where possible; keeps key controls usable in the embed.
// @description:ja      再生数/コメント数などの表示が不自然なとき（または日本向けアカウント）に埋め込みプレイヤーへ自動切替。広告は可能な範囲でスキップ/ブロックし、埋め込み時も主要操作を使えるようにします。
// @description:zh-CN   统计异常或日区账号自动切换到嵌入播放器；原播放器尽量跳过/屏蔽广告；保留嵌入播放器主要控制按钮可用。
// @description:zh-TW   統計異常或日區帳號自動切換到嵌入播放器；原播放器嘗試跳過/屏蔽廣告；保留嵌入播放器主要控制。
// @author       Codex, Grok, SoizoKtantas
// @license      CC BY 4.0
// @match        https://www.nicovideo.jp/watch/*
// @match        https://nicovideo.jp/watch/*
// @match        https://embed.nicovideo.jp/watch/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561611/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A2%9E%E5%BC%BA%E8%88%87%E4%BF%AE%E5%BE%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/561611/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A2%9E%E5%BC%BA%E8%88%87%E4%BF%AE%E5%BE%A9.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const EMBED_HOST = 'embed.nicovideo.jp';
  const EMBED_FRAME_NAME = 'nef-watch-embed';
  const EMBED_FRAME_ATTR = 'data-nef-parent';
  const EMBED_HOST_CLASS = 'nef-embed-host';
  const EMBED_CONTROLS_CLASS = 'nef-embed-controls';
  const EMBED_CONTROLS_VISIBLE_CLASS = 'nef-embed-controls-visible';
  const EMBED_WRAPPER_CLASS = 'nef-embed-wrapper';
  const EMBED_IFRAME_CLASS = 'nef-embed-iframe';
  const STYLE_ID = 'nef-embed-style';
  const HOST_AD_STYLE_ID = 'nef-host-ad-style';
  const UPDATE_INTERVAL = 1000;
  const METRICS_CACHE_MS = 1500;
  const JAPANESE_LOCALE_RE = /(^|[^a-z0-9])(?:ja(?:[-_]|$)|jp|日本|ニホン|にほん)/i;
  const ACCOUNT_LOCALE_CACHE_MS = 1500;
  const PLAYER_PRESENTER_SELECTOR = '.PlayerPresenter';
  const STAGE_HIDE_SELECTOR = '.PlayerPresenter [data-styling-id="_r_5_"]';
  const VIDEO_FRAME_SELECTOR = '.PlayerPresenter [class*="asp_16:9"]';
  const AD_CONTAINER_SELECTOR = '#nv_watch_VideoAdContainer';
  const VIEW_COUNT_SELECTOR =
    '#root > div > main > div > div > section > div > div > div.gap_base:has(h1):has(div>time) > div:first-of-type >span';
  const COMMENT_COUNT_SELECTOR =
    '#root > div > main > div > div > section > div > div > div.gap_base:has(h1):has(div>time) > div:nth-of-type(2) >span';
  const AD_SKIP_LABEL_RE = /(広告をスキップ|スキップ|skip)/i;
  const AD_SKIP_SCAN_INTERVAL = 700;
  const EMBED_CONTROL_SELECTOR = '.f187xx8z';
  const EMBED_CONTROL_ACTIVE_CLASS = 'controlling';
  const EMBED_CONTROL_MESSAGE = 'nef-embed-controls';
  const EMBED_CONTROL_FADE_DEFAULT = 200;
  const EMBED_CONTROL_EASE_DEFAULT = 'ease';
  const RATE_MESSAGE = 'nef-embed-rate';
  const RATE_LABEL_RE = /(再生速度|playback speed)/i;
  const RATE_UNLOCK_OPTIONS = [
    { rate: 2.0, value: 'x2.0', label: 'x2.0' },
    { rate: 1.75, value: 'x1.75', label: 'x1.75' },
    { rate: 1.5, value: 'x1.5', label: 'x1.5' },
  ];
  const SETTINGS_PANEL_SELECTOR = '[data-nvpc-scope="watch-floating-panel"][data-nvpc-part="floating"]';
  const RATE_SCAN_DELAY = 120;
  const SETTINGS_LABEL_RE = /(設定|settings?)/i;
  const FULLSCREEN_LABEL_RE = /(全画面|fullscreen)/i;
  const SETTINGS_BUTTON_GAP = 8;
  const HOST_AD_HIDE_CSS = `
    #root>div>main>div>div>section>div>div>div>div:has(div[id^="ads"]),
    #root>div>main>div>div.bottom_x3.z_docked>div,
    #CommonHeader>div>div>div>div.common-header-wb7b82>div.common-header-m5ds7e>div,
    #root>div>main>div>div>section>div>div:has(div[id^="ads"]),
    [id^="ads"],
    .RightSideAdContainer-banner:has(div.Ads > iframe),
    .HeaderContainer-ads {
      display: none !important;
    }
  `;
  const EMBED_HIDE_CSS = `
    .f1pw04al,
    .f3ta3nh,
    .f1tzxqq7,
    #icon,
    div[data-reactid="85"]:has(#overlayBanner>[id^="ads_"]),
    .f1i0y30a {
      display: none !important;
    }
  `;

  const state = {
    host: null,
    wrapper: null,
    iframe: null,
    watchId: '',
    controls: null,
    settingsButton: null,
    settingsButtonHome: null,
    controlsVisible: false,
    controlsFadeMs: EMBED_CONTROL_FADE_DEFAULT,
    controlsEase: EMBED_CONTROL_EASE_DEFAULT,
    rateValue: null,
    rateSentValue: null,
    rateSentWatchId: '',
    mutedVideos: new Map(),
    pageWatchId: '',
    embedDecision: null,
    metrics: {
      status: 'unknown',
      views: null,
      comments: null,
      updatedAt: 0,
    },
    accountLocale: null,
    accountLocaleUpdatedAt: 0,
  };

  const ensureStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${EMBED_HOST_CLASS} {
        position: relative !important;
      }
      .${EMBED_HOST_CLASS} > *:not(.${EMBED_WRAPPER_CLASS}):not(.${EMBED_CONTROLS_CLASS}) {
        opacity: 0 !important;
        pointer-events: none !important;
      }
      .${EMBED_CONTROLS_CLASS} {
        position: absolute;
        z-index: 100000;
        display: flex;
        align-items: center;
        gap: ${SETTINGS_BUTTON_GAP}px;
        opacity: 0 !important;
        pointer-events: none !important;
        transition: opacity var(--nef-embed-fade, ${EMBED_CONTROL_FADE_DEFAULT}ms)
          var(--nef-embed-ease, ${EMBED_CONTROL_EASE_DEFAULT});
      }
      .${EMBED_CONTROLS_CLASS}.${EMBED_CONTROLS_VISIBLE_CLASS} {
        opacity: 1 !important;
        pointer-events: auto !important;
      }
      .${EMBED_CONTROLS_CLASS} button {
        pointer-events: auto !important;
      }
      .${EMBED_CONTROLS_CLASS} svg {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85));
      }
      ${STAGE_HIDE_SELECTOR} {
        display: none !important;
      }
      .${EMBED_WRAPPER_CLASS} {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        z-index: 99999;
      }
      .${EMBED_WRAPPER_CLASS} iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
      display: block;
      background: #000;
      }
    `;
    document.documentElement.appendChild(style);
  };

  const ensureHostAdStyle = () => {
    if (document.getElementById(HOST_AD_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = HOST_AD_STYLE_ID;
    style.textContent = HOST_AD_HIDE_CSS;
    document.documentElement.appendChild(style);
  };

  const getWatchId = () => {
    const match = location.pathname.match(/\/watch\/([a-z0-9]+)/i);
    return match ? match[1] : '';
  };

  const parseCountText = (value) => {
    if (!value) return null;
    const text = String(value).replace(/[,，]/g, '').trim();
    if (!text) return null;
    const manMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*万/);
    if (manMatch) {
      const num = Number.parseFloat(manMatch[1]);
      return Number.isFinite(num) ? Math.round(num * 10000) : null;
    }
    const numMatch = text.match(/([0-9]+(?:\.[0-9]+)?)/);
    if (!numMatch) return null;
    const num = Number.parseFloat(numMatch[1]);
    return Number.isFinite(num) ? Math.round(num) : null;
  };

  const getCountFromSelector = (selector) => {
    const node = document.querySelector(selector);
    if (!node) return null;
    return parseCountText(node.textContent);
  };

  const isMetricsReasonable = (views, comments) => {
    if (!Number.isFinite(views) || !Number.isFinite(comments)) return false;
    if (views < 0 || comments < 0) return false;
    if (views === 0) return comments === 0;
    if (views >= 1000 && comments === 0) return false;
    if (comments > views * 2 && comments > 100) return false;
    if (views >= 10000 && comments * 1000 < views) return false;
    return true;
  };

  const normalizeLocaleValue = (value) => {
    if (value == null) return null;
    const text = String(value).trim();
    return text ? text : null;
  };

  const parseCookies = () => {
    const cookieString = document.cookie || '';
    const out = {};
    if (!cookieString) return out;
    for (const part of cookieString.split(';')) {
      const [rawName, ...rest] = part.split('=');
      if (!rawName) continue;
      const name = rawName.trim();
      const value = rest.join('=').trim();
      if (name) {
        out[name] = value;
      }
    }
    return out;
  };

  const readLocaleFromState = (source) => {
    if (!source || typeof source !== 'object') return null;
    return (
      normalizeLocaleValue(source.locale) ||
      normalizeLocaleValue(source.language) ||
      normalizeLocaleValue(source.region) ||
      normalizeLocaleValue(source.country) ||
      normalizeLocaleValue(source.lang) ||
      normalizeLocaleValue(source.account?.locale) ||
      normalizeLocaleValue(source.account?.country) ||
      normalizeLocaleValue(source.user?.locale) ||
      normalizeLocaleValue(source.user?.country) ||
      normalizeLocaleValue(source.auth?.user?.locale) ||
      normalizeLocaleValue(source.auth?.user?.country) ||
      normalizeLocaleValue(source.profile?.locale) ||
      normalizeLocaleValue(source.profile?.language)
    );
  };

  const getAccountLocaleFromState = () => {
    const candidates = [
      window.__INITIAL_STATE__,
      window.__PRELOADED_STATE__,
      window.__NUXT__,
      window.__STATE__,
      window.__APP_INITIAL_STATE__,
      window.__PRELOADED_APP_STATE__,
    ];
    for (const candidate of candidates) {
      const locale = readLocaleFromState(candidate);
      if (locale) return locale;
    }
    return null;
  };

  const readLocaleFromStorage = () => {
    try {
      const keys = ['nico_lang', 'nicovideo_locale', 'locale', 'lang'];
      for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value) return value;
      }
    } catch (err) {
      // localStorage might be restricted; ignore.
    }
    return null;
  };

  const getMetaLocale = () => {
    const selectors = [
      'meta[property="og:locale"]',
      'meta[name="locale"]',
      'meta[name="lang"]',
      'meta[name="content-language"]',
    ];
    for (const selector of selectors) {
      const meta = document.querySelector(selector);
      if (meta && meta.getAttribute('content')) {
        return meta.getAttribute('content');
      }
    }
    return null;
  };

  const getAccountLocale = () => {
    const now = Date.now();
    if (now - state.accountLocaleUpdatedAt < ACCOUNT_LOCALE_CACHE_MS && state.accountLocale) {
      return state.accountLocale;
    }
    const cookieLocale = parseCookies();
    const candidateList = [];
    const docLocale = document.documentElement.getAttribute('lang') || document.body.getAttribute('lang');
    if (docLocale) candidateList.push(docLocale);
    const metaLocale = getMetaLocale();
    if (metaLocale) candidateList.push(metaLocale);
    const cookieValue = cookieLocale.nico_lang || cookieLocale.nicovideo_locale || cookieLocale.locale || cookieLocale.lang;
    if (cookieValue) candidateList.push(cookieValue);
    const storageLocale = readLocaleFromStorage();
    if (storageLocale) candidateList.push(storageLocale);
    const stateLocale = getAccountLocaleFromState();
    if (stateLocale) candidateList.push(stateLocale);
    const navLocale = (navigator.languages && navigator.languages[0]) || navigator.language;
    if (navLocale) candidateList.push(navLocale);
    const locale = candidateList.map(normalizeLocaleValue).find(Boolean) || null;
    state.accountLocale = locale;
    state.accountLocaleUpdatedAt = now;
    return state.accountLocale;
  };

  const isJapaneseAccount = () => {
    const locale = getAccountLocale();
    if (!locale) return false;
    return JAPANESE_LOCALE_RE.test(locale);
  };

  const getMetricsStatus = () => {
    const now = Date.now();
    if (now - state.metrics.updatedAt < METRICS_CACHE_MS) {
      return state.metrics;
    }
    const views = getCountFromSelector(VIEW_COUNT_SELECTOR);
    const comments = getCountFromSelector(COMMENT_COUNT_SELECTOR);
    let status = 'unknown';
    if (Number.isFinite(views) && Number.isFinite(comments)) {
      status = isMetricsReasonable(views, comments) ? 'normal' : 'abnormal';
    }
    state.metrics = {
      status,
      views,
      comments,
      updatedAt: now,
    };
    return state.metrics;
  };

  const shouldUseEmbed = () => {
    const metrics = getMetricsStatus();
    const japaneseAccount = isJapaneseAccount();
    if (metrics.status === 'normal' && !japaneseAccount) {
      state.embedDecision = false;
    } else if (metrics.status === 'abnormal' || japaneseAccount) {
      state.embedDecision = true;
    } else if (state.embedDecision == null) {
      state.embedDecision = false;
    }
    return state.embedDecision === true;
  };

  const findLargestVideo = () => {
    const videos = Array.from(document.querySelectorAll('video'));
    let best = null;
    let bestArea = 0;
    for (const video of videos) {
      if (video.closest(AD_CONTAINER_SELECTOR)) continue;
      const title = (video.getAttribute('title') || '').toLowerCase();
      if (title === 'advertisement') continue;
      const area = (video.clientWidth || 0) * (video.clientHeight || 0);
      if (area > bestArea) {
        bestArea = area;
        best = video;
      }
    }
    return best;
  };

  const getNodeLabel = (node) => {
    if (!node) return '';
    return (node.getAttribute('aria-label') || node.textContent || '').trim();
  };

  const findAdSkipButton = () => {
    const candidates = document.querySelectorAll('button, [role="button"], a');
    for (const candidate of candidates) {
      const label = getNodeLabel(candidate);
      if (label && AD_SKIP_LABEL_RE.test(label)) {
        return candidate;
      }
    }
    return null;
  };

  const skipAdVideos = () => {
    const candidates = new Set();
    const adContainer = document.querySelector(AD_CONTAINER_SELECTOR);
    if (adContainer) {
      for (const video of adContainer.querySelectorAll('video')) {
        candidates.add(video);
      }
    }
    for (const video of document.querySelectorAll('video')) {
      const title = (video.getAttribute('title') || '').toLowerCase();
      if (title === 'advertisement') {
        candidates.add(video);
      }
    }
    for (const video of candidates) {
      if (!Number.isFinite(video.duration) || video.duration <= 0) continue;
      if (video.currentTime >= video.duration - 0.3) continue;
      try {
        video.currentTime = Math.max(0, video.duration - 0.1);
      } catch (err) {
        // Ignore seek errors.
      }
    }
  };

  const runOriginalAdSkip = () => {
    if (shouldUseEmbed()) return;
    const skipButton = findAdSkipButton();
    if (skipButton) {
      try {
        skipButton.click();
      } catch (err) {
        // Ignore click errors.
      }
    }
    skipAdVideos();
  };

  const setupOriginalAdSkip = () => {
    const scan = () => {
      runOriginalAdSkip();
    };
    const observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const intervalId = window.setInterval(scan, AD_SKIP_SCAN_INTERVAL);

    window.addEventListener(
      'pagehide',
      () => {
        observer.disconnect();
        clearInterval(intervalId);
      },
      { once: true }
    );

    scan();
  };

  const findPlayerHost = () => {
    const stage = document.querySelector(STAGE_HIDE_SELECTOR);
    if (stage && stage.parentElement) {
      return stage.parentElement;
    }

    const presenter = document.querySelector(PLAYER_PRESENTER_SELECTOR);
    if (presenter) {
      const frame = presenter.querySelector(VIDEO_FRAME_SELECTOR);
      if (frame && frame.parentElement) {
        return frame.parentElement;
      }
    }

    const video = findLargestVideo();
    if (!video) return null;
    return (
      video.closest('[data-scope="menu"][data-part="context-trigger"]') ||
      video.closest('[class*="asp_16:9"]') ||
      video.parentElement
    );
  };

  const muteOriginalVideos = (host) => {
    const videos = host.querySelectorAll('video');
    for (const video of videos) {
      if (!state.mutedVideos.has(video)) {
        state.mutedVideos.set(video, {
          muted: video.muted,
          volume: video.volume,
        });
      }
      try {
        video.muted = true;
        video.volume = 0;
        if (!video.paused) {
          video.pause();
        }
      } catch (err) {
        // Ignore media state errors while swapping the player.
      }
    }
  };

  const restoreOriginalVideos = () => {
    for (const [video, info] of state.mutedVideos) {
      if (!video || !video.isConnected) continue;
      try {
        video.muted = info.muted;
        if (Number.isFinite(info.volume)) {
          video.volume = info.volume;
        }
      } catch (err) {
        // Ignore media state errors while restoring.
      }
    }
    state.mutedVideos.clear();
  };

  const removeEmbed = () => {
    restoreOriginalVideos();
    if (state.wrapper && state.wrapper.parentNode) {
      state.wrapper.parentNode.removeChild(state.wrapper);
    }
    restoreSettingsButton();
    if (state.controls && state.controls.parentNode) {
      state.controls.parentNode.removeChild(state.controls);
    }
    if (state.host) {
      state.host.classList.remove(EMBED_HOST_CLASS);
    }
    state.host = null;
    state.wrapper = null;
    state.iframe = null;
    state.watchId = '';
    state.controls = null;
    state.controlsVisible = false;
    state.rateSentValue = null;
    state.rateSentWatchId = '';
  };

  const ensureControlsHost = (host) => {
    if (state.controls && state.controls.parentElement === host) {
      return state.controls;
    }
    if (state.controls && state.controls.parentNode) {
      state.controls.parentNode.removeChild(state.controls);
    }
    const controls = document.createElement('div');
    controls.className = EMBED_CONTROLS_CLASS;
    controls.style.setProperty('--nef-embed-fade', `${state.controlsFadeMs}ms`);
    controls.style.setProperty('--nef-embed-ease', state.controlsEase);
    if (state.controlsVisible) {
      controls.classList.add(EMBED_CONTROLS_VISIBLE_CLASS);
    }
    host.appendChild(controls);
    state.controls = controls;
    return controls;
  };

  const restoreSettingsButton = () => {
    const button = state.settingsButton;
    const home = state.settingsButtonHome;
    if (!button || !home || !home.parent) {
      state.settingsButton = null;
      state.settingsButtonHome = null;
      return;
    }
    if (home.nextSibling && home.nextSibling.parentElement === home.parent) {
      home.parent.insertBefore(button, home.nextSibling);
    } else {
      home.parent.appendChild(button);
    }
    state.settingsButton = null;
    state.settingsButtonHome = null;
  };

  const findSettingsButton = (root) => {
    if (!root) return null;
    const buttons = Array.from(root.querySelectorAll('button[data-watch-floating-panel="trigger"]'));
    for (const button of buttons) {
      const label = (button.getAttribute('aria-label') || '').trim();
      if (SETTINGS_LABEL_RE.test(label)) return button;
    }
    for (const button of root.querySelectorAll('button')) {
      const label = (button.getAttribute('aria-label') || '').trim();
      if (SETTINGS_LABEL_RE.test(label)) return button;
    }
    return null;
  };

  const findFullscreenButton = (root) => {
    if (!root) return null;
    for (const button of root.querySelectorAll('button[aria-label]')) {
      const label = (button.getAttribute('aria-label') || '').trim();
      if (FULLSCREEN_LABEL_RE.test(label)) return button;
    }
    return null;
  };

  const positionControls = (host, settingsButton, fullscreenButton) => {
    if (!state.controls || !host || !fullscreenButton || !settingsButton) return;
    const hostRect = host.getBoundingClientRect();
    const fullscreenRect = fullscreenButton.getBoundingClientRect();
    const settingsRect = settingsButton.getBoundingClientRect();
    if (!hostRect.width || !hostRect.height || !settingsRect.width) return;
    const left = fullscreenRect.left - hostRect.left - settingsRect.width - SETTINGS_BUTTON_GAP;
    const top = fullscreenRect.top - hostRect.top;
    state.controls.style.left = `${Math.max(0, Math.round(left))}px`;
    state.controls.style.top = `${Math.max(0, Math.round(top))}px`;
  };

  const ensureSettingsButton = (host) => {
    if (state.settingsButton && !state.settingsButton.isConnected) {
      state.settingsButton = null;
      state.settingsButtonHome = null;
    }
    const root = host.closest(PLAYER_PRESENTER_SELECTOR) || document;
    const settingsButton = findSettingsButton(root);
    const fullscreenButton = findFullscreenButton(root);
    if (!settingsButton || !fullscreenButton) return;
    const controls = ensureControlsHost(host);
    if (state.settingsButton !== settingsButton) {
      state.settingsButton = settingsButton;
      state.settingsButtonHome = {
        parent: settingsButton.parentElement,
        nextSibling: settingsButton.nextSibling,
      };
    }
    if (!controls.contains(settingsButton)) {
      controls.appendChild(settingsButton);
    }
    positionControls(host, settingsButton, fullscreenButton);
  };

  const parseRateValue = (value) => {
    if (!value) return null;
    const match = String(value).match(/([0-9]+(?:\.[0-9]+)?)/);
    if (!match) return null;
    const rate = Number.parseFloat(match[1]);
    return Number.isFinite(rate) ? rate : null;
  };

  const normalizeRateValue = (value) => {
    const rate = parseRateValue(value);
    if (!Number.isFinite(rate)) return null;
    return Math.round(rate * 100) / 100;
  };

  const isUnlockedRateValue = (rate) =>
    RATE_UNLOCK_OPTIONS.some((option) => Math.abs(option.rate - rate) < 0.01);

  const enableRateNode = (node) => {
    if (!node) return false;
    let changed = false;
    if (node.disabled) {
      node.disabled = false;
      changed = true;
    }
    if (node.hasAttribute('disabled')) {
      node.removeAttribute('disabled');
      changed = true;
    }
    if (node.getAttribute('aria-disabled') === 'true') {
      node.removeAttribute('aria-disabled');
      changed = true;
    }
    if (node.hasAttribute('data-disabled')) {
      node.removeAttribute('data-disabled');
      changed = true;
    }
    if (node.dataset && node.dataset.state === 'disabled') {
      node.dataset.state = 'unchecked';
      changed = true;
    }
    return changed;
  };

  const ensureRateSelectOptions = (select) => {
    if (!select) return false;
    let changed = false;
    const options = Array.from(select.options || []);
    const byRate = new Map();
    for (const option of options) {
      const rate = normalizeRateValue(option.value || option.textContent);
      if (!Number.isFinite(rate)) continue;
      if (!byRate.has(rate)) {
        byRate.set(rate, option);
      }
    }
    for (const option of RATE_UNLOCK_OPTIONS) {
      const existing = byRate.get(option.rate);
      if (existing) {
        if (enableRateNode(existing)) changed = true;
        if (existing.value !== option.value) {
          existing.value = option.value;
          changed = true;
        }
        if ((existing.textContent || '').trim() !== option.label) {
          existing.textContent = option.label;
          changed = true;
        }
        continue;
      }
      const entry = document.createElement('option');
      entry.value = option.value;
      entry.textContent = option.label;
      let inserted = false;
      const currentOptions = Array.from(select.options || []);
      for (const current of currentOptions) {
        const currentRate = normalizeRateValue(current.value || current.textContent);
        if (!Number.isFinite(currentRate)) continue;
        if (currentRate < option.rate) {
          select.insertBefore(entry, current);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        select.appendChild(entry);
      }
      changed = true;
    }
    return changed;
  };

  const unlockRateMenuItems = (select) => {
    if (!select) return false;
    const root = select.closest('[data-scope="select"]') || select.parentElement;
    if (!root) return false;
    const trigger = root.querySelector('button[aria-controls]') || root.querySelector('button[role="combobox"]');
    if (!trigger) return false;
    const contentId = trigger.getAttribute('aria-controls');
    if (!contentId) return false;
    const content = document.getElementById(contentId);
    if (!content) return false;
    const items = Array.from(content.querySelectorAll('[role="option"], [data-part="item"]'));
    if (!items.length) return false;
    let changed = false;
    for (const item of items) {
      const rate = normalizeRateValue(item.getAttribute('data-value') || item.textContent);
      if (!Number.isFinite(rate)) continue;
      if (!isUnlockedRateValue(rate)) continue;
      if (enableRateNode(item)) changed = true;
    }
    return changed;
  };

  const getRateFromSelect = (select) => {
    if (!select) return null;
    const option = select.selectedOptions && select.selectedOptions[0];
    const raw = option ? option.value || option.textContent : select.value;
    return parseRateValue(raw);
  };

  const isRateSelect = (select) => {
    if (!select) return false;
    const root = select.closest('[data-scope="select"]') || select.parentElement;
    if (root) {
      const trigger = root.querySelector('button[aria-label]');
      if (trigger) {
        const label = trigger.getAttribute('aria-label') || '';
        if (RATE_LABEL_RE.test(label)) return true;
      }
      const rowLabel = root.closest('.d_flex')?.querySelector('span');
      if (rowLabel && RATE_LABEL_RE.test(rowLabel.textContent || '')) {
        return true;
      }
    }
    return false;
  };

  const findRateSelect = (root) => {
    if (!root) return null;
    const trigger = root.querySelector('button[aria-label*="再生速度"]');
    if (trigger) {
      const scope = trigger.closest('[data-scope="select"]');
      const select = scope ? scope.querySelector('select') : null;
      if (select) return select;
    }
    const selects = Array.from(root.querySelectorAll('select'));
    for (const select of selects) {
      if (isRateSelect(select)) return select;
    }
    return null;
  };

  const findSelectTriggerByContentId = (contentId) => {
    if (!contentId) return null;
    const triggers = document.querySelectorAll('button[aria-controls]');
    for (const trigger of triggers) {
      if (trigger.getAttribute('aria-controls') === contentId) {
        return trigger;
      }
    }
    return null;
  };

  const getRateSelectContextFromItem = (item) => {
    const content = item.closest('[data-part="content"], [role="listbox"]');
    if (!content || !content.id) return null;
    const trigger = findSelectTriggerByContentId(content.id);
    if (!trigger) return null;
    const root = trigger.closest('[data-scope="select"]') || trigger.parentElement;
    const select = root ? root.querySelector('select') : null;
    if (!select || !isRateSelect(select)) return null;
    return { select, trigger, root, content };
  };

  const updateRateSelectUi = (select, rate) => {
    if (!select) return false;
    const normalized = normalizeRateValue(rate);
    if (!Number.isFinite(normalized)) return false;
    const options = Array.from(select.options || []);
    let matched = null;
    for (const option of options) {
      const optionRate = normalizeRateValue(option.value || option.textContent);
      if (!Number.isFinite(optionRate)) continue;
      if (Math.abs(optionRate - normalized) < 0.01) {
        matched = option;
        break;
      }
    }
    if (!matched) return false;
    matched.selected = true;
    select.value = matched.value;
    const root = select.closest('[data-scope="select"]') || select.parentElement;
    const valueText = root ? root.querySelector('[data-part="value-text"]') : null;
    if (valueText) {
      valueText.textContent = matched.textContent || matched.value;
    }
    const trigger = root ? root.querySelector('button[aria-controls], button[role="combobox"]') : null;
    const contentId = trigger ? trigger.getAttribute('aria-controls') : null;
    const content = contentId ? document.getElementById(contentId) : null;
    if (content) {
      const items = Array.from(content.querySelectorAll('[role="option"], [data-part="item"]'));
      for (const item of items) {
        const itemRate = normalizeRateValue(item.getAttribute('data-value') || item.textContent);
        if (!Number.isFinite(itemRate)) continue;
        const isSelected = Math.abs(itemRate - normalized) < 0.01;
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (item.hasAttribute('data-state')) {
          item.dataset.state = isSelected ? 'checked' : 'unchecked';
        }
      }
    }
    return true;
  };

  const sendRateToEmbed = (rate, force) => {
    if (!state.iframe || !state.iframe.contentWindow) return;
    if (!Number.isFinite(rate)) return;
    if (!force && state.rateSentValue === rate && state.rateSentWatchId === state.watchId) {
      return;
    }
    state.iframe.contentWindow.postMessage({ type: RATE_MESSAGE, rate }, `https://${EMBED_HOST}`);
    state.rateSentValue = rate;
    state.rateSentWatchId = state.watchId;
  };

  const setRateValue = (rate) => {
    if (!Number.isFinite(rate)) return;
    if (state.rateValue === rate) return;
    state.rateValue = rate;
    sendRateToEmbed(rate, true);
  };

  const syncRateFromDom = () => {
    const panel = document.querySelector(SETTINGS_PANEL_SELECTOR) || document;
    const select = findRateSelect(panel);
    if (select) {
      ensureRateSelectOptions(select);
      unlockRateMenuItems(select);
      const rate = getRateFromSelect(select);
      if (Number.isFinite(rate)) {
        setRateValue(rate);
      }
      return;
    }
    const video = findLargestVideo();
    if (video && Number.isFinite(video.playbackRate)) {
      setRateValue(video.playbackRate);
    }
  };

  const setupPlaybackRateSync = () => {
    let scanTimer = null;
    const scheduleScan = () => {
      if (scanTimer) return;
      scanTimer = window.setTimeout(() => {
        scanTimer = null;
        syncRateFromDom();
      }, RATE_SCAN_DELAY);
    };

    const onChange = (event) => {
      const target = event.target;
      if (!target || target.tagName !== 'SELECT') return;
      if (!isRateSelect(target)) return;
      const rate = getRateFromSelect(target);
      if (Number.isFinite(rate)) {
        setRateValue(rate);
      }
    };

    const onClick = (event) => {
      const target = event.target;
      if (!target || typeof target.closest !== 'function') return;
      const item = target.closest('[role="option"], [data-part="item"]');
      if (!item) return;
      const rate = normalizeRateValue(item.getAttribute('data-value') || item.textContent);
      if (!Number.isFinite(rate) || !isUnlockedRateValue(rate)) return;
      const context = getRateSelectContextFromItem(item);
      if (!context) return;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
      ensureRateSelectOptions(context.select);
      updateRateSelectUi(context.select, rate);
      setRateValue(rate);
      if (context.trigger && context.trigger.getAttribute('aria-expanded') === 'true') {
        window.setTimeout(() => {
          try {
            context.trigger.click();
          } catch (err) {
            // Ignore close errors.
          }
        }, 0);
      }
    };

    document.addEventListener('change', onChange, true);
    document.addEventListener('click', onClick, true);

    const observer = new MutationObserver(scheduleScan);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener(
      'pagehide',
      () => {
        document.removeEventListener('change', onChange, true);
        document.removeEventListener('click', onClick, true);
        observer.disconnect();
        if (scanTimer) clearTimeout(scanTimer);
      },
      { once: true }
    );

    scheduleScan();
  };

  const setControlsVisibility = (visible, fadeMs, ease) => {
    state.controlsVisible = Boolean(visible);
    if (Number.isFinite(fadeMs) && fadeMs >= 0) {
      state.controlsFadeMs = fadeMs;
    }
    if (ease) {
      state.controlsEase = ease;
    }
    if (!state.controls) return;
    state.controls.style.setProperty('--nef-embed-fade', `${state.controlsFadeMs}ms`);
    state.controls.style.setProperty('--nef-embed-ease', state.controlsEase);
    state.controls.classList.toggle(EMBED_CONTROLS_VISIBLE_CLASS, state.controlsVisible);
  };

  const setupEmbedControlListener = () => {
    const onMessage = (event) => {
      if (event.origin !== `https://${EMBED_HOST}`) return;
      if (state.iframe && event.source !== state.iframe.contentWindow) return;
      const data = event.data || {};
      if (data.type !== EMBED_CONTROL_MESSAGE) return;
      setControlsVisibility(data.visible, data.fadeMs, data.ease);
    };
    window.addEventListener('message', onMessage);
    window.addEventListener(
      'pagehide',
      () => {
        window.removeEventListener('message', onMessage);
      },
      { once: true }
    );
  };

  const ensureEmbed = () => {
    const watchId = getWatchId();
    if (!watchId) return;
    if (state.pageWatchId !== watchId) {
      state.pageWatchId = watchId;
      state.embedDecision = null;
      state.metrics = {
        status: 'unknown',
        views: null,
        comments: null,
        updatedAt: 0,
      };
    }
    if (!shouldUseEmbed()) {
      if (state.host) {
        removeEmbed();
      }
      return;
    }
    const host = findPlayerHost();
    if (!host) return;

    ensureStyle();

    if (state.host && state.host !== host) {
      removeEmbed();
    }

    if (!state.host) {
      host.classList.add(EMBED_HOST_CLASS);
      const wrapper = document.createElement('div');
      wrapper.className = EMBED_WRAPPER_CLASS;
      const iframe = document.createElement('iframe');
      iframe.className = EMBED_IFRAME_CLASS;
      iframe.title = 'Niconico Embedded Player';
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.name = EMBED_FRAME_NAME;
      iframe.setAttribute(EMBED_FRAME_ATTR, 'watch');
      wrapper.appendChild(iframe);
      host.appendChild(wrapper);
      state.host = host;
      state.wrapper = wrapper;
      state.iframe = iframe;
    }

    const watchChanged = state.watchId !== watchId;
    const src = `https://${EMBED_HOST}/watch/${watchId}`;
    if (state.iframe && state.iframe.src !== src) {
      state.iframe.src = src;
    }
    state.watchId = watchId;
    if (watchChanged) {
      state.rateSentWatchId = '';
    }

    ensureSettingsButton(host);
    sendRateToEmbed(state.rateValue, watchChanged);
    muteOriginalVideos(host);
  };

  const whenReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const shouldApplyEmbedStyle = () => {
    if (window.top === window) return false;
    if (window.name === EMBED_FRAME_NAME) return true;
    try {
      const frame = window.frameElement;
      if (frame && frame.getAttribute(EMBED_FRAME_ATTR) === 'watch') return true;
      if (frame && frame.getAttribute('name') === EMBED_FRAME_NAME) return true;
    } catch (err) {
      // Ignore cross-origin access errors.
    }
    return false;
  };

  const runEmbedFrameStyle = () => {
    if (!shouldApplyEmbedStyle()) return;
    const style = document.createElement('style');
    style.textContent = EMBED_HIDE_CSS;
    document.documentElement.appendChild(style);
  };

  const parseTransitionMs = (value) => {
    if (!value) return null;
    const first = value.split(',')[0].trim();
    if (!first) return null;
    if (first.endsWith('ms')) {
      const num = Number.parseFloat(first);
      return Number.isFinite(num) ? num : null;
    }
    if (first.endsWith('s')) {
      const num = Number.parseFloat(first);
      return Number.isFinite(num) ? num * 1000 : null;
    }
    const num = Number.parseFloat(first);
    return Number.isFinite(num) ? num : null;
  };

  const parseTransitionEase = (value) => {
    if (!value) return null;
    return value.split(',')[0].trim() || null;
  };

  const setupEmbedControlNotifier = () => {
    if (!shouldApplyEmbedStyle()) return;
    const embedState = {
      lastVisible: null,
      lastFade: null,
      lastEase: null,
    };

    const sendState = (visible, fadeMs, ease) => {
      if (visible === embedState.lastVisible && fadeMs === embedState.lastFade && ease === embedState.lastEase) {
        return;
      }
      embedState.lastVisible = visible;
      embedState.lastFade = fadeMs;
      embedState.lastEase = ease;
      window.parent.postMessage(
        {
          type: EMBED_CONTROL_MESSAGE,
          visible,
          fadeMs,
          ease,
        },
        '*'
      );
    };

    const scan = () => {
      const control = document.querySelector(EMBED_CONTROL_SELECTOR);
      if (!control) {
        sendState(false, embedState.lastFade || EMBED_CONTROL_FADE_DEFAULT, embedState.lastEase || EMBED_CONTROL_EASE_DEFAULT);
        return;
      }
      const visible = control.classList.contains(EMBED_CONTROL_ACTIVE_CLASS);
      const style = window.getComputedStyle(control);
      const fadeMs = parseTransitionMs(style.transitionDuration) ?? EMBED_CONTROL_FADE_DEFAULT;
      const ease = parseTransitionEase(style.transitionTimingFunction) || EMBED_CONTROL_EASE_DEFAULT;
      sendState(visible, fadeMs, ease);
    };

    const observer = new MutationObserver(scan);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
    const intervalId = window.setInterval(scan, 400);

    window.addEventListener(
      'pagehide',
      () => {
        observer.disconnect();
        clearInterval(intervalId);
      },
      { once: true }
    );

    scan();
  };

  const applyEmbedRate = (rate) => {
    if (!Number.isFinite(rate)) return false;
    const video = findLargestVideo();
    if (!video) return false;
    try {
      if (video.playbackRate !== rate) {
        video.playbackRate = rate;
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  const setupEmbedRateListener = () => {
    if (!shouldApplyEmbedStyle()) return;
    const onMessage = (event) => {
      if (event.source !== window.parent) return;
      const data = event.data || {};
      if (data.type !== RATE_MESSAGE) return;
      const rate = Number(data.rate);
      if (!Number.isFinite(rate)) return;
      state.rateValue = rate;
      applyEmbedRate(rate);
    };

    window.addEventListener('message', onMessage);

    const observer = new MutationObserver(() => {
      if (!Number.isFinite(state.rateValue)) return;
      applyEmbedRate(state.rateValue);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const intervalId = window.setInterval(() => {
      if (!Number.isFinite(state.rateValue)) return;
      applyEmbedRate(state.rateValue);
    }, 500);

    window.addEventListener(
      'pagehide',
      () => {
        window.removeEventListener('message', onMessage);
        observer.disconnect();
        clearInterval(intervalId);
      },
      { once: true }
    );
  };

  if (location.hostname === EMBED_HOST) {
    whenReady(() => {
      runEmbedFrameStyle();
      setupEmbedControlNotifier();
      setupEmbedRateListener();
    });
    return;
  }

  whenReady(() => {
    ensureHostAdStyle();
    setupEmbedControlListener();
    setupPlaybackRateSync();
    setupOriginalAdSkip();
    ensureEmbed();
    const observer = new MutationObserver(ensureEmbed);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const intervalId = window.setInterval(ensureEmbed, UPDATE_INTERVAL);

    window.addEventListener(
      'pagehide',
      () => {
        observer.disconnect();
        clearInterval(intervalId);
      },
      { once: true }
    );
  });
})();
