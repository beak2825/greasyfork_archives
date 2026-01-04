// ==UserScript==
// @name        tenno.tools highlight
// @match       https://tenno.tools/*
// @version     0.1
// @author      Jere
// @description 4/9/2025, 5:57:43 PM
// @grant        GM_addStyle
// @license     MIT 
// @namespace https://greasyfork.org/users/1521722
// @downloadURL https://update.greasyfork.org/scripts/551406/tennotools%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/551406/tennotools%20highlight.meta.js
// ==/UserScript==

// the first element is the type# of the table
const missionLocationsArray = [0, "mercury", "venus", "earth", "mars", "phobos", "deimos", "ceres", "jupiter", "europa", "saturn", "uranus", "neptune", "pluto", "sedna", "eris", "void", "lua", "kuva fortress", "zariman", "veil"];
const missionTypesArray = [1, "capture", "exterminate", "mobile defense", "rescue", "sabotage", "spy", "alchemy", "disruption", "defense", "excavation", "interception", "survival", "void cascade", "void flood", "skirmish"];
missionTypesArray.sort();
const missionTiersArray = [2, "lith", "meso", "neo", "axi", "omnia", "requiem"];

let highlightsArray = [
    [],
    [],
    []
];
let excludesArray = [
    [],
    [],
    []
];
let specialExcludesArray = [];

function parseFromLocalStorage(key, dataset) {
    const storageData = localStorage.getItem(key + dataset)
    if (storageData) {
        return JSON.parse(storageData);
    } else {
        return [];
    }
}

function loadSettings(datasetTable) {
    // check the special exclusions separately from the normal ones i.e. datasetTable=3
    const excludeSpecialCheckboxes = document.querySelectorAll("#filters input.exclude-filter[data-table='3']");
    const storedSpecialExcludes = localStorage.getItem("specialExcludes");
    if (datasetTable === 3) {
        if (storedSpecialExcludes) {
            specialExcludesArray = JSON.parse(storedSpecialExcludes);
            for (let i = 0; i < excludeSpecialCheckboxes.length; i++) {
                const excludeSpecialCheckboxName = excludeSpecialCheckboxes[i].name.split("_")[1];
                if (specialExcludesArray.includes(excludeSpecialCheckboxName)) {
                    excludeSpecialCheckboxes[i].checked = true;
                }
            }
        }
        return;
    }
    const excludeCheckboxes = document.querySelectorAll("#filters input.exclude-filter[data-table='" + datasetTable + "']");
    const includeCheckboxes = document.querySelectorAll("#filters input.include-filter[data-table='" + datasetTable + "']");

    highlightsArray[datasetTable] = parseFromLocalStorage("hilights", datasetTable);
    excludesArray[datasetTable] = parseFromLocalStorage("excludes", datasetTable);

    // check the boxes on the page if found in the localStorages
    // using excludeCheckboxes.lenght but includeCheckboxes should be the same size
    for (let i = 0; i < excludeCheckboxes.length; i++) {
        const includeCheckboxName = includeCheckboxes[i].name.split("_")[1];
        const excludeCheckboxName = excludeCheckboxes[i].name.split("_")[1];

        if (highlightsArray[datasetTable].includes(includeCheckboxName)) {
            includeCheckboxes[i].checked = true;
        }
        if (excludesArray[datasetTable].includes(excludeCheckboxName)) {
            excludeCheckboxes[i].checked = true;
        }
    }
}

