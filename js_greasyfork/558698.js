// ==UserScript==
// @name          Pixiv Bookmark Slideshow
// @name:zh-CN    Pixiv 收藏夹幻灯片播放
// @name:zh-TW    Pixiv 書籤幻燈片播放
// @name:ja       Pixiv ブックマーク スライドショー
// @namespace     https://github.com/Kuuud/Pixiv-Bookmark-Slideshow
// @version       3.5.0
// @icon          https://www.pixiv.net/favicon.ico
// @description       Adds a slideshow button to the Pixiv User Bookmarks page, allowing for seamless browsing of bookmarked illustrations with auto-loading of original quality images, tag filtering, and manga/group pagination.
// @description:zh-CN 在 Pixiv 收藏夹页面添加幻灯片播放按钮，支持按标签过滤、组图/漫画翻页、自动加载原图、公开/非公开切换。
// @description:zh-TW 在 Pixiv 書籤頁面新增幻燈片播放按鈕，支援依標籤過濾、組圖/漫畫翻頁、自動載入原圖、公開/非公開切換。
// @description:ja    Pixivのブックマークページにスライドショー機能を追加します。タグフィルタリング、マンガ/組写真のページめくり、オリジナル画像の自動読み込み、非公開/公開の切り替えをサポートします。
// @author        Kud
// @match         https://www.pixiv.net/*
// @license       MIT
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_xmlhttpRequest
// @connect       pixiv.net
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/558698/Pixiv%20Bookmark%20Slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/558698/Pixiv%20Bookmark%20Slideshow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 多语言定义 (I18N) ---
    const TRANSLATIONS = {
        'zh-CN': {
            fab_title: '播放收藏夹幻灯片',
            settings_btn: '⚙️ 设置',
            setting_interval: '间隔时间 (秒)',
            setting_fit: '显示模式',
            fit_contain: '完整显示 (Contain)',
            fit_cover: '充满屏幕 (Cover)',
            setting_debug: '调试模式',
            setting_jump: '跳转到作品序号',
            setting_jump_btn: 'Go',
            setting_shortcuts: '快捷键: ←→ 翻页 | ↑↓ 切换作品 | 空格 播放/暂停 | Esc 退出',
            loading: '加载中...',
            loading_missing_block: '作品 #{0} 所在的块尚未加载。',
            loading_data_lost: '作品数据丢失或列表为空。',
            loading_img_link: '正在获取图片链接...',
            loading_auto_fill: '作品 #{0} 是缺失数据，正在自动加载...',
            loading_list: '正在加载作品列表...',
            loading_first_page: '正在加载第一页收藏作品...',
            loading_next_page: '正在加载下一页作品...',
            loading_jump: '正在跳转到作品 #{0}...\n[尝试 {1}/{2}]',
            badge_missing: '缺失数据块',
            badge_tag: '标签',
            badge_all_tags: '全部',
            badge_public: '公开',
            badge_private: '非公开',
            badge_group: '组图',
            badge_single: '单图',
            count_work: '作品',
            count_page: '页码',
            btn_first: '第一个作品 (Home)',
            btn_prev_work: '上一个作品 (↑)',
            btn_prev_img: '上一张 (←)',
            btn_play: '播放',
            btn_pause: '暂停',
            btn_next_img: '下一张 (→)',
            btn_next_work: '下一个作品 (↓)',
            btn_last: '最后一个作品 (End)',
            btn_close: '关闭',
            btn_retry: '重试',
            err_img_load: '图片加载失败',
            err_img_timeout: '图片加载超时',
            err_load_fail: '加载失败',
            err_jump_fail: '加载失败，无法到达作品 #{0}',
            err_list_empty: '列表为空，无法跳转。',
            err_start_empty: '列表为空，无法开始播放。\n当前模式: {0}\n当前标签: {1}',
            mode_private: '非公开 (Private)',
            mode_public: '公开 (Public)',
            tag_all_verbose: '全部标签 (All Tags)'
        },
        'zh-TW': {
            fab_title: '播放書籤幻燈片',
            settings_btn: '⚙️ 設定',
            setting_interval: '間隔時間 (秒)',
            setting_fit: '顯示模式',
            fit_contain: '完整顯示 (Contain)',
            fit_cover: '充滿螢幕 (Cover)',
            setting_debug: '除錯模式',
            setting_jump: '跳轉到作品序號',
            setting_jump_btn: '前往',
            setting_shortcuts: '快捷鍵: ←→ 翻頁 | ↑↓ 切換作品 | 空白鍵 播放/暫停 | Esc 退出',
            loading: '載入中...',
            loading_missing_block: '作品 #{0} 所在的區塊尚未載入。',
            loading_data_lost: '作品資料遺失或列表為空。',
            loading_img_link: '正在獲取圖片連結...',
            loading_auto_fill: '作品 #{0} 為缺失資料，正在自動載入...',
            loading_list: '正在載入作品列表...',
            loading_first_page: '正在載入第一頁收藏作品...',
            loading_next_page: '正在載入下一頁作品...',
            loading_jump: '正在跳轉到作品 #{0}...\n[嘗試 {1}/{2}]',
            badge_missing: '缺失資料區塊',
            badge_tag: '標籤',
            badge_all_tags: '全部',
            badge_public: '公開',
            badge_private: '非公開',
            badge_group: '組圖',
            badge_single: '單圖',
            count_work: '作品',
            count_page: '頁碼',
            btn_first: '第一個作品 (Home)',
            btn_prev_work: '上一個作品 (↑)',
            btn_prev_img: '上一張 (←)',
            btn_play: '播放',
            btn_pause: '暫停',
            btn_next_img: '下一張 (→)',
            btn_next_work: '下一個作品 (↓)',
            btn_last: '最後一個作品 (End)',
            btn_close: '關閉',
            btn_retry: '重試',
            err_img_load: '圖片載入失敗',
            err_img_timeout: '圖片載入超時',
            err_load_fail: '載入失敗',
            err_jump_fail: '載入失敗，無法到達作品 #{0}',
            err_list_empty: '列表為空，無法跳轉。',
            err_start_empty: '列表為空，無法開始播放。\n當前模式: {0}\n當前標籤: {1}',
            mode_private: '非公開 (Private)',
            mode_public: '公開 (Public)',
            tag_all_verbose: '全部標籤 (All Tags)'
        },
        'ja': {
            fab_title: 'スライドショーを再生',
            settings_btn: '⚙️ 設定',
            setting_interval: '間隔 (秒)',
            setting_fit: '表示モード',
            fit_contain: '全体を表示 (Contain)',
            fit_cover: '画面に合わせる (Cover)',
            setting_debug: 'デバッグモード',
            setting_jump: '作品番号へ移動',
            setting_jump_btn: 'Go',
            setting_shortcuts: 'ショートカット: ←→ ページ | ↑↓ 作品切替 | Space 再生/一時停止 | Esc 終了',
            loading: '読み込み中...',
            loading_missing_block: '作品 #{0} のブロックはまだ読み込まれていません。',
            loading_data_lost: '作品データが見つからないか、リストが空です。',
            loading_img_link: '画像リンクを取得中...',
            loading_auto_fill: '作品 #{0} のデータが欠落しています。自動読み込み中...',
            loading_list: '作品リストを読み込み中...',
            loading_first_page: 'ブックマークの最初のページを読み込んでいます...',
            loading_next_page: '次のページの作品を読み込んでいます...',
            loading_jump: '作品 #{0} へ移動中...\n[試行 {1}/{2}]',
            badge_missing: 'データ欠落',
            badge_tag: 'タグ',
            badge_all_tags: 'すべて',
            badge_public: '公開',
            badge_private: '非公開',
            badge_group: '複数',
            badge_single: '単一',
            count_work: '作品',
            count_page: 'ページ',
            btn_first: '最初の作品 (Home)',
            btn_prev_work: '前の作品 (↑)',
            btn_prev_img: '前へ (←)',
            btn_play: '再生',
            btn_pause: '一時停止',
            btn_next_img: '次へ (→)',
            btn_next_work: '次の作品 (↓)',
            btn_last: '最後の作品 (End)',
            btn_close: '閉じる',
            btn_retry: 'リトライ',
            err_img_load: '画像の読み込みに失敗しました',
            err_img_timeout: '画像の読み込みがタイムアウトしました',
            err_load_fail: '読み込み失敗',
            err_jump_fail: '読み込み失敗。作品 #{0} に到達できません',
            err_list_empty: 'リストが空のため移動できません。',
            err_start_empty: 'リストが空のため再生を開始できません。\n現在のモード: {0}\n現在のタグ: {1}',
            mode_private: '非公開 (Private)',
            mode_public: '公開 (Public)',
            tag_all_verbose: 'すべてのタグ (All Tags)'
        },
        'en': {
            fab_title: 'Play Bookmark Slideshow',
            settings_btn: '⚙️ Settings',
            setting_interval: 'Interval (s)',
            setting_fit: 'Display Mode',
            fit_contain: 'Contain',
            fit_cover: 'Cover',
            setting_debug: 'Debug Mode',
            setting_jump: 'Jump to Work #',
            setting_jump_btn: 'Go',
            setting_shortcuts: 'Shortcuts: ←→ Page | ↑↓ Prev/Next Work | Space Play/Pause | Esc Exit',
            loading: 'Loading...',
            loading_missing_block: 'Block for Work #{0} not loaded yet.',
            loading_data_lost: 'Work data missing or list is empty.',
            loading_img_link: 'Fetching image links...',
            loading_auto_fill: 'Work #{0} data missing, auto-loading...',
            loading_list: 'Loading work list...',
            loading_first_page: 'Loading first page of bookmarks...',
            loading_next_page: 'Loading next page of works...',
            loading_jump: 'Jumping to Work #{0}...\n[Attempt {1}/{2}]',
            badge_missing: 'Missing Data',
            badge_tag: 'Tag',
            badge_all_tags: 'All',
            badge_public: 'Public',
            badge_private: 'Private',
            badge_group: 'Group',
            badge_single: 'Single',
            count_work: 'Work',
            count_page: 'Page',
            btn_first: 'First Work (Home)',
            btn_prev_work: 'Prev Work (↑)',
            btn_prev_img: 'Prev (←)',
            btn_play: 'Play',
            btn_pause: 'Pause',
            btn_next_img: 'Next (→)',
            btn_next_work: 'Next Work (↓)',
            btn_last: 'Last Work (End)',
            btn_close: 'Close',
            btn_retry: 'Retry',
            err_img_load: 'Image Load Failed',
            err_img_timeout: 'Image Load Timeout',
            err_load_fail: 'Load Failed',
            err_jump_fail: 'Load failed, cannot reach Work #{0}',
            err_list_empty: 'List is empty, cannot jump.',
            err_start_empty: 'List is empty, cannot start.\nMode: {0}\nTag: {1}',
            mode_private: 'Private',
            mode_public: 'Public',
            tag_all_verbose: 'All Tags'
        }
    };

    function getLang() {
        const lang = navigator.language || navigator.userLanguage || 'en';
        if (lang.startsWith('zh-CN') || lang === 'zh') return 'zh-CN';
        if (lang.startsWith('zh')) return 'zh-TW'; // HK, TW, SG usually traditional or handled here
        if (lang.startsWith('ja')) return 'ja';
        return 'en';
    }

    const CURRENT_LANG = getLang();

    function t(key, ...args) {
        let str = TRANSLATIONS[CURRENT_LANG][key] || TRANSLATIONS['en'][key] || key;
        args.forEach((arg, i) => {
            str = str.replace(`{${i}}`, arg);
        });
        return str;
    }

    // --- 常量定义 ---
    const CONSTANTS = {
        WORK_BLOCK_SIZE: 48,
        MAX_RETRY_ATTEMPTS: 5,
        RETRY_DELAY_MS: 300,
        PRELOAD_THRESHOLD: 10,
        MAX_CACHE_SIZE: 100,
        UPDATE_COUNTER_THROTTLE_MS: 100,
        REQUEST_TIMEOUT_MS: 30000,
        IMAGE_LOAD_TIMEOUT_MS: 15000
    };

    const CSS_CLASSES = {
        FAB: 'pbs-fab',
        OVERLAY: 'pbs-overlay',
        IMAGE_WRAPPER: 'pbs-image-wrapper',
        MAIN_IMAGE: 'pbs-main-image',
        LOADING: 'pbs-loading',
        CONTROLS: 'pbs-controls',
        BTN: 'pbs-btn',
        BTN_ACTIVE: 'active',
        BADGE: 'pbs-badge',
        FIT_CONTAIN: 'pbs-fit-contain',
        FIT_COVER: 'pbs-fit-cover'
    };

    // --- 配置 ---
    const CONFIG = {
        interval: GM_getValue('interval', 5),
        fitMode: GM_getValue('fitMode', 'contain'),
        autoPlay: true,
        preloadCount: 3,
        debugMode: GM_getValue('debugMode', false)
    };

    // --- 调试工具 ---
    const Logger = {
        debug: (...args) => CONFIG.debugMode && console.log('[PBS Debug]', ...args),
        info: (...args) => console.log('[PBS]', ...args),
        warn: (...args) => console.warn('[PBS]', ...args),
        error: (...args) => console.error('[PBS]', ...args)
    };

    // --- 状态管理 ---
    let state = {
        isPlaying: false,
        workIndex: 0,
        pageIndex: 0,
        works: [],
        worksCache: new Map(),
        totalWorks: 0,
        timer: null,
        loading: false,
        offset: 0,
        currentTag: '',
        restMode: 'show',
        userId: null,
        hasMore: true,
        currentRequestId: 0,
        preloadedLinks: new Set(),
        lastCounterUpdate: 0,
        imageLoadTimeout: null
    };

    // 状态验证
    function validateState() {
        if (state.workIndex < 0) state.workIndex = 0;
        if (state.pageIndex < 0) state.pageIndex = 0;
        if (state.workIndex >= state.works.length && state.works.length > 0) {
            state.workIndex = state.works.length - 1;
        }
        return true;
    }

    // --- LRU 缓存管理 ---
    class LRUCache {
        constructor(maxSize) {
            this.maxSize = maxSize;
            this.cache = new Map();
        }

        get(key) {
            if (!this.cache.has(key)) return undefined;
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }

        set(key, value) {
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(key, value);
        }

        has(key) {
            return this.cache.has(key);
        }

        clear() {
            this.cache.clear();
        }
    }

    state.worksCache = new LRUCache(CONSTANTS.MAX_CACHE_SIZE);

    // --- 资源管理 ---
    const ResourceManager = {
        cleanupPreloadLinks() {
            state.preloadedLinks.forEach(link => {
                if (link && link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });
            state.preloadedLinks.clear();
            Logger.debug('清理预加载链接');
        },

        cleanup() {
            this.cleanupPreloadLinks();
            if (state.imageLoadTimeout) {
                clearTimeout(state.imageLoadTimeout);
                state.imageLoadTimeout = null;
            }
        }
    };

    // --- CSS 样式 ---
    const css = `
        #${CSS_CLASSES.FAB} {
            position: fixed;
            bottom: 100px;
            right: 28px;
            width: 48px; height: 48px;
            background-color: #0096fa; border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer; z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s, background-color 0.2s;
            opacity: 0.8;
        }
        #${CSS_CLASSES.FAB}:hover { transform: scale(1.1); background-color: #0077c7; opacity: 1; }
        #${CSS_CLASSES.FAB} svg { fill: white; width: 24px; height: 24px; }

        #${CSS_CLASSES.OVERLAY} {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: black; z-index: 10000;
            display: none; flex-direction: column;
            user-select: none;
        }

        #${CSS_CLASSES.IMAGE_WRAPPER} {
            flex: 1;
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            position: relative; overflow: hidden;
        }

        #${CSS_CLASSES.MAIN_IMAGE} {
            display: block;
            max-width: 100%; max-height: 100%;
            transition: opacity 0.3s;
            opacity: 0;
        }

        .${CSS_CLASSES.FIT_CONTAIN} { object-fit: contain; width: 100%; height: 100%; }
        .${CSS_CLASSES.FIT_COVER} { object-fit: cover; width: 100%; height: 100%; }

        #${CSS_CLASSES.CONTROLS} {
            height: 60px; background: rgba(0,0,0,0.8);
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 20px; color: white; font-family: sans-serif;
            flex-shrink: 0;
        }

        .${CSS_CLASSES.BTN} {
            background: none; border: 1px solid #555; color: #ddd;
            padding: 5px 12px; margin: 0 3px; cursor: pointer; border-radius: 4px;
            font-size: 13px; transition: all 0.2s;
        }
        .${CSS_CLASSES.BTN}:hover { background: #333; color: white; }
        .${CSS_CLASSES.BTN}.${CSS_CLASSES.BTN_ACTIVE} { background: #0096fa; border-color: #0096fa; color: white; }
        .pbs-btn-sub { font-size: 11px; padding: 5px 8px; color: #aaa; border-color: #444; }

        #pbs-info { font-size: 14px; max-width: 40%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        #pbs-settings-panel {
            position: absolute; top: 60px; left: 20px;
            background: rgba(30,30,30,0.95); padding: 15px;
            border-radius: 8px; color: white;
            display: none; flex-direction: column; gap: 12px;
            border: 1px solid #444; min-width: 250px;
            z-index: 10001;
        }
        #pbs-settings-panel label { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 13px; }
        #pbs-settings-panel input, #pbs-settings-panel select { background: #222; border: 1px solid #555; color: white; padding: 4px; border-radius: 3px; }

        #${CSS_CLASSES.LOADING} {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            color: white; font-size: 18px; font-weight: bold;
            text-shadow: 0 0 10px black; pointer-events: none;
            text-align: center;
            max-width: 80%;
            white-space: pre-wrap;
        }

        .${CSS_CLASSES.BADGE} {
            color: white; padding: 2px 6px; border-radius: 4px;
            font-size: 12px; margin-right: 5px; vertical-align: middle;
            display: inline-block;
        }

        .pbs-badge-single   { background-color: #0096fa; }
        .pbs-badge-multiple { background-color: #9c27b0; }
        .pbs-badge-public   { background-color: #4caf50; }
        .pbs-badge-hide     { background-color: #f44336; }
        .pbs-badge-tag      { background-color: #e67e22; }
        .pbs-badge-yellow   { background-color: #f1c40f; }

        .pbs-control-group { display: flex; align-items: center; gap: 5px; }
        .pbs-divider { width: 1px; height: 20px; background: #555; margin: 0 8px; }

        .pbs-retry-btn {
            margin-top: 10px; padding: 8px 16px; background: #0096fa;
            border: none; color: white; border-radius: 4px; cursor: pointer;
            font-size: 14px; pointer-events: auto;
        }
        .pbs-retry-btn:hover { background: #0077c7; }
    `;
    GM_addStyle(css);

    // --- 节流函数 ---
    function throttle(fn, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return fn.apply(this, args);
            }
        };
    }

    // --- 网络请求（带重试和超时）---
    async function gmXHR(url, responseType = "json", retries = CONSTANTS.MAX_RETRY_ATTEMPTS) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject({ status: 0, error: "REQUEST_TIMEOUT" });
                    }, CONSTANTS.REQUEST_TIMEOUT_MS);

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        responseType: responseType === "json" ? "text" : responseType,
                        headers: {
                            "Referer": location.origin + "/",
                            "Accept": "application/json, text/plain, */*"
                        },
                        onload: function (response) {
                            clearTimeout(timeoutId);
                            if (response.status === 200) {
                                try {
                                    const data = responseType === "json" ? JSON.parse(response.responseText) : response.response;
                                    resolve({ status: 200, data: data });
                                } catch (e) {
                                    Logger.error(`JSON 解析错误 URL: ${url}`, e);
                                    reject({ status: 500, error: "JSON_PARSE_ERROR" });
                                }
                            } else {
                                Logger.error(`XHR 请求失败，状态码 ${response.status} URL: ${url}`);
                                reject({ status: response.status, error: response.responseText });
                            }
                        },
                        onerror: function (response) {
                            clearTimeout(timeoutId);
                            Logger.error(`网络错误 URL: ${url}`);
                            reject({ status: 0, error: "NETWORK_ERROR" });
                        }
                    });
                });
                return result;
            } catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                Logger.warn(`请求失败，重试 ${attempt}/${retries}:`, url);
                await new Promise(r => setTimeout(r, CONSTANTS.RETRY_DELAY_MS * attempt));
            }
        }
    }

    // --- UI 构建 ---
    function createUI() {
        if (document.getElementById(CSS_CLASSES.FAB)) return;

        const fab = document.createElement('div');
        fab.id = CSS_CLASSES.FAB;
        fab.title = t('fab_title');
        fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>`;
        fab.addEventListener('click', startSlideshow);
        document.body.appendChild(fab);

        const overlay = document.createElement('div');
        overlay.id = CSS_CLASSES.OVERLAY;
        overlay.innerHTML = `
            <div style="position:absolute; top:10px; left:20px; z-index:10001;">
                <button id="pbs-settings-btn" class="${CSS_CLASSES.BTN}">${t('settings_btn')}</button>
                <div id="pbs-settings-panel">
                    <label>
                        ${t('setting_interval')}
                        <input type="number" id="pbs-input-interval" min="1" max="60" value="${CONFIG.interval}" style="width: 50px;">
                    </label>
                    <label>
                        ${t('setting_fit')}
                        <select id="pbs-select-fit">
                            <option value="contain" ${CONFIG.fitMode === 'contain' ? 'selected' : ''}>${t('fit_contain')}</option>
                            <option value="cover" ${CONFIG.fitMode === 'cover' ? 'selected' : ''}>${t('fit_cover')}</option>
                        </select>
                    </label>
                    <label style="display: none">
                        ${t('setting_debug')}
                        <input type="checkbox" id="pbs-debug-mode" ${CONFIG.debugMode ? 'checked' : ''}>
                    </label>
                    <hr style="border: 0; border-top: 1px solid #444; width: 100%;">
                    <label>
                        ${t('setting_jump')}
                        <div style="display:flex; gap:5px;">
                            <input type="number" id="pbs-jump-input" min="1" placeholder="#" style="width: 60px;">
                            <button id="pbs-jump-btn" class="${CSS_CLASSES.BTN}" style="padding: 2px 8px; margin:0;">${t('setting_jump_btn')}</button>
                        </div>
                    </label>
                    <div style="font-size: 11px; color: #888; margin-top: 10px;">
                        ${t('setting_shortcuts')}
                    </div>
                </div>
            </div>

            <div id="${CSS_CLASSES.IMAGE_WRAPPER}">
                <div id="${CSS_CLASSES.LOADING}" style="display:none;">${t('loading')}</div>
                <img id="${CSS_CLASSES.MAIN_IMAGE}" src="" class="${CSS_CLASSES.FIT_CONTAIN}" />
            </div>

            <div id="${CSS_CLASSES.CONTROLS}">
                <div id="pbs-info"></div>

                <div class="pbs-control-group">
                    <div id="pbs-counter" style="margin-right:15px; font-size:12px; color:#aaa; text-align:right; line-height:1.2;">
                        <div id="pbs-work-count">${t('count_work')}: 0/0</div>
                        <div id="pbs-page-count" style="color:#0096fa">${t('count_page')}: 0/0</div>
                    </div>

                    <button id="pbs-first-work" class="${CSS_CLASSES.BTN} pbs-btn-sub" title="${t('btn_first')}">⏮</button>
                    <button id="pbs-prev-work" class="${CSS_CLASSES.BTN} pbs-btn-sub" title="${t('btn_prev_work')}"> &lt;&lt; </button>
                    <button id="pbs-prev" class="${CSS_CLASSES.BTN}" title="${t('btn_prev_img')}"> &lt; </button>

                    <button id="pbs-play" class="${CSS_CLASSES.BTN}" style="width: 70px;">${t('btn_pause')}</button>

                    <button id="pbs-next" class="${CSS_CLASSES.BTN}" title="${t('btn_next_img')}"> &gt; </button>
                    <button id="pbs-next-work" class="${CSS_CLASSES.BTN} pbs-btn-sub" title="${t('btn_next_work')}"> &gt;&gt; </button>
                    <button id="pbs-last-work" class="${CSS_CLASSES.BTN} pbs-btn-sub" title="${t('btn_last')}">⏭</button>

                    <div class="pbs-divider"></div>
                    <button id="pbs-close" class="${CSS_CLASSES.BTN}" style="border-color:#d32f2f; color:#ff8a80;">${t('btn_close')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        bindUIEvents();
    }

    // --- 事件绑定 ---
    function bindUIEvents() {
        document.getElementById('pbs-close').onclick = stopSlideshow;
        document.getElementById('pbs-play').onclick = togglePlay;

        document.getElementById('pbs-next').onclick = async () => { resetTimer(); await nextImage(); };
        document.getElementById('pbs-prev').onclick = async () => { resetTimer(); await prevImage(); };

        document.getElementById('pbs-next-work').onclick = async () => { resetTimer(); await nextWork(); };
        document.getElementById('pbs-prev-work').onclick = async () => { resetTimer(); await prevWork(); };

        document.getElementById('pbs-first-work').onclick = async () => { resetTimer(); await jumpToWork(0, state.isPlaying); };
        document.getElementById('pbs-last-work').onclick = async () => {
            resetTimer();
            const lastIndex = Math.max(0, state.totalWorks - 1);
            await jumpToWork(lastIndex, state.isPlaying);
        };

        const settingsBtn = document.getElementById('pbs-settings-btn');
        const settingsPanel = document.getElementById('pbs-settings-panel');
        settingsBtn.onclick = () => {
            settingsPanel.style.display = settingsPanel.style.display === 'flex' ? 'none' : 'flex';
        };

        document.getElementById('pbs-input-interval').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val > 0) {
                CONFIG.interval = val;
                GM_setValue('interval', val);
                resetTimer();
            }
        };

        document.getElementById('pbs-select-fit').onchange = (e) => {
            CONFIG.fitMode = e.target.value;
            GM_setValue('fitMode', e.target.value);
            const img = document.getElementById(CSS_CLASSES.MAIN_IMAGE);
            img.className = CSS_CLASSES.FIT_CONTAIN.replace('contain', CONFIG.fitMode);
        };

        document.getElementById('pbs-debug-mode').onchange = (e) => {
            CONFIG.debugMode = e.target.checked;
            GM_setValue('debugMode', e.target.checked);
            Logger.info('调试模式:', CONFIG.debugMode ? '开启' : '关闭');
        };

        const jumpAction = () => {
            const input = document.getElementById('pbs-jump-input');
            let val = parseInt(input.value);
            if (!isNaN(val) && val >= 1) {
                const wasPlaying = state.isPlaying;
                clearInterval(state.timer);
                jumpToWork(val - 1, wasPlaying);
                settingsPanel.style.display = 'none';
            }
        };
        document.getElementById('pbs-jump-btn').onclick = jumpAction;
        document.getElementById('pbs-jump-input').onkeydown = (e) => {
            if (e.key === 'Enter') jumpAction();
        };

        document.addEventListener('keydown', (e) => {
            if (document.getElementById(CSS_CLASSES.OVERLAY).style.display !== 'flex') return;
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;

            switch (e.key) {
                case 'ArrowRight': e.preventDefault(); resetTimer(); nextImage(); break;
                case 'ArrowLeft': e.preventDefault(); resetTimer(); prevImage(); break;
                case 'ArrowUp': e.preventDefault(); resetTimer(); prevWork(); break;
                case 'ArrowDown': e.preventDefault(); resetTimer(); nextWork(); break;
                case 'Home': e.preventDefault(); resetTimer(); jumpToWork(0, state.isPlaying); break;
                case 'End': e.preventDefault(); resetTimer(); jumpToWork(Math.max(0, state.totalWorks - 1), state.isPlaying); break;
                case ' ': e.preventDefault(); togglePlay(); break;
                case 'Escape': e.preventDefault(); stopSlideshow(); break;
            }
        });
    }

    // --- 环境解析 ---
    function parseContext() {
        const urlParams = new URLSearchParams(location.search);
        const pathParts = location.pathname.split('/').filter(p => p);

        const userIndex = pathParts.indexOf('users');
        if (userIndex !== -1 && pathParts[userIndex + 1]) {
            state.userId = pathParts[userIndex + 1];
        } else {
            try {
                state.userId = pixiv.user.id;
            } catch (e) {
                Logger.error("无法获取用户 ID，请确保已登录。");
                return false;
            }
        }

        if (pathParts.includes('private') || urlParams.get('rest') === 'hide') {
            state.restMode = 'hide';
        } else {
            state.restMode = 'show';
        }

        state.currentTag = '';
        const artworksIndex = pathParts.indexOf('artworks');
        if (artworksIndex !== -1 && artworksIndex + 1 < pathParts.length) {
            const potentialTag = pathParts[artworksIndex + 1];
            if (potentialTag && potentialTag !== 'private') {
                state.currentTag = decodeURIComponent(potentialTag);
            }
        }

        Logger.info(`解析环境 - 标签: ${state.currentTag || '无'}, 模式: ${state.restMode}, 用户 ID: ${state.userId}`);

        return true;
    }

    // --- 数据获取 ---
    async function fetchBookmarks(offset) {
        if (state.loading) {
            Logger.debug('正在加载中，跳过重复请求');
            return false;
        }
        state.loading = true;

        const limit = CONSTANTS.WORK_BLOCK_SIZE;
        const encodedTag = encodeURIComponent(state.currentTag);
        const url = `https://www.pixiv.net/ajax/user/${state.userId}/illusts/bookmarks?tag=${encodedTag}&offset=${offset}&limit=${limit}&rest=${state.restMode}`;

        Logger.info(`正在获取收藏夹作品 offset=${offset}`);

        try {
            const response = await gmXHR(url, 'json');
            const json = response.data;

            if (json.error || !json.body) {
                Logger.error("Pixiv API 错误:", json.error || "缺少主体数据");
                return false;
            }

            const newWorks = json.body.works || [];
            if (json.body.total !== undefined) {
                state.totalWorks = json.body.total;
            }

            if (newWorks.length === 0) {
                state.hasMore = false;
                if (offset === 0 && state.works.length === 0) {
                    Logger.warn("API 返回 0 个作品。");
                }
                return false;
            } else {
                const startIndex = offset;
                for (let i = 0; i < newWorks.length; i++) {
                    const work = newWorks[i];
                    const index = startIndex + i;

                    if (index < state.works.length) {
                        state.works[index] = work;
                    } else {
                        state.works.push(work);
                    }
                }

                state.offset = Math.max(state.offset, offset + limit);
                Logger.debug(`成功加载 ${newWorks.length} 个作品，当前总数: ${state.works.length}`);
                return true;
            }
        } catch (error) {
            Logger.error("获取书签时出错:", error);
            return false;
        } finally {
            state.loading = false;
            throttledUpdateCounter();
        }
    }

    // --- 加载占位符块 ---
    async function fetchPlaceholderBlock(blockStartOffset) {
        if (state.loading) return false;
        state.loading = true;

        showLoading(t('loading_list')); // Generic list loading message

        try {
            const result = await fetchBookmarks(blockStartOffset);
            if (result) {
                hideLoading();
            }
            return result;
        } catch (e) {
            Logger.error("占位符块获取失败。", e);
            showLoadingError(t('err_load_fail'), () => fetchPlaceholderBlock(blockStartOffset));
            return false;
        } finally {
            state.loading = false;
        }
    }

    // --- 获取作品页面 ---
    async function getWorkPages(work) {
        if (work.isPlaceholder) {
            Logger.error("尝试获取占位符的页面信息。");
            return [];
        }

        if (state.worksCache.has(work.id)) {
            return state.worksCache.get(work.id);
        }

        const url = `https://www.pixiv.net/ajax/illust/${work.id}/pages`;
        try {
            const response = await gmXHR(url, 'json');
            const pages = response.data.body.map(p => p.urls.original);
            state.worksCache.set(work.id, pages);
            Logger.debug(`获取作品 ${work.id} 的 ${pages.length} 个页面`);
            return pages;
        } catch (e) {
            Logger.error("加载作品页面信息失败", e);
            let fallbackUrl = work.url.replace("/c/250x250_80_a2", "").replace("_square1200", "_master1200").replace("_custom1200", "_master1200");
            return [fallbackUrl];
        }
    }

    // --- 加载状态管理 ---
    function showLoading(message) {
        const loading = document.getElementById(CSS_CLASSES.LOADING);
        if (loading) {
            loading.textContent = message;
            loading.style.display = 'block';
        }
    }

    function hideLoading() {
        const loading = document.getElementById(CSS_CLASSES.LOADING);
        if (loading) loading.style.display = 'none';
    }

    function showLoadingError(message, retryCallback) {
        const loading = document.getElementById(CSS_CLASSES.LOADING);
        if (loading) {
            loading.innerHTML = `${message}<br><button class="pbs-retry-btn">${t('btn_retry')}</button>`;
            const retryBtn = loading.querySelector('.pbs-retry-btn');
            if (retryBtn && retryCallback) {
                retryBtn.onclick = () => {
                    retryBtn.disabled = true;
                    retryCallback();
                };
            }
            loading.style.display = 'block';
        }
    }

    // --- 显示图片（方案1：简单高效）---
    async function showImage() {
        const requestId = ++state.currentRequestId;
        const work = state.works[state.workIndex];
        const img = document.getElementById(CSS_CLASSES.MAIN_IMAGE);
        const info = document.getElementById('pbs-info');

        // 清除之前的超时定时器
        if (state.imageLoadTimeout) {
            clearTimeout(state.imageLoadTimeout);
            state.imageLoadTimeout = null;
        }

        if (work && work.isPlaceholder) {
            showLoading(t('loading_missing_block', state.workIndex + 1));
            img.style.opacity = '0';
            info.innerHTML = `<span class="${CSS_CLASSES.BADGE} pbs-badge-yellow">${t('badge_missing')}</span> ${t('loading_missing_block', state.workIndex + 1)}`;
            throttledUpdateCounter(0);
            return;
        }

        if (!work) {
            showLoading(t('loading_data_lost'));
            img.style.opacity = '0';
            return;
        }

        // 获取页面信息
        let pages = state.worksCache.get(work.id);
        if (!pages) {
            showLoading(t('loading_img_link'));
            pages = await getWorkPages(work);
            if (requestId !== state.currentRequestId) {
                Logger.debug('图片请求已过期，放弃显示');
                return;
            }
        }

        if (state.pageIndex >= pages.length) state.pageIndex = 0;

        // 构建作品信息
        const isPrivate = state.restMode === 'hide';
        const privacyText = isPrivate ? t('badge_private') : t('badge_public');
        const privacyClass = isPrivate ? 'pbs-badge-hide' : 'pbs-badge-public';

        const isGroup = work.pageCount > 1;
        const typeText = isGroup ? t('badge_group') : t('badge_single');
        const typeClass = isGroup ? 'pbs-badge-multiple' : 'pbs-badge-single';

        info.innerHTML = `
            <span class="${CSS_CLASSES.BADGE} pbs-badge-tag">${t('badge_tag')}: ${state.currentTag || t('badge_all_tags')}</span>
            <span class="${CSS_CLASSES.BADGE} ${privacyClass}">${privacyText}</span>
            <span class="${CSS_CLASSES.BADGE} ${typeClass}">${typeText} (P:${pages.length})</span>
            <a href="/artworks/${work.id}" target="_blank" style="color: #0096fa; text-decoration: none;"><b>${work.title}</b></a>
            <br>
            <span style="font-size:0.8em; color:#ccc">by ${work.userName}</span>
        `;

        throttledUpdateCounter(pages.length);

        const currentUrl = pages[state.pageIndex];

        // 不立即显示 loading
        let loadingTimer = null;
        let imageLoaded = false;

        // ===== 方案1：简单高效的图片加载 =====
        img.style.opacity = '0';
        // showLoading('加载中...');

        // 如果 300ms 后还没加载完，才显示 loading
        loadingTimer = setTimeout(() => {
            if (!imageLoaded) {
                showLoading(t('loading'));
            }
        }, 300);  // ← 延迟显示

        // 设置加载成功回调
        img.onload = () => {
            if (requestId === state.currentRequestId) {
                imageLoaded = true;
                clearTimeout(loadingTimer);
                hideLoading();
                img.style.opacity = '1';
                Logger.debug(`图片加载成功: ${work.id} - 页 ${state.pageIndex + 1}`);
            } else {
                Logger.debug('图片加载完成但请求已过期');
            }
        };

        // 设置加载失败回调
        img.onerror = () => {
            if (requestId === state.currentRequestId) {
                clearTimeout(loadingTimer);
                Logger.error(`图片加载失败: ${currentUrl}`);
                showLoadingError(t('err_img_load'), () => showImage());
            }
        };

        // 设置加载超时
        state.imageLoadTimeout = setTimeout(() => {
            if (requestId === state.currentRequestId && img.style.opacity === '0') {
                clearTimeout(loadingTimer);
                Logger.warn('图片加载超时');
                showLoadingError(t('err_img_timeout'), () => showImage());
            }
        }, CONSTANTS.IMAGE_LOAD_TIMEOUT_MS);

        // 直接设置图片 URL（浏览器会自动处理缓存和并行加载）
        img.src = currentUrl;

        // 预加载下一张图片
        preloadNext();
        preloadNextBlock();
    }

    // --- 预加载逻辑 ---
    function preloadNext() {
        const work = state.works[state.workIndex];
        if (work && work.isPlaceholder) return;

        const pages = state.worksCache.get(work.id);

        if (pages && state.pageIndex < pages.length - 1) {
            createPreloadLink(pages[state.pageIndex + 1]);
        } else if (state.workIndex < state.works.length - 1) {
            const nextWork = state.works[state.workIndex + 1];
            if (nextWork && !nextWork.isPlaceholder && !state.worksCache.has(nextWork.id)) {
                getWorkPages(nextWork);
            }
        }
    }

    function createPreloadLink(url) {
        // 限制预加载链接数量，防止内存占用过大
        if (state.preloadedLinks.size >= CONFIG.preloadCount) {
            const firstLink = Array.from(state.preloadedLinks)[0];
            if (firstLink && firstLink.parentNode) {
                firstLink.parentNode.removeChild(firstLink);
            }
            state.preloadedLinks.delete(firstLink);
        }

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
        state.preloadedLinks.add(link);
        Logger.debug('预加载图片:', url);
    }

    function preloadNextBlock() {
        const currentBlockStart = Math.floor(state.workIndex / CONSTANTS.WORK_BLOCK_SIZE) * CONSTANTS.WORK_BLOCK_SIZE;
        const nextBlockStart = currentBlockStart + CONSTANTS.WORK_BLOCK_SIZE;

        if (state.hasMore && (state.works.length - state.workIndex) < CONSTANTS.PRELOAD_THRESHOLD) {
            const nextBlockIndex = nextBlockStart;
            if (nextBlockIndex < state.works.length && state.works[nextBlockIndex].isPlaceholder) {
                Logger.debug('触发占位符块预加载');
                fetchPlaceholderBlock(nextBlockIndex);
            } else if (nextBlockIndex >= state.works.length) {
                Logger.debug('触发顺序块预加载');
                fetchBookmarks(state.works.length);
            }
        }
    }

    // --- 检查并加载占位符 ---
    async function checkAndLoadPlaceholder() {
        const currentWork = state.works[state.workIndex];

        if (!currentWork || !currentWork.isPlaceholder) {
            return true;
        }

        const blockStartOffset = Math.floor(state.workIndex / CONSTANTS.WORK_BLOCK_SIZE) * CONSTANTS.WORK_BLOCK_SIZE;
        const success = await fetchPlaceholderBlock(blockStartOffset);

        return success;
    }

    // --- 跳转到指定作品 ---
    async function jumpToWork(targetIndex, wasPlayingBeforeJump) {
        if (targetIndex < 0) targetIndex = 0;

        showLoading(t('loading_list'));

        if (state.works.length === 0 && targetIndex >= 0) {
            await fetchBookmarks(0);
            if (state.works.length === 0) {
                showLoadingError(t('err_list_empty'), null);
                setTimeout(() => stopSlideshow(), 3000);
                return;
            }
        }

        const targetBlockStart = Math.floor(targetIndex / CONSTANTS.WORK_BLOCK_SIZE) * CONSTANTS.WORK_BLOCK_SIZE;

        // 检查1: 目标块超出当前列表 OR 目标块是占位符
        const needsLoad = targetBlockStart >= state.works.length ||
            (state.works[targetBlockStart] && state.works[targetBlockStart].isPlaceholder);

        if (needsLoad) {
            // =====================
            // 如果目标块超出列表，需要先插入占位符
            if (targetBlockStart >= state.works.length) {
                let currentOffset = state.works.length;
                while (currentOffset < targetBlockStart) {
                    for (let i = 0; i < CONSTANTS.WORK_BLOCK_SIZE; i++) {
                        if (currentOffset + i >= state.works.length) {
                            state.works.push({ isPlaceholder: true, id: currentOffset + i });
                        }
                    }
                    currentOffset += CONSTANTS.WORK_BLOCK_SIZE;
                }
            }

            // 加载目标块
            let attempts = 0;
            let fetchSuccessful = false;

            while (!fetchSuccessful && attempts < CONSTANTS.MAX_RETRY_ATTEMPTS) {
                showLoading(t('loading_jump', targetIndex + 1, attempts + 1, CONSTANTS.MAX_RETRY_ATTEMPTS));

                fetchSuccessful = await fetchBookmarks(targetBlockStart);

                if (!fetchSuccessful && state.hasMore) {
                    attempts++;
                    await new Promise(r => setTimeout(r, CONSTANTS.RETRY_DELAY_MS));
                } else {
                    break;
                }
            }

            if (!fetchSuccessful && state.works.length <= targetIndex) {
                showLoadingError(t('err_jump_fail', targetIndex + 1),
                    () => jumpToWork(targetIndex, wasPlayingBeforeJump));
                pauseSlideshowState();
                updatePlayButton();
                return;
            }
        }

        if (targetBlockStart >= state.works.length) {
            let currentOffset = state.works.length;
            while (currentOffset < targetBlockStart) {
                for (let i = 0; i < CONSTANTS.WORK_BLOCK_SIZE; i++) {
                    if (currentOffset + i >= state.works.length) {
                        state.works.push({ isPlaceholder: true, id: currentOffset + i });
                    }
                }
                currentOffset += CONSTANTS.WORK_BLOCK_SIZE;
            }

            let attempts = 0;
            let fetchSuccessful = false;

            while (!fetchSuccessful && attempts < CONSTANTS.MAX_RETRY_ATTEMPTS) {
                showLoading(t('loading_jump', targetIndex + 1, attempts + 1, CONSTANTS.MAX_RETRY_ATTEMPTS));

                fetchSuccessful = await fetchBookmarks(targetBlockStart);

                if (!fetchSuccessful && state.hasMore) {
                    attempts++;
                    await new Promise(r => setTimeout(r, CONSTANTS.RETRY_DELAY_MS));
                } else {
                    break;
                }
            }

            if (!fetchSuccessful && state.works.length <= targetIndex) {
                showLoadingError(t('err_jump_fail', targetIndex + 1),
                    () => jumpToWork(targetIndex, wasPlayingBeforeJump));
                pauseSlideshowState();
                updatePlayButton();
                return;
            }
        }

        if (state.works.length > 0) {
            state.workIndex = Math.min(targetIndex, state.works.length - 1);
        } else {
            return;
        }

        const currentWork = state.works[state.workIndex];
        if (currentWork && currentWork.isPlaceholder) {
            showLoading(t('loading_auto_fill', state.workIndex + 1));
            await checkAndLoadPlaceholder();
        }

        state.pageIndex = 0;
        validateState();
        await showImage();

        if (wasPlayingBeforeJump) {
            resetTimer();
        }
    }

    // --- 导航函数 ---
    async function nextWork() {
        const oldLength = state.works.length;

        if (state.workIndex < oldLength - 1) {
            state.workIndex++;
            state.pageIndex = 0;

            if (!(await checkAndLoadPlaceholder())) {
                state.workIndex--;
                return;
            }
            validateState();
            showImage();
        } else if (state.hasMore) {
            showLoading(t('loading_next_page'));

            const success = await fetchBookmarks(state.works.length);

            if (success && state.works.length > oldLength) {
                state.workIndex++;
                state.pageIndex = 0;
                validateState();
                showImage();
            } else if (!state.hasMore) {
                Logger.info("达到列表末尾，循环到起点。");
                state.workIndex = 0;
                state.pageIndex = 0;
                validateState();
                showImage();
            } else {
                showLoadingError(t('err_load_fail'), () => nextWork());
                pauseSlideshowState();
                updatePlayButton();
            }
        } else {
            Logger.info("循环到列表起点");
            state.workIndex = 0;
            state.pageIndex = 0;
            validateState();
            showImage();
        }
    }

    async function prevWork() {
        if (state.workIndex > 0) {
            state.workIndex--;
            state.pageIndex = 0;

            if (!(await checkAndLoadPlaceholder())) {
                state.workIndex++;
                return;
            }
            validateState();
            showImage();
        } else {
            Logger.info("已在第一个作品");
        }
    }

    async function nextImage() {
        const work = state.works[state.workIndex];

        if (work && work.isPlaceholder) {
            await nextWork();
            return;
        }

        let pages = state.worksCache.get(work.id);
        let pageCount = pages ? pages.length : work.pageCount;

        if (state.pageIndex < pageCount - 1) {
            state.pageIndex++;
            validateState();
            showImage();
        } else {
            await nextWork();
        }
    }

    async function prevImage() {
        if (state.pageIndex > 0) {
            state.pageIndex--;
            validateState();
            showImage();
        } else {
            if (state.workIndex > 0) {
                state.workIndex--;

                if (!(await checkAndLoadPlaceholder())) {
                    state.workIndex++;
                    return;
                }

                const prevWork = state.works[state.workIndex];
                let pages = state.worksCache.get(prevWork.id);
                if (!pages) pages = await getWorkPages(prevWork);
                state.pageIndex = pages.length - 1;
                validateState();
                showImage();
            } else {
                Logger.info("已在第一张图片");
            }
        }
    }

    // --- 播放控制 ---
    function pauseSlideshowState() {
        state.isPlaying = false;
        clearInterval(state.timer);
    }

    function updatePlayButton() {
        const btn = document.getElementById('pbs-play');
        if (btn) {
            btn.textContent = state.isPlaying ? t('btn_pause') : t('btn_play');
            if (state.isPlaying) {
                btn.classList.add(CSS_CLASSES.BTN_ACTIVE);
            } else {
                btn.classList.remove(CSS_CLASSES.BTN_ACTIVE);
            }
        }
    }

    function togglePlay() {
        if (state.isPlaying) {
            pauseSlideshowState();
        } else {
            state.isPlaying = true;
            resetTimer();
        }
        updatePlayButton();
    }

    function resetTimer() {
        clearInterval(state.timer);
        if (state.isPlaying) {
            state.timer = setInterval(() => {
                nextImage();
            }, CONFIG.interval * 1000);
        }
    }

    // --- 计数器更新（节流版）---
    const throttledUpdateCounter = throttle(updateCounter, CONSTANTS.UPDATE_COUNTER_THROTTLE_MS);

    function updateCounter(currentPageTotal = 1) {
        const now = Date.now();
        if (now - state.lastCounterUpdate < CONSTANTS.UPDATE_COUNTER_THROTTLE_MS) {
            return;
        }
        state.lastCounterUpdate = now;

        const workCount = document.getElementById('pbs-work-count');
        const pageCount = document.getElementById('pbs-page-count');

        if (!workCount || !pageCount) return;

        const totalW = state.totalWorks > 0 ? state.totalWorks : state.works.filter(w => !w.isPlaceholder).length;

        workCount.innerText = `${t('count_work')}: ${state.workIndex + 1} / ${totalW}`;
        pageCount.innerText = `${t('count_page')}: ${state.pageIndex + 1} / ${currentPageTotal}`;

        const jumpInput = document.getElementById('pbs-jump-input');
        if (jumpInput) jumpInput.placeholder = state.workIndex + 1;
    }

    // --- 开始幻灯片 ---
    async function startSlideshow() {
        if (!parseContext()) return;

        // 重置状态
        state.offset = 0;
        state.works = [];
        state.worksCache.clear();
        state.workIndex = 0;
        state.pageIndex = 0;
        state.hasMore = true;
        state.totalWorks = 0;
        state.currentRequestId = 0;
        ResourceManager.cleanup();

        document.getElementById(CSS_CLASSES.OVERLAY).style.display = 'flex';

        const info = document.getElementById('pbs-info');
        const restModeText = state.restMode === 'hide' ? t('badge_private') : t('badge_public');
        const restModeClass = state.restMode === 'hide' ? 'pbs-badge-hide' : 'pbs-badge-public';

        info.innerHTML = `
            <span class="${CSS_CLASSES.BADGE} pbs-badge-tag">${t('badge_tag')}: ${state.currentTag || t('badge_all_tags')}</span>
            <span class="${CSS_CLASSES.BADGE} ${restModeClass}">${restModeText}</span>
            <span style="margin-left: 10px;">${t('loading')}</span>
        `;

        showLoading(t('loading_first_page'));

        const success = await fetchBookmarks(0);

        if (success && state.works.length > 0) {
            showImage();
            if (CONFIG.autoPlay) {
                state.isPlaying = true;
                updatePlayButton();
                resetTimer();
            }
        } else {
            const modeText = state.restMode === 'hide' ? t('mode_private') : t('mode_public');
            const tagText = state.currentTag || t('tag_all_verbose');

            showLoadingError(
                t('err_start_empty', modeText, tagText),
                () => startSlideshow()
            );
        }
    }

    // --- 停止幻灯片 ---
    function stopSlideshow() {
        pauseSlideshowState();
        document.getElementById(CSS_CLASSES.OVERLAY).style.display = 'none';

        ResourceManager.cleanup();

        const img = document.getElementById(CSS_CLASSES.MAIN_IMAGE);
        if (img) {
            img.onload = null;
            img.onerror = null;
            img.src = '';
        }

        hideLoading();

        Logger.info('幻灯片已停止');
    }

    // --- 初始化 ---
    function init() {
        if (location.href.includes('bookmarks')) {
            createUI();
            Logger.info('UI 已初始化');
        } else {
            const fab = document.getElementById(CSS_CLASSES.FAB);
            if (fab) fab.remove();
        }
    }

    // --- 页面监听 ---
    const observer = new MutationObserver(() => {
        const fab = document.getElementById(CSS_CLASSES.FAB);
        if (fab && !location.href.includes('bookmarks')) {
            fab.style.display = 'none';
        } else if (!fab && location.href.includes('bookmarks')) {
            init();
        } else if (fab) {
            fab.style.display = 'flex';
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('beforeunload', () => {
        ResourceManager.cleanup();
        Logger.info('页面卸载，清理资源');
    });

    init();
    Logger.info('Pixiv 幻灯片脚本已加载');

})();