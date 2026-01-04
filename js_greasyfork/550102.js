// ==UserScript==
// @name         Gangsters - zapis historii kwot
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Szybki zapis wartości spod podanego XPATH. MutationObserver + fallback poller. Panel hakerski + kopiuj/pokaż/wyczyść.
// @author       mleko95
// @match        *://*.gangsters.pl/*
// @grant        GM_setClipboard
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/550102/Gangsters%20-%20zapis%20historii%20kwot.user.js
// @updateURL https://update.greasyfork.org/scripts/550102/Gangsters%20-%20zapis%20historii%20kwot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- KONFIGURACJA ----------
    const XPATH = "/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[3]/b[2]";
    const STORAGE_KEY = "gangsters_values_history";
    const POLL_INTERVAL_MS = 300; // fallback poll co 300ms (zredukowane z 800ms)
    const MUTATION_DEBOUNCE_MS = 60; // drobne opóźnienie żeby skumulować szybkie mutacje

    // ---------- funkcje pomocnicze ----------
    function readNodeByXPath(xpath) {
        try {
            const res = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return res.singleNodeValue || null;
        } catch (e) {
            console.error("XPath error:", e);
            return null;
        }
    }

    function cleanText(t) {
        if (!t) return "";
        return t.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function loadHistory() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Błąd parsowania historii:", e);
            return [];
        }
    }

    function saveHistory(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    function appendToHistory(valueText) {
        const hist = loadHistory();
        const entry = {
            value: valueText,
            timestamp: new Date().toISOString()
        };
        hist.push(entry);
        saveHistory(hist);
        console.log("Dodano do historii:", entry);
    }

    // ---------- UI (hakerski motyw) ----------
    function createButton(id, title, icon) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.title = title;
        btn.innerHTML = `<span class="g-icon">${icon}</span><span class="g-label">${title}</span>`;
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.gap = "8px";
        btn.style.minWidth = "140px";
        btn.style.maxWidth = "200px";
        btn.style.justifyContent = "flex-start";
        btn.style.padding = "8px 10px";
        btn.style.borderRadius = "8px";
        btn.style.border = "1px solid rgba(50,255,50,0.12)";
        btn.style.background = "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(10,10,10,0.95))";
        btn.style.color = "#B6FF9A";
        btn.style.fontFamily = "'Courier New', monospace";
        btn.style.fontSize = "13px";
        btn.style.overflow = "hidden";
        btn.style.textOverflow = "ellipsis";
        btn.style.whiteSpace = "nowrap";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 0 8px rgba(0,255,100,0.06)";
        btn.style.backdropFilter = "blur(2px)";
        btn.onmouseover = () => btn.style.transform = "translateY(-1px)";
        btn.onmouseout  = () => btn.style.transform = "none";
        return btn;
    }

    function addControlPanel() {
        if (document.getElementById("gangstersControlPanel")) return;

        const panel = document.createElement("div");
        panel.id = "gangstersControlPanel";
        panel.style.position = "fixed";
        panel.style.top = "12px";
        panel.style.right = "12px";
        panel.style.zIndex = "2147483647";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";
        panel.style.alignItems = "flex-end";
        panel.style.gap = "8px";
        panel.style.padding = "10px";
        panel.style.borderRadius = "10px";
        panel.style.background = "rgba(0,0,0,0.6)";
        panel.style.border = "1px solid rgba(0,255,100,0.07)";
        panel.style.boxShadow = "0 6px 18px rgba(0,0,0,0.6)";

        // tytuł mały "console" look
        const title = document.createElement("div");
        title.textContent = "console • vault";
        title.style.color = "#5CFF7A";
        title.style.fontFamily = "'Courier New', monospace";
        title.style.fontSize = "12px";
        title.style.letterSpacing = "0.6px";
        title.style.marginBottom = "4px";
        panel.appendChild(title);

        const copyBtn = createButton("copyLastGangsters", "Kopiuj ostatnią", "📋");
        const showBtn = createButton("showHistoryGangsters", "Pokaż historię", "📚");
        const clearBtn = createButton("clearHistoryGangsters", "Wyczyść pamięć", "🗑️");

        copyBtn.addEventListener("click", () => {
            const hist = loadHistory();
            const last = hist.length ? hist[hist.length - 1].value : null;
            const textToCopy = last || "Brak zapisanych wartości";
            try {
                GM_setClipboard(textToCopy);
                alert("[OK] Skopiowano: " + textToCopy);
            } catch (e) {
                navigator.clipboard?.writeText(textToCopy).then(()=>alert("[OK] Skopiowano: " + textToCopy)).catch(()=>alert("Nie udało się skopiować."));
            }
        });

        showBtn.addEventListener("click", () => {
            const hist = loadHistory();
            if (!hist.length) {
                alert("Brak zapisanych wartości.");
                return;
            }
            const lines = hist.map((e, i) => `${i+1}. ${e.value}  —  ${new Date(e.timestamp).toLocaleString()}`);
            const w = window.open('', '_blank', 'width=520,height=640,scrollbars=yes');
            if (w) {
                w.document.title = "Historia wartości";
                const pre = w.document.createElement("pre");
                pre.style.whiteSpace = "pre-wrap";
                pre.style.fontFamily = "monospace";
                pre.style.fontSize = "13px";
                pre.style.padding = "10px";
                pre.textContent = lines.join("\n");
                w.document.body.appendChild(pre);
            } else {
                alert(lines.join("\n\n"));
            }
        });

        clearBtn.addEventListener("click", () => {
            if (confirm("Na pewno wyczyścić całą pamięć zapisanych wartości?")) {
                localStorage.removeItem(STORAGE_KEY);
                alert("Pamięć wyczyszczona.");
            }
        });

        panel.appendChild(copyBtn);
        panel.appendChild(showBtn);
        panel.appendChild(clearBtn);

        // dodaj panel do body
        document.body.appendChild(panel);
    }

    // ---------- główna logika zapisu ----------
    let lastSavedValueInThisPage = null;
    addControlPanel();

    function checkAndSave() {
        const node = readNodeByXPath(XPATH);
        if (!node) return;
        const txt = cleanText(node.textContent);
        if (!txt) return;
        if (lastSavedValueInThisPage === null || lastSavedValueInThisPage !== txt) {
            appendToHistory(txt);
            lastSavedValueInThisPage = txt;
            // opcjonalne graficzne potwierdzenie: krótki flash panelu
            flashPanel();
        }
    }

    // drobna funkcja żeby pokazać że coś zapisano
    function flashPanel() {
        const p = document.getElementById("gangstersControlPanel");
        if (!p) return;
        p.style.boxShadow = "0 0 18px rgba(92,255,122,0.25)";
        setTimeout(()=>{ p.style.boxShadow = "0 6px 18px rgba(0,0,0,0.6)"; }, 450);
    }

    // ---------- MutationObserver (szybkie wykrywanie zmian) ----------
    let mutDebounceTimer = null;
    try {
        const observer = new MutationObserver((mutations) => {
            if (mutDebounceTimer) clearTimeout(mutDebounceTimer);
            mutDebounceTimer = setTimeout(() => {
                checkAndSave();
            }, MUTATION_DEBOUNCE_MS);
        });
        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } catch (e) {
        console.warn("MutationObserver nie zainicjowany:", e);
    }

    // ---------- Poller fallback ----------
    setInterval(() => {
        checkAndSave();
    }, POLL_INTERVAL_MS);

    // ---------- Koniec ----------
    console.log("Tampermonkey: monitor wartości uruchomiony (MutationObserver + poller).");
})();
