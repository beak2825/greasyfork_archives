// ==UserScript==
// @name         Bangumi 讨论区图片尺寸控制
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  图片悬停100%展开，修复顶部组件固定和遮挡问题
// @author       CHANG
// @match        *://bgm.tv/group/topic/*
// @match        *://bangumi.tv/group/topic/*
// @match        *://chii.in/group/topic/*
// @match        *://bgm.tv/rakuen/topic/*
// @match        *://bangumi.tv/rakuen/topic/*
// @match        *://chii.in/rakuen/topic/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560233/Bangumi%20%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/560233/Bangumi%20%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_WIDTH = '300px';

    const style = document.createElement('style');
style.innerHTML = `
        #sliderContainer{
            position: sticky !important;
            top: 0;
            z-index: 5 !important;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .compact-img {
            max-width: ${MAX_WIDTH} !important;
            height: auto !important;
            cursor: zoom-in;
            border: 1px solid #eee;
            margin: 8px 0;
            display: block;
            position: static !important;
            transition:
                max-width 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                box-shadow 0.3s ease,
                border-color 0.3s ease;
            border-radius: 4px;
        }
        .compact-img:hover {
            max-width: 100% !important;
            border-color: #3498db;
            box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }
        .reply_content, .topic_content {
            overflow: visible !important;
        }
    `;
    document.head.appendChild(style);

    const processImages = () => {
        const images = document.querySelectorAll('.reply_content img, .topic_content img');
        images.forEach(img => {
            if (img.src.includes('/img/smiles/') || img.classList.contains('compact-img')) return;
            img.classList.add('compact-img');

            // 阻止点击跳转行为
            img.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
            }, true);
        });
    };

    processImages();

    // 监听动态加载的内容
    const observer = new MutationObserver(processImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();