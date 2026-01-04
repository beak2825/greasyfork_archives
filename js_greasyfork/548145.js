// ==UserScript==
// @name         Facebook Login Wall Remover
// @name:en      Facebook Login Wall Remover
// @name:zh-TW   Facebook 登入牆移除器
// @name:ja      Facebook ログインウォールリムーバー
// @version      0.4.0
// @description  This script improves the guest browsing experience on the Facebook desktop site. It aims to remove common interruptions and add helpful features for users who are not logged in.
// @description:en [Desktop Site | Guest Mode Only] Removes login popups and banners, prevents page jumps, and automatically opens media in a new tab to prevent page deadlocks. Now features an integrated, intelligent permalink copier for any post. Automatically disables itself when a logged-in state is detected.
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
                    // Not verified (generated from generic translations)
                    CLOSE_BUTTON: [
                        "Close", "關閉", "閉じる", "Cerrar", "Fermer", "Schließen", "Fechar", "Chiudi", "Sluiten", "Закрыть", "Kapat", "Zamknij",
                        "Tutup", "Đóng", "ปิด", "Zatvori", "Zavrieť", "Zavřít", "Bezárás", "Stäng", "Luk", "Lukk", "Sulje", "Κλείσιμο",
                        "Închide", "إغلاق", "סגור"
                    ].map(label => `[aria-label="${label}"][role="button"]`).join(', ') + ', div[role="button"]:has(i[data-visualcompletion="css-img"])',
                },
                NAVIGATOR: {
                    HIGHLIGHT_CLASS: 'gm-post-highlight',
                },
                PERMALINK_COPIER: {
                    BUTTON_CLASS: 'fpc-button',
                    PROCESSED_MARKER: 'fpc-processed',
                    FEED_POST_HEADER: 'div[data-ad-rendering-role="profile_name"] h2, div[data-ad-rendering-role="profile_name"] h3',
                    DIALOG_POST_HEADER: 'h2, h3',
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
                    errorRecoveryEnabled: 'Auto-reload on error page (Button detection)',
                    transparencyButtonsEnabled: 'Show Page Transparency shortcuts (Bottom-Left)',
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
                    settingsColumnPermalink: 'Permalink Copier',
                    copier_enableModule: 'Enable Permalink Copier',
                    copier_fetchPermalinkSmart: 'Permalink (Smart)',
                    copier_fetchPermalinkDirect: 'Permalink (Direct)',
                    copier_processing: 'Processing...',
                    copier_successPermalink: '✅ Copied',
                    copier_failure: '❌ Failed',
                    copier_notificationPermalinkCopied: 'Permalink copied to clipboard:\n{url}',
                    copier_notificationErrorGeneric: 'Failed to fetch permalink.',
                    copier_notificationErrorNoSourceUrl: 'Failed: Could not find a source URL.',
                    copier_notificationErrorTimeout: 'Failed: Background fetch timed out.',
                    copier_menu_useSmartLink: 'Auto-Fetch Permalinks (Smart Mode)',
                    copier_menu_showButtonText: 'Show Button Text',
                    copier_menu_permalinkFormat: 'Permalink Format',
                    copier_format_full: 'Full URL (with slug)',
                    copier_format_username: 'Username + Post ID',
                    copier_format_author_id: 'Author ID + Post ID (Most Reliable)',
                    copier_format_shortest: 'Shortest (fb.com, less compatible)',
                    tooltipAds: 'Go to Ads Library (About)',
                    tooltipTransparency: 'Go to Internal Transparency',
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
                    hideUselessElements: '隱藏訪客專用介面元素',
                    hidePostStats: '隱藏貼文統計數據 (讚數、留言數)',
                    autoUnmuteEnabled: '自動取消影片靜音',
                    postNumberingEnabled: '在動態消息上顯示貼文順序',
                    errorRecoveryEnabled: '錯誤頁面自動恢復 (按鈕偵測)',
                    transparencyButtonsEnabled: '顯示透明度捷徑按鈕 (左下角)',
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
                    settingsColumnPermalink: '永久連結複製器',
                    copier_enableModule: '啟用永久連結複製器',
                    copier_fetchPermalinkSmart: '永久連結 (智慧)',
                    copier_fetchPermalinkDirect: '永久連結 (直接)',
                    copier_processing: '處理中...',
                    copier_successPermalink: '✅ 已複製',
                    copier_failure: '❌ 失敗',
                    copier_notificationPermalinkCopied: '永久連結已複製：\n{url}',
                    copier_notificationErrorGeneric: '獲取永久連結失敗。',
                    copier_notificationErrorNoSourceUrl: '失敗：找不到來源網址。',
                    copier_notificationErrorTimeout: '失敗：背景處理逾時。',
                    copier_menu_useSmartLink: '自動取得永久連結 (智慧模式)',
                    copier_menu_showButtonText: '顯示按鈕文字',
                    copier_menu_permalinkFormat: '永久連結格式',
                    copier_format_full: '完整網址 (含 Slug)',
                    copier_format_username: '使用者名稱 + 貼文 ID',
                    copier_format_author_id: '作者 ID + 貼文 ID (最可靠)',
                    copier_format_shortest: '最短連結 (fb.com, 相容性較差)',
                    tooltipAds: '前往 廣告檔案庫 (關於)',
                    tooltipTransparency: '查看 站內透明度資訊',
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
                    errorRecoveryEnabled: 'エラーページ自動回復 (ボタン検出)',
                    transparencyButtonsEnabled: '透明性ショートカットを表示 (左下)',
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
                    settingsColumnPermalink: '固定リンクコピー機',
                    copier_enableModule: '固定リンクコピー機を有効にする',
                    copier_fetchPermalinkSmart: '固定リンク (スマート)',
                    copier_fetchPermalinkDirect: '固定リンク (直接)',
                    copier_processing: '処理中...',
                    copier_successPermalink: '✅ コピーしました',
                    copier_failure: '❌ 失敗',
                    copier_notificationPermalinkCopied: '固定リンクをクリップボードにコピーしました：\n{url}',
                    copier_notificationErrorGeneric: '固定リンクの取得に失敗しました。',
                    copier_notificationErrorNoSourceUrl: '失敗：ソースURLが見つかりませんでした。',
                    copier_notificationErrorTimeout: '失敗：バックグラウンドでの取得がタイムアウトしました。',
                    copier_menu_useSmartLink: '固定リンクを自動取得 (スマートモード)',
                    copier_menu_showButtonText: 'ボタンテキストを表示',
                    copier_menu_permalinkFormat: '固定リンク形式',
                    copier_format_full: '完全なURL (スラグ付き)',
                    copier_format_username: 'ユーザー名 + 投稿ID',
                    copier_format_author_id: '作成者ID + 投稿ID (最も信頼性が高い)',
                    copier_format_shortest: '最短リンク (fb.com, 互換性低)',
                    tooltipAds: '広告ライブラリへ (情報)',
                    tooltipTransparency: '透明性情報を表示',
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
            /**
             * Reliably checks if the user is logged into Facebook.
             * @returns {boolean} True if logged in, false otherwise.
             */
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

            /**
             * Creates a throttled function that only invokes `func` at most once per `delay` milliseconds.
             * @param {Function} func The function to throttle.
             * @param {number} delay The number of milliseconds to throttle invocations to.
             * @returns {Function} Returns the new throttled function.
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
             * Creates and styles an HTML element.
             * @param {string} tag The HTML tag name.
             * @param {object} styles An object of CSS styles to apply.
             * @param {object} properties An object of properties to assign to the element.
             * @returns {HTMLElement} The created element.
             */
            createStyledElement(tag, styles = {}, properties = {}) {
                const element = document.createElement(tag);
                Object.assign(element.style, styles);
                Object.assign(element, properties);
                return element;
            },
            
            /**
             * Checks if the current page is a main feed page where post navigation is relevant.
             * @returns {boolean} True if it's a feed page.
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

                const disallowedFirstSegments = [
                    'watch', 'marketplace', 'gaming', 'events', 'messages',
                    'notifications', 'friends', 'photo', 'videos', 'reel',
                    'posts', 'stories', 'settings', 'saved'
                ];

                return !disallowedFirstSegments.includes(pathSegments[0]);
            },

            /**
             * A simple promise-based delay.
             * @param {number} ms The number of milliseconds to wait.
             * @returns {Promise<void>}
             */
            delay: ms => new Promise(res => setTimeout(res, ms)),

            /**
             * Smart open link based on event type.
             * Left click: window.open (Foreground)
             * Middle/Ctrl click: GM_openInTab (Background)
             */
             smartOpen(event, url) {
                event.preventDefault();
                const isBackground = event.button === 1 || event.ctrlKey || event.metaKey;
                if (isBackground) {
                    GM_openInTab(url, { active: false, insert: true });
                } else {
                    window.open(url, '_blank');
                }
            }
        },

        // --- CORE MODULES ---
        modules: {
            /**
             * Manages script settings, persistence, and the user menu.
             */
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
                        { key: 'autoUnmuteEnabled', type: 'boolean', defaultValue: true, labelKey: 'autoUnmuteEnabled', group: 'general' },
                        { key: 'autoUnmuteVolume', type: 'range', defaultValue: 25, labelKey: 'setVolumeLabel', options: { min: 0, max: 100, step: 5, unit: '%' }, group: 'general' },
                        { key: 'postNumberingEnabled', type: 'boolean', defaultValue: true, labelKey: 'postNumberingEnabled', group: 'general' },
                    ];
                    const navigationSettings = [
                        { key: 'keyboardNavEnabled', type: 'boolean', defaultValue: true, labelKey: 'keyboardNavEnabled', group: 'navigation' },
                        { key: 'keyNavNextPrimary', type: 'text', defaultValue: 'j', labelKey: 'keyNavNextPrimary', group: 'navigation' },
                        { key: 'keyNavPrevPrimary', type: 'text', defaultValue: 'k', labelKey: 'keyNavPrevPrimary', group: 'navigation' },
                        { key: 'keyNavNextSecondary', type: 'text', defaultValue: 'ArrowRight', labelKey: 'keyNavNextSecondary', group: 'navigation' },
                        { key: 'keyNavPrevSecondary', type: 'text', defaultValue: 'ArrowLeft', labelKey: 'keyNavPrevSecondary', group: 'navigation' },
                        { key: 'floatingNavEnabled', type: 'boolean', defaultValue: true, labelKey: 'floatingNavEnabled', group: 'navigation', instant: true },
                        { key: 'wheelNavEnabled', type: 'boolean', defaultValue: true, labelKey: 'wheelNavEnabled', group: 'navigation' },
                        { key: 'wheelNavModifier', type: 'select', defaultValue: 'shiftKey', labelKey: 'wheelNavModifier', options: [ { value: 'altKey', labelKey: 'modifierAlt' }, { value: 'ctrlKey', labelKey: 'modifierCtrl' }, { value: 'shiftKey', labelKey: 'modifierShift' }, { value: 'none', labelKey: 'modifierNone' } ], group: 'navigation' },
                        { key: 'navigationScrollAlignment', type: 'select', defaultValue: 'top', labelKey: 'navigationScrollAlignment', options: [ { value: 'center', labelKey: 'scrollAlignmentCenter' }, { value: 'top', labelKey: 'scrollAlignmentTop' } ], group: 'navigation' },
                        { key: 'enableSmoothScrolling', type: 'boolean', defaultValue: true, labelKey: 'enableSmoothScrolling', group: 'navigation' },
                        { key: 'continuousNavInterval', type: 'range', defaultValue: 500, labelKey: 'continuousNavInterval', options: { min: 0, max: 1000, step: 50, unit: 'ms' }, group: 'navigation' },
                    ];
                    const permalinkSettings = [
                        { key: 'permalinkCopierEnabled', type: 'boolean', defaultValue: true, labelKey: 'copier_enableModule', group: 'permalink', instant: true },
                        { key: 'copier_useSmartLink', type: 'boolean', defaultValue: true, labelKey: 'copier_menu_useSmartLink', group: 'permalink', instant: true },
                        { key: 'copier_showButtonText', type: 'boolean', defaultValue: false, labelKey: 'copier_menu_showButtonText', group: 'permalink', instant: true },
                        {
                            key: 'copier_permalinkFormat', type: 'select', defaultValue: 'author_id', labelKey: 'copier_menu_permalinkFormat',
                            options: [
                                { value: 'author_id', labelKey: 'copier_format_author_id' }, { value: 'username', labelKey: 'copier_format_username' },
                                { value: 'full', labelKey: 'copier_format_full' }, { value: 'shortest', labelKey: 'copier_format_shortest' },
                            ],
                            group: 'permalink'
                        },
                    ];
                    return [...generalSettings, ...navigationSettings, ...permalinkSettings];
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
                    this.registeredCommands.push(
                        GM_registerMenuCommand(T.menuSettings, settingsCommand)
                    );

                    const resetCommand = () => {
                        if (window.confirm(T.resetSettingsConfirm)) {
                            this.resetAllSettings();
                            this.app.modules.toastNotifier.show(T.notificationSettingsReset, 'success');
                        }
                    };
                    this.registeredCommands.push(
                        GM_registerMenuCommand(T.menuResetSettings, resetCommand)
                    );
                },
                updateSetting(key, value) {
                    GM_setValue(key, value);
                    this.app.state.settings[key] = value;
                },
                handleSettingChange(key, newValue, oldValue) {
                    const PC = this.app.modules.permalinkCopier;
                    const FN = this.app.modules.floatingNavigator;
                    const SI = this.app.modules.styleInjector;
                    const ER = this.app.modules.errorRecovery;
                    const TA = this.app.modules.transparencyActions;

                    switch (key) {
                        case 'permalinkCopierEnabled':
                            if (newValue) PC.init(this.app);
                            else PC.deinit();
                            break;
                        case 'copier_useSmartLink':
                        case 'copier_showButtonText':
                            if (this.app.state.settings.permalinkCopierEnabled) {
                                PC.reEvaluateAllButtons();
                            }
                            break;
                        case 'floatingNavEnabled':
                            if (newValue) FN.init(this.app);
                            else FN.deinit();
                            break;
                        case 'hidePostStats':
                            SI.updateStatsBarVisibility(newValue);
                            break;
                        case 'errorRecoveryEnabled':
                            if (newValue) ER.init(this.app);
                            break;
                        case 'transparencyButtonsEnabled':
                            if (newValue) TA.init(this.app);
                            else TA.deinit();
                            break;
                    }
                },
                resetAllSettings() {
                    this.definitions.forEach(def => {
                        const oldValue = this.app.state.settings[def.key];
                        const newValue = def.defaultValue;

                        if (oldValue !== newValue) {
                            this.updateSetting(def.key, newValue);
                            if (def.instant) {
                                this.handleSettingChange(def.key, newValue, oldValue);
                            }
                        }
                    });
                },
            },

            /**
             * Renders and manages the settings modal dialog.
             */
            settingsModal: {
                app: null,
                modalContainer: null,
                init(app) {
                    this.app = app;
                },
                open() {
                    if (!this.modalContainer) this._createModal();

                    const T = this.app.state.T;
                    const body = this.modalContainer.body;
                    body.innerHTML = ''; 

                    const layout = this.app.utils.createStyledElement('div', { display: 'flex', gap: '24px', flexWrap: 'wrap' });
                    const columns = {
                        general: this._createSettingsColumn(T.settingsColumnGeneral, 'general'),
                        navigation: this._createSettingsColumn(T.settingsColumnNavigation, 'navigation'),
                        permalink: this._createSettingsColumn(T.settingsColumnPermalink, 'permalink')
                    };

                    layout.append(columns.general, columns.navigation, columns.permalink);
                    body.append(layout);

                    this._setupDependentControls(body);
                    this.modalContainer.backdrop.style.display = 'block';
                    this.modalContainer.modal.style.display = 'block';
                },
                _createSettingsColumn(title, group) {
                    const column = this.app.utils.createStyledElement('div', { flex: '1', minWidth: '250px' });
                    const heading = this.app.utils.createStyledElement('h4', { marginTop: '0', borderBottom: '1px solid #eee', paddingBottom: '8px' }, { textContent: title });
                    column.append(heading);

                    this.app.modules.settingsManager.definitions
                        .filter(def => def.group === group)
                        .forEach(def => {
                            const row = this._createSettingRow(def);
                            column.append(row);
                        });

                    return column;
                },
                _createSettingRow(def) {
                    const U = this.app.utils;
                    const T = this.app.state.T;
                    const SM = this.app.modules.settingsManager;

                    const wrapper = U.createStyledElement('div', { display: 'flex', alignItems: 'center', marginBottom: '12px', transition: 'opacity 0.2s' });
                    const label = U.createStyledElement('label', { marginRight: '8px', flexShrink: '0' }, { htmlFor: `setting-${def.key}`, textContent: T[def.labelKey] });
                    wrapper.append(label);

                    let inputElement;
                    const currentValue = this.app.state.settings[def.key];

                    switch (def.type) {
                        case 'boolean':
                            inputElement = U.createStyledElement('input', { marginLeft: 'auto' }, { type: 'checkbox', id: `setting-${def.key}`, checked: currentValue });
                            break;
                        case 'range':
                            const rangeWrapper = U.createStyledElement('div', { display: 'flex', alignItems: 'center', flexGrow: '1' });
                            inputElement = U.createStyledElement('input', { flexGrow: '1' }, { type: 'range', id: `setting-${def.key}`, min: def.options.min, max: def.options.max, step: def.options.step, value: currentValue });
                            const valueSpan = U.createStyledElement('span', { marginLeft: '12px', minWidth: '45px', textAlign: 'right', fontSize: '13px' }, { textContent: `${currentValue}${def.options.unit || ''}` });
                            inputElement.addEventListener('input', () => valueSpan.textContent = `${inputElement.value}${def.options.unit || ''}`);
                            rangeWrapper.append(inputElement, valueSpan);
                            wrapper.append(rangeWrapper);
                            break;
                        case 'text':
                            inputElement = U.createStyledElement('input', { marginLeft: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', width: '100px' }, { type: 'text', id: `setting-${def.key}`, value: currentValue });
                            break;
                        case 'select':
                            inputElement = U.createStyledElement('select', { marginLeft: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px' }, { id: `setting-${def.key}` });
                            def.options.forEach(opt => {
                                const option = U.createStyledElement('option', {}, { value: opt.value, textContent: T[opt.labelKey] });
                                inputElement.append(option);
                            });
                            inputElement.value = currentValue;
                            break;
                    }
                    wrapper.append(inputElement);

                    inputElement.addEventListener('input', () => {
                        const oldValue = this.app.state.settings[def.key];
                        let newValue;
                        if (def.type === 'boolean') newValue = inputElement.checked;
                        else if (def.type === 'range') newValue = parseInt(inputElement.value, 10);
                        else newValue = inputElement.value;

                        SM.updateSetting(def.key, newValue);
                        if (def.instant) {
                            SM.handleSettingChange(def.key, newValue, oldValue);
                        }
                    });

                    if (def.key === 'autoUnmuteVolume') wrapper.dataset.controls = 'autoUnmuteEnabled';
                    if (def.key.startsWith('keyNav')) wrapper.dataset.controls = 'keyboardNavEnabled';
                    if (def.group === 'permalink' && def.key !== 'permalinkCopierEnabled') wrapper.dataset.controls = 'permalinkCopierEnabled';

                    return wrapper;
                },
                _setupDependentControls(container) {
                    const controllers = {
                        autoUnmuteEnabled: container.querySelector('#setting-autoUnmuteEnabled'),
                        keyboardNavEnabled: container.querySelector('#setting-keyboardNavEnabled'),
                        permalinkCopierEnabled: container.querySelector('#setting-permalinkCopierEnabled'),
                    };

                    const toggleGroup = (controller, isEnabled) => {
                        const controls = container.querySelectorAll(`[data-controls="${controller.id.substring(8)}"]`);
                        controls.forEach(control => {
                            control.style.opacity = isEnabled ? '1' : '0.5';
                            const input = control.querySelector('input, select');
                            if (input) input.disabled = !isEnabled;
                        });
                    };

                    const updateAll = () => {
                        Object.values(controllers).forEach(controller => {
                            if (controller) toggleGroup(controller, controller.checked);
                        });
                    };

                    Object.values(controllers).forEach(controller => {
                        if (controller) controller.addEventListener('input', updateAll);
                    });

                    updateAll();
                },
                _createModal() {
                    const T = this.app.state.T;
                    const U = this.app.utils;

                    const backdrop = U.createStyledElement('div', { position: 'fixed', inset: '0px', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '99998' });
                    const modal = U.createStyledElement('div', { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: '99999', minWidth: '600px', maxWidth: '90vw' });
                    const header = U.createStyledElement('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #ddd' });
                    const title = U.createStyledElement('h2', { margin: '0', fontSize: '18px' }, { textContent: T.settingsTitle });
                    const closeButton = U.createStyledElement('button', { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0 8px' }, { innerHTML: '&times;' });
                    const body = U.createStyledElement('div', { padding: '16px', maxHeight: '70vh', overflowY: 'auto' });
                    const footer = U.createStyledElement('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid #ddd' });
                    const saveButton = U.createStyledElement('button', { padding: '8px 16px', border: '1px solid #1877F2', backgroundColor: '#1877F2', color: 'white', borderRadius: '6px', cursor: 'pointer' }, { textContent: T.saveAndClose });

                    const resetButton = U.createStyledElement('button', {
                        padding: '8px 12px',
                        border: '1px solid #d9534f',
                        backgroundColor: 'transparent',
                        color: '#d9534f',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s, color 0.2s',
                    }, { textContent: T.resetSettings });

                    resetButton.addEventListener('mouseenter', () => {
                        resetButton.style.backgroundColor = '#d9534f';
                        resetButton.style.color = 'white';
                    });
                    resetButton.addEventListener('mouseleave', () => {
                        resetButton.style.backgroundColor = 'transparent';
                        resetButton.style.color = '#d9534f';
                    });

                    const buttonGroup = U.createStyledElement('div', { display: 'flex', gap: '8px' });
                    buttonGroup.append(saveButton);

                    header.append(title, closeButton);
                    footer.append(resetButton, buttonGroup);
                    modal.append(header, body, footer);
                    document.body.append(backdrop, modal);

                    this.modalContainer = { backdrop, modal, body };

                    closeButton.addEventListener('click', () => this.close());
                    backdrop.addEventListener('click', () => this.close());
                    saveButton.addEventListener('click', () => this.saveAndClose());

                    resetButton.addEventListener('click', () => {
                        if (window.confirm(T.resetSettingsConfirm)) {
                            this.app.modules.settingsManager.resetAllSettings();
                            this.app.modules.toastNotifier.show(T.notificationSettingsReset, 'success');
                            this.open(); 
                        }
                    });

                    this.close(); 
                },
                close() {
                    if (this.modalContainer) {
                        this.modalContainer.backdrop.style.display = 'none';
                        this.modalContainer.modal.style.display = 'none';
                    }
                },
                saveAndClose() {
                    const needsReload = this.app.modules.settingsManager.definitions.some(def => {
                        return def.needsReload && this.app.state.settings[def.key] !== GM_getValue(def.key);
                    });

                    if (needsReload) {
                        this.app.modules.toastNotifier.show(this.app.state.T.notificationSettingsReload, 'success');
                    }

                    this.close();
                }
            },

            /**
             * Intercepts native DOM methods to prevent unwanted page behavior.
             */
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

            /**
             * Patches history methods to allow listening for SPA navigations.
             */
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

            /**
             * Displays non-blocking toast notifications.
             */
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

            /**
             * Injects all necessary CSS into the document head.
             */
            styleInjector: {
                app: null,
                statsStyleElement: null,
                init(app) {
                    this.app = app;
                    const C = this.app.config;
                    const settings = this.app.state.settings;

                    const hideSelectors = [
                        `div[data-nosnippet]`,
                        `div[role="banner"]:has(a[href*="/reg/"])`
                    ];
                    
                    let uselessElementsCSS = '';
                    if (settings.hideUselessElements) {
                        hideSelectors.push(`div[role="banner"]:has(${C.SELECTORS.GLOBAL.LOGIN_FORM})`);

                        const toolbarRuleA = `div:has(> div > div > div[role="button"]:not([aria-haspopup]) > div > div > i[data-visualcompletion="css-img"])`;
                        const toolbarRuleB = `div:has(> div > div[role="button"]:not([aria-haspopup]) > div > div > i[data-visualcompletion="css-img"])`;
                        const threeDotMenuSelector = `div[role="button"][aria-haspopup="menu"]:has(svg circle + circle + circle)`;
                        const stickyBannerSelector = 'div[style*="top:"][style*="z-index"]:has(div[role="tablist"])';

                        uselessElementsCSS = `
                            /* --- HIDE USELESS ELEMENTS (CSS :has) --- */
                            ${toolbarRuleA}, ${toolbarRuleB} { display: none !important; }
                            ${threeDotMenuSelector} { display: none !important; }
                            ${stickyBannerSelector} { position: static !important; }
                        `;
                    }

                    const baseStyles = `${hideSelectors.join(',\n')} { display: none !important; }`;

                    const highlightStyles = `
                        .${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS} {
                            outline: 3px solid #1877F2 !important;
                            box-shadow: 0 0 15px rgba(24, 119, 242, 0.5) !important;
                            border-radius: 8px;
                            z-index: 10 !important;
                        }`;

                    const floatingNavStyles = `
                        .gm-floating-nav { position: fixed; bottom: 20px; right: 20px; z-index: 9990; display: flex; flex-direction: column; gap: 8px; }
                        .gm-floating-nav button { background-color: rgba(255, 255, 255, 0.9); border: 1px solid #ddd; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: background-color 0.2s, transform 0.1s; }
                        .gm-floating-nav button:hover { background-color: #f0f2f5; }
                        .gm-floating-nav button:active { transform: scale(0.95); }
                        .gm-floating-nav svg { width: 20px; height: 20px; fill: #65676b; }
                    `;

                    const searchBarStyles = `
                        .gm-toolbar {
                            position: fixed; top: 0; left: 0; width: 100%;
                            padding: 4px 16px; background-color: #FFFFFF; z-index: 9998;
                            display: flex; align-items: center; justify-content: space-between;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2); box-sizing: border-box;
                            transition: transform 0.3s ease-in-out;
                            gap: 16px;
                        }
                        .gm-button-group { display: flex; align-items: center; }
                        .gm-button-group button {
                            background-color: #F0F2F5; border: 1px solid #CED0D4; padding: 0;
                            height: 32px; width: 32px; cursor: pointer; display: flex;
                            align-items: center; justify-content: center; transition: background-color 0.2s;
                        }
                        .gm-button-group button:hover { background-color: #E4E6EB; }
                        .gm-button-group button:not(:first-child) { margin-left: -1px; }
                        .gm-button-group button:first-child { border-radius: 6px 0 0 6px; }
                        .gm-button-group button:last-child { border-radius: 0 6px 6px 0; }
                        .gm-button-group button svg { width: 16px; height: 16px; fill: #65676B; }
                        .gm-button-group button.gm-pinned { background-color: #E7F3FF; }

                        .gm-search-core-wrapper { flex-grow: 1; display: flex; justify-content: center; }
                        .gm-search-component-wrapper {
                            display: flex; align-items: center; border: 1px solid #CED0D4;
                            border-radius: 18px; background-color: #F0F2F5; padding: 0;
                            transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
                            height: 36px; flex-grow: 1; max-width: 600px;
                        }
                        .gm-search-component-wrapper.gm-focused {
                            border-color: #1877F2;
                            box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.2);
                            background-color: #FFFFFF;
                        }
                        .gm-search-component-wrapper > select,
                        .gm-search-input-container > input {
                            background: transparent; border: none; outline: none;
                            height: 100%; padding-top: 0; padding-bottom: 0;
                        }
                        .gm-search-component-wrapper > select {
                            padding-left: 12px; padding-right: 8px; margin-right: 8px;
                            border-right: 1px solid #CED0D4; color: #65676B; font-weight: 500;
                        }
                        .gm-search-input-container {
                            position: relative; display: flex; align-items: center;
                            flex-grow: 1; height: 100%;
                        }
                        .gm-search-input-container > input { padding-right: 80px; width: 100%; }
                        .gm-search-clear-button {
                            position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
                            cursor: pointer; color: #65676B; font-size: 14px;
                            width: 20px; height: 20px; display: none; align-items: center; justify-content: center;
                            background: none; border: none; padding: 0;
                        }
                        .gm-search-button-integrated {
                           position: absolute; right: 0; height: 100%; width: 40px;
                           background: transparent; border: none; display: flex; align-items: center;
                           justify-content: center; cursor: pointer; padding: 0; border-radius: 0 18px 18px 0;
                        }
                        .gm-search-button-integrated svg { width: 18px; height: 18px; fill: #1877F2; }

                        .gm-hover-hint {
                            position: fixed; top: 0; left: 50%;
                            width: 40px; height: 4px; background-color: rgba(0, 0, 0, 0.25);
                            border-radius: 2px; z-index: 10000;
                            opacity: 0; transform: translate(-50%, -12px);
                            transition: opacity 0.2s ease-in-out, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                            pointer-events: none;
                        }
                        .gm-hover-hint.gm-visible {
                            opacity: 1;
                            transform: translate(-50%, 8px);
                        }
                    `;

                    const toastStyles = `
                        .gm-toast {
                            position: fixed; top: 20px; left: 50%;
                            transform: translate(-50%, -100px); padding: 12px 20px; border-radius: 8px;
                            color: white; font-size: 14px; font-weight: bold; z-index: 99999;
                            opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease;
                            box-shadow: 0 4px 10px rgba(0,0,0,0.2); backdrop-filter: blur(5px);
                            white-space: pre-wrap;
                        }
                        .gm-toast-visible { opacity: 1; transform: translate(-50%, 0); }
                        .gm-toast-success { background-color: rgba(24, 119, 242, 0.85); }
                        .gm-toast-failure { background-color: rgba(220, 53, 69, 0.85); }
                        .gm-toast a {
                            color: white;
                            text-decoration: underline;
                            font-weight: 600;
                            transition: opacity 0.2s;
                        }
                        .gm-toast a:hover {
                            opacity: 0.8;
                        }
                    `;

                    const copierButtonStyles = `
                        .${C.SELECTORS.PERMALINK_COPIER.BUTTON_CLASS} {
                           --positive-background: #E7F3FF; --negative-background: #FDEDEE;
                           --hover-overlay: rgba(0, 0, 0, 0.05); --secondary-text: #65676B;
                           --media-inner-border: #CED0D4;
                        }
                    `;

                    const finalCSS = [baseStyles, uselessElementsCSS, highlightStyles, floatingNavStyles, searchBarStyles, toastStyles, copierButtonStyles].join('\n\n');
                    const styleElement = this.app.utils.createStyledElement('style', {}, { textContent: finalCSS });
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

            /**
             * Periodically scans and removes login walls and other UI annoyances.
             */
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

                        if (state.url !== currentUrl) {
                            state = { url: currentUrl, count: 0 };
                        }

                        if (state.count >= C.MAX_RETRIES) {
                            console.warn(`${this.app.config.LOG_PREFIX} [ErrorRecovery] Max retries reached for this URL.`);
                            return;
                        }

                        console.log(`${this.app.config.LOG_PREFIX} [ErrorRecovery] Error page detected. Retrying...`);
                        state.count++;
                        sessionStorage.setItem(C.STORAGE_KEY, JSON.stringify(state));
                        btn.click();
                        
                        setTimeout(() => {
                            if (document.querySelector(selector)) {
                                window.location.reload();
                            }
                        }, 1000);
                    };

                    const throttledRun = this.app.utils.throttle(run, 1000);
                    const observer = new MutationObserver(throttledRun);
                    observer.observe(document.body, { childList: true, subtree: true });
                    run();
                }
            },

            // [NEW] Transparency Buttons (Sender)
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
                        this.container = this.app.utils.createStyledElement('div', {
                            position: 'fixed', bottom: '20px', left: '20px', zIndex: '9990',
                            display: 'none', flexDirection: 'column', gap: '10px'
                        });
                        
                        const T = this.app.state.T;
                        const C = this.app.config.ADS_LIB;
                        const U = this.app.utils;

                        // Ads Button
                        const btnAds = this._createBtn('📢', T.tooltipAds);
                        btnAds.addEventListener('mouseup', (e) => {
                            if (this.app.state.cachedPageID) {
                                localStorage.setItem(C.KEY_TARGET_ID, this.app.state.cachedPageID);
                                const url = `https://www.facebook.com/ads/library/?active_status=active&view_all_page_id=${this.app.state.cachedPageID}`;
                                U.smartOpen(e, url);
                            }
                        });
                        btnAds.addEventListener('mousedown', (e) => { if (e.button === 1) e.preventDefault(); });

                        // Internal Transparency Button
                        const btnInt = this._createBtn('🛡️', T.tooltipTransparency);
                        btnInt.addEventListener('mouseup', (e) => {
                            if (this.app.state.cachedPageID) {
                                localStorage.setItem(C.KEY_INT_ACTION, 'true');
                                const loc = window.location;
                                let targetUrl = '';
                                if (loc.pathname.includes('profile.php')) {
                                    const params = new URLSearchParams(loc.search);
                                    targetUrl = `${loc.origin}${loc.pathname}?id=${params.get('id')}&sk=about_profile_transparency`;
                                } else if (loc.pathname.startsWith('/people/')) {
                                    const cleanPath = loc.pathname.replace(/\/$/, '');
                                    targetUrl = `${loc.origin}${cleanPath}/?sk=about_profile_transparency`;
                                } else {
                                    const rootPath = `/${loc.pathname.split('/')[1]}`;
                                    targetUrl = `${loc.origin}${rootPath}/about_profile_transparency`;
                                }
                                U.smartOpen(e, targetUrl);
                            }
                        });
                        btnInt.addEventListener('mousedown', (e) => { if (e.button === 1) e.preventDefault(); });

                        this.container.appendChild(btnInt);
                        this.container.appendChild(btnAds);
                        document.body.appendChild(this.container);
                    }

                    if (this.app.state.cachedPageID) {
                        this.container.style.display = 'flex';
                    } else {
                        this.container.style.display = 'none';
                    }
                },
                _createBtn(icon, title) {
                    const btn = this.app.utils.createStyledElement('button', {
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'white', border: '1px solid #ddd',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.15)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', transition: 'transform 0.1s'
                    }, { title: title, innerHTML: icon });
                    
                    btn.onmouseover = () => btn.style.backgroundColor = '#f0f2f5';
                    btn.onmouseleave = () => btn.style.backgroundColor = 'white';
                    btn.onmousedown = () => btn.style.transform = 'scale(0.95)';
                    btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
                    return btn;
                }
            },

            // [NEW] Ads Library Handler (Receiver)
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

                        // 1. AdBlock Remover (Scoped to verified session)
                        this._initAdBlockerRemover();

                        // 2. Auto Navigation
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

                                if (targetGroup && targetGroup[1]) { // Index 1
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
                    const cleanDialogs = () => {
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
                                }
                            }
                        }
                    };
                    const observer = new MutationObserver(cleanDialogs);
                    observer.observe(document.body, { childList: true, subtree: true });
                    cleanDialogs();
                }
            },

            // [NEW] Internal Transparency Handler (Receiver)
            internalTransparencyHandler: {
                app: null,
                init(app) {
                    this.app = app;
                    if (!window.location.href.includes('about_profile_transparency')) return;

                    const C = this.app.config.ADS_LIB; // Reuse timing configs
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

            postNavigatorCore: { app: null, currentPostIndex: -1, isRetrying: false, RETRY_INTERVAL: 200, MAX_RETRY_DURATION: 3000, continuousNavInterval: null, init(app) { this.app = app; }, startContinuousNavigation(direction) { this.stopContinuousNavigation(); this.navigateToPost(direction); const interval = this.app.state.settings.continuousNavInterval; this.continuousNavInterval = setInterval(() => { this.navigateToPost(direction); }, interval); }, stopContinuousNavigation() { if (this.continuousNavInterval) { clearInterval(this.continuousNavInterval); this.continuousNavInterval = null; } }, getSortedPosts() { const posts = Array.from(document.querySelectorAll('[role="article"][aria-posinset]')).filter(p => !p.closest(this.app.config.SELECTORS.GLOBAL.DIALOG)); posts.sort((a, b) => parseInt(a.getAttribute('aria-posinset'), 10) - parseInt(b.getAttribute('aria-posinset'), 10)); return posts; }, triggerLoadAndRetry() { if (this.isRetrying) return; this.isRetrying = true; const initialPostCount = this.getSortedPosts().length; window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); const startTime = Date.now(); const retryInterval = setInterval(() => { const newPostCount = this.getSortedPosts().length; if (newPostCount > initialPostCount) { clearInterval(retryInterval); this.isRetrying = false; this.navigateToPost('next'); return; } if (Date.now() - startTime > this.MAX_RETRY_DURATION) { clearInterval(retryInterval); this.isRetrying = false; console.log(`${this.app.config.LOG_PREFIX} Failed to load new posts.`); } }, this.RETRY_INTERVAL); }, navigateToPost(direction) { const posts = this.getSortedPosts(); if (posts.length === 0) return; const currentHighlighted = document.querySelector(`.${this.app.config.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}`); if (currentHighlighted) { currentHighlighted.classList.remove(this.app.config.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS); const currentIndex = posts.findIndex(p => p === currentHighlighted); if(currentIndex !== -1) this.currentPostIndex = currentIndex; } if (direction === 'next') this.currentPostIndex++; else this.currentPostIndex--; if (this.currentPostIndex >= posts.length) { if (direction === 'next') { this.currentPostIndex = posts.length - 1; this.triggerLoadAndRetry(); return; } this.currentPostIndex = posts.length - 1; } if (this.currentPostIndex < 0) this.currentPostIndex = 0; const targetPost = posts[this.currentPostIndex]; if (targetPost) { targetPost.classList.add(this.app.config.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS); const alignment = this.app.state.settings.navigationScrollAlignment; const useSmoothScroll = this.app.state.settings.enableSmoothScrolling; const scrollBehavior = useSmoothScroll ? 'smooth' : 'auto'; if (alignment === 'top') { const searchBarHeight = this.app.modules.searchBar.getOccupiedHeight(); const postTop = targetPost.getBoundingClientRect().top + window.scrollY; const targetY = postTop - searchBarHeight - 10; window.scrollTo({ top: targetY, behavior: scrollBehavior }); } else { targetPost.scrollIntoView({ behavior: scrollBehavior, block: 'center' }); } } } },
            linkInterceptor: { app: null, init(app) { this.app = app; const UNSAFE_ANCESTORS = ['[role="tablist"]', '[data-pagelet="ProfileTabs"]']; const unsafeSelector = UNSAFE_ANCESTORS.join(', '); const handleClick = (event) => { if (!this.app.state.settings.autoOpenMediaInNewTab || event.button !== 0) return; const mediaLinkAncestor = event.target.closest(this.app.config.SELECTORS.GLOBAL.MEDIA_LINK); if (!mediaLinkAncestor || mediaLinkAncestor.closest(unsafeSelector)) return; let currentElement = event.target; while (currentElement && currentElement !== mediaLinkAncestor) { const tagName = currentElement.tagName.toLowerCase(); const role = currentElement.getAttribute('role'); if ((tagName === 'a' && currentElement !== mediaLinkAncestor) || role === 'button' || role === 'slider') return; currentElement = currentElement.parentElement; } event.preventDefault(); event.stopPropagation(); window.open(mediaLinkAncestor.href, '_blank'); }; document.body.addEventListener('click', handleClick, true); } },
            scrollRestorer: { app: null, init(app) { this.app = app; let restoreY = null; let watcherInterval = null; let correctionInterval = null; const C = this.app.config; const forceScrollCorrection = () => { if (restoreY === null) return; if (correctionInterval) clearInterval(correctionInterval); const { CORRECTION_DURATION, CORRECTION_FREQUENCY } = C.SCROLL_RESTORER_CONFIG; const startTime = Date.now(); const initialRestoreY = restoreY; correctionInterval = setInterval(() => { window.scrollTo({ top: initialRestoreY, behavior: 'instant' }); if (Date.now() - startTime > CORRECTION_DURATION) { clearInterval(correctionInterval); correctionInterval = null; restoreY = null; } }, CORRECTION_FREQUENCY); }; const startWatcher = () => { if (watcherInterval) clearInterval(watcherInterval); let isContentModalDetected = false; let modalFirstSeenTime = null; watcherInterval = setInterval(() => { const modal = document.querySelector(C.SELECTORS.GLOBAL.DIALOG); const hasLoginForm = modal && modal.querySelector(C.SELECTORS.GLOBAL.LOGIN_FORM); if (!isContentModalDetected && modal && !hasLoginForm) { isContentModalDetected = true; modalFirstSeenTime = Date.now(); } else if (isContentModalDetected && !modal) { if (Date.now() - modalFirstSeenTime > C.SCROLL_RESTORER_CONFIG.MODAL_GRACE_PERIOD) { clearInterval(watcherInterval); watcherInterval = null; forceScrollCorrection(); } } }, C.SCROLL_RESTORER_CONFIG.WATCHER_FREQUENCY); }; const recordClick = e => { if (watcherInterval || correctionInterval) return; if (e.target.closest(C.SELECTORS.GLOBAL.POST_CONTAINER) && !e.target.closest('a[target="_blank"]')) { restoreY = window.scrollY; setTimeout(startWatcher, 0); } }; const handleCloseClick = e => { if (e.target.closest(C.SELECTORS.GLOBAL.CLOSE_BUTTON) && restoreY !== null && watcherInterval) { clearInterval(watcherInterval); watcherInterval = null; forceScrollCorrection(); } }; document.body.addEventListener('click', recordClick, true); document.body.addEventListener('click', handleCloseClick, true); } },
            autoUnmuter: { app: null, init(app) { this.app = app; const nativeVolumeSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume').set; const nativeMutedSetter = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted').set; const attemptUnmute = (video) => { if (!this.app.state.settings.autoUnmuteEnabled) return; if (video instanceof HTMLVideoElement && (video.muted || video.volume === 0)) { const targetVolume = this.app.state.settings.autoUnmuteVolume / 100; nativeMutedSetter.call(video, false); nativeVolumeSetter.call(video, targetVolume); if (video.audioTracks?.length > 0) { for (let track of video.audioTracks) track.enabled = true; } video.dispatchEvent(new Event('volumechange', { bubbles: true })); } }; document.addEventListener('play', (e) => attemptUnmute(e.target), true); const observer = new MutationObserver(mutations => { mutations.forEach(mutation => mutation.addedNodes.forEach(node => { if (node.nodeName === 'VIDEO') attemptUnmute(node); else if (node.querySelectorAll) node.querySelectorAll('video').forEach(attemptUnmute); })); }); observer.observe(document.body, { childList: true, subtree: true }); document.addEventListener('click', (event) => { if (event.target.closest('[aria-label*="mute" i], [aria-label*="sound" i], [role="button"][aria-pressed]')) { setTimeout(() => document.querySelectorAll('video').forEach(attemptUnmute), 150); } }, true); const checkInterval = setInterval(() => document.querySelectorAll('video').forEach(attemptUnmute), 2000); window.addEventListener('beforeunload', () => { clearInterval(checkInterval); observer.disconnect(); }); } },
            postNumbering: { app: null, init(app) { this.app = app; if (!this.app.state.settings.postNumberingEnabled) return; const processNewPosts = () => { if (!this.app.utils.isFeedPage()) return; const posts = document.querySelectorAll('[role="article"][aria-posinset]:not([data-gm-numbered])'); posts.forEach(articleElement => { if (articleElement.closest(this.app.config.SELECTORS.GLOBAL.DIALOG)) return; const postNumber = articleElement.getAttribute('aria-posinset'); if (!postNumber) return; articleElement.style.position = 'relative'; const numberTag = this.app.utils.createStyledElement('span', { position: 'absolute', top: '-10px', left: '-10px', backgroundColor: '#e4e6eb', color: '#65676b', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: '1', }, { textContent: postNumber }); articleElement.appendChild(numberTag); articleElement.dataset.gmNumbered = 'true'; }); }; const throttledProcess = this.app.utils.throttle(processNewPosts, 300); const observer = new MutationObserver(throttledProcess); observer.observe(document.body, { childList: true, subtree: true }); throttledProcess(); } },

            searchBar: {
                app: null,
                elements: {},
                state: {
                    isPinned: true,
                    isAtTop: true, 
                },

                icons: {
                    pinned: `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="#1877F2" d="M7.084 11.457C5.782 12.325 5 12.709 5 14.274V15h7v7l.5 1 .5-1v-7h7v-.726c0-1.565-.782-1.95-2.084-2.817l-1.147-.765L15 4l1.522-.43A2.029 2.029 0 0 0 18 1.619V1H7v.618A2.029 2.029 0 0 0 8.478 3.57L10 4l-1.77 6.692zM16.93 12l.73.485c1 .659 1.28.866 1.332 1.515H6.009c.051-.65.332-.856 1.333-1.515L8.07 12zM8.75 2.608A1.033 1.033 0 0 1 8.075 2h8.852a1.033 1.033 0 0 1-.676.608L14.862 3h-4.724zM11.035 4h2.931l1.85 7h-6.63z"/></svg>`,
                    unpinned: `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path d="M20 14.274V15h-7v7l-.5 1-.5-1v-6.172L13.828 14h5.163c-.051-.65-.332-.856-1.333-1.515L16.93 12h-1.1l1.16-1.161.927.618c1.302.868 2.084 1.252 2.084 2.817zm2.4-10.966L3.307 22.399l-.707-.707L9.293 15H5v-.726c0-1.565.782-1.95 2.084-2.817l1.147-.765L10 4l-1.522-.43A2.029 2.029 0 0 1 7 1.619V1h11v.618a2.029 2.029 0 0 1-1.478 1.953L15 4l1.107 4.186L21.692 2.6zM10.137 3h4.724l1.388-.392A1.033 1.033 0 0 0 16.926 2H8.074a1.033 1.033 0 0 0 .676.608zm-.954 8h4.109l1.995-1.995L13.966 4h-2.931zm1.109 3l2-2H8.07l-.73.485c-1 .659-1.28.866-1.332 1.515z"/></svg>`,
                    watch: `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64s-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64z"/></svg>`,
                    events: `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm329.7 103c-6.8-11.7-21.6-16-33.3-9.2s-16 21.6-9.2 33.3l32 55.4c6.8 11.7 21.6 16 33.3 9.2s16-21.6 9.2-33.3l-32-55.4z"/></svg>`,
                    marketplace: `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 576 512"><path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0H109.6C99.9 0 90.8 5 85.7 13.1L28.4 103.8c-7.9 12.8-1.2 29.8 15.3 35.4l2.5 1c4.2 1.7 8.8 2.6 13.5 2.6H491.3c4.7 0 9.3-1 13.5-2.6l2.5-1c16.5-5.6 23.2-22.6 15.3-35.4zM320 224v16c0 8.8-7.2 16-16 16s-16-7.2-16-16V224H160v16c0 8.8-7.2 16-16 16s-16-7.2-16-16V224H32v224c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V224H448v16c0 8.8-7.2 16-16 16s-16-7.2-16-16V224H320zM176 160H400c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16s7.2 16 16 16z"/></svg>`,
                    search: `<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,
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
                        if (node.nodeType === Node.TEXT_NODE) {
                            pageName += node.nodeValue;
                        }
                    }
                    return pageName.trim();
                },

                _createUI() {
                    const elements = {};
                    
                    const shortcutsGroup = this._createShortcutsGroup(elements);
                    const searchComponent = this._createSearchComponent(elements);
                    const toolsGroup = this._createToolsGroup(elements);

                    elements.toolbar = this.app.utils.createStyledElement('div', {}, { className: 'gm-toolbar' });
                    elements.toolbar.append(shortcutsGroup, searchComponent, toolsGroup);
                    
                    elements.hoverTrigger = this.app.utils.createStyledElement('div', { position: 'fixed', top: '0', left: '0', width: '100%', height: '10px', zIndex: '9999' });
                    elements.hoverHint = this.app.utils.createStyledElement('div', {}, { className: 'gm-hover-hint' });

                    return elements;
                },
                
                _createShortcutsGroup(elements) {
                    const T = this.app.state.T;
                    const wrapper = this.app.utils.createStyledElement('div', {}, { className: 'gm-button-group' });
                    const shortcuts = [
                        { key: 'watch', url: '/watch/', icon: this.icons.watch, tooltip: T.shortcutWatch },
                        { key: 'events', url: '/events/', icon: this.icons.events, tooltip: T.shortcutEvents },
                        { key: 'marketplace', url: '/marketplace/', icon: this.icons.marketplace, tooltip: T.shortcutMarketplace },
                    ];
                    shortcuts.forEach(sc => {
                        const button = this.app.utils.createStyledElement('button', {}, { title: sc.tooltip, innerHTML: sc.icon });
                        button.dataset.url = `https://www.facebook.com${sc.url}`;
                        elements[`shortcut_${sc.key}`] = button;
                        wrapper.appendChild(button);
                    });
                    return wrapper;
                },

                _createSearchComponent(elements) {
                    const T = this.app.state.T;
                    const coreWrapper = this.app.utils.createStyledElement('div', {}, { className: 'gm-search-core-wrapper' });
                    const componentWrapper = this.app.utils.createStyledElement('div', {}, { className: 'gm-search-component-wrapper' });
                    
                    elements.scopeSelector = this.app.utils.createStyledElement('select', { cursor: 'pointer' });
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
                        const optgroup = this.app.utils.createStyledElement('optgroup', {}, { label: groupLabel });
                        scopes[groupLabel].forEach(scope => optgroup.appendChild(this.app.utils.createStyledElement('option', {}, { value: scope.value, textContent: scope.text, title: scope.tooltip })));
                        elements.scopeSelector.appendChild(optgroup);
                    }
                    
                    const inputContainer = this.app.utils.createStyledElement('div', {}, { className: 'gm-search-input-container' });
                    elements.searchInput = this.app.utils.createStyledElement('input', {}, { type: 'text', placeholder: T.searchPlaceholder });
                    elements.clearButton = this.app.utils.createStyledElement('button', {}, { className: 'gm-search-clear-button', textContent: '✖' });
                    elements.searchButton = this.app.utils.createStyledElement('button', {}, { className: 'gm-search-button-integrated', innerHTML: this.icons.search, title: T.searchButton });
                    
                    inputContainer.append(elements.searchInput, elements.clearButton, elements.searchButton);
                    componentWrapper.append(elements.scopeSelector, inputContainer);
                    coreWrapper.append(componentWrapper);
                    elements.searchComponentWrapper = componentWrapper;
                    
                    return coreWrapper;
                },

                _createToolsGroup(elements) {
                    const wrapper = this.app.utils.createStyledElement('div', {}, { className: 'gm-button-group' });
                    elements.pinButton = this.app.utils.createStyledElement('button', {}, { innerHTML: this.icons.unpinned + this.icons.pinned });
                    elements.settingsButton = this.app.utils.createStyledElement('button', {}, { textContent: '⚙️', title: 'Script Settings' });
                    wrapper.append(elements.pinButton, elements.settingsButton);
                    return wrapper;
                },

                _bindEvents() {
                    const { searchInput, clearButton, searchButton, pinButton, settingsButton, toolbar, scopeSelector, searchComponentWrapper, hoverTrigger } = this.elements;

                    const handleShortcutMouseDown = (e) => {
                        if (e.button === 0 || e.button === 1) { 
                            e.preventDefault();
                            const url = e.currentTarget.dataset.url;
                            window.open(url, e.button === 1 ? '_blank' : '_self');
                        }
                    };
                    Object.keys(this.elements).filter(k => k.startsWith('shortcut_')).forEach(key => this.elements[key].addEventListener('mousedown', handleShortcutMouseDown));

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
                    clearButton.addEventListener('mousedown', (e) => e.preventDefault());
                    
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
                        searchButton.title = !keyword && isContextual
                            ? T.searchAllContextualTooltip.replace('{scope}', selectedOption.textContent)
                            : T.searchButton;
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
                            case 'background':
                                GM_openInTab(url, { active: false, insert: true });
                                break;
                            case '_self':
                                window.open(url, '_self');
                                break;
                            case '_blank':
                            default:
                                window.open(url, '_blank');
                                break;
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
                            this.app.modules.toastNotifier.show('Cannot get current page name for Reel search.', 'failure');
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
                    if (this.elements.toolbar.style.visibility !== newVisibility) {
                         elementsToToggle.forEach(el => el.style.visibility = newVisibility);
                    }

                    const isGroupPage = currentPath.startsWith('/groups/');
                    for (const option of this.elements.scopeSelector.options) {
                        if (option.parentElement.tagName !== 'OPTGROUP') continue;
                        const isContextualGroup = option.parentElement.label === this.app.state.T.searchGroupContextual;
                        option.disabled = isGroupPage && isContextualGroup && option.value !== '';
                    }
                    if (isGroupPage && this.elements.scopeSelector.options[this.elements.scopeSelector.selectedIndex].disabled) {
                        this.elements.scopeSelector.value = '';
                    }

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

            keyboardNavigator: { app: null, activeKey: null, init(app) { this.app = app; if (!this.app.state.settings.keyboardNavEnabled) return; document.addEventListener('keydown', this.handleKeyDown.bind(this)); document.addEventListener('keyup', this.handleKeyUp.bind(this)); }, handleKeyDown(event) { if (event.key === this.activeKey) return; if (!this.app.utils.isFeedPage()) return; const target = event.target; if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return; const settings = this.app.state.settings; let direction = null; switch (event.key) { case settings.keyNavNextPrimary: case settings.keyNavNextSecondary: direction = 'next'; break; case settings.keyNavPrevPrimary: case settings.keyNavPrevSecondary: direction = 'prev'; break; } if (direction) { event.preventDefault(); this.activeKey = event.key; this.app.modules.postNavigatorCore.startContinuousNavigation(direction); } }, handleKeyUp(event) { if (event.key === this.activeKey) { this.activeKey = null; this.app.modules.postNavigatorCore.stopContinuousNavigation(); } } },
            floatingNavigator: { app: null, container: null, isInitialized: false, init(app) { if (this.isInitialized) return; this.app = app; if (!this.app.state.settings.floatingNavEnabled) return; const T = this.app.state.T; const U = this.app.utils; const Core = this.app.modules.postNavigatorCore; this.container = U.createStyledElement('div', {}, { className: 'gm-floating-nav' }); const prevButton = U.createStyledElement('button', {}, { title: T.floatingNavPrevTooltip }); prevButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>`; prevButton.addEventListener('mousedown', () => Core.startContinuousNavigation('prev')); prevButton.addEventListener('mouseleave', () => Core.stopContinuousNavigation()); const nextButton = U.createStyledElement('button', {}, { title: T.floatingNavNextTooltip }); nextButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path></svg>`; nextButton.addEventListener('mousedown', () => Core.startContinuousNavigation('next')); nextButton.addEventListener('mouseleave', () => Core.stopContinuousNavigation()); document.body.addEventListener('mouseup', () => Core.stopContinuousNavigation()); this.container.append(prevButton, nextButton); document.body.appendChild(this.container); this.updateVisibility(); window.addEventListener('historyChange', this.updateVisibility.bind(this)); new MutationObserver(U.throttle(this.updateVisibility.bind(this), 200)).observe(document.body, { childList: true, subtree: true }); this.isInitialized = true; }, deinit() { if (this.container) { this.container.remove(); this.container = null; } this.isInitialized = false; }, updateVisibility() { if (!this.container) return; const isVisible = this.app.utils.isFeedPage() && !document.querySelector(this.app.config.SELECTORS.GLOBAL.DIALOG); this.container.style.display = isVisible ? 'flex' : 'none'; } },
            wheelNavigator: { app: null, isCoolingDown: false, init(app) { this.app = app; if (!this.app.state.settings.wheelNavEnabled) return; document.addEventListener('wheel', this.handleWheel.bind(this), { passive: false }); }, handleWheel(event) { if (this.isCoolingDown) return; if (!this.app.utils.isFeedPage() || document.querySelector(this.app.config.SELECTORS.GLOBAL.DIALOG)) return; const modifierKey = this.app.state.settings.wheelNavModifier; if (modifierKey !== 'none' && !event[modifierKey]) return; event.preventDefault(); event.stopPropagation(); const direction = event.deltaY > 0 ? 'next' : 'prev'; this.app.modules.postNavigatorCore.navigateToPost(direction); this.isCoolingDown = true; setTimeout(() => { this.isCoolingDown = false; }, this.app.state.settings.continuousNavInterval); } },
            clickToFocusNavigator: { app: null, init(app) { this.app = app; const settings = this.app.state.settings; if (!settings.keyboardNavEnabled && !settings.floatingNavEnabled && !settings.wheelNavEnabled) return; document.body.addEventListener('click', this.handleClick.bind(this)); }, handleClick(event) { const target = event.target; if (target.closest('a, button, [role="button"], input, textarea') || window.getSelection().toString().length > 0) return; const post = target.closest('[role="article"][aria-posinset]'); if (!post) return; if (post.closest(this.app.config.SELECTORS.GLOBAL.DIALOG)) return; const Core = this.app.modules.postNavigatorCore; const C = this.app.config; const currentHighlighted = document.querySelector(`.${C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS}`); if (currentHighlighted && currentHighlighted !== post) { currentHighlighted.classList.remove(C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS); } post.classList.add(C.SELECTORS.NAVIGATOR.HIGHLIGHT_CLASS); const posts = Core.getSortedPosts(); const newIndex = posts.findIndex(p => p === post); if (newIndex !== -1) Core.currentPostIndex = newIndex; } },

            permalinkCopier: {
                app: null,
                isProcessingClick: false,
                isModalOpening: false,
                observer: null,

                init(app) {
                    if (!this.app) this.app = app;
                    if (this.observer) return; 
                    console.log(`${this.app.config.LOG_PREFIX} [Copier] Module enabled and initializing.`);
                    this.startObserver();
                },

                deinit() {
                    if (this.observer) {
                        this.observer.disconnect();
                        this.observer = null;
                        console.log(`${this.app.config.LOG_PREFIX} [Copier] Module observer stopped.`);
                    }
                    this.cleanupButtons();
                    console.log(`${this.app.config.LOG_PREFIX} [Copier] Module disabled and cleaned up.`);
                },

                async handleCopyClick(event) {
                    const C = this.app.config.SELECTORS.PERMALINK_COPIER;
                    const button = event.target.closest(`.${C.BUTTON_CLASS}`);
                    if (!button || this.isProcessingClick) return;

                    event.preventDefault();
                    event.stopPropagation();
                    const postEl = button.closest(`[data-${C.PROCESSED_MARKER}]`);
                    if (!postEl) return;

                    console.log(`${this.app.config.LOG_PREFIX} [Copier] Initiating permalink fetch...`);
                    this.isProcessingClick = true;
                    button.style.pointerEvents = 'none';
                    const originalContent = button.innerHTML;
                    const T = this.app.state.T;
                    const settings = this.app.state.settings;

                    button.querySelector('span').textContent = '⏳';
                    if (settings.copier_showButtonText) {
                        button.querySelector('span:last-child').textContent = T.copier_processing;
                    }

                    try {
                        const contentType = this.determinePostContentType(postEl);
                        const useSmartFetch = settings.copier_useSmartLink && contentType === 'standard';
                        const fetcher = useSmartFetch ? this.fetchPermalinkInBackground(postEl) : Promise.resolve(this.getPermalinkDirectlyFromElement(postEl));

                        const result = await fetcher || { url: null, method: 'unknown_failure' };
                        const { url: dataToCopy, method } = result;

                        if (dataToCopy) {
                            GM_setClipboard(dataToCopy);
                            const linkHTML = `<a href="${dataToCopy}" target="_blank" rel="noopener noreferrer">${dataToCopy}</a>`;
                            const successMessage = T.copier_notificationPermalinkCopied
                                .replace('{url}', linkHTML)
                                .replace(/\n/g, '<br>'); 

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
                        console.error(`${this.app.config.LOG_PREFIX} [Copier] Error during copy action:`, error);
                        this.app.modules.toastNotifier.show(T.copier_notificationErrorGeneric, 'failure');
                        await this.animateButtonFeedback(button, 'failure', originalContent);
                    } finally {
                        this.isProcessingClick = false;
                    }
                },

                fetchPermalinkInBackground(postEl) {
                    return new Promise((resolve) => {
                        const sourceUrl = this.getSourceUrlForWorker(postEl);
                        if (!sourceUrl) {
                            return resolve({ url: null, method: 'worker_no_source_url' });
                        }

                        const taskId = `fpc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                        const workerUrl = new URL(sourceUrl);
                        workerUrl.searchParams.set(this.app.config.WORKER_PARAM, taskId);
                        console.log(`${this.app.config.LOG_PREFIX} [Copier] Opening background worker: ${workerUrl.href}`);

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
                    } catch (e) {
                        return { url: null, method: 'direct_parse_error' };
                    }
                },

                async animateButtonFeedback(button, status, originalContent) {
                    const T = this.app.state.T;
                    const settings = this.app.state.settings;

                    const iconText = status === 'success' ? '✅' : '❌';
                    button.querySelector('span').textContent = iconText;
                    if (settings.copier_showButtonText) {
                        const labelText = status === 'success' ? T.copier_successPermalink : T.copier_failure;
                        button.querySelector('span:last-child').textContent = labelText;
                    }
                    button.style.backgroundColor = status === 'success' ? 'var(--positive-background)' : 'var(--negative-background)';

                    await this.app.utils.delay(1200);
                    button.style.pointerEvents = 'auto';
                    button.style.backgroundColor = 'transparent';
                    button.innerHTML = originalContent;
                },

                addButtonsToPost(postEl, headerEl, isDialog = false) {
                    const C = this.app.config.SELECTORS.PERMALINK_COPIER;
                    if (!headerEl?.parentElement || headerEl.parentElement.querySelector(`.${C.BUTTON_CLASS}`)) return;

                    postEl.setAttribute(`data-${C.PROCESSED_MARKER}`, 'true');
                    if (!postEl.dataset.fpcListenerAdded) {
                        postEl.addEventListener('click', this.handleCopyClick.bind(this), { capture: true });
                        postEl.dataset.fpcListenerAdded = 'true';
                    }

                    const contentType = this.determinePostContentType(postEl);
                    const isSmart = this.app.state.settings.copier_useSmartLink && contentType === 'standard';
                    const newButton = this.createPermalinkButton(isSmart, isDialog);

                    const insertionPoint = headerEl.parentElement;
                    Object.assign(insertionPoint.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' });
                    insertionPoint.append(newButton);
                },

                createPermalinkButton(isSmart, isDialog) {
                    const T = this.app.state.T;
                    const settings = this.app.state.settings;
                    const C = this.app.config.SELECTORS.PERMALINK_COPIER;

                    const icon = isSmart ? '✨' : '🔗';
                    const title = isSmart ? T.copier_fetchPermalinkSmart : T.copier_fetchPermalinkDirect;

                    const button = this.app.utils.createStyledElement('div', {
                        cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--secondary-text)',
                        lineHeight: '1', marginLeft: '8px', border: '1px solid var(--media-inner-border)',
                        transition: 'all 0.15s ease-out', userSelect: 'none',
                        ...(isDialog && { marginRight: '16px' }),
                        ...(settings.copier_showButtonText
                            ? { padding: '4px 8px', borderRadius: '6px' }
                            : { width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', fontSize: '16px' }
                        )
                    }, {
                        className: C.BUTTON_CLASS,
                        role: 'button',
                        tabIndex: 0,
                        title,
                        innerHTML: settings.copier_showButtonText
                            ? `<span>${icon}</span><span style="margin-left: 5px;">${title}</span>`
                            : `<span>${icon}</span>`,
                    });

                    button.addEventListener('mouseover', () => { if (button.style.pointerEvents !== 'none') button.style.backgroundColor = 'var(--hover-overlay)'; });
                    button.addEventListener('mouseout', () => { if (button.style.pointerEvents !== 'none') button.style.backgroundColor = 'transparent'; });
                    return button;
                },

                scanNodeForPosts(node) {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;

                    const C_GLOBAL = this.app.config.SELECTORS.GLOBAL;
                    const C_COPIER = this.app.config.SELECTORS.PERMALINK_COPIER;
                    const SCAN_TARGETS = `${C_GLOBAL.POST_CONTAINER}, ${C_GLOBAL.DIALOG}`;

                    const targets = node.matches(SCAN_TARGETS) ? [node] : [];
                    targets.push(...node.querySelectorAll(SCAN_TARGETS));

                    new Set(targets).forEach(target => {
                        if (target.hasAttribute(`data-${C_COPIER.PROCESSED_MARKER}`)) return;

                        if (target.matches(C_GLOBAL.POST_CONTAINER) && !target.parentElement.closest(C_GLOBAL.POST_CONTAINER)) {
                            const headerEl = target.querySelector(C_COPIER.FEED_POST_HEADER);
                            if (headerEl) this.addButtonsToPost(target, headerEl, false);
                        } else if (target.matches(C_GLOBAL.DIALOG)) {
                            this.processDialogPost(target);
                        }
                    });
                },

                processDialogPost(dialogEl) { this.isModalOpening = true; let observer; const C_GLOBAL = this.app.config.SELECTORS.GLOBAL; const C_COPIER = this.app.config.SELECTORS.PERMALINK_COPIER; const cleanup = () => { if (observer) observer.disconnect(); clearTimeout(timeoutId); setTimeout(() => { this.isModalOpening = false; }, 200); }; const timeoutId = setTimeout(() => { console.warn(`${this.app.config.LOG_PREFIX} [Copier] Dialog observer timed out waiting for post header.`); cleanup(); }, 3000); const findAndProcessHeader = () => { const postEl = dialogEl.querySelector(C_GLOBAL.POST_CONTAINER); if (postEl) { const headerEl = postEl.querySelector(C_COPIER.DIALOG_POST_HEADER); if (headerEl) { this.addButtonsToPost(postEl, headerEl, true); cleanup(); return true; } } return false; }; if (findAndProcessHeader()) return; observer = new MutationObserver(() => findAndProcessHeader()); observer.observe(dialogEl, { childList: true, subtree: true }); },
                reEvaluateAllButtons() { if (!this.app.state.settings.permalinkCopierEnabled) return; this.cleanupButtons(); this.scanNodeForPosts(document.body); },
                cleanupButtons() { const C = this.app.config.SELECTORS.PERMALINK_COPIER; document.querySelectorAll(`[data-${C.PROCESSED_MARKER}]`).forEach(el => { el.removeAttribute(`data-${C.PROCESSED_MARKER}`); el.removeAttribute('data-fpc-listener-added'); el.querySelectorAll(`.${C.BUTTON_CLASS}`).forEach(btn => btn.remove()); }); },
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
                    } catch (e) {
                        return 'standard';
                    }
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
                getPermalinkFromTimestamp(postEl) { try { const timeLink = this.findTimestampLink(postEl); if (!timeLink?.href) return null; const rawUrl = new URL(timeLink.href, window.location.origin); const searchParams = rawUrl.searchParams; const basePath = `${rawUrl.protocol}//${rawUrl.host}${rawUrl.pathname}`; if (rawUrl.pathname.includes('/watch/')) { const videoId = searchParams.get('v'); if (videoId) return `${basePath}?v=${videoId}`; } else if (rawUrl.pathname.includes('permalink.php') || rawUrl.search.includes('story_fbid=')) { const storyFbid = searchParams.get('story_fbid'); const id = searchParams.get('id'); if (storyFbid && id) return `${basePath}?story_fbid=${storyFbid}&id=${id}`; } else if (rawUrl.pathname.includes('photo.php') || searchParams.has('fbid')) { const fbid = searchParams.get('fbid'); const setId = searchParams.get('set'); if (fbid && setId) return `${basePath}?fbid=${fbid}&set=${setId}`; if (fbid) return `${basePath}?fbid=${fbid}`; } else if (rawUrl.search.includes('multi_permalinks=')) { const permalinkId = searchParams.get('multi_permalinks'); return basePath.replace(/\/$/, '') + `/posts/${permalinkId}/`; } return basePath; } catch (e) { return null; } },
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
                startObserver() { this.observer = new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(n => this.scanNodeForPosts(n))) ); this.scanNodeForPosts(document.body); this.observer.observe(document.body, { childList: true, subtree: true }); }
            },
        },

        /**
         * Main function for the background worker tab.
         * This runs in a separate, temporary tab to fetch canonical permalinks.
         */
        async handleWorkerTask() {
            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get(this.config.WORKER_PARAM);
            if (!taskId) return;

            console.log(`${this.config.LOG_PREFIX} [Worker] Task ${taskId} started.`);
            document.body.style.display = 'none';

            const settings = {};
            this.modules.settingsManager.definitions
                .filter(def => def.group === 'permalink')
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
                console.error(`${this.config.LOG_PREFIX} [Worker] Task ${taskId} failed:`, error);
                GM_setValue(taskId, { permalink: fallbackUrl, method: 'error_fallback' });
            } finally {
                const closeTimeout = setTimeout(() => { if (listenerId) GM_removeValueChangeListener(listenerId); window.close(); }, 5000);
                listenerId = GM_addValueChangeListener(taskId, (name, oldVal, newVal, remote) => {
                    if (remote && newVal.resolved) { clearTimeout(closeTimeout); GM_removeValueChangeListener(listenerId); window.close(); }
                });
            }
        },

        /**
         * Main application entry point.
         */
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
                            if (moduleName === 'permalinkCopier' && !this.state.settings.permalinkCopierEnabled) {
                                console.log(`${this.config.LOG_PREFIX} [Copier] Module is disabled, skipping initialization.`);
                                continue;
                            }
                             if (moduleName === 'floatingNavigator' && !this.state.settings.floatingNavEnabled) {
                                continue;
                            }
                            if (moduleName === 'errorRecovery' && !this.state.settings.errorRecoveryEnabled) {
                                continue;
                            }
                             if (moduleName === 'transparencyActions' && !this.state.settings.transparencyButtonsEnabled) {
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