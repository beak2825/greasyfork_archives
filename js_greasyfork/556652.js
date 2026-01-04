// ==UserScript==
// @name        Hospital Timer TEST
// @version     1.0.0
// @description Display hospital timer on the attack page
// @author      Krimian
// @run-at      document-end
// @grant       GM_log
// @match       https://www.torn.com/loader.php?sid=attack*

// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/556652/Hospital%20Timer%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/556652/Hospital%20Timer%20TEST.meta.js
// ==/UserScript==
const apiKey = "kXepzwPmiziOO60K";

function generateInformation(outTime, hospital_timestamp) {
    const seconds = Math.floor((outTime - Date.now()) / 1000);
    return `
    <div>&nbsp;</div>
    <div>Attack in: <span class="bold ${seconds <= 60 ? 'title___fOh2J' : 'title___fOh2J'}" style="${seconds < 60 ? 'color: #98FB98' : ''}">${getTimeLeft(hospital_timestamp)}</span></div>`;
}

function getTimeLeft(hospital_timestamp) {
    let outTime = new Date(0);
    outTime.setUTCSeconds(hospital_timestamp);
    const seconds = Math.floor((outTime - Date.now()) / 1000);
    if (seconds >= 60) {
        const secondsFormated = Math.floor(seconds % 60).toString().padStart(2, '0');
        return seconds < 3600 ? `${Math.floor(seconds/60)}:${secondsFormated}` : `${Math.floor(seconds / 3600)}h${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}`;
    } else {
        return `${seconds}s`;
    }
}

(function hospital_time() {
    'use strict';

    const initialTitle = document.title;
    const userid = location.href.replace(/.*?user2ID=(\d+)/i, "$1");
    fetch(`https://api.torn.com/user/${userid}?selections=profile&key=${apiKey}&comment=attack_stats`).then( async response => {
        let user = (await response.json())||{};
        if (user.status.state.toLowerCase() === 'hospital') {
            let alertWrapper = document.createElement("div")
            alertWrapper.setAttribute("class", "userName___loAWK bold");

            let outTime = new Date(0); // The 0 there is the key, which sets the date
            outTime.setUTCSeconds(user.states.hospital_timestamp);

            // Don't do anything if we are right on the ending of the hospital timer
            let msToWait = outTime - Date.now();
                // Prepare div content
            alertWrapper.innerHTML = generateInformation(outTime, user.states.hospital_timestamp);
            document.title = `${getTimeLeft(user.states.hospital_timestamp)} | ${user.name}`;

            // Sometimes the element is not yet present, so wait for it
            let outerBox = document.querySelector('.dialogButtons___nX4Bz');
            let timerPtr;
            let tempBox;
            let tempDiv;
            new Promise( (resolve, reject) => {
                if (!outerBox) {
                    // Grab the top div to add the time info inside.
                    tempBox = document.querySelector('.colored___sN72G');
                    if (tempBox) {
                        //tempDiv = tempBox.prepend(alertWrapper); // Swap these if you prefer the time on top of the button
                        tempDiv = tempBox.appendChild(alertWrapper); // Swap these if you prefer the time on top of the button
                    }
                    let waitPtr = setInterval( () => {
                        document.title = `${getTimeLeft(user.states.hospital_timestamp)} | ${user.name}`;
                        outerBox = document.querySelector('.dialogButtons___nX4Bz');
                        if (outerBox) {
                            resolve(true)
                            clearInterval(waitPtr);
                        }
                    }, 250)
                    } else {
                        resolve(true)
                    }
            }).then( () => {
                // Good to go!
                if (tempDiv) {
                    tempDiv.remove()
                }
                //outerBox.prepend(alertWrapper); // Swap these if you prefer the time on top of the button
                outerBox.appendChild(alertWrapper); // Swap these if you prefer the time on top of the button

                // Redraw content every second
                timerPtr = setInterval( () => {
                    alertWrapper.innerHTML = generateInformation(outTime, user.states.hospital_timestamp);
                    document.title = `${getTimeLeft(user.states.hospital_timestamp)} | ${user.name}`;
                }, 1000)
            })

        }
    });
})();