// ==UserScript==
// @name         ShaderToy Layout Resizer
// @version      1.0
// @description  Add a resizable handle between left and right sections on ShaderToy
// @author       seofernando25
// @match        https://www.shadertoy.com/view/*
// @license MIT
// @namespace https://greasyfork.org/users/1533483
// @downloadURL https://update.greasyfork.org/scripts/554596/ShaderToy%20Layout%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/554596/ShaderToy%20Layout%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const HANDLE_WIDTH = 8;
    const MIN_LEFT_WIDTH = 300;
    const MIN_RIGHT_WIDTH = 400;
    const STORAGE_KEY = 'shadertoy_left_width';

    // Wait for DOM to be ready
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Initialize resizer
    async function initResizer() {
        try {
            // Wait for blocks to exist
            const block0 = await waitForElement('.block0');
            const block1 = await waitForElement('.block1');
            const block2 = await waitForElement('.block2');
            const container = block0.parentElement;

            if (!container) {
                console.error('Container not found');
                return;
            }

            // Ensure container is using grid layout
            const containerStyle = window.getComputedStyle(container);
            if (containerStyle.display !== 'grid') {
                console.log('Container display is not grid:', containerStyle.display);
                // Force grid layout
                container.style.display = 'grid';
                container.style.gridTemplateRows = 'auto auto';
                container.style.gridGap = '32px';
                container.style.alignItems = 'start';
            }

            // Override media query grid-template-columns
            // We'll set it dynamically in setWidths, but clear any existing value first
            // Create a style element to override media queries with !important
            // Remove any existing style we may have added
            const existingStyle = document.getElementById('shadertoy-resizer-style');
            if (existingStyle) {
                existingStyle.remove();
            }
            const style = document.createElement('style');
            style.id = 'shadertoy-resizer-style';
            style.textContent = `
                .container {
                    grid-template-columns: var(--shadertoy-left-width, 50%) 1fr !important;
                }
            `;
            document.head.appendChild(style);

            // Ensure block0 and block2 are in first column, block1 is in second
            block0.style.gridColumn = '1';
            block2.style.gridColumn = '1';
            block1.style.gridColumn = '2';

            // Create resize handle
            const handle = document.createElement('div');
            handle.id = 'shadertoy-resize-handle';
            handle.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: ${HANDLE_WIDTH}px;
                cursor: col-resize;
                background: rgba(128, 128, 128, 0.2);
                z-index: 1000;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Add visual indicator (vertical line)
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                width: 2px;
                height: 30px;
                background: rgba(0, 0, 0, 0.3);
                border-left: 1px solid rgba(255, 255, 255, 0.3);
                border-right: 1px solid rgba(255, 255, 255, 0.3);
                pointer-events: none;
            `;
            handle.appendChild(indicator);

            // Hover effect
            handle.addEventListener('mouseenter', () => {
                handle.style.background = 'rgba(128, 128, 128, 0.4)';
            });
            handle.addEventListener('mouseleave', () => {
                handle.style.background = 'rgba(128, 128, 128, 0.2)';
            });

            // Insert handle and make container position relative
            if (getComputedStyle(container).position === 'static') {
                container.style.position = 'relative';
            }
            container.appendChild(handle);

            // Get saved width or use default (50% of viewport)
            let leftWidth = localStorage.getItem(STORAGE_KEY);
            if (leftWidth) {
                leftWidth = parseInt(leftWidth, 10);
            } else {
                // Default: use current block0 width or 50% of container
                const currentWidth = block0.offsetWidth || Math.floor(container.offsetWidth / 2);
                leftWidth = currentWidth;
            }

            // Apply widths using CSS Grid template columns
            function setWidths(leftW) {
                const containerWidth = container.offsetWidth;
                let rightWidth = containerWidth - leftW - HANDLE_WIDTH;

                // Ensure minimum widths
                if (leftW < MIN_LEFT_WIDTH) {
                    leftW = MIN_LEFT_WIDTH;
                }
                if (rightWidth < MIN_RIGHT_WIDTH) {
                    leftW = containerWidth - MIN_RIGHT_WIDTH - HANDLE_WIDTH;
                    rightWidth = containerWidth - leftW - HANDLE_WIDTH;
                }

                // Set grid-template-columns on the container
                // This is the key: we override the media query columns with our dynamic value
                // Use 2 columns: fixed width for left, 1fr for right (which takes remaining space)
                // Inline style has higher specificity than media queries (unless they use !important)
                container.style.gridTemplateColumns = `${leftW}px 1fr`;
                // Also update CSS variable for the style sheet
                container.style.setProperty('--shadertoy-left-width', `${leftW}px`);

                // Ensure blocks are in correct columns
                block0.style.gridColumn = '1';
                block2.style.gridColumn = '1';
                block1.style.gridColumn = '2';

                // Position handle absolutely between the two columns
                const block0Rect = block0.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                handle.style.left = `${block0Rect.right - containerRect.left}px`;

                // Save width
                localStorage.setItem(STORAGE_KEY, leftW.toString());
            }

            // Track initial container width for percentage-based resizing
            let initialContainerWidth = container.offsetWidth;

            // Apply initial width
            setWidths(leftWidth);

            // Drag functionality
            let isDragging = false;
            let startX = 0;
            let startLeftWidth = 0;

            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX;
                
                // Get current left width from block0 or grid
                const block0Rect = block0.getBoundingClientRect();
                startLeftWidth = block0Rect.width;

                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const newLeftWidth = startLeftWidth + deltaX;
                setWidths(newLeftWidth);
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });

            // Handle window resize - maintain percentage
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const currentContainerWidth = container.offsetWidth;
                    // Update if container actually resized significantly
                    if (Math.abs(currentContainerWidth - initialContainerWidth) > 10) {
                        const savedWidth = parseInt(localStorage.getItem(STORAGE_KEY), 10);
                        if (savedWidth && initialContainerWidth > 0) {
                            // Maintain percentage instead of fixed pixel width
                            const percentage = savedWidth / initialContainerWidth;
                            const newWidth = Math.floor(currentContainerWidth * percentage);
                            setWidths(newWidth);
                            // Update initial width for next resize
                            initialContainerWidth = currentContainerWidth;
                        } else {
                            // Fallback: recalculate from current block0 width
                            initialContainerWidth = currentContainerWidth;
                            const block0Width = block0.offsetWidth;
                            if (block0Width > 0) {
                                setWidths(block0Width);
                            }
                        }
                    }
                }, 100);
            });

            console.log('ShaderToy Resizer initialized');

        } catch (error) {
            console.error('Error initializing ShaderToy Resizer:', error);
        }
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResizer);
    } else {
        initResizer();
    }

})();
