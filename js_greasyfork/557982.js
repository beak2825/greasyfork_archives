// ==UserScript==
// @name         Google Search Domain Blocker (Sort by Time)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  一键拉黑谷歌搜索结果主域名，按钮显示为文字"block"位于域名侧边，黑名单按添加时间排序（不自动重排）。
// @author       You
// @match        *://www.google.com/search*
// @match        *://www.google.co.jp/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.com.tw/search*
// @match        *://www.google.cn/search*
// @match        *://www.google.com.sg/search*
// @match        *://www.google.de/search*
// @match        *://www.google.fr/search*
// @match        *://www.google.co.uk/search*
// @match        *://www.google.ca/search*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557982/Google%20Search%20Domain%20Blocker%20%28Sort%20by%20Time%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557982/Google%20Search%20Domain%20Blocker%20%28Sort%20by%20Time%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'google_blocked_domains_v2';
    const ATTR_PROCESSED = 'data-gsdb-processed';

    // --- 样式定义 ---
    GM_addStyle(`
        /* 屏蔽按钮样式 - 文字版 */
        .gsdb-block-btn {
            display: inline-block;
            margin-left: 8px;
            color: #70757a; /* 谷歌次级文本颜色 */
            border: 1px solid #dadce0;
            border-radius: 12px; /* 胶囊圆角 */
            font-size: 10px; /* 小字体 */
            padding: 0 6px;
            height: 16px;
            line-height: 15px;
            cursor: pointer;
            vertical-align: middle;
            opacity: 0.7;
            text-decoration: none !important;
            transition: all 0.2s;
            background: transparent;
            position: relative;
            z-index: 999;
        }
        .gsdb-block-btn:hover {
            opacity: 1;
            color: #d93025; /* 悬停变红 */
            border-color: #d93025;
            background-color: #fce8e6;
        }

        /* 管理面板样式 */
        #gsdb-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000;
            display: flex; justify-content: center; align-items: center;
        }
        #gsdb-content {
            background: white; padding: 20px; border-radius: 8px;
            width: 500px; max-width: 90%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: arial, sans-serif;
        }
        #gsdb-textarea {
            width: 100%; height: 300px; margin: 10px 0;
            font-family: monospace; border: 1px solid #ccc; padding: 5px;
            box-sizing: border-box;
        }
        .gsdb-action-btn {
            padding: 6px 16px; border: none; border-radius: 4px;
            cursor: pointer; font-weight: bold;
        }
        .gsdb-save { background: #1a73e8; color: white; }
        .gsdb-close { background: #f1f3f4; color: black; margin-left: 8px; }
    `);

    // --- 数据操作 ---
    function getBlockedList() {
        return GM_getValue(STORAGE_KEY, []);
    }

    function setBlockedList(list) {
        // V2.3 修改：去掉了 .sort()，保持 list 的原始顺序（即插入顺序）
        // 使用 Set 去重，同时保持第一次出现的顺序
        const unique = [...new Set(list.map(d => d.toLowerCase().trim()))].filter(d => d);
        GM_setValue(STORAGE_KEY, unique);
    }

    function addBlock(domain) {
        const list = getBlockedList();
        if (!list.includes(domain)) {
            list.push(domain); // 新增的放在末尾
            setBlockedList(list);
        }
        refreshPage();
    }

    // --- 核心逻辑 ---

    function getDomain(url) {
        try {
            const hostname = new URL(url).hostname;
            return hostname.replace(/^www\./, '');
        } catch (e) {
            return null;
        }
    }

    function findResultContainer(node) {
        let current = node;
        let depth = 0;
        while (current && current !== document.body && depth < 10) {
            if (current.classList.contains('g') || current.classList.contains('MjjYud') || current.getAttribute('data-hveid')) {
                if(current.classList.contains('MjjYud')) return current;
                if(current.classList.contains('g') && current.parentElement.classList.contains('MjjYud')) {
                    return current.parentElement;
                }
                return current;
            }
            current = current.parentElement;
            depth++;
        }
        return node.parentElement ? node.parentElement.parentElement : node;
    }

    function renderButtons() {
        const blockedList = getBlockedList();
        const titles = document.querySelectorAll('h3');

        titles.forEach(h3 => {
            const anchor = h3.closest('a');
            if (!anchor || !anchor.href) return;

            const domain = getDomain(anchor.href);
            if (!domain) return;

            const container = findResultContainer(anchor);
            if (!container) return;

            // 检查屏蔽状态
            if (container.getAttribute(ATTR_PROCESSED) === 'blocked') {
                container.style.display = 'none';
                return;
            }

            if (blockedList.some(b => domain === b || domain.endsWith('.' + b))) {
                container.style.display = 'none';
                container.setAttribute(ATTR_PROCESSED, 'blocked');
                return;
            } else {
                if (container.style.display === 'none') {
                    container.style.display = '';
                    container.removeAttribute(ATTR_PROCESSED);
                }
            }

            // --- 寻找插入位置 ---
            // 优先尝试寻找显示域名的容器 (通常类名为 .TbwUpd 或包含 cite 标签)
            let target = anchor.querySelector('.TbwUpd');

            // 如果找不到域名行，回退到放到标题 h3 里面
            if (!target) {
                target = h3;
            }

            if (target.getAttribute(ATTR_PROCESSED)) return;

            // --- 创建文字按钮 ---
            const btn = document.createElement('span');
            btn.className = 'gsdb-block-btn';
            btn.innerText = 'block'; // 文字
            btn.title = `屏蔽 ${domain}`;
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                addBlock(domain);
            };

            target.appendChild(btn);
            target.setAttribute(ATTR_PROCESSED, 'true');
        });
    }

    function refreshPage() {
        document.querySelectorAll(`[${ATTR_PROCESSED}]`).forEach(el => {
            el.removeAttribute(ATTR_PROCESSED);
        });
        document.querySelectorAll('.gsdb-block-btn').forEach(btn => btn.remove());
        renderButtons();
    }

    // --- 设置面板 ---

    function showSettings() {
        if (document.getElementById('gsdb-modal')) return;
        const list = getBlockedList();
        const html = `
            <div id="gsdb-modal">
                <div id="gsdb-content">
                    <h3 style="margin-top:0">黑名单管理</h3>
                    <div style="font-size:12px;color:#666;margin-bottom:8px">一行一个域名。列表按添加顺序显示 (新添加的在底部)。</div>
                    <textarea id="gsdb-textarea" spellcheck="false"></textarea>
                    <div style="text-align: right; margin-top:10px;">
                        <button id="gsdb-save" class="gsdb-action-btn gsdb-save">保存</button>
                        <button id="gsdb-close" class="gsdb-action-btn gsdb-close">关闭</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        const textarea = document.getElementById('gsdb-textarea');
        textarea.value = list.join('\n');

        document.getElementById('gsdb-save').onclick = () => {
            const val = textarea.value;
            // 按用户在文本框中的顺序保存
            const newList = val.split('\n').map(s => s.trim()).filter(s => s);
            setBlockedList(newList);
            document.getElementById('gsdb-modal').remove();
            refreshPage();
        };

        document.getElementById('gsdb-close').onclick = () => document.getElementById('gsdb-modal').remove();
    }

    function init() {
        GM_registerMenuCommand("管理屏蔽黑名单", showSettings);
        renderButtons();
        const observer = new MutationObserver(() => renderButtons());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();

})();