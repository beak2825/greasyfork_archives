// ==UserScript==
// @name nhentai Pro
// @name:en nhentai Pro
// @namespace https://github.com/abilatte
// @version 2.6.8
// @description 标签搜索辅助、全站汉化与语言过滤功能：智能模糊搜索、自定义快捷标签、语言筛选、悬停预览
// @description:en Tag search assistance, full-site translation, and language filtering.
// @author abilatte
// @match https://nhentai.net/*
// @icon https://nhentai.net/favicon.ico
// @connect raw.githubusercontent.com
// @connect i.nhentai.net
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/554409/nhentai%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/554409/nhentai%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_CONFIG = {
        enableTranslation: true,
        enableSuggestions: true,
        enableQuickTags: true,
        showPageSettingsButton: true,
        showLangDropDown: true,
        showPageNumbers: true,
        enableHoverPreview: true,
        translationMode: 'append',
        langFilter: [],
        updateInterval: 7 * 24 * 60 * 60 * 1000,
        settingsLanguage: 'zh',
        quickTagsSettings: {
            'parodies': true,
            'characters': true,
            'tags': true,
            'artists': true,
            'groups': true,
            'languages': true,
            'pages': true
        }
    };

    const Config = {
        settings: {},
        load() {
            const stored = GM_getValue('user_settings', '{}');
            let parsed = {};
            try {
                parsed = JSON.parse(stored);
            } catch (e) {}
            this.settings = {
                ...DEFAULT_CONFIG,
                ...parsed
            };
            this.settings.quickTagsSettings = {
                ...DEFAULT_CONFIG.quickTagsSettings,
                ...(parsed.quickTagsSettings || {})
            };
            if (!this.settings.translationMode) this.settings.translationMode = 'append';

            if (typeof this.settings.langFilter === 'string') {
                this.settings.langFilter = [this.settings.langFilter];
            }
            if (!Array.isArray(this.settings.langFilter)) {
                this.settings.langFilter = [];
            }
            if (this.settings.langFilter.includes('0')) {
                this.settings.langFilter = [];
            }

            if (typeof this.settings.showPageSettingsButton === 'undefined') {
                this.settings.showPageSettingsButton = true;
            }
            if (typeof this.settings.showLangDropDown === 'undefined') {
                this.settings.showLangDropDown = true;
            }
            if (typeof this.settings.showPageNumbers === 'undefined') {
                this.settings.showPageNumbers = true;
            }
            if (typeof this.settings.enableHoverPreview === 'undefined') {
                this.settings.enableHoverPreview = true;
            }
        },
        save() {
            GM_setValue('user_settings', JSON.stringify(this.settings));
        },
        get(key) {
            return this.settings[key];
        },
        set(key, val) {
            this.settings[key] = val;
            this.save();
        }
    };
    Config.load();

    const REPO_BASE = 'https://raw.githubusercontent.com/abilatte/nhentaiTags/main';
    const DB_VERSION = 4;

    const Dict = {
        Nav: {
            "Login": "登录",
            "Register": "注册",
            "Log out": "注销",
            "Log Out": "注销",
            "Profile": "个人资料",
            "Settings": "设置",
            "Favorites": "收藏",
            "New Uploads": "最新上传",
            "Popular Now": "当前热门",
            "Uploaded": "上传时间",
            "Popular": "热门"
        },
        Meta: {
            "Title": "标题",
            "Artists": "作者",
            "Artist": "作者",
            "Tags": "标签",
            "Tag": "标签",
            "tags": "标签",
            "Languages": "语言",
            "Language": "语言",
            "Pages": "页数",
            "Groups": "社团",
            "Group": "社团",
            "Categories": "分类",
            "Parodies": "原作",
            "Parody": "原作",
            "Characters": "角色",
            "Character": "角色",
            "Info": "介绍信息",
            "Blacklist": "黑名单",
            "Joined": "注册时间",
            "Username": "用户名",
            "Email": "邮箱",
            "Avatar": "头像",
            "avatar": "头像",
            "About": "关于",
            "Theme": "主题"
        },
        Action: {
            "Favorite": "收藏",
            "Unfavorite": "取消收藏",
            "Download": "下载",
            "Remove": "移除",
            "Confirm": "确认",
            "Save": "保存",
            "Delete Account": "删除账号",
            "Submit": "提交",
            "Cancel": "取消",
            "Sort by": "排序方式",
            "Reset": "重置",
            "Apply": "应用",
            "Show All": "显示全部",
            "Show More": "显示更多",
            "Post New Comment": "发布新评论"
        },
        General: {
            "today": "今天",
            "week": "本周",
            "month": "本月",
            "all time": "全部时间",
            "Recent": "最新的",
            "Newest First": "最新优先",
            "Old Password": "旧密码",
            "New Password": "新密码",
            "Forgot password?": "忘记密码？",
            "Random": "随机",
            "Doujinshi": "同人志",
            "Manga": "漫画",
            "Artist CG": "画师CG",
            "Game CG": "游戏CG",
            "Western": "西方",
            "Non-H": "一般向",
            "Image Set": "图集",
            "Cosplay": "Cosplay",
            "Asian Porn": "亚洲色情",
            "Misc": "杂项",
            "Popular": "热门",
            "Popular:": "热门："
        },
        SiteUI: {
            "Username": "用户名",
            "Email": "邮箱",
            "Avatar": "头像",
            "About": "介绍",
            "Favorite Tags": "喜欢的标签",
            "Theme": "主题",
            "Old Password": "旧密码",
            "New Password": "新密码",
            "Confirm": "确认密码",
            "Save Settings": "保存设置",
            "Delete Account": "删除账号",
            "Light": "浅色",
            "Dark": "黑色",
            "Blue": "蓝色",
            "Username (or Email)": "用户名 (或邮箱)",
            "Password": "密码",
            "Remember me": "记住我",
            "Lost password?": "忘记密码？",
            "Don't have an account?": "没有账号？",
            "Already have an account?": "已有账号？",
            "Abandon all hope, ye who enter here": "放弃一切希望，进入这里",
            "Download Torrent": "下载种子",
            "Show all": "显示全部",
            "More like this": "相似推荐",
            "Are you sure you want to log out?": "真的要注销吗？",
            "No, take me back": "不，回到之前的页面",
            "No, take me back.": "不，回到之前的页面。",
            "Recent Favorites": "最近收藏",
            "Recent Comments": "最近评论"
        }
    };

    const uiTranslations = {
        ...Dict.Nav,
        ...Dict.Meta,
        ...Dict.Action,
        ...Dict.General,
        ...Dict.SiteUI
    };

    const mapTagHeaders = {
        'Parodies': 'parody',
        '原作': 'parody',
        'Characters': 'character',
        '角色': 'character',
        'Tags': 'tag',
        '标签': 'tag',
        'Artists': 'artist',
        '作者': 'artist',
        '艺术家': 'artist',
        'Groups': 'group',
        '社团': 'group',
        'Languages': 'language',
        '语言': 'language',
        'Categories': 'tag',
        '分类': 'tag',
        'Pages': 'pages',
        '页数': 'pages'
    };

    const mapMenu = {
        'Random': '随机',
        'Tags': '标签',
        'Artists': '作者',
        'Characters': '角色',
        'Parodies': '原作',
        'Groups': '社团',
        'Info': '关于',
        'Favorites': '收藏',
        'Log out': '注销'
    };

    const NS_PLURAL_MAP = {
        'tag': 'tags',
        'artist': 'artists',
        'group': 'groups',
        'parody': 'parodies',
        'character': 'characters',
        'language': 'languages'
    };

    const LANG_IDS = {
        ALL: '0',
        CHINESE: '29963',
        ENGLISH: '12227',
        JAPANESE: '6346'
    };

    const LANG_LABELS = {
        '29963': 'CN',
        '12227': 'EN',
        '6346': 'JP'
    };

    const TOKEN_REGEX = /(-?)([a-zA-Z0-9_]+):("[^"]*"|[^"\s]+)|("[^"]*"|[^"\s]+)/g;

    const EXT_MAP = { 'j': 'jpg', 'p': 'png', 'g': 'gif', 'w': 'webp' };
    const cache = new Map();
    const states = new Map();
    let hoveredGallery = null;
    let hoverTimeout = null;

    const Styles = {
        base: `
        .nh-helper-suggestion-box { position: absolute; background: #1f1f1f; border: 1px solid #333; border-top: none; font-size: 14px; color: #f1f1f1; z-index: 1001; width: 100%; max-height: 300px; overflow-y: auto; box-shadow: 0 8px 16px rgba(0,0,0,0.6); border-radius: 0 0 5px 5px; }
        .nh-helper-suggestion-box::-webkit-scrollbar { width: 6px; }
        .nh-helper-suggestion-box::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .nh-helper-suggestion-item { padding: 6px 12px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px solid #252525; display: flex; align-items: center; transition: background-color 0.1s; }
        .nh-helper-suggestion-item:hover, .nh-helper-suggestion-item.active { background-color: #ed2553; color: #fff; }
        body.nh-shift-pressed .nh-helper-suggestion-item:hover, body.nh-shift-pressed .nh-helper-suggestion-item.active { background-color: #d92020; }
        body.nh-shift-pressed .nh-helper-suggestion-item:hover::after { content: " (排除)"; font-size: 10px; margin-left: auto; opacity: 0.8; }
        .nh-helper-loading { padding: 10px; text-align: center; color: #888; font-style: italic; }
        .nh-helper-suggestion-item .type-badge { display: inline-block; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: #333; color: #aaa; margin-right: 10px; width: 70px; text-align: center; text-transform: uppercase; flex-shrink: 0; }
        .nh-helper-suggestion-item:hover .type-badge, .nh-helper-suggestion-item.active .type-badge { background: rgba(0,0,0,0.2); color: #fff; }
        .nh-helper-suggestion-item .content-wrapper { flex-grow: 1; overflow: hidden; text-overflow: ellipsis; }
        .nh-helper-suggestion-item .meta { font-size: 12px; opacity: 0.6; margin-left: 8px; }
        .nh-helper-suggestion-item:hover .meta { opacity: 0.9; color: #eee; }

        #nh-helper-quick-tags { display: none; position: absolute; top: 100%; left: 0; right: 0; z-index: 1000; background-color: #1f1f1f; border: 1px solid #333; border-top: none; box-shadow: 0 4px 8px rgba(0,0,0,0.5); border-radius: 0 0 5px 5px; gap: 8px; flex-wrap: wrap; padding: 8px; animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .nh-helper-tag-btn { padding: 5px 12px; font-size: 12px; background: #2b2b2b; border: 1px solid #3e3e3e; border-radius: 15px; cursor: pointer; color: #bbb; transition: all 0.2s; }
        .nh-helper-tag-btn:hover { background: #ed2553; border-color: #ed2553; color: #fff; }
        body.nh-shift-pressed .nh-helper-tag-btn:hover { background: #d92020; border-color: #d92020; }
        body.nh-shift-pressed .nh-helper-tag-btn:hover::after { content: " (-)"; }

        .nh-translated-tag { font-size: 90%; color: #aaa; margin-left: 4px; }
        .nh-original-tag { font-size: 90%; color: #aaa; margin-left: 4px; }
        .tag:hover .nh-translated-tag, .tag:hover .nh-original-tag { color: rgba(255,255,255,0.8); }
        #nh-db-status { font-size: 12px; color: #ed2553; margin-left: 10px; display: inline-block; }

        #nh-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
        #nh-settings-modal { background: #1f1f1f; width: 450px; padding: 20px; border-radius: 8px; border: 1px solid #333; box-shadow: 0 10px 25px rgba(0,0,0,0.8); color: #f1f1f1; font-family: sans-serif; max-height: 85vh; overflow-y: auto; }
        #nh-settings-modal h3 { margin-top: 0; border-bottom: none; padding-bottom: 0; color: #ed2553; }
        .nh-setting-item { display: flex; justify-content: space-between; align-items: flex-start; margin: 15px 0; }
        .nh-setting-content { text-align: left; display: flex; flex-direction: column; align-items: flex-start; max-width: 300px; }
        .nh-setting-label { font-size: 14px; }
        .nh-setting-sub-group { margin-left: 10px; padding: 10px; background: #252525; border-radius: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .nh-setting-sub-item { display: flex; align-items: center; font-size: 13px; color: #ccc; }
        .nh-setting-sub-item input { margin-right: 6px; }
        .nh-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .nh-switch input { opacity: 0; width: 0; height: 0; }
        .nh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .4s; border-radius: 20px; }
        .nh-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .nh-slider { background-color: #ed2553; }
        input:checked + .nh-slider:before { transform: translateX(20px); }
        .nh-select { background: #2b2b2b; color: #f1f1f1; border: 1px solid #333; padding: 4px 8px; border-radius: 4px; outline: none; }
        .nh-select:focus { border-color: #ed2553; }
        .nh-settings-actions { margin-top: 20px; text-align: right; border-top: 1px solid #333; padding-top: 15px; }
        .nh-btn { padding: 6px 15px; border-radius: 4px; border: none; cursor: pointer; font-size: 13px; font-weight: bold; }
        .nh-btn-primary { background: #ed2553; color: white; margin-left: 10px; }
        .nh-btn-primary:hover { background: #c01c42; }
        .nh-btn-secondary { background: #333; color: #ccc; }
        .nh-btn-secondary:hover { background: #444; color: #fff; }

        #nh-web-settings-btn { display: inline-block; vertical-align: middle; }
        ul.menu.left { display: flex !important; flex-wrap: nowrap !important; align-items: center !important; float: left; height: 45px; }
        ul.menu.left > li { display: flex; align-items: center; height: 100%; }
        #nh-web-settings-btn a { display: flex; align-items: center; height: 100%; color: rgb(217, 217, 217); text-decoration: none; font-weight: bold; padding: 0 15px; transition: color 0.2s; }
        #nh-web-settings-btn a:hover { color: #f1f1f1; }
        #nh-web-settings-btn i { margin-right: 5px; font-size: 14px; }

        .nh-lang-container { position: relative; margin-left: 10px; margin-right: 5px; z-index: 1002; }
        .nh-lang-btn { background-color: #222; color: rgb(217, 217, 217); border: 1px solid #333; border-radius: 4px; padding: 5px 10px; font-size: 13px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: space-between; min-width: 90px; transition: all 0.2s; }
        .nh-lang-btn:hover, .nh-lang-btn.active { background-color: #2f2f2f; border-color: #ed2553; color: #fff; }
        .nh-lang-arrow { margin-left: 8px; font-size: 10px; color: #ed2553; }
        .nh-lang-menu { position: absolute; top: 100%; right: 0; margin-top: 5px; background-color: #1f1f1f; border: 1px solid #333; border-radius: 4px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: none; flex-direction: column; min-width: 120px; overflow: hidden; }
        .nh-lang-menu.show { display: flex; }
        .nh-lang-item { padding: 8px 12px; cursor: pointer; display: flex; align-items: center; color: #ccc; font-size: 13px; transition: background 0.1s; user-select: none; }
        .nh-lang-item:hover { background-color: #2f2f2f; color: #fff; }
        .nh-lang-item.selected { color: #ed2553; font-weight: bold; background-color: rgba(237, 37, 83, 0.1); }
        .nh-lang-checkbox { width: 14px; height: 14px; border: 1px solid #555; border-radius: 2px; margin-right: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.1s; }
        .nh-lang-item.selected .nh-lang-checkbox { background-color: #ed2553; border-color: #ed2553; }
        .nh-lang-item.selected .nh-lang-checkbox::after { content: "✓"; color: #fff; font-size: 10px; line-height: 1; }
        .nh-helper-hidden { display: none !important; }
        .nh-page-number { position: absolute; top: 5px; right: 5px; background-color: rgba(0,0,0,0.6); color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; z-index: 10; pointer-events: none; }

        /* Tabs & Modern Modal Styles */
        .nh-modal-header { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 10px; margin-bottom: 10px; }
        .nh-modal-header h3 { margin: 0; color: #ed2553; }
        .nh-modal-header .version { font-size: 12px; color: #666; }

        .nh-tabs { display: flex; border-bottom: 1px solid #333; margin-bottom: 20px; }
        .nh-tab-btn { flex: 1; padding: 10px; background: transparent; border: none; color: #888; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; font-weight: bold; font-size: 14px; }
        .nh-tab-btn:hover { color: #ccc; background: rgba(255,255,255,0.02); }
        .nh-tab-btn.active { color: #ed2553; border-bottom-color: #ed2553; background: rgba(237, 37, 83, 0.05); }

        .nh-tab-content { display: none; animation: fadeIn 0.2s; }
        .nh-tab-content.active { display: block; }

        .nh-setting-group-title { color: #ed2553; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; margin-top: 20px; letter-spacing: 0.5px; }
        .nh-setting-group-title:first-child { margin-top: 0; }
        .nh-info-text { font-size: 12px; color: #666; margin-top: 4px; }

        /* Preview Feature Styles */
        .gallery.is-previewing .cover { padding-bottom: 0 !important; height: auto !important; display: flex; flex-direction: column; }
        .gallery.is-previewing .cover img { position: relative !important; height: auto !important; width: 100% !important; max-height: none !important; object-fit: contain; }
        .inline-preview-ui { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; }
        .gallery:hover .inline-preview-ui, .gallery.is-previewing .inline-preview-ui { display: block; }
        .gallery { vertical-align: top !important; }
        .hotzone { position: absolute; top: 0; height: calc(100% - 15px); width: 40%; cursor: default; z-index: 20; }
        .hotzone-left { left: 0; } .hotzone-right { right: 0; }
        .seek-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 20px; z-index: 40; cursor: pointer; display: flex; align-items: flex-end; }
        .seek-bg { width: 100%; height: 3px; background: rgba(255,255,255,0.2); transition: height 0.1s; position: relative; backdrop-filter: blur(2px); }
        .seek-container:hover .seek-bg { height: 15px; background: rgba(255,255,255,0.3); }
        .seek-fill { height: 100%; background: #ed2553; width: 0%; transition: width 0.1s; }
        .seek-tooltip { position: absolute; bottom: 17px; transform: translateX(-50%); background: #ed2553; color: #fff; font-size: 10px; padding: 2px 4px; border-radius: .3em; opacity: 0; pointer-events: none; white-space: nowrap; font-weight: bold; transition: opacity 0.1s; }
        .seek-container:hover .seek-tooltip { opacity: 1; }
        .tag-trigger { position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,0.6); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: .3em; cursor: help; z-index: 50; font-family: sans-serif; opacity: 0.7; border: 1px solid rgba(255,255,255,0.2); transition: all 0.2s; }
        .tag-trigger:hover { opacity: 1; background: #ed2553; border-color: #ed2553; }
        .tag-popup { display: none; position: absolute; top: 25px; left: 5px; width: 215px; max-height: 250px; overflow-y: auto; background: rgba(15,15,15,0.95); color: #ddd; border: 1px solid #333; border-radius: .3em; padding: 8px; font-size: 11px; z-index: 60; box-shadow: 0 4px 10px rgba(0,0,0,0.5); text-align: left; line-height: 1.4; }
        .tag-trigger:hover + .tag-popup, .tag-popup:hover { display: block; }
        .tag-category { color: #ed2553; font-weight: bold; margin-bottom: 2px; margin-top: 6px; font-size: 10px; text-transform: uppercase; }
        .tag-category:first-child { margin-top: 0; }
        .tag-pill { display: inline-block; transition: all 0.2s; background: #333; padding: 1px 4px; margin: 1px; border-radius: .3em; color: #ccc; }

        @media (max-width: 900px) {
            ul.menu.left { flex-wrap: wrap !important; height: auto !important; justify-content: center; }
            #nh-web-settings-btn a { padding: 0 5px; }
            .nh-lang-container { margin-left: 5px; }
            .nh-lang-btn { min-width: auto; padding: 5px; }
            #nh-lang-label { display: none; }
            .nh-lang-arrow { margin-left: 0; }
        }
    `,
        inject() {
            if (typeof GM_addStyle !== 'undefined') GM_addStyle(this.base);
            else {
                const styleEl = document.createElement('style');
                styleEl.textContent = this.base;
                document.head.appendChild(styleEl);
            }
        }
    };

    const IDB_Helper = {
        dbName: 'nh_helper_db',
        storeName: 'keyval',
        dbPromise: null,
        open() {
            if (this.dbPromise) return this.dbPromise;
            this.dbPromise = new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, 1);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) db.createObjectStore(this.storeName);
                };
                request.onsuccess = (e) => resolve(e.target.result);
                request.onerror = (e) => reject(e);
            });
            return this.dbPromise;
        },
        async get(key) {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readonly');
                const req = tx.objectStore(this.storeName).get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        },
        async set(key, value) {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                const req = tx.objectStore(this.storeName).put(value, key);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        },
        async delete(key) {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                const req = tx.objectStore(this.storeName).delete(key);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        }
    };

    const DB = {
        data: {},
        cnToItem: {},
        indexReady: false,
        worker: null,
        pendingSearches: new Map(),
        searchId: 0,
        async init() {
            GM_registerMenuCommand("强制更新汉化数据库", () => this.update(true));
            const meta = (await IDB_Helper.get('db_meta')) || {
                lastUpdate: 0,
                version: 0
            };
            const now = Date.now();
            let idbData = await IDB_Helper.get('tag_db');
            if (!idbData) {
                const legacyData = GM_getValue('tag_db', null);
                if (legacyData) {
                    try {
                        idbData = JSON.parse(legacyData);
                        await IDB_Helper.set('tag_db', idbData);
                        await IDB_Helper.set('db_meta', {
                            lastUpdate: GM_getValue('last_update', now),
                            version: GM_getValue('db_version', DB_VERSION)
                        });
                        GM_deleteValue('tag_db');
                    } catch (e) {}
                }
            }
            if (!idbData || (now - meta.lastUpdate > Config.get('updateInterval')) || meta.version < DB_VERSION) {
                await this.update();
            } else {
                this.data = idbData;
                runContentTranslation();
                this.initWorker();
            }
        },
        async update(force = false) {
            const form = document.querySelector('form[action="/search/"]');
            let status = document.getElementById('nh-db-status');
            if (form && !status) {
                status = document.createElement('span');
                status.id = 'nh-db-status';
                form.appendChild(status);
            }
            if (status) status.textContent = '正在下载汉化词库...';
            const sources = [{
                ns: 'artist',
                url: `${REPO_BASE}/Artists_all.md`
            }, {
                ns: 'group',
                url: `${REPO_BASE}/Groups_all.md`
            }, {
                ns: 'character',
                url: `${REPO_BASE}/Characters_all.md`
            }, {
                ns: 'parody',
                url: `${REPO_BASE}/Parodies_all.md`
            }, {
                ns: 'language',
                url: `${REPO_BASE}/Languages_all.md`
            }, {
                ns: 'tag',
                url: `${REPO_BASE}/Tags_all.md`
            }];
            const newData = {
                tag: {},
                artist: {},
                group: {},
                parody: {},
                character: {},
                language: {}
            };
            try {
                const promises = sources.map(src => this.fetchAndParse(src.url, src.ns));
                const results = await Promise.all(promises);
                results.forEach(res => {
                    if (newData[res.ns]) Object.assign(newData[res.ns], res.data);
                    else newData[res.ns] = res.data;
                });
                const commonLangs = ['chinese', 'japanese', 'english'];
                commonLangs.forEach(lang => {
                    if (newData.tag[lang]) delete newData.tag[lang];
                });
                await IDB_Helper.set('tag_db', newData);
                await IDB_Helper.set('db_meta', {
                    lastUpdate: Date.now(),
                    version: DB_VERSION
                });
                this.data = newData;
                this.indexReady = false;
                if (status) {
                    status.textContent = '更新完成!';
                    setTimeout(() => status.remove(), 2000);
                }
                runContentTranslation();
                if (this.worker) this.worker.terminate();
                this.initWorker();
                if (force) location.reload();
            } catch (e) {
                console.error(e);
                if (status) status.textContent = '更新失败';
            }
        },
        fetchAndParse(url, ns) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url + '?t=' + Date.now(),
                    onload: (response) => {
                        const data = {};
                        const regex = /^\| ([^|]+) \| ([^|]+) \|/gm;
                        let match;
                        while ((match = regex.exec(response.responseText)) !== null) {
                            const en = match[1].trim().toLowerCase();
                            const cn = match[2].trim();
                            if (cn !== '-' && cn !== '' && en && !en.includes('tag (') && en !== 'name') {
                                data[en] = cn;
                            }
                        }
                        resolve({ ns, data });
                    },
                    onerror: () => resolve({ ns, data: {} })
                });
            });
        },
        initWorker() {
            if (this.indexReady) return;
            const workerScript = `
            let index = { all: [] };
            const NS_PLURAL_MAP = {
                'tag': 'tags',
                'artist': 'artists',
                'group': 'groups',
                'parody': 'parodies',
                'character': 'characters',
                'language': 'languages'
            };

            self.onmessage = function(e) {
                const msg = e.data;
                if (msg.type === 'init') {
                    const rawData = msg.data;
                    index = { all: [] };
                    const nsDisplayMap = { 'tag': 'TAG', 'artist': 'ARTIST', 'group': 'GROUP', 'parody': 'PARODY', 'character': 'CHAR', 'language': 'LANG' };

                    for (const ns of Object.keys(rawData)) {
                        index[ns] = []; // Init namespace bucket
                        const map = rawData[ns];
                        const nsBadge = nsDisplayMap[ns] || ns.toUpperCase();

                        for (const en in map) {
                            if (ns === 'tag' && ['chinese', 'english', 'japanese'].includes(en)) continue;
                            const cn = map[en];
                            const contentHtml = cn ? en + ' <span class="meta">' + cn + '</span>' : en;
                            const fullHtml = '<span class="type-badge">' + nsBadge + '</span><span class="content-wrapper">' + contentHtml + '</span>';

                            const item = { term: en, display: fullHtml, value: en, namespace: ns, cn: cn };
                            index.all.push(item);
                            index[ns].push(item);

                            if (cn) {
                                const cnFullHtml = '<span class="type-badge">' + nsBadge + '</span><span class="content-wrapper">' + cn + ' <span class="meta">' + en + '</span></span>';
                                const cnItem = { term: cn.toLowerCase(), display: cnFullHtml, value: en, namespace: ns, isCnInput: true };
                                index.all.push(cnItem);
                                index[ns].push(cnItem);
                            }
                        }
                    }
                    self.postMessage({ type: 'initReady', cnToItem: {} }); // cnToItem handled in main thread or not needed here anymore
                } else if (msg.type === 'search') {
                    const { id, query } = msg;
                    const results = getSuggestions(query);
                    self.postMessage({ type: 'searchResult', id, results });
                }
            };

            function getSuggestions(inputStr) {
                const tokens = inputStr.match(/(-?[a-zA-Z0-9_]+:"[^"]*"|"[^"]*"|[^"\\s]+)/g) || [];
                if (inputStr.trim() === '' || (inputStr.endsWith(' ') && tokens.length > 0 && inputStr.slice(inputStr.lastIndexOf(tokens[tokens.length - 1])).trim() === tokens[tokens.length - 1] && tokens[tokens.length - 1].endsWith('"'))) {
                    return [];
                }
                const words = inputStr.trim().split(/\\s+/);
                if (words.length === 0) return [];

                const matches = [];
                const maxLookBack = 4;

                // Only look at the last "word" chunk for suggestion
                for (let i = Math.min(words.length, maxLookBack); i >= 1; i--) {
                    const slice = words.slice(-i).join(' ');
                    let searchNs = null;
                    let searchTerm = slice;
                    let prefix = '';

                    const nsMatch = slice.match(/^(-?)([a-zA-Z0-9_]+):(.*)/);
                    if (nsMatch) {
                        prefix = nsMatch[1] + nsMatch[2] + ':';
                        searchNs = nsMatch[2];
                        if (searchNs.endsWith('s')) searchNs = searchNs.slice(0, -1);
                        searchTerm = nsMatch[3];
                    }

                    const cleanTerm = searchTerm.replace(/^"|"$/g, '').toLowerCase();
                    if (cleanTerm.length < 1) continue;

                    // SELECT THE RIGHT BUCKET
                    let targetIndex = index.all;
                    if (searchNs && index[searchNs]) {
                        targetIndex = index[searchNs];
                    } else if (searchNs) {
                         // Namespace exists but not in our DB (e.g. pages:), skip search or return empty
                         continue;
                    }

                    const tempResults = [];
                    for (let k = 0, len = targetIndex.length; k < len; k++) {
                        const item = targetIndex[k];
                        // If specific NS requested, strict check is implicit by bucket selection
                        // but if using 'all', we don't filter to allow global search

                        let score = 0;
                        const itemTerm = item.term;

                        if (itemTerm === cleanTerm) score = 100;
                        else if (itemTerm.startsWith(cleanTerm)) score = 80;
                        else if (itemTerm.includes(cleanTerm)) score = 50;

                        if (score > 0) {
                            score -= (itemTerm.length - cleanTerm.length) * 0.5;
                            if (i > 1) score += 20 * i;
                            score += cleanTerm.length * 2;
                            tempResults.push({
                                item,
                                score,
                                originalMatch: slice,
                                nsPrefix: prefix
                            });
                        }
                    }
                    tempResults.sort((a, b) => b.score - a.score);
                    matches.push(...tempResults.slice(0, 20));
                }

                const uniqueMap = new Map();
                matches.sort((a, b) => b.score - a.score);
                matches.forEach(m => {
                    if (!uniqueMap.has(m.item.value)) {
                        const pluralNs = NS_PLURAL_MAP[m.item.namespace] || m.item.namespace;
                        const finalVal = \`\${pluralNs}:"\${m.item.value}"\`;
                        uniqueMap.set(m.item.value, {
                            display: m.item.display,
                            finalValue: finalVal,
                            originalMatch: m.originalMatch
                        });
                    }
                });
                return Array.from(uniqueMap.values()).slice(0, 50);
            }
        `;
            const blob = new Blob([workerScript], {
                type: 'application/javascript'
            });
            this.worker = new Worker(URL.createObjectURL(blob));
            this.worker.onmessage = (e) => {
                const msg = e.data;
                if (msg.type === 'initReady') {
                    this.cnToItem = msg.cnToItem;
                    this.indexReady = true;
                } else if (msg.type === 'searchResult') {
                    const { id, results } = msg;
                    if (this.pendingSearches.has(id)) {
                        this.pendingSearches.get(id)(results);
                        this.pendingSearches.delete(id);
                    }
                }
            };
            this.worker.postMessage({ type: 'init', data: this.data });
        },
        search(query) {
             if (!this.worker || !this.indexReady) return Promise.resolve([]);
             return new Promise(resolve => {
                 const id = ++this.searchId;
                 this.pendingSearches.set(id, resolve);
                 this.worker.postMessage({ type: 'search', id, query });
             });
        }
    };

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const SettingsUIDict = {
        'zh': {
            "title": "nHentai Pro 设置 v2.6.8",
            "tab_general": "常规体验",
            "tab_trans": "汉化与语言",
            "tab_adv": "搜索与高级",
            "grp_ui": "界面增强",
            "lbl_btn": "在网页显示设置按钮",
            "desc_btn": "在左侧导航栏添加齿轮图标",
            "lbl_pg": "显示页数",
            "desc_pg": "在封面图右上角显示总页数",
            "lbl_hover": "启用悬停预览",
            "desc_hover": "鼠标悬停封面可滑动预览全书",
            "grp_trans": "汉化设置",
            "lbl_trans": "启用全站汉化",
            "lbl_mode": "翻译显示模式",
            "opt_append": "原文优先 (原文+译文)",
            "opt_replace": "译文优先 (译文+原文)",
            "opt_clean": "仅显示译文",
            "opt_original": "仅显示原文",
            "grp_filter": "语言过滤",
            "lbl_drop": "导航栏筛选菜单",
            "desc_drop": "在右上角显示语言快速筛选器",
            "lbl_def_lang": "默认显示的语言 (留空则全显)",
            "btn_update": "强制更新汉化数据库",
            "grp_search": "搜索增强",
            "lbl_sugg": "搜索自动联想",
            "desc_sugg": "输入时显示汉化标签建议",
            "lbl_qt": "搜索栏快捷标签",
            "lbl_qt_sel": "选择要显示的快捷按钮:",
            "btn_cancel": "取消",
            "btn_save": "保存设置",
            "confirm_update": "确定要重新下载汉化数据库吗？这将消耗约 2MB 流量。",
            "qt_parodies": "原作",
            "qt_characters": "角色",
            "qt_tags": "标签",
            "qt_artists": "作者",
            "qt_groups": "社团",
            "qt_languages": "语言",
            "qt_pages": "页数"
        },
        'en': {
            "title": "nHentai Pro Settings v2.6.8",
            "tab_general": "General",
            "tab_trans": "Translation",
            "tab_adv": "Advanced",
            "grp_ui": "UI Enhancements",
            "lbl_btn": "Show Settings Button",
            "desc_btn": "Add gear icon to nav bar",
            "lbl_pg": "Show Page Numbers",
            "desc_pg": "Show page count on cover",
            "lbl_hover": "Enable Hover Preview",
            "desc_hover": "Preview gallery on hover",
            "grp_trans": "Translation",
            "lbl_trans": "Enable Site Translation",
            "lbl_mode": "Display Mode",
            "opt_append": "Original Priority",
            "opt_replace": "Translated Priority",
            "opt_clean": "Translated Only",
            "opt_original": "Original Only",
            "grp_filter": "Language Filter",
            "lbl_drop": "Navbar Filter Menu",
            "desc_drop": "Show language filter in top-right",
            "lbl_def_lang": "Default Languages (Empty=All)",
            "btn_update": "Force Update DB",
            "grp_search": "Search Features",
            "lbl_sugg": "Search Suggestions",
            "desc_sugg": "Show translated tags while typing",
            "lbl_qt": "Search Bar Quick Tags",
            "lbl_qt_sel": "Visible Quick Tags:",
            "btn_cancel": "Cancel",
            "btn_save": "Save Settings",
            "confirm_update": "Redownload translation database? (~2MB)",
            "qt_parodies": "Parodies",
            "qt_characters": "Characters",
            "qt_tags": "Tags",
            "qt_artists": "Artists",
            "qt_groups": "Groups",
            "qt_languages": "Languages",
            "qt_pages": "Pages"
        }
    };

    function setupSettingsUI() {
        GM_registerMenuCommand("显示/隐藏网页设置按钮", () => {
            const current = Config.get('showPageSettingsButton');
            Config.set('showPageSettingsButton', !current);
            updatePageSettingsButton();
        });
        GM_registerMenuCommand("打开助手设置", showSettingsModal);
    }

    function updatePageSettingsButton() {
        const navLeft = document.querySelector('ul.menu.left');
        const existingBtn = document.getElementById('nh-web-settings-btn');
        const show = Config.get('showPageSettingsButton');

        if (show) {
            if (navLeft && !existingBtn) {
                const li = document.createElement('li');
                li.id = 'nh-web-settings-btn';
                li.className = 'desktop';
                li.innerHTML = '<a href="javascript:void(0)" class="link"><i class="fa fa-cog"></i>设置</a>';
                li.onclick = (e) => {
                    e.preventDefault();
                    showSettingsModal();
                };
                navLeft.insertBefore(li, navLeft.firstChild);
            }
        } else {
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    }

    function setupLanguageFilterUI() {
        const navLeft = document.querySelector('ul.menu.left');
        if (!navLeft) return;

        Array.from(navLeft.children).forEach(child => {
            const text = child.textContent.trim().toLowerCase();
            const link = child.querySelector('a');
            const href = link ? link.href.toLowerCase() : '';

            const isAI = text.includes('ai jerk off') || text.includes('ai porn');
            const isTwitter = href.includes('twitter.com') || href.includes('x.com') || child.querySelector('.fa-twitter');

            if (isAI || isTwitter) {
                child.remove();
            }
        });

        if (!Config.get('showLangDropDown')) return;

        if (document.getElementById('nh-lang-filter')) return;

        const li = document.createElement('li');
        li.id = 'nh-lang-filter';
        li.className = 'desktop';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.order = '9999';
        li.style.marginLeft = 'auto';
        li.style.flexGrow = '1';
        li.style.justifyContent = 'flex-end';

        const wrapper = document.createElement('div');
        wrapper.className = 'nh-lang-container';

        const btn = document.createElement('div');
        btn.className = 'nh-lang-btn';
        btn.innerHTML = '<span id="nh-lang-label">All Languages</span><i class="fa fa-chevron-down nh-lang-arrow"></i>';

        const menu = document.createElement('div');
        menu.className = 'nh-lang-menu';

        const options = [{
            val: LANG_IDS.CHINESE,
            label: 'Chinese'
        }, {
            val: LANG_IDS.ENGLISH,
            label: 'English'
        }, {
            val: LANG_IDS.JAPANESE,
            label: 'Japanese'
        }];

        let currentSelection = Config.get('langFilter');

        const renderMenu = () => {
            menu.innerHTML = '';
            options.forEach(opt => {
                const isSelected = currentSelection.includes(opt.val);
                const item = document.createElement('div');
                item.className = 'nh-lang-item' + (isSelected ? ' selected' : '');
                item.innerHTML = `<div class="nh-lang-checkbox"></div>${opt.label}`;

                item.onclick = (e) => {
                    e.stopPropagation();
                    handleSelection(opt.val);
                };
                menu.appendChild(item);
            });
        };

        const handleSelection = (val) => {
            const idx = currentSelection.indexOf(val);
            if (idx > -1) {
                currentSelection.splice(idx, 1);
            } else {
                currentSelection.push(val);
            }

            Config.set('langFilter', currentSelection);
            updateButtonText();
            renderMenu();
            runLanguageFilter(document, currentSelection);
        };

        const updateButtonText = () => {
            const labelEl = btn.querySelector('#nh-lang-label');
            if (currentSelection.length === 0 || currentSelection.length === 3) {
                labelEl.textContent = 'All Languages';
            } else if (currentSelection.length === 1) {
                labelEl.textContent = LANG_LABELS[currentSelection[0]];
            } else if (currentSelection.length === 2) {
                const labels = currentSelection.map(id => LANG_LABELS[id]);
                labelEl.textContent = labels.join(', ');
            }
        };

        btn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
            btn.classList.toggle('active');
        };

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                menu.classList.remove('show');
                btn.classList.remove('active');
            }
        });

        updateButtonText();
        renderMenu();

        wrapper.appendChild(btn);
        wrapper.appendChild(menu);
        li.appendChild(wrapper);

        navLeft.appendChild(li);
    }

    function runLanguageFilter(context = document, langIds = Config.get('langFilter')) {
        const galleries = context.querySelectorAll ? context.querySelectorAll('.gallery') : [];
        if (galleries.length === 0) return;

        const showAll = langIds.length === 0 || langIds.length === 3;

        galleries.forEach(gallery => {
            gallery.classList.remove('nh-helper-hidden');

            if (!showAll) {
                const tags = gallery.getAttribute('data-tags') || '';
                const tagList = tags.split(' ');

                const hasMatch = langIds.some(id => tagList.includes(id));

                if (!hasMatch) {
                    gallery.classList.add('nh-helper-hidden');
                }
            }
        });
    }


    function showSettingsModal() {
        if (document.getElementById('nh-settings-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'nh-settings-overlay';

        const config = {
            mode: Config.get('translationMode'),
            qt: Config.get('quickTagsSettings'),
            langFilter: Config.get('langFilter'),
            trans: Config.get('enableTranslation'),
            sugg: Config.get('enableSuggestions'),
            qtEnabled: Config.get('enableQuickTags'),
            pageBtn: Config.get('showPageSettingsButton'),
            langDrop: Config.get('showLangDropDown'),
            pageNum: Config.get('showPageNumbers'),
            hover: Config.get('enableHoverPreview')
        };

        let lang = Config.get('settingsLanguage') || 'zh';
        const t = (k) => SettingsUIDict[lang][k] || k;

        const qtKeys = [
            { k: 'parodies', l: t('qt_parodies') }, { k: 'characters', l: t('qt_characters') }, { k: 'tags', l: t('qt_tags') },
            { k: 'artists', l: t('qt_artists') }, { k: 'groups', l: t('qt_groups') }, { k: 'languages', l: t('qt_languages') }, { k: 'pages', l: t('qt_pages') }
        ];

        let qtHtml = '<div class="nh-setting-sub-group" style="grid-template-columns: 1fr 1fr 1fr;">';
        qtKeys.forEach(item => {
            qtHtml += `<label class="nh-setting-sub-item"><input type="checkbox" data-qt-key="${item.k}" ${config.qt[item.k] !== false ? 'checked' : ''}> ${item.l}</label>`;
        });
        qtHtml += '</div>';

        overlay.innerHTML = `
        <div id="nh-settings-modal">
            <div class="nh-modal-header">
                <h3>${t('title')}</h3>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button id="nh-lang-switch" class="nh-btn nh-btn-secondary" style="padding: 2px 8px; font-size: 10px;">${lang === 'zh' ? 'English' : '中文'}</button>
                    <span class="version">v2.6.8</span>
                </div>
            </div>

            <div class="nh-tabs">
                <button class="nh-tab-btn active" data-tab="general">${t('tab_general')}</button>
                <button class="nh-tab-btn" data-tab="translation">${t('tab_trans')}</button>
                <button class="nh-tab-btn" data-tab="advanced">${t('tab_adv')}</button>
            </div>

            <div class="nh-modal-body">
                <!-- Tab: General -->
                <div id="tab-general" class="nh-tab-content active">
                    <div class="nh-setting-group-title">${t('grp_ui')}</div>
                    <div class="nh-setting-item">
                        <div class="nh-setting-content">
                            <span class="nh-setting-label">${t('lbl_btn')}</span>
                            <div class="nh-info-text">${t('desc_btn')}</div>
                        </div>
                        <label class="nh-switch"><input type="checkbox" id="cfg-page-btn" ${config.pageBtn ? 'checked' : ''}><span class="nh-slider"></span></label>
                    </div>
                    <div class="nh-setting-item">
                        <div class="nh-setting-content">
                            <span class="nh-setting-label">${t('lbl_pg')}</span>
                            <div class="nh-info-text">${t('desc_pg')}</div>
                        </div>
                        <label class="nh-switch"><input type="checkbox" id="cfg-page-numbers" ${config.pageNum ? 'checked' : ''}><span class="nh-slider"></span></label>
                    </div>
                    <div class="nh-setting-item">
                        <div class="nh-setting-content">
                            <span class="nh-setting-label">${t('lbl_hover')}</span>
                            <div class="nh-info-text">${t('desc_hover')}</div>
                        </div>
                        <label class="nh-switch"><input type="checkbox" id="cfg-hover-preview" ${config.hover ? 'checked' : ''}><span class="nh-slider"></span></label>
                    </div>
                </div>

                <!-- Tab: Translation -->
                <div id="tab-translation" class="nh-tab-content">
                    <div class="nh-setting-group-title">${t('grp_trans')}</div>
                    <div class="nh-setting-item">
                        <span class="nh-setting-label">${t('lbl_trans')}</span>
                        <label class="nh-switch"><input type="checkbox" id="cfg-trans" ${config.trans ? 'checked' : ''}><span class="nh-slider"></span></label>
                    </div>
                    <div class="nh-setting-item">
                        <span class="nh-setting-label">${t('lbl_mode')}</span>
                        <select id="cfg-trans-mode" class="nh-select">
                            <option value="append" ${config.mode === 'append' ? 'selected' : ''}>${t('opt_append')}</option>
                            <option value="replace" ${config.mode === 'replace' ? 'selected' : ''}>${t('opt_replace')}</option>
                            <option value="clean" ${config.mode === 'clean' ? 'selected' : ''}>${t('opt_clean')}</option>
                            <option value="original" ${config.mode === 'original' ? 'selected' : ''}>${t('opt_original')}</option>
                        </select>
                    </div>

                    <div class="nh-setting-group-title">${t('grp_filter')}</div>
                    <div class="nh-setting-item">
                        <div class="nh-setting-content">
                            <span class="nh-setting-label">${t('lbl_drop')}</span>
                            <div class="nh-info-text">${t('desc_drop')}</div>
                        </div>
                        <label class="nh-switch"><input type="checkbox" id="cfg-show-lang-dropdown" ${config.langDrop ? 'checked' : ''}><span class="nh-slider"></span></label>
                    </div>
                    <div class="nh-setting-item"><span class="nh-setting-label">${t('lbl_def_lang')}</span></div>
                    <div class="nh-setting-sub-group">
                        <label class="nh-setting-sub-item"><input type="checkbox" id="lf-cn" ${config.langFilter.includes('29963') ? 'checked' : ''}> CN</label>
                        <label class="nh-setting-sub-item"><input type="checkbox" id="lf-en" ${config.langFilter.includes('12227') ? 'checked' : ''}> EN</label>
                        <label class="nh-setting-sub-item"><input type="checkbox" id="lf-jp" ${config.langFilter.includes('6346') ? 'checked' : ''}> JP</label>
                    </div>
                    <div style="margin-top: 15px; text-align: center;">
                        <button class="nh-btn nh-btn-secondary" id="nh-force-update" style="width: 100%; font-size: 12px;"><i class="fa fa-refresh"></i> ${t('btn_update')}</button>
                    </div>
                </div>

                <!-- Tab: Advanced -->
                <div id="tab-advanced" class="nh-tab-content">
                    <div class="nh-setting-group-title">${t('grp_search')}</div>
                    <div class="nh-setting-item">
                        <div class="nh-setting-content">
                            <span class="nh-setting-label">${t('lbl_sugg')}</span>
                            <div class="nh-info-text">${t('desc_sugg')}</div>
                        </div>
                        <label class="nh-switch"><input type="checkbox" id="cfg-suggestions" ${config.sugg ? 'checked' : ''}><span class="nh-slider"></span></label>
                    </div>
                    <div class="nh-setting-item">
                        <span class="nh-setting-label">${t('lbl_qt')}</span>
                        <label class="nh-switch"><input type="checkbox" id="cfg-quicktags" ${config.qtEnabled ? 'checked' : ''}><span class="nh-slider"></span></label>
                    </div>
                    <div id="cfg-quicktags-list" style="display: ${config.qtEnabled ? 'block' : 'none'}; padding-left: 10px; border-left: 2px solid #333;">
                        <div style="font-size:12px; color:#888; margin-bottom:5px;">${t('lbl_qt_sel')}</div>
                        ${qtHtml}
                    </div>
                </div>
            </div>

            <div class="nh-settings-actions">
                <button class="nh-btn nh-btn-secondary" id="nh-settings-cancel">${t('btn_cancel')}</button>
                <button class="nh-btn nh-btn-primary" id="nh-settings-save">${t('btn_save')}</button>
            </div>
        </div>`;

        document.body.appendChild(overlay);

        // Lang Switcher Logic
        document.getElementById('nh-lang-switch').onclick = () => {
            const newLang = lang === 'zh' ? 'en' : 'zh';
            Config.set('settingsLanguage', newLang);
            overlay.remove();
            showSettingsModal();
        };

        // Tab Switching Logic
        const tabs = overlay.querySelectorAll('.nh-tab-btn');
        const contents = overlay.querySelectorAll('.nh-tab-content');

        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
            };
        });

        // Quick Tags Toggle Logic
        const qtSwitch = document.getElementById('cfg-quicktags');
        const qtList = document.getElementById('cfg-quicktags-list');
        qtSwitch.addEventListener('change', () => {
            qtList.style.display = qtSwitch.checked ? 'block' : 'none';
        });

        // Actions
        document.getElementById('nh-force-update').onclick = () => {
            if(confirm(t('confirm_update'))) {
                overlay.remove();
                DB.update(true);
            }
        };

        document.getElementById('nh-settings-cancel').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        document.getElementById('nh-settings-save').onclick = () => {
            Config.set('enableTranslation', document.getElementById('cfg-trans').checked);
            Config.set('translationMode', document.getElementById('cfg-trans-mode').value);
            Config.set('enableSuggestions', document.getElementById('cfg-suggestions').checked);
            Config.set('enableQuickTags', qtSwitch.checked);
            Config.set('showPageSettingsButton', document.getElementById('cfg-page-btn').checked);
            Config.set('showLangDropDown', document.getElementById('cfg-show-lang-dropdown').checked);
            Config.set('showPageNumbers', document.getElementById('cfg-page-numbers').checked);
            Config.set('enableHoverPreview', document.getElementById('cfg-hover-preview').checked);

            const newQt = {};
            overlay.querySelectorAll('input[data-qt-key]').forEach(inp => newQt[inp.dataset.qtKey] = inp.checked);
            Config.set('quickTagsSettings', newQt);

            const newFilters = [];
            if(document.getElementById('lf-cn').checked) newFilters.push('29963');
            if(document.getElementById('lf-en').checked) newFilters.push('12227');
            if(document.getElementById('lf-jp').checked) newFilters.push('6346');
            Config.set('langFilter', newFilters);

            overlay.remove();
            location.reload();
        };
    }



    function setupSearchUI() {
        const form = document.querySelector('form[action="/search/"]');
        if (!form) return;
        form.style.position = 'relative';
        const input = form.querySelector('input[name="q"]');
        if (!input) return;
        let lastSuggestions = [];

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') document.body.classList.add('nh-shift-pressed');
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') document.body.classList.remove('nh-shift-pressed');
        });
        const createQuickTags = () => {
            if (!Config.get('enableQuickTags')) return null;
            if (document.getElementById('nh-helper-quick-tags')) return document.getElementById('nh-helper-quick-tags');
            const container = document.createElement('div');
            container.id = 'nh-helper-quick-tags';
            const qtSettings = Config.get('quickTagsSettings');
            const tags = [{
                ns: 'parodies',
                label: '同人'
            }, {
                ns: 'characters',
                label: '角色'
            }, {
                ns: 'tags',
                label: '标签'
            }, {
                ns: 'artists',
                label: '作者'
            }, {
                ns: 'groups',
                label: '社团'
            }, {
                ns: 'languages',
                label: '语言',
                suffix: ':"chinese"'
            }, {
                ns: 'pages',
                label: '页数',
                suffix: ':'
            }];
            tags.filter(t => qtSettings[t.ns] !== false).forEach(t => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'nh-helper-tag-btn';
                btn.textContent = t.label;
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const val = input.value.trim();
                    let suffix = t.suffix || ':""';
                    let prefix = e.shiftKey ? '-' : '';
                    if (t.ns === 'pages') prefix = '';
                    const append = prefix + t.ns + suffix;
                    input.value = val ? val + ' ' + append : append;
                    input.focus();
                    const pad = suffix.endsWith('""') ? 1 : 0;
                    input.setSelectionRange(input.value.length - pad, input.value.length - pad);
                };
                container.appendChild(btn);
            });
            form.appendChild(container);
            return container;
        };
        const qtContainer = createQuickTags();
        form.addEventListener('submit', (e) => {
            if (!DB.indexReady) return;
            const raw = input.value;
            const tokens = [];
            let match;
            TOKEN_REGEX.lastIndex = 0;
            while ((match = TOKEN_REGEX.exec(raw)) !== null) tokens.push(match[0]);
            if (!tokens.length) return;
            const processed = tokens.map(token => {
                const clean = token.replace(/^"|"$/g, '');
                const isExcluded = token.startsWith('-');
                const lookupTerm = isExcluded ? clean.substring(1) : clean;
                let item = DB.cnToItem[lookupTerm];
                if (!item && lookupTerm.includes(':')) {
                    const parts = lookupTerm.split(':');
                    if (parts.length > 1 && DB.cnToItem[parts[1].replace(/"/g, '')]) item = DB.cnToItem[parts[1].replace(/"/g, '')];
                }
                if (item) {
                    const pluralNs = NS_PLURAL_MAP[item.namespace] || item.namespace;
                    const prefix = isExcluded ? '-' : '';
                    return `${prefix}${pluralNs}:"${item.value}"`;
                }
                return token;
            });
            const merged = [];
            for (let i = 0; i < processed.length; i++) {
                const curr = processed[i];
                const next = processed[i + 1];
                if (curr.endsWith(':') && next) {
                    merged.push(curr + next);
                    i++;
                } else {
                    merged.push(curr);
                }
            }
            input.value = merged.join(' ');
        });
        const handleInput = debounce(async () => {
            if (!DB.indexReady) return;
            const suggestions = await DB.search(input.value);
            lastSuggestions = suggestions;
            const existing = document.querySelector('.nh-helper-suggestion-box');
            if (existing) existing.remove();
            if (!suggestions.length) return;
            const box = document.createElement('div');
            box.className = 'nh-helper-suggestion-box';
            suggestions.forEach((item, idx) => {
                const div = document.createElement('div');
                div.className = 'nh-helper-suggestion-item' + (idx === 0 ? ' active' : '');
                div.innerHTML = item.display;
                div.onmousedown = (e) => e.preventDefault();
                div.onclick = (e) => applySuggestion(item, e);
                box.appendChild(div);
            });
            input.parentNode.style.position = 'relative';
            input.parentNode.appendChild(box);
        }, 200);

        function applySuggestion(suggestionItem, event) {
            const raw = input.value;
            const matchStr = suggestionItem.originalMatch;
            const lastIndex = raw.lastIndexOf(matchStr);
            let finalValue = suggestionItem.finalValue;
            if (event && event.shiftKey && !finalValue.startsWith('-')) finalValue = '-' + finalValue;
            if (lastIndex !== -1) input.value = raw.substring(0, lastIndex) + finalValue + ' ';
            else input.value = raw + (raw.endsWith(' ') ? '' : ' ') + finalValue + ' ';
            const box = document.querySelector('.nh-helper-suggestion-box');
            if (box) box.remove();
            input.focus();
        }
        input.addEventListener('input', handleInput);
        input.addEventListener('focus', () => {
            if (!DB.indexReady) {
                const loadingBox = document.createElement('div');
                loadingBox.className = 'nh-helper-suggestion-box';
                loadingBox.innerHTML = '<div class="nh-helper-loading">正在后台准备索引...</div>';
                input.parentNode.appendChild(loadingBox);
                const checkInterval = setInterval(() => {
                    if (DB.indexReady) {
                        clearInterval(checkInterval);
                        if (document.activeElement === input) {
                            loadingBox.remove();
                            handleInput();
                        }
                    }
                }, 500);
            } else handleInput();
            if (qtContainer) qtContainer.style.display = 'flex';
        });
        input.addEventListener('keydown', (e) => {
            const box = document.querySelector('.nh-helper-suggestion-box');
            if (e.key === 'Escape') {
                if (box) box.remove();
                if (qtContainer) qtContainer.style.display = 'none';
                return;
            }
            if (!box) return;
            const items = box.querySelectorAll('.nh-helper-suggestion-item');
            if (!items.length) return;
            let activeIdx = Array.from(items).findIndex(el => el.classList.contains('active'));
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (activeIdx > -1) items[activeIdx].classList.remove('active');
                activeIdx = e.key === 'ArrowDown' ? (activeIdx + 1) % items.length : (activeIdx - 1 + items.length) % items.length;
                items[activeIdx].classList.add('active');
                items[activeIdx].scrollIntoView({
                    block: 'nearest'
                });
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                if (activeIdx > -1) {
                    e.preventDefault();
                    if (lastSuggestions[activeIdx]) {
                        applySuggestion(lastSuggestions[activeIdx], {
                            shiftKey: e.shiftKey
                        });
                    }
                }
            }
        });
        document.addEventListener('click', (e) => {
            if (!form.contains(e.target)) {
                const box = document.querySelector('.nh-helper-suggestion-box');
                if (box) box.remove();
                if (qtContainer) qtContainer.style.display = 'none';
            }
        });
    }

    function translateTextNode(rootNode) {
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue.trim();
                if (!text) continue;
                if (uiTranslations[text]) {
                    node.nodeValue = uiTranslations[text];
                    continue;
                }
                if (text === 'Recent') { node.nodeValue = '最新'; continue; }
                if (text.match(/^\d+ results?$/)) { node.nodeValue = text.replace('results', '个结果').replace('result', '个结果'); continue; }

            } else if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                const ph = node.getAttribute('placeholder');
                if (ph && uiTranslations[ph]) {
                    node.setAttribute('placeholder', uiTranslations[ph]);
                }
            }
        }
    }

    function translateTagElement(element, dbNs) {
        if (!element || element.dataset.nhTranslated) return;
        const enName = element.textContent.trim().toLowerCase();
        let cnName = null;
        if (DB.data[dbNs] && DB.data[dbNs][enName]) cnName = DB.data[dbNs][enName];
        else if (DB.data.tag && DB.data.tag[enName]) cnName = DB.data.tag[enName];
        if (cnName) {
            element.dataset.nhTranslated = "true";
            const mode = Config.get('translationMode');

            if (mode === 'original') {
                // No title attribute set, no hover translation
            } else {
                element.title = enName;
                if (mode === 'clean') element.textContent = cnName;
                else if (mode === 'replace') element.innerHTML = `${cnName} <span class="nh-original-tag">${enName}</span>`;
                else element.innerHTML = `${enName} <span class="nh-translated-tag">${cnName}</span>`;
            }
        }
    }

    function translateInfoPage() {
        const infoContainer = document.querySelector('#info-container');
        if (!infoContainer) return;
        const replaceText = (el, map) => {
             if (el) el.childNodes.forEach(node => {
                 if (node.nodeType === 3) {
                     const txt = node.textContent.trim();
                     if (map[txt]) node.textContent = map[txt];
                     else {
                         const normalized = txt.replace(/\.$/, '');
                         if (map[normalized]) node.textContent = map[normalized];
                     }
                 } else replaceText(node, map);
             });
        };

        const infoMap = {
           "Accessing nhentai": "访问 nhentai",
           "Official domain: ": "官方域名：",
           "Tor Onion:": "Tor 洋葱地址：",
           "You must be inside the tor network.": "您必须在 Tor 网络中。",
           "Learn more.": "了解更多。",
           "More to come.": "更多功能即将推出。",
           "Features": "功能",
           "We will never add forums.": "我们永远不会添加论坛。",
           "You will be able to upload and edit galleries soon.": "您很快就可以上传和编辑图库了。",
           "Accounts": "账号",
           "Unlimited favorites": "无限的收藏夹",
           "Unlimited favorites.": "无限的收藏夹",
           "Tag blacklist": "标签黑名单",
           "Tag blacklisting.": "标签黑名单",
           "Three gorgeous themes: Light, Blue, and Dark.": "三个华丽的主题：浅色、蓝色和黑色。",
           "Three gorgeous themes: light, blue, and black.": "三个华丽的主题：浅色、蓝色和黑色。",
           "Search": "搜索",

           "You can search for multiple terms at the same time, and this will return only galleries that contain both terms. For example,": "您可以同时搜索多个词条，以下内容将仅返回包含这两个词条的图库。例如：",
           "matches all galleries matching": "匹配所有包含",
           " and ": " 和 ",
           "and": "和",
           "You can exclude terms by prefixing them with": "您可以排除词条，通过在词条前加上前缀",
            ". For example,": "。例如，",
           "finds all galleries that contain both": "寻找所有图库，其中同时包含了",
           " but not ": " 但不包含 ",
           "but not": "但不包含",
           "Exact searches can be performed by wrapping terms in double quotes. For example,": "可以通过将词条添加双引号来进行精确搜索。例如：",
           "only matches galleries with \"big breasts\" somewhere in the title or in tags.": "仅匹配标题或标签中某处具有“big breasts”的图库。",
           "These can be combined with tag namespaces for finer control over the query:": "这些可以与标签命名空间结合使用，以便更精细地控制查询：",
           "You can search for galleries with a specific number of pages with": "您可以搜索具有特定页数的图库",
           ", or with a page range:": "，或使用页数范围：",
           "or with a page range:": "或使用页数范围：",
           "You can search for galleries uploaded within some timeframe with": "您可以使用以下方法搜索在某个时间范围内上传的图库",
           "Valid units are": "有效单位为",
           ". Valid units are": "。有效单位为",
           "You can also specify a range:": "你也可以指定一个范围：",
           "You can use ranges as well:": "您也可以使用范围：",
           ". You can use ranges as well:": "。您也可以使用范围：",

           "Get in touch": "联系我们",
           "Want to get in touch?": "联系我们？",
           "General Inquiries:": "一般咨询：",
           "Support:": "支持：",
           "Abuse:": "滥用举报：",
           "Twitter:": "推特：",
           "Email:": "邮箱：",
           "(if you are having technical issues please include your OS and Browser information plus version numbers)": "（如果您遇到技术问题，请包含您的操作系统和浏览器信息以及版本号）",
           "Thanks for supporting the site!": "感谢您对网站的支持！"
        };
        replaceText(infoContainer, infoMap);
    }

    function runUITranslation(context = document) {
        if (!Config.get('enableTranslation')) return;
        const q = (sel) => context.querySelectorAll ? context.querySelectorAll(sel) : [];
        const loc = window.location.href;

        q("li.desktop > a, ul.dropdown-menu > li > a, .menu-sign-in a, .menu.right a").forEach(item => {
            const txt = item.textContent.trim();
            if (mapMenu[txt]) item.innerHTML = item.innerHTML.replace(txt, mapMenu[txt]);
            else if (uiTranslations[txt]) item.textContent = uiTranslations[txt];
        });

        const sortTypes = q('.sort-type');
        sortTypes.forEach(div => {
            if (div.querySelector('a[data-month-added]')) return;
            const weekBtn = Array.from(div.querySelectorAll('a')).find(a => a.href.includes('popular-week'));
            if (weekBtn) {
                const monthBtn = weekBtn.cloneNode(true);
                monthBtn.href = monthBtn.href.replace('popular-week', 'popular-month');
                monthBtn.textContent = Config.get('enableTranslation') ? '本月' : 'month';
                monthBtn.setAttribute('data-month-added', 'true');
                if (window.location.search.includes('sort=popular-month')) {
                    div.querySelectorAll('a').forEach(a => a.classList.remove('current'));
                    monthBtn.classList.add('current');
                } else {
                    monthBtn.classList.remove('current');
                }
                weekBtn.after(monthBtn);
            }
        });

        q('time').forEach(t => {
            if (t.dateTime && !t.classList.contains('nobold')) {
                try {
                    const d = new Date(t.dateTime);
                    t.textContent = d.toLocaleString('zh-cn', { dateStyle: 'medium', timeStyle: 'medium' });
                    t.classList.add("nobold");
                } catch (e) {}
            }
        });

        q('h2, .section > h3').forEach(header => {
            let txt = header.textContent.trim();
            if (txt.includes('results')) header.innerHTML = header.innerHTML.replace(/\d+ results?/, match => ` ${match.split(' ')[0]} 个结果`);
            else if (mapTagHeaders[txt]) header.textContent = uiTranslations[txt] || mapTagHeaders[txt];
            else if (uiTranslations[txt]) header.textContent = uiTranslations[txt];
        });

        q('.advertisement').forEach(ad => ad.remove());

        if (loc.includes('/login/') || loc.includes('/register/') || loc.includes('/reset/')) {
            q('label, button, .lead').forEach(el => translateTextNode(el));
            q('input').forEach(inp => {
                const ph = inp.getAttribute('placeholder');
                if (ph && uiTranslations[ph]) inp.setAttribute('placeholder', uiTranslations[ph]);
            });
            q('.login-form a, .register-form a').forEach(a => translateTextNode(a));
        }

        if (loc.includes('/favorites/')) {
            const usernameEl = context.querySelector('.username');
            const h1 = context.querySelector('#content h1');
            if (usernameEl && h1 && h1.childNodes.length > 1) {
                h1.childNodes[1].textContent = ` ${usernameEl.textContent.trim()} 的收藏`;
            }
            q('.remove-button > span').forEach(span => {
                 if (span.textContent === 'Remove') span.textContent = '取消收藏';
            });
        }

        if (loc.includes('/logout/')) {
            q('.container p, #content p').forEach(el => {
                if(el.textContent.includes('Are you sure you want to log out?')) {
                     el.textContent = '真的要注销吗？';
                }
            });

            q('a').forEach(a => {
                if(a.textContent.toLowerCase().includes('take me back')) {
                     a.textContent = '不，回到之前的页面。';
                }
            });

             q('button').forEach(btn => {
                if (btn.textContent.toLowerCase().includes('log out')) {
                    btn.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim().length > 0) {
                            child.nodeValue = ' 注销';
                        }
                    });
                }
            });
        }

        if (loc.includes('/users/') && (loc.includes('/edit') || loc.includes('/delete'))) {
            q('label, .btn').forEach(el => translateTextNode(el));
            q('input').forEach(inp => {
                 const ph = inp.getAttribute('placeholder');
                 if (ph && uiTranslations[ph]) inp.setAttribute('placeholder', uiTranslations[ph]);
            });
            const msg = context.querySelector ? context.querySelector('.message') : null;
            if (msg && msg.textContent.includes('settings have been updated')) msg.textContent = '您的用户设置已更新';
            const deleteP = context.querySelector ? context.querySelector('p') : null;
            if (deleteP && deleteP.textContent.includes('going to delete')) deleteP.innerHTML = '即将删除账户，<b>此操作无法撤销</b>。';
        }

        if (loc.includes('/users/') && !loc.includes('/edit')) {
             q('.user-info b').forEach(b => { if(b.textContent.includes('Member since')) b.textContent = '注册日期:'; });
             q('.user-info .fa-heart').forEach(i => { if(i.nextSibling) i.nextSibling.textContent = ' 收藏夹'; });
             q('.user-info .fa-cog').forEach(i => { if(i.nextSibling) i.nextSibling.textContent = ' 设置'; });
             q('.user-info .fa-ban').forEach(i => { if(i.nextSibling) i.nextSibling.textContent = ' 屏蔽的标签'; });

             const recentFav = context.querySelector('#recent-favorites-container h2');
             if (recentFav && recentFav.childNodes[1]) recentFav.childNodes[1].textContent = ' 最近收藏';

             q('.fa-comments').forEach(i => {
                 if (i.parentNode.tagName === 'H2' || i.parentNode.tagName === 'H3') {
                     if (i.nextSibling && i.nextSibling.textContent.includes('Recent Comments')) {
                         i.nextSibling.textContent = ' 最近评论';
                     }
                 }
             });
        }

        if (loc.includes('/g/')) {
            const favSpan = context.querySelector ? context.querySelector('#favorite .text') : null;
            if (favSpan && (favSpan.textContent === 'Favorite' || favSpan.textContent === 'Unfavorite')) {
                favSpan.textContent = uiTranslations[favSpan.textContent];
            }
            const downloadBtn = context.querySelector ? context.querySelector('#download') : null;
            if (downloadBtn && downloadBtn.textContent.includes('Download')) downloadBtn.innerHTML = '<i class="fa fa-download"></i> 下载 (种子)';

            q('#show-all-images-button .text').forEach(el => el.textContent = '显示全部');
            q('#show-more-images-button .text').forEach(el => el.textContent = '显示更多');
            q('#related-container h2').forEach(el => el.textContent = '相似推荐');

            const commentHeader = context.querySelector ? context.querySelector('#comment-post-container h3') : null;
            if (commentHeader && commentHeader.innerHTML.includes('New Comment')) commentHeader.innerHTML = '<i class="fa fa-pencil"></i> 发布评论';
            const postBtn = context.querySelector ? context.querySelector('#comment_form .btn') : null;
            if (postBtn && postBtn.textContent.includes('Post')) postBtn.textContent = '评论';
        }

        if (loc.includes('/info/')) {
            translateInfoPage();
        }

        q('.fa-fire').forEach(i => { if(i.parentNode.textContent.includes('Popular')) i.parentNode.innerHTML = '<i class="fa fa-fire"></i> 当前热门'; });
        q('.fa-box-tissue').forEach(i => { if(i.parentNode.textContent.includes('New Uploads')) i.parentNode.innerHTML = '<i class="fa fa-box-tissue"></i> 最新上传'; });

        q('.sort-type, .sort-type a, .sort-type span').forEach(el => translateTextNode(el));

        q('.container > h1, .container > h2').forEach(el => translateTextNode(el));
    }

    function runContentTranslation(context = document) {
        if (!Config.get('enableTranslation') || !DB.data.tag) return;
        const q = (sel) => context.querySelectorAll ? context.querySelectorAll(sel) : [];

        const path = window.location.pathname;
        let globalNs = null;
        if (path.startsWith('/artists')) globalNs = 'artist';
        else if (path.startsWith('/characters')) globalNs = 'character';
        else if (path.startsWith('/groups')) globalNs = 'group';
        else if (path.startsWith('/parodies')) globalNs = 'parody';

        const processContainer = (container) => {
            let ns = 'tag';
            const containerText = container.textContent.toLowerCase();
            if (containerText.includes('parodies') || containerText.includes('原作')) ns = 'parody';
            else if (containerText.includes('characters') || containerText.includes('角色')) ns = 'character';
            else if (containerText.includes('artists') || containerText.includes('作者')) ns = 'artist';
            else if (containerText.includes('groups') || containerText.includes('社团')) ns = 'group';
            else if (containerText.includes('languages') || containerText.includes('语言')) ns = 'language';
            container.querySelectorAll('.tags .tag .name').forEach(el => translateTagElement(el, ns));
        };
        if (context.classList && context.classList.contains('tag-container')) processContainer(context);
        else q('.tag-container').forEach(processContainer);

        const processTag = (el) => {
            let ns = 'tag';
            const link = el.closest('a');
            const href = link ? (link.getAttribute('href') || '') : '';

            if (globalNs && !href.includes('/g/')) {
                 ns = globalNs;
            } else {
                if (href.includes('/artist/') || href.includes('/artists/')) ns = 'artist';
                else if (href.includes('/character/') || href.includes('/characters/')) ns = 'character';
                else if (href.includes('/parody/') || href.includes('/parodies/')) ns = 'parody';
                else if (href.includes('/group/') || href.includes('/groups/')) ns = 'group';
            }
            translateTagElement(el, ns);
        };
        q('.tag .name').forEach(processTag);

        const titleSpan = context.querySelector ? context.querySelector('span.name') : null;
        if (titleSpan && !titleSpan.dataset.nhTranslated && DB.data.tag[titleSpan.textContent.toLowerCase()]) translateTagElement(titleSpan, 'tag');
    }

    const pageObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gallery = entry.target;
                obs.unobserve(gallery);
                loadPageCount(gallery);
            }
        });
    }, { rootMargin: '200px' });

    async function loadPageCount(gallery) {
        const cover = gallery.querySelector('.cover');
        if (!cover || cover.querySelector('.nh-page-number') || cover.dataset.pageProcessed) return;

        cover.dataset.pageProcessed = "true";
        const href = cover.getAttribute('href');
        if (!href) return;
        const match = href.match(/\/g\/(\d+)\//);
        if (!match) return;

        const id = match[1];
        
        // Priority feature: Move to front of queue on hover
        const priorityHandler = () => {
            if (RequestQueue) RequestQueue.prioritize(id);
        };
        gallery.addEventListener('mouseenter', priorityHandler);

        const meta = await getMeta(id);

        // Cleanup listener after load (or failure)
        gallery.removeEventListener('mouseenter', priorityHandler);

        if (meta && meta.total) {
            if (!cover.querySelector('.nh-page-number')) {
                const badge = document.createElement('div');
                badge.className = 'nh-page-number';
                badge.textContent = meta.total + 'P';
                if (getComputedStyle(cover).position === 'static') {
                    cover.style.position = 'relative';
                }
                cover.appendChild(badge);
            }
        }
    }

    function runPageNumberDisplay(context = document) {
        if (!Config.get('showPageNumbers')) return;

        const galleries = context.querySelectorAll ? context.querySelectorAll('.gallery') : [];
        galleries.forEach(gallery => {
            const cover = gallery.querySelector('.cover');
            if (cover && !cover.dataset.pageProcessed) {
                pageObserver.observe(gallery);
            }
        });
    }

    const RequestQueue = {
        queue: [],
        processing: false,
        lastRequestTime: 0,
        minInterval: 300, // Minimum 300ms between requests to prevent 429

        enqueue(id) {
            return new Promise((resolve, reject) => {
                this.queue.push({ id, resolve, reject });
                this.process();
            });
        },

        prioritize(id) {
            const idx = this.queue.findIndex(task => task.id === id);
            if (idx > 0) {
                // Priority strategy: "Batch Forwarding"
                // Move the hovered item AND a small batch of subsequent items (e.g., next 2 rows)
                // to the front. This supports "read current -> read next" flow while
                // keeping the rest of the queue (e.g. previous items) relatively intact.
                const BATCH_SIZE = 9; 
                const priorityBatch = this.queue.splice(idx, BATCH_SIZE);
                this.queue.unshift(...priorityBatch);
            }
            this.process();
        },

        async process() {
            if (this.processing || this.queue.length === 0) return;
            this.processing = true;

            while (this.queue.length > 0) {
                const now = Date.now();
                const timeSinceLast = now - this.lastRequestTime;
                
                if (timeSinceLast < this.minInterval) {
                    await new Promise(r => setTimeout(r, this.minInterval - timeSinceLast));
                }

                const { id, resolve, reject } = this.queue.shift();
                
                try {
                    const data = await fetch(`/api/gallery/${id}`).then(res => {
                        if (!res.ok) throw new Error(res.statusText);
                        return res.json();
                    });
                    
                    const meta = {
                        id: data.media_id,
                        pages: data.images.pages,
                        total: data.num_pages,
                        tags: data.tags,
                        title: data.title.english || data.title.japanese || data.title.pretty,
                        cover_type: data.images.cover.t
                    };
                    
                    // Update cache here to ensure shared usage
                    cache.set(id, meta);
                    resolve(meta);
                } catch (e) {
                    console.error(`[nHentai Pro] Failed to fetch meta for ${id}:`, e);
                    resolve(null); // Resolve null to avoid breaking chains
                } finally {
                    this.lastRequestTime = Date.now();
                }
            }
            
            this.processing = false;
        }
    };

    function getMeta(id) {
        if (cache.has(id)) return Promise.resolve(cache.get(id));
        return RequestQueue.enqueue(id);
    }

    function buildTagList(tags) {
        const groups = { artist: [], parody: [], character: [], tag: [] };
        const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1) + 'k' : n;

        const mode = Config.get('translationMode');

        tags.forEach(t => {
            const count = t.count || 0;
            const enName = t.name;
            let cnName = null;
            if (DB.data[t.type] && DB.data[t.type][enName]) cnName = DB.data[t.type][enName];
            else if (DB.data.tag && DB.data.tag[enName]) cnName = DB.data.tag[enName];

            let displayName = enName;
            if (cnName) {
                if (mode === 'clean') displayName = cnName;
                else if (mode === 'original') displayName = enName;
                else if (mode === 'replace') displayName = `${cnName} <span class="nh-original-tag" style="font-size:85%; opacity:0.7; margin-left:2px;">${enName}</span>`;
                else displayName = `${enName} <span class="nh-translated-tag" style="font-size:85%; opacity:0.7; margin-left:2px;">${cnName}</span>`;
            }

            const html = `<span class="tag-pill" title="${enName} (${fmt(count)})">${displayName}</span>`;

            if (groups[t.type]) {
                groups[t.type].push(html);
            } else if (t.type === 'group') {
                const groupHtml = `<span class="tag-pill">[${displayName}]</span>`;
                groups.artist.push(groupHtml);
            }
        });

        let html = '';
        const addGroup = (title, list) => { if (list.length) html += `<div class="tag-category">${title}</div>` + list.join(''); };
        addGroup('Artists', groups.artist); addGroup('Parodies', groups.parody); addGroup('Characters', groups.character); addGroup('Tags', groups.tag);
        return html || '<div style="padding:5px">No tags</div>';
    }

    function updatePreview(gallery, val, isJump = false) {
        const id = gallery.dataset.gid;
        const state = states.get(id) || { curr: 1, req: 0 };
        states.set(id, state);
        getMeta(id).then(meta => {
            if (!meta) return;
            let next = isJump ? val : state.curr + val;
            if (next < 1) next = 1; if (next > meta.total) next = meta.total;
            const popup = gallery.querySelector('.tag-popup');
            if (popup && !popup.innerHTML) popup.innerHTML = buildTagList(meta.tags);
            if (next === state.curr && !isJump && val !== 0) return;
            state.curr = next;
            const reqId = ++state.req;
            if (state.curr !== 1) gallery.classList.add('is-previewing');
            const barFill = gallery.querySelector('.seek-fill');
            if (barFill) barFill.style.width = `${(state.curr / meta.total) * 100}%`;
            const pageData = meta.pages[state.curr - 1];
            const src = `https://i.nhentai.net/galleries/${meta.id}/${state.curr}.${EXT_MAP[pageData.t]}`;
            const img = gallery.querySelector('a.cover img');
            const loader = new Image();
            loader.onload = () => { if (state.req === reqId) { img.style.aspectRatio = `${pageData.w}/${pageData.h}`; img.src = src; } };
            loader.src = src;
        });
    }

    function initPreviewUI(gallery) {
        if (!Config.get('enableHoverPreview')) return;
        if (gallery.dataset.init) return;
        const link = gallery.querySelector('a.cover');
        if (!link) return;
        const id = link.href.match(/\/g\/(\d+)\//)?.[1];
        if (!id) return;
        gallery.dataset.gid = id; gallery.dataset.init = '1';
        const ui = document.createElement('div');
        ui.className = 'inline-preview-ui';
        ui.innerHTML = `
            <div class="tag-trigger">TAGS</div>
            <div class="tag-popup"></div>
            <div class="hotzone hotzone-left"></div>
            <div class="hotzone hotzone-right"></div>
            <div class="seek-container"><div class="seek-bg"><div class="seek-fill"></div></div><div class="seek-tooltip">Pg 1</div></div>
        `;
        ui.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        ui.querySelector('.hotzone-left').onclick = (e) => { e.preventDefault(); e.stopPropagation(); updatePreview(gallery, -1); };
        ui.querySelector('.hotzone-right').onclick = (e) => { e.preventDefault(); e.stopPropagation(); updatePreview(gallery, 1); };
        const seek = ui.querySelector('.seek-container');
        const tip = ui.querySelector('.seek-tooltip');
        let isDragging = false;

        const handleSeekMove = (e) => {
            if (!cache.has(id)) return null;
            const meta = cache.get(id);
            const rect = seek.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const page = Math.ceil(pct * meta.total) || 1;

            tip.style.left = `${e.clientX - rect.left}px`;
            tip.textContent = page;
            return page;
        };

        seek.onmousedown = (e) => {
            e.preventDefault(); e.stopPropagation();
            isDragging = true;

            const runUpdate = () => {
                const page = handleSeekMove(e);
                if (page) updatePreview(gallery, page, true);
            };

            if (!cache.has(id)) {
                 updatePreview(gallery, 0).then(runUpdate);
            } else {
                runUpdate();
            }
        };

        seek.onmousemove = (e) => {
            const page = handleSeekMove(e);
            if (isDragging && page) {
                updatePreview(gallery, page, true);
            }
        };

        seek.onmouseup = (e) => {
            e.preventDefault(); e.stopPropagation();
            isDragging = false;
        };

        seek.onmouseleave = (e) => {
             isDragging = false;
        };

        seek.onclick = (e) => { e.preventDefault(); e.stopPropagation(); };

        gallery.onmouseenter = () => {
            hoveredGallery = gallery;
            if (!cache.has(id)) {
                hoverTimeout = setTimeout(() => { updatePreview(gallery, 0); }, 300);
            } else { updatePreview(gallery, 0); }
        };
        gallery.onmouseleave = () => {
            hoveredGallery = null;
            if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
        };
        link.style.position = 'relative'; link.appendChild(ui);
    }

    async function main() {
        console.log('[nHentai Pro] 正在启动...');
        Styles.inject();
        setupSettingsUI();
        updatePageSettingsButton();

        setupLanguageFilterUI();
        runLanguageFilter();

        runUITranslation();
        runPageNumberDisplay();
        document.querySelectorAll('.gallery:not([data-init])').forEach(initPreviewUI);

        await DB.init();
        setupSearchUI();
        runContentTranslation();

        let observerTimeout;
        let pendingNodes = new Set();
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        pendingNodes.add(node);
                    }
                });
            });
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(() => {
                pendingNodes.forEach(node => {
                    if (document.contains(node)) {
                        runUITranslation(node);
                        runContentTranslation(node);
                        runLanguageFilter(node);
                        runPageNumberDisplay(node);
                        if (node.classList && node.classList.contains('gallery')) {
                            initPreviewUI(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('.gallery:not([data-init])').forEach(initPreviewUI);
                        }
                    }
                });
                pendingNodes.clear();
            }, 100);
        });
        const content = document.querySelector('#content');
        if (content) observer.observe(content, {
            childList: true,
            subtree: true
        });

        document.addEventListener('keydown', (e) => {
            if (hoveredGallery && !document.fullscreenElement) {
                if (e.key === 'ArrowRight') { e.preventDefault(); updatePreview(hoveredGallery, 1); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); updatePreview(hoveredGallery, -1); }
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
    else main();
})();