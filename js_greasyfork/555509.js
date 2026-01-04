// ==UserScript==
// @name         全站终极解锁脚本 V48 - 宗师完全体
// @namespace    http://tampermonkey.net/
// @version      48.0
// @description  【V48 宗师完全体】最终完美版！集所有优点于一身
// @author       小唧
// @match        https://d1ibyof3mbdf0n.cloudfront.net/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon        https://d1ibyof3mbdf0n.cloudfront.net/logo.png
// @downloadURL https://update.greasyfork.org/scripts/555509/%E5%85%A8%E7%AB%99%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC%20V48%20-%20%E5%AE%97%E5%B8%88%E5%AE%8C%E5%85%A8%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/555509/%E5%85%A8%E7%AB%99%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC%20V48%20-%20%E5%AE%97%E5%B8%88%E5%AE%8C%E5%85%A8%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 【全局配置与准备】 ---
    console.log("【V48 宗师完全体】脚本启动，所有功能模块已达最终形态！");
    const TOKEN_LOCAL_STORAGE_KEY = 'token';
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
    if (!token) { console.error("【V48】错误：未找到Token，社区视频功能可能受限！"); }

    // --- Part 1: 全站UI净化CSS ---
    const selectorsToHide = [
        'div[data-v-ea71a4b9]', '.vue-nice-modal-root', 'div.preview-ui[data-v-3b83d0e5]',
        'div.skip-preview-btn[data-v-3b83d0e5]', 'div.mine-ad[data-v-596393c3]', 'div[data-v-8928050a]',
        'div.openvip[data-v-fd5a7e65]', 'div.van-popup[data-v-a2591949]', 'div.van-overlay[data-v-a2591949]',
        'div.mine-ad[data-v-a2af3fea]', 'div.mine-ad[data-v-d708679d]', 'div.preview-ui[data-v-68642ae0]',
        'div.mt-16[data-v-68642ae0]', 'div.mine-ad[data-v-8cb30b83]', 'div.function-grid[data-v-8cb30b83]',
        'div.mask[data-v-97942dfa]',//直播间遮罩
        'div.JGbtnList[data-v-6e300ea2]', 'div.top5[data-v-6e300ea2]',
        'div.JGContent[data-v-9bcb2029]', 'div.player[data-v-6e300ea2] .xgplayer-controls',
        'div.player[data-v-6e300ea2] .xgplayer-enter', 'div.player[data-v-6e300ea2] .xgplayer-error',
        'div.player[data-v-6e300ea2] .xgplayer-start','div.w-full[data-v-147f4ad4]','div.layout-notice-swiper[data-v-24182773]',
        'div.promotion-expire[data-v-a2af3fea]','div.van-tabbar-item:nth-child(4)',//去ai,'div.van-tabbar-item:nth-child(4)'
        'div.van-tab--shrink:nth-child(2)','div.van-tab--shrink:nth-child(3)','div.van-tab--shrink:nth-child(4)','div.item_container:nth-child(1)',
        'div.first-comment:nth-child(1)','li[data-v-596393c3]:nth-child(2)','li[data-v-596393c3]:nth-child(3)','li[data-v-596393c3]:nth-child(4)',
        'li[data-v-596393c3]:nth-child(5)','li[data-v-596393c3]:nth-child(6)','div.sub-nav[data-v-596393c3]','div.bottom-link[data-v-8cb30b83]','div.van-tabbar-item:nth-child(6)',//去我的
        'div.card-item.mb-5[data-v-0781aa4b]:has(div.swiper_main .swiper-slide .bannerCover)','div.item_container:nth-child(2)','img[data-v-d708679d]'
    ];
    GM_addStyle(`${selectorsToHide.join(',\n')} { display: none !important; pointer-events: none !important; }`);

    // --- Part 2: 标准视频播放器解锁 ---
     try {
        const mediaPrototype = HTMLMediaElement.prototype;
        if (!mediaPrototype.hasOwnProperty('__isHookedByV48')) {
            const videoBasePattern = /VideoBase-[a-zA-Z0-9_]+/;
            const originalPause = mediaPrototype.pause;
            Object.defineProperty(mediaPrototype, 'pause', { value: function() {
                const stack = new Error().stack || '';
                if (videoBasePattern.test(stack)) return;
                originalPause.apply(this, arguments);
            }});
            const originalCurrentTimeSetter = Object.getOwnPropertyDescriptor(mediaPrototype, 'currentTime').set;
            Object.defineProperty(mediaPrototype, 'currentTime', {
                get: Object.getOwnPropertyDescriptor(mediaPrototype, 'currentTime').get,
                set: function(newValue) {
                    const stack = new Error().stack || '';
                    if (newValue < 1 && videoBasePattern.test(stack)) return;
                    originalCurrentTimeSetter.apply(this, arguments);
                }
            });
            mediaPrototype.__isHookedByV48 = true;
        }
    } catch (e) { console.error("【V48】部署标准播放器解锁模块失败:", e); }

    // --- Part 3: 数据拦截与播放器重建 ---
    let capturedCommunityVideoUrl = null;
    let hlsInstance = null;
    const communityVideoBaseUrl = 'https://d1ibyof3mbdf0n.cloudfront.net/api/app/media/h5/m3u8/';

    document.addEventListener('gemini-data-captured', function(event) {
        if (event.detail.type === 'community-video') {
            capturedCommunityVideoUrl = event.detail.data.url;
        }
    });

    const injectionCode = `
        (function() {
            if(window.fetch.toString().includes('gemini-data-captured')) return;
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
                const urlStr = typeof url === 'string' ? url : url.url;
                if (urlStr.includes('/api/app/post/detail')) {
                    originalFetch.apply(this, arguments).then(response => {
                        response.clone().json().then(data => {
                            if (data?.data?.video?.url) {
                                document.dispatchEvent(new CustomEvent('gemini-data-captured', { detail: { type: 'community-video', data: data.data.video } }));
                            }
                        });
                    });
                }
                return originalFetch.apply(this, arguments);
};
        })();
    `;
    const scriptElement = document.createElement('script');
    scriptElement.textContent = injectionCode;
    (document.head || document.documentElement).appendChild(scriptElement);
    scriptElement.remove();

    function cleanupPlayer() {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    }

    function loadHlsScript(callback) {
        if (window.Hls) return callback();
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        script.onload = callback;
        script.onerror = () => console.error("【V48】HLS.js 脚本加载失败！");
        document.head.appendChild(script);
    }

    function createCommunityPlayer(container) {
        if (!capturedCommunityVideoUrl || !token || container.dataset.geminiHijacked) return;
        container.dataset.geminiHijacked = 'true';
        console.log("【V48】检测到社区视频容器，创建播放器...");

        loadHlsScript(() => {
            const originalImageDiv = container.querySelector('div[data-v-bc1963f8]');
            if (originalImageDiv) originalImageDiv.style.display = 'none';

            const videoElement = document.createElement('video');
            videoElement.controls = true;
            videoElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; background: black; z-index: 10;';
            container.appendChild(videoElement);

            const fullUrl = `${communityVideoBaseUrl}${capturedCommunityVideoUrl}?token=${token}`;
            if (Hls.isSupported()) {
                cleanupPlayer();
                hlsInstance = new Hls();
                hlsInstance.loadSource(fullUrl);
                hlsInstance.attachMedia(videoElement);
            } else {
                videoElement.src = fullUrl;
            }
        });
    }

