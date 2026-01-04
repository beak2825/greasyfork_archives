// ==UserScript==
// @name        XDF协议页面水印消除
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description 持续监控并清除新东方协议签订页面的水印
// @author      wujinjun
// @license     MIT
// @match       *://91net.xdf.cn/sales/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/550571/XDF%E5%8D%8F%E8%AE%AE%E9%A1%B5%E9%9D%A2%E6%B0%B4%E5%8D%B0%E6%B6%88%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/550571/XDF%E5%8D%8F%E8%AE%AE%E9%A1%B5%E9%9D%A2%E6%B0%B4%E5%8D%B0%E6%B6%88%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 如果是属性变化，并且变化的是 'style' 属性
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const targetElement = mutation.target;
                // 检查被修改的元素是否是我们的目标元素
                if (targetElement && targetElement.matches('#agreement_web1')) {
                    // 移除 style 属性
                    targetElement.removeAttribute('style');
                    console.log('再次清除 #agreement_web1 的 style 属性。');
                }
            }
        });
    });

    // 配置观察器
    const config = {
        attributes: true, // 观察属性的变化
        attributeFilter: ['style'], // 只观察 'style' 属性
        subtree: true, // 观察所有子节点
    };

    // 开始观察整个文档的 body 元素
    observer.observe(document.body, config);

    // 初始执行一次，以防元素在脚本加载时已经存在 style
    const initialElement = document.querySelector('#agreement_web1');
    if (initialElement) {
        initialElement.removeAttribute('style');
        console.log('初始清除 #agreement_web1 的 style 属性。');
    }

})();