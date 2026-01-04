// ==UserScript==
// @name         七味去广告
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @author       Sturbine
// @description  qiwei
// @match        https://www.qwavi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qwavi.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548449/%E4%B8%83%E5%91%B3%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/548449/%E4%B8%83%E5%91%B3%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找并删除底部固定广告元素的函数
    function removeBottomAdElement() {
        // 获取页面所有div元素
        const allDivs = document.querySelectorAll('div');

        for (const div of allDivs) {
            // 检查元素样式是否符合广告特征
            const style = window.getComputedStyle(div);
            if (style.position === 'fixed' &&
                (style.bottom === '0px' || style.top === '0px') &&
                (style.right === '0px' || style.left === '0px') &&
                div.offsetWidth > 200 && div.offsetHeight > 150) {

                // 进一步检查内部结构特征
                const closeBtn = div.querySelector('img[onclick*="close"]');
                const adLink = div.querySelector('a[href*="evewan.com"]');

                if (closeBtn || adLink) {
                    console.log('发现底部广告元素，正在删除...', div);
                    div.remove();
                    return true;
                }
            }
        }
        return false;
    }

    // 查找并删除动态ID广告元素的函数
    function removeDynamicAdElement() {
        // 查找所有具有固定位置的div元素
        const allDivs = document.querySelectorAll('div');
        let removed = false;

        for (const div of allDivs) {
            // 检查元素样式是否符合广告特征
            const style = window.getComputedStyle(div);
            const isFixed = style.position === 'fixed';
            const isAbsolute = style.position === 'absolute';

            if ((isFixed || isAbsolute) &&
                (div.offsetWidth > 200 || div.offsetHeight > 150)) {

                // 检查ID特征 - 以特定后缀结尾
                const id = div.getAttribute('id') || '';

                // 检查内部结构特征
                const hasEvewanLink = div.querySelector('a[href*="evewan.com"]');
                const hasCloseImage = div.querySelector('img[onclick*="close"]');
                const hasGifImage = div.querySelector('img[src*=".gif"]');

                // 检查样式特征
                const hasHighZIndex = style.zIndex === '2147483646' || style.zIndex === '2147483647';
                const isLeftOrRightPositioned = style.left === '0px' || style.right === '0px';

                if ((id.endsWith('left') || id.endsWith('right') || id.endsWith('top') || id.endsWith('bottom')) &&
                    (hasEvewanLink || hasCloseImage || hasGifImage || hasHighZIndex || isLeftOrRightPositioned)) {

                    console.log('发现动态ID广告元素，正在删除...', div);
                    div.remove();
                    removed = true;
                    continue;
                }
            }
        }
        return removed;
    }

    // 删除第二个class为main的div
    function removeSecondMainDiv() {
        const mainDivs = document.querySelectorAll('div.main');
        if (mainDivs.length >= 2) {
            console.log('找到第二个main类div，正在删除...', mainDivs[1]);
            mainDivs[1].remove();
            return true;
        }
        return false;
    }

    // 执行所有删除操作的函数
    function performDeletions() {
        const bottomAdRemoved = removeBottomAdElement();
        const dynamicAdRemoved = removeDynamicAdElement();
        const mainDivRemoved = removeSecondMainDiv();

        return bottomAdRemoved || dynamicAdRemoved || mainDivRemoved;
    }

    // 页面加载时立即执行一次
    if (performDeletions()) {
        console.log('元素删除操作已完成');
    }

    // 监听DOM变化，防止广告动态加载
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        shouldCheck = true;
                        break;
                    }
                }
            }
        }

        if (shouldCheck) {
            // 给新添加的元素一点时间渲染
            setTimeout(performDeletions, 100);
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加一个定时器，定期检查是否有新广告出现
    setInterval(performDeletions, 3000);

    // 监听页面完全加载后再次执行
    window.addEventListener('load', function() {
        setTimeout(performDeletions, 1000);
    });
})();