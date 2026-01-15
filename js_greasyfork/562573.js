// ==UserScript==
// @name         Torn High-Value Company Notifier (Director Link)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Alerts for Big 3 companies. Clicking notification opens Director's profile.
// @author       Torn UserScript Writer
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/562573/Torn%20High-Value%20Company%20Notifier%20%28Director%20Link%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562573/Torn%20High-Value%20Company%20Notifier%20%28Director%20Link%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 120000; // 2 minutes
    const TARGET_TYPES = [20, 33, 34]; // TV, Mining, Oil
    const TYPE_NAMES = { 20: "Television Network", 33: "Mining Corporation", 34: "Oil Rig" };

    GM_registerMenuCommand("Set Torn API Key", () => {
        const key = prompt("Enter your Torn API Key:", GM_getValue("torn_api_key", ""));
        if (key) { GM_setValue("torn_api_key", key.trim()); alert("Key saved!"); }
    });

    async function getDirectorData(companyID, apiKey) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/company/${companyID}?selections=profile&key=${apiKey}`,
                onload: (res) => {
                    const data = JSON.parse(res.responseText);
                    resolve(data.company_profile ? data.company_profile.director : null);
                }
            });
        });
    }

    function checkCompanies() {
        const apiKey = GM_getValue("torn_api_key");
        if (!apiKey) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/torn/?selections=companies&key=${apiKey}`,
            onload: async function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const companies = data.companies;
                    if (!companies) return;

                    const currentTargetIDs = Object.keys(companies).filter(id =>
                        TARGET_TYPES.includes(companies[id].type)
                    );

                    const lastKnownIDs = JSON.parse(GM_getValue("knownHighValueIDs", "[]"));
                    const newFoundations = currentTargetIDs.filter(id => !lastKnownIDs.includes(id));

                    for (const id of newFoundations) {
                        const typeName = TYPE_NAMES[companies[id].type];
                        const directorID = await getDirectorData(id, apiKey);

                        GM_notification({
                            title: `New ${typeName} Founded!`,
                            text: `Click to view the Director (ID: ${directorID || 'Unknown'})`,
                            timeout: 20000,
                            onclick: () => {
                                if (directorID) {
                                    window.open(`https://www.torn.com/profiles.php?XID=${directorID}`);
                                } else {
                                    window.open(`https://www.torn.com/joblist.php#/p=corpinfo&ID=${id}`);
                                }
                            }
                        });
                    }

                    GM_setValue("knownHighValueIDs", JSON.stringify(currentTargetIDs));
                } catch (e) { console.error("Notifier Error:", e); }
            }
        });
    }

    setInterval(checkCompanies, CHECK_INTERVAL);
    checkCompanies();
})();