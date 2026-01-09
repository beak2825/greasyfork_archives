// ==UserScript==
// @name         Torn Bazaar Info Injector (Personal)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Injects your personal Bazaar worth and customers into the info tab. Only shows on your own bazaar.
// @author       srsbsns
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561721/Torn%20Bazaar%20Info%20Injector%20%28Personal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561721/Torn%20Bazaar%20Info%20Injector%20%28Personal%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Get or Request API Key
    let apiKey = GM_getValue('torn_api_key');
    if (!apiKey) {
        apiKey = prompt("Please enter your Torn API Key (it will be saved for next time):", "");
        if (apiKey) {
            GM_setValue('torn_api_key', apiKey);
        } else {
            console.error("No API key provided. Script cannot run.");
            return;
        }
    }

    // 2. Main Logic
    async function runInjector() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('userId');

        // Fetch your own data to get your ID and Bazaar stats
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/user/?selections=profile,bazaar,personalstats&key=${apiKey}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (data.error) {
                        if (data.error.code === 2) { // Incorrect Key
                            alert("Invalid Torn API Key. Please refresh and check your settings.");
                            GM_setValue('torn_api_key', '');
                        }
                        return;
                    }

                    const myId = data.player_id.toString();

                    // Only proceed if we are on our own bazaar (no userId in URL)
                    // OR if the userId in the URL matches our own ID
                    if (!urlId || urlId === myId) {
                        const worth = (data.bazaar || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);
                        const customers = data.personalstats?.bazaarcustomers || 0;
                        injectData(worth, customers);
                    }
                } catch (e) {
                    console.error('Bazaar Injector Error:', e);
                }
            }
        });
    }

    function injectData(worth, customers) {
        const infoTab = document.querySelector('.messageContent___LhCmx');
        if (infoTab && !document.getElementById('torn-injected-stats')) {
            const formattedWorth = new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 0
            }).format(worth);

            const statsDiv = document.createElement('div');
            statsDiv.id = 'torn-injected-stats';
            statsDiv.style.cssText = 'margin-top: 5px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;';

            statsDiv.innerHTML = `
                <div>Listed Value: <span class="normal" style="color: #99cc00;">${formattedWorth}</span></div>
                <div>Lifetime Customers: <span class="normal" style="color: #99cc00;">${customers.toLocaleString()}</span></div>
            `;
            infoTab.appendChild(statsDiv);
        }
    }

    // Check for the UI element every 2 seconds
    const checkExist = setInterval(() => {
        if (document.querySelector('.messageContent___LhCmx')) {
            runInjector();
            clearInterval(checkExist); // Stop checking once found and run
        }
    }, 2000);

})();