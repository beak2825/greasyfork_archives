// ==UserScript==
// @name         Kick Latency
// @namespace    latency
// @version      1.9.5
// @description  Show latency on kick
// @icon         https://img.freepik.com/premium-vector/kick-logo-vector-download-kick-streaming-icon-logo-vector-eps_691560-10811.jpg
// @author       frz
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553938/Kick%20Latency.user.js
// @updateURL https://update.greasyfork.org/scripts/553938/Kick%20Latency.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let header = null, spinner = null, tooltip = null, container = null, textSpan = null;

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    function styleHeader(el) {
        Object.assign(el.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none'
        });
    }

    function createRedDot() {
        const d = document.createElement('span');
        Object.assign(d.style, {
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#FF4B4B',
            marginRight: '6px',
            transition: 'transform 0.2s ease'
        });
        return d;
    }

    function readKickLatency() {
        const v = document.querySelector('video');
        if (!v || !v.buffered.length) return null;
        const lat = v.buffered.end(v.buffered.length - 1) - v.currentTime;
        return lat > 0 ? lat.toFixed(2) + 's' : '0.00s';
    }

    function createSpinner() {
        if (spinner) return spinner;
        spinner = document.createElement('div');
        Object.assign(spinner.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: '9999',
            display: 'none'
        });
        const v = document.querySelector('video');
        if (v && v.parentElement) v.parentElement.appendChild(spinner);
        return spinner;
    }

    function reloadPlayer() {
        const v = document.querySelector('video');
        if (!v) return;
        const sp = createSpinner();
        sp.style.display = 'block';
        const ct = v.currentTime;
        v.pause();
        setTimeout(() => {
            try {
                v.currentTime = ct;
                v.play().catch(() => {});
            } catch {
                location.reload();
            }
            sp.style.display = 'none';
        }, 1200);
    }

    function createTooltip() {
        if (tooltip) return;
        tooltip = document.createElement('div');
        tooltip.textContent = 'Stream delay click to refresh player';
        Object.assign(tooltip.style, {
            position: 'fixed',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#fff',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(6px)',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            pointerEvents: 'auto',
            opacity: '0',
            transform: 'translateX(-50%) translateY(10px)',
            zIndex: '2147483647'
        });
        document.body.appendChild(tooltip);
        requestAnimationFrame(() => {
            tooltip.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    function showTooltip() {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.bottom + 8 + 'px';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
        tooltip.style.opacity = '1';
        container.style.transform = 'translateY(-2px)';
        textSpan.style.color = '#fff';
    }

    function hideTooltip() {
        if (!container) return;
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(-50%) translateY(10px)';
        container.style.transform = 'translateY(0)';
        textSpan.style.color = 'rgba(255,255,255,0.85)';
    }

    function updateHeader() {
        if (!header) return;
        const lat = readKickLatency();
        if (!lat) return;

        if (!container) {
            container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.transition = 'transform 0.2s ease';
            header.innerHTML = '';
            header.appendChild(container);

            const dot = createRedDot();
            container.appendChild(dot);

            textSpan = document.createElement('span');
            textSpan.style.color = 'rgba(255,255,255,0.85)';
            textSpan.style.fontWeight = '600';
            textSpan.style.fontSize = '15px';
            textSpan.style.transition = 'color 0.2s ease';
            container.appendChild(textSpan);

            createTooltip();
        }

        textSpan.textContent = `Latency: ${lat}`;
    }

    function findHeader() {
        const candidate = Array.from(document.querySelectorAll('span.absolute')).find(e => {
            const text = e.textContent.trim().toLowerCase();
            return text === 'чат' || text === 'chat';
        });
        if (candidate && candidate !== header) {
            header = candidate;
            container = null;
            textSpan = null;
            styleHeader(header);
            header.addEventListener('click', reloadPlayer);
            header.addEventListener('mouseenter', showTooltip);
            header.addEventListener('mouseleave', hideTooltip);
            updateHeader();
        }
    }

    const obs = new MutationObserver(findHeader);
    obs.observe(document.body, { childList: true, subtree: true });

    setInterval(updateHeader, 2000);
})();
