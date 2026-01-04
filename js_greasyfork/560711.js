// ==UserScript==
// @name         Magma Partner Panel Be Gone
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Remove the partner/ad panel on the magma canvas, resize the UI accordingly.
// @author       KloudKat42
// @match        https://magma.com/d/*
// @match        https://magma.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560711/Magma%20Partner%20Panel%20Be%20Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/560711/Magma%20Partner%20Panel%20Be%20Gone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isPanelHidden = true; // Always start with panel hidden
    const TRANSITION_DURATION = 0; // milliseconds (instant)

    // Inject style to ensure panel can slide off screen
    function injectStyles() {
        if (document.getElementById('magma-toggle-styles')) return;

        const style = document.createElement('style');
        style.id = 'magma-toggle-styles';
        style.textContent = `
            /* Allow panel parent containers to show overflow for sliding */
            [data-magma-panel] {
                overflow: visible !important;
                overflow-x: visible !important;
                will-change: transform;
            }

            /* Ensure toggle button is visible */
            #magma-panel-toggle {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);
    }


    // Find the partner/ad panel (editor-outest element)
    function findPartnerPanel() {
        // Target editor-outest which contains the partnership/ad content
        const selectors = [
            '[class*="editor-outest"]',
            'editor-outest'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                // Verify it contains partnership content
                const hasPartnershipContent = el.querySelector('[class*="partnership-content"]') ||
                                             el.querySelector('partnership-content');

                if (hasPartnershipContent && el.offsetParent !== null) {
                    return el;
                }
            }
        }

        // Fallback: look for partnership-content parent
        const partnershipElements = document.querySelectorAll('[class*="partnership-content"], partnership-content');
        for (const el of partnershipElements) {
            let parent = el.parentElement;
            let depth = 0;
            while (parent && depth < 5) {
                if (parent.classList && parent.classList.toString().includes('editor-outest')) {
                    return parent;
                }
                parent = parent.parentElement;
                depth++;
            }
        }

        return null;
    }

    // Find all UI elements that need to be resized (editor, toolbars, panels, etc.)
    function findResizableElements() {
        const elements = [];

        // Target specific Magma layout elements that need adjustment
        const targetSelectors = [
            '.editor',           // Main editor container (canvas area)
            '.editor-left',      // Left toolbar area (should move)
            '.editor-inner-top', // Top bar area (should expand width)
            '.editor-inner-bottom-1', // Bottom area 1 (should expand width)
            '.editor-inner-bottom-2', // Bottom area 2 (should expand width)
            '.container1',       // Right panel container 1
            '.container2',       // Right panel container 2
            '.container3'        // Right panel container 3
        ];

        targetSelectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            found.forEach(el => {
                // Skip the partner panel itself
                if (el.classList.toString().includes('editor-outest') &&
                    (el.querySelector('[class*="partnership-content"]') || el.querySelector('partnership-content'))) {
                    return;
                }

                const styles = window.getComputedStyle(el);
                // Should be positioned and visible
                if ((styles.position === 'absolute' || styles.position === 'fixed') &&
                    el.offsetParent !== null) {
                    // Only include elements that are actually sizable
                    if (el.offsetWidth > 50 || el.offsetHeight > 50) {
                        elements.push(el);
                    }
                }
            });
        });

        return elements;
    }

    // Store original positioning and sizing for an element
    function storeOriginalPositioning(el) {
        if (!el.dataset.magmaOriginalRight) {
            const styles = window.getComputedStyle(el);
            el.dataset.magmaOriginalRight = styles.right || 'auto';
            el.dataset.magmaOriginalLeft = styles.left || 'auto';
            el.dataset.magmaOriginalTop = styles.top || 'auto';
            el.dataset.magmaOriginalBottom = styles.bottom || 'auto';
            el.dataset.magmaOriginalWidth = styles.width || 'auto';
            el.dataset.magmaOriginalHeight = styles.height || 'auto';
            // Store computed dimensions for calculations
            el.dataset.magmaOriginalComputedWidth = el.offsetWidth.toString();
            el.dataset.magmaOriginalComputedHeight = el.offsetHeight.toString();
        }
    }

    // Adjust element positioning and sizing based on panel position
    function adjustElementPositioning(el, panelWidth, panelHeight, isRight, isLeft, isTop, isBottom) {
        storeOriginalPositioning(el);

        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        // Get original values from dataset
        const originalRight = parseFloat(el.dataset.magmaOriginalRight) || 0;
        const originalLeft = parseFloat(el.dataset.magmaOriginalLeft) || 0;
        const originalTop = parseFloat(el.dataset.magmaOriginalTop) || 0;
        const originalBottom = parseFloat(el.dataset.magmaOriginalBottom) || 0;
        const originalWidth = parseFloat(el.dataset.magmaOriginalWidth) || rect.width;
        const originalHeight = parseFloat(el.dataset.magmaOriginalHeight) || rect.height;

        const className = el.className;

        if (isRight) {
            // Panel on right - move elements anchored to right edge
            if (!isNaN(originalRight) && originalRight >= 0) {
                el.style.setProperty('right', `${Math.max(0, originalRight - panelWidth)}px`, 'important');
            }

            // Expand canvas area to fill the space
            if (className.includes('editor') && !className.includes('left') && !className.includes('right')) {
                // Expand width to fill the space left by the hidden panel
                if (!isNaN(originalLeft) && originalLeft >= 0 && (!isNaN(originalRight) || originalRight === 0)) {
                    el.style.setProperty('width', `${originalWidth + panelWidth}px`, 'important');
                }
            }

            // Expand top and bottom bars to fill the full width (from left edge to where right panel was)
            if (className.includes('editor-inner-top') || className.includes('editor-inner-bottom')) {
                // Expand width to fill the space left by the hidden panel
                if (!isNaN(originalLeft) && originalLeft >= 0 && (!isNaN(originalRight) || originalRight === 0)) {
                    el.style.setProperty('width', `${originalWidth + panelWidth}px`, 'important');
                }

                // Also adjust the editor-outer-top container's left position
                const outerTop = el.querySelector('.editor-outer-top') ||
                               document.querySelector('.editor-outer-top') ||
                               document.querySelector('[class*="editor-outer-top"]');
                if (outerTop) {
                    // When panel is hidden, remove left specification so it sticks to right
                    // When panel is visible, set left to 0 as normal
                    if (isPanelHidden) {
                        // Remove left property entirely when hidden so it sticks to right
                        outerTop.style.removeProperty('left');
                    } else {
                        // Set left to 0 when panel is visible
                        outerTop.style.setProperty('left', '0px', 'important');
                    }
                }
            }

            // Move left toolbar to the right when right panel is hidden
            if (className.includes('editor-left')) {
                // Keep left toolbar fixed - don't move it
            }

            el.style.setProperty('transition', `right ${TRANSITION_DURATION}ms ease-in-out, width ${TRANSITION_DURATION}ms ease-in-out`, 'important');
        } else if (isLeft) {
            // Panel on left - move elements anchored to left edge
            if (!isNaN(originalLeft) && originalLeft >= 0) {
                el.style.setProperty('left', `${Math.max(0, originalLeft - panelWidth)}px`, 'important');
            }
            el.style.setProperty('transition', `left ${TRANSITION_DURATION}ms ease-in-out`, 'important');
        } else if (isTop) {
            // Panel on top - move elements anchored to top edge
            if (!isNaN(originalTop) && originalTop >= 0) {
                el.style.setProperty('top', `${Math.max(0, originalTop - panelHeight)}px`, 'important');
            }
            el.style.setProperty('transition', `top ${TRANSITION_DURATION}ms ease-in-out`, 'important');
        } else if (isBottom) {
            // Panel on bottom - move elements anchored to bottom edge
            if (!isNaN(originalBottom) && originalBottom >= 0) {
                el.style.setProperty('bottom', `${Math.max(0, originalBottom - panelHeight)}px`, 'important');
            }
            el.style.setProperty('transition', `bottom ${TRANSITION_DURATION}ms ease-in-out`, 'important');
        }
    }

    // Restore element positioning and sizing
    function restoreElementPositioning(el) {
        if (el.dataset.magmaOriginalRight !== undefined) {
            el.style.setProperty('right', el.dataset.magmaOriginalRight, 'important');
            el.style.setProperty('left', el.dataset.magmaOriginalLeft, 'important');
            el.style.setProperty('top', el.dataset.magmaOriginalTop, 'important');
            el.style.setProperty('bottom', el.dataset.magmaOriginalBottom, 'important');
            el.style.setProperty('width', el.dataset.magmaOriginalWidth, 'important');
            el.style.setProperty('height', el.dataset.magmaOriginalHeight, 'important');
            el.style.setProperty('transition', `right ${TRANSITION_DURATION}ms ease-in-out, left ${TRANSITION_DURATION}ms ease-in-out, top ${TRANSITION_DURATION}ms ease-in-out, bottom ${TRANSITION_DURATION}ms ease-in-out, width ${TRANSITION_DURATION}ms ease-in-out, height ${TRANSITION_DURATION}ms ease-in-out`, 'important');
        }
    }

    // Update UI elements that need to adjust when panel is hidden
    function updateUIForPanelState() {
        const panel = findPartnerPanel();
        if (!panel) return;

        const panelStyles = window.getComputedStyle(panel);
        const rect = panel.getBoundingClientRect();
        const panelWidth = rect.width;
        const panelHeight = rect.height;

        // Store original panel properties if not already stored
        if (!panel.dataset.magmaOriginalPosition) {
            panel.dataset.magmaOriginalPosition = panelStyles.position || 'absolute';
            panel.dataset.magmaOriginalTransform = panelStyles.transform || 'none';
            panel.dataset.magmaOriginalRight = panelStyles.right || 'auto';
            panel.dataset.magmaOriginalLeft = panelStyles.left || 'auto';
            panel.dataset.magmaOriginalTop = panelStyles.top || 'auto';
            panel.dataset.magmaOriginalBottom = panelStyles.bottom || 'auto';
        }

        // Find all UI elements that need resizing
        const resizableElements = findResizableElements();

        // Determine panel position
        const isRight = rect.right >= window.innerWidth - 10;
        const isLeft = rect.left <= 10;
        const isTop = rect.top <= 10;
        const isBottom = rect.bottom >= window.innerHeight - 10;

        if (isPanelHidden) {
            // Slide panel off screen using proper positioning instead of transform
            if (isRight) {
                panel.style.setProperty('right', `-${panelWidth}px`, 'important');
                panel.style.setProperty('left', 'auto', 'important');
            } else if (isLeft) {
                panel.style.setProperty('left', `-${panelWidth}px`, 'important');
                panel.style.setProperty('right', 'auto', 'important');
            } else if (isTop) {
                panel.style.setProperty('top', `-${panelHeight}px`, 'important');
                panel.style.setProperty('bottom', 'auto', 'important');
            } else if (isBottom) {
                panel.style.setProperty('bottom', `-${panelHeight}px`, 'important');
                panel.style.setProperty('top', 'auto', 'important');
            }

            // Ensure panel is positioned correctly
            const originalPosition = panel.dataset.magmaOriginalPosition;
            if (originalPosition === 'static' || originalPosition === 'relative') {
                panel.style.setProperty('position', 'absolute', 'important');
            }

            panel.style.setProperty('transition', `right ${TRANSITION_DURATION}ms ease-in-out, left ${TRANSITION_DURATION}ms ease-in-out, top ${TRANSITION_DURATION}ms ease-in-out, bottom ${TRANSITION_DURATION}ms ease-in-out`, 'important');
            panel.style.setProperty('transform', 'none', 'important');

            // Adjust all resizable UI elements to expand into panel space
            resizableElements.forEach(el => {
                adjustElementPositioning(el, panelWidth, panelHeight, isRight, isLeft, isTop, isBottom);
            });

            // Force layout recalculation after state change
            setTimeout(() => {
                document.body.offsetHeight;
            }, TRANSITION_DURATION + 50);
        } else {
            // Restore panel position
            panel.style.setProperty('transition', `right ${TRANSITION_DURATION}ms ease-in-out, left ${TRANSITION_DURATION}ms ease-in-out, top ${TRANSITION_DURATION}ms ease-in-out, bottom ${TRANSITION_DURATION}ms ease-in-out`, 'important');

            // Restore original positioning
            panel.style.setProperty('right', panel.dataset.magmaOriginalRight, 'important');
            panel.style.setProperty('left', panel.dataset.magmaOriginalLeft, 'important');
            panel.style.setProperty('top', panel.dataset.magmaOriginalTop, 'important');
            panel.style.setProperty('bottom', panel.dataset.magmaOriginalBottom, 'important');
            panel.style.setProperty('transform', panel.dataset.magmaOriginalTransform || 'none', 'important');

            // Restore original position if needed
            if (panel.dataset.magmaOriginalPosition) {
                const originalPosition = panel.dataset.magmaOriginalPosition;
                if (originalPosition !== 'absolute' && originalPosition !== 'fixed') {
                    panel.style.setProperty('position', originalPosition, 'important');
                }
            }

            // Restore all resizable UI elements to original size
            resizableElements.forEach(el => {
                restoreElementPositioning(el);
            });

            // Force layout recalculation after state change
            setTimeout(() => {
                document.body.offsetHeight;
            }, TRANSITION_DURATION + 50);
        }

        // Force browser to recalculate layout immediately
        requestAnimationFrame(() => {
            document.body.offsetHeight; // Force reflow
        });
    }

    // Toggle panel visibility
    function togglePanel() {
        isPanelHidden = !isPanelHidden;
        updateUIForPanelState();

        // Save state to localStorage
        localStorage.setItem('magma-panel-hidden', isPanelHidden.toString());

        // If hiding the panel, trigger a reload to ensure proper scaling
        if (isPanelHidden) {
            // Use a small delay to allow the transition to start, then reload
            setTimeout(() => {
                location.reload();
            }, 100);
        }
    }

    // Initialize
    function init() {
        // Inject necessary styles
        injectStyles();

        // Load saved state
        const savedState = localStorage.getItem('magma-panel-hidden');
        if (savedState === 'true') {
            isPanelHidden = true;
        }

        // Wait for DOM to be ready and panel to exist
        const checkPanel = setInterval(() => {
            const panel = findPartnerPanel();
            if (panel) {
                clearInterval(checkPanel);

                // Store original position for restoration
                const panelStyles = window.getComputedStyle(panel);
                panel.dataset.magmaOriginalPosition = panelStyles.position || 'absolute';
                panel.dataset.magmaPanel = 'true'; // Mark panel for styling

                // Set initial state
                updateUIForPanelState();

                // No toggle button needed - panel is always hidden

                // Check for offset immediately to prevent flash when hidden
                if (isPanelHidden) {
                    const outerTop = document.querySelector('.editor-outer-top') ||
                                   document.querySelector('[class*="editor-outer-top"]');
                    if (outerTop) {
                        // Remove left property immediately when hidden to prevent flash
                        outerTop.style.removeProperty('left');
                        console.log('Removed left offset immediately for hidden panel state');
                    }
                }
            }
        }, 100);

        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkPanel), 10000);
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also watch for dynamic content changes (Angular app)
    const observer = new MutationObserver(() => {
        const panel = findPartnerPanel();
        if (panel) {
            updateUIForPanelState();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also watch for URL changes (navigation to canvas)
    const urlObserver = new MutationObserver(() => {
        if (window.location.href.includes('/d/')) {
            console.log('Detected navigation to canvas, checking top bar offset...');
            
            // Check and fix top bar offset immediately
            const outerTop = document.querySelector('.editor-outer-top') ||
                            document.querySelector('[class*="editor-outer-top"]');
            if (outerTop) {
                // Check if the top bar has the hidden class to determine state
                const isHidden = outerTop.classList.contains('bar-hidden');
                
                if (isHidden) {
                    // Remove left property entirely when hidden so it sticks to right
                    outerTop.style.removeProperty('left');
                    console.log('Removed left offset for hidden panel state (detected via class)');
                } else {
                    // Set left to 0 when panel is visible
                    outerTop.style.setProperty('left', '0px', 'important');
                    console.log('Set left offset to 0 for visible panel state (detected via class)');
                }
            }
        }
    });
    
    urlObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also watch for the top bar toggle button
    const buttonObserver = new MutationObserver(() => {
        // Look for the toggle button that appears in the top bar
        const toggleButton = document.querySelector('svg-icon[class*="faChevronDown"]') ||
                           document.querySelector('svg[class*="icon-faChevronDown"]') ||
                           document.querySelector('button[aria-label*="toggle"]') ||
                           document.querySelector('button[class*="chevron"]') ||
                           document.querySelector('button[class*="toggle"]');
        
        if (toggleButton) {
            console.log('Detected top bar toggle button, checking top bar offset...');
            
            // Check and fix top bar offset when button is detected
            const outerTop = document.querySelector('.editor-outer-top') ||
                            document.querySelector('[class*="editor-outer-top"]');
            if (outerTop) {
                // Check if the top bar has the hidden class to determine state
                const isHidden = outerTop.classList.contains('bar-hidden');
                
                if (isHidden) {
                    // Remove left property entirely when hidden so it sticks to right
                    outerTop.style.removeProperty('left');
                    console.log('Removed left offset for hidden panel state (detected via class)');
                } else {
                    // Set left to 0 when panel is visible
                    outerTop.style.setProperty('left', '0px', 'important');
                    console.log('Set left offset to 0 for visible panel state (detected via class)');
                }
            }
        }
    });
    
    buttonObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Continuously check for the editor-outer-top offset and fix it
    const fixOffsetInterval = setInterval(() => {
        const outerTop = document.querySelector('.editor-outer-top') ||
                        document.querySelector('[class*="editor-outer-top"]');
        if (outerTop) {
            // Check if the top bar has the hidden class to determine state
            const isHidden = outerTop.classList.contains('bar-hidden');
            
            if (isHidden) {
                // Remove left property entirely when hidden so it sticks to right
                outerTop.style.removeProperty('left');
                console.log('Removed left offset for hidden panel state (detected via class)');
            } else {
                // Set left to 0 when panel is visible
                outerTop.style.setProperty('left', '0px', 'important');
                console.log('Set left offset to 0 for visible panel state (detected via class)');
            }
        }
    }, 500); // Check every 500ms

    // Stop the interval after 30 seconds to prevent infinite loop
    setTimeout(() => {
        clearInterval(fixOffsetInterval);
        console.log('Stopped editor-outer-top offset fix interval');
    }, 30000);
})();