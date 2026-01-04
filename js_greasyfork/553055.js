// ==UserScript==
// @name         3P Owner/Operator Breakdown Viewer (Popup Button + Dynamic Resize)
// @namespace    https://phonetool.amazon.com/users/svvannak
// @version      1.3.2
// @description  Opens a popup window with 3P empties grouped by SCAC, editable addresses, copy-to-clipboard (fixed using GM_setClipboard), and auto-resizing window
// @author       Van
// @match        https://trans-logistics.amazon.com/yms/shipclerk/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553055/3P%20OwnerOperator%20Breakdown%20Viewer%20%28Popup%20Button%20%2B%20Dynamic%20Resize%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553055/3P%20OwnerOperator%20Breakdown%20Viewer%20%28Popup%20Button%20%2B%20Dynamic%20Resize%29.meta.js
// ==/UserScript==

(function(window, document, undefined) {
    'use strict';

    function isYMSStyleActive() {
    const testBtn = document.createElement("button");
    testBtn.className = "yms-button-outline-inverse";
    document.body.appendChild(testBtn);
    const style = window.getComputedStyle(testBtn);
    document.body.removeChild(testBtn);
    return style.backgroundImage.includes("linear-gradient") &&
           style.color === "rgb(230, 234, 239)";
}


    const scacGroups = {
        "ATMI": 0,
        "CDSEX/CDSTR/CDDF": 0,
        "IMJBH/IMSJX/IMJEX": 0,
        "IMPHD": 0,
        "IMPRK/ROKA": 0,
        "PGLT": 0,
        "RDXY": 0,
        "STQM": 0,
        "XPDR": 0
    };
    const scacGroupDetails = {};
    Object.keys(scacGroups).forEach(group => scacGroupDetails[group] = []);

    let addressList = JSON.parse(localStorage.getItem("addressList")) || [
        "ONT2 1910 East Central Ave San Bernardino, CA 92408",
        "ONT5 2020 East Central Ave San Bernardino, CA 92408"
    ];

    let breakdownWin = null;

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

function resizePopup(win = breakdownWin) {
    if (!win || win.closed) return;

    const doc = win.document;
    const body = doc.body;
    const html = doc.documentElement;

    const contentWidth = Math.max(
        body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth
    );
    const contentHeight = Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight
    );

    const finalWidth = contentWidth + 20;
    const finalHeight = contentHeight + 40;

    win.resizeTo(finalWidth, finalHeight);
}



    function buildBreakdown(targetDoc = document) {
        // Reset counts
        Object.keys(scacGroups).forEach(group => scacGroups[group] = 0);
        Object.keys(scacGroupDetails).forEach(group => scacGroupDetails[group] = []);

        // Collect data from main page
let lastKnownLocation = 'Unknown';

$('tr.ng-scope').each(function() {
    const $row = $(this);
    if ($row.find('.yardasset-empty').length === 0) return;

    // Detect if this row has a new location header
    const locationCell = $row.find('.short-name-distinguished a');
    if (locationCell.length) {
        lastKnownLocation = locationCell.text().trim() ||
                            $row.find('.location-zone span').attr('title')?.split('-')[0].trim() ||
                            $row.find('.location-zone span').text().trim() ||
                            lastKnownLocation;
    }

    const assetLocation = lastKnownLocation;

    for (const group of Object.keys(scacGroups)) {
        const groupSCACs = group.split('/');
        if (groupSCACs.some(scac => $row.find(`.ownerOperatorCodeGroup :contains("${scac}")`).length)) {
            scacGroups[group]++;

            const vehicleId = $row.find('.vehicleIdGroup-LP .ng-binding').first().text().trim();
            const timeInYardText = $row.find('[yms-time-elapsed]').text().trim();
            const totalMinutes = parseTimeToMinutes(timeInYardText);

            scacGroupDetails[group].push({
                location: assetLocation,
                vehicleId,
                timeInYard: timeInYardText,
                totalMinutes
            });
        }
    }
});


        // Build HTML
        let html = `<div style="font-weight: bold; margin-bottom: 4px;">Script by <span style="color: #555;">svvannak@amazon.com</span></div>`;

        addressList.forEach((address, index) => {
            html += `
<div style="font-weight: bold;">
  <span id="address${index}">${address}</span>
  <button class="editAddressBtn" data-index="${index}">✏️</button>
  <button class="deleteAddressBtn" data-index="${index}">🗑️</button>
</div>`;
        });

        html += `
<button id="addAddressBtn">➕ Add Address</button>
<button id="copyBreakdownBtn">📋 Copy Breakdown</button>
`;

        Object.entries(scacGroups)
            .filter(([_, count]) => count > 0)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([group, count]) => {
                html += `<div><b>${group}</b>: <span>${count}</span></div>`;
            });

        $(targetDoc).find("#threePDetails").html(html);

        // Event bindings inside targetDoc
        $(targetDoc).find('.editAddressBtn').on('click', function() {
            const index = $(this).data('index');
            const current = $(targetDoc).find(`#address${index}`).text().trim();
            const updated = prompt("Enter new address:", current);
            if (updated && updated.trim() !== "") {
                addressList[index] = updated.trim();
                localStorage.setItem("addressList", JSON.stringify(addressList));
                buildBreakdown(targetDoc);
            }
        });

        $(targetDoc).find('.deleteAddressBtn').on('click', function() {
            const index = $(this).data('index');
            addressList.splice(index, 1);
            localStorage.setItem("addressList", JSON.stringify(addressList));
            buildBreakdown(targetDoc);
        });

        $(targetDoc).find('#addAddressBtn').on('click', function() {
            const newAddress = prompt("Enter new address:");
            if (newAddress && newAddress.trim() !== "") {
                addressList.push(newAddress.trim());
                localStorage.setItem("addressList", JSON.stringify(addressList));
                buildBreakdown(targetDoc);
            }
        });

        // ✅ Fixed Copy Breakdown using GM_setClipboard
$(targetDoc).find('#copyBreakdownBtn').on('click', function() {
    const addresses = addressList.slice();
    const lines = [];

    Object.keys(scacGroupDetails).forEach(groupName => {
        if (scacGroupDetails[groupName].length) {
            lines.push('\n' + groupName + ": " + scacGroupDetails[groupName].length);
            scacGroupDetails[groupName]
                .sort((a, b) => b.totalMinutes - a.totalMinutes)
                .forEach(({ location, vehicleId, timeInYard }) => {
                    lines.push(`${location} ${vehicleId} ${timeInYard}`);
                });
        }
    });

    const textToCopy = [...addresses, ' ', ...lines].join('\n');

    try {
        if (typeof GM_setClipboard === "function") {
            GM_setClipboard(textToCopy, { type: "text", mimetype: "text/plain" });
            console.log("✅ 3P Breakdown copied via GM_setClipboard");
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => console.log("✅ 3P Breakdown copied via navigator.clipboard"))
                .catch(() => console.warn("⚠️ Copy failed — browser blocked clipboard access."));
        } else {
            const tempInput = document.createElement("textarea");
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            console.log("✅ 3P Breakdown copied via execCommand");
        }
    } catch (err) {
        console.error("❌ Copy failed:", err.message);
    }

    // Immediately close the popup
    if (breakdownWin && !breakdownWin.closed) {
        breakdownWin.close();
    }
});

       /// resizePopup();
    }

    function openBreakdownWindow() {
        if (breakdownWin && !breakdownWin.closed) {
            breakdownWin.focus();
            buildBreakdown(breakdownWin.document);
            return;
        }

// Get position of the 3P Breakdown button so popup opens nearby
const btn = document.getElementById("threePBreakdownBtn");
const rect = btn ? btn.getBoundingClientRect() : { top: 100, left: 100 };

// Define smaller popup size
const popupWidth = 420;
const popupHeight = 300;

// Calculate popup coordinates relative to current window
const popupTop = window.screenY + rect.top + 40;
const popupLeft = window.screenX + rect.left + 20;

// Open popup window near the button
breakdownWin = window.open(
    "",
    "threePBreakdown",
    `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},scrollbars=yes,resizable=yes`
);

        breakdownWin.document.write(`
            <html>
            <head>
                <title>3P Owner/Operator Breakdown</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 0.9em; margin: 16px; }
                    button { margin: 4px; padding: 4px 8px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div id="threePDetails"></div>
            </body>
            </html>
        `);
        breakdownWin.document.close();

        buildBreakdown(breakdownWin.document);
breakdownWin.onload = () => {
    /// setTimeout(() => resizePopup(), 100); // Wait for layout + styles
};
    }


