// ==UserScript==
// @name         Missav字幕发现助手
// @name:zh-CN   Missav字幕发现助手
// @name:zh-TW   Missav字幕發現助手
// @name:en      MissavSubtitleFinder
// @version      1.6.0
// @license MIT
// @description  自动检测Missav页面m3u8视频并提供跳转。检测到m3u8链接后会自动出现在页面右上角位置，点击播放即可跳转到字幕狗网站。
// @description:zh-CN  自动检测Missav页面m3u8视频并提供跳转。检测到m3u8链接后会自动出现在页面右上角位置，点击播放即可跳转到字幕狗网站。
// @description:zh-TW  自動檢測Missav頁面m3u8視頻並提供跳轉。檢測到m3u8鏈接後會自動出現在頁面右上角位置，點擊播放即可跳轉到字幕狗網站。
// @description:en  Automatically detect the m3u8 video of the page and provide jump. Once detected the m3u8 link, it will appear in the upper right corner of the page. Click play to jump to the subtitle dog website.
// @icon         https://tools.thatwind.com/favicon.png
// @author       lilymark6868-stack
// @namespace    https://tools.thatwind.com/
// @homepage     https://tools.thatwind.com/tool/m3u8downloader
// @match        *://*/*
// @exclude      *://www.diancigaoshou.com/*
// @exclude      http://localhost:3000/*
// @exclude      https://localhost:3000/*
// @exclude      https://player.sub-dog.top/*
// @require      https://cdn.jsdelivr.net/npm/m3u8-parser@4.7.1/dist/m3u8-parser.min.js
// @connect      *
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560936/Missav%E5%AD%97%E5%B9%95%E5%8F%91%E7%8E%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560936/Missav%E5%AD%97%E5%B9%95%E5%8F%91%E7%8E%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const mgmapi = {
 
        addStyle(s) {
            let style = document.createElement("style");
            style.innerHTML = s;
            document.documentElement.appendChild(style);
        },
        async getValue(name, defaultVal) {
            return await ((typeof GM_getValue === "function") ? GM_getValue : GM.getValue)(name, defaultVal);
        },
        async setValue(name, value) {
            return await ((typeof GM_setValue === "function") ? GM_setValue : GM.setValue)(name, value);
        },
        async deleteValue(name) {
            return await ((typeof GM_deleteValue === "function") ? GM_deleteValue : GM.deleteValue)(name);
        },
        openInTab(url, open_in_background = false) {
            return ((typeof GM_openInTab === "function") ? GM_openInTab : GM.openInTab)(url, open_in_background);
        },
        xmlHttpRequest(details) {
            return ((typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : GM.xmlHttpRequest)(details);
        },
        openPlayer(videoUrl, videoType = 'auto', title = '') {
            // 自动判断视频类型
            if (videoType === 'auto') {
                videoType = videoUrl.includes('.m3u8') ? 'hls' : 'mp4';
            }
            
            // 提取视频编号（从当前页面URL）
            const videoId = this.extractVideoId(location.href);
            
            // 跳转到自建播放器
            const playerUrl = `https://player.sub-dog.top/?${new URLSearchParams({
                src: videoUrl,
                type: videoType,
                title: title || '',
                video: videoId || ''
            }).toString()}`;
            
            this.openInTab(playerUrl);
        },
        extractVideoId(url) {
            // 从 missav.live URL 中提取视频编号
            // 支持多种格式：
            // https://missav.live/dm13/mkd-s123 → mkd-s123
            // https://missav.live/dm218/011209-959 → 011209-959  
            // https://missav.live/dm720/110910_964 → 110910_964
            // https://missav.live/dm18/n1388 → n1388
            // https://missav.live/cn/hmn-387-uncensored-leak → hmn-387
            
            // 尝试多种匹配模式
            const patterns = [
                // 匹配 /dmXXX/(可选语言段)/视频ID 格式 (新格式，跳过如 'cn' 等语言段)
                /\/dm\d+\/(?:[a-z]{2}\/)?([a-z0-9_-]+)/i,
                // 匹配 /cn/视频ID-其他内容 格式 (原格式)
                /\/cn\/([a-z0-9]+-[0-9]+)/i,
                // 匹配路径中的视频ID格式 (通用格式)
                /\/([a-z0-9]+-[0-9]+)/i,
                // 匹配纯字母数字组合
                /\/([a-z]+[0-9]+)/i
            ];
            
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) {
                    const id = match[1];
                    // 统一将字母转为大写，其它字符保持不变
                    return id ? id.toUpperCase() : id;
                }
            }
            
            return null;
        },
        download(details) {
 
            return this.openInTab(details.url);
 
            if (typeof GM_download === "function") {
                this.message("下载中，请留意浏览器下载弹窗\nDownloading, pay attention to the browser's download pop-up.", 3000);
                return GM_download(details);
            } else {
                this.openInTab(details.url);
            }
        },
        copyText(text) {
            copyTextToClipboard(text);
            function copyTextToClipboard(text) {
                // 复制文本
                var copyFrom = document.createElement("textarea");
                copyFrom.textContent = text;
                document.body.appendChild(copyFrom);
                copyFrom.select();
                document.execCommand('copy');
                copyFrom.blur();
                document.body.removeChild(copyFrom);
            }
        },
        message(text, disappearTime = 5000) {
            const id = "f8243rd238-gm-message-panel";
            let p = document.querySelector(`#${id}`);
            if (!p) {
                p = document.createElement("div");
                p.id = id;
                p.style = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: end;
                    z-index: 999999999999999;
                `;
                (document.body || document.documentElement).appendChild(p);
            }
            let mdiv = document.createElement("div");
            mdiv.innerText = text;
            mdiv.style = `
                padding: 3px 8px;
                border-radius: 5px;
                background: black;
                box-shadow: #000 1px 2px 5px;
                margin-top: 10px;
                font-size: small;
                color: #fff;
                text-align: right;
            `;
            p.appendChild(mdiv);
            setTimeout(() => {
                p.removeChild(mdiv);
            }, disappearTime);
        }
    };
 
 
        if (location.host === "tools.thatwind.com") {
        mgmapi.addStyle("#userscript-tip{display:none !important;}");

        // 对请求做代理
        const _fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function (...args) {
            try {
                let response = await _fetch(...args);
                if (response.status !== 200) throw new Error(response.status);
                return response;
            } catch (e) {
                // 失败请求使用代理
                if (args.length == 1) {
                    console.log(`请求代理：${args[0]}`);
                    return await new Promise((resolve, reject) => {
                        let referer = new URLSearchParams(location.hash.slice(1)).get("referer");
                        let headers = {};
                        if (referer) {
                            referer = new URL(referer);
                            headers = {
                                "origin": referer.origin,
                                "referer": referer.href
                            };
                        }
                        mgmapi.xmlHttpRequest({
                            method: "GET",
                            url: args[0],
                            responseType: 'arraybuffer',
                            headers,
                            onload(r) {
                                resolve({
                                    status: r.status,
                                    headers: new Headers(r.responseHeaders.split("\n").filter(n => n).map(s => s.split(/:\s*/)).reduce((all, [a, b]) => { all[a] = b; return all; }, {})),
                                    async text() {
                                        return r.responseText;
                                    },
                                    async arrayBuffer() {
                                        return r.response;
                                    }
                                });
                            },
                            onerror() {
                                reject(new Error());
                            }
                        });
                    });
                } else {
                    throw e;
                }
            }
        }
 
        return;
    }
 
 
    // iframe 信息交流
    // 目前只用于获取顶部标题
    window.addEventListener("message", async (e) => {
        if (e.data === "3j4t9uj349-gm-get-title") {
            let name = `top-title-${Date.now()}`;
            await mgmapi.setValue(name, document.title);
            e.source.postMessage(`3j4t9uj349-gm-top-title-name:${name}`, "*");
        }
    });
 
    function getTopTitle() {
        return new Promise(resolve => {
            window.addEventListener("message", async function l(e) {
                if (typeof e.data === "string") {
                    if (e.data.startsWith("3j4t9uj349-gm-top-title-name:")) {
                        let name = e.data.slice("3j4t9uj349-gm-top-title-name:".length);
                        await new Promise(r => setTimeout(r, 5)); // 等5毫秒 确定 setValue 已经写入
                        resolve(await mgmapi.getValue(name));
                        mgmapi.deleteValue(name);
                        window.removeEventListener("message", l);
                    }
                }
            });
            window.top.postMessage("3j4t9uj349-gm-get-title", "*");
        });
    }
 
 
    {
        // 请求检测
        // const _fetch = unsafeWindow.fetch;
        // unsafeWindow.fetch = function (...args) {
        //     if (checkUrl(args[0])) doM3U({ url: args[0] });
        //     return _fetch(...args);
        // }
 
        const _r_text = unsafeWindow.Response.prototype.text;
        unsafeWindow.Response.prototype.text = function () {
            return new Promise((resolve, reject) => {
                _r_text.call(this).then((text) => {
                    resolve(text);
                    if (checkContent(text)) doM3U({ url: this.url, content: text });
                }).catch(reject);
            });
        }
 
        const _open = unsafeWindow.XMLHttpRequest.prototype.open;
        unsafeWindow.XMLHttpRequest.prototype.open = function (...args) {
            this.addEventListener("load", () => {
                try {
                    let content = this.responseText;
                    if (checkContent(content)) doM3U({ url: args[1], content });
                } catch { }
            });
            // checkUrl(args[1]);
            return _open.apply(this, args);
        }
 
 
        function checkUrl(url) {
            url = new URL(url, location.href);
            if (url.pathname.endsWith(".m3u8") || url.pathname.endsWith(".m3u")) {
                // 发现
                return true;
            }
        }
 
        function checkContent(content) {
            if (content.trim().startsWith("#EXTM3U")) {
                return true;
            }
        }
 
 
        // 检查纯视频
        setInterval(doVideos, 1000);
 
    }
 
    // === Anti-redirect for first-play click (missav.live) ===
    const ENABLE_ANTI_REDIRECT = /(^|\.)missav\.live$/.test(location.hostname);
    (function setupAntiRedirect() {
        if (!ENABLE_ANTI_REDIRECT) return;

        let guardTimer = null;
        let guardActive = false;
        const original = {
            open: unsafeWindow.open,
            pushState: unsafeWindow.history.pushState,
            replaceState: unsafeWindow.history.replaceState
        };

        function stopGuard() {
            if (!guardActive) return;
            guardActive = false;
            try { unsafeWindow.open = original.open; } catch (e) {}
            try { unsafeWindow.history.pushState = original.pushState; } catch (e) {}
            try { unsafeWindow.history.replaceState = original.replaceState; } catch (e) {}
        }

        function startGuard() {
            if (guardActive) return;
            guardActive = true;
            try {
                unsafeWindow.open = function() { try { mgmapi.message("已拦截弹窗/跳转", 1500); } catch(_) {} return null; };
            } catch (e) {}
            try {
                unsafeWindow.history.pushState = function(...args) { console.info("[anti-redirect] blocked pushState", args); };
                unsafeWindow.history.replaceState = function(...args) { console.info("[anti-redirect] blocked replaceState", args); };
            } catch (e) {}
            clearTimeout(guardTimer);
            guardTimer = setTimeout(stopGuard, 1200);
        }

        function isPlayerClickTarget(el) {
            const playerSelector = 'video, .video-js, .vjs-big-play-button, .plyr, .plyr__control--overlaid, .jwplayer, .dplayer, .xgplayer, .artplayer, #player, [class*="player"], [id*="player"]';
            return !!(el && el.closest && el.closest(playerSelector));
        }

        function nearestVideo(el) {
            const container = el && el.closest && el.closest('video, .video-js, .plyr, .jwplayer, .dplayer, .xgplayer, .artplayer, #player, [class*="player"], [id*="player"]');
            if (container) {
                if (container.tagName && container.tagName.toLowerCase() === 'video') return container;
                const v = container.querySelector && container.querySelector('video');
                if (v) return v;
            }
            return document.querySelector('video');
        }

        function nearestAnchor(el) {
            return el && el.closest && el.closest('a[href]');
        }

        function onUserClick(e) {
            const target = e.target;
            if (!isPlayerClickTarget(target)) return;
            if (e.altKey || e.metaKey) return; // 允许按住 Alt/Meta 放行

            startGuard();

            // 若为播放器区域内的 <a>，阻止默认跳转，但不阻断传播（让播放器自己的监听仍可收到）
            const a = nearestAnchor(target);
            if (a && isPlayerClickTarget(a)) {
                e.preventDefault();
            }

            // 在同一次用户手势内，直接触发播放
            const v = nearestVideo(target);
            if (v) { try { v.play().catch(()=>{}); } catch(_) {} }

            try { mgmapi.message("已拦截一次可能的广告跳转，尝试直接播放", 1500); } catch (_) {}
        }

        unsafeWindow.addEventListener('click', onUserClick, true);
        unsafeWindow.addEventListener('touchstart', function(e) {
            const target = e.target;
            if (!isPlayerClickTarget(target)) return;
            if (e.altKey || e.metaKey) return;
            startGuard();
        }, true);
    })();
 
    const rootDiv = document.createElement("div");
    rootDiv.style = `
        position: fixed;
        z-index: 9999999999999999;
        opacity: 0.9;
    `;
    rootDiv.style.display = "none";
    document.documentElement.appendChild(rootDiv);
 
    const shadowDOM = rootDiv.attachShadow({ mode: 'open' });
    const wrapper = document.createElement("div");
    shadowDOM.appendChild(wrapper);
 
 
    // 指示器
    const bar = document.createElement("div");
    bar.style = `
        text-align: right;
    `;
    bar.innerHTML = `
        <span
            class="number-indicator"
            data-number="0"
            style="
                display: inline-flex;
                width: 25px;
                height: 25px;
                background: black;
                padding: 10px;
                border-radius: 100px;
                margin-bottom: 5px;
                cursor: pointer;
                border: 3px solid #83838382;
            "
        >
            <svg
            style="
                filter: invert(1);
            "
            version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 585.913 585.913" style="enable-background:new 0 0 585.913 585.913;" xml:space="preserve">
                <g>
                    <path d="M11.173,46.2v492.311l346.22,47.402V535.33c0.776,0.058,1.542,0.109,2.329,0.109h177.39
                    c20.75,0,37.627-16.883,37.627-37.627V86.597c0-20.743-16.877-37.628-37.627-37.628h-177.39c-0.781,0-1.553,0.077-2.329,0.124V0
                    L11.173,46.2z M110.382,345.888l-1.37-38.273c-0.416-11.998-0.822-26.514-0.822-41.023l-0.415,0.01
                    c-2.867,12.767-6.678,26.956-10.187,38.567l-10.961,38.211l-15.567-0.582l-9.239-37.598c-2.801-11.269-5.709-24.905-7.725-37.361
                    l-0.25,0.005c-0.503,12.914-0.879,27.657-1.503,39.552L50.84,343.6l-17.385-0.672l5.252-94.208l25.415-0.996l8.499,32.064
                    c2.724,11.224,5.467,23.364,7.428,34.819h0.389c2.503-11.291,5.535-24.221,8.454-35.168l9.643-33.042l27.436-1.071l5.237,101.377
                    L110.382,345.888z M172.479,349.999c-12.569-0.504-23.013-4.272-28.539-8.142l4.504-17.249c3.939,2.226,13.1,6.445,22.373,6.687
                    c12.009,0.32,18.174-5.497,18.174-13.218c0-10.068-9.838-14.683-19.979-14.74l-9.253-0.052v-16.777l8.801-0.066
                    c7.708-0.208,17.646-3.262,17.646-11.905c0-6.121-4.914-10.562-14.635-10.331c-7.95,0.189-16.245,3.914-20.213,6.446l-4.52-16.693
                    c5.693-4.008,17.224-8.11,29.883-8.588c21.457-0.795,33.643,10.407,33.643,24.625c0,11.029-6.197,19.691-18.738,24.161v0.314
                    c12.229,2.216,22.266,11.663,22.266,25.281C213.89,338.188,197.866,351.001,172.479,349.999z M331.104,302.986
                    c0,36.126-19.55,52.541-51.193,51.286c-29.318-1.166-46.019-17.103-46.019-52.044v-61.104l25.711-1.006v64.201
                    c0,19.191,7.562,29.146,21.179,29.502c14.234,0.368,22.189-8.976,22.189-29.26v-66.125l28.122-1.097v65.647H331.104z
                    M359.723,70.476h177.39c8.893,0,16.125,7.236,16.125,16.126v411.22c0,8.888-7.232,16.127-16.125,16.127h-177.39
                    c-0.792,0-1.563-0.116-2.329-0.232V380.782c17.685,14.961,40.504,24.032,65.434,24.032c56.037,0,101.607-45.576,101.607-101.599
                    c0-56.029-45.581-101.603-101.607-101.603c-24.93,0-47.749,9.069-65.434,24.035V70.728
                    C358.159,70.599,358.926,70.476,359.723,70.476z M390.873,364.519V245.241c0-1.07,0.615-2.071,1.586-2.521
                    c0.981-0.483,2.13-0.365,2.981,0.307l93.393,59.623c0.666,0.556,1.065,1.376,1.065,2.215c0,0.841-0.399,1.67-1.065,2.215
                    l-93.397,59.628c-0.509,0.4-1.114,0.61-1.743,0.61l-1.233-0.289C391.488,366.588,390.873,365.585,390.873,364.519z" />
                </g>
            </svg>
        </span>
    `;
 
    wrapper.appendChild(bar);
 
    // 样式
    const style = document.createElement("style");
 
    style.innerHTML = `
        .number-indicator{
            position:relative;
        }
 
        .number-indicator::after{
            content: attr(data-number);
            position: absolute;
            bottom: 0;
            right: 0;
            color: #40a9ff;
            font-size: 14px;
            font-weight: bold;
            background: #000;
            border-radius: 10px;
            padding: 3px 5px;
        }
 
        .copy-link:active{
            color: #ccc;
        }
 
        .download-btn:hover{
            text-decoration: underline;
        }
        .download-btn:active{
            opacity: 0.9;
        }
 
        .m3u8-item{
            color: white;
            margin-bottom: 5px;
            display: flex;
            flex-direction: row;
            background: black;
            padding: 3px 10px;
            border-radius: 3px;
            font-size: 14px;
            user-select: none;
        }
 
        [data-shown="false"] {
            opacity: 0.8;
            zoom: 0.8;
        }
 
        [data-shown="false"]:hover{
            opacity: 1;
        }
 
        [data-shown="false"] .m3u8-item{
            display: none;
        }
 
    `;
 
    wrapper.appendChild(style);
 
 
 
 
    const barBtn = bar.querySelector(".number-indicator");

    (async function () {

        let shown = await GM_getValue("shown", true);
        wrapper.setAttribute("data-shown", shown);


        let x = await GM_getValue("x", 10);
        let y = await GM_getValue("y", 10);

        x = Math.min(innerWidth - 50, x);
        y = Math.min(innerHeight - 50, y);

        if (x < 0) x = 0;
        if (y < 0) y = 0;

        rootDiv.style.top = `${y}px`;
        rootDiv.style.right = `${x}px`;

        function startDrag(startEvent) {
            if (startEvent.type === 'touchstart' && startEvent.touches && startEvent.touches.length > 0) {
                startEvent.preventDefault();
            }
            const isTouch = startEvent.type === 'touchstart';
            let startX;
            let startY;
            if (isTouch && startEvent.touches && startEvent.touches[0]) {
                startX = startEvent.touches[0].pageX;
                startY = startEvent.touches[0].pageY;
            } else {
                startX = startEvent.pageX;
                startY = startEvent.pageY;
            }

            let moved = false;
            let offsetX = 0;
            let offsetY = 0;

            const move = e => {
                let point;
                if (isTouch && e.touches && e.touches[0]) {
                    point = e.touches[0];
                } else {
                    point = e;
                }
                offsetX = point.pageX - startX;
                offsetY = point.pageY - startY;
                if (moved || (Math.abs(offsetX) + Math.abs(offsetY)) > 5) {
                    moved = true;
                    rootDiv.style.top = `${y + offsetY}px`;
                    rootDiv.style.right = `${x - offsetX}px`;
                }
            };

            const end = () => {
                if (moved) {
                    x -= offsetX;
                    y += offsetY;
                    mgmapi.setValue("x", x);
                    mgmapi.setValue("y", y);
                } else {
                    shown = !shown;
                    mgmapi.setValue("shown", shown);
                    wrapper.setAttribute("data-shown", shown);
                }

                if (isTouch) {
                    removeEventListener("touchmove", move);
                    removeEventListener("touchend", end);
                    removeEventListener("touchcancel", end);
                } else {
                    removeEventListener("mousemove", move);
                    removeEventListener("mouseup", end);
                }
            };

            if (isTouch) {
                addEventListener("touchmove", move);
                addEventListener("touchend", end);
                addEventListener("touchcancel", end);
            } else {
                addEventListener("mousemove", move);
                addEventListener("mouseup", end);
            }
        }

        barBtn.addEventListener("mousedown", startDrag);
        barBtn.addEventListener("touchstart", startDrag);
    })();
 
 
 
 
 
 
    let count = 0;
    let shownUrls = [];

    function maybeAddPlaylistSibling(inputUrl) {
        try {
            const u = (inputUrl instanceof URL) ? inputUrl : new URL(inputUrl, location.href);
            const pathname = u.pathname || "";
            if (/\/video\.m3u8$/i.test(pathname)) {
                const playlistURL = new URL("../playlist.m3u8", u);
                if (!shownUrls.includes(playlistURL.href)) {
                    showVideo({
                        type: "m3u8",
                        url: playlistURL,
                        duration: "多(Multi)",
                        async download() {
                            const title = (await getTopTitle()) || document.title || playlistURL.pathname.split("/").slice(-1)[0];
                            mgmapi.openPlayer(playlistURL.href, 'hls', title);
                        }
                    });
                }
            }
        } catch (_) {}
    }
 
 
    function doVideos() {
        for (let v of Array.from(document.querySelectorAll("video"))) {
            if (v.duration && v.src && v.src.startsWith("http") && (!shownUrls.includes(v.src))) {
                const src = v.src;

                shownUrls.push(src);
                showVideo({
                    type: "video",
                    url: new URL(src),
                    duration: `${Math.ceil(v.duration * 10 / 60) / 10} mins`,
                    download() {
                        // 跳转到自建播放器
                        const title = document.title || new URL(src).pathname.split("/").slice(-1)[0];
                        mgmapi.openPlayer(src, 'mp4', title);
                    }
                })

                // 若是 /video.m3u8，补充构造并展示同父目录的 playlist.m3u8
                maybeAddPlaylistSibling(src);
            }
        }
    }
 
    async function doM3U({ url, content }) {

        url = new URL(url);

        // 先尝试补链 playlist.m3u8（不受已展示 video.m3u8 影响）
        maybeAddPlaylistSibling(url);

        if (shownUrls.includes(url.href)) return;

        // 解析 m3u
        content = content || await (await fetch(url)).text();

        const parser = new m3u8Parser.Parser();
        parser.push(content);
        parser.end();
        const manifest = parser.manifest;

        if (manifest.segments) {
            let duration = 0;
            manifest.segments.forEach((segment) => {
                duration += segment.duration;
            });
            manifest.duration = duration;
        }

        showVideo({
            type: "m3u8",
            url,
            duration: manifest.duration ? `${Math.ceil(manifest.duration * 10 / 60) / 10} mins` : manifest.playlists ? `多(Multi)(${manifest.playlists.length})` : "未知(unknown)",
            async download() {
                // 跳转到自建播放器
                const title = (await getTopTitle()) || document.title || url.pathname.split("/").slice(-1)[0];
                mgmapi.openPlayer(url.href, 'hls', title);
            }
        })

    }
 
 
 
    async function showVideo({
        type,
        url,
        duration,
        download
    }) {
        let div = document.createElement("div");
        div.className = "m3u8-item";
        div.innerHTML = `
            <span>${type}</span>
            <span
                class="copy-link"
                title="${url}"
                style="
                    max-width: 200px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    margin-left: 10px;
                "
            >${url.pathname}</span>
            <span 
                style="
                    margin-left: 10px;
                    flex-grow: 1;
                "
            >${duration}</span>
            <span
                class="download-btn"
                style="
                    margin-left: 10px;
                    cursor: pointer;
            ">播放(Play)</span>
        `;
 
        div.querySelector(".copy-link").addEventListener("click", () => {
            // 复制链接
            mgmapi.copyText(url.href);
            mgmapi.message("已复制链接 (link copied)", 2000);
        });
 
        div.querySelector(".download-btn").addEventListener("click", download);
 
        rootDiv.style.display = "block";
 
        count++;
 
        shownUrls.push(url.href);
 
        bar.querySelector(".number-indicator").setAttribute("data-number", count);
 
        wrapper.appendChild(div);
    }
 
})();
 
(function () {
    'use strict';
 
    const reg = /magnet:\?xt=urn:btih:\w{10,}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
 
    let l = navigator.language || "en";
    if (l.startsWith("en-")) l = "en";
    else if (l.startsWith("zh-")) l = "zh-CN";
    else l = "en";
 
    const T = {
        "en": {
            play: "Play"
        },
        "zh-CN": {
            play: '播放'
        }
    }[l];
 
    whenDOMReady(() => {
        addStyle(`
            button[data-wtmzjk-mag-url]{
                all: initial;
                border: none;
                outline: none;
                background: none;
                background: #f7d308;
                background: #08a6f7;
                margin: 2px 8px;
                border-radius: 3px;
                color: white;
                cursor: pointer;
                display: inline-flex;
                height: 1.6em;
                padding: 0 .8em;
                align-items: center;
                justify-content: center;
                transition: background .15s;
                text-decoration: none;
                border-radius: 0.8em;
                font-size: small;
            }
            button[data-wtmzjk-mag-url]>svg{
                height: 60%;
                fill: white;
                pointer-events: none;
            }
            button[data-wtmzjk-mag-url]:hover{
                background: #fae157;
                background: #39b9f9;
            }
            button[data-wtmzjk-mag-url]:active{
                background: #dfbe07;
                background: #0797df;
            }
            button[data-wtmzjk-mag-url]>span{
                pointer-events: none;
                font-size: small;margin-right: .5em;font-weight:bold;color:white !important;
            }
        `);
        window.addEventListener("click", onEvents, true);
        window.addEventListener("mousedown", onEvents, true);
        window.addEventListener("mouseup", onEvents, true);
 
        watchBodyChange(work);
    });
 
    function onEvents(e) {
        if (e.target.hasAttribute('data-wtmzjk-mag-url')) {
            e.preventDefault();
            e.stopPropagation();
            if (e.type == "click") {
                let a = document.createElement('a');
                a.href = 'https://www.diancigaoshou.com/#' + new URLSearchParams({ url: e.target.getAttribute('data-wtmzjk-mag-url') });
                a.target = "_blank";
                a.click();
            }
        }
    }
 
 
 
    function createWatchButton(url, isForPlain = false) {
        let button = document.createElement("button");
        button.setAttribute('data-wtmzjk-mag-url', url);
        if (isForPlain) button.setAttribute('data-wtmzjk-button-for-plain', '');
        button.innerHTML = `<span>${T.play}</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
        return button;
    }
 
    function hasPlainMagUrlThatNotHandled() {
        let m = document.body.textContent.match(new RegExp(reg, 'g'));
        return document.querySelectorAll(`[data-wtmzjk-button-for-plain]`).length != (m ? m.length : 0);
    }
 
    function work() {
        if (!document.body) return;
        if (hasPlainMagUrlThatNotHandled()) {
            for (let node of getAllTextNodes(document.body)) {
                if (node.nextSibling && node.nextSibling.hasAttribute && node.nextSibling.hasAttribute('data-wtmzjk-mag-url')) continue;
                let text = node.nodeValue;
                if (!reg.test(text)) continue;
                let match = text.match(reg);
                if (match) {
                    let url = match[0];
                    let p = node.parentNode;
                    p.insertBefore(document.createTextNode(text.slice(0, match.index + url.length)), node);
                    p.insertBefore(createWatchButton(url, true), node);
                    p.insertBefore(document.createTextNode(text.slice(match.index + url.length)), node);
                    p.removeChild(node);
                }
            }
        }
        for (let a of Array.from(document.querySelectorAll(
            ['href', 'value', 'data-clipboard-text', 'data-value', 'title', 'alt', 'data-url', 'data-magnet', 'data-copy'].map(n => `[${n}*="magnet:?xt=urn:btih:"]`).join(',')
        ))) {
            if (a.nextSibling && a.nextSibling.hasAttribute && a.nextSibling.hasAttribute('data-wtmzjk-mag-url')) continue; // 已经添加
            if (reg.test(a.textContent)) continue;
            for (let attr of a.getAttributeNames()) {
                let val = a.getAttribute(attr);
                if (!reg.test(val)) continue;
                let url = val.match(reg)[0];
                a.parentNode.insertBefore(createWatchButton(url), a.nextSibling);
            }
        }
    }
 
 
    function watchBodyChange(onchange) {
        let timeout;
        let observer = new MutationObserver(() => {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    onchange();
                }, 200);
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
 
    }
 
    function getAllTextNodes(parent) {
        var re = [];
        if (["STYLE", "SCRIPT", "BASE", "COMMAND", "LINK", "META", "TITLE", "XTRANS-TXT", "XTRANS-TXT-GROUP", "XTRANS-POPUP"].includes(parent.tagName)) return re;
        for (let node of parent.childNodes) {
            if (node.childNodes.length) re = re.concat(getAllTextNodes(node));
            else if (Text.prototype.isPrototypeOf(node) && (!node.nodeValue.match(/^\s*$/))) re.push(node);
        }
        return re;
    }
 
    function whenDOMReady(f) {
        if (document.body) f();
        else window.addEventListener("DOMContentLoaded", f);
    }
 
    function addStyle(s) {
        let style = document.createElement("style");
        style.innerHTML = s;
        document.documentElement.appendChild(style);
    }
 
})();// ==/UserScript==