function checkboxClick(event) {
    const checkbox = event.target;
    const [checkboxType, checkboxName] = checkbox.name.split("_"); // include/exclude, planet/missiontype/era
    const checkboxTable = checkbox.dataset.table; // identifier for from which table
    // checkbox for the special exclusions, normal, steelpath and railjack
    if (checkboxTable == 3) {
        if (checkbox.checked === true) {
            if (!specialExcludesArray.includes(checkboxName)) {
                specialExcludesArray.push(checkboxName);
            }
        } else {
            if (specialExcludesArray.includes(checkboxName)) {
                specialExcludesArray = specialExcludesArray.filter(item => item !== checkboxName);
            }
        }
        localStorage.setItem("specialExcludes", JSON.stringify(specialExcludesArray));
    } else {
        // fetch the adjacent checkboxes
        let checkboxOpposite;
        if (checkboxType == "include") {
            checkboxOpposite = document.querySelector("#filters input[name='exclude_" + checkboxName + "']");
        } else if (checkboxType == "exclude") {
            checkboxOpposite = document.querySelector("#filters input[name='include_" + checkboxName + "']");
        }

        // break the input's name i.e "exclude_earth"
        const checkboxOppositeLocation = checkbox.name.split("_")[1];

        // remove from the array if the opposite box is checked
        if (checkboxOpposite.checked) {
            checkboxOpposite.checked = false;
            // remove from the excludes
            if (checkboxType == "include") {
                excludesArray[checkboxTable] = excludesArray[checkboxTable].filter(item => item !== checkboxOppositeLocation);
            }
            // remove from the array
            else if (checkboxType == "exclude") {
                highlightsArray[checkboxTable] = highlightsArray[checkboxTable].filter(item => item !== checkboxOppositeLocation);
            }
        }
        // add to array if is checked
        if (checkbox.checked) {
            if (checkboxType == "include") {
                highlightsArray[checkboxTable].push(checkboxName);
            } else if (checkboxType == "exclude") {
                excludesArray[checkboxTable].push(checkboxName);
            }
        }
        // if not checked -> remove from the arrays
        else {
            if (checkboxType == "include") {
                highlightsArray[checkboxTable] = highlightsArray[checkboxTable].filter(item => item !== checkboxName);
            } else if (checkboxType == "exclude") {
                excludesArray[checkboxTable] = excludesArray[checkboxTable].filter(item => item !== checkboxName);
            }
        }

        //save the selections to the localstorage
        localStorage.setItem("hilights" + checkboxTable, JSON.stringify(highlightsArray[checkboxTable]));
        localStorage.setItem("excludes" + checkboxTable, JSON.stringify(excludesArray[checkboxTable]));
    }
    highlightPage();
}

function createCheckbox(boxClass, boxName, dataTable) {
    const checkboxInput = document.createElement("input");
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.setAttribute("class", boxClass);
    checkboxInput.setAttribute("name", boxName);
    checkboxInput.setAttribute("data-table", dataTable);
    checkboxInput.addEventListener("change", checkboxClick);
    return checkboxInput;
}

function createHighlightDiv(fissureType, fissureTypeText) {

    const highlightDivContainer = document.createElement("div");
    highlightDivContainer.setAttribute("class", "highlight-container light-box gap hidden " + fissureType);
    //highlightDivContainer.style.display = "none";
    const fissuresDiv = document.querySelector('wf-fissures');
    fissuresDiv.insertBefore(highlightDivContainer, fissuresDiv.querySelector('.light-box.gap'));
    const highlightDivType = document.createElement("div");
    highlightDivType.setAttribute("class", "entries " + fissureType);
    const highlightTypeH2 = document.createElement("h2");
    highlightTypeH2.innerText = fissureTypeText;
    highlightDivType.appendChild(highlightTypeH2);
    highlightDivContainer.appendChild(highlightDivType);

}

