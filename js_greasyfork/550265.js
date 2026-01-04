// ==UserScript==
// @name         超星粘贴限制解除 (V2)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过轮询 UEditor 实例并清空 __allListeners.beforepaste 来解除粘贴限制。
// @author       NanCunChild
// @match        *://*.chaoxing.com/*
// @grant        none
// @license GPLv3
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550265/%E8%B6%85%E6%98%9F%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%20%28V2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550265/%E8%B6%85%E6%98%9F%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%20%28V2%29.meta.js
// ==/UserScript==

// 感谢相关UE资料，感谢 https://saltedfish.fun/index.php/archives/9 提供的思路。同时鄙视这个年代还在用UE的厂商，祝愿它们尽快被漏洞打似
// 还有NCC正在寻找轮询以外的其它方式，固定时间轮询无法同时照顾到电脑网速慢和嫌弃脚本占用资源卡顿的用户，所以如果能直接判定页面加载完毕是最好的。

(function() {
    'use strict';
    console.log('超星粘贴限制解除脚本 V4 (UEditor 实例轮询) 已激活...');

    let patchedEditors = {};

    const intervalId = setInterval(() => {
        if (typeof window.UE === 'object' && window.UE.instants) {
            let allPatched = true;
            for (const key in window.UE.instants) {
                if (patchedEditors[key]) {
                    continue;
                }
                const instance = window.UE.instants[key];
                if (instance && instance.__allListeners && instance.__allListeners.beforepaste) {
                    console.log(`检测到实例 [${key}] 上的 'beforepaste' 限制，正在移除...`);

                    // 这是核心，UE内部有个监听器，它不会管CX的外围js设置
                    instance.__allListeners.beforepaste = null;
                    console.log(`实例 [${key}] 的粘贴限制已解除。`);
                    patchedEditors[key] = true;
                } else if (instance) {
                    patchedEditors[key] = true;
                } else {
                    allPatched = false;
                }
            }
            if (allPatched && Object.keys(window.UE.instants).length > 0) {
                clearInterval(intervalId);
                console.log('所有已检测到的 UEditor 实例均已解除限制。');
            }
        }
    }, 500);

    setTimeout(() => {
        clearInterval(intervalId);
    }, 10000);

    // 以下为针对普通input标签和CX外围限制
    const intervalId2 = setInterval(() => {
        if (typeof window.pasteText === 'function' && window.pasteText.toString().includes("只能录入不能粘贴")) {
            console.log('检测到兜底函数 pasteText，准备重写...');
            window.pasteText = function() {
                console.log('NanCunChild：已成功拦截并放行 pasteText 粘贴操作！');
            };
            clearInterval(intervalId2);
            console.log('pasteText 函数重写完成。');
        }
    }, 500);
     setTimeout(() => {
        clearInterval(intervalId2);
    }, 10000);
})();