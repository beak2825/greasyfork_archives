// ==UserScript==
// @name         MP自定义站点索引配置助手
// @author       wangzijian0@vip.qq.com
// @description  自动获取 RSS订阅 的分类并生成 NexusPHP JSON和Base64配置，搭配MoviePilot的 自定义索引站点 插件使用。
// @version      1.0.2
// @icon         data:image/gif;base64,R0lGODlhgAGAAZECAPr7/ERNVv///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5OTk5ODkxZS0wMWE2LTRlMTItYWM1Mi00YTIzMzI1MTViYjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkU2QTk5NkYxM0UzMTFFQzg5RkRCRTMwRTcyQUZCRjIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkU2QTk5NkUxM0UzMTFFQzg5RkRCRTMwRTcyQUZCRjIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOTQyMDFlMi00OGRjLTQ3OTgtOTFlNi05ZjkyNzhjNTJlZTUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMjk3YTUwZC00MTM4LWVmNDYtYTY3Ni1kZTkzNDU1ZjNmOTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRm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
// @match        https://*/*
// @match        http://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @namespace    https://greasyfork.org/users/1453515
// @downloadURL https://update.greasyfork.org/scripts/554748/MP%E8%87%AA%E5%AE%9A%E4%B9%89%E7%AB%99%E7%82%B9%E7%B4%A2%E5%BC%95%E9%85%8D%E7%BD%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554748/MP%E8%87%AA%E5%AE%9A%E4%B9%89%E7%AB%99%E7%82%B9%E7%B4%A2%E5%BC%95%E9%85%8D%E7%BD%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SECTION_NAME_MAP = new Map([
    ['分类', 'category'],
    ['类别', 'category'],
    ['類別', 'category'],
    ['分類', 'category'],
    ['类型', 'category'],
    ['類型', 'category'],
    ['檢索分類', 'category'],
    ['检索分类', 'category'],
    ['來源', 'source'],
    ['来源', 'source']
  ]);

  const STORAGE_KEYS = {
    togglerPosition: 'mp_custom_toggler_position',
    panelPosition: 'mp_custom_panel_position',
    customDesc: 'mp_custom_category_desc',
    togglerVisible: 'mp_custom_toggler_visible'
  };

  let customDescRaw = '';
  let customDescMap = new Map();
  let togglerPosition = null;
  let togglerVisible = true;
  let panelPosition = null;
  let panelDragging = false;
  const ALLOWED_PREFIX_RE = /^cat\d*$/i;
  const DEFAULT_SCHEMA = 'NexusPhp';
  const DEFAULT_ENCODING = 'UTF-8';
  const SECOND_LEVEL_TLDS = new Set(['co', 'com', 'net', 'org', 'gov', 'edu', 'ac']);
  const TOGGLER_DRAG_THRESHOLD_PX = 4;

  const CATEGORY_LOCALIZATION = new Map([
    ['movies', '电影'],
    ['movie', '电影'],
    ['tv series', '电视剧'],
    ['tv shows', '综艺'],
    ['tv show', '综艺'],
    ['animations', '动漫'],
    ['animation', '动漫'],
    ['documentaries', '纪录片'],
    ['documentary', '纪录片'],
    ['music videos', 'MV'],
    ['music video', 'MV'],
    ['music', '音乐'],
    ['misc', '音乐'],
    ['other', '其他'],
    ['3d', '3D'],
    ['sports', '体育'],
    ['sport', '体育'],
    ['photo', '写真'],
    ['Books', '书籍'],
    ['pc games', 'PC游戏'],
    ['pc game', 'PC游戏'],
    ['hqaudio', '音频'],
    ['hq audio', '音频']
  ]);

  const state = {
    panel: null,
    toggler: null,
    status: null,
    output: null,
    base64Output: null,
    generateBtn: null,
    copyJsonBtn: null,
    copyBase64Btn: null,
    jsonSplit: null,
    base64Split: null,
    customDescInput: null,
    typingTimeout: null,
    loadingCustomDesc: false,
    maximized: false,
    previousDimensions: null,
    inputs: {},
    toggleJsonBtn: null,
    toggleBase64Btn: null,
    customView: null,
    jsonView: null,
    base64View: null,
    activeView: 'custom'
  };

  const menuCommandHandles = [];
  let menuInitialized = false;

  function clamp(value, min, max) {
    if (Number.isNaN(value)) return min;
    if (max < min) return min;
    return Math.min(Math.max(value, min), max);
  }

  function constrainPanelPosition(left, top, width, height) {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || width;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || height;
    const maxLeft = Math.max(0, viewportWidth - width);
    const maxTop = Math.max(0, viewportHeight - height);
    return {
      left: clamp(left, 0, maxLeft),
      top: clamp(top, 0, maxTop)
    };
  }

  function constrainPanelWithinViewport() {
    if (!state.panel || state.maximized) return;
    const rect = state.panel.getBoundingClientRect();
    const width = rect.width || state.panel.offsetWidth || state.panel.clientWidth;
    const height = rect.height || state.panel.offsetHeight || state.panel.clientHeight;
    if (!width || !height) return;
    const { left, top } = constrainPanelPosition(rect.left, rect.top, width, height);
    state.panel.style.left = `${left}px`;
    state.panel.style.top = `${top}px`;
    state.panel.style.right = 'auto';
    state.panel.style.bottom = 'auto';
  }

  function cssEscape(ident) {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(ident);
    }
    return ident.replace(/[^\w-]/g, '\\$&');
  }

  function slugify(str) {
    if (!str) return 'section';
    return str
      .normalize('NFKC')
      .replace(/[:：]/g, '')
      .replace(/[\s\u00A0]+/g, '_')
      .replace(/[^\p{L}\p{N}_]+/gu, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase() || 'section';
  }

  function sanitizeTrackerName(raw) {
    if (!raw) return '';
    let name = raw;
    name = name.replace(/\s*(?:(?::|：){1,2}|-+)?\s*RSS\s*订阅.*$/i, '');
    name = name.split(/\s*::\s*/)[0];
    name = name.split(/\s*：：\s*/)[0];
    return name.trim();
  }

  function deriveTrackerName(hostname) {
    const separators = [' - ', ' | ', ' — ', ' – '];
    let candidate = sanitizeTrackerName(document.title || '');
    for (const separator of separators) {
      if (candidate.includes(separator)) {
        candidate = candidate.split(separator)[0];
        break;
      }
    }
    if (!candidate) {
      candidate = hostname;
    }
    return candidate.trim() || hostname;
  }

  function sanitizeTrackerId(raw) {
    return (raw || '').replace(/[^a-z0-9]+/gi, '').toLowerCase();
  }

  function parseToUrl(domain) {
    if (!domain) {
      throw new Error('Invalid domain');
    }
    try {
      return new URL(domain);
    } catch (error) {
      const trimmed = domain.trim();
      return new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    }
  }

  function normalizeDomainOrigin(domain) {
    const url = parseToUrl(domain);
    return `${url.protocol}//${url.host}`;
  }

  function normalizeHostname(domain) {
    const url = parseToUrl(domain);
    return url.hostname.replace(/^www\./i, '') || url.hostname;
  }

  function extractBaseDomain(domain) {
    const hostname = normalizeHostname(domain);
    if (!hostname) return '';
    const segments = hostname.split('.').filter(Boolean);
    if (segments.length <= 2) {
      return segments.join('.');
    }
    const secondLast = segments[segments.length - 2].toLowerCase();
    if (SECOND_LEVEL_TLDS.has(secondLast) && segments.length >= 3) {
      return segments.slice(-3).join('.');
    }
    return segments.slice(-2).join('.');
  }

  function deriveTrackerId(domain) {
    if (!domain) return '';
    const hostname = normalizeHostname(domain);
    const segments = hostname.split('.').filter(Boolean);
    let base = '';
    if (segments.length >= 2) {
      base = segments[segments.length - 2];
    } else {
      base = segments[0] || hostname;
    }
    return sanitizeTrackerId(base || hostname);
  }

  function encodeToBase64(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (error) {
      console.error('[NexusPHP RSS Config Helper] Base64 encode failed:', error);
      throw new Error('Base64 编码失败');
    }
  }

  function prettifyCustomKey(key) {
    if (!key) return '';
    let result = key.trim().replace(/_/g, ' ');
    result = result.replace(/(^|[\s/\-])([a-z])/g, (match, sep, char) => `${sep}${char.toUpperCase()}`);
    if (/\d/.test(result)) {
      result = result.replace(/[a-z]+/gi, (segment) => segment.toUpperCase());
    }
    return result.replace(/\s+/g, ' ').trim();
  }

  function getDefaultCustomDescText() {
    const pairs = new Map();
    CATEGORY_LOCALIZATION.forEach((value, key) => {
      if (!value) return;
      const formattedKey = prettifyCustomKey(key);
      if (!formattedKey || pairs.has(formattedKey)) return;
      pairs.set(formattedKey, value);
    });
    return Array.from(pairs.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
  }

  function createPanel() {
    if (state.panel) return;

    GM_addStyle(`
      :root {
        --tm-color-white: #ffffff;
        --tm-color-text: #1f2c46;
        --tm-color-subtle: #506690;
        --tm-color-primary: #4285f4;
        --tm-color-primary-dark: #1f63ff;
        --tm-color-secondary: #1f3f72;
        --tm-color-border: #dce4f7;
        --tm-color-surface: #f7f9ff;
        --tm-shadow-large: 0 18px 40px rgba(30, 60, 110, 0.16);
        --tm-shadow-medium: 0 12px 30px rgba(30, 60, 110, 0.12);
      }

      .tm-rss-panel {
        position: fixed;
        top: 24px;
        left: 24px;
        width: clamp(460px, 52vw, 720px);
        min-width: 360px;
        max-width: calc(100vw - 48px);
        max-height: calc(100vh - 48px);
        resize: horizontal;
        background: var(--tm-color-white);
        color: var(--tm-color-text);
        border-radius: 14px;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 99999;
        border: 1px solid var(--tm-color-border);
        box-shadow: var(--tm-shadow-large);
      }
      .tm-rss-panel.is-visible {
        display: flex;
      }
      .tm-rss-panel.is-maximized {
        left: 12px !important;
        top: 12px !important;
        right: 12px !important;
        bottom: 12px !important;
        width: auto !important;
        height: auto !important;
        max-width: calc(100vw - 24px) !important;
        max-height: calc(100vh - 24px) !important;
        border-radius: 10px;
        box-shadow: none;
        resize: none;
      }
      .tm-rss-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 20px;
        border-bottom: 1px solid var(--tm-color-border);
        background: linear-gradient(135deg, rgba(66, 133, 244, 0.08), rgba(66, 133, 244, 0.02));
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.2px;
        cursor: move;
      }
      .tm-rss-close {
        background: none;
        border: none;
        color: var(--tm-color-subtle);
        font-size: 20px;
        cursor: pointer;
        padding: 0 4px;
        transition: transform 0.25s ease, color 0.25s ease;
      }
      .tm-rss-close:hover {
        transform: rotate(90deg);
        color: var(--tm-color-primary);
      }
      .tm-rss-body {
        padding: 18px 22px 22px;
        overflow-y: auto;
        background: var(--tm-color-white);
      }
      .tm-rss-layout {
        display: grid;
        grid-template-columns: minmax(220px, 230px) minmax(380px, 1fr);
        column-gap: 20px;
        row-gap: 12px;
        margin-bottom: 18px;
        align-items: start;
      }
      .tm-rss-panel.is-maximized .tm-rss-layout {
        grid-template-columns: minmax(220px, 230px) minmax(540px, 1fr);
        column-gap: 24px;
        row-gap: 16px;
      }
      .tm-rss-column {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .tm-rss-column--custom {
        height: auto;
        margin-left: 0;
      }
      .tm-rss-panel.is-maximized .tm-rss-column--custom {
        margin-left: 0;
      }
      .tm-rss-field label {
        font-size: 13px;
        letter-spacing: 0.3px;
        font-weight: 600;
        color: var(--tm-color-subtle);
      }
      .tm-rss-field input[type="text"],
      .tm-rss-field input[type="url"] {
        border-radius: 8px;
        border: 1px solid var(--tm-color-border);
        background: var(--tm-color-surface);
        color: var(--tm-color-text);
        padding: 9px 12px;
        font-size: 13px;
        transition: border 0.15s ease, box-shadow 0.15s ease;
        width: 100%;
        box-sizing: border-box;
      }
      .tm-rss-field textarea {
        border-radius: 8px;
        border: 1px solid var(--tm-color-border);
        background: var(--tm-color-surface);
        color: var(--tm-color-text);
        width: 100%;
        padding: 10px 12px;
        box-sizing: border-box;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: inherit;
        font-size: 12px;
        resize: vertical;
        line-height: 1.45;
        transition: border 0.15s ease, box-shadow 0.15s ease;
        min-height: 286px;
      }
      .tm-rss-field input[type="text"]:focus,
      .tm-rss-field input[type="url"]:focus,
      .tm-rss-field textarea:focus {
        border-color: var(--tm-color-primary);
        outline: none;
        box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.16);
      }
      .tm-rss-field input[type="checkbox"] {
        vertical-align: middle;
      }
      .tm-rss-hint {
        display: block;
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
        color: var(--tm-color-subtle);
      }
      .tm-rss-actions {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin: 6px 0 12px;
        align-items: stretch;
      }
      .tm-rss-actions > * {
        display: flex;
        min-width: 0;
      }
      .tm-rss-actions button {
        flex: 1 1 auto;
        border: none;
        border-radius: 999px;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .tm-rss-actions .tm-generate {
        background: linear-gradient(135deg, var(--tm-color-primary), var(--tm-color-primary-dark));
        color: #ffffff;
      }
      .tm-rss-actions button:hover {
        transform: translateY(-1px);
        box-shadow: var(--tm-shadow-medium);
        border-color: transparent;
      }
      .tm-rss-split {
        display: inline-flex;
        align-items: stretch;
        border: 1px solid var(--tm-color-border);
        border-radius: 999px;
        overflow: hidden;
        background: var(--tm-color-white);
        flex: 1 1 auto;
        min-width: 0;
      }
      .tm-rss-split button {
        border: none;
        background: transparent;
        padding: 9px 16px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        color: var(--tm-color-primary);
        transition: background 0.15s ease, color 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
      }
      .tm-rss-split button + button {
        border-left: 1px solid var(--tm-color-border);
      }
      .tm-rss-split button:first-child {
        border-radius: 999px 0 0 999px;
      }
      .tm-rss-split button:last-child {
        border-radius: 0 999px 999px 0;
      }
      .tm-rss-split .tm-copy {
        background: rgba(66, 133, 244, 0.08);
        color: var(--tm-color-primary);
      }
      .tm-rss-split .tm-toggle {
        background: transparent;
        color: var(--tm-color-secondary);
      }
      .tm-rss-split button:hover {
        background: rgba(66, 133, 244, 0.12);
        color: var(--tm-color-primary);
      }
      .tm-rss-split.is-active {
        border-color: rgba(66, 133, 244, 0.45);
        background: rgba(66, 133, 244, 0.08);
      }
      .tm-rss-split.is-active .tm-toggle {
        color: var(--tm-color-primary);
      }
      .tm-rss-status {
        min-height: 20px;
        font-size: 12px;
        color: var(--tm-color-secondary);
        margin-bottom: 10px;
        letter-spacing: 0.3px;
      }
      .tm-rss-field--views {
        position: relative;
      }
      .tm-rss-views {
        position: relative;
        min-height: 260px;
      }
      .tm-rss-view {
        display: none;
        flex-direction: column;
        gap: 8px;
      }
      .tm-rss-view.is-active {
        display: flex;
      }
      .tm-rss-view label {
        font-size: 13px;
        letter-spacing: 0.3px;
        font-weight: 600;
        color: var(--tm-color-subtle);
      }
      .tm-rss-view .tm-rss-hint {
        display: block;
        font-size: 11px;
        opacity: 0.7;
        margin-top: -2px;
        color: var(--tm-color-subtle);
      }
      .tm-rss-output,
      .tm-rss-base64 {
        width: 100%;
        padding: 10px 12px;
        box-sizing: border-box;
        min-height: 286px;
        border-radius: 8px;
        border: 1px solid var(--tm-color-border);
        background: var(--tm-color-surface);
        color: var(--tm-color-text);
        font-size: 12px;
        line-height: 1.45;
        resize: vertical;
        transition: border 0.15s ease, box-shadow 0.15s ease;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: inherit;
      }
      .tm-rss-toggler {
        position: fixed;
        left: 28px;
        bottom: 32px;
        width: 48px;
        height: 48px;
        background: #ffffff;
        color: #4a5568;
        border: 1px solid rgba(79, 84, 101, 0.25);
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99998;
        cursor: grab;
        transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
      }
      .tm-rss-toggler:hover {
        background: #f3f6ff;
        color: #1f2c46;
        border-color: rgba(66, 133, 244, 0.35);
      }
      .tm-rss-toggler.is-dragging {
        cursor: grabbing;
        background: #e2e8f6;
        border-color: rgba(66, 133, 244, 0.4);
      }
      .tm-rss-toggler-icon {
        display: inline-flex;
        width: 20px;
        height: 20px;
        align-items: center;
        justify-content: center;
      }
      .tm-rss-toggler svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
      @media (max-width: 640px) {
        .tm-rss-panel {
          right: 12px;
          left: 12px;
          width: auto;
        }
      }
    `);

    state.panel = document.createElement('div');
    state.panel.className = 'tm-rss-panel';
    state.panel.innerHTML = `
      <div class="tm-rss-header">
        <span>MP自定义站点索引配置生成</span>
        <button type="button" class="tm-rss-close" aria-label="Close">×</button>
      </div>
      <div class="tm-rss-body">
        <div class="tm-rss-layout">
          <div class="tm-rss-column">
            <div class="tm-rss-field">
              <label for="tm-field-schema">架构 Schema</label>
              <input id="tm-field-schema" type="text" data-field="schema" placeholder="NexusPhp" value="${DEFAULT_SCHEMA}">
            </div>
            <div class="tm-rss-field">
              <label for="tm-field-tracker-id">标识 ID</label>
              <input id="tm-field-tracker-id" type="text" data-field="trackerId" placeholder="example">
            </div>
            <div class="tm-rss-field">
              <label for="tm-field-tracker-name">名称 Name</label>
              <input id="tm-field-tracker-name" type="text" data-field="trackerName" placeholder="站点名称">
            </div>
            <div class="tm-rss-field">
              <label for="tm-field-domain">域名 Domain</label>
              <input id="tm-field-domain" type="url" data-field="domain" placeholder="https://example.com">
            </div>
            <div class="tm-rss-field">
              <label for="tm-field-encoding">字符编码 Encoding</label>
              <input id="tm-field-encoding" type="text" data-field="encoding" placeholder="UTF-8" value="${DEFAULT_ENCODING}">
            </div>
          </div>
          <div class="tm-rss-column tm-rss-column--custom">
            <div class="tm-rss-field tm-rss-field--views">
              <div class="tm-rss-views">
                <div class="tm-rss-view is-active" data-view="custom">
                  <label for="tm-field-custom-desc">自定义分类描述</label>
                  <span class="tm-rss-hint">自动读取全站分类，“id:cat=desc”，可编辑翻译</span>
                  <textarea id="tm-field-custom-desc" data-field="customDesc" placeholder="Movies=电影&#10;401:movies=电影"></textarea>
                </div>
                <div class="tm-rss-view" data-view="json">
                  <label for="tm-field-json-output">JSON 输出</label>
                  <span class="tm-rss-hint">生成后可在此查看并复制 JSON 配置内容。</span>
                  <textarea id="tm-field-json-output" class="tm-rss-output" readonly></textarea>
                </div>
                <div class="tm-rss-view" data-view="base64">
                  <label for="tm-field-base64-output">Base64 输出</label>
                  <span class="tm-rss-hint">生成后可在此查看并复制 Base64 编码配置。</span>
                  <textarea id="tm-field-base64-output" class="tm-rss-base64" readonly></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tm-rss-actions">
          <button type="button" class="tm-generate">生成</button>
          <div class="tm-rss-split tm-rss-split--json">
            <button type="button" class="tm-copy tm-copy-json">复制 JSON</button>
            <button type="button" class="tm-toggle tm-toggle-json">查看 JSON</button>
          </div>
          <div class="tm-rss-split tm-rss-split--base64">
            <button type="button" class="tm-copy tm-copy-base64">复制 Base64</button>
            <button type="button" class="tm-toggle tm-toggle-base64">查看 Base64</button>
          </div>
        </div>
        <div class="tm-rss-status"></div>
      </div>
    `;

    document.body.appendChild(state.panel);

    state.status = state.panel.querySelector('.tm-rss-status');
    state.output = state.panel.querySelector('.tm-rss-output');
    state.base64Output = state.panel.querySelector('.tm-rss-base64');
    state.generateBtn = state.panel.querySelector('.tm-generate');
    state.copyJsonBtn = state.panel.querySelector('.tm-copy-json');
    state.copyBase64Btn = state.panel.querySelector('.tm-copy-base64');
    state.toggleJsonBtn = state.panel.querySelector('.tm-toggle-json');
    state.toggleBase64Btn = state.panel.querySelector('.tm-toggle-base64');
    state.jsonSplit = state.panel.querySelector('.tm-rss-split--json');
    state.base64Split = state.panel.querySelector('.tm-rss-split--base64');
    state.customView = state.panel.querySelector('.tm-rss-view[data-view="custom"]');
    state.jsonView = state.panel.querySelector('.tm-rss-view[data-view="json"]');
    state.base64View = state.panel.querySelector('.tm-rss-view[data-view="base64"]');
    state.customDescInput = state.panel.querySelector('[data-field="customDesc"]');

    state.inputs.schema = state.panel.querySelector('[data-field="schema"]');
    state.inputs.trackerId = state.panel.querySelector('[data-field="trackerId"]');
    state.inputs.trackerName = state.panel.querySelector('[data-field="trackerName"]');
    state.inputs.domain = state.panel.querySelector('[data-field="domain"]');
    state.inputs.encoding = state.panel.querySelector('[data-field="encoding"]');

    const closeBtn = state.panel.querySelector('.tm-rss-close');
    closeBtn.addEventListener('click', hidePanel);
    const header = state.panel.querySelector('.tm-rss-header');
    enablePanelDrag(header);
    header.addEventListener('dblclick', handleHeaderDoubleClick);

    state.generateBtn.addEventListener('click', handleGenerate);
    state.copyJsonBtn.addEventListener('click', handleCopyJson);
    state.copyBase64Btn.addEventListener('click', handleCopyBase64);
    if (state.toggleJsonBtn) {
      state.toggleJsonBtn.addEventListener('click', () => {
        handleToggleView('json');
      });
    }
    if (state.toggleBase64Btn) {
      state.toggleBase64Btn.addEventListener('click', () => {
        handleToggleView('base64');
      });
    }
    if (state.customDescInput) {
      state.customDescInput.value = customDescRaw || '';
      state.customDescInput.addEventListener('change', handleCustomDescChange);
      state.customDescInput.addEventListener('input', handleCustomDescInput);
    }

    const host = location.hostname;
    state.inputs.trackerId.value = deriveTrackerId(host);
    state.inputs.trackerName.value = deriveTrackerName(host);
    state.inputs.domain.value = location.origin.endsWith('/') ? location.origin : `${location.origin}`;
    applyPanelPosition();
    setActiveView('custom');
  }

  function ensurePanelVisible() {
    createPanel();
    refreshCustomDescValue(true).catch((error) => {
      console.warn('[NexusPHP RSS Config Helper] Failed to refresh custom descriptions', error);
    });
    state.panel.classList.add('is-visible');
    requestAnimationFrame(constrainPanelWithinViewport);
  }

  function hidePanel() {
    if (!state.panel) return;
    state.panel.classList.remove('is-visible');
  }

  function isPanelVisible() {
    return Boolean(state.panel && state.panel.classList.contains('is-visible'));
  }

  function updateToggleButtonStates() {
    if (state.toggleJsonBtn) {
      const active = state.activeView === 'json';
      state.toggleJsonBtn.textContent = active ? '返回 分类描述' : '查看 JSON';
      if (state.jsonSplit) {
        state.jsonSplit.classList.toggle('is-active', active);
      }
    }
    if (state.toggleBase64Btn) {
      const active = state.activeView === 'base64';
      state.toggleBase64Btn.textContent = active ? '返回 分类描述' : '查看 Base64';
      if (state.base64Split) {
        state.base64Split.classList.toggle('is-active', active);
      }
    }
  }

  function setActiveView(view) {
    if (!state.customView || !state.jsonView || !state.base64View) return;
    const allowed = new Set(['custom', 'json', 'base64']);
    const target = allowed.has(view) ? view : 'custom';
    state.customView.classList.toggle('is-active', target === 'custom');
    state.jsonView.classList.toggle('is-active', target === 'json');
    state.base64View.classList.toggle('is-active', target === 'base64');
    state.activeView = target;
    updateToggleButtonStates();
  }

  function handleToggleView(view) {
    if (state.activeView === view) {
      setActiveView('custom');
    } else {
      setActiveView(view);
    }
  }

  function applyTogglerVisibility(visible) {
    if (!state.toggler) return;
    if (visible) {
      state.toggler.style.display = '';
      state.toggler.removeAttribute('aria-hidden');
    } else {
      state.toggler.style.display = 'none';
      state.toggler.setAttribute('aria-hidden', 'true');
    }
  }

  function setTogglerVisibility(visible, options = {}) {
    const { persist = true } = options;
    const nextVisible = Boolean(visible);

    if (!state.toggler) {
      createToggler();
    }

    if (togglerVisible === nextVisible) {
      applyTogglerVisibility(nextVisible);
      if (persist) {
        setPreference(STORAGE_KEYS.togglerVisible, nextVisible);
      }
      return;
    }

    togglerVisible = nextVisible;
    applyTogglerVisibility(togglerVisible);

    if (persist) {
      setPreference(STORAGE_KEYS.togglerVisible, togglerVisible);
    }

    refreshMenuCommands();
  }

  function refreshMenuCommands() {
    if (typeof GM_registerMenuCommand !== 'function') {
      return;
    }

    const canUnregister = typeof GM_unregisterMenuCommand === 'function';

    if (canUnregister && menuCommandHandles.length) {
      menuCommandHandles.splice(0, menuCommandHandles.length).forEach((id) => {
        try {
          GM_unregisterMenuCommand(id);
        } catch (error) {
          console.warn('[NexusPHP RSS Config Helper] Failed to unregister menu command', error);
        }
      });
    } else if (!canUnregister && menuInitialized) {
      return;
    }

    const openId = GM_registerMenuCommand('打开 MP自定义站点索引配置器', ensurePanelVisible);
    if (canUnregister && openId) {
      menuCommandHandles.push(openId);
    }

    if (canUnregister) {
      const toggleId = GM_registerMenuCommand(togglerVisible ? '隐藏悬浮按钮' : '显示悬浮按钮', () => {
        setTogglerVisibility(!togglerVisible);
      });
      if (toggleId) {
        menuCommandHandles.push(toggleId);
      }
    } else {
      GM_registerMenuCommand('显示悬浮按钮', () => {
        setTogglerVisibility(true);
      });
      GM_registerMenuCommand('隐藏悬浮按钮', () => {
        setTogglerVisibility(false);
      });
    }

    menuInitialized = true;
  }

  function createToggler() {
    if (state.toggler) return;
    state.toggler = document.createElement('button');
    state.toggler.type = 'button';
    state.toggler.className = 'tm-rss-toggler';
    state.toggler.setAttribute('aria-label', '打开配置面板');
    state.toggler.innerHTML = `
      <span class="tm-rss-toggler-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M4 3h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm9 0h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm-9 11h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Zm9 0h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z" />
        </svg>
      </span>
    `;
    document.body.appendChild(state.toggler);
    state.toggler.addEventListener('click', (event) => {
      if (state.toggler.dataset.dragging === 'true' || state.toggler.dataset.dragMoved === 'true') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (isPanelVisible()) {
        hidePanel();
      } else {
        ensurePanelVisible();
      }
    });
    applyTogglerPosition();
    enableTogglerDrag();
    applyTogglerVisibility(togglerVisible);
  }

  function registerMenu() {
    refreshMenuCommands();
  }

  function setStatus(message, isError = false) {
    if (!state.status) return;
    state.status.textContent = message || '';
    state.status.style.color = isError ? '#ff5c5c' : '#1f3f72';
  }

  function handleHeaderDoubleClick(event) {
    event.preventDefault();
    if (state.maximized) {
      restorePanelSize();
    } else {
      maximizePanel();
    }
  }

  function maximizePanel() {
    if (!state.panel || state.maximized) return;
    const style = state.panel.style;
    state.previousDimensions = {
      left: style.left,
      top: style.top,
      right: style.right,
      bottom: style.bottom,
      width: style.width,
      height: style.height,
      maxWidth: style.maxWidth,
      maxHeight: style.maxHeight,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow
    };
    state.maximized = true;
    state.panel.classList.add('is-maximized');
    style.left = '';
    style.top = '';
    style.right = '';
    style.bottom = '';
    style.width = '';
    style.height = '';
    style.maxWidth = '';
    style.maxHeight = '';
    style.borderRadius = '';
    style.boxShadow = '';
  }

  function restorePanelSize() {
    if (!state.panel || !state.maximized) return;
    state.maximized = false;
    state.panel.classList.remove('is-maximized');
    const prev = state.previousDimensions || {};
    const style = state.panel.style;
    style.left = prev.left !== undefined ? prev.left : style.left;
    style.top = prev.top !== undefined ? prev.top : style.top;
    style.right = prev.right !== undefined ? prev.right : style.right;
    style.bottom = prev.bottom !== undefined ? prev.bottom : style.bottom;
    style.width = prev.width !== undefined ? prev.width : style.width;
    style.height = prev.height !== undefined ? prev.height : style.height;
    style.maxWidth = prev.maxWidth !== undefined ? prev.maxWidth : style.maxWidth;
    style.maxHeight = prev.maxHeight !== undefined ? prev.maxHeight : style.maxHeight;
    style.borderRadius = prev.borderRadius !== undefined ? prev.borderRadius : style.borderRadius;
    style.boxShadow = prev.boxShadow !== undefined ? prev.boxShadow : style.boxShadow;
    state.previousDimensions = null;
    applyPanelPosition();
  }

  function isNexusPhpSite() {
    if (document.querySelector('form[action*="getrss.php"]')) return true;
    if (document.querySelector('a[href*="getrss.php"]')) return true;
    if (document.querySelector('table.torrents')) return true;
    const generator = document.querySelector('meta[name="generator"]');
    if (generator && /NexusPHP/i.test(generator.content)) return true;
    return false;
  }

  function parseRssResponse(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }

  function resolveSectionInfo(input) {
    let row = input.closest('tr');
    while (row) {
      const embedded = row.querySelector('td.embedded');
      if (embedded) {
        const rawTitle = embedded.textContent.replace(/\s+/g, '').replace(/[:：]/g, '');
        const label = embedded.textContent.trim().replace(/[:：]/g, '');
        const key = SECTION_NAME_MAP.get(rawTitle) || SECTION_NAME_MAP.get(label) || slugify(label || rawTitle);
        return { key, label: label || rawTitle };
      }
      row = row.previousElementSibling;
    }
    return null;
  }

  function getLabelText(input, doc) {
    const labelByFor = input.id ? doc.querySelector(`label[for="${cssEscape(input.id)}"]`) : null;
    const directLabel = input.closest('label');
    const labelNode = labelByFor || directLabel;
    if (labelNode) {
      const text = labelNode.textContent.replace(/\s+/g, ' ').trim();
      if (text) return text;
    }

    const container = input.closest('td') || input.parentElement;
    if (!container) return '';

    const img = container.querySelector('img[alt], img[title]');
    if (img) {
      return (img.getAttribute('title') || img.getAttribute('alt') || '').trim();
    }

    const anchor = container.querySelector('a');
    if (anchor) {
      const text = anchor.textContent.replace(/\s+/g, ' ').trim();
      if (text) return text;
    }

    const text = container.textContent.replace(/\s+/g, ' ').trim();
    return text;
  }

  function extractOption(input, doc) {
    const idSource = input.id || input.name || '';
    const idMatch = idSource.match(/\d+/);
    const optionId = idMatch ? Number(idMatch[0]) : idSource;
    const labelText = getLabelText(input, doc);
    const normalizedKey = (labelText || '').trim().toLowerCase();
    const idKey = (idSource || '').trim().toLowerCase();
    const customDesc = customDescMap.get(normalizedKey) || customDescMap.get(idKey);
    const localizedDesc = customDesc || CATEGORY_LOCALIZATION.get(normalizedKey) || CATEGORY_LOCALIZATION.get(idKey) || labelText || idSource;

    return {
      id: optionId,
      cat: labelText || idSource,
      desc: localizedDesc
    };
  }

  function collectSections(doc) {
    const inputs = Array.from(doc.querySelectorAll('input[type="checkbox"]'));
    const sections = {};

    inputs.forEach((input) => {
      const fieldId = input.id || input.name || '';
      if (!ALLOWED_PREFIX_RE.test(fieldId)) return;

      const sectionInfo = resolveSectionInfo(input);
      if (!sectionInfo) return;

      if (!sections[sectionInfo.key]) {
        sections[sectionInfo.key] = {
          title: sectionInfo.label,
          items: []
        };
      }

      sections[sectionInfo.key].items.push(extractOption(input, doc));
    });

    const normalized = {};
    Object.entries(sections).forEach(([key, payload]) => {
      const unique = [];
      const seen = new Set();
      payload.items.forEach((item) => {
        const identity = `${item.id}-${item.cat}`;
        if (!seen.has(identity)) {
          seen.add(identity);
          unique.push(item);
        }
      });
      unique.sort((a, b) => {
        if (typeof a.id === 'number' && typeof b.id === 'number') {
          return a.id - b.id;
        }
        return String(a.cat).localeCompare(String(b.cat), 'zh-Hans-CN');
      });
      normalized[key] = unique;
    });

    return normalized;
  }

  function buildBaseConfig(meta, sections) {
    const config = {
      schema: meta.schema || DEFAULT_SCHEMA,
      id: meta.trackerId,
      name: meta.trackerName,
      domain: meta.domain,
      encoding: meta.encoding || DEFAULT_ENCODING,
      public: meta.isPublic,
      search: {
        paths: [
          {
            path: 'torrents.php',
            method: 'get'
          }
        ],
        params: {
          search: '{keyword}',
          search_area: 0
        },
        batch: {
          delimiter: ' ',
          space_replace: '_'
        }
      },
      category: sections,
      torrents: {
        list: {
          selector: 'table.torrents > tr:has(table.torrentname)'
        },
        fields: {
          id: {
            selector: 'a[href*="details.php?id="]',
            attribute: 'href',
            filters: [
              {
                name: 'regexp',
                args: ['id=(\\d+)']
              }
            ]
          },
          title_default: {
            selector: 'a[href*="details.php?id="]'
          },
          title_optional: {
            optional: true,
            selector: 'a[title][href*="details.php?id="]',
            attribute: 'title'
          },
          title: {
            text: '{% if fields.title_optional %}{{ fields.title_optional }}{% else %}{{ fields.title_default }}{% endif %}'
          },
          details: {
            selector: 'a[href*="details.php?id="]',
            attribute: 'href'
          },
          download: {
            selector: 'a[href*="download.php?id="]',
            attribute: 'href'
          },
          date_elapsed: {
            selector: 'td:nth-child(4) > span',
            optional: true
          },
          date_added: {
            selector: 'td:nth-child(4) > span',
            attribute: 'title',
            optional: true
          },
          size: {
            selector: 'td:nth-child(5)'
          },
          seeders: {
            selector: 'td:nth-child(6)'
          },
          leechers: {
            selector: 'td:nth-child(7)'
          },
          grabs: {
            selector: 'td:nth-child(8)'
          },
          downloadvolumefactor: {
            case: {
              'img.pro_free': 0,
              'img.pro_free2up': 0,
              'img.pro_50pctdown': 0.5,
              'img.pro_50pctdown2up': 0.5,
              'img.pro_30pctdown': 0.3,
              '*': 1
            }
          },
          uploadvolumefactor: {
            case: {
              'img.pro_50pctdown2up': 2,
              'img.pro_free2up': 2,
              'img.pro_2up': 2,
              '*': 1
            }
          }
        }
      }
    };

    if (!Object.keys(config.category || {}).length) {
      delete config.category;
    }

    return config;
  }

  async function handleGenerate() {
    if (!state.generateBtn) return;

    const meta = {
      schema: state.inputs.schema.value.trim() || DEFAULT_SCHEMA,
      trackerId: state.inputs.trackerId.value.trim(),
      trackerName: sanitizeTrackerName(state.inputs.trackerName.value.trim()),
      domain: state.inputs.domain.value.trim(),
      encoding: state.inputs.encoding.value.trim() || DEFAULT_ENCODING,
      isPublic: false
    };

    state.inputs.trackerName.value = meta.trackerName;

    meta.trackerId = sanitizeTrackerId(meta.trackerId);
    if (!meta.trackerId) {
      meta.trackerId = deriveTrackerId(meta.domain || location.hostname);
    }
    state.inputs.trackerId.value = meta.trackerId;

    if (!meta.trackerName) {
      meta.trackerName = deriveTrackerName(location.hostname);
      state.inputs.trackerName.value = meta.trackerName;
    }

    if (!meta.trackerId) {
      setStatus('请填写 Tracker ID。', true);
      state.inputs.trackerId.focus();
      return;
    }

    if (!meta.trackerName) {
      setStatus('请填写 Tracker 名称。', true);
      state.inputs.trackerName.focus();
      return;
    }

    if (!meta.domain) {
      setStatus('请填写 Domain。', true);
      state.inputs.domain.focus();
      return;
    }

    let requestUrl;
    try {
      const normalizedDomain = normalizeDomainOrigin(meta.domain);
      meta.domain = normalizedDomain;
      requestUrl = new URL('getrss.php', normalizedDomain).toString();
    } catch (error) {
      setStatus('Domain 格式不正确，请确认包含协议（例如 https://example.com）。', true);
      return;
    }

    state.generateBtn.disabled = true;
    setStatus('正在获取 getrss.php ...');

    try {
      const response = await fetch(requestUrl, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'Tampermonkey'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const doc = parseRssResponse(html);
      const sections = collectSections(doc);

      if (!Object.keys(sections).length) {
        setStatus('未能从 getrss.php 中解析到分类，请确认已登录且页面结构未变。', true);
        state.base64Output.value = '';
        return;
      }

      const config = buildBaseConfig(meta, sections);
      const json = JSON.stringify(config, null, 2);

      state.output.value = json;
      try {
        const baseDomain = extractBaseDomain(meta.domain) || normalizeHostname(meta.domain);
        const host = baseDomain.replace(/^www\./i, '');
        const encoded = encodeToBase64(json);
        state.base64Output.value = `${host}|${encoded}`;
        setActiveView('base64');
      } catch (base64Error) {
        console.error('[NexusPHP RSS Config Helper] Base64 error:', base64Error);
        state.base64Output.value = '';
        setStatus(`解析完成，但 Base64 生成失败：${base64Error.message}`, true);
        return;
      }
      setStatus('解析完成。可以复制 JSON，或继续调整字段。');
    } catch (error) {
      console.error('[NexusPHP RSS Config Helper] Failed:', error);
      setStatus(`获取或解析失败：${error.message}`, true);
      state.base64Output.value = '';
    } finally {
      state.generateBtn.disabled = false;
    }
  }

  function handleCopyJson() {
    if (!state.output || !state.output.value) {
      setStatus('没有可复制的内容，请先生成。', true);
      return;
    }

    try {
      const text = state.output.value;
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        throw new Error('浏览器不支持自动复制');
      }
      setStatus('已复制到剪贴板。');
    } catch (error) {
      setStatus(`复制失败：${error.message}`, true);
    }
  }

  function handleCopyBase64() {
    if (!state.base64Output || !state.base64Output.value) {
      setStatus('没有 Base64 内容，请先生成。', true);
      return;
    }

    try {
      const text = state.base64Output.value;
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        throw new Error('浏览器不支持自动复制');
      }
      setStatus('Base64 已复制到剪贴板。');
    } catch (error) {
      setStatus(`Base64 复制失败：${error.message}`, true);
    }
  }

  function handleCustomDescChange(event) {
    updateCustomDesc(event.target.value);
  }

  function handleCustomDescInput(event) {
    if (state.typingTimeout) {
      clearTimeout(state.typingTimeout);
    }
    state.typingTimeout = setTimeout(() => {
      updateCustomDesc(event.target.value);
    }, 500);
  }

  function updateCustomDesc(rawText) {
    if (customDescRaw === rawText) {
      return;
    }
    customDescRaw = rawText;
    customDescMap = parseCustomDesc(customDescRaw);
    setPreference(STORAGE_KEYS.customDesc, customDescRaw);
  }

  function parseCustomDesc(rawText) {
    const map = new Map();
    if (!rawText) return map;
    rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [keyPartRaw, valuePartRaw] = line.split('=').map((segment) => segment.trim());
        if (!keyPartRaw || !valuePartRaw) return;

        let idToken = '';
        let labelToken = '';
        let keyToken = keyPartRaw;

        if (keyPartRaw.includes(':')) {
          const [left, right] = keyPartRaw.split(':');
          idToken = (left || '').trim();
          labelToken = (right || '').trim();
        } else {
          labelToken = keyPartRaw.trim();
        }

        const register = (token) => {
          if (!token) return;
          map.set(token.toLowerCase(), valuePartRaw);
        };

        register(keyToken);
        register(labelToken);

        const registerId = (token) => {
          if (!token) return;
          const cleaned = token.replace(/^cat/i, '');
          if (cleaned) {
            register(cleaned);
            register(`cat${cleaned}`);
          }
          register(token);
        };

        registerId(idToken);
      });
    return map;
  }

  async function refreshCustomDescValue(forceFetch = false) {
    if (!state.customDescInput) return;
    if (!forceFetch && customDescRaw.trim()) {
      state.customDescInput.value = customDescRaw;
      return;
    }

    if (state.loadingCustomDesc) {
      return;
    }

    state.loadingCustomDesc = true;
    try {
      const domain = state.inputs?.domain?.value?.trim() || location.origin;
      let requestUrl;
      try {
        requestUrl = new URL('getrss.php', domain).toString();
      } catch (error) {
        console.warn('[NexusPHP RSS Config Helper] Invalid domain for custom desc fetch:', domain, error);
        fallbackCustomDesc();
        return;
      }

      const response = await fetch(requestUrl, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const html = await response.text();
      const doc = parseRssResponse(html);
      const { entries, map } = extractCustomDescFromDoc(doc);
      if (entries.length) {
        customDescRaw = entries
          .map(({ idFragment, label, desc }) => `${idFragment}:${label}=${desc}`)
          .join('\n');
        customDescMap = map;
        setPreference(STORAGE_KEYS.customDesc, customDescRaw);
        state.customDescInput.value = customDescRaw;
      } else {
        fallbackCustomDesc();
      }
    } catch (error) {
      console.warn('[NexusPHP RSS Config Helper] Failed to fetch custom descriptions', error);
      fallbackCustomDesc();
    } finally {
      state.loadingCustomDesc = false;
    }
  }

  function fallbackCustomDesc() {
    if (!state.customDescInput) return;
    const stored = (customDescRaw || '').trim();
    if (stored) {
      state.customDescInput.value = customDescRaw;
      return;
    }
    const defaults = getDefaultCustomDescText();
    customDescRaw = defaults;
    customDescMap = parseCustomDesc(defaults);
    state.customDescInput.value = defaults;
    setPreference(STORAGE_KEYS.customDesc, defaults);
  }

  function extractCustomDescFromDoc(doc) {
    if (!doc) return { entries: [], map: new Map() };
    const inputs = Array.from(doc.querySelectorAll('input[type="checkbox"]'));
    const map = new Map();
    const entries = [];
    inputs.forEach((input) => {
      const fieldId = input.id || input.name || '';
      if (!fieldId) return;
      if (!ALLOWED_PREFIX_RE.test(fieldId)) return;
      const sectionInfo = resolveSectionInfo(input);
      if (!sectionInfo || sectionInfo.key !== 'category') return;
      const label = getLabelText(input, doc);
      if (!label) return;
      const normalizedId = fieldId.trim();
      const displayLabel = label.trim();
      const numericId = (normalizedId.match(/\d+/) || [''])[0];
      const localizationKeyCandidates = [
        displayLabel.trim().toLowerCase(),
        normalizedId.toLowerCase()
      ];
      if (numericId) {
        localizationKeyCandidates.push(`cat${numericId}`.toLowerCase(), numericId.toLowerCase());
      }
      const localizedDesc = localizationKeyCandidates.reduce((result, key) => {
        if (result) return result;
        return CATEGORY_LOCALIZATION.get(key);
      }, null) || displayLabel;

      const entry = {
        id: normalizedId,
        numericId,
        label: displayLabel,
        desc: localizedDesc,
        idFragment: numericId || normalizedId
      };
      entries.push(entry);

      const register = (token) => {
        if (!token) return;
        map.set(token.toLowerCase(), localizedDesc);
      };

      register(displayLabel);
      register(normalizedId);
      if (numericId) {
        register(numericId);
        register(`cat${numericId}`);
      }
    });
    return { entries, map };
  }

  function enableTogglerDrag() {
    if (!state.toggler) return;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let hasDraggedBeyondThreshold = false;

    const onPointerMove = (event) => {
      if (state.toggler.dataset.dragging !== 'true') return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (!hasDraggedBeyondThreshold) {
        const distance = Math.hypot(deltaX, deltaY);
        if (distance < TOGGLER_DRAG_THRESHOLD_PX) {
          return;
        }
        hasDraggedBeyondThreshold = true;
      }
      const newLeft = initialLeft + deltaX;
      const newTop = initialTop + deltaY;
      state.toggler.style.left = `${newLeft}px`;
      state.toggler.style.top = `${newTop}px`;
      state.toggler.style.right = 'auto';
      state.toggler.style.bottom = 'auto';
      state.toggler.dataset.dragMoved = 'true';
    };

    const onPointerUp = (event) => {
      if (state.toggler.dataset.dragging !== 'true') return;
      event.preventDefault();
      state.toggler.classList.remove('is-dragging');
      state.toggler.dataset.dragging = 'false';
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerUp);
      if (state.toggler.dataset.dragMoved === 'true') {
        const rect = state.toggler.getBoundingClientRect();
        const position = {
          left: rect.left,
          top: rect.top
        };
        togglerPosition = position;
        setPreference(STORAGE_KEYS.togglerPosition, position);
        setTimeout(() => {
          state.toggler.dataset.dragMoved = 'false';
        }, 50);
      } else {
        state.toggler.dataset.dragMoved = 'false';
      }
      hasDraggedBeyondThreshold = false;
    };

    state.toggler.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      state.toggler.dataset.dragging = 'true';
      state.toggler.dataset.dragMoved = 'false';
      hasDraggedBeyondThreshold = false;
      state.toggler.classList.add('is-dragging');
      startX = event.clientX;
      startY = event.clientY;
      const rect = state.toggler.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      state.toggler.style.left = `${initialLeft}px`;
      state.toggler.style.top = `${initialTop}px`;
      state.toggler.style.right = 'auto';
      state.toggler.style.bottom = 'auto';
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerUp);
    });
  }

  function applyTogglerPosition() {
    if (!state.toggler) return;
    if (!togglerPosition || typeof togglerPosition.left !== 'number' || typeof togglerPosition.top !== 'number') {
      return;
    }
    state.toggler.style.left = `${togglerPosition.left}px`;
    state.toggler.style.top = `${togglerPosition.top}px`;
    state.toggler.style.right = 'auto';
    state.toggler.style.bottom = 'auto';
  }

  function enablePanelDrag(handle) {
    if (!handle || !state.panel) return;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let panelWidth = 0;
    let panelHeight = 0;

    const onPointerMove = (event) => {
      if (!panelDragging) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const desiredLeft = initialLeft + deltaX;
      const desiredTop = initialTop + deltaY;
      const { left, top } = constrainPanelPosition(desiredLeft, desiredTop, panelWidth, panelHeight);
      state.panel.style.left = `${left}px`;
      state.panel.style.top = `${top}px`;
      state.panel.style.right = 'auto';
      state.panel.style.bottom = 'auto';
    };

    const onPointerUp = () => {
      if (!panelDragging) return;
      panelDragging = false;
      panelPosition = getPanelPosition();
      setPreference(STORAGE_KEYS.panelPosition, panelPosition);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerUp);
    };

    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      if (state.maximized) {
        return;
      }
      event.preventDefault();
      panelDragging = true;
      const rect = state.panel.getBoundingClientRect();
      panelWidth = rect.width || state.panel.offsetWidth || state.panel.clientWidth;
      panelHeight = rect.height || state.panel.offsetHeight || state.panel.clientHeight;
      const constrainedStart = constrainPanelPosition(rect.left, rect.top, panelWidth, panelHeight);
      initialLeft = constrainedStart.left;
      initialTop = constrainedStart.top;
      state.panel.style.left = `${initialLeft}px`;
      state.panel.style.top = `${initialTop}px`;
      state.panel.style.right = 'auto';
      state.panel.style.bottom = 'auto';
      startX = event.clientX;
      startY = event.clientY;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerUp);
    });
  }

  function getPanelPosition() {
    if (!state.panel) return null;
    const rect = state.panel.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top
    };
  }

  function applyPanelPosition() {
    if (!state.panel) return;
    if (state.maximized) return;
    if (!panelPosition || typeof panelPosition.left !== 'number' || typeof panelPosition.top !== 'number') {
      state.panel.style.left = '24px';
      state.panel.style.top = '24px';
      state.panel.style.right = 'auto';
      state.panel.style.bottom = 'auto';
      requestAnimationFrame(constrainPanelWithinViewport);
      return;
    }
    state.panel.style.left = `${panelPosition.left}px`;
    state.panel.style.top = `${panelPosition.top}px`;
    state.panel.style.right = 'auto';
    state.panel.style.bottom = 'auto';
    requestAnimationFrame(constrainPanelWithinViewport);
  }

  function getPreference(key, fallback) {
    try {
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(key, fallback);
        return value === undefined ? fallback : value;
      }
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn('[NexusPHP RSS Config Helper] Failed to get preference', key, error);
      return fallback;
    }
  }

  function setPreference(key, value) {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('[NexusPHP RSS Config Helper] Failed to set preference', key, error);
    }
  }

  function init() {
    if (!isNexusPhpSite()) {
      return;
    }
    customDescRaw = getPreference(STORAGE_KEYS.customDesc, '');
    customDescMap = parseCustomDesc(customDescRaw);
    togglerPosition = getPreference(STORAGE_KEYS.togglerPosition, null);
    const storedVisibility = getPreference(STORAGE_KEYS.togglerVisible, null);
    togglerVisible = storedVisibility === null ? true : Boolean(storedVisibility);
    panelPosition = getPreference(STORAGE_KEYS.panelPosition, null);
    createPanel();
    createToggler();
    registerMenu();
    window.addEventListener('resize', constrainPanelWithinViewport);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
