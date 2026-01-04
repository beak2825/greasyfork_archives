// ==UserScript==
// @name         Game Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Exports the selected gamechat tab to text
// @author       JK_3
// @match        https://www.warzone.com/MultiPlayer?GameID=*
// @icon         https://icons.duckduckgo.com/ip2/warzone.com.ico
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/553786/Game%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/553786/Game%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // Global vars
    var includeTurnIndicators = true
    var includeTimestamps = false;
    var shortenNames = false;
    var maxNameLength = NaN;

    // Helper functions
    function processChatMessage(message) {
        let text = message.querySelector("[id^=ujs_MessageLabel][id$=_tmp]").innerText;
        let user = message.querySelector("[id^=ujs_PlayerNameLabel][id$=_tmp]").innerText;
        let time = message.querySelector("[id^=ujs_TimestampLabel][id$=_tmp]").innerText;

        let userNameAndTime = "";
        if (user) {
            userNameAndTime += shortenNames ? user.substring(0, maxNameLength) : user;
        }

        if (includeTimestamps) {
            userNameAndTime += " @ " + (new Date(time)).toISOString().replace("T", " ").substring(0, 19);
        }

        if (userNameAndTime.length > 0) {
            userNameAndTime += " : "
        }

        return userNameAndTime + text;
    }

    function processChatTurnSeperator(turnSeperator) {
        let text = turnSeperator.querySelector("[id^=ujs_TurnLabel][id$=_tmp]").innerText;
        let numberOfDashes = Math.round((50 - text.length - 2) / 2);
        let dashes = "-".repeat(numberOfDashes);
        return `${dashes} ${text} ${dashes}`
    }

    // Main function
    function exportSelectedChat() {
        let activeChat = Array.from(document.querySelectorAll(".ujsGameObject[id^=ujs_ChatTab]")).filter(t => t.style.display != "none").at(0)?.querySelector("div[id^=ujs_Content]");

        let output = [];
        for (let message of activeChat.children) {
            if (message.id.includes("ChatMessage")) {
                output.push(processChatMessage(message));
            } else if (includeTurnIndicators && message.id.includes("ChatTurnSeperator")) {
                output.push(processChatTurnSeperator(message));
            }
        }

        return output.join("\n");
    }

    // Create displayable dialog
    const dialog = document.createElement("dialog");
    dialog.id = "options-panel";
    dialog.style.background = "white";
    dialog.style.color = "black";
    dialog.style.borderRadius = "10px";
    dialog.style.padding = "1.5rem";
    dialog.style.textAlign = "left";

    dialog.innerHTML = `
        <h3 style="margin-top:0;">Chat exporter</h3>
        <p>Exports the selected chat tab to a text field you can copy.</p>

        <div id="includeTurnIndicatorsDiv">
            <label for="includeTurnIndicators">Include turn indicators?</label>
            <input type="checkbox" id="includeTurnIndicators" checked/>
        </div>

        <div id="includeTimestampsDiv">
            <label for="includeTimestamps">Include timestamps?</label>
            <input type="checkbox" id="includeTimestamps"/>
        </div>

        <div id="shortenNamesDiv">
            <label for="shortenNames">Shorten names?</label>
            <input type="checkbox" id="shortenNames"/>
        </div>

        <div id="maxNameLenghtDiv" style="display:none;">
            <label for="maxNameLength">Max name length:</label>
            <input type="number" id="maxNameLength" min="1" value="15" style="width:60px;" />
        </div>

        <div style="margin-bottom:0.8rem;">
            <textarea id="outputText" style="display:none; margin-bottom:0.8rem; height:200px; width:100%" readonly></textarea>
        </div>

        <div style="text-align:center;">
            <button id="runBtn" style="background-color:blue;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;">Run</button>
            <button id="closeBtn" style="background-color:lightgray;color:black;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer; margin-left:0.5rem;">Close</button>
        </div>
    `;

    // Behavior
    const includeTurnIndicatorsCheckBox = dialog.querySelector("#includeTurnIndicators");
    const includeTimeStampsCheckBox = dialog.querySelector("#includeTimestamps");
    const shortenNamesCheckbox = dialog.querySelector("#shortenNames");
    const maxLengthInputDiv = dialog.querySelector("#maxNameLenghtDiv");
    const runBtn = dialog.querySelector("#runBtn");
    const closeBtn = dialog.querySelector("#closeBtn");
    const outputText = dialog.querySelector("#outputText");

    shortenNamesCheckbox.addEventListener("change", () => {
        maxLengthInputDiv.style.display = shortenNamesCheckbox.checked ? "block" : "none";
    });

    runBtn.addEventListener("click", () => {
        // Update the settings
        includeTurnIndicators = includeTurnIndicatorsCheckBox.checked;
        includeTimestamps = includeTimeStampsCheckBox.checked;
        shortenNames = shortenNamesCheckbox.checked;
        let maxNameLengthText = shortenNames ? dialog.querySelector("#maxNameLength").value : null;
        maxNameLength = parseInt(maxNameLengthText);
        shortenNames = shortenNames && !isNaN(maxNameLength);

        // Update display
        let result = exportSelectedChat();
        if (result) {
            outputText.value = result;
            outputText.style.color = "black";
        } else {
            outputText.value = "No chats were loaded, either because you didn't select a chat tab to become active or because your selected chat didn't have any messages.";
            outputText.style.color = "red";
        }
        outputText.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        dialog.remove();
    });

    // Show the dialog
    document.body.appendChild(dialog);
    dialog.showModal();
})();
