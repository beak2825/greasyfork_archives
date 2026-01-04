// ==UserScript==
// @name         Auto Sitekey Finder + Animated Highlight + History + Clear + Persistent Position + Copy
// @namespace    https://example.com
// @version      1.8
// @description  Авто поиск Google reCAPTCHA sitekey с анимацией подсветки нового ключа, копирование, история, сохранение панели
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549620/Auto%20Sitekey%20Finder%20%2B%20Animated%20Highlight%20%2B%20History%20%2B%20Clear%20%2B%20Persistent%20Position%20%2B%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/549620/Auto%20Sitekey%20Finder%20%2B%20Animated%20Highlight%20%2B%20History%20%2B%20Clear%20%2B%20Persistent%20Position%20%2B%20Copy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CHECK_INTERVAL = 3000; // каждые 3 секунды проверяем
    const MAX_HISTORY = 10;
    const HIGHLIGHT_DURATION = 2500; // ms подсветки нового ключа

    const savedPos = GM_getValue('sitekeyPanelPos', { left: '10px', top: '10px' });
    let history = GM_getValue('sitekeyHistory', []);
    let lastKey = null;

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.left = savedPos.left;
    panel.style.top = savedPos.top;
    panel.style.background = 'rgba(0,0,0,0.7)';
    panel.style.color = '#00ff00';
    panel.style.padding = '8px 12px';
    panel.style.fontFamily = 'monospace';
    panel.style.fontSize = '12px';
    panel.style.borderRadius = '8px';
    panel.style.cursor = 'grab';
    panel.style.zIndex = '999999';
    document.body.appendChild(panel);

    const contentDiv = document.createElement('div');
    panel.appendChild(contentDiv);

    const refreshBtn = document.createElement('button');
    refreshBtn.style.marginTop = '4px';
    refreshBtn.style.fontSize = '11px';
    refreshBtn.innerText = 'Обновить поиск';
    panel.appendChild(refreshBtn);

    const clearBtn = document.createElement('button');
    clearBtn.style.marginTop = '4px';
    clearBtn.style.marginLeft = '4px';
    clearBtn.style.fontSize = '11px';
    clearBtn.innerText = 'Очистить историю';
    panel.appendChild(clearBtn);

    function renderPanel(currentKey, animate=false) {
        let html = '';
        if (currentKey) {
            html += `Sitekey найден:<br><b>${currentKey}</b><br>(скопирован)<br><br>`;
        } else {
            html += 'Sitekey не найден<br><br>';
        }
        if (history.length) {
            html += 'История:<br>';
            for (let i = history.length - 1; i >= 0; i--) {
                const isNew = animate && history[i] === lastKey;
                html += `<div class="history-item" style="font-size:11px; ${isNew ? 'background:#006400;color:#fff;padding:2px;border-radius:2px;' : ''}">${history[i]}</div>`;
            }
        }
        contentDiv.innerHTML = html;

        if (animate) {
            const newElem = contentDiv.querySelector('.history-item');
            if (newElem) {
                newElem.animate([
                    { backgroundColor: '#006400', color:'#fff' },
                    { backgroundColor: 'transparent', color:'#00ff00' }
                ], { duration: HIGHLIGHT_DURATION, easing: 'ease-out' });
            }
        }
    }

    // Dragging
    let isDragging = false, offsetX, offsetY;
    panel.addEventListener('mousedown', e => {
        if (e.target === refreshBtn || e.target === clearBtn) return;
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            panel.style.cursor = 'grab';
            GM_setValue('sitekeyPanelPos', { left: panel.style.left, top: panel.style.top });
        }
    });

    function copyToClipboard(text) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
        } else {
            navigator.clipboard.writeText(text).catch(e => console.error(e));
        }
    }

    function findSitekey() {
        let sitekey = null;

        const el = document.querySelector('.g-recaptcha');
        if (el && el.dataset.sitekey) sitekey = el.dataset.sitekey;

        if (!sitekey) {
            const iframe = document.querySelector('iframe[src*="recaptcha/api2/anchor"]');
            if (iframe) {
                const url = new URL(iframe.src);
                sitekey = url.searchParams.get('k');
            }
        }

        if (!sitekey && window.grecaptcha && grecaptcha.execute) {
            try {
                if (grecaptcha.enterprise) sitekey = grecaptcha.enterprise.sitekey || null;
            } catch (e) {}
        }

        if (sitekey && lastKey !== sitekey) {
            lastKey = sitekey;
            history.push(sitekey);
            if (history.length > MAX_HISTORY) history.shift();
            GM_setValue('sitekeyHistory', history);
            copyToClipboard(sitekey);
            renderPanel(sitekey, true); // с анимацией
        } else {
            renderPanel(sitekey, false);
        }
    }

    refreshBtn.addEventListener('click', findSitekey);
    clearBtn.addEventListener('click', () => {
        history = [];
        lastKey = null;
        GM_setValue('sitekeyHistory', history);
        renderPanel(null);
    });

    setInterval(findSitekey, CHECK_INTERVAL);
    window.addEventListener('load', () => setTimeout(findSitekey, 2000));

})();
