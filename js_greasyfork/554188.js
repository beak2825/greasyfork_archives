// ==UserScript==
// @name         隐藏ivx预览水印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在ivx项目页面上隐藏特定位置的图片元素
// @author       Ofe1
// @match        *://*.h5app.com/*
// @match        *://h5app.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554188/%E9%9A%90%E8%97%8Fivx%E9%A2%84%E8%A7%88%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/554188/%E9%9A%90%E8%97%8Fivx%E9%A2%84%E8%A7%88%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideTargetImage() {
        // 查找符合特定条件的图片元素
        const targetImg = document.querySelector('img[src="//file3.ih5.cn/v35/files/09e4a549cc09c9dae066af03901b5113_4405_333_333.png"]');

        if (targetImg) {
            // 直接隐藏图片元素
            targetImg.style.display = 'none';
            console.log('已成功隐藏ivx目标图片元素');
            return true;
        }
        return false;
    }

    // 立即尝试隐藏
    if (hideTargetImage()) {
        return;
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {
        hideTargetImage();
    });

    // 使用 MutationObserver 监听动态加载的元素
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) { // 元素节点
                    if (node.tagName === 'IMG' && node.src.includes('09e4a549cc09c9dae066af03901b5113_4405_333_333.png')) {
                        node.style.display = 'none';
                        console.log('通过 MutationObserver 隐藏ivx目标图片元素');
                        return;
                    }

                    // 检查子元素中的图片
                    const imgs = node.querySelectorAll('img');
                    for (let img of imgs) {
                        if (img.src.includes('09e4a549cc09c9dae066af03901b5113_4405_333_333.png')) {
                            img.style.display = 'none';
                            console.log('通过 MutationObserver 隐藏ivx目标图片元素（子元素）');
                            return;
                        }
                    }
                }
            }
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 额外设置一个定时器，确保捕获动态加载的元素
    let checkCount = 0;
    const maxChecks = 10;
    const interval = setInterval(() => {
        if (hideTargetImage() || checkCount >= maxChecks) {
            clearInterval(interval);
        }
        checkCount++;
    }, 500);
})();