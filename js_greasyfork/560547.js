// ==UserScript==
// @name         Fami tools by nnam
// @name:en      Fami tools by nnam
// @namespace    https://greasyfork.org/users/your-username
// @version      5.0
// @description  Fami tool
// @match        https://fami.hust.edu.vn/sohoa/phong-hoc/kiem-tra*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560547/Fami%20tools%20by%20nnam.user.js
// @updateURL https://update.greasyfork.org/scripts/560547/Fami%20tools%20by%20nnam.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const hackScript = document.createElement('script');
    hackScript.textContent = `
    (() => {
        window.currentSpeed = 1;
        const activeTimers = new Map();
        let timerIdCounter = 0;
        const originalSetInterval = window.setInterval;
        const originalClearInterval = window.clearInterval;
        const originalSetTimeout = window.setTimeout;
        const originalClearTimeout = window.clearTimeout;

        window.setInterval = function(callback, delay, ...args) {
            if (delay === undefined) delay = 0;
            const fakeId = ++timerIdCounter;
            const startRealTimer = () => {
                const realDelay = delay / window.currentSpeed;
                const realId = originalSetInterval(callback, realDelay, ...args);
                activeTimers.set(fakeId, { type: 'interval', realId: realId, callback: callback, delay: delay, args: args });
            };
            startRealTimer();
            return fakeId;
        };

        window.clearInterval = function(fakeId) {
            if (activeTimers.has(fakeId)) {
                originalClearInterval(activeTimers.get(fakeId).realId);
                activeTimers.delete(fakeId);
            }
        };

        window.setTimeout = function(callback, delay, ...args) {
            if (delay === undefined) delay = 0;
            const fakeId = ++timerIdCounter;
            const startRealTimer = () => {
                const realDelay = delay / window.currentSpeed;
                const wrappedCallback = (...cbArgs) => {
                    if(activeTimers.has(fakeId)) activeTimers.delete(fakeId);
                    callback(...cbArgs);
                };
                const realId = originalSetTimeout(wrappedCallback, realDelay, ...args);
                activeTimers.set(fakeId, { type: 'timeout', realId: realId, callback: wrappedCallback, delay: delay, args: args });
            };
            startRealTimer();
            return fakeId;
        };

        window.clearTimeout = function(fakeId) {
            if (activeTimers.has(fakeId)) {
                originalClearTimeout(activeTimers.get(fakeId).realId);
                activeTimers.delete(fakeId);
            }
        };

        window.updateAllTimers = function() {
            activeTimers.forEach((info, fakeId) => {
                if (info.type === 'interval') originalClearInterval(info.realId);
                else originalClearTimeout(info.realId);
                const newRealDelay = info.delay / window.currentSpeed;
                if (info.type === 'interval') info.realId = originalSetInterval(info.callback, newRealDelay, ...info.args);
                else info.realId = originalSetTimeout(info.callback, newRealDelay, ...info.args);
            });
        };

        window.triggerSkipOverkill = function(doneCallback) {
            const SPEED = 2000;       
            const REAL_SECONDS = 0.6;   

            const VIRTUAL_DELAY = REAL_SECONDS * 1000 * SPEED;

            window.currentSpeed = SPEED;
            window.updateAllTimers();

            setTimeout(() => {
                window.currentSpeed = 1;
                window.updateAllTimers();
                if (doneCallback) doneCallback();
            }, VIRTUAL_DELAY);
        };
    })();
    `;
    (document.head || document.documentElement).appendChild(hackScript);
    hackScript.remove();

    // ===================
    // MENU
    // ===================
    window.addEventListener('load', function() {
        const themeColor = "#E94B4B";

        const menu = document.createElement("div");
        Object.assign(menu.style, {
            position: "fixed", bottom: "20px", right: "20px", zIndex: "999999",
            width: "190px", backdropFilter: "blur(12px)", background: "rgba(255, 255, 255, 0.75)",
            borderRadius: "14px", boxShadow: `0 6px 20px ${themeColor}55`,
            fontFamily: "'Poppins', 'Segoe UI', Roboto, sans-serif",
            userSelect: "none", transition: "box-shadow 0.3s ease", cursor: "grab",
            display: "flex", flexDirection: "column", overflow: "hidden",
        });
        document.body.appendChild(menu);

        const header = document.createElement("div");
        header.textContent = "by nnam";
        Object.assign(header.style, {
            background: themeColor, color: "white", padding: "10px 0",
            fontWeight: "700", fontSize: "16px", textAlign: "center",
            borderTopLeftRadius: "14px", borderTopRightRadius: "14px", userSelect: "none",
        });
        menu.appendChild(header);

        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        header.style.touchAction = "none";
        header.addEventListener("pointerdown", (e) => {
            isDragging = true; menu.style.cursor = "grabbing";
            dragOffsetX = e.clientX - menu.getBoundingClientRect().left;
            dragOffsetY = e.clientY - menu.getBoundingClientRect().top;
            header.setPointerCapture(e.pointerId);
        });
        header.addEventListener("pointermove", (e) => {
            if (!isDragging) return;
            menu.style.left = (e.clientX - dragOffsetX) + "px";
            menu.style.top = (e.clientY - dragOffsetY) + "px";
            menu.style.bottom = "auto"; menu.style.right = "auto";
        });
        header.addEventListener("pointerup", (e) => { isDragging = false; menu.style.cursor = "grab"; header.releasePointerCapture(e.pointerId); });

        const btnArea = document.createElement("div");
        Object.assign(btnArea.style, { padding: "12px", display: "flex", flexDirection: "column", gap: "10px" });
        menu.appendChild(btnArea);

        function createButton(label) {
            const btn = document.createElement("button");
            btn.textContent = label;
            Object.assign(btn.style, {
                padding: "10px 12px", border: "none", background: "rgba(233, 75, 75, 0.15)",
                color: themeColor, fontSize: "15px", fontWeight: "600", borderRadius: "10px",
                cursor: "pointer", backdropFilter: "blur(6px)", transition: "all 0.25s ease",
                letterSpacing: "0.3px", userSelect: "none",
            });
            btn.addEventListener("mouseenter", () => { if(!btn.disabled) { btn.style.background = themeColor; btn.style.color = "white"; }});
            btn.addEventListener("mouseleave", () => { if(!btn.disabled) { btn.style.background = "rgba(233, 75, 75, 0.15)"; btn.style.color = themeColor; }});
            return btn;
        }

        const btnSlideDau = createButton("◀️ Slide đầu");
        const btnSlideCuoi = createButton("Slide cuối ▶️");
        const btnSkip = createButton("⏩ Skip 15p");

        btnArea.appendChild(btnSlideDau);
        btnArea.appendChild(btnSlideCuoi);
        btnArea.appendChild(btnSkip);

        function autoClick(selector, duration = 1000) {
            const startTime = performance.now();
            function clickLoop(now) {
                if (now - startTime >= duration) return;
                const btn = document.querySelector(selector);
                if (btn) btn.click();
                requestAnimationFrame(clickLoop);
            }
            requestAnimationFrame(clickLoop);
        }

        btnSlideDau.addEventListener("click", () => { autoClick(".prev-button"); });
        btnSlideCuoi.addEventListener("click", () => { autoClick("button.ant-btn-primary:nth-child(3)"); });

        btnSkip.addEventListener("click", () => {
            if (window.triggerSkipOverkill) {
                btnSkip.disabled = true;
                btnSkip.textContent = "⏳";
                btnSkip.style.background = "#FFC107";
                btnSkip.style.color = "black";

                const runHack = new Function("cb", "window.triggerSkipOverkill(cb)");

                runHack(() => {
                    btnSkip.textContent = "✅ Done ";
                    btnSkip.style.background = "#4CAF50";
                    btnSkip.style.color = "white";

                    setTimeout(() => {
                        btnSkip.disabled = false;
                        btnSkip.textContent = "⏩ Skip 15p";
                        btnSkip.style.background = "rgba(233, 75, 75, 0.15)";
                        btnSkip.style.color = themeColor;
                    }, 2000);
                });
            }
        });
    });
})();