// --- 【基于原始代码的增强版 createLivePlayer 函数】 ---
function createLivePlayer(container) {
    if (container.dataset.geminiHijacked) return; // 防止对已处理的容器重复操作
    container.dataset.geminiHijacked = 'true';
    console.log("【V48】检测到新直播容器，执行潜入者终极算法...");

    // 步骤 1: 解析 - 🔧 修复画质识别正则支持帧率
    const params = new URLSearchParams(window.location.search);
    const initialStreamUrl = params.get('stream');
    if (!initialStreamUrl) return console.error("【V48】算法失败：无法从URL获取stream参数！");

    const qualityMatch = initialStreamUrl.match(/_([0-9]+p[0-9]*)/); // 🆕 支持 1080p60 格式
    if (!qualityMatch) return console.error("【V48】算法失败：初始stream参数格式错误！");

    const highestQuality = qualityMatch[1];
    const hasFrameRate = /p[0-9]+$/.test(highestQuality); // 🆕 检测是否带帧率
    const masterPlaylistUrl = initialStreamUrl.replace(/_[0-9]+p[0-9]*(\.m3u8.*)?/, '$1'); // 🔧 修复替换正则
    console.log(`【V48】[解析] 完成：最高画质锁定 [${highestQuality}]${hasFrameRate ? ' (带帧率，降级就绪)' : ''}`);

    // 监听"信号弹"
    document.addEventListener('gemini-template-found', function handler(event) {
        document.removeEventListener('gemini-template-found', handler);
        const templateUrl = event.detail.url;
        console.log(`【V48】[情报] 成功：动态CDN模板已捕获！${templateUrl}`);

        // 步骤 3: 合成 - 🔧 修复URL合成正则支持帧率
        const finalUrl = templateUrl.replace(/_[0-9]+p[0-9]*(\.m3u8.*)?$/, `_${highestQuality}$1`);
        console.log(`【V48】[合成] 完成！最终播放地址:`, finalUrl);

        // 步骤 4: 播放器移植与交付
        let attempts = 0;
        const pollingInterval = setInterval(() => {
            const originalVideoElement = container.querySelector('video');
            if (originalVideoElement || attempts > 50) {
                clearInterval(pollingInterval);
                if (!originalVideoElement) return console.error("【V48】算法失败：超时未找到原始video元素。");

                const newVideoElement = document.createElement('video');
                newVideoElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; background: black; z-index: 9999;';
                newVideoElement.controls = true;
                newVideoElement.autoplay = true;
                originalVideoElement.parentNode.replaceChild(newVideoElement, originalVideoElement);

                loadHlsScript(() => {
                    if (Hls.isSupported()) {
                        cleanupPlayer();
                        const hlsConfig = { maxBufferSize: 60, maxBufferLength: 30, liveSyncDurationCount: 7 };
                        hlsInstance = new Hls(hlsConfig);
                        hlsInstance.loadSource(finalUrl);
                        hlsInstance.attachMedia(newVideoElement);

                        // --- 🆕 增强错误处理：智能降级机制 ---
                        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                            if (data.fatal) {
                                console.error('【V48】HLS致命错误:', data);

                                // 🔥 关键：带帧率画质的智能降级
                                if (hasFrameRate && !hlsInstance._fallbackAttempted) {
                                    console.warn(`【V48】💡 智能降级：${highestQuality} → 720p`);
                                    hlsInstance._fallbackAttempted = true; // 防止无限降级

                                    // 构造720p降级URL
                                    const fallbackUrl = templateUrl.replace(/_[0-9]+p[0-9]*(\.m3u8.*)?$/, `_720p$1`);
                                    console.log(`【V48】[降级] 尝试720p: ${fallbackUrl}`);

                                    // 立即尝试降级
                                    hlsInstance.loadSource(fallbackUrl);
                                    hlsInstance.attachMedia(newVideoElement);
                                    return; // 不显示错误，直接尝试降级
                                }

                                // 标准画质失败 或 降级后仍失败，显示错误
                                const errorOverlay = document.createElement('div');
                                errorOverlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 16px; z-index: 10000;';
                                if(newVideoElement.parentNode) {
                                    newVideoElement.parentNode.appendChild(errorOverlay);
                                }

                                if (hasFrameRate && hlsInstance._fallbackAttempted) {
                                    errorOverlay.innerHTML = '直播加载失败<br><br>(已尝试降级至720p，主播可能已下播)';
                                } else {
                                    errorOverlay.innerHTML = '直播加载失败<br><br>(主播可能已下播或网络中断)';
                                }
                                cleanupPlayer();
                            }
                        });

                        // 🆕 成功加载提示
                        hlsInstance.on(Hls.Events.MANIFEST_LOADED, () => {
                            const currentQuality = hlsInstance._fallbackAttempted ? '720p' : highestQuality;
                            console.log(`【V48】✅ 播放成功！当前画质: ${currentQuality}`);
                        });

                        newVideoElement.play().catch(()=>{});
                    } else {
                        newVideoElement.src = finalUrl;
                    }
                    console.log(`【V48】[交付] 完成！强制播放 [${highestQuality}] 画质！`);
                });
            }
            attempts++;
        }, 100);
    });

    // 步骤 2: 注入"潜入者"脚本 (保持原逻辑)
    const injectionLogic = `
        (async function() {
            try {
                const response = await fetch('${masterPlaylistUrl}');
                const playlistContent = await response.text();
                const templateUrlMatch = playlistContent.match(/^(https?:\\/\\/.+)$/m);
                if (templateUrlMatch) {
                    document.dispatchEvent(new CustomEvent('gemini-template-found', { detail: { url: templateUrlMatch[1] } }));
                }
            } catch (error) {
                console.error('【V48 Injected Script Error】:', error);
            }
        })();
    `;
    const liveInjectorScript = document.createElement('script');
    liveInjectorScript.textContent = injectionLogic;
    (document.head || document.documentElement).appendChild(liveInjectorScript);
    liveInjectorScript.remove();
    console.log(`【V48】[潜入] 开始：获取动态CDN节点的别动队已派出！${masterPlaylistUrl}`);
}

