// ==UserScript==
// @name         商機探測器 API 工具
// @version      1.4
// @description  通過API獲取商機探測器的選品數據
// @author       Moz & Gemini
// @match        https://sellercentral.amazon.com/opportunity-explorer/explore*
// @grant        GM_addStyle
// @resource     HUNINN_FONT https://fonts.googleapis.com/css2?family=Huninn&display=swap
// @license MIT
// @namespace https://greasyfork.org/users/1331049
// @downloadURL https://update.greasyfork.org/scripts/550327/%E5%95%86%E6%A9%9F%E6%8E%A2%E6%B8%AC%E5%99%A8%20API%20%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/550327/%E5%95%86%E6%A9%9F%E6%8E%A2%E6%B8%AC%E5%99%A8%20API%20%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入字體
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Huninn&display=swap');
    `);

    // 2. 創建 UI 介面的 HTML 結構 (無變動)
    const uiHTML = `
        <div id="api-tool-container">
            <div id="api-tool-header">
                <span>商機探測器 API 工具 (洞察Pro Max版)</span>
                <button id="api-tool-close" title="關閉">×</button>
            </div>
            <div id="api-tool-content">
                <div class="api-tool-input-group">
                    <label for="api-tool-keyword">查找關鍵詞</label>
                    <input type="text" id="api-tool-keyword" placeholder="例如: cat food">
                </div>
                <input type="hidden" id="api-tool-token">
                <button id="api-tool-submit" disabled>初始化中...</button>
                <div id="api-tool-results">
                    <p>請輸入關鍵詞後開始查找。</p>
                </div>
            </div>
        </div>
    `;

    // 3. 創建 UI 的 CSS 樣式 (已調整定位與寬度)
    const uiCSS = `
        #api-tool-container, #api-tool-container input, #api-tool-container button {
            font-family: 'Huninn', 'Trebuchet MS', sans-serif;
        }
        #api-tool-container {
            /* [修改 1] 將初始位置固定在左上角 */
            position: fixed;
            top: 20px;
            left: 20px;
            width: 1400px; /* [修改 2] 再次增加總寬度 */
            max-height: 90vh;
            background-color: #f0f2f2;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            color: #111;
        }
        #api-tool-header {
            background-color: #232f3e; color: white; padding: 10px 15px; cursor: move;
            border-top-left-radius: 8px; border-top-right-radius: 8px;
            display: flex; justify-content: space-between; align-items: center; user-select: none;
        }
        #api-tool-header span { font-weight: bold; }
        #api-tool-close {
            background: none; border: none; color: white; font-size: 24px;
            cursor: pointer; line-height: 1; padding: 0 5px;
        }
        #api-tool-content { padding: 15px; overflow-y: auto; }
        .api-tool-input-group { margin-bottom: 15px; }
        .api-tool-input-group label {
            display: block; margin-bottom: 5px; font-size: 14px; font-weight: bold; color: #111;
        }
        #api-tool-keyword {
            width: 100%; padding: 8px; border: 1px solid #a6a6a6;
            border-radius: 4px; box-sizing: border-box; font-size: 14px;
        }
        #api-tool-submit {
            width: 100%; padding: 10px; background-color: #ff9900; color: #111;
            border: 1px solid #a6a6a6; border-radius: 4px; font-size: 16px;
            font-weight: bold; cursor: pointer; margin-bottom: 15px; transition: background-color 0.2s;
        }
        #api-tool-submit:hover:not(:disabled) { background-color: #e68a00; }
        #api-tool-submit:disabled {
            background-color: #c7c7c7; border-color: #a6a6a6;
            cursor: not-allowed; color: #555;
        }
        #api-tool-results {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); /* [修改 2] 增加卡片最小寬度 */
            gap: 15px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        #api-tool-results p { grid-column: 1 / -1; color: #555; text-align: center; }

        .result-card {
            background-color: white; border: 1px solid #e7e7e7; border-radius: 6px;
            padding: 12px; display: flex; flex-direction: column;
        }
        .result-card-main {
            display: flex; align-items: center; margin-bottom: 12px;
        }
        .result-card-main img {
            width: 60px; height: 60px; object-fit: contain; margin-right: 15px;
            border-radius: 4px; background-color: #fff; flex-shrink: 0;
        }
        .result-card-info { display: flex; flex-direction: column; flex-grow: 1; min-width: 0; }
        .result-card-title {
            font-size: 15px; font-weight: bold; color: #007185; margin-bottom: 5px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .result-card-price { font-size: 14px; color: #B12704; font-weight: bold; }

        .opportunity-score-container {
            text-align: center;
            padding: 10px 0;
            margin-bottom: 12px;
            border-top: 1px solid #f0f0f0;
            border-bottom: 1px solid #f0f0f0;
        }
        .opportunity-score-container .score-title {
            font-size: 13px;
            color: #555;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .opportunity-score-container strong {
            font-size: 28px;
            font-weight: bold;
        }

        .result-card-stats {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
        }
        .stat-item { text-align: center; }
        .stat-item span {
            font-size: 12px; color: #555; display: block;
            white-space: nowrap; /* 防止標題換行 */
        }
        .stat-item strong {
            font-size: 13px;
            color: #111; display: block;
        }
        .stat-item .growth-positive { color: #007600; }
        .stat-item .growth-negative { color: #C40000; }

        .tooltip-container {
            position: relative;
            display: inline-flex;
            align-items: center;
        }
        .tooltip-icon {
            display: inline-block;
            width: 14px; height: 14px; border-radius: 50%;
            background-color: #555; color: white;
            font-size: 10px; line-height: 14px; text-align: center;
            cursor: help; margin-left: 5px;
        }
        .tooltip-text {
            visibility: hidden;
            width: 250px; background-color: #232f3e;
            color: #fff; text-align: left; border-radius: 6px;
            padding: 8px 12px; position: absolute;
            z-index: 10; bottom: 125%; left: 50%;
            transform: translateX(-50%); opacity: 0;
            transition: opacity 0.3s; font-size: 12px;
            line-height: 1.5;
        }
        .tooltip-text::after {
            content: ""; position: absolute;
            top: 100%; left: 50%; margin-left: -5px;
            border-width: 5px; border-style: solid;
            border-color: #232f3e transparent transparent transparent;
        }
        .tooltip-container:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
    `;

    // 4. 注入 HTML 和 CSS
    document.body.insertAdjacentHTML('beforeend', uiHTML);
    GM_addStyle(uiCSS);

    // 5. 獲取 DOM 元素
    const container = document.getElementById('api-tool-container');
    const header = document.getElementById('api-tool-header');
    const keywordInput = document.getElementById('api-tool-keyword');
    const tokenInput = document.getElementById('api-tool-token');
    const submitButton = document.getElementById('api-tool-submit');
    const resultsContainer = document.getElementById('api-tool-results');
    const closeButton = document.getElementById('api-tool-close');

    function initializeToken() {
        const metaTag = document.querySelector('meta[name="anti-csrftoken-a2z"]');
        if (metaTag && metaTag.content) {
            tokenInput.value = metaTag.content;
            submitButton.disabled = false;
            submitButton.textContent = '查找商機';
        } else {
            submitButton.textContent = '工具不可用';
        }
    }

    // 6. 添加事件監聽
    closeButton.onclick = () => container.remove();

    // 拖動視窗的邏輯 (無變動)
    let isDragging = false;
    let initialMouseX, initialMouseY, initialElX, initialElY;

    header.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        const rect = container.getBoundingClientRect();
        initialElX = rect.left;
        initialElY = rect.top;
        header.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;
        container.style.top = `${Math.max(0, initialElY + dy)}px`;
        container.style.left = `${initialElX + dx}px`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        header.style.cursor = 'move';
    });

    submitButton.addEventListener('click', async () => {
        const keyword = keywordInput.value.trim();
        const token = tokenInput.value.trim();
        if (!keyword) {
            resultsContainer.innerHTML = '<p style="color: red;">關鍵詞欄位不能為空！</p>';
            return;
        }
        resultsContainer.innerHTML = '<p>正在查找中，請稍候...</p>';
        submitButton.disabled = true;

        try {
            const niches = await fetchNiches(keyword, token);
            displayResults(niches);
        } catch (error) {
            console.error("API 請求失敗:", error);
            resultsContainer.innerHTML = `<p style="color: red;">請求失敗，請稍後再試或刷新頁面。</p>`;
        } finally {
            if (tokenInput.value) {
                submitButton.disabled = false;
            }
        }
    });

    // 7. 核心 API 請求函式 (無變動)
    async function fetchNiches(keyword, token) {
        const response = await fetch('https://sellercentral.amazon.com/ox-api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Anti-Csrftoken-A2z': token },
            body: JSON.stringify({
                query: `query getNiches($filter: NicheFilter!) {
                    niches(filter: $filter) {
                        nicheTitle
                        referenceAsinImageUrl
                        nicheSummary {
                            avgPrice
                            searchVolumeT90
                            searchVolumeGrowthT90
                            salesPotentialScore
                        }
                        launchPotential {
                            productCount { currentValue }
                            avgReviewCount { currentValue }
                            avgReviewRating { currentValue }
                            top5BrandsClickShare { currentValue }
                        }
                    }
                }`,
                variables: {
                    filter: {
                        obfuscatedMarketplaceId: "ATVPDKIKX0DER",
                        searchTermsFilter: { searchInput: keyword }
                    }
                }
            }),
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
        const result = await response.json();
        if (result.errors) throw new Error(`GraphQL 錯誤: ${JSON.stringify(result.errors)}`);
        return result.data.niches;
    }

    // 8. 數據格式化與機會分數計算 (無變動)
    function formatNumberShort(num) {
        if (num === null || typeof num === 'undefined' || isNaN(num)) return '-';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    }

    function calculateOpportunityScore(niche) {
        let score = 0;
        const summary = niche.nicheSummary;
        const launch = niche.launchPotential;

        if (!summary || !launch) return { score: 0, color: '#555' };

        // 1. 市場需求 (滿分 3.0)
        const searchVol = summary.searchVolumeT90 ?? 0;
        if (searchVol > 50000) score += 3.0;
        else if (searchVol > 10000) score += 2.0;
        else if (searchVol > 2000) score += 1.0;
        else if (searchVol > 500) score += 0.5;

        // 2. 競爭程度 (滿分 3.0)
        const productCount = launch.productCount?.currentValue ?? Infinity;
        if (productCount < 200) score += 3.0;
        else if (productCount < 600) score += 2.0;
        else if (productCount < 1500) score += 1.0;

        // 3. 進入門檻 (滿分 2.0)
        const avgReviews = launch.avgReviewCount?.currentValue ?? Infinity;
        if (avgReviews < 100) score += 2.0;
        else if (avgReviews < 400) score += 1.0;
        else if (avgReviews < 1000) score += 0.5;

        // 4. 市場壟斷 (滿分 1.0)
        const top5Share = launch.top5BrandsClickShare?.currentValue ?? 1;
        if (top5Share < 0.35) score += 1.0;
        else if (top5Share < 0.60) score += 0.5;

        // 5. 增長潛力 (滿分 1.0, 含懲罰機制)
        const growth = summary.searchVolumeGrowthT90;
        if (growth !== null && typeof growth !== 'undefined') {
            if (growth > 0.20) score += 1.0;
            else if (growth > 0.05) score += 0.5;
            else if (growth < -0.10) score -= 0.5;
        }

        const finalScore = Math.max(0, Math.min(10, score)).toFixed(1);

        let color = '#555';
        if (finalScore >= 7.5) color = '#007600';
        else if (finalScore <= 4.0) color = '#C40000';

        return { score: finalScore, color: color };
    }


    // 9. 將結果顯示在介面上的函式 (無變動)
    function displayResults(niches) {
        if (!niches || niches.length === 0) {
            resultsContainer.innerHTML = '<p>找不到與關鍵詞相關的商機。</p>';
            return;
        }

        niches.sort((a, b) => {
            const scoreA = calculateOpportunityScore(a).score;
            const scoreB = calculateOpportunityScore(b).score;
            return scoreB - scoreA;
        });

        let resultsHTML = '';
        niches.forEach(niche => {
            const summary = niche.nicheSummary;
            const launch = niche.launchPotential;

            const formatPercent = (num) => (num === null || typeof num === 'undefined') ? '-' : `${(num * 100).toFixed(1)}%`;
            const formatGrowth = (num) => {
                if (num === null || typeof num === 'undefined') return '<span>-</span>';
                const percent = (num * 100).toFixed(1);
                return percent >= 0
                    ? `<span class="growth-positive">+${percent}%</span>`
                    : `<span class="growth-negative">${percent}%</span>`;
            };

            const price = summary?.avgPrice ? `$${parseFloat(summary.avgPrice).toFixed(2)}` : '-';
            const imageUrl = niche.referenceAsinImageUrl || 'https://via.placeholder.com/60';
            const searchVolume = formatNumberShort(summary?.searchVolumeT90);
            const searchGrowth = formatGrowth(summary?.searchVolumeGrowthT90);
            const productCount = formatNumberShort(launch?.productCount?.currentValue);
            const avgReviews = formatNumberShort(launch?.avgReviewCount?.currentValue ? Math.round(launch.avgReviewCount.currentValue) : launch?.avgReviewCount?.currentValue);
            const top5BrandShare = formatPercent(launch?.top5BrandsClickShare?.currentValue);

            const { score, color } = calculateOpportunityScore(niche);

            resultsHTML += `
                <div class="result-card">
                    <div class="result-card-main">
                        <img src="${imageUrl}" alt="${niche.nicheTitle}">
                        <div class="result-card-info">
                            <div class="result-card-title" title="${niche.nicheTitle}">${niche.nicheTitle}</div>
                            <div class="result-card-price">平均價格: ${price}</div>
                        </div>
                    </div>

                    <div class="opportunity-score-container">
                        <div class="score-title">
                            <div class="tooltip-container">
                                <span>機會分數</span>
                                <span class="tooltip-icon">?</span>
                                <span class="tooltip-text">
                                    此分數 (0-10) 綜合評估市場潛力。<br>
                                    <b>高分(7.5+):</b> 高需求、低競爭，是絕佳機會。<br>
                                    <b>中分(4.1-7.4):</b> 市場均衡，需有特色才能進入。<br>
                                    <b>低分(0-4.0):</b> 競爭激烈或需求萎縮，風險較高。<br>
                                    <hr style="border-color: #555; margin: 4px 0;">
                                    評估維度: 市場需求、競爭程度、進入門檻、品牌壟斷、增長潛力。
                                </span>
                            </div>
                        </div>
                        <strong style="color: ${color};">${score} / 10</strong>
                    </div>

                    <div class="result-card-stats">
                        <div class="stat-item">
                            <span>90天搜索量</span>
                            <strong>${searchVolume}</strong>
                        </div>
                         <div class="stat-item">
                            <span>競品數量</span>
                            <strong>${productCount}</strong>
                        </div>
                        <div class="stat-item">
                            <span>平均評論數</span>
                            <strong>${avgReviews}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Top5品牌壟斷</span>
                            <strong>${top5BrandShare}</strong>
                        </div>
                        <div class="stat-item">
                            <span>搜索增長率</span>
                            <strong>${searchGrowth}</strong>
                        </div>
                    </div>
                </div>
            `;
        });
        resultsContainer.innerHTML = resultsHTML;
    }

    // 10. 啟動腳本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeToken);
    } else {
        initializeToken();
    }

})();