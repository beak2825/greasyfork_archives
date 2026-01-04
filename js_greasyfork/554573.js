// ==UserScript==
// @name         YMS Design Changes V4 Edits by Van
// @namespace    https://phonetool.amazon.com/users/svvannak
// @version      0.4.0
// @description  Various design changes to make the YMS Dashboard neater, easier and more functional with independent clickable SCACs and full feature set.
// @author       Original johjason, Edited by Van
// @match        https://trans-logistics.amazon.com/yms/shipclerk/*
// @icon         https://images-na.ssl-images-amazon.com/images/G/01/TransCentral/images/favicon.ico
// @resource     REMOTE_CSS https://drive.corp.amazon.com/view/TOM%20Utilities/TamperMonkey/YMS%20Design%20Changes/newstyle.css?ver=1.5
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554573/YMS%20Design%20Changes%20V4%20Edits%20by%20Van.user.js
// @updateURL https://update.greasyfork.org/scripts/554573/YMS%20Design%20Changes%20V4%20Edits%20by%20Van.meta.js
// ==/UserScript==

/* globals $ */

(function(window, document, undefined) {
    window.onload = init;

    GM_addStyle(GM_getResourceText("REMOTE_CSS"));
    GM_addStyle(`
        #trailerdashboard h2 {
            margin: 0px 0 12px 0;
        }
        #trailerdashboard div[id^="empty"] {
            display: inline-block;
            margin-left: 8px;
        }
        .clickable-scac {
            cursor: pointer;
            text-decoration: underline;
            user-select: none;
        }
    `);

    function init() {
        'use strict';

        document.getElementById('mainContainer').insertAdjacentHTML('beforebegin', `
            <div id="custom-options-container" style="margin-bottom: 12px; margin-left: 20px; display: flex; align-items: center; gap: 24px; font-weight: 600; font-family: Arial, sans-serif;">
                <label style="display: flex; align-items: center; cursor: pointer; user-select: none;">
                    Tagged Trailers:
                    <input id="filterTrailer-toggle" type="checkbox" style="margin-left: 8px;">
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; user-select: none;">
                    Show 3P Owner/Operator Breakdown:
                    <input type="checkbox" id="toggle3POwners" style="margin-left: 8px;" />
                </label>
            </div>
        `);

document.getElementById('filterTrailer-toggle').addEventListener('change', function() {
    $("#ship-clerk-dashboard-table tbody tr").show();
    const filter = $(".flex-container.row").filter((_, el) => {
        // Hide rows that have NO yellow/red tag, or only have storage
        const hasTag = $(el).children(".yard-asset-yellow,.yard-asset-red").length > 0;
        const hasStorage = $(el).children(".yard-asset-storage").length > 0;
        return !hasTag || hasStorage;
    const combined = filter;
    $(combined).closest('tr').not("tr tr").toggle(!this.checked);
});

            const emptyCol2 = $(".masterYardLP td:nth-child(2):not('[class^=col2]')");
            const combined = filter.add(emptyCol2);
            $(combined).closest('tr').not("tr tr").toggle(!this.checked);
        });

        if (window.location.href.includes("shipclerk/#/yard")) {
            document.styleSheets[0].insertRule('.note-present-icon {flex-shrink: 0;}');

            // Initial SCAC values (customizable)
            let scacEmpty1 = "AZNG";
            let scacEmpty2 = "AZNU";
            let scacTagged1 = "AZNG";
            let scacTagged2 = "AZNU";

            document.getElementById('mainContainer').insertAdjacentHTML('beforebegin', `
                <div id="trailerdashboard" style="margin-left: 20px;">
                    <h2>
                        <div id="psempties" style="display: flex; flex-direction: column; align-items: center; margin: 2px 0;">
                            <div style="font-weight: 600;">Empties in PS:</div>
                            <div style="margin-top: 4px;">
                                <span class="clickable-scac" id="scacEmpty1" title="Click me to change SCAC">${scacEmpty1}</span>: <span id="azngcount" class="empty" style="color: #e47911;">0</span> |
                                <span class="clickable-scac" id="scacEmpty2" title="Click me to change SCAC">${scacEmpty2}</span>: <span id="aznucount" class="empty" style="color: #e47911;">0</span>
                            </div>
                        </div>
                    </h2>
                    <h2>
                        <div id="taggedtrailers" style="display: flex; flex-direction: column; align-items: center; margin: 2px 0;">
                            <div style="font-weight: 600;">Tagged:</div>
                            <div style="margin-top: 4px;">
                                <span class="clickable-scac" id="scacTagged1" title="Click me to change SCAC">${scacTagged1}</span>: <span id="taggedazngcount" class="empty" style="color: #e47911;">0</span> |
                                <span class="clickable-scac" id="scacTagged2" title="Click me to change SCAC">${scacTagged2}</span>: <span id="taggedaznucount" class="empty" style="color: #e47911;">0</span>
                            </div>
                        </div>
                    </h2>
                    <h2>
                        <div id="openslips" style="display: flex; flex-direction: column; align-items: center; margin: 2px 0;">
                            <div style="font-weight: 600;">Open Slips:</div>
                            <div style="margin-top: 4px;">
                               <span id="slipfullcount">
<span id="sliplabelwrapper">
  ON:
</span>
<span id="onslipcount" class="empty" style="color: #e47911;">0</span>
<span id="pipewrapper"> | </span>
<span id="offlabelwrapper">
  OFF: <span id="offslipcount" class="empty" style="color: #e47911;">0</span>
</span>
                            </div>
                        </div>
                    </h2>
                    <h2><div id="nonazng" style="margin: 2px 0;">3P Empties: <div id="empty">0</div></div></h2>
                    <h2><div id="nicarts" style="margin: 2px 0;">NICART: <div id="empty">0</div></div></h2>
                </div>
            `);

            function promptForScac(currentScac) {
                const newScac = prompt(`Enter SCAC to replace ${currentScac}:`, currentScac);
                if (newScac && newScac.trim() !== "") {
                    return newScac.trim().toUpperCase();
                }
                return currentScac;
            }

            function updateCounts() {
                let nicarts = 0;
                let emptySCAC1inPS = 0, emptySCAC2inPS = 0;
                let taggedazng = 0, taggedaznu = 0;
                let onSlipCount = 0, offSlipCount = 0;

                // --- Add the helper here ---
    function parseTimeToMinutes(timeText) {
        timeText = timeText.trim().toLowerCase();

        if (timeText.includes("a year")) return 60 * 24 * 366;
        if (timeText.includes("a month")) return 60 * 24 * 31;

        let totalMinutes = 0;

        const dayMatch = timeText.match(/(\d+)\s*d/);
        if (dayMatch) totalMinutes += parseInt(dayMatch[1], 10) * 24 * 60;

        const timeMatch = timeText.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) totalMinutes += parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);

        return totalMinutes;
    }
    // --- End helper ---

                // Loop through all rows for open slips
                $("tr").each(function() {
                    const $row = $(this);
                    const $slipAnchor = $row.find('a.ng-binding').first();
                    if ($slipAnchor.length === 0) return;

                    const slipText = $slipAnchor.text().trim().toUpperCase();

                    // ON/OFF Slip counts (ONT5-PS is OFF, PS or WS is ON, skip TP)
                    if (/^[A-Z]{2,5}-PS/.test(slipText)) {
                        if ($row.hasClass("empty-location")) offSlipCount++;
                        return;
                    }
                    if (!slipText.startsWith("PS") && !slipText.startsWith("WS") && !slipText.startsWith("DD")) return;
                    if (slipText.startsWith("TP")) return;

                    if ($row.hasClass("empty-location")) onSlipCount++;
                });

                // 3P Owners List and SCAC Groups
                const owners3PList = ["ATMI", "CDSEX", "CDSTR", "CDDF", "IMJBH", "IMSJX", "IMJEX", "IMPHD", "IMPRK", "RDKA", "PGLT", "RDXY", "STQM", "XPDR"];
                const ownerCounts = Object.fromEntries(owners3PList.map(op => [op, 0]));

                const scacGroups = {
                    "ATMI": 0,
                    "CDDF/CDSEX/CDSTR": 0,
                    "IMJBH/IMSJX/IMJEX": 0,
                    "IMPHD": 0,
                    "IMPRK/ROKA": 0,
                    "PGLT": 0,
                    "RDXY": 0,
                    "STQM": 0,
                    "XPDR": 0
                };

                // New: Map to hold vehicle/time info for each SCAC group
                const scacGroupDetails = {};
                Object.keys(scacGroups).forEach(group => {
                    scacGroupDetails[group] = [];
                });

                // Loop through all rows to count and collect info
                $('tr.ng-scope').each(function() {
                    const $row = $(this);

// Empties in PS count by scacEmpty1 and scacEmpty2 (exclude tagged trailers with yellow/red/storage tags)
if (
    $row.find('.location-type-ParkingLocation').length > 0 &&
    $row.find('.yardasset-empty').length > 0 &&
    $row.find('.yard-asset-yellow, .yard-asset-red, .yard-asset-storage').length === 0
) {
    const scacText = $row.find('.ownerOperatorCodeGroup').text().toUpperCase();
    if (scacText.includes(scacEmpty1)) emptySCAC1inPS++;
    if (scacText.includes(scacEmpty2)) emptySCAC2inPS++;
}

// Tagged trailers = any with yellow or red tag (exclude storage)
if (
    $row.find('.yard-asset-yellow, .yard-asset-red').length > 0 &&
    $row.find('.yard-asset-storage').length === 0
) {
    const scacText = $row.find('.ownerOperatorCodeGroup').text().toUpperCase();
    if (scacText.includes(scacTagged1)) taggedazng++;
    if (scacText.includes(scacTagged2)) taggedaznu++;
}


                    // Count NICARTS
                    const html = $row.html();
                    if ((html.includes("TransfersEmptyCar") || html.match(/NICARTS/i)) && !html.includes("yard-asset-icon-TRACTOR")) {
                        nicarts++;
                    }

                    // Count 3P empties owners and collect vehicle/time info per SCAC group
                    if ($row.find('.yardasset-empty').length > 0) {
                        owners3PList.forEach(op => {
                            if ($row.find(`.ownerOperatorCodeGroup :contains("${op}")`).length) {
                                ownerCounts[op]++;
                            }
                        });

                        for (const group of Object.keys(scacGroups)) {
                            const groupSCACs = group.split('/');
                            if (groupSCACs.some(scac => $row.find(`.ownerOperatorCodeGroup :contains("${scac}")`).length)) {
                                scacGroups[group]++;

// --- Collect vehicleId and timeInYard for copy breakdown ---
const vehicleId = $row.find('.vehicleIdGroup-LP .ng-binding').first().text().trim();
const timeInYardText = $row.find('[yms-time-elapsed]').text().trim();
const totalMinutes = parseTimeToMinutes(timeInYardText);

// Use your existing yard location selector
const assetLocation = $row.find('.short-name-distinguished a').text().trim() || 'Unknown';

scacGroupDetails[group].push({
    location: assetLocation,
    vehicleId,
    timeInYard: timeInYardText,
    totalMinutes
});

                            }
                        }
                    }
                });

                // Update UI counts
                $('#azngcount').text(emptySCAC1inPS);
                $('#aznucount').text(emptySCAC2inPS);
                $('#taggedazngcount').text(taggedazng);
                $('#taggedaznucount').text(taggedaznu);
let onSlipTotal = 0;
let onSlipAvailable = 0;
let offSlipTotal = 0;
let offSlipAvailable = 0;

$('tr:has(td.shipclerk-dashboard-vertical-separator)').each(function () {
    const $row = $(this);
    const $slipAnchor = $row.find('a.ng-binding').first();
    if ($slipAnchor.length === 0) return;

    const slipText = $slipAnchor.text().trim().toUpperCase();
    if (
        !slipText.startsWith("PS") &&
        !slipText.startsWith("WS") &&
        !slipText.startsWith("ONT5-PS") &&
        !/^DD\d+/.test(slipText) && // Don't want to count DD slips as "open"
        !slipText.startsWith("TP") // Include TP slips
    ) return;

    const isAvailable = $row.hasClass("empty-location");

    if (/^[A-Z0-9]{2,5}-PS/.test(slipText)) {
        // OFF slip like ONT5-PS01
        offSlipTotal++;
        if (isAvailable) offSlipAvailable++;
    } else if (
        slipText.startsWith("PS") ||
        slipText.startsWith("WS") ||
        slipText.startsWith("DD") ||
        slipText.startsWith("TP")  // Include TP slips here
    ) {
        // ON slip (includes TP)
        onSlipTotal++;
        if (isAvailable) onSlipAvailable++;
    }
});


const onSlipUsed = onSlipTotal - onSlipAvailable;
const offSlipUsed = offSlipTotal - offSlipAvailable;

function getUsageColor(percentUsed) {
    if (percentUsed <= 24) return 'green';
    if (percentUsed <= 50) return 'blue';
    if (percentUsed <= 75) return 'orange';
    return 'red';
}

const onPercentUsed = onSlipTotal > 0 ? (onSlipUsed / onSlipTotal) * 100 : 0;
const offPercentUsed = offSlipTotal > 0 ? (offSlipUsed / offSlipTotal) * 100 : 0;
const totalcolor = getUsageColor
const onColor = getUsageColor(onPercentUsed);
const offColor = getUsageColor(offPercentUsed);

                let onSlipAvailableNoDD = 0;
$('tr:has(td.shipclerk-dashboard-vertical-separator)').each(function () {
    const $row = $(this);
    const $slipAnchor = $row.find('a.ng-binding').first();
    if ($slipAnchor.length === 0) return;

    const slipText = $slipAnchor.text().trim().toUpperCase();
    const isAvailable = $row.hasClass("empty-location");

    if ((slipText.startsWith("PS") || slipText.startsWith("WS")) && isAvailable) {
        onSlipAvailableNoDD++;
    }
})

$('#onslipcount').html(`
  ${onSlipAvailableNoDD}
  <span style="color:${onColor}" title="${onSlipUsed}/${onSlipTotal} ${onPercentUsed.toFixed(0)}%">
    (${onPercentUsed.toFixed(0)}%)
  </span>
`);
$('#onsliponlycount').text(onSlipAvailable);


$('#offslipcount').html(`
  ${offSlipAvailable}
  <span style="color:${offColor}" title="${offSlipUsed}/${offSlipTotal} ${offPercentUsed.toFixed(0)}%">
    (${offPercentUsed.toFixed(0)}%)
  </span>
`);

const totalAvailable = onSlipAvailableNoDD + offSlipAvailable;
const totalUsed = onSlipUsed + offSlipUsed;
const totalSlots = onSlipTotal + offSlipTotal;
const totalPercentUsed = totalSlots > 0 ? (totalUsed / totalSlots) * 100 : 0;
const totalColor = getUsageColor(totalPercentUsed);
const onLabelColor = $('#sliplabelwrapper').css('color') || '#333333'; // greyish
const onNumberColor = $('#onslipcount').css('color') || '#e47911'; // orange


// Create or update a new row below ON/OFF
let $totalRow = $('#totalslipcount');
if ($totalRow.length === 0) {
    $('#slipfullcount').append('<div id="totalslipcount" style="text-align: center; margin-top: 4px;"></div>');
    $totalRow = $('#totalslipcount');
}

$totalRow.html(`
  <span style="font-weight: 600;">
    Total: <span style="color: ${onNumberColor};">${totalAvailable}/${totalSlots}</span>
    <span style="color:${totalColor}" title="${totalUsed}/${totalSlots} ${totalPercentUsed.toFixed(0)}%">
      (${totalPercentUsed.toFixed(0)}%)
    </span>
  </span>
`);


if (offSlipTotal === 0) {
    $('#sliplabelwrapper').hide();
    $('#pipewrapper').hide();
    $('#offlabelwrapper').hide();
    $('#totalslipcount').hide();
} else {
    $('#sliplabelwrapper').show();
    $('#pipewrapper').show();
    $('#offlabelwrapper').show();
    $('#totalslipcount').show();
}
                $('#nonazng').html('3P Empties Total: <div id="empty">' + Object.values(ownerCounts).reduce((a, b) => a + b, 0) + '</div>');
                $('#nicarts').html('NICART: <div id="empty">' + nicarts + '</div>');

                // Build 3P Owner/Operator breakdown display
                const sortedScacGroups = Object.entries(scacGroups)
                    .filter(([group, count]) => count > 0)
                    .sort(([a], [b]) => a.localeCompare(b));

                let perOwnerHTML = `
<div id="threePDetails" style="
    margin: 8px 0;
    font-size: 0.9em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    user-select: text;
">
    <div style="font-weight: 600; margin-bottom: 8px; user-select: text;">
        ONT2 1910 East Central Ave San Bernardino, CA 92408
    </div>
    <div style="font-weight: 600; margin-bottom: 8px; user-select: text;">
        ONT5 2020 East Central Ave San Bernardino, CA 92408
    </div>
    <button id="copyBreakdownBtn" title="Copy breakdown to clipboard" style="align-self: center; cursor: pointer; margin-bottom: 8px;">Copy Breakdown</button>
`;

                sortedScacGroups.forEach(([group, count]) => {
                    perOwnerHTML += `<div><b>${group}</b>: <span class="empty">${count}</span></div>`;
                });

                perOwnerHTML += '</div>';

                const detailsDiv = document.getElementById('threePDetails');
                if (detailsDiv) {
                    detailsDiv.outerHTML = perOwnerHTML;
                } else {
                    $('#nonazng').after(perOwnerHTML);
                }

                // Initially hide breakdown; toggle via checkbox below
                $('#threePDetails').hide();

                // Setup copy button click
                $('#copyBreakdownBtn').off('click').on('click', function() {
                    const addresses = $('#threePDetails > div').slice(0, 2).map(function() {
                        return $(this).text().trim();
                    }).get();

                    const lines = [];

                    $('#threePDetails > div').slice(2).each(function() {
                        const lineText = $(this).text().trim();

                        // Extract group name (e.g. "ATMI: 2")
                        const match = lineText.match(/^(.+):\s*\d+/);
                        if (!match) return; // skip if no match

                        const groupName = match[1];

                        lines.push('\n' + lineText);

                        if (scacGroupDetails[groupName]) {
                            // Sort by totalMinutes descending for correct order
                            scacGroupDetails[groupName].sort((a, b) => b.totalMinutes - a.totalMinutes);

scacGroupDetails[groupName].forEach(({location, vehicleId, timeInYard}) => {
    lines.push(`${location} ${vehicleId} ${timeInYard}`);
});

                        }
                    });

                    const textToCopy = [...addresses, ' ', ...lines].join('\n');

                    navigator.clipboard.writeText(textToCopy).then(() => {
                        alert('Breakdown copied to clipboard!');
                    }).catch(() => {
                        alert('Failed to copy breakdown.');
                    });
                });
            }

            // Handle SCAC clicks separately
            $('#trailerdashboard').on('click', '.clickable-scac', function() {
                const id = this.id;
                if (id === 'scacEmpty1') {
                    scacEmpty1 = promptForScac(scacEmpty1);
                    $('#scacEmpty1').text(scacEmpty1);
                } else if (id === 'scacEmpty2') {
                    scacEmpty2 = promptForScac(scacEmpty2);
                    $('#scacEmpty2').text(scacEmpty2);
                } else if (id === 'scacTagged1') {
                    scacTagged1 = promptForScac(scacTagged1);
                    $('#scacTagged1').text(scacTagged1);
                } else if (id === 'scacTagged2') {
                    scacTagged2 = promptForScac(scacTagged2);
                    $('#scacTagged2').text(scacTagged2);
                }
                updateCounts(); // recalc counts after change
            });

            // Initial and periodic update
            setTimeout(updateCounts, 10000);
            setInterval(updateCounts, 60000);

            // Show/hide 3P Owner/Operator breakdown on toggle
            $('#toggle3POwners').off('change').on('change', function() {
                $('#threePDetails').toggle(this.checked);
            });
        }
    }
})(window, document, undefined);
