// ==UserScript==
// @namespace     https://github.com/lukespacewalker
// @name          EBMC Enhancement
// @author        Suttisak Denduangchai
// @description   Transform EKG results, fix PAC links, and enhance DocView/PAC access for EST, ABI, and ECHO.
// @copyright     2025, Suttisak Denduangchai (https://github.com/lukespacewalker)
// @license       MIT
// @version       1.0.12
// @include       https://ebmc.bdms.co.th/*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559063/EBMC%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/559063/EBMC%20Enhancement.meta.js
// ==/UserScript==

/* 
Configuration
*/

// Maximum number of iterations to prevent infinite loops
const MAX_ITERATION = 10;

/*
Library function: TransformEKG
*/
/**
 * Transform EKG input string into an array of strings.
 * @param {string} input
 * @returns {string[]}
 **/
function TransformEKG(input) {
    const inputs = input.split(/\r?\n/);
    if (inputs.length < 0) return;

    let elements = [];

    let currentElementStartingLineNumber = 0;
    let currentElementEndingLineNumber = 0;


    let iteration = 0;
    while (iteration < MAX_ITERATION) {
        let elementName = inputs[currentElementStartingLineNumber];
        // Find the boundary of element by using elementName
        for (
            let lineNumber = currentElementStartingLineNumber;
            lineNumber < inputs.length;
            lineNumber++
        ) {
            if (inputs[lineNumber].includes(`${elementName}-`)) {
                currentElementEndingLineNumber = lineNumber;
                break; // stop searching
            }
        }

        let text = inputs[currentElementStartingLineNumber + 1];
        text = text.replace(/\s+/g, " ");
        text = text.replace(/^-|-$/g, "");
        elements.push(text);

        currentElementEndingLineNumber = currentElementStartingLineNumber =
            currentElementEndingLineNumber + 1;

        iteration++;
        if (currentElementEndingLineNumber + 1 >= inputs.length) break; // entire string has been processed. break the while loop
    }

    return elements;
}

/*
  Styles functions
*/

function addStyles() {
    'use strict';

    GM_addStyle(`
.ekg-copy-button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
}

.ekg-copy-button:hover {
  background-color: #0056b3;
}

#section_default{
display:none!important;
}

#section_lab{
border:none!important;
margin:0!important;
padding:0!important;
}

#section_lab .row:nth-child(2){
display:none!important;
}
    `);
}


/*
  Main function to add the button
*/

let hn = null;
let userName = null;

function findInformation() {
    try {
        userName = document.querySelector(".pro-user-name").firstChild.data.trim()
        hn = Array.from(Array.from(document.querySelectorAll("div")).filter(e => e.innerText.includes("HN :") && e.innerText.includes("VN :")).at(-1).childNodes).find(n => n.nodeType == Node.TEXT_NODE && n.data.includes("HN")).nextSibling.innerText
    }
    catch (Exception) { }
}

function removeTrash() {
    let trashAnchors = []
    trashAnchors.push(document.querySelector("#checkicon_questionnaire").parentElement)
    trashAnchors.push(document.querySelector("#checkicon_muscle_BHQ").parentElement)

    for (let trash of trashAnchors) {
        trash.parentElement.removeChild(trash)
    }
    document.querySelector("#patient_information_link")?.parentElement?.remove()

    document.querySelector("#menu").remove()
}

function fixPACButton() {
    // Find Anchor
    let anchors = document.querySelectorAll('a[href*="10.1.102.108"]')
    for (let anchor of anchors) {
        anchor.href = anchor.href.replace("User=BHT", `User=${userName}`)
        anchor.href = anchor.href.replace("Password=BHT", "Password=risbgh")
    }
}

// function fixDocviewButton() {
//     let docview = document.querySelector('a[href*="dscanweb.bdms.co.th"]')
//     if (docview == null) {
//         return
//     }
//     docview.href = docview.href.replace("/docview/", "/")
// }

