// ==UserScript==
// @name         GitHub Actions - Collapsible & Resizable Sidebar
// @namespace    https://github.com/
// @version      2.0
// @description  Makes the GitHub Actions sidebar collapsible and resizable
// @author       chaoscreater
// @match        https://github.com/*/actions/runs/*/job/*
// @match        https://github.*.co.nz/*/*/actions/runs/*/job/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555714/GitHub%20Actions%20-%20Collapsible%20%20Resizable%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/555714/GitHub%20Actions%20-%20Collapsible%20%20Resizable%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run on matching pages
    const isActionsPage = /\/actions\/runs\/\d+\/job\/\d+/.test(window.location.pathname);
    if (!isActionsPage) return;

    // Wait for the sidebar to be available
    function waitForSidebar() {
        const sidebar = document.querySelector('[data-target="split-page-layout.pane"]');
        const contentArea = document.querySelector('[data-target="split-page-layout.content"]');
        if (sidebar && contentArea) {
            initializeSidebar(sidebar, contentArea);
        } else {
            setTimeout(waitForSidebar, 100);
        }
    }

    function initializeSidebar(sidebar, contentArea) {
        // Prevent double initialization
        if (sidebar.classList.contains('gh-actions-initialized')) return;
        sidebar.classList.add('gh-actions-initialized');

        // Find the parent container
        const parentContainer = sidebar.parentElement;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            /* Force parent to be flex container */
            [data-view-component="true"].PageLayout-columns {
                display: flex !important;
                flex-direction: row !important;
            }

            .gh-actions-sidebar-wrapper {
                position: relative;
                transition: width 0.3s ease, min-width 0.3s ease;
                flex-shrink: 0 !important;
            }

            .gh-actions-sidebar-collapsed {
                width: 40px !important;
                min-width: 40px !important;
                max-width: 40px !important;
                overflow: hidden !important;
            }

            .gh-actions-sidebar-collapsed > *:not(.gh-actions-toggle-btn) {
                display: none !important;
            }

            .gh-actions-content-area {
                flex: 1 1 auto !important;
                min-width: 0 !important;
                width: auto !important;
                max-width: none !important;
            }

            .gh-actions-toggle-btn {
                position: absolute;
                top: 10px;
                right: 5px;
                width: 24px;
                height: 24px;
                background: #0969da;
                color: white;
                border: 2px solid #ffffff;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                font-size: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: background 0.2s;
            }

            .gh-actions-toggle-btn:hover {
                background: #0860ca;
            }

            .gh-actions-resize-handle {
                position: absolute;
                top: 0;
                right: 0;
                width: 5px;
                height: 100%;
                cursor: col-resize;
                background: rgba(128, 128, 128, 0.4);
                border-right: 1px solid rgba(128, 128, 128, 0.6);
                z-index: 999;
                transition: all 0.2s;
            }

            .gh-actions-resize-handle:hover {
                background: rgba(9, 105, 218, 0.5);
                border-right: 2px solid #0969da;
            }

            .gh-actions-resizing * {
                user-select: none !important;
                cursor: col-resize !important;
            }
        `;
        document.head.appendChild(style);

        // Setup parent container
        if (parentContainer) {
            parentContainer.style.display = 'flex';
            parentContainer.style.flexDirection = 'row';
        }

        // Wrap sidebar and content area
        sidebar.classList.add('gh-actions-sidebar-wrapper');
        contentArea.classList.add('gh-actions-content-area');

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'gh-actions-toggle-btn';
        toggleBtn.innerHTML = '◀';
        toggleBtn.title = 'Toggle sidebar';
        sidebar.appendChild(toggleBtn);

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'gh-actions-resize-handle';
        sidebar.appendChild(resizeHandle);

        // Load saved state
        const savedWidth = localStorage.getItem('gh-actions-sidebar-width');
        const isCollapsed = localStorage.getItem('gh-actions-sidebar-collapsed') === 'true';

        if (savedWidth && !isCollapsed) {
            sidebar.style.width = savedWidth;
            sidebar.style.minWidth = savedWidth;
        }

        if (isCollapsed) {
            sidebar.classList.add('gh-actions-sidebar-collapsed');
            toggleBtn.innerHTML = '▶';
        }

        // Toggle functionality
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const collapsed = sidebar.classList.toggle('gh-actions-sidebar-collapsed');
            toggleBtn.innerHTML = collapsed ? '▶' : '◀';
            localStorage.setItem('gh-actions-sidebar-collapsed', collapsed);
        });

        // Resize functionality
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            if (sidebar.classList.contains('gh-actions-sidebar-collapsed')) return;
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebar.offsetWidth;
            document.body.classList.add('gh-actions-resizing');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const width = startWidth + (e.clientX - startX);
            if (width >= 200 && width <= 600) {
                sidebar.style.width = width + 'px';
                sidebar.style.minWidth = width + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.classList.remove('gh-actions-resizing');
                localStorage.setItem('gh-actions-sidebar-width', sidebar.style.width);
            }
        });
    }

    // Start the script
    waitForSidebar();

    // Handle navigation changes (for SPA behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const isStillActionsPage = /\/actions\/runs\/\d+\/job\/\d+/.test(window.location.pathname);
            if (isStillActionsPage) {
                waitForSidebar();
            }
        }
    }).observe(document, { subtree: true, childList: true });
})();
