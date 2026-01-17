// ==UserScript==
// @name         GeoGuessr 5K Streak
// @description  Adds a 5K streak counter that automatically updates while you play
// @version      1.3
// @author       zxn
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    https://greasyfork.org/en/users/1560840-zxn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562833/GeoGuessr%205K%20Streak.user.js
// @updateURL https://update.greasyfork.org/scripts/562833/GeoGuessr%205K%20Streak.meta.js
// ==/UserScript==

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const ERROR_RESP = -1000000;
const AUTOMATIC = true;
let streak = parseInt(sessionStorage.getItem("5kStreak") || 0, 10);

function checkGameMode() {
    return location.pathname.includes("/game/") || location.pathname.includes("/challenge/");
};

var style = document.createElement("style");
document.head.appendChild(style);
style.sheet.insertRule("div[class*='round-result_distanceIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; grid-area: 1 / 1 / span 1 / span 1; margin-right: 28px  }")
style.sheet.insertRule("div[class*='round-result_actions__'] { animation-delay: 0s; animation-duration: 0s; grid-area: 2 / 1 / span 1 / span 3; margin: 0px; margin-top: 10px; margin-bottom: 10px }")
style.sheet.insertRule("div[class*='round-result_pointsIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; grid-area: 1 / 2 / span 1 / span 1; margin-right: 28px }")
style.sheet.insertRule("div[class*='map-pin_largeMapPin__'] { height: 2rem; width: 2rem; margin-left: -1rem; margin-top: -1rem }")
style.sheet.insertRule("p[class*='round-result_label__'] { display: none }")
style.sheet.insertRule("div[class*='results-confetti_wrapper__'] { visibility: hidden }")
style.sheet.insertRule("div[class*='round-result_wrapper__'] { align-self: center; display: grid; flex-wrap: wrap }")
style.sheet.insertRule("div[class*='result-layout_contentNew__'] { display: flex; justify-content: center }")
style.sheet.insertRule("p[class*='standard-final-result_spacebarLabel__'] { display: none }")
style.sheet.insertRule("div[class*='standard-final-result_wrapper__'] { align-items: normal; justify-content: center }")
style.sheet.insertRule("div[class*='round-result_topPlayersButton__'] { position: absolute; bottom: 9rem }")
style.sheet.insertRule("div[class*='shadow-text_positiveTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-green-50),0 -.25rem .5rem var(--ds-color-green-50),-.25rem .5rem .5rem #77df9b,0 0.375rem 2rem var(--ds-color-green-50),0 0 0 var(--ds-color-green-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-green-50) }")
style.sheet.insertRule("div[class*='shadow-text_negativeTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-red-50),0 -.25rem .5rem var(--ds-color-red-50),-.25rem .5rem .5rem #b45862,0 0.375rem 2rem var(--ds-color-red-50),0 0 0 var(--ds-color-red-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-red-50) }")
style.sheet.insertRule("a[href*='github'] { display: none }");

function add5kStreakStatusBar() {
    const status_length = document.getElementsByClassName(cn("status_section__")).length;
    if (document.getElementById("5k-streak") == null && status_length >= 3) {
        const newDiv = document.createElement("div");
        newDiv.className = cn('status_section__');
        newDiv.innerHTML = `<div class="${cn("status_label__")}">5k</div>
        <div id="5k-streak" class="${cn("status_value__")}">${streak}</div>`;
        const statusBar = document.getElementsByClassName(cn("status_inner__"))[0];
        statusBar.insertBefore(newDiv, statusBar.children[3]);
    };
};

const new5kFormat = (streak, positive) => `
    <div class="${cn("round-result_distanceUnitIndicator__")}">
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "5K Streak Lost at" : "5K Streak"}&nbsp;</div>
    </div>
    <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
      <div><div>${streak}</div></div>
    </div>
`

const new5kFormatSummary = (streak, positive) => `
      <div class="${cn("round-result_distanceUnitIndicator__")}">
        <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "5K Streak Lost at" : "5K Streak"}&nbsp;</div>
      </div>
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
        <div><div>${streak}</div></div>
      </div>
`

