// ==UserScript==
// @name         FMES by Taznister
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @license      MIT
// @description  Faction Members Extended Status. Displays extended information in column Status in Faction members page
// @author       Taznister [3770016]
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @match        https://www.torn.com/factions.php?step=profile&userID=3770016
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/preferences.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551377/FMES%20by%20Taznister.user.js
// @updateURL https://update.greasyfork.org/scripts/551377/FMES%20by%20Taznister.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const factionId = getUrlParameterByName("ID");

        const travelArrow = {
        "airliner": { // standard or BCT
            "to": "&#x2192;", // &#x2192; single right
            "from": "&#x2190;" // &#x2190; single left
        },
        "light_aircraft": { // airstrip
            "to": "&#x21d2;", // &#x21d2; right double
            "from": "&#x21d0;" // &#x21d0; left double
        },
        "private_jet": { // WLT
            "to": "&#x21db;", // &#x21db; triple right
            "from": "&#x21da;" // &#x21da; triple left
        },
        "business": { // N/A (BCT image is the same as standard flight)
            "to": "&#x2964;", // &#x2964; harpoon right
            "from": "&#x2962;" // &#x2962; harpoon left
        }
    }

    const travelStatus = {
        "Traveling to Argentina": "Arg",
        "Returning to Torn from Argentina": "Arg",
        "Traveling to Canada": "Can",
        "Returning to Torn from Canada": "Can",
        "Traveling to Cayman Islands": "CI",
        "Returning to Torn from Cayman Islands": "CI",
        "Traveling to China": "China",
        "Returning to Torn from China": "China",
        "Traveling to Hawaii": "Hawaii",
        "Returning to Torn from Hawaii": "Hawaii",
        "Traveling to Japan": "Japan",
        "Returning to Torn from Japan": "Japan",
        "Traveling to Mexico": "Mex",
        "Returning to Torn from Mexico": "Mex",
        "Traveling to South Africa": "SA",
        "Returning to Torn from South Africa": "SA",
        "Traveling to Switzerland": "Switz",
        "Returning to Torn from Switzerland": "Switz",
        "Traveling to UAE": "UAE",
        "Returning to Torn from UAE": "UAE",
        "Traveling to United Kingdom": "UK",
        "Returning to Torn from United Kingdom": "UK",
    }

    const abroadStatus = {
        "In Argentina": "Arg",
        "In Canada": "Canada",
        "In Cayman Islands": "CI",
        "In China": "China",
        "In Hawaii": "Hawaii",
        "In Japan": "Jap",
        "In Mexico": "Mex",
        "In South Africa": "SA",
        "In Switzerland": "Switz",
        "In UAE": "UAE",
        "In United Kingdom": "UK",
    }

    const hospWhere = {
        "In hospital for ": " ",
        "In an Argentinia": "Ar ",
        "In a Canadian ho": "Ca ",
        "In a Caymanian h": "Ca ",
        "In a Chinese hos": "Ch ",
        "In a Hawaiian ho": "Ha ",
        "In a Japanese ho": "Ja ",
        "In a Mexican hos": "Me ",
        "In a South Afric": "SA ",
        "In a Swiss hospi": "Sw ",
        "In an Emirati ho": "UA ",
        "In a British hos": "UK ",
    }

    let somethingWrong = false;

    if (localStorage.getItem("fmes.frequency") === null) localStorage.setItem("fmes.frequency", 10);
    if (localStorage.getItem("fmes.userAPIkey") === null) localStorage.setItem("fmes.userAPIkey", "");

    let updateFrequency = validateFrequency(localStorage.getItem("fmes.frequency"));
    let tornAPIKeyPublic = validateKey(localStorage.getItem("fmes.userAPIkey"));

    if (window.location.href.includes("preferences.php")) {

        var style = document.createElement("style");
        style.innerHTML = "div#fmes-settings {display: block; color: gray; padding: 0.5em; margin: 0.5em 0; border: 1px solid gray;}";
        style.innerHTML += "div#fmes-settings input[type='text'], div#fmes-settings input[type='button'] {padding: 0.2em; margin: 0.2em;}";
        style.innerHTML += "div#fmes-settings input[type='button']:hover {background-color: gray;}";
        document.head.append(style);

        const settingsPort = document.querySelector(".content-wrapper");

        let settingsDiv = document.createElement("div"); settingsDiv.setAttribute("id", "fmes-settings");
        let ul = document.createElement('ul'); ul.innerHTML = "<b>FMES settings:</b>";
        let liKey = document.createElement('li');
        liKey.innerHTML = "<label>Torn API Key (Public) for FMES: <input type='text' id='fmes-key' value='" + tornAPIKeyPublic + "' /></label>";
        let btnValidateKey = document.createElement('input'); btnValidateKey.setAttribute("type", "button"); btnValidateKey.setAttribute("value", "Validate key");
        btnValidateKey.addEventListener("click", () => {
            let keyInput = document.querySelector("#fmes-key");
            tornAPIKeyPublic = validateKey(keyInput.value);
            localStorage.setItem("fmes.userAPIkey", tornAPIKeyPublic);
            keyInput.value = tornAPIKeyPublic;
        });
        liKey.appendChild(btnValidateKey);
        let liFrequency = document.createElement('li');
        liFrequency.innerHTML = "<label>Frequency of status updates [once every <i>x</i> seconds]: <input type='text' id='fmes-frequency' value='" + updateFrequency + "' /></label>";
        let btnValidateFrequency = document.createElement('input'); btnValidateFrequency.setAttribute("type", "button"); btnValidateFrequency.setAttribute("value", "Validate frequency");
        btnValidateFrequency.addEventListener("click", () => {
            let freqInput = document.querySelector("#fmes-frequency");
            updateFrequency = validateFrequency(freqInput.value);
            localStorage.setItem("fmes.frequency", updateFrequency);
            freqInput.value = updateFrequency;
        });
        let liInfo = document.createElement('span');
        liInfo.innerHTML = " (10 is quite safe - it should not interfere with other scripts if you're using them [<a href='https://wiki.torn.com/wiki/API#Automatic_limits_.26_blocks'>more info in Torn wiki</a>])";
        liFrequency.appendChild(btnValidateFrequency);
        liFrequency.appendChild(liInfo);
        ul.appendChild(liKey); ul.appendChild(liFrequency); settingsDiv.appendChild(ul); settingsPort.appendChild(settingsDiv);
    }

    function validateFrequency(frequency) {
        let convertedNumber = parseInt(frequency, 10);
        return !isNaN(convertedNumber) && convertedNumber > 0 && Number.isInteger(convertedNumber) ? convertedNumber : 10;
    }

    function validateKey(key) {
        let regex = /^[A-Za-z0-9]{16}$/;
        return regex.test(key) ? key : "";
    }

    function getUrlParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function formatDuration(seconds) {
        if (seconds > 60 * 60 * 1) return ">1 h";
        else return Math.floor(seconds / 60) + ":" + (seconds % 60).toString().padStart(2, "0");
    }

    function main() {
        if (somethingWrong) return;
        let start = performance.now();
        fetch("https://api.torn.com/faction/" + factionId + "?selections=basic&key=" + localStorage.getItem("fmes.userAPIkey"))
            .then((response) => response.json())
            .then((factionData) => {
                if (factionData.error != null) {
                    somethingWrong = true;
                } else {
                    let end = performance.now();
                    let responseTime = end - start;
                    let members = factionData.members;
                    for (let member in members) {
                        let memberStatusField = document.querySelector('li.table-row:has(a[href$="' + member + '"]) div.table-cell.status span.ellipsis');
                        if (memberStatusField === null) return;
                        let forSeconds = members[member].status.until - Math.round((Date.now() + responseTime) / 1000);
                        if (members[member].status.state == "Traveling") {
                            let direction = members[member].status.description.includes("Traveling to") ? travelArrow[members[member].status.plane_image_type].to : travelArrow[members[member].status.plane_image_type].from;
                            memberStatusField.innerHTML = direction + " " + travelStatus[members[member].status.description];
                        } else if (members[member].status.state == "Hospital") {
                            memberStatusField.innerHTML = hospWhere[members[member].status.description.substring(0, 16)] + formatDuration(forSeconds);
                        } else if (members[member].status.state == "Abroad") {
                            memberStatusField.innerHTML = abroadStatus[members[member].status.description];
                        } else if (members[member].status.state == "Jail") {
                            memberStatusField.innerHTML = "# " + formatDuration(forSeconds);
                        } else {
                            memberStatusField.innerHTML = members[member].status.description;
                        }
                    }
                }
            }
        );
    }

    if (!window.location.href.includes("preferences.php")) {
        setTimeout(function() {main()}, 2000);
        setInterval(main, updateFrequency * 1000);
    }

})();