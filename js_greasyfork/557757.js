// ==UserScript==
// @name         IT之家网页PC端优化 - 评论区加强
// @namespace    https://greasyfork.org/zh-CN/scripts/557757
// @version      3.2
// @description
// @author       Allenlin
// @match        https://www.ithome.com/0/*/*.htm
// @icon         https://www.ithome.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      GPL-3.0-only
// @description IT之家评论区优化：恢复表情原生大小，移除冗余分隔线，保持胶囊背板与点击修复
// @downloadURL https://update.greasyfork.org/scripts/557757/IT%E4%B9%8B%E5%AE%B6%E7%BD%91%E9%A1%B5PC%E7%AB%AF%E4%BC%98%E5%8C%96%20-%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557757/IT%E4%B9%8B%E5%AE%B6%E7%BD%91%E9%A1%B5PC%E7%AB%AF%E4%BC%98%E5%8C%96%20-%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RECENT_KEY = 'ithome_recent_emojis_v1';
    const MAX_RECENT_COUNT = 14;
    const MAX_QUICK_BAR_COUNT = 5;

    // ==========================================
    // 模块一：注入 CSS 样式
    // ==========================================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .emoji_box {
                height: auto !important;
                flex-wrap: wrap !important;
                align-content: flex-start !important;
                will-change: transform, opacity;
                padding: 10px !important;
                border-radius: 8px !important;
            }

            .comm-con .l {
                display: flex !important;
                align-items: center !important;
                float: none !important;
                height: 36px;
            }

            .ithome-quick-bar {
                display: flex;
                align-items: center;
                height: 32px;
                margin-left: 12px;
                padding: 0 8px;
                background-color: rgba(0,0,0,0.03);
                border: 1px solid rgba(0,0,0,0.04);
                border-radius: 16px;
            }

            .ithome-quick-bar a,
            .ithome-recent-emoji-row a,
            .emoji_box > a {
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            }

            .ithome-quick-bar a { width: 30px; height: 30px; margin: 0 1px !important; }

            .ithome-quick-bar a:hover,
            .ithome-recent-emoji-row a:hover,
            .emoji_box > a:hover {
                transform: scale(1.25) translateY(-3px) !important;
                background-color: #fff !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.12);
                z-index: 100;
            }

            .ithome-quick-bar img,
            .emoji_box img.emoji {
                width: 22px !important;
                height: 22px !important;
            }

            .ithome-recent-emoji-row {
                flex: 0 0 100%; width: 100%; display: flex; flex-wrap: wrap; padding: 8px;
                margin-bottom: 10px; background-color: rgba(0,0,0,0.02);
                border-radius: 6px; border: 1px solid rgba(0,0,0,0.03); box-sizing: border-box;
            }

            .ithome-recent-title { width: 100%; font-size: 11px; color: #888; margin: 0 0 8px 4px; font-weight: 600; }

            .emoji_box.ithome-silent-loading { display: block !important; opacity: 0 !important; position: absolute !important; z-index: -9999 !important; }

            body.night .ithome-quick-bar { background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.05); }
            body.night .ithome-quick-bar a:hover, body.night .ithome-recent-emoji-row a:hover, body.night .emoji_box > a:hover { background-color: #444 !important; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 模块二：逻辑处理
    // ==========================================
    function getRecentEmojis() {
        try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; }
    }

    function saveRecentEmoji(emojiData) {
        let list = getRecentEmojis();
        list = list.filter(item => item.title !== emojiData.title);
        list.unshift(emojiData);
        if (list.length > MAX_RECENT_COUNT) list = list.slice(0, MAX_RECENT_COUNT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
        document.querySelectorAll('.emoji_box').forEach(box => renderRecentRow(box));
        refreshAllQuickBars(true);
    }

    // 核心修复：表情插入逻辑
    function insertEmojiToTextarea(container, emojiTitle) {
        // 1. 寻找最近的 textarea
        // 先往上找评论块容器，再往下找文本框
        const parentArea = container.closest('.add_comm') || container.closest('.post_comment') || document.getElementById('post_comm');
        const textarea = parentArea ? parentArea.querySelector('textarea.ipt-txt') : null;

        if (!textarea) return;

        // 2. 模拟 IT 之家原生的插入行为
        const emojiCode = `[${emojiTitle}]`;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const oldVal = textarea.value;

        textarea.value = oldVal.substring(0, startPos) + emojiCode + oldVal.substring(endPos);

        // 3. 恢复焦点并移动光标
        textarea.focus();
        const newPos = startPos + emojiCode.length;
        textarea.setSelectionRange(newPos, newPos);
    }

    function createEmojiLink(emoji, targetEmojiBox, isQuickBar = false) {
        const a = document.createElement('a');
        a.title = emoji.title;
        a.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 直接调用我们的插入函数，解决 DOM 层级导致的失效
            insertEmojiToTextarea(a, emoji.title);
            saveRecentEmoji(emoji);
        };
        const img = document.createElement('img');
        img.src = emoji.src;
        img.className = 'emoji';
        a.appendChild(img);
        return a;
    }

    // ==========================================
    // UI 渲染与事件
    // ==========================================
    function renderRecentRow(emojiBox) {
        let recentRow = emojiBox.querySelector('.ithome-recent-emoji-row');
        if (!recentRow) {
            recentRow = document.createElement('div');
            recentRow.className = 'ithome-recent-emoji-row';
            emojiBox.insertBefore(recentRow, emojiBox.firstChild);
        }
        const list = getRecentEmojis();
        recentRow.innerHTML = '<div class="ithome-recent-title">最近使用</div>';
        if (list.length > 0) {
            list.forEach(emoji => { recentRow.appendChild(createEmojiLink(emoji, emojiBox)); });
        }
    }

    function refreshAllQuickBars(forceUpdate = false) {
        const allBars = document.querySelectorAll('.comm-con');
        const list = getRecentEmojis().slice(0, MAX_QUICK_BAR_COUNT);
        allBars.forEach(bar => {
            const leftPart = bar.querySelector('.l');
            if (!leftPart) return;
            let quickBar = leftPart.querySelector('.ithome-quick-bar');
            if (!forceUpdate && quickBar) return;
            if (list.length === 0 && !quickBar) return;
            if (!quickBar) {
                quickBar = document.createElement('div');
                quickBar.className = 'ithome-quick-bar';
                leftPart.appendChild(quickBar);
            }
            quickBar.innerHTML = '';
            const parentBox = bar.closest('.add_comm') || document.getElementById('post_comm');
            const emojiBox = parentBox ? parentBox.querySelector('.emoji_box') : null;
            list.forEach(emoji => { quickBar.appendChild(createEmojiLink(emoji, emojiBox, true)); });
        });
    }

    function initGlobalEvents() {
        document.addEventListener('click', function(e) {
            const target = e.target;

            // 记录面板内原生表情的点击
            const emojiLink = target.closest('a');
            if (emojiLink) {
                const img = emojiLink.querySelector('img.emoji');
                if (img && !emojiLink.closest('.ithome-recent-emoji-row') && !emojiLink.closest('.ithome-quick-bar')) {
                    const title = img.getAttribute('title') || img.getAttribute('data');
                    if (title) saveRecentEmoji({ title, src: img.src });
                }
            }

            // 点击空白处关闭
            const allBoxes = document.querySelectorAll('.emoji_box');
            const allTriggers = document.querySelectorAll('.emojia, .ywz');
            let isClickTrigger = false;
            allTriggers.forEach(btn => { if (btn.contains(target)) isClickTrigger = true; });
            let isClickInsideBox = false;
            allBoxes.forEach(box => { if (box.contains(target)) isClickInsideBox = true; });

            if (!isClickTrigger && !isClickInsideBox && !target.closest('.ithome-quick-bar')) {
                allBoxes.forEach(box => {
                    if (box.style.display !== 'none' && !box.classList.contains('ithome-silent-loading')) {
                        box.style.display = 'none';
                    }
                });
            }
        });
    }

    function initAutoLoadComment() {
        var commentDiv = document.getElementById("post_comm");
        if (commentDiv && !window._commLoaded && window.commentJsFile) {
            window._commLoaded = true;
            const checkAndLoad = setInterval(() => {
                if (typeof window.loadFile === 'function') {
                    clearInterval(checkAndLoad);
                    window.loadFile(window.commentCssFile, null, true);
                    window.loadFile(window.commentJsFile);
                }
            }, 100);
        }
    }

    injectStyles();
    window.addEventListener('load', () => {
        initAutoLoadComment();
        initGlobalEvents();
        refreshAllQuickBars(false);
    });

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.emoji_box').forEach(box => {
            if (!box.dataset.ithomeEnhanced && box.querySelectorAll('a').length > 5) {
                box.dataset.ithomeEnhanced = 'true';
                renderRecentRow(box);
            }
        });
        refreshAllQuickBars(false);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Ctrl + Enter 提交支持
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.keyCode === 13) {
            const btn = e.target.closest('.add_comm')?.querySelector('input[type="submit"], #btnComment');
            if (btn) btn.click();
        }
    });

})();