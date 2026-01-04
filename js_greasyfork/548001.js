// ==UserScript==
// @name         Make BiliBili Great Again (Optimized)
// @namespace    https://www.kookxiang.com/
// @version      1.6.0
// @description  useful tweaks for bilibili.com (优化版)
// @author       kookxiang + ChatGPT
// @match        https://*.bilibili.com/*
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/548001/Make%20BiliBili%20Great%20Again%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548001/Make%20BiliBili%20Great%20Again%20%28Optimized%29.meta.js
// ==/UserScript==

// 合并 CSS 注入
GM_addStyle(`
html, body { -webkit-filter: none !important; filter: none !important; font-family: initial !important; }
.adblock-tips { display: none !important; }
.ad-report, a[href*="cm.bilibili.com"] { display: none !important; }
#bilibili-player video { transition: object-fit 0.3s ease; }
div[data-cy=EvaRenderer_LayerWrapper]:has(.player) { z-index: 999999; }
.fixedPageBackground_root { z-index: 999999 !important; }
#welcome-area-bottom-vm, .web-player-icon-roomStatus { display: none !important; }
`);

// 去掉鸿蒙字体
Array.from(document.querySelectorAll('link[href*="/jinkela/long/font/"]')).forEach(x => x.remove());

// 无用 URL 参数
const uselessUrlParams = new Set([
    'buvid', 'is_story_h5', 'launch_id', 'live_from',
    'mid', 'session_id', 'timestamp', 'up_id', 'vd_source'
]);
const uselessUrlRegex = [/^share/, /^spm/];

// ---------- 工具函数 ----------
function removeTracking(url) {
    if (!url) return url;
    try {
        const urlObj = new URL(url, location.href);
        if (!urlObj.search) return url;
        for (const key of [...urlObj.searchParams.keys()]) {
            if (uselessUrlParams.has(key) || uselessUrlRegex.some(r => r.test(key))) {
                urlObj.searchParams.delete(key);
            }
        }
        return urlObj.toString();
    } catch {
        return url;
    }
}
function noopProxy(name) {
    return new Proxy(function () { }, {
        construct: () => noopProxy(name),
        get: () => () => { },
    });
}

// ---------- 屏蔽 WebRTC ----------
try {
    class _RTCPeerConnection { addEventListener() { } createDataChannel() { } }
    class _RTCDataChannel { }
    ['RTCPeerConnection', 'webkitRTCPeerConnection'].forEach(k => {
        Object.defineProperty(unsafeWindow, k, { value: _RTCPeerConnection });
    });
    ['RTCDataChannel', 'webkitRTCDataChannel'].forEach(k => {
        Object.defineProperty(unsafeWindow, k, { value: _RTCDataChannel });
    });
} catch { }

// ---------- 首页优化 ----------
if (location.host === "www.bilibili.com") {
    // 手动去广告（避免 :has 不兼容）
    const cleanHome = () => {
        document.querySelectorAll('.feed-card a[href*="cm.bilibili.com"]')
            .forEach(el => el.closest('.feed-card')?.remove());
    };
    new MutationObserver(cleanHome).observe(document.body, { childList: true, subtree: true });
    cleanHome();
}

// ---------- 动态页面优化 ----------
if (location.host === "t.bilibili.com") {
    GM_addStyle(`
    html[wide] #app { display: flex; }
    html[wide] .bili-dyn-home--member { box-sizing: border-box; padding: 0 10px; width: 100%; flex: 1; }
    html[wide] .bili-dyn-content { width: auto; }
    html[wide] main { margin: 0 8px; flex: 1; overflow: hidden; }
    #wide-mode-switch { margin-left: 0; margin-right: 20px; }
    `);
    if (!localStorage.WIDE_OPT_OUT) document.documentElement.setAttribute('wide', 'wide');
    window.addEventListener('load', () => {
        const tabContainer = document.querySelector('.bili-dyn-list-tabs__list');
        if (!tabContainer) return;
        const placeHolder = document.createElement('div');
        placeHolder.style.flex = 1;
        const switchButton = document.createElement('a');
        switchButton.id = 'wide-mode-switch';
        switchButton.className = 'bili-dyn-list-tabs__item';
        switchButton.textContent = '宽屏模式';
        switchButton.onclick = e => {
            e.preventDefault();
            if (localStorage.WIDE_OPT_OUT) {
                localStorage.removeItem('WIDE_OPT_OUT');
                document.documentElement.setAttribute('wide', 'wide');
            } else {
                localStorage.setItem('WIDE_OPT_OUT', '1');
                document.documentElement.removeAttribute('wide');
            }
        };
        tabContainer.append(placeHolder, switchButton);
    });
}

