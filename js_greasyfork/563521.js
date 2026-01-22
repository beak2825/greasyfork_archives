// ==UserScript==
// @name         BoardGameGeek Advanced Search Defaults
// @namespace    https://greasyfork.org/en/users/1563263-korgied
// @license      MIT
// @version      2026-01-21
// @description  Allow saving filtering details for BGG's advanced search
// @author       korgied
// @match        https://boardgamegeek.com/advsearch/boardgame
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563521/BoardGameGeek%20Advanced%20Search%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/563521/BoardGameGeek%20Advanced%20Search%20Defaults.meta.js
// ==/UserScript==

const textDefaultKey = 'defaultTextValues';
const checkDefaultKey = 'defaultCheckValues';
const selectDefaultKey = 'defaultSelectValues';
const autoLoadKey = 'usAutoLoad';
const loadId = 'usLoadDefaultButton';
const saveId = 'usSaveDefaultButton';
const autoLoadId = 'usAutoloadCheck';
const loadWipeoutTextFields = true;
const ignoreCheckIds = [ autoLoadId ];

(function() {
    'use strict';

    addButtons();
    let autoLoad = GM_getValue(autoLoadKey);

    if (autoLoad === true || autoLoad === "true") {
        document.getElementById(autoLoadId).checked = true;
        setValues();
    }
})();

/// Read page values and store in local storage
function readValues() {
    console.log("UserScript: readValues called");
    let mainContent = document.querySelector('#maincontent');
    if (mainContent !== null) {
        //console.log('Userscript: found mainContent');
        const tinputs = mainContent.querySelectorAll('input[type=text]');
        const cinputs = mainContent.querySelectorAll('input[type=checkbox]:checked');
        const sinputs = mainContent.querySelectorAll('select');
        let ctValues = [];
        let ccValues = [];
        let csValues = [];

        //iterate text fields, save all values
        let cNum = 0;
        tinputs.forEach((inputField) => {
            ctValues[cNum] = [inputField.name, inputField.value];
            cNum++;
        });

        //iterate checkboxes, saving only the checked ones
        cNum = 0;
        cinputs.forEach((inputField) => {
            if (!ignoreCheckIds.contains(inputField.id)) {
                ccValues[cNum] = [inputField.name, inputField.value];
                cNum++;
            }
        });

        //iterate select fields (dropdowns) and save selected options
        cNum = 0;
        sinputs.forEach((inputField) => {
            if (!ignoreCheckIds.contains(inputField.id)) {
                csValues[cNum] = [inputField.name, inputField.value];
                cNum++;
            }
        });

        let ctValueString = JSON.stringify(ctValues);
        let ccValueString = JSON.stringify(ccValues);
        let csValueString = JSON.stringify(csValues);
        //console.log("Userscript: text values = " + ctValueString);
        //console.log("Userscript: check values = " + ccValueString);
        //ßconsole.log("Userscript: select values = " + csValueString);
        GM_setValue(textDefaultKey, ctValueString);
        GM_setValue(checkDefaultKey, ccValueString);
        GM_setValue(selectDefaultKey, csValueString);
    }
    else {
        console.log('Userscript: Where is mainContent?');
    }
}

/// Set page values from local storage
function setValues() {
    console.log("UserScript: setValues called");
    let mainContent = document.querySelector('#maincontent');
    if (mainContent !== null) {
        //console.log('Userscript: found mainContent');

        //set text values if we have them
        let tcookiev = GM_getValue(textDefaultKey);
        if (tcookiev !== null) {
            let tcookieArr = JSON.parse(tcookiev);
            console.log(tcookieArr);
            const tinputs = mainContent.querySelectorAll('input[type=text]');

            tinputs.forEach((inputField) => {
                let foundIt = false;
                for(let t=0; t<tcookieArr.length; t++) {
                    //console.log("Userscript: " + tcookieArr[t][0] + "==" + inputField.name + "?");
                    if (tcookieArr[t][0] == inputField.name) {
                        //console.log("FOUND IT! SETTING TO " + tcookieArr[t][1]);
                        foundIt = true;
                        inputField.value = tcookieArr[t][1];
                        break;
                    }
                }
                if (loadWipeoutTextFields && foundIt === false) {
                    //If we saved no value for this, then blank it out (maybe revisit later if this turns out to be annoying)
                    inputField.value = "";
                }
            });
        }

        //set checkbox values if we have them
        let ccookiev = GM_getValue(checkDefaultKey);
        if (ccookiev !== null) {
            let ccookieArr = JSON.parse(ccookiev);
            const cinputs = mainContent.querySelectorAll('input[type=checkbox]');

            cinputs.forEach((inputField) => {
                if (!ignoreCheckIds.contains(inputField.id)) {
                    let foundIt = false;
                    for(let c=0; c<ccookieArr.length; c++) {
                        //BGG's page uses both the name and value for checkboxes, so match both. We already know that if we saved it to our array, it should be checked.
                        if (ccookieArr[c][0] == inputField.name && ccookieArr[c][1] == inputField.value) {
                            foundIt = true;
                            inputField.checked = true;
                            break;
                        }
                    }
                    if (foundIt === false) {
                        //Our array won't contain unchecked boxes, so if this box isn't in the array then it should be unchecked
                        inputField.checked = false;
                    }
                }
            });
        }

        //set select (dropdown) values if we have them
        let scookiev = GM_getValue(selectDefaultKey);
        if (scookiev !== null) {
            let scookieArr = JSON.parse(scookiev);
            const sinputs = mainContent.querySelectorAll('select');

            sinputs.forEach((inputField) => {
                for(let c=0; c<scookieArr.length; c++) {
                    if (scookieArr[c][0] == inputField.name) {
                        //If they change the selections and our value no longer exists, this should just not change it, so I am not going to check for existence of our value
                        inputField.value = scookieArr[c][1];
                        break;
                    }
                }
            });
        }
    }
    else {
        console.log('Userscript: Where is mainContent?');
    }
}

function setAutoLoad() {
    console.log("Userscript: setAutoLoad called");
    let autoLoadBox = document.getElementById(autoLoadId);
    if (autoLoadBox !== null) {
        console.log('Userscript: setting autoload defaults to ' + autoLoadBox.checked);
        GM_setValue(autoLoadKey, autoLoadBox.checked);
    }
}

function addButtons() {
    const mainContent = document.querySelector("#maincontent");
    if (mainContent !== null) {
        const resetButton = mainContent.querySelector("input[name=B2]");
        if (resetButton !== null) {
            console.log(resetButton.parentElement);
            GM_addElement(resetButton.parentElement, 'input', {
                type: "button",
                id: loadId,
                value: "Load Defaults",
                style: "margin-left: 32px;"
            });
            document.getElementById(loadId).addEventListener ("click", setValues, false);

            GM_addElement(resetButton.parentElement, 'input', {
                type: "button",
                id: saveId,
                value: "Save Defaults"
            });
            document.getElementById(saveId).addEventListener ("click", readValues, false);

            GM_addElement(resetButton.parentElement, 'input', {
                type: "checkbox",
                id: autoLoadId,
                value: "Auto Load Defaults",
                style: "margin-left: 32px;"
            });
            document.getElementById(autoLoadId).addEventListener ("click", setAutoLoad, false);

            GM_addElement(resetButton.parentElement, 'label', {
                type: "checkbox",
                id: "lbl" + autoLoadId,
                for: autoLoadId
            });
            document.getElementById("lbl" + autoLoadId).innerText = "Auto-load defaults";
        }
    }
}

