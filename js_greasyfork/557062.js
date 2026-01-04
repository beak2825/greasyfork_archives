// ==UserScript==
// @name         Claude.ai Mermaid Chart Renderer
// @namespace    http://tampermonkey.net/
// @version      3.1
// @license      MIT
// @icon         https://claude.ai/favicon.ico
// @description  Auto-render Mermaid charts on Claude.ai with zoom and pan options
// @author       Noushad
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557062/Claudeai%20Mermaid%20Chart%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/557062/Claudeai%20Mermaid%20Chart%20Renderer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize storage with default value
    const DEFAULT_SHOW_CHART = true;
    let showChartByDefault = GM_getValue('showMermaidChart', DEFAULT_SHOW_CHART);

    // Register menu commands
    GM_registerMenuCommand(
        showChartByDefault ? '✓ Show Chart by Default (Click to Disable)' : '✗ Show Chart by Default (Click to Enable)',
        toggleChartDefault
    );

    function toggleChartDefault() {
        showChartByDefault = !showChartByDefault;
        GM_setValue('showMermaidChart', showChartByDefault);
        alert(showChartByDefault ? 'Charts will now show by default' : 'Charts will now be hidden by default');
        location.reload();
    }

    // Inject Mermaid library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.onload = function() {
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
        scanAndRenderCharts();
        observeNewCharts();
    };
    document.head.appendChild(script);

    // Add styles for chart container and toggle
    GM_addStyle(`
        .mermaid-container {
            margin: 15px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            border-left: 4px solid #0066cc;
        }

        .mermaid-chart-wrapper {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .mermaid-button-group {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }

        .mermaid-toggle-btn {
            padding: 8px 12px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: background 0.2s;
        }

        .mermaid-toggle-btn:hover {
            background: #0052a3;
        }

        .mermaid-zoom-btn {
            padding: 6px 10px;
            background: #666;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: background 0.2s;
        }

        .mermaid-zoom-btn:hover:not(:disabled) {
            background: #444;
        }

        .mermaid-zoom-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .mermaid-zoom-display {
            font-size: 12px;
            color: #666;
            min-width: 60px;
            text-align: center;
            font-weight: 500;
        }

        .mermaid-reset-btn {
            padding: 6px 10px;
            background: #999;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: background 0.2s;
        }

        .mermaid-reset-btn:hover {
            background: #777;
        }

        .mermaid-chart {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            background: white;
            min-height: 300px;
            max-height: 600px;
            cursor: grab;
            user-select: none;
        }

        .mermaid-chart.dragging {
            cursor: grabbing;
        }

        .mermaid-chart.hidden {
            display: none;
        }

        .mermaid-chart-content {
            transform-origin: center;
            transition: transform 0.2s ease;
            display: inline-block;
        }

        .mermaid-chart-content.no-transition {
            transition: none;
        }

        .mermaid-code-block {
            background: black;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 12px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-x: auto;
            max-height: 400px;
            overflow-y: auto;
            color: #0f0;
        }

        .mermaid-code-block.hidden {
            display: none;
        }

        .mermaid {
            display: flex;
            justify-content: center;
        }

        .mermaid svg {
            max-width: 100%;
        }
    `);

    function scanAndRenderCharts() {
        // Find all code blocks in the chat
        const codeBlocks = document.querySelectorAll('pre');

        codeBlocks.forEach((block, index) => {
            const code = block.textContent.trim();

            // Check if it's a mermaid block
            if (code.startsWith('```mermaid') || code.includes('flowchart') || code.includes('graph')) {
                // Extract just the chart code (remove the ``` markers if present)
                let chartCode = code.replace(/^```mermaid\n?/, '').replace(/\n?```$/, '').trim();

                // Skip if it's already been processed
                if (block.parentElement.classList.contains('mermaid-container')) {
                    return;
                }

                // Create container
                const container = document.createElement('div');
                container.className = 'mermaid-container';

                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid-chart-wrapper';

                // Create button group
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'mermaid-button-group';

                // Create toggle button
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'mermaid-toggle-btn';

                // Zoom controls
                const zoomOutBtn = document.createElement('button');
                zoomOutBtn.className = 'mermaid-zoom-btn';
                zoomOutBtn.textContent = '🔍−';
                zoomOutBtn.title = 'Zoom Out';

                const zoomInBtn = document.createElement('button');
                zoomInBtn.className = 'mermaid-zoom-btn';
                zoomInBtn.textContent = '🔍+';
                zoomInBtn.title = 'Zoom In';

                const zoomDisplay = document.createElement('div');
                zoomDisplay.className = 'mermaid-zoom-display';
                zoomDisplay.textContent = '100%';

                const resetBtn = document.createElement('button');
                resetBtn.className = 'mermaid-reset-btn';
                resetBtn.textContent = 'Reset Zoom';
                resetBtn.title = 'Reset zoom to 100%';

                // Create mermaid chart element
                const chartDiv = document.createElement('div');
                chartDiv.className = 'mermaid-chart';
                const mermaidContent = document.createElement('div');
                mermaidContent.className = 'mermaid-chart-content';
                const mermaidDiv = document.createElement('div');
                mermaidDiv.className = 'mermaid';
                mermaidDiv.textContent = chartCode;
                mermaidContent.appendChild(mermaidDiv);
                chartDiv.appendChild(mermaidContent);

                // Create code block display
                const codeDisplay = document.createElement('div');
                codeDisplay.className = 'mermaid-code-block';
                codeDisplay.textContent = code;

                // Zoom and pan state
                let currentZoom = 1;
                const minZoom = 0.5;
                const maxZoom = 3;
                const zoomStep = 0.1;
                let offsetX = 0;
                let offsetY = 0;
                let isDragging = false;
                let dragStartX = 0;
                let dragStartY = 0;
                let dragStartOffsetX = 0;
                let dragStartOffsetY = 0;

                function updateZoomDisplay() {
                    zoomDisplay.textContent = Math.round(currentZoom * 100) + '%';
                    zoomOutBtn.disabled = currentZoom <= minZoom;
                    zoomInBtn.disabled = currentZoom >= maxZoom;
                }

                function applyTransform() {
                    mermaidContent.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentZoom})`;
                    updateZoomDisplay();
                }

                zoomInBtn.addEventListener('click', function() {
                    if (currentZoom < maxZoom) {
                        currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
                        applyTransform();
                    }
                });

                zoomOutBtn.addEventListener('click', function() {
                    if (currentZoom > minZoom) {
                        currentZoom = Math.max(currentZoom - zoomStep, minZoom);
                        applyTransform();
                    }
                });

                resetBtn.addEventListener('click', function() {
                    currentZoom = 1;
                    offsetX = 0;
                    offsetY = 0;
                    applyTransform();
                });

                // Pan functionality with mouse drag
                chartDiv.addEventListener('mousedown', function(e) {
                    // Only drag when zoomed in
                    if (currentZoom > 1) {
                        isDragging = true;
                        dragStartX = e.clientX;
                        dragStartY = e.clientY;
                        dragStartOffsetX = offsetX;
                        dragStartOffsetY = offsetY;
                        chartDiv.classList.add('dragging');
                        mermaidContent.classList.add('no-transition');
                    }
                });

                document.addEventListener('mousemove', function(e) {
                    if (isDragging && currentZoom > 1) {
                        const deltaX = e.clientX - dragStartX;
                        const deltaY = e.clientY - dragStartY;
                        offsetX = dragStartOffsetX + deltaX;
                        offsetY = dragStartOffsetY + deltaY;
                        applyTransform();
                    }
                });

                document.addEventListener('mouseup', function() {
                    if (isDragging) {
                        isDragging = false;
                        chartDiv.classList.remove('dragging');
                        mermaidContent.classList.remove('no-transition');
                    }
                });

                // Prevent text selection while dragging
                chartDiv.addEventListener('selectstart', function(e) {
                    if (isDragging) {
                        e.preventDefault();
                    }
                });

                // Set initial state based on preference
                const showChart = showChartByDefault;
                if (!showChart) {
                    chartDiv.classList.add('hidden');
                    codeDisplay.classList.remove('hidden');
                    toggleBtn.textContent = 'Show Chart';
                } else {
                    codeDisplay.classList.add('hidden');
                    toggleBtn.textContent = 'Show Code';
                }

                // Toggle functionality - toggles between chart and code
                toggleBtn.addEventListener('click', function() {
                    const chartHidden = chartDiv.classList.contains('hidden');

                    if (chartHidden) {
                        // Show chart, hide code
                        chartDiv.classList.remove('hidden');
                        codeDisplay.classList.add('hidden');
                        toggleBtn.textContent = 'Show Code';
                    } else {
                        // Show code, hide chart
                        chartDiv.classList.add('hidden');
                        codeDisplay.classList.add('hidden');
                        toggleBtn.textContent = 'Show Chart';
                    }
                });

                // Add buttons to group
                buttonGroup.appendChild(toggleBtn);
                buttonGroup.appendChild(zoomOutBtn);
                buttonGroup.appendChild(zoomInBtn);
                buttonGroup.appendChild(zoomDisplay);
                buttonGroup.appendChild(resetBtn);

                wrapper.appendChild(buttonGroup);
                wrapper.appendChild(chartDiv);
                wrapper.appendChild(codeDisplay);

                container.appendChild(wrapper);

                // Replace the original code block
                block.parentElement.replaceChild(container, block);

                // Re-initialize mermaid for the new chart
                mermaid.contentLoaded();

                // Update zoom display on load
                updateZoomDisplay();
            }
        });
    }

    function observeNewCharts() {
        // Watch for new messages/code blocks being added
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if the added node or its children contain code blocks
                            const codeBlocks = node.querySelectorAll ? node.querySelectorAll('pre') : [];
                            if (codeBlocks.length > 0) {
                                scanAndRenderCharts();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();