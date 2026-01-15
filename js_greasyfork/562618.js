// ==UserScript==
// @name         数字资产市场 航段价格显示
// @namespace    NA
// @version      1.0.3
// @description  在出售列表中显示每航段价格
// @author       倍多分
// @match        https://math.chinadep.com/*
// @match        https://m-math.chinadep.com/*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562618/%E6%95%B0%E5%AD%97%E8%B5%84%E4%BA%A7%E5%B8%82%E5%9C%BA%20%E8%88%AA%E6%AE%B5%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/562618/%E6%95%B0%E5%AD%97%E8%B5%84%E4%BA%A7%E5%B8%82%E5%9C%BA%20%E8%88%AA%E6%AE%B5%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 判断是否为手机端 */
    const isMobile = /m-math\.chinadep\.com/.test(location.href);

    /** 解析商品数据 */
    function parseItemData(itemEl) {
        const text = itemEl.innerText || '';
        const segMatch = text.match(/剩\s*(\d+)\s*航段权益/);
        const priceMatch = text.match(/¥\s*([\d,]+)/);

        if (!segMatch || !priceMatch) return null;

        const segments = parseInt(segMatch[1], 10);
        const price = parseFloat(priceMatch[1].replace(/,/g, ''));

        if (!Number.isFinite(segments) || segments <= 0) return null;
        if (!Number.isFinite(price) || price <= 0) return null;

        return { segments, price };
    }

    /** 插入每航段价格 */
    function injectPerSegmentPrice(itemEl, price, segments) {
        if (itemEl.querySelector('.tm-per-segment')) return;

        const perSegment = price / segments;
        const formatted = perSegment.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (isMobile) {
            // 手机端：在商品框内显示，绝对定位
            const contentEl = itemEl.querySelector('.uni-card-content') || itemEl;
            contentEl.style.position = 'relative'; // 确保绝对定位参考

            const row = document.createElement('div');
            row.className = 'tm-per-segment';
            row.textContent = `¥${formatted}/航段`;

            row.style.position = 'absolute';
            row.style.bottom = '4px';
            row.style.right = '4px';
            row.style.fontWeight = '700';
            row.style.fontSize = '14px';
            row.style.lineHeight = '1.2';

            if (perSegment >= 409) {
                row.style.color = '#ff0000';
                row.style.backgroundColor = '#ffe5e5';
                row.style.padding = '2px 4px';
                row.style.borderRadius = '4px';
            } else {
                row.style.color = '#28a745';
                row.style.backgroundColor = 'transparent';
                row.style.padding = '0';
            }

            contentEl.appendChild(row);

        } else {
            // PC端：保持右对齐布局
            const priceEl = itemEl.querySelector('.n-price-wrap');
            if (!priceEl) return;

            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'flex-end';
            wrapper.style.width = '100%';
            wrapper.style.marginTop = '2px';

            priceEl.parentNode.insertBefore(wrapper, priceEl);
            wrapper.appendChild(priceEl);

            const row = document.createElement('div');
            row.className = 'tm-per-segment';
            row.textContent = `¥${formatted}/航段`;

            row.style.fontWeight = '700';
            row.style.lineHeight = '1.2';
            row.style.marginTop = '4px';
            row.style.textAlign = 'right';
            row.style.fontSize = '16px';

            if (perSegment >= 409) {
                row.style.color = '#ff0000';
                row.style.backgroundColor = '#ffe5e5';
                row.style.padding = '2px 4px';
                row.style.borderRadius = '4px';
            } else {
                row.style.color = '#28a745';
            }

            wrapper.appendChild(row);
        }
    }

    /** 处理所有商品 */
    function processAllItems(root = document) {
        // PC: .ant-col, 手机: .uni-col.uni-col-12
        const items = Array.from(root.querySelectorAll('.ant-col, .uni-col.uni-col-12'));
        items.forEach(itemEl => {
            const data = parseItemData(itemEl);
            if (!data) return;
            injectPerSegmentPrice(itemEl, data.price, data.segments);
        });
    }

    /** 监听 DOM 变化（翻页 / 异步加载 / 排序） */
    function setupObserver() {
        const observer = new MutationObserver(() => {
            processAllItems(document);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初次渲染
        processAllItems(document);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setupObserver();
    } else {
        document.addEventListener('DOMContentLoaded', setupObserver, { once: true });
    }

})();