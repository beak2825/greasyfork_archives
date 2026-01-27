// ==UserScript==
// @name         TokyoMotion Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  TokyoMotionをより便利にするスクリプト - 高評価保存、視聴履歴、プレイリスト、購読・友達動画の簡易閲覧、簡易自動ログイン (English/日本語対応)
// @author       meranoa
// @license MIT
// @match        https://www.tokyomotion.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokyomotion.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564032/TokyoMotion%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/564032/TokyoMotion%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[TM Enhancer] Userscript started (Version 1.0)');

    // ========================================
    // 言語・翻訳管理 (Localization)
    // ========================================
    const TranslationManager = {
        getLanguage() {
            const config = GM_getValue('appLanguage', 'auto');
            if (config === 'auto') {
                const navLang = (navigator.language || navigator.userLanguage || 'ja').toLowerCase();
                return navLang.startsWith('ja') ? 'ja' : 'en';
            }
            return config;
        },
        setLanguage(lang) {
            GM_setValue('appLanguage', lang);
        },
        getText(key, replacements = {}) {
            const lang = this.getLanguage();
            let text = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['en'][key] || key;
            Object.keys(replacements).forEach(k => {
                text = text.replace(`{${k}}`, replacements[k]);
            });
            return text;
        }
    };

    const t = (key, repl) => TranslationManager.getText(key, repl);

    const TRANSLATIONS = {
        ja: {
            'tab_liked': '❤️ 高評価',
            'tab_history': '📺 履歴',
            'tab_playlists': '📁 リスト',
            'tab_feed': '📡 購読',
            'tab_friends': '🤝 友達',
            'tab_settings': '⚙️ 設定',
            'btn_close': '閉じる',
            'btn_update': '更新',
            'btn_create': '作成',
            'btn_delete': '削除',
            'btn_remove': '削除',
            'btn_export': '📥 エクスポート',
            'btn_import': '📤 インポート',
            'btn_clear_all': '🗑️ データ全削除',
            'btn_back': '← 戻る',
            'btn_rename': '名前を変更',
            'btn_sort_new': '▼ 新しい順',
            'btn_sort_old': '▲ 古い順',
            'label_private': 'PRIVATE',
            'msg_empty_liked': 'まだ高評価した動画がありません',
            'msg_empty_history': 'まだ視聴履歴がありません',
            'msg_empty_playlist': 'プレイリストがありません',
            'msg_empty_videos': '動画がありません',
            'msg_empty_feed': 'なし',
            'msg_saved_liked': '高評価に保存しました',
            'msg_added_to': '「{name}」に追加',
            'msg_removed_from': '「{name}」から削除',
            'msg_created_added': '「{name}」を作成して追加',
            'msg_fetching': '取得中...',
            'msg_fetching_users': '{count}人の動画を取得中...',
            'msg_fetching_progress': '取得中... ({current}/{total}人)',
            'msg_complete': '完了 ({count}件)',
            'msg_error': 'エラー: {msg}',
            'msg_no_users': 'ユーザーなし',
            'msg_auto_login': '自動ログイン中...',
            'msg_import_done': 'インポート完了。ページをリロードします。',
            'msg_import_error': '読み込みエラー: {msg}',
            'msg_data_cleared': '全データを削除しました。',
            'msg_scroll_reset': '長時間経過のためスクロールをリセットしました',
            'confirm_delete_liked': '高評価した動画消しますか？',
            'confirm_delete_playlist': 'プレイリスト「{name}」を削除しますか？',
            'confirm_settings_hidden': '設定タブを非表示にすると、後から再表示するのが難しくなります。本当によろしいですか？',
            'confirm_overwrite': '現在のデータを上書きします。よろしいですか？',
            'confirm_clear_all': '全てのデータ（高評価、履歴、プレイリスト）を削除しますか？\nこの操作は取り消せません。',
            'prompt_playlist_name': '新しいプレイリスト名を入力してください',
            'alert_exists': '既に存在します',
            'alert_name_used': 'その名前は既に使用されています。',
            'stg_language': '言語 / Language',
            'stg_startup_tab': '起動時に表示するタブ',
            'stg_tab_last_open': '🔄 最後に開いた項目',
            'stg_auto_login': '🔐 自動ログイン',
            'stg_auto_login_desc': 'ログインページを開いた際に自動でログインボタンを押します。',
            'stg_tab_visibility': '📑 タブ表示設定',
            'stg_grid_cols': '動画一覧の列数',
            'stg_feed_pages': '購読フィード取得ページ数',
            'stg_friend_pages': '友達フィード取得ページ数',
            'stg_page_unit': 'ページ',
            'stg_unlimited': '無制限 (全て取得)',
            'stg_col_unit': '列',
            'stg_scroll_reset': '非アクティブ時のスクロールリセット時間',
            'unit_sec': '秒',
            'unit_min': '分',
            'unit_hour': '時間',
            'time_just_now': 'たった今',
            'time_min_ago': '分前',
            'time_hour_ago': '時間前',
            'time_day_ago': '日前',
            'time_long_ago': 'かなり前',
            'time_videos_count': '{count} 動画',
            'modal_title': 'Myリスト',
            'placeholder_new_playlist': '新規リスト名',
        },
        en: {
            'tab_liked': '❤️ Liked',
            'tab_history': '📺 History',
            'tab_playlists': '📁 Playlists',
            'tab_feed': '📡 Feed',
            'tab_friends': '🤝 Friends',
            'tab_settings': '⚙️ Settings',
            'btn_close': 'Close',
            'btn_update': 'Update',
            'btn_create': 'Create',
            'btn_delete': 'Delete',
            'btn_remove': 'Remove',
            'btn_export': '📥 Export',
            'btn_import': '📤 Import',
            'btn_clear_all': '🗑️ Clear All Data',
            'btn_back': '← Back',
            'btn_rename': 'Rename',
            'btn_sort_new': '▼ Newest',
            'btn_sort_old': '▲ Oldest',
            'label_private': 'PRIVATE',
            'msg_empty_liked': 'No liked videos yet.',
            'msg_empty_history': 'No watch history yet.',
            'msg_empty_playlist': 'No playlists created.',
            'msg_empty_videos': 'No videos found.',
            'msg_empty_feed': 'Empty',
            'msg_saved_liked': 'Saved to Liked Videos',
            'msg_added_to': 'Added to "{name}"',
            'msg_removed_from': 'Removed from "{name}"',
            'msg_created_added': 'Created "{name}" and added video',
            'msg_fetching': 'Fetching...',
            'msg_fetching_users': 'Fetching videos from {count} users...',
            'msg_fetching_progress': 'Fetching... ({current}/{total} users)',
            'msg_complete': 'Done ({count} videos)',
            'msg_error': 'Error: {msg}',
            'msg_no_users': 'No users found',
            'msg_auto_login': 'Auto logging in...',
            'msg_import_done': 'Import complete. Reloading page.',
            'msg_import_error': 'Import Error: {msg}',
            'msg_data_cleared': 'All data cleared.',
            'msg_scroll_reset': 'Inactive for too long. Scroll reset.',
            'confirm_delete_liked': 'Remove this video from Liked?',
            'confirm_delete_playlist': 'Delete playlist "{name}"?',
            'confirm_settings_hidden': 'If you hide the Settings tab, it will be difficult to show it again. Are you sure?',
            'confirm_overwrite': 'This will overwrite current data. Are you sure?',
            'confirm_clear_all': 'Delete ALL data (Liked, History, Playlists)?\nThis cannot be undone.',
            'prompt_playlist_name': 'Enter new playlist name',
            'alert_exists': 'Already exists',
            'alert_name_used': 'That name is already taken.',
            'stg_language': 'Language / 言語',
            'stg_startup_tab': 'Startup Tab',
            'stg_tab_last_open': '🔄 Last Opened',
            'stg_auto_login': '🔐 Auto Login',
            'stg_auto_login_desc': 'Automatically clicks the login button when opening the login modal.',
            'stg_tab_visibility': '📑 Tab Visibility',
            'stg_grid_cols': 'Video Grid Columns',
            'stg_feed_pages': 'Feed Fetch Pages',
            'stg_friend_pages': 'Friends Fetch Pages',
            'stg_page_unit': ' pages',
            'stg_unlimited': 'Unlimited',
            'stg_col_unit': ' cols',
            'stg_scroll_reset': 'Scroll Reset Time (Inactive)',
            'unit_sec': 'Seconds',
            'unit_min': 'Minutes',
            'unit_hour': 'Hours',
            'time_just_now': 'Just now',
            'time_min_ago': 'm ago',
            'time_hour_ago': 'h ago',
            'time_day_ago': 'd ago',
            'time_long_ago': 'Long ago',
            'time_videos_count': '{count} videos',
            'modal_title': 'My Playlists',
            'placeholder_new_playlist': 'New Playlist Name',
        }
    };

    // ========================================
    // 定数・初期設定
    // ========================================
    const DEFAULT_TAB_ORDER = ['liked', 'history', 'playlists', 'feed', 'friends', 'settings'];
    const SCROLLBAR_MARGIN = 25;

    // ========================================
    // ストレージマネージャー
    // ========================================
    const StorageManager = {
        async getLikedVideos() { return GM_getValue('likedVideos', []); },
        async addLikedVideo(videoData) {
            const videos = await this.getLikedVideos();
            if (!videos.some(v => v.id === videoData.id)) {
                videos.unshift(videoData);
                GM_setValue('likedVideos', videos);
            }
        },
        async removeLikedVideo(videoId) {
            let videos = await this.getLikedVideos();
            videos = videos.filter(v => v.id !== videoId);
            GM_setValue('likedVideos', videos);
        },
        async getHistory() { return GM_getValue('history', []); },
        async addToHistory(videoData) {
            let history = await this.getHistory();
            history.unshift({ ...videoData, watchedAt: Date.now() });
            GM_setValue('history', history);
        },
        async clearHistory() { GM_setValue('history', []); },
        async getPlaylists() { return GM_getValue('playlists', {}); },
        async createPlaylist(name) {
            const playlists = await this.getPlaylists();
            if (playlists[name]) return false;
            playlists[name] = [];
            GM_setValue('playlists', playlists);
            return true;
        },
        async deletePlaylist(name) {
            const playlists = await this.getPlaylists();
            delete playlists[name];
            GM_setValue('playlists', playlists);
            if (this.getActivePlaylist() === name) {
                this.setActivePlaylist(null);
            }
        },
        async renamePlaylist(oldName, newName) {
            if (oldName === newName) return true;
            const playlists = await this.getPlaylists();
            if (playlists[newName]) return false;
            playlists[newName] = playlists[oldName];
            delete playlists[oldName];
            GM_setValue('playlists', playlists);
            const order = this.getPlaylistOrder();
            const idx = order.indexOf(oldName);
            if (idx !== -1) {
                order[idx] = newName;
                GM_setValue('playlistOrder', order);
            }
            if (this.getActivePlaylist() === oldName) {
                this.setActivePlaylist(newName);
            }
            return true;
        },
        async addToPlaylist(name, videoData) {
            const playlists = await this.getPlaylists();
            if (!playlists[name]) return;
            if (!playlists[name].some(v => v.id === videoData.id)) {
                playlists[name].unshift(videoData);
                GM_setValue('playlists', playlists);
            }
        },
        async removeFromPlaylist(name, videoId) {
            const playlists = await this.getPlaylists();
            if (!playlists[name]) return;
            playlists[name] = playlists[name].filter(v => v.id !== videoId);
            GM_setValue('playlists', playlists);
        },
        getPrivateCache() { return GM_getValue('privateVideoCache', {}); },
        addPrivateToCache(ids) {
            const cache = this.getPrivateCache();
            let changed = false;
            ids.forEach(id => {
                if (!cache[id]) { cache[id] = 1; changed = true; }
            });
            if (changed) GM_setValue('privateVideoCache', cache);
        },
        isPrivateCached(id) {
            const cache = this.getPrivateCache();
            return !!cache[id];
        },
        getDefaultTab() { return GM_getValue('defaultTab', 'liked'); },
        setDefaultTab(tab) { GM_setValue('defaultTab', tab); },
        getLastActiveTab() { return GM_getValue('lastActiveTab', 'liked'); },
        setLastActiveTab(tab) { GM_setValue('lastActiveTab', tab); },
        isAutoLoginEnabled() { return GM_getValue('autoLoginEnabled', false); },
        setAutoLoginEnabled(enabled) { GM_setValue('autoLoginEnabled', enabled); },
        getPlaylistOrder() { return GM_getValue('playlistOrder', []); },
        setPlaylistOrder(order) { GM_setValue('playlistOrder', order); },
        async getOrderedPlaylistNames() {
            const playlists = await this.getPlaylists();
            const savedOrder = this.getPlaylistOrder();
            const allNames = Object.keys(playlists);
            const ordered = savedOrder.filter(name => allNames.includes(name));
            const remaining = allNames.filter(name => !ordered.includes(name));
            return [...ordered, ...remaining];
        },
        getFeedData() { return GM_getValue('feedData', []); },
        setFeedData(data) { GM_setValue('feedData', data); },
        getFeedLastUpdated() { return GM_getValue('feedLastUpdated', 0); },
        setFeedLastUpdated(time) { GM_setValue('feedLastUpdated', time); },
        getFriendsFeedData() { return GM_getValue('friendsFeedData', []); },
        setFriendsFeedData(data) { GM_setValue('friendsFeedData', data); },
        getFriendsLastUpdated() { return GM_getValue('friendsLastUpdated', 0); },
        setFriendsLastUpdated(time) { GM_setValue('friendsLastUpdated', time); },
        getFeedMaxPages() { return GM_getValue('feedMaxPages', 1); },
        setFeedMaxPages(pages) { GM_setValue('feedMaxPages', pages); },
        getFriendsMaxPages() { return GM_getValue('friendsMaxPages', 1); },
        setFriendsMaxPages(pages) { GM_setValue('friendsMaxPages', pages); },
        getModalCols() { return GM_getValue('modalCols', 3); },
        setModalCols(cols) { GM_setValue('modalCols', cols); },
        getPlaylistGridCols() { return GM_getValue('playlistGridCols', 2); },
        setPlaylistGridCols(cols) { GM_setValue('playlistGridCols', cols); },
        getVideoGridCols() { return GM_getValue('videoGridCols', 2); },
        setVideoGridCols(cols) { GM_setValue('videoGridCols', cols); },
        getTabOrder() { return GM_getValue('tabOrder', DEFAULT_TAB_ORDER); },
        setTabOrder(order) { GM_setValue('tabOrder', order); },
        getTabVisibility() {
            const defaults = {};
            DEFAULT_TAB_ORDER.forEach(k => defaults[k] = true);
            return GM_getValue('tabVisibility', defaults);
        },
        setTabVisibility(vis) { GM_setValue('tabVisibility', vis); },
        getPanelState() { return GM_getValue('panelState', null); },
        setPanelState(state) { GM_setValue('panelState', state); },
        getBtnPosition() { return GM_getValue('btnPosition', null); },
        setBtnPosition(pos) { GM_setValue('btnPosition', pos); },
        getTabScroll(tab) {
            const scrolls = GM_getValue('tabScrolls', {});
            return scrolls[tab] || 0;
        },
        setTabScroll(tab, val) {
            const scrolls = GM_getValue('tabScrolls', {});
            scrolls[tab] = val;
            GM_setValue('tabScrolls', scrolls);
        },
        getActivePlaylist() { return GM_getValue('activePlaylist', null); },
        setActivePlaylist(name) { GM_setValue('activePlaylist', name); },

        // スクロールリセット設定用
        getScrollResetValue() { return GM_getValue('scrollResetValue', 5); }, // デフォルト5
        setScrollResetValue(val) { GM_setValue('scrollResetValue', val); },
        getScrollResetUnit() { return GM_getValue('scrollResetUnit', 'minutes'); }, // デフォルトminutes
        setScrollResetUnit(unit) { GM_setValue('scrollResetUnit', unit); },
        getLastClosedTime() { return GM_getValue('lastClosedTime', 0); },
        setLastClosedTime(time) { GM_setValue('lastClosedTime', time); },
    };

    // リセット時間を計算するヘルパー
    function getScrollResetMs() {
        const val = StorageManager.getScrollResetValue();
        const unit = StorageManager.getScrollResetUnit();
        let multiplier = 1000; // seconds
        if (unit === 'minutes') multiplier = 60 * 1000;
        if (unit === 'hours') multiplier = 60 * 60 * 1000;
        console.log(`[TokyoMotion Enhancer] Reset time: ${val} ${unit} = ${val * multiplier}ms`); // Debug log
        return val * multiplier;
    }

    // ========================================
    // Privateスキャナー
    // ========================================
    const PrivateScanner = {
        scan() {
            const privateIds = [];
            const cards = document.querySelectorAll('.col-sm-4, .video-card, .thumb-block');
            cards.forEach(card => {
                const isPrivate = card.querySelector('.label-private') ||
                    card.querySelector('.img-private') ||
                    (card.textContent && card.textContent.includes('PRIVATE'));
                if (isPrivate) {
                    const link = card.querySelector('a[href*="/video/"]');
                    if (link) {
                        const match = link.getAttribute('href').match(/\/video\/(\d+)/);
                        if (match && match[1]) privateIds.push(match[1]);
                    }
                }
            });
            if (privateIds.length > 0) StorageManager.addPrivateToCache(privateIds);
        },
        startObserver() {
            this.scan();
            new MutationObserver(() => this.scan()).observe(document.body, { childList: true, subtree: true });
        }
    };

    // ========================================
    // 購読（フォロー）マネージャー
    // ========================================
    const SubscriptionManager = {
        async getMyProfileUrl() {
            const profileLink = document.querySelector('a[href^="/user/"]:not([href*="logout"]):not([href*="login"])');
            if (profileLink) return profileLink.href;
            const userLink = document.querySelector('.username a');
            if (userLink) return userLink.href;
            const avatarLink = document.querySelector('.avatar-container a, .header-avatar a');
            if (avatarLink) return avatarLink.href;
            return null;
        },
        async getSubscriptionsBaseUrl() {
            const profileUrl = await this.getMyProfileUrl();
            if (!profileUrl) return null;
            return profileUrl.split('/').slice(0, 5).join('/') + '/subscriptions';
        },
        async getFriendsBaseUrl() {
            const profileUrl = await this.getMyProfileUrl();
            if (!profileUrl) return null;
            return profileUrl.split('/').slice(0, 5).join('/') + '/friends';
        },
        async fetchDocument(url) {
            try {
                const response = await fetch(url);
                return new DOMParser().parseFromString(await response.text(), 'text/html');
            } catch (e) { return null; }
        },
        async getFollowedUsers(statusCallback) {
            const baseUrl = await this.getSubscriptionsBaseUrl();
            if (!baseUrl) throw new Error('ログインしていないか、プロフィールが見つかりません');
            return this._getUsersFromPages(baseUrl, statusCallback);
        },
        async getFriends(statusCallback) {
            const baseUrl = await this.getFriendsBaseUrl();
            if (!baseUrl) throw new Error('ログインしていないか、プロフィールが見つかりません');
            return this._getUsersFromPages(baseUrl, statusCallback);
        },
        async _getUsersFromPages(baseUrl, statusCallback) {
            const usersMap = new Map();
            let page = 1;
            let hasNextPage = true;
            const myUsernameMatch = baseUrl.match(/\/user\/([^\/]+)/);
            const myUsername = myUsernameMatch ? myUsernameMatch[1] : null;
            while (hasNextPage) {
                const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
                if (statusCallback) statusCallback(`${t('msg_fetching')} (${page} p)`);
                const doc = await this.fetchDocument(url);
                if (!doc) break;
                const userCards = Array.from(doc.querySelectorAll('.thumb-block, .user-card, .col-sm-6, .col-sm-4, .col-xs-6'));
                userCards.forEach(card => {
                    const userLink = card.querySelector('a[href*="/user/"]');
                    if (!userLink) return;
                    const href = userLink.getAttribute('href');
                    if (href.includes('/video/')) return;
                    const userMatch = href.match(/\/user\/([^\/\?#]+)/);
                    if (!userMatch || !userMatch[1]) return;
                    const username = userMatch[1];
                    if (myUsername && username.toLowerCase() === myUsername.toLowerCase()) return;
                    const invalidUsernames = ['edit', 'avatar', 'logout', 'login', 'register', 'settings', 'upload', 'search', 'help', 'contact', 'about', 'terms', 'privacy', 'dmca'];
                    if (invalidUsernames.includes(username.toLowerCase())) return;
                    const normalizedUrl = `https://www.tokyomotion.net/user/${username}`;
                    if (usersMap.has(normalizedUrl)) return;
                    let iconSrc = '';
                    const img = card.querySelector('img');
                    if (img) iconSrc = img.src || img.dataset.src || '';
                    if (!iconSrc) iconSrc = 'https://www.tokyomotion.net/img/user-avatar.png';
                    usersMap.set(normalizedUrl, { url: normalizedUrl, icon: iconSrc });
                });
                const userLinks = Array.from(doc.querySelectorAll('a[href*="/user/"]'));
                userLinks.forEach(a => {
                    const href = a.getAttribute('href');
                    if (!href || href.includes('/video/') || href.includes('/subscriptions') || href.includes('/friends') || href.includes('/favorites')) return;
                    const userMatch = href.match(/\/user\/([^\/\?#]+)/);
                    if (!userMatch || !userMatch[1]) return;
                    const username = userMatch[1];
                    if (myUsername && username.toLowerCase() === myUsername.toLowerCase()) return;
                    const invalidUsernames = ['edit', 'avatar', 'logout', 'login', 'register', 'settings', 'upload', 'search', 'help', 'contact', 'about', 'terms', 'privacy', 'dmca'];
                    if (invalidUsernames.includes(username.toLowerCase())) return;
                    const normalizedUrl = `https://www.tokyomotion.net/user/${username}`;
                    if (usersMap.has(normalizedUrl)) return;
                    let iconSrc = '';
                    const img = a.querySelector('img') || (a.parentElement ? a.parentElement.querySelector('img') : null);
                    if (img) iconSrc = img.src || img.dataset.src || '';
                    if (!iconSrc) iconSrc = 'https://www.tokyomotion.net/img/user-avatar.png';
                    usersMap.set(normalizedUrl, { url: normalizedUrl, icon: iconSrc });
                });
                const paginationLinks = Array.from(doc.querySelectorAll('.pagination a'));
                const hasNext = paginationLinks.some(a => a.href.includes(`page=${page + 1}`));
                if (hasNext) page++; else hasNextPage = false;
                await new Promise(r => setTimeout(r, 500));
            }
            return Array.from(usersMap.values());
        },
        async getUserVideos(userData, maxPages = 5) {
            const userUrl = userData.url;
            const userIcon = userData.icon;
            const videosBaseUrl = userUrl.replace(/\/$/, '') + '/videos';
            const allVideos = [];
            let page = 1;
            let hasNextPage = true;
            while (hasNextPage && page <= maxPages) {
                const targetUrl = page === 1 ? videosBaseUrl : `${videosBaseUrl}?page=${page}`;
                try {
                    const doc = await this.fetchDocument(targetUrl);
                    if (!doc) break;
                    const videoLinks = Array.from(doc.querySelectorAll('a[href*="/video/"]'));
                    let foundInPage = 0;
                    videoLinks.forEach(link => {
                        try {
                            const img = link.querySelector('img') || (link.parentElement ? link.parentElement.querySelector('img') : null);
                            if (!img) return;
                            const container = link.closest('.col-sm-4') || link.closest('.col-xs-6') || link.closest('.video-card') || link.closest('.thumb-block') || link.parentElement;
                            let title = '', duration = '', dateStr = '';
                            let isPrivate = false;
                            if (container) {
                                const titleEl = container.querySelector('.video-card-title, .title, .video-title, h4, h5');
                                if (titleEl) title = titleEl.innerText.trim();
                                const durationEl = container.querySelector('.duration');
                                if (durationEl) duration = durationEl.innerText.trim();
                                const dateEl = container.querySelector('.video-added');
                                if (dateEl) dateStr = dateEl.innerText.trim();
                                if (container.querySelector('.label-private') || container.querySelector('.img-private')) isPrivate = true;
                                const overlay = container.querySelector('.thumb-overlay');
                                if (!isPrivate && overlay && overlay.textContent.toUpperCase().includes('PRIVATE')) isPrivate = true;
                            }
                            if (!title && img.alt) title = img.alt.trim();
                            if (!duration) {
                                const insideDuration = link.querySelector('.duration');
                                if (insideDuration) duration = insideDuration.innerText.trim();
                            }
                            if (!title) title = 'Untitled';
                            const href = link.getAttribute('href');
                            const fullUrl = href.startsWith('http') ? href : (new URL(href, userUrl).href);
                            const idMatch = fullUrl.match(/\/video\/(\d+)/);
                            if (!idMatch) return;
                            if (allVideos.some(v => v.id === idMatch[1])) return;
                            if (isPrivate) StorageManager.addPrivateToCache([idMatch[1]]);
                            allVideos.push({
                                id: idMatch[1],
                                title: title,
                                thumbnail: img.src || img.dataset.src,
                                url: fullUrl,
                                author: userUrl.split('/').pop(),
                                authorIcon: userIcon,
                                duration: duration,
                                date: dateStr,
                                isPrivate: isPrivate,
                                timestamp: Date.now()
                            });
                            foundInPage++;
                        } catch (e) { }
                    });
                    const paginationLinks = Array.from(doc.querySelectorAll('.pagination a'));
                    const hasNext = paginationLinks.some(a => a.href.includes(`page=${page + 1}`));
                    if (hasNext && foundInPage > 0) page++; else hasNextPage = false;
                    await new Promise(r => setTimeout(r, 500));
                } catch (err) { break; }
            }
            return allVideos;
        }
    };

    function formatRelativeTime(rawTime) {
        if (!rawTime) return '';
        let cleaned = rawTime.replace(/\s+/g, '').trim();
        if (cleaned.match(/^\d+時前$/)) cleaned = cleaned.replace('時前', '時間前');
        cleaned = cleaned.replace(/時\s*前/g, '時間前').replace(/分\s*前/g, '分前').replace(/日\s*前/g, '日前').replace(/週\s*前/g, '週間前').replace(/月\s*前/g, 'ヶ月前').replace(/年\s*前/g, '年前');
        return cleaned;
    }

    function calcTimeAgo(timestamp) {
        if (!timestamp) return '-';
        const diff = Date.now() - timestamp;
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (diff < minute) return t('time_just_now');
        if (diff < hour) return Math.floor(diff / minute) + t('time_min_ago');
        if (diff < day) return Math.floor(diff / hour) + t('time_hour_ago');
        if (diff < day * 30) return Math.floor(diff / day) + t('time_day_ago');
        return t('time_long_ago');
    }

    // ========================================
    // スタイル注入
    // ========================================
    GM_addStyle(`
        .tm-panel {
            position: fixed; width: 500px; height: 600px; min-width: 300px; min-height: 250px;
            background: #1a1a1a; border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            z-index: 999999; display: none; flex-direction: column; font-family: 'Segoe UI', sans-serif;
            bottom: 90px; right: 20px;
        }
        .tm-panel.active { display: flex; }
        .tm-panel-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px;
            font-weight: 600; display: flex; justify-content: space-between; align-items: center;
            cursor: move; user-select: none; border-radius: 12px 12px 0 0;
        }
        .tm-panel-close { background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; }
        .tm-toggle-btn {
            position: fixed; width: 56px; height: 56px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none; border-radius: 50%; color: white; font-size: 24px; cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); z-index: 999998; user-select: none; touch-action: none;
            bottom: 20px; right: 20px;
        }
        .tm-toggle-btn:hover { transform: scale(1.1); }
        .tm-toggle-btn:active { transform: scale(0.95); }
        .tm-tabs { display: flex; background: #252525; border-bottom: 2px solid #333; overflow-x: auto; }
        .tm-tab {
            flex: 1; padding: 12px 8px; background: transparent; border: none; color: #aaa; cursor: pointer; font-size: 12px;
            border-bottom: 3px solid transparent; min-width: 60px; text-align: center; white-space: nowrap; user-select: none;
        }
        .tm-tab.active { background: #1a1a1a; border-bottom-color: #667eea; color: #fff; font-weight: 600; }
        .tm-tab:hover { background: #333; }
        .tm-tab.dragging { opacity: 0.5; background: #444; }
        .tm-content { flex: 1; overflow-y: auto; padding: 10px; background: #111; min-height: 0; }
        .tm-tab-content { display: none; height: 100%; }
        .tm-tab-content.active { display: block; }
        .tm-feed-header { display: flex; justify-content: center; align-items: center; gap: 15px; padding: 10px; margin-bottom: 5px; }
        .tm-time-label { font-size: 11px; color: #888; width: 90px; text-align: center; white-space: nowrap; }
        .tm-grid-view { display: grid; grid-template-columns: repeat(var(--tm-video-cols, 2), 1fr); gap: 15px; padding: 5px; }
        .tm-card { display: flex; flex-direction: column; background: transparent; cursor: pointer; border: none; position: relative; transition: opacity 0.2s; }
        .tm-card:hover { opacity: 0.9; }
        .tm-card-thumb-box { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
        .tm-card-thumb { width: 100%; height: 100%; object-fit: cover; }
        .tm-card-duration { position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 5px; font-size: 11px; border-radius: 3px; line-height: 1; }
        .tm-card-private { position: absolute; bottom: 5px; left: 5px; background: #cc0000; color: #fff; padding: 2px 5px; font-size: 10px; border-radius: 3px; line-height: 1; font-weight: bold; }
        .tm-card-title {
            color: #ff5e5e; font-size: 13px; font-weight: 500; line-height: 1.3; max-height: 2.6em; overflow: hidden; margin-bottom: 5px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .tm-card:hover .tm-card-title { text-decoration: underline; }
        .tm-card-meta { font-size: 11px; color: #888; line-height: 1.3; }
        .tm-user-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; flex-wrap: wrap; }
        .tm-user-icon { width: 18px; height: 18px; border-radius: 50%; object-fit: cover; background: #333; flex-shrink: 0; }
        .tm-user-link { color: #aaa; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px; }
        .tm-user-link:hover { color: #fff; text-decoration: underline; }
        .tm-relative-time { color: #888; font-size: 10px; margin-left: 6px; white-space: nowrap; }
        .tm-input { width: 100%; padding: 10px; background: #2d2d2d; border: 2px solid #444; border-radius: 6px; color: #e0e0e0; font-size: 13px; margin-bottom: 10px; }
        .tm-btn-row { display: flex; gap: 8px; }
        .tm-btn-primary, .tm-btn-secondary { flex: 1; padding: 10px; border: none; border-radius: 6px; cursor: pointer; color: white; }
        .tm-btn-primary { background: #667eea; }
        .tm-btn-secondary { background: #555; }
        .tm-btn-danger { width: 100%; padding: 10px; background: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px; }
        .tm-empty { text-align: center; color: #666; padding: 30px; }
        .tm-toast {
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
            background: #333; color: #fff; padding: 12px 24px; border-radius: 8px;
            opacity: 0; transition: all 0.3s; z-index: 9999999;
        }
        .tm-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .tm-card-remove {
            position: absolute; top: 5px; right: 5px; background: rgba(231, 76, 60, 0.8); color: white;
            border: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; display: none; z-index: 10; font-size: 12px;
            align-items: center; justify-content: center;
        }
        .tm-card:hover .tm-card-remove { display: flex; }
        .tm-playlist-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .tm-playlist-card { padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; cursor: pointer; position: relative; transition: all 0.3s; }
        .tm-playlist-name { font-weight: bold; margin-bottom: 5px; }
        .tm-playlist-count { font-size: 12px; opacity: 0.9; }
        .tm-playlist-delete { position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.3); border: none; color: white; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; }
        .tm-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999990; display: flex; align-items: center; justify-content: center; }
        .tm-modal-content { background: #1a1a1a; border-radius: 12px; width: auto; min-width: 320px; max-width: 90vw; transition: width 0.3s; }
        .tm-modal-header { background: #667eea; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; gap: 10px; border-radius: 12px 12px 0 0; }
        .tm-playlist-list { padding: 10px; display: grid; gap: 8px; max-height: 350px; overflow-y: auto; }
        .tm-playlist-item { display: flex; gap: 5px; padding: 8px; background: #2d2d2d; border-radius: 4px; color: #fff; cursor: pointer; }
        .tm-modal-footer { padding: 15px; }
        .tm-new-playlist-form { display: flex; gap: 5px; }
        .tm-playlist-btn-inline { margin-left: 5px !important; cursor: pointer !important; }
        .tm-toggle-switch { width: 44px; height: 24px; background: #555; border-radius: 12px; cursor: pointer; position: relative; }
        .tm-toggle-switch.active { background: #667eea; }
        .tm-toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: 0.3s; }
        .tm-toggle-switch.active::after { transform: translateX(20px); }
        .tm-col-select { background: rgba(0,0,0,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; padding: 2px 5px; font-size: 12px; cursor: pointer; outline: none; }
        .tm-col-select option { background: #333; color: white; }
        .tm-tab-visibility-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #333; }
        .tm-tab-visibility-item:last-child { border-bottom: none; }
        .tm-resizer { position: absolute; z-index: 100; touch-action: none; }
        .tm-resizer.n { top: -5px; left: 0; right: 0; height: 10px; cursor: ns-resize; }
        .tm-resizer.s { bottom: -5px; left: 0; right: 0; height: 10px; cursor: ns-resize; }
        .tm-resizer.e { right: -5px; top: 0; bottom: 0; width: 10px; cursor: ew-resize; }
        .tm-resizer.w { left: -5px; top: 0; bottom: 0; width: 10px; cursor: ew-resize; }
        .tm-resizer.ne { top: -5px; right: -5px; width: 15px; height: 15px; cursor: nesw-resize; }
        .tm-resizer.nw { top: -5px; left: -5px; width: 15px; height: 15px; cursor: nwse-resize; }
        .tm-resizer.se { bottom: -5px; right: -5px; width: 15px; height: 15px; cursor: nwse-resize; }
        .tm-resizer.sw { bottom: -5px; left: -5px; width: 15px; height: 15px; cursor: nesw-resize; }
        body.tm-dragging { user-select: none; }
        .tm-btn-icon { background: transparent; border: none; color: #aaa; cursor: pointer; font-size: 14px; margin-left: 8px; padding: 2px; transition: color 0.2s; }
        .tm-btn-icon:hover { color: #fff; }
        .tm-added-time { color: #888; font-size: 10px; margin-top: 3px; }
    `);

    // ========================================
    // ユーティリティ
    // ========================================
    function formatDate(timestamp) {
        if (!timestamp) return '';
        const d = new Date(timestamp);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function formatSeconds(seconds) {
        if (!seconds || isNaN(seconds)) return null;
        seconds = Math.floor(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const pad = n => n.toString().padStart(2, '0');
        if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
        return `${m}:${pad(s)}`;
    }

    function showToast(message) {
        const existing = document.querySelector('.tm-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'tm-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 3000); // 通知時間
        }, 3000);
    }

    function extractVideoId() {
        const match = window.location.pathname.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
    }

    function extractVideoData(forceDuration = null) {
        const videoId = extractVideoId();
        if (!videoId) return null;
        let title = 'Untitled';
        const titleEl = document.querySelector('h3.big-title-truncate, h4.big-title-truncate');
        if (titleEl) title = titleEl.textContent.trim();
        else if (document.title) title = document.title.replace(' - TokyoMotion', '').trim();
        let duration = '';
        const videoEl = document.querySelector('video');
        if (forceDuration) {
            duration = forceDuration;
        } else if (videoEl && videoEl.duration && !isNaN(videoEl.duration) && videoEl.duration !== Infinity && videoEl.duration > 0) {
            duration = formatSeconds(videoEl.duration) || '';
        }
        if (!duration) {
            const durEl = document.querySelector('.vjs-duration-display') || document.querySelector('.duration');
            if (durEl) {
                const text = durEl.innerText.replace(/[^\d:]/g, '');
                if (text && text !== '0:00' && text !== '00:00') duration = text;
            }
        }
        let author = 'Unknown';
        let authorIcon = '';
        const userContainer = document.querySelector('.user-container');
        if (userContainer) {
            const link = userContainer.querySelector('a[href^="/user/"]');
            if (link) {
                const span = link.querySelector('span');
                author = span ? span.textContent.trim() : link.textContent.trim();
                const img = link.querySelector('img');
                if (img) authorIcon = img.src;
            }
        } else {
            const userLink = document.querySelector('.video-info a[href^="/user/"], .user-info a[href^="/user/"], a.username');
            if (userLink) author = userLink.innerText.trim();
            const avatarImg = document.querySelector('.avatar-container img, .video-info img.avatar, .user-avatar img');
            if (avatarImg) authorIcon = avatarImg.src;
        }
        if (!authorIcon) authorIcon = 'https://www.tokyomotion.net/img/user-avatar.png';
        let isPrivate = false;
        if (StorageManager.isPrivateCached(videoId)) isPrivate = true;
        if (!isPrivate) {
            try {
                if (document.querySelector('.label-private') || document.querySelector('.img-private')) isPrivate = true;
            } catch (e) { }
        }
        return {
            id: videoId,
            title: title,
            thumbnail: document.querySelector('video[poster]')?.getAttribute('poster') || '',
            url: window.location.href,
            duration: duration,
            author: author,
            authorIcon: authorIcon,
            isPrivate: isPrivate,
            timestamp: Date.now()
        };
    }

    function getDurationFromPlayer() {
        const videoEl = document.querySelector('video');
        if (videoEl && videoEl.duration && !isNaN(videoEl.duration) && videoEl.duration !== Infinity && videoEl.duration > 0) {
            const formatted = formatSeconds(videoEl.duration);
            if (formatted) return formatted;
        }
        const durEl = document.querySelector('.vjs-duration-display');
        if (durEl) {
            const text = durEl.innerText.replace(/[^\d:]/g, '');
            if (text && text !== '0:00' && text !== '00:00') return text;
        }
        return null;
    }

    // ========================================
    // パネル・ボタン移動 & リサイズ
    // ========================================
    function setupDraggableButton(btn) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        const DRAG_THRESHOLD = 5;
        let hasMoved = false;

        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            const rect = btn.getBoundingClientRect();
            btn.style.bottom = 'auto'; btn.style.right = 'auto';
            btn.style.left = rect.left + 'px'; btn.style.top = rect.top + 'px';
            startX = e.clientX; startY = e.clientY;
            initialLeft = rect.left; initialTop = rect.top;
            document.body.classList.add('tm-dragging');
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) hasMoved = true;
            const winW = window.innerWidth; const winH = window.innerHeight;
            const btnW = btn.offsetWidth; const btnH = btn.offsetHeight;
            let newLeft = initialLeft + dx; let newTop = initialTop + dy;
            newLeft = Math.max(0, Math.min(newLeft, winW - btnW));
            newTop = Math.max(0, Math.min(newTop, winH - btnH));
            btn.style.left = newLeft + 'px'; btn.style.top = newTop + 'px';
        });
        window.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false; document.body.classList.remove('tm-dragging');
                if (hasMoved) StorageManager.setBtnPosition({ left: btn.style.left, top: btn.style.top });
            }
        });
        btn.addEventListener('click', (e) => {
            if (hasMoved) { e.stopImmediatePropagation(); e.preventDefault(); }
        }, true);
    }

    function setupDraggablePanel(panel) {
        const header = panel.querySelector('.tm-panel-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('.tm-resizer')) return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            panel.style.bottom = 'auto'; panel.style.right = 'auto';
            panel.style.left = rect.left + 'px'; panel.style.top = rect.top + 'px';
            startX = e.clientX; startY = e.clientY;
            initialLeft = rect.left; initialTop = rect.top;
            document.body.classList.add('tm-dragging');
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            let newLeft = initialLeft + dx; let newTop = initialTop + dy;
            const winW = window.innerWidth; const winH = window.innerHeight;
            const panelW = panel.offsetWidth; const panelH = panel.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, winW - panelW - SCROLLBAR_MARGIN));
            newTop = Math.max(0, Math.min(newTop, winH - panelH));
            panel.style.left = newLeft + 'px'; panel.style.top = newTop + 'px';
        });
        window.addEventListener('mouseup', () => {
            if (isDragging) { isDragging = false; document.body.classList.remove('tm-dragging'); savePanelState(panel); }
        });
    }

    function setupResizablePanel(panel) {
        const directions = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
        directions.forEach(dir => {
            const resizer = document.createElement('div');
            resizer.className = `tm-resizer ${dir}`;
            panel.appendChild(resizer);
            resizer.addEventListener('mousedown', (e) => initResize(e, dir));
        });
        let isResizing = false;
        let currentDir = '';
        let startX, startY, startW, startH, startLeft, startTop;
        function initResize(e, dir) {
            e.preventDefault(); e.stopPropagation();
            isResizing = true; currentDir = dir;
            const rect = panel.getBoundingClientRect();
            startX = e.clientX; startY = e.clientY;
            startW = rect.width; startH = rect.height;
            startLeft = rect.left; startTop = rect.top;
            panel.style.left = startLeft + 'px'; panel.style.top = startTop + 'px';
            panel.style.right = 'auto'; panel.style.bottom = 'auto';
            panel.style.width = startW + 'px'; panel.style.height = startH + 'px';
            document.body.classList.add('tm-dragging');
            document.body.style.cursor = window.getComputedStyle(e.target).cursor;
        }
        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            const winW = window.innerWidth; const winH = window.innerHeight;
            let newW = startW; let newH = startH; let newLeft = startLeft; let newTop = startTop;
            if (currentDir.includes('e')) newW = Math.min(startW + dx, winW - startLeft - SCROLLBAR_MARGIN);
            if (currentDir.includes('w')) { const maxDelta = startLeft; const actualDx = Math.max(dx, -maxDelta); newW = startW - actualDx; newLeft = startLeft + actualDx; }
            if (currentDir.includes('s')) newH = Math.min(startH + dy, winH - startTop);
            if (currentDir.includes('n')) { const maxDelta = startTop; const actualDy = Math.max(dy, -maxDelta); newH = startH - actualDy; newTop = startTop + actualDy; }
            const minW = 300; const minH = 200;
            if (newW < minW) { if (currentDir.includes('w')) newLeft = startLeft + (startW - minW); newW = minW; }
            if (newH < minH) { if (currentDir.includes('n')) newTop = startTop + (startH - minH); newH = minH; }
            panel.style.width = newW + 'px'; panel.style.height = newH + 'px';
            panel.style.left = newLeft + 'px'; panel.style.top = newTop + 'px';
        });
        window.addEventListener('mouseup', () => {
            if (isResizing) { isResizing = false; document.body.classList.remove('tm-dragging'); document.body.style.cursor = ''; savePanelState(panel); }
        });
    }

    function savePanelState(panel) {
        const style = window.getComputedStyle(panel);
        StorageManager.setPanelState({ width: style.width, height: style.height, left: style.left, top: style.top });
    }

    function restoreUIState(panel, btn) {
        const btnPos = StorageManager.getBtnPosition();
        if (btnPos) { btn.style.bottom = 'auto'; btn.style.right = 'auto'; btn.style.left = btnPos.left; btn.style.top = btnPos.top; }
        const panelState = StorageManager.getPanelState();
        if (panelState) {
            panel.style.bottom = 'auto'; panel.style.right = 'auto';
            const winW = window.innerWidth; const winH = window.innerHeight;
            let w = parseFloat(panelState.width); let h = parseFloat(panelState.height);
            let l = parseFloat(panelState.left); let t = parseFloat(panelState.top);
            w = Math.min(w, winW - SCROLLBAR_MARGIN); h = Math.min(h, winH);
            l = Math.max(0, Math.min(l, winW - w - SCROLLBAR_MARGIN));
            t = Math.max(0, Math.min(t, winH - h));
            panel.style.left = l + 'px'; panel.style.top = t + 'px';
            panel.style.width = w + 'px'; panel.style.height = h + 'px';
        }
    }

    function setupScrollPersistence(panel) {
        const content = panel.querySelector('.tm-content');
        if (!content) return;
        content.addEventListener('scroll', () => {
            const currentTab = StorageManager.getLastActiveTab();
            if (currentTab) {
                if (content.scrollTimeout) clearTimeout(content.scrollTimeout);
                content.scrollTimeout = setTimeout(() => {
                    StorageManager.setTabScroll(currentTab, content.scrollTop);
                }, 100);
            }
        });
    }

    function restoreScrollPosition(panel, tabName) {
        const content = panel.querySelector('.tm-content');
        if (content) {
            const savedScroll = StorageManager.getTabScroll(tabName);
            setTimeout(() => { content.scrollTop = savedScroll; }, 50);
        }
    }

    // ========================================
    // メインUI
    // ========================================
    function createMainUI() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'tm-toggle-btn';
        toggleBtn.innerHTML = '🎬';
        toggleBtn.title = 'TokyoMotion Enhancer';
        document.body.appendChild(toggleBtn);

        const panel = document.createElement('div');
        panel.className = 'tm-panel';

        const isVideoPage = location.pathname.startsWith('/video/');
        if (isVideoPage) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }

        panel.innerHTML = `
            <div class="tm-panel-header">
                <span>🎬 TokyoMotion Enhancer</span>
                <button class="tm-panel-close">×</button>
            </div>
            <div class="tm-tabs" id="tm-tabs-container"></div>
            <div class="tm-content">
                <div class="tm-tab-content" id="tm-liked"></div>
                <div class="tm-tab-content" id="tm-history"></div>
                <div class="tm-tab-content" id="tm-playlists"></div>

                <div class="tm-tab-content" id="tm-feed">
                    <div class="tm-feed-header">
                        <span id="tm-feed-time-ago" class="tm-time-label"></span>
                        <button class="tm-btn-primary" id="tm-feed-update">${t('tab_feed')} ${t('btn_update')}</button>
                        <span id="tm-feed-time-absolute" class="tm-time-label"></span>
                    </div>
                    <div id="tm-feed-status" style="margin:0 0 10px 0; text-align:center; font-size:11px; color:#888;"></div>
                    <div id="tm-feed-list"></div>
                </div>

                <div class="tm-tab-content" id="tm-friends">
                    <div class="tm-feed-header">
                        <span id="tm-friends-time-ago" class="tm-time-label"></span>
                        <button class="tm-btn-primary" id="tm-friends-update">${t('tab_friends')} ${t('btn_update')}</button>
                        <span id="tm-friends-time-absolute" class="tm-time-label"></span>
                    </div>
                    <div id="tm-friends-status" style="margin:0 0 10px 0; text-align:center; font-size:11px; color:#888;"></div>
                    <div id="tm-friends-list"></div>
                </div>

                <div class="tm-tab-content" id="tm-settings">
                    <!-- Settings will be rendered by JS -->
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 初期描画
        renderTabs(panel);
        renderSettingsTab(panel);
        restoreUIState(panel, toggleBtn);
        setupDraggableButton(toggleBtn);
        setupDraggablePanel(panel);
        setupResizablePanel(panel);
        setupScrollPersistence(panel);
        applyVideoGridCols();

        // ----------------------------------------
        // ★自動スクロールリセット機能
        // ----------------------------------------
        let leaveTime = 0;
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // サイトを離れた（タブを隠した）時間を記録
                leaveTime = Date.now();
            } else {
                // サイトに戻ってきた時
                if (leaveTime > 0) {
                    const diff = Date.now() - leaveTime;
                    const threshold = getScrollResetMs();
                    // 設定時間を経過していたらリセット
                    if (diff > threshold) {
                        const content = panel.querySelector('.tm-content');
                        if (content) {
                            content.scrollTop = 0;
                        }

                        // 全タブのスクロール位置をリセット
                        const tabsToReset = ['liked', 'history', 'playlists', 'feed', 'friends'];
                        tabsToReset.forEach(tab => {
                            StorageManager.setTabScroll(tab, 0);
                        });

                        // プレイリストタブは詳細画面から一覧に戻す
                        StorageManager.setActivePlaylist(null);

                        // 現在のタブを再読み込みしてリセット反映
                        const currentTab = StorageManager.getLastActiveTab();
                        if (currentTab === 'liked') {
                            loadLikedVideos();
                        } else if (currentTab === 'history') {
                            loadHistory();
                        } else if (currentTab === 'playlists') {
                            loadPlaylists();
                        }

                        showToast(t('msg_scroll_reset')); // 通知
                    }
                    leaveTime = 0;
                }
            }
        });

        panel.addEventListener('click', (e) => e.stopPropagation());

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('active');
            if (panel.classList.contains('active')) {
                let defaultTab = StorageManager.getDefaultTab();
                if (defaultTab === 'last_open') defaultTab = StorageManager.getLastActiveTab();
                const visibility = StorageManager.getTabVisibility();
                if (!visibility[defaultTab]) {
                    const order = StorageManager.getTabOrder();
                    defaultTab = order.find(t => visibility[t]) || 'settings';
                }
                switchToTab(panel, defaultTab);
            }
        });

        panel.querySelector('.tm-panel-close').addEventListener('click', () => {
            panel.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
            if (panel.classList.contains('active')) {
                if (document.querySelector('.tm-modal-overlay')) return;
                if (!isVideoPage) {
                    if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
                        panel.classList.remove('active');
                    }
                }
            }
        });

        if (panel.classList.contains('active')) {
            let defaultTab = StorageManager.getDefaultTab();
            if (defaultTab === 'last_open') defaultTab = StorageManager.getLastActiveTab();
            switchToTab(panel, defaultTab);
        }

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                panel.style.display = 'none';
                toggleBtn.style.display = 'none';
            } else {
                panel.style.display = '';
                toggleBtn.style.display = '';
            }
        });
    }

    // ========================================
    // 設定タブの動的描画
    // ========================================
    function renderSettingsTab(panel = document.querySelector('.tm-panel')) {
        const container = panel.querySelector('#tm-settings');
        if (!container) return;

        // オプション生成ヘルパー
        const generatePageOptions = () => {
            let opts = '';
            for (let i = 1; i <= 10; i++) {
                opts += `<option value="${i}">${i}${t('stg_page_unit')}</option>`;
            }
            opts += `<option value="99999">${t('stg_unlimited')}</option>`;
            return opts;
        };

        const currentScrollVal = StorageManager.getScrollResetValue();
        const currentScrollUnit = StorageManager.getScrollResetUnit();

        container.innerHTML = `
            <div style="margin-bottom:15px;">
                <label style="color:#e0e0e0;font-size:13px;display:block;margin-bottom:8px;">${t('stg_language')}</label>
                <select id="tm-language-selector" class="tm-input">
                    <option value="auto">Auto (自動)</option>
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                </select>
            </div>
            <div style="border-top:1px solid #444; padding-top:15px; margin-bottom:15px;">
                <label style="color:#e0e0e0;font-size:13px;display:block;margin-bottom:8px;">${t('stg_startup_tab')}</label>
                <select id="tm-default-tab" class="tm-input">
                    <option value="last_open">${t('stg_tab_last_open')}</option>
                    <option value="liked">${t('tab_liked')}</option>
                    <option value="history">${t('tab_history')}</option>
                    <option value="playlists">${t('tab_playlists')}</option>
                    <option value="feed">${t('tab_feed')}</option>
                    <option value="friends">${t('tab_friends')}</option>
                    <option value="settings">${t('tab_settings')}</option>
                </select>
            </div>

            <div style="margin-top:15px; border-top:1px solid #444; padding-top:15px;">
                <label style="color:#e0e0e0;font-size:13px;display:block;margin-bottom:8px;">${t('stg_scroll_reset')}</label>
                <div style="display:flex; gap:10px;">
                    <input type="number" id="tm-scroll-val" class="tm-input" style="flex:1;" min="1" value="${currentScrollVal}">
                    <select id="tm-scroll-unit" class="tm-input" style="flex:1;">
                        <option value="seconds">${t('unit_sec')}</option>
                        <option value="minutes">${t('unit_min')}</option>
                        <option value="hours">${t('unit_hour')}</option>
                    </select>
                </div>
            </div>

            <div class="tm-login-section" style="border-top:1px solid #444; padding-top:15px;">
                <div style="color:#e0e0e0;font-size:14px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                    ${t('stg_auto_login')} <div class="tm-toggle-switch" id="tm-auto-login-toggle"></div>
                </div>
                <div style="font-size:12px;color:#888;">${t('stg_auto_login_desc')}</div>
            </div>

            <div style="margin-top:15px; border-top:1px solid #444; padding-top:15px;">
                <div style="color:#e0e0e0;font-size:14px;font-weight:600;margin-bottom:12px;">${t('stg_tab_visibility')}</div>
                <div id="tm-tab-visibility-settings"></div>
            </div>

            <div style="margin-top:15px; border-top:1px solid #444; padding-top:15px;">
                <label style="color:#e0e0e0;font-size:13px;display:block;margin-bottom:8px;">${t('stg_grid_cols')}</label>
                <select id="tm-video-grid-cols" class="tm-input">
                    <option value="1">1${t('stg_col_unit')}</option>
                    <option value="2">2${t('stg_col_unit')}</option>
                    <option value="3">3${t('stg_col_unit')}</option>
                    <option value="4">4${t('stg_col_unit')}</option>
                    <option value="5">5${t('stg_col_unit')}</option>
                </select>
            </div>

            <div style="margin-top:15px; border-top:1px solid #444; padding-top:15px;">
                <div style="display:flex; gap:10px;">
                    <div style="flex:1;">
                        <label style="color:#e0e0e0;font-size:13px;display:block;margin-bottom:8px;">${t('stg_feed_pages')}</label>
                        <select id="tm-feed-max-pages" class="tm-input">
                           ${generatePageOptions()}
                        </select>
                    </div>
                    <div style="flex:1;">
                         <label style="color:#e0e0e0;font-size:13px;display:block;margin-bottom:8px;">${t('stg_friend_pages')}</label>
                         <select id="tm-friends-max-pages" class="tm-input">
                            ${generatePageOptions()}
                         </select>
                    </div>
                </div>
            </div>
            <div class="tm-btn-row" style="margin-top:20px;">
                <button class="tm-btn-secondary" id="tm-export">${t('btn_export')}</button>
                <button class="tm-btn-secondary" id="tm-import">${t('btn_import')}</button>
            </div>
            <button class="tm-btn-danger" id="tm-clear-all">${t('btn_clear_all')}</button>
        `;

        // イベントバインドの再実行
        renderTabVisibilitySettings();
        initLoginSettings();

        document.getElementById('tm-export').addEventListener('click', exportData);
        document.getElementById('tm-import').addEventListener('click', importData);
        document.getElementById('tm-clear-all').addEventListener('click', clearAllData);

        const defaultTabSelect = document.getElementById('tm-default-tab');
        defaultTabSelect.value = StorageManager.getDefaultTab();
        defaultTabSelect.addEventListener('change', (e) => StorageManager.setDefaultTab(e.target.value));

        const scrollValInput = document.getElementById('tm-scroll-val');
        const saveScrollVal = (e) => {
            const val = parseInt(e.target.value);
            if (val > 0) {
                StorageManager.setScrollResetValue(val);
                console.log(`[TokyoMotion Enhancer] Saved scroll val: ${val}`);
            }
        };
        // 'input'だと急な変更で保存が追いつかない場合があるので'change'も併用
        scrollValInput.addEventListener('input', saveScrollVal);
        scrollValInput.addEventListener('change', saveScrollVal);

        const scrollUnitSelect = document.getElementById('tm-scroll-unit');
        scrollUnitSelect.value = currentScrollUnit;
        scrollUnitSelect.addEventListener('change', (e) => {
            StorageManager.setScrollResetUnit(e.target.value);
            console.log(`[TokyoMotion Enhancer] Saved scroll unit: ${e.target.value}`);
        });

        const videoGridColsSelect = document.getElementById('tm-video-grid-cols');
        videoGridColsSelect.value = StorageManager.getVideoGridCols();
        videoGridColsSelect.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            StorageManager.setVideoGridCols(val);
            applyVideoGridCols();
        });

        const feedMaxSelect = document.getElementById('tm-feed-max-pages');
        feedMaxSelect.value = StorageManager.getFeedMaxPages();
        feedMaxSelect.addEventListener('change', (e) => StorageManager.setFeedMaxPages(parseInt(e.target.value)));

        const friendsMaxSelect = document.getElementById('tm-friends-max-pages');
        friendsMaxSelect.value = StorageManager.getFriendsMaxPages();
        friendsMaxSelect.addEventListener('change', (e) => StorageManager.setFriendsMaxPages(parseInt(e.target.value)));

        const langSelect = document.getElementById('tm-language-selector');
        langSelect.value = GM_getValue('appLanguage', 'auto');
        langSelect.addEventListener('change', (e) => {
            TranslationManager.setLanguage(e.target.value);
            // リロードではなく、描画関数を呼び出して即時反映
            renderTabs(panel);
            renderSettingsTab(panel);

            // 現在のタブが設定以外（既に開いていたタブ）の場合、その内容も更新する必要がある
            // ただし設定タブにいるので、次にフィードタブを開いたときに更新されればよい
            // _setupFeedLogicがタブ切り替え時に呼ばれ、そこで言語更新を行うように修正済み
        });
    }

    // ========================================
    // タブ関連ロジック
    // ========================================
    function renderTabs(panel) {
        const container = panel.querySelector('#tm-tabs-container');
        container.innerHTML = '';
        const order = StorageManager.getTabOrder();
        DEFAULT_TAB_ORDER.forEach(def => { if (!order.includes(def)) order.push(def); });
        const visibility = StorageManager.getTabVisibility();
        order.forEach(tabKey => {
            if (!visibility[tabKey]) return;
            const btn = document.createElement('button');
            btn.className = 'tm-tab';
            btn.dataset.tab = tabKey;
            btn.textContent = t(`tab_${tabKey}`);
            btn.draggable = true;
            if (tabKey === StorageManager.getLastActiveTab()) btn.classList.add('active'); // アクティブ状態維持
            btn.addEventListener('click', () => switchToTab(panel, tabKey));
            btn.addEventListener('dragstart', (e) => {
                btn.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', tabKey);
            });
            btn.addEventListener('dragend', () => { btn.classList.remove('dragging'); });
            container.appendChild(btn);
        });
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElementHorizontal(container, e.clientX);
            const dragging = document.querySelector('.tm-tab.dragging');
            if (afterElement == null) container.appendChild(dragging); else container.insertBefore(dragging, afterElement);
        });
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const newOrder = [...container.querySelectorAll('.tm-tab')].map(el => el.dataset.tab);
            const currentFullOrder = StorageManager.getTabOrder();
            const hiddenTabs = currentFullOrder.filter(t => !newOrder.includes(t));
            const finalOrder = [...newOrder, ...hiddenTabs];
            StorageManager.setTabOrder(finalOrder);
        });
    }

    function getDragAfterElementHorizontal(container, x) {
        const draggableElements = [...container.querySelectorAll('.tm-tab:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function renderTabVisibilitySettings() {
        const container = document.getElementById('tm-tab-visibility-settings');
        if (!container) return;
        container.innerHTML = '';
        const visibility = StorageManager.getTabVisibility();
        const order = StorageManager.getTabOrder();
        DEFAULT_TAB_ORDER.forEach(def => { if (!order.includes(def)) order.push(def); });
        order.forEach(tabKey => {
            const row = document.createElement('div');
            row.className = 'tm-tab-visibility-item';
            const label = document.createElement('span');
            label.textContent = t(`tab_${tabKey}`);
            label.style.color = '#e0e0e0';
            label.style.fontSize = '13px';
            const toggle = document.createElement('div');
            toggle.className = 'tm-toggle-switch';
            if (visibility[tabKey]) toggle.classList.add('active');
            toggle.addEventListener('click', () => {
                const newVis = !toggle.classList.contains('active');
                if (tabKey === 'settings' && !newVis) {
                    if (!confirm(t('confirm_settings_hidden'))) return;
                }
                if (newVis) toggle.classList.add('active'); else toggle.classList.remove('active');
                const currentVis = StorageManager.getTabVisibility();
                currentVis[tabKey] = newVis;
                StorageManager.setTabVisibility(currentVis);
                const panel = document.querySelector('.tm-panel');
                renderTabs(panel);
            });
            row.appendChild(label); row.appendChild(toggle); container.appendChild(row);
        });
    }

    function initLoginSettings() {
        const toggle = document.getElementById('tm-auto-login-toggle');
        if (!toggle) return;
        if (StorageManager.isAutoLoginEnabled()) toggle.classList.add('active');
        toggle.addEventListener('click', () => {
            const newState = !StorageManager.isAutoLoginEnabled();
            StorageManager.setAutoLoginEnabled(newState);
            toggle.classList.toggle('active', newState);
        });
    }

    function switchToTab(panel, tabName) {
        panel.querySelectorAll('.tm-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.tm-tab-content').forEach(c => c.classList.remove('active'));
        const targetBtn = panel.querySelector(`.tm-tab[data-tab="${tabName}"]`);
        if (targetBtn) targetBtn.classList.add('active');
        const targetContent = document.getElementById(`tm-${tabName}`);
        if (targetContent) targetContent.classList.add('active');
        StorageManager.setLastActiveTab(tabName);
        const restore = () => restoreScrollPosition(panel, tabName);
        if (tabName === 'liked') loadLikedVideos().then(restore);
        else if (tabName === 'history') loadHistory().then(restore);
        else if (tabName === 'playlists') loadPlaylists().then(restore);
        else if (tabName === 'feed') { setupFeedTab(); restore(); } // restoreを追加
        else if (tabName === 'friends') { setupFriendsTab(); restore(); } // restoreを追加
        else restore();
    }

    // ========================================
    // HTML生成 & イベント (既存機能)
    // ========================================
    function generateVideoCard(v, extraButton = '', addedTime = null) {
        const iconSrc = v.authorIcon || 'https://www.tokyomotion.net/img/user-avatar.png';
        const authorLink = v.author ? `/user/${v.author}/videos` : '#';
        const relativeTime = formatRelativeTime(v.date);
        const privateLabel = v.isPrivate ? `<div class="tm-card-private">${t('label_private')}</div>` : '';
        const addedTimeDisplay = addedTime ? `<div class="tm-added-time">${formatDate(addedTime)}</div>` : '';
        return `
            <div class="tm-card" data-url="${v.url}">
                ${extraButton}
                <div class="tm-card-thumb-box">
                    <img src="${v.thumbnail || ''}" class="tm-card-thumb" onerror="this.style.display='none'">
                    ${v.duration ? `<div class="tm-card-duration">${v.duration}</div>` : ''}
                    ${privateLabel}
                </div>
                <div class="tm-card-title">${v.title}</div>
                <div class="tm-card-meta">
                    ${v.author ? `
                    <div class="tm-user-row">
                        <img src="${iconSrc}" class="tm-user-icon" onerror="this.onerror=null;this.src='https://www.tokyomotion.net/img/user-avatar.png'">
                        <a href="${authorLink}" class="tm-user-link" target="_blank">${v.author}</a>
                        ${relativeTime ? `<span class="tm-relative-time">${relativeTime}</span>` : ''}
                    </div>
                    ` : ''}
                    ${addedTimeDisplay}
                </div>
            </div>
        `;
    }

    function attachCardEvents(container) {
        container.querySelectorAll('.tm-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;
                window.location.href = card.dataset.url;
            });
        });
        container.querySelectorAll('.tm-user-link').forEach(link => { link.addEventListener('click', (e) => e.stopPropagation()); });
        container.querySelectorAll('.tm-card-thumb').forEach(img => {
            if (!img.src || !img.src.includes('/media/videos/')) return;
            const baseUrl = img.src.substring(0, img.src.lastIndexOf('/') + 1);
            img.dataset.baseurl = baseUrl;
            img.addEventListener('mousemove', function (e) {
                if (!this.dataset.preloaded) {
                    this.dataset.preloaded = 'true';
                    for (let i = 1; i <= 20; i++) (new Image()).src = `${this.dataset.baseurl}${i}.jpg`;
                }
                const rect = this.getBoundingClientRect(); const x = e.clientX - rect.left;
                let percent = (x / rect.width) * 100; let num = Math.ceil(percent / 5); num = Math.max(1, Math.min(20, num));
                const targetSrc = `${this.dataset.baseurl}${num}.jpg`;
                if (this.src !== targetSrc) this.src = targetSrc;
            });
        });
    }

    async function loadLikedVideos(sortOrder = 'desc') {
        const container = document.getElementById('tm-liked');
        let videos = await StorageManager.getLikedVideos();
        if (videos.length === 0) { container.innerHTML = `<div class="tm-empty">${t('msg_empty_liked')}</div>`; return; }
        videos.sort((a, b) => sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
        container.innerHTML = `
            <div style="margin-bottom:10px; text-align:right;">
                <button class="tm-btn-secondary" id="tm-sort-liked" style="width:auto; padding:4px 8px; font-size:11px;">${sortOrder === 'desc' ? t('btn_sort_new') : t('btn_sort_old')}</button>
            </div>
            <div class="tm-grid-view">
                ${videos.map(v => generateVideoCard(v, `<button class="tm-card-remove" data-remove-liked="${v.id}" title="${t('btn_remove')}">×</button>`, v.timestamp)).join('')}
            </div>
        `;
        document.getElementById('tm-sort-liked').addEventListener('click', (e) => { e.stopPropagation(); loadLikedVideos(sortOrder === 'desc' ? 'asc' : 'desc'); });
        container.querySelectorAll('[data-remove-liked]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(t('confirm_delete_liked'))) { await StorageManager.removeLikedVideo(btn.dataset.removeLiked); loadLikedVideos(sortOrder); }
            });
        });
        attachCardEvents(container);
    }

    async function loadHistory(sortOrder = 'desc') {
        const container = document.getElementById('tm-history');
        let videos = await StorageManager.getHistory();
        if (videos.length === 0) { container.innerHTML = `<div class="tm-empty">${t('msg_empty_history')}</div>`; return; }
        videos.sort((a, b) => sortOrder === 'desc' ? b.watchedAt - a.watchedAt : a.watchedAt - b.watchedAt);
        container.innerHTML = `
            <div style="margin-bottom:10px; text-align:right;">
                <button class="tm-btn-secondary" id="tm-sort-history" style="width:auto; padding:4px 8px; font-size:11px;">${sortOrder === 'desc' ? t('btn_sort_new') : t('btn_sort_old')}</button>
            </div>
            <div class="tm-grid-view">
                ${videos.map(v => generateVideoCard(v, '', v.watchedAt)).join('')}
            </div>
        `;
        document.getElementById('tm-sort-history').addEventListener('click', (e) => { e.stopPropagation(); loadHistory(sortOrder === 'desc' ? 'asc' : 'desc'); });
        attachCardEvents(container);
    }

    async function loadPlaylists() {
        const activeName = StorageManager.getActivePlaylist();
        const playlists = await StorageManager.getPlaylists();
        if (activeName && playlists[activeName]) { showPlaylistDetail(activeName); return; }
        const container = document.getElementById('tm-playlists');
        const names = await StorageManager.getOrderedPlaylistNames();
        const currentCols = StorageManager.getPlaylistGridCols();
        container.innerHTML = `
            <div style="margin-bottom:15px; display:flex; gap:5px; align-items:center;">
                <input type="text" class="tm-input" id="tm-new-playlist-name" placeholder="${t('placeholder_new_playlist')}" style="margin:0; flex:1;">
                <button class="tm-btn-primary" id="tm-create-playlist" style="flex:0 0 60px;">${t('btn_create')}</button>
                <select id="tm-playlist-col-selector" class="tm-col-select" style="margin-left:auto; background:#333;">
                    <option value="1">1${t('stg_col_unit')}</option>
                    <option value="2">2${t('stg_col_unit')}</option>
                    <option value="3">3${t('stg_col_unit')}</option>
                    <option value="4">4${t('stg_col_unit')}</option>
                    <option value="5">5${t('stg_col_unit')}</option>
                </select>
            </div>
            ${names.length === 0 ? `<div class="tm-empty">${t('msg_empty_playlist')}</div>` : `
                <div class="tm-playlist-grid" id="tm-playlist-grid" style="grid-template-columns: repeat(${currentCols}, 1fr);">
                    ${names.map((name) => `
                        <div class="tm-playlist-card" data-playlist="${name}" draggable="true">
                            <button class="tm-playlist-delete" data-delete="${name}">×</button>
                            <div class="tm-playlist-name">${name}</div>
                            <div class="tm-playlist-count">${t('time_videos_count', { count: playlists[name].length })}</div>
                        </div>
                    `).join('')}
                </div>
            `}
        `;
        const colSelector = document.getElementById('tm-playlist-col-selector');
        if (colSelector) {
            colSelector.value = currentCols;
            colSelector.addEventListener('change', (e) => {
                const val = parseInt(e.target.value); StorageManager.setPlaylistGridCols(val); loadPlaylists();
            });
        }
        document.getElementById('tm-create-playlist').addEventListener('click', async (e) => {
            e.stopPropagation();
            const input = document.getElementById('tm-new-playlist-name'); const name = input.value.trim();
            if (!name) return;
            if (await StorageManager.createPlaylist(name)) {
                const order = StorageManager.getPlaylistOrder(); order.push(name); StorageManager.setPlaylistOrder(order); loadPlaylists();
            } else alert(t('alert_exists'));
        });
        document.getElementById('tm-new-playlist-name').addEventListener('click', e => e.stopPropagation());
        container.querySelectorAll('[data-playlist]').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation(); if (!e.target.dataset.delete) showPlaylistDetail(card.dataset.playlist);
            });
            setupDragAndDrop(card, container);
        });
        container.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(t('confirm_delete_playlist', { name: btn.dataset.delete }))) {
                    await StorageManager.deletePlaylist(btn.dataset.delete);
                    const order = StorageManager.getPlaylistOrder().filter(n => n !== btn.dataset.delete);
                    StorageManager.setPlaylistOrder(order); loadPlaylists();
                }
            });
        });
    }

    function setupDragAndDrop(card, container) {
        card.addEventListener('dragstart', (e) => { e.dataTransfer.effectAllowed = 'move'; container.draggedEl = card; card.style.opacity = '0.5'; });
        card.addEventListener('dragend', () => { card.style.opacity = '1'; container.draggedEl = null; });
        card.addEventListener('dragover', (e) => e.preventDefault());
        card.addEventListener('drop', (e) => {
            e.preventDefault(); e.stopPropagation();
            if (container.draggedEl && container.draggedEl !== card) {
                const dragged = container.draggedEl; const target = card; const parent = target.parentNode;
                const temp = document.createTextNode('');
                parent.insertBefore(temp, target); parent.insertBefore(target, dragged); parent.insertBefore(dragged, temp); temp.remove();
                const newOrder = [...container.querySelectorAll('.tm-playlist-card')].map(c => c.dataset.playlist);
                StorageManager.setPlaylistOrder(newOrder);
            }
        });
    }

    async function showPlaylistDetail(name) {
        StorageManager.setActivePlaylist(name);
        const container = document.getElementById('tm-playlists');
        const playlists = await StorageManager.getPlaylists();
        const videos = playlists[name] || [];
        container.innerHTML = `
            <button class="tm-btn-secondary" id="tm-back-to-playlists" style="width:100%;margin-bottom:10px;">${t('btn_back')}</button>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                <h3 style="color:#e0e0e0; margin:0;">${name}</h3>
                <button class="tm-btn-icon" id="tm-rename-playlist" title="${t('btn_rename')}">✏️</button>
            </div>
            ${videos.length === 0 ? `<div class="tm-empty">${t('msg_empty_videos')}</div>` : `
                <div class="tm-grid-view">
                    ${videos.map(v => generateVideoCard(v, `<button class="tm-card-remove" data-remove-from="${v.id}" title="${t('btn_remove')}">×</button>`, v.timestamp)).join('')}
                </div>
            `}
        `;
        document.getElementById('tm-back-to-playlists').addEventListener('click', (e) => { e.stopPropagation(); StorageManager.setActivePlaylist(null); loadPlaylists(); });
        document.getElementById('tm-rename-playlist').addEventListener('click', async (e) => {
            e.stopPropagation();
            const newName = prompt(t('prompt_playlist_name'), name);
            if (newName && newName.trim() && newName !== name) {
                const success = await StorageManager.renamePlaylist(name, newName.trim());
                if (success) showPlaylistDetail(newName.trim()); else alert(t('alert_name_used'));
            }
        });
        container.querySelectorAll('[data-remove-from]').forEach(btn => {
            btn.addEventListener('click', async (e) => { e.stopPropagation(); await StorageManager.removeFromPlaylist(name, btn.dataset.removeFrom); showPlaylistDetail(name); });
        });
        attachCardEvents(container);
    }

    function setupFeedTab() {
        _setupFeedLogic('feed', document.getElementById('tm-feed-update'), document.getElementById('tm-feed-status'), document.getElementById('tm-feed-list'), document.getElementById('tm-feed-time-ago'), document.getElementById('tm-feed-time-absolute'));
    }

    function setupFriendsTab() {
        _setupFeedLogic('friends', document.getElementById('tm-friends-update'), document.getElementById('tm-friends-status'), document.getElementById('tm-friends-list'), document.getElementById('tm-friends-time-ago'), document.getElementById('tm-friends-time-absolute'));
    }

    function _setupFeedLogic(type, btn, status, list, timeAgoEl, timeAbsEl) {
        if (!btn) return;

        // 言語設定に合わせてボタンのテキストを更新
        const labelKey = type === 'feed' ? 'tab_feed' : 'tab_friends';
        btn.textContent = `${t(labelKey)} ${t('btn_update')}`;

        const saved = type === 'feed' ? StorageManager.getFeedData() : StorageManager.getFriendsFeedData();
        const lastUpdated = type === 'feed' ? StorageManager.getFeedLastUpdated() : StorageManager.getFriendsLastUpdated();
        const updateTimeDisplay = (timestamp) => {
            if (timestamp > 0) { timeAgoEl.innerText = calcTimeAgo(timestamp); timeAbsEl.innerText = formatDate(timestamp); }
            else { timeAgoEl.innerText = '-'; timeAbsEl.innerText = '-'; }
        };
        updateTimeDisplay(lastUpdated);
        if (saved.length) {
            const privateIds = saved.filter(v => v.isPrivate).map(v => v.id);
            if (privateIds.length > 0) StorageManager.addPrivateToCache(privateIds);
            renderFeed(saved, list);
        }
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); newBtn.disabled = true; status.innerText = t('msg_fetching');
            try {
                const users = type === 'feed' ? await SubscriptionManager.getFollowedUsers(msg => status.innerText = msg) : await SubscriptionManager.getFriends(msg => status.innerText = msg);
                if (users.length === 0) { status.innerText = t('msg_no_users'); return; }
                status.innerText = t('msg_fetching_users', { count: users.length });
                let allVideos = [], completed = 0;
                const maxPages = type === 'feed' ? StorageManager.getFeedMaxPages() : StorageManager.getFriendsMaxPages();
                for (let i = 0; i < users.length; i += 5) {
                    const chunk = users.slice(i, i + 5);
                    await Promise.all(chunk.map(async u => { try { allVideos.push(...await SubscriptionManager.getUserVideos(u, maxPages)); } catch (e) { } }));
                    completed += chunk.length;
                    status.innerText = t('msg_fetching_progress', { current: Math.min(completed, users.length), total: users.length });
                }
                status.innerText = t('msg_complete', { count: allVideos.length });
                const now = Date.now();
                if (type === 'feed') { StorageManager.setFeedData(allVideos); StorageManager.setFeedLastUpdated(now); }
                else { StorageManager.setFriendsFeedData(allVideos); StorageManager.setFriendsLastUpdated(now); }
                updateTimeDisplay(now); renderFeed(allVideos, list);
            } catch (e) { status.innerText = t('msg_error', { msg: e.message }); } finally { newBtn.disabled = false; }
        });
    }

    function renderFeed(videos, container) {
        if (!videos.length) { container.innerHTML = `<div class="tm-empty">${t('msg_empty_feed')}</div>`; return; }
        const unique = []; const seen = new Set();
        videos.forEach(v => { if (!seen.has(v.id)) { seen.add(v.id); unique.push(v); } });
        unique.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        container.innerHTML = `<div class="tm-grid-view">${unique.map(v => generateVideoCard(v)).join('')}</div>`;
        attachCardEvents(container);
    }

    function setupVideoPage() {
        const videoId = extractVideoId();
        if (!videoId) return;
        let historyRecorded = false;
        const handleVideoElement = (videoEl) => {
            if (videoEl.dataset.tmEnhanced) return;
            videoEl.dataset.tmEnhanced = 'true';
            const recordHistory = () => {
                if (historyRecorded) return;
                if (!videoEl.duration || isNaN(videoEl.duration) || videoEl.duration === Infinity) {
                    const waitForMeta = () => {
                        if (historyRecorded) return;
                        if (videoEl.duration && !isNaN(videoEl.duration) && videoEl.duration !== Infinity) {
                            save(); videoEl.removeEventListener('loadedmetadata', waitForMeta); videoEl.removeEventListener('durationchange', waitForMeta);
                        }
                    };
                    videoEl.addEventListener('loadedmetadata', waitForMeta); videoEl.addEventListener('durationchange', waitForMeta);
                    return;
                }
                save();
            };
            const save = () => {
                let duration = formatSeconds(videoEl.duration); if (!duration) duration = getDurationFromPlayer();
                const videoData = extractVideoData(duration);
                if (videoData) { StorageManager.addToHistory(videoData); historyRecorded = true; }
            };
            videoEl.addEventListener('play', recordHistory);
            videoEl.addEventListener('timeupdate', () => { if (!historyRecorded && videoEl.currentTime > 0.5) recordHistory(); });
        };
        const v = document.querySelector('video'); if (v) handleVideoElement(v);
        new MutationObserver((mutations) => {
            for (const m of mutations) for (const n of m.addedNodes) {
                if (n.tagName === 'VIDEO') handleVideoElement(n);
                if (n.querySelector) { const v = n.querySelector('video'); if (v) handleVideoElement(v); }
            }
        }).observe(document.body, { childList: true, subtree: true });
        setupLikeObserver(videoId);
        injectPlaylistButton(videoId);
    }

    function setupLikeObserver(videoId) {
        const observer = new MutationObserver(() => {
            const likeCountEl = document.querySelector('#video_likes');
            if (likeCountEl && !likeCountEl.dataset.observed) {
                likeCountEl.dataset.observed = 'true';
                let lastCount = parseInt(likeCountEl.innerText) || 0;
                new MutationObserver(() => {
                    const current = parseInt(likeCountEl.innerText);
                    if (current > lastCount) {
                        const data = extractVideoData();
                        if (data) { StorageManager.addLikedVideo(data); showToast(t('msg_saved_liked')); }
                    }
                    lastCount = current;
                }).observe(likeCountEl, { childList: true, characterData: true, subtree: true });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function injectPlaylistButton(videoId) {
        const findTarget = () => {
            const selectors = [`#favorite_video_${videoId}`, `#vote_like_${videoId}`, '.fa-heart', '.fa-thumbs-up', '.fa-share-alt'];
            for (const sel of selectors) { const el = document.querySelector(sel); if (el) return el.closest('a, button') || el; }
            return document.querySelector('.video-actions') || document.querySelector('.video-info .pull-right');
        };
        const attemptInject = () => {
            if (document.querySelector('.tm-playlist-btn-inline')) return true;
            const targetBtn = findTarget();
            if (targetBtn && targetBtn.parentNode) {
                const btn = document.createElement('a');
                const btnClass = targetBtn.tagName === 'BUTTON' ? 'btn btn-default' : (targetBtn.className || 'btn btn-default');
                btn.className = btnClass + ' tm-playlist-btn-inline';
                btn.href = 'javascript:void(0);';
                btn.innerHTML = `<i class="fa fa-folder-open"></i><span style="margin-left:4px;">${t('modal_title')}</span>`;
                btn.title = 'TokyoMotion Enhancer List';
                btn.style.marginLeft = '5px';
                btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openPlaylistModal(videoId); });
                targetBtn.parentNode.insertBefore(btn, targetBtn.nextSibling);
                return true;
            }
            return false;
        };
        if (!attemptInject()) {
            const observer = new MutationObserver((mutations, obs) => { if (attemptInject()) obs.disconnect(); });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 10000);
        }
    }

    async function openPlaylistModal(videoId) {
        const existing = document.querySelector('.tm-modal-overlay'); if (existing) existing.remove();
        const currentDuration = getDurationFromPlayer();
        const videoData = extractVideoData(currentDuration);
        const playlists = await StorageManager.getPlaylists();
        const names = Object.keys(playlists);
        const currentCols = StorageManager.getModalCols();
        const overlay = document.createElement('div');
        overlay.className = 'tm-modal-overlay';
        overlay.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-modal-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>${t('modal_title')}</span>
                        <select id="tm-col-selector" class="tm-col-select" title="Cols">
                            <option value="1">1${t('stg_col_unit')}</option>
                            <option value="2">2${t('stg_col_unit')}</option>
                            <option value="3">3${t('stg_col_unit')}</option>
                            <option value="4">4${t('stg_col_unit')}</option>
                            <option value="5">5${t('stg_col_unit')}</option>
                        </select>
                    </div>
                    <button class="tm-panel-close">×</button>
                </div>
                <div class="tm-playlist-list" style="grid-template-columns: repeat(${currentCols}, 1fr);">
                    ${names.map(name => {
            const checked = playlists[name].some(v => v.id === videoId) ? 'checked' : '';
            return `<label class="tm-playlist-item"><input type="checkbox" data-name="${name}" ${checked}> ${name}</label>`;
        }).join('')}
                </div>
                <div class="tm-modal-footer">
                    <div class="tm-new-playlist-form">
                        <input type="text" class="tm-input" id="tm-modal-new-name" placeholder="${t('placeholder_new_playlist')}" style="margin:0;">
                        <button class="tm-btn-primary" id="tm-modal-create">${t('btn_create')}</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const updateModalSize = (cols) => {
            const content = overlay.querySelector('.tm-modal-content');
            const list = overlay.querySelector('.tm-playlist-list');
            list.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            let width = 320;
            if (cols === 2) width = 450; if (cols === 3) width = 600; if (cols === 4) width = 750; if (cols === 5) width = 900;
            content.style.width = `${width}px`;
        };
        updateModalSize(currentCols);
        overlay.querySelector('#tm-col-selector').value = currentCols;
        overlay.querySelector('.tm-panel-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        overlay.querySelector('#tm-col-selector').addEventListener('change', (e) => {
            const val = parseInt(e.target.value); StorageManager.setModalCols(val); updateModalSize(val);
        });
        overlay.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', async (e) => {
                const name = e.target.dataset.name;
                if (e.target.checked) { await StorageManager.addToPlaylist(name, videoData); showToast(t('msg_added_to', { name })); }
                else { await StorageManager.removeFromPlaylist(name, videoId); showToast(t('msg_removed_from', { name })); }
            });
        });
        overlay.querySelector('#tm-modal-create').addEventListener('click', async () => {
            const name = overlay.querySelector('#tm-modal-new-name').value.trim();
            if (name && await StorageManager.createPlaylist(name)) {
                await StorageManager.addToPlaylist(name, videoData); showToast(t('msg_created_added', { name })); overlay.remove();
            }
        });
    }

    function attemptAutoLogin() {
        if (!StorageManager.isAutoLoginEnabled()) return;
        const loginLink = document.querySelector('a[href="#login-modal"]'); if (!loginLink) return;
        const modal = document.getElementById('login-modal');
        if (!(modal && (modal.style.display === 'block' || modal.classList.contains('in')))) loginLink.click();
        let attempts = 0;
        const interval = setInterval(() => {
            const user = document.getElementById('login_username'); const pass = document.getElementById('login_password'); const btn = document.getElementById('login_submit');
            if (user && pass && btn) {
                if (!user.value && document.activeElement !== user) { user.focus(); user.click(); }
                else if (user.value && !pass.value && document.activeElement !== pass) { pass.focus(); pass.click(); }
                if (user.value && pass.value) { clearInterval(interval); showToast(t('msg_auto_login')); btn.click(); }
            }
            if (++attempts > 50) clearInterval(interval);
        }, 100);
    }

    function exportData() {
        const data = {
            liked: GM_getValue('likedVideos', []),
            history: GM_getValue('history', []),
            playlists: GM_getValue('playlists', {}),
            playlistOrder: GM_getValue('playlistOrder', []),
            settings: {
                defaultTab: GM_getValue('defaultTab', 'liked'),
                autoLogin: GM_getValue('autoLoginEnabled', false),
                tabOrder: GM_getValue('tabOrder', DEFAULT_TAB_ORDER),
                tabVisibility: GM_getValue('tabVisibility', {}),
                panelState: GM_getValue('panelState', null),
                btnPosition: GM_getValue('btnPosition', null)
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `tokyomotion_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click(); URL.revokeObjectURL(url);
    }

    function importData() {
        const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (confirm(t('confirm_overwrite'))) {
                        if (data.liked) GM_setValue('likedVideos', data.liked);
                        if (data.history) GM_setValue('history', data.history);
                        if (data.playlists) GM_setValue('playlists', data.playlists);
                        if (data.playlistOrder) GM_setValue('playlistOrder', data.playlistOrder);
                        if (data.settings) {
                            GM_setValue('defaultTab', data.settings.defaultTab);
                            GM_setValue('autoLoginEnabled', data.settings.autoLogin);
                            if (data.settings.tabOrder) GM_setValue('tabOrder', data.settings.tabOrder);
                            if (data.settings.tabVisibility) GM_setValue('tabVisibility', data.settings.tabVisibility);
                            if (data.settings.panelState) GM_setValue('panelState', data.settings.panelState);
                            if (data.settings.btnPosition) GM_setValue('btnPosition', data.settings.btnPosition);
                        }
                        alert(t('msg_import_done')); location.reload();
                    }
                } catch (err) { alert(t('msg_import_error', { msg: err })); }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function clearAllData() {
        if (confirm(t('confirm_clear_all'))) {
            GM_setValue('likedVideos', []); GM_setValue('history', []); GM_setValue('playlists', {}); GM_setValue('feedData', []); GM_setValue('friendsFeedData', []);
            alert(t('msg_data_cleared')); location.reload();
        }
    }

    function applyVideoGridCols() {
        const cols = StorageManager.getVideoGridCols();
        document.documentElement.style.setProperty('--tm-video-cols', cols);
    }

    function init() {
        if (window.self !== window.top) return;

        // 終了時間の記録
        window.addEventListener('beforeunload', () => {
            StorageManager.setLastClosedTime(Date.now());
        });

        // 起動時のリセットチェック
        const lastClosed = StorageManager.getLastClosedTime();
        if (lastClosed > 0) {
            const diff = Date.now() - lastClosed;
            const threshold = getScrollResetMs();
            if (diff > threshold) {
                // リセット対象のデータをクリア
                const tabsToReset = ['liked', 'history', 'playlists', 'feed', 'friends'];
                tabsToReset.forEach(tab => {
                    StorageManager.setTabScroll(tab, 0);
                });
                StorageManager.setActivePlaylist(null);

                // 次回起動時にリセット通知を出すためのフラグを立てる（オプション）
                // 今回は単純にすべてのタブスクロールを0にするため、UI生成時にそれが反映されるはず
                // ただし、パネルがまだ生成されていないので、パネル生成後に適用される必要がある。
                // restoreScrollPosition はパネル生成後に呼ばれるので、ここで値を0にしておけば0が復元される。

                // 通知はDOMがないので出せないが、コンソールに出しておく
                console.log(`[TokyoMotion Enhancer] Startup scroll reset triggered. (Closed for ${diff}ms > ${threshold}ms)`);
                // DOMが準備できているはずなので通知を試みる
                if (document.body) {
                    setTimeout(() => showToast(t('msg_scroll_reset')), 500); // UI描画と被らないよう少し遅延
                } else {
                    document.addEventListener('DOMContentLoaded', () => setTimeout(() => showToast(t('msg_scroll_reset')), 500));
                }
            }
        }

        createMainUI();
        if (location.pathname.startsWith('/video/')) setupVideoPage();
        if (StorageManager.isAutoLoginEnabled()) {
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attemptAutoLogin);
            else attemptAutoLogin();
        }
        PrivateScanner.startObserver();
    }

    init();
})();
