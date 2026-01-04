// ==UserScript==
// @name         RinNET to ChunithmNET Replica Sidebar (v3.6)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  在Rin服的中二游玩记录展示页面添加一个仿照官方游玩记录样式的侧边栏
// @author       Swan416
// @match        https://portal.naominet.live/chuni/v2/recent*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559888/RinNET%20to%20ChunithmNET%20Replica%20Sidebar%20%28v36%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559888/RinNET%20to%20ChunithmNET%20Replica%20Sidebar%20%28v36%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 官方资源配置 ---
    const OFFICIAL_ASSETS = {
        rankBase: "https://chunithm.wahlap.com/mobile/images/icon_rank_",
        // clear: "https://chunithm.wahlap.com/mobile/images/icon_clear.png", // 不再使用Clear图标，改用灰色FC
        fc: "https://chunithm.wahlap.com/mobile/images/icon_fullcombo.png",
        aj: "https://chunithm.wahlap.com/mobile/images/icon_alljustice.png",
        ajc: "https://chunithm.wahlap.com/mobile/images/icon_alljusticecritical.png", // 新增 AJC
        newRecord: "https://chunithm.wahlap.com/mobile/images/icon_new.png",
        scoreLabel: "https://chunithm.wahlap.com/mobile/images/score_head.png",
        level: {
            master: "https://chunithm.wahlap.com/mobile/images/musiclevel_master.png",
            expert: "https://chunithm.wahlap.com/mobile/images/musiclevel_expert.png",
            advanced: "https://chunithm.wahlap.com/mobile/images/musiclevel_advanced.png",
            basic: "https://chunithm.wahlap.com/mobile/images/musiclevel_basic.png",
            ultima: "https://chunithm.wahlap.com/mobile/images/musiclevel_ultimate.png",
            worldsend: "https://chunithm.wahlap.com/mobile/images/musiclevel_worldsend.png"
        }
    };

    // --- 2. 样式注入 ---
    GM_addStyle(`
        /* 侧边栏容器 */
        #chuni-replica-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            width: 400px;
            height: 100vh;
            background-color: #ffdb2c;
            background-image: linear-gradient(90deg, #fff 0%, #fff 2%, transparent 2%, transparent 98%, #fff 98%);
            z-index: 9999;
            box-shadow: -2px 0 10px rgba(0,0,0,0.3);
            transition: transform 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            transform: translateX(400px); /* 默认收起 */
        }

        #chuni-replica-sidebar.expanded {
            transform: translateX(0);
        }

        /* 切换按钮 */
        #chuni-replica-toggle {
            position: absolute;
            left: -40px;
            top: 50%;
            width: 40px;
            height: 60px;
            background: #ffcc00;
            border-radius: 10px 0 0 10px;
            border: 2px solid #fff;
            border-right: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
            color: #fff;
            font-weight: bold;
            font-size: 20px;
            user-select: none;
        }

        /* 内部滚动区域 */
        #chuni-replica-content {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            padding-bottom: 50px;
            background-color: #334455;
        }

        /* 顶部标题栏 */
        .replica-header {
            background: repeating-linear-gradient(45deg, #333, #333 10px, #444 10px, #444 20px);
            color: #fff; text-align: center; font-weight: bold; padding: 8px;
            font-size: 16px; border-top: 2px solid #00bfff; border-bottom: 2px solid #fff;
            margin-bottom: 15px; text-shadow: 1px 1px 0 #000;
        }

        /* 卡片基础样式 */
        .replica-card {
            background-color: #ffffe0;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            padding-bottom: 5px;
            font-family: sans-serif;
            box-sizing: border-box;
        }
        .replica-time {
            background-color: #000; color: #fff; font-size: 11px;
            text-align: center; padding: 2px; font-weight: bold;
        }
        .replica-body { display: flex; padding: 5px; }

        /* 曲绘外框 */
        .replica-jacket {
            width: 90px;
            height: 90px;
            background-color: rgb(32, 44, 57);
            padding: 5px;
            margin-right: 5px;
            flex-shrink: 0;
        }
        .replica-jacket img {
            width: 100%; height: 100%; object-fit: cover; display: block;
        }

        .replica-info {
            flex: 1; display: flex; flex-direction: column;
            justify-content: space-between; overflow: hidden;
        }

        /* Track 和 难度条样式 */
        .replica-diff-bar {
            display: flex; align-items: center; margin-bottom: 2px;
            background-color: rgb(32, 44, 57); padding: 2px 5px;
        }
        .replica-track-num {
            background-color: transparent; color: #fff;
            font-size: 12px; font-weight: bold; margin-right: 5px;
            line-height: 1; text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
        }
        .replica-diff-icon { height: 18px; width: auto; margin-left: auto; }

        .replica-title {
            font-size: 14px; font-weight: bold; border-bottom: 1px solid #333;
            margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* 分数区域 */
        .replica-score-row {
            display: flex; align-items: center; font-weight: bold;
            background: #fff; padding: 1px;
        }
        .replica-score-label-img { height: 14px; width: auto; margin-right: 5px; }
        .replica-score-val {
            font-size: 16px; font-family: sans-serif;
            letter-spacing: 0px; font-weight: 900;
        }

        .replica-new-icon { height: 14px; margin-left: auto; }

        /* 状态图标栏 */
        .replica-status-row { display: flex; align-items: center; margin-top: 2px; height: 22px; }
        .replica-status-icon { height: 100%; width: auto; margin-right: 4px; }

        /* 灰色滤镜 (用于未 FC 的情况) */
        .replica-status-icon.grayscale {
            filter: grayscale(100%);
            opacity: 0.6; /* 稍微降低不透明度 */
        }

        .replica-detail-btn, .replica-close-btn {
            display: block;
            background: linear-gradient(to bottom, #006699, #003366);
            color: #fff; text-align: center; font-weight: bold; font-size: 12px;
            padding: 4px; margin: 5px 5px 0 5px;
            border: 1px solid #fff; text-decoration: none; cursor: pointer;
        }
        .replica-close-btn {
            background: linear-gradient(to bottom, #555, #333);
            margin-top: 10px;
        }

        /* 详情面板样式 */
        .replica-detail-box {
            display: none;
            margin: 5px; padding: 5px;
            background-color: #1a1a1a;
            background-image: repeating-linear-gradient(-45deg, #1a1a1a, #1a1a1a 4px, #222 4px, #222 8px);
            border: 2px solid #333; color: #fff;
            font-family: "Arial", sans-serif; font-weight: bold;
        }
        .detail-combo-row {
            text-align: center; border-bottom: 2px solid #333; padding-bottom: 5px;
            margin-bottom: 5px; font-size: 14px; color: #ffcc00; text-shadow: 0 0 2px #000;
        }
        .detail-combo-val { font-size: 18px; color: #ffff00; }
        .detail-grid { display: flex; gap: 10px; }
        .detail-col-left { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .detail-col-right { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .judge-row {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #333; padding-bottom: 2px;
        }
        .judge-label { font-size: 12px; font-family: Impact, sans-serif; letter-spacing: 0.5px; }
        .judge-val { font-size: 16px; font-family: sans-serif; font-weight: bold; color: #ffcc00; text-align: right; }
        .label-jc { color: #fdfd1e; text-shadow: 0 0 2px #ff8800; }
        .label-j { color: #ffaa00; text-shadow: 0 0 2px #cc6600; }
        .label-a { color: #55ff55; text-shadow: 0 0 2px #00cc00; }
        .label-m { color: #aaaaaa; }
        .note-row {
            display: flex; justify-content: space-between; align-items: center;
            background-color: #111; padding: 2px 4px; border: 1px solid #333; font-size: 11px;
        }
        .note-label { font-weight: bold; }
        .note-val { color: #ff9999; font-family: monospace; font-size: 12px; }
        .label-tap { color: #ff5555; }
        .label-hold { color: #ffff55; }
        .label-slide { color: #55ffff; }
        .label-air { color: #55ff55; }
        .label-flick { color: #55ffff; }
    `);

    // --- 3. DOM 元素创建 ---
    const sidebar = document.createElement('div');
    sidebar.id = 'chuni-replica-sidebar';
    sidebar.innerHTML = `
        <div id="chuni-replica-toggle">◀</div>
        <div id="chuni-replica-content">
            <div class="replica-header">游玩记录</div>
            <div id="replica-list"></div>
        </div>
    `;
    document.body.appendChild(sidebar);

    const toggleBtn = sidebar.querySelector('#chuni-replica-toggle');

    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = sidebar.classList.toggle('expanded');
        toggleBtn.innerText = isExpanded ? '▶' : '◀';
    });

    const replicaList = sidebar.querySelector('#replica-list');

    // --- 4. 辅助函数 ---
    const RANK_MAP = {
        'd': 0, 'c': 1, 'b': 2, 'bb': 3, 'bbb': 4, 'a': 5, 'aa': 6, 'aaa': 7,
        's': 8, 's+': 9, 'ss': 10, 'ss+': 11, 'sss': 12, 'sss+': 13
    };

    function getRankImgUrl(imgSrc) {
        if (!imgSrc) return `${OFFICIAL_ASSETS.rankBase}0.png`;
        const match = imgSrc.match(/Result_([A-Z\+]+)\.webp/i);
        if (match && match[1]) {
            const rankKey = match[1].toLowerCase().replace('plus', '+');
            if (RANK_MAP.hasOwnProperty(rankKey)) {
                return `${OFFICIAL_ASSETS.rankBase}${RANK_MAP[rankKey]}.png`;
            }
        }
        return `${OFFICIAL_ASSETS.rankBase}8.png`;
    }

    // 新的获取状态图标逻辑 (返回对象: { url, isGray })
    function getStatusData(imgSrc) {
        // 如果没有图片 (即没有达成FC/AJ)，默认返回灰色的 FC 图标
        if (!imgSrc) return { url: OFFICIAL_ASSETS.fc, isGray: true };

        // 判定顺序：AJC > AJ > FC(Gold) > FC_Base(Gray)

        if (imgSrc.includes('_AJC')) {
            return { url: OFFICIAL_ASSETS.ajc, isGray: false };
        }

        if (imgSrc.includes('_AJ')) {
            return { url: OFFICIAL_ASSETS.aj, isGray: false };
        }

        // 只有明确是 _FC.webp (不带Base) 才是金 FC
        if (imgSrc.includes('_FC.webp')) {
            return { url: OFFICIAL_ASSETS.fc, isGray: false };
        }

        // _FC_Base.webp 或其他情况，显示灰色 FC
        return { url: OFFICIAL_ASSETS.fc, isGray: true };
    }

    function getLevelImgUrl(diffClass) {
        if (!diffClass) return OFFICIAL_ASSETS.level.master;
        if (diffClass.includes('difficulty-4')) return OFFICIAL_ASSETS.level.ultima;
        if (diffClass.includes('difficulty-5')) return OFFICIAL_ASSETS.level.worldsend;
        if (diffClass.includes('difficulty-3')) return OFFICIAL_ASSETS.level.master;
        if (diffClass.includes('difficulty-2')) return OFFICIAL_ASSETS.level.expert;
        if (diffClass.includes('difficulty-1')) return OFFICIAL_ASSETS.level.advanced;
        if (diffClass.includes('difficulty-0')) return OFFICIAL_ASSETS.level.basic;
        return OFFICIAL_ASSETS.level.master;
    }

    function formatScore(score) {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // --- 5. 核心逻辑 ---
    let updateTimeout = null;

    function updateReplica() {
        const sourceCards = document.querySelectorAll('app-v2-recent .card');
        if (sourceCards.length === 0) return;

        const container = document.createElement('div');

        sourceCards.forEach(card => {
            const jacketSrc = card.querySelector('.jacket')?.src || '';

            let trackText = card.querySelector('.track span')?.innerText || 'Track 1';
            trackText = trackText.replace('Track.', 'Track ');

            const diffEl = card.querySelector('.difficulty');
            const diffContainer = diffEl ? diffEl.parentElement : null;
            const diffClass = diffContainer ? diffContainer.className : 'difficulty-3';

            const title = card.querySelector('.title')?.innerText || 'Unknown';
            const scoreText = card.querySelector('.score')?.innerText || '0';
            const scoreFormatted = formatScore(scoreText);

            const isNew = !!card.querySelector('.new-record-badge.new-record');

            const resultCharEl = card.querySelector('.result-char');
            const resultCharImg = resultCharEl ? resultCharEl.src : '';
            const resultPlusImg = card.querySelector('.result-plus');
            let rankUrl = getRankImgUrl(resultCharImg);
            if (resultPlusImg) {
                const match = resultCharImg.match(/Result_([A-Z]+)\.webp/i);
                if (match) {
                    const baseRank = match[1].toLowerCase();
                    const baseIndex = RANK_MAP[baseRank];
                    if (baseIndex !== undefined) {
                        rankUrl = `${OFFICIAL_ASSETS.rankBase}${baseIndex + 1}.png`;
                    }
                }
            }

            const honorEl = card.querySelector('.honor');
            const honorImg = honorEl ? honorEl.src : '';

            // 获取状态数据 (URL 和 是否变灰)
            const statusData = getStatusData(honorImg);

            const timeText = card.querySelector('.card-footer .float-end')?.innerText.trim() || '';

            // 表格数据
            const getTableVal = (selector) => {
                const el = card.querySelector(selector);
                return el ? el.nextElementSibling.innerText.trim() : '-';
            };
            const jcVal = getTableVal('.judge-justice-critical');
            const jVal = getTableVal('.judge-justice');
            const attVal = getTableVal('.judge-attack');
            const missVal = getTableVal('.judge-miss');
            const tapPct = getTableVal('.judge-tap');
            const holdPct = getTableVal('.judge-hold');
            const slidePct = getTableVal('.judge-slide');
            const airPct = getTableVal('.judge-air');
            const flickPct = getTableVal('.judge-flick');
            let maxCombo = '0';
            const rows = card.querySelectorAll('table tbody tr');
            if (rows.length > 0) {
                const lastRow = rows[rows.length - 1];
                const tds = lastRow.querySelectorAll('td');
                if (tds.length > 0) maxCombo = tds[0].innerText.trim();
            }

            const cardDiv = document.createElement('div');
            cardDiv.className = 'replica-card';

            // 构建 HTML，注意 status 的 class 处理
            cardDiv.innerHTML = `
                <div class="replica-time">${timeText}</div>
                <div class="replica-body">
                    <div class="replica-jacket"><img src="${jacketSrc}"></div>
                    <div class="replica-info">
                        <div class="replica-diff-bar">
                            <span class="replica-track-num">${trackText}</span>
                            <img src="${getLevelImgUrl(diffClass)}" class="replica-diff-icon">
                        </div>
                        <div class="replica-title">${title}</div>
                        <div class="replica-score-row">
                            <img src="${OFFICIAL_ASSETS.scoreLabel}" class="replica-score-label-img">
                            <span class="replica-score-val">${scoreFormatted}</span>
                            ${isNew ? `<img src="${OFFICIAL_ASSETS.newRecord}" class="replica-new-icon">` : ''}
                        </div>
                        <div class="replica-status-row">
                            <img src="${statusData.url}" class="replica-status-icon ${statusData.isGray ? 'grayscale' : ''}">
                            <img src="${rankUrl}" class="replica-status-icon">
                        </div>
                    </div>
                </div>
                <div class="replica-detail-btn">查看详细</div>
                <div class="replica-detail-box">
                    <div class="detail-combo-row">MAX COMBO : <span class="detail-combo-val">${maxCombo}</span></div>
                    <div class="detail-grid">
                        <div class="detail-col-left">
                            <div class="judge-row"><span class="judge-label label-jc">JUSTICE<br><span style="font-size:0.7em">CRITICAL</span></span> <span class="judge-val">${jcVal}</span></div>
                            <div class="judge-row"><span class="judge-label label-j">JUSTICE</span> <span class="judge-val">${jVal}</span></div>
                            <div class="judge-row"><span class="judge-label label-a">ATTACK</span> <span class="judge-val">${attVal}</span></div>
                            <div class="judge-row"><span class="judge-label label-m">MISS</span> <span class="judge-val">${missVal}</span></div>
                        </div>
                        <div class="detail-col-right">
                            <div class="note-row"><span class="note-label label-tap">TAP</span> <span class="note-val">${tapPct}</span></div>
                            <div class="note-row"><span class="note-label label-hold">HOLD</span> <span class="note-val">${holdPct}</span></div>
                            <div class="note-row"><span class="note-label label-slide">SLIDE</span> <span class="note-val">${slidePct}</span></div>
                            <div class="note-row"><span class="note-label label-air">AIR</span> <span class="note-val">${airPct}</span></div>
                            <div class="note-row"><span class="note-label label-flick">FLICK</span> <span class="note-val">${flickPct}</span></div>
                        </div>
                    </div>
                    <div class="replica-close-btn">收起</div>
                </div>
            `;

            const detailBtn = cardDiv.querySelector('.replica-detail-btn');
            const closeBtn = cardDiv.querySelector('.replica-close-btn');
            const detailBox = cardDiv.querySelector('.replica-detail-box');

            detailBtn.addEventListener('click', () => {
                detailBox.style.display = 'block';
                detailBtn.style.display = 'none';
            });

            closeBtn.addEventListener('click', () => {
                detailBox.style.display = 'none';
                detailBtn.style.display = 'block';
            });

            container.appendChild(cardDiv);
        });

        replicaList.innerHTML = '';
        replicaList.appendChild(container);
    }

    // --- 6. 监听变化 ---
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.target.closest && mutation.target.closest('#chuni-replica-sidebar')) {
                continue;
            }
            if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                shouldUpdate = true;
            }
        }

        if (shouldUpdate) {
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateReplica, 200);
        }
    });

    setTimeout(() => {
        const targetNode = document.querySelector('app-root') || document.body;
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
            updateReplica();
        }
    }, 1500);

})();