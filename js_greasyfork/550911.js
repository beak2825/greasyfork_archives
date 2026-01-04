// ==UserScript==
// @name         WhatsLink Magnet Auto-Update
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-update magnet links from clipboard to whatslink.info
// @author       troublesis <bamboo5320@me.com>
// @license      MIT
// @match        https://whatslink.info/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550911/WhatsLink%20Magnet%20Auto-Update.user.js
// @updateURL https://update.greasyfork.org/scripts/550911/WhatsLink%20Magnet%20Auto-Update.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('WhatsLink Magnet Auto-Update script loaded');
    
    // Function to extract hash from magnet link
    function extractMagnetHash(magnetLink) {
        const regex = /magnet:\?xt=urn:btih:([a-fA-F0-9]{40}|[a-zA-Z2-7]{32})/;
        const match = magnetLink.match(regex);
        return match ? match[1].toLowerCase() : null;
    }
    
    // Function to get current input content
    function getCurrentMagnet() {
        const inputElement = document.querySelector('input.el-input__inner[placeholder*="Paste the links"]');
        return inputElement ? inputElement.value : '';
    }
    
    // Function to set input content
    function setInputContent(content) {
        const inputElement = document.querySelector('input.el-input__inner[placeholder*="Paste the links"]');
        if (inputElement) {
            console.log('Setting input content to:', content.substring(0, 50) + '...');
            inputElement.value = content;
            inputElement.focus();
            
            // Trigger multiple events to ensure the page detects the change
            const events = ['input', 'change', 'keyup', 'paste'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                inputElement.dispatchEvent(event);
            });
            
            console.log('Input content set successfully');
            return true;
        }
        console.log('Input element not found');
        return false;
    }
    
    // Enhanced toast system
    function showToast(message, type = 'info', duration = 4000) {
        const typeStyles = {
            info: { background: '#333', color: '#fff' },
            success: { background: '#4CAF50', color: '#fff' },
            error: { background: '#f44336', color: '#fff' },
            warning: { background: '#ff9800', color: '#fff' }
        };
        let container = document.getElementById("userscript-toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "userscript-toast-container";
            Object.assign(container.style, {
                position: "fixed",
                top: "20px",
                right: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                zIndex: "10000",
                pointerEvents: "none"
            });
            document.body.appendChild(container);
        }
        const toast = document.createElement("div");
        toast.textContent = message;
        Object.assign(toast.style, {
            ...typeStyles[type],
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            maxWidth: "300px",
            wordWrap: "break-word",
            opacity: "0",
            transform: "translateX(100%)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "auto"
        });
        container.appendChild(toast);
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(0)";
        });
        // Auto-remove
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);
        return toast;
    }
    
    // Store last known clipboard content
    let lastClipboardContent = '';
    let isUserActive = true;
    
    // Track user activity to enable clipboard access
    document.addEventListener('click', () => { isUserActive = true; });
    document.addEventListener('keydown', () => { isUserActive = true; });
    document.addEventListener('paste', () => { isUserActive = true; });
    
    // Function to read clipboard with better error handling
    async function getClipboardContent() {
        if (!isUserActive) {
            return lastClipboardContent;
        }
        
        try {
            // Ensure document is focused
            if (!document.hasFocus()) {
                window.focus();
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (navigator.clipboard && navigator.clipboard.readText) {
                const content = await navigator.clipboard.readText();
                lastClipboardContent = content;
                isUserActive = false; // Reset after successful read
                return content;
            }
        } catch (err) {
            console.log('Clipboard access error:', err.message);
            
            // If we had previous content and it's been less than 10 seconds, use it
            if (lastClipboardContent && Date.now() - window.lastClipboardTime < 10000) {
                return lastClipboardContent;
            }
        }
        return lastClipboardContent || '';
    }
    
    // Main monitoring function
    async function checkAndUpdate() {
        try {
            // Step 1: Get current input content
            const current_magnet = getCurrentMagnet();
            console.log('current_magnet:', current_magnet);
            
            // Step 2: Get clipboard content
            const clipboard_magnet = await getClipboardContent();
            console.log('clipboard_magnet:', clipboard_magnet);
            
            // Step 3: Check if clipboard contains magnet link
            if (clipboard_magnet.includes('magnet:?xt=urn:btih:')) {
                console.log('Magnet link detected in clipboard');
                
                // Step 4: Extract hash from clipboard magnet
                const clipboardHash = extractMagnetHash(clipboard_magnet);
                
                if (clipboardHash) {
                    // Step 5: Extract hash from current input (if it's a magnet link)
                    let currentHash = null;
                    if (current_magnet.includes('magnet:?xt=urn:btih:')) {
                        currentHash = extractMagnetHash(current_magnet);
                    }
                    
                    console.log('Clipboard hash:', clipboardHash);
                    console.log('Current hash:', currentHash);
                    
                    // Step 6: Compare hashes and update if different
                    console.log('Comparing hashes - Clipboard:', clipboardHash, 'Current:', currentHash);
                    if (clipboardHash !== currentHash) {
                        console.log('Hashes are different, updating input...');
                        const success = setInputContent(clipboard_magnet);
                        if (success) {
                            // Step 7: Auto-click the search button
                            const searchButton = document.querySelector('button.el-button[aria-disabled="false"] svg[viewBox="0 0 1024 1024"]');
                            if (searchButton) {
                                // Click the button (need to click the parent button element)
                                const buttonElement = searchButton.closest('button');
                                if (buttonElement) {
                                    setTimeout(() => {
                                        buttonElement.click();
                                        console.log('Search button clicked automatically');
                                        
                                        // Show toast after clicking
                                        showToast('Magnet Preview Updated!', 'success');
                                    }, 200); // Small delay to ensure input is fully updated
                                }
                            } else {
                                // Fallback: show toast even if button not found
                                showToast('Magnet link updated!', 'success');
                            }
                            
                            console.log('Magnet link updated successfully');
                            
                            // Store the time for clipboard tracking
                            window.lastClipboardTime = Date.now();
                        } else {
                            console.log('Failed to update input field');
                        }
                    } else {
                        console.log('Magnet hashes are the same, no update needed');
                    }
                }
            }
        } catch (error) {
            console.error('Error in checkAndUpdate:', error);
        }
    }
    
    // Wait for page to load completely
    function waitForElement() {
        const inputElement = document.querySelector('input.el-input__inner[placeholder*="Paste the links"]');
        if (inputElement) {
            console.log('Input element found, starting monitoring...');
            
            // Add paste event listener to the input field
            inputElement.addEventListener('paste', function(e) {
                // Remove paste notification - only show when auto-updated
            });
            
            // Start monitoring every second
            setInterval(checkAndUpdate, 1000);
        } else {
            console.log('Input element not found, retrying in 1 second...');
            setTimeout(waitForElement, 1000);
        }
    }
    
    // Start the script
    waitForElement();
    
})();