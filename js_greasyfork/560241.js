// ==UserScript==
// @name         Gemini Nexus: Ultimate AI Prompt Manager
// @name:ru      Gemini Nexus: Умный менеджер промптов
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Perfect for global use. Adds a sleek Material Design 3 toolbar with prompt library, navigation, and Telegram community link. Improved optical alignment.
// @description:ru Глобальный инструмент для Gemini. Добавляет элегантную панель промптов в стиле Material Design 3, навигацию и ссылку на сообщество в Telegram с идеальным выравниванием.
// @author       Evreu1pro Engineer
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560241/Gemini%20Nexus%3A%20Ultimate%20AI%20Prompt%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/560241/Gemini%20Nexus%3A%20Ultimate%20AI%20Prompt%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG Icons Library (with Optical Tweak for TG)
    const ICONS = {
        add: `<svg viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`,
        bookmark: `<svg viewBox="0 -960 960 960"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Z"/></svg>`,
        left: `<svg viewBox="0 -960 960 960"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>`,
        right: `<svg viewBox="0 -960 960 960"><path d="M375-240l-56-56 184-184-184-184 56-56 240 240-240 240Z"/></svg>`,
        telegram: `<svg viewBox="0 0 100 100" style="transform: translate(-1px, 1px);"><path d="M88.723,12.142C76.419,17.238,23.661,39.091,9.084,45.047c-9.776,3.815-4.053,7.392-4.053,7.392s8.345,2.861,15.499,5.007c7.153,2.146,10.968-0.238,10.968-0.238l33.62-22.652c11.922-8.107,9.061-1.431,6.199,1.431c-6.199,6.2-16.452,15.975-25.036,23.844c-3.815,3.338-1.908,6.199-0.238,7.63c6.199,5.246,23.129,15.976,24.082,16.691c5.037,3.566,14.945,8.699,16.452-2.146c0,0,5.961-37.435,5.961-37.435c1.908-12.637,3.815-24.321,4.053-27.659C97.307,8.804,88.723,12.142,88.723,12.142z"/></svg>`
    };

    // TrustedHTML Bypass Policy
    if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', { createHTML: (string) => string });
    }

    let savedPrompts = GM_getValue('nexus_vault_global', [
        { label: '🔍 AI Audit', text: '@synthid: Analyze this image for AI artifacts.' },
        { label: '📝 Abstract', text: 'Provide a concise summary of the key points:' },
        { label: '💻 Debug', text: 'Identify logical errors in this code:' }
    ]);

    const styles = `
        #nexus-native-toolbar {
            display: flex; align-items: center; padding: 10px 14px;
            border-top: 1px solid var(--gem-sys-color--outline-variant, rgba(255,255,255,0.1));
            background: transparent; width: 100%; box-sizing: border-box;
            user-select: none; line-height: 0; font-family: 'Google Sans', 'Roboto', sans-serif;
        }

        .nexus-static-controls {
            display: flex; align-items: center; gap: 10px; padding-right: 14px;
            border-right: 1px solid var(--gem-sys-color--outline-variant, rgba(255,255,255,0.1));
            margin-right: 12px; height: 40px;
        }

        .nexus-add-btn, .nexus-tg-btn {
            width: 40px; height: 40px; min-width: 40px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%; outline: none; padding: 0;
        }

        .nexus-add-btn {
            color: var(--gem-sys-color--primary, #8ab4f8); background: transparent;
            border: 1px dashed var(--gem-sys-color--primary, #8ab4f8);
        }
        .nexus-add-btn:hover { background: rgba(138, 180, 248, 0.1); border-style: solid; transform: rotate(90deg); }

        .nexus-tg-btn {
            color: #fff; background: #1B92D1; border: none;
            box-shadow: 0 2px 6px rgba(27, 146, 209, 0.3);
        }
        .nexus-tg-btn:hover { transform: scale(1.08); box-shadow: 0 4px 14px rgba(27, 146, 209, 0.5); }

        .nexus-add-btn svg, .nexus-tg-btn svg { width: 24px; height: 24px; fill: currentColor; }

        .nexus-nav-container { display: flex; align-items: center; flex: 1; overflow: hidden; gap: 8px; height: 40px; }

        .nexus-scroll-area {
            display: flex; gap: 10px; overflow-x: auto; scroll-behavior: smooth;
            scrollbar-width: none; flex: 1; padding: 4px 0; align-items: center;
        }
        .nexus-scroll-area::-webkit-scrollbar { display: none; }

        .nexus-nav-arrow {
            width: 32px; height: 38px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; background: var(--gem-sys-color--surface-container-low, rgba(30,30,30,0.4));
            border: none; color: var(--gem-sys-color--on-surface-variant); border-radius: 10px;
            opacity: 0.15; pointer-events: none; transition: 0.25s;
        }
        .nexus-nav-arrow.active { opacity: 1; pointer-events: auto; }
        .nexus-nav-arrow:hover { background: var(--gem-sys-color--surface-container-highest); color: #fff; }
        .nexus-nav-arrow svg { width: 24px; height: 24px; fill: currentColor; }

        .nexus-mat-btn {
            height: 38px; padding: 0 16px; display: inline-flex; align-items: center; gap: 8px;
            background: var(--gem-sys-color--surface-container-high, rgba(45,45,45,0.6));
            border: 1px solid transparent; border-radius: 12px; color: var(--gem-sys-color--on-surface-variant);
            font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer; transition: 0.2s;
        }
        .nexus-mat-btn:hover { background: var(--gem-sys-color--surface-container-highest); border-color: var(--gem-sys-color--outline); color: #fff; }
        .nexus-mat-btn svg { width: 18px; height: 18px; fill: currentColor; opacity: 0.6; }
    `;

    GM_addStyle(styles);

    function updateArrows(area, l, r) {
        l.classList.toggle('active', area.scrollLeft > 10);
        r.classList.toggle('active', area.scrollLeft + area.clientWidth < area.scrollWidth - 10);
    }

    function renderUI() {
        const target = document.querySelector('.text-input-field-main-area');
        if (!target || document.getElementById('nexus-native-toolbar')) return;

        const toolbar = document.createElement('div');
        toolbar.id = 'nexus-native-toolbar';

        const staticPart = document.createElement('div');
        staticPart.className = 'nexus-static-controls';

        // Add Button
        const addBtn = document.createElement('button');
        addBtn.className = 'nexus-add-btn'; addBtn.innerHTML = ICONS.add;
        addBtn.title = "Add Current Text to Vault";
        addBtn.onclick = () => {
            const editor = document.querySelector('.ql-editor');
            if (!editor?.innerText.trim()) return;
            const label = prompt("Enter shortcut name:");
            if (label) {
                savedPrompts.push({ label, text: editor.innerText.trim() });
                GM_setValue('nexus_vault_global', savedPrompts);
                toolbar.remove(); renderUI();
            }
        };
        staticPart.appendChild(addBtn);

        // Community Button with Self-Hide Logic
        if (!GM_getValue('nexus_tg_hidden', false)) {
            const tgBtn = document.createElement('button');
            tgBtn.className = 'nexus-tg-btn'; tgBtn.innerHTML = ICONS.telegram;
            tgBtn.title = "Join Community (Right-click to hide)";
            tgBtn.onclick = () => window.open('https://t.me/gostibissi', '_blank');
            tgBtn.oncontextmenu = (e) => {
                e.preventDefault();
                if (confirm("Hide Community button forever?")) { GM_setValue('nexus_tg_hidden', true); tgBtn.remove(); }
            };
            staticPart.appendChild(tgBtn);
        }

        const navSection = document.createElement('div');
        navSection.className = 'nexus-nav-container';
        const lArrow = document.createElement('button'); lArrow.className = 'nexus-nav-arrow'; lArrow.innerHTML = ICONS.left;
        const rArrow = document.createElement('button'); rArrow.className = 'nexus-nav-arrow'; rArrow.innerHTML = ICONS.right;
        const area = document.createElement('div'); area.className = 'nexus-scroll-area';

        savedPrompts.forEach((p, i) => {
            const btn = document.createElement('button');
            btn.className = 'nexus-mat-btn'; btn.innerHTML = `${ICONS.bookmark} <span>${p.label}</span>`;
            btn.onclick = () => {
                const ed = document.querySelector('.ql-editor');
                if (ed) { ed.focus(); document.execCommand('insertText', false, p.text); ed.dispatchEvent(new Event('input', { bubbles: true })); }
            };
            btn.oncontextmenu = (e) => {
                e.preventDefault();
                if(confirm(`Delete "${p.label}"?`)) { savedPrompts.splice(i, 1); GM_setValue('nexus_vault_global', savedPrompts); toolbar.remove(); renderUI(); }
            };
            area.appendChild(btn);
        });

        lArrow.onclick = () => area.scrollBy({ left: -250, behavior: 'smooth' });
        rArrow.onclick = () => area.scrollBy({ left: 250, behavior: 'smooth' });
        area.onscroll = () => updateArrows(area, lArrow, rArrow);

        navSection.append(lArrow, area, rArrow);
        toolbar.append(staticPart, navSection);
        target.appendChild(toolbar);

        setTimeout(() => updateArrows(area, lArrow, rArrow), 400);
    }

    const observer = new MutationObserver(renderUI);
    observer.observe(document.body, { childList: true, subtree: true });

})();