function addDocviewLinkToABIandEcho() {
    let innerHtml = `
    <a data-toggle="tooltip" data-original-title="DMS Link" href="https://dscanweb.bdms.co.th/main.aspx?hn=${hn}" target="_blank" style="color: #C6D402"><i class="fas fa-folder-open"></i> DMS</a>
    `
    let estContainer = document.querySelector("#nav-exercise_stress_test")?.querySelector('.custom-control')?.parentElement
    let abiControl = document.querySelector("#nav-abi")?.querySelector('.custom-control')
    let abiContainer = abiControl?.parentElement
    if (estContainer != null) {
        estContainer.style.display = "flex"
        estContainer.insertAdjacentHTML("beforeend", innerHtml)
    }
    if (abiContainer != null) {
        abiContainer.insertAdjacentHTML("afterbegin", `<div class="col-md-12" style="display:flex"></div>`)
        abiContainer = abiContainer.childNodes[0]
        abiContainer.style.display = "flex"
        abiContainer.append(abiControl)
        abiContainer.insertAdjacentHTML("beforeend", innerHtml)
    }

    let nameContainer = document.querySelector("#sidebar-container")?.parentElement?.querySelector(".card-title")
    if (nameContainer != null) {
        nameContainer.style.display = "flex"
        nameContainer.style.gap = "0.5rem"
        nameContainer.style.justifyContent = "space-between"
        nameContainer.insertAdjacentHTML("beforeend", innerHtml)
    }
}

function addPACLinkToEcho() {
    let echoContainer = document.querySelector("#nav-echocardiography")?.querySelector('.custom-control')?.parentElement
    if (echoContainer == null) {
        return;
    }
    let formattedHn = hn.replaceAll("-", "")
    let innerHtml = `
    <a href="http://10.1.102.108/DicomWeb/DicomWeb.dll/OpenImage?User=${userName}&amp;Password=risbgh&amp;PTNID=${formattedHn}" target="_blank" style="margin-left:10px;"><i class="fas fa-file-medical"></i> PACS</a>
    `
    echoContainer.style.display = "flex"
    echoContainer.insertAdjacentHTML("beforeend", innerHtml)
}

function addCopyButton() {
    // 1. Check if the page has "EKG" word in it
    if (!(document.body.innerText.includes("EKG") && document.body.innerText.includes("Result Text"))) {
        console.log("Page does not contain 'EKG' and 'Result Text'. Skipping.");
        return;
    }

    // 2. Find label containing "Result" word
    // We look for a label that directly contains the text "Result" or has it in its innerText.
    // To be precise and avoid selecting the whole body, we look for the deepest element or a specific match.

    // Strategy: Find all labels, filter by those containing "Result", sort by length of text to find the most specific one.
    const allLabels = Array.from(document.querySelectorAll('label'));
    const resultLabels = allLabels.filter(label => label.innerText.includes("Result Text"));

    if (resultLabels.length === 0) {
        console.log("No label containing 'Result Text' found.");
        return;
    }

    // Sort by innerText length ascending. The shortest one containing "Result" is likely the label or the specific container.
    resultLabels.sort((a, b) => a.innerText.length - b.innerText.length);
    const targetLabel = resultLabels[0];

    console.log("Found target label:", targetLabel);

    // 3. Add "Copy EKG" button near the label
    // We will append it to the target label, or insert it after.
    // Let's create a container for the button to ensure it doesn't mess up layout too much, or just append.
    const button = document.createElement("button");
    button.innerText = "Copy EKG From Above";
    button.classList.add("ekg-copy-button");

    button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        // get content from textarea id = "output"
        const heartRate = document.querySelector("#hr").value;
        const ekgImpression = document.querySelector("#ecg_impression").value;
        const transformedTextArray = TransformEKG(ekgImpression);
        const ekgSummary = document.querySelector("#ekg_result_text").value;
        // Add heart rate at the end of first element
        if (
            transformedTextArray.length > 0 &&
            heartRate &&
            heartRate.trim() !== ""
        ) {
            transformedTextArray[0] += ` ${heartRate.trim()} bpm`;
        }
        transformedTextArray.push(ekgSummary.trim())
        document.querySelector("#ekg_result_text").value = transformedTextArray.join("\r\n");
    });

    // Append to the found label
    targetLabel.appendChild(button);
}

function main() {
    findInformation();
    addCopyButton();
    fixPACButton();
    addDocviewLinkToABIandEcho();
    addPACLinkToEcho();
    addStyles();

    removeTrash();
}

/*
    Run the main function on DOMContentLoaded
*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
