// ==UserScript==
// @name         DR Sale Rate and Oz Overlay (Auto-buy, Always-on Overlay)
// @namespace    https://dr.hawkward.com/
// @version      2.1
// @description  Overlay with persistent stats and auto-buy logic for QuickBuySummary page
// @match        https://dr.hawkward.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556435/DR%20Sale%20Rate%20and%20Oz%20Overlay%20%28Auto-buy%2C%20Always-on%20Overlay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556435/DR%20Sale%20Rate%20and%20Oz%20Overlay%20%28Auto-buy%2C%20Always-on%20Overlay%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;
    let autoActive = false;
    //showOverlay();

    // Only initialize stage if not set yet
    if (!localStorage.getItem('buy_drugs_stage')) {
        localStorage.setItem('buy_drugs_stage', '5');
    }

    // Extraction from DOM for current page
    function extractSaleRate() {
        const bodyText = document.body.innerText;
        const match = bodyText.match(/Public Sale Rate\s*:?[\s\S]*?([\d,.]+) oz/i);
        if (match && match[1]) {
            localStorage.setItem('dr_public_sale_rate', match[1]);
            return match[1];
        }
        return localStorage.getItem('dr_public_sale_rate') || 0;
    }

    function extractTotalOz() {
        const bodyText = document.body.innerText;
        const match = bodyText.match(/Total Ounces\s*:?[\s\S]*?([\d,.]+) oz/i);
        if (match && match[1]) {
            localStorage.setItem('dr_total_ounces', match[1]);
            return match[1];
        }
        return localStorage.getItem('dr_total_ounces') || 999999;
    }

    function showOverlay(saleRate, totalOz, lastRun, logBox) {
        let overlay = document.getElementById('dr_overlay_box');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'dr_overlay_box';
            overlay.style.position = 'fixed';
            overlay.style.bottom = '20px';
            overlay.style.left = '20px';
            overlay.style.zIndex = '10000';
            overlay.style.background = 'rgba(30,30,30,0.95)';
            overlay.style.color = '#fff';
            overlay.style.padding = '12px 18px';
            overlay.style.borderRadius = '8px';
            overlay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            overlay.style.fontSize = '15px';
            overlay.style.minWidth = '240px';
            overlay.style.fontFamily = 'Arial,sans-serif';
            document.body.appendChild(overlay);

            overlay.innerHTML = `
        <div style="margin-bottom:10px;">
            <strong>Last Ran:</strong> ${lastRun}
            <button id="dr_go_btn" style="background:#28a745;color:#fff;border:none;padding:3px 14px;margin-left:7px;border-radius:5px;opacity:${autoActive ? 0.5 : 1};cursor:${autoActive ? 'not-allowed' : 'pointer'};" ${autoActive ? 'disabled' : ''}>Go</button>
            <button id="dr_stop_btn" style="background:#dc3545;color:#fff;border:none;padding:3px 14px;margin-left:6px;border-radius:5px;opacity:${autoActive ? 0.5 : 1};cursor:${autoActive ? 'not-allowed' : 'pointer'};" ${autoActive ? 'disabled' : ''}>Stop</button>
        </div>
        <strong>Public Sale Rate:</strong> ${saleRate}<br>
        <strong>Total Ounces:</strong> ${totalOz}<br>
        <strong>Buy Drug Stage:</strong> ${localStorage.getItem('buy_drugs_stage')}
        <textarea id="dr_overlay_log" style="
        width: 100%;
        min-height: 60px;
        max-height: 120px;
        margin-bottom: 10px;
        resize: vertical;
        font-size: 12px;
        background: #222;
        color: #fff;
        border-radius: 5px;
        border: 1px solid #444;
        padding: 5px;
        box-sizing: border-box;
        overflow:auto;
    " readonly>${logBox}</textarea>
        `;
            document.getElementById('dr_go_btn').onclick = startAutoMode;
            document.getElementById('dr_stop_btn').onclick = stopAutoMode;
        }

        //document.getElementById('dr_log_test').onclick = dr_log_test;
    }

    function prependOverlayLog(text) {
        const logBox = document.getElementById('dr_overlay_log');
        if (logBox) {
            logBox.value = text + "\n" + logBox.value;
        }
    }

    function dr_log_test() {
        //<button id="dr_log_test" style="background:#28a745;color:#fff;border:none;padding:3px 14px;margin-left:7px;border-radius:5px;">Log</button>
        console.log(localStorage.getItem('buy_drugs_stage'));
    }

    function runComparison() {
        prependOverlayLog('Initiating spikes credit card');
        const lastRun = new Date().toLocaleString();
        let saleRate = localStorage.getItem('dr_public_sale_rate') || 0;
        let totalOz = localStorage.getItem('dr_total_ounces') || 999999;


        if (window.location.pathname.includes('playerprofile.cfm')) {
            saleRate = extractSaleRate();
        }
        if (window.location.pathname.includes('myInventory.cfm')) {
            totalOz = extractTotalOz();
        }


        const now = new Date();
        const minute = now.getMinutes();

        // Skip if minute is between 20 and 30 (inclusive)
        /*if (minute >= 20 && minute <= 29) {
            prependOverlayLog('Between :20 and :29, stop nerd');
            return;
        }
        // Skip if minute is between 40 and 59 or 0 and 10 (inclusive)
        if ((minute >= 40 && minute <= 59) || (minute >= 0 && minute <= 9)) {
            prependOverlayLog('Between :40 and :09, stop nerd');
            return;
        }*/
        /*
prependOverlayLog('111');
        if( isNaN(parseFloat(saleRateNum)) ){ //we need to update ps rate
            prependOverlayLog('222');
                // Wait for possible page update/loading
                setTimeout(() => {
                    let profileLink = document.querySelector('a[href*="playerprofile.cfm"]');

                    if (profileLink) {
                        prependOverlayLog('lets go home real quick');
                        let profileUrl = profileLink.href; // Full link, including ?playerid, ?key, etc.
                        window.location.href = profileUrl;
                        localStorage.setItem('buy_drugs_stage', '6');
                        saleRate = extractSaleRate();
                    }
                }, 500); // Adjust timeout as needed for your page reload speed
        }
        if( isNaN(parseFloat(totalOzNum)) ){ //we need to update total oz
            prependOverlayLog('333');
                // Wait for possible page update/loading
                setTimeout(() => {
                    prependOverlayLog('let me check my pockets');
                    window.location.href = "https://dr.hawkward.com/myInventory.cfm";
                    localStorage.setItem('buy_drugs_stage', '7');
                    totalOz = extractTotalOz();
                }, 500); // Adjust timeout as needed for your page reload speed
        }
prependOverlayLog('444');
*/


        //const saleRateNum = parseFloat((saleRate+"").replace(/[,]/g,""));
        //const totalOzNum = parseFloat((totalOz+"").replace(/[,]/g,""));

        // Only redirect if we're not already on the buy page and criteria met
        if ( !isNaN(parseFloat(saleRate)) && !isNaN(parseFloat(totalOz)) && saleRate > totalOz ){
            prependOverlayLog('Calcing drugs needed');
            // Step 1: Move to QuickBuySummary if needed
            if( localStorage.getItem('buy_drugs_stage') === '0' && window.location.pathname !== '/QuickBuySummary.cfm' ){
                prependOverlayLog('Traveling to dealer');
                localStorage.setItem('buy_drugs_stage', '1');
                window.location.href = "https://dr.hawkward.com/QuickBuySummary.cfm?Sort=Quality&QB=N";
                return;
            }
            // Step 2: On QuickBuySummary page, look for best Buy Now!
            if( localStorage.getItem('buy_drugs_stage') === '1' && window.location.pathname === '/QuickBuySummary.cfm' ){
                prependOverlayLog('Knocking on dealers door');
                localStorage.setItem('buy_drugs_stage', '2');
                setTimeout(() => {
                    const rows = Array.from(document.querySelectorAll('table tr'));
                    for (let row of rows) {
                        const cells = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
                        if (cells.length >= 7 && cells[6] === "$2.00") {
                            const buyLink = row.querySelector('a[href*="QuickBuy.cfm"]');
                            if (buyLink) {
                                prependOverlayLog('Kicking door open');
                                localStorage.setItem('buy_drugs_stage', '3');
                                window.location.href = buyLink.href;
                                return;
                            }
                        }
                    }
                }, 500); // Allow time for table to render
                return;
            }



            // Step 3 logic
            if ( localStorage.getItem('buy_drugs_stage') === '3' && window.location.pathname === '/QuickBuy.cfm' ){
                const publicSaleRate = parseFloat((localStorage.getItem('dr_public_sale_rate') || "0").replace(/,/g, ""));
                const totalOz = parseFloat((localStorage.getItem('dr_total_ounces') || "0").replace(/,/g, ""));
                if (!isNaN(publicSaleRate) && !isNaN(totalOz) && totalOz < publicSaleRate) {
                    prependOverlayLog('Door opens - I need drugs yo');
                    const diff = Math.floor(publicSaleRate - totalOz);

                    // Extract ounces available for sale from page
                    let pageText = document.body.innerText;
                    let availableMatch = pageText.match(/has\s+([\d,.]+)\s+ounces\s+for\s+sale/i);
                    let ouncesAvailable = availableMatch ? parseFloat(availableMatch[1].replace(/,/g,'')) : null;

                    //if (diff <= ouncesAvailable) {
                        // Set textbox to diff if less/equal to what is available
                        let inputBox = document.querySelector('input[type="text"]');
                        if (!inputBox) inputBox = document.querySelector('input');
                        if (inputBox) {
                            console.log(6);
                            if (diff <= ouncesAvailable) {
                                prependOverlayLog('just a few oz');
                                inputBox.value = diff;
                            } else {
                                prependOverlayLog('gimme the whole stack fool');
                                inputBox.value = ouncesAvailable;
                            }

                            let calcBtn = document.querySelector('button, input[type="submit"], input[value="Calculate Total"]');
                            if (calcBtn) {
                                prependOverlayLog('how much i owe you');
                                calcBtn.click();
                                localStorage.setItem('buy_drugs_stage', '4');
                            }
                        }
                    //} else {
                        // UKanistan
                    //}
                }
            }



            // Step 4: On QuickBuy.cfm page after clicking Calculate, click "Quickbuy These Drugs"
            if ( localStorage.getItem('buy_drugs_stage') === '4' && window.location.pathname === '/QuickBuy.cfm' ){
                // Wait for possible page update/loading
                setTimeout(() => {
                    // Find the button - text may be on a <button>, <input>, etc.
                    // Try by button text or value:
                    let quickBuyBtn = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], input')).find(el =>
                                                                                                                                              el.innerText?.trim() === "Quickbuy These Drugs" ||
                                                                                                                                              el.value?.trim() === "Quickbuy These Drugs"
                                                                                                                                             );
                    if (quickBuyBtn) {
                        prependOverlayLog('swipe spikes credit card, he needs miles points');
                        localStorage.setItem('buy_drugs_stage', '5');
                        quickBuyBtn.click();
                    }
                }, 500); // Adjust timeout as needed for your page reload speed
            }



            // Step 5: re:buy profile update
            if (
                localStorage.getItem('buy_drugs_stage') === '5'
            ) {
                // Wait for possible page update/loading
                setTimeout(() => {
                    let profileLink = document.querySelector('a[href*="playerprofile.cfm"]');

                    if (profileLink) {
                        prependOverlayLog('lets go home real quick');
                        let profileUrl = profileLink.href; // Full link, including ?playerid, ?key, etc.
                        window.location.href = profileUrl;
                        localStorage.setItem('buy_drugs_stage', '6');
                        saleRate = extractSaleRate();
                    }
                }, 500); // Adjust timeout as needed for your page reload speed
            }





            // Step 6: re:buy inv update
            if (
                localStorage.getItem('buy_drugs_stage') === '6'
            ) {
                // Wait for possible page update/loading
                setTimeout(() => {
                    prependOverlayLog('let me check my pockets');
                    window.location.href = "https://dr.hawkward.com/myInventory.cfm";
                    localStorage.setItem('buy_drugs_stage', '7');
                    totalOz = extractTotalOz();
                }, 500); // Adjust timeout as needed for your page reload speed
            }

            // Step 7: re:start
            if (localStorage.getItem('buy_drugs_stage') === '7') {
                localStorage.setItem('buy_drugs_stage', '0');
                if( localStorage.getItem('dr_public_sale_rate') > localStorage.getItem('dr_total_ounces') ){
                    prependOverlayLog('aww he we go again');
                    runComparison();
                } else {
                    prependOverlayLog('maxed out spikes cc till next grow');
                    console.log('Done buying');
                }
            }

        } else {
            prependOverlayLog('We have enough drugs');
        }
        const logBox = document.getElementById('dr_overlay_log');
        let logBox2 = 'venge big dum';
        if (logBox) {
            let logBox2 = logBox.value;
        }
        showOverlay(saleRate, totalOz, lastRun, logBox2);
    }

    function startAutoMode() {
        if (autoActive) return;
        localStorage.setItem('buy_drugs_stage', '5');
        autoActive = true;
        runComparison();
        intervalId = setTimeout(autoRerun, randomDelay());
        showOverlayText();
    }

    function stopAutoMode() {
        if (!autoActive) return;
        autoActive = false;
        if (intervalId !== null) {
            clearTimeout(intervalId);
            intervalId = null;
        }
        showOverlayText();
    }

    function showOverlayText() {
        runComparison();
    }

    function autoRerun() {
        if (!autoActive) return;
        runComparison();
        intervalId = setTimeout(autoRerun, randomDelay());
    }

    function randomDelay() {
        return (120 + Math.random() * 180) * 1000;
    }

    // Initial run, overlay always shown
    runComparison();

})();
