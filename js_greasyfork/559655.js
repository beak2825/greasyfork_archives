// ==UserScript==
// @name         LKML Filter: Linus Torvalds
// @namespace    https://greasyfork.org/zh-TW/users/1237813-abc0922001
// @version      1.4
// @description  Extracts messages from Linus Torvalds on lkml.org and displays them in a floating side panel for efficient browsing.
// @author       abc0922001
// @license      MIT
// @match        https://lkml.org/lkml/last1000/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559655/LKML%20Filter%3A%20Linus%20Torvalds.user.js
// @updateURL https://update.greasyfork.org/scripts/559655/LKML%20Filter%3A%20Linus%20Torvalds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Configuration
    const TARGET_AUTHOR = "Linus Torvalds";
    const CONFIG = {
        panelWidth: '450px',
        zIndex: '99999',
        borderColor: '#d9534f'
    };

    // 2. Styles
    const styles = `
        /* 主面板樣式 */
        #lkml-filter-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: ${CONFIG.panelWidth};
            height: 100vh;
            background: #fff;
            border-left: 3px solid ${CONFIG.borderColor};
            overflow-y: auto;
            z-index: ${CONFIG.zIndex};
            box-shadow: -2px 0 8px rgba(0,0,0,0.15);
            font-family: 'Segoe UI', sans-serif;
            font-size: 13px;
            color: #333;
            transition: transform 0.3s ease-in-out; /* 滑動動畫 */
            transform: translateX(0); /* 預設展開 */
        }

        /* 收合狀態 */
        #lkml-filter-panel.collapsed {
            transform: translateX(100%); /* 移出畫面 */
            box-shadow: none;
        }

        /* 切換按鈕樣式 */
        #lkml-toggle-btn {
            position: fixed;
            top: 50%;
            right: ${CONFIG.panelWidth}; /* 跟隨面板寬度 */
            transform: translateY(-50%);
            background: ${CONFIG.borderColor};
            color: white;
            padding: 10px 4px;
            cursor: pointer;
            z-index: ${CONFIG.zIndex};
            border-radius: 4px 0 0 4px;
            font-weight: bold;
            font-size: 14px;
            writing-mode: vertical-rl; /* 文字垂直排列 */
            text-orientation: upright;
            transition: right 0.3s ease-in-out;
            box-shadow: -2px 2px 5px rgba(0,0,0,0.2);
        }

        /* 按鈕在收合時的位置 */
        #lkml-filter-panel.collapsed + #lkml-toggle-btn {
            right: 0;
        }

        /* 內部表格樣式 */
        .panel-header {
            background: ${CONFIG.borderColor};
            color: white;
            padding: 10px;
            font-weight: bold;
            font-size: 14px;
            position: sticky;
            top: 0;
        }
        #lkml-side-table { width: 100%; border-collapse: collapse; }
        #lkml-side-table th { background: #f1f1f1; color: #333; padding: 8px; text-align: left; border-bottom: 2px solid #ccc; }
        #lkml-side-table td { border-bottom: 1px solid #eee; padding: 8px; vertical-align: top; }
        .col-date { width: 85px; color: #666; font-size: 12px; }
        .col-subject { font-weight: 500; }
        .lkml-link { text-decoration: none; color: #0275d8; display: block; }
        .lkml-link:hover { text-decoration: underline; }
        .empty-msg { padding: 20px; text-align: center; color: #999; }
    `;

    // 3. Logic: Extract Data
    function extractFilteredData() {
        const rows = document.querySelectorAll('table.mh tr.c0, table.mh tr.c1');
        const extracted = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const subjectLink = cells[1].querySelector('a');
                const authorLink = cells[2].querySelector('a');
                if (subjectLink && authorLink) {
                    const authorName = authorLink.innerText.trim();
                    if (authorName.includes(TARGET_AUTHOR)) {
                        const href = subjectLink.getAttribute('href');
                        const dateMatch = href.match(/\/lkml\/(\d{4}\/\d{2}\/\d{2})/);
                        const dateStr = dateMatch ? dateMatch[1] : 'Unknown';
                        extracted.push({
                            date: dateStr,
                            subject: subjectLink.innerText.trim(),
                            url: href
                        });
                    }
                }
            }
        });
        return extracted;
    }

    // 4. Logic: Render UI
    function renderPanel(data) {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Create Panel
        const panel = document.createElement('div');
        panel.id = 'lkml-filter-panel';

        // Check if screen is small (mobile/tablet), default to collapsed
        if (window.innerWidth < 1000) {
            panel.classList.add('collapsed');
        }

        // Create Toggle Button
        const btn = document.createElement('div');
        btn.id = 'lkml-toggle-btn';
        btn.innerText = 'Linus'; // 按鈕文字
        btn.title = "Toggle Side Panel";

        // Click Event
        btn.onclick = function() {
            panel.classList.toggle('collapsed');
        };

        // Panel Content
        let htmlContent = `<div class="panel-header">Messages from: ${TARGET_AUTHOR} (${data.length})</div>`;
        if (data.length === 0) {
            htmlContent += `<div class="empty-msg">No messages found on this page.</div>`;
        } else {
            htmlContent += `
                <table id="lkml-side-table">
                    <thead><tr><th class="col-date">Date</th><th class="col-subject">Subject</th></tr></thead>
                    <tbody>
            `;
            data.forEach(item => {
                htmlContent += `<tr><td class="col-date">${item.date}</td><td class="col-subject"><a href="${item.url}" class="lkml-link" target="_blank">${item.subject}</a></td></tr>`;
            });
            htmlContent += `</tbody></table>`;
        }

        panel.innerHTML = htmlContent;
        document.body.appendChild(panel);
        // Insert button right after panel to make CSS sibling selector work
        panel.after(btn);
    }

    // Execution
    const data = extractFilteredData();
    renderPanel(data);

})();