// ==UserScript==
// @name         YMS Notes Tools
// @namespace    svvannak
// @version      2.3
// @description  Notes enhancements + YMS Code dropdown selector + UPSS email workflow
// @match        https://trans-logistics.amazon.com/yms/shipclerk*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/562032/YMS%20Notes%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/562032/YMS%20Notes%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*****************************************************************
     * YMS CODE LIST
     *****************************************************************/
    const YMS_GROUPS = [
        {
            label: 'Inbound',
            items: [
                ['Inbound Vendor', 'IBVEND'],
                ['Unsellables', 'IBUNSELL'],
                ['Customer Returns', 'IBCRET'],
                ['IB Problem Solve', 'IBPROBSOLV'],
                ['Transship', 'IBTRANS'],
                ['Undeliverables', 'IBUNDELIV'],
                ['Donations', 'IBDONATE'],
                ['Found Unknown Load', 'IBFOUNDLOADED'],
                ["Misship - Requires 'Case xxxx' documented in notes", 'IBMISSHIP\nCase: \n'],
                ["Rejection - Requires 'Case xxxx' documented in notes", 'IBREJECT\nISA/ISA:\nCase: \n']
            ]
        },
        {
            label: 'Outbound',
            items: [
                ['Outbound Loaded Not Past SDT', 'OBSCHED'],
                ['Outbound Late - In Yard Past SDT', 'OBLATE'],
                ['Outbound Misloaded', 'OBMISLOAD'],
                ['Outbound Vendor Returns', 'OBVRET'],
                ['Outbound Trailer Hand Off', 'OBTHO']
            ]
        },
        {
            label: 'IXD Outbound',
            items: [
                ['Completed OB Load <24 Hours from Completion', 'OBRTD'],
                ['Requires Transload', 'OBTRANSLOAD'],
                ['Virtually Departed', 'OBDEPARTED'],
                ['Outbound Recovery', 'OBRECOVERY']
            ]
        },
        {
            label: 'Non-Inventory',
            items: [
                ['Empty Go Carts', 'NICARTS'],
                ['Broken Go Carts', 'NIBADCARTS'],
                ['Empty Totes (Yellow)', 'NITOTES'],
                ['Broken Totes (Yellow)', 'NIBADTOTES'],
                ['Universal Pallets (Blue)', 'NIUPP'],
                ['Grocery Universal Plastic Pallets', 'NIFRESHGUPP'],
                ['Bad Universal Pallets (Blue)', 'NIBADUPP'],
                ['USPS Pallets', 'NIUSPS'],
                ['Oversized Pallets (AMXL)', 'NIAMXL'],
                ['Good Wood Pallets', 'NIWOOD'],
                ['Broken Wood Pallets', 'NIBADWOOD'],
                ['Consumables', 'NICONSUM'],
                ['Scrap metal, recyclable equipment', 'NIRECY']
            ]
        },
        {
            label: 'Empty',
            items: [
                ['IB 3P Empty (>24 hours)', 'IBEMPTY\nCase: \n'],
                ['OB 3P Empty (>24 hours)', 'OBEMPTY'],
                ['Non-Inventory Empty', 'NIEMPTY']
            ]
        },
        {
            label: 'Misc',
            items: [
                ['Approved Storage (No AZNG)', 'APSTORAGE'],
                ['Waste Management', 'WASTE'],
                ['Full Launch Trailer', 'FULLPOD'],
                ['Empty Launch Trailer', 'EMPTYPOD'],
                ['AZNG/AZNU Unauthorized Storage', 'NONAPSTORAGE'],
                ['Legal Hold', 'LEGALHOLD']
            ]
        },
        {
            label: 'AMXL ReLo',
            items: [
                ['Empty Removal Liquidation', 'RMVLIQEMPTY'],
                ['Empty Removal Recycle', 'RMVRECEMPTY'],
                ['Empty Removal LTL', 'RMVLTLEMPTY'],
                ['Empty Removal Donation', 'RMVDONEMPTY'],
                ['Removal Liquidation', 'RMVLIQ'],
                ['Removal Recycle', 'RMVREC'],
                ['Removal LTL', 'RMVLTL'],
                ['Removal Donation', 'RMVDON']
            ]
        }
    ];

    /*****************************************************************
     * HELPERS
     *****************************************************************/
    function clearNotes() {
        $("#noteTextArea").val("");
        $("#noteTextArea")[0].dispatchEvent(new Event("change"));
    }

    function updateTagStatus(status) {
        const ta = $("#noteTextArea");
        const current = ta.val().trim();
        ta.val(current ? current + "\n\n" + status : status);
        ta[0].dispatchEvent(new Event("change"));
    }

    // Try to pull yard parking/door/row info from the page
    function getYardLocation() {
        const text = $("#noteValues").text();

        // Common patterns: A-12, B-03, C-7, Row 12, Lane 3, Door 18
        const match = text.match(/\b([A-Z]-\d{1,2}|Row\s?\d+|Lane\s?\d+|Door\s?\d+)\b/i);

        return match ? match[0] : "Unknown Location";
    }

    /*****************************************************************
     * MAIN UI INJECTION
     *****************************************************************/
    function updateNotesDisplay() {
        $("#noteEditForm").each(function () {
            if ($("#superuserNotesDiv").length < 1) {

                const rawText = $("#noteValues :nth-child(3)").text();
                const thisID = rawText.match(/\b[A-Z0-9\-]+\b/)?.[0] || "";
                const noteText = $("#noteTextArea").val() || "";
                const now = new Date();
                const dateStr = now.toLocaleDateString();
                const timeStr = now.toLocaleTimeString();
                const scac = $("#noteValues .ng-binding:nth-child(2)").text().trim();

                const btnContainer = $("<div>", {
                    id: "notesButtonsHolder",
                    style: "margin-bottom: 6px; text-align: left; position: relative;"
                });

                /*************************************************************
                 * UPSS WORKFLOW (email instead of WO)
                 *************************************************************/
                if (scac === "UPSS") {

// UPSS Send Email (Outlook Web Compose URL - Compatible Version)
btnContainer.append(
    $("<p>", {
        class: "superuserButton blueButton",
        text: "Send Email"
    }).click(() => {

        const trailer = thisID;
        const siteAddress = "ONT2 1910 East Central Avenue San Bernardino, CA 92407";

        const ccList = [
            "tom-ont2@amazon.com",
            "tom-ont2-managers@amazon.com",
            "adrileal@amazon.com",
            "rccatano@amazon.com",
            "ont2-shipclerk@amazon.com"
        ].join("; ");

        const to = [
            "ups-dispatch-amazon-ont2@ups.com",
            "upsempcacpu@ups.com",
            "upsfdrontca@ups.com",
            "upsfdrontca@ups.com",
            "upsfreightamazon@ups.com"
        ].join(";");

        // Subject = container ID only
        const subject = encodeURIComponent(trailer);

        const body = encodeURIComponent(
`Details -

Please send tech for repairs or advise to load

Location:
${siteAddress}

-------------------------
CC (copy/paste into CC line and delete this portion):
${ccList}
-------------------------`
        );

        // Most compatible Outlook Web compose URL
        const url =
            `https://outlook.office.com/owa/?path=/mail/action/compose` +
            `&subject=${subject}` +
            `&to=${encodeURIComponent(to)}` +
            `&body=${body}`;

        window.open(url, "_blank");
    })
);

                    // UPSS Yellow Tag (no CASE line, includes email sent)
                    btnContainer.append(
                        $("<p>", {class: "superuserButton yellowButton", text: "Yellow Tag"})
                            .click(() => updateTagStatus(
                                "YELLOW TAGGED\nTAGGED BY: \nISSUE: \nEMAIL SENT AS OF: "
                                + dateStr + " " + timeStr + "\n"
                            ))
                    );

                    // UPSS Red Tag (no CASE line, includes email sent)
                    btnContainer.append(
                        $("<p>", {class: "superuserButton redButton", text: "Red Tag"})
                            .click(() => updateTagStatus(
                                "RED TAGGED\nTAGGED BY: \nISSUE: \nEMAIL SENT AS OF: "
                                + dateStr + " " + timeStr + "\n"
                            ))
                    );

                } else {

                    /*************************************************************
                     * NORMAL (NON‑UPSS) WORKFLOW
                     *************************************************************/

                    // Create WO
                    btnContainer.append(
                        $("<p>", {class: "superuserButton blueButton", text: "Create WO"})
                            .click(function() {
                                let scacCurrent = $("#noteValues .ng-binding:nth-child(2)").text().trim();

                                if (scacCurrent === "AZNG" || scacCurrent === "AZNU") {
                                    window.open(
                                        "https://aap-na.corp.amazon.com/page/891a81dc-538d-4f10-be93-441545840a24",
                                        "_blank"
                                    );
                                } else {
                                    window.open(
                                        "https://paragon-na.amazon.com/hz/create-case",
                                        "_blank"
                                    );
                                }
                            })
                    );

                    // AAP WO (if link exists)
                    let aapMatch = noteText.match(/https:\/\/aap-na\.corp\.amazon\.com\/v2\/service\/\S+/);
                    if (aapMatch) {
                        btnContainer.append(
                            $("<p>", {class: "superuserButton blueButton", text: "AAP WO"})
                                .click(() => window.open(aapMatch[0], "_blank"))
                        );
                    }

                    // Paragon WO (if link exists)
                    let paragonMatch = noteText.match(/https:\/\/paragon-na\.amazon\.com\/hz\/view-case\?caseId=\S+/);
                    if (paragonMatch) {
                        btnContainer.append(
                            $("<p>", {class: "superuserButton blueButton", text: "Paragon WO"})
                                .click(() => window.open(paragonMatch[0], "_blank"))
                        );
                    }

                    // Normal Yellow Tag
                    btnContainer.append(
                        $("<p>", {class: "superuserButton yellowButton", text: "Yellow Tag"})
                            .click(() => updateTagStatus(
                                "YELLOW TAGGED\nCASE: \nTAGGED BY: \nISSUE: \nNOTE ADDED DATE: "
                                + dateStr + "\nNOTE ADDED TIME: " + timeStr + "\n"
                            ))
                    );

                    // Normal Red Tag
                    btnContainer.append(
                        $("<p>", {class: "superuserButton redButton", text: "Red Tag"})
                            .click(() => updateTagStatus(
                                "RED TAGGED\nCASE: \nTAGGED BY: \nISSUE: \nNOTE ADDED DATE: "
                                + dateStr + "\nNOTE ADDED TIME: " + timeStr + "\n"
                            ))
                    );
                }

                /*************************************************************
                 * CLEAR NOTES
                 *************************************************************/
                btnContainer.append(
                    $("<p>", {class: "superuserButton whiteButton", text: "Clear Notes"})
                        .click(() => clearNotes())
                );

                /*************************************************************
                 * YMS CODE DROPDOWN BUTTON
                 *************************************************************/
                const ymsBtn = $("<p>", {
                    class: "superuserButton blueButton ymsCodeButton",
                    text: "YMS Code ▼",
                    style: "position: relative; display:inline-block;"
                });

                const ymsDropdown = $("<div>", {
                    id: "ymsDropdown",
                    style: `
                        display: none;
                        position: absolute;
                        background: white;
                        color: black;
                        font-size: 13px;
                        line-height: 1.6;
                        border: 1px solid #ccc;
                        padding: 8px;
                        border-radius: 4px;
                        margin-top: 4px;
                        z-index: 9999;
                        max-height: 260px;
                        overflow-y: auto;
                        width: 280px;
                    `
                });

                YMS_GROUPS.forEach(group => {
                    ymsDropdown.append(
                        $("<div>", {
                            text: group.label,
                            style: "font-weight:bold; margin-top:6px;"
                        })
                    );

                    group.items.forEach(([label, code]) => {
                        const item = $("<div>", {
                            text: `${code} – ${label}`,
                            style: "padding:4px 0; cursor:pointer;"
                        });

                        item.hover(
                            function(){ $(this).css("background","#eef"); },
                            function(){ $(this).css("background","transparent"); }
                        );

                        item.click(function () {
                            const ta = $("#noteTextArea");
                            const existing = ta.val().trim();
                            ta.val(existing ? existing + "\n" + code : code);
                            ta[0].dispatchEvent(new Event("change"));
                            ymsDropdown.hide();
                        });

                        ymsDropdown.append(item);
                    });
                });

                ymsBtn.click(() => ymsDropdown.toggle());
                ymsBtn.append(ymsDropdown);
                btnContainer.append(ymsBtn);

                // Auto-close dropdown when clicking outside
                $(document).on("click", function (e) {
                    if (!$(e.target).closest("#ymsDropdown, .ymsCodeButton").length) {
                        $("#ymsDropdown").hide();
                    }
                });

                $("#noteTextArea").closest("div").prepend(btnContainer);
                $(this).append($("<div>", {id: "superuserNotesDiv"}));
            }
        });
    }

    /*****************************************************************
     * BUTTON STYLES
     *****************************************************************/
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