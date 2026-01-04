// ==UserScript==
// @name         Torn City - Faction Members Status Checker (Split Sections & Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Retrieve all faction members and display them in sections (Hospital, Travelling, and Okay), sorted by remaining hospital time. The display toggles on each button press.
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553092/Torn%20City%20-%20Faction%20Members%20Status%20Checker%20%28Split%20Sections%20%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553092/Torn%20City%20-%20Faction%20Members%20Status%20Checker%20%28Split%20Sections%20%20Toggle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Replace with your Torn API key
    const API_KEY = 'YOUR_API_KEY_HERE';

    // Global variable for the pop-up container
    let popupContainer = null;

    // Extract the faction ID from the current page URL (assumes URL contains ?ID=xxxx)
    const urlParams = new URLSearchParams(window.location.search);
    const factionId = urlParams.get('ID');
    if (!factionId) {
        console.error('Faction ID not found in URL.');
        return;
    }

    // Construct the API endpoint using the dynamic faction ID and Torn API v2
    const MEMBERS_ENDPOINT = `https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${API_KEY}`;

    // Function to fetch faction members
    function getFactionMembers() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: MEMBERS_ENDPOINT,
                onload: function (response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.members && Array.isArray(data.members) && data.members.length > 0) {
                                resolve(data.members);
                            } else {
                                reject('No members data found.');
                            }
                        } catch (e) {
                            reject(`Error parsing response: ${e}`);
                        }
                    } else {
                        reject(`Error fetching faction members: ${response.status}`);
                    }
                },
                onerror: function (error) {
                    reject(`Error fetching faction members: ${error}`);
                }
            });
        });
    }

    // Function to display the members split into sections
    function displayMembersByStatus(hospitalMembers, okayMembers, travellingMembers) {
        // Create the pop-up container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.right = '20px';
        container.style.backgroundColor = '#2d2d2d';
        container.style.color = '#ffffff';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.zIndex = '2147483647';
        container.style.maxWidth = '400px';
        container.style.overflowY = 'auto';
        container.style.maxHeight = '80vh';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        // Helper to create a section
        function createSection(titleText, members) {
            if (members.length === 0) return null;
            const section = document.createElement('div');
            const title = document.createElement('h3');
            title.innerText = titleText;
            title.style.marginBottom = '5px';
            title.style.color = '#ff6666';
            section.appendChild(title);
            members.forEach(member => {
                const memberDiv = document.createElement('div');
                memberDiv.style.marginBottom = '8px';
                memberDiv.style.borderBottom = '1px solid #444';
                memberDiv.style.paddingBottom = '5px';
                memberDiv.innerHTML = `
                    <strong>${member.name}</strong><br>
                    ${member.timeLeft ? `<span>Time Left: ${member.timeLeft}</span><br>` : ""}
                    <span>Last Action: ${member.lastAction}</span><br>
                    <span>Life: ${member.life}</span><br>
                    <span>Revivable: ${member.isRevivable}</span>
                `;
                section.appendChild(memberDiv);
            });
            return section;
        }

        const hospitalSection = createSection("Hospital", hospitalMembers);
        const travellingSection = createSection("Travelling", travellingMembers);
        const okaySection = createSection("Okay", okayMembers);

        if (hospitalSection) container.appendChild(hospitalSection);
        if (travellingSection) container.appendChild(travellingSection);
        if (okaySection) container.appendChild(okaySection);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#ff6666';
        closeButton.style.color = '#ffffff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            if (popupContainer) {
                document.body.removeChild(popupContainer);
                popupContainer = null;
            }
        });
        container.appendChild(closeButton);

        // Save container globally and add to the page
        popupContainer = container;
        document.body.appendChild(container);
    }

    // Main function to check and split members into sections
    async function checkMembersStatus() {
        try {
            // Fetch the latest members data
            const members = await getFactionMembers();
            const now = Math.floor(Date.now() / 1000);
            let hospitalMembers = [];
            let travellingMembers = [];
            let okayMembers = [];

            members.forEach(member => {
                // Determine the member's status state
                const state = (member.status && member.status.state)
                    ? member.status.state.toLowerCase()
                    : "okay";
                let timeLeft = "";
                let timeLeftNum = 0;
                if ((state === "hospital" || state === "travelling") && member.status.until) {
                    const t = Math.floor((member.status.until - now) / 60);
                    timeLeftNum = t > 0 ? t : 0;
                    timeLeft = `${timeLeftNum} minutes`;
                }
                const memberInfo = {
                    name: member.name || "Unknown",
                    lastAction: member.last_action ? member.last_action.relative : "N/A",
                    life: member.life ? `${member.life.current}/${member.life.maximum}` : "N/A",
                    isRevivable: typeof member.is_revivable === "boolean"
                        ? (member.is_revivable ? "Yes" : "No")
                        : "N/A",
                    timeLeft: timeLeft,
                    timeLeftNum: timeLeftNum
                };

                if (state === "hospital") {
                    hospitalMembers.push(memberInfo);
                } else if (state === "travelling") {
                    travellingMembers.push(memberInfo);
                } else {
                    okayMembers.push(memberInfo);
                }
            });

            // Sort hospital members by remaining time (ascending)
            hospitalMembers.sort((a, b) => a.timeLeftNum - b.timeLeftNum);

            displayMembersByStatus(hospitalMembers, okayMembers, travellingMembers);
        } catch (error) {
            console.error(error);
        }
    }

    // Add a button to the Torn UI to trigger the check (toggle behaviour)
    function addButton() {
        const button = document.createElement('button');
        button.innerText = 'Check Members Status';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '2147483647';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            // If the popup is already visible, remove it (toggle off)
            if (popupContainer) {
                document.body.removeChild(popupContainer);
                popupContainer = null;
            } else {
                // Otherwise, run the check to fetch and display updated data
                checkMembersStatus();
            }
        });

        document.body.appendChild(button);
    }

    // Wait for the page to load and then add the button
    window.addEventListener('load', addButton);
})();