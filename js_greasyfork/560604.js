// ==UserScript==
// @name         Torn Travel Essentials
// @namespace    torn.travel.notes.manual
// @version      1.6.0
// @description  Draggable notes and a smart calculator. Compatible in PDA.
// @author       Ms_Mwywnn
// @match        https://www.torn.com/page.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560604/Torn%20Travel%20Essentials.user.js
// @updateURL https://update.greasyfork.org/scripts/560604/Torn%20Travel%20Essentials.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!window.location.search.includes("sid=travel")) return;

    const NOTE_KEY = "torn_travel_manual_notes";
    const POS_KEY = "torn_travel_note_position";
    const STATE_KEY = "torn_travel_note_open";

    function waitForTravelPage() {
        const check = setInterval(() => {
            if (document.body.innerText.includes("Traveling")) {
                clearInterval(check);
                init();
            }
        }, 500);
    }

    function getDestination() {
        const match = document.body.innerText.match(/Traveling to\s+([A-Za-z\s]+)/i);
        return match ? match[1].trim() : "Any";
    }

    function init() {
        const destination = getDestination();
        const allNotes = JSON.parse(localStorage.getItem(NOTE_KEY) || "{}");
        const savedPos = JSON.parse(localStorage.getItem(POS_KEY) || "{}");
        const isOpen = localStorage.getItem(STATE_KEY) !== "false";

        /* === TOGGLE TAB === */
        const tab = document.createElement("div");
        tab.textContent = "🌐";
        Object.assign(tab.style, {
            position: "fixed",
            right: "0",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#0b0b0b",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px 0 0 8px",
            cursor: "pointer",
            zIndex: "9999",
            border: "1px solid #1e90ff"
        });

        /* === PANEL === */
        const panel = document.createElement("div");
        Object.assign(panel.style, {
            position: "fixed",
            left: savedPos.left || "calc(100% - 280px)",
            top: savedPos.top || "120px",
            width: "260px",
            background: "#000",
            color: "#fff",
            border: "1px solid #1e90ff",
            borderRadius: "10px",
            padding: "10px",
            zIndex: "9999",
            display: isOpen ? "block" : "none",
            fontFamily: "Arial, sans-serif",
            touchAction: "none",
            boxSizing: "border-box"
        });

        document.body.appendChild(tab);
        document.body.appendChild(panel);

        const mainBtn = `
            width:100%;
            padding:12px;
            margin:6px 0;
            font-size:14px;
            font-weight:bold;
            background:#1e90ff;
            color:#000;
            border:none;
            border-radius:8px;
            cursor:pointer;
            box-sizing:border-box;
        `;

        const backBtn = `
            width:100%;
            padding:10px;
            margin-bottom:8px;
            font-size:13px;
            background:#333;
            color:#fff;
            border:none;
            border-radius:8px;
            cursor:pointer;
            box-sizing:border-box;
        `;

        /* === MENU === */
        function renderMenu() {
            panel.innerHTML = `
                <div id="dragHandle" style="font-weight:bold; margin-bottom:6px; cursor:grab;">
                   ✈️️ Travel Essentials
                </div>
                <div style="font-size:12px; margin-bottom:10px;">
                    Destination: <b>${destination}</b>
                </div>
                <button id="openNotes" style="${mainBtn}">📝 NOTES</button>
                <button id="openCalc" style="${mainBtn}">⌨️ CALCULATOR</button>
            `;

            panel.querySelector("#openNotes").onclick = renderNotes;
            panel.querySelector("#openCalc").onclick = renderCalculator;
        }

        /* === NOTES === */
        function renderNotes() {
            panel.innerHTML = `
                <button id="backMenu" style="${backBtn}">← BACK</button>
                <textarea id="travelNoteBox"
                    placeholder="Items to buy, quantities, next destination..."
                    style="
                        width:100%;
                        height:140px;
                        background:#0b0b0b;
                        color:#fff;
                        border:1px solid #444;
                        border-radius:8px;
                        padding:8px;
                        font-size:13px;
                        resize:none;
                        box-sizing:border-box;
                    "
                ></textarea>
                <button id="saveNote" style="${mainBtn}">SAVE</button>
                <button id="clearNote" style="${mainBtn}">CLEAR</button>
            `;

            const textarea = panel.querySelector("#travelNoteBox");
            textarea.value = allNotes[destination] || "";

            panel.querySelector("#backMenu").onclick = renderMenu;
            panel.querySelector("#saveNote").onclick = () => {
                allNotes[destination] = textarea.value;
                localStorage.setItem(NOTE_KEY, JSON.stringify(allNotes));
            };
            panel.querySelector("#clearNote").onclick = () => {
                textarea.value = "";
                delete allNotes[destination];
                localStorage.setItem(NOTE_KEY, JSON.stringify(allNotes));
            };
        }

        /* === CALCULATOR  === */
        function renderCalculator() {
            panel.innerHTML = `
                <button id="backMenu" style="${backBtn}">← BACK</button>

                <input id="calcInput"
                    placeholder="19*990"
                    style="
                        width:100%;
                        padding:10px;
                        font-size:14px;
                        background:#0b0b0b;
                        color:#fff;
                        border:1px solid #444;
                        border-radius:8px;
                        margin-bottom:10px;
                        box-sizing:border-box;
                    "
                />

                <div id="calcResult"
                    style="
                        width:100%;
                        min-height:48px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:18px;
                        font-weight:bold;
                        background:#111;
                        border-radius:8px;
                        color:#1e90ff;
                        box-sizing:border-box;
                    "
                >
                    Result
                </div>
            `;

            const input = panel.querySelector("#calcInput");
            const result = panel.querySelector("#calcResult");

            input.addEventListener("input", () => {
                const raw = input.value.trim();
                if (!raw) {
                    result.textContent = "Result";
                    return;
                }

                const expr = raw.replace(/×/g, '*').replace(/÷/g, '/');
                const match = expr.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);

                if (!match) {
                    result.textContent = "Try: 1+1";
                    return;
                }

                const a = parseFloat(match[1]);
                const b = parseFloat(match[3]);
                let value;

                switch (match[2]) {
                    case '+': value = a + b; break;
                    case '-': value = a - b; break;
                    case '*': value = a * b; break;
                    case '/': value = b === 0 ? NaN : a / b; break;
                }

                result.textContent = Number.isFinite(value) ? value : "Invalid";
            });

            panel.querySelector("#backMenu").onclick = renderMenu;
        }

        renderMenu();

        /* === TOGGLE === */
        tab.onclick = () => {
            const open = panel.style.display === "none";
            panel.style.display = open ? "block" : "none";
            localStorage.setItem(STATE_KEY, open);
        };

        /* === DRAG LOGIC (RESTORED, STABLE) === */
        let dragging = false, offsetX = 0, offsetY = 0, raf = null;

        function clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        }

        function startDrag(x, y) {
            dragging = true;
            document.body.style.overflow = "hidden";
            offsetX = x - panel.offsetLeft;
            offsetY = y - panel.offsetTop;
        }

        function moveDrag(x, y) {
            if (!dragging) return;
            if (raf) cancelAnimationFrame(raf);

            raf = requestAnimationFrame(() => {
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;
                panel.style.left = `${clamp(x - offsetX, 0, maxX)}px`;
                panel.style.top = `${clamp(y - offsetY, 0, maxY)}px`;
            });
        }

        function endDrag() {
            if (!dragging) return;
            dragging = false;
            document.body.style.overflow = "";
            localStorage.setItem(POS_KEY, JSON.stringify({
                left: panel.style.left,
                top: panel.style.top
            }));
        }

        panel.addEventListener("mousedown", e => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
            startDrag(e.clientX, e.clientY);
        });

        document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
        document.addEventListener("mouseup", endDrag);

        panel.addEventListener("touchstart", e => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
            const t = e.touches[0];
            startDrag(t.clientX, t.clientY);
        }, { passive: true });

        document.addEventListener("touchmove", e => {
            if (!dragging) return;
            const t = e.touches[0];
            moveDrag(t.clientX, t.clientY);
        }, { passive: true });

        document.addEventListener("touchend", endDrag);
    }

    waitForTravelPage();
})();