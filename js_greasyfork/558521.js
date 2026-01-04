// ==UserScript==
// @name         Blooket Cosmetic GUI (Rainbow)
// @namespace    http://ilovepenguins.com/
// @version      1.0
// @description  Read "Additional Info"
// @author       ectothepingu
// @match        https://blooket.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558521/Blooket%20Cosmetic%20GUI%20%28Rainbow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558521/Blooket%20Cosmetic%20GUI%20%28Rainbow%29.meta.js
// ==/UserScript==
(function () {
    if (window._ectoCosmeticGUI) {
        console.log("Cosmetic GUI already loaded.");
        return;
    }
    window._ectoCosmeticGUI = true;

    /* ====================================================
                     GUI CONTAINER
    ==================================================== */

    const gui = document.createElement("div");
    gui.style = `
        position: fixed;
        top: 150px;
        left: 150px;
        width: 280px;
        background: #1e1e1e;
        border-radius: 8px;
        font-family: "Aptos", sans-serif !important;
        color: white;
        z-index: 999999999;
        user-select: none;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
    `;

    const topBar = document.createElement("div");
    topBar.style = `
        padding: 10px;
        font-size: 17px;
        background: #333;
        border-radius: 8px 8px 0 0;
        cursor: move;
        color: white;
        display: block;
        text-align: center;
        position: relative;
        font-family: "Aptos", sans-serif !important;
    `;

    /* ---------- NEW TITLE FORMAT ---------- */
    const title = document.createElement("div");
    title.innerText = "⭐ Cosmetic GUI ⭐";
    title.style = `
        font-family: "Aptos", sans-serif !important;
        font-size: 18px;
        font-weight: bold;
    `;
    topBar.appendChild(title);

    const subtitle = document.createElement("div");
    subtitle.innerText = "by ecto";
    subtitle.style = `
        font-family: "Aptos", sans-serif !important;
        font-size: 14px;
        margin-top: 3px;
        opacity: 0.85;
    `;
    topBar.appendChild(subtitle);

    /* ------- CLOSE BUTTON (UNCHANGED) -------- */
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "✕";
    closeBtn.style = `
        font-family: "Aptos", sans-serif !important;
        cursor: pointer;
        padding: 0 6px;
        font-size: 18px;
        color: white;
        position: absolute;
        top: 7px;
        right: 8px;
    `;
    closeBtn.onclick = () => {
        stopRainbow();
        gui.remove();
    };
    topBar.appendChild(closeBtn);

    gui.appendChild(topBar);

    const content = document.createElement("div");
    content.style = `
        padding: 12px;
        font-family: "Aptos", sans-serif !important;
    `;
    gui.appendChild(content);

    /* ====================================================
                     BUTTON + SLIDER
    ==================================================== */

    const rainbowBtn = document.createElement("button");
    rainbowBtn.innerText = "Rainbow";
    rainbowBtn.style = `
        width: 100%;
        padding: 10px;
        margin-bottom: 12px;
        background: #4f4fff;
        border: none;
        border-radius: 5px;
        font-size: 15px;
        cursor: pointer;
        font-family: "Aptos", sans-serif !important;
        color: white;
    `;
    content.appendChild(rainbowBtn);

    const speedLabel = document.createElement("div");
    speedLabel.innerText = "Speed (1–10):";
    speedLabel.style = `
        margin-top: 5px;
        margin-bottom: 3px;
        font-family: "Aptos", sans-serif !important;
    `;
    content.appendChild(speedLabel);

    const speedSlider = document.createElement("input");
    speedSlider.type = "range";
    speedSlider.min = "1";
    speedSlider.max = "10";
    speedSlider.value = "5";
    speedSlider.style = `
        width: 100%;
        font-family: "Aptos", sans-serif !important;
    `;
    content.appendChild(speedSlider);

    /* ====================================================
                     KEYBIND DISPLAY
    ==================================================== */

    const keybindInfo = document.createElement("div");
    keybindInfo.innerHTML = `
        <br>
        <b>Keybinds:</b><br>
        Z — Start/Stop Rainbow<br>
        X — Close GUI
    `;
    keybindInfo.style = `
        margin-top: 10px;
        font-size: 14px;
        line-height: 1.3;
        font-family: "Aptos", sans-serif !important;
    `;
    content.appendChild(keybindInfo);

    document.body.appendChild(gui);

    /* ====================================================
                     DRAGGING LOGIC
    ==================================================== */
    let dragging = false, offsetX = 0, offsetY = 0;

    topBar.addEventListener("mousedown", (e) => {
        dragging = true;
        offsetX = e.clientX - gui.offsetLeft;
        offsetY = e.clientY - gui.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (dragging) {
            gui.style.left = (e.clientX - offsetX) + "px";
            gui.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => dragging = false);

    /* ====================================================
                     RAINBOW EFFECT
    ==================================================== */

    let rainbowActive = false;
    let hue = 0;
    let loop;

    function applyRainbow(h) {
        const elems = document.querySelectorAll("*");
        elems.forEach(elem => {
            if (!gui.contains(elem)) {
                elem.style.transition = "background-color 0.2s linear, color 0.2s linear";
                const bg = `hsla(${h}, 75%, 60%, 0.35)`;
                const fg = `hsl(${(h+180)%360}, 85%, 95%)`;

                if (getComputedStyle(elem).backgroundColor !== "rgba(0, 0, 0, 0)") {
                    elem.style.backgroundColor = bg;
                }
                elem.style.color = fg;
            }
        });
    }

    function startRainbow() {
        if (rainbowActive) return;
        rainbowActive = true;

        loop = setInterval(() => {
            hue = (hue + Number(speedSlider.value)) % 360;
            applyRainbow(hue);
        }, 80);
    }

    function stopRainbow() {
        clearInterval(loop);
        rainbowActive = false;
    }

    rainbowBtn.onclick = () => {
        rainbowActive ? stopRainbow() : startRainbow();
    };

    /* ====================================================
                     KEYBINDS
    ==================================================== */

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "z") {
            rainbowActive ? stopRainbow() : startRainbow();
        } else if (e.key.toLowerCase() === "x") {
            stopRainbow();
            gui.remove();
        }
    });

})();
