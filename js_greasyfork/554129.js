// ==UserScript==
// @name         Faction Inactivity + Legible Names Combo
// @namespace    https://www.torn.com/profiles.php?XID=1936821
// @version      1.6.1
// @description  Highlight inactive faction members + better player name visibility
// @author       TheFoxMan [1936821] + Nova
// @match        https://www.torn.com/*
// @run-at       document-end
// @license      Apache License 2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554129/Faction%20Inactivity%20%2B%20Legible%20Names%20Combo.user.js
// @updateURL https://update.greasyfork.org/scripts/554129/Faction%20Inactivity%20%2B%20Legible%20Names%20Combo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //////////////////////////////////////////////////////////////////////
    // PART 1 — FACTION INACTIVITY HIGHLIGHT (TheFoxMan's Working Version)
    //////////////////////////////////////////////////////////////////////

    // PUT YOUR ACTUAL API KEY HERE (Replace ###PDA-APIKEY### with your key)
    const APIKEY = "###PDA-APIKEY###";
    const APICOMMENT = "FactionLastAction";

    const activityHighlights = [
        [1, 1, "#FFFFFF80"],
        [2, 4, "#ff990080"],
        [5, 6, "#FF000080"],
        [7, 999, "#cc00ff80"]
    ];

    // Define find helpers if they don't exist
    if (!document.find) {
        Object.defineProperties(Document.prototype, {
            find: {
                value(selector) {
                    return document.querySelector(selector);
                },
                enumerable: false
            },
            findAll: {
                value(selector) {
                    return document.querySelectorAll(selector);
                },
                enumerable: false
            }
        });
    }

    if (!Element.prototype.find) {
        Object.defineProperties(Element.prototype, {
            find: {
                value(selector) {
                    return this.querySelector(selector);
                },
                enumerable: false
            },
            findAll: {
                value(selector) {
                    return this.querySelectorAll(selector);
                },
                enumerable: false
            }
        });
    }

    async function waitFor(sel, parent = document) {
        return new Promise((resolve) => {
            const intervalID = setInterval(() => {
                const el = parent.find(sel);
                if (el) {
                    resolve(el);
                    clearInterval(intervalID);
                }
            }, 500);
        });
    }

    // Add styles for faction inactivity
    document.head.insertAdjacentHTML(
        "beforeend",
        `<style>
            .faction-info-wrap .members-list .table-body > li::after {
                display: block;
                content: attr(data-last-action);
                color: #fff;
                font-size: 11px;
                margin-top: 2px;
                opacity: 0.9;
            }
        </style>`
    );

    // Check if we should run the faction script
    function shouldRunFactionScript() {
        const url = window.location.href;
        return url.includes("factions.php") && 
               (url.includes("step=your") || url.includes("step=profile"));
    }

    async function showLastAction() {
        try {
            // Wait for the faction members list
            await waitFor(".faction-info-wrap .members-list .table-body");

            // Check if already processed
            if (document.find(".faction-info-wrap .members-list .table-body > li[data-last-action]")) {
                return;
            }

            // Get faction ID from the view-wars link
            const viewWarsLink = document.find("#view-wars");
            let factionID = null;
            
            if (viewWarsLink && viewWarsLink.parentElement) {
                const href = viewWarsLink.parentElement.getAttribute("href");
                if (href) {
                    const match = href.match(/\d+/);
                    factionID = match ? match[0] : null;
                }
            }

            // Fetch faction data
            const apiUrl = `https://api.torn.com/faction/${factionID || ""}?selections=basic&key=${APIKEY}&comment=${APICOMMENT}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Process each member row
            document.findAll(".faction-info-wrap .members-list .table-body > li").forEach((row) => {
                try {
                    const profileLink = row.find("a[href*='profiles.php']");
                    if (!profileLink) return;
                    
                    const profileID = parseInt(profileLink.getAttribute("href").split("XID=")[1]);
                    
                    if (!data.members || !data.members[profileID]) return;

                    // Add last action data
                    row.setAttribute("data-last-action", data.members[profileID].last_action.relative);

                    // Calculate days inactive
                    const numberOfDays = Math.floor((Date.now() / 1000 - data.members[profileID].last_action.timestamp) / (24 * 60 * 60));

                    // Apply highlight color
                    let color = null;
                    activityHighlights.forEach((rule) => {
                        if (rule[0] <= numberOfDays && numberOfDays <= rule[1]) {
                            color = rule[2];
                        }
                    });

                    if (color) {
                        row.style.backgroundColor = color;
                    }
                    
                } catch (e) {
                    console.error("Error processing member row:", e);
                }
            });

            console.log("[Faction Inactivity] Processed faction members");
            
        } catch (error) {
            console.error("[Faction Inactivity] Error:", error);
        }
    }

    // Initialize faction script
    (function initFactionScript() {
        if (shouldRunFactionScript()) {
            // Initial run
            setTimeout(showLastAction, 1000);
            
            // Listen for hash changes (Torn's navigation)
            window.addEventListener("hashchange", () => {
                if (shouldRunFactionScript()) {
                    setTimeout(showLastAction, 500);
                }
            });
        }
    })();

    //////////////////////////////////////////////////////////////////////
    // PART 2 — MORE LEGIBLE PLAYER NAMES
    //////////////////////////////////////////////////////////////////////

    // Load the Manrope font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Add styles for legible names
    const style = document.createElement('style');
    style.textContent = `
        .custom-honor-text {
            font-family: 'Manrope', sans-serif !important;
            font-weight: 700 !important;
            font-size: 12px !important;
            color: white !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            pointer-events: none !important;
            position: absolute !important;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100% !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            z-index: 10 !important;
        }
        .honor-text-svg { 
            display: none !important; 
        }
        
        /* Text outline classes */
        .outline-black { 
            text-shadow: 
                -1px -1px 0 #000, 
                1px -1px 0 #000, 
                -1px 1px 0 #000, 
                1px 1px 0 #000 !important; 
        }
        .outline-blue { 
            text-shadow: 
                -1px -1px 0 #310AF5, 
                1px -1px 0 #310AF5, 
                -1px 1px 0 #310AF5, 
                1px 1px 0 #310AF5 !important; 
        }
        .outline-red { 
            text-shadow: 
                -1px -1px 0 #ff4d4d, 
                1px -1px 0 #ff4d4d, 
                -1px 1px 0 #ff4d4d, 
                1px 1px 0 #ff4d4d !important; 
        }
        .outline-green { 
            text-shadow: 
                -1px -1px 0 #3B9932, 
                1px -1px 0 #3B9932, 
                -1px 1px 0 #3B9932, 
                1px 1px 0 #3B9932 !important; 
        }
        .outline-orange { 
            text-shadow: 
                -1px -1px 0 #ff9c40, 
                1px -1px 0 #ff9c40, 
                -1px 1px 0 #ff9c40, 
                1px 1px 0 #ff9c40 !important; 
        }
        .outline-purple { 
            text-shadow: 
                -1px -1px 0 #c080ff, 
                1px -1px 0 #c080ff, 
                -1px 1px 0 #c080ff, 
                1px 1px 0 #c080ff !important; 
        }
    `;
    document.head.appendChild(style);

    // Determine which outline class to use
    function getOutlineClass(wrap) {
        if (wrap.classList.contains('admin')) return 'outline-red';
        if (wrap.classList.contains('officer')) return 'outline-green';
        if (wrap.classList.contains('moderator')) return 'outline-orange';
        if (wrap.classList.contains('helper')) return 'outline-purple';
        if (wrap.classList.contains('blue')) return 'outline-blue';
        return 'outline-black';
    }

    // Replace the SVG text with custom HTML text
    function replaceHonorText() {
        document.querySelectorAll('.honor-text-wrap').forEach(wrap => {
            // Hide the SVG
            const sprite = wrap.querySelector('.honor-text-svg');
            if (sprite) {
                sprite.style.display = 'none';
            }
            
            // Skip if already has custom text
            if (wrap.querySelector('.custom-honor-text')) return;
            
            // Get the player name
            const text = wrap.getAttribute('data-title') || 
                        wrap.getAttribute('aria-label') || 
                        wrap.textContent || '';
            
            const cleaned = text.trim().toUpperCase();
            if (!cleaned) return;
            
            // Create the custom text element
            const div = document.createElement('div');
            div.className = `custom-honor-text ${getOutlineClass(wrap)}`;
            div.textContent = cleaned;
            
            wrap.appendChild(div);
        });
    }

    // Initial replacement
    replaceHonorText();
    
    // Watch for dynamic content
    const observer = new MutationObserver(replaceHonorText);
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("[Legible Player Names] Loaded");

})();