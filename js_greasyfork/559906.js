// ==UserScript==
// @name         L站今日已阅数量
// @namespace    http://tampermonkey.net/
// @version      2.4
// @icon https://linux.do/uploads/default/optimized/4X/6/a/6/6a6affc7b1ce8140279e959d32671304db06d5ab_2_180x180.png
// @description  看看你今天读了多少贴
// @author       Senior Software Engineer
// @match        https://linux.do/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559906/L%E7%AB%99%E4%BB%8A%E6%97%A5%E5%B7%B2%E9%98%85%E6%95%B0%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/559906/L%E7%AB%99%E4%BB%8A%E6%97%A5%E5%B7%B2%E9%98%85%E6%95%B0%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let autoScrollTimer = null;
    let countedPosts = new Set();

    // --- 数据存储 ---
    const getStats = () => {
        const today = new Date().toLocaleDateString();
        let data = GM_getValue('reading_stats', { total: 0, daily: {}, lastDate: today });
        if (data.lastDate !== today) {
            data.daily[today] = 0;
            data.lastDate = today;
        }
        return data;
    };

    const incrementStats = () => {
        const data = getStats();
        const today = new Date().toLocaleDateString();
        data.total += 1;
        data.daily[today] = (data.daily[today] || 0) + 1;
        GM_setValue('reading_stats', data);
        updateUI();
    };

    const setMinimizedPref = (val) => GM_setValue('dr_minimized_pref', val);
    const getMinimizedPref = () => GM_getValue('dr_minimized_pref', false);

    // --- 样式注入 ---
    const injectStyles = () => {
        if (document.getElementById('dr-styles')) return;
        const style = document.createElement('style');
        style.id = 'dr-styles';
        style.innerHTML = `
            #dr-panel {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                background: var(--secondary); color: var(--primary);
                border: 1px solid var(--primary-low); border-radius: 12px;
                padding: 12px; box-shadow: var(--shadow-card);
                font-family: var(--font-family);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                width: 180px; overflow: hidden;
            }

            /* 最小化状态样式 (圆形徽章) */
            #dr-panel.minimized {
                width: 44px; height: 44px; padding: 0;
                border-radius: 50%; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                background: var(--tertiary); color: var(--secondary);
                border: none;
            }

            .dr-toggle {
                position: absolute; top: 5px; right: 8px;
                cursor: pointer; font-size: 14px; opacity: 0.6;
                transition: 0.2s;
            }
            .dr-toggle:hover { opacity: 1; }

            .dr-mini-content { display: none; font-weight: bold; font-size: 14px; }
            #dr-panel.minimized .dr-mini-content { display: block; }
            #dr-panel.minimized .dr-full-content,
            #dr-panel.minimized .dr-toggle { display: none; }

            /* 完整内容样式 */
            .dr-full-content { display: block; }
            .dr-title { font-weight: bold; font-size: 13px; color: var(--tertiary); margin-bottom: 8px; display: block; }
            .dr-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
            .dr-num { color: var(--tertiary); font-weight: bold; }
            .dr-btn {
                width: 100%; margin-top: 10px; padding: 6px; border-radius: 6px;
                border: none; background: var(--tertiary); color: var(--secondary);
                cursor: pointer; font-weight: bold; transition: 0.2s; font-size: 12px;
            }
            .dr-btn.active { background: var(--danger); }
        `;
        document.head.appendChild(style);
    };

    // --- UI 逻辑 ---
    const updateUI = () => {
        const data = getStats();
        const today = new Date().toLocaleDateString();
        const todayCount = data.daily[today] || 0;

        const miniEl = document.getElementById('dr-mini-val');
        const todayEl = document.getElementById('dr-today');
        const totalEl = document.getElementById('dr-total');
        const panel = document.getElementById('dr-panel');

        if (miniEl) miniEl.innerText = todayCount;
        if (todayEl) todayEl.innerText = todayCount;
        if (totalEl) totalEl.innerText = data.total;

        if (panel) {
            const isPostPage = window.location.pathname.includes('/t/');

            if (!isPostPage) {
                // 不在帖子页：强制最小化
                panel.classList.add('minimized');
                stopReading();
            } else {
                // 在帖子页：根据用户的历史偏好显示
                if (getMinimizedPref()) {
                    panel.classList.add('minimized');
                } else {
                    panel.classList.remove('minimized');
                }
            }
        }
    };

    const stopReading = () => {
        isRunning = false;
        clearTimeout(autoScrollTimer);
        const btn = document.getElementById('dr-start');
        if (btn) {
            btn.innerText = '开始阅读';
            btn.classList.remove('active');
        }
    };

    // --- 核心监听 (不变) ---
    const startObserver = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('read-state') && target.classList.contains('read')) {
                        const postArticle = target.closest('article[data-post-id]');
                        if (postArticle) {
                            const postId = postArticle.getAttribute('data-post-id');
                            if (!countedPosts.has(postId)) {
                                countedPosts.add(postId);
                                incrementStats();
                            }
                        }
                    }
                }
            });
        });
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
    };

    // --- 自动阅读逻辑 (不变) ---
    const autoMove = () => {
        if (!isRunning || !window.location.pathname.includes('/t/')) return;

        const allPosts = document.querySelectorAll('article.topic-post');
        let nextPost = null;

        for (let post of allPosts) {
            const state = post.querySelector('.read-state');
            if (state && !state.classList.contains('read')) {
                nextPost = post;
                break;
            }
        }

        if (nextPost) {
            nextPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
            autoScrollTimer = setTimeout(autoMove, 2000);
        } else {
            window.scrollBy({ top: 600, behavior: 'smooth' });
            autoScrollTimer = setTimeout(autoMove, 2500);
        }
    };

    // --- 初始化 ---
    const init = () => {
        injectStyles();
        const div = document.createElement('div');
        div.id = 'dr-panel';

        div.innerHTML = `
            <div class="dr-toggle" title="收起面板">✕</div>
            <div class="dr-mini-content" id="dr-mini-val"">0</div>
            <div class="dr-full-content">
                <span class="dr-title">阅读助手</span>
                <div class="dr-row">累计: <span id="dr-total" class="dr-num">0</span></div>
                <div class="dr-row">今日: <span id="dr-today" class="dr-num">0</span></div>
                <button id="dr-start" class="dr-btn">开始阅读</button>
            </div>
        `;
        document.body.appendChild(div);

        // 事件绑定
        div.onclick = function(e) {
            // 只有在帖子页且当前是最小化时，点击才允许展开
            if (this.classList.contains('minimized') && window.location.pathname.includes('/t/')) {
                this.classList.remove('minimized');
                setMinimizedPref(false);
                updateUI();
            }
        };

        div.querySelector('.dr-toggle').onclick = function(e) {
            e.stopPropagation();
            div.classList.add('minimized');
            setMinimizedPref(true);
        };

        document.getElementById('dr-start').onclick = function(e) {
            e.stopPropagation();
            if (!window.location.pathname.includes('/t/')) return;
            isRunning = !isRunning;
            this.innerText = isRunning ? '停止阅读' : '开始阅读';
            this.className = isRunning ? 'dr-btn active' : 'dr-btn';
            if (isRunning) autoMove();
            else stopReading();
        };

        startObserver();

        // SPA 路由监听
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            updateUI();
        };
        window.addEventListener('popstate', updateUI);
        setInterval(updateUI, 1000);

        updateUI();
    };

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

})();
