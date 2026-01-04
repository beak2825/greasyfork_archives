// ==UserScript==
// @name         ChatGPT Export Markdown
// @namespace    hmmml.chatgpt.export.md
// @version      4.9.5
// @description  Exports ChatGPT chat messages to Markdown with automatic extraction of all grouped citation URLs (+N). Unlike alternatives, reliably expands and exports every source link from grouped references.
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @noframes
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554652/ChatGPT%20Export%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/554652/ChatGPT%20Export%20Markdown.meta.js
// ==/UserScript==

(function() {

    'use strict';

    /* ========= CONFIGURATION ========= */
    const CONFIG = {
        VERSION: '4.9.5', // Версия обновлена: Фикс высоты UI, удаление версии из вида.
        COLD_START_PILLS: 3,
        COLD_START_MULTIPLIER: 1.4,
    };
    /* ========= END CONFIGURATION ========= */

    /* ========= UTILS ========= */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const MESSAGE_SELECTOR = 'div[data-message-id]'; // Централизованный селектор сообщений
    const REAL_WIN = (typeof unsafeWindow !== 'undefined' && unsafeWindow) || (document.defaultView || window);

    // Функция проверки видимости элемента (совместимый синтаксис)
    const visible = (el) => {
        if (!(el instanceof Element)) {
            return false;
        }

        try {
            const r = el.getBoundingClientRect();

            // Если у элемента нет размеров, он невидим
            if (r.width <= 0 || r.height <= 0) {
                return false;
            }

            // Проверяем стили видимости. getComputedStyle может вызвать ошибку в редких случаях (например, в iframe).
            const cs = getComputedStyle(el);
            return cs.visibility !== 'hidden' && cs.display !== 'none';
        } catch (e) {
            // Если getComputedStyle вызывает ошибку, считаем элемент невидимым.
            return false;
        }
    };

    const pad = n => String(n).padStart(2, '0');
    const ts = () => {
        const d = new Date();
        return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
    };

    const title = () => (document.querySelector('[data-testid="conversation-title"]')?.textContent || document.title || 'chat').replace(/\s+-\s*ChatGPT\s*$/i, '').trim() || 'chat';
    const sanitizeName = n => (n || 'export').replace(/[\/\\?%*:|"<>.]/g, '_').replace(/\s+/g, ' ').trim() || 'export';
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // Strict role detection based on attributes
    function getMessageRole(node) {
        // Check the node itself first
        const roleAttr = node.getAttribute('data-message-author-role');

        if (roleAttr === 'user') return 'user';
        if (roleAttr === 'assistant' || roleAttr === 'system') return 'assistant';

        // Fallback check
        const childRoleEl = node.querySelector('[data-message-author-role]');
        if (childRoleEl) {
                const childRoleAttr = childRoleEl.getAttribute('data-message-author-role');
                if (childRoleAttr === 'user') return 'user';
                if (childRoleAttr === 'assistant' || childRoleAttr === 'system') return 'assistant';
        }
        return 'unknown';
    }


    /* ========= UI (Enhanced: Collapsible + Counter, Fixed Height) ========= */
    // ИСПРАВЛЕНИЕ UI: Используем min-height и центрирование (align-items: center) для обеспечения постоянной высоты панели.
    const CSS = `
    ${MESSAGE_SELECTOR} { position: relative; }

    /* Основной контейнер панели */
    .mdx-bar{
        position:fixed;
        bottom:16px;
        z-index:2147483646;
        display:flex;
        /* ИСПРАВЛЕНИЕ: Центрируем элементы по вертикали, а не растягиваем (stretch) */
        align-items: center;
        background:rgba(33,33,33,.92);
        color:#fff;
        border:1px solid rgba(127,127,127,.35);
        font:13px system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;
        /* Плавный переход для смещения и изменения формы */
        transition: right 0.3s ease-in-out, border-radius 0.3s;
        right: 16px;
        border-radius: 12px;
        /* ИСПРАВЛЕНИЕ: Фиксируем минимальную высоту (51px) для стабильности в обоих состояниях */
        /* Расчет: 13px font + 8px*2 btn pad + 1px*2 btn border + 10px*2 desired visual padding = 51px */
        min-height: 51px;
        box-sizing: border-box;
    }

    .mdx-bar[data-disabled="true"] { opacity: 0.6; pointer-events: none; }

    /* Стили кнопок внутри панели */
    .mdx-bar button{cursor:pointer;border:1px solid rgba(127,127,127,.4);background:rgba(255,255,255,.08);color:#fff;padding:8px 10px;border-radius:10px;font:inherit;white-space: nowrap;}
    .mdx-bar button:disabled { cursor: default; opacity: 0.6; }

    /* Контент панели (кнопки) */
    .mdx-content {
        display: flex;
        gap: 8px;
        align-items: center;
        /* Плавный переход для скрытия контента */
        transition: opacity 0.2s, transform 0.2s, width 0.2s, padding 0.2s;
        transform: scaleX(1);
        opacity: 1;
        /* ИСПРАВЛЕНИЕ: Убираем вертикальный паддинг, высота управляется через min-height бара */
        padding: 0 12px 0 8px;
        white-space: nowrap; /* Запрещаем перенос текста */
    }

    /* Кнопка сворачивания/разворачивания (>) */
    .mdx-toggle {
        cursor: pointer;
        /* ИСПРАВЛЕНИЕ: Убираем вертикальный паддинг */
        padding: 0 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        user-select: none; /* Запрещаем выделение текста кнопки */
        color: #aaa;
        border-right: 1px solid rgba(127, 127, 127, .35);
        transition: color 0.2s, border-right 0.2s;
        height: 100%; /* Растягиваем кнопку на всю высоту бара */
    }
     .mdx-toggle:hover {
        color: #fff;
    }

    /* Состояние свернутой панели */
    .mdx-bar[data-collapsed="true"] {
        right: 0px; /* Прижимаем к краю */
        border-radius: 12px 0 0 12px; /* Убираем скругление справа */
    }

    .mdx-bar[data-collapsed="true"] .mdx-content {
        /* Скрываем контент */
        opacity: 0;
        transform: scaleX(0);
        width: 0;
        padding: 0;
        pointer-events: none;
    }
    .mdx-bar[data-collapsed="true"] .mdx-toggle {
         border-right: none; /* Убираем разделитель, когда контент скрыт */
    }

    /* Уведомления (Toast) - немного смещаем вверх из-за фиксированной высоты бара */
    .mdx-note{position:fixed;right:16px;bottom:72px;z-index:2147483646;background:rgba(0,0,0,.78);color:#fff;padding:6px 8px;border-radius:8px;font:12px system-ui;display:none}

    /* Выделенные сообщения и чекбоксы */
    .mdx-selected{outline:2px solid rgba(0,200,255,.9);outline-offset:2px;border-radius:10px}
    .mdx-checkwrap{position:absolute; right:-36px; top:8px; z-index:2147483645; pointer-events:auto}
    .mdx-checkbox{appearance:auto;width:18px;height:18px;cursor:pointer;border:1px solid #aaa;background:#fff;border-radius:4px;box-shadow:0 0 0 2px rgba(0,0,0,.05)}
    `;
    try {
        if (typeof GM_addStyle === 'function') GM_addStyle(CSS);
    } catch {}
    if (!document.querySelector('style[data-mdx-style]')) {
        const st = document.createElement('style');
        st.setAttribute('data-mdx-style', '1');
        st.textContent = CSS;
        document.head.appendChild(st);
    }

    let bar, bSelectAll, bExport, note;
    let selectAllState = false,
        CANCEL = false;

    // Function to get all message nodes in DOM order
    function messageNodes() {
        return $$(MESSAGE_SELECTOR);
    }

    // UI construction
    function ensureUI() {
        if (bar && bar.isConnected) return;
        bar = document.createElement('div');
        bar.className = 'mdx-bar';
        bar.setAttribute('data-mdx', 'ui');

        // ИЗМЕНЕНИЕ UI: Убрана версия из интерфейса (span.mdx-version).
        bar.innerHTML = `
        <div class="mdx-toggle" id="mdx-toggle-btn" title="Collapse/Expand"></div>
        <div class="mdx-content">
            <button id="mdx-selectall">Select all</button>
            <button id="mdx-export" disabled>Export MD</button>
        </div>
    `;
        document.body.appendChild(bar);

        bSelectAll = $('#mdx-selectall', bar);
        bExport = $('#mdx-export', bar);
        const bToggle = $('#mdx-toggle-btn', bar);

        bSelectAll.addEventListener('click', onSelectAllToggle);
        bExport.addEventListener('click', exportSelected);
        bToggle.addEventListener('click', onToggleCollapse); // Добавляем обработчик сворачивания

        // Note used for displaying progress/status during export
        note=document.createElement('div'); note.className='mdx-note'; note.setAttribute('data-mdx','ui'); document.body.appendChild(note);

        // Восстанавливаем состояние панели при загрузке из localStorage
        // Это также гарантирует, что символ (</>) будет установлен при загрузке.
        const persistedState = localStorage.getItem('mdx_collapsed') === 'true';
        onToggleCollapse(null, persistedState);
    }

    // Функция сворачивания/разворачивания панели
    function onToggleCollapse(event, forceState) {
        if (!bar) return;
        const bToggle = $('#mdx-toggle-btn', bar);
        if (!bToggle) return;

        const isCollapsed = bar.getAttribute('data-collapsed') === 'true';
        const newState = forceState !== undefined ? forceState : !isCollapsed;

        // Атрибут и текст кнопки всегда устанавливаются в нужное состояние.
        bar.setAttribute('data-collapsed', newState);

        // Меняем символ кнопки
        bToggle.textContent = newState ? '<' : '>';

        // Сохраняем состояние в localStorage
        localStorage.setItem('mdx_collapsed', newState.toString());
    }

    // UI state management (Blocking during export)
    function setUIState(isEnabled) {
        if (!bar) return;
        bar.setAttribute('data-disabled', !isEnabled);
    }

    function toast(t, duration=2500){ if(!note) return; note.textContent=t; note.style.display='block'; clearTimeout(toast._t); if (duration) toast._t=setTimeout(()=>note.style.display='none',duration); }

    const selected = new Set();

    // Обновление текста кнопки экспорта (счетчик)
    function updateExportButton() {
        if (!bExport) return;
        const count = selected.size;
        bExport.disabled = count === 0;

        if (count > 0) {
            bExport.textContent = `Export MD (${count})`;
        } else {
            bExport.textContent = 'Export MD';
        }
    }

    function ensureCheckbox(host) {
        // Валидация и проверка, что чекбокс еще не добавлен. Проверяем Node.ELEMENT_NODE (1).
        if (!host || host.nodeType !== 1 || host.querySelector(':scope > .mdx-checkwrap')) return;

        const wrap = document.createElement('div');
        wrap.className = 'mdx-checkwrap';
        wrap.setAttribute('data-mdx', 'ui');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'mdx-checkbox';
        cb.addEventListener('click', e => {
            e.stopPropagation();
            toggleMsg(host, cb.checked);
        });

        // ОПТИМИЗАЦИЯ: Проверка getComputedStyle удалена, позиционирование управляется через CSS.

        wrap.appendChild(cb);
        host.prepend(wrap);
    }

    // Внутренняя функция для изменения состояния выделения (без немедленного обновления UI кнопки)
    // Используется для оптимизации массовых операций (Select All).
    function _setMsgState(node, on) {
         if (on === undefined) on = !selected.has(node);
         const cb = node.querySelector(':scope > .mdx-checkwrap > .mdx-checkbox');
         if (on) {
             selected.add(node);
             if (cb) cb.checked = true;
         } else {
             selected.delete(node);
             if (cb) cb.checked = false;
         }
         node.classList.toggle('mdx-selected', on);
    }

    // Публичная функция для переключения сообщения (используется при клике на чекбокс)
    function toggleMsg(node, on) {
        _setMsgState(node, on);
        // Обновляем UI после изменения состояния
        updateExportButton();
    }

    // Strict toggle behavior (All/None) - Optimized
    function onSelectAllToggle() {
        const nodes = messageNodes();
        if (!nodes.length) return;
        selectAllState = !selectAllState;

        // Используем _setMsgState в цикле для эффективности (избегаем многократного вызова updateExportButton)
        nodes.forEach(n => {
            ensureCheckbox(n);
            _setMsgState(n, selectAllState);
        });

        // Обновляем UI один раз после цикла
        updateExportButton();
        bSelectAll.textContent = selectAllState ? 'Select all (off)' : 'Select all';
    }

    // ОПТИМИЗАЦИЯ 1: Эффективный MutationObserver.
    // Вместо сканирования всего документа при каждом изменении, анализируем только добавленные узлы.
    new MutationObserver((mutationsList) => {
        const potentialMessages = new Set();
        for (const mutation of mutationsList) {
            // Нас интересуют только добавления узлов
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    // Проверяем только элементы (Node.ELEMENT_NODE === 1)
                    if (node.nodeType === 1) {
                        // Случай 1: Добавленный узел сам является сообщением
                        try {
                           if (node.matches(MESSAGE_SELECTOR)) {
                                potentialMessages.add(node);
                            }
                        } catch (e) {}

                        // Случай 2: Добавленный узел содержит сообщения (например, при загрузке чата)
                        if (node.querySelectorAll) {
                            try {
                                node.querySelectorAll(MESSAGE_SELECTOR).forEach(msg => potentialMessages.add(msg));
                            } catch (e) {}
                        }
                    }
                }
            }
        }
        // Обрабатываем только уникальные новые сообщения
        if (potentialMessages.size > 0) {
            potentialMessages.forEach(ensureCheckbox);
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    /* ========= Low-level Events ========= */

    function fireMouseLike(el, type, x, y) {
        const opts = {
            bubbles: true,
            cancelable: true,
            view: REAL_WIN,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            button: 0,
            buttons: 0,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true
        };
        try {
            const E = REAL_WIN.PointerEvent || window.PointerEvent;
            if (E) el.dispatchEvent(new E(type.replace('mouse', 'pointer'), opts));
        } catch {}
        try {
            const E = REAL_WIN.MouseEvent || window.MouseEvent;
            if (E) el.dispatchEvent(new E(type.replace('pointer', 'mouse'), opts));
        } catch {}
    }

    /* ========= URL Normalization ========= */

    function normalizeUrl(href) {
        try {
            const u = new URL(href, location.href);
            const trackingParams = [
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                'gclid', 'fbclid', 'msclkid', 'mc_eid', 'srsltid',
                'ref', 'ref_src', '_hsenc', '_hsmi', 'yclid', 'ysclid'
            ];
            for (const k of [...u.searchParams.keys()]) {
                if (trackingParams.includes(k.toLowerCase())) {
                    u.searchParams.delete(k);
                }
            }
            u.hash = '';
            if (u.protocol === 'http:') u.protocol = 'https:';
            return u.origin + u.pathname + (u.search || '');
        } catch {
            return href;
        }
    }

    function uniqueByBase(arr) {
        const seen = new Set(),
            out = [];
        for (const x of arr) {
            const k = normalizeUrl(x);
            if (!seen.has(k)) {
                seen.add(k);
                out.push(k);
            }
        }
        return out;
    }

    /* ========= Markdown Conversion ========= */
    function __mdx_stripPlusLabel(label) {
        const t = (label || '').trim();
        const m = t.match(/^(.*?)(?:\s*\+\d+|\+\d+)?\s*$/);
        return (m && m[1]) ? m[1].trim() : t;
    }

    // Helper function to ensure text is wrapped in brackets
    function ensureBrackets(text) {
        if (!text) return '';
        text = text.trim();
        if (text.startsWith('[') && text.endsWith(']')) {
            return text;
        }
        return `[${text}]`;
    }

    // Modified htmlToMarkdown for formatted inline labels
    function htmlToMarkdown(root) {
        const doc = document.implementation.createHTMLDocument('');
        doc.body.innerHTML = root.innerHTML;

        // Inline-вставка [Label] (url1) (url2)
        doc.querySelectorAll('[data-mdx-inline-links]').forEach(el => {
            let labelRaw = (el.textContent || '').trim();
            let label = __mdx_stripPlusLabel(labelRaw);

            // Apply bracket formatting
            let formattedLabel = ensureBrackets(label);

            let arr = [];
            try {
                arr = JSON.parse(el.getAttribute('data-mdx-inline-links') || '[]');
            } catch {
                arr = [];
            }
            if (Array.isArray(arr) && arr.length >= 1) {
                const urls = uniqueByBase(arr).map(normalizeUrl);
                const span = doc.createElement('span');

                // Construct the replacement text: [Label] (url1) (url2)
                span.textContent = (formattedLabel ? (formattedLabel + ' ') : '') + urls.map(u => `(${u})`).join(' ');
                el.replaceWith(span);
            }
        });

        // Standard conversions
        doc.querySelectorAll('a[href]').forEach(a => a.setAttribute('href', normalizeUrl(a.getAttribute('href'))));
        doc.querySelectorAll('span.katex-html, mrow').forEach(e => e.remove());
        doc.querySelectorAll('annotation[encoding="application/x-tex"]').forEach(el => {
            const latex = el.textContent.trim();
            el.replaceWith(el.closest('.katex-display') ? `\n$$\n${latex}\n$$\n` : `$${latex}$`);
        });
        doc.querySelectorAll('pre').forEach(pre => {
            const codeType = pre.querySelector('div > div:first-child')?.textContent || '';
            const code = pre.querySelector('div > div:nth-child(3) > code, code')?.textContent || pre.textContent;
            pre.innerHTML = `\n\`\`\`${(codeType||'').trim()}\n${code}\n\`\`\`\n`;
        });
        doc.querySelectorAll('strong,b').forEach(n => n.replaceWith(`**${n.textContent}**`));
        doc.querySelectorAll('em,i').forEach(n => n.replaceWith(`*${n.textContent}*`));
        doc.querySelectorAll('p code').forEach(n => n.replaceWith(`\`${n.textContent}\``));
        // Handle standard links - only if they weren't already processed by inline expansion
         doc.querySelectorAll('a').forEach(a => {
             // Check if element is still connected to the DOM (might have been replaced by inline expansion)
             if (a.isConnected && a.textContent && a.getAttribute('href')) {
                 a.replaceWith(`[${a.textContent.trim()}](${a.getAttribute('href')})`);
             }
         });
        doc.querySelectorAll('img').forEach(img => img.replaceWith(`![${img.alt||''}](${img.src})`));
        doc.querySelectorAll('ul').forEach(ul => {
            let md = '';
            ul.querySelectorAll(':scope>li').forEach(li => md += `- ${li.textContent.trim()}\n`);
            ul.replaceWith('\n' + md.trim() + '\n');
        });
        doc.querySelectorAll('ol').forEach(ol => {
            let md = '';
            ol.querySelectorAll(':scope>li').forEach((li, i) => md += `${i+1}. ${li.textContent.trim()}\n`);
            ol.replaceWith('\n' + md.trim() + '\n');
        });
        for (let i = 1; i <= 6; i++) doc.querySelectorAll(`h${i}`).forEach(h => h.replaceWith(`\n${'#'.repeat(i)} ${h.textContent}\n`));
        doc.querySelectorAll('p').forEach(p => p.replaceWith('\n' + p.textContent + '\n'));

        // Final cleanup
        let text = doc.body.innerHTML.replace(/<[^>]*>/g, '');
        text = text.replaceAll(/&amp;/g, '&').replaceAll(/&lt;/g, '<').replaceAll(/&gt;/g, '>');
        // Final normalization pass on generated Markdown links
        text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, l, u) => `[${l}](${normalizeUrl(u)})`);
        return text.trim();
    }

    /* ========= Profiles (Max Speed) ========= */
    // Fixed profile set to Ultra for maximum speed.
    const PROFILE_ULTRA = {
        NAME: 'Ultra (Default)',
        DWELL_MS: 160,
        OPEN_DELAY_MS: 140,
        OVERLAY_TIMEOUT: 2500,
        STEP_MS: 140,
        PAG_TRIES: 8,
        HOVER_JITTER_STEPS: 2
    };
    const getProfile = () => PROFILE_ULTRA;

    /* ========= Overlay detection ========= */
    const isOurUi = el => !!(el && el.closest && el.closest('[data-mdx]'));

    // Detect likely overlay elements, excluding hidden accessibility tooltips
    function overlayLikely(el) {
        if (!el || !el.getBoundingClientRect) return false;
        if (isOurUi(el)) return false;
        // Явные признаки порталов
        if (el.closest('[data-radix-popper-content-wrapper]')) return true;

        // Проверка внутри портала, исключая скрытые тултипы
        if (el.closest('[data-radix-portal]')) {
            if (el.matches && el.matches('[role="tooltip"][id^="radix-"]')) return false;
            return true;
        }

        const role = el.getAttribute('role') || '';
        if (role && /dialog|listbox|menu/i.test(role)) return true;

        // Fallback
        // Используем try-catch, так как getComputedStyle может вызвать ошибку в некоторых контекстах (например, iframe)
        try {
            const cs = getComputedStyle(el);
            const highZ = parseInt(cs.zIndex || '0', 10) >= 100;
            if ((cs.position === 'fixed' || cs.position === 'absolute') && highZ) {
                const hasLinks = el.querySelector('a[href], [role="link"]');
                if (hasLinks) return true;
            }
        } catch (e) {}
        return false;
    }

    function findOverlayCandidates() {
        const list = [];
        const push = el => {
            if (el && visible(el) && !isOurUi(el) && !list.includes(el)) list.push(el);
        };
        $$('[data-radix-popper-content-wrapper]').forEach(push);
        $$('[data-radix-portal] > *').forEach(push);
        $$('div[role="dialog"]').forEach(push);

        return list.filter(overlayLikely);
    }

    function nearestTo(el, candidates) {
        if (!candidates.length) return null;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2,
            cy = r.top + r.height / 2;
        let best = null,
            bestd = 1e9;
        for (const c of candidates) {
            const cr = c.getBoundingClientRect();
            const d = Math.hypot((cr.left + cr.width / 2) - cx, (cr.top + cr.height / 2) - cy);
            if (d < bestd) {
                best = c;
                bestd = d;
            }
        }
        return best;
    }

    function waitOverlayAppearNear(target, timeout) {
        return new Promise(resolve => {
            let winner = null,
                done = false;
            const t0 = performance.now();
            const mo = new MutationObserver(() => {
                const cands = findOverlayCandidates();
                const near = nearestTo(target, cands);
                if (near) {
                    winner = near;
                    finish();
                }
            });

            function finish() {
                if (done) return;
                done = true;
                mo.disconnect();
                resolve(winner || null);
            }
            // Наблюдаем за body, так как оверлеи часто добавляются туда (порталы).
            mo.observe(document.body, {
                childList: true,
                subtree: true
            });
            (function loop() {
                if (done) return;
                const cands = findOverlayCandidates();
                const near = nearestTo(target, cands);
                if (near) {
                    winner = near;
                    return finish();
                }
                if (performance.now() - t0 >= timeout) return finish();
                setTimeout(loop, 80);
            })();
        });
    }

    function closeAllOverlays() {
        try {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true
            }));
        } catch {}
        // "Клик мимо" для сброса hover-состояния
        const host = document.body;
        try {
            const r = host.getBoundingClientRect();
            fireMouseLike(host, 'mousemove', r.left + 6, r.top + 6);
        } catch(e) {}
    }

    /* ========= Pills & clickables ========= */
    function pillRoot(el) {
        return el.closest('[data-testid="webpage-citation-pill"]') || el;
    }

    function getPlusBadgeNode(pill) {
        const nodes = pill.querySelectorAll('span,div,button');
        for (const n of nodes) {
            const txt = (n.textContent || '').trim();
            if (/^\+\d+$/.test(txt)) return n;
        }
        const whole = (pill.textContent || '').trim();
        if (/\+\d+\s*$/.test(whole)) return pill;
        return null;
    }

    function expectedCountFromPill(pill) {
        const badge = getPlusBadgeNode(pill);
        if (!badge) return 1;
        const m = (badge.textContent || '').match(/\+(\d+)/);
        return m ? 1 + parseInt(m[1], 10) : 1;
    }

    function clickableOf(pill) {
        return pill.querySelector('a[href],button,[role="button"]') || pill;
    }

    // Поиск только групповых плашек (+N).
    function findPills(scope) {
        const set = new Set();

        scope.querySelectorAll('[data-testid="webpage-citation-pill"], [data-testid*="citation"]').forEach(el => {
            const root = pillRoot(el);
            if (visible(root)) set.add(root);
        });

        scope.querySelectorAll('button,[role="button"],a[href]').forEach(el => {
            if (!visible(el)) return;
            const root = pillRoot(el);
            if (visible(root) && getPlusBadgeNode(root)) set.add(root);
        });

        const grouped = Array.from(set).filter(el => expectedCountFromPill(el) > 1);
        grouped.sort((a, b) => expectedCountFromPill(b) - expectedCountFromPill(a));
        return grouped;
    }

    /* ========= Open overlay (Robust Open) ========= */

    // Realistic hover with Dwell Time and Jitter
    async function hoverWithDwell(el, dwellMs, jitterSteps) {
        try {
            el.scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'instant'
            });
        } catch {}
        // Short pause after scroll stabilization
        await sleep(50);

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width * 0.5;
        const cy = r.top + r.height * 0.5;

        // 1. Entry sequence
        fireMouseLike(el, 'pointerover', cx, cy);
        fireMouseLike(el, 'mouseover', cx, cy);
        fireMouseLike(el, 'pointerenter', cx, cy);
        fireMouseLike(el, 'mouseenter', cx, cy);

        // 2. Jitter
        const stepMs = Math.max(50, dwellMs / Math.max(1, jitterSteps));
        for (let i = 0; i < jitterSteps; i++) {
            const dx = (Math.random() - 0.5) * r.width * 0.3;
            const dy = (Math.random() - 0.5) * r.height * 0.3;
            fireMouseLike(el, 'mousemove', cx + dx, cy + dy);
            await sleep(stepMs);
        }

        // 3. Final pause
        const remainingDwell = dwellMs - (jitterSteps * stepMs);
        if (remainingDwell > 0) {
            await sleep(remainingDwell);
        }
    }

    // Enhanced function with Retry Logic (3 strategies)
    async function openOverlayMulti(pill, prof, isCold) {
        closeAllOverlays();
        const clickable = clickableOf(pill);

        let dwellMs = prof.DWELL_MS || 160; // Default to Ultra speed
        if (isCold) {
            dwellMs *= CONFIG.COLD_START_MULTIPLIER;
        }
        const jitterSteps = prof.HOVER_JITTER_STEPS || 2;

        // --- ATTEMPT 1: Hover + Dwell ---
        await hoverWithDwell(clickable, dwellMs, jitterSteps);

        // Check and short wait
        let overlay = await waitOverlayAppearNear(clickable, 500);

        if (overlay) {
            return overlay;
        }

        // --- ATTEMPT 2: Guarded Click ---
        const guard = e => {
            const a = e.target?.closest?.('a[href]');
            if (!a) return;
            e.preventDefault();
            e.stopImmediatePropagation();
        };
        document.addEventListener('click', guard, true);
        try {
            clickable.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: REAL_WIN
            }));
        } catch {}

        // Wait after click
        overlay = await waitOverlayAppearNear(clickable, (prof.OPEN_DELAY_MS || 140) * 2);
        document.removeEventListener('click', guard, true);

        if (overlay) {
            return overlay;
        }

        // --- ATTEMPT 3: Re-Hover (Increased time) ---
        const retryDwellMs = dwellMs * 1.5; // Increased time for retry
        await hoverWithDwell(clickable, retryDwellMs, jitterSteps + 1);

        // Final wait
        overlay = await waitOverlayAppearNear(clickable, (prof.OVERLAY_TIMEOUT || 2500) / 2);

        if (overlay) {
            return overlay;
        }

        return null;
    }

    /* ========= Link collection & pagination ========= */

    // Continuous Keep-Alive
    function keepAliveOverlay(overlay) {
        if (!overlay || !visible(overlay)) return () => {};

        const r = overlay.getBoundingClientRect();
        const cx = r.left + r.width * 0.5;
        const cy = r.top + r.height * 0.5;

        // Initial stabilization
        fireMouseLike(overlay, 'pointerenter', cx, cy);
        fireMouseLike(overlay, 'mousemove', cx, cy);

        const ev = () => {
            if (!overlay.isConnected || !visible(overlay)) {
                stop();
                return;
            }
            const r_live = overlay.getBoundingClientRect();
            const x_live = r_live.left + r_live.width * (0.4 + Math.random() * 0.2);
            const y_live = r_live.top + r_live.height * (0.4 + Math.random() * 0.2);
            fireMouseLike(overlay, 'mousemove', x_live, y_live);
        };

        const intervalId = setInterval(ev, 140);
        const stop = () => clearInterval(intervalId);
        return stop;
    }

    function getPagerInfo(overlay) {
        const label = Array.from(overlay.querySelectorAll('span,div')).find(s => /^\s*\d+\s*\/\s*\d+\s*$/.test((s.textContent || '')));
        let cur = 1,
            total = 1;
        if (label) {
            const m = (label.textContent || '').match(/(\d+)\s*\/\s*(\d+)/);
            if (m) {
                cur = +m[1];
                total = +m[2];
            }
        }
        return {
            cur,
            total,
            label
        };
    }

    // Get navigation buttons, excluding hidden accessibility elements
    function getPrevNextButtons(overlay) {
        const hiddenAccessibilitySelector = '[role="tooltip"][id^="radix-"], [aria-hidden="true"]';
        const allBtns = Array.from(overlay.querySelectorAll('button,[role="button"]'));

        const interactiveBtns = allBtns.filter(btn => {
            if (btn.closest(hiddenAccessibilitySelector)) {
                return false;
            }
            return visible(btn);
        });

        const btns = interactiveBtns;
        const txt = b => (b.getAttribute('aria-label') || b.textContent || '').toLowerCase();

        let prev = btns.find(b => /(prev|previous|назад|<|<)/i.test(txt(b)));
        let next = btns.find(b => /(next|следующ|>|>)/i.test(txt(b)));

        const svgButtons = btns.filter(b => b.querySelector('svg') && (b.textContent || '').trim() === '');
        if (svgButtons.length > 0) {
            if (!prev) prev = svgButtons[0];
            if (!next) next = svgButtons[svgButtons.length - 1];
        }

        return {
            prev: prev || null,
            next: next || null
        };
    }

    function focusAny(overlay) {
        const cand = overlay.querySelector('button,[role="button"],a[href],[tabindex]');
        if (cand && cand.focus) try {
            cand.focus();
        } catch {}
        else try {
            overlay.focus();
        } catch {}
    }

    // Reliable Navigation: Button Click OR Keyboard
    function clickNav(overlay, direction) {
        const {
            prev,
            next
        } = getPrevNextButtons(overlay);
        const btn = direction === 'prev' ? prev : next;
        const keyName = direction === 'prev' ? 'ArrowLeft' : 'ArrowRight';

        // Attempt 1: Button Click
        if (btn) {
            try {
                btn.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: REAL_WIN
                }));
                return true;
            } catch (e) {}
        }

        // Attempt 2: Keyboard
        try {
            focusAny(overlay);
            overlay.dispatchEvent(new KeyboardEvent('keydown', {
                key: keyName,
                code: keyName,
                bubbles: true
            }));
            return true;
        } catch (e) {}

        return false;
    }

    function collectOverlayLinksSimple(overlay) {
        const out = new Set();
        overlay.querySelectorAll('a[href]').forEach(a => out.add(a.getAttribute('href')));
        overlay.querySelectorAll('[data-url],[data-href]').forEach(el => {
            const v = el.getAttribute('data-url') || el.getAttribute('data-href');
            if (v) out.add(v);
        });
        return uniqueByBase([...out]).map(normalizeUrl);
    }

    async function gatherLinksFromCurrentSlide(overlay) {
        let urls = collectOverlayLinksSimple(overlay);
        return urls;
    }

    // Strategy "Full Sweep"
    async function paginateOverlayAll(overlay, prof, targetCount) {
        const all = new Set();
        let {
            cur,
            total
        } = getPagerInfo(overlay);

        const stopKeepAlive = keepAliveOverlay(overlay);

        try {
            // 1. Rewind to start (1/N)
            let guard = 0;
            while (total > 1 && cur > 1 && guard++ < Math.max(10, total + 2) && !CANCEL) {
                if (!clickNav(overlay, 'prev')) break;
                await sleep((prof.STEP_MS) || 140);
                const p = getPagerInfo(overlay);
                if (p.cur === cur) {
                    break;
                }
                cur = p.cur;
                total = p.total;
            }

            // 2. Sweep forward (1/N -> N/N)
            guard = 0;
            const maxTries = Math.max(prof.PAG_TRIES || 8, total || 1);
            while (guard++ < maxTries && !CANCEL) {
                // Collect links from current slide
                const urls = await gatherLinksFromCurrentSlide(overlay);
                urls.forEach(u => all.add(u));

                if (all.size >= (targetCount || 0)) break;

                const p = getPagerInfo(overlay);
                cur = p.cur;
                total = p.total;
                if (total <= 1 || cur >= total) break;

                // Navigate forward
                if (!clickNav(overlay, 'next')) break;
                await sleep((prof.STEP_MS) || 140);

                const p2 = getPagerInfo(overlay);
                if (p2.cur === cur) {
                    break;
                }
                cur = p2.cur;
                total = p2.total;
            }
        } catch (e) {
            console.error("Pagination Error:", e);
        }
        finally {
            stopKeepAlive();
        }

        return uniqueByBase([...all]);
    }

    /* ========= Per message ========= */
    function collectDomLinks(node) {
        const set = new Set();
        node.querySelectorAll('a[href]').forEach(a => set.add(a.getAttribute('href')));
        return uniqueByBase([...set]).map(normalizeUrl);
    }

    // This function focuses on identifying the content node.
    function gatherMessageContent(node) {
        // Prioritize .markdown, then .whitespace-pre-wrap (typical for user prompts), fallback to the node itself.
        const content = node.querySelector(':scope .markdown, :scope .whitespace-pre-wrap') || node;
        return content;
    }

    const processedPills = new WeakSet();

    async function harvestAllPillsInMessage(node, prof, context) {
        const pills = findPills(node);
        const links = new Set();

        for (const pill of pills) {
            if (CANCEL) break;

            if (processedPills.has(pill)) continue;
            processedPills.add(pill);

            const need = expectedCountFromPill(pill);

            // Cold Start Management
            context.pillsProcessedCount++;
            const isColdStart = context.pillsProcessedCount <= CONFIG.COLD_START_PILLS;

            let linksFromThisPill = [];
            try {
                // Open overlay (robust version with retries)
                const overlay = await openOverlayMulti(pill, prof, isColdStart);
                if (!overlay) {
                    continue;
                }

                // Paginate and collect (Full Sweep)
                linksFromThisPill = await paginateOverlayAll(overlay, prof, need);
                linksFromThisPill.forEach(h => links.add(h));

                // Prepare for inline expansion
                try {
                    const both = uniqueByBase(linksFromThisPill || []).map(normalizeUrl);
                    if (both.length >= 1) {
                        (clickableOf(pill)).setAttribute('data-mdx-inline-links', JSON.stringify(both));
                    }
                } catch (e) {
                     console.error("Inline Prep Error:", e);
                }

                // Close overlay
                closeAllOverlays();
                await sleep(80);
            } catch (e) {
                 console.error("Pill Processing Error:", e);
            }
            await sleep(70);
        }
        return uniqueByBase([...links]);
    }

    /* ========= Export ========= */
    function download(text, filename, type = "text/markdown;charset=utf-8") {
        const blob = new Blob([text], {
            type
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(a.href);
            a.remove();
        }, 0);
    }

    // Modified exportSelected to respect DOM order
    async function exportSelected() {
        if (selected.size === 0) return;

        // Determine the export order based on DOM structure, not selection order
        const allNodesInOrder = messageNodes();
        const nodesToExport = allNodesInOrder.filter(node => selected.has(node));
        const total = nodesToExport.length;

        // Initialize export state and block UI
        CANCEL = false;
        setUIState(false);

        // Убедимся, что панель развернута во время экспорта, чтобы пользователь видел прогресс (Toast)
        onToggleCollapse(null, false);

        toast(`Exporting ${total} messages...`, null); // Show persistent toast

        const prof = getProfile(); // Gets 'ultra' profile
        const name = sanitizeName(title()),
            stamp = ts();

        const blocks = [];
        let totalLinks = 0;

        // Context for cold start and numbering
        const context = {
            pillsProcessedCount: 0,
            userMsgCount: 0,
            assistantMsgCount: 0,
            unknownMsgCount: 0
        };

        try {
            // Iterate over the DOM-ordered list
            for (let i = 0; i < total; i++) {
                if (CANCEL) break;
                const node = nodesToExport[i];
                const role = getMessageRole(node);

                const contentNode = gatherMessageContent(node);

                toast(`Processing ${i+1}/${total} (Links: ${totalLinks})`, null);

                // 1. Collect DOM links
                const domLinks = collectDomLinks(contentNode);

                // 2. Collect links from grouped pills (+N).
                const overlayLinks = await harvestAllPillsInMessage(node, prof, context);

                // 3. Combine links
                const hrefs = uniqueByBase([...domLinks, ...overlayLinks]).map(normalizeUrl);
                totalLinks += hrefs.length;

                // 4. Convert to Markdown
                const md = htmlToMarkdown(contentNode.cloneNode(true));

                // Construct numbered Links section
                const refs = hrefs.length ? '\n**Links:**\n' + hrefs.map((u, index) => `${index + 1}. ${u}`).join('\n') + '\n' : '';

                // Generate Header with Numbering
                let headerLabel;
                if (role === 'user') {
                    context.userMsgCount++;
                    headerLabel = `#User_question (${context.userMsgCount})`;
                } else if (role === 'assistant') {
                    context.assistantMsgCount++;
                    headerLabel = `#GPT_answer (${context.assistantMsgCount})`;
                } else {
                    context.unknownMsgCount++;
                    headerLabel = `#Unknown (${context.unknownMsgCount})`;
                }

                blocks.push(`${headerLabel}:\n${md}\n${refs}`);
            }

            const mdFilename = `${name}_selected_${stamp}.md`;
            if (!CANCEL && blocks.length > 0) {
                download(blocks.join('\n\n'), mdFilename, 'text/markdown;charset=utf-8');
            }

            toast(CANCEL ? 'Export Cancelled' : 'Export Complete');

        } catch (e) {
            console.error("Export Error:", e);
            toast('Error during export');
        } finally {
            // Reset UI state
            setUIState(true);
        }
    }

    /* ========= Boot ========= */
    function boot() {
        ensureUI();
        // Первоначальное добавление чекбоксов при загрузке.
        messageNodes().forEach(ensureCheckbox);
        // Инициализация состояния кнопки экспорта (на случай, если скрипт загрузился поздно)
        updateExportButton();
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') boot();
    else document.addEventListener('DOMContentLoaded', boot, {
        once: true
    });
    // Интервал для подстраховки, если UI будет удален при навигации в ChatGPT.
    setInterval(() => ensureUI(), 2000);
})();