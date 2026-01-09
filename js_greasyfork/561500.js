// ==UserScript==
// @name         B站直播m3u8提取器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  直播页面右侧吸附按钮，点击即可将M3U8链接写入剪贴板，以便在potplayer中播放
// @author       Rasury & Gemini
// @match        *://live.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561500/B%E7%AB%99%E7%9B%B4%E6%92%ADm3u8%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561500/B%E7%AB%99%E7%9B%B4%E6%92%ADm3u8%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sentinelStore = {
        lastGotcha: "",
        lastNormal: ""
    };

    const btnId = 'bili-m3u8-copy-btn';
    const noticeId = 'bili-m3u8-notice';

    // 判断是不是gotcha
    function isStrictGotcha(urlStr) {
        try {
            const url = new URL(urlStr);
            // 必须在 hostname (域名) 部分包含 gotcha
            return url.hostname.includes("gotcha");
        } catch (e) {
            return false;
        }
    }

    // 监听
    try {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries().filter(r =>
                r.name.includes("index.m3u8") && !r.name.includes("data.bilibili.com")
            );

            entries.forEach(entry => {
                const url = entry.name;
                if (isStrictGotcha(url)) {
                    sentinelStore.lastGotcha = url;
                } else {
                    sentinelStore.lastNormal = url;
                }
            });
        });
        observer.observe({ entryTypes: ["resource"] });
    } catch (e) {}

    // 通知
    function showToast(message, isSuccess = true) {
        let notice = document.getElementById(noticeId);
        if (!notice) {
            notice = document.createElement('div');
            notice.id = noticeId;
            document.body.appendChild(notice);
        }
        Object.assign(notice.style, {
            position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)',
            zIndex: '2147483647', minWidth: '380px', padding: '40px 24px 15px 24px',
            marginTop: '-30px', backgroundColor: isSuccess ? '#28a745' : '#dc3545',
            color: 'white', textAlign: 'center', borderRadius: '0 0 16px 16px',
            fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'top 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            backdropFilter: 'blur(4px)', pointerEvents: 'none', lineHeight: '1.5'
        });
        notice.textContent = message;
        setTimeout(() => { notice.style.top = '0px'; }, 10);
        setTimeout(() => { notice.style.top = '-110px'; }, isSuccess ? 8000 : 8000);
    }

    // 点击
    function handleCopy() {
        // 是否符合 isStrictGotcha
        const target = sentinelStore.lastGotcha || sentinelStore.lastNormal;

        if (!target) {
            showToast("❌ 尚未捕获任何请求，请刷新页面、切换画质或线路后重试", false);
            return;
        }

        let finalUrl = target;
        try { if (finalUrl.includes("%3A%2F%2F")) finalUrl = decodeURIComponent(finalUrl); } catch(e) {}

        GM_setClipboard(finalUrl);

        if (isStrictGotcha(finalUrl)) {
            showToast("✅ 已写入剪贴板，部分节点可能无法播放，遇到问题请刷新直播间重新抓取");
        } else {
            showToast("❌ 非Gotcha线路，请刷新页面、切换画质或线路后重试", false);
        }
    }

    // UI
    function createButton() {
        if (document.getElementById(btnId)) return;
        const btn = document.createElement('div');
        btn.id = btnId; btn.textContent = "复制 m3u8";
        const width = 85; const hidden = 15;
        Object.assign(btn.style, {
            position: 'fixed', right: `${-(width - hidden)}px`, top: '50%', transform: 'translateY(-50%)',
            zIndex: '2147483646', width: `${width}px`, padding: '12px 0', backgroundColor: '#fb7299',
            color: 'white', borderRadius: '8px 0 0 8px', cursor: 'pointer', boxShadow: '-2px 2px 10px rgba(0,0,0,0.4)',
            fontWeight: 'bold', fontSize: '13px', transition: 'right .3s ease, background .3s ease', textAlign: 'center', userSelect: 'none'
        });
        btn.addEventListener("mouseenter", () => { btn.style.right = "0px"; btn.style.backgroundColor = "#00a1d6"; });
        btn.addEventListener("mouseleave", () => { btn.style.right = `${-(width - hidden)}px`; btn.style.backgroundColor = "#fb7299"; });
        btn.onclick = handleCopy;
        document.body.appendChild(btn);
    }

    setInterval(createButton, 2000);
})();