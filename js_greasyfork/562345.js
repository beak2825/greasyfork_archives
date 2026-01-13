// ==UserScript==
// @name         Geopixels - Paint Brush Swap
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Cache and swap between custom brush patterns with a compact dropdown
// @author       ariapokoteng
// @match        https://geopixels.net/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geopixels.net
// @downloadURL https://update.greasyfork.org/scripts/562345/Geopixels%20-%20Paint%20Brush%20Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/562345/Geopixels%20-%20Paint%20Brush%20Swap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // DEBUG MODE
    // ============================================
    const DEBUG = false; // Set to true for console logging

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const STORAGE_KEY = 'brushPresets';
    const MAX_BRUSHES = 100;

    const scriptState = {
        brushes: [],
        nextId: 1,
        dropdownOpen: false,
        isRenaming: null // Track which brush ID is being renamed
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    function loadBrushes() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                scriptState.brushes = JSON.parse(saved);
                scriptState.nextId = Math.max(...scriptState.brushes.map(b => b.id), 0) + 1;
            } catch (e) {
                console.error('Failed to parse brush presets:', e);
                scriptState.brushes = [];
                scriptState.nextId = 1;
            }
        }
    }

    function saveBrushes() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scriptState.brushes));
    }

    function addBrush(pattern, brushSize) {
        if (scriptState.brushes.length >= MAX_BRUSHES) {
            // Delete oldest brush (first in array)
            scriptState.brushes.shift();
        }

        const newBrush = {
            id: scriptState.nextId++,
            name: `Brush ${scriptState.nextId}`,
            pattern: pattern,
            brushSize: brushSize
        };

        scriptState.brushes.push(newBrush);
        saveBrushes();
        return newBrush;
    }

    function deleteBrush(id) {
        scriptState.brushes = scriptState.brushes.filter(b => b.id !== id);
        saveBrushes();
        renderDropdown();
    }

    function renameBrush(id, newName) {
        const brush = scriptState.brushes.find(b => b.id === id);
        if (brush) {
            brush.name = newName.trim() || `Brush ${id}`;
            saveBrushes();
            renderDropdown();
        }
    }

    // ============================================
    // BRUSH CAPTURE FROM DOM
    // ============================================

    function captureBrushFromDOM() {
        const brushGrid = document.getElementById('brushGrid');
        if (!brushGrid) {
            console.warn('Brush Swap: brushGrid not found');
            return null;
        }

        const cells = brushGrid.querySelectorAll('div[data-x][data-y]');
        const pattern = [];
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        // Collect all active cells and find bounds
        cells.forEach(cell => {
            if (cell.dataset.active === 'true') {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                pattern.push({ gridX: x, gridY: y });
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        });

        if (pattern.length === 0) {
            console.warn('Brush Swap: No active cells in brush');
            return null;
        }

        // Calculate brush size from grid bounds
        const brushSize = Math.max(maxX - minX + 1, maxY - minY + 1);
        const centerX = Math.floor(brushSize / 2);
        const centerY = Math.floor(brushSize / 2);

        // Convert grid coordinates to relative coordinates
        const relativePattern = pattern.map(p => ({
            x: p.gridX - minX - centerX,
            y: (p.gridY - minY - centerY) * -1 // Invert Y for consistency
        }));

        if (DEBUG) console.log('Brush Swap: Captured brush from DOM', {
            brushSize,
            pattern: relativePattern,
            cellCount: pattern.length
        });

        return {
            pattern: relativePattern,
            brushSize: brushSize
        };
    }

    function loadBrush(id) {
        const brush = scriptState.brushes.find(b => b.id === id);
        if (!brush) return;

        applyBrushToEditor(brush);
        toggleDropdown();
    }

    function applyBrushToEditor(brush) {
        // Set globals exactly like setBrushByRadius does (NO window prefix!)
        BrushSize = brush.brushSize;
        currentBrushPattern = [...brush.pattern]; // Copy array

        if (DEBUG) console.log('Brush Swap: Set globals', {
            BrushSize: BrushSize,
            currentBrushPattern: currentBrushPattern
        });

        // Update userConfig (NO window prefix!)
        if (userConfig) {
            userConfig = {
                ...userConfig,
                currentBrushPattern: currentBrushPattern,
                brushSize: BrushSize
            };
            localStorage.setItem('userConfig', JSON.stringify(userConfig));
            if (DEBUG) console.log('Brush Swap: Updated userConfig');
        }

        // Call server save if available (same optional chaining as working code)
        saveConfigServer?.();

        if (DEBUG) console.log('Brush Swap: Applied brush to editor', brush);
    }

    // ============================================
    // BRUSH DIMENSION CONTROL
    // ============================================

    function addBrushDimensionDropdown() {
        const brushEditorPanel = document.getElementById('brushEditorPanel');
        if (!brushEditorPanel) return;

        // Check if dropdown already exists
        if (document.getElementById('brush-swap-dimension-select')) return;

        // Find the header area to insert dropdown
        const header = brushEditorPanel.querySelector('h2');
        if (!header) return;

        // Create dropdown container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-bottom: 12px; padding: 0 6px;';

        // Create label
        const label = document.createElement('label');
        label.textContent = 'Grid Size:';
        label.style.cssText = 'font-size: 12px; font-weight: 600; color: #666;';

        // Create select
        const select = document.createElement('select');
        select.id = 'brush-swap-dimension-select';
        select.style.cssText = 'padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;';

        const options = [
            { value: 1, label: '1×1' },
            { value: 3, label: '3×3' },
            { value: 5, label: '5×5' },
            { value: 7, label: '7×7' },
            { value: 9, label: '9×9' }
        ];

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });

        // Set current BrushSize as selected
        select.value = BrushSize || 5;

        // Handle change
        select.addEventListener('change', (e) => {
            const newSize = parseInt(e.target.value);
            BrushSize = newSize;
            if (DEBUG) console.log(`Brush Swap: Changed grid size to ${newSize}x${newSize}`);

            // Regenerate grid with new size
            if (window.generateBrushGrid) {
                window.generateBrushGrid();
            }
        });

        dropdownContainer.appendChild(label);
        dropdownContainer.appendChild(select);

        // Insert after the header
        header.parentNode.insertBefore(dropdownContainer, header.nextSibling);
    }

    // ============================================

    function createBrushPreview(brush) {
        const grid = document.createElement('div');
        grid.className = 'brush-swap-preview-grid';

        // Create a map of active cells based on pattern
        const activeCells = new Map();
        const centerOffset = Math.floor(brush.brushSize / 2);
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        brush.pattern.forEach(offset => {
            // Convert from relative coordinates to grid coordinates
            const gridX = offset.x + centerOffset;
            const gridY = (offset.y * -1) + centerOffset; // Denormalize Y-axis
            activeCells.set(`${gridX},${gridY}`, true);
            minX = Math.min(minX, gridX);
            maxX = Math.max(maxX, gridX);
            minY = Math.min(minY, gridY);
            maxY = Math.max(maxY, gridY);
        });

        // Calculate preview dimensions
        const width = maxX - minX + 1;
        const height = maxY - minY + 1;
        const maxDim = Math.max(width, height);

        // Scale cells to fit compact preview (8px max per cell)
        const cellSize = Math.max(4, Math.floor(32 / maxDim));

        // Build preview with full pattern bounds
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const cell = document.createElement('div');
                cell.className = 'brush-swap-preview-cell';
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';

                const isActive = activeCells.has(`${x},${y}`);
                const isCenter = x === centerOffset && y === centerOffset;

                if (isActive) {
                    cell.classList.add('active');
                    if (isCenter) {
                        cell.classList.add('center');
                    }
                }

                grid.appendChild(cell);
            }
        }

        // Set grid columns dynamically
        grid.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;

        return grid;
    }

    // ============================================
    // UI RENDERING
    // ============================================

    function renderDropdown() {
        let dropdown = document.getElementById('brush-swap-dropdown');
        if (!dropdown) return;

        // Clear existing items
        const itemsContainer = dropdown.querySelector('.brush-swap-items');
        itemsContainer.innerHTML = '';

        if (scriptState.brushes.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'brush-swap-empty';
            emptyMsg.textContent = 'No saved brushes';
            itemsContainer.appendChild(emptyMsg);
            return;
        }

        scriptState.brushes.forEach(brush => {
            const item = document.createElement('div');
            item.className = 'brush-swap-item';
            item.dataset.brushId = brush.id;

            // Preview grid
            const preview = createBrushPreview(brush);
            item.appendChild(preview);

            // Name and controls
            const infoContainer = document.createElement('div');
            infoContainer.className = 'brush-swap-info';

            // Name display / edit
            const nameContainer = document.createElement('div');
            nameContainer.className = 'brush-swap-name-container';

            if (scriptState.isRenaming === brush.id) {
                // Rename input mode
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'brush-swap-rename-input';
                input.value = brush.name;
                input.maxLength = 30;

                input.addEventListener('blur', () => {
                    renameBrush(brush.id, input.value);
                    scriptState.isRenaming = null;
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        renameBrush(brush.id, input.value);
                        scriptState.isRenaming = null;
                    }
                });

                nameContainer.appendChild(input);
                setTimeout(() => input.focus(), 0);
            } else {
                // Normal name display with pencil icon
                const nameSpan = document.createElement('span');
                nameSpan.className = 'brush-swap-name';
                nameSpan.textContent = brush.name;
                nameContainer.appendChild(nameSpan);

                const pencilBtn = document.createElement('button');
                pencilBtn.className = 'brush-swap-pencil-btn';
                pencilBtn.title = 'Rename brush';
                pencilBtn.innerHTML = '✏️';
                pencilBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    scriptState.isRenaming = brush.id;
                    renderDropdown();
                });
                nameContainer.appendChild(pencilBtn);
            }

            infoContainer.appendChild(nameContainer);

            // Load and Delete buttons
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'brush-swap-buttons';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'brush-swap-load-btn';
            loadBtn.textContent = 'Load';
            loadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadBrush(brush.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'brush-swap-delete-btn';
            deleteBtn.title = 'Delete brush';
            deleteBtn.innerHTML = '✕';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteBrush(brush.id);
            });

            buttonsContainer.appendChild(loadBtn);
            buttonsContainer.appendChild(deleteBtn);
            infoContainer.appendChild(buttonsContainer);

            item.appendChild(infoContainer);
            itemsContainer.appendChild(item);
        });
    }

    function toggleDropdown() {
        const dropdown = document.getElementById('brush-swap-dropdown');
        if (!dropdown) return;

        scriptState.dropdownOpen = !scriptState.dropdownOpen;

        if (scriptState.dropdownOpen) {
            dropdown.classList.add('open');
            renderDropdown();
        } else {
            dropdown.classList.remove('open');
            scriptState.isRenaming = null;
        }
    }

    // ============================================
    // DOM INITIALIZATION
    // ============================================

    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Paintbrush icon button */
            #brush-swap-toggle {
                background: #f0f0f0;
                border: 1px solid #ccc;
                cursor: pointer;
                padding: 6px 10px;
                font-size: 10px;
                line-height: 1;
                opacity: 0.85;
                transition: all 0.2s ease;
                margin-left: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 3px;
                font-weight: 600;
                color: #333;
            }

            #brush-swap-toggle:hover {
                opacity: 1;
                background: #e0e0e0;
                border-color: #999;
            }

            #brush-swap-toggle:active {
                background: #d0d0d0;
            }

            /* Dropdown container */
            #brush-swap-dropdown {
                position: absolute;
                bottom: 100%;
                right: 0;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
                margin-bottom: 8px;
                max-width: 300px;
                max-height: 0;
                overflow: hidden;
                opacity: 0;
                transition: max-height 0.3s ease, opacity 0.3s ease;
                z-index: 1000;
            }

            #brush-swap-dropdown.open {
                max-height: 600px;
                opacity: 1;
                overflow-y: auto;
            }

            /* Items container */
            .brush-swap-items {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 8px;
                min-width: 250px;
            }

            .brush-swap-empty {
                text-align: center;
                color: #999;
                font-size: 12px;
                padding: 12px 8px;
            }

            /* Individual brush item */
            .brush-swap-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px;
                border: 1px solid #eee;
                border-radius: 3px;
                background: #fafafa;
                font-size: 12px;
            }

            .brush-swap-item:hover {
                background: #f0f0f0;
            }

            /* Preview grid */
            .brush-swap-preview-grid {
                display: grid;
                gap: 1px;
                flex-shrink: 0;
                background: white;
                padding: 2px;
                border: 1px solid #ddd;
                border-radius: 2px;
            }

            .brush-swap-preview-cell {
                background: white;
                border: 0.5px solid #eee;
            }

            .brush-swap-preview-cell.active {
                background: #333;
            }

            .brush-swap-preview-cell.center {
                background: #ff6b6b;
            }

            /* Info section */
            .brush-swap-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            /* Name container */
            .brush-swap-name-container {
                display: flex;
                align-items: center;
                gap: 4px;
                flex: 1;
            }

            .brush-swap-name {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 500;
            }

            .brush-swap-pencil-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                font-size: 11px;
                opacity: 0.6;
                transition: opacity 0.2s ease;
                flex-shrink: 0;
            }

            .brush-swap-pencil-btn:hover {
                opacity: 1;
            }

            .brush-swap-rename-input {
                flex: 1;
                padding: 2px 4px;
                font-size: 12px;
                border: 1px solid #999;
                border-radius: 2px;
                font-family: inherit;
            }

            /* Buttons */
            .brush-swap-buttons {
                display: flex;
                gap: 4px;
                flex-shrink: 0;
            }

            .brush-swap-load-btn,
            .brush-swap-delete-btn {
                padding: 2px 6px;
                font-size: 11px;
                border: 1px solid #ccc;
                background: white;
                cursor: pointer;
                border-radius: 2px;
                transition: background 0.2s ease;
            }

            .brush-swap-load-btn:hover {
                background: #e8f0ff;
                border-color: #0066ff;
            }

            .brush-swap-delete-btn {
                padding: 2px 4px;
                opacity: 0.6;
                transition: opacity 0.2s ease;
            }

            .brush-swap-delete-btn:hover {
                opacity: 1;
                background: #ffe8e8;
                border-color: #ff6b6b;
            }

            /* Scrollbar styling for dropdown */
            #brush-swap-dropdown::-webkit-scrollbar {
                width: 6px;
            }

            #brush-swap-dropdown::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            #brush-swap-dropdown::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 3px;
            }

            #brush-swap-dropdown::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(style);
    }

    function createUI(bottomControlsElement) {
        // Find commitBtn to position next to it
        const commitBtn = bottomControlsElement.querySelector('#commitBtn') ||
                         bottomControlsElement.querySelector('button');

        if (!commitBtn) {
            console.warn('Brush Swap: Could not find commitBtn');
            return;
        }

        // Create wrapper for button and dropdown
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';

        // Create toggle button (paintbrush icon)
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'brush-swap-toggle';
        toggleBtn.title = 'Toggle saved brushes';
        toggleBtn.innerHTML = '<span style="font-size: 10px; font-weight: 600; display: flex; align-items: center; gap: 4px;">▲ brushes</span>';
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.id = 'brush-swap-dropdown';
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'brush-swap-items';
        dropdown.appendChild(itemsContainer);

        // Assemble and insert
        wrapper.appendChild(toggleBtn);
        wrapper.appendChild(dropdown);

        // Insert after commitBtn
        commitBtn.parentNode.insertBefore(wrapper, commitBtn.nextSibling);

        // Close dropdown on click outside
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target) && scriptState.dropdownOpen) {
                toggleDropdown();
            }
        });
    }

    function hookToggleBrushEditor() {
        const originalToggle = window.toggleBrushEditor;

        if (typeof originalToggle === 'function') {
            window.toggleBrushEditor = function() {
                // Call original toggle
                originalToggle.call(this);

                // Add dimension dropdown after modal opens
                setTimeout(() => {
                    addBrushDimensionDropdown();
                }, 50);
            };
            if (DEBUG) console.log('Brush Swap: Hooked toggleBrushEditor');
        }
    }

    // ============================================

    function hookSaveBrushConfig() {
        if (typeof window.saveBrushConfig !== 'function') {
            console.warn('Brush Swap: saveBrushConfig not yet available, retrying...');
            return false;
        }

        const originalSave = window.saveBrushConfig;

        window.saveBrushConfig = function() {
            // Call original function
            originalSave.call(this);

            // After save, capture brush from DOM grid
            const brushData = captureBrushFromDOM();
            if (brushData) {
                const newBrush = addBrush(brushData.pattern, brushData.brushSize);
                if (DEBUG) console.log('Brush Swap: Saved brush', newBrush);
                renderDropdown();
            } else {
                console.warn('Brush Swap: Failed to capture brush from DOM');
            }
        };

        if (DEBUG) console.log('Brush Swap: Successfully hooked saveBrushConfig');
        return true;
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        // Load saved brushes from localStorage
        loadBrushes();

        // Inject CSS
        injectCSS();

        // Wait for bottomControls and saveBrushConfig to be ready
        let attempts = 0;
        const maxAttempts = 120; // 60 seconds at 500ms intervals

        const initInterval = setInterval(() => {
            attempts++;

            const bottomControls = document.getElementById('bottomControls');
            const hasSaveBrushConfig = typeof window.saveBrushConfig === 'function';

            if (bottomControls && hasSaveBrushConfig && attempts <= maxAttempts) {
                clearInterval(initInterval);

                // Create UI
                createUI(bottomControls);

                // Hook into saveBrushConfig (now guaranteed to exist)
                hookSaveBrushConfig();

                // Hook into toggleBrushEditor for dimension dropdown
                hookToggleBrushEditor();

                if (DEBUG) console.log('Brush Swap initialized successfully');
            } else if (attempts > maxAttempts) {
                clearInterval(initInterval);
                console.warn('Brush Swap: Could not initialize - bottomControls or saveBrushConfig not found', {
                    hasBottomControls: !!bottomControls,
                    hasSaveBrushConfig: hasSaveBrushConfig
                });
            }
        }, 500);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
