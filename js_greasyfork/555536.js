// ==UserScript==
// @name         TrixBox
// @namespace    http://tampermonkey.net/
// @version      0.8.9
// @description  TriX Executor's ChatBox (for territorial.io)!
// @author       Painsel
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/555536/TrixBox.user.js
// @updateURL https://update.greasyfork.org/scripts/555536/TrixBox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHATTABLE_HEADER_HEIGHT = 45; // pixels

    // --- Theme Colors (for UI elements outside the iframe) ---
    const theme = {
        icon: '#2f3136',
        modalBg: '#2f3136',
        text: '#dcddde',
        buttonPrimary: '#5865f2',
        buttonSecondary: '#4f545c'
    };

    // --- MOBILE OPTIMIZATION ---
    const isMobile = () => window.innerWidth < 768;
    
    const addMobileStyles = () => {
        const mobileStyle = `
            @media (max-width: 768px) {
                #trixbox-container {
                    width: 100% !important;
                    height: 100% !important;
                    max-width: 100% !important;
                    max-height: 100% !important;
                    border-radius: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                }
                #trixbox-iframe-wrapper {
                    height: calc(100% - 45px) !important;
                }
                .trixbox-modal-content, .trixbox-search-content, .trixbox-pm-content,
                .trixbox-profile-content, .trixbox-gallery-content, .trixbox-stats-content,
                .trixbox-leaderboard-content {
                    width: 95% !important;
                    max-width: 95% !important;
                    max-height: 90vh !important;
                }
                #trixbox-header-buttons {
                    flex-wrap: wrap;
                    gap: 5px;
                }
                #trixbox-header-buttons button {
                    padding: 0 5px !important;
                    font-size: 12px !important;
                }
            }
            @media (max-width: 480px) {
                #trixbox-container {
                    font-size: 12px;
                }
                .trixbox-modal-content, .trixbox-search-content, .trixbox-pm-content,
                .trixbox-profile-content, .trixbox-gallery-content, .trixbox-stats-content,
                .trixbox-leaderboard-content {
                    padding: 15px !important;
                }
                .trixbox-stats-grid {
                    grid-template-columns: 1fr !important;
                }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = mobileStyle;
        document.head.appendChild(styleSheet);
    };
 
    const SCRIPT_UPDATE_URL = 'https://update.greasyfork.org/scripts/555536/TrixBox.meta.js';
    const SCRIPT_INSTALL_URL = 'https://update.greasyfork.org/scripts/555536/TrixBox.user.js';
 
    // --- 1. UPDATE CHECKING LOGIC ---
 
    const showUpdateModal = () => {
        const modalStyle = `
            .trixbox-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100000; display: flex; align-items: center; justify-content: center; }
            .trixbox-modal-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; text-align: center; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
            .trixbox-modal-content h2 { margin-top: 0; }
            .trixbox-modal-content p { margin: 15px 0; }
            .trixbox-modal-btn { color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 0 10px; font-size: 14px; }
            .trixbox-modal-btn.primary { background: ${theme.buttonPrimary}; }
            .trixbox-modal-btn.secondary { background: ${theme.buttonSecondary}; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
 
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'trixbox-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="trixbox-modal-content">
                <h2>OUTDATED VERSION</h2>
                <p>You are using an Outdated version of TrixBox.<br>Please update for the best experience!</p>
                <button id="trixbox-update-btn" class="trixbox-modal-btn primary">Update Now!</button>
                <button id="trixbox-later-btn" class="trixbox-modal-btn secondary">Remind Me Later!</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);
 
        document.getElementById('trixbox-update-btn').onclick = () => { window.location.href = SCRIPT_INSTALL_URL; };
        document.getElementById('trixbox-later-btn').onclick = () => { modalOverlay.remove(); };
    };
 
    const checkForUpdates = () => {
        try {
            const localVersion = GM_info.script.version;
            const lastSeenVersion = localStorage.getItem('trixbox-last-version');
            
            // Show changelog if version has changed
            if (lastSeenVersion !== localVersion) {
                localStorage.setItem('trixbox-last-version', localVersion);
                setTimeout(showChangelog, 500);
            }
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: SCRIPT_UPDATE_URL,
                onload: function(response) {
                    if (response.status !== 200) return;
                    const remoteVersionMatch = response.responseText.match(/@version\s+([0-9.]+)/);
                    if (remoteVersionMatch && remoteVersionMatch[1]) {
                        if (remoteVersionMatch[1] > localVersion) {
                            showUpdateModal();
                        }
                    }
                }
            });
        } catch (e) { console.error('TrixBox: Update check failed.', e); }
    };

    const showChangelog = () => {
        const modalStyle = `
            .trixbox-changelog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100002; display: flex; align-items: center; justify-content: center; }
            .trixbox-changelog-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 400px; max-height: 70vh; overflow-y: auto; }
            .trixbox-changelog-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-changelog-section { margin: 15px 0; }
            .trixbox-changelog-version { font-weight: bold; color: ${theme.buttonPrimary}; margin-bottom: 8px; }
            .trixbox-changelog-list { list-style: none; padding-left: 0; margin: 5px 0; }
            .trixbox-changelog-list li { margin: 5px 0; padding-left: 20px; position: relative; }
            .trixbox-changelog-list li:before { content: "✓"; position: absolute; left: 0; color: ${theme.buttonPrimary}; }
            .trixbox-changelog-btn { width: 100%; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px; font-size: 14px; background: ${theme.buttonPrimary}; }
            .trixbox-changelog-btn:hover { opacity: 0.9; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);

        const overlay = document.createElement('div');
        overlay.className = 'trixbox-changelog-overlay';
        overlay.innerHTML = `
            <div class="trixbox-changelog-content">
                <h2>What's New in v0.6.7</h2>
                <div class="trixbox-changelog-section">
                    <div class="trixbox-changelog-version">v0.6.7 - Configurable Settings</div>
                    <ul class="trixbox-changelog-list">
                        <li>Configurable hotkey for disabling chat focus in main settings</li>
                        <li>New TrixBox settings header with toggle controls</li>
                        <li>Click-outside toggle for New TrixBox window</li>
                        <li>Persistent settings via localStorage</li>
                        <li>Enhanced settings modals with better UX</li>
                    </ul>
                </div>
                <div class="trixbox-changelog-section">
                    <div class="trixbox-changelog-version">Previous - v0.6.4 Features</div>
                    <ul class="trixbox-changelog-list">
                        <li>TrixBox Voice Chat - Triple chat system with voice support</li>
                        <li>Auto-launch voice chat connection via postMessage API</li>
                        <li>Microphone and camera permissions enabled</li>
                        <li>Enhanced UI with three chat selection options</li>
                        <li>Mobile optimizations with navbar-safe positioning</li>
                    </ul>
                </div>
                <button class="trixbox-changelog-btn">Got it!</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('button').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };
 
    // --- 2. CREATE THE TOGGLE ICON ---
    const toggleIcon = document.createElement('div');
    toggleIcon.id = 'trixbox-toggle-icon';
    toggleIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${theme.text}" width="28px" height="28px"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;
    Object.assign(toggleIcon.style, {
        backgroundColor: theme.icon,
        position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', zIndex: '99998',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)', transition: 'transform 0.2s ease-in-out'
    });
    toggleIcon.onmouseover = () => { toggleIcon.style.transform = 'scale(1.1)'; };
    toggleIcon.onmouseout = () => { toggleIcon.style.transform = 'scale(1.0)'; };
    document.body.appendChild(toggleIcon);

    // Apply mobile optimization styles
    addMobileStyles();

    // --- 3. CREATE THE CHATBOX ---
    const chatContainer = document.createElement('div');
    chatContainer.id = 'trixbox-container';
    Object.assign(chatContainer.style, {
        position: 'fixed', bottom: 'auto', top: '70px', right: '15px', width: '550px', height: '500px',
        zIndex: '99999', display: 'none', flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden',
        touchAction: 'manipulation', WebkitUserSelect: 'none'
    });

    // Close button row above header
    const closeButtonRow = document.createElement('div');
    Object.assign(closeButtonRow.style, {
        height: '20px', backgroundColor: 'rgb(210, 210, 255)', display: 'flex',
        justifyContent: 'flex-end', alignItems: 'center', padding: '0 5px',
        borderBottom: '1px solid rgb(180, 180, 220)'
    });
    
    const closeButtonTop = document.createElement('button');
    closeButtonTop.innerHTML = '✕';
    Object.assign(closeButtonTop.style, {
        background: 'none', border: 'none', color: 'rgb(80, 80, 120)',
        fontSize: '16px', lineHeight: '1', cursor: 'pointer', padding: '0 5px',
        fontWeight: 'bold', transition: 'color 0.2s'
    });
    closeButtonTop.title = 'Close TrixBox';
    closeButtonTop.onmouseover = () => { closeButtonTop.style.color = 'rgb(100, 100, 150)'; };
    closeButtonTop.onmouseout = () => { closeButtonTop.style.color = 'rgb(80, 80, 120)'; };
    closeButtonRow.appendChild(closeButtonTop);
    chatContainer.appendChild(closeButtonRow);

    const dragHeader = document.createElement('div');
    dragHeader.id = 'trixbox-header';
    Object.assign(dragHeader.style, {
        height: '30px', backgroundColor: 'rgb(210, 210, 255)', cursor: 'move',
        userSelect: 'none', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 5px 0 15px',
        position: 'relative', zIndex: '1'
    });

    const headerTitle = document.createElement('span');
    headerTitle.textContent = 'TrixBox Chat';
    Object.assign(headerTitle.style, {
        color: 'white', fontWeight: 'bold', fontSize: '14px',
        textShadow: '1px 1px 0 rgb(160, 160, 230), 2px 2px 0 rgba(0, 0, 0, 0.15)'
    });
    dragHeader.appendChild(headerTitle);

    const headerButtons = document.createElement('div');
    headerButtons.style.display = 'flex';
    headerButtons.style.alignItems = 'center';

    // Connection status indicator
    const connectionStatus = document.createElement('div');
    connectionStatus.id = 'trixbox-connection-status';
    Object.assign(connectionStatus.style, {
        width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#888888',
        marginRight: '8px', cursor: 'pointer', transition: 'background-color 0.3s'
    });
    connectionStatus.title = 'Loading...';
    headerButtons.appendChild(connectionStatus);

    const roomSelector = document.createElement('select');
    roomSelector.id = 'room-selector';
    roomSelector.className = 'top-bar-dropdown';
    Object.assign(roomSelector.style, {
        padding: '4px 8px', marginRight: '8px', backgroundColor: 'rgb(220, 220, 240)',
        color: 'rgb(80, 80, 120)', border: '1px solid rgb(160, 160, 200)',
        borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
    });
    
    const generalOption = document.createElement('option');
    generalOption.value = '15234533';
    generalOption.textContent = 'General';
    roomSelector.appendChild(generalOption);
    
    const loungeOption = document.createElement('option');
    loungeOption.value = '21517181';
    loungeOption.textContent = 'Lounge';
    roomSelector.appendChild(loungeOption);
    
    roomSelector.addEventListener('change', (e) => {
        const newRoomId = e.target.value;
        chatIframe.src = `https://iframe.chat/embed?chat=${newRoomId}`;
        // Reset flags for new room initialization
        hasInitializedUsername = false;
        hasInitializedCommands = false;
        hasInitializedEventListeners = false;
        // Reinitialize Chattable for the new room
        setTimeout(initializeChattable, 500);
    });
    
    headerButtons.appendChild(roomSelector);

    // Search button
    const searchButton = document.createElement('button');
    searchButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="18px" height="18px"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
    Object.assign(searchButton.style, {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
    });
    searchButton.title = 'Search Messages';
    searchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showMessageSearchModal();
    });
    headerButtons.appendChild(searchButton);

    // Private message button
    const pmButton = document.createElement('button');
    pmButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="18px" height="18px"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v-2h8v2zm0-3h-8V9h8v2zm0-3H4V4h14v4z"/></svg>`;
    Object.assign(pmButton.style, {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
    });
    pmButton.title = 'Private Message';
    pmButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrivateMessageModal();
    });
    headerButtons.appendChild(pmButton);

    // Media gallery button
    const mediaButton = document.createElement('button');
    mediaButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="18px" height="18px"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
    Object.assign(mediaButton.style, {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
    });
    mediaButton.title = 'Rich Media & Content';
    mediaButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showMediaGalleryModal();
    });
    headerButtons.appendChild(mediaButton);

    // File sharing button
    const fileShareButton = document.createElement('button');
    fileShareButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="18px" height="18px"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
    Object.assign(fileShareButton.style, {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
    });
    fileShareButton.title = 'File Sharing';
    fileShareButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showFileShareModal();
    });
    headerButtons.appendChild(fileShareButton);

    const settingsButton = document.createElement('button');
    settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="18px" height="18px"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.69-1.62-0.92L14.4,2.23C14.38,2,14.17,1.84,13.92,1.84H9.92 c-0.25,0-0.47,0.16-0.54,0.39L9.04,4.95C8.45,5.18,7.92,5.49,7.42,5.87L5.03,4.91c-0.22-0.08-0.47,0-0.59,0.22L2.52,8.45 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.59,11.36,4.56,11.68,4.56,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.69,1.62,0.92l0.34,2.72 c0.07,0.23,0.29,0.39,0.54,0.39h3.99c0.25,0,0.47-0.16,0.54-0.39l0.34-2.72c0.59-0.23,1.12-0.54,1.62-0.92l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`;
    Object.assign(settingsButton.style, {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
    });
    settingsButton.title = 'Settings';
    headerButtons.appendChild(settingsButton);

    const reloadButton = document.createElement('button');
    reloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="18px" height="18px"><path d="M7 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7M17 7V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2M7 11h10M9 14h6M7 17h10" stroke="rgb(80, 80, 120)" stroke-width="1.5" fill="none"/><path d="M16 4l3-3m0 6l-3-3" stroke="rgb(80, 80, 120)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;
    Object.assign(reloadButton.style, {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
    });
    reloadButton.title = 'Reload Chat';
    reloadButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentSrc = chatIframe.src;
        chatIframe.src = '';
        setTimeout(() => {
            chatIframe.src = currentSrc;
            setTimeout(initializeChattable, 1000);
        }, 100);
    });
    headerButtons.appendChild(reloadButton);

    const minimizeButton = document.createElement('button');
    minimizeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="16px" height="16px"><path d="M19 13H5v-2h14v2z"/></svg>`;
    Object.assign(minimizeButton.style, {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
    });
    minimizeButton.title = 'Minimize';
    minimizeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (chatContainer.style.height === '45px') {
            chatContainer.style.height = '500px';
            iframeWrapper.style.display = 'flex';
            minimizeButton.title = 'Minimize';
        } else {
            chatContainer.style.height = '45px';
            iframeWrapper.style.display = 'none';
            minimizeButton.title = 'Maximize';
        }
    });
    headerButtons.appendChild(minimizeButton);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    Object.assign(closeButton.style, {
        background: 'none', border: 'none', color: 'rgb(80, 80, 120)',
        fontSize: '24px', lineHeight: '1', cursor: 'pointer', padding: '0 8px'
    });
    headerButtons.appendChild(closeButton);
    dragHeader.appendChild(headerButtons);
    chatContainer.appendChild(dragHeader);

    const iframeWrapper = document.createElement('div');
    Object.assign(iframeWrapper.style, {
        flexGrow: '1', overflow: 'hidden', position: 'relative'
    });
    chatContainer.appendChild(iframeWrapper);

    // Load Chattable library (ensures up-to-date version)
    const chatLibraryScript = document.createElement('script');
    chatLibraryScript.src = 'https://iframe.chat/scripts/main.min.js';
    document.head.appendChild(chatLibraryScript);

    // Also add direct script tag for redundancy and automatic updates
    const chattableScript = document.createElement('script');
    chattableScript.src = 'https://iframe.chat/scripts/main.min.js';
    document.head.appendChild(chattableScript);

    const chatIframe = document.createElement('iframe');
    chatIframe.src = 'https://iframe.chat/embed?chat=15234533';
    chatIframe.id = 'chattable';
    Object.assign(chatIframe.style, {
        border: 'none', backgroundColor: 'transparent', position: 'absolute',
        height: `calc(100% + ${CHATTABLE_HEADER_HEIGHT}px)`, width: '100%',
        top: `-${CHATTABLE_HEADER_HEIGHT}px`, left: '0',
        touchAction: 'manipulation', WebkitTouchCallout: 'none'
    });
    iframeWrapper.appendChild(chatIframe);
    document.body.appendChild(chatContainer);

    // Mobile input fix: Prevent enter key from creating new lines
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            try {
                const iframeDoc = chatIframe.contentDocument || chatIframe.contentWindow.document;
                if (iframeDoc) {
                    const inputField = iframeDoc.querySelector('textarea, input[type="text"], [contenteditable]');
                    if (inputField) {
                        inputField.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                // Trigger send by submitting the form or finding send button
                                const sendBtn = iframeDoc.querySelector('[class*="send"], button[aria-label*="send"], button:last-of-type');
                                if (sendBtn) sendBtn.click();
                            }
                        });
                    }
                }
            } catch (e) {
                console.warn('TrixBox: Mobile input fix - cross-origin iframe, cannot modify input behavior');
            }
        }, 2000);
    });

    // --- 4. ADD FUNCTIONALITY ---
    toggleIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        showChatSelectionModal();
    });

    const showChatSelectionModal = () => {
        const modalStyle = `
            .trixbox-selection-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-selection-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; text-align: center; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
            .trixbox-selection-content h2 { margin-top: 0; margin-bottom: 20px; }
            .trixbox-selection-btn-group { display: flex; flex-direction: column; gap: 10px; }
            .trixbox-selection-btn { flex: 1; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold; width: 100%; }
            .trixbox-selection-btn.main { background: ${theme.buttonPrimary}; }
            .trixbox-selection-btn.new { background: #7289da; }
            .trixbox-selection-btn.voice { background: #43b581; }
            .trixbox-selection-btn:hover { opacity: 0.9; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);

        const overlay = document.createElement('div');
        overlay.className = 'trixbox-selection-overlay';
        overlay.innerHTML = `
            <div class="trixbox-selection-content">
                <h2>Select Chat</h2>
                <div class="trixbox-selection-btn-group">
                    <button id="trixbox-main-btn" class="trixbox-selection-btn main">TrixBox Main</button>
                    <button id="trixbox-new-btn" class="trixbox-selection-btn new">New TrixBox</button>
                    <button id="trixbox-voice-btn" class="trixbox-selection-btn voice">Voice Chat</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('trixbox-main-btn').addEventListener('click', () => {
            overlay.remove();
            resetActivityBadge();
            chatContainer.style.display = 'flex';
            toggleIcon.style.display = 'none';
        });

        document.getElementById('trixbox-new-btn').addEventListener('click', () => {
            overlay.remove();
            showNewTrixBox();
        });

        document.getElementById('trixbox-voice-btn').addEventListener('click', () => {
            overlay.remove();
            showVoiceChat();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };

    const showNewTrixBoxSettingsModal = (newChatContainer) => {
        const modalStyle = `
            .trixbox-new-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-new-settings-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; text-align: left; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 350px; max-height: 80vh; overflow-y: auto; }
            .trixbox-new-settings-content h2 { margin-top: 0; text-align: center; }
            .trixbox-new-settings-group { margin: 20px 0; }
            .trixbox-new-settings-group label { display: block; margin-bottom: 8px; font-weight: bold; }
            .trixbox-new-settings-toggle { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
            .trixbox-toggle-switch { width: 50px; height: 24px; background: #4f545c; border: none; border-radius: 12px; cursor: pointer; position: relative; transition: background 0.3s; }
            .trixbox-toggle-switch.active { background: ${theme.buttonPrimary}; }
            .trixbox-toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: left 0.3s; }
            .trixbox-toggle-switch.active::after { left: 28px; }
            .trixbox-new-settings-btn-group { display: flex; gap: 10px; margin-top: 20px; }
            .trixbox-new-settings-btn { flex: 1; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 14px; }
            .trixbox-new-settings-btn.save { background: ${theme.buttonPrimary}; }
            .trixbox-new-settings-btn.cancel { background: ${theme.buttonSecondary}; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);

        const overlay = document.createElement('div');
        overlay.className = 'trixbox-new-settings-overlay';
        overlay.innerHTML = `
            <div class="trixbox-new-settings-content">
                <h2>New TrixBox Settings</h2>
                <div class="trixbox-new-settings-group">
                    <label>Close on Click Outside</label>
                    <button id="trixbox-new-close-toggle" class="trixbox-toggle-switch"></button>
                    <small style="color: #99aab5; font-size: 12px; display: block; margin-top: 5px;">Toggle: On/Off</small>
                </div>
                <div class="trixbox-new-settings-btn-group">
                    <button id="trixbox-new-settings-save" class="trixbox-new-settings-btn save">Save</button>
                    <button id="trixbox-new-settings-cancel" class="trixbox-new-settings-btn cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const closeToggle = document.getElementById('trixbox-new-close-toggle');
        const saveBtn = document.getElementById('trixbox-new-settings-save');
        const cancelBtn = document.getElementById('trixbox-new-settings-cancel');
        
        const isCloseOnClick = localStorage.getItem('trixbox-new-close-on-click') !== 'false';
        if (isCloseOnClick) {
            closeToggle.classList.add('active');
        }

        closeToggle.addEventListener('click', () => {
            closeToggle.classList.toggle('active');
        });

        saveBtn.addEventListener('click', () => {
            const isEnabled = closeToggle.classList.contains('active');
            localStorage.setItem('trixbox-new-close-on-click', isEnabled ? 'true' : 'false');
            overlay.remove();
        });

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };

    const showNewTrixBox = () => {
        const newChatContainer = document.createElement('div');
        newChatContainer.id = 'trixbox-new-container';
        Object.assign(newChatContainer.style, {
            position: 'fixed', bottom: 'auto', top: '70px', right: '15px', width: '350px', height: '500px',
            zIndex: '99999', display: 'flex', flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden'
        });

        const newDragHeader = document.createElement('div');
        Object.assign(newDragHeader.style, {
            height: '30px', backgroundColor: 'rgb(210, 210, 255)', cursor: 'move',
            userSelect: 'none', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 5px 0 15px',
            position: 'relative', zIndex: '1'
        });

        const newHeaderTitle = document.createElement('span');
        newHeaderTitle.textContent = 'New TrixBox';
        Object.assign(newHeaderTitle.style, {
            color: 'white', fontWeight: 'bold', fontSize: '14px',
            textShadow: '1px 1px 0 rgb(160, 160, 230), 2px 2px 0 rgba(0, 0, 0, 0.15)'
        });
        newDragHeader.appendChild(newHeaderTitle);

        const newCloseButton = document.createElement('button');
        newCloseButton.innerHTML = '&times;';
        Object.assign(newCloseButton.style, {
            background: 'none', border: 'none', color: 'rgb(80, 80, 120)',
            fontSize: '24px', lineHeight: '1', cursor: 'pointer', padding: '0 8px'
        });
        newCloseButton.addEventListener('click', () => {
            newChatContainer.remove();
            toggleIcon.style.display = 'flex';
        });

        const newSettingsButton = document.createElement('button');
        newSettingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(80, 80, 120)" width="16px" height="16px"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.69-1.62-0.92L14.4,2.23C14.38,2,14.17,1.84,13.92,1.84H9.92 c-0.25,0-0.47,0.16-0.54,0.39L9.04,4.95C8.45,5.18,7.92,5.49,7.42,5.87L5.03,4.91c-0.22-0.08-0.47,0-0.59,0.22L2.52,8.45 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.59,11.36,4.56,11.68,4.56,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.69,1.62,0.92l0.34,2.72 c0.07,0.23,0.29,0.39,0.54,0.39h3.99c0.25,0,0.47-0.16,0.54-0.39l0.34-2.72c0.59-0.23,1.12-0.54,1.62-0.92l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`;
        Object.assign(newSettingsButton.style, {
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0 8px', lineHeight: '1', display: 'flex', alignItems: 'center'
        });
        newSettingsButton.title = 'Settings';
        newSettingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showNewTrixBoxSettingsModal(newChatContainer);
        });

        newDragHeader.appendChild(newSettingsButton);
        newDragHeader.appendChild(newCloseButton);
        newChatContainer.appendChild(newDragHeader);

        const newIframeWrapper = document.createElement('div');
        Object.assign(newIframeWrapper.style, {
            flexGrow: '1', overflow: 'hidden', position: 'relative'
        });

        const newIframe = document.createElement('iframe');
        newIframe.src = 'https://www5.cbox.ws/box/?boxid=959661&boxtag=LgpZi2';
        newIframe.width = '100%';
        newIframe.height = '100%';
        newIframe.allowTransparency = 'yes';
        newIframe.allow = 'autoplay';
        newIframe.frameBorder = '0';
        newIframe.marginHeight = '0';
        newIframe.marginWidth = '0';
        newIframe.scrolling = 'auto';
        Object.assign(newIframe.style, {
            border: 'none', position: 'absolute', top: '0', left: '0'
        });
        newIframeWrapper.appendChild(newIframe);
        newChatContainer.appendChild(newIframeWrapper);

        // Hide and disable Cbox text in iframe footer
        try {
            const hideStyle = document.createElement('style');
            hideStyle.textContent = `
                a[href*="cbox.ws"],
                a[href*="www.cbox.ws"],
                .btn.Right.Interactive.Hand,
                iframe ~ a[href*="cbox.ws"],
                div[align="center"] a[href*="cbox.ws"] {
                    display: none !important;
                    pointer-events: none !important;
                    visibility: hidden !important;
                }
            `;
            document.head.appendChild(hideStyle);
        } catch (e) { }
        document.body.appendChild(newChatContainer);

        // Click outside to close New TrixBox (if enabled)
        const closeOnClickOutside = () => {
            const shouldCloseOnClick = localStorage.getItem('trixbox-new-close-on-click') !== 'false';
            if (shouldCloseOnClick) {
                document.addEventListener('mousedown', (e) => {
                    if (!newChatContainer.contains(e.target) && newChatContainer.parentElement) {
                        newChatContainer.remove();
                        toggleIcon.style.display = 'flex';
                    }
                }, { once: true });
            }
        };
        closeOnClickOutside();

        // Drag functionality for new chat
        let isDragging = false, offsetX, offsetY;
        newDragHeader.addEventListener('mousedown', (e) => {
            if (e.target !== newDragHeader && e.target !== newHeaderTitle) return;
            isDragging = true;
            offsetX = e.clientX - newChatContainer.getBoundingClientRect().left;
            offsetY = e.clientY - newChatContainer.getBoundingClientRect().top;
            newIframe.style.pointerEvents = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            newChatContainer.style.left = `${e.clientX - offsetX}px`;
            newChatContainer.style.top = `${e.clientY - offsetY}px`;
            newChatContainer.style.bottom = 'auto';
            newChatContainer.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            newIframe.style.pointerEvents = 'auto';
        });
    };

    const showVoiceChat = () => {
        const voiceChatContainer = document.createElement('div');
        voiceChatContainer.id = 'trixbox-voice-container';
        Object.assign(voiceChatContainer.style, {
            position: 'fixed', bottom: 'auto', top: '70px', right: '15px', width: '400px', height: '600px',
            zIndex: '99999', display: 'flex', flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden'
        });

        const voiceDragHeader = document.createElement('div');
        Object.assign(voiceDragHeader.style, {
            height: '30px', backgroundColor: 'rgb(210, 210, 255)', cursor: 'move',
            userSelect: 'none', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 5px 0 15px',
            position: 'relative', zIndex: '1'
        });

        const voiceHeaderTitle = document.createElement('span');
        voiceHeaderTitle.textContent = 'TrixBox Voice Chat';
        Object.assign(voiceHeaderTitle.style, {
            color: 'white', fontWeight: 'bold', fontSize: '14px',
            textShadow: '1px 1px 0 rgb(160, 160, 230), 2px 2px 0 rgba(0, 0, 0, 0.15)'
        });
        voiceDragHeader.appendChild(voiceHeaderTitle);

        const voiceCloseButton = document.createElement('button');
        voiceCloseButton.innerHTML = '&times;';
        Object.assign(voiceCloseButton.style, {
            background: 'none', border: 'none', color: 'rgb(80, 80, 120)',
            fontSize: '24px', lineHeight: '1', cursor: 'pointer', padding: '0 8px'
        });
        voiceCloseButton.addEventListener('click', () => {
            voiceChatContainer.remove();
            toggleIcon.style.display = 'flex';
        });
        voiceDragHeader.appendChild(voiceCloseButton);
        voiceChatContainer.appendChild(voiceDragHeader);

        const voiceIframeWrapper = document.createElement('div');
        Object.assign(voiceIframeWrapper.style, {
            flexGrow: '1', overflow: 'hidden', position: 'relative'
        });

        const voiceIframe = document.createElement('iframe');
        voiceIframe.src = 'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--cf284e50.local-credentialless.webcontainer-api.io/embed/test-6armm1';
        voiceIframe.width = '400';
        voiceIframe.height = '600';
        voiceIframe.frameBorder = '0';
        voiceIframe.allowFullscreen = true;
        voiceIframe.allow = 'microphone; camera; autoplay';
        Object.assign(voiceIframe.style, {
            border: 'none', position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%'
        });
        voiceIframeWrapper.appendChild(voiceIframe);
        voiceChatContainer.appendChild(voiceIframeWrapper);

        document.body.appendChild(voiceChatContainer);

        // Auto-click the connect button when voice chat iframe loads (using postMessage to bypass CORS)
        voiceIframe.addEventListener('load', () => {
            setTimeout(() => {
                voiceIframe.contentWindow.postMessage({ action: 'clickConnect' }, '*');
            }, 500);
        });

        // Drag functionality for voice chat
        let isDragging = false, offsetX, offsetY;
        voiceDragHeader.addEventListener('mousedown', (e) => {
            if (e.target !== voiceDragHeader && e.target !== voiceHeaderTitle) return;
            isDragging = true;
            offsetX = e.clientX - voiceChatContainer.getBoundingClientRect().left;
            offsetY = e.clientY - voiceChatContainer.getBoundingClientRect().top;
            voiceIframe.style.pointerEvents = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            voiceChatContainer.style.left = `${e.clientX - offsetX}px`;
            voiceChatContainer.style.top = `${e.clientY - offsetY}px`;
            voiceChatContainer.style.bottom = 'auto';
            voiceChatContainer.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            voiceIframe.style.pointerEvents = 'auto';
        });
    };

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        chatContainer.style.display = 'none';
        toggleIcon.style.display = 'flex';
    });

    // Top close button handler
    closeButtonTop.addEventListener('click', (e) => {
        e.stopPropagation();
        chatContainer.style.display = 'none';
        toggleIcon.style.display = 'flex';
    });

    settingsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showSettingsModal();
    });

    const showGuideModal = () => {
        const modalStyle = `
            .trixbox-guide-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-guide-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 500px; max-height: 80vh; overflow-y: auto; }
            .trixbox-guide-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-guide-section { margin: 20px 0; }
            .trixbox-guide-section h4 { color: ${theme.buttonPrimary}; margin-top: 15px; margin-bottom: 10px; }
            .trixbox-guide-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .trixbox-guide-table th, .trixbox-guide-table td { border: 1px solid #4f545c; padding: 8px; text-align: left; font-size: 13px; }
            .trixbox-guide-table th { background: #4f545c; color: white; font-weight: bold; }
            .trixbox-guide-table code { background: #36393f; color: #88ff88; padding: 2px 4px; border-radius: 2px; }
            .trixbox-guide-btn { width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 14px; background: ${theme.buttonPrimary}; margin-top: 15px; }
            .trixbox-guide-btn:hover { opacity: 0.9; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);

        const overlay = document.createElement('div');
        overlay.className = 'trixbox-guide-overlay';
        overlay.innerHTML = `
            <div class="trixbox-guide-content">
                <h2>Message Markdown & Commands</h2>
                
                <div class="trixbox-guide-section">
                    <h4>✨ Message Markdown</h4>
                    <table class="trixbox-guide-table">
                        <tr><th>Syntax</th><th>Result</th></tr>
                        <tr><td><code>*text*</code></td><td><i>Italic</i></td></tr>
                        <tr><td><code>**text**</code></td><td><b>Bold</b></td></tr>
                        <tr><td><code>~~text~~</code></td><td><s>Strikethrough</s></td></tr>
                        <tr><td><code>\`text\`</code></td><td><code>Code</code></td></tr>
                        <tr><td><code>&gt;text</code></td><td>Blockquote</td></tr>
                        <tr><td><code>[Link](url)</code></td><td>Hyperlink</td></tr>
                        <tr><td><code>![Alt](url)</code></td><td>Image</td></tr>
                    </table>
                </div>

                <div class="trixbox-guide-section">
                    <h4>⚙️ Default Commands</h4>
                    <table class="trixbox-guide-table">
                        <tr><th>Command</th><th>Description</th></tr>
                        <tr><td><code>!connect</code></td><td>Reconnect to chat</td></tr>
                        <tr><td><code>!online</code></td><td>Show online users</td></tr>
                        <tr><td><code>!tutorial</code></td><td>Show chat tutorial</td></tr>
                        <tr><td><code>!help</code></td><td>Show help</td></tr>
                    </table>
                    <small style="color: #99aab5; font-size: 11px; display: block; margin-top: 8px;">Owner/Moderator commands: !clear, !lock, !unlock, !reset, !attach</small>
                </div>

                <div class="trixbox-guide-section">
                    <h4>🎮 Custom Commands</h4>
                    <p style="font-size: 13px; margin: 5px 0;"><code>!coinflip</code> or <code>!cf</code> - Flip a coin (Heads/Tails)</p>
                    <p style="font-size: 13px; margin: 5px 0;"><code>!8ball</code> - Ask the Magic 8-Ball</p>
                    <p style="font-size: 13px; margin: 5px 0;"><code>!roll</code> - Roll a d20 or <code>!roll d6</code> for custom dice</p>
                    <p style="font-size: 13px; margin: 5px 0;"><code>!quote</code> - Get a random inspirational quote</p>
                    <p style="font-size: 13px; margin: 5px 0;"><code>!ping</code> - Check latency/ping</p>
                    <p style="font-size: 13px; margin: 5px 0;"><code>!joke</code> - Get a random joke</p>
                    <p style="font-size: 13px; margin: 5px 0;"><code>!trivia</code> - Get a random trivia fact</p>
                </div>

                <button id="trixbox-guide-close" class="trixbox-guide-btn">Got it!</button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('trixbox-guide-close').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };

    const showSettingsModal = () => {
        const modalStyle = `
            .trixbox-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-settings-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; text-align: left; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 350px; max-height: 80vh; overflow-y: auto; }
            .trixbox-settings-content h2 { margin-top: 0; text-align: center; }
            .trixbox-settings-group { margin: 20px 0; }
            .trixbox-settings-group label { display: block; margin-bottom: 8px; font-weight: bold; }
            .trixbox-settings-group input[type="text"], .trixbox-settings-group input[type="file"] { width: 100%; padding: 8px; background: #36393f; color: ${theme.text}; border: 1px solid #4f545c; border-radius: 4px; box-sizing: border-box; }
            .trixbox-settings-group input[type="text"]::placeholder { color: #99aab5; }
            .trixbox-profile-preview { width: 60px; height: 60px; border-radius: 50%; background: #4f545c; margin: 10px auto; overflow: hidden; display: flex; align-items: center; justify-content: center; }
            .trixbox-profile-preview img { width: 100%; height: 100%; object-fit: cover; }
            .trixbox-settings-btn-group { display: flex; gap: 10px; margin-top: 20px; }
            .trixbox-settings-btn { flex: 1; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 14px; }
            .trixbox-settings-btn.save { background: ${theme.buttonPrimary}; }
            .trixbox-settings-btn.cancel { background: ${theme.buttonSecondary}; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);

        const overlay = document.createElement('div');
        overlay.className = 'trixbox-settings-overlay';
        
        const settingsContent = document.createElement('div');
        settingsContent.className = 'trixbox-settings-content';
        settingsContent.innerHTML = `
            <h2>Chat Settings</h2>
            <div class="trixbox-settings-group">
                <label>Username</label>
                <input type="text" id="trixbox-username-input" placeholder="Enter your username" maxlength="32">
            </div>
            <div class="trixbox-settings-group">
                <label>Profile Picture</label>
                <div class="trixbox-profile-preview" id="trixbox-profile-preview"></div>
                <input type="file" id="trixbox-profile-upload" accept="image/*">
            </div>
            <div class="trixbox-settings-group">
                <label>Disable Focus Hotkey</label>
                <input type="text" id="trixbox-hotkey-input" placeholder="Enter key (e.g., Escape, e, q)" maxlength="20">
                <small style="color: #99aab5; font-size: 12px; display: block; margin-top: 5px;">Press any key or type a key name</small>
            </div>
            <div class="trixbox-settings-group">
                <label>Notification Sound</label>
                <input type="text" id="trixbox-notif-sound-input" placeholder="Enter URL or 'none' to disable" maxlength="500">
                <small style="color: #99aab5; font-size: 12px; display: block; margin-top: 5px;">Example: https://www.myinstants.com/media/sounds/he-he-he-ha-clash-royale-deep-fried.mp3 or type 'none'</small>
            </div>
            <div class="trixbox-settings-group">
                <label>Chat Theme</label>
                <select id="trixbox-theme-select" style="width: 100%; padding: 8px; background: #36393f; color: ${theme.text}; border: 1px solid #4f545c; border-radius: 4px; box-sizing: border-box; cursor: pointer;">
                    <option value="tendo">Tendo (Default)</option>
                    <option value="retrowave-red">Retrowave Red</option>
                    <option value="notepad">Notepad</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="dark-discord">Dark Discord</option>
                    <option value="light">Light</option>
                    <option value="high-contrast">High Contrast</option>
                </select>
                <small style="color: #99aab5; font-size: 12px; display: block; margin-top: 5px;">Choose your preferred chat theme</small>
            </div>
            <div id="trixbox-settings-container" class="trixbox-settings-btn-group">
                <button id="trixbox-settings-guide" class="trixbox-settings-btn save" style="background: #43b581;">Guide</button>
                <button id="trixbox-settings-save" class="trixbox-settings-btn save">Save</button>
                <button id="trixbox-settings-cancel" class="trixbox-settings-btn cancel">Cancel</button>
            </div>
        `;
        overlay.appendChild(settingsContent);
        document.body.appendChild(overlay);

        const usernameInput = document.getElementById('trixbox-username-input');
        const profileUpload = document.getElementById('trixbox-profile-upload');
        const profilePreview = document.getElementById('trixbox-profile-preview');
        const hotkeyInput = document.getElementById('trixbox-hotkey-input');
        const notifSoundInput = document.getElementById('trixbox-notif-sound-input');
        const themeSelect = document.getElementById('trixbox-theme-select');
        const guideBtn = document.getElementById('trixbox-settings-guide');
        const saveBtn = document.getElementById('trixbox-settings-save');
        const cancelBtn = document.getElementById('trixbox-settings-cancel');
        let selectedProfileImage = localStorage.getItem('trixbox-profile-image') || null;

        guideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.remove();
            showGuideModal();
        });

        usernameInput.value = localStorage.getItem('trixbox-username') || '';
        hotkeyInput.value = localStorage.getItem('trixbox-disable-focus-key') || 'Escape';
        notifSoundInput.value = localStorage.getItem('trixbox-notification-sound') || '';
        themeSelect.value = localStorage.getItem('trixbox-selected-theme') || 'tendo';

        // Capture hotkey input
        hotkeyInput.addEventListener('keydown', (e) => {
            e.preventDefault();
            hotkeyInput.value = e.key;
        });

        if (selectedProfileImage) {
            profilePreview.innerHTML = `<img src="${selectedProfileImage}" alt="Profile">`;
        }

        profileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedProfileImage = event.target.result;
                    profilePreview.innerHTML = `<img src="${selectedProfileImage}" alt="Profile">`;
                };
                reader.readAsDataURL(file);
            }
        });

        saveBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            const hotkey = hotkeyInput.value.trim() || 'Escape';
            const notifSound = notifSoundInput.value.trim() || '';
            const selectedTheme = themeSelect.value;
            if (username) {
                localStorage.setItem('trixbox-username', username);
                localStorage.setItem('trixbox-disable-focus-key', hotkey);
                localStorage.setItem('trixbox-notification-sound', notifSound);
                localStorage.setItem('trixbox-selected-theme', selectedTheme);
                if (selectedProfileImage) {
                    localStorage.setItem('trixbox-profile-image', selectedProfileImage);
                }
                // Update CSS variable for notification sound
                updateNotificationSoundVariable(notifSound);
                if (typeof chattable !== 'undefined') {
                    if (typeof chattable.setName === 'function') {
                        chattable.setName(username);
                    }
                    // Load selected theme by reloading the iframe
                    if (typeof chattable.loadTheme === 'function') {
                        try {
                            const themePromise = chattable.loadTheme(selectedTheme);
                            if (themePromise && typeof themePromise.then === 'function') {
                                themePromise.then(() => {
                                    console.log('TrixBox: Theme loaded successfully:', selectedTheme);
                                }).catch(err => {
                                    console.warn('TrixBox: Theme load failed, reloading iframe', err);
                                    // Fallback: reload iframe to apply theme
                                    hasInitializedUsername = false; // Reset flag for new iframe
                                    const currentSrc = chatIframe.src;
                                    chatIframe.src = '';
                                    setTimeout(() => {
                                        chatIframe.src = currentSrc;
                                        setTimeout(() => {
                                            if (typeof chattable.reinitialize === 'function') {
                                                chattable.reinitialize({ theme: selectedTheme });
                                            }
                                        }, 500);
                                    }, 100);
                                });
                            }
                        } catch (themeErr) {
                            console.warn('TrixBox: Theme load error, reloading iframe', themeErr);
                            // Fallback: reload iframe to apply theme
                            hasInitializedUsername = false; // Reset flag for new iframe
                            const currentSrc = chatIframe.src;
                            chatIframe.src = '';
                            setTimeout(() => {
                                chatIframe.src = currentSrc;
                                setTimeout(() => {
                                    if (typeof chattable.reinitialize === 'function') {
                                        chattable.reinitialize({ theme: selectedTheme });
                                    }
                                }, 500);
                            }, 100);
                        }
                    }
                    // Send profile picture to other users via payload
                    if (selectedProfileImage && typeof chattable.sendPayload === 'function') {
                        chattable.sendPayload({
                            type: 'profile-picture',
                            username: username,
                            image: selectedProfileImage
                        });
                    }
                }
                overlay.remove();
            } else {
                alert('Please enter a username');
            }
        });

        // Add Statistics and Leaderboard buttons
        const settingsContainer = document.getElementById('trixbox-settings-container');
        
        const statsBtn = document.createElement('button');
        statsBtn.textContent = '📊 Statistics';
        Object.assign(statsBtn.style, {
            background: theme.buttonSecondary, color: 'white', border: 'none',
            padding: '10px 15px', borderRadius: '5px', cursor: 'pointer',
            marginRight: '10px', marginTop: '10px', flex: '1'
        });
        statsBtn.addEventListener('click', () => {
            overlay.remove();
            showStatisticsDashboard();
        });
        settingsContainer.appendChild(statsBtn);

        const leaderboardBtn = document.createElement('button');
        leaderboardBtn.textContent = '🏆 Leaderboard';
        Object.assign(leaderboardBtn.style, {
            background: theme.buttonSecondary, color: 'white', border: 'none',
            padding: '10px 15px', borderRadius: '5px', cursor: 'pointer',
            marginRight: '10px', marginTop: '10px', flex: '1'
        });
        leaderboardBtn.addEventListener('click', () => {
            overlay.remove();
            showLeaderboard();
        });
        settingsContainer.appendChild(leaderboardBtn);

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };

    let isDragging = false, offsetX, offsetY;
    dragHeader.addEventListener('mousedown', (e) => {
        if (e.target !== dragHeader && e.target !== headerTitle) return;
        isDragging = true;
        offsetX = e.clientX - chatContainer.getBoundingClientRect().left;
        offsetY = e.clientY - chatContainer.getBoundingClientRect().top;
        chatIframe.style.pointerEvents = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        chatContainer.style.left = `${e.clientX - offsetX}px`;
        chatContainer.style.top = `${e.clientY - offsetY}px`;
        chatContainer.style.bottom = 'auto';
        chatContainer.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        chatIframe.style.pointerEvents = 'auto';
    });

    // --- NOTIFICATION SOUND UTILITY ---
    const updateNotificationSoundVariable = (soundValue) => {
        // Store in window for access in message hook
        window.trixboxCustomNotificationSound = soundValue && soundValue.toLowerCase() !== 'none' ? soundValue : null;
        
        // Suppress Chattable's default notification sound
        injectNotificationSoundIntoChatIframe(soundValue);
    };

    const injectNotificationSoundIntoChatIframe = (soundValue) => {
        try {
            // Completely suppress Chattable's default notification sound
            const css = `
                :root {
                    --notification-sfx: none !important;
                }
                /* Hide and disable Chattable's default notification audio */
                audio[data-notification="true"],
                audio[class*="notification"],
                audio[class*="sound"] {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                    volume: 0 !important;
                }
            `;
            chatIframe.contentWindow.postMessage(css, '*');
        } catch (e) {
            // Will work once iframe is loaded, retry on initialization
        }
    };

    const playNotificationSound = () => {
        const soundValue = window.trixboxCustomNotificationSound || localStorage.getItem('trixbox-notification-sound') || '';
        if (soundValue && soundValue.toLowerCase() !== 'none') {
            try {
                const audio = new Audio(soundValue);
                audio.volume = 0.5;
                audio.play().catch(err => console.warn('TrixBox: Could not play notification sound', err));
            } catch (e) {
                console.warn('TrixBox: Error playing notification sound', e);
            }
        }
    };

    // Initialize notification sound on script load
    const initializeNotificationSound = () => {
        const savedSound = localStorage.getItem('trixbox-notification-sound') || '';
        updateNotificationSoundVariable(savedSound);
    };

    // --- 6. INITIALIZE THE CHAT ---
    let hasInitializedUsername = false; // Flag to prevent repeated setName calls
    let hasInitializedCommands = false; // Flag to prevent duplicate command registration
    let hasInitializedEventListeners = false; // Flag to prevent duplicate event listener registration
    
    // --- 5. DEFINE CUSTOM COMMANDS (MUST BE BEFORE INITIALIZE) ---
    const defineCustomCommands = () => {
        if (hasInitializedCommands) return; // Only register commands once
        hasInitializedCommands = true;
        
        chattable.commands = {
                    // --- BASIC COMMANDS ---
                    "coinflip": function(fullCommand) {
                        const result = Math.random() < 0.5 ? "Heads" : "Tails";
                        chattable.sendMessage(`🪙 Coin flip result: **${result}**`, "TrixBox Bot", "robot", false);
                    },
                    "cf": function(fullCommand) {
                        const result = Math.random() < 0.5 ? "Heads" : "Tails";
                        chattable.sendMessage(`🪙 Coin flip result: **${result}**`, "TrixBox Bot", "robot", false);
                    },
                    "8ball": function(fullCommand) {
                        const responses = [
                            "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.",
                            "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.",
                            "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.",
                            "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.",
                            "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.",
                            "Very doubtful."
                        ];
                        const response = responses[Math.floor(Math.random() * responses.length)];
                        chattable.sendMessage(`🔮 Magic 8-Ball: **${response}**`, "TrixBox Bot", "robot", false);
                    },
                    "roll": function(fullCommand) {
                        const match = fullCommand.match(/d(\d+)/i);
                        const sides = match ? parseInt(match[1]) : 20;
                        const result = Math.floor(Math.random() * sides) + 1;
                        chattable.sendMessage(`🎲 Roll d${sides}: **${result}**`, "TrixBox Bot", "robot", false);
                    },
                    "quote": function(fullCommand) {
                        const quotes = [
                            "The only way to do great work is to love what you do. - Steve Jobs",
                            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                            "Life is what happens when you're busy making other plans. - John Lennon",
                            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
                            "It is during our darkest moments that we must focus to see the light. - Aristotle",
                            "The only impossible journey is the one you never begin. - Tony Robbins",
                            "Success is not final, failure is not fatal. - Winston Churchill"
                        ];
                        const quote = quotes[Math.floor(Math.random() * quotes.length)];
                        chattable.sendMessage(`💬 **${quote}**`, "TrixBox Bot", "robot", false);
                    },
                    "ping": function(fullCommand) {
                        const latency = Math.floor(Math.random() * 100) + 10;
                        chattable.sendMessage(`📡 Pong! Latency: **${latency}ms**`, "TrixBox Bot", "robot", false);
                    },
                    "joke": function(fullCommand) {
                        const jokes = [
                            "Why don't scientists trust atoms? Because they make up everything!",
                            "What do you call a fake noodle? An impasta!",
                            "Why don't eggs tell jokes? They'd crack each other up!",
                            "What did the ocean say to the beach? Nothing, it just waved.",
                            "Why did the scarecrow win an award? Because he was outstanding in his field!"
                        ];
                        const joke = jokes[Math.floor(Math.random() * jokes.length)];
                        chattable.sendMessage(`😂 **${joke}**`, "TrixBox Bot", "robot", false);
                    },
                    "trivia": function(fullCommand) {
                        const trivia = [
                            "A group of flamingos is called a 'flamboyance'.",
                            "Honey never spoils. Archaeologists have found 3000-year-old honey that was still edible!",
                            "Octopuses have three hearts and blue blood.",
                            "The Great Wall of China is not visible from space with the naked eye.",
                            "A lightning bolt is five times hotter than the surface of the sun."
                        ];
                        const fact = trivia[Math.floor(Math.random() * trivia.length)];
                        chattable.sendMessage(`🧠 Trivia: **${fact}**`, "TrixBox Bot", "robot", false);
                    },
                    
                    // --- ADVANCED COMMANDS ---
                    "calc": function(fullCommand) {
                        try {
                            const expression = fullCommand.replace(/^!calc\s*/i, '');
                            const result = Function('"use strict"; return (' + expression + ')')();
                            chattable.sendMessage(`🧮 **${expression}** = **${result}**`, "TrixBox Bot", "robot", false);
                        } catch (e) {
                            chattable.sendMessage(`❌ Invalid calculation: ${e.message}`, "TrixBox Bot", "robot", false);
                        }
                    },
                    
                    "weather": function(fullCommand) {
                        const cities = ["Sunny ☀️", "Rainy 🌧️", "Cloudy ☁️", "Snowy ❄️", "Stormy ⛈️"];
                        const temp = Math.floor(Math.random() * 40) - 10;
                        const weather = cities[Math.floor(Math.random() * cities.length)];
                        chattable.sendMessage(`🌍 Weather: ${weather} | Temp: **${temp}°C**`, "TrixBox Bot", "robot", false);
                    },
                    
                    "time": function(fullCommand) {
                        const now = new Date();
                        const timeStr = now.toLocaleTimeString();
                        const dateStr = now.toLocaleDateString();
                        chattable.sendMessage(`🕐 Current Time: **${timeStr}** | Date: **${dateStr}**`, "TrixBox Bot", "robot", false);
                    },
                    
                    "stats": function(fullCommand) {
                        const userCount = Object.keys(window.trixboxCurrentUsers || {}).length;
                        const msgCount = messageHistory.length;
                        chattable.sendMessage(`📊 **Stats** | Users: ${userCount} | Messages: ${msgCount}`, "TrixBox Bot", "robot", false);
                    },
                    
                    "random": function(fullCommand) {
                        const args = fullCommand.replace(/^!random\s*/i, '').split(' ');
                        if (args.length < 2) {
                            const num = Math.floor(Math.random() * 100) + 1;
                            chattable.sendMessage(`🎲 Random number (1-100): **${num}**`, "TrixBox Bot", "robot", false);
                        } else {
                            const selected = args[Math.floor(Math.random() * args.length)];
                            chattable.sendMessage(`🎲 Random pick: **${selected}**`, "TrixBox Bot", "robot", false);
                        }
                    },
                    
                    "flip": function(fullCommand) {
                        const text = fullCommand.replace(/^!flip\s*/i, '');
                        const flipped = text.split('').reverse().join('');
                        chattable.sendMessage(`🔄 Flipped: **${flipped}**`, "TrixBox Bot", "robot", false);
                    },
                    
                    "upper": function(fullCommand) {
                        const text = fullCommand.replace(/^!upper\s*/i, '');
                        chattable.sendMessage(`📢 **${text.toUpperCase()}**`, "TrixBox Bot", "robot", false);
                    },
                    
                    "lower": function(fullCommand) {
                        const text = fullCommand.replace(/^!lower\s*/i, '');
                        chattable.sendMessage(`📝 **${text.toLowerCase()}**`, "TrixBox Bot", "robot", false);
                    },
                    
                    "reverse": function(fullCommand) {
                        const text = fullCommand.replace(/^!reverse\s*/i, '');
                        const reversed = text.split('').reverse().join('');
                        chattable.sendMessage(`🔃 **${reversed}**`, "TrixBox Bot", "robot", false);
                    },
                    
                    "count": function(fullCommand) {
                        const text = fullCommand.replace(/^!count\s*/i, '');
                        const charCount = text.length;
                        const wordCount = text.trim().split(/\s+/).length;
                        chattable.sendMessage(`📏 Characters: **${charCount}** | Words: **${wordCount}**`, "TrixBox Bot", "robot", false);
                    },
                    
                    "repeat": function(fullCommand) {
                        const match = fullCommand.match(/!repeat\s+(\d+)\s+(.*)/i);
                        if (match) {
                            const times = Math.min(parseInt(match[1]), 5); // Limit to 5 repeats
                            const text = match[2];
                            const result = (text + ' ').repeat(times).trim();
                            chattable.sendMessage(`🔁 **${result}**`, "TrixBox Bot", "robot", false);
                        }
                    },
                    
                    "help": function(fullCommand) {
                        const helpText = `
**TrixBox Commands:**
**Basic:** !coinflip, !8ball, !roll, !quote, !joke, !trivia, !ping
**Advanced:** !calc, !weather, !time, !stats, !random, !flip, !upper, !lower, !reverse, !count, !repeat
**Polls:** !poll "Question" "Option1" "Option2" "Option3"
**Scheduled:** !schedule 5 "Message to post" (in minutes)
**Examples:** !calc 2+2 | !repeat 3 hello | !random a b c | !poll "Best game?" "A" "B"
                        `;
                        chattable.sendMessage(helpText, "TrixBox Bot", "robot", false);
                    },
                    
                    // --- POLL COMMAND ---
                    "poll": function(fullCommand) {
                        const args = fullCommand.match(/"([^"]*)"/g);
                        if (!args || args.length < 2) {
                            chattable.sendMessage(`❌ Usage: !poll "Question" "Option1" "Option2"`, "TrixBox Bot", "robot", false);
                            return;
                        }
                        
                        const question = args[0].replace(/"/g, '');
                        const options = args.slice(1).map(opt => opt.replace(/"/g, ''));
                        
                        const pollId = 'poll_' + Date.now();
                        window.trixboxPolls = window.trixboxPolls || {};
                        window.trixboxPolls[pollId] = {
                            question: question,
                            options: options,
                            votes: options.map(() => 0),
                            voters: []
                        };
                        
                        let pollText = `📊 **POLL: ${question}**\n`;
                        options.forEach((opt, idx) => {
                            pollText += `${idx + 1}. ${opt}\n`;
                        });
                        pollText += `\nReact with 1️⃣ 2️⃣ 3️⃣ etc. to vote!`;
                        
                        chattable.sendMessage(pollText, "TrixBox Bot", "robot", false);
                    },
                    
                    // --- SCHEDULE COMMAND ---
                    "schedule": function(fullCommand) {
                        const match = fullCommand.match(/!schedule\s+(\d+)\s+"(.*)"/i);
                        if (!match) {
                            chattable.sendMessage(`❌ Usage: !schedule 5 "Your message here"`, "TrixBox Bot", "robot", false);
                            return;
                        }
                        
                        const minutes = parseInt(match[1]);
                        const message = match[2];
                        
                        if (minutes < 1 || minutes > 1440) {
                            chattable.sendMessage(`❌ Schedule time must be between 1 and 1440 minutes`, "TrixBox Bot", "robot", false);
                            return;
                        }
                        
                        const schedule = scheduleMessage(minutes, message);
                        const scheduledTime = new Date(Date.now() + minutes * 60 * 1000).toLocaleTimeString();
                        chattable.sendMessage(`⏰ Message scheduled for ${scheduledTime} (${minutes} min)`, "TrixBox Bot", "robot", false);
                    }
                };
    };
    
    const initializeChattable = () => {
        if (typeof chattable !== 'undefined' && chattable.initialize) {
            try {
                // Define custom commands (only once)
                defineCustomCommands();

                const savedTheme = localStorage.getItem('trixbox-selected-theme') || 'tendo';
                chattable.initialize({
                    theme: savedTheme
                });

                // Load event: Auto-set username from territorial.io if not set (only once)
                chattable.on('load', function() {
                    try {
                        // Only set username once to avoid repeated permission prompts
                        if (hasInitializedUsername) return;
                        hasInitializedUsername = true;

                        const savedUsername = localStorage.getItem('trixbox-username');
                        if (!savedUsername) {
                            // Try to get name from territorial.io's localStorage
                            const territorialName = localStorage.getItem('d122');
                            if (territorialName) {
                                localStorage.setItem('trixbox-username', territorialName);
                                if (typeof chattable.setName === 'function') {
                                    chattable.setName(territorialName);
                                }
                            }
                        } else {
                            // Set stored username
                            if (typeof chattable.setName === 'function') {
                                chattable.setName(savedUsername);
                            }
                        }
                    } catch (e) {
                        console.warn('TrixBox: Could not set username on load', e);
                    }
                });

                // Register event listeners only once
                if (!hasInitializedEventListeners) {
                    hasInitializedEventListeners = true;
                    
                    // Suppress default notification sound and setup custom audio playback
                    setTimeout(() => {
                        injectNotificationSoundIntoChatIframe();
                        setupMentionListener(); // Setup user mention/tagging
                        
                        // Message event listener for activity monitoring and history
                        if (chattable.on) {
                            chattable.on('message', function(data) {
                                addToMessageHistory(data); // Track message for search
                                updateChatStats(data); // Track statistics
                                playNotificationSound();
                                updateMessageActivityBadge();
                            });
                        }
                    }, 500);

                    // Connection event listener: show online users
                    chattable.on('connection', function(userList) {
                        window.trixboxCurrentUsers = userList;
                        updateConnectionStatus(userList);
                    });

                    // Handle profile picture payloads after initialization
                    chattable.on('payload', function(data) {
                        if (data.type === 'profile-picture') {
                            localStorage.setItem(`trixbox-profile-${data.username}`, data.image);
                        }
                    });

                    // Off event handler for cleanup
                    chattable.on('off', function() {
                        updateConnectionStatus({});
                        console.log('TrixBox: Disconnected from chat');
                    });
                }
            } catch (e) {
                console.warn('TrixBox: Chattable initialization error, retrying...', e);
                // Reinitialize on error after delay
                setTimeout(() => {
                    if (typeof chattable !== 'undefined' && chattable.reinitialize) {
                        try {
                            chattable.reinitialize();
                        } catch (reinitErr) {
                            console.warn('TrixBox: Reinitialize failed, full reinit...', reinitErr);
                            setTimeout(initializeChattable, 500);
                        }
                    } else {
                        setTimeout(initializeChattable, 500);
                    }
                }, 500);
            }
        } else {
            // Retry if chattable is not yet loaded
            setTimeout(initializeChattable, 500);
        }
    };

    chatLibraryScript.onload = function() {
        // Wait a tick for chattable to be fully ready
        setTimeout(initializeChattable, 100);
    };

    // --- SCHEDULED MESSAGES ---
    let scheduledMessages = [];
    
    const scheduleMessage = (delayMinutes, message) => {
        const delayMs = delayMinutes * 60 * 1000;
        const scheduledTime = new Date(Date.now() + delayMs);
        
        const schedule = {
            id: 'schedule_' + Date.now(),
            message: message,
            delayMs: delayMs,
            scheduledTime: scheduledTime,
            timeout: setTimeout(() => {
                if (typeof chattable !== 'undefined' && typeof chattable.sendMessage === 'function') {
                    chattable.sendMessage(message, "TrixBox Bot", "robot", false);
                }
                scheduledMessages = scheduledMessages.filter(s => s.id !== schedule.id);
            }, delayMs)
        };
        
        scheduledMessages.push(schedule);
        return schedule;
    };
    
    const cancelScheduledMessage = (id) => {
        const schedule = scheduledMessages.find(s => s.id === id);
        if (schedule) {
            clearTimeout(schedule.timeout);
            scheduledMessages = scheduledMessages.filter(s => s.id !== id);
            return true;
        }
        return false;
    };

    // --- STATISTICS & ANALYTICS ---
    let chatStats = {
        totalMessages: 0,
        activeHours: {},
        userActivity: {},
        startTime: new Date()
    };
    
    const updateChatStats = (data) => {
        chatStats.totalMessages++;
        const hour = new Date().getHours();
        chatStats.activeHours[hour] = (chatStats.activeHours[hour] || 0) + 1;
        
        const uid = data.uid;
        if (!chatStats.userActivity[uid]) {
            chatStats.userActivity[uid] = { name: data.name, count: 0 };
        }
        chatStats.userActivity[uid].count++;
    };
    
    const showStatisticsDashboard = () => {
        const modalStyle = `
            .trixbox-stats-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-stats-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 500px; max-height: 80vh; overflow-y: auto; }
            .trixbox-stats-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .trixbox-stats-card { background: #2f3136; padding: 15px; border-radius: 4px; border-left: 3px solid ${theme.buttonPrimary}; }
            .trixbox-stats-card-title { color: #99aab5; font-size: 12px; margin-bottom: 8px; }
            .trixbox-stats-card-value { color: ${theme.buttonPrimary}; font-size: 24px; font-weight: bold; }
            .trixbox-stats-section { margin: 20px 0; }
            .trixbox-stats-section-title { color: ${theme.buttonPrimary}; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid ${theme.buttonSecondary}; padding-bottom: 8px; }
            .trixbox-stats-bar { background: #2f3136; padding: 8px; margin: 5px 0; border-radius: 4px; display: flex; align-items: center; }
            .trixbox-stats-bar-label { flex: 0 0 60px; color: #99aab5; font-size: 12px; }
            .trixbox-stats-bar-fill { flex: 1; height: 20px; background: ${theme.buttonPrimary}; margin: 0 10px; border-radius: 2px; }
            .trixbox-stats-bar-value { flex: 0 0 40px; color: ${theme.buttonPrimary}; font-weight: bold; text-align: right; }
            .trixbox-stats-btn { width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; background: ${theme.buttonPrimary}; margin-top: 15px; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
        
        const overlay = document.createElement('div');
        overlay.className = 'trixbox-stats-overlay';
        
        const content = document.createElement('div');
        content.className = 'trixbox-stats-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Chat Statistics Dashboard';
        content.appendChild(title);
        
        // Main stats
        const grid = document.createElement('div');
        grid.className = 'trixbox-stats-grid';
        
        const totalCard = document.createElement('div');
        totalCard.className = 'trixbox-stats-card';
        totalCard.innerHTML = `<div class="trixbox-stats-card-title">Total Messages</div><div class="trixbox-stats-card-value">${chatStats.totalMessages}</div>`;
        grid.appendChild(totalCard);
        
        const uptime = Math.floor((Date.now() - chatStats.startTime.getTime()) / 1000 / 60);
        const uptimeCard = document.createElement('div');
        uptimeCard.className = 'trixbox-stats-card';
        uptimeCard.innerHTML = `<div class="trixbox-stats-card-title">Uptime (minutes)</div><div class="trixbox-stats-card-value">${uptime}</div>`;
        grid.appendChild(uptimeCard);
        
        const usersCard = document.createElement('div');
        usersCard.className = 'trixbox-stats-card';
        usersCard.innerHTML = `<div class="trixbox-stats-card-title">Active Users</div><div class="trixbox-stats-card-value">${Object.keys(window.trixboxCurrentUsers || {}).length}</div>`;
        grid.appendChild(usersCard);
        
        const avgCard = document.createElement('div');
        avgCard.className = 'trixbox-stats-card';
        const avgMsgs = uptime > 0 ? Math.floor(chatStats.totalMessages / uptime) : 0;
        avgCard.innerHTML = `<div class="trixbox-stats-card-title">Avg Msgs/min</div><div class="trixbox-stats-card-value">${avgMsgs}</div>`;
        grid.appendChild(avgCard);
        
        content.appendChild(grid);
        
        // Active hours
        const hoursSection = document.createElement('div');
        hoursSection.className = 'trixbox-stats-section';
        
        const hoursTitle = document.createElement('div');
        hoursTitle.className = 'trixbox-stats-section-title';
        hoursTitle.textContent = 'Active Hours';
        hoursSection.appendChild(hoursTitle);
        
        const maxHourCount = Math.max(...Object.values(chatStats.activeHours), 1);
        for (let hour = 0; hour < 24; hour++) {
            const count = chatStats.activeHours[hour] || 0;
            const percentage = (count / maxHourCount) * 100;
            
            const bar = document.createElement('div');
            bar.className = 'trixbox-stats-bar';
            bar.innerHTML = `
                <div class="trixbox-stats-bar-label">${hour}:00</div>
                <div class="trixbox-stats-bar-fill" style="width: ${percentage}%;"></div>
                <div class="trixbox-stats-bar-value">${count}</div>
            `;
            hoursSection.appendChild(bar);
        }
        
        content.appendChild(hoursSection);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'trixbox-stats-btn';
        closeBtn.addEventListener('click', () => overlay.remove());
        content.appendChild(closeBtn);
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };
    
    const showLeaderboard = () => {
        const modalStyle = `
            .trixbox-leaderboard-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-leaderboard-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 450px; max-height: 80vh; overflow-y: auto; }
            .trixbox-leaderboard-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-leaderboard-list { margin: 20px 0; }
            .trixbox-leaderboard-entry { display: flex; align-items: center; padding: 12px; margin: 8px 0; background: #2f3136; border-radius: 4px; }
            .trixbox-leaderboard-rank { width: 40px; font-size: 18px; font-weight: bold; color: ${theme.buttonPrimary}; }
            .trixbox-leaderboard-rank.gold { color: #ffd700; }
            .trixbox-leaderboard-rank.silver { color: #c0c0c0; }
            .trixbox-leaderboard-rank.bronze { color: #cd7f32; }
            .trixbox-leaderboard-info { flex: 1; margin-left: 15px; }
            .trixbox-leaderboard-name { color: ${theme.buttonPrimary}; font-weight: bold; }
            .trixbox-leaderboard-count { color: #99aab5; font-size: 12px; }
            .trixbox-leaderboard-score { font-size: 18px; font-weight: bold; color: ${theme.buttonPrimary}; }
            .trixbox-leaderboard-btn { width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; background: ${theme.buttonPrimary}; margin-top: 15px; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
        
        const overlay = document.createElement('div');
        overlay.className = 'trixbox-leaderboard-overlay';
        
        const content = document.createElement('div');
        content.className = 'trixbox-leaderboard-content';
        
        const title = document.createElement('h2');
        title.textContent = '🏆 Top Users Leaderboard';
        content.appendChild(title);
        
        // Sort users by message count
        const sortedUsers = Object.entries(chatStats.userActivity)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10);
        
        const list = document.createElement('div');
        list.className = 'trixbox-leaderboard-list';
        
        if (sortedUsers.length === 0) {
            const empty = document.createElement('div');
            empty.style.textAlign = 'center';
            empty.style.color = '#99aab5';
            empty.style.padding = '20px';
            empty.textContent = 'No data yet';
            list.appendChild(empty);
        } else {
            sortedUsers.forEach((entry, idx) => {
                const [uid, data] = entry;
                const rank = idx + 1;
                let rankClass = '';
                let rankEmoji = `${rank}.`;
                
                if (rank === 1) { rankClass = 'gold'; rankEmoji = '🥇'; }
                else if (rank === 2) { rankClass = 'silver'; rankEmoji = '🥈'; }
                else if (rank === 3) { rankClass = 'bronze'; rankEmoji = '🥉'; }
                
                const entry_div = document.createElement('div');
                entry_div.className = 'trixbox-leaderboard-entry';
                
                const rankDiv = document.createElement('div');
                rankDiv.className = `trixbox-leaderboard-rank ${rankClass}`;
                rankDiv.textContent = rankEmoji;
                entry_div.appendChild(rankDiv);
                
                const infoDiv = document.createElement('div');
                infoDiv.className = 'trixbox-leaderboard-info';
                infoDiv.innerHTML = `<div class="trixbox-leaderboard-name">${data.name}</div><div class="trixbox-leaderboard-count">User ID: ${uid}</div>`;
                entry_div.appendChild(infoDiv);
                
                const scoreDiv = document.createElement('div');
                scoreDiv.className = 'trixbox-leaderboard-score';
                scoreDiv.textContent = data.count;
                entry_div.appendChild(scoreDiv);
                
                list.appendChild(entry_div);
            });
        }
        
        content.appendChild(list);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'trixbox-leaderboard-btn';
        closeBtn.addEventListener('click', () => overlay.remove());
        content.appendChild(closeBtn);
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };

    // --- USER PROFILES & MANAGEMENT ---
    let userProfiles = {}; // Store user profile data
    
    const createUserProfile = (uid, name, flair = '', bio = '', interests = '') => {
        userProfiles[uid] = {
            uid: uid,
            name: name,
            flair: flair,
            bio: bio,
            interests: interests,
            joinDate: new Date().toLocaleDateString(),
            messageCount: 0,
            lastSeen: new Date().toLocaleTimeString()
        };
        localStorage.setItem(`trixbox-profile-${uid}`, JSON.stringify(userProfiles[uid]));
    };
    
    const updateUserProfile = (uid, updates) => {
        if (!userProfiles[uid]) {
            userProfiles[uid] = { uid: uid, name: '', messageCount: 0 };
        }
        Object.assign(userProfiles[uid], updates);
        userProfiles[uid].lastSeen = new Date().toLocaleTimeString();
        localStorage.setItem(`trixbox-profile-${uid}`, JSON.stringify(userProfiles[uid]));
    };
    
    const getUserProfile = (uid) => {
        if (!userProfiles[uid]) {
            const stored = localStorage.getItem(`trixbox-profile-${uid}`);
            if (stored) {
                userProfiles[uid] = JSON.parse(stored);
            }
        }
        return userProfiles[uid];
    };
    
    const showUserProfileModal = (uid, username) => {
        const profile = getUserProfile(uid) || { uid: uid, name: username, messageCount: 0, joinDate: 'Unknown' };
        
        const modalStyle = `
            .trixbox-profile-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-profile-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 400px; max-height: 80vh; overflow-y: auto; }
            .trixbox-profile-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid ${theme.buttonPrimary}; padding-bottom: 15px; }
            .trixbox-profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: ${theme.buttonPrimary}; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; }
            .trixbox-profile-name { color: ${theme.buttonPrimary}; font-size: 20px; font-weight: bold; margin: 10px 0; }
            .trixbox-profile-stat { display: flex; justify-content: space-around; margin: 15px 0; }
            .trixbox-profile-stat-item { text-align: center; }
            .trixbox-profile-stat-value { color: ${theme.buttonPrimary}; font-size: 18px; font-weight: bold; }
            .trixbox-profile-stat-label { color: #99aab5; font-size: 12px; }
            .trixbox-profile-section { margin: 15px 0; }
            .trixbox-profile-section-title { color: ${theme.buttonPrimary}; font-weight: bold; margin-bottom: 8px; }
            .trixbox-profile-section-content { background: #2f3136; padding: 10px; border-radius: 4px; color: ${theme.text}; }
            .trixbox-profile-btn-group { display: flex; gap: 10px; margin-top: 20px; }
            .trixbox-profile-btn { flex: 1; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 14px; }
            .trixbox-profile-btn.primary { background: ${theme.buttonPrimary}; }
            .trixbox-profile-btn.secondary { background: ${theme.buttonSecondary}; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
        
        const overlay = document.createElement('div');
        overlay.className = 'trixbox-profile-overlay';
        
        const content = document.createElement('div');
        content.className = 'trixbox-profile-content';
        
        const header = document.createElement('div');
        header.className = 'trixbox-profile-header';
        
        const avatar = document.createElement('div');
        avatar.className = 'trixbox-profile-avatar';
        avatar.textContent = username.charAt(0).toUpperCase();
        header.appendChild(avatar);
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'trixbox-profile-name';
        nameDiv.textContent = username;
        header.appendChild(nameDiv);
        
        if (profile.flair) {
            const flairDiv = document.createElement('div');
            flairDiv.style.color = '#99aab5';
            flairDiv.style.fontSize = '12px';
            flairDiv.textContent = `Flair: ${profile.flair}`;
            header.appendChild(flairDiv);
        }
        
        content.appendChild(header);
        
        // Stats
        const stats = document.createElement('div');
        stats.className = 'trixbox-profile-stat';
        
        const msgStat = document.createElement('div');
        msgStat.className = 'trixbox-profile-stat-item';
        msgStat.innerHTML = `<div class="trixbox-profile-stat-value">${profile.messageCount || 0}</div><div class="trixbox-profile-stat-label">Messages</div>`;
        stats.appendChild(msgStat);
        
        const joinStat = document.createElement('div');
        joinStat.className = 'trixbox-profile-stat-item';
        joinStat.innerHTML = `<div class="trixbox-profile-stat-value">${profile.joinDate || 'N/A'}</div><div class="trixbox-profile-stat-label">Joined</div>`;
        stats.appendChild(joinStat);
        
        const seenStat = document.createElement('div');
        seenStat.className = 'trixbox-profile-stat-item';
        seenStat.innerHTML = `<div class="trixbox-profile-stat-value">${profile.lastSeen || 'Now'}</div><div class="trixbox-profile-stat-label">Last Seen</div>`;
        stats.appendChild(seenStat);
        
        content.appendChild(stats);
        
        // Bio
        if (profile.bio) {
            const bioSection = document.createElement('div');
            bioSection.className = 'trixbox-profile-section';
            bioSection.innerHTML = `<div class="trixbox-profile-section-title">Bio</div><div class="trixbox-profile-section-content">${profile.bio}</div>`;
            content.appendChild(bioSection);
        }
        
        // Interests
        if (profile.interests) {
            const interestsSection = document.createElement('div');
            interestsSection.className = 'trixbox-profile-section';
            interestsSection.innerHTML = `<div class="trixbox-profile-section-title">Interests</div><div class="trixbox-profile-section-content">${profile.interests}</div>`;
            content.appendChild(interestsSection);
        }
        
        // Buttons
        const btnGroup = document.createElement('div');
        btnGroup.className = 'trixbox-profile-btn-group';
        
        const pmBtn = document.createElement('button');
        pmBtn.textContent = 'Message';
        pmBtn.className = 'trixbox-profile-btn primary';
        pmBtn.addEventListener('click', () => {
            overlay.remove();
            showPrivateMessageModal(username);
        });
        btnGroup.appendChild(pmBtn);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'trixbox-profile-btn secondary';
        closeBtn.addEventListener('click', () => overlay.remove());
        btnGroup.appendChild(closeBtn);
        
        content.appendChild(btnGroup);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };

    // --- MESSAGE SEARCH/FILTER ---
    let messageHistory = [];
    const addToMessageHistory = (data) => {
        messageHistory.push({
            name: data.name,
            text: data.text,
            flair: data.flair,
            uid: data.uid,
            timestamp: new Date().toLocaleTimeString()
        });
        // Update user profile message count
        updateUserProfile(data.uid, { name: data.name, messageCount: (getUserProfile(data.uid)?.messageCount || 0) + 1 });
        // Keep only last 500 messages
        if (messageHistory.length > 500) {
            messageHistory.shift();
        }
    };
    
    const fetchAllExistingMessages = () => {
        try {
            const iframeDoc = chatIframe.contentDocument || chatIframe.contentWindow.document;
            if (!iframeDoc) return;
            
            // Try to find all message elements in the chat
            const messageElements = iframeDoc.querySelectorAll('[class*="message"], [data-message], .msg, .chat-message, [role="article"]');
            
            messageElements.forEach(msgEl => {
                try {
                    // Extract message text
                    const textContent = msgEl.textContent || msgEl.innerText || '';
                    
                    // Extract username (try multiple selectors)
                    let username = '';
                    const userEl = msgEl.querySelector('[class*="user"], [class*="author"], [class*="name"]');
                    if (userEl) {
                        username = userEl.textContent || userEl.innerText || '';
                    }
                    
                    // Only add if we have both text and username
                    if (textContent.trim() && username.trim()) {
                        const existingMsg = messageHistory.find(m => m.text === textContent.trim() && m.name === username.trim());
                        if (!existingMsg) {
                            messageHistory.push({
                                name: username.trim(),
                                text: textContent.trim(),
                                flair: '',
                                uid: 'existing_' + Date.now() + Math.random(),
                                timestamp: new Date().toLocaleTimeString()
                            });
                        }
                    }
                } catch (e) {
                    // Skip individual message parsing errors
                }
            });
        } catch (e) {
            console.warn('TrixBox: Could not fetch existing messages from iframe', e);
        }
    };
    
    const searchMessages = (query) => {
        if (!query.trim()) return messageHistory;
        const lowerQuery = query.toLowerCase();
        return messageHistory.filter(msg => 
            msg.text.toLowerCase().includes(lowerQuery) ||
            msg.name.toLowerCase().includes(lowerQuery)
        );
    };

    // --- RICH MEDIA & CONTENT ---
    const enrichMessageWithMedia = (text) => {
        let enriched = text;
        
        // Detect YouTube URLs and embed them
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/g;
        enriched = enriched.replace(youtubeRegex, (match, videoId) => {
            return `<div style="margin: 8px 0;"><iframe width="280" height="157" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 4px;"></iframe></div>`;
        });
        
        // Detect Twitch URLs and embed them
        const twitchRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/g;
        enriched = enriched.replace(twitchRegex, (match, channel) => {
            return `<div style="margin: 8px 0;"><iframe src="https://twitch.tv/embed/${channel}/chat?parent=iframe.chat" height="300" width="280" style="border-radius: 4px;"></iframe></div>`;
        });
        
        // Detect image URLs and embed them (but not if already processed as video)
        const imgRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi;
        enriched = enriched.replace(imgRegex, (url) => {
            return `<div style="margin: 8px 0;"><img src="${url}" style="max-width: 280px; max-height: 280px; border-radius: 4px; cursor: pointer;" onclick="window.open('${url}', '_blank')"></div>`;
        });
        
        // Detect URLs and convert to clickable links (skip if already processed)
        const urlRegex = /(https?:\/\/[^\s<>]+)/g;
        enriched = enriched.replace(urlRegex, (url) => {
            // Skip if already in an iframe or img tag
            if (enriched.includes(`src="${url}"`) || enriched.includes(`href="${url}"`)) {
                return url;
            }
            try {
                const domain = new URL(url).hostname;
                return `<a href="${url}" target="_blank" style="color: #5865f2; text-decoration: underline;">${domain}</a>`;
            } catch (e) {
                return url;
            }
        });
        
        // Detect code blocks (```code```)
        enriched = enriched.replace(/```([\s\S]*?)```/g, (match, code) => {
            return `<pre style="background: #2f3136; color: #dcddde; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 8px 0;"><code>${code.trim()}</code></pre>`;
        });
        
        // Detect inline code (`code`)
        enriched = enriched.replace(/`([^`]+)`/g, '<code style="background: #2f3136; color: #dcddde; padding: 2px 4px; border-radius: 2px;">$1</code>');
        
        // Detect mentions (@username)
        enriched = enriched.replace(/@(\w+)/g, '<span style="color: #5865f2; font-weight: bold;">@$1</span>');
        
        // Detect hashtags (#tag)
        enriched = enriched.replace(/#(\w+)/g, '<span style="color: #5865f2;">​#$1</span>');
        
        return enriched;
    };
    
    const showMediaGalleryModal = () => {
        const modalStyle = `
            .trixbox-gallery-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-gallery-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 500px; max-height: 80vh; overflow-y: auto; }
            .trixbox-gallery-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 15px 0; }
            .trixbox-gallery-item { background: #2f3136; padding: 15px; border-radius: 4px; text-align: center; cursor: pointer; transition: background 0.2s; }
            .trixbox-gallery-item:hover { background: #36393f; }
            .trixbox-gallery-item-icon { font-size: 32px; margin-bottom: 8px; }
            .trixbox-gallery-item-label { font-size: 12px; color: #99aab5; }
            .trixbox-gallery-btn { width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; background: ${theme.buttonPrimary}; margin-top: 15px; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
        
        const overlay = document.createElement('div');
        overlay.className = 'trixbox-gallery-overlay';
        
        const content = document.createElement('div');
        content.className = 'trixbox-gallery-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Rich Media & Content';
        content.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'trixbox-gallery-grid';
        
        const mediaItems = [
            { icon: '🖼️', label: 'Images', action: () => alert('Share images by pasting image URLs in chat') },
            { icon: '🎥', label: 'Videos', action: () => alert('Embed videos by pasting YouTube/Vimeo URLs') },
            { icon: '🔗', label: 'Links', action: () => alert('Links are automatically converted to clickable URLs') },
            { icon: '💻', label: 'Code', action: () => alert('Wrap code in backticks: `code` or ```code blocks```') },
            { icon: '📝', label: 'Mentions', action: () => alert('Mention users with @username') },
            { icon: '#️⃣', label: 'Hashtags', action: () => alert('Use #hashtags to tag topics') }
        ];
        
        mediaItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'trixbox-gallery-item';
            itemDiv.innerHTML = `<div class="trixbox-gallery-item-icon">${item.icon}</div><div class="trixbox-gallery-item-label">${item.label}</div>`;
            itemDiv.addEventListener('click', item.action);
            grid.appendChild(itemDiv);
        });
        
        content.appendChild(grid);
        
        const infoDiv = document.createElement('div');
        infoDiv.style.background = '#2f3136';
        infoDiv.style.padding = '15px';
        infoDiv.style.borderRadius = '4px';
        infoDiv.style.marginTop = '15px';
        infoDiv.style.fontSize = '12px';
        infoDiv.style.color = '#99aab5';
        infoDiv.innerHTML = `
            <strong>Supported Formats:</strong><br>
            • Images: JPG, PNG, GIF, WebP<br>
            • Videos: YouTube, Vimeo<br>
            • Code: Inline (\`code\`) or blocks (\`\`\`code\`\`\`)<br>
            • Mentions: @username<br>
            • Hashtags: #topic
        `;
        content.appendChild(infoDiv);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'trixbox-gallery-btn';
        closeBtn.addEventListener('click', () => overlay.remove());
        content.appendChild(closeBtn);
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };
    
    // --- FILE SHARING ---
    let sharedFiles = [];
    
    // Load shared files from localStorage on initialization
    try {
        const storedFiles = localStorage.getItem('trixbox-shared-files');
        if (storedFiles) {
            sharedFiles = JSON.parse(storedFiles);
        }
    } catch (e) {
        console.warn('TrixBox: Could not load shared files from localStorage', e);
    }
    
    const uploadFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = {
                name: file.name,
                size: file.size,
                type: file.type,
                data: e.target.result,
                uploadedBy: localStorage.getItem('trixbox-username') || 'Anonymous',
                uploadedAt: new Date().toLocaleString(),
                downloads: 0,
                id: 'file_' + Date.now() + Math.random()
            };
            sharedFiles.push(fileData);
            localStorage.setItem('trixbox-shared-files', JSON.stringify(sharedFiles));
            
            // Send file share notification to chat
            if (typeof chattable !== 'undefined' && typeof chattable.send === 'function') {
                chattable.send(`📁 ${fileData.uploadedBy} shared: ${fileData.name} (${(fileData.size / 1024).toFixed(2)} KB)`);
            }
        };
        reader.readAsDataURL(file);
    };
    
    const downloadFile = (fileId) => {
        const file = sharedFiles.find(f => f.id === fileId);
        if (!file) return;
        
        file.downloads++;
        localStorage.setItem('trixbox-shared-files', JSON.stringify(sharedFiles));
        
        // Create download link
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const showFileShareModal = () => {
        const modalStyle = `
            .trixbox-fileshare-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-fileshare-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 500px; max-height: 80vh; overflow-y: auto; }
            .trixbox-fileshare-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-fileshare-upload { background: #2f3136; padding: 20px; border-radius: 4px; border: 2px dashed #4f545c; text-align: center; margin: 15px 0; cursor: pointer; transition: all 0.2s; }
            .trixbox-fileshare-upload:hover { border-color: ${theme.buttonPrimary}; background: #36393f; }
            .trixbox-fileshare-upload input { display: none; }
            .trixbox-fileshare-list { margin: 15px 0; }
            .trixbox-fileshare-item { background: #2f3136; padding: 12px; margin: 8px 0; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; }
            .trixbox-fileshare-item-info { flex: 1; }
            .trixbox-fileshare-item-name { color: ${theme.buttonPrimary}; font-weight: bold; }
            .trixbox-fileshare-item-meta { color: #99aab5; font-size: 12px; margin-top: 4px; }
            .trixbox-fileshare-item-actions { display: flex; gap: 8px; }
            .trixbox-fileshare-btn { color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
            .trixbox-fileshare-btn-primary { background: ${theme.buttonPrimary}; }
            .trixbox-fileshare-btn-secondary { background: ${theme.buttonSecondary}; }
            .trixbox-fileshare-close { width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; background: ${theme.buttonPrimary}; margin-top: 15px; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
        
        const overlay = document.createElement('div');
        overlay.className = 'trixbox-fileshare-overlay';
        
        const content = document.createElement('div');
        content.className = 'trixbox-fileshare-content';
        
        const title = document.createElement('h2');
        title.textContent = '📁 File Sharing';
        content.appendChild(title);
        
        const uploadDiv = document.createElement('div');
        uploadDiv.className = 'trixbox-fileshare-upload';
        uploadDiv.innerHTML = '<p>📤 Click or drag files here to upload</p>';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadFile(e.target.files[0]);
                updateFileList();
            }
        });
        uploadDiv.appendChild(fileInput);
        
        uploadDiv.addEventListener('click', () => fileInput.click());
        uploadDiv.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadDiv.style.borderColor = theme.buttonPrimary;
            uploadDiv.style.background = '#36393f';
        });
        uploadDiv.addEventListener('dragleave', () => {
            uploadDiv.style.borderColor = '#4f545c';
            uploadDiv.style.background = '#2f3136';
        });
        uploadDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadDiv.style.borderColor = '#4f545c';
            uploadDiv.style.background = '#2f3136';
            if (e.dataTransfer.files.length > 0) {
                uploadFile(e.dataTransfer.files[0]);
                updateFileList();
            }
        });
        
        content.appendChild(uploadDiv);
        
        const listDiv = document.createElement('div');
        listDiv.className = 'trixbox-fileshare-list';
        content.appendChild(listDiv);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'trixbox-fileshare-close';
        closeBtn.addEventListener('click', () => overlay.remove());
        content.appendChild(closeBtn);
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        const updateFileList = () => {
            listDiv.innerHTML = '';
            if (sharedFiles.length === 0) {
                const empty = document.createElement('div');
                empty.style.textAlign = 'center';
                empty.style.color = '#99aab5';
                empty.style.padding = '20px';
                empty.textContent = 'No files shared yet';
                listDiv.appendChild(empty);
            } else {
                sharedFiles.forEach(file => {
                    const item = document.createElement('div');
                    item.className = 'trixbox-fileshare-item';
                    
                    const info = document.createElement('div');
                    info.className = 'trixbox-fileshare-item-info';
                    info.innerHTML = `
                        <div class="trixbox-fileshare-item-name">${file.name}</div>
                        <div class="trixbox-fileshare-item-meta">
                            ${(file.size / 1024).toFixed(2)} KB • Uploaded by ${file.uploadedBy} • ${file.uploadedAt} • ⬇️ ${file.downloads}
                        </div>
                    `;
                    item.appendChild(info);
                    
                    const actions = document.createElement('div');
                    actions.className = 'trixbox-fileshare-item-actions';
                    
                    const downloadBtn = document.createElement('button');
                    downloadBtn.textContent = '⬇️ Download';
                    downloadBtn.className = 'trixbox-fileshare-btn trixbox-fileshare-btn-primary';
                    downloadBtn.addEventListener('click', () => downloadFile(file.id));
                    actions.appendChild(downloadBtn);
                    
                    item.appendChild(actions);
                    listDiv.appendChild(item);
                });
            }
        };
        
        updateFileList();
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };
    
    const showMessageSearchModal = () => {
        const modalStyle = `
            .trixbox-search-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-search-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 450px; max-height: 80vh; overflow-y: auto; }
            .trixbox-search-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-search-input { width: 100%; padding: 10px; margin: 15px 0; background: #36393f; color: ${theme.text}; border: 1px solid #4f545c; border-radius: 4px; box-sizing: border-box; }
            .trixbox-search-results { max-height: 400px; overflow-y: auto; }
            .trixbox-search-result { padding: 12px; margin: 8px 0; background: #2f3136; border-left: 3px solid ${theme.buttonPrimary}; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
            .trixbox-search-result:hover { background: #36393f; }
            .trixbox-search-result-name { color: ${theme.buttonPrimary}; font-weight: bold; }
            .trixbox-search-result-text { color: ${theme.text}; margin-top: 5px; word-break: break-word; }
            .trixbox-search-result-time { color: #99aab5; font-size: 12px; margin-top: 5px; }
            .trixbox-search-btn { width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; background: ${theme.buttonPrimary}; margin-top: 15px; }
            .trixbox-search-btn:hover { opacity: 0.9; }
            .trixbox-search-info { color: #99aab5; font-size: 12px; text-align: center; margin: 10px 0; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
        
        const overlay = document.createElement('div');
        overlay.className = 'trixbox-search-overlay';
        
        const content = document.createElement('div');
        content.className = 'trixbox-search-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Search Messages';
        content.appendChild(title);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'trixbox-search-info';
        infoDiv.textContent = 'Fetching existing messages...';
        content.appendChild(infoDiv);
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'trixbox-search-input';
        searchInput.placeholder = 'Search by message or username...';
        searchInput.disabled = true;
        content.appendChild(searchInput);
        
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'trixbox-search-results';
        content.appendChild(resultsContainer);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'trixbox-search-btn';
        closeBtn.addEventListener('click', () => overlay.remove());
        content.appendChild(closeBtn);
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        // Fetch existing messages when modal opens
        setTimeout(() => {
            fetchAllExistingMessages();
            infoDiv.textContent = `Found ${messageHistory.length} messages. Start typing to search...`;
            searchInput.disabled = false;
            searchInput.focus();
        }, 500);
        
        const updateResults = () => {
            const results = searchMessages(searchInput.value);
            resultsContainer.innerHTML = '';
            
            if (results.length === 0) {
                const noResults = document.createElement('div');
                noResults.style.color = '#99aab5';
                noResults.style.textAlign = 'center';
                noResults.style.padding = '20px';
                noResults.textContent = 'No messages found';
                resultsContainer.appendChild(noResults);
            } else {
                results.forEach(msg => {
                    const resultDiv = document.createElement('div');
                    resultDiv.className = 'trixbox-search-result';
                    resultDiv.style.cursor = 'pointer';
                    
                    const nameSpan = document.createElement('div');
                    nameSpan.className = 'trixbox-search-result-name';
                    nameSpan.textContent = msg.name;
                    nameSpan.style.cursor = 'pointer';
                    nameSpan.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showUserProfileModal(msg.uid, msg.name);
                    });
                    resultDiv.appendChild(nameSpan);
                    
                    const textSpan = document.createElement('div');
                    textSpan.className = 'trixbox-search-result-text';
                    textSpan.textContent = msg.text;
                    resultDiv.appendChild(textSpan);
                    
                    const timeSpan = document.createElement('div');
                    timeSpan.className = 'trixbox-search-result-time';
                    timeSpan.textContent = msg.timestamp;
                    resultDiv.appendChild(timeSpan);
                    
                    resultDiv.addEventListener('click', () => {
                        showUserProfileModal(msg.uid, msg.name);
                    });
                    
                    resultsContainer.appendChild(resultDiv);
                });
            }
        };
        
        searchInput.addEventListener('input', updateResults);
        searchInput.focus();
        updateResults();
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };

    // --- PRIVATE MESSAGING ---
    const showPrivateMessageModal = (targetUser) => {
        const modalStyle = `
            .trixbox-pm-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-pm-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 400px; }
            .trixbox-pm-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-pm-group { margin: 15px 0; }
            .trixbox-pm-group label { display: block; margin-bottom: 8px; font-weight: bold; }
            .trixbox-pm-input { width: 100%; padding: 10px; background: #36393f; color: ${theme.text}; border: 1px solid #4f545c; border-radius: 4px; box-sizing: border-box; }
            .trixbox-pm-textarea { width: 100%; padding: 10px; background: #36393f; color: ${theme.text}; border: 1px solid #4f545c; border-radius: 4px; box-sizing: border-box; min-height: 100px; resize: vertical; }
            .trixbox-pm-btn-group { display: flex; gap: 10px; margin-top: 20px; }
            .trixbox-pm-btn { flex: 1; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 14px; }
            .trixbox-pm-btn.send { background: ${theme.buttonPrimary}; }
            .trixbox-pm-btn.cancel { background: ${theme.buttonSecondary}; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);
        
        const overlay = document.createElement('div');
        overlay.className = 'trixbox-pm-overlay';
        
        const content = document.createElement('div');
        content.className = 'trixbox-pm-content';
        
        const title = document.createElement('h2');
        title.textContent = `Private Message to ${targetUser || 'User'}`;
        content.appendChild(title);
        
        const recipientGroup = document.createElement('div');
        recipientGroup.className = 'trixbox-pm-group';
        
        const recipientLabel = document.createElement('label');
        recipientLabel.textContent = 'Recipient';
        recipientGroup.appendChild(recipientLabel);
        
        const recipientInput = document.createElement('input');
        recipientInput.type = 'text';
        recipientInput.className = 'trixbox-pm-input';
        recipientInput.value = targetUser || '';
        recipientInput.placeholder = 'Enter username';
        recipientGroup.appendChild(recipientInput);
        content.appendChild(recipientGroup);
        
        const messageGroup = document.createElement('div');
        messageGroup.className = 'trixbox-pm-group';
        
        const messageLabel = document.createElement('label');
        messageLabel.textContent = 'Message';
        messageGroup.appendChild(messageLabel);
        
        const messageInput = document.createElement('textarea');
        messageInput.className = 'trixbox-pm-textarea';
        messageInput.placeholder = 'Type your private message...';
        messageGroup.appendChild(messageInput);
        content.appendChild(messageGroup);
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'trixbox-pm-btn-group';
        
        const sendBtn = document.createElement('button');
        sendBtn.textContent = 'Send';
        sendBtn.className = 'trixbox-pm-btn send';
        sendBtn.addEventListener('click', () => {
            const recipient = recipientInput.value.trim();
            const message = messageInput.value.trim();
            
            if (!recipient || !message) {
                alert('Please enter both recipient and message');
                return;
            }
            
            // Send private message via payload
            if (typeof chattable !== 'undefined' && typeof chattable.sendPayload === 'function') {
                chattable.sendPayload({
                    type: 'private-message',
                    recipient: recipient,
                    message: message,
                    sender: localStorage.getItem('trixbox-username') || 'Anonymous'
                });
                
                // Show confirmation
                alert(`Private message sent to ${recipient}`);
                overlay.remove();
            } else {
                alert('Chat not ready. Please try again.');
            }
        });
        btnGroup.appendChild(sendBtn);
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'trixbox-pm-btn cancel';
        cancelBtn.addEventListener('click', () => overlay.remove());
        btnGroup.appendChild(cancelBtn);
        
        content.appendChild(btnGroup);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    };

    // --- USER MENTIONS/TAGGING ---
    let mentionDropdownActive = false;
    const createMentionDropdown = (users, filterText) => {
        // Remove existing dropdown if any
        const existingDropdown = document.getElementById('trixbox-mention-dropdown');
        if (existingDropdown) existingDropdown.remove();
        
        if (!users || Object.keys(users).length === 0) return;
        
        // Filter users based on input
        const filteredUsers = Object.entries(users)
            .filter(([uid, name]) => name.toLowerCase().includes(filterText.toLowerCase()))
            .slice(0, 8); // Limit to 8 suggestions
        
        if (filteredUsers.length === 0) return;
        
        const dropdown = document.createElement('div');
        dropdown.id = 'trixbox-mention-dropdown';
        Object.assign(dropdown.style, {
            position: 'fixed',
            background: theme.modalBg,
            border: `1px solid ${theme.buttonSecondary}`,
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            zIndex: '100000',
            maxWidth: '200px',
            maxHeight: '200px',
            overflowY: 'auto'
        });
        
        filteredUsers.forEach(([uid, name], index) => {
            const option = document.createElement('div');
            Object.assign(option.style, {
                padding: '8px 12px',
                cursor: 'pointer',
                color: theme.text,
                borderBottom: index < filteredUsers.length - 1 ? `1px solid ${theme.buttonSecondary}` : 'none',
                transition: 'background 0.2s'
            });
            option.textContent = name;
            option.onmouseover = () => {
                option.style.background = theme.buttonPrimary;
            };
            option.onmouseout = () => {
                option.style.background = 'transparent';
            };
            option.onclick = () => {
                insertMention(name);
                dropdown.remove();
                mentionDropdownActive = false;
            };
            dropdown.appendChild(option);
        });
        
        document.body.appendChild(dropdown);
        mentionDropdownActive = true;
        return dropdown;
    };
    
    const insertMention = (username) => {
        try {
            const iframeDoc = chatIframe.contentDocument || chatIframe.contentWindow.document;
            if (!iframeDoc) return;
            
            const inputField = iframeDoc.querySelector('textarea, input[type="text"], [contenteditable]');
            if (!inputField) return;
            
            if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
                const cursorPos = inputField.selectionStart;
                const textBefore = inputField.value.substring(0, cursorPos);
                const lastAtIndex = textBefore.lastIndexOf('@');
                
                if (lastAtIndex !== -1) {
                    const textAfter = inputField.value.substring(cursorPos);
                    inputField.value = textBefore.substring(0, lastAtIndex) + `@${username} ` + textAfter;
                    inputField.selectionStart = inputField.selectionEnd = lastAtIndex + username.length + 2;
                }
            } else if (inputField.contentEditable === 'true') {
                const selection = chatIframe.contentWindow.getSelection();
                const range = selection.getRangeAt(0);
                const cursorPos = range.startOffset;
                const textNode = range.startContainer;
                const text = textNode.textContent;
                const textBefore = text.substring(0, cursorPos);
                const lastAtIndex = textBefore.lastIndexOf('@');
                
                if (lastAtIndex !== -1) {
                    const textAfter = text.substring(cursorPos);
                    textNode.textContent = textBefore.substring(0, lastAtIndex) + `@${username} ` + textAfter;
                    range.setStart(textNode, lastAtIndex + username.length + 2);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
            
            inputField.focus();
        } catch (e) {
            console.warn('TrixBox: Could not insert mention', e);
        }
    };
    
    const setupMentionListener = () => {
        try {
            const iframeDoc = chatIframe.contentDocument || chatIframe.contentWindow.document;
            if (!iframeDoc) return;
            
            const inputField = iframeDoc.querySelector('textarea, input[type="text"], [contenteditable]');
            if (!inputField) return;
            
            inputField.addEventListener('input', (e) => {
                const value = inputField.value || inputField.textContent || '';
                const cursorPos = inputField.selectionStart || value.length;
                const textBefore = value.substring(0, cursorPos);
                const lastAtIndex = textBefore.lastIndexOf('@');
                
                if (lastAtIndex !== -1 && cursorPos > lastAtIndex) {
                    const filterText = textBefore.substring(lastAtIndex + 1);
                    
                    // Only show dropdown if @ is followed by text (no space)
                    if (filterText && !filterText.includes(' ')) {
                        const dropdown = createMentionDropdown(window.trixboxCurrentUsers || {}, filterText);
                        
                        if (dropdown) {
                            // Position dropdown near cursor
                            const rect = inputField.getBoundingClientRect();
                            dropdown.style.left = (rect.left + 10) + 'px';
                            dropdown.style.top = (rect.top - 210) + 'px';
                        }
                    } else {
                        const existingDropdown = document.getElementById('trixbox-mention-dropdown');
                        if (existingDropdown) existingDropdown.remove();
                        mentionDropdownActive = false;
                    }
                } else {
                    const existingDropdown = document.getElementById('trixbox-mention-dropdown');
                    if (existingDropdown) existingDropdown.remove();
                    mentionDropdownActive = false;
                }
            });
            
            inputField.addEventListener('keydown', (e) => {
                if (mentionDropdownActive && e.key === 'Escape') {
                    const dropdown = document.getElementById('trixbox-mention-dropdown');
                    if (dropdown) dropdown.remove();
                    mentionDropdownActive = false;
                }
            });
        } catch (e) {
            console.warn('TrixBox: Could not setup mention listener', e);
        }
    };

    // --- CONNECTION STATUS MANAGER ---
    const updateConnectionStatus = (userList) => {
        const statusDot = document.getElementById('trixbox-connection-status');
        const userCount = Object.keys(userList || {}).length;
        if (userCount > 0) {
            statusDot.style.backgroundColor = '#43b581'; // Green
            statusDot.title = `Online: ${userCount} user${userCount !== 1 ? 's' : ''}`;
        } else {
            statusDot.style.backgroundColor = '#f04747'; // Red
            statusDot.title = 'Offline';
        }
    };

    // Show user list on status dot click
    document.addEventListener('click', (e) => {
        if (e.target.id === 'trixbox-connection-status') {
            showOnlineUsersModal();
        }
    });

    const showOnlineUsersModal = () => {
        const modalStyle = `
            .trixbox-users-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100001; display: flex; align-items: center; justify-content: center; }
            .trixbox-users-content { background: ${theme.modalBg}; color: ${theme.text}; padding: 25px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 300px; max-height: 60vh; overflow-y: auto; }
            .trixbox-users-content h2 { margin-top: 0; text-align: center; color: ${theme.buttonPrimary}; }
            .trixbox-users-list { list-style: none; padding: 0; margin: 0; }
            .trixbox-users-list li { padding: 10px; border-bottom: 1px solid #4f545c; display: flex; align-items: center; gap: 10px; }
            .trixbox-users-list li:last-child { border-bottom: none; }
            .trixbox-users-online-dot { width: 8px; height: 8px; background: #43b581; border-radius: 50%; }
            .trixbox-users-close { width: 100%; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; background: ${theme.buttonPrimary}; margin-top: 15px; }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.innerText = modalStyle;
        document.head.appendChild(styleSheet);

        // Get current user list
        let userList = window.trixboxCurrentUsers || {};

        const userListHtml = Object.entries(userList).map(([uid, name]) => 
            `<li><div class="trixbox-users-online-dot"></div><span>${name}</span></li>`
        ).join('');

        const overlay = document.createElement('div');
        overlay.className = 'trixbox-users-overlay';
        overlay.innerHTML = `
            <div class="trixbox-users-content">
                <h2>Online Users (${Object.keys(userList).length})</h2>
                <ul class="trixbox-users-list">
                    ${userListHtml || '<li>No users online</li>'}
                </ul>
                <button class="trixbox-users-close">Close</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('button').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };

    // --- MESSAGE ACTIVITY BADGE ---
    let messageActivityCount = 0;
    const updateMessageActivityBadge = () => {
        messageActivityCount++;
        toggleIcon.style.position = 'relative';
        
        let badge = document.getElementById('trixbox-activity-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'trixbox-activity-badge';
            Object.assign(badge.style, {
                position: 'absolute', top: '-5px', right: '-5px',
                background: '#f04747', color: 'white', fontSize: '11px',
                fontWeight: 'bold', borderRadius: '50%', width: '20px', height: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: '99999'
            });
            toggleIcon.appendChild(badge);
        }
        
        badge.textContent = messageActivityCount > 99 ? '99+' : messageActivityCount;
        badge.style.display = 'flex';
    };

    // Reset badge when chat is opened
    const resetActivityBadge = () => {
        messageActivityCount = 0;
        const badge = document.getElementById('trixbox-activity-badge');
        if (badge) badge.style.display = 'none';
    };

    // Wrap the chat selection to reset badge
    document.addEventListener('click', (e) => {
        if (e.target === toggleIcon || (e.target.parentElement === toggleIcon)) {
            resetActivityBadge();
        }
    });

    // Reset badge when main chat opens
    const originalToggle = toggleIcon.addEventListener;
    const mainOpenListener = () => {
        resetActivityBadge();
    };

    // Fallback initialization if script loads via other method
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeChattable, 500);
        });
    } else {
        setTimeout(initializeChattable, 500);
    }

    // --- 7. INITIALIZE NOTIFICATION SOUND ---
    initializeNotificationSound();

    // --- 8. RUN THE UPDATE CHECKER ---
    checkForUpdates();

    // --- 8. HOTKEY HANDLING - Press configured key to release chat focus and use game hotkeys ---
    document.addEventListener('keydown', (e) => {
        const disableFocusKey = localStorage.getItem('trixbox-disable-focus-key') || 'Escape';
        if (e.key === disableFocusKey || (disableFocusKey === 'Escape' && (e.key === 'Escape' || e.keyCode === 27))) {
            // Remove focus from any active chat input
            document.activeElement.blur();
            
            // Hide main chat
            if (chatContainer.style.display === 'flex') {
                chatContainer.style.display = 'none';
                toggleIcon.style.display = 'flex';
            }
            
            // Hide any open chat windows
            const voiceContainer = document.getElementById('trixbox-voice-container');
            const newContainer = document.getElementById('trixbox-new-container');
            
            if (voiceContainer) voiceContainer.remove();
            if (newContainer) newContainer.remove();
            
            toggleIcon.style.display = 'flex';
        }
    });

})();