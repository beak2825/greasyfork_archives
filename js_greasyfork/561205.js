// ==UserScript==
// @name         Bypass Oii.la Pahe
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Bypasses oii.la restrictions, extracts destination URL from hidden tokens, and redirects automatically with fallback protection.
// @author       Artphoney
// @match        https://oii.la/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561205/Bypass%20Oiila%20Pahe.user.js
// @updateURL https://update.greasyfork.org/scripts/561205/Bypass%20Oiila%20Pahe.meta.js
// ==/UserScript==

/**
 * @creator Artphoney
 * @created 2026-01-03
 * @version v2.0.0
 * @description Professional Tampermonkey script to bypass oii.la restrictions. Verified working on Mozilla Firefox with Tampermonkey.
 */

(function() {
    'use strict';

    // === Configuration ===
    const CONFIG = {
        autoRedirect: GM_getValue('autoRedirect', true),
        redirectDelay: 500, // Reduced to 500ms for faster UX
        maxRetries: 10,
        retryInterval: 500,
        debug: true
    };

    // === Logger Utility ===
    const Logger = {
        log: (msg) => CONFIG.debug && console.log(`%c[BypassPahe] ${msg}`, 'color: #00bcd4; font-weight: bold;'),
        error: (msg) => console.error(`%c[BypassPahe Error] ${msg}`, 'color: #f44336; font-weight: bold;'),
        success: (msg) => console.log(`%c[BypassPahe Success] ${msg}`, 'color: #4caf50; font-weight: bold;')
    };

    // === UI Utility ===
    const UI = {
        overlay: null,
        
        create() {
            if (this.overlay) return;
            const div = document.createElement('div');
            div.id = 'oii-bypass-overlay';
            div.innerHTML = `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; display: flex; align-items: center; gap: 10px;">
                    <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #00bcd4; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite;"></div>
                    <span id="oii-status-text">Scanning for destination...</span>
                </div>
                <style>
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    #oii-bypass-overlay {
                        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
                        background: rgba(33, 33, 33, 0.95); color: #fff;
                        padding: 12px 20px; border-radius: 8px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                        font-size: 14px; backdrop-filter: blur(5px);
                        border-left: 4px solid #00bcd4; transition: all 0.3s ease;
                    }
                </style>
            `;
            document.documentElement.appendChild(div);
            this.overlay = div;
        },

        update(msg, type = 'info') {
            if (!this.overlay) this.create();
            const textEl = document.getElementById('oii-status-text');
            const container = document.getElementById('oii-bypass-overlay');
            if (textEl) textEl.textContent = msg;
            
            if (type === 'success') {
                container.style.borderLeftColor = '#4caf50';
                const spinner = container.querySelector('.spinner');
                if (spinner) spinner.style.display = 'none';
            } else if (type === 'error') {
                container.style.borderLeftColor = '#f44336';
                const spinner = container.querySelector('.spinner');
                if (spinner) spinner.style.display = 'none';
            }
        }
    };

    // === Core Logic ===
    const Core = {
        decodeBase64(str) {
            try {
                return atob(str);
            } catch (e) {
                Logger.error('Base64 decode failed');
                return null;
            }
        },

        extractFromToken() {
            const tokenInput = document.querySelector('input[name="token"]');
            if (!tokenInput || !tokenInput.value) return null;
            
            Logger.log('Token input found, analyzing...');
            // Regex to find Base64 string starting with 'https' (aHR0cHM) or 'http' (YUhSMG)
            const match = tokenInput.value.match(/((?:aHR0cHM6|YUhSMG)[a-zA-Z0-9+/=]+)/);
            
            if (match && match[1]) {
                const decoded = this.decodeBase64(match[1]);
                if (decoded && decoded.startsWith('http')) {
                    return decoded;
                }
            }
            return null;
        },

        extractFromScripts() {
            // Fallback: Check all script tags for typical variable names
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                if (script.textContent) {
                    const match = script.textContent.match(/window\.location\.href\s*=\s*['"](.*?)['"]/);
                    if (match && match[1]) return match[1];
                }
            }
            return null;
        },

        redirect(url) {
            Logger.success(`Redirecting to: ${url}`);
            UI.update(`Redirecting to ${new URL(url).hostname}...`, 'success');
            
            if (CONFIG.autoRedirect) {
                setTimeout(() => {
                    window.location.href = url;
                }, CONFIG.redirectDelay);
            } else {
                UI.update(`Click to Open: ${url}`, 'success');
                this.overlay.onclick = () => window.open(url, '_blank');
                this.overlay.style.cursor = 'pointer';
            }
        },

        scan() {
            Logger.log('Scanning page...');
            
            // Strategy 1: Hidden Token (Most reliable for oii.la)
            let url = this.extractFromToken();
            
            // Strategy 2: Script Analysis (Fallback)
            if (!url) url = this.extractFromScripts();

            if (url) {
                this.redirect(url);
                return true;
            }
            return false;
        },

        init() {
            UI.create();
            
            // Initial Scan
            if (this.scan()) return;

            // If not found immediately, observe DOM changes (for dynamic loading)
            let retries = 0;
            const observer = new MutationObserver((mutations, obs) => {
                if (this.scan()) {
                    obs.disconnect();
                } else {
                    retries++;
                    if (retries > CONFIG.maxRetries) {
                        obs.disconnect();
                        Logger.error('Max retries reached. URL not found.');
                        UI.update('Bypass Failed: URL not found', 'error');
                        
                        // Fallback: Attempt to submit form if it exists as last resort?
                        // Usually risky, better to stop and let user handle.
                    }
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
            
            // Also retry on window load just in case
            window.addEventListener('load', () => {
                if (!this.scan()) {
                    setTimeout(() => this.scan(), 1000); // One final delayed check
                }
            });
        }
    };

    // === Menu Commands ===
    GM_registerMenuCommand(`Toggle Auto Redirect (${CONFIG.autoRedirect ? 'ON' : 'OFF'})`, () => {
        GM_setValue('autoRedirect', !CONFIG.autoRedirect);
        location.reload();
    });

    // Start
    Core.init();

})();
