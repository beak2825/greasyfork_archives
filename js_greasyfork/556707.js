// ==UserScript==
// @name         Threads Media Downloader (Optimized v2.1 + Custom Filename)
// @namespace    https://threads.com
// @version      2.1
// @license      MIT
// @description  Download media with high performance + customizable filename pattern
// @match        https://www.threads.net/*
// @match        https://www.threads.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/556707/Threads%20Media%20Downloader%20%28Optimized%20v21%20%2B%20Custom%20Filename%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556707/Threads%20Media%20Downloader%20%28Optimized%20v21%20%2B%20Custom%20Filename%29.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // ⭐⭐⭐ 你可以在這裡自訂檔名格式 ⭐⭐⭐
    // 可使用變數：{username} {postId} {datetime} {index} {ext}
    const filenamePattern = "{username}_{postId}_{datetime}_{index}{ext}";

    const SEL_POST     = ".x78zum5.xdt5ytf";
    const SEL_BTN_WRAP = "div.x6s0dn4.xamitd3.x40hh3e.x78zum5.x1q0g3np.x1xdureb.x1fc57z9.x1hm9lzh.xvijh9v";
    const SEL_SCOPE    = ".x1xmf6yo";

    const download = (url, name) =>
        new Promise(res =>
            typeof GM_download === "function"
                ? GM_download({ url, name, onload: res, onerror: () => (fallback(url, name), res()) })
                : fallback(url, name).then(res)
        );

    const fallback = (url, name) => {
        const a = Object.assign(document.createElement("a"), { href: url, download: name });
        document.body.appendChild(a).click();
        a.remove();
        return Promise.resolve();
    };

    const getMeta = post => {
        const link = post.querySelector("a[href*='/post/'][role='link']");
        const time = post.querySelector("time[datetime]");
        if (!link || !time) return;

        const m = link.href.match(/\/@([^/]+)\/post\/([^/]+)/);
        if (!m) return;
        const [, username, postId] = m;

        const d = new Date(time.getAttribute("datetime"));
        const P = n => `${n}`.padStart(2, "0");
        const datetime =
            `${d.getUTCFullYear()}${P(d.getUTCMonth() + 1)}${P(d.getUTCDate())}_` +
            `${P(d.getUTCHours())}${P(d.getUTCMinutes())}${P(d.getUTCSeconds())}`;

        return { username, postId, datetime };
    };

    const formatFilename = (meta, index, ext) =>
        filenamePattern
            .replace("{username}", meta.username)
            .replace("{postId}", meta.postId)
            .replace("{datetime}", meta.datetime)
            .replace("{index}", index)
            .replace("{ext}", ext);

    const addButton = post => {
        const wrap = post.querySelector(SEL_BTN_WRAP);
        if (!wrap || wrap.__hasDownloadBtn) return;

        wrap.__hasDownloadBtn = true;

        const btn = document.createElement("button");
        btn.textContent = "下載";
        btn.style.cursor = "pointer";

        btn.onclick = async e => {
            e.stopPropagation();
            e.preventDefault();

            const meta = getMeta(post);
            if (!meta) return;

            const scope = post.querySelector(SEL_SCOPE);
            if (!scope) return;

            let i = 1;
            for (const media of scope.querySelectorAll("img, video")) {
                const url = media.src || media.poster;
                if (!url) continue;

                const ext = url.includes(".mp4") ? ".mp4" : ".jpg";
                const name = formatFilename(meta, i++, ext);

                await download(url, name);
            }
        };

        wrap.appendChild(btn);
    };

    const scan = () => document.querySelectorAll(SEL_POST).forEach(addButton);

    scan();

    let pending = false;
    new MutationObserver(() => {
        if (!pending) {
            pending = true;
            requestAnimationFrame(() => {
                scan();
                pending = false;
            });
        }
    }).observe(document.body, { childList: true, subtree: true });
})();