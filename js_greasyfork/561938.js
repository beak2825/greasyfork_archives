// ==UserScript==
// @name         PSNine HLTB
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 PSNine 游戏页面显示 HowLongToBeat 通关时长数据
// @author       听风
// @match        https://psnine.com/psngame/*
// @match        https://www.psnine.com/psngame/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      htlbtiime.psnsgame.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561938/PSNine%20HLTB.user.js
// @updateURL https://update.greasyfork.org/scripts/561938/PSNine%20HLTB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HLTB_API = 'https://htlbtiime.psnsgame.com/search';

    GM_addStyle(`
        .hltb-widget {
            background: linear-gradient(145deg, #0f0f23 0%, #1a1a3e 50%, #0d1b2a 100%);
            border-radius: 10px;
            padding: 12px 14px;
            margin: 10px 0;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
            width: auto !important; /* 强制自适应宽度 */
            min-width: 600px; /* 保证最小宽度 */
        }
        /* 覆盖网站全局的 .main 限制，确保组件内部不受影响 */
        .hltb-widget .main {
            margin-left: 0 !important;
            padding: 0 !important;
            width: auto !important;
            background: transparent !important;
            border: none !important;
        }
        .hltb-widget::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }
        .hltb-brand {
            position: absolute;
            top: 12px;
            right: 16px;
            font-size: 10px;
            color: rgba(255,255,255,0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .hltb-header {
            display: flex;
            gap: 12px;
            margin-bottom: 10px;
        }
        .hltb-cover {
            width: 50px;
            height: 65px;
            border-radius: 6px;
            object-fit: cover;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .hltb-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .hltb-game-title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 4px;
        }
        .hltb-meta {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .hltb-meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: rgba(255,255,255,0.6);
        }
        .hltb-meta-item svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }
        .hltb-score {
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: #000;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 12px;
        }
        .hltb-times-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 12px;
        }
        .hltb-time-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 10px;
            padding: 10px 8px;
            text-align: center;
            position: relative;
            transition: all 0.2s ease;
        }
        .hltb-time-card:hover {
            background: rgba(255,255,255,0.06);
            transform: translateY(-2px);
        }
        .hltb-time-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 3px;
            border-radius: 0 0 3px 3px;
        }
        .hltb-time-card.type-main::before { background: linear-gradient(90deg, #22c55e, #4ade80); }
        .hltb-time-card.extra::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .hltb-time-card.complete::before { background: linear-gradient(90deg, #ef4444, #f87171); }
        .hltb-time-icon {
            font-size: 16px;
            margin-bottom: 4px;
        }
        .hltb-time-label {
            font-size: 11px;
            color: rgba(255,255,255,0.6);
            margin-bottom: 4px;
        }
        .hltb-time-value {
            font-size: 18px;
            font-weight: 800;
            color: #fff;
            white-space: nowrap;
            letter-spacing: 0.5px;
        }
        .hltb-time-card.type-main .hltb-time-value { color: #4ade80; text-shadow: 0 0 10px rgba(74, 222, 128, 0.3); }
        .hltb-time-card.extra .hltb-time-value { color: #facc15; text-shadow: 0 0 10px rgba(250, 204, 21, 0.3); }
        .hltb-time-card.complete .hltb-time-value { color: #f87171; text-shadow: 0 0 10px rgba(248, 113, 113, 0.3); }
        .hltb-time-sub {
            font-size: 10px;
            color: rgba(255,255,255,0.4);
            margin-top: 2px;
        }
        .hltb-stats {
            background: rgba(0,0,0,0.25);
            border-radius: 8px;
            padding: 12px;
            margin-top: 10px;
        }
        .hltb-stats-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .hltb-stats-row:last-child {
            border-bottom: none;
        }
        .hltb-stats-label {
            font-size: 12px;
            color: rgba(255,255,255,0.5);
            font-weight: 500;
        }
        .hltb-stats-values {
            display: flex;
            gap: 16px;
            font-size: 12px;
        }
        .hltb-stats-values span {
            color: rgba(255,255,255,0.8);
        }
        .hltb-stats-values .fastest { color: #4ade80; }
        .hltb-stats-values .slowest { color: #f87171; }
        .hltb-action {
            display: flex;
            justify-content: center;
        }
        .hltb-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            text-decoration: none;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .hltb-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .hltb-loading {
            text-align: center;
            padding: 40px;
            color: rgba(255,255,255,0.5);
        }
        .hltb-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: #667eea;
            border-radius: 50%;
            animation: hltb-spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes hltb-spin {
            to { transform: rotate(360deg); }
        }
        .hltb-error {
            text-align: center;
            padding: 30px;
            color: #f87171;
        }
    `);

    function getGameName() {
        // 方法1: 使用 .ml100 p 选择器（PSNine 的标准结构）
        const ml100p = document.querySelector('.ml100 p');
        if (ml100p) {
            const text = ml100p.innerText.trim();
            if (text && /^[A-Za-z]/.test(text)) {
                console.log('[HLTB] 从 .ml100 p 提取:', text);
                return text;
            }
        }

        // 方法2: 从图片 alt 属性获取
        const img = document.querySelector('img.imgbgnb');
        if (img && img.alt) {
            console.log('[HLTB] 从图片 alt 提取:', img.alt);
            return img.alt.trim();
        }

        // 方法3: 遍历页面文本查找英文名
        const pageText = document.body.innerText;
        const lines = pageText.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 3 && trimmed.length < 100 &&
                /^[A-Z][a-zA-Z0-9\s:'\-&!?.]+$/.test(trimmed) &&
                !trimmed.includes('http') && !trimmed.includes('Tips')) {
                console.log('[HLTB] 从文本提取:', trimmed);
                return trimmed;
            }
        }

        // 方法4: 从标题提取《》中的内容
        const h1 = document.querySelector('h1');
        if (h1) {
            const match = h1.innerText.match(/《(.+?)》/);
            if (match) {
                console.log('[HLTB] 从标题提取:', match[1]);
                return match[1];
            }
        }

        return null;
    }

    function formatHours(hours) {
        if (!hours || hours <= 0) return '-';
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (h === 0) return `${m}分钟`;
        if (m > 0) return `${h}h ${m}m`;
        return `${h}h`;
    }

    function formatSeconds(seconds) {
        if (!seconds || seconds <= 0) return '-';
        return formatHours(seconds / 3600);
    }

    function createWidget(data) {
        const widget = document.createElement('div');
        widget.className = 'hltb-widget';

        if (!data.found) {
            widget.innerHTML = `<div class="hltb-error">❌ 未找到 "${data.searchName || '游戏'}" 的通关时长数据</div>`;
            return widget;
        }

        widget.innerHTML = `
            <div class="hltb-header">
                ${data.fullImageUrl ? `<img class="hltb-cover" src="${data.fullImageUrl}" alt="">` : ''}
                <div class="hltb-info">
                    <div class="hltb-game-title">${data.gameName}</div>
                    <div class="hltb-meta">
                        <span class="hltb-meta-item">🎮 ${data.profilePlatforms || 'PlayStation'}</span>
                        ${data.reviewScore ? `<span class="hltb-score">${data.reviewScore}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="hltb-times-grid">
                <div class="hltb-time-card type-main">
                    <div class="hltb-time-icon">🎯</div>
                    <div class="hltb-time-label">主线剧情</div>
                    <div class="hltb-time-value">${formatHours(data.mainStoryHours)}</div>
                </div>
                <div class="hltb-time-card extra">
                    <div class="hltb-time-icon">⭐</div>
                    <div class="hltb-time-label">主线 + 额外</div>
                    <div class="hltb-time-value">${formatHours(data.mainExtraHours)}</div>
                </div>
                <div class="hltb-time-card complete">
                    <div class="hltb-time-icon">🏆</div>
                    <div class="hltb-time-label">完美通关/全收集</div>
                    <div class="hltb-time-value">${formatHours(data.completionistHours)}</div>
                </div>
            </div>

            <div class="hltb-stats">
                <div class="hltb-stats-row">
                    <span class="hltb-stats-label">🎯 主线平均</span>
                    <div class="hltb-stats-values">
                        <span>均${formatSeconds(data.compMainAvg)}</span>
                        <span class="fastest">快${formatSeconds(data.compMainLow)}</span>
                        <span class="slowest">慢${formatSeconds(data.compMainHigh)}</span>
                    </div>
                </div>
                <div class="hltb-stats-row">
                    <span class="hltb-stats-label">🏆 完美平均</span>
                    <div class="hltb-stats-values">
                        <span>均${formatSeconds(data.comp100Avg)}</span>
                        <span class="fastest">快${formatSeconds(data.comp100Low)}</span>
                        <span class="slowest">慢${formatSeconds(data.comp100High)}</span>
                    </div>
                </div>
            </div>
        `;
        return widget;
    }

    function init() {
        const gameName = getGameName();
        if (!gameName) return;

        const placeholder = document.createElement('div');
        placeholder.className = 'hltb-widget hltb-loading';
        placeholder.innerHTML = '<div class="hltb-loading-spinner"></div>正在获取通关时长数据...';

        const firstBox = document.querySelector('.box');
        if (firstBox) {
            firstBox.parentNode.insertBefore(placeholder, firstBox.nextSibling);
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${HLTB_API}?name=${encodeURIComponent(gameName)}`,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    placeholder.replaceWith(createWidget(data));
                } catch (e) {
                    placeholder.innerHTML = '<div class="hltb-error">数据解析失败</div>';
                }
            },
            onerror: function () {
                placeholder.innerHTML = '<div class="hltb-error">请求失败</div>';
            }
        });
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();
