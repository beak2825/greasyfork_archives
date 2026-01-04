// ==UserScript==
// @name         全站终极解锁脚本 V52 - 宗师终极调试版
// @namespace    http://tampermonkey.net/
// @version      52.0
// @license      MIT
// @description  V52 最终版：集成 AES 动态解密与全能播放修复。在 V51 基础上大幅增强调试日志，详细输出解密流程、数据结构快照、播放器状态与错误堆栈，便于未来维护与排查。
// @author       小唧
// @match        https://d1ibyof3mbdf0n.cloudfront.net/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @run-at       document-start
// @icon         https://d1ibyof3mbdf0n.cloudfront.net/logo.png
// @downloadURL https://update.greasyfork.org/scripts/557249/%E5%85%A8%E7%AB%99%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC%20V52%20-%20%E5%AE%97%E5%B8%88%E7%BB%88%E6%9E%81%E8%B0%83%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/557249/%E5%85%A8%E7%AB%99%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC%20V52%20-%20%E5%AE%97%E5%B8%88%E7%BB%88%E6%9E%81%E8%B0%83%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日志样式工具
    const LOG_PREFIX = '【V52】';
    const log = (msg, ...args) => console.log(`%c${LOG_PREFIX} ${msg}`, 'color: #00d2ff; font-weight: bold;', ...args);
    const warn = (msg, ...args) => console.warn(`%c${LOG_PREFIX} ⚠️ ${msg}`, 'color: #ffcc00; font-weight: bold;', ...args);
    const error = (msg, ...args) => console.error(`%c${LOG_PREFIX} ❌ ${msg}`, 'color: #ff0055; font-weight: bold;', ...args);
    const group = (msg) => console.groupCollapsed(`%c${LOG_PREFIX} 🔧 ${msg}`, 'color: #bada55; font-weight: bold;');
    const groupEnd = () => console.groupEnd();

    log("脚本启动！正在初始化加密模块与监听器...");

    // =========================
    //  零、核心配置 (必须配置)
    // =========================

    // ⚠️⚠️⚠️ 【此处必填】请将抓包获取的 http_response_key 填入下方引号内 ⚠️⚠️⚠️
    const AR_HTTP_RESPONSE_KEY = "vEukA&w15z4VAD3kAY#fkL#rBnU!WDhN";

    // =========================
    //  一、AES 解密引擎 (带深度日志)
    // =========================

    function decryptResponse(encryptedBase64) {
        if (!AR_HTTP_RESPONSE_KEY || AR_HTTP_RESPONSE_KEY.includes("填写")) {
            error("解密中止：未配置 AR_HTTP_RESPONSE_KEY！请编辑脚本填入 Key。");
            return null;
        }

        try {
            // log(`[Crypto] 开始解密，密文长度: ${encryptedBase64.length}`);
            const t = AR_HTTP_RESPONSE_KEY;
            const n = 12;

            // 1. Base64 -> Uint8Array
            const binaryString = window.atob(encryptedBase64);
            const r = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                r[i] = binaryString.charCodeAt(i);
            }
            const r_arr = Array.from(r);

            // 2. 提取 Salt
            const o = r_arr.splice(0, n);
            // log(`[Crypto] 提取 Salt (前12字节): [${o.slice(0,5)}...]`);

            // 3. 密钥派生 (KDF)
            let i_seed = [...stringToByteArray(t), ...o];
            const a = Math.floor(i_seed.length / 2);

            let i_words = arrayToWordArray(i_seed);
            let sha_i = CryptoJS.SHA256(i_words).toString();
            let f_full = hexToByteArray(sha_i);
            let f = f_full.splice(8, 16);

            let d = [...f, ...i_seed.splice(0, a)];
            let d_words = arrayToWordArray(d);
            let sha_d = CryptoJS.SHA256(d_words).toString();
            let p = hexToByteArray(sha_d);

            let v = [...i_seed, ...f];
            let v_words = arrayToWordArray(v);
            let sha_v = CryptoJS.SHA256(v_words).toString();
            let g = hexToByteArray(sha_v);

            const y = [...p.splice(0, 8), ...g.splice(8, 16), ...p.splice(16, 24)]; // Key
            const A = [...g.splice(0, 4), ...p.splice(4, 8), ...g.splice(8, 12)];  // IV

            // 4. 执行 AES-CBC 解密
            const ciphertext = arrayToWordArray(r_arr);
            const key = arrayToWordArray(y);
            const iv = arrayToWordArray(A);

            const decrypted = CryptoJS.AES.decrypt(
                { ciphertext: ciphertext },
                key,
                { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
            );

            const result = decrypted.toString(CryptoJS.enc.Utf8);
            if (!result) {
                error("[Crypto] 解密结果为空！可能是 Key 错误或算法变动。");
                return null;
            }
            return result;

        } catch (e) {
            error("[Crypto] 解密过程抛出异常:", e);
            return null;
        }
    }

    // 工具函数
    function stringToByteArray(str) {
        const encoded = encodeURIComponent(str);
        const arr = [];
        for (let i = 0; i < encoded.length; i++) {
            const char = encoded.charAt(i);
            if (char === "%") {
                arr.push(parseInt(encoded.charAt(i + 1) + encoded.charAt(i + 2), 16));
                i += 2;
            } else {
                arr.push(char.charCodeAt(0));
            }
        }
        return arr;
    }
    function hexToByteArray(hexStr) {
        const arr = [];
        for (let i = 0; i < hexStr.length; i += 2) arr.push(parseInt(hexStr.substr(i, 2), 16));
        return arr;
    }
    function arrayToWordArray(u8Array) {
        const words = [];
        for (let i = 0; i < u8Array.length; i++) words[i >>> 2] |= (u8Array[i] & 0xff) << (24 - (i % 4) * 8);
        return CryptoJS.lib.WordArray.create(words, u8Array.length);
    }

    // =========================
    //  二、网络层：Fetch 劫持与数据对抗
    // =========================

    const originalFetch = unsafeWindow.fetch;
    if (!originalFetch) {
        error("致命错误：unsafeWindow.fetch 不存在，脚本无法工作！");
    } else {
        unsafeWindow.fetch = async function(url, options) {
            let urlStr = (typeof url === 'string') ? url : (url && url.url);

            // 调用原始请求
            let response = await originalFetch.apply(this, arguments);

            const isPlayApi = urlStr && urlStr.includes('/api/app/media/play');
            const isPostApi = urlStr && urlStr.includes('/api/app/post/detail');

            if (isPlayApi || isPostApi) {
                const apiType = isPlayApi ? "长视频(Play)" : "社区(Post)";

                try {
                    const clone = response.clone();
                    let json = null;
                    try { json = await clone.json(); } catch(e) {
                        // warn(`[Net] 接口 ${apiType} 返回的不是 JSON，跳过处理`);
                    }

                    // 检查加密特征: code=200, hash=true, data是字符串
                    if (json && json.code === 200 && json.hash === true && typeof json.data === 'string') {
                        group(`拦截到加密响应: ${apiType}`);
                        log(`原始密文预览: ${json.data.substring(0, 30)}...`);

                        const decryptedStr = decryptResponse(json.data);

                        if (decryptedStr) {
                            log("✅ AES 解密成功！");
                            let innerData = null;
                            try {
                                innerData = JSON.parse(decryptedStr);
                                log("解析后的数据结构:", innerData);
                            } catch(parseErr) {
                                error("JSON 解析失败，明文可能不是有效 JSON:", decryptedStr);
                            }

                            if (innerData) {
                                // --- 业务逻辑 A: 长视频 URL 修复 ---
                                if (isPlayApi) {
                                    if (innerData.mediaInfo) {
                                        const mi = innerData.mediaInfo;
                                        const full = mi.videoUrl || mi.preFileName;
                                        if (full) {
                                            log(`[URL修复] 原始 videoUrl: ${mi.videoUrl}`);
                                            log(`[URL修复] 原始 preFileName: ${mi.preFileName}`);
                                            mi.videoUrl = full;
                                            mi.preFileName = full;
                                            log(`[URL修复] ✅ 已强制对齐为: ${full}`);
                                        } else {
                                            warn("[URL修复] ⚠️ mediaInfo 中没有找到有效 URL (videoUrl/preFileName 均为空)");
                                        }
                                    } else {
                                        warn("[URL修复] ⚠️ 解密数据中缺少 mediaInfo 字段");
                                    }
                                }

                                // --- 业务逻辑 B: 社区视频提取 ---
                                if (isPostApi) {
                                    if (innerData.video && innerData.video.url) {
                                        log(`[社区] 🔍 捕获视频 URL: ${innerData.video.url}`);
                                        capturedCommunityVideoUrl = innerData.video.url;
                                        setTimeout(applyCommunityPlayersForAllContainers, 500);
                                    } else {
                                        log("[社区] ⚠️ 该帖子数据中未发现视频 URL");
                                    }
                                }

                                // --- 构造伪造响应 ---
                                json.data = innerData;
                                json.hash = false;
                                log("🔄 已重构响应包 (hash: false)，返回给页面。");

                                groupEnd();
                                return new Response(JSON.stringify(json), {
                                    status: response.status,
                                    statusText: response.statusText,
                                    headers: response.headers
                                });
                            }
                        } else {
                            error("❌ 解密失败！将原样返回加密数据，页面可能会报错。");
                            groupEnd();
                        }
                    }
                    // 处理偶发的明文情况
                    else if (json && json.code === 200 && !json.hash && isPlayApi) {
                        if (json.data && json.data.mediaInfo) {
                             const mi = json.data.mediaInfo;
                             const full = mi.videoUrl || mi.preFileName;
                             if (full && mi.videoUrl !== full) { // 只有当需要修复时才介入
                                 group(`拦截到明文响应: ${apiType}`);
                                 mi.videoUrl = full;
                                 mi.preFileName = full;
                                 log(`[URL修复] ✅ (明文) URL 已强制对齐: ${full}`);
                                 groupEnd();
                                 return new Response(JSON.stringify(json), {
                                    status: response.status, statusText: response.statusText, headers: response.headers
                                });
                             }
                        }
                    }

                } catch (err) {
                    error(`[Net] 处理 ${apiType} 响应时发生未知错误:`, err);
                    groupEnd();
                }
            }
            return response;
        };
        log("Fetch 劫持模块已就绪。");
    }

    // =========================
    //  三、UI 清理与 CSS
    // =========================

    const selectorsToHide = [
        '.vue-nice-modal-root', 'div.preview-ui', 'div.skip-preview-btn',
        'div.van-popup', 'div.van-overlay', 'div.mask', 'div.top5',
        'div.justify-center', '.my-12.overflow-hidden', 'div.layout-notice-swiper',
        'div.promotion-expire', 'div.van-tab--shrink:nth-child(2)',
        'div.van-tab--shrink:nth-child(3)', 'div.van-tabbar-item:nth-child(4)',
        'div.item_container:nth-child(1)', 'div.first-comment:nth-child(1)',
        'div.card-item.mb-5[data-v-37849a0b]:has(div.swiper_main .swiper-slide .bannerCover)',
        'div.item_container:nth-child(2)', '.relative.wh-full.floating-cover'
    ];
    GM_addStyle(`${selectorsToHide.join(',\n')} { display: none !important; pointer-events: none !important; }`);
    // log(`UI 清理规则已注入，屏蔽了 ${selectorsToHide.length} 类垃圾元素。`);

    // =========================
    //  四、Token 与 HLS 工具
    // =========================

    const TOKEN_LOCAL_STORAGE_KEY = 'token';
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
    if (!token) warn("未检测到 Token，部分视频可能无法加载。请确认是否已登录。");

    function getHlsGlobal() {
        try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow.Hls) return unsafeWindow.Hls; } catch (e) {}
        if (window.Hls) return window.Hls;
        return null;
    }

    function loadHlsScript(callback) {
        if (getHlsGlobal()) return callback();
        log("正在动态加载 Hls.js ...");
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        script.onload = () => { log("Hls.js 加载成功"); callback(); };
        script.onerror = () => error("Hls.js 加载失败，请检查网络！");
        document.head.appendChild(script);
    }

    // =========================
    //  五、Hook 标准播放器 (防止自动暂停)
    // =========================

    try {
        const mediaPrototype = HTMLMediaElement.prototype;
        if (!mediaPrototype.hasOwnProperty('__isHookedByV52')) {
            const videoBasePattern = /VideoBase-[a-zA-Z0-9_]+/;
            const originalPause = mediaPrototype.pause;
            Object.defineProperty(mediaPrototype, 'pause', {
                value: function() {
                    const stack = new Error().stack || '';
                    if (videoBasePattern.test(stack)) {
                        // log("[Hook] 拦截了来自 VideoBase 的强制暂停");
                        return;
                    }
                    return originalPause.apply(this, arguments);
                }
            });
            // Hook currentTime 略 (同上逻辑)
            const originalCurrentTimeDescriptor = Object.getOwnPropertyDescriptor(mediaPrototype, 'currentTime');
            Object.defineProperty(mediaPrototype, 'currentTime', {
                get: originalCurrentTimeDescriptor.get,
                set: function(newValue) {
                    const stack = new Error().stack || '';
                    if (newValue < 1 && videoBasePattern.test(stack)) return; // 拦截重置进度
                    return originalCurrentTimeDescriptor.set.apply(this, arguments);
                }
            });
            mediaPrototype.__isHookedByV52 = true;
            log("HTMLMediaElement 原型链 Hook 成功");
        }
    } catch (e) {
        error("Hook 播放器失败:", e);
    }

    // =========================
    //  六、社区视频播放器
    // =========================

    let capturedCommunityVideoUrl = null;
    let communityHlsInstance = null;
    const communityVideoBaseUrl = 'https://d1ibyof3mbdf0n.cloudfront.net/api/app/media/h5/m3u8/';

    function createCommunityPlayer(container) {
        if (!capturedCommunityVideoUrl || !token) return;

        loadHlsScript(() => {
            // 隐藏封面
            const originalImageDiv = container.querySelector('div[data-v-bc1963f8]');
            if (originalImageDiv) originalImageDiv.style.display = 'none';

            // 清理旧的
            const oldVideo = container.querySelector('video.__v52_community');
            if (oldVideo) oldVideo.remove();

            // 创建新的
            const videoElement = document.createElement('video');
            videoElement.className = '__v52_community';
            videoElement.controls = true;
            videoElement.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; background: black; z-index: 10;';
            container.appendChild(videoElement);

            const fullUrl = `${communityVideoBaseUrl}${capturedCommunityVideoUrl}?token=${token}`;
            log(`[社区] 挂载播放器 URL: ${fullUrl}`);

            const HlsGlobal = getHlsGlobal();
            if (HlsGlobal && HlsGlobal.isSupported()) {
                if (communityHlsInstance) try { communityHlsInstance.destroy(); } catch(e) {}
                communityHlsInstance = new HlsGlobal();
                communityHlsInstance.loadSource(fullUrl);
                communityHlsInstance.attachMedia(videoElement);
                communityHlsInstance.on(HlsGlobal.Events.ERROR, (e, data) => {
                    if(data.fatal) error("[社区] HLS 播放错误:", data);
                });
            } else {
                videoElement.src = fullUrl;
            }
        });
    }

    function applyCommunityPlayersForAllContainers() {
        if (!capturedCommunityVideoUrl) return;
        const containers = document.querySelectorAll('li.video_img');
        if (containers.length > 0) log(`[社区] 正在为 ${containers.length} 个容器应用播放器`);
        containers.forEach(createCommunityPlayer);
    }

    // =========================
    //  七、直播模块 (增强版)
    // =========================

    let liveHlsInstance = null;

    function cleanupLivePlayer() {
        if (liveHlsInstance) {
            log("[直播] 销毁旧 HLS 实例");
            try { liveHlsInstance.destroy(); } catch(e) {}
            liveHlsInstance = null;
        }
    }

    function createLivePlayer(container) {
        if (container.dataset.geminiHijacked) return;
        container.dataset.geminiHijacked = 'true';
        log("[直播] 检测到新直播容器，开始处理...");

        const params = new URLSearchParams(window.location.search);
        const initialStreamUrl = params.get('stream');
        if (!initialStreamUrl) {
            warn("[直播] URL中未找到 stream 参数");
            delete container.dataset.geminiHijacked;
            return;
        }

        // 尝试提取高画质
        const qualityMatch = initialStreamUrl.match(/_([0-9]+p[0-9]*)/);
        if (qualityMatch) {
            const highestQuality = qualityMatch[1];
            const hasFrameRate = /p[0-9]+$/.test(highestQuality);
            log(`[直播] 识别到最高画质: ${highestQuality}`);
            const masterPlaylistUrl = initialStreamUrl.replace(/_[0-9]+p[0-9]*(\.m3u8.*)?/, '$1');

            fetch(masterPlaylistUrl).then(r => r.text()).then(content => {
                const match = content.match(/^https?:\/\/.+$/m);
                if (match) {
                    const template = match[0].trim();
                    const finalUrl = template.replace(/_[0-9]+p[0-9]*(\.m3u8.*)?$/, `_${highestQuality}$1`);
                    log(`[直播] 动态 CDN 模板匹配成功，最终 URL: ${finalUrl}`);
                    playLiveWithUrl(container, finalUrl, true, highestQuality, hasFrameRate, template);
                } else {
                    warn("[直播] 未匹配到模板，降级使用初始 URL");
                    playLiveWithUrl(container, initialStreamUrl, false, null, false, null);
                }
            }).catch((e) => {
                warn("[直播] Master Playlist 请求失败，降级使用初始 URL", e);
                playLiveWithUrl(container, initialStreamUrl, false, null, false, null);
            });
        } else {
            playLiveWithUrl(container, initialStreamUrl, false, null, false, null);
        }
    }

    function playLiveWithUrl(container, url, isTemplate, quality, hasFPS, template) {
        let attempts = 0;
        const timer = setInterval(() => {
            const originalVideo = container.querySelector('video');
            // 等待原始 video 出现，或者超时 5 秒
            if (originalVideo || attempts > 50) {
                clearInterval(timer);
                if (!originalVideo) {
                    warn("[直播] 超时未找到原始 video 标签，停止挂载");
                    return;
                }

                const newVideo = document.createElement('video');
                newVideo.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; background: black; z-index: 9999;';
                newVideo.controls = true;
                newVideo.autoplay = true;

                originalVideo.parentNode.replaceChild(newVideo, originalVideo);
                log("[直播] 已替换播放器 DOM");

                loadHlsScript(() => {
                    const HlsGlobal = getHlsGlobal();
                    if (HlsGlobal && HlsGlobal.isSupported()) {
                        cleanupLivePlayer();
                        liveHlsInstance = new HlsGlobal({ maxBufferSize: 60, liveSyncDurationCount: 7 });
                        liveHlsInstance.loadSource(url);
                        liveHlsInstance.attachMedia(newVideo);

                        liveHlsInstance.on(HlsGlobal.Events.MANIFEST_LOADED, () => {
                           log(`[直播] HLS Manifest 加载成功`);
                        });

                        liveHlsInstance.on(HlsGlobal.Events.ERROR, (e, data) => {
                            if (data.fatal) {
                                error("[直播] HLS 致命错误:", data);
                                // 智能降级逻辑
                                if (isTemplate && hasFPS && !liveHlsInstance._fallback) {
                                    liveHlsInstance._fallback = true;
                                    const fallbackUrl = template.replace(/_[0-9]+p[0-9]*(\.m3u8.*)?$/, `_720p$1`);
                                    log(`[直播] 尝试降级到 720p: ${fallbackUrl}`);
                                    liveHlsInstance.loadSource(fallbackUrl);
                                    return;
                                }
                                cleanupLivePlayer();
                                // 显示错误遮罩
                                const errDiv = document.createElement('div');
                                errDiv.innerHTML = '直播加载失败<br>(主播已下播或网络错误)';
                                errDiv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);color:white;display:flex;justify-content:center;align-items:center;flex-direction:column;text-align:center;z-index:10000;';
                                if(newVideo.parentNode) newVideo.parentNode.appendChild(errDiv);
                            }
                        });
                        newVideo.play().catch((e)=>{ warn("[直播] 自动播放被阻挡", e); });
                    } else {
                        log("[直播] 浏览器不支持 HLS.js，尝试原生播放");
                        newVideo.src = url;
                    }
                });
            }
            attempts++;
        }, 100);
    }

    // =========================
    //  八、SPA 路由监听 (处理页面跳转)
    // =========================

    function attachLivePlayerIfNeeded() {
        if (!window.location.href.includes('stream')) return;
        const liveSelector = 'div.player[data-v-97942dfa]';
        const container = document.querySelector(liveSelector);
        if (container && !container.dataset.geminiHijacked) createLivePlayer(container);
        else if (!container) setTimeout(attachLivePlayerIfNeeded, 500);
    }

    function handleSpaChange() {
        log(`[路由] URL 变更检测: ${window.location.href}`);
        if (!window.location.href.includes('stream')) cleanupLivePlayer();
        else attachLivePlayerIfNeeded();
    }

    const pushState = history.pushState;
    history.pushState = function() { pushState.apply(this, arguments); handleSpaChange(); };
    const replaceState = history.replaceState;
    history.replaceState = function() { replaceState.apply(this, arguments); handleSpaChange(); };
    window.addEventListener('popstate', handleSpaChange);

    // DOM 观察者
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(n => {
                if (n.nodeType !== 1) return;
                // 匹配直播
                if (n.matches('div.player[data-v-97942dfa]')) createLivePlayer(n);
                n.querySelectorAll('div.player[data-v-97942dfa]').forEach(createLivePlayer);
                // 匹配社区
                if (n.matches('li.video_img')) createCommunityPlayer(n);
                n.querySelectorAll('li.video_img').forEach(createCommunityPlayer);
            });
            m.removedNodes.forEach(n => {
                if (n.nodeType === 1 && (n.matches('div.player[data-v-97942dfa]') || n.querySelector('div.player[data-v-97942dfa]'))) {
                    cleanupLivePlayer();
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    handleSpaChange(); // 初始化检查

})();