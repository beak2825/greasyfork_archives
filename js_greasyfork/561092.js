// ==UserScript==
// @name         Lolz Part Check
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Просто количество участий в розыгрышах
// @author       taskill
// @license      MIT
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561092/Lolz%20Part%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/561092/Lolz%20Part%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
        .limit-notif { position: fixed; bottom: 20px; left: 20px; background: #1a1a1a; color: #efefef; padding: 14px 20px; border-radius: 6px; z-index: 1000001; font-family: 'Open Sans', sans-serif; font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: space-between; min-width: 300px; animation: slideInNotif 0.3s ease-out; overflow: hidden; border-left: 4px solid #ff4d4d; }
        @keyframes slideInNotif { from { transform: translateX(-110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .notif-close { cursor: pointer; color: #666; margin-left: 20px; display: flex; transition: color 0.2s; }
        .notif-close:hover { color: #ff4d4d; }
        .notif-progress-wrap { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(255, 255, 255, 0.05); }
        .notif-progress-fill { height: 100%; background: #ff4d4d; width: 100%; }
    `);

    function showLimitNotification() {
        if (document.getElementById('limit-alert')) return;
        const notif = document.createElement('div');
        notif.id = 'limit-alert';
        notif.className = 'limit-notif';
        notif.innerHTML = `<div style="font-weight: 600;">Достигнут лимит участий в розыгрышах</div><div class="notif-close" id="close-notif"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M1 11L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><div class="notif-progress-wrap"><div class="notif-progress-fill" id="notif-bar"></div></div>`;
        document.body.appendChild(notif);
        const bar = notif.querySelector('#notif-bar');
        const duration = 5000;
        let start = Date.now();
        const timer = setInterval(() => {
            let elapsed = Date.now() - start;
            let progress = 100 - (elapsed / duration * 100);
            bar.style.width = progress + '%';
            if (elapsed >= duration) { clearInterval(timer); notif.remove(); }
        }, 20);
        notif.querySelector('#close-notif').onclick = () => { clearInterval(timer); notif.remove(); };
    }

    function init() {
        const target = document.querySelector('.navTabs .account-links');
        if (!target || document.getElementById('live-limit-tracker')) return;

        const savedPos = GM_getValue('widgetPosFix', { top: '10px', right: '481px' });
        const cachedData = GM_getValue('limitCache', { text: '0 / 0', width: '0%' });
        const sizes = GM_getValue('widgetSizes', { barWidth: 96, fontSize: 12, notifEnabled: true });

        const widget = document.createElement('div');
        widget.id = 'live-limit-tracker';
        widget.style = `position: absolute; top: ${savedPos.top}; right: ${savedPos.right}; z-index: 9999; cursor: move; user-select: none; display: flex; flex-direction: column; align-items: center;`;

        const tooltip = document.createElement('div');
        tooltip.innerText = 'Лимит участий в розыгрышах';
        tooltip.style = `position: absolute; top: 32px; background: rgba(45, 45, 45, 0.9); color: #efefef; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; white-space: nowrap; opacity: 0; visibility: hidden; transform: translateY(-5px); transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 1000000; pointer-events: none; border: 1px solid #444;`;

        const mainRow = document.createElement('div');
        mainRow.style = "display: flex; align-items: center; gap: 2px;";

        const counterContainer = document.createElement('div');
        counterContainer.style = `width: ${sizes.barWidth}px; height: 24px; position: relative; overflow: hidden; border-radius: 12px; background: rgba(0, 0, 0, 0.25);`;
        counterContainer.innerHTML = `
            <div id="tracker-bg" style="width: ${cachedData.width}; height: 100%; background: #2b8c5d; border-radius: 12px; transition: width 0.8s ease;"></div>
            <div id="tracker-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-weight: 700; font-size: ${sizes.fontSize}px; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.8); display: flex;"></div>
        `;

        const settingsBtn = document.createElement('div');
        settingsBtn.style = `cursor: pointer; display: flex; align-items: center; opacity: 0; transition: opacity 0.2s; padding: 5px 2px; margin-right: -25px;`;
        settingsBtn.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="#666"><path d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/><path d="m19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>`;

        const menu = document.createElement('div');
        menu.id = 'limit-settings-menu';
        menu.style = `position: absolute; top: 24px; right: -20px; background: #222; border: 1px solid #3d3d3d; border-radius: 4px; padding: 10px; display: none; flex-direction: column; gap: 8px; box-shadow: 0 6px 15px rgba(0,0,0,0.7); z-index: 10000; width: 145px;`;
        menu.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 9px; color: #666; text-transform: uppercase; margin-bottom: 4px;">Ширина</span>
                    <input type="range" id="range-width" min="60" max="180" value="${sizes.barWidth}" class="glow-slider">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 9px; color: #666; text-transform: uppercase; margin-bottom: 4px;">Размер шрифта</span>
                    <input type="range" id="range-font" min="8" max="14" value="${sizes.fontSize}" class="glow-slider">
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #333; padding-top: 5px;">
                    <span style="font-size: 8px; color: #666; text-transform: uppercase;">Уведомления</span>
                    <input type="checkbox" id="check-notif" ${sizes.notifEnabled ? 'checked' : ''} style="cursor: pointer; accent-color: #2b8c5d; margin-right: -2px;">
                </div>
            </div>
            <style>
                .glow-slider { appearance: none; width: 100%; height: 2px; background: #333; outline: none; border-radius: 2px; }
                .glow-slider::-webkit-slider-thumb { appearance: none; width: 10px; height: 10px; border-radius: 50%; background: #2b8c5d; cursor: pointer; border: none; box-shadow: 0 0 8px #2b8c5d, 0 0 12px rgba(43, 140, 93, 0.6); transition: transform 0.1s; }
                .glow-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
            </style>
        `;

        mainRow.appendChild(counterContainer);
        mainRow.appendChild(settingsBtn);
        widget.appendChild(mainRow);
        widget.appendChild(tooltip);
        widget.appendChild(menu);
        target.appendChild(widget);

        updateTextWithAnimation(cachedData.text, false);

        widget.onmouseenter = () => { settingsBtn.style.opacity = '1'; if (menu.style.display !== 'flex') { tooltip.style.visibility = 'visible'; tooltip.style.opacity = '1'; tooltip.style.transform = 'translateY(0)'; } };
        widget.onmouseleave = () => { if (menu.style.display === 'flex') return; settingsBtn.style.opacity = '0'; tooltip.style.opacity = '0'; tooltip.style.transform = 'translateY(-5px)'; tooltip.style.visibility = 'hidden'; };
        settingsBtn.onclick = (e) => { e.stopPropagation(); const isVisible = menu.style.display === 'flex'; menu.style.display = isVisible ? 'none' : 'flex'; if (!isVisible) { tooltip.style.opacity = '0'; tooltip.style.visibility = 'hidden'; } };
        document.addEventListener('click', (e) => { if (!widget.contains(e.target)) { menu.style.display = 'none'; settingsBtn.style.opacity = '0'; } });

        const rangeWidth = menu.querySelector('#range-width');
        const rangeFont = menu.querySelector('#range-font');
        const checkNotif = menu.querySelector('#check-notif');

        rangeWidth.oninput = () => { sizes.barWidth = rangeWidth.value; counterContainer.style.width = sizes.barWidth + 'px'; GM_setValue('widgetSizes', sizes); };
        rangeFont.oninput = () => { sizes.fontSize = rangeFont.value; document.getElementById('tracker-text').style.fontSize = sizes.fontSize + 'px'; GM_setValue('widgetSizes', sizes); };
        checkNotif.onchange = () => { sizes.notifEnabled = checkNotif.checked; GM_setValue('widgetSizes', sizes); };

        let isDragging = false, offset = { x: 0, y: 0 };
        widget.onmousedown = (e) => {
            if (e.altKey) {
                isDragging = true;
                const rect = widget.getBoundingClientRect();
                offset.x = rect.right - e.clientX;
                offset.y = e.clientY - rect.top;
                e.preventDefault();
            }
        };
        window.onmousemove = (e) => {
            if (isDragging) {
                const parentRect = target.getBoundingClientRect();
                widget.style.right = (parentRect.right - e.clientX - offset.x) + 'px';
                widget.style.top = (e.clientY - parentRect.top - offset.y) + 'px';
            }
        };
        window.onmouseup = () => {
            if (isDragging) {
                isDragging = false;
                GM_setValue('widgetPosFix', { top: widget.style.top, right: widget.style.right });
            }
        };
    }

    function updateTextWithAnimation(newStr, animate = true) {
        const container = document.getElementById('tracker-text');
        if (!container) return;
        const newChars = newStr.split('');
        if (container.children.length !== newChars.length) {
            container.innerHTML = '';
            newChars.forEach(char => { const span = document.createElement('span'); span.innerText = char; span.style.transition = 'opacity 0.3s, transform 0.3s'; container.appendChild(span); });
            return;
        }
        Array.from(container.children).forEach((span, i) => {
            if (span.innerText !== newChars[i]) {
                if (animate) { span.style.opacity = '0'; span.style.transform = 'translateY(-2px)'; setTimeout(() => { span.innerText = newChars[i]; span.style.opacity = '1'; span.style.transform = 'translateY(0)'; }, 150); } else { span.innerText = newChars[i]; }
            }
        });
    }

    function updateLimit() {
        GM_xmlhttpRequest({
            method: "GET", url: "https://lolz.live/forums/contests/", revalidate: true,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const counter = doc.querySelector('.limitCounter .counterText');
                const bg = doc.querySelector('.limitCounter .backgroundCounter');
                if (counter && bg) {
                    updateTextWithAnimation(counter.innerText, true);
                    const bgEl = document.getElementById('tracker-bg');
                    if (bgEl) bgEl.style.width = bg.style.width;

                    const savedSizes = GM_getValue('widgetSizes', { notifEnabled: true });
                    const wasNotified = GM_getValue('alreadyNotified', false);

                    if (bg.style.width === "100%") {
                        if (!wasNotified && savedSizes.notifEnabled) {
                            showLimitNotification();
                            GM_setValue('alreadyNotified', true);
                        }
                    } else {
                        GM_setValue('alreadyNotified', false);
                    }
                    GM_setValue('limitCache', { text: counter.innerText, width: bg.style.width });
                }
            }
        });
    }

    const checkExist = setInterval(() => { if (document.querySelector('.navTabs .account-links')) { init(); clearInterval(checkExist); } }, 500);
    updateLimit();
    setInterval(updateLimit, 15000);
})();