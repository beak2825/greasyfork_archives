// ==UserScript==
// @name         Facebook Login Wall Remover
// @name:en      Facebook Login Wall Remover
// @name:zh-TW   Facebook 登入牆移除器
// @name:ja      Facebook ログインウォールリムーバー
// @version      0.8.3
// @description  This script improves the guest browsing experience on the Facebook desktop site. It aims to remove common interruptions and add helpful features for users who are not logged in.
// @description:en This script improves the guest browsing experience on the Facebook desktop site. It aims to remove common interruptions and add helpful features for users who are not logged in.
// @description:zh-TW 這個腳本的用途是改善在 Facebook 桌面版網站上未登入狀態的瀏覽體驗。它會移除一些常見的干擾，並加入一些方便的功能。
// @description:ja このスクリプトは、Facebookデスクトップサイトでのゲスト（未ログイン）ブラウジング体験を向上させることを目的としています。一般的な中断要素を削除し、ログインしていないユーザー向けの便利な機能を追加します。
// @author       StonedKhajiit
// @match        *://*.facebook.com/*
// @exclude      *://m.facebook.com/*
// @exclude      *://mobile.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        window.close
// @noframes
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/en/users/1467948-stonedkhajiit
// @downloadURL https://update.greasyfork.org/scripts/548145/Facebook%20Login%20Wall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/548145/Facebook%20Login%20Wall%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const app = {
        // --- APPLICATION CONFIGURATION ---
        config: {
            LOG_PREFIX: `[FB Login Wall Remover]`,
            THROTTLE_DELAY: 250,
            PROCESSED_MARKER: 'gmProcessed',
            WORKER_PARAM: 'fpc_worker_task',
            TRACKING_PARAMS: [
                'fb_content_id', 'encrypted_payload', 'channel_type',
                'fbclid', 'ref', 'ref_id', 'h', '__cft__', '__tn__', '__eep__',
                'igsh', 'xmt',
                'si', 'feature',
                'gclid', 'gclsrc', 'dclid', '_ga', '_gl',
                'srsltid', 'gbraid', 'wbraid',
                's', 't', 'ref_src', 'twclid',
                'share_id', 'ref_campaign', 'ref_source',
                'ref_', 'pf_rd_r', 'pf_rd_p', 'pf_rd_m',
                'mkcid', 'mkrid', '_trkparms', 'ssuid',
                'shpxid',
                'ldtag_cl',
                'smtt', 'is_from_login', 'stm_source', 'stm_medium',
                'yj_r', '_ly_c', '_ly_r',
                'scid',
                'tt_from', 'tt_medium', 'tt_content', '_r', '_t',
                'li_fat_id', 'trk',
                'epik', 'pp',
                'sc_cid', 'snap_campaign_id',
                'mc_cid', 'mc_eid', 'mkt_tok',
                '_hsenc', '_hsmi',
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
                'cjevent', 'msclkid'
            ],
            SCROLL_RESTORER_CONFIG: {
                CORRECTION_DURATION: 250,
                CORRECTION_FREQUENCY: 16,
                WATCHER_FREQUENCY: 150,
                MODAL_GRACE_PERIOD: 300,
            },
            AUTO_LOADER: {
                POLL_INTERVAL: 300,
                MAX_WAIT_TIME: 3500,
                MIN_COOLDOWN: 1000,
                MAX_RETRIES: 3,
            },
            ERROR_RECOVERY: {
                RELOAD_BUTTON_LABELS: [
                    "Reload Page", "重新載入頁面", "ページを更新",
                    "Volver a cargar página", "Ricarica la pagina", "Seite neu laden",
                    "Actualiser la Page", "Обновить страницу", "Sayfayı Yenile",
                    "페이지 새로 고침", "Tải lại trang"
                ],
                MAX_RETRIES: 2,
                STORAGE_KEY: 'fblwr_retry_state',
            },
            ADS_LIB: {
                KEY_TARGET_ID: 'fblwr_ads_target_id',
                KEY_INT_ACTION: 'fblwr_int_action',
                INITIAL_DELAY: 300,
                POLL_INTERVAL: 250,
                MAX_ATTEMPTS: 20,
            },
            TRANSPARENCY: {
                SEE_ALL_BUTTONS: [
                    'See all transparency information',
                    '查看所有透明度資訊',
                    '透明性に関する情報をすべて見る'
                ]
            },
            TEXT_EXPANDER: {
                TARGETS: [
                    "See more",
                    "查看更多",
                    "さらに表示",
                    "See More", "閱讀更多", "もっと見る"
                ],
                SCOPE_SELECTOR: 'div[role="article"]',
                BUTTON_SELECTOR: 'div[role="button"]',
                PROCESSED_ATTR: 'data-gm-expanded',
            },
            TIMELINE: {
                WIDTH_COLLAPSED: '24px',
                WIDTH_MAX_LIMIT: '260px',
                DOT_SIZE: '8px',
                ROW_HEIGHT: '20px',
            },
            LOGIN_STATE_MARKERS: {
                LOGGED_OUT: [
                    { selector: 'form#login_form', reason: 'Primary login form element' },
                    { selector: 'input[name="pass"]', reason: 'Password input field' },
                    { selector: 'a[href*="/recover/initiate"]', reason: 'Forgot Account link' },
                    { selector: 'a[href*="/login/"]', reason: 'Login link' }
                ],
                LOGGED_IN: [
                    { selector: 'input[type="search"]', reason: 'Search input field' },
                    { selector: 'a[href="/friends/"]', reason: 'Friends tab' }
                ]
            },
            SELECTORS: {
                GLOBAL: {
                    POST_CONTAINER: 'div[role="article"]',
                    MODAL_CONTAINER: 'div.__fb-light-mode',
                    DIALOG: '[role="dialog"]',
                    LOGIN_FORM: 'form#login_form, form[id="login_popup_cta_form"]',
                    MEDIA_LINK: `a[href*="/photo"], a[href*="fbid="], a[href*="/videos/"], a[href*="/watch/"], a[href*="/reel/"]`,
                    VIDEO_PAGE_TOOLBAR_ROOT: 'div[role="banner"], .xzkaem6',
                    CLOSE_BUTTON: [
                        "Close", "關閉", "閉じる", "Cerrar", "Fermer", "Schließen", "Fechar", "Chiudi", "Sluiten", "Закрыть", "Kapat", "Zamknij",
                        "Tutup", "Đóng", "ปิด", "Zatvori", "Zavrieť", "Zavřít", "Bezárás", "Stäng", "Luk", "Lukk", "Sulje", "Κλείσιμο",
                        "Închide", "إغلاق", "סגור"
                    ].map(label => `[aria-label="${label}"][role="button"]`).join(', ') + ', div[role="button"]:has(i[data-visualcompletion="css-img"])',
                },
                NAVIGATOR: {
                    HIGHLIGHT_CLASS: 'gm-post-highlight',
                    TIMELINE_LINK_CANDIDATES: 'a[role="link"]',
                },
                POST_TOOLS: {
                    BUTTON_CLASS: 'gm-tool-button',
                    PROCESSED_MARKER: 'gmToolsProcessed',
                    FEED_POST_HEADER: 'div[data-ad-rendering-role="profile_name"] h2, div[data-ad-rendering-role="profile_name"] h3',
                    DIALOG_POST_HEADER: 'h2, h3',
                    CONTENT_BODY: 'div[data-ad-rendering-role="story_message"]',
                    EXPAND_BTN: 'div[role="button"]',
                    TEXT_BLOCKS: 'div[dir="auto"]'
                }
            },

            CONSTANTS: {
                SPRITES: {
                    COMMENT: -1037,
                    SHARE: -1054,
                    SHARE_ALT: -1071,
                    TOLERANCE: 5
                },
                REGEX_PARTS: {
                    UNIT_GROUP: '[KkMm萬億万\\u842c\\u5104\\u4e07]'
                },
                MEDIA_CONTROL_LABELS: [
                    "放大", "縮小", "進入全螢幕模式", "上一張", "下一張", "關閉", "閉じる",
                    "Zoom", "Fullscreen", "Previous", "Next", "Close",
                    "拡大", "縮小", "全画面表示", "前へ", "次へ"
                ],
                OBSERVER: {
                    ROOT_MARGIN: '-45% 0px -45% 0px',
                    THRESHOLD: 0.01
                },
                FOLLOW_BUTTON_LABELS: ["Follow", "追蹤", "关注", "フォローする", "팔로우", "Seguir"]
            },
            TIMEOUTS: {
                THROTTLE_DEFAULT: 250,
                THROTTLE_SCROLL: 100,
                THROTTLE_UI: 200, // For visibility updates
                DEBOUNCE_SEARCH: 400,
                INITIAL_DELAY: 50,
                RETRY_INTERVAL: 200,
                MAX_RETRY_DURATION: 3000,
                SCROLL_LOCK: 800
            },
            UI: {
                Z_INDEX: {
                    FLOATING_NAV: 9990,
                    TRANSPARENCY: 9990,
                    TIMELINE: 9995,
                    TOOLBAR: 9998,
                    HOVER_TRIGGER: 9999,
                    HOVER_HINT: 10000,
                    TOAST: 99999,
                    MODAL_BACKDROP: 99998,
                    MODAL_FOREGROUND: 99999,
                    ID_BADGE: 99999
                },
                DIMENSIONS: {
                    BADGE_MIN_WIDTH: '280px',
                    BADGE_MAX_WIDTH: '320px',
                    FLOATING_NAV_BOTTOM: '20px',
                    FLOATING_NAV_RIGHT: '50px'
                },
                HEATMAP_THRESHOLDS: [0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.20, 0.10],
                HEATMAP_WEIGHTS: {
                    REACTION: 1,
                    COMMENT: 2,
                    SHARE: 3
                }
            },
            SETTINGS_DEFAULTS: {
                AUTO_OPEN_MEDIA: true,
                HIDE_USELESS: true,
                HIDE_STATS: false,
                SHOW_DEADLOCK: true,
                ERROR_RECOVERY: true,
                TRANSPARENCY_BTNS: true,
                ID_REVEALER: true,
                ID_LINK_FORMAT: 'userid',
                AUTO_UNMUTE: true,
                UNMUTE_VOLUME: 25,
                POST_NUMBERING: true,
                EXPAND_CONTENT: true,
                KEY_NAV: true,
                KEY_NEXT_PRI: 'j',
                KEY_PREV_PRI: 'k',
                KEY_NEXT_SEC: 'ArrowRight',
                KEY_PREV_SEC: 'ArrowLeft',
                FLOATING_NAV: true,
                SHOW_AUTO_LOAD: true,
                SHOW_BATCH_COPY: true,
                FLOATING_OPACITY: true,
                BATCH_SIZE: 20,
                TIMELINE_NAV: true,
                NAV_HIGHLIGHTER: true,
                HEATMAP_BORDER: true,
                TIMELINE_HEATMAP: true,
                WHEEL_NAV: true,
                WHEEL_MODIFIER: 'shiftKey',
                WHEEL_MODIFIER: 'shiftKey',
                SCROLL_ALIGNMENT: 'top',
                RESTORE_ALIGNMENT: 'bottom',
                SMOOTH_SCROLL: true,
                NAV_INTERVAL: 500,
                PERMALINK_COPIER: true,
                COPY_CONTENT_BTN: true,
                SMART_LINK: true,
                INCLUDE_EMOJIS: true,
                BATCH_HEADER: true,
                EXPAND_HASHTAGS: false,
                EXPAND_MENTIONS: true,
                META_MASTER: true,
                META_URL: true,
                META_ORDER: true,
                META_AUTHOR: true,
                META_AUTHOR_LINK: true,
                META_DATE: true,
                META_PREVIEW: true,
                META_IMG_COUNT: true,
                META_VID_DURATION: true,
                META_STATS: true,
                META_STATS_TOTAL: true,
                META_STATS_DETAILED: true,
                PERMALINK_FORMAT: 'author_id',
                BATCH_EXPORT_FORMAT: 'json',
                BATCH_COPY_MODE: 'file'
            },
            STRINGS: {
                en: {
                    // --- General ---
                    setting_batchCopyMode: 'Batch Copy Output Mode',
                    batchCopyMode_file: 'Download as File',
                    batchCopyMode_clipboard: 'Copy to Clipboard',
                    batchCopyMode_locked_csv: 'CSV format requires Download mode.',
                    batchCopy_file_success: 'Exported to file successfully.',

                    notificationDeadlock: 'A login prompt was hidden, but the feed can no longer load new content.\n[Tip] To prevent this, open links in a new tab (Middle-Click). Please reload to continue.',
                    notificationSettingsReload: 'Some settings updated. Please reload.',
                    resetSettings: 'Reset Settings',
                    resetSettingsConfirm: 'Reset all settings to default?',
                    notificationSettingsReset: 'Settings reset.',
                    menuResetSettings: '🚨 Reset All Settings',
                    autoOpenMediaInNewTab: 'Auto-open media in new tab',
                    showDeadlockNotification: 'Show deadlock notification',
                    hideUselessElements: 'Hide useless UI elements',
                    hidePostStats: 'Hide post stats (Likes, Comments)',
                    autoUnmuteEnabled: 'Auto unmute videos',
                    setVolumeLabel: 'Auto-unmute volume',
                    postNumberingEnabled: 'Display post numbers',
                    expandContentEnabled: 'Auto-expand content',
                    errorRecoveryEnabled: 'Auto-reload on error',
                    transparencyButtonsEnabled: 'Show Page Transparency shortcuts',

                    // --- ID Revealer ---
                    idRevealerEnabled: 'Enable ID Revealer (Click Title)',
                    idRevealerTooltip: 'Click to reveal ID & Info',
                    idRevealerLinkFormat: 'ID Link Format',
                    idFormatUserID: 'User ID URL (facebook.com/id)',
                    idFormatClassic: 'Classic Profile URL (profile.php?id=)',
                    idFormatUsername: 'Username URL (Current URL)',
                    id_copy_all: 'Copy All Info',
                    id_label_user: 'User ID',
                    id_label_page: 'Page ID',
                    id_label_meta: 'Profile ID',
                    profile_name_label: 'Name',
                    profile_url_label: 'Profile URL',
                    copy_success_generic: '{label} Copied',
                    all_copied: 'All Info Copied',

                    // --- Search Bar ---
                    searchPlaceholder: 'Search...',
                    searchButton: 'Search',
                    searchGroupContextual: 'Search Current Page',
                    searchGroupGlobal: 'Search All of Facebook',
                    searchScopePosts: 'Posts',
                    searchScopePhotos: 'Photos',
                    searchScopeVideos: 'Videos',
                    searchScopeReels: 'Reels',
                    searchScopePages: 'Pages',
                    searchScopePeople: 'People',
                    searchScopeGroups: 'Groups',
                    searchScopeGlobalVideos: 'Videos',
                    searchScopeGlobalPosts: 'Posts',
                    searchScopeEvents: 'Events',
                    searchScopeMarketplace: 'Marketplace',
                    searchTooltipPosts: 'Search current page posts (or global if on Home)',
                    searchTooltipPhotos: 'Search photos on this page',
                    searchTooltipVideos: 'Search videos on this page',
                    searchTooltipReels: 'Search Reels using "Page Name" + "Keyword"',
                    searchTooltipPages: 'Search for Pages, Public Figures, or Organizations',
                    searchTooltipPeople: 'Search for People across Facebook',
                    searchTooltipGroups: 'Search for Groups across Facebook',
                    searchTooltipGlobalPosts: 'Search for Public Posts across Facebook',
                    searchTooltipGlobalVideos: 'Search all videos on Facebook Watch',
                    searchTooltipEvents: 'Search for Events',
                    searchTooltipMarketplace: 'Search Marketplace items',
                    searchAllContextualTooltip: 'Search {scope} on this page via Google',
                    navigateToContextual: 'Go to {scope} section',
                    pinToolbar: 'Pin',
                    unpinToolbar: 'Unpin',
                    shortcutWatch: 'Watch',
                    shortcutEvents: 'Events',
                    shortcutMarketplace: 'Marketplace',

                    // --- Settings Modal ---
                    settingsTitle: 'Settings',
                    saveAndClose: 'Save & Close',
                    menuSettings: '⚙️ Settings',
                    settingsColumnGeneral: 'General',
                    settingsColumnNavigation: 'Navigation',
                    settingsColumnTools: 'Tools & Utilities',
                    keyBinderPress: 'Press any key...',
                    keyBinderNone: '(None)',
                    settingsDetailsMetadata: 'Advanced Metadata Settings',
                    setting_autoLoadEnabled: 'Auto Load Content',

                    // --- Navigation ---
                    keyboardNavEnabled: 'Enable keyboard navigation',
                    navHighlighterEnabled: 'Highlight active post border',
                    heatmapBorderEnabled: 'Apply heat color to border',
                    keyNavNextPrimary: 'Next (J)',
                    keyNavPrevPrimary: 'Prev (K)',
                    keyNavNextSecondary: 'Next (Right)',
                    keyNavPrevSecondary: 'Prev (Left)',
                    floatingNavEnabled: 'Enable floating buttons',
                    floatingNavPrevTooltip: 'Previous Post (Right-Click: First)',
                    floatingNavNextTooltip: 'Next Post (Right-Click: Last)',
                    timelineHeatmapEnabled: 'Show Interaction Heatmap (Color Dots)',
                    timelineNavEnabled: 'Enable Timeline Navigator',
                    scrollRestorerAlignment: 'Scroll Restorer Alignment',
                    navigationScrollAlignment: 'Alignment',
                    scrollAlignmentCenter: 'Center',
                    scrollAlignmentTop: 'Top',
                    scrollAlignmentBottom: 'Bottom',
                    enableSmoothScrolling: 'Smooth Scroll',
                    continuousNavInterval: 'Nav Interval',
                    wheelNavEnabled: 'Wheel Nav',
                    wheelNavModifier: 'Modifier',
                    modifierAlt: 'Alt',
                    modifierCtrl: 'Ctrl',
                    modifierShift: 'Shift',
                    modifierNone: 'None',

                    // --- Tools (Copier & AutoLoad) ---
                    copier_enablePermalink: 'Enable Permalink Icon',
                    copier_enableCopyContent: 'Enable Smart Copy Button',
                    copier_fetchPermalinkSmart: 'Permalink (Smart)',
                    copier_fetchPermalinkDirect: 'Permalink (Direct)',
                    copier_copyContent: 'Copy Post Content',
                    copier_copyContentSuccess: '✅ Content Copied ({count} chars)',
                    copier_copyContentFailed: '❌ Copy Failed',
                    copier_processing: 'Processing...',
                    copier_successPermalink: '✅ Copied',
                    copier_failure: '❌ Failed',
                    copier_notificationPermalinkCopied: 'Permalink copied:\n{url}',
                    copier_notificationErrorGeneric: 'Failed to fetch.',
                    copier_notificationErrorNoSourceUrl: 'No source URL.',
                    copier_notificationErrorTimeout: 'Fetch timed out.',
                    copier_notificationContentNotFound: '❌ Content not found.',
                    copier_menu_useSmartLink: 'Use Smart Link (Async)',
                    copier_menu_permalinkFormat: 'Permalink Format',
                    copier_format_full: 'Full URL',
                    copier_format_username: 'Username+ID',
                    copier_format_author_id: 'AuthorID+ID',
                    copier_format_shortest: 'Shortest',
                    copier_includeEmojis: 'Include emojis',
                    copier_expandHashtags: 'Expand Hashtags to URL',
                    copier_expand_mentions: 'Expand Mentions to URL',

                    autoLoader_batchSize: 'Batch Count',
                    tooltipAutoLoadStart: 'Auto-Load',
                    tooltipAutoLoadStop: 'Stop',
                    tooltipBatchCopy: 'Batch Copy',
                    batchCopy_includeHeader: 'Include Header in Batch Copy',
                    autoLoad_status_loading: 'Loading... ({current}/{target})',
                    autoLoad_status_retrying: 'Retrying...',
                    autoLoad_status_success: 'Done.',
                    autoLoad_status_stopped: 'Stopped.',
                    autoLoad_status_deadlock: 'Deadlock.',
                    autoLoad_mode_incremental: 'Mode: Incremental (+{n})',
                    autoLoad_mode_target: 'Mode: Target Total ({n})',
                    autoLoad_target_reached: 'Target count ({n}) already reached.',
                    autoLoad_tooltip_incremental: 'Auto Load (+{n})\nRight-click: Switch to Target Mode',
                    autoLoad_tooltip_target: 'Auto Load (Target {n})\nRight-click: Switch to Incremental Mode',
                    batchCopy_start: 'Processing {count} posts...',
                    batchCopy_success: 'Copied {count} posts to clipboard! ({chars} chars)',
                    batchCopy_download_success: 'Downloaded {count} posts! ({chars} chars)',
                    batchCopy_empty: 'No posts available to copy.',
                    batchCopy_mode_clipboard: 'Batch Mode: Clipboard Copy',
                    batchCopy_mode_download: 'Batch Mode: Download as File',
                    exportFormat_text: 'Plain Text (.txt)',
                    exportFormat_json: 'JSON (.json)',
                    exportFormat_csv: 'CSV (.csv)',

                    // --- Deadlock & Error Recovery ---
                    floatingNav_showAutoLoad: 'Show Auto-Load',
                    floatingNav_showBatchCopy: 'Show Batch Copy',
                    floatingNav_opacity: 'Semi-Transparent when idle',

                    // --- Copy Metadata ---
                    copy_includeMetadata: 'Include Metadata',
                    copy_meta_url: 'Include Link (Top)',
                    copy_meta_order: 'Include Order [#]',
                    copy_meta_author_name: 'Include Author Name',
                    copy_meta_author_link: 'Include Author Link',
                    copy_meta_date: 'Include Date',
                    copy_meta_stats: 'Include Stats (Master)',
                    copy_meta_stats_total: 'Include Total Count (1.9K)',
                    copy_meta_stats_detailed: 'Include Details (👍❤️)',
                    copy_meta_link_preview: 'Include Link Preview',
                    copy_meta_image_count: 'Include Image Count',
                    image_count_label: 'Images',
                    copy_meta_video_duration: 'Include Video/Reel Duration',
                    label_reel: 'Reel',
                    label_video: 'Video',
                    stats_label_like: 'Like',
                    stats_label_comment: 'Comment',
                    stats_label_share: 'Share',
                    stats_label_reaction: 'Reactions',
                    preview_label_title: 'Title',
                    preview_label_source: 'Source',
                    preview_label_desc: 'Desc',
                    preview_label_link: 'Link',

                    // --- Other Tooltips ---
                    tooltipAds: 'Ads Library',
                    tooltipTransparency: 'Transparency',
                    notificationReelSearchError: 'Page name not found',
                },
                'zh-TW': {
                    // --- General ---
                    setting_batchCopyMode: '批次複製輸出模式',
                    batchCopyMode_file: '下載為檔案',
                    batchCopyMode_clipboard: '複製到剪貼簿',
                    batchCopyMode_locked_csv: 'CSV 格式僅支援下載模式。',
                    batchCopy_file_success: '已成功匯出檔案。',

                    notificationDeadlock: '登入提示已被隱藏，但動態無法再載入新內容。\n[提示] 為防止此情況，請在新分頁中開啟連結 (中鍵點擊)。請重新整理以繼續。',
                    notificationSettingsReload: '部分設定已更新，請重新整理頁面以完全生效。',
                    resetSettings: '重設設定',
                    resetSettingsConfirm: '您確定要將所有設定重設為預設值嗎？此操作無法復原。',
                    notificationSettingsReset: '設定已重設為預設值，部分變更可能需要重新整理頁面才能生效。',
                    menuResetSettings: '🚨 重設所有設定',
                    autoOpenMediaInNewTab: '自動在新分頁開啟媒體 (防鎖定)',
                    showDeadlockNotification: '顯示頁面鎖定通知',
                    hideUselessElements: '隱藏對訪客無用的介面元素',
                    hidePostStats: '隱藏貼文統計數據 (讚數、留言數)',
                    autoUnmuteEnabled: '自動取消影片靜音',
                    setVolumeLabel: '自動音量大小',
                    postNumberingEnabled: '在動態消息上顯示貼文順序',
                    expandContentEnabled: '自動展開貼文內容 (查看更多)',
                    errorRecoveryEnabled: '錯誤頁面自動恢復 (按鈕偵測)',
                    transparencyButtonsEnabled: '顯示粉絲專頁資訊透明度捷徑按鈕 (左下角)',

                    // --- ID Revealer ---
                    idRevealerEnabled: '啟用 ID 顯示器 (點擊標題)',
                    idRevealerTooltip: '點擊以顯示 Profile ID 與資訊',
                    idRevealerLinkFormat: 'ID 連結格式',
                    idFormatUserID: 'User ID 格式 (facebook.com/id)',
                    idFormatClassic: '經典格式 (profile.php?id=)',
                    idFormatUsername: '使用者名稱 (當前網址)',
                    id_copy_all: '複製全部資訊',
                    id_label_user: 'User ID',
                    id_label_page: 'Page ID',
                    id_label_meta: 'Profile ID',
                    profile_name_label: '專頁名稱',
                    profile_url_label: 'Profile URL',
                    copy_success_generic: '已複製 {label}',
                    all_copied: '全部資訊已複製',

                    // --- 搜尋工具列 ---
                    searchPlaceholder: '搜尋...',
                    searchButton: '搜尋',
                    searchGroupContextual: '搜尋當前頁面',
                    searchGroupGlobal: '搜尋整個 Facebook',
                    searchScopePosts: '貼文',
                    searchScopePhotos: '相片',
                    searchScopeVideos: '影片',
                    searchScopeReels: '連續短片',
                    searchScopePages: '專頁',
                    searchScopePeople: '人物',
                    searchScopeGroups: '社團',
                    searchScopeGlobalVideos: '影片',
                    searchScopeGlobalPosts: '貼文',
                    searchScopeEvents: '活動',
                    searchScopeMarketplace: '市集',
                    searchTooltipPosts: '搜尋目前頁面的貼文 (若在首頁則搜尋整個 Facebook)。',
                    searchTooltipPhotos: '搜尋目前頁面的相片。',
                    searchTooltipVideos: '搜尋目前頁面的影片。',
                    searchTooltipReels: '使用「專頁名稱」+「關鍵字」來搜尋整個 Facebook 的連續短片。',
                    searchTooltipPages: '在整個 Facebook 中搜尋粉絲專頁、公眾人物或組織。',
                    searchTooltipPeople: '在整個 Facebook 中搜尋個人檔案。',
                    searchTooltipGroups: '在整個 Facebook 中搜尋社團。',
                    searchTooltipGlobalPosts: '在整個 Facebook 中搜尋公開貼文。',
                    searchTooltipGlobalVideos: '使用 Facebook Watch 內建功能搜尋所有影片。',
                    searchTooltipEvents: '使用 Facebook 內建功能搜尋所有活動。',
                    searchTooltipMarketplace: '使用 Facebook Marketplace 內建功能搜尋所有商品。',
                    searchAllContextualTooltip: '使用 Google 搜尋此頁面的所有 {scope}',
                    navigateToContextual: '前往 {scope} 區塊',
                    pinToolbar: '釘選工具列',
                    unpinToolbar: '取消釘選工具列',
                    shortcutWatch: '前往 Watch 影片',
                    shortcutEvents: '前往 活動',
                    shortcutMarketplace: '前往 Marketplace 市集',

                    // --- 設定視窗 ---
                    settingsTitle: '設定',
                    saveAndClose: '儲存並關閉',
                    menuSettings: '⚙️ 設定',
                    settingsColumnGeneral: '一般設定',
                    settingsColumnNavigation: '導覽設定',
                    settingsColumnTools: '工具與其他設定',
                    keyBinderPress: '請按任意鍵...',
                    keyBinderNone: '(無)',
                    settingsDetailsMetadata: '進階中繼資料設定',
                    setting_autoLoadEnabled: '自動載入內容',

                    // --- 導覽功能 ---
                    keyboardNavEnabled: '啟用鍵盤導覽 (J/K)',
                    navHighlighterEnabled: '高亮顯示當前貼文邊框',
                    heatmapBorderEnabled: '使用互動熱度顏色標示貼文邊框',
                    keyNavNextPrimary: '下一篇 (J)',
                    keyNavPrevPrimary: '上一篇 (主要按鍵)',
                    keyNavNextSecondary: '下一篇 (次要按鍵)',
                    keyNavPrevSecondary: '上一篇 (次要按鍵)',
                    floatingNavEnabled: '啟用浮動導覽按鈕',
                    floatingNavPrevTooltip: '上一篇貼文 (右鍵：第一篇)',
                    floatingNavNextTooltip: '下一篇貼文 (右鍵：最後一篇)',
                    timelineHeatmapEnabled: '顯示互動熱點圖 (彩色圓點)',
                    timelineNavEnabled: '啟用時間軸導覽 (右側捷徑)',
                    scrollRestorerAlignment: '瀏覽位置復原對齊',
                    navigationScrollAlignment: '導覽滾動對齊',
                    scrollAlignmentCenter: '置中',
                    scrollAlignmentTop: '貼齊頂部',
                    enableSmoothScrolling: '啟用平滑捲動',
                    continuousNavInterval: '連續導覽間隔時間',
                    wheelNavEnabled: '啟用滑鼠滾輪導覽',
                    wheelNavModifier: '滾輪導覽修飾鍵',
                    modifierAlt: 'Alt',
                    modifierCtrl: 'Ctrl',
                    modifierShift: 'Shift',
                    modifierNone: '無 (取代頁面捲動)',

                    // --- 複製與載入工具 ---
                    copier_enablePermalink: '啟用 永久連結按鈕 (僅圖示)',
                    copier_enableCopyContent: '啟用 複製內容按鈕 (智慧)',
                    copier_fetchPermalinkSmart: '永久連結 (智慧)',
                    copier_fetchPermalinkDirect: '永久連結 (直接)',
                    copier_copyContent: '複製貼文內容',
                    copier_copyContentSuccess: '✅ 內容已複製 ({count} 字)',
                    copier_copyContentFailed: '❌ 複製失敗',
                    copier_processing: '處理中...',
                    copier_successPermalink: '✅ 已複製',
                    copier_failure: '❌ 失敗',
                    copier_notificationPermalinkCopied: '永久連結已複製：\n{url}',
                    copier_notificationErrorGeneric: '獲取永久連結失敗。',
                    copier_notificationErrorNoSourceUrl: '失敗：找不到來源網址。',
                    copier_notificationErrorTimeout: '失敗：背景處理逾時。',
                    copier_notificationContentNotFound: '❌ 找不到內容區塊。',
                    copier_menu_useSmartLink: '複製內容時使用智慧連結 (需等待)',
                    copier_menu_permalinkFormat: '永久連結格式',
                    copier_format_full: '完整網址 (含 Slug)',
                    copier_format_username: '使用者名稱 + 貼文 ID',
                    copier_format_author_id: '作者 ID + 貼文 ID (最可靠)',
                    copier_format_shortest: '最短連結 (fb.com, 相容性較差)',
                    copier_includeEmojis: '複製內容包含表情符號',
                    copier_expandHashtags: '將 Hashtag 展開為網址',
                    copier_expand_mentions: '將提及對象展開為網址',

                    autoLoader_batchSize: '自動載入批次數量',
                    tooltipAutoLoadStart: '自動載入貼文',
                    tooltipAutoLoadStop: '停止載入',
                    tooltipBatchCopy: '批次複製所有已載入貼文 (右鍵切換模式)',
                    batchCopy_includeHeader: '批次複製包含頁首資訊',
                    autoLoad_status_loading: '載入中... ({current}/{target})',
                    autoLoad_status_retrying: '重試中... ({count}/{max})',
                    autoLoad_status_success: '自動載入完成。',
                    autoLoad_status_stopped: '使用者手動停止。',
                    autoLoad_status_deadlock: '偵測到阻擋，載入已停止。',
                    autoLoad_mode_incremental: '模式：遞增載入 (+{n})',
                    autoLoad_mode_target: '模式：目標總數 ({n})',
                    autoLoad_target_reached: '已達到目標數量 ({n})。',
                    autoLoad_tooltip_incremental: '自動載入 (+{n})\n右鍵：切換至目標模式',
                    autoLoad_tooltip_target: '自動載入 (達到 {n})\n右鍵：切換至遞增模式',

                    setting_batchExportFormat: '批次匯出格式',
                    tooltip_batchExportFormat: '選擇批次匯出（自動載入 > 複製）時的檔案格式。',
                    batchCopy_start: '正在處理 {count} 篇貼文...',
                    batchCopy_success: '已複製 {count} 篇貼文到剪貼簿！({chars} 字)',
                    batchCopy_download_success: '已下載 {count} 篇貼文！(共 {chars} 字)',
                    batchCopy_empty: '沒有可複製的貼文。',
                    batchCopy_mode_clipboard: '批次模式：複製到剪貼簿',
                    batchCopy_mode_download: '批次模式：下載為檔案',
                    exportFormat_text: '純文字 (.txt)',
                    exportFormat_json: 'JSON (.json)',
                    exportFormat_csv: 'CSV (.csv)',

                    // --- Deadlock & Error Recovery ---
                    floatingNav_showAutoLoad: '顯示 自動載入按鈕',
                    floatingNav_showBatchCopy: '顯示 批次複製按鈕',
                    floatingNav_opacity: '閒置時半透明 (降低干擾)',

                    // --- 複製中繼資料 ---
                    copy_includeMetadata: '複製內容包含中繼資料',
                    copy_meta_url: '包含貼文連結 (置頂)',
                    copy_meta_order: '包含貼文順序 [#xx]',
                    copy_meta_author_name: '包含發文者名稱',
                    copy_meta_author_link: '包含發文者連結 (個人檔案)',
                    copy_meta_date: '包含發文時間',
                    copy_meta_stats: '包含互動統計',
                    copy_meta_stats_total: '包含總數 (1.9K 心情)',
                    copy_meta_stats_detailed: '包含詳細心情 (👍❤️)',
                    copy_meta_link_preview: '包含連結預覽資訊 (標題/來源/摘要)',
                    copy_meta_image_count: '包含圖片數量統計',
                    image_count_label: '圖片',
                    copy_meta_video_duration: '包含影片/Reels 時長',
                    label_reel: 'Reel',
                    label_video: '影片',
                    stats_label_like: '讚',
                    stats_label_comment: '留言',
                    stats_label_share: '分享',
                    stats_label_reaction: '心情',
                    preview_label_title: '標題',
                    preview_label_source: '來源',
                    preview_label_desc: '摘要',
                    preview_label_link: '連結',

                    // --- 其他提示 ---
                    timelineSortTooltip: '切換排序模式',
                    scrollRestorerAlignment: '瀏覽位置復原對齊',
                    scrollAlignmentBottom: '靠下',
                    tooltipAds: '前往 廣告檔案庫 (關於)',
                    tooltipTransparency: '查看 粉絲專頁資訊透明度',
                    notificationReelSearchError: '無法取得目前頁面名稱以進行連續短片搜尋。',
                },
                ja: {
                    // --- 一般 ---
                    notificationDeadlock: 'ログインプロンプトが非表示になりましたが、フィードは新しいコンテンツを読み込めなくなりました。\n【ヒント】フィードがロックされないように、新しいタブでリンクを開く（中央クリック）習慣を付けてください。閲覧を続けるには、このページをリロードしてください。',
                    notificationSettingsReload: '一部の設定が更新されました。完全に有効にするには、ページをリロードしてください。',
                    resetSettings: '設定をリセット',
                    resetSettingsConfirm: 'すべての設定をデフォルトにリセットしますか？この操作は元に戻せません。',
                    notificationSettingsReset: '設定がデフォルトにリセットされました。一部の変更は、ページをリロードすると有効になります。',
                    menuResetSettings: '🚨 全ての設定をリセット',
                    autoOpenMediaInNewTab: 'メディアを新しいタブで開く (デッドロック防止)',
                    showDeadlockNotification: 'デッドロック通知を表示',
                    hideUselessElements: '不要なUI要素を非表示にする（ゲスト用）',
                    hidePostStats: '投稿の統計データを非表示 (いいね！、コメント数)',
                    autoUnmuteEnabled: '動画のミュートを自動解除',
                    setVolumeLabel: '自動音量',
                    postNumberingEnabled: 'フィードに投稿順序番号を表示する',
                    expandContentEnabled: '投稿の内容を自動的に展開 (さらに表示)',
                    errorRecoveryEnabled: 'エラーページ自動回復 (ボタン検出)',
                    transparencyButtonsEnabled: 'ページの透明性ショートカットを表示 (左下)',

                    // --- ID Revealer ---
                    idRevealerEnabled: 'ID表示機能を有効にする（タイトルをクリック）',
                    idRevealerTooltip: 'クリックしてプロフィールIDと情報を表示',
                    idRevealerLinkFormat: 'IDリンク形式',
                    idFormatUserID: 'User ID形式 (facebook.com/id)',
                    idFormatClassic: 'クラシック (profile.php?id=)',
                    idFormatUsername: 'ユーザー名 (現在のURL)',
                    id_copy_all: 'すべての情報をコピー',
                    id_label_user: 'User ID',
                    id_label_page: 'Page ID',
                    id_label_meta: 'Profile ID',
                    profile_name_label: 'プロフィール名',
                    profile_url_label: 'Profile URL',
                    copy_success_generic: '{label}をコピーしました',
                    all_copied: 'すべての情報をコピーしました',

                    // --- 検索バー ---
                    searchPlaceholder: '検索...',
                    searchButton: '検索',
                    searchGroupContextual: '現在のページを検索',
                    searchGroupGlobal: 'Facebook全体を検索',
                    searchScopePosts: '投稿',
                    searchScopePhotos: '写真',
                    searchScopeVideos: '動画',
                    searchScopeReels: 'リール',
                    searchScopePages: 'ページ',
                    searchScopePeople: '人物',
                    searchScopeGroups: 'グループ',
                    searchScopeGlobalVideos: '動画',
                    searchScopeGlobalPosts: '投稿',
                    searchScopeEvents: 'イベント',
                    searchScopeMarketplace: 'マーケット',
                    searchTooltipPosts: '現在のページの投稿を検索（ホーム画面の場合は全体）',
                    searchTooltipPhotos: '現在のページの写真内を検索',
                    searchTooltipVideos: '現在のページの動画内を検索',
                    searchTooltipReels: '「ページ名」＋「キーワード」でリールを検索',
                    searchTooltipPages: 'Facebook全体でページ・著名人・組織を検索',
                    searchTooltipPeople: 'Facebook全体で人物を検索',
                    searchTooltipGroups: 'Facebook全体でグループを検索',
                    searchTooltipGlobalPosts: 'Facebook全体で公開投稿を検索',
                    searchTooltipGlobalVideos: 'Facebook Watch機能で動画を検索',
                    searchTooltipEvents: 'イベントを検索',
                    searchTooltipMarketplace: 'Marketplaceで商品を検索',
                    searchAllContextualTooltip: 'Googleを使ってこのページの {scope} を検索',
                    navigateToContextual: '{scope} セクションへ移動',
                    pinToolbar: '固定',
                    unpinToolbar: '固定解除',
                    shortcutWatch: 'Watchへ',
                    shortcutEvents: 'イベントへ',
                    shortcutMarketplace: 'マーケットへ',

                    // --- 設定モーダル ---
                    settingsTitle: '設定',
                    saveAndClose: '保存して閉じる',
                    menuSettings: '⚙️ 設定',
                    settingsColumnGeneral: '一般',
                    settingsColumnNavigation: 'ナビ',
                    settingsColumnTools: 'ツールとユーティリティ',
                    keyBinderPress: 'キーを押してください...',
                    keyBinderNone: '(なし)',
                    settingsDetailsMetadata: '高度なメタデータ設定',
                    setting_autoLoadEnabled: 'コンテンツの自動読み込み',
                    setting_batchCopyMode: '一括コピー出力モード',
                    batchCopyMode_file: 'ファイルとしてダウンロード',
                    batchCopyMode_clipboard: 'クリップボードにコピー',
                    batchCopyMode_locked_csv: 'CSV形式はダウンロードモードのみ対応しています。',
                    batchCopy_file_success: 'ファイルへのエクスポートが完了しました。',

                    // --- ナビゲーション ---
                    keyboardNavEnabled: 'キーボードナビゲーションを有効にする',
                    navHighlighterEnabled: 'アクティブな投稿を強調表示 (枠線)',
                    heatmapBorderEnabled: 'ヒートマップカラーを枠線に適用',
                    keyNavNextPrimary: '次の投稿 (J)',
                    keyNavPrevPrimary: '前の投稿 (K)',
                    keyNavNextSecondary: '次の投稿 (→)',
                    keyNavPrevSecondary: '前の投稿 (←)',
                    floatingNavEnabled: 'フローティングボタンを有効にする',
                    floatingNavPrevTooltip: '前の投稿 (右クリック：最初へ)',
                    floatingNavNextTooltip: '次の投稿 (右クリック：最後へ)',
                    timelineHeatmapEnabled: 'インタラクションヒートマップを表示',
                    timelineSortTooltip: 'ソートモードを切り替える',
                    scrollRestorerAlignment: 'スクロール復元位置',
                    scrollAlignmentBottom: '下部',
                    timelineNavEnabled: 'タイムラインナビゲーションを有効にする',
                    navigationScrollAlignment: 'スクロール位置',
                    scrollAlignmentCenter: '中央',
                    scrollAlignmentTop: '上部',
                    enableSmoothScrolling: 'スムーズスクロール',
                    continuousNavInterval: '連続間隔',
                    wheelNavEnabled: 'ホイールナビ',
                    wheelNavModifier: '修飾キー',
                    modifierAlt: 'Alt',
                    modifierCtrl: 'Ctrl',
                    modifierShift: 'Shift',
                    modifierNone: 'なし',

                    // --- ツール (コピー & 自動読み込み) ---
                    copier_enablePermalink: '固定リンクボタンを有効にする (アイコンのみ)',
                    copier_enableCopyContent: '内容コピーボタンを有効にする (スマート)',
                    copier_fetchPermalinkSmart: '固定リンク (スマート)',
                    copier_fetchPermalinkDirect: '固定リンク (直接)',
                    copier_copyContent: '投稿内容をコピー',
                    copier_copyContentSuccess: '✅ コピーしました ({count} 文字)',
                    copier_copyContentFailed: '❌ 失敗しました',
                    copier_processing: '処理中...',
                    copier_successPermalink: '✅ コピーしました',
                    copier_failure: '❌ 失敗',
                    copier_notificationPermalinkCopied: '固定リンクをクリップボードにコピーしました：\n{url}',
                    copier_notificationErrorGeneric: '固定リンクの取得に失敗しました。',
                    copier_notificationErrorNoSourceUrl: '失敗：ソースURLが見つかりません。',
                    copier_notificationErrorTimeout: '失敗：取得タイムアウト。',
                    copier_notificationContentNotFound: '❌ コンテンツが見つかりませんでした。',
                    copier_menu_useSmartLink: 'コンテンツコピー時にスマートリンクを使用 (待機あり)',
                    copier_menu_permalinkFormat: '固定リンク形式',
                    copier_format_full: '完全なURL',
                    copier_format_username: 'ユーザー名+ID',
                    copier_format_author_id: '作者ID+ID (推奨)',
                    copier_format_shortest: '短縮 (fb.com)',
                    copier_includeEmojis: '絵文字を含める',
                    copier_expandHashtags: 'ハッシュタグをURLに展開',
                    copier_expand_mentions: 'メンションをURLに展開',

                    autoLoader_batchSize: '自動読み込みバッチ数',
                    tooltipAutoLoadStart: '投稿を自動読み込み',
                    tooltipAutoLoadStop: '読み込み停止',
                    tooltipBatchCopy: '読み込まれたすべての投稿を一括コピー (右クリックでモード切替)',
                    batchCopy_includeHeader: '一括コピーにヘッダーを含める',
                    autoLoad_status_loading: '読み込み中... ({current}/{target})',
                    autoLoad_status_retrying: '再試行中... ({count}/{max})',
                    autoLoad_status_success: '自動読み込み完了。',
                    autoLoad_status_stopped: 'ユーザーにより停止。',
                    autoLoad_status_deadlock: 'ブロックを検出。停止します。',
                    autoLoad_mode_incremental: 'モード：追加読み込み (+{n})',
                    autoLoad_mode_target: 'モード：目標到達まで ({n})',
                    autoLoad_target_reached: '目標件数 ({n}) に到達済みです。',
                    autoLoad_tooltip_incremental: '自動読み込み (+{n})\n右クリック：目標モードへ切替',
                    autoLoad_tooltip_target: '自動読み込み (目標 {n})\n右クリック：増分モードへ切替',

                    setting_batchExportFormat: '一括エクスポート形式',
                    tooltip_batchExportFormat: '一括エクスポート（自動ロード > コピー）のファイル形式を選択します。',
                    batchCopy_start: '{count} 件の投稿を処理中...',
                    batchCopy_success: '{count} 件の投稿をクリップボードにコピーしました！ ({chars} 文字)',
                    batchCopy_download_success: '{count}件の投稿をダウンロードしました！({chars}文字)',
                    batchCopy_empty: 'コピーできる投稿がありません。',
                    batchCopy_mode_clipboard: 'バッチモード：クリップボードにコピー',
                    batchCopy_mode_download: 'バッチモード：ファイルとして保存',
                    exportFormat_text: 'プレーンテキスト (.txt)',
                    exportFormat_json: 'JSON (.json)',
                    exportFormat_csv: 'CSV (.csv)',

                    // --- Deadlock & Error Recovery ---
                    floatingNav_showAutoLoad: '自動読み込みボタンを表示',
                    floatingNav_showBatchCopy: '一括コピーボタンを表示',
                    floatingNav_opacity: '待機時に半透明にする',

                    // --- メタデータコピー ---
                    copy_includeMetadata: 'メタデータを含める (作成者、日付、リンク...)',
                    copy_meta_url: '投稿リンクを含める (上部)',
                    copy_meta_order: '投稿順序 [#xx] を含める (一括コピーのみ)',
                    copy_meta_author_name: '作成者名を含める',
                    copy_meta_author_link: '作成者リンクを含める',
                    copy_meta_date: '日付/時間を含める',
                    copy_meta_stats: 'インタラクション統計を含める',
                    copy_meta_stats_total: '合計リアクション数を含める',
                    copy_meta_stats_detailed: '詳細なリアクションを含める',
                    copy_meta_link_preview: 'リンクプレビュー情報を含める',
                    copy_meta_image_count: '画像数を含める',
                    image_count_label: '画像',
                    copy_meta_video_duration: '動画/リールの長さを含める',
                    label_reel: 'リール',
                    label_video: '動画',
                    stats_label_like: 'いいね',
                    stats_label_comment: 'コメント',
                    stats_label_share: 'シェア',
                    stats_label_reaction: 'リアクション',
                    preview_label_title: 'タイトル',
                    preview_label_source: 'ソース',
                    preview_label_desc: '概要',
                    preview_label_link: 'リンク',

                    // --- その他 ---
                    tooltipAds: '広告ライブラリ',
                    tooltipTransparency: 'ページの透明性',
                    notificationReelSearchError: 'ページ名が見つかりません。',
                },
            },
        },

        // --- STYLES ---
        styles: {
            get CORE() {
                return [
                    this.BASE,
                    this.NAVIGATOR,
                    this.TIMELINE,
                    this.TOOLBAR,
                    this.COMPONENTS,
                    this.SETTINGS
                ].join('\n');
            },
            get BASE() {
                const C = app.config;
                return [
                    // --- Base Hide Rules ---
                    `div[data-nosnippet], div[role="banner"]:has(a[href*="/reg/"]) { display: none !important; }`,
                    // --- Post Highlights ---
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS} { outline: 3px solid #1877F2 !important; box-shadow: 0 0 15px rgba(24, 119, 242, 0.5) !important; border-radius: 8px; z-index: 10 !important; }`,
                    // Heatmap Border Colors
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="1"] { outline-color: #B2DFDB !important; box-shadow: 0 0 15px rgba(178, 223, 219, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="2"] { outline-color: #80CBC4 !important; box-shadow: 0 0 15px rgba(128, 203, 196, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="3"] { outline-color: #26A69A !important; box-shadow: 0 0 15px rgba(38, 166, 154, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="4"] { outline-color: #66BB6A !important; box-shadow: 0 0 15px rgba(102, 187, 106, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="5"] { outline-color: #D4E157 !important; box-shadow: 0 0 15px rgba(212, 225, 87, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="6"] { outline-color: #FFEE58 !important; box-shadow: 0 0 15px rgba(255, 238, 88, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="7"] { outline-color: #FFCA28 !important; box-shadow: 0 0 15px rgba(255, 202, 40, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="8"] { outline-color: #FB8C00 !important; box-shadow: 0 0 15px rgba(251, 140, 0, 0.5) !important; }`,
                    `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}[data-heat="9"] { outline-color: #F44336 !important; box-shadow: 0 0 15px rgba(244, 67, 54, 0.5) !important; }`
                ].join('\n');
            },
            get NAVIGATOR() {
                const C = app.config;
                return [
                    // --- Floating Nav ---
                    `.gm-floating-nav { position: fixed; bottom: ${C.UI.DIMENSIONS.FLOATING_NAV_BOTTOM}; right: ${C.UI.DIMENSIONS.FLOATING_NAV_RIGHT}; z-index: ${C.UI.Z_INDEX.FLOATING_NAV}; display: flex; flex-direction: column; gap: 12px; transition: opacity 0.3s; }`,
                    `.gm-floating-nav[data-opacity="true"] { opacity: 0.1; }`,
                    `.gm-floating-nav[data-opacity="true"]:hover { opacity: 1; }`,
                    `.gm-floating-nav button { background-color: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: none; border-radius: 50%; width: 44px; height: 44px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; color: #65676B; }`,
                    `.gm-floating-nav button:hover { background-color: #FFFFFF; transform: scale(1.1); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }`,
                    `.gm-floating-nav button:active { transform: scale(0.95); }`,
                    `.gm-floating-nav svg { width: 22px; height: 22px; fill: currentColor; }`
                ].join('\n');
            },
            get TIMELINE() {
                const C = app.config;
                return [
                    // --- Timeline Navigator ---
                    `#gm-timeline-container { position: fixed; right: 0; top: 60px; bottom: 20px; z-index: ${C.UI.Z_INDEX.TIMELINE}; background: transparent; border-top-left-radius: 16px; border-bottom-left-radius: 16px; padding: 16px 0; backdrop-filter: none; -webkit-backdrop-filter: none; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; width: fit-content; max-width: 32px; transition: max-width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.2s, box-shadow 0.2s, backdrop-filter 0.2s; box-shadow: none; overflow: hidden; border-left: none; }`,
                    `@supports (-moz-appearance:none) { #gm-timeline-container { right: 8px !important; } }`,
                    `#gm-timeline-container:hover { max-width: ${C.TIMELINE.WIDTH_MAX_LIMIT}; background: rgba(255, 255, 255, 0.95); box-shadow: -8px 0 24px rgba(0,0,0,0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-left: 1px solid rgba(255,255,255,0.5); }`,
                    `.gm-timeline-header { flex-shrink: 0; width: 100%; display: flex; justify-content: flex-end; padding-bottom: 4px; padding-right: 4px; }`,
                    `.gm-timeline-scroll-area { overflow-y: auto; overflow-x: hidden; flex-grow: 1; width: 100%; display: flex; flex-direction: column; align-items: flex-end; scrollbar-width: none; overscroll-behavior: contain; padding: 4px 0; }`,
                    `.gm-timeline-scroll-area::-webkit-scrollbar { display: none; }`,
                    `.gm-timeline-row { display: flex; align-items: center; justify-content: flex-end; width: 100%; height: ${C.TIMELINE.ROW_HEIGHT}; padding-right: 12px; padding-left: 16px; cursor: pointer; user-select: none; flex-shrink: 0; white-space: nowrap; }`,
                    `.gm-timeline-info { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-right: 12px; opacity: 0; transform: translateX(10px); transition: opacity 0.2s ease, transform 0.2s ease; pointer-events: none; }`,
                    `#gm-timeline-container:hover .gm-timeline-info { opacity: 1; transform: translateX(0); transition-delay: 0.05s; }`,
                    `.gm-timeline-sort-btn { width: 28px; height: 28px; border-radius: 50%; background: transparent; border: none; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 0px; margin-top: 4px; transition: transform 0.2s; opacity: 0.6; user-select: none; color: #65676B; }`,
                    `.gm-timeline-sort-btn:hover { opacity: 1; background-color: rgba(0,0,0,0.05); transform: scale(1.1); }`,
                    `.gm-label-time { font-size: 11px; color: #65676B; font-weight: 400; letter-spacing: 0.3px; }`,

                    `.gm-label-idx { font-size: 12px; color: #90949c; font-weight: normal; min-width: 28px; text-align: right; font-variant-numeric: tabular-nums; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }`,
                    `.gm-label-idx.milestone-text { color: #050505; font-weight: 700; font-size: 12px; }`,
                    `.gm-timeline-dot { width: ${C.TIMELINE.DOT_SIZE}; height: ${C.TIMELINE.DOT_SIZE}; border-radius: 50%; background-color: #B0B3B8; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s; flex-shrink: 0; }`,
                    `.gm-timeline-row:hover .gm-timeline-dot { transform: scale(1.5); }`,
                    `.gm-timeline-row:hover .gm-label-idx { color: #1877F2; font-weight: 700; }`,
                    `.gm-timeline-row:hover .gm-timeline-info { opacity: 1; transform: translateX(0); }`,
                    `.gm-timeline-row.active .gm-label-idx { color: #1877F2; font-weight: 700; }`,

                    // --- Timeline Heatmap Colors (9-Tier Spectrum) ---
                    `.gm-timeline-dot[data-heat="1"] { background-color: #B2DFDB !important; }`,
                    `.gm-timeline-dot[data-heat="2"] { background-color: #80CBC4 !important; }`,
                    `.gm-timeline-dot[data-heat="3"] { background-color: #26A69A !important; }`,
                    `.gm-timeline-dot[data-heat="4"] { background-color: #66BB6A !important; }`,
                    `.gm-timeline-dot[data-heat="5"] { background-color: #D4E157 !important; }`,
                    `.gm-timeline-dot[data-heat="6"] { background-color: #FFEE58 !important; }`,
                    `.gm-timeline-dot[data-heat="7"] { background-color: #FFCA28 !important; }`,
                    `.gm-timeline-dot[data-heat="8"] { background-color: #FB8C00 !important; }`,
                    `.gm-timeline-dot[data-heat="9"] { background-color: #F44336 !important; box-shadow: 0 0 4px rgba(244, 67, 54, 0.5); }`,

                    // --- Active State (Ring Style) ---
                    `.gm-timeline-row.active .gm-timeline-dot { transform: scale(1.4); border: 2px solid #ffffff; box-shadow: 0 0 0 2px #1877F2, 0 2px 6px rgba(0,0,0,0.3) !important; }`
                ].join('\n');
            },
            get TOOLBAR() {
                const C = app.config;
                return [
                    // --- Toolbar & Search ---
                    `.gm-toolbar { position: fixed; top: 0; left: 0; width: 100%; padding: 8px 16px; background-color: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: ${C.UI.Z_INDEX.TOOLBAR}; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); box-sizing: border-box; transition: transform 0.3s ease-in-out; gap: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); }`,
                    `.gm-button-group { display: flex; align-items: center; gap: 6px; }`,
                    `.gm-button-group button { background-color: transparent; border: none; padding: 0; height: 36px; width: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border-radius: 50%; color: #65676B; }`,
                    `.gm-button-group button:hover { background-color: rgba(0, 0, 0, 0.05); transform: translateY(-1px); }`,
                    `.gm-button-group button:active { transform: scale(0.96); background-color: rgba(0, 0, 0, 0.1); }`,
                    `.gm-button-group button svg { width: 20px; height: 20px; fill: #65676B; pointer-events: none; }`,
                    `.gm-button-group button.gm-pinned { background-color: #E7F3FF; }`,
                    `.gm-search-core-wrapper { flex-grow: 1; display: flex; justify-content: center; }`,
                    `.gm-search-component-wrapper { display: flex; align-items: center; border: 1px solid #CED0D4; border-radius: 18px; background-color: #F0F2F5; padding: 0; transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s; height: 36px; flex-grow: 1; max-width: 600px; }`,
                    `.gm-search-component-wrapper.gm-focused { border-color: #1877F2; box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.2); background-color: #FFFFFF; }`,
                    `.gm-search-component-wrapper > select, .gm-search-input-container > input { background: transparent; border: none; outline: none; height: 100%; padding-top: 0; padding-bottom: 0; }`,
                    `.gm-search-component-wrapper > select { padding-left: 12px; padding-right: 8px; margin-right: 8px; border-right: 1px solid #CED0D4; color: #65676B; font-weight: 500; }`,
                    `.gm-search-input-container { position: relative; display: flex; align-items: center; flex-grow: 1; height: 100%; }`,
                    `.gm-search-input-container > input { padding-right: 80px; width: 100%; }`,
                    `.gm-search-clear-button { position: absolute; right: 40px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #65676B; font-size: 14px; width: 20px; height: 20px; display: none; align-items: center; justify-content: center; background: none; border: none; padding: 0; }`,
                    `.gm-search-button-integrated { position: absolute; right: 0; height: 100%; width: 40px; background: transparent; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; border-radius: 0 18px 18px 0; }`,
                    `.gm-search-button-integrated svg { width: 18px; height: 18px; fill: #1877F2; }`,
                    `.gm-hover-hint { position: fixed; top: 0; left: 50%; width: 40px; height: 4px; background-color: rgba(0, 0, 0, 0.25); border-radius: 2px; z-index: ${C.UI.Z_INDEX.HOVER_HINT}; opacity: 0; transform: translate(-50%, -12px); transition: opacity 0.2s ease-in-out, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }`,
                    `.gm-hover-hint.gm-visible { opacity: 1; transform: translate(-50%, 8px); }`,
                    `.gm-hover-trigger { position: fixed; top: 0; left: 0; width: 100%; height: 10px; z-index: ${C.UI.Z_INDEX.HOVER_TRIGGER}; }`
                ].join('\n');
            },
            get COMPONENTS() {
                const C = app.config;
                return [
                    // --- Toasts ---
                    `.gm-toast { position: fixed; top: 20px; left: 50%; transform: translate(-50%, -100px); padding: 12px 20px; border-radius: 8px; color: white; font-size: 14px; font-weight: bold; z-index: ${C.UI.Z_INDEX.TOAST}; opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.2); backdrop-filter: blur(5px); white-space: pre-wrap; }`,
                    `.gm-toast-visible { opacity: 1; transform: translate(-50%, 0); }`,
                    `.gm-toast-success { background-color: rgba(24, 119, 242, 0.85); }`,
                    `.gm-toast-failure { background-color: rgba(220, 53, 69, 0.85); }`,
                    `.gm-toast-info { background-color: rgba(50, 50, 50, 0.9); }`,
                    `.gm-toast a { color: white; text-decoration: underline; font-weight: 600; transition: opacity 0.2s; }`,
                    `.gm-toast a:hover { opacity: 0.8; }`,

                    // --- Post Tools (Permalink & Copy) ---
                    `.${C.SELECTORS.POST_TOOLS.BUTTON_CLASS} { --positive-background: #E7F3FF; --negative-background: #FDEDEE; --hover-overlay: rgba(0, 0, 0, 0.05); --secondary-text: #65676B; --media-inner-border: #CED0D4; }`,

                    // --- Tools Icons & Animation ---
                    `@keyframes gm-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,
                    `.gm-spin { animation: gm-spin 0.8s linear infinite; transform-origin: center; }`,
                    `.gm-icon-wrapper { display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; }`,
                    `.gm-icon-wrapper svg { display: block; }`,

                    // --- Transparency Buttons ---
                    `.gm-transparency-container { position: fixed; bottom: 20px; left: 20px; z-index: ${C.UI.Z_INDEX.TRANSPARENCY}; display: none; flex-direction: column; gap: 10px; transition: opacity 0.3s; }`,
                    `.gm-transparency-container[data-opacity="true"] { opacity: 0.5; }`,
                    `.gm-transparency-container[data-opacity="true"]:hover { opacity: 1; }`,
                    `.gm-transparency-btn { width: 40px; height: 40px; border-radius: 50%; background-color: white; border: 1px solid #ddd; box-shadow: 0 2px 5px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: transform 0.1s; }`,
                    `.gm-transparency-btn:hover { background-color: #f0f2f5; }`,
                    `.gm-transparency-btn:active { transform: scale(0.95); }`,

                    // --- Post Numbering ---
                    `.gm-post-number { position: absolute; top: -10px; left: -10px; background-color: #e4e6eb; color: #65676b; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 1; }`
                ].join('\n');
            },
            get SETTINGS() {
                const C = app.config;
                return [
                    // --- Settings Modal (Modern UI) ---
                    `.gm-settings-backdrop { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: ${C.UI.Z_INDEX.MODAL_BACKDROP}; opacity: 0; transition: opacity 0.3s ease; overscroll-behavior: contain; }`,
                    `.gm-settings-backdrop.open { opacity: 1; }`,
                    `.gm-settings-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); z-index: ${C.UI.Z_INDEX.MODAL_FOREGROUND}; min-width: 680px; max-width: 90vw; display: flex; flex-direction: column; height: 85vh; max-height: 85vh; opacity: 0; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); overscroll-behavior: contain; }`,
                    `.gm-settings-modal.open { transform: translate(-50%, -50%) scale(1); opacity: 1; }`,
                    // Custom Scrollbar
                    `.gm-settings-content::-webkit-scrollbar { width: 8px; }`,
                    `.gm-settings-content::-webkit-scrollbar-track { background: transparent; }`,
                    `.gm-settings-content::-webkit-scrollbar-thumb { background-color: #CED0D4; border-radius: 4px; border: 2px solid #FFFFFF; }`,
                    `.gm-settings-content::-webkit-scrollbar-thumb:hover { background-color: #B0B3B8; }`,

                    `.gm-settings-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 24px; border-bottom: 1px solid #F0F2F5; }`,
                    `.gm-settings-title { margin: 0; font-size: 20px; font-weight: 700; color: #050505; }`,
                    `.gm-settings-close-btn { background: none; border: none; font-size: 24px; color: #65676B; cursor: pointer; padding: 4px; border-radius: 50%; transition: background-color 0.2s; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }`,
                    `.gm-settings-close-btn:hover { background-color: #F0F2F5; color: #050505; }`,

                    `.gm-settings-body { padding: 24px; overflow-y: auto; flex: 1; background-color: #F7F8FA; display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }`,

                    `.gm-col { flex: 1; min-width: 320px; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #E4E6EB; }`,
                    // Grid Layout for Content
                    `.gm-col-content { display: flex; flex-direction: column; gap: 8px; }`,
                    // Make full width for non-toggle inputs if needed, or keeping everything grid
                    `.gm-setting-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; padding: 4px 0; transition: opacity 0.2s; min-height: 32px; }`,
                    `.gm-setting-row.full-width { width: 100%; }`,

                    `.gm-col-header { margin-top: 0; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #F0F2F5; color: #65676B; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }`,

                    `.gm-setting-label { margin-right: 12px; color: #050505; font-size: 13px; font-weight: 500; line-height: 1.3; }`,

                    // Toggle Switch (Compact iOS Style)
                    `.gm-switch { position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0; }`,
                    `.gm-switch input { opacity: 0; width: 0; height: 0; }`,
                    `.gm-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #CED0D4; transition: .4s; border-radius: 34px; }`,
                    `.gm-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }`,
                    `input:checked + .gm-slider { background-color: #1877F2; }`,
                    `input:checked + .gm-slider:before { transform: translateX(16px); }`,
                    `input:disabled + .gm-slider { opacity: 0.5; cursor: not-allowed; }`,

                    // Inputs (Compact)
                    `.gm-input-text { border: 1px solid #CED0D4; border-radius: 6px; padding: 4px 8px; font-size: 13px; outline: none; transition: border-color 0.2s; background: #F0F2F5; color: #050505; width: 80px; text-align: right; }`,
                    `.gm-input-text:focus { border-color: #1877F2; background: #FFFFFF; }`,

                    // KeyBinder Button
                    `.gm-keybinder-btn { min-width: 80px; padding: 6px 12px; border: 1px solid #CED0D4; border-radius: 6px; background: #FFFFFF; color: #050505; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: center; }`,
                    `.gm-keybinder-btn:hover { border-color: #1877F2; background: #F0F2F5; }`,
                    `.gm-keybinder-btn.recording { border-color: #F44336; color: #F44336; background: #FFF5F5; animation: gm-pulse 1.5s infinite; }`,
                    `@keyframes gm-pulse { 0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); } }`,
                    `.gm-input-select { border: 1px solid #CED0D4; border-radius: 6px; padding: 4px 24px 4px 8px; font-size: 13px; outline: none; background: #F0F2F5; cursor: pointer; color: #050505; appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2365676B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 8px top 50%; background-size: 8px; }`,

                    // Collapsible Details
                    `.gm-details { width: 100%; border: 1px solid #F0F2F5; border-radius: 8px; margin-top: 8px; }`,
                    `.gm-summary { padding: 8px 12px; background-color: #F7F8FA; cursor: pointer; font-size: 13px; font-weight: 600; color: #65676B; display: flex; align-items: center; justify-content: space-between; user-select: none; }`,
                    `.gm-summary:hover { background-color: #F0F2F5; color: #050505; }`,
                    `.gm-summary::after { content: "▼"; font-size: 10px; transition: transform 0.2s; }`,
                    `.gm-details[open] .gm-summary::after { transform: rotate(180deg); }`,
                    `.gm-details-content { padding: 12px; display: flex; flex-direction: column; gap: 8px; background: #FFFFFF; border-top: 1px solid #F0F2F5; }`,

                    `.gm-settings-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid #F0F2F5; background: #FFFFFF; }`,
                    `.gm-btn-save { padding: 6px 20px; border: none; background-color: #1877F2; color: white; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; transition: background-color 0.2s; }`,
                    `.gm-btn-save:hover { background-color: #166FE5; }`,
                    `.gm-btn-reset { padding: 6px 12px; border: none; background-color: transparent; color: #DC2626; font-weight: 500; font-size: 13px; cursor: pointer; border-radius: 6px; transition: background 0.2s; }`,
                    `.gm-btn-reset:hover { background-color: #FEF2F2; }`,

                    // --- Sidebar Layout (New) ---
                    `.gm-settings-body { display: flex; padding: 0; background-color: #F7F8FA; flex: 1; min-height: 0; position: relative; }`,
                    `.gm-settings-sidebar { width: 140px; background-color: #FFFFFF; border-right: 1px solid #CED0D4; display: flex; flex-direction: column; padding: 12px 0; flex-shrink: 0; }`,
                    `.gm-settings-content { flex: 1; padding: 12px 16px; overflow-y: scroll !important; display: flex; flex-direction: column; gap: 8px; height: 100%; max-height: 100%; }`,

                    // Tab Buttons
                    `.gm-tab-btn { padding: 10px 12px; border: none; background: transparent; text-align: left; cursor: pointer; border-radius: 8px; font-weight: 500; font-size: 14px; color: #65676B; transition: all 0.2s; margin-bottom: 2px; }`,
                    `.gm-tab-btn:hover { background-color: #F0F2F5; color: #050505; }`,
                    `.gm-tab-btn.active { background-color: #E7F3FF; color: #1877F2; font-weight: 600; }`,

                    // Hybrid Grid Layout for Panels
                    `.gm-panel { display: none; flex-direction: column; gap: 4px; animation: gm-fade-in 0.2s ease-out; }`,
                    `.gm-panel.active { display: flex; }`,

                    `.gm-grid-hybrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; align-items: center; }`,
                    // Rows
                    `.gm-setting-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; padding: 2px 0; transition: opacity 0.2s; min-height: 28px; box-sizing: border-box; }`,
                    `.gm-setting-row.span-2 { grid-column: span 2; width: 100%; }`,

                    `@keyframes gm-fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`
                ].join('\n');
            },
            get HIDE_USELESS() {
                const C = app.config;

                // Exclude media controls (Zoom, Fullscreen, Nav) from being hidden
                const mediaLabels = C.CONSTANTS.MEDIA_CONTROL_LABELS || [];
                const exclusion = mediaLabels.map(l => `:not([aria-label*="${l}"])`).join('');

                const toolbarRuleA = `div:has(> div > div > div[role="button"]:not([aria-haspopup])${exclusion} > div > div > i[data-visualcompletion="css-img"])`;
                const toolbarRuleB = `div:has(> div > div[role="button"]:not([aria-haspopup])${exclusion} > div > div > i[data-visualcompletion="css-img"])`;

                const threeDotMenuSelector = `div[role="button"][aria-haspopup="menu"]:has(svg circle + circle + circle)`;

                // Fix for Sticky Navigation / Login Prompt
                // Adapted from user-provided uBlock Origin rules for maximum precision.

                const mediaControlExclusions = mediaLabels.map(l => `:not(:has([aria-label*="${l}"]))`).join('');
                const mediaViewerProtection = [
                    mediaControlExclusions,
                    ':not([data-pagelet="MediaViewerPhoto"])',
                    ':not(:has([data-pagelet="MediaViewerPhoto"]))',
                    ':not([style*="position: absolute"])' // Media Viewer is usually absolute
                ].join('');

                // 1. Floating Profile Tabs (Sticky header) -> Force Static (uBO Rule #8)
                const stickyProfileTabs = 'div[role="banner"] + div div[style*="top"][style*="z-index"]' + mediaViewerProtection;

                // 2. Login Banner (Top/Bottom) -> Force Absolute (uBO Rule #7)
                const stickyLoginBanner = [
                    'div[style*="z-index"]:has(a[href*="/login/"], form[action*="/login/"])', // Bottom
                    'div[role="banner"] > div:not(:first-child):has([aria-label="Facebook"])'   // Top content
                ].map(s => s + mediaViewerProtection).join(', ');

                // 3. Generic "You must log in to continue" prompt (uBO Rule #2)
                const genericLoginPrompt = 'div[id^="mount"] div:not([id]):not([class]):not([style]) > div[data-nosnippet]';

                // 4. Blocking Login Dialogs (CSS-based instant hide)
                // Targets: role="dialog" containing login forms
                const loginPopupSelector = 'div[role="dialog"]:has(form[action*="/login/"], #login_popup_cta_form)' + mediaViewerProtection;

                // 5. Reels Viewer Overlay (Invisible blocking layer on Photo Viewer)
                // Targets container with "Close reels viewer" link.
                // Includes localized labels (En, Zh-TW, Ja) and Sprite detection (-402px) for robustness.
                const reelsViewerOverlaySelector = [
                    'div:has(> div > span > a[aria-label="Close reels viewer and return to feed"])',
                    'div:has(> div > span > a[aria-label="關閉 Reel 檢視畫面並返回動態消息"])',
                    'div:has(> div > span > a[aria-label="リール動画のビューアーを閉じてフィードに戻る"])',
                    'div:has(> div > span > a > i[style*="background-position: 0px -402px"])'
                ].join(', ');

                return [
                    `${reelsViewerOverlaySelector} { display: none !important; }`,
                    `div[role="banner"]:has(${C.SELECTORS.GLOBAL.LOGIN_FORM}) { display: none !important; }`,
                    `${toolbarRuleA}, ${toolbarRuleB} { display: none !important; }`,
                    `${threeDotMenuSelector} { display: none !important; }`,
                    `${genericLoginPrompt}, ${loginPopupSelector} { display: none !important; }`,
                    `${stickyProfileTabs} { position: static !important; }`,
                    `${stickyLoginBanner} { position: absolute !important; }`
                ].join('\n');
            },
            get HIDE_STATS() {
                return `div:has(> div > span[role="toolbar"]) { display: none !important; }`;
            }
        },

        // --- APPLICATION STATE ---
        state: {
            settings: {},
            T: {}, // Localized strings
            cachedPageID: null,
            currentPath: '',
            lastActivePost: null, // For Scroll Restorer
        },

        // --- UTILITY FUNCTIONS ---
        utils: {
            /**
             * Checks if the user is currently logged in based on DOM markers.
             * @returns {boolean} True if logged in, false otherwise.
             */
            isLoggedIn() {
                const banner = document.querySelector('div[role="banner"]');
                if (!banner) return false;
                if (app.config.LOGIN_STATE_MARKERS.LOGGED_OUT.some(marker => banner.querySelector(marker.selector))) return false;
                if (app.config.LOGIN_STATE_MARKERS.LOGGED_IN.some(marker => banner.querySelector(marker.selector))) return true;
                return false;
            },
            /**
             * Creates a throttled version of a function that only invokes at most once per every `delay` milliseconds.
             * @param {Function} func - The function to throttle.
             * @param {number} delay - The number of milliseconds to throttle executions to.
             * @returns {Function} - The throttled function.
             */
            throttle(func, delay) {
                let timeoutId = null;
                return (...args) => {
                    if (timeoutId === null) {
                        timeoutId = setTimeout(() => {
                            func.apply(this, args);
                            timeoutId = null;
                        }, delay);
                    }
                };
            },
            /**
             * Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
             * @param {Function} func - The function to debounce.
             * @param {number} wait - The number of milliseconds to delay.
             * @returns {Function} - The debounced function.
             */
            debounce(func, wait) {
                let timeout;
                return function (...args) {
                    const context = this;
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(context, args), wait);
                };
            },
            /**
             * Utility to create a DOM element with styles and properties.
             * @param {string} tag - The HTML tag name.
             * @param {Object} [styles={}] - CSS styles to apply.
             * @param {Object} [properties={}] - Properties to set (including 'on' for events and 'children').
             * @returns {HTMLElement} - The created element.
             */
            createStyledElement(tag, styles = {}, properties = {}) {
                const element = document.createElement(tag);
                Object.assign(element.style, styles);
                const { on, children, ...rest } = properties;
                Object.assign(element, rest);
                if (on) {
                    for (const [eventName, handler] of Object.entries(on)) {
                        element.addEventListener(eventName, handler);
                    }
                }
                if (children) {
                    const childList = Array.isArray(children) ? children : [children];
                    element.append(...childList.filter(Boolean));
                }
                return element;
            },
            /**
             * Determines if the current page is a "feed" page where posts are displayed.
             * @returns {boolean} True if it is a feed page.
             */
            isFeedPage() {
                const { pathname } = window.location;
                if (/\/posts\//.test(pathname)) return false;
                if (/\/videos\//.test(pathname) && pathname.split('/').length > 2) return false;
                if (/\/photos?\//.test(pathname)) return false;
                if (pathname.includes('/permalink.php')) return false;
                if (pathname.includes('/story.php')) return false;
                if (pathname.includes('/media/set')) return false;
                const pathSegments = pathname.split('/').filter(Boolean);
                if (pathSegments.length === 0) return true;
                if (pathSegments[0] === 'groups' && pathSegments.length >= 1) return true;
                const disallowedFirstSegments = ['watch', 'marketplace', 'gaming', 'events', 'messages', 'notifications', 'friends', 'photo', 'videos', 'reel', 'posts', 'stories', 'settings', 'saved'];
                return !disallowedFirstSegments.includes(pathSegments[0]);
            },
            /**
             * Returns a promise that resolves after the specified milliseconds.
             * @param {number} ms - Milliseconds to delay.
             * @returns {Promise<void>}
             */
            delay: ms => new Promise(res => setTimeout(res, ms)),

            /**
             * Opens a URL in a new tab, handling background tabs if supported.
             * @param {Event} event - The triggering event.
             * @param {string} url - The URL to open.
             */
            smartOpen(event, url) {
                event.preventDefault();
                const isBackground = event.button === 1 || event.ctrlKey || event.metaKey;
                if (isBackground) GM_openInTab(url, { active: false, insert: true });
                else window.open(url, '_blank');
            },
            /**
             * Checks if an element is currently visible in the viewport and not hidden.
             * @param {HTMLElement} el - The element to check.
             * @returns {boolean} True if visible.
             */
            isVisible(el) {
                if (!el) return false;
                return el.offsetParent !== null && window.getComputedStyle(el).display !== 'none';
            },

            /**
             * Scrolls the window to the specified element, respecting user settings for alignment and animation.
             * @param {HTMLElement} element - The target element.
             * @param {boolean|null} [forceSmooth=null] - Force smooth scrolling if true/false, or use settings if null.
             * @param {string|null} [alignmentOverride=null] - Override the default alignment (e.g. 'top', 'center', 'bottom').
             */
            scrollToElement(element, forceSmooth = null, alignmentOverride = null) {
                if (!element) return;

                const settings = app.state.settings;
                const alignment = alignmentOverride || settings.navigationScrollAlignment;
                const alignCenter = alignment === 'center';
                const alignBottom = alignment === 'bottom';

                const isSmooth = forceSmooth !== null ? forceSmooth : settings.enableSmoothScrolling;
                const behavior = isSmooth ? 'smooth' : 'auto';

                const rect = element.getBoundingClientRect();
                const currentScroll = window.scrollY || window.pageYOffset;
                let targetY;

                if (alignCenter) {
                    // Center
                    targetY = currentScroll + rect.top + (rect.height / 2) - (window.innerHeight / 2);
                } else if (alignBottom) {
                    // Bottom with minimal padding (10px) to match Top buffer
                    targetY = currentScroll + rect.bottom - window.innerHeight + 10;
                } else {
                    // Top Alignment
                    let offset = 10; // Base buffer

                    // Dynamic Toolbar Check (Only if Pinned)
                    // Note: FB Header is ignored as it is hidden by the script
                    if (app.modules.searchBar && typeof app.modules.searchBar.getOccupiedHeight === 'function') {
                        offset += app.modules.searchBar.getOccupiedHeight();
                    }

                    targetY = currentScroll + rect.top - offset;
                }

                window.scrollTo({
                    top: targetY,
                    behavior: behavior
                });
            },

            /**
             * Removes known tracking parameters from a URL object.
             * @param {URL} urlObj - The URL object to clean.
             * @returns {boolean} True if any parameters were removed.
             */
            cleanUrlParams(urlObj) {
                if (!urlObj || !urlObj.searchParams) return false;
                const trackingParams = app.config.TRACKING_PARAMS;
                const keysToDelete = [];
                urlObj.searchParams.forEach((_, key) => {
                    const shouldDelete = trackingParams.some(tp => key === tp || key.startsWith(`${tp}[`));
                    if (shouldDelete) keysToDelete.push(key);
                });
                keysToDelete.forEach(k => urlObj.searchParams.delete(k));
                return keysToDelete.length > 0;
            },

            /**
             * Smartly extracts text from a DOM element, preserving block topology (paragraphs/headers) with newlines.
             * @param {HTMLElement} root - The root element to extract text from.
             * @returns {string} The formatted text.
             */
            smartTextExtract(root) {
                let text = '';
                if (!root) return text;

                // Utility to ensure string ends with specific count of newlines
                const ensureNewlines = (count) => {
                    if (text.length === 0) return;
                    let current = 0;
                    for (let i = text.length - 1; i >= 0; i--) {
                        if (text[i] === '\n') current++;
                        else break;
                    }
                    while (current < count) {
                        text += '\n';
                        current++;
                    }
                };

                const isBlock = (node) => {
                    const tag = node.tagName?.toUpperCase();
                    return ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'SECTION', 'ARTICLE'].includes(tag);
                };

                const hasBlockChildren = (node) => {
                    for (let child of node.children) {
                        if (isBlock(child)) return true;
                    }
                    return false;
                };

                const traverse = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        text += node.textContent;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.getAttribute('aria-hidden') === 'true' || node.style.display === 'none') return;

                        const isBlockElem = isBlock(node);
                        const isContainer = isBlockElem && hasBlockChildren(node);

                        if (isBlockElem) ensureNewlines(1);

                        if (node.tagName === 'BR') {
                            text += '\n';
                        } else {
                            node.childNodes.forEach(traverse);
                        }

                        if (isBlockElem) {
                            if (isContainer) ensureNewlines(2);
                            else ensureNewlines(1);
                        }
                    }
                };

                traverse(root);
                return text.trim();
            }
        },

        // --- CORE MODULES ---
        modules: {
            settingsManager: {
                app: null,
                registeredCommands: [],
                definitions: null,
                _getDefinitions() {
                    const D = this.app.config.SETTINGS_DEFAULTS;
                    const generalSettings = [
                        { key: 'autoOpenMediaInNewTab', type: 'boolean', defaultValue: D.AUTO_OPEN_MEDIA, labelKey: 'autoOpenMediaInNewTab', group: 'general' },
                        { key: 'hideUselessElements', type: 'boolean', defaultValue: D.HIDE_USELESS, labelKey: 'hideUselessElements', group: 'general', needsReload: true },
                        { key: 'hidePostStats', type: 'boolean', defaultValue: D.HIDE_STATS, labelKey: 'hidePostStats', group: 'general', instant: true },
                        { key: 'showDeadlockNotification', type: 'boolean', defaultValue: D.SHOW_DEADLOCK, labelKey: 'showDeadlockNotification', group: 'general' },
                        { key: 'errorRecoveryEnabled', type: 'boolean', defaultValue: D.ERROR_RECOVERY, labelKey: 'errorRecoveryEnabled', group: 'general' },
                        { key: 'transparencyButtonsEnabled', type: 'boolean', defaultValue: D.TRANSPARENCY_BTNS, labelKey: 'transparencyButtonsEnabled', group: 'general' },
                        { key: 'idRevealerEnabled', type: 'boolean', defaultValue: D.ID_REVEALER, labelKey: 'idRevealerEnabled', group: 'general' },
                        {
                            key: 'idRevealerLinkFormat', type: 'select', defaultValue: D.ID_LINK_FORMAT, labelKey: 'idRevealerLinkFormat',
                            options: [
                                { value: 'userid', labelKey: 'idFormatUserID' }, { value: 'classic', labelKey: 'idFormatClassic' }, { value: 'username', labelKey: 'idFormatUsername' }
                            ],
                            group: 'general'
                        },
                        { key: 'autoUnmuteEnabled', type: 'boolean', defaultValue: D.AUTO_UNMUTE, labelKey: 'autoUnmuteEnabled', group: 'general' },
                        { key: 'autoUnmuteVolume', type: 'range', defaultValue: D.UNMUTE_VOLUME, labelKey: 'setVolumeLabel', options: { min: 0, max: 100, step: 5, unit: '%' }, group: 'general' },
                        { key: 'postNumberingEnabled', type: 'boolean', defaultValue: D.POST_NUMBERING, labelKey: 'postNumberingEnabled', group: 'general' },
                        { key: 'expandContentEnabled', type: 'boolean', defaultValue: D.EXPAND_CONTENT, labelKey: 'expandContentEnabled', group: 'general' },
                    ];
                    const navigationSettings = [
                        { key: 'keyboardNavEnabled', type: 'boolean', defaultValue: D.KEY_NAV, labelKey: 'keyboardNavEnabled', group: 'navigation' },
                        { key: 'keyNavNextPrimary', type: 'keybinder', defaultValue: D.KEY_NEXT_PRI, labelKey: 'keyNavNextPrimary', group: 'navigation' },
                        { key: 'keyNavPrevPrimary', type: 'keybinder', defaultValue: D.KEY_PREV_PRI, labelKey: 'keyNavPrevPrimary', group: 'navigation' },
                        { key: 'keyNavNextSecondary', type: 'keybinder', defaultValue: D.KEY_NEXT_SEC, labelKey: 'keyNavNextSecondary', group: 'navigation' },
                        { key: 'keyNavPrevSecondary', type: 'keybinder', defaultValue: D.KEY_PREV_SEC, labelKey: 'keyNavPrevSecondary', group: 'navigation' },
                        { key: 'floatingNavEnabled', type: 'boolean', defaultValue: D.FLOATING_NAV, labelKey: 'floatingNavEnabled', group: 'navigation', instant: true },
                        { key: 'floatingNav_showAutoLoad', type: 'boolean', defaultValue: D.SHOW_AUTO_LOAD, labelKey: 'floatingNav_showAutoLoad', group: 'navigation', instant: true },
                        { key: 'floatingNav_showBatchCopy', type: 'boolean', defaultValue: D.SHOW_BATCH_COPY, labelKey: 'floatingNav_showBatchCopy', group: 'navigation', instant: true },
                        {
                            key: 'batchExportFormat', type: 'select', defaultValue: D.BATCH_EXPORT_FORMAT, labelKey: 'setting_batchExportFormat',
                            options: [
                                { value: 'text', labelKey: 'exportFormat_text' },
                                { value: 'json', labelKey: 'exportFormat_json' },
                                { value: 'csv', labelKey: 'exportFormat_csv' }
                            ],
                            tooltipKey: 'tooltip_batchExportFormat',
                            group: 'navigation'
                        },
                        {
                            key: 'batchCopyMode', type: 'select', defaultValue: D.BATCH_COPY_MODE, labelKey: 'setting_batchCopyMode',
                            options: [
                                { value: 'file', labelKey: 'batchCopyMode_file' },
                                { value: 'clipboard', labelKey: 'batchCopyMode_clipboard' }
                            ],
                            group: 'navigation'
                        },
                        { key: 'autoLoadBatchSize', type: 'range', defaultValue: D.BATCH_SIZE, labelKey: 'autoLoader_batchSize', options: { min: 10, max: 200, step: 5, unit: '' }, group: 'navigation' },

                        { key: 'timelineNavEnabled', type: 'boolean', defaultValue: D.TIMELINE_NAV, labelKey: 'timelineNavEnabled', group: 'navigation', instant: true },
                        { key: 'navHighlighterEnabled', type: 'boolean', defaultValue: D.NAV_HIGHLIGHTER, labelKey: 'navHighlighterEnabled', group: 'navigation' },
                        { key: 'heatmapBorderEnabled', type: 'boolean', defaultValue: D.HEATMAP_BORDER, labelKey: 'heatmapBorderEnabled', group: 'navigation' },
                        { key: 'timelineHeatmapEnabled', type: 'boolean', defaultValue: D.TIMELINE_HEATMAP, labelKey: 'timelineHeatmapEnabled', group: 'navigation' },

                        { key: 'wheelNavEnabled', type: 'boolean', defaultValue: D.WHEEL_NAV, labelKey: 'wheelNavEnabled', group: 'navigation' },
                        { key: 'wheelNavModifier', type: 'select', defaultValue: D.WHEEL_MODIFIER, labelKey: 'wheelNavModifier', options: [{ value: 'altKey', labelKey: 'modifierAlt' }, { value: 'ctrlKey', labelKey: 'modifierCtrl' }, { value: 'shiftKey', labelKey: 'modifierShift' }, { value: 'none', labelKey: 'modifierNone' }], group: 'navigation' },
                        { key: 'navigationScrollAlignment', type: 'select', defaultValue: D.SCROLL_ALIGNMENT, labelKey: 'navigationScrollAlignment', options: [{ value: 'center', labelKey: 'scrollAlignmentCenter' }, { value: 'top', labelKey: 'scrollAlignmentTop' }, { value: 'bottom', labelKey: 'scrollAlignmentBottom' }], group: 'navigation' },
                        { key: 'scrollRestorerAlignment', type: 'select', defaultValue: D.RESTORE_ALIGNMENT, labelKey: 'scrollRestorerAlignment', options: [{ value: 'center', labelKey: 'scrollAlignmentCenter' }, { value: 'top', labelKey: 'scrollAlignmentTop' }, { value: 'bottom', labelKey: 'scrollAlignmentBottom' }], group: 'navigation' },
                        { key: 'enableSmoothScrolling', type: 'boolean', defaultValue: D.SMOOTH_SCROLL, labelKey: 'enableSmoothScrolling', group: 'navigation' },
                        { key: 'floatingNavOpacity', type: 'boolean', defaultValue: D.FLOATING_OPACITY, labelKey: 'floatingNav_opacity', group: 'navigation' },
                        { key: 'continuousNavInterval', type: 'range', defaultValue: D.NAV_INTERVAL, labelKey: 'continuousNavInterval', options: { min: 0, max: 1000, step: 50, unit: 'ms' }, group: 'navigation' },
                    ];
                    const toolsSettings = [
                        // Buttons
                        { key: 'permalinkCopierEnabled', type: 'boolean', defaultValue: D.PERMALINK_COPIER, labelKey: 'copier_enablePermalink', group: 'tools', instant: true },
                        { key: 'enableCopyContentButton', type: 'boolean', defaultValue: D.COPY_CONTENT_BTN, labelKey: 'copier_enableCopyContent', group: 'tools', instant: true },

                        // Copy Behavior
                        { key: 'copier_useSmartLink', type: 'boolean', defaultValue: D.SMART_LINK, labelKey: 'copier_menu_useSmartLink', group: 'tools', instant: true },
                        { key: 'copier_includeEmojis', type: 'boolean', defaultValue: D.INCLUDE_EMOJIS, labelKey: 'copier_includeEmojis', group: 'tools', instant: true },
                        { key: 'batchCopy_includeHeader', type: 'boolean', defaultValue: D.BATCH_HEADER, labelKey: 'batchCopy_includeHeader', group: 'tools' },
                        { key: 'copier_expandHashtags', type: 'boolean', defaultValue: D.EXPAND_HASHTAGS, labelKey: 'copier_expandHashtags', group: 'tools' },
                        { key: 'copier_expandMentions', type: 'boolean', defaultValue: D.EXPAND_MENTIONS, labelKey: 'copier_expand_mentions', group: 'tools' },

                        // Metadata Included (Master)
                        { key: 'copy_includeMetadata', type: 'boolean', defaultValue: D.META_MASTER, labelKey: 'copy_includeMetadata', group: 'tools', instant: true },

                        // Metadata Details
                        { key: 'copy_meta_url', type: 'boolean', defaultValue: D.META_URL, labelKey: 'copy_meta_url', group: 'tools' },
                        { key: 'copy_meta_order', type: 'boolean', defaultValue: D.META_ORDER, labelKey: 'copy_meta_order', group: 'tools' },
                        { key: 'copy_meta_author_name', type: 'boolean', defaultValue: D.META_AUTHOR, labelKey: 'copy_meta_author_name', group: 'tools' },
                        { key: 'copy_meta_author_link', type: 'boolean', defaultValue: D.META_AUTHOR_LINK, labelKey: 'copy_meta_author_link', group: 'tools' },
                        { key: 'copy_meta_date', type: 'boolean', defaultValue: D.META_DATE, labelKey: 'copy_meta_date', group: 'tools' },
                        { key: 'copy_meta_link_preview', type: 'boolean', defaultValue: D.META_PREVIEW, labelKey: 'copy_meta_link_preview', group: 'tools' },
                        { key: 'copy_meta_image_count', type: 'boolean', defaultValue: D.META_IMG_COUNT, labelKey: 'copy_meta_image_count', group: 'tools' },
                        { key: 'copy_meta_video_duration', type: 'boolean', defaultValue: D.META_VID_DURATION, labelKey: 'copy_meta_video_duration', group: 'tools' },

                        // Stats Group
                        { key: 'copy_meta_stats', type: 'boolean', defaultValue: D.META_STATS, labelKey: 'copy_meta_stats', group: 'tools' },
                        { key: 'copy_meta_stats_total', type: 'boolean', defaultValue: D.META_STATS_TOTAL, labelKey: 'copy_meta_stats_total', group: 'tools' },
                        { key: 'copy_meta_stats_detailed', type: 'boolean', defaultValue: D.META_STATS_DETAILED, labelKey: 'copy_meta_stats_detailed', group: 'tools' },

                        // Format
                        {
                            key: 'copier_permalinkFormat', type: 'select', defaultValue: D.PERMALINK_FORMAT, labelKey: 'copier_menu_permalinkFormat',
                            options: [
                                { value: 'author_id', labelKey: 'copier_format_author_id' }, { value: 'username', labelKey: 'copier_format_username' },
                                { value: 'full', labelKey: 'copier_format_full' }, { value: 'shortest', labelKey: 'copier_format_shortest' },
                            ],
                            group: 'tools'
                        },
                    ];
                    return [...generalSettings, ...navigationSettings, ...toolsSettings];
                },
                init(app) {
                    this.app = app;
                    this.definitions = this._getDefinitions();
                    this.definitions.forEach(def => {
                        this.app.state.settings[def.key] = GM_getValue(def.key, def.defaultValue);
                    });
                    this.renderMenu();
                },
                renderMenu() {
                    if (this.registeredCommands && this.registeredCommands.length > 0) {
                        this.registeredCommands.forEach(cmdId => GM_unregisterMenuCommand(cmdId));
                    }
                    this.registeredCommands = [];
                    const T = this.app.state.T;
                    const settingsCommand = () => this.app.modules.settingsModal.open();
                    this.registeredCommands.push(GM_registerMenuCommand(T.menuSettings, settingsCommand));
                    const resetCommand = () => {
                        if (window.confirm(T.resetSettingsConfirm)) {
                            this.resetAllSettings();
                            this.app.modules.toastNotifier.show(T.notificationSettingsReset, 'success');
                        }
                    };
                    this.registeredCommands.push(GM_registerMenuCommand(T.menuResetSettings, resetCommand));
                },
                updateSetting(key, value) {
                    GM_setValue(key, value);
                    this.app.state.settings[key] = value;
                },
                handleSettingChange(key, newValue, oldValue) {
                    const PHT = this.app.modules.postHeaderTools;
                    const FN = this.app.modules.floatingNavigator;
                    const TN = this.app.modules.timelineNavigator;
                    const SI = this.app.modules.styleInjector;
                    const ER = this.app.modules.errorRecovery;
                    const TA = this.app.modules.transparencyActions;
                    const CE = this.app.modules.contentExpander;
                    const IR = this.app.modules.idRevealer;
                    switch (key) {
                        case 'permalinkCopierEnabled':
                        case 'enableCopyContentButton':
                        case 'copier_useSmartLink':
                        case 'copier_includeEmojis':
                        case 'copy_includeMetadata':
                            // Always re-evaluate buttons if any tool setting changes
                            if (PHT) PHT.reEvaluateAllButtons();
                            break;
                        case 'floatingNavEnabled':
                            if (newValue) FN.init(this.app); else FN.deinit();
                            break;
                        case 'timelineNavEnabled':
                            if (newValue) TN.init(this.app); else TN.deinit();
                            if (FN && this.app.state.settings.floatingNavEnabled) {
                                FN.deinit();
                                FN.init(this.app);
                            }
                            break;
                        case 'floatingNavOpacity':
                            FN.updateOpacityState(newValue);
                            break;
                        case 'hidePostStats':
                            SI.updateStatsBarVisibility(newValue);
                            break;
                        case 'errorRecoveryEnabled':
                            if (newValue) ER.init(this.app);
                            break;
                        case 'transparencyButtonsEnabled':
                            if (newValue) TA.init(this.app); else TA.deinit();
                            break;
                        case 'idRevealerEnabled':
                            if (newValue) IR.init(this.app);
                            break;
                        case 'expandContentEnabled':
                            if (newValue) CE.init(this.app);
                            break;
                    }
                },
                resetAllSettings() {
                    this.definitions.forEach(def => {
                        const oldValue = this.app.state.settings[def.key];
                        const newValue = def.defaultValue;
                        if (oldValue !== newValue) {
                            this.updateSetting(def.key, newValue);
                            if (def.instant) this.handleSettingChange(def.key, newValue, oldValue);
                        }
                    });
                },
            },

            settingsModal: {
                app: null,
                modalContainer: null,
                init(app) { this.app = app; },
                open() {
                    if (!this.modalContainer) this._createModal();
                    const T = this.app.state.T;
                    const U = this.app.utils;

                    this.modalContainer.body.innerHTML = '';
                    document.body.style.overflow = 'hidden'; // Prevent Background Scrolling

                    // --- Sidebar & Content Layout ---
                    const sidebar = U.createStyledElement('div', {}, { className: 'gm-settings-sidebar' });
                    const contentContainer = U.createStyledElement('div', {}, { className: 'gm-settings-content' });

                    const groups = [
                        { id: 'general', title: T.settingsColumnGeneral, isGrid: true },
                        { id: 'navigation', title: T.settingsColumnNavigation, isGrid: true },
                        { id: 'tools', title: T.settingsColumnTools, isGrid: true }
                    ];

                    let activeTab = null;
                    let activePanel = null;

                    groups.forEach((group, index) => {
                        // 1. Create Sidebar Tab
                        const tabBtn = U.createStyledElement('button', {}, {
                            className: 'gm-tab-btn',
                            textContent: group.title,
                            on: {
                                click: () => {
                                    if (activeTab) activeTab.classList.remove('active');
                                    if (activePanel) activePanel.classList.remove('active');

                                    tabBtn.classList.add('active');
                                    panel.classList.add('active');

                                    activeTab = tabBtn;
                                    activePanel = panel;
                                }
                            }
                        });
                        sidebar.appendChild(tabBtn);

                        // 2. Create Content Panel
                        const panel = this._createSettingsPanel(group.title, group.id, group.isGrid);
                        contentContainer.appendChild(panel);

                        // Activate default (first one)
                        if (index === 0) {
                            tabBtn.classList.add('active');
                            panel.classList.add('active');
                            activeTab = tabBtn;
                            activePanel = panel;
                        }
                    });

                    this.modalContainer.body.append(sidebar, contentContainer);
                    this._setupDependentControls(this.modalContainer.body);

                    this.modalContainer.backdrop.style.display = 'block';
                    this.modalContainer.modal.style.display = 'flex';

                    // Trigger Animation
                    requestAnimationFrame(() => {
                        this.modalContainer.backdrop.classList.add('open');
                        this.modalContainer.modal.classList.add('open');
                    });
                },
                _createSettingsPanel(title, group, isGrid = false) {
                    const U = this.app.utils;
                    const definitions = this.app.modules.settingsManager.definitions.filter(def => def.group === group);

                    const panel = U.createStyledElement('div', {}, { className: 'gm-panel' });

                    // Title Header
                    panel.appendChild(U.createStyledElement('h3', { margin: '0 0 16px 0', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '8px' }, { textContent: title }));

                    // Content Wrapper (Grid or Flex)
                    const content = U.createStyledElement('div', {}, {
                        className: isGrid ? 'gm-grid-hybrid' : 'gm-col-content' // 'gm-col-content' is flex-col
                    });

                    definitions.forEach(def => {
                        // Special handling for Collapsible Groups (Metadata)
                        if (def.key === 'copy_includeMetadata') {
                            const metaKeys = ['copy_meta_url', 'copy_meta_order', 'copy_meta_author_name', 'copy_meta_author_link', 'copy_meta_date', 'copy_meta_stats', 'copy_meta_link_preview', 'copy_meta_image_count', 'copy_meta_video_duration', 'copy_meta_stats_total', 'copy_meta_stats_detailed'];

                            // Create the main toggler row
                            content.appendChild(this._createSettingRow(def, isGrid));

                            // Create Details for children
                            // Note: Details element breaks Grid flow if not careful, but usually it spans full width naturally in block context. 
                            // In Grid, specific wrapper needed? We'll make details span-2.
                            const details = U.createStyledElement('details', {}, { className: 'gm-details' });
                            if (isGrid) details.classList.add('span-2'); // Should not happen for Metadata (Tools group), but safe to add

                            const summary = U.createStyledElement('summary', {}, { className: 'gm-summary', textContent: this.app.state.T.settingsDetailsMetadata });
                            const detailsContent = U.createStyledElement('div', {}, { className: 'gm-details-content' });

                            definitions.filter(d => metaKeys.includes(d.key)).forEach(d => detailsContent.appendChild(this._createSettingRow(d, false))); // Children always list

                            details.append(summary, detailsContent);
                            content.appendChild(details);
                            return;
                        }
                        if (['copy_meta_url', 'copy_meta_order', 'copy_meta_author_name', 'copy_meta_author_link', 'copy_meta_date', 'copy_meta_stats', 'copy_meta_link_preview', 'copy_meta_image_count', 'copy_meta_video_duration', 'copy_meta_stats_total', 'copy_meta_stats_detailed'].includes(def.key)) {
                            return;
                        }

                        content.appendChild(this._createSettingRow(def, isGrid));
                    });

                    panel.appendChild(content);
                    return panel;
                },
                _createSettingRow(def, isGrid) {
                    const U = this.app.utils;
                    const T = this.app.state.T;
                    const SM = this.app.modules.settingsManager;
                    const currentValue = this.app.state.settings[def.key];
                    let inputElement, valueSpan;

                    const handleInput = (e) => {
                        const val = def.type === 'boolean' ? e.target.checked : (def.type === 'range' ? parseInt(e.target.value, 10) : e.target.value);
                        if (valueSpan) valueSpan.textContent = `${e.target.value}${def.options.unit || ''}`;
                        SM.updateSetting(def.key, val);
                        if (def.instant) SM.handleSettingChange(def.key, val, this.app.state.settings[def.key]);
                    };

                    switch (def.type) {
                        case 'boolean':
                            inputElement = U.createStyledElement('label', {}, { className: 'gm-switch gm-input-right' });
                            const checkbox = U.createStyledElement('input', {}, { type: 'checkbox', id: `setting-${def.key}`, checked: currentValue, on: { input: handleInput } });
                            const slider = U.createStyledElement('span', {}, { className: 'gm-slider' });
                            inputElement.append(checkbox, slider);
                            break;
                        case 'range':
                            valueSpan = U.createStyledElement('span', { marginLeft: '12px', minWidth: '45px', textAlign: 'right', fontSize: '13px' }, { textContent: `${currentValue}${def.options.unit || ''}` });
                            inputElement = U.createStyledElement('div', { display: 'flex', alignItems: 'center', flexGrow: '1' }, {
                                children: [
                                    U.createStyledElement('input', { flexGrow: '1' }, { type: 'range', id: `setting-${def.key}`, min: def.options.min, max: def.options.max, step: def.options.step, value: currentValue, on: { input: handleInput } }),
                                    valueSpan
                                ]
                            });
                            break;
                        case 'text':
                            inputElement = U.createStyledElement('input', {}, { className: 'gm-input-text', type: 'text', id: `setting-${def.key}`, value: currentValue, on: { input: handleInput } });
                            break;
                        case 'select':
                            inputElement = U.createStyledElement('select', {}, {
                                className: 'gm-input-select', id: `setting-${def.key}`, value: currentValue, on: { input: handleInput },
                                children: def.options.map(opt => U.createStyledElement('option', {}, { value: opt.value, textContent: T[opt.labelKey] }))
                            });
                            inputElement.value = currentValue;
                            break;
                        case 'keybinder':
                            const formatKey = (k) => {
                                const map = { ' ': 'Space', 'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→', 'Escape': 'Esc' };
                                return map[k] || (k.length === 1 ? k.toUpperCase() : k);
                            };
                            inputElement = U.createStyledElement('button', {}, {
                                className: 'gm-keybinder-btn',
                                textContent: formatKey(currentValue),
                                on: {
                                    click: (e) => {
                                        const btn = e.currentTarget;
                                        btn.classList.add('recording');
                                        btn.textContent = T.keyBinderPress;

                                        const keyHandler = (ev) => {
                                            ev.preventDefault();
                                            ev.stopPropagation();

                                            const key = ev.key;
                                            // Cancel
                                            if (key === 'Escape') {
                                                document.removeEventListener('keydown', keyHandler, true);
                                                btn.classList.remove('recording');
                                                btn.textContent = formatKey(currentValue);
                                                return;
                                            }
                                            // Clear (Backspace or Delete) - but not if it's the bound key itself?
                                            // Let's assume Backspace/Delete are valid clears.
                                            if (key === 'Backspace' || key === 'Delete') {
                                                SM.updateSetting(def.key, '');
                                                document.removeEventListener('keydown', keyHandler, true);
                                                btn.classList.remove('recording');
                                                btn.textContent = T.keyBinderNone;
                                                return;
                                            }
                                            // Ignore modifiers alone
                                            if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(key)) return;

                                            // Save
                                            SM.updateSetting(def.key, key);
                                            document.removeEventListener('keydown', keyHandler, true);
                                            btn.classList.remove('recording');
                                            btn.textContent = formatKey(key);
                                        };

                                        document.addEventListener('keydown', keyHandler, true);
                                    }
                                }
                            });
                            break;
                    }

                    const wrapper = U.createStyledElement('div', {}, {
                        className: `gm-setting-row`,
                        children: [
                            U.createStyledElement('label', {}, { className: 'gm-setting-label', htmlFor: `setting-${def.key}`, textContent: T[def.labelKey] }),
                            inputElement
                        ]
                    });

                    // Hybrid Grid Logic
                    if (isGrid) {
                        // Booleans, Ranges, Selects, and Keybinders span 2 columns for better visibility
                        if (def.type === 'boolean' || def.type === 'range' || def.type === 'select' || def.type === 'keybinder') wrapper.classList.add('span-2');

                        // Special Handling for Floating Nav Sub-options (Long Buttons)
                        if (['floatingNav_showAutoLoad', 'floatingNav_showBatchCopy'].includes(def.key)) {
                            wrapper.classList.add('span-2');
                        }
                    } else {
                        // Flex Column mode: specific controls full width?
                        if (def.type !== 'boolean') wrapper.classList.add('full-width'); // Legacy logic, keeps inputs aligned right
                    }

                    // --- Dependency & Layout Logic ---
                    if (def.key === 'autoUnmuteVolume') wrapper.dataset.controls = 'autoUnmuteEnabled';
                    if (def.key.startsWith('keyNav')) wrapper.dataset.controls = 'keyboardNavEnabled';
                    if (def.key === 'copier_permalinkFormat') wrapper.dataset.controls = 'permalinkCopierEnabled';
                    if (def.key === 'idRevealerLinkFormat') wrapper.dataset.controls = 'idRevealerEnabled';
                    if (def.key === 'autoLoadBatchSize') wrapper.dataset.controls = 'floatingNavEnabled';
                    const metaKeys = ['copy_meta_url', 'copy_meta_order', 'copy_meta_author_name', 'copy_meta_author_link', 'copy_meta_date', 'copy_meta_stats', 'copy_meta_link_preview', 'copy_meta_image_count', 'copy_meta_video_duration'];
                    if (metaKeys.includes(def.key)) wrapper.dataset.controls = 'copy_includeMetadata';
                    if (['copy_meta_stats_total', 'copy_meta_stats_detailed'].includes(def.key)) {
                        wrapper.dataset.controls = 'copy_meta_stats';
                        wrapper.style.paddingLeft = '16px';
                        wrapper.style.borderLeft = '2px solid #eee';
                    }
                    if (['floatingNav_showAutoLoad', 'floatingNav_showBatchCopy'].includes(def.key)) {
                        wrapper.dataset.controls = 'floatingNavEnabled';
                        wrapper.style.paddingLeft = '16px';
                        wrapper.style.borderLeft = '2px solid #eee';
                        if (isGrid) wrapper.classList.add('span-2'); // Force full width for sub-settings
                    }

                    return wrapper;
                },

                _setupDependentControls(container) {
                    const controllers = {
                        autoUnmuteEnabled: container.querySelector('#setting-autoUnmuteEnabled'),
                        keyboardNavEnabled: container.querySelector('#setting-keyboardNavEnabled'),
                        permalinkCopierEnabled: container.querySelector('#setting-permalinkCopierEnabled'),
                        idRevealerEnabled: container.querySelector('#setting-idRevealerEnabled'),
                        floatingNavEnabled: container.querySelector('#setting-floatingNavEnabled'),
                        copy_includeMetadata: container.querySelector('#setting-copy_includeMetadata'),
                        copy_meta_stats: container.querySelector('#setting-copy_meta_stats'),
                    };
                    const toggleGroup = (controller, isEnabled) => {
                        container.querySelectorAll(`[data-controls="${controller.id.substring(8)}"]`).forEach(control => {
                            control.style.opacity = isEnabled ? '1' : '0.5';
                            const input = control.querySelector('input, select');
                            if (input) {
                                input.disabled = !isEnabled;
                                const nestedController = controllers[input.id.substring(8)];
                                if (nestedController) toggleGroup(nestedController, isEnabled && input.checked);
                            }
                        });
                    };
                    const updateAll = () => Object.values(controllers).forEach(c => c && toggleGroup(c, c.checked));
                    Object.values(controllers).forEach(c => c && c.addEventListener('input', updateAll));
                    updateAll();

                    // --- Special Logic: Enforce CSV -> File Only in Settings UI ---
                    const formatSelect = container.querySelector('#setting-batchExportFormat');
                    const modeSelect = container.querySelector('#setting-batchCopyMode');

                    if (formatSelect && modeSelect) {
                        const checkConstraint = () => {
                            if (formatSelect.value === 'csv') {
                                modeSelect.value = 'file';
                                modeSelect.disabled = true;
                                modeSelect.title = 'CSV format requires Download mode';
                                // Force update setting if it was clipboard - Trigger 'change' or update directly? 
                                // Direct updating might not trigger save logic if not handled by standard change listener.
                                // However, user will click Save which reads DOM values or state. 
                                // Since settingsManager updates state on 'change' event of inputs (delegated or direct?), 
                                // we should manually fire event or update state if we change value programmatically.
                                if (this.app.state.settings.batchCopyMode !== 'file') {
                                    this.app.modules.settingsManager.updateSetting('batchCopyMode', 'file');
                                }
                            } else {
                                modeSelect.disabled = false;
                                modeSelect.title = '';
                            }
                        };
                        formatSelect.addEventListener('change', checkConstraint);
                        // Run once init
                        checkConstraint();
                    }
                },
                _createModal() {
                    const T = this.app.state.T;
                    const U = this.app.utils;
                    const close = () => this.close();
                    const save = () => this.saveAndClose();
                    const reset = () => {
                        if (window.confirm(T.resetSettingsConfirm)) {
                            this.app.modules.settingsManager.resetAllSettings();
                            this.app.modules.toastNotifier.show(T.notificationSettingsReset, 'success');
                            this.open();
                        }
                    };
                    const header = U.createStyledElement('div', {}, {
                        className: 'gm-settings-header', children: [
                            U.createStyledElement('h2', {}, { className: 'gm-settings-title', textContent: T.settingsTitle }),
                            U.createStyledElement('button', {}, { className: 'gm-settings-close-btn', innerHTML: '&times;', on: { click: close } })
                        ]
                    });
                    const body = U.createStyledElement('div', {}, { className: 'gm-settings-body' });
                    const footer = U.createStyledElement('div', {}, {
                        className: 'gm-settings-footer', children: [
                            U.createStyledElement('button', {}, { className: 'gm-btn-reset', textContent: T.resetSettings, on: { click: reset } }),
                            U.createStyledElement('div', { display: 'flex', gap: '8px' }, {
                                children: [
                                    U.createStyledElement('button', {}, { className: 'gm-btn-save', textContent: T.saveAndClose, on: { click: save } })
                                ]
                            })
                        ]
                    });
                    const modal = U.createStyledElement('div', {}, { className: 'gm-settings-modal', children: [header, body, footer] });
                    const backdrop = U.createStyledElement('div', {}, { className: 'gm-settings-backdrop', on: { click: close } });

                    // Prevent Background Scrolling (Robust)
                    const preventDefault = (e) => { e.preventDefault(); e.stopPropagation(); };
                    // Block wheel on backdrop
                    backdrop.addEventListener('wheel', preventDefault, { passive: false });
                    backdrop.addEventListener('touchmove', preventDefault, { passive: false });

                    document.body.append(backdrop, modal);
                    this.modalContainer = { backdrop, modal, body };
                    backdrop.style.display = 'none';
                    modal.style.display = 'none';
                },
                close() {
                    if (this.modalContainer) {
                        this.modalContainer.backdrop.classList.remove('open');
                        this.modalContainer.modal.classList.remove('open');
                        document.body.style.overflow = ''; // Restore Scrolling
                        setTimeout(() => {
                            this.modalContainer.backdrop.style.display = 'none';
                            this.modalContainer.modal.style.display = 'none';
                        }, 300);
                    }
                },
                saveAndClose() {
                    const needsReload = this.app.modules.settingsManager.definitions.some(def => def.needsReload && this.app.state.settings[def.key] !== GM_getValue(def.key));
                    if (needsReload) this.app.modules.toastNotifier.show(this.app.state.T.notificationSettingsReload, 'success');
                    this.close();
                }
            },

            interceptor: {
                /**
                 * Initializes the scroll event interceptor to prevent login popups caused by scrolling.
                 */
                init() {
                    const originalAddEventListener = EventTarget.prototype.addEventListener;
                    Object.defineProperty(EventTarget.prototype, 'addEventListener', {
                        configurable: true,
                        enumerable: true,
                        get: () => function (type, listener, options) {
                            if (type === 'scroll' && this !== window) return;
                            return originalAddEventListener.call(this, type, listener, options);
                        },
                    });
                },
            },

            historyInterceptor: {
                /**
                 * Patches History API to dispatch custom events on navigation changes.
                 */
                init() {
                    const originalPushState = history.pushState;
                    history.pushState = function (...args) {
                        originalPushState.apply(this, args);
                        window.dispatchEvent(new Event('historyChange'));
                    };
                    const originalReplaceState = history.replaceState;
                    history.replaceState = function (...args) {
                        originalReplaceState.apply(this, args);
                        window.dispatchEvent(new Event('historyChange'));
                    };
                }
            },

            toastNotifier: {
                app: null,
                activeToasts: new Map(),
                /**
                 * Initializes the toast notifier.
                 * @param {Object} app - The main application instance.
                 */
                init(app) { this.app = app; },

                /**
                 * Shows a toast notification.
                 * @param {string} message - The message to display.
                 * @param {string} [type='success'] - 'success', 'failure', or 'info'.
                 * @param {number} [duration=4000] - Duration in milliseconds.
                 * @param {string} [id=null] - Optional ID for updating existing toast.
                 */
                show(message, type = 'success', duration = 4000, id = null) {
                    // Update existing toast if ID matches
                    if (id && this.activeToasts.has(id)) {
                        const existing = this.activeToasts.get(id);
                        if (existing.element && document.body.contains(existing.element)) {
                            existing.element.querySelector('span').innerHTML = message;
                            existing.element.className = `gm-toast gm-toast-${type} gm-toast-visible`;
                            clearTimeout(existing.timer);
                            existing.timer = setTimeout(() => this.dismiss(id), duration);
                            return { remove: () => this.dismiss(id) };
                        } else {
                            this.activeToasts.delete(id);
                        }
                    }

                    const toast = this.app.utils.createStyledElement('div', {}, {
                        className: `gm-toast gm-toast-${type}`,
                        innerHTML: `<span>${message}</span>`
                    });
                    document.body.append(toast);

                    // Force reflow for transition
                    toast.getBoundingClientRect();
                    toast.classList.add('gm-toast-visible');

                    const hideTimer = setTimeout(() => {
                        this.dismiss(id, toast);
                    }, duration);

                    if (id) {
                        this.activeToasts.set(id, { element: toast, timer: hideTimer });
                    }

                    return {
                        remove: () => {
                            clearTimeout(hideTimer);
                            this.dismiss(id, toast);
                        }
                    };
                },

                dismiss(id, element) {
                    let toast = element;
                    if (id && this.activeToasts.has(id)) {
                        const record = this.activeToasts.get(id);
                        toast = record.element;
                        this.activeToasts.delete(id);
                    }
                    if (toast) {
                        toast.classList.remove('gm-toast-visible');
                        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
                    }
                }
            },

            // =========================================================================
            // Module: UI Cleaner (Hide useless UI elements)
            // =========================================================================
            uiCleaner: {
                app: null,
                observer: null,
                init(app) {
                    this.app = app;
                    this.process();
                    this.startObserver();
                    window.addEventListener('historyChange', () => this.handleHistoryChange());
                },

                handleHistoryChange() {
                    // Re-run process on navigation
                    setTimeout(() => this.process(), 500);
                },

                startObserver() {
                    if (this.observer) return;
                    this.observer = new MutationObserver(this.app.utils.throttle(() => {
                        this.process();
                    }, 500));
                    this.observer.observe(document.body, { childList: true, subtree: true });
                },

                process() {
                    // Video Page Enhancements
                    this.cleanVideoPageUI();
                },

                cleanVideoPageUI() {
                    // 1. Unstick Toolbar
                    const toolbarSelector = this.app.config.SELECTORS.GLOBAL.VIDEO_PAGE_TOOLBAR_ROOT;
                    const toolbars = document.querySelectorAll(toolbarSelector);
                    toolbars.forEach(el => {
                        // EXCLUSION: Skip Reels Viewer Overlay (Close Button)
                        // If we force this to absolute/top=0, it overlays the photo viewer controls.
                        if (el.querySelector('a[aria-label="Close reels viewer and return to feed"]') ||
                            el.querySelector('a[aria-label="關閉 Reel 檢視畫面並返回動態消息"]') ||
                            el.querySelector('a[aria-label="リール動画のビューアーを閉じてフィードに戻る"]') ||
                            el.querySelector('i[style*="-402px"]')) return;

                        // Force absolute position to unstick from viewport top
                        // Only apply if not already applied
                        if (el.style.position !== 'absolute') {
                            el.style.setProperty('position', 'absolute', 'important');
                            el.style.setProperty('top', '0', 'important');
                            el.style.setProperty('width', '100%', 'important');
                            el.style.setProperty('z-index', '999', 'important');
                        }
                    });

                    // 2. Hide Follow Button
                    const followLabels = this.app.config.CONSTANTS.FOLLOW_BUTTON_LABELS;
                    if (!followLabels) return;

                    const buttons = document.querySelectorAll('[role="button"]');
                    buttons.forEach(btn => {
                        if (btn.style.display === 'none') return;

                        const label = btn.getAttribute('aria-label');
                        if (label && followLabels.includes(label)) {
                            btn.style.setProperty('display', 'none', 'important');
                        }
                    });
                }
            },

            styleInjector: {
                app: null,
                statsStyleElement: null,

                /**
                 * Initializes the style injector, applying base styles and user preferences.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    const settings = this.app.state.settings;

                    // 1. Core Styles
                    let css = this.app.styles.CORE;

                    // 2. Hide Useless Elements
                    if (settings.hideUselessElements) {
                        css += '\n' + this.app.styles.HIDE_USELESS;
                    }

                    const styleElement = this.app.utils.createStyledElement('style', {}, { textContent: css });
                    document.head.append(styleElement);

                    // 3. Handle Stats Hiding
                    this.updateStatsBarVisibility(settings.hidePostStats);
                },

                /**
                 * Updates visibility of post statistics (likes/comments) based on settings.
                 * @param {boolean} shouldHide - Whether to hide the stats bar.
                 */
                updateStatsBarVisibility(shouldHide) {
                    if (shouldHide) {
                        if (!this.statsStyleElement) {
                            this.statsStyleElement = this.app.utils.createStyledElement('style', {}, { textContent: this.app.styles.HIDE_STATS });
                            document.head.append(this.statsStyleElement);
                        }
                    } else {
                        if (this.statsStyleElement) {
                            this.statsStyleElement.remove();
                            this.statsStyleElement = null;
                        }
                    }
                }
            },

            // Link Intervention Module
            // explicitly ignores context menu clicks to prevent unwanted auto-open behavior.
            linkIntervention: {
                app: null,

                /**
                 * Initializes the link intervention module.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    // Use capture phase (true) to intercept events before Facebook's React handlers
                    document.addEventListener('click', this.handleClick.bind(this), true);
                    document.addEventListener('auxclick', this.handleClick.bind(this), true); // For middle-click

                    // Re-enable context menu (Right-click)
                    document.addEventListener('contextmenu', (e) => {
                        // Allow internal UI elements to handle their own context menu
                        if (e.target.closest('.gm-floating-nav') || e.target.closest('.gm-transparency-btn')) return;
                        e.stopPropagation();
                    }, true);

                    // --- Feature 0: History Interception (The "Nuclear Option" for Reels) ---
                    // User report: Clicking Reel Overlay triggers a URL change to /reel/... and deadlocks the page.
                    // Click interception is flaky due to cryptic DOM. Intercepting the Navigation itself is more robust.
                    try {
                        const originalPushState = history.pushState.bind(history);
                        const originalReplaceState = history.replaceState.bind(history);

                        const interceptNavigation = (original, state, title, url) => {
                            if (false && this.app.state.settings.autoOpenMediaInNewTab && typeof url === 'string') {
                                const isReelNav = url.includes('/reel/') || url.includes('/watch/');
                                const isCurrentReel = location.pathname.includes('/reel/') || location.pathname.includes('/watch/');

                                if (isReelNav && !isCurrentReel) {
                                    console.log('Antigravity: Intercepted Reel Navigation (History):', url);
                                    const fullUrl = url.startsWith('http') ? url : window.location.origin + (url.startsWith('/') ? '' : '/') + url;
                                    window.open(fullUrl, '_blank');

                                    // The React App might have already rendered the Overlay before calling pushState.
                                    // We must attempt to close it to restore the Feed view.
                                    const closeOverlay = () => {
                                        // 1. Try generic Close button in Dialog
                                        const closeBtn = document.querySelector(
                                            'div[role="dialog"] div[aria-label="Close"], ' +
                                            'div[role="dialog"] div[aria-label="關閉"], ' +
                                            'div[role="dialog"] div[aria-label="閉じる"]'
                                        );
                                        if (closeBtn) {
                                            closeBtn.click();
                                            // console.log('Antigravity: Closed Reel Overlay via Button');
                                            return true;
                                        }

                                        // 2. Try Escape Key (Standard for closing modals)
                                        const escEvent = new KeyboardEvent('keydown', {
                                            key: 'Escape', code: 'Escape',
                                            keyCode: 27, charCode: 0,
                                            bubbles: true, cancelable: true
                                        });
                                        document.dispatchEvent(escEvent);
                                        // console.log('Antigravity: Dispatched Escape Key');
                                    };

                                    // Attempt immediately and repeatedly in case of render delay
                                    setTimeout(closeOverlay, 0);
                                    setTimeout(closeOverlay, 300);
                                    setTimeout(closeOverlay, 1000);

                                    return; // Block navigation (URL update)
                                }
                            }
                            return original(state, title, url);
                        };

                        history.pushState = (state, title, url) => interceptNavigation(originalPushState, state, title, url);
                        history.replaceState = (state, title, url) => interceptNavigation(originalReplaceState, state, title, url);
                    } catch (e) {
                        console.error('Antigravity: Failed to hook history API', e);
                    }
                },

                /**
                 * Handles click events to intervene on links (tracking removal, auto-open media).
                 * @param {MouseEvent} event 
                 */
                handleClick(event) {
                    // Critical: Ignore Right Clicks (button 2) to allow Context Menu
                    if (event.button === 2) return;

                    // Ignore clicks inside specific UI elements
                    const target = event.target;
                    if (target.closest('[role="banner"], [role="navigation"], .gm-floating-nav')) return;

                    const settings = this.app.state.settings;

                    // --- Feature 0: Reel Overlay Prevention (Zone Defense v3: Semantic) ---
                    // Block ALL clicks in Reel Media Container unless Whitelisted.
                    if (settings.autoOpenMediaInNewTab && (event.type === 'click' || event.type === 'mousedown')) {
                        // Broaden container detection to support Feed (article) ONLY.
                        // REMOVED role="main" as it causes false positives on Profile/Watch pages.
                        // REMOVED role="dialog" as requested by User (Reel Viewer should behave natively).
                        const post = target.closest('div[role="article"]');

                        if (post) {

                            // Broaden search to include /videos/ and /watch/ as they often behave like Reels
                            const reelLinks = Array.from(post.querySelectorAll('a[href*="/reel/"], a[href*="/watch/"], a[href*="/videos/"]'));
                            const reelLink = reelLinks.find(a => !a.href.includes('comment_id') && !a.href.includes('reply_comment_id'));

                            // Feature: Dead Zone Toggle & Expand Prevention
                            // We proceed if we found a Link OR if there is a Video element (for Dead Zone toggle support)
                            const hasVideo = post.querySelector('video');

                            if (reelLink || hasVideo) {
                                // 1. Check Whitelist (Controls & Social)
                                const btn = target.closest('[role="button"], button, [role="link"], a');

                                // Robust Whitelist:
                                // 1.1 Script UI (Antigravity Buttons)
                                const isTargetGm = (target.classList && target.classList.contains('gm-inject-btn')) || (typeof target.className === 'string' && target.className.includes('gm-'));
                                const isBtnGm = btn && ((typeof btn.className === 'string' && btn.className.includes('gm-')) || (btn.classList && btn.classList.contains('gm-inject-btn')));
                                if (isTargetGm || isBtnGm) return;

                                // 3. REEL INTERCEPTION LOGIC (Semantic & Language Agnostic)

                                // 3.1 Priority Check: "Click to expand" Button (Force Open New Tab)
                                // We check aria-label (localized) as fallback, but rely on SVG Path (Language Agnostic).
                                const label = btn ? (btn.getAttribute('aria-label') || btn.textContent || '').toLowerCase() : '';
                                const expandPathSnippet = 'M16 5.414V8a1 1 0 1 0 2 0V4a2 2 0 0 0-2-2h-4';
                                const hasExpandSvg = btn && btn.querySelector(`path[d*="${expandPathSnippet}"]`);
                                const isClickToExpand = hasExpandSvg || label.includes('expand') || label.includes('點擊可展開');

                                if (isClickToExpand) {
                                    if (event.type === 'click') {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        const cleanUrl = this.cleanUrl(reelLink ? reelLink.href : window.location.href);
                                        this.app.utils.smartOpen(event, cleanUrl);
                                        // console.log('Antigravity: Intercepted Expand Button -> New Tab');
                                    }
                                    return;
                                }

                                // 3.2 Semantic Whitelist: Allow Native Controls (Title, Settings, Like, etc.)
                                // If it's an interactive element AND NOT the Expand button (handled above), we allow it.
                                const isInteractive =
                                    (btn) || // It's a button or link (Title, Profile, etc.)
                                    (target.closest('input, select, textarea, [role="slider"], [role="progressbar"], [role="menuitem"], [role="menuitemradio"], [role="menu"], [role="listbox"], [role="option"], [aria-haspopup="true"]'));

                                const isStructuralScope =
                                    target.closest('[role="toolbar"]') || // Stats/Action Bar
                                    target.closest('[role="banner"]') ||  // Header/Profile
                                    target.closest('[role="contentinfo"]'); // Footer

                                if (isInteractive || isStructuralScope) {
                                    // CRITICAL FIX: If the interactive element is a MEDIA LINK/PHOTO, do NOT return logic here.
                                    // We must allow it to fall through to the "Auto-Open in New Tab" logic below.
                                    const link = target.closest('a');
                                    if (link && /\/photo\/?\?|\/photos?\/|\/videos?\/|\/reel\/|\/watch\/|fbid=/.test(link.href)) {
                                        // Do not return; let it fall through to "Auto-open Media" logic
                                    } else {
                                        return; // Allow native Facebook control for non-media interactions (Like, Comment, Settings)
                                    }
                                }

                                // 3.3 Dead Zone: Background/Overlay Trigger -> Toggle Play/Pause
                                // Any click NOT caught above is a background click.
                                // We intercept this to prevent the Overlay from popping up, and instead Toggle Playback.
                                const isLink = target.closest('a'); // Should be covered by isInteractive, but double check
                                if (!isLink) {
                                    // RESTRICT DEAD ZONE TO VIDEO CONTAINER ONLY
                                    // We don't want to block clicks on text or white space outside the player.
                                    const video = post.querySelector('video');
                                    if (video) {
                                        // DEAD ZONE REFINEMENT:
                                        // 1. Exclude Text Leaves (already doing this)
                                        // 2. Exclude Structural Containers (Header/Footer/Comments)
                                        //    If the clicked target *contains* a Header or Footer element, it's likely the container of that section, NOT the video player.

                                        // Check if target is a text node wrapper
                                        const isText = target.closest('h2, h3, h4, span, p, [data-ad-rendering-role="story_message"]');
                                        if (isText) return;

                                        // Check if target is a Structural Container (Footer/Header/Comment Section)
                                        // This prevents clicking the "div" background of comments/stats from toggling video.
                                        // Note: We use querySelector because we are looking *down* from the target.
                                        if (target.querySelector) {
                                            const containsStructure = target.querySelector('h2, h3, h4') || // Header
                                                target.querySelector('[role="toolbar"]') || // Stats
                                                target.querySelector('[aria-label*="Comment"]') || // Comments
                                                target.querySelector('[aria-label*="Reply"]') ||
                                                target.querySelector('form'); // Input
                                            if (containsStructure) return;
                                        }

                                        event.preventDefault();
                                        event.stopPropagation();

                                        if (event.type === 'click') {
                                            if (video.paused) {
                                                video.play();
                                            } else {
                                                video.pause();
                                            }
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    const link = target.closest('a');
                    if (!link || !link.href) return;

                    // const settings = this.app.state.settings; // Already defined above
                    const isMedia = /\/photo\/?\?|\/photos?\/|\/videos?\/|\/reel\/|\/watch\/|fbid=/.test(link.href);

                    // Exclude album lists or profile tabs from being treated as single media
                    const isList = /\/photos_by\/|\/photos_albums/.test(link.href);

                    // --- Feature 1: Auto-open Media in New Tab (Prevents Login Wall) ---
                    // Only apply this intervention on LEFT CLICK (button 0)
                    if (event.button === 0 && settings.autoOpenMediaInNewTab && isMedia && !isList) {
                        // Prevent Facebook's default SPA navigation which triggers the login wall
                        event.preventDefault();
                        event.stopPropagation();

                        const cleanUrl = this.cleanUrl(link.href);
                        this.app.utils.smartOpen(event, cleanUrl);
                        return;
                    }

                    // --- Feature 2: Link Sanitization on Click ---
                    // Covers: Middle Click (button 1), Ctrl+Click, or target="_blank"
                    if (link.target === '_blank' || event.ctrlKey || event.metaKey || event.button === 1) {
                        const clean = this.cleanUrl(link.href);
                        if (clean !== link.href) link.href = clean;
                    }
                },

                /**
                 * Removes tracking parameters from the URL.
                 * @param {string} url - The URL to clean.
                 * @returns {string} The cleaned URL.
                 */
                cleanUrl(url) {
                    try {
                        const urlObj = new URL(url);

                        // Handle Facebook's "l.php" redirect wrapper
                        if (urlObj.hostname.includes('l.facebook.com') && urlObj.searchParams.has('u')) {
                            const realUrl = decodeURIComponent(urlObj.searchParams.get('u'));
                            return this.cleanUrl(realUrl); // Recursively clean the real URL
                        }

                        // Remove standard tracking parameters
                        // Uses shared utility logic from app.utils which uses app.config.TRACKING_PARAMS
                        this.app.utils.cleanUrlParams(urlObj);

                        // Specific cleanup for internal Facebook links
                        if (urlObj.hostname.includes('facebook.com')) {
                            // Keep only essential parameters
                            const keep = ['id', 'fbid', 'story_fbid', 'v', 'set', 'p', 'pb', 'q', 'query'];
                            const keys = Array.from(urlObj.searchParams.keys());
                            keys.forEach(key => {
                                if (!keep.includes(key) && !key.startsWith('qp')) {
                                    urlObj.searchParams.delete(key);
                                }
                            });
                        }
                        return urlObj.href;
                    } catch (e) {
                        return url;
                    }
                }
            },

            domCleaner: {
                app: null,
                /**
                 * Initializes the DOM cleaner to handle login dialogs and other obstructions.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    const C = this.app.config;
                    const T = this.app.state.T;
                    const FINGERPRINTS = [
                        { selector: `${C.SELECTORS.GLOBAL.DIALOG}:has([href*="/policies/cookies/"]) [role="button"][tabindex="0"]`, action: 'click' },
                        { selector: `${C.SELECTORS.GLOBAL.DIALOG}:has(${C.SELECTORS.GLOBAL.LOGIN_FORM})`, action: 'handle_login_modal' },
                    ];

                    const showDeadlockNotification = () => {
                        if (!this.app.state.settings.showDeadlockNotification) return;
                        this.app.modules.toastNotifier.show(T.notificationDeadlock, 'failure', 8000);
                    };

                    const runEngine = () => {
                        for (const fp of FINGERPRINTS) {
                            if (fp.setting && !this.app.state.settings[fp.setting]) continue;
                            document.querySelectorAll(fp.selector).forEach(el => {
                                if (el.dataset[C.PROCESSED_MARKER]) return;
                                el.dataset[C.PROCESSED_MARKER] = 'true';
                                switch (fp.action) {
                                    case 'click':
                                        el.click();
                                        break;
                                    case 'handle_login_modal':
                                        const closeButton = el.querySelector(C.SELECTORS.GLOBAL.CLOSE_BUTTON);
                                        if (closeButton) {
                                            closeButton.click();
                                        } else {
                                            const container = Array.from(document.querySelectorAll(C.SELECTORS.GLOBAL.MODAL_CONTAINER)).find(c => c.contains(el));
                                            if (container) {
                                                container.style.display = 'none';
                                                console.warn(`${C.LOG_PREFIX} Non-closable modal hidden. Page may be deadlocked.`);
                                                showDeadlockNotification();
                                            }
                                        }
                                        // Trigger restore after modal handling
                                        if (this.app.modules.scrollRestorer) this.app.modules.scrollRestorer.triggerRestore();
                                        break;
                                }
                            });
                        }
                    };

                    const throttledEngine = this.app.utils.throttle(runEngine, C.THROTTLE_DELAY);
                    const observer = new MutationObserver(throttledEngine);
                    observer.observe(document.documentElement, { childList: true, subtree: true });
                    throttledEngine();
                }
            },

            contentExpander: {
                app: null,
                /**
                 * Initializes the content expander to automatically click "Read more" buttons.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!this.app.state.settings.expandContentEnabled) return;

                    const C = this.app.config.TEXT_EXPANDER;

                    const runExpander = () => {
                        // Scope to article > button to prevent misclicks on sidebar/nav
                        const selector = `${C.SCOPE_SELECTOR} ${C.BUTTON_SELECTOR}`;
                        const candidates = document.querySelectorAll(selector);

                        candidates.forEach(btn => {
                            if (btn.hasAttribute(C.PROCESSED_ATTR)) return;
                            // Ensure visibility
                            if (btn.offsetParent === null) return;

                            // FIX: Avoid clicking "See more" on Reels (causes unintended navigation)
                            // Checks if the button is wrapped in a link to a Reel or Watch video
                            if (btn.closest('a[href*="/reel/"]') || btn.closest('a[href*="/watch/"]')) return;

                            const text = btn.textContent.trim();
                            if (C.TARGETS.includes(text)) {
                                btn.setAttribute(C.PROCESSED_ATTR, 'true');
                                btn.click();
                            }
                        });
                    };

                    const throttledRun = this.app.utils.throttle(runExpander, 500);
                    const observer = new MutationObserver(throttledRun);
                    observer.observe(document.body, { childList: true, subtree: true });
                    runExpander();
                }
            },

            contentAutoLoader: {
                app: null,
                state: {
                    isRunning: false,
                    targetCount: 0,
                    retryCount: 0,
                    lastScrollTime: 0,
                    mode: GM_getValue('autoLoadMode', 'incremental'), // 'incremental' or 'target'
                    batchCopyMode: GM_getValue('batchCopyMode', 'file') // 'file' or 'clipboard'
                },
                // Verified Selectors: Used to intelligently trigger loading
                selectors: [
                    { selector: 'a[href*="/more/"][role="button"]' },
                    { selector: '[role="progressbar"]' },
                    { selector: '[data-visualcompletion="loading-state"]' }, // Skeleton Loader
                    { selector: '.uiMorePagerLoader' },
                    { selector: 'div[role="button"]:not([aria-label*="Create"]):not([aria-label*="Search"])' }
                ],

                /**
                 * Initializes the content auto-loader.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    // Sync with Settings (Single Source of Truth)
                    if (this.app.state.settings.batchCopyMode) {
                        this.state.batchCopyMode = this.app.state.settings.batchCopyMode;
                    }
                },

                /**
                 * Toggles between incremental and target modes.
                 */
                toggleMode() {
                    this.state.mode = this.state.mode === 'incremental' ? 'target' : 'incremental';
                    GM_setValue('autoLoadMode', this.state.mode);

                    const T = this.app.state.T;
                    const batchSize = this.app.state.settings.autoLoadBatchSize || 20;
                    const msg = this.state.mode === 'incremental'
                        ? T.autoLoad_mode_incremental.replace('{n}', batchSize)
                        : T.autoLoad_mode_target.replace('{n}', batchSize);

                    this.app.modules.toastNotifier.show(msg, 'info');
                    this.app.modules.floatingNavigator.updateButtonTooltip(); // Update tooltip immediately
                },

                /**
                 * Toggles between clipboard and download modes for batch copy.
                 */
                toggleBatchCopyMode() {
                    const T = this.app.state.T;

                    // Enforce File mode for CSV
                    const currentFormat = this.app.state.settings.batchExportFormat;
                    if (currentFormat === 'csv') {
                        this.app.modules.toastNotifier.show(T.batchCopyMode_locked_csv || 'CSV format requires Download mode.', 'info');
                        return;
                    }

                    // Normalize: 'download' was old, now 'file'
                    let current = this.app.state.settings.batchCopyMode;
                    if (current === 'download') current = 'file';

                    const newMode = current === 'clipboard' ? 'file' : 'clipboard';

                    // Update State & Settings & Storage
                    this.state.batchCopyMode = newMode;
                    this.app.state.settings.batchCopyMode = newMode;
                    GM_setValue('batchCopyMode', newMode);

                    // Ensure strings exist for these messages
                    const msg = newMode === 'clipboard' ? (T.batchCopyMode_clipboard || 'Clipboard Mode') : (T.batchCopyMode_file || 'File Mode');

                    this.app.modules.toastNotifier.show(msg, 'info');
                    this.app.modules.floatingNavigator.updateBatchCopyTooltip(); // Update tooltip immediately
                },

                /**
                 * Starts the auto-loading process.
                 */
                async start() {
                    if (this.state.isRunning) return;

                    const T = this.app.state.T;
                    const currentPosts = this.app.modules.postNavigatorCore.getSortedPosts().length;
                    const batchSize = this.app.state.settings.autoLoadBatchSize || 20;

                    if (this.state.mode === 'target') {
                        if (currentPosts >= batchSize) {
                            this.app.modules.toastNotifier.show(T.autoLoad_target_reached.replace('{n}', batchSize), 'info');
                            return;
                        }
                        this.state.targetCount = batchSize;
                    } else {
                        // Incremental
                        this.state.targetCount = currentPosts + batchSize;
                    }

                    this.state.isRunning = true;
                    this.state.retryCount = 0;
                    this.state.initialCount = currentPosts; // Track start point for progress ring

                    this.app.modules.floatingNavigator.updateButtonState('start');
                    this.app.modules.toastNotifier.show(
                        T.autoLoad_status_loading.replace('{current}', currentPosts).replace('{target}', this.state.targetCount),
                        'success',
                        4000,
                        'autoLoadStatus'
                    );

                    await this.loop();
                },

                /**
                 * Stops the auto-loading process.
                 * @param {string} [reasonKey=''] - Localization key for the stop reason.
                 */
                stop(reasonKey = '') {
                    this.state.isRunning = false;
                    this.app.modules.floatingNavigator.updateButtonState('stop');

                    if (reasonKey) {
                        const T = this.app.state.T;
                        // User Requirement: Success = Green, Stopped = Red (Failure)
                        const type = reasonKey.includes('success') ? 'success' : 'failure';
                        this.app.modules.toastNotifier.show(T[reasonKey] || reasonKey, type, 4000, 'autoLoadStatus');
                    }
                },

                /**
                 * Main auto-loading loop.
                 */
                async loop() {
                    const C = this.app.config.AUTO_LOADER;
                    const T = this.app.state.T;

                    while (this.state.isRunning) {
                        // 1. Safety Check
                        if (this.isDeadlocked()) {
                            this.stop('autoLoad_status_deadlock');
                            return;
                        }

                        const currentCount = this.app.modules.postNavigatorCore.getSortedPosts().length;

                        // UI Update: Progress Ring
                        // Logic: Calculate "Session Progress" instead of "Absolute Progress"
                        // range = target - initial. progress = (current - initial) / range.
                        const initial = this.state.initialCount || 0;
                        const sessionTarget = this.state.targetCount;
                        const progressCurrent = Math.max(0, currentCount - initial);
                        const progressTotal = Math.max(1, sessionTarget - initial); // Prevent divide by zero

                        this.app.modules.floatingNavigator.updateProgress(progressCurrent, progressTotal);

                        // Check if target reached
                        if (currentCount >= this.state.targetCount) {
                            this.stop('autoLoad_status_success');
                            return;
                        }

                        // 2. Cooldown
                        const timeSinceLastScroll = Date.now() - this.state.lastScrollTime;
                        if (timeSinceLastScroll < C.MIN_COOLDOWN) {
                            await this.app.utils.delay(C.MIN_COOLDOWN - timeSinceLastScroll);
                        }

                        // 3. Update UI
                        this.app.modules.toastNotifier.show(
                            T.autoLoad_status_loading.replace('{current}', currentCount).replace('{target}', this.state.targetCount),
                            'success', 2000, 'autoLoadStatus'
                        );

                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        this.state.lastScrollTime = Date.now();

                        // 4. Active Trigger
                        this.triggerLoad();

                        // 5. Wait for content
                        const result = await this.waitForNewContent(currentCount);

                        if (result === 'loaded') {
                            this.state.retryCount = 0;
                        } else if (result === 'timeout') {
                            this.state.retryCount++;
                            this.app.modules.toastNotifier.show(
                                T.autoLoad_status_retrying.replace('{count}', this.state.retryCount).replace('{max}', C.MAX_RETRIES),
                                'failure', 2000, 'autoLoadStatus'
                            );

                            if (this.state.retryCount >= C.MAX_RETRIES) {
                                this.stop('autoLoad_status_success');
                                return;
                            }
                        }
                    }
                },

                triggerLoad() {
                    for (const target of this.selectors) {
                        const elements = document.querySelectorAll(target.selector);
                        const el = elements.length > 0 ? elements[elements.length - 1] : null;

                        if (el && el.offsetParent !== null) {
                            try {
                                const mouseEvent = new MouseEvent('mouseover', {
                                    bubbles: true,
                                    cancelable: true
                                });
                                el.dispatchEvent(mouseEvent);
                                el.click();
                            } catch (e) {
                                // Ignore errors
                            }
                            return;
                        }
                    }
                },

                waitForNewContent(baselineCount) {
                    const C = this.app.config.AUTO_LOADER;
                    return new Promise((resolve) => {
                        const startTime = Date.now();
                        const poller = setInterval(() => {
                            if (!this.state.isRunning) { clearInterval(poller); resolve('stopped'); return; }

                            const newCount = this.app.modules.postNavigatorCore.getSortedPosts().length;
                            if (newCount > baselineCount) { clearInterval(poller); resolve('loaded'); }

                            if (Date.now() - startTime > C.MAX_WAIT_TIME) { clearInterval(poller); resolve('timeout'); }
                        }, C.POLL_INTERVAL);
                    });
                },

                isDeadlocked() {
                    const C = this.app.config.SELECTORS;
                    const U = this.app.utils;
                    const dialog = document.querySelector(C.GLOBAL.DIALOG);
                    if (dialog && U.isVisible(dialog)) {
                        if (dialog.querySelector(C.GLOBAL.LOGIN_FORM)) return true;
                    }
                    const noSnippet = document.querySelector('div[data-nosnippet]');
                    if (noSnippet && U.isVisible(noSnippet)) return true;
                    const forms = document.querySelectorAll(C.GLOBAL.LOGIN_FORM);
                    for (const form of forms) {
                        if (U.isVisible(form) && !form.closest('[role="banner"]')) return true;
                    }
                    return false;
                },

                async copyAllPosts() {
                    const T = this.app.state.T;
                    const settings = this.app.state.settings;
                    const posts = this.app.modules.postNavigatorCore.getSortedPosts();
                    if (posts.length === 0) {
                        this.app.modules.toastNotifier.show(T.batchCopy_empty, 'failure');
                        return;
                    }

                    // UX Improvement: Delayed "Processing" toast
                    let progressToast = null;
                    const progressTimer = setTimeout(() => {
                        progressToast = this.app.modules.toastNotifier.show(T.batchCopy_start.replace('{count}', posts.length), 'success');
                    }, 500);

                    const PHT = this.app.modules.postHeaderTools;
                    const exportFormat = settings.batchExportFormat || 'text';
                    const collectedData = [];
                    const textParts = [];
                    let successCount = 0;
                    const BATCH_SEPARATOR = '\n\n═══════════════════════════════════════════════════════════════\n\n';

                    // 1. Extraction Loop
                    for (const post of posts) {
                        const data = await PHT.extractPostData(post, {
                            forceRawLink: true, // Batch mode prefers speed over full async resolution per post? Or wait? 
                            // PHT.extractPostData handles smart link fetch if settings enabled.
                            // If user wants JSON, they probably want links.
                            // But `extractPostData` does resolving if settings enabled.
                            // We pass forceRawLink: true to speed up if 'text' usually?
                            // Actually, original code had forceRawLink: true. Let's keep it for compatibility/speed unless refined.
                            // Wait, if I want accurate IDs, I might need smart links.
                            // But let's stick to original behavior: forceRawLink: true implies scraping what's there.
                            includeOrder: settings.copy_meta_order,
                            isBatch: true // Hint for processing
                        });

                        if (exportFormat === 'text') {
                            const formatted = PHT.formatPostData(data, 'text');
                            if (formatted) {
                                textParts.push(formatted);
                                successCount++;
                            }
                        } else {
                            // JSON or CSV
                            if (data) {
                                if (exportFormat === 'csv') {
                                    collectedData.push(PHT.formatPostData(data, 'csv'));
                                } else {
                                    collectedData.push(data);
                                }
                                successCount++;
                            }
                        }
                    }

                    // 2. Formatting & Assembly
                    let finalContent = '';
                    let mimeType = 'text/plain;charset=utf-8';
                    let extension = 'txt';
                    const pageTitle = document.title.replace(/ \| Facebook$/, '').replace(/^\(\d+\) /, '');
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hour = String(now.getHours()).padStart(2, '0');
                    const minute = String(now.getMinutes()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}_${hour}-${minute}`;

                    const safeTitle = pageTitle.replace(/[\\/:*?"<>|]/g, '_').trim();
                    const filename = `${safeTitle}_Batch_${dateStr}`; // Extension added later

                    if (exportFormat === 'text') {
                        let bodyText = textParts.join(BATCH_SEPARATOR);

                        if (settings.batchCopy_includeHeader) {
                            const cleanUrl = window.location.origin + window.location.pathname;
                            // Localized nice format for inside the file
                            const nowStr = now.toLocaleString(navigator.language, { hour12: false });
                            const header = `═══════════════════════════════════════════════════════════════\n【 BATCH EXPORT SUMMARY 】\nSource: ${pageTitle}\nURL:    ${cleanUrl}\nTime:   ${nowStr}\nCount:  ${successCount} Posts\n═══════════════════════════════════════════════════════════════\n\n`;
                            finalContent = header + bodyText;
                        } else {
                            finalContent = bodyText;
                        }
                        extension = 'txt';
                        mimeType = 'text/plain;charset=utf-8';
                    } else if (exportFormat === 'json') {
                        finalContent = JSON.stringify(collectedData, null, 2);
                        mimeType = 'application/json;charset=utf-8';
                        extension = 'json';
                    } else if (exportFormat === 'csv') {
                        // Simple CSV generation
                        if (collectedData.length > 0) {
                            const headers = Object.keys(collectedData[0]);
                            const rows = collectedData.map(row => headers.map(fieldName => {
                                let val = row[fieldName] || '';
                                if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                                    val = `"${val.replace(/"/g, '""')}"`;
                                }
                                return val;
                            }).join(','));
                            // BOM for Excel
                            finalContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
                        } else {
                            finalContent = '';
                        }
                        mimeType = 'text/csv;charset=utf-8';
                        extension = 'csv';
                    }

                    try {
                        clearTimeout(progressTimer);
                        if (progressToast && typeof progressToast.remove === 'function') progressToast.remove();

                        // 3. Output Action (Clipboard vs File)
                        if (settings.batchCopyMode === 'file') {
                            // ... File Download ...
                            const BOM = (exportFormat === 'csv' || exportFormat === 'json' || exportFormat === 'text') ? '\uFEFF' : '';
                            // Avoid double BOM if CSV logic already added it
                            const contentBlob = finalContent.startsWith('\uFEFF') ? finalContent : (BOM + finalContent);

                            const blob = new Blob([contentBlob], { type: mimeType });
                            const url = URL.createObjectURL(blob);

                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${filename}.${extension}`;
                            link.style.display = 'none';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            setTimeout(() => URL.revokeObjectURL(url), 100);

                            const msg = T.batchCopy_file_success || 'Exported to file successfully.';
                            this.app.modules.toastNotifier.show(msg, 'success');
                        } else {
                            // ... Clipboard Copy ...
                            // Remove BOM for clipboard if present, as it's not needed for paste
                            const contentToCopy = finalContent.startsWith('\uFEFF') ? finalContent.substring(1) : finalContent;

                            if (typeof GM_setClipboard === 'function') {
                                GM_setClipboard(contentToCopy);
                            } else {
                                // Fallback? 
                                navigator.clipboard.writeText(contentToCopy);
                            }

                            const msg = T.batchCopy_success
                                .replace('{count}', successCount)
                                .replace('{chars}', finalContent.length);
                            this.app.modules.toastNotifier.show(msg, 'success');
                        }
                    } catch (error) {
                        console.error(`${this.app.config.LOG_PREFIX} Batch Copy Error:`, error);
                        this.app.modules.toastNotifier.show('Batch export failed.', 'failure');
                    }
                },
            }, // End contentAutoLoader

            errorRecovery: {
                app: null,
                /**
                 * Initializes the error recovery module to monitor and fix broken pages.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!this.app.state.settings.errorRecoveryEnabled) return;

                    const run = () => {
                        const C = this.app.config.ERROR_RECOVERY;
                        const selector = C.RELOAD_BUTTON_LABELS.map(label => `div[role="button"][aria-label="${label}"]`).join(', ');
                        const btn = document.querySelector(selector);
                        if (!btn) return;
                        const currentUrl = window.location.href;
                        let state = { url: '', count: 0 };
                        try {
                            const stored = sessionStorage.getItem(C.STORAGE_KEY);
                            if (stored) state = JSON.parse(stored);
                        } catch (e) { }

                        if (state.url !== currentUrl) state = { url: currentUrl, count: 0 };
                        if (state.count >= C.MAX_RETRIES) {
                            console.warn(`${this.app.config.LOG_PREFIX} [ErrorRecovery] Max retries reached for this URL.`);
                            return;
                        }

                        console.log(`${this.app.config.LOG_PREFIX} [ErrorRecovery] Error page detected. Retrying...`);
                        state.count++;
                        sessionStorage.setItem(C.STORAGE_KEY, JSON.stringify(state));
                        btn.click();

                        setTimeout(() => {
                            if (document.querySelector(selector)) window.location.reload();
                        }, 1000);
                    };

                    const throttledRun = this.app.utils.throttle(run, 1000);
                    const observer = new MutationObserver(throttledRun);
                    observer.observe(document.body, { childList: true, subtree: true });
                    run();
                }
            },

            transparencyActions: {
                app: null,
                container: null,
                interval: null,
                /**
                 * Initializes the transparency actions module (Transparency & Ad Library buttons).
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!this.app.state.settings.transparencyButtonsEnabled) return;
                    this.updateUI();
                    this.interval = setInterval(() => {
                        const currentPath = window.location.pathname;
                        if (currentPath !== this.app.state.currentPath) {
                            this.app.state.currentPath = currentPath;
                            this.app.state.cachedPageID = null;
                            this.updateUI();
                        }
                        const exclude = ['/watch', '/marketplace', '/gaming', '/events', '/groups', '/messages', '/ads'];
                        if (exclude.some(ex => currentPath.startsWith(ex)) || currentPath === '/') return;
                        if (this.app.state.cachedPageID) return;
                        const id = this._extractPageID();
                        if (id) {
                            this.app.state.cachedPageID = id;
                            this.updateUI();
                        }
                    }, 1000);
                },

                /**
                 * Cleans up resources when the module is disabled or re-initialized.
                 */
                deinit() {
                    if (this.container) this.container.remove();
                    if (this.interval) clearInterval(this.interval);
                },

                /**
                 * Extracts the page ID from the page source or embedded JSON.
                 * @returns {string|null} The Page ID or null if not found.
                 * @private
                 */
                _extractPageID() {
                    const scripts = document.querySelectorAll('script[type="application/json"]');
                    const reAssociated = /"associated_page_id":"(\d+)"/;
                    const reDelegate = /"delegate_page":\{[^{}]*"id":"(\d+)"/;

                    for (const script of scripts) {
                        const content = script.textContent;
                        if (!content || content.includes('timeline_list_feed_units')) continue;
                        const matchAssoc = content.match(reAssociated);
                        if (matchAssoc && matchAssoc[1] && matchAssoc[1] !== '0') return matchAssoc[1];
                        if (content.includes('profile_header_renderer') || content.includes('profile_tile_sections')) {
                            const matchDel = content.match(reDelegate);
                            if (matchDel && matchDel[1] && matchDel[1] !== '0') return matchDel[1];
                        }
                    }
                    return null;
                },

                /**
                 * Updates the floating button UI based on the current page state.
                 */
                updateUI() {
                    if (!this.container) {
                        const T = this.app.state.T;
                        const C = this.app.config.ADS_LIB;
                        const U = this.app.utils;

                        const btnAds = this._createBtn('📢', T.tooltipAds, (e) => {
                            if (this.app.state.cachedPageID) {
                                localStorage.setItem(C.KEY_TARGET_ID, this.app.state.cachedPageID);
                                const url = `https://www.facebook.com/ads/library/?active_status=active&view_all_page_id=${this.app.state.cachedPageID}`;
                                U.smartOpen(e, url);
                            }
                        });

                        const btnInt = this._createBtn('🛡️', T.tooltipTransparency, (e) => {
                            if (this.app.state.cachedPageID) {
                                localStorage.setItem(C.KEY_INT_ACTION, 'true');
                                const loc = window.location;
                                let targetUrl = '';
                                if (loc.pathname.includes('profile.php')) {
                                    const params = new URLSearchParams(loc.search);
                                    targetUrl = `${loc.origin}${loc.pathname}?id=${params.get('id')}&sk=about_profile_transparency`;
                                } else if (loc.pathname.startsWith('/people/') || loc.pathname.startsWith('/p/')) {
                                    const cleanPath = loc.pathname.replace(/\/$/, '');
                                    targetUrl = `${loc.origin}${cleanPath}/?sk=about_profile_transparency`;
                                } else {
                                    const rootPath = `/${loc.pathname.split('/')[1]}`;
                                    targetUrl = `${loc.origin}${rootPath}/about_profile_transparency`;
                                }
                                U.smartOpen(e, targetUrl);
                            }
                        });

                        const _addContextBlock = (btn) => {
                            btn.addEventListener('contextmenu', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            });
                        };
                        _addContextBlock(btnAds);
                        _addContextBlock(btnInt);

                        this.container = U.createStyledElement('div', {}, {
                            className: 'gm-transparency-container',
                            children: [btnInt, btnAds]
                        });
                        document.body.appendChild(this.container);
                    }
                    if (this.app.state.cachedPageID) this.container.style.display = 'flex';
                    else this.container.style.display = 'none';
                },

                /**
                 * Helper to create a floating transparency button.
                 * @private
                 */
                _createBtn(icon, title, onClick) {
                    return this.app.utils.createStyledElement('button', {}, {
                        className: 'gm-transparency-btn', title: title, innerHTML: icon,
                        on: {
                            mouseup: (e) => { e.currentTarget.style.transform = 'scale(1)'; onClick(e); },
                            mousedown: (e) => { if (e.button === 1) e.preventDefault(); e.currentTarget.style.transform = 'scale(0.95)'; },
                            mouseover: (e) => e.currentTarget.style.backgroundColor = '#f0f2f5',
                            mouseleave: (e) => e.currentTarget.style.backgroundColor = 'white'
                        }
                    });
                }
            },

            adsLibraryHandler: {
                app: null,
                /**
                 * Initializes the Ads Library handler to automate clicking through the library interface.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!window.location.pathname.includes('/ads/library/')) return;
                    const C = this.app.config.ADS_LIB;
                    const urlParams = new URLSearchParams(window.location.search);
                    const currentID = urlParams.get('view_all_page_id');
                    const targetID = localStorage.getItem(C.KEY_TARGET_ID);

                    if (currentID && targetID && currentID === targetID) {
                        console.log(`${this.app.config.LOG_PREFIX} [AdsLib] ID Match. Auto-nav initiating...`);
                        localStorage.removeItem(C.KEY_TARGET_ID);
                        this._initAdBlockerRemover();
                        setTimeout(() => {
                            let attempts = 0;
                            const autoClicker = setInterval(() => {
                                attempts++;
                                const allLinks = document.querySelectorAll('div[role="link"]');
                                const parentMap = new Map();
                                allLinks.forEach(link => {
                                    const parent = link.parentElement;
                                    if (!parentMap.has(parent)) parentMap.set(parent, []);
                                    parentMap.get(parent).push(link);
                                });
                                let targetGroup = null;
                                for (const [parent, children] of parentMap.entries()) {
                                    if (children.length >= 3) {
                                        targetGroup = children;
                                        break;
                                    }
                                }
                                if (targetGroup && targetGroup[1]) {
                                    clearInterval(autoClicker);
                                    targetGroup[1].click();
                                } else if (attempts > C.MAX_ATTEMPTS) {
                                    clearInterval(autoClicker);
                                }
                            }, C.POLL_INTERVAL);
                        }, C.INITIAL_DELAY);
                    }
                },

                /**
                 * Removes blocking dialogs in the Ads Library.
                 * @private
                 */
                _initAdBlockerRemover() {
                    let hasHandledWarning = false;
                    let observer = null;
                    const cleanDialogs = () => {
                        if (hasHandledWarning) return;
                        const dialogs = document.querySelectorAll('div[role="dialog"]');
                        for (const dialog of dialogs) {
                            if (dialog.dataset.gmProcessed) continue;
                            if (!dialog.querySelector('input, select, textarea')) {
                                const hasHeading = dialog.querySelector('[role="heading"]');
                                const buttons = dialog.querySelectorAll('[role="button"]');
                                if (hasHeading && buttons.length > 0) {
                                    console.log(`${this.app.config.LOG_PREFIX} [AdsLib] Removing blocking dialog.`);
                                    const lastBtn = buttons[buttons.length - 1];
                                    if (lastBtn) lastBtn.click();
                                    dialog.dataset.gmProcessed = 'true';
                                    setTimeout(() => {
                                        if (document.body.contains(dialog) && dialog.style.display !== 'none') {
                                            dialog.style.display = 'none';
                                            const layer = dialog.closest('.x1n2onr6');
                                            if (layer) layer.style.display = 'none';
                                        }
                                    }, 300);
                                    hasHandledWarning = true;
                                    if (observer) { observer.disconnect(); observer = null; }
                                }
                            }
                        }
                    };
                    observer = new MutationObserver(cleanDialogs);
                    observer.observe(document.body, { childList: true, subtree: true });
                    cleanDialogs();
                }
            },

            internalTransparencyHandler: {
                app: null,
                /**
                 * Initializes the internal transparency handler to expanded transparency sections.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!window.location.href.includes('about_profile_transparency')) return;
                    const C = this.app.config.ADS_LIB;
                    const T_CONF = this.app.config.TRANSPARENCY;

                    if (localStorage.getItem(C.KEY_INT_ACTION) === 'true') {
                        console.log(`${this.app.config.LOG_PREFIX} [IntTrans] Expanding details...`);
                        localStorage.removeItem(C.KEY_INT_ACTION);
                        setTimeout(() => {
                            let attempts = 0;
                            const autoExpander = setInterval(() => {
                                attempts++;
                                const selector = T_CONF.SEE_ALL_BUTTONS.map(l => `div[role="button"][aria-label="${l}"]`).join(', ');
                                const btn = document.querySelector(selector);
                                if (btn) {
                                    clearInterval(autoExpander);
                                    btn.click();
                                } else if (attempts > C.MAX_ATTEMPTS) {
                                    clearInterval(autoExpander);
                                }
                            }, C.POLL_INTERVAL);
                        }, C.INITIAL_DELAY);
                    }
                }
            },

            idRevealer: {
                app: null,
                activeBadge: null,
                targetH1: null,

                /**
                 * Initializes the ID Revealer module.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    // Gatekeeper
                    if (!this.app.state.settings.idRevealerEnabled) return;

                    // Observe DOM to inject triggers when H1 appears
                    const observer = new MutationObserver(this.app.utils.throttle(() => this.inject(), 500));
                    observer.observe(document.body, { childList: true, subtree: true });

                    window.addEventListener('resize', () => this.updatePosition());
                    window.addEventListener('scroll', () => this.updatePosition(), true);
                    window.addEventListener('historyChange', () => this.closeBadge());
                },

                /**
                 * Injects the ID revealer trigger into the profile header (H1).
                 */
                inject() {
                    // Exclude Group pages to prevent extracting random member IDs
                    if (/\/groups\//.test(window.location.pathname)) return;

                    const h1 = document.querySelector('h1:not([data-gm-id-revealer])');
                    if (!h1) return;

                    const T = this.app.state.T;
                    h1.dataset.gmIdRevealer = 'true';

                    // Visual cues for clickability
                    h1.style.cursor = 'pointer';
                    h1.title = T.idRevealerTooltip;

                    h1.addEventListener('mouseover', () => {
                        h1.style.textDecoration = 'underline';
                        h1.style.textDecorationColor = 'rgba(0,0,0,0.3)';
                    });
                    h1.addEventListener('mouseout', () => {
                        h1.style.textDecoration = 'none';
                    });

                    // Click: Toggle Badge
                    h1.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        if (this.activeBadge && this.targetH1 === h1) {
                            this.closeBadge();
                        } else {
                            this.showBadge(h1);
                        }
                    });
                },

                /**
                 * Extracts User/Page/Meta IDs from the page metadata and source.
                 * @returns {Map<string, string>} A map of label to ID.
                 */
                extractIds() {
                    const ids = { metaId: null, userId: null, pageId: null };

                    // 1. Meta Tags
                    const metaSelectors = ['meta[property="al:android:url"]', 'meta[property="al:ios:url"]'];
                    for (const sel of metaSelectors) {
                        const meta = document.querySelector(sel);
                        if (meta && meta.content) {
                            const match = meta.content.match(/fb:\/\/profile\/(\d+)/);
                            if (match && match[1]) ids.metaId = match[1];
                        }
                    }
                    if (!ids.metaId) {
                        const metaApp = document.querySelector('meta[name="apple-itunes-app"]');
                        if (metaApp && metaApp.content) {
                            const match = metaApp.content.match(/app-argument=fb:\/\/profile\/(\d+)/);
                            if (match && match[1]) ids.metaId = match[1];
                        }
                    }

                    // 2. JSON Scan
                    const scripts = document.querySelectorAll('script[type="application/json"]');
                    const reUserID = /"userID":"(\d+)"/;
                    const reDelegate = /"delegate_page":\{[^{}]*"id":"(\d+)"/;
                    const reAssoc = /"associated_page_id":"(\d+)"/;

                    for (const script of scripts) {
                        const content = script.textContent;
                        if (!content) continue;

                        if (!ids.userId) {
                            const mUser = content.match(reUserID);
                            if (mUser && mUser[1] !== '0') ids.userId = mUser[1];
                        }
                        if (!ids.pageId) {
                            const mDel = content.match(reDelegate);
                            if (mDel && mDel[1] && mDel[1] !== '0') ids.pageId = mDel[1];
                            else {
                                const mAssoc = content.match(reAssoc);
                                if (mAssoc && mAssoc[1] && mAssoc[1] !== '0') ids.pageId = mAssoc[1];
                            }
                        }
                        if (ids.userId && ids.pageId) break;
                    }

                    // Consolidate results with specific labels
                    const T = this.app.state.T;
                    const result = new Map();

                    if (ids.metaId) result.set(T.id_label_meta, ids.metaId);
                    if (ids.userId && ids.userId !== ids.metaId) result.set(T.id_label_user, ids.userId);
                    if (ids.pageId && ids.pageId !== ids.metaId && ids.pageId !== ids.userId) result.set(T.id_label_page, ids.pageId);

                    return result;
                },

                /**
                 * Generates a link to the profile/page based on user preferences.
                 * @param {string} id - The ID to link to.
                 * @returns {string} The formatted URL.
                 */
                generateLink(id) {
                    const format = this.app.state.settings.idRevealerLinkFormat;
                    if (format === 'classic') return `https://www.facebook.com/profile.php?id=${id}`;
                    if (format === 'username') {
                        const url = new URL(window.location.href);
                        url.search = '';
                        return url.href.replace(/\/$/, '');
                    }
                    // 'userid' format: Standard User ID URL
                    return `https://www.facebook.com/${id}`;
                },

                /**
                 * Shows the ID badge for the given element.
                 * @param {HTMLElement} h1 - The profile header element.
                 */
                showBadge(h1) {
                    this.closeBadge(); // Close existing if any

                    const idMap = this.extractIds();
                    if (idMap.size === 0) return;

                    this.targetH1 = h1;
                    this.createBadgeUI(h1, idMap);
                    this.updatePosition();
                },

                /**
                 * Helper to get text content excluding children like the verified badge.
                 * @private
                 */
                _extractText(node) {
                    let text = '';
                    for (const child of node.childNodes) {
                        if (child.nodeType === Node.TEXT_NODE) {
                            text += child.textContent;
                        }
                    }
                    return text.trim();
                },

                /**
                 * Creates the badge UI and appends it to the DOM.
                 * @param {HTMLElement} h1 - The profile header.
                 * @param {Map} idMap - The extracted IDs.
                 * @private
                 */
                createBadgeUI(h1, idMap) {
                    const U = this.app.utils;
                    const T = this.app.state.T;

                    const container = U.createStyledElement('div', {
                        position: 'fixed', zIndex: this.app.config.UI.Z_INDEX.ID_BADGE, backgroundColor: '#FFFFFF',
                        borderRadius: '8px', boxShadow: '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0, 0, 0, 0.1)', padding: '12px',
                        minWidth: this.app.config.UI.DIMENSIONS.BADGE_MIN_WIDTH, maxWidth: this.app.config.UI.DIMENSIONS.BADGE_MAX_WIDTH, display: 'flex', flexDirection: 'column', gap: '8px',
                        fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif', fontSize: '13px', color: '#050505',
                        opacity: '0', transition: 'opacity 0.1s ease-out', pointerEvents: 'auto'
                    }, { className: 'gm-id-revealer-badge' });

                    // --- Header: Title + Close ---
                    const header = U.createStyledElement('div', {
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: '4px', borderBottom: '1px solid #DADDE1', paddingBottom: '8px'
                    });
                    header.append(
                        U.createStyledElement('span', { fontWeight: '600', color: '#65676B' }, { textContent: 'ID Revealer' }),
                        U.createStyledElement('div', {
                            cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }, {
                            innerHTML: '<svg viewBox="0 0 24 24" width="16" height="16" fill="#65676B"><path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 0 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z"></path></svg>',
                            on: {
                                click: (e) => { e.stopPropagation(); this.closeBadge(); },
                                mouseover: (e) => e.currentTarget.style.backgroundColor = '#F0F2F5',
                                mouseout: (e) => e.currentTarget.style.backgroundColor = 'transparent'
                            }
                        })
                    );
                    container.appendChild(header);

                    // --- Helper: Create Row ---
                    const createRow = (label, text, copyMsgLabel = null, isLink = false) => {
                        const row = U.createStyledElement('div', {
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.1s'
                        }, {
                            on: {
                                click: () => {
                                    GM_setClipboard(text);
                                    const msg = T.copy_success_generic.replace('{label}', copyMsgLabel || label);
                                    this.app.modules.toastNotifier.show(msg, 'success');
                                },
                                mouseover: (e) => e.currentTarget.style.backgroundColor = '#F0F2F5',
                                mouseout: (e) => e.currentTarget.style.backgroundColor = 'transparent'
                            }
                        });

                        row.append(
                            U.createStyledElement('span', { color: '#65676B', fontWeight: '500', marginRight: '8px' }, { textContent: label }),
                            U.createStyledElement('span', {
                                color: isLink ? '#1877F2' : '#050505', fontWeight: isLink ? '400' : '600',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', direction: 'ltr'
                            }, { textContent: text, title: text })
                        );
                        return row;
                    };

                    // --- Content: Profile Name ---
                    const profileName = this._extractText(h1);
                    if (profileName) {
                        container.appendChild(createRow(T.profile_name_label, profileName, T.profile_name_label));
                    }

                    // --- Content: IDs ---
                    idMap.forEach((id, label) => {
                        container.appendChild(createRow(label, id, label));
                    });

                    // --- Content: Profile URL ---
                    const mainId = idMap.values().next().value;
                    if (mainId) {
                        const linkUrl = this.generateLink(mainId);
                        container.appendChild(createRow(T.profile_url_label, linkUrl, T.profile_url_label, true));

                        // --- Footer: Copy All ---
                        const footer = U.createStyledElement('div', { marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #DADDE1', textAlign: 'center' });
                        const copyAllBtn = U.createStyledElement('button', {
                            border: 'none', background: 'none', color: '#1877F2', fontWeight: '600', cursor: 'pointer', fontSize: '13px', width: '100%', padding: '4px'
                        }, {
                            textContent: T.id_copy_all,
                            on: {
                                click: (e) => {
                                    e.stopPropagation();
                                    const lines = [];
                                    if (profileName) lines.push(`${T.profile_name_label}: ${profileName}`);
                                    idMap.forEach((val, key) => lines.push(`${key}: ${val}`));
                                    lines.push(`${T.profile_url_label}: ${linkUrl}`);
                                    GM_setClipboard(lines.join('\n'));
                                    this.app.modules.toastNotifier.show(T.all_copied, 'success');
                                },
                                mouseover: (e) => e.currentTarget.style.textDecoration = 'underline',
                                mouseout: (e) => e.currentTarget.style.textDecoration = 'none'
                            }
                        });
                        footer.appendChild(copyAllBtn);
                        container.appendChild(footer);
                    }

                    document.body.appendChild(container);
                    container.offsetHeight; // force reflow
                    container.style.opacity = '1';
                    this.activeBadge = container;
                },

                /**
                 * Updates the badge position relative to the header.
                 */
                updatePosition() {
                    if (!this.activeBadge || !this.targetH1) return;

                    const rect = this.targetH1.getBoundingClientRect();
                    const badgeRect = this.activeBadge.getBoundingClientRect();

                    let top = rect.bottom + 8;
                    let left = rect.left;
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    if (left + badgeRect.width > viewportWidth) left = viewportWidth - badgeRect.width - 20;
                    if (left < 0) left = 10;
                    if (top + badgeRect.height > viewportHeight) top = rect.top - badgeRect.height - 8;

                    this.activeBadge.style.top = `${top}px`;
                    this.activeBadge.style.left = `${left}px`;
                },

                /**
                 * Closes the currently active badge.
                 */
                closeBadge() {
                    if (this.activeBadge) {
                        this.activeBadge.remove();
                        this.activeBadge = null;
                        this.targetH1 = null;
                    }
                }
            },

            postNavigatorCore: {
                app: null,
                currentPostIndex: -1,
                isRetrying: false,
                continuousNavInterval: null,
                /**
                 * Initializes the core post navigator.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                },

                /**
                 * Retrieves all valid posts in the timeline, sorted by position.
                 * @returns {HTMLElement[]} Array of post elements.
                 */
                getSortedPosts() {
                    const posts = Array.from(document.querySelectorAll('[role="article"][aria-posinset]')).filter(p => !p.closest(this.app.config.SELECTORS.GLOBAL.DIALOG));
                    posts.sort((a, b) => parseInt(a.getAttribute('aria-posinset'), 10) - parseInt(b.getAttribute('aria-posinset'), 10));
                    return posts;
                },

                /**
                 * Starts continuous auto-scrolling navigation in a specific direction.
                 * @param {string} direction - 'next' or 'prev'.
                 */
                startContinuousNavigation(direction) {
                    this.stopContinuousNavigation();
                    this.updateActivePost(direction === 'next' ? this.currentPostIndex + 1 : this.currentPostIndex - 1, 'manual');
                    const interval = this.app.state.settings.continuousNavInterval;
                    this.continuousNavInterval = setInterval(() => {
                        this.updateActivePost(direction === 'next' ? this.currentPostIndex + 1 : this.currentPostIndex - 1, 'manual');
                    }, interval);
                },

                /**
                 * Stops any active continuous navigation.
                 */
                stopContinuousNavigation() {
                    if (this.continuousNavInterval) {
                        clearInterval(this.continuousNavInterval);
                        this.continuousNavInterval = null;
                    }
                },

                /**
                 * Updates the currently active post index and handles scrolling/highlighting.
                 * @param {number} index - The new index to set as active.
                 * @param {string} [source='manual'] - Source of navigation ('manual', 'timeline', etc).
                 */
                updateActivePost(index, source = 'manual', forceSmooth = null) {
                    const posts = this.getSortedPosts();
                    if (posts.length === 0) return;

                    if (index >= posts.length) {
                        if (source === 'manual') {
                            this.triggerLoadAndRetry();
                            return;
                        }
                        index = posts.length - 1;
                    }
                    if (index < 0) index = 0;

                    if (index === this.currentPostIndex && source !== 'manual') return;

                    this.currentPostIndex = index;
                    const targetPost = posts[this.currentPostIndex];

                    this.app.state.lastActivePost = targetPost;

                    // 1. Update Visual Highlight (Feed) - Conditional
                    const C = this.app.config;
                    const settings = this.app.state.settings;

                    // Always remove old highlight to keep clean
                    const currentHighlighted = document.querySelector(`.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}`);
                    if (currentHighlighted && currentHighlighted !== targetPost) {
                        currentHighlighted.classList.remove(C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS);
                    }

                    // Only add new highlight if setting is enabled
                    if (targetPost && settings.navHighlighterEnabled) {
                        targetPost.classList.add(C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS);

                        // Apply Heatmap Border if enabled
                        if (settings.heatmapBorderEnabled && this.app.modules.timelineNavigator) {
                            const heat = this.app.modules.timelineNavigator.getHeatLevel(targetPost);
                            if (heat > 0) targetPost.dataset.heat = heat;
                            else delete targetPost.dataset.heat;
                        } else {
                            delete targetPost.dataset.heat;
                        }
                    }

                    // 2. Update Timeline UI (If module active)
                    if (this.app.modules.timelineNavigator) {
                        this.app.modules.timelineNavigator.setActive(index);
                    }

                    // 3. Scroll Page (If source requires it)
                    if (source === 'manual' || source === 'timeline') {
                        this.app.utils.scrollToElement(targetPost, forceSmooth);
                    }
                },

                /**
                 * Triggers page scroll to load more posts and retries navigation.
                 */
                triggerLoadAndRetry() {
                    if (this.isRetrying) return;
                    this.isRetrying = true;
                    const initialPostCount = this.getSortedPosts().length;

                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

                    const startTime = Date.now();
                    const retryInterval = setInterval(() => {
                        const newPostCount = this.getSortedPosts().length;
                        if (newPostCount > initialPostCount) {
                            clearInterval(retryInterval);
                            this.isRetrying = false;
                            this.updateActivePost(initialPostCount, 'manual');
                            return;
                        }
                        if (Date.now() - startTime > this.app.config.TIMEOUTS.MAX_RETRY_DURATION) {
                            clearInterval(retryInterval);
                            this.isRetrying = false;
                            console.log(`${this.app.config.LOG_PREFIX} Failed to load new posts.`);
                        }
                    }, this.app.config.TIMEOUTS.RETRY_INTERVAL);
                },

                /**
                 * Navigates to the next or previous post relative to current.
                 * @param {string} direction - 'next' or 'prev'.
                 */
                navigateToPost(direction) {
                    this.updateActivePost(direction === 'next' ? this.currentPostIndex + 1 : this.currentPostIndex - 1, 'manual');
                }
            },

            // --- Timeline Navigator Module ---
            timelineNavigator: {
                app: null,
                container: null,
                observer: null,
                isManualScrolling: false,
                scrollTimeout: null,
                cachedMaxLogScore: 0,
                scrollTimeout: null,
                cachedMaxLogScore: 0,
                lastUrl: '',
                sortMode: 'time', // 'time' or 'heat'

                TOTAL_REACTION_KEYWORDS: [
                    '所有心情：', 'All reactions:', 'すべてのリアクション:'
                ],

                /**
                 * Initializes the timeline navigator.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    this.lastUrl = window.location.href;
                    if (!this.checkScope()) return;
                    this.createUI();
                    this.initObserver();
                    this.startWatcher();
                    this.refresh();
                },

                /**
                 * Checks if the Timeline Navigator should be active on this page.
                 * @returns {boolean} True if allowed.
                 */
                checkScope() {
                    const path = window.location.pathname;
                    const U = this.app.utils;

                    // 1. Strict Home Exclusion
                    if (path === '/' || path === '/home.php') return false;

                    // 2. Use isFeedPage for broad rejection (handles posts, watch, etc.)
                    if (!U.isFeedPage()) return false;

                    // 3. Supplemental Rejection (Things isFeedPage misses or we want to be stricter about)
                    // Note: isFeedPage already covers 'watch', 'marketplace', 'posts', 'video', 'reel', 'events', 'photo'
                    const extraExclude = [
                        '/search', '/ad_center', '/notes', '/ads', '/help', '/privacy',
                        '/settings', '/saved', '/bookmarks'
                    ];
                    if (extraExclude.some(p => path.startsWith(p))) return false;

                    return true;
                },

                /**
                 * Cleans up the timeline navigator.
                 */
                deinit() {
                    if (this.container) this.container.remove();
                    if (this.observer) this.observer.disconnect();
                },

                /**
                 * Creates the timeline container in the DOM.
                 */
                createUI() {
                    const U = this.app.utils;
                    this.container = U.createStyledElement('div', {}, { id: 'gm-timeline-container' });

                    // Fixed Header for Sort Button
                    this.header = U.createStyledElement('div', {}, { className: 'gm-timeline-header' });

                    // Scroll Area for Rows
                    this.scrollArea = U.createStyledElement('div', {}, { className: 'gm-timeline-scroll-area' });

                    // Create Sort Button immediately
                    this.sortBtn = this.app.utils.createStyledElement('button', {}, {
                        className: 'gm-timeline-sort-btn',
                        innerHTML: this.sortMode === 'time' ? '⏱️' : '🔥',
                        title: this.app.state.T.timelineSortTooltip || 'Switch Sort Mode',
                        on: {
                            click: (e) => {
                                e.stopPropagation();
                                this.sortMode = this.sortMode === 'time' ? 'heat' : 'time';
                                this.sortBtn.innerHTML = this.sortMode === 'time' ? '⏱️' : '🔥';
                                this.refresh(true); // Force refresh to re-sort
                            }
                        }
                    });
                    this.header.appendChild(this.sortBtn);

                    this.container.appendChild(this.header);
                    this.container.appendChild(this.scrollArea);
                    document.body.appendChild(this.container);
                },
                /**
                 * Refreshes the timeline UI, rebuilding points based on current posts.
                 */
                refresh(force = false) {
                    // Safety check for scope on every refresh (URL might change in SPA)
                    if (!this.checkScope()) {
                        if (this.container) this.container.style.display = 'none';
                        return;
                    }

                    if (!this.container) {
                        this.createUI();
                    }
                    this.container.style.display = 'flex';

                    if (this.lastUrl !== window.location.href) {
                        this.cachedMaxLogScore = 0;
                        this.lastUrl = window.location.href;
                    }

                    const Core = this.app.modules.postNavigatorCore;
                    const settings = this.app.state.settings;
                    const posts = Core.getSortedPosts();
                    if (!force && this.scrollArea.childElementCount === posts.length) return;

                    this.scrollArea.innerHTML = '';

                    // Button is now in static header, no need to recreate

                    const useHeatmap = settings.timelineHeatmapEnabled;
                    let displayItems = posts.map((post, index) => ({
                        post,
                        originalIndex: index,
                        score: useHeatmap ? this.getPostScore(post) : 0,
                        logScore: 0
                    }));

                    if (useHeatmap) {
                        let currentBatchMax = 0;
                        displayItems.forEach(item => {
                            const logVal = Math.log10(item.score + 1);
                            item.logScore = logVal;
                            if (logVal > currentBatchMax) currentBatchMax = logVal;
                        });

                        if (currentBatchMax > this.cachedMaxLogScore) {
                            this.cachedMaxLogScore = currentBatchMax;
                        }
                    }


                    if (this.sortMode === 'heat') {
                        displayItems.sort((a, b) => b.score - a.score);
                    }

                    displayItems.forEach((item, displayIndex) => {
                        const { post, originalIndex, score, logScore } = item;


                        let labelContent = '';
                        let idxLabel = '';
                        let isMilestone = false;

                        if (this.sortMode === 'heat') {
                            labelContent = `<span class="gm-label-time" style="font-weight:600;color:#E41E3F">${this.formatMetric(score)}</span>`;
                            idxLabel = displayIndex + 1; // Rank
                            isMilestone = idxLabel <= 3; // Highlight Top 3
                        } else {
                            labelContent = `<span class="gm-label-time">${this.extractTime(post)}</span>`;
                            idxLabel = originalIndex + 1; // Sequence
                            isMilestone = idxLabel % 10 === 0;
                        }

                        const row = this.app.utils.createStyledElement('div', {}, { className: `gm-timeline-row ${isMilestone ? 'milestone' : ''}` });

                        if (this.sortMode === 'time' && originalIndex === Core.currentPostIndex) {
                            row.classList.add('active');
                        }

                        const info = this.app.utils.createStyledElement('div', {}, {
                            className: 'gm-timeline-info',
                            innerHTML: `${labelContent}<span class="gm-label-idx ${isMilestone ? 'milestone-text' : ''}">#${idxLabel}</span>`
                        });

                        const dot = this.app.utils.createStyledElement('div', {}, { className: 'gm-timeline-dot' });

                        if (useHeatmap && this.cachedMaxLogScore > 1) {
                            const ratio = logScore / this.cachedMaxLogScore;
                            const thresholds = this.app.config.UI.HEATMAP_THRESHOLDS;
                            let heatLevel = 0;
                            for (let i = 0; i < thresholds.length; i++) {
                                if (ratio > thresholds[i]) {
                                    heatLevel = 9 - i;
                                    break;
                                }
                            }
                            if (heatLevel > 0) dot.dataset.heat = heatLevel;
                        }

                        row.appendChild(info);
                        row.appendChild(dot);

                        row.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.handleDotClick(originalIndex); // Jump to original post

                            // Manually highlight this row in Heat Mode
                            if (this.sortMode === 'heat') {
                                Array.from(this.scrollArea.children).forEach(child => child.classList.remove('active'));
                                row.classList.add('active');
                            }
                        });

                        this.scrollArea.appendChild(row);
                        if (this.observer && this.sortMode === 'time') this.observer.observe(post);
                    });
                },

                /**
                 * Calculates the heat level (1-9) for a specific post based on current metrics.
                 * @param {HTMLElement} post - The post element.
                 * @returns {number} Heat level (1-9) or 0.
                 */
                getHeatLevel(post) {
                    if (!this.app.state.settings.timelineHeatmapEnabled) return 0;
                    if (this.cachedMaxLogScore <= 1) return 0; // Not enough data or low heat

                    const score = this.getPostScore(post);
                    if (score <= 0) return 0;

                    const logScore = Math.log10(score + 1);
                    const ratio = logScore / this.cachedMaxLogScore;
                    const thresholds = this.app.config.UI.HEATMAP_THRESHOLDS;

                    for (let i = 0; i < thresholds.length; i++) {
                        if (ratio > thresholds[i]) return 9 - i;
                    }
                    return 1; // Minimum non-zero heat
                },

                /**
                 * Calculates an engagement score for a post to determine heatmap color.
                 * @param {HTMLElement} postEl
                 * @returns {number} The calculated score.
                 */
                getPostScore(postEl) {
                    let score = 0;
                    const weights = this.app.config.UI.HEATMAP_WEIGHTS || { REACTION: 1, COMMENT: 2, SHARE: 3 };

                    // 1. Total Reactions (Counts as 1x usually)
                    const totalReactions = this.extractTotalReactions(postEl);
                    if (totalReactions > 0) {
                        score += totalReactions * weights.REACTION;
                    } else {
                        // Fallback: Aria Label
                        const ariaNodes = postEl.querySelectorAll('[aria-label]');
                        for (const node of ariaNodes) {
                            if (node.tagName === 'A') continue;
                            const label = node.getAttribute('aria-label');
                            if (label && /[:：]\s*[\d,.]+/.test(label)) {
                                score += this.parseMetric(label) * weights.REACTION;
                                break;
                            }
                        }
                    }

                    // 2. Deep Interactions (Comments & Shares)
                    // Now returns an object { comments: number, shares: number }
                    const deepStats = this.extractIconStats(postEl);
                    score += (deepStats.comments * weights.COMMENT);
                    score += (deepStats.shares * weights.SHARE);

                    return score;
                },

                /**
                 * Extracts total reaction count from the post footer.
                 * Uses heuristics to find standalone numbers that look like metrics.
                 * @private
                 * @param {HTMLElement} postEl - The post element.
                 * @returns {number} The total reaction count.
                 * @example
                 * // Matches: "1.2K", "3,400", "5萬"
                 * // Ignored: "2 Comments" (via Sprite check), "John Doe"
                 */
                /**
                 * Extracts total reaction count from the post footer.
                 * @private
                 * @param {HTMLElement} postEl - The post element.
                 * @returns {number} The total reaction count.
                 */
                extractTotalReactions(postEl) {
                    // Sometimes "All reactions" text exists separately
                    let maxVal = 0;
                    const divs = postEl.querySelectorAll('div, span');
                    divs.forEach(div => {
                        // Optimization & Safety check
                        if (div.childElementCount > 0) return; // Leaf nodes preferred
                        if (div.closest('[data-ad-rendering-role="story_message"]')) return;
                        const closestArticle = div.closest('[role="article"]');
                        if (closestArticle && closestArticle !== postEl) return;

                        // EXCLUSION: If this element is part of a button that has a specific Comment/Share icon, ignore it.
                        // Ideally checking for "Comment" text logic is good, but sprites are safer for mislabeled buttons.
                        // We check the parent button or container for the specific icon.
                        const btn = div.closest('[role="button"]');
                        if (btn) {
                            const icon = btn.querySelector('i[data-visualcompletion="css-img"]');
                            if (icon && icon.style.backgroundPosition) {
                                const match = icon.style.backgroundPosition.match(/0px\s+(-?\d+)px/);
                                if (match) {
                                    const yPos = parseInt(match[1], 10);
                                    const SPRITES = this.app.config.CONSTANTS.SPRITES;
                                    // Uses defined offsets for Comment/Share buttons to exclude them from "Total" calculation
                                    if (Math.abs(yPos - SPRITES.COMMENT) < SPRITES.TOLERANCE ||
                                        Math.abs(yPos - SPRITES.SHARE) < SPRITES.TOLERANCE ||
                                        Math.abs(yPos - SPRITES.SHARE_ALT) < SPRITES.TOLERANCE) return;
                                }
                            }
                        }

                        const text = div.innerText;
                        if (!text || text.length > 20) return; // Short labels only

                        // Check for specific keywords not normally in content
                        // e.g., "Comments", "Shares", "Reactions" (localized)
                        // This uses a looser heuristic: if it looks JUST like a metric
                        const unitGroup = this.app.config.CONSTANTS.REGEX_PARTS.UNIT_GROUP;
                        const metricRegex = new RegExp(`^[\\d.,${unitGroup.slice(1, -1)}\\s]+$`);
                        if (metricRegex.test(text)) {
                            const val = this.parseMetric(text);
                            if (val > maxVal) maxVal = val;
                        }
                    });
                    return maxVal;
                },

                /**
                 * Extracts deep interaction stats (comments/shares) using sprite position analysis.
                 * Identifies Comment (-1037px) and Share (-1054px/-1071px) icons via background-position.
                 * @private
                 * @param {HTMLElement} postEl - The post element.
                 * @returns {object} The breakdown { comments, shares }.
                 */
                extractIconStats(postEl) {
                    let totalComments = 0;
                    let totalShares = 0;

                    // Look for SVG icons that usually denote Likes/Comments
                    // Exclude icons inside the "Content Body" or "Nested Comments"
                    // Strategy: Find all relevant icons, then filter valid ones.
                    const icons = postEl.querySelectorAll('svg, i, [role="img"]');
                    icons.forEach(icon => {
                        // EXCLUSION 1: Skip if inside post content body
                        if (icon.closest('[data-ad-rendering-role="story_message"]')) return;

                        // EXCLUSION 2: Skip if inside a nested reply/comment (sub-article), unless it's the post itself
                        const closestArticle = icon.closest('[role="article"]');
                        if (closestArticle && closestArticle !== postEl) return;

                        // Check if it looks like a metric label container
                        const parent = icon.parentElement;
                        if (!parent) return;

                        // SPRITE CHECK: Only allow if it matches Comment or Share sprites
                        // This prevents random icons from being counted
                        let isComment = false;
                        let isShare = false;

                        if (icon.tagName === 'I' && icon.getAttribute('data-visualcompletion') === 'css-img' && icon.style.backgroundPosition) {
                            const match = icon.style.backgroundPosition.match(/0px\s+(-?\d+)px/);
                            if (match) {
                                const yPos = parseInt(match[1], 10);
                                const SPRITES = this.app.config.CONSTANTS.SPRITES;
                                if (Math.abs(yPos - SPRITES.COMMENT) < SPRITES.TOLERANCE) isComment = true;
                                else if (Math.abs(yPos - SPRITES.SHARE) < SPRITES.TOLERANCE ||
                                    Math.abs(yPos - SPRITES.SHARE_ALT) < SPRITES.TOLERANCE) isShare = true;
                            }
                        }

                        if (!isComment && !isShare) return;

                        // Try to find text siblings or parent's text
                        const text = parent.innerText || parent.parentElement?.innerText || '';
                        // Simple regex check: does it contain a number?
                        if (/\d/.test(text)) {
                            // Extract numbers
                            const unitGroup = this.app.config.CONSTANTS.REGEX_PARTS.UNIT_GROUP;
                            // Matches: "1.5K", "300"
                            const extractRegex = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(${unitGroup}?)`, 'g');
                            const matches = text.match(extractRegex);
                            if (matches) {
                                matches.forEach(m => {
                                    const val = this.parseMetric(m);
                                    if (isComment) totalComments += val;
                                    else if (isShare) totalShares += val;
                                });
                            }
                        }
                    });
                    return { comments: totalComments, shares: totalShares };
                },

                // Strict Single-Number Check to prevent grabbing parent rows
                /**
                 * Finds a nearby text node containing a number (e.g., stats count).
                 * @private
                 * @param {HTMLElement} element - The starting element (usually an icon).
                 * @returns {string} The found text, or empty string.
                 */
                findNearbyNumber(element) {
                    let p = element.parentElement;
                    for (let i = 0; i < 4; i++) { // Increased depth limit slightly
                        if (!p) break;
                        const text = p.textContent.trim();

                        // Check how many distinct number groups exist in this text
                        // e.g., "1.9K 153" has 2 matches. "2K" has 1 match.
                        const matches = text.match(/(\d+(?:[.,]\d+)?)\s*([KkMm萬億万]?)/g);

                        // Only accept if exactly ONE number group is found
                        // This forces the loop to ignore the "Total + Comment + Share" wrapper row
                        if (matches && matches.length === 1) {
                            // Secondary check: Ensure the text is CLEAN (mostly digits/units)
                            // Allows for small noise but rejects large blocks of text
                            if (/^[\d.,KkMm萬億万\s]+$/.test(text)) {
                                return text;
                            }
                        }
                        p = p.parentElement;
                    }
                    return '';
                },

                /**
                 * Parses a metric string (e.g. "1.5K") into a number.
                 * @param {string} str 
                 * @returns {number} The parsed value.
                 */
                /**
                 * Formats a number into a compact metric string (e.g. 1.2k).
                 * @param {number} num 
                 * @returns {string} The formatted string.
                 */
                formatMetric(num) {
                    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                    return num.toString();
                },

                parseMetric(str) {
                    if (!str) return 0;
                    const match = str.match(/(\d+(?:[.,]\d+)?)\s*([KkMm萬億万]?)/);
                    if (!match) return 0;
                    let num = parseFloat(match[1].replace(/,/g, ''));
                    const unit = match[2].toLowerCase();
                    if (unit === 'k') num *= 1000;
                    else if (unit === 'm') num *= 1000000;
                    else if (unit === '萬' || unit === '万') num *= 10000;
                    else if (unit === '億') num *= 100000000;
                    return Math.floor(num);
                },

                extractTime(postEl) {
                    const links = Array.from(postEl.querySelectorAll('span > a[role="link"]'));
                    for (const link of links) {
                        if (link.closest('h2, h3, h4, strong, b')) continue;
                        if (link.closest('[data-ad-rendering-role="profile_name"]')) continue;
                        if (link.closest('[data-ad-rendering-role="story_message"]')) continue;
                        if (link.closest('ul, li')) continue;

                        const text = link.textContent.trim();
                        if (!text) continue;
                        if (text.length > 50) continue;

                        const enMonthRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+/i;
                        if (enMonthRegex.test(text)) return text;

                        if (/^\d/.test(text)) {
                            const shortUnitRegex = /^\d+\s*([mhdswy]|分鐘|小時|天|分|時間|日)$/;
                            if (shortUnitRegex.test(text)) return text;
                            if (/[年月]/.test(text) || text.includes(' at ') || text.includes(',')) return text;
                        }
                    }
                    return '';
                },

                /**
                 * Initializes the intersection observer to track post visibility.
                 * @private
                 */
                initObserver() {
                    const CONF = this.app.config.CONSTANTS.OBSERVER;
                    const options = {
                        root: null,
                        rootMargin: CONF.ROOT_MARGIN,
                        threshold: CONF.THRESHOLD
                    };
                    this.observer = new IntersectionObserver((entries) => {
                        if (this.isManualScrolling) return;
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const Core = this.app.modules.postNavigatorCore;
                                const posts = Core.getSortedPosts();
                                const idx = posts.indexOf(entry.target);
                                if (idx !== -1) {
                                    Core.updateActivePost(idx, 'scroll');
                                }
                            }
                        });
                    }, options);
                },

                /**
                 * Sets the active timeline point.
                 * @param {number} index - The index of the active post.
                 */
                setActive(index) {
                    if (!this.scrollArea) return;
                    if (this.sortMode === 'heat') return; // Disable auto-active in Heat Mode

                    const rows = this.scrollArea.children;
                    // Skip the first child (button) <- OLD logic, now rows are direct children of scrollArea
                    const rowOffset = 0;

                    for (let i = rowOffset; i < rows.length; i++) {
                        // rows[i] corresponds to post index i - rowOffset
                        if ((i - rowOffset) === index) {
                            rows[i].classList.add('active');
                            this.ensureVisible(rows[i]);
                        } else {
                            rows[i].classList.remove('active');
                        }
                    }
                },

                /**
                 * Ensures the active row is visible within the timeline container.
                 */
                ensureVisible(row) {
                    if (this.container.matches(':hover')) return;
                    const cRect = this.scrollArea.getBoundingClientRect();
                    const rRect = row.getBoundingClientRect();
                    // Padding checks
                    if (rRect.top < cRect.top + 20 || rRect.bottom > cRect.bottom - 20) {
                        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                },

                /**
                 * Handles clicks on timeline dots to navigate to the corresponding post.
                 * @param {number} index - The index of the post to navigate to.
                 */
                handleDotClick(index) {
                    this.isManualScrolling = true;
                    // Force instant scrolling (forceSmooth = false) if in Heat Mode to prevent motion sickness
                    const forceSmooth = this.sortMode === 'heat' ? false : null;
                    this.app.modules.postNavigatorCore.updateActivePost(index, 'timeline', forceSmooth);
                    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
                    this.scrollTimeout = setTimeout(() => { this.isManualScrolling = false; }, this.app.config.TIMEOUTS.SCROLL_LOCK);

                    // Manually highlight UI if in Heat Mode (since scroll observer is skipped or might jump)
                    if (this.sortMode === 'heat') {
                        // Logic moved to click listener inside refresh to capture closure reference
                    }
                },

                startWatcher() {
                    const observer = new MutationObserver(this.app.utils.throttle(() => this.refresh(), 500));
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            },

            scrollRestorer: {
                app: null,
                /**
                 * Initializes the scroll restorer module.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    // Listen for ANY click (Close button or Backdrop)
                    document.body.addEventListener('click', this.handleInteraction.bind(this), true);
                    // Listen for ESC key
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') this.handleInteraction();
                    }, true);
                },

                /**
                 * Triggers scroll restoration specifically when modal disappears.
                 */
                triggerRestore() {
                    const lastPost = this.app.state.lastActivePost;
                    // Verify post still exists and is in DOM
                    if (lastPost && document.body.contains(lastPost)) {
                        // Restore instantly (false) to snap back to position
                        // Pass 'scrollRestorerAlignment' to override the default navigation alignment
                        this.app.utils.scrollToElement(lastPost, false, this.app.state.settings.scrollRestorerAlignment);
                    }
                },


                /**
                 * Handles user interactions that might close a modal.
                 */
                handleInteraction() {
                    // 1. Check if a dialog currently exists
                    const dialogSelector = this.app.config.SELECTORS.GLOBAL.DIALOG;
                    const dialogBefore = document.querySelector(dialogSelector);

                    if (dialogBefore && this.app.utils.isVisible(dialogBefore)) {
                        // 2. Wait a short moment to let FB process the event (remove/hide modal)
                        setTimeout(() => {
                            const dialogAfter = document.querySelector(dialogSelector);
                            // 3. If dialog is gone (or hidden), trigger restore
                            if (!dialogAfter || !this.app.utils.isVisible(dialogAfter)) {
                                this.triggerRestore();
                            }
                        }, 150); // Slight buffer for DOM updates
                    }
                }
            },

            autoUnmuter: {
                app: null,
                /**
                 * Initializes the auto-unmuter module to handle video volume.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    const nativeVolumeSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume').set;
                    const nativeMutedSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted').set;

                    // Strategy A: Direct Property Manipulation (For Feed/Timeline)
                    const attemptUnmute = (video) => {
                        if (!this.app.state.settings.autoUnmuteEnabled) return;
                        if (video instanceof HTMLVideoElement && (video.muted || video.volume === 0)) {
                            const targetVolume = this.app.state.settings.autoUnmuteVolume / 100;
                            // Use native setters to bypass potential proxy traps
                            nativeMutedSetter.call(video, false);
                            nativeVolumeSetter.call(video, targetVolume);
                            if (video.audioTracks?.length > 0) {
                                for (let track of video.audioTracks) track.enabled = true;
                            }
                            video.dispatchEvent(new Event('volumechange', { bubbles: true }));
                        }
                    };

                    // Strategy B: UI Interaction (For Standalone Video Pages: Reels/Watch)
                    // Uses SVG Fingerprinting to find the "Muted" icon and clicks the parent button.
                    const clickUnmuteButton = () => {
                        // SVG Path for "Muted Speaker" icon (Language Agnostic)
                        const mutedIcon = document.querySelector('path[d^="M11.5 3.162"]');
                        if (mutedIcon) {
                            const btn = mutedIcon.closest('[role="button"], button');
                            if (btn) {
                                btn.click();
                                // console.log('[FB Login Wall Remover] Auto-unmuted via UI Interaction');
                            }
                        }
                    };

                    // --- Dispatcher ---
                    const isVideoPage = /\/reel\/|\/watch\/|\/videos\//.test(window.location.pathname);

                    if (isVideoPage) {
                        // MODE 1: Standalone Video Pages
                        // Fix for User Request: "Volume Preset Only". No Auto-Unmute, No Force Play.
                        // We strictly respect Facebook's native behavior (Auto-play + Muted).
                        // We only pre-set the volume so it's at the correct level *when* the user manually unmutes.

                        const applyVolumePreset = () => {
                            if (this.app.state.settings.autoUnmuteEnabled) {
                                const targetVolume = this.app.state.settings.autoUnmuteVolume / 100;
                                const video = document.querySelector('video');

                                // Only apply volume if video exists.
                                // CRITICAL: DO NOT touch 'muted' property.
                                if (video && Math.abs(video.volume - targetVolume) > 0.01) {
                                    video.volume = targetVolume;
                                }
                            }
                        };

                        // Check a few times to catch the video loading
                        [500, 1500, 3000, 5000].forEach(delay => {
                            setTimeout(applyVolumePreset, delay);
                        });

                    } else {
                        // MODE 2: Feed / Timeline
                        // 1. Use Polling + Direct Manipulation (Legacy robust method for Feed)
                        document.addEventListener('play', (e) => attemptUnmute(e.target), true);

                        const observer = new MutationObserver(mutations => {
                            mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
                                if (node.nodeName === 'VIDEO') attemptUnmute(node);
                                else if (node.querySelectorAll) node.querySelectorAll('video').forEach(attemptUnmute);
                            }));
                        });
                        observer.observe(document.body, { childList: true, subtree: true });

                        const checkInterval = setInterval(() => document.querySelectorAll('video').forEach(attemptUnmute), 2000);

                        // Manual Mute Button Click Handling (Feed Only)
                        document.addEventListener('click', (event) => {
                            if (event.target.closest('[aria-label*="mute" i], [aria-label*="sound" i], [role="button"][aria-pressed]')) {
                                setTimeout(() => document.querySelectorAll('video').forEach(attemptUnmute), 150);
                            }
                        }, true);

                        window.addEventListener('beforeunload', () => {
                            clearInterval(checkInterval);
                            observer.disconnect();
                        });
                    }
                }
            },

            postNumbering: {
                app: null,
                /**
                 * Initializes the post numbering module.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!this.app.state.settings.postNumberingEnabled) return;
                    const processNewPosts = () => {
                        if (!this.app.utils.isFeedPage()) return;
                        const posts = document.querySelectorAll('[role="article"][aria-posinset]:not([data-gm-numbered])');
                        posts.forEach(articleElement => {
                            if (articleElement.closest(this.app.config.SELECTORS.GLOBAL.DIALOG)) return;
                            const postNumber = articleElement.getAttribute('aria-posinset');
                            if (!postNumber) return;
                            articleElement.style.position = 'relative';
                            const numberTag = this.app.utils.createStyledElement('span', {}, { className: 'gm-post-number', textContent: postNumber });
                            articleElement.appendChild(numberTag);
                            articleElement.dataset.gmNumbered = 'true';
                        });
                    };
                    const throttledProcess = this.app.utils.throttle(processNewPosts, 300);
                    const observer = new MutationObserver(throttledProcess);
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    throttledProcess();
                }
            },

            searchBar: {
                app: null,
                elements: {},
                state: {
                    isPinned: true,
                    isAtTop: true,
                    showTimer: null,
                    wasDialogVisible: false,
                    suppressShow: false,
                    isUpdating: false,
                },
                icons: {
                    pinned: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#1877F2" d="M16 11V5h1.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H8v6l-2 3v2h5v6l1 1 1-1v-6h5v-2l-2-3z"></path></svg>`,
                    unpinned: `<svg viewBox="0 0 24 24" width="20" height="20"><g transform="rotate(180 12 12)"><path d="M16 11V5h1.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H8v6l-2 3v2h5v6l1 1 1-1v-6h5v-2l-2-3z" style="fill:none; stroke:#65676B; stroke-width:1.5px;"></path></g></svg>`,
                    watch: `<svg viewBox="0 0 24 24" width="20" height="20" style="fill:none; stroke:#65676B; stroke-width:1.8px; stroke-linecap:round; stroke-linejoin:round;"><rect x="2.5" y="5.5" width="19" height="13" rx="3" ry="3"></rect><path d="M10 9l5 3-5 3V9z"></path></svg>`,
                    events: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"></path></svg>`,
                    marketplace: `<svg viewBox="2 2 28 28" width="20" height="20"><path fill="#65676B" d="M28.908,12.571a.952.952,0,0,0-.1-.166,3.146,3.146,0,0,0-.118-.423c-.006-.016-.012-.032-.02-.048L25.917,5.6A1,1,0,0,0,25,5H7a1,1,0,0,0-.917.6l-2.77,6.381a2.841,2.841,0,0,0,0,2.083A4.75,4.75,0,0,0,6,16.609V27a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V16.609a4.749,4.749,0,0,0,2.687-2.543,2.614,2.614,0,0,0,.163-.655A1.057,1.057,0,0,0,28.908,12.571ZM13,26V20h2v6Zm4,0V20h2v6Zm7,0H21V19a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v7H8V17a5.2,5.2,0,0,0,4-1.8,5.339,5.339,0,0,0,8,0A5.2,5.2,0,0,0,24,17Zm2.837-12.7A3.015,3.015,0,0,1,24,15a2.788,2.788,0,0,1-3-2.5,1,1,0,0,0-2,0A2.788,2.788,0,0,1,16,15a2.788,2.788,0,0,1-3-2.5,1,1,0,0,0-2,0A2.788,2.788,0,0,1,8,15a3.016,3.016,0,0,1-2.838-1.7.836.836,0,0,1,0-.571L7.656,7H24.344l2.477,5.7A.858.858,0,0,1,26.837,13.3Z"/></svg>`,
                    search: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1.002 1.002 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"></path></svg>`,
                    settings: `<svg viewBox="0 0 24 24" width="20" height="20"><g transform="scale(0.85) translate(2.1, 2.1)"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84a.484.484 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.74 8.87c-.12.19-.06.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path></g></svg>`
                },
                getOccupiedHeight() {
                    if (this.state.isPinned && this.elements.toolbar && this.elements.toolbar.style.visibility !== 'hidden') {
                        return this.elements.toolbar.offsetHeight;
                    }
                    return 0;
                },

                /**
                 * Initializes the Search Bar module.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!this.app.state.settings.hideUselessElements) return;

                    this.state.isPinned = GM_getValue('isSearchBarPinned', true);
                    this.elements = this._createUI();
                    document.body.append(this.elements.toolbar, this.elements.hoverTrigger, this.elements.hoverHint);
                    this._bindEvents();

                    setTimeout(() => {
                        this.updateVisibility();
                        this._updatePinState();
                    }, this.app.config.TIMEOUTS.INITIAL_DELAY);
                },
                /**
                 * Retrieves the current page name from the h1 element.
                 * @returns {string|null} The page name or null if not found.
                 * @private
                 */
                _getCurrentPageName() {
                    const h1 = document.querySelector('h1');
                    if (!h1) return null;
                    let pageName = '';
                    for (const node of h1.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE) pageName += node.nodeValue;
                    }
                    return pageName.trim();
                },

                /**
                 * Creates the search bar UI elements.
                 * @returns {Object} map of created elements.
                 * @private
                 */
                _createUI() {
                    const U = this.app.utils;
                    const elements = {};
                    const shortcutsGroup = this._createShortcutsGroup(elements);
                    const searchComponent = this._createSearchComponent(elements);
                    const toolsGroup = this._createToolsGroup(elements);

                    elements.toolbar = U.createStyledElement('div', {}, { className: 'gm-toolbar', children: [shortcutsGroup, searchComponent, toolsGroup] });
                    elements.hoverTrigger = U.createStyledElement('div', {}, { className: 'gm-hover-trigger' });
                    elements.hoverHint = U.createStyledElement('div', {}, { className: 'gm-hover-hint' });

                    return elements;
                },
                _createShortcutsGroup(elements) {
                    const T = this.app.state.T;
                    const U = this.app.utils;
                    const shortcuts = [
                        { key: 'watch', url: '/watch/', icon: this.icons.watch, tooltip: T.shortcutWatch },
                        { key: 'events', url: '/events/', icon: this.icons.events, tooltip: T.shortcutEvents },
                        { key: 'marketplace', url: '/marketplace/', icon: this.icons.marketplace, tooltip: T.shortcutMarketplace },
                    ];
                    const buttons = shortcuts.map(sc => {
                        const button = U.createStyledElement('button', {}, {
                            title: sc.tooltip, innerHTML: sc.icon,
                            on: {
                                mousedown: (e) => {
                                    if (e.button === 0 || e.button === 1) {
                                        e.preventDefault();
                                        window.open(`https://www.facebook.com${sc.url}`, e.button === 1 ? '_blank' : '_self');
                                    }
                                }
                            }
                        });
                        elements[`shortcut_${sc.key}`] = button;
                        return button;
                    });
                    return U.createStyledElement('div', {}, { className: 'gm-button-group', children: buttons });
                },
                _createSearchComponent(elements) {
                    const T = this.app.state.T;
                    const U = this.app.utils;

                    elements.scopeSelector = U.createStyledElement('select', { cursor: 'pointer' });
                    const scopes = {
                        [T.searchGroupContextual]: [
                            { text: T.searchScopePosts, value: '', tooltip: T.searchTooltipPosts },
                            { text: T.searchScopePhotos, value: '/photos/', tooltip: T.searchTooltipPhotos },
                            { text: T.searchScopeVideos, value: '/videos/', tooltip: T.searchTooltipVideos },
                            { text: T.searchScopeReels, value: 'reel_search', tooltip: T.searchTooltipReels },
                        ],
                        [T.searchGroupGlobal]: [
                            { text: T.searchScopePages, value: 'site:www.facebook.com -inurl:/people/ -inurl:/groups/ -inurl:/events/ -inurl:/marketplace/ -inurl:/gaming/ -inurl:/posts/ -inurl:/videos/ -inurl:/watch/ -inurl:/reels/ -inurl:/reel/ -inurl:/photos/ -inurl:/photo/ -inurl:/albums/ -inurl:/media/ -inurl:/about/ -inurl:/mentions/ -inurl:/permalink/ -inurl:/story.php -inurl:/photo.php -inurl:/permalink.php -inurl:/hashtag/ -inurl:comment_id= -inurl:?locale= -inurl:?locale2=', tooltip: T.searchTooltipPages },
                            { text: T.searchScopePeople, value: 'site:www.facebook.com/people/ -inurl:?locale= -inurl:?locale2=', tooltip: T.searchTooltipPeople },
                            { text: T.searchScopeGroups, value: 'site:www.facebook.com/groups/ -inurl:/posts/ -inurl:/permalink/ -inurl:?locale= -inurl:?locale2=', tooltip: T.searchTooltipGroups },
                            { text: T.searchScopeGlobalPosts, value: 'site:www.facebook.com inurl:/posts/ -inurl:?locale= -inurl:?locale2=', tooltip: T.searchTooltipGlobalPosts },
                            { text: T.searchScopeGlobalVideos, value: 'watch_search', tooltip: T.searchTooltipGlobalVideos },
                            { text: T.searchScopeEvents, value: 'events_search', tooltip: T.searchTooltipEvents },
                            { text: T.searchScopeMarketplace, value: 'marketplace_search', tooltip: T.searchTooltipMarketplace },
                        ]
                    };
                    for (const groupLabel in scopes) {
                        const optgroup = U.createStyledElement('optgroup', {}, { label: groupLabel });
                        scopes[groupLabel].forEach(scope => optgroup.appendChild(U.createStyledElement('option', {}, { value: scope.value, textContent: scope.text, title: scope.tooltip })));
                        elements.scopeSelector.appendChild(optgroup);
                    }

                    elements.searchInput = U.createStyledElement('input', {}, { type: 'text', placeholder: T.searchPlaceholder });
                    elements.clearButton = U.createStyledElement('button', {}, { className: 'gm-search-clear-button', textContent: '✖', on: { mousedown: (e) => e.preventDefault() } });
                    elements.searchButton = U.createStyledElement('button', {}, { className: 'gm-search-button-integrated', innerHTML: this.icons.search, title: T.searchButton });

                    const inputContainer = U.createStyledElement('div', {}, {
                        className: 'gm-search-input-container',
                        children: [elements.searchInput, elements.clearButton, elements.searchButton]
                    });

                    elements.searchComponentWrapper = U.createStyledElement('div', {}, {
                        className: 'gm-search-component-wrapper',
                        children: [elements.scopeSelector, inputContainer]
                    });
                    return U.createStyledElement('div', {}, { className: 'gm-search-core-wrapper', children: [elements.searchComponentWrapper] });
                },
                _createToolsGroup(elements) {
                    const U = this.app.utils;
                    elements.pinButton = U.createStyledElement('button', {}, { innerHTML: this.icons.unpinned + this.icons.pinned });
                    elements.settingsButton = U.createStyledElement('button', {}, {
                        innerHTML: this.icons.settings,
                        title: this.app.state.T.menuSettings
                    });
                    return U.createStyledElement('div', {}, { className: 'gm-button-group', children: [elements.pinButton, elements.settingsButton] });
                },
                _bindEvents() {
                    const { searchInput, clearButton, searchButton, pinButton, settingsButton, toolbar, scopeSelector, searchComponentWrapper, hoverTrigger } = this.elements;

                    pinButton.addEventListener('click', () => this._togglePinState());
                    settingsButton.addEventListener('click', () => this.app.modules.settingsModal.open());

                    searchButton.addEventListener('mousedown', (e) => {
                        if (searchButton.disabled) return;
                        if (e.button === 0) {
                            e.preventDefault();
                            this.performSearch('_blank');
                        }
                        else if (e.button === 1) {
                            e.preventDefault();
                            this.performSearch('background');
                        }
                    });
                    searchInput.addEventListener('input', () => {
                        clearButton.style.display = searchInput.value ? 'flex' : 'none';
                        this._updateSearchButtonState();
                    });
                    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !searchButton.disabled) this.performSearch('_blank'); });
                    searchInput.addEventListener('focus', () => searchComponentWrapper.classList.add('gm-focused'));
                    searchInput.addEventListener('blur', () => searchComponentWrapper.classList.remove('gm-focused'));
                    clearButton.addEventListener('click', () => { searchInput.value = ''; searchInput.focus(); clearButton.style.display = 'none'; this._updateSearchButtonState(); });
                    toolbar.addEventListener('focusout', (e) => { if (!this.state.isPinned && !toolbar.contains(e.relatedTarget)) setTimeout(() => this._hideBar(), this.app.config.TIMEOUTS.THROTTLE_SCROLL); });
                    scopeSelector.addEventListener('change', () => this._updateSearchButtonState());
                    hoverTrigger.addEventListener('mouseenter', this._onHoverTriggerEnter.bind(this));
                    toolbar.addEventListener('mouseenter', this._onSearchBarEnter.bind(this));
                    hoverTrigger.addEventListener('mouseleave', this._onMouseLeave.bind(this));
                    toolbar.addEventListener('mouseleave', this._onMouseLeave.bind(this));
                    window.addEventListener('scroll', this.app.utils.throttle(() => this._handleScroll(), this.app.config.TIMEOUTS.THROTTLE_SCROLL), { passive: true });
                    window.addEventListener('historyChange', () => this.updateVisibility());

                    // Throttle set to 200ms to allow smooth modal transitions (Prevents Layout Thrashing)
                    new MutationObserver(this.app.utils.throttle(() => this.updateVisibility(), this.app.config.TIMEOUTS.THROTTLE_UI)).observe(document.body, { childList: true, subtree: true });
                },
                _updateSearchButtonState() {
                    const T = this.app.state.T;
                    const { searchInput, scopeSelector, searchButton } = this.elements;
                    const selectedOption = scopeSelector.options[scopeSelector.selectedIndex];
                    const isContextual = selectedOption.parentElement.label === T.searchGroupContextual;
                    const keyword = searchInput.value.trim();
                    const requiresKeyword = !isContextual;

                    if (requiresKeyword && !keyword) {
                        searchButton.disabled = true;
                        searchButton.style.opacity = '0.5';
                        searchButton.style.cursor = 'not-allowed';
                        searchButton.title = T.searchButton;
                    } else {
                        searchButton.disabled = false;
                        searchButton.style.opacity = '1';
                        searchButton.style.cursor = 'pointer';
                        searchButton.title = !keyword && isContextual ? T.searchAllContextualTooltip.replace('{scope}', selectedOption.textContent) : T.searchButton;
                    }
                },
                performSearch(target = '_blank') {
                    const T = this.app.state.T;
                    const selectedOption = this.elements.scopeSelector.options[this.elements.scopeSelector.selectedIndex];
                    const isContextual = selectedOption.parentElement.label === T.searchGroupContextual;
                    const keyword = this.elements.searchInput.value.trim();
                    if (!isContextual && !keyword) return;

                    const langExclusion = ' -inurl:?locale= -inurl:?locale2=';
                    const openUrl = (url) => {
                        switch (target) {
                            case 'background': GM_openInTab(url, { active: false, insert: true }); break;
                            case '_self': window.open(url, '_self'); break;
                            case '_blank': default: window.open(url, '_blank'); break;
                        }
                    };
                    const selectedScopeValue = selectedOption.value;
                    let searchUrl = '';
                    const internalSearchMap = {
                        'events_search': `https://www.facebook.com/events/search/?q=${encodeURIComponent(keyword)}`,
                        'marketplace_search': `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(keyword)}`,
                        'watch_search': `https://www.facebook.com/watch/search/?q=${encodeURIComponent(keyword)}`
                    };
                    if (internalSearchMap[selectedScopeValue]) {
                        openUrl(internalSearchMap[selectedScopeValue]);
                        return;
                    }
                    if (selectedScopeValue === 'reel_search') {
                        const pageName = this._getCurrentPageName();
                        if (!pageName) {
                            this.app.modules.toastNotifier.show(T.notificationReelSearchError, 'failure');
                            return;
                        }
                        const combinedKeywords = keyword ? `${keyword} "${pageName}"` : `"${pageName}"`;
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(combinedKeywords + ' site:www.facebook.com/reel/' + langExclusion)}`;
                    } else if (selectedScopeValue.startsWith('site:')) {
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}+${encodeURIComponent(selectedScopeValue)}`;
                    } else {
                        let basePath = '';
                        const pathSegments = window.location.pathname.split('/').filter(Boolean);
                        if (pathSegments.length > 0 && pathSegments[0] !== 'groups') {
                            basePath = (pathSegments[0] === 'people' && pathSegments[2] && !isNaN(pathSegments[2])) ? `/${pathSegments[2]}` : `/${pathSegments[0]}`;
                        } else if (pathSegments.length > 1 && pathSegments[0] === 'groups') {
                            basePath = `/${pathSegments[0]}/${pathSegments[1]}`;
                        }
                        const siteTarget = `site:www.facebook.com${basePath}${selectedScopeValue}`;
                        const fullSiteTarget = siteTarget + langExclusion;
                        const query = keyword ? `${encodeURIComponent(keyword)}+${encodeURIComponent(fullSiteTarget)}` : encodeURIComponent(fullSiteTarget);
                        searchUrl = `https://www.google.com/search?q=${query}`;
                    }
                    if (selectedScopeValue === '/photos/') searchUrl += '&udm=2';
                    openUrl(searchUrl);
                },

                /**
                 * Updates the visibility of the search bar based on page context and scroll.
                 */
                updateVisibility() {
                    if (this.state.isUpdating) return;

                    requestAnimationFrame(() => {
                        this.state.isUpdating = true;

                        const C = this.app.config;
                        const currentPath = window.location.pathname;
                        const dialogExists = !!document.querySelector(C.SELECTORS.GLOBAL.DIALOG);

                        // 1. Detection: Dialog Closed
                        if (this.state.wasDialogVisible && !dialogExists) {
                            if (!this.state.isPinned) {
                                this.state.suppressShow = true;
                                if (this.state.showTimer) {
                                    clearTimeout(this.state.showTimer);
                                    this.state.showTimer = null;
                                }
                                this._hideBar();

                                // Schedule recovery
                                setTimeout(() => {
                                    this.state.suppressShow = false;
                                    // Re-run visibility check to restore 'visible' state if appropriate
                                    this.updateVisibility();
                                }, 400);
                            }
                        }
                        this.state.wasDialogVisible = dialogExists;

                        // 2. Determine Visibility
                        let isDisallowed = ['/photo/', '/videos/', '/reel/', '/posts/', '/watch/'].some(p => currentPath.startsWith(p)) || dialogExists;

                        if (this.state.suppressShow) {
                            isDisallowed = true; // Treats it as disallowed, thus 'hidden'
                        }

                        const newVisibility = isDisallowed ? 'hidden' : 'visible';

                        // 3. Apply Visibility
                        const elementsToToggle = [this.elements.toolbar, this.elements.hoverTrigger, this.elements.hoverHint];
                        if (this.elements.toolbar.style.visibility !== newVisibility) {
                            elementsToToggle.forEach(el => el.style.visibility = newVisibility);
                        }

                        // ... Contextual Search Logic ...
                        const isGroupPage = currentPath.startsWith('/groups/');
                        for (const option of this.elements.scopeSelector.options) {
                            if (option.parentElement.tagName !== 'OPTGROUP') continue;
                            const isContextualGroup = option.parentElement.label === this.app.state.T.searchGroupContextual;
                            option.disabled = isGroupPage && isContextualGroup && option.value !== '';
                        }
                        if (isGroupPage && this.elements.scopeSelector.options[this.elements.scopeSelector.selectedIndex].disabled) this.elements.scopeSelector.value = '';

                        // 4. Position Handling
                        // If pinned and not disallowed, show it.
                        if (this.state.isPinned && !isDisallowed) {
                            this._showBar();
                        } else {
                            this._handleScroll();
                        }

                        this._updateSearchButtonState();

                        setTimeout(() => { this.state.isUpdating = false; }, 0);
                    });
                },

                _handleScroll(force = false) {
                    if (this.state.isPinned) {
                        if (force) this._showBar();
                        return;
                    }

                    if (this.state.suppressShow) {
                        if (this.state.showTimer) { clearTimeout(this.state.showTimer); this.state.showTimer = null; }
                        this._hideBar();
                        return;
                    }

                    const currentScrollY = window.scrollY;
                    const isAtTop = currentScrollY < 10;

                    if (!this.state.isAtTop && isAtTop) {
                        this.state.isAtTop = true;

                        if (this.state.showTimer) clearTimeout(this.state.showTimer);
                        this.state.showTimer = setTimeout(() => {
                            if (!this.state.suppressShow) {
                                this._showBar();
                                this.elements.hoverHint.classList.remove('gm-visible');
                                if (this.elements.toolbar.contains(document.activeElement)) document.activeElement.blur();
                            }
                            this.state.showTimer = null;
                        }, 200);
                    }
                    else if (this.state.isAtTop && !isAtTop) {
                        this.state.isAtTop = false;
                        if (this.state.showTimer) { clearTimeout(this.state.showTimer); this.state.showTimer = null; }

                        if (!this.elements.toolbar.contains(document.activeElement)) {
                            this._hideBar();
                        }
                        this.elements.hoverHint.classList.add('gm-visible');
                    }

                    if (force) {
                        if (isAtTop) {
                            if (this.state.showTimer) { clearTimeout(this.state.showTimer); this.state.showTimer = null; }
                            this._showBar();
                            this.elements.hoverHint.classList.remove('gm-visible');
                        } else {
                            this._hideBar();
                            this.elements.hoverHint.classList.add('gm-visible');
                        }
                    }
                },
                _togglePinState() {
                    this.state.isPinned = !this.state.isPinned;
                    GM_setValue('isSearchBarPinned', this.state.isPinned);
                    this._updatePinState();
                },
                _updatePinState() {
                    const T = this.app.state.T;
                    const { pinButton, hoverHint } = this.elements;
                    const isPinned = this.state.isPinned;
                    pinButton.classList.toggle('gm-pinned', isPinned);
                    const [unpinnedIcon, pinnedIcon] = pinButton.querySelectorAll('svg');
                    pinnedIcon.style.display = isPinned ? 'block' : 'none';
                    unpinnedIcon.style.display = isPinned ? 'none' : 'block';
                    pinButton.title = isPinned ? T.unpinToolbar : T.pinToolbar;
                    if (isPinned) {
                        if (this.state.showTimer) { clearTimeout(this.state.showTimer); this.state.showTimer = null; }
                        this._showBar();
                        hoverHint.classList.remove('gm-visible');
                    } else {
                        this._handleScroll();
                    }
                },
                _showBar() { this.elements.toolbar.style.transform = 'translateY(0)'; },
                _hideBar() { this.elements.toolbar.style.transform = 'translateY(-100%)'; },
                _onHoverTriggerEnter() { if (!this.state.isPinned) { this.elements.hoverHint.classList.remove('gm-visible'); this._showBar(); } },
                _onSearchBarEnter() { if (!this.state.isPinned) this._showBar(); },
                _onMouseLeave() { if (!this.state.isPinned && !this.elements.toolbar.contains(document.activeElement)) { this._hideBar(); if (!this.state.isAtTop) this.elements.hoverHint.classList.add('gm-visible'); } },
            },

            keyboardNavigator: {
                app: null,
                activeKey: null,
                /**
                 * Initializes the keyboard navigator.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!this.app.state.settings.keyboardNavEnabled) return;
                    document.addEventListener('keydown', this.handleKeyDown.bind(this));
                    document.addEventListener('keyup', this.handleKeyUp.bind(this));
                },
                handleKeyDown(event) {
                    if (event.key === this.activeKey) return;
                    if (!this.app.utils.isFeedPage()) return;
                    const target = event.target;
                    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
                    const settings = this.app.state.settings;
                    let direction = null;
                    switch (event.key) {
                        case settings.keyNavNextPrimary:
                        case settings.keyNavNextSecondary:
                            direction = 'next';
                            break;
                        case settings.keyNavPrevPrimary:
                        case settings.keyNavPrevSecondary:
                            direction = 'prev';
                            break;
                    }
                    if (direction) {
                        event.preventDefault();
                        this.activeKey = event.key;
                        if (this.app.modules.postNavigatorCore) {
                            this.app.modules.postNavigatorCore.startContinuousNavigation(direction);
                        }
                    }
                },
                handleKeyUp(event) {
                    if (event.key === this.activeKey) {
                        this.activeKey = null;
                        if (this.app.modules.postNavigatorCore) {
                            this.app.modules.postNavigatorCore.stopContinuousNavigation();
                        }
                    }
                }
            },

            floatingNavigator: {
                app: null,
                container: null,
                btnAutoLoad: null,
                isInitialized: false,
                /**
                 * Initializes the floating navigation widget.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    if (this.isInitialized) return;
                    this.app = app;
                    if (!this.app.state.settings.floatingNavEnabled) return;
                    const T = this.app.state.T;
                    const U = this.app.utils;
                    const settings = this.app.state.settings;
                    // Dynamic reference
                    const getCore = () => this.app.modules.postNavigatorCore;
                    const getLoader = () => this.app.modules.contentAutoLoader;

                    this.container = U.createStyledElement('div', {}, { className: 'gm-floating-nav' });
                    this.updateOpacityState(settings.floatingNavOpacity);

                    // --- Icons ---
                    this.icons = {
                        arrowDown: `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>`,
                        stop: `<svg viewBox="0 0 24 24" fill="#e02424"><path d="M6 6h12v12H6z"></path></svg>`,
                        clipboard: `<svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></svg>`,
                        save: `<svg viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>`
                    };

                    // --- Navigation Buttons ---
                    const prevButton = U.createStyledElement('button', {}, { title: T.floatingNavPrevTooltip });
                    prevButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>`;
                    prevButton.addEventListener('mousedown', (e) => {
                        if (e.button !== 0) return; // Only Left Click
                        const c = getCore(); if (c) c.startContinuousNavigation('prev');
                    });
                    prevButton.addEventListener('mouseleave', () => { const c = getCore(); if (c) c.stopContinuousNavigation(); });
                    prevButton.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const c = getCore();
                        const posts = c ? c.getSortedPosts() : [];
                        console.log('[FB_Script] Floating Prev Right-Click:', posts.length);
                        if (posts.length > 0) {
                            // Force focus update (handles scrolling)
                            c.updateActivePost(0, 'manual');
                        }
                    });

                    const nextButton = U.createStyledElement('button', {}, { title: T.floatingNavNextTooltip });
                    nextButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path></svg>`;
                    nextButton.addEventListener('mousedown', (e) => {
                        if (e.button !== 0) return; // Only Left Click
                        const c = getCore(); if (c) c.startContinuousNavigation('next');
                    });
                    nextButton.addEventListener('mouseleave', () => { const c = getCore(); if (c) c.stopContinuousNavigation(); });
                    nextButton.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const c = getCore();
                        const posts = c ? c.getSortedPosts() : [];
                        console.log('[FB_Script] Floating Next Right-Click:', posts.length);
                        if (posts.length > 0) {
                            // Force focus update (handles scrolling)
                            c.updateActivePost(posts.length - 1, 'manual');
                        }
                    });

                    document.body.addEventListener('mouseup', () => { const c = getCore(); if (c) c.stopContinuousNavigation(); });
                    this.container.append(prevButton, nextButton);

                    // --- Tools Separator ---
                    if (settings.floatingNav_showAutoLoad || settings.floatingNav_showBatchCopy) {
                        const separator = U.createStyledElement('div', { height: '4px' });
                        this.container.appendChild(separator);
                    }

                    // --- Auto-Load Button ---
                    if (settings.floatingNav_showAutoLoad) {

                        this.btnAutoLoad = U.createStyledElement('button', {}, {
                            className: 'gm-auto-load-btn', // Add class for targeting
                            style: 'position: relative; display: flex; align-items: center; justify-content: center;'
                        });

                        // Progress Ring SVG
                        // Button size is 44px. We match it.
                        // Radius = 20 (Diameter 40), Stroke = 2 -> Total 42, plus padding fit in 44.
                        // Center is 22, 22.
                        const ringSvg = `
                            <svg class="gm-progress-ring" viewBox="0 0 44 44" style="position: absolute; top: 0; left: 0; width: 44px; height: 44px; transform: rotate(-90deg); pointer-events: none; opacity: 0; transition: opacity 0.3s;">
                                <circle cx="22" cy="22" r="20" fill="none" stroke="#ddd" stroke-width="2.5" style="opacity: 0.3;"></circle>
                                <circle class="gm-progress-circle" cx="22" cy="22" r="20" fill="none" stroke="#1877F2" stroke-width="2.5" stroke-dasharray="125.66" stroke-dashoffset="125.66" stroke-linecap="round" style="transition: stroke-dashoffset 0.3s ease;"></circle>
                            </svg>
                        `;

                        // Default Icon: Arrow Down
                        this.btnAutoLoad.innerHTML = `${ringSvg}<span class="gm-icon-wrapper" style="z-index: 1; display: flex;">${this.icons.arrowDown}</span>`;

                        this.btnAutoLoad.addEventListener('click', () => {
                            const loader = getLoader();
                            if (loader) {
                                if (loader.state.isRunning) loader.stop('autoLoad_status_stopped');
                                else loader.start();
                            }
                        });

                        // Right-click: Toggle Mode
                        this.btnAutoLoad.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const loader = getLoader();
                            if (loader) loader.toggleMode();
                        });

                        this.container.appendChild(this.btnAutoLoad);
                        this.updateButtonTooltip(); // Set initial tooltip
                    }

                    // --- Batch Copy Button ---
                    if (settings.floatingNav_showBatchCopy) {
                        this.btnBatchCopy = U.createStyledElement('button', {}, {});
                        // Icon set by updateBatchCopyTooltip

                        this.btnBatchCopy.addEventListener('click', () => {
                            const loader = getLoader();
                            if (loader) loader.copyAllPosts();
                        });

                        // Right-click: Toggle Mode
                        this.btnBatchCopy.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const loader = getLoader();
                            if (loader) loader.toggleBatchCopyMode();
                        });

                        this.container.appendChild(this.btnBatchCopy);
                        this.updateBatchCopyTooltip();
                    }

                    document.body.appendChild(this.container);
                    this.updateVisibility();
                    window.addEventListener('historyChange', this.updateVisibility.bind(this));
                    new MutationObserver(U.throttle(this.updateVisibility.bind(this), 200)).observe(document.body, { childList: true, subtree: true });
                    this.isInitialized = true;
                },
                deinit() {
                    if (this.container) {
                        this.container.remove();
                        this.container.remove();
                        this.container = null;
                        this.btnAutoLoad = null;
                        this.btnBatchCopy = null;
                    }
                    this.isInitialized = false;
                },
                updateButtonState(state) {
                    if (!this.btnAutoLoad) return;
                    const T = this.app.state.T;
                    const iconWrapper = this.btnAutoLoad.querySelector('.gm-icon-wrapper');
                    const progressRing = this.btnAutoLoad.querySelector('.gm-progress-ring');

                    if (state === 'start') {
                        // Change to Stop Icon
                        if (iconWrapper) {
                            iconWrapper.innerHTML = this.icons?.stop || `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"></path></svg>`;
                            iconWrapper.style.color = ''; // Keep default gray
                        }
                        this.btnAutoLoad.title = T.tooltipAutoLoadStop;
                        this.btnAutoLoad.style.borderColor = 'transparent';

                        // Show Progress Ring
                        if (progressRing) progressRing.style.opacity = '1';

                        // Set "Running" state
                        if (this.container) {
                            this.container.classList.add('gm-running');
                        }
                    } else {
                        // Revert to Start Icon
                        if (iconWrapper) {
                            iconWrapper.innerHTML = this.icons?.arrowDown || `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>`;
                            iconWrapper.style.color = ''; // Reset to inherit (Gray)
                        }
                        this.updateButtonTooltip();
                        this.btnAutoLoad.style.borderColor = '#ddd';

                        // Hide Progress Ring
                        if (progressRing) progressRing.style.opacity = '0';

                        // Remove "Running" state
                        if (this.container) {
                            this.container.classList.remove('gm-running');
                        }
                    }
                },
                updateProgress(current, target) {
                    if (!this.btnAutoLoad) return;
                    const circle = this.btnAutoLoad.querySelector('.gm-progress-circle');
                    if (!circle) return;

                    // Circumference = 2 * PI * 20 ≈ 125.66
                    const circumference = 125.66;
                    let percent = 0;

                    if (target > 0) {
                        percent = Math.min(Math.max(current / target, 0), 1);
                    } else {
                        percent = 1;
                    }

                    const offset = circumference - (percent * circumference);
                    circle.style.strokeDashoffset = offset;
                },
                updateButtonTooltip() {
                    if (!this.btnAutoLoad) return;
                    const T = this.app.state.T;
                    const loader = this.app.modules.contentAutoLoader;
                    const mode = loader ? loader.state.mode : 'incremental';
                    const batchSize = this.app.state.settings.autoLoadBatchSize || 20;

                    let tooltip = mode === 'incremental'
                        ? T.autoLoad_tooltip_incremental.replace('{n}', batchSize)
                        : T.autoLoad_tooltip_target.replace('{n}', batchSize);


                    this.btnAutoLoad.title = tooltip;
                },
                updateBatchCopyTooltip() {
                    if (!this.btnBatchCopy) return;
                    const T = this.app.state.T;
                    const loader = this.app.modules.contentAutoLoader;
                    const mode = loader ? loader.state.batchCopyMode : 'clipboard';

                    const modeLabel = mode === 'clipboard'
                        ? (T.batchCopyMode_clipboard || 'Clipboard')
                        : (T.batchCopyMode_file || 'Download as File');

                    this.btnBatchCopy.title = `${T.tooltipBatchCopy}\n[${modeLabel}]`;

                    // Update Icon
                    if (this.icons) {
                        this.btnBatchCopy.innerHTML = mode === 'file' ? this.icons.save : this.icons.clipboard;
                    }
                },
                updateOpacityState(enabled) {
                    if (this.container) {
                        this.container.dataset.opacity = enabled ? 'true' : 'false';
                        // Add CSS rule injection for .gm-running override if not present
                        if (!document.getElementById('gm-dynamic-styles-opacity')) {
                            const style = document.createElement('style');
                            style.id = 'gm-dynamic-styles-opacity';
                            style.innerHTML = `
                                .gm-floating-nav[data-opacity="true"] { opacity: 0.1; transition: opacity 0.3s; }
                                .gm-floating-nav[data-opacity="true"]:hover { opacity: 1 !important; }
                                .gm-floating-nav.gm-running { opacity: 1 !important; }
                                /* When running, make non-hovered sibling buttons semi-transparent */
                                .gm-floating-nav.gm-running button:not(.gm-auto-load-btn):not(:hover) { opacity: 0.4; filter: grayscale(0.5); }
                            `;
                            document.head.appendChild(style);
                        }
                    }
                    const TActions = this.app.modules.transparencyActions;
                    if (TActions && TActions.container) TActions.container.dataset.opacity = enabled ? 'true' : 'false';
                },
                updateVisibility() {
                    if (!this.container) return;
                    const isVisible = this.app.utils.isFeedPage() && !document.querySelector(this.app.config.SELECTORS.GLOBAL.DIALOG);
                    this.container.style.display = isVisible ? 'flex' : 'none';
                }
            },

            wheelNavigator: {
                app: null,
                isCoolingDown: false,
                /**
                 * Initializes the mouse wheel navigator.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    if (!this.app.state.settings.wheelNavEnabled) return;
                    document.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
                },
                handleWheel(event) {
                    if (this.isCoolingDown) return;
                    if (!this.app.utils.isFeedPage() || document.querySelector(this.app.config.SELECTORS.GLOBAL.DIALOG)) return;
                    const modifierKey = this.app.state.settings.wheelNavModifier;
                    if (modifierKey !== 'none' && !event[modifierKey]) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const direction = event.deltaY > 0 ? 'next' : 'prev';
                    if (this.app.modules.postNavigatorCore) {
                        this.app.modules.postNavigatorCore.navigateToPost(direction);
                    }
                    this.isCoolingDown = true;
                    setTimeout(() => { this.isCoolingDown = false; }, this.app.state.settings.continuousNavInterval);
                }
            },

            clickToFocusNavigator: {
                app: null,
                /**
                 * Initializes the click-to-focus navigator.
                 * @param {Object} app - The main application instance.
                 */
                init(app) {
                    this.app = app;
                    const settings = this.app.state.settings;
                    if (!settings.keyboardNavEnabled && !settings.floatingNavEnabled && !settings.wheelNavEnabled) return;
                    document.body.addEventListener('click', this.handleClick.bind(this));
                },
                handleClick(event) {
                    const target = event.target;
                    if (target.closest('a, button, [role="button"], input, textarea') || window.getSelection().toString().length > 0) return;
                    const post = target.closest('[role="article"][aria-posinset]');
                    if (!post) return;
                    if (post.closest(this.app.config.SELECTORS.GLOBAL.DIALOG)) return;

                    const Core = this.app.modules.postNavigatorCore;
                    if (!Core) return;

                    const C = this.app.config;
                    const currentHighlighted = document.querySelector(`.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}`);
                    if (currentHighlighted && currentHighlighted !== post) {
                        currentHighlighted.classList.remove(C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS);
                    }
                    post.classList.add(C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS);
                    const posts = Core.getSortedPosts();
                    const newIndex = posts.findIndex(p => p === post);
                    if (newIndex !== -1) {
                        // Update active index silently to sync timeline
                        Core.updateActivePost(newIndex, 'scroll');
                    }
                }
            },

            postHeaderTools: {
                app: null,
                isProcessingClick: false,
                isModalOpening: false,
                observer: null,

                // SVG Icons definitions
                icons: {
                    smart: `<svg viewBox="0 0 32 32" width="16" height="16"><path fill="#F5C33B" d="M18,11a1,1,0,0,1-1,1,5,5,0,0,0-5,5,1,1,0,0,1-2,0,5,5,0,0,0-5-5,1,1,0,0,1,0-2,5,5,0,0,0,5-5,1,1,0,0,1,2,0,5,5,0,0,0,5,5A1,1,0,0,1,18,11Z"/><path fill="#F5C33B" d="M19,24a1,1,0,0,1-1,1,2,2,0,0,0-2,2,1,1,0,0,1-2,0,2,2,0,0,0-2-2,1,1,0,0,1,0-2,2,2,0,0,0,2-2,1,1,0,0,1,2,0,2,2,0,0,0,2,2A1,1,0,0,1,19,24Z"/><path fill="#F5C33B" d="M28,17a1,1,0,0,1-1,1,4,4,0,0,0-4,4,1,1,0,0,1-2,0,4,4,0,0,0-4-4,1,1,0,0,1,0-2,4,4,0,0,0,4-4,1,1,0,0,1,2,0,4,4,0,0,0,4,4A1,1,0,0,1,28,17Z"/></svg>`,
                    direct: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#1877F2" d="M13.29 9.29l-4 4a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4-4a1 1 0 0 0-1.42-1.42z"/><path fill="#1877F2" d="M12.28 17.4L11 18.67a4.2 4.2 0 0 1-5.58.4 4 4 0 0 1-.27-5.93l1.42-1.43a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-1.27 1.28a6.15 6.15 0 0 0-.67 8.07 6.06 6.06 0 0 0 9.07.6l1.42-1.42a1 1 0 0 0-1.42-1.42z"/><path fill="#1877F2" d="M19.66 3.22a6.18 6.18 0 0 0-8.13.68L10.45 5a1.09 1.09 0 0 0-.17 1.61 1 1 0 0 0 1.42 0L13 5.3a4.17 4.17 0 0 1 5.57-.4 4 4 0 0 1 .27 5.95l-1.42 1.43a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l1.42-1.42a6.06 6.06 0 0 0-.6-9.06z"/></svg>`,
                    processing: `<svg viewBox="0 0 24 24" width="16" height="16" class="gm-spin"><path fill="#1877F2" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"></path></svg>`,
                    success: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#42B72A" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>`,
                    failure: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#FA383E" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`,
                    copy: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#65676B" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
                },

                init(app) {
                    if (!this.app) this.app = app;
                    if (this.observer) return;
                    this.startObserver();
                },

                deinit() {
                    if (this.observer) {
                        this.observer.disconnect();
                        this.observer = null;
                    }
                    this.cleanupButtons();
                },

                // --- Feature 1: Permalink Copier Logic (Standalone) ---
                /**
                 * Handles clicks on the permalink copy button.
                 * @param {Event} event - The click event.
                 * @param {HTMLElement} button - The button element.
                 */
                async handlePermalinkClick(event, button) {
                    if (this.isProcessingClick) return;
                    event.preventDefault(); event.stopPropagation();

                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const postEl = button.closest(`[data-${C_TOOLS.PROCESSED_MARKER}]`);
                    if (!postEl) return;

                    this.isProcessingClick = true;
                    button.style.pointerEvents = 'none';
                    const originalContent = button.innerHTML;
                    const T = this.app.state.T;
                    const settings = this.app.state.settings;

                    const iconWrapper = button.querySelector('.gm-icon-wrapper');
                    if (iconWrapper) iconWrapper.innerHTML = this.icons.processing;

                    try {
                        const contentType = this.determinePostContentType(postEl);
                        const useSmartFetch = settings.copier_useSmartLink && contentType === 'standard';
                        const fetcher = useSmartFetch ? this.fetchPermalinkInBackground(postEl) : Promise.resolve(this.getPermalinkDirectlyFromElement(postEl));
                        const result = await fetcher || { url: null, method: 'unknown_failure' };
                        const { url: dataToCopy, method } = result;

                        if (dataToCopy) {
                            GM_setClipboard(dataToCopy);
                            const linkHTML = `<a href="${dataToCopy}" target="_blank" rel="noopener noreferrer">${dataToCopy}</a>`;
                            const successMessage = T.copier_notificationPermalinkCopied.replace('{url}', linkHTML).replace(/\n/g, '<br>');
                            this.app.modules.toastNotifier.show(successMessage, 'success', 5000);
                            await this.animateButtonFeedback(button, 'success', originalContent);
                        } else {
                            const errorKey = method.includes('no_source') ? 'copier_notificationErrorNoSourceUrl'
                                : method.includes('timeout') ? 'copier_notificationErrorTimeout'
                                    : 'copier_notificationErrorGeneric';
                            this.app.modules.toastNotifier.show(T[errorKey], 'failure');
                            await this.animateButtonFeedback(button, 'failure', originalContent);
                        }
                    } catch (error) {
                        console.error(`${this.app.config.LOG_PREFIX} [Tools] Error:`, error);
                        this.app.modules.toastNotifier.show(T.copier_notificationErrorGeneric, 'failure');
                        await this.animateButtonFeedback(button, 'failure', originalContent);
                    } finally {
                        this.isProcessingClick = false;
                    }
                },

                // --- Feature 2: Smart Copy Content Logic ---
                /**
                 * Handles clicks on the copy content button.
                 * @param {Event} event - The click event.
                 * @param {HTMLElement} button - The button element.
                 */
                async handleCopyContentClick(event, button) {
                    if (this.isProcessingClick) return;
                    event.preventDefault(); event.stopPropagation();

                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const postEl = button.closest(this.app.config.SELECTORS.GLOBAL.POST_CONTAINER);
                    const T = this.app.state.T;

                    this.isProcessingClick = true;
                    button.style.pointerEvents = 'none';
                    const originalContent = button.innerHTML;

                    const iconWrapper = button.querySelector('.gm-icon-wrapper');
                    if (iconWrapper) iconWrapper.innerHTML = this.icons.processing;

                    try {
                        // Default to 'text' for single copy button
                        const data = await this.extractPostData(postEl, { includeOrder: false });
                        const text = this.formatPostData(data, 'text');

                        if (text) {
                            GM_setClipboard(text);
                            const msg = T.copier_copyContentSuccess.replace('{count}', text.length);
                            this.app.modules.toastNotifier.show(msg, 'success');
                            await this.animateButtonFeedback(button, 'success', originalContent);
                        } else {
                            this.app.modules.toastNotifier.show(T.copier_notificationContentNotFound, 'failure');
                            await this.animateButtonFeedback(button, 'failure', originalContent);
                        }
                    } catch (error) {
                        console.error(`${this.app.config.LOG_PREFIX} [Tools] Copy Content Error:`, error);
                        this.app.modules.toastNotifier.show(T.copier_copyContentFailed, 'failure');
                        await this.animateButtonFeedback(button, 'failure', originalContent);
                    } finally {
                        this.isProcessingClick = false;
                    }
                },

                // --- Core Text Extraction Logic (Metadata + Topology) ---
                /**
                 * Legacy wrapper for backward compatibility or simple text extraction.
                 */
                async extractPostMetadata(postEl, options = {}) {
                    const data = await this.extractPostData(postEl, options);
                    return this.formatPostData(data, 'text');
                },

                /**
                 * Extracts structured data from a post element.
                 * @param {HTMLElement} postEl - The post element.
                 * @param {Object} options - Options { includeOrder: boolean, forceRawLink: boolean }
                 * @returns {Promise<Object>}
                 */
                async extractPostData(postEl, options = {}) {
                    if (!postEl) return null;
                    const settings = this.app.state.settings;
                    const T = this.app.state.T;
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;

                    // 1. Expand Content
                    const contentContainer = postEl.querySelector(C_TOOLS.CONTENT_BODY);
                    await this._expandReadMore(contentContainer);

                    const data = {
                        meta: {
                            id: null,
                            url: null,
                            order: options.includeOrder ? postEl.getAttribute('aria-posinset') : null,
                            author: [],
                            timestamp: null
                        },
                        content: '',
                        stats: {
                            reactions: { total: null, detailed: [] },
                            comments: null,
                            shares: null
                        },
                        media: {
                            imageCount: 0,
                            videoDuration: null,
                            linkPreview: null
                        }
                    };

                    // --- URL ---
                    let linkUrl = null;
                    if (!options.forceRawLink && settings.copier_useSmartLink) {
                        const contentType = this.determinePostContentType(postEl);
                        if (contentType === 'standard') {
                            const result = await this.fetchPermalinkInBackground(postEl);
                            if (result && result.url) linkUrl = result.url;
                        }
                    }
                    if (!linkUrl) {
                        const direct = this.getPermalinkDirectlyFromElement(postEl);
                        linkUrl = direct.url;
                    }
                    data.meta.url = linkUrl;

                    // --- ID ---
                    if (linkUrl) {
                        // Supports numeric IDs and new 'pfbid' alphanumeric IDs
                        const match = linkUrl.match(/\/posts\/([a-zA-Z0-9]+)/) || linkUrl.match(/fbid=(\d+)/) || linkUrl.match(/\/videos\/(\d+)/) || linkUrl.match(/\/reel\/(\d+)/);
                        if (match) data.meta.id = match[1];
                    }

                    // --- Author ---
                    const authorEls = postEl.querySelectorAll('div[data-ad-rendering-role="profile_name"] h2 strong a, div[data-ad-rendering-role="profile_name"] h2 a');
                    authorEls.forEach(el => {
                        let link = el.href;
                        try {
                            const u = new URL(link);
                            this.app.utils.cleanUrlParams(u);
                            link = u.href.replace(/\/$/, '');
                        } catch (e) { }
                        data.meta.author.push({ name: el.textContent.trim(), link: link });
                    });

                    // --- Date ---
                    const timeLink = this.findTimestampLink(postEl);
                    if (timeLink) {
                        data.meta.timestamp = timeLink.getAttribute('aria-label') || timeLink.textContent.trim();
                        if (data.meta.timestamp && data.meta.timestamp.length > 50 && !/\d/.test(data.meta.timestamp)) data.meta.timestamp = null;
                    }

                    // --- Stats ---
                    const toolbar = postEl.querySelector('[role="toolbar"]');
                    if (toolbar) {
                        const directContainer = toolbar.parentElement;
                        const footerArea = toolbar.closest('div[role="article"] > div > div > div > div > div') || directContainer;
                        const unitGroup = this.app.config.CONSTANTS.REGEX_PARTS.UNIT_GROUP;
                        const numberPatternStr = `[\\d,.]+\\s*(${unitGroup})?(?:人)?`;
                        const numberRegex = new RegExp(numberPatternStr);

                        // Total Reactions
                        const reactionKeywords = ['All reactions:', '所有心情：', 'すべてのリアクション:', 'All reactions'];
                        const findTotalByLabel = (container) => {
                            if (!container) return null;
                            const candidates = Array.from(container.children);
                            const label = candidates.find(el => reactionKeywords.some(kw => el.textContent.includes(kw)));
                            if (label && label.nextElementSibling) return label.nextElementSibling.textContent.trim();
                            return null;
                        };
                        let totalReactionText = findTotalByLabel(directContainer) || findTotalByLabel(footerArea);
                        if (!totalReactionText && footerArea) {
                            const reactionIcon = footerArea.querySelector('[aria-label*="reaction"], [aria-label*="心情"], [aria-label*="リアクション"]');
                            if (reactionIcon && !reactionIcon.closest('div[role="article"] div[role="article"]')) {
                                const containerText = reactionIcon.closest('div')?.textContent || '';
                                const m = containerText.match(numberRegex);
                                if (m) totalReactionText = m[0].replace(/\s+|人/g, '');
                            }
                        }
                        data.stats.reactions.total = totalReactionText;

                        // Detailed Reactions
                        if (footerArea) {
                            const reactionButtons = footerArea.querySelectorAll('[aria-label]');
                            const reactionTerms = ['Like', 'Love', 'Care', 'Haha', 'Wow', 'Sad', 'Angry', '讚', '大心', '加油', '哈', '哇', '嗚', '怒', '超いいね！', 'いいね！', '大切だね', 'うけるね', 'すごいね', '悲しいね', 'ひどいね'];
                            const reactionRegex = new RegExp(`(${reactionTerms.join('|')})[:：]\\s*(${numberPatternStr})`, 'i');
                            const emojiMap = { 'like': '👍', '讚': '👍', 'love': '❤️', '大心': '❤️', 'care': '🫂', '加油': '🫂', 'haha': '😆', '哈': '😆', 'wow': '😮', '哇': '😮', 'sad': '😢', '嗚': '😢', 'angry': '😡', '怒': '😡', 'いいね！': '👍', '超いいね！': '❤️', '大切だね': '🫂', 'うけるね': '😆', 'すごいね': '😮', '悲しいね': '😢', 'ひどいね': '😡' };

                            reactionButtons.forEach(btn => {
                                const label = btn.getAttribute('aria-label');
                                if (!label) return;
                                const match = label.match(reactionRegex);
                                if (match) {
                                    const type = match[1];
                                    const count = match[2].replace(/\s+|人/g, '');
                                    let emoji = emojiMap[type] || emojiMap[type.toLowerCase()];
                                    if (emoji) data.stats.reactions.detailed.push(`${emoji} ${count}`);
                                }
                            });
                        }

                        // Comments & Shares
                        if (footerArea) {
                            const icons = Array.from(footerArea.querySelectorAll('i[data-visualcompletion="css-img"]'));
                            let commentCount = '', shareCount = '';
                            const extractCountFromIcon = (icon) => {
                                let current = icon.parentElement;
                                for (let i = 0; i < 4; i++) {
                                    if (!current) break;
                                    const text = current.textContent.trim();
                                    if (text && new RegExp(`^${numberPatternStr}$`).test(text)) return text.replace(/\s+|人/g, '');
                                    const m = text.match(numberRegex); if (m) return m[0].replace(/\s+|人/g, '');
                                    const numberSpan = current.querySelector('span:not(:has(*))');
                                    if (numberSpan) { const mSpan = numberSpan.textContent.trim().match(numberRegex); if (mSpan) return mSpan[0].replace(/\s+|人/g, ''); }
                                    current = current.parentElement;
                                } return null;
                            };
                            for (const icon of icons) {
                                const bgPos = icon.style.backgroundPosition; if (!bgPos) continue;
                                const match = bgPos.match(/0px\s+(-?\d+)px/); if (!match) continue;
                                const yPos = parseInt(match[1], 10);
                                const SPRITES = this.app.config.CONSTANTS.SPRITES;
                                if (Math.abs(yPos - SPRITES.COMMENT) < SPRITES.TOLERANCE && !commentCount) commentCount = extractCountFromIcon(icon);
                                else if (Math.abs(yPos - SPRITES.SHARE) < SPRITES.TOLERANCE && !shareCount) shareCount = extractCountFromIcon(icon);
                            }
                            if (!commentCount || !shareCount) {
                                const footerButtons = Array.from(footerArea.querySelectorAll('[role="button"]'));
                                for (const btn of footerButtons) {
                                    if (btn.closest('div[role="article"] div[role="article"]')) continue;
                                    const txt = btn.textContent.trim();
                                    if (txt && new RegExp(`^${numberPatternStr}$`).test(txt)) {
                                        if (!commentCount) commentCount = txt.replace(/\s+|人/g, '');
                                        else if (!shareCount) shareCount = txt.replace(/\s+|人/g, '');
                                    }
                                }
                            }
                            data.stats.comments = commentCount;
                            data.stats.shares = shareCount;
                        }
                    }

                    // --- Media: Image Count ---
                    const uniqueImageIds = new Set();
                    let extraHiddenImages = 0;
                    const imageLinks = postEl.querySelectorAll('a[href*="/photo/"][href*="fbid="], a[href*="photo.php"][href*="fbid="]');
                    imageLinks.forEach(link => {
                        if (link.querySelector('img')) {
                            const href = link.getAttribute('href');
                            const fbidMatch = href.match(/fbid=(\d+)/);
                            if (fbidMatch) uniqueImageIds.add(fbidMatch[1]);
                            const candidates = link.querySelectorAll('div');
                            for (const cand of candidates) {
                                const txt = cand.textContent.trim();
                                if (/^\+\d+$/.test(txt)) {
                                    const num = parseInt(txt.substring(1), 10);
                                    if (!isNaN(num)) extraHiddenImages = num;
                                    break;
                                }
                            }
                        }
                    });
                    const totalImages = uniqueImageIds.size + extraHiddenImages - (extraHiddenImages > 0 ? 1 : 0);
                    data.media.imageCount = totalImages;

                    // --- Media: Video Duration ---
                    let duration = null;
                    const reelLink = postEl.querySelector('a[href*="/reel/"]');
                    const videoLink = postEl.querySelector('a[href*="/videos/"], a[href*="/watch/"]');

                    const candidates = Array.from(postEl.querySelectorAll('div, span'));
                    const playerTimePattern = /(\d+(?::\d+)+)\s*\/\s*(\d+(?::\d+)+)/;
                    for (const el of candidates) {
                        if (el.textContent.includes('/')) {
                            const m = el.textContent.match(playerTimePattern);
                            if (m) { duration = m[2]; break; }
                        }
                    }
                    if (!duration && (reelLink || videoLink)) {
                        const badgePattern = /^(\d+(?::\d+)+)$/;
                        for (const el of candidates) {
                            const txt = el.textContent.trim();
                            if (el.closest(C_TOOLS.CONTENT_BODY)) continue;
                            if (badgePattern.test(txt)) { duration = txt; break; }
                        }
                    }
                    data.media.videoDuration = duration;

                    // --- Link Preview ---
                    data.media.linkPreview = this._extractLinkPreviewData(postEl);

                    // --- Content Body ---
                    data.content = this._processContentBody(contentContainer);
                    if (!data.content) data.content = '';

                    return data;
                },

                formatPostData(data, format = 'text') {
                    if (!data) return '';
                    const settings = this.app.state.settings;
                    const T = this.app.state.T;

                    if (format === 'json') return data;
                    if (format === 'csv') {
                        return {
                            'Order': data.meta.order || '',
                            'ID': data.meta.id || '',
                            'URL': data.meta.url || '',
                            'Author': data.meta.author.map(a => a.name).join('; '),
                            'Author Link': data.meta.author.map(a => a.link).join('; '),
                            'Time': data.meta.timestamp || '',
                            'Content': data.content, // CSV supports newlines if quoted
                            'Reactions': data.stats.reactions.total || '0',
                            'Reactions (Details)': data.stats.reactions.detailed ? data.stats.reactions.detailed.join('; ') : '',
                            'Comments': data.stats.comments || '0',
                            'Shares': data.stats.shares || '0',
                            'Image Count': data.media.imageCount || '0',
                            'Video Duration': data.media.videoDuration || '',
                            'Link Preview Title': data.media.linkPreview && data.media.linkPreview.title ? data.media.linkPreview.title : '',
                            'Link Preview URL': data.media.linkPreview && data.media.linkPreview.url ? data.media.linkPreview.url : ''
                        };
                    }

                    // --- Text Format (Legacy) ---
                    const parts = [];
                    // URL
                    if (settings.copy_includeMetadata && settings.copy_meta_url && data.meta.url) {
                        parts.push(data.meta.url + '\n');
                    }
                    // Author & Order
                    if (settings.copy_includeMetadata) {
                        let headerLine = '';
                        if (data.meta.order) headerLine += `[#${data.meta.order}] `;
                        if (settings.copy_meta_author_name && data.meta.author.length > 0) {
                            const authorStrings = data.meta.author.map(a => {
                                let s = a.name;
                                if (settings.copy_meta_author_link && a.link) s += ` (${a.link})`;
                                return s;
                            });
                            headerLine += authorStrings.join(' & ');
                        }
                        if (headerLine) parts.push(headerLine);
                    }
                    // Date & Stats
                    if (settings.copy_includeMetadata) {
                        let infoLine = '';
                        if (settings.copy_meta_date && data.meta.timestamp) infoLine += data.meta.timestamp;

                        // Stats
                        const stats = [];
                        if (settings.copy_meta_stats) {
                            if (settings.copy_meta_stats_total && data.stats.reactions.total) {
                                let s = `${data.stats.reactions.total} ${T.stats_label_reaction}`;
                                if (settings.copy_meta_stats_detailed && data.stats.reactions.detailed.length > 0) {
                                    s += ` (${data.stats.reactions.detailed.join(' | ')})`;
                                }
                                stats.push(s);
                            } else if (data.stats.reactions.detailed.length > 0) {
                                stats.push(data.stats.reactions.detailed.join(' | '));
                            }
                            if (data.stats.comments) stats.push(`💬 ${data.stats.comments}`);
                            if (data.stats.shares) stats.push(`↗️ ${data.stats.shares}`);
                        }
                        if (stats.length > 0) infoLine += (infoLine ? ' • ' : '') + stats.join(' | ');

                        // Image Count
                        if (settings.copy_meta_image_count && data.media.imageCount > 0) {
                            infoLine += (infoLine ? ' • ' : '') + `[${T.image_count_label}: ${data.media.imageCount}]`;
                        }
                        // Video Duration
                        if (settings.copy_meta_video_duration && data.media.videoDuration) {
                            const typeLabel = T.label_video || 'Video';
                            infoLine += (infoLine ? ' • ' : '') + `[${typeLabel}: ${data.media.videoDuration}]`;
                        }
                        if (infoLine) parts.push(infoLine);
                    }

                    parts.push(data.content ? '\n-----------------------------------\n' : '');

                    if (data.content) parts.push(data.content);
                    else parts.push('[No Text Content]');

                    if (data.media.linkPreview) {
                        const lp = data.media.linkPreview;
                        parts.push('\n-----------------------------------\n');
                        if (lp.title) parts.push(`➤ ${T.preview_label_title}: ${lp.title}`);
                        if (lp.source) parts.push(`➤ ${T.preview_label_source}: ${lp.source}`);
                        if (lp.desc) parts.push(`➤ ${T.preview_label_desc}: ${lp.desc}`);
                        if (lp.url) parts.push(`➤ ${T.preview_label_link}: ${lp.url}`);
                    }

                    return parts.join('\n');
                },

                /**
                 * Extracts link preview data object.
                 */
                _extractLinkPreviewData(postEl) {
                    const settings = this.app.state.settings;
                    if (!settings.copy_includeMetadata || !settings.copy_meta_link_preview) return null;
                    const T = this.app.state.T;
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;

                    const previewLinks = Array.from(postEl.querySelectorAll('a[role="link"]'));
                    let previewLink = null;
                    const titleEl = postEl.querySelector('[data-ad-rendering-role="title"]');

                    if (titleEl) {
                        const contentContainer = titleEl.closest('div[id]');
                        if (contentContainer) {
                            const linkedAnchor = postEl.querySelector(`a[aria-labelledby="${contentContainer.id}"]`);
                            if (linkedAnchor) previewLink = linkedAnchor;
                        }
                    }
                    if (!previewLink && titleEl) {
                        const container = titleEl.closest('div[class*="x"]');
                        if (container && container.parentElement) {
                            const overlay = container.parentElement.querySelector('a[href][role="link"]');
                            if (overlay && overlay.getAttribute('href')) previewLink = overlay;
                        }
                    }
                    if (!previewLink) {
                        previewLink = previewLinks.find(a => a.querySelector('[data-ad-rendering-role="title"]') && !a.closest(C_TOOLS.CONTENT_BODY));
                    }
                    if (!previewLink) {
                        previewLink = previewLinks.find(a => {
                            if (a.closest(C_TOOLS.CONTENT_BODY)) return false;
                            return a.querySelector('[style*="webkit-line-clamp"]');
                        });
                    }

                    if (titleEl || previewLink) {
                        let title = '';
                        if (titleEl) title = titleEl.textContent.trim();
                        else if (previewLink) {
                            const styledTitle = previewLink.querySelector('[style*="webkit-line-clamp"]');
                            if (styledTitle) title = styledTitle.textContent.trim();
                        }

                        let meta = '';
                        const metaNode = postEl.querySelector('[data-ad-rendering-role="meta"]');
                        if (metaNode) meta = metaNode.textContent.trim();
                        else if (titleEl) {
                            let curr = titleEl;
                            for (let i = 0; i < 5; i++) {
                                if (!curr || curr === postEl) break;
                                const prev = curr.previousElementSibling;
                                if (prev && prev.textContent.trim().length > 0 && !prev.querySelector('img')) {
                                    meta = prev.textContent.trim();
                                    break;
                                }
                                curr = curr.parentElement;
                            }
                        }
                        if (meta.length > 30) meta = '';

                        const descNode = postEl.querySelector('[data-ad-rendering-role="description"]');
                        const desc = descNode ? descNode.textContent.trim() : '';

                        let href = previewLink ? previewLink.getAttribute('href') : '';
                        if (href) {
                            try {
                                const urlObj = new URL(href, window.location.origin);
                                if (urlObj.hostname.includes('facebook.com') && urlObj.searchParams.has('u')) {
                                    href = decodeURIComponent(urlObj.searchParams.get('u'));
                                }
                                const cleanUrlObj = new URL(href, window.location.origin);
                                this.app.utils.cleanUrlParams(cleanUrlObj);
                                href = cleanUrlObj.toString();
                            } catch (e) { }
                        }
                        return { title, source: meta, desc, url: href };
                    }
                    return null;
                },

                /**
                 * Expands "Read More" links to ensure full text availability.
                 * @private
                 */
                async _expandReadMore(contentContainer) {
                    if (!contentContainer) return;
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const expandKeywords = this.app.config.TEXT_EXPANDER.TARGETS;
                    const expandBtn = Array.from(contentContainer.querySelectorAll(C_TOOLS.EXPAND_BTN))
                        .find(btn => expandKeywords.some(kw => btn.textContent.trim().includes(kw)) && btn.offsetParent !== null);
                    if (expandBtn) {
                        await new Promise((resolve) => {
                            expandBtn.click();
                            setTimeout(resolve, 150);
                        });
                    }
                },

                /**
                 * Processes the main content body, restoring emojis and formatting text.
                 * @private
                 */
                _processContentBody(contentContainer) {
                    if (!contentContainer) return '';
                    const settings = this.app.state.settings;
                    let targetContainer = contentContainer.cloneNode(true);

                    // Feature: Emoji Restoration
                    if (settings.copier_includeEmojis) {
                        const images = targetContainer.querySelectorAll('img[src*="emoji"][alt], img[alt]');
                        images.forEach(img => {
                            const src = img.getAttribute('src') || '';
                            const alt = img.getAttribute('alt');
                            if (alt && (src.includes('emoji') || img.className.includes('emoji') || src.includes('fbcdn.net'))) {
                                img.replaceWith(document.createTextNode(alt));
                            }
                        });
                    }

                    // Feature: Link Expansion, Sanitization, and Hashtag/Mention Handling
                    const links = targetContainer.querySelectorAll('a[href]');

                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (!href) return;

                        let fullUrl = href;

                        // Decode Shim
                        if (href.includes('l.facebook.com/l.php')) {
                            try {
                                const urlObj = new URL(href, window.location.origin);
                                const uParam = urlObj.searchParams.get('u');
                                if (uParam) fullUrl = decodeURIComponent(uParam);
                            } catch (e) { }
                        }

                        // Sanitize Params
                        try {
                            const urlObj = new URL(fullUrl, window.location.origin);
                            this.app.utils.cleanUrlParams(urlObj);
                            fullUrl = urlObj.href;
                        } catch (e) { }

                        // Hashtag Decode
                        const isHashtag = href.includes('/hashtag/');
                        if (isHashtag) {
                            try {
                                fullUrl = decodeURIComponent(fullUrl);
                            } catch (e) { }
                        }


                        const originalText = link.textContent.trim();
                        const isUrlText = /^(https?:\/\/|www\.|[a-z0-9.-]+\.[a-z]{2,})/i.test(originalText) || originalText.includes('...');
                        const isMention = !isHashtag && !isUrlText;

                        if (isHashtag) {
                            if (settings.copier_expandHashtags) {
                                link.textContent = `${originalText} (${fullUrl})`;
                            }
                            return;
                        }

                        if (isMention) {
                            if (settings.copier_expandMentions) {
                                link.textContent = `${originalText} (${fullUrl})`;
                            }
                            return;
                        }

                        link.textContent = fullUrl;
                    });

                    return this.app.utils.smartTextExtract(targetContainer);
                },

                /**
                 * Extracts link preview information including title, description, and source.
                 * @private
                 */
                _extractLinkPreview(postEl) {
                    const settings = this.app.state.settings;
                    const T = this.app.state.T;
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;

                    // --- 5. Link Preview ---
                    if (settings.copy_includeMetadata && settings.copy_meta_link_preview) {
                        const previewLinks = Array.from(postEl.querySelectorAll('a[role="link"]'));
                        let previewLink = null;

                        // Identify the Title Element first (Anchor point)
                        const titleEl = postEl.querySelector('[data-ad-rendering-role="title"]');

                        // Strategy 1: ID Association (Robust for Overlay Links)
                        // New FB structure: Content <div id="A"> + Link <a aria-labelledby="A">
                        if (titleEl) {
                            const contentContainer = titleEl.closest('div[id]');
                            if (contentContainer) {
                                const id = contentContainer.id;
                                // Look for specific sibling link referencing this content
                                const linkedAnchor = postEl.querySelector(`a[aria-labelledby="${id}"]`);
                                if (linkedAnchor) previewLink = linkedAnchor;
                            }
                        }

                        // Strategy 2: Standard Overlay (Ancestor search)
                        if (!previewLink && titleEl) {
                            const container = titleEl.closest('div[class*="x"]'); // Generic container
                            if (container && container.parentElement) {
                                // Search in parent's scope for the overlay link
                                const overlay = container.parentElement.querySelector('a[href][role="link"]');
                                if (overlay && overlay.getAttribute('href')) previewLink = overlay;
                            }
                        }

                        // Strategy 3: Standard Nesting (Old FB)
                        if (!previewLink) {
                            previewLink = previewLinks.find(a =>
                                a.querySelector('[data-ad-rendering-role="title"]') &&
                                !a.closest(C_TOOLS.CONTENT_BODY)
                            );
                        }

                        // Strategy 4: Visual Fallback
                        if (!previewLink) {
                            previewLink = previewLinks.find(a => {
                                if (a.closest(C_TOOLS.CONTENT_BODY)) return false;
                                return a.querySelector('[style*="webkit-line-clamp"]');
                            });
                        }

                        // Extract Data
                        if (titleEl || previewLink) {
                            const parts = [];
                            const SECTION_SEPARATOR = '\n-----------------------------------\n';
                            parts.push(SECTION_SEPARATOR);

                            // 1. Title
                            let title = '';
                            if (titleEl) {
                                title = titleEl.textContent.trim();
                            } else if (previewLink) {
                                const styledTitle = previewLink.querySelector('[style*="webkit-line-clamp"]');
                                if (styledTitle) title = styledTitle.textContent.trim();
                            }

                            // 2. Source / Meta (Enhanced for Small Previews)
                            let meta = '';
                            const metaNode = postEl.querySelector('[data-ad-rendering-role="meta"]');

                            if (metaNode) {
                                meta = metaNode.textContent.trim();
                            } else if (titleEl) {
                                let curr = titleEl;
                                // Traverse up a few levels to find the "row" wrapper
                                for (let i = 0; i < 5; i++) {
                                    if (!curr || curr === postEl) break;
                                    const prev = curr.previousElementSibling;
                                    // If we find a previous sibling with text that isn't an image/icon
                                    if (prev && prev.textContent.trim().length > 0 && !prev.querySelector('img')) {
                                        meta = prev.textContent.trim();
                                        break;
                                    }
                                    curr = curr.parentElement;
                                }
                            }
                            if (meta.length > 30) meta = '';

                            // 3. Description
                            const descNode = postEl.querySelector('[data-ad-rendering-role="description"]');
                            const desc = descNode ? descNode.textContent.trim() : '';

                            // 4. Link URL
                            let href = previewLink ? previewLink.getAttribute('href') : '';
                            if (href) {
                                try {
                                    const urlObj = new URL(href, window.location.origin);
                                    if (urlObj.hostname.includes('facebook.com') && urlObj.searchParams.has('u')) {
                                        href = decodeURIComponent(urlObj.searchParams.get('u'));
                                    }
                                    // Sanitization
                                    const cleanUrlObj = new URL(href, window.location.origin);
                                    this.app.utils.cleanUrlParams(cleanUrlObj);
                                    href = cleanUrlObj.toString();
                                } catch (e) { }
                            }

                            if (title) parts.push(`➤ ${T.preview_label_title}: ${title}`);
                            if (meta) parts.push(`➤ ${T.preview_label_source}: ${meta}`);
                            if (desc) parts.push(`➤ ${T.preview_label_desc}: ${desc}`);
                            if (href) parts.push(`➤ ${T.preview_label_link}: ${href}`);

                            return parts.join('\n');
                        }
                    }
                    return null;
                },

                /**
                 * Extracts text content using layout topology, handling background posts uniquely.
                 * @param {HTMLElement} container - The container to extract text from.
                 * @returns {string} The extracted text.
                 */
                extractTextByTopology(container) {
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;

                    // Feature Detection: Background Image Post
                    // Detect specific style pattern: background-image present + centered text usually
                    const hasBgImage = container.querySelector('div[style*="background-image"]');

                    if (hasBgImage) {
                        // Strategy: Get all potential text blocks, then deduplicate content.
                        // Background posts often render text twice: once for visual, once for a11y (aria-hidden).
                        // We cannot rely on 'x6s0dn4' class, so we use content equality check.

                        const candidates = Array.from(container.querySelectorAll('div[dir="auto"], div[style*="text-align: center"]'));
                        // Filter for leaf-ish nodes that actually contain text
                        const textBlocks = candidates.filter(el => {
                            // Must have text
                            if (!el.innerText.trim()) return false;
                            // Must not contain other block candidates (ensure it's a leaf node)
                            return !el.querySelector('div[dir="auto"]');
                        });

                        const uniqueText = [];
                        const seenContent = new Set();

                        for (const block of textBlocks) {
                            const text = block.innerText.trim();
                            if (!text) continue;
                            if (seenContent.has(text)) continue; // Skip duplicates

                            seenContent.add(text);
                            uniqueText.push(text);
                        }

                        if (uniqueText.length > 0) {
                            return uniqueText.join('\n');
                        }

                        // Fallback
                        return container.innerText.trim();
                    }

                    // Standard Topology Extraction (for normal posts)
                    const rawBlocks = container.querySelectorAll(C_TOOLS.TEXT_BLOCKS);
                    const leafBlocks = Array.from(rawBlocks).filter(el => {
                        return el.querySelectorAll(C_TOOLS.TEXT_BLOCKS).length === 0 && el.innerText.trim().length > 0;
                    });

                    if (leafBlocks.length === 0) return container.innerText.trim();

                    let finalString = leafBlocks[0].innerText.trim();
                    for (let i = 1; i < leafBlocks.length; i++) {
                        const prevBlock = leafBlocks[i - 1];
                        const currBlock = leafBlocks[i];
                        const currText = currBlock.innerText.trim();

                        const isSibling = currBlock.parentElement === prevBlock.parentElement;
                        const separator = isSibling ? '\n' : '\n\n';

                        finalString += separator + currText;
                    }
                    return finalString;
                },

                // --- Shared Helpers ---
                async animateButtonFeedback(button, status, originalContent) {
                    const T = this.app.state.T;
                    const settings = this.app.state.settings;
                    const iconWrapper = button.querySelector('.gm-icon-wrapper');
                    if (iconWrapper) iconWrapper.innerHTML = status === 'success' ? this.icons.success : this.icons.failure;

                    button.style.backgroundColor = status === 'success' ? 'var(--positive-background)' : 'var(--negative-background)';
                    await this.app.utils.delay(1200);
                    button.style.pointerEvents = 'auto';
                    button.style.backgroundColor = 'transparent';
                    button.innerHTML = originalContent;
                },

                // --- Injection Logic ---
                reEvaluateAllButtons() {
                    this.cleanupButtons();
                    this.scanNodeForPosts(document.body);
                },
                cleanupButtons() {
                    const C = this.app.config.SELECTORS.POST_TOOLS;
                    document.querySelectorAll(`[data-${C.PROCESSED_MARKER}]`).forEach(el => {
                        el.removeAttribute(`data-${C.PROCESSED_MARKER}`);
                        el.querySelectorAll(`.gm-tools-wrapper`).forEach(wrapper => wrapper.remove());
                    });
                },
                scanNodeForPosts(node) {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    const C_GLOBAL = this.app.config.SELECTORS.GLOBAL;
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const SCAN_TARGETS = `${C_GLOBAL.POST_CONTAINER}, ${C_GLOBAL.DIALOG}`;
                    const targets = node.matches(SCAN_TARGETS) ? [node] : [];
                    targets.push(...node.querySelectorAll(SCAN_TARGETS));

                    new Set(targets).forEach(target => {
                        if (target.hasAttribute(`data-${C_TOOLS.PROCESSED_MARKER}`)) return;
                        if (target.matches(C_GLOBAL.POST_CONTAINER) && !target.parentElement.closest(C_GLOBAL.POST_CONTAINER)) {
                            const headerEl = target.querySelector(C_TOOLS.FEED_POST_HEADER);
                            if (headerEl) this.addButtonsToPost(target, headerEl, false);
                        } else if (target.matches(C_GLOBAL.DIALOG)) {
                            this.processDialogPost(target);
                        }
                    });
                },
                processDialogPost(dialogEl) {
                    this.isModalOpening = true;
                    let observer;
                    const C_GLOBAL = this.app.config.SELECTORS.GLOBAL;
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const cleanup = () => {
                        if (observer) observer.disconnect();
                        clearTimeout(timeoutId);
                        setTimeout(() => { this.isModalOpening = false; }, 200);
                    };
                    const timeoutId = setTimeout(cleanup, 3000);
                    const findAndProcessHeader = () => {
                        const postEl = dialogEl.querySelector(C_GLOBAL.POST_CONTAINER);
                        if (postEl) {
                            const headerEl = postEl.querySelector(C_TOOLS.DIALOG_POST_HEADER);
                            if (headerEl) {
                                this.addButtonsToPost(postEl, headerEl, true);
                                cleanup();
                                return true;
                            }
                        }
                        return false;
                    };
                    if (findAndProcessHeader()) return;
                    observer = new MutationObserver(findAndProcessHeader);
                    observer.observe(dialogEl, { childList: true, subtree: true });
                },
                addButtonsToPost(postEl, headerEl, isDialog = false) {
                    const settings = this.app.state.settings;
                    const C = this.app.config.SELECTORS.POST_TOOLS;

                    if (!settings.permalinkCopierEnabled && !settings.enableCopyContentButton) return;
                    if (!headerEl?.parentElement || headerEl.parentElement.querySelector(`.gm-tools-wrapper`)) return;

                    postEl.setAttribute(`data-${C.PROCESSED_MARKER}`, 'true');
                    const insertionPoint = headerEl.parentElement;
                    // Ensure flexible layout to accommodate new buttons
                    Object.assign(insertionPoint.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' });

                    const wrapper = this.app.utils.createStyledElement('div', { display: 'flex', alignItems: 'center' }, { className: 'gm-tools-wrapper' });
                    if (isDialog) wrapper.style.marginRight = '16px';

                    // 1. Copy Content Button (Left) - Now Smart
                    if (settings.enableCopyContentButton) {
                        const copyBtn = this.createButton('copy-content', this.icons.copy, this.app.state.T.copier_copyContent);
                        wrapper.appendChild(copyBtn);
                    }

                    // 2. Permalink Button (Right) - Icon Only
                    if (settings.permalinkCopierEnabled) {
                        const contentType = this.determinePostContentType(postEl);
                        const isSmart = settings.copier_useSmartLink && contentType === 'standard';
                        const icon = isSmart ? this.icons.smart : this.icons.direct;
                        const title = isSmart ? this.app.state.T.copier_fetchPermalinkSmart : this.app.state.T.copier_fetchPermalinkDirect;
                        const permalinkBtn = this.createButton('permalink', icon, title);
                        wrapper.appendChild(permalinkBtn);
                    }

                    insertionPoint.appendChild(wrapper);
                },
                createButton(action, svgIcon, title) {
                    const C = this.app.config.SELECTORS.POST_TOOLS;

                    const clickHandler = (e) => {
                        if (action === 'permalink') {
                            this.handlePermalinkClick(e, e.currentTarget);
                        } else if (action === 'copy-content') {
                            this.handleCopyContentClick(e, e.currentTarget);
                        }
                    };

                    return this.app.utils.createStyledElement('div', {
                        cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--secondary-text)',
                        lineHeight: '1', marginLeft: '8px', border: '1px solid var(--media-inner-border)',
                        transition: 'all 0.15s ease-out', userSelect: 'none',
                        width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }, {
                        className: C.BUTTON_CLASS,
                        role: 'button',
                        tabIndex: 0,
                        title: title,
                        'data-action': action,
                        innerHTML: `<span class="gm-icon-wrapper">${svgIcon}</span>`,
                        on: {
                            click: clickHandler,
                            mouseover: (e) => { if (e.currentTarget.style.pointerEvents !== 'none') e.currentTarget.style.backgroundColor = 'var(--hover-overlay)'; },
                            mouseout: (e) => { if (e.currentTarget.style.pointerEvents !== 'none') e.currentTarget.style.backgroundColor = 'transparent'; }
                        }
                    });
                },

                // --- Legacy Logic: Determine URL Type ---
                determinePostContentType(postEl) {
                    if (!postEl) return 'unknown';
                    const timestampUrl = this.getPermalinkFromTimestamp(postEl);
                    if (!timestampUrl) {
                        const hasReel = postEl.querySelector('a[href*="/reel/"], video');
                        if (hasReel) return 'reel';
                        const hasVideo = postEl.querySelector('a[href*="/videos/"], a[href*="/watch/"]');
                        if (hasVideo) return 'video';
                        return 'standard';
                    }
                    try {
                        const { pathname } = new URL(timestampUrl);
                        if (pathname.includes('/reel/')) return 'reel';
                        if (pathname.includes('/videos/') || pathname.includes('/watch/')) return 'video';
                        if (pathname.includes('/events/')) return 'event';
                        return 'standard';
                    } catch (e) { return 'standard'; }
                },
                findTimestampLink(postEl) {
                    if (!postEl) return null;
                    const candidates = Array.from(postEl.querySelectorAll('a[role="link"]'));
                    for (const link of candidates) {
                        const href = link.href || '';
                        const label = link.getAttribute('aria-label') || '';
                        const text = link.textContent || '';
                        const hasTimeReference = /\d/.test(label) || /[0-9dhmw]/.test(text);
                        const hasPostReference = href.includes('/posts/') || href.includes('/videos/') || href.includes('/reel/') || href.includes('fbid=') || href.includes('story_fbid=') || href.includes('/events/');
                        if (hasTimeReference && hasPostReference) return link;
                    }
                    return null;
                },
                getPermalinkFromTimestamp(postEl) {
                    try {
                        const timeLink = this.findTimestampLink(postEl);
                        if (!timeLink?.href) return null;
                        const rawUrl = new URL(timeLink.href, window.location.origin);
                        const searchParams = rawUrl.searchParams;
                        const basePath = `${rawUrl.protocol}//${rawUrl.host}${rawUrl.pathname}`;
                        if (rawUrl.pathname.includes('/watch/')) {
                            const videoId = searchParams.get('v');
                            if (videoId) return `${basePath}?v=${videoId}`;
                        } else if (rawUrl.pathname.includes('permalink.php') || rawUrl.search.includes('story_fbid=')) {
                            const storyFbid = searchParams.get('story_fbid');
                            const id = searchParams.get('id');
                            if (storyFbid && id) return `${basePath}?story_fbid=${storyFbid}&id=${id}`;
                        } else if (rawUrl.pathname.includes('photo.php') || searchParams.has('fbid')) {
                            const fbid = searchParams.get('fbid');
                            const setId = searchParams.get('set');
                            if (fbid && setId) return `${basePath}?fbid=${fbid}&set=${setId}`;
                            if (fbid) return `${basePath}?fbid=${fbid}`;
                        } else if (rawUrl.search.includes('multi_permalinks=')) {
                            const permalinkId = searchParams.get('multi_permalinks');
                            return basePath.replace(/\/$/, '') + `/posts/${permalinkId}/`;
                        }
                        return basePath;
                    } catch (e) { return null; }
                },
                getAnyPostUrl(postEl) {
                    if (!postEl) return null;
                    const linkSelectors = ['a[href*="/photo/"]', 'a[href*="fbid="]', 'a[href*="/reel/"]', 'a[href*="/videos/"]', 'a[href*="/watch/"]', 'a[href*="/events/"]'];
                    for (const selector of linkSelectors) {
                        const linkEl = postEl.querySelector(selector);
                        if (linkEl?.href && !linkEl.href.includes('/profile.php')) return linkEl.href;
                    }
                    const timeElement = this.findTimestampLink(postEl);
                    if (timeElement?.href) return timeElement.href;
                    return null;
                },
                getSourceUrlForWorker(postEl) { return this.getPermalinkFromTimestamp(postEl) || this.getAnyPostUrl(postEl); },
                startObserver() { this.observer = new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(n => this.scanNodeForPosts(n)))); this.scanNodeForPosts(document.body); this.observer.observe(document.body, { childList: true, subtree: true }); },
                fetchPermalinkInBackground(postEl) {
                    return new Promise((resolve) => {
                        const sourceUrl = this.getSourceUrlForWorker(postEl);
                        if (!sourceUrl) { return resolve({ url: null, method: 'worker_no_source_url' }); }
                        const taskId = `fpc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                        const workerUrl = new URL(sourceUrl);
                        workerUrl.searchParams.set(this.app.config.WORKER_PARAM, taskId);
                        let listenerId;
                        const timeoutId = setTimeout(() => {
                            if (listenerId) GM_removeValueChangeListener(listenerId);
                            resolve({ url: null, method: 'worker_timeout' });
                        }, 8000);
                        listenerId = GM_addValueChangeListener(taskId, (name, oldVal, newVal, remote) => {
                            if (remote && typeof newVal.permalink !== 'undefined') {
                                clearTimeout(timeoutId);
                                GM_removeValueChangeListener(listenerId);
                                GM_setValue(taskId, { resolved: true });
                                resolve({ url: newVal.permalink, method: "worker_" + newVal.method });
                            }
                        });
                        GM_openInTab(workerUrl.href, { active: false, insert: true, setParent: true });
                    });
                },
                getPermalinkDirectlyFromElement(postEl) {
                    const dirtyUrl = this.getSourceUrlForWorker(postEl);
                    if (!dirtyUrl) return { url: null, method: 'direct_no_url' };
                    try {
                        const urlObj = new URL(dirtyUrl);
                        urlObj.search = '';
                        const cleanUrl = urlObj.href.replace(/\/$/, '');
                        return { url: cleanUrl, method: 'direct_cleaned' };
                    } catch (e) { return { url: null, method: 'direct_parse_error' }; }
                },
            },
        },

        handleWorkerTask: async function () {
            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get(this.config.WORKER_PARAM);
            if (!taskId) return;

            // Worker Mode: Hide everything immediately
            document.body.style.display = 'none';

            // Robustness Fix: Direct access to required settings
            // We avoid initializing the entire app or settingsManager to prevent race conditions or dependency errors in the worker context/tab.
            const permalinkFormat = GM_getValue('copier_permalinkFormat', 'author_id');

            const extractId = url => url ? (url.match(/(?:posts|videos|reel|v|story_fbid|multi_permalinks)(?:[=/].*?)(\d{15,})/)?.[1] || null) : null;
            const extractUser = url => url ? (url.match(/facebook\.com\/([a-zA-Z0-9.]+)\/(?:posts|videos|reels)\//)?.[1] || null) : null;

            const formatPermalink = info => {
                if (!info?.postId) return null;

                if (permalinkFormat === 'shortest') return `https://fb.com/${info.postId}`;

                if (permalinkFormat === 'full' && info.canonicalUrl) {
                    try {
                        const u = new URL(info.canonicalUrl);
                        u.search = '';
                        return u.href.replace(/\/$/, '');
                    } catch (e) { }
                }

                if (permalinkFormat === 'username' && info.username && info.username !== 'profile.php') {
                    return `https://www.facebook.com/${info.username}/posts/${info.postId}`;
                }

                // Default / 'author_id'
                if (info.profileId) return `https://www.facebook.com/${info.profileId}/posts/${info.postId}`;
                return `https://www.facebook.com/posts/${info.postId}`; // Fallback if no profile ID
            };

            const findNestedValue = (obj, key) => (obj && typeof obj === 'object') ? (key in obj ? obj[key] : Object.values(obj).reduce((acc, v) => acc ?? findNestedValue(v, key), undefined)) : undefined;

            const getFromRelay = () => { for (const script of document.querySelectorAll('script[type="application/json"]')) try { const d = JSON.parse(script.textContent); const id = findNestedValue(d, 'storyID'); if (id) { const ids = atob(id).match(/(\d+)/g); if (ids?.length >= 2) return { profileId: ids[0], postId: ids[1], method: 'relay' }; } } catch (e) { } return null; };
            const getFromHead = () => { const url = document.querySelector('link[rel="canonical"]')?.href; if (!url) return null; return { postId: extractId(url), username: extractUser(url), canonicalUrl: url, method: 'head' }; };
            const getFromBody = () => { for (const script of document.querySelectorAll('script[type="application/json"]')) try { if (!script.textContent.includes('debug_info') && !script.textContent.includes('share_fbid')) continue; const d = JSON.parse(script.textContent); const dbg = findNestedValue(d, 'debug_info'); if (dbg) { const ids = atob(dbg).match(/(\d+)/g); if (ids?.length >= 2) return { profileId: ids[0], postId: ids[1], method: 'body_debug' }; } const fbid = findNestedValue(d, 'share_fbid'); if (fbid) return { postId: fbid, method: 'body_fbid' }; } catch (e) { } return null; };

            const collectInfo = () => [getFromRelay(), getFromHead(), getFromBody()].reduce((acc, info) => ({ ...info, ...acc }), {});

            const determinePermalink = () => { const info = collectInfo(); return info.postId ? { url: formatPermalink(info), method: info.method || 'unknown' } : { url: null }; };

            const findWithRetry = async (timeout = 5000) => {
                const start = Date.now();
                while (Date.now() - start < timeout) {
                    const result = determinePermalink();
                    if (result.url) return result;
                    await this.utils.delay(350);
                }
                return { url: null, method: 'worker_timeout' };
            };

            let listenerId;
            const fallbackUrl = window.location.href.split('?')[0];

            try {
                const result = await findWithRetry();
                const permalink = result.url ?? fallbackUrl;
                const method = result.method || 'fallback';

                GM_setValue(taskId, { permalink, method });
            } catch (error) {
                console.error(`${this.config.LOG_PREFIX} [Worker] Critical Error:`, error);
                // Report error back to main tab via method field
                GM_setValue(taskId, { permalink: fallbackUrl, method: 'error_exception' });
            } finally {
                // Safety cleanup: Close tab after 5s if main tab doesn't acknowledge
                const closeTimeout = setTimeout(() => {
                    if (listenerId) GM_removeValueChangeListener(listenerId);
                    window.close();
                }, 5000);

                // Wait for main tab to acknowledge receipt (resolved: true)
                listenerId = GM_addValueChangeListener(taskId, (name, oldVal, newVal, remote) => {
                    if (remote && newVal.resolved) {
                        clearTimeout(closeTimeout);
                        GM_removeValueChangeListener(listenerId);
                        window.close();
                    }
                });
            }
        },

        init() {
            const lang = navigator.language.toLowerCase();
            if (lang.startsWith('ja')) this.state.T = this.config.STRINGS.ja;
            else if (lang.startsWith('zh')) this.state.T = this.config.STRINGS['zh-TW'];
            else this.state.T = this.config.STRINGS.en;

            this.modules.interceptor.init(this);
            this.modules.historyInterceptor.init(this);
            this.modules.settingsManager.init(this);

            window.addEventListener('DOMContentLoaded', () => {
                for (const moduleName in this.modules) {
                    const module = this.modules[moduleName];
                    const isPreloaded = ['interceptor', 'historyInterceptor', 'settingsManager'].includes(moduleName);

                    if (typeof module.init === 'function' && !isPreloaded) {
                        try {
                            if (moduleName === 'floatingNavigator' && !this.state.settings.floatingNavEnabled) continue;
                            if (moduleName === 'timelineNavigator' && !this.state.settings.timelineNavEnabled) continue;
                            if (moduleName === 'errorRecovery' && !this.state.settings.errorRecoveryEnabled) continue;
                            if (moduleName === 'transparencyActions' && !this.state.settings.transparencyButtonsEnabled) continue;
                            if (moduleName === 'idRevealer' && !this.state.settings.idRevealerEnabled) continue;
                            if (moduleName === 'uiCleaner' && !this.state.settings.hideUselessElements) continue;
                            if (moduleName === 'contentExpander' && !this.state.settings.expandContentEnabled) continue;

                            // Initialize the Link Intervention module
                            if (moduleName === 'linkIntervention') {
                                module.init(this);
                                continue;
                            }

                            module.init(this);
                        } catch (error) {
                            console.error(`${this.config.LOG_PREFIX} Failed to initialize module '${moduleName}':`, error);
                        }
                    }
                }
                console.log(`${this.config.LOG_PREFIX} All modules initialized.`);
            });
        },
    };

    if (window.location.search.includes(app.config.WORKER_PARAM)) {
        window.addEventListener('DOMContentLoaded', () => app.handleWorkerTask());
    } else {
        if (app.utils.isLoggedIn()) {
            console.log(`${app.config.LOG_PREFIX} Logged-in state detected. Script terminated.`);
            return;
        }
        console.log(`${app.config.LOG_PREFIX} Logged-out state detected. Script active.`);
        app.init();
    }
})();
