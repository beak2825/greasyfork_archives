// ==UserScript==
// @name         通用Discuz论坛快速回复工具
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  通用Discuz论坛快速复制回复内容，支持随机生成回复
// @author       You
// @license MIT
// @match        *://*/forum.php*
// @match        *://*/viewthread.php*
// @match        *://*/thread-*
// @match        *://*/t-*
// @match        *://*/showthread.php*
// @match        *://*/thread.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553078/%E9%80%9A%E7%94%A8Discuz%E8%AE%BA%E5%9D%9B%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553078/%E9%80%9A%E7%94%A8Discuz%E8%AE%BA%E5%9D%9B%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 随机回复模板库 - 正向积极回复内容
    const replyTemplates = [
        "这个帖子内容很丰富，楼主整理得很用心，必须支持一下！",
        "楼主的分享总是这么及时，这个资源质量很高，已经收藏了！",
        "这个内容我之前在其他地方看过，但这里的版本更完整，感谢！",
        "楼主发的这个系列我一直在追，每一部都很精彩，辛苦了！",
        "这个资源的质量确实不错，制作角度也很专业，值得推荐！",
        "感谢楼主的及时更新，这种热门内容能第一时间看到真的很棒！",
        "这个帖子的内容很详细，楼主整理得很用心，必须点赞！",
        "楼主的资源更新很稳定，质量也很高，已经关注很久了！",
        "这个系列的内容都很精彩，楼主辛苦了，期待更多分享！",
        "这个资源我之前找了好久，终于在这里找到了，太感谢了！",
        "楼主的分享真的很用心，每次都能找到高质量的内容，赞一个！",
        "这个帖子写得很好，内容详实，对大家很有帮助，感谢分享！",
        "楼主整理得很仔细，分类清晰，找起来很方便，辛苦了！",
        "这个资源我之前在别的地方看过，但这里的版本更完整！",
        "楼主分享的内容都很不错，这个更是精品，感谢分享！",
        "这个帖子内容很丰富，楼主整理得很仔细，辛苦了！",
        "楼主的资源质量很高，每次分享都很用心，已经收藏了！",
        "这个系列我一直在追，每一部都很精彩，楼主辛苦了！",
        "感谢楼主的及时分享，这种热门内容能第一时间看到真棒！"
    ];

    // 论坛类型检测
    const forumTypes = {
        DISCUZ: 'discuz',
        PHPWIND: 'phpwind',
        OTHER: 'other'
    };

    // 检测论坛类型
    function detectForumType() {
        const body = document.body;
        const scripts = Array.from(document.scripts);

        if (body.className.includes('discuz') ||
            scripts.some(s => s.src && s.src.includes('discuz')) ||
            document.querySelector('[id^="postmessage_"]') ||
            document.querySelector('.t_f')) {
            return forumTypes.DISCUZ;
        }

        if (body.className.includes('phpwind') ||
            scripts.some(s => s.src && s.src.includes('phpwind'))) {
            return forumTypes.PHPWIND;
        }

        return forumTypes.OTHER;
    }

    // 获取所有回复内容
    function getAllReplies() {
        const forumType = detectForumType();
        const selectors = getReplySelectors(forumType);
        const replies = [];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(element => {
                    const text = element.textContent.trim();
                    if (text && text.length > 0 && !replies.some(r => r.text === text)) {
                        replies.push({
                            text: text,
                            length: text.length,
                            element: element
                        });
                    }
                });
                break;
            }
        }

        return replies;
    }

    // 获取回复内容选择器
    function getReplySelectors(forumType) {
        switch (forumType) {
            case forumTypes.DISCUZ:
                return [
                    'td.t_f[id^="postmessage_"]',
                    'td.t_f',
                    '.t_f[id^="postmessage_"]',
                    '.t_f'
                ];
            case forumTypes.PHPWIND:
                return [
                    '.content',
                    '.post_content',
                    '.reply_content'
                ];
            default:
                return [
                    'td.t_f[id^="postmessage_"]',
                    'td.t_f',
                    '.t_f[id^="postmessage_"]',
                    '.t_f',
                    '.content',
                    '.post_content',
                    '.reply_content',
                    '[id^="postmessage_"]'
                ];
        }
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showStatus('复制成功！', 'success');
            }).catch(() => {
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    }

    // 备用复制方法
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showStatus('复制成功！', 'success');
            } else {
                showStatus('复制失败，请手动复制', 'error');
            }
        } catch (err) {
            showStatus('复制失败，请手动复制', 'error');
        }

        document.body.removeChild(textArea);
    }

    // 显示状态信息
    function showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.color = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#666';
        }
    }

    // 更新回复计数
    function updateReplyCount() {
        const replies = getAllReplies();
        const countEl = document.getElementById('reply-count');
        if (countEl) {
            countEl.textContent = `总计: ${replies.length} 条回复`;
        }
    }

    // 生成随机回复
    function generateRandomReply() {
        const randomIndex = Math.floor(Math.random() * replyTemplates.length);
        return replyTemplates[randomIndex];
    }

    // 高亮显示回复（兼容面板变形）
    function highlightReplies(replies) {
        document.querySelectorAll('.universal-reply-highlight').forEach(el => {
            el.style.backgroundColor = '';
            el.style.border = '';
            el.style.borderRadius = '';
            el.classList.remove('universal-reply-highlight');
        });

        replies.forEach(reply => {
            reply.element.style.backgroundColor = '#fff3cd';
            reply.element.style.border = '2px solid #ffc107';
            reply.element.style.borderRadius = '4px';
            reply.element.classList.add('universal-reply-highlight');
        });
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'universal-reply-tool-panel';

        panel.style.cssText = `
            position: fixed;
            width: 240px;
            background: #fff;
            border: 1px solid #007cba;
            border-radius: 6px;
            padding: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            cursor: grab;
            user-select: none;
            display: block;
        `;

        // 设置面板初始位置为右下角（距离底部20px，右边20px）
        panel.style.top = `${window.innerHeight - 180}px`;
        panel.style.left = `${window.innerWidth - 260}px`;

        panel.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: #007cba; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                <span>回复工具</span>
                <div>
                    <span id="forum-type" style="font-size: 10px; color: #666; margin-right: 5px;"></span>
                    <button id="minimize-btn" style="background: none; border: none; color: #666; cursor: pointer; font-size: 12px; padding: 0;">−</button>
                </div>
            </div>
            <div style="width: 100%; height: 16px; background: #e9ecef; border-radius: 4px; margin-bottom: 8px; text-align: center; font-size: 12px; color: #666; cursor: move;">
                点击此处可拖动面板
            </div>
            <div id="panel-content">
                <div style="margin-bottom: 8px;">
                    <button id="generate-random" style="width: 100%; padding: 6px; margin-bottom: 4px; background: #ffc107; color: black; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">生成随机回复</button>
                    <button id="copy-random-reply" style="width: 100%; padding: 6px; margin-bottom: 4px; background: #17a2b8; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">复制随机回复</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加拖拽功能
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        panel.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                panel.style.top = (e.clientY - offsetY) + 'px';
                panel.style.left = (e.clientX - offsetX) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            panel.style.cursor = 'pointer';
        });

        return panel;
    }

    // 绑定事件
    function bindEvents(panel) {
        // 生成随机回复
        document.getElementById('generate-random').addEventListener('click', () => {
            const randomReply = generateRandomReply();
            copyToClipboard(randomReply);
            showStatus('已生成并复制随机回复', 'success');
        });

        // 复制随机回复
        document.getElementById('copy-random-reply').addEventListener('click', () => {
            const replies = getAllReplies();
            if (replies.length === 0) {
                showStatus('没有找到回复内容', 'error');
                return;
            }

            const randomIndex = Math.floor(Math.random() * replies.length);
            const randomReply = replies[randomIndex];
            copyToClipboard(randomReply.text);
            highlightReplies([randomReply]);
            showStatus('已复制随机回复', 'success');
        });

        // 缩小/恢复面板
        document.getElementById('minimize-btn').addEventListener('click', () => {
            const content = document.getElementById('panel-content');
            const btn = document.getElementById('minimize-btn');

            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = '−';
                panel.style.width = '240px';
            } else {
                content.style.display = 'none';
                btn.textContent = '+';
                panel.style.width = '120px';
            }
        });
    }

    // 初始化
    function init() {
        const forumType = detectForumType();
        const panel = createControlPanel();

        // 显示论坛类型
        const forumTypeEl = document.getElementById('forum-type');
        if (forumTypeEl) {
            forumTypeEl.textContent = `检测到: ${forumType.toUpperCase()}`;
        }

        // 绑定事件
        bindEvents(panel);

        // 更新回复计数
        updateReplyCount();

        // 显示初始化信息
        const replies = getAllReplies();
        if (replies.length > 0) {
            showStatus(`检测到 ${replies.length} 条回复`, 'info');
        } else {
            showStatus('未检测到回复内容，可能不兼容此论坛', 'error');
        }

        console.log(`Universal Reply Tool: 已激活 (${forumType})`);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