// ---------- 去 P2P CDN ----------
if (/^https:\/\/www\.bilibili\.com\/(video|bangumi\/play)\//.test(location.href)) {
    let cdnDomain, visited = new WeakSet();
    function replaceP2PUrl(url) {
        try {
            cdnDomain ||= document.head.innerHTML.match(/up[\w-]+\.bilivideo\.com/)?.[0];
            const urlObj = new URL(url);
            const hostName = urlObj.hostname;
            if (hostName.endsWith(".mcdn.bilivideo.cn")) {
                urlObj.host = cdnDomain || 'upos-sz-mirrorcoso1.bilivideo.com';
                urlObj.port = 443;
                return urlObj.toString();
            } else if (hostName.endsWith(".szbdyd.com")) {
                urlObj.host = urlObj.searchParams.get('xy_usource');
                urlObj.port = 443;
                return urlObj.toString();
            }
            return url;
        } catch { return url; }
    }
    function replaceDeep(obj) {
        if (!obj || typeof obj !== 'object' || visited.has(obj)) return;
        visited.add(obj);
        for (const k in obj) {
            if (typeof obj[k] === 'string') obj[k] = replaceP2PUrl(obj[k]);
            else replaceDeep(obj[k]);
        }
    }
    replaceDeep(unsafeWindow.__playinfo__);
    const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    Object.defineProperty(HTMLMediaElement.prototype, 'src', {
        ...desc,
        set(v) { return desc.set.call(this, replaceP2PUrl(v)); }
    });
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (m, u) {
        return open.call(this, m, replaceP2PUrl(u));
    };
}

// ---------- 裁切模式 ----------
if (location.href.startsWith('https://www.bilibili.com/video/')) {
    GM_addStyle(`
    body[video-fit] #bilibili-player video { object-fit: cover; }
    .bpx-player-ctrl-setting-fit-mode { display: flex; width: 100%; height: 32px; line-height: 32px; }
    `);
    function toggleMode(enabled) {
        document.body.toggleAttribute('video-fit', enabled);
    }
    const observer = new MutationObserver(() => {
        const parent = document.querySelector('.bpx-player-ctrl-setting-menu-left');
        if (!parent || parent.querySelector('.bpx-player-ctrl-setting-fit-mode')) return;
        const item = document.createElement('div');
        item.className = 'bpx-player-ctrl-setting-fit-mode bui bui-switch';
        item.innerHTML = `
          <input class="bui-switch-input" type="checkbox">
          <label class="bui-switch-label">
            <span class="bui-switch-name">裁切模式</span>
            <span class="bui-switch-body"><span class="bui-switch-dot"><span></span></span></span>
          </label>`;
        parent.insertBefore(item, document.querySelector('.bpx-player-ctrl-setting-more'));
        item.querySelector('input').addEventListener('change', e => toggleMode(e.target.checked));
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// ---------- 去上报 ----------
(() => {
    const oldFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (url, ...args) {
        if (typeof url === 'string' && /(cm|data)\.bilibili\.com/.test(url)) return new Promise(() => { });
        return oldFetch.call(this, url, ...args);
    };
    const oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (m, u, ...args) {
        if (typeof u === 'string' && /(cm|data)\.bilibili\.com/.test(u)) this.send = () => { };
        return oldOpen.call(this, m, u, ...args);
    };
    unsafeWindow.navigator.sendBeacon = () => Promise.resolve();
    unsafeWindow.MReporter = noopProxy("MReporter");
    unsafeWindow.MReporterInstance = noopProxy("MReporterInstance");
    unsafeWindow.ReporterPb = noopProxy("ReporterPb");
    unsafeWindow.ReporterPbInstance = noopProxy("ReporterPbInstance");
    unsafeWindow.Sentry = { init() { }, Hub: class { bindClient() { } }, getCurrentHub: () => ({}) };
})();
