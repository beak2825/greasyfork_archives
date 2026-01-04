// ==UserScript==
// @name           豆瓣电影 · 资源搜索
// @namespace      https://github.com/garinasset/DoubanMovieResourceLinks
// @version        2.2.2
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

    // 防止在 iframe 中运行（许多页面和广告会在若干 iframe 中加载，导致脚本多次实例化）
    if (window.top !== window.self) {
        console.log('[DoubanResource] Running inside an iframe; aborting initialization.');
        return;
    }

    // 唯一初始化标志：避免同一页面/窗口中重复执行初始化（比如 SPA 导航或 Tampermonkey 的重复注入）
    const UNIQUE_KEY = '__doubanMovieResourceLinks_initialized_v3';
    if (window[UNIQUE_KEY]) {
        console.log('[DoubanResource] Already initialized; aborting duplicate run.');
        return;
    }
    window[UNIQUE_KEY] = true;

    /** =========================
     * 样式：资源链接 icon（::before 方案）
     * -------------------------
     * 说明：新增注释以增强语义，便于他人维护
     * ========================= */
    (function addResourceIconStyle() {
        console.log('[DoubanResource] Adding resource icon styles...');
        const style = document.createElement('style');
        style.textContent = `
            /* ===== 容器 ===== */
            .tm-douban-resource__container {
                white-space: nowrap;
            }

            /* ===== 通用资源链接 ===== */
            .tm-douban-resource__link {
                position: relative;
                display: inline-flex;
                align-items: center;
                padding-left: 18px;      /* icon 占位 */
                line-height: 1.2;        /* 收紧 hover 背景高度 */
                vertical-align: middle;  /* 行内对齐更稳定 */
                text-decoration: none;
            }

            /* icon 通用规则 */
            .tm-douban-resource__link::before {
                content: "";
                position: absolute;
                left: 1px;               /* 稳定 1px 间距 */
                top: 50%;
                transform: translateY(-50%);
                width: 14px;
                height: 14px;
                background-repeat: no-repeat;
                background-size: contain;
                pointer-events: none;
            }

            /* ===== 海盗湾 ===== */
            .tm-douban-resource__link--hdw::before {
                background-image: url("https://icon.horse/icon/www.thepiratebay.org");
            }

            /* ===== 电影天堂 ===== */
            .tm-douban-resource__link--dytt::before {
                background-image: url("https://icon.horse/icon/dytt8899.com");
            }
        `;
        document.head.appendChild(style);
        console.log("Resource icon styles added.");
    })();

    /** =========================
     * 工具函数（增加注释说明每个函数的职责）
     * ========================= */

    // 获取页面标题中的中文名（去掉尾部 "(豆瓣)"）
    function getCleanChineseTitle() {
        console.log('[DoubanResource] Extracting Chinese title...');
        const title = document.title || '';
        const cleanedTitle = title.replace(/\s*\(豆瓣\)\s*$/, '').trim();
        console.log("Cleaned Chinese title:", cleanedTitle);
        return cleanedTitle;
    }

    // 使用 POST 表单以 gb2312 编码提交搜索（电影天堂）
    function openDyttSearch(keyword) {
        console.log('[DoubanResource] Opening Dytt search for:', keyword);
        const form = document.createElement('form');
        form.action = 'https://www.dytt8899.com/e/search/index.php';
        form.method = 'POST';
        form.target = '_blank';
        form.acceptCharset = 'gb2312';

        const fields = {
            keyboard: keyword,
            show: 'title,smalltext',
            tempid: '1',
            classid: '0'
        };

        for (const name in fields) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = fields[name];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        form.remove();
        console.log("Search form submitted for:", keyword);
    }

    // 在信息栏插入资源链接（若未插入）
    function insertLinks() {
        console.log('[DoubanResource] Checking for IMDb ID and inserting links...');
        const info = document.querySelector('#info');
        if (!info) {
            console.log("Info element not found.");
            return false;
        }

        // 防重复
        if (info.querySelector('.tm-douban-resource__container')) {
            console.log("Links already inserted, skipping.");
            return true;
        }

        /** ===== IMDb ===== */
        const imdbLabel = Array.from(info.querySelectorAll('span.pl'))
            .find(span => span.textContent.trim() === 'IMDb:');

        if (!imdbLabel) {
            console.log("IMDb label not found.");
            return false;
        }

        const imdbTextNode = imdbLabel.nextSibling;
        if (!imdbTextNode || imdbTextNode.nodeType !== Node.TEXT_NODE) {
            console.log("IMDb ID is not a text node.");
            return false;
        }

        const imdbId = imdbTextNode.textContent.trim();
        console.log("Found IMDb ID:", imdbId);

        if (!/^tt\d+$/.test(imdbId)) {
            console.log("Invalid IMDb ID:", imdbId);
            return false;
        }

        /** ===== 中文名 ===== */
        const cnTitle = getCleanChineseTitle();
        if (!cnTitle) {
            console.log("Chinese title is empty.");
            return false;
        }

        /** ===== 创建 DOM ===== */
        const container = document.createElement('span');
        container.className = 'tm-douban-resource__container';
        container.innerHTML = `
            <span class="pl">磁力资源:</span>
            <a class="tm-douban-resource__link tm-douban-resource__link--hdw"
               href="https://thepiratebay.org/search.php?q=${imdbId}"
               target="_blank" rel="noopener noreferrer">
               海盗湾
            </a>
            &nbsp;/&nbsp;
            <a href="javascript:void(0);"
               class="tm-douban-resource__link tm-douban-resource__link--dytt tm-douban-resource__action-dytt">
               电影天堂
            </a>
        `;

        container
            .querySelector('.tm-douban-resource__action-dytt')
            .addEventListener('click', () => openDyttSearch(cnTitle));

        const br = document.createElement('br');
        const imdbBr = imdbTextNode.nextSibling;

        if (imdbBr && imdbBr.tagName === 'BR') {
            imdbBr.after(container, br);
        } else {
            info.append(container, br);
        }

        // 最后插入成功日志
        console.log('[DoubanResource] Resource links inserted.');
        return true;
    }

    /** =========================
     * 等待 DOM（豆瓣 SPA）
     * -------------------------
     * 说明：用 MutationObserver 监听 DOM 变化以兼容 SPA；已保证 observer 只在单次初始化中创建
     * ========================= */

    function waitForInfo() {
        console.log('[DoubanResource] Waiting for DOM to load...');
        if (insertLinks()) return;

        const observer = new MutationObserver(() => {
            console.log('[DoubanResource] Mutation detected.');
            if (insertLinks()) observer.disconnect();
        });

        // 监控 body 子树的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 最终容错：若 observer 未捕获到，3s 后再尝试一次并断开 observer
        setTimeout(() => {
            insertLinks();
            observer.disconnect();
        }, 3000);
    }

    waitForInfo();
})();



