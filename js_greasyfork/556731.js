// ==UserScript==
// @name         Reddit Image/Video Hider
// @namespace    https://violentmonkey.github.io/api/gm/
// @version      1.0
// @description  Hide/Show Reddit Images and Videos.
// @author       Ryu
// @license      MIT
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556731/Reddit%20ImageVideo%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/556731/Reddit%20ImageVideo%20Hider.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Ryu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // State management
    let hideMode = 'placeholder'; // 'placeholder' or 'remove'
    let globalHideState = true;
    const manuallyHiddenImages = new WeakSet();
    const manuallyShownImages = new WeakSet();
    const removedContainers = new WeakMap();

    // Inject styles
    const styles = `
        .rih-toggle-button {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background: #FF4500 !important;
            color: white !important;
            border: none !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            transition: all 0.3s ease !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .rih-toggle-button:hover {
            background: #ff5722 !important;
            transform: scale(1.1) !important;
        }

        .rih-toggle-button:active {
            transform: scale(0.95) !important;
        }

        .rih-settings-button {
            position: fixed !important;
            bottom: 86px !important;
            right: 20px !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background: #1a1a1b !important;
            color: white !important;
            border: 2px solid #343536 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            transition: all 0.3s ease !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .rih-settings-button:hover {
            background: #272729 !important;
            border-color: #FF4500 !important;
            transform: scale(1.1) !important;
        }

        .rih-settings-panel {
            position: fixed !important;
            bottom: 152px !important;
            right: 20px !important;
            width: 300px !important;
            background: #1a1a1b !important;
            border: 2px solid #343536 !important;
            border-radius: 12px !important;
            padding: 20px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
            z-index: 999999 !important;
            display: none !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .rih-settings-panel.show {
            display: block !important;
        }

        .rih-settings-title {
            color: white !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            margin: 0 0 16px 0 !important;
            padding-bottom: 12px !important;
            border-bottom: 2px solid #343536 !important;
        }

        .rih-option {
            margin-bottom: 16px !important;
            cursor: pointer !important;
        }

        .rih-option:last-child {
            margin-bottom: 0 !important;
        }

        .rih-option-label {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 12px !important;
            background: #272729 !important;
            border: 2px solid #343536 !important;
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
        }

        .rih-option-label:hover {
            border-color: #FF4500 !important;
            background: #2d2d2f !important;
        }

        .rih-option-label.active {
            border-color: #FF4500 !important;
            background: rgba(255, 69, 0, 0.1) !important;
        }

        .rih-option input[type="radio"] {
            width: 20px !important;
            height: 20px !important;
            cursor: pointer !important;
            accent-color: #FF4500 !important;
        }

        .rih-option-text {
            flex: 1 !important;
        }

        .rih-option-name {
            color: white !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            display: block !important;
            margin-bottom: 4px !important;
        }

        .rih-option-desc {
            color: #818384 !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
        }

        .rih-hidden-container {
            position: relative !important;
            background: #1a1a1b !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            min-height: 200px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: 2px dashed #343536 !important;
        }

        .rih-reveal-button {
            background: #FF4500 !important;
            color: white !important;
            border: none !important;
            padding: 12px 24px !important;
            border-radius: 24px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: all 0.2s ease !important;
            z-index: 10 !important;
            position: relative !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .rih-reveal-button:hover {
            background: #ff5722 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(255, 69, 0, 0.4) !important;
        }

        .rih-hide-button {
            position: absolute !important;
            top: 12px !important;
            right: 12px !important;
            background: rgba(26, 26, 27, 0.9) !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 20px !important;
            cursor: pointer !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            transition: all 0.2s ease !important;
            z-index: 999998 !important;
            backdrop-filter: blur(10px) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .rih-hide-button:hover {
            background: rgba(255, 69, 0, 0.9) !important;
            transform: translateY(-1px) !important;
        }

        .rih-image-wrapper {
            position: relative !important;
        }

        .rih-icon {
            width: 16px !important;
            height: 16px !important;
            display: inline-block !important;
        }

        .rih-status-text {
            position: fixed !important;
            bottom: 86px !important;
            right: 86px !important;
            background: rgba(26, 26, 27, 0.95) !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            z-index: 999998 !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            pointer-events: none !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .rih-status-text.show {
            opacity: 1 !important;
        }

        .rih-removed {
            display: none !important;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // SVG Icons
    const eyeIcon = `<svg class="rih-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>`;
    const eyeOffIcon = `<svg class="rih-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>`;
    const imageIcon = `<svg class="rih-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg>`;
    const videoIcon = `<svg class="rih-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>`;
    const settingsIcon = `<svg class="rih-icon" style="width: 20px !important; height: 20px !important;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>`;

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'rih-toggle-button';
    toggleButton.innerHTML = eyeIcon;
    toggleButton.title = 'Toggle Media Visibility';
    document.body.appendChild(toggleButton);

    // Create settings button
    const settingsButton = document.createElement('button');
    settingsButton.className = 'rih-settings-button';
    settingsButton.innerHTML = settingsIcon;
    settingsButton.title = 'Settings';
    document.body.appendChild(settingsButton);

    // Create settings panel
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'rih-settings-panel';
    settingsPanel.innerHTML = `
        <div class="rih-settings-title">Hide Mode</div>
        <div class="rih-option">
            <label class="rih-option-label active">
                <input type="radio" name="hide-mode" value="placeholder" checked>
                <div class="rih-option-text">
                    <span class="rih-option-name">Show Placeholder</span>
                    <span class="rih-option-desc">Hidden media shows "Click to reveal" button</span>
                </div>
            </label>
        </div>
        <div class="rih-option">
            <label class="rih-option-label">
                <input type="radio" name="hide-mode" value="remove">
                <div class="rih-option-text">
                    <span class="rih-option-name">Remove Completely</span>
                    <span class="rih-option-desc">Hidden media removed until mode is disabled</span>
                </div>
            </label>
        </div>
    `;
    document.body.appendChild(settingsPanel);

    // Create status text
    const statusText = document.createElement('div');
    statusText.className = 'rih-status-text';
    document.body.appendChild(statusText);

    function showStatus(text) {
        statusText.textContent = text;
        statusText.classList.add('show');
        setTimeout(() => {
            statusText.classList.remove('show');
        }, 2000);
    }

    // Settings panel toggle
    settingsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsPanel.classList.toggle('show');
    });

    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && !settingsButton.contains(e.target)) {
            settingsPanel.classList.remove('show');
        }
    });

    // Handle mode change
    const radioButtons = settingsPanel.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const newMode = e.target.value;
            hideMode = newMode;

            // Update active state
            settingsPanel.querySelectorAll('.rih-option-label').forEach(label => {
                label.classList.remove('active');
            });
            e.target.closest('.rih-option-label').classList.add('active');

            showStatus(newMode === 'placeholder' ? 'Mode: Show Placeholder' : 'Mode: Remove Completely');
            settingsPanel.classList.remove('show');

            // Reapply current state with new mode
            if (globalHideState) {
                applyGlobalHide();
            }
        });
    });

    // Find image containers
    function findImageContainers() {
        const containers = [];

        // Find all media containers with images or embeds
        const mediaContainers = document.querySelectorAll('[slot="post-media-container"]');
        mediaContainers.forEach(container => {
            const hasImage = container.querySelector('img[alt*="r/"]') ||
                           container.querySelector('shreddit-aspect-ratio img') ||
                           container.querySelector('shreddit-embed') ||
                           container.querySelector('iframe') ||
                           container.querySelector('video') ||
                           container.querySelector('shreddit-aspect-ratio');
            if (hasImage) {
                containers.push(container);
            }
        });

        // Find thumbnail containers
        const thumbnailContainers = document.querySelectorAll('[slot="thumbnail"]');
        thumbnailContainers.forEach(container => {
            const hasImage = container.querySelector('img');
            if (hasImage) {
                containers.push(container);
            }
        });

        return containers;
    }

    // Find all containers including hidden ones
    function findAllContainers() {
        const allContainers = [
            ...Array.from(document.querySelectorAll('[slot="post-media-container"]')),
            ...Array.from(document.querySelectorAll('[slot="thumbnail"]'))
        ];
        return allContainers;
    }

    // Detect media type
    function getMediaType(container) {
        if (container.querySelector('shreddit-embed') ||
            container.querySelector('iframe') ||
            container.querySelector('video')) {
            return 'video';
        }
        return 'image';
    }

    function hideImage(container, isManual = false) {
        if (container.classList.contains('rih-removed') || container.querySelector('.rih-hidden-container')) return;

        // Track manual hide
        if (isManual) {
            manuallyHiddenImages.add(container);
            manuallyShownImages.delete(container);
        }

        if (hideMode === 'remove') {
            // Store original state for restoration
            removedContainers.set(container, {
                display: container.style.display,
                originalContent: container.innerHTML
            });
            container.classList.add('rih-removed');
        } else {
            // Placeholder mode
            const mediaType = getMediaType(container);
            const icon = mediaType === 'video' ? videoIcon : imageIcon;
            const text = mediaType === 'video' ? 'Click to reveal video' : 'Click to reveal image';

            const hiddenDiv = document.createElement('div');
            hiddenDiv.className = 'rih-hidden-container';

            const revealButton = document.createElement('button');
            revealButton.className = 'rih-reveal-button';
            revealButton.innerHTML = `${icon} <span>${text}</span>`;

            hiddenDiv.appendChild(revealButton);

            const originalContent = container.innerHTML;
            container.setAttribute('data-original-content', originalContent);

            container.innerHTML = '';
            container.appendChild(hiddenDiv);

            revealButton.addEventListener('click', () => {
                showImage(container, true);
            });
        }
    }

    function showImage(container, isManual = false) {
        // Track manual show
        if (isManual) {
            manuallyShownImages.add(container);
            manuallyHiddenImages.delete(container);
        }

        if (container.classList.contains('rih-removed')) {
            // Restore from remove mode
            const stored = removedContainers.get(container);
            if (stored) {
                container.classList.remove('rih-removed');
                if (stored.display) {
                    container.style.display = stored.display;
                }
            }
        } else {
            // Restore from placeholder mode
            const originalContent = container.getAttribute('data-original-content');
            if (!originalContent) return;

            container.innerHTML = originalContent;
            container.removeAttribute('data-original-content');

            const wrapper = document.createElement('div');
            wrapper.className = 'rih-image-wrapper';
            wrapper.style.position = 'relative !important';

            while (container.firstChild) {
                wrapper.appendChild(container.firstChild);
            }
            container.appendChild(wrapper);

            const hideButton = document.createElement('button');
            hideButton.className = 'rih-hide-button';
            hideButton.innerHTML = `${eyeOffIcon} <span>Hide</span>`;

            wrapper.appendChild(hideButton);

            hideButton.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                hideImage(container, true);
            });
        }
    }

    function applyGlobalHide() {
        const allContainers = findAllContainers();

        allContainers.forEach(container => {
            const isCurrentlyHidden = container.querySelector('.rih-hidden-container') || container.classList.contains('rih-removed');

            if (!manuallyShownImages.has(container) && !isCurrentlyHidden) {
                hideImage(container, false);
            }
        });
    }

    function applyGlobalShow() {
        const allContainers = findAllContainers();

        allContainers.forEach(container => {
            const isCurrentlyHidden = container.querySelector('.rih-hidden-container') || container.classList.contains('rih-removed');

            if (!manuallyHiddenImages.has(container) && isCurrentlyHidden) {
                showImage(container, false);
            }
        });
    }

    function toggleAllImages() {
        globalHideState = !globalHideState;

        if (globalHideState) {
            toggleButton.innerHTML = eyeOffIcon;
            showStatus(hideMode === 'placeholder' ? 'Media Hidden (Placeholder)' : 'Media Removed');
            applyGlobalHide();
        } else {
            toggleButton.innerHTML = eyeIcon;
            showStatus('Media Visible');
            applyGlobalShow();
        }
    }

    // Toggle button click handler
    toggleButton.addEventListener('click', toggleAllImages);

    // Observer for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        const containers = findImageContainers();
        containers.forEach(container => {
            const isCurrentlyHidden = container.querySelector('.rih-hidden-container') || container.classList.contains('rih-removed');

            // Skip if already processed
            if (container.hasAttribute('data-rih-processed')) {
                return;
            }

            container.setAttribute('data-rih-processed', 'true');

            if (globalHideState) {
                // If global hide is on, hide new images unless manually shown
                if (!manuallyShownImages.has(container) && !isCurrentlyHidden) {
                    hideImage(container, false);
                }
            } else {
                // If global show is on, respect manually hidden images
                if (manuallyHiddenImages.has(container) && !isCurrentlyHidden) {
                    hideImage(container, false);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();