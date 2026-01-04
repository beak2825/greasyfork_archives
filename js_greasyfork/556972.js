// ==UserScript==
// @name         Chatgpt teacher development
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ChatGPT Teacher版模型拓展 - 可折叠版本
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license      PastKing
// @downloadURL https://update.greasyfork.org/scripts/556972/Chatgpt%20teacher%20development.user.js
// @updateURL https://update.greasyfork.org/scripts/556972/Chatgpt%20teacher%20development.meta.js
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
        expanded: "cgpt-panel-expanded",
    };

    let currentForcedModel = localStorage.getItem(STORAGE_KEYS.model);
    let isExpanded = localStorage.getItem(STORAGE_KEYS.expanded) === "true";

    function createFloatingPanel() {
        if (document.getElementById('cgpt-floating-panel')) return;

        // 创建容器
        const container = document.createElement('div');
        container.id = 'cgpt-floating-panel';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        });

        // 创建小球按钮
        const orb = document.createElement('div');
        orb.id = 'cgpt-orb';
        Object.assign(orb.style, {
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), 0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            border: '3px solid rgba(255,255,255,0.2)',
            userSelect: 'none',
        });

        // 创建展开的面板
        const panel = document.createElement('div');
        panel.id = 'cgpt-panel';
        Object.assign(panel.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            background: 'linear-gradient(145deg, #0f1729, #111827)',
            color: '#f8fafc',
            padding: '14px 14px 12px',
            borderRadius: '14px',
            fontSize: '13px',
            width: '300px',
            boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            userSelect: 'none',
            fontFamily: '"Segoe UI", "SF Pro Display", system-ui, -apple-system, sans-serif',
            display: 'none',
            opacity: '0',
            transform: 'scale(0.9) translateY(10px)',
            transformOrigin: 'bottom right',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        });

        // 面板头部
        const header = document.createElement('div');
        header.id = 'cgpt-header';
        Object.assign(header.style, {
            fontWeight: '700',
            marginBottom: '6px',
            letterSpacing: '0.3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        });

        const headerText = document.createElement('span');
        headerText.textContent = 'Model Override';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.opacity = '0.7';
        closeBtn.style.transition = 'opacity 0.2s';
        closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
        closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.7';
        closeBtn.onclick = () => togglePanel();

        header.appendChild(headerText);
        header.appendChild(closeBtn);

        // 说明文字
        const sub = document.createElement('div');
        sub.textContent = 'Pick a model to override requests. Click active model to revert.';
        Object.assign(sub.style, {
            fontSize: '12px',
            opacity: '0.76',
            marginBottom: '8px',
            lineHeight: '1.5',
        });

        // 按钮容器
        const buttonRow = document.createElement('div');
        buttonRow.id = 'cgpt-buttons';
        Object.assign(buttonRow.style, {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
        });

        // 状态显示
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

        container.appendChild(orb);
        container.appendChild(panel);
        document.body.appendChild(container);

        // 小球悬停效果
        orb.onmouseenter = () => {
            orb.style.transform = 'scale(1.1)';
            orb.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.5), 0 6px 12px rgba(0,0,0,0.3)';
        };
        orb.onmouseleave = () => {
            orb.style.transform = 'scale(1)';
            orb.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4), 0 4px 8px rgba(0,0,0,0.2)';
        };
        orb.onclick = togglePanel;

        initButtons(panel);
        restorePanelPosition(container);
        makeDraggable(container, orb);

        // 恢复展开状态
        if (isExpanded) {
            setTimeout(() => togglePanel(), 100);
        }
    }

    function togglePanel() {
        const panel = document.getElementById('cgpt-panel');
        const orb = document.getElementById('cgpt-orb');

        isExpanded = !isExpanded;
        localStorage.setItem(STORAGE_KEYS.expanded, isExpanded);

        if (isExpanded) {
            panel.style.display = 'block';
            setTimeout(() => {
                panel.style.opacity = '1';
                panel.style.transform = 'scale(1) translateY(0)';
            }, 10);
            orb.style.opacity = '0';
            orb.style.pointerEvents = 'none';
        } else {
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.9) translateY(10px)';
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
            orb.style.opacity = '1';
            orb.style.pointerEvents = 'auto';
        }
    }

    function makeDraggable(container, handle) {
        let offsetX = 0, offsetY = 0;
        let isDown = false;

        handle.addEventListener('mousedown', function (e) {
            if (isExpanded) return; // 展开时不允许拖动
            isDown = true;
            handle.style.cursor = "grabbing";
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            document.body.style.userSelect = "none";
        });

        document.addEventListener('mouseup', function () {
            isDown = false;
            handle.style.cursor = "pointer";
            document.body.style.userSelect = "";
            if (isDown) savePanelPosition(container);
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            const nextLeft = Math.max(6, Math.min(window.innerWidth - container.offsetWidth - 6, e.clientX - offsetX));
            const nextTop = Math.max(6, Math.min(window.innerHeight - container.offsetHeight - 6, e.clientY - offsetY));
            container.style.left = nextLeft + "px";
            container.style.top = nextTop + "px";
            container.style.bottom = "auto";
            container.style.right = "auto";
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
                statusEl.textContent = `Current: forcing model → ${currentForcedModel}`;
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
                if (currentForcedModel === m.id)
                    currentForcedModel = null;
                else
                    currentForcedModel = m.id;
                refreshButtons();
            };

            btn.onmouseenter = () => {
                btn.style.transform = "translateY(-1px)";
            };
            btn.onmouseleave = () => {
                btn.style.transform = "translateY(0)";
            };

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

    function restorePanelPosition(container) {
        const saved = localStorage.getItem(STORAGE_KEYS.position);
        if (!saved) return;
        try {
            const pos = JSON.parse(saved);
            if (pos.left && pos.top) {
                container.style.left = pos.left;
                container.style.top = pos.top;
                container.style.bottom = "auto";
                container.style.right = "auto";
            }
        } catch (_) { }
    }

    function savePanelPosition(container) {
        const payload = {
            left: container.style.left,
            top: container.style.top,
        };
        if (payload.left && payload.top) {
            localStorage.setItem(STORAGE_KEYS.position, JSON.stringify(payload));
        }
    }

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

    if (document.readyState === "complete")
        createFloatingPanel();
    else
        window.addEventListener("load", createFloatingPanel);
})();