function createTable(rows, columns, contentArray) {
    const table = document.createElement("table");
    for (let row = 1; row < rows; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < columns; col++) {
            const td = document.createElement("td");
            // 0=planets 1=missions 2=era
            switch (col) {
                case 0:
                    td.setAttribute("class", "label");
                    td.innerText = contentArray[row];
                    break;
                case 1:
                    td.setAttribute("class", "include-filter");
                    td.appendChild(createCheckbox("include-filter", "include_" + contentArray[row], contentArray[0]));
                    break;
                case 2:
                    td.setAttribute("class", "exclude-filter");
                    td.appendChild(createCheckbox("exclude-filter", "exclude_" + contentArray[row], contentArray[0]));
                    break;
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}


function setup() {

    const filterDiv = document.createElement("div");
    filterDiv.setAttribute("id", "filters");
    const locationsDiv = document.createElement("div");
    locationsDiv.setAttribute("id", "location-filter")
    const typesDiv = document.createElement("div");
    typesDiv.setAttribute("id", "missiontype-filter");
    const tiersDiv = document.createElement("div");
    tiersDiv.setAttribute("id", "tier-filter");
    const excludeSpecialDiv = document.createElement("div");
    excludeSpecialDiv.setAttribute("id", "exclude-special");
    const overlayDiv = document.createElement("div");
    overlayDiv.setAttribute("id", "overlay");
    const filterSettings = document.createElement("div");
    filterSettings.setAttribute("id", "filter-settings");

    filterDiv.appendChild(locationsDiv);
    filterDiv.appendChild(typesDiv);
    filterDiv.appendChild(tiersDiv);

    locationsDiv.appendChild(createTable(missionLocationsArray.length, 3, missionLocationsArray));
    typesDiv.appendChild(createTable(missionTypesArray.length, 3, missionTypesArray));
    tiersDiv.appendChild(createTable(missionTiersArray.length, 3, missionTiersArray));
    tiersDiv.appendChild(excludeSpecialDiv);

    const excludeSpecialTable = document.createElement("table");
    excludeSpecialTable.setAttribute("class", "exclude-special");
    for (let row = 0; row < 3; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < 2; col++) {
            const td = document.createElement("td");
            if (col == 0) {
                td.setAttribute("class", "label");
            } else if (col === 1) {
                td.setAttribute("class", "exclude-filter");
            }
            tr.appendChild(td);
        }
        excludeSpecialTable.appendChild(tr);
    }
    const fissureType0 = "Normal";
    const fissuretype1 = "Steel Path";
    const fissureType2 = "Void Storm";
    excludeSpecialTable.rows[0].cells[0].innerText = fissureType0
    excludeSpecialTable.rows[1].cells[0].innerText = fissuretype1
    excludeSpecialTable.rows[2].cells[0].innerText = fissureType2
    excludeSpecialTable.rows[0].cells[1].appendChild(createCheckbox("exclude-filter", "exclude_normal", 3));
    excludeSpecialTable.rows[1].cells[1].appendChild(createCheckbox("exclude-filter", "exclude_steelpath", 3));
    excludeSpecialTable.rows[2].cells[1].appendChild(createCheckbox("exclude-filter", "exclude_railjack", 3));
    excludeSpecialDiv.append(excludeSpecialTable);

    const resetButton = document.createElement("input");
    resetButton.setAttribute("type", "button");
    resetButton.setAttribute("value", "Reset all");

    // reset button -> uncheck all of the checkboxes, empty arrays and localstorage, fuck em.
    resetButton.addEventListener("click", function(event) {
        let allButtons = document.querySelectorAll("#filters input[type='checkbox']");
        for (let i = 0; i < allButtons.length; i++) {
            allButtons[i].checked = false;
        }
        highlightsArray[0].length = 0;
        highlightsArray[1].length = 0;
        highlightsArray[2].length = 0;
        excludesArray[0].length = 0;
        excludesArray[1].length = 0;
        excludesArray[2].length = 0;
        localStorage.setItem("hilights0", "");
        localStorage.setItem("hilights1", "");
        localStorage.setItem("hilights2", "");
        localStorage.setItem("excludes0", "");
        localStorage.setItem("excludes1", "");
        localStorage.setItem("excludes2", "");
        localStorage.setItem("specialExcludes", "");
        highlightPage();
    });

    excludeSpecialDiv.appendChild(resetButton);

    // added in "reverse" order because first is last, etc. AST#fasew7u
    createHighlightDiv("railjack", fissureType2);
    createHighlightDiv("steelpath", fissuretype1);
    createHighlightDiv("normal", fissureType0);

    document.body.appendChild(filterSettings);
    document.body.appendChild(filterDiv);
    document.body.appendChild(overlayDiv);

    // listener for the settings popup
    document.addEventListener("click", function(event) {
        // if settings div clicked
        if (event.target === filterSettings) {
            const currentDisplay = window.getComputedStyle(filterDiv).display;
            if (currentDisplay === "none") {
                filterDiv.style.display = "flex";
                overlayDiv.style.display = "block";
            } else {
                filterDiv.style.display = "none";
                overlayDiv.style.display = "none";
            }
            return;
        }
        // close if clicked outside
        if (filterDiv.style.display === "flex" && !filterDiv.contains(event.target)) {
            filterDiv.style.display = "none";
            overlayDiv.style.display = "none";
        }
    });
    // 0=planets, 1=mission type, 2=era, 3=special excludes
    loadSettings(0);
    loadSettings(1);
    loadSettings(2);
    loadSettings(3);
    highlightPage();
}

function highlightPage() {

    const clonedHighlightDivContent = document.querySelectorAll("wf-fissures > .highlight-container .entry");
    const missionElements = document.querySelectorAll("wf-fissures > div:not(.highlight-container) .entry");

    // check if the cloned highlights at the top are expired
    if (clonedHighlightDivContent) {
        for (let i = 0; i < clonedHighlightDivContent.length; i++) {
            const clonedHighlightEndtime = clonedHighlightDivContent[i].querySelector(".reltime").getAttribute("data-time") * 1000;
            if (clonedHighlightEndtime < Date.now()) {
                clonedHighlightDivContent[i].remove();
            }
        }
    }

    let foundHilight = 0;

    for (let missionIndex = 0; missionIndex < missionElements.length; missionIndex++) {

        const missionLocation = missionElements[missionIndex].querySelector(".mission-location");
        const missionType = missionElements[missionIndex].querySelector(".mission-type");
        const missionTier = missionElements[missionIndex].querySelector(".fissure-tier");
        const [missionPlanetText, missionNodeText] = missionLocation.innerText.toLowerCase().split("/");
        const missionTypeText = missionType.innerText.toLowerCase();
        const missionTierText = missionTier.innerText.toLowerCase();
        // get the h2 for the fissure type
        let fissureTypeText = missionElements[missionIndex].closest("wf-fissures > div").querySelector("h2").innerText;
        let fissureType;
        if (fissureTypeText == "Steel Path") {
            fissureType = "steelpath";
        } else if (fissureTypeText == "Void Storms") {
            fissureType = "railjack";
        } else {
            fissureType = "normal"
        }

        // the logic of highlighting
        if (
            (highlightsArray[0].includes(missionPlanetText) ||
                highlightsArray[1].includes(missionTypeText) ||
                highlightsArray[2].includes(missionTierText)
            ) &&
            !(
                excludesArray[0].includes(missionPlanetText) ||
                excludesArray[1].includes(missionTypeText) ||
                excludesArray[2].includes(missionTierText) ||
                specialExcludesArray.includes(fissureType)
            )
        ) {

            foundHilight++;
            let highlightDiv
            if (!missionElements[missionIndex].classList.contains("hilight")) {
                //show the main container for the fissure type
                highlightDiv = document.querySelector("wf-fissures > .highlight-container." + fissureType);
                if (highlightDiv && highlightDiv.classList.contains("hidden")) {
                    highlightDiv.classList.remove("hidden");
                }
                missionElements[missionIndex].classList.add("hilight");

                // check for duplicates
                let matchFound = false;
                for (let clonesIndex = 0; clonesIndex < clonedHighlightDivContent.length; clonesIndex++) {
                    const cloneInfo = clonedHighlightDivContent[clonesIndex].querySelector(".mission-info");
                    const missionInfo = missionElements[missionIndex].querySelector(".mission-info");
                    if (cloneInfo && missionInfo && cloneInfo.isEqualNode(missionInfo)) {
                        matchFound = true;
                        break;
                    }
                }
                // if not a duplicate -> clone
                if (!matchFound) {
                    const clonedHighlight = missionElements[missionIndex].cloneNode(true);
                    highlightDiv.appendChild(clonedHighlight);
                    console.log("Added:");
                    console.log(clonedHighlight);
                }
            }
        } else {
            if (missionElements[missionIndex].classList.contains("hilight")) {
                missionElements[missionIndex].classList.remove("hilight");
                for (let clonesIndex = 0; clonesIndex < clonedHighlightDivContent.length; clonesIndex++) {
                    clonedHighlightDivContent[clonesIndex].classList.remove("hilight");
                    // also remove the cloned
                    if (missionElements[missionIndex].querySelector(".mission-info").isEqualNode(clonedHighlightDivContent[clonesIndex].querySelector(".mission-info"))) {
                        clonedHighlightDivContent[clonesIndex].remove();
                        console.log("Removed:");
                        console.log(clonedHighlightDivContent[clonesIndex]);
                    }
                    // re-highlight if no need to remove
                    else {
                        clonedHighlightDivContent[clonesIndex].classList.add("hilight");
                    }
                }
            }
        }
        // hide the container if empty
        highlightDiv = document.querySelector("wf-fissures > .highlight-container." + fissureType);
        if (highlightDiv && highlightDiv.children.length === 1) {
            highlightDiv.classList.add("hidden");
        }
    }
    // highlight and show the amount at the h1
    const fissureHeader = document.querySelector("wf-fissures > h1 > span");
    if (foundHilight >= 1) {
        fissureHeader.classList.add("hilight");
        fissureHeader.innerText = "Void Fissures (" + foundHilight + ")";
    } else {
        fissureHeader.classList.remove("hilight");
        fissureHeader.innerText = "Void Fissures";
    }
    // find the topmost visible highlight container in a clunky way
    const topNonHighlight = document.querySelector("wf-fissures > .light-box:not(.highlight-container)");
    highlightDiv = document.querySelectorAll("wf-fissures > .highlight-container:not(.hidden)");
    if (highlightDiv[0]) {
        topNonHighlight.classList.remove("top-container");
        highlightDiv[0].classList.add("top-container");
        for (let i = 1; i < highlightDiv.length; i++) {
            highlightDiv[i].classList.remove("top-container");
        }
    }
    //
    else {
        topNonHighlight.classList.add("top-container");
    }
}


let highlightTimeout = null;

const observer = new MutationObserver((mutations) => {

    if (highlightTimeout !== null) return;

    highlightTimeout = setTimeout(() => {
        highlightPage();
        highlightTimeout = null;
    }, 5000);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

window.addEventListener("load", function() {
    setup();
}, false);

GM_addStyle(`
  :root {
    --highlight-background: #2f3544;
    --highlight-color: 255, 111, 111;
  }
  wf-fissures > .highlight-container {
    background-color: var(--highlight-background);
  }
  .hilight {
    color: rgb(var(--highlight-color));
  }
  .highlight-container {
    padding-left: 0.3em;
  }
  .highlight-container h2 {
    color: rgb(var(--highlight-color));
    border-bottom: 2px solid rgba(var(--highlight-color), 0.3);
  }
  .highlight-container .hidden {
    display: none;
  }
  .top-container {
    margin-top: 0 !important;
  }
  .gap:nth-of-type(1) {
    margin-top: 0;
  }
  #filter-settings {
    position: fixed;
    top: 60px;
    left: 10px;
    height: 30px;
    width: 30px;
    cursor: pointer;
    z-index: 999;
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBNSVQuIE1hZGUgYnkgdm13YXJlOiBodHRwczovL2dpdGh1Yi5jb20vdm13YXJlL2NsYXJpdHktYXNzZXRzIC0tPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDM2IDM2IiB2ZXJzaW9uPSIxLjEiICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5zZXR0aW5ncy1saW5lPC90aXRsZT4KICAgIDxwYXRoIGNsYXNzPSJjbHItaS1vdXRsaW5lIGNsci1pLW91dGxpbmUtcGF0aC0xIiBkPSJNMTguMSwxMWMtMy45LDAtNywzLjEtNyw3czMuMSw3LDcsN2MzLjksMCw3LTMuMSw3LTdTMjIsMTEsMTguMSwxMXogTTE4LjEsMjNjLTIuOCwwLTUtMi4yLTUtNXMyLjItNSw1LTVjMi44LDAsNSwyLjIsNSw1UzIwLjksMjMsMTguMSwyM3oiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xyLWktb3V0bGluZSBjbHItaS1vdXRsaW5lLXBhdGgtMiIgZD0iTTMyLjgsMTQuN0wzMCwxMy44bC0wLjYtMS41bDEuNC0yLjZjMC4zLTAuNiwwLjItMS40LTAuMy0xLjlsLTIuNC0yLjRjLTAuNS0wLjUtMS4zLTAuNi0xLjktMC4zbC0yLjYsMS40bC0xLjUtMC42bC0wLjktMi44QzIxLDIuNSwyMC40LDIsMTkuNywyaC0zLjRjLTAuNywwLTEuMywwLjUtMS40LDEuMkwxNCw2Yy0wLjYsMC4xLTEuMSwwLjMtMS42LDAuNkw5LjgsNS4yQzkuMiw0LjksOC40LDUsNy45LDUuNUw1LjUsNy45QzUsOC40LDQuOSw5LjIsNS4yLDkuOGwxLjMsMi41Yy0wLjIsMC41LTAuNCwxLjEtMC42LDEuNmwtMi44LDAuOUMyLjUsMTUsMiwxNS42LDIsMTYuM3YzLjRjMCwwLjcsMC41LDEuMywxLjIsMS41TDYsMjIuMWwwLjYsMS41bC0xLjQsMi42Yy0wLjMsMC42LTAuMiwxLjQsMC4zLDEuOWwyLjQsMi40YzAuNSwwLjUsMS4zLDAuNiwxLjksMC4zbDIuNi0xLjRsMS41LDAuNmwwLjksMi45YzAuMiwwLjYsMC44LDEuMSwxLjUsMS4xaDMuNGMwLjcsMCwxLjMtMC41LDEuNS0xLjFsMC45LTIuOWwxLjUtMC42bDIuNiwxLjRjMC42LDAuMywxLjQsMC4yLDEuOS0wLjNsMi40LTIuNGMwLjUtMC41LDAuNi0xLjMsMC4zLTEuOWwtMS40LTIuNmwwLjYtMS41bDIuOS0wLjljMC42LTAuMiwxLjEtMC44LDEuMS0xLjV2LTMuNEMzNCwxNS42LDMzLjUsMTQuOSwzMi44LDE0Ljd6IE0zMiwxOS40bC0zLjYsMS4xTDI4LjMsMjFjLTAuMywwLjctMC42LDEuNC0wLjksMi4xbC0wLjMsMC41bDEuOCwzLjNsLTIsMmwtMy4zLTEuOGwtMC41LDAuM2MtMC43LDAuNC0xLjQsMC43LTIuMSwwLjlsLTAuNSwwLjFMMTkuNCwzMmgtMi44bC0xLjEtMy42TDE1LDI4LjNjLTAuNy0wLjMtMS40LTAuNi0yLjEtMC45bC0wLjUtMC4zbC0zLjMsMS44bC0yLTJsMS44LTMuM2wtMC4zLTAuNWMtMC40LTAuNy0wLjctMS40LTAuOS0yLjFsLTAuMS0wLjVMNCwxOS40di0yLjhsMy40LTFsMC4yLTAuNWMwLjItMC44LDAuNS0xLjUsMC45LTIuMmwwLjMtMC41TDcuMSw5LjFsMi0ybDMuMiwxLjhsMC41LTAuM2MwLjctMC40LDEuNC0wLjcsMi4yLTAuOWwwLjUtMC4yTDE2LjYsNGgyLjhsMS4xLDMuNUwyMSw3LjdjMC43LDAuMiwxLjQsMC41LDIuMSwwLjlsMC41LDAuM2wzLjMtMS44bDIsMmwtMS44LDMuM2wwLjMsMC41YzAuNCwwLjcsMC43LDEuNCwwLjksMi4xbDAuMSwwLjVsMy42LDEuMVYxOS40eiI+PC9wYXRoPgogICAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsLW9wYWNpdHk9IjAiLz4KPC9zdmc+");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    filter: invert(1);
    transition: transform 0.1s linear;
  }
  #filter-settings:hover {
    transform: scale(1.2);
    filter: invert(1) drop-shadow(0 0 0.2rem rgba(255, 255, 255, 0.3));
  }
  #filters #exclude-special {
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px dashed #7388a1;
  }
  #filters {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 5px solid rgba(0, 0, 0, 0.2);
    padding: 1em;
    border-radius: 10px;
    color: #fff;
    font: 10pt Gudea, sans-serif !important;
    background-color: rgba(30, 45, 50, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1000;
  }
  #overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    opacity: 0.7;
    display: none;
    z-index: 999;
  }
  #filters,
  #overlay {
    animation-name: fade;
    animation-timing-function: linear;
    animation-duration: 0.15s;
  }
  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.7;
    }
  }
  #filters > div {
    border-right: 1px dashed #7388a1;
  }
  #filters > div:last-child {
    border-right: 0;
  }
  #filters input[type="checkbox"] {
    cursor: pointer;
    outline: 1px solid black;
  }
  #filters input[type="checkbox"]:not(:checked) {
    opacity: 0.3;
  }
  #filters input[type="checkbox"].include-filter {
    accent-color: darkgreen;
  }
  #filters input[type="checkbox"].exclude-filter {
    accent-color: darkred;
  }
  #filters input[type="button"] {
    background-color: #2f3544;
    border: 2px solid black;
    border-radius: 5px;
    float: right;
    margin: 0.3em;
  }
  #filters input[type="button"]:hover {
    background-color: #7388a1;
  }

  #filters td.include-filter,
  #filters td.exclude-filter {
    border-radius: 5px;
    text-align: center;
    vertical-align: middle;
    width: 1em;
    height: 1em;
  }
  #filters td.include-filter {
    background-color: green;
  }
  #filters td.exclude-filter {
    background-color: red;
  }
  #filters td.include-filter:hover {
    background-color: #4ca64c;
  }
  #filters td.exclude-filter:hover {
    background-color: #ff4c4c;
  }
  #filters table {
    width: 10rem;
    margin: 0.5em;
  }
  #filters .label {
    text-transform: capitalize;
  }
  wf-fissures .state-icons {
    display: none;
  }

`);