// ==UserScript==
// @name            FC2PPVDB Enhanced
// @name:en         FC2PPVDB Enhanced
// @description     聚合第三方公开数据，提供悬浮/点击播放、磁力链接、快捷搜索、额外预览、历史高亮、收藏、统计与成就。
// @description:en  Aggregates public third-party data to provide hover/click-to-play, magnet links, extra previews, quick search, history management, and more.
// @namespace       https://greasyfork.org/zh-CN/scripts/552583-fc2ppvdb-enhanced
// @version         1.6.1
// @author          Icarusle
// @license         MIT
// @icon            https://www.google.com/s2/favicons?sz=64&domain=fc2ppvdb.com
// @match           https://fc2ppvdb.com/*
// @match           https://fd2ppv.cc/*
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @connect         sukebei.nyaa.si
// @connect         wumaobi.com
// @require         https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/552583/FC2PPVDB%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/552583/FC2PPVDB%20Enhanced.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const DISCLAIMER_STATUS_KEY = 'disclaimer_status_v1';
    const DISCLAIMER_STATUS = GM_getValue(DISCLAIMER_STATUS_KEY, 'pending'); // 'pending', 'accepted', 'declined'

    if (DISCLAIMER_STATUS === 'pending') {
        const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
        const isChineseUser = browserLang.startsWith('zh');

        const step1_ZH = `【第1/3步：功能解释】\n\n欢迎使用 FC2PPVDB Enhanced！\n\n本脚本是一个浏览器工具，用于增强您的个人浏览体验。它会聚合来自第三方公开网站的信息（如封面图、磁力链接、额外预览图），并在您的本地浏览器中管理个人数据（如历史记录、收藏）。\n\n点击“确定”继续阅读免责声明。`;
        const step1_EN = `[Step 1/3: Function Explanation]\n\nWelcome to FC2PPVDB Enhanced!\n\nThis script is a browser tool to enhance your personal viewing experience. It aggregates information (like cover images, magnet links, and extra previews) from third-party public websites and manages personal data (like history, collections) locally in your browser.\n\nClick "OK" to continue to the disclaimer.`;

        const step2_ZH = `【第2/3步：免责声明】\n\n1. 本脚本不托管、不上传、不分发任何受版权保护的内容。\n2. 用户应在遵守其所在地区法律法规的前提下使用本脚本。任何因使用本脚本聚合的信息而导致的法律责任，由用户自行承担。\n3. 本脚本仅为个人学习和技术研究目的创建，作者不对其造成的任何后果负责。\n\n点击“确定”表示您理解并同意以上免责条款。`;
        const step2_EN = `[Step 2/3: Disclaimer]\n\n1. This script does not host, upload, or distribute any copyrighted content.\n2. Users must use this script in compliance with the laws and regulations of their region. The user is solely responsible for any legal liability arising from its use.\n3. This script is for personal learning and technical research only. The author is not responsible for any consequences.\n\nClick "OK" to acknowledge and agree to this disclaimer.`;

        const step3_ZH = `【第3/3步：最终确认】\n\n您是否确认已年满18岁，并完全同意之前的所有条款？\n\n点击“确定”开始使用脚本。点击“取消”将退出且不再提示。`;
        const step3_EN = `[Step 3/3: Final Confirmation]\n\nDo you confirm that you are at least 18 years old and fully agree to all previous terms?\n\nClick "OK" to start using the script. Clicking "Cancel" will exit and you will not be prompted again.`;

        const step1Text = isChineseUser ? step1_ZH : step1_EN;
        const step2Text = isChineseUser ? step2_ZH : step2_EN;
        const step3Text = isChineseUser ? step3_ZH : step3_EN;

        if (confirm(step1Text) && confirm(step2Text) && confirm(step3Text)) {
            GM_setValue(DISCLAIMER_STATUS_KEY, 'accepted');
            console.log("FC2PPVDB Enhanced: User accepted all terms. Script will now run.");
        } else {
            GM_setValue(DISCLAIMER_STATUS_KEY, 'declined');
            console.log("FC2PPVDB Enhanced: User declined the disclaimer. The script will not run and will not ask again.");
            return;
        }
    }
    else if (DISCLAIMER_STATUS === 'declined') {
        return;
    }

    // =============================================================================
    // 第一部分：内核 - 通用模块与配置中心
    // =============================================================================

    const Config = {
        CACHE_KEY: 'magnet_cache_v1',
        SETTINGS_KEY: 'settings_v1',
        HISTORY_KEY: 'history_v1',
        STATS_KEY: 'stats_v1',
        ACHIEVEMENTS_KEY: 'achievements_v1',
        MAX_HISTORY_SIZE: 1000,
        CACHE_EXPIRATION_DAYS: 7,
        CACHE_MAX_SIZE: 500,
        DEBOUNCE_DELAY: 400,
        COPIED_BADGE_DURATION: 1500,
        PREVIEW_VIDEO_TIMEOUT: 5000,
        NETWORK: {
            API_TIMEOUT: 20000,
            CHUNK_SIZE: 12,
            MAX_RETRIES: 2,
            RETRY_DELAY: 2000,
        },
        CLASSES: {
            cardRebuilt: 'card-rebuilt',
            processedCard: 'processed-card',
            hideNoMagnet: 'hide-no-magnet',
            videoPreviewContainer: 'video-preview-container',
            staticPreview: 'static-preview',
            previewElement: 'preview-element',
            hidden: 'hidden',
            infoArea: 'info-area',
            customTitle: 'custom-card-title',
            fc2IdBadge: 'fc2-id-badge',
            badgeCopied: 'copied',
            preservedIconsContainer: 'preserved-icons-container',
            resourceLinksContainer: 'resource-links-container',
            resourceBtn: 'resource-btn',
            btnLoading: 'is-loading',
            btnMagnet: 'magnet',
            tooltip: 'tooltip',
            buttonText: 'button-text',
            extraPreviewContainer: 'preview-container',
            extraPreviewTitle: 'preview-title',
            extraPreviewGrid: 'preview-grid',
            isCensored: 'is-censored',
            hideCensored: 'hide-censored',
            isViewed: 'is-viewed',
            hideViewed: 'hide-viewed',
        },
        SITES: {
            'fd2ppv.cc': {
                routes: [
                    { path: /^\/articles\/\d+/, processor: 'FD2PPV_DetailPageProcessor' },
                    { path: /^\/actresses\//, processor: 'FD2PPV_ActressPageProcessor' },
                    { path: /.*/, processor: 'FD2PPV_ListPageProcessor' },
                ]
            },
            'fc2ppvdb.com': {
                routes: [
                    { path: /^\/articles\/\d+/, processor: 'FC2PPVDB_DetailPageProcessor' },
                    { path: /.*/, processor: 'FC2PPVDB_ListPageProcessor' },
                ]
            }
        }
    };

    const Utils = {
        debounce(func, delay) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },
        chunk: (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size)),
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        extractFC2Id: (url) => url?.match(/articles\/(\d+)/)?.[1] ?? null,
        getIconSortScore: (node) => {
            if (node.querySelector('.icon-mosaic_free')) return 0;
            if (node.querySelector('.icon-face_free')) return 1;
            return 2;
        },
    };

    const Localization = {
        _lang: 'en',
        _translations: {
            en: {
                settingsTitle: "FC2PPVDB Enhanced",
                tabSettings: "Settings",
                tabStatistics: "Statistics",
                groupFilters: "General Filters",
                optionHideNoMagnet: "Hide results with no magnet links",
                optionHideCensored: "Hide censored works",
                optionHideViewed: "Hide viewed works",
                groupAppearance: "Appearance & Interaction",
                labelPreviewMode: "Preview Mode (Refresh required)",
                previewModeStatic: "Static Image",
                previewModeHover: "Hover/Click to Play",
                labelCardLayout: "Card Layout",
                layoutDefault: "Default",
                layoutCompact: "Compact",
                labelButtonStyle: "Quick Button Style",
                buttonStyleIcon: "Icon Only",
                buttonStyleText: "Icon and Text",
                groupDataHistory: "Data & History",
                optionEnableHistory: "Enable history feature (Highlight/Hide)",
                optionLoadExtraPreviews: "Load extra previews on detail pages (Refresh required)",
                optionEnableCollection: "Enable collection & tagging feature (Refresh required)",
                labelCacheManagement: "Cache Management",
                btnClearCache: "Clear magnet link cache",
                labelHistoryManagement: "History Management",
                btnClearHistory: "Clear browsing history",
                btnSaveAndApply: "Save and Apply",
                alertSettingsSaved: "Settings saved! Some changes may require a page refresh to take full effect.",
                alertCacheCleared: "Magnet link cache has been cleared!",
                alertHistoryCleared: "Browsing history has been cleared!",
                menuOpenSettings: "⚙️ Open Settings Panel",
                tooltipCopyMagnet: "Copy Magnet Link",
                tooltipCopied: "Copied!",
                tooltipLoading: "Loading...",
                extraPreviewTitle: "Extra Previews",
                statTotalViews: "Total Views",
                statCachedMagnets: "Cached Magnets",
                statCacheHits: "Cache Hits",
                chartLoading: "Loading chart...",
                chartActivityTitle: "Browsing Activity Trend",
                chartActivityLabel: "Views in the last 30 days",
                chartCacheTitle: "Cache Usage",
                chartCacheUsed: "Used Cache",
                chartCacheFree: "Free Space",
                achievementsTitle: "Achievement Milestones",
                statusUnlocked: "Unlocked",
                statusLocked: "Locked",
                ach_view10_title: "First Steps", ach_view10_desc: "View 10 works in total.",
                ach_view100_title: "Getting the Hang", ach_view100_desc: "View 100 works in total.",
                ach_view1000_title: "Seasoned Connoisseur", ach_view1000_desc: "View 1000 works in total.",
                ach_cache50_title: "Cache Master", ach_cache50_desc: "Load 50 magnet links from cache.",
                ach_cache500_title: "Efficiency Expert", ach_cache500_desc: "Load 500 magnet links from cache.",
                ach_nightOwl_title: "Night Owl", ach_nightOwl_desc: "Browsed between 2 AM and 4 AM.",
                ach_earlyBird_title: "Early Bird", ach_earlyBird_desc: "Browsed between 5 AM and 7 AM.",
                ach_weekendWarrior_title: "Weekend Warrior", ach_weekendWarrior_desc: "Viewed over 30 works during a single weekend.",
                ach_endurance_title: "Endurance Runner", ach_endurance_desc: "Browsed every day for 7 consecutive days.",
                ach_fullThrottle_title: "Full Throttle", ach_fullThrottle_desc: "Viewed over 20 works within 1 hour.",
                ach_luckyNumber_title: "Lucky Number", ach_luckyNumber_desc: "Viewed a work with '666' or '888' in its ID.",
                ach_veteranDriver_title: "Veteran Driver", ach_veteranDriver_desc: "First and last view records are more than 365 days apart.",
                ach_achievementHunter_title: "Achievement Hunter", ach_achievementHunter_desc: "Unlock your first achievement.",
                groupDataManagement: "Data Management",
                btnExportData: "Export Data",
                btnImportData: "Import Data",
                alertExportSuccess: "Data export started. Check your browser downloads.",
                alertImportSuccess: "Data imported successfully! Please refresh the page to apply all changes.",
                alertImportError: "Import failed! The file is invalid, corrupted, or cannot be read.",
                tooltipMarkAsViewed: "Mark as viewed",
                tooltipMarkAsUnviewed: "Mark as un-viewed",
                tooltipAddToCollection: "Add to collection",
                tooltipEditCollection: "Edit collection tags",
                tagEditorTitle: "Edit Tags",
                placeholderAddTag: "Add a new tag...",
                btnAddTag: "Add",
                btnSaveTags: "Save Changes",
                btnCancel: "Cancel",
                tabCollection: "Collection",
                collectionEmpty: "You haven't collected any items yet.",
                collectionTitle: "Your Collections",
                tooltipEditTag: "Edit tag name",
                tooltipDeleteTag: "Delete tag (from all items)",
                promptEditTag: "Enter new name for the tag:"
            },
            zh: {
                settingsTitle: "FC2PPVDB Enhanced",
                tabSettings: "设置",
                tabStatistics: "统计",
                groupFilters: "通用过滤",
                optionHideNoMagnet: "隐藏无磁力结果",
                optionHideCensored: "隐藏有码作品",
                optionHideViewed: "隐藏已浏览的作品",
                groupAppearance: "外观与交互",
                labelPreviewMode: "预览模式 (需要刷新)",
                previewModeStatic: "静态图片",
                previewModeHover: "悬浮/点击播放",
                labelCardLayout: "卡片布局",
                layoutDefault: "默认",
                layoutCompact: "紧凑",
                labelButtonStyle: "快捷按钮样式",
                buttonStyleIcon: "仅图标",
                buttonStyleText: "图标和文字",
                groupDataHistory: "数据与历史",
                optionEnableHistory: "启用浏览历史功能 (高亮/隐藏)",
                optionLoadExtraPreviews: "在详情页加载额外预览 (需要刷新)",
                optionEnableCollection: "启用收藏与标签功能 (需要刷新)",
                labelCacheManagement: "缓存管理",
                btnClearCache: "清理磁力链接缓存",
                labelHistoryManagement: "历史记录管理",
                btnClearHistory: "清除浏览历史",
                btnSaveAndApply: "保存并应用",
                alertSettingsSaved: "设置已保存！部分更改可能需要刷新页面才能完全生效。",
                alertCacheCleared: "磁力链接缓存已清除！",
                alertHistoryCleared: "浏览历史已清除！",
                menuOpenSettings: "⚙️ 打开设置面板",
                tooltipCopyMagnet: "复制磁力链接",
                tooltipCopied: "已复制!",
                tooltipLoading: "获取中...",
                extraPreviewTitle: "额外预览",
                statTotalViews: "浏览总数",
                statCachedMagnets: "缓存磁链数",
                statCacheHits: "缓存命中",
                chartLoading: "正在加载图表...",
                chartActivityTitle: "浏览活动趋势",
                chartActivityLabel: "过去30天浏览量",
                chartCacheTitle: "缓存使用率",
                chartCacheUsed: "已用缓存",
                chartCacheFree: "可用空间",
                achievementsTitle: "成就里程碑",
                statusUnlocked: "已解锁",
                statusLocked: "未解锁",
                ach_view10_title: "初窥门径", ach_view10_desc: "累计浏览10个作品",
                ach_view100_title: "渐入佳境", ach_view100_desc: "累计浏览100个作品",
                ach_view1000_title: "博览群片", ach_view1000_desc: "累计浏览1000个作品",
                ach_cache50_title: "缓存大师", ach_cache50_desc: "通过缓存加载50次磁力链接",
                ach_cache500_title: "效率专家", ach_cache500_desc: "通过缓存加载500次磁力链接",
                ach_nightOwl_title: "夜猫子", ach_nightOwl_desc: "在凌晨2点至4点之间进行过浏览",
                ach_earlyBird_title: "闻鸡起舞", ach_earlyBird_desc: "在清晨5点至7点之间进行过浏览",
                ach_weekendWarrior_title: "周末勇士", ach_weekendWarrior_desc: "在一个周末内浏览超过30个作品",
                ach_endurance_title: "持之以恒", ach_endurance_desc: "连续7天每天都有浏览记录",
                ach_fullThrottle_title: "火力全开", ach_fullThrottle_desc: "在1小时内浏览超过20个作品",
                ach_luckyNumber_title: "幸运数字", ach_luckyNumber_desc: "浏览过ID包含 \"666\" 或 \"888\" 的作品",
                ach_veteranDriver_title: "老司机", ach_veteranDriver_desc: "首次与最近一次浏览记录相隔超过365天",
                ach_achievementHunter_title: "成就猎人", ach_achievementHunter_desc: "解锁您的第一个成就",
                groupDataManagement: "数据管理",
                btnExportData: "导出数据",
                btnImportData: "导入数据",
                promptImport: "请在此处粘贴您导出的数据字符串：",
                alertExportSuccess: "数据导出已开始，请检查浏览器下载项。",
                alertImportSuccess: "数据导入成功！请刷新页面以完全应用所有更改。",
                alertImportError: "导入失败！文件无效、已损坏或无法读取。",
                tooltipMarkAsViewed: "标记为已看",
                tooltipMarkAsUnviewed: "取消标记",
                tooltipAddToCollection: "收藏",
                tooltipEditCollection: "编辑收藏标签",
                tagEditorTitle: "编辑标签",
                placeholderAddTag: "添加新标签...",
                btnAddTag: "添加",
                btnSaveTags: "保存",
                btnCancel: "取消",
                tabCollection: "收藏",
                collectionEmpty: "您还没有收藏任何项目。",
                collectionTitle: "我的收藏",
                tooltipEditTag: "编辑标签名称",
                tooltipDeleteTag: "删除标签 (将从所有项目中移除)",
                promptEditTag: "请输入标签的新名称："
            }
        },
        init() {
            const browserLang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
            if (browserLang === 'zh') this._lang = 'zh';
            else this._lang = 'en';
        },
        t(key) {
            return this._translations[this._lang]?.[key] || this._translations['en']?.[key] || key;
        }
    };
    const t = Localization.t.bind(Localization);

    class EventEmitter {
        constructor() { this.events = {}; }
        on(eventName, listener) {
            if (!this.events[eventName]) this.events[eventName] = [];
            this.events[eventName].push(listener);
        }
        emit(eventName, payload) {
            this.events[eventName]?.forEach(listener => listener(payload));
        }
    }
    const AppEvents = new EventEmitter();

    class StorageManager {
        static get(key, def) { return GM_getValue(key, def); }
        static set(key, val) { GM_setValue(key, val); }
        static delete(key) { GM_deleteValue(key); }
    }

    class StatsTracker {
        static stats = {};
        static load() { this.stats = StorageManager.get(Config.STATS_KEY, {}); }
        static save() { StorageManager.set(Config.STATS_KEY, this.stats); }
        static get(key, def = 0) { return this.stats[key] ?? def; }
        static increment(key) { this.stats[key] = (this.stats[key] || 0) + 1; this.save(); }
    }
    
    class TagEditorModal {
        constructor(fc2Id, currentTags, onSave) {
            this.fc2Id = fc2Id;
            this.currentTags = new Set(currentTags);
            this.onSave = onSave;
            this.backdrop = null;
            this.panel = null;
        }
        _createModal() {
            this.backdrop = UIBuilder.createElement('div', { className: 'enh-modal-backdrop tag-editor-backdrop' });
            this.panel = UIBuilder.createElement('div', { className: 'enh-modal-panel tag-editor-panel' });
            this.panel.innerHTML = `
                <div class="enh-modal-header tag-editor-header"><h3>${t('tagEditorTitle')}</h3></div>
                <div class="tag-editor-content"><div class="tag-checklist"></div></div>
                <div class="tag-editor-add-new">
                    <input type="text" placeholder="${t('placeholderAddTag')}" class="new-tag-input">
                    <button class="fc2-enh-btn">${t('btnAddTag')}</button>
                </div>
                <div class="enh-modal-footer tag-editor-footer">
                    <button class="fc2-enh-btn cancel-btn">${t('btnCancel')}</button>
                    <button class="fc2-enh-btn primary save-btn">${t('btnSaveTags')}</button>
                </div>
            `;
            document.body.append(this.backdrop, this.panel);
        }

        _populateTags() {
            const checklist = this.panel.querySelector('.tag-checklist');
            checklist.innerHTML = '';
            const masterList = TagManager.getMasterTagList();

            masterList.forEach(tag => {
                const isChecked = this.currentTags.has(tag);
                const id = `tag-checkbox-${tag.replace(/\s/g, '-')}`;
                const itemDiv = UIBuilder.createElement('div', { className: 'tag-checklist-item' });
                const label = UIBuilder.createElement('label', { className: 'tag-label', htmlFor: id, textContent: ` ${tag}` });
                const checkbox = UIBuilder.createElement('input', { type: 'checkbox', id, checked: isChecked });
                checkbox.dataset.tag = tag;
                label.prepend(checkbox);
                const actionsDiv = UIBuilder.createElement('div', { className: 'tag-checklist-item-actions' });
                actionsDiv.innerHTML = `
                    <button data-action="edit" data-tag="${tag}" title="${t('tooltipEditTag')}"><i class="fa-solid fa-pencil"></i></button>
                    <button data-action="delete" data-tag="${tag}" title="${t('tooltipDeleteTag')}"><i class="fa-solid fa-trash-can"></i></button>
                `;
                itemDiv.append(label, actionsDiv);
                checklist.appendChild(itemDiv);
            });
        }
        _addEventListeners() {
            const hide = () => this.hide();
            this.backdrop.addEventListener('click', hide);
            this.panel.querySelector('.cancel-btn').addEventListener('click', hide);
            this.panel.querySelector('.save-btn').addEventListener('click', () => this._handleSave());
            
            const addBtn = this.panel.querySelector('.tag-editor-add-new button');
            const addInput = this.panel.querySelector('.new-tag-input');
            const addNewTag = () => {
                const newTag = addInput.value.trim();
                if (newTag && TagManager.addMasterTag(newTag)) {
                    this.currentTags.add(newTag);
                    this._populateTags();
                    addInput.value = '';
                }
            };
            addBtn.addEventListener('click', addNewTag);
            addInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addNewTag(); });
            this.panel.querySelector('.tag-checklist').addEventListener('click', (e) => {
                const button = e.target.closest('button[data-action]');
                if (!button) return;

                const action = button.dataset.action;
                const tag = button.dataset.tag;

                if (action === 'edit') {
                    this._handleEditTag(tag);
                } else if (action === 'delete') {
                    this._handleDeleteTag(tag);
                }
            });
        }

        _handleEditTag(oldTag) {
            const newTag = prompt(t('promptEditTag'), oldTag);
            if (newTag && newTag !== oldTag) {
                if (TagManager.editMasterTag(oldTag, newTag)) {
                    if (this.currentTags.has(oldTag)) {
                        this.currentTags.delete(oldTag);
                        this.currentTags.add(newTag.trim());
                    }
                    this._populateTags();
                }
            }
        }
        
        _handleDeleteTag(tag) {
            if (confirm(`Are you sure you want to delete the tag "${tag}"? This will remove it from ALL collected items.`)) {
                if (TagManager.deleteMasterTag(tag)) {
                    this.currentTags.delete(tag);
                    this._populateTags();
                }
            }
        }

        _handleSave() {
            const newTags = [];
            this.panel.querySelectorAll('.tag-checklist input[type="checkbox"]:checked').forEach(cb => {
                newTags.push(cb.dataset.tag);
            });
            this.onSave(newTags);
            this.hide();
        }

        show() {
            this._createModal();
            this._populateTags();
            this._addEventListeners();
        }

        hide() {
            this.backdrop?.remove();
            this.panel?.remove();
        }
    }

    class TagManager {
        static TAGS_KEY = 'tags_v1';
        static MASTER_TAG_LIST_KEY = 'master_tags_v1';
        static tags = {};
        static masterTagList = new Set();
        static load() {
            this.tags = StorageManager.get(this.TAGS_KEY, {});
            const loadedMasterList = StorageManager.get(this.MASTER_TAG_LIST_KEY, []);
            this.masterTagList = new Set(loadedMasterList);
        }
        static save() {
            StorageManager.set(this.TAGS_KEY, this.tags);
            StorageManager.set(this.MASTER_TAG_LIST_KEY, [...this.masterTagList].sort());
        }

        static getTags(id) {
            return this.tags[id] || [];
        }

        static getMasterTagList() {
            return [...this.masterTagList].sort();
        }

        static getAllTaggedItems() {
            const itemsByTag = {};
            this.getMasterTagList().forEach(tag => itemsByTag[tag] = []);
            for (const id in this.tags) {
                const tags = this.tags[id];
                tags.forEach(tag => {
                    if (itemsByTag[tag]) {
                        itemsByTag[tag].push(id);
                    }
                });
            }
            return itemsByTag;
        }

        static addMasterTag(tag) {
            const trimmedTag = tag.trim();
            if (trimmedTag && !this.masterTagList.has(trimmedTag)) {
                this.masterTagList.add(trimmedTag);
                this.save();
                return true;
            }
            return false;
        }

        static editMasterTag(oldTag, newTag) {
            const trimmedNewTag = newTag.trim();
            if (!trimmedNewTag || !this.masterTagList.has(oldTag) || this.masterTagList.has(trimmedNewTag)) {
                return false;
            }
            this.masterTagList.delete(oldTag);
            this.masterTagList.add(trimmedNewTag);

            for (const id in this.tags) {
                const itemTags = new Set(this.tags[id]);
                if (itemTags.has(oldTag)) {
                    itemTags.delete(oldTag);
                    itemTags.add(trimmedNewTag);
                    this.tags[id] = [...itemTags];
                }
            }
            this.save();
            return true;
        }

        static deleteMasterTag(tagToDelete) {
            if (!this.masterTagList.has(tagToDelete)) return false;
            this.masterTagList.delete(tagToDelete);
            for (const id in this.tags) {
                const initialLength = this.tags[id].length;
                this.tags[id] = this.tags[id].filter(tag => tag !== tagToDelete);
                if (this.tags[id].length === 0 && initialLength > 0) {
                    delete this.tags[id];
                }
            }
            this.save();
            return true;
        }

        static setTags(id, tagsArray) {
            if (!id || !Array.isArray(tagsArray)) return;
            const cleanedTags = [...new Set(tagsArray.map(t => t.trim()).filter(Boolean))];
            cleanedTags.forEach(tag => this.masterTagList.add(tag));

            if (cleanedTags.length > 0) {
                this.tags[id] = cleanedTags;
            } else {
                delete this.tags[id];
            }
            this.save();
        }
    }

    class ItemDetailsManager {
        static ITEM_DETAILS_KEY = 'item_details_v1';
        static MAX_ITEM_DETAILS_SIZE = 1000;
        static details = new Map();

        static load() {
            try {
                const storedDetails = JSON.parse(StorageManager.get(this.ITEM_DETAILS_KEY, '[]'));
                this.details = new Map(storedDetails);
            } catch (e) {
                this.details = new Map();
            }
        }

        static save() {
            while (this.details.size > this.MAX_ITEM_DETAILS_SIZE) {
                const oldestKey = this.details.keys().next().value;
                this.details.delete(oldestKey);
            }
            StorageManager.set(this.ITEM_DETAILS_KEY, JSON.stringify([...this.details]));
        }

        static get(id) {
            return this.details.get(id);
        }

        static set(id, data) {
            if (!id || !data.title || !data.imageUrl) return;
            this.details.set(id, data);
            this.save();
        }
    }

    class HistoryManager {
        static history = [];
        static load() {
            if (!SettingsManager.get('enableHistory')) return;
            try {
                const storedHistory = JSON.parse(StorageManager.get(Config.HISTORY_KEY, '[]'));
                if (!Array.isArray(storedHistory)) { this.history = []; return; }
                if (storedHistory.length > 0 && typeof storedHistory[0] === 'string') {
                    this.history = storedHistory.map(id => ({ id: String(id), timestamp: Date.now() }));
                    this.save();
                } else { this.history = storedHistory; }
            } catch (e) { this.history = []; }
        }
        static save() {
            if (!SettingsManager.get('enableHistory')) return;
            if (this.history.length > Config.MAX_HISTORY_SIZE) {
                this.history.splice(0, this.history.length - Config.MAX_HISTORY_SIZE);
            }
            StorageManager.set(Config.HISTORY_KEY, JSON.stringify(this.history));
        }
        static add(id) {
            if (!SettingsManager.get('enableHistory') || !id) return;
            this.history = this.history.filter(item => item.id !== id);
            this.history.push({ id, timestamp: Date.now() });
            this.save();
        }
        static remove(id) {
            if (!SettingsManager.get('enableHistory') || !id) return;
            const initialLength = this.history.length;
            this.history = this.history.filter(item => item.id !== id);
            if (this.history.length < initialLength) {
                this.save();
            }
        }
        static has(id) {
            if (!SettingsManager.get('enableHistory')) return false;
            return this.history.some(item => item.id === id);
        }
        static getRawData() { return this.history; }
        static clear() { this.history = []; StorageManager.delete(Config.HISTORY_KEY); }
    }

    class SettingsManager {
        static settings = {};
        static defaults = {
            previewMode: 'static',
            hideNoMagnet: false,
            hideCensored: false,
            cardLayoutMode: 'default',
            buttonStyle: 'icon',
            loadExtraPreviews: false,
            enableHistory: true,
            hideViewed: false,
            enableCollection: true,
        };
        static load() { this.settings = { ...this.defaults, ...StorageManager.get(Config.SETTINGS_KEY, {}) }; }
        static get(key) { return this.settings[key]; }
        static set(key, value) {
            const oldValue = this.settings[key];
            if (oldValue !== value) {
                this.settings[key] = value;
                this.save();
                AppEvents.emit('settingsChanged', { key, newValue: value, oldValue });
            }
        }
        static save() { StorageManager.set(Config.SETTINGS_KEY, this.settings); }
    }

    class AchievementManager {
        static unlockedIds = new Set();
        static _achievements = [
            { id: 'view10', titleKey: 'ach_view10_title', descriptionKey: 'ach_view10_desc', icon: 'fa-seedling', isUnlocked: stats => stats.historyData.length >= 10 },
            { id: 'view100', titleKey: 'ach_view100_title', descriptionKey: 'ach_view100_desc', icon: 'fa-tree', isUnlocked: stats => stats.historyData.length >= 100 },
            { id: 'view1000', titleKey: 'ach_view1000_title', descriptionKey: 'ach_view1000_desc', icon: 'fa-forest', isUnlocked: stats => stats.historyData.length >= 1000 },
            { id: 'cache50', titleKey: 'ach_cache50_title', descriptionKey: 'ach_cache50_desc', icon: 'fa-bolt-lightning', isUnlocked: stats => stats.cacheStats.hits >= 50 },
            { id: 'cache500', titleKey: 'ach_cache500_title', descriptionKey: 'ach_cache500_desc', icon: 'fa-rocket', isUnlocked: stats => stats.cacheStats.hits >= 500 },
            { id: 'nightOwl', titleKey: 'ach_nightOwl_title', descriptionKey: 'ach_nightOwl_desc', icon: 'fa-moon', isUnlocked: stats => stats.historyData.some(item => { const hour = new Date(item.timestamp).getHours(); return hour >= 2 && hour < 4; })},
            { id: 'earlyBird', titleKey: 'ach_earlyBird_title', descriptionKey: 'ach_earlyBird_desc', icon: 'fa-sun', isUnlocked: stats => stats.historyData.some(item => { const hour = new Date(item.timestamp).getHours(); return hour >= 5 && hour < 7; })},
            { id: 'weekendWarrior', titleKey: 'ach_weekendWarrior_title', descriptionKey: 'ach_weekendWarrior_desc', icon: 'fa-calendar-week', isUnlocked: stats => {
                const weekendViews = new Map();
                stats.historyData.forEach(item => {
                    const date = new Date(item.timestamp);
                    const day = date.getDay();
                    if (day === 0 || day === 6) {
                        const weekStart = new Date(date);
                        weekStart.setDate(date.getDate() - day);
                        const weekKey = weekStart.toISOString().slice(0, 10);
                        weekendViews.set(weekKey, (weekendViews.get(weekKey) || 0) + 1);
                    }
                });
                return [...weekendViews.values()].some(count => count > 30);
            }},
            { id: 'endurance', titleKey: 'ach_endurance_title', descriptionKey: 'ach_endurance_desc', icon: 'fa-calendar-days', isUnlocked: stats => {
                if (stats.historyData.length < 7) return false;
                const uniqueDays = new Set(stats.historyData.map(item => new Date(item.timestamp).toISOString().slice(0, 10)));
                if (uniqueDays.size < 7) return false;
                const sortedDays = [...uniqueDays].sort();
                let consecutiveCount = 1;
                for (let i = 1; i < sortedDays.length; i++) {
                    const prevDate = new Date(sortedDays[i - 1]);
                    const currentDate = new Date(sortedDays[i]);
                    if ((currentDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
                        consecutiveCount++;
                        if (consecutiveCount >= 7) return true;
                    } else { consecutiveCount = 1; }
                }
                return false;
            }},
            { id: 'fullThrottle', titleKey: 'ach_fullThrottle_title', descriptionKey: 'ach_fullThrottle_desc', icon: 'fa-gauge-high', isUnlocked: stats => {
                if (stats.historyData.length < 20) return false;
                const sortedHistory = [...stats.historyData].sort((a, b) => a.timestamp - b.timestamp);
                for (let i = 0; i <= sortedHistory.length - 20; i++) {
                    if (sortedHistory[i + 19].timestamp - sortedHistory[i].timestamp <= 3600000) return true;
                }
                return false;
            }},
            { id: 'luckyNumber', titleKey: 'ach_luckyNumber_title', descriptionKey: 'ach_luckyNumber_desc', icon: 'fa-clover', isUnlocked: stats => stats.historyData.some(item => item.id.includes('666') || item.id.includes('888')) },
            { id: 'veteranDriver', titleKey: 'ach_veteranDriver_title', descriptionKey: 'ach_veteranDriver_desc', icon: 'fa-award', isUnlocked: stats => {
                if (stats.historyData.length < 2) return false;
                const timestamps = stats.historyData.map(item => item.timestamp);
                const minTimestamp = Math.min(...timestamps);
                const maxTimestamp = Math.max(...timestamps);
                return (maxTimestamp - minTimestamp) > (365 * 24 * 60 * 60 * 1000);
            }},
            { id: 'achievementHunter', titleKey: 'ach_achievementHunter_title', descriptionKey: 'ach_achievementHunter_desc', icon: 'fa-trophy', isUnlocked: () => AchievementManager.getUnlockedIds().size >= 1 },
        ];
        static load() { this.unlockedIds = new Set(StorageManager.get(Config.ACHIEVEMENTS_KEY, [])); }
        static checkAll(stats) {
            let newUnlocked = false;
            this._achievements.forEach(ach => {
                if (!this.unlockedIds.has(ach.id) && ach.isUnlocked(stats)) {
                    this.unlockedIds.add(ach.id);
                    newUnlocked = true;
                }
            });
            if (newUnlocked) {
                this._achievements.forEach(ach => {
                    if (ach.id === 'achievementHunter' && !this.unlockedIds.has(ach.id) && ach.isUnlocked(stats)) {
                        this.unlockedIds.add(ach.id);
                    }
                });
                StorageManager.set(Config.ACHIEVEMENTS_KEY, [...this.unlockedIds]);
            }
        }
        static getAll() { return this._achievements; }
        static getUnlockedIds() { return this.unlockedIds; }
    }

    class CacheManager {
        constructor() {
            this.key = Config.CACHE_KEY; this.maxSize = Config.CACHE_MAX_SIZE;
            this.expirationMs = Config.CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
            this.data = new Map(); this.load();
        }
        load() {
            try {
                const data = JSON.parse(StorageManager.get(this.key) || '{}');
                const now = Date.now();
                Object.entries(data)
                    .filter(([, value]) => value?.t && now - value.t < this.expirationMs)
                    .forEach(([key, value]) => this.data.set(key, value));
            } catch (e) { this.data = new Map(); }
        }
        get(id) {
            const item = this.data.get(id);
            if (!item || Date.now() - item.t >= this.expirationMs) {
                this.data.delete(id); return null;
            }
            this.data.delete(id); this.data.set(id, item);
            StatsTracker.increment('cacheHits');
            return item.v;
        }
        set(id, value) {
            if (this.data.size >= this.maxSize && !this.data.has(id)) {
                this.data.delete(this.data.keys().next().value);
            }
            this.data.set(id, { v: value, t: Date.now() });
        }
        save() { StorageManager.set(this.key, JSON.stringify(Object.fromEntries(this.data))); }
        clear() { this.data.clear(); StorageManager.delete(this.key); }
        getSize() { return this.data.size; }
    }

    class NetworkManager {
        static async fetchMagnetLinks(fc2Ids) {
            if (!fc2Ids || fc2Ids.length === 0) return new Map();
            for (let attempt = 0; attempt <= Config.NETWORK.MAX_RETRIES; attempt++) {
                try {
                    if (attempt > 0) await Utils.sleep(Config.NETWORK.RETRY_DELAY * attempt);
                    return await this._doFetchMagnets(fc2Ids);
                } catch (e) {
                    if (attempt === Config.NETWORK.MAX_RETRIES) return new Map();
                }
            }
            return new Map();
        }
        static _doFetchMagnets(ids) {
            return new Promise((resolve, reject) => {
                const query = ids.map(id => `fc2-ppv-${id}`).join('|');
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://sukebei.nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(query)}&s=seeders&o=desc`,
                    timeout: Config.NETWORK.API_TIMEOUT,
                    onload: (res) => {
                        if (res.status !== 200) return reject();
                        const magnetMap = new Map();
                        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                        doc.querySelectorAll('table.torrent-list tbody tr').forEach(row => {
                            const title = row.querySelector('td[colspan="2"] a:not(.comments)')?.textContent;
                            const magnetLink = row.querySelector("a[href^='magnet:?']")?.href;
                            const match = title?.match(/fc2-ppv-(\d+)/i);
                            if (match?.[1] && magnetLink && !magnetMap.has(match[1])) {
                                magnetMap.set(match[1], magnetLink);
                            }
                        });
                        resolve(magnetMap);
                    },
                    onerror: reject,
                    ontimeout: reject
                });
            });
        }
        static async fetchExtraPreviews(fc2Id) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://wumaobi.com/fc2daily/detail/FC2-PPV-${fc2Id}`,
                    onload: (res) => {
                        if (res.status !== 200) return resolve([]);
                        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                        const results = [];
                        doc.querySelectorAll('img').forEach(img => {
                            try {
                                const p = new URL(img.src).pathname;
                                if (!img.src.includes('watch/103281970') && !p.includes('qrcode') && p !== '/static/moechat_ads.jpg' && !p.endsWith('/cover.jpg')) {
                                    results.push({ type: 'image', src: 'https://wumaobi.com' + p });
                                }
                            } catch {}
                        });
                        doc.querySelectorAll('video').forEach(v => {
                             try { results.push({ type: 'video', src: 'https://wumaobi.com' + new URL(v.src).pathname }); } catch {}
                        });
                        resolve(results);
                    }
                });
            });
        }
    }

    class PreviewManager {
        static activePreview = null;
        static init(container, cardSelector) {
            const mode = SettingsManager.get('previewMode');
            if (mode === 'static') return;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (mode === 'hover' && !isTouchDevice) {
                container.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, cardSelector), true);
                container.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, cardSelector), true);
            } else if (mode === 'hover' && isTouchDevice) {
                 container.addEventListener('click', (e) => this.handleClick(e, cardSelector), false);
            }
        }
        static handleMouseEnter(event, cardSelector) {
            const card = event.target.closest(cardSelector);
            if (card) this._showPreview(card);
        }
        static handleMouseLeave(event, cardSelector) {
            const card = event.target.closest(cardSelector);
            if (card && this.activePreview && this.activePreview.card === card) {
                this.activePreview.hidePreview();
            }
        }
        static handleClick(event, cardSelector) {
            const card = event.target.closest(cardSelector);
            if (!card) return;
            const isAlreadyPreviewing = this.activePreview?.card === card;
            if (isAlreadyPreviewing) return;
            if (this.activePreview && this.activePreview.card !== card) {
                this.activePreview.hidePreview();
            }
            if (!card.dataset.previewStarted) {
                event.preventDefault();
                this._showPreview(card);
                card.dataset.previewStarted = "true";
            }
        }
        static async _showPreview(card) {
            if (card.dataset.previewFailed) return;
            if (this.activePreview) this.activePreview.hidePreview();
            const fc2Id = card.dataset.fc2id;
            const container = card.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
            const img = container?.querySelector('img');
            if (!fc2Id || !container || !img) return;
            let video = container.querySelector('video');
            if (!video) {
                 video = this._createVideoElement(`https://fourhoi.com/fc2-ppv-${fc2Id}/preview.mp4`, card);
                 container.appendChild(video);
            }
            img.classList.add(Config.CLASSES.hidden);
            video.classList.remove(Config.CLASSES.hidden);
            const hidePreview = () => {
                video.pause();
                video.classList.add(Config.CLASSES.hidden);
                img.classList.remove(Config.CLASSES.hidden);
                if (this.activePreview?.card === card) this.activePreview = null;
                card.dataset.previewStarted = "";
            };
            try {
                await video.play();
                this.activePreview = { video, card, hidePreview };
            } catch (e) { hidePreview(); }
        }
        static _createVideoElement(src, card) {
            const video = UIBuilder.createElement('video', {
                src: src,
                className: `${Config.CLASSES.previewElement} ${Config.CLASSES.hidden}`,
                loop: true, muted: true, playsInline: true, preload: 'auto'
            });
            const loadTimeout = setTimeout(() => video.remove(), Config.PREVIEW_VIDEO_TIMEOUT);
            video.addEventListener('loadeddata', () => clearTimeout(loadTimeout), { once: true });
            video.addEventListener('error', () => {
                video.remove();
                if (card) card.dataset.previewFailed = 'true';
            }, { once: true });
            return video;
        }
    }

    let dynamicGridStyleElement = null;
    const GRID_COLUMNS_KEY = 'user_grid_columns_preference'; 
    
    function applyCustomGridColumns(largeScreenCount) {
        if (!dynamicGridStyleElement) {
            dynamicGridStyleElement = document.createElement('style');
            dynamicGridStyleElement.id = 'enh-dynamic-grid-style';
            document.head.appendChild(dynamicGridStyleElement);
        }
        let newCss = '';

        if (largeScreenCount > 0) {
            let containerSelector = '';
            let cardWrapperSelector = '';
            if (location.hostname === 'fc2ppvdb.com') {
                containerSelector = '.flex.flex-wrap.-m-4.py-4';
                cardWrapperSelector = `${containerSelector} > .${Config.CLASSES.cardRebuilt}`;
            } else if (location.hostname === 'fd2ppv.cc') {
                if (document.querySelector('.artist-list')) {
                    containerSelector = '.artist-list';
                } else if (document.querySelector('.other-works-grid')) {
                    containerSelector = '.other-works-grid';
                }
            }
            if (containerSelector) {
                newCss = `
                    ${containerSelector} {
                        display: grid !important;
                        grid-template-columns: repeat(${largeScreenCount === 2 ? 2 : 1}, 1fr) !important;
                        gap: 1rem !important;
                        margin: 0 !important; 
                        padding: 1rem 0 !important;
                    }
                    ${cardWrapperSelector} {
                         padding: 0 !important;
                         margin: 0 !important;
                         width: auto !important;
                    }
                    ${containerSelector} .inner {
                        padding: 0 !important;
                    }
                    @media (min-width: 768px) {
                        ${containerSelector} {
                            grid-template-columns: repeat(${largeScreenCount}, 1fr) !important;
                        }
                    }
                `;
            }
        }
        dynamicGridStyleElement.innerHTML = newCss;
    }


    class StyleManager {
        static inject() {
            const C = Config.CLASSES;
            GM_addStyle(`
                /* --- 全局字体与基础 --- */
                body {
                    --fc2-enh-bg: #1e1e2e; --fc2-enh-surface: rgba(30, 30, 46, 0.8);
                    --fc2-enh-text: #cdd6f4; --fc2-enh-text-dim: #a6adc8;
                    --fc2-enh-border: rgba(205, 214, 244, 0.1); --fc2-enh-primary: #89b4fa;
                    --fc2-enh-accent-grad: linear-gradient(135deg, #cba6f7, #f5c2e7);
                    --fc2-enh-radius: 12px; --fc2-enh-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                    --fc2-enh-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                /* --- 卡片基础样式 --- */
                .${C.cardRebuilt} { border-radius: var(--fc2-enh-radius); overflow: hidden; background: #252528; border: 1px solid var(--fc2-enh-border); }
                .${C.processedCard} { position: relative; overflow: hidden; border-radius: var(--fc2-enh-radius); transition: var(--fc2-enh-transition); background: #1a1a1a; border: 2px solid transparent; }
                .${C.processedCard}:hover { transform: translateY(-6px); box-shadow: 0 10px 20px rgba(0,0,0,.4), 0 0 15px rgba(203, 166, 247, 0.3); }
                .${C.processedCard}.${C.isViewed} { border-color: #cba6f7; box-shadow: 0 0 15px rgba(203, 166, 247, 0.4); }
                .${C.videoPreviewContainer} { position: relative; width: 100%; aspect-ratio: 16 / 10; background: #000; border-radius: var(--fc2-enh-radius) var(--fc2-enh-radius) 0 0; overflow: hidden; }
                @media (max-width: 768px) { .${C.videoPreviewContainer} { height: auto; aspect-ratio: 16 / 10; } }
                .${C.videoPreviewContainer} video, .${C.videoPreviewContainer} img.${C.staticPreview} { width: 100%; height: 100%; object-fit: contain; transition: transform .4s ease; }
                .${C.processedCard}:hover .${C.videoPreviewContainer} video, .${C.processedCard}:hover .${C.videoPreviewContainer} img.${C.staticPreview} { transform: scale(1.05); }
                .${C.previewElement} { position: absolute; top: 0; left: 0; transition: opacity 0.3s ease; }
                .${C.previewElement}.${C.hidden} { opacity: 0; pointer-events: none; }
                .card-top-right-controls { position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 6px; align-items: center; }
                .card-top-right-controls .${C.resourceBtn}, .card-top-right-controls .${C.fc2IdBadge} { position: relative; padding: 4px 10px; background: rgba(0,0,0,.5); backdrop-filter: blur(8px); color: var(--fc2-enh-text); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); transition: var(--fc2-enh-transition); text-decoration: none; }
                .card-top-right-controls .${C.resourceBtn} { padding: 6px; aspect-ratio: 1; font-size: 12px; line-height: 1; }
                .card-top-right-controls .${C.fc2IdBadge} { font-size: 12px; font-weight: 700; cursor: pointer; }
                .card-top-right-controls > *:hover { background: rgba(0,0,0,.7); transform: scale(1.05); }
                .${C.fc2IdBadge}.${C.badgeCopied} { background: #a6e3a1 !important; color: #111; }
                .${C.processedCard}.${C.isViewed} .btn-toggle-view { color: var(--fc2-enh-primary); }
                .btn-toggle-view .icon-viewed { display: none !important; }
                .btn-toggle-view .icon-unviewed { display: inline-block !important; }
                .btn-toggle-view.is-viewed .icon-viewed { display: inline-block !important; }
                .btn-toggle-view.is-viewed .icon-unviewed { display: none !important; }
                .btn-toggle-tag.is-tagged { color: #f9e2af !important; }
                .tags-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
                .tag-badge { background-color: rgba(205, 214, 244, 0.1); color: var(--fc2-enh-text-dim); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; }
                .${C.infoArea} { padding: 0.5rem 0.8rem; background: #252528; display: flex; flex-direction: column; justify-content: flex-end; }
                .${C.customTitle} { color: var(--fc2-enh-text); font-size: 14px; font-weight: 600; line-height: 1.3; margin: 0 0 6px; height: 36px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
                .${C.resourceLinksContainer} { display: flex; gap: 5px; align-items: center; margin-top: auto; justify-content: flex-end; }
                .${C.resourceBtn} { position: relative; display: inline-flex; align-items: center; justify-content: center; color: var(--fc2-enh-text-dim); text-decoration: none; transition: var(--fc2-enh-transition); cursor: pointer; padding: .5em; aspect-ratio: 1; border-radius: 8px; background: rgba(255,255,255,.1); }
                .${C.resourceBtn}:hover { transform: scale(1.1); color: #fff; background: rgba(255,255,255,.15); }
                .${C.resourceBtn} i, .${C.resourceBtn} svg { font-size: .9em; pointer-events: none; }
                .${C.resourceBtn} .${C.tooltip} { position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%); background: #111; color: #fff; padding: .4em .8em; border-radius: 6px; font-size: .8em; white-space: nowrap; opacity: 0; visibility: hidden; transition: var(--fc2-enh-transition); pointer-events: none; z-index: 1000; }
                .${C.resourceBtn}:hover .${C.tooltip} { opacity: 1; visibility: visible; }
                .${C.resourceBtn} .${C.buttonText} { display: none; }
                .${C.resourceBtn}.${C.btnLoading} { cursor: not-allowed; background: #4b5563; }
                .${C.resourceBtn}.${C.btnLoading} i { animation: spin 1s linear infinite; }
                @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                .${C.preservedIconsContainer} { position: absolute; top: 10px; left: 10px; z-index: 10; display: flex; flex-direction: row; gap: 6px; }
                .preserved-icons-container > div { display: inline-flex; align-items: center; }
                .${C.cardRebuilt}.${C.hideNoMagnet}, .${C.cardRebuilt}.${C.isCensored}.${C.hideCensored}, .${C.cardRebuilt}.${C.isViewed}.${C.hideViewed} { display: none !important; }
                /* --- 额外预览 & 布局 --- */
                .${C.extraPreviewContainer} { margin-top: 1rem; }
                .${C.extraPreviewTitle} { font-size: 1.5rem; font-weight: 700; color: #fff; text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--fc2-enh-border); }
                .${C.extraPreviewGrid} { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
                .${C.extraPreviewGrid} img, .${C.extraPreviewGrid} video { max-width: 100%; height: auto; border-radius: var(--fc2-enh-radius); background: #000; }
                .layout-compact .${C.videoPreviewContainer} { aspect-ratio: 16 / 9; }
                @media (max-width: 768px) { .layout-compact .${C.videoPreviewContainer} { height: auto; aspect-ratio: 16 / 9; } }
                .layout-compact .${C.infoArea} { padding: 0.5rem 0.75rem; display: flex;; align-items: center; min-height: auto; }
                .layout-compact .${C.customTitle} { display: none !important; }
                .layout-compact .${C.resourceLinksContainer} { margin-left: auto; gap: 5px; }
                .layout-compact .${C.resourceBtn} { padding: .3em; border-radius: 6px; }
                .layout-compact .${C.resourceBtn} i { font-size: .8em; }
                .buttons-text .${C.resourceBtn} { aspect-ratio: auto; padding: .4em .7em; }
                .buttons-text .${C.resourceBtn} .${C.buttonText} { display: inline; font-size: 0.8em; margin-left: 0.4em; }
                .buttons-text .layout-compact .${C.resourceBtn} { padding: .3em .6em; }
                /* --- 通用模态框 --- */
                .enh-modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(17, 17, 27, 0.5); backdrop-filter: blur(8px); }
                .enh-modal-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--fc2-enh-bg); color: var(--fc2-enh-text); border-radius: 16px; box-shadow: var(--fc2-enh-shadow); display: flex; flex-direction: column; border: 1px solid var(--fc2-enh-border); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; }
                .enh-modal-header h2, .enh-modal-header h3 { margin: 0; font-weight: 600; }
                /* --- 设置面板 --- */
                .fc2-enh-settings-backdrop { z-index: 9998; }
                .fc2-enh-settings-panel { z-index: 9999; width: 90%; max-width: 750px; max-height: 90vh; }
                .fc2-enh-settings-header { padding: 1.25rem 2rem; border-bottom: 1px solid var(--fc2-enh-border); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
                .fc2-enh-settings-header h2 { font-size: 1.4rem; }
                .fc2-enh-settings-header .close-btn { background: none; border: none; color: var(--fc2-enh-text-dim); font-size: 1.8rem; cursor: pointer; transition: var(--fc2-enh-transition); }
                .fc2-enh-settings-header .close-btn:hover { color: #fff; transform: rotate(90deg); }
                .fc2-enh-settings-tabs { display: flex; padding: 0.5rem 2rem 0; border-bottom: 1px solid var(--fc2-enh-border); flex-shrink: 0; }
                .fc2-enh-tab-btn { background: none; border: none; color: var(--fc2-enh-text-dim); padding: 1rem 1.25rem; cursor: pointer; border-bottom: 3px solid transparent; font-size: 1rem; font-weight: 500; transition: var(--fc2-enh-transition); margin-bottom: -1px; }
                .fc2-enh-tab-btn:hover { color: var(--fc2-enh-text); }
                .fc2-enh-tab-btn.active { color: var(--fc2-enh-text); border-image: var(--fc2-enh-accent-grad) 1; }
                .fc2-enh-settings-content { padding: 2rem; overflow-y: auto; flex-grow: 1; }
                .fc2-enh-tab-content { display: none; }
                .fc2-enh-tab-content.active { display: block; animation: fadeIn 0.5s ease; }
                .fc2-enh-settings-content::-webkit-scrollbar { width: 8px; }
                .fc2-enh-settings-content::-webkit-scrollbar-track { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; }
                .fc2-enh-settings-content::-webkit-scrollbar-thumb { background-color: rgba(205, 214, 244, 0.25); border-radius: 10px; }
                .fc2-enh-settings-content::-webkit-scrollbar-thumb:hover { background-color: rgba(137, 180, 250, 0.5); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .fc2-enh-settings-group { margin-bottom: 2rem; }
                .fc2-enh-settings-group h3 { margin-top: 0; margin-bottom: 1.25rem; border-bottom: 1px solid var(--fc2-enh-border); padding-bottom: 0.75rem; font-size: 1.1rem; font-weight: 600; }
                .fc2-enh-form-row { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .fc2-enh-form-row label { font-weight: 500; }
                .fc2-enh-form-row select { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--fc2-enh-border); border-radius: 8px; padding: 0.75rem; color: var(--fc2-enh-text); box-sizing: border-box; }
                .fc2-enh-form-row select:focus { border-color: var(--fc2-enh-primary); box-shadow: 0 0 0 3px rgba(137, 180, 250, 0.3); }
                .fc2-enh-form-row label[for^="setting-"] { display: flex; align-items: center; cursor: pointer; }
                .fc2-enh-form-row select option { background: var(--fc2-enh-bg); color: var(--fc2-enh-text); }
                input[type="checkbox"] { appearance: none; width: 1.2em; height: 1.2em; border: 2px solid var(--fc2-enh-border); border-radius: 4px; margin-right: 0.75rem; display: grid; place-content: center; transition: var(--fc2-enh-transition); }
                input[type="checkbox"]::before { content: ""; width: 0.65em; height: 0.65em; transform: scale(0); transition: 120ms transform ease-in-out; background: var(--fc2-enh-accent-grad); clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }
                input[type="checkbox"]:checked { background: var(--fc2-enh-primary); border-color: var(--fc2-enh-primary); }
                input[type="checkbox"]:checked::before { transform: scale(1.2); }
                .fc2-enh-settings-footer { padding: 1.25rem 2rem; border-top: 1px solid var(--fc2-enh-border); display: flex; justify-content: flex-end; gap: 1rem; background: rgba(0,0,0,0.2); border-radius: 0 0 16px 16px; }
                .fc2-enh-btn { background: rgba(205, 214, 244, 0.1); border: 1px solid var(--fc2-enh-border); color: var(--fc2-enh-text); padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: var(--fc2-enh-transition); }
                .fc2-enh-btn:hover { transform: translateY(-2px); background: rgba(205, 214, 244, 0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                .fc2-enh-btn.primary { background: var(--fc2-enh-accent-grad); border: none; color: white; }
                .fc2-enh-btn.primary:hover { box-shadow: 0 6px 15px rgba(203, 166, 247, 0.4); }
                /* --- 标签编辑器 --- */
                .tag-editor-backdrop { z-index: 10000; }
                .tag-editor-panel { z-index: 10001; width: 90%; max-width: 400px; }
                .tag-editor-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--fc2-enh-border); }
                .tag-editor-header h3 { font-size: 1.2rem; }
                .tag-editor-content { padding: 1.5rem; max-height: 40vh; overflow-y: auto; }
                .tag-checklist { display: flex; flex-direction: column; gap: 0.75rem; }
                .tag-checklist-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
                .tag-checklist-item .tag-label { flex-grow: 1; display: flex; align-items: center; cursor: pointer; }
                .tag-checklist-item-actions { display: flex; gap: 8px; visibility: hidden; opacity: 0; transition: all 0.2s ease; }
                .tag-checklist-item:hover .tag-checklist-item-actions { visibility: visible; opacity: 1; }
                .tag-checklist-item-actions button { background: none; border: none; color: var(--fc2-enh-text-dim); cursor: pointer; font-size: 14px; padding: 4px; }
                .tag-checklist-item-actions button:hover { color: var(--fc2-enh-text); }
                .tag-editor-add-new { padding: 1rem 1.5rem; border-top: 1px solid var(--fc2-enh-border); display: flex; gap: 0.5rem; }
                .tag-editor-add-new input { flex-grow: 1; background: rgba(0,0,0,0.2); border: 1px solid var(--fc2-enh-border); border-radius: 8px; padding: 0.5rem 0.75rem; color: var(--fc2-enh-text); }
                .tag-editor-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--fc2-enh-border); display: flex; justify-content: flex-end; gap: 1rem; }
                /* --- 统计 & 成就 & 收藏页 --- */
                .fc2-enh-stats-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
                .fc2-enh-stat-card { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: var(--fc2-enh-radius); text-align: center; border: 1px solid var(--fc2-enh-border); transition: var(--fc2-enh-transition); }
                .fc2-enh-stat-card:hover { transform: translateY(-4px); background: rgba(0,0,0,0.3); }
                .fc2-enh-stat-card-value { font-size: 2rem; font-weight: bold; color: var(--fc2-enh-primary); }
                .fc2-enh-stat-card-label { font-size: 0.9rem; color: var(--fc2-enh-text-dim); margin-top: 0.5rem; }
                .fc2-enh-chart-container, .fc2-enh-achievements-container { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: var(--fc2-enh-radius); margin-top: 1.5rem; border: 1px solid var(--fc2-enh-border); }
                .fc2-enh-achievements-container h3 { margin: 0 0 1.5rem; font-size: 1.1rem; text-align: center; font-weight: 600; }
                .fc2-enh-achievements-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; }
                .fc2-enh-achievement-badge { display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 8px; transition: var(--fc2-enh-transition); border: 1px solid transparent; cursor: help; }
                .fc2-enh-achievement-badge.locked { filter: grayscale(1); opacity: 0.6; }
                .fc2-enh-achievement-badge.unlocked { background: linear-gradient(135deg, rgba(203, 166, 247, 0.1), rgba(245, 194, 231, 0.1)); border-color: rgba(203, 166, 247, 0.3); }
                .fc2-enh-achievement-badge:hover { transform: scale(1.03); border-color: rgba(205, 214, 244, 0.3); }
                .fc2-enh-achievement-badge .icon { font-size: 1.8rem; margin-right: 1rem; width: 35px; text-align: center; }
                .fc2-enh-achievement-badge.unlocked .icon { color: #f9e2af; }
                .fc2-enh-achievement-badge .details { display: flex; flex-direction: column; }
                .fc2-enh-achievement-badge .title { font-weight: bold; font-size: 0.95rem; }
                .fc2-enh-achievement-badge .description { font-size: 0.85rem; color: var(--fc2-enh-text-dim); }
                .collection-container { padding: 0.5rem; }
                .collection-container h2 { text-align: center; font-size: 1.4rem; margin-bottom: 1.5rem; }
                .collection-group { margin-bottom: 1.5rem; }
                .collection-tag-title { font-size: 1.1rem; font-weight: 600; cursor: pointer; padding: 0.5rem; border-bottom: 1px solid var(--fc2-enh-border); }
                .collection-item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; padding: 1rem 0; }
                .collection-item { display: block; text-decoration: none; color: var(--fc2-enh-text); border-radius: var(--fc2-enh-radius); overflow: hidden; background: rgba(0,0,0,0.2); transition: var(--fc2-enh-transition); }
                .collection-item:hover { transform: translateY(-4px); box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
                .collection-item img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }
                .collection-item-title { font-size: 12px; padding: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .collection-item-fallback { display: flex; align-items: center; justify-content: center; height: 80px; background: rgba(0,0,0,0.2); border-radius: 8px; text-decoration: none; color: var(--fc2-enh-text-dim); font-size: 13px; }
                .collection-empty { text-align: center; margin-top: 2rem; color: var(--fc2-enh-text-dim); }
            `);
        }
    }

    class UIBuilder {
        static createElement(tag, options = {}) {
            const el = document.createElement(tag);
            Object.entries(options).forEach(([k, v]) => k === 'className' ? el.className = v : el[k] = v);
            return el;
        }
        
        static _syncViewStatusUI(card, isViewed) {
            const C = Config.CLASSES;
            card.classList.toggle(C.isViewed, isViewed);
            const toggleViewBtn = card.querySelector('.btn-toggle-view');
            if (toggleViewBtn) {
                toggleViewBtn.classList.toggle('is-viewed', isViewed);
                const tooltip = toggleViewBtn.querySelector(`.${C.tooltip}`);
                if (tooltip) {
                    tooltip.textContent = isViewed ? t('tooltipMarkAsUnviewed') : t('tooltipMarkAsViewed');
                }
            }
        }

        static createResourceButton(type, title, icon, url) {
            const C = Config.CLASSES;
            const btn = this.createElement('a', { href: url, className: `${C.resourceBtn} ${type}` });
            if (type !== 'magnet') { btn.target = '_blank'; btn.rel = 'noopener noreferrer'; }
            btn.innerHTML = `<i class="fa-solid ${icon}"></i><span class="${C.buttonText}">${title}</span><span class="${C.tooltip}">${title}</span>`;
            return btn;
        }
        
        static createEnhancedCard(data) {
            const C = Config.CLASSES;
            const card = this.createElement('div', { className: C.processedCard });
            card.dataset.fc2id = data.fc2Id;

            if (SettingsManager.get('enableCollection')) {
                ItemDetailsManager.set(data.fc2Id, { title: data.title, imageUrl: data.imageUrl });
            }

            const preview = this.createElement('div', { className: C.videoPreviewContainer });
            const previewImage = this.createElement('img', { src: data.imageUrl, className: `${C.staticPreview} ${C.previewElement}` });
            preview.append(previewImage);

            const topRightControls = this.createElement('div', { className: 'card-top-right-controls' });

            if (SettingsManager.get('enableHistory')) {
                const isViewed = HistoryManager.has(data.fc2Id);
                const toggleViewBtn = this.createElement('a', { href: 'javascript:void(0);', className: `resource-btn btn-toggle-view` });
                if (isViewed) toggleViewBtn.classList.add('is-viewed');
                toggleViewBtn.innerHTML = `
                    <i class="fa-solid fa-eye icon-viewed"></i>
                    <i class="fa-solid fa-eye-slash icon-unviewed"></i>
                    <span class="${C.tooltip}">${isViewed ? t('tooltipMarkAsUnviewed') : t('tooltipMarkAsViewed')}</span>
                `;
                toggleViewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const cardElement = toggleViewBtn.closest(`.${C.processedCard}`);
                    const outerCard = cardElement?.closest(`.${C.cardRebuilt}`);
                    if (!cardElement) return;
                    const isNowViewed = !cardElement.classList.contains('is-viewed');
                    if (isNowViewed) {
                        HistoryManager.add(data.fc2Id);
                    } else {
                        HistoryManager.remove(data.fc2Id);
                    }
                    this._syncViewStatusUI(cardElement, isNowViewed);
                    if (outerCard) outerCard.classList.toggle('is-viewed', isNowViewed);
                    this.applyHistoryVisibility(outerCard);
                });
                topRightControls.appendChild(toggleViewBtn);
            }
            
            if (SettingsManager.get('enableCollection')) {
                const currentTags = TagManager.getTags(data.fc2Id);
                const isTagged = currentTags.length > 0;
                const tagBtn = this.createResourceButton(
                    'btn-toggle-tag',
                    isTagged ? t('tooltipEditCollection') : t('tooltipAddToCollection'),
                    isTagged ? 'fa-solid fa-star' : 'fa-regular fa-star',
                    'javascript:void(0);'
                );
                if (isTagged) tagBtn.classList.add('is-tagged');
                tagBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const onSaveCallback = (newTagsArray) => {
                        TagManager.setTags(data.fc2Id, newTagsArray);
                        const tooltip = tagBtn.querySelector(`.${C.tooltip}`);
                        const iconElement = tagBtn.querySelector('i');
                        if (!tooltip || !iconElement) return;
                        
                        const nowIsTagged = newTagsArray.length > 0;
                        tagBtn.classList.toggle('is-tagged', nowIsTagged);
                        tooltip.textContent = nowIsTagged ? t('tooltipEditCollection') : t('tooltipAddToCollection');

                        if (nowIsTagged) {
                            iconElement.classList.remove('fa-regular');
                            iconElement.classList.add('fa-solid');
                        } else {
                            iconElement.classList.remove('fa-solid');
                            iconElement.classList.add('fa-regular');
                        }
                    };
                    const modal = new TagEditorModal(data.fc2Id, TagManager.getTags(data.fc2Id), onSaveCallback);
                    modal.show();
                });
                topRightControls.appendChild(tagBtn);
            }

            const badge = this.createElement('div', { className: C.fc2IdBadge, textContent: data.fc2Id });
            badge.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                GM_setClipboard(data.fc2Id);
                badge.textContent = t('tooltipCopied');
                badge.classList.add(C.badgeCopied);
                setTimeout(() => { if (badge.isConnected) { badge.textContent = data.fc2Id; badge.classList.remove(C.badgeCopied); } }, Config.COPIED_BADGE_DURATION);
            });
            topRightControls.appendChild(badge);
            preview.appendChild(topRightControls);

            if (data.preservedIconsHTML) {
                const iconsContainer = this.createElement('div', { className: C.preservedIconsContainer, innerHTML: data.preservedIconsHTML });
                preview.appendChild(iconsContainer);
                const temp = this.createElement('div', { innerHTML: data.preservedIconsHTML });
                if (temp.querySelector('.icon-mosaic_free')?.parentElement.classList.contains('color_free0')) {
                    card.classList.add(C.isCensored);
                }
            }

            const info = this.createElement('div', { className: C.infoArea });
            if (data.title) info.appendChild(this.createElement('div', { className: C.customTitle, textContent: data.title }));
            
            const links = this.createElement('div', { className: C.resourceLinksContainer });
            const defaultLinks = [
                { name: 'MissAV', icon: 'fa-globe', urlTemplate: 'https://missav.ws/cn/fc2-ppv-%ID%' },
                { name: 'Supjav', icon: 'fa-bolt', urlTemplate: 'https://supjav.com/zh/?s=%ID%' },
                { name: 'Sukebei', icon: 'fa-magnifying-glass', urlTemplate: 'https://sukebei.nyaa.si/?f=0&c=0_0&q=%ID%' }
            ];
            defaultLinks.forEach(link => links.append(this.createResourceButton('default-search', link.name, link.icon, link.urlTemplate.replace('%ID%', data.fc2Id))));
            info.appendChild(links);
            card.append(preview, info);

            let finalElement = card;
            if (data.articleUrl) {
                finalElement = this.createElement('a', { href: data.articleUrl, style: 'text-decoration:none;' });
                finalElement.appendChild(card);
            }

            if (SettingsManager.get('enableHistory')) {
                if (HistoryManager.has(data.fc2Id)) {
                    this._syncViewStatusUI(card, true);
                }
                if (finalElement.tagName === 'A') {
                    finalElement.addEventListener('mousedown', (event) => {
                        const target = event.target;
                        if (target.closest('.btn-toggle-view') || target.closest(`.${C.fc2IdBadge}`) || target.closest(`.${C.resourceBtn}`)) {
                            return;
                        }
                        if (card.classList.contains(C.isViewed)) {
                            return;
                        }
                        HistoryManager.add(data.fc2Id);
                        this._syncViewStatusUI(card, true);
                        const outerCard = card.closest(`.${C.cardRebuilt}`);
                        this.applyHistoryVisibility(outerCard);
                    });
                }
            }
            return { finalElement, linksContainer: links, newCard: card };
        }

        static createExtraPreviewsGrid(previews) {
            if (!previews || previews.length === 0) return null;
            const C = Config.CLASSES;
            const container = this.createElement('div', { className: C.extraPreviewContainer });
            container.innerHTML = `<h2 class="${C.extraPreviewTitle}">${t('extraPreviewTitle')}</h2>`;
            const grid = this.createElement('div', { className: C.extraPreviewGrid });
            const fragment = document.createDocumentFragment();
            previews.forEach(p => {
                if (p.type === 'image') fragment.appendChild(this.createElement('img', { src: p.src, loading: 'lazy' }));
                else if (p.type === 'video') fragment.appendChild(this.createElement('video', { src: p.src, autoplay: true, loop: true, muted: true, controls: true }));
            });
            grid.appendChild(fragment);
            container.appendChild(grid);
            return container;
        }
        static toggleLoading(container, show) {
            if (!container?.isConnected) return;
            const loadingButton = container.querySelector(`.${Config.CLASSES.btnLoading}`);
            if (show && !loadingButton) container.appendChild(this.createResourceButton(Config.CLASSES.btnLoading, t('tooltipLoading'), 'fa-spinner', '#'));
            else if (!show && loadingButton) loadingButton.remove();
        }
        static addMagnetButton(container, url) {
            if (container && !container.querySelector(`.${Config.CLASSES.btnMagnet}`)) {
                const btn = this.createResourceButton('magnet', t('tooltipCopyMagnet'), 'fa-magnet', 'javascript:void(0);');
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    GM_setClipboard(url);
                    const tooltip = btn.querySelector(`.${Config.CLASSES.tooltip}`);
                    if (tooltip) {
                        tooltip.textContent = t('tooltipCopied');
                        setTimeout(() => { tooltip.textContent = t('tooltipCopyMagnet'); }, Config.COPIED_BADGE_DURATION);
                    }
                });
                container.appendChild(btn);
            }
        }
        static applyCardVisibility(card, hasMagnet) { card?.classList.toggle(Config.CLASSES.hideNoMagnet, SettingsManager.get('hideNoMagnet') && !hasMagnet); }
        static applyCensoredFilter(card) { if (card?.classList.contains(Config.CLASSES.isCensored)) card.classList.toggle(Config.CLASSES.hideCensored, SettingsManager.get('hideCensored')); }
        static applyHistoryVisibility(card) {
            if (!card) return;
            const isViewed = card.classList.contains(Config.CLASSES.isViewed);
            card.classList.toggle(Config.CLASSES.hideViewed, SettingsManager.get('hideViewed') && isViewed);
        }

    }

    class DynamicStyleApplier {
        static init() { AppEvents.on('settingsChanged', this.handleSettingsChange.bind(this)); }
        static handleSettingsChange({ key, newValue }) {
            switch (key) {
                case 'hideNoMagnet': this.applyAllCardVisibilities(); break;
                case 'hideCensored': this.applyAllCensoredFilters(); break;
                case 'hideViewed': this.applyAllHistoryVisibilities(); break;
                case 'cardLayoutMode':
                    document.body.classList.remove('layout-default', 'layout-compact');
                    document.body.classList.add(`layout-${newValue}`);
                    break;
                case 'buttonStyle':
                    document.body.classList.remove('buttons-icon', 'buttons-text');
                    document.body.classList.add(`buttons-${newValue}`);
                    break;
            }
        }
        static applyAllCardVisibilities() {
            document.querySelectorAll(`.${Config.CLASSES.cardRebuilt}`).forEach(card => {
                const hasMagnet = !!card.querySelector(`.${Config.CLASSES.btnMagnet}`);
                UIBuilder.applyCardVisibility(card, hasMagnet);
            });
        }
        static applyAllCensoredFilters() { document.querySelectorAll(`.${Config.CLASSES.cardRebuilt}`).forEach(card => UIBuilder.applyCensoredFilter(card)); }
        static applyAllHistoryVisibilities() { document.querySelectorAll(`.${Config.CLASSES.cardRebuilt}`).forEach(card => UIBuilder.applyHistoryVisibility(card)); }
    }

    // =============================================================================
    // 第二部分：基础处理器
    // =============================================================================
    class BaseListProcessor {
        constructor() {
            this.cardQueue = new Map();
            this.cache = new CacheManager();
            this.processQueueDebounced = Utils.debounce(() => this.processQueue(), Config.DEBOUNCE_DELAY);
        }
        init() {
            const targetNode = document.querySelector(this.getContainerSelector());
            if (!targetNode) return;
            PreviewManager.init(targetNode, `.${Config.CLASSES.processedCard}`);
            this.scanForCards(targetNode);
            new MutationObserver(mutations => {
                for (const m of mutations) for (const n of m.addedNodes) {
                    if (n.nodeType === 1) {
                        if (n.matches(this.getCardSelector())) this.processCard(n);
                        n.querySelectorAll(this.getCardSelector()).forEach(c => this.processCard(c));
                    }
                }
            }).observe(targetNode, { childList: true, subtree: true });
        }
        scanForCards(root = document) { root.querySelectorAll(this.getCardSelector()).forEach(c => this.processCard(c)); }
        async processQueue() {
            if (this.cardQueue.size === 0) return;
            const queue = new Map(this.cardQueue); this.cardQueue.clear();
            const toFetch = [];
            for (const [id, container] of queue.entries()) {
                const cached = this.cache.get(id);
                if (cached) this.updateCardUI(container, cached);
                else { toFetch.push(id); UIBuilder.toggleLoading(container, true); }
            }
            if (toFetch.length === 0) return;
            for (const chunk of Utils.chunk(toFetch, Config.NETWORK.CHUNK_SIZE)) {
                const results = await NetworkManager.fetchMagnetLinks(chunk);
                for (const id of chunk) {
                    const url = results.get(id) ?? null;
                    this.cache.set(id, url);
                    if (queue.has(id)) this.updateCardUI(queue.get(id), url);
                }
            }
            this.cache.save();
        }
        updateCardUI(container, magnetUrl) {
            UIBuilder.toggleLoading(container, false);
            if (magnetUrl) UIBuilder.addMagnetButton(container, magnetUrl);
            const card = container.closest(`.${Config.CLASSES.cardRebuilt}`);
            UIBuilder.applyCardVisibility(card, !!magnetUrl);
        }
        getContainerSelector() { throw new Error("Not implemented"); }
        getCardSelector() { throw new Error("Not implemented"); }
        processCard() { throw new Error("Not implemented"); }
    }
    class BaseDetailProcessor {
         constructor() { this.cache = new CacheManager(); }
        async addExtraPreviews() {
            if (!SettingsManager.get('loadExtraPreviews')) return;
            const fc2Id = Utils.extractFC2Id(location.pathname); if (!fc2Id) return;
            const anchor = document.querySelector(this.getPreviewAnchorSelector()); if (!anchor) return;
            const previewsData = await NetworkManager.fetchExtraPreviews(fc2Id);
            const previewsGrid = UIBuilder.createExtraPreviewsGrid(previewsData);
            if (previewsGrid) anchor.after(previewsGrid);
        }
        getPreviewAnchorSelector() { throw new Error("Not implemented"); }
    }

    // =============================================================================
    // 第三部分：针对特定网站的处理器
    // =============================================================================
    class FD2PPV_ListPageProcessor extends BaseListProcessor {
        getContainerSelector() { return 'body'; }
        getCardSelector() { return '.artist-card:not(.card-rebuilt):not(.other-work-item)'; }
        _extractCardData(card) {
            const link = card.querySelector('h3 a'); const img = card.querySelector('.work-photos img');
            const p = card.querySelector('p'); const mainLink = Array.from(card.querySelectorAll('a[href*="/articles/"]')).find(a => a.querySelector('img'));
            if (!link || !img || !mainLink) return null;
            const fc2Id = link.textContent.trim(); if (!/^\d{6,8}$/.test(fc2Id)) return null;
            return { fc2Id, title: p?.textContent.trim() ?? null, imageUrl: img.src, articleUrl: mainLink.href, };
        }
        processCard(card) {
            const data = this._extractCardData(card); if (!data) return;
            const icons = Array.from(card.querySelectorAll('.float[class*="free"]'));
            icons.sort((a, b) => Utils.getIconSortScore(a) - Utils.getIconSortScore(b));
            const preservedIconsHTML = icons.map(node => { const c = node.cloneNode(true); c.classList.remove('float', 'float-right', 'float-left'); return c.outerHTML; }).join('');
            const { finalElement, linksContainer, newCard } = UIBuilder.createEnhancedCard({ ...data, preservedIconsHTML });
            card.classList.add(Config.CLASSES.cardRebuilt); card.innerHTML = ''; card.appendChild(finalElement);
            if (newCard.classList.contains(Config.CLASSES.isCensored)) card.classList.add(Config.CLASSES.isCensored);
            if (newCard.classList.contains(Config.CLASSES.isViewed)) card.classList.add(Config.CLASSES.isViewed);
            UIBuilder.applyCardVisibility(card, false); UIBuilder.applyCensoredFilter(card); UIBuilder.applyHistoryVisibility(card);
            this.cardQueue.set(data.fc2Id, linksContainer); this.processQueueDebounced();
        }
    }
    class FD2PPV_ActressPageProcessor extends FD2PPV_ListPageProcessor {
        getContainerSelector() { return '.other-works-grid'; }
        getCardSelector() { return '.other-work-item.artist-card:not(.card-rebuilt)'; }
        _extractCardData(card) {
            const link = card.querySelector('.other-work-title a'); const img = card.querySelector('.work-photos img');
            if (!link || !img) return null; const fc2Id = link.textContent.trim(); if (!/^\d{6,8}$/.test(fc2Id)) return null;
            return { fc2Id, title: null, imageUrl: img.src, articleUrl: link.href };
        }
    }
    class FD2PPV_DetailPageProcessor extends BaseDetailProcessor {
        init() { this.processMainImage(); this.addExtraPreviews(); new FD2PPV_ActressPageProcessor().init(); }
        getPreviewAnchorSelector() { return '.artist-info-card'; }
        async processMainImage() {
            const mainCont = document.querySelector('.work-image-large.work-photos'); const titleEl = document.querySelector('h1.work-title');
            if (!mainCont || mainCont.classList.contains(Config.CLASSES.cardRebuilt) || !titleEl) return;
            const fc2Id = titleEl.firstChild?.textContent.trim(); const img = mainCont.querySelector('img');
            if (!fc2Id || !/^\d{6,8}$/.test(fc2Id) || !img) return;
            const { finalElement, linksContainer, newCard } = UIBuilder.createEnhancedCard({ fc2Id, title: null, imageUrl: img.src, articleUrl: null, preservedIconsHTML: null });
            const previewContainer = finalElement.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
            if (previewContainer && SettingsManager.get('previewMode') === 'autoplay') {
                 const video = PreviewManager._createVideoElement(`https://fourhoi.com/fc2-ppv-${fc2Id}/preview.mp4`, newCard);
                 previewContainer.appendChild(video); video.classList.remove(Config.CLASSES.hidden); img.classList.add(Config.CLASSES.hidden); video.play().catch(() => {});
            }
            mainCont.classList.add(Config.CLASSES.cardRebuilt); mainCont.innerHTML = ''; mainCont.appendChild(finalElement);
            PreviewManager.init(mainCont, `.${Config.CLASSES.processedCard}`);
            const cached = this.cache.get(fc2Id);
            if (cached) { if(cached) UIBuilder.addMagnetButton(linksContainer, cached); }
            else {
                UIBuilder.toggleLoading(linksContainer, true);
                const res = await NetworkManager.fetchMagnetLinks([fc2Id]);
                const url = res.get(fc2Id) ?? null; this.cache.set(fc2Id, url); this.cache.save();
                UIBuilder.toggleLoading(linksContainer, false);
                if (url) UIBuilder.addMagnetButton(linksContainer, url);
            }
        }
    }
    class FC2PPVDB_ListPageProcessor extends BaseListProcessor {
        getContainerSelector() { return '.container'; }
        getCardSelector() { return 'div.p-4:not(.card-rebuilt), div[class*="p-4"]:not(.card-rebuilt)'; }
        processCard(card) {
            if (!card.querySelector('a[href^="/articles/"]')) return;
            const link = card.querySelector('a[href^="/articles/"]'); const titleLink = card.querySelector('div.mt-1 a.text-white');
            const idSpan = card.querySelector('span.absolute.top-0.left-0'); const fc2Id = idSpan?.textContent.trim() ?? Utils.extractFC2Id(link.href);
            if (!fc2Id) return;
            const imageUrl = `https://wumaobi.com/fc2daily/data/FC2-PPV-${fc2Id}/cover.jpg`;
            const title = titleLink?.textContent.trim() ?? `FC2-PPV-${fc2Id}`;
            const { finalElement, linksContainer, newCard } = UIBuilder.createEnhancedCard({ fc2Id, title, imageUrl, articleUrl: link.href, preservedIconsHTML: null });
            card.innerHTML = ''; card.appendChild(finalElement); card.classList.add(Config.CLASSES.cardRebuilt);
            if (newCard.classList.contains(Config.CLASSES.isViewed)) card.classList.add(Config.CLASSES.isViewed);
            UIBuilder.applyCardVisibility(card, false); UIBuilder.applyHistoryVisibility(card);
            this.cardQueue.set(fc2Id, linksContainer); this.processQueueDebounced();
        }
    }
    class FC2PPVDB_DetailPageProcessor extends BaseDetailProcessor {
        init() { this.waitForElementAndProcess(); this.addExtraPreviews(); this.observeConflict(); }
        getPreviewAnchorSelector() { return '.container'; }
        waitForElementAndProcess(retries = 10, interval = 500) {
            if (retries <= 0) return;
            const container = document.querySelector('div.lg\\:w-2\\/5') ?? document.getElementById('ArticleImage')?.closest('div') ?? document.getElementById('NoImage')?.closest('div');
            if (container && !container.classList.contains(Config.CLASSES.cardRebuilt)) this.processMainImage(container);
            else if (!container) setTimeout(() => this.waitForElementAndProcess(retries - 1, interval), interval);
        }
        async processMainImage(mainContainer) {
            const fc2Id = Utils.extractFC2Id(location.href); if (!fc2Id) return;
            const imageUrl = `https://wumaobi.com/fc2daily/data/FC2-PPV-${fc2Id}/cover.jpg`;
            const { finalElement, linksContainer, newCard } = UIBuilder.createEnhancedCard({ fc2Id, title: null, imageUrl, articleUrl: null });
            const previewContainer = finalElement.querySelector(`.${Config.CLASSES.videoPreviewContainer}`);
            const img = previewContainer?.querySelector('img');
            if (previewContainer && img && SettingsManager.get('previewMode') === 'autoplay') {
                 const video = PreviewManager._createVideoElement(`https://fourhoi.com/fc2-ppv-${fc2Id}/preview.mp4`, newCard);
                 previewContainer.appendChild(video); video.classList.remove(Config.CLASSES.hidden); img.classList.add(Config.CLASSES.hidden); video.play().catch(() => {});
            }
            mainContainer.classList.add(Config.CLASSES.cardRebuilt); mainContainer.innerHTML = ''; mainContainer.appendChild(finalElement);
            PreviewManager.init(mainContainer, `.${Config.CLASSES.processedCard}`);
            const cached = this.cache.get(fc2Id);
            if (cached) { if (cached) UIBuilder.addMagnetButton(linksContainer, cached); }
            else {
                UIBuilder.toggleLoading(linksContainer, true);
                const res = await NetworkManager.fetchMagnetLinks([fc2Id]);
                const url = res.get(fc2Id) ?? null; this.cache.set(fc2Id, url); this.cache.save();
                UIBuilder.toggleLoading(linksContainer, false);
                if (url) UIBuilder.addMagnetButton(linksContainer, url);
            }
        }
        observeConflict() {
            new MutationObserver((_, obs) => {
                const img1 = document.getElementById('ArticleImage'); const img2 = document.getElementById('NoImage');
                if (img1 && img2) { img1.classList.remove('hidden'); img2.remove(); obs.disconnect(); }
            }).observe(document.body, { childList: true, subtree: true });
        }
    }

    // =============================================================================
    // 第四部分：启动器、菜单、设置面板和路由
    // =============================================================================

    class SettingsPanel {
        static panel = null; static backdrop = null; static statsRendered = false;
        static show() {
            if (!this.panel) this._createPanel();
            this.backdrop.style.display = 'block'; this.panel.style.display = 'flex';
            this._renderSettingsForm();
        }
        static hide() {
            if (this.panel) { this.backdrop.style.display = 'none'; this.panel.style.display = 'none'; }
        }
        
        static _createPanel() {
            this.backdrop = UIBuilder.createElement('div', { className: 'enh-modal-backdrop fc2-enh-settings-backdrop' });
            this.panel = UIBuilder.createElement('div', { className: 'enh-modal-panel fc2-enh-settings-panel' });
            const showCollectionTab = SettingsManager.get('enableCollection');
            this.panel.innerHTML = `
                <div class="enh-modal-header fc2-enh-settings-header">
                    <h2>${t('settingsTitle')}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="fc2-enh-settings-tabs">
                    <button class="fc2-enh-tab-btn active" data-tab="settings">${t('tabSettings')}</button>
                    ${showCollectionTab ? `<button class="fc2-enh-tab-btn" data-tab="collection">${t('tabCollection')}</button>` : ''}
                    <button class="fc2-enh-tab-btn" data-tab="statistics">${t('tabStatistics')}</button>
                </div>
                <div class="fc2-enh-settings-content">
                    <div id="tab-content-settings" class="fc2-enh-tab-content active"></div>
                    ${showCollectionTab ? `<div id="tab-content-collection" class="fc2-enh-tab-content"></div>` : ''}
                    <div id="tab-content-statistics" class="fc2-enh-tab-content"></div>
                </div>
                <div class="fc2-enh-settings-footer" id="settings-footer">
                    <button class="fc2-enh-btn primary" id="fc2-enh-save-btn">${t('btnSaveAndApply')}</button>
                </div>
            `;
            document.body.append(this.backdrop, this.panel);
            this._addEventListeners();
        }

        static _renderSettingsForm() {
            const content = this.panel.querySelector('#tab-content-settings');
            content.innerHTML = `
                <div class="fc2-enh-settings-group">
                    <h3>${t('groupFilters')}</h3>
                    <div class="fc2-enh-form-row"><label for="setting-hideNoMagnet"><input type="checkbox" id="setting-hideNoMagnet"> ${t('optionHideNoMagnet')}</label></div>
                    ${location.hostname === 'fd2ppv.cc' ? `<div class="fc2-enh-form-row"><label for="setting-hideCensored"><input type="checkbox" id="setting-hideCensored"> ${t('optionHideCensored')}</label></div>` : ''}
                    <div class="fc2-enh-form-row"><label for="setting-hideViewed"><input type="checkbox" id="setting-hideViewed"> ${t('optionHideViewed')}</label></div>
                </div>
                <div class="fc2-enh-settings-group">
                    <h3>${t('groupAppearance')}</h3>
                    <div class="fc2-enh-form-row">
                        <label for="setting-previewMode">${t('labelPreviewMode')}</label>
                        <select id="setting-previewMode">
                            <option value="static">${t('previewModeStatic')}</option>
                            <option value="hover">${t('previewModeHover')}</option>
                            <option value="autoplay" hidden>Auto Play</option>
                        </select>
                    </div>
                    <div class="fc2-enh-form-row">
                        <label for="setting-cardLayoutMode">${t('labelCardLayout')}</label>
                        <select id="setting-cardLayoutMode"><option value="default">${t('layoutDefault')}</option><option value="compact">${t('layoutCompact')}</option></select>
                        <div class="fc2-enh-form-row">
                            <label for="setting-buttonStyle">${t('labelButtonStyle')}</label>
                            <select id="setting-buttonStyle"><option value="icon">${t('buttonStyleIcon')}</option><option value="text">${t('buttonStyleText')}</option></select>
                    </div>
                    <div class="fc2-enh-form-row">
                        <label for="setting-gridColumns">每行显示列数 (桌面端)</label>
                        <select id="setting-gridColumns">
                            <option value="0">网站默认</option>
                            <option value="1">1 列</option>
                            <option value="2">2 列</option>
                            <option value="3">3 列</option>
                            <option value="4">4 列</option>
                            <option value="5">5 列</option>
                            <option value="6">6 列</option>
                        </select>
                    </div>
                    <div class="fc2-enh-form-row">
                        <label for="setting-buttonStyle">${t('labelButtonStyle')}</label>
                        <select id="setting-buttonStyle">
                            <option value="icon">${t('buttonStyleIcon')}</option>
                            <option value="text">${t('buttonStyleText')}</option>
                        </select>
                    </div>
                </div>
                <div class="fc2-enh-settings-group">
                    <h3>${t('groupDataHistory')}</h3>
                    <div class="fc2-enh-form-row"><label for="setting-enableHistory"><input type="checkbox" id="setting-enableHistory"> ${t('optionEnableHistory')}</label></div>
                    <div class="fc2-enh-form-row"><label for="setting-enableCollection"><input type="checkbox" id="setting-enableCollection"> ${t('optionEnableCollection')}</label></div>
                    <div class="fc2-enh-form-row"><label for="setting-loadExtraPreviews"><input type="checkbox" id="setting-loadExtraPreviews"> ${t('optionLoadExtraPreviews')}</label></div>
                    <div class="fc2-enh-form-row"><label>${t('labelCacheManagement')}</label><button class="fc2-enh-btn" id="fc2-enh-clear-cache-btn">${t('btnClearCache')}</button></div>
                    <div class="fc2-enh-form-row"><label>${t('labelHistoryManagement')}</label><button class="fc2-enh-btn" id="fc2-enh-clear-history-btn">${t('btnClearHistory')}</button></div>
                    <div class="fc2-enh-form-row" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--fc2-enh-border);">
                        <label>${t('groupDataManagement')}</label>
                        <div style="display: flex; gap: 1rem;">
                            <button class="fc2-enh-btn" id="fc2-enh-export-btn">${t('btnExportData')}</button>
                            <button class="fc2-enh-btn" id="fc2-enh-import-btn">${t('btnImportData')}</button>
                        </div>
                    </div>
                </div>
            `;
            this.panel.querySelector('#setting-previewMode').value = SettingsManager.get('previewMode');
            this.panel.querySelector('#setting-hideNoMagnet').checked = SettingsManager.get('hideNoMagnet');
            if (location.hostname === 'fd2ppv.cc') this.panel.querySelector('#setting-hideCensored').checked = SettingsManager.get('hideCensored');
            this.panel.querySelector('#setting-hideViewed').checked = SettingsManager.get('hideViewed');
            this.panel.querySelector('#setting-cardLayoutMode').value = SettingsManager.get('cardLayoutMode');
            this.panel.querySelector('#setting-buttonStyle').value = SettingsManager.get('buttonStyle');
            this.panel.querySelector('#setting-loadExtraPreviews').checked = SettingsManager.get('loadExtraPreviews');
            this.panel.querySelector('#setting-enableHistory').checked = SettingsManager.get('enableHistory');
            this.panel.querySelector('#setting-enableCollection').checked = SettingsManager.get('enableCollection');
            this.panel.querySelector('#setting-gridColumns').value = GM_getValue(GRID_COLUMNS_KEY, 0);
        }
        static _loadScript(url) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${url}"]`)) return resolve();
                const script = document.createElement('script'); script.src = url;
                script.onload = () => resolve(); script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
                document.head.appendChild(script);
            });
        }
        static async _renderStatistics() {
            if (this.statsRendered) return;
            const content = this.panel.querySelector('#tab-content-statistics');
            content.innerHTML = `
                <div class="fc2-enh-stats-overview">
                    <div class="fc2-enh-stat-card"><div id="stat-history-total" class="fc2-enh-stat-card-value">0</div><div class="fc2-enh-stat-card-label">${t('statTotalViews')}</div></div>
                    <div class="fc2-enh-stat-card"><div id="stat-cache-total" class="fc2-enh-stat-card-value">0</div><div class="fc2-enh-stat-card-label">${t('statCachedMagnets')}</div></div>
                    <div class="fc2-enh-stat-card"><div id="stat-cache-hits" class="fc2-enh-stat-card-value">0</div><div class="fc2-enh-stat-card-label">${t('statCacheHits')}</div></div>
                </div>
                <div class="fc2-enh-chart-container" id="activity-chart-wrapper">${t('chartLoading')}</div>
                <div class="fc2-enh-chart-container" id="cache-chart-wrapper">${t('chartLoading')}</div>
                <div id="achievements-placeholder"></div>
            `;
            const historyData = HistoryManager.getRawData();
            const cache = new CacheManager(); const cacheSize = cache.getSize(); const maxCacheSize = Config.CACHE_MAX_SIZE;
            const cacheStats = { hits: StatsTracker.get('cacheHits', 0) };
            AchievementManager.checkAll({ historyData, cacheStats });
            content.querySelector('#stat-history-total').textContent = historyData.length;
            content.querySelector('#stat-cache-total').textContent = cacheSize;
            content.querySelector('#stat-cache-hits').textContent = cacheStats.hits;
            this._renderAchievements(content.querySelector('#achievements-placeholder'), AchievementManager.getAll(), AchievementManager.getUnlockedIds());
            try {
                if (typeof Chart === 'undefined') await this._loadScript('https://cdn.jsdelivr.net/npm/chart.js');
                const activityWrapper = content.querySelector('#activity-chart-wrapper'); const cacheWrapper = content.querySelector('#cache-chart-wrapper');
                activityWrapper.innerHTML = '<canvas id="activityChart"></canvas>'; cacheWrapper.innerHTML = '<canvas id="cacheChart"></canvas>';
                Chart.defaults.color = '#a6adc8'; Chart.defaults.borderColor = 'rgba(205, 214, 244, 0.1)';
                this._renderActivityChart(content.querySelector('#activityChart'), historyData);
                this._renderCacheChart(content.querySelector('#cacheChart'), cacheSize, maxCacheSize);
            } catch (error) {
                content.querySelector('#activity-chart-wrapper').textContent = 'Chart loading failed.';
                content.querySelector('#cache-chart-wrapper').textContent = 'Chart loading failed.';
            }
            this.statsRendered = true;
        }
        static _renderAchievements(container, allAchievements, unlockedIds) {
            let gridHTML = `<div class="fc2-enh-achievements-container"><h3>${t('achievementsTitle')}</h3><div class="fc2-enh-achievements-grid">`;
            allAchievements.forEach(ach => {
                const isUnlocked = unlockedIds.has(ach.id);
                const statusClass = isUnlocked ? 'unlocked' : 'locked';
                gridHTML += `
                    <div class="fc2-enh-achievement-badge ${statusClass}" title="${t(ach.descriptionKey)}">
                        <div class="icon"><i class="fa-solid ${ach.icon}"></i></div>
                        <div class="details">
                            <div class="title">${t(ach.titleKey)}</div>
                            <div class="description">${isUnlocked ? t('statusUnlocked') : t('statusLocked')}</div>
                        </div>
                    </div>`;
            });
            gridHTML += `</div></div>`;
            container.innerHTML = gridHTML;
        }

        static _renderCollection() {
            const content = this.panel.querySelector('#tab-content-collection');
            const taggedItemsByTag = TagManager.getAllTaggedItems();
            const currentDomain = location.hostname;
            let html = `<div class="collection-container"><h2>${t('collectionTitle')}</h2>`;
            let hasItems = false;
            for (const tag in taggedItemsByTag) {
                const items = taggedItemsByTag[tag];
                if (items.length > 0) {
                    hasItems = true;
                    html += `<details class="collection-group" open><summary class="collection-tag-title">${tag} (${items.length})</summary>`;
                    html += `<div class="collection-item-grid">`;
                    items.forEach(id => {
                        const details = ItemDetailsManager.get(id);
                        const articleUrl = `https://${currentDomain}/articles/${id}`;
                        if (details) {
                            html += `
                                <a href="${articleUrl}" target="_blank" class="collection-item">
                                    <img src="${details.imageUrl}" loading="lazy">
                                    <div class="collection-item-title">${details.title}</div>
                                </a>`;
                        } else {
                            html += `
                                <a href="${articleUrl}" target="_blank" class="collection-item-fallback">
                                    FC2-PPV-${id}
                                </a>`;
                        }
                    });
                    html += `</div></details>`;
                }
            }
            if (!hasItems) {
                html += `<p class="collection-empty">${t('collectionEmpty')}</p>`;
            }
            html += `</div>`;
            content.innerHTML = html;
        }

        static _renderActivityChart(canvas, historyData) {
            if (!canvas) return;
            const activityData = new Map();
            for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); activityData.set(d.toISOString().slice(0, 10), 0); }
            const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            historyData.filter(item => item.timestamp >= thirtyDaysAgo.getTime()).forEach(item => {
                const dateStr = new Date(item.timestamp).toISOString().slice(0, 10);
                if (activityData.has(dateStr)) activityData.set(dateStr, activityData.get(dateStr) + 1);
            });
            new Chart(canvas.getContext('2d'), { type: 'line', data: { labels: [...activityData.keys()].map(d => d.slice(5)), datasets: [{ label: t('chartActivityLabel'), data: [...activityData.values()], borderColor: '#89b4fa', backgroundColor: 'rgba(137, 180, 250, 0.2)', fill: true, tension: 0.4 }] }, options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: t('chartActivityTitle'), color: '#cdd6f4' }}} });
        }

        static _renderCacheChart(canvas, cacheSize, maxCacheSize) {
            if (!canvas) return;
            new Chart(canvas.getContext('2d'), { type: 'doughnut', data: { labels: [t('chartCacheUsed'), t('chartCacheFree')], datasets: [{ data: [cacheSize, Math.max(0, maxCacheSize - cacheSize)], backgroundColor: ['#89b4fa', 'rgba(0,0,0,0.3)'], borderColor: 'rgba(30, 30, 46, 0.8)', borderWidth: 4 }] }, options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#cdd6f4' } }, title: { display: true, text: t('chartCacheTitle'), color: '#cdd6f4' }}} });
        }

        static _exportData() {
            try {
                const exportData = {
                    __id: 'FC2PPVDB_Enhanced_Backup',
                    __version: GM_info.script.version,
                    settings: StorageManager.get(Config.SETTINGS_KEY, {}),
                    history: JSON.parse(StorageManager.get(Config.HISTORY_KEY, '[]')),
                    stats: StorageManager.get(Config.STATS_KEY, {}),
                    achievements: StorageManager.get(Config.ACHIEVEMENTS_KEY, [])
                };
                const exportString = JSON.stringify(exportData, null, 2);
                const blob = new Blob([exportString], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `fc2-enhanced-backup-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
                console.log(t('alertExportSuccess')); 
            } catch (e) {
                console.error("Failed to export data:", e);
            }
        }

        static _importData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const importString = event.target.result;
                    this._processImportedData(importString);
                };
                reader.onerror = () => {
                    console.error("Failed to read file:", reader.error);
                    alert(t('alertImportError'));
                };
                reader.readAsText(file);
            });
            input.click();
        }

        static _processImportedData(importString) {
            try {
                const importData = JSON.parse(importString);
                if (importData.__id !== 'FC2PPVDB_Enhanced_Backup' || !importData.settings) {
                    throw new Error("Invalid data format.");
                }
                if (importData.settings) StorageManager.set(Config.SETTINGS_KEY, importData.settings);
                if (importData.history && Array.isArray(importData.history)) StorageManager.set(Config.HISTORY_KEY, JSON.stringify(importData.history));
                if (importData.stats) StorageManager.set(Config.STATS_KEY, importData.stats);
                if (importData.achievements && Array.isArray(importData.achievements)) StorageManager.set(Config.ACHIEVEMENTS_KEY, importData.achievements);
                this.statsRendered = false;            
                alert(t('alertImportSuccess'));
                this.hide();
            } catch (e) {
                console.error("Failed to import data:", e);
                alert(t('alertImportError'));
            }
        }

        static _save() {
            const gridColumns = parseInt(this.panel.querySelector('#setting-gridColumns').value, 10);
            GM_setValue(GRID_COLUMNS_KEY, gridColumns);
            const newSettings = {
                previewMode: this.panel.querySelector('#setting-previewMode').value,
                hideNoMagnet: this.panel.querySelector('#setting-hideNoMagnet').checked,
                hideViewed: this.panel.querySelector('#setting-hideViewed').checked,
                cardLayoutMode: this.panel.querySelector('#setting-cardLayoutMode').value,
                buttonStyle: this.panel.querySelector('#setting-buttonStyle').value,
                loadExtraPreviews: this.panel.querySelector('#setting-loadExtraPreviews').checked,
                enableHistory: this.panel.querySelector('#setting-enableHistory').checked,
                enableCollection: this.panel.querySelector('#setting-enableCollection').checked,
            };
            if (location.hostname === 'fd2ppv.cc') newSettings.hideCensored = this.panel.querySelector('#setting-hideCensored').checked;
            Object.entries(newSettings).forEach(([key, value]) => SettingsManager.set(key, value));
            alert(t('alertSettingsSaved'));
            this.hide();
        }
        
        static _addEventListeners() {
            this.panel.querySelector('.close-btn').addEventListener('click', () => this.hide());
            this.backdrop.addEventListener('click', () => this.hide());
            this.panel.querySelector('#fc2-enh-save-btn').addEventListener('click', () => this._save());
            this.panel.querySelector('#tab-content-settings').addEventListener('click', e => {
                if (e.target.id === 'fc2-enh-clear-cache-btn') { new CacheManager().clear(); alert(t('alertCacheCleared')); this.statsRendered = false; }
                if (e.target.id === 'fc2-enh-clear-history-btn') { HistoryManager.clear(); alert(t('alertHistoryCleared')); this.statsRendered = false; }
                if (e.target.id === 'fc2-enh-export-btn') { this._exportData(); }
                if (e.target.id === 'fc2-enh-import-btn') { this._importData(); }
            });
            this.panel.querySelectorAll('.fc2-enh-tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    this.panel.querySelectorAll('.fc2-enh-tab-btn, .fc2-enh-tab-content').forEach(el => el.classList.remove('active'));
                    e.target.classList.add('active');
                    this.panel.querySelector(`#tab-content-${tabName}`).classList.add('active');
                    this.panel.querySelector('#settings-footer').style.display = (tabName === 'settings') ? 'flex' : 'none';
                    if (tabName === 'statistics') this._renderStatistics();
                    if (tabName === 'collection' && SettingsManager.get('enableCollection')) {
                        this._renderCollection();
                    }
                });
            });
            this.panel.querySelector('#tab-content-settings').addEventListener('change', e => {
                if (e.target.id === 'setting-gridColumns') {
                    const newColumnCount = parseInt(e.target.value, 10);
                    applyCustomGridColumns(newColumnCount);
                }
            });
        }

    }

    class MenuManager {
        static menuIds = [];
        static register() {
            this.menuIds.forEach(GM_unregisterMenuCommand); this.menuIds = [];
            this.menuIds.push(GM_registerMenuCommand(t('menuOpenSettings'), () => SettingsPanel.show()));
        }
    }

    class ProcessorFactory {
        static create(name) {
            const P = { FD2PPV_ListPageProcessor, FD2PPV_ActressPageProcessor, FD2PPV_DetailPageProcessor, FC2PPVDB_ListPageProcessor, FC2PPVDB_DetailPageProcessor };
            if (P[name]) return new P[name]();
            throw new Error(`Processor ${name} not found.`);
        }
    }

    function main() {
        Localization.init();
        StatsTracker.load();
        SettingsManager.load();
        HistoryManager.load();
        AchievementManager.load();
        if (SettingsManager.get('enableCollection')) {
            TagManager.load();
            ItemDetailsManager.load();
        }
        StyleManager.inject();
        const savedColumns = GM_getValue(GRID_COLUMNS_KEY, 0);
        applyCustomGridColumns(savedColumns);
        MenuManager.register();
        DynamicStyleApplier.init();
        document.body.classList.add(`layout-${SettingsManager.get('cardLayoutMode')}`);
        document.body.classList.add(`buttons-${SettingsManager.get('buttonStyle')}`);
        const siteConfig = Config.SITES[location.hostname]; if (!siteConfig) return;
        const route = siteConfig.routes.find(r => r.path.test(location.pathname));
        if (route) {
            try { ProcessorFactory.create(route.processor).init(); }
            catch (error) { console.error('Script execution error:', error); }
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
    else main();

})();