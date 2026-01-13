// ==UserScript==
// @name         Facebook Login Wall Remover
// @name:en      Facebook Login Wall Remover
// @name:zh-TW   Facebook 登入牆移除器
// @name:ja      Facebook ログインウォールリムーバー
// @version      0.6.0
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

(function() {
    'use strict';

    const app = {
        // --- APPLICATION CONFIGURATION ---
        config: {
            LOG_PREFIX: `[FB Login Wall Remover]`,
            THROTTLE_DELAY: 250,
            PROCESSED_MARKER: 'gmProcessed',
            WORKER_PARAM: 'fpc_worker_task',
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
                // Verified reliable strings from testing
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
                MAX_ATTEMPTS: 20, // 5 seconds
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
            LOGIN_STATE_MARKERS: {
                LOGGED_OUT: [
                    { selector: 'form#login_form', reason: 'Primary login form element' },
                    { selector: 'input[name="pass"]', reason: 'Password input field, tied to backend logic' },
                    { selector: 'input[name="email"]', reason: 'Email/Phone input field, also tied to backend' },
                    { selector: 'a[href*="/recover/initiate"]', reason: 'Forgot Account link, a core function' },
                    { selector: 'a[href*="/login/"]', reason: 'Any link explicitly pointing to a login page' }
                ],
                LOGGED_IN: [
                    { selector: 'input[type="search"]', reason: 'Search input field in the header' },
                    { selector: 'a[href="/friends/"]', reason: 'Friends tab in main navigation' },
                    { selector: 'a[href="/watch/?ref=tab"]', reason: 'Watch tab in main navigation' },
                    { selector: 'a[href*="/groups/"]', reason: 'Groups tab in main navigation' },
                    { selector: 'a[href*="/gaming/"]', reason: 'Gaming tab in main navigation' }
                ]
            },
            SELECTORS: {
                GLOBAL: {
                    POST_CONTAINER: 'div[role="article"]',
                    MODAL_CONTAINER: 'div.__fb-light-mode',
                    DIALOG: '[role="dialog"]',
                    LOGIN_FORM: 'form#login_form, form[id="login_popup_cta_form"]',
                    MEDIA_LINK: `a[href*="/photo"], a[href*="fbid="], a[href*="/videos/"], a[href*="/watch/"], a[href*="/reel/"]`,
                    CLOSE_BUTTON: [
                        "Close", "關閉", "閉じる", "Cerrar", "Fermer", "Schließen", "Fechar", "Chiudi", "Sluiten", "Закрыть", "Kapat", "Zamknij",
                        "Tutup", "Đóng", "ปิด", "Zatvori", "Zavrieť", "Zavřít", "Bezárás", "Stäng", "Luk", "Lukk", "Sulje", "Κλείσιμο",
                        "Închide", "إغلاق", "סגור"
                    ].map(label => `[aria-label="${label}"][role="button"]`).join(', ') + ', div[role="button"]:has(i[data-visualcompletion="css-img"])',
                },
                NAVIGATOR: {
                    HIGHLIGHT_CLASS: 'gm-post-highlight',
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
            STRINGS: {
                en: {
                    notificationDeadlock: 'A login prompt was hidden, but the feed can no longer load new content.\n[Pro-Tip] To prevent the feed from locking, get used to opening links in a new tab (middle-click). Please reload to continue browsing.',
                    notificationSettingsReload: 'Some settings have been updated. Please reload the page for them to take full effect.',
                    resetSettings: 'Reset Settings',
                    resetSettingsConfirm: 'Are you sure you want to reset all settings to their defaults? This action cannot be undone.',
                    notificationSettingsReset: 'Settings have been reset to default. A page reload may be required.',
                    menuResetSettings: '🚨 Reset All Settings',
                    autoOpenMediaInNewTab: 'Auto-open media in new tab (prevents deadlock)',
                    showDeadlockNotification: 'Show deadlock notification',
                    hideUselessElements: 'Hide useless UI elements (for guest)',
                    hidePostStats: 'Hide post stats (Likes, Comments counts)',
                    autoUnmuteEnabled: 'Automatically unmute videos',
                    postNumberingEnabled: 'Display post order numbers on feed',
                    expandContentEnabled: 'Auto-expand post content (See more)',
                    errorRecoveryEnabled: 'Auto-reload on error page (Button detection)',
                    transparencyButtonsEnabled: 'Show Page Transparency shortcuts (Bottom-Left)',
                    idRevealerEnabled: 'Enable ID Revealer (Click Title)',
                    idRevealerTooltip: 'Click to reveal Profile ID & Info',
                    idRevealerLinkFormat: 'ID Link Format',
                    idFormatUserID: 'User ID URL (facebook.com/id)',
                    idFormatClassic: 'Classic (profile.php?id=)',
                    idFormatUsername: 'Username (Current URL)',
                    id_copy_all: 'Copy All Info',
                    id_label_user: 'User ID',
                    id_label_page: 'Page ID',
                    id_label_meta: 'Profile ID',
                    profile_name_label: 'Name',
                    profile_url_label: 'Profile URL',
                    copy_success_generic: '{label} Copied',
                    all_copied: 'All Info Copied',
                    setVolumeLabel: 'Auto-unmute volume',
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
                    searchTooltipPosts: 'Search for posts within the current page (or all of Facebook if on the homepage).',
                    searchTooltipPhotos: 'Search for photos within the current page.',
                    searchTooltipVideos: 'Search for videos within the current page.',
                    searchTooltipReels: 'Search all of Facebook for Reels using the current page\'s name as a keyword.',
                    searchTooltipPages: 'Search all of Facebook for Pages, people, or organizations.',
                    searchTooltipPeople: 'Search all of Facebook for personal profiles.',
                    searchTooltipGroups: 'Search all of Facebook for groups.',
                    searchTooltipGlobalPosts: 'Search all of Facebook for public posts.',
                    searchTooltipGlobalVideos: 'Search all of Facebook for videos using the internal Watch search.',
                    searchTooltipEvents: 'Search all of Facebook for events using the internal Events search.',
                    searchTooltipMarketplace: 'Search all of Facebook Marketplace for item listings.',
                    searchAllContextualTooltip: 'List all {scope} on this page using Google Search',
                    navigateToContextual: 'Go to {scope} section',
                    pinToolbar: 'Pin toolbar',
                    unpinToolbar: 'Unpin toolbar',
                    shortcutWatch: 'Go to Watch',
                    shortcutEvents: 'Go to Events',
                    shortcutMarketplace: 'Go to Marketplace',
                    settingsTitle: 'Settings',
                    saveAndClose: 'Save & Close',
                    menuSettings: '⚙️ Settings',
                    keyboardNavEnabled: 'Enable keyboard navigation',
                    keyNavNextPrimary: 'Next Post (Primary)',
                    keyNavPrevPrimary: 'Previous Post (Primary)',
                    keyNavNextSecondary: 'Next Post (Secondary)',
                    keyNavPrevSecondary: 'Previous Post (Secondary)',
                    floatingNavEnabled: 'Enable floating navigation buttons',
                    floatingNavPrevTooltip: 'Previous Post',
                    floatingNavNextTooltip: 'Next Post',
                    navigationScrollAlignment: 'Scroll alignment',
                    scrollAlignmentCenter: 'Center',
                    scrollAlignmentTop: 'Top',
                    enableSmoothScrolling: 'Enable smooth scrolling',
                    continuousNavInterval: 'Continuous navigation interval',
                    wheelNavEnabled: 'Enable mouse wheel navigation',
                    wheelNavModifier: 'Wheel navigation modifier key',
                    modifierAlt: 'Alt',
                    modifierCtrl: 'Ctrl',
                    modifierShift: 'Shift',
                    modifierNone: 'None (replaces page scroll)',
                    settingsColumnGeneral: 'General',
                    settingsColumnNavigation: 'Navigation',
                    settingsColumnTools: 'Post Tools',
                    copier_enablePermalink: 'Enable Permalink Button',
                    copier_enableCopyContent: 'Enable Copy Content Button',
                    copier_fetchPermalinkSmart: 'Permalink (Smart)',
                    copier_fetchPermalinkDirect: 'Permalink (Direct)',
                    copier_copyContent: 'Copy Post Content',
                    copier_copyContentSuccess: '✅ Content Copied',
                    copier_copyContentFailed: '❌ Copy Failed',
                    copier_processing: 'Processing...',
                    copier_successPermalink: '✅ Copied',
                    copier_failure: '❌ Failed',
                    copier_notificationPermalinkCopied: 'Permalink copied to clipboard:\n{url}',
                    copier_notificationErrorGeneric: 'Failed to fetch permalink.',
                    copier_notificationErrorNoSourceUrl: 'Failed: Could not find a source URL.',
                    copier_notificationErrorTimeout: 'Failed: Background fetch timed out.',
                    copier_notificationContentNotFound: '❌ Content block not found.',
                    copier_menu_useSmartLink: 'Auto-Fetch Permalinks (Smart Mode)',
                    copier_menu_showButtonText: 'Show Button Text',
                    copier_menu_permalinkFormat: 'Permalink Format',
                    copier_format_full: 'Full URL (with slug)',
                    copier_format_username: 'Username + Post ID',
                    copier_format_author_id: 'Author ID + Post ID (Most Reliable)',
                    copier_format_shortest: 'Shortest (fb.com, less compatible)',
                    tooltipAds: 'Go to Ad Library (About)',
                    tooltipTransparency: 'Go to Page transparency',
                    notificationReelSearchError: 'Cannot get current page name for Reel search.',
                    copier_includeEmojis: 'Include emojis in copied text',
                    // Auto Loader & Batch Copier
                    autoLoader_batchSize: 'Batch Auto-Load Count',
                    tooltipAutoLoadStart: 'Auto-Load Posts',
                    tooltipAutoLoadStop: 'Stop Loading',
                    tooltipBatchCopy: 'Batch Copy All Posts',
                    autoLoad_status_loading: 'Loading... ({current}/{target})',
                    autoLoad_status_retrying: 'Retrying... ({count}/{max})',
                    autoLoad_status_success: 'Auto-load complete.',
                    autoLoad_status_stopped: 'Stopped by user.',
                    autoLoad_status_deadlock: 'Deadlock detected. Stopping.',
                    batchCopy_start: 'Processing {count} posts...',
                    batchCopy_success: '✅ Copied {count} posts to clipboard.',
                    batchCopy_empty: 'No posts to copy.',
                },
                'zh-TW': {
                    notificationDeadlock: '登入提示已隱藏，動態消息將無法載入新內容。\n【提示】為避免動態消息卡住，請養成用滑鼠中鍵在新分頁開啟連結的習慣。請重新整理頁面以繼續瀏覽。',
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
                    postNumberingEnabled: '在動態消息上顯示貼文順序',
                    expandContentEnabled: '自動展開貼文內容 (查看更多)',
                    errorRecoveryEnabled: '錯誤頁面自動恢復 (按鈕偵測)',
                    transparencyButtonsEnabled: '顯示粉絲專頁資訊透明度捷徑按鈕 (左下角)',
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
                    setVolumeLabel: '自動音量大小',
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
                    settingsTitle: '設定',
                    saveAndClose: '儲存並關閉',
                    menuSettings: '⚙️ 設定',
                    keyboardNavEnabled: '啟用鍵盤導覽',
                    keyNavNextPrimary: '下一篇 (主要按鍵)',
                    keyNavPrevPrimary: '上一篇 (主要按鍵)',
                    keyNavNextSecondary: '下一篇 (次要按鍵)',
                    keyNavPrevSecondary: '上一篇 (次要按鍵)',
                    floatingNavEnabled: '啟用浮動導覽按鈕',
                    floatingNavPrevTooltip: '上一篇貼文',
                    floatingNavNextTooltip: '下一篇貼文',
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
                    settingsColumnGeneral: '一般設定',
                    settingsColumnNavigation: '導覽設定',
                    settingsColumnTools: '貼文工具',
                    copier_enablePermalink: '啟用 永久連結按鈕',
                    copier_enableCopyContent: '啟用 複製內容按鈕',
                    copier_fetchPermalinkSmart: '永久連結 (智慧)',
                    copier_fetchPermalinkDirect: '永久連結 (直接)',
                    copier_copyContent: '複製貼文內容',
                    copier_copyContentSuccess: '✅ 內容已複製',
                    copier_copyContentFailed: '❌ 複製失敗',
                    copier_processing: '處理中...',
                    copier_successPermalink: '✅ 已複製',
                    copier_failure: '❌ 失敗',
                    copier_notificationPermalinkCopied: '永久連結已複製：\n{url}',
                    copier_notificationErrorGeneric: '獲取永久連結失敗。',
                    copier_notificationErrorNoSourceUrl: '失敗：找不到來源網址。',
                    copier_notificationErrorTimeout: '失敗：背景處理逾時。',
                    copier_notificationContentNotFound: '❌ 找不到內容區塊。',
                    copier_menu_useSmartLink: '自動取得永久連結 (智慧模式)',
                    copier_menu_showButtonText: '顯示按鈕文字',
                    copier_menu_permalinkFormat: '永久連結格式',
                    copier_format_full: '完整網址 (含 Slug)',
                    copier_format_username: '使用者名稱 + 貼文 ID',
                    copier_format_author_id: '作者 ID + 貼文 ID (最可靠)',
                    copier_format_shortest: '最短連結 (fb.com, 相容性較差)',
                    tooltipAds: '前往 廣告檔案庫 (關於)',
                    tooltipTransparency: '查看 粉絲專頁資訊透明度',
                    notificationReelSearchError: '無法取得目前頁面名稱以進行連續短片搜尋。',
                    copier_includeEmojis: '複製內容包含表情符號',
                    // Auto Loader & Batch Copier
                    autoLoader_batchSize: '自動載入批次數量',
                    tooltipAutoLoadStart: '自動載入貼文',
                    tooltipAutoLoadStop: '停止載入',
                    tooltipBatchCopy: '批次複製所有貼文',
                    autoLoad_status_loading: '載入中... ({current}/{target})',
                    autoLoad_status_retrying: '重試中... ({count}/{max})',
                    autoLoad_status_success: '自動載入完成。',
                    autoLoad_status_stopped: '使用者手動停止。',
                    autoLoad_status_deadlock: '偵測到阻擋，載入已停止。',
                    batchCopy_start: '正在處理 {count} 篇貼文...',
                    batchCopy_success: '✅ 已複製 {count} 篇貼文。',
                    batchCopy_empty: '沒有貼文可複製。',
                },
                ja: {
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
                    postNumberingEnabled: 'フィードに投稿順序番号を表示する',
                    expandContentEnabled: '投稿の内容を自動的に展開 (さらに表示)',
                    errorRecoveryEnabled: 'エラーページ自動回復 (ボタン検出)',
                    transparencyButtonsEnabled: 'ページの透明性ショートカットを表示 (左下)',
                    idRevealerEnabled: 'ID表示を有効にする（タイトルをクリック）',
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
                    setVolumeLabel: '自動音量',
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
                    searchScopeMarketplace: 'マーケットプレイス',
                    searchTooltipPosts: '現在のページの投稿を検索します（ホームページの場合はFacebook全体）。',
                    searchTooltipPhotos: '現在のページの写真を検索します。',
                    searchTooltipVideos: '現在のページの動画を検索します。',
                    searchTooltipReels: '現在のページ名をキーワードとして、Facebook全体のリールを検索します。',
                    searchTooltipPages: 'Facebook全体でページ、人物、または組織を検索します。',
                    searchTooltipPeople: 'Facebook全体で個人のプロフィールを検索します。',
                    searchTooltipGroups: 'Facebook全体でグループを検索します。',
                    searchTooltipGlobalPosts: 'Facebook全体で公開投稿を検索します。',
                    searchTooltipGlobalVideos: 'Facebook Watchの内部検索を使用して、すべての動画を検索します。',
                    searchTooltipEvents: 'Facebookの内部検索を使用して、すべてのイベントを検索します。',
                    searchTooltipMarketplace: 'Facebookマーケットプレイス全体で商品を検索します。',
                    searchAllContextualTooltip: 'Google検索を使用して、このページのすべての{scope}を一覧表示します',
                    navigateToContextual: '{scope}セクションに移動',
                    pinToolbar: 'ツールバーを固定',
                    unpinToolbar: 'ツールバーの固定を解除',
                    shortcutWatch: 'Watchへ移動',
                    shortcutEvents: 'イベントへ移動',
                    shortcutMarketplace: 'マーケットプレイスへ移動',
                    settingsTitle: '設定',
                    saveAndClose: '保存して閉じる',
                    menuSettings: '⚙️ 設定',
                    keyboardNavEnabled: 'キーボードナビゲーションを有効にする',
                    keyNavNextPrimary: '次の投稿 (プライマリ)',
                    keyNavPrevPrimary: '前の投稿 (プライマリ)',
                    keyNavNextSecondary: '次の投稿 (セカンダリ)',
                    keyNavPrevSecondary: '前の投稿 (セカンダリ)',
                    floatingNavEnabled: 'フローティングナビゲーションボタンを有効にする',
                    floatingNavPrevTooltip: '前の投稿',
                    floatingNavNextTooltip: '次の投稿',
                    navigationScrollAlignment: 'スクロール位置',
                    scrollAlignmentCenter: '中央',
                    scrollAlignmentTop: '上部',
                    enableSmoothScrolling: 'スムーズスクロールを有効にする',
                    continuousNavInterval: '連続ナビゲーションの間隔',
                    wheelNavEnabled: 'マウスホイールナビゲーションを有効にする',
                    wheelNavModifier: 'ホイールナビゲーションの修飾キー',
                    modifierAlt: 'Alt',
                    modifierCtrl: 'Ctrl',
                    modifierShift: 'Shift',
                    modifierNone: 'なし (ページのスクロールを置き換える)',
                    settingsColumnGeneral: '一般設定',
                    settingsColumnNavigation: 'ナビゲーション設定',
                    settingsColumnTools: '投稿ツール',
                    copier_enablePermalink: '固定リンクボタンを有効にする',
                    copier_enableCopyContent: '内容コピーボタンを有効にする',
                    copier_fetchPermalinkSmart: '固定リンク (スマート)',
                    copier_fetchPermalinkDirect: '固定リンク (直接)',
                    copier_copyContent: '投稿内容をコピー',
                    copier_copyContentSuccess: '✅ コピーしました',
                    copier_copyContentFailed: '❌ 失敗しました',
                    copier_processing: '処理中...',
                    copier_successPermalink: '✅ コピーしました',
                    copier_failure: '❌ 失敗',
                    copier_notificationPermalinkCopied: '固定リンクをクリップボードにコピーしました：\n{url}',
                    copier_notificationErrorGeneric: '固定リンクの取得に失敗しました。',
                    copier_notificationErrorNoSourceUrl: '失敗：ソースURLが見つかりませんでした。',
                    copier_notificationErrorTimeout: '失敗：バックグラウンドでの取得がタイムアウトしました。',
                    copier_notificationContentNotFound: '❌ コンテンツが見つかりませんでした。',
                    copier_menu_useSmartLink: '固定リンクを自動取得 (スマートモード)',
                    copier_menu_showButtonText: 'ボタンテキストを表示',
                    copier_menu_permalinkFormat: '固定リンク形式',
                    copier_format_full: '完全なURL (スラグ付き)',
                    copier_format_username: 'ユーザー名 + 投稿ID',
                    copier_format_author_id: '作成者ID + 投稿ID (最も信頼性が高い)',
                    copier_format_shortest: '最短リンク (fb.com, 互換性低)',
                    tooltipAds: '広告ライブラリへ (情報)',
                    tooltipTransparency: 'ページの透明性を表示',
                    notificationReelSearchError: 'リール検索のための現在のページ名を取得できません。',
                    copier_includeEmojis: 'コピーしたテキストに絵文字を含める',
                    // Auto Loader & Batch Copier
                    autoLoader_batchSize: '自動読み込みバッチ数',
                    tooltipAutoLoadStart: '投稿を自動読み込み',
                    tooltipAutoLoadStop: '読み込み停止',
                    tooltipBatchCopy: '全投稿を一括コピー',
                    autoLoad_status_loading: '読み込み中... ({current}/{target})',
                    autoLoad_status_retrying: '再試行中... ({count}/{max})',
                    autoLoad_status_success: '自動読み込み完了。',
                    autoLoad_status_stopped: 'ユーザーにより停止。',
                    autoLoad_status_deadlock: 'ブロックを検出。停止します。',
                    batchCopy_start: '{count} 件の投稿を処理中...',
                    batchCopy_success: '✅ {count} 件の投稿をコピーしました。',
                    batchCopy_empty: 'コピーする投稿がありません。',
                },
            },
        },

        // --- APPLICATION STATE ---
        state: {
            settings: {},
            T: {}, // Localized strings
            cachedPageID: null,
            currentPath: '',
        },

        // --- UTILITY FUNCTIONS ---
        utils: {
            isLoggedIn() {
                const banner = document.querySelector('div[role="banner"]');
                if (!banner) {
                    console.warn(`${app.config.LOG_PREFIX} [Auth] Could not find banner element, assuming logged out.`);
                    return false;
                }
                if (app.config.LOGIN_STATE_MARKERS.LOGGED_OUT.some(marker => banner.querySelector(marker.selector))) {
                    return false;
                }
                if (app.config.LOGIN_STATE_MARKERS.LOGGED_IN.some(marker => banner.querySelector(marker.selector))) {
                    return true;
                }
                console.warn(`${app.config.LOG_PREFIX} [Auth] No definitive login markers found, defaulting to logged out.`);
                return false;
            },
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

                const disallowedFirstSegments = [
                    'watch', 'marketplace', 'gaming', 'events', 'messages',
                    'notifications', 'friends', 'photo', 'videos', 'reel',
                    'posts', 'stories', 'settings', 'saved'
                ];

                return !disallowedFirstSegments.includes(pathSegments[0]);
            },
            delay: ms => new Promise(res => setTimeout(res, ms)),
            smartOpen(event, url) {
                event.preventDefault();
                const isBackground = event.button === 1 || event.ctrlKey || event.metaKey;
                if (isBackground) {
                    GM_openInTab(url, { active: false, insert: true });
                } else {
                    window.open(url, '_blank');
                }
            },
            // Check if element is visible (for deadlock detection)
            isVisible(el) {
                if (!el) return false;
                return el.offsetParent !== null && window.getComputedStyle(el).display !== 'none';
            }
        },

        // --- CORE MODULES ---
        modules: {
            settingsManager: {
                app: null,
                registeredCommands: [],
                definitions: (() => {
                    const generalSettings = [
                        { key: 'autoOpenMediaInNewTab', type: 'boolean', defaultValue: true, labelKey: 'autoOpenMediaInNewTab', group: 'general' },
                        { key: 'hideUselessElements', type: 'boolean', defaultValue: true, labelKey: 'hideUselessElements', group: 'general', needsReload: true },
                        { key: 'hidePostStats', type: 'boolean', defaultValue: false, labelKey: 'hidePostStats', group: 'general', instant: true },
                        { key: 'showDeadlockNotification', type: 'boolean', defaultValue: true, labelKey: 'showDeadlockNotification', group: 'general' },
                        { key: 'errorRecoveryEnabled', type: 'boolean', defaultValue: true, labelKey: 'errorRecoveryEnabled', group: 'general' },
                        { key: 'transparencyButtonsEnabled', type: 'boolean', defaultValue: true, labelKey: 'transparencyButtonsEnabled', group: 'general' },
                        { key: 'idRevealerEnabled', type: 'boolean', defaultValue: true, labelKey: 'idRevealerEnabled', group: 'general' },
                        {
                            key: 'idRevealerLinkFormat', type: 'select', defaultValue: 'userid', labelKey: 'idRevealerLinkFormat',
                            options: [
                                { value: 'userid', labelKey: 'idFormatUserID' }, { value: 'classic', labelKey: 'idFormatClassic' }, { value: 'username', labelKey: 'idFormatUsername' }
                            ],
                            group: 'general'
                        },
                        { key: 'autoUnmuteEnabled', type: 'boolean', defaultValue: true, labelKey: 'autoUnmuteEnabled', group: 'general' },
                        { key: 'autoUnmuteVolume', type: 'range', defaultValue: 25, labelKey: 'setVolumeLabel', options: { min: 0, max: 100, step: 5, unit: '%' }, group: 'general' },
                        { key: 'postNumberingEnabled', type: 'boolean', defaultValue: true, labelKey: 'postNumberingEnabled', group: 'general' },
                        { key: 'expandContentEnabled', type: 'boolean', defaultValue: true, labelKey: 'expandContentEnabled', group: 'general' },
                    ];
                    const navigationSettings = [
                        { key: 'keyboardNavEnabled', type: 'boolean', defaultValue: true, labelKey: 'keyboardNavEnabled', group: 'navigation' },
                        { key: 'keyNavNextPrimary', type: 'text', defaultValue: 'j', labelKey: 'keyNavNextPrimary', group: 'navigation' },
                        { key: 'keyNavPrevPrimary', type: 'text', defaultValue: 'k', labelKey: 'keyNavPrevPrimary', group: 'navigation' },
                        { key: 'keyNavNextSecondary', type: 'text', defaultValue: 'ArrowRight', labelKey: 'keyNavNextSecondary', group: 'navigation' },
                        { key: 'keyNavPrevSecondary', type: 'text', defaultValue: 'ArrowLeft', labelKey: 'keyNavPrevSecondary', group: 'navigation' },
                        { key: 'floatingNavEnabled', type: 'boolean', defaultValue: true, labelKey: 'floatingNavEnabled', group: 'navigation', instant: true },
                        { key: 'autoLoadBatchSize', type: 'range', defaultValue: 20, labelKey: 'autoLoader_batchSize', options: { min: 10, max: 100, step: 5, unit: '' }, group: 'navigation' },
                        { key: 'wheelNavEnabled', type: 'boolean', defaultValue: true, labelKey: 'wheelNavEnabled', group: 'navigation' },
                        { key: 'wheelNavModifier', type: 'select', defaultValue: 'shiftKey', labelKey: 'wheelNavModifier', options: [ { value: 'altKey', labelKey: 'modifierAlt' }, { value: 'ctrlKey', labelKey: 'modifierCtrl' }, { value: 'shiftKey', labelKey: 'modifierShift' }, { value: 'none', labelKey: 'modifierNone' } ], group: 'navigation' },
                        { key: 'navigationScrollAlignment', type: 'select', defaultValue: 'top', labelKey: 'navigationScrollAlignment', options: [ { value: 'center', labelKey: 'scrollAlignmentCenter' }, { value: 'top', labelKey: 'scrollAlignmentTop' } ], group: 'navigation' },
                        { key: 'enableSmoothScrolling', type: 'boolean', defaultValue: true, labelKey: 'enableSmoothScrolling', group: 'navigation' },
                        { key: 'continuousNavInterval', type: 'range', defaultValue: 500, labelKey: 'continuousNavInterval', options: { min: 0, max: 1000, step: 50, unit: 'ms' }, group: 'navigation' },
                    ];
                    const toolsSettings = [
                        { key: 'permalinkCopierEnabled', type: 'boolean', defaultValue: true, labelKey: 'copier_enablePermalink', group: 'tools', instant: true },
                        { key: 'enableCopyContentButton', type: 'boolean', defaultValue: true, labelKey: 'copier_enableCopyContent', group: 'tools', instant: true },
                        { key: 'copier_includeEmojis', type: 'boolean', defaultValue: true, labelKey: 'copier_includeEmojis', group: 'tools', instant: true },
                        { key: 'copier_useSmartLink', type: 'boolean', defaultValue: true, labelKey: 'copier_menu_useSmartLink', group: 'tools', instant: true },
                        { key: 'copier_showButtonText', type: 'boolean', defaultValue: false, labelKey: 'copier_menu_showButtonText', group: 'tools', instant: true },
                        {
                            key: 'copier_permalinkFormat', type: 'select', defaultValue: 'author_id', labelKey: 'copier_menu_permalinkFormat',
                            options: [
                                { value: 'author_id', labelKey: 'copier_format_author_id' }, { value: 'username', labelKey: 'copier_format_username' },
                                { value: 'full', labelKey: 'copier_format_full' }, { value: 'shortest', labelKey: 'copier_format_shortest' },
                            ],
                            group: 'tools'
                        },
                    ];
                    return [...generalSettings, ...navigationSettings, ...toolsSettings];
                })(),
                init(app) {
                    this.app = app;
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
                    const SI = this.app.modules.styleInjector;
                    const ER = this.app.modules.errorRecovery;
                    const TA = this.app.modules.transparencyActions;
                    const CE = this.app.modules.contentExpander;
                    const IR = this.app.modules.idRevealer;
                    switch (key) {
                        case 'permalinkCopierEnabled':
                        case 'enableCopyContentButton':
                        case 'copier_useSmartLink':
                        case 'copier_showButtonText':
                            // Always re-evaluate buttons if any tool setting changes
                            if (PHT) PHT.reEvaluateAllButtons();
                            break;
                        case 'floatingNavEnabled':
                            if (newValue) FN.init(this.app); else FN.deinit();
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
                    this.modalContainer.body.innerHTML = ''; 
                    const layout = this.app.utils.createStyledElement('div', { display: 'flex', gap: '24px', flexWrap: 'wrap' }, {
                        children: [
                            this._createSettingsColumn(T.settingsColumnGeneral, 'general'),
                            this._createSettingsColumn(T.settingsColumnNavigation, 'navigation'),
                            this._createSettingsColumn(T.settingsColumnTools, 'tools')
                        ]
                    });
                    this.modalContainer.body.append(layout);
                    this._setupDependentControls(this.modalContainer.body);
                    this.modalContainer.backdrop.style.display = 'block';
                    this.modalContainer.modal.style.display = 'flex';
                },
                _createSettingsColumn(title, group) {
                    const children = [
                        this.app.utils.createStyledElement('h4', {}, { className: 'gm-col-header', textContent: title }),
                        ...this.app.modules.settingsManager.definitions.filter(def => def.group === group).map(def => this._createSettingRow(def))
                    ];
                    return this.app.utils.createStyledElement('div', {}, { className: 'gm-col', children });
                },
                _createSettingRow(def) {
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
                            inputElement = U.createStyledElement('input', {}, { className: 'gm-input-right', type: 'checkbox', id: `setting-${def.key}`, checked: currentValue, on: { input: handleInput } });
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
                    }

                    const wrapper = U.createStyledElement('div', {}, { 
                        className: 'gm-setting-row', 
                        children: [
                            U.createStyledElement('label', {}, { className: 'gm-setting-label', htmlFor: `setting-${def.key}`, textContent: T[def.labelKey] }),
                            inputElement
                        ]
                    });

                    if (def.key === 'autoUnmuteVolume') wrapper.dataset.controls = 'autoUnmuteEnabled';
                    if (def.key.startsWith('keyNav')) wrapper.dataset.controls = 'keyboardNavEnabled';
                    if (def.key === 'copier_permalinkFormat') wrapper.dataset.controls = 'permalinkCopierEnabled';
                    if (def.key === 'idRevealerLinkFormat') wrapper.dataset.controls = 'idRevealerEnabled';
                    if (def.key === 'autoLoadBatchSize') wrapper.dataset.controls = 'floatingNavEnabled';

                    return wrapper;
                },
                _setupDependentControls(container) {
                    const controllers = {
                        autoUnmuteEnabled: container.querySelector('#setting-autoUnmuteEnabled'),
                        keyboardNavEnabled: container.querySelector('#setting-keyboardNavEnabled'),
                        permalinkCopierEnabled: container.querySelector('#setting-permalinkCopierEnabled'),
                        idRevealerEnabled: container.querySelector('#setting-idRevealerEnabled'),
                        floatingNavEnabled: container.querySelector('#setting-floatingNavEnabled'),
                    };
                    const toggleGroup = (controller, isEnabled) => {
                        container.querySelectorAll(`[data-controls="${controller.id.substring(8)}"]`).forEach(control => {
                            control.style.opacity = isEnabled ? '1' : '0.5';
                            const input = control.querySelector('input, select');
                            if (input) input.disabled = !isEnabled;
                        });
                    };
                    const updateAll = () => Object.values(controllers).forEach(c => c && toggleGroup(c, c.checked));
                    Object.values(controllers).forEach(c => c && c.addEventListener('input', updateAll));
                    updateAll();
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

                    const header = U.createStyledElement('div', {}, { className: 'gm-settings-header', children: [
                        U.createStyledElement('h2', {}, { className: 'gm-settings-title', textContent: T.settingsTitle }),
                        U.createStyledElement('button', {}, { className: 'gm-settings-close-btn', innerHTML: '&times;', on: { click: close } })
                    ]});

                    const body = U.createStyledElement('div', {}, { className: 'gm-settings-body' });

                    const footer = U.createStyledElement('div', {}, { className: 'gm-settings-footer', children: [
                        U.createStyledElement('button', {}, { className: 'gm-btn-reset', textContent: T.resetSettings, on: { click: reset } }),
                        U.createStyledElement('div', { display: 'flex', gap: '8px' }, { children: [
                            U.createStyledElement('button', {}, { className: 'gm-btn-save', textContent: T.saveAndClose, on: { click: save } })
                        ]})
                    ]});

                    const modal = U.createStyledElement('div', {}, { className: 'gm-settings-modal', children: [header, body, footer] });
                    const backdrop = U.createStyledElement('div', {}, { className: 'gm-settings-backdrop', on: { click: close } });

                    document.body.append(backdrop, modal);
                    this.modalContainer = { backdrop, modal, body };
                    this.close();
                },
                close() {
                    if (this.modalContainer) {
                        this.modalContainer.backdrop.style.display = 'none';
                        this.modalContainer.modal.style.display = 'none';
                    }
                },
                saveAndClose() {
                    const needsReload = this.app.modules.settingsManager.definitions.some(def => def.needsReload && this.app.state.settings[def.key] !== GM_getValue(def.key));
                    if (needsReload) this.app.modules.toastNotifier.show(this.app.state.T.notificationSettingsReload, 'success');
                    this.close();
                }
            },

            interceptor: {
                init() {
                    const originalAddEventListener = EventTarget.prototype.addEventListener;
                    Object.defineProperty(EventTarget.prototype, 'addEventListener', {
                        configurable: true,
                        enumerable: true,
                        get: () => function(type, listener, options) {
                            if (type === 'scroll' && this !== window) return;
                            return originalAddEventListener.call(this, type, listener, options);
                        },
                    });
                },
            },

            historyInterceptor: {
                init() {
                    const originalPushState = history.pushState;
                    history.pushState = function(...args) {
                        originalPushState.apply(this, args);
                        window.dispatchEvent(new Event('historyChange'));
                    };
                    const originalReplaceState = history.replaceState;
                    history.replaceState = function(...args) {
                        originalReplaceState.apply(this, args);
                        window.dispatchEvent(new Event('historyChange'));
                    };
                }
            },

            toastNotifier: {
                app: null,
                init(app) { this.app = app; },
                show(message, type = 'success', duration = 4000) {
                    const toast = this.app.utils.createStyledElement('div', {}, {
                        className: `gm-toast gm-toast-${type}`,
                        innerHTML: `<span>${message}</span>`
                    });
                    document.body.append(toast);
                    setTimeout(() => toast.classList.add('gm-toast-visible'), 10);
                    setTimeout(() => {
                        toast.classList.remove('gm-toast-visible');
                        setTimeout(() => toast.remove(), 500);
                    }, duration);
                }
            },

            styleInjector: {
                app: null,
                statsStyleElement: null,
                init(app) {
                    this.app = app;
                    const C = this.app.config;
                    const settings = this.app.state.settings;

                    const CSS_RULES = [
                        // --- Base Hide Rules ---
                        `div[data-nosnippet], div[role="banner"]:has(a[href*="/reg/"]) { display: none !important; }`,
                        // --- Post Highlights ---
                        `.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS} { outline: 3px solid #1877F2 !important; box-shadow: 0 0 15px rgba(24, 119, 242, 0.5) !important; border-radius: 8px; z-index: 10 !important; }`,
                        // --- Floating Nav ---
                        `.gm-floating-nav { position: fixed; bottom: 20px; right: 20px; z-index: 9990; display: flex; flex-direction: column; gap: 8px; }`,
                        `.gm-floating-nav button { background-color: rgba(255, 255, 255, 0.95); border: 1px solid #ddd; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: background-color 0.2s, transform 0.1s; position: relative; }`,
                        `.gm-floating-nav button:hover { background-color: #f0f2f5; }`,
                        `.gm-floating-nav button:active { transform: scale(0.95); }`,
                        `.gm-floating-nav svg { width: 20px; height: 20px; fill: #65676b; }`,
                        // --- Toolbar & Search ---
                        `.gm-toolbar { position: fixed; top: 0; left: 0; width: 100%; padding: 4px 16px; background-color: #FFFFFF; z-index: 9998; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.2); box-sizing: border-box; transition: transform 0.3s ease-in-out; gap: 16px; }`,
                        `.gm-button-group { display: flex; align-items: center; }`,
                        `.gm-button-group button { background-color: #F0F2F5; border: 1px solid #CED0D4; padding: 0; height: 32px; width: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; }`,
                        `.gm-button-group button:hover { background-color: #E4E6EB; }`,
                        `.gm-button-group button:not(:first-child) { margin-left: -1px; }`,
                        `.gm-button-group button:first-child { border-radius: 6px 0 0 6px; }`,
                        `.gm-button-group button:last-child { border-radius: 0 6px 6px 0; }`,
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
                        `.gm-hover-hint { position: fixed; top: 0; left: 50%; width: 40px; height: 4px; background-color: rgba(0, 0, 0, 0.25); border-radius: 2px; z-index: 10000; opacity: 0; transform: translate(-50%, -12px); transition: opacity 0.2s ease-in-out, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }`,
                        `.gm-hover-hint.gm-visible { opacity: 1; transform: translate(-50%, 8px); }`,
                        `.gm-hover-trigger { position: fixed; top: 0; left: 0; width: 100%; height: 10px; z-index: 9999; }`,
                        // --- Toasts ---
                        `.gm-toast { position: fixed; top: 20px; left: 50%; transform: translate(-50%, -100px); padding: 12px 20px; border-radius: 8px; color: white; font-size: 14px; font-weight: bold; z-index: 99999; opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.2); backdrop-filter: blur(5px); white-space: pre-wrap; }`,
                        `.gm-toast-visible { opacity: 1; transform: translate(-50%, 0); }`,
                        `.gm-toast-success { background-color: rgba(24, 119, 242, 0.85); }`,
                        `.gm-toast-failure { background-color: rgba(220, 53, 69, 0.85); }`,
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
                        `.gm-transparency-container { position: fixed; bottom: 20px; left: 20px; z-index: 9990; display: none; flex-direction: column; gap: 10px; }`,
                        `.gm-transparency-btn { width: 40px; height: 40px; border-radius: 50%; background-color: white; border: 1px solid #ddd; box-shadow: 0 2px 5px rgba(0,0,0,0.15); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: transform 0.1s; }`,
                        `.gm-transparency-btn:hover { background-color: #f0f2f5; }`,
                        `.gm-transparency-btn:active { transform: scale(0.95); }`,
                        // --- Post Numbering ---
                        `.gm-post-number { position: absolute; top: -10px; left: -10px; background-color: #e4e6eb; color: #65676b; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 1; }`,
                        // --- Settings Modal ---
                        `.gm-settings-backdrop { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 99998; }`,
                        `.gm-settings-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 99999; min-width: 600px; max-width: 90vw; display: flex; flex-direction: column; max-height: 85vh; }`,
                        `.gm-settings-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #ddd; }`,
                        `.gm-settings-title { margin: 0; font-size: 18px; }`,
                        `.gm-settings-close-btn { background: none; border: none; font-size: 24px; cursor: pointer; padding: 0 8px; }`,
                        `.gm-settings-body { padding: 16px; overflow-y: auto; flex: 1; }`,
                        `.gm-settings-footer { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-top: 1px solid #ddd; }`,
                        `.gm-col { flex: 1; min-width: 250px; }`,
                        `.gm-col-header { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 8px; }`,
                        `.gm-setting-row { display: flex; align-items: center; margin-bottom: 12px; transition: opacity 0.2s; }`,
                        `.gm-setting-label { margin-right: 8px; flex-shrink: 0; }`,
                        `.gm-input-right { margin-left: auto; }`,
                        `.gm-input-text { margin-left: auto; border: 1px solid #ccc; border-radius: 4px; padding: 4px 8px; width: 100px; }`,
                        `.gm-input-select { margin-left: auto; border: 1px solid #ccc; border-radius: 4px; padding: 4px 8px; }`,
                        `.gm-btn-save { padding: 8px 16px; border: 1px solid #1877F2; background-color: #1877F2; color: white; border-radius: 6px; cursor: pointer; }`,
                        `.gm-btn-reset { padding: 8px 12px; border: 1px solid #d9534f; background-color: transparent; color: #d9534f; border-radius: 6px; cursor: pointer; transition: background-color 0.2s, color 0.2s; }`,
                        `.gm-btn-reset:hover { background-color: #d9534f; color: white; }`
                    ];

                    if (settings.hideUselessElements) {
                        const toolbarRuleA = `div:has(> div > div > div[role="button"]:not([aria-haspopup]) > div > div > i[data-visualcompletion="css-img"])`;
                        const toolbarRuleB = `div:has(> div > div[role="button"]:not([aria-haspopup]) > div > div > i[data-visualcompletion="css-img"])`;
                        const threeDotMenuSelector = `div[role="button"][aria-haspopup="menu"]:has(svg circle + circle + circle)`;
                        const stickyBannerSelector = 'div[style*="top:"][style*="z-index"]:has(div[role="tablist"])';
                        CSS_RULES.push(
                            `div[role="banner"]:has(${C.SELECTORS.GLOBAL.LOGIN_FORM}) { display: none !important; }`,
                            `${toolbarRuleA}, ${toolbarRuleB} { display: none !important; }`,
                            `${threeDotMenuSelector} { display: none !important; }`,
                            `${stickyBannerSelector} { position: static !important; }`
                        );
                    }

                    const styleElement = this.app.utils.createStyledElement('style', {}, { textContent: CSS_RULES.join('\n') });
                    document.head.append(styleElement);
                    this.updateStatsBarVisibility(settings.hidePostStats);
                },
                updateStatsBarVisibility(shouldHide) {
                    if (shouldHide) {
                        if (!this.statsStyleElement) {
                            const css = `div:has(> div > span[role="toolbar"]) { display: none !important; }`;
                            this.statsStyleElement = this.app.utils.createStyledElement('style', {}, { textContent: css });
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

            domCleaner: {
                app: null,
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
                    lastScrollTime: 0
                },
                init(app) { this.app = app; },
                
                async start() {
                    if (this.state.isRunning) return;
                    
                    const T = this.app.state.T;
                    const batchSize = this.app.state.settings.autoLoadBatchSize || 20;
                    const currentPosts = this.app.modules.postNavigatorCore.getSortedPosts().length;
                    
                    this.state.isRunning = true;
                    this.state.retryCount = 0;
                    this.state.targetCount = currentPosts + batchSize;
                    
                    this.app.modules.floatingNavigator.updateButtonState('start');
                    this.app.modules.toastNotifier.show(
                        T.autoLoad_status_loading.replace('{current}', currentPosts).replace('{target}', this.state.targetCount), 
                        'success'
                    );

                    await this.loop();
                },

                stop(reasonKey = '') {
                    this.state.isRunning = false;
                    this.app.modules.floatingNavigator.updateButtonState('stop');
                    
                    if (reasonKey) {
                        const T = this.app.state.T;
                        const type = reasonKey.includes('success') ? 'success' : 'failure';
                        this.app.modules.toastNotifier.show(T[reasonKey], type);
                    }
                },

                async loop() {
                    const C = this.app.config.AUTO_LOADER;
                    const T = this.app.state.T;

                    while (this.state.isRunning) {
                        if (this.isDeadlocked()) {
                            this.stop('autoLoad_status_deadlock');
                            return;
                        }

                        const currentCount = this.app.modules.postNavigatorCore.getSortedPosts().length;
                        if (currentCount >= this.state.targetCount) {
                            this.stop('autoLoad_status_success');
                            return;
                        }

                        const timeSinceLastScroll = Date.now() - this.state.lastScrollTime;
                        if (timeSinceLastScroll < C.MIN_COOLDOWN) {
                            await this.app.utils.delay(C.MIN_COOLDOWN - timeSinceLastScroll);
                        }

                        this.app.modules.toastNotifier.show(
                            T.autoLoad_status_loading.replace('{current}', currentCount).replace('{target}', this.state.targetCount),
                            'success', 1000
                        );
                        
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        this.state.lastScrollTime = Date.now();

                        const result = await this.waitForNewContent(currentCount);

                        if (result === 'loaded') {
                            this.state.retryCount = 0;
                        } else if (result === 'timeout') {
                            this.state.retryCount++;
                            this.app.modules.toastNotifier.show(
                                T.autoLoad_status_retrying.replace('{count}', this.state.retryCount).replace('{max}', C.MAX_RETRIES),
                                'failure', 1000
                            );
                            
                            if (this.state.retryCount >= C.MAX_RETRIES) {
                                this.stop('autoLoad_status_success'); // Treat as success/partial success if we hit wall
                                return;
                            }
                        }
                    }
                },

                waitForNewContent(baselineCount) {
                    const C = this.app.config.AUTO_LOADER;
                    return new Promise((resolve) => {
                        const startTime = Date.now();
                        const poller = setInterval(() => {
                            if (!this.state.isRunning) { clearInterval(poller); resolve('stopped'); return; }
                            if (this.isDeadlocked()) { clearInterval(poller); return; } // Main loop will handle stop

                            const newCount = this.app.modules.postNavigatorCore.getSortedPosts().length;
                            if (newCount > baselineCount) { clearInterval(poller); resolve('loaded'); }
                            
                            if (Date.now() - startTime > C.MAX_WAIT_TIME) { clearInterval(poller); resolve('timeout'); }
                        }, C.POLL_INTERVAL);
                    });
                },

                isDeadlocked() {
                    // Reuse the robust logic we built in the test script
                    // 1. Check Dialog with Login Form
                    const C = this.app.config.SELECTORS;
                    const U = this.app.utils;
                    const dialog = document.querySelector(C.GLOBAL.DIALOG);
                    if (dialog && U.isVisible(dialog)) {
                        if (dialog.querySelector(C.GLOBAL.LOGIN_FORM)) return true;
                    }
                    // 2. Check NoSnippet banner
                    const noSnippet = document.querySelector('div[data-nosnippet]');
                    if (noSnippet && U.isVisible(noSnippet)) return true;
                    
                    // 3. Check any visible login form not in banner
                    const forms = document.querySelectorAll(C.GLOBAL.LOGIN_FORM);
                    for (const form of forms) {
                        if (U.isVisible(form) && !form.closest('[role="banner"]')) return true;
                    }
                    return false;
                },

                async copyAllPosts() {
                    const T = this.app.state.T;
                    const posts = this.app.modules.postNavigatorCore.getSortedPosts();
                    if (posts.length === 0) {
                        this.app.modules.toastNotifier.show(T.batchCopy_empty, 'failure');
                        return;
                    }

                    this.app.modules.toastNotifier.show(T.batchCopy_start.replace('{count}', posts.length), 'success');
                    
                    // Small delay to let UI update
                    await this.app.utils.delay(50);

                    let resultText = '';
                    let successCount = 0;

                    posts.forEach((post, index) => {
                        const text = this.getPostText(post);
                        const postNum = index + 1;
                        const header = `=== Post #${postNum} ===`;
                        const content = text || '[No Text Content]';
                        const separator = '\n\n-----------------------------------\n\n';

                        resultText += `${header}\n${content}${separator}`;
                        if (text) successCount++;
                    });

                    try {
                        await GM_setClipboard(resultText);
                        this.app.modules.toastNotifier.show(T.batchCopy_success.replace('{count}', successCount), 'success');
                    } catch (err) {
                        console.error(err);
                        this.app.modules.toastNotifier.show('Copy Failed', 'failure');
                    }
                },

                getPostText(postEl) {
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const contentContainer = postEl.querySelector(C_TOOLS.CONTENT_BODY);
                    if (!contentContainer) return null;

                    const clone = contentContainer.cloneNode(true);
                    
                    // Replace emoji images with alt text
                    const images = clone.querySelectorAll('img[src*="emoji"][alt], img[alt]');
                    images.forEach(img => {
                        const alt = img.getAttribute('alt');
                        if (alt) img.replaceWith(document.createTextNode(alt));
                    });

                    // Topology extraction
                    const rawBlocks = clone.querySelectorAll(C_TOOLS.TEXT_BLOCKS);
                    const leafBlocks = Array.from(rawBlocks).filter(el => {
                        return el.querySelectorAll(C_TOOLS.TEXT_BLOCKS).length === 0 && el.innerText.trim().length > 0;
                    });

                    if (leafBlocks.length === 0) return clone.innerText.trim();

                    let finalString = leafBlocks[0].innerText.trim();
                    for (let i = 1; i < leafBlocks.length; i++) {
                        const prevBlock = leafBlocks[i-1];
                        const currBlock = leafBlocks[i];
                        const currText = currBlock.innerText.trim();
                        
                        const isSibling = currBlock.parentElement === prevBlock.parentElement;
                        const separator = isSibling ? '\n' : '\n\n';
                        
                        finalString += separator + currText; 
                    }
                    return finalString;
                }
            },

            errorRecovery: {
                app: null,
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
                        } catch (e) {}

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
                deinit() {
                    if (this.container) this.container.remove();
                    if (this.interval) clearInterval(this.interval);
                },
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

                        this.container = U.createStyledElement('div', {}, { 
                            className: 'gm-transparency-container',
                            children: [btnInt, btnAds]
                        });
                        document.body.appendChild(this.container);
                    }
                    if (this.app.state.cachedPageID) this.container.style.display = 'flex';
                    else this.container.style.display = 'none';
                },
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

                inject() {
                    // [Fix] Exclude Group pages to prevent extracting random member IDs
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

                showBadge(h1) {
                    this.closeBadge(); // Close existing if any

                    const idMap = this.extractIds();
                    if (idMap.size === 0) return;

                    this.targetH1 = h1;
                    this.createBadgeUI(h1, idMap);
                    this.updatePosition();
                },

                // Helper to get text content excluding children like the verified badge
                _extractText(node) {
                    let text = '';
                    for (const child of node.childNodes) {
                        if (child.nodeType === Node.TEXT_NODE) {
                            text += child.textContent;
                        }
                    }
                    return text.trim();
                },

                createBadgeUI(h1, idMap) {
                    const U = this.app.utils;
                    const T = this.app.state.T;

                    const container = U.createStyledElement('div', {
                        position: 'fixed', zIndex: '99999', backgroundColor: '#FFFFFF',
                        borderRadius: '8px', boxShadow: '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0, 0, 0, 0.1)', padding: '12px',
                        minWidth: '280px', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '8px',
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
                                    if(profileName) lines.push(`${T.profile_name_label}: ${profileName}`);
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
                RETRY_INTERVAL: 200,
                MAX_RETRY_DURATION: 3000,
                continuousNavInterval: null,
                init(app) {
                    this.app = app;
                },
                startContinuousNavigation(direction) {
                    this.stopContinuousNavigation();
                    this.navigateToPost(direction);
                    const interval = this.app.state.settings.continuousNavInterval;
                    this.continuousNavInterval = setInterval(() => {
                        this.navigateToPost(direction);
                    }, interval);
                },
                stopContinuousNavigation() {
                    if (this.continuousNavInterval) {
                        clearInterval(this.continuousNavInterval);
                        this.continuousNavInterval = null;
                    }
                },
                getSortedPosts() {
                    const posts = Array.from(document.querySelectorAll('[role="article"][aria-posinset]')).filter(p => !p.closest(this.app.config.SELECTORS.GLOBAL.DIALOG));
                    posts.sort((a, b) => parseInt(a.getAttribute('aria-posinset'), 10) - parseInt(b.getAttribute('aria-posinset'), 10));
                    return posts;
                },
                triggerLoadAndRetry() {
                    if (this.isRetrying) return;
                    this.isRetrying = true;
                    const initialPostCount = this.getSortedPosts().length;
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                    const startTime = Date.now();
                    const retryInterval = setInterval(() => {
                        const newPostCount = this.getSortedPosts().length;
                        if (newPostCount > initialPostCount) {
                            clearInterval(retryInterval);
                            this.isRetrying = false;
                            this.navigateToPost('next');
                            return;
                        }
                        if (Date.now() - startTime > this.MAX_RETRY_DURATION) {
                            clearInterval(retryInterval);
                            this.isRetrying = false;
                            console.log(`${this.app.config.LOG_PREFIX} Failed to load new posts.`);
                        }
                    }, this.RETRY_INTERVAL);
                },
                navigateToPost(direction) {
                    const posts = this.getSortedPosts();
                    if (posts.length === 0) return;
                    const currentHighlighted = document.querySelector(`.${this.app.config.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}`);
                    if (currentHighlighted) {
                        currentHighlighted.classList.remove(this.app.config.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS);
                        const currentIndex = posts.findIndex(p => p === currentHighlighted);
                        if (currentIndex !== -1) this.currentPostIndex = currentIndex;
                    }
                    if (direction === 'next') this.currentPostIndex++;
                    else this.currentPostIndex--;
                    if (this.currentPostIndex >= posts.length) {
                        if (direction === 'next') {
                            this.currentPostIndex = posts.length - 1;
                            this.triggerLoadAndRetry();
                            return;
                        }
                        this.currentPostIndex = posts.length - 1;
                    }
                    if (this.currentPostIndex < 0) this.currentPostIndex = 0;
                    const targetPost = posts[this.currentPostIndex];
                    if (targetPost) {
                        targetPost.classList.add(this.app.config.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS);
                        const alignment = this.app.state.settings.navigationScrollAlignment;
                        const useSmoothScroll = this.app.state.settings.enableSmoothScrolling;
                        const scrollBehavior = useSmoothScroll ? 'smooth' : 'auto';
                        if (alignment === 'top') {
                            const searchBarHeight = this.app.modules.searchBar ? this.app.modules.searchBar.getOccupiedHeight() : 0;
                            const postTop = targetPost.getBoundingClientRect().top + window.scrollY;
                            const targetY = postTop - searchBarHeight - 10;
                            window.scrollTo({
                                top: targetY,
                                behavior: scrollBehavior
                            });
                        } else {
                            targetPost.scrollIntoView({
                                behavior: scrollBehavior,
                                block: 'center'
                            });
                        }
                    }
                }
            },

            linkInterceptor: {
                app: null,
                init(app) {
                    this.app = app;
                    const UNSAFE_ANCESTORS = ['[role="tablist"]', '[data-pagelet="ProfileTabs"]'];
                    const unsafeSelector = UNSAFE_ANCESTORS.join(', ');
                    const handleClick = (event) => {
                        if (!this.app.state.settings.autoOpenMediaInNewTab || event.button !== 0) return;
                        const mediaLinkAncestor = event.target.closest(this.app.config.SELECTORS.GLOBAL.MEDIA_LINK);
                        if (!mediaLinkAncestor || mediaLinkAncestor.closest(unsafeSelector)) return;
                        let currentElement = event.target;
                        while (currentElement && currentElement !== mediaLinkAncestor) {
                            const tagName = currentElement.tagName.toLowerCase();
                            const role = currentElement.getAttribute('role');
                            if ((tagName === 'a' && currentElement !== mediaLinkAncestor) || role === 'button' || role === 'slider') return;
                            currentElement = currentElement.parentElement;
                        }
                        event.preventDefault();
                        event.stopPropagation();
                        window.open(mediaLinkAncestor.href, '_blank');
                    };
                    document.body.addEventListener('click', handleClick, true);
                }
            },

            scrollRestorer: {
                app: null,
                init(app) {
                    this.app = app;
                    let restoreY = null;
                    let watcherInterval = null;
                    let correctionInterval = null;
                    const C = this.app.config;
                    const forceScrollCorrection = () => {
                        if (restoreY === null) return;
                        if (correctionInterval) clearInterval(correctionInterval);
                        const {
                            CORRECTION_DURATION,
                            CORRECTION_FREQUENCY
                        } = C.SCROLL_RESTORER_CONFIG;
                        const startTime = Date.now();
                        const initialRestoreY = restoreY;
                        correctionInterval = setInterval(() => {
                            window.scrollTo({
                                top: initialRestoreY,
                                behavior: 'instant'
                            });
                            if (Date.now() - startTime > CORRECTION_DURATION) {
                                clearInterval(correctionInterval);
                                correctionInterval = null;
                                restoreY = null;
                            }
                        }, CORRECTION_FREQUENCY);
                    };
                    const startWatcher = () => {
                        if (watcherInterval) clearInterval(watcherInterval);
                        let isContentModalDetected = false;
                        let modalFirstSeenTime = null;
                        watcherInterval = setInterval(() => {
                            const modal = document.querySelector(C.SELECTORS.GLOBAL.DIALOG);
                            const hasLoginForm = modal && modal.querySelector(C.SELECTORS.GLOBAL.LOGIN_FORM);
                            if (!isContentModalDetected && modal && !hasLoginForm) {
                                isContentModalDetected = true;
                                modalFirstSeenTime = Date.now();
                            } else if (isContentModalDetected && !modal) {
                                if (Date.now() - modalFirstSeenTime > C.SCROLL_RESTORER_CONFIG.MODAL_GRACE_PERIOD) {
                                    clearInterval(watcherInterval);
                                    watcherInterval = null;
                                    forceScrollCorrection();
                                }
                            }
                        }, C.SCROLL_RESTORER_CONFIG.WATCHER_FREQUENCY);
                    };
                    const recordClick = e => {
                        if (watcherInterval || correctionInterval) return;
                        if (e.target.closest(C.SELECTORS.GLOBAL.POST_CONTAINER) && !e.target.closest('a[target="_blank"]')) {
                            restoreY = window.scrollY;
                            setTimeout(startWatcher, 0);
                        }
                    };
                    const handleCloseClick = e => {
                        if (e.target.closest(C.SELECTORS.GLOBAL.CLOSE_BUTTON) && restoreY !== null && watcherInterval) {
                            clearInterval(watcherInterval);
                            watcherInterval = null;
                            forceScrollCorrection();
                        }
                    };
                    document.body.addEventListener('click', recordClick, true);
                    document.body.addEventListener('click', handleCloseClick, true);
                }
            },

            autoUnmuter: {
                app: null,
                init(app) {
                    this.app = app;
                    const nativeVolumeSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume').set;
                    const nativeMutedSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted').set;
                    const attemptUnmute = (video) => {
                        if (!this.app.state.settings.autoUnmuteEnabled) return;
                        if (video instanceof HTMLVideoElement && (video.muted || video.volume === 0)) {
                            const targetVolume = this.app.state.settings.autoUnmuteVolume / 100;
                            nativeMutedSetter.call(video, false);
                            nativeVolumeSetter.call(video, targetVolume);
                            if (video.audioTracks?.length > 0) {
                                for (let track of video.audioTracks) track.enabled = true;
                            }
                            video.dispatchEvent(new Event('volumechange', {
                                bubbles: true
                            }));
                        }
                    };
                    document.addEventListener('play', (e) => attemptUnmute(e.target), true);
                    const observer = new MutationObserver(mutations => {
                        mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'VIDEO') attemptUnmute(node);
                            else if (node.querySelectorAll) node.querySelectorAll('video').forEach(attemptUnmute);
                        }));
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    document.addEventListener('click', (event) => {
                        if (event.target.closest('[aria-label*="mute" i], [aria-label*="sound" i], [role="button"][aria-pressed]')) {
                            setTimeout(() => document.querySelectorAll('video').forEach(attemptUnmute), 150);
                        }
                    }, true);
                    const checkInterval = setInterval(() => document.querySelectorAll('video').forEach(attemptUnmute), 2000);
                    window.addEventListener('beforeunload', () => {
                        clearInterval(checkInterval);
                        observer.disconnect();
                    });
                }
            },

            postNumbering: {
                app: null,
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
                    }, 50);
                },
                _getCurrentPageName() {
                    const h1 = document.querySelector('h1');
                    if (!h1) return null;
                    let pageName = '';
                    for (const node of h1.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE) pageName += node.nodeValue;
                    }
                    return pageName.trim();
                },
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
                            on: { mousedown: (e) => {
                                if (e.button === 0 || e.button === 1) { 
                                    e.preventDefault();
                                    window.open(`https://www.facebook.com${sc.url}`, e.button === 1 ? '_blank' : '_self');
                                }
                            }}
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
                    toolbar.addEventListener('focusout', (e) => { if (!this.state.isPinned && !toolbar.contains(e.relatedTarget)) setTimeout(() => this._hideBar(), 100); });
                    scopeSelector.addEventListener('change', () => this._updateSearchButtonState());
                    hoverTrigger.addEventListener('mouseenter', this._onHoverTriggerEnter.bind(this));
                    toolbar.addEventListener('mouseenter', this._onSearchBarEnter.bind(this));
                    hoverTrigger.addEventListener('mouseleave', this._onMouseLeave.bind(this));
                    toolbar.addEventListener('mouseleave', this._onMouseLeave.bind(this));
                    window.addEventListener('scroll', this.app.utils.throttle(() => this._handleScroll(), 100), { passive: true });
                    window.addEventListener('historyChange', () => this.updateVisibility());
                    new MutationObserver(this.app.utils.throttle(() => this.updateVisibility(), 150)).observe(document.body, { childList: true, subtree: true });
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
                updateVisibility() {
                    const C = this.app.config;
                    const currentPath = window.location.pathname;
                    const isDisallowed = ['/photo/', '/videos/', '/reel/', '/posts/', '/watch/'].some(p => currentPath.startsWith(p)) || !!document.querySelector(C.SELECTORS.GLOBAL.DIALOG);
                    const newVisibility = isDisallowed ? 'hidden' : 'visible';
                    const elementsToToggle = [this.elements.toolbar, this.elements.hoverTrigger, this.elements.hoverHint];
                    if (this.elements.toolbar.style.visibility !== newVisibility) elementsToToggle.forEach(el => el.style.visibility = newVisibility);
                    const isGroupPage = currentPath.startsWith('/groups/');
                    for (const option of this.elements.scopeSelector.options) {
                        if (option.parentElement.tagName !== 'OPTGROUP') continue;
                        const isContextualGroup = option.parentElement.label === this.app.state.T.searchGroupContextual;
                        option.disabled = isGroupPage && isContextualGroup && option.value !== '';
                    }
                    if (isGroupPage && this.elements.scopeSelector.options[this.elements.scopeSelector.selectedIndex].disabled) this.elements.scopeSelector.value = '';
                    this._handleScroll(true);
                    this._updateSearchButtonState();
                },
                _handleScroll(force = false) {
                    if (this.state.isPinned) return;
                    const currentIsAtTop = window.scrollY < 10;
                    if (!force && currentIsAtTop === this.state.isAtTop) return;
                    this.state.isAtTop = currentIsAtTop;
                    if (this.state.isAtTop) {
                        this._showBar();
                        this.elements.hoverHint.classList.remove('gm-visible');
                        if (this.elements.toolbar.contains(document.activeElement)) document.activeElement.blur();
                    } else {
                        if (!this.elements.toolbar.contains(document.activeElement)) this._hideBar();
                        this.elements.hoverHint.classList.add('gm-visible');
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
                        this._showBar();
                        hoverHint.classList.remove('gm-visible');
                    } else {
                        this._handleScroll(true); 
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
                init(app) { 
                    if (this.isInitialized) return; 
                    this.app = app; 
                    if (!this.app.state.settings.floatingNavEnabled) return; 
                    const T = this.app.state.T; 
                    const U = this.app.utils; 
                    // Dynamic reference
                    const getCore = () => this.app.modules.postNavigatorCore; 
                    const getLoader = () => this.app.modules.contentAutoLoader;
                    
                    this.container = U.createStyledElement('div', {}, { className: 'gm-floating-nav' }); 
                    
                    // --- Navigation Buttons ---
                    const prevButton = U.createStyledElement('button', {}, { title: T.floatingNavPrevTooltip }); 
                    prevButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>`; 
                    prevButton.addEventListener('mousedown', () => { const c = getCore(); if(c) c.startContinuousNavigation('prev'); }); 
                    prevButton.addEventListener('mouseleave', () => { const c = getCore(); if(c) c.stopContinuousNavigation(); }); 
                    
                    const nextButton = U.createStyledElement('button', {}, { title: T.floatingNavNextTooltip }); 
                    nextButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path></svg>`; 
                    nextButton.addEventListener('mousedown', () => { const c = getCore(); if(c) c.startContinuousNavigation('next'); }); 
                    nextButton.addEventListener('mouseleave', () => { const c = getCore(); if(c) c.stopContinuousNavigation(); }); 
                    
                    document.body.addEventListener('mouseup', () => { const c = getCore(); if(c) c.stopContinuousNavigation(); }); 

                    // --- Tools Separator ---
                    const separator = U.createStyledElement('div', { height: '4px' });

                    // --- Auto-Load Button ---
                    this.btnAutoLoad = U.createStyledElement('button', {}, { title: T.tooltipAutoLoadStart });
                    // Default Icon: Arrow Down
                    this.btnAutoLoad.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>`;
                    this.btnAutoLoad.addEventListener('click', () => {
                        const loader = getLoader();
                        if (loader) {
                            if (loader.state.isRunning) loader.stop('autoLoad_status_stopped');
                            else loader.start();
                        }
                    });

                    // --- Batch Copy Button ---
                    const btnBatchCopy = U.createStyledElement('button', {}, { title: T.tooltipBatchCopy });
                    // Icon: Clipboard
                    btnBatchCopy.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></svg>`;
                    btnBatchCopy.addEventListener('click', () => {
                         const loader = getLoader();
                         if (loader) loader.copyAllPosts();
                    });
                    
                    this.container.append(prevButton, nextButton, separator, this.btnAutoLoad, btnBatchCopy); 
                    document.body.appendChild(this.container); 
                    this.updateVisibility(); 
                    window.addEventListener('historyChange', this.updateVisibility.bind(this)); 
                    new MutationObserver(U.throttle(this.updateVisibility.bind(this), 200)).observe(document.body, { childList: true, subtree: true }); 
                    this.isInitialized = true; 
                }, 
                deinit() { 
                    if (this.container) { 
                        this.container.remove(); 
                        this.container = null; 
                        this.btnAutoLoad = null;
                    } 
                    this.isInitialized = false; 
                },
                updateButtonState(state) {
                    if (!this.btnAutoLoad) return;
                    const T = this.app.state.T;
                    if (state === 'start') {
                        // Change to Stop Icon (Square)
                        this.btnAutoLoad.innerHTML = `<svg viewBox="0 0 24 24" fill="#e02424"><path d="M6 6h12v12H6z"></path></svg>`;
                        this.btnAutoLoad.title = T.tooltipAutoLoadStop;
                        this.btnAutoLoad.style.borderColor = '#e02424';
                    } else {
                        // Revert to Start Icon (Arrow Down)
                        this.btnAutoLoad.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>`;
                        this.btnAutoLoad.title = T.tooltipAutoLoadStart;
                        this.btnAutoLoad.style.borderColor = '#ddd';
                    }
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
                    if (newIndex !== -1) Core.currentPostIndex = newIndex; 
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
                    console.log(`${this.app.config.LOG_PREFIX} [Tools] Module initialized.`);
                    this.startObserver();
                },

                deinit() {
                    if (this.observer) {
                        this.observer.disconnect();
                        this.observer = null;
                    }
                    this.cleanupButtons();
                },

                // --- Feature 1: Permalink Copier Logic ---
                async handlePermalinkClick(event, button) {
                    if (this.isProcessingClick) return;
                    // Stop event propagation immediately to prevent FB from intercepting
                    event.preventDefault(); 
                    event.stopPropagation();
                    
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
                    if (settings.copier_showButtonText) button.querySelector('span:last-child').textContent = T.copier_processing;

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

                // --- Feature 2: Smart Content Copier Logic (v0.1.5 Topology Fix + v0.1.6 Emoji) ---
                async handleCopyContentClick(event, button) {
                    if (this.isProcessingClick) return;
                    event.preventDefault(); 
                    event.stopPropagation();
                    
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const postEl = button.closest(this.app.config.SELECTORS.GLOBAL.POST_CONTAINER);
                    const contentContainer = postEl ? postEl.querySelector(C_TOOLS.CONTENT_BODY) : null;
                    const T = this.app.state.T;
                    const settings = this.app.state.settings;

                    this.isProcessingClick = true;
                    button.style.pointerEvents = 'none';
                    const originalContent = button.innerHTML;
                    
                    const iconWrapper = button.querySelector('.gm-icon-wrapper');
                    if (iconWrapper) iconWrapper.innerHTML = this.icons.processing;

                    if (!contentContainer) {
                        this.app.modules.toastNotifier.show(T.copier_notificationContentNotFound, 'failure');
                        await this.animateButtonFeedback(button, 'failure', originalContent);
                        this.isProcessingClick = false;
                        return;
                    }

                    try {
                        // Check for expand button ("See more")
                        const expandKeywords = this.app.config.TEXT_EXPANDER.TARGETS;
                        const expandBtn = Array.from(contentContainer.querySelectorAll(C_TOOLS.EXPAND_BTN))
                            .find(btn => expandKeywords.some(kw => btn.textContent.trim().includes(kw)) && btn.offsetParent !== null);

                        if (expandBtn) {
                            await new Promise((resolve) => {
                                let resolved = false;
                                const timeoutId = setTimeout(() => { if (!resolved) { resolved = true; resolve(); } }, 2500);
                                const observer = new MutationObserver(() => {
                                    if (!resolved) {
                                        clearTimeout(timeoutId); resolved = true; observer.disconnect();
                                        setTimeout(resolve, 150);
                                    }
                                });
                                observer.observe(contentContainer, { childList: true, subtree: true });
                                expandBtn.click();
                            });
                        }

                        // Prepare target container (Clone if emojis enabled)
                        let targetContainer = contentContainer;
                        if (settings.copier_includeEmojis) {
                            targetContainer = contentContainer.cloneNode(true);
                            // Replace emoji images with their alt text
                            const images = targetContainer.querySelectorAll('img[src*="emoji"][alt], img[alt]');
                            images.forEach(img => {
                                const src = img.getAttribute('src') || '';
                                const alt = img.getAttribute('alt');
                                // Prioritize images that look like emojis (src contains emoji.php or similar)
                                // or generally any inline image with alt text in the text body
                                if (alt && (src.includes('emoji') || img.className.includes('emoji') || src.includes('fbcdn.net'))) {
                                    img.replaceWith(document.createTextNode(alt));
                                }
                            });
                        }

                        // Extract text using Sibling Node Topology
                        const text = this.extractTextByTopology(targetContainer);
                        GM_setClipboard(text);
                        
                        this.app.modules.toastNotifier.show(T.copier_copyContentSuccess, 'success');
                        await this.animateButtonFeedback(button, 'success', originalContent);
                    } catch (error) {
                        console.error(`${this.app.config.LOG_PREFIX} [Tools] Copy Content Error:`, error);
                        this.app.modules.toastNotifier.show(T.copier_copyContentFailed, 'failure');
                        await this.animateButtonFeedback(button, 'failure', originalContent);
                    } finally {
                        this.isProcessingClick = false;
                    }
                },

                // Extracts text based on DOM structure (Parent grouping)
                extractTextByTopology(container) {
                    const C_TOOLS = this.app.config.SELECTORS.POST_TOOLS;
                    const rawBlocks = container.querySelectorAll(C_TOOLS.TEXT_BLOCKS);
                    
                    // Filter: Only leaf nodes (most nested div[dir="auto"])
                    const leafBlocks = Array.from(rawBlocks).filter(el => {
                        return el.querySelectorAll(C_TOOLS.TEXT_BLOCKS).length === 0 && el.innerText.trim().length > 0;
                    });

                    if (leafBlocks.length === 0) return container.innerText.trim();

                    let finalString = leafBlocks[0].innerText.trim();
                    for (let i = 1; i < leafBlocks.length; i++) {
                        const prevBlock = leafBlocks[i-1];
                        const currBlock = leafBlocks[i];
                        const currText = currBlock.innerText.trim();
                        
                        // Core Logic: 
                        // Same parent = compact list = \n
                        // Different parent = paragraph separation = \n\n
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

                    if (settings.copier_showButtonText && button.dataset.action === 'permalink') {
                        button.querySelector('span:last-child').textContent = status === 'success' ? T.copier_successPermalink : T.copier_failure;
                    }
                    
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

                    // 1. Copy Content Button (Left)
                    if (settings.enableCopyContentButton) {
                        const copyBtn = this.createButton('copy-content', this.icons.copy, this.app.state.T.copier_copyContent);
                        wrapper.appendChild(copyBtn);
                    }

                    // 2. Permalink Button (Right)
                    if (settings.permalinkCopierEnabled) {
                        const contentType = this.determinePostContentType(postEl);
                        const isSmart = settings.copier_useSmartLink && contentType === 'standard';
                        const icon = isSmart ? this.icons.smart : this.icons.direct;
                        const title = isSmart ? this.app.state.T.copier_fetchPermalinkSmart : this.app.state.T.copier_fetchPermalinkDirect;
                        const permalinkBtn = this.createButton('permalink', icon, title, settings.copier_showButtonText);
                        wrapper.appendChild(permalinkBtn);
                    }

                    insertionPoint.appendChild(wrapper);
                },
                createButton(action, svgIcon, title, showText = false) {
                    const C = this.app.config.SELECTORS.POST_TOOLS;
                    
                    // Direct binding to avoid propagation issues
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
                        ...(showText 
                            ? { padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center' } 
                            : { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                        )
                    }, {
                        className: C.BUTTON_CLASS,
                        role: 'button',
                        tabIndex: 0,
                        title: title,
                        'data-action': action,
                        innerHTML: showText
                            ? `<span class="gm-icon-wrapper">${svgIcon}</span><span style="margin-left: 5px; font-weight: 500; font-size: 13px;">${title}</span>`
                            : `<span class="gm-icon-wrapper">${svgIcon}</span>`,
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
                startObserver() { this.observer = new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(n => this.scanNodeForPosts(n))) ); this.scanNodeForPosts(document.body); this.observer.observe(document.body, { childList: true, subtree: true }); },
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

        async handleWorkerTask() {
            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get(this.config.WORKER_PARAM);
            if (!taskId) return;
            document.body.style.display = 'none';
            const settings = {};
            this.modules.settingsManager.definitions
                .filter(def => def.group === 'tools')
                .forEach(def => settings[def.key] = GM_getValue(def.key, def.defaultValue));
            const extractId = url => url ? (url.match(/(?:posts|videos|reel|v|story_fbid|multi_permalinks)(?:[=/].*?)(\d{15,})/)?.[1] || null) : null;
            const extractUser = url => url ? (url.match(/facebook\.com\/([a-zA-Z0-9.]+)\/(?:posts|videos|reels)\//)?.[1] || null) : null;
            const formatPermalink = info => {
                if (!info?.postId) return null;
                const format = settings.copier_permalinkFormat;
                if (format === 'shortest') return `https://fb.com/${info.postId}`;
                if (format === 'full' && info.canonicalUrl) try { const u = new URL(info.canonicalUrl); u.search = ''; return u.href.replace(/\/$/, ''); } catch (e) {}
                if (format === 'username' && info.username && info.username !== 'profile.php') return `https://www.facebook.com/${info.username}/posts/${info.postId}`;
                if (info.profileId) return `https://www.facebook.com/${info.profileId}/posts/${info.postId}`;
                return `https://www.facebook.com/posts/${info.postId}`;
            };
            const findNestedValue = (obj, key) => (obj && typeof obj === 'object') ? (key in obj ? obj[key] : Object.values(obj).reduce((acc, v) => acc ?? findNestedValue(v, key), undefined)) : undefined;
            const getFromRelay = () => { for (const script of document.querySelectorAll('script[type="application/json"]')) try { const d = JSON.parse(script.textContent); const id = findNestedValue(d, 'storyID'); if (id) { const ids = atob(id).match(/(\d+)/g); if (ids?.length >= 2) return { profileId: ids[0], postId: ids[1], method: 'relay' }; } } catch (e) {} return null; };
            const getFromHead = () => { const url = document.querySelector('link[rel="canonical"]')?.href; if (!url) return null; return { postId: extractId(url), username: extractUser(url), canonicalUrl: url, method: 'head' }; };
            const getFromBody = () => { for (const script of document.querySelectorAll('script[type="application/json"]')) try { if (!script.textContent.includes('debug_info') && !script.textContent.includes('share_fbid')) continue; const d = JSON.parse(script.textContent); const dbg = findNestedValue(d, 'debug_info'); if (dbg) { const ids = atob(dbg).match(/(\d+)/g); if (ids?.length >= 2) return { profileId: ids[0], postId: ids[1], method: 'body_debug' }; } const fbid = findNestedValue(d, 'share_fbid'); if (fbid) return { postId: fbid, method: 'body_fbid' }; } catch (e) {} return null; };
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
                console.log(`${this.config.LOG_PREFIX} [Worker] Task ${taskId} completed. Method: ${method}, URL: ${permalink}`);
                GM_setValue(taskId, { permalink, method });
            } catch (error) {
                GM_setValue(taskId, { permalink: fallbackUrl, method: 'error_fallback' });
            } finally {
                const closeTimeout = setTimeout(() => { if (listenerId) GM_removeValueChangeListener(listenerId); window.close(); }, 5000);
                listenerId = GM_addValueChangeListener(taskId, (name, oldVal, newVal, remote) => {
                    if (remote && newVal.resolved) { clearTimeout(closeTimeout); GM_removeValueChangeListener(listenerId); window.close(); }
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
                            if (moduleName === 'errorRecovery' && !this.state.settings.errorRecoveryEnabled) continue;
                            if (moduleName === 'transparencyActions' && !this.state.settings.transparencyButtonsEnabled) continue;
                            if (moduleName === 'idRevealer' && !this.state.settings.idRevealerEnabled) continue;
                            if (moduleName === 'contentExpander' && !this.state.settings.expandContentEnabled) continue;
                            // postHeaderTools handles its own checks inside
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
