// ==UserScript==
// @name         Speed Typing Online Cheat
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Speed Typing Online Cheat - Supported Modes: Type The Alphabet, Type The Flags, Type PI, Fast Fire Typer
// @author       Omkar04
// @match        https://www.speedtypingonline.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speedtypingonline.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/548149/Speed%20Typing%20Online%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/548149/Speed%20Typing%20Online%20Cheat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---- state ----
    let cr; // interval handle for legacy flows
    let prevC; // previous content tracker for flags mode
    let originalResetMultiplier = null; // backup for god mode

    // ---- popup ----
    window.popup = function (msg) {
        let div = document.createElement("div");
        div.textContent = msg;
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.right = "20px";
        div.style.background = "black";
        div.style.color = "white";
        div.style.padding = "25px 30px";
        div.style.fontSize = "20px";
        div.style.borderRadius = "8px";
        div.style.fontFamily = "sans-serif";
        div.style.zIndex = 999999;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    };

    // ---- small helpers ----
    function formatSeconds(s) {
        if (!Number.isFinite(s)) return String(s);
        const mm = Math.floor(s / 60);
        const ss = Math.floor(s % 60);
        return `${mm}:${ss.toString().padStart(2, "0")}`;
    }

    function getDelay() {
        return parseInt(localStorage.getItem("delayMS") || "100");
    }

    function makeDraggable(elem, handle) {
        let offsetX = 0, offsetY = 0, isDown = false;

        handle.addEventListener("mousedown", (e) => {
            if (elem.style.opacity === "0") return;
            isDown = true;
            offsetX = e.clientX - elem.offsetLeft;
            offsetY = e.clientY - elem.offsetTop;
            handle.style.cursor = "grabbing";
            e.preventDefault();
        });

        document.addEventListener("mouseup", () => {
            if (elem.style.opacity === "0") return;
            isDown = false;
            handle.style.cursor = "grab";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            if (elem.style.opacity === "0") return;
            elem.style.left = (e.clientX - offsetX) + "px";
            elem.style.top = (e.clientY - offsetY) + "px";
        });
    }


    // ---- UI: simple slider-only menu (Alphabet, PI) ----
    function createSliderMenu() {
        if (document.querySelector("#cheatMenu")) return; // avoid duplicates
        let menu = document.createElement("div");
        menu.id = "cheatMenu";
        menu.style.position = "absolute";
        menu.style.top = "70px";
        menu.style.background = "#252525";
        menu.style.color = "white";
        menu.style.padding = "10px";
        menu.style.borderRadius = "8px";
        menu.style.zIndex = "999999";
        menu.style.width = "220px";
        menu.style.fontSize = "14px";
        menu.style.transition = "opacity 0.25s ease";
        menu.style.opacity = "1";

        menu.innerHTML = `
            <label>Typing Delay: <span id="delayLabel">${getDelay()}ms</span></label>
            <input type="range" id="delaySlider" min="0" max="200" step="5" value="${getDelay()}" style="width:100%;">
            <div style="font-size:12px;color:#ccc;margin-top:6px;">Press F1 to start auto typer</div>
            <div style="font-size:12px;color:#ccc;margin-top:6px;">Press F2 to hide/show menu</div>
        `;

        let header = document.createElement("div");
        header.textContent = "Cheat Menu ⚡";
        header.style.fontWeight = "bold";
        header.style.padding = "4px";
        header.style.cursor = "grab";
        header.style.background = "#333";
        header.style.borderBottom = "1px solid #555";
        menu.prepend(header);

        document.body.appendChild(menu);
        makeDraggable(menu, header);

        let slider = menu.querySelector("#delaySlider");
        let label = menu.querySelector("#delayLabel");
        slider.addEventListener("input", () => {
            localStorage.setItem("delayMS", slider.value);
            label.textContent = slider.value + "ms";
        });
    }

    // ---- UI: Flags menu (slider + autoType checkbox) ----
    function createFlagsMenu() {
        if (document.querySelector("#cheatMenu")) return; // avoid duplicates
        let menu = document.createElement("div");
        menu.id = "cheatMenu";
        menu.style.position = "absolute";
        menu.style.top = "70px";
        menu.style.background = "#252525";
        menu.style.color = "white";
        menu.style.padding = "10px";
        menu.style.borderRadius = "8px";
        menu.style.zIndex = "999999";
        menu.style.width = "240px";
        menu.style.fontSize = "14px";
        menu.style.transition = "opacity 0.25s ease";
        menu.style.opacity = "1";

        menu.innerHTML = `
            <div id="cn" style="font-weight:bold;margin-bottom:6px;font-size: 18px;">Country name will appear here</div>
            <label>Typing Delay: <span id="delayLabel">${getDelay()}ms</span></label>
            <input type="range" id="delaySlider" min="0" max="200" step="5" value="${getDelay()}" style="width:100%;"><br>
            <label style="display:block;margin-top:6px;">
                <input type="checkbox" id="autoFlagsChk"> Auto Type (Flags)
            </label>
            <div style="font-size:12px;color:#ccc;margin-top:6px;">Press F1 to start/stop typing</div>
            <div style="font-size:12px;color:#ccc;margin-top:6px;">Press F2 to hide/show menu</div>
        `;

        let header = document.createElement("div");
        header.textContent = "Cheat Menu ⚡";
        header.style.fontWeight = "bold";
        header.style.padding = "4px";
        header.style.cursor = "grab";
        header.style.background = "#333";
        header.style.borderBottom = "1px solid #555";
        menu.prepend(header);

        document.body.appendChild(menu);
        makeDraggable(menu, header);

        let slider = menu.querySelector("#delaySlider");
        let label = menu.querySelector("#delayLabel");
        slider.addEventListener("input", () => {
            localStorage.setItem("delayMS", slider.value);
            label.textContent = slider.value + "ms";
        });
    }

    // ---- UI: FFT menu (slider + auto type + god mode + +10s + end game) ----
    function createFFTMenu() {
        let menu = document.createElement("div");
        menu.id = "cheatMenu";
        menu.style.position = "absolute";
        menu.style.top = "70px";
        menu.style.background = "#252525";
        menu.style.color = "white";
        menu.style.padding = "10px";
        menu.style.borderRadius = "8px";
        menu.style.zIndex = "999999";
        menu.style.width = "300px";
        menu.style.fontSize = "14px";
        menu.style.transition = "opacity 0.25s ease";
        menu.style.opacity = "1";

        let godModeSaved = localStorage.getItem("fftGodMode") === "1";

        menu.innerHTML = `
            <label>Typing Delay: <span id="delayLabel">${getDelay()}ms</span></label>
            <input type="range" id="delaySlider" min="50" max="300" step="5" value="${getDelay()}" style="width:100%;"><br>
            <label style="display:block;margin-top:6px;"><input type="checkbox" id="autoT"> Auto Type (FFT)</label>
            <label style="display:block;margin-top:6px;"><input type="checkbox" id="godModeChk"> Multiplier God Mode</label>
            <div style="margin-top:8px;">
                <button id="add10Btn" style="padding:6px 8px;border-radius:6px;border:none;background:#4CAF50;color:white;cursor:pointer;">+10 seconds</button>
                <span style="font-size:10px;color:#ccc;">(works only when timer is started)</span>
                <button id="endGameBtn" style="padding:6px 8px;border-radius:6px;border:none;background:#E53935;color:white;cursor:pointer;margin-top:8px;">End Game</button>
            </div>
            <div style="font-size:12px;color:#ccc;margin-top:6px;">Press F1 to start/stop typing</div>
            <div style="font-size:16px;color:#ccc;margin-top:6px;">Press F2 to hide/show menu</div>
        `;

        let header = document.createElement("div");
        header.textContent = "Cheat Menu ⚡";
        header.style.fontWeight = "bold";
        header.style.padding = "4px";
        header.style.cursor = "grab";
        header.style.background = "#333";
        header.style.borderBottom = "1px solid #555";
        menu.prepend(header);

        document.body.appendChild(menu);
        makeDraggable(menu, header);

        let slider = menu.querySelector("#delaySlider");
        let label = menu.querySelector("#delayLabel");
        slider.addEventListener("input", () => {
            localStorage.setItem("delayMS", slider.value);
            label.textContent = slider.value + "ms";
        });

        // restore God Mode saved state
        let godChk = menu.querySelector("#godModeChk");
        if (godModeSaved) {
            godChk.checked = true;
            enableGodMode(); // re-enable on load if previously saved
        }

        godChk.addEventListener("change", (e) => {
            if (e.target.checked) {
                localStorage.setItem("fftGodMode", "1");
                enableGodMode();
            } else {
                localStorage.removeItem("fftGodMode");
                disableGodMode();
            }
        });

        // +10s button
        let addBtn = menu.querySelector("#add10Btn");
        addBtn.addEventListener("click", () => {
            try {
                if (typeof window.TotalSeconds === "number") {
                    window.TotalSeconds += 10;
                } else if (typeof TotalSeconds === "number") {
                    TotalSeconds += 10;
                }
                const ts = (typeof window.TotalSeconds === "number")
                    ? window.TotalSeconds
                    : (typeof TotalSeconds === "number" ? TotalSeconds : NaN);
                window.popup(`[+10s] TotalSeconds = ${formatSeconds(ts)}`);
            } catch (err) {
                console.error("Add10s error:", err);
                window.popup("[⚠️] Failed to add seconds.");
            }
        });

        // End Game button
        let endBtn = menu.querySelector("#endGameBtn");
        endBtn.addEventListener("click", () => {
            try {
                // only end if game running (reset button hidden) and TimeWasReset is false
                if (!window.TimeWasReset && document.querySelector("#resetBtn")?.style.visibility === "hidden") {
                    if (typeof window.TotalSeconds === "number") {
                        window.TotalSeconds = 0;
                    } else if (typeof TotalSeconds === "number") {
                        TotalSeconds = 0;
                    }
                    window.popup("[✅] Game Ended Successfully!!");
                }
            } catch (err) {
                console.error("End Game error:", err);
                window.popup("[⚠️] Failed to end the game.");
            }
        });
    }

    // ---- God Mode functions (patch/unpatch resetMultiplier) ----
    function enableGodMode() {
        try {
            if (typeof window.resetMultiplier === "function" && originalResetMultiplier === null) {
                originalResetMultiplier = window.resetMultiplier;
            }
            // override regardless
            window.resetMultiplier = function () { };
            window.popup("[⚡ God Mode ON] - Multiplier won't reset");
        } catch (err) {
            console.error("enableGodMode error:", err);
        }
    }

    function disableGodMode() {
        try {
            if (originalResetMultiplier && typeof originalResetMultiplier === "function") {
                window.resetMultiplier = originalResetMultiplier;
                window.popup("[❌ God Mode OFF] - Multiplier reset restored");
            } else {
                try {
                    if (window.resetMultiplier && window.resetMultiplier.toString().trim() === "function () {}") {
                        delete window.resetMultiplier;
                    }
                } catch (e) { }
                window.popup("[❌ God Mode OFF] - restored");
            }
        } catch (err) {
            console.error("disableGodMode error:", err);
        }
    }

    // ---- simulate key for block modes (flags, alphabet, pi) ----
    function simulateKey(char) {
        let upper = char.toUpperCase();
        let code = (char === ".") ? "Period" : "Key" + upper;
        let keyCode = (char === ".") ? 190 : upper.charCodeAt(0);

        const event = new KeyboardEvent("keydown", {
            key: char,
            code: code,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true
        });

        Object.defineProperty(event, "keyCode", { get: () => keyCode });
        Object.defineProperty(event, "which", { get: () => keyCode });

        document.querySelector("#blockLine0")?.dispatchEvent(event);
    }

    function autoType(word) {
        if (!word) return;
        let i = 0;
        let delay = getDelay();
        function typeNext() {
            if (i < word.length) {
                simulateKey(word[i]);
                i++;
                setTimeout(typeNext, delay);
            }
        }
        typeNext();
    }

    // ---- PI up to 1002 digits (including "3.") ----
    function getPI(len) {
        const PI1002 = "3." +
            "14159265358979323846264338327950288419716939937510" +
            "58209749445923078164062862089986280348253421170679" +
            "82148086513282306647093844609550582231725359408128" +
            "48111745028410270193852110555964462294895493038196" +
            "44288109756659334461284756482337867831652712019091" +
            "45648566923460348610454326648213393607260249141273" +
            "72458700660631558817488152092096282925409171536436" +
            "78925903600113305305488204665213841469519415116094" +
            "33057270365759591953092186117381932611793105118548" +
            "07446237996274956735188575272489122793818301194912" +
            "98336733624406566430860213949463952247371907021798" +
            "60943702770539217176293176752384674818467669405132" +
            "00056812714526356082778577134275778960917363717872" +
            "14684409012249534301465495853710507922796892589235" +
            "42019956112129021960864034418159813629774771309960" +
            "51870721134999999837297804995105973173281609631859" +
            "50244594553469083026425223082533446850352619311881" +
            "71010003137838752886587533208381420617177669147303" +
            "59825349042875546873115956286388235378759375195778" +
            "18577805321712268066130019278766111959092164201989" +
            "38095257201065485863278865936153381827968230301952" +
            "03530185296899577362259941389124972177528347913151" +
            "55748572424541506959508295331168617278558890750983";

        if (len && len.includes("Baby")) return PI1002.slice(0, 17);
        if (len && len.includes("Short")) return PI1002.slice(0, 27);
        if (len && len.includes("Medium")) return PI1002.slice(0, 52);
        if (len && len.includes("Long")) return PI1002.slice(0, 102);
        if (len && len.includes("Legendary")) return PI1002;
        return PI1002;
    }

    // ---- FFT typing (simulate real typing; uses wordBank) ----
    async function FFTCheat() {
        let el = document.querySelector("#gInput");
        if (!el) return;

        if (!window.wordBank || !Array.isArray(window.wordBank)) return;

        function randint(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        let word = window.wordBank[randint(0, window.wordBank.length - 1)];

        el.value = "";
        let delay = getDelay();

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const keyCode = char.charCodeAt(0);
            ["keydown", "keypress", "keyup"].forEach(type => {
                let ev = new KeyboardEvent(type, {
                    key: char,
                    code: "Key" + (char.toUpperCase() || ""),
                    keyCode: keyCode,
                    which: keyCode,
                    bubbles: true
                });
                Object.defineProperty(ev, "keyCode", { get: () => keyCode });
                Object.defineProperty(ev, "which", { get: () => keyCode });
                el.dispatchEvent(ev);
            });

            // update value & fire input so site sees typed letters
            el.value += char;
            el.dispatchEvent(new Event("input", { bubbles: true }));

            await new Promise(r => setTimeout(r, delay));
        }

        // press Enter
        ["keydown", "keypress", "keyup"].forEach(type => {
            let e = new KeyboardEvent(type, {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            Object.defineProperty(e, "keyCode", { get: () => 13 });
            Object.defineProperty(e, "which", { get: () => 13 });
            el.dispatchEvent(e);
        });
    }

    // ---- F2 close behaviors ----
    function enableF2HideMenu() {
        let container = document.querySelector("#blockDivContainer");
        const keyHandler = (e) => {
            if (e.key === "F2") {
                e.preventDefault();
                let menu = document.querySelector("#cheatMenu");
                if (menu) {
                    menu.style.opacity = menu.style.opacity === "0" ? "1" : "0";
                    if (menu.style.opacity === "0") {
                        window.popup("❌ Menu hidden");
                        menu.style.cursor = "";
                    }
                    else window.popup("📂 Menu shown");
                }
            }
        };
        [document, container].forEach(t => t?.addEventListener("keydown", keyHandler));
    }


    // ------------------ MODE-SPECIFIC INIT ------------------

    // FLAGS MODE (with checkbox requirement)
    if (location.pathname.includes("type-the-flags")) {
        createFlagsMenu();
        enableF2HideMenu();
        window.popup("[🚩] Tick 'Auto Type (Flags)' then press F1 to start/stop");
        setInterval(() => {
            document.querySelector("#cn").textContent = `Country: ${textString}`;
        }, 500);

        let container = document.querySelector("#blockDivContainer");
        let cheatRunning = false;
        let intervalId = null;

        const keyHandler = (e) => {
            if (e.key === "F1") {
                e.preventDefault();
                const menu = document.querySelector("#cheatMenu");
                const autoChk = menu?.querySelector("#autoFlagsChk");
                if (!autoChk || !autoChk.checked) {
                    window.popup("☑️ Tick 'Auto Type (Flags)' first!");
                    return;
                }

                if (cheatRunning) {
                    clearInterval(intervalId);
                    cheatRunning = false;
                    window.popup("[Cheat Stopped ❌] - Type The Flags");
                } else {
                    cheatRunning = true;
                    window.popup("[Cheat Started ✅] - Type The Flags");
                    intervalId = setInterval(() => {
                        if (typeof textString !== "undefined" && textString !== prevC) {
                            prevC = textString;
                            autoType(textString);
                        }
                    }, 500);
                }
            }
        };

        [document, container].forEach(t => t?.addEventListener("keydown", keyHandler));
    }

    // ALPHABET MODE
    if (location.pathname.includes("type-the-alphabet")) {
        createSliderMenu();
        enableF2HideMenu();
        window.popup("[🔤] Press F1 to start typing the alphabet!!");

        let container = document.querySelector("#blockDivContainer");
        const keyHandler = (e) => {
            if (e.key === "F1") {
                e.preventDefault();
                if (typeof textString !== "undefined") {
                    autoType(textString);
                }
            }
        };
        [document, container].forEach(t => t?.addEventListener("keydown", keyHandler));
    }

    // PI MODE
    if (location.pathname.includes("type-pi")) {
        createSliderMenu();
        enableF2HideMenu();
        window.popup("[🧮] Press F1 to start typing PI!!");

        let container = document.querySelector("#blockDivContainer");
        const keyHandler = (e) => {
            if (e.key === "F1") {
                e.preventDefault();
                let PI_length = document.querySelector(".ui-selectmenu-text")?.textContent || "";
                autoType(getPI(PI_length));
            }
        };
        [document, container].forEach(t => t?.addEventListener("keydown", keyHandler));
    }

    // FFT MODE
    if (location.pathname.includes("fast-fire-typer")) {
        createFFTMenu();
        enableF2HideMenu();
        window.popup("[🚀] Tick 'Auto Type (FFT)' then press F1 to start/stop. F2 hides/shows menu.");

        let fftRunning = false;

        document.addEventListener("keydown", async e => {
            if (e.key === "F1") {
                e.preventDefault();

                const menu = document.querySelector("#cheatMenu");
                const autoT = menu?.querySelector("#autoT");

                if (!autoT || !autoT.checked) {
                    window.popup("☑️ Tick 'Auto Type (FFT)' first!");
                    return;
                }

                if (fftRunning) {
                    fftRunning = false;
                    window.popup("[Cheat Stopped ❌] - Fast Fire Typer");
                    return;
                }

                fftRunning = true;
                window.popup("[Cheat Running ✅] - Fast Fire Typer");

                while (fftRunning && autoT && autoT.checked) {
                    // stop if reset button visible (timer ended)
                    let resetBtn = document.querySelector("#resetBtn");
                    if (resetBtn && resetBtn.style.visibility !== "hidden") {
                        fftRunning = false;
                        window.popup("[⏹️ Stopped] Timer ended");
                        break;
                    }
                    await FFTCheat();
                }
            }
        });
    }

})();
