// ==UserScript==
// @name         Extract Users From Team (Auto-Scroll)
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  Scrapes virtualized lists by auto-scrolling (Window Support)
// @author       GNS-C4 [3960752]
// @match        https://www.torn.com/page.php?sid=competition*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558055/Extract%20Users%20From%20Team%20%28Auto-Scroll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558055/Extract%20Users%20From%20Team%20%28Auto-Scroll%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Torn Team Exporter script loaded v0.0.6");

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Abstract the scrolling logic to handle both Window and Element scrolling
    function getScroller() {
        const doc = document.documentElement;

        // 1. Priority: Check if the main window/document is scrollable
        // If the document is taller than the viewport, we assume window scrolling
        if (doc.scrollHeight > window.innerHeight) {
            console.log("Scroller Detection: Using Main Window Scroll");
            return {
                name: 'Window',
                getScrollTop: () => window.scrollY,
                getMaxScroll: () => doc.scrollHeight - window.innerHeight,
                scrollBy: (amt) => window.scrollBy(0, amt),
                scrollTo: (pos) => window.scrollTo(0, pos)
            };
        }

        // 2. Fallback: Check for internal virtual container (for smaller screens/specific layouts)
        const virtualContainer = document.querySelector('div[class*="virtualContainer"]');
        if (virtualContainer && virtualContainer.parentElement) {
             const p = virtualContainer.parentElement;
             if (p.scrollHeight > p.clientHeight) {
                 console.log("Scroller Detection: Using VirtualContainer Parent");
                 return {
                    name: 'Element',
                    getScrollTop: () => p.scrollTop,
                    getMaxScroll: () => p.scrollHeight - p.clientHeight,
                    scrollBy: (amt) => p.scrollBy({ top: amt, behavior: 'instant' }),
                    scrollTo: (pos) => { p.scrollTop = pos; }
                 };
             }
        }

        return null;
    }

    async function scrapeTeamWithScroll() {
        console.log("Starting scroll scrape...");

        const scroller = getScroller();

        if (!scroller) {
            alert("Could not detect a scroll bar on the window or the list. The list might be short enough to fit on one screen?");
            // If it fits on one screen, we might still want to scrape, but let's warn first.
        }

        const btn = document.getElementById('export-discord-btn');
        const originalText = btn.innerText;
        btn.disabled = true;
        btn.style.backgroundColor = '#555';

        const roster = {};

        // 1. Scroll to top
        if (scroller) {
            scroller.scrollTo(0);
            await wait(1000);
        }

        let previousScrollTop = -1;
        const scrollStep = 600;
        let stuckCounter = 0;
        let sameCountCounter = 0;
        let lastCount = 0;

        // Loop until we hit the bottom
        while (true) {
            // A. Scrape currently visible rows (Global search to catch everything)
            const rows = document.querySelectorAll('div[class*="dataGridRow"]');

            rows.forEach(row => {
                const link = row.querySelector('a[href*="profiles.php?XID="]');
                if (link) {
                    const urlParams = new URLSearchParams(link.href.split('?')[1]);
                    const id = urlParams.get('XID');
                    const name = link.innerText.trim();
                    if (id && name) {
                        roster[id] = name;
                    }
                }
            });

            const count = Object.keys(roster).length;
            btn.innerText = `Scanning... (${count} found)`;

            // If no scroller was found (short list), just break after one pass
            if (!scroller) {
                console.log("No scroller detected, finishing after single pass.");
                break;
            }

            // B. Check scroll metrics
            const currentScrollTop = scroller.getScrollTop();
            const maxScroll = scroller.getMaxScroll();

            console.log(`Scroll (${scroller.name}): ${Math.round(currentScrollTop)} / ${Math.round(maxScroll)} | Found: ${count}`);

            // C. Conditions to stop
            if (currentScrollTop >= maxScroll - 20) {
                console.log("Reached bottom.");
                break;
            }

            if (Math.abs(currentScrollTop - previousScrollTop) < 5 && previousScrollTop !== -1) {
                stuckCounter++;
                console.log(`Scroll stuck? Attempt ${stuckCounter}/5`);
                scroller.scrollBy(100); // Nudge
                if (stuckCounter >= 5) break;
            } else {
                stuckCounter = 0;
            }

            if (count === lastCount && count > 0) {
                sameCountCounter++;
                // If we scroll 10 times and find nobody new, we are probably done or at a footer
                if (sameCountCounter >= 10) {
                     console.log("No new users found for a while. Stopping.");
                     break;
                }
            } else {
                sameCountCounter = 0;
            }

            lastCount = count;
            previousScrollTop = currentScrollTop;

            // D. Scroll down
            scroller.scrollBy(scrollStep);

            // E. Wait for render
            await wait(600);
        }

        console.log("Scrape finished. Total unique users:", Object.keys(roster).length);

        if (Object.keys(roster).length === 0) {
            alert("No users found. Layout might have changed.");
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.backgroundColor = '#333';
            return;
        }

        // Export
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(roster));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "torn_team_roster.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '#333';
    }

    function addButton() {
        if (document.getElementById('export-discord-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'export-discord-btn';
        btn.innerText = 'Export Team for Bot';
        btn.style.position = 'fixed';
        btn.style.top = '150px';
        btn.style.right = '10px';
        btn.style.zIndex = '999999';
        btn.style.padding = '10px 20px';
        btn.style.backgroundColor = '#333';
        btn.style.color = '#fff';
        btn.style.border = '2px solid red';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.borderRadius = '5px';
        btn.style.boxShadow = '0px 0px 5px #000';

        btn.onclick = scrapeTeamWithScroll;

        document.body.appendChild(btn);
        console.log("Export button added.");
    }

    setInterval(addButton, 2000);
})();