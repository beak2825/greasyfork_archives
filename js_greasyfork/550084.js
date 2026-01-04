// ==UserScript==
// @name         Twitter MTF killer
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  荷包蛋自用净化推特贴文的脚本，全自动隐藏MTF相关贴文，检测内容包括贴文正文，贴文标签，用户名，用户简介。支持UI管理关键词
// @author       Ayase
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      x.com
// @connect      twitter.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550084/Twitter%20MTF%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/550084/Twitter%20MTF%20killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 默认关键词配置 ---
    const DEFAULT_KEYWORDS = [
        '男娘', '伪娘', '药娘', '男同', 'mtf', '🏳️‍⚧️', '🏳️‍🌈', '跨性别', '扶她', 'futa',
        '性转', 'LGBT', '🍥', 'furry', '男童', '福瑞', '僞娘', '同性戀', '同性恋', '藥娘',
        '南娘', '男の娘', 'femboy', '三性', '#TS', '雌堕', '南梁', '女装', 'otokonoko',
        '木桶饭', '酷儿', '⚧️', 'lesbian', '＃gay', '人妖', '补佳乐', '雌激素', '糖糖',
        '色普隆', 'trap', 'sissy', 'crossdresser', '扶他', 'boylove', 'twink', '可攻可受',
        '受受', '兽设', '神楽坂', '真寻', '#CD', '＃男孩子', '#可爱的男孩子'
    ];


    /**
     * 配置管理器
     * 负责加载、保存和管理关键词列表
     */
    const Config = {
        keywords: new Set(),
        load() {
            let storedKeywords = GM_getValue('blockedKeywords');
            if (!storedKeywords || !Array.isArray(storedKeywords) || storedKeywords.length === 0) {
                console.log('[Twitter Blocker] 未找到已存关键词，加载默认列表。');
                storedKeywords = DEFAULT_KEYWORDS;
                this.save(storedKeywords);
            }
            this.keywords = new Set(storedKeywords.map(k => k.trim().toLowerCase()).filter(Boolean));
            console.log('[Twitter Blocker] 关键词加载完成，当前数量:', this.keywords.size);
        },
        save(keywordsArray) {
            const cleanedKeywords = [...new Set(keywordsArray.map(k => k.trim().toLowerCase()).filter(Boolean))];
            GM_setValue('blockedKeywords', cleanedKeywords);
            this.keywords = new Set(cleanedKeywords);
            console.log('[Twitter Blocker] 关键词已保存。');
        },
        getKeywords() {
            return [...this.keywords];
        },
        resetToDefault() {
            this.save(DEFAULT_KEYWORDS);
            console.log('[Twitter Blocker] 已重置为默认关键词列表');
        }
    };

    /**
     * UI管理器
     * 负责创建和管理所有界面元素，如通知、设置按钮和设置面板
     */
    const UI = {
        init() {
            this.injectStyles();
            this.createToastContainer();
            this.createDraggableSettingsButton();
            this.createSettingsPanel();
        },

        injectStyles() {
            GM_addStyle(`
                :root { --blocker-primary-color: #1D9BF0; }
                /* Toast 通知 */
                #blocker-toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; }
                .blocker-toast-message { background-color: rgba(29, 155, 240, 0.9); color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); opacity: 0; transform: translateX(100%); transition: all 0.4s cubic-bezier(0.21, 1.02, 0.73, 1); font-size: 14px; line-height: 1.4; }
                .blocker-toast-message.show { opacity: 1; transform: translateX(0); }
                .blocker-toast-message b { font-weight: bold; }

                /* 主页屏蔽提示 */
                .blocker-profile-overlay { padding: 40px 20px; text-align: center; border: 1px dashed #555; border-radius: 12px; margin: 20px; background-color: rgba(0,0,0,0.03); }
                .blocker-profile-overlay h3 { font-size: 18px; font-weight: bold; margin-bottom: 10px; }

                /* 可拖拽设置按钮 */
                #blocker-settings-btn { position: fixed; bottom: 80px; right: 25px; z-index: 99998; width: 48px; height: 48px; background-color: var(--blocker-primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: transform 0.2s, background-color 0.2s; user-select: none; touch-action: none; }
                #blocker-settings-btn:hover { background-color: #1a8cd8; transform: scale(1.1); }
                #blocker-settings-btn.dragging { opacity: 0.8; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); }

                /* 设置面板 */
                #blocker-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: none; align-items: center; justify-content: center; }
                #blocker-settings-panel { background-color: #15202B; color: #F7F9F9; width: 90%; max-width: 500px; border-radius: 16px; box-shadow: 0 0 20px rgba(0,0,0,0.3); display: flex; flex-direction: column; max-height: 80vh; }
                .blocker-panel-header { padding: 16px; border-bottom: 1px solid #38444D; font-size: 20px; font-weight: bold; }
                .blocker-panel-body { padding: 16px; overflow-y: auto; }
                .blocker-keywords-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
                .blocker-keyword-tag { background-color: #38444D; padding: 5px 10px; border-radius: 16px; font-size: 14px; display: flex; align-items: center; }
                .blocker-keyword-tag span { margin-right: 8px; }
                .blocker-keyword-tag .delete-btn { cursor: pointer; color: #8899A6; font-weight: bold; }
                .blocker-keyword-tag .delete-btn:hover { color: white; }
                .blocker-input-group { margin-top: 20px; display: flex; gap: 10px; }
                #blocker-new-keyword-input { flex-grow: 1; background-color: #253341; border: 1px solid #38444D; border-radius: 8px; padding: 10px; color: white; }
                .blocker-panel-footer { padding: 16px; border-top: 1px solid #38444D; display: flex; justify-content: space-between; gap: 12px; }
                .blocker-panel-footer-left { display: flex; gap: 12px; }
                .blocker-panel-footer-right { display: flex; gap: 12px; }
                .blocker-btn { padding: 10px 20px; border-radius: 20px; border: none; font-weight: bold; cursor: pointer; transition: all 0.2s; }
                .blocker-btn-primary { background-color: var(--blocker-primary-color); color: white; }
                .blocker-btn-primary:hover { opacity: 0.9; }
                .blocker-btn-secondary { background-color: #657786; color: white; }
                .blocker-btn-secondary:hover { opacity: 0.9; }
                .blocker-btn-warning { background-color: #f0ad4e; color: white; }
                .blocker-btn-warning:hover { background-color: #ec971f; }
            `);
        },

        createToastContainer() {
            if (!document.getElementById('blocker-toast-container')) {
                const container = document.createElement('div');
                container.id = 'blocker-toast-container';
                document.body.appendChild(container);
            }
        },

        showNotification(message) {
            const container = document.getElementById('blocker-toast-container');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = 'blocker-toast-message';
            toast.innerHTML = message;
            container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => toast.remove());
            }, 3000);
        },

        createDraggableSettingsButton() {
            const btn = document.createElement('div');
            btn.id = 'blocker-settings-btn';
            btn.innerHTML = '⚙️';
            btn.title = '屏蔽脚本设置 (可拖拽)';
            
            const savedPosition = GM_getValue('settingsButtonPosition', { x: 25, y: 80 });
            btn.style.right = `${savedPosition.x}px`;
            btn.style.bottom = `${savedPosition.y}px`;
            
            btn.onclick = (e) => {
                if (!btn.classList.contains('dragging')) {
                    document.getElementById('blocker-settings-overlay').style.display = 'flex';
                    this.renderKeywordsList();
                }
            };
            
            let isDragging = false;
            let startX, startY, startRight, startBottom;
            
            btn.addEventListener('mousedown', startDrag);
            btn.addEventListener('touchstart', startDrag);
            
            function startDrag(e) {
                e.preventDefault();
                e.stopPropagation();
                
                isDragging = true;
                btn.classList.add('dragging');
                
                const rect = btn.getBoundingClientRect();
                startRight = parseInt(btn.style.right) || 25;
                startBottom = parseInt(btn.style.bottom) || 80;
                
                if (e.type === 'mousedown') {
                    startX = e.clientX;
                    startY = e.clientY;
                    document.addEventListener('mousemove', onDrag);
                    document.addEventListener('mouseup', stopDrag);
                } else if (e.type === 'touchstart') {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                    document.addEventListener('touchmove', onDrag);
                    document.addEventListener('touchend', stopDrag);
                }
            }
            
            function onDrag(e) {
                if (!isDragging) return;
                
                e.preventDefault();
                
                let clientX, clientY;
                if (e.type === 'mousemove') {
                    clientX = e.clientX;
                    clientY = e.clientY;
                } else if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }
                

                const deltaX = startX - clientX;
                const deltaY = startY - clientY;
                
                let newRight = startRight + deltaX;
                let newBottom = startBottom + deltaY;
                
                const maxRight = window.innerWidth - btn.offsetWidth - 10;
                const maxBottom = window.innerHeight - btn.offsetHeight - 10;
                
                newRight = Math.max(10, Math.min(newRight, maxRight));
                newBottom = Math.max(10, Math.min(newBottom, maxBottom));
                
                btn.style.right = `${newRight}px`;
                btn.style.bottom = `${newBottom}px`;
            }
            
            function stopDrag(e) {
                if (!isDragging) return;
                
                isDragging = false;
                btn.classList.remove('dragging');
                

                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchmove', onDrag);
                document.removeEventListener('touchend', stopDrag);
                
                const currentRight = parseInt(btn.style.right);
                const currentBottom = parseInt(btn.style.bottom);
                GM_setValue('settingsButtonPosition', { x: currentRight, y: currentBottom });
            }
            
            document.body.appendChild(btn);
        },

        createSettingsPanel() {
            const overlay = document.createElement('div');
            overlay.id = 'blocker-settings-overlay';
            overlay.innerHTML = `
                <div id="blocker-settings-panel">
                    <div class="blocker-panel-header">屏蔽关键词管理</div>
                    <div class="blocker-panel-body">
                        <p>在此处添加或删除屏蔽词。修改后请点击"保存并刷新"以生效。</p>
                        <div class="blocker-keywords-list"></div>
                        <div class="blocker-input-group">
                            <input type="text" id="blocker-new-keyword-input" placeholder="输入新关键词...">
                            <button id="blocker-add-keyword-btn" class="blocker-btn blocker-btn-primary">添加</button>
                        </div>
                    </div>
                    <div class="blocker-panel-footer">
                        <div class="blocker-panel-footer-left">
                            <button id="blocker-reset-btn" class="blocker-btn blocker-btn-warning">恢复默认</button>
                        </div>
                        <div class="blocker-panel-footer-right">
                            <button id="blocker-close-btn" class="blocker-btn blocker-btn-secondary">关闭</button>
                            <button id="blocker-save-btn" class="blocker-btn blocker-btn-primary">保存并刷新</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);


            document.getElementById('blocker-close-btn').onclick = () => overlay.style.display = 'none';
            
            document.getElementById('blocker-reset-btn').onclick = () => {
                if (confirm('确定要恢复默认关键词列表吗？这将删除所有自定义关键词。')) {
                    Config.resetToDefault();
                    this.renderKeywordsList();
                    this.showNotification('已恢复默认关键词列表');
                }
            };
            
            overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = 'none'; };
            
            const addKeyword = () => {
                const input = document.getElementById('blocker-new-keyword-input');
                const newKeyword = input.value.trim();
                if (newKeyword) {
                    const currentKeywords = this.getCurrentKeywordsFromPanel();
                    if (!currentKeywords.includes(newKeyword.toLowerCase())) {
                        this.addKeywordToPanel(newKeyword);
                    }
                    input.value = '';
                    input.focus();
                }
            };
            document.getElementById('blocker-add-keyword-btn').onclick = addKeyword;
            document.getElementById('blocker-new-keyword-input').onkeydown = (e) => {
                if (e.key === 'Enter') addKeyword();
            };

            document.getElementById('blocker-save-btn').onclick = () => {
                const keywords = this.getCurrentKeywordsFromPanel();
                Config.save(keywords);
                overlay.style.display = 'none';
                this.showNotification('关键词已保存，正在刷新页面...');
                setTimeout(() => window.location.reload(), 1500);
            };
        },

        getCurrentKeywordsFromPanel() {
            const list = document.querySelector('#blocker-settings-panel .blocker-keywords-list');
            return Array.from(list.children).map(tag => tag.querySelector('span').textContent);
        },

        renderKeywordsList() {
            const list = document.querySelector('#blocker-settings-panel .blocker-keywords-list');
            list.innerHTML = '';
            Config.getKeywords().forEach(kw => this.addKeywordToPanel(kw, list));
        },
        
        addKeywordToPanel(keyword, listElement) {
            const list = listElement || document.querySelector('#blocker-settings-panel .blocker-keywords-list');
            const tag = document.createElement('div');
            tag.className = 'blocker-keyword-tag';
            tag.innerHTML = `<span>${keyword}</span><a class="delete-btn">×</a>`;
            tag.querySelector('.delete-btn').onclick = () => tag.remove();
            list.appendChild(tag);
        }
    };

    /**
     * 核心屏蔽器
     * 负责检测、屏蔽推文和主页
     */
    const Blocker = {
        userBioCache: new Map(),
        isCurrentProfileBlocked: false,
        lastCheckedUrl: '',
        scanTimeout: null,

        init() {
            if (Config.keywords.size === 0) {
                console.log('[Twitter Blocker] 关键词列表为空，脚本未启动。');
                return;
            }

            window.requestIdleCallback ? requestIdleCallback(() => this.scanAndBlock()) : setTimeout(() => this.scanAndBlock(), 500);

            const observer = new MutationObserver(() => {
                clearTimeout(this.scanTimeout);
                this.scanTimeout = setTimeout(() => this.scanAndBlock(), 300);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        getElementTextWithEmojiAlt(element) {
            if (!element) return '';
            let fullText = element.textContent || '';
            element.querySelectorAll('img[alt]').forEach(img => {
                fullText += ` ${img.alt}`;
            });
            return fullText.trim();
        },

        findMatchingKeyword(text) {
            if (!text || Config.keywords.size === 0) return null;
            const lowerText = text.toLowerCase();
            for (const keyword of Config.keywords) {
                if (lowerText.includes(keyword)) return keyword;
            }
            return null;
        },

        hideTweet(tweetElement, reason, source) {
            const message = `已屏蔽 (<b>${source}</b>)<br>原因: ${reason}`;
            UI.showNotification(message);
            console.log(`[Twitter Blocker] ${message.replace(/<br>|<b>|<\/b>/g, ' ')}`);

            const parentCell = tweetElement.closest('div[data-testid="cellInnerDiv"]');
            if (parentCell) {
                parentCell.style.display = 'none';
            } else {
                tweetElement.style.display = 'none';
            }
        },

        checkUserBioInBackground(username, tweetElement) {
            if (this.userBioCache.has(username)) return;
            this.userBioCache.set(username, 'checking');

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://x.com/${username}`,
                onload: (response) => {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const bioElement = doc.querySelector('[data-testid="UserDescription"]');
                    const bioText = this.getElementTextWithEmojiAlt(bioElement);
                    const matchedKeyword = this.findMatchingKeyword(bioText);

                    if (matchedKeyword) {
                        this.userBioCache.set(username, { blocked: true, keyword: matchedKeyword });
                        this.hideTweet(tweetElement, `简介含 "<b>${matchedKeyword}</b>"`, `@${username}`);
                    } else {
                        this.userBioCache.set(username, { blocked: false });
                    }
                },
                onerror: (response) => {
                    console.error(`[Twitter Blocker] 获取 @${username} 的主页失败:`, response);
                    this.userBioCache.set(username, { blocked: false });
                }
            });
        },

        processTweet(tweetElement) {
            if (tweetElement.dataset.blockerChecked) return;
            tweetElement.dataset.blockerChecked = 'true';

            if (this.isCurrentProfileBlocked) {
                tweetElement.style.display = 'none';
                return;
            }

            // 1. 检查推文内容
            const tweetTextElement = tweetElement.querySelector('[data-testid="tweetText"]');
            const tweetText = this.getElementTextWithEmojiAlt(tweetTextElement);
            let matchedKeyword = this.findMatchingKeyword(tweetText);
            if (matchedKeyword) {
                this.hideTweet(tweetElement, `内容含 "<b>${matchedKeyword}</b>"`, "推文内容");
                return;
            }

            // 2. 检查用户名和昵称
            const userLinkElement = tweetElement.querySelector('[data-testid="User-Name"] a[href^="/"]');
            if (!userLinkElement) return;

            const username = userLinkElement.getAttribute('href').substring(1);
            const userDisplayName = this.getElementTextWithEmojiAlt(userLinkElement.querySelector('div > div > span'));
            const source = `<b>${userDisplayName || ''}</b> (@${username})`;

            matchedKeyword = this.findMatchingKeyword(username) || this.findMatchingKeyword(userDisplayName);
            if (matchedKeyword) {
                this.hideTweet(tweetElement, `用户名/昵称含 "<b>${matchedKeyword}</b>"`, source);
                return;
            }

            // 3. 检查用户简介 (使用缓存或后台请求)
            const cacheResult = this.userBioCache.get(username);
            if (cacheResult) {
                if (cacheResult.blocked) {
                    this.hideTweet(tweetElement, `简介含 "<b>${cacheResult.keyword}</b>" (缓存)`, source);
                }
            } else {
                this.checkUserBioInBackground(username, tweetElement);
            }
        },

        processProfilePage() {
            if (document.body.dataset.profileChecked) return;

            const bioElement = document.querySelector('[data-testid="UserDescription"]');
            if (bioElement) {
                document.body.dataset.profileChecked = 'true';
                const bioText = this.getElementTextWithEmojiAlt(bioElement);
                const matchedKeyword = this.findMatchingKeyword(bioText);

                if (matchedKeyword) {
                    this.isCurrentProfileBlocked = true;
                    const message = `用户主页已屏蔽<br>原因: 简介含 "<b>${matchedKeyword}</b>"`;
                    UI.showNotification(message);
                    console.log(`[Twitter Blocker] ${message.replace(/<br>|<b>|<\/b>/g, ' ')}`);

                    const timeline = document.querySelector('div[data-testid="primaryColumn"]');
                    if (timeline) {
                        const nav = timeline.querySelector('nav');
                        timeline.innerHTML = '';
                        if(nav) timeline.appendChild(nav); 

                        const overlay = document.createElement('div');
                        overlay.className = 'blocker-profile-overlay';
                        overlay.innerHTML = `<h3>此用户主页已被屏蔽</h3><p>原因：简介中包含屏蔽词 "<b>${matchedKeyword}</b>"</p>`;
                        timeline.appendChild(overlay);
                    }
                }
            }
        },

        scanAndBlock() {
            if (window.location.href !== this.lastCheckedUrl) {
                this.lastCheckedUrl = window.location.href;
                this.isCurrentProfileBlocked = false;
                delete document.body.dataset.profileChecked;
            }

            const path = window.location.pathname;
            const isProfilePage = /^\/[a-zA-Z0-9_]{1,15}$/.test(path) || /^\/[a-zA-Z0-9_]{1,15}\/(with_replies|media|likes)$/.test(path);

            if (isProfilePage && !this.isCurrentProfileBlocked) {
                this.processProfilePage();
            }

            if (this.isCurrentProfileBlocked) return;

            document.querySelectorAll('article[data-testid="tweet"]:not([data-blocker-checked])').forEach(tweet => this.processTweet(tweet));
        }
    };

    function start() {
        Config.load();
        UI.init();
        Blocker.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();