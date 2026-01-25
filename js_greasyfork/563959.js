// ==UserScript==
// @name                 Bahamut Anime to AniList Sync
// @name:zh-TW           巴哈姆特動畫瘋同步到 AniList
// @name:zh-CN           巴哈姆特动画疯同步到 AniList
// @namespace            https://github.com/downwarjers/WebTweaks
// @version              6.7.6
// @description          巴哈姆特動畫瘋同步到 AniList。支援系列設定、自動計算集數、自動日期匹配、深色模式UI
// @description:zh-TW    巴哈姆特動畫瘋同步到 AniList。支援系列設定、自動計算集數、自動日期匹配、深色模式UI
// @description:zh-CN    巴哈姆特动画疯同步到 AniList。支持系列设置、自动计算集数、自动日期匹配、深色模式UI
// @author               downwarjers
// @license              MIT
// @match                https://ani.gamer.com.tw/*
// @connect              acg.gamer.com.tw
// @connect              graphql.anilist.co
// @icon                 https://ani.gamer.com.tw/apple-touch-icon-144.jpg
// @run-at               document-idle
// @grant                GM_xmlhttpRequest
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_deleteValue
// @grant                GM_addStyle
// @grant                GM_setClipboard
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563959/Bahamut%20Anime%20to%20AniList%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/563959/Bahamut%20Anime%20to%20AniList%20Sync.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // #region ================= [Constants] 常數管理 =================
  const CONSTANTS = {
    // --- 基礎與除錯設定 ---
    DEBUG: false, // 除錯模式開關
    API_URL: 'https://graphql.anilist.co', // AniList 的 API 網址

    // --- 同步與匹配邏輯設定 ---
    SYNC_DEBOUNCE_MS: 2000, // 防抖動時間 (毫秒)
    MATCH_TOLERANCE_DAYS: 2, // 開播日期匹配容許誤差 (天)
    SEARCH_RANGE_DAYS: 10, // 自動模糊搜尋範圍 (天)
    STORAGE_PREFIX: 'baha_acg_', // 本地儲存 (Local Storage) 的 key 前綴
    SYNC_ON_BIND: false, // 綁定後是否立即同步

    URLS: {
      VIDEO_PAGE: 'animeVideo.php', // 用於判斷是否在播放頁
    },

    // --- API 連線重試機制 ---
    API_MAX_RETRIES: 5, // API連線失敗時的最大重試次數
    RETRY_DELAY_MS: 3000, // 重試前的等待時間 (毫秒)

    // --- 本地儲存的鍵名 (Key Names) ---
    KEYS: {
      TOKEN: 'ANILIST_TOKEN', // AniList Access Token
      SYNC_MODE: 'SYNC_MODE', // 同步模式的設定
      CUSTOM_SEC: 'SYNC_CUSTOM_SECONDS', // 自訂秒數的數值
    },

    // --- DOM 元素選擇器 (Selectors) ---
    // 巴哈姆特資訊
    SELECTORS: {
      // 當前頁面頁面操作
      PAGE: {
        seasonList: '.season ul li', // 動畫瘋播放頁下方的集數列表
        seasonUl: '.season ul', // 動畫瘋播放頁下方的全部列表
        playing: '.playing', // 正在播放的 CSS class
        acgLink: 'a[href*="acgDetail.php"]', // 作品資料頁的連結
        acgLinkAlt: 'a', // 備用選擇器 (用於 contains 文字搜尋)
        videoElement: 'video', // 網頁上的影片播放器元素 (<video>)
      },
      // 背景爬蟲
      PARSER: {
        infoTitle: '.ACG-info-container > h2', // 作品標題
        infoList: '.ACG-box1listA > li', // 作品資訊列表
      },
    },

    // --- 狀態代碼 (Status Codes) ---
    // 腳本內部狀態， UI 顯示的圖示/文字
    STATUS: {
      TOKEN_ERROR: 'token_error', // Token 錯誤或過期
      UNBOUND: 'unbound', // 尚未綁定 AniList 作品
      BOUND: 'bound', // 已綁定，準備就緒
      SYNCING: 'syncing', // 正在同步中
      DONE: 'done', // 同步完成
      ERROR: 'error', // 發生錯誤
      INFO: 'info', // 一般訊息提示
    },

    // --- 同步模式選項 (Sync Modes) ---
    SYNC_MODES: {
      INSTANT: { value: 'instant', label: '🚀 即時同步 (播放 5 秒後)' },
      TWO_MIN: { value: '2min', label: '⏳ 觀看確認 (播放 2 分鐘後)' },
      EIGHTY_PCT: { value: '80pct', label: '🏁 快看完時 (進度 80%)' },
      CUSTOM: { value: 'custom', label: '⚙️ 自訂時間' },
    },

    // --- AniList 狀態 ---
    ANI_STATUS: {
      CURRENT: { value: 'CURRENT', label: '📺 觀看中', anilist_label: 'Watching' },
      COMPLETED: { value: 'COMPLETED', label: '🎉 已看完', anilist_label: 'Completed' },
      PLANNING: { value: 'PLANNING', label: '📅 計畫中', anilist_label: 'Plan to watch' },
      REPEATING: { value: 'REPEATING', label: '🔁 重看中', anilist_label: 'Rewatching' },
      PAUSED: { value: 'PAUSED', label: '⏸️ 暫停', anilist_label: 'Paused' },
      DROPPED: { value: 'DROPPED', label: '🗑️ 棄番', anilist_label: 'Dropped' },
    },
  };

  const ICONS = {
    EYE_OPEN: `<svg class="al-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    EYE_OFF: `<svg class="al-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
  };
  // #endregion

  // #region ================= [DOM] 輔助函式庫 =================
  const _ = {
    $: (s, p = document) => {
      return p.querySelector(s);
    },
    $$: (s, p = document) => {
      return [...p.querySelectorAll(s)];
    },
    on: (el, events, handler) => {
      return events.split(' ').forEach((evt) => {
        return el && el.addEventListener(evt, handler);
      });
    },
    html: (str) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = str.trim();
      return tmp.firstElementChild;
    },
    fadeIn: (el, displayType = 'block') => {
      if (!el) {
        return;
      }
      el.style.display = displayType;
      requestAnimationFrame(() => {
        el.classList.remove('al-hidden');
        el.classList.add('al-visible');
      });
    },
    fadeOut: (el) => {
      if (!el) {
        return;
      }
      el.classList.remove('al-visible');
      el.classList.add('al-hidden');

      setTimeout(() => {
        if (el.classList.contains('al-hidden')) {
          el.style.display = 'none';
        }
      }, 200);
    },
    waitForElement(selector, timeout = 10000) {
      return new Promise((resolve) => {
        const el = document.querySelector(selector);
        if (el) {
          return resolve(el);
        }
        const observer = new MutationObserver(() => {
          const el = document.querySelector(selector);
          if (el) {
            observer.disconnect();
            resolve(el);
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
        setTimeout(() => {
          observer.disconnect();
          Log.warn(`Timeout waiting for element: ${selector}`);
          resolve(null);
        }, timeout);
      });
    },
  };
  // #endregion

  // #region ================= [Utils] 工具函式與 Logger =================
  const Log = {
    info: (...args) => {
      return (
        CONSTANTS.DEBUG && console.log('%c[AniList]', 'color:#3db4f2;font-weight:bold;', ...args)
      );
    },
    warn: (...args) => {
      return (
        CONSTANTS.DEBUG && console.warn('%c[AniList]', 'color:#ffca28;font-weight:bold;', ...args)
      );
    },
    error: (...args) => {
      return console.error('%c[AniList Error]', 'color:#ff5252;font-weight:bold;', ...args);
    },
    group: (...args) => {
      return (
        CONSTANTS.DEBUG &&
        console.group('%c[AniList Check]', 'color:#3db4f2;font-weight:bold;', ...args)
      );
    },
    groupEnd: () => {
      return CONSTANTS.DEBUG && console.groupEnd();
    },
  };

  const Utils = {
    deepSanitize(input) {
      if (typeof input === 'string') {
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;',
        };
        return input.replace(/[&<>"']/g, (m) => {
          return map[m];
        });
      }
      if (Array.isArray(input)) {
        return input.map(Utils.deepSanitize);
      }
      if (typeof input === 'object' && input !== null) {
        const newObj = {};
        for (const key in input) {
          newObj[key] = Utils.deepSanitize(input[key]);
        }
        return newObj;
      }
      return input;
    },
    jsDateToInt: (d) => {
      return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    },
    toJsDate(dObj) {
      if (!dObj?.year) {
        return null;
      }
      return new Date(dObj.year, (dObj.month || 1) - 1, dObj.day || 1);
    },
    formatDate: (dObj) => {
      return !dObj || !dObj.year
        ? '日期未定'
        : `${dObj.year}/${String(dObj.month || 1).padStart(2, '0')}/${String(
            dObj.day || 1,
          ).padStart(2, '0')}`;
    },
    getFuzzyDateRange(dateObj, toleranceDays) {
      const target = this.toJsDate(dateObj);
      if (!target) {
        return null;
      }

      // 利用原生 Date 自動處理跨月/跨年 (例如: 10/31 + 1天 會自動變 11/1)
      const min = new Date(target);
      min.setDate(min.getDate() - toleranceDays);

      const max = new Date(target);
      max.setDate(max.getDate() + toleranceDays);

      return { start: this.jsDateToInt(min), end: this.jsDateToInt(max) };
    },
    isDateCloseEnough(targetObj, checkObj) {
      const target = this.toJsDate(targetObj);
      const check = this.toJsDate(checkObj);

      if (!target || !check) {
        return false;
      }

      // 取得毫秒差，換算成天數
      const diffTime = Math.abs(target.getTime() - check.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays <= CONSTANTS.MATCH_TOLERANCE_DAYS;
    },
    parseDateStr(str) {
      if (!str || typeof str !== 'string') {
        return null;
      }
      const match = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        return {
          year: parseInt(match[1]),
          month: parseInt(match[2]),
          day: parseInt(match[3]),
        };
      }
      return null;
    },
    extractDomain(url) {
      try {
        return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
      } catch (e) {
        Log.error('URL Parse Error', e);
        return null;
      }
    },
    // 選擇器檢查
    _validateGroup(scope, selectors, groupName) {
      Log.group(`🔍 Selector 檢查: ${groupName}`);

      const allGood = Object.entries(selectors).every(([key, selector]) => {
        if (key === 'playing') {
          return true;
        } // 例外

        const el = scope.querySelector(selector);
        if (el) {
          Log.info(`✅ ${key}`, `(${selector})`, el);
          return true;
        } else {
          Log.warn(`⚠️ MISSING ${key}`, `Selector: ${selector}`);
          return false;
        }
      });

      if (!allGood) {
        Log.warn(`⚠️ ${groupName} 結構檢查發現缺失。`);
      } else {
        Log.info(`✅ ${groupName} 結構健康。`);
      }

      Log.groupEnd();
      return allGood;
    },

    // 檢查當前頁面
    validatePage() {
      return this._validateGroup(document, CONSTANTS.SELECTORS.PAGE, 'Page (UI)');
    },

    // 檢查背景解析
    validateParser(doc) {
      return this._validateGroup(doc, CONSTANTS.SELECTORS.PARSER, 'Parser (Data)');
    },
  };
  // #endregion

  // #region ================= [State] 狀態控制器 =================
  const State = {
    // --- 1. 基礎設定與認證 ---
    syncSettings: {}, // 同步設定 (觸發模式、自訂秒數)
    tokenErrorCount: 0, // Token 錯誤計數 (連續錯誤則停止同步)

    // --- 2. 作品與綁定資料 ---
    bahaSn: null, // 巴哈姆特作品 SN (系列 ID)
    bahaData: null, // 巴哈姆特頁面爬蟲取得的資料 (標題、日期等)
    rules: [], // 系列作對應規則列表 (Baha集數 -> AniList ID)
    activeRule: null, // 目前集數適用的對應規則
    candidate: null, // 自動搜尋到的候選 AniList 作品 (未綁定時用)
    userStatus: null, // 使用者在 AniList 上的觀看進度與狀態

    // --- 3. 執行狀態與計時器 ---
    currentUrlSn: null, // 目前網址上的 SN (單集 ID)，用於偵測換集
    hasSynced: false, // 本集是否已執行過同步 (防止重複發送)
    isHunting: false, // 是否正在搜尋播放器元素 (<video>)
    stopSync: false, // 全域停止同步開關 (發生嚴重錯誤或頻繁請求時)
    // huntTimer: null, // 搜尋播放器的 setInterval ID
    lastTimeUpdate: 0, // 上次處理 timeupdate 事件的時間戳

    // --- 4. API 資料快取 (Cache) ---
    cachedMediaInfo: null, // [主頁快取] 作品詳細資訊 + 使用者狀態 (合併查詢結果)
    cachedSeriesChain: null, // [系列頁快取] 系列作關聯列表 (Sequel Chain)
    cachedSeriesBaseId: null, // [系列頁快取識別] 記錄目前的系列快取是基於哪個 ID 查詢的
  };
  // #endregion

  // #region ================= [GraphQL] 查詢字串 =================
  const GQL = {
    MEDIA_FIELDS: `id title { romaji native } coverImage { medium } format episodes seasonYear startDate { year month day }`,
    SEARCH: `query($s:String){Page(page:1,perPage:10){media(search:$s,type:ANIME,sort:SEARCH_MATCH){id title{romaji english native}coverImage{medium} episodes seasonYear startDate{year month day} format externalLinks{url site}}}}`,
    SEARCH_RANGE: `query ($start:FuzzyDateInt,$end:FuzzyDateInt){Page(page:1,perPage:100){media(startDate_greater:$start,startDate_lesser:$end,type:ANIME,format_in:[MOVIE]){id title{romaji native}startDate{year month day}externalLinks{url site}}}}`,
    GET_MEDIA: `query ($id:Int){Media(id:$id){id title{romaji native}coverImage{medium}seasonYear episodes startDate{year month day} format }}`,
    GET_USER_STATUS: `query ($id:Int){Media(id:$id){mediaListEntry{status progress}}}`,
    UPDATE_PROGRESS: `mutation ($id:Int,$p:Int){SaveMediaListEntry(mediaId:$id,progress:$p){id progress status}}`,
    UPDATE_STATUS: `mutation ($id:Int,$status:MediaListStatus){SaveMediaListEntry(mediaId:$id,status:$status){id progress status}}`,
    SEQUEL_CHAIN: (fields) => {
      return `
            query ($id: Int) {
                Media(id: $id) { ${fields} relations { edges { relationType(version: 2) node { ${fields} relations { edges { relationType(version: 2) node { ${fields} relations { edges { relationType(version: 2) node { ${fields} } } } } } } } } } } }`;
    },
    GET_MEDIA_AND_STATUS: `query ($id: Int) {
        Media(id: $id) {
            id title { romaji native } coverImage { medium } episodes seasonYear startDate { year month day } format
            mediaListEntry { status progress id }
        }
    }`,
  };
  // #endregion

  // #region ================= [Styles] CSS =================
  GM_addStyle(`
    /* 1. 變數與主題 */
    /* 亮色模式 */
    :root {
      --al-bg: #ffffff;
      --al-bg-sec: #f8f9fa;
      --al-bg-hover: #f1f5f9;
      --al-text: #1f2937;
      --al-text-sub: #6b7280;
      --al-border: #e2e8f0;
      --al-primary: #3db4f2;
      --al-primary-h: #0ea5e9;
      --al-danger: #ef4444;
      --al-danger-h: #dc2626;
      --al-success: #10b981;
      --al-warn: #f59e0b;
      --al-nav-border: #666;
      --al-radius: 6px;
      --al-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    /* 暗色模式 */
    .al-theme-dark {
      --al-bg: #1b1b1b;
      --al-bg-sec: #222222;
      --al-bg-hover: #374151;
      --al-text: #f9fafb;
      --al-text-sub: #9ca3af;
      --al-border: #374151;
      --al-primary: #3db4f2;
      --al-primary-h: #7dd3fc;
    }

    /* 2. 排版工具 */
    .al-flex { display: flex; }
    .al-flex-col { flex-direction: column; }
    .al-items-center { align-items: center; }
    .al-justify-between { justify-content: space-between; }
    .al-justify-center { justify-content: center; }
    .al-shrink-0 { flex-shrink: 0; }
    .al-w-full { width: 100%; }

    .al-gap-2 { gap: 8px; }
    .al-gap-3 { gap: 12px; }
    
    /* Padding */
    .al-p-1 { padding: 4px; }
    .al-pt-1 { padding-top: 4px; } .al-pb-1 { padding-bottom: 4px; }
    .al-pl-1 { padding-left: 4px; } .al-pr-1 { padding-right: 4px; }
    .al-p-2 { padding: 8px; }
    .al-pt-2 { padding-top: 8px; } .al-pb-2 { padding-bottom: 8px; }
    .al-pl-2 { padding-left: 8px; } .al-pr-2 { padding-right: 8px; }
    .al-p-3 { padding: 12px; }
    .al-pt-3 { padding-top: 12px; } .al-pb-3 { padding-bottom: 12px; }
    .al-pl-3 { padding-left: 12px; } .al-pr-3 { padding-right: 12px; }
    .al-p-4 { padding: 16px; }
    .al-pt-4 { padding-top: 16px; } .al-pb-4 { padding-bottom: 16px; }
    .al-pl-4 { padding-left: 16px; } .al-pr-4 { padding-right: 16px; }
    .al-p-5 { padding: 20px; }

    /* Margin */
    .al-m-1 { margin: 4px; }
    .al-mt-1 { margin-top: 4px; } .al-mb-1 { margin-bottom: 4px; }
    .al-ml-1 { margin-left: 4px; } .al-mr-1 { margin-right: 4px; }
    .al-m-2 { margin: 8px; }
    .al-mt-2 { margin-top: 8px; } .al-mb-2 { margin-bottom: 8px; }
    .al-ml-2 { margin-left: 8px; } .al-mr-2 { margin-right: 8px; }
    .al-m-3 { margin: 12px; }
    .al-mt-3 { margin-top: 12px; } .al-mb-3 { margin-bottom: 12px; }
    .al-ml-3 { margin-left: 12px; } .al-mr-3 { margin-right: 12px; }
    .al-m-4 { margin: 16px; }
    .al-mt-4 { margin-top: 16px; } .al-mb-4 { margin-bottom: 16px; }
    .al-ml-4 { margin-left: 16px; } .al-mr-4 { margin-right: 16px; }

    /* 3. 文字與連結 */
    .al-text-sm { font-size: 13px; }
    .al-text-xs { font-size: 12px; }
    .al-font-bold { font-weight: 600; }
    .al-text-sub { color: var(--al-text-sub); }
    .al-text-primary { color: var(--al-primary); }
    .al-text-success { color: var(--al-success); font-weight: bold; }
    .al-link { color: var(--al-primary); text-decoration: none; cursor: pointer; }
    .al-link:hover { text-decoration: underline; }

    /* 4. 元件 - 按鈕 */
    .al-btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      border-radius: var(--al-radius); border: 1px solid transparent;
      cursor: pointer; transition: 0.15s; background: var(--al-bg-sec); color: var(--al-text);
      white-space: nowrap;
    }
    .al-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .al-btn:active { transform: translateY(0); }
    .al-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .al-btn-primary { background: var(--al-primary); color: #fff; }
    .al-btn-success { background: var(--al-success); color: #fff; }
    
    /* 紅色按鈕 (用於取消/解除綁定) */
    .al-btn-danger { background: var(--al-danger); color: #fff; }
    .al-btn-danger:hover { background: var(--al-danger-h); }

    /* 線框按鈕 (預設狀態) */
    .al-btn-outline { background: transparent; border-color: var(--al-border); color: var(--al-text-sub); }
    .al-btn-outline:hover { border-color: var(--al-text-sub); color: var(--al-text); background: var(--al-bg-hover); }
    
    .al-btn-sm { padding: 4px 10px; font-size: 12px; height: 28px; }
    .al-btn-block { width: 100%; display: flex; }

    /* 5. 元件 - 輸入框 */
    .al-input {
      background: var(--al-bg); color: var(--al-text);
      border: 1px solid var(--al-border); border-radius: var(--al-radius);
      padding: 8px; width: 100%; box-sizing: border-box; transition: 0.2s;
    }
    .al-input:focus { outline: none; border-color: var(--al-primary); box-shadow: 0 0 0 2px rgba(61, 180, 242, 0.2); }
    .al-input-sm { padding: 4px; text-align: center; height: 30px; }

    /* 6. 元件 - 圖片 */
    .al-cover { object-fit: cover; border-radius: 4px; background: var(--al-bg-hover); display: block; }
    .al-cover-lg { width: 85px; height: 120px; }
    .al-cover-md { width: 60px; height: 85px; }
    .al-cover-sm { width: 50px; height: 70px; min-width: 50px; } 
    .al-icon { width: 16px; height: 16px; vertical-align: middle; }

    /* 7. 卡片與容器 */
    .al-card { background: var(--al-bg-sec); border: 1px solid var(--al-border); border-radius: var(--al-radius); padding: 12px; }
    .al-card-suggest { background: #fffbeb; border-color: #fcd34d; }
    .al-theme-dark .al-card-suggest { background: #451a03; border-color: #78350f; }

    /* 8. 表格 (系列設定) */
    .al-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; table-layout: fixed; }
    .al-table th { text-align: left; padding: 10px 8px; border-bottom: 2px solid var(--al-border); color: var(--al-text-sub); font-size: 12px; white-space: nowrap; }
    .al-table td { padding: 8px; border-bottom: 1px solid var(--al-border); vertical-align: middle; height: 80px; }
    
    .al-row-active { background-color: rgba(61, 180, 242, 0.08); } 
    .al-row-suggest { background-color: rgba(245, 158, 11, 0.08); }

    /* 9. 狀態標籤 */
    .al-tag { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; white-space: nowrap; line-height: 1; }
    .al-tag.success { background: #d1fae5; color: #059669; }
    .al-tag.warn { background: #fef3c7; color: #d97706; }
    .al-tag.error { background: #fee2e2; color: #dc2626; }
    .al-tag.default { background: #e5e7eb; color: #6b7280; }
    
    .al-theme-dark .al-tag.success { background: #064e3b; color: #6ee7b7; }
    .al-theme-dark .al-tag.warn { background: #451a03; color: #fcd34d; }
    .al-theme-dark .al-tag.error { background: #7f1d1d; color: #fca5a5; }
    .al-theme-dark .al-tag.default { background: #374151; color: #9ca3af; }

    /* Modal & Tabs & Nav (維持不變) */
    .al-modal-overlay { position: fixed; inset: 0; z-index: 99999; background: rgba(0,0,0,0.7); display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
    .al-modal-content { background: var(--al-bg); color: var(--al-text); width: 750px; max-height: 90vh; display: flex; flex-direction: column; border-radius: 8px; box-shadow: var(--al-shadow); border: 1px solid var(--al-border); }
    .al-modal-header { padding: 12px 16px; border-bottom: 1px solid var(--al-border); display: flex; justify-content: space-between; align-items: center; background: var(--al-bg-sec); border-radius: 8px 8px 0 0; }
    .al-modal-body { overflow-y: auto; flex: 1; padding: 0; min-height: 300px; }
    .al-close-btn { background: none; border: none; font-size: 20px; color: var(--al-text-sub); cursor: pointer; }

    .al-tabs-nav { display: flex; border-bottom: 1px solid var(--al-border); background: var(--al-bg-sec); }
    .al-tab-item { flex: 1; padding: 12px; text-align: center; cursor: pointer; color: var(--al-text-sub); font-weight: 600; font-size: 13px; border-bottom: 2px solid transparent; transition: 0.2s; background: none; border: none; }
    .al-tab-item.active { color: var(--al-primary); border-bottom-color: var(--al-primary); background: var(--al-bg); }
    .al-tab-item:disabled { opacity: 0.5; cursor: not-allowed; }
    .al-tab-pane { display: none; animation: al-fadein 0.2s; }
    .al-tab-pane.active { display: block; }

    .al-nav-item { float: left; }
    .al-nav-link { display: flex; align-items: center; cursor: pointer; border-left: 1px solid var(--al-nav-border) !important; font-size: 13px; }
    #al-user-status, #al-title { border-left: 1px solid var(--al-nav-border); padding-left: 8px; margin-left: 8px; }
    .al-toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #1f2937; color: #fff; padding: 8px 20px; border-radius: 99px; font-size: 13px; z-index: 100000; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
    #al-title {
        flex-shrink: 1;
        max-width: clamp(100px, 20vw, 380px);
        width: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }

    .al-hidden {
        display: none !important;
        opacity: 0;
    }
    .al-visible {
        display: block;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }
    @keyframes al-fadein { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) { #al-title, #al-user-status { display: none !important; } }
  `);
  // #endregion

  // #region ================= [Logic] 集數計算核心 =================
  const EpisodeCalculator = {
    // 網頁標題中抓取集數
    parseFromTitle() {
      const title = document.title;
      const match = title.match(/\[(\d+(?:\.\d+)?)\]/); // 抓取 [] 內的數字
      if (match) {
        return parseFloat(match[1]); // 這裡回傳數字 (支援小數點)
      }
      return 1;
    },

    getRawCurrent() {
      const urlParams = new URLSearchParams(location.search);
      const currentSn = urlParams.get('sn');

      // 1. 優先嘗試：尋找按鈕
      let anchor = _.$(`${CONSTANTS.SELECTORS.PAGE.seasonList} a[href*="sn=${currentSn}"]`);
      let targetLi = anchor ? anchor.closest('li') : null;
      if (!targetLi) {
        targetLi = _.$(`${CONSTANTS.SELECTORS.PAGE.seasonList}${CONSTANTS.SELECTORS.PAGE.playing}`);
      }

      // 2. 如果有按鈕，照舊讀取
      if (targetLi) {
        const text = targetLi.textContent.trim();
        if (text.includes('.') || !/\d/.test(text)) {
          return null;
        } // 過濾小數點
        return parseInt(text, 10);
      }

      // 3. 如果沒按鈕 (只有一集/連載中)，改抓標題
      const titleEp = this.parseFromTitle();
      if (titleEp !== null) {
        // 同樣過濾小數點
        if (!Number.isInteger(titleEp)) {
          return null;
        }
        return titleEp;
      }

      return null;
    },
    _getAllEpisodes() {
      const seasonUls = _.$$(CONSTANTS.SELECTORS.PAGE.seasonUl);
      if (seasonUls.length === 0) {
        return [];
      }

      const episodes = [];
      seasonUls.forEach((ul) => {
        ul.querySelectorAll('li').forEach((li) => {
          const t = li.textContent.trim();
          if (/^\d+$/.test(t)) {
            episodes.push(parseInt(t, 10));
          }
        });
      });
      return episodes;
    },
    getMin() {
      const eps = this._getAllEpisodes();
      if (eps.length > 0) {
        return Math.min(...eps);
      }
      const titleEp = this.parseFromTitle();
      return Number.isInteger(titleEp) ? titleEp : null;
    },
    getMax() {
      const eps = this._getAllEpisodes();
      if (eps.length > 0) {
        return Math.max(...eps);
      }
      const titleEp = this.parseFromTitle();
      return Number.isInteger(titleEp) ? titleEp : 0;
    },
  };

  const SeriesLogic = {
    /**
     * 計算系列作中每一部作品的起始集數
     * @param {Array} chain - AniList 的系列作列表
     * @param {Number} targetId - 定錨的作品 ID (使用者當前選中或綁定的 ID)
     * @param {Number} anchorStart - 定錨作品在巴哈的起始集數
     * @returns {Array} 處理過的 chain，每個物件會多一個 calculatedStart 屬性
     */
    calculateOffsets(chain, targetId, anchorStart) {
      // 1. 找出錨點位置
      let anchorIndex = chain.findIndex((m) => {
        return m.id === targetId;
      });

      // 如果鏈中沒有目標 ID，手動加入
      if (anchorIndex === -1 && targetId) {
        return chain;
      }

      // 2. 絕對定錨
      if (chain[anchorIndex]) {
        chain[anchorIndex].calculatedStart = anchorStart;
      }

      // 3. 向前推算 (Pre-quels)
      for (let i = anchorIndex - 1; i >= 0; i--) {
        const next = chain[i + 1];
        const current = chain[i];
        if (next.calculatedStart === undefined) {
          break;
        }
        const epCount = current.episodes || 12; // 若無集數資料，預設 12 (避免無限回推錯誤)
        current.calculatedStart = next.calculatedStart - epCount;
      }

      // 4. 向後推算 (Sequels)
      for (let i = anchorIndex + 1; i < chain.length; i++) {
        const prev = chain[i - 1];
        const current = chain[i];

        // 前作如果是連載中 (episodes: null) 或是計算中斷，則停止推算
        if (!prev.episodes || prev.calculatedStart === undefined) {
          break;
        }

        current.calculatedStart = prev.calculatedStart + prev.episodes;
      }

      return chain;
    },
  };
  // #endregion

  // #region ================= [API] AniList 通訊層 =================
  const AniListAPI = {
    getToken: () => {
      return GM_getValue(CONSTANTS.KEYS.TOKEN);
    },
    async request(query, variables, retryCount = 0) {
      const token = this.getToken();
      if (!token && !query.includes('search')) {
        throw new Error('Token 未設定');
      }

      if (retryCount > 0) {
        Log.warn(`API 重試中 (${retryCount}/${CONSTANTS.API_MAX_RETRIES})...`);
      } else {
        Log.info('API Request:', {
          query: query.substr(0, 50) + '...',
          variables,
        });
      }

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: CONSTANTS.API_URL,
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
            Accept: 'application/json',
          },
          data: JSON.stringify({ query, variables }),
          onload: (r) => {
            const strategies = [
              {
                name: 'Maintenance',
                match: (r) => {
                  return (
                    r.status >= 500 ||
                    r.responseText.includes('temporarily disabled') ||
                    r.responseText.includes('stability issues')
                  );
                },
                execute: () => {
                  const info = 'AniList 維護中';
                  UI.updateNav(CONSTANTS.STATUS.ERROR, info);
                  UI.showToast('⚠️ 伺服器維護中，API 暫時關閉，詳情請至 AniList Discord 查看');
                  Log.error('AniList Maintenance Mode Detected');
                  reject(new Error(info));
                },
              },
              {
                name: 'RateLimit',
                match: (r) => {
                  return r.status === 429;
                },
                execute: () => {
                  if (retryCount < CONSTANTS.API_MAX_RETRIES) {
                    const delay = CONSTANTS.RETRY_DELAY_MS * Math.pow(2, retryCount);
                    UI.updateNav(
                      CONSTANTS.STATUS.SYNCING,
                      `連線過於頻繁，重試中...(${retryCount + 1}/${CONSTANTS.API_MAX_RETRIES})`,
                    );
                    setTimeout(() => {
                      this.request(query, variables, retryCount + 1)
                        .then(resolve)
                        .catch(reject);
                    }, delay);
                  } else {
                    throw new Error('Too Many Requests (已達重試上限)');
                  }
                },
              },
              {
                name: 'AuthError',
                match: (r) => {
                  return r.status === 401 || r.responseText.includes('Invalid token');
                },
                execute: () => {
                  UI.updateNav(CONSTANTS.STATUS.TOKEN_ERROR);
                  UI.showToast('❌ Token 無效或過期，請重新設定');
                  reject(new Error('Invalid Token'));
                },
              },
              {
                name: 'Success',
                match: () => {
                  return true;
                },
                execute: () => {
                  const d = JSON.parse(r.responseText);
                  if (d.errors) {
                    const msg = d.errors[0].message;
                    Log.warn('API Logic Error:', msg);
                    reject(new Error(msg));
                  } else {
                    resolve(Utils.deepSanitize(d));
                  }
                },
              },
            ];

            try {
              const activeStrategy = strategies.find((s) => {
                return s.match(r);
              });
              if (activeStrategy) {
                Log.info(`Executing Strategy: ${activeStrategy.name}`);
                activeStrategy.execute();
              } else {
                throw new Error('Unknown Response State');
              }
            } catch (e) {
              Log.error('Strategy Execution Error', e);

              if (e.name === 'SyntaxError' && r.status >= 500) {
                UI.updateNav(CONSTANTS.STATUS.ERROR, '伺服器錯誤');
                reject(new Error('伺服器回應錯誤 (非 JSON)'));
              } else {
                reject(e);
              }
            }
          },
          onerror: (e) => {
            // 針對網路錯誤 (斷網/封包遺失) 進行重試
            if (retryCount < CONSTANTS.API_MAX_RETRIES) {
              const delay = CONSTANTS.RETRY_DELAY_MS;

              UI.updateNav(
                CONSTANTS.STATUS.SYNCING,
                `連線重試 (${retryCount + 1}/${CONSTANTS.API_MAX_RETRIES})`,
              );

              setTimeout(() => {
                this.request(query, variables, retryCount + 1)
                  .then(resolve)
                  .catch(reject);
              }, delay);
            } else {
              reject(new Error(`Network Error: ${e.statusText || 'Unknown'}`));
            }
          },
        });
      });
    },
    search: (term) => {
      return AniListAPI.request(GQL.SEARCH, { s: term });
    },
    searchByDateRange: (start, end) => {
      return AniListAPI.request(GQL.SEARCH_RANGE, { start, end });
    },
    getMedia: (id) => {
      return AniListAPI.request(GQL.GET_MEDIA, { id }).then((d) => {
        return d.data.Media;
      });
    },
    getMediaAndStatus: (id) => {
      return AniListAPI.request(GQL.GET_MEDIA_AND_STATUS, { id }).then((d) => {
        return d.data.Media;
      });
    },
    getUserStatus: (id) => {
      return AniListAPI.request(GQL.GET_USER_STATUS, { id }).then((d) => {
        return d.data.Media.mediaListEntry;
      });
    },
    updateUserProgress: (id, p) => {
      return AniListAPI.request(GQL.UPDATE_PROGRESS, { id, p }).then((d) => {
        return d.data.SaveMediaListEntry;
      });
    },
    updateUserStatus: (id, status) => {
      return AniListAPI.request(GQL.UPDATE_STATUS, { id, status }).then((d) => {
        return d.data.SaveMediaListEntry;
      });
    },
    async getSequelChain(id) {
      const query = GQL.SEQUEL_CHAIN(GQL.MEDIA_FIELDS);
      const data = await this.request(query, { id });
      const root = data.data.Media;
      if (!root) {
        return [];
      }

      // 1. 設定目標格式
      const rootFormat = root.format;
      let targetFormats = [];
      if (['OVA', 'SPECIAL'].includes(rootFormat)) {
        targetFormats = ['OVA', 'SPECIAL'];
      } else if (rootFormat === 'MOVIE') {
        targetFormats = ['MOVIE'];
      } else {
        targetFormats = ['TV', 'TV_SHORT', 'ONA', 'OVA', 'SPECIAL'];
      }

      // 2. 遍歷鏈條
      const visited = new Map(); // 使用 Map 來避免重複並儲存節點
      // 定義要抓取的關聯類型
      const targetRelations = ['SEQUEL', 'PREQUEL', 'SIDE_STORY', 'SPIN_OFF'];

      const traverse = (node) => {
        if (!node || visited.has(node.id)) {
          return;
        }

        visited.set(node.id, node);

        if (node.relations?.edges) {
          const relatedEdges = node.relations.edges.filter((e) => {
            return targetRelations.includes(e.relationType);
          });

          relatedEdges.forEach((edge) => {
            if (edge.node) {
              traverse(edge.node);
            }
          });
        }
      };

      // 開始遍歷
      traverse(root);

      // 3. 轉為陣列並過濾格式
      let resultChain = Array.from(visited.values()).filter((media) => {
        return targetFormats.includes(media.format);
      });

      resultChain.sort((a, b) => {
        const dateA = Utils.toJsDate(a.startDate);
        const dateB = Utils.toJsDate(b.startDate);

        const timeA = dateA ? dateA.getTime() : 0;
        const timeB = dateB ? dateB.getTime() : 0;

        if (timeA === timeB) {
          return a.id - b.id;
        }
        return timeA - timeB;
      });

      return resultChain;
    },
  };
  // #endregion

  // #region ================= [UI] 畫面渲染與事件 =================
  const Templates = {
    tabs: (activeTab, isVideo, hasRules) => {
      return `
      <div class="al-tabs-nav">
        <button class="al-tab-item ${activeTab === 'home' ? 'active' : ''}" 
          data-tab="home" ${!isVideo ? 'disabled' : ''}>主頁 / 狀態</button>
        <button class="al-tab-item ${activeTab === 'series' ? 'active' : ''}" 
          data-tab="series" ${!hasRules ? 'disabled' : ''}>系列設定</button>
        <button class="al-tab-item ${activeTab === 'settings' ? 'active' : ''}" 
          data-tab="settings">設定</button>
      </div>
      <div id="tab-home" class="al-tab-pane ${activeTab === 'home' ? 'active' : ''}"></div>
      <div id="tab-series" class="al-tab-pane ${activeTab === 'series' ? 'active' : ''}"></div>
      <div id="tab-settings" class="al-tab-pane ${activeTab === 'settings' ? 'active' : ''}"></div>
    `;
    },
    settings: (token, mode, customSec) => {
      const optionsHtml = Object.values(CONSTANTS.SYNC_MODES)
        .map((m) => {
          return `<option value="${m.value}" ${mode === m.value ? 'selected' : ''}>${
            m.label
          }</option>`;
        })
        .join('');

      return `
        <div class="al-p-4 al-flex-col al-gap-3">
          <div class="al-card al-mt-2">
            <label class="al-font-bold al-mb-1 al-text-sm" style="display:block;">AniList Access Token</label>
            <div class="al-flex al-gap-2">
              <input type="password" id="set-token" class="al-input" value="${token}" placeholder="請貼上 Token">
              <button id="toggle-token-btn" class="al-btn al-btn-outline" style="width:40px;">${ICONS.EYE_OFF}</button>
            </div>
          </div>

          <div class="al-card al-mt-2">
            <label class="al-font-bold al-mb-1 al-text-sm" style="display:block;">同步觸發時機</label>
            <select id="set-mode" class="al-input">${optionsHtml}</select>
            
            <div id="custom-sec-group" class="al-flex al-items-center al-gap-2 al-mt-2" style="display:none;">
              <span class="al-text-sub al-text-sm">播放超過：</span>
              <input type="number" id="set-custom-sec" class="al-input al-input-sm" value="${customSec}" min="1" style="width:80px;">
              <span class="al-text-sub al-text-sm">秒後同步</span>
            </div>
          </div>

          <button id="save-set" class="al-btn al-btn-success al-btn-block al-mt-2">儲存設定</button>

          <div class="al-card al-mt-2 al-text-sm al-text-sub">
            <div class="al-font-bold al-text al-mb-1 al-pb-2" style="border-bottom:1px solid var(--al-border);">如何取得 Token?</div>
            <div class="al-flex al-gap-2 al-pt-2 al-pb-2"> 
              <span class="al-font-bold al-text-primary">1.</span>
              <span>登入 <a href="https://anilist.co/" target="_blank" class="al-link">AniList</a> 後，前往 <a href="https://anilist.co/settings/developer" target="_blank" class="al-link">開發者設定</a> 新增 Client。</span>
            </div>
            <div class="al-flex al-gap-2 al-pt-2 al-pb-2">
              <span class="al-font-bold al-text-primary">2.</span>
              <span>輸入任意名稱，Redirect URL設定為 <code id="ref-url-btn" class="al-link al-row-active al-p-1" title="點擊複製">https://anilist.co/api/v2/oauth/pin</code> ，儲存後可取得Client ID</span>
            </div>
            <div class="al-flex al-gap-2 al-pt-2 al-pb-2 al-items-center">
              <span class="al-font-bold al-text-primary">3.</span>
              <span>輸入 Client ID：</span>
              <input id="client-id" class="al-input al-input-sm" style="width:80px;" placeholder="ID">
              <a id="auth-link" href="#" target="_blank" class="al-btn al-btn-primary al-btn-sm">前往授權</a>
            </div>
            <div class="al-flex al-gap-2 al-pt-2 al-pb-2">
              <span class="al-font-bold al-text-primary">4.</span>
              <span>點擊 Authorize，將網址列或頁面上的 Access Token 複製貼回上方。</span>
            </div>
          </div>
        </div>
      `;
    },
    homeBound: (rule, info, statusData, statusOptions) => {
      return `
      <div class="al-p-4 al-flex-col al-gap-3">
        <div class="al-flex al-justify-between al-items-center al-mb-2">
          <label class="al-text-sub al-font-bold al-text-xs">目前綁定作品</label>
          <button id="btn-refresh-data" class="al-btn al-btn-outline al-btn-sm">🔄 刷新</button>
        </div>

        <div class="al-card al-flex al-gap-3">
          <a href="https://anilist.co/anime/${rule.id}" target="_blank" class="al-shrink-0">
            <img src="${info.coverImage.medium}" class="al-cover al-cover-lg">
          </a>
          <div class="al-flex al-flex-col al-justify-between al-flex-1" style="overflow:hidden;">
            <div>
              <a href="https://anilist.co/anime/${rule.id}" target="_blank" 
                class="al-link al-font-bold" style="font-size:15px; display:block;">
                ${rule.title}
              </a>
              <div class="al-text-sub al-text-xs al-mt-1">
                <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${info.title.romaji}</div>
                <div class="al-mb-1 al-mt-1">ID: ${rule.id}</div>
                <div class="al-mb-1 al-mt-1">開播日: ${Utils.formatDate(info.startDate)}</div>
                <div class="al-mb-1 al-mt-1">播映方式: ${info.format}</div>
                <div class="al-mb-1 al-mt-1">總集數: ${info.episodes || '?'}</div>
              </div>
            </div>
            <div class="al-text-success al-text-sm al-pt-2 al-mt-1" style="border-top:1px dashed var(--al-border);">
              AniList 進度: ${statusData?.progress || 0} / ${info.episodes || '?'}
            </div>
          </div>
        </div>

        <div class="al-mt-4 al-pt-4" style="border-top:1px solid var(--al-border);">
          <label class="al-text-sub al-font-bold al-text-xs al-mb-1" style="display:block;">切換狀態</label>
          <select id="home-status" class="al-input">${statusOptions}</select>
        </div>

        <div class="al-mb-3 al-mt-3">
          <label class="al-text-sub al-font-bold al-text-xs al-mb-1" style="display:block;">手動修改 ID</label>
          <div class="al-flex al-gap-2">
            <input type="number" id="home-edit-id" class="al-input" value="${rule.id}">
            <button id="home-save-id" class="al-btn al-btn-outline">更新</button>
          </div>
        </div>

        <button id="btn-unbind" class="al-btn al-btn-danger al-btn-block al-mt-4">解除所有綁定</button>
      </div>
    `;
    },
    homeUnbound: (candidate, searchName) => {
      let suggestionHtml = '';
      if (candidate) {
        suggestionHtml = `
          <div class="al-card al-card-suggest al-mb-3">
            <div class="al-font-bold al-text-warn al-text-xs al-mb-1">💡 建議匹配</div>
            <div class="al-flex al-gap-3">
              <a href="https://anilist.co/anime/${candidate.id}" target="_blank">
                <img src="${candidate.coverImage.medium}" class="al-cover al-cover-md">
              </a>
              <div class="al-flex-1">
                <a href="https://anilist.co/anime/${
                  candidate.id
                }" target="_blank" class="al-link al-font-bold">
                  ${candidate.title.native}
                </a>
                <div class="al-text-sub al-text-xs">${candidate.title.romaji}</div>
                <div class="al-text-sub al-text-xs al-mt-2">
                   ${Utils.formatDate(candidate.startDate)} | ${candidate.format}
                </div>
              </div>
              <button id="btn-quick" class="al-btn al-btn-primary al-btn-sm" style="align-self:center;">綁定</button>
            </div>
          </div>
        `;
      }

      return `
        <div class="al-p-4">
          ${suggestionHtml}
          <div class="al-flex al-gap-2">
            <input id="search-in" class="al-input" value="${
              searchName || ''
            }" placeholder="搜尋作品...">
            <button id="btn-search" class="al-btn al-btn-primary">搜尋</button>
          </div>
          <div id="search-res" class="al-mt-4 al-flex-col al-gap-2"></div>
        </div>
      `;
    },
    searchResult: (m) => {
      return `
      <div class="al-flex al-gap-3 al-items-center al-p-2" style="border-bottom:1px solid var(--al-border);">
        <a href="https://anilist.co/anime/${m.id}" target="_blank">
          <img src="${m.coverImage.medium}" class="al-cover al-cover-sm">
        </a>
        <div class="al-flex-1" style="overflow:hidden;">
          <a href="https://anilist.co/anime/${
            m.id
          }" target="_blank" class="al-link al-font-bold al-text-sm">
            ${m.title.native || m.title.romaji}
          </a>
          <div class="al-text-sub al-text-xs" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${m.title.romaji}
          </div>
          <div class="al-text-sub al-text-xs">
            ${Utils.formatDate(m.startDate)} | ${m.format} | ${m.episodes || '?'}集
          </div>
        </div>
        <button class="al-btn al-btn-primary al-btn-sm bind-it" 
          data-id="${m.id}" 
          data-title="${Utils.deepSanitize(m.title.native || m.title.romaji)}">綁定</button>
      </div>
    `;
    },
    seriesRow: (m, isActive, isSuggestion, isOut, bahaVal, aniVal) => {
      const displayStart = m.calculatedStart !== undefined ? m.calculatedStart : '';
      let statusHtml, rowClass, btnTxt, btnClass;

      if (isActive) {
        statusHtml = `<span class="al-tag success">使用中</span>`;
        rowClass = 'al-row-active';
        btnTxt = '取消';
        btnClass = 'al-btn-danger al-btn-sm';
      } else if (isSuggestion) {
        statusHtml = `<span class="al-tag warn">建議</span>`;
        rowClass = 'al-row-suggest';
        btnTxt = '套用';
        btnClass = 'al-btn-primary al-btn-sm';
      } else if (isOut) {
        statusHtml = `<span class="al-tag error">非本頁</span>`;
        rowClass = '';
        btnTxt = '啟用';
        btnClass = 'al-btn-outline al-btn-sm';
      } else {
        statusHtml = `<span class="al-tag default">未使用</span>`;
        rowClass = '';
        btnTxt = '啟用';
        btnClass = 'al-btn-outline al-btn-sm';
      }

      let defaultAniVal = '';
      if (isActive) {
        defaultAniVal = aniVal;
      } else if (isSuggestion) {
        defaultAniVal = 1;
      }

      return `
        <tr class="series-row ${rowClass}" data-id="${m.id}" data-title="${Utils.deepSanitize(
          m.title.native || m.title.romaji,
        )}">
          <td style="text-align:center; width:80px;">
             ${statusHtml}
             <input type="checkbox" class="cb-active" style="display:none;" ${
               isActive ? 'checked' : ''
             }>
          </td>
          <td>
            <div class="al-flex al-gap-3 al-items-center">
               <a href="https://anilist.co/anime/${m.id}" target="_blank" class="al-shrink-0">
                 <img src="${m.coverImage.medium}" class="al-cover al-cover-sm">
               </a>
               <div style="min-width:0;">
                 <a href="https://anilist.co/anime/${
                   m.id
                 }" target="_blank" class="al-link al-text-sm al-font-bold al-mb-1" style="display:block; line-height:1.3;">
                   ${m.title.native || m.title.romaji}
                 </a>
                 <div class="al-text-sub al-text-xs">
                  ${Utils.formatDate(m.startDate)} | ${m.format}</div>
               </div>
            </div>
          </td>
          <td style="text-align:center; width:50px;">${m.episodes || '?'}</td>
          <td style="text-align:center; width:70px;">
             <input type="number" class="inp-start al-input al-input-sm" placeholder="巴哈" 
               value="${bahaVal !== undefined ? bahaVal : ''}" style="width:100%;">
          </td>
          <td style="text-align:center; width:20px; color:var(--al-text-sub);">⮕</td>
          <td style="text-align:center; width:70px;">
             <input type="number" class="inp-ani-start al-input al-input-sm" placeholder="Ani" 
               value="${defaultAniVal}" style="width:100%;">
          </td>
          <td style="text-align:center; width:80px;">
             <button class="al-btn btn-toggle ${btnClass}" data-suggested="${displayStart}">${btnTxt}</button>
          </td>
        </tr>
      `;
    },
  };

  const UI = {
    statusTimer: null,
    showToast(msg) {
      const old = _.$('.al-toast');
      if (old) {
        old.remove();
      }
      const t = _.html(`<div class="al-toast">${msg}</div>`);
      document.body.appendChild(t);
      _.fadeIn(t, 'block');
      setTimeout(() => {
        _.fadeOut(t);
        setTimeout(() => {
          return t.remove();
        }, 300);
      }, 2500);
    },
    checkTheme() {
      const modalContent = _.$('.al-modal-content');
      if (!modalContent) {
        return;
      }

      const moonBtn = document.getElementById('darkmode-moon');
      // 如果月亮按鈕存在且被勾選，則加入 dark class
      if (moonBtn && moonBtn.checked) {
        modalContent.classList.add('al-theme-dark');
      } else {
        modalContent.classList.remove('al-theme-dark');
      }
    },
    initNavbar(nav) {
      if (_.$('#al-trigger')) {
        return;
      }
      const li = _.html(
        `<li class="al-nav-item">
          <a class="al-nav-link" id="al-trigger">
            <span id="al-icon">⚪</span>
            <span id="al-text">AniList</span>
            <span id="al-user-status" class="al-user-status"></span>
            <span id="al-title" class="al-nav-title" style="display:none;"></span>
          </a>
        </li>`,
      );
      nav.appendChild(li);

      _.$('#al-trigger').addEventListener('click', () => {
        return this.openModal();
      });

      // Modal 結構建立
      const modal = _.html(
        `<div id="al-modal" class="al-modal-overlay">
          <div class="al-modal-content">
            <div class="al-modal-header">
              <strong>AniList 設定</strong>
              <button class="al-close-btn">&times;</button>
            </div>
            <div class="al-modal-body" id="al-modal-body"></div>
          </div>
        </div>`,
      );
      document.body.appendChild(modal);

      _.$('.al-close-btn', modal).addEventListener('click', () => {
        return _.fadeOut(modal);
      });
      modal.addEventListener('click', (e) => {
        if (e.target.id === 'al-modal') {
          _.fadeOut(modal);
        }
      });

      // 深色模式切換按鈕
      const themeRadios = document.querySelectorAll('input[name="darkmode"]');
      themeRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
          return this.checkTheme();
        });
      });

      // 初始化時檢查一次主題
      this.checkTheme();
    },
    updateNav(type, msg) {
      const $icon = _.$('#al-icon'),
        $text = _.$('#al-text'),
        $title = _.$('#al-title'),
        $uStatus = _.$('#al-user-status');

      if (!$icon || !$text || !$title || !$uStatus) {
        return;
      }

      if (this.statusTimer) {
        clearTimeout(this.statusTimer);
        this.statusTimer = null;
      }
      const rule = State.activeRule;
      const showTitle =
        rule &&
        [
          CONSTANTS.STATUS.BOUND,
          CONSTANTS.STATUS.SYNCING,
          CONSTANTS.STATUS.DONE,
          CONSTANTS.STATUS.INFO,
        ].includes(type);

      if (showTitle) {
        $title.textContent = rule.title;
        $title.title = rule.title;
        $title.style.display = 'inline-block';
        if (State.userStatus) {
          const { status, progress } = State.userStatus;
          const statusConfig = CONSTANTS.ANI_STATUS[status];
          let stTxt = statusConfig ? statusConfig.label : '';
          if (progress > 0) {
            stTxt += `【Ep.${progress}】`;
          }
          if (stTxt) {
            $uStatus.textContent = stTxt;
            $uStatus.style.display = 'inline-block';
          }
        } else {
          $uStatus.style.display = 'none';
        }
      } else {
        $title.style.display = 'none';
        $uStatus.style.display = 'none';
      }

      const map = {
        [CONSTANTS.STATUS.TOKEN_ERROR]: { i: '⚠️', t: '設定 Token' },
        [CONSTANTS.STATUS.UNBOUND]: { i: '🔗', t: '連結 AniList' },
        [CONSTANTS.STATUS.BOUND]: { i: '✅', t: '已連動' },
        [CONSTANTS.STATUS.SYNCING]: { i: '🔄', t: msg },
        [CONSTANTS.STATUS.DONE]: { i: '✅', t: msg },
        [CONSTANTS.STATUS.ERROR]: { i: '❌', t: msg },
        [CONSTANTS.STATUS.INFO]: { i: 'ℹ️', t: msg },
      };
      const setting = map[type] || map[CONSTANTS.STATUS.UNBOUND];
      $icon.textContent = setting.i;
      $text.textContent = setting.t;

      if (type === CONSTANTS.STATUS.DONE || type === CONSTANTS.STATUS.INFO) {
        this.statusTimer = setTimeout(() => {
          UI.updateNav(CONSTANTS.STATUS.BOUND);
        }, 5000);
      }
    },
    openModal() {
      _.fadeIn(_.$('#al-modal'), 'flex');
      this.renderTabs();
    },
    renderTabs() {
      const isVideo = location.href.includes(CONSTANTS.URLS.VIDEO_PAGE);
      const hasRules = State.rules.length > 0;
      const hasToken = !!GM_getValue(CONSTANTS.KEYS.TOKEN);

      // 邏輯：有 Token 且在看影片 -> 預設 Home，否則預設 Settings
      let activeTab = hasToken ? (isVideo ? 'home' : 'settings') : 'settings';

      const body = _.$('#al-modal-body');

      body.innerHTML = Templates.tabs(activeTab, isVideo, hasRules);

      _.$$('.al-tab-item', body).forEach((btn) => {
        btn.addEventListener('click', () => {
          if (btn.disabled || btn.classList.contains('active')) {
            return;
          }
          _.$$('.al-tab-item').forEach((b) => {
            return b.classList.remove('active');
          });
          btn.classList.add('active');
          _.$$('.al-tab-pane').forEach((c) => {
            return c.classList.remove('active');
          });
          const targetPane = _.$(`#tab-${btn.dataset.tab}`);
          if (targetPane) {
            targetPane.classList.add('active');
          }
          UI.loadTabContent(btn.dataset.tab);
        });
      });

      this.loadTabContent(activeTab);
    },
    loadTabContent(tabName) {
      const container = _.$(`#tab-${tabName}`);
      container.innerHTML = '';
      if (tabName === 'settings') {
        this.renderSettings(container);
      } else if (tabName === 'series') {
        this.renderSeries(container);
      } else {
        if (State.rules.length > 0) {
          this.renderHomeBound(container);
        } else {
          this.renderHomeUnbound(container);
        }
      }
    },
    renderSettings(container) {
      const token = GM_getValue(CONSTANTS.KEYS.TOKEN, '');
      const mode = GM_getValue(CONSTANTS.KEYS.SYNC_MODE, 'instant');
      const savedCustomSeconds = GM_getValue(CONSTANTS.KEYS.CUSTOM_SEC, 60);

      container.innerHTML = Templates.settings(token, mode, savedCustomSeconds);

      _.$('#toggle-token-btn', container).addEventListener('click', function () {
        const inp = _.$('#set-token', container);
        if (inp.type === 'password') {
          inp.type = 'text';
          this.innerHTML = ICONS.EYE_OPEN;
        } else {
          inp.type = 'password';
          this.innerHTML = ICONS.EYE_OFF;
        }
      });

      const toggleCustom = () => {
        _.$('#custom-sec-group', container).style.display =
          _.$('#set-mode', container).value === 'custom' ? 'flex' : 'none';
      };
      toggleCustom();
      _.$('#set-mode', container).addEventListener('change', toggleCustom);

      const updateAuth = () => {
        const id = _.$('#client-id', container).value.trim();
        const btn = _.$('#auth-link', container);
        if (id.length > 0) {
          btn.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${id}&response_type=token`;
          btn.style.cssText = 'opacity:1;cursor:pointer;pointer-events:auto;background:#3db4f2;';
          btn.textContent = '前往授權';
        } else {
          btn.href = 'javascript:void(0)';
          btn.style.cssText = 'opacity:0.5;cursor:not-allowed;pointer-events:none;background:#555;';
          btn.textContent = '請輸入 ID';
        }
      };
      _.$('#client-id', container).addEventListener('input', updateAuth);
      updateAuth();

      _.$('#ref-url-btn', container).addEventListener('click', function () {
        GM_setClipboard('https://anilist.co/api/v2/oauth/pin');
        UI.showToast('✅ 網址已複製！');
      });
      _.$('#save-set', container).addEventListener('click', () => {
        const newToken = _.$('#set-token', container).value.trim();
        const newMode = _.$('#set-mode', container).value;
        const customSec = parseInt(_.$('#set-custom-sec', container).value);
        if (!newToken) {
          return UI.showToast('❌ 請輸入 Token');
        }
        if (newMode === 'custom' && (isNaN(customSec) || customSec < 1)) {
          return UI.showToast('❌ 請輸入有效的秒數(最少1秒)');
        }
        GM_setValue(CONSTANTS.KEYS.TOKEN, newToken);
        GM_setValue(CONSTANTS.KEYS.SYNC_MODE, newMode);
        if (!isNaN(customSec)) {
          GM_setValue(CONSTANTS.KEYS.CUSTOM_SEC, customSec);
        }
        UI.showToast('✅ 設定已儲存，重新整理中...');
        setTimeout(() => {
          return location.reload();
        }, 800);
      });
    },
    async renderHomeBound(container) {
      container.innerHTML = '<div class=".al-p-4">讀取中...</div>';

      let rule = State.activeRule;
      let isUnknownEp = false;

      // 如果當前集數沒有對應規則，則借用第一條規則的 ID 來顯示資訊
      if (!rule) {
        if (State.rules.length > 0) {
          rule = State.rules[0]; // 借用系列 ID
          isUnknownEp = true; // 標記為未知集數
        } else {
          return this.renderHomeUnbound(container);
        }
      }

      try {
        const info = await App.getMediaData(rule.id);
        const statusData = info.mediaListEntry;
        State.userStatus = statusData;
        UI.updateNav(CONSTANTS.STATUS.BOUND);

        const currentStatus = statusData?.status || 'NOT_IN_LIST';

        let opts =
          currentStatus === 'NOT_IN_LIST'
            ? `<option value="NOT_IN_LIST" selected>尚未加入清單 (Not in List)</option>`
            : '';

        Object.values(CONSTANTS.ANI_STATUS).forEach((setting) => {
          const isSelected = currentStatus === setting.value ? 'selected' : '';
          opts += `<option value="${setting.value}" ${isSelected}>
          ${setting.label} (${setting.anilist_label})</option>`;
        });

        const warningHtml = isUnknownEp
          ? `<div class="al-p-3 al-mb-3" style="background:#fff3cd; color:#856404; border-radius:4px; font-size:12px; border:1px solid #ffeeba;">
                 ⚠️ 當前集數無法判定 (如小數點集數或特別篇)，<b>已暫停自動同步</b>，但您仍可手動管理狀態。
               </div>`
          : '';

        container.innerHTML = `
            ${warningHtml}
            ${Templates.homeBound(rule, info, statusData, opts)}
        `;

        _.$('#home-status', container).addEventListener('change', async function () {
          const s = this.value;
          if (s === 'NOT_IN_LIST') {
            return;
          }
          this.disabled = true;
          try {
            const newS = await AniListAPI.updateUserStatus(rule.id, s);
            App.updateLocalStatus(rule.id, newS);
            UI.showToast('✅ 狀態已更新');
            UI.loadTabContent('home');
          } catch (e) {
            UI.showToast('❌ 更新失敗: ' + e.message);
            this.disabled = false;
          }
        });

        _.$('#home-save-id', container).addEventListener('click', () => {
          const nid = parseInt(_.$('#home-edit-id', container).value);
          if (nid) {
            App.bindSeries(nid, '手動更新');
          }
        });

        _.$('#btn-unbind', container).addEventListener('click', () => {
          if (confirm('確定要解除此作品的所有綁定嗎？')) {
            GM_deleteValue(`${CONSTANTS.STORAGE_PREFIX}${State.bahaSn}`);
            location.reload();
          }
        });

        _.$('#btn-refresh-data', container)?.addEventListener('click', function () {
          State.cachedMediaInfo = null;
          UI.loadTabContent('home');
        });
      } catch (e) {
        container.innerHTML = `<div class=".al-p-4" style="color:red;">Error: ${e.message}</div>`;
      }
    },
    renderHomeUnbound(container) {
      const data = State.bahaData || {};
      container.innerHTML = Templates.homeUnbound(State.candidate, data.nameJp);

      if (State.candidate) {
        _.$('#btn-quick', container).addEventListener('click', () => {
          return App.bindSeries(State.candidate.id, State.candidate.title.native);
        });
      }

      const doSearch = async () => {
        const resContainer = _.$('#search-res', container);
        resContainer.innerHTML = '<div style="text-align:center;color:#666;">搜尋中...</div>';
        try {
          const res = await AniListAPI.search(_.$('#search-in', container).value);
          let html = '';
          const list = res.data.Page.media || [];
          if (list.length === 0) {
            html = '<div style="text-align:center;color:#666;">找不到結果</div>';
          } else {
            list.forEach((m) => {
              html += Templates.searchResult(m);
            });
          }
          resContainer.innerHTML = html;
          _.$$('.bind-it', resContainer).forEach((btn) => {
            btn.addEventListener('click', function () {
              App.bindSeries(this.dataset.id, this.dataset.title);
            });
          });
        } catch (e) {
          resContainer.innerHTML = `<div style="color:red;">Error: ${e.message}</div>`;
        }
      };

      _.$('#btn-search', container).addEventListener('click', doSearch);
      _.$('#search-in', container).addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          doSearch();
        }
      });
      if (data.nameJp) {
        doSearch();
      }
    },
    async renderSeries(container) {
      container.innerHTML =
        '<div class=".al-p-4" style="text-align:center;">讀取系列資訊中...</div>';

      const activeRules = State.rules;
      let baseRule = State.activeRule;

      // 如果 activeRule 不在 rules 列表裡，或者根本沒 activeRule
      if (
        !baseRule ||
        !activeRules.find((r) => {
          return r.id === baseRule.id;
        })
      ) {
        baseRule = activeRules.length > 0 ? activeRules[0] : null;
      }

      if (!baseRule && activeRules.length === 0) {
        container.innerHTML =
          '<div class=".al-p-4" style="text-align:center;color:#999;">請先在主頁綁定作品</div>';
        return;
      }

      const searchId = baseRule ? baseRule.id : null;

      try {
        let chain;
        if (State.cachedSeriesChain && State.cachedSeriesBaseId === searchId) {
          chain = State.cachedSeriesChain;
        } else {
          chain = await AniListAPI.getSequelChain(searchId);
          State.cachedSeriesChain = chain;
          State.cachedSeriesBaseId = searchId;
        }

        // 1. 取得頁面現況範圍
        const pageMin = EpisodeCalculator.getMin();
        const pageMax = EpisodeCalculator.getMax();

        // 如果有綁定過，用綁定的值當錨點；否則用頁面最小值
        const anchorStart = baseRule ? baseRule.bahaStart || baseRule.start : pageMin || 1;

        SeriesLogic.calculateOffsets(chain, searchId, anchorStart);

        let rowsHtml = '';
        chain.forEach((m) => {
          const existing = State.rules.find((r) => {
            return r.id === m.id;
          });
          const isActive = !!existing;

          let isOut = true;

          if (m.suggestedStart !== undefined) {
            const mEnd = m.episodes ? m.suggestedStart + m.episodes - 1 : 999999;
            isOut = pageMax > 0 ? m.suggestedStart > pageMax || mEnd < pageMin : false;
          }

          const isSuggestion = !isActive && !isOut;

          let bahaVal;
          if (existing) {
            if (existing.bahaStart !== undefined) {
              // 優先使用 bahaStart
              bahaVal = existing.bahaStart;
            } else {
              // 否則使用 start
              bahaVal = existing.start;
            }
          } else if (isSuggestion) {
            // 沒有 existing，但有建議
            bahaVal = m.suggestedStart;
          } else {
            // 都沒有
            bahaVal = '';
          }

          const aniVal = existing ? (existing.aniStart !== undefined ? existing.aniStart : 1) : 1;

          rowsHtml += Templates.seriesRow(m, isActive, isSuggestion, isOut, bahaVal, aniVal);
        });
        container.innerHTML = `
          <div class="al-p-4">
              <div class="al-mb-3" style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="al-font-bold al-text-sub">系列作設定 (本頁範圍: 
                    ${pageMin || '?'}~${pageMax || '?'})</span>
                  <button id="btn-refresh-series" class="al-btn al-btn-outline al-btn-sm" title="強制重新抓取">
                    🔄 刷新
                  </button>
              </div>
              <table class="al-table">
                  <thead>
                      <tr>
                          <th style="width:80px; text-align:center;">狀態</th>
                          <th>作品</th>
                          <th style="width:50px; text-align:center;">總集</th>
                          <th style="width:70px; text-align:center;">巴哈起始</th>
                          <th style="width:20px;"></th>
                          <th style="width:70px; text-align:center;">Ani起始</th>
                          <th style="width:70px; text-align:center;">操作</th>
                      </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
              </table>
              <button id="save-series" class="al-btn al-btn-success al-btn-block al-mt-4">儲存系列設定</button>
          </div>
      `;

        const updateRow = (row, active, val) => {
          const btn = _.$('.btn-toggle', row);
          const statusSpan = _.$('.al-tag', row);
          const cb = _.$('.cb-active', row);
          const inp = _.$('.inp-start', row);
          const inpAni = _.$('.inp-ani-start', row);

          cb.checked = active;
          row.classList.remove('al-row-active', 'al-row-suggest');
          statusSpan.classList.remove('success', 'warn', 'error', 'default');
          btn.classList.remove('al-btn-primary', 'al-btn-danger', 'al-btn-outline');
          btn.classList.add('al-btn', 'btn-toggle', 'al-btn-sm');

          if (active) {
            row.classList.add('al-row-active');

            statusSpan.textContent = '使用中';
            statusSpan.classList.add('success'); // 綠色標籤

            btn.textContent = '取消';
            btn.classList.add('al-btn-danger'); // 紅色按鈕

            // 自動填入建議值
            if (val !== undefined && val !== '') {
              inp.value = val;
            }
            if (inpAni.value === '') {
              inpAni.value = 1;
            }
          } else {
            statusSpan.textContent = '未用';
            statusSpan.classList.add('default'); // 灰色標籤

            btn.textContent = '啟用';
            btn.classList.add('al-btn-outline'); // 線框按鈕

            inp.value = '';
          }
        };

        _.$$('.btn-toggle', container).forEach((btn) => {
          btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const cb = _.$('.cb-active', row);
            if (cb.checked) {
              updateRow(row, false);
            } else {
              updateRow(row, true, this.dataset.suggested || '');
            }
          });
        });

        _.$$('.inp-start', container).forEach((inp) => {
          inp.addEventListener('input', function () {
            const row = this.closest('tr');
            if (this.value) {
              updateRow(row, true);
            } else {
              updateRow(row, false);
            }
          });
        });

        _.$('#btn-refresh-series', container).addEventListener('click', async function () {
          State.cachedSeriesChain = null;
          UI.renderSeries(container);
        });

        _.$('#save-series', container).addEventListener('click', () => {
          const newRules = [];
          _.$$('.series-row', container).forEach((row) => {
            const cb = _.$('.cb-active', row);
            const bahaVal = parseInt(_.$('.inp-start', row).value);
            const aniVal = parseInt(_.$('.inp-ani-start', row).value);

            // 允許輸入 0，只要不是 NaN 即可
            if (cb.checked && !isNaN(bahaVal) && !isNaN(aniVal)) {
              newRules.push({
                start: bahaVal, // 用於排序
                bahaStart: bahaVal, // 儲存明確變數
                aniStart: aniVal, // 儲存明確變數
                id: parseInt(row.dataset.id),
                title: row.dataset.title,
              });
            }
          });
          if (newRules.length === 0) {
            return UI.showToast('❌ 至少需要設定一個起始集數');
          }

          App.saveRules(newRules);

          UI.showToast('✅ 系列設定已儲存，請重新整理');
          _.fadeOut(_.$('#al-modal'));
        });
      } catch (e) {
        container.innerHTML = `<div class=".al-p-4" style="color:red;">載入失敗: ${e.message}</div>`;
      }
    },
  };
  // #endregion

  // #region ================= [App] 主程式控制器 =================
  const App = {
    init() {
      Utils.validatePage(); //檢查CSS選擇器
      if (!GM_getValue(CONSTANTS.KEYS.TOKEN)) {
        Log.warn('Token 未設定');
      }
      this.waitForNavbar();
      this.startMonitor();
      this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    },
    async waitForNavbar() {
      const indexLink = await _.waitForElement('a[href="index.php"]');

      if (indexLink) {
        const nav = indexLink.closest('ul');
        if (nav) {
          UI.initNavbar(nav);
          this.updateUIStatus();
        }
      } else {
        Log.warn('Navbar not found (Timeout)');
      }
    },
    startMonitor() {
      this.checkUrlChange();
      setInterval(() => {
        return this.checkUrlChange();
      }, 1000);
    },
    checkUrlChange() {
      if (!location.href.includes(CONSTANTS.URLS.VIDEO_PAGE)) {
        return;
      }
      const params = new URLSearchParams(location.search);
      const newSn = params.get('sn');
      if (newSn && newSn !== State.currentUrlSn) {
        State.currentUrlSn = newSn;
        this.resetEpisodeState();
        this.loadEpisodeData();
        this.startVideoHunt();
      }
    },
    resetEpisodeState() {
      const video = document.querySelector(CONSTANTS.SELECTORS.PAGE.videoElement);
      if (video) {
        video.removeEventListener('timeupdate', this.handleTimeUpdate);
      }
      State.hasSynced = false;
      State.isHunting = false;
      State.stopSync = false;
      State.tokenErrorCount = 0;
      State.lastTimeUpdate = 0;
    },
    async loadEpisodeData() {
      const acgLink = this.getAcgLink();
      if (!acgLink) {
        return;
      }
      State.bahaSn = new URLSearchParams(acgLink.split('?')[1]).get('s');
      if (!State.bahaData) {
        State.bahaData = await this.fetchBahaData(acgLink);
      }
      const savedRules = GM_getValue(`${CONSTANTS.STORAGE_PREFIX}${State.bahaSn}`);
      if (savedRules) {
        if (Array.isArray(savedRules)) {
          State.rules = savedRules;
        } else {
          State.rules = [
            {
              start: 1,
              id: savedRules.id || savedRules,
              title: savedRules.title || 'Unknown',
            },
          ];
        }
        State.rules.sort((a, b) => {
          return b.start - a.start;
        });
      } else {
        State.rules = [];
        if (GM_getValue(CONSTANTS.KEYS.TOKEN)) {
          this.tryAutoBind();
        }
      }
      await this.determineActiveRule();
      this.updateUIStatus();
    },
    getAcgLink() {
      const el = document.querySelector(CONSTANTS.SELECTORS.PAGE.acgLink);
      if (el) {
        return el.getAttribute('href');
      }
      const alt = [...document.querySelectorAll(CONSTANTS.SELECTORS.PAGE.acgLinkAlt)].find((a) => {
        return a.textContent.includes('作品資料');
      });
      return alt ? alt.getAttribute('href') : null;
    },
    async determineActiveRule() {
      if (State.rules.length === 0) {
        State.activeRule = null;
        return;
      }
      const currentEp = EpisodeCalculator.getRawCurrent();

      // 如果 currentEp 是 null，則不套用任何規則
      if (currentEp !== null) {
        State.activeRule =
          State.rules.find((r) => {
            return currentEp >= r.start;
          }) || State.rules[State.rules.length - 1];
      } else {
        // 正在看小數點集數，暫時不對應規則
        State.activeRule = null;
      }
      if (State.activeRule && GM_getValue(CONSTANTS.KEYS.TOKEN)) {
        try {
          const data = await AniListAPI.getMediaAndStatus(State.activeRule.id);
          if (data.mediaListEntry) {
            State.userStatus = data.mediaListEntry;
          } else {
            State.userStatus = null;
          }
          State.cachedMediaInfo = data;
          this.updateUIStatus();
        } catch (e) {
          Log.error('Fetch status error:', e);
        }
      }
    },
    async startVideoHunt() {
      if (State.isHunting) {
        return;
      }
      State.isHunting = true;
      if (State.rules.length > 0) {
        UI.updateNav(CONSTANTS.STATUS.SYNCING, '搜尋播放器...');
      }
      State.syncSettings = {
        mode: GM_getValue(CONSTANTS.KEYS.SYNC_MODE, 'instant'),
        custom: GM_getValue(CONSTANTS.KEYS.CUSTOM_SEC, 60),
      };

      const video = await _.waitForElement(CONSTANTS.SELECTORS.PAGE.videoElement, 120000);
      if (video) {
        if (video.dataset.alHooked !== State.currentUrlSn) {
          video.dataset.alHooked = State.currentUrlSn;
          video.addEventListener('timeupdate', this.handleTimeUpdate);

          State.isHunting = false;

          if (State.rules.length > 0) {
            UI.updateNav(CONSTANTS.STATUS.BOUND);
          }
        }
      } else {
        State.isHunting = false;
        Log.warn('Video player search timeout');
      }
    },
    handleTimeUpdate(e) {
      if (State.hasSynced || State.stopSync) {
        return;
      }
      const now = Date.now();
      if (now - State.lastTimeUpdate < 1000) {
        return;
      }
      State.lastTimeUpdate = now;

      const video = e.target;

      // 廣告判斷不更新
      const playerContainer = video.closest('.video-js');
      const isAdClass = playerContainer && playerContainer.classList.contains('vjs-ad-playing');
      const isTooShort = !video.duration || video.duration < 90;

      if (isAdClass || isTooShort) {
        Log.info('Skipping: Ad detected or video too short.');
        return;
      }

      const { mode, custom } = State.syncSettings;
      let shouldSync = false;

      if (mode === CONSTANTS.SYNC_MODES.INSTANT.value) {
        shouldSync = video.currentTime > 5;
      } else if (mode === CONSTANTS.SYNC_MODES.TWO_MIN.value) {
        shouldSync = video.currentTime > 120;
      } else if (mode === CONSTANTS.SYNC_MODES.EIGHTY_PCT.value) {
        shouldSync = video.duration > 0 && video.currentTime / video.duration > 0.8;
      } else if (mode === CONSTANTS.SYNC_MODES.CUSTOM.value) {
        shouldSync = video.currentTime > custom;
      }

      if (shouldSync) {
        State.hasSynced = true;
        this.syncProgress();
      }
    },
    async getMediaData(id) {
      if (State.cachedMediaInfo && State.cachedMediaInfo.id === id) {
        Log.info('Using Cached Data (App.getMediaData)');
        return State.cachedMediaInfo;
      }
      const data = await AniListAPI.getMediaAndStatus(id);
      State.cachedMediaInfo = data;
      return data;
    },
    saveRules(newRules) {
      newRules.sort((a, b) => {
        return b.start - a.start;
      });
      State.rules = newRules;
      GM_setValue(`${CONSTANTS.STORAGE_PREFIX}${State.bahaSn}`, newRules);
      this.determineActiveRule().then(() => {
        this.updateUIStatus();
      });
      Log.info('Rules saved and updated.');
    },
    updateLocalStatus(targetId, newStatusEntry) {
      State.userStatus = newStatusEntry;
      if (State.cachedMediaInfo && State.cachedMediaInfo.id === targetId) {
        State.cachedMediaInfo.mediaListEntry = newStatusEntry;
      }
    },
    async syncProgress() {
      // 1. 取得按鈕上的原始數字
      const rawEp = EpisodeCalculator.getRawCurrent();

      // 2. 如果是 null或沒規則，直接結束，不同步
      if (rawEp === null || !State.activeRule) {
        return;
      }

      const rule = State.activeRule;

      // 3. 讀取設定值
      const bahaStart = rule.bahaStart !== undefined ? rule.bahaStart : rule.start;
      const aniStart = rule.aniStart !== undefined ? rule.aniStart : 1;

      // 4. 公式：按鈕數字 - 巴哈起始 + AniList起始
      // 範例：第80集 (80 - 1 + 1 = 80)、第0集 (0 - 0 + 1 = 1)
      let progress = rawEp - bahaStart + aniStart;

      UI.updateNav(CONSTANTS.STATUS.SYNCING, `同步 Ep.${progress}...`);
      Log.info(`Syncing progress: Ep.${progress} for media ${rule.id}`);

      try {
        const data = await App.getMediaData(rule.id);

        const maxEp = data.episodes;
        const checkData = data.mediaListEntry; // 從合併資料中取得狀態

        if (maxEp && progress > maxEp) {
          Log.info(`Progress clamped from ${progress} to ${maxEp}`);
          progress = maxEp;
        }

        if (
          checkData?.status === CONSTANTS.ANI_STATUS.COMPLETED.value &&
          checkData?.progress === maxEp
        ) {
          UI.updateNav(CONSTANTS.STATUS.INFO, '略過同步(已完成)');
          return;
        } else if (
          checkData?.status === CONSTANTS.ANI_STATUS.PLANNING.value ||
          checkData?.status === CONSTANTS.ANI_STATUS.PAUSED.value
        ) {
          Log.info(`Auto switching status from ${checkData?.status} to CURRENT`);
          await AniListAPI.updateUserStatus(rule.id, CONSTANTS.ANI_STATUS.CURRENT.value);
        }

        if (checkData?.progress === progress) {
          UI.updateNav(CONSTANTS.STATUS.INFO, '略過同步(已同步)');
          return;
        }

        let result = await AniListAPI.updateUserProgress(rule.id, progress);
        this.updateLocalStatus(rule.id, result);

        if (maxEp && progress === maxEp && result.status !== CONSTANTS.ANI_STATUS.COMPLETED.value) {
          Log.info('Auto completing media...');
          result = await AniListAPI.updateUserStatus(rule.id, CONSTANTS.ANI_STATUS.COMPLETED.value);
          State.userStatus = result; // 若有自動完結，再次更新狀態
          UI.updateNav(CONSTANTS.STATUS.DONE, `已同步 Ep.${progress} (完結)`);
        } else {
          UI.updateNav(CONSTANTS.STATUS.DONE, `已同步 Ep.${progress}`);
        }
      } catch (e) {
        const errStr = e.message;
        UI.updateNav(CONSTANTS.STATUS.ERROR, '同步失敗');
        if (errStr.includes('Token') || errStr.includes('Invalid Token')) {
          State.tokenErrorCount++;
          if (State.tokenErrorCount >= 3) {
            State.stopSync = true;
          }
          UI.updateNav(CONSTANTS.STATUS.TOKEN_ERROR);
        } else if (errStr.includes('Too Many Requests')) {
          State.stopSync = true;
          UI.showToast('⚠️ 請求過於頻繁，已暫停同步');
        } else {
          UI.updateNav(CONSTANTS.STATUS.ERROR, '同步失敗');
          setTimeout(() => {
            State.hasSynced = false;
          }, CONSTANTS.SYNC_DEBOUNCE_MS);
        }
      }
    },
    async tryAutoBind() {
      if (!State.bahaData) {
        return;
      }

      UI.updateNav(CONSTANTS.STATUS.SYNCING, '自動匹配中...');

      const strategies = [
        // 1.使用日文或英文名搜尋，並比對開播日期
        {
          name: 'NameSearch',
          execute: async () => {
            const { nameEn, nameJp, dateJP, dateTW } = State.bahaData;
            const terms = [nameEn, nameJp].filter(Boolean);

            for (let term of terms) {
              try {
                const res = await AniListAPI.search(term);
                const list = res.data.Page.media || [];

                if (list.length > 0 && !State.candidate) {
                  State.candidate = list[0];
                }

                const match = list.find((media) => {
                  return (
                    Utils.isDateCloseEnough(dateJP.obj, media.startDate) ||
                    Utils.isDateCloseEnough(dateTW.obj, media.startDate)
                  );
                });

                if (match) {
                  return match;
                }
              } catch (e) {
                Log.warn(`[AutoBind] NameSearch Error (${term}):`, e);
              }
            }
            return null;
          },
        },
        // 2.當名字搜不到時，改搜前後幾天開播的所有動畫，再比對官網網域
        {
          name: 'DateRangeDomainSearch',
          execute: async () => {
            const { dateJP, dateTW, site } = State.bahaData;
            if (!site) {
              return null;
            }

            const range = Utils.getFuzzyDateRange(
              dateJP.obj || dateTW.obj,
              CONSTANTS.SEARCH_RANGE_DAYS,
            );

            if (!range) {
              return null;
            }

            try {
              const res = await AniListAPI.searchByDateRange(range.start, range.end);
              const list = res.data.Page.media || [];

              return list.find((media) => {
                const domainMatch = media.externalLinks?.some((l) => {
                  return Utils.extractDomain(l.url)?.includes(site);
                });
                // 雙重確認：網域對了，日期也要大致對
                const dateMatch =
                  Utils.isDateCloseEnough(dateJP.obj, media.startDate) ||
                  Utils.isDateCloseEnough(dateTW.obj, media.startDate);
                return domainMatch && dateMatch;
              });
            } catch (e) {
              Log.warn('[AutoBind] DateRangeSearch Error:', e);
              return null;
            }
          },
        },
      ];

      let match = null;
      for (const strategy of strategies) {
        Log.info(`Executing AutoBind Strategy: ${strategy.name}`);
        match = await strategy.execute();
        if (match) {
          Log.info(`[AutoBind] Matched by ${strategy.name}:`, match.title.native);
          break;
        }
      }

      if (match) {
        await this.bindSeries(match.id, match.title.native || match.title.romaji);
      } else {
        UI.updateNav(CONSTANTS.STATUS.UNBOUND);
        if (State.candidate) {
          UI.showToast('🧐 找到可能的作品，請點擊確認');
        }
      }
    },
    async bindSeries(id, title) {
      if (title === '手動更新' || title === '手動輸入') {
        try {
          const info = await AniListAPI.getMedia(id);
          title = info.title.native || info.title.romaji;
        } catch (e) {
          Log.error(e);
          title = 'Unknown Title';
        }
      }

      UI.updateNav(CONSTANTS.STATUS.SYNCING, '分析系列作結構...');

      let newRules = [];
      const targetId = parseInt(id);

      try {
        const chain = await AniListAPI.getSequelChain(targetId);

        const exists = chain.find((m) => {
          return m.id === targetId;
        });
        if (!exists) {
          chain.push({ id: targetId, title: { native: title }, episodes: 12, format: 'TV' });
        }

        const pageMin = EpisodeCalculator.getMin();
        const pageMax = EpisodeCalculator.getMax();
        const anchorStart = pageMin !== null ? pageMin : 1;

        SeriesLogic.calculateOffsets(chain, targetId, anchorStart);

        const targetMedia = chain.find((x) => {
          return x.id === targetId;
        });
        const targetStart = targetMedia ? targetMedia.calculatedStart : null;

        chain.forEach((m) => {
          if (m.calculatedStart === undefined) {
            return;
          }

          const mStart = m.calculatedStart;
          const mEnd = m.episodes ? mStart + m.episodes : 999999;

          let isOverlapping = pageMax > 0 ? mStart <= pageMax && mEnd >= pageMin : false;

          // 如果目標本身就是頁面起始，則前面的作品不算重疊
          if (targetStart !== null && targetStart === pageMin) {
            if (mStart < targetStart) {
              isOverlapping = false;
            }
          }

          if (m.id === targetId || isOverlapping) {
            newRules.push({
              start: mStart,
              bahaStart: mStart,
              aniStart: 1,
              id: m.id,
              title: m.title.native || m.title.romaji,
            });
          }
        });
      } catch (e) {
        Log.warn('Series Bind Failed:', e);
      }

      // 防呆保險
      if (newRules.length === 0) {
        const fallback = EpisodeCalculator.getMin() || 1;
        newRules.push({
          start: fallback,
          bahaStart: fallback,
          aniStart: 1,
          id: targetId,
          title: title,
        });
      }

      App.saveRules(newRules);

      UI.showToast(`✅ 綁定成功！(已自動設定 ${State.rules.length} 個系列作)`);

      _.fadeOut(_.$('#al-modal'));

      if (CONSTANTS.SYNC_ON_BIND && !State.isHunting) {
        this.syncProgress();
      }
    },
    async fetchBahaData(url) {
      try {
        const html = await new Promise((r, j) => {
          return GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: (x) => {
              return r(x.responseText);
            },
            onerror: j,
          });
        });
        const doc = new DOMParser().parseFromString(html, 'text/html');
        if (CONSTANTS.DEBUG) {
          Utils.validateParser(doc);
        } else {
          if (!doc.querySelector(CONSTANTS.SELECTORS.PARSER.infoTitle)) {
            Log.error('Parser Error: 找不到標題，巴哈可能改版');
          }
        }

        const titleJp =
          doc.querySelector(CONSTANTS.SELECTORS.PARSER.infoTitle)?.textContent.trim() || '';
        const titles = doc.querySelectorAll(CONSTANTS.SELECTORS.PARSER.infoTitle);
        const titleEn = titles.length > 1 ? titles[1].textContent.trim() : '';

        const getTextFromList = (items, keyword) => {
          const found = items.find((el) => {
            return el.textContent.includes(keyword);
          });
          if (!found) {
            return null;
          }
          const parts = found.textContent.split('：');
          return parts.length > 1 ? parts[1].trim() : null;
        };

        const listItems = [...doc.querySelectorAll(CONSTANTS.SELECTORS.PARSER.infoList)];
        const dateJpStr = getTextFromList(listItems, '當地');
        const dateTwStr = getTextFromList(listItems, '台灣');

        let siteDomain = '';
        const offLinkEl = [...doc.querySelectorAll('.ACG-box1listB > li')]
          .find((el) => {
            return el.textContent.includes('官方網站');
          })
          ?.querySelector('a');

        if (offLinkEl) {
          try {
            const rawHref = offLinkEl.getAttribute('href');
            if (rawHref) {
              const u = new URL(rawHref, 'https://acg.gamer.com.tw');
              siteDomain = Utils.extractDomain(u.searchParams.get('url') || rawHref);
            }
          } catch (e) {
            Log.error('Domain Parse Error', e);
          }
        }
        return {
          nameJp: titleJp,
          nameEn: titleEn,
          site: siteDomain,
          dateJP: { str: dateJpStr, obj: Utils.parseDateStr(dateJpStr) },
          dateTW: { str: dateTwStr, obj: Utils.parseDateStr(dateTwStr) },
        };
      } catch (e) {
        Log.error('Baha Data Error', e);
        return null;
      }
    },
    updateUIStatus() {
      if (!GM_getValue(CONSTANTS.KEYS.TOKEN)) {
        UI.updateNav(CONSTANTS.STATUS.TOKEN_ERROR);
      } else if (State.rules.length === 0) {
        UI.updateNav(CONSTANTS.STATUS.UNBOUND);
      } else {
        UI.updateNav(CONSTANTS.STATUS.BOUND);
      }
    },
  };
  // #endregion
  setTimeout(() => {
    return App.init();
  }, 500);
})();
