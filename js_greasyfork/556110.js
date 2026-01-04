// ==UserScript==
// @name         Bloxd Phantom Panel
// @namespace    https://limeyoutuber.dev/bloxdphantom
// @version      1.0
// @description  Advanced in-game panel with FOV slider and interactive modules for Bloxd.io
// @match        https://bloxd.io/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556110/Bloxd%20Phantom%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/556110/Bloxd%20Phantom%20Panel.meta.js
// ==/UserScript==

(function() {
    // === ПАНЕЛЬ ===
    const panel = document.createElement("div");
    panel.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
        background: rgba(10,10,10,0.95);
        color: #fff;
        padding: 15px;
        border: 2px solid #ff0000;
        font-family: monospace;
        display: none;
        z-index: 999999;
        box-shadow: 0 0 20px red;
    `;
    panel.innerHTML = `
        <h2 style="text-align:center; color:red;">Bloxd Phantom Panel</h2>

        <label>FOV Slider (Legal Function)</label><br>
        <input id="fovSlider" type="range" min="30" max="120" value="90" style="width:100%;">
        <br><br>

        <div style="border-top:1px solid red; margin:10px 0;"></div>

        <label><input type="checkbox" class="fake"> KillAura X</label><br>
        <label><input type="checkbox" class="fake"> Scaffold Pro</label><br>
        <label><input type="checkbox" class="fake"> Teleport Reach</label><br>
        <label><input type="checkbox" class="fake"> Velocity 0%</label><br>
        <label><input type="checkbox" class="fake"> ESP Player Bones</label><br>
        <label><input type="checkbox" class="fake"> AutoCrystal</label><br>
        <label><input type="checkbox" class="fake"> SpeedHack Boost</label><br>
        <br>

        <label><input id="antiban" type="checkbox"> ANTI BAN SAFER</label>
        <br><br>
        <button id="closePanel" style="width:100%; padding:5px; background:red; color:white;">Close</button>
    `;
    document.body.appendChild(panel);

    // === ОТКРЫТИЕ НА SHIFT+R ===
    let panelOpen = false;
    document.addEventListener("keydown", e => {
        if (e.code === "ShiftRight") {
            panel.style.display = panelOpen ? "none" : "block";
            panelOpen = !panelOpen;
        }
    });

    // === FOV РЕАЛЬНО РАБОТАЕТ ===
    const slider = panel.querySelector("#fovSlider");
    slider.addEventListener("input", () => {
        document.querySelector("canvas").style.transform = `perspective(${slider.value * 10}px)`;
    });

    // === ФЕЙК ЭФФЕКТЫ ДЛЯ «НЕСУЩЕСТВУЮЩИХ ЧИТОВ» ===
    document.querySelectorAll(".fake").forEach(f => {
        f.addEventListener("change", () => {
            if (f.checked) {
                document.body.style.boxShadow = "0 0 15px red inset";
                setTimeout(() => document.body.style.boxShadow = "", 200);
            }
        });
    });

    // === ANTI BAN SAFER (ФЕЙК БАН ЭКРАН) ===
    document.querySelector("#antiban").addEventListener("change", e => {
        if (e.target.checked) {
            const ban = document.createElement("div");
            ban.id = "fakeBan";
            ban.style = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
                color: red;
                font-size: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999999;
                flex-direction: column;
            `;
            ban.innerHTML = `
                <div>⚠ YOU GOT BANNED FOREVER ⚠</div>
                <div style="font-size:20px;">Reason: ANTI BAN BYPASSED</div>
            `;
            document.body.appendChild(ban);
            setTimeout(() => ban.remove(), 3000);
        }
    });

    // === КНОПКА CLOSE ===
    document.querySelector("#closePanel").onclick = () => {
        panel.style.display = "none";
        panelOpen = false;
    };

    console.log("Bloxd Phantom Panel Loaded");
})();
