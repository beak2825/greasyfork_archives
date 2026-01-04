// ==UserScript==
// @name         Chatgpt teacher development
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ChatGPT Teacher版模型拓展
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license      PastKing
// @downloadURL https://update.greasyfork.org/scripts/556885/Chatgpt%20teacher%20development.user.js
// @updateURL https://update.greasyfork.org/scripts/556885/Chatgpt%20teacher%20development.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CUSTOM_MODELS = [
        { id: "gpt-5-reasoning", label: "GPT-5 Reasoning" },
        { id: "gpt-5-1", label: "GPT-5.1" },
        { id: "gpt-4-5", label: "GPT-4.5" },
        { id: "gpt-5-1-pro", label: "GPT-5.1-Pro" },
    ];

    const STORAGE_KEYS = {
        model: "cgpt-forced-model",
        position: "cgpt-floating-pos",
    };

    let currentForcedModel = localStorage.getItem(STORAGE_KEYS.model);

    function createFloatingPanel() {
        if (document.getElementById('cgpt-floating-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'cgpt-floating-panel';

        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            background: 'linear-gradient(145deg, #0f1729, #111827)',
            color: '#f8fafc',
            padding: '14px 14px 12px',
            borderRadius: '14px',
            fontSize: '13px',
            width: '300px',
            cursor: 'grab',
            boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            userSelect: 'none',
            fontFamily: '"Segoe UI", "SF Pro Display", system-ui, -apple-system, sans-serif',
        });

        const header = document.createElement('div');
        header.id = 'cgpt-header';
        header.textContent = 'Model Override (Workspace)';
        Object.assign(header.style, {
            fontWeight: '700',
            marginBottom: '6px',
            cursor: 'grab',
            letterSpacing: '0.3px',
        });

        const sub = document.createElement('div');
        sub.textContent = 'Pick a model to override /backend-api requests. Click the active model again to revert.';
        Object.assign(sub.style, {
            fontSize: '12px',
            opacity: '0.76',
            marginBottom: '8px',
            lineHeight: '1.5',
        });

        const buttonRow = document.createElement('div');
        buttonRow.id = 'cgpt-buttons';
        Object.assign(buttonRow.style, {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
        });

        const status = document.createElement('div');
        status.id = 'cgpt-status';
        Object.assign(status.style, {
            marginTop: '9px',
            fontSize: '12px',
            opacity: '0.95',
        });

        panel.appendChild(header);
        panel.appendChild(sub);
        panel.appendChild(buttonRow);
        panel.appendChild(status);

        document.body.appendChild(panel);

        initButtons(panel);
        restorePanelPosition(panel);
        makeDraggable(panel, document.getElementById("cgpt-header"));
    }

    function makeDraggable(panel, handle) {
        let offsetX = 0, offsetY = 0;
        let isDown = false;

        handle.addEventListener('mousedown', function (e) {
            isDown = true;
            panel.style.cursor = "grabbing";
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.body.style.userSelect = "none";
        });

        document.addEventListener('mouseup', function () {
            isDown = false;
            panel.style.cursor = "grab";
            document.body.style.userSelect = "";
            savePanelPosition(panel);
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            const nextLeft = Math.max(6, Math.min(window.innerWidth - panel.offsetWidth - 6, e.clientX - offsetX));
            const nextTop = Math.max(6, Math.min(window.innerHeight - panel.offsetHeight - 6, e.clientY - offsetY));
            panel.style.left = nextLeft + "px";
            panel.style.top = nextTop + "px";
            panel.style.bottom = "auto";
            panel.style.right = "auto";
        });
    }

    function initButtons(panel) {
        const container = panel.querySelector('#cgpt-buttons');
        const statusEl = panel.querySelector('#cgpt-status');

        function refreshButtons() {
            container.querySelectorAll("button[data-model]").forEach(btn => {
                const id = btn.getAttribute("data-model");
                const active = id === currentForcedModel;
                btn.style.background = active ? "#10b981" : "rgba(255,255,255,0.06)";
                btn.style.color = active ? "#04100c" : "#dbeafe";
                btn.style.borderColor = active ? "rgba(16,185,129,0.55)" : "rgba(255,255,255,0.16)";
                btn.style.boxShadow = active ? "0 6px 18px rgba(16,185,129,0.25)" : "none";
            });

            if (currentForcedModel)
                statusEl.textContent = `Current: forcing model -> ${currentForcedModel}`;
            else
                statusEl.textContent = 'Current: default (no override)';

            if (currentForcedModel)
                localStorage.setItem(STORAGE_KEYS.model, currentForcedModel);
            else
                localStorage.removeItem(STORAGE_KEYS.model);
        }

        CUSTOM_MODELS.forEach(m => {
            const btn = document.createElement("button");
            btn.textContent = m.label;
            btn.setAttribute("data-model", m.id);
            btn.type = "button";
            btn.title = `Force ${m.id}`;
            Object.assign(btn.style, {
                padding: "7px 10px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.06)",
                color: "#dbeafe",
                cursor: "pointer",
                fontSize: "11.5px",
                transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
                letterSpacing: "0.2px",
            });

            btn.onclick = () => {
                if (currentForcedModel === m.id) currentForcedModel = null;
                else currentForcedModel = m.id;
                refreshButtons();
            };

            btn.onmouseenter = () => { btn.style.transform = "translateY(-1px)"; };
            btn.onmouseleave = () => { btn.style.transform = "translateY(0)"; };

            container.appendChild(btn);
        });

        const resetBtn = document.createElement("button");
        resetBtn.textContent = "Restore default";
        resetBtn.type = "button";
        Object.assign(resetBtn.style, {
            padding: "7px 10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.14)",
            background: "transparent",
            color: "#cbd5e1",
            cursor: "pointer",
            fontSize: "11.5px",
            flexGrow: "1",
        });
        resetBtn.onclick = () => {
            currentForcedModel = null;
            refreshButtons();
        };

        container.appendChild(resetBtn);
        refreshButtons();
    }

    function restorePanelPosition(panel) {
        const saved = localStorage.getItem(STORAGE_KEYS.position);
        if (!saved) return;
        try {
            const pos = JSON.parse(saved);
            if (pos.left && pos.top) {
                panel.style.left = pos.left;
                panel.style.top = pos.top;
                panel.style.bottom = "auto";
                panel.style.right = "auto";
            }
        } catch (_) { }
    }

    function savePanelPosition(panel) {
        const payload = {
            left: panel.style.left,
            top: panel.style.top,
        };
        if (payload.left && payload.top) {
            localStorage.setItem(STORAGE_KEYS.position, JSON.stringify(payload));
        }
    }

    // Only touch JSON payloads that already declare a model field.
    function patchModelInJSON(body) {
        if (!currentForcedModel || typeof body !== "string") return null;
        const trimmed = body.trim();
        if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;

        try {
            const parsed = JSON.parse(trimmed);
            if (!parsed || typeof parsed !== "object") return null;
            if (!("model" in parsed)) return null;
            parsed.model = currentForcedModel;
            return JSON.stringify(parsed);
        } catch (_) {
            return null;
        }
    }

    const originalFetch = window.fetch;
    window.fetch = function (input, init = {}) {
        if (!currentForcedModel) return originalFetch.call(this, input, init);

        const nextInit = { ...init };
        const patchedBody = patchModelInJSON(nextInit.body);
        if (patchedBody) {
            nextInit.body = patchedBody;
            nextInit.headers = {
                "content-type": "application/json",
                ...(nextInit.headers || {}),
            };
        }

        return originalFetch.call(this, input, nextInit);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (!currentForcedModel) return originalSend.call(this, body);

        const patchedBody = patchModelInJSON(body);
        const nextBody = patchedBody || body;

        return originalSend.call(this, nextBody);
    };

    if (document.readyState === "complete") createFloatingPanel();
    else window.addEventListener("load", createFloatingPanel);

})();
