// ==UserScript==
// @name         Helpdesk - Статусы коллег
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Показывает статусы коллег в боковой панели хелпдеска с автообновлением каждые 10 сек
// @author       Ты
// @license MIT
// @match        https://stroitelnyjdvor.helpdeskeddy.com/*
// @grant        none
// @run-at       document-idle
// @language     ru
// @downloadURL https://update.greasyfork.org/scripts/551271/Helpdesk%20-%20%D0%A1%D1%82%D0%B0%D1%82%D1%83%D1%81%D1%8B%20%D0%BA%D0%BE%D0%BB%D0%BB%D0%B5%D0%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/551271/Helpdesk%20-%20%D0%A1%D1%82%D0%B0%D1%82%D1%83%D1%81%D1%8B%20%D0%BA%D0%BE%D0%BB%D0%BB%D0%B5%D0%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interval;

    function updateBlock() {
        const sidebar = document.querySelector('.ticket-sidebar');
        if (!sidebar) return;

        let container = sidebar.querySelector('.staffs-injected-block');
        if (!container) {
            container = document.createElement('div');
            container.className = 'staffs-injected-block';
            container.style.cssText = 'border-radius:3px;background:#f4f4f5;padding-bottom:10px;margin-bottom:12px;text-align:center;';
            sidebar.appendChild(container);
        }

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = '/ru/dashboard/staffs/';
        document.body.appendChild(iframe);

        let attempts = 0;
        const check = () => {
            try {
                const doc = iframe.contentDocument;
                const staffsDiv = doc.querySelector('.dashboard-staffs__content.ps');
                if (!staffsDiv) {
                    if (++attempts < 5) return setTimeout(check, 1500);
                    return container.innerHTML = '';
                }

                let html = '<ul style="list-style:none;padding:0;margin:0;">';
                staffsDiv.querySelectorAll('.dashboard-staffs__row').forEach(row => {
                    const nameEl = row.querySelector('.el-button span');
                    const name = nameEl?.textContent.trim() || 'Неизвестно';

                    let ticketsCount = 0;
                    const btn = row.querySelector('.dashboard-staffs__column_center .el-button span');
                    if (btn) {
                        const match = btn.textContent.match(/\d+/);
                        ticketsCount = match ? parseInt(match[0], 10) : 0;
                    }

                    let statusText = 'Неизвестно';
                    const sel = row.querySelector('.el-select-dropdown__item.selected span');
                    if (sel) {
                        statusText = sel.textContent.trim().replace(/^\[.*?\]\s*/, '').trim();
                    } else {
                        const input = row.querySelector('.el-input__inner');
                        if (input?.value) statusText = input.value.trim().replace(/^\[.*?\]\s*/, '').trim();
                    }

                    let color = '#F44336';
                    if (statusText.includes('В сети')) color = '#4CAF50';
                    else if (statusText.includes('Невидимка')) color = '#2196F3';
                    else if (statusText.includes('Перерыв') || statusText.includes('Обед')) color = '#FF9800';

                    const badge = `<span style="display:inline-block;width:5px;text-align:center;font-size:13px;color:${ticketsCount > 0 ? color : 'transparent'};line-height:1;margin-right:6px;">${ticketsCount > 9 ? '9+' : (ticketsCount > 0 ? ticketsCount : '')}</span>`;
                    html += `<li style="display:flex;align-items:center;gap:10px;padding:0;">
                        <span style="font-weight:normal;color:${color};display:flex;align-items:center;">${badge}${name}</span>
                        <span style="color:${color};margin-left:auto;margin-right:10px;">${statusText}</span>
                    </li>`;
                });
                html += '</ul>';

                container.innerHTML = '<h4 style="margin:16px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px;">Статусы коллег</h4>' + html;
                console.log('✅ Статусы коллег обновлены');
            } catch (e) {
                container.innerHTML = '';
                console.error('Ошибка:', e);
            } finally {
                setTimeout(() => iframe.remove(), 500);
            }
        };

        iframe.onload = () => setTimeout(check, 2000);
        iframe.onerror = () => {
            container.innerHTML = '';
            iframe.remove();
        };
    }

    const tryStart = () => {
        if (document.querySelector('.ticket-sidebar')) {
            updateBlock();
            if (!interval) interval = setInterval(updateBlock, 10000);
        } else {
            setTimeout(tryStart, 2000);
        }
    };

    if (document.readyState === 'complete') tryStart();
    else window.addEventListener('load', tryStart);

    window.addEventListener('beforeunload', () => interval && clearInterval(interval));
})();