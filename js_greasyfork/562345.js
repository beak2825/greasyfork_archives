// ==UserScript==
// @name         Geopixels - Paint Brush Swap
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  Cache and swap between custom brush patterns with a compact dropdown
// @author       ariapokoteng
// @match        *://geopixels.net/*
// @match        *://*.geopixels.net/*
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
        let centerX = -1, centerY = -1;

        // Collect all active cells and find bounds, also locate center marker
        cells.forEach(cell => {
            if (cell.dataset.active === 'true') {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                pattern.push({ gridX: x, gridY: y });
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);

                // Find center marker
                if (cell.dataset.isCenter === 'true' || cell.dataset.isCenter === 'true') {
                    centerX = x;
                    centerY = y;
                }
            }
        });

        if (pattern.length === 0) {
            console.warn('Brush Swap: No active cells in brush');
            return null;
        }

        // Calculate brush size from grid bounds
        const brushSize = Math.max(maxX - minX + 1, maxY - minY + 1);

        // If center wasn't found (shouldn't happen), use grid center
        if (centerX === -1 || centerY === -1) {
            centerX = Math.floor(brushSize / 2);
            centerY = Math.floor(brushSize / 2);
        }

        // Convert grid coordinates to relative coordinates, centered on the actual center pixel
        const relativePattern = pattern.map(p => ({
            x: p.gridX - centerX,
            y: (p.gridY - centerY) * -1 // Invert Y for consistency
        }));

        if (DEBUG) console.log('Brush Swap: Captured brush from DOM', {
            brushSize,
            centerX,
            centerY,
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

        // Create dropdown container with Tailwind classes
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'flex gap-2 items-center mb-3 px-1.5 dark:text-gray-300';

        // Create label
        const label = document.createElement('label');
        label.textContent = 'Grid Size:';
        label.className = 'text-xs font-semibold text-gray-700 dark:text-gray-300';

        // Create select
        const select = document.createElement('select');
        select.id = 'brush-swap-dimension-select';
        select.className = 'px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 cursor-pointer';

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

        // Calculate center of the pattern bounds (not the grid size)
        const patternCenterX = minX + Math.floor((maxX - minX) / 2);
        const patternCenterY = minY + Math.floor((maxY - minY) / 2);

        // Build preview with full pattern bounds
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const cell = document.createElement('div');
                cell.className = 'brush-swap-preview-cell';
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';

                const isActive = activeCells.has(`${x},${y}`);
                const isCenter = x === patternCenterX && y === patternCenterY;

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
            emptyMsg.className = 'text-center text-gray-500 dark:text-gray-400 text-xs py-3 px-2';
            emptyMsg.textContent = 'No saved brushes';
            itemsContainer.appendChild(emptyMsg);
            return;
        }

        scriptState.brushes.forEach(brush => {
            const item = document.createElement('div');
            item.className = 'flex items-center gap-2 p-1.5 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700';
            item.dataset.brushId = brush.id;

            // Preview grid
            const preview = createBrushPreview(brush);
            item.appendChild(preview);

            // Name and controls
            const infoContainer = document.createElement('div');
            infoContainer.className = 'flex-1 flex flex-col gap-1';

            // Name display / edit
            const nameContainer = document.createElement('div');
            nameContainer.className = 'flex items-center gap-1 flex-1';

            if (scriptState.isRenaming === brush.id) {
                // Rename input mode
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'flex-1 px-1 py-0.5 text-xs border border-gray-500 dark:border-gray-400 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100';
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
                nameSpan.className = 'flex-1 text-xs font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis';
                nameSpan.textContent = brush.name;
                nameContainer.appendChild(nameSpan);

                const pencilBtn = document.createElement('button');
                pencilBtn.className = 'bg-none border-none cursor-pointer p-0 text-xs opacity-60 hover:opacity-100 transition-opacity flex-shrink-0';
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
            buttonsContainer.className = 'flex gap-1 flex-shrink-0';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'px-1.5 py-0.5 text-xs border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer rounded transition-colors hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-400 dark:hover:border-blue-400';
            loadBtn.textContent = 'Load';
            loadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadBrush(brush.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'px-1 py-0.5 text-xs bg-none border border-gray-300 dark:border-gray-500 opacity-60 hover:opacity-100 transition-opacity cursor-pointer rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-red-50 dark:hover:bg-red-900 hover:border-red-400 dark:hover:border-red-400';
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
                opacity: 0.85;
                transition: all 0.2s ease;
            }

            #brush-swap-toggle:hover {
                opacity: 1;
            }

            #brush-swap-toggle:active {
                opacity: 0.7;
            }

            /* Dropdown container */
            #brush-swap-dropdown {
                position: absolute;
                bottom: 100%;
                right: 0;
                border-radius: 4px;
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

            /* Scrollbar styling for dropdown */
            #brush-swap-dropdown::-webkit-scrollbar {
                width: 6px;
            }

            #brush-swap-dropdown::-webkit-scrollbar-track {
                background: transparent;
            }

            #brush-swap-dropdown::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 3px;
            }

            #brush-swap-dropdown::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            /* Dark mode scrollbar */
            @media (prefers-color-scheme: dark) {
                #brush-swap-dropdown::-webkit-scrollbar-thumb {
                    background: #555;
                }

                #brush-swap-dropdown::-webkit-scrollbar-thumb:hover {
                    background: #777;
                }
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
        wrapper.className = 'relative inline-block';

        // Create toggle button (paintbrush icon)
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'brush-swap-toggle';
        toggleBtn.className = 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-pointer px-2.5 py-1.5 text-xs leading-none font-semibold text-gray-800 dark:text-gray-200 ml-2 inline-flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-600 dark:hover:border-gray-500 active:bg-gray-300 dark:active:bg-gray-800';
        toggleBtn.title = 'Toggle saved brushes';
        toggleBtn.innerHTML = '<span style="font-size: 10px; font-weight: 600; display: flex; align-items: center; gap: 4px;">▲ brushes</span>';
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.id = 'brush-swap-dropdown';
        dropdown.className = 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg';

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

    function hookSaveBrushToPreset() {
        if (typeof window.saveBrushToPreset !== 'function') {
            console.warn('Brush Swap: saveBrushToPreset not yet available, retrying...');
            return false;
        }

        const originalSave = window.saveBrushToPreset;

        window.saveBrushToPreset = function(slotIndex) {
            // Call original function
            originalSave.call(this, slotIndex);

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

        if (DEBUG) console.log('Brush Swap: Successfully hooked saveBrushToPreset');
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

        // Wait for bottomControls and saveBrushToPreset to be ready
        let attempts = 0;
        const maxAttempts = 120; // 60 seconds at 500ms intervals

        const initInterval = setInterval(() => {
            attempts++;

            const bottomControls = document.getElementById('bottomControls');
            const hasSaveBrushToPreset = typeof window.saveBrushToPreset === 'function';

            if (bottomControls && hasSaveBrushToPreset && attempts <= maxAttempts) {
                clearInterval(initInterval);

                // Create UI
                createUI(bottomControls);

                // Hook into saveBrushToPreset (now guaranteed to exist)
                hookSaveBrushToPreset();

                // Hook into toggleBrushEditor for dimension dropdown
                hookToggleBrushEditor();

                if (DEBUG) console.log('Brush Swap initialized successfully');
            } else if (attempts > maxAttempts) {
                clearInterval(initInterval);
                console.warn('Brush Swap: Could not initialize - bottomControls or saveBrushToPreset not found', {
                    hasBottomControls: !!bottomControls,
                    hasSaveBrushToPreset: hasSaveBrushToPreset
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
