// ==UserScript==
// @name:zh-CN      YouTube 关注的频道导出
// @name         YouTube Subscribed Channels Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description:zh-CN  在 https://www.youtube.com/feed/channels 采集关注的频道链接，页面右下显示数量。中/英自动适配浏览器语言。
// @description  Collect subscribed channel links from https://www.youtube.com/feed/channels, show count at bottom-right, auto language detection (Chinese/English).
// @match        https://*.youtube.com/feed/channels
// @author kaesinol
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554725/YouTube%20Subscribed%20Channels%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/554725/YouTube%20Subscribed%20Channels%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== i18n =====
    const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const zh = lang.startsWith('zh');
    const T = {
        start: zh ? '开始采集' : 'Start collecting',
        stop: zh ? '停止采集' : 'Stop collecting',
        copied: zh ? '已复制到剪贴板' : 'Copied to clipboard',
        downloaded: zh ? '开始下载' : 'Download started',
        done: (n, r) => zh ? `采集完成，共 ${n} 个频道链接（rounds=${r}）` : `Collection done: ${n} channels (rounds=${r})`,
        panel: zh ? '频道数量: ' : 'Channels: ',
        alreadyRunning: zh ? '脚本已在运行' : 'Collector already running',
    };

    // ===== 参数 & 状态 =====
    const collected = new Set();
    let running = false;
    let stopRequested = false;

    const AFTER_SCROLL_WAIT_MS = 1200; // 滚动到底后等待加载时间
    const SECOND_TRY_WAIT_MS = 800;    // 再试一次后等待时间
    const MAX_ROUNDS = 6;              // 防止无限循环（每轮尝试滚到底并再试一次）

    // ===== 简单面板（右下） =====
    const panel = (() => {
        const el = document.createElement('div');
        el.style.cssText = [
            'position:fixed',
            'right:12px',
            'bottom:12px',
            'z-index:2147483647',
            'padding:8px 10px',
            'background:rgba(0,0,0,0.65)',
            'color:#fff',
            'border-radius:8px',
            'font-size:12px',
            'font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif',
            'pointer-events:auto'
        ].join(';');
        el.textContent = T.panel + '0';
        document.body.appendChild(el);
        return el;
    })();
    function updatePanel() { panel.textContent = T.panel + collected.size; }

    // ===== 简单帮助函数 =====
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // 返回滚动容器（尽量使用 document.scrollingElement）
    function getScrollable() {
        return document.scrollingElement || document.documentElement || document.body;
    }

    function scanLinks() {
        const nodes = document.querySelectorAll(
            'a#main-link.channel-link, ytd-channel-renderer a#main-link, ytd-channel-renderer a.yt-simple-endpoint'
        );
        const out = new Set();

        for (const a of nodes) {
            if (!a || !a.href) continue;
            let href = a.href.split('?')[0]; // 去掉 query 参数

            try {
                // 找到 @ 开头的部分并解码
                const atIndex = href.indexOf('/@');
                if (atIndex !== -1) {
                    const before = href.slice(0, atIndex + 2); // 包含 "/@"
                    const after = href.slice(atIndex + 2);      // 之后的 handle
                    try {
                        const decoded = decodeURIComponent(after);
                        href = before + decoded;
                    } catch (e) {
                        // 解码失败则保留原始
                    }
                }
            } catch (e) {
                // 忽略异常
            }

            out.add(href);
        }

        return Array.from(out);
    }



    // 主采集流程：每轮滚动到底，等待，滚动一次微动，再等待，扫描新链接
    async function collectOnceRound() {
        const container = getScrollable();
        // 滚到底（平滑或瞬时均可）
        try {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } catch (e) {
            try { container.scrollTop = container.scrollHeight; } catch (e) { }
        }
        await sleep(AFTER_SCROLL_WAIT_MS);

        // 再尝试微微滚动一次以触发可能需要的额外加载
        try {
            // 微动：若能用 scrollBy 就用；否则直接设置 scrollTop
            if (typeof container.scrollBy === 'function') {
                container.scrollBy(0, 50);
            } else {
                container.scrollTop = Math.min(container.scrollHeight, (container.scrollTop || 0) + 50);
            }
        } catch (e) { }
        await sleep(SECOND_TRY_WAIT_MS);

        // 扫描并加入
        const found = scanLinks();
        found.forEach(h => collected.add(h));
        updatePanel();

        return found.length;
    }

    // 外部可调用的启动函数
    async function startCollect() {
        if (running) {
            console.warn(T.alreadyRunning);
            return alert(T.alreadyRunning);
        }
        running = true;
        stopRequested = false;
        collected.clear();
        updatePanel();

        // 初次扫描（页面已渲染的）
        scanLinks().forEach(h => collected.add(h));
        updatePanel();

        let rounds = 0;
        while (!stopRequested && rounds < MAX_ROUNDS) {
            rounds++;
            const before = collected.size;
            const addedCount = await collectOnceRound();
            const after = collected.size;

            // 若本轮没有实际新增，可继续下一轮，直到达到 MAX_ROUNDS
            if (after > before) {
                // 有新增：继续（有时需要多轮加载）
            } else {
                // 无新增
            }
        }

        running = false;
        alert(T.done(collected.size, rounds));
    }

    function stopCollect() {
        stopRequested = true;
    }

    // 菜单项
    GM_registerMenuCommand(T.start, startCollect);
    GM_registerMenuCommand(T.stop, stopCollect);
    GM_registerMenuCommand(zh ? '复制到剪贴板' : 'Copy to clipboard', () => {
        const text = Array.from(collected).join('\n');
        try {
            GM_setClipboard(text);
            alert(T.copied);
        } catch (e) {
            // 回退：使用 clipboard API（部分环境受限）
            navigator.clipboard?.writeText(text).then(() => alert(T.copied), () => alert('Clipboard failed'));
        }
    });
    GM_registerMenuCommand(zh ? '下载 TXT' : 'Download TXT', () => {
        const blob = new Blob([Array.from(collected).join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        try {
            GM_download({ url, name: 'youtube_channels.txt', saveAs: true });
            alert(T.downloaded);
        } catch (e) {
            // 回退：用 a 标签下载
            const a = document.createElement('a');
            a.href = url;
            a.download = 'youtube_channels.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            alert(T.downloaded);
        }
    });

    // 页面卸载时清理面板
    window.addEventListener('beforeunload', () => { try { panel.remove(); } catch (e) { } });

    // 如需自动开始（可注释掉）： startCollect();

})();
