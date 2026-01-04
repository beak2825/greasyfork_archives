// ==UserScript==
// @name         Gemini Enhancement
// @namespace    Violentmonkey Scripts
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @version      1.0.2
// @author       vacnex
// @description  Add splitter in canvas mode, Full width layout, always visible scrollbar, and Middle-click New Chat & History
// @downloadURL https://update.greasyfork.org/scripts/559449/Gemini%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/559449/Gemini%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CONFIG ---
    const RESIZER_WIDTH = 16;
    const EL_COLORS = { borderLight: '#e4e7ed', primary: '#409eff', primaryLight: '#a0cfff' };

    GM_addStyle(`
        .genz-resizer { width: ${RESIZER_WIDTH}px; height: 100%; position: relative; cursor: col-resize; user-select: none; touch-action: none; flex: none; z-index: 100; }
        .genz-resizer::before { content: ""; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 1px; height: 100%; background-color: ${EL_COLORS.borderLight}; transition: background-color 0.2s, width 0.2s; }
        .genz-resizer:hover::before, .genz-resizer.active::before { background-color: ${EL_COLORS.primary}; width: 2px; box-shadow: 0 0 4px ${EL_COLORS.primaryLight}; }
        .genz-resize-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; cursor: col-resize; display: none; }
        .genz-resize-overlay.active { display: block; }
        body.is-resizing * { pointer-events: none !important; user-select: none !important; }
        body.is-resizing .genz-resize-overlay { pointer-events: auto !important; }

        /* UI TWEAKS */
        user-query, .conversation-container, .input-area-container { max-width: unset !important; }
        .input-area-container { margin-bottom: 10px !important; }
        my-stuff-recents-preview, .my-stuff-recents-preview-container { display: none !important; }
        mat-action-list { margin: 0 !important; }
        .overflow-container { padding-top: 60px !important; }
        hallucination-disclaimer { display: none !important; }
        ::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
        ::-webkit-scrollbar-track { background: transparent !important; }
        ::-webkit-scrollbar-thumb { background: #909399 !important; border-radius: 4px !important; }
        ::-webkit-scrollbar-thumb:hover { background: #606266 !important; }
    `);

    const overlay = document.createElement('div');
    overlay.className = 'genz-resize-overlay';
    document.body.appendChild(overlay);

    function getChatIdFromTarget(target) {

        const element = target.closest('[jslog*="c_"]');

        if (!element) return null;

        if (target.closest('.conversation-actions-container')) return null;

        const jslog = element.getAttribute('jslog');
        if (!jslog) return null;

        const match = jslog.match(/c_([a-f0-9]{10,})/);
        return match ? match[1] : null;
    }

    function isNewChatButton(element) {
        return element.closest('side-nav-action-button button') !== null;
    }

    document.addEventListener('mousedown', (e) => {
        if (e.button !== 1) return;

        if (isNewChatButton(e.target) || getChatIdFromTarget(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);

    document.addEventListener('mouseup', (e) => {
        if (e.button !== 1) return;

        if (isNewChatButton(e.target)) {
            e.preventDefault(); e.stopPropagation();
            window.open('https://gemini.google.com/app', '_blank');
            return;
        }

        const chatId = getChatIdFromTarget(e.target);
        if (chatId) {
            e.preventDefault(); e.stopPropagation();
            window.open(`https://gemini.google.com/app/${chatId}`, '_blank');
        }
    }, true);

    function initResizer(container) {
        if (container.querySelector('.genz-resizer')) return;

        const leftPanel = container.querySelector('div.chat-container');
        const rightPanel = container.querySelector('immersive-panel');

        if (!leftPanel || !rightPanel) return;

        const resizer = document.createElement('div');
        resizer.className = 'genz-resizer';
        container.insertBefore(resizer, rightPanel);

        container.style.gap = '0px';
        const currentLeftWidth = leftPanel.offsetWidth || 360;
        container.style.gridTemplateColumns = `${currentLeftWidth}px ${RESIZER_WIDTH}px 1fr`;

        let isDragging = false;
        let animationFrameId;

        const onMouseDown = (e) => {
            isDragging = true;

            resizer.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('is-resizing');
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                const containerRect = container.getBoundingClientRect();
                let newWidth = e.clientX - containerRect.left - (RESIZER_WIDTH / 2);

                if (newWidth < 300) newWidth = 300;
                if (newWidth > containerRect.width * 0.85) newWidth = containerRect.width * 0.85;

                container.style.gridTemplateColumns = `${newWidth}px ${RESIZER_WIDTH}px 1fr`;
            });
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;

                resizer.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('is-resizing');

                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            }
        };

        resizer.addEventListener('mousedown', onMouseDown);

        overlay.addEventListener('mousemove', onMouseMove);
        overlay.addEventListener('mouseup', onMouseUp);

        window.addEventListener('mouseup', onMouseUp);
    }

    const observer = new MutationObserver((mutations) => {
        const immersiveContainer = document.querySelector('chat-window.immersives-mode');
        if (immersiveContainer) {
            initResizer(immersiveContainer);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();