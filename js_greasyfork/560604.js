// ==UserScript==
// @name         Torn Travel Manual Note
// @namespace    torn.travel.notes.manual
// @version      1.5.0
// @description  Stable draggable & toggleable travel notes overlay to maximize travel experience. Fully Torn-compliant.
// @author       Ms_Mwywnn
// @match        https://www.torn.com/page.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560604/Torn%20Travel%20Manual%20Note.user.js
// @updateURL https://update.greasyfork.org/scripts/560604/Torn%20Travel%20Manual%20Note.meta.js
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

        /* === Toggle Tab === */
        const tab = document.createElement("div");
        tab.textContent = "📝";
        Object.assign(tab.style, {
            position: "fixed",
            right: "0",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#0b0b0b",
            color: "#ffffff",
            padding: "8px 10px",
            borderRadius: "8px 0 0 8px",
            cursor: "pointer",
            zIndex: "9999",
            fontSize: "14px",
            border: "1px solid #1e90ff"
        });

        /* === Panel === */
        const panel = document.createElement("div");
        Object.assign(panel.style, {
            position: "fixed",
            left: savedPos.left || "calc(100% - 280px)",
            top: savedPos.top || "120px",
            width: "260px",
            background: "#000000",
            color: "#ffffff",
            border: "1px solid #1e90ff",
            borderRadius: "10px",
            padding: "10px",
            zIndex: "9999",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 0 14px rgba(0,0,0,0.8)",
            display: isOpen ? "block" : "none",
            touchAction: "none"
        });

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:6px; cursor:grab; color:#ffffff;">
                ✈️ Travel Notes
            </div>
            <div style="font-size:12px; color:#7fbfff; margin-bottom:6px;">
                Destination: <span style="color:#ffffff">${destination}</span>
            </div>
            <textarea id="travelNoteBox"
                placeholder="Items to buy, next destination, reminders..."
                style="
                    width:100%;
                    height:120px;
                    background:#0b0b0b;
                    color:#ffffff;
                    border:1px solid #333;
                    border-radius:6px;
                    padding:6px;
                    resize:none;
                    font-size:12px;
                "
            ></textarea>
            <div style="display:flex; justify-content:space-between; margin-top:8px;">
                <button id="clearTravelNote"
                    style="
                        background:#f1c40f;
                        color:#000;
                        border:none;
                        padding:4px 10px;
                        border-radius:6px;
                        font-size:12px;
                        cursor:pointer;
                    "
                >Clear</button>
                <button id="saveTravelNote"
                    style="
                        background:#f1c40f;
                        color:#000;
                        border:none;
                        padding:4px 10px;
                        border-radius:6px;
                        font-size:12px;
                        cursor:pointer;
                    "
                >Save</button>
            </div>
        `;

        document.body.appendChild(tab);
        document.body.appendChild(panel);

        /* === Notes Logic === */
        const textarea = panel.querySelector("#travelNoteBox");
        textarea.value = allNotes[destination] || "";

        panel.querySelector("#saveTravelNote").addEventListener("click", () => {
            allNotes[destination] = textarea.value;
            localStorage.setItem(NOTE_KEY, JSON.stringify(allNotes));
        });

        panel.querySelector("#clearTravelNote").addEventListener("click", () => {
            textarea.value = "";
            delete allNotes[destination];
            localStorage.setItem(NOTE_KEY, JSON.stringify(allNotes));
        });

        /* === Toggle === */
        tab.addEventListener("click", () => {
            const open = panel.style.display === "none";
            panel.style.display = open ? "block" : "none";
            localStorage.setItem(STATE_KEY, open);
        });

        /* === Drag Logic (Stable + Bounded) === */
        let dragging = false;
        let offsetX = 0, offsetY = 0;
        let raf = null;

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

        function isInteractive(target) {
            return target.tagName === "TEXTAREA" || target.tagName === "BUTTON";
        }

        panel.addEventListener("mousedown", e => {
            if (isInteractive(e.target)) return;
            startDrag(e.clientX, e.clientY);
        });

        document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
        document.addEventListener("mouseup", endDrag);

        panel.addEventListener("touchstart", e => {
            if (isInteractive(e.target)) return;
            e.preventDefault();
            const t = e.touches[0];
            startDrag(t.clientX, t.clientY);
        }, { passive: false });

        document.addEventListener("touchmove", e => {
            if (!dragging) return;
            e.preventDefault();
            const t = e.touches[0];
            moveDrag(t.clientX, t.clientY);
        }, { passive: false });

        document.addEventListener("touchend", endDrag);
    }

    waitForTravelPage();
})();