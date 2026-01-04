// ==UserScript==
// @name         2048论坛自动评论助手
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  每30秒自动发表随机评论，避免重复评论并提示错误。仅针对 www.hjd2048.com 生效。
// @author       小帮手
// @match        *://*.hjd2048.com/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558475/2048%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558475/2048%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 首先检查当前URL是否包含fpage参数，如果是则直接退出
     if (window.location.href.includes('fpage=')) {
        console.log('[自动评论助手] 检测到fpage页面，脚本不执行');
        return;
    }

    // 配置区域：请根据网站实际结构调整以下变量
    const CONFIG = {
        commentInputSelector: '#textarea', // 输入框
        submitButtonSelector: 'input.fpbtn[type="submit"]', // 提交按钮
        intervalMinutes: 0.5, // 执行间隔（分钟）
        postIdFromUrl: true // 从URL提取帖子ID（默认启用，无需修改）
    };

    // 评论库：可以任意扩展
    const COMMENT_LIBRARY = [
        "感谢楼主分享！",
        "辛苦了，感谢分享。",
        "顶一顶，好贴不能沉。",
        "路过看看，感谢楼主的辛勤付出。",
        "马克一下，回头慢慢看。",
        "内容很赞，感谢楼主。"
    ];

    // 存储键定义
    const STORAGE_KEYS = {
        COMMENTED_POSTS: 'hjd2048_commented_posts', // 已评论帖子
        ALERTED_POSTS: 'hjd2048_alerted_posts' // 已弹窗提示的帖子
    };

    // 初始化存储
    let commentedPosts = GM_getValue(STORAGE_KEYS.COMMENTED_POSTS, []);
    let alertedPosts = GM_getValue(STORAGE_KEYS.ALERTED_POSTS, []);

    // 主逻辑函数
    function autoPostComment() {
        try {
            console.log('[自动评论助手] 开始执行任务...');

            // 1. 获取当前帖子ID
            let postId = getCurrentPostId();
            if (!postId) {
                console.warn('[自动评论助手] 无法获取当前帖子ID，任务终止。');
                return;
            }

            // 2. 检查是否已评论过
            if (hasCommented(postId)) {
                console.log(`[自动评论助手] 帖子(ID:${postId})已评论过，跳过。`);
                // 检查是否已经弹窗提示过，如果没有则提示
                if (!hasAlerted(postId, 'commented')) {
                    showNotification('提示', `检测到帖子(ID:${postId})已评论过，将自动跳过。`);
                    recordAlert(postId, 'commented');
                }
                return;
            }

            // 3. 查找评论框
            let commentInput = document.querySelector(CONFIG.commentInputSelector);
            if (!commentInput) {
                console.warn('[自动评论助手] 未找到评论输入框，页面可能不支持评论或选择器有误。');
                // 检查是否已经弹窗提示过，如果没有则提示
                if (!hasAlerted(postId, 'no_input')) {
                    showNotification('操作失败', '未找到评论框，可能帖子已锁定或无权限。');
                    recordAlert(postId, 'no_input');
                }
                return;
            }

            // 4. 检查输入框是否可用（如被禁用或只读）
            if (commentInput.disabled || commentInput.readOnly) {
                console.warn('[自动评论助手] 评论框被禁用或只读，无法评论。');
                if (!hasAlerted(postId, 'disabled')) {
                    showNotification('操作失败', '评论框被禁用，无法发表评论。');
                    recordAlert(postId, 'disabled');
                }
                return;
            }

            // 5. 查找提交按钮
            let submitButton = document.querySelector(CONFIG.submitButtonSelector);
            if (!submitButton) {
                console.error('[自动评论助手] 未找到提交按钮，选择器可能需更新。');
                if (!hasAlerted(postId, 'no_button')) {
                    showNotification('操作失败', '未找到提交按钮，无法发表评论。');
                    recordAlert(postId, 'no_button');
                }
                return;
            }

            // 6. 检查提交按钮是否可用
            if (submitButton.disabled) {
                console.warn('[自动评论助手] 提交按钮被禁用，无法评论。');
                if (!hasAlerted(postId, 'button_disabled')) {
                    showNotification('操作失败', '提交按钮被禁用，无法发表评论。');
                    recordAlert(postId, 'button_disabled');
                }
                return;
            }

            // 7. 输入随机评论内容
            let randomComment = getRandomComment();
            // 针对不同类型的输入框处理
            if (commentInput.isContentEditable || commentInput.tagName.toLowerCase() === 'div') {
                commentInput.innerText = randomComment;
            } else {
                commentInput.value = randomComment;
            }
            console.log(`[自动评论助手] 输入评论内容："${randomComment}"`);

            // 8. 触发按钮点击事件
            submitButton.click();
            console.log('[自动评论助手] 已触发提交操作。');

            // 9. 记录已评论的帖子
            recordCommentedPost(postId);
            showNotification('成功', '评论已自动提交！');

        } catch (error) {
            console.error('[自动评论助手] 执行过程中出错：', error);
            let postId = getCurrentPostId();
            if (postId && !hasAlerted(postId, 'error')) {
                showNotification('错误', `操作失败：${error.message}`);
                recordAlert(postId, 'error');
            }
        }
    }

    // 辅助函数：获取当前帖子ID
    function getCurrentPostId() {
        // 方案A：从URL中提取（常见于论坛URL结构如 thread-123456-1-1.html）
        if (CONFIG.postIdFromUrl) {
            let url = window.location.href;
            let match = url.match(/thread-(\d+)/) || url.match(/tid=(\d+)/);
            if (match && match[1]) {
                return `post_${match[1]}`;
            }
        }
        // 方案B：从页面元素获取
        // if (CONFIG.postIdFromElement) {...}

        // 备用方案：使用当前页面路径作为标识（精确度较低）
        return `page_${window.location.pathname}`;
    }

    // 辅助函数：检查是否已评论
    function hasCommented(postId) {
        return commentedPosts.includes(postId);
    }

    // 辅助函数：检查是否已经弹窗提示过（特定类型）
    function hasAlerted(postId, alertType) {
        const alertKey = `${postId}_${alertType}`;
        return alertedPosts.includes(alertKey);
    }

    // 辅助函数：获取随机评论
    function getRandomComment() {
        let index = Math.floor(Math.random() * COMMENT_LIBRARY.length);
        return COMMENT_LIBRARY[index];
    }

    // 辅助函数：记录已评论的帖子
    function recordCommentedPost(postId) {
        if (!hasCommented(postId)) {
            commentedPosts.push(postId);
            // 存储到油猴的本地存储中[citation:1]
            GM_setValue(STORAGE_KEYS.COMMENTED_POSTS, commentedPosts);
        }
    }

    // 辅助函数：记录弹窗提示
    function recordAlert(postId, alertType) {
        const alertKey = `${postId}_${alertType}`;
        if (!hasAlerted(postId, alertType)) {
            alertedPosts.push(alertKey);
            GM_setValue(STORAGE_KEYS.ALERTED_POSTS, alertedPosts);
        }
    }

    // 辅助函数：显示通知
    function showNotification(title, text) {
        GM_notification({
            text: text,
            title: title,
            silent: true,
            timeout: 3000
        });
    }

    // 清理过期的提示记录（可选，防止存储过大）
    function cleanupOldAlerts() {
        // 如果需要，可以定期清理过期的提示记录
        // 例如：只保留最近1000条记录
        if (alertedPosts.length > 1000) {
            alertedPosts = alertedPosts.slice(-1000);
            GM_setValue(STORAGE_KEYS.ALERTED_POSTS, alertedPosts);
        }
    }

    // 初始化：设置定时器
    let intervalMs = CONFIG.intervalMinutes * 60 * 1000;
    console.log(`[自动评论助手] 已启动，每 ${CONFIG.intervalMinutes} 分钟运行一次。`);

    // 清理旧记录
    cleanupOldAlerts();

    // 立即执行一次
    //autoPostComment();

    // 设置定时器
    setInterval(autoPostComment, intervalMs);

})();