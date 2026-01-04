// ==UserScript==
// @name         拼多多快递信息导出助手 Pinduoduo Tracking Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Export Pinduoduo order tracking info as Excel
// @author       Trizzy33
// @match        https://mobile.pinduoduo.com/*
// @match        https://*.pinduoduo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      mobile.pinduoduo.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/551613/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%BF%AB%E9%80%92%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B%20Pinduoduo%20Tracking%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/551613/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%BF%AB%E9%80%92%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B%20Pinduoduo%20Tracking%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPddUserId() {
        const match = document.cookie.match(/pdd_user_id=([^;]+)/);
        return match ? match[1] : null;
    }

    function getAntiContent() {
        if (window.__anti_content) return window.__anti_content;
        const stored = sessionStorage.getItem('anti_content') || localStorage.getItem('anti_content');
        return stored || GM_getValue('cached_anti_content', '');
    }

    function interceptAntiContent() {
        const origFetch = window.fetch;
        window.fetch = function(...args) {
            return origFetch.apply(this, args).then(r => {
                if (args[1]?.body) {
                    try {
                        const body = JSON.parse(args[1].body);
                        if (body.anti_content) GM_setValue('cached_anti_content', body.anti_content);
                    } catch(e) {}
                }
                return r;
            });
        };

        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url) { this._url = url; return origOpen.apply(this, arguments); };
        XMLHttpRequest.prototype.send = function(body) {
            if (this._url?.includes('pinduoduo.com') && body) {
                try {
                    const data = JSON.parse(body);
                    if (data.anti_content) GM_setValue('cached_anti_content', data.anti_content);
                } catch(e) {}
            }
            return origSend.apply(this, arguments);
        };
    }

    function getExpressInfo() {
        const userId = getPddUserId();
        if (!userId) return console.error('No pdd_user_id found.');
        const anti = getAntiContent();

        const url = `https://mobile.pinduoduo.com/proxy/api/api/express_trackbox/list?pdduid=${userId}`;
        const data = {
            offset: 0,
            count: 10,
            channel: "express_box_my_express",
            entry_source: null,
            status_type: 0,
            query_type: 0,
            anti_content: anti
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://mobile.pinduoduo.com',
                'Referer': 'https://mobile.pinduoduo.com/'
            },
            data: JSON.stringify(data),
            onload: res => {
                try {
                    const d = JSON.parse(res.responseText);
                    if (d.success) showExpress(d.result.track_info_list);
                    else console.error('API error:', d.error_msg);
                } catch(e) { console.error('Parse failed:', e); }
            },
            onerror: e => console.error('Request failed:', e)
        });
    }

    function showExpress(list) {
        if (!list?.length) return alert('No data found');
        let text = '';
        list.forEach((i, n) => {
            text += `${n + 1}. ${i.goods_name}\n`;
            text += `   Tracking: ${i.tracking_number}\n`;
            text += `   Status: ${i.status_type_desc}\n`;
            text += `   Pickup: ${i.pick_code || 'N/A'}\n`;
            text += `   Detail: ${i.track_desc}\n\n`;
        });

        const exportExcel = confirm(text + '\nPress OK to export Excel, Cancel to copy text.');
        if (exportExcel) exportToExcel(list);
        else { navigator.clipboard.writeText(text); alert('Copied to clipboard'); }
    }

    function exportToExcel(list) {
        const data = list.map(i => ({
            'Product': i.goods_name,
            'Tracking': i.tracking_number,
            'Status': i.status_type_desc,
            'Pickup Code': i.pick_code || 'N/A'
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws['!cols'] = [{wch:50}, {wch:20}, {wch:10}, {wch:25}];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Express Info");

        const t = new Date();
        const name = `PDD_Express_${t.getFullYear()}${String(t.getMonth()+1).padStart(2,'0')}${String(t.getDate()).padStart(2,'0')}_${String(t.getHours()).padStart(2,'0')}${String(t.getMinutes()).padStart(2,'0')}.xlsx`;
        XLSX.writeFile(wb, name);
        console.log('Exported:', name);
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Export';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 20px',
            background: '#e02e24',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        btn.onclick = getExpressInfo;
        document.body.appendChild(btn);
    }

    function init() {
        console.log('[PDD Express Exporter] Loaded');
        interceptAntiContent();
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createButton);
        else createButton();
    }

    init();
})();
