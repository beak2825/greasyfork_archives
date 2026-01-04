// ==UserScript==
// @name        为deepwiki界面添加隐藏对话框的按钮
// @namespace   Violentmonkey Scripts
// @match       *://deepwiki.com/*
// @grant       none
// @version     1.0
// @author      Letus
// @license MIT
// @description 2025/10/13 20:13:11
// @downloadURL https://update.greasyfork.org/scripts/552470/%E4%B8%BAdeepwiki%E7%95%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E9%9A%90%E8%97%8F%E5%AF%B9%E8%AF%9D%E6%A1%86%E7%9A%84%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/552470/%E4%B8%BAdeepwiki%E7%95%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E9%9A%90%E8%97%8F%E5%AF%B9%E8%AF%9D%E6%A1%86%E7%9A%84%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
/**
 * Script to hide chatbox div elements on deepwiki.com domains
 * This script checks if the current website matches deepwiki.com
 * and hides div elements which point to chatbox by setting their style to display:none
 * Includes a draggable toggle button on the right side of the screen to show/hide elements.
 */

(function() {
    'use strict';

    // Configuration
    const TARGET_DOMAIN = 'deepwiki.com';
    const TARGET_CLASS = 'pointer-events-none';
    const BUTTON_ID = 'deepwiki-chatbox-toggle';

    // State
    let isHidden = true;

    /**
     * Check if current domain matches or is a subdomain of the target domain
     * @returns {boolean} True if domain matches
     */
    function isTargetDomain() {
        const hostname = window.location.hostname;
        return hostname === TARGET_DOMAIN;
    }

    /**
     * Hide all div elements with the target class
     */
    function hideTargetElements() {
        const elements = document.querySelectorAll(`div.${TARGET_CLASS}`);
        elements.forEach(element => {
            element.style.display = 'none';
        });
        isHidden = true;
        updateButtonState();
        console.log(`Hidden ${elements.length} elements with class '${TARGET_CLASS}'`);
    }

    /**
     * Show all div elements with the target class
     */
    function showTargetElements() {
        const elements = document.querySelectorAll(`div.${TARGET_CLASS}`);
        elements.forEach(element => {
            element.style.display = '';
        });
        isHidden = false;
        updateButtonState();
        console.log(`Shown ${elements.length} elements with class '${TARGET_CLASS}'`);
    }

    /**
     * Toggle visibility of target elements
     */
    function toggleElements() {
        if (isHidden) {
            showTargetElements();
        } else {
            hideTargetElements();
        }
    }

    /**
     * Update the toggle button's state (active/inactive)
     */
    function updateButtonState() {
        const button = document.getElementById(BUTTON_ID);
        if (button) {
            if (isHidden) {
                button.classList.remove('active');
            } else {
                button.classList.add('active');
            }
        }
    }

    /**
     * Create and inject the toggle button
     */
    function createToggleButton() {
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.innerHTML = '<i class="fas fa-power-off"></i>';

        document.body.appendChild(button);

        let isDragging = false;
        let startY = 0;
        let initialTop = 0;

        button.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only for left click
            isDragging = false;
            startY = e.clientY;
            initialTop = button.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            const dy = e.clientY - startY;
            if (Math.abs(dy) > 5) { // Threshold to start dragging
                isDragging = true;
            }

            if (isDragging) {
                document.body.style.userSelect = 'none';
                button.style.cursor = 'grabbing';

                let newY = initialTop + dy;
                const buttonHeight = button.offsetHeight;
                const maxY = window.innerHeight - buttonHeight;

                if (newY < 0) newY = 0;
                if (newY > maxY) newY = maxY;

                button.style.top = `${newY}px`;
                button.style.transform = 'translateY(0)';
            }
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (!isDragging) {
                toggleElements();
            }

            document.body.style.userSelect = '';
            button.style.cursor = 'grab';
        }
    }

    /**
     * Add CSS for the toggle button
     */
    function addToggleStyles() {
        if (document.getElementById('deepwiki-toggle-styles')) {
            return;
        }

        const styles = `
            #${BUTTON_ID} {
                position: fixed;
                top: 80%;
                right: 0;
                transform: translateY(-50%);
                width: 45px;
                height: 45px;
                background-color: #333;
                color: white;
                border: none;
                border-radius: 50% 0 0 50%;
                cursor: grab;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.3);
                transition: background-color 0.3s ease;
            }

            #${BUTTON_ID} i {
                font-size: 22px;
                pointer-events: none; /* Prevent icon from interfering with drag events */
            }

            #${BUTTON_ID}:hover {
                background-color: #555;
            }

            #${BUTTON_ID}.active {
                background-color: #007bff;
            }

            #${BUTTON_ID}.active:hover {
                background-color: #0056b3;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'deepwiki-toggle-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Inject Font Awesome stylesheet
     */
    function addFontAwesome() {
        if (document.querySelector('link[href*="font-awesome"]')) {
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(link);
    }

    /**
     * Initialize the script
     */
    function init() {
        // Check if we're on the target domain
        if (isTargetDomain()) {
            addFontAwesome();
            // Add CSS styles
            addToggleStyles();

            // Function to initialize when DOM is ready
            function initialize() {
                // Hide elements initially
                hideTargetElements();

                // Create toggle button
                createToggleButton();
            }

            // Initialize immediately if DOM is already loaded
            if (document.readyState === 'loading') {
                // DOM is still loading, wait for it to complete
                document.addEventListener('DOMContentLoaded', initialize);
            } else {
                // DOM is already loaded
                initialize();
            }
        }
    }

    // Start the script
    init();
})();
