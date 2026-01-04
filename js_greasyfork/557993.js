// ==UserScript==
// @name         Vollständiger Konfig-Snapshot (Manuell & Volle Doku)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Erfasst alle Konfig-Daten (Dropdowns, Felder, Checkboxen) und Kontext-Infotexte auf Knopfdruck.
// @author       Gemini
// @license MIT 
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/557993/Vollst%C3%A4ndiger%20Konfig-Snapshot%20%28Manuell%20%20Volle%20Doku%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557993/Vollst%C3%A4ndiger%20Konfig-Snapshot%20%28Manuell%20%20Volle%20Doku%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cachedOutput = "";
    let isReady = false;

    // --- 1. Buttons erstellen ---
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "99999";
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.flexDirection = "column";

    const snapshotBtn = createButton("💾 Snapshot erstellen", "#d9534f", "14px"); // Rot
    const copyBtn = createButton("📋 In Zwischenablage kopieren", "#777", "14px");   // Grau (Standard)

    container.appendChild(snapshotBtn);
    container.appendChild(copyBtn);
    document.body.appendChild(container);

    function createButton(text, bgColor, fontSize) {
        const btn = document.createElement("button");
        btn.innerHTML = text;
        btn.style.padding = "10px 15px";
        btn.style.backgroundColor = bgColor;
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
        btn.style.fontFamily = "Arial, sans-serif";
        btn.style.fontSize = fontSize;
        btn.style.fontWeight = "bold";
        return btn;
    }

    // --- 2. Haupt-Analyse Funktion (Jetzt manuell ausgelöst) ---
    function performAnalysis() {
        snapshotBtn.innerHTML = "⏳ Analysiere Daten...";
        snapshotBtn.style.backgroundColor = "#f0ad4e"; // Orange
        
        try {
            let output = "";
            const now = new Date();
            const timeString = now.toLocaleDateString('de-DE') + " " + now.toLocaleTimeString('de-DE');

            // --- Kopfdaten ---
            output += "=== SNAPSHOT INFO ===\n";
            output += "Fetch-Zeitpunkt: " + timeString + "\n"; 
            output += "URL: " + window.location.href + "\n";
            output += "Seitentitel: " + document.title + "\n\n";

            // --- NEU: KONTEXT/INFOTEXT-ANALYSE ---
            output += "=== KONTEXT/INFOTEXT-ANALYSE (BLAUE FELDER) ===\n";
            output += "(Erfasst wichtige Hilfetexte, Erklärungen und Warnungen)\n\n";
            
            const infoBlocks = document.querySelectorAll("blockquote.inline_help");
            if (infoBlocks.length > 0) {
                infoBlocks.forEach((block, index) => {
                    const text = block.innerText.trim();
                    if (text.length > 0) {
                        output += `--- Infotext #${index + 1} ---\n`;
                        output += text + "\n---\n";
                    }
                });
            } else {
                 output += "Keine Inline-Hilfetexte gefunden.\n";
            }
            output += "\n";
            
            // --- TEXT- UND PFAD-ANALYSE (INPUTS / TEXTAREAS) ---
            output += "=== TEXT- UND PFAD-ANALYSE (INPUTS / TEXTAREAS) ===\n";
            output += "(Erfasst Werte aus sichtbaren Textfeldern und kritischen Pfaden)\n\n";

            const inputElements = document.querySelectorAll("input:not([type='hidden']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']), textarea");
            
            inputElements.forEach(element => {
                const name = element.name || element.id || element.placeholder || element.title || "Unbenanntes Feld";
                let value = element.value.trim();
                
                if (value && value.length > 0 && value !== "Save" && value !== "Discard" && value !== "Abort" && value !== "Switch log" && value !== "Manual backup" && name.toLowerCase().indexOf('button') === -1) {
                    output += `[Feld: ${name}]\n`;
                    output += `Wert: ${value}\n---\n`;
                }
            });
            output += "\n";

            // --- CHECKBOX / RADIOBUTTON ANALYSE ---
            output += "=== CHECKBOX / RADIOBUTTON ANALYSE ===\n";
            output += "(Zeigt, welche Option angehakt [x] oder nicht [ ] ist - Dateibaum-Elemente sind gefiltert)\n\n";
            
            const checks = document.querySelectorAll("input[type='checkbox']:not(.fileTreeDiv input), input[type='radio']:not(.fileTreeDiv input)");
            
            if (checks.length > 0) {
                checks.forEach(check => {
                    if (check.closest('.fileTreeDiv')) return;

                    const name = check.name || check.id || check.title || "Unbenanntes Feld";
                    let label = '';
                    
                    const associatedLabel = document.querySelector(`label[for="${check.id}"]`);
                    if (associatedLabel) {
                        label = associatedLabel.innerText.trim();
                    } else {
                        const dtElement = check.closest('dd')?.previousElementSibling;
                        if (dtElement && dtElement.tagName === 'DT') {
                            label = dtElement.innerText.trim().replace(/:$/, ''); // Doppelpunkt am Ende entfernen
                        } else if (check.parentNode.innerText) {
                             label = check.parentNode.innerText.trim().split('\n')[0];
                        }
                    }
                    
                    const status = check.checked ? " [x] AKTIV" : " [ ] INAKTIV";
                    
                    output += `Status: ${status} | Name: ${name} | Label: ${label} | Wert: ${check.value}\n`;
                });
            } else {
                 output += "Keine relevanten Checkboxen oder Radiobuttons gefunden.\n";
            }

            output += "\n";
            
            // --- Dropdown Analyse ---
            output += "=== DROPDOWN / AUSWAHLFELDER ANALYSE ===\n";
            output += "(Zeigt den gewählten Wert UND alle versteckten Optionen)\n\n";

            const selects = document.querySelectorAll("select");
            if (selects.length === 0) {
                output += "Keine Dropdowns auf dieser Seite gefunden.\n";
            } else {
                selects.forEach((select, index) => {
                    let name = select.name || select.id || ("Dropdown Nr. " + (index + 1));
                    
                    output += `--- Dropdown: ${name} ---\n`;
                    
                    let selectedText = "Nichts gewählt";
                    if (select.selectedIndex >= 0 && select.options[select.selectedIndex]) {
                        selectedText = select.options[select.selectedIndex].text;
                    }
                    output += `[AKTUELL GEWÄHLT]: ${selectedText}\n`;

                    output += `[ALLE MÖGLICHEN OPTIONEN]:\n`;
                    for (let i = 0; i < select.options.length; i++) {
                        let opt = select.options[i];
                        let marker = (i === select.selectedIndex) ? " (x) " : " ( ) ";
                        output += `   ${marker} ${opt.text.trim()} [Wert: ${opt.value}]\n`;
                    }
                    output += "\n";
                });
            }

            output += "\n=== GESAMTER SICHTBARER TEXT (Restlicher Seiteninhalt) ===\n";
            output += document.body.innerText.replace(/\n\s*\n/g, '\n\n');

            // Speichern und Status setzen
            cachedOutput = output;
            isReady = true;

            // Feedback Buttons
            snapshotBtn.innerHTML = `✅ Snapshot erstellt (${timeString})`;
            snapshotBtn.style.backgroundColor = "#5cb85c"; // Grün
            copyBtn.innerHTML = "📋 In Zwischenablage kopieren";
            copyBtn.style.backgroundColor = "#d9534f"; // Rot (Bereit)

        } catch (e) {
            snapshotBtn.innerHTML = "❌ Fehler bei Analyse";
            snapshotBtn.style.backgroundColor = "#d9534f";
            console.error(e);
        }
    }

    // --- 3. Klick-Events ---
    
    // Snapshot-Button
    snapshotBtn.addEventListener("click", performAnalysis);

    // Copy-Button
    copyBtn.addEventListener("click", function() {
        if (!isReady) {
            alert("Bitte zuerst den 'Snapshot erstellen' Knopf drücken.");
            return;
        }

        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(cachedOutput);
        } else {
            navigator.clipboard.writeText(cachedOutput).catch(err => {
                alert("Fehler beim Kopieren: " + err);
            });
        }

        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "✅ Kopiert!";
        copyBtn.style.backgroundColor = "#5cb85c";

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.backgroundColor = "#d9534f"; // Zurück zu Rot
        }, 2000);
    });

})();