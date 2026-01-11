// ==UserScript==
// @name         网页护眼：红光清晰/蓝绿模糊滤镜
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  利用SVG滤镜分离通道，对绿蓝通道应用高斯模糊，模拟近视防控原理
// @author       Gemini
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562191/%E7%BD%91%E9%A1%B5%E6%8A%A4%E7%9C%BC%EF%BC%9A%E7%BA%A2%E5%85%89%E6%B8%85%E6%99%B0%E8%93%9D%E7%BB%BF%E6%A8%A1%E7%B3%8A%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/562191/%E7%BD%91%E9%A1%B5%E6%8A%A4%E7%9C%BC%EF%BC%9A%E7%BA%A2%E5%85%89%E6%B8%85%E6%99%B0%E8%93%9D%E7%BB%BF%E6%A8%A1%E7%B3%8A%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义 SVG 滤镜内容
    // 你可以修改 stdDeviation="1.5" 来调节模糊程度
    const svgFilter = `
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="myopia-prevention-filter" x="0" y="0" width="100%" height="100%">
      <feColorMatrix in="SourceGraphic" type="matrix"
        values="1 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0" result="RED_CHANNEL"/>

      <feColorMatrix in="SourceGraphic" type="matrix"
        values="0 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 0" result="BLUE_GREEN_CHANNEL"/>

      <feGaussianBlur in="BLUE_GREEN_CHANNEL" stdDeviation="1.5" result="BLURRED_BG"/>

      <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0"
        in="RED_CHANNEL" in2="BLURRED_BG"/>
    </filter>
  </defs>
</svg>`;

    // 2. 定义 CSS 样式
    const cssStyle = `
        body {
            filter: url('#myopia-prevention-filter') !important;
        }
    `;

    // 3. 注入函数
    const inject = () => {
        // 确保不重复注入
        if (document.getElementById('myopia-prevention-filter')) return;

        // 注入 SVG
        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = svgFilter;
        document.documentElement.appendChild(svgContainer);

        // 注入 CSS
        const styleTag = document.createElement('style');
        styleTag.textContent = cssStyle;
        document.head.appendChild(styleTag);
    };

    // 4. 执行注入
    // 尽量在 DOM 加载早期执行，如果 body 还没出来则等待
    if (document.body) {
        inject();
    } else {
        const observer = new MutationObserver(() => {
            if (document.body) {
                inject();
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();