// ==UserScript==
// @name          Bill Generator Sal-Sabeel
// @namespace     MuftyPro
// @version       21.0
// @description   Bill Generator - Fully Auto User Prefix & Financial Summary
// @match         https://salsabeelcars.site/index.php/admin/car_edit*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/562061/Bill%20Generator%20Sal-Sabeel.user.js
// @updateURL https://update.greasyfork.org/scripts/562061/Bill%20Generator%20Sal-Sabeel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // TRICK: Generate a unique 3-letter prefix based on the browser's identity
    function generateAutoPrefix() {
        const fingerprint = navigator.userAgent + navigator.language + screen.width + screen.height;
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
            hash |= 0; 
        }
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const absHash = Math.abs(hash);
        // Returns 3 unique letters based on device info
        return letters[absHash % 26] + letters[(absHash >> 5) % 26] + letters[(absHash >> 10) % 26];
    }

    function getAndIncrementSerial() {
        let userPrefix = localStorage.getItem('salsabeel_bill_prefix');
        if (!userPrefix) {
            userPrefix = generateAutoPrefix();
            localStorage.setItem('salsabeel_bill_prefix', userPrefix);
        }

        let currentSN = localStorage.getItem('salsabeel_sn_counter') || "0";
        let nextSN = parseInt(currentSN) + 1;
        localStorage.setItem('salsabeel_sn_counter', nextSN);
        
        // Result: [Unique Prefix] + [B for Bill] + [0001]
        return userPrefix + "B" + nextSN.toString().padStart(4, '0');
    }

    function createLabel(text, rightOffset, bgColor) {
        const label = document.createElement("span");
        label.textContent = text;
        label.className = "no-print";
        Object.assign(label.style, {
            position: "fixed", bottom: "10px", right: rightOffset, zIndex: "9999",
            padding: "3px 8px", fontSize: "14px", fontWeight: "bold",
            borderRadius: "6px 0 0 6px", background: bgColor, color: "#fff",
            pointerEvents: "none", userSelect: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        });
        document.body.appendChild(label);
    }

    function createMainButton(text, rightOffset, bgColor, logoUrl, companyName, shiftLogo, borderRadius) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "no-print";
        Object.assign(btn.style, {
            position: "fixed", bottom: "10px", right: rightOffset, zIndex: "9999",
            padding: "3px 8px", fontSize: "14px", borderRadius: borderRadius || "6px", border: "none",
            background: bgColor, color: "#fff", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        });
        btn.onclick = () => openBill(logoUrl, companyName, shiftLogo);
        document.body.appendChild(btn);
    }

    // --- BUTTON LAYOUT ---
    createLabel("Bill:-", "115px", "#0056b3");
    createMainButton("Cars", "65px", "#0056b3", "https://salsabeelcars.site/assets/custom/image/logo.png", "Cars", false, "0px");
    createMainButton("Auto", "20px", "#0056b3", "https://salsabeelcars.site/assets/custom/image/greenland.png", "Auto", true, "0 6px 6px 0");

    function openBill(logoUrl, companyType, shiftLogo) {
        const brandName   = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(5) > div > input')?.value || "";
        const color       = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(7) > div.col-sm-2 > input')?.value || "";
        const cc          = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(7) > div.col-sm-3 > input')?.value || "";
        const yearOfModel = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(4) > div.col-sm-3 > input')?.value || "";
        const chassisNo   = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(6) > div.col-sm-2 > input')?.value || "";
        const engineNo    = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(6) > div.col-sm-3 > input')?.value || "";
        const totalCost   = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(14) > div > input')?.value || "0";

        const sn = getAndIncrementSerial();
        const logoStyle = shiftLogo ? 'style="width: 280px; margin-right: 50px;"' : 'style="width: 280px;"';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bill - ${sn}</title>
    <style>
        @page { size: A4; margin: 0; }
        body { margin: 0; font-family: "Times New Roman", serif; background: #eee; }
        .page { width: 210mm; min-height: 297mm; padding: 5mm 15mm; margin: 10mm auto; background: white; box-sizing: border-box; position: relative; }
        #headerWrapper { position: relative; text-align: center; padding-top: 5px; }
        .contact-info { position: absolute; top: 5px; right: 0; text-align: left; font-size: 8.5pt; line-height: 1.2; }
        .divider { border-top: 1.5px solid #000; margin: 8px 0; }
        .bill-title { text-align: center; font-size: 18pt; font-weight: bold; text-decoration: underline; margin: 5px 0; }
        .meta-row { display: flex; justify-content: space-between; font-size: 11pt; margin-bottom: 10px; }
        .recipient-box { margin-bottom: 15px; font-size: 11pt; }
        .row-flex { display: flex; margin-bottom: 4px; }
        .label-fixed { width: 40px; font-weight: bold; }
        .fill-space { flex-grow: 1; border-bottom: 1px dashed #bbb; min-height: 1.2em; }
        table { width: 100%; border-collapse: collapse; margin-top: 2px; }
        th, td { border: 1px solid #000; padding: 6px 10px; font-size: 11pt; text-align: left; }
        th { width: 35%; background: #fcfcfc; }
        .fin-input { border: none; width: 100%; font-family: inherit; font-size: 11pt; font-weight: bold; background: transparent; outline: none; }
        .toolbar { position: fixed; top: 20px; left: 20px; background: #fff; padding: 15px; border: 2px solid #0056b3; z-index: 1000; border-radius: 8px; width: 170px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .toolbar button { display: block; width: 100%; margin-bottom: 8px; padding: 8px; cursor: pointer; font-weight: bold; }
        .btn-row { padding: 2px 4px; font-size: 9px; cursor: pointer; border: 1px solid #999; background: #fff; border-radius: 3px; margin-top: 3px; margin-right: 1px; }
        .btn-green { color: green; font-weight: bold; border-color: green; }
        .btn-red { color: red; font-weight: bold; border-color: red; }
        .sig-space { margin-top: 15px; }
        .sig-line { border-top: 1px solid #000; width: 220px; text-align: center; padding-top: 5px; margin-top: 65px; }
        [contenteditable="true"]:focus { background: #fff9c4; outline: none; }
        @media print { .no-print, .btn-row { display: none !important; } body { background: none; } .page { margin: 0; width: 100%; border: none; } }
    </style>
</head>
<body>

<div class="toolbar no-print">
    <button onclick="toggleHeader()">Toggle Pad Space</button>
    <button onclick="toggleRef()">Toggle Ref</button>
    <hr>
    <button onclick="window.print()" style="background:#28a745; color:#fff;">PRINT BILL</button>
</div>

<div class="page">
    <div id="headerWrapper">
        <div class="contact-info" contenteditable="true">Tel: +880-2-222293331-5<br>Email: Info@salsabeelcars.com<br>Web: salsabeelcars.com</div>
        <img src="${logoUrl}" ${logoStyle}>
        <div style="font-weight:bold; color:#e98f4a; font-size:11pt; margin-top:2px;" contenteditable="true">Japanese Vehicles Importer & Wholesaler</div>
        <div style="font-size:9pt;" contenteditable="true">House #7, Road #8, Gulshan-1, Dhaka-1212</div>
        <div class="divider"></div>
    </div>

    <div class="bill-title" contenteditable="true">Bill</div>
    <div class="meta-row">
        <div><strong contenteditable="true">Date:</strong> <span contenteditable="true">${new Date().toLocaleDateString('en-GB')}</span></div>
        <div><strong contenteditable="true">Serial Number:</strong> <span contenteditable="true">${sn}</span></div>
    </div>

    <div id="refLine" style="margin-bottom: 12px; font-size: 11pt;"><strong contenteditable="true">Ref:</strong> <span contenteditable="true">ssc/bill for 01Nos</span></div>

    <div class="recipient-box">
        <div class="row-flex"><div class="label-fixed" contenteditable="true">To:</div><div class="fill-space" contenteditable="true"></div></div>
        <div class="row-flex"><div class="label-fixed" contenteditable="true">A/C:</div><div class="fill-space" contenteditable="true"></div></div>
    </div>

    <strong contenteditable="true">Vehicle Information:</strong>
    <table id="vTable">
        <tr><th contenteditable="true">01. Vehicle Name</th><td contenteditable="true">${brandName}</td></tr>
        <tr><th contenteditable="true">02. Color</th><td contenteditable="true">${color}</td></tr>
        <tr><th contenteditable="true">03. C.C</th><td contenteditable="true">${cc}</td></tr>
        <tr><th contenteditable="true">04. Year of Model</th><td contenteditable="true">${yearOfModel}</td></tr>
        <tr><th contenteditable="true">05. Chassis No.</th><td contenteditable="true">${chassisNo}</td></tr>
        <tr><th contenteditable="true">06. Engine No.</th><td contenteditable="true">${engineNo}</td></tr>
    </table>
    <div class="no-print"><button class="btn-row" onclick="addRow('vTable', false)">+ Row</button> <button class="btn-row" onclick="removeRow('vTable')">- Row</button></div>

    <br>
    <strong contenteditable="true">Financial Summary:</strong>
    <table id="fTable">
        <tbody id="fBody">
            <tr>
                <th contenteditable="true">Vehicle Price:</th>
                <td><input type="number" class="fin-input" id="p1" value="${totalCost.replace(/,/g, '')}"></td>
                <td class="no-print" style="width:140px; border:none;">
                    <button class="btn-row btn-green" onclick="sendToTotal('p1', '+')">T+</button>
                    <button class="btn-row" onclick="updateWord('p1')">Word</button>
                </td>
            </tr>
            <tr>
                <th contenteditable="true">Bank Payment:</th>
                <td><input type="number" class="fin-input" id="p2" value="0"></td>
                <td class="no-print" style="width:140px; border:none;">
                    <button class="btn-row btn-green" onclick="sendToTotal('p2', '+')">T+</button>
                    <button class="btn-row btn-red" onclick="sendToTotal('p2', '-')">T-</button>
                    <button class="btn-row" onclick="updateWord('p2')">Word</button>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr style="background:#f9f9f9; border-top: 2px solid #000;">
                <th contenteditable="true">Total:</th>
                <td><input type="number" class="fin-input" id="grandTotal" value="0" style="color:#d32f2f;"></td>
                <td class="no-print" style="border:none;">
                    <button class="btn-row" style="background:#eee" onclick="resetTotal()">Reset</button>
                    <button class="btn-row" onclick="updateWord('grandTotal')">Word</button>
                </td>
            </tr>
        </tfoot>
    </table>
    <div class="no-print"><button class="btn-row" onclick="addRow('fTable', true)">+ Row</button> <button class="btn-row" onclick="removeRow('fTable')">- Row</button></div>

    <div style="margin-top: 15px; font-size: 11pt;"><strong contenteditable="true">In Words:</strong> <span id="wordBox" style="font-weight:bold;" contenteditable="true"></span></div>

    <div class="sig-space">
        <div contenteditable="true">For <strong>Sal-Sabeel ${companyType}</strong></div>
        <div class="sig-line"><strong contenteditable="true">Authorized Signature</strong></div>
    </div>
</div>

<script>
    function toggleHeader() { const h = document.getElementById('headerWrapper'); h.style.visibility = (h.style.visibility === 'hidden') ? 'visible' : 'hidden'; }
    function toggleRef() { const r = document.getElementById('refLine'); r.style.display = (r.style.display === 'none') ? 'block' : 'none'; }
    let fIdx = 2;
    function addRow(tid, isF) {
        const t = (tid === 'fTable') ? document.getElementById('fBody') : document.getElementById(tid);
        const r = t.insertRow();
        const c1 = document.createElement("th"); c1.contentEditable = "true";
        c1.innerText = isF ? "New Label:" : (t.rows.length.toString().padStart(2, '0') + ". New Item:");
        r.appendChild(c1);
        const c2 = r.insertCell(1);
        if(isF) {
            fIdx++; const id = 'p' + fIdx;
            c2.innerHTML = '<input type="number" class="fin-input" id="'+id+'" value="0">';
            const c3 = r.insertCell(2); c3.className = "no-print"; c3.style.border = "none";
            c3.innerHTML = '<button class="btn-row btn-green" onclick="sendToTotal(\\''+id+'\\', \\'+\\')">T+</button>' +
                           '<button class="btn-row btn-red" onclick="sendToTotal(\\''+id+'\\', \\'-\\')">T-</button>' +
                           '<button class="btn-row" onclick="updateWord(\\''+id+'\\')">Word</button>';
        } else { c2.contentEditable = "true"; c2.innerText = "Value"; }
    }
    function removeRow(tid) {
        const t = (tid === 'fTable') ? document.getElementById('fBody') : document.getElementById(tid);
        if(t.rows.length > 1) t.deleteRow(-1);
    }
    function sendToTotal(id, op) {
        const rowVal = parseFloat(document.getElementById(id).value) || 0;
        const totalInput = document.getElementById('grandTotal');
        let currentTotal = parseFloat(totalInput.value) || 0;
        if (op === '+') currentTotal += rowVal;
        else currentTotal -= rowVal;
        totalInput.value = currentTotal;
        updateWord('grandTotal');
    }
    function resetTotal() {
        document.getElementById('grandTotal').value = 0;
        document.getElementById('wordBox').innerText = "";
    }
    function updateWord(id) {
        const val = document.getElementById(id).value;
        const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
        const teens = ['ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
        const tens = ['TEN', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
        function toWords(n) {
            n = Math.abs(parseInt(n)); if (!n || n === 0) return "ZERO TAKA ONLY";
            function chunk(x) {
                if (x < 10) return ones[x];
                if (x < 20) return (x === 10) ? 'TEN' : teens[x - 11];
                let w = tens[Math.floor(x / 10) - 1];
                if (x % 10 !== 0) w += '-' + ones[x % 10];
                return w;
            }
            let res = '', cr = Math.floor(n / 10000000); n %= 10000000;
            let lk = Math.floor(n / 100000); n %= 100000;
            let th = Math.floor(n / 1000); n %= 1000;
            let h = Math.floor(n / 100); n %= 100;
            if (cr > 0) res += chunk(cr) + ' CRORE ';
            if (lk > 0) res += chunk(lk) + ' LAKH ';
            if (th > 0) res += chunk(th) + ' THOUSAND ';
            if (h > 0) res += chunk(h) + ' HUNDRED ';
            if (n > 0) res += chunk(n);
            return res.trim() + ' TAKA ONLY';
        }
        document.getElementById('wordBox').innerText = toWords(val);
    }
</script>
</body>
</html>`;

        const w = window.open("", "_blank");
        w.document.write(html);
        w.document.close();
    }
})();