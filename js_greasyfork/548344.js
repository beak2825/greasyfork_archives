// ==UserScript==
// @name         小黄书套图开启瀑布流（系列/模特）
// @name:zh-CN   小黄书套图开启瀑布流（系列/模特）
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  套图系列/模特页进入时自动加载多页，自行配合"图片全载"使用
// @description:zh-CN 套图系列/模特页进入时自动加载多页，自行配合"图片全载"使用
// @author       Doubao
// @match        *://xchina.co/*
// @match        *://www.xchina.co/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548344/%E5%B0%8F%E9%BB%84%E4%B9%A6%E5%A5%97%E5%9B%BE%E5%BC%80%E5%90%AF%E7%80%91%E5%B8%83%E6%B5%81%EF%BC%88%E7%B3%BB%E5%88%97%E6%A8%A1%E7%89%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548344/%E5%B0%8F%E9%BB%84%E4%B9%A6%E5%A5%97%E5%9B%BE%E5%BC%80%E5%90%AF%E7%80%91%E5%B8%83%E6%B5%81%EF%BC%88%E7%B3%BB%E5%88%97%E6%A8%A1%E7%89%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        albumContainer: '.list.photo-list',
        albumItem: 'div.item.photo',
        currentPageEl: '.pager-num.current',
        loadThreshold: 800,
        requestInterval: 800,     // 每页加载间隔
        scrollLoadPages: 3,       // 每次加载页数（含初始加载）
        urlRules: {
            album: {
                idReg: /album-(\d+)/,
                pagePath: '/photos/album-{id}/{page}.html'
            },
            series: {
                idReg: /series-([^\/]+)/,
                pagePath: '/photos/series-{id}/{page}.html'
            },
            model: {
                idReg: /model-([a-z0-9]+)/,
                pagePath: '/photos/model-{id}/{page}.html'
            }
        }
    };

    const globalState = {
        currentPage: 1,
        columnId: '',
        columnType: '',
        isLoading: false,
        isLastPage: false
    };

    function logTip(msg) {
        console.log(`[xchina.co] ${msg}`);
    }

    function getCurrentPageFromDOM() {
        const pageEl = document.querySelector(config.currentPageEl);
        return pageEl ? parseInt(pageEl.innerText.trim(), 10) : 1;
    }

    function initColumnInfo() {
        const url = location.href;
        let type = '', id = '';

        if (config.urlRules.album.idReg.test(url)) {
            type = 'album';
            id = url.match(config.urlRules.album.idReg)[1];
        } else if (config.urlRules.series.idReg.test(url)) {
            type = 'series';
            id = url.match(config.urlRules.series.idReg)[1];
        } else if (/\/model\/id-([a-z0-9]+)\.html/.test(url)) {
            // 模特简介页，特殊处理
            id = url.match(/\/model\/id-([a-z0-9]+)\.html/)[1];
            injectModelWorks(id);
            return false;
        } else if (config.urlRules.model.idReg.test(url)) {
            type = 'model';
            id = url.match(config.urlRules.model.idReg)[1];
        } else {
            logTip('未识别页面类型');
            return false;
        }

        globalState.columnType = type;
        globalState.columnId = id;
        globalState.currentPage = getCurrentPageFromDOM();
        logTip(`已识别 ${type}-${id}，第 ${globalState.currentPage} 页`);
        return true;
    }

    function getNextUrl(page) {
        const pathTemplate = config.urlRules[globalState.columnType].pagePath;
        return pathTemplate.replace('{id}', globalState.columnId).replace('{page}', page);
    }

    async function loadSinglePage(page) {
        const url = getNextUrl(page);
        try {
            const res = await fetch(url, { credentials: 'same-origin' });
            if (!res.ok) throw new Error(`HTTP${res.status}`);
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const albums = doc.querySelectorAll(config.albumItem);
            if (albums.length === 0) {
                globalState.isLastPage = true;
                return { success: false };
            }
            const container = document.querySelector(config.albumContainer);
            albums.forEach(el => container.appendChild(el));
            return { success: true, count: albums.length };
        } catch (err) {
            logTip(`第${page}页失败: ${err.message}`);
            return { success: false };
        }
    }

    // 并发加载多页
    async function batchLoad() {
        if (globalState.isLoading || globalState.isLastPage) return;
        globalState.isLoading = true;

        const start = globalState.currentPage + 1;
        const end = start + config.scrollLoadPages - 1;
        const tasks = [];
        for (let p = start; p <= end; p++) {
            tasks.push(loadSinglePage(p).then(r => ({ r, p })));
        }

        const results = await Promise.all(tasks);
        for (const { r, p } of results) {
            if (r.success) {
                globalState.currentPage = Math.max(globalState.currentPage, p);
                logTip(`加载第${p}页 (${r.count}项)`);
            }
        }
        globalState.isLoading = false;
    }

    function onScroll() {
        if (globalState.isLoading || globalState.isLastPage) return;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const viewH = window.innerHeight;
        const totalH = document.documentElement.scrollHeight;
        if (scrollTop + viewH >= totalH - config.loadThreshold) {
            batchLoad();
        }
    }

    // 特殊处理：模特 id 页
    async function injectModelWorks(id) {
        const url = `/photos/model-${id}.html`;
        try {
            const res = await fetch(url, { credentials: 'same-origin' });
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const container = doc.querySelector(config.albumContainer);
            if (!container) return;

            const target = document.querySelector('.mod-info') || document.body;
            target.insertAdjacentElement('afterend', container);

            globalState.columnType = 'model';
            globalState.columnId = id;
            globalState.currentPage = 1;
            globalState.isLastPage = false;

            window.addEventListener('scroll', onScroll, { passive: true });
            logTip('已注入作品区，立即开始预加载');
            batchLoad(); // ✅ 立即预加载
        } catch (err) {
            logTip('抓取作品失败: ' + err.message);
        }
    }

    async function start() {
        if (!initColumnInfo()) return;
        window.addEventListener('scroll', onScroll, { passive: true });
        batchLoad(); // ✅ 一进入页面就先加载几页
    }

    start();
})();
