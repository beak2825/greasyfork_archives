// ==UserScript==
// @name         Smartschool premium
// @namespace    http://tampermonkey.net/
// @icon         https://static1.smart-school.net/smsc/svg/favicon/favicon.svg
// @version      1.1
// @description  Vervang lokaal je naam en profielfoto in Smartschool
// @author       Kian
// @match        https://*.smartschool.be/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549179/Smartschool%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/549179/Smartschool%20premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Pas hier je naam en profielfoto aan ---
    const NIEUWE_NAAM = "Peter Griffin";
    const NIEUWE_FOTO = "data:image/jpeg;base64,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"; // vervang door jouw directe foto-URL

    // Wacht tot de pagina geladen is
    window.addEventListener("load", () => {
        // Naam aanpassen
        let nameElement = document.querySelector(".hlp-vert-box span");
        if (nameElement) {
            nameElement.textContent = NIEUWE_NAAM;
        }

        // Profielfoto aanpassen
        let imgElement = document.querySelector("img[alt='Profiel afbeelding']");
        if (imgElement) {
            imgElement.src = NIEUWE_FOTO;
        }
    });
    document.body.style.backgroundImage = "url('https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTievu0g9HlJr8u204YcG733NPtDEcIRtMPlK8bgCGXioOt3SMIA7PXc19GUCYbZx_B55bPDgju1iugYhSrP6ORxQZkOt1ONlaIEXrONt6T')";
document.body.style.backgroundSize = "cover";
    document.title = "Smartschool Premium";

    document.body.style.fontFamily = "Comic Sans MS, cursive, sans-serif";

let bar = document.createElement("div");
bar.innerHTML = `
  <a href="/planner/main/user/" style="margin:0 10px">Planner</a>
  <a href="/results/main/results/details/">Resultaten</a>
  <a href="https://app.lernova.be/nl-be/boekentas">Lernova</a>
  <a href="https://apps.plantyn.com/my/nl-be/bookshelf?redirectPath=%2F&redirectPlatform=sep">Scoodle</a>
  <a href="https://www.pelckmansportaal.be/dashboard">Pelckmans Portaal</a>
  <a href="https://platform.ididdit.be/">iDiddit</a>
`;
bar.style.cssText = "background:#222;color:#fff;padding:10px;text-align:center;";
document.body.prepend(bar);

    // selecteer de bovenste navigatiebalk
const topbar = document.querySelector(".topnav");
if (topbar) {
  topbar.style.backgroundColor = "yellow"; // kleur aanpassen
  topbar.style.borderBottom = "2px solid #c90001"; // optioneel: rood randje voor accent
}

// eventueel de tekstkleur aanpassen zodat het goed zichtbaar is
const topbarTexts = topbar.querySelectorAll(".topnav__btn, .topnav__menuitem");
topbarTexts.forEach(el => el.style.color = "black");

    // ==UserScript==
