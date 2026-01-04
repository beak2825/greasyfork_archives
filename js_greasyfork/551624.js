// ==UserScript==
// @name         TMN DTM
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  TMN DTM Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/organizedcrime.aspx?p=dtm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551624/TMN%20DTM.user.js
// @updateURL https://update.greasyfork.org/scripts/551624/TMN%20DTM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const lblMsg = $("#ctl00_lblMsg").text();
    //You are in the wrong location, unable to travel, or are already in a DTM.
    const btnComplete = $("#ctl00_main_btnCompleteDTM")[0];
    if ((!lblMsg[0] || lblMsg.includes("successfully accepted") || lblMsg.includes("You've started ")) && ($("#ctl00_main_pnlDTMParticipant")[0] || $("#ctl00_main_pnlDTMLeader")[0])) {
        const leading = $("#ctl00_main_pnlDTMLeader")[0] || btnComplete;
        const TMN_PIC = localStorage.getItem("TMN_PIC");
        let quantity = leading && $("#ctl00_main_pnlDTMLeader")[0].textContent || $("#ctl00_main_pnlDTMParticipant")[0].textContent;
        quantity = quantity.split("carry is ")[1].split("\n")[0] * 1;
        const quantiyInput = $("#ctl00_main_tbDrugAmount")[0] && $("#ctl00_main_tbDrugAmount") || $("#ctl00_main_tbDrugLAmount");
        const buyBtn = $("#ctl00_main_btnBuyLDrugs")[0] || $("#ctl00_main_btnBuyDrugs")[0];
        if (leading) {
            if (!$("#btnAutomate")[0]) {
                $(`<input type="button" value="Automate" id="btnAutomate">`).insertAfter("#ctl00_main_btnInviteMember");
                $("#btnAutomate").on("click", () => {
                    const participantInput = $("#ctl00_main_tbParticipant");
                    participantInput[0].value = participantInput[0].value == "" ? TMN_PIC : participantInput[0].value;
                    $("#ctl00_main_btnInviteMember").click();
                });
            }
            const participantStatus = $("#ctl00_main_lblParticipantStatus").text();
            const commanderStatus = $("#ctl00_main_lbldCommanderStatus").text();
            if (participantStatus == "Open") {
                return;
            } else if (!participantStatus.includes("Ready")) {
                setTimeout(() => { location.href = location.href }, Math.random() * 2000 + 3000);
            } else if (!commanderStatus.includes("Ready")) {
                quantiyInput.val(quantity);
                setTimeout(() => { buyBtn.click() }, 5000);
            } else {
                if (btnComplete) {
                    btnComplete.click();
                }
            }
        }
    } else if (lblMsg.includes("successfully bought") || lblMsg.includes("Invalid request") || lblMsg.includes("wrong location") ||lblMsg.includes("You successfully traveled") || btnComplete) {
        if (btnComplete) {
            btnComplete.click();
        } else {
            setTimeout(() => { location.href = "default.aspx" }, Math.random() * 2000 + 3000);
        }
    } else if (lblMsg.includes("jail") || lblMsg.includes("has been invited to your DTM.")) {
        setTimeout(() => { location.href = location.href }, Math.random() * 2000 + 3000);
    }
})();