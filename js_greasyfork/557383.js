// ==UserScript==
// @name         NinjaIO Mod UI v0.015 (changed to  ninjabattle.io)
// @namespace    http://tampermonkey.net/
// @version      0.015
// @description  Full Mod UI: FPS, Click Taps, Custom Cursor, Rainbow, UI Color, Fullscreen Panel
// @author       Militina
// @match        *://ninjabattle.io/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557383/NinjaIO%20Mod%20UI%20v0015%20%28changed%20to%20%20ninjabattleio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557383/NinjaIO%20Mod%20UI%20v0015%20%28changed%20to%20%20ninjabattleio%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //---------------------------------------------------------
    // SHOW LOADING EFFECT
    //---------------------------------------------------------
    const observer = new MutationObserver(() => {
        if (window.gameplayStart === true) showLoadingEffect();
    });
    observer.observe(document, { childList: true, subtree: true });

    function showLoadingEffect() {
        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.top = "50%";
        box.style.left = "50%";
        box.style.transform = "translate(-50%, -50%)";
        box.style.padding = "25px 40px";
        box.style.borderRadius = "15px";
        box.style.background = "linear-gradient(90deg, red, orange, yellow, green, blue, purple)";
        box.style.color = "white";
        box.style.fontSize = "30px";
        box.style.fontWeight = "bold";
        box.style.zIndex = "9999999";
        box.style.textShadow = "0 0 5px black";
        box.innerText = "Loading...";
        document.body.appendChild(box);

        setTimeout(() => {
            box.innerText = "Les gooo!";
            setTimeout(() => box.remove(), 800);
        }, 1000);
    }

    setTimeout(initUI, 1000);

    //---------------------------------------------------------
    // MAIN UI
    //---------------------------------------------------------
    function initUI() {
        //-----------------------------------------------------
        // CSS
        //-----------------------------------------------------
        const style = document.createElement("style");
        style.textContent = `
            #modPanel {
                position: fixed;
                top: 50px;
                left: 10px;
                background: rgba(25,25,25,0.9);
                border: 2px solid #ff69b4;
                border-radius: 8px;
                padding: 14px;
                font-family: 'Comic Sans MS', Arial, sans-serif;
                width: 200px;
                color: white;
                z-index: 99999;
                cursor: default;
            }
            .modBtn {
                padding: 6px;
                margin: 5px 0;
                background: #222;
                border: 1px solid #ff69b4;
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
                transition: 0.2s;
            }
            .modBtn:hover {
                background: #ff69b4;
                color: black;
            }
            #panelHeader {
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                margin-bottom: 8px;
                background: linear-gradient(90deg, red, orange, yellow, green, blue, violet);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                cursor: move;
            }
            #toggleUIBtn {
                position: fixed;
                top: 50%;
                right: 0px;
                padding: 6px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                background: linear-gradient(90deg, red, orange, yellow, green, blue, violet);
                color: white;
                border: none;
                z-index: 99999;
                transform: translateY(-50%);
                transition: 0.2s;
            }
            #fpsCounter {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                padding: 6px 10px;
                border-radius: 5px;
                color: #ff69b4;
                font-size: 14px;
                font-family: 'Comic Sans MS', Arial, sans-serif;
                z-index: 9999;
                display: none;
            }
            .clickTap {
                position: fixed;
                width: 20px;
                height: 20px;
                background: rgba(0,255,0,0.7);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
                animation: fadeTap 0.3s ease-out forwards;
            }
            @keyframes fadeTap {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.4); }
            }
        `;
        document.head.appendChild(style);

        //-----------------------------------------------------
        // PANEL ELEMENT
        //-----------------------------------------------------
        const panel = document.createElement("div");
        panel.id = "modPanel";
        panel.innerHTML = `
            <div id="panelHeader">Militina's NinjaIO UI</div>
            <div class="modBtn" id="fpsToggle">FPS: OFF</div>
            <div class="modBtn" id="clickTapsBtn">Click Taps ↓</div>
            <div id="clickTapsPanel" style="display:none; margin-top:5px;">
                <label>Left Color: <input type="color" id="leftColor" value="#ff0000"></label>
                <label>Right Color: <input type="color" id="rightColor" value="#0000ff"></label>
                <label>Size: <input type="range" id="tapSize" min="5" max="40" value="10"></label>
                <div class="modBtn" id="clickTapToggle">OFF</div>
            </div>
            <div class="modBtn" id="customCursorBtn">Custom Cursor ↓</div>
            <div id="customCursorPanel" style="display:none;">
                <input type="file" id="cursorFile" accept=".png,.jpg,.jpeg">
                <label>Size: <input type="range" id="cursorSize" min="10" max="128" value="32"></label>
            </div>
            <div class="modBtn" id="uiColorBtn">Custom UI Color ↓</div>
            <div id="uiColorPanel" style="display:none;">
                <label>Border Color: <input type="color" id="uiColorPick"></label>
                <div class="modBtn" id="rainbowBtn">Rainbow Mode: OFF</div>
            </div>
            <div class="modBtn" id="fullscreenBtn">Fullscreen: OFF</div>
        `;
        document.body.appendChild(panel);

        //-----------------------------------------------------
        // OPEN/CLOSE UI BUTTON
        //-----------------------------------------------------
        const toggleUI = document.createElement("div");
        toggleUI.id = "toggleUIBtn";
        toggleUI.textContent = "OPEN / OFF UI";
        document.body.appendChild(toggleUI);

        let uiVisible = true;
        toggleUI.addEventListener("click", () => {
            uiVisible = !uiVisible;
            panel.style.display = uiVisible ? "block" : "none";
        });

        //-----------------------------------------------------
        // DRAG PANEL (ปุ่มกดได้ทุกปุ่ม)
        //-----------------------------------------------------
        let drag = false, offsetX = 0, offsetY = 0;
        panel.addEventListener("mousedown", e => {
            if (e.target.classList.contains("modBtn") || e.target.tagName === "INPUT" || e.target.tagName === "BUTTON" || e.target.closest("label")) return;
            drag = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });
        document.addEventListener("mousemove", e => { if (drag) { panel.style.left = (e.clientX - offsetX) + "px"; panel.style.top = (e.clientY - offsetY) + "px"; }});
        document.addEventListener("mouseup", () => drag = false);

        //-----------------------------------------------------
        // FPS COUNTER ONLY
        //-----------------------------------------------------
        const fpsBox = document.createElement("div");
        fpsBox.id = "fpsCounter";
        document.body.appendChild(fpsBox);
        let lastFrame = performance.now();
        function updateFPS() {
            const now = performance.now();
            const fps = Math.round(1000 / (now - lastFrame));
            fpsBox.textContent = `FPS: ${fps}`;
            lastFrame = now;
            requestAnimationFrame(updateFPS);
        }
        updateFPS();

        document.getElementById("fpsToggle").addEventListener("click", () => {
            let show = fpsBox.style.display === "none";
            fpsBox.style.display = show ? "block" : "none";
            document.getElementById("fpsToggle").textContent = `FPS: ${show ? "ON" : "OFF"}`;
        });

        //-----------------------------------------------------
        // CLICK TAPS
        //-----------------------------------------------------
        let clickTapsOn = false;
        const clickTapsPanel = document.getElementById("clickTapsPanel");
        document.getElementById("clickTapsBtn").addEventListener("click", () => {
            clickTapsPanel.style.display = clickTapsPanel.style.display === "none" ? "block" : "none";
        });
        document.getElementById("clickTapToggle").addEventListener("click", () => {
            clickTapsOn = !clickTapsOn;
            document.getElementById("clickTapToggle").textContent = clickTapsOn ? "ON" : "OFF";
        });
        let leftColor = "#ff0000", rightColor = "#0000ff", tapSize = 10;
        document.getElementById("leftColor").addEventListener("input", e => leftColor = e.target.value);
        document.getElementById("rightColor").addEventListener("input", e => rightColor = e.target.value);
        document.getElementById("tapSize").addEventListener("input", e => tapSize = e.target.value);
        document.addEventListener("mousedown", e => {
            if (!clickTapsOn) return;
            const tap = document.createElement("div");
            tap.className = "clickTap";
            tap.style.left = e.clientX + "px";
            tap.style.top = e.clientY + "px";
            tap.style.width = tapSize + "px";
            tap.style.height = tapSize + "px";
            tap.style.background = e.button === 2 ? rightColor : leftColor;
            document.body.appendChild(tap);
            setTimeout(() => tap.remove(), 300);
        });

        //-----------------------------------------------------
        // CUSTOM CURSOR
        //-----------------------------------------------------
        const customCursorPanel = document.getElementById("customCursorPanel");
        document.getElementById("customCursorBtn").addEventListener("click", () => {
            customCursorPanel.style.display = customCursorPanel.style.display === "none" ? "block" : "none";
        });
        let cursorImg = null;
        document.getElementById("cursorFile").addEventListener("change", e => {
            const file = e.target.files[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            if (!cursorImg) {
                cursorImg = document.createElement("img");
                cursorImg.style.position = "fixed";
                cursorImg.style.pointerEvents = "none";
                cursorImg.style.zIndex = 999999;
                document.body.style.cursor = "none";
                document.body.appendChild(cursorImg);
            }
            cursorImg.src = url;
            cursorImg.width = cursorSize.value;
            cursorImg.height = cursorSize.value;
        });
        document.getElementById("cursorSize").addEventListener("input", e => {
            if (cursorImg) {
                cursorImg.width = e.target.value;
                cursorImg.height = e.target.value;
            }
        });
        document.addEventListener("mousemove", e => {
            if (cursorImg) {
                cursorImg.style.left = e.clientX + "px";
                cursorImg.style.top = e.clientY + "px";
            }
        });

        //-----------------------------------------------------
        // CUSTOM UI COLOR + RAINBOW
        //-----------------------------------------------------
        let rainbow = false, rainbowHue = 0;
        const uiColorPanel = document.getElementById("uiColorPanel"), uiPick = document.getElementById("uiColorPick");
        document.getElementById("uiColorBtn").addEventListener("click", () => uiColorPanel.style.display = uiColorPanel.style.display === "none" ? "block" : "none");
        uiPick.addEventListener("input", e => setUIColor(e.target.value));
        function setUIColor(color){ panel.style.borderColor=color; document.querySelectorAll(".modBtn").forEach(btn=>btn.style.borderColor=color); }
        document.getElementById("rainbowBtn").addEventListener("click", ()=>{ rainbow = !rainbow; document.getElementById("rainbowBtn").textContent = `Rainbow Mode: ${rainbow?"ON":"OFF"}`; });
        function loopRainbow(){ if(rainbow){ rainbowHue=(rainbowHue+2)%360; setUIColor(`hsl(${rainbowHue},100%,50%)`); } requestAnimationFrame(loopRainbow); }
        loopRainbow();

        //-----------------------------------------------------
        // FULLSCREEN PANEL
        //-----------------------------------------------------
        let full = false;
        document.getElementById("fullscreenBtn").addEventListener("click", ()=>{
            full = !full;
            if(full){ panel.style.width="90%"; panel.style.top="50%"; panel.style.left="50%"; panel.style.transform="translate(-50%,-50%)"; }
            else{ panel.style.width="200px"; panel.style.left="10px"; panel.style.top="50px"; panel.style.transform="none"; }
            document.getElementById("fullscreenBtn").textContent = `Fullscreen: ${full?"ON":"OFF"}`;
        });
    }
})();