// @name         Matrix Regen Toggle
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let matrixActive = false;
    let canvas, ctx, interval;
    let drops = [];
    const fontSize = 16;

    // normale achtergrondkleur onthouden
    const normalBackground = document.body.style.backgroundColor || "#fff";

    function startMatrix() {
        // canvas maken
        canvas = document.createElement("canvas");
        canvas.id = "matrixCanvas";
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = "0";
        canvas.style.pointerEvents = "none"; // zodat je nog steeds kunt klikken
        document.body.appendChild(canvas);

        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const columns = Math.floor(canvas.width / fontSize);
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        interval = setInterval(drawMatrix, 50);

        window.addEventListener("resize", resizeCanvas);
    }

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // lichte fade
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0"; // groen
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(Math.floor(Math.random() * 128));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function stopMatrix() {
        clearInterval(interval);
        window.removeEventListener("resize", resizeCanvas);
        if (canvas) {
            canvas.remove();
        }
        document.body.style.backgroundColor = normalBackground;
    }

    // toggle bij Ctrl + Y
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === "y") {
            matrixActive = !matrixActive;
            if (matrixActive) {
                startMatrix();
            } else {
                stopMatrix();
            }
        }
    });

})();

    // Maak het cirkeltje
    const cursorCircle = document.createElement('div');
    cursorCircle.id = 'cursor-circle';
    document.body.appendChild(cursorCircle);

    // Voeg CSS toe
    const style = document.createElement('style');
    style.textContent = `
        #cursor-circle {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid lightblue;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            transition: transform 0.05s linear;
        }
    `;
    document.head.appendChild(style);

    // Laat het cirkeltje de cursor volgen
    document.addEventListener('mousemove', (e) => {
        cursorCircle.style.left = e.clientX + 'px';
        cursorCircle.style.top = e.clientY + 'px';
    });

    (function() {
    'use strict';

    // ---- Playground venster ----
    let box = document.createElement("div");
    box.style.cssText = `
        position:fixed; top:50px; right:20px; width:700px; height:650px;
        background:#222; color:#fff; z-index:99999; display:flex; flex-direction:column;
        border-radius:10px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.5);
        font-family:monospace;
    `;
    box.style.display = "none"; // start onzichtbaar
    document.body.appendChild(box);

    // Tabs
    let tabBar = document.createElement("div");
    tabBar.style.cssText = "display:flex;background:#111;";
    box.appendChild(tabBar);

    let tabs = ["HTML","CSS","JS"];
    let editors = {};
    let activeTab = "HTML";

    tabs.forEach(tab => {
        let btn = document.createElement("button");
        btn.textContent = tab;
        btn.style.cssText = "flex:1;padding:8px;border:none;background:#333;color:#fff;cursor:pointer;";
        btn.onclick = () => switchTab(tab);
        tabBar.appendChild(btn);

        let textarea = document.createElement("textarea");
        textarea.style.cssText = "flex:1;display:none;background:#000;color:#0f0;font-size:14px;padding:5px;";
        textarea.value = "";
        editors[tab] = textarea;
        box.appendChild(textarea);
    });

    // Buttons bar
    let btnBar = document.createElement("div");
    btnBar.style.cssText = "background:#111;padding:5px;text-align:right;display:flex;gap:5px;";
    box.insertBefore(btnBar, box.lastChild);

    let runBtn = document.createElement("button");
    runBtn.textContent = "▶ Run";
    runBtn.style.cssText = "padding:5px 10px;background:#28a745;color:#fff;border:none;cursor:pointer;";
    runBtn.onclick = runCode;
    btnBar.appendChild(runBtn);

    // Save buttons
    let saveHTML = document.createElement("button");
    saveHTML.textContent = "💾 Save HTML";
    saveHTML.onclick = () => downloadFile("index.html", editors["HTML"].value);
    btnBar.appendChild(saveHTML);

    let saveCSS = document.createElement("button");
    saveCSS.textContent = "💾 Save CSS";
    saveCSS.onclick = () => downloadFile("style.css", editors["CSS"].value);
    btnBar.appendChild(saveCSS);

    let saveJS = document.createElement("button");
    saveJS.textContent = "💾 Save JS";
    saveJS.onclick = () => downloadFile("script.js", editors["JS"].value);
    btnBar.appendChild(saveJS);

    // Output frame
    let output = document.createElement("iframe");
    output.style.cssText = "flex:1;background:#fff;border:none;";
    box.appendChild(output);

    // Functies
    function switchTab(tab) {
        activeTab = tab;
        tabs.forEach(t => editors[t].style.display = (t === tab) ? "block" : "none");
    }

    function runCode() {
        let html = editors["HTML"].value;
        let css = `<style>${editors["CSS"].value}</style>`;
        let js = `<script>${editors["JS"].value}<\/script>`;
        output.srcdoc = html + css + js;
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    switchTab("HTML"); // start met HTML open

    // ---- Knop in de linkerbalk ----
    function addSidebarButton() {
        let targetBlock = document.querySelector("#homepage__block--28881 .homepage__block__content"); // lokaalwissels
        if (!targetBlock) return;

        let newBtn = document.createElement("button");
        newBtn.textContent = "🌐 Open Website Maker";
        newBtn.style.cssText = `
            display:block;width:90%;margin:10px auto;padding:10px;
            background:#007bff;color:#fff;border:none;border-radius:6px;
            cursor:pointer;font-weight:bold;
        `;
        newBtn.onclick = () => {
            box.style.display = (box.style.display === "none") ? "flex" : "none";
        };

        targetBlock.appendChild(newBtn);
    }

    // Wacht tot de pagina geladen is
    window.addEventListener("load", addSidebarButton);

})();
})();

(function() {
    'use strict';

    window.addEventListener('load', function() {

        // ---- iframe maken ----
        const iframe = document.createElement('iframe');
        iframe.src = "https://smartschool-ai.netlify.app/";
        iframe.style.position = "fixed";
        iframe.style.bottom = "40px"; // iets hoger zodat de knop eronder blijft
        iframe.style.right = "20px";
        iframe.style.width = "400px";
        iframe.style.height = "600px";
        iframe.style.border = "none";
        iframe.style.borderRadius = "12px";
        iframe.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
        iframe.style.zIndex = "99998"; // lager dan knop
        iframe.style.background = "white";
        iframe.style.display = "none"; // standaard verborgen
        document.body.appendChild(iframe);

        // ---- toggle-knop maken ----
        const btn = document.createElement('button');
        btn.textContent = "AI Assistent";
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "99999"; // boven iframe
        btn.style.padding = "10px 15px";
        btn.style.borderRadius = "8px";
        btn.style.border = "none";
        btn.style.background = "#4CAF50";
        btn.style.color = "white";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

        document.body.appendChild(btn);

        // ---- toggle functionaliteit ----
        let visible = false;
        btn.addEventListener('click', () => {
            visible = !visible;
            iframe.style.display = visible ? "block" : "none";
            btn.textContent = visible ? "Sluit Assistent ❌" : "AI Assistent";
        });

        console.log("🤖 Smartschool AI Assistent geladen met single toggle knop!");
    });
})();