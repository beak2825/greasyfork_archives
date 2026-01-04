// ==UserScript==
// @name         小鹅通 m3u8 导出 / 一键复制工具
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  自动监听页面请求，识别并评分课程播放过程中出现的 m3u8 地址，智能筛选主播放列表（master m3u8），并支持一键导出 JSON 或复制到剪贴板，适用于小鹅通网页端课程视频分析与下载辅助
// @author       Eddie7x
// @license      MIT
// @match        *://*.xiaoeknow.com/*
// @match        *://*.h5.xet.citv.cn/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/560384/%E5%B0%8F%E9%B9%85%E9%80%9A%20m3u8%20%E5%AF%BC%E5%87%BA%20%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560384/%E5%B0%8F%E9%B9%85%E9%80%9A%20m3u8%20%E5%AF%BC%E5%87%BA%20%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const pool = new Map();

    function getTitle() {
        const titleEl = document.querySelector(".title-row .title.new_title");
        if (titleEl && titleEl.innerText.trim()) {
            return titleEl.innerText.trim();
        }

        const selectors = ['h1', '.course-title', '.lesson-title', '.title'];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.trim().length > 2) {
                return el.innerText.trim();
            }
        }

        return document.title.replace(/[-_｜|].*/, '').trim();
    }

    function score(url) {
        let s = url.length / 10;
        if (/master|index|playlist/i.test(url)) s += 30;
        if (/token|sign|expires/i.test(url)) s += 20;
        return Math.floor(s);
    }

    function collect(url) {
        if (!url || !url.includes('.m3u8')) return;
        if (!pool.has(url)) {
            pool.set(url, { url, score: score(url) });
        }
    }

    // hook fetch / xhr
    const _fetch = window.fetch;
    window.fetch = function (...args) {
        collect(args[0]?.url || args[0]);
        return _fetch.apply(this, args);
    };

    const _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (m, url) {
        collect(url);
        return _open.apply(this, arguments);
    };

    function getBestData() {
        if (pool.size === 0) return null;

        const best = [...pool.values()].sort((a, b) => b.score - a.score)[0];
        return {
            title: getTitle(),
            m3u8: best.url
        };
    }

    function createBtn(text, bottom, onClick, bg = '#1e80ff') {
        const btn = document.createElement('div');
        btn.innerText = text;
        btn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: ${bottom}px;
            z-index: 99999;
            background: ${bg};
            color: #fff;
            padding: 12px 16px;
            border-radius: 10px;
            cursor: pointer;
            user-select: none;
        `;
        btn.onclick = onClick;
        document.body.appendChild(btn);
    }

    // 导出按钮
    createBtn('导出本课', 80, () => {
        const data = getBestData();
        if (!data) {
            alert('请先播放课程');
            return;
        }

        const blob = new Blob(
            [JSON.stringify([data], null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);

        GM_download({
            url,
            name: 'm3u8_list.json'
        });
    });

    // 一键复制按钮
    createBtn('一键复制', 140, async () => {
        const data = getBestData();
        if (!data) {
            alert('请先播放课程');
            return;
        }

        const text = JSON.stringify(data, null, 2);
        try {
            await navigator.clipboard.writeText(text);
            alert('已复制到剪贴板');
        } catch (e) {
            alert('复制失败，请检查浏览器权限');
            console.error(e);
        }
    }, '#10b981'); // 绿色
})();
