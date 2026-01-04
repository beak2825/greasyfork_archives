// ==UserScript==
// @name           天天基金排行榜优化版
// @name:en        fund list
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    隐藏A类基金行和页面广告
// @description:en hide A fund and AD
// @author         lousi
// @match          *://fund.eastmoney.com/data/*.html*
// @grant          GM_addStyle
// @license        GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/548113/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E6%8E%92%E8%A1%8C%E6%A6%9C%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548113/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E6%8E%92%E8%A1%8C%E6%A6%9C%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // 修改日期范围为前两周
        const today = new Date();
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000); // 减去14天

        const datest = document.getElementById('datest');
        const dateend = document.getElementById('dateend');

        if (datest && dateend) {
            datest.textContent = twoWeeksAgo.toISOString().slice(0, 10); // 格式化为YYYY-MM-DD
            dateend.textContent = today.toISOString().slice(0, 10); // 格式化为YYYY-MM-DD
        };

    // 隐藏A类基金行
    const hideAFunds = () => {
        const table = document.querySelector('table#dbtable');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const fundNameLink = row.querySelector('td:nth-child(4) a');
            if (fundNameLink && fundNameLink.title && fundNameLink.title.endsWith('A')) {
                row.style.display = 'none';
            }
        });
    };

    // 隐藏顶部和底部广告
    const hideAds = () => {
        // 常见广告选择器（根据实际页面结构调整）
        const adSelectors = [
            '.ad-banner',
            '.ad-container',
            '.top-ad',
            '.bottom-ad',
            '.ad-footer',
            '.cpright',
            '.rightAD',
            // 添加更多广告区域选择器
        ];

        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => {
                ad.style.display = 'none';
            });
        });
    };

    var rightAd = document.getElementById('rightAD');
    if (rightAd) {
        rightAd.style.display = 'none';
    };

    const topframes = document.querySelectorAll('iframe');
        topframes.forEach(iframe => {
            if(iframe.src.includes('same.eastmoney.com/s?z=eastmoney')) {
                iframe.remove();
            }
        });

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        hideAFunds();
        hideAds();
    });

    // 监听表格更新（适用于动态加载）
    const observer = new MutationObserver(() => {
        hideAFunds();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();