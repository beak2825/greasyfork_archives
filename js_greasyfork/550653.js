// ==UserScript==
// @name         FMC Create/Cancelled check
// @namespace    http://tampermonkey.net/
// @version      0.5
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

    // Function to calculate time difference in hours and minutes
    function calculateTimeDifference(createTime, cancelTime) {
        const diffMs = cancelTime - createTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}h ${diffMinutes}m`;
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

    // Function to fetch and process data for Cancelled events with time difference
    function fetchVRAuditCancelled() {
        const elements = document.querySelectorAll('.clickable-text.vr-audit-dialog');
        let result = 'VRID\tCzas od Created do Cancel\n'; // Nagłówki kolumn dla Excela

        elements.forEach(element => {
            const vrid = element.innerText;
            const url = `https://trans-logistics-eu.amazon.com/fmc/vr/${vrid}/audit`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);

                        // Znajdź event "create"
                        const createEvent = data.returnedObject.find(event => event.eventType === 'create');

                        // Znajdź event z currentValue === 'CANCELLED'
                        const cancelEvent = data.returnedObject.find(event =>
                            event.eventType === 'status_audit_event' &&
                            event.currentValue === 'CANCELLED'
                        );

                        if (createEvent && cancelEvent) {
                            const timeDiff = calculateTimeDifference(createEvent.eventTime, cancelEvent.eventTime);
                            result += `${vrid}\t${timeDiff}\n`;
                            textbox.value = result;
                        } else if (cancelEvent && !createEvent) {
                            // Jeśli nie ma create event, ale jest cancel
                            result += `${vrid}\tBrak danych create\n`;
                            textbox.value = result;
                        }

                    } else {
                        console.error(`Failed to fetch data for VRID: ${vrid}`);
                    }
                }
            });
        });
    }

    // Function to fetch and process data for Cancelled events vs Arrival
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

                        // Sprawdź czy istnieje event z currentValue === 'CANCELLED'
                        const cancelEvent = data.returnedObject.find(event =>
                            event.eventType === 'status_audit_event' &&
                            event.currentValue === 'CANCELLED'
                        );

                        if (cancelEvent) {
                            const cancelTime = new Date(cancelEvent.eventTime).getTime();
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
