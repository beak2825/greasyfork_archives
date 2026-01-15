// ==UserScript==
// @name         Claude Project Bulk Delete (v7)
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Add checkboxes to select multiple conversations in Claude Projects for bulk deletion - Drag the button to move, click to toggle
// @author       Solomon
// @match        https://claude.ai/project/*
// @icon         https://claude.ai/favicon.ico
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561871/Claude%20Project%20Bulk%20Delete%20%28v7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561871/Claude%20Project%20Bulk%20Delete%20%28v7%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🗑️ Claude Project Bulk Delete v7 loading...');

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* ═══════════════════════════════════════════════════════════════════════
           FAB Container
           ═══════════════════════════════════════════════════════════════════════ */
        #cpbd-fab {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: flex-end;
            touch-action: none;
        }

        /* Main Toggle Button - v7: DRAGGABLE */
        #cpbd-toggle-btn {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: #dc2626 !important;
            border: 2px solid white !important;
            color: white !important;
            font-size: 18px;
            cursor: grab;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
            transition: transform 0.2s ease, background 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            user-select: none;
        }

        #cpbd-toggle-btn:hover {
            transform: scale(1.05);
        }

        #cpbd-toggle-btn.active {
            background: #16a34a !important;
        }

        #cpbd-toggle-btn.dragging {
            cursor: grabbing;
            transform: scale(1.1);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.35);
        }

        /* Counter Badge */
        #cpbd-counter {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #fbbf24;
            color: #000;
            font-size: 10px;
            font-weight: bold;
            min-width: 18px;
            height: 18px;
            border-radius: 9px;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
            pointer-events: none;
        }

        #cpbd-counter.visible {
            display: flex;
        }

        /* Action Buttons Container */
        #cpbd-actions {
            display: none;
            flex-direction: column;
            gap: 5px;
            align-items: flex-end;
        }

        #cpbd-actions.visible {
            display: flex;
        }

        /* Action Buttons */
        .cpbd-action-btn {
            padding: 6px 10px;
            border-radius: 14px;
            border: none;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
            transition: all 0.15s ease;
        }

        #cpbd-delete-btn {
            background: #dc2626 !important;
            color: white !important;
        }

        #cpbd-delete-btn:disabled {
            background: #9ca3af !important;
            cursor: not-allowed;
        }

        #cpbd-select-all-btn {
            background: #2563eb !important;
            color: white !important;
        }

        #cpbd-clear-btn {
            background: #6b7280 !important;
            color: white !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           CHECKBOX STYLING
           ═══════════════════════════════════════════════════════════════════════ */

        .cpbd-cb-wrapper {
            position: absolute !important;
            left: -28px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 1000 !important;
            width: 20px !important;
            height: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        body.cpbd-active .cpbd-cb-wrapper {
            opacity: 1 !important;
            pointer-events: auto !important;
        }

        .cpbd-cb {
            width: 16px !important;
            height: 16px !important;
            cursor: pointer !important;
            accent-color: #dc2626 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .cpbd-conv-row {
            position: relative !important;
            margin-left: 0 !important;
            transition: all 0.2s ease;
        }

        body.cpbd-active .cpbd-conv-row {
            margin-left: 28px !important;
        }

        .cpbd-conv-row.cpbd-sel {
            background: rgba(220, 38, 38, 0.1) !important;
            border-radius: 6px;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           MODAL
           ═══════════════════════════════════════════════════════════════════════ */

        #cpbd-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
            align-items: center;
            justify-content: center;
        }

        #cpbd-overlay.show {
            display: flex;
        }

        #cpbd-modal {
            background: white;
            border-radius: 10px;
            padding: 18px;
            max-width: 320px;
            width: 90%;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        #cpbd-modal h3 {
            margin: 0 0 10px 0;
            color: #dc2626;
            font-size: 15px;
        }

        #cpbd-modal p {
            margin: 0 0 16px 0;
            color: #555;
            font-size: 13px;
            line-height: 1.4;
        }

        #cpbd-modal-btns {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        #cpbd-modal-btns button {
            padding: 8px 14px;
            border-radius: 5px;
            border: none;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
        }

        #cpbd-btn-cancel {
            background: #e5e7eb;
            color: #333;
        }

        #cpbd-btn-confirm {
            background: #dc2626;
            color: white;
        }

        /* Progress */
        #cpbd-progress {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 18px 24px;
            border-radius: 10px;
            box-shadow: 0 12px 35px rgba(0,0,0,0.25);
            z-index: 99999999;
            display: none;
            text-align: center;
            min-width: 200px;
        }

        #cpbd-progress.show {
            display: block;
        }

        #cpbd-progress-text {
            margin-bottom: 10px;
            font-size: 12px;
            color: #333;
        }

        #cpbd-progress-bar {
            height: 5px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
        }

        #cpbd-progress-fill {
            height: 100%;
            background: #dc2626;
            width: 0%;
            transition: width 0.2s;
        }

        /* Dark mode */
        [data-mode="dark"] #cpbd-modal,
        [data-mode="dark"] #cpbd-progress {
            background: #1f2937;
            color: #e5e7eb;
        }
        [data-mode="dark"] #cpbd-modal p {
            color: #9ca3af;
        }
        [data-mode="dark"] #cpbd-btn-cancel {
            background: #374151;
            color: #e5e7eb;
        }
    `);

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATE
    // ═══════════════════════════════════════════════════════════════════════════

    const state = {
        active: false,
        selected: new Map()
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    function getOrgId() {
        const m = document.cookie.match(/lastActiveOrg=([^;]+)/);
        return m ? m[1] : null;
    }

    async function deleteConv(id) {
        const org = getOrgId();
        if (!org) return false;
        try {
            const r = await fetch(`/api/organizations/${org}/chat_conversations/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            return r.ok;
        } catch (e) {
            return false;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 FIND CONVERSATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    function findConversations() {
        const results = [];
        const links = document.querySelectorAll('a[href^="/chat/"]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/^\/chat\/([a-f0-9-]+)/);
            if (!match) return;

            const id = match[1];
            const title = link.textContent?.trim() || 'Untitled';

            let row = link.parentElement;
            for (let i = 0; i < 6 && row; i++) {
                if (row.textContent?.includes('Last message') &&
                    row.textContent?.includes('ago')) {
                    break;
                }
                row = row.parentElement;
            }

            if (row && row !== document.body && !row.matches('main, [class*="flex-col"]')) {
                if (!results.some(r => r.id === id)) {
                    results.push({ id, title, row, link });
                }
            }
        });

        console.log(`🔍 Found ${results.length} conversations`);
        return results;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 UI CREATION
    // ═══════════════════════════════════════════════════════════════════════════

    function createUI() {
        // FAB
        const fab = document.createElement('div');
        fab.id = 'cpbd-fab';
        fab.innerHTML = `
            <div id="cpbd-actions">
                <button id="cpbd-delete-btn" class="cpbd-action-btn" disabled>🗑️ (0)</button>
                <button id="cpbd-select-all-btn" class="cpbd-action-btn">☑️ All</button>
                <button id="cpbd-clear-btn" class="cpbd-action-btn">✖️</button>
            </div>
            <button id="cpbd-toggle-btn">🗑️<span id="cpbd-counter">0</span></button>
        `;
        document.body.appendChild(fab);

        // Modal
        const overlay = document.createElement('div');
        overlay.id = 'cpbd-overlay';
        overlay.innerHTML = `
            <div id="cpbd-modal">
                <h3>⚠️ Confirm Delete</h3>
                <p>Delete <strong id="cpbd-del-count">0</strong> conversation(s)?<br>
                <span style="color:#dc2626;font-size:12px">This cannot be undone!</span></p>
                <div id="cpbd-modal-btns">
                    <button id="cpbd-btn-cancel">Cancel</button>
                    <button id="cpbd-btn-confirm">🗑️ Delete</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Progress
        const prog = document.createElement('div');
        prog.id = 'cpbd-progress';
        prog.innerHTML = `
            <div id="cpbd-progress-text">Deleting...</div>
            <div id="cpbd-progress-bar"><div id="cpbd-progress-fill"></div></div>
        `;
        document.body.appendChild(prog);

        // Action button events
        document.getElementById('cpbd-delete-btn').onclick = showModal;
        document.getElementById('cpbd-select-all-btn').onclick = selectAll;
        document.getElementById('cpbd-clear-btn').onclick = clearSel;
        document.getElementById('cpbd-btn-cancel').onclick = hideModal;
        document.getElementById('cpbd-btn-confirm').onclick = doDelete;
        overlay.onclick = e => { if (e.target === overlay) hideModal(); };

        // ═══════════════════════════════════════════════════════════════════════
        // v7: DRAG + CLICK on same button
        // Click = toggle mode, Drag = move FAB
        // ═══════════════════════════════════════════════════════════════════════

        const toggleBtn = document.getElementById('cpbd-toggle-btn');
        let isDragging = false;
        let hasMoved = false;
        let startX = 0;
        let startY = 0;
        let offsetX = 0;
        let offsetY = 0;
        const DRAG_THRESHOLD = 5; // pixels before considered a drag

        toggleBtn.addEventListener('mousedown', startDrag);
        toggleBtn.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            e.preventDefault();

            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            hasMoved = false;
            isDragging = true;

            const rect = fab.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('touchend', stopDrag);
        }

        function onDrag(e) {
            if (!isDragging) return;

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            // Check if moved past threshold
            const dx = Math.abs(clientX - startX);
            const dy = Math.abs(clientY - startY);

            if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
                hasMoved = true;
                toggleBtn.classList.add('dragging');
            }

            if (hasMoved) {
                e.preventDefault();

                let newX = clientX - offsetX;
                let newY = clientY - offsetY;

                // Keep within viewport bounds
                const maxX = window.innerWidth - fab.offsetWidth - 5;
                const maxY = window.innerHeight - fab.offsetHeight - 5;

                newX = Math.max(5, Math.min(newX, maxX));
                newY = Math.max(5, Math.min(newY, maxY));

                fab.style.left = newX + 'px';
                fab.style.top = newY + 'px';
                fab.style.right = 'auto';
                fab.style.bottom = 'auto';
            }
        }

        function stopDrag(e) {
            isDragging = false;
            toggleBtn.classList.remove('dragging');

            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', stopDrag);

            // If didn't move much, treat as click
            if (!hasMoved) {
                toggle();
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 TOGGLE & CHECKBOX INJECTION
    // ═══════════════════════════════════════════════════════════════════════════

    function toggle() {
        state.active = !state.active;
        document.getElementById('cpbd-toggle-btn').classList.toggle('active', state.active);
        document.getElementById('cpbd-actions').classList.toggle('visible', state.active);
        document.body.classList.toggle('cpbd-active', state.active);

        if (state.active) {
            addCheckboxes();
        } else {
            clearSel();
            removeCheckboxes();
        }
    }

    function addCheckboxes() {
        const convs = findConversations();

        convs.forEach(conv => {
            if (conv.row.classList.contains('cpbd-conv-row')) return;

            conv.row.classList.add('cpbd-conv-row');

            const wrapper = document.createElement('div');
            wrapper.className = 'cpbd-cb-wrapper';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'cpbd-cb';
            cb.dataset.convId = conv.id;
            cb.dataset.convTitle = conv.title;

            cb.onclick = e => e.stopPropagation();

            cb.onchange = () => {
                if (cb.checked) {
                    state.selected.set(conv.id, { title: conv.title, row: conv.row });
                    conv.row.classList.add('cpbd-sel');
                } else {
                    state.selected.delete(conv.id);
                    conv.row.classList.remove('cpbd-sel');
                }
                updateCount();
            };

            wrapper.appendChild(cb);
            conv.row.insertBefore(wrapper, conv.row.firstChild);
        });
    }

    function removeCheckboxes() {
        document.querySelectorAll('.cpbd-cb-wrapper').forEach(el => el.remove());
        document.querySelectorAll('.cpbd-conv-row').forEach(el => {
            el.classList.remove('cpbd-conv-row', 'cpbd-sel');
        });
    }

    function updateCount() {
        const n = state.selected.size;
        const counter = document.getElementById('cpbd-counter');
        counter.textContent = n;
        counter.classList.toggle('visible', n > 0);

        const btn = document.getElementById('cpbd-delete-btn');
        btn.textContent = `🗑️ (${n})`;
        btn.disabled = n === 0;
    }

    function selectAll() {
        document.querySelectorAll('.cpbd-cb').forEach(cb => {
            if (!cb.checked) {
                cb.checked = true;
                cb.onchange();
            }
        });
    }

    function clearSel() {
        document.querySelectorAll('.cpbd-cb').forEach(cb => {
            if (cb.checked) {
                cb.checked = false;
                cb.onchange();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🗑️ DELETE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    function showModal() {
        if (state.selected.size === 0) return;
        document.getElementById('cpbd-del-count').textContent = state.selected.size;
        document.getElementById('cpbd-overlay').classList.add('show');
    }

    function hideModal() {
        document.getElementById('cpbd-overlay').classList.remove('show');
    }

    async function doDelete() {
        hideModal();

        const items = Array.from(state.selected.entries());
        const total = items.length;
        let done = 0;

        const prog = document.getElementById('cpbd-progress');
        const txt = document.getElementById('cpbd-progress-text');
        const fill = document.getElementById('cpbd-progress-fill');

        prog.classList.add('show');

        for (const [id, data] of items) {
            txt.textContent = `${done + 1}/${total}`;
            fill.style.width = `${((done + 1) / total) * 100}%`;

            const ok = await deleteConv(id);
            if (ok) {
                done++;
                state.selected.delete(id);

                if (data.row) {
                    data.row.style.transition = 'all 0.25s ease';
                    data.row.style.opacity = '0';
                    data.row.style.transform = 'translateX(30px)';
                    setTimeout(() => data.row.remove(), 250);
                }
            }

            await new Promise(r => setTimeout(r, 350));
        }

        prog.classList.remove('show');
        fill.style.width = '0%';
        updateCount();

        console.log(`✅ Deleted ${done}/${total} conversations`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 👁️ MUTATION OBSERVER
    // ═══════════════════════════════════════════════════════════════════════════

    function observe() {
        new MutationObserver(() => {
            if (state.active) {
                addCheckboxes();
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INIT
    // ═══════════════════════════════════════════════════════════════════════════

    function init() {
        if (!location.pathname.startsWith('/project/')) {
            return;
        }

        console.log('🗑️ v7 init...');
        createUI();
        observe();
        console.log('✅ Ready!');
    }

    setTimeout(init, 1500);

})();