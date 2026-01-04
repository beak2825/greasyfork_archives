// ==UserScript==
// @name         漫画柜&拷贝漫画搜索按钮（mox.moe + bgm.tv 兼容版）
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在mox.moe和bgm.tv页面添加去漫画柜和拷贝漫画搜索按钮，新标签页打开，点击标题可复制内容（bgm按钮放在大标题后的分类标签后面）
// @author       YourName
// @match        https://mox.moe/c/*
// @match        https://bgm.tv/subject/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550963/%E6%BC%AB%E7%94%BB%E6%9F%9C%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%EF%BC%88moxmoe%20%2B%20bgmtv%20%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550963/%E6%BC%AB%E7%94%BB%E6%9F%9C%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%EF%BC%88moxmoe%20%2B%20bgmtv%20%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {
        let titleElement = null;
        let mangaTitle = '';

        // mox.moe 获取逻辑
        if (location.host.includes('mox.moe')) {
            titleElement = document.querySelector('.text_bglight_big');
            if (titleElement) {
                mangaTitle = titleElement.textContent.trim();
            }
        }

        // bgm.tv 获取逻辑
        if (location.host.includes('bgm.tv')) {
            const firstLi = document.querySelector('#infobox li');
            if (firstLi) {
                // span在前，取它后面的文本
                mangaTitle = firstLi.childNodes[firstLi.childNodes.length - 1].textContent.trim();
            }
        }

        if (mangaTitle) {
            // 通用按钮样式
            function createButton(text, bgColor) {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.style.marginLeft = '10px';
                btn.style.padding = '5px 10px';
                btn.style.backgroundColor = bgColor;
                btn.style.color = 'white';
                btn.style.border = 'none';
                btn.style.borderRadius = '4px';
                btn.style.cursor = 'pointer';
                return btn;
            }

            // 漫画柜搜索按钮
            const searchButton1 = createButton('去漫画柜搜索', '#005CAF');
            searchButton1.addEventListener('click', function () {
                const encodedTitle = encodeURIComponent(mangaTitle);
                window.open(`https://www.manhuagui.com/s/${encodedTitle}.html`, '_blank');
            });

            // 拷贝漫画搜索按钮
            const searchButton2 = createButton('去拷贝漫画搜索', '#AF005C');
            searchButton2.addEventListener('click', function () {
                const encodedTitle = encodeURIComponent(mangaTitle);
                window.open(`https://www.mangacopy.com/search?q=${encodedTitle}`, '_blank');
            });

            // 点击复制标题功能
            function enableCopy(element) {
                element.style.cursor = 'pointer';
                element.title = '点击复制标题';
                element.addEventListener('click', async function () {
                    try {
                        await navigator.clipboard.writeText(mangaTitle);
                        console.log('已复制:', mangaTitle);
                    } catch (err) {
                        console.error('复制失败: ', err);
                    }
                });
            }

            if (location.host.includes('mox.moe') && titleElement) {
                enableCopy(titleElement);
                // 插入按钮到标题后面
                titleElement.parentNode.insertBefore(searchButton1, titleElement.nextSibling);
                titleElement.parentNode.insertBefore(searchButton2, searchButton1.nextSibling);
            }

            if (location.host.includes('bgm.tv')) {
                const h1 = document.querySelector('#headerSubject h1.nameSingle');
                if (h1) {
                    const lastSmall = h1.querySelector('small:last-of-type');
                    if (lastSmall) {
                        // 按钮插在最后一个 small 的后面
                        lastSmall.insertAdjacentElement('afterend', searchButton1);
                        searchButton1.insertAdjacentElement('afterend', searchButton2);
                    }
                }
            }
        }
    });
})();
