// ==UserScript==
// @name         Fix Mangapark Image Loading Issue (Lightweight)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Click an image to replace its prefix. | Auto-loads the recommended image source server.
// @match        https://mangapark.io/title/*-chapter-*
// @match        https://mangapark.io/title/*-ch-*
// @match        https://mangapark.io/title/*-prologue
// @match        https://mangapark.io/title/*-oneshot
// @match        https://mangapark.net/title/*-chapter-*
// @match        https://mangapark.net/title/*-ch-*
// @match        https://mangapark.net/title/*-prologue
// @match        https://mangapark.net/title/*-oneshot
// @match        https://mpark.to/title/*-chapter-*
// @match        https://mpark.to/title/*-ch-*
// @match        https://mpark.to/title/*-prologue
// @match        https://mpark.to/title/*-oneshot
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557952/Fix%20Mangapark%20Image%20Loading%20Issue%20%28Lightweight%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557952/Fix%20Mangapark%20Image%20Loading%20Issue%20%28Lightweight%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- CONFIGURATION ---
    // Default target server. Set to 'default' to use the site's main domain (like Script 2)
    let targetServer = '04';

    // Detects s00-s10 subdomains (matches https://s01. or //s01.)
    const SERVER_REGEX = /(\/\/|https?:\/\/)s(\d{2})\./i;

    // --- CORE LOGIC ---

    function replaceUrl(url) {
        // Logic A: If target is 'default', use Script 2's logic (strip subdomain)
        if (targetServer === 'default') {
            try {
                const urlObj = new URL(url, window.location.href);
                return window.location.origin + urlObj.pathname;
            } catch (e) { return url; }
        }

        // Logic B: If target is a number (e.g., '04'), swap the server number
        // This regex captures the protocol part (// or https://) and replaces the number
        return url.replace(SERVER_REGEX, (match, protocol) => {
            return protocol + 's' + targetServer + '.';
        });
    }

    function fixSingleImage(img) {
        if (!img.src || !SERVER_REGEX.test(img.src)) return false;

        const oldSrc = img.src;
        const newSrc = replaceUrl(oldSrc);

        if (oldSrc !== newSrc) {
            img.src = newSrc;
            console.log(`[IntelliFix] ${oldSrc.substring(0, 40)}... → s${targetServer}`);
            return true;
        }
        return false;
    }

    function runGlobalFix() {
        const images = document.querySelectorAll('img[src]');
        let fixedCount = 0;
        images.forEach(img => {
            if (fixSingleImage(img)) fixedCount++;
        });
        console.log(`[IntelliFix] Scan complete. Fixed: ${fixedCount}`);
        return fixedCount;
    }

    // --- OBSERVER ---
    function startObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'IMG') fixSingleImage(node);
                        if (node.querySelectorAll) {
                            node.querySelectorAll('img[src]').forEach(fixSingleImage);
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- UI CONTROLS ---
    function addIntelliControls() {
        // Check for controls container (Wait for rightPanel or create fallback)
        const checkInterval = setInterval(() => {
            // Look for global rightPanel variable OR an element with ID rightPanel
            let panel = (typeof rightPanel !== 'undefined') ? rightPanel : document.getElementById('rightPanel');

            // If not found, try to find a likely place or create a floating widget
            if (!panel) {
                createFloatingWidget();
                clearInterval(checkInterval);
                return;
            }

            // Check if controls already exist
            if (panel.querySelector('#intelli-server-select')) {
                clearInterval(checkInterval);
                return;
            }

            // Append to existing panel
            appendControls(panel);
            clearInterval(checkInterval);

        }, 500);
    }

    function appendControls(container) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: flex; align-items: center; margin: 5px 0; padding: 5px; background: #222; border-radius: 4px;';

        // Label
        const label = document.createElement('span');
        label.textContent = 'Img Server:';
        label.style.cssText = 'color: #aaa; font-size: 11px; margin-right: 5px;';

        // Select
        const select = document.createElement('select');
        select.id = 'intelli-server-select';
        select.style.cssText = 'background: #333; color: white; border: 1px solid #555; padding: 2px;';

        // Options: 01-10 plus 'Default' (Script 2 style)
        const servers = ['default', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
        servers.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s === 'default' ? 'Main Domain' : 's' + s;
            if (s === targetServer) opt.selected = true;
            select.appendChild(opt);
        });

        select.onchange = function() {
            targetServer = this.value;
            console.log(`[IntelliFix] Target changed to: ${targetServer}`);
            runGlobalFix(); // Immediately apply changes
        };

        // Fix Button
        const btn = document.createElement('button');
        btn.textContent = 'Force Fix';
        btn.style.cssText = 'background: #ffaa00; border: none; padding: 2px 6px; cursor: pointer; font-weight: bold; margin-left: 5px;';
        btn.onclick = runGlobalFix;

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        wrapper.appendChild(btn);
        container.appendChild(wrapper);
    }

    // Fallback: Creates a draggable floating widget if rightPanel doesn't exist
    function createFloatingWidget() {
        const widget = document.createElement('div');
        widget.id = 'intelli-float-widget';
        widget.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 99999; background: rgba(0,0,0,0.8); padding: 10px; border: 1px solid #555; border-radius: 5px; font-family: sans-serif; font-size: 12px; color: white; box-shadow: 0 0 10px black;';

        // Close button
        const close = document.createElement('span');
        close.innerHTML = '&times;';
        close.style.cssText = 'float: right; cursor: pointer; margin-left: 10px;';
        close.onclick = () => widget.remove();

        const title = document.createElement('strong');
        title.textContent = 'IntelliFix Control';

        widget.appendChild(close);
        widget.appendChild(title);

        // Append controls to this widget instead of rightPanel
        appendControls(widget);
        document.body.appendChild(widget);
    }

    // --- INITIALIZATION ---
    function init() {
        console.log('[IntelliFix] Loaded.');
        // Initial pass
        setTimeout(runGlobalFix, 500);
        startObserver();
        addIntelliControls();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();