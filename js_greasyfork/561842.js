// ==UserScript==
// @name          Delivery Challan Generator Sal-Sabeel
// @namespace     MuftyPro
// @version       24.0
// @description   Delivery Challan with Updated Styled Buttons and Logo Shift
// @match         https://salsabeelcars.site/index.php/admin/car_edit*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/561842/Delivery%20Challan%20Generator%20Sal-Sabeel.user.js
// @updateURL https://update.greasyfork.org/scripts/561842/Delivery%20Challan%20Generator%20Sal-Sabeel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getAndIncrementSerial() {
        let currentSN = localStorage.getItem('salsabeel_challan_sn') || "0";
        let nextSN = parseInt(currentSN) + 1;
        localStorage.setItem('salsabeel_challan_sn', nextSN);
        return "MFTDC" + nextSN.toString().padStart(5, '0');
    }

    // Function to create non-clickable label with background (Copied Style)
    function createLabel(text, rightOffset, bgColor) {
        const label = document.createElement("span");
        label.textContent = text;
        label.className = "no-print";
        Object.assign(label.style, {
            position: "fixed", bottom: "45px", right: rightOffset, zIndex: "9999",
            padding: "3px 8px", fontSize: "14px", fontWeight: "bold",
            borderRadius: "6px 0 0 6px", // Rounded only on the left side
            background: bgColor, color: "#fff",
            pointerEvents: "none", userSelect: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        });
        document.body.appendChild(label);
    }

    // Function to create buttons (Copied Style)
    function createMainButton(text, rightOffset, bgColor, logoUrl, companyName, shiftLogo, borderRadius) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "no-print";
        Object.assign(btn.style, {
            position: "fixed", bottom: "45px", right: rightOffset, zIndex: "9999",
            padding: "3px 8px", fontSize: "14px", borderRadius: borderRadius || "6px", border: "none",
            background: bgColor, color: "#fff", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        });
        btn.onclick = () => openChallan(logoUrl, companyName, shiftLogo);
        document.body.appendChild(btn);
    }

    // --- BUTTON LAYOUT (Aligned at bottom 45px to stay above Bill buttons) ---
    // 1. Static Label
    createLabel("Delivery Challan:-", "115px", "#bb000d");

    // 2. Cars Button (Middle)
    createMainButton("Cars", "65px", "#bb000d", "https://salsabeelcars.site/assets/custom/image/logo.png", "Cars", false, "0px");

    // 3. Auto Button (Right)
    createMainButton("Auto", "20px", "#bb000d", "https://salsabeelcars.site/assets/custom/image/greenland.png", "Auto", true, "0 6px 6px 0");


    function openChallan(logoUrl, companyType, shiftLogo) {
        const brandName   = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(5) > div > input')?.value || "";
        const color       = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(7) > div.col-sm-2 > input')?.value || "";
        const cc          = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(7) > div.col-sm-3 > input')?.value || "";
        const yearOfModel = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(4) > div.col-sm-3 > input')?.value || "";
        const chassisNo   = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(6) > div.col-sm-2 > input')?.value || "";
        const engineNo    = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(6) > div.col-sm-3 > input')?.value || "";

        const sn = getAndIncrementSerial();
        const logoStyle = shiftLogo ? 'style="width: 280px; margin-right: 50px;"' : 'style="width: 280px;"';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Delivery Challan - ${sn}</title>
    <style>
        @page { size: A4; margin: 0; }
        body { margin: 0; font-family: "Times New Roman", serif; background: #eee; }
        .page { width: 210mm; min-height: 297mm; padding: 5mm 15mm; margin: 10mm auto; background: white; box-sizing: border-box; position: relative; }
        #headerWrapper { position: relative; text-align: center; padding-top: 5px; }
        .contact-info { position: absolute; top: 5px; right: 0; text-align: left; font-size: 8.5pt; line-height: 1.2; }
        .divider { border-top: 1.5px solid #000; margin: 8px 0; }
        .title { text-align: center; font-size: 18pt; font-weight: bold; text-decoration: underline; margin: 5px 0; }
        .meta-row { display: flex; justify-content: space-between; font-size: 11pt; margin-bottom: 10px; }
        .recipient-box { margin-bottom: 15px; font-size: 11pt; }
        .row-flex { display: flex; margin-bottom: 4px; }
        .label-fixed { width: 110px; font-weight: bold; }
        .fill-space { flex-grow: 1; border-bottom: 1px dashed #bbb; min-height: 1.2em; }
        table { width: 100%; border-collapse: collapse; margin-top: 2px; }
        th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11pt; text-align: left; }
        th { width: 35%; background: #fcfcfc; }
        .toolbar { position: fixed; top: 20px; left: 20px; background: #fff; padding: 15px; border: 2px solid #0056b3; z-index: 1000; border-radius: 8px; width: 170px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .toolbar button { display: block; width: 100%; margin-bottom: 8px; padding: 8px; cursor: pointer; font-weight: bold; border-radius: 4px; border: 1px solid #ccc; }
        .delivery-note { margin-top: 25px; padding: 12px; font-size: 11pt; line-height: 1.4; }
        .sig-container { display: flex; justify-content: space-between; margin-top: 65px; }
        .sig-box { text-align: center; width: 220px; }
        .sig-line { border-top: 1px solid #000; padding-top: 5px; font-weight: bold; font-size: 11pt; }
        [contenteditable="true"]:focus { background: #fff9c4; outline: none; }
        @media print { .no-print { display: none !important; } body { background: none; } .page { margin: 0; width: 100%; border: none; } }
    </style>
</head>
<body>

<div class="toolbar no-print">
    <button onclick="toggleHeader()">Toggle Pad Space</button>
    <button onclick="addRow()" style="background: #e7f3ff; color: #0056b3;">➕ Add Row</button>
    <button onclick="deleteRow()" style="background: #fff0f0; color: #d32f2f;">➖ Delete Row</button>
    <hr>
    <button onclick="window.print()" style="background:#28a745; color:#fff; border:none;">PRINT CHALLAN</button>
</div>

<div class="page">
    <div id="headerWrapper">
        <div class="contact-info" contenteditable="true">Tel: +880-2-222293331-5<br>Email: Info@salsabeelcars.com<br>Web: salsabeelcars.com</div>
        <img src="${logoUrl}" ${logoStyle}>
        <div style="font-weight:bold; color:#e98f4a; font-size:11pt; margin-top:2px;" contenteditable="true">Japanese Vehicles Importer & Wholesaler</div>
        <div style="font-size:9pt;" contenteditable="true">House #7, Road #8, Gulshan-1, Dhaka-1212</div>
        <div class="divider"></div>
    </div>

    <div class="title" contenteditable="true">Delivery Challan</div>

    <div class="meta-row">
        <div><strong contenteditable="true">Date:</strong> <span contenteditable="true">${new Date().toLocaleDateString('en-GB')}</span></div>
        <div><strong contenteditable="true">Serial Number:</strong> <span contenteditable="true">${sn}</span></div>
    </div>

    <div class="recipient-box">
        <div class="row-flex"><div class="label-fixed" contenteditable="true">Buyer's Name:</div><div class="fill-space" contenteditable="true"></div></div>
        <div class="row-flex"><div class="label-fixed" contenteditable="true">Address:</div><div class="fill-space" contenteditable="true"></div></div>
    </div>

    <strong contenteditable="true">Vehicle Information:</strong>
    <table id="infoTable">
        <tr><th contenteditable="true">01. Brand Name</th><td contenteditable="true">${brandName}</td></tr>
        <tr><th contenteditable="true">02. Color</th><td contenteditable="true">${color}</td></tr>
        <tr><th contenteditable="true">03. C.C</th><td contenteditable="true">${cc}</td></tr>
        <tr><th contenteditable="true">04. Year of Model</th><td contenteditable="true">${yearOfModel}</td></tr>
        <tr><th contenteditable="true">05. Chassis No.</th><td contenteditable="true">${chassisNo}</td></tr>
        <tr><th contenteditable="true">06. Engine No.</th><td contenteditable="true">${engineNo}</td></tr>
        <tr><th contenteditable="true">07. Registration No.</th><td contenteditable="true">On Test</td></tr>
        <tr><th contenteditable="true">08. Accessories</th><td contenteditable="true">Full Loaded.</td></tr>
    </table>

    <div class="delivery-note">
        <strong contenteditable="true">Delivery Received:</strong><br><br>
        <div contenteditable="true">I/we hereby confirm receiving the above vehicle in good condition with all accessories and original documents.</div>
    </div>

    <div class="sig-container">
        <div class="sig-box">
            <div class="sig-line" contenteditable="true">Authorized Personnel</div>
        </div>
        <div class="sig-box">
            <div class="sig-line" contenteditable="true">Signature of Buyer</div>
        </div>
    </div>
</div>

<script>
    function toggleHeader() {
        const h = document.getElementById('headerWrapper');
        h.style.visibility = (h.style.visibility === 'hidden') ? 'visible' : 'hidden';
    }

    function addRow() {
        const table = document.getElementById("infoTable");
        const rowCount = table.rows.length;
        const row = table.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const nextNum = (rowCount + 1).toString().padStart(2, '0');
        cell1.setAttribute("contenteditable", "true");
        cell2.setAttribute("contenteditable", "true");
        cell1.innerHTML = "<b>" + nextNum + ". New Field</b>";
        cell2.innerHTML = "Details here";
    }

    function deleteRow() {
        const table = document.getElementById("infoTable");
        if (table.rows.length > 1) { table.deleteRow(-1); }
    }
</script>
</body>
</html>`;

        const w = window.open("", "_blank");
        w.document.write(html);
        w.document.close();
    }
})();