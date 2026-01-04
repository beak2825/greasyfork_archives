// ==UserScript==
// @name         YMS Notes Tools Only
// @namespace    svvannak
// @version      1.8
// @description  Standalone Notes enhancements from YMS Superuser
// @match        https://trans-logistics.amazon.com/yms/shipclerk*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/554576/YMS%20Notes%20Tools%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/554576/YMS%20Notes%20Tools%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

function clearNotes() {
    var currentNotes = $("#noteTextArea").val();
    var splitIndex = currentNotes.indexOf("\n\n");
    var filteredNotes = splitIndex !== -1 ? currentNotes.slice(splitIndex + 2) : currentNotes;
    $("#noteTextArea").val(filteredNotes);
    $("#noteTextArea")[0].dispatchEvent(new Event("change"));
}


    function updateTagStatus(status) {
        var currentNotes = $("#noteTextArea").val();
        var lines = currentNotes.split("\n");
        var newNotes = status + "\n" + lines.join("\n");
        $("#noteTextArea").val(newNotes);
        $("#noteTextArea").get(0).dispatchEvent(new Event("change"));
    }

    function updateNotesDisplay() {
        $("#noteEditForm").each(function () {
            if ($("#superuserNotesDiv").length < 1) {
                var rawText = $("#noteValues :nth-child(3)").text();
                var thisID = rawText.match(/\b[A-Z0-9\-]+\b/)?.[0] || "";
                var noteText = $("#noteTextArea").val() || "";
                var now = new Date();
                var dateStr = now.toLocaleDateString();
                var timeStr = now.toLocaleTimeString();

                // Container directly above the textarea, flush left
                var btnContainer = $("<div>", {
                    id: "notesButtonsHolder",
                    style: "margin-bottom: 6px; text-align: left;"
                });

// Get SCAC from the second div in #noteValues
let scac = $("#noteValues .ng-binding:nth-child(2)").text().trim();

// Only show AAP-related buttons if SCAC is AZNG or AZNU
if (scac === "AZNG" || scac === "AZNU") {
    // View Unplanned Services
    btnContainer.append(
        $("<p>", {class: "superuserButton blueButton", text: "View Unplanned Services"})
            .click(function(){
                window.open(
                    "https://aap-na.corp.amazon.com/page/817ca098-8441-4329-a71e-6768f9d7e6c5?ids="
                    + thisID + "&tab=Unplanned",
                    "_blank"
                );
            })
    );

    // View Planned Services
    btnContainer.append(
        $("<p>", {class: "superuserButton blueButton", text: "View Planned Services"})
            .click(function(){
                window.open(
                    "https://aap-na.corp.amazon.com/page/817ca098-8441-4329-a71e-6768f9d7e6c5?ids="
                    + thisID,
                    "_blank"
                );
            })
    );
}

// Create WO (conditional on SCAC)
btnContainer.append(
    $("<p>", {class: "superuserButton blueButton", text: "Create WO"})
        .click(function() {
            let scac = $("#noteValues .ng-binding:nth-child(2)").text().trim();
            console.log("Detected SCAC:", scac); // Optional debug log

            if (scac === "AZNG" || scac === "AZNU") {
                // Open AAP page
                window.open(
                    "https://aap-na.corp.amazon.com/page/891a81dc-538d-4f10-be93-441545840a24",
                    "_blank"
                );
            } else {
                // Open Paragon page
                window.open(
                    "https://paragon-na.amazon.com/hz/create-case",
                    "_blank"
                );
            }
        })
);



                // AAP WO (if link exists in note text)
                let aapMatch = noteText.match(/https:\/\/aap-na\.corp\.amazon\.com\/v2\/service\/\S+/);
                if (aapMatch) {
                    btnContainer.append(
                        $("<p>", {class: "superuserButton blueButton", text: "AAP WO"})
                            .click(function(){ window.open(aapMatch[0], "_blank"); })
                    );
                }

                // Paragon WO (if link exists in note text)
                let paragonMatch = noteText.match(/https:\/\/paragon-na\.amazon\.com\/hz\/view-case\?caseId=\S+/);
                if (paragonMatch) {
                    btnContainer.append(
                        $("<p>", {class: "superuserButton blueButton", text: "Paragon WO"})
                            .click(function(){ window.open(paragonMatch[0], "_blank"); })
                    );
                }

                // Yellow Tag with auto date/time
                btnContainer.append(
                    $("<p>", {class: "superuserButton yellowButton", text: "Yellow Tag"})
                        .click(function(){
                            updateTagStatus(
                                "YELLOW TAGGED\nCASE: \nTAGGED BY: \nISSUE: \nNOTE ADDED DATE: " + dateStr + "\nNOTE ADDED TIME: " + timeStr + "\n"
                            );
                        })
                );

                // Red Tag with auto date/time
                btnContainer.append(
                    $("<p>", {class: "superuserButton redButton", text: "Red Tag"})
                        .click(function(){
                            updateTagStatus(
                                "RED TAGGED\nCASE: \nTAGGED BY: \nISSUE: \nNOTE ADDED DATE: " + dateStr + "\nNOTE ADDED TIME: " + timeStr + "\n"
                            );
                        })
                );

                // Clear Notes
                btnContainer.append(
                    $("<p>", {class: "superuserButton whiteButton", text: "Clear Notes"})
                        .click(function(){ clearNotes(); })
                );

                // Insert container directly before the textarea
                $("#noteTextArea").closest("div").prepend(btnContainer);

                // Marker div to prevent reinjection
                $(this).append($("<div>", {id: "superuserNotesDiv"}));
            }
        });
    }

    // Minimal CSS for buttons
    const styles = `
        #notesButtonsHolder .superuserButton {
            display: inline-block;
            padding: 4px 8px;
            margin: 2px 4px 2px 0;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        }
        .blueButton { background: #0073e6; color: white; }
        .yellowButton { background: #ffcc00; color: black; }
        .redButton { background: #cc0000; color: white; }
        .whiteButton { background: white; color: black; border: 1px solid #ccc; }
    `;
    $("<style>").text(styles).appendTo("head");

    setInterval(updateNotesDisplay, 1500);

})();
