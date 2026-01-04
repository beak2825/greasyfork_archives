// ==UserScript==
// @name         SimpCity/Social Media Girls direct image link & Compact Thumbs
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Click thumbnail to show big image. Optional default load of big images. / 点击缩略图显示大图，可选默认加载全部大图
// @match        https://simpcity.cr/*
// @match        https://forums.socialmediagirls.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548505/SimpCitySocial%20Media%20Girls%20direct%20image%20link%20%20Compact%20Thumbs.user.js
// @updateURL https://update.greasyfork.org/scripts/548505/SimpCitySocial%20Media%20Girls%20direct%20image%20link%20%20Compact%20Thumbs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- Language detection / 语言检测 ----------
    const lang = navigator.language.toLowerCase();
    const isZh = lang.startsWith('zh'); // zh开头认为中文 / Chinese

    // ---------- User settings / 用户设置 ----------
    let LOAD_BIG_ON_START = GM_getValue('LOAD_BIG_ON_START', false);

    // ---------- Register menu command / 注册菜单命令 ----------
    GM_registerMenuCommand(
        isZh
          ? `默认加载全部大图: ${LOAD_BIG_ON_START ? '开' : '关'} (点击切换)`
          : `Load all big images by default: ${LOAD_BIG_ON_START ? 'ON' : 'OFF'} (click to toggle)`,
        () => {
            LOAD_BIG_ON_START = !LOAD_BIG_ON_START;
            GM_setValue('LOAD_BIG_ON_START', LOAD_BIG_ON_START);
            alert(isZh
                ? `默认加载全部大图已设置为: ${LOAD_BIG_ON_START ? '开' : '关'}，请刷新页面生效`
                : `Default load of all big images is now: ${LOAD_BIG_ON_START ? 'ON' : 'OFF'}. Please refresh the page to apply.`);
        }
    );

    // ---------- Styles / 样式 ----------
    const style = document.createElement('style');
    style.textContent = `
      img.bbImage {
        cursor: pointer;  /* 鼠标指针为手型 / cursor pointer */
        transition: all 0.2s ease-in-out;
        display: inline-block; /* 横向排列 / inline layout */
        max-width: 200px;  /* 缩略图显示宽度 / thumbnail width */
        height: auto;
        margin: 2px;
      }
      img.bbImage.expanded {
        display: block;      /* 展开时独占一行 / block layout */
        max-width: 100% !important;
        max-height: 90vh;    /* 最大高度 / max height */
        margin: 8px auto;
      }
    `;
    document.head.appendChild(style);

    // ---------- Utility functions / 工具函数 ----------
    function cleanName(str) {
        return str.replace('.md', '').replace('.th', ''); // 去掉 .md / .th
    }
    function getBigUrl(src) {
        return src.replace('.md.', '.').replace('.th.', '.'); // md.jpg / th.webp → jpg / webp
    }

    // ---------- Initialize / 页面加载时替换缩略图 ----------
    function replaceAllThumbs() {
        document.querySelectorAll('img.bbImage').forEach(img => {
            const src = img.src.toLowerCase();
            if (
                !src.includes('.md.jpg') &&
                !src.includes('.md.webp') &&
                !src.includes('.th.jpg') &&
                !src.includes('.th.webp')
            ) return;

            const a = img.closest('a.link--external');
            if (LOAD_BIG_ON_START) {
                // 默认加载大图 / load big image by default
                img.src = getBigUrl(img.src);
                img.removeAttribute('srcset');
                if (img.title) img.title = cleanName(img.title);
                if (img.alt) img.alt = cleanName(img.alt);
                if (a) a.removeAttribute('href');
            } else {
                // 保持缩略图显示 / keep thumbnail layout
                if (img.title) img.title = cleanName(img.title);
                if (img.alt) img.alt = cleanName(img.alt);
            }
        });
    }

    // ---------- Click event / 点击切换大小 ----------
    document.body.addEventListener('click', function(event) {
        const img = event.target.closest('img.bbImage');
        if (!img) return;
        event.preventDefault();

        if (img.classList.contains('expanded')) {
            // 大图 → 缩回 / collapse big image
            img.classList.remove('expanded');
        } else {
            // 小图 → 展开 / expand big image
            img.classList.add('expanded');
            if (!img.dataset.bigLoaded) {
                img.dataset.bigLoaded = 'true';
                img.src = getBigUrl(img.src);
                img.removeAttribute('srcset');
            }
        }
    }, false);

    // ---------- Initial execution / 首次执行 ----------
    replaceAllThumbs();

    // ---------- Mutation observer for lazy-loaded content / 懒加载监听 ----------
    const observer = new MutationObserver(() => replaceAllThumbs());
    observer.observe(document.body, { childList: true, subtree: true });

})();
