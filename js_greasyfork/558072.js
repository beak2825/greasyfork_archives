// ==UserScript==
// @name         抖音自动跳过广告视频 (精准版 v3.7)
// @namespace    http://tampermonkey.net/
// @version      3.7.0
// @description  精准检测并跳过抖音网页版的广告视频、购物视频和直播带货视频，首次加载自动开启声音和最高清晰度
// @author       Assistant
// @match        https://www.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @license      CC BY-NC-ND 4.0
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558072/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E8%A7%86%E9%A2%91%20%28%E7%B2%BE%E5%87%86%E7%89%88%20v37%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558072/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%E8%A7%86%E9%A2%91%20%28%E7%B2%BE%E5%87%86%E7%89%88%20v37%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置项 ====================
    const CONFIG = {
        checkInterval: 100,
        skipDelay: 100,
        stabilityDelay: 300,
        maxRetries: 3,
        retryDelay: 200,
        debug: true,
        showNotification: true,
        notificationDuration: 500,
        skipAds: true,
        skipShopping: true,
        skipLive: true,
        // 初始化设置
        autoUnmute: false,
        autoHighQuality: true,
        initSettingsDelay: 500
    };

    // 清晰度优先级列表（从高到低）
    const QUALITY_PRIORITY = ['8K', '4K', '2K', '1080P', '720P', '540P', '480P', '360P'];

    // ==================== 状态管理 ====================
    const state = {
        currentVideoId: null,
        lastSkipTime: 0,
        processedVideos: new Set(),
        isChecking: false,
        checkTimeout: null,
        skipInProgress: false,
        initSettingsDone: false,
        lastLiveSkipTime: 0  // 新增：防止直播重复跳过
    };

    // ==================== 工具函数 ====================
    function log(...args) {
        if (CONFIG.debug) {
            console.log('%c[抖音跳广告 v3.7]', 'color: #ff4757; font-weight: bold;', ...args);
        }
    }

    function showNotification(message, type = 'ad') {
        if (!CONFIG.showNotification) return;

        const existing = document.getElementById('dy-ad-skip-notify');
        if (existing) existing.remove();

        const colors = {
            ad: 'linear-gradient(135deg, #ff4757, #ff6b81)',
            shopping: 'linear-gradient(135deg, #ffa502, #ff7f50)',
            live: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            info: 'linear-gradient(135deg, #2ed573, #7bed9f)',
            setting: 'linear-gradient(135deg, #3742fa, #5352ed)'
        };

        const icons = { ad: '🚫', shopping: '🛒', live: '📺', info: '✓', setting: '⚙️' };

        const div = document.createElement('div');
        div.id = 'dy-ad-skip-notify';
        div.innerHTML = `
            <div style="
                position: fixed; top: 70px; left: 50%; transform: translateX(-50%);
                background: ${colors[type] || colors.ad}; color: white;
                padding: 14px 28px; border-radius: 30px; font-size: 14px; font-weight: 600;
                z-index: 999999; box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                animation: dyNotifyIn 0.4s ease; display: flex; align-items: center; gap: 10px;
            "><span style="font-size: 18px;">${icons[type] || icons.ad}</span>${message}</div>
            <style>
                @keyframes dyNotifyIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.9); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                }
            </style>
        `;
        document.body.appendChild(div);
        setTimeout(() => {
            div.style.transition = 'all 0.3s ease';
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, CONFIG.notificationDuration);
    }

    /**
     * 模拟真实点击
     */
    function simulateClick(element) {
        if (!element) return false;

        try {
            element.click();
            return true;
        } catch (e) {
            log('click() 失败，尝试其他方式');
        }

        try {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mousedownEvent = new MouseEvent('mousedown', {
                bubbles: true, cancelable: true, view: window,
                clientX: centerX, clientY: centerY
            });
            const mouseupEvent = new MouseEvent('mouseup', {
                bubbles: true, cancelable: true, view: window,
                clientX: centerX, clientY: centerY
            });
            const clickEvent = new MouseEvent('click', {
                bubbles: true, cancelable: true, view: window,
                clientX: centerX, clientY: centerY
            });

            element.dispatchEvent(mousedownEvent);
            element.dispatchEvent(mouseupEvent);
            element.dispatchEvent(clickEvent);
            return true;
        } catch (e) {
            log('MouseEvent 派发失败:', e);
            return false;
        }
    }

    // ==================== 初始化设置功能 ====================

    /**
     * 取消静音 - 打开声音
     */
    function unmute() {
        const volumeBtn = document.querySelector('.xgplayer-volume');
        if (!volumeBtn) {
            log('未找到音量控制按钮，稍后重试...');
            return false;
        }

        const currentState = volumeBtn.getAttribute('data-state');
        log('当前音量状态:', currentState);

        if (currentState === 'mute') {
            const iconDiv = volumeBtn.querySelector('.xgplayer-icon');
            if (iconDiv) {
                log('尝试点击音量图标...');
                simulateClick(iconDiv);

                setTimeout(() => {
                    const newState = volumeBtn.getAttribute('data-state');
                    if (newState !== 'mute') {
                        log('✓ 已取消静音，当前状态:', newState);
                    } else {
                        log('点击后状态仍为静音，尝试再次点击');
                        simulateClick(iconDiv);
                    }
                }, 100);
                return true;
            }
        } else {
            log('✓ 当前已经是非静音状态:', currentState);
            return true;
        }
        return false;
    }

    /**
     * 获取清晰度优先级分数
     */
    function getQualityScore(text) {
        for (let i = 0; i < QUALITY_PRIORITY.length; i++) {
            if (text.includes(QUALITY_PRIORITY[i])) {
                return QUALITY_PRIORITY.length - i;
            }
        }
        return 0;
    }

    /**
     * 设置最高清晰度
     */
    function setHighestQuality() {
        const clarityContainer = document.querySelector('.xgplayer-playclarity-setting');
        if (!clarityContainer) {
            log('未找到清晰度设置容器');
            return false;
        }

        const items = clarityContainer.querySelectorAll('.gear .virtual .item');
        if (!items || items.length === 0) {
            log('未找到清晰度选项');
            return false;
        }

        let highestQualityItem = null;
        let highestScore = -1;
        let highestQualityName = '';

        for (const item of items) {
            const text = item.textContent.trim();
            const score = getQualityScore(text);
            log(`清晰度选项: "${text}", 分数: ${score}`);
            if (score > highestScore) {
                highestScore = score;
                highestQualityItem = item;
                highestQualityName = text;
            }
        }

        if (highestQualityItem && highestScore > 0) {
            if (highestQualityItem.classList.contains('selected')) {
                log('✓ 已经是最高清晰度:', highestQualityName);
                return { success: true, name: highestQualityName };
            }

            const gear = clarityContainer.querySelector('.gear');
            if (gear) {
                gear.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

                setTimeout(() => {
                    simulateClick(highestQualityItem);
                    log('✓ 已设置清晰度为:', highestQualityName);

                    setTimeout(() => {
                        gear.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                    }, 100);
                }, 300);

                return { success: true, name: highestQualityName };
            }
        }

        return { success: false, name: '' };
    }

    /**
     * 执行初始化设置
     */
    function performInitSettings() {
        if (state.initSettingsDone) {
            log('初始化设置已执行过，跳过');
            return;
        }

        log('执行初始化设置...');

        let settingsApplied = [];

        if (CONFIG.autoUnmute) {
            const volumeBtn = document.querySelector('.xgplayer-volume');
            if (volumeBtn) {
                if (unmute()) {
                    settingsApplied.push('🔊 声音已开启');
                }
            } else {
                log('音量按钮未找到，500ms后重试');
                setTimeout(() => {
                    if (unmute()) {
                        showNotification('🔊 声音已开启', 'setting');
                    }
                }, 500);
            }
        }

        if (CONFIG.autoHighQuality) {
            setTimeout(() => {
                const result = setHighestQuality();
                if (result && result.success && result.name) {
                    settingsApplied.push(`📺 ${result.name}`);
                    if (settingsApplied.length > 0) {
                        showNotification(settingsApplied.join(' | '), 'setting');
                    }
                }
            }, 600);
        }

        state.initSettingsDone = true;
        log('初始化设置标记完成');
    }

    // ==================== 核心检测逻辑 ====================

    /**
     * 获取当前活跃的视频或直播
     * 修复：同时支持普通视频和直播
     */
    function getActiveVideo() {
        // 1. 首先检查普通视频
        const videoContainer = document.querySelector('[data-e2e="feed-active-video"]');
        if (videoContainer) {
            const videoId = videoContainer.getAttribute('data-e2e-vid');
            return { container: videoContainer, videoId, type: 'video' };
        }

        // 2. 检查直播视频 (feed-live)
        const liveContainer = document.querySelector('[data-e2e="feed-live"]');
        if (liveContainer) {
            // 直播没有固定的 vid，使用元素ID或生成唯一标识
            const liveId = 'live_' + (liveContainer.id || 'current');
            return { container: liveContainer, videoId: liveId, type: 'live' };
        }

        // 3. 备用：检查 slider-card（某些直播使用这个）
        const sliderCard = document.querySelector('#slider-card[data-e2e="feed-live"]');
        if (sliderCard) {
            return { container: sliderCard, videoId: 'live_slider', type: 'live' };
        }

        return null;
    }

    /**
     * 检测直播带货特征（新增）
     */
    function checkLiveSalesFeatures(container) {
        if (!CONFIG.skipLive) return { isLiveSales: false, reason: '' };

        // 检查 data-e2e="feed-live" 属性（最直接的判断）
        if (container.getAttribute('data-e2e') === 'feed-live') {
            // 检查是否有购物车/商品列表
            //const yellowCart = container.querySelector('[data-e2e="yellowCart-container"]');
            //if (yellowCart) {
            //    return { isLiveSales: true, reason: '直播带货（购物车）' };
            //}

            // 检查"全部商品"按钮
            const allGoodsBtn = container.querySelector('.oUumeR8j');
            if (allGoodsBtn && allGoodsBtn.textContent.includes('全部商品')) {
                return { isLiveSales: true, reason: '直播带货（全部商品）' };
            }

            // 检查直播中标签
            //const liveTag = container.querySelector('.semi-tag-content');
            //if (liveTag && (liveTag.textContent.includes('直播中') || liveTag.textContent.includes('直播'))) {
            //    return { isLiveSales: true, reason: '直播中' };
            //}

            // 检查直播加载中
            //const liveLoading = container.querySelector('.douyin-player-loading-text');
            //if (liveLoading && liveLoading.textContent.includes('直播')) {
            //    return { isLiveSales: true, reason: '直播加载中' };
            //}

            // 检查进入直播间提示
            //const enterLiveText = container.textContent;
            //if (enterLiveText.includes('进入直播间') || enterLiveText.includes('点击进入直播')) {
            //    return { isLiveSales: true, reason: '直播入口' };
            //}

            // 如果是 feed-live 但没有明显特征，也跳过（保守策略）
            //return { isLiveSales: true, reason: '直播视频' };
        }

        return { isLiveSales: false, reason: '' };
    }

    function checkAdFeatures(container) {
        if (!CONFIG.skipAds) return { isAd: false, reason: '' };

        const playbackRatio = container.querySelector('.xgplayer-setting-playbackRatio');
        if (playbackRatio && playbackRatio.classList.contains('disabled')) {
            return { isAd: true, reason: '广告视频（倍速禁用）' };
        }

        const tips = container.querySelector('.xgplayer-playback-setting .xgTips');
        if (tips && tips.textContent.includes('广告视频不支持倍速功能')) {
            return { isAd: true, reason: '广告视频（提示文字）' };
        }

        return { isAd: false, reason: '' };
    }

    function checkShoppingFeatures(container) {
        if (!CONFIG.skipShopping) return { isShopping: false, reason: '' };

        const shopAnchor = container.querySelector('.xgplayer-shop-anchor');
        if (shopAnchor && shopAnchor.offsetWidth > 0) {
            return { isShopping: true, reason: '购物链接' };
        }

        const sideBar = container.querySelector('#videoSideBar');
        if (sideBar) {
            const productCard = sideBar.querySelector('[class*="goods"], [class*="product"], [class*="commodity"]');
            if (productCard && productCard.offsetWidth > 0) {
                if (!sideBar.textContent.includes('全部商品') && !sideBar.textContent.includes('直播')) {
                    return { isShopping: true, reason: '商品详情' };
                }
            }
        }

        const embeddedCard = container.querySelector('.xgplayer-shop-anchor, [class*="shopAnchor"]');
        if (embeddedCard && embeddedCard.offsetWidth > 0) {
            return { isShopping: true, reason: '嵌入式购物卡片' };
        }

        return { isShopping: false, reason: '' };
    }

    function checkLiveFeatures(container) {
        if (!CONFIG.skipLive) return { isLive: false, reason: '' };

        const player = container.querySelector('.xgplayer') || container;

        // 检查直播标签
        const liveTag = player.querySelector('[class*="live-tag"], [class*="liveTag"], [class*="LiveTag"]');
        if (liveTag && liveTag.offsetWidth > 0 && liveTag.offsetWidth < 150) {
            const text = liveTag.textContent.trim();
            if (text.includes('直播中') || text.includes('直播')) {
                return { isLive: true, reason: '直播中标签' };
            }
        }

        // 检查 semi-tag（抖音新版直播标签）
        const semiTag = container.querySelector('.semi-tag-content');
        if (semiTag && semiTag.textContent.includes('直播')) {
            return { isLive: true, reason: '直播标签(semi-tag)' };
        }

        const livePlayer = container.querySelector('[class*="live-player"], [class*="livePlayer"]');
        if (livePlayer) {
            return { isLive: true, reason: '直播播放器' };
        }

        const sideBar = container.querySelector('#videoSideBar');
        if (sideBar) {
            const sideBarText = sideBar.textContent;
            if (/全部商品\s*\d+/.test(sideBarText)) {
                return { isLive: true, reason: '直播商品列表' };
            }
            if (/\d{1,2}月\d{1,2}日.*\d{1,2}:\d{2}/.test(sideBarText) && sideBarText.includes('开播')) {
                return { isLive: true, reason: '直播预告' };
            }
        }

        const overlays = container.querySelectorAll('[class*="overlay"], [class*="cover"], [class*="mask"]');
        for (const overlay of overlays) {
            if (overlay.offsetWidth > 0) {
                const text = overlay.textContent.trim();
                if (text === '直播中' || text === '直播加载中' || text.match(/^直播中.*进入直播间$/)) {
                    return { isLive: true, reason: '直播覆盖层' };
                }
            }
        }

        const enterLiveBtn = container.querySelector('[class*="enter-live"], [class*="enterLive"], [class*="goLive"]');
        if (enterLiveBtn && enterLiveBtn.offsetWidth > 0) {
            return { isLive: true, reason: '进入直播间按钮' };
        }

        const descArea = container.querySelector('[class*="desc"], [class*="info"], [class*="meta"]');
        if (descArea) {
            const descText = descArea.textContent;
            if (descText.includes('正在直播') || descText.includes('进入直播间')) {
                return { isLive: true, reason: '直播描述' };
            }
        }

        return { isLive: false, reason: '' };
    }

    function detectVideoType(container, type) {
        if (!container) return { shouldSkip: false, reason: '', type: 'normal' };

        // 如果已经标识为直播类型，直接检测直播特征
        if (type === 'live') {
            const liveSalesResult = checkLiveSalesFeatures(container);
            if (liveSalesResult.isLiveSales) {
                return { shouldSkip: true, reason: liveSalesResult.reason, type: 'live' };
            }
        }

        // 检测广告
        const adResult = checkAdFeatures(container);
        if (adResult.isAd) {
            return { shouldSkip: true, reason: adResult.reason, type: 'ad' };
        }

        // 检测直播特征（针对普通视频容器中的直播元素）
        const liveResult = checkLiveFeatures(container);
        if (liveResult.isLive) {
            return { shouldSkip: true, reason: liveResult.reason, type: 'live' };
        }

        // 检测购物
        const shoppingResult = checkShoppingFeatures(container);
        if (shoppingResult.isShopping) {
            return { shouldSkip: true, reason: shoppingResult.reason, type: 'shopping' };
        }

        return { shouldSkip: false, reason: '', type: 'normal' };
    }

    function skipVideo() {
        if (state.skipInProgress) {
            log('跳过操作正在进行中，忽略重复请求');
            return;
        }

        state.skipInProgress = true;
        log('执行跳过...');

        const slideList = document.querySelector('#slidelist');
        if (slideList) {
            const activeItem = document.querySelector('[data-e2e="feed-active-video"]')?.closest('[data-e2e="recommend-item"]') ||
                              document.querySelector('[data-e2e="feed-live"]')?.closest('[data-e2e="recommend-item"]');
            if (activeItem) {
                const itemHeight = activeItem.offsetHeight || window.innerHeight;
                slideList.scrollTo({
                    top: slideList.scrollTop + itemHeight,
                    behavior: 'smooth'
                });
                setTimeout(() => { state.skipInProgress = false; }, 600);
                return;
            }
        }

        const event = new KeyboardEvent('keydown', {
            key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40,
            bubbles: true, cancelable: true, view: window
        });
        document.body.dispatchEvent(event);
        setTimeout(() => { state.skipInProgress = false; }, 600);
    }

    async function detectWithRetry(container, videoId, type, retryCount = 0) {
        const result = detectVideoType(container, type);
        if (result.shouldSkip) return result;

        if (retryCount < CONFIG.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
            const currentVideo = getActiveVideo();
            if (currentVideo && currentVideo.videoId === videoId) {
                return detectWithRetry(currentVideo.container, videoId, currentVideo.type, retryCount + 1);
            }
        }
        return result;
    }

    async function checkAndSkip() {
        if (state.isChecking || state.skipInProgress) return;
        state.isChecking = true;

        try {
            const video = getActiveVideo();
            if (!video) {
                state.isChecking = false;
                return;
            }

            const { container, videoId, type } = video;

            // 直播类型的特殊处理
            if (type === 'live') {
                // 防止短时间内重复跳过同一个直播
                const now = Date.now();
                if (now - state.lastLiveSkipTime < 1000) {
                    log('直播跳过冷却中...');
                    state.isChecking = false;
                    return;
                }

                if (CONFIG.skipLive) {
                    const liveSalesResult = checkLiveSalesFeatures(container);
                    if (liveSalesResult.isLiveSales) {
                        log('🚫 检测到直播带货视频，准备跳过:', liveSalesResult.reason);
                        showNotification(`已跳过: ${liveSalesResult.reason}`, 'live');
                        state.lastLiveSkipTime = now;
                        await new Promise(resolve => setTimeout(resolve, CONFIG.skipDelay));
                        skipVideo();
                    }
                }
                state.isChecking = false;
                return;
            }

            // 普通视频的处理逻辑
            if (videoId === state.currentVideoId) {
                state.isChecking = false;
                return;
            }

            log('视频切换:', state.currentVideoId, '->', videoId);
            state.currentVideoId = videoId;

            if (state.processedVideos.has(videoId)) {
                log('该视频已处理过，跳过检测');
                state.isChecking = false;
                return;
            }

            await new Promise(resolve => setTimeout(resolve, CONFIG.stabilityDelay));

            const currentVideo = getActiveVideo();
            if (!currentVideo || currentVideo.videoId !== videoId) {
                log('视频已切换，取消检测');
                state.isChecking = false;
                return;
            }

            const result = await detectWithRetry(currentVideo.container, videoId, currentVideo.type);

            if (result.shouldSkip) {
                const typeNames = { ad: '广告', shopping: '购物', live: '直播带货' };
                log(`🚫 检测到${typeNames[result.type]}视频，准备跳过:`, result.reason);
                state.processedVideos.add(videoId);

                if (state.processedVideos.size > 100) {
                    state.processedVideos = new Set(Array.from(state.processedVideos).slice(-50));
                }

                showNotification(`已跳过: ${result.reason}`, result.type);
                await new Promise(resolve => setTimeout(resolve, CONFIG.skipDelay));
                skipVideo();
                state.lastSkipTime = Date.now();
            } else {
                log('✓ 正常视频:', videoId);
            }
        } catch (e) {
            log('检测出错:', e);
        } finally {
            state.isChecking = false;
        }
    }

    function forceCheck() {
        state.currentVideoId = null;
        state.isChecking = false;
        state.skipInProgress = false;
        state.lastLiveSkipTime = 0;
        checkAndSkip();
    }

    function toggleFeature(feature, enable) {
        if (feature === 'shopping') CONFIG.skipShopping = enable;
        else if (feature === 'ad') CONFIG.skipAds = enable;
        else if (feature === 'live') CONFIG.skipLive = enable;

        const names = { shopping: '购物视频', ad: '广告视频', live: '直播带货' };
        log(`${names[feature]}跳过: ${enable ? '开启' : '关闭'}`);
        showNotification(`${names[feature]}跳过: ${enable ? '已开启' : '已关闭'}`, 'info');
    }

    function init() {
        log('插件启动 v3.7.0 - 修复直播带货检测');
        log(`广告跳过: ${CONFIG.skipAds ? '开启' : '关闭'}`);
        log(`购物跳过: ${CONFIG.skipShopping ? '开启' : '关闭'}`);
        log(`直播跳过: ${CONFIG.skipLive ? '开启' : '关闭'}`);
        log(`自动开启声音: ${CONFIG.autoUnmute ? '开启' : '关闭'}`);
        log(`自动最高清晰度: ${CONFIG.autoHighQuality ? '开启' : '关闭'}`);

        setInterval(checkAndSkip, CONFIG.checkInterval);

        const observer = new MutationObserver(() => {
            clearTimeout(state.checkTimeout);
            state.checkTimeout = setTimeout(checkAndSkip, 150);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setTimeout(checkAndSkip, 600);
            }
        });

        let wheelTimeout;
        document.addEventListener('wheel', () => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(checkAndSkip, 600);
        }, { passive: true });

        setTimeout(() => {
            const slideList = document.querySelector('#slidelist');
            if (slideList) {
                observer.observe(slideList, {
                    childList: true, subtree: true, attributes: true,
                    attributeFilter: ['data-e2e-vid', 'class', 'data-e2e']
                });
            }

            performInitSettings();
            checkAndSkip();
            showNotification('广告跳过 v3.7 已启动 ✓', 'info');
        }, CONFIG.initSettingsDelay);

        window._dyAdSkip = {
            forceCheck,
            toggleShopping: (enable) => toggleFeature('shopping', enable),
            toggleAd: (enable) => toggleFeature('ad', enable),
            toggleLive: (enable) => toggleFeature('live', enable),
            unmute,
            setHighestQuality,
            resetInitSettings: () => {
                state.initSettingsDone = false;
                performInitSettings();
            },
            state,
            config: CONFIG
        };

        log('控制台命令: _dyAdSkip.forceCheck() / _dyAdSkip.toggleLive(true/false)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
