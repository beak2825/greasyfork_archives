// ==UserScript==
// @name          LANraragi EHentai 评论区
// @namespace     https://github.com/Kelcoin
// @version       4.1
// @description   在 LANraragi 阅读器底部显示 EH 评论
// @author        Kelcoin
// @match         *://*/reader?id=*
// @connect       e-hentai.org
// @connect       exhentai.org
// @connect       githubusercontent.com
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_registerMenuCommand
// @run-at        document-idle
// @icon          https://e-hentai.org/favicon.ico
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/560857/LANraragi%20EHentai%20%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560857/LANraragi%20EHentai%20%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 默认配置与常量 ---
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 缓存有效期：24小时
    const DEFAULT_CONFIG = {
        cookie: '',
        autoLoad: false,
        disableCache: false,
        maxComments: 45,
        fontFamily: 'Microsoft YaHei, "Segoe UI", sans-serif',
        fontSize: '14px',
        sortMethod: 'score', // 'score' or 'time'
        sortOrder: 'desc',   // 'asc' or 'desc'
        minScore: 0,          // 最低显示分数，默认 0
        enablePost: true,     // 启用评论发布/编辑
        blockWordsLocal: '',  // 本地屏蔽词（原始文本）
        blockWordsRemote: '', // 远程导入的屏蔽词（原始文本）
        blockWordsRemoteUrl: '', // 远程屏蔽词 URL
        theme: 'modern'       // 新增：主题选择 'modern' or 'traditional'
    };

    // 读取配置
    let CONFIG = {
        cookie: GM_getValue('eh_cookie', DEFAULT_CONFIG.cookie),
        autoLoad: GM_getValue('auto_load', DEFAULT_CONFIG.autoLoad),
        disableCache: GM_getValue('disable_cache', DEFAULT_CONFIG.disableCache),
        maxComments: GM_getValue('max_comments', DEFAULT_CONFIG.maxComments),
        fontFamily: GM_getValue('font_family', DEFAULT_CONFIG.fontFamily),
        fontSize: GM_getValue('font_size', DEFAULT_CONFIG.fontSize),
        sortMethod: GM_getValue('sort_method', DEFAULT_CONFIG.sortMethod),
        sortOrder: GM_getValue('sort_order', DEFAULT_CONFIG.sortOrder),
        minScore: GM_getValue('min_score', DEFAULT_CONFIG.minScore),
        enablePost: GM_getValue('enable_post', DEFAULT_CONFIG.enablePost),
        blockWordsLocal: GM_getValue('block_words_local', DEFAULT_CONFIG.blockWordsLocal),
        blockWordsRemote: GM_getValue('block_words_remote', DEFAULT_CONFIG.blockWordsRemote),
        blockWordsRemoteUrl: GM_getValue('block_words_remote_url', DEFAULT_CONFIG.blockWordsRemoteUrl),
        theme: GM_getValue('theme', DEFAULT_CONFIG.theme)
    };

    // 最近一次载入的评论列表，用于排序切换时重渲染
    let LAST_COMMENTS = null;
    // 存储API相关信息以便投票
    let API_DATA = {};
    // 当前画廊 URL
    let CURRENT_GALLERY_URL = '';

    // --- [修复核心] Cookie 增强处理函数 ---
    // 确保发送请求时一定带有 nw=1，避免 Content Warning
    function getSafeCookie() {
        let c = (CONFIG.cookie || '').trim();
        if (!c) return '';

        // 如果末尾没有分号，补上分号以便拼接
        if (!c.endsWith(';')) c += ';';

        // 强制检查并追加 nw=1
        if (!c.includes('nw=1')) {
            c += ' nw=1;';
        }
        return c;
    }

    // --- 主题定义 (CSS 变量) ---
    const THEMES = {
        modern: `
            :root {
                --lrr-bg: rgba(28, 30, 36, 0.96);
                --lrr-box-bg: rgba(40, 43, 52, 0.98);
                --lrr-item-bg: rgba(35, 37, 44, 0.96);
                --lrr-uploader-bg: rgba(45, 48, 58, 0.98);
                --lrr-text: #e3e9f3;
                --lrr-text-sub: #a7b1c2;
                --lrr-accent: #4a9ff0;
                --lrr-accent-hover: #62b2ff;
                --lrr-border: rgba(140, 160, 190, 0.28);
                --lrr-radius: 16px;
                --lrr-btn-radius: 10px;
                --lrr-shadow: 0 10px 28px -8px rgba(5, 10, 25, 0.72);
                --lrr-input-bg: rgba(22, 24, 30, 0.96);
                --lrr-highlight: #4a9ff0;
                --lrr-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
        `,
        traditional: `
            :root {
                --lrr-bg: #34353b;
                --lrr-box-bg: #34353b;
                --lrr-item-bg: #4f535b;
                --lrr-uploader-bg: #5c5040;
                --lrr-text: #dddddd;
                --lrr-text-sub: #b0b0b0;
                --lrr-accent: #5c0d12;
                --lrr-accent-hover: #7a151b;
                --lrr-border: #5c5c5c;
                --lrr-radius: 0px;
                --lrr-btn-radius: 2px;
                --lrr-shadow: 0 2px 5px rgba(0,0,0,0.5);
                --lrr-input-bg: #2b2b2b;
                --lrr-highlight: #ffffff;
            }
        `
    };

    // --- 样式注入 ---
    function injectStyles() {
        const themeCSS = THEMES[CONFIG.theme] || THEMES.modern;

        const mainCSS = `
            ${themeCSS}
            #lrr-eh-comments-box {
                box-sizing: border-box;
                width: 100%;
                max-width: 1100px;
                margin: 25px auto;
                background: var(--lrr-box-bg);
                color: var(--lrr-text);
                border-radius: var(--lrr-radius);
                padding: 20px;
                box-shadow: var(--lrr-shadow);
                border: 1px solid var(--lrr-border);
                display: block;
                opacity: 1;
                transition: opacity 0.3s;
                text-align: left !important;
                backdrop-filter: blur(5px);
            }
            #lrr-eh-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid var(--lrr-accent);
                padding-bottom: 12px;
                margin-bottom: 15px;
            }
            #lrr-eh-title {
                font-size: 1.2em;
                font-weight: bold;
                color: var(--lrr-text);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .lrr-eh-tag {
                font-size: 0.75em;
                background: rgba(255,255,255,0.1);
                padding: 2px 6px;
                border-radius: 4px;
                color: var(--lrr-text-sub);
                font-weight: normal;
                border: 1px solid rgba(255,255,255,0.05);
            }
            .lrr-eh-btn {
                background: var(--lrr-accent);
                color: white;
                border: none;
                padding: 6px 12px;
                cursor: pointer;
                border-radius: var(--lrr-btn-radius);
                margin-left: 8px;
                font-size: 0.9em;
                transition: background 0.2s, transform 0.1s;
                font-family: inherit;
            }
            .lrr-eh-btn:hover { background: var(--lrr-accent-hover); }
            .lrr-eh-btn:active { transform: translateY(1px); }
            .lrr-eh-btn:disabled { background: #444; cursor: not-allowed; opacity: 0.7; }
            .lrr-eh-btn.secondary { background: rgba(255,255,255,0.1); border: 1px solid var(--lrr-border); }
            .lrr-eh-btn.secondary:hover { background: rgba(255,255,255,0.2); }

            #lrr-eh-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-size: 0.9em;
            }
            .lrr-eh-toolbar-left {
                color: var(--lrr-text-sub);
            }
            .lrr-eh-sort-group {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .lrr-eh-sort-label {
                font-size: 0.85em;
                color: var(--lrr-text-sub);
            }
            .lrr-eh-sort-btn {
                background: var(--lrr-input-bg);
                border-radius: var(--lrr-btn-radius);
                border: 1px solid var(--lrr-border);
                padding: 3px 8px;
                cursor: pointer;
                color: var(--lrr-text-sub);
                font-size: 0.85em;
                transition: all 0.2s;
            }
            .lrr-eh-sort-btn.active {
                background: var(--lrr-accent);
                border-color: var(--lrr-accent);
                color: #fff;
            }

            .lrr-eh-order-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 3px 8px;
                border: 1px solid var(--lrr-border);
                border-radius: var(--lrr-btn-radius);
                background: var(--lrr-input-bg);
                cursor: pointer;
                box-sizing: border-box;
            }
            .lrr-eh-order-btn-arrow {
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
            }
            .lrr-eh-order-btn.asc .lrr-eh-order-btn-arrow {
                border-bottom: none;
                border-top: 7px solid var(--lrr-text);
            }
            .lrr-eh-order-btn.desc .lrr-eh-order-btn-arrow {
                border-top: none;
                border-bottom: 7px solid var(--lrr-text);
            }

            .lrr-comment-item {
                background: var(--lrr-item-bg);
                margin-bottom: 12px;
                padding: 12px;
                border-radius: var(--lrr-btn-radius);
                border-left: 4px solid rgba(255,255,255,0.2);
                text-align: left !important;
                transition: transform 0.1s;
            }
            .lrr-comment-item:hover {
                 box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .lrr-comment-item.is-uploader {
                border-left: 4px solid #ff9800;
                background: var(--lrr-uploader-bg);
            }
            .lrr-c-meta {
                font-size: 0.85em;
                color: var(--lrr-text-sub);
                margin-bottom: 8px;
                display: grid;
                grid-template-columns: 1fr auto auto;
                column-gap: 10px;
                align-items: center;
            }
            .lrr-c-user { font-weight: bold; color: var(--lrr-highlight); }
            .lrr-c-user.is-self { color: #69f0ae !important; }

            .lrr-c-uploader-badge {
                background: #ff9800; color: #000;
                font-size: 0.75em; padding: 1px 4px;
                border-radius: 3px; margin-left: 6px;
                font-weight: bold;
            }
            .lrr-c-time {
                opacity: 0.6;
                text-align: right;
            }
            .lrr-c-score-wrapper {
                text-align: right;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .lrr-c-score {
                font-weight: bold;
                margin-left: 5px;
            }
            .lrr-c-score.positive { color: #a5dc86; }
            .lrr-c-score.negative { color: #f27474; }

            .lrr-vote-btn {
                background: none;
                border: 1px solid transparent;
                color: #666;
                cursor: pointer;
                padding: 0 4px;
                border-radius: 3px;
                font-size: 1.1em;
                line-height: 1;
                font-family: "Arial", sans-serif;
                transition: all 0.2s;
            }
            .lrr-vote-btn:hover { background: rgba(255,255,255,0.1); color: var(--lrr-text); }
            .lrr-vote-btn.up.voted {
                color: #a5dc86;
                font-weight: bold;
                text-shadow: 0 0 2px rgba(165,220,134,0.3);
            }
            .lrr-vote-btn.down.voted {
                color: #f27474;
                font-weight: bold;
                text-shadow: 0 0 2px rgba(242,116,116,0.3);
            }

            .lrr-c-actions { font-size: 0.9em; color: #aaa; }
            .lrr-c-edit-btn {
                background: none; border: none;
                color: #999; cursor: pointer;
                margin-left: 10px; text-decoration: underline;
                font-size: 0.85em;
            }
            .lrr-c-edit-btn:hover { color: #fff; }

            .lrr-c-body {
                line-height: 1.6;
                word-wrap: break-word;
                overflow-wrap: break-word;
                text-align: left !important;
                color: var(--lrr-text);
            }
            .lrr-c-body a { color: var(--lrr-highlight); text-decoration: none; border-bottom: 1px dashed rgba(255,255,255,0.3); }
            .lrr-c-body a:hover { text-decoration: none; border-bottom: 1px solid var(--lrr-highlight); }

            /* Post Box & Edit Box */
            .lrr-post-box {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid var(--lrr-border);
            }
            .lrr-edit-box { margin-top: 8px; }
            .lrr-post-textarea, .lrr-edit-textarea {
                width: 100%;
                height: 80px;
                background: var(--lrr-input-bg);
                border: 1px solid var(--lrr-border);
                color: var(--lrr-text);
                padding: 10px;
                border-radius: var(--lrr-btn-radius);
                resize: vertical;
                box-sizing: border-box;
                font-family: inherit;
                transition: border-color 0.2s;
            }
            .lrr-post-textarea:focus, .lrr-edit-textarea:focus {
                border-color: var(--lrr-accent);
                outline: none;
            }
            .lrr-post-actions, .lrr-edit-actions {
                margin-top: 8px;
                text-align: right;
            }

            #lrr-eh-settings-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.8); z-index: 99999;
                display: none; justify-content: center; align-items: center;
                backdrop-filter: blur(4px);
                text-align: left;
            }
            #lrr-eh-settings-box {
                background: var(--lrr-box-bg);
                color: var(--lrr-text);
                padding: 25px;
                border-radius: var(--lrr-radius);
                width: 480px; max-width: 90%;
                box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                border: 1px solid var(--lrr-border);
            }
            #lrr-eh-settings-box h3 { margin-top: 0; border-bottom: 1px solid var(--lrr-border); padding-bottom: 10px; color: var(--lrr-text); }
            .lrr-set-row { margin-bottom: 15px; }
            .lrr-set-row label { display: block; font-weight: bold; margin-bottom: 6px; font-size: 0.9em; color: var(--lrr-text-sub); }
            .lrr-set-row input[type="text"], .lrr-set-row select, .lrr-set-row textarea {
                width: 100%; padding: 8px;
                border: 1px solid var(--lrr-border);
                background: var(--lrr-input-bg);
                color: var(--lrr-text);
                border-radius: 4px;
                box-sizing: border-box; font-size: inherit; font-family: inherit;
            }
            .lrr-set-row input[type="text"]:focus, .lrr-set-row select:focus, .lrr-set-row textarea:focus {
                border-color: var(--lrr-accent);
                outline: none;
            }
            .lrr-set-row textarea {
                height: 70px;
                font-family: monospace;
                font-size: 0.85em;
            }
            .lrr-set-checkbox { display: flex; align-items: center; cursor: pointer; color: var(--lrr-text); }

            .lrr-fix-checkbox {
                appearance: checkbox !important;
                -webkit-appearance: checkbox !important;
                width: 16px !important; height: 16px !important;
                margin-right: 8px !important;
                position: static !important;
                opacity: 1 !important;
                display: inline-block !important;
                accent-color: var(--lrr-accent);
            }
            .lrr-fix-checkbox::before, .lrr-fix-checkbox::after { content: none !important; display: none !important; }

            .lrr-eh-actions { text-align: right; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--lrr-border); }
        `;

        GM_addStyle(mainCSS);
    }

    // 时间格式化
    function formatTimeCN(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');

        return `${y}-${m}-${d} ${h}:${min}`;
    }

    // HTML 转义
    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function safeParseJson(text) {
        if (!text || typeof text !== 'string') return null;
        try { return JSON.parse(text); } catch (e) { return null; }
    }

    // 解析屏蔽词
    function parseBlockWordsToArray(raw) {
        if (!raw || typeof raw !== 'string') return [];
        const trimmed = raw.trim();
        if (!trimmed) return [];

        const maybeJson = safeParseJson(trimmed);
        let words = [];

        if (maybeJson) {
            if (Array.isArray(maybeJson)) {
                words = maybeJson;
            } else if (maybeJson && Array.isArray(maybeJson.words)) {
                words = maybeJson.words;
            }
        } else {
            words = trimmed.split(/\r?\n/);
        }

        return words.map(w => (typeof w === 'string' ? w.trim() : '')).filter(w => w.length > 0);
    }

    function getAllBlockWords() {
        const localWords = parseBlockWordsToArray(CONFIG.blockWordsLocal || '');
        const remoteWords = parseBlockWordsToArray(CONFIG.blockWordsRemote || '');
        const all = [...localWords, ...remoteWords].map(w => w.toLowerCase());
        return Array.from(new Set(all));
    }

    // 阻止 LRR 快捷键触发
    function preventGlobalShortcuts(element) {
        if (!element) return;
        ['keydown', 'keyup', 'keypress'].forEach(eventType => {
            element.addEventListener(eventType, (e) => {
                e.stopPropagation();
            });
        });
    }

    // 初始化
    function init() {
        injectStyles(); // 注入主题样式

        const sourceUrl = findSourceUrl();
        if (!sourceUrl) return;

        CURRENT_GALLERY_URL = sourceUrl;
        createUI(sourceUrl);

        if (CONFIG.autoLoad) {
            loadComments(sourceUrl, false);
        }
    }

    function findSourceUrl() {
        const tagNamespaces = document.querySelectorAll('.caption-namespace');
        for (let ns of tagNamespaces) {
            if (ns.textContent.trim().toLowerCase().includes('source') || ns.classList.contains('source-tag')) {
                const parentTr = ns.closest('tr');
                if (parentTr) {
                    const link = parentTr.querySelector('a');
                    if (link && /https?:\/\/(e-hentai\.org|exhentai\.org)\/g\//.test(link.href)) {
                        return link.href;
                    }
                }
            }
        }
        return null;
    }

    // UI
    function createUI(url) {
        let targetElement = null;

        const allLinks = Array.from(document.querySelectorAll('a'));
        const actionLink = allLinks.find(a =>
            a.textContent.includes('全尺寸') ||
            a.textContent.includes('Full Size') ||
            a.textContent.includes('随机') ||
            a.textContent.includes('Random')
        );

        if (actionLink) {
            targetElement = actionLink.closest('div.ip') || actionLink.closest('#i5') || actionLink.parentElement.parentElement;
        } else {
            targetElement = document.querySelector('#i5') || document.querySelector('.ip');
        }

        if (!targetElement) return;

        const container = document.createElement('div');
        container.id = 'lrr-eh-comments-box';
        container.style.fontFamily = CONFIG.fontFamily;

        container.innerHTML = `
            <div id="lrr-eh-header">
                <span id="lrr-eh-title">
                    EH 评论
                    <span id="lrr-eh-status" class="lrr-eh-tag" style="display:none"></span>
                </span>
                <div>
                    <button id="lrr-eh-load-btn" class="lrr-eh-btn" ${CONFIG.autoLoad ? 'style="display:none"' : ''}>加载评论</button>
                    <button id="lrr-eh-open-gallery-btn" class="lrr-eh-btn secondary">跳转画廊</button>
                    <button id="lrr-eh-settings-btn" class="lrr-eh-btn secondary">设置</button>
                </div>
            </div>
            <div id="lrr-eh-content">
                ${CONFIG.autoLoad ? '<div style="text-align:center; padding:20px;">正在从缓存或服务器加载...</div>' : '<div style="text-align:center; padding:10px; color:#aaa;">点击上方按钮加载评论</div>'}
            </div>
        `;

        targetElement.insertAdjacentElement('afterend', container);

        const loadBtn = document.getElementById('lrr-eh-load-btn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                loadBtn.style.display = 'none';
                loadComments(url, false);
            });
        }

        document.getElementById('lrr-eh-settings-btn').addEventListener('click', showSettings);
        document.getElementById('lrr-eh-open-gallery-btn').addEventListener('click', () => {
            window.open(url, '_blank');
        });

        const statusEl = document.getElementById('lrr-eh-status');
        if (statusEl) {
            statusEl.style.cursor = 'pointer';
            statusEl.title = '点击强制从服务器刷新评论';
            statusEl.addEventListener('click', () => {
                loadComments(url, true);
            });
        }

        createSettingsModal(url);
    }

    function createSettingsModal(currentUrl) {
        const modal = document.createElement('div');
        modal.id = 'lrr-eh-settings-overlay';

        const allBlockWords = getAllBlockWords();

        modal.innerHTML = `
            <div id="lrr-eh-settings-box" style="font-family: ${CONFIG.fontFamily}; font-size: ${CONFIG.fontSize};">
                <h3>LRR EH 评论插件设置</h3>

                <div class="lrr-set-row">
                    <label>主题风格</label>
                    <select id="lrr-eh-theme-select">
                        <option value="modern" ${CONFIG.theme === 'modern' ? 'selected' : ''}>现代</option>
                        <option value="traditional" ${CONFIG.theme === 'traditional' ? 'selected' : ''}>传统</option>
                    </select>
                </div>

                <div class="lrr-set-row" style="display:flex; gap:10px;">
                    <label class="lrr-set-checkbox" style="flex:1">
                        <input type="checkbox" id="lrr-eh-autoload-chk" class="lrr-fix-checkbox" ${CONFIG.autoLoad ? 'checked' : ''}> 自动加载评论
                    </label>
                    <label class="lrr-set-checkbox" style="flex:1">
                        <input type="checkbox" id="lrr-eh-enablepost-chk" class="lrr-fix-checkbox" ${CONFIG.enablePost ? 'checked' : ''}> 启用评论发布/编辑
                    </label>
                </div>

                <div class="lrr-set-row" style="display:flex; gap:10px;">
                    <label class="lrr-set-checkbox" style="flex:1">
                        <input type="checkbox" id="lrr-eh-disablecache-chk" class="lrr-fix-checkbox" ${CONFIG.disableCache ? 'checked' : ''}> 禁用缓存
                    </label>
                </div>

                <div class="lrr-set-row" style="display:flex; gap:10px;">
                    <div style="flex:1">
                        <label>最低显示分数</label>
                        <input type="text" id="lrr-eh-minscore-input" value="${CONFIG.minScore}" placeholder="0">
                    </div>
                    <div style="flex:1">
                        <label>最大显示评论数</label>
                        <input type="text" id="lrr-eh-maxcomments-input" value="${CONFIG.maxComments}" placeholder="45">
                    </div>
                </div>

                <div class="lrr-set-row" style="display:flex; gap:10px;">
                    <div style="flex:2">
                        <label>字体 (CSS Font Family)</label>
                        <input type="text" id="lrr-eh-font-input" value="${CONFIG.fontFamily}" placeholder="例如: Microsoft YaHei">
                    </div>
                    <div style="flex:1">
                        <label>字号</label>
                        <input type="text" id="lrr-eh-size-input" value="${CONFIG.fontSize}" placeholder="14px">
                    </div>
                </div>

                <div class="lrr-set-row">
                    <label>EH Cookie (ExHentai 必填，用于投票和评论)</label>
                    <textarea id="lrr-eh-cookie-input" placeholder="igneous=...; ipb_member_id=...; ipb_pass_hash=...;">${escapeHtml(CONFIG.cookie)}</textarea>
                </div>

                <div class="lrr-set-row">
                    <label>本地屏蔽词（一行一个或 JSON）</label>
                    <textarea id="lrr-eh-blockwords-local" placeholder='每行一个关键词，或 JSON 格式'>${escapeHtml(CONFIG.blockWordsLocal)}</textarea>
                    <div style="font-size:0.8em;color:var(--lrr-text-sub);margin-top:4px;">
                        JSON 示例：{"lastUpdateDate":"2025/07/25","words":["123"]}
                    </div>
                </div>

                <div class="lrr-set-row">
                    <label>远程屏蔽词 URL</label>
                    <input type="text" id="lrr-eh-blockwords-url" value="${escapeHtml(CONFIG.blockWordsRemoteUrl || '')}" placeholder="https://example.com/blockwords.json">
                    <button id="lrr-eh-blockwords-import" class="lrr-eh-btn secondary" style="margin-top:8px;">从远程导入</button>
                    <div id="lrr-eh-blockwords-remote-status" style="font-size:0.8em;color:var(--lrr-text-sub);margin-top:4px;"></div>
                    <div style="font-size:0.8em;color:var(--lrr-text-sub);margin-top:4px;">
                        当前总屏蔽词数量：${allBlockWords.length}
                    </div>
                </div>

                <div class="lrr-eh-actions">
                    <button id="lrr-eh-clear-cache" class="lrr-eh-btn secondary" style="float:left; background:#843a3a; border-color:#843a3a;">清除当前缓存</button>
                    <button id="lrr-eh-cancel-btn" class="lrr-eh-btn secondary">取消</button>
                    <button id="lrr-eh-save-btn" class="lrr-eh-btn">保存并刷新</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 防止在设置面板输入时触发 LRR 快捷键
        const settingsInputs = modal.querySelectorAll('input[type="text"], textarea');
        settingsInputs.forEach(input => preventGlobalShortcuts(input));

        const remoteStatusEl = document.getElementById('lrr-eh-blockwords-remote-status');

        function updateRemoteStatusText() {
            const remoteWords = parseBlockWordsToArray(CONFIG.blockWordsRemote || '');
            if (remoteWords.length > 0) {
                remoteStatusEl.textContent = `已保存远程屏蔽词 ${remoteWords.length} 个。`;
            } else {
                remoteStatusEl.textContent = '尚未导入远程屏蔽词。';
            }
        }
        updateRemoteStatusText();

        const importBtn = document.getElementById('lrr-eh-blockwords-import');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const urlInput = document.getElementById('lrr-eh-blockwords-url');
                const url = urlInput ? urlInput.value.trim() : '';
                if (!url) {
                    remoteStatusEl.textContent = '请先填写远程屏蔽词 URL。';
                    return;
                }

                remoteStatusEl.textContent = '正在从远程加载屏蔽词...';

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.status === 200) {
                            const text = response.responseText || '';
                            const words = parseBlockWordsToArray(text);
                            if (words.length === 0) {
                                remoteStatusEl.textContent = '未从远程数据中解析出有效屏蔽词。';
                                return;
                            }
                            CONFIG.blockWordsRemote = text;
                            CONFIG.blockWordsRemoteUrl = url;
                            GM_setValue('block_words_remote', CONFIG.blockWordsRemote);
                            GM_setValue('block_words_remote_url', CONFIG.blockWordsRemoteUrl);
                            remoteStatusEl.textContent = `已导入远程屏蔽词 ${words.length} 个。`;
                        } else {
                            remoteStatusEl.textContent = `远程请求失败：HTTP ${response.status}。`;
                        }
                    },
                    onerror: function() {
                        remoteStatusEl.textContent = '远程请求失败，请检查网络或 URL以及脚本是否有权限访问该链接。';
                    }
                });
            });
        }

        document.getElementById('lrr-eh-save-btn').addEventListener('click', () => {
            CONFIG.autoLoad = document.getElementById('lrr-eh-autoload-chk').checked;
            CONFIG.enablePost = document.getElementById('lrr-eh-enablepost-chk').checked;
            CONFIG.disableCache = document.getElementById('lrr-eh-disablecache-chk').checked;
            CONFIG.fontFamily = document.getElementById('lrr-eh-font-input').value;
            CONFIG.fontSize = document.getElementById('lrr-eh-size-input').value;
            CONFIG.theme = document.getElementById('lrr-eh-theme-select').value; // 保存主题

            const maxInput = document.getElementById('lrr-eh-maxcomments-input').value.trim();
            let maxVal = parseInt(maxInput, 10);
            if (!Number.isFinite(maxVal) || maxVal <= 0) {
                maxVal = DEFAULT_CONFIG.maxComments;
            }
            CONFIG.maxComments = maxVal;

            const minScoreInput = document.getElementById('lrr-eh-minscore-input').value.trim();
            let minScoreVal = parseInt(minScoreInput, 10);
            if (!Number.isFinite(minScoreVal)) {
                minScoreVal = DEFAULT_CONFIG.minScore;
            }
            CONFIG.minScore = minScoreVal;

            CONFIG.cookie = document.getElementById('lrr-eh-cookie-input').value.trim();

            const blockLocalEl = document.getElementById('lrr-eh-blockwords-local');
            CONFIG.blockWordsLocal = blockLocalEl ? blockLocalEl.value : '';

            const blockUrlEl = document.getElementById('lrr-eh-blockwords-url');
            CONFIG.blockWordsRemoteUrl = blockUrlEl ? blockUrlEl.value.trim() : CONFIG.blockWordsRemoteUrl;

            GM_setValue('auto_load', CONFIG.autoLoad);
            GM_setValue('enable_post', CONFIG.enablePost);
            GM_setValue('disable_cache', CONFIG.disableCache);
            GM_setValue('font_family', CONFIG.fontFamily);
            GM_setValue('font_size', CONFIG.fontSize);
            GM_setValue('max_comments', CONFIG.maxComments);
            GM_setValue('min_score', CONFIG.minScore);
            GM_setValue('eh_cookie', CONFIG.cookie);
            GM_setValue('block_words_local', CONFIG.blockWordsLocal);
            GM_setValue('block_words_remote', CONFIG.blockWordsRemote);
            GM_setValue('block_words_remote_url', CONFIG.blockWordsRemoteUrl);
            GM_setValue('theme', CONFIG.theme);

            modal.style.display = 'none';
            location.reload();
        });

        document.getElementById('lrr-eh-clear-cache').addEventListener('click', () => {
            const cacheKey = 'eh_cache_' + btoa(currentUrl);
            GM_deleteValue(cacheKey);
            alert('缓存已清除，下次加载将重新从服务器获取。');
            modal.style.display = 'none';
        });

        document.getElementById('lrr-eh-cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    function showSettings() {
        document.getElementById('lrr-eh-settings-overlay').style.display = 'flex';
    }

    // 数据获取（含缓存）
    function loadComments(url, forceRefresh) {
        const cacheKey = 'eh_cache_' + btoa(url);
        const cachedData = GM_getValue(cacheKey, null);

        if (!CONFIG.disableCache && !forceRefresh && cachedData) {
            const now = Date.now();
            if (now - cachedData.timestamp < CACHE_EXPIRY) {
                console.log('[LRR-EH] 使用缓存数据');
                updateStatusTag("缓存");
                if (cachedData.apiData) API_DATA = cachedData.apiData;
                renderComments(cachedData.comments);
                return;
            }
        }

        updateStatusTag("Fetching...");
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "Cookie": getSafeCookie(), // [修复] 使用处理后的 Cookie
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            onload: function(response) {
                if (response.status === 200) {
                    let comments = parseHTML(response.responseText);
                    if (comments.length > 0 || API_DATA.gid) {
                        GM_setValue(cacheKey, {
                            timestamp: Date.now(),
                            comments: comments,
                            apiData: API_DATA
                        });
                        updateStatusTag("实时");
                        renderComments(comments);
                    } else {
                        renderError("未发现评论，或解析失败。");
                    }
                } else if (response.status === 404) {
                    renderError("画廊已不可用 (404)。");
                } else {
                    renderError(`请求错误: HTTP ${response.status}。请检查Cookie。`);
                }
            },
            onerror: function() {
                renderError("网络请求失败。");
            }
        });
    }

    function parseHTML(htmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const apiuidMatch = htmlText.match(/var\s+apiuid\s*=\s*(\d+)/);
        const apikeyMatch = htmlText.match(/var\s+apikey\s*=\s*"([^"]+)"/);
        const gidMatch = htmlText.match(/var\s+gid\s*=\s*(\d+)/);
        const tokenMatch = htmlText.match(/var\s+token\s*=\s*"([^"]+)"/);
        const apiUrlMatch = htmlText.match(/var\s+api_url\s*=\s*"([^"]+)"/);

        API_DATA = {
            apiuid: apiuidMatch ? parseInt(apiuidMatch[1]) : null,
            apikey: apikeyMatch ? apikeyMatch[1] : null,
            gid: gidMatch ? parseInt(gidMatch[1]) : null,
            token: tokenMatch ? tokenMatch[1] : null,
            apiUrl: apiUrlMatch ? apiUrlMatch[1] : "https://e-hentai.org/api.php"
        };

        if (doc.querySelector('h1')?.textContent.includes('Content Warning')) {
             renderError("遇到内容警告页。虽然脚本已尝试修复 Cookie，但若您未登录或 Cookie 完全失效，请在设置中更新有效 Cookie。");
             return [];
        }

        const commentDivs = doc.querySelectorAll('#cdiv .c1');
        let comments = [];

        commentDivs.forEach(el => {
            try {
                let commentId = 0;
                const idAnchor = el.previousElementSibling;
                if(idAnchor && idAnchor.name && idAnchor.name.startsWith('c')) {
                    commentId = idAnchor.name.substring(1);
                } else {
                    const c6 = el.querySelector('.c6');
                    if (c6 && c6.id && c6.id.startsWith('comment_')) {
                        commentId = c6.id.substring(8);
                    }
                }

                const editLink = el.querySelector('.c4 a[onclick*="edit_comment"]');
                const isEditable = !!editLink;

                const voteUpLink = el.querySelector('.c4 a[id^="comment_vote_up"]');
                const voteDownLink = el.querySelector('.c4 a[id^="comment_vote_down"]');
                let myVote = 0;

                const hasStyle = (link) => {
                    const s = link.getAttribute('style');
                    return s && (s.includes('color') || s.includes('font-weight'));
                };

                if (voteUpLink && hasStyle(voteUpLink)) {
                    myVote = 1;
                } else if (voteDownLink && hasStyle(voteDownLink)) {
                    myVote = -1;
                }

                const metaBlock = el.querySelector('.c3');
                const userLink = metaBlock.querySelector('a');
                const userName = userLink ? userLink.textContent : (metaBlock.textContent.match(/Posted by:? (.*?) on/)?.[1] || "Unknown");
                const rawTime = metaBlock.textContent.match(/Posted on (.*?) by/)?.[1] || "";

                const timestamp = Date.parse(rawTime + " UTC") || 0;

                const scoreBlock = el.querySelector('.c5 span');
                const scoreText = scoreBlock ? scoreBlock.textContent : "0";
                const score = parseInt(scoreText.replace(/[^0-9+-]/g, '')) || 0;

                const contentBlock = el.querySelector('.c6');
                let contentHtml = contentBlock ? contentBlock.innerHTML : "";

                const isUploader = !!(el.querySelector('a[name="ulcomment"]'));

                comments.push({
                    id: commentId,
                    user: userName,
                    timestamp: timestamp,
                    score: score,
                    content: contentHtml,
                    isUploader: isUploader,
                    isEditable: isEditable,
                    myVote: myVote
                });

            } catch (e) { console.error(e); }
        });

        return comments;
    }

    // 执行投票
    function doVote(commentId, voteValue) {
        if (!CONFIG.cookie) {
            alert('请先在设置中填写 EH Cookie 才能进行投票。');
            return;
        }
        if (!API_DATA.apikey || !API_DATA.apiuid || !API_DATA.gid || !API_DATA.token) {
            alert('无法获取投票所需的 API 参数，请尝试重新加载评论。');
            return;
        }

        const payload = {
            method: "votecomment",
            apiuid: API_DATA.apiuid,
            apikey: API_DATA.apikey,
            gid: API_DATA.gid,
            token: API_DATA.token,
            comment_id: parseInt(commentId),
            comment_vote: voteValue
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: API_DATA.apiUrl,
            headers: {
                "Content-Type": "application/json",
                "Cookie": getSafeCookie() // [修复] 使用处理后的 Cookie
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.comment_vote !== undefined) {
                        const cacheKey = 'eh_cache_' + btoa(CURRENT_GALLERY_URL);
                        GM_deleteValue(cacheKey);
                        loadComments(CURRENT_GALLERY_URL, true);
                    } else {
                        alert("投票失败: " + (res.error || "未知错误"));
                    }
                } catch(e) {
                    alert("投票响应解析失败: " + e.message);
                }
            },
            onerror: function() {
                alert("投票网络请求失败");
            }
        });
    }

    // 发布评论
    function postComment() {
        const textarea = document.getElementById('lrr-new-comment-text');
        if (!textarea) return;
        const text = textarea.value;
        if (!text.trim()) {
            alert("评论内容不能为空");
            return;
        }

        const data = `commenttext_new=${encodeURIComponent(text)}&post_comment=Post+Comment`;

        const btn = document.getElementById('lrr-post-btn');
        if(btn) {
            btn.disabled = true;
            btn.textContent = "发送中...";
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: CURRENT_GALLERY_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": getSafeCookie() // [修复] 使用处理后的 Cookie
            },
            data: data,
            onload: function(response) {
                if(btn) {
                    btn.disabled = false;
                    btn.textContent = "发表评论";
                }
                if (response.status === 200) {
                    textarea.value = "";
                    loadComments(CURRENT_GALLERY_URL, true);
                } else {
                    alert("发布评论失败，HTTP " + response.status);
                }
            },
            onerror: function() {
                if(btn) {
                    btn.disabled = false;
                    btn.textContent = "发表评论";
                }
                alert("发布评论网络请求失败");
            }
        });
    }

    // 编辑评论提交
    function submitEdit(commentId) {
        const textarea = document.getElementById(`lrr-edit-text-${commentId}`);
        if (!textarea) return;
        const text = textarea.value;
        if (!text.trim()) {
            alert("评论内容不能为空");
            return;
        }

        const data = `edit_comment=${commentId}&commenttext_edit=${encodeURIComponent(text)}&edit_comment_submit=Edit+Comment`;

        GM_xmlhttpRequest({
            method: "POST",
            url: CURRENT_GALLERY_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": getSafeCookie() // [修复] 使用处理后的 Cookie
            },
            data: data,
            onload: function(response) {
                if (response.status === 200) {
                    loadComments(CURRENT_GALLERY_URL, true);
                } else {
                    alert("编辑评论失败，HTTP " + response.status);
                }
            },
            onerror: function() {
                alert("编辑评论网络请求失败");
            }
        });
    }

    // 渲染评论
    function renderComments(comments) {
        const contentDiv = document.getElementById('lrr-eh-content');
        if (!contentDiv) return;

        LAST_COMMENTS = comments ? comments.slice() : [];
        const hasUserCommented = LAST_COMMENTS.some(c => c.isEditable);
        let workingList = LAST_COMMENTS.slice();
        const minScore = Number.isFinite(CONFIG.minScore) ? CONFIG.minScore : DEFAULT_CONFIG.minScore;

        workingList = workingList.filter(c => c.isUploader || c.score >= minScore);

        const blockWords = getAllBlockWords();
        if (blockWords.length > 0) {
            workingList = workingList.filter(c => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = c.content || '';
                const textContent = (tempDiv.textContent || '').toLowerCase();
                return !blockWords.some(word => textContent.includes(word));
            });
        }

        const orderFactor = (CONFIG.sortOrder === 'asc') ? 1 : -1;
        workingList.sort((a, b) => {
            if (a.isUploader !== b.isUploader) {
                return a.isUploader ? -1 : 1;
            }
            if (CONFIG.sortMethod === 'time') {
                return (b.timestamp - a.timestamp) * orderFactor;
            } else {
                return (b.score - a.score) * orderFactor;
            }
        });

        const displayList = workingList.slice(0, CONFIG.maxComments);
        contentDiv.style.fontSize = CONFIG.fontSize;

        const orderText = CONFIG.sortOrder === 'asc' ? '正序' : '倒序';
        const methodLabel = CONFIG.sortMethod === 'time' ? '时间' : '分数';

        contentDiv.innerHTML = `
            <div id="lrr-eh-toolbar">
                <div class="lrr-eh-toolbar-left">
                    排序：<span class="lrr-eh-tag">${methodLabel} / ${orderText}</span>
                    <span class="lrr-eh-tag" style="margin-left:8px;">最低分数：${minScore}</span>
                </div>
                <div class="lrr-eh-sort-group">
                    <span class="lrr-eh-sort-label">排序方式</span>
                    <button id="lrr-eh-sort-score" class="lrr-eh-sort-btn ${CONFIG.sortMethod === 'score' ? 'active' : ''}">分数</button>
                    <button id="lrr-eh-sort-time" class="lrr-eh-sort-btn ${CONFIG.sortMethod === 'time' ? 'active' : ''}">时间</button>
                    <button id="lrr-eh-order-btn" class="lrr-eh-order-btn ${CONFIG.sortOrder === 'asc' ? 'asc' : 'desc'}">
                        <span class="lrr-eh-order-btn-arrow"></span>
                    </button>
                </div>
            </div>
            <div id="lrr-eh-list"></div>
        `;

        const listDiv = document.getElementById('lrr-eh-list');

        if (!displayList.length) {
            listDiv.innerHTML = '<div style="padding:10px; opacity:0.7;">无评论。</div>';
        } else {
            listDiv.innerHTML = '';
            displayList.forEach(c => {
                const item = document.createElement('div');
                item.className = 'lrr-comment-item';
                item.id = `lrr-comment-${c.id}`;
                if (c.isUploader) item.classList.add('is-uploader');

                const scoreClass = c.score > 0 ? 'positive' : (c.score < 0 ? 'negative' : '');
                const scoreSign = c.score > 0 ? '+' : '';
                const uploaderBadge = c.isUploader ? '<span class="lrr-c-uploader-badge">UP</span>' : '';

                const displayTime = formatTimeCN(c.timestamp) || "Unknown Date";

                let scoreHtml = '';
                if (!c.isUploader) {
                    scoreHtml = `<span class="lrr-c-score ${scoreClass}">分数 ${scoreSign}${c.score}</span>`;
                    if (CONFIG.cookie && API_DATA.apikey && !hasUserCommented) {
                        const upActive = c.myVote === 1 ? 'voted' : '';
                        const downActive = c.myVote === -1 ? 'voted' : '';
                        scoreHtml += `
                            <button class="lrr-vote-btn up ${upActive}" data-id="${c.id}">▲</button>
                            <button class="lrr-vote-btn down ${downActive}" data-id="${c.id}">▼</button>
                        `;
                    }
                }

                let editHtml = '';
                if (c.isEditable && CONFIG.enablePost && CONFIG.cookie) {
                    editHtml = `<button class="lrr-c-edit-btn" data-id="${c.id}">编辑</button>`;
                }

                let userDisplayName = c.user;
                let userClass = "";
                if (c.isEditable) {
                    userDisplayName = c.user + "(你)";
                    userClass = "is-self";
                }

                item.innerHTML = `
                    <div class="lrr-c-meta">
                        <div>
                            <span class="lrr-c-user ${userClass}">${userDisplayName}</span>
                            ${uploaderBadge}
                            ${editHtml}
                        </div>
                        <div class="lrr-c-time">${displayTime}</div>
                        <div class="lrr-c-score-wrapper">
                            ${scoreHtml}
                        </div>
                    </div>
                    <div class="lrr-c-body" id="lrr-c-body-${c.id}">${c.content}</div>
                `;
                listDiv.appendChild(item);
            });
        }

        if (CONFIG.cookie && CONFIG.enablePost && !hasUserCommented) {
            const postBox = document.createElement('div');
            postBox.className = 'lrr-post-box';
            postBox.innerHTML = `
                <textarea id="lrr-new-comment-text" class="lrr-post-textarea" placeholder="在此输入评论..."></textarea>
                <div class="lrr-post-actions">
                    <button id="lrr-post-btn" class="lrr-eh-btn">发表评论</button>
                </div>
            `;
            listDiv.appendChild(postBox);
            preventGlobalShortcuts(document.getElementById('lrr-new-comment-text'));
            document.getElementById('lrr-post-btn').addEventListener('click', postComment);
        }

        listDiv.querySelectorAll('.lrr-vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const id = targetBtn.getAttribute('data-id');
                const isUp = targetBtn.classList.contains('up');
                doVote(id, isUp ? 1 : -1);
            });
        });

        listDiv.querySelectorAll('.lrr-c-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const bodyDiv = document.getElementById(`lrr-c-body-${id}`);
                const currentText = bodyDiv.innerText;

                bodyDiv.innerHTML = `
                    <div class="lrr-edit-box">
                        <textarea id="lrr-edit-text-${id}" class="lrr-edit-textarea">${escapeHtml(currentText)}</textarea>
                        <div class="lrr-edit-actions">
                            <button class="lrr-eh-btn secondary cancel-edit" data-id="${id}">取消</button>
                            <button class="lrr-eh-btn save-edit" data-id="${id}">保存</button>
                        </div>
                    </div>
                `;
                preventGlobalShortcuts(document.getElementById(`lrr-edit-text-${id}`));

                bodyDiv.querySelector('.cancel-edit').addEventListener('click', () => {
                    renderComments(LAST_COMMENTS);
                });
                bodyDiv.querySelector('.save-edit').addEventListener('click', () => {
                    submitEdit(id);
                });
            });
        });

        const sortScoreBtn = document.getElementById('lrr-eh-sort-score');
        const sortTimeBtn = document.getElementById('lrr-eh-sort-time');
        const orderBtn = document.getElementById('lrr-eh-order-btn');

        if (sortScoreBtn) {
            sortScoreBtn.addEventListener('click', () => {
                CONFIG.sortMethod = 'score';
                GM_setValue('sort_method', CONFIG.sortMethod);
                renderComments(LAST_COMMENTS);
            });
        }
        if (sortTimeBtn) {
            sortTimeBtn.addEventListener('click', () => {
                CONFIG.sortMethod = 'time';
                GM_setValue('sort_method', CONFIG.sortMethod);
                renderComments(LAST_COMMENTS);
            });
        }
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                CONFIG.sortOrder = (CONFIG.sortOrder === 'asc') ? 'desc' : 'asc';
                GM_setValue('sort_order', CONFIG.sortOrder);
                renderComments(LAST_COMMENTS);
            });
        }
    }

    function renderError(msg) {
        const contentDiv = document.getElementById('lrr-eh-content');
        if (!contentDiv) return;
        contentDiv.innerHTML =
            `<div style="color: #f27474; padding: 15px; border: 1px dashed #f27474; border-radius: 5px; text-align:center;">${msg}</div>`;
    }

    function updateStatusTag(text) {
        const tag = document.getElementById('lrr-eh-status');
        if(tag) {
            tag.textContent = text;
            tag.style.display = 'inline-block';
        }
    }

    setTimeout(init, 800);
})();