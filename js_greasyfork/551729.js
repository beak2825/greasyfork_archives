// ==UserScript==
// @name         Ultimate Hand History Collector - v0.7.1
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  Added pagination, import JSON, help guide, removed 10-message validation
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551729/Ultimate%20Hand%20History%20Collector%20-%20v071.user.js
// @updateURL https://update.greasyfork.org/scripts/551729/Ultimate%20Hand%20History%20Collector%20-%20v071.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // GLOBAL STATE
    // ============================================
    let db = null;
    let messageBoxObserver = null;
    let handCounter = 0;

    const handState = {
        current: null,
        isCollecting: false,
        lastCompleted: null,
        collectionStartTime: 0
    };

    // UI State
    let handMetadataList = [];  // All hand metadata (light objects)
    let metadataOffset = 0;      // Current page start index
    let currentPageHands = [];   // Full hand data for current page
    let historyIndex = -1;       // Index within currentPageHands
    let tagInputVisible = false;
    let pendingTagHandId = null;
    const PAGE_SIZE = 50;

    // UI Preferences
    let uiPreferences = {
        width: 450,
        height: 600,
        fontSize: 'medium',
        opacity: 1.0,
        position: { top: 20, right: 20 }
    };

    // ============================================
    // VALIDATION FUNCTIONS
    // ============================================

    function validateHand(hand) {
        const warnings = [];

        // Check 1: Winner message in last message
        if (hand.messages.length > 0) {
            const lastMsg = hand.messages[hand.messages.length - 1];
            const hasWinner = lastMsg.text.includes('won') && lastMsg.text.includes('$');

            if (!hasWinner) {
                warnings.push('No winner message found');
            }
        }

        // Check 2: Hand structure - first message should be Game started
        if (hand.messages.length > 0) {
            const firstMsg = hand.messages[0];
            if (!firstMsg.text.includes('Game') || !firstMsg.text.includes('started')) {
                warnings.push('Hand does not start with "Game X started"');
            }
        }

        // Check 3: Should have "The preflop" message
        const hasPreflop = hand.messages.some(msg => msg.text.includes('The preflop'));
        if (!hasPreflop) {
            warnings.push('Missing "The preflop" message');
        }

        return warnings;
    }

    function logHandWarnings(hand, warnings) {
        if (warnings.length > 0) {
            console.warn(`⚠️ Hand #${hand.handNumber} validation warnings:`);
            warnings.forEach(warning => {
                console.warn(`   - ${warning}`);
            });
        }
    }

    // ============================================
    // UI PREFERENCES
    // ============================================

    function loadUIPreferences() {
        try {
            const saved = localStorage.getItem('pokerHistoryUIPrefs');
            if (saved) {
                uiPreferences = { ...uiPreferences, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Failed to load UI preferences:', error);
        }
    }

    function saveUIPreferences() {
        try {
            localStorage.setItem('pokerHistoryUIPrefs', JSON.stringify(uiPreferences));
        } catch (error) {
            console.error('Failed to save UI preferences:', error);
        }
    }

    function applyUIPreferences() {
        const panel = document.getElementById('handHistoryPanel');
        if (!panel) return;

        panel.style.width = uiPreferences.width + 'px';
        panel.style.height = uiPreferences.height + 'px';
        panel.style.opacity = uiPreferences.opacity;

        if (uiPreferences.position.top !== undefined) {
            panel.style.top = uiPreferences.position.top + 'px';
            panel.style.right = uiPreferences.position.right + 'px';
        }

        panel.className = `hh-panel font-${uiPreferences.fontSize}`;
    }

    // ============================================
    // UI CREATION
    // ============================================

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'handHistoryPanel';
        panel.className = 'hh-panel font-medium';
        panel.innerHTML = `
            <div class="hh-header" id="hhHeader">
                <span class="hh-title">Hand History Collector</span>
                <div class="hh-controls">
                    <button class="hh-btn hh-btn-help" id="hhHelp" title="Help">?</button>
                    <button class="hh-btn hh-btn-settings" id="hhSettings" title="Settings">⚙</button>
                    <button class="hh-btn hh-btn-minimize" id="hhMinimize" title="Minimize">−</button>
                </div>
            </div>
            <div class="hh-content" id="hhContent">
                <div class="hh-settings-panel" id="hhSettingsPanel" style="display: none;">
                    <div class="hh-setting-row">
                        <label>Font Size:</label>
                        <select id="hhFontSize" class="hh-select">
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <div class="hh-setting-row">
                        <label>Opacity:</label>
                        <input type="range" id="hhOpacity" class="hh-slider" min="0.3" max="1" step="0.1" value="1">
                        <span id="hhOpacityValue">100%</span>
                    </div>
                    <div class="hh-setting-row">
                        <label>Database:</label>
                        <span id="hhDbSize" class="hh-db-size">Calculating...</span>
                    </div>
                    <div class="hh-setting-actions">
                        <button class="hh-btn hh-btn-import" id="hhImportDb">Import JSON</button>
                        <button class="hh-btn hh-btn-export" id="hhExportDb">Export JSON</button>
                        <button class="hh-btn hh-btn-danger" id="hhDeleteDb">Delete All</button>
                        <button class="hh-btn hh-btn-health" id="hhHealthCheck">Health Check</button>
                    </div>
                    <input type="file" id="hhImportFileInput" accept=".json" style="display: none;">
                </div>
                <div class="hh-status" id="hhStatus">
                    <div class="hh-status-text">Loading...</div>
                </div>
                <div class="hh-nav" id="hhNav">
                    <button class="hh-btn hh-btn-nav" id="hhPrev" title="Previous Hand">◄</button>
                    <span class="hh-nav-label" id="hhNavLabel">No hands yet</span>
                    <button class="hh-btn hh-btn-nav" id="hhNext" title="Next Hand">►</button>
                    <button class="hh-btn hh-btn-refresh" id="hhRefresh" title="Refresh">⟳</button>
                    <button class="hh-btn hh-btn-copy" id="hhCopy" title="Copy Hand">📋</button>
                    <button class="hh-btn hh-btn-tag" id="hhTagHand" title="Tag This Hand">🏷️</button>
                    <button class="hh-btn hh-btn-delete" id="hhDeleteHand" title="Delete This Hand">🗑</button>
                </div>
                <div class="hh-pagination" id="hhPagination" style="display: none;">
                    <button class="hh-btn hh-btn-page" id="hhPrevPage">← Previous 50</button>
                    <span class="hh-page-info" id="hhPageInfo">Page 1</span>
                    <button class="hh-btn hh-btn-page" id="hhNextPage">Next 50 →</button>
                </div>
                <div class="hh-warnings" id="hhWarnings" style="display: none;">
                    <!-- Warnings will be inserted here -->
                </div>
                <div class="hh-tags" id="hhTags" style="display: none;">
                    <!-- Tags will be inserted here -->
                </div>
                <div class="hh-tag-input" id="hhTagInput" style="display: none;">
                    <input type="text" id="hhTagInputField" placeholder="Enter tag (e.g. 'bluff situation')" />
                    <button class="hh-btn hh-btn-add-tag" id="hhAddTagBtn">Add Tag</button>
                    <button class="hh-btn hh-btn-cancel" id="hhCancelTagBtn">Cancel</button>
                </div>
                <div class="hh-metadata" id="hhMetadata">
                    <!-- Metadata will be inserted here -->
                </div>
                <div class="hh-messages" id="hhMessages">
                    <div class="hh-no-data">No hands stored yet</div>
                </div>
            </div>
            <div class="hh-resize-handle" id="hhResizeHandle"></div>
        `;

        document.body.appendChild(panel);

        // Create help modal
        const helpModal = document.createElement('div');
        helpModal.id = 'hhHelpModal';
        helpModal.className = 'hh-modal';
        helpModal.style.display = 'none';
        helpModal.innerHTML = `
            <div class="hh-modal-content">
                <div class="hh-modal-header">
                    <span class="hh-modal-title">How to Use Hand History Collector</span>
                    <button class="hh-btn hh-btn-close" id="hhHelpClose">×</button>
                </div>
                <div class="hh-modal-body">
                    <h3>📊 Automatic Collection</h3>
                    <p>Simply play poker - hands are automatically collected and saved to your browser's database.</p>

                    <h3>💾 Backup Workflow</h3>
                    <p><strong>Weekly/Monthly:</strong> Click <strong>Settings ⚙</strong> → <strong>Export JSON</strong> to create a backup file.</p>
                    <p>Store these backup files safely on your computer.</p>

                    <h3>📥 Importing Old Hands</h3>
                    <p>To recover from a database clear or restore old hands:</p>
                    <p>Click <strong>Settings ⚙</strong> → <strong>Import JSON</strong> → Select your backup file</p>
                    <p><em>Duplicate hands are automatically skipped - no duplicates will be created.</em></p>

                    <h3>🔍 Reviewing Hands</h3>
                    <p>Use <strong>◄ Previous</strong> and <strong>Next ►</strong> buttons to navigate</p>
                    <p>Use <strong>← Previous 50</strong> and <strong>Next 50 →</strong> to load more pages of hands</p>
                    <p>Click <strong>🏷️</strong> to add custom tags for future searching</p>
                    <p>Click <strong>📋</strong> to copy hand text to clipboard</p>

                    <h3>🗑️ Cleaning Up</h3>
                    <p><strong>Delete This Hand:</strong> Remove individual bad/incomplete hands</p>
                    <p><strong>Delete All:</strong> Clear entire database (requires double confirmation)</p>

                    <h3>🏥 Health Check</h3>
                    <p>Scans all hands for validation warnings - check console for detailed report</p>

                    <h3>💡 Pro Tips</h3>
                    <p>• Database persists between sessions - hands are never lost unless you clear browser data</p>
                    <p>• Export backups before major browser updates or clearing cache</p>
                    <p>• Tags are searchable using the separate Hand History Search Tool</p>
                </div>
            </div>
        `;
        document.body.appendChild(helpModal);

        injectStyles();
        loadUIPreferences();
        applyUIPreferences();
        setupEventListeners();

        console.log('UI panel created');
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .hh-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #e4e4e4;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                resize: none;
                min-width: 350px;
                min-height: 400px;
                max-width: 90vw;
                max-height: 90vh;
            }

            .hh-panel.minimized {
                height: 50px !important;
                min-height: 50px !important;
                max-height: 50px !important;
            }

            .hh-panel.minimized .hh-content {
                display: none !important;
            }

            .hh-panel.minimized .hh-resize-handle {
                display: none !important;
            }

            .hh-header {
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
                border-radius: 8px 8px 0 0;
            }

            .hh-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .hh-controls {
                display: flex;
                gap: 5px;
            }

            .hh-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #e4e4e4;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }

            .hh-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .hh-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .hh-btn-minimize, .hh-btn-settings, .hh-btn-help {
                min-width: 24px;
                font-weight: bold;
            }

            .hh-btn-help {
                background: rgba(59, 130, 246, 0.3);
                color: #93c5fd;
            }

            .hh-btn-help:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .hh-btn-refresh, .hh-btn-delete {
                font-size: 16px;
            }

            .hh-btn-danger {
                background: rgba(239, 68, 68, 0.3);
                color: #fca5a5;
            }

            .hh-btn-danger:hover {
                background: rgba(239, 68, 68, 0.5);
            }

            .hh-btn-import {
                background: rgba(59, 130, 246, 0.3);
                color: #93c5fd;
            }

            .hh-btn-import:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .hh-btn-export, .hh-btn-health {
                background: rgba(52, 211, 153, 0.3);
                color: #6ee7b7;
            }

            .hh-btn-export:hover, .hh-btn-health:hover {
                background: rgba(52, 211, 153, 0.5);
            }

            .hh-btn-delete {
                background: rgba(239, 68, 68, 0.2);
            }

            .hh-btn-delete:hover {
                background: rgba(239, 68, 68, 0.4);
            }

            .hh-content {
                display: flex;
                flex-direction: column;
                padding: 15px;
                overflow: hidden;
                flex: 1;
            }

            .hh-settings-panel {
                background: rgba(0, 0, 0, 0.3);
                padding: 12px;
                margin-bottom: 12px;
                border-radius: 6px;
                border: 1px solid #0f3460;
            }

            .hh-setting-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .hh-setting-row label {
                min-width: 80px;
                font-size: 12px;
                color: #94a3b8;
            }

            .hh-select {
                flex: 1;
                padding: 4px 8px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                color: #e4e4e4;
                font-size: 12px;
                cursor: pointer;
            }

            .hh-slider {
                flex: 1;
                cursor: pointer;
            }

            .hh-db-size {
                flex: 1;
                font-size: 12px;
                color: #e4e4e4;
            }

            .hh-setting-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
                flex-wrap: wrap;
            }

            .hh-status {
                background: rgba(251, 191, 36, 0.2);
                border-left: 3px solid #fbbf24;
                padding: 10px;
                margin-bottom: 12px;
                border-radius: 4px;
            }

            .hh-status-text {
                font-size: 13px;
                font-weight: 500;
            }

            .hh-warnings {
                background: rgba(239, 68, 68, 0.2);
                border-left: 3px solid #ef4444;
                padding: 10px;
                margin-bottom: 12px;
                border-radius: 4px;
            }

            .hh-warning-item {
                font-size: 12px;
                color: #fca5a5;
                margin: 3px 0;
            }

            .hh-tags {
                background: rgba(147, 51, 234, 0.2);
                border-left: 3px solid #a855f7;
                padding: 10px;
                margin-bottom: 12px;
                border-radius: 4px;
            }

            .hh-tag-item {
                display: inline-block;
                background: rgba(147, 51, 234, 0.3);
                color: #e9d5ff;
                padding: 4px 8px;
                margin: 2px;
                border-radius: 4px;
                font-size: 11px;
                border: 1px solid #a855f7;
            }

            .hh-tag-input {
                background: rgba(147, 51, 234, 0.2);
                border: 1px solid #a855f7;
                padding: 12px;
                margin-bottom: 12px;
                border-radius: 6px;
            }

            .hh-tag-input input {
                width: 100%;
                padding: 8px;
                margin-bottom: 8px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #a855f7;
                border-radius: 4px;
                color: #e4e4e4;
                font-size: 12px;
            }

            .hh-btn-add-tag {
                background: rgba(147, 51, 234, 0.5);
                margin-right: 5px;
            }

            .hh-btn-add-tag:hover {
                background: rgba(147, 51, 234, 0.7);
            }

            .hh-btn-cancel {
                background: rgba(100, 100, 100, 0.5);
            }

            .hh-btn-cancel:hover {
                background: rgba(100, 100, 100, 0.7);
            }

            .hh-btn-tag {
                background: rgba(147, 51, 234, 0.3);
            }

            .hh-btn-tag:hover {
                background: rgba(147, 51, 234, 0.5);
            }

            .hh-nav {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
            }

            .hh-btn-nav {
                padding: 6px 12px;
                font-weight: bold;
            }

            .hh-btn-copy {
                margin-left: auto;
            }

            .hh-nav-label {
                flex: 1;
                text-align: center;
                font-size: 12px;
                font-weight: 500;
                color: #94a3b8;
            }

            .hh-pagination {
                display: flex;
                gap: 10px;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
            }

            .hh-btn-page {
                padding: 6px 12px;
                font-size: 12px;
                background: rgba(59, 130, 246, 0.3);
                color: #93c5fd;
            }

            .hh-btn-page:hover:not(:disabled) {
                background: rgba(59, 130, 246, 0.5);
            }

            .hh-page-info {
                font-size: 12px;
                color: #94a3b8;
                font-weight: 500;
            }

            .hh-metadata {
                background: rgba(0, 0, 0, 0.2);
                padding: 10px;
                margin-bottom: 12px;
                border-radius: 6px;
                font-size: 12px;
            }

            .hh-meta-row {
                display: flex;
                justify-content: space-between;
                margin: 4px 0;
                padding: 2px 0;
            }

            .hh-meta-label {
                color: #94a3b8;
            }

            .hh-meta-value {
                color: #e4e4e4;
                font-weight: 500;
            }

            .hh-meta-cards {
                color: #34d399;
                font-weight: bold;
            }

            .hh-messages {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 6px;
                padding: 10px;
                overflow-y: auto;
                flex: 1;
            }

            .hh-no-data {
                text-align: center;
                color: #94a3b8;
                padding: 20px;
                font-size: 13px;
            }

            .hh-message {
                margin: 3px 0;
                padding: 4px 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
                line-height: 1.4;
                border-left: 2px solid #0f3460;
            }

            .hh-message-seq {
                color: #e94560;
                font-weight: bold;
                margin-right: 6px;
            }

            .hh-message-text {
                color: #cbd5e1;
            }

            .hh-resize-handle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: nwse-resize;
                background: linear-gradient(135deg, transparent 50%, #0f3460 50%);
            }

            /* Modal styles */
            .hh-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1000000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .hh-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                width: 600px;
                max-width: 90vw;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
            }

            .hh-modal-header {
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }

            .hh-modal-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .hh-btn-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #e4e4e4;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 20px;
                line-height: 1;
            }

            .hh-btn-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .hh-modal-body {
                padding: 20px;
                overflow-y: auto;
                color: #e4e4e4;
            }

            .hh-modal-body h3 {
                color: #e94560;
                margin: 15px 0 8px 0;
                font-size: 14px;
            }

            .hh-modal-body h3:first-child {
                margin-top: 0;
            }

            .hh-modal-body p {
                margin: 6px 0;
                font-size: 13px;
                line-height: 1.5;
                color: #cbd5e1;
            }

            .hh-modal-body strong {
                color: #34d399;
            }

            .hh-modal-body em {
                color: #94a3b8;
                font-style: italic;
            }

            /* Font sizes */
            .font-small .hh-message {
                font-size: 10px;
            }

            .font-small .hh-message-seq {
                font-size: 9px;
            }

            .font-medium .hh-message {
                font-size: 12px;
            }

            .font-medium .hh-message-seq {
                font-size: 11px;
            }

            .font-large .hh-message {
                font-size: 14px;
            }

            .font-large .hh-message-seq {
                font-size: 13px;
            }

            /* Scrollbar styling */
            .hh-messages::-webkit-scrollbar, .hh-modal-body::-webkit-scrollbar {
                width: 8px;
            }

            .hh-messages::-webkit-scrollbar-track, .hh-modal-body::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .hh-messages::-webkit-scrollbar-thumb, .hh-modal-body::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 4px;
            }

            .hh-messages::-webkit-scrollbar-thumb:hover, .hh-modal-body::-webkit-scrollbar-thumb:hover {
                background: rgba(233, 69, 96, 0.7);
            }
        `;
        document.head.appendChild(style);
    }

    function setupEventListeners() {
        const panel = document.getElementById('handHistoryPanel');
        const header = document.getElementById('hhHeader');
        const minimizeBtn = document.getElementById('hhMinimize');
        const settingsBtn = document.getElementById('hhSettings');
        const helpBtn = document.getElementById('hhHelp');
        const prevBtn = document.getElementById('hhPrev');
        const nextBtn = document.getElementById('hhNext');
        const refreshBtn = document.getElementById('hhRefresh');
        const copyBtn = document.getElementById('hhCopy');
        const deleteHandBtn = document.getElementById('hhDeleteHand');
        const tagHandBtn = document.getElementById('hhTagHand');
        const resizeHandle = document.getElementById('hhResizeHandle');

        // Pagination buttons
        const prevPageBtn = document.getElementById('hhPrevPage');
        const nextPageBtn = document.getElementById('hhNextPage');

        // Tag input elements
        const tagInput = document.getElementById('hhTagInput');
        const tagInputField = document.getElementById('hhTagInputField');
        const addTagBtn = document.getElementById('hhAddTagBtn');
        const cancelTagBtn = document.getElementById('hhCancelTagBtn');

        // Settings elements
        const settingsPanel = document.getElementById('hhSettingsPanel');
        const fontSizeSelect = document.getElementById('hhFontSize');
        const opacitySlider = document.getElementById('hhOpacity');
        const opacityValue = document.getElementById('hhOpacityValue');
        const importBtn = document.getElementById('hhImportDb');
        const exportBtn = document.getElementById('hhExportDb');
        const deleteBtn = document.getElementById('hhDeleteDb');
        const healthCheckBtn = document.getElementById('hhHealthCheck');
        const importFileInput = document.getElementById('hhImportFileInput');

        // Help modal
        const helpModal = document.getElementById('hhHelpModal');
        const helpCloseBtn = document.getElementById('hhHelpClose');

        // Dragging functionality
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            if (e.target === minimizeBtn || e.target === settingsBtn || e.target === helpBtn ||
                e.target === copyBtn || e.target === refreshBtn) return;

            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            const newLeft = Math.max(0, Math.min(x, maxX));
            const newTop = Math.max(0, Math.min(y, maxY));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';

            uiPreferences.position = {
                top: newTop,
                right: window.innerWidth - newLeft - panel.offsetWidth
            };
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                saveUIPreferences();
            }
        });

        // Resize functionality
        let isResizing = false;
        let resizeStart = { x: 0, y: 0, width: 0, height: 0 };

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeStart.x = e.clientX;
            resizeStart.y = e.clientY;
            resizeStart.width = panel.offsetWidth;
            resizeStart.height = panel.offsetHeight;
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;

            const newWidth = Math.max(350, Math.min(resizeStart.width + deltaX, window.innerWidth * 0.9));
            const newHeight = Math.max(400, Math.min(resizeStart.height + deltaY, window.innerHeight * 0.9));

            panel.style.width = newWidth + 'px';
            panel.style.height = newHeight + 'px';

            uiPreferences.width = newWidth;
            uiPreferences.height = newHeight;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                saveUIPreferences();
            }
        });

        // Minimize button
        minimizeBtn.addEventListener('click', () => {
            panel.classList.toggle('minimized');
            minimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
        });

        // Settings toggle
        settingsBtn.addEventListener('click', () => {
            const isVisible = settingsPanel.style.display !== 'none';
            settingsPanel.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                updateDatabaseSize();
            }
        });

        // Help modal
        helpBtn.addEventListener('click', () => {
            helpModal.style.display = 'flex';
        });

        helpCloseBtn.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });

        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
            }
        });

        // Font size
        fontSizeSelect.value = uiPreferences.fontSize;
        fontSizeSelect.addEventListener('change', (e) => {
            uiPreferences.fontSize = e.target.value;
            panel.className = `hh-panel font-${uiPreferences.fontSize}`;
            saveUIPreferences();
        });

        // Opacity
        opacitySlider.value = uiPreferences.opacity;
        opacityValue.textContent = Math.round(uiPreferences.opacity * 100) + '%';
        opacitySlider.addEventListener('input', (e) => {
            const opacity = parseFloat(e.target.value);
            uiPreferences.opacity = opacity;
            panel.style.opacity = opacity;
            opacityValue.textContent = Math.round(opacity * 100) + '%';
            saveUIPreferences();
        });

        // Database management
        importBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', handleImportJSON);
        exportBtn.addEventListener('click', exportDatabase);
        deleteBtn.addEventListener('click', deleteDatabase);
        healthCheckBtn.addEventListener('click', performHealthCheck);

        // Navigation buttons
        prevBtn.addEventListener('click', navigatePrevious);
        nextBtn.addEventListener('click', navigateNext);
        refreshBtn.addEventListener('click', refreshHistory);
        copyBtn.addEventListener('click', copyCurrentHand);
        deleteHandBtn.addEventListener('click', deleteCurrentHand);
        tagHandBtn.addEventListener('click', showTagInput);

        // Pagination buttons
        prevPageBtn.addEventListener('click', loadPreviousPage);
        nextPageBtn.addEventListener('click', loadNextPage);

        // Tag input handlers
        addTagBtn.addEventListener('click', addTagToCurrentHand);
        cancelTagBtn.addEventListener('click', hideTagInput);
        tagInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTagToCurrentHand();
            }
        });
    }

    // ============================================
    // PAGINATION FUNCTIONS
    // ============================================

    async function loadHandMetadata() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const index = store.index("startTime");

            const metadata = [];
            const request = index.openCursor(null, "prev");

            request.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    metadata.push({
                        autoId: cursor.primaryKey,
                        handNumber: cursor.value.handNumber,
                        handId: cursor.value.handId,
                        startTime: cursor.value.startTime,
                        tags: cursor.value.tags || []
                    });
                    cursor.continue();
                } else {
                    resolve(metadata);
                }
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    async function loadHandByAutoId(autoId) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.get(autoId);

            request.onsuccess = function() {
                if (request.result) {
                    resolve({ ...request.result, autoId: autoId });
                } else {
                    resolve(null);
                }
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    async function loadCurrentPage() {
        const startIdx = metadataOffset;
        const endIdx = Math.min(metadataOffset + PAGE_SIZE, handMetadataList.length);
        const pageMetadata = handMetadataList.slice(startIdx, endIdx);

        currentPageHands = [];
        for (const meta of pageMetadata) {
            const hand = await loadHandByAutoId(meta.autoId);
            if (hand) {
                currentPageHands.push(hand);
            }
        }

        historyIndex = currentPageHands.length > 0 ? 0 : -1;
        updatePaginationUI();
        updateUI();
    }

    async function loadNextPage() {
        if (metadataOffset + PAGE_SIZE >= handMetadataList.length) {
            return;
        }

        metadataOffset += PAGE_SIZE;
        await loadCurrentPage();
    }

    async function loadPreviousPage() {
        if (metadataOffset <= 0) {
            return;
        }

        metadataOffset = Math.max(0, metadataOffset - PAGE_SIZE);
        await loadCurrentPage();
    }

    function updatePaginationUI() {
        const paginationDiv = document.getElementById('hhPagination');
        const pageInfo = document.getElementById('hhPageInfo');
        const prevPageBtn = document.getElementById('hhPrevPage');
        const nextPageBtn = document.getElementById('hhNextPage');

        if (handMetadataList.length === 0) {
            paginationDiv.style.display = 'none';
            return;
        }

        if (handMetadataList.length <= PAGE_SIZE) {
            paginationDiv.style.display = 'none';
            return;
        }

        paginationDiv.style.display = 'flex';

        const currentPage = Math.floor(metadataOffset / PAGE_SIZE) + 1;
        const totalPages = Math.ceil(handMetadataList.length / PAGE_SIZE);
        const startHand = metadataOffset + 1;
        const endHand = Math.min(metadataOffset + PAGE_SIZE, handMetadataList.length);

        pageInfo.textContent = `Page ${currentPage}/${totalPages} (Hands ${startHand}-${endHand} of ${handMetadataList.length})`;

        prevPageBtn.disabled = metadataOffset <= 0;
        nextPageBtn.disabled = metadataOffset + PAGE_SIZE >= handMetadataList.length;
    }

    // ============================================
    // DATABASE MANAGEMENT
    // ============================================

    async function updateDatabaseSize() {
        const dbSizeSpan = document.getElementById('hhDbSize');
        try {
            const count = await getHandCount();
            const allHands = await loadAllHands();
            const sizeBytes = new Blob([JSON.stringify(allHands)]).size;
            const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
            dbSizeSpan.textContent = `${count} hands (${sizeMB} MB)`;
        } catch (error) {
            dbSizeSpan.textContent = 'Error calculating size';
            console.error('Failed to calculate database size:', error);
        }
    }

    async function handleImportJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            if (!importData.hands || !Array.isArray(importData.hands)) {
                throw new Error('Invalid file format: missing hands array');
            }

            console.log(`📥 Import file contains ${importData.hands.length} hands`);

            const existingHands = await loadAllHands();
            const existingHandIds = new Set(existingHands.map(h => h.handId));

            let imported = 0;
            let duplicates = 0;

            for (const hand of importData.hands) {
                if (existingHandIds.has(hand.handId)) {
                    duplicates++;
                    continue;
                }

                await saveHandToDB(hand);
                imported++;
            }

            console.log(`✅ Import complete: ${imported} new, ${duplicates} duplicates`);

            alert(
                `Import Complete!\n\n` +
                `New hands added: ${imported}\n` +
                `Duplicates skipped: ${duplicates}\n` +
                `Total in database: ${existingHands.length + imported}`
            );

            await refreshHistory();

        } catch (error) {
            console.error('Import failed:', error);
            alert(`Import failed: ${error.message}`);
        } finally {
            event.target.value = '';
        }
    }

    async function exportDatabase() {
        try {
            const allHands = await loadAllHands();
            const exportData = {
                version: '0.7.0',
                exportDate: new Date().toISOString(),
                handCount: allHands.length,
                hands: allHands
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `poker-history-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log(`Exported ${allHands.length} hands`);
        } catch (error) {
            console.error('Failed to export database:', error);
            alert('Failed to export database. Check console for details.');
        }
    }

    async function deleteDatabase() {
        const count = await getHandCount();

        if (count === 0) {
            alert('Database is already empty.');
            return;
        }

        const confirmed = confirm(
            `Are you sure you want to delete ALL ${count} hands?\n\n` +
            `This action cannot be undone.\n\n` +
            `Consider exporting to JSON first as a backup.`
        );

        if (!confirmed) return;

        const doubleConfirm = confirm(
            `Final confirmation: Delete ${count} hands permanently?`
        );

        if (!doubleConfirm) return;

        try {
            await clearAllHands();
            handCounter = 0;
            handMetadataList = [];
            metadataOffset = 0;
            currentPageHands = [];
            historyIndex = -1;
            updateUI();
            updatePaginationUI();
            updateDatabaseSize();
            console.log(`Deleted ${count} hands from database`);
            alert('Database cleared successfully.');
        } catch (error) {
            console.error('Failed to delete database:', error);
            alert('Failed to delete database. Check console for details.');
        }
    }

    async function deleteCurrentHand() {
        if (currentPageHands.length === 0 || historyIndex < 0) {
            alert('No hand selected to delete.');
            return;
        }

        const hand = currentPageHands[historyIndex];

        const confirmed = confirm(
            `Delete Hand #${hand.handNumber}?\n\n` +
            `This action cannot be undone.\n` +
            `Consider exporting this hand first as a backup.`
        );

        if (!confirmed) return;

        try {
            await deleteHandFromDB(hand.autoId);
            console.log(`Deleted Hand #${hand.handNumber} from database`);

            await refreshHistory();

            alert(`Hand #${hand.handNumber} deleted successfully.`);
        } catch (error) {
            console.error('Failed to delete hand:', error);
            alert('Failed to delete hand. Check console for details.');
        }
    }

    async function performHealthCheck() {
        console.log('🏥 Starting health check...');

        try {
            const allHands = await loadAllHands();
            let problematicHands = [];

            allHands.forEach(hand => {
                const warnings = validateHand(hand);
                if (warnings.length > 0) {
                    problematicHands.push({
                        handNumber: hand.handNumber,
                        handId: hand.handId,
                        warnings: warnings
                    });
                }
            });

            console.log(`\n📊 Health Check Results:`);
            console.log(`Total hands: ${allHands.length}`);
            console.log(`Problematic hands: ${problematicHands.length}`);

            if (problematicHands.length > 0) {
                console.log(`\n⚠️ Hands with issues:`);
                problematicHands.forEach(hand => {
                    console.log(`\n  Hand #${hand.handNumber}:`);
                    hand.warnings.forEach(warning => {
                        console.log(`    - ${warning}`);
                    });
                });
            } else {
                console.log(`\n✅ All hands look good!`);
            }

            alert(
                `Health Check Complete\n\n` +
                `Total hands: ${allHands.length}\n` +
                `Problematic hands: ${problematicHands.length}\n\n` +
                `Check console for details.`
            );
        } catch (error) {
            console.error('Health check failed:', error);
            alert('Health check failed. Check console for details.');
        }
    }

    // ============================================
    // TAGGING FUNCTIONS
    // ============================================

    function showTagInput() {
        if (currentPageHands.length === 0 || historyIndex < 0) {
            alert('No hand selected to tag.');
            return;
        }

        const hand = currentPageHands[historyIndex];
        pendingTagHandId = hand.autoId;

        const tagInput = document.getElementById('hhTagInput');
        const tagInputField = document.getElementById('hhTagInputField');

        tagInput.style.display = 'block';
        tagInputField.value = '';
        tagInputField.focus();
    }

    function hideTagInput() {
        const tagInput = document.getElementById('hhTagInput');
        const tagInputField = document.getElementById('hhTagInputField');

        tagInput.style.display = 'none';
        tagInputField.value = '';
        pendingTagHandId = null;
    }

    async function addTagToCurrentHand() {
        const tagInputField = document.getElementById('hhTagInputField');
        const tagText = tagInputField.value.trim();

        if (!tagText) {
            alert('Please enter a tag.');
            return;
        }

        if (!pendingTagHandId) {
            alert('No hand selected.');
            hideTagInput();
            return;
        }

        try {
            const hand = await getHandByAutoId(pendingTagHandId);

            if (!hand) {
                alert('Hand not found in database.');
                hideTagInput();
                return;
            }

            if (!hand.tags) {
                hand.tags = [];
            }

            hand.tags.push(tagText);

            await updateHandInDB(hand);

            console.log(`✅ Tag added to Hand #${hand.handNumber}: "${tagText}"`);

            await refreshHistory();

            const newIndex = currentPageHands.findIndex(h => h.autoId === pendingTagHandId);
            if (newIndex >= 0) {
                historyIndex = newIndex;
                updateUI();
            }

            hideTagInput();

        } catch (error) {
            console.error('Failed to add tag:', error);
            alert('Failed to add tag. Check console for details.');
            hideTagInput();
        }
    }

    // ============================================
    // UI UPDATE LOGIC
    // ============================================

    function updateUI() {
        const statusText = document.querySelector('.hh-status-text');
        const navLabel = document.getElementById('hhNavLabel');
        const prevBtn = document.getElementById('hhPrev');
        const nextBtn = document.getElementById('hhNext');
        const deleteHandBtn = document.getElementById('hhDeleteHand');
        const metadataDiv = document.getElementById('hhMetadata');
        const messagesDiv = document.getElementById('hhMessages');
        const warningsDiv = document.getElementById('hhWarnings');

        if (currentPageHands.length === 0) {
            statusText.textContent = handMetadataList.length > 0 ?
                `${handMetadataList.length} hands in database - Load a page to view` :
                'No hands stored yet';
            navLabel.textContent = 'No hands yet';
            metadataDiv.innerHTML = '';
            messagesDiv.innerHTML = '<div class="hh-no-data">No hands stored yet</div>';
            warningsDiv.style.display = 'none';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            deleteHandBtn.disabled = true;
            return;
        }

        if (historyIndex < 0 || historyIndex >= currentPageHands.length) {
            historyIndex = 0;
        }

        const hand = currentPageHands[historyIndex];
        const globalIndex = metadataOffset + historyIndex + 1;
        statusText.textContent = `Viewing History (${handMetadataList.length} hands stored)`;
        navLabel.textContent = `Hand #${hand.handNumber} (${globalIndex}/${handMetadataList.length})`;

        // Validate hand and show warnings
        const warnings = validateHand(hand);
        if (warnings.length > 0) {
            let warningHTML = '';
            warnings.forEach(warning => {
                warningHTML += `<div class="hh-warning-item">⚠️ ${warning}</div>`;
            });
            warningsDiv.innerHTML = warningHTML;
            warningsDiv.style.display = 'block';
        } else {
            warningsDiv.style.display = 'none';
        }

        // Display tags if present
        const tagsDiv = document.getElementById('hhTags');
        if (hand.tags && hand.tags.length > 0) {
            let tagsHTML = '';
            hand.tags.forEach(tag => {
                tagsHTML += `<span class="hh-tag-item">🏷️ ${tag}</span>`;
            });
            tagsDiv.innerHTML = tagsHTML;
            tagsDiv.style.display = 'block';
        } else {
            tagsDiv.style.display = 'none';
        }

        displayHand(hand);

        prevBtn.disabled = historyIndex <= 0 && metadataOffset <= 0;
        nextBtn.disabled = historyIndex >= currentPageHands.length - 1 &&
                          metadataOffset + PAGE_SIZE >= handMetadataList.length;
        deleteHandBtn.disabled = false;
    }

    function displayHand(hand) {
        if (!hand) return;

        const metadataDiv = document.getElementById('hhMetadata');
        const messagesDiv = document.getElementById('hhMessages');

        // Build metadata
        let metaHTML = '';

        if (hand.handId) {
            metaHTML += `
                <div class="hh-meta-row">
                    <span class="hh-meta-label">Hand ID:</span>
                    <span class="hh-meta-value">${hand.handId.substring(0, 12)}...</span>
                </div>
            `;
        }

        if (hand.tableData && hand.tableData.playerCount) {
            metaHTML += `
                <div class="hh-meta-row">
                    <span class="hh-meta-label">Players:</span>
                    <span class="hh-meta-value">${hand.tableData.playerCount}</span>
                </div>
            `;
        }

        if (hand.heroCards && hand.heroCards.length > 0) {
            const cardStr = hand.heroCards.map(c => `${c.rank}${c.suit}`).join(', ');
            metaHTML += `
                <div class="hh-meta-row">
                    <span class="hh-meta-label">Your Cards:</span>
                    <span class="hh-meta-cards">${cardStr}</span>
                </div>
            `;
        }

        if (hand.isComplete && hand.endTime && hand.startTime) {
            const elapsed = ((hand.endTime - hand.startTime) / 1000).toFixed(1);
            metaHTML += `
                <div class="hh-meta-row">
                    <span class="hh-meta-label">Duration:</span>
                    <span class="hh-meta-value">${elapsed}s</span>
                </div>
            `;
        }

        metaHTML += `
            <div class="hh-meta-row">
                <span class="hh-meta-label">Messages:</span>
                <span class="hh-meta-value">${hand.messages.length}</span>
            </div>
        `;

        metadataDiv.innerHTML = metaHTML;

        // Build messages
        let msgHTML = '';
        hand.messages.forEach(msg => {
            const shortText = msg.text.length > 80 ? msg.text.substring(0, 80) + '...' : msg.text;
            msgHTML += `
                <div class="hh-message">
                    <span class="hh-message-seq">${msg.sequence}.</span>
                    <span class="hh-message-text">${shortText}</span>
                </div>
            `;
        });

        messagesDiv.innerHTML = msgHTML;
    }

    // ============================================
    // NAVIGATION
    // ============================================

    async function navigatePrevious() {
        if (currentPageHands.length === 0) {
            await refreshHistory();
            return;
        }

        if (historyIndex > 0) {
            historyIndex--;
            updateUI();
        } else if (metadataOffset > 0) {
            await loadPreviousPage();
            historyIndex = currentPageHands.length - 1;
            updateUI();
        }
    }

    async function navigateNext() {
        if (currentPageHands.length === 0) {
            await refreshHistory();
            return;
        }

        if (historyIndex < currentPageHands.length - 1) {
            historyIndex++;
            updateUI();
        } else if (metadataOffset + PAGE_SIZE < handMetadataList.length) {
            await loadNextPage();
        }
    }

    async function refreshHistory() {
        const count = await getHandCount();

        if (count === 0) {
            handMetadataList = [];
            metadataOffset = 0;
            currentPageHands = [];
            historyIndex = -1;
            updateUI();
            updatePaginationUI();
            return;
        }

        handMetadataList = await loadHandMetadata();
        metadataOffset = 0;
        await loadCurrentPage();
    }

    function copyCurrentHand() {
        if (currentPageHands.length === 0 || historyIndex < 0) {
            console.log('No hand to copy');
            return;
        }

        const hand = currentPageHands[historyIndex];

        let text = `Hand #${hand.handNumber}\n`;
        text += `Hand ID: ${hand.handId}\n`;
        text += `Timestamp: ${new Date(hand.startTime).toLocaleString()}\n`;

        if (hand.tags && hand.tags.length > 0) {
            text += `Tags: ${hand.tags.join(', ')}\n`;
        }

        if (hand.heroCards && hand.heroCards.length > 0) {
            text += `Your Cards: ${hand.heroCards.map(c => c.rank + c.suit).join(', ')}\n`;
        }

        if (hand.tableData && hand.tableData.players) {
            text += `\nPlayers:\n`;
            hand.tableData.players.forEach((p, i) => {
                text += `  ${i + 1}. ${p.name} (Seat ${p.seat}): ${p.stack}\n`;
            });
        }

        text += `\nMessages:\n`;
        hand.messages.forEach(msg => {
            text += `${msg.sequence}. ${msg.text}\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = document.getElementById('hhCopy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓';
            copyBtn.style.background = 'rgba(52, 211, 153, 0.3)';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    // ============================================
    // SUPPLEMENTARY DATA CAPTURE
    // ============================================

    function captureHeroCards() {
        try {
            const cardDivs = document.querySelectorAll(
                ".playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ .front___osz1p > div"
            );

            if (!cardDivs || cardDivs.length === 0) {
                return null;
            }

            const cards = Array.from(cardDivs).map((div) => {
                const classList = Array.from(div.classList);
                const cardClass = classList.find(c => c.includes('-') && c.includes('___'));

                if (cardClass) {
                    const parts = cardClass.split('-');
                    const suitName = parts[0];
                    const rankPart = parts[1].split('___')[0];

                    const suitMap = {
                        spades: "s",
                        hearts: "h",
                        diamonds: "d",
                        clubs: "c"
                    };

                    const suit = suitMap[suitName] || "?";
                    const rank = rankPart.toUpperCase();

                    return { rank, suit };
                }

                return { rank: "?", suit: "?" };
            });

            if (cards.length > 0 && !cards.some(c => c.rank === "?")) {
                return cards;
            }

            return null;

        } catch (error) {
            console.error('Error capturing hero cards:', error);
            return null;
        }
    }

    function isPlayerInactive(element) {
        const text = element.textContent;
        return text.includes('Sitting out') || text.includes('Waiting BB');
    }

    function extractSeatNumber(element) {
        const seatMatch = element.className.match(/playerPositioner-(\d+)___/);
        return seatMatch ? parseInt(seatMatch[1]) : null;
    }

    function captureHeroData() {
        try {
            const heroElement = document.querySelector('.playerMeGateway___AEI5_');
            if (!heroElement) return null;

            const text = heroElement.textContent.trim();

            if (isPlayerInactive(heroElement)) {
                return null;
            }

            const stackMatch = text.match(/\$([0-9,]+)/);
            if (!stackMatch) {
                return null;
            }

            const stack = stackMatch[1].split(/[^0-9,]/)[0];

            return {
                seat: 0,
                name: 'HERO',
                stack: stack,
                isActive: true
            };

        } catch (error) {
            console.error('Error capturing hero data:', error);
            return null;
        }
    }

    function captureOpponentData() {
        try {
            const players = [];
            const playerElements = document.querySelectorAll('.playerPositioner___nbx0c');

            playerElements.forEach(element => {
                if (isPlayerInactive(element)) {
                    return;
                }

                const seatNumber = extractSeatNumber(element);
                if (seatNumber === null) return;

                const text = element.textContent.trim();

                const nameElement = element.querySelector('.name___cESdZ');
                const playerName = nameElement ? nameElement.textContent.trim() : `Player${seatNumber}`;

                const stackMatch = text.match(/\$([0-9,]+)/);
                if (!stackMatch) {
                    return;
                }

                const stack = stackMatch[1].split(/[^0-9,]/)[0];

                players.push({
                    seat: seatNumber,
                    name: playerName,
                    stack: stack,
                    isActive: true
                });
            });

            return players;

        } catch (error) {
            console.error('Error capturing opponent data:', error);
            return [];
        }
    }

    function captureTableData() {
        const heroData = captureHeroData();
        const opponentData = captureOpponentData();

        const allPlayers = [];

        if (heroData) {
            allPlayers.push(heroData);
        }

        allPlayers.push(...opponentData);
        allPlayers.sort((a, b) => a.seat - b.seat);

        return {
            players: allPlayers,
            playerCount: allPlayers.length,
            captureTime: Date.now()
        };
    }

    function captureSupplementaryData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const tableData = captureTableData();
                const heroCards = captureHeroCards();

                const hasTableData = tableData.players.length > 0;
                const hasCards = heroCards && heroCards.length > 0;

                if (hasTableData || hasCards) {
                    console.log(`  Data captured: ${tableData.players.length} players, ${hasCards ? heroCards.length : 0} cards`);
                }

                resolve({
                    tableData: hasTableData ? tableData : null,
                    heroCards: hasCards ? heroCards : null
                });
            }, 1000);
        });
    }

    // ============================================
    // INDEXEDDB SETUP
    // ============================================

    function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open("pokerHandHistoryDB", 2);

        openRequest.onupgradeneeded = function(event) {
            db = event.target.result;

            if (!db.objectStoreNames.contains("hands")) {
                const handStore = db.createObjectStore("hands", {
                    keyPath: "autoId",
                    autoIncrement: true
                });

                handStore.createIndex("handNumber", "handNumber", { unique: false });
                handStore.createIndex("handId", "handId", { unique: false });
                handStore.createIndex("startTime", "startTime", { unique: false });
            }

            // Create playerStats store for other scripts
            if (!db.objectStoreNames.contains("playerStats")) {
                const statsStore = db.createObjectStore("playerStats", {
                    keyPath: "playerName"
                });
                statsStore.createIndex("lastUpdated", "lastUpdated", { unique: false });
            }
        };

        openRequest.onsuccess = function(event) {
            db = event.target.result;
            resolve(db);
        };

        openRequest.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

    function saveHandToDB(hand) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readwrite");
            const store = transaction.objectStore("hands");

            const handToSave = {
                ...hand,
                savedAt: Date.now()
            };

            const request = store.add(handToSave);

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function loadAllHands() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.openCursor();

            const hands = [];

            request.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    const hand = { ...cursor.value, autoId: cursor.primaryKey };
                    hands.push(hand);
                    cursor.continue();
                } else {
                    resolve(hands);
                }
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function getHandCount() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.count();

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function clearAllHands() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readwrite");
            const store = transaction.objectStore("hands");
            const request = store.clear();

            request.onsuccess = function() {
                resolve();
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function deleteHandFromDB(autoId) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readwrite");
            const store = transaction.objectStore("hands");
            const request = store.delete(autoId);

            request.onsuccess = function() {
                resolve();
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function getHandByAutoId(autoId) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.get(autoId);

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function updateHandInDB(hand) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(["hands"], "readwrite");
            const store = transaction.objectStore("hands");
            const request = store.put(hand);

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    // ============================================
    // HAND STATE MANAGEMENT
    // ============================================

    function getCurrentHandState() {
        return {
            hasCurrentHand: handState.current !== null,
            isCollecting: handState.isCollecting,
            handNumber: handState.current ? handState.current.handNumber : null,
            handId: handState.current ? handState.current.handId : null,
            messageCount: handState.current ? handState.current.messages.length : 0,
            messages: handState.current ? [...handState.current.messages] : [],
            startTime: handState.current ? handState.current.startTime : null,
            elapsedTime: handState.current ? Date.now() - handState.current.startTime : 0,
            isComplete: handState.current ? handState.current.isComplete : false,
            tableData: handState.current ? handState.current.tableData : null,
            heroCards: handState.current ? handState.current.heroCards : null
        };
    }

    function getLastCompletedHand() {
        return handState.lastCompleted ? {...handState.lastCompleted} : null;
    }

    function initializeNewHand(messageText, timestamp) {
        handCounter++;

        const newHand = {
            handId: extractGameId(messageText),
            handNumber: handCounter,
            messages: [],
            startTime: timestamp,
            isComplete: false,
            endTime: null,
            tableData: null,
            heroCards: null,
            tags: []
        };

        newHand.messages.push({
            sequence: 1,
            text: messageText,
            timestamp: timestamp
        });

        handState.current = newHand;
        handState.isCollecting = true;
        handState.collectionStartTime = timestamp;

        console.log(`Hand #${handCounter} started - ID: ${newHand.handId}`);
        console.log(`  1. ${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}`);

        captureSupplementaryData().then(result => {
            if (handState.current && handState.current.handNumber === newHand.handNumber) {
                handState.current.tableData = result.tableData;
                handState.current.heroCards = result.heroCards;
            }
        });

        return newHand;
    }

    function addMessageToHand(messageText, timestamp) {
        if (!handState.current) {
            return false;
        }

        const sequenceNumber = handState.current.messages.length + 1;

        handState.current.messages.push({
            sequence: sequenceNumber,
            text: messageText,
            timestamp: timestamp
        });
        console.log(`  ${sequenceNumber}. ${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}`);

        return true;
    }

    function completeCurrentHand(timestamp) {
        if (!handState.current) {
            return null;
        }

        handState.current.isComplete = true;
        handState.current.endTime = timestamp;

        const duration = ((handState.current.endTime - handState.current.startTime) / 1000).toFixed(1);

        console.log(`Hand #${handState.current.handNumber} completed - ${handState.current.messages.length} messages`);
        console.log(`   Duration: ${duration}s`);
        console.log(`   Hand ID: ${handState.current.handId}`);

        if (handState.current.tableData) {
            console.log(`   Players: ${handState.current.tableData.playerCount}`);
        }
        if (handState.current.heroCards) {
            const cardStr = handState.current.heroCards.map(c => c.rank + c.suit).join(', ');
            console.log(`   Hero cards: ${cardStr}`);
        }

        // Validate hand and log warnings
        const warnings = validateHand(handState.current);
        logHandWarnings(handState.current, warnings);

        handState.lastCompleted = {...handState.current};

        const handToSave = {...handState.current};
        saveHandToDB(handToSave)
            .then(() => {
                console.log(`   Saved to database`);
            })
            .catch((error) => {
                console.error(`   Failed to save to database:`, error);
            });

        handState.current = null;
        handState.isCollecting = false;

        return handToSave;
    }

    function resetHandState() {
        handState.current = null;
        handState.isCollecting = false;
        handState.lastCompleted = null;
    }

    // ============================================
    // MESSAGE COLLECTION
    // ============================================

    function initPokerObserver() {
        const pokerWrapper = document.querySelector("div.holdemWrapper___D71Gy");
        if (!pokerWrapper) {
            return;
        }

        const observer = new MutationObserver(reObserveMessageBox);
        const observerConfig = { attributes: false, childList: true, subtree: false };
        observer.observe(pokerWrapper, observerConfig);

        reObserveMessageBox();
    }

    function reObserveMessageBox() {
        if (!messageBoxObserver) {
            messageBoxObserver = new MutationObserver(handleMessageBoxChange);
        }

        messageBoxObserver.disconnect();

        const messagesWrap = document.querySelector("div.holdemWrapper___D71Gy div.messagesWrap___tBx9u");
        if (messagesWrap) {
            const observerConfig = { attributes: true, childList: true, subtree: false };
            messageBoxObserver.observe(messagesWrap, observerConfig);
        }
    }

    function handleMessageBoxChange(mutated) {
        if (mutated.length >= 40) return;

        for (const mutation of mutated) {
            for (const node of mutation.addedNodes) {
                if (node.classList && node.classList.contains("message___RlFXd")) {
                    const messageText = node.innerText.trim();
                    const timestamp = Date.now();

                    processMessage(messageText, timestamp);
                }
            }
        }
    }

    function processMessage(messageText, timestamp) {
        if (isHandStartMessage(messageText)) {
            handleHandStart(messageText, timestamp);
            return;
        }

        if (isHandEndMessage(messageText)) {
            handleHandEnd(messageText, timestamp);
            return;
        }

        if (handState.isCollecting) {
            addMessageToHand(messageText, timestamp);
        }
    }

    function isHandStartMessage(text) {
        return text.includes('Game') && text.includes('started');
    }

    function isHandEndMessage(text) {
        return text.includes('won') && text.includes('$');
    }

    function extractGameId(text) {
        const match = text.match(/Game ([a-f0-9]+) started/);

        if (match && match[1]) {
            return match[1];
        }

        return `hand_${Date.now()}`;
    }

    function handleHandStart(messageText, timestamp) {
        if (handState.isCollecting && handState.current) {
            completeCurrentHand(timestamp);
        }

        initializeNewHand(messageText, timestamp);
    }

    function handleHandEnd(messageText, timestamp) {
        if (!handState.isCollecting || !handState.current) {
            return;
        }

        addMessageToHand(messageText, timestamp);
        completeCurrentHand(timestamp);
    }

    // ============================================
    // CONSOLE API
    // ============================================

    window.pokerHistoryDB = {
        loadAllHands: loadAllHands,
        loadHandMetadata: loadHandMetadata,
        getHandCount: getHandCount,
        clearAllHands: clearAllHands,
        deleteHand: deleteHandFromDB,
        getCurrentHandState: getCurrentHandState,
        getLastCompletedHand: getLastCompletedHand,
        resetHandState: resetHandState,
        refreshUI: refreshHistory,
        exportDatabase: exportDatabase,
        healthCheck: performHealthCheck,
        getState: () => ({
            handCounter: handCounter,
            isCollecting: handState.isCollecting,
            hasCurrentHand: handState.current !== null,
            currentHandNumber: handState.current ? handState.current.handNumber : null,
            totalHands: handMetadataList.length,
            currentPage: Math.floor(metadataOffset / PAGE_SIZE) + 1,
            handsOnPage: currentPageHands.length
        }),
        testCaptureTable: captureTableData,
        testCaptureCards: captureHeroCards
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
        console.log('Ultimate Hand History Collector v0.7.0');
        console.log('Features: Pagination + Import JSON + Help Guide + Improved Validation');

        try {
            await initIndexedDB();
            const count = await getHandCount();
            console.log(`Database: ${count} hands stored`);

            if (count > 0) {
                const allHands = await loadAllHands();
                const maxHandNumber = Math.max(...allHands.map(h => h.handNumber || 0));
                handCounter = maxHandNumber;
                console.log(`Resuming from hand #${handCounter}`);
            }
        } catch (error) {
            console.error('Database initialization failed:', error);
        }

        const checkForTable = setInterval(() => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('Poker table found');

                createUI();
                initPokerObserver();

                refreshHistory();
            }
        }, 1000);

        setTimeout(() => clearInterval(checkForTable), 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();