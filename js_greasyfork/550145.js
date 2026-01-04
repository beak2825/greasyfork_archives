// ==UserScript==
// @name         GeoGuessr State Streak Counter
// @version      1.0
// @description  Adds a state/province streak counter to GeoGuessr
// @match        https://www.geoguessr.com/*
// @author       AaronThug (Modified from victheturtle's Country Streak Counter: https://greasyfork.org/scripts/452760-country-streak-counter)
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    http://tampermonkey.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550145/GeoGuessr%20State%20Streak%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/550145/GeoGuessr%20State%20Streak%20Counter.meta.js
// ==/UserScript==

const AUTOMATIC = true;
const API_Key = 'INSERT_BIGDATACLOUD_API_KEY_HERE';
const ERROR_RESP = -1000000;
let streak = parseInt(sessionStorage.getItem("StateStreak") || 0, 10);

function checkGameMode() {
    return location.pathname.includes("/game/") || location.pathname.includes("/challenge/");
}

var style = document.createElement("style");
document.head.appendChild(style);
style.sheet.insertRule("div[class*='round-result_distanceIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; grid-area: 1 / 1 / span 1 / span 1; margin-right: 28px  }")
style.sheet.insertRule("div[class*='round-result_actions__'] { animation-delay: 0s; animation-duration: 0s; grid-area: 2 / 1 / span 1 / span 3; margin: 0px; margin-top: 10px; margin-bottom: 10px }")
style.sheet.insertRule("div[class*='round-result_pointsIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; grid-area: 1 / 2 / span 1 / span 1; margin-right: 28px }")
style.sheet.insertRule("div[class*='map-pin_largeMapPin__'] { height: 2rem; width: 2rem; margin-left: -1rem; margin-top: -1rem }")
style.sheet.insertRule("p[class*='round-result_label__'] { display: none }")
style.sheet.insertRule("div[class*='results-confetti_wrapper__'] { visibility: hidden }")
style.sheet.insertRule("div[class*='round-result_wrapper__'] { align-self: center; display: grid; flex-wrap: wrap; margin-top: 30px; }")
style.sheet.insertRule("div[class*='result-layout_contentNew__'] { display: flex; justify-content: center }")
style.sheet.insertRule("p[class*='standard-final-result_spacebarLabel__'] { display: none }")
style.sheet.insertRule("div[class*='standard-final-result_wrapper__'] { align-items: normal; justify-content: center }")
style.sheet.insertRule("div[class*='round-result_topPlayersButton__'] { position: absolute; bottom: 9rem }")
style.sheet.insertRule("div[class*='shadow-text_positiveTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-green-50),0 -.25rem .5rem var(--ds-color-green-50),-.25rem .5rem .5rem #77df9b,0 0.375rem 2rem var(--ds-color-green-50),0 0 0 var(--ds-color-green-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-green-50) }")
style.sheet.insertRule("div[class*='shadow-text_negativeTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-red-50),0 -.25rem .5rem var(--ds-color-red-50),-.25rem .5rem .5rem #b45862,0 0.375rem 2rem var(--ds-color-red-50),0 0 0 var(--ds-color-red-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-red-50) }")
style.sheet.insertRule("a[href*='github'] { display: none }")
style.sheet.insertRule("#state-streak2 { position: absolute; top: -90px; left: 50%; transform: translateX(-50%) scale(0.6); z-index: 100; white-space: nowrap; }")
style.sheet.insertRule("div[class*='result-layout_bottomNew__'] { min-height: 200px !important; background: var(--ds-color-blue-800) !important; }");

function addStreakStatusBar() {
    const status_length = document.getElementsByClassName(cn("status_section__")).length;
    if (document.getElementById("state-streak") == null && status_length >= 3) {
        const newDiv = document.createElement("div");
        newDiv.className = cn('status_section__');
        newDiv.innerHTML = `<div class="${cn("status_label__")}">State Streak</div>
        <div id="state-streak" class="${cn("status_value__")}">${streak}</div>`;
        const statusBar = document.getElementsByClassName(cn("status_inner__"))[0];
        const countryStreakInStatus = document.getElementById("country-streak");
        if (countryStreakInStatus && statusBar.children.length >= 4) {
            statusBar.insertBefore(newDiv, statusBar.children[4]);
        } else {
            statusBar.insertBefore(newDiv, statusBar.children[3]);
        }
    }
}

const newFormat = (streak, positive) => `
    <div class="${cn("round-result_distanceUnitIndicator__")}">
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "Lost at" : "State Streak"}&nbsp;</div>
    </div>
    <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
      <div><div>${streak}</div></div>
    </div>
`

const newFormatSummary = (streak, positive) => `
      <div class="${cn("round-result_distanceUnitIndicator__")}">
        <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "State streak lost at" : "State streak"}&nbsp;</div>
      </div>
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
        <div><div>${streak}</div></div>
      </div>
`

function addStreakRoundResult() {
    if (document.getElementById("state-streak2") == null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
        const resultWrapper = document.querySelector('div[class*="round-result_wrapper__"]');
        if (resultWrapper) {
            const newDiv = document.createElement("div");
            newDiv.innerHTML = `<div id="state-streak2" class="${cn("round-result_distanceWrapper__")}">${newFormat(streak, true)}</div>`;
            newDiv.style = "grid-area: 1 / 3 / span 1 / span 1; position: relative;";
            resultWrapper.appendChild(newDiv);
            setTimeout(() => {
                const stateElement = document.getElementById("state-streak2");
                if (stateElement) {
                    stateElement.style.position = "absolute";
                    stateElement.style.top = "-60px";
                    stateElement.style.left = "50%";
                    stateElement.style.transform = "translateX(-50%) scale(0.6)";
                    stateElement.style.zIndex = "100";
                    stateElement.style.whiteSpace = "nowrap";
                }
            }, 100);
        }
    }
}

