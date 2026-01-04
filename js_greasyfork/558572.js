// ==UserScript==
// @name               淘宝未登录搜索重定向到 uland
// @name:en            Taobao Unlogged Search Redirect to uland
// @name:zh-CN         淘宝未登录搜索重定向到 uland
// @name:zh-TW         淘寶未登入搜尋導向 uland

// @description        未登录时访问淘宝搜索页，将搜索请求重定向到 uland.taobao.com 并自动带上 keyword 参数。
// @description:en     Redirect Taobao search to uland.taobao.com when user is not logged in.
// @description:zh-CN  未登录访问淘宝搜索页时自动跳转到 uland.taobao.com，并保留搜索 keyword。
// @description:zh-TW  未登入訪問淘寶搜尋頁時自動導向 uland.taobao.com，並保留搜尋 keyword。

// @namespace          https://github.com/strangeZombies/PractiseCode
// @supportURL         https://github.com/strangeZombies/PractiseCode/issues

// @author             strangeZombies@github.com
// @version            2025.12.10.0

// @match              *://*.taobao.com/*
// @match              *://s.taobao.com/*
// @match              *://*.tmall.com/*
// @grant              none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/558572/%E6%B7%98%E5%AE%9D%E6%9C%AA%E7%99%BB%E5%BD%95%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20uland.user.js
// @updateURL https://update.greasyfork.org/scripts/558572/%E6%B7%98%E5%AE%9D%E6%9C%AA%E7%99%BB%E5%BD%95%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20uland.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 不在 uland 域名下才处理，避免循环重定向
    if (location.hostname.includes('uland.taobao.com')) return;

    // 仅对可能是搜索页面的 URL 进行处理：
    // 常见淘宝搜索域： s.taobao.com? or taobao.com/search 或带 q 参数
    const isSearchPage = (() => {
        const host = location.hostname;
        const p = location.pathname || '';
        const qs = new URLSearchParams(location.search);

        if (host.includes('s.taobao.com')) return true;
        if (p.includes('/search') || p.includes('/s') || p.includes('/search.htm')) return true;
        // 如果 URL 中有 q 或 keyword 参数也认为是搜索
        if (qs.has('q') || qs.has('keyword') || qs.has('search')) return true;
        return false;
    })();

    if (!isSearchPage) return;

    // 判断是否未登录：页面上是否含有“登录”或“请登录”之类的入口（中文）
    // 这是一个启发式判断：若页面包含明显的登录入口，认为未登录
    function appearsNotLoggedIn() {
        const docText = document.documentElement.innerText || '';
        // 查找页面顶部常见登录链接文本
        const loginAnchors = Array.from(document.querySelectorAll('a,button,span'));
        for (const el of loginAnchors) {
            const txt = (el.textContent || '').trim();
            if (!txt) continue;
            if (txt === '登录' || txt === '请登录' || txt === '亲，请登录') {
                // 如果这个元素是链接或可点击的登录入口，认定为未登录
                return true;
            }
        }
        // 兜底：如果页面文本中出现 "请登录"、"登录后可见" 之类提示，也认为未登录
        if (/\b请登录\b|\b登录\b|\b请先登录\b/.test(docText)) return true;

        // 否则默认认为已登录（保守策略）
        return false;
    }

    if (!appearsNotLoggedIn()) return;

    // 提取搜索关键词（按优先级：URL 参数 q/keyword/search -> 搜索框 input[name=q] 等 -> 从页面文本解析）
    function extractKeyword() {
        const qs = new URLSearchParams(location.search);
        let key = qs.get('q') || qs.get('keyword') || qs.get('search') || '';
        if (key) return key;

        // 常见搜索框 name 或 id
        const candidates = [
            "input[name='q']",
            "input[name='keyword']",
            "input#q",
            "input[type='search']",
            "input[class*='search']"
        ];
        for (const sel of candidates) {
            const el = document.querySelector(sel);
            if (el && el.value && el.value.trim()) return el.value.trim();
        }

        // 从页面的 meta 或标题尝试取词（不可靠）
        const title = (document.title || '').trim();
        // 如果标题里包含搜索关键词（如 "关键字 - 淘宝"）
        const match = title.match(/(.+?)\s*-?\s*淘宝/);
        if (match && match[1]) return match[1].trim();

        return '';
    }

    const keyword = extractKeyword();
    if (!keyword) return; // 没关键词就不重定向，避免破坏体验

    // 构造目标 URL（使用 http://uland.taobao.com/sem/tbsearch?keyword=...）
    // 如果你想使用 https，请把下面的 scheme 改为 https
    const target = 'http://uland.taobao.com/sem/tbsearch?keyword=' + encodeURIComponent(keyword);

    // 立即重定向（替换历史，避免回退循环）
    location.replace(target);

})();
