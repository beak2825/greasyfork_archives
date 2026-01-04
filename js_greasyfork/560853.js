// ==UserScript==
// @name         必应增强
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  屏蔽主流广告，搜索结果按最新排序，优化浏览流畅度
// @author       Laity.
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560853/%E5%BF%85%E5%BA%94%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560853/%E5%BF%85%E5%BA%94%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 原UI样式完全保留，未做任何修改
    GM_addStyle(`
        /* 通用搜索结果项 - 适配新旧版必应 */
        #b_results > li,
        #b_results > div:not([role="navigation"]):not([class*="sb_"]),
        .cib-serp-card,
        [data-testid="serp-result"],
        .b_algo {
            border-radius: 18px !important;
            background: #ffffff !important;
            padding: 22px !important;
            margin: 15px 0 !important;
            box-shadow: 0 3px 12px rgba(0,0,0,0.06) !important;
            border: 1px solid #f0f0f0 !important;
            display: block !important;
            opacity: 1 !important;
        }
        /* 结果项hover效果 */
        #b_results > li:hover,
        #b_results > div:not([role="navigation"]):not([class*="sb_"]):hover,
        .cib-serp-card:hover,
        [data-testid="serp-result"]:hover,
        .b_algo:hover {
            box-shadow: 0 6px 18px rgba(0,0,0,0.09) !important;
            transform: translateY(-2px) !important;
            transition: all 0.3s ease !important;
        }
        /* 标题样式 */
        #b_results h2 a,
        #b_results h3 a,
        .cib-serp-card h3 a {
            font-size: 19px !important;
            color: #1a0dab !important;
            text-decoration: none !important;
            margin-bottom: 8px !important;
            display: inline-block !important;
        }
        #b_results h2 a:hover,
        #b_results h3 a:hover {
            color: #0056b3 !important;
            text-decoration: underline !important;
        }
        /* 来源和日期样式 */
        .b_attribution, .b_date, .date-label, [data-testid="result-url"] {
            color: #006621 !important;
            font-size: 14px !important;
            margin: 6px 0 !important;
        }
        /* 描述文本样式 */
        .b_caption, .cib-text-desc, [data-testid="result-snippet"] {
            font-size: 15px !important;
            color: #333333 !important;
            line-height: 1.6 !important;
        }
        /* 禁用冲突样式 */
        #b_results [style*="display:none"],
        #b_results [style*="opacity:0"] {
            display: block !important;
            opacity: 1 !important;
        }
        /* 流畅度优化基础样式 */
        #b_results img {
            loading: lazy !important;
            transition: none !important;
        }
        * {
            animation: none !important;
            transition: none !important;
        }
    `);

    // 1. 屏蔽主流、常见、通用平台广告（覆盖国内外主流广告类型）
    function blockMainstreamAds() {
        const blockInterval = setInterval(() => {
            const mainstreamAdSelectors = [
                // 通用广告标识（适配所有平台）
                '[aria-label="广告"]', '[role="advertisement"]', '[data-testid="ad"]',
                '[class*="ad-"]', '[id*="ad-"]', '[data-ad-type]',
                // 主流平台专属广告
                '.b_ad', '.bing-ad', // 必应
                '.adsbygoogle', '.g-ad', '[class*="google-ad"]', // 谷歌
                '[data-baidu-ad]', '.baidu-ad', '.sogou-ad', // 百度、搜狗
                // 通用广告容器
                '.ad-wrap', '.ad-container', '.ad-box', '.advert', '.promotion',
                '.ad-module', '.ad-placement', '.tuiguang'
            ];
            // 批量移除广告元素
            mainstreamAdSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(adEl => adEl.remove());
            });
        }, 800); // 定期执行，应对动态加载广告

        window.addEventListener('unload', () => clearInterval(blockInterval));
    }

    // 2. 优化流畅度（禁用冗余脚本+延迟加载）
    function optimizeSmoothness() {
        // 禁用非必要统计/追踪脚本，减少性能占用
        document.querySelectorAll('script[src*="analytics"], script[src*="track"], script[src*="monitor"]').forEach(script => {
            script.disabled = true;
        });

        // 延迟加载所有非首屏图片，提升首屏加载速度
        window.addEventListener('load', () => {
            document.querySelectorAll('img:not([loading="lazy"])').forEach(img => {
                img.setAttribute('loading', 'lazy');
            });
        });
    }

    // 3. 搜索结果按日期排序（优先显示最新内容）
    function sortByLatestDate() {
        // 等待结果容器加载完成
        const waitForResults = () => {
            const resultContainer = document.querySelector('#b_results');
            if (resultContainer && resultContainer.children.length > 2) {
                executeSort(resultContainer);
            } else {
                setTimeout(waitForResults, 500);
            }
        };

        // 执行排序逻辑
        function executeSort(container) {
            // 过滤有效结果（排除导航栏等无关元素）
            const validResults = Array.from(container.children).filter(item => {
                return !item.hasAttribute('role') || item.getAttribute('role') !== 'navigation';
            });

            // 按日期倒序排序（最新在前）
            validResults.sort((a, b) => {
                // 提取结果项中的日期
                const getResultDate = (item) => {
                    const dateElement = item.querySelector('.b_date') || item.querySelector('.date-label') || item.querySelector('[data-testid="date"]');
                    if (!dateElement) return 0;
                    // 格式化日期文本（适配“2025年12月4日”等格式）
                    const formattedDate = dateElement.textContent.replace(/年|月/g, '-').replace('日', '');
                    return new Date(formattedDate).getTime() || 0;
                };
                return getResultDate(b) - getResultDate(a);
            });

            // 重新渲染排序后的结果
            validResults.forEach(result => container.appendChild(result));
        }

        waitForResults();
    }

    // 4. 监听搜索提交（二次搜索时重新执行功能）
    function listenSearchSubmit() {
        const searchForm = document.querySelector('#sb_form');
        if (searchForm) {
            searchForm.addEventListener('submit', () => {
                // 延迟1秒，确保新搜索结果已加载
                setTimeout(() => {
                    sortByLatestDate();
                    blockMainstreamAds();
                }, 1000);
            });
        }
    }

    // 初始化核心功能
    window.addEventListener('DOMContentLoaded', () => {
        blockMainstreamAds();
        optimizeSmoothness();
        sortByLatestDate();
        listenSearchSubmit();
    });
})();