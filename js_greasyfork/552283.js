// ==UserScript==
// @name         YouTube Cleaner - Block Shorts, Ads & Clutter
// @name:zh-TW   YouTube Cleaner - 隱藏 Shorts、廣告與雜訊
// @name:zh-CN   YouTube Cleaner - 隐藏 Shorts、广告与杂讯
// @name:ja      YouTube Cleaner - Shorts・広告・雑音をブロック
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Hide YouTube Shorts, ads, low-view videos, clutter & bypass anti-adblock. 20+ filter rules, fully customizable.
// @description:zh-TW  隱藏 Shorts、廣告、低觀看數影片與雜訊，並繞過反廣告攔截。20+ 過濾規則，完全可自訂。
// @description:zh-CN  隐藏 Shorts、广告、低观看数视频与杂讯，并绕过反广告拦截。20+ 过滤规则，完全可自定义。
// @description:ja     Shorts、広告、低視聴数動画、雑音を非表示。アンチ広告ブロック回避対応。20以上のフィルタールール。
// @author       Benny & AI Collaborators
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/embed/*
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/552283/YouTube%20Cleaner%20-%20Block%20Shorts%2C%20Ads%20%20Clutter.user.js
// @updateURL https://update.greasyfork.org/scripts/552283/YouTube%20Cleaner%20-%20Block%20Shorts%2C%20Ads%20%20Clutter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 🏛️ Architecture Overview (v2.0)
     * 0. SELECTORS: Centralized selector management for easy maintenance.
     * 1. ConfigManager: Unified state management for settings.
     * 2. Utils: Stateless helper functions (parsing, debouncing).
     * 3. Logger: centralized logging wrapper.
     * 4. FilterStats: Statistics tracking for filtered content.
     * 5. StyleManager: Handles CSS injection for high-performance static filtering.
     * 6. AdBlockGuard: Specialized module for anti-adblock popup removal.
     * 7. VideoFilter: The core engine for Dynamic Filtering (View counts, etc).
     * 8. CustomRuleManager: Extensible rule system for easy adding of new text-based filters.
     * 9. InteractionEnhancer: Open in new tab functionality.
     * 10. UIManager: Handles the Tampermonkey menu interface.
     * 11. App: Application entry point and orchestrator.
     */

    // --- 0. Centralized Selectors (Easy maintenance when YouTube updates) ---
    const SELECTORS = {
        // 頂層容器 (用於過濾)
        VIDEO_CONTAINERS: [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-compact-video-renderer',  // 播放頁側邊欄
            'ytd-grid-video-renderer',
            'yt-lockup-view-model',
            'ytd-compact-radio-renderer',   // 播放頁自動播放清單
            'ytd-playlist-panel-video-renderer'  // 播放清單面板
        ],
        SECTION_CONTAINERS: [
            'ytd-rich-section-renderer',
            'ytd-rich-shelf-renderer',
            'ytd-reel-shelf-renderer',
            'grid-shelf-view-model',
            'ytd-watch-next-secondary-results-renderer'  // 播放頁推薦區塊
        ],

        // Metadata 選擇器 (新舊版相容)
        METADATA: {
            // 觀看數/時間
            TEXT: '.inline-metadata-item, #metadata-line span, .yt-content-metadata-view-model__metadata-text, yt-content-metadata-view-model .yt-core-attributed-string',
            // 標題連結 (用於 aria-label 提取)
            TITLE_LINKS: [
                'a#video-title-link[aria-label]',
                'a#thumbnail[aria-label]',
                'a.yt-lockup-metadata-view-model__title[aria-label]',
                'a[href*="/watch?"][aria-label]'
            ],
            // 時長
            DURATION: 'ytd-thumbnail-overlay-time-status-renderer, span.ytd-thumbnail-overlay-time-status-renderer, badge-shape .yt-badge-shape__text, yt-thumbnail-badge-view-model .yt-badge-shape__text',
            // 頻道名稱
            CHANNEL: 'ytd-channel-name, .ytd-channel-name, a[href^="/@"]',
            // 標題文字
            TITLE: '#video-title, #title, .yt-lockup-metadata-view-model__title, h3'
        },

        // 會員/廣告標記
        BADGES: {
            MEMBERS: '.badge-style-type-members-only, [aria-label*="會員專屬"], [aria-label*="Members only"]',
            AD: '[aria-label*="廣告"], [aria-label*="Sponsor"], ad-badge-view-model, feed-ad-metadata-view-model',
            SHORTS: 'a[href*="/shorts/"]',
            MIX: 'a[aria-label*="合輯"], a[aria-label*="Mix"]'
        },

        // 互動排除
        INTERACTION_EXCLUDE: 'button, yt-icon-button, #menu, ytd-menu-renderer, ytd-toggle-button-renderer, yt-chip-cloud-chip-renderer, .yt-spec-button-shape-next, .yt-core-attributed-string__link, #subscribe-button, .ytp-progress-bar, .ytp-chrome-bottom',

        // 可點擊容器
        CLICKABLE: [
            'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer',
            'yt-lockup-view-model', 'ytd-playlist-renderer', 'ytd-compact-playlist-renderer',
            'ytd-video-owner-renderer', 'ytd-grid-video-renderer'
        ],

        // 內嵌預覽
        PREVIEW_PLAYER: 'ytd-video-preview',

        // 連結候選
        LINK_CANDIDATES: [
            'a#thumbnail[href*="/watch?"]', 'a#thumbnail[href*="/shorts/"]', 'a#thumbnail[href*="/playlist?"]',
            'a#video-title-link', 'a#video-title', 'a.yt-simple-endpoint#video-title', 'a.yt-lockup-view-model-wiz__title'
        ],

        // 生成組合選擇器
        get allContainers() {
            return [...this.VIDEO_CONTAINERS, ...this.SECTION_CONTAINERS].join(', ');
        },
        get videoContainersStr() {
            return this.VIDEO_CONTAINERS.join(', ');
        }
    };

    // --- 0.1 Filter Statistics ---
    const FilterStats = {
        counts: {},
        session: { total: 0, byRule: {} },

        record(reason) {
            this.counts[reason] = (this.counts[reason] || 0) + 1;
            this.session.total++;
            this.session.byRule[reason] = (this.session.byRule[reason] || 0) + 1;
        },

        getSummary() {
            return `已過濾 ${this.session.total} 個項目\n` +
                Object.entries(this.session.byRule)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => `  ${k}: ${v}`)
                    .join('\n');
        },

        reset() {
            this.session = { total: 0, byRule: {} };
        }
    };

    // --- 0.3 Internationalization (i18n) ---
    const I18N = {
        _lang: null,

        // 語言字典
        strings: {
            'zh-TW': {
                title: 'YouTube 淨化大師',
                menu_rules: '📂 設定過濾規則',
                menu_low_view: '低觀看數過濾 (含直播)',
                menu_threshold: '🔢 設定閾值',
                menu_advanced: '🚫 進階過濾',
                menu_new_tab: '強制新分頁',
                menu_debug: 'Debug',
                menu_reset: '🔄 恢復預設',
                menu_stats: '📊 過濾統計',
                menu_export: '💾 匯出/匯入設定',
                menu_lang: '🌐 語言',
                menu_input: '輸入選項:',
                stats_title: '【 過濾統計 】',
                stats_empty: '尚未過濾任何內容',
                stats_filtered: '已過濾 {0} 個項目',
                export_title: '【 設定管理 】',
                export_export: '📤 匯出設定',
                export_import: '📥 匯入設定',
                export_success: '✅ 設定已複製到剪貼簿！',
                export_copy: '請複製以下設定 (Ctrl+C):',
                import_prompt: '請貼上設定 JSON:',
                import_success: '✅ 設定已成功匯入！',
                import_fail: '❌ 匯入失敗: ',
                rules_title: '【 過濾規則 】',
                rules_back: '(0 返回)',
                threshold_prompt: '閾值:',
                reset_confirm: '重設?',
                lang_title: '【 選擇語言 】',
                back: '返回',
                adv_keyword_filter: '關鍵字過濾',
                adv_keyword_list: '✏️ 關鍵字清單',
                adv_channel_filter: '頻道過濾',
                adv_channel_list: '✏️ 頻道清單',
                adv_duration_filter: '長度過濾',
                adv_duration_set: '⏱️ 設定長度',
                adv_min: '最短(分):',
                adv_max: '最長(分):',
                adv_add: '新增',
                adv_remove: '刪除',
                adv_clear: '清空'
            },
            'zh-CN': {
                title: 'YouTube 净化大师',
                menu_rules: '📂 设置过滤规则',
                menu_low_view: '低观看数过滤 (含直播)',
                menu_threshold: '🔢 设置阈值',
                menu_advanced: '🚫 高级过滤',
                menu_new_tab: '强制新标签页',
                menu_debug: 'Debug',
                menu_reset: '🔄 恢复默认',
                menu_stats: '📊 过滤统计',
                menu_export: '💾 导出/导入设置',
                menu_lang: '🌐 语言',
                menu_input: '输入选项:',
                stats_title: '【 过滤统计 】',
                stats_empty: '尚未过滤任何内容',
                stats_filtered: '已过滤 {0} 个项目',
                export_title: '【 设置管理 】',
                export_export: '📤 导出设置',
                export_import: '📥 导入设置',
                export_success: '✅ 设置已复制到剪贴板！',
                export_copy: '请复制以下设置 (Ctrl+C):',
                import_prompt: '请粘贴设置 JSON:',
                import_success: '✅ 设置已成功导入！',
                import_fail: '❌ 导入失败: ',
                rules_title: '【 过滤规则 】',
                rules_back: '(0 返回)',
                threshold_prompt: '阈值:',
                reset_confirm: '重置?',
                lang_title: '【 选择语言 】',
                back: '返回',
                adv_keyword_filter: '关键字过滤',
                adv_keyword_list: '✏️ 关键字列表',
                adv_channel_filter: '频道过滤',
                adv_channel_list: '✏️ 频道列表',
                adv_duration_filter: '时长过滤',
                adv_duration_set: '⏱️ 设置时长',
                adv_min: '最短(分):',
                adv_max: '最长(分):',
                adv_add: '新增',
                adv_remove: '删除',
                adv_clear: '清空'
            },
            'en': {
                title: 'YouTube Cleaner',
                menu_rules: '📂 Filter Rules',
                menu_low_view: 'Low View Filter (incl. Live)',
                menu_threshold: '🔢 Set Threshold',
                menu_advanced: '🚫 Advanced Filters',
                menu_new_tab: 'Force New Tab',
                menu_debug: 'Debug',
                menu_reset: '🔄 Reset to Default',
                menu_stats: '📊 Filter Stats',
                menu_export: '💾 Export/Import Settings',
                menu_lang: '🌐 Language',
                menu_input: 'Enter option:',
                stats_title: '【 Filter Statistics 】',
                stats_empty: 'No content filtered yet',
                stats_filtered: 'Filtered {0} items',
                export_title: '【 Settings Management 】',
                export_export: '📤 Export Settings',
                export_import: '📥 Import Settings',
                export_success: '✅ Settings copied to clipboard!',
                export_copy: 'Copy settings (Ctrl+C):',
                import_prompt: 'Paste settings JSON:',
                import_success: '✅ Settings imported successfully!',
                import_fail: '❌ Import failed: ',
                rules_title: '【 Filter Rules 】',
                rules_back: '(0 Back)',
                threshold_prompt: 'Threshold:',
                reset_confirm: 'Reset?',
                lang_title: '【 Select Language 】',
                back: 'Back',
                adv_keyword_filter: 'Keyword Filter',
                adv_keyword_list: '✏️ Keyword List',
                adv_channel_filter: 'Channel Filter',
                adv_channel_list: '✏️ Channel List',
                adv_duration_filter: 'Duration Filter',
                adv_duration_set: '⏱️ Set Duration',
                adv_min: 'Min (min):',
                adv_max: 'Max (min):',
                adv_add: 'Add',
                adv_remove: 'Remove',
                adv_clear: 'Clear'
            },
            'ja': {
                title: 'YouTube クリーナー',
                menu_rules: '📂 フィルタルール',
                menu_low_view: '低視聴数フィルター (ライブ含む)',
                menu_threshold: '🔢 閾値設定',
                menu_advanced: '🚫 詳細フィルター',
                menu_new_tab: '新しいタブで開く',
                menu_debug: 'デバッグ',
                menu_reset: '🔄 初期化',
                menu_stats: '📊 フィルター統計',
                menu_export: '💾 設定のエクスポート/インポート',
                menu_lang: '🌐 言語',
                menu_input: 'オプションを入力:',
                stats_title: '【 フィルター統計 】',
                stats_empty: 'まだフィルターされたコンテンツはありません',
                stats_filtered: '{0} 件をフィルターしました',
                export_title: '【 設定管理 】',
                export_export: '📤 設定をエクスポート',
                export_import: '📥 設定をインポート',
                export_success: '✅ 設定をクリップボードにコピーしました！',
                export_copy: '設定をコピー (Ctrl+C):',
                import_prompt: '設定JSONを貼り付け:',
                import_success: '✅ 設定をインポートしました！',
                import_fail: '❌ インポート失敗: ',
                rules_title: '【 フィルタールール 】',
                rules_back: '(0 戻る)',
                threshold_prompt: '閾値:',
                reset_confirm: 'リセットしますか?',
                lang_title: '【 言語選択 】',
                back: '戻る',
                adv_keyword_filter: 'キーワードフィルター',
                adv_keyword_list: '✏️ キーワードリスト',
                adv_channel_filter: 'チャンネルフィルター',
                adv_channel_list: '✏️ チャンネルリスト',
                adv_duration_filter: '長さフィルター',
                adv_duration_set: '⏱️ 長さ設定',
                adv_min: '最短(分):',
                adv_max: '最長(分):',
                adv_add: '追加',
                adv_remove: '削除',
                adv_clear: 'クリア'
            }
        },

        // 規則名稱翻譯
        ruleNames: {
            'zh-TW': {
                ad_block_popup: '廣告阻擋彈窗',
                ad_sponsor: '廣告/贊助',
                members_only: '會員專屬',
                shorts_item: 'Shorts 項目',
                mix_only: '合輯',
                premium_banner: 'Premium 橫幅',
                news_block: '新聞區塊',
                shorts_block: 'Shorts 區塊',
                posts_block: '社群貼文',
                playables_block: '可玩內容',
                fundraiser_block: '募款活動',
                shorts_grid_shelf: 'Shorts 網格',
                movies_shelf: '電影推薦',
                youtube_featured_shelf: 'YouTube 精選',
                popular_gaming_shelf: '熱門遊戲',
                more_from_game_shelf: '更多遊戲內容',
                trending_playlist: '熱門播放清單',
                inline_survey: '問卷調查',
                clarify_box: '資訊框',
                explore_topics: '探索主題',
                recommended_playlists: '推薦播放清單',
                members_early_access: '會員搶先看'
            },
            'zh-CN': {
                ad_block_popup: '广告拦截弹窗',
                ad_sponsor: '广告/赞助',
                members_only: '会员专属',
                shorts_item: 'Shorts 项目',
                mix_only: '合辑',
                premium_banner: 'Premium 横幅',
                news_block: '新闻区块',
                shorts_block: 'Shorts 区块',
                posts_block: '社区帖子',
                playables_block: '可玩内容',
                fundraiser_block: '募款活动',
                shorts_grid_shelf: 'Shorts 网格',
                movies_shelf: '电影推荐',
                youtube_featured_shelf: 'YouTube 精选',
                popular_gaming_shelf: '热门游戏',
                more_from_game_shelf: '更多游戏内容',
                trending_playlist: '热门播放列表',
                inline_survey: '问卷调查',
                clarify_box: '信息框',
                explore_topics: '探索主题',
                recommended_playlists: '推荐播放列表',
                members_early_access: '会员抢先看'
            },
            'en': {
                ad_block_popup: 'Ad-block Popup',
                ad_sponsor: 'Ads / Sponsors',
                members_only: 'Members Only',
                shorts_item: 'Shorts Items',
                mix_only: 'Mix Playlists',
                premium_banner: 'Premium Banner',
                news_block: 'News Section',
                shorts_block: 'Shorts Section',
                posts_block: 'Community Posts',
                playables_block: 'Playables',
                fundraiser_block: 'Fundraiser',
                shorts_grid_shelf: 'Shorts Grid',
                movies_shelf: 'Movies Shelf',
                youtube_featured_shelf: 'YouTube Featured',
                popular_gaming_shelf: 'Popular Gaming',
                more_from_game_shelf: 'More from Games',
                trending_playlist: 'Trending Playlist',
                inline_survey: 'Surveys',
                clarify_box: 'Clarify Box',
                explore_topics: 'Explore Topics',
                recommended_playlists: 'Recommended Playlists',
                members_early_access: 'Members Early Access'
            },
            'ja': {
                ad_block_popup: '広告ブロックポップアップ',
                ad_sponsor: '広告/スポンサー',
                members_only: 'メンバー限定',
                shorts_item: 'Shorts アイテム',
                mix_only: 'ミックス',
                premium_banner: 'Premium バナー',
                news_block: 'ニュースセクション',
                shorts_block: 'Shorts セクション',
                posts_block: 'コミュニティ投稿',
                playables_block: 'プレイアブル',
                fundraiser_block: '募金活動',
                shorts_grid_shelf: 'Shorts グリッド',
                movies_shelf: '映画のおすすめ',
                youtube_featured_shelf: 'YouTube おすすめ',
                popular_gaming_shelf: '人気ゲーム',
                more_from_game_shelf: 'ゲーム関連',
                trending_playlist: '急上昇プレイリスト',
                inline_survey: 'アンケート',
                clarify_box: '情報ボックス',
                explore_topics: 'トピックを探す',
                recommended_playlists: 'おすすめプレイリスト',
                members_early_access: 'メンバー先行'
            }
        },

        // 取得規則顯示名稱
        getRuleName(ruleKey) {
            return this.ruleNames[this.lang]?.[ruleKey] || this.ruleNames['en'][ruleKey] || ruleKey;
        },

        // 自動偵測語言
        detectLanguage() {
            const ytLang = document.documentElement.lang || navigator.language || 'zh-TW';
            if (ytLang.startsWith('zh-CN') || ytLang.startsWith('zh-Hans')) return 'zh-CN';
            if (ytLang.startsWith('zh')) return 'zh-TW';
            if (ytLang.startsWith('ja')) return 'ja';
            return 'en';
        },

        get lang() {
            if (!this._lang) {
                this._lang = GM_getValue('ui_language', null) || this.detectLanguage();
            }
            return this._lang;
        },

        set lang(value) {
            this._lang = value;
            GM_setValue('ui_language', value);
        },

        // 取得翻譯字串
        t(key, ...args) {
            const str = this.strings[this.lang]?.[key] || this.strings['en'][key] || key;
            return str.replace(/\{(\d+)\}/g, (_, i) => args[i] ?? '');
        },

        // 語言清單
        get availableLanguages() {
            return {
                'zh-TW': '繁體中文',
                'zh-CN': '简体中文',
                'en': 'English',
                'ja': '日本語'
            };
        }
    };

    // --- 1. Core: Configuration Management ---
    class ConfigManager {
        constructor() {
            this.defaults = {
                LOW_VIEW_THRESHOLD: 1000,
                ENABLE_LOW_VIEW_FILTER: true,
                DEBUG_MODE: false,
                OPEN_IN_NEW_TAB: true,
                ENABLE_KEYWORD_FILTER: false,
                KEYWORD_BLACKLIST: [],
                ENABLE_CHANNEL_FILTER: false,
                CHANNEL_BLACKLIST: [],
                ENABLE_DURATION_FILTER: false,
                DURATION_MIN: 0,
                DURATION_MAX: 0,
                GRACE_PERIOD_HOURS: 4,
                // These connect to simple toggle switches
                RULE_ENABLES: {
                    ad_block_popup: true, ad_sponsor: true, members_only: true, shorts_item: true,
                    mix_only: true, premium_banner: true, news_block: true, shorts_block: true,
                    posts_block: true, playables_block: true, fundraiser_block: true,
                    shorts_grid_shelf: true, movies_shelf: true,
                    youtube_featured_shelf: true, popular_gaming_shelf: true,
                    more_from_game_shelf: true, trending_playlist: true,
                    inline_survey: true, clarify_box: true, explore_topics: true,
                    recommended_playlists: true, members_early_access: true
                }
            };
            this.state = this._load();
        }

        _load() {
            const get = (k, d) => GM_getValue(k, d);
            const snake = str => str.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);

            const loaded = {};
            for (const key in this.defaults) {
                if (key === 'RULE_ENABLES') {
                    const saved = get('ruleEnables', {});
                    loaded[key] = { ...this.defaults.RULE_ENABLES, ...saved };
                } else {
                    loaded[key] = get(snake(key), this.defaults[key]);
                    if (Array.isArray(this.defaults[key]) && !Array.isArray(loaded[key])) {
                        loaded[key] = [...this.defaults[key]];
                    }
                }
            }
            return loaded;
        }

        get(key) { return this.state[key]; }

        set(key, value) {
            this.state[key] = value;
            const snake = str => str.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
            if (key === 'RULE_ENABLES') GM_setValue('ruleEnables', value);
            else GM_setValue(snake(key), value);
        }

        toggleRule(ruleId) {
            this.state.RULE_ENABLES[ruleId] = !this.state.RULE_ENABLES[ruleId];
            this.set('RULE_ENABLES', this.state.RULE_ENABLES);
        }
    }

    // --- 2. Core: Utilities (Enhanced i18n Support) ---
    const Utils = {
        debounce: (func, delay) => {
            let t;
            return (...args) => { clearTimeout(t); t = setTimeout(() => func(...args), delay); };
        },

        // 國際化數字解析 (支援多語言)
        parseNumeric: (text, type = 'any') => {
            if (!text) return null;
            const clean = text.replace(/,/g, '').toLowerCase().trim();

            // 排除時間字串
            if (type === 'view' && /(ago|前|hour|minute|day|week|month|year|秒|分|時|天|週|月|年|時間|전|日|ヶ月|年前)/.test(clean)) return null;

            // 支援各種語言的數字單位
            const match = clean.match(/([\d.]+)\s*([kmb千萬万億亿]|천|만|억|lakh|crore)?/i);
            if (!match) return null;

            let num = parseFloat(match[1]);
            const unit = match[2]?.toLowerCase();
            if (unit) {
                const unitMap = {
                    // 英文
                    'k': 1e3, 'm': 1e6, 'b': 1e9,
                    // 繁體中文
                    '千': 1e3, '萬': 1e4, '億': 1e8,
                    // 簡體中文
                    '万': 1e4, '亿': 1e8,
                    // 日文 (同中文)
                    // 韓文
                    '천': 1e3, '만': 1e4, '억': 1e8,
                    // 印度
                    'lakh': 1e5, 'crore': 1e7
                };
                num *= (unitMap[unit] || 1);
            }
            return Math.floor(num);
        },

        parseDuration: (text) => {
            if (!text) return null;
            const parts = text.trim().split(':').map(Number);
            if (parts.some(isNaN)) return null;
            return parts.length === 3
                ? parts[0] * 3600 + parts[1] * 60 + parts[2]
                : (parts.length === 2 ? parts[0] * 60 + parts[1] : null);
        },

        // 國際化時間解析 (支援多語言)
        parseTimeAgo: (text) => {
            if (!text) return null;
            const raw = text.toLowerCase();

            // 秒
            if (/second|秒|초|วินาที/.test(raw)) return 0;

            const match = raw.match(/(\d+)/);
            if (!match) return null;
            const val = parseInt(match[1], 10);

            // 分鐘
            if (/minute|分鐘|分钟|分|분|นาที/.test(raw)) return val;
            // 小時
            if (/hour|小時|小时|時間|시간|ชั่วโมง/.test(raw)) return val * 60;
            // 天
            if (/day|天|日|일|วัน/.test(raw)) return val * 1440;
            // 週
            if (/week|週|周|주|สัปดาห์/.test(raw)) return val * 10080;
            // 月
            if (/month|月|ヶ月|개월|เดือน/.test(raw)) return val * 43200;
            // 年
            if (/year|年|년|ปี/.test(raw)) return val * 525600;

            return null;
        },

        // 解析直播觀看數 (支援「正在觀看」「觀眾」等關鍵字)
        parseLiveViewers: (text) => {
            if (!text) return null;
            const liveKeywords = /(正在觀看|觀眾|watching|viewers)/i;
            if (!liveKeywords.test(text)) return null;
            return Utils.parseNumeric(text, 'any');
        },

        // 從 aria-label 提取觀看數資訊
        extractAriaTextForCounts: (container) => {
            const a1 = container.querySelector(':scope a#video-title-link[aria-label]');
            if (a1?.ariaLabel) return a1.ariaLabel;
            const a2 = container.querySelector(':scope a#thumbnail[aria-label]');
            if (a2?.ariaLabel) return a2.ariaLabel;
            return '';
        }
    };

    // --- 3. Core: Logger ---
    const Logger = {
        enabled: false,
        prefix: `[Purifier]`,
        info(msg, ...args) { if (this.enabled) console.log(`%c${this.prefix} ${msg}`, 'color:#3498db;font-weight:bold', ...args); },
        warn(msg, ...args) { if (this.enabled) console.warn(`${this.prefix} ${msg}`, ...args); }
    };

    // --- 4. Module: Custom Rule Manager (Extensibility) ---
    /**
     * Designed to make adding new simple text-based rules easy.
     * Add new entries to the `definitions` array here.
     */
    class CustomRuleManager {
        constructor(config) {
            this.config = config;
            // ★ ADD NEW RULES HERE ★
            // Format: { key: 'config_key_name', rules: [/Regex/i, 'String'], type: 'text' (default) }
            this.definitions = [
                // 從 v1.4.0 還原的文字匹配規則 (作為 CSS 的備援)
                { key: 'members_only', rules: [/頻道會員專屬|Members only/i] },
                { key: 'mix_only', rules: [/^(合輯|Mix)[\s\-–]/i] },

                // 區塊/Shelf 類規則
                { key: 'news_block', rules: [/新聞快報|Breaking News|ニュース/i] },
                { key: 'posts_block', rules: [/貼文|Posts|投稿|Publicaciones|最新 YouTube 貼文/i] },
                { key: 'playables_block', rules: [/Playables|遊戲角落/i] },
                { key: 'fundraiser_block', rules: [/Fundraiser|募款/i] },
                { key: 'popular_gaming_shelf', rules: [/熱門遊戲直播/i] },
                { key: 'explore_topics', rules: [/探索更多主題|Explore more topics/i] },
                { key: 'movies_shelf', rules: [/為你推薦的特選電影|featured movies|YouTube 精選/i] },
                { key: 'trending_playlist', rules: [/發燒影片|Trending/i] },
                { key: 'youtube_featured_shelf', rules: [/YouTube 精選/i] },
                { key: 'shorts_block', rules: [/^Shorts$/i] },
                { key: 'shorts_grid_shelf', rules: [/^Shorts$/i] },
                { key: 'more_from_game_shelf', rules: [/^更多此遊戲相關內容$/i] },
                { key: 'members_early_access', rules: [/會員優先|Members Early Access|Early access for members/i] }
            ];
        }

        check(element, textContent) {
            const enables = this.config.get('RULE_ENABLES');
            for (const def of this.definitions) {
                if (enables[def.key]) { // Only check if enabled in config
                    for (const rule of def.rules) {
                        if (rule instanceof RegExp) {
                            if (rule.test(textContent)) return def.key;
                        } else if (textContent.includes(rule)) {
                            return def.key;
                        }
                    }
                }
            }
            return null;
        }
    }

    // --- 5. Module: Style Manager (CSS) ---
    class StyleManager {
        constructor(config) { this.config = config; }

        apply() {
            const rules = [];
            const enables = this.config.get('RULE_ENABLES');

            // 5.1 Global Fixes
            rules.push('body, html { font-family: "YouTube Noto", Roboto, Arial, "PingFang SC", "Microsoft YaHei", sans-serif !important; }');

            // 5.2 Anti-Adblock (完整還原 v1.4.0)
            if (enables.ad_block_popup) {
                rules.push(`
                    tp-yt-paper-dialog:has(ytd-enforcement-message-view-model),
                    ytd-enforcement-message-view-model,
                    #immersive-translate-browser-popup,
                    tp-yt-iron-overlay-backdrop:has(~ tp-yt-paper-dialog ytd-enforcement-message-view-model),
                    tp-yt-iron-overlay-backdrop.opened,
                    yt-playability-error-supported-renderers:has(ytd-enforcement-message-view-model) { display: none !important; }

                    ytd-app:has(ytd-enforcement-message-view-model), body:has(ytd-enforcement-message-view-model), html:has(ytd-enforcement-message-view-model) {
                        overflow: auto !important; overflow-y: auto !important; position: static !important;
                        pointer-events: auto !important; height: auto !important; top: 0 !important;
                        margin-right: 0 !important; overscroll-behavior: auto !important;
                    }

                    ytd-app[aria-hidden="true"]:has(ytd-enforcement-message-view-model) {
                        aria-hidden: false !important; display: block !important;
                    }

                    ytd-app { --ytd-app-scroll-offset: 0 !important; }
                `);
            }

            // 5.3 Simple Selection (CSS)
            // ★ Add new Selector-based rules here
            const map = {
                ad_sponsor: [
                    'ytd-ad-slot-renderer',
                    'ytd-promoted-sparkles-text-search-renderer',
                    '#masthead-ad',
                    'ytd-rich-item-renderer:has(.ytd-ad-slot-renderer)',
                    'feed-ad-metadata-view-model',
                    'ad-badge-view-model'
                ],
                premium_banner: ['ytd-statement-banner-renderer', 'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)'],
                clarify_box: ['ytd-info-panel-container-renderer'],
                inline_survey: ['ytd-rich-section-renderer:has(ytd-inline-survey-renderer)'],
                playables_block: ['ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-playables])', 'ytd-game-card-renderer']
            };

            for (const [key, selectors] of Object.entries(map)) {
                if (enables[key]) rules.push(`${selectors.join(', ')} { display: none !important; }`);
            }

            // 5.4 Advanced :has() Rules
            // ★ Add new Container rules here
            const VIDEO_CONTAINERS = 'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model';
            const hasRules = [
                { key: 'ad_sponsor', selector: '[aria-label*="廣告"], [aria-label*="Sponsor"], [aria-label="贊助商廣告"], ad-badge-view-model, feed-ad-metadata-view-model' },
                { key: 'members_only', selector: '[aria-label*="會員專屬"]' },
                { key: 'shorts_item', selector: 'a[href*="/shorts/"]' },
                { key: 'mix_only', selector: 'a[aria-label*="合輯"], a[aria-label*="Mix"]' }
            ];

            hasRules.forEach(({ key, selector }) => {
                if (enables[key]) {
                    const containers = VIDEO_CONTAINERS.split(',').map(s => s.trim());
                    containers.forEach(c => rules.push(`${c}:has(${selector}) { display: none !important; }`));
                }
            });

            // 5.5 首頁推薦播放清單 (不影響頻道頁面)
            if (enables.recommended_playlists) {
                rules.push(`
                    ytd-browse[page-subtype="home"] ytd-rich-item-renderer:has(a[href^="/playlist?list="]),
                    ytd-browse[page-subtype="home"] ytd-rich-item-renderer:has([content-id^="PL"]) { display: none !important; }
                `);
            }

            GM_addStyle(rules.join('\n'));
            Logger.info('Static CSS rules injected');
        }
    }

    // --- 6. Module: AdBlock Guard (Enhanced with Whitelist) ---
    class AdBlockGuard {
        constructor() {
            // 多語言關鍵字偵測
            this.keywords = [
                'Ad blockers', '廣告攔截器', '广告拦截器', '広告ブロッカー', '광고 차단기',
                'Video player will be blocked', '影片播放器將被封鎖', '视频播放器将被封锁',
                'Allow YouTube', '允許 YouTube', '允许 YouTube',
                'You have an ad blocker', '您使用了廣告攔截器',
                'YouTube 禁止使用廣告攔截器', "YouTube doesn't allow ad blockers"
            ];
            // 白名單選擇器 - 這些對話框絕不是廣告警告
            this.whitelistSelectors = [
                'ytd-sponsorships-offer-renderer',   // 會員加入視窗
                'ytd-about-channel-renderer',         // 頻道資訊視窗
                'ytd-report-form-modal-renderer',     // 檢舉視窗
                'ytd-multi-page-menu-renderer',       // 通用選單
                'ytd-playlist-add-to-option-renderer' // 加入播放清單視窗
            ];
            this.lastTrigger = 0;
        }

        start() {
            const beat = () => {
                this.checkAndClean();
                setTimeout(() => requestAnimationFrame(beat), 800);
            };
            beat();
        }

        isWhitelisted(dialog) {
            for (const sel of this.whitelistSelectors) {
                if (dialog.querySelector(sel)) {
                    Logger.info(`✅ Whitelist dialog detected: ${sel}`);
                    return true;
                }
            }
            return false;
        }

        isAdBlockPopup(dialog) {
            // ytd-enforcement-message-view-model 是廣告攔截專屬標籤，直接判定
            if (dialog.tagName === 'YTD-ENFORCEMENT-MESSAGE-VIEW-MODEL') {
                return true;
            }
            // 檢查是否包含廣告攔截專屬標籤
            if (dialog.querySelector('ytd-enforcement-message-view-model')) {
                return true;
            }
            // 深度關鍵字檢查
            if (dialog.innerText && this.keywords.some(k => dialog.innerText.includes(k))) {
                return true;
            }
            return false;
        }

        checkAndClean() {
            // 更積極的彈窗選擇器
            const popupSelectors = [
                'tp-yt-paper-dialog',
                'ytd-enforcement-message-view-model',
                'yt-playability-error-supported-renderers',
                'ytd-popup-container tp-yt-paper-dialog',
                '[role="dialog"]:has(ytd-enforcement-message-view-model)'
            ];

            const dialogs = document.querySelectorAll(popupSelectors.join(', '));
            let detected = false;

            for (const dialog of dialogs) {
                // ★ 白名單優先檢查 - 避免誤殺會員視窗等
                if (this.isWhitelisted(dialog)) continue;

                if (this.isAdBlockPopup(dialog)) {
                    // 嘗試點擊關閉按鈕
                    const dismissBtns = dialog.querySelectorAll('[aria-label="Close"], #dismiss-button, [aria-label="可能有風險"], .yt-spec-button-shape-next--call-to-action');
                    dismissBtns.forEach(btn => btn.click());

                    dialog.remove();
                    detected = true;
                    Logger.info(`🚫 Removed AdBlock Popup: ${dialog.tagName}`);
                }
            }

            if (detected) {
                // 移除背景遮罩 (包含所有可能的遮罩)
                document.querySelectorAll('tp-yt-iron-overlay-backdrop, .ytd-popup-container, [style*="z-index: 9999"]').forEach(b => {
                    if (b.classList.contains('opened') || b.style.display !== 'none') {
                        b.style.display = 'none';
                        b.remove();
                    }
                });
                this.unlockScroll();
                this.resumeVideo();
            }
        }

        unlockScroll() {
            const css = (el, props) => {
                if (!el) return;
                for (const [key, val] of Object.entries(props)) {
                    el.style.setProperty(key, val, 'important');
                }
            };

            const allowScrollProps = {
                'overflow-y': 'auto',
                'overflow-x': 'hidden',
                'position': 'static',
                'pointer-events': 'auto',
                'top': 'auto',
                'display': 'block'
            };

            css(document.body, allowScrollProps);
            css(document.documentElement, allowScrollProps);

            const ytdApp = document.querySelector('ytd-app');
            if (ytdApp) {
                css(ytdApp, allowScrollProps);
                ytdApp.removeAttribute('aria-hidden');
            }

            // 移除播放器模糊效果
            const watchPage = document.querySelector('ytd-watch-flexy');
            if (watchPage) {
                watchPage.style.removeProperty('filter');
            }
        }

        resumeVideo() {
            // 只有剛偵測到彈窗時才強制播放，避免過度積極
            if (Date.now() - this.lastTrigger > 3000) {
                this.lastTrigger = Date.now();
                const video = document.querySelector('video');
                if (video && video.paused && !video.ended) {
                    video.play().catch(() => { });
                }
            }
        }
    }

    // --- 7. Module: Video Filter (Lazy Evaluator) ---
    class LazyVideoData {
        constructor(element) {
            this.el = element;
            this._title = null;
            this._channel = null;
            this._viewCount = undefined;
            this._liveViewers = undefined;
            this._timeAgo = undefined;
            this._duration = undefined;
        }

        get title() {
            if (this._title === null) this._title = this.el.querySelector(SELECTORS.METADATA.TITLE)?.textContent?.trim() || '';
            return this._title;
        }
        get channel() {
            if (this._channel === null) this._channel = this.el.querySelector(SELECTORS.METADATA.CHANNEL)?.textContent?.trim() || '';
            return this._channel;
        }
        _parseMetadata() {
            if (this._viewCount !== undefined) return;

            // 使用集中管理的選擇器
            const texts = Array.from(this.el.querySelectorAll(SELECTORS.METADATA.TEXT));

            // 嘗試從 aria-label 提取
            let aria = '';
            for (const sel of SELECTORS.METADATA.TITLE_LINKS) {
                const el = this.el.querySelector(`:scope ${sel}`);
                if (el?.ariaLabel) { aria = el.ariaLabel; break; }
            }

            if (texts.length === 0 && aria) {
                this._viewCount = Utils.parseNumeric(aria, 'view');
                this._liveViewers = Utils.parseLiveViewers(aria);
                this._timeAgo = Utils.parseTimeAgo(aria);
                return;
            }

            this._viewCount = null;
            this._liveViewers = null;
            this._timeAgo = null;

            for (const t of texts) {
                const text = t.textContent;
                // 直播觀看數優先檢查
                if (this._liveViewers === null) this._liveViewers = Utils.parseLiveViewers(text);
                // 一般觀看數
                if (this._viewCount === null && /view|觀看|次/i.test(text)) this._viewCount = Utils.parseNumeric(text, 'view');
                // 時間
                if (this._timeAgo === null && /ago|前/i.test(text)) this._timeAgo = Utils.parseTimeAgo(text);
            }
        }
        get viewCount() { this._parseMetadata(); return this._viewCount; }
        get liveViewers() { this._parseMetadata(); return this._liveViewers; }
        get timeAgo() { this._parseMetadata(); return this._timeAgo; }
        get duration() {
            if (this._duration === undefined) {
                const el = this.el.querySelector(SELECTORS.METADATA.DURATION);
                this._duration = el ? Utils.parseDuration(el.textContent) : null;
            }
            return this._duration;
        }
        get isShorts() { return !!this.el.querySelector(SELECTORS.BADGES.SHORTS); }
        get isLive() { return this._liveViewers !== null; }
        get isMembers() {
            return this.el.querySelector(SELECTORS.BADGES.MEMBERS) ||
                this.el.innerText.includes('會員專屬') ||
                this.el.innerText.includes('Members only');
        }
    }

    class VideoFilter {
        constructor(config) {
            this.config = config;
            this.customRules = new CustomRuleManager(config);
        }
        // 使用 requestIdleCallback 分批處理以優化效能
        processPage() {
            const elements = Array.from(document.querySelectorAll(SELECTORS.allContainers));
            const unprocessed = elements.filter(el => !el.dataset.ypChecked);

            if (unprocessed.length === 0) return;

            // 如果瀏覽器支援 requestIdleCallback，使用分批處理
            if ('requestIdleCallback' in window) {
                this._processBatch(unprocessed, 0);
            } else {
                // Fallback: 直接處理
                for (const el of unprocessed) this.processElement(el);
            }
        }

        _processBatch(elements, startIndex, batchSize = 20) {
            requestIdleCallback((deadline) => {
                let i = startIndex;
                // 在空閒時間內處理盡可能多的元素
                while (i < elements.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
                    this.processElement(elements[i]);
                    i++;
                    // 每批最多處理 batchSize 個
                    if (i - startIndex >= batchSize) break;
                }
                // 如果還有未處理的元素，繼續排程
                if (i < elements.length) {
                    this._processBatch(elements, i, batchSize);
                }
            }, { timeout: 500 }); // 500ms 超時保證
        }

        processElement(element) {
            if (element.dataset.ypChecked) return;
            if (element.offsetParent === null) return;

            // 7.2 Custom Text Rules Check (Extensible)
            const textRule = this.customRules.check(element, element.innerText);
            if (textRule) return this._hide(element, textRule);

            // 7.3 Base Logic
            if (element.tagName.includes('VIDEO') || element.tagName.includes('LOCKUP') || element.tagName.includes('RICH-ITEM')) {
                const item = new LazyVideoData(element);

                // Advanced Filters
                // Advanced Filters
                if (this.config.get('ENABLE_KEYWORD_FILTER') && item.title) {
                    if (this.config.get('KEYWORD_BLACKLIST').some(k => item.title.toLowerCase().includes(k.toLowerCase()))) return this._hide(element, 'keyword_blacklist');
                }
                if (this.config.get('ENABLE_CHANNEL_FILTER') && item.channel) {
                    if (this.config.get('CHANNEL_BLACKLIST').some(k => item.channel.toLowerCase().includes(k.toLowerCase()))) return this._hide(element, 'channel_blacklist');
                }

                // 強化會員過濾 (JS補刀)：若開啟成員過濾且偵測到是會員影片，直接隱藏
                if (this.config.get('RULE_ENABLES').members_only && item.isMembers) {
                    return this._hide(element, 'members_only_js');
                }

                if (this.config.get('ENABLE_LOW_VIEW_FILTER') && !item.isShorts) {
                    const th = this.config.get('LOW_VIEW_THRESHOLD');
                    const grace = this.config.get('GRACE_PERIOD_HOURS') * 60;

                    // 直播觀看數過濾 (不受豁免期限制)
                    if (item.isLive && item.liveViewers !== null && item.liveViewers < th) {
                        return this._hide(element, 'low_viewer_live');
                    }

                    // 一般影片觀看數過濾 (受豁免期限制)
                    if (!item.isLive && item.viewCount !== null && item.timeAgo !== null && item.timeAgo > grace && item.viewCount < th) {
                        return this._hide(element, 'low_view');
                    }
                }

                if (this.config.get('ENABLE_DURATION_FILTER') && !item.isShorts && item.duration !== null) {
                    const min = this.config.get('DURATION_MIN');
                    const max = this.config.get('DURATION_MAX');
                    if ((min > 0 && item.duration < min) || (max > 0 && item.duration > max)) return this._hide(element, 'duration_filter');
                }
            }
            element.dataset.ypChecked = 'true';
        }

        _hide(element, reason) {
            element.style.display = 'none';
            element.dataset.ypHidden = reason;
            FilterStats.record(reason);  // 記錄統計
            Logger.info(`Hidden [${reason}]`, element);
        }

        reset() {
            document.querySelectorAll('[data-yp-hidden]').forEach(el => {
                el.style.display = '';
                delete el.dataset.ypHidden;
                delete el.dataset.ypChecked;
            });
            FilterStats.reset();  // 重設統計
        }
    }

    // --- 8. Module: Interaction Enhancer (使用集中選擇器) ---
    class InteractionEnhancer {
        constructor(config) {
            this.config = config;
        }

        findPrimaryLink(container) {
            if (!container) return null;
            for (const sel of SELECTORS.LINK_CANDIDATES) {
                const a = container.querySelector(sel);
                if (a?.href) return a;
            }
            return container.querySelector('a[href*="/watch?"], a[href*="/shorts/"], a[href*="/playlist?"]');
        }

        init() {
            document.addEventListener('click', (e) => {
                if (!this.config.get('OPEN_IN_NEW_TAB')) return;
                if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

                // 使用集中管理的排除清單
                if (e.target.closest(SELECTORS.INTERACTION_EXCLUDE)) return;

                let targetLink = null;
                const previewPlayer = e.target.closest(SELECTORS.PREVIEW_PLAYER);

                if (previewPlayer) {
                    targetLink = this.findPrimaryLink(previewPlayer) || this.findPrimaryLink(previewPlayer.closest(SELECTORS.CLICKABLE.join(',')));
                } else {
                    const container = e.target.closest(SELECTORS.CLICKABLE.join(', '));
                    if (!container) return;

                    // 頻道連結處理
                    const channelLink = e.target.closest('a#avatar-link, .ytd-channel-name a, a[href^="/@"], a[href^="/channel/"]');
                    targetLink = channelLink?.href ? channelLink : this.findPrimaryLink(container);
                }

                if (!targetLink) return;

                try {
                    const hostname = new URL(targetLink.href, location.origin).hostname;
                    const isValidTarget = targetLink.href && /(^|\.)youtube\.com$/.test(hostname);
                    if (isValidTarget) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        window.open(targetLink.href, '_blank');
                    }
                } catch (err) { }
            }, { capture: true });
        }
    }

    // --- 9. Module: UI Manager (Enhanced with i18n) ---
    class UIManager {
        constructor(config, onRefresh) { this.config = config; this.onRefresh = onRefresh; }

        t(key, ...args) { return I18N.t(key, ...args); }

        showMainMenu() {
            const i = (k) => this.config.get(k) ? '✅' : '❌';
            const statsInfo = FilterStats.session.total > 0 ? ` (${FilterStats.session.total})` : '';
            const langName = I18N.availableLanguages[I18N.lang];
            const choice = prompt(
                `【 ${this.t('title')} v1.6.0 】\n\n` +
                `1. ${this.t('menu_rules')}\n` +
                `2. ${i('ENABLE_LOW_VIEW_FILTER')} ${this.t('menu_low_view')}\n` +
                `3. ${this.t('menu_threshold')} (${this.config.get('LOW_VIEW_THRESHOLD')})\n` +
                `4. ${this.t('menu_advanced')}\n` +
                `5. ${i('OPEN_IN_NEW_TAB')} ${this.t('menu_new_tab')}\n` +
                `6. ${i('DEBUG_MODE')} ${this.t('menu_debug')}\n` +
                `7. ${this.t('menu_reset')}\n` +
                `8. ${this.t('menu_stats')}${statsInfo}\n` +
                `9. ${this.t('menu_export')}\n` +
                `10. ${this.t('menu_lang')} [${langName}]\n\n` +
                this.t('menu_input')
            );
            if (choice) this.handleMenu(choice);
        }
        handleMenu(c) {
            switch (c.trim()) {
                case '1': this.showRuleMenu(); break;
                case '2': this.toggle('ENABLE_LOW_VIEW_FILTER'); break;
                case '3': const v = prompt(this.t('threshold_prompt')); if (v) this.update('LOW_VIEW_THRESHOLD', Number(v)); break;
                case '4': this.showAdvancedMenu(); break;
                case '5': this.toggle('OPEN_IN_NEW_TAB'); break;
                case '6': this.toggle('DEBUG_MODE'); break;
                case '7': if (confirm(this.t('reset_confirm'))) { Object.keys(this.config.defaults).forEach(k => this.config.set(k, this.config.defaults[k])); this.update('', null); } break;
                case '8': this.showStats(); break;
                case '9': this.showExportImportMenu(); break;
                case '10': this.showLanguageMenu(); break;
            }
        }
        showStats() {
            const summary = FilterStats.getSummary();
            alert(`${this.t('stats_title')}\n\n${summary || this.t('stats_empty')}`);
            this.showMainMenu();
        }
        showLanguageMenu() {
            const langs = I18N.availableLanguages;
            const keys = Object.keys(langs);
            const current = I18N.lang;
            const menu = keys.map((k, i) => `${i + 1}. ${k === current ? '✅' : '⬜'} ${langs[k]}`).join('\n');
            const c = prompt(`${this.t('lang_title')}\n\n${menu}\n\n0. ${this.t('back')}`);
            if (c && c !== '0') {
                const idx = parseInt(c) - 1;
                if (keys[idx]) {
                    I18N.lang = keys[idx];
                    alert(`✅ ${langs[keys[idx]]}`);
                }
            }
            this.showMainMenu();
        }
        showExportImportMenu() {
            const c = prompt(`${this.t('export_title')}\n\n1. ${this.t('export_export')}\n2. ${this.t('export_import')}\n0. ${this.t('back')}`);
            if (c === '1') this.exportSettings();
            else if (c === '2') this.importSettings();
            else if (c === '0') this.showMainMenu();
        }
        exportSettings() {
            const exportData = {
                version: '1.6.0',
                timestamp: new Date().toISOString(),
                settings: this.config.state,
                language: I18N.lang
            };
            const json = JSON.stringify(exportData, null, 2);

            navigator.clipboard.writeText(json).then(() => {
                alert(this.t('export_success'));
            }).catch(() => {
                prompt(this.t('export_copy'), json);
            });
            this.showExportImportMenu();
        }
        importSettings() {
            const json = prompt(this.t('import_prompt'));
            if (!json) { this.showExportImportMenu(); return; }

            try {
                const data = JSON.parse(json);
                if (!data.settings) throw new Error('Invalid format');

                for (const key in data.settings) {
                    if (key in this.config.defaults) {
                        this.config.set(key, data.settings[key]);
                    }
                }
                if (data.language) I18N.lang = data.language;
                alert(this.t('import_success'));
                this.onRefresh();
            } catch (e) {
                alert(this.t('import_fail') + e.message);
            }
            this.showExportImportMenu();
        }
        showRuleMenu() {
            const r = this.config.get('RULE_ENABLES'); const k = Object.keys(r);
            const c = prompt(`${this.t('rules_title')} ${this.t('rules_back')}\n` + k.map((key, i) => `${i + 1}. [${r[key] ? '✅' : '❌'}] ${I18N.getRuleName(key)}`).join('\n'));
            if (c && c !== '0') { this.config.toggleRule(k[parseInt(c) - 1]); this.onRefresh(); this.showRuleMenu(); } else if (c === '0') this.showMainMenu();
        }
        showAdvancedMenu() {
            const i = (k) => this.config.get(k) ? '✅' : '❌';
            const c = prompt(
                `1. ${i('ENABLE_KEYWORD_FILTER')} ${this.t('adv_keyword_filter')}\n` +
                `2. ${this.t('adv_keyword_list')}\n` +
                `3. ${i('ENABLE_CHANNEL_FILTER')} ${this.t('adv_channel_filter')}\n` +
                `4. ${this.t('adv_channel_list')}\n` +
                `5. ${i('ENABLE_DURATION_FILTER')} ${this.t('adv_duration_filter')}\n` +
                `6. ${this.t('adv_duration_set')}\n` +
                `0. ${this.t('back')}`
            );
            if (c === '1' || c === '3' || c === '5') this.toggle(c === '1' ? 'ENABLE_KEYWORD_FILTER' : c === '3' ? 'ENABLE_CHANNEL_FILTER' : 'ENABLE_DURATION_FILTER', true);
            else if (c === '2') this.manage('KEYWORD_BLACKLIST', this.t('adv_keyword_filter'));
            else if (c === '4') this.manage('CHANNEL_BLACKLIST', this.t('adv_channel_filter'));
            else if (c === '6') {
                const min = prompt(this.t('adv_min')); const max = prompt(this.t('adv_max'));
                if (min) this.config.set('DURATION_MIN', min * 60);
                if (max) this.config.set('DURATION_MAX', max * 60);
                this.onRefresh(); this.showAdvancedMenu();
            } else if (c === '0') this.showMainMenu();
        }
        manage(k, n) {
            const l = this.config.get(k);
            const c = prompt(`[${l.join(', ')}]\n1.${this.t('adv_add')} 2.${this.t('adv_remove')} 3.${this.t('adv_clear')} 0.${this.t('back')}`);
            if (c === '1') { const v = prompt(`${this.t('adv_add')}:`); if (v) this.config.set(k, [...l, ...v.split(',')]); }
            if (c === '2') { const v = prompt(`${this.t('adv_remove')}:`); if (v) this.config.set(k, l.filter(i => i !== v)); }
            if (c === '3') this.config.set(k, []);
            this.onRefresh(); this.showAdvancedMenu();
        }
        toggle(k, adv) { this.config.set(k, !this.config.get(k)); this.onRefresh(); adv ? this.showAdvancedMenu() : this.showMainMenu(); }
        update(k, v) { if (k) this.config.set(k, v); this.onRefresh(); this.showMainMenu(); }
    }

    // --- 10. App Entry ---
    class App {
        constructor() {
            this.config = new ConfigManager();
            this.styleManager = new StyleManager(this.config);
            this.adGuard = new AdBlockGuard();
            this.filter = new VideoFilter(this.config);
            this.enhancer = new InteractionEnhancer(this.config);
            this.ui = new UIManager(this.config, () => this.refresh());
        }

        // **ANTI-ADBLOCK PATCH**: 透過 YouTube 自身的配置對象來阻止偵測
        patchYouTubeConfig() {
            try {
                const config = window.yt?.config_ || window.ytcfg?.data_;
                if (config?.openPopupConfig?.supportedPopups?.adBlockMessageViewModel) {
                    config.openPopupConfig.supportedPopups.adBlockMessageViewModel = false;
                }
                if (config?.EXPERIMENT_FLAGS) {
                    config.EXPERIMENT_FLAGS.ad_blocker_notifications_disabled = true;
                    config.EXPERIMENT_FLAGS.web_enable_adblock_detection_block_playback = false;
                }
            } catch (e) {
                // 忽略錯誤
            }
        }

        init() {
            Logger.enabled = this.config.get('DEBUG_MODE');

            // 先嘗試 patch YouTube 配置
            this.patchYouTubeConfig();

            this.styleManager.apply();
            this.adGuard.start();
            this.enhancer.init();
            GM_registerMenuCommand('⚙️ 淨化大師設定', () => this.ui.showMainMenu());

            const obs = new MutationObserver(Utils.debounce(() => this.filter.processPage(), 100));
            obs.observe(document.body, { childList: true, subtree: true });

            window.addEventListener('yt-navigate-finish', () => {
                this.patchYouTubeConfig(); // 每次導航後重新 patch
                this.filter.processPage();
                this.adGuard.checkAndClean();
            });

            this.filter.processPage();
            Logger.info(`🚀 YouTube 淨化大師 v1.6.0 啟動`);
        }

        refresh() {
            Logger.enabled = this.config.get('DEBUG_MODE');
            this.filter.reset();
            this.styleManager.apply();
            this.filter.processPage();
        }
    }

    // 防止腳本重複初始化
    if (window.ytPurifierInitialized) return;
    window.ytPurifierInitialized = true;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => new App().init());
    else new App().init();

})();
