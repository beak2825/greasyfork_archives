// ==UserScript==
// @name         Geoguessr profile best/worst countries
// @version      0.7
// @description  Display the best and worst countries from ranked stats under the name in profile pages (most of the code copied from victheturtle#5159's Show profile details userscript)
// @author       i can't claim to have made this
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        none
// @namespace https://greasyfork.org/users/1467013
// @downloadURL https://update.greasyfork.org/scripts/552866/Geoguessr%20profile%20bestworst%20countries.user.js
// @updateURL https://update.greasyfork.org/scripts/552866/Geoguessr%20profile%20bestworst%20countries.meta.js
// ==/UserScript==

function checkURL() {
    return location.pathname.includes("/user") || location.pathname.includes("/me/profile");
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

async function checkRanked(profileId) {
    return fetch(`${location.origin}/api/v4/ranked-system/progress/${profileId}`)
        .then(out => out.json())
        .catch(err => { console.log(err); return null; });
}
function codeToFlagEmoji(code) {
    if (!code) return "";
    code = code.toLowerCase();
    return `<img src="https://flagcdn.com/24x18/${code}.png" 
                  style="vertical-align: text-bottom; margin-right: 2px; border-radius: 2px;">`;
}

let observer = new MutationObserver(() => {
    if (checkURL()) {
        if (document.getElementById("rankedStats") == null) {
            let baseDiv = document.querySelector("[class*='profile-v2_socialLinks__']");
            
            if (!baseDiv) return;

            let bestworstDiv = document.createElement("div");
            bestworstDiv.innerHTML = `<div id="rankedStats" style="font-size: 1.3em; margin-top: 4px;"></div>`;
            insertAfter(bestworstDiv, baseDiv);

            let profileId;
            if (location.pathname.includes("/me/profile")) {
                try {
                    const data = JSON.parse(document.getElementById('__NEXT_DATA__').innerText);
                    profileId = data.props.accountProps.account.user.userId;
                } catch (e) {
                    const copyLink = document.querySelector('[name="copy-link"]');
                    if (copyLink && copyLink.value) {
                         profileId = copyLink.value.substr(copyLink.value.lastIndexOf("/") + 1);
                    }
                }
            } else if (location.pathname.includes("/user")) {
                profileId = location.pathname.substr(location.pathname.lastIndexOf("/") + 1);
            }

            if (!profileId) return;

            checkRanked(profileId).then(data => {
                if (data && (data.bestCountries || data.worstCountries)) {
                    let best = (data.bestCountries && data.bestCountries.length > 0)
                        ? data.bestCountries.map(c => `${codeToFlagEmoji(c)} (${c.toUpperCase()})`).join(" ")
                        : "None";
                    let worst = (data.worstCountries && data.worstCountries.length > 0)
                        ? data.worstCountries.map(c => `${codeToFlagEmoji(c)} (${c.toUpperCase()})`).join(" ")
                        : "None";
                    document.getElementById("rankedStats").innerHTML =
                        `<b>Best:</b> ${best} | <b>Worst:</b> ${worst}`;
                } else {
                    document.getElementById("rankedStats").innerHTML = "<b>Best:</b> - | <b>Worst:</b> -";
                }
            });
        }
    }
});

observer.observe(document.body, {subtree: true, childList: true});