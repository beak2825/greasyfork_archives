// ==UserScript==
// @name         FMC Create/Cancelled check
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds buttons and textbox to query VR audit information
// @match        https://trans-logistics-eu.amazon.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/550653/FMC%20CreateCancelled%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/550653/FMC%20CreateCancelled%20check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create UI elements
    const buttonCreate = document.createElement('button');
    buttonCreate.textContent = 'Sprawdź Created';
    buttonCreate.style.position = 'fixed';
    buttonCreate.style.top = '10px';
    buttonCreate.style.right = '180px';
    buttonCreate.style.zIndex = '9999';

    const buttonCancel = document.createElement('button');
    buttonCancel.textContent = 'Cancelled vs Created';
    buttonCancel.style.position = 'fixed';
    buttonCancel.style.top = '10px';
    buttonCancel.style.right = '10px';
    buttonCancel.style.zIndex = '9999';

    const buttonCancelArrival = document.createElement('button');
    buttonCancelArrival.textContent = 'Cancel vs Arrival';
    buttonCancelArrival.style.position = 'fixed';
    buttonCancelArrival.style.top = '40px';
    buttonCancelArrival.style.right = '10px';
    buttonCancelArrival.style.zIndex = '9999';

    const textbox = document.createElement('textarea');
    textbox.style.position = 'fixed';
    textbox.style.top = '70px';
    textbox.style.right = '10px';
    textbox.style.width = '300px';
    textbox.style.height = '200px';
    textbox.style.zIndex = '9999';

    // Add elements to the page
    document.body.appendChild(buttonCreate);
    document.body.appendChild(buttonCancel);
    document.body.appendChild(buttonCancelArrival);
    document.body.appendChild(textbox);

    // Function to format date
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // Function to fetch and process data for Created events
    function fetchVRAuditCreated() {
        const elements = document.querySelectorAll('.clickable-text.vr-audit-dialog');
        let result = '';

        elements.forEach(element => {
            const vrid = element.innerText;
            const url = `https://trans-logistics-eu.amazon.com/fmc/vr/${vrid}/audit`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        const createEvent = data.returnedObject.find(event => event.eventType === 'create');
                        if (createEvent) {
                            const formattedDate = formatDate(createEvent.eventTime);
                            result += `${vrid}\t${formattedDate}\n`;
                            textbox.value = result;
                        }
                    } else {
                        console.error(`Failed to fetch data for VRID: ${vrid}`);
                    }
                }
            });
        });
    }

    // Function to fetch and process data for Cancelled events
    function fetchVRAuditCancelled() {
        const elements = document.querySelectorAll('.clickable-text.vr-audit-dialog');
        let result = '';

        elements.forEach(element => {
            const vrid = element.innerText;
            const url = `https://trans-logistics-eu.amazon.com/fmc/vr/${vrid}/audit`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        // Sprawdź pierwszy (najnowszy) rekord
                        const latestEvent = data.returnedObject[0];
                        if (latestEvent && latestEvent.currentValue === 'CANCELLED') {
                            const formattedDate = formatDate(latestEvent.eventTime);
                            result += `${vrid}\t${formattedDate}\n`;
                            textbox.value = result;
                        }
                    } else {
                        console.error(`Failed to fetch data for VRID: ${vrid}`);
                    }
                }
            });
        });
    }


    // Function to fetch and process data for Cancelled events
    function fetchVRAuditCancelledCreated() {
        const elements = document.querySelectorAll('.clickable-text.vr-audit-dialog');
        let result = '';

        elements.forEach(element => {
            const vrid = element.innerText;
            const url = `https://trans-logistics-eu.amazon.com/fmc/vr/${vrid}/audit`;
            const row = element.closest('tr');

            // Znajdź planowaną datę przyjazdu (pierwszą datę w wierszu)
            const allDates = row.querySelectorAll('span[data-epoch-millis]');
            const plannedArrivalTime = parseInt(allDates[0].getAttribute('data-epoch-millis'));

            // Znajdź kierunek (komórkę zawierającą '->')
            const allCells = row.getElementsByTagName('td');
            let direction = '';
            for (let cell of allCells) {
                if (cell.textContent.includes('->')) {
                    direction = cell.textContent.split('->')[1];
                    break;
                }
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        // Sprawdź pierwszy (najnowszy) rekord
                        const latestEvent = data.returnedObject[0];
                        if (latestEvent && latestEvent.currentValue === 'CANCELLED') {
                            const cancelTime = new Date(latestEvent.eventTime).getTime();
                            const timeDiff = plannedArrivalTime - cancelTime;

                            // Sprawdź czy anulowanie nastąpiło mniej niż 24h przed planowanym przyjazdem
                            if (timeDiff <= 24 * 60 * 60 * 1000) {
                                result += `${vrid}\t${direction.trim()}\n`;
                                textbox.value = result;
                            }
                        }
                    } else {
                        console.error(`Failed to fetch data for VRID: ${vrid}`);
                    }
                }
            });
        });
    }



    // Add click events to the buttons
    buttonCreate.addEventListener('click', fetchVRAuditCreated);
    buttonCancel.addEventListener('click', fetchVRAuditCancelled);
    buttonCancelArrival.addEventListener('click', fetchVRAuditCancelledCreated);
})();
