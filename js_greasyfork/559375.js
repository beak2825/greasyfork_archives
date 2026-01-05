// ==UserScript==
// @name         youtube.com (一般網頁）🔗連結🎞️預覽播放+留言查看
// @namespace    yt-preview-links-comments-general
// @version      1.0
// @license      MIT
// @author       GFgatus
// @description  在一般網頁的 YouTube 連結旁加入 ▶️ 預覽播放與 💬 留言查看
// @match        *://*/*
// @exclude      https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      www.googleapis.com
// @connect      translate.googleapis.com
// @connect      youtube.com
// @connect      youtube-nocookie.com
// @downloadURL https://update.greasyfork.org/scripts/559375/youtubecom%20%28%E4%B8%80%E8%88%AC%E7%B6%B2%E9%A0%81%EF%BC%89%F0%9F%94%97%E9%80%A3%E7%B5%90%F0%9F%8E%9E%EF%B8%8F%E9%A0%90%E8%A6%BD%E6%92%AD%E6%94%BE%2B%E7%95%99%E8%A8%80%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559375/youtubecom%20%28%E4%B8%80%E8%88%AC%E7%B6%B2%E9%A0%81%EF%BC%89%F0%9F%94%97%E9%80%A3%E7%B5%90%F0%9F%8E%9E%EF%B8%8F%E9%A0%90%E8%A6%BD%E6%92%AD%E6%94%BE%2B%E7%95%99%E8%A8%80%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function preconnectToYouTube() {
        const domains = [
            'https://www.youtube.com',
            'https://www.youtube-nocookie.com',
            'https://i.ytimg.com',
            'https://googleads.g.doubleclick.net'
        ];
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    preconnectToYouTube();


    let API_KEY = GM_getValue('ytApiKey', localStorage.getItem('ytApiKey') || '我的API-KEY');
    let useNoCookieMode = GM_getValue('ytNoCookieMode', false);
    let isProcessingEnabled = false;
    let isPermanentEnabled = GM_getValue('ytPermanentEnabled', false);
    let autoCloseTimer = null;
    const DEBUG = false;
    function log(...args) { if (DEBUG) console.log(...args); }
    const COMMENT_API = 'https://www.googleapis.com/youtube/v3/commentThreads';
    const SIZE_OPTIONS = [
        { width: 640, height: 360 },
        { width: 960, height: 540 },
        { width: 1280, height: 720 },
        { width: 'fit', height: 'fit' },
        { width: () => window.innerWidth * 0.95, height: () => window.innerWidth * 0.95 * 9 / 16 }
    ];
    let currentSizeIndex = parseInt(GM_getValue('ytPlayerSizeIndex', 1));


    let originalBodyOverflow = '';


    GM_registerMenuCommand('手動刷新一次（強制重新掃描所有YT連結）', () => {
        console.log('手動觸發 YouTube 連結重新掃描');
        document.querySelectorAll('a[data-yt-preview-ready]').forEach(link => {
            link.removeAttribute('data-yt-preview-ready');
        });
        removeYTButtons();
        processYTLinks();
        alert('已手動刷新完畢！');
    });

    GM_registerMenuCommand('新增 API Key', () => showApiKeyPrompt());

    GM_registerMenuCommand('刪除 API Key', () => {
        GM_setValue('ytApiKey', '我的API-KEY');
        localStorage.setItem('ytApiKey', '我的API-KEY');
        API_KEY = '我的API-KEY';
        GM_setValue('ytNoCookieMode', false);
        useNoCookieMode = false;
        localStorage.setItem('ytNoCookieMode', 'false');
        alert('API Key 已刪除');
    });

    GM_registerMenuCommand('設定按鈕大小', () => {
        const size = prompt('輸入按鈕字體大小 (例如 16, 18, 20, 22)', GM_getValue('ytButtonSize', 18));
        if (size && !isNaN(size)) {
            GM_setValue('ytButtonSize', parseInt(size));
            alert(`按鈕大小已設為 ${size}px，請重新載入頁面或點「手動刷新一次」生效`);
        }
    });


    GM_registerMenuCommand(isPermanentEnabled ? '關閉永久開啟模式' : '開啟永久開啟模式', () => {
        isPermanentEnabled = !isPermanentEnabled;
        GM_setValue('ytPermanentEnabled', isPermanentEnabled);
        if (isPermanentEnabled) {
            isProcessingEnabled = true;
            GM_setValue('ytProcessingEnabled', true);
            processYTLinks();
            alert('已切換為「永久開啟」模式');
        } else {
            alert('已關閉永久開啟模式，下次點擊開關將恢復 10 秒自動關閉');
        }
    });


    function startAutoCloseTimer() {
        if (autoCloseTimer) clearTimeout(autoCloseTimer);
        console.log('⏱️ 啟動 10 秒自動關閉計時器');
        autoCloseTimer = setTimeout(() => {
            console.log('🛑 10秒到期，自動關閉 YouTube 掃描');
            autoCloseYTScanning();
        }, 10000);
    }

    function stopAutoCloseTimer() {
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
            console.log('⏹️ 取消自動關閉計時器');
        }
    }

    function autoCloseYTScanning() {
        isProcessingEnabled = false;
        GM_setValue('ytProcessingEnabled', false);
        observer.disconnect();
        removeYTButtons();

        const toggleBtn = document.querySelector('[aria-label="YouTube 掃描開關"]');
        if (toggleBtn) {
            toggleBtn.title = '開啟 YouTube 掃描（點擊後10秒自動關閉 | 長按 1 秒永久開啟，2 秒恢復預設）';
            toggleBtn.style.opacity = '0.6';
            toggleBtn.style.boxShadow = isPermanentEnabled ? '0 0 8px rgba(255, 255, 0, 0.8)' : 'none';
            toggleBtn.style.filter = isPermanentEnabled ? 'brightness(1.3)' : 'none';
        }
        console.log('✅ YouTube 掃描已自動關閉');
    }

    function extractYouTubeVideoId(url) {
        let decodedUrl = url;
        if (url.includes('discord.com/redirect?url=') || url.includes('gamer.com.tw/redirect?url=')) {
            try {
                const params = new URLSearchParams(url.split('?')[1]);
                decodedUrl = decodeURIComponent(params.get('url') || '');
            } catch (e) {
                return null;
            }
        }
        if (
            decodedUrl.includes('/channel/') ||
            decodedUrl.includes('/user/') ||
            decodedUrl.includes('/@') ||
            decodedUrl.includes('/playlist') ||
            decodedUrl.includes('/c/')
        ) {
            return null;
        }
        const pattern = /(?:[?&]v=|youtu\.be\/|shorts\/|embed\/|live\/|watch\?v=)([a-zA-Z0-9_-]{11})/;
        const match = decodedUrl.match(pattern);
        return match ? match[1] : null;
    }



    function focusOnPlayerAndPauseOthers() {

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }


        document.querySelectorAll('video, audio').forEach(media => {
            if (!media.closest('#yt-preview-popup') && !media.closest('#floatingPlayer') && !media.paused) {
                try {
                    media.pause();
                    console.log('已暫停背景媒體');
                } catch (e) {

                }
            }
        });
    }



    function createPlayer(videoId, titleText) {

        const oldPopup = document.getElementById('yt-preview-popup');
        if (oldPopup) {
            oldPopup.remove();
        } else {
            originalBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden'; // 禁止背景滾動
        }


        focusOnPlayerAndPauseOthers();

        const overlay = document.createElement('div');
        overlay.id = 'yt-preview-popup';

        overlay.setAttribute('tabindex', '-1');
        overlay.style.cssText = `
            position:fixed !important;
            top:0; left:0; width:100vw; height:100vh;
            background:rgba(0,0,0,0.7); /* 加深背景，更沈浸 */
            z-index:2147483647 !important;
            display:flex; justify-content:center; align-items:center;
            pointer-events:auto;
            outline: none; /* 移除聚焦框 */
            will-change: opacity;
        `;


        overlay.onclick = (e) => {

            e.stopPropagation();
            e.preventDefault();

            if (e.target === overlay) {
                overlay.remove();
                document.body.style.overflow = originalBodyOverflow;
            }
        };


        overlay.onkeydown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                overlay.remove();
                document.body.style.overflow = originalBodyOverflow;
            } else if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {

                e.stopPropagation();
            }
        };

        const container = document.createElement('div');
        container.style.cssText = `
            position:relative;
            background:#000; border-radius:4px;
            overflow:hidden; display:flex; justify-content:center; align-items:center;
            z-index:2147483647 !important; box-shadow: 0 0 30px rgba(0,0,0,0.8);
            transform: translateZ(0);
            will-change: transform;
        `;
        const playerDiv = document.createElement('div');
        playerDiv.style.cssText = 'width:100%; height:100%; transform: translateZ(0);';

        const embedDomain = useNoCookieMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
        playerDiv.innerHTML = `
            <iframe width="100%" height="100%"
                src="https://${embedDomain}/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="eager"
                tabindex="0"
                style="display:block; width:100%; height:100%;"></iframe>
        `;
        const titleDiv = document.createElement('div');
        titleDiv.innerText = titleText || '';
        titleDiv.style.cssText = `
            position:absolute;
            top:8px; right:40px; background:rgba(0,0,0,0.6);
            color:white; font-size:14px; padding:4px 8px; border-radius:4px;
            opacity:0; transition:opacity 0.2s; max-width: calc(100% - 72px);
            white-space: nowrap; overflow: hidden;
            text-overflow: ellipsis;
            z-index:2147483647 !important; user-select: text; cursor: text; pointer-events: none;
        `;

        const resizeBtn = document.createElement('div');
        resizeBtn.innerText = '⛶';
        resizeBtn.title = '切換視窗大小';
        resizeBtn.style.cssText = `
            position:absolute; top:8px; right:8px;
            width:24px; height:24px;
            background:rgba(0,0,0,0.6); color:white; font-size:14px;
            text-align:center; line-height:24px; border-radius:4px; cursor:pointer;
            opacity:0; transition:opacity 0.2s; z-index:2147483647 !important; pointer-events: auto;
        `;
        resizeBtn.onclick = (e) => {
            e.stopPropagation();
            currentSizeIndex = (currentSizeIndex + 1) % SIZE_OPTIONS.length;
            GM_setValue('ytPlayerSizeIndex', currentSizeIndex);
            applySize(container);
        };
        if (useNoCookieMode) {
            const noCookieIndicator = document.createElement('div');
            noCookieIndicator.innerText = 'No-Cookie';
            noCookieIndicator.style.cssText = `
                position:absolute;
                top:8px; left:8px; background:rgba(0,0,0,0.6);
                color:white; font-size:12px; padding:2px 6px; border-radius:4px;
                opacity:0.7; transition:opacity 0.3s; z-index:2147483647 !important; pointer-events: none;
            `;
            container.appendChild(noCookieIndicator);
            setTimeout(() => { noCookieIndicator.style.opacity = '0'; }, 2000);
        }

        container.appendChild(playerDiv);
        container.appendChild(titleDiv);
        container.appendChild(resizeBtn);
        overlay.appendChild(container);
        document.body.appendChild(overlay);


        overlay.focus();

        const iframe = playerDiv.querySelector('iframe');
        if (iframe) {
            setTimeout(() => {
                iframe.focus();

                focusOnPlayerAndPauseOthers();
            }, 50);
        }

        const hoverRegion = document.createElement('div');
        hoverRegion.style.cssText = `
            position:absolute; top:8px; right:8px;
            width: calc(100% - 40px); height: 28px; z-index:2147483647 !important;
        `;
        container.appendChild(hoverRegion);

        let titleTimer;
        hoverRegion.addEventListener('mouseenter', () => {
            clearTimeout(titleTimer);
            titleDiv.style.opacity = '1';
            resizeBtn.style.opacity = '1';
        });
        hoverRegion.addEventListener('mouseleave', () => {
            titleTimer = setTimeout(() => {
                titleDiv.style.opacity = '0';
                resizeBtn.style.opacity = '0';
            }, 1000);
        });
        applySize(container);
    }

    function applySize(container) {
        const opt = SIZE_OPTIONS[currentSizeIndex];
        const width = typeof opt.width === 'function' ? opt.width() : opt.width;
        const height = typeof opt.height === 'function' ? opt.height() : opt.height;
        if (width === 'fit') {
            container.style.width = '90vw';
            container.style.height = 'calc(90vw * 9 / 16)';
        } else {
            container.style.width = `${width}px`;
            container.style.height = `${height}px`;
        }
    }

    function showApiKeyPrompt(videoId = null, errorMessage = '') {
        const overlay = document.createElement('div');
        overlay.style = `
            position:fixed !important; top:0; left:0; width:100vw; height:100vh;
            background:rgba(0,0,0,0.9); z-index:2147483647 !important;
            display:flex; justify-content:center; align-items:center;
        `;
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        const box = document.createElement('div');
        box.style = `
            width:400px; background:#111; color:white; padding:16px;
            border-radius:8px; text-align:center; user-select: text;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
        `;
        box.innerHTML = `
            <h3>${errorMessage ? 'API Key 無效' : '管理 API Key'}</h3>
            <p>${errorMessage ? '請輸入有效的 YouTube API Key' : '輸入或管理 YouTube API Key'}</p>
            ${errorMessage ? `<p style="color:#f66;">錯誤：${errorMessage}</p>` : ''}
            <input type="text" id="apiKeyInput" placeholder="輸入 API Key" style="width:100%; padding:8px; margin:8px 0;" value="${API_KEY !== '我的API-KEY' ? API_KEY : ''}">
            <div style="display:flex; justify-content:space-around;">
                <button id="submitApiKey">確認</button>
                <button id="deleteApiKey">刪除 API Key</button>
            </div>
            <div style="margin-top:12px;">
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="color:#0f9d58;">檢查配額或生成新 Key</a>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('submitApiKey').onclick = () => {
            const input = document.getElementById('apiKeyInput').value.trim();
            if (input) {
                API_KEY = input;
                GM_setValue('ytApiKey', input);
                localStorage.setItem('ytApiKey', input);
                useNoCookieMode = false;
                GM_setValue('ytNoCookieMode', false);
                localStorage.setItem('ytNoCookieMode', 'false');
                overlay.remove();
                if (videoId) showComments(videoId);
            } else {
                alert('請輸入有效的 API Key');
            }
        };

        document.getElementById('deleteApiKey').onclick = () => {
            GM_setValue('ytApiKey', '我的API-KEY');
            localStorage.setItem('ytApiKey', '我的API-KEY');
            API_KEY = '我的API-KEY';
            useNoCookieMode = false;
            GM_setValue('ytNoCookieMode', false);
            localStorage.setItem('ytNoCookieMode', 'false');
            overlay.remove();
            if (videoId) {
                showApiKeyPrompt(videoId, 'API Key 已刪除，請重新輸入');
            } else {
                alert('API Key 已刪除');
            }
        };
    }

    const siteConfigs = {
        'discord.com': {
            selector: 'div:has(> [aria-label="收件匣"]), div:has(> [aria-label="Inbox"])',
            insertMethod: 'insertBefore',
            insertTarget: '[aria-label="收件匣"], [aria-label="Inbox"]',
            delay: 2000,
            buttonStyles: {
                marginRight: '8px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dbdee1',
                cursor: 'pointer'
            },
            observerTarget: '[data-list-id="chat-messages"]',
            observerOptions: { childList: true, subtree: true }
        },
        'google.': {

            selector: '#gb',
            insertMethod: 'insertBefore',


            insertTarget: '#gbwa',
            delay: 1000,
            buttonStyles: {
                marginRight: '4px',
                marginLeft: '8px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5f6368',
                cursor: 'pointer',
                borderRadius: '50%',
                transition: 'background 0.2s',

                marginTop: 'auto',
                marginBottom: 'auto'
            },
            observerTarget: 'body',
            observerOptions: { childList: true, subtree: true }
        }
    };

    function insertToggleButton(configKey = 'discord.com') {
        const config = siteConfigs[configKey];
        if (!config) return;

        function tryInsertButton() {
            const container = document.querySelector(config.selector);
            if (!container) return false;

            if (document.querySelector('[aria-label="YouTube 掃描開關"]')) return true;

            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'yt-toggle-safe';
            toggleBtn.setAttribute('data-yt-toggle', 'true');
            toggleBtn.setAttribute('role', 'button');
            toggleBtn.setAttribute('aria-label', 'YouTube 掃描開關');
            toggleBtn.setAttribute('tabindex', '0');

            let styles = `
                display: inline-flex;
                align-items: center; justify-content: center;
                cursor: pointer; flex-shrink: 0;
                ${isPermanentEnabled ? 'box-shadow: 0 0 8px rgba(255, 255, 0, 0.8); filter: brightness(1.3);' : ''}
            `;
            for (const [key, value] of Object.entries(config.buttonStyles)) {
                styles += `${key}: ${value};`;
            }
            toggleBtn.style.cssText = styles;

            toggleBtn.innerHTML = `
                <svg x="0" y="0" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                </svg>
            `;

            const countdownSpan = document.createElement('span');
            countdownSpan.style.cssText = `
                display: none;
                background: #000; color: yellow; padding: 2px 6px; border-radius: 4px;
                font-size: 12px; margin-right: 4px; vertical-align: middle; user-select: none; z-index: 2000;
            `;
            countdownSpan.id = 'yt-countdown';


            let remainingTime = 10;
            const updateTitleAndCountdown = () => {
                const featureDesc = "功能：顯示本頁 YT 連結的「▶️預覽播放」與「💬查看留言」按鈕";

                if (isProcessingEnabled && autoCloseTimer && !isPermanentEnabled) {

                    countdownSpan.textContent = `${remainingTime}s`;
                    countdownSpan.style.display = 'inline-block';
                    return `✅ 偵測中... (剩餘 ${remainingTime}s 自動關閉)\n${featureDesc}\n----------------\n👉 長按 1 秒：鎖定為「永久開啟」`;
                } else if (isProcessingEnabled) {

                    countdownSpan.style.display = 'none';
                    return `✅ 偵測中 (永久開啟模式)\n${featureDesc}\n----------------\n👉 點擊：關閉功能`;
                } else {

                    countdownSpan.style.display = 'none';
                    return `偵測 YouTube 連結\n${featureDesc}\n----------------\n👇 操作說明：\n• 點擊：開啟 10 秒 (適合單次使用)\n• 長按 1 秒：切換為永久開啟`;
                }
            };

            toggleBtn.title = updateTitleAndCountdown();
            toggleBtn.style.opacity = isProcessingEnabled ? '1' : '0.6';

            let longPressTimer1, longPressTimer2, timeInterval;

            toggleBtn.onmousedown = (e) => {
                e.preventDefault(); e.stopPropagation();
                longPressTimer1 = setTimeout(() => {
                    isPermanentEnabled = true;
                    isProcessingEnabled = true;
                    GM_setValue('ytPermanentEnabled', true);
                    GM_setValue('ytProcessingEnabled', true);
                    stopAutoCloseTimer();

                    if (timeInterval) clearInterval(timeInterval);
                    toggleBtn.title = updateTitleAndCountdown(); // 更新文字
                    toggleBtn.style.opacity = '1';
                    toggleBtn.style.boxShadow = '0 0 8px rgba(255, 255, 0, 0.8)';
                    toggleBtn.style.filter = 'brightness(1.3)';
                    processYTLinks();

                    const target = document.querySelector(config.observerTarget);
                    if (target) observer.observe(target, config.observerOptions);
                    log(`YouTube 掃描已設為永久開啟 (${configKey})`);
                }, 1000);

                longPressTimer2 = setTimeout(() => {
                    isPermanentEnabled = false;
                    isProcessingEnabled = false;
                    GM_setValue('ytPermanentEnabled', false);
                    GM_setValue('ytProcessingEnabled', false);
                    stopAutoCloseTimer();
                    if (timeInterval) clearInterval(timeInterval);

                    toggleBtn.title = updateTitleAndCountdown(); // 更新文字
                    toggleBtn.style.opacity = '0.6';
                    toggleBtn.style.boxShadow = 'none';
                    toggleBtn.style.filter = 'none';
                    observer.disconnect();
                    removeYTButtons();
                    log(`YouTube 掃描已恢復預設（關閉）(${configKey})`);
                }, 2000);
            };

            toggleBtn.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                if (longPressTimer1) clearTimeout(longPressTimer1);
                if (longPressTimer2) clearTimeout(longPressTimer2);

                isProcessingEnabled = !isProcessingEnabled;
                GM_setValue('ytProcessingEnabled', isProcessingEnabled);

                if (isProcessingEnabled) {
                    setTimeout(() => processYTLinks(), 50);

                    const target = document.querySelector(config.observerTarget);
                    if (target) observer.observe(target, config.observerOptions);

                    if (!isPermanentEnabled) {
                        startAutoCloseTimer();
                        remainingTime = 10;
                        countdownSpan.textContent = `${remainingTime}s`;
                        countdownSpan.style.display = 'inline-block';
                        timeInterval = setInterval(() => {
                            remainingTime--;
                            toggleBtn.title = updateTitleAndCountdown(); // 更新倒數
                            if (remainingTime <= 0) {
                                clearInterval(timeInterval);
                                countdownSpan.style.display = 'none';
                            }
                        }, 1000);
                    }
                } else {
                    stopAutoCloseTimer();
                    if (timeInterval) clearInterval(timeInterval);
                    observer.disconnect();
                    removeYTButtons();
                    remainingTime = 10;
                }
                toggleBtn.title = updateTitleAndCountdown(); // 更新狀態文字
                toggleBtn.style.opacity = isProcessingEnabled ? '1' : '0.6';
                toggleBtn.style.boxShadow = isPermanentEnabled ? '0 0 8px rgba(255, 255, 0, 0.8)' : 'none';
                toggleBtn.style.filter = isPermanentEnabled ? 'brightness(1.3)' : 'none';
            };

            toggleBtn.onmouseup = () => {
                if (longPressTimer1) clearTimeout(longPressTimer1);
                if (longPressTimer2) clearTimeout(longPressTimer2);
            };
            toggleBtn.onmouseleave = () => {
                if (longPressTimer1) clearTimeout(longPressTimer1);
                if (longPressTimer2) clearTimeout(longPressTimer2);
            };


            if (config.insertMethod === 'insertBefore') {
                const targetElement = container.querySelector(config.insertTarget);
                if (targetElement) {
                    targetElement.parentNode.insertBefore(toggleBtn, targetElement);
                    targetElement.parentNode.insertBefore(countdownSpan, toggleBtn);
                } else {
                    container.appendChild(countdownSpan);
                    container.appendChild(toggleBtn);
                }
            } else {
                container.appendChild(countdownSpan);
                container.appendChild(toggleBtn);
            }

            const buttonObserver = new MutationObserver(() => {
                if (!document.body.contains(toggleBtn)) {
                    tryInsertButton();
                }
            });
            buttonObserver.observe(container, { childList: true, subtree: true });

            return true;
        }

        setTimeout(() => {
            if (tryInsertButton()) return;
            const insertObserver = new MutationObserver(() => tryInsertButton() && insertObserver.disconnect());
            insertObserver.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => insertObserver.disconnect(), 15000);
        }, config.delay);
    }

    function removeYTButtons() {
        document.querySelectorAll('span[title*="預覽影片"], span[title="查看留言"]').forEach(btn => btn.remove());
        document.querySelectorAll('a[data-yt-preview-ready]').forEach(link => link.removeAttribute('data-yt-preview-ready'));
    }

    let processTimeout;
    function processYTLinks(mutations = []) {
        if (!isProcessingEnabled) return;

        clearTimeout(processTimeout);
        processTimeout = setTimeout(() => {
            let links = [];
            if (mutations.length > 0) {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                links.push(...Array.from(node.querySelectorAll('a[href*="youtu"]:not([data-yt-preview-ready]), a[href*="gamer.com.tw/redirect?url=*ytu*"]:not([data-yt-preview-ready]), a[href*="discord.com/redirect?url=*ytu*"]:not([data-yt-preview-ready])')));
                            }
                        });
                    }
                });
            } else {
                links = Array.from(document.querySelectorAll('a[href*="youtu"]:not([data-yt-preview-ready]), a[href*="gamer.com.tw/redirect?url=*ytu*"]:not([data-yt-preview-ready]), a[href*="discord.com/redirect?url=*ytu*"]:not([data-yt-preview-ready])'));
            }

            links.forEach(link => {
                if (link.closest('#yt-preview-popup') || link.closest('#floatingPlayer')) return;

                const videoId = extractYouTubeVideoId(link.href);
                if (!videoId) return;

                const buttonSize = GM_getValue('ytButtonSize', 18);
                const playBtn = document.createElement('span');
                playBtn.innerText = '▶️';
                playBtn.title = '預覽影片 (長按 0.7 秒切換 No-Cookie 模式)';
                playBtn.style.cssText = `
                    margin-left:4px; cursor:pointer; opacity:0.6; display:inline-block !important;
                    z-index:2147483647 !important; font-size: ${buttonSize}px !important; vertical-align: middle !important;
                `;
                let playLongPressTimer;
                playBtn.onmousedown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    playLongPressTimer = setTimeout(() => {
                        useNoCookieMode = !useNoCookieMode;
                        GM_setValue('ytNoCookieMode', useNoCookieMode);
                        localStorage.setItem('ytNoCookieMode', useNoCookieMode.toString());
                        const titleText = link.textContent.trim() || link.title || '';
                        createPlayer(videoId, titleText);
                    }, 700);
                };
                playBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearTimeout(playLongPressTimer);
                    const titleText = link.textContent.trim() || link.title || '';
                    createPlayer(videoId, titleText);
                };
                playBtn.onmouseup = () => clearTimeout(playLongPressTimer);
                playBtn.onmouseleave = () => clearTimeout(playLongPressTimer);

                const commentBtn = document.createElement('span');
                commentBtn.innerText = '💬';
                commentBtn.title = '查看留言';
                commentBtn.style.cssText = `
                    margin-left:4px; cursor:pointer; opacity:0.6; display:inline-block !important;
                    z-index:2147483647 !important; font-size: ${buttonSize}px !important; vertical-align: middle !important;
                `;
                commentBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showComments(videoId);
                };

                try {
                    link.insertAdjacentElement('afterend', commentBtn);
                    link.insertAdjacentElement('afterend', playBtn);
                    link.setAttribute('data-yt-preview-ready', 'true');
                } catch (e) {
                    console.error('Failed to insert buttons for link:', link.href, e);
                }
            });
        }, 300);
    }

    function showComments(videoId) {

        focusOnPlayerAndPauseOthers();

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed; top:0; left:0; width:100vw; height:100vh;
            background:rgba(0,0,0,0.7);
            z-index:2147483647 !important;
            display:flex; justify-content:center; align-items:center;
            outline: none;
        `;

        overlay.onclick = e => {
            e.stopPropagation();
            if (e.target === overlay) overlay.remove();
        };

        const box = document.createElement('div');
        box.style.cssText = `
            width:680px; min-height:200px;
            max-height:90vh; background:#111;
            color:#fff; font-size:16px; padding:16px; overflow-y:auto;
            border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.5);
            user-select: text; cursor: default;
        `;

        box.onclick = e => e.stopPropagation();

        const topBar = document.createElement('div');
        topBar.style.cssText = `display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap;`;
        const controls = document.createElement('div');
        controls.style.cssText = `display:flex; align-items:center; gap:12px; font-size:14px; flex-grow:1; user-select: none;`;
        controls.innerHTML = `
            <style>
                .common-control {
                    height: 28px;
                    font-size: 13px; padding: 2px 6px; line-height: 1.2;
                    border: 1px solid #ccc; border-radius: 4px; background-color: #222;
                    color: white; box-sizing: border-box;
                }
            </style>
            <label style="pointer-events: auto;">排序：
                <select id="orderSelect" class="common-control" style="pointer-events: auto;">
                    <option value="relevance">熱門</option>
                    <option value="time">最新</option>
                </select>
            </label>
            <label style="pointer-events: auto;">留言數：
                <select id="countSelect" class="common-control" style="pointer-events: auto;">
                    <option value="100">100</option>
                    <option value="300">300</option>
                    <option value="500">500</option>
                    <option value="800">800</option>
                </select>
            </label>
            <label style="pointer-events: auto;">🌐
                <select id="langSelect" class="common-control" style="pointer-events: auto;">
                    <option value="">選擇語言</option>
                    <option value="zh-TW">繁體中文</option>
                    <option value="zh-CN">簡體中文</option>
                    <option value="ja">日文</option>
                    <option value="en">英文</option>
                    <option value="ko">韓文</option>
                </select>
            </label>
            <label style="display:flex; align-items:center; pointer-events: auto;">
                <input id="searchInput" type="text" placeholder="搜尋留言..." class="common-control" style="flex: 1; min-width: 40px; max-width: 120px; pointer-events: auto;" />
            </label>
        `;
        const playBtn = document.createElement('button');
        playBtn.innerHTML = '▶️ 小窗';
        playBtn.title = '播放此影片';
        playBtn.style.cssText = `font-size:20px; border:none; background:transparent; color:white; cursor:pointer; opacity:0.6; margin-left:8px; pointer-events: auto;`;
        playBtn.onclick = (e) => { e.stopPropagation(); showFloatingPlayer(videoId); };

        const apiKeyBtn = document.createElement('button');
        apiKeyBtn.innerHTML = '⚙️ 設定API';
        apiKeyBtn.style.cssText = `font-size:14px; border:none; background:transparent; color:white; cursor:pointer; opacity:0.6; margin-left:8px; pointer-events: auto;`;
        apiKeyBtn.onclick = (e) => { e.stopPropagation(); showApiKeyMenu(); };

        topBar.appendChild(controls);
        topBar.appendChild(playBtn);
        topBar.appendChild(apiKeyBtn);

        const titleBar = document.createElement('div');
        titleBar.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;';

        const title = document.createElement('div');
        title.textContent = '留言預覽';
        title.style.cssText = `font-size:18px; font-weight:bold;`;
        titleBar.appendChild(title);

        const pageControls = document.createElement('div');
        pageControls.style.cssText = 'display:flex; justify-content:center; align-items:center; gap:6px;';

        const prevBtn = document.createElement('button');
        prevBtn.textContent = '⬅ 上一頁';
        prevBtn.disabled = true;
        prevBtn.style.cssText = `
            padding:2px 8px; border-radius:4px; border:none; cursor:pointer;
            background:#111;
            color:#fff; font-weight:bold; pointer-events: auto;
        `;

        const nextBtn = document.createElement('button');
        nextBtn.textContent = '下一頁 ➡';
        nextBtn.disabled = true;
        nextBtn.style.cssText = `
            padding:2px 8px; border-radius:4px; border:none; cursor:pointer;
            background:#1e90ff;
            color:#fff; font-weight:bold; pointer-events: auto;
        `;

        pageControls.appendChild(prevBtn);
        pageControls.appendChild(nextBtn);
        titleBar.appendChild(pageControls);
        box.appendChild(topBar);
        box.appendChild(titleBar);

        const content = document.createElement('div');
        content.style = 'margin-top:12px; user-select: text; cursor: text;';
        box.appendChild(content);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        function showApiKeyMenu() {
            const existingMenu = document.getElementById('apiKeyMenu');
            if (existingMenu) existingMenu.remove();

            const menu = document.createElement('div');
            menu.id = 'apiKeyMenu';
            menu.style.cssText = `
                position:absolute; top:40px;
                right:8px; width:200px;
                background:#222; color:white; padding:8px;
                border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.5);
                z-index:2147483647 !important; user-select: none; pointer-events: auto;
            `;
            menu.innerHTML = `
                <button id="addApiKey" style="width:100%; padding:8px; margin-bottom:8px; background:#333; color:white; border:none; border-radius:4px; cursor:pointer;">新增 API Key</button>
                <button id="deleteApiKey" style="width:100%; padding:8px; background:#333; color:white; border:none; border-radius:4px; cursor:pointer;">刪除 API Key</button>
            `;
            box.appendChild(menu);

            document.getElementById('addApiKey').onclick = () => {
                menu.remove();
                showApiKeyPrompt(videoId);
            };

            document.getElementById('deleteApiKey').onclick = () => {
                GM_setValue('ytApiKey', '我的API-KEY');
                localStorage.setItem('ytApiKey', '我的API-KEY');
                API_KEY = '我的API-KEY';
                useNoCookieMode = false;
                GM_setValue('ytNoCookieMode', false);
                localStorage.setItem('ytNoCookieMode', 'false');
                content.innerHTML = 'API Key 已刪除，請重新輸入';
                menu.remove();
                showApiKeyPrompt(videoId);
            };
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && e.target !== apiKeyBtn) {
                    menu.remove();
                }
            }, { once: true });
        }

        let allLoadedComments = [];
        let currentOrder = 'relevance';
        let maxResults = 100;
        let currentPageToken = '';
        let nextPageToken = '';
        let prevPageTokens = [];

        document.getElementById('orderSelect').value = currentOrder;
        document.getElementById('countSelect').value = maxResults;
        document.getElementById('orderSelect').onchange = (e) => {
            currentOrder = e.target.value;
            resetPagination();
            loadComments();
        };
        document.getElementById('countSelect').onchange = (e) => {
            maxResults = parseInt(e.target.value);
            resetPagination();
            loadComments();
        };
        document.getElementById('langSelect').onchange = (e) => {
            if (e.target.value) translateAll(content, e.target.value);
        };
        document.getElementById('searchInput').oninput = () => {
            filterComments(document.getElementById('searchInput').value.trim().toLowerCase());
        };
        prevBtn.onclick = () => {
            if (prevPageTokens.length) {
                const prevToken = prevPageTokens.pop();
                loadComments(prevToken, true);
            }
        };
        nextBtn.onclick = () => {
            if (nextPageToken) {
                prevPageTokens.push(currentPageToken);
                loadComments(nextPageToken);
            }
        };
        function resetPagination() {
            currentPageToken = '';
            nextPageToken = '';
            prevPageTokens = [];
        }

        function updatePageButtonState() {
            prevBtn.disabled = prevPageTokens.length === 0;
            nextBtn.disabled = !nextPageToken;
            prevBtn.style.opacity = prevBtn.disabled ? '0.6' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.6' : '1';
        }

        function loadComments(pageToken = '', isPrev = false, retryCount = 0) {
            if (API_KEY === '我的API-KEY') {
                content.innerHTML = '請輸入 API Key';
                showApiKeyPrompt(videoId);
                return;
            }

            content.innerHTML = '載入中...';
            currentPageToken = pageToken;
            fetchComments(videoId, currentOrder, maxResults, pageToken, (comments, error) => {
                content.innerHTML = '';
                if (error) {
                    if (error.code === 403 && error.message.includes('disabled comments')) {
                        content.innerHTML = '❌ 此影片已禁用留言，無法載入留言';
                        return;
                    }
                    if (error.code === 403) {
                        let errorMessage = error.message.includes('quota') ? 'API 配額已達上限，請檢查 Google Cloud Console' :
                            error.message.includes('keyInvalid') ? 'API Key 無效，請確認是否啟用 YouTube Data API v3' : 'API Key 無效或受限';
                        if (retryCount < 1) {
                            setTimeout(() => loadComments(pageToken, isPrev, retryCount + 1), 2000);
                            return;
                        }
                        GM_setValue('ytApiKey', '我的API-KEY');
                        localStorage.setItem('ytApiKey', '我的API-KEY');
                        API_KEY = '我的API-KEY';
                        content.innerHTML = `❌ ${errorMessage}`;
                        showApiKeyPrompt(videoId, errorMessage);
                        return;
                    }
                    content.innerHTML = `❌ 無法載入留言：${error.message || '未知錯誤'}`;
                    return;
                }
                if (!comments.length) {
                    content.innerHTML = '❌ 無留言可顯示';
                    return;
                }
                allLoadedComments = comments;
                renderComments(comments);

                updatePageButtonState();
            });
        }

        function renderComments(comments) {
            content.innerHTML = '';
            comments.forEach(c => {
                const p = document.createElement('div');
                p.style.cssText = `border-bottom:1px solid #444; padding:8px 6px; margin-bottom:6px; user-select: text; cursor: text;`;
                p.innerHTML = `
                    <div style="color:#aaa; font-size:14px; margin-bottom:4px; user-select: text;">${c.author}</div>
                    <div class="comment-text" style="user-select: text; cursor: text;">${cleanHTML(c.text)}</div>
                    <div style="color:#0f9d58; font-size:14px; user-select: text;">👍 ${c.likeCount}</div>
                `;
                content.appendChild(p);
            });
        }

        function filterComments(keyword) {
            renderComments(keyword ? allLoadedComments.filter(c => c.text.toLowerCase().includes(keyword) || c.plain.toLowerCase().includes(keyword)) : allLoadedComments);
        }

        function translateAll(container, lang) {
            const validLangs = ['zh-TW', 'zh-CN', 'ja', 'en', 'fr', 'ko'];
            if (!validLangs.includes(lang)) {
                content.innerHTML = '❌ 無效的語言代碼，請選擇有效語言';
                return;
            }

            const nodes = container.querySelectorAll('.comment-text');
            if (nodes.length === 0) {
                content.innerHTML = '無留言可翻譯';
                return;
            }

            nodes.forEach(async node => {
                const text = node.textContent;
                if (!text.trim()) return;
                try {
                    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
                    if (!res.ok) throw new Error(`翻譯失敗，HTTP 狀態碼：${res.status}`);
                    const json = await res.json();
                    if (!json || !Array.isArray(json[0])) throw new Error('翻譯 API 回應格式無效');
                    const translated = json[0].map(x => x[0]).join('');
                    if (translated === text) throw new Error('翻譯結果與原文相同，可能語言代碼無效');
                    const translatedDiv = document.createElement('div');
                    translatedDiv.textContent = translated;
                    translatedDiv.style.cssText = `background:black; color:yellow; padding:4px; margin-top:2px; border-radius:4px; user-select: text; cursor: text;`;
                    if (!node.nextSibling || node.nextSibling.className !== 'translated-text') {
                        translatedDiv.className = 'translated-text';
                        node.parentNode.insertBefore(translatedDiv, node.nextSibling);
                    }
                } catch (error) {
                    console.error(`翻譯留言失敗: ${text.substring(0, 50)}...`, error);
                    const errorDiv = document.createElement('div');
                    errorDiv.textContent = `翻譯失敗: ${error.message}`;
                    errorDiv.style.cssText = `color:red; background:#000; margin-top:4px; user-select: text; cursor: text;`;
                    node.parentNode.insertBefore(errorDiv, node.nextSibling);
                }
            });
        }

        function fetchComments(videoId, order, totalTarget, pageToken = '', callback) {
            let allComments = [];
            let localPageToken = pageToken;

            function fetchPage() {
                const url = `${COMMENT_API}?part=snippet&videoId=${videoId}&maxResults=${Math.min(totalTarget - allComments.length, 100)}&order=${order}&key=${API_KEY}${localPageToken ? `&pageToken=${localPageToken}` : ''}`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: res => {
                        try {
                            const json = JSON.parse(res.responseText);
                            if (json.error) {
                                callback([], json.error);
                                return;
                            }
                            const newComments = json.items?.map(item => {
                                const s = item.snippet.topLevelComment.snippet;
                                return {
                                    text: s.textDisplay,
                                    plain: s.textOriginal,
                                    likeCount: s.likeCount || 0,
                                    author: s.authorDisplayName
                                };
                            }) || [];
                            allComments.push(...newComments);
                            localPageToken = json.nextPageToken || '';
                            nextPageToken = localPageToken;
                            if (allComments.length >= totalTarget || !localPageToken) {
                                callback(allComments.slice(0, totalTarget));
                            } else {
                                fetchPage();
                            }
                        } catch (e) {
                            callback([], { message: '解析錯誤' });
                        }
                    },
                    onerror: () => callback([], { message: '網路錯誤，請檢查網路、代理設置或瀏覽器擴展程式' })
                });
            }
            fetchPage();
        }

        function cleanHTML(text) {
            const div = document.createElement('div');
            div.innerHTML = text;
            return div.textContent || div.innerText || text;
        }

        loadComments();
    }

    function showFloatingPlayer(videoId) {
        let player = document.getElementById('floatingPlayer');
        if (player) player.remove();
        player = document.createElement('div');
        player.id = 'floatingPlayer';
        player.style.cssText = `
            position: fixed !important; top: 60px; right: 20px;
            width: 320px; height: 180px;
            background: black; border: 2px solid white;
            border-radius: 6px; box-shadow: 0 0 8px #000;
            z-index:2147483647 !important; cursor: move;
        `;
        const embedDomain = useNoCookieMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
        player.innerHTML = `
            <iframe width="100%" height="100%" src="https://${embedDomain}/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1"
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen tabindex="0"></iframe>
            <button style="position:absolute;top:2px;right:4px;background:#000a;border:none;color:white;font-size:14px;cursor:pointer;">❌</button>
        `;
        player.querySelector('button').onclick = () => player.remove();
        document.body.appendChild(player);

        const iframe = player.querySelector('iframe');
        if (iframe) {
            setTimeout(() => iframe.focus(), 100);
        }

        let isDragging = false, offsetX = 0, offsetY = 0;
        player.onmousedown = function(e) {
            if (e.target.tagName === 'IFRAME') return;
            isDragging = true;
            offsetX = e.clientX - player.offsetLeft;
            offsetY = e.clientY - player.offsetTop;
            e.preventDefault();
        };
        document.onmouseup = () => isDragging = false;
        document.onmousemove = function(e) {
            if (!isDragging) return;
            player.style.left = `${e.clientX - offsetX}px`;
            player.style.top = `${e.clientY - offsetY}px`;
        };
    }


    let observer = new MutationObserver((mutations) => processYTLinks(mutations));
    const hostname = window.location.hostname;
    const supportedSite = Object.keys(siteConfigs).find(site => hostname.includes(site));

    if (supportedSite) {
        insertToggleButton(supportedSite);
        if (isPermanentEnabled) {
            isProcessingEnabled = true;
            GM_setValue('ytProcessingEnabled', true);
            processYTLinks();
            observer.observe(document.querySelector(siteConfigs[supportedSite].observerTarget) || document.body, siteConfigs[supportedSite].observerOptions);
            stopAutoCloseTimer();
        }
        setInterval(() => {
            if (!document.querySelector('[aria-label="YouTube 掃描開關"]')) insertToggleButton(supportedSite);
        }, 30000);
    } else {
        isProcessingEnabled = true;
        setTimeout(() => {
            processYTLinks();
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('✅ 一般網頁 YouTube 預覽掃描啟動完成');
        }, 1500);
    }

})();