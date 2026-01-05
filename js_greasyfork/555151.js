// ==UserScript==
// @name         Claude Token Saver v43
// @namespace    http://tampermonkey.net/
// @version      43
// @description  Prevents token waste by enforcing file creation. Smooth draggable UI.
// @author       Solomon
// @match        https://claude.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555151/Claude%20Token%20Saver%20v43.user.js
// @updateURL https://update.greasyfork.org/scripts/555151/Claude%20Token%20Saver%20v43.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('💾 Token Saver v43 loaded!');

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        thresholds: {
            warning: 500,
            danger: 1000
        },
        intervals: {
            responseCheck: 500,
            fileDetection: 2000
        },
        patterns: {
            paste: ['```', '# ', '## ', '### ', '---\n', '| ', '\n\n\n'],
            file: ['download', 'computer://', '/mnt/user-data/outputs/', 'file created', 'saved to', '.user.js']
        },
        minimized: GM_getValue('minimized', true),
        position: GM_getValue('btnPosition', { bottom: 100, right: 20 })
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATE
    // ═══════════════════════════════════════════════════════════════════════════

    const state = {
        monitoring: false,
        responseLength: 0,
        fileDetected: false,
        files: [],
        isMinimized: CONFIG.minimized
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES - v43 SMOOTH
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* ═══════════════════════════════════════════════════════════════════════
           MINIMIZED BUTTON
           ═══════════════════════════════════════════════════════════════════════ */
        #cts-mini-btn {
            position: fixed !important;
            z-index: 2147483647 !important;
            width: 56px !important;
            height: 56px !important;
            background: linear-gradient(145deg, #14b8c6 0%, #0891b2 100%) !important;
            border: none !important;
            border-radius: 50% !important;
            box-shadow: 
                0 4px 15px rgba(8, 145, 178, 0.4),
                0 2px 6px rgba(0, 0, 0, 0.1) !important;
            cursor: grab !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 26px !important;
            user-select: none !important;
        }

        #cts-mini-btn:hover {
            box-shadow: 
                0 6px 20px rgba(8, 145, 178, 0.5),
                0 3px 8px rgba(0, 0, 0, 0.15) !important;
        }

        #cts-mini-btn.dragging {
            cursor: grabbing !important;
            box-shadow: 
                0 10px 30px rgba(8, 145, 178, 0.5),
                0 4px 10px rgba(0, 0, 0, 0.2) !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           EXPANDED PANEL
           ═══════════════════════════════════════════════════════════════════════ */
        #cts-panel {
            position: fixed !important;
            z-index: 2147483647 !important;
            width: 540px !important;
            background: #ffffff !important;
            border: none !important;
            border-radius: 14px !important;
            box-shadow: 
                0 10px 40px rgba(0, 0, 0, 0.12),
                0 4px 12px rgba(0, 0, 0, 0.08) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 12px !important;
            display: none !important;
            overflow: hidden !important;
        }

        #cts-panel.visible {
            display: block !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           HEADER
           ═══════════════════════════════════════════════════════════════════════ */
        .cts-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 12px 16px !important;
            background: linear-gradient(145deg, #14b8c6 0%, #0891b2 100%) !important;
            color: white !important;
            cursor: grab !important;
            user-select: none !important;
        }

        .cts-header.dragging {
            cursor: grabbing !important;
        }

        .cts-title {
            font-weight: 600 !important;
            font-size: 14px !important;
        }

        .cts-toggle {
            background: rgba(255, 255, 255, 0.15) !important;
            border: none !important;
            color: white !important;
            width: 28px !important;
            height: 28px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: background 0.15s ease !important;
        }

        .cts-toggle:hover { 
            background: rgba(255, 255, 255, 0.25) !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           CONTENT
           ═══════════════════════════════════════════════════════════════════════ */
        .cts-body {
            padding: 12px !important;
        }

        .cts-content {
            display: flex !important;
            gap: 10px !important;
        }

        .cts-section {
            flex: 1 !important;
            background: #f8fafc !important;
            padding: 10px !important;
            border-radius: 8px !important;
        }

        .cts-section-title {
            font-weight: 600 !important;
            font-size: 10px !important;
            color: #0891b2 !important;
            margin-bottom: 8px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.3px !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           BUTTONS
           ═══════════════════════════════════════════════════════════════════════ */
        .cts-btn {
            width: 100% !important;
            padding: 8px 12px !important;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            font-size: 11px !important;
            margin-bottom: 6px !important;
            transition: all 0.15s ease !important;
        }

        .cts-btn:last-child { margin-bottom: 0 !important; }

        .cts-btn-primary {
            background: linear-gradient(145deg, #14b8c6 0%, #0891b2 100%) !important;
            color: white !important;
        }

        .cts-btn-primary:hover {
            filter: brightness(1.1) !important;
        }

        .cts-btn-secondary {
            background: #e2e8f0 !important;
            color: #334155 !important;
        }

        .cts-btn-secondary:hover {
            background: #cbd5e1 !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           FILE LIST
           ═══════════════════════════════════════════════════════════════════════ */
        .cts-file-list {
            max-height: 90px !important;
            overflow-y: auto !important;
            font-size: 10px !important;
        }

        .cts-file-item {
            padding: 6px 8px !important;
            background: white !important;
            border-radius: 4px !important;
            margin-bottom: 4px !important;
            cursor: pointer !important;
            transition: background 0.15s ease !important;
        }

        .cts-file-item:hover {
            background: #e0f2fe !important;
        }

        .cts-file-name {
            font-weight: 500 !important;
            color: #0891b2 !important;
        }

        .cts-file-hint {
            font-size: 9px !important;
            color: #94a3b8 !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           STATUS INDICATOR
           ═══════════════════════════════════════════════════════════════════════ */
        #cts-status {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            padding: 10px 16px !important;
            border-radius: 8px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
            z-index: 2147483646 !important;
            display: none !important;
        }

        #cts-status.safe { background: #10b981 !important; color: white !important; }
        #cts-status.warning { background: #f59e0b !important; color: white !important; }
        #cts-status.danger { background: #ef4444 !important; color: white !important; }
        #cts-status.info { background: #0891b2 !important; color: white !important; }

        .cts-features {
            font-size: 10px !important;
            line-height: 1.6 !important;
            color: #475569 !important;
        }

        .cts-help {
            font-size: 9px !important;
            line-height: 1.5 !important;
            color: #64748b !important;
        }

        .cts-file-list::-webkit-scrollbar { width: 4px !important; }
        .cts-file-list::-webkit-scrollbar-track { background: transparent !important; }
        .cts-file-list::-webkit-scrollbar-thumb { background: #cbd5e1 !important; border-radius: 2px !important; }
    `);

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════

    async function copyText(text, successMsg) {
        try {
            await navigator.clipboard.writeText(text);
            showStatus('info', successMsg);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText = 'position:fixed;opacity:0;';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showStatus('info', successMsg);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚦 STATUS INDICATOR
    // ═══════════════════════════════════════════════════════════════════════════

    let statusTimeout = null;

    function showStatus(type, message, duration = 3000) {
        let status = document.getElementById('cts-status');

        if (!status) {
            status = document.createElement('div');
            status.id = 'cts-status';
            document.body.appendChild(status);
        }

        if (state.fileDetected && type !== 'safe' && type !== 'info') return;

        status.className = type;
        status.textContent = message;
        status.style.display = 'block';

        clearTimeout(statusTimeout);
        if (duration > 0) {
            statusTimeout = setTimeout(() => {
                status.style.display = 'none';
            }, duration);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 RESPONSE MONITORING
    // ═══════════════════════════════════════════════════════════════════════════

    function hasPastePattern(text) {
        return CONFIG.patterns.paste.some(p => text.includes(p));
    }

    function hasFileMention(text) {
        return CONFIG.patterns.file.some(p => text.toLowerCase().includes(p.toLowerCase()));
    }

    function checkResponse() {
        if (!state.monitoring) return;

        const responses = document.querySelectorAll('[data-test-render-count]');
        if (responses.length === 0) return;

        const latest = responses[responses.length - 1];
        const text = latest.textContent || '';
        state.responseLength = text.length;

        if (hasFileMention(text)) {
            state.fileDetected = true;
            showStatus('safe', '✅ File creation detected!');
            return;
        }

        if (state.responseLength > CONFIG.thresholds.danger && hasPastePattern(text)) {
            showStatus('danger', `❌ ${state.responseLength} chars - paste detected!`, 0);
        } else if (state.responseLength > CONFIG.thresholds.warning) {
            showStatus('warning', `⚠️ ${state.responseLength} chars - consider file`, 0);
        }

        setTimeout(checkResponse, CONFIG.intervals.responseCheck);
    }

    function startMonitoring() {
        if (state.monitoring) return;
        state.monitoring = true;
        state.responseLength = 0;
        state.fileDetected = false;
        checkResponse();
    }

    function observeNewResponses() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.querySelector?.('[data-test-render-count]') ||
                            node.hasAttribute?.('data-test-render-count')) {
                            startMonitoring();
                            return;
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📁 FILE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    function detectFiles() {
        const selectors = '[class*="attachment"], [class*="file"], a[href*="uploads"]';
        const elements = document.querySelectorAll(selectors);
        const files = new Set();

        elements.forEach(el => {
            const name = el.textContent || el.getAttribute('title') || el.getAttribute('href') || '';
            if (name.includes('.')) {
                const clean = name.split('/').pop().trim();
                if (clean) files.add(clean);
            }
        });

        if (files.size > state.files.length) {
            state.files = [...files];
            updateFileList();
            showStatus('info', `📂 ${files.size} file(s) detected`);
        }
    }

    function updateFileList() {
        const list = document.getElementById('cts-file-list');
        if (!list) return;

        if (state.files.length === 0) {
            list.innerHTML = '<div class="cts-file-hint">No files detected yet</div>';
            return;
        }

        list.innerHTML = state.files.map(file => `
            <div class="cts-file-item" data-file="${file}">
                <div class="cts-file-name">📄 ${file}</div>
            </div>
        `).join('');

        list.querySelectorAll('.cts-file-item').forEach(item => {
            item.addEventListener('click', () => {
                const cmd = `Please use the view tool to read: /mnt/user-data/uploads/${item.dataset.file}\n\nThen process it and create a downloadable output file in /mnt/user-data/outputs/ - do NOT paste content in chat.`;
                copyText(cmd, `📋 Copied!`);
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🖱️ SMOOTH DRAG - v43 improved
    // ═══════════════════════════════════════════════════════════════════════════

    function smoothDrag(element, saveKey, onClick) {
        let startX, startY, startLeft, startTop;
        let isDragging = false;
        let hasMoved = false;

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            
            isDragging = true;
            hasMoved = false;
            
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            element.classList.add('dragging');
            
            // Prevent text selection
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Threshold to distinguish click from drag
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMoved = true;
            }

            if (hasMoved) {
                let newX = startLeft + dx;
                let newY = startTop + dy;

                // Constrain to viewport
                const w = element.offsetWidth;
                const h = element.offsetHeight;
                newX = Math.max(0, Math.min(newX, window.innerWidth - w));
                newY = Math.max(0, Math.min(newY, window.innerHeight - h));

                // Apply position directly (no transition during drag)
                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                element.style.right = 'auto';
                element.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            element.classList.remove('dragging');

            if (hasMoved) {
                // Save position
                const rect = element.getBoundingClientRect();
                GM_setValue(saveKey, { left: rect.left, top: rect.top });
            } else if (onClick) {
                // It was a click
                onClick();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎛️ UI
    // ═══════════════════════════════════════════════════════════════════════════

    function togglePanel() {
        const miniBtn = document.getElementById('cts-mini-btn');
        const panel = document.getElementById('cts-panel');

        if (state.isMinimized) {
            const btnRect = miniBtn.getBoundingClientRect();
            
            miniBtn.style.display = 'none';
            
            // Position panel near button
            let panelX = btnRect.left - 480;
            let panelY = btnRect.top;
            
            // Keep in viewport
            panelX = Math.max(10, Math.min(panelX, window.innerWidth - 550));
            panelY = Math.max(10, Math.min(panelY, window.innerHeight - 300));
            
            panel.style.left = panelX + 'px';
            panel.style.top = panelY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.classList.add('visible');
            
            state.isMinimized = false;
        } else {
            const panelRect = panel.getBoundingClientRect();
            
            panel.classList.remove('visible');
            
            miniBtn.style.left = (panelRect.right - 60) + 'px';
            miniBtn.style.top = panelRect.top + 'px';
            miniBtn.style.right = 'auto';
            miniBtn.style.bottom = 'auto';
            miniBtn.style.display = 'flex';
            
            state.isMinimized = true;
        }

        GM_setValue('minimized', state.isMinimized);
    }

    function createUI() {
        document.getElementById('cts-mini-btn')?.remove();
        document.getElementById('cts-panel')?.remove();

        const pos = CONFIG.position;

        // ═══════════════════════════════════════════════════════════════════
        // MINI BUTTON
        // ═══════════════════════════════════════════════════════════════════
        const miniBtn = document.createElement('div');
        miniBtn.id = 'cts-mini-btn';
        miniBtn.textContent = '💾';

        if (pos.left !== undefined) {
            miniBtn.style.left = pos.left + 'px';
            miniBtn.style.top = (pos.top || 100) + 'px';
        } else {
            miniBtn.style.bottom = (pos.bottom || 100) + 'px';
            miniBtn.style.right = (pos.right || 20) + 'px';
        }

        if (!state.isMinimized) {
            miniBtn.style.display = 'none';
        }

        document.body.appendChild(miniBtn);
        smoothDrag(miniBtn, 'btnPosition', togglePanel);

        // ═══════════════════════════════════════════════════════════════════
        // PANEL
        // ═══════════════════════════════════════════════════════════════════
        const panel = document.createElement('div');
        panel.id = 'cts-panel';

        if (pos.left !== undefined) {
            panel.style.left = Math.max(10, pos.left - 480) + 'px';
            panel.style.top = (pos.top || 100) + 'px';
        } else {
            panel.style.bottom = (pos.bottom || 100) + 'px';
            panel.style.right = (pos.right || 20) + 'px';
        }

        if (!state.isMinimized) {
            panel.classList.add('visible');
        }

        panel.innerHTML = `
            <div class="cts-header">
                <div class="cts-title">💾 Token Saver</div>
                <button class="cts-toggle" id="cts-toggle" title="Minimize">✕</button>
            </div>
            <div class="cts-body">
                <div class="cts-content">
                    <div class="cts-section">
                        <div class="cts-section-title">📊 Status</div>
                        <div class="cts-features">
                            <div>✓ Real-time monitoring</div>
                            <div>✓ Paste detection</div>
                            <div>✓ File enforcement</div>
                        </div>
                    </div>
                    <div class="cts-section">
                        <div class="cts-section-title">🔧 Actions</div>
                        <button class="cts-btn cts-btn-primary" id="cts-scan">🔍 Scan Uploads</button>
                        <button class="cts-btn cts-btn-secondary" id="cts-refresh">🔄 Refresh</button>
                        <button class="cts-btn cts-btn-secondary" id="cts-clear">🗑️ Clear</button>
                    </div>
                    <div class="cts-section" style="flex: 1.3;">
                        <div class="cts-section-title">📂 Files</div>
                        <div class="cts-file-list" id="cts-file-list">
                            <div class="cts-file-hint">No files detected</div>
                        </div>
                    </div>
                    <div class="cts-section">
                        <div class="cts-section-title">ℹ️ Help</div>
                        <div class="cts-help">
                            1. Upload files<br>
                            2. Scan Uploads<br>
                            3. Click file to copy<br>
                            4. Paste in chat
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Header drag
        const header = panel.querySelector('.cts-header');
        smoothDrag(panel, 'panelPosition', null);
        
        // Only drag from header
        panel.onmousedown = null;
        
        let headerDragging = false;
        let hStartX, hStartY, hStartLeft, hStartTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            
            headerDragging = true;
            hStartX = e.clientX;
            hStartY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            hStartLeft = rect.left;
            hStartTop = rect.top;
            
            header.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!headerDragging) return;

            const dx = e.clientX - hStartX;
            const dy = e.clientY - hStartY;

            let newX = hStartLeft + dx;
            let newY = hStartTop + dy;

            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));

            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (!headerDragging) return;
            headerDragging = false;
            header.classList.remove('dragging');
            
            const rect = panel.getBoundingClientRect();
            GM_setValue('panelPosition', { left: rect.left, top: rect.top });
        });

        // Buttons
        document.getElementById('cts-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });

        document.getElementById('cts-scan').addEventListener('click', () => {
            copyText(`Please use the view tool to scan /mnt/user-data/uploads and list all files there.`, '📋 Scan command copied!');
        });

        document.getElementById('cts-refresh').addEventListener('click', () => {
            detectFiles();
            showStatus('info', '🔄 Refreshed!');
        });

        document.getElementById('cts-clear').addEventListener('click', () => {
            state.files = [];
            updateFileList();
            showStatus('info', '🗑️ Cleared!');
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INIT
    // ═══════════════════════════════════════════════════════════════════════════

    function init() {
        console.log('🚀 Token Saver v43 initializing...');
        
        createUI();
        observeNewResponses();
        
        setInterval(detectFiles, CONFIG.intervals.fileDetection);
        detectFiles();

        showStatus('safe', '✅ Token Saver v43 ready!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();