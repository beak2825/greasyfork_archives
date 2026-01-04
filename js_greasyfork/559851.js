// ==UserScript==
// @name         Nitro Type Racer Stats Sidebar (Draggable)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows racer stats in a draggable sidebar on NitroType
// @match        https://www.nitrotype.com/*
// @grant        GM_xmlhttpRequest
// @connect      nitrotype.com
// @downloadURL https://update.greasyfork.org/scripts/559851/Nitro%20Type%20Racer%20Stats%20Sidebar%20%28Draggable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559851/Nitro%20Type%20Racer%20Stats%20Sidebar%20%28Draggable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Create Sidebar ---
    const sidebar = document.createElement("div");
    sidebar.id = "nt-stats-sidebar";
    sidebar.style.right = "-220px"; // default hidden position

    sidebar.innerHTML = `
        <div id="nt-tab">Stats</div>
        <div id="nt-content"><h3>Racer Stats</h3><div id="nt-list">Waiting for race...</div></div>
    `;
    document.body.appendChild(sidebar);

    // --- Sidebar Styles ---
    const style = document.createElement("style");
    style.textContent = `
        #nt-stats-sidebar {
            position: fixed;
            top: 50%;
            width: 220px;
            transform: translateY(-50%);
            background: #111;
            color: white;
            border-left: 2px solid #f80;
            transition: right 0.3s ease;
            font-family: Arial, sans-serif;
            z-index: 99999;
            padding-top: 5px;
        }
        #nt-tab {
            position: absolute;
            left: -50px;
            top: 0;
            width: 50px;
            background: #f80;
            color: black;
            padding: 10px;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
            user-select: none;
        }
        #nt-content {
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
        }
        .nt-player {
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #444;
        }
    `;
    document.head.appendChild(style);

    // --- Toggle Sidebar ---
    document.getElementById("nt-tab").onclick = () => {
        sidebar.style.right = sidebar.style.right === "0px" ? "-220px" : "0px";
    };

    // --- Make Sidebar Draggable ---
    (function() {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const elmnt = sidebar;

        document.getElementById("nt-tab").onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    })();

    // --- Fetch Racer Stats ---
    function fetchStats(username) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.nitrotype.com/racer/${username}`,
                onload: res => {
                    const html = res.responseText;

                    const speed = html.match(/"avgSpeed":(\d+)/)?.[1] || "N/A";
                    const races = html.match(/"racesPlayed":(\d+)/)?.[1] || "N/A";
                    const accuracy = html.match(/"accuracy":(\d+)/)?.[1] || "N/A";

                    resolve({ username, speed, races, accuracy });
                }
            });
        });
    }

    // --- Detect Racers in Lobby ---
    async function updateStats() {
        const list = document.getElementById("nt-list");
        list.innerHTML = "Loading...";

        const racerEls = document.querySelectorAll(".raceOpponent .name, .raceYourCar .name");
        const usernames = [...racerEls].map(el => el.textContent.trim());

        if (usernames.length === 0) {
            list.innerHTML = "No racers detected.";
            return;
        }

        const stats = await Promise.all(usernames.map(fetchStats));

        list.innerHTML = stats.map(s => `
            <div class="nt-player">
                <strong>${s.username}</strong><br>
                Speed: ${s.speed} WPM<br>
                Races: ${s.races}<br>
                Accuracy: ${s.accuracy}%
            </div>
        `).join("");
    }

    // --- Auto-update when race loads ---
    const observer = new MutationObserver(() => {
        if (document.querySelector(".raceOpponent")) {
            updateStats();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
