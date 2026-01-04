// ==UserScript==
// @name         哔哩哔哩防沉迷
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  打开B站时需要输入使用理由
// @author       znzryb
// @match        *://*.bilibili.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560999/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%98%B2%E6%B2%89%E8%BF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560999/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%98%B2%E6%B2%89%E8%BF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否已经通过验证（会话级别，关闭标签页后失效）
    const sessionKey = 'bilibili_access_granted';

    if (sessionStorage.getItem(sessionKey)) {
        return; // 已验证过，不再拦截
    }

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // 创建提示框
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        text-align: center;
    `;

    modal.innerHTML = `
        <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">⏰ 防沉迷提醒</h2>
        <p style="color: #666; margin-bottom: 30px; font-size: 16px; line-height: 1.6;">
            请输入你使用哔哩哔哩的理由：
        </p>
        <textarea
            id="reason-input"
            placeholder="我需要用哔哩哔哩....."
            style="
                width: 100%;
                height: 120px;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                resize: none;
                box-sizing: border-box;
                font-family: inherit;
                margin-bottom: 20px;
            "
        ></textarea>
        <div style="display: flex; gap: 10px;">
            <button
                id="cancel-btn"
                style="
                    flex: 1;
                    padding: 14px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    color: #666;
                    font-weight: 500;
                "
            >取消</button>
            <button
                id="confirm-btn"
                style="
                    flex: 1;
                    padding: 14px;
                    background: #00a1d6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 500;
                "
            >确认进入</button>
        </div>
        <p id="error-msg" style="color: #ff6b6b; margin-top: 15px; font-size: 14px; display: none;">
            请输入使用理由（至少5个字）
        </p>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 禁止页面滚动
    document.body.style.overflow = 'hidden';

    const reasonInput = document.getElementById('reason-input');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const errorMsg = document.getElementById('error-msg');

    // 自动聚焦输入框
    setTimeout(() => reasonInput.focus(), 100);

    // 确认按钮
    confirmBtn.addEventListener('click', function() {
        const reason = reasonInput.value.trim();
        const requiredPrefix = '我需要用哔哩哔哩';

        if (!reason.startsWith(requiredPrefix)) {
            errorMsg.textContent = '必须以"我需要用哔哩哔哩"开头';
            errorMsg.style.display = 'block';
            reasonInput.style.borderColor = '#ff6b6b';
            return;
        }

        if (reason.length < requiredPrefix.length + 3) {
            errorMsg.textContent = '请完整说明使用理由（至少再写3个字）';
            errorMsg.style.display = 'block';
            reasonInput.style.borderColor = '#ff6b6b';
            return;
        }

        // 记录理由和时间（可选）
        console.log(`[防沉迷] ${new Date().toLocaleString()} - 使用理由: ${reason}`);

        // 设置会话标记
        sessionStorage.setItem(sessionKey, 'true');
        sessionStorage.setItem('bilibili_reason', reason);
        sessionStorage.setItem('bilibili_access_time', new Date().toISOString());

        // 移除遮罩
        document.body.style.overflow = '';
        overlay.remove();
    });

    // 取消按钮 - 关闭当前标签页
    cancelBtn.addEventListener('click', function() {
        window.close();
        // 如果无法关闭，跳转到其他页面
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 100);
    });

    // 回车键提交
    reasonInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            confirmBtn.click();
        }
    });

    // 输入时清除错误提示
    reasonInput.addEventListener('input', function() {
        errorMsg.style.display = 'none';
        reasonInput.style.borderColor = '#e0e0e0';
    });

})();