// ==UserScript==
// @name         数学公式渲染修复
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为网页添加MathJax支持
// @author       Wolfe
// @match        *://*/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/556624/%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F%E6%B8%B2%E6%9F%93%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/556624/%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F%E6%B8%B2%E6%9F%93%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加MathJax配置
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['$ ', ' $'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['$$ ', ' $$'], ['\\[', '\\]']]
        },
        svg: {
            fontCache: 'global'
        }
    };

    // 加载MathJax
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
    script.async = true;
    document.head.appendChild(script);

    // 监听内容变化并重新渲染
    script.onload = function() {
        MathJax.typesetPromise().then(() => {
            console.log('数学公式渲染完成');
        });
    };
})();