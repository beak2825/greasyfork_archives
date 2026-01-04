// ==UserScript==
// @name         Torn Join Fight Warning
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Warns when a Join Fight button appears on attack pages
// @match        *://*.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560551/Torn%20Join%20Fight%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/560551/Torn%20Join%20Fight%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SETTINGS ---
    function loadSettings() {
        return {
            disableButton: localStorage.getItem('jfw_disableButton') !== 'false',
            showAlert: localStorage.getItem('jfw_showAlert') !== 'false',
            changeColour: localStorage.getItem('jfw_changeColour') !== 'false',
            windowVisible: localStorage.getItem('jfw_windowVisible') !== 'false'
        };
    }

    function saveSetting(key, value) {
        localStorage.setItem('jfw_' + key, value.toString());
    }

    let settings = loadSettings();
    let alertShown = false;

    // --- UTILITY ---
    function isAttackPage() {
        return window.location.href.includes('loader.php?sid=attack');
    }

    // --- CREATE WINDOW ---
    function createWindow() {
        if (document.getElementById('jfw-window')) return null;

        let savedLeft = parseInt(localStorage.getItem('jfw_window_left')) || 20;
        let savedTop = parseInt(localStorage.getItem('jfw_window_top')) || 100;
        const maxLeft = window.innerWidth - 200;
        const maxTop = window.innerHeight - 100;
        savedLeft = Math.max(10, Math.min(savedLeft, maxLeft));
        savedTop = Math.max(50, Math.min(savedTop, maxTop));

        const windowEl = document.createElement('div');
        windowEl.id = 'jfw-window';
        windowEl.style.cssText = `position:fixed;top:${savedTop}px;left:${savedLeft}px;width:200px;background:#2a2a2a;border:2px solid #444;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.8);z-index:10000;font-family:Arial,sans-serif;touch-action:none;`;

        // Title bar
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `background:#444;padding:8px 12px;border-radius:6px 6px 0 0;cursor:move;display:flex;justify-content:space-between;align-items:center;color:white;font-size:12px;font-weight:bold;user-select:none;`;

        const title = document.createElement('span');
        title.textContent = 'Join Fight Warn';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex;gap:4px;';

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'jfw-toggle-btn';
        toggleBtn.textContent = '_';
        toggleBtn.style.cssText = `background:#f39c12;color:white;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;`;

        const closeBtn = document.createElement('button');
        closeBtn.id = 'jfw-close-btn';
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `background:#ff4757;color:white;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;`;

        buttonContainer.appendChild(toggleBtn);
        buttonContainer.appendChild(closeBtn);
        titleBar.appendChild(title);
        titleBar.appendChild(buttonContainer);

        // Content
        const content = document.createElement('div');
        content.id = 'jfw-content';
        content.style.cssText = `padding:12px;`;

        windowEl.appendChild(titleBar);
        windowEl.appendChild(content);

        // Minimize/maximize
        let isMinimized = localStorage.getItem('jfw_minimized') === 'true';

        function toggleWindow() {
            if (isMinimized) {
                content.style.display = 'block';
                windowEl.style.width = '200px';
                toggleBtn.textContent = '_';
                isMinimized = false;
            } else {
                content.style.display = 'none';
                windowEl.style.width = 'auto';
                toggleBtn.textContent = '+';
                isMinimized = true;
            }
            localStorage.setItem('jfw_minimized', isMinimized.toString());
        }

        if (isMinimized) toggleWindow();

        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleWindow();
        });

        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            windowEl.style.display = 'none';
            saveSetting('windowVisible', false);
        });

        // Dragging
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        function startDrag(e) {
            if (e.target.id === 'jfw-close-btn' || e.target.id === 'jfw-toggle-btn') return;
            e.preventDefault();
            isDragging = true;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            dragOffset.x = clientX - windowEl.offsetLeft;
            dragOffset.y = clientY - windowEl.offsetTop;
            titleBar.style.cursor = 'grabbing';
        }

        function handleDrag(e) {
            if (isDragging) {
                e.preventDefault();
                const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
                let newLeft = clientX - dragOffset.x;
                let newTop = clientY - dragOffset.y;
                newLeft = Math.max(10, Math.min(newLeft, window.innerWidth - 200));
                newTop = Math.max(10, Math.min(newTop, window.innerHeight - 100));
                windowEl.style.left = newLeft + 'px';
                windowEl.style.top = newTop + 'px';
            }
        }

        function endDrag() {
            if (isDragging) {
                localStorage.setItem('jfw_window_left', parseInt(windowEl.style.left).toString());
                localStorage.setItem('jfw_window_top', parseInt(windowEl.style.top).toString());
                isDragging = false;
                titleBar.style.cursor = 'move';
            }
        }

        titleBar.addEventListener('mousedown', startDrag);
        titleBar.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('touchmove', handleDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        // Hide if was closed
        if (!settings.windowVisible) {
            windowEl.style.display = 'none';
        }

        return { window: windowEl, content: content };
    }

    // --- CREATE UI ---
    function createUI(container) {
        container.innerHTML = '';

        // Status indicator
        const status = document.createElement('div');
        status.id = 'jfw-status';
        status.style.cssText = `padding:6px 8px;margin-bottom:10px;border-radius:4px;font-size:11px;text-align:center;`;
        updateStatus(status);
        container.appendChild(status);

        // Options
        const options = [
            { key: 'disableButton', label: 'Disable button' },
            { key: 'showAlert', label: 'Show alert' },
            { key: 'changeColour', label: 'Red colour' }
        ];

        options.forEach(function(opt) {
            const label = document.createElement('label');
            label.style.cssText = `display:flex;align-items:center;gap:8px;color:#ccc;font-size:12px;padding:6px 0;cursor:pointer;`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = settings[opt.key];
            checkbox.style.cssText = `width:16px;height:16px;cursor:pointer;`;

            checkbox.addEventListener('change', function() {
                settings[opt.key] = this.checked;
                saveSetting(opt.key, this.checked);
                reapplyToExistingButtons();
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(opt.label));
            container.appendChild(label);
        });
    }

    function updateStatus(statusEl) {
        if (!statusEl) statusEl = document.getElementById('jfw-status');
        if (!statusEl) return;

        if (isAttackPage()) {
            const joinButton = document.querySelector('button[data-jfw-processed]');
            if (joinButton) {
                statusEl.textContent = 'JOIN DETECTED!';
                statusEl.style.background = '#E74C3C';
                statusEl.style.color = 'white';
            } else {
                statusEl.textContent = 'Monitoring...';
                statusEl.style.background = '#27AE60';
                statusEl.style.color = 'white';
            }
        } else {
            statusEl.textContent = 'Not on attack page';
            statusEl.style.background = '#555';
            statusEl.style.color = '#999';
        }
    }

    // --- BUTTON DETECTION ---
    function isJoinFightButton(button) {
        const text = button.textContent.trim().toLowerCase();
        return text.includes('join') && !text.includes('start');
    }

    function applyWarnings(button) {
        if (button.dataset.jfwProcessed) return;
        button.dataset.jfwProcessed = 'true';

        if (settings.changeColour) {
            button.style.backgroundColor = '#cc0000';
            button.style.borderColor = '#990000';
            button.style.color = '#fff';
        }

        if (settings.disableButton) {
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        }

        if (settings.showAlert && !alertShown) {
            alertShown = true;
            alert('Warning: This is a JOIN fight, not a START fight!');
        }

        updateStatus();
    }

    function removeWarnings(button) {
        button.removeAttribute('data-jfw-processed');
        button.style.backgroundColor = '';
        button.style.borderColor = '';
        button.style.color = '';
        button.style.opacity = '';
        button.style.cursor = '';
        button.disabled = false;
    }

    function reapplyToExistingButtons() {
        const buttons = document.querySelectorAll('button[data-jfw-processed]');
        for (let i = 0; i < buttons.length; i++) {
            removeWarnings(buttons[i]);
            if (isJoinFightButton(buttons[i])) {
                applyWarnings(buttons[i]);
            }
        }
    }

    function scanForButtons() {
        const buttons = document.querySelectorAll('button.torn-btn');
        for (let i = 0; i < buttons.length; i++) {
            if (isJoinFightButton(buttons[i])) {
                applyWarnings(buttons[i]);
            }
        }
    }

    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            for (let m = 0; m < mutations.length; m++) {
                const addedNodes = mutations[m].addedNodes;
                for (let n = 0; n < addedNodes.length; n++) {
                    const node = addedNodes[n];
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches('button.torn-btn') && isJoinFightButton(node)) {
                            applyWarnings(node);
                        }
                        if (node.querySelectorAll) {
                            const buttons = node.querySelectorAll('button.torn-btn');
                            for (let b = 0; b < buttons.length; b++) {
                                if (isJoinFightButton(buttons[b])) {
                                    applyWarnings(buttons[b]);
                                }
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // --- INIT ---
    function init() {
        if (document.getElementById('jfw-window')) return;

        const win = createWindow();
        if (win) {
            createUI(win.content);
            document.body.appendChild(win.window);
        }

        if (isAttackPage()) {
            scanForButtons();
            setupObserver();
        }
    }

    // Run on page load and URL changes
    setTimeout(init, 1000);

    // Watch for page changes (Torn uses SPA navigation)
    const urlObserver = new MutationObserver(function() {
        if (isAttackPage()) {
            setTimeout(function() {
                scanForButtons();
                updateStatus();
            }, 500);
        } else {
            updateStatus();
        }
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });
})();