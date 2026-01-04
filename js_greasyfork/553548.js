// ==UserScript==
// @name         Dayto.blog 广告弹窗自动移除
// @namespace    http://tampermonkey.net/
// @version      20251024
// @description  专属移除dayto.blog网站的4类广告弹窗，支持防反复弹出,以及支持下一页等突破3限制
// @author       撸兄
// @match        https://dayto.blog/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      Proprietary - All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/553548/Daytoblog%20%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/553548/Daytoblog%20%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 初始化分页增强
    function enhancePagination() {
        // 找到分页容器
        const paginationContainer = document.querySelector('nav.w-full.flex.flex-wrap.justify-center.items-center.gap-2.py-6.text-sm.text-gray-300.text-center');
        if (!paginationContainer) {
            console.log('未找到分页容器，脚本未运行');
            return;
        }

        // 获取当前页码和搜索参数
        const currentUrl = new URL(window.location.href);
        const currentPage = parseInt(currentUrl.searchParams.get('page') || 1);
        const searchKw = currentUrl.searchParams.get('kw') || '';

        // 重写页码跳转函数（突破最大页码限制）
        window.goToPage = function(inputId, maxPage) {
            const input = document.getElementById(inputId);
            if (!input) return;

            let page = parseInt(input.value.trim()) || 1;
            page = Math.max(1, page); // 确保页码不小于1
            // 移除最大页码限制（原代码有max=3）

            // 跳转新页码
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('page', page);
            window.location.href = newUrl.toString();
        };

        // 生成新的分页导航
        function renderNewPagination() {
            // 清空现有分页内容
            paginationContainer.innerHTML = '';

            // 上一页按钮
            const prevPage = Math.max(1, currentPage - 1);
            const prevLink = document.createElement('a');
            prevLink.href = `https://dayto.blog/search?kw=${searchKw}&page=${prevPage}`;
            prevLink.className = 'px-3 py-1 border border-gray-700 rounded hover:bg-gray-800';
            prevLink.textContent = '上一页';
            paginationContainer.appendChild(prevLink);

            // 页码区域（显示当前页±1的页码）
            const pageNumbers = document.createElement('div');
            pageNumbers.className = 'hidden sm:flex space-x-1';

            // 生成前一页、当前页、后一页
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i < 1) continue; // 跳过小于1的页码
                const pageLink = document.createElement(i === currentPage ? 'span' : 'a');
                if (i !== currentPage) {
                    pageLink.href = `https://dayto.blog/search?kw=${searchKw}&page=${i}`;
                    pageLink.className = 'px-3 py-1 rounded hover:bg-gray-800';
                } else {
                    pageLink.className = 'px-3 py-1 bg-pink-600 text-white rounded';
                }
                pageLink.textContent = i;
                pageNumbers.appendChild(pageLink);
            }
            paginationContainer.appendChild(pageNumbers);

            // 下一页按钮
            const nextPage = currentPage + 1;
            const nextLink = document.createElement('a');
            nextLink.href = `https://dayto.blog/search?kw=${searchKw}&page=${nextPage}`;
            nextLink.className = 'px-3 py-1 border border-gray-700 rounded hover:bg-gray-800';
            nextLink.textContent = '下一页';
            paginationContainer.appendChild(nextLink);

            // 页码输入框（移除max限制）
            const pageInputGroup = document.createElement('div');
            pageInputGroup.className = 'flex items-center gap-1 px-3 py-1 border border-gray-700 rounded';
            pageInputGroup.innerHTML = `
                <input id="customPageInput" type="number" min="1" placeholder="页码"
                       class="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 text-center text-sm"
                       onkeydown="if(event.key === 'Enter'){ goToPage('customPageInput'); }"
                       value="${currentPage}">
                <button onclick="goToPage('customPageInput')"
                        class="px-2 py-1 border border-pink-600 text-pink-500 rounded hover:bg-pink-600 hover:text-white text-xs">
                    跳转
                </button>
            `;
            paginationContainer.appendChild(pageInputGroup);
        }

        // 初始渲染新分页
        renderNewPagination();

        // 监听页面跳转后的变化（通过URL变化检测）
        let lastUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                renderNewPagination(); // URL变化时重新渲染分页
            }
        }, 500);
    }

    // 页面加载完成后初始化
    window.addEventListener('load', enhancePagination);

    GM_addStyle(`
        body > div[style*="fixed"][style*="top: 0"][style*="left: 0"][style*="background: rgba(0,0,0,"],
        body > div[class*="ad-overlay"],
        body > div[id*="ad-mask"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        .ad-element-mark {
            outline: 2px solid red !important;
            background-color: rgba(255,0,0,0.1) !important;
        }
    `);

    const AD_DETECTION_RULES = [
        {
            name: "单图广告弹窗（A/B/C类）",
            selector: 'div.flex.flex-col.items-center.justify-center.w-\\[90vw\\].max-w-sm',
            isAd: (element) => {
                const hasSingleCloseBtn = element.querySelector('button[onclick="closeAdModal(\'single\')"]') !== null;
                const hasAdLink = element.querySelector('a[data-href^="https://"][data-href*=".club"],a[data-href*=".vip:"],a[data-href*=".top:"]') !== null;
                const hasAdImg = element.querySelector('img[data-src*="/system/202508/"],img[data-src*="/system/202510/"]') !== null;
                return hasSingleCloseBtn && hasAdLink && hasAdImg;
            }
        },
        {
            name: "多图网格广告弹窗（D类）",
            selector: 'div.relative.w-fit',
            isAd: (element) => {
                const hasGridContainer = element.querySelector('div.grid.grid-cols-4.gap-px') !== null;
                const hasGridCloseBtn = element.querySelector('button[onclick="closeAdModal(\'grid\')"]') !== null;
                const dirtyTextList = ['免费p站', '同城约炮', '春药商城', 'Xvideos破解版', '处女直播', '91吃瓜', '18AV'];
                const hasDirtyText = dirtyTextList.some(text => element.textContent.includes(text));
                return hasGridContainer && hasGridCloseBtn && hasDirtyText;
            }
        }
    ];

    const DEBUG_MODE = true;
    function log(message, type = "info") {
        if (!DEBUG_MODE) return;
        const prefix = `[Dayto广告移除] ${type.toUpperCase()}: `;
        switch(type) {
            case "info": console.log(`%c${prefix}${message}`, "color: #4CAF50;"); break;
            case "warn": console.warn(`%c${prefix}${message}`, "color: #FF9800;"); break;
            case "success": console.log(`%c${prefix}${message}`, "color: #2196F3; font-weight: bold;"); break;
        }
    }

    function scanAndRemoveAds() {
        log("开始扫描广告...");
        let removedAdCount = 0;

        AD_DETECTION_RULES.forEach(rule => {
            const candidateElements = document.querySelectorAll(rule.selector);
            if (candidateElements.length === 0) {
                log(`未找到「${rule.name}」匹配元素`, "warn");
                return;
            }

            candidateElements.forEach(element => {
                if (rule.isAd(element)) {
                    element.classList.add('ad-element-mark');
                    element.remove();
                    removedAdCount++;
                    log(`成功移除「${rule.name}」`, "success");

                    if (typeof closeAdModal === 'function') {
                        if (rule.name.includes("单图")) closeAdModal('single');
                        if (rule.name.includes("多图")) closeAdModal('grid');
                        log("已调用广告关闭函数，清理残留数据");
                    }
                }
            });
        });

        if (removedAdCount === 0) {
            log("本次扫描未发现广告", "info");
        } else {
            log(`本次扫描共移除 ${removedAdCount} 个广告`, "success");
        }
    }

    const SCAN_INTERVAL = 1500;
    let scanTimer = setInterval(scanAndRemoveAds, SCAN_INTERVAL);
    log(`已启动定时扫描，间隔 ${SCAN_INTERVAL}ms`);

    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].nodeType === 1) {
                log("检测到页面新元素，触发即时扫描", "info");
                scanAndRemoveAds();
            }
        });
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
    log("已启动动态元素监听");

    setTimeout(() => {
        log("页面初始化完成，触发首次广告扫描");
        scanAndRemoveAds();
    }, 500);

    window.addEventListener('beforeunload', () => {
        clearInterval(scanTimer);
        mutationObserver.disconnect();
        log("页面关闭，已清理脚本资源", "info");
    });

})();