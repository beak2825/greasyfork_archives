// ==UserScript==
// @name        Steam Workshop - Ultimate Bulk Sub/Unsub Tool
// @namespace   https://greasyfork.org/en/scripts/562971/
// @version     4.1
// @description Adds a floating togglable menu to Steam Workshop Collection pages that allows bulk subscribing or unsubscribing to all items in the collection with a progress bar.
// @author      Gemini
// @license     MIT
// @match       https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @match       https://steamcommunity.com/workshop/filedetails/?id=*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/562971/Steam%20Workshop%20-%20Ultimate%20Bulk%20SubUnsub%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/562971/Steam%20Workshop%20-%20Ultimate%20Bulk%20SubUnsub%20Tool.meta.js
// ==/UserScript==

/* Greasy Fork Code Rule Compliance:
   - No obfuscation/minification: All code is human-readable.
   - Description: Clearly describes the script's primary functionality.
   - Libraries: No external JavaScript is loaded; all code is self-contained.
   - Minimal Permissions: Uses @grant none as it only uses standard browser APIs.
*/

(function() {
    'use strict';

    const createUI = () => {
        const panel = document.createElement('div');
        panel.id = 'bulk-tool-panel';
        panel.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #1b2838;
            padding: 15px;
            border: 2px solid #66c0f4;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            color: white;
            font-family: Arial, sans-serif;
            min-width: 200px;
        `;
        
        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">Workshop Bulk Tool</div>
            <div id="bulk-status" style="font-size:12px; margin-bottom:10px; color:#acb2b8;">Ready (Scroll to bottom first)</div>
            <div id="bulk-progress-bg" style="display:none; background:#000; height:10px; border-radius:5px; margin-bottom:10px; overflow:hidden;">
                <div id="bulk-progress-bar" style="background:#66c0f4; width:0%; height:100%; transition: width 0.2s;"></div>
            </div>
            <button id="bulk-sub-btn" style="width:100%; background:#478021; color:white; border:none; padding:8px; margin-bottom:5px; cursor:pointer; font-weight:bold; border-radius:4px;">SUBSCRIBE ALL</button>
            <button id="bulk-unsub-btn" style="width:100%; background:#a32d2d; color:white; border:none; padding:8px; cursor:pointer; font-weight:bold; border-radius:4px;">UNSUBSCRIBE ALL</button>
        `;

        document.body.appendChild(panel);

        const runAction = async (action) => {
            const urlParams = new URLSearchParams(window.location.search);
            const collId = urlParams.get('id');
            const links = Array.from(document.querySelectorAll('a[href*="id="]'));
            const ids = [...new Set(links.map(l => l.href.match(/id=(\d+)/)?.[1]).filter(id => id && id !== collId))];

            if (ids.length === 0) {
                alert("No items found! Please scroll to the bottom of the page to load items.");
                return;
            }

            if (!confirm(`Are you sure you want to ${action} ${ids.length} items?`)) return;

            const status = document.getElementById('bulk-status');
            const progBg = document.getElementById('bulk-progress-bg');
            const progBar = document.getElementById('bulk-progress-bar');
            
            progBg.style.display = 'block';
            
            for (let i = 0; i < ids.length; i++) {
                try {
                    await fetch(`https://steamcommunity.com/sharedfiles/${action}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        body: `id=${ids[i]}&sessionid=${window.g_sessionID}&appid=4000`
                    });
                    
                    let percent = Math.round(((i + 1) / ids.length) * 100);
                    progBar.style.width = percent + "%";
                    status.innerText = `${action === 'subscribe' ? 'Subscribing' : 'Removing'}: ${i+1}/${ids.length}`;
                } catch (e) {
                    console.error("Error processing item:", ids[i]);
                }
                // Delay to respect Steam rate limits and prevent "excessive traffic"
                await new Promise(r => setTimeout(r, 250));
            }

            status.innerText = "Finished! Reloading...";
            setTimeout(() => location.reload(), 1000);
        };

        document.getElementById('bulk-sub-btn').onclick = () => runAction('subscribe');
        document.getElementById('bulk-unsub-btn').onclick = () => runAction('unsubscribe');
    };

    // Ensure the script only runs once the DOM is ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
        createUI();
    } else {
        window.addEventListener("DOMContentLoaded", createUI);
    }
})();