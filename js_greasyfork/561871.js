// ==UserScript==
// @name         Claude Project Bulk Delete (v4)
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Add checkboxes to select multiple conversations in Claude Projects for bulk deletion
// @author       Solomon
// @match        https://claude.ai/project/*
// @icon         https://claude.ai/favicon.ico
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561871/Claude%20Project%20Bulk%20Delete%20%28v4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561871/Claude%20Project%20Bulk%20Delete%20%28v4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🗑️ Claude Project Bulk Delete v4 loading...');

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* FAB Container */
        #cpbd-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
        }

        /* Main Toggle Button */
        #cpbd-toggle-btn {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #dc2626 !important;
            border: 3px solid white !important;
            color: white !important;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        #cpbd-toggle-btn:hover {
            transform: scale(1.08);
        }

        #cpbd-toggle-btn.active {
            background: #16a34a !important;
        }

        /* Counter Badge */
        #cpbd-counter {
            position: absolute;
            top: -6px;
            right: -6px;
            background: #fbbf24;
            color: #000;
            font-size: 12px;
            font-weight: bold;
            min-width: 22px;
            height: 22px;
            border-radius: 11px;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 0 5px;
        }

        #cpbd-counter.visible {
            display: flex;
        }

        /* Action Buttons Container */
        #cpbd-actions {
            display: none;
            flex-direction: column;
            gap: 8px;
            align-items: flex-end;
        }

        #cpbd-actions.visible {
            display: flex;
        }

        /* Action Buttons */
        .cpbd-action-btn {
            padding: 10px 16px;
            border-radius: 20px;
            border: none;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
           CHECKBOX STYLING - Each conversation gets one
           ═══════════════════════════════════════════════════════════════════════ */

        .cpbd-cb-wrapper {
            position: absolute !important;
            left: -32px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 1000 !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        /* Show checkboxes when bulk mode active */
        body.cpbd-active .cpbd-cb-wrapper {
            opacity: 1 !important;
            pointer-events: auto !important;
        }

        .cpbd-cb {
            width: 20px !important;
            height: 20px !important;
            cursor: pointer !important;
            accent-color: #dc2626 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Make conversation rows relative for checkbox positioning */
        .cpbd-conv-row {
            position: relative !important;
            margin-left: 0 !important;
            transition: all 0.2s ease;
        }

        /* Add left padding when bulk mode active */
        body.cpbd-active .cpbd-conv-row {
            margin-left: 32px !important;
        }

        /* Highlight selected rows */
        .cpbd-conv-row.cpbd-sel {
            background: rgba(220, 38, 38, 0.1) !important;
            border-radius: 8px;
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
            border-radius: 12px;
            padding: 24px;
            max-width: 380px;
            width: 90%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        #cpbd-modal h3 {
            margin: 0 0 12px 0;
            color: #dc2626;
            font-size: 18px;
        }

        #cpbd-modal p {
            margin: 0 0 20px 0;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        }

        #cpbd-modal-btns {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        #cpbd-modal-btns button {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            font-size: 14px;
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
            padding: 24px 32px;
            border-radius: 12px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.25);
            z-index: 99999999;
            display: none;
            text-align: center;
            min-width: 250px;
        }

        #cpbd-progress.show {
            display: block;
        }

        #cpbd-progress-text {
            margin-bottom: 12px;
            font-size: 14px;
            color: #333;
        }

        #cpbd-progress-bar {
            height: 6px;
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
        selected: new Map() // id -> {title, row}
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
    // 🔍 FIND EACH CONVERSATION ROW
    // ═══════════════════════════════════════════════════════════════════════════

    function findConversations() {
        const results = [];
        
        // Find all links that go to /chat/
        const links = document.querySelectorAll('a[href^="/chat/"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/^\/chat\/([a-f0-9-]+)/);
            if (!match) return;
            
            const id = match[1];
            const title = link.textContent?.trim() || 'Untitled';
            
            // Find the parent container that represents the whole row
            // Look for the element that contains both the title and "Last message X ago"
            let row = link.parentElement;
            
            // Go up to find a container that has the full conversation info
            for (let i = 0; i < 6 && row; i++) {
                // Check if this element contains "Last message"
                if (row.textContent?.includes('Last message') && 
                    row.textContent?.includes('ago')) {
                    break;
                }
                row = row.parentElement;
            }
            
            // Make sure we found a valid row and haven't gone too far
            if (row && row !== document.body && !row.matches('main, [class*="flex-col"]')) {
                // Check if we already have this ID
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
                <button id="cpbd-delete-btn" class="cpbd-action-btn" disabled>🗑️ Delete (0)</button>
                <button id="cpbd-select-all-btn" class="cpbd-action-btn">☑️ Select All</button>
                <button id="cpbd-clear-btn" class="cpbd-action-btn">✖️ Clear</button>
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
                <p>Delete <strong id="cpbd-del-count">0</strong> conversation(s)?<br><br>
                <span style="color:#dc2626">This cannot be undone!</span></p>
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

        // Events
        document.getElementById('cpbd-toggle-btn').onclick = toggle;
        document.getElementById('cpbd-delete-btn').onclick = showModal;
        document.getElementById('cpbd-select-all-btn').onclick = selectAll;
        document.getElementById('cpbd-clear-btn').onclick = clearSel;
        document.getElementById('cpbd-btn-cancel').onclick = hideModal;
        document.getElementById('cpbd-btn-confirm').onclick = doDelete;
        overlay.onclick = e => { if (e.target === overlay) hideModal(); };
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
            // Skip if already has checkbox
            if (conv.row.classList.contains('cpbd-conv-row')) return;
            
            conv.row.classList.add('cpbd-conv-row');
            
            // Create checkbox wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'cpbd-cb-wrapper';
            
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'cpbd-cb';
            cb.dataset.convId = conv.id;
            cb.dataset.convTitle = conv.title;
            
            // Prevent click from navigating
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
        btn.textContent = `🗑️ Delete (${n})`;
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
            txt.textContent = `Deleting ${done + 1} of ${total}...`;
            fill.style.width = `${((done + 1) / total) * 100}%`;
            
            const ok = await deleteConv(id);
            if (ok) {
                done++;
                state.selected.delete(id);
                
                // Animate out
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
        
        console.log('🗑️ v4 init...');
        createUI();
        observe();
        console.log('✅ Ready!');
    }

    // Wait for page to fully load
    setTimeout(init, 1500);

})();