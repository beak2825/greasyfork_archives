// ==UserScript==
// @name         WebUntis Random Seating Plan with Images (A4 JPG + Tafel)
// @namespace    https://greasyfork.org/en/scripts/556964-webuntis-random-seating-plan-with-images-and-download
// @version      2.1
// @description  Zufällige Sitzpläne in WebUntis mit A4-JPG-Export und Tafelbalken. Non-commercial use only. Attribution required.
// @match        *.webuntis.com/*
// @grant        none
// @author       Simon Pirker
// @license      CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/556964/WebUntis%20Random%20Seating%20Plan%20with%20Images%20%28A4%20JPG%20%2B%20Tafel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556964/WebUntis%20Random%20Seating%20Plan%20with%20Images%20%28A4%20JPG%20%2B%20Tafel%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('[Seating+] Script started.');

    // === CONSTANTS ===
    const A4_WIDTH = 2339;  // 200 DPI landscape
    const A4_HEIGHT = 1654;

    // === STYLES ===
    const style = document.createElement('style');
    style.textContent = `
        #seatingOverlay { position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,0,0.8); display:none; flex-direction: column;
            align-items: center; justify-content: center; overflow:auto; z-index:9999; padding:10px;}

        #seatingBox { background:white; padding:20px; border-radius:12px; text-align:center;
            max-width:95%; max-height:95%; overflow:auto; position:relative; }

        #tafelBar {
            width:100%;
            background:#333;
            color:white;
            padding:10px 0;
            text-align:center;
            font-size:1.6em;
            margin-bottom:15px;
            border-radius:8px;
        }

        #seatingBox table { border-collapse: collapse; margin: 0 auto; }
        #seatingBox td { border:1px solid #ccc; padding:5px; text-align:center; vertical-align: top;
            width:130px; height:160px; transition:0.2s; }

        #seatingBox td.absent { opacity:0.5; background:#f0f0f0; }

        #seatingBox img {
            width: 80px;
            height: auto;
            border-radius: 8px;
            object-fit: contain;
            display:block;
            margin:0 auto 5px auto;
        }

        #seatingBox .name {
            white-space: normal;
            word-wrap: break-word;
            max-width:120px;
            margin:0 auto;
            line-height:1.1em;
        }

        .closeSeating {
            position:absolute; top:10px; right:10px;
            background:#e74c3c; color:white; border:none;
            border-radius:8px; padding:6px 12px; cursor:pointer;
        }
        .closeSeating:hover { background:#c0392b; }

        #toggleSeatingButton {
            margin:10px; background:#3498db; color:white;
            font-size:1.2em; border:none; border-radius:50px;
            padding:10px 20px; cursor:pointer;
            box-shadow:0 4px 8px rgba(0,0,0,0.3);
        }
        #toggleSeatingButton:hover { background:#2980b9; }

        #seatingOptions { margin:10px 0; }
        #seatingOptions label { margin-right: 15px; font-size:1em; cursor:pointer; }
        #seatingOptions input[type="number"] { width:60px; padding:2px 5px; margin-left:5px; }
        #seatingOptions button {
            margin-left:10px; padding:6px 12px; border-radius:6px;
            border:none; cursor:pointer; background:#3498db; color:white;
        }
        #seatingOptions button:hover { background:#2980b9; }
    `;
    document.head.appendChild(style);

    // === GET STUDENTS ===
    function getStudents() {
        return Array.from(document.querySelectorAll('.studentCard__container'))
            .map(c => ({
                firstName: c.querySelector('.studentCard__firstName')?.innerText.trim() || '',
                lastName: c.querySelector('.studentCard__lastName')?.innerText.trim() || '',
                img: c.querySelector('img')?.src || '',
                absent: c.classList.contains('CRSWAbsent'),
                id: Math.random().toString(36).substr(2, 9)
            }));
    }

    // === OVERLAY ===
    const seatingOverlay = document.createElement('div');
    seatingOverlay.id = 'seatingOverlay';
    seatingOverlay.innerHTML = `
        <div id="seatingBox">
            <button class="closeSeating">✖</button>

            <div id="tafelBar">Tafel</div>

            <h2>Random Seating Plan</h2>

            <div id="seatingOptions">
                <label><input type="checkbox" id="includeAbsent"> Abwesende Schüler einbeziehen</label>
                <label>Spalten: <input type="number" id="numColumns" min="1" value="6"></label>
                <button id="reshuffleBtn">Neu generieren</button>
                <button id="downloadPlan">Download als JPG (A4)</button>
            </div>

            <div id="seatingGrid"></div>
        </div>
    `;
    document.body.appendChild(seatingOverlay);
    seatingOverlay.querySelector('.closeSeating').onclick = () => seatingOverlay.style.display = 'none';

    // === GENERATE SEATING ===
    function generateSeatingPlan() {
        const includeAbsent = document.getElementById('includeAbsent').checked;
        let students = getStudents();
        if (!includeAbsent) students = students.filter(s => !s.absent);
        if (students.length === 0) return alert("Keine Schüler gefunden!");

        const columns = parseInt(document.getElementById('numColumns').value) || 6;
        const rows = Math.ceil(students.length / columns);
        const shuffled = [...students].sort(() => Math.random() - 0.5);

        const table = document.createElement('table');
        let idx = 0;

        for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c < columns; c++) {
                const td = document.createElement('td');
                if (idx < shuffled.length) {
                    const s = shuffled[idx];
                    td.className = s.absent && includeAbsent ? 'absent' : '';
                    td.innerHTML = `
                        <img src="${s.img}">
                        <div class="name">${s.firstName} ${s.lastName}</div>
                    `;
                    idx++;
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        const container = document.getElementById('seatingGrid');
        container.innerHTML = '';
        container.appendChild(table);
    }

    document.getElementById('reshuffleBtn').onclick = generateSeatingPlan;

    // === DOWNLOAD AS JPG (A4) ===
    document.getElementById("downloadPlan").addEventListener("click", async () => {
        const table = document.querySelector("#seatingGrid table");
        if (!table) return alert("Bitte zuerst Sitzplan generieren.");

        const canvas = document.createElement("canvas");
        canvas.width = A4_WIDTH;
        canvas.height = A4_HEIGHT;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

        // --- TAFEL BALKEN deutlich größer + nicht mehr abgeschnitten ---
        const tafelHeight = 150;
        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, A4_WIDTH, tafelHeight);

        ctx.fillStyle = "white";
        ctx.font = "64px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Tafel", A4_WIDTH / 2, tafelHeight / 2);

        // Abstand nach Tafel
        const offsetY = tafelHeight + 40;

        // --- Deutlich größere Sitzplätze ---
        const cellWidth = 260;
        const cellHeight = 290;

        // Bildgröße deutlich erhöht
        const maxImgSize = 150;

        const rows = table.rows.length;
        const cols = table.rows[0].cells.length;

        // Gesamtbreite des Gitters
        const gridWidth = cols * cellWidth;
        const startX = (A4_WIDTH - gridWidth) / 2; // zentrieren

        const promises = [];

        Array.from(table.rows).forEach((tr, rIdx) => {
            Array.from(tr.cells).forEach((td, cIdx) => {
                const x = startX + cIdx * cellWidth;
                const y = offsetY + rIdx * cellHeight;

                // Hintergrund
                ctx.fillStyle = td.classList.contains("absent") ? "#f0f0f0" : "#fafafa";
                ctx.fillRect(x, y, cellWidth, cellHeight);

                // Bild
                const imgEl = td.querySelector("img");
                if (imgEl) {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = imgEl.src;

                    const p = new Promise(resolve => {
                        img.onload = () => {
                            let w = img.naturalWidth;
                            let h = img.naturalHeight;
                            const scale = Math.min(maxImgSize / w, maxImgSize / h);
                            w *= scale;
                            h *= scale;

                            ctx.drawImage(
                                img,
                                x + (cellWidth - w) / 2,
                                y + 15,
                                w,
                                h
                            );
                            resolve();
                        };
                        img.onerror = resolve;
                    });
                    promises.push(p);
                }

                // Name viel größer
                const name = td.querySelector(".name")?.innerText || "";
                ctx.fillStyle = "#000";
                ctx.font = "32px sans-serif";

                wrapText(ctx, name, x + cellWidth / 2, y + maxImgSize + 40, cellWidth - 20, 36);
            });
        });

        await Promise.all(promises);

        const link = document.createElement("a");
        link.download = "Sitzplan_A4.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
    });


    // TEXT WRAPPING
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";
        for (let w of words) {
            const test = line + w + " ";
            if (ctx.measureText(test).width > maxWidth) {
                ctx.fillText(line, x, y);
                line = w + " ";
                y += lineHeight;
            } else {
                line = test;
            }
        }
        ctx.fillText(line, x, y);
    }

    // === BUTTON INJECTION ===
    function addStartButton(container) {
        if (!document.getElementById('toggleSeatingButton')) {
            const btn = document.createElement('button');
            btn.id = 'toggleSeatingButton';
            btn.textContent = '🪑 Sitzplan generieren';
            btn.onclick = () => {
                seatingOverlay.style.display = 'flex';
                generateSeatingPlan();
            };
            container.appendChild(btn);
        }
    }

    // === OBSERVE DOM ===
    new MutationObserver(() => {
        const container = document.getElementById('classregPageForm.studentWidgets');
        if (container) addStartButton(container);
    }).observe(document.body, { childList: true, subtree: true });

})();
