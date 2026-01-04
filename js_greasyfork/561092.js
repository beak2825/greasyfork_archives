// ==UserScript==
// @name         Lolz Part Check
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Просто количество участий в розыгрышах
// @author       MARYXANAX
// @license      MIT
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/561092/Lolz%20Part%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/561092/Lolz%20Part%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const target = document.querySelector('.navTabs .account-links');
        if (!target || document.getElementById('live-limit-tracker')) return;

        const savedPos = GM_getValue('widgetPosFix', { top: '8px', right: '180px' });
        const cachedData = GM_getValue('limitCache', { text: '0 / 0', width: '0%' });

        const widget = document.createElement('div');
        widget.id = 'live-limit-tracker';
        widget.style = `
            position: absolute;
            top: ${savedPos.top};
            right: ${savedPos.right};
            z-index: 9999;
            cursor: move;
            user-select: none;
            background: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        const tooltip = document.createElement('div');
        tooltip.innerText = 'Лимит участий в розыгрышах';
        tooltip.style = `
            position: absolute;
            top: 32px;
            background: rgba(45, 45, 45, 0.98);
            color: #efefef;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-5px);
            transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            z-index: 1000000;
            pointer-events: none;
            border: 1px solid #555;
        `;

        const arrow = document.createElement('div');
        arrow.style = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-bottom-color: #555;
        `;
        tooltip.appendChild(arrow);

        const counterContainer = document.createElement('div');
        counterContainer.style = `
            width: 92px; height: 24px; position: relative;
            overflow: hidden; border-radius: 12px;
            background: rgba(0, 0, 0, 0.25);
        `;

        counterContainer.innerHTML = `
            <div id="tracker-bg" style="width: ${cachedData.width}; height: 100%; background: #2b8c5d; border-radius: 12px; transition: width 0.8s ease;"></div>
            <div id="tracker-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-weight: 700; font-size: 11px; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.8); display: flex;"></div>
        `;

        widget.appendChild(counterContainer);
        widget.appendChild(tooltip);
        target.appendChild(widget);

        updateTextWithAnimation(cachedData.text, false);

        widget.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
        widget.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(-5px)';
            tooltip.style.visibility = 'hidden';
        });

        let isDragging = false;
        let offset = { x: 0, y: 0 };

        widget.addEventListener('mousedown', (e) => {
            if (e.altKey) {
                isDragging = true;
                const rect = widget.getBoundingClientRect();
                offset.x = rect.right - e.clientX;
                offset.y = e.clientY - rect.top;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const parentRect = target.getBoundingClientRect();
                widget.style.right = (parentRect.right - e.clientX - offset.x) + 'px';
                widget.style.top = (e.clientY - parentRect.top - offset.y) + 'px';
                widget.style.left = 'auto';
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                GM_setValue('widgetPosFix', { top: widget.style.top, right: widget.style.right });
            }
        });
    }

    function updateTextWithAnimation(newStr, animate = true) {
        const container = document.getElementById('tracker-text');
        if (!container) return;
        const currentChars = Array.from(container.children);
        const newChars = newStr.split('');

        if (currentChars.length !== newChars.length) {
            container.innerHTML = '';
            newChars.forEach(char => {
                const span = document.createElement('span');
                span.innerText = char;
                span.style.transition = 'opacity 0.3s, transform 0.3s';
                container.appendChild(span);
            });
            return;
        }

        newChars.forEach((char, i) => {
            if (currentChars[i].innerText !== char) {
                if (animate) {
                    currentChars[i].style.opacity = '0';
                    currentChars[i].style.transform = 'translateY(-2px)';
                    setTimeout(() => {
                        currentChars[i].innerText = char;
                        currentChars[i].style.opacity = '1';
                        currentChars[i].style.transform = 'translateY(0)';
                    }, 150);
                } else {
                    currentChars[i].innerText = char;
                }
            }
        });
    }

    function updateLimit() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://lolz.live/forums/contests/",
            revalidate: true,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const counter = doc.querySelector('.limitCounter .counterText');
                const bg = doc.querySelector('.limitCounter .backgroundCounter');

                if (counter && bg) {
                    updateTextWithAnimation(counter.innerText, true);
                    const bgEl = document.getElementById('tracker-bg');
                    if (bgEl) bgEl.style.width = bg.style.width;
                    GM_setValue('limitCache', { text: counter.innerText, width: bg.style.width });
                }
            }
        });
    }

    const checkExist = setInterval(() => {
        if (document.querySelector('.navTabs .account-links')) {
            init();
            clearInterval(checkExist);
        }
    }, 500);

    updateLimit();
    setInterval(updateLimit, 15000);
})();