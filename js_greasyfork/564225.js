// ==UserScript==
// @name         Delivery Challan Generator For All Users
// @namespace    MuftyPro
// @version      46.1
// @description  Locked Fields by Default - Edit Any Text Toggle - Bottom Print Bar - Auto Focus & Keyboard Trigger
// @match        https://salsabeelcars.site/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564225/Delivery%20Challan%20Generator%20For%20All%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/564225/Delivery%20Challan%20Generator%20For%20All%20Users.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getValueByLabel(labelText) {
        if (labelText.toLowerCase() === "car name") {
            const carNameInput = document.querySelector('input[name="car_name"]');
            if (carNameInput) return carNameInput.value.trim();
        }
        const allElements = Array.from(document.querySelectorAll('label, b, strong, div.col-sm-2, div.col-sm-3'));
        for (let el of allElements) {
            const text = el.textContent.replace(/:/g, '').trim().toLowerCase();
            const search = labelText.toLowerCase();
            if (text === search) {
                let container = el.closest('.row') || el.parentElement;
                let input = el.nextElementSibling?.querySelector('input, select') || container.querySelector('input, select');
                if (input) return input.value.trim();
            }
        }
        return "";
    }

    function getAndIncrementSerial() {
        let currentSN = localStorage.getItem('salsabeel_challan_sn') || "0";
        let nextSN = parseInt(currentSN) + 1;
        localStorage.setItem('salsabeel_challan_sn', nextSN);
        return "DC" + nextSN.toString().padStart(5, '0');
    }

    function injectButtons() {
        const lines = Array.from(document.querySelectorAll('hr'));
        let targetLine = lines.reverse().find(hr => (hr.getAttribute('style') || "").includes('b7b7b7'));
        if (targetLine && !document.getElementById('dc-integrated-container')) {
            const container = document.createElement("div");
            container.id = "dc-integrated-container";
            container.className = "no-print";
            Object.assign(container.style, { margin: "25px 0", display: "flex", gap: "12px", justifyContent: "center" });
            const btnCars = document.createElement("button");
            btnCars.textContent = "Delivery Challan For Cars";
            Object.assign(btnCars.style, { padding: "10px 20px", fontWeight: "bold", border: "none", borderRadius: "6px", background: "#0056b3", color: "#fff", cursor: "pointer" });
            btnCars.onclick = () => openChallan("https://salsabeelcars.site/assets/custom/image/logo.png", false, "Sal-Sabeel Cars");
            const btnAuto = document.createElement("button");
            btnAuto.textContent = "Delivery Challan For Auto";
            Object.assign(btnAuto.style, { padding: "10px 20px", fontWeight: "bold", border: "none", borderRadius: "6px", background: "#bb000d", color: "#fff", cursor: "pointer" });
            btnAuto.onclick = () => openChallan("https://salsabeelcars.site/assets/custom/image/greenland.png", true, "Sal-Sabeel Auto");
            container.appendChild(btnCars);
            container.appendChild(btnAuto);
            targetLine.parentNode.insertBefore(container, targetLine.nextSibling);
        }
    }
    injectButtons();

    function openChallan(logoUrl, shiftLogo, companyName) {
        const sn = getAndIncrementSerial();
        const logoStyle = shiftLogo ? 'width: 280px; margin-right: 50px;' : 'width: 280px;';

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

        #headerWrapper { position: relative; text-align: center; padding-top: 5px; min-height: 90px; }
        .contact-info { position: absolute; top: 5px; right: 0; text-align: left; font-size: 8.5pt; line-height: 1.2; }
        .divider { border-top: 1.5px solid #000; margin: 8px 0; }

        .title { text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin: 15px 0; color: #FF8C00; outline: none; }

        .meta-container { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; font-weight: bold; font-size: 12pt; }
        .meta-top-row { display: flex; justify-content: space-between; align-items: center; }

        .date-box { display: flex; align-items: center; white-space: nowrap; min-width: 220px; justify-content: flex-end; }
        .no-box { display: flex; align-items: center; white-space: nowrap; flex-grow: 1; }

        .recipient-box { margin-bottom: 25px; font-size: 12pt; font-weight: bold; }
        .row-flex { display: flex; margin-bottom: 10px; align-items: flex-end; position: relative; }
        .label-fixed { width: 120px; flex-shrink: 0; outline: none; }
        .fill-space { flex-grow: 1; border-bottom: 1px dashed #bbb; min-height: 1.2em; outline: none; padding: 0 5px; }
        .short-dash { width: 160px; flex-grow: 0; border-bottom: 1px dashed #bbb; min-height: 1.2em; outline: none; padding: 0 5px; display: inline-block; }

        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11pt; text-align: left; outline: none; }
        th { width: 38%; font-weight: bold; text-transform: uppercase; }

        .orange-header { font-weight: bold; font-size: 12pt; margin-top: 20px; text-decoration: underline; text-transform: uppercase; color: #FF8C00; outline: none; }
        .section-content { font-size: 11pt; margin-top: 5px; line-height: 1.4; font-weight: bold; outline: none; }

        .sig-container { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
        .sig-box { width: 42%; text-align: center; }
        .sig-line { border-top: 1px solid #000; padding-top: 5px; font-weight: bold; font-size: 11pt; color: #FF8C00; outline: none; }
        .sig-company { margin-bottom: 80px; font-size: 12pt; outline: none; }
        .sig-company b { color: #000; }
        .sig-company span { color: red; font-weight: bold; }

        /* INLINE BUTTON STYLES */
        .inline-btn { margin-left: 10px; padding: 2px 8px; font-size: 10px; cursor: pointer; border: 1px solid #ccc; border-radius: 3px; font-family: sans-serif; font-weight: bold; vertical-align: middle; }
        .btn-hide { background: #ff4d4d; color: white; border-color: #cc0000; }
        .btn-show { background: #2ecc71; color: white; border-color: #27ae60; }
        .btn-toggle-on { background: #28a745 !important; color: white; border: 1px solid #1e7e34; }
        .btn-toggle-off { background: #6c757d !important; color: white; border: 1px solid #545b62; }

        /* Fixed Pad Button Z-Index */
        .pad-btn-pos { position: absolute; top: 45px; left: 45px; z-index: 9999; }

        .hidden { display: none !important; }
        .invisible { visibility: hidden !important; }

        .bottom-print-bar { margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; text-align: center; display: flex; justify-content: center; gap: 20px; }

        @media print { .no-print, .inline-btn, .pad-btn-pos { display: none !important; } body { background: none; } .page { margin: 0; width: 100%; border: none; } }
    </style>
</head>
<body>
<div class="page">
    <div class="pad-btn-pos no-print">
        <button id="padBtn" class="inline-btn btn-hide" onclick="togglePad()">Remove Pad</button>
    </div>

    <div id="headerWrapper">
        <div class="contact-info">Tel: +880-2-222293331-5<br>Email: Info@salsabeelcars.com<br>Web: salsabeelcars.com</div>
        <img src="${logoUrl}" style="${logoStyle}">
        <div style="font-weight:bold; color:#d17c04; font-size:11pt; margin-top:2px;">Japanese Vehicles Importer & Wholesaler</div>
        <div style="font-size:9pt;">House #7, Road #8, Gulshan-1, Dhaka-1212</div>
        <div class="divider"></div>
    </div>

    <div class="title">DELIVERY CHALLAN</div>

    <div class="meta-container">
        <div class="meta-top-row">
            <div class="no-box">
                <span id="noLabel">No.:</span>&nbsp;
                <div id="noDash" class="short-dash" contenteditable="true" style="width:180px;">${sn}</div>
                <button id="noToggle" class="inline-btn btn-hide no-print" onclick="toggleNo()">Hide Serial No.</button>
            </div>
            <div class="date-box">
                <span>Date:</span>&nbsp;
                <div id="challanDate" class="short-dash" contenteditable="true">${new Date().toLocaleDateString('en-GB')}</div>
                <button class="no-print" style="margin-left:5px; cursor:pointer; background:none; border:1px solid #ddd;" onclick="document.getElementById('challanDate').innerText=''">X</button>
            </div>
        </div>
        <div id="refField" style="display:flex; align-items:baseline;">Ref.:&nbsp;<div class="fill-space" contenteditable="true"></div></div>
    </div>
    <br>

    <div class="recipient-box">
        <div class="row-flex">
            <div class="label-fixed">Buyer's Name:</div>
            <div id="buyerName" class="fill-space" contenteditable="true"></div>
            <button id="acToggle" class="inline-btn btn-show no-print" onclick="toggleAC()">Add A/C:</button>
        </div>
        <div id="acField" class="row-flex hidden"><div class="label-fixed">A/C:</div><div class="fill-space" contenteditable="true"></div></div>
        <div class="row-flex"><div class="label-fixed">Address:</div><div class="fill-space" contenteditable="true"></div></div>
        <div class="row-flex"><div class="label-fixed">Phone:</div><div class="fill-space" contenteditable="true"></div></div>
    </div>

    <div class="orange-header" style="margin-top:0; margin-bottom:5px;">DESCRIPTION:</div>
    <table id="infoTable">
        <tr><th>NAME OF VEHICLE</th><td contenteditable="true">${getValueByLabel("Car Name")}</td></tr>
        <tr><th>Year of MANUFACTURE</th><td contenteditable="true">${getValueByLabel("Manufacturing Year")}</td></tr>
        <tr><th>CHASSIS NO.</th><td contenteditable="true">${getValueByLabel("Chasis Number")}</td></tr>
        <tr><th>ENGINE NO.</th><td contenteditable="true">${getValueByLabel("Engine Number")}</td></tr>
        <tr><th>REGISTRATION NO.</th><td contenteditable="true">ON TEST</td></tr>
        <tr><th>C.C.</th><td contenteditable="true">${getValueByLabel("CC")}</td></tr>
        <tr><th>COLOUR</th><td contenteditable="true">${getValueByLabel("Color & Code")}</td></tr>
        <tr><th>TYRE SIZE</th><td contenteditable="true"></td></tr>
        <tr><th>ACCESSORIES</th><td contenteditable="true">FULL LOADED</td></tr>
    </table>

<div class="no-print" style="margin: 15px 0; display: flex; gap: 10px; justify-content: center;">
    <button class="inline-btn btn-show" style="font-size: 12px; padding: 6px 12px;" onclick="addRow()">+ Add New Row</button>
    <button class="inline-btn btn-hide" style="font-size: 12px; padding: 6px 12px;" onclick="removeRow()">- Delete Last Row</button>
</div>

    <div class="orange-header">WARRANTY:</div>
    <div class="section-content">
        FREE SERVICE WITHOUT ANY SPARE PARTS FOR A PERIOD OF SIX MONTHS FROM THE DATE OF VEHICLE DELIVERY.
    </div>

    <div class="orange-header">DELIVERY RECEIVED:</div>
    <div class="section-content">
        I/WE HEREBY RECEIVED THE ABOVE MENTIONED VEHICLE IN GOOD RUNNING CONDITION WITH ALL ACCESSORIES & ORIGINAL DOCUMENTS.
    </div>

    <div class="sig-container">
        <div class="sig-box">
            <div class="sig-company invisible">Placeholder</div>
            <div class="sig-line">Signature of Buyer</div>
        </div>
        <div class="sig-box">
            <div class="sig-company"><b>For</b> <span>${companyName}</span></div>
            <div class="sig-line">Authorized Signature</div>
        </div>
    </div>

    <div class="bottom-print-bar no-print">
        <button id="toggleEditBtn" class="inline-btn btn-toggle-off" style="font-size:14px; padding:10px 20px; border-radius: 6px;" onclick="toggleAllEdit()">Edit Any Text: Off</button>
        <button class="inline-btn btn-show" style="background:#28a745; font-size:14px; padding:10px 30px; border-radius: 6px;" onclick="window.print()">PRINT DELIVERY CHALLAN</button>
    </div>
</div>

<script>
    // Focus logic for both desktop and mobile keyboard trigger
    window.onload = function() {
        const buyerInput = document.getElementById('buyerName');
        if (buyerInput) {
            setTimeout(() => {
                buyerInput.focus();
                // Forces cursor to start if empty
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(buyerInput, 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }, 100);
        }
    };

    let allEditMode = false;

    function toggleAllEdit() {
        allEditMode = !allEditMode;
        const btn = document.getElementById('toggleEditBtn');
        const elements = document.querySelectorAll('.page div, .page span, .page th, .page td, .page b');

        elements.forEach(el => {
            if (!el.classList.contains('no-print') && !el.closest('.bottom-print-bar')) {
                if (allEditMode) {
                    el.setAttribute('contenteditable', 'true');
                } else {
                    if (!el.classList.contains('fill-space') &&
                        !el.classList.contains('short-dash') &&
                        el.tagName !== 'TD') {
                        el.removeAttribute('contenteditable');
                    }
                }
            }
        });

        if (allEditMode) {
            btn.innerText = "Edit Any Text: On";
            btn.className = "inline-btn btn-toggle-on";
        } else {
            btn.innerText = "Edit Any Text: Off";
            btn.className = "inline-btn btn-toggle-off";
        }
    }

    function togglePad() {
        const h = document.getElementById('headerWrapper');
        const btn = document.getElementById('padBtn');
        if (h.classList.contains('invisible')) {
            h.classList.remove('invisible');
            btn.innerText = "Remove Pad";
            btn.className = "inline-btn btn-hide";
        } else {
            h.classList.add('invisible');
            btn.innerText = "Add Pad";
            btn.className = "inline-btn btn-show";
        }
    }

    function toggleNo() {
        const label = document.getElementById('noLabel');
        const dash = document.getElementById('noDash');
        const btn = document.getElementById('noToggle');
        if (label.classList.contains('invisible')) {
            label.classList.remove('invisible');
            dash.classList.remove('invisible');
            btn.innerText = "Hide Serial No.";
            btn.className = "inline-btn btn-hide no-print";
        } else {
            label.classList.add('invisible');
            dash.classList.add('invisible');
            btn.innerText = "Show Serial No.";
            btn.className = "inline-btn btn-show no-print";
        }
    }

    function toggleAC() {
        const ac = document.getElementById('acField');
        const btn = document.getElementById('acToggle');
        if (ac.classList.contains('hidden')) {
            ac.classList.remove('hidden');
            btn.innerText = "Remove A/C:";
            btn.className = "inline-btn btn-hide no-print";
        } else {
            ac.classList.add('hidden');
            btn.innerText = "Add A/C:";
            btn.className = "inline-btn btn-show no-print";
        }
    }

    function addRow() {
        const table = document.getElementById("infoTable");
        const row = table.insertRow(-1);
        const cell1 = document.createElement("th");
        cell1.contentEditable = allEditMode ? "true" : "false";
        cell1.innerText = "";
        const cell2 = row.insertCell(0);
        cell2.contentEditable = "true";
        cell2.innerText = "";
        row.insertBefore(cell1, cell2);
    }

    function removeRow() {
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