// ==UserScript==
// @name     Hack Google docs auto filter
// @name         Gemini Form Master v3.6 (Macksh DXP)
// @namespace    http://tampermonkey.net/
// @version      3.7.0
// @description  Copyright Macksh (DXP) - 0984594676 - Bypass TrustedHTML & Anti-tamper
// @author       Macksh (DXP)
// @match        https://docs.google.com/forms/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/560263/Hack%20Google%20docs%20auto%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/560263/Hack%20Google%20docs%20auto%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const _0xM = "TWFja3NoIChEWFAp";
    const _0xP = [48, 57, 56, 52, 53, 57, 52, 54, 55, 54];
    const _0xS = "TWFja3NoIChEWFApMDk4NDU5NDY3Ng==";

    const _vAuth = () => atob(_0xM);
    const _vPhone = () => _0xP.map(c => String.fromCharCode(c)).join('');

    const _integrity = () => {
        if (btoa(_vAuth() + _vPhone()) !== _0xS) {
            document.body.textContent = "SECURITY ALERT: UNAUTHORIZED MODIFICATION DETECTED.";
            throw new Error("Tamper detected.");
        }
        return true;
    };

    const _trap = () => {
        const _d = function() {
            const _s = new Date();
            debugger;
            if (new Date() - _s > 100) {
                while(true) { console.error("STOP DEBUGGING!"); }
            }
        };
        setInterval(_d, 1000);
    };

    GM_addStyle(`
        #m-p-root { position: fixed; top: 10px; right: 10px; z-index: 2147483647; font-family: -apple-system, sans-serif; }
        .m-p-card { background: #fff; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 260px; padding: 20px; border: 2px solid #1a73e8; }
        .m-p-h { font-weight: 800; color: #1a73e8; margin-bottom: 12px; font-size: 16px; text-align: center; }
        .m-p-in { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px; font-size: 12px; box-sizing: border-box; }
        .m-p-btn { width: 100%; padding: 12px; background: #1a73e8; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .m-p-btn:hover { background: #1557b0; }
        .m-p-btn:disabled { background: #ccc; }
        .m-p-log { margin-top: 10px; font-size: 11px; color: #444; background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 4px solid #1a73e8; min-height: 20px; }
        .m-p-f { margin-top: 15px; font-size: 9px; text-align: center; color: #888; border-top: 1px solid #eee; padding-top: 10px; line-height: 1.4; }
    `);

    function _buildUI() {
        if (!_integrity() || document.getElementById('m-p-root')) return;
        _trap();

        const root = document.createElement('div');
        root.id = 'm-p-root';
        const card = document.createElement('div');
        card.className = 'm-p-card';

        const header = document.createElement('div');
        header.className = 'm-p-h';
        header.textContent = "🌐 Gemini Pro Master";

        const input = document.createElement('input');
        input.type = 'password';
        input.className = 'm-p-in';
        input.placeholder = 'Enter Gemini API Key...';
        input.value = GM_getValue('MK_S', '');

        const btn = document.createElement('button');
        btn.className = 'm-p-btn';
        btn.textContent = '🚀 SOLVE FORM NOW';

        const log = document.createElement('div');
        log.className = 'm-p-log';
        log.textContent = 'Status: Ready.';

        const footer = document.createElement('div');
        footer.className = 'm-p-f';
        const supportText = document.createTextNode("Support: ");
        const phoneNum = document.createElement('b');
        phoneNum.style.color = "#0068ff";
        phoneNum.textContent = _vPhone();
        const copyright = document.createElement('div');
        copyright.textContent = "© 2025 " + _vAuth() + " - All Rights Reserved";

        footer.appendChild(supportText);
        footer.appendChild(phoneNum);
        footer.appendChild(copyright);

        card.append(header, input, btn, log, footer);
        root.appendChild(card);
        document.body.appendChild(root);

        btn.onclick = () => _execute(btn, log, input.value.trim());
    }

    async function _execute(btn, log, key) {
        if (!_integrity() || !key) return;
        GM_setValue('MK_S', key);
        btn.disabled = true;
        log.textContent = "🔍 Analyzing questions...";

        try {
            const items = Array.from(document.querySelectorAll('div[role="listitem"]'));
            const data = items.map((it, idx) => {
                const q = it.querySelector('div[role="heading"]')?.innerText.trim();
                const os = Array.from(it.querySelectorAll('div[role="radio"], div[role="checkbox"]'))
                                .map(o => (o.getAttribute('data-value') || o.innerText).trim());
                return { id: idx, q, opts: os };
            }).filter(x => x.q);

            log.textContent = "🤖 Gemini is processing...";

            GM_xmlhttpRequest({
                method: "POST",
                url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    contents: [{ parts: [{ text: `Solve this form for me. Output JSON only: {"ans":[{"id":number,"val":"string"}]}. Questions: ${JSON.stringify(data)}` }] }],
                    generationConfig: { temperature: 0.1 }
                }),
                onload: (res) => {
                    if (res.status === 200) {
                        const json = JSON.parse(res.responseText);
                        const cleanText = json.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
                        const answers = JSON.parse(cleanText).ans;

                        log.textContent = "📝 Filling in results...";
                        answers.forEach(a => {
                            const block = items[a.id];
                            const options = block.querySelectorAll('div[role="radio"], div[role="checkbox"]');
                            if (options.length > 0) {
                                options.forEach(opt => {
                                    const val = (opt.getAttribute('data-value') || opt.innerText).trim().toLowerCase();
                                    if (val === a.val.toLowerCase() || a.val.toLowerCase().includes(val)) opt.click();
                                });
                            } else {
                                const inputField = block.querySelector('input[type="text"], textarea');
                                if (inputField) {
                                    inputField.value = a.val;
                                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            }
                        });
                        log.textContent = "✅ Done by " + _vAuth() + "!";
                    } else {
                        log.textContent = "❌ Error: " + res.status;
                    }
                    btn.disabled = false;
                },
                onerror: () => {
                    log.textContent = "❌ Network connection error.";
                    btn.disabled = false;
                }
            });
        } catch (e) {
            log.textContent = "❌ System error.";
            btn.disabled = false;
        }
    }

    setInterval(_buildUI, 1000);
})();