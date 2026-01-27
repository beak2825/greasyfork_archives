// ==UserScript==
// @name         知乎使用目的提醒
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  打开知乎时强制输入使用目的并持续显示，防止无意识浏览
// @author       You
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564109/%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E7%9B%AE%E7%9A%84%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/564109/%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E7%9B%AE%E7%9A%84%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'zhihu_purpose_v2';
    let purpose = GM_getValue(STORAGE_KEY, '');
    let widget = null;
    let modal = null;
    let timerInterval = null;
    let startTime = null;
    let isMinimized = false;

    // 初始化
    function init() {
        if (!purpose) {
            showPurposeModal();
        } else {
            showPurposeWidget();
        }
        observeRouteChange();
    }

    // 显示输入模态框（强制）
    function showPurposeModal() {
        if (modal) return;
        
        // 防止页面滚动
        document.body.style.overflow = 'hidden';

        modal = document.createElement('div');
        modal.id = 'zhihu-purpose-modal';
        modal.innerHTML = `
            <div class="zhihu-purpose-overlay">
                <div class="zhihu-purpose-container">
                    <h2>🎯 本次使用目的</h2>
                    <p>请明确你打开知乎的具体目标，避免无意识浏览</p>
                    <input type="text" id="purpose-input" 
                        placeholder="例如：查找Python异步编程资料，限时20分钟..." 
                        maxlength="100"
                        autocomplete="off">
                    <div class="error-msg" id="error-msg"></div>
                    <button id="purpose-submit">确认并开始使用</button>
                </div>
            </div>
            <style>
                .zhihu-purpose-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.75);
                    z-index: 2147483647;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(6px);
                    animation: fadeIn 0.3s ease;
                }
                .zhihu-purpose-container {
                    background: white;
                    padding: 32px;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 440px;
                    box-shadow: 0 25px 80px rgba(0,0,0,0.4);
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-sizing: border-box;
                }
                .zhihu-purpose-container h2 {
                    margin: 0 0 16px 0;
                    color: #121212;
                    font-size: 22px;
                    font-weight: 600;
                }
                .zhihu-purpose-container p {
                    color: #666;
                    margin-bottom: 20px;
                    font-size: 14px;
                    line-height: 1.5;
                }
                #purpose-input {
                    width: 100%;
                    padding: 14px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 15px;
                    box-sizing: border-box;
                    margin-bottom: 8px;
                    outline: none;
                    transition: all 0.3s;
                    font-family: inherit;
                }
                #purpose-input:focus {
                    border-color: #0066ff;
                    box-shadow: 0 0 0 3px rgba(0,102,255,0.1);
                }
                #purpose-input.error {
                    border-color: #ff4d4f;
                    animation: shake 0.5s;
                }
                .error-msg {
                    color: #ff4d4f;
                    font-size: 13px;
                    margin-bottom: 12px;
                    min-height: 18px;
                }
                #purpose-submit {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(0,102,255,0.3);
                }
                #purpose-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,102,255,0.4);
                }
                #purpose-submit:active {
                    transform: translateY(0);
                }
                @keyframes slideUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-8px); }
                    40%, 80% { transform: translateX(8px); }
                }
            </style>
        `;

        document.body.appendChild(modal);

        const input = modal.querySelector('#purpose-input');
        const btn = modal.querySelector('#purpose-submit');
        const errorMsg = modal.querySelector('#error-msg');

        // 自动聚焦
        setTimeout(() => input.focus(), 100);

        // 提交处理
        function submit() {
            const value = input.value.trim();
            if (value.length < 2) {
                input.classList.add('error');
                errorMsg.textContent = '⚠️ 目的描述至少需要2个字符';
                input.focus();
                setTimeout(() => input.classList.remove('error'), 500);
                return;
            }
            if (value.length > 100) {
                errorMsg.textContent = '⚠️ 目的描述不能超过100个字符';
                return;
            }
            
            purpose = value;
            GM_setValue(STORAGE_KEY, value);
            document.body.style.overflow = '';
            modal.remove();
            modal = null;
            showPurposeWidget();
        }

        btn.addEventListener('click', submit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });

        // 阻止点击遮罩关闭（强制填写）
        modal.querySelector('.zhihu-purpose-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
            }
        });
    }

    // 显示浮动组件
    function showPurposeWidget() {
        if (widget) return;
        
        startTime = Date.now();
        isMinimized = false;

        widget = document.createElement('div');
        widget.id = 'zhihu-purpose-widget';
        widget.innerHTML = `
            <div class="purpose-widget-container">
                <div class="widget-header">
                    <span class="widget-title">当前目的</span>
                    <div class="widget-controls">
                        <button class="widget-btn" id="edit-purpose" title="修改目的">✏️</button>
                        <button class="widget-btn" id="minimize-purpose" title="最小化">➖</button>
                        <button class="widget-btn" id="clear-purpose" title="清除并重新输入">✕</button>
                    </div>
                </div>
                <div class="widget-content" id="widget-content">
                    <div class="purpose-text">${escapeHtml(purpose)}</div>
                    <div class="timer-row">
                        <span class="timer" id="timer">00:00:00</span>
                        <span class="timer-hint">已用时间</span>
                    </div>
                </div>
            </div>
            <style>
                #zhihu-purpose-widget {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 2147483646;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    max-width: 300px;
                    min-width: 220px;
                    user-select: none;
                }
                .purpose-widget-container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset;
                    animation: widgetSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    backdrop-filter: blur(10px);
                }
                @keyframes widgetSlideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                }
                .widget-title {
                    font-size: 11px;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                }
                .widget-controls {
                    display: flex;
                    gap: 6px;
                }
                .widget-btn {
                    background: rgba(255,255,255,0.15);
                    border: none;
                    color: white;
                    width: 26px;
                    height: 26px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    padding: 0;
                    line-height: 1;
                }
                .widget-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }
                .widget-content {
                    transition: all 0.3s ease;
                }
                .purpose-text {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1.4;
                    word-break: break-word;
                    margin-bottom: 12px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .timer-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    opacity: 0.9;
                    padding-top: 8px;
                    border-top: 1px solid rgba(255,255,255,0.15);
                }
                .timer {
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                }
                .timer-hint {
                    font-size: 11px;
                    opacity: 0.8;
                }
                .minimized .widget-content {
                    display: none;
                }
                .minimized {
                    min-width: auto !important;
                    width: auto !important;
                }
            </style>
        `;

        document.body.appendChild(widget);

        // 绑定事件
        widget.querySelector('#edit-purpose').addEventListener('click', () => {
            destroyWidget();
            showPurposeModal();
        });

        widget.querySelector('#clear-purpose').addEventListener('click', () => {
            if (confirm('确定要清除当前目的吗？这将重新弹出输入框。')) {
                GM_setValue(STORAGE_KEY, '');
                purpose = '';
                destroyWidget();
                showPurposeModal();
            }
        });

        widget.querySelector('#minimize-purpose').addEventListener('click', toggleMinimize);

        // 启动计时器
        startTimer();
    }

    // 切换最小化
    function toggleMinimize() {
        if (!widget) return;
        isMinimized = !isMinimized;
        const container = widget.querySelector('.purpose-widget-container');
        const btn = widget.querySelector('#minimize-purpose');
        
        if (isMinimized) {
            container.classList.add('minimized');
            btn.textContent = '➕';
            btn.title = '展开';
        } else {
            container.classList.remove('minimized');
            btn.textContent = '➖';
            btn.title = '最小化';
        }
    }

    // 销毁组件（清理资源）
    function destroyWidget() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (widget) {
            widget.remove();
            widget = null;
        }
    }

    // 计时器功能
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            if (!startTime || !widget) return;
            
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
            const mins = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            
            const timerEl = widget.querySelector('#timer');
            if (timerEl) timerEl.textContent = `${hours}:${mins}:${secs}`;
        }, 1000);
    }

    // 监听路由变化（SPA优化版）
    function observeRouteChange() {
        let lastUrl = location.href;
        
        // 轻量级观察，仅观察 body 直接子节点
        const observer = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    if (purpose && !document.getElementById('zhihu-purpose-widget')) {
                        showPurposeWidget();
                    }
                }, 800);
            }
        });
        
        if (document.body) {
            observer.observe(document.body, { childList: true });
        }
        
        // 同时监听 popstate
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                if (purpose && !document.getElementById('zhihu-purpose-widget')) {
                    showPurposeWidget();
                }
            }, 500);
        });
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 注册油猴菜单命令
    GM_registerMenuCommand('🔄 修改当前目的', () => {
        destroyWidget();
        showPurposeModal();
    });

    GM_registerMenuCommand('🗑️ 清除目的记录', () => {
        if (confirm('确定清除目的？将立即重新输入。')) {
            GM_setValue(STORAGE_KEY, '');
            purpose = '';
            destroyWidget();
            showPurposeModal();
        }
    });

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();