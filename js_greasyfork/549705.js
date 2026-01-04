// ==UserScript==
// @name         Threads 爆文偵測器
// @namespace    http://tampermonkey.net/
// @version      1.0.14
// @description  智慧偵測 Threads 平台上的熱門與潛力爆文，顯示每小時人氣量（+XXX/Hr），以橢圓標籤和顏色區分熱門程度，幫助您快速發現值得關注的內容。
// @author       ray.realms
// @match        https://www.threads.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/549705/Threads%20%E7%88%86%E6%96%87%E5%81%B5%E6%B8%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549705/Threads%20%E7%88%86%E6%96%87%E5%81%B5%E6%B8%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 預設驗證通過，模擬付費用戶
    GM_setValue('isPaidUser', true);

    // 注入 CSS 樣式
    const style = document.createElement('style');
    style.textContent = `
        body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; font-size: 14px; line-height: 1.4; }
        * { box-sizing: border-box; }
        .threads-helper-container { 
            position: fixed; 
            top: 50%; 
            right: 20px; 
            transform: translateY(-50%); 
            width: 256px; 
            background: #fff; 
            border-radius: 13px; 
            padding: 19px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); 
            z-index: 9999; 
            transition: all 0.3s ease; 
            color: #1F2937; 
        }
        @media (max-width: 767px) {
            .threads-helper-container { 
                width: 90%; 
                max-width: 256px; 
                padding: 13px; 
                border-radius: 10px; 
                overflow-y: auto; 
                max-height: 80vh; 
                right: 20px; 
                transform: translateY(-50%); 
            }
        }
        .threads-helper-container.dark { 
            background: #242424; 
            color: #F3F4F6; 
        }
        .threads-helper-container.dark h1, .threads-helper-container.dark h3, .threads-helper-container.dark h4 { color: #F3F4F6; }
        .threads-helper-container.dark p { color: #D1D5DB; }
        .threads-helper-container.dark a { color: #93C5FD; }
        .threads-helper-container.dark a:hover { color: #BFDBFE; }
        .threads-helper-close-btn { 
            position: absolute; 
            top: 10px; 
            right: 10px; 
            width: 20px; 
            height: 20px; 
            background: #dc2626; 
            border-radius: 50%; 
            color: #fff; 
            font-size: 14px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            cursor: pointer; 
            transition: all 0.2s ease; 
        }
        .threads-helper-close-btn:hover { background: #b91c1c; transform: scale(1.1); }
        .threads-helper-toggle-btn { 
            position: fixed; 
            top: 50%; 
            right: 20px; 
            transform: translateY(-50%); 
            width: 40px; 
            height: 40px; 
            background: linear-gradient(45deg, #22C55E, #3B82F6); 
            border-radius: 50%; 
            color: #fff; 
            font-size: 20px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            cursor: pointer; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); 
            transition: all 0.2s ease; 
            z-index: 9998; 
        }
        .threads-helper-toggle-btn:hover { transform: scale(1.1); }
        .threads-helper-container.dark .threads-helper-close-btn { background: #dc2626; }
        .threads-helper-container.dark .threads-helper-close-btn:hover { background: #b91c1c; }
        button { transition: all 0.2s ease; }
        button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        input[type=text], input[type=number], textarea { font-family: inherit; outline: none; }
        input[type=text]:focus, input[type=number]:focus, textarea:focus { border-color: #007bff; box-shadow: 0 0 0 2px #007bff40; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
        .threads-helper-popularity { 
            position: absolute; 
            top: 10px; 
            right: 10px; 
            font-size: 14px; 
            font-weight: 600; 
            padding: 4px 10px; 
            border-radius: 12px; 
            background: rgba(255, 99, 132, 0.9); 
            color: #fff; 
            transition: transform 0.2s ease; 
            cursor: default; 
            white-space: nowrap; 
        }
        .threads-helper-popularity:hover { transform: scale(1.05); }
        .threads-helper-popularity.low { background: rgba(59, 130, 246, 0.9); }
        .threads-helper-popularity.medium { background: rgba(245, 158, 11, 0.9); }
        .threads-helper-popularity.high { background: rgba(255, 99, 132, 0.9); }
        .threads-helper-popularity.dark { background: rgba(96, 165, 250, 0.9); }
        .threads-helper-popularity.dark.low { background: rgba(96, 165, 250, 0.9); }
        .threads-helper-popularity.dark.medium { background: rgba(251, 191, 36, 0.9); }
        .threads-helper-popularity.dark.high { background: rgba(255, 132, 162, 0.9); }
        @media (max-width: 767px) {
            .threads-helper-popularity { font-size: 12px; padding: 2px 8px; }
            .threads-helper-toggle-btn { right: 20px; transform: translateY(-50%); }
        }
        .threads-helper-container.dark div[style*="background: rgba(0,0,0,0.05)"] { background: rgba(55, 65, 81, 0.8); }
        .threads-helper-container.dark div[style*="linear-gradient"] { background: linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(59, 130, 246, 0.3)); }
    `;
    document.head.appendChild(style);

    // ThreadsHelper 類
    class ThreadsHelper {
        constructor() {
            this.thresholds = GM_getValue('thresholds', { minLikes: 0, minReposts: 0, minShares: 0, minReplies: 0 });
            this.observer = null;
            this.logoElement = null;
            this.init();
        }

        init() {
            this.injectUI();
            this.observePage();
            this.processExistingPosts();
        }

        injectUI() {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const container = document.createElement('div');
            container.className = `threads-helper-container ${isDarkMode ? 'dark' : ''}`;
            container.innerHTML = `
                <div style="position: relative; margin-bottom: 13px; text-align: center;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(45deg, #22C55E, #3B82F6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 19px; margin: 0 auto 10px;">
                        ⚡
                    </div>
                    <h1 style="margin: 0 0 5px 0; font-size: 19px; font-weight: 700; background: linear-gradient(45deg, #22C55E, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Threads 爆文偵測器</h1>
                    <p style="margin: 0; font-size: 13px; opacity: 0.8; line-height: 1.4;">奶爸精簡油猴版 For Profit Lab VIP</p>
                    <div class="threads-helper-close-btn" title="關閉">×</div>
                </div>
                <div style="background: rgba(0,0,0,0.05); border-radius: 10px; padding: 13px; margin-bottom: 13px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 5px;">
                        <span style="font-size: 15px;">🧵</span> 追蹤原作者 @ray.realms
                    </h3>
                    <p style="margin: 0 0 10px 0; font-size: 11px; line-height: 1.4; opacity: 0.8;">獲取最新功能更新和開發進度！</p>
                    <a href="https://www.threads.com/@ray.realms" target="_blank" style="display: block; width: 100%; padding: 10px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; text-align: center; font-weight: 600; font-size: 13px;">🧵 追蹤 @ray.realms</a>
                </div>
                <div style="background: linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1)); border-radius: 10px; padding: 13px; text-align: center;">
                    <h4 style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600;">💡 使用提示</h4>
                    <p style="margin: 0; font-size: 11px; line-height: 1.4; opacity: 0.8;">
                        • 貼文顯示每小時人氣量（+XXX/Hr）<br>
                        • 藍色（低 😬）、橙色（中 😐）、粉紅（高 🤩）標記熱門程度<br>
                        • 支援淺色/深色主題自動適配
                    </p>
                </div>
            `;
            document.body.appendChild(container);

            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'threads-helper-toggle-btn';
            toggleBtn.textContent = '⚡';
            toggleBtn.style.display = 'none';
            document.body.appendChild(toggleBtn);

            // 關閉按鈕事件
            const closeBtn = container.querySelector('.threads-helper-close-btn');
            closeBtn.addEventListener('click', () => {
                container.style.display = 'none';
                toggleBtn.style.display = 'flex';
            });

            // 喚回按鈕事件
            toggleBtn.addEventListener('click', () => {
                container.style.display = 'block';
                toggleBtn.style.display = 'none';
            });
        }

        observePage() {
            this.observer = new MutationObserver(() => this.processExistingPosts());
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        processExistingPosts() {
            document.querySelectorAll('div[data-pressable-container="true"]').forEach(post => {
                if (post.dataset.threadsHelperProcessed) return;
                const likeCount = this.getInteractionCount(post, ['讚', 'Like']);
                const commentCount = this.getInteractionCount(post, ['回覆', 'Reply', 'Comment']);
                const repostCount = this.getInteractionCount(post, ['轉發', 'Repost']);
                const shareCount = this.getInteractionCount(post, ['分享', 'Share']);
                
                if (likeCount >= this.thresholds.minLikes &&
                    commentCount >= this.thresholds.minReplies &&
                    repostCount >= this.thresholds.minReposts &&
                    shareCount >= this.thresholds.minShares) {
                    const popularity = this.calculateHourlyPopularity(post, likeCount, commentCount, repostCount, shareCount);
                    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const marker = document.createElement('span');
                    marker.className = `threads-helper-popularity ${isDarkMode ? 'dark' : ''} ${this.getPopularityClass(popularity)}`;
                    let emoji = '';
                    if (popularity < 10) emoji = '😬';
                    else if (popularity <= 50) emoji = '😐';
                    else emoji = '🤩';
                    marker.textContent = `${emoji} +${popularity.toFixed(1)}/Hr`;
                    post.appendChild(marker);
                }
                post.dataset.threadsHelperProcessed = 'true';
            });
        }

        getInteractionCount(post, labels) {
            const selectors = labels.map(label => `svg[aria-label="${label}"], svg[aria-label="收回${label}"], svg[aria-label="Un${label}"], svg[aria-label="取消${label}"]`).join(', ');
            const element = post.querySelector(selectors);
            if (!element) return 0;
            const countElement = element.closest('div[role="button"]')?.querySelector('span span, span');
            return countElement ? parseInt(countElement.textContent.replace(/\D/g, '') || '0', 10) : 0;
        }

        calculateHourlyPopularity(post, likeCount, commentCount, repostCount, shareCount) {
            const datetime = post.querySelector('time')?.getAttribute('datetime');
            if (!datetime) return 0;
            const postTime = new Date(datetime);
            const now = new Date();
            const hoursSincePosted = (now - postTime) / (1000 * 60 * 60); // 小時數
            const totalInteractions = likeCount + commentCount + repostCount + shareCount;
            return hoursSincePosted >= 1 ? totalInteractions / hoursSincePosted : totalInteractions;
        }

        getPopularityClass(popularity) {
            if (popularity < 10) return 'low';
            if (popularity <= 50) return 'medium';
            return 'high';
        }

        async updateThresholds(thresholds) {
            this.thresholds = thresholds;
            GM_setValue('thresholds', thresholds);
            document.querySelectorAll('div[data-pressable-container="true"]').forEach(post => {
                const marker = post.querySelector('.threads-helper-popularity');
                if (marker) {
                    marker.remove();
                    post.dataset.threadsHelperProcessed = '';
                }
            });
            this.processExistingPosts();
        }

        cleanup() {
            if (this.observer) this.observer.disconnect();
            if (this.logoElement) this.logoElement.remove();
        }
    }

    // 初始化
    const helper = new ThreadsHelper();
    window.addEventListener('beforeunload', () => helper.cleanup());
})();