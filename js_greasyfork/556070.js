// ==UserScript==
// @name         Grok Model Patcher 4 (official grok-4 + variants)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Patches grok.com to switch between grok-3, grok-4 and all grok-4 fast variants
// @author       Community updated
// @match        https://grok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556070/Grok%20Model%20Patcher%204%20%28official%20grok-4%20%2B%20variants%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556070/Grok%20Model%20Patcher%204%20%28official%20grok-4%20%2B%20variants%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const generateId = () => Math.random().toString(16).slice(2);

    const createMenu = () => {
        const menu = document.createElement('div');
        menu.id = 'grok-patcher-menu';
        menu.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            background: #1f2937;
            color: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            font-family: system-ui, sans-serif;
            font-size: 13px;
            min-width: 280px;
            cursor: move;
            user-select: none;
        `;
        menu.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold;">Grok Model Switcher</div>
            <button id="toggle_model" style="width:100%; padding:8px; border:none; border-radius:4px; font-weight:bold; color:white; cursor:pointer;">
                Using grok-3
            </button>
            <div style="margin-top:10px; font-size:11px; line-height:1.5;">
                <div id="rate_limit_grok3">grok-3: N/A</div>
                <div id="rate_limit_grok4">grok-4: N/A</div>
                <div id="rate_limit_grok4_tool">grok-4-1 (fast + tools): N/A</div>
                <div id="rate_limit_grok4_notool">grok-4-1 (fastest, no tools): N/A</div>
            </div>
        `;
        document.body.appendChild(menu);
        makeDraggable(menu);
        return menu;
    };

    const makeDraggable = (element) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = e => {
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = ee => {
                e.preventDefault();
                pos1 = pos3 - ee.clientX;
                pos2 = pos4 - ee.clientY;
                pos3 = ee.clientX;
                pos4 = ee.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            };
        };
    };

    const updateRateLimits = (limits) => {
        // grok-3 & grok-4 (full thinking) → use tokens
        document.getElementById('rate_limit_grok3').textContent =
            limits?.['grok-3'] ? `grok-3: ${limits['grok-3'].remainingTokens}/${limits['grok-3'].totalTokens} tokens` : 'grok-3: N/A';

        document.getElementById('rate_limit_grok4').textContent =
            limits?.['grok-4'] ? `grok-4: ${limits['grok-4'].remainingTokens}/${limits['grok-4'].totalTokens} tokens` : 'grok-4: N/A';

        // fast variants with tools → use tokens
        document.getElementById('rate_limit_grok4_tool').textContent =
            limits?.['grok-4-1-non-thinking-w-tool']
                ? `grok-4.1 (fast + tools): ${limits['grok-4-1-non-thinking-w-tool'].remainingTokens}/${limits['grok-4-1-non-thinking-w-tool'].totalTokens} tokens`
                : 'grok-4.1 (fast + tools): N/A';

        // fastest no-tools variant → use queries
        document.getElementById('rate_limit_grok4_notool').textContent =
            limits?.['grok-4-1-non-thinking-no-tool-1111b']
                ? `grok-4.1 (fastest): ${limits['grok-4-1-non-thinking-no-tool-1111b'].remainingQueries}/${limits['grok-4-1-non-thinking-no-tool-1111b'].totalQueries} queries`
                : 'grok-4.1 (fastest): N/A';
    };

    const fetchRateLimits = async () => {
        try {
            const models = [
                'grok-3',
                'grok-4',
                'grok-4-1-non-thinking-w-tool',
                'grok-4-1-non-thinking-no-tool-1111b'
            ];
            const limits = {};
            for (const model of models) {
                const resp = await fetch('https://grok.com/rest/rate-limits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Xai-Request-Id': generateId(),
                        'User-Agent': navigator.userAgent,
                        'Origin': 'https://grok.com',
                        'Referer': 'https://grok.com/'
                    },
                    body: JSON.stringify({ requestKind: 'DEFAULT', modelName: model })
                });
                if (resp.ok) limits[model] = await resp.json();
            }
            updateRateLimits(limits);
        } catch (e) {
            console.error('Rate limit fetch failed:', e);
        }
    };

    const createPatcher = () => {
        const originalFetch = window.fetch;
        let currentModel = 'grok-3';

        const isTargetUrl = (url) =>
            (url.includes('/rest/app-chat/conversations/') && url.endsWith('/responses')) ||
            url === 'https://grok.com/rest/app-chat/conversations/new';

        const patchedFetch = async (input, init) => {
            if (currentModel !== 'grok-3' && init?.method === 'POST' && typeof input === 'string' && isTargetUrl(input)) {
                try {
                    const clone = { ...init };
                    const payload = JSON.parse(clone.body);
                    payload.modelName = currentModel;
                    clone.body = JSON.stringify(payload);
                    return originalFetch(input, clone);
                } catch (err) {
                    console.error('Patch failed:', err);
                }
            }
            return originalFetch(input, init);
        };

        return {
            setModel: (model) => {
                currentModel = model;
                window.fetch = (model === 'grok-3') ? originalFetch : patchedFetch;
                fetchRateLimits();
            },
            getModel: () => currentModel
        };
    };

    const init = () => {
        const menu = createMenu();
        const patcher = createPatcher();

        const models = [
            'grok-3',
            'grok-4',
            'grok-4-1-non-thinking-w-tool',
            'grok-4-1-non-thinking-no-tool-1111b'
        ];

        const colors = {
            'grok-3': '#3b82f6',
            'grok-4': '#10b981',
            'grok-4-1-non-thinking-w-tool': '#f59e0b',
            'grok-4-1-non-thinking-no-tool-1111b': '#ef4444'
        };

        const niceNames = {
            'grok-3': 'grok-3 (default)',
            'grok-4': 'grok-4 (full reasoning)',
            'grok-4-1-non-thinking-w-tool': 'grok-4.1 (fast + tools)',
            'grok-4-1-non-thinking-no-tool-1111b': 'grok-4.1 (fastest, no tools)'
        };

        const button = document.getElementById('toggle_model');

        button.addEventListener('click', () => {
            const curIdx = models.indexOf(patcher.getModel());
            const nextIdx = (curIdx + 1) % models.length;
            const next = models[nextIdx];
            patcher.setModel(next);
            button.textContent = niceNames[next];
            button.style.backgroundColor = colors[next];
        });

        // initial state
        button.textContent = niceNames['grok-3'];
        button.style.backgroundColor = colors['grok-3'];

        // rate limits
        fetchRateLimits();
        setInterval(fetchRateLimits, 30000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();