function addStreakGameSummary() {
    if (document.getElementById("state-streak3") == null && !!document.querySelector('div[class*="result-overlay_overlayTotalScore__"]')) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="state-streak3" class="${cn("round-result_distanceWrapper__")}">${newFormatSummary(streak, true)}</div>`;
        newDiv.style = "display: flex; align-items: center; margin-top: 10px;";
        const totalScore = document.querySelector('div[class*="result-overlay_overlayTotalScore__"]');
        totalScore.parentNode.insertBefore(newDiv, totalScore.parentNode.children[1]);
        totalScore.style.marginTop = "-20px";
    }
}

function updateStreak(newStreak) {
    if (newStreak === ERROR_RESP) {
        if (document.getElementById("state-streak2") != null) {
            document.getElementById("state-streak2").innerHTML = "";
        }
        return;
    }
    sessionStorage.setItem("StateStreak", newStreak);
    if (!(streak > 0 && newStreak == 0)) {
        sessionStorage.setItem("StateStreakBackup", newStreak);
    }
    if (document.getElementById("state-streak") != null) {
        document.getElementById("state-streak").innerHTML = newStreak;
    }
    if (document.getElementById("state-streak2") != null) {
        document.getElementById("state-streak2").innerHTML = newFormat(newStreak, true);
        if (newStreak == 0 && streak > 0) {
            document.getElementById("state-streak2").innerHTML = newFormat(streak, false);
        }
    }
    if (document.getElementById("state-streak3") != null) {
        document.getElementById("state-streak3").innerHTML = newFormatSummary(newStreak, true);
        if (newStreak == 0 && streak > 0) {
            document.getElementById("state-streak3").innerHTML = newFormatSummary(streak, false);
        }
    }
    streak = newStreak;
}

async function getStateCode(coords) {
    if (coords[0] <= -85.05) return 'AQ';
    if (API_Key.toLowerCase().match("^(bdc_)?[a-f0-9]{32}$") != null) {
        const api = "https://api.bigdatacloud.net/data/reverse-geocode?latitude="+coords.lat+"&longitude="+coords.lng+"&localityLanguage=en&key="+API_Key;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => {
                if (out === ERROR_RESP) return ERROR_RESP;
                return out.principalSubdivision || out.countryCode || 'UNKNOWN';
            });
    } else {
        const api = `https://nominatim.openstreetmap.org/reverse.php?lat=${coords.lat}&lon=${coords.lng}&zoom=21&format=jsonv2&accept-language=en`;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => {
                if (out === ERROR_RESP) return ERROR_RESP;
                const state = out?.address?.state || out?.address?.province || out?.address?.region;
                const country = out?.address?.country_code?.toUpperCase();
                return state || country || 'UNKNOWN';
            });
    }
}

let lastGuess = { lat: 91, lng: 0 };
function check() {
    const gameTag = location.href.substring(location.href.lastIndexOf('/') + 1)
    let apiUrl = "https://www.geoguessr.com/api/v3/games/"+gameTag;
    if (location.pathname.includes("/challenge/")) {
        apiUrl = "https://www.geoguessr.com/api/v3/challenges/"+gameTag+"/game";
    }
    fetch(apiUrl)
    .then(res => res.json())
    .then((out) => {
        const guessCounter = out.player.guesses.length;
        const round = out.rounds[guessCounter-1];
        const guess = out.player.guesses[guessCounter-1];
        if (guess.lat == lastGuess.lat && guess.lng == lastGuess.lng) return;
        lastGuess = guess;
        Promise.all([getStateCode(guess), getStateCode(round)]).then(codes => {
            if (codes[0] == ERROR_RESP || codes[1] == ERROR_RESP) {
                updateStreak(ERROR_RESP);
            } else if (codes[0] == codes[1]) {
                updateStreak(streak + 1);
            } else {
                updateStreak(0);
            }
        });
    }).catch(err => { throw err });
}

function doCheck() {
    if (!document.querySelector('div[class*="result-layout_root__"]')) {
        sessionStorage.setItem("StateChecked", 0);
    } else if ((sessionStorage.getItem("StateChecked") || 0) == 0) {
        check();
        sessionStorage.setItem("StateChecked", 1);
    }
}

let lastDoCheckCall = 0;
new MutationObserver(async (mutations) => {
    if (!checkGameMode() || lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    await scanStyles()
    if (AUTOMATIC) doCheck();
    addStreakStatusBar();
    addStreakRoundResult();
    addStreakGameSummary();
}).observe(document.body, { subtree: true, childList: true });

document.addEventListener('keypress', (e) => {
    if (e.key == '3') {
        updateStreak(streak + 1);
    } else if (e.key == '4') {
        updateStreak(streak - 1);
    } else if (e.key == '9') {
        const streakBackup = parseInt(sessionStorage.getItem("StateStreakBackup") || 0, 10);
        updateStreak(streakBackup + 1);
    } else if (e.key == '0') {
        updateStreak(0);
        sessionStorage.setItem("StateStreakBackup", 0);
    }
});