// ==UserScript==
// @name         蓝白-老王论坛增强版（已读标记+关键词过滤）
// @namespace    http://tampermonkey.net/
// @version      5.6
// @description  已读帖子标记+关注词高亮+屏蔽词删除，支持多关键词配置
// @author       蓝白社野怪
// @match        https://batmhycyw.com/forum.php?mod=forumdisplay&fid*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @run-at       document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/551222/%E8%93%9D%E7%99%BD-%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%88%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0%2B%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551222/%E8%93%9D%E7%99%BD-%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%88%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0%2B%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区域
    const config = {
        readPostsKey: 'lanbai_read_posts',
        highlightWordsKey: 'lanbai_highlight_words',
        blockWordsKey: 'lanbai_block_words',
        showMarkButton: true,
        grayscaleLevel: 90,
        brightnessLevel: 0.6,
        highlightColor: 'rgba(255, 165, 0, 0.3)' // 浅橙色背景
    };

    // 初始化数据
    let readPostsSet = new Set(JSON.parse(GM_getValue(config.readPostsKey, '[]')));
    let highlightWords = GM_getValue(config.highlightWordsKey, '').split(/[,，]/).map(w => w.trim()).filter(w => w);
    let blockWords = GM_getValue(config.blockWordsKey, '').split(/[,，]/).map(w => w.trim()).filter(w => w);

    // 添加CSS样式
    GM_addStyle(`
        /* 已读帖子样式 */
        .lanbai-read-post {
            filter: grayscale(${config.grayscaleLevel}%) brightness(${config.brightnessLevel}) !important;
            opacity: 0.8 !important;
            transition: all 0.3s ease !important;
        }
        .lanbai-read-post img {
            filter: none !important;
        }

        /* 关注词高亮样式 - 精确修改h3和两个div */
        .lanbai-highlight-post h3,
        .lanbai-highlight-post .c.cl,
        .lanbai-highlight-post .auth.cl {
            background-color: ${config.highlightColor} !important;
            transition: background-color 0.3s ease !important;
        }
        /* 确保图片不受影响 */
        .lanbai-highlight-post img {
            background-color: transparent !important;
        }

        /* 控制按钮样式 */
        #lanbaiMarkBtn {
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 9999;
            padding: 8px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-family: inherit;
        }
        #lanbaiMarkBtn:hover {
            background: #45a049;
            transform: translateY(-1px);
        }

        /* 配置弹窗样式 */
        .lanbai-config-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 99999;
            width: 400px;
            max-width: 90%;
        }
        .lanbai-config-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .lanbai-config-textarea {
            width: 100%;
            height: 100px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            margin-bottom: 15px;
            resize: vertical;
        }
        .lanbai-config-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .lanbai-config-button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .lanbai-config-save {
            background: #4CAF50;
            color: white;
        }
        .lanbai-config-cancel {
            background: #f1f1f1;
            color: #333;
        }
        .lanbai-config-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
        }
        .lanbai-config-hint {
            font-size: 12px;
            color: #666;
            margin-top: -10px;
            margin-bottom: 10px;
        }
    `);

    // 核心处理函数 - 直接删除屏蔽帖子
    function processAllPosts() {
        const postLinks = document.querySelectorAll('a[href*="tid="][onclick*="atarget"]:not(.lanbai-processed)');

        postLinks.forEach(link => {
            link.classList.add('lanbai-processed');
            const postElement = link.closest('li');
            if (!postElement) return;

            const title = (link.title || link.textContent || '').trim();
            const titleLower = title.toLowerCase();
            const tid = (link.href.match(/tid=(\d+)/) || [])[1];

            // 1. 先处理屏蔽词 (优先级最高) - 直接删除DOM元素
            const isBlocked = blockWords.some(word =>
                word && titleLower.includes(word.toLowerCase())
            );

            if (isBlocked) {
                postElement.remove(); // 直接删除DOM元素
                return;
            }

            // 2. 处理已读标记
            if (tid && readPostsSet.has(tid)) {
                postElement.classList.add('lanbai-read-post');
            }

            // 3. 处理关注词高亮
            const hasHighlight = highlightWords.some(word =>
                word && titleLower.includes(word.toLowerCase())
            );

            if (hasHighlight) {
                postElement.classList.add('lanbai-highlight-post');
                // 确保所有目标元素都应用样式
                const targets = [
                    postElement.querySelector('h3'),
                    postElement.querySelector('.c.cl'),
                    postElement.querySelector('.auth.cl')
                ];
                targets.forEach(el => {
                    if (el) el.classList.add('lanbai-highlight-target');
                });
            } else {
                postElement.classList.remove('lanbai-highlight-post');
                // 移除可能添加的额外class
                postElement.querySelectorAll('.lanbai-highlight-target').forEach(el => {
                    el.classList.remove('lanbai-highlight-target');
                });
            }
        });
    }

    // 标记帖子为已读
    function markPostAsRead(tid) {
        if (!readPostsSet.has(tid)) {
            readPostsSet.add(tid);
            GM_setValue(config.readPostsKey, JSON.stringify(Array.from(readPostsSet)));
            updatePostVisual(tid);
        }
    }

    // 更新单个帖子显示
    function updatePostVisual(tid) {
        document.querySelectorAll(`a[href*="tid=${tid}"]`).forEach(link => {
            const postElement = link.closest('li');
            if (postElement) {
                postElement.classList.add('lanbai-read-post');
                postElement.querySelectorAll('img').forEach(img => {
                    img.style.filter = 'none';
                });
            }
        });
    }

    // 点击事件处理
    function handlePostClick(e) {
        let target = e.target;
        while (target && target !== document.body) {
            if (target.tagName === 'A' && target.href && target.href.includes('tid=') && target.href.includes('forum.php?mod=viewthread')) {
                const tidMatch = target.href.match(/tid=(\d+)/);
                if (tidMatch) {
                    markPostAsRead(tidMatch[1]);
                    break;
                }
            }
            target = target.parentElement;
        }
    }

    // 标记本页所有帖子为已读
    function markAllPostsOnPageAsRead() {
        const postLinks = document.querySelectorAll('a[href*="tid="][onclick*="atarget"]');
        let count = 0;

        postLinks.forEach(link => {
            const tidMatch = link.href.match(/tid=(\d+)/);
            if (tidMatch && !readPostsSet.has(tidMatch[1])) {
                readPostsSet.add(tidMatch[1]);
                count++;
                link.closest('li')?.classList.add('lanbai-read-post');
            }
        });

        if (count > 0) {
            GM_setValue(config.readPostsKey, JSON.stringify(Array.from(readPostsSet)));
        }
        alert(`✅ 已标记本页 ${count} 个帖子为已读！`);
    }

    // 创建控制按钮
    function createMarkButton() {
        const oldBtn = document.getElementById('lanbaiMarkBtn');
        if (oldBtn) oldBtn.remove();

        const markButton = document.createElement('button');
        markButton.id = 'lanbaiMarkBtn';
        markButton.textContent = '标记本页';
        markButton.title = '将本页所有帖子标记为已读';
        markButton.onclick = markAllPostsOnPageAsRead;
        document.body.appendChild(markButton);
    }

    // 创建配置弹窗
    function createConfigModal(type) {
        const oldModal = document.querySelector('.lanbai-config-modal, .lanbai-config-overlay');
        if (oldModal) oldModal.remove();

        const overlay = document.createElement('div');
        overlay.className = 'lanbai-config-overlay';

        const modal = document.createElement('div');
        modal.className = 'lanbai-config-modal';

        const isHighlight = type === 'highlight';
        const currentWords = isHighlight ? highlightWords.join(', ') : blockWords.join(', ');
        const title = isHighlight ? '设置关注词' : '设置屏蔽词';
        const example = isHighlight ? '例如: 杨晨晨,安然,九言' : '例如: 转载,搬运,百度云';

        modal.innerHTML = `
            <div class="lanbai-config-title">${title}</div>
            <div class="lanbai-config-hint">多个关键词用逗号或中文逗号分隔</div>
            <textarea
                id="lanbaiKeywordsInput"
                class="lanbai-config-textarea"
                placeholder="${example}"
            >${currentWords}</textarea>
            <div class="lanbai-config-buttons">
                <button id="lanbaiConfigCancel" class="lanbai-config-button lanbai-config-cancel">取消</button>
                <button id="lanbaiConfigSave" class="lanbai-config-button lanbai-config-save">保存</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        modal.querySelector('#lanbaiConfigCancel').addEventListener('click', () => {
            overlay.remove();
            modal.remove();
        });

        modal.querySelector('#lanbaiConfigSave').addEventListener('click', () => {
            const newWords = modal.querySelector('#lanbaiKeywordsInput').value;
            updateKeywords(type, newWords);
            overlay.remove();
            modal.remove();
        });

        overlay.addEventListener('click', () => {
            overlay.remove();
            modal.remove();
        });

        modal.querySelector('#lanbaiKeywordsInput').focus();
    }

    // 更新关键词配置
    function updateKeywords(type, newWords) {
        const wordsArray = newWords.split(/[,，]/)
            .map(w => w.trim())
            .filter(w => w);

        if (type === 'highlight') {
            highlightWords = wordsArray;
            GM_setValue(config.highlightWordsKey, wordsArray.join(','));
        } else {
            blockWords = wordsArray;
            GM_setValue(config.blockWordsKey, wordsArray.join(','));
        }

        // 重置处理状态并重新处理
        document.querySelectorAll('.lanbai-processed').forEach(el => {
            el.classList.remove('lanbai-processed');
        });
        processAllPosts();
    }

    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand("📌 标记本页为已读", markAllPostsOnPageAsRead);
        GM_registerMenuCommand("🔄 清除所有已读标记", () => {
            if (confirm("确定要清除所有的已读标记吗？")) {
                readPostsSet.clear();
                GM_setValue(config.readPostsKey, JSON.stringify([]));
                document.querySelectorAll('.lanbai-read-post').forEach(post => {
                    post.classList.remove('lanbai-read-post');
                });
                alert("已清除所有已读标记！");
            }
        });
        GM_registerMenuCommand("🌈 设置关注词", () => createConfigModal('highlight'));
        GM_registerMenuCommand("🚫 设置屏蔽词", () => createConfigModal('block'));
        GM_registerMenuCommand("⚙️ 调整显示效果", () => {
            const newGrayscale = prompt("灰度程度 (0-100，默认90):", config.grayscaleLevel);
            const newBrightness = prompt("亮度程度 (0-1，默认0.6):", config.brightnessLevel);
            if (newGrayscale !== null && newBrightness !== null) {
                config.grayscaleLevel = Math.min(100, Math.max(0, parseInt(newGrayscale) || 90));
                config.brightnessLevel = Math.min(1, Math.max(0, parseFloat(newBrightness) || 0.6));
                location.reload();
            }
        });
    }

    // 初始化
    function init() {
        console.log('蓝白脚本初始化...');

        if (config.showMarkButton) {
            createMarkButton();
        }

        registerMenuCommands();

        // 添加事件监听
        document.addEventListener('click', handlePostClick, true);
        document.addEventListener('auxclick', function(e) {
            if (e.button === 1) handlePostClick(e);
        }, true);

        // 初始处理帖子
        processAllPosts();

        // 设置MutationObserver监听动态内容
        const observer = new MutationObserver(mutations => {
            let needsUpdate = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    needsUpdate = true;
                    break;
                }
            }
            if (needsUpdate) {
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(processAllPosts, { timeout: 500 });
                } else {
                    setTimeout(processAllPosts, 300);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听滚动加载
        window.addEventListener('scroll', () => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(processAllPosts, { timeout: 500 });
            } else {
                setTimeout(processAllPosts, 300);
            }
        }, { passive: true });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    // 确保完全加载后再次处理
    setTimeout(processAllPosts, 1000);
    setTimeout(processAllPosts, 3000);
})();