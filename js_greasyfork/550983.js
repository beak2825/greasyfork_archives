// ==UserScript==
// @name         Facebook Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Facebook image, post, story, whole profile post, image downloader
// @author       Bibek Chand Sah
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @match        https://m.facebook.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @icon         https://cdn-icons-png.flaticon.com/512/5968/5968764.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550983/Facebook%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550983/Facebook%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles for the download button, terminal UI, and notifications
    GM_addStyle(`
        #facebook-downloader-container {
            position: fixed;
            top: 60px;
            right: 10px;
            z-index: 9999;
            display: inline-block;
        }

        #facebook-downloader-btn {
            position: relative;
            background: #1877f2;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            user-select: none;
        }

        #drag-handle {
            position: absolute;
            top: -15px;
            left: -15px;
            background: rgba(255,255,255,0.9);
            border: 2px solid #1877f2;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: grab;
            transition: all 0.2s ease;
            animation: subtle-pulse 3s ease-in-out infinite;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1;
        }

        #facebook-downloader-btn:hover {
            background: #166fe5;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }

        #facebook-downloader-btn:hover ~ #terminal-toggle-btn {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
        }

        #drag-handle {
            background: rgba(255,255,255,0.9);
            border: 2px solid #1877f2;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: grab;
            transition: all 0.2s ease;
            animation: subtle-pulse 3s ease-in-out infinite;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        @keyframes subtle-pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; transform: scale(1.05); }
        }

        #drag-handle:hover {
            background: rgba(255,255,255,1);
            transform: scale(1.2);
            animation: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        #drag-handle:active {
            cursor: grabbing;
            transform: scale(0.95);
        }

        #facebook-downloader-btn.dragging {
            opacity: 0.8;
            transform: rotate(2deg);
            z-index: 10000;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }

        #facebook-downloader-btn:hover .drag-handle {
            animation: none;
            transform: scale(1.2);
        }

        #terminal-toggle-btn {
            position: absolute;
            top: 50%;
            left: -35px;
            transform: translateY(-50%);
            background: #333;
            color: white;
            border: none;
            padding: 5px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1;
        }

        #contributor-btn {
            position: absolute;
            top: 50%;
            left: -70px;
            transform: translateY(-50%);
            background: #24292e;
            color: white;
            border: none;
            padding: 5px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 3px;
        }

        #contributor-btn:hover {
            background: #0366d6;
            transform: translateY(-50%) translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }

        #position-dropdown {
            position: absolute;
            top: 50%;
            left: -105px;
            transform: translateY(-50%);
            background: #4a90e2;
            color: white;
            border: none;
            padding: 5px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 3px;
        }

        #position-dropdown:hover {
            background: #357abd;
            transform: translateY(-50%) translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }

        .position-menu {
            position: absolute;
            bottom: -135px;
            left: -140px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            padding: 5px;
            display: none;
            z-index: 1000;
            min-width: 120px;
        }

        .position-menu.show {
            display: block;
        }

        .position-option {
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 11px;
            color: #333;
            transition: background 0.2s ease;
        }

        .position-option:hover {
            background: #f0f0f0;
        }

        .position-option.active {
            background: #4a90e2;
            color: white;
        }

        #facebook-downloader-btn:hover #terminal-toggle-btn,
        #facebook-downloader-btn:hover #contributor-btn,
        #facebook-downloader-btn:hover #position-dropdown {
            opacity: 1;
        }

        #terminal-toggle-btn:hover {
            background: #444;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }

        #terminal-console {
            position: fixed;
            bottom: -300px;
            left: 0;
            right: 0;
            height: 300px;
            background: #1e1e1e;
            border-top: 2px solid #333;
            z-index: 9998;
            transition: bottom 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        #terminal-console.show {
            bottom: 0;
        }

        #terminal-header {
            background: #333;
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #terminal-close {
            background: none;
            border: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #terminal-close:hover {
            color: white;
        }

        #terminal-content {
            flex: 1;
            background: #1e1e1e;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 16px;
            overflow-y: auto;
            white-space: pre-wrap;
            line-height: 1.4;
        }

        #terminal-content::-webkit-scrollbar {
            width: 8px;
        }

        #terminal-content::-webkit-scrollbar-track {
            background: #2d2d2d;
        }

        #terminal-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        #terminal-content::-webkit-scrollbar-thumb:hover {
            background: #777;
        }

        .log-info {
            color: #00ff00;
        }

        .log-success {
            color: #00ff00;
            font-weight: bold;
        }

        .log-error {
            color: #ff4444;
            font-weight: bold;
        }

        .log-warning {
            color: #ffaa00;
        }

        .log-progress {
            color: #44aaff;
        }

        #download-progress {
            position: fixed;
            top: 60px;
            right: 10px;
            z-index: 9999;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            display: none;
            max-width: 300px;
            word-wrap: break-word;
        }

        .notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            min-width: 300px;
            animation: fadeInOut 3s ease-in-out;
        }

        .notification.error {
            background: rgba(220, 53, 69, 0.9);
            border: 2px solid #dc3545;
        }

        .notification.warning {
            background: rgba(255, 193, 7, 0.9);
            border: 2px solid #ffc107;
            color: #000;
        }

        .notification.info {
            background: #20a464e6;
            border: 2px solid #00ff73ff;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }

        .fb-download-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            opacity: 0;
            font-size: 14px;
        }

        .fb-download-icon:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
        }

        div.x10l6tqk.x13vifvy:hover .fb-download-icon {
            opacity: 1;
        }

        div.xh8yej3:hover .fb-download-icon {
            opacity: 1;
        }

        div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6 {
            position: relative !important;
        }

        div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6:hover .fb-download-icon {
            opacity: 1;
        }

        div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3 {
            position: relative !important;
        }

        div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3:hover .fb-download-icon {
            opacity: 1;
        }
    `);

    // Create container for download button and drag handle
    const downloaderContainer = document.createElement('div');
    downloaderContainer.id = 'facebook-downloader-container';

    // Create bulk download button
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'facebook-downloader-btn';
    downloadBtn.innerHTML = 'Download All Images';

    // Create separate drag handle
    const dragHandle = document.createElement('div');
    dragHandle.id = 'drag-handle';
    dragHandle.innerHTML = '🌠';
    dragHandle.title = 'Drag to move';

    // Create terminal toggle button
    const terminalToggleBtn = document.createElement('button');
    terminalToggleBtn.id = 'terminal-toggle-btn';
    terminalToggleBtn.textContent = '⬇️';
    terminalToggleBtn.title = 'Toggle Terminal Console';

    // Create contributor button
    const contributorBtn = document.createElement('a');
    contributorBtn.id = 'contributor-btn';
    contributorBtn.href = 'https://github.com/bibekchandsah/fb-ig-image-auto-download';
    contributorBtn.target = '_blank';
    contributorBtn.title = 'View on GitHub - Contribute';
    contributorBtn.innerHTML = '<span style="font-size: 14px;">⭐</span>';

    // Create position dropdown
    const positionDropdown = document.createElement('button');
    positionDropdown.id = 'position-dropdown';
    positionDropdown.title = 'Change icon position';
    positionDropdown.innerHTML = '📍';

    // Create dropdown menu
    const positionMenu = document.createElement('div');
    positionMenu.className = 'position-menu';
    positionMenu.innerHTML = `
        <div class="position-option active" data-position="top-left">Top Left</div>
        <div class="position-option" data-position="top-right">Top Right</div>
        <div class="position-option" data-position="bottom-right">Bottom Right</div>
        <div class="position-option" data-position="bottom-left">Bottom Left</div>
        <div class="position-option" data-position="center">Center</div>
    `;
    positionDropdown.appendChild(positionMenu);

    // Assemble the container - download button contains all control buttons
    downloadBtn.appendChild(dragHandle);
    downloadBtn.appendChild(terminalToggleBtn);
    downloadBtn.appendChild(contributorBtn);
    downloadBtn.appendChild(positionDropdown);
    downloaderContainer.appendChild(downloadBtn);

    document.body.appendChild(downloaderContainer);

    // Add drag functionality to the separate handle
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    dragHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;

        const rect = downloaderContainer.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        downloaderContainer.classList.add('dragging');
        document.body.style.userSelect = 'none';
    });

    // Prevent drag handle from triggering download on any click event
    dragHandle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        e.preventDefault();
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // Keep container within viewport bounds
        const maxX = window.innerWidth - downloaderContainer.offsetWidth;
        const maxY = window.innerHeight - downloaderContainer.offsetHeight;

        const constrainedX = Math.max(0, Math.min(x, maxX));
        const constrainedY = Math.max(0, Math.min(y, maxY));

        downloaderContainer.style.left = constrainedX + 'px';
        downloaderContainer.style.top = constrainedY + 'px';
        downloaderContainer.style.right = 'auto';
    });

    document.addEventListener('mouseup', function(e) {
        if (isDragging) {
            isDragging = false;
            downloaderContainer.classList.remove('dragging');
            document.body.style.userSelect = '';

            // Save position to localStorage
            const rect = downloaderContainer.getBoundingClientRect();
            localStorage.setItem('fb-downloader-pos', JSON.stringify({
                left: rect.left,
                top: rect.top
            }));
        }
    });

    // Additional safety: end drag on mouse leave (prevents sticking)
    document.addEventListener('mouseleave', function(e) {
        if (isDragging) {
            isDragging = false;
            downloaderContainer.classList.remove('dragging');
            document.body.style.userSelect = '';
        }
    });

    // End drag if Escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDragging) {
            isDragging = false;
            downloaderContainer.classList.remove('dragging');
            document.body.style.userSelect = '';
        }
    });

    // Restore saved position
    const savedPos = localStorage.getItem('fb-downloader-pos');
    if (savedPos) {
        try {
            const pos = JSON.parse(savedPos);
            downloaderContainer.style.left = pos.left + 'px';
            downloaderContainer.style.top = pos.top + 'px';
            downloaderContainer.style.right = 'auto';
        } catch (e) {
            console.log('Could not restore container position:', e);
        }
    }

    // Create terminal console
    const terminalConsole = document.createElement('div');
    terminalConsole.id = 'terminal-console';

    const terminalHeader = document.createElement('div');
    terminalHeader.id = 'terminal-header';
    terminalHeader.innerHTML = `
        <span>Facebook Downloader Terminal</span>
        <button id="terminal-close">×</button>
    `;

    const terminalContent = document.createElement('div');
    terminalContent.id = 'terminal-content';
    terminalContent.textContent = 'Terminal initialized. Ready for operations...\n';

    terminalConsole.appendChild(terminalHeader);
    terminalConsole.appendChild(terminalContent);
    document.body.appendChild(terminalConsole);

    // Add event listeners for terminal (after elements are in DOM)
    terminalToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleTerminal();
    });

    // Prevent contributor button from triggering download
    contributorBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Don't prevent default since we want the link to work
    });

    // Position dropdown functionality
    let currentPosition = localStorage.getItem('fb-icon-position') || 'top-left';

    const positionSettings = {
        'top-left': { top: '10px', left: '10px', right: 'auto', bottom: 'auto', transform: 'none' },
        'top-right': { top: '10px', right: '10px', left: 'auto', bottom: 'auto', transform: 'none' },
        'bottom-right': { bottom: '10px', right: '10px', top: 'auto', left: 'auto', transform: 'none' },
        'bottom-left': { bottom: '10px', left: '10px', top: 'auto', right: 'auto', transform: 'none' },
        'center': { top: '50%', right: '50%', left: 'auto', bottom: 'auto', transform: 'none' }
    };

    function updateIconPosition(position) {
        const settings = positionSettings[position];
        const iconStyle = `
            .fb-download-icon {
                position: absolute;
                top: ${settings.top};
                right: ${settings.right};
                bottom: ${settings.bottom};
                left: ${settings.left};
                transform: ${settings.transform};
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 5px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;

        // Remove old style if exists
        const oldStyle = document.getElementById('fb-icon-position-style');
        if (oldStyle) oldStyle.remove();

        // Add new style
        const styleElement = document.createElement('style');
        styleElement.id = 'fb-icon-position-style';
        styleElement.textContent = iconStyle;
        document.head.appendChild(styleElement);

        // Update active option in menu
        positionMenu.querySelectorAll('.position-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.position === position) {
                option.classList.add('active');
            }
        });

        currentPosition = position;
        localStorage.setItem('fb-icon-position', position);

        // Log the change
        if (typeof logToTerminal === 'function') {
            logToTerminal(`Icon position changed to: ${position}`, 'info');
        }
    }

    // Initialize with saved position
    updateIconPosition(currentPosition);

    // Position dropdown event listeners
    positionDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        positionMenu.classList.toggle('show');
    });

    // Position option click handlers
    positionMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('position-option')) {
            e.preventDefault();
            e.stopPropagation();
            const position = e.target.dataset.position;
            updateIconPosition(position);
            positionMenu.classList.remove('show');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!positionDropdown.contains(e.target)) {
            positionMenu.classList.remove('show');
        }
    });

    document.getElementById('terminal-close').addEventListener('click', () => {
        if (terminalVisible) {
            toggleTerminal();
        }
    });

    // Create progress indicator
    const progressDiv = document.createElement('div');
    progressDiv.id = 'download-progress';
    document.body.appendChild(progressDiv);

    let downloadCount = 0;
    let isDownloading = false;
    let addedIcons = new Set();
    let terminalVisible = false;

    // Notification system
    function showNotification(message, type = 'info', duration = 3000) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);

        return notification;
    }

    // Terminal logging functions
    function logToTerminal(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logLine = `[${timestamp}] ${message}\n`;

        const content = document.getElementById('terminal-content');
        const logElement = document.createElement('span');
        logElement.className = `log-${type}`;
        logElement.textContent = logLine;

        content.appendChild(logElement);
        content.scrollTop = content.scrollHeight;
    }

    function clearTerminal() {
        const content = document.getElementById('terminal-content');
        content.innerHTML = '';
        logToTerminal('Terminal cleared', 'info');
    }

    // Terminal toggle functionality
    function toggleTerminal() {
        terminalVisible = !terminalVisible;
        const terminal = document.getElementById('terminal-console');

        if (terminalVisible) {
            terminal.classList.add('show');
            terminalToggleBtn.textContent = '⬆️';
            terminalToggleBtn.title = 'Hide Terminal Console';
            logToTerminal('Terminal opened', 'info');
        } else {
            terminal.classList.remove('show');
            terminalToggleBtn.textContent = '⬇️';
            terminalToggleBtn.title = 'Show Terminal Console';
        }
    }

    // Notification system
    function showNotification(message, type = 'info', duration = 3000) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);

        return notification;
    }

    function extractImageUrl(img) {
        if (img.src) {
            return img.src;
        } else if (img.dataset && img.dataset.src) {
            return img.dataset.src;
        } else if (img.getAttribute('data-src')) {
            return img.getAttribute('data-src');
        }
        return null;
    }

    // Function to extract post date from Facebook post
    function extractPostDate(divElement) {
        try {
            // Find the closest post container first
            const postContainer = divElement.closest('div.x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld') ||
                                divElement.querySelector('div.x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld');

            if (!postContainer) {
                console.log('Facebook Date Extractor: No post container found');
                return null;
            }

            // Try multiple approaches to find date elements
            let dateText = null;

            // Approach 1: Look for the specific date structure you mentioned
            const dateDiv = postContainer.querySelector('div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x17zd0t2.x78zum5.x1q0g3np.x1a02dak');
            if (dateDiv) {
                console.log('Facebook Date Extractor: Found date div');
                const dateSpan = dateDiv.querySelector('span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j');
                if (dateSpan) {
                    console.log('Facebook Date Extractor: Found date span');
                    const dateAnchor = dateSpan.querySelector('a.x1i10hfl.xjbqb8w.x1ejq31n.x18oe1m7.x1sy0etr.xstzfhl.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1ypdohk.xt0psk2.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xkrqix3.x1sur9pj.xi81zsa.x1s688f');
                    if (dateAnchor) {
                        console.log('Facebook Date Extractor: Found date anchor');
                        const finalSpan = dateAnchor.querySelector('span.x1rg5ohu.x6ikm8r.x10wlt62.x16dsc37.xt0b8zv');
                        if (finalSpan) {
                            dateText = finalSpan.textContent || finalSpan.innerText;
                            console.log('Facebook Date Extractor: Found date text (Approach 1):', dateText);
                        }
                    }
                }
            }

            // Approach 2: Look for any time/date related elements
            if (!dateText || dateText.length < 3) {
                console.log('Facebook Date Extractor: Trying Approach 2 - time elements');
                const timeElements = postContainer.querySelectorAll('time, [datetime], [data-utime], [title*="20"], [aria-label*="20"]');
                for (let timeEl of timeElements) {
                    const text = timeEl.textContent || timeEl.innerText || timeEl.getAttribute('datetime') ||
                                timeEl.getAttribute('data-utime') || timeEl.getAttribute('title') || timeEl.getAttribute('aria-label');
                    if (text && text.trim().length > 2) {
                        dateText = text;
                        console.log('Facebook Date Extractor: Found date text (Approach 2):', dateText);
                        break;
                    }
                }
            }

            // Approach 3: Look for spans that might contain date text (more aggressive)
            if (!dateText || dateText.length < 3) {
                console.log('Facebook Date Extractor: Trying Approach 3 - span search');
                const spans = postContainer.querySelectorAll('span, a');
                for (let span of spans) {
                    const text = span.textContent || span.innerText;
                    if (text && text.trim().length > 2 && text.trim().length < 50) {
                        // Check for date patterns
                        if (/\\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2}[,\\s]*\\d{4}/i.test(text) ||
                            /\\b\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{4}\\b/.test(text) ||
                            /\\b\\d{4}[/\\-]\\d{1,2}[/\\-]\\d{1,2}\\b/.test(text) ||
                            /\\b(yesterday|today|\\d+\\s*(h|hour|hours|m|min|minute|minutes|d|day|days)\\s*ago)\\b/i.test(text) ||
                            /\\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2}\\b/i.test(text) ||
                            text.includes('20') && (text.includes('Jan') || text.includes('Feb') || text.includes('Mar') ||
                            text.includes('Apr') || text.includes('May') || text.includes('Jun') ||
                            text.includes('Jul') || text.includes('Aug') || text.includes('Sep') ||
                            text.includes('Oct') || text.includes('Nov') || text.includes('Dec'))) {
                            dateText = text;
                            console.log('Facebook Date Extractor: Found date text (Approach 3):', dateText);
                            break;
                        }
                    }
                }
            }

            // Approach 4: Really aggressive search - look for any text that might be a date
            if (!dateText || dateText.length < 3) {
                console.log('Facebook Date Extractor: Trying Approach 4 - aggressive search');
                const allElements = postContainer.querySelectorAll('*');
                for (let elem of allElements) {
                    const text = elem.textContent || elem.innerText;
                    if (text && elem.children.length === 0 && text.trim().length > 2 && text.trim().length < 30) {
                        // Look for very specific patterns
                        if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2}[,\\s]*\\d{4}$/i.test(text.trim()) ||
                            /^\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{4}$/.test(text.trim()) ||
                            /^(yesterday|today|\\d+\\s*(h|hour|hours|m|min|minute|minutes|d|day|days)\\s*ago)$/i.test(text.trim())) {
                            dateText = text.trim();
                            console.log('Facebook Date Extractor: Found date text (Approach 4):', dateText);
                            break;
                        }
                    }
                }
            }

            if (dateText) {
                console.log('Facebook Date Extractor: Raw date text:', dateText);

                // First, handle the Facebook dash-separated character issue
                let cleanDate = dateText;

                // Remove the dash-separated character formatting that Facebook uses
                // This converts "-S---e--p-------t-e----m--b---er-- --25--" to "September 25"
                cleanDate = cleanDate.replace(/-+/g, '').replace(/\s+/g, ' ').trim();

                console.log('Facebook Date Extractor: After removing dashes:', cleanDate);

                // Now remove any remaining invalid filename characters
                cleanDate = cleanDate.replace(/[<>:"/\\|?*\x00-\x1f\x7f-\x9f]/g, '').trim();

                console.log('Facebook Date Extractor: After removing invalid chars:', cleanDate);

                // Replace multiple spaces with single spaces
                cleanDate = cleanDate.replace(/\s+/g, ' ');

                console.log('Facebook Date Extractor: Final cleaning:', cleanDate);

                // Validate the cleaned date
                if (cleanDate.length > 2 && cleanDate.length < 50) {
                    // Check if it contains reasonable date content
                    const hasMonth = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\b/i.test(cleanDate);
                    const hasNumber = /\d/.test(cleanDate);
                    const hasTimeIndicator = /\b(AM|PM|at|ago|hour|min|day|yesterday|today)\b/i.test(cleanDate);

                    if (hasMonth || hasNumber || hasTimeIndicator) {
                        console.log('Facebook Date Extractor: Final date:', cleanDate);
                        return cleanDate;
                    }
                }

                console.log('Facebook Date Extractor: Date validation failed');
                return null;
            }

            console.log('Facebook Date Extractor: No date found');
            return null;
        } catch (error) {
            console.log('Facebook Date Extractor: Error extracting post date:', error);
            return null;
        }
    }

    // Function to determine image type based on CSS classes
    function getImageType(img) {
        const className = img.className;

        // Check for new image class (priority check)
        if (className.includes('xz74otr') && className.includes('x16uus16') && className.includes('xbiv7yw') && className.includes('xjbqb8w') && className.includes('xu25z0z') && className.includes('x1fmog5m') && className.includes('x1o0tod') && className.includes('x10l6tqk') && className.includes('xwa60dl') && className.includes('x1cb1t30') && className.includes('xh8yej3') && className.includes('x1ja2u2z')) {
            return 'story-view';
        }
        // Check for post view (existing class)
        else if (className.includes('x15mokao') && className.includes('x1ga7v0g') && className.includes('x16uus16') && className.includes('xbiv7yw') && className.includes('x1bwycvy') && className.includes('x193iq5w') && className.includes('x4fas0m') && className.includes('x19kjcj4')) {
            return 'post-view';
        }
        // Check for multiple photos (existing class)
        else if (className.includes('xz74otr') && className.includes('x15mokao') && className.includes('x1ga7v0g') && className.includes('x16uus16') && className.includes('xbiv7yw')) {
            return 'multiple-photos';
        }
        // Check for post photo (priority 3)
        else if (className.includes('x15mokao') && className.includes('x1ga7v0g') && className.includes('x16uus16') && className.includes('xbiv7yw') && className.includes('xl1xv1r')) {
            return 'post-photo';
        }
        // Check for profile photo (priority 1)
        else if (className.includes('x1rg5ohu') && className.includes('xl1xv1r') && !className.includes('x15mokao')) {
            return 'profile-photo';
        }
        // Check for cover photo (priority 2)
        else if (className.includes('xz74otr') && className.includes('x1ey2m1c') && className.includes('x9f619')) {
            return 'cover-photo';
        }
        // Fallback
        else {
            return 'unknown-photo';
        }
    }

    // Function to generate filename
    function generateFilename(altText, index, imageType, postDate) {
        let filename = `fb-image-${index}-`;

        // Add post date if available
        if (postDate) {
            filename += `${postDate}-`;
        }

        filename += `${imageType}-`;

        if (altText) {
            let cleanAlt = altText.replace(/[<>:"/\\|?*]/g, '').trim();
            if (cleanAlt.length > 50) {
                cleanAlt = cleanAlt.substring(0, 50) + '...';
            }
            filename += cleanAlt;
        } else {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename += timestamp;
        }

        return filename + '.jpg';
    }

    // Function to download image
    async function downloadImage(img, divElement) {
        const imageUrl = extractImageUrl(img);
        if (!imageUrl) {
            logToTerminal('Could not extract image URL from current image', 'error');
            showNotification('❌ Failed to extract image URL!\nThe image source could not be found.', 'error', 4000);
            return;
        }

        const altText = img.alt || img.getAttribute('alt') || '';
        const imageType = getImageType(img);
        const postDate = extractPostDate(divElement);
        downloadCount++;
        const filename = generateFilename(altText, downloadCount, imageType, postDate);

        try {
            logToTerminal(`Starting download: ${filename}`, 'info');
            GM_download(imageUrl, filename);
            logToTerminal(`Successfully downloaded: ${filename}`, 'success');
            showNotification(`✅ Image downloaded!\n${filename}`, 'info', 2500);
            console.log(`Downloaded: ${filename}`);
        } catch (error) {
            logToTerminal(`Failed to download image: ${filename} - ${error.message}`, 'error');
            showNotification(`❌ Download failed!\n${filename}\n${error.message}`, 'error', 4000);
            console.error('Failed to download image:', error);
        }
    }

    // Function to add download icon to a div
    function addDownloadIcon(divElement) {
        // Check if icon already exists
        if (divElement.querySelector('.fb-download-icon') || addedIcons.has(divElement)) {
            return false;
        }

        // Find the specific image with the target classes - try all six selectors
        let img = divElement.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3'); // Priority 1

        if (!img) {
            // Try the second image selector
            img = divElement.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3'); // Priority 2
        }

        if (!img) {
            // Try the third image selector
            img = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r'); // Priority 3
        }

        if (!img) {
            // Try the fourth image selector (multiple photos)
            img = divElement.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3'); // Priority 4
        }

        if (!img) {
            // Try the fifth image selector (post view)
            img = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1bwycvy.x193iq5w.x4fas0m.x19kjcj4'); // Priority 5
        }

        if (!img) {
            // Try the sixth image selector (special photo)
            img = divElement.querySelector('img.xz74otr.x16uus16.xbiv7yw.xjbqb8w.xu25z0z.x1fmog5m.x1o0tod.x10l6tqk.xwa60dl.x1cb1t30.xh8yej3.x1ja2u2z'); // Priority 6
        }

        if (!img) {
            return false;
        }

        // Create download icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'fb-download-icon';
        iconContainer.title = 'Download this image';
        iconContainer.textContent = '💾';

        // Add click event
        iconContainer.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Find current image at click time - try all six selectors
            let currentImg = divElement.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3');

            if (!currentImg) {
                currentImg = divElement.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');
            }

            if (!currentImg) {
                currentImg = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r');
            }

            if (!currentImg) {
                currentImg = divElement.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');
            }

            if (!currentImg) {
                currentImg = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1bwycvy.x193iq5w.x4fas0m.x19kjcj4');
            }

            if (!currentImg) {
                currentImg = divElement.querySelector('img.xz74otr.x16uus16.xbiv7yw.xjbqb8w.xu25z0z.x1fmog5m.x1o0tod.x10l6tqk.xwa60dl.x1cb1t30.xh8yej3.x1ja2u2z');
            }

            if (currentImg) {
                await downloadImage(currentImg, divElement);

                // Visual feedback
                const originalBg = iconContainer.style.background;
                iconContainer.style.background = 'rgba(0, 128, 0, 0.8)';
                setTimeout(() => {
                    iconContainer.style.background = originalBg;
                }, 1000);
            } else {
                // Check if this might be a video by looking for video elements
                const hasVideo = divElement.querySelector('video') !== null;
                const hasVideoIcon = divElement.querySelector('[aria-label*="video" i]') !== null;

                if (hasVideo || hasVideoIcon) {
                    logToTerminal('Video content detected - cannot download videos as images', 'warning');
                    showNotification('📹 This appears to be a video, not an image!\nVideos cannot be downloaded with this tool.', 'warning', 4000);
                } else {
                    logToTerminal('No current image found for download - content may be a video or unsupported format', 'error');
                    showNotification('🚫 No image found!\nThis might be a video or unsupported content.', 'error', 4000);
                }
            }
        });

        divElement.appendChild(iconContainer);
        addedIcons.add(divElement);
        return true;
    }

    // Function to wait for a specified time
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to scroll to load more content
    async function scrollToLoadMore() {
        const initialHeight = document.body.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);

        // Wait for potential new content to load
        await delay(3000);

        const newHeight = document.body.scrollHeight;
        return newHeight > initialHeight;
    }

    // Function to collect and download new images from current viewport
    async function collectAndDownloadNewImages(downloadedUrls) {
        const allDivs = [
            ...document.querySelectorAll('div.xh8yej3'),
            ...document.querySelectorAll('div.x1qjc9v5.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x1ey2m1c.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.xtijo5x.x1o0tod.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x10l6tqk.x13vifvy.x1ja2u2z'),
            ...document.querySelectorAll('div.x10l6tqk.x13vifvy'),
            ...document.querySelectorAll('div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6'),
            ...document.querySelectorAll('div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3')
        ];

        let newImagesDownloaded = 0;

        logToTerminal(`Scanning ${allDivs.length} posts for new images`, 'progress');

        for (const div of allDivs) {
            // Try to find image with any of the supported selectors
            let img = div.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3') ||
                     div.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3') ||
                     div.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r') ||
                     div.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3') ||
                     div.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1bwycvy.x193iq5w.x4fas0m.x19kjcj4') ||
                     div.querySelector('img.xz74otr.x16uus16.xbiv7yw.xjbqb8w.xu25z0z.x1fmog5m.x1o0tod.x10l6tqk.xwa60dl.x1cb1t30.xh8yej3.x1ja2u2z');

            if (img) {
                const imageUrl = extractImageUrl(img);
                if (imageUrl && !downloadedUrls.has(imageUrl)) {
                    downloadedUrls.add(imageUrl);

                    const altText = img.alt || img.getAttribute('alt') || '';
                    const imageType = getImageType(img);
                    const postDate = extractPostDate(div);
                    downloadCount++;
                    const filename = generateFilename(altText, downloadCount, imageType, postDate);

                    try {
                        logToTerminal(`Downloading: ${filename}`, 'progress');
                        GM_download(imageUrl, filename);
                        newImagesDownloaded++;

                        progressDiv.textContent = `Downloaded ${downloadCount} images - ${filename.substring(0, 50)}...`;
                        await delay(300);
                    } catch (error) {
                        logToTerminal(`Failed to download: ${filename} - ${error.message}`, 'error');
                        console.error('Failed to download image:', error);
                    }
                }
            }
        }

        if (newImagesDownloaded > 0) {
            logToTerminal(`Downloaded ${newImagesDownloaded} new images from current viewport`, 'success');
        }

        return newImagesDownloaded;
    }

    // Function to scroll and download images simultaneously
    async function scrollAndDownloadImages() {
        const downloadedUrls = new Set();
        let hasMoreContent = true;
        let noNewImagesCount = 0;
        let noNewContentCount = 0;
        let scrollAttempts = 0;

        logToTerminal('Starting bulk download process', 'info');
        logToTerminal('Collecting images from initial viewport', 'progress');

        // Download images from the initial viewport
        await collectAndDownloadNewImages(downloadedUrls);

        while (hasMoreContent && noNewImagesCount < 5 && noNewContentCount < 5) {
            const beforeHeight = document.body.scrollHeight;
            const beforeDownloadCount = downloadCount;

            // Scroll down
            logToTerminal(`Scrolling down (attempt ${scrollAttempts + 1})`, 'progress');
            window.scrollTo(0, document.body.scrollHeight);
            scrollAttempts++;

            // Wait for content to load
            await delay(2000);

            // Download new images that appeared
            const newImages = await collectAndDownloadNewImages(downloadedUrls);

            const afterHeight = document.body.scrollHeight;
            const afterDownloadCount = downloadCount;

            // Check if we found new content or images
            if (afterHeight > beforeHeight) {
                noNewContentCount = 0; // Reset counter if new content appeared
                logToTerminal(`New content loaded, page height: ${afterHeight}px`, 'info');
            } else {
                noNewContentCount++;
                logToTerminal(`No new content found (${noNewContentCount}/5)`, 'warning');
            }

            if (afterDownloadCount > beforeDownloadCount) {
                noNewImagesCount = 0; // Reset counter if new images were downloaded
            } else {
                noNewImagesCount++;
                logToTerminal(`No new images found (${noNewImagesCount}/5)`, 'warning');
            }

            progressDiv.textContent = `Scrolling and downloading... Found ${downloadCount} images (attempt ${scrollAttempts})`;

            // Check if we've reached the end
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
                if (noNewContentCount >= 3 && noNewImagesCount >= 3) {
                    hasMoreContent = false;
                    logToTerminal('Reached end of content', 'info');
                }
            }
        }

        // Final attempt to collect any remaining images
        logToTerminal('Performing final scan for any remaining images', 'progress');
        await delay(2000);
        await collectAndDownloadNewImages(downloadedUrls);

        logToTerminal(`Bulk download completed! Total attempts: ${scrollAttempts}`, 'success');
        return { totalDownloaded: downloadCount, scrollAttempts };
    }

    // Function to find and download all images
    async function findAndDownloadAllImages() {
        if (isDownloading) {
            logToTerminal('Download already in progress!', 'warning');
            alert('Download already in progress!');
            return;
        }

        isDownloading = true;
        downloadCount = 0; // Reset counter
        progressDiv.style.display = 'block';
        progressDiv.textContent = 'Starting simultaneous scroll and download...';

        // Clear terminal and show it if not visible
        clearTerminal();
        if (!terminalVisible) {
            toggleTerminal();
        }

        logToTerminal('=== Starting Facebook Image Download Session ===', 'info');
        logToTerminal('Initializing bulk download process...', 'progress');

        try {
            // Scroll and download images simultaneously
            const { totalDownloaded, scrollAttempts } = await scrollAndDownloadImages();

            const successMessage = `Download complete! Successfully downloaded ${totalDownloaded} images after ${scrollAttempts} scroll attempts.`;
            progressDiv.textContent = successMessage;
            logToTerminal(`=== Download Session Complete ===`, 'success');
            logToTerminal(`Total images downloaded: ${totalDownloaded}`, 'success');
            logToTerminal(`Scroll attempts: ${scrollAttempts}`, 'info');

            if (totalDownloaded === 0) {
                const noImagesMessage = 'No images found with the specified classes. Make sure you are on a Facebook page with images.';
                progressDiv.textContent = noImagesMessage;
                logToTerminal(noImagesMessage, 'warning');
            }

            await delay(5000);
            progressDiv.style.display = 'none';

        } catch (error) {
            const errorMessage = `Error occurred during download process: ${error.message}`;
            console.error('Error during download process:', error);
            progressDiv.textContent = 'Error occurred during download process';
            logToTerminal(`=== Download Session Failed ===`, 'error');
            logToTerminal(errorMessage, 'error');
            await delay(3000);
            progressDiv.style.display = 'none';
        }

        isDownloading = false;
    }

    // Function to scan for target divs with priority system
    function scanForImages() {
        // First, find all post containers
        const postContainers = document.querySelectorAll('div.x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld');
        let newIconsAdded = 0;

        postContainers.forEach(postContainer => {
            let hasAddedIcon = false;

            // Priority 1: Check for xh8yej3 div first
            const priority1Div = postContainer.querySelector('div.xh8yej3');

            if (priority1Div) {
                const priority1Img = priority1Div.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3');

                if (priority1Img && addDownloadIcon(priority1Div)) {
                    newIconsAdded++;
                    hasAddedIcon = true;
                    return; // Skip other divs in this post container
                }
            }

            // Priority 2: Check for the new long div class
            const priority2Div = postContainer.querySelector('div.x1qjc9v5.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x1ey2m1c.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.xtijo5x.x1o0tod.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x10l6tqk.x13vifvy.x1ja2u2z');

            if (priority2Div && !hasAddedIcon) {
                const priority2Img = priority2Div.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');

                if (priority2Img && addDownloadIcon(priority2Div)) {
                    newIconsAdded++;
                    hasAddedIcon = true;
                    return; // Skip other divs in this post container
                }
            }

            // Priority 3: Check for regular divs (x10l6tqk x13vifvy) - handle differently for multiple photos
            const priority3Divs = postContainer.querySelectorAll('div.x10l6tqk.x13vifvy');

            priority3Divs.forEach(div => {
                // Check if this div has multiple photos image
                const multiplePhotosImg = div.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');

                if (multiplePhotosImg) {
                    // For multiple photos, add icon to each individual div
                    if (addDownloadIcon(div)) {
                        newIconsAdded++;
                    }
                } else if (!hasAddedIcon) {
                    // For single post photos, use priority system
                    const priority3Img = div.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r');

                    if (priority3Img && addDownloadIcon(div)) {
                        newIconsAdded++;
                        hasAddedIcon = true;
                    }
                }
            });
        });

        // Also scan for standalone divs not inside post containers (fallback)
        const standaloneDivs1 = document.querySelectorAll('div.xh8yej3:not(.xdj266r .xh8yej3)');
        const standaloneDivs2 = document.querySelectorAll('div.x1qjc9v5.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x1ey2m1c.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.xtijo5x.x1o0tod.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x10l6tqk.x13vifvy.x1ja2u2z:not(.xdj266r .x1qjc9v5)');
        const standaloneDivs3 = document.querySelectorAll('div.x10l6tqk.x13vifvy:not(.xdj266r .x10l6tqk.x13vifvy)');
        const standaloneDivs4 = document.querySelectorAll('div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6');
        const standaloneDivs5 = document.querySelectorAll('div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3');

        [...standaloneDivs1, ...standaloneDivs2, ...standaloneDivs3, ...standaloneDivs4, ...standaloneDivs5].forEach(div => {
            if (addDownloadIcon(div)) {
                newIconsAdded++;
            }
        });

        if (newIconsAdded > 0) {
            logToTerminal(`Added ${newIconsAdded} download icons to new posts`, 'info');
            console.log(`Added ${newIconsAdded} download icons to Facebook posts`);
        }
    }

    // Start monitoring
    function startMonitoring() {
        logToTerminal('Facebook Simple Image Downloader script loaded successfully', 'success');
        logToTerminal('Individual download icons will appear on hover', 'info');
        logToTerminal('Click the Download button or press Ctrl+Shift+D for bulk download', 'info');
        logToTerminal('Press Ctrl+` to toggle this terminal', 'info');
        console.log('Facebook Simple Image Downloader loaded');

        // Initial scan
        setTimeout(scanForImages, 2000);

        // Set up observer for new content
        const observer = new MutationObserver(() => {
            setTimeout(scanForImages, 1000);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Periodic scan
        setInterval(scanForImages, 5000);
    }

    // Add click event to bulk download button
    downloadBtn.addEventListener('click', function(e) {
        // Only trigger download if the button itself (or its text) is clicked, not child elements
        if (e.target === downloadBtn || e.target.tagName === undefined) {
            findAndDownloadAllImages();
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + D for bulk download
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            findAndDownloadAllImages();
        }
        // Ctrl + ` for terminal toggle
        else if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMonitoring);
    } else {
        startMonitoring();
    }

    console.log('Facebook Image Downloader loaded. Individual download icons will appear on hover. Click the "Download All Images" button or press Ctrl+Shift+D to start bulk downloading.');

})();
