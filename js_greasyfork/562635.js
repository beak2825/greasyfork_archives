// ==UserScript==
// @name         X/Twitter Inoreader Style (Soft Step Seek)
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  X 阅读优化：标记已阅读内容、跳转到未阅读内容、清空大量标记数据。
// @author       Gemini
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562635/XTwitter%20Inoreader%20Style%20%28Soft%20Step%20Seek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562635/XTwitter%20Inoreader%20Style%20%28Soft%20Step%20Seek%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心配置 ---
    const CONFIG = {
        offsetTrigger: -50,
        readBgColor: '#e1e8ed',      // 浅色模式背景
        readBgColorDark: '#2f3336',  // 深色模式背景
        storageKey: 'x_read_tweet_ids_v1',
        maxHistory: 5000,
        btnColor: '#536471'
    };

    // --- 1. 数据管理 ---
    let readIds = new Set();

    function loadData() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) readIds = new Set(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }

    function saveData() {
        if (readIds.size > CONFIG.maxHistory + 100) {
            const arr = Array.from(readIds);
            readIds = new Set(arr.slice(arr.length - CONFIG.maxHistory));
        }
        try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(Array.from(readIds))); } catch (e) {}
    }

    function addReadId(id) {
        if (!id || readIds.has(id)) return;
        readIds.add(id);
        saveData();
    }

    function removeReadId(id) {
        if (!id || !readIds.has(id)) return;
        readIds.delete(id);
        saveData();
    }

    loadData();

    // --- 2. 菜单命令 ---
    GM_registerMenuCommand("🧹 清空所有已阅记录", () => {
        if(confirm('确定要清空历史记录吗？页面将刷新。')) {
            localStorage.removeItem(CONFIG.storageKey);
            location.reload();
        }
    });

    // --- 3. 样式注入 ---
    GM_addStyle(`
        article.tweet-read {
            background-color: ${CONFIG.readBgColor} !important;
            transition: background-color 0.2s ease;
        }
        @media (prefers-color-scheme: dark) {
            article.tweet-read {
                background-color: ${CONFIG.readBgColorDark} !important;
            }
        }

        .ino-top-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin-right: 6px;
            color: #536471;
            opacity: 1;
            cursor: pointer;
            z-index: 100;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        .ino-top-icon:hover {
            background-color: rgba(29, 155, 240, 0.1);
            color: #1d9bf0;
        }
        .ino-top-icon svg {
            width: 18px;
            height: 18px;
            pointer-events: none;
        }

        /* 悬浮跳转按钮 (右侧居中) */
        #ino-jump-btn {
            position: fixed;
            top: 50%;
            margin-top: -25px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: ${CONFIG.btnColor};
            color: white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            transition: transform 0.2s, background-color 0.2s;
            font-size: 24px;
        }
        #ino-jump-btn:hover {
            background-color: #3f4d5a;
            transform: scale(1.1);
        }
        #ino-jump-btn.searching {
            cursor: wait;
        }
        #ino-jump-btn.searching svg {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        #ino-jump-btn::after {
            content: "寻找未读";
            position: absolute;
            right: 60px;
            top: 15px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            white-space: nowrap;
        }
        #ino-jump-btn:hover::after {
            opacity: 1;
        }
    `);

    // --- 4. 辅助函数 ---
    function getTweetId(article) {
        const timeLink = article.querySelector('a[href*="/status/"]');
        if (timeLink) {
            const parts = timeLink.href.split('/status/');
            if (parts.length > 1) return parts[1].split('?')[0].split('/')[0];
        }
        return null;
    }

    // --- 5. 交互逻辑 ---

    function handleIconClick(e) {
        e.stopPropagation();
        e.preventDefault();
        const iconDiv = e.currentTarget;
        const article = iconDiv.closest('article');
        if (!article) return;
        const id = getTweetId(article);
        if (!id) return;

        if (readIds.has(id)) {
            removeReadId(id);
            renderReadState(article, false);
        } else {
            addReadId(id);
            renderReadState(article, true);
        }
    }

    // --- 核心修改：柔和步进式跳转 ---
    let isSeeking = false;
    let seekTimer = null;

    function stopSeeking() {
        isSeeking = false;
        const btn = document.getElementById('ino-jump-btn');
        if (btn) {
            btn.classList.remove('searching');
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                </svg>
            `;
        }
        clearTimeout(seekTimer);
    }

    function performSeek() {
        if (!isSeeking) return;

        const tweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
        if (tweets.length === 0) {
             // 页面可能还没加载出来，等待一下
             seekTimer = setTimeout(performSeek, 500);
             return;
        }

        let firstUnreadIndex = -1;

        // 1. 扫描当前屏幕里的推文，寻找第一条未读的
        for (let i = 0; i < tweets.length; i++) {
            const id = getTweetId(tweets[i]);
            // 如果 ID 存在，且不在已读列表里 -> 它是未读的！
            if (id && !readIds.has(id)) {
                firstUnreadIndex = i;
                break; // 找到了，停止扫描
            }
        }

        if (firstUnreadIndex !== -1) {
            // --- 情况 A：找到了未读推文 ---
            const targetTweet = tweets[firstUnreadIndex];

            // 策略：如果它是第0个，说明我们刚好停在分界线上，或者上面被回收了。
            // 为了让用户看到上下文，我们尝试滚动到它【上面那一条】（也就是最后一条已读的）
            if (firstUnreadIndex > 0) {
                // 滚动到“最后一条已读”，让它位于屏幕中心，这样下面紧接着就是未读
                tweets[firstUnreadIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // 如果第一条就是未读，直接滚它
                targetTweet.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            stopSeeking();

        } else {
            // --- 情况 B：当前加载的全是已读（灰色的） ---

            // 策略修改：绝对不要直接跳到底部 (scrollHeight)。
            // 而是把【当前屏幕可见的最后一条推文】，滚动到【屏幕顶部】。
            // 这会强制 X 去加载它下面的内容。
            const lastTweet = tweets[tweets.length - 1];

            // 使用 scrollIntoView 将最后一条顶上去 (block: 'start')
            lastTweet.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // 等待加载，然后继续检查
            seekTimer = setTimeout(() => {
                performSeek();
            }, 1200); // 1.2秒的间隔，给 X 渲染留时间，也避免太快眼花
        }
    }

    function handleJumpClick() {
        const btn = document.getElementById('ino-jump-btn');
        if (isSeeking) {
            stopSeeking();
            return;
        }

        isSeeking = true;
        btn.classList.add('searching');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
        `;

        performSeek();
    }

    function createJumpButton() {
        if (document.getElementById('ino-jump-btn')) return;
        const btn = document.createElement('div');
        btn.id = 'ino-jump-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
        `;
        btn.onclick = handleJumpClick;
        document.body.appendChild(btn);
    }

    // --- 6. 渲染逻辑 ---
    function renderReadState(article, isRead) {
        const caretBtn = article.querySelector('[data-testid="caret"]');
        if (!caretBtn) {
             if (isRead) article.classList.add('tweet-read');
             else article.classList.remove('tweet-read');
             return;
        }
        const topContainer = caretBtn.parentElement;

        if (isRead) article.classList.add('tweet-read');
        else article.classList.remove('tweet-read');

        let iconDiv = topContainer.querySelector('.ino-top-icon');

        if (isRead) {
            if (!iconDiv) {
                iconDiv = document.createElement('div');
                iconDiv.className = 'ino-top-icon';
                iconDiv.title = "点击切换状态";
                iconDiv.onclick = handleIconClick;
                iconDiv.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                `;
                topContainer.insertBefore(iconDiv, caretBtn);
            }
        } else {
            if (iconDiv) iconDiv.remove();
        }
    }

    // --- 7. 滚动监听 ---
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && entry.boundingClientRect.top < CONFIG.offsetTrigger) {
                const article = entry.target;
                const id = getTweetId(article);
                if (id && !readIds.has(id)) {
                    addReadId(id);
                    renderReadState(article, true);
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0 });

    function maintainTweets() {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        tweets.forEach(article => {
            const id = getTweetId(article);
            if (!article.dataset.scriptWatched) {
                article.dataset.scriptWatched = "true";
                observer.observe(article);
            }
            if (id) {
                const shouldBeRead = readIds.has(id);
                const isVisuallyRead = article.classList.contains('tweet-read');
                if (shouldBeRead !== isVisuallyRead) {
                    renderReadState(article, shouldBeRead);
                }
            }
        });
        createJumpButton();
    }

    // --- 8. 启动 ---
    const mainObserver = new MutationObserver(() => maintainTweets());
    mainObserver.observe(document.body, { childList: true, subtree: true });
    setTimeout(maintainTweets, 1000);

})();