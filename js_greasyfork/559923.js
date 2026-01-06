// ==UserScript==
// @name           豆瓣电影 · 资源搜索
// @namespace      https://github.com/garinasset/DoubanMovieResourceLinks
// @version        3.0.0
//
// @description    在“豆瓣电影”页面信息栏，添加相应“电影”的“第三方资源搜索”链接，例如海盗湾等，点击即可跳转到对应电影的第三方资源搜索结果页面，便利”资源“搜索。
//
// @author         garinasset
// @license        MIT
//
// @homepageURL    https://github.com/garinasset/DoubanMovieResourceLinks
// @supportURL     https://github.com/garinasset/DoubanMovieResourceLinks/issues
//
// @match          https://movie.douban.com/subject/*
// @run-at         document-end
// @noframes
//
// @grant          none
//
// @connect        thepiratebay.org
// @connect        dytt8899.com
//
// @downloadURL https://update.greasyfork.org/scripts/559923/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%C2%B7%20%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/559923/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%C2%B7%20%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) return; // 防 iframe
    const UNIQUE_KEY = '__doubanMovieResourceLinks_initialized_v5';
    if (window[UNIQUE_KEY]) return;
    window[UNIQUE_KEY] = true;

    /** =========================
     * 资源配置表（统一传入 imdbId, cnTitle, year）
     * href: 返回 URL
     * onClick: JS 点击事件，优先于 href
     * ========================= */
    const RESOURCES = [
        {
            name: '海盗湾',
            favicon: 'https://thepiratebay.org/favicon.ico',
            href: (imdbId, cnTitle, year) => `https://thepiratebay.org/search.php?q=${imdbId}`,
            className: 'hdw'
        },
        {
            name: '电影天堂',
            favicon: 'https://www.dytt8899.com/favicon.ico',
            onClick: (imdbId, cnTitle, year) => openDyttSearch(cnTitle),
            className: 'dytt'
        },
        {
            name: '伪·射手网',
            favicon: 'https://assrt.net/favicon.ico',
            href: (imdbId, cnTitle, year) => `https://assrt.net/sub/?searchword=${encodeURIComponent(cnTitle)}${year ? '+' + year : ''}`,
            className: 'shooter'
        }
    ];

    /** =========================
     * 样式生成
     * ========================= */
    (function addResourceIconStyle() {
        const style = document.createElement('style');
        let cssText = `
            .tm-douban-resource__container { white-space: nowrap; }
            .tm-douban-resource__link {
                position: relative; display: inline-flex; align-items: center;
                padding-left: 18px; line-height: 1.2; vertical-align: middle; text-decoration: none;
            }
            .tm-douban-resource__link::before {
                content: ""; position: absolute; left: 1px; top: 50%;
                transform: translateY(-50%); width: 14px; height: 14px;
                background-repeat: no-repeat; background-size: contain; pointer-events: none;
            }
        `;
        RESOURCES.forEach(res => {
            const cls = res.className || res.name.toLowerCase();
            cssText += `
                .tm-douban-resource__link--${cls}::before {
                    background-image: url("${res.favicon}");
                }
            `;
        });
        style.textContent = cssText;
        document.head.appendChild(style);
    })();

    /** =========================
     * 工具函数
     * ========================= */
    function getCleanChineseTitle() {
        const title = document.title || '';
        return title.replace(/\s*\(豆瓣\)\s*$/, '').trim();
    }

    function getYear() {
        const yearSpan = document.querySelector('#content h1 > .year');
        const match = yearSpan?.textContent.trim().match(/\((\d{4})\)/);
        return match ? match[1] : '';
    }

    function openDyttSearch(keyword) {
        const form = document.createElement('form');
        form.action = 'https://www.dytt8899.com/e/search/index.php';
        form.method = 'POST';
        form.target = '_blank';
        form.acceptCharset = 'gb2312';
        const fields = { keyboard: keyword, show: 'title,smalltext', tempid: '1', classid: '0' };
        Object.entries(fields).forEach(([k, v]) => {
            const input = document.createElement('input');
            input.type = 'hidden'; input.name = k; input.value = v;
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit(); form.remove();
    }

    /** =========================
     * 插入资源链接
     * ========================= */
    function insertLinks() {
        const info = document.querySelector('#info');
        if (!info || info.querySelector('.tm-douban-resource__container')) return false;

        const imdbLabel = Array.from(info.querySelectorAll('span.pl'))
            .find(span => span.textContent.trim() === 'IMDb:');
        if (!imdbLabel) return false;

        const imdbTextNode = imdbLabel.nextSibling;
        if (!imdbTextNode || imdbTextNode.nodeType !== Node.TEXT_NODE) return false;

        const imdbId = imdbTextNode.textContent.trim();
        if (!/^tt\d+$/.test(imdbId)) return false;

        const cnTitle = getCleanChineseTitle() || '';
        const year = getYear() || '';

        const container = document.createElement('span');
        container.className = 'tm-douban-resource__container';
        let html = '<span class="pl">磁力资源:</span>';

        RESOURCES.forEach((res, idx) => {
            const cls = res.className || res.name.toLowerCase();
            if (res.href) {
                html += `
                    <a class="tm-douban-resource__link tm-douban-resource__link--${cls}"
                       href="${res.href(imdbId, cnTitle, year)}"
                       target="_blank" rel="noopener noreferrer">${res.name}</a>`;
            } else if (res.onClick) {
                html += `
                    <a href="javascript:void(0);"
                       class="tm-douban-resource__link tm-douban-resource__link--${cls} tm-douban-resource__action-${cls}">${res.name}</a>`;
            }
            if (idx < RESOURCES.length - 1) html += '&nbsp;/&nbsp;';
        });

        container.innerHTML = html;

        // 绑定点击事件
        RESOURCES.forEach(res => {
            if (res.onClick) {
                const cls = res.className || res.name.toLowerCase();
                container.querySelector(`.tm-douban-resource__action-${cls}`)
                    .addEventListener('click', () => res.onClick(imdbId, cnTitle, year));
            }
        });

        const br = document.createElement('br');
        const imdbBr = imdbTextNode.nextSibling;
        if (imdbBr && imdbBr.tagName === 'BR') imdbBr.after(container, br);
        else info.append(container, br);

        return true;
    }

    /** =========================
     * 等待 DOM (SPA 兼容)
     * ========================= */
    function waitForInfo() {
        if (insertLinks()) return;
        const observer = new MutationObserver(() => { if (insertLinks()) observer.disconnect(); });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { insertLinks(); observer.disconnect(); }, 3000);
    }

    waitForInfo();
})();