function injectBreakdownButton() {
    if ($("#threePBreakdownWrapper").length) return;

    const useYMSStyle = isYMSStyleActive();
    const btnClass = useYMSStyle ? "yms-button-outline-inverse" : "";
    const btnStyle = `
        font-size: 12px;
        padding: 2px 6px;
        white-space: nowrap;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 6px;
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        vertical-align: middle;
        position: relative;
        z-index: 9999;
    `;

    const wrapper = `
      <div id="threePBreakdownWrapper" style="display: inline-flex; align-items: center;">
        <button id="threePBreakdownBtn" class="${btnClass}" type="button" style="${btnStyle}">
          3P Empties
        </button>
      </div>
    `;

    $("#clearButtonGroup").css({
        display: "inline-flex",
        "align-items": "center",
        "flex-wrap": "nowrap",
        "gap": "8px",
        "overflow": "visible"
    }).append(wrapper);

    $("#threePBreakdownBtn").on("click", openBreakdownWindow);
}



    setTimeout(() => {
        injectBreakdownButton();
    }, 10000);

GM_addStyle(`
  #threePBreakdownBtn {
    display: inline-block !important;
    visibility: visible !important;
    font-size: 12px;
    padding: 2px 6px;
    margin-left: 6px;
    white-space: nowrap;
  }
`);

})(window, document, undefined);