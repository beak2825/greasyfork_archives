// ==UserScript==
// @name        ChatGPT Conversation List Manager
// @namespace   npm/chatgpt-conversation-manager
// @version     1.1
// @author      PITROYTECH
// @description Complete toolkit: Message Navigator + Timestamp Display for ChatGPT
// @match       https://chatgpt.com/*
// @match       https://chat.openai.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/560116/ChatGPT%20Conversation%20List%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/560116/ChatGPT%20Conversation%20List%20Manager.meta.js
// ==/UserScript==

/*
 * ChatGPT Conversation List Manager v1.0
 *
 * Features:
 *   - Message Navigator with drag & drop
 *   - Timestamp display (inline in navigator, start/end in messages)
 *   - Bilingual settings (English/Vietnamese)
 *   - Multiple date formats (EN: yyyy/mm/dd, VI: dd/mm/yyyy)
 *
 * v1.0:
 *   - Fixed: Empty messages (image only) now show placeholder text correctly
 *   - Fixed: Timestamp no longer mixed into preview text
 *   - Added: Locale-aware date format (EN: yyyy/mm/dd, VI: dd/mm/yyyy)
 */

(function() {
  'use strict';

  // INTERNATIONALIZATION (i18n)

  const i18n = {
    en: {
      loading: 'Loading messages...',
      noMessages: 'No messages yet.',
      messages: 'Messages',
      today: 'Today',
      emptyQuestion: 'You asked...',
      emptyAnswer: 'AI responded...',
      settingsTitle: 'ChatGPT CLM Settings',
      modulesSection: 'Enable/Disable Modules',
      enableNavigator: 'Enable Navigator (Message navigation bar)',
      enableTimestamp: 'Enable Timestamp (Show time in messages)',
      navigatorSection: 'Navigator',
      previewWidth: 'Preview width',
      previewLength: 'Preview length',
      collapsedOpacity: 'Collapsed opacity',
      defaultCollapsed: 'Collapsed by default on startup',
      navigatorTip: '💡 Drag the ✮⋆˙ icon to move Navigator. Click to collapse/expand.',
      navTimestampSection: 'Timestamp in Navigator',
      showNavTimestamp: 'Show timestamp in message list',
      navTimestampFormat: 'Timestamp format in Navigator',
      msgTimestampSection: 'Timestamp in Messages',
      timestampPosition: 'Display position',
      positionEnd: 'End of message',
      positionStart: 'Start of message',
      timestampFormat: 'Time format',
      formatAuto: 'Auto (Today/Date)',
      formatDate: 'Year/Month/Day',
      formatDayMonth: 'Month/Day only',
      formatDateTime: 'Date + Time',
      fontSize: 'Font size',
      timestampTip: '📅 "Auto" format: shows "Today HH:MM" for today, full date for other days',
      languageSection: 'Language',
      language: 'Interface language',
      langEnglish: 'English',
      langVietnamese: 'Tiếng Việt',
      reset: '🔄 Reset',
      apply: '✓ Apply',
      resetConfirm: 'Reset all settings to default?',
      resetSuccess: 'Reset done! Reloading...',
      saveSuccess: 'Saved! Reloading...',
      pixels: 'px',
      chars: ' chars'
    },

    vi: {
      loading: 'Đang tải tin nhắn...',
      noMessages: 'Chưa có tin nhắn.',
      messages: 'Tin nhắn',
      today: 'Hôm nay',
      emptyQuestion: 'Bạn đã hỏi...',
      emptyAnswer: 'AI đã trả lời...',
      settingsTitle: 'Cài đặt ChatGPT CLM',
      modulesSection: 'Bật/Tắt Module',
      enableNavigator: 'Bật Navigator (Thanh điều hướng tin nhắn)',
      enableTimestamp: 'Bật Timestamp (Hiển thị thời gian trong tin nhắn)',
      navigatorSection: 'Navigator',
      previewWidth: 'Chiều rộng preview',
      previewLength: 'Độ dài preview',
      collapsedOpacity: 'Độ mờ khi thu gọn',
      defaultCollapsed: 'Mặc định thu gọn khi khởi động',
      navigatorTip: '💡 Kéo thả icon ✮⋆˙ để di chuyển Navigator. Click để thu gọn/mở rộng.',
      navTimestampSection: 'Timestamp trong Navigator',
      showNavTimestamp: 'Hiển thị thời gian trong danh sách tin nhắn',
      navTimestampFormat: 'Định dạng thời gian trong Navigator',
      msgTimestampSection: 'Timestamp trong tin nhắn',
      timestampPosition: 'Vị trí hiển thị',
      positionEnd: 'Cuối tin nhắn',
      positionStart: 'Đầu tin nhắn',
      timestampFormat: 'Định dạng thời gian',
      formatAuto: 'Tự động (Hôm nay/Ngày)',
      formatDate: 'Ngày Tháng Năm',
      formatDayMonth: 'Chỉ ngày/tháng',
      formatDateTime: 'Ngày + Giờ',
      fontSize: 'Cỡ chữ',
      timestampTip: '📅 Định dạng "Tự động": hiển thị "Hôm nay HH:MM" cho hôm nay, ngày đầy đủ cho ngày khác',
      languageSection: 'Ngôn ngữ',
      language: 'Ngôn ngữ giao diện',
      langEnglish: 'English',
      langVietnamese: 'Tiếng Việt',
      reset: '🔄 Reset',
      apply: '✓ Áp dụng',
      resetConfirm: 'Reset tất cả cài đặt về mặc định?',
      resetSuccess: 'Đã reset! Đang tải lại...',
      saveSuccess: 'Đã lưu! Đang tải lại...',
      pixels: 'px',
      chars: ' ký tự'
    }
  };

  const t = (key) => {
    const lang = Settings.get('general', 'language') || 'en';
    return i18n[lang]?.[key] || i18n.en[key] || key;
  };

  const getLang = () => Settings.get('general', 'language') || 'en';

  // LOGGER SYSTEM

  const Logger = {
    prefix: '[ChatGPT-CLM]',
    enabled: true,

    colors: {
      system: '#3E2723',
      navigator: '#FF8C00',
      urlChange: '#FF0080',
      timestamp: '#00BCD4',
      config: '#B76E79',
      dom: '#00C9FF',
      warning: '#FF6B35',
      error: '#FF3366'
    },

    _log(msg, color, icon = '') {
      if (!this.enabled) return;
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
      const pre = icon ? `${icon} ${this.prefix}` : this.prefix;
      console.log(
        `%c${pre} %c${ts} %c${msg}`,
        `color: ${color}; font-weight: bold;`,
        `color: #999; font-size: 10px;`,
        `color: ${color};`
      );
    },

    system(msg)     { this._log(msg, this.colors.system, '🚀'); },
    success(msg)    { this._log(msg, this.colors.system, '✅'); },
    nav(msg)        { this._log(msg, this.colors.navigator, '📝'); },
    navReady(msg)   { this._log(msg, `${this.colors.navigator}; font-weight: bold`, '✅'); },
    urlChange(msg)  {
      console.log(`%c${'═'.repeat(55)}`, `color: ${this.colors.urlChange};`);
      this._log(msg, this.colors.urlChange, '🔄');
    },
    timestamp(msg)  { this._log(msg, this.colors.timestamp, '⏰'); },
    config(msg)     { this._log(msg, this.colors.config, '⚙️'); },
    dom(msg)        { this._log(msg, this.colors.dom, '🎯'); },
    warning(msg)    { this._log(msg, this.colors.warning, '⚠️'); },
    error(msg)      { this._log(msg, this.colors.error, '❌'); },

    group(title, color = '#10B981') {
      console.log(`%c${'═'.repeat(55)}`, `color: ${color};`);
      console.log(`%c🎯 ${this.prefix} ${title}`, `color: ${color}; font-weight: bold; font-size: 14px;`);
    },

    groupEnd(color = '#10B981') {
      console.log(`%c${'═'.repeat(55)}`, `color: ${color};`);
    },

    separator(label = '', color = '#666') {
      if (label) {
        console.log(`%c──────────── ${label} ────────────`, `color: ${color}; font-size: 11px;`);
      }
    }
  };

  // DOM SELECTORS

  const DOM = {
    main: 'main',
    chatContainer: 'main .flex.flex-col.text-sm',
    article: 'article',
    userMessage: '[data-message-author-role="user"]',
    userBubble: '.user-message-bubble-color',
    assistantMessage: '[data-message-author-role="assistant"]',
    messageWithId: 'div[data-message-id]',
    prose: '.prose',
    markdown: '[class*="markdown"]',
    navigator: '[data-chatgpt-clm-navigator]',
    navList: '.clm-questions-list',
    navItem: '.clm-question-item',
    textarea: 'textarea[data-id], #prompt-textarea',
    textareaFallback: 'textarea, [contenteditable="true"]',
    timestampClass: '.clm-timestamp'
  };

  const $ = (sel, ctx = document) => { try { return ctx.querySelector(sel); } catch { return null; } };
  const $$ = (sel, ctx = document) => { try { return Array.from(ctx.querySelectorAll(sel)); } catch { return []; } };
  const $id = (id) => document.getElementById(id);

  // CONSTANTS & CONFIGURATION

  const SUITE = { version: '1.0', namespace: 'chatgpt_clm' };

  const DEFAULT_CONFIG = {
    general: {
      navigatorEnabled: true,
      timestampEnabled: true,
      language: 'en'
    },
    navigator: {
      collapsed: true,
      top: '10vh',
      previewWidth: 300,
      previewLength: 80,
      collapsedOpacity: 0.35,
      collapsedWidth: 55,
      forceStickBottomMs: 500,
      showTimestamp: false,
      timestampFormat: 'daymonth'
    },
    timestamp: {
      fontSize: 11,
      color: '#888',
      position: 'end',
      format: 'auto'
    }
  };

  // SHARED UTILITIES

  const Utils = {
    isDarkMode() {
      const bg = getComputedStyle(document.body).backgroundColor;
      const cls = document.documentElement.className;
      return cls.includes('dark') || /rgb\([0-3]/.test(bg);
    },

    debounce(fn, wait) {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    },

    showToast(msg, type = 'success') {
      const old = $(`.${SUITE.namespace}-toast`);
      if (old) old.remove();

      const dark = this.isDarkMode();
      const colors = {
        success: dark ? 'rgba(16, 185, 129, 0.9)' : 'rgba(16, 185, 129, 0.95)',
        error: dark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.95)',
        info: dark ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.95)'
      };
      const icons = { success: '✓', error: '✕', info: 'ℹ' };

      const toast = document.createElement('div');
      toast.className = `${SUITE.namespace}-toast`;
      toast.innerHTML = `<span style="margin-right:8px">${icons[type]}</span><span>${msg}</span>`;
      toast.style.cssText = `
        position:fixed;top:20px;right:20px;background:${colors[type]};backdrop-filter:blur(12px);
        color:white;padding:14px 20px;border-radius:12px;z-index:10000;font-size:14px;font-weight:500;
        box-shadow:0 10px 25px ${colors[type].replace('0.9', '0.25')};
        animation:${SUITE.namespace}_slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      `;

      if (!$(`#${SUITE.namespace}-animations`)) {
        const style = document.createElement('style');
        style.id = `${SUITE.namespace}-animations`;
        style.textContent = `
          @keyframes ${SUITE.namespace}_slideIn{from{opacity:0;transform:translateX(100px) scale(0.8)}to{opacity:1;transform:translateX(0) scale(1)}}
          @keyframes ${SUITE.namespace}_slideOut{from{opacity:1;transform:translateX(0) scale(1)}to{opacity:0;transform:translateX(100px) scale(0.8)}}
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = `${SUITE.namespace}_slideOut 0.3s ease-out`;
        setTimeout(() => toast.remove(), 300);
      }, 2500);
    },

    escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    },

    getCleanText(el) {
      if (!el) return '';
      const clone = el.cloneNode(true);
      const timestamps = clone.querySelectorAll(DOM.timestampClass);
      timestamps.forEach(ts => ts.remove());
      return clone.textContent?.trim() || '';
    },

    _cachedContainer: null,
    _containerLoggedOnce: false,

    findChatContainer(forceRefresh = false) {
      if (!forceRefresh && this._cachedContainer && document.contains(this._cachedContainer)) {
        return this._cachedContainer;
      }

      let container = null;
      let source = '';

      const mainScroll = $(`${DOM.main} [class*="overflow-y-auto"]`);
      if (mainScroll && mainScroll.scrollHeight > mainScroll.clientHeight) {
        container = mainScroll;
        source = 'main overflow-y-auto';
      }

      if (!container) {
        const article = $(DOM.article);
        if (article) {
          let parent = article.parentElement;
          let depth = 0;
          while (parent && parent !== document.body && depth < 10) {
            const style = getComputedStyle(parent);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                parent.scrollHeight > parent.clientHeight) {
              container = parent;
              source = `parent traversal (depth: ${depth})`;
              break;
            }
            parent = parent.parentElement;
            depth++;
          }
        }
      }

      this._cachedContainer = container;
      if (container && !this._containerLoggedOnce) {
        Logger.dom(`Found scroll container: ${source}`);
        this._containerLoggedOnce = true;
      }

      return container;
    },

    resetContainerCache() {
      this._cachedContainer = null;
      this._containerLoggedOnce = false;
    },

    getConversationIdByUrl() {
      const match = location.pathname.match(/\/c\/([a-zA-Z0-9-]+)/);
      return match?.[1] || null;
    }
  };

  // SETTINGS MANAGER

  const Settings = {
    defaults: DEFAULT_CONFIG,

    load() {
      try {
        if (typeof GM_getValue === 'function') {
          return {
            general: GM_getValue('clm_general', this.defaults.general),
            navigator: GM_getValue('clm_navigator', this.defaults.navigator),
            timestamp: GM_getValue('clm_timestamp', this.defaults.timestamp)
          };
        }
      } catch (e) {
        Logger.error(`Settings load error: ${e.message}`);
      }
      return this.defaults;
    },

    save(settings) {
      try {
        if (typeof GM_setValue === 'function') {
          GM_setValue('clm_general', settings.general);
          GM_setValue('clm_navigator', settings.navigator);
          GM_setValue('clm_timestamp', settings.timestamp);
          return true;
        }
      } catch (e) {
        Logger.error(`Settings save error: ${e.message}`);
      }
      return false;
    },

    get(module, key) {
      return this.load()[module]?.[key];
    },

    set(module, key, value) {
      const s = this.load();
      if (s[module]) { s[module][key] = value; this.save(s); }
    },

    reset() {
      this.save(this.defaults);
      Logger.config('Settings reset to default');
    }
  };

  // TIMESTAMP FORMATTER (Locale-aware)

  const TimestampFormatter = {
    pad: n => n.toString().padStart(2, '0'),

    // EN: mm/dd, VI: dd/mm
    formatDayMonth(date) {
      const d = this.pad(date.getDate());
      const m = this.pad(date.getMonth() + 1);
      return getLang() === 'vi' ? `${d}/${m}` : `${m}/${d}`;
    },

    // EN: yyyy/mm/dd, VI: dd/mm/yyyy
    formatDate(date) {
      const d = this.pad(date.getDate());
      const m = this.pad(date.getMonth() + 1);
      const y = date.getFullYear();
      return getLang() === 'vi' ? `${d}/${m}/${y}` : `${y}/${m}/${d}`;
    },

    formatTime(date) {
      return `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}`;
    },

    formatDateTime(date) {
      return `${this.formatDate(date)} ${this.formatTime(date)}`;
    },

    formatAuto(date) {
      const now = new Date();
      const isToday = date.getDate() === now.getDate() &&
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear();

      if (isToday) {
        return `${t('today')} ${this.formatTime(date)}`;
      } else {
        return `${this.formatDate(date)} - ${this.formatTime(date)}`;
      }
    },

    format(date, formatType = 'auto') {
      switch (formatType) {
        case 'daymonth': return this.formatDayMonth(date);
        case 'date': return this.formatDate(date);
        case 'datetime': return this.formatDateTime(date);
        case 'auto':
        default: return this.formatAuto(date);
      }
    },

    formatShort(date, formatType = 'daymonth') {
      switch (formatType) {
        case 'datetime': return `${this.formatDayMonth(date)} ${this.formatTime(date)}`;
        case 'date': return this.formatDate(date);
        case 'daymonth':
        default: return this.formatDayMonth(date);
      }
    }
  };

  // MODULE 1: TIMESTAMP

  const Timestamp = {
    name: 'Timestamp',
    version: '1.0',
    enabled: true,

    state: {
      processedCount: 0
    },

    getConfig: () => Settings.load().timestamp,

    getTimestampFromElement(div) {
      const reactKey = Object.keys(div).find(k => k.startsWith('__reactFiber$'));
      if (!reactKey) return null;

      const fiber = div[reactKey];
      const messages = fiber?.return?.memoizedProps?.messages;
      const timestamp = messages?.[0]?.create_time;
      if (!timestamp) return null;

      return new Date(timestamp * 1000);
    },

    addTimestamps() {
      const cfg = this.getConfig();
      let added = 0;

      $$(DOM.messageWithId).forEach(div => {
        if (div.dataset.timestampAdded) return;

        const date = this.getTimestampFromElement(div);
        if (!date) return;

        const formatted = TimestampFormatter.format(date, cfg.format);

        const span = document.createElement('span');
        span.textContent = formatted;
        span.className = 'clm-timestamp';
        span.style.cssText = `
          font-size: ${cfg.fontSize}px;
          color: ${cfg.color};
          font-weight: 600;
          margin-${cfg.position === 'start' ? 'right' : 'left'}: 8px;
          margin-${cfg.position === 'start' ? 'bottom' : 'top'}: 4px;
          display: inline-block;
          font-family: ui-monospace, 'SF Mono', Monaco, monospace;
        `;

        if (cfg.position === 'start') {
          div.insertBefore(span, div.firstChild);
        } else {
          div.appendChild(span);
        }

        div.dataset.timestampAdded = 'true';
        added++;
      });

      if (added > 0) {
        this.state.processedCount += added;
        Logger.timestamp(`Added ${added} timestamps (total: ${this.state.processedCount})`);
      }
    },

    init() {
      Logger.timestamp(`Initializing Timestamp v${this.version}...`);
      this.addTimestamps();
      Logger.timestamp(`Timestamp v${this.version} ready`);
    },

    cleanup() {
      $$('.clm-timestamp').forEach(el => el.remove());
      $$('[data-timestamp-added]').forEach(el => el.removeAttribute('data-timestamp-added'));
      this.state.processedCount = 0;
    }
  };

  // MODULE 2: NAVIGATOR

  const Navigator = {
    name: 'Navigator',
    version: '1.0',
    enabled: true,

    state: {
      currentActiveIndex: -1,
      lastClickedIndex: -1,
      isNavigating: false,
      lastMessageCount: 0,
      cachedMessages: null,
      cacheTimeout: null,
      messageObserver: null,
      stickToBottom: true,
      forceBottomUntil: 0
    },

    getConfig: () => Settings.load().navigator,

    getAllMessages(forceRefresh = false) {
      if (!forceRefresh && this.state.cachedMessages && this.state.cacheTimeout) {
        return this.state.cachedMessages;
      }

      const articles = $$(DOM.article);

      this.state.cachedMessages = articles.filter(article => {
        const text = article.textContent?.trim();
        return text && text.length > 3;
      });

      clearTimeout(this.state.cacheTimeout);
      this.state.cacheTimeout = setTimeout(() => { this.state.cachedMessages = null; }, 500);

      return this.state.cachedMessages;
    },

    detectMessageType(el) {
      if ($(DOM.userMessage, el)) return 'user';
      if ($(DOM.assistantMessage, el)) return 'assistant';
      if ($(DOM.userBubble, el)) return 'user';
      if ($(DOM.prose, el) || $(DOM.markdown, el)) return 'assistant';
      return 'unknown';
    },

    getMessagePreview(el) {
      const cfg = this.getConfig();
      const type = this.detectMessageType(el);
      const maxLen = cfg.previewLength;

      let text = '';

      if (type === 'user') {
        const userEl = $(DOM.userMessage, el) || $(DOM.userBubble, el);
        if (userEl) {
          text = Utils.getCleanText(userEl);
        }
      } else {
        const proseEl = $(DOM.prose, el) || $(DOM.markdown, el);
        if (proseEl) {
          for (const sel of ['h1', 'h2', 'h3', 'p']) {
            const elem = $(sel, proseEl);
            if (elem) {
              const cleanText = Utils.getCleanText(elem);
              if (cleanText) {
                text = cleanText;
                break;
              }
            }
          }
          if (!text) {
            text = Utils.getCleanText(proseEl);
          }
        }
      }

      if (!text) {
        text = Utils.getCleanText(el).substring(0, 200);
      }

      if (!text || text.length < 3) {
        return {
          text: type === 'user' ? t('emptyQuestion') : t('emptyAnswer'),
          isEmpty: true
        };
      }

      return {
        text: text.substring(0, maxLen),
        isEmpty: false
      };
    },

    getMessageTimestamp(el) {
      const messageDiv = $(DOM.messageWithId, el);
      if (!messageDiv) return null;
      return Timestamp.getTimestampFromElement(messageDiv);
    },

    scrollToMessage(el) {
      this.state.isNavigating = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        this.applyGlowEffect(el);
        this.state.isNavigating = false;
      }, 500);
    },

    applyGlowEffect(el) {
      const type = this.detectMessageType(el);
      let target = type === 'user'
        ? ($(DOM.userMessage, el) || $(DOM.userBubble, el))
        : ($(DOM.prose, el) || $(DOM.markdown, el));

      target = target || el;
      target.classList.add('clm-text-glow-effect');
      setTimeout(() => target.classList.remove('clm-text-glow-effect'), 650);
    },

    navigateToIndex(idx) {
      const msgs = this.getAllMessages();
      if (idx < 0 || idx >= msgs.length) return;

      this.state.currentActiveIndex = idx;
      this.state.lastClickedIndex = idx;
      this.scrollToMessage(msgs[idx]);
      this.updatePreviewBar($(DOM.navigator));
      this.updateNavButtons();
      this.scrollSidebarToItem(idx);
    },

    navigateFirst() {
      this.navigateToIndex(0);
      const list = $(DOM.navList);
      if (list) list.scrollTop = 0;
    },

    navigateLast() {
      const msgs = this.getAllMessages();
      const lastIdx = msgs.length - 1;
      if (lastIdx >= 0) {
        this.navigateToIndex(lastIdx);
        const list = $(DOM.navList);
        if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
      }
    },

    navigateToBottom() {
      this.state.isNavigating = true;
      const msgs = this.getAllMessages();
      const lastIdx = msgs.length - 1;

      if (lastIdx >= 0) {
        const lastMsg = msgs[lastIdx];
        lastMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });

        setTimeout(() => {
          const input = $(DOM.textarea) || $(DOM.textareaFallback);
          if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            input.focus();
          }
        }, 300);

        this.state.currentActiveIndex = lastIdx;
        this.state.lastClickedIndex = lastIdx;

        const list = $(DOM.navList);
        if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });

        setTimeout(() => {
          this.updatePreviewBar($(DOM.navigator));
          this.updateNavButtons();
          this.state.isNavigating = false;
        }, 800);
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        this.state.isNavigating = false;
      }
    },

    scrollSidebarToItem(idx) {
      const sidebar = $(DOM.navigator);
      if (!sidebar) return;

      const list = $(DOM.navList, sidebar);
      const item = $(`${DOM.navItem}[data-index="${idx}"]`, list);

      if (item && list) {
        const listRect = list.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (itemRect.top < listRect.top) {
          list.scrollTop -= (listRect.top - itemRect.top) + 10;
        } else if (itemRect.bottom > listRect.bottom) {
          list.scrollTop += (itemRect.bottom - listRect.bottom) + 10;
        }
      }
    },

    updateNavButtons() {
      const sidebar = $(DOM.navigator);
      if (!sidebar) return;

      const msgs = this.getAllMessages();
      const isAtFirst = this.state.currentActiveIndex <= 0;
      const isAtLast = this.state.currentActiveIndex >= msgs.length - 1;

      const btnFirst = $('.clm-nav-btn-first', sidebar);
      const btnLast = $('.clm-nav-btn-last', sidebar);
      const btnBottom = $('.clm-nav-btn-bottom', sidebar);

      if (btnFirst) btnFirst.disabled = isAtFirst;
      if (btnLast) btnLast.disabled = isAtLast;
      if (btnBottom) btnBottom.disabled = false;
    },

    scrollSidebarToBottom(sidebar) {
      const list = $(DOM.navList, sidebar);
      if (list) {
        list.scrollTop = list.scrollHeight;
        setTimeout(() => { list.scrollTop = list.scrollHeight; }, 100);
      }
    },

    autoScrollSidebarIfNeeded(count) {
      if (count > this.state.lastMessageCount) {
        const list = $(DOM.navList);
        if (list) setTimeout(() => { list.scrollTop = list.scrollHeight; }, 100);
      }
      this.state.lastMessageCount = count;
    },

    createPreviewBar() {
      const cfg = this.getConfig();
      const sidebar = document.createElement('div');
      sidebar.setAttribute('data-chatgpt-clm-navigator', '');

      sidebar.innerHTML = `
        <style>
          @keyframes clmTextGlow{0%{text-shadow:0 0 4px rgba(59,130,246,0.8),0 0 8px rgba(59,130,246,0.6);color:#60a5fa}50%{text-shadow:0 0 8px rgba(59,130,246,1),0 0 16px rgba(59,130,246,0.8);color:#93bbfc}100%{text-shadow:0 0 4px rgba(59,130,246,0.8);color:#60a5fa}}
          .clm-text-glow-effect,.clm-text-glow-effect *{animation:clmTextGlow 2s ease-in-out}

          [data-chatgpt-clm-navigator]{position:fixed;top:10vh;right:12px;padding:12px;padding-bottom:8px;border-radius:8px;background:rgba(17,24,39,0.95);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:all 0.65s cubic-bezier(0.4,0,0.2,1);z-index:99998;max-width:${cfg.previewWidth}px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;opacity:1}

          [data-chatgpt-clm-navigator].collapsed::before{content:'';position:absolute;top:-5px;right:-8px;bottom:-35px;left:-8px;z-index:-1;pointer-events:all}
          [data-chatgpt-clm-navigator].dragging{transition:none!important;cursor:grabbing!important;user-select:none!important;opacity:0.9!important}
          [data-chatgpt-clm-navigator].dragging *{pointer-events:none!important;cursor:grabbing!important}
          [data-chatgpt-clm-navigator].collapsed{width:${cfg.collapsedWidth}px;overflow:hidden}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering){opacity:${cfg.collapsedOpacity}}
          [data-chatgpt-clm-navigator].collapsed .clm-questions-list{opacity:0.8;visibility:visible;transition:opacity 0.45s ease}
          [data-chatgpt-clm-navigator]:not(.collapsed) .clm-questions-list,[data-chatgpt-clm-navigator].hovering:not(.dragging) .clm-questions-list{opacity:1;visibility:visible}
          [data-chatgpt-clm-navigator].hovering:not(.dragging){width:auto;max-width:${cfg.previewWidth}px;overflow:visible;opacity:1}

          [data-chatgpt-clm-navigator] .clm-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;color:#e5e7eb;font-weight:600;font-size:14px;white-space:nowrap;gap:8px;cursor:default;user-select:none}
          [data-chatgpt-clm-navigator] .clm-header:hover{background:rgba(255,255,255,0.05);margin:-4px -4px 4px -4px;padding:4px;border-radius:4px}
          [data-chatgpt-clm-navigator] .clm-title{opacity:1;transition:opacity 0.45s ease;pointer-events:none;display:flex;align-items:center;gap:6px}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering) .clm-title{opacity:0;width:0;overflow:hidden}
          [data-chatgpt-clm-navigator] .clm-toggle-btn{cursor:grab;opacity:0.8;transition:all 0.45s ease;font-size:20px;padding:2px;flex-shrink:0;margin-left:auto}
          [data-chatgpt-clm-navigator] .clm-toggle-btn:hover{opacity:1;transform:scale(1.1)}
          [data-chatgpt-clm-navigator].collapsed .clm-toggle-btn{opacity:1}

          [data-chatgpt-clm-navigator] .clm-questions-list{max-height:50vh;overflow-y:auto;margin:0;padding:0;list-style:none}
          [data-chatgpt-clm-navigator] .clm-questions-list::-webkit-scrollbar{width:4px}
          [data-chatgpt-clm-navigator] .clm-questions-list::-webkit-scrollbar-track{background:transparent}
          [data-chatgpt-clm-navigator] .clm-questions-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:2px}

          [data-chatgpt-clm-navigator] .clm-question-item{padding:6px 8px;margin:2px 0;color:#9ca3af;font-size:13px;cursor:pointer;border-radius:4px;transition:all 0.32s ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:6px}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering) .clm-question-item{padding:6px 4px}
          [data-chatgpt-clm-navigator] .clm-question-item:hover{background:rgba(255,255,255,0.05);color:#e5e7eb}
          [data-chatgpt-clm-navigator] .clm-question-item.active{background:rgba(16,185,129,0.2);color:#10b981;font-weight:500}
          [data-chatgpt-clm-navigator] .clm-question-item.last-clicked{background:rgba(255,255,255,0.03)}
          [data-chatgpt-clm-navigator]:not(.collapsed) .clm-question-item[data-type="assistant"],[data-chatgpt-clm-navigator].hovering .clm-question-item[data-type="assistant"]{padding-left:20px}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering) .clm-question-item[data-type="assistant"]{padding-left:4px}

          [data-chatgpt-clm-navigator] .clm-question-number{flex-shrink:0;font-weight:600;color:#6b7280;min-width:18px;text-align:left}
          [data-chatgpt-clm-navigator] .clm-question-item.active .clm-question-number{color:#10b981}
          [data-chatgpt-clm-navigator] .clm-question-text{flex:1;overflow:hidden;text-overflow:ellipsis;transition:opacity 0.45s ease}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering) .clm-question-text{opacity:0;width:0}

          [data-chatgpt-clm-navigator] .clm-message-type{display:inline-block;width:16px;height:16px;line-height:16px;text-align:center;font-size:10px;border-radius:3px;flex-shrink:0}
          [data-chatgpt-clm-navigator] .clm-type-user{background:rgba(59,130,246,0.2)}
          [data-chatgpt-clm-navigator] .clm-type-assistant{background:rgba(16,185,129,0.2)}

          [data-chatgpt-clm-navigator] .clm-item-ts{font-size:10px;color:#6b7280;font-family:ui-monospace,'SF Mono',Monaco,monospace;flex-shrink:0;opacity:0.9}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering) .clm-item-ts{display:none}

          [data-chatgpt-clm-navigator] .clm-empty-state{color:#6b7280;font-size:12px;text-align:center;padding:20px 10px;opacity:0.7}

          [data-chatgpt-clm-navigator] .clm-nav-controls{display:flex;flex-direction:row;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);justify-content:center;align-items:center;transition:all 0.65s cubic-bezier(0.4,0,0.2,1)}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering) .clm-nav-controls{flex-direction:column;gap:4px;padding-top:6px;margin-top:6px}

          [data-chatgpt-clm-navigator] .clm-nav-btn{width:28px;height:28px;border:none;background:rgba(255,255,255,0.05);color:#9ca3af;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.2s ease;padding:0;line-height:1;flex-shrink:0}
          [data-chatgpt-clm-navigator] .clm-nav-btn:hover:not(:disabled){background:rgba(255,255,255,0.1);color:#e5e7eb;transform:scale(1.05)}
          [data-chatgpt-clm-navigator] .clm-nav-btn:active:not(:disabled){transform:scale(0.95)}
          [data-chatgpt-clm-navigator] .clm-nav-btn:disabled{opacity:0.3;cursor:not-allowed}
          [data-chatgpt-clm-navigator] .clm-nav-btn-bottom{background:rgba(251,191,36,0.1)}
          [data-chatgpt-clm-navigator] .clm-nav-btn-bottom:hover:not(:disabled){background:rgba(251,191,36,0.2)}
          [data-chatgpt-clm-navigator].collapsed:not(.hovering) .clm-nav-btn{width:26px;height:26px;font-size:12px}
        </style>

        <div class="clm-header">
          <span class="clm-title"><span>📝</span><span>${t('messages')}</span></span>
          <span class="clm-toggle-btn">✮⋆˙</span>
        </div>
        <ol class="clm-questions-list"><li class="clm-empty-state">${t('loading')}</li></ol>
        <div class="clm-nav-controls">
          <button class="clm-nav-btn clm-nav-btn-first" title="First">⏮</button>
          <button class="clm-nav-btn clm-nav-btn-last" title="Last">⏭</button>
          <button class="clm-nav-btn clm-nav-btn-bottom" title="Bottom">🏁</button>
        </div>
      `;

      if (cfg.collapsed) sidebar.classList.add('collapsed');

      const controls = $('.clm-nav-controls', sidebar);
      $('.clm-nav-btn-first', controls).addEventListener('click', () => this.navigateFirst());
      $('.clm-nav-btn-last', controls).addEventListener('click', () => this.navigateLast());
      $('.clm-nav-btn-bottom', controls).addEventListener('click', () => this.navigateToBottom());

      Logger.nav(`Navigator bar created`);
      return sidebar;
    },

    setupDragBehavior(el) {
      const handle = $('.clm-toggle-btn', el);
      let isDown = false, isDrag = false, startY = 0, startTop = 0, ignoreClick = false;

      el.style.right = '12px';
      el.style.left = '';

      const savedTop = Settings.get('navigator', 'top');
      if (savedTop) { el.style.top = savedTop; el.style.transform = 'translateY(0)'; }

      const onDown = (e) => {
        if (e.target !== handle && !handle.contains(e.target)) return;
        isDown = true; isDrag = false;
        startY = e.clientY || e.touches?.[0]?.clientY;
        startTop = el.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
      };

      const onMove = (e) => {
        if (!isDown) return;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        const deltaY = clientY - startY;

        if (!isDrag && Math.abs(deltaY) > 3) {
          isDrag = true;
          el.classList.add('dragging');
          el.classList.remove('hovering');
        }
        if (!isDrag) return;

        const rect = el.getBoundingClientRect();
        let newTop = Math.max(20, Math.min(startTop + deltaY, window.innerHeight - rect.height - 20));
        el.style.top = newTop + 'px';
        el.style.right = '12px';
        e.preventDefault();
        e.stopPropagation();
      };

      const onUp = () => {
        if (!isDown) return;
        if (isDrag) {
          Settings.set('navigator', 'top', el.getBoundingClientRect().top + 'px');
          ignoreClick = true;
          setTimeout(() => { ignoreClick = false; }, 0);
        }
        isDown = false; isDrag = false;
        el.classList.remove('dragging');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };

      handle.addEventListener('mousedown', onDown);
      handle.addEventListener('touchstart', onDown, { passive: true });
      handle.addEventListener('click', (e) => {
        if (ignoreClick) { e.preventDefault(); e.stopPropagation(); return; }
        e.stopPropagation();
        el.classList.toggle('collapsed');
        Settings.set('navigator', 'collapsed', el.classList.contains('collapsed'));
      });
    },

    setupHoverBehavior(el) {
      let hoverTimeout, inSafeZone = false;

      const checkSafeZone = (e) => {
        const rect = el.getBoundingClientRect();
        const safeX = window.innerWidth - 50;
        const extra = el.classList.contains('collapsed') ? 10 : 0;
        return e.clientX >= safeX && e.clientY >= rect.top - 20 - extra && e.clientY <= rect.bottom + 20 + extra;
      };

      el.addEventListener('mouseenter', (e) => {
        const nav = $('.clm-nav-controls', el);
        if (el.classList.contains('collapsed') && e.clientY >= nav.getBoundingClientRect().top) return;
        if (!el.classList.contains('dragging')) {
          clearTimeout(hoverTimeout);
          el.classList.add('hovering');
          inSafeZone = false;
        }
      });

      [$('.clm-questions-list', el), $('.clm-header', el)].forEach(area => {
        area?.addEventListener('mouseenter', () => {
          if (el.classList.contains('collapsed') && !el.classList.contains('dragging')) {
            clearTimeout(hoverTimeout);
            el.classList.add('hovering');
            inSafeZone = false;
          }
        });
      });

      el.addEventListener('mouseleave', (e) => {
        if (el.classList.contains('dragging')) return;
        if (checkSafeZone(e)) { inSafeZone = true; return; }
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => { if (!inSafeZone) el.classList.remove('hovering'); }, el.classList.contains('collapsed') ? 350 : 234);
      });

      document.addEventListener('mousemove', (e) => {
        if (inSafeZone && !el.classList.contains('hovering')) return;
        if (inSafeZone && !checkSafeZone(e)) {
          inSafeZone = false;
          const rect = el.getBoundingClientRect();
          const m = el.classList.contains('collapsed') ? 8 : 0;
          if (e.clientX < rect.left - m || e.clientX > rect.right + m || e.clientY < rect.top - m || e.clientY > rect.bottom + m) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => el.classList.remove('hovering'), el.classList.contains('collapsed') ? 350 : 234);
          }
        }
      });
    },

    updatePreviewBar(bar, isFirst = false) {
      const list = $(DOM.navList, bar);
      if (!list) return;

      const msgs = this.getAllMessages(true);
      const cfg = this.getConfig();
      const currentCount = msgs.length;

      if (!msgs.length) {
        list.innerHTML = `<li class="clm-empty-state">${t('noMessages')}</li>`;
        this.updateNavButtons();
        return;
      }

      this.autoScrollSidebarIfNeeded(currentCount);

      let html = '';
      msgs.forEach((msg, idx) => {
        const type = this.detectMessageType(msg);
        const preview = this.getMessagePreview(msg);
        const previewText = Utils.escapeHtml(preview.text);
        const icon = type === 'user' ? '🙋🏻‍♂️' : '🤖';
        const isLast = idx === this.state.lastClickedIndex;
        const isActive = idx === this.state.currentActiveIndex;
        const num = idx + 1;

        let displayText = previewText;
        if (cfg.showTimestamp && !preview.isEmpty) {
          const date = this.getMessageTimestamp(msg);
          if (date) {
            const tsFormatted = TimestampFormatter.formatShort(date, cfg.timestampFormat);
            displayText = `<span class="clm-item-ts">${tsFormatted}:</span> ${previewText}`;
          }
        }

        const suffix = preview.isEmpty ? '' : '...';

        html += `<li class="clm-question-item${isLast ? ' last-clicked' : ''}${isActive ? ' active' : ''}" data-index="${idx}" data-type="${type}">
          <span class="clm-message-type clm-type-${type}">${icon}</span>
          <span class="clm-question-number">${num}.</span>
          <span class="clm-question-text">${displayText}${suffix}</span>
        </li>`;
      });

      list.innerHTML = html;

      $$(DOM.navItem, list).forEach(item => {
        const idx = parseInt(item.getAttribute('data-index'));
        item.addEventListener('click', () => {
          this.state.lastClickedIndex = idx;
          this.state.currentActiveIndex = idx;
          this.scrollToMessage(msgs[idx]);
          $$(DOM.navItem, list).forEach(i => i.classList.remove('active', 'last-clicked'));
          item.classList.add('active', 'last-clicked');
          this.updateNavButtons();
        });
      });

      const forceWindow = Date.now() < this.state.forceBottomUntil;
      const shouldStick = isFirst || forceWindow || this.state.stickToBottom;

      if (msgs.length > 0 && shouldStick) {
        this.state.currentActiveIndex = msgs.length - 1;
        requestAnimationFrame(() => this.scrollSidebarToBottom(bar));
      }

      this.updateNavButtons();
    },

    updateActiveState(bar) {
      if (this.state.isNavigating) return;
      const msgs = this.getAllMessages();
      const items = $$(DOM.navItem, bar);
      const viewMid = window.innerHeight / 3;
      let activeIdx = -1;

      msgs.forEach((msg, idx) => {
        const rect = msg.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= viewMid) activeIdx = idx;
      });

      if (activeIdx !== -1) {
        this.state.currentActiveIndex = activeIdx;
        items.forEach(item => {
          item.classList.toggle('active', parseInt(item.getAttribute('data-index')) === activeIdx);
        });
        this.updateNavButtons();
      }
    },

    setupScrollMonitoring() {
      const container = Utils.findChatContainer();
      const handler = Utils.debounce(() => {
        const bar = $(DOM.navigator);
        if (bar) this.updateActiveState(bar);
      }, 100);

      if (container) {
        container.addEventListener('scroll', handler, { passive: true });
      }
      window.addEventListener('scroll', handler, { passive: true });
    },

    setupMessageObserver(bar) {
      const chatContainer = $(DOM.chatContainer) || $(DOM.main);
      if (!chatContainer) {
        Logger.warning('Chat container not found for observation');
        return;
      }

      if (this.state.messageObserver) {
        this.state.messageObserver.disconnect();
      }

      let lastMsgCount = this.getAllMessages().length;
      let debounceTimer = null;

      this.state.messageObserver = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const currentCount = this.getAllMessages(true).length;

          if (currentCount !== lastMsgCount) {
            lastMsgCount = currentCount;
            this.updatePreviewBar(bar, false);

            if (Timestamp.enabled) {
              Timestamp.addTimestamps();
            }
          }
        }, 500);
      });

      this.state.messageObserver.observe(chatContainer, {
        childList: true,
        subtree: true,
        characterData: true
      });
    },

    init() {
      Logger.nav(`Initializing Navigator v${this.version}...`);
      this.cleanup();

      if (!$(DOM.article)) {
        Logger.warning(`No messages found - retrying in 2s`);
        setTimeout(() => this.init(), 2000);
        return;
      }

      const cfg = this.getConfig();
      this.state.forceBottomUntil = Date.now() + cfg.forceStickBottomMs;
      this.state.stickToBottom = true;

      const bar = this.createPreviewBar();
      document.body.appendChild(bar);
      this.setupDragBehavior(bar);
      this.setupHoverBehavior(bar);
      this.updatePreviewBar(bar, true);

      const list = $(DOM.navList, bar);
      if (list) {
        list.addEventListener('scroll', () => {
          const atBottom = (list.scrollTop + list.clientHeight >= list.scrollHeight - 5);
          this.state.stickToBottom = atBottom;
        });
      }

      this.setupMessageObserver(bar);
      this.setupScrollMonitoring();

      Logger.navReady(`Navigator v${this.version} ready`);
    },

    cleanup() {
      if (this.state.messageObserver) {
        this.state.messageObserver.disconnect();
        this.state.messageObserver = null;
      }
      this.state.cachedMessages = null;
      clearTimeout(this.state.cacheTimeout);

      $$(DOM.navigator).forEach(el => el.remove());

      Object.assign(this.state, {
        lastClickedIndex: -1,
        currentActiveIndex: -1,
        isNavigating: false,
        lastMessageCount: 0,
        stickToBottom: true
      });
    }
  };

  // SETTINGS UI

  const SettingsUI = {
    panelId: 'clm-settings-panel',
    styleId: 'clm-settings-style',

    injectStyles() {
      if ($id(this.styleId)) return;

      const style = document.createElement('style');
      style.id = this.styleId;
      style.textContent = `
        #clm-settings-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);width:520px;max-height:90vh;background:#1a1a2e;border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,0.5);z-index:1000001;opacity:0;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7;overflow:hidden}
        #clm-settings-panel.show{transform:translate(-50%,-50%) scale(1);opacity:1}
        #clm-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:1000000;opacity:0;transition:opacity 0.3s}
        #clm-backdrop.show{opacity:1}
        .clm-sp-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:linear-gradient(135deg,#16213e 0%,#1a1a2e 100%);border-bottom:1px solid rgba(255,255,255,0.1)}
        .clm-sp-title{display:flex;align-items:center;gap:8px;font-weight:600;font-size:15px}
        .clm-sp-version{font-size:11px;padding:2px 8px;background:rgba(99,102,241,0.3);border-radius:10px;color:#a5b4fc}
        .clm-sp-close{width:28px;height:28px;border:none;background:rgba(255,255,255,0.1);border-radius:8px;color:#9ca3af;font-size:16px;cursor:pointer;transition:all 0.2s}
        .clm-sp-close:hover{background:rgba(239,68,68,0.3);color:#fca5a5}
        .clm-sp-content{max-height:calc(90vh - 140px);overflow-y:auto;padding:16px 20px}
        .clm-sp-content::-webkit-scrollbar{width:6px}
        .clm-sp-content::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:3px}
        .clm-sp-group{margin-bottom:20px;padding:14px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.06)}
        .clm-sp-group-title{font-size:12px;font-weight:600;color:#a5b4fc;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;display:flex;align-items:center;gap:6px}
        .clm-sp-row{margin-bottom:10px}
        .clm-sp-row:last-child{margin-bottom:0}
        .clm-sp-toggle{display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px}
        .clm-sp-toggle input{display:none}
        .clm-sp-toggle-slider{position:relative;width:36px;height:20px;background:rgba(255,255,255,0.1);border-radius:10px;transition:all 0.3s}
        .clm-sp-toggle-slider::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#6b7280;border-radius:50%;transition:all 0.3s}
        .clm-sp-toggle input:checked+.clm-sp-toggle-slider{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)}
        .clm-sp-toggle input:checked+.clm-sp-toggle-slider::after{left:18px;background:white}
        .clm-sp-field{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
        .clm-sp-field:last-child{margin-bottom:0}
        .clm-sp-field>span:first-child{font-size:11px;color:#9ca3af}
        .clm-sp-field.clm-sp-inline{flex-direction:row;align-items:center;gap:10px}
        .clm-sp-field.clm-sp-inline>span:first-child{min-width:140px}
        .clm-sp-field input[type="range"]{flex:1;height:4px;-webkit-appearance:none;background:rgba(255,255,255,0.1);border-radius:2px;cursor:pointer}
        .clm-sp-field input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#6366f1;border-radius:50%;cursor:pointer}
        .clm-sp-field select{padding:8px 12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#e4e4e7;font-size:13px;cursor:pointer}
        .clm-sp-field select:focus{outline:none;border-color:#6366f1}
        .clm-sp-value{min-width:50px;text-align:right;font-size:12px;color:#6366f1;font-weight:500}
        .clm-sp-note{font-size:11px;color:#6b7280;padding:8px 10px;background:rgba(99,102,241,0.1);border-radius:6px;margin-top:8px}
        .clm-sp-footer{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;background:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05)}
        .clm-sp-btn{padding:8px 16px;border:none;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.2s}
        .clm-sp-btn-secondary{background:rgba(255,255,255,0.1);color:#9ca3af}
        .clm-sp-btn-secondary:hover{background:rgba(255,255,255,0.15);color:#e4e4e7}
        .clm-sp-btn-primary{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:white;padding:10px 24px;font-size:13px}
        .clm-sp-btn-primary:hover{box-shadow:0 4px 15px rgba(99,102,241,0.4)}
        .clm-sp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      `;
      document.head.appendChild(style);
    },

    show() {
      if ($id(this.panelId)) {
        $id(this.panelId).classList.add('show');
        $id('clm-backdrop')?.classList.add('show');
        return;
      }

      this.injectStyles();
      const s = Settings.load();

      const backdrop = document.createElement('div');
      backdrop.id = 'clm-backdrop';
      backdrop.addEventListener('click', () => this.hide());
      document.body.appendChild(backdrop);

      const panel = document.createElement('div');
      panel.id = this.panelId;

      panel.innerHTML = `
        <div class="clm-sp-header">
          <div class="clm-sp-title">
            <span>🎯</span>
            <span>${t('settingsTitle')}</span>
            <span class="clm-sp-version">v${SUITE.version}</span>
          </div>
          <button class="clm-sp-close">✕</button>
        </div>

        <div class="clm-sp-content">
          <!-- Language -->
          <div class="clm-sp-group">
            <div class="clm-sp-group-title">🌐 ${t('languageSection')}</div>
            <div class="clm-sp-field">
              <span>${t('language')}</span>
              <select id="clm-sp-language">
                <option value="en" ${s.general.language === 'en' ? 'selected' : ''}>${t('langEnglish')}</option>
                <option value="vi" ${s.general.language === 'vi' ? 'selected' : ''}>${t('langVietnamese')}</option>
              </select>
            </div>
          </div>

          <!-- Enable/Disable Modules -->
          <div class="clm-sp-group">
            <div class="clm-sp-group-title">🎛️ ${t('modulesSection')}</div>
            <div class="clm-sp-row">
              <label class="clm-sp-toggle">
                <input type="checkbox" id="clm-sp-nav-enabled" ${s.general.navigatorEnabled ? 'checked' : ''}>
                <span class="clm-sp-toggle-slider"></span>
                <span>${t('enableNavigator')}</span>
              </label>
            </div>
            <div class="clm-sp-row">
              <label class="clm-sp-toggle">
                <input type="checkbox" id="clm-sp-ts-enabled" ${s.general.timestampEnabled ? 'checked' : ''}>
                <span class="clm-sp-toggle-slider"></span>
                <span>${t('enableTimestamp')}</span>
              </label>
            </div>
          </div>

          <!-- Navigator Settings -->
          <div class="clm-sp-group">
            <div class="clm-sp-group-title">📝 ${t('navigatorSection')}</div>
            <label class="clm-sp-field clm-sp-inline">
              <span>${t('previewWidth')}</span>
              <input type="range" id="clm-sp-nav-width" min="200" max="400" step="10" value="${s.navigator.previewWidth}">
              <span class="clm-sp-value">${s.navigator.previewWidth}${t('pixels')}</span>
            </label>
            <label class="clm-sp-field clm-sp-inline">
              <span>${t('previewLength')}</span>
              <input type="range" id="clm-sp-nav-length" min="40" max="150" step="10" value="${s.navigator.previewLength}">
              <span class="clm-sp-value">${s.navigator.previewLength}${t('chars')}</span>
            </label>
            <label class="clm-sp-field clm-sp-inline">
              <span>${t('collapsedOpacity')}</span>
              <input type="range" id="clm-sp-nav-opacity" min="10" max="100" step="5" value="${Math.round(s.navigator.collapsedOpacity * 100)}">
              <span class="clm-sp-value">${Math.round(s.navigator.collapsedOpacity * 100)}%</span>
            </label>
            <div class="clm-sp-row">
              <label class="clm-sp-toggle">
                <input type="checkbox" id="clm-sp-nav-collapsed" ${s.navigator.collapsed ? 'checked' : ''}>
                <span class="clm-sp-toggle-slider"></span>
                <span>${t('defaultCollapsed')}</span>
              </label>
            </div>
            <div class="clm-sp-note">${t('navigatorTip')}</div>
          </div>

          <!-- Navigator Timestamp -->
          <div class="clm-sp-group">
            <div class="clm-sp-group-title">⏱️ ${t('navTimestampSection')}</div>
            <div class="clm-sp-row">
              <label class="clm-sp-toggle">
                <input type="checkbox" id="clm-sp-nav-ts" ${s.navigator.showTimestamp ? 'checked' : ''}>
                <span class="clm-sp-toggle-slider"></span>
                <span>${t('showNavTimestamp')}</span>
              </label>
            </div>
            <div class="clm-sp-field">
              <span>${t('navTimestampFormat')}</span>
              <select id="clm-sp-nav-ts-format">
                <option value="daymonth" ${s.navigator.timestampFormat === 'daymonth' ? 'selected' : ''}>${t('formatDayMonth')}</option>
                <option value="date" ${s.navigator.timestampFormat === 'date' ? 'selected' : ''}>${t('formatDate')}</option>
                <option value="datetime" ${s.navigator.timestampFormat === 'datetime' ? 'selected' : ''}>${t('formatDateTime')}</option>
              </select>
            </div>
          </div>

          <!-- Message Timestamp -->
          <div class="clm-sp-group">
            <div class="clm-sp-group-title">⏰ ${t('msgTimestampSection')}</div>
            <div class="clm-sp-grid">
              <div class="clm-sp-field">
                <span>${t('timestampPosition')}</span>
                <select id="clm-sp-ts-position">
                  <option value="end" ${s.timestamp.position === 'end' ? 'selected' : ''}>${t('positionEnd')}</option>
                  <option value="start" ${s.timestamp.position === 'start' ? 'selected' : ''}>${t('positionStart')}</option>
                </select>
              </div>
              <div class="clm-sp-field">
                <span>${t('timestampFormat')}</span>
                <select id="clm-sp-ts-format">
                  <option value="auto" ${s.timestamp.format === 'auto' ? 'selected' : ''}>${t('formatAuto')}</option>
                  <option value="daymonth" ${s.timestamp.format === 'daymonth' ? 'selected' : ''}>${t('formatDayMonth')}</option>
                  <option value="date" ${s.timestamp.format === 'date' ? 'selected' : ''}>${t('formatDate')}</option>
                  <option value="datetime" ${s.timestamp.format === 'datetime' ? 'selected' : ''}>${t('formatDateTime')}</option>
                </select>
              </div>
            </div>
            <label class="clm-sp-field clm-sp-inline">
              <span>${t('fontSize')}</span>
              <input type="range" id="clm-sp-ts-size" min="9" max="14" step="1" value="${s.timestamp.fontSize}">
              <span class="clm-sp-value">${s.timestamp.fontSize}${t('pixels')}</span>
            </label>
            <div class="clm-sp-note">${t('timestampTip')}</div>
          </div>
        </div>

        <div class="clm-sp-footer">
          <button class="clm-sp-btn clm-sp-btn-secondary" id="clm-sp-reset">${t('reset')}</button>
          <button class="clm-sp-btn clm-sp-btn-primary" id="clm-sp-apply">${t('apply')}</button>
        </div>
      `;

      document.body.appendChild(panel);

      requestAnimationFrame(() => {
        backdrop.classList.add('show');
        panel.classList.add('show');
      });

      this.bindEvents(panel, s);
    },

    bindEvents(panel, s) {
      panel.querySelector('.clm-sp-close').addEventListener('click', () => this.hide());

      panel.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', (e) => {
          const valueEl = e.target.parentElement.querySelector('.clm-sp-value');
          if (valueEl) {
            const id = e.target.id;
            let suffix = t('pixels');
            if (id.includes('opacity')) suffix = '%';
            else if (id.includes('length')) suffix = t('chars');
            valueEl.textContent = e.target.value + suffix;
          }
        });
      });

      $id('clm-sp-reset').addEventListener('click', () => {
        if (confirm(t('resetConfirm'))) {
          Settings.reset();
          Utils.showToast(t('resetSuccess'), 'success');
          setTimeout(() => location.reload(), 1000);
        }
      });

      $id('clm-sp-apply').addEventListener('click', () => {
        const newSettings = {
          general: {
            navigatorEnabled: $id('clm-sp-nav-enabled').checked,
            timestampEnabled: $id('clm-sp-ts-enabled').checked,
            language: $id('clm-sp-language').value
          },
          navigator: {
            ...s.navigator,
            previewWidth: parseInt($id('clm-sp-nav-width').value),
            previewLength: parseInt($id('clm-sp-nav-length').value),
            collapsedOpacity: parseInt($id('clm-sp-nav-opacity').value) / 100,
            collapsed: $id('clm-sp-nav-collapsed').checked,
            showTimestamp: $id('clm-sp-nav-ts').checked,
            timestampFormat: $id('clm-sp-nav-ts-format').value
          },
          timestamp: {
            ...s.timestamp,
            fontSize: parseInt($id('clm-sp-ts-size').value),
            position: $id('clm-sp-ts-position').value,
            format: $id('clm-sp-ts-format').value
          }
        };

        Settings.save(newSettings);
        Utils.showToast(t('saveSuccess'), 'success');
        Logger.config('Settings saved');
        setTimeout(() => location.reload(), 1000);
      });
    },

    hide() {
      const panel = $id(this.panelId);
      const backdrop = $id('clm-backdrop');

      if (panel) panel.classList.remove('show');
      if (backdrop) backdrop.classList.remove('show');

      setTimeout(() => {
        panel?.remove();
        backdrop?.remove();
      }, 300);
    }
  };

  // MAIN ORCHESTRATOR

  const Suite = {
    lastConversationId: null,

    init() {
      Logger.group(`ChatGPT Conversation List Manager v${SUITE.version}`);
      Logger.system('Initializing script...');

      const s = Settings.load();

      const enabledModules = [];
      if (s.general.navigatorEnabled) enabledModules.push('Navigator');
      if (s.general.timestampEnabled) enabledModules.push('Timestamp');
      Logger.config(`Enabled modules: ${enabledModules.join(', ') || 'None'}`);
      Logger.config(`Language: ${s.general.language === 'vi' ? 'Vietnamese' : 'English'}`);

      Utils.findChatContainer();

      this.setupObserver();

      Logger.groupEnd();

      Logger.separator('📝 Navigator', Logger.colors.navigator);
      Navigator.enabled = s.general.navigatorEnabled;
      if (Navigator.enabled) {
        Navigator.init();
      } else {
        Logger.warning('Navigator disabled in settings');
      }

      Logger.separator('⏰ Timestamp', Logger.colors.timestamp);
      Timestamp.enabled = s.general.timestampEnabled;
      if (Timestamp.enabled) {
        Timestamp.init();
      } else {
        Logger.warning('Timestamp disabled in settings');
      }

      Logger.separator('✅ Complete', Logger.colors.system);
      this.registerMenu();
      Logger.success('Script initialized successfully');

      this.lastConversationId = Utils.getConversationIdByUrl();
    },

    setupObserver() {
      let lastUrl = location.href;

      const debouncedTimestamp = Utils.debounce(() => {
        if (Timestamp.enabled) Timestamp.addTimestamps();
      }, 500);

      const observer = new MutationObserver(() => {
        const url = location.href;
        const currentConvId = Utils.getConversationIdByUrl();

        if (url !== lastUrl) {
          lastUrl = url;
          Logger.urlChange(`URL changed: ${currentConvId ? 'Chat page' : 'Other page'}`);

          Utils.resetContainerCache();

          if (currentConvId && currentConvId !== this.lastConversationId) {
            this.lastConversationId = currentConvId;

            if (Navigator.enabled) {
              Navigator.cleanup();
              setTimeout(() => Navigator.init(), 1500);
            }
            if (Timestamp.enabled) {
              Timestamp.cleanup();
            }
          }
        }

        if (Timestamp.enabled) {
          debouncedTimestamp();
        }
      });

      observer.observe(document, { childList: true, subtree: true });
      Logger.dom('DOM observer enabled');
    },

    cleanup() {
      if (Navigator.enabled) Navigator.cleanup();
      if (Timestamp.enabled) Timestamp.cleanup();
    },

    registerMenu() {
      if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('⚙️ ChatGPT CLM Settings', () => SettingsUI.show());
        Logger.config('Tampermonkey menu registered');
      }
    }
  };

  // BOOTSTRAP

  const bootstrap = () => {
    setTimeout(() => Suite.init(), 1500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  window.addEventListener('beforeunload', () => Suite.cleanup());
  window.addEventListener('unload', () => Suite.cleanup());

})();