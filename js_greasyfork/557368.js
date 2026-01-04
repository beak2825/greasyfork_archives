// ==UserScript==
// @name         Enhanced YouTube Download Button
// @namespace    https://github.com/MXKXYZ
// @version      2.1
// @description  Add download button to YouTube videos that redirects to addyoutube.com
// @author       KXYZNEW (KXYZNEW@GMAIL.COM)
// @contact      KXYZNEW@GMAIL.COM
// @homepage     https://github.com/MXKXYZ
// @supportURL   https://github.com/MXKXYZ
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557368/Enhanced%20YouTube%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/557368/Enhanced%20YouTube%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Script information
    const SCRIPT_INFO = {
        name: "Enhanced YouTube Download Button",
        version: "2.1",
        author: "KXYZNEW",
        email: "KXYZNEW@GMAIL.COM",
        github: "MXKXYZ",
        created: "2024",
        description: "Adds download button to YouTube videos"
    };
    
    console.log(`[${SCRIPT_INFO.name} v${SCRIPT_INFO.version}] Initializing...`);
    console.log(`[${SCRIPT_INFO.name}] Author: ${SCRIPT_INFO.author} (${SCRIPT_INFO.email})`);
    
    const BASE_URL = "https://addyoutube.com";
    const BUTTON_ID = "enhancedDwnldBtn";
    
    // Multiple possible targets for better reliability
    const TARGET_SELECTORS = [
        "#owner",
        "#upload-info", 
        "#channel-name",
        ".ytd-video-owner-renderer",
        "#meta-contents",
        "#above-the-fold"
    ];

    const buttonStyle = `
        #${BUTTON_ID} {
            background-color: #28a745;
            color: #FFFFFF;
            border: 1px solid #3F3F3F;
            border-color: rgba(255,255,255,0.2);
            margin-left: 8px;
            padding: 0 16px;
            border-radius: 18px;
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            height: 36px;
            line-height: normal;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        #${BUTTON_ID}:hover {
            background-color: #218838;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        #${BUTTON_ID}.loading {
            background-color: #6c757d;
            cursor: not-allowed;
        }
        #${BUTTON_ID}.error {
            background-color: #dc3545;
        }
        
        /* KXYZ Branding - Subtle watermark */
        .kxyz-watermark::after {
            content: "KXYZ";
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-size: 10px;
            color: rgba(255,255,255,0.1);
            font-family: monospace;
            z-index: 9999;
            pointer-events: none;
        }
    `;

    // Add styles and branding
    const style = document.createElement('style');
    style.textContent = buttonStyle;
    document.head.appendChild(style);
    
    // Add subtle watermark
    document.body.classList.add('kxyz-watermark');

    function transformUrl(originalUrl) {
        return originalUrl.replace("youtube.com", "addyoutube.com");
    }

    function findBestTarget() {
        for (const selector of TARGET_SELECTORS) {
            const element = document.querySelector(selector);
            if (element && element.isConnected) {
                console.log(`[${SCRIPT_INFO.name}] Found target: ${selector}`);
                return element;
            }
        }
        console.warn(`[${SCRIPT_INFO.name}] No suitable target found`);
        return null;
    }

    function waitForElement() {
        return new Promise((resolve) => {
            // First check immediately
            const immediateElement = findBestTarget();
            if (immediateElement) {
                return resolve(immediateElement);
            }

            // Then wait for mutations
            const observer = new MutationObserver((mutations) => {
                const element = findBestTarget();
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'id']
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                observer.disconnect();
                resolve(findBestTarget());
            }, 10000);
        });
    }

    function createButton() {
        const downloadButton = document.createElement('a');
        downloadButton.href = transformUrl(window.location.href);
        downloadButton.target = '_blank';
        downloadButton.id = BUTTON_ID;
        downloadButton.innerText = 'Download';
        downloadButton.title = `Download this video via addyoutube.com | ${SCRIPT_INFO.name} v${SCRIPT_INFO.version} by ${SCRIPT_INFO.author}`;
        
        // Add KXYZ data attribute for identification
        downloadButton.setAttribute('data-kxyz-script', SCRIPT_INFO.name);
        downloadButton.setAttribute('data-author', SCRIPT_INFO.author);
        
        // Add loading state management
        downloadButton.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) {
                e.preventDefault();
                return;
            }
            
            this.classList.add('loading');
            this.innerText = 'Redirecting...';
            
            // Log usage
            console.log(`[${SCRIPT_INFO.name}] Download initiated for: ${window.location.href}`);
            
            // Reset after 3 seconds if still on page
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerText = 'Download';
            }, 3000);
        });
        
        return downloadButton;
    }

    function addButton() {
        // Remove existing button first
        const existingBtn = document.getElementById(BUTTON_ID);
        if (existingBtn) {
            existingBtn.remove();
        }

        waitForElement().then((btnContainer) => {
            if (!btnContainer) {
                console.warn(`[${SCRIPT_INFO.name}] Cannot find container for button`);
                return;
            }

            const downloadButton = createButton();
            
            // Try to insert after subscribe button if it exists
            const subscribeBtn = btnContainer.querySelector('#subscribe-button');
            if (subscribeBtn && subscribeBtn.parentNode) {
                subscribeBtn.parentNode.insertBefore(downloadButton, subscribeBtn.nextSibling);
            } else {
                btnContainer.appendChild(downloadButton);
            }
            
            console.log(`[${SCRIPT_INFO.name}] Button added successfully`);
            console.log(`[${SCRIPT_INFO.name}] Contact: ${SCRIPT_INFO.email} | GitHub: ${SCRIPT_INFO.github}`);
        }).catch(error => {
            console.error(`[${SCRIPT_INFO.name}] Error adding button: ${error}`);
        });
    }

    function updateButton() {
        const btn = document.getElementById(BUTTON_ID);
        if (btn) {
            btn.href = transformUrl(window.location.href);
            btn.classList.remove('loading', 'error');
            btn.innerText = 'Download';
        }
    }

    let currentUrl = window.location.href;

    function checkAndAddButton() {
        if (window.location.pathname === '/watch') {
            // Only re-add if URL changed or button doesn't exist
            if (window.location.href !== currentUrl || !document.getElementById(BUTTON_ID)) {
                addButton();
                currentUrl = window.location.href;
            }
        } else {
            // Remove button if not on watch page
            const btn = document.getElementById(BUTTON_ID);
            if (btn) {
                btn.remove();
            }
        }
    }

    // Enhanced navigation detection
    window.addEventListener("yt-navigate-finish", checkAndAddButton);
    
    // Also check on URL changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(checkAndAddButton, 500);
        }
    }).observe(document, { subtree: true, childList: true });

    // Initial check
    setTimeout(checkAndAddButton, 1000);
    
    // Re-check every 5 seconds as backup
    setInterval(checkAndAddButton, 5000);
    
    // Export script info to global scope for debugging
    window.KXYZ_YT_DOWNLOAD_SCRIPT = SCRIPT_INFO;

})();