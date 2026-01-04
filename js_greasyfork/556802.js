// ==UserScript==
// @name         CKZiU T4 - Stały motyw + własne kolory + panel ⚙
// @namespace    https://greasyfork.org/pl/users/0
// @version      2.0
// @description  Naprawa motywów planu CKZiU, własne schematy, presety, stały panel ustawień, pełna kontrola kolorów i brak wyskakującego okienka ustawień.
// @match        https://ckziu25.sosnowiec.pl/plan/t4/*
// @icon         https://ckziu25.sosnowiec.pl/plan/t4/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556802/CKZiU%20T4%20-%20Sta%C5%82y%20motyw%20%2B%20w%C5%82asne%20kolory%20%2B%20panel%20%E2%9A%99.user.js
// @updateURL https://update.greasyfork.org/scripts/556802/CKZiU%20T4%20-%20Sta%C5%82y%20motyw%20%2B%20w%C5%82asne%20kolory%20%2B%20panel%20%E2%9A%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* --------------------------------------------------
       1. NIEZALEŻNY STYL PANELU + PRZYCISKU ⚙
       -------------------------------------------------- */
    const fixedStyle = document.createElement("style");
    fixedStyle.textContent = `
        .ckziu-panel, .ckziu-panel * {
            background: rgba(255, 255, 255, 0.95) !important;
            color: #111 !important;
            border-color: rgba(0,0,0,0.25) !important;
            font-family: Arial, sans-serif !important;
        }

        #ckziu-theme-panel {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 260px !important;
            padding: 14px !important;
            background: rgba(255,255,255,0.97) !important;
            border: 1px solid rgba(0,0,0,0.35) !important;
            border-radius: 14px !important;
            z-index: 99998 !important;
            box-shadow: 0 3px 12px rgba(0,0,0,0.25) !important;
        }

        #ckziu-theme-toggle {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 99999 !important;
            font-size: 20px !important;
            padding: 10px 14px !important;
            border-radius: 10px !important;
            border: 1px solid #555 !important;
            cursor: pointer !important;
            opacity: 0.85 !important;
            background: #fff !important;
            color: #000 !important;
        }

        #ckziu-theme-toggle:hover {
            background: #f2f2f2 !important;
        }
    `;
    document.head.appendChild(fixedStyle);


    /* --------------------------------------------------
       2. WYMUSZONE STYLOWANIE ELEMENTÓW PLANU
       -------------------------------------------------- */
    const forceStyle = document.createElement("style");
    forceStyle.textContent = `
        #tytulnapis, #tytulnapis *, .tytul, .tytul * {
            color: var(--tekst) !important;
        }

        th {
            color: var(--tekst) !important;
            background: var(--tlo) !important;
            border-color: var(--ramka) !important;
        }

        td.nr, td.nr * {
            color: var(--tekst) !important;
            background: var(--tlo) !important;
            border-color: var(--ramka) !important;
        }

        td {
            color: var(--tekst) !important;
            border-color: var(--ramka) !important;
        }

        .lesson, .l {
            color: var(--tekst) !important;
            border-color: var(--ramka) !important;
        }
    `;
    document.head.appendChild(forceStyle);


    /* --------------------------------------------------
       3. DOMYŚLNE PRESETY
       -------------------------------------------------- */

    const defaultPresets = {
        "Jasny":  { bg:"#ffffff", text:"#000000", border:"#888888" },
        "Ciemny": { bg:"#111111", text:"#ffffff", border:"#666666" },
        "Sepia":  { bg:"#f4ecd8", text:"#5a4632", border:"#c2b59b" },
        "Wysoki Kontrast": { bg:"#000000", text:"#ffff00", border:"#ffffff" }
    };

    function loadPresets() {
        return JSON.parse(localStorage.getItem("ckziu-presets") || "{}");
    }

    function savePresets(obj) {
        localStorage.setItem("ckziu-presets", JSON.stringify(obj));
    }

    let presets = loadPresets();
    presets = { ...defaultPresets, ...presets };
    savePresets(presets);


    /* --------------------------------------------------
       4. PANEL USTAWIEŃ
       -------------------------------------------------- */
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'ckziu-theme-panel';
        panel.classList.add('ckziu-panel');
        panel.style.display = "none";

        panel.innerHTML = `
            <h3 style="margin-top:0;">Ustawienia motywu</h3>

            <label>Tło planu:</label><br>
            <input type="color" id="bgColor"><br><br>

            <label>Kolor tekstu lekcji:</label><br>
            <input type="color" id="textColor"><br><br>

            <label>Kolor ramek:</label><br>
            <input type="color" id="borderColor"><br><br>

            <hr>

            <label>Schematy:</label><br>
            <select id="themeSchemes"></select><br><br>

            <input type="text" id="schemeName" placeholder="Nazwa schematu">
            <button id="saveScheme">Zapisz</button>
            <button id="loadScheme">Wczytaj</button>
            <button id="deleteScheme">Usuń</button>

            <br><br>
            <button id="resetTheme">Przywróć domyślne</button>
        `;

        document.body.appendChild(panel);
    }


    /* --------------------------------------------------
       5. PRZYCISK ⚙
       -------------------------------------------------- */
    function createToggleButton() {
        const btn = document.createElement("button");
        btn.id = "ckziu-theme-toggle";
        btn.classList.add("ckziu-panel");
        btn.textContent = "⚙";

        btn.onclick = () => {
            const panel = document.getElementById("ckziu-theme-panel");
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        };

        document.body.appendChild(btn);
    }


    /* --------------------------------------------------
       6. MOTYWY / ZAPIS / WCZYTYWANIE
       -------------------------------------------------- */
    function applyTheme() {
        const bg = localStorage.getItem("ckziu-bg") || "#ffffff";
        const text = localStorage.getItem("ckziu-text") || "#000000";
        const border = localStorage.getItem("ckziu-border") || "#cccccc";

        document.documentElement.style.setProperty("--tlo", bg);
        document.documentElement.style.setProperty("--tekst", text);
        document.documentElement.style.setProperty("--ramka", border);

        document.body.style.background = bg;
    }

    function initControls() {
        const bg = document.getElementById("bgColor");
        const tx = document.getElementById("textColor");
        const br = document.getElementById("borderColor");

        bg.value = localStorage.getItem("ckziu-bg") || "#ffffff";
        tx.value = localStorage.getItem("ckziu-text") || "#000000";
        br.value = localStorage.getItem("ckziu-border") || "#cccccc";

        bg.oninput = () => { localStorage.setItem("ckziu-bg", bg.value); applyTheme(); };
        tx.oninput = () => { localStorage.setItem("ckziu-text", tx.value); applyTheme(); };
        br.oninput = () => { localStorage.setItem("ckziu-border", br.value); applyTheme(); };

        // Załaduj listę presetów
        const sel = document.getElementById("themeSchemes");
        sel.innerHTML = "";
        Object.keys(presets).forEach(name => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = name;
            sel.appendChild(opt);
        });

        // ZAPIS PRESETU
        document.getElementById("saveScheme").onclick = () => {
            const name = document.getElementById("schemeName").value.trim();
            if (!name) return alert("Podaj nazwę schematu!");

            presets[name] = {
                bg: bg.value,
                text: tx.value,
                border: br.value
            };

            savePresets(presets);
            initControls();
            alert("Zapisano schemat.");
        };

        // WCZYTANIE PRESETU
        document.getElementById("loadScheme").onclick = () => {
            const name = sel.value;
            const p = presets[name];
            if (!p) return;

            bg.value = p.bg;
            tx.value = p.text;
            br.value = p.border;

            localStorage.setItem("ckziu-bg", p.bg);
            localStorage.setItem("ckziu-text", p.text);
            localStorage.setItem("ckziu-border", p.border);

            applyTheme();
        };

        // USUNIĘCIE PRESETU
        document.getElementById("deleteScheme").onclick = () => {
            const name = sel.value;
            if (defaultPresets[name]) return alert("Nie możesz usunąć wbudowanego presetu.");
            delete presets[name];
            savePresets(presets);
            initControls();
        };

        // RESET MOTYWU
        document.getElementById("resetTheme").onclick = () => {
            localStorage.removeItem("ckziu-bg");
            localStorage.removeItem("ckziu-text");
            localStorage.removeItem("ckziu-border");
            applyTheme();
            initControls();
        };
    }


    /* --------------------------------------------------
       7. START SKRYPTU
       -------------------------------------------------- */
    createPanel();
    createToggleButton();

    setTimeout(() => {
        applyTheme();
        initControls();
    }, 300);

})();
