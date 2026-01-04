// ==UserScript==
// @name         Better NotebookLM
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Enhanced NotebookLM: Auto-collapse sidebar, resizable Studio panel, UI improvements
// @author       djshigel
// @license      MIT
// @match        https://notebooklm.google.com/*
// @match        https://notebooklm.google/*
// @icon         https://notebooklm.google.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550290/Better%20NotebookLM.user.js
// @updateURL https://update.greasyfork.org/scripts/550290/Better%20NotebookLM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        defaultStudioWidth: 30, // Default Studio panel width (%)
        expandStudioWidth: 53, // Width to expand Studio panel when min-inline-size is detected (%)
        minPanelWidth: 20, // Minimum panel width (%)
        maxPanelWidth: 80, // Maximum panel width (%)
        dragHandleWidth: 8, // Drag handle width (px)
        rightPanelOffset: 88, // Fixed offset to prevent right panel overflow (px)
        sourcePanelWidth: 395, // Source panel width when expanded (px)
        sourcePanelCollapsedWidth: 56, // Source panel width when collapsed (px)
    };

    // ========================
    // Auto-collapse sidebar
    // ========================
    
    function collapseSidebar() {
        const panel = document.querySelector('section.source-panel:not(.panel-collapsed)');
        
        if (panel) {
            const toggleButton = panel.querySelector('button.toggle-source-panel-button');
            
            if (toggleButton) {
                toggleButton.click();
                console.log('Better NotebookLM: Sidebar collapsed');
                return true;
            }
        }
        
        const collapsedPanel = document.querySelector('section.source-panel.panel-collapsed');
        if (collapsedPanel) {
            return true;
        }
        
        return false;
    }

    // ========================
    // Studio panel resizer
    // ========================
    
    let dragHandlers = {
        mousedown: null,
        mousemove: null,
        mouseup: null
    };
    
    let resizerInitialized = false;
    
    function destroyStudioResizer() {
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        const gutter = studioPanel?.previousElementSibling;
        const chatPanel = gutter?.previousElementSibling;
        
        if (gutter && gutter.dataset.resizerInitialized) {
            // Remove event listeners
            if (dragHandlers.mousedown) {
                gutter.removeEventListener('mousedown', dragHandlers.mousedown);
            }
            if (dragHandlers.mousemove) {
                document.removeEventListener('mousemove', dragHandlers.mousemove);
            }
            if (dragHandlers.mouseup) {
                document.removeEventListener('mouseup', dragHandlers.mouseup);
            }
            
            // Reset gutter styles
            gutter.style.cursor = '';
            gutter.style.backgroundColor = '';
            gutter.style.width = '';
            delete gutter.dataset.resizerInitialized;
            
            // Remove ALL custom styles from panels
            if (studioPanel) {
                studioPanel.removeAttribute('style');
                // Force collapsed width after removing styles
                if (studioPanel.classList.contains('panel-collapsed')) {
                    studioPanel.style.setProperty('width', '56px', 'important');
                    studioPanel.style.setProperty('min-width', '56px', 'important');
                    studioPanel.style.setProperty('max-width', '56px', 'important');
                    studioPanel.style.setProperty('flex', '0 0 56px', 'important');
                }
            }
            if (chatPanel) {
                chatPanel.removeAttribute('style');
            }
            
            // Reset initialization flag
            resizerInitialized = false;
            
            console.log('Better NotebookLM: Studio resizer destroyed');
        }
    }
    
    function observeStudioCollapse() {
        let lastCollapseState = null;
        let lastSourceCollapseState = null;
        
        const observer = new MutationObserver(() => {
            const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
            if (!studioPanel) return;
            
            // Check for min-inline-size and handle appropriately
            if (studioPanel.style.minInlineSize) {
                const minInlineValue = studioPanel.style.minInlineSize;
                
                // Always remove min-inline-size
                studioPanel.style.minInlineSize = '';
                
                // Only expand for specific large values (like 37.5vw that NotebookLM uses)
                // This indicates actual content like video or report is being shown
                if ((minInlineValue.includes('vw') && parseFloat(minInlineValue) >= 30) ||
                    (minInlineValue.includes('%') && parseFloat(minInlineValue) >= 40)) {
                    
                    if (!studioPanel.classList.contains('panel-collapsed')) {
                        // Collapse source panel when Studio content is opened
                        collapseSidebar();
                        
                        // Add transition for smooth animation
                        const chatPanel = document.querySelector('section.chat-panel');
                        if (chatPanel) {
                            studioPanel.style.transition = 'all 0.3s ease';
                            chatPanel.style.transition = 'all 0.3s ease';
                        }
                        
                        // Apply expanded width using helper function (considers source panel state)
                        applyStudioWidth(studioPanel, CONFIG.expandStudioWidth);
                        
                        // Save the expanded width
                        localStorage.setItem('betterNotebookLM_studioWidth', CONFIG.expandStudioWidth.toString());
                        
                        // Remove transition after animation
                        setTimeout(() => {
                            studioPanel.style.transition = '';
                            if (chatPanel) chatPanel.style.transition = '';
                        }, 300);
                        
                        console.log(`Better NotebookLM: Detected ${minInlineValue} - expanded Studio to ${CONFIG.expandStudioWidth}%, source panel collapsed`);
                    }
                } else {
                    console.log(`Better NotebookLM: Removed min-inline-size (${minInlineValue})`);
                }
            }
            
            const isCollapsed = studioPanel.classList.contains('panel-collapsed');
            
            // Check source panel state
            const sourcePanel = document.querySelector('section.source-panel');
            const isSourceCollapsed = sourcePanel?.classList.contains('panel-collapsed') ?? true;
            
            // Only act if state actually changed
            if (lastCollapseState !== isCollapsed || lastSourceCollapseState !== isSourceCollapsed) {
                lastCollapseState = isCollapsed;
                lastSourceCollapseState = isSourceCollapsed;
                
                if (isCollapsed) {
                    // Destroy resizer when collapsed
                    destroyStudioResizer();
                    
                    // Force Studio panel width to 56px when collapsed
                    studioPanel.style.setProperty('width', '56px', 'important');
                    studioPanel.style.setProperty('min-width', '56px', 'important');
                    studioPanel.style.setProperty('max-width', '56px', 'important');
                    studioPanel.style.setProperty('flex', '0 0 56px', 'important');
                    
                    // Remove flex and max-width from chat panel when Studio is collapsed
                    const chatPanel = document.querySelector('section.chat-panel');
                    if (chatPanel) {
                        chatPanel.style.flex = '';
                        chatPanel.style.maxWidth = '';
                        chatPanel.style.width = '';
                        chatPanel.style.minWidth = '';
                        console.log('Better NotebookLM: Removed chat panel custom styles on Studio collapse');
                    }
                    
                    console.log('Better NotebookLM: Studio collapsed - resizer destroyed, width forced to 56px');
                } else {
                    // Re-initialize resizer when expanded
                    setTimeout(() => {
                        resizerInitialized = false; // Reset flag before re-initializing
                        resizerInitialized = initStudioResizer();
                        
                        // Restore saved size if available (initStudioResizer already does this, but ensure it's applied)
                        const savedWidth = localStorage.getItem('betterNotebookLM_studioWidth');
                        if (savedWidth) {
                            // Use the helper function to ensure width is applied
                            if (applyStudioWidth(studioPanel, savedWidth)) {
                                console.log(`Better NotebookLM: Studio expanded - width restored to ${savedWidth}%`);
                            }
                        }
                        
                        if (resizerInitialized) {
                            console.log('Better NotebookLM: Studio expanded - resizer restored');
                        }
                    }, 100);
                }
                
                // When source panel state changes, re-apply Studio width to ensure proper layout
                if (!isCollapsed) {
                    // Use multiple timeouts to ensure layout has settled after source panel animation
                    const savedWidth = localStorage.getItem('betterNotebookLM_studioWidth');
                    if (savedWidth) {
                        // Immediate apply
                        applyStudioWidth(studioPanel, savedWidth);
                        
                        // Re-apply after short delay
                        setTimeout(() => {
                            applyStudioWidth(studioPanel, savedWidth);
                        }, 50);
                        
                        // Re-apply after medium delay
                        setTimeout(() => {
                            applyStudioWidth(studioPanel, savedWidth);
                            console.log(`Better NotebookLM: Source panel state changed (${isSourceCollapsed ? 'closed' : 'open'}) - Studio width reapplied to ${savedWidth}%`);
                        }, 200);
                        
                        // Re-apply after longer delay to catch any late layout changes
                        setTimeout(() => {
                            applyStudioWidth(studioPanel, savedWidth);
                        }, 500);
                    }
                }
            }
        });
        
        // Observe the entire document for class changes
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'style'],
            subtree: true
        });
        
        return observer;
    }
    
    function isSourcePanelOpen() {
        const sourcePanel = document.querySelector('section.source-panel');
        return sourcePanel && !sourcePanel.classList.contains('panel-collapsed');
    }
    
    function getSourcePanelWidth() {
        const sourcePanel = document.querySelector('section.source-panel');
        if (!sourcePanel) return 0;
        // Get actual width, not fixed value
        return sourcePanel.offsetWidth || (isSourcePanelOpen() ? CONFIG.sourcePanelWidth : 0);
    }
    
    function getAvailableWidth() {
        // Get the actual container that holds chat and Studio panels
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        const chatPanel = document.querySelector('section.chat-panel');
        
        if (!studioPanel || !chatPanel) return window.innerWidth;
        
        // Find common parent container
        let container = studioPanel.parentElement;
        while (container && container !== document.body) {
            if (container.contains(studioPanel) && container.contains(chatPanel)) {
                // Check if this is the direct container (both panels are direct children or in same flex container)
                const children = Array.from(container.children);
                const hasBothPanels = children.some(child => 
                    child === chatPanel || child === studioPanel || 
                    child.contains(chatPanel) || child.contains(studioPanel)
                );
                if (hasBothPanels) {
                    break;
                }
            }
            container = container.parentElement;
        }
        
        // If container not found, use window width minus source panel
        if (!container || container === document.body) {
            return window.innerWidth - getSourcePanelWidth();
        }
        
        // Get actual container width
        const containerWidth = container.offsetWidth || container.clientWidth;
        return containerWidth;
    }
    
    function applyStudioWidth(studioPanel, widthPercent) {
        if (!studioPanel || studioPanel.classList.contains('panel-collapsed')) return false;
        
        const gutter = studioPanel.previousElementSibling;
        const chatPanel = gutter?.previousElementSibling;
        
        if (!chatPanel) return false;
        
        // Wait a bit for layout to settle
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const widthValue = parseFloat(widthPercent);
                
                // Get the actual container that holds both panels
                let container = studioPanel.parentElement;
                while (container && container !== document.body) {
                    if (container.contains(chatPanel) && container.contains(studioPanel)) {
                        break;
                    }
                    container = container.parentElement;
                }
                
                if (!container || container === document.body) {
                    console.warn('Better NotebookLM: Could not find container');
                    return;
                }
                
                // Get actual container width
                const containerWidth = container.offsetWidth || container.clientWidth;
                if (!containerWidth || containerWidth === 0) {
                    console.warn('Better NotebookLM: Container width is 0');
                    return;
                }
                
                // Calculate available width (subtract source panel width if open, but add back collapsed width)
                const sourcePanelOpen = isSourcePanelOpen();
                const sourcePanelWidth = sourcePanelOpen ? getSourcePanelWidth() : 0;
                // When source panel is open, we only need to subtract the difference (expanded - collapsed)
                // This allows Studio to be larger when source panel is open
                const sourcePanelWidthDiff = sourcePanelOpen ? (sourcePanelWidth - CONFIG.sourcePanelCollapsedWidth) : 0;
                const availableWidth = containerWidth - sourcePanelWidthDiff;
                
                // Calculate pixel widths based on available width
                // The widthPercent is relative to the space available for chat and Studio panels
                const studioWidthPx = Math.floor((availableWidth * widthValue / 100) - CONFIG.rightPanelOffset);
                const chatWidthPx = Math.floor(availableWidth - studioWidthPx - CONFIG.rightPanelOffset);
                
                // Apply widths with !important to override any other styles
                studioPanel.style.setProperty('flex', '0 0 auto', 'important');
                studioPanel.style.setProperty('max-width', `${studioWidthPx}px`, 'important');
                studioPanel.style.setProperty('width', `${studioWidthPx}px`, 'important');
                studioPanel.style.setProperty('min-width', `${studioWidthPx}px`, 'important');
                
                chatPanel.style.setProperty('flex', '0 0 auto', 'important');
                chatPanel.style.setProperty('max-width', `${chatWidthPx}px`, 'important');
                chatPanel.style.setProperty('width', `${chatWidthPx}px`, 'important');
                chatPanel.style.setProperty('min-width', `${chatWidthPx}px`, 'important');
                
                console.log(`Better NotebookLM: Applied Studio width - ${widthValue}% of ${availableWidth}px available (container: ${containerWidth}px, source ${sourcePanelOpen ? 'open (diff: ' + sourcePanelWidthDiff + 'px)' : 'closed'}) = ${studioWidthPx}px, chat = ${chatWidthPx}px`);
            });
        });
        
        return true;
    }
    
    function initStudioResizer() {
        // Find the gutter between chat and Studio panels
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        if (!studioPanel) return false;
        
        // Don't initialize if Studio is collapsed
        if (studioPanel.classList.contains('panel-collapsed')) {
            console.log('Better NotebookLM: Studio is collapsed, skipping resizer init');
            return false;
        }
        
        // Find the gutter that's immediately before the Studio panel
        const gutter = studioPanel.previousElementSibling;
        if (!gutter || !gutter.classList.contains('panel-gutter')) return false;
        
        // Get chat panel
        const chatPanel = gutter.previousElementSibling;
        if (!chatPanel) return false;
        
        // Skip if already initialized
        if (gutter.dataset.resizerInitialized) {
            // Re-apply saved width even if already initialized
            const savedWidth = localStorage.getItem('betterNotebookLM_studioWidth');
            if (savedWidth) {
                applyStudioWidth(studioPanel, savedWidth);
            }
            return true;
        }
        
        // Apply resize handle styles
        gutter.style.cursor = 'col-resize';
        gutter.style.position = 'relative';
        gutter.style.userSelect = 'none';
        gutter.style.width = CONFIG.dragHandleWidth + 'px';
        gutter.style.backgroundColor = 'transparent';
        gutter.style.transition = 'background-color 0.2s';
        
        // Visual feedback on hover
        gutter.addEventListener('mouseenter', () => {
            gutter.style.backgroundColor = 'rgba(66, 133, 244, 0.2)';
        });
        
        gutter.addEventListener('mouseleave', () => {
            if (!gutter.dataset.dragging) {
                gutter.style.backgroundColor = 'transparent';
            }
        });
        
        // Drag handling
        let isDragging = false;
        let startX = 0;
        let startRightWidth = 0;
        let rightPanel = studioPanel;
        let container = null;
        
        const handleMouseDown = (e) => {
            // Collapse source panel when handle is clicked
            collapseSidebar();
            
            isDragging = true;
            startX = e.clientX;
            gutter.dataset.dragging = 'true';
            gutter.style.backgroundColor = 'rgba(66, 133, 244, 0.4)';
            
            // Find the actual container
            let containerElement = rightPanel.parentElement;
            while (containerElement && containerElement !== document.body) {
                if (containerElement.contains(chatPanel) && containerElement.contains(rightPanel)) {
                    break;
                }
                containerElement = containerElement.parentElement;
            }
            container = containerElement;
            
            if (rightPanel && container) {
                // Get actual container width and calculate available width
                const containerWidth = container.offsetWidth || container.clientWidth;
                if (containerWidth > 0) {
                    const sourcePanelOpen = isSourcePanelOpen();
                    const sourcePanelWidth = sourcePanelOpen ? getSourcePanelWidth() : 0;
                    // When source panel is open, we only need to subtract the difference (expanded - collapsed)
                    const sourcePanelWidthDiff = sourcePanelOpen ? (sourcePanelWidth - CONFIG.sourcePanelCollapsedWidth) : 0;
                    const availableWidth = containerWidth - sourcePanelWidthDiff;
                    // Calculate percentage relative to available width
                    startRightWidth = (rightPanel.offsetWidth / availableWidth) * 100;
                }
            }
            
            // Prevent cursor and text selection during drag
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            
            // Add overlay to prevent iframe interference
            const overlay = document.createElement('div');
            overlay.id = 'resize-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                cursor: col-resize;
            `;
            document.body.appendChild(overlay);
            
            e.preventDefault();
        };
        
        const handleMouseMove = (e) => {
            if (!isDragging || !chatPanel || !rightPanel || !container) return;
            
            // Get actual container width and calculate available width
            const containerWidth = container.offsetWidth || container.clientWidth;
            if (!containerWidth || containerWidth === 0) return;
            
            const sourcePanelOpen = isSourcePanelOpen();
            const sourcePanelWidth = sourcePanelOpen ? getSourcePanelWidth() : 0;
            // When source panel is open, we only need to subtract the difference (expanded - collapsed)
            const sourcePanelWidthDiff = sourcePanelOpen ? (sourcePanelWidth - CONFIG.sourcePanelCollapsedWidth) : 0;
            const availableWidth = containerWidth - sourcePanelWidthDiff;
            
            const deltaX = e.clientX - startX;
            const deltaPercent = (deltaX / availableWidth) * 100;
            let newRightWidth = startRightWidth - deltaPercent;
            
            // Limit width
            newRightWidth = Math.max(CONFIG.minPanelWidth, Math.min(CONFIG.maxPanelWidth, newRightWidth));
            
            // Calculate pixel widths based on available width
            const studioWidthPx = Math.floor((availableWidth * newRightWidth / 100) - CONFIG.rightPanelOffset);
            const chatWidthPx = Math.floor(availableWidth - studioWidthPx - CONFIG.rightPanelOffset);
            
            // Update panel sizes using pixel values with !important
            chatPanel.style.setProperty('flex', '0 0 auto', 'important');
            chatPanel.style.setProperty('max-width', `${chatWidthPx}px`, 'important');
            chatPanel.style.setProperty('width', `${chatWidthPx}px`, 'important');
            chatPanel.style.setProperty('min-width', `${chatWidthPx}px`, 'important');
            
            rightPanel.style.setProperty('flex', '0 0 auto', 'important');
            rightPanel.style.setProperty('max-width', `${studioWidthPx}px`, 'important');
            rightPanel.style.setProperty('width', `${studioWidthPx}px`, 'important');
            rightPanel.style.setProperty('min-width', `${studioWidthPx}px`, 'important');
            
            // Save percentage to localStorage (relative to container width)
            localStorage.setItem('betterNotebookLM_studioWidth', newRightWidth.toString());
            
            e.preventDefault();
        };
        
        const handleMouseUp = () => {
            if (!isDragging) return;
            
            isDragging = false;
            delete gutter.dataset.dragging;
            gutter.style.backgroundColor = 'transparent';
            
            // Restore cursor and text selection
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            // Remove overlay
            const overlay = document.getElementById('resize-overlay');
            if (overlay) overlay.remove();
        };
        
        // Store handlers globally for cleanup
        dragHandlers.mousedown = handleMouseDown;
        dragHandlers.mousemove = handleMouseMove;
        dragHandlers.mouseup = handleMouseUp;
        
        gutter.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Add mousedown listener to Studio panel to collapse source panel
        const handleStudioMouseDown = (e) => {
            // Only collapse if not clicking on interactive elements (buttons, links, inputs, etc.)
            const target = e.target;
            const isInteractive = target.tagName === 'BUTTON' || 
                                  target.tagName === 'A' || 
                                  target.tagName === 'INPUT' || 
                                  target.tagName === 'TEXTAREA' ||
                                  target.closest('button, a, input, textarea, [role="button"]');
            
            if (!isInteractive) {
                collapseSidebar();
            }
        };
        
        studioPanel.addEventListener('mousedown', handleStudioMouseDown);
        
        // Mark as initialized
        gutter.dataset.resizerInitialized = 'true';
        
        // Apply saved width
        const savedWidth = localStorage.getItem('betterNotebookLM_studioWidth');
        if (savedWidth) {
            applyStudioWidth(studioPanel, savedWidth);
        }
        
        console.log('Better NotebookLM: Studio resizer initialized');
        return true;
    }

    // ========================
    // Main processing
    // ========================
    
    let sidebarProcessed = false;
    let retryCount = 0;
    const maxRetries = 20;
    
    function processElements() {
        // Process sidebar
        if (!sidebarProcessed) {
            sidebarProcessed = collapseSidebar();
        }
        
        // Initialize Studio resizer
        if (!resizerInitialized) {
            const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
            
            // If Studio exists and is collapsed, mark as complete but don't initialize
            if (studioPanel && studioPanel.classList.contains('panel-collapsed')) {
                // Force Studio panel width to 56px when collapsed
                studioPanel.style.setProperty('width', '56px', 'important');
                studioPanel.style.setProperty('min-width', '56px', 'important');
                studioPanel.style.setProperty('max-width', '56px', 'important');
                studioPanel.style.setProperty('flex', '0 0 56px', 'important');
                resizerInitialized = true;
                console.log('Better NotebookLM: Studio is collapsed, width forced to 56px');
            } else {
                resizerInitialized = initStudioResizer();
            }
        }
        
        // Check completion
        if ((sidebarProcessed && resizerInitialized) || retryCount >= maxRetries) {
            if (retryCount >= maxRetries) {
                console.log('Better NotebookLM: Maximum retries reached');
            } else {
                console.log('Better NotebookLM: All features enabled');
            }
            return true;
        }
        
        return false;
    }
    
    // Periodic element check
    const checkInterval = setInterval(() => {
        retryCount++;
        
        if (processElements()) {
            clearInterval(checkInterval);
            // Start observing Studio collapse state after initialization
            observeStudioCollapse();
        }
    }, 500);
    
    // Handle page navigation
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('Better NotebookLM: Page changed, reinitializing...');
            
            // Reset flags
            sidebarProcessed = false;
            resizerInitialized = false;
            retryCount = 0;
            
            setTimeout(() => {
                const retryInterval = setInterval(() => {
                    retryCount++;
                    
                    if (!sidebarProcessed) {
                        sidebarProcessed = collapseSidebar();
                    }
                    
                    if (!resizerInitialized) {
                        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
                        if (studioPanel && studioPanel.classList.contains('panel-collapsed')) {
                            // Force Studio panel width to 56px when collapsed
                            studioPanel.style.setProperty('width', '56px', 'important');
                            studioPanel.style.setProperty('min-width', '56px', 'important');
                            studioPanel.style.setProperty('max-width', '56px', 'important');
                            studioPanel.style.setProperty('flex', '0 0 56px', 'important');
                            resizerInitialized = true;
                        } else {
                            resizerInitialized = initStudioResizer();
                        }
                    }
                    
                    if ((sidebarProcessed && resizerInitialized) || retryCount >= 10) {
                        clearInterval(retryInterval);
                        observeStudioCollapse();
                    }
                }, 500);
            }, 1000);
        }
    });
    
    // Monitor URL changes
    urlObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // ========================
    // Style injection
    // ========================
    
    const style = document.createElement('style');
    style.textContent = `
        /* Force logo margins */
        labs-tailwind-logo img {
            margin-left: 5px !important;
            margin-right: 5px !important;
        }
        
        /* Force Source panel expanded width */
        section.source-panel:not(.panel-collapsed) {
            width: 395px !important;
            min-width: 395px !important;
            max-width: 395px !important;
            flex: 0 0 395px !important;
        }
        
        /* Panel gutter hover effect */
        .panel-gutter[data-resizer-initialized="true"] {
            position: relative;
            z-index: 100;
        }
        
        .panel-gutter[data-resizer-initialized="true"]::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 3px;
            background: rgba(66, 133, 244, 0.5);
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .panel-gutter[data-resizer-initialized="true"]:hover::before {
            opacity: 1;
        }
        
        /* Disable animations during drag to prevent jitter */
        .panel-gutter[data-dragging="true"] ~ *,
        .panel-gutter[data-dragging="true"] ~ * * {
            transition: none !important;
        }
        
        /* Source panel collapsed state - hide scrollbar until hover */
        .source-panel.panel-collapsed .source-panel-content {
            overflow: hidden !important;
        }
        
        .source-panel.panel-collapsed .source-panel-content:hover {
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }
        
        /* Force Studio panel width when collapsed */
        section.studio-panel.panel-collapsed,
        section[class*="studio"].panel-collapsed,
        section[class*="right-panel"].panel-collapsed {
            width: 56px !important;
            min-width: 56px !important;
            max-width: 56px !important;
            flex: 0 0 56px !important;
        }
        
        /* Remove min-inline-size from Studio panel */
        section.studio-panel,
        section[class*="studio"],
        section[class*="right-panel"] {
            min-inline-size: unset !important;
        }
        
        /* Chat panel should use available space when Studio is collapsed */
        section.chat-panel:has(~ .panel-collapsed) {
            flex: 1 1 auto !important;
            max-width: none !important;
        }
        
        /* Sticky Studio panel buttons to prevent overflow */
        .studio-panel button.toggle-studio-panel-button,
        .studio-panel button[aria-label*="Studio"],
        .studio-panel button[aria-label*="メモ"],
        .studio-panel button[aria-label*="note"] {
            position: sticky;
            right: 0;
            z-index: 10;
        }
        
        /* Studio panel header sticky positioning */
        .studio-panel .panel-header,
        .studio-panel .studio-header {
            position: sticky;
            top: 0;
            z-index: 10;
            background: inherit;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Better NotebookLM: Initialization complete');
    
    // Additional monitoring for min-inline-size changes as a backup
    const styleObserver = new MutationObserver(() => {
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        if (studioPanel && studioPanel.style.minInlineSize) {
            const minInlineValue = studioPanel.style.minInlineSize;
            
            // Always remove min-inline-size
            studioPanel.style.minInlineSize = '';
            
            // Only expand for specific large values
            if ((minInlineValue.includes('vw') && parseFloat(minInlineValue) >= 30) ||
                (minInlineValue.includes('%') && parseFloat(minInlineValue) >= 40)) {
                
                if (!studioPanel.classList.contains('panel-collapsed')) {
                    // Collapse source panel when Studio content is opened
                    collapseSidebar();
                    
                    // Add transition for smooth animation
                    const chatPanel = document.querySelector('section.chat-panel');
                    if (chatPanel) {
                        studioPanel.style.transition = 'all 0.3s ease';
                        chatPanel.style.transition = 'all 0.3s ease';
                    }
                    
                    // Apply expanded width using helper function
                    applyStudioWidth(studioPanel, CONFIG.expandStudioWidth);
                    
                    // Save the expanded width
                    localStorage.setItem('betterNotebookLM_studioWidth', CONFIG.expandStudioWidth.toString());
                    
                    // Remove transition after animation
                    setTimeout(() => {
                        studioPanel.style.transition = '';
                        if (chatPanel) chatPanel.style.transition = '';
                    }, 300);
                    
                    console.log(`Better NotebookLM (backup): Detected ${minInlineValue} - expanded to ${CONFIG.expandStudioWidth}%, source panel collapsed`);
                }
            }
        }
    });
    
    // Start monitoring after initial setup
    setTimeout(() => {
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        if (studioPanel) {
            styleObserver.observe(studioPanel, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
    }, 2000);
    
    // Re-apply Studio width on window resize to ensure proper layout
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
            if (studioPanel && !studioPanel.classList.contains('panel-collapsed')) {
                const savedWidth = localStorage.getItem('betterNotebookLM_studioWidth');
                if (savedWidth) {
                    applyStudioWidth(studioPanel, savedWidth);
                    console.log(`Better NotebookLM: Window resized - Studio width reapplied to ${savedWidth}%`);
                }
            }
        }, 150);
    });
    
    // Use ResizeObserver to watch for container size changes
    let containerResizeObserver = null;
    function setupContainerResizeObserver() {
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        const chatPanel = document.querySelector('section.chat-panel');
        
        if (!studioPanel || !chatPanel) return;
        
        // Find the container
        let container = studioPanel.parentElement;
        while (container && container !== document.body) {
            if (container.contains(chatPanel) && container.contains(studioPanel)) {
                break;
            }
            container = container.parentElement;
        }
        
        if (!container || container === document.body) return;
        
        // Clean up existing observer
        if (containerResizeObserver) {
            containerResizeObserver.disconnect();
        }
        
        // Create new observer
        containerResizeObserver = new ResizeObserver(() => {
            if (studioPanel && !studioPanel.classList.contains('panel-collapsed')) {
                const savedWidth = localStorage.getItem('betterNotebookLM_studioWidth');
                if (savedWidth) {
                    // Debounce the resize observer
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        applyStudioWidth(studioPanel, savedWidth);
                        console.log(`Better NotebookLM: Container resized - Studio width reapplied to ${savedWidth}%`);
                    }, 100);
                }
            }
        });
        
        containerResizeObserver.observe(container);
        console.log('Better NotebookLM: Container resize observer set up');
    }
    
    // Set up resize observer after initial setup
    setTimeout(() => {
        setupContainerResizeObserver();
    }, 2000);
    
    // Re-setup observer when panels change
    const observerForResizeSetup = new MutationObserver(() => {
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        const chatPanel = document.querySelector('section.chat-panel');
        if (studioPanel && chatPanel && !containerResizeObserver) {
            setupContainerResizeObserver();
        }
    });
    
    observerForResizeSetup.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Monitor Studio panel to ensure collapsed width is always 56px
    const studioPanelWidthObserver = new MutationObserver(() => {
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        if (studioPanel && studioPanel.classList.contains('panel-collapsed')) {
            const currentWidth = studioPanel.offsetWidth || parseFloat(window.getComputedStyle(studioPanel).width);
            // If width is not 56px, force it
            if (currentWidth !== 56) {
                studioPanel.style.setProperty('width', '56px', 'important');
                studioPanel.style.setProperty('min-width', '56px', 'important');
                studioPanel.style.setProperty('max-width', '56px', 'important');
                studioPanel.style.setProperty('flex', '0 0 56px', 'important');
                console.log(`Better NotebookLM: Studio panel collapsed width corrected from ${currentWidth}px to 56px`);
            }
        }
    });
    
    // Start monitoring after initial setup
    setTimeout(() => {
        const studioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
        if (studioPanel) {
            studioPanelWidthObserver.observe(studioPanel, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
            // Also observe the document for new Studio panels
            const documentObserver = new MutationObserver(() => {
                const newStudioPanel = document.querySelector('section.studio-panel, [class*="studio"], [class*="right-panel"]');
                if (newStudioPanel && newStudioPanel.classList.contains('panel-collapsed')) {
                    newStudioPanel.style.setProperty('width', '56px', 'important');
                    newStudioPanel.style.setProperty('min-width', '56px', 'important');
                    newStudioPanel.style.setProperty('max-width', '56px', 'important');
                    newStudioPanel.style.setProperty('flex', '0 0 56px', 'important');
                }
            });
            documentObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }, 2000);
    
})();
