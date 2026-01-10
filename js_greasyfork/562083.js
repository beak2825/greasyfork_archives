// ==UserScript==
// @name         Chaturbate 直播 m3u8 抓取器（稳定版）
// @namespace    https://greasyfork.org/
// @version      4.1.1
// @description  自动捕获 Chaturbate 真实直播 m3u8，并支持外部播放器打开
// @match        *://*.chaturbate.com/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562083/Chaturbate%20%E7%9B%B4%E6%92%AD%20m3u8%20%E6%8A%93%E5%8F%96%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562083/Chaturbate%20%E7%9B%B4%E6%92%AD%20m3u8%20%E6%8A%93%E5%8F%96%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let lastM3U8 = null;

    /* ========= 工具 ========= */

    function isValidM3U8(url) {
        if (!url.includes(".m3u8")) return false;

        // 过滤预览 / 假流
        if (url.includes("preview")) return false;
        if (url.includes("offline")) return false;

        // Chaturbate 正式直播流特征
        return (
            url.includes("/hls/") ||
            url.includes("playlist") ||
            url.includes("live")
        );
    }

    function save(url, source) {
        if (url === lastM3U8) return;
        lastM3U8 = url;
        console.log(`[%cCB m3u8%c][${source}]`, "color:#0f0", "color:#fff", url);
    }

    /* ========= fetch hook ========= */

    const _fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (...args) {
        const url = args[0]?.url || args[0];
        if (typeof url === "string" && isValidM3U8(url)) {
            save(url, "fetch");
        }
        return _fetch.apply(this, args);
    };

    /* ========= XHR hook ========= */

    const _open = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function (method, url) {
        if (typeof url === "string" && isValidM3U8(url)) {
            save(url, "xhr");
        }
        return _open.apply(this, arguments);
    };

    /* ========= 播放 ========= */

    function getUrl() {
        if (!lastM3U8) {
            throw "尚未捕获到 Chaturbate m3u8，请等待直播加载完成";
        }
        return lastM3U8;
    }

    function play(proto) {
        try {
            const url = getUrl();
            proto ? location.href = proto + url : window.open(url);
        } catch (e) {
            alert(e);
        }
    }

    function copy() {
        try {
            navigator.clipboard.writeText(getUrl());
            alert("Chaturbate m3u8 已复制");
        } catch (e) {
            alert(e);
        }
    }

    /* ========= UI ========= */

    function addUI() {
        if (document.getElementById("cb-sniffer-ui")) return;

        const box = document.createElement("div");
        box.id = "cb-sniffer-ui";
        box.style = `
            position:fixed;
            top:90px;
            right:12px;
            z-index:99999;
            background:#000c;
            padding:8px;
            border-radius:10px;
            font-size:14px;
        `;

        const btn = (t, f) => {
            const b = document.createElement("button");
            b.textContent = t;
            b.style = `
                display:block;
                width:100%;
                margin:4px 0;
                padding:6px 10px;
                background:#222;
                color:#fff;
                border:1px solid #e53935;
                border-radius:6px;
                cursor:pointer;
            `;
            b.onclick = f;
            return b;
        };

        box.append(
            btn("复制 m3u8", copy),
            btn("浏览器打开", () => play("")),
            btn("mpv 播放", () => play("mpv://")),
            btn("VLC 播放", () => play("vlc://")),
            btn("PotPlayer 播放", () => play("potplayer://"))
        );

        document.body.appendChild(box);
    }

    window.addEventListener("load", () => {
        setTimeout(addUI, 2000);
    });

})();
