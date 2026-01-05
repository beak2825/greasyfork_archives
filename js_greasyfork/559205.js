// ==UserScript==
// @name         Everyday Profit Plus
// @namespace    http://tampermonkey.net/
// @version      2025.12.22.7
// @description  在原 Everyday Profit 基础上增强：保留原“总净资产”历史与标签；新增每日盈亏柱状图+均线、导出/导入备份、数据管理（编辑/删除/异常清理）、以及 MWITools 资产分项（装备/库存/订单/房子/技能）变化图（单按钮切换）
// @author       VictoryWinWinWin, PaperCat, SuXingX
// @match        https://www.milkywayidle.com/*
// @match        https://*.milkywayidlecn.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559205/Everyday%20Profit%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/559205/Everyday%20Profit%20Plus.meta.js
// ==/UserScript==


/*
MIT License

Copyright (c) 2025 VictoryWinWinWin, PaperCat, SuXingX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    /* =========================
       Styles
    ========================= */
    GM_addStyle(`
        #deltaNetworthChartModal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            max-width: 94vw;
            background: #1e1e1e;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.6);
            z-index: 9999;
            display: none;
            flex-direction: column;
            color: #f5f5f5;
            border: 1px solid rgba(255,255,255,0.08);
        }
        #deltaNetworthChartModal.dragging { cursor: grabbing; }

        #deltaNetworthChartHeader {
            padding: 10px 15px;
            background: #333;
            color: white;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        #deltaNetworthChartControls {
            padding: 10px;
            text-align: center;
            background: #0c141f;
            border-top: 1px solid rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        #deltaNetworthChartControls button {
            background: #2b303a;
            color: #f0f0f0;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            transition: background 0.2s ease, transform 0.2s ease;
            min-width: 74px;
            margin: 5px;
            padding: 6px 12px;
            cursor: pointer;
        }
        #deltaNetworthChartControls button:hover {
            background: #3f4655;
            transform: translateY(-1px);
        }
        #deltaNetworthChartControls button.active {
            background: #00c6ff;
            color: #0b1522;
            box-shadow: 0 0 10px rgba(0,198,255,0.5);
            border-color: transparent;
        }

        #netWorthChartBody {
            padding: 15px;
            background: #0b1522;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        #netWorthChart {
            width: 100%;
            height: 340px;
            background: radial-gradient(circle at top, rgba(0,198,255,0.08), rgba(2,12,24,0.95));
            border-radius: 6px;
        }

        .ep-delta-extra {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 6px;
            font-size: 14px;
            color: #cfd8e3;
        }
        .ep-delta-extra span {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 4px;
            padding: 3px 8px;
        }
        
        .ep-metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            padding: 10px 15px;
            background: #111b2b;
            border-top: 1px solid rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        @media (max-width: 720px) {
            .ep-metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 420px) {
            .ep-metrics-grid { grid-template-columns: 1fr; }
        }

        .ep-metric-card {
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }
        .ep-metric-card h4 {
            font-size: 12px;
            font-weight: normal;
            color: #9fb4d1;
            margin: 0;
        }
        .ep-metric-card strong {
            font-size: 18px;
            color: #f7fafc;
            word-break: break-word;
        }
        .ep-metric-card span {
            font-size: 12px;
            color: #7f8ca3;
            word-break: break-word;
        }
.ep-inline-group {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .ep-tag-toggle {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: #dfe7f3;
            font-size: 13px;
            margin-left: 8px;
        }

        .ep-tag-manager, .ep-data-manager {
            padding: 10px 15px 10px;
            background: #0c141f;
            border-top: 1px solid rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            display: none;
        }
        .ep-tag-manager.active, .ep-data-manager.active { display: block; }

        .ep-tag-form {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
            margin-bottom: 8px;
        }
        .ep-tag-form select, .ep-tag-form input {
            flex: 1 1 160px;
            min-width: 120px;
            padding: 5px 8px;
            background: #0f1b2b;
            color: #e5f4ff;
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 4px;
        }
        .ep-tag-form button {
            padding: 6px 14px;
            background: #1f8ef1;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
        }
        .ep-tag-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            max-height: 160px;
            overflow-y: auto;
        }
        .ep-tag-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 13px;
            color: #dfe7f3;
            gap: 10px;
        }
        .ep-tag-item strong { color: #ffd369; margin-right: 6px; }
        .ep-tag-actions { display: inline-flex; gap: 6px; flex: 0 0 auto; }
        .ep-tag-edit, .ep-tag-delete {
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 14px;
            color: #9cc2ff;
        }
        .ep-tag-delete { color: #ff6b6b; }
        .ep-tag-empty { color: #70819d; font-size: 13px; }

        .ep-data-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .ep-data-toolbar .left, .ep-data-toolbar .right {
            display: inline-flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }
        .ep-data-toolbar button {
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.12);
            background: #2b303a;
            color: #f0f0f0;
            cursor: pointer;
        }
        .ep-data-toolbar button.danger {
            border-color: rgba(255,107,107,0.5);
            color: #ffb3b3;
        }
        .ep-data-toolbar button.primary {
            border-color: rgba(0,198,255,0.35);
            color: #c9f3ff;
        }
        .ep-data-toolbar small { color: #8aa0be; }

        .ep-data-table-wrap {
            max-height: 240px;
            overflow: auto;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
        }
        .ep-data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        .ep-data-table th, .ep-data-table td {
            padding: 8px 10px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            vertical-align: middle;
        }
        .ep-data-table th {
            text-align: left;
            color: #9fb4d1;
            background: rgba(255,255,255,0.04);
            position: sticky;
            top: 0;
            z-index: 1;
        }
        .ep-data-table td { color: #dfe7f3; }
        .ep-data-table .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .ep-data-table .actions {
            display: inline-flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .ep-data-table .actions button {
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.06);
            color: #e5f4ff;
            cursor: pointer;
        }
        .ep-data-table .actions button.danger {
            border-color: rgba(255,107,107,0.55);
            color: #ffd0d0;
        }
        .ep-note {
            margin-top: 8px;
            color: #8aa0be;
            font-size: 12px;
            text-align: left;
            line-height: 1.4;
        }
        /* EP+ Header logos (consistent badges) */
        #epCrocLogo,
#epCrocLogo span {
            font-size: 16px;
            line-height: 1;
            filter: drop-shadow(0 0 6px rgba(0, 198, 255, 0.35));
        }
        #epPaperCatLogo {
            color: #e5f4ff; /* SVG stroke uses currentColor */
        }

        /* --- EP+ Modal usability fixes: prevent over-tall modal & keep controls reachable --- */
        #deltaNetworthChartModal {
            max-height: 92vh;
            overflow-y: auto;
        }
        #deltaNetworthChartHeader {
            position: sticky;
            top: 0;
            z-index: 10002;
        }
        #deltaNetworthChartControls {
            position: sticky;
            top: 44px; /* below header */
            z-index: 10001;
        }
        /* Make managers independently scrollable to avoid extreme modal height */
        .ep-tag-manager.active { max-height: 34vh; overflow: auto; }
        .ep-data-manager.active { max-height: 42vh; overflow: auto; }


        /* --- EP+ Manager layout: avoid tiny inner scroll areas when both managers are open --- */
        .ep-tag-manager.active,
        .ep-data-manager.active {
            max-height: none !important;
            overflow: visible !important;
        }


        /* --- EP+ Precision hint banner (dismissible) --- */
        #epPrecisionHint {
            margin-top: 8px;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.14);
            background: rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            color: rgba(255, 255, 255, 0.92);
            font-size: 13px;
            line-height: 1.45;
        }
        #epPrecisionHint code {
            padding: 1px 6px;
            border-radius: 6px;
            background: rgba(0, 198, 255, 0.12);
            border: 1px solid rgba(0, 198, 255, 0.22);
            color: rgba(255, 255, 255, 0.95);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 12px;
        }
        .epPrecisionHintActions {
            margin-top: 8px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .epPrecisionHintBtn {
            padding: 6px 10px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.92);
            cursor: pointer;
            font-size: 12px;
        }
        .epPrecisionHintBtn:hover {
            background: rgba(255, 255, 255, 0.10);
        }

`);

    /* =========================
       Constants / Utilities
    ========================= */
    const STORAGE_KEYS = {
        totalData: 'kbd_calc_data',                 // 保持原 key，不改动
        tags: 'kbd_calc_tags',                      // 保持原 key，不改动
        tagPrefs: 'kbd_calc_tag_prefs',
        tagPanel: 'kbd_calc_tag_panel',
        dataPanel: 'kbd_calc_data_panel',
        lastUpdate: 'kbd_calc_last_update_at',
        breakdownData: 'kbd_calc_breakdown_data',   // 新增：分项数据
    };

    const CHART_JS_SRC = [
        'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.3/chart.umd.min.js',
        'https://unpkg.com/chart.js@4.4.3/dist/chart.umd.min.js',
    ];
    const PLUGIN_SOURCES = {
        zoom: [
            'https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js',
            'https://unpkg.com/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js',
        ],
        crosshair: [
            'https://cdn.jsdelivr.net/npm/chartjs-plugin-crosshair@2.0.0/dist/chartjs-plugin-crosshair.min.js',
            'https://unpkg.com/chartjs-plugin-crosshair@2.0.0/dist/chartjs-plugin-crosshair.min.js',
        ],
    };
    const SCRIPT_IDS = {
        chart: 'everyday-profit-chartjs',
        zoom: 'everyday-profit-zoom',
        crosshair: 'everyday-profit-crosshair',
    };

    const CHART_THEME = {
        lineColor: 'rgba(0, 198, 255, 0.9)',
        fillColor: 'rgba(0, 198, 255, 0.15)',
        pointColor: '#00c6ff',
        pointBorder: '#08111f',
        gridColor: 'rgba(255,255,255,0.08)',
        tickColor: '#d4d7dd',
        tooltipBg: 'rgba(8, 17, 31, 0.92)',
        tooltipColor: '#e5f4ff',
        profitMAColor: 'rgba(255, 211, 105, 0.95)',
        profitPos: 'rgba(0, 220, 140, 0.55)',
        profitNeg: 'rgba(255, 99, 132, 0.55)',
        breakdownEquip: 'rgba(0, 198, 255, 0.55)',
        breakdownInv: 'rgba(255, 211, 105, 0.55)',
        breakdownOrder: 'rgba(142, 202, 230, 0.55)',
        breakdownHouse: 'rgba(255, 99, 132, 0.55)',
        breakdownSkill: 'rgba(167, 139, 250, 0.55)',
        breakdownTotalLine: 'rgba(255,255,255,0.85)',
    };

    const TAG_LABEL_PLUGIN_ID = 'epTagLabels';
    const TAG_TEXT_MAX = 60;

    const safeJsonParse = (raw, fallback) => {
        try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
    };

    const escapeHtml = (str = '') => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const sanitizeTagText = (text = '') => text.replace(/\s+/g, ' ').trim().slice(0, TAG_TEXT_MAX);

    function parseFormattedNumber(str) {
        if (!str) return 0;
        const match = String(str).match(/(-?[\d.,]+)\s*([kKmMbBtT]?)/);
        if (!match) return 0;

        let [, numericPart, unit = ''] = match;
        numericPart = numericPart.replace(/\s+/g, '');
        if (!numericPart) return 0;

        const commaCount = (numericPart.match(/,/g) || []).length;
        const dotCount = (numericPart.match(/\./g) || []).length;

        if (commaCount && dotCount) {
            if (numericPart.lastIndexOf('.') > numericPart.lastIndexOf(',')) {
                numericPart = numericPart.replace(/,/g, '');
            } else {
                numericPart = numericPart.replace(/\./g, '');
                numericPart = numericPart.replace(/,/g, '.');
            }
        } else if (commaCount) {
            if (commaCount === 1 && numericPart.split(',')[1]?.length <= 2) numericPart = numericPart.replace(',', '.');
            else numericPart = numericPart.replace(/,/g, '');
        } else if (dotCount > 1) {
            const parts = numericPart.split('.');
            const decimal = parts.pop();
            numericPart = parts.join('') + (decimal ? `.${decimal}` : '');
        }

        const num = parseFloat(numericPart);
        if (isNaN(num)) return 0;

        const multiplierMap = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };
        const multiplier = multiplierMap[(unit || '').toLowerCase()] || 1;
        return num * multiplier;
    }

    function formatLargeNumber(num) {
        const n = Number(num) || 0;
        const abs = Math.abs(n);
        if (abs >= 1e12) return (n / 1e12).toFixed(2) + 'T';
        if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (abs >= 1e6) return (n / 1e6).toFixed(2) + 'M';
        if (abs >= 1e3) return (n / 1e3).toFixed(2) + 'K';
        return String(n);
    }
    const formatSignedLargeNumber = (num) => {
        const n = Number(num) || 0;
        return n > 0 ? `+${formatLargeNumber(n)}` : formatLargeNumber(n);
    };

    const downloadTextFile = (filename, text, mime = 'application/json;charset=utf-8') => {
        const blob = new Blob([text], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const getNowStamp = () => {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    };
    const readRoleLastUpdateMap = () => safeJsonParse(localStorage.getItem(STORAGE_KEYS.lastUpdate), {});
    const writeRoleLastUpdateMap = (map) => localStorage.setItem(STORAGE_KEYS.lastUpdate, JSON.stringify(map || {}));
    const setRoleLastUpdate = (roleId, iso = new Date().toISOString()) => {
        if (!roleId) return;
        const map = readRoleLastUpdateMap();
        map[roleId] = iso;
        writeRoleLastUpdateMap(map);
    };
    const getRoleLastUpdate = (roleId) => {
        if (!roleId) return null;
        const map = readRoleLastUpdateMap();
        return map && map[roleId] ? map[roleId] : null;
    };
    const formatIsoToLocalDateTime = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (!Number.isFinite(d.getTime())) return String(iso);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };



    /* =========================
       Tag label plugin (keep)
    ========================= */
    const drawRoundedRect = (ctx, x, y, width, height, radius = 6) => {
        const r = Math.min(radius, height / 2, width / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };

    const tagLabelPlugin = {
        id: TAG_LABEL_PLUGIN_ID,
        defaults: {
            minGap: 45,
            stackSpacing: 6,
            boxPadding: { x: 6, y: 3 },
            font: { size: 11, family: 'Segoe UI, "Microsoft YaHei", sans-serif' },
            boxColor: 'rgba(255, 229, 153, 0.98)',
            borderColor: 'rgba(255, 196, 77, 0.9)',
            textColor: '#0b1522',
            lineColor: '#ffd369',
            pointColor: '#ff6b6b',
        },
        afterDatasetsDraw(chart, args, opts) {
            if (opts?.enabled === false) return;
            const tags = opts?.tags;
            if (!Array.isArray(tags) || !tags.length) return;

            const dataset = chart.data.datasets?.[0];
            if (!dataset) return;

            const xScale = chart.scales.x;
            const yScale = chart.scales.y;
            if (!xScale || !yScale) return;

            const area = chart.chartArea;
            const ctx = chart.ctx;
            const settings = { ...this.defaults, ...opts };

            ctx.save();
            ctx.font = `${settings.font.size}px ${settings.font.family}`;
            ctx.textBaseline = 'middle';

            const items = tags
                .map((tag) => {
                    const index = chart.data.labels.indexOf(tag.date);
                    if (index === -1) return null;
                    const value = dataset.data?.[index];
                    return { ...tag, index, value };
                })
                .filter(Boolean)
                .sort((a, b) => a.index - b.index);

            let lastX = -Infinity;
            let stackLevel = 0;

            items.forEach((tag) => {
                const x = xScale.getPixelForValue(tag.index);
                const baseY = yScale.getPixelForValue(tag.value);
                if (!Number.isFinite(x) || !Number.isFinite(baseY)) return;

                if (Math.abs(x - lastX) < settings.minGap) stackLevel += 1;
                else stackLevel = 0;
                lastX = x;

                const text = tag.text ?? '';
                const textWidth = ctx.measureText(text).width;
                const boxWidth = textWidth + settings.boxPadding.x * 2;
                const boxHeight = settings.font.size + settings.boxPadding.y * 2;
                const stackOffset = stackLevel * (boxHeight + settings.stackSpacing + 6);

                let anchorAbove = true;
                let boxY = baseY - (boxHeight + 12 + stackOffset);
                if (boxY < area.top + 4) {
                    anchorAbove = false;
                    boxY = baseY + (12 + stackOffset);
                    if (boxY + boxHeight > area.bottom - 4) {
                        boxY = Math.max(area.top + 4, area.bottom - boxHeight - 4);
                    }
                }
                let boxX = x - boxWidth / 2;
                if (boxX < area.left + 4) boxX = area.left + 4;
                else if (boxX + boxWidth > area.right - 4) boxX = area.right - boxWidth - 4;

                const pointerX = Math.min(Math.max(x, boxX + 4), boxX + boxWidth - 4);
                const pointerY = anchorAbove ? boxY + boxHeight : boxY;

                ctx.strokeStyle = settings.lineColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pointerX, pointerY);
                ctx.lineTo(x, baseY);
                ctx.stroke();

                ctx.fillStyle = settings.boxColor;
                ctx.strokeStyle = settings.borderColor;
                drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 6);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = settings.textColor;
                ctx.fillText(text, boxX + settings.boxPadding.x, boxY + boxHeight / 2);

                ctx.fillStyle = settings.pointColor;
                ctx.beginPath();
                ctx.arc(x, baseY, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
        },
    };

    /* =========================
       Script loader (Chart.js + plugins)
    ========================= */
    const scriptPromises = {};
    const loadScriptOnce = (id, srcOrList) => {
        if (scriptPromises[id]) return scriptPromises[id];
        if (document.getElementById(id)) {
            scriptPromises[id] = Promise.resolve();
            return scriptPromises[id];
        }
        const sources = Array.isArray(srcOrList) ? srcOrList : [srcOrList];
        const tryLoad = (index) => new Promise((resolve, reject) => {
            if (index >= sources.length) {
                reject(new Error(`脚本加载失败: ${sources.join(', ')}`));
                return;
            }
            const script = document.createElement('script');
            script.id = id;
            script.src = sources[index];
            script.async = true;
            script.onload = resolve;
            script.onerror = () => {
                script.remove();
                tryLoad(index + 1).then(resolve).catch(reject);
            };
            document.head.appendChild(script);
        });
        scriptPromises[id] = tryLoad(0);
        scriptPromises[id].catch(() => { delete scriptPromises[id]; });
        return scriptPromises[id];
    };

    const hasPluginRegistered = (pluginId) => {
        if (typeof Chart === 'undefined') return false;
        try {
            if (typeof Chart.registry?.getPlugin === 'function') return !!Chart.registry.getPlugin(pluginId);
        } catch {}
        const pluginsArray = Chart.plugins?.plugins;
        if (Array.isArray(pluginsArray)) return pluginsArray.some((p) => p.id === pluginId);
        return false;
    };

    const ensurePluginLoaded = async (pluginId, scriptId, src) => {
        if (hasPluginRegistered(pluginId)) return;
        await loadScriptOnce(scriptId, src);
        if (!hasPluginRegistered(pluginId)) throw new Error(`${pluginId} 插件注册失败`);
    };

    let chartAssetsPromise = null;
    const ensureChartAssets = () => {
        if (!chartAssetsPromise) {
            chartAssetsPromise = (async () => {
                if (typeof Chart === 'undefined') await loadScriptOnce(SCRIPT_IDS.chart, CHART_JS_SRC);
                if (!hasPluginRegistered(TAG_LABEL_PLUGIN_ID)) Chart.register(tagLabelPlugin);
                await ensurePluginLoaded('zoom', SCRIPT_IDS.zoom, PLUGIN_SOURCES.zoom);
                await ensurePluginLoaded('crosshair', SCRIPT_IDS.crosshair, PLUGIN_SOURCES.crosshair);
            })().catch((err) => {
                chartAssetsPromise = null;
                throw err;
            });
        }
        return chartAssetsPromise;
    };

    const enqueueChartReady = (callback) => {
        ensureChartAssets()
            .then(() => { try { callback(); } catch (err) { console.error('渲染图表出错:', err); } })
            .catch((err) => console.error('图表依赖加载失败:', err));
    };

    const cleanupScaleLimits = (scaleLike) => {
        if (!scaleLike) return;
        if (scaleLike.options) { delete scaleLike.options.min; delete scaleLike.options.max; }
        if ('min' in scaleLike) delete scaleLike.min;
        if ('max' in scaleLike) delete scaleLike.max;
    };
    const resetChartZoom = (chartInstance) => {
        if (!chartInstance) return;
        try { if (typeof chartInstance.resetZoom === 'function') chartInstance.resetZoom(); } catch {}
        cleanupScaleLimits(chartInstance.options?.scales?.x);
        cleanupScaleLimits(chartInstance.options?.scales?.y);
        cleanupScaleLimits(chartInstance.scales?.x);
        cleanupScaleLimits(chartInstance.scales?.y);
    };

    /* =========================
       Role detection (compat)
    ========================= */
    const normalizeRole = (s) => (s || '').replace(/\s+/g, ' ').trim();

    const detectRoleId = () => {
        const candidates = [
            document.querySelector('.CharacterName_name__1amXp span'),
            document.querySelector('[class*="CharacterName_name"] span'),
            document.querySelector('[data-testid="character-name"]'),
        ];
        const text = normalizeRole(candidates.find(Boolean)?.textContent);
        if (text) return text;

        // fallback: if storage only has 1 role, use it (helps “读回旧数据”)
        const data = safeJsonParse(localStorage.getItem(STORAGE_KEYS.totalData), {});
        const roles = Object.keys(data || {});
        if (roles.length === 1) return roles[0];

        return 'default';
    };

    /* =========================
       MWITools breakdown reader
    ========================= */
    const BREAKDOWN_DEFS = [
        { key: 'equip', label: '装备', color: 'rgba(0, 198, 255, 0.55)', patterns: [
            /装备价值\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/,
            /Equipment\s*Value\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/i,
            /Gear\s*Value\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/i,
        ]},
        { key: 'inventory', label: '库存', color: 'rgba(255, 211, 105, 0.55)', patterns: [
            /库存价值\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/,
            /Inventory\s*Value\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/i,
        ]},
        { key: 'orders', label: '订单', color: 'rgba(142, 202, 230, 0.55)', patterns: [
            /订单价值\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/,
            /Order(?:s)?\s*Value\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/i,
        ]},
        { key: 'house', label: '房子', color: 'rgba(255, 99, 132, 0.55)', patterns: [
            /房子价值\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/,
            /House\s*Value\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/i,
            /Home\s*Value\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/i,
        ]},
        { key: 'skill', label: '技能', color: 'rgba(167, 139, 250, 0.55)', patterns: [
            /技能价值\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/,
            /Skill\s*Value\s*[:：]\s*([-\d.,]+\s*[kKmMbBtT]?)/i,
        ]},
    ];

    const readBreakdownTextBlock = () => {
        const parts = [];
        const el1 = document.getElementById('toggleNetWorth');
        if (el1) parts.push(el1.innerText || el1.textContent || '');
        const el2 = document.getElementById('currentAssets');
        if (el2) parts.push(el2.innerText || el2.textContent || '');
        const el3 = document.getElementById('nonCurrentAssets');
        if (el3) parts.push(el3.innerText || el3.textContent || '');

        // fallback: use parent container text
        if (parts.join('').trim().length < 10 && el1?.parentElement) {
            const t = el1.parentElement.innerText || el1.parentElement.textContent || '';
            if (t) parts.push(t);
        }

        return parts.join('\n');
    };

    const extractFirstNumberByPatterns = (text, patterns) => {
        for (const re of patterns) {
            const m = text.match(re);
            if (m && m[1]) return parseFormattedNumber(m[1]);
        }
        return null;
    };

    const readBreakdownFromMWITools = () => {
        const block = readBreakdownTextBlock();
        if (!block || block.trim().length < 5) return null;

        const out = {};
        let found = 0;
        for (const def of BREAKDOWN_DEFS) {
            const v = extractFirstNumberByPatterns(block, def.patterns);
            if (Number.isFinite(v) && v > 0) {
                out[def.key] = v;
                found += 1;
            }
        }
        if (found < 2) return null;

        out.currentTotal = (out.equip || 0) + (out.inventory || 0) + (out.orders || 0);
        out.nonCurrentTotal = (out.house || 0) + (out.skill || 0);
        return out;
    };

    /* =========================
       Stores
    ========================= */
    class DailyDataStore {
        constructor(storageKey = STORAGE_KEYS.totalData, currentRole = 'default') {
            this.storageKey = storageKey;
            this.currentRole = currentRole;
            this.data = this.loadFromStorage();
        }
        setRole(roleId) { this.currentRole = roleId; }
        getRoleData() {
            if (!this.data[this.currentRole]) this.data[this.currentRole] = {};
            return this.data[this.currentRole];
        }
        getTodayKey() {
            const now = new Date();
            const utcPlus8 = new Date(now.getTime() + 8 * 3600000);
            return utcPlus8.toISOString().split('T')[0];
        }
        getYesterdayKey() {
            const now = new Date();
            const yesterday = new Date(now.getTime() - 24 * 3600000);
            const utcPlus8 = new Date(yesterday.getTime() + 8 * 3600000);
            return utcPlus8.toISOString().split('T')[0];
        }
        loadFromStorage() { return safeJsonParse(localStorage.getItem(this.storageKey), {}); }
        saveToStorage() { localStorage.setItem(this.storageKey, JSON.stringify(this.data)); }
        setTodayValue(value) {
            const roleData = this.getRoleData();
            const today = this.getTodayKey();
            roleData[today] = value;
            this.saveToStorage();
        }
        setDateValue(dateKey, value) {
            if (!dateKey) return false;
            const roleData = this.getRoleData();
            roleData[dateKey] = value;
            this.saveToStorage();
            return true;
        }
        removeDate(dateKey) {
            if (!dateKey) return false;
            const roleData = this.getRoleData();
            if (Object.prototype.hasOwnProperty.call(roleData, dateKey)) {
                delete roleData[dateKey];
                this.saveToStorage();
                return true;
            }
            return false;
        }
        removeInvalidAndNonFinite() {
            const roleData = this.getRoleData();
            let changed = false;
            Object.keys(roleData).forEach((k) => {
                const v = roleData[k];
                if (!Number.isFinite(v) || v === null || v === undefined) {
                    delete roleData[k];
                    changed = true;
                }
            });
            if (changed) this.saveToStorage();
            return changed;
        }
        getTodayDelta() {
    const roleData = this.getRoleData();
    const todayKey = this.getTodayKey();

    // Today's recorded value (if missing, treat as 0)
    const todayValue = roleData[todayKey];
    if (!Number.isFinite(todayValue)) return 0;

    // Find the most recent previous record (could be yesterday or earlier)
    const entries = this.getHistoryEntriesSorted();
    for (let i = entries.length - 1; i >= 0; i--) {
        const [dateKey, value] = entries[i];
        if (dateKey === todayKey) continue;
        if (Number.isFinite(value)) return todayValue - value;
    }

    // No previous record
    return 0;
}
        getHistoryEntriesSorted() {
            const roleData = this.getRoleData();
            return Object.entries(roleData).sort(([a], [b]) => new Date(a) - new Date(b));
        }
        getAllRoles() { return Object.keys(this.data); }
    }

    class BreakdownStore {
        constructor(storageKey = STORAGE_KEYS.breakdownData, currentRole = 'default') {
            this.storageKey = storageKey;
            this.currentRole = currentRole;
            this.data = this.loadFromStorage();
        }
        setRole(roleId) { this.currentRole = roleId; }
        getRoleData() {
            if (!this.data[this.currentRole]) this.data[this.currentRole] = {};
            return this.data[this.currentRole];
        }
        loadFromStorage() { return safeJsonParse(localStorage.getItem(this.storageKey), {}); }
        saveToStorage() { localStorage.setItem(this.storageKey, JSON.stringify(this.data)); }
        setTodayValue(dateKey, breakdownObj) {
            if (!dateKey || !breakdownObj) return false;
            const roleData = this.getRoleData();
            roleData[dateKey] = breakdownObj;
            this.saveToStorage();
            return true;
        }
        removeDate(dateKey) {
            if (!dateKey) return false;
            const roleData = this.getRoleData();
            if (Object.prototype.hasOwnProperty.call(roleData, dateKey)) {
                delete roleData[dateKey];
                this.saveToStorage();
                return true;
            }
            return false;
        }
        getHistoryEntriesSorted() {
            const roleData = this.getRoleData();
            return Object.entries(roleData).sort(([a], [b]) => new Date(a) - new Date(b));
        }
    }

    class TagStore {
        constructor(storageKey = STORAGE_KEYS.tags, currentRole = 'default') {
            this.storageKey = storageKey;
            this.currentRole = currentRole;
            this.data = this.loadFromStorage();
        }
        setRole(roleId) { this.currentRole = roleId; }
        loadFromStorage() { return safeJsonParse(localStorage.getItem(this.storageKey), {}); }
        saveToStorage() { localStorage.setItem(this.storageKey, JSON.stringify(this.data)); }
        getRoleBucket() {
            if (!this.data[this.currentRole]) this.data[this.currentRole] = {};
            return this.data[this.currentRole];
        }
        listTags(validDates) {
            const bucket = this.getRoleBucket();
            const result = [];
            const allowed = validDates ? new Set(validDates) : null;
            Object.entries(bucket).forEach(([date, arr]) => {
                if (allowed && !allowed.has(date)) return;
                (arr || []).forEach((tag) => result.push({ ...tag, date }));
            });
            return result.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        addTag(date, text) {
            if (!date || !text) return null;
            const bucket = this.getRoleBucket();
            if (!Array.isArray(bucket[date])) bucket[date] = [];
            const tag = {
                id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
                text: sanitizeTagText(text),
            };
            if (!tag.text) return null;
            bucket[date].push(tag);
            this.saveToStorage();
            return tag;
        }
        removeTagById(tagId) {
            if (!tagId) return;
            const bucket = this.getRoleBucket();
            let hasChange = false;
            Object.keys(bucket).forEach((date) => {
                const list = bucket[date] || [];
                const filtered = list.filter((tag) => tag.id !== tagId);
                if (filtered.length !== list.length) {
                    hasChange = true;
                    if (filtered.length) bucket[date] = filtered;
                    else delete bucket[date];
                }
            });
            if (hasChange) this.saveToStorage();
        }
        updateTagById(tagId, nextText) {
            if (!tagId) return false;
            const cleanText = sanitizeTagText(nextText);
            if (!cleanText) return false;
            const bucket = this.getRoleBucket();
            let updated = false;
            Object.values(bucket).forEach((list) => {
                (list || []).forEach((tag) => {
                    if (tag.id === tagId && tag.text !== cleanText) {
                        tag.text = cleanText;
                        updated = true;
                    }
                });
            });
            if (updated) this.saveToStorage();
            return updated;
        }
        removeDate(dateKey) {
            if (!dateKey) return false;
            const bucket = this.getRoleBucket();
            if (Object.prototype.hasOwnProperty.call(bucket, dateKey)) {
                delete bucket[dateKey];
                this.saveToStorage();
                return true;
            }
            return false;
        }
    }

    const readPrefs = (key) => safeJsonParse(localStorage.getItem(key), {});
    const writePrefs = (key, prefs) => localStorage.setItem(key, JSON.stringify(prefs));
    const getRoleBoolPref = (key, roleId, defaultValue) => {
        const prefs = readPrefs(key);
        if (roleId && Object.prototype.hasOwnProperty.call(prefs, roleId)) return !!prefs[roleId];
        return !!defaultValue;
    };
    const setRoleBoolPref = (key, roleId, value) => {
        if (!roleId) return;
        const prefs = readPrefs(key);
        prefs[roleId] = !!value;
        writePrefs(key, prefs);
    };

    /* =========================
       Backup (export/import)
    ========================= */
    const buildBackupObject = () => ({
        __everyday_profit_backup__: true,
        schema: 2,
        exportedAt: new Date().toISOString(),
        payload: {
            [STORAGE_KEYS.totalData]: safeJsonParse(localStorage.getItem(STORAGE_KEYS.totalData), {}),
            [STORAGE_KEYS.tags]: safeJsonParse(localStorage.getItem(STORAGE_KEYS.tags), {}),
            [STORAGE_KEYS.tagPrefs]: safeJsonParse(localStorage.getItem(STORAGE_KEYS.tagPrefs), {}),
            [STORAGE_KEYS.tagPanel]: safeJsonParse(localStorage.getItem(STORAGE_KEYS.tagPanel), {}),
            [STORAGE_KEYS.dataPanel]: safeJsonParse(localStorage.getItem(STORAGE_KEYS.dataPanel), {}),
            [STORAGE_KEYS.breakdownData]: safeJsonParse(localStorage.getItem(STORAGE_KEYS.breakdownData), {}),
        },
    });

    const validateBackupObject = (obj) => {
        if (!obj || typeof obj !== 'object') return false;
        if (obj.__everyday_profit_backup__ !== true) return false;
        if (!obj.payload || typeof obj.payload !== 'object') return false;
        if (!obj.payload[STORAGE_KEYS.totalData] || typeof obj.payload[STORAGE_KEYS.totalData] !== 'object') return false;
        return true;
    };

    const deepMergeRoleBuckets = (base, incoming, { overwrite = true } = {}) => {
        const out = { ...(base || {}) };
        Object.keys(incoming || {}).forEach((roleId) => {
            if (!out[roleId] || typeof out[roleId] !== 'object') out[roleId] = {};
            const baseRole = out[roleId] || {};
            const incRole = incoming[roleId] || {};
            Object.keys(incRole).forEach((k) => {
                if (overwrite || !Object.prototype.hasOwnProperty.call(baseRole, k)) baseRole[k] = incRole[k];
            });
            out[roleId] = baseRole;
        });
        return out;
    };

    const mergeTagsBuckets = (base, incoming, { overwrite = true } = {}) => {
        const out = { ...(base || {}) };
        Object.keys(incoming || {}).forEach((roleId) => {
            if (!out[roleId] || typeof out[roleId] !== 'object') out[roleId] = {};
            const baseRole = out[roleId] || {};
            const incRole = incoming[roleId] || {};
            Object.keys(incRole).forEach((date) => {
                const incList = Array.isArray(incRole[date]) ? incRole[date] : [];
                const baseList = Array.isArray(baseRole[date]) ? baseRole[date] : [];
                const existingIds = new Set(baseList.map(x => x?.id).filter(Boolean));
                const normalized = incList.map((t) => {
                    const text = sanitizeTagText(t?.text || '');
                    if (!text) return null;
                    let id = String(t?.id || '');
                    if (!id || existingIds.has(id)) id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
                    existingIds.add(id);
                    return { id, text };
                }).filter(Boolean);

                if (overwrite) baseRole[date] = normalized;
                else baseRole[date] = baseList.concat(normalized);
            });
            out[roleId] = baseRole;
        });
        return out;
    };

    const doExportBackup = () => {
        const obj = buildBackupObject();
        const filename = `EverydayProfit_backup_${getNowStamp()}.json`;
        downloadTextFile(filename, JSON.stringify(obj, null, 2));
    };

    const doImportBackup = async (file) => {
        const text = await file.text();
        const obj = safeJsonParse(text, null);
        if (!validateBackupObject(obj)) {
            alert('导入失败：备份文件格式不正确（或不是本插件导出的备份）。');
            return;
        }
        const mode = prompt('导入方式：输入 1=覆盖（迁移推荐） / 2=合并（保留本地并覆盖同键）', '1');
        if (mode === null) return;
        const isOverwrite = String(mode).trim() !== '2';

        const incoming = obj.payload || {};
        const currentTotal = safeJsonParse(localStorage.getItem(STORAGE_KEYS.totalData), {});
        const currentTags = safeJsonParse(localStorage.getItem(STORAGE_KEYS.tags), {});
        const currentPrefs = safeJsonParse(localStorage.getItem(STORAGE_KEYS.tagPrefs), {});
        const currentTagPanel = safeJsonParse(localStorage.getItem(STORAGE_KEYS.tagPanel), {});
        const currentDataPanel = safeJsonParse(localStorage.getItem(STORAGE_KEYS.dataPanel), {});
        const currentBreakdown = safeJsonParse(localStorage.getItem(STORAGE_KEYS.breakdownData), {});

        const nextTotal = isOverwrite ? (incoming[STORAGE_KEYS.totalData] || {}) : deepMergeRoleBuckets(currentTotal, incoming[STORAGE_KEYS.totalData] || {}, { overwrite: true });
        const nextTags = isOverwrite ? (incoming[STORAGE_KEYS.tags] || {}) : mergeTagsBuckets(currentTags, incoming[STORAGE_KEYS.tags] || {}, { overwrite: false });
        const nextPrefs = isOverwrite ? (incoming[STORAGE_KEYS.tagPrefs] || {}) : { ...currentPrefs, ...(incoming[STORAGE_KEYS.tagPrefs] || {}) };
        const nextTagPanel = isOverwrite ? (incoming[STORAGE_KEYS.tagPanel] || {}) : { ...currentTagPanel, ...(incoming[STORAGE_KEYS.tagPanel] || {}) };
        const nextDataPanel = isOverwrite ? (incoming[STORAGE_KEYS.dataPanel] || {}) : { ...currentDataPanel, ...(incoming[STORAGE_KEYS.dataPanel] || {}) };
        const nextBreakdown = isOverwrite ? (incoming[STORAGE_KEYS.breakdownData] || {}) : deepMergeRoleBuckets(currentBreakdown, incoming[STORAGE_KEYS.breakdownData] || {}, { overwrite: true });

        localStorage.setItem(STORAGE_KEYS.totalData, JSON.stringify(nextTotal));
        localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(nextTags));
        localStorage.setItem(STORAGE_KEYS.tagPrefs, JSON.stringify(nextPrefs));
        localStorage.setItem(STORAGE_KEYS.tagPanel, JSON.stringify(nextTagPanel));
        localStorage.setItem(STORAGE_KEYS.dataPanel, JSON.stringify(nextDataPanel));
        localStorage.setItem(STORAGE_KEYS.breakdownData, JSON.stringify(nextBreakdown));

        alert('导入成功：已写入本地存储。为确保 UI 同步，建议刷新页面。');
    };

    /* =========================
       Tag UI
    ========================= */
    const buildTagManagerSection = (dates, tags) => {
        if (!dates.length) return '<div class="ep-tag-empty">暂无历史数据，待记录后即可添加标签。</div>';
        const options = dates.map((date) => `<option value="${date}">${date}</option>`).join('');
        const tagList = tags.length
            ? tags.map((tag) => `
                <div class="ep-tag-item" data-tag-id="${tag.id}">
                    <div style="min-width:0;">
                        <strong>${tag.date}</strong>
                        <span style="word-break:break-word;">${escapeHtml(tag.text)}</span>
                    </div>
                    <div class="ep-tag-actions">
                        <button class="ep-tag-edit" data-tag-id="${tag.id}" data-tag-text="${escapeHtml(tag.text)}" title="编辑标签">✎</button>
                        <button class="ep-tag-delete" data-tag-id="${tag.id}" title="删除标签">✕</button>
                    </div>
                </div>
            `).join('')
            : '<div class="ep-tag-empty">暂无标签，选定日期后点击“添加标签”即可。</div>';

        return `
            <div class="ep-tag-form">
                <select id="epTagDateSelect">${options}</select>
                <input id="epTagTextInput" maxlength="${TAG_TEXT_MAX}" placeholder="如：9月13日 +12雷达" />
                <button id="epTagAddBtn">添加标签</button>
            </div>
            <div class="ep-tag-list">${tagList}</div>
        `;
    };

    const hydrateTagManager = (container, dates, tags, handlers = {}) => {
        if (!container) return;
        container.innerHTML = buildTagManagerSection(dates, tags);

        const addBtn = container.querySelector('#epTagAddBtn');
        const selectEl = container.querySelector('#epTagDateSelect');
        const inputEl = container.querySelector('#epTagTextInput');

        if (addBtn && selectEl && inputEl) {
            if (selectEl.options.length) selectEl.selectedIndex = selectEl.options.length - 1;
            const triggerAdd = () => {
                const date = selectEl.value;
                const text = sanitizeTagText(inputEl.value);
                if (!date || !text) return;
                handlers.onAdd?.(date, text);
                inputEl.value = '';
            };
            addBtn.addEventListener('click', triggerAdd);
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); triggerAdd(); }
            });
        }

        container.querySelectorAll('.ep-tag-delete').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tagId = btn.dataset.tagId;
                if (!tagId) return;
                handlers.onRemove?.(tagId);
            });
        });

        container.querySelectorAll('.ep-tag-edit').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tagId = btn.dataset.tagId;
                if (!tagId) return;
                const prev = btn.dataset.tagText || '';
                const next = window.prompt('修改标签内容：', prev);
                if (next === null) return;
                const clean = sanitizeTagText(next);
                if (!clean || clean === prev) return;
                handlers.onEdit?.(tagId, clean);
            });
        });
    };

    /* =========================
       Data manager + anomaly (total data)
    ========================= */
    const mean = (arr) => {
        const a = arr.filter(Number.isFinite);
        if (!a.length) return 0;
        return a.reduce((s, x) => s + x, 0) / a.length;
    };
    const stddev = (arr) => {
        const a = arr.filter(Number.isFinite);
        if (a.length < 2) return 0;
        const m = mean(a);
        const v = a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1);
        return Math.sqrt(v);
    };

    const detectAnomaliesInTotal = (entries) => {
        const values = entries.map(([, v]) => v).filter(Number.isFinite);
        if (values.length < 5) return [];
        const deltas = [];
        for (let i = 1; i < entries.length; i++) {
            const prev = entries[i - 1][1];
            const curr = entries[i][1];
            if (Number.isFinite(prev) && Number.isFinite(curr)) deltas.push(curr - prev);
        }
        const s = stddev(deltas);
        const m = mean(deltas);
        if (!Number.isFinite(s) || s <= 0) return [];

        const out = [];
        for (let i = 1; i < entries.length; i++) {
            const prev = entries[i - 1][1];
            const curr = entries[i][1];
            if (!Number.isFinite(prev) || !Number.isFinite(curr)) continue;
            const d = curr - prev;
            const z = (d - m) / s;
            if (Math.abs(z) >= 4) out.push({ date: entries[i][0], reason: `当日变动 Z=${z.toFixed(1)}（异常）` });
        }
        return out;
    };

    const buildDataManagerSection = (entries) => {
        if (!entries.length) return '<div class="ep-tag-empty">暂无数据。</div>';

        const rows = entries.slice(-60).map(([date, value], idx) => {
            const globalIndex = entries.length - Math.min(entries.length, 60) + idx;
            let delta = 0;
            if (globalIndex > 0) delta = value - entries[globalIndex - 1][1];
            return `
                <tr>
                    <td class="mono">${date}</td>
                    <td class="mono">${formatLargeNumber(value)}</td>
                    <td class="mono">${formatSignedLargeNumber(delta)}</td>
                    <td>
                        <div class="actions">
                            <button class="ep-edit-date" data-date="${date}">编辑</button>
                            <button class="ep-del-date danger" data-date="${date}">删除</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <div class="ep-data-toolbar">
                <div class="left">
                    <button id="epDetectAnomalyBtn" class="danger">检测异常并删除</button>
                    <button id="epCleanupInvalidBtn" class="danger">清理无效值</button>
                    <small>仅对“当前角色”生效；显示最近 60 条</small>
                </div>
                <div class="right">
                    <small>提示：误删可用“导出备份/导入备份”恢复</small>
                </div>
            </div>

            <div class="ep-data-table-wrap">
                <table class="ep-data-table">
                    <thead>
                        <tr>
                            <th style="width:130px;">日期</th>
                            <th style="width:150px;">总净资产</th>
                            <th style="width:150px;">当日盈亏</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>

            <div class="ep-note">
                “分项资产”数据为新增功能：从启用本脚本之后才开始积累历史。总净资产历史不受影响（沿用旧数据）。
            </div>
        `;
    };

    const hydrateDataManager = (container, entries, handlers = {}) => {
        if (!container) return;
        container.innerHTML = buildDataManagerSection(entries);

        const detectBtn = container.querySelector('#epDetectAnomalyBtn');
        if (detectBtn) detectBtn.onclick = () => handlers.onDetectAnomaly?.();
        const cleanupBtn = container.querySelector('#epCleanupInvalidBtn');
        if (cleanupBtn) cleanupBtn.onclick = () => handlers.onCleanupInvalid?.();

        container.querySelectorAll('.ep-del-date').forEach((btn) => {
            btn.addEventListener('click', () => {
                const date = btn.dataset.date;
                if (!date) return;
                handlers.onDeleteDate?.(date);
            });
        });
        container.querySelectorAll('.ep-edit-date').forEach((btn) => {
            btn.addEventListener('click', () => {
                const date = btn.dataset.date;
                if (!date) return;
                handlers.onEditDate?.(date);
            });
        });
    };

    
    /* =========================
       Metrics (restore original header stats)
    ========================= */
    const computeDeltas = (sortedEntries) => {
        const diff = [];
        for (let i = 1; i < sortedEntries.length; i++) {
            const prev = sortedEntries[i - 1][1];
            const curr = sortedEntries[i][1];
            diff.push({
                date: sortedEntries[i][0],
                value: curr - prev,
                growthPct: prev ? ((curr - prev) / prev) * 100 : 0,
            });
        }
        return diff;
    };

    const computeStreaks = (differences) => {
        let bestGain = 0;
        let worstLoss = 0;
        let bestDay = null;
        let worstDay = null;
        let winStreak = 0;
        let loseStreak = 0;
        let currentWin = 0;
        let currentLose = 0;

        differences.forEach((d) => {
            if (d.value >= 0) {
                currentWin += 1;
                currentLose = 0;
                if (d.value > bestGain) {
                    bestGain = d.value;
                    bestDay = d.date;
                }
            } else {
                currentLose += 1;
                currentWin = 0;
                if (d.value < worstLoss) {
                    worstLoss = d.value;
                    worstDay = d.date;
                }
            }
            winStreak = Math.max(winStreak, currentWin);
            loseStreak = Math.max(loseStreak, currentLose);
        });

        return { bestGain, bestDay, worstLoss, worstDay, winStreak, loseStreak };
    };

    const predictDoublingTime = (differences, currentValue, windowDays = 7) => {
        if (!currentValue || differences.length === 0) return null;
        const recent = differences.slice(-windowDays);
        if (!recent.length) return null;
        const avgGrowth = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
        if (avgGrowth <= 0) return null;
        return Math.ceil((currentValue) / avgGrowth);
    };

    const predictTargetDate = (differences, currentValue, targetValue) => {
        if (!currentValue || currentValue >= targetValue) {
            return { days: 0, targetValue };
        }
        const recent = differences.slice(-7);
        const avgGrowth = recent.reduce((sum, d) => sum + d.value, 0) / (recent.length || 1);
        if (avgGrowth <= 0) return null;
        const remaining = targetValue - currentValue;
        return { days: Math.ceil(remaining / avgGrowth), targetValue };
    };

    const nextRoundNumber = (value) => {
        if (!value) return 0;
        const magnitude = Math.pow(10, Math.max(3, Math.floor(Math.log10(value))));
        return Math.ceil(value / magnitude) * magnitude;
    };

    const buildMetricCards = (metrics) => {
        if (!metrics) return '';
        const cards = metrics.map((metric) => `
            <div class="ep-metric-card">
                <h4>${escapeHtml(metric.title)}</h4>
                <strong>${escapeHtml(metric.value)}</strong>
                ${metric.desc ? `<span>${escapeHtml(metric.desc)}</span>` : ''}
            </div>
        `).join('');
        return `<div class="ep-metrics-grid">${cards}</div>`;
    };

    const computeTotalMetricsFromEntries = (sortedEntries) => {
        const latestRecordDate = sortedEntries.length ? sortedEntries[sortedEntries.length - 1][0] : '-';
        const valueToPersist = sortedEntries.length ? (sortedEntries[sortedEntries.length - 1][1] || 0) : 0;

        const differences = computeDeltas(sortedEntries);
        const todayDelta = differences.length ? differences[differences.length - 1] : null;
        const growthPct = todayDelta ? (todayDelta.growthPct || 0) : 0;
        const hourlyRate = todayDelta ? (todayDelta.value / 24) : 0;

        const last7 = differences.slice(-7);
        const avgGrowthPct = last7.length ? last7.reduce((sum, d) => sum + (d.growthPct || 0), 0) / last7.length : 0;
        const avgGrowthValue = last7.length ? last7.reduce((sum, d) => sum + (d.value || 0), 0) / last7.length : 0;

        const streaks = computeStreaks(differences);

        const doublingDays = predictDoublingTime(differences, valueToPersist);
        const targetValue = nextRoundNumber(valueToPersist * 1.05);
        const targetPrediction = predictTargetDate(differences, valueToPersist, targetValue);

        let lastDoubleDate = null;
        let lastDoubleDays = null;
        let lastDoubleValue = null;
        if (valueToPersist > 0 && sortedEntries.length) {
            const halfValue = valueToPersist / 2;
            const milestoneEntry = sortedEntries.find(([, v]) => Number.isFinite(v) && v >= halfValue);
            if (milestoneEntry) {
                lastDoubleDate = milestoneEntry[0];
                lastDoubleValue = milestoneEntry[1];
                const diffMs = Date.now() - new Date(lastDoubleDate).getTime();
                lastDoubleDays = Math.max(0, Math.floor(diffMs / 86400000));
            }
        }

        return {
            latestRecordDate,
            valueToPersist,
            differences,
            todayDelta,
            growthPct,
            hourlyRate,
            avgGrowthPct,
            avgGrowthValue,
            streaks,
            lastDoubleDate,
            lastDoubleDays,
            lastDoubleValue,
            doublingDays,
            targetPrediction,
        };
    };
/* =========================
       Chart data builders
    ========================= */
    const computeProfitSeries = (labels, values, window = 7) => {
        const profit = labels.map((_, i) => {
            if (i === 0) return null;
            const d = values[i] - values[i - 1];
            return Number.isFinite(d) ? d : null;
        });

        const ma = labels.map((_, i) => {
            if (i === 0) return null;
            const start = Math.max(1, i - window + 1);
            const slice = profit.slice(start, i + 1).filter((x) => Number.isFinite(x));
            if (!slice.length) return null;
            return slice.reduce((s, x) => s + x, 0) / slice.length;
        });

        const colors = profit.map((p) => {
            if (!Number.isFinite(p)) return 'rgba(255,255,255,0.10)';
            return p >= 0 ? CHART_THEME.profitPos : CHART_THEME.profitNeg;
        });

        return { profit, ma, colors };
    };

    const computeBreakdownDeltaSeries = (entries) => {
        const labels = entries.map(([d]) => d);

        const netByKey = {};
        for (const def of BREAKDOWN_DEFS) {
            netByKey[def.key] = entries.map(([, obj]) => (obj && Number.isFinite(obj[def.key]) ? obj[def.key] : null));
        }

        const deltaByKey = {};
        for (const def of BREAKDOWN_DEFS) {
            const arr = netByKey[def.key];
            deltaByKey[def.key] = arr.map((v, i) => {
                if (i === 0) return null;
                const prev = arr[i - 1];
                if (!Number.isFinite(prev) || !Number.isFinite(v)) return null;
                return v - prev;
            });
        }

        const totalDelta = labels.map((_, i) => {
            if (i === 0) return null;
            let s = 0;
            let ok = false;
            for (const def of BREAKDOWN_DEFS) {
                const d = deltaByKey[def.key][i];
                if (Number.isFinite(d)) { s += d; ok = true; }
            }
            return ok ? s : null;
        });

        return { labels, netByKey, deltaByKey, totalDelta };
    };

    /* =========================
       Modal / UI
    ========================= */
    let chartInstance = null;
    let modalDragBound = false;

    let mainMode = 'networth';
    let breakdownView = false;
    let currentFilterDays = null;
    const profitMAWindow = 7;

    const setActiveButton = (ids, activeId) => {
        ids.forEach((id) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            if (id === activeId) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    };

    const ensureModal = () => {
        let modal = document.getElementById('deltaNetworthChartModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'deltaNetworthChartModal';
            modal.innerHTML = `
                <div id="deltaNetworthChartHeader">
                    <div style="display:flex;align-items:center;gap:0;">
                        <div id="epCrocLogo"><span>🐊</span></div>
<span id="epModalTitle">净资产历史曲线</span>
                    </div>
                    <span id="deltaNetworthChartCloseBtn" style="cursor:pointer;">❌</span>
                </div>

                <div id="deltaNetworthChartControls">
                    <div class="ep-inline-group" style="margin-bottom:6px;">
                        <button id="btnNetWorthMode" class="active">净资产</button>
                        <button id="btnProfitMode">盈亏</button>
                        <button id="btnToggleBreakdown">分项资产</button>

                        <button id="btn7Days">7天</button>
                        <button id="btn30Days">30天</button>
                        <button id="btnAllDays" class="active">总览</button>
                        <button id="btnResetZoom">重置缩放</button>
                    </div>

                    <div class="ep-inline-group">
                        <button id="btnManageTags" style="background:#1f8ef1;border:none;color:#fff;">管理标签</button>
                        <button id="btnManageData" class="primary">数据管理</button>
                        <button id="btnExportBackup" class="primary">导出备份</button>
                        <button id="btnImportBackup" class="primary">导入备份</button>
                        <label class="ep-tag-toggle">
                            <input type="checkbox" id="epToggleTagVisibility" style="margin-right:4px;" checked />显示标签
                        </label>
                    </div>
                </div>

                <div id="ep-metrics-container"></div>

                <div id="ep-tag-manager" class="ep-tag-manager"></div>
                <div id="ep-data-manager" class="ep-data-manager"></div>

                <div id="netWorthChartBody">
                    <canvas id="netWorthChart"></canvas>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const closeBtn = modal.querySelector('#deltaNetworthChartCloseBtn');
        if (closeBtn && !closeBtn.dataset.bound) {
            closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
            closeBtn.dataset.bound = 'true';
        }

        if (!document.getElementById('epImportFileInput')) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.id = 'epImportFileInput';
            input.style.display = 'none';
            document.body.appendChild(input);
        }

        if (!modalDragBound) {
            const header = modal.querySelector('#deltaNetworthChartHeader');
            if (header) {
                let isDragging = false;
                let offsetX = 0;
                let offsetY = 0;
                header.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    offsetX = e.clientX - modal.offsetLeft;
                    offsetY = e.clientY - modal.offsetTop;
                    modal.classList.add('dragging');
                });
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    modal.style.left = `${e.clientX - offsetX}px`;
                    modal.style.top = `${e.clientY - offsetY}px`;
                });
                document.addEventListener('mouseup', () => {
                    if (!isDragging) return;
                    isDragging = false;
                    modal.classList.remove('dragging');
                });
                modalDragBound = true;
            }
        }

        return modal;
    };

    const ensureDeltaContainer = (targetDom) => {
        let container = document.getElementById('deltaNetworthDiv');
        if (!container && targetDom) {
            targetDom.insertAdjacentHTML(
                'afterend',
                '<div id="deltaNetworthDiv" style="text-align:left;color:#fff;font-size:20px;margin:10px 0;"></div>'
            );
            container = document.getElementById('deltaNetworthDiv');
        }
        return container;
    };

    const buildDeltaContent = (color, formattedDelta) => `
        <span style="font-weight:bold;">💰今日盈亏: </span>
        <span style="color:${color};font-weight:bold;">${formattedDelta}</span>
        <span id="showHistoryIcon" style="cursor:pointer; margin-left:8px; font-size:18px;">📊</span>
        <span id="refreshNetworthIcon" style="cursor:pointer; margin-left:8px; font-size:18px;">🔄</span>
    `;

    const filterEntriesByDays = (entries, days) => {
        if (!Number.isFinite(days)) return entries;
        const now = new Date();
        const cutoff = new Date(now.getTime() - days * 24 * 3600000);
        return entries.filter(([date]) => new Date(date) >= cutoff);
    };

    /* =========================
       Main injection
    ========================= */
    const NET_WORTH_SELECTOR = '#toggleNetWorth';

    const readCurrentNetworthValue = () => {
        const networthDisplay = document.querySelector(NET_WORTH_SELECTOR);
        if (!networthDisplay) return null;
        const value = parseFormattedNumber(networthDisplay.textContent.trim());
        return Number.isFinite(value) ? value : null;
    };

    let tagPanelVisible = false;
    let dataPanelVisible = false;
    let tagVisibility = true;
    let pendingTagRefresh = false;

    const refreshChartTags = (chart, tagStore, validLabels, roleId, shouldUpdate = false) => {
        if (!chart) {
            pendingTagRefresh = pendingTagRefresh || shouldUpdate;
            return;
        }
        const options = chart.options || {};
        const plugins = options.plugins || (options.plugins = {});
        const payload = tagStore.listTags(validLabels);
        const pluginConfig = plugins[TAG_LABEL_PLUGIN_ID] || (plugins[TAG_LABEL_PLUGIN_ID] = {});
        pluginConfig.tags = payload;
        pluginConfig.enabled = (!!tagVisibility) && (!breakdownView);

        if (shouldUpdate || pendingTagRefresh) {
            chart.update();
            pendingTagRefresh = false;
        }
    };

    const syncTagVisibilityToggle = (roleId, chart, tagStore, validLabels) => {
        const toggleInput = document.getElementById('epToggleTagVisibility');
        if (!toggleInput) return;
        toggleInput.checked = !!tagVisibility;
        toggleInput.onchange = () => {
            tagVisibility = !!toggleInput.checked;
            setRoleBoolPref(STORAGE_KEYS.tagPrefs, roleId, tagVisibility);
            refreshChartTags(chart, tagStore, validLabels, roleId, true);
        };
    };

    const bindPanelButtons = (roleId, tagContainer, dataContainer) => {
        const manageBtn = document.getElementById('btnManageTags');
        if (manageBtn) {
            manageBtn.textContent = tagPanelVisible ? '隐藏标签' : '管理标签';
            manageBtn.onclick = () => {
                tagPanelVisible = !tagPanelVisible;
                setRoleBoolPref(STORAGE_KEYS.tagPanel, roleId, tagPanelVisible);
                tagContainer?.classList.toggle('active', tagPanelVisible);
                manageBtn.textContent = tagPanelVisible ? '隐藏标签' : '管理标签';
            };
        }

        const manageDataBtn = document.getElementById('btnManageData');
        if (manageDataBtn) {
            manageDataBtn.textContent = dataPanelVisible ? '隐藏数据' : '数据管理';
            manageDataBtn.onclick = () => {
                dataPanelVisible = !dataPanelVisible;
                setRoleBoolPref(STORAGE_KEYS.dataPanel, roleId, dataPanelVisible);
                dataContainer?.classList.toggle('active', dataPanelVisible);
                manageDataBtn.textContent = dataPanelVisible ? '隐藏数据' : '数据管理';
            };
        }

        const exportBtn = document.getElementById('btnExportBackup');
        if (exportBtn) exportBtn.onclick = () => doExportBackup();

        const importBtn = document.getElementById('btnImportBackup');
        if (importBtn) {
            importBtn.onclick = () => {
                const input = document.getElementById('epImportFileInput');
                if (!input) return;
                input.value = '';
                input.onchange = async () => {
                    const f = input.files?.[0];
                    if (!f) return;
                    await doImportBackup(f);
                };
                input.click();
            };
        }
    };

    const renderTagManagerSection = (roleId, tagStore, allDates, validLabelsForTags, chart) => {
        const tagContainer = document.getElementById('ep-tag-manager');
        if (!tagContainer) return;

        hydrateTagManager(tagContainer, allDates, tagStore.listTags(validLabelsForTags), {
            onAdd: (date, text) => {
                tagStore.addTag(date, text);
                renderTagManagerSection(roleId, tagStore, allDates, validLabelsForTags, chart);
                refreshChartTags(chart, tagStore, validLabelsForTags, roleId, true);
            },
            onEdit: (id, text) => {
                if (tagStore.updateTagById(id, text)) {
                    renderTagManagerSection(roleId, tagStore, allDates, validLabelsForTags, chart);
                    refreshChartTags(chart, tagStore, validLabelsForTags, roleId, true);
                }
            },
            onRemove: (id) => {
                tagStore.removeTagById(id);
                renderTagManagerSection(roleId, tagStore, allDates, validLabelsForTags, chart);
                refreshChartTags(chart, tagStore, validLabelsForTags, roleId, true);
            },
        });

        tagContainer.classList.toggle('active', tagPanelVisible);
    };

    const renderDataManagerSection = (roleId, store, breakdownStore, tagStore, entries, chart, validLabels) => {
        const dataContainer = document.getElementById('ep-data-manager');
        if (!dataContainer) return;

        hydrateDataManager(dataContainer, entries, {
            onDeleteDate: (date) => {
                const ok = confirm(`确认删除 ${date} 的总净资产记录？（会同时删除该日期标签与分项数据）`);
                if (!ok) return;
                store.removeDate(date);
                breakdownStore.removeDate(date);
                tagStore.removeDate(date);
                injectDeltaScript();
                if (chart) chart.update();
            },
            onEditDate: (date) => {
                const roleData = store.getRoleData();
                const oldVal = roleData?.[date];
                const next = prompt(`编辑 ${date} 的总净资产（支持 1.2K/3.4M）：`, oldVal != null ? formatLargeNumber(oldVal) : '');
                if (next === null) return;
                const v = parseFormattedNumber(String(next).trim());
                if (!Number.isFinite(v)) {
                    alert('输入无效：请填写可解析的数字。');
                    return;
                }
                store.setDateValue(date, v);
                injectDeltaScript();
                if (chart) chart.update();
            },
            onCleanupInvalid: () => {
                const ok = confirm('确认清理无效值（NaN/Infinity/空值）？（仅总净资产）');
                if (!ok) return;
                store.removeInvalidAndNonFinite();
                injectDeltaScript();
                if (chart) chart.update();
            },
            onDetectAnomaly: () => {
                const anomalies = detectAnomaliesInTotal(entries);
                if (!anomalies.length) {
                    alert('未检测到明显异常数据。');
                    return;
                }
                const preview = anomalies.slice(0, 20).map(a => `${a.date}：${a.reason}`).join('\n');
                const ok = confirm(`检测到 ${anomalies.length} 条可能异常数据（最多预览 20 条）：\n\n${preview}\n\n确认删除这些日期？（会同时删除标签与分项数据）`);
                if (!ok) return;
                anomalies.forEach((a) => {
                    store.removeDate(a.date);
                    breakdownStore.removeDate(a.date);
                    tagStore.removeDate(a.date);
                });
                injectDeltaScript();
                if (chart) chart.update();
            },
        });

        dataContainer.classList.toggle('active', dataPanelVisible);
    };

    const updateModalTitle = () => {
        const titleEl = document.getElementById('epModalTitle');
        if (!titleEl) return;
        if (breakdownView) titleEl.textContent = '分项资产变化（Δ/日）';
        else titleEl.textContent = (mainMode === 'profit') ? '每日盈亏（Δ总净资产）+ 均线' : '净资产历史曲线';
    };

    const buildChartView = (totalEntries, breakdownEntries) => {
        const filteredTotal = filterEntriesByDays(totalEntries, currentFilterDays);
        const totalLabels = filteredTotal.map(([d]) => d);
        const totalValues = filteredTotal.map(([, v]) => v);

        if (!breakdownView) {
            if (mainMode === 'profit') {
                const { profit, ma, colors } = computeProfitSeries(totalLabels, totalValues, profitMAWindow);
                return {
                    viewType: 'profit',
                    labels: totalLabels,
                    datasets: [
                        { type: 'bar', label: '每日盈亏', data: profit, backgroundColor: colors, borderWidth: 1, borderRadius: 4 },
                        { type: 'line', label: `${profitMAWindow}日均线`, data: ma, borderColor: CHART_THEME.profitMAColor, borderWidth: 2, pointRadius: 0, tension: 0.25 },
                    ],
                };
            }
            return {
                viewType: 'networth',
                labels: totalLabels,
                datasets: [
                    { type: 'line', label: '净资产历史', data: totalValues, borderColor: CHART_THEME.lineColor, borderWidth: 3, backgroundColor: CHART_THEME.fillColor,
                      pointBackgroundColor: CHART_THEME.pointColor, pointBorderColor: CHART_THEME.pointBorder, pointRadius: 3, pointHoverRadius: 6, pointHitRadius: 10,
                      tension: 0.25, fill: 'origin' },
                ],
            };
        }

        const filteredBreakdown = filterEntriesByDays(breakdownEntries, currentFilterDays);
        const { labels, netByKey, deltaByKey, totalDelta } = computeBreakdownDeltaSeries(filteredBreakdown);

        const datasets = [
            ...BREAKDOWN_DEFS.map((def) => ({
                type: 'bar',
                label: `${def.label} Δ`,
                data: deltaByKey[def.key],
                backgroundColor: def.color,
                borderWidth: 0,
                stack: 'delta',
                borderRadius: 3,
            })),
            { type: 'line', label: '分项合计 Δ', data: totalDelta, borderColor: CHART_THEME.breakdownTotalLine, borderWidth: 2, pointRadius: 0, tension: 0.25, yAxisID: 'y' },
        ];

        return { viewType: 'breakdown', labels, datasets, meta: { netByKey, deltaByKey, totalDelta } };
    };

    const renderChart = (roleId, store, breakdownStore, tagStore) => {
        updateModalTitle();

        const totalEntries = store.getHistoryEntriesSorted();
        const metricsContainer = document.getElementById('ep-metrics-container');
        if (metricsContainer) {
            const mtxAll = computeTotalMetricsFromEntries(totalEntries);

            const lastUpdateIso = getRoleLastUpdate(roleId);
            const lastUpdateStr = lastUpdateIso ? formatIsoToLocalDateTime(lastUpdateIso) : (mtxAll.latestRecordDate || '-');

            const diffs = Array.isArray(mtxAll.differences) ? mtxAll.differences : [];
            const last7Diffs = diffs.slice(-7);
            const last30Diffs = diffs.slice(-30);

            const winCount7 = last7Diffs.filter((d) => d && Number.isFinite(d.value) && d.value > 0).length;
            const loseCount7 = last7Diffs.filter((d) => d && Number.isFinite(d.value) && d.value < 0).length;
            const flatCount7 = last7Diffs.filter((d) => d && Number.isFinite(d.value) && d.value === 0).length;
            const rate7 = last7Diffs.length ? (winCount7 / last7Diffs.length) * 100 : null;

            const avg30Value = last30Diffs.length ? last30Diffs.reduce((sum, d) => sum + (d.value || 0), 0) / last30Diffs.length : null;
            const avg30Pct = last30Diffs.length ? last30Diffs.reduce((sum, d) => sum + (d.growthPct || 0), 0) / last30Diffs.length : null;

            const bestWorstValue = `${formatSignedLargeNumber(mtxAll.streaks?.bestGain || 0)} / ${formatSignedLargeNumber(mtxAll.streaks?.worstLoss || 0)}`;
            const bestWorstDesc = `${mtxAll.streaks?.bestDay || '-'} | ${mtxAll.streaks?.worstDay || '-'}`;

            const predictBits = [];
            if (mtxAll.doublingDays) predictBits.push(`翻倍: ${mtxAll.doublingDays}天`);
            if (mtxAll.targetPrediction) predictBits.push(`目标: ${mtxAll.targetPrediction.days}天→${formatLargeNumber(mtxAll.targetPrediction.targetValue)}`);

            const metrics = [
                { title: '当前资产', value: formatLargeNumber(mtxAll.valueToPersist || 0), desc: `最近更新：${lastUpdateStr}` },
                {
                    title: '日环比',
                    value: `${(mtxAll.growthPct >= 0 ? '+' : '')}${(mtxAll.growthPct || 0).toFixed(2)}%`,
                    desc: formatSignedLargeNumber(mtxAll.todayDelta?.value || 0),
                },
                { title: '瞬时时薪', value: formatLargeNumber(mtxAll.hourlyRate || 0), desc: '按当日平均' },
                {
                    title: '近7天均增速',
                    value: `${(mtxAll.avgGrowthPct >= 0 ? '+' : '')}${(mtxAll.avgGrowthPct || 0).toFixed(2)}% / ${formatSignedLargeNumber(mtxAll.avgGrowthValue || 0)}`,
                    desc: '日均增率 / 日均净变动',
                },
                {
                    title: '近7天胜率',
                    value: rate7 === null ? '—' : `${winCount7}/${last7Diffs.length} (${rate7.toFixed(0)}%)`,
                    desc: `盈/亏/平：${winCount7}/${loseCount7}/${flatCount7}`,
                },
                {
                    title: '近30天日均',
                    value: avg30Value === null ? '—' : `${(avg30Pct >= 0 ? '+' : '')}${(avg30Pct || 0).toFixed(2)}% / ${formatSignedLargeNumber(avg30Value || 0)}`,
                    desc: predictBits.length ? `30日均增率 / 日均净变动 | ${predictBits.join(' | ')}` : '30日均增率 / 日均净变动',
                },
                { title: '最佳/最差日', value: bestWorstValue, desc: bestWorstDesc },
                {
                    title: '上一次翻倍',
                    value: Number.isFinite(mtxAll.lastDoubleDays) ? `${mtxAll.lastDoubleDays} 天` : '尚无记录',
                    desc: mtxAll.lastDoubleDate ? `${mtxAll.lastDoubleDate}: ${formatLargeNumber(mtxAll.lastDoubleValue || 0)}` : '—',
                },
            ];

            metricsContainer.innerHTML = buildMetricCards(metrics);
        }


        const breakdownEntries = breakdownStore.getHistoryEntriesSorted();

        const view = buildChartView(totalEntries, breakdownEntries);
        const canvas = document.getElementById('netWorthChart');
        if (!canvas) return;

        const validLabelsForTags = view.labels;
        const allDatesForTagManager = store.getHistoryEntriesSorted().map(([d]) => d);

        const yTickFormatter = (value) => (view.viewType === 'networth') ? formatLargeNumber(value) : formatSignedLargeNumber(value);

        const tooltipLabelCallback = (context) => {
            const label = context.dataset.label || '';
            const raw = context.raw;
            if (view.viewType === 'networth') return `${label}: ${formatLargeNumber(raw)}`;
            if (view.viewType === 'profit') return `${label}: ${formatSignedLargeNumber(raw)}`;

            const idx = context.dataIndex;
            const dsLabel = context.dataset.label || '';
            const match = BREAKDOWN_DEFS.find(d => dsLabel.startsWith(d.label));
            if (match) {
                const net = view.meta?.netByKey?.[match.key]?.[idx];
                const netStr = Number.isFinite(net) ? `（净值 ${formatLargeNumber(net)}）` : '';
                return `${dsLabel}: ${formatSignedLargeNumber(raw)} ${netStr}`;
            }
            return `${dsLabel}: ${formatSignedLargeNumber(raw)}`;
        };

        const baseOptions = {
            responsive: true,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: true, labels: { color: CHART_THEME.tickColor, usePointStyle: true, pointStyle: 'circle' } },
                tooltip: { backgroundColor: CHART_THEME.tooltipBg, titleColor: CHART_THEME.tooltipColor, bodyColor: CHART_THEME.tooltipColor, callbacks: { label: tooltipLabelCallback } },
                zoom: {
                    pan: { enabled: false },
                    zoom: {
                        wheel: { enabled: false }, pinch: { enabled: false }, mode: 'x',
                        drag: { enabled: true, backgroundColor: 'rgba(0, 198, 255, 0.12)', borderColor: '#00c6ff', borderWidth: 1 },
                    },
                    limits: { x: { min: 'original', max: 'original' }, y: { min: 'original', max: 'original' } },
                },
                crosshair: {
                    line: { color: 'rgba(255, 99, 132, 0.85)', width: 1, dashPattern: [4, 4] },
                    sync: { enabled: false },
                    zoom: { enabled: true, zoomboxBackgroundColor: 'rgba(0, 198, 255, 0.12)', zoomboxBorderColor: '#00c6ff', zoomButtonText: '重置缩放', zoomButtonClass: 'ep-crosshair-reset-btn' },
                    callbacks: { beforeZoom: () => true },
                },
                [TAG_LABEL_PLUGIN_ID]: { tags: tagStore.listTags(validLabelsForTags), minGap: 55, enabled: (!!tagVisibility) && (!breakdownView) },
            },
            scales: {
                x: { ticks: { color: CHART_THEME.tickColor }, grid: { color: CHART_THEME.gridColor }, stacked: (view.viewType === 'breakdown') },
                y: { ticks: { callback: yTickFormatter, color: CHART_THEME.tickColor }, grid: { color: CHART_THEME.gridColor }, stacked: (view.viewType === 'breakdown') },
            },
        };

        if (chartInstance) {
            chartInstance.data.labels = view.labels;
            chartInstance.data.datasets = view.datasets;
            chartInstance.options.scales.x.stacked = (view.viewType === 'breakdown');
            chartInstance.options.scales.y.stacked = (view.viewType === 'breakdown');
            chartInstance.options.scales.y.ticks.callback = yTickFormatter;
            chartInstance.options.plugins.tooltip.callbacks.label = tooltipLabelCallback;
            refreshChartTags(chartInstance, tagStore, validLabelsForTags, roleId, false);
            resetChartZoom(chartInstance);
            chartInstance.update();
        } else {
            chartInstance = new Chart(canvas, { type: 'line', data: { labels: view.labels, datasets: view.datasets }, options: baseOptions });
            if (pendingTagRefresh) refreshChartTags(chartInstance, tagStore, validLabelsForTags, roleId, true);
        }

        renderTagManagerSection(roleId, tagStore, allDatesForTagManager, validLabelsForTags, chartInstance);
        renderDataManagerSection(roleId, store, breakdownStore, tagStore, totalEntries, chartInstance, validLabelsForTags);
        syncTagVisibilityToggle(roleId, chartInstance, tagStore, validLabelsForTags);
    };

    const assignChartFilterHandlers = (roleId, store, breakdownStore, tagStore) => {
        const btn7 = document.getElementById('btn7Days');
        const btn30 = document.getElementById('btn30Days');
        const btnAll = document.getElementById('btnAllDays');
        const btnResetZoom = document.getElementById('btnResetZoom');

        const btnNet = document.getElementById('btnNetWorthMode');
        const btnProfit = document.getElementById('btnProfitMode');
        const btnToggleBreakdown = document.getElementById('btnToggleBreakdown');

        if (btnNet) btnNet.onclick = () => {
            mainMode = 'networth';
            breakdownView = false;
            setActiveButton(['btnNetWorthMode', 'btnProfitMode'], 'btnNetWorthMode');
            if (btnToggleBreakdown) { btnToggleBreakdown.classList.remove('active'); btnToggleBreakdown.textContent = '分项资产'; }
            renderChart(roleId, store, breakdownStore, tagStore);
        };

        if (btnProfit) btnProfit.onclick = () => {
            mainMode = 'profit';
            breakdownView = false;
            setActiveButton(['btnNetWorthMode', 'btnProfitMode'], 'btnProfitMode');
            if (btnToggleBreakdown) { btnToggleBreakdown.classList.remove('active'); btnToggleBreakdown.textContent = '分项资产'; }
            renderChart(roleId, store, breakdownStore, tagStore);
        };

        if (btnToggleBreakdown) btnToggleBreakdown.onclick = () => {
            breakdownView = !breakdownView;
            if (breakdownView) {
                btnToggleBreakdown.classList.add('active');
                btnToggleBreakdown.textContent = '返回总览';
            } else {
                btnToggleBreakdown.classList.remove('active');
                btnToggleBreakdown.textContent = '分项资产';
            }
            renderChart(roleId, store, breakdownStore, tagStore);
        };

        if (btn7) btn7.onclick = () => { currentFilterDays = 7; setActiveButton(['btn7Days', 'btn30Days', 'btnAllDays'], 'btn7Days'); renderChart(roleId, store, breakdownStore, tagStore); };
        if (btn30) btn30.onclick = () => { currentFilterDays = 30; setActiveButton(['btn7Days', 'btn30Days', 'btnAllDays'], 'btn30Days'); renderChart(roleId, store, breakdownStore, tagStore); };
        if (btnAll) btnAll.onclick = () => { currentFilterDays = null; setActiveButton(['btn7Days', 'btn30Days', 'btnAllDays'], 'btnAllDays'); renderChart(roleId, store, breakdownStore, tagStore); };
        if (btnResetZoom) btnResetZoom.onclick = () => { resetChartZoom(chartInstance); chartInstance?.update(); };

        setActiveButton(['btnNetWorthMode', 'btnProfitMode'], mainMode === 'profit' ? 'btnProfitMode' : 'btnNetWorthMode');
    };

    const showModal = (roleId, store, breakdownStore, tagStore) => {
        const modalDiv = ensureModal();
        modalDiv.style.display = 'flex';

        const tagContainer = modalDiv.querySelector('#ep-tag-manager');
        const dataContainer = modalDiv.querySelector('#ep-data-manager');

        tagVisibility = getRoleBoolPref(STORAGE_KEYS.tagPrefs, roleId, true);
        tagPanelVisible = getRoleBoolPref(STORAGE_KEYS.tagPanel, roleId, false);
        dataPanelVisible = getRoleBoolPref(STORAGE_KEYS.dataPanel, roleId, false);
        tagContainer?.classList.toggle('active', tagPanelVisible);
        dataContainer?.classList.toggle('active', dataPanelVisible);

        bindPanelButtons(roleId, tagContainer, dataContainer);

        enqueueChartReady(() => {
            renderChart(roleId, store, breakdownStore, tagStore);
            assignChartFilterHandlers(roleId, store, breakdownStore, tagStore);
        });
    };

    const hideModal = () => {
        const modalDiv = document.getElementById('deltaNetworthChartModal');
        if (modalDiv) modalDiv.style.display = 'none';
    };

const EP_VERSION = '2025.12.22.7';
const EP_HIDE_PRECISION_HINT_KEY = 'ep_hide_precision_hint';
const EP_PRECISION_HINT_SHOWN_VER_KEY = 'ep_precision_hint_shown_ver';

/**
 * Show the MWITools precision hint once after each plugin update.
 * - Always show once when EP_VERSION changes (unless user permanently disabled it).
 * - "关闭" marks it as shown for this version (won't show again this version).
 * - "不再提示" disables it permanently.
 */
const shouldShowPrecisionHint = () => {
        try {
            // Version-scoped: show once after each update. Even if user previously clicked "不再提示",
            // we re-show after version changes.
            const shownVer = localStorage.getItem(EP_PRECISION_HINT_SHOWN_VER_KEY) || '';
            if (shownVer === EP_VERSION) return false;

            const suppressed = localStorage.getItem(EP_HIDE_PRECISION_HINT_KEY) || '';
            if (suppressed === EP_VERSION) return false;

            return true;
        } catch (e) {
            // If storage unavailable, still show once per page load
            return true;
        }
    };

const markPrecisionHintShown = () => {
    try { localStorage.setItem(EP_PRECISION_HINT_SHOWN_VER_KEY, EP_VERSION); } catch (e) {}
};

const renderPrecisionHint = (container) => {
    if (!container) return;
    if (document.getElementById('epPrecisionHint')) return;
    if (!shouldShowPrecisionHint()) return;

    const hint = document.createElement('div');
    hint.id = 'epPrecisionHint';
    hint.innerHTML = `
        <div>
            提示：如果主界面的“今日盈亏”只能按整百 M 变化，通常是 MWITools 的数值处理导致。
            你可以在油猴脚本 <b>MWITools</b> 中搜索 <code>1e9</code>，将对应那一行删除或注释后保存并刷新页面，
            “今日盈亏”即可精确到 0.1M 级别。
                <br/>另外，如果打开弹窗后总资产曲线出现不断缩小/放大，请将浏览器缩放恢复到 100%（Ctrl/⌘ + 0）。
        </div>
        <div class="epPrecisionHintActions">
            <button class="epPrecisionHintBtn" id="epPrecisionHintClose">关闭</button>
            <button class="epPrecisionHintBtn" id="epPrecisionHintNever">不再提示</button>
        </div>
    `;

    container.appendChild(hint);

    const btnClose = hint.querySelector('#epPrecisionHintClose');
    const btnNever = hint.querySelector('#epPrecisionHintNever');

    if (btnClose) btnClose.onclick = () => {
        markPrecisionHintShown();
        hint.remove();
    };

    if (btnNever) btnNever.onclick = () => {
        try { localStorage.setItem(EP_HIDE_PRECISION_HINT_KEY, EP_VERSION); } catch (e) {}
        markPrecisionHintShown();
        hint.remove();
    };
};

    const renderDeltaSection = (store, dom, roleId, breakdownStore, tagStore) => {
        const delta = store.getTodayDelta();
        const formattedDelta = formatSignedLargeNumber(delta);
        const color = delta > 0 ? 'green' : (delta < 0 ? 'red' : 'gray');

        const container = ensureDeltaContainer(dom);
        if (!container) return;

        const entries = store.getHistoryEntriesSorted();
        const latestDate = entries.length ? entries[entries.length - 1][0] : '-';

        // 近7天日均：基于最近 7 次“日变化”
        const last7 = entries.slice(-8);
        let avg7 = 0;
        if (last7.length >= 2) {
            let s = 0;
            let c = 0;
            for (let i = 1; i < last7.length; i++) {
                const d = last7[i][1] - last7[i - 1][1];
                if (Number.isFinite(d)) { s += d; c += 1; }
            }
            avg7 = c ? s / c : 0;
        }

        const lastUpdateIso = getRoleLastUpdate(roleId);
        const lastUpdateStr = lastUpdateIso ? formatIsoToLocalDateTime(lastUpdateIso) : (latestDate !== '-' ? latestDate : '—');

        container.innerHTML = `${buildDeltaContent(color, formattedDelta)}
            <div class="ep-delta-extra">
                <span>近7天日均: ${formatSignedLargeNumber(avg7)}</span>
                <span>最近记录: ${lastUpdateStr}</span>
            </div>`;

        // Optional hint: MWITools rounding/precision tip (dismissible)
        renderPrecisionHint(container);


        const showIcon = document.getElementById('showHistoryIcon');
        if (showIcon) {
            showIcon.onclick = (e) => {
                e.stopPropagation();
                const modal = document.getElementById('deltaNetworthChartModal');
                if (modal && modal.style.display === 'flex') hideModal();
                else showModal(roleId, store, breakdownStore, tagStore);
            };
        }

        const refreshIcon = document.getElementById('refreshNetworthIcon');
        if (refreshIcon) {
            refreshIcon.onclick = (e) => {
                e.stopPropagation();
                const latestValue = readCurrentNetworthValue();
                if (latestValue === null) return;

                store.setTodayValue(latestValue);
                setRoleLastUpdate(roleId);

                const todayKey = store.getTodayKey();
                const bd = readBreakdownFromMWITools();
                if (bd) breakdownStore.setTodayValue(todayKey, bd);

                renderDeltaSection(store, dom, roleId, breakdownStore, tagStore);
                const modal = document.getElementById('deltaNetworthChartModal');
                if (modal && modal.style.display === 'flex') showModal(roleId, store, breakdownStore, tagStore);
            };
        }
    };


    /* =========================
       Entry point: hook to networth DOM
    ========================= */
    window.kbd_calculateTotalNetworth = function kbd_calculateTotalNetworth(totalNetworth, dom) {
        const roleId = detectRoleId();

        const store = new DailyDataStore(STORAGE_KEYS.totalData, roleId);
        store.setRole(roleId);

        const breakdownStore = new BreakdownStore(STORAGE_KEYS.breakdownData, roleId);
        breakdownStore.setRole(roleId);

        const tagStore = new TagStore(STORAGE_KEYS.tags, roleId);
        tagStore.setRole(roleId);

        window.injectDeltaScript = () => {
            const latestNetworth = readCurrentNetworthValue();
            const valueToPersist = latestNetworth ?? totalNetworth ?? 0;
            if (Number.isFinite(valueToPersist)) store.setTodayValue(valueToPersist);

            setRoleLastUpdate(roleId);
            const todayKey = store.getTodayKey();
            const bd = readBreakdownFromMWITools();
            if (bd) breakdownStore.setTodayValue(todayKey, bd);

            ensureModal();
            renderDeltaSection(store, dom, roleId, breakdownStore, tagStore);
        };

        window.injectDeltaScript();

        if (!window.__everyday_profit_plus_interval__) {
            window.__everyday_profit_plus_interval__ = setInterval(() => window.injectDeltaScript?.(), 10 * 60 * 1000);
        }
    };

    const checkNetworthAndRun = () => {
        const networthDisplay = document.querySelector('#toggleNetWorth');
        if (networthDisplay) {
            const textContent = networthDisplay.textContent.trim();
            const totalNetworth = parseFormattedNumber(textContent);
            const insertDom = document.getElementById('netWorthDetails');
            if (insertDom && !document.getElementById('deltaNetworthDiv')) {
                window.kbd_calculateTotalNetworth?.(totalNetworth, insertDom);
            }
        }
    };

    checkNetworthAndRun();
    setInterval(checkNetworthAndRun, 5000);
})();