// ==UserScript==
// @name         Torn Custom Usernames
// @version      2.6
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @description  Change torn's username to custom nicknames.
// @author       TR0LL [2561502]
// @license      TR0LL [2561502]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/563948/Torn%20Custom%20Usernames.user.js
// @updateURL https://update.greasyfork.org/scripts/563948/Torn%20Custom%20Usernames.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const globalWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (globalWindow.TornFramework) return;

    globalWindow.TornFramework = {
        version: '2.6',
        modules: new Map(),
        initialized: false,
        startTime: Date.now()
    };

    const now = Date.now();
    let logExpiry = GM_getValue('log_expiry', 0);
    if (now > logExpiry) {
        GM_setValue('framework_logs', []);
        GM_setValue('log_expiry', now + (24 * 60 * 60 * 1000));
    }

    const logDiv = document.createElement("div");
    logDiv.id = 'torn-framework-console';
    logDiv.style.cssText = `
        position: fixed; bottom: 0; left: 0; width: 500px; max-height: 300px;
        overflow-y: auto; background: rgba(0,0,0,0.95); color: white;
        font-size: 10px; z-index: 999999; padding: 12px; border-radius: 0 12px 0 0;
        font-family: 'Consolas', monospace; border: 2px solid #37b24d;
        box-shadow: 0 0 15px rgba(0,0,0,0.5); display: none;
    `;

    function log(msg, type = 'info', module = 'FRAMEWORK') {
        const utcTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        const logEntry = { timestamp: utcTime, msg, type, module };

        let logs = GM_getValue('framework_logs', []);
        logs.push(logEntry);
        if (logs.length > 150) logs.shift();
        GM_setValue('framework_logs', logs);

        if (window.location.href.includes('preferences.php')) {
            renderLogEntry(logEntry);
        }
    }

    function renderLogEntry(l) {
        const p = document.createElement("div");
        const colors = { 'error': '#ff6b6b', 'success': '#51cf66', 'warning': '#ffd43b', 'info': '#74c0fc' };
        p.style.cssText = `color: ${colors[l.type] || '#ccc'}; padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.1); line-height: 1.2;`;
        p.innerHTML = `<span style="color: #888;">[${l.timestamp}]</span> <span style="font-weight: bold;">[${l.module}]</span> ${l.msg}`;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    globalWindow.TornFramework.log = log;

    function processNames() {
        if (document.hidden) return;

        const nicks = GM_getValue('tf_nicknames', {});
        if (!nicks || Object.keys(nicks).length === 0) return;

        document.querySelectorAll('.sender___IWMrW').forEach(el => {
            let name = el.textContent.trim();
            if (name.endsWith(':')) name = name.slice(0, -1);
            for (let id in nicks) {
                if (nicks[id].original === name) {
                    const suffix = el.textContent.trim().endsWith(':') ? ':' : '';
                    el.textContent = nicks[id].nickname + suffix;
                    el.style.color = '#f59f00';
                }
            }
        });

        const header = document.querySelector('h4#skip-to-content.left');
        if (header) {
            let txt = header.textContent.trim();
            for (let id in nicks) {
                const orig = nicks[id].original;
                if (txt.includes(`${orig}'s Profile`)) {
                    header.textContent = txt.replace(orig, nicks[id].nickname);
                } else if (txt.startsWith(orig) && txt.includes('[')) {
                    header.textContent = txt.replace(orig, nicks[id].nickname);
                }
            }
        }
    }

    function injectNicknameUI() {
        const params = new URLSearchParams(window.location.search);
        const xid = params.get('XID');
        if (!xid) return;

        const checkHeader = setInterval(() => {
            const list = document.getElementById('top-page-links-list');
            if (list) {
                clearInterval(checkHeader);
                const reportBtn = list.querySelector('.send-report');
                const tutorialBtn = list.querySelector('.tutorial-switcher');
                if (reportBtn) reportBtn.remove();
                if (tutorialBtn) tutorialBtn.remove();
                if (document.getElementById('tf-nick-container')) return;

                const savedNick = (GM_getValue('tf_nicknames', {})[xid])?.nickname || '';

                const wrapper = document.createElement('div');
                wrapper.id = 'tf-nick-container';
                wrapper.className = 'line-h24 right';
                wrapper.style.cssText = `display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0 10px; height: 24px; margin-top: 2px;`;
                wrapper.innerHTML = `
                    <span style="color: #888; font-size: 10px; margin-right: 8px; text-transform: uppercase; font-weight: bold; user-select:none;">Alias:</span>
                    <input id="tf-nick-input" type="text" placeholder="Set..." value="${savedNick}" style="background: transparent; border: none; color: #ccc; width: 80px; font-size: 11px; outline: none;">
                    <span id="tf-nick-save" style="color: #37b24d; font-weight: bold; cursor: pointer; font-size: 14px; margin-left: 5px; user-select:none;">✓</span>
                `;
                list.appendChild(wrapper);

                document.getElementById('tf-nick-save').onclick = () => {
                    const newNick = document.getElementById('tf-nick-input').value.trim();
                    const nameDiv = document.querySelector('.user.name');
                    const realName = nameDiv ? nameDiv.getAttribute('data-placeholder') :
                                   document.querySelector('h4#skip-to-content')?.textContent.split("'s")[0].split('[')[0].trim();

                    let currentNicks = GM_getValue('tf_nicknames', {}) || {};
                    if (newNick === '') {
                        delete currentNicks[xid];
                        log(`Removed Alias for ${realName}`, 'info', 'NICKNAMES');
                    } else {
                        currentNicks[xid] = { nickname: newNick, original: realName };
                        log(`Set Alias "${newNick}" for ${realName}`, 'success', 'NICKNAMES');
                    }
                    GM_setValue('tf_nicknames', currentNicks);
                };
            }
        }, 500);
    }

    function initUI() {
        if (!window.location.href.includes('preferences.php')) return;

        document.body.appendChild(logDiv);
        logDiv.style.display = 'block';

        const history = GM_getValue('framework_logs', []);
        logDiv.innerHTML = '<div style="color:#37b24d; font-weight:bold; border-bottom:1px solid #333; margin-bottom:5px;">--- PERSISTENT UTC LOGS (24H) ---</div>';
        history.forEach(l => renderLogEntry(l));

        const menuBtn = document.createElement("button");
        menuBtn.innerHTML = "⚙️";
        menuBtn.style.cssText = `position: fixed; top: 10px; right: 10px; z-index: 999999; background: #37b24d; color: white; border: none; padding: 12px; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3);`;
        document.body.appendChild(menuBtn);

        const modMenu = document.createElement("div");
        modMenu.style.cssText = `position: fixed; top: 10px; right: 70px; width: 300px; background: #1a1a1a; color: white; z-index: 1000000; padding: 15px; border-radius: 8px; border: 2px solid #37b24d; display: none; box-shadow: 0 8px 25px rgba(0,0,0,0.5);`;
        modMenu.innerHTML = `
            <h3 style="color: #37b24d; margin: 0 0 15px 0; font-family: sans-serif;">Framework Settings</h3>
            <button id="clearAllNicks" style="background: #f03e3e; color: white; border: none; padding: 8px; width: 100%; cursor: pointer; border-radius: 4px; font-weight: bold;">Wipe All Nicknames</button>
            <button id="wipeLogs" style="background: #555; color: white; border: none; padding: 8px; width: 100%; cursor: pointer; border-radius: 4px; margin-top: 10px;">Clear Console Logs</button>
        `;
        document.body.appendChild(modMenu);

        menuBtn.onclick = () => modMenu.style.display = modMenu.style.display === 'none' ? 'block' : 'none';
        document.getElementById('clearAllNicks').onclick = () => {
            if (confirm('Permanently delete ALL saved nicknames?')) {
                GM_setValue('tf_nicknames', {});
                log('Database reset: All nicknames deleted', 'warning', 'NICKNAMES');
            }
        };
        document.getElementById('wipeLogs').onclick = () => {
            GM_setValue('framework_logs', []);
            logDiv.innerHTML = '';
            log('Console history cleared manually', 'info');
        };
    }

    processNames();
    setInterval(processNames, 1000);

    if (window.location.href.includes('profiles.php')) {
        injectNicknameUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();