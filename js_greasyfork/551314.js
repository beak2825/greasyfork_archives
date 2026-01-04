// ==UserScript==
// @name         Ironwood RPG Floating Menu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a floating action button to display content from a specific div in a draggable window.
// @author       Your Name
// @match        https://ironwoodrpg.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551314/Ironwood%20RPG%20Floating%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/551314/Ironwood%20RPG%20Floating%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // Selector for the element whose content you want to clone and display
    const TARGET_SELECTOR = 'div.scroll.custom-scrollbar.scroll-margin';
    // --- End Configuration ---

    // 1. Inject CSS for the FAB and the floating window
    GM_addStyle(`
    /* Floating Action Button (FAB) */
    #fab-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px; /* Slightly smaller FAB */
        height: 50px;
        border-radius: 50%;
        background-color: #007bff;
        color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
        border: none;
        cursor: pointer;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: background-color 0.2s;
    }

    #fab-button:hover {
        background-color: #0056b3;
    }

    /* Floating Window (Modal/Panel) */
    #floating-window {
        position: fixed;
        bottom: 80px; /* Position above the FAB */
        right: 20px;
        top: auto; /* Remove top centering */
        left: auto; /* Remove left centering */
        transform: none; /* Remove centering transform */

        /* --- CHANGES FOR ONE-HAND USAGE & STYLING --- */
        width: 200px; /* Narrow width for one-hand use */
        max-width: 90vw;
        height: 400px; /* Set a fixed height for a tall mobile-like panel */
        max-height: 80vh;

        /* Remove custom background/border to better adopt cloned content's styling */
        background-color: transparent;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); /* Keep shadow for visual separation */

        z-index: 9999;
        display: none;
        resize: vertical; /* Allow resizing, but keep it constrained */
        overflow: hidden; /* Manage scrolling via the content area */
    }

    /* The cloned content area will manage the visuals */
    #floating-window-content {
        height: 100%; /* Make content fill the window */
        width: 100%;
        padding: 0; /* Remove padding to avoid offsets */
        overflow-y: auto; /* Allow scrolling inside the content area */
    }

    #floating-window-content button {
    /* Enable Flexbox layout for the button */
    display: flex !important;
    /* Vertically center the items (img and div) */
    align-items: center !important;
    /* Add a little space between the image and the text */
    gap: 8px;
    /* Ensure the content is centered horizontally if the button is wider */
    justify-content: flex-start !important;

    /* Ensure the button takes up the full width of the cloned content */
    width: 100%;
}
`);

    // 2. Create the FAB button
    const fabButton = document.createElement('button');
    fabButton.id = 'fab-button';
    // Use a standard hamburger icon (Unicode character)
    fabButton.innerHTML = '&#9776;';
    fabButton.title = 'Open Floating Content';
    document.body.appendChild(fabButton);

    // 3. Create the Floating Window structure (NO HEADER)
    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'floating-window';

    // Content area
    const contentArea = document.createElement('div');
    contentArea.id = 'floating-window-content';

    // Since the header is gone, make the whole content area draggable
    contentArea.style.cursor = 'move';

    floatingWindow.appendChild(contentArea);
    document.body.appendChild(floatingWindow);

    // 4. FAB Button Click Handler (Toggle Visibility and Update Content)
    fabButton.addEventListener('click', () => {
        if (floatingWindow.style.display === 'block') {
            floatingWindow.style.display = 'none'; // Hide
        } else {
            // Find the original target element
            const targetElement = document.querySelector(TARGET_SELECTOR);

            if (targetElement) {
                // Clone the content
                const clonedContent = targetElement.cloneNode(true);

                // --- Styling Fixes ---
                clonedContent.style.backgroundColor = '#061a2e';
                clonedContent.style.color = 'white';
                clonedContent.style.border = '1px solid #263849';
                clonedContent.style.padding = '8px'
                clonedContent.style.borderRadius = '10px';

                contentArea.innerHTML = '';
                contentArea.appendChild(clonedContent);

                clonedContent.addEventListener('click', (e) => {
                    // Find the index of the clicked element within its parent
                    let node = e.target;

                    // We need to trace the click back to the original element
                    // by mapping the DOM path from the cloned element.

                    // 1. Get the path of elements from the clicked node up to the cloned root
                    const path = [];
                    let tempNode = node;
                    while (tempNode !== clonedContent && tempNode) {
                        path.unshift(tempNode);
                        tempNode = tempNode.parentNode;
                    }

                    // 2. Traverse the path on the original target element
                    let originalNode = targetElement;
                    for (const element of path) {
                        if (originalNode) {
                            // Find the corresponding child node in the original element
                            let childIndex = Array.from(element.parentNode.children).indexOf(element);
                            originalNode = originalNode.children[childIndex];
                        }
                    }

                    // 3. Trigger the click on the original element
                    if (originalNode) {
                        originalNode.click();
                        floatingWindow.style.display = 'none';
                    } else {
                        console.warn('Could not map click to original element.');
                    }
                });

                floatingWindow.style.display = 'block'; // Show
            } else {
                console.error('Target element not found with selector:', TARGET_SELECTOR);
                contentArea.innerHTML = '<div style="padding:10px; color:red; background:white;">Error: Target element not found.</div>';
                floatingWindow.style.display = 'block';
            }
        }
    });

    // 5. Drag Functionality (Now using the content area)
    let isDragging = false;
    let offsetX, offsetY;
    const draggableArea = contentArea; // Use contentArea for dragging

    draggableArea.addEventListener('mousedown', (e) => {
        isDragging = true;
        // Calculate the offset from the mouse click to the window's top-left corner
        offsetX = e.clientX - floatingWindow.offsetLeft;
        offsetY = e.clientY - floatingWindow.offsetTop;

        // Prevent text selection while dragging
        document.body.style.userSelect = 'none';
        e.preventDefault(); // Prevents default dragging/selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // Calculate new position
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        // Keep it anchored to the right side if dragged
        floatingWindow.style.right = `${document.documentElement.clientWidth - newLeft - floatingWindow.offsetWidth}px`;
        floatingWindow.style.bottom = `${document.documentElement.clientHeight - newTop - floatingWindow.offsetHeight}px`;
        floatingWindow.style.left = 'auto';
        floatingWindow.style.top = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = 'auto';
    });

})();