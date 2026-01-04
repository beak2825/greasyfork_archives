// ==UserScript==
// @name         SPOG Alert Console
// @namespace    http://tampermonkey.net/
// @version      2025-11-30
// @description  waaaa
// @author       Stamos
// @match        https://spog.neonova.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neonova.net
// @grant        GM_addStyle
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555965/SPOG%20Alert%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/555965/SPOG%20Alert%20Console.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ALL_AFFILIATES = [
    {
        affiliateId: "ImOn Communications",
        displayName: "ImOn"
    },
    {
        affiliateId: "Home Telephone ILEC",
        displayName: "Home Telecom"
    },
    {
        affiliateId: "TruVista Communications",
        displayName: "TruVista"
    },
    {
        affiliateId: "Great Plains Communications",
        displayName: "Great Plains"
    },
    {
        // Note: includes gonetspeed
        affiliateId: "Otelco Telecommunications, LLC",
        displayName: "Otelco + GoNetSpeed"
    },
    {
        affiliateId: "Bulloch Net Incorporated",
        displayName: "Bulloch"
    },
    {
        affiliateId: "Carolina Connect",
        displayName: "Carolina Connect"
    },
    {
        affiliateId: "Co-Mo Connect",
        displayName: "Co-Mo Connect"
    },
    {
        // Note: includes coastal fiber
        affiliateId: "Darien Tel",
        displayName: "Darien + Coastal Fiber"
    },
    {
        affiliateId: "Foothills",
        displayName: "Foothills"
    },
    {
        affiliateId: "Oklahoma Fiber LLC",
        displayName: "OEC Fiber"
    },
    {
        affiliateId: "Paul Bunyan Communications",
        displayName: "Paul Bunyan"
    },
    {
        affiliateId: "Palmetto Rural Telephone Cooperative Inc.",
        displayName: "PRTC"
    },
    {
        affiliateId: "Peoples Telephone Cooperative",
        displayName: "Peoples"
    },
    {
        affiliateId: "Wilkes.net",
        displayName: "Riverstreet (All Orgs)"
    },
    {
        affiliateId: "TEC",
        displayName: "TEC"
    },
    {
        affiliateId: "United Services, Inc.",
        displayName: "United Fiber"
    },
    {
        affiliateId: "United Electric Cooperative Services",
        displayName: "UCS"
    },
    {
        affiliateId: "West Carolina Communications",
        displayName: "West Carolina (WCTel)"
    },
    {
        affiliateId: "West Kentucky Rural Telephone",
        displayName: "West Kentucky (WK&T)"
    }
];

    var affiliateTable;

    const LOCAL_STORAGE_API_KEY = "msal.token.keys.67b92c35-58cb-4b25-8ad7-798645265c6f";
    const ALERT_CHECK_INTERVAL = 60 * 1000; // first number is amt of seconds

    async function getAlertsForCampaign(affiliateArray) {
        //console.log(`Getting alerts for ${affiliateArray}`)
        var apiTokenLocalStorageKey = JSON.parse(localStorage.getItem(LOCAL_STORAGE_API_KEY)).accessToken;
        var authBearerToken = JSON.parse(localStorage.getItem(apiTokenLocalStorageKey)).secret;
        var fullToken = `Bearer ${authBearerToken}`;
        try {
            const response = await fetch(`https://spog.neonova.net/api/alerts?forBanner=true&affiliate=${affiliateArray.affiliateId}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,ja;q=0.8",
                    "authorization": fullToken,
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://spog.neonova.net/search?campaignId=OtH4ZYkB7EKX8MoZWZpN",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            })

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            //console.log(result)
            return result
        } catch (error) {
            //console.error(error.message)
            throw error
        }

    }

    function hasScriptAlreadyRan() {
        if (document.getElementById("specialOverlay")) {
            console.log("element already created")
            return true
        }
        return false
    }

    function getColorForAlertType(type) {
        if (type === "Maintenance")
            return "#ffcc80"
        if (type === "Notice")
            return "#ce93d8"
        if (type === "Outage")
            return "#ef9a9a"
        return "#448aff"
    }

    function getEndTime(eta) {
        if (eta === null) {
            return "No ETA"
        }
        return eta
    }

    function prettifyTime(time, timezone) {
        if (time === null)
            return time
        const dateOptions = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "shortGeneric",
            //timeStyle: "long",
            //dateStyle: "long",
            timeZone: timezone,
        })
        const date = new Date(time)
        return dateOptions.format(date)
        //return date.toLocaleDateString("en-US", dateOptions)
    }

    function getHighestAlertLevelOfAlertArray(array) {
        if (array.length == 0) console.error("BUGGED! array is 0");
        // Outage, Notice, Maintenance
        var highestLevel = "Notice"
        array.forEach((alert) => {
            if (alert.type === "Maintenance" && highestLevel === "Notice")
                highestLevel = "Maintenance"
            else if (alert.type === "Outage" && (highestLevel === "Maintenance" || highestLevel === "Notice"))
                highestLevel = "Outage"
        })
        if (array.length == 1 && array[0].affiliate == null)
            return "null"
        return highestLevel
    }

    //ALERT ARRAY FORM
    //affiliate = company
    //content = message
    //creator = NRTC manager who made the alert
    //endTime = expected end time
    //isArchived = no idea
    //startTime = start time
    //timeZone = timezone
    //type = severity level of the alert; maintenance, notice, outage
    //_id = guessing some sort of internal alert id

    function handleAlerts(alertArray, tableRow) {
        if (alertArray.length != 0) {
            //console.log(alertArray)
            switch (getHighestAlertLevelOfAlertArray(alertArray)) {
                case "null":
                    break;
                case "Notice":
                    tableRow.id = "affiliateNotice"
                    break
                case "Maintenance":
                    tableRow.id = "affiliateMaintenance"
                    break
                case "Outage":
                    tableRow.id = "affiliateOutage"
                    break
            }

            tableRow.addEventListener("click", () => {
                const alertHtml = alertArray.map(a => `
                    <div style="background-color:${getColorForAlertType(a.type)};padding:10px; border:1px solid #ccc; margin-bottom:8px; border-radius:8px;">
                        <strong>Type:</strong> ${a.type}<br/>
                        <strong>Start Time:</strong> ${prettifyTime(a.startTime, a.timeZone)}<br/>
                        <strong>ETA:</strong> ${getEndTime(prettifyTime(a.endTime, a.timeZone))}<br/>
                        <strong>Message:</strong><br/>
                        ${a.content}
                    </div>
                `).join("");

                showModal(`${alertArray[alertArray.length - 1].affiliate} Alerts`, alertHtml);
            })
            const numberOfAlerts = document.createElement("td")
            numberOfAlerts.innerText = alertArray.length
            tableRow.appendChild(numberOfAlerts)
        }
    }

    function createElements() {
        if (hasScriptAlreadyRan()) return
        GM_addStyle(`#specialOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none;
        }
        #specialButton {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 10000;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .normalButton {
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #divPanel {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            width: 30%;
            height: 45%;
        }
        #divPanel > h1 {
            text-align: center;
        }
        #divPanel > button {
            margin: 10px auto;
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: block;
        }
        #divPanel > button:active {
           background-color: #218a39;
           transform: translateY(2px);
        }
        #divTableHolder {
            width: 100%;
        }
        #divTableHolder > table {
            width: 100%;
        }
        td {
            cursor: pointer;
        }
        .tdTooltip {
            visibility: hidden;
            width: 300px;
            background-color: black;
            color: #fff;
            text-align: left;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
        }
        td:hover .tdTooltip {
            visibility: visible;
        }
        #affiliateOutage {
            background-color: #ef9a9a;
        }
        #affiliateNotice {
            background-color: #ce93d8;
        }
        #affiliateMaintenance {
            background-color: #ffcc80;
        }
        #affiliateApiError {
            background-color: #448aff;
        }
        .alertHolder {
            width: 25%;
            height: 20%;
        }
    `)

        /*document.body.insertAdjacentHTML("beforeend", `
        <div id="tm-modal-backdrop" style="display:none;"></div>
        <div id="tm-modal" style="display:none;">
          <div id="tm-modal-content">
            <span id="tm-modal-close">&times;</span>
            <h2 id="tm-modal-title"></h2>
            <div id="tm-modal-body"></div>
          </div>
        </div>
        `);*/

        const modalOverlay = document.createElement("div")
        modalOverlay.id = "modal-overlay"
        modalOverlay.style.display = "none"
        modalOverlay.onclick = closeModal
        document.body.appendChild(modalOverlay)

        const modal = document.createElement("div")
        modal.id = "modal"
        modal.style.display = "none"
        document.body.appendChild(modal)

        const modalContent = document.createElement("div")
        modalContent.id = "modal-content"
        modal.appendChild(modalContent)

        const modalCloseButton = document.createElement("span")
        modalCloseButton.id = "modal-close"
        modalCloseButton.onclick = closeModal
        modalCloseButton.innerHTML = "&times;"
        modalContent.appendChild(modalCloseButton)

        const modalTitle = document.createElement("h3")
        modalTitle.id = "modal-title"
        modalContent.appendChild(modalTitle)

        const modalBody = document.createElement("div")
        modalBody.id = "modal-body"
        modalContent.appendChild(modalBody)

        GM_addStyle(`
        #modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99998;
        }
        #modal {
          position: fixed; inset: 0;
          display: flex; justify-content: center; align-items: center;
          z-index: 99999;
        }
        #modal-content {
          background: white;
          padding: 20px;
          width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          font-family: sans-serif;
        }
        #modal-close {
          float: right;
          cursor: pointer;
          font-size: 24px;
        }
        #modal-title {
            text-align: center;
        }
        `);

        // idk if ill add more, and im not gonna focus on sorting it myself
        ALL_AFFILIATES.sort((a, b) => a.displayName.localeCompare(b.displayName))

        const button = document.createElement("button")
        button.innerText = "Toggle Overlay"
        button.id = "specialButton"
        button.addEventListener("click", () => {
            overlay.style.display =
                overlay.style.display === "none" ? "block" : "none"
        })
        document.body.appendChild(button)

        const overlay = document.createElement("div")
        overlay.id = "specialOverlay"
        overlay.style.display = "none"
        document.body.appendChild(overlay)

        const innerDiv = document.createElement("div")
        innerDiv.id = "divPanel"
        overlay.appendChild(innerDiv)

        const refreshButton = document.createElement("button")
        refreshButton.innerText = "Refresh"
        //button.classList.add("normalButton")
        refreshButton.addEventListener("click", () => {
            checkAllAlertsAndHandleUI()
        })
        innerDiv.appendChild(refreshButton)

        const tableDiv = document.createElement("div")
        tableDiv.id = "divTableHolder"
        innerDiv.appendChild(tableDiv)

        affiliateTable = document.createElement("table")
        affiliateTable.cellpadding = 2
        affiliateTable.cellspacing = 0
        tableDiv.appendChild(affiliateTable)

        setTimeout(checkAllAlertsAndHandleUI, 3000)
    }

    function checkAllAlertsAndHandleUI() {
        // clear out all children of table
        affiliateTable.innerHTML = ''

        ALL_AFFILIATES.forEach((element) => {
            const tableRow = document.createElement("tr")
            affiliateTable.appendChild(tableRow)
            const tableData = document.createElement("td")
            tableData.innerText = element.displayName
            getAlertsForCampaign(element)
                .then((result) => {
                    handleAlerts(result, tableRow)
                })
                .catch((error) => {
                    console.error(error)
                    tableRow.id = "affiliateApiError"
                })

            tableRow.appendChild(tableData)
        })

        setTimeout(checkAllAlertsAndHandleUI, ALERT_CHECK_INTERVAL)
    }

    function showModal(title, html) {
      document.getElementById("modal-title").textContent = title;
      document.getElementById("modal-body").innerHTML = html;

      document.getElementById("modal-overlay").style.display = "block";
      document.getElementById("modal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("modal-overlay").style.display = "none";
      document.getElementById("modal").style.display = "none";
    }

    createElements()
})();