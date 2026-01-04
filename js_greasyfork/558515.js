// ==UserScript==
// @name         Torn - API War Timer (No Offset - Manual)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transparent, Exact Sync (0s), Positioned slightly left.
// @author       You
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558515/Torn%20-%20API%20War%20Timer%20%28No%20Offset%20-%20Manual%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558515/Torn%20-%20API%20War%20Timer%20%28No%20Offset%20-%20Manual%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ******************************************************
    // 1. PASTE YOUR API KEY HERE
    const API_KEY = 'insert API';

    // 2. TIME ADJUSTMENT
    // 0 = Exact sync with API (No head start)
    const TIME_SYNC_OFFSET = 0;
    // ******************************************************

    // --- GET ID ---
    let urlParams = new URLSearchParams(window.location.search);
    let targetID = urlParams.get('user2ID');

    if (!targetID) return;

    // --- API CALL ---
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.torn.com/user/${targetID}?selections=profile&key=${API_KEY}`,
        onload: function(response) {
            try {
                let data = JSON.parse(response.responseText);
                if (data.error) {
                    console.log("API Error: " + data.error.error);
                    return;
                }

                let state = data.status.state;
                let description = data.status.description;
                let until = data.status.until;

                // CHECK: ONLY SHOW IF IN HOSPITAL
                if (state === 'Hospital') {
                    createInterface();
                    document.getElementById('status-detail').innerText = description;
                    startCountdown(until);
                } else {
                    console.log("Target is not in hospital. Script hidden.");
                }

            } catch (e) {
                console.log("JSON Error");
            }
        }
    });

    // --- UI CREATION ---
    function createInterface() {
        let box = document.createElement('div');
        box.id = 'war-box';
        box.style.position = 'fixed';

        // --- POSITION ADJUSTMENTS ---
        // Center of the screen
        box.style.left = '50%';
        box.style.top = '58%';

        // Offset: Moved Left compared to previous version
        // Previous was 150px, now 100px.
        box.style.marginLeft = '100px';
        box.style.marginTop = '-100px';

        box.style.transform = 'translate(-50%, 0)';
        // -------------------------

        box.style.zIndex = '99999999';

        // TRANSPARENT & COMPACT
        box.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        box.style.borderRadius = '8px';
        box.style.padding = '8px';
        box.style.textAlign = 'center';
        box.style.minWidth = '120px';

        box.innerHTML = `
            <div id="war-timer" style="color:#FFF; font-size:22px; font-weight:bold; font-family:monospace; text-shadow: 1px 1px 2px black;">
                --:--
            </div>
            <div id="status-detail" style="color:#ddd; font-size:10px; margin-top:2px; margin-bottom:5px; text-shadow: 1px 1px 2px black;"></div>
            <button id="war-refresh" style="background:rgba(128, 128, 128, 0.8); color:white; font-size:11px; padding:4px 8px; border:1px solid white; border-radius:4px; cursor: pointer;">
                WAIT
            </button>
        `;
        document.body.appendChild(box);
    }

    // --- TIMER LOGIC ---
    function startCountdown(endTime) {
        let btn = document.getElementById('war-refresh');
        let display = document.getElementById('war-timer');

        btn.innerText = "REFRESH";
        btn.onclick = () => window.location.reload();

        display.style.color = "yellow";

        let interval = setInterval(() => {
            let now = Math.floor(Date.now() / 1000);

            // MATH: Exact time (0 Offset)
            let totalSeconds = (endTime - now) - TIME_SYNC_OFFSET;

            if (totalSeconds <= 0) {
                clearInterval(interval);
                display.innerText = "00:00";
                display.style.color = "#00FF00"; // Green

                // ATTACK MODE
                btn.innerText = "ATTACK";
                btn.style.backgroundColor = "rgba(0, 255, 0, 0.8)";
                btn.style.color = "black";
                btn.style.fontWeight = "bold";

                // Manual click required
                btn.onclick = function() {
                    let targetID = new URLSearchParams(window.location.search).get('user2ID');
                    window.location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${targetID}`;
                };

            } else {
                let h = Math.floor(totalSeconds / 3600);
                let m = Math.floor((totalSeconds % 3600) / 60);
                let s = Math.floor(totalSeconds % 60);

                let mStr = m < 10 ? "0" + m : m;
                let sStr = s < 10 ? "0" + s : s;

                if (h > 0) display.innerText = `${h}:${mStr}:${sStr}`;
                else display.innerText = `${mStr}:${sStr}`;
            }
        }, 500);
    }

})();
