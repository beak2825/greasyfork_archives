// ==UserScript==
// @name         Quick lookup (Refactored)
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  Adds buttons to Torn user profile page to display user information using the Torn API.
// @author       Omanpx [1906686] (Refactored by Gemini)
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @match        https://www.torn.com/profiles.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/552711/Quick%20lookup%20%28Refactored%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552711/Quick%20lookup%20%28Refactored%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const period = 30; // Days for stat comparison

    /**
     * Asynchronously gets the API key.
     * It first checks localStorage. If not found, it prompts the user.
     * @returns {Promise<string|null>} The API key or null if the user cancels.
     */
    const getApiKey = async () => {
        let apiKey = localStorage.getItem('tornApiKey');
        if (!apiKey) {
            const {
                value: newApiKey
            } = await Swal.fire({
                title: 'Enter your Torn API Key',
                input: 'text',
                inputLabel: 'Your API key is needed for this script to work.',
                inputPlaceholder: 'Enter your API key here',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to provide an API key!'
                    }
                }
            });

            if (newApiKey) {
                localStorage.setItem('tornApiKey', newApiKey);
                apiKey = newApiKey;
            }
        }
        return apiKey;
    };

    /**
     * Fetches user data from two API endpoints and displays it in a formatted table.
     * @param {string} apiKey - The Torn API key.
     */
    const getUserInfo = (apiKey) => {
        const userUrl = document.URL.split('=');
        const userID = userUrl[userUrl.length - 1];
        const ts = Math.floor(Date.now() / 1000) - 86400 * period;

        const url1 = `https://api.torn.com/user/${userID}?selections=profile,personalstats&key=${apiKey}`;
        const url2 = `https://api.torn.com/user/${userID}?selections=personalstats&stat=xantaken,useractivity,refills,attackswon,alcoholused,energydrinkused,rankedwarhits,attacksassisted,statenhancersused,boostersused&timestamp=${ts}&key=${apiKey}`;
        const url3 = `https://api.torn.com/v2/user/${userID}/hof?key=${apiKey}`;

        // Show a loading indicator
        Swal.fire({
            title: 'Fetching Data...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        GM_xmlhttpRequest({
            method: 'GET',
            url: url1,
            onload: function(response1) {
                const user1 = JSON.parse(response1.responseText);
                if (user1.error) {
                    Swal.fire('Error', `API Error: ${user1.error.error}`, 'error');
                    return;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url2,
                    onload: function(response2) {
                        const user2 = JSON.parse(response2.responseText);
                        if (user2.error) {
                            Swal.fire('Error', `API Error: ${user2.error.error}`, 'error');
                            return;
                        }

                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: url3,
                            onload: function(response2) {
                                const hof = JSON.parse(response2.responseText);
                                if (hof.error) {
                                    Swal.fire('Error', `API Error: ${hof.error.error}`, 'error');
                                    return;
                                }

                        // Display the data in a formatted table
                        displayUserData(user1, user2, hof, userID);
                    }
                   });
                   }
                });
            }
        });
    };

    /**
     * Generates HTML tables and displays them using SweetAlert.
     * @param {object} currentUser - The user data from the first API call.
     * @param {object} historicalUser - The user data from the second (historical) API call.
     * @param {string} userID - The user's Torn ID.
     */
    const displayUserData = (currentUser, historicalUser, hof, userID) => {
        const createStatRow = (statName, statKey) => {
            const current = currentUser.personalstats[statKey] || 0;
            const historical = historicalUser.personalstats[statKey] || 0;
            const diff = current - historical;
            const dailyAvg = (diff / period).toFixed(2);
            return `<tr><td>${statName}</td><td>${diff.toLocaleString()}</td><td>${dailyAvg}</td><td>${current.toLocaleString()}</td></tr>`;
        };

        const activityHoursCurrent = (currentUser.personalstats.useractivity / 3600);
        const activityHoursHistorical = (historicalUser.personalstats.useractivity / 3600);
        const activityDiff = activityHoursCurrent - activityHoursHistorical;
        const activityDailyAvg = (activityDiff / period).toFixed(2);

        const dailyXanax = ((currentUser.personalstats.xantaken || 0) - (historicalUser.personalstats.xantaken || 0)) / period;
        const dailyRefills = ((currentUser.personalstats.refills || 0) - (historicalUser.personalstats.refills || 0)) / period;
        const extraEnergy = (dailyXanax * 250) + (dailyRefills * 150);


        const htmlContent = `
            <style>
                .lookup-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; margin-bottom: 20px; background-color: #333; }
                .lookup-table th, .lookup-table td { padding: 8px; border: 1px solid #444; }
                .lookup-table th { background-color: #333; color: #fff; }
                .lookup-table td { background-color: #333; color: #fff; }
                .lookup-table td:first-child { font-weight: bold;  }
                .swal2-html-container { text-align: left !important; background-color: #333; }
                h3.swal-title { font-size: 1.2em; text-align: center; color: #fff; margin-bottom: 10px; background-color: #333; }
            </style>
            <h3 class="swal-title">General Info</h3>
            <table class="lookup-table">
                <tr><td>Name</td><td>${currentUser.name} [${userID}]</td></tr>
                <tr><td>Level</td><td>${currentUser.level}</td></tr>
                <tr><td>Property</td><td>${currentUser.property}</td></tr>
                <tr><td>Donator</td><td>${currentUser.donator ? 'Yes' : 'No'}</td></tr>
                <tr><td>Age</td><td>${currentUser.age.toLocaleString()}</td></tr>
                <tr><td>Friends / Enemies</td><td>${currentUser.friends} / ${currentUser.enemies}</td></tr>
                <tr><td>Posts / Karma</td><td>${currentUser.forum_posts.toLocaleString()} / ${currentUser.karma.toLocaleString()}</td></tr>
                <tr><td>Extra daily E</td><td>${extraEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td></tr>
                <tr><td>Working Stats</td><td>${(hof.hof?.working_stats?.value || 0).toLocaleString()}</td></tr>
            </table>

            <h3 class="swal-title">Stats (Last ${period} Days)</h3>
            <table class="lookup-table">
                <thead>
                    <tr><th>Stat</th><th>Period</th><th>Daily Avg</th><th>Lifetime</th></tr>
                </thead>
                <tbody>
                    ${createStatRow('Xanax Taken', 'xantaken')}
                    ${createStatRow('Energy Refills', 'refills')}
                    ${createStatRow('E-cans Used', 'energydrinkused')}
                    ${createStatRow('Boosters Used', 'boostersused')}
                    ${createStatRow('SEs Used', 'statenhancersused')}
                     <tr><td>Activity (hours)</td><td>${activityDiff.toFixed(2)}</td><td>${activityDailyAvg}</td><td>${activityHoursCurrent.toFixed(2)}</td></tr>
                    ${createStatRow('Attacks Won', 'attackswon')}
                    ${createStatRow('Attacks Assisted', 'attacksassisted')}
                    ${createStatRow('Ranked War Hits', 'rankedwarhits')}
                    ${createStatRow('Alcohol Used', 'alcoholused')}
                </tbody>
            </table>
        `;

        Swal.fire({
            title: `Quick Lookup for ${currentUser.name}`,
            html: htmlContent,
            width: '600px',
        });
    };


    /**
     * Fetches a user's Discord ID and opens their profile in a new tab.
     * @param {string} apiKey - The Torn API key.
     */
    const openDiscord = (apiKey) => {
        const userUrl = document.URL.split('=');
        const userID = userUrl[userUrl.length - 1];
        const url = `https://api.torn.com/user/${userID}?selections=discord&key=${apiKey}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const user = JSON.parse(response.responseText);
                 if (user.error) {
                    Swal.fire('Error', `API Error: ${user.error.error}`, 'error');
                    return;
                }
                if (user.discord && user.discord.discordID !== "") {
                    window.open(`https://discord.com/users/${user.discord.discordID}`, '_blank');
                } else {
                    Swal.fire('Not Found', 'This user has not linked their Discord account.', 'info');
                }
            }
        });
    };

    /**
     * Creates and styles a button.
     * @param {string} text - The button text.
     * @param {function} onClickHandler - The function to call on click.
     * @param {string} bgColor - The background color.
     * @returns {HTMLButtonElement} The created button element.
     */
    const createButton = (text, onClickHandler, bgColor) => {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.onclick = onClickHandler;
        button.style.marginLeft = '10px';
        button.style.padding = '5px 15px';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.borderRadius = '5px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.style.boxShadow = '0px 1px 3px rgba(0, 0, 0, 0.25)';
        return button;
    };


    // --- Main Execution ---

    const container = document.querySelector('.content-title-links');
    if (container) {
        // Wrapper function to get API key before executing main logic
        const lookupHandler = async () => {
            const apiKey = await getApiKey();
            if (apiKey) getUserInfo(apiKey);
        };

        const discordHandler = async () => {
            const apiKey = await getApiKey();
            if (apiKey) openDiscord(apiKey);
        };

        const lookupButton = createButton('Quick Lookup', lookupHandler, '#4CAF50');
        const discordButton = createButton('Discord', discordHandler, '#5865F2');

        container.appendChild(lookupButton);
        container.appendChild(discordButton);
    }
})();

