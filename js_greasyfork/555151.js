// ==UserScript==
// @name         Claude Token Saver v35
// @namespace    http://tampermonkey.net/
// @version      35
// @description  Prevents token waste by enforcing file creation instead of chat pasting. Monitors output length and detects file creation. FIXED: Copy command, monitoring, visual feedback.
// @author       You
// @match        https://claude.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555151/Claude%20Token%20Saver%20v35.user.js
// @updateURL https://update.greasyfork.org/scripts/555151/Claude%20Token%20Saver%20v35.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎯 Token Saver v35 - Script loaded!');

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        warningThreshold: 500,
        dangerThreshold: 1000,
        checkInterval: 500,
        fileCheckInterval: 2000,
        statusUpdateDebounce: 2000,
        pastePatterns: [
            '```markdown',
            '```md',
            '# ',
            '## ',
            '### ',
            '---\n',
            '\n\n\n'
        ],
        fileKeywords: [
            'download',
            'computer://',
            '/mnt/user-data/outputs/',
            'view your',
            'file created',
            'saved to'
        ]
    };

    // ==================== STATE MANAGEMENT ====================
    const state = {
        monitoring: {
            isActive: false,
            responseLength: 0,
            hasFileMention: false,
            fileDetectedPermanently: false
        },
        ui: {
            isMaximized: false,
            statusIndicator: null,
            lastStatusType: null,
            lastUpdateTime: 0
        },
        files: {
            detected: [],
            observerActive: false
        },
        drag: {
            panel: {
                active: false,
                x: 0,
                y: 0,
                startX: 0,
                startY: 0
            },
            status: {
                active: false,
                x: 0,
                y: 0,
                startX: 0,
                startY: 0
            }
        }
    };

    // ==================== UTILITY FUNCTIONS ====================
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        copyToClipboard(text, successMessage) {
            console.log('📋 Attempting to copy:', text.substring(0, 100) + '...');

            // Modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        console.log('✅ Copy successful!');
                        statusManager.update('safe', successMessage);
                    })
                    .catch((err) => {
                        console.error('❌ Clipboard API failed:', err);
                        this.fallbackCopy(text, successMessage);
                    });
            } else {
                this.fallbackCopy(text, successMessage);
            }
        },

        fallbackCopy(text, successMessage) {
            // Fallback method using textarea
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                const success = document.execCommand('copy');
                if (success) {
                    console.log('✅ Fallback copy successful!');
                    statusManager.update('safe', successMessage);
                } else {
                    console.error('❌ Fallback copy failed');
                    this.showManualCopy(text);
                }
            } catch (err) {
                console.error('❌ Copy error:', err);
                this.showManualCopy(text);
            } finally {
                document.body.removeChild(textarea);
            }
        },

        showManualCopy(text) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 30px rgba(0,0,0,0.3);
                z-index: 10001;
                max-width: 500px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;

            modal.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 10px; color: #06b6d4;">📋 Copy This Command</div>
                <textarea readonly style="width: 100%; height: 150px; padding: 10px; font-family: monospace; font-size: 11px; border: 1px solid #e2e8f0; border-radius: 6px;">${text}</textarea>
                <button id="close-modal" style="margin-top: 10px; padding: 8px 16px; background: #06b6d4; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Close</button>
            `;

            document.body.appendChild(modal);
            modal.querySelector('textarea').select();

            modal.querySelector('#close-modal').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
    };

    // ==================== STATUS INDICATOR MANAGER ====================
    const statusManager = {
        create() {
            const indicator = document.createElement('div');
            indicator.id = 'workflow-status';
            // v35: Changed default position from top 20px to top 100px to avoid overlap with Usage Tracker
            indicator.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 12px 20px 12px 12px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                display: none;
                cursor: grab;
                user-select: none;
                will-change: transform;
                transition: background-color 0.3s ease;
            `;

            indicator.addEventListener('mousedown', dragManager.statusStart, { passive: false });
            document.body.appendChild(indicator);
            state.ui.statusIndicator = indicator;
            return indicator;
        },

        update(status, message) {
            console.log(`📊 Status update: ${status} - ${message}`);

            if (status === 'safe' && message.includes('File creation detected')) {
                state.monitoring.fileDetectedPermanently = true;
            }

            if (state.monitoring.fileDetectedPermanently && status !== 'safe') {
                return;
            }

            const now = Date.now();
            const timeSinceLastUpdate = now - state.ui.lastUpdateTime;

            if (status === state.ui.lastStatusType && timeSinceLastUpdate < CONFIG.statusUpdateDebounce) {
                return;
            }

            state.ui.lastStatusType = status;
            state.ui.lastUpdateTime = now;

            if (!state.ui.statusIndicator) {
                this.create();
            }

            const indicator = state.ui.statusIndicator;
            indicator.style.display = 'flex';
            indicator.style.alignItems = 'center';
            indicator.style.gap = '8px';

            const statusConfig = {
                safe: { bg: '#10b981', text: '#ffffff', icon: '✓' },
                warning: { bg: '#f59e0b', text: '#ffffff', icon: '⚠' },
                danger: { bg: '#ef4444', text: '#ffffff', icon: '✕' },
                info: { bg: '#06b6d4', text: '#ffffff', icon: 'ℹ' }
            };

            const config = statusConfig[status] || statusConfig.info;
            indicator.style.backgroundColor = config.bg;
            indicator.style.color = config.text;

            indicator.innerHTML = `<span style="flex: 1;">${config.icon} ${message}</span>`;
            indicator.appendChild(this.createCloseButton());
        },

        createCloseButton() {
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                background: rgba(0,0,0,0.2);
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 11px;
                transition: background 0.2s;
            `;
            closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(0,0,0,0.3)');
            closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(0,0,0,0.2)');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
            return closeBtn;
        },

        close() {
            if (state.ui.statusIndicator) {
                state.ui.statusIndicator.style.display = 'none';
            }
        }
    };

    // ==================== DRAG MANAGER (OPTIMIZED) ====================
    const dragManager = {
        panelStart(e) {
            // Skip if clicking on buttons
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }

            // Skip if clicking on clickable file items
            if (e.target.closest('#file-list > div')) {
                return;
            }

            e.preventDefault();

            const panel = document.getElementById('workflow-panel');
            const rect = panel.getBoundingClientRect();

            state.drag.panel.active = true;
            state.drag.panel.startX = e.clientX;
            state.drag.panel.startY = e.clientY;
            state.drag.panel.x = rect.left;
            state.drag.panel.y = rect.top;

            if (panel) {
                panel.style.cursor = 'grabbing';
                panel.style.transition = 'none';
            }
            document.body.style.userSelect = 'none';
        },

        panelMove(e) {
            if (!state.drag.panel.active) return;

            e.preventDefault();

            const deltaX = e.clientX - state.drag.panel.startX;
            const deltaY = e.clientY - state.drag.panel.startY;

            const newX = state.drag.panel.x + deltaX;
            const newY = state.drag.panel.y + deltaY;

            const panel = document.getElementById('workflow-panel');
            if (panel) {
                panel.style.left = newX + 'px';
                panel.style.top = newY + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        },

        panelEnd() {
            if (!state.drag.panel.active) return;

            state.drag.panel.active = false;
            const panel = document.getElementById('workflow-panel');
            if (panel) {
                panel.style.cursor = 'grab';
            }
            document.body.style.userSelect = '';
        },

        statusStart(e) {
            e.preventDefault();
            e.stopPropagation();

            const indicator = state.ui.statusIndicator;
            const rect = indicator.getBoundingClientRect();

            state.drag.status.active = true;
            state.drag.status.startX = e.clientX;
            state.drag.status.startY = e.clientY;
            state.drag.status.x = rect.left;
            state.drag.status.y = rect.top;

            if (indicator) {
                indicator.style.cursor = 'grabbing';
                indicator.style.transition = 'none';
            }
        },

        statusMove(e) {
            if (!state.drag.status.active || !state.ui.statusIndicator) return;

            e.preventDefault();

            const deltaX = e.clientX - state.drag.status.startX;
            const deltaY = e.clientY - state.drag.status.startY;

            const newX = state.drag.status.x + deltaX;
            const newY = state.drag.status.y + deltaY;

            state.ui.statusIndicator.style.left = newX + 'px';
            state.ui.statusIndicator.style.top = newY + 'px';
            state.ui.statusIndicator.style.right = 'auto';
        },

        statusEnd() {
            if (!state.drag.status.active) return;

            state.drag.status.active = false;
            if (state.ui.statusIndicator) {
                state.ui.statusIndicator.style.cursor = 'grab';
            }
        },

        init() {
            document.addEventListener('mousemove', (e) => {
                this.panelMove(e);
                this.statusMove(e);
            }, { passive: false });

            document.addEventListener('mouseup', () => {
                this.panelEnd();
                this.statusEnd();
            });
        }
    };

    // ==================== MONITORING MANAGER ====================
    const monitoringManager = {
        detectPastePattern(text) {
            return CONFIG.pastePatterns.some(pattern => text.includes(pattern));
        },

        detectFileMention(text) {
            return CONFIG.fileKeywords.some(keyword =>
                text.toLowerCase().includes(keyword.toLowerCase())
            );
        },

        checkResponse() {
            const responseElements = document.querySelectorAll('[data-test-render-count]');

            if (responseElements.length === 0) {
                state.monitoring.isActive = false;
                return;
            }

            const latestResponse = responseElements[responseElements.length - 1];
            const responseText = latestResponse.textContent || '';
            state.monitoring.responseLength = responseText.length;

            if (!state.monitoring.hasFileMention) {
                state.monitoring.hasFileMention = this.detectFileMention(responseText);
            }

            if (state.monitoring.hasFileMention) {
                statusManager.update('safe', '✅ File creation detected');
            } else if (state.monitoring.responseLength > CONFIG.dangerThreshold &&
                       this.detectPastePattern(responseText)) {
                statusManager.update('danger', '❌ Paste detected - may timeout');
            } else if (state.monitoring.responseLength > CONFIG.warningThreshold) {
                statusManager.update('warning', `⚠️ ${state.monitoring.responseLength} chars, no file yet`);
            }

            if (state.monitoring.isActive) {
                setTimeout(() => this.checkResponse(), CONFIG.checkInterval);
            }
        },

        start() {
            console.log('🔍 Starting response monitoring...');
            state.monitoring.isActive = true;
            state.monitoring.responseLength = 0;
            state.monitoring.hasFileMention = false;
            state.monitoring.fileDetectedPermanently = false;
            this.checkResponse();
        },

        observeMessages() {
            const observer = new MutationObserver((mutations) => {
                const hasNewResponse = mutations.some(mutation =>
                    Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === 1 && (
                            node.querySelector('[data-test-render-count]') ||
                            node.hasAttribute('data-test-render-count')
                        )
                    )
                );

                if (hasNewResponse && !state.monitoring.isActive) {
                    console.log('🆕 New response detected, starting monitoring');
                    this.start();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('👀 Message observer active');
        }
    };

    // ==================== FILE MANAGER ====================
    const fileManager = {
        detect() {
            const fileElements = document.querySelectorAll(
                '[class*="attachment"], [class*="file"], [data-testid*="file"], a[href*="uploads"]'
            );
            const newFiles = [];

            fileElements.forEach(el => {
                const fileName = el.textContent || el.getAttribute('title') || el.getAttribute('aria-label') || el.getAttribute('href');
                if (fileName && (fileName.includes('.') || fileName.includes('uploads/'))) {
                    const cleanName = fileName.split('/').pop().trim();
                    if (cleanName && cleanName.length > 0) {
                        newFiles.push(cleanName);
                    }
                }
            });

            if (newFiles.length > state.files.detected.length) {
                state.files.detected = [...new Set(newFiles)];
                console.log('📁 Files detected:', state.files.detected);
                this.updateList();
                statusManager.update('info', `📂 ${newFiles.length} file(s) detected`);
            }
        },

        updateList() {
            const listContainer = document.getElementById('file-list');
            if (!listContainer) return;

            if (state.files.detected.length === 0) {
                listContainer.innerHTML = `
                    <div style="color: #64748b; font-size: 10px;">
                        No files detected<br>
                        <small style="opacity: 0.7;">Upload via Claude</small>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = '';
            state.files.detected.forEach((fileName) => {
                const fileDiv = this.createFileItem(fileName);
                listContainer.appendChild(fileDiv);
            });
        },

        createFileItem(fileName) {
            const fileDiv = document.createElement('div');
            fileDiv.style.cssText = `
                background: #ffffff;
                padding: 8px;
                border-radius: 6px;
                margin-bottom: 4px;
                font-size: 11px;
                cursor: pointer;
                border: 1px solid #e2e8f0;
                transition: all 0.2s;
            `;

            fileDiv.addEventListener('mouseenter', () => {
                fileDiv.style.background = '#f1f5f9';
                fileDiv.style.borderColor = '#06b6d4';
            });

            fileDiv.addEventListener('mouseleave', () => {
                fileDiv.style.background = '#ffffff';
                fileDiv.style.borderColor = '#e2e8f0';
            });

            fileDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🖱️ File clicked:', fileName);
                this.copyViewCommand(fileName);
            });

            fileDiv.innerHTML = `
                <div style="font-weight: 600; color: #06b6d4; margin-bottom: 2px;">📄 ${fileName}</div>
                <div style="color: #64748b; font-size: 9px;">Click to copy command</div>
            `;

            return fileDiv;
        },

        copyViewCommand(fileName) {
            const command = `Please use the view tool to read this file:
/mnt/user-data/uploads/${fileName}

Then process it according to my instructions and create a downloadable output file in /mnt/user-data/outputs/ - do NOT paste content in chat.`;

            console.log('📋 Copying command for:', fileName);
            utils.copyToClipboard(command, `✅ Command copied for ${fileName}`);
        },

        scanUploads() {
            const command = `Please use the view tool to scan /mnt/user-data/uploads and tell me what files are there. List their exact names.`;
            console.log('🔍 Copying scan command');
            utils.copyToClipboard(command, '✅ Scan command copied - paste in chat');
        },

        clear() {
            state.files.detected = [];
            this.updateList();
            statusManager.update('info', '🗑️ File list cleared');
        },

        startPeriodicCheck() {
            setInterval(() => this.detect(), CONFIG.fileCheckInterval);
            console.log('⏰ Periodic file check started');
        }
    };

    // ==================== UI MANAGER ====================
    const uiManager = {
        toggleMaximize() {
            const panel = document.getElementById('workflow-panel');
            const maximizeBtn = document.getElementById('maximize-btn');
            const testBtn = document.getElementById('test-status-btn');
            const dragHandle = panel.querySelector('.drag-handle');

            if (!panel || !maximizeBtn) {
                console.error('❌ Panel or button not found!');
                return;
            }

            state.ui.isMaximized = !state.ui.isMaximized;
            console.log('🔄 Toggle maximize:', state.ui.isMaximized);

            const sections = panel.querySelectorAll('.panel-section');
            const bottomDiv = document.getElementById('bottom-buttons');

            sections.forEach((section) => {
                section.style.display = state.ui.isMaximized ? 'flex' : 'none';
            });

            // Enable smooth transitions for size changes
            panel.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                panel.style.transition = 'none';
            }, 300);

            if (state.ui.isMaximized) {
                // Maximized state
                maximizeBtn.textContent = '➖';
                testBtn.style.display = 'block';
                panel.style.width = 'auto';
                panel.style.minWidth = '600px';
                panel.style.maxWidth = '650px';
                panel.style.cursor = 'grab';
                panel.style.padding = '12px';
                dragHandle.style.margin = '-6px -6px 10px -6px';
                bottomDiv.style.flexDirection = 'row';
                bottomDiv.style.gap = '6px';
                bottomDiv.style.marginTop = '10px';
            } else {
                // Minimized state
                maximizeBtn.textContent = '➕';
                testBtn.style.display = 'none';
                panel.style.width = '60px';
                panel.style.minWidth = '60px';
                panel.style.maxWidth = '60px';
                panel.style.cursor = 'grab';
                panel.style.padding = '10px';
                dragHandle.style.margin = '-6px -6px 8px -6px';
                bottomDiv.style.flexDirection = 'column';
                bottomDiv.style.gap = '0';
                bottomDiv.style.marginTop = '8px';
            }
        },

        createButton(config) {
            const btn = document.createElement('button');
            btn.id = config.id;
            btn.textContent = config.text;
            btn.style.cssText = config.style;

            if (config.hover) {
                btn.addEventListener('mouseenter', () => Object.assign(btn.style, config.hover.in));
                btn.addEventListener('mouseleave', () => Object.assign(btn.style, config.hover.out));
            }

            if (config.onClick) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    config.onClick(e);
                });
            }

            return btn;
        },

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #workflow-panel {
                    will-change: auto;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                }
                #file-list::-webkit-scrollbar {
                    width: 4px;
                }
                #file-list::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                #file-list::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 2px;
                }
                #file-list::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `;
            document.head.appendChild(style);
        },

        createPanel() {
            const existingPanel = document.getElementById('workflow-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            this.injectStyles();

            const panel = document.createElement('div');
            panel.id = 'workflow-panel';

            // v35: Changed default position from bottom-right to top-right
            // Start with minimized styles at top right
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 100px;
                background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: #1e293b;
                min-width: 60px;
                max-width: 60px;
                width: 60px;
                cursor: grab;
                border: 2px solid #cbd5e1;
            `;

            // Drag handle
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.style.cssText = `
                font-size: 24px;
                cursor: grab;
                padding: 6px;
                margin: -6px -6px 8px -6px;
                border-radius: 8px;
                text-align: center;
                background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
                transition: all 0.2s;
                color: white;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            dragHandle.innerHTML = '💾';
            dragHandle.addEventListener('mouseenter', () => dragHandle.style.transform = 'scale(1.05)');
            dragHandle.addEventListener('mouseleave', () => dragHandle.style.transform = 'scale(1)');

            // Main content section
            const mainSection = document.createElement('div');
            mainSection.className = 'panel-section';
            mainSection.style.cssText = `
                display: none;
                gap: 10px;
                margin-bottom: 10px;
            `;

            const col1 = this.createFeaturesColumn();
            const col2 = this.createButtonsColumn();
            const col3 = this.createFileListColumn();
            const col4 = this.createHowItWorksColumn();

            mainSection.appendChild(col1);
            mainSection.appendChild(col2);
            mainSection.appendChild(col3);
            mainSection.appendChild(col4);

            const bottomDiv = this.createBottomButtons();
            bottomDiv.style.flexDirection = 'column';
            bottomDiv.style.gap = '0';
            bottomDiv.style.marginTop = '8px';

            panel.appendChild(dragHandle);
            panel.appendChild(mainSection);
            panel.appendChild(bottomDiv);

            document.body.appendChild(panel);

            panel.addEventListener('mousedown', dragManager.panelStart, { passive: false });

            return panel;
        },

        createFeaturesColumn() {
            const col = document.createElement('div');
            col.className = 'panel-section';
            col.style.cssText = `
                flex: 1;
                background: #ffffff;
                padding: 10px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
                display: flex;
                flex-direction: column;
            `;
            col.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 6px; font-size: 11px; color: #06b6d4;">💾 TOKEN SAVING</div>
                <div style="font-size: 10px; line-height: 1.6; color: #334155;">
                    ✓ Prevents pasting<br>
                    ✓ Enforces files<br>
                    ✓ Length monitor<br>
                    ✓ Timeout prevention
                </div>
            `;
            return col;
        },

        createButtonsColumn() {
            const col = document.createElement('div');
            col.className = 'panel-section';
            col.style.cssText = `
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            `;

            const scanBtn = this.createButton({
                id: 'scan-uploads-btn',
                text: '🔍 Scan',
                style: `
                    width: 100%;
                    padding: 8px;
                    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s;
                    box-shadow: 0 2px 6px rgba(6,182,212,0.2);
                `,
                hover: {
                    in: { transform: 'translateY(-1px)', boxShadow: '0 4px 10px rgba(6,182,212,0.3)' },
                    out: { transform: 'translateY(0)', boxShadow: '0 2px 6px rgba(6,182,212,0.2)' }
                },
                onClick: () => {
                    console.log('🔍 Scan button clicked');
                    fileManager.scanUploads();
                }
            });

            const refreshBtn = this.createButton({
                id: 'refresh-files-btn',
                text: '🔄 Refresh',
                style: `
                    width: 100%;
                    padding: 8px;
                    background: #cbd5e1;
                    color: #1e293b;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s;
                `,
                hover: {
                    in: { background: '#94a3b8', color: '#ffffff' },
                    out: { background: '#cbd5e1', color: '#1e293b' }
                },
                onClick: () => {
                    console.log('🔄 Refresh button clicked');
                    fileManager.detect();
                    statusManager.update('info', '🔄 Refreshing file list');
                }
            });

            const clearBtn = this.createButton({
                id: 'clear-files-btn',
                text: '🗑️ Clear',
                style: `
                    width: 100%;
                    padding: 8px;
                    background: #f1f5f9;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s;
                `,
                hover: {
                    in: { background: '#e2e8f0', color: '#334155' },
                    out: { background: '#f1f5f9', color: '#64748b' }
                },
                onClick: () => {
                    console.log('🗑️ Clear button clicked');
                    fileManager.clear();
                }
            });

            col.appendChild(scanBtn);
            col.appendChild(refreshBtn);
            col.appendChild(clearBtn);
            return col;
        },

        createFileListColumn() {
            const col = document.createElement('div');
            col.className = 'panel-section';
            col.style.cssText = `
                flex: 2;
                background: #ffffff;
                padding: 8px;
                border-radius: 6px;
                max-height: 120px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                border: 1px solid #e2e8f0;
            `;
            col.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 6px; font-size: 10px; color: #06b6d4;">📂 DETECTED FILES</div>
                <div id="file-list">
                    <div style="color: #64748b; font-size: 10px;">
                        No files detected<br>
                        <small style="opacity: 0.7;">Upload via Claude</small>
                    </div>
                </div>
            `;
            return col;
        },

        createHowItWorksColumn() {
            const col = document.createElement('div');
            col.className = 'panel-section';
            col.style.cssText = `
                flex: 1;
                background: #ffffff;
                padding: 8px;
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                border: 1px solid #e2e8f0;
            `;
            col.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 5px; font-size: 10px; color: #06b6d4;">ℹ️ HOW IT WORKS</div>
                <div style="font-size: 9px; line-height: 1.5; color: #64748b;">
                    1. Upload files<br>
                    2. Click "Scan"<br>
                    3. Click file to copy<br>
                    4. Paste in chat<br>
                    5. Auto-monitoring
                </div>
            `;
            return col;
        },

        createBottomButtons() {
            const bottomDiv = document.createElement('div');
            bottomDiv.id = 'bottom-buttons';
            bottomDiv.style.cssText = 'display: flex; flex-direction: row; gap: 6px; margin-top: 10px;';

            const testBtn = this.createButton({
                id: 'test-status-btn',
                text: '🧪 Test',
                style: `
                    flex: 1;
                    padding: 8px;
                    background: #cbd5e1;
                    color: #1e293b;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 600;
                    transition: all 0.2s;
                    display: none;
                `,
                hover: {
                    in: { background: '#94a3b8', color: '#ffffff' },
                    out: { background: '#cbd5e1', color: '#1e293b' }
                },
                onClick: () => {
                    console.log('🧪 Test button clicked');
                    statusManager.update('warning', '⚠️ Test warning');
                    setTimeout(() => statusManager.update('safe', '✅ Test passed'), 2000);
                }
            });

            const maximizeBtn = this.createButton({
                id: 'maximize-btn',
                text: '➕',
                style: `
                    flex: 1;
                    padding: 8px;
                    background: #cbd5e1;
                    color: #1e293b;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 600;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `,
                hover: {
                    in: { background: '#94a3b8', color: '#ffffff' },
                    out: { background: '#cbd5e1', color: '#1e293b' }
                },
                onClick: () => this.toggleMaximize()
            });

            bottomDiv.appendChild(testBtn);
            bottomDiv.appendChild(maximizeBtn);
            return bottomDiv;
        }
    };

    // ==================== PROMPT INJECTION ====================
    const promptInjector = {
        enhance() {
            const observer = new MutationObserver(() => {
                const textareas = document.querySelectorAll('textarea, [contenteditable="true"]');

                textareas.forEach(textarea => {
                    if (textarea.dataset.workflowEnhanced) return;
                    textarea.dataset.workflowEnhanced = 'true';

                    textarea.addEventListener('keydown', (e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            const currentText = textarea.value || textarea.textContent || '';

                            if (!currentText.includes('downloadable file') && currentText.length > 100) {
                                const reminder = '\n\n⚠️ CRITICAL: Create downloadable file only, do NOT paste content in chat. Save to /mnt/user-data/outputs/';

                                if (textarea.value !== undefined) {
                                    textarea.value = currentText + reminder;
                                } else {
                                    textarea.textContent = currentText + reminder;
                                }
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            console.log('✉️ Prompt injector active');
        }
    };

    // ==================== INITIALIZATION ====================
    function init() {
        console.log('🚀 Token Saver v35 initializing...');

        try {
            dragManager.init();
            uiManager.createPanel();
            promptInjector.enhance();
            monitoringManager.observeMessages();
            fileManager.startPeriodicCheck();
            fileManager.detect();

            statusManager.update('safe', '✅ Token Saver v35 ready');
            console.log('✅ Token Saver v35 initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(() => {
        if (!document.getElementById('workflow-panel')) {
            console.log('🔄 Retrying initialization...');
            init();
        }
    }, 1000);

})();