// --- Part 4: 【最终形态的页面监视器，支持 SPA + HLS 生命周期管理】 ---
(function() {
    // --- SPA URL 变化管理 HLS ---
    function handleUrlChange() {
        // 判断是否离开直播间（假设直播间 URL 带 ?stream=xxx 参数）
        if (!window.location.href.includes('stream')) {
            console.log("【V48】SPA路由检测：离开直播间，销毁 HLS 实例");
            cleanupPlayer();
        }
    }

    // Hook history.pushState
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleUrlChange();
    };

    // Hook history.replaceState
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handleUrlChange();
    };

    // 浏览器前进/返回触发
    window.addEventListener('popstate', handleUrlChange);

    // 页面刷新或关闭触发
    window.addEventListener('beforeunload', cleanupPlayer);

    // --- MutationObserver: 监控 DOM 增删节点 ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // --- 处理新增节点 ---
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;

                    // 直播播放器检测
                    const livePlayerSelector = 'div.player[data-v-97942dfa]';//获取直播间窗口
                    const liveContainers = node.matches(livePlayerSelector) ? [node] : node.querySelectorAll(livePlayerSelector);
                    liveContainers.forEach(createLivePlayer);

                    // 社区视频播放器检测
                    const communityPlayerSelector = 'li.video_img[data-v-68642ae0]';
                    const communityContainers = node.matches(communityPlayerSelector) ? [node] : node.querySelectorAll(communityPlayerSelector);
                    communityContainers.forEach(createCommunityPlayer);
                });
            }

            // --- 处理删除节点: 如果直播容器被移除则销毁 HLS ---
            if (mutation.removedNodes.length) {
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    const livePlayerSelector = 'div.player[data-v-6e300ea2]';
                    if (node.matches(livePlayerSelector) || node.querySelector(livePlayerSelector)) {
                        console.log("【V48】检测到直播容器被移除，销毁 HLS 实例");
                        cleanupPlayer();
                    }
                });
            }
        }
    });

    // 开始观察整个页面
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();


})();