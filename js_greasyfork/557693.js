// ==UserScript==
// @name         呜呜标签
// @namespace    https://github.com/guhuo-km/
// @version      0.3.2
// @description  鸣潮地图增强：自动标记、社区标签、点赞系统。（数据来源于 api.wuwuddt.site）
// @author       guhuo-km
// @match        https://www.kurobbs.com/mc/map/*
// @match        https://www.kurobbs.com/mc/map/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      api.wuwuddt.site
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557693/%E5%91%9C%E5%91%9C%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/557693/%E5%91%9C%E5%91%9C%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const globalScope = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const CONFIG = {
        SCALE_FACTOR: 100,
        MAP_SCALE: 0.83,
        MAP_OFFSET_X: 1024,
        API_BASE: 'https://api.wuwuddt.site'
    };

    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                data: options.body,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        resolve({
                            json: () => {
                                try { return Promise.resolve(JSON.parse(res.responseText)); }
                                catch (e) { return Promise.resolve([]); }
                            }
                        });
                    } else {
                        console.error("API Error:", res.status, res.responseText);
                        resolve({ json: () => Promise.resolve([]) });
                    }
                },
                onerror: (err) => {
                    console.error("Network Error:", err);
                    resolve({ json: () => Promise.resolve([]) });
                }
            });
        });
    }

    function getUserId() {
        let uid = localStorage.getItem('KMP_USER_ID');
        if (!uid) {
            uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('KMP_USER_ID', uid);
        }
        return uid;
    }

    function generateGlobalFP(rawX, rawY, rawLevel) {
        let x = Number(rawX);
        let y = Number(rawY);
        const level = rawLevel || "0";
        if (Math.abs(x) < 50000) x = x * 100;
        if (Math.abs(y) < 50000) y = y * 100;
        return `${Math.round(x)}_${Math.round(y)}_${level}`;
    }

    globalScope.__SHADOWMAP__ = {
        mapInstance: null,
        cache: new Map(),
        currentDetail: null,
        highlightLayer: null,
        utils: { generateGlobalFP }
    };

    const LOG_PREFIX = '%c[ShadowMap]';
    const LOG_STYLE = 'background: #222; color: #00bcd4; font-weight: bold; padding: 2px 4px; border-radius: 3px;';

    GM_addStyle(`
        #kmp-sidecar {
            position: absolute !important;
            top: 0 !important;
            left: 100% !important;
            margin-left: 10px !important;
            width: 240px !important;
            background: rgba(20, 20, 20, 0.95) !important;
            border: 1px solid #666 !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.8) !important;
            color: #ececec !important;
            font-family: sans-serif !important;
            font-size: 13px !important;
            z-index: 99999 !important;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            backdrop-filter: blur(5px);
            pointer-events: auto !important;
            min-height: 150px;
            /* 关键：添加透明度过渡，关闭时直接变透明 */
            transition: opacity 0.1s ease-out;
            opacity: 1;
        }

        .leaflet-popup, .leaflet-popup-content-wrapper, .leaflet-popup-content {
            overflow: visible !important;
        }

        .kmp-header { padding: 12px; background: #2a2a2a; border-bottom: 1px solid #444; font-weight: bold; color: #dcb268; display: flex; justify-content: space-between; align-items: center; }
        .kmp-body { padding: 12px; flex: 1; }
        .kmp-row { margin-bottom: 8px; line-height: 1.5; border-bottom: 1px dashed #333; padding-bottom: 4px; }
        .kmp-label { color: #999; font-size: 12px; display: block; margin-bottom: 2px;}
        .kmp-value { color: #fff; word-break: break-all; font-weight: 500;}
        .kmp-btn { width: 100%; padding: 8px; margin-top: 10px; background: linear-gradient(to right, #dcb268, #c09440); border: none; border-radius: 4px; color: #000; font-weight: bold; cursor: pointer; }
        .kmp-btn:hover { opacity: 0.9; }

        /* 新增样式 */
        .kmp-tag {
            background: rgba(220, 178, 104, 0.2);
            border: 1px solid #dcb268;
            color: #dcb268;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
        }

        .kmp-vote-btn {
            flex: 1; padding: 6px;
            background: #333; color: #aaa;
            border: 1px solid #444; border-radius: 4px;
            cursor: pointer; display: flex; justify-content: center; gap: 5px;
            transition: all 0.2s;
        }
        .kmp-vote-btn:hover { background: #444; color: #fff; }
        .kmp-vote-btn.active {
            background: rgba(76, 175, 80, 0.2);
            border-color: #4caf50;
            color: #4caf50;
        }
        /* 踩的激活样式 */
        #btn-vote-down.active {
            background: rgba(244, 67, 54, 0.2);
            border-color: #f44336;
            color: #f44336;
        }

        /* --- 搜索栏：悬浮球样式 --- */
        #kmp-search-wrapper {
            position: fixed; top: 100px; left: 20px; z-index: 99998;
            font-family: sans-serif;
            pointer-events: none; /* 容器穿透 */
        }

        /* 小脑袋图标 */
        #kmp-search-toggle {
            width: 40px; height: 40px;
            background: rgba(20, 20, 20, 0.95);
            border: 1px solid #dcb268;
            border-radius: 50%;
            color: #dcb268;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: all 0.3s;
        }
        #kmp-search-toggle:hover { transform: scale(1.1); background: #000; }

        /* 展开的面板 */
        #kmp-search-panel {
            position: absolute; top: 0; left: 50px; /* 在球的右边 */
            width: 280px;
            background: rgba(20, 20, 20, 0.95);
            border: 1px solid #444; border-left: 3px solid #dcb268;
            border-radius: 4px;
            padding: 10px;
            pointer-events: auto;

            /* 动画状态 */
            opacity: 0; transform: translateX(-20px); visibility: hidden;
            transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        /* 激活状态 */
        #kmp-search-wrapper.active #kmp-search-panel {
            opacity: 1; transform: translateX(0); visibility: visible;
        }
        #kmp-search-wrapper.active #kmp-search-toggle {
            background: #dcb268; color: #000; transform: rotate(90deg);
        }

        /* 热门标签 Chips (通用) */
        .kmp-hot-chips {
            display: flex; gap: 6px; overflow-x: auto; padding: 4px 0;
            scrollbar-width: none; /* Firefox */
        }
        .kmp-hot-chips::-webkit-scrollbar { display: none; } /* Chrome */

        .kmp-chip {
            background: rgba(255,255,255,0.1); color: #ccc;
            padding: 4px 8px; border-radius: 12px; font-size: 11px;
            white-space: nowrap; cursor: pointer; border: 1px solid transparent;
            transition: all 0.2s;
        }
        .kmp-chip:hover { border-color: #dcb268; color: #dcb268; background: rgba(220, 178, 104, 0.1); }

        /* 热门标签轮播容器 */
        .kmp-hot-carousel {
            display: flex; align-items: center; gap: 4px;
            width: 100%; position: relative;
        }

        /* 滚动区域 */
        .kmp-hot-scroll-area {
            display: flex; gap: 6px;
            overflow-x: auto;
            scroll-behavior: smooth; /* 平滑滚动 */
            scrollbar-width: none; /* Firefox 隐藏滚动条 */
            flex: 1; /* 占满剩余空间 */
            padding: 4px 2px;
            mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent); /* 两端渐变遮罩效果 */
            -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
        }
        .kmp-hot-scroll-area::-webkit-scrollbar { display: none; }

        /* 左右翻页按钮 */
        .kmp-carousel-btn {
            background: rgba(50,50,50,0.8); border: 1px solid #555; color: #dcb268;
            width: 20px; height: 20px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 10px; flex-shrink: 0;
            z-index: 2; user-select: none;
        }
        .kmp-carousel-btn:hover { background: #dcb268; color: #000; }
        .kmp-carousel-btn:disabled { opacity: 0.3; cursor: default; border-color: #333; color: #555; background: transparent; }

        /* 弹窗底部的全域横幅 */
        #kmp-bottom-bar {
            position: absolute;
            bottom: -50px; left: -20px; /* 稍微往左一点 */
            width: 160%; /* 足够宽，覆盖官方和Sidecar */
            height: 40px;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(4px);
            border-radius: 20px;
            display: flex; align-items: center; padding: 0 15px;
            z-index: 99990;
            border: 1px solid #444;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);

            opacity: 0; animation: slideUp 0.3s forwards 0.2s; /* 延迟出现 */
        }
        @keyframes slideUp { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }

        #kmp-search-results {
            margin-top: 5px;
            background: rgba(20, 20, 20, 0.95);
            border-radius: 4px;
            max-height: 300px;
            overflow-y: auto;
            pointer-events: auto;
            display: none; /* 默认隐藏 */
            border: 1px solid #444;
        }

        .kmp-result-item {
            padding: 8px 10px;
            border-bottom: 1px solid #333;
            cursor: pointer;
            display: flex; justify-content: space-between; align-items: center;
        }
        .kmp-result-item:hover { background: rgba(220, 178, 104, 0.15); }
        .kmp-result-match { color: #dcb268; font-weight: bold; font-size: 11px; margin-left: 5px; }

        /* 列表行样式 */
        .kmp-tag-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 6px 4px;
            border-bottom: 1px dashed #333;
            animation: fadeIn 0.2s;
        }
        .kmp-tag-row:last-child { border-bottom: none; }

        .kmp-tag-text { font-size: 13px; color: #dcb268; font-weight: 500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width: 100px; }

        .kmp-tag-acts { display: flex; align-items: center; gap: 4px; }

        /* 迷你投票按钮 */
        .kmp-icon-btn {
            background: transparent; border: 1px solid #444; color: #666;
            width: 24px; height: 24px; border-radius: 4px;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 10px; padding: 0;
            transition: all 0.1s;
        }
        .kmp-icon-btn:hover { border-color: #888; color: #aaa; }
        .kmp-icon-btn.active[data-act="up"] { border-color: #4caf50; background: rgba(76,175,80,0.1); color: #4caf50; }
        .kmp-icon-btn.active[data-act="down"] { border-color: #f44336; background: rgba(244,67,54,0.1); color: #f44336; }

        /* 全宽按钮 */
        .kmp-btn-full {
            width: 100%; padding: 8px; background: #333; border: 1px solid #444; color: #ccc;
            border-radius: 4px; cursor: pointer; font-size: 12px;
        }
        .kmp-btn-full:hover { background: #444; color: #fff; }

        /* 翻页按钮 */
        .kmp-page-btn {
            background: #222; border: 1px solid #444; color: #aaa;
            width: 24px; height: 24px; border-radius: 4px; cursor: pointer;
        }
        .kmp-page-btn:disabled { opacity: 0.3; cursor: default; }

        .kmp-input {
            width: 100%; background: #111; border: 1px solid #dcb268; color: #fff;
            padding: 6px; border-radius: 4px; font-size: 12px;
        }

        .kmp-mini-btn {
            background: #333; border: 1px solid #555; color: #ccc;
            padding: 2px 8px; border-radius: 10px; font-size: 10px; cursor: pointer;
        }
        .kmp-mini-btn:hover { background: #dcb268; color: #000; border-color: #dcb268; }

        .kmp-loading-spinner {
            display: inline-block; animation: spin 1s linear infinite; margin-right: 5px; font-weight: bold;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `);

    console.log(`${LOG_PREFIX} 呜呜标签启动`, LOG_STYLE);

    function getFingerprint(data) {
        const rawX = (data.xposition !== undefined) ? data.xposition : data.x;
        const rawY = (data.yposition !== undefined) ? data.yposition : data.y;

        if (rawX === undefined || rawY === undefined) return null;

        return generateGlobalFP(rawX, rawY, data.mapLevel || data.level);
    }

    const PAGE_STATE = new Map();

    const UGC_SERVICE = {
        async get(fp) {
            const uid = getUserId();
            const url = `${CONFIG.API_BASE}/tag_details?fingerprint=eq.${fp}`;
            const res = await gmFetch(url);
            const rows = await res.json();

            const tagMap = {};
            if (Array.isArray(rows)) {
                rows.forEach(row => {
                    if (!tagMap[row.text]) {
                        tagMap[row.text] = { text: row.text, score: row.score, myVote: 0 };
                    }
                    if (row.voter_id === uid) tagMap[row.text].myVote = row.my_vote;
                });
            }
            const tags = Object.values(tagMap).sort((a, b) => b.score - a.score);
            return { tags };
        },

        async addTag(fp, tagText) {
            await gmFetch(`${CONFIG.API_BASE}/rpc/add_tag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ p_fp: fp, p_text: tagText })
            });
            return this.get(fp);
        },

        async voteTag(fp, tagText, val) {
            const uid = getUserId();
            await gmFetch(`${CONFIG.API_BASE}/rpc/vote_tag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ p_fp: fp, p_text: tagText, p_user_id: uid, p_val: val })
            });
            return this.get(fp);
        },

        async getHotTags() {
            const res = await gmFetch(`${CONFIG.API_BASE}/rpc/get_hot_tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{}'
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                return data.map(item => item.text);
            }
            return [];
        }
    };

    async function renderHotTagsCarousel(container, clickCallback) {
        container.innerHTML = '<span style="color:#666;font-size:10px;padding:4px">加载热门...</span>';

        const tags = await UGC_SERVICE.getHotTags();

        if (!tags || tags.length === 0) {
            container.innerHTML = '<span style="color:#666;font-size:10px;padding:4px">暂无热门数据</span>';
            return;
        }

        const chipsHtml = tags.map(t => `<div class="kmp-chip">${t}</div>`).join('');

        container.innerHTML = `
            <div class="kmp-hot-carousel">
                <button class="kmp-carousel-btn prev">&lt;</button>
                <div class="kmp-hot-scroll-area">${chipsHtml}</div>
                <button class="kmp-carousel-btn next">&gt;</button>
            </div>
        `;

        const scrollArea = container.querySelector('.kmp-hot-scroll-area');
        const btnPrev = container.querySelector('.prev');
        const btnNext = container.querySelector('.next');

        container.querySelectorAll('.kmp-chip').forEach(chip => {
            chip.onclick = (e) => clickCallback(e, chip.innerText);
        });

        const scrollAmount = () => scrollArea.clientWidth * 0.8;
        btnPrev.onclick = (e) => { e.stopPropagation(); scrollArea.scrollLeft -= scrollAmount(); };
        btnNext.onclick = (e) => { e.stopPropagation(); scrollArea.scrollLeft += scrollAmount(); };
    }

    function hookLeaflet() {
        if (globalScope.__SHADOWMAP_HOOKED) return;
        globalScope.__SHADOWMAP_HOOKED = true;

        const timer = setInterval(() => {
            if (typeof globalScope.L !== 'undefined' && globalScope.L.Map) {
                const L = globalScope.L;

                if (!L.Map.prototype.initialize._patched) {
                    const originalInit = L.Map.prototype.initialize;
                    L.Map.prototype.initialize = function(...args) {
                        globalScope.__SHADOWMAP__.mapInstance = this;
                        this.on('popupopen', handlePopupOpen);
                        this.on('popupclose', handlePopupClose);
                        return originalInit.apply(this, args);
                    };
                    L.Map.prototype.initialize._patched = true;
                }
                clearInterval(timer);
            }
        }, 200);
    }

    function hookNetwork() {
        const originalFetch = globalScope.fetch;
        globalScope.fetch = function(input, init) {
            const url = (typeof input === 'string' ? input : input.url) || '';

            if (url.includes('/position.json') || url.includes('/getDetail')) {
                return originalFetch.apply(this, arguments).then(response => {
                    if (!response.ok) return response;
                    const cType = response.headers.get('content-type');
                    if (cType && cType.includes('application/json')) {
                        response.clone().json().then(data => {
                            if (url.includes('/position.json')) {
                                processBulkData(data);
                            } else if (url.includes('/getDetail')) {
                                processDetailData(data);
                            }
                        }).catch(e => {});
                    }
                    return response;
                });
            }
            return originalFetch.apply(this, arguments);
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                if (this.status === 200 && (url.includes('/getDetail') || url.includes('/position.json'))) {
                    try {
                        const data = JSON.parse(this.responseText);
                        if (url.includes('/position.json')) {
                            processBulkData(data);
                        } else if (url.includes('/getDetail')) {
                            console.log(`${LOG_PREFIX} 通过 XHR 捕获到详情`, LOG_STYLE);
                            processDetailData(data);
                        }
                    } catch (e) {}
                }
            });
            return originalOpen.apply(this, arguments);
        };
    }

    function processDetailData(res) {
        const data = res.data || res;
        globalScope.__SHADOWMAP__.currentDetail = data;
        const sidecar = document.getElementById('kmp-sidecar');
        if (sidecar) renderSidecar(sidecar, data);
    }

    function processBulkData(data) {
        const traverse = (node, parentName = '') => {
            if (!node) return;
            if (Array.isArray(node)) { node.forEach(item => traverse(item, parentName)); return; }
            if (typeof node === 'object') {
                if (node.location) {
                    const categoryName = node.name || parentName;
                    node.location.forEach(p => savePoint(p, categoryName));
                    return;
                }
                if (node.children) { traverse(node.children, node.name || parentName); return; }
                if (node.x !== undefined) { savePoint(node, parentName); }
            }
        };

        const savePoint = (p, categoryName) => {
            const finalName = p.name || categoryName || '未知点位';
            const fp = generateGlobalFP(p.x, p.y, p.mapLevel || p.level);

            if (!globalScope.__SHADOWMAP__.cache.has(fp)) {
                globalScope.__SHADOWMAP__.cache.set(fp, {
                    fp: fp,
                    name: finalName,
                    x: p.x,
                    y: p.y,
                    level: p.mapLevel || p.level || "0"
                });
            }
        };

        traverse(data);
        console.log(`${LOG_PREFIX} 索引更新: ${globalScope.__SHADOWMAP__.cache.size} 个点位`, LOG_STYLE);
    }

    function handlePopupOpen(e) {
        const popup = e.popup;
        const container = popup.getElement();

        if (!container) return;

        if (globalScope.__SHADOWMAP__.observer) {
            globalScope.__SHADOWMAP__.observer.disconnect();
            globalScope.__SHADOWMAP__.observer = null;
        }

        injectSidecar(container);

        const observer = new MutationObserver((mutations) => {
            const officialContent = container.querySelector('.mc-popup-inner');
            const mySidecar = container.querySelector('#kmp-sidecar');

            if (!officialContent) {
                if (mySidecar) mySidecar.remove();
                return;
            }

            if (!mySidecar) {
                console.log(`${LOG_PREFIX} Sidecar 意外丢失，补救注入`, LOG_STYLE);
                injectSidecar(container);
            }
        });

        observer.observe(container, { childList: true, subtree: true });
        globalScope.__SHADOWMAP__.observer = observer;
    }

    // 修复：增加类型过滤，防止鼠标划过导致的误关闭
    function handlePopupClose(e) {
        const popup = e.popup;
        const el = popup.getElement(); // 获取弹窗的 DOM 元素

        // 【关键修复】
        // 如果关闭的弹窗包含 "popup-point-type-name" 类名，说明它只是个鼠标悬浮提示
        // 这种情况下，绝对不能销毁我们的 Sidecar！
        if (el && el.classList.contains('popup-point-type-name')) {
            return;
        }

        console.log(`${LOG_PREFIX} 主弹窗关闭`, LOG_STYLE);

        // 1. 停止 Observer
        if (globalScope.__SHADOWMAP__.observer) {
            globalScope.__SHADOWMAP__.observer.disconnect();
            globalScope.__SHADOWMAP__.observer = null;
        }

        // 2. 销毁 Sidecar
        const sidecar = document.getElementById('kmp-sidecar');
        if (sidecar) {
            sidecar.style.opacity = '0';
            sidecar.remove();
        }

        // 3. 销毁底部栏
        const bar = document.getElementById('kmp-bottom-bar');
        if (bar) bar.remove();
    }

    function injectSidecar(container) {
        if (container.querySelector('#kmp-sidecar')) return;
        if (!container.querySelector('.mc-popup-inner')) return;

        const sidecar = document.createElement('div');
        sidecar.id = 'kmp-sidecar';
        sidecar.innerHTML = `<div class="kmp-header">呜呜标签</div><div class="kmp-body" style="color:#888;text-align:center;padding-top:40px;">Wait...</div>`;
        container.appendChild(sidecar);

        if (!container.querySelector('#kmp-bottom-bar')) {
            const bar = document.createElement('div');
            bar.id = 'kmp-bottom-bar';

            bar.innerHTML = `
                <div style="font-size:10px;color:#dcb268;margin-right:8px;white-space:nowrap;font-weight:bold">🔥 热门:</div>
                <div id="kmp-bottom-hot-container" style="flex:1; overflow:hidden;"></div>
            `;
            container.appendChild(bar);

            const hotContainer = bar.querySelector('#kmp-bottom-hot-container');

            renderHotTagsCarousel(hotContainer, (e, text) => {
                e.stopPropagation();
                const btnAdd = sidecar.querySelector('#btn-add-mode');
                if(btnAdd) btnAdd.click();
                setTimeout(() => {
                    const input = sidecar.querySelector('input.kmp-input');
                    if(input) { input.value = text; input.focus(); }
                }, 50);
            });

            bar.addEventListener('click', e => e.stopPropagation());
            ['mousedown', 'touchstart', 'wheel'].forEach(evt => bar.addEventListener(evt, e => e.stopPropagation()));
        }

        if (globalScope.__SHADOWMAP__.currentDetail) {
            renderSidecar(sidecar, globalScope.__SHADOWMAP__.currentDetail);
        }

        ['click', 'mousedown', 'wheel', 'touchstart'].forEach(evt => {
            sidecar.addEventListener(evt, e => e.stopPropagation());
        });
    }

    async function renderSidecar(dom, data) {
        if (!dom || !data) return;

        const fp = getFingerprint(data);
        if (!fp) { dom.innerHTML = `<div class="kmp-body">坐标数据异常</div>`; return; }

        const officialContent = dom.parentElement.querySelector('.mc-popup-inner');
        if (officialContent) {
            const h = officialContent.getBoundingClientRect().height;
            if (h > 150) dom.style.height = `${h}px`;
        }

        dom.innerHTML = `
            <div class="kmp-header">
                <span>${data.name || '未知'}</span>
                <span style="font-size:10px;background:#2196f3;padding:2px 4px;border-radius:2px;color:#fff">Cloud</span>
            </div>
            <div class="kmp-body" style="display:flex;flex-direction:column;height:100%;">
                <div style="flex:1;display:flex;align-items:center;justify-content:center;color:#666">
                    <span class="kmp-loading-spinner">↻</span> 加载社区数据...
                </div>
            </div>
        `;

        const ugcData = await UGC_SERVICE.get(fp);

        const ITEMS_PER_PAGE = 10;
        let currentPage = PAGE_STATE.get(fp) || 0;
        const totalPages = Math.ceil(ugcData.tags.length / ITEMS_PER_PAGE) || 1;
        if (currentPage >= totalPages) currentPage = totalPages - 1;
        if (currentPage < 0) currentPage = 0;

        const visibleTags = ugcData.tags.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

        let listHtml = '';
        if (visibleTags.length === 0) {
            listHtml = `<div style="text-align:center;color:#666;padding:20px;font-size:12px;display:flex;flex-direction:column;justify-content:center;height:100%"><span>暂无标签</span><span style="font-size:10px">快来抢沙发</span></div>`;
        } else {
            listHtml = visibleTags.map(tag => {
                const upClass = tag.myVote === 1 ? 'active' : '';
                const downClass = tag.myVote === -1 ? 'active' : '';
                const scoreColor = tag.score > 0 ? '#4caf50' : (tag.score < 0 ? '#f44336' : '#888');
                return `
                <div class="kmp-tag-row">
                    <span class="kmp-tag-text" title="${tag.text}">${tag.text}</span>
                    <div class="kmp-tag-acts">
                        <button class="kmp-icon-btn ${downClass}" data-act="down" data-tag="${tag.text}">👎</button>
                        <span style="color:${scoreColor};width:20px;text-align:center;font-size:11px">${tag.score}</span>
                        <button class="kmp-icon-btn ${upClass}" data-act="up" data-tag="${tag.text}">👍</button>
                    </div>
                </div>`;
            }).join('');
        }

        dom.querySelector('.kmp-body').innerHTML = `
            <div style="flex:1; overflow-y:auto; padding-bottom:5px;">${listHtml}</div>
            <div style="border-top:1px solid #333; padding-top:8px; margin-top:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; ${totalPages<=1 ? 'display:none!important':''}">
                    <button class="kmp-page-btn" id="btn-prev" ${currentPage===0?'disabled':''}>&lt;</button>
                    <span style="font-size:10px;color:#666">${currentPage+1} / ${totalPages}</span>
                    <button class="kmp-page-btn" id="btn-next" ${currentPage>=totalPages-1?'disabled':''}>&gt;</button>
                </div>
                <div id="kmp-input-area">
                    <button id="btn-add-mode" class="kmp-btn-full">✍️ 添加新标签</button>
                </div>
            </div>
        `;

        const btnPrev = dom.querySelector('#btn-prev');
        const btnNext = dom.querySelector('#btn-next');
        if(btnPrev) btnPrev.onclick = (e) => { e.stopPropagation(); PAGE_STATE.set(fp, currentPage - 1); renderSidecar(dom, data); };
        if(btnNext) btnNext.onclick = (e) => { e.stopPropagation(); PAGE_STATE.set(fp, currentPage + 1); renderSidecar(dom, data); };

        dom.querySelectorAll('.kmp-icon-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                await UGC_SERVICE.voteTag(fp, btn.dataset.tag, btn.dataset.act === 'up' ? 1 : -1);
                renderSidecar(dom, data);
            };
        });

        const btnAdd = dom.querySelector('#btn-add-mode');
        const inputArea = dom.querySelector('#kmp-input-area');
        if(btnAdd) {
            btnAdd.onclick = (e) => {
                e.stopPropagation();
                inputArea.innerHTML = `<input type="text" class="kmp-input" placeholder="输入标签名..." autoFocus>`;
                const input = inputArea.querySelector('input');
                input.focus();
                const submit = async () => {
                    const val = input.value.trim();
                    if(val) {
                        input.disabled = true;
                        input.value = "提交中...";
                        await UGC_SERVICE.addTag(fp, val);
                        renderSidecar(dom, data);
                    } else {
                        renderSidecar(dom, data);
                    }
                };
                input.onkeydown = (ev) => { if(ev.key === 'Enter') { ev.stopPropagation(); submit(); } };
                input.onclick = (ev) => ev.stopPropagation();
            };
        }
    }

    function setupSearchSystem() {
        const wrapper = document.createElement('div');
        wrapper.id = 'kmp-search-wrapper';
        wrapper.innerHTML = `
            <div id="kmp-search-toggle">🔍</div>
            <div id="kmp-search-panel">
                <div style="position:relative; display:flex; gap:5px">
                    <input id="kmp-search-input" type="text" placeholder="输入关键字..." autocomplete="off" style="flex:1; padding:8px; background:#111; border:1px solid #444; color:#fff; border-radius:4px;">
                </div>

                <div style="margin-top:8px;">
                    <div style="font-size:10px; color:#666; margin-bottom:4px;">🔥 热门标签 (点击搜索)</div>
                    <div id="kmp-search-hot-tags" class="kmp-hot-chips"></div>
                </div>

                <div id="kmp-search-results" style="margin-top:10px; max-height:300px; overflow-y:auto; display:none; border-top:1px solid #333; padding-top:5px;"></div>
            </div>
        `;
        document.body.appendChild(wrapper);

        const toggle = wrapper.querySelector('#kmp-search-toggle');
        const panel = wrapper.querySelector('#kmp-search-panel');
        const input = wrapper.querySelector('#kmp-search-input');
        const list = wrapper.querySelector('#kmp-search-results');
        const hotTagsContainer = wrapper.querySelector('#kmp-search-hot-tags');

        toggle.onclick = (e) => {
            e.stopPropagation();
            wrapper.classList.toggle('active');
            if(wrapper.classList.contains('active')) {
                input.focus();
                refreshHotTags();
            }
        };

        const refreshHotTags = async () => {
            const tags = await UGC_SERVICE.getHotTags();
            renderHotTagsCarousel(hotTagsContainer, (e, text) => {
                input.value = text;
                performSearch(text);
            });
        };

        const performSearch = async (rawQuery) => {
            if (!rawQuery || rawQuery.length < 1) { list.style.display = 'none'; return; }
            const query = rawQuery.toLowerCase().trim();

            list.style.display = 'block';
            list.innerHTML = `<div style="padding:10px;color:#666;text-align:center">正在云端搜索...</div>`;

            const allPoints = Array.from(globalScope.__SHADOWMAP__.cache.values());
            const nameMatches = allPoints.filter(p => p.name && p.name.toLowerCase().includes(query));

            let tagGroups = {};
            try {
                const res = await gmFetch(`${CONFIG.API_BASE}/tags?text=ilike.*${query}*&select=fingerprint,text`);
                const remoteTags = await res.json();

                if (Array.isArray(remoteTags)) {
                    remoteTags.forEach(t => {
                        const p = globalScope.__SHADOWMAP__.cache.get(t.fingerprint);
                        if (p) {
                            if (!tagGroups[t.text]) tagGroups[t.text] = [];
                            if (!tagGroups[t.text].includes(p)) tagGroups[t.text].push(p);
                        }
                    });
                }
            } catch (e) {
                console.warn("Search API fail", e);
            }

            renderResults(tagGroups, nameMatches);
        };

        const renderResults = (tagGroups, nameMatches) => {
            let html = '';

            Object.keys(tagGroups).forEach(tagName => {
                const points = tagGroups[tagName];
                html += `
                    <div class="kmp-result-item group" data-tag="${tagName}">
                        <div>
                            <span style="color:#dcb268;font-weight:bold">🏷️ ${tagName}</span>
                            <span style="color:#888;font-size:10px;margin-left:5px">(${points.length})</span>
                        </div>
                        <button class="kmp-mini-btn">👁️</button>
                    </div>
                `;
            });

            nameMatches.slice(0, 10).forEach(p => {
                html += `
                    <div class="kmp-result-item single" data-fp="${p.fp}">
                        <div><span style="color:#fff">${p.name}</span></div>
                        <span style="color:#666;font-size:10px">单点</span>
                    </div>
                `;
            });

            if (html === '') {
                html = `<div style="padding:10px;color:#888;text-align:center">无结果</div>`;
            }

            list.innerHTML = html;
            list.style.display = 'block';

            list.querySelectorAll('.kmp-result-item.group').forEach(el => {
                el.onclick = () => {
                    const points = tagGroups[el.dataset.tag];
                    batchHighlight(points);
                };
            });
            list.querySelectorAll('.kmp-result-item.single').forEach(el => {
                el.onclick = () => {
                    const p = globalScope.__SHADOWMAP__.cache.get(el.dataset.fp);
                    batchHighlight([p]);
                };
            });
        };

        const batchHighlight = (points) => {
            const map = globalScope.__SHADOWMAP__.mapInstance;
            const L = globalScope.L;
            if (!map || !L) return;

            if (!map.getPane('kmp_highlight_pane')) {
                map.createPane('kmp_highlight_pane');
                const pane = map.getPane('kmp_highlight_pane');
                pane.style.zIndex = 450;
                pane.style.pointerEvents = 'none';
            }

            if (!globalScope.__SHADOWMAP__.highlightLayer) {
                globalScope.__SHADOWMAP__.highlightLayer = L.layerGroup().addTo(map);
            }

            const layer = globalScope.__SHADOWMAP__.highlightLayer;
            if (!map.hasLayer(layer)) layer.addTo(map);

            layer.clearLayers();
            console.log(`${LOG_PREFIX} 高亮 ${points.length} 个点`, LOG_STYLE);

            points.forEach(p => {
                const gameX = Number(p.x) / 100;
                const gameY = Number(p.y) / 100;

                if (!Number.isFinite(gameX) || !Number.isFinite(gameY)) return;

                const lng = (gameX / 0.83) + 1024;
                const lat = -(gameY / 0.83);

                L.circleMarker({lat: lat, lng: lng}, {
                    radius: 12, color: '#00ff00', weight: 3, fill: false, opacity: 0.9,
                    pane: 'kmp_highlight_pane'
                }).addTo(layer);
            });
            list.style.display = 'none';
        };

        let debounce;
        input.addEventListener('input', (e) => {
            clearTimeout(debounce);
            debounce = setTimeout(() => performSearch(e.target.value.trim()), 300);
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) wrapper.classList.remove('active');
        });
    }

    hookNetwork();
    hookLeaflet();
    setupSearchSystem();

})();