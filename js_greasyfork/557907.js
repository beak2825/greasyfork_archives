// ==UserScript==
// @name         Hitbox.io Music Player + Screen Filters
// @namespace    custommod.hitbox
// @version      4.01
// @description  Filters + draggable UI + YouTube music + rainbow user + compact menus
// @match        https://hitbox.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557907/Hitboxio%20Music%20Player%20%2B%20Screen%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/557907/Hitboxio%20Music%20Player%20%2B%20Screen%20Filters.meta.js
// ==/UserScript==

(function() {
    "use strict";

    /* ---------------------------------------------------------
       GENERAL UTILS
    --------------------------------------------------------- */

    const $ = sel => document.querySelector(sel);

    function makeDraggable(element, handle) {
        let x = 0, y = 0, offsetX = 0, offsetY = 0;
        handle.style.cursor = "grab";

        handle.onmousedown = dragStart;

        function dragStart(e) {
            e.preventDefault();
            handle.style.cursor = "grabbing";

            offsetX = e.clientX;
            offsetY = e.clientY;

            document.onmousemove = dragMove;
            document.onmouseup = dragEnd;
        }

        function dragMove(e) {
            x = e.clientX - offsetX;
            y = e.clientY - offsetY;

            offsetX = e.clientX;
            offsetY = e.clientY;

            const rect = element.getBoundingClientRect();
            element.style.left = rect.left + x + "px";
            element.style.top = rect.top + y + "px";
        }

        function dragEnd() {
            handle.style.cursor = "grab";
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    /* ---------------------------------------------------------
       CREATE STYLE
    --------------------------------------------------------- */

    const style = document.createElement("style");
    style.textContent = `
    .modPanel, .musicPanel {
        position: fixed;
        width: 280px;
        background: rgba(50, 50, 50, 0.65);
        backdrop-filter: blur(10px);
        color: white;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        transform: translateX(120%);
        transition: transform .35s cubic-bezier(.25,.8,.25,1), opacity .3s ease;
        opacity: 0;
        z-index: 99999;
    }

    .panelHeader {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255,255,255,0.15);
        cursor: grab;
    }

    .panelRow {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;
    }

    .panelRow input[type=range] {
        width: 130px;
    }

    .rainbowName {
        animation: rainbow 1.2s linear infinite;
    }

    @keyframes rainbow {
        0% { color: red; }
        20% { color: orange; }
        40% { color: yellow; }
        60% { color: lightgreen; }
        80% { color: cyan; }
        100% { color: violet; }
    }
    `;
    document.head.appendChild(style);

    /* ---------------------------------------------------------
       UI ELEMENTS
    --------------------------------------------------------- */

    const modPanel = document.createElement("div");
    modPanel.className = "modPanel";
    modPanel.style.top = "80px";
    modPanel.style.right = "20px";

    modPanel.innerHTML = `
      <div class="panelHeader" id="modDrag">Mod Menu</div>

      <div class="panelRow">
         <label>Brightness</label>
         <input id="bright" type="range" min="0" max="200" value="100">
      </div>

      <div class="panelRow">
         <label>Contrast</label>
         <input id="contrast" type="range" min="0" max="200" value="100">
      </div>

      <div class="panelRow">
         <label>Saturation</label>
         <input id="sat" type="range" min="0" max="200" value="100">
      </div>

      <div class="panelRow">
         <button id="resetFilters">Reset</button>
      </div>
    `;
    document.body.appendChild(modPanel);

    const musicPanel = document.createElement("div");
    musicPanel.className = "musicPanel";
    musicPanel.style.bottom = "80px";
    musicPanel.style.right = "20px";

    musicPanel.innerHTML = `
      <div class="panelHeader" id="musicDrag">Music Menu</div>

      <div style="margin-bottom:8px;">
         <input id="ytLink" placeholder="YouTube Link" style="width:100%; padding:4px;">
      </div>

      <button id="playYT">Play</button>
      <button id="stopYT">Stop</button>

      <div class="panelRow">
         <label>Volume</label>
         <input id="ytVol" type="range" min="0" max="100" value="100">
      </div>

      <div class="panelRow">
         <label>Speed</label>
         <input id="ytSpeed" type="range" min="50" max="200" value="100">
      </div>

      <div class="panelRow">
         <label>Reverb</label>
         <input id="ytReverb" type="checkbox">
      </div>

      <iframe id="ytFrame" style="width:100%; height:150px; display:none;" allow="autoplay"></iframe>
    `;
    document.body.appendChild(musicPanel);

    makeDraggable(modPanel, $("#modDrag"));
    makeDraggable(musicPanel, $("#musicDrag"));

    /* ---------------------------------------------------------
       PANEL TOGGLE
    --------------------------------------------------------- */

    let modOpen = false;
    let musicOpen = false;

    function toggle(panel, openVar) {
        if (!openVar) {
            panel.style.transform = "translateX(0)";
            panel.style.opacity = "1";
        } else {
            panel.style.transform = "translateX(120%)";
            panel.style.opacity = "0";
        }
    }

    window.addEventListener("keydown", e => {
        if (e.key === "p" || e.key === "P") {
            modOpen = !modOpen;
            toggle(modPanel, !modOpen);
        }
        if (e.key === "o" || e.key === "O") {
            musicOpen = !musicOpen;
            toggle(musicPanel, !musicOpen);
        }
    });

    /* ---------------------------------------------------------
       FILTERS
    --------------------------------------------------------- */

    const applyFilters = () => {
        const br = $("#bright").value;
        const ct = $("#contrast").value;
        const st = $("#sat").value;
        document.body.style.filter = `brightness(${br}%) contrast(${ct}%) saturate(${st}%)`;
    };

    ["bright","contrast","sat"].forEach(id => {
        $("#" + id).oninput = applyFilters;
    });

    $("#resetFilters").onclick = () => {
        $("#bright").value = 100;
        $("#contrast").value = 100;
        $("#sat").value = 100;
        applyFilters();
    };

    /* ---------------------------------------------------------
       YOUTUBE MUSIC
    --------------------------------------------------------- */

    const frame = $("#ytFrame");
    let player;

    function createPlayer(link) {
        frame.style.display = "block";
        const id = link.split("v=")[1]?.split("&")[0];
        frame.src = "https://www.youtube.com/embed/" + id + "?enablejsapi=1&autoplay=1";
    }

    $("#playYT").onclick = () => {
        const link = $("#ytLink").value.trim();
        if (link.includes("youtube.com")) {
            createPlayer(link);
        }
    };

    $("#stopYT").onclick = () => {
        frame.src = "";
        frame.style.display = "none";
    };

    /* ---------------------------------------------------------
       RAINBOW USERNAME (Client-Side Only)
    --------------------------------------------------------- */

    setInterval(() => {
        const names = document.querySelectorAll("*");
        names.forEach(n => {
            if (n.textContent === "khayrie") n.classList.add("rainbowName");
        });
    }, 1500);

})();