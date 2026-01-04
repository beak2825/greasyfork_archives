// ==UserScript==
// @name         微博聊天-群聊消息保存
// @namespace    http://tampermonkey.net/
// @version      1
// @author       tu
// @description  捕获微博群聊接口（XHR/fetch），保存 id / from_uid / 时间排序后的消息
// @match        https://api.weibo.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556951/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E7%BE%A4%E8%81%8A%E6%B6%88%E6%81%AF%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/556951/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E7%BE%A4%E8%81%8A%E6%B6%88%E6%81%AF%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window._weiboMessages = [];
    window._weiboMessageIds = new Set();
    const msgApiRegex = /\/webim\/groupchat\/query_messages\.json/;

    function getMsgId(msg) {
        return msg?.id || msg?.mid || msg?.message_id || null;
    }

    function getTimestamp(msg) {
        if (typeof msg.time === 'number' && msg.time > 0) {
            return msg.time * 1000;
        }
        if (msg.created_at) {
            const t = Date.parse(msg.created_at);
            if (!isNaN(t)) return t;
        }
        return Date.now();
    }

    function formatMsgTime(ts) {
        return new Date(ts).toLocaleString();
    }

    function getMsgContent(msg) {
        const raw = msg?.content ?? msg?.text ?? msg?.message ?? msg?.body ?? '';
        // 替换换行符和多余空格
        return raw.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function pushMessageNormalized(msg) {
        const id = getMsgId(msg);
        if (!id) return false;
        if (window._weiboMessageIds.has(String(id))) return false;
        window._weiboMessageIds.add(String(id));

        const ts = getTimestamp(msg);
        const normalized = {
            id: id,
            from_uid: msg.from_uid || (msg.from_user?.id) || null,
            user: msg.from_user?.screen_name || msg.from_user?.name || msg.from_uid || '未知用户',
            timestamp: ts,
            time: formatMsgTime(ts),
            content: getMsgContent(msg),
            raw: msg
        };
        window._weiboMessages.push(normalized);
        return true;
    }

    function handleMessages(data) {
        const msgs = data.messages || data.data?.messages || [];
        if (!Array.isArray(msgs) || msgs.length === 0) return;
        let added = 0;
        for (const m of msgs) {
            if (pushMessageNormalized(m)) added++;
        }
        if (added > 0) {
            console.log(`📥 新增 ${added} 条消息，总计 ${window._weiboMessages.length}`);
        }
    }

    function sortMessages() {
        window._weiboMessages.sort((a, b) => a.timestamp - b.timestamp);
    }

    function downloadTXT(filename) {
        if (window._weiboMessages.length === 0) { alert('没有消息可保存'); return; }
        sortMessages();
        const lines = window._weiboMessages.map(m =>
            `[${m.id}][${m.time}][${m.from_uid}]${m.user}: ${m.content}`
        );
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function downloadJSON(filename) {
        if (window._weiboMessages.length === 0) { alert('没有消息可保存'); return; }
        sortMessages();
        const blob = new Blob([JSON.stringify(window._weiboMessages, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // hook fetch
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await origFetch.apply(this, args);
        let url = '';
        try {
            if (typeof args[0] === 'string') url = args[0];
            else if (args[0] instanceof Request) url = args[0].url;
        } catch { }
        if (url && msgApiRegex.test(url)) {
            try {
                const clone = response.clone();
                clone.json().then(data => handleMessages(data)).catch(() => { });
            } catch { }
        }
        return response;
    };

    // hook XHR
    (function () {
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this._weibo_capture_url = url;
            return origOpen.apply(this, [method, url, ...rest]);
        };
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (...args) {
            this.addEventListener('load', function () {
                const url = this._weibo_capture_url || this.responseURL || '';
                if (url && msgApiRegex.test(url)) {
                    try {
                        const text = this.responseText;
                        const data = JSON.parse(text);
                        handleMessages(data);
                    } catch { }
                }
            });
            return origSend.apply(this, args);
        };
    })();

    // UI
    function addPanel() {
        if (document.getElementById('weiboCapturePanel')) return;
        const panel = document.createElement('div');
        panel.id = 'weiboCapturePanel';
        panel.style.cssText = `
          position: fixed; right: 18px; bottom: 18px; z-index: 2147483647;
          background: rgba(0,0,0,0.7); color: #fff; padding: 10px;
          border-radius: 8px; font-family: sans-serif; font-size: 13px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; gap: 8px; align-items: center;
        `;

        const countEl = document.createElement('div');
        countEl.id = 'weiboCaptureCount';
        countEl.innerText = `已捕获：${window._weiboMessages.length}`;
        countEl.style.minWidth = '90px';

        const btnTxt = document.createElement('button');
        btnTxt.innerText = '下载 TXT';
        btnTxt.onclick = () => downloadTXT(`weibo_groupchat_${Date.now()}.txt`);

        const btnJson = document.createElement('button');
        btnJson.innerText = '下载 JSON';
        btnJson.onclick = () => downloadJSON(`weibo_groupchat_${Date.now()}.json`);

        const btnClear = document.createElement('button');
        btnClear.innerText = '清空';
        btnClear.onclick = () => {
            if (!confirm('确认清空已捕获的消息？')) return;
            window._weiboMessages = [];
            window._weiboMessageIds = new Set();
            countEl.innerText = `已捕获：0`;
        };

        [btnTxt, btnJson, btnClear].forEach(btn => {
            btn.style.cssText = `
              padding: 6px 8px; border: none; border-radius: 6px; cursor: pointer;
            `;
        });

        panel.appendChild(countEl);
        panel.appendChild(btnTxt);
        panel.appendChild(btnJson);
        panel.appendChild(btnClear);
        document.body.appendChild(panel);

        setInterval(() => {
            countEl.innerText = `已捕获：${window._weiboMessages.length}`;
        }, 1000);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        addPanel();
    } else {
        window.addEventListener('DOMContentLoaded', addPanel);
    }
})();
