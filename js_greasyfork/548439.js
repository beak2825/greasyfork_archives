// ==UserScript==
// @name         Bilibili 视频观看历史记录 优化版
// @namespace    Bilibili-video-History-2025
// @version      1.4.7
// @description  记录并提示 Bilibili 已访问 / 已观看 视频（兼容 2025 年 B 站与最新 Chrome）
// @author       DreamNya + ITLinya (优化)
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548439/Bilibili%20%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548439/Bilibili%20%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

/*
核心思想：
1. 优先使用页面 video 元素的事件（timeupdate / ended / play）保存观看信息（节流）。
2. 使用 beforeunload / visibilitychange 做最后一次保存（兼容直接关页的情况）。
3. 使用 MutationObserver 侦测单页路由（仅在视频相关页面启用）。
4. 用原生 DOM 操作为主，避免与 B 站和其它脚本冲突。
5. 存储格式兼容旧版：[type, watchTimeString, percentString, timeStamp, title]
*/

(function () {
    'use strict';

    /* ---------- 配置 ---------- */
    const SHOW_PROGRESS_BAR = true;       // 是否在缩略图上显示小进度条
    const SAVE_THROTTLE_SECONDS = 10;     // timeupdate 节流保存间隔（秒）
    const TAG_SCAN_INTERVAL = 3000;       // 在列表页面扫描插入标签的节流（毫秒）
    const MAX_TAG_LIVE_SECONDS = 600;     // 卡片标签最长存活（秒），防止页面长期堆积
    const CSS_ZINDEX = 99999;
    const FULLSCREEN_CHECK_INTERVAL = 800; // 检测网页全屏状态的轮询间隔（毫秒）
    const IS_DYNAMIC_SITE = location.hostname === 't.bilibili.com';

    /* ---------- 样式 ---------- */
    GM_addStyle(`
    .BvH-tag{
        position:absolute;
        top:4px;
        left:4px;
        padding:0 6px;
        height:20px;
        line-height:20px;
        border-radius:4px;
        color:#fff;
        font-size:12px;
        background:rgba(122,134,234,0.85);
        z-index:${CSS_ZINDEX};
        box-sizing:border-box;
    }
    .BvH-tag-small{
        padding:0 4px;
        height:18px;
        line-height:18px;
        font-size:10px;
    }
    .BvH-progress-bar{
        position:absolute;
        left:0;
        bottom:0;
        height:4px;
        border-bottom-left-radius:inherit;
        border-bottom-right-radius:inherit;
        background:#ff3636;
        z-index:${CSS_ZINDEX};
    }
    .BvH-fixed-view{
        position:fixed;
        bottom:15px;
        left:15px;
        text-align:center;
        border-left:6px solid #2196F3;
        background-color:#aeffff;
        font-family:Segoe UI,Helvetica,Arial;
        font-weight:700;
        z-index:${CSS_ZINDEX+1};
    }
    `);

    /* ---------- 工具函数 ---------- */
    const nowTimeStr = () => {
        const d = new Date();
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const secToTimeStr = (sec) => {
        if (!isFinite(sec) || sec <= 0) return '00:00';
        sec = Math.round(sec);
        const h = Math.floor(sec / 3600); sec %= 3600;
        const m = Math.floor(sec / 60); const s = sec % 60;
        return (h > 0 ? String(h).padStart(2, '0') + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    };

    const percentStr = (cur, total) => {
        if (!isFinite(cur) || !isFinite(total) || total === 0) return '';
        return Math.round((cur / total) * 100) + '%';
    };

    // 解析当前页 BV/av 与 p（返回 "BVxxxxx" 或 "av123" + 可带 ?p=n）
    function parseVideoIdFromUrl(url) {
        try {
            const u = new URL(url, location.origin);
            const path = u.pathname;
            const match = path.match(/(BV[0-9A-Za-z]+|av\d+)/);
            if (match) {
                const base = match[1];
                const p = u.searchParams.get('p');
                return p ? `${base}?p=${p}` : base;
            }
            const searchAll = u.href;
            const m2 = searchAll.match(/(BV[0-9A-Za-z]+|av\d+)(\?p=\d+)?/);
            if (m2) return m2[0];
        } catch (e) {}
        return null;
    }

    // 尝试从 __INITIAL_STATE__ 获取（优先）
    function getVideoKeyFallback() {
        try {
            if (typeof window.__INITIAL_STATE__ !== 'undefined' && window.__INITIAL_STATE__.bvid) {
                const bvid = window.__INITIAL_STATE__.bvid;
                const p = (window.__INITIAL_STATE__.p && window.__INITIAL_STATE__.p > 1) ? `?p=${window.__INITIAL_STATE__.p}` : '';
                return bvid + p;
            }
        } catch (e) {}
        const meta = document.querySelector('meta[property="og:url"], meta[name="og:url"]');
        if (meta && meta.getAttribute('content')) {
            const parsed = parseVideoIdFromUrl(meta.getAttribute('content'));
            if (parsed) return parsed;
        }
        return parseVideoIdFromUrl(location.href);
    }

    // 存储 key -> value 数组（兼容旧格式）
    function saveRecord(key, arr) {
        try {
            GM_setValue(key, arr);
        } catch (e) {
            try { localStorage.setItem('BvH_' + key, JSON.stringify(arr)); } catch (e2) {}
        }
    }
    function readRecord(key) {
        try {
            const v = GM_getValue(key);
            if (v !== undefined) return v;
        } catch (e) {}
        try {
            const raw = localStorage.getItem('BvH_' + key);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return null;
    }
    function deleteRecord(key) {
        try { GM_deleteValue(key); } catch (e) {}
        try { localStorage.removeItem('BvH_' + key); } catch (e) {}
    }

    // 统一：根据基础 key（BVxxx 或 BVxxx?p=2）拿记录，同时兼容 GM_listValues 里带 ?p= 的实际 key
    function getRecordForBaseKey(baseKey) {
        let key = baseKey;
        let rec = readRecord(key);
        if (!rec && typeof GM_listValues === 'function') {
            try {
                const allKeys = GM_listValues();
                const baseId = key.split('?')[0].toLowerCase();
                const alt = allKeys.find(k => k.split('?')[0].toLowerCase() === baseId);
                if (alt) {
                    key = alt;
                    rec = readRecord(alt);
                }
            } catch (e) {}
        }
        return { key, rec };
    }

    /* ---------- 全屏状态检测 & 左下角提示隐藏（仅在有浮窗时真正生效） ---------- */

    function isInAnyFullscreenMode() {
        // 1. 浏览器原生全屏（F11 / 播放器全屏按钮）
        if (document.fullscreenElement) return true;

        // 2. 播放器自身的网页全屏 / 全屏模式 class
        if (document.querySelector(
            '#bilibiliPlayer.mode-webfullscreen,' +
            '#bilibiliPlayer.mode-fullscreen,' +
            '#bilibili-player.mode-webfullscreen,' +
            '#bilibili-player.mode-fullscreen,' +
            '#bilibili-player.mode-webscreen'
        )) {
            return true;
        }

        return false;
    }

    function updateFixedViewVisibility() {
        const el = document.getElementById('BvH_fixed_view');
        if (!el) return;
        if (isInAnyFullscreenMode()) {
            el.style.display = 'none';
        } else {
            el.style.display = '';
        }
    }

    document.addEventListener('fullscreenchange', updateFixedViewVisibility);
    setInterval(updateFixedViewVisibility, FULLSCREEN_CHECK_INTERVAL);

    /* ---------- 视频页面：记录播放进度逻辑（不在动态页运行） ---------- */
    let saveThrottleTimer = null;
    function setupVideoRecording() {
        if (IS_DYNAMIC_SITE) return null; // t.bilibili.com 不做视频进度记录

        const video = document.querySelector('video');
        if (!video) return null;

        let key = getVideoKeyFallback();
        if (!key) return null;

        const titleFallback =
            document.title ||
            document.querySelector('meta[property="og:title"]')?.content ||
            '';

        const existing = readRecord(key);

        function showFixedView(record) {
            const id = 'BvH_fixed_view';
            let el = document.getElementById(id);
            if (el) el.remove();
            if (!record) return;
            const [type, watchTime, pct, timestamp] = record;

            const html = document.createElement('div');
            html.id = id;
            html.className = 'BvH-fixed-view';
            html.title = `${key}\n左键单击跳转至上次观看进度\n右键单击删除记录`;
            const day = (timestamp || '').split(' ')[0] || '';
            const time = (timestamp || '').split(' ')[1] || '';
            html.innerHTML =
                `<p style="margin:6px 10px 4px 10px">${type}${watchTime ? '<br/>' + watchTime + ' (' + (pct || '') + ')' : ''}</p>` +
                `<p style="margin:0 10px 6px 10px;font-size:12px">${day}<br/>${time}</p>`;
            document.body.appendChild(html);

            html.addEventListener('click', () => {
                if (!watchTime) return;
                const parts = watchTime.split(':').reverse().map((it, idx) => Number(it) * Math.pow(60, idx));
                const t = parts.reduce((a, b) => a + b, 0);
                if (isFinite(t) && t > 0) {
                    video.currentTime = t;
                    video.play().catch(() => {});
                }
            });
            html.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
                deleteRecord(key);
                html.remove();
            });

            updateFixedViewVisibility();
        }

        if (existing) {
            setTimeout(() => showFixedView(existing), 800);
        }

        function doSave(final = false) {
            const cur = video.currentTime;
            const dur = video.duration;
            if (!isFinite(dur) || dur <= 0) {
                saveRecord(key, ['已访问', '', '', nowTimeStr(), titleFallback]);
                return;
            }
            const watchTime = secToTimeStr(cur);
            const pct = percentStr(cur, dur);
            const record = ['已观看', watchTime, pct, nowTimeStr(), titleFallback];
            saveRecord(key, record);
            if (final) {
                // no-op
            }
            showFixedView(record);
        }

        let lastSavedAt = 0;
        const throttleSave = (final = false) => {
            const now = Date.now();
            if (final || (now - lastSavedAt) / 1000 >= SAVE_THROTTLE_SECONDS) {
                doSave(final);
                lastSavedAt = now;
            } else {
                if (saveThrottleTimer) clearTimeout(saveThrottleTimer);
                const waitMs = (SAVE_THROTTLE_SECONDS - ((now - lastSavedAt) / 1000)) * 1000 + 50;
                saveThrottleTimer = setTimeout(() => {
                    doSave();
                    lastSavedAt = Date.now();
                    saveThrottleTimer = null;
                }, waitMs);
            }
        };

        const onPlay = () => { throttleSave(false); };
        const onTimeUpdate = () => { throttleSave(false); };
        const onEnded = () => { throttleSave(true); };
        video.addEventListener('play', onPlay);
        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('ended', onEnded);

        const onVisibility = () => {
            if (document.visibilityState === 'hidden') {
                throttleSave(true);
            }
        };
        const onBeforeUnload = () => { throttleSave(true); };

        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('ended', onEnded);
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('beforeunload', onBeforeUnload);
            if (saveThrottleTimer) {
                clearTimeout(saveThrottleTimer);
                saveThrottleTimer = null;
            }
        };
    }

    /* ---------- 列表/首页/UP 空间/动态页：标注缩略图的小标签逻辑 ---------- */
    const BV_REGEX = /((BV|bv)[0-9A-Za-z]+(\?p=\d+)?)|(av\d+(\?p=\d+)?)/i;

    function createTagElement(text, title, small = false) {
        const d = document.createElement('div');
        d.className = 'BvH-tag' + (small ? ' BvH-tag-small' : '');
        d.title = title || '';
        d.innerHTML = text;
        return d;
    }

    // 在一个块元素上（可以是 <a>、<li>、<div>）插入标签和进度条
    function tryInsertTagOnLink(rootEl, text, title, percent, small) {
        if (!rootEl || !(rootEl instanceof Element)) return;

        const oldTag = rootEl.querySelector('.BvH-tag');
        if (oldTag) {
            if (oldTag.innerText === text) return;
            oldTag.remove();
        }
        const oldBar = rootEl.querySelector('.BvH-progress-bar');
        if (oldBar) oldBar.remove();

        const img = rootEl.querySelector('img, .bili-awesome-img, .lazy-img, .cover-image');
        if (!img || !img.parentElement) return;

        const container = img.parentElement;
        const computedPos = window.getComputedStyle(container).position;
        if (computedPos === 'static' || !computedPos) {
            container.style.position = 'relative';
        }

        const tag = createTagElement(text, title, small);
        tag.style.position = 'absolute';
        tag.style.top = '4px';
        tag.style.left = '4px';

        container.appendChild(tag);

        if (percent && SHOW_PROGRESS_BAR) {
            const bar = document.createElement('div');
            bar.className = 'BvH-progress-bar';
            const num = Number((percent || '').replace('%', ''));
            const width = Math.max(3, isFinite(num) ? num : 0) + '%';
            bar.style.width = width;
            container.appendChild(bar);
        }

        setTimeout(() => {
            if (tag && tag.parentElement) tag.remove();
        }, MAX_TAG_LIVE_SECONDS * 1000);
    }

    let scanning = false;
    function scanAndTag() {
        if (scanning) return;
        scanning = true;
        try {
            /* —— 1. 常规：扫描所有 a[href] 里的 BV/av 视频链接 —— */
            const links = Array.from(document.querySelectorAll('a[href*="BV"], a[href*="bv"], a[href*="av"]'));
            links.forEach(a => {
                try {
                    if (!a) return;

                    // 如果在顶栏 / 头部区域：
                    // 只有带缩略图（img 等）的链接才参与打标签（用于“历史 / 收藏”下拉中的视频卡片）
                    const inHeader =
                        a.closest('header') ||
                        a.closest('#biliMainHeader') ||
                        a.closest('.bili-header') ||
                        a.closest('.bili-header__bar') ||
                        a.closest('.international-header') ||
                        a.closest('.bili-app-header');
                    if (inHeader) {
                        const thumb = a.querySelector('img, .bili-awesome-img, .lazy-img, .cover-image');
                        if (!thumb) return; // 顶栏纯文本按钮直接跳过
                    }

                    const href = a.getAttribute('href');
                    if (!href) return;
                    const m = href.match(BV_REGEX);
                    if (!m) return;

                    let base = m[0].replace(/\?p=1$/, '');
                    const { key, rec } = getRecordForBaseKey(base);
                    if (!rec) return;

                    const [type, watchTime, pct, timestamp] = rec;
                    const text = key.includes('?p=') ? '已记录 多P' : `${type}${pct ? pct : ''}`;
                    const title = `${key}\n${timestamp || ''}\n${watchTime || ''}`;

                    const imgEl = a.querySelector('img');
                    const small = imgEl ? (imgEl.naturalWidth > 0 && imgEl.naturalWidth < 83) : false;

                    tryInsertTagOnLink(a, text, title, pct, small);
                } catch (e) {
                    // ignore single link
                }
            });

            /* —— 2. 合集 / 播放列表左侧的条目（通常带 data-bvid） —— */
            const playlistItems = Array.from(document.querySelectorAll(
                '[data-bvid], [data-bv-id], [data-bv]'
            ));

            playlistItems.forEach(item => {
                try {
                    if (!item || item.querySelector('.BvH-tag')) return;

                    const bvid =
                        item.getAttribute('data-bvid') ||
                        item.getAttribute('data-bv-id') ||
                        item.getAttribute('data-bv');
                    if (!bvid) return;

                    const { key, rec } = getRecordForBaseKey(bvid);
                    if (!rec) return;

                    const [type, watchTime, pct, timestamp] = rec;
                    const text = `${type}${pct ? pct : ''}`;
                    const title = `${key}\n${timestamp || ''}\n${watchTime || ''}`;

                    const imgEl = item.querySelector('img');
                    const small = imgEl ? (imgEl.naturalWidth > 0 && imgEl.naturalWidth < 83) : false;

                    tryInsertTagOnLink(item, text, title, pct, small);
                } catch (e) {
                    // ignore
                }
            });
        } finally {
            scanning = false;
            setTimeout(scanAndTag, TAG_SCAN_INTERVAL);
        }
    }

    /* ---------- 单页路由变化处理（仅非动态站启用） ---------- */
    let currentRouteKey = null;
    let currentVideoUnbind = null;

    function handleRoute() {
        if (IS_DYNAMIC_SITE) return;

        const key = location.pathname + location.search;
        if (key === currentRouteKey) return;

        if (typeof currentVideoUnbind === 'function') {
            try { currentVideoUnbind(); } catch (e) {}
            currentVideoUnbind = null;
        }
        currentRouteKey = key;

        const vid = getVideoKeyFallback();
        if (!vid) return;

        // 兼容视频元素晚挂载：短时间重试几次
        let retry = 0;
        const maxRetry = 10;
        const trySetup = () => {
            const unbind = setupVideoRecording();
            if (unbind) {
                currentVideoUnbind = unbind;
            } else if (retry++ < maxRetry) {
                setTimeout(trySetup, 300);
            }
        };
        trySetup();
    }

    const routeObserver = new MutationObserver(() => {
        if (routeObserver._timer) clearTimeout(routeObserver._timer);
        routeObserver._timer = setTimeout(() => {
            handleRoute();
        }, 120);
    });

    // 动态页不启用路由观察和视频记录，以减轻卡顿
    if (!IS_DYNAMIC_SITE) {
        routeObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
        handleRoute();
    }

    // 所有站点都需要列表打标签
    setTimeout(scanAndTag, 500);

    /* ---------- 提示用户脚本已加载（简洁） ---------- */
    (function floatingLoadHint() {
        const id = 'BvH_loaded_hint';
        if (document.getElementById(id)) return;
        const el = document.createElement('div');
        el.id = id;
        el.style.position = 'fixed';
        el.style.right = '12px';
        el.style.bottom = '12px';
        el.style.padding = '6px 10px';
        el.style.background = 'rgba(0,0,0,0.6)';
        el.style.color = '#fff';
        el.style.borderRadius = '6px';
        el.style.fontSize = '12px';
        el.style.zIndex = CSS_ZINDEX + 2;
        el.textContent = 'BvH: 观看记录脚本已加载';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    })();

})();
