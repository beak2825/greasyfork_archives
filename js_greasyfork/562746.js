// ==UserScript==
// @name         云崽高亮器
// @namespace    https://github.com/hinotoyk/contrail_progeny
// @version      1.0.0
// @description  一键高亮云崽并展示相关数据
// @author       hinotoyk
// @license      CC BY-NC-SA 4.0
// @match        https://www.jra.go.jp/*
// @match        https://www.jbis.or.jp/*
// @match        https://*.netkeiba.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/562746/%E4%BA%91%E5%B4%BD%E9%AB%98%E4%BA%AE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562746/%E4%BA%91%E5%B4%BD%E9%AB%98%E4%BA%AE%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************
     * JSON 数据地址
     **********************/
    const DATA_URL =
        'https://raw.githubusercontent.com/hinotoyk/contrail_progeny/main/Contrail%27s%20Crops%20Progress%202023.json';

    /**********************
     * Tooltip 主展示字段
     **********************/
    const MAIN_FIELDS = [
        { key: "馬名", title: true },
        { key: "性別", label: "性别" },
        { key: "毛色", label: "毛色" },
        { key: "馬主", label: "马主" },
        { key: "母名", label: "母马" },
        { key: "母父名", label: "母父" },
        { key: "生产牧场", label: "牧场" },
        { key: "管理調教師", label: "调教师" },
        { key: "备考", label: "备注", multiline: true }
    ];

    /**********************
     * 折叠字段
     **********************/
    const COLLAPSE_FIELDS = [
        { key: "近况更新/近走/牧场评价", label: "近况 / 牧场评价" },
        { key: "血统分析", label: "血统分析" }
    ];

    /**********************
     * Tooltip HTML 渲染
     **********************/
    function renderTooltip(horse) {
        let html = `<div class="horse-tooltip">`;

        MAIN_FIELDS.forEach(f => {
            const val = horse[f.key];
            if (!val) return;

            if (f.title) {
                // 获取译名（优先港译，其次译名）
                const translate = horse["港译"] || horse["译名"] || "暂无译名";
                html += `<div class="tt-title">${val}（${escapeHTML(translate)}）</div>`;
            } else if (f.multiline) {
                html += `
                    <div class="tt-block">
                        <div class="tt-label">${f.label}</div>
                        <div class="tt-multi">${escapeHTML(val).replace(/\n/g, '<br>')}</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="tt-row">
                        <span class="tt-label">${f.label}</span>
                        <span class="tt-value">${escapeHTML(val)}</span>
                    </div>
                `;
            }
        });

        COLLAPSE_FIELDS.forEach(f => {
            const val = horse[f.key];
            if (!val) return;

            html += `
                <details class="tt-collapse">
                    <summary>${f.label}</summary>
                    <div class="tt-multi">
                        ${escapeHTML(val).replace(/\n/g, '<br>')}
                    </div>
                </details>
            `;
        });

        html += `</div>`;
        return html;
    }

    /**********************
     * CSS（纸张风 + 思源黑体）
     **********************/
    GM_addStyle(`
        .horse-highlight {
            background: linear-gradient(transparent 55%, #ffd6d6 55%);
            color: #ff8181;
            font-weight: bold;
            padding: 0 4px;
            border-radius: 4px;
            position: relative;
            cursor: pointer;
            padding-bottom: 6px; /* 给鼠标移动留缓冲 */
        }

        .horse-translate {
            color: #ff8181;
            font-weight: bold;
            margin-left: 0;
            opacity: 1;
            font-family:
                "Noto Sans CJK JP",
                "Noto Sans CJK SC",
                "Source Han Sans",
                "思源黑体",
                "PingFang SC",
                "Hiragino Sans",
                "Microsoft YaHei",
                sans-serif;
        }

        .horse-tooltip {
    display: block;              /* 关键：始终存在 */
    opacity: 0;
    visibility: hidden;
    pointer-events: auto;        /* 允许鼠标进入 */
    position: fixed;             /* 固定定位，避免被父容器裁剪 */
    width: 420px;
    max-height: 80vh;            /* 最大高度为视口的80% */
    overflow-y: auto;            /* 内容超出时显示滚动条 */
    background: #faf7f2;
    color: #333;
    font-size: 18px;
    font-family:
        "Noto Sans CJK JP",
        "Noto Sans CJK SC",
        "Source Han Sans",
        "思源黑体",
        "PingFang SC",
        "Hiragino Sans",
        "Microsoft YaHei",
        sans-serif;
    border-radius: 10px;
    padding: 16px 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,.25);
    z-index: 2147483647;         /* 使用最大z-index值确保始终在最上层 */

    transition:
        opacity 0.15s ease,
        visibility 0.15s ease;
}

/* 美化滚动条样式 */
.horse-tooltip::-webkit-scrollbar {
    width: 8px;
}

.horse-tooltip::-webkit-scrollbar-track {
    background: #e8e3db;
    border-radius: 10px;
}

.horse-tooltip::-webkit-scrollbar-thumb {
    background: #bfb8ac;
    border-radius: 10px;
}

.horse-tooltip::-webkit-scrollbar-thumb:hover {
    background: #a39a8e;
}


   .horse-highlight:hover .horse-tooltip,
.horse-tooltip:hover {
    opacity: 1;
    visibility: visible;
}


        .tt-title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 6px;
        }

        .tt-row {
            display: flex;
            margin: 6px 0;
        }

        .tt-label {
            width: 100px;
            color: #666;
            flex-shrink: 0;
        }

        .tt-block {
            margin-top: 10px;
        }

        .tt-multi {
            line-height: 1.5;
            margin-top: 6px;
            white-space: normal;
        }

        details.tt-collapse {
            margin-top: 14px;
        }

        details.tt-collapse summary {
            cursor: pointer;
            font-weight: bold;
            color: #0050b3;
        }
    `);

    /**********************
     * 加载 JSON
     **********************/
    GM_xmlhttpRequest({
        method: 'GET',
        url: DATA_URL,
        onload(res) {
            let list;
            try {
                list = JSON.parse(res.responseText);
            } catch (e) {
                console.error('Horse JSON parse error', e);
                return;
            }
            initHighlight(list);
        }
    });

    /**********************
     * 高亮逻辑（安全版）
     **********************/
    function initHighlight(horses) {
        const map = new Map();
        horses.forEach(h => {
            if (h["馬名"]) map.set(h["馬名"], h);
        });

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
            const text = node.nodeValue;
            if (!text || text.trim().length < 2) return;

            map.forEach((horse, name) => {
                if (!text.includes(name)) return;

                const translate = horse["港译"] || horse["译名"] || '';
                const translateHtml = translate
                    ? `<span class="horse-translate">（${escapeHTML(translate)}）</span>`
                    : '';

                const span = document.createElement('span');
                span.className = 'horse-highlight';
                span.innerHTML = `
                    ${name}${translateHtml}
                    ${renderTooltip(horse)}
                `;

                // 添加鼠标移入事件，动态设置tooltip位置
                span.addEventListener('mouseenter', function(e) {
                    const tooltip = this.querySelector('.horse-tooltip');
                    if (tooltip) {
                        const rect = this.getBoundingClientRect();
                        tooltip.style.top = (rect.bottom + 8) + 'px';
                        tooltip.style.left = rect.left + 'px';
                    }
                });

                node.parentNode.replaceChild(span, node);
            });
        });
    }

    /**********************
     * HTML 转义
     **********************/
    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

})();
