// ==UserScript==
// @name         电子发烧友网 - 展开全文 + 隐藏按钮 + 回到顶部
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  移除 .simditor-body.clearfix 的 height 限制，隐藏“阅读全文”按钮，并添加“回到顶部”按钮
// @author       Qwen&Sephiroth1s
// @match        https://www.elecfans.com/d/*.html
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553491/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E7%BD%91%20-%20%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%20%2B%20%E9%9A%90%E8%97%8F%E6%8C%89%E9%92%AE%20%2B%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553491/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E7%BD%91%20-%20%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%20%2B%20%E9%9A%90%E8%97%8F%E6%8C%89%E9%92%AE%20%2B%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandSimditorBody() {
        const simditorBody = document.querySelector('.simditor-body.clearfix');
        if (simditorBody) {
            // 移除内联样式中的 height 和 overflow 限制
            simditorBody.style.height = 'auto';
            simditorBody.style.maxHeight = 'none';
            simditorBody.style.overflow = 'visible';

            console.log('✅ 已自动展开全文（.simditor-body.clearfix）');
        }
    }

    function hideReadMoreButton() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (/阅读全文|展开全文/.test(el.textContent?.trim())) {
                const parent = el.closest('p, div, section, a, span') || el;
                if (parent && parent.offsetHeight < 150) {
                    parent.style.display = 'none';
                }
            }
        });
    }

    function addBackToTopButton() {
        // 创建按钮
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerText = '↑';
        backToTopBtn.title = '回到顶部';
        Object.assign(backToTopBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            width: '40px',
            height: '40px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '18px',
            textAlign: 'center',
            lineHeight: '40px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            display: 'none' // 默认隐藏
        });

        // 点击事件
        backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

        // 插入页面
        document.body.appendChild(backToTopBtn);

        // 滚动时显示/隐藏
        window.addEventListener('scroll', () => {
            backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
    }

    function init() {
        expandSimditorBody();
        hideReadMoreButton();
        addBackToTopButton();
    }

    // 确保 DOM 已加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 额外保险：延迟执行一次（应对动态渲染）
    setTimeout(init, 800);
})();