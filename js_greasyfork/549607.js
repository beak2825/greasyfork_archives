// ==UserScript==
// @name         DeepSeek自动重试功能 (Jianggua)
// @namespace    http://tampermonkey.net/
// @version      0.73
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @description  DeepSeek自动重试功能
// @author       jianggua
// @match        https://chat.deepseek.com/*
// @match        https://chat.deepseek.ai/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549607/DeepSeek%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%E5%8A%9F%E8%83%BD%20%28Jianggua%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549607/DeepSeek%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95%E5%8A%9F%E8%83%BD%20%28Jianggua%29.meta.js
// ==/UserScript==
(function() {
'use strict';
console.log('简化脚本已载入');
const config = {
    scanInterval: 2000,
    maxAttempts: 10
};

let attemptCount = 0;
let intervalId;

// 目标SVG的路径数据特征
const targetSvgPath = "M1.27209 6.21355C1.70654 3.08895 4.59178 0.908133 7.71643 1.34246C8.95505 1.51476 10.0438 2.07338 10.8815 2.87761L11.9459 1.81414C12.1348 1.62557 12.4573 1.75918 12.4576 2.02605V5.08758C12.4574 5.25309 12.3234 5.38738 12.1578 5.38738H9.09729C8.83002 5.38738 8.69639 5.06367 8.88538 4.87468L10.0328 3.72625C9.37329 3.10001 8.52015 2.66575 7.55139 2.53093C5.08323 2.18786 2.80385 3.9105 2.46057 6.37859C2.11756 8.84671 3.84018 11.1261 6.30823 11.4694C8.77621 11.8122 11.0558 10.0897 11.399 7.62176L11.9938 7.70379L12.5875 7.78679C12.1531 10.9112 9.26766 13.0919 6.14319 12.6579C3.01863 12.2234 0.837829 9.33816 1.27209 6.21355Z";

function findTargetSvg() {
    const allSvgs = document.querySelectorAll('svg');

    for (const svg of allSvgs) {
        if (svg.getAttribute('width') === '14' &&
            svg.getAttribute('height') === '14' &&
            svg.getAttribute('viewBox') === '0 0 14 14') {

            const paths = svg.querySelectorAll('path');
            for (const path of paths) {
                if (path.getAttribute('d') === targetSvgPath &&
                    path.getAttribute('fill') === 'currentColor') {
                    return svg;
                }
            }
        }
    }
    return null;
}

function findParentFromSvg(svgElement) {
    let currentElement = svgElement;

    while (currentElement && currentElement !== document.body) {
        if (currentElement.id === 'root') {
            return currentElement;
        }

        if (currentElement.getAttribute('role') === 'button' ||
            currentElement.tagName === 'BUTTON' ||
            (currentElement.classList &&
             Array.from(currentElement.classList).some(cls => cls.includes('btn') || cls.includes('button')))) {
            return currentElement;
        }

        currentElement = currentElement.parentElement;
    }

    return null;
}

// 查找并点击重新生成按钮
function findAndClickRegenerate() {
    attemptCount++;

    // 查找目标SVG
    const targetSvg = findTargetSvg();
    if (!targetSvg) {
        return false;
    }

    // 从SVG向上查找父元素
    const targetElement = findParentFromSvg(targetSvg);
    if (!targetElement) {
        return false;
    }

    // 模拟点击
    setTimeout(() => {
        targetElement.click();
    }, 300);
    return true;
}

function startScanning() {
    if (findAndClickRegenerate()) {
        clearInterval(intervalId);
    } else if (attemptCount >= config.maxAttempts) {
        clearInterval(intervalId);
    }
}

function initObserver() {
    const observer = new MutationObserver(() => {
        clearInterval(intervalId);
        attemptCount = 0;
        intervalId = setInterval(startScanning, config.scanInterval);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
    intervalId = setInterval(startScanning, config.scanInterval);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
} else {
    setTimeout(initObserver, 1000);
}

})();