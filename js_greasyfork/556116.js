// ==UserScript==
// @name         UniteAPI Ranked WR Injector
// @namespace    https://yeehoiimeenoiiii.com
// @version      1.2
// @license      MIT
// @description  Show ranked WR on UniteAPI player page
// @match        https://uniteapi.dev/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556116/UniteAPI%20Ranked%20WR%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/556116/UniteAPI%20Ranked%20WR%20Injector.meta.js
// ==/UserScript==
let clickListenerAttached = false;

function modifyPage() {
    if (!location.pathname.startsWith("/p/")) return;
    setTimeout(() => {
        console.log("modifyPage called, current path:", location.pathname);
        // Get fresh queries
        let statsBox = document.querySelector(".sc-504963e2-2.btGQnE");
        // Check if statsBox exists
        if (!statsBox) {
            console.log("statsBox not found yet, skipping this run");
            return;
        }
        let statsBoxContent = statsBox.querySelectorAll("div");
        // Checks if exists
        if (statsBoxContent.length < 4) {
            console.log("statsBoxContent incomplete, skipping this run");
            return;
        }
        for (let i = 0; i < statsBoxContent.length; i++) {}
        let playerName = document.querySelector(".sc-6d6ea15e-1.gpvunk").innerText;
        let playerStats = document.querySelectorAll(".sc-6d6ea15e-1.sc-10fb34f9-1.SarYu.dzkbmM");
        for (let i = 0; i < playerStats.length; i++) {}
        let totalBattles = parseFloat(playerStats[2].innerText)
        let numOfWins = parseFloat(playerStats[3].innerText)
        let rankedWr = numOfWins / totalBattles;
        let finalWr = Number((rankedWr * 100).toFixed(2));
        if (!document.getElementById("wrLabel")) {
            statsBoxContent[3].insertAdjacentHTML(
                "afterend",
                `
                <div class="sc-10fb34f9-0 flAlGE">
                    <p id="wrLabel" class="sc-6d6ea15e-3 hxGuyl">
                        Ranked Win Rate %
                    </p>
                    <p id="wrColor"class="sc-6d6ea15e-1 sc-10fb34f9-1 SarYu dzkbmM">
                        ${finalWr}%
                    </p>
                </div>
                `
            )
        }
        // Styling
        let varWrColor = document.getElementById("wrColor")
        let varWrLabel = document.getElementById("wrLabel")

        function stylingWr() {
            if (finalWr > 60) {
                varWrColor.style.setProperty("color", "#00cc14ff", "important")
                varWrLabel.style.setProperty("color", "#00cc14ff", "important")
                varWrLabel.style.setProperty("font-weight", "bold")
            } else if (finalWr < 60 && finalWr > 50) {
                varWrColor.style.setProperty("color", "#e3ecbdff", "important")
                varWrLabel.style.setProperty("color", "#e3ecbdff", "important")
                varWrLabel.style.setProperty("font-weight", "bold")
            } else if (finalWr < 50) {
                varWrColor.style.setProperty("color", "#ff4949ff", "important")
                varWrLabel.style.setProperty("color", "#ff4949ff", "important")
                varWrLabel.style.setProperty("font-weight", "bold")
            }

        }
        stylingWr();

    }, 2500)
    // Match Button Click Listener
    const rankedStats = document.querySelector(".sc-34a5201c-0.fSlRro")
    const rankedStatsButton = rankedStats.querySelectorAll("div");

    for (let i = 0; i < rankedStatsButton.length; i++) {
        console.log("Llamas");
    }
    rankedStatsButton[0].id = "imUnique"
    let listenBtn = document.getElementById("imUnique");

    if (!clickListenerAttached) {
        listenBtn.addEventListener("click", () => {
            console.log("You clicked the matches button!");
            const moddedRowExists = document.getElementById("wrLabel");

            if (moddedRowExists) {
                console.log("A modded row exists,not adding new one");
            } else {
                console.log("A modded row does not exist, re-creating...");
                modifyPage();

                setTimeout(() => {
                    const check = document.getElementById("imUnique");
                    if (check) {
                        console.log("Win rate row successfully added")
                    } else {
                        console.log("For unknown reasons, win rate row could not be added.")
                    }
                }, 1500);
            } // ← closes "else"

        }); // ← closes addEventListener

        clickListenerAttached = true;
    } // ← closes if (!clickListenerAttached)
}




    // Initial run after full load
    window.addEventListener("load", () => {
        if (!location.pathname.startsWith("/p/")) {
            console.log("Not on a user profile, not executing initial run.");
        } else {

            console.log("User profile detected, running magic...")
            modifyPage();
        }
    });

    let lastUrl = location.href;

    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log("URL changed to:", lastUrl);
            // optional delay before running
            setTimeout(() => {
                modifyPage();
            }, 500);
        }
    }, 500); // or 1000/1500 ms if you prefer