function add5kStreakRoundResult() {
    if (document.getElementById("5k-streak2") == null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="5k-streak2" class="${cn("round-result_distanceWrapper__")}">${new5kFormat(streak, true)}</div>`;
        newDiv.style = "grid-area: 1 / 4 / span 1 / span 1; ";
        document.querySelector('div[class*="round-result_wrapper__"]').appendChild(newDiv);
    };
};

function add5kStreakGameSummary() {
    if (document.getElementById("5k-streak3") == null && !!document.querySelector('div[class*="result-overlay_overlayTotalScore__"]')
        /*&& !document.querySelector('div[class*="result-overlay_overlayQuickPlayProgress__"]')*/) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="5k-streak3" class="${cn("round-result_distanceWrapper__")}">${new5kFormatSummary(streak, true)}</div>`;
        newDiv.style = "display: flex; align-items: center;";
        const totalScore = document.querySelector('div[class*="result-overlay_overlayTotalScore__"]');
        totalScore.parentNode.insertBefore(newDiv, totalScore.parentNode.children[1]);
        totalScore.style.marginTop = "-20px";
    };
};

function update5kStreak(newStreak) {
    if (newStreak === ERROR_RESP) {
        if (document.getElementById("5k-streak2") != null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
            document.getElementById("5k-streak2").innerHTML = "";
        }
        return;
    }
    let prevStreak = sessionStorage.getItem("5kStreak");
    sessionStorage.setItem("5kStreak", newStreak);
    if (!(prevStreak > 0 && newStreak == 0)) {
        sessionStorage.setItem("5kStreakBackup", newStreak);
    };
    if (document.getElementById("5k-streak") != null) {
        document.getElementById("5k-streak").innerHTML = newStreak;
    };
    if (document.getElementById("5k-streak2") != null) {
        if (newStreak == 0 && prevStreak > 0) {
            document.getElementById("5k-streak2").innerHTML = new5kFormat(prevStreak, false);
        }
        else {
            document.getElementById("5k-streak2").innerHTML = new5kFormat(newStreak, true);
        };
    };
    if (document.getElementById("5k-streak3") != null) {
        if (newStreak == 0 && prevStreak > 0) {
            document.getElementById("5k-streak3").innerHTML = new5kFormatSummary(prevStreak, false);
        }
        else {
            document.getElementById("5k-streak3").innerHTML = new5kFormatSummary(newStreak, true);
        };
    };
    streak = newStreak;
};

async function run5kcheck() {
    let scoreDiv = document.querySelector('div[class*="round-result_pointsIndicatorWrapper__"] div div div');
    let distDiv = document.querySelector('div[class*="round-result_distanceWrapper__"] div div div');
    console.log(sessionStorage.getItem("5kChecked"));
    while ((sessionStorage.getItem("5kChecked") || 0) == 0) {
        let scoreTmp = parseInt(scoreDiv.innerHTML.replace(",", ""));
        let distTmp = parseInt(scoreDiv.innerHTML.replace(",", ""));
        if (scoreTmp != 0 || distTmp != 0) {
            if (scoreTmp >= 5000) {
                update5kStreak(streak + 1);
                break;
            }
            else {
                update5kStreak(0);
                break;
            }
        }
        await delay(100);
    }
};

async function do5kCheck() {
    if (!document.querySelector('div[class*="result-layout_root__"]')) {
        sessionStorage.setItem("5kChecked", 0);
    } else if ((sessionStorage.getItem("5kChecked") || 0) == 0) {
        await run5kcheck();
        sessionStorage.setItem("5kChecked", 1);
    }
};

let lastDoCheckCall = 0;
new MutationObserver(async (mutations) => {
    if (!checkGameMode() || lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    await scanStyles()
    add5kStreakStatusBar();
    add5kStreakRoundResult();
    add5kStreakGameSummary();
    if (AUTOMATIC) await do5kCheck();
}).observe(document.body, { subtree: true, childList: true });