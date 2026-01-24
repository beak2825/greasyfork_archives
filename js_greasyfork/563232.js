// ==UserScript==
// @name         Codeforces Visual Enhancer (Dynamic Elo Tier)
// @namespace    http://tampermonkey.net/
// @version      4.7
// @license      MIT
// @description  rank 排名着色，提交结果流光效果
// @author       Gemini & Guanglong Shen
// @match        https://codeforces.com/*
// @match        http://codeforces.com/*
// @match        https://mirror.codeforces.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563232/Codeforces%20Visual%20Enhancer%20%28Dynamic%20Elo%20Tier%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563232/Codeforces%20Visual%20Enhancer%20%28Dynamic%20Elo%20Tier%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 高级配置区 ---
    const BASE_THRESHOLDS = {
        LGM: 0.0006, GM: 0.0037, MAS: 0.0064, CM: 0.0512, EXP: 0.1213, SPC: 0.2189, PPL: 0.3986
    };

    // 1. 样式定义
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shine-slide {
            0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
            5% { opacity: 1; }
            20% { transform: translateX(250%) skewX(-25deg); opacity: 1; }
            100% { transform: translateX(250%) skewX(-25deg); opacity: 0; }
        }
        .tm-vfx-base { position: relative; display: inline-block; overflow: hidden; vertical-align: middle; line-height: inherit; !important; font-weight: bold !important; padding: 0 2px; }
        .tm-vfx-base::after { content: ''; position: absolute; top: 0; left: 0; width: 60%; height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%);
            animation: shine-slide 2.5s ease-in-out infinite; pointer-events: none; }

        .rank-lgm { color: #aa0000 !important; font-weight: bold; }
        .rank-lgm::first-letter { color: #000000 !important; }
        .rank-gm { color: #ff0000 !important; font-weight: bold; }
        .rank-master { color: #ff8c00 !important; font-weight: bold; }
        .rank-cm { color: #aa00aa !important; font-weight: bold; }
        .rank-expert { color: #0000ff !important; font-weight: bold; }
        .rank-specialist { color: #03a89e !important; font-weight: bold; }
        .rank-pupil { color: #008000 !important; font-weight: bold; }
        .rank-newbie { color: #808080 !important; font-weight: bold; }

        /* 修改：层级信息样式 - 右对齐且不设固定颜色 */
        .tm-tier-info {
            float: right;
            font-size: 0.9em;
            font-weight: bold !important;
            margin-left: 10px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            line-height: 1.2;
        }

        .tm-ac { color: #00a900 !important; }
        .tm-pre { color: #006400 !important; }
        .tm-wa { color: #ff0000 !important; }
        .tm-orange { color: #FF8C00 !important; }
        .tm-blue { color: #00008B !important; }
        .tm-hack { color: #B8860B !important; }
    `;
    document.head.appendChild(style);

    // 2. 获取有效人数
    function getTotalParticipants() {
        const allRows = document.querySelectorAll('.standings tr');
        let statRow = null;
        for (let row of allRows) {
            if (row.innerText.includes('Accepted')) {
                statRow = row;
                break;
            }
        }
        if (!statRow) {
            const pagination = document.querySelector('.pagination');
            if (pagination) {
                const match = pagination.innerText.match(/of\s+(\d+)/);
                if (match) return parseInt(match[1]);
            }
            return 8500;
        }
        const acceptedCounts = [];
        const cells = statRow.querySelectorAll('td');
        cells.forEach(cell => {
            const numbers = cell.innerText.match(/\d+/g);
            if (numbers && numbers.length > 0) {
                acceptedCounts.push(parseInt(numbers[0])); // 只取 Accepted 数
            }
        });
        return acceptedCounts.length > 0 ? Math.max(...acceptedCounts) : 8500;
    }

    // 3. 计算动态阈值
    function getDynamicThresholds(N) {
        const baseline = 8000;
        let ratio = N / baseline;
        if (ratio < 1) ratio = 1;
        const compression = Math.pow(ratio, 0.4);

        return {
            LGM: BASE_THRESHOLDS.LGM / compression,
            GM:  BASE_THRESHOLDS.GM / compression,
            MAS: BASE_THRESHOLDS.MAS / compression,
            CM:  BASE_THRESHOLDS.CM / compression,
            EXP: BASE_THRESHOLDS.EXP,
            SPC: BASE_THRESHOLDS.SPC,
            PPL: BASE_THRESHOLDS.PPL
        };
    }

    // 4. 排名染色及 Who 列增强
    function applyRankColoring() {
        const total = getTotalParticipants();
        const thresholds = getDynamicThresholds(total);
        const rankCells = document.querySelectorAll('.standings td:first-child:not(.header)');

        const tierBounds = [
            { cls: 'rank-lgm', minP: 0, maxP: thresholds.LGM },
            { cls: 'rank-gm', minP: thresholds.LGM, maxP: thresholds.GM },
            { cls: 'rank-master', minP: thresholds.GM, maxP: thresholds.MAS },
            { cls: 'rank-cm', minP: thresholds.MAS, maxP: thresholds.CM },
            { cls: 'rank-expert', minP: thresholds.CM, maxP: thresholds.EXP },
            { cls: 'rank-specialist', minP: thresholds.EXP, maxP: thresholds.SPC },
            { cls: 'rank-pupil', minP: thresholds.SPC, maxP: thresholds.PPL },
            { cls: 'rank-newbie', minP: thresholds.PPL, maxP: 1.0 }
        ];

        // 自动定位 Who 列索引 (防止列顺序变动)
        let whoIndex = 2;
        const headerCells = document.querySelectorAll('.standings th');
        headerCells.forEach((th, idx) => { if(th.innerText.includes('Who')) whoIndex = idx; });

        rankCells.forEach(cell => {
            if (cell.dataset.rankApplied) return;
            const text = cell.innerText.trim();
            if (!text) return;

            let rank = 0;
            const parenMatch = text.match(/\((\d+)\)/); //
            rank = parenMatch ? parseInt(parenMatch[1]) : parseInt(text);
            if (!rank || isNaN(rank)) return;

            const p = rank / total;
            let targetTier = tierBounds[tierBounds.length - 1];

            for (const tier of tierBounds) {
                if (p < tier.maxP) {
                    targetTier = tier;
                    break;
                }
            }

            // 排名列颜色应用
            cell.classList.remove('rank-lgm','rank-gm','rank-master','rank-cm','rank-expert','rank-specialist','rank-pupil','rank-newbie');
            cell.classList.add(targetTier.cls);
            cell.dataset.rankApplied = 'true';

            // 可选：鼠标悬停显示计算的百分比（Debug用）
            cell.title = `Rank: ${rank}/${total} (Top ${(p*100).toFixed(2)}%)`;

            // 计算层级区间信息
            const A = Math.max(1, Math.floor(targetTier.minP * total) + 1);
            const B = Math.floor(targetTier.maxP * total);
            let C = ((rank - A) / Math.max(1, B - A)) * 100;
            C = Math.max(0, Math.min(100, C)).toFixed(1);

            // 注入 Who 列
            const row = cell.parentElement;
            const whoCell = row.cells[whoIndex];
            if (whoCell) {
                // 清理可能存在的旧标签
                const oldInfo = whoCell.querySelector('.tm-tier-info');
                if (oldInfo) oldInfo.remove();

                const infoSpan = document.createElement('span');
                // 关键点：infoSpan 使用和排名一样的 class 来获得颜色
                infoSpan.className = `tm-tier-info ${targetTier.cls}`;
                infoSpan.innerText = `\t(${A}~${B}, ${C}%)`;

                // 确保 Who 单元格内容左对齐，而 span 向右浮动
                whoCell.style.textAlign = 'left';
                whoCell.appendChild(infoSpan);
                whoCell.title = `Tier Range: ${A}~${B}, you are ≈ ${C}% into this tier.`;
            }
        });
    }

    // 5. Verdict 流光 (保持不变)
    function applyVerdictVFX() {
        const verdicts = document.querySelectorAll('span.verdict-accepted, span.verdict-rejected, span.verdict-failed, span.submissionVerdictWrapper, .popup-content span');
        verdicts.forEach(el => {
            if (el.dataset.vfxApplied) return;
            const text = el.innerText.trim();
            if (!text || text.length < 2) return;
            el.classList.add('tm-vfx-base');
            if (text.includes('Accepted') || text.includes('passed')) el.classList.add('tm-ac');
            else if (text.includes('Pretests')) el.classList.add('tm-pre');
            else if (text.includes('Wrong')) el.classList.add('tm-wa');
            else if (text.includes('error')) el.classList.add('tm-orange');
            else if (text.includes('limit')) el.classList.add('tm-blue');
            else if (text.includes('Hacked')) el.classList.add('tm-hack');
            el.dataset.vfxApplied = 'true';
        });
    }

    const run = () => { applyRankColoring(); applyVerdictVFX(); };
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
    run();
})();