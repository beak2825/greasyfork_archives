// ==UserScript==
// @name          Gemini_Userscript_Refactor-Helper
// @namespace     http://tampermonkey.net/
// @version       3.0
// @description   Kombiniert Clean-HTML Export mit einem Profi-Element-Picker (Blockiert Links, findet ähnliche Elemente).
// @author        Dein Vibe Coding Partner
// @match         *://*/*
// @license MIT 
// @run-at        document-end
// @grant         GM_addStyle
// @grant         GM_setClipboard
// @grant         unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/556293/Gemini_Userscript_Refactor-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556293/Gemini_Userscript_Refactor-Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Globale Variablen für den Picker
    let isPicking = false;
    let selectedElements = new Set(); // Speichert die tatsächlich geklickten Elemente

    // #############################################################################
    // # TEIL 1: CLEAN HTML GENERATOR (Das Futter für die KI)
    // #############################################################################

    function getCleanHTML() {
        const clone = document.documentElement.cloneNode(true);

        // Müll entfernen
        const tagsToRemove = ['script', 'style', 'noscript', 'iframe', 'svg', 'meta', 'link', 'path', 'symbol', 'img', 'video', 'picture', 'source', 'canvas', 'div[id^="ad-"]'];
        tagsToRemove.forEach(tag => {
            clone.querySelectorAll(tag).forEach(el => el.remove());
        });

        // Kommentare entfernen
        const removeComments = (node) => {
            const children = node.childNodes;
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                if (child.nodeType === 8) node.removeChild(child);
                else if (child.nodeType === 1) removeComments(child);
            }
        };
        removeComments(clone);

        // Attribute putzen & Text zu "K"
        const allowedAttrs = ['id', 'class', 'name', 'role', 'type', 'data-test', 'href', 'value'];
        clone.querySelectorAll('*').forEach(el => {
            [...el.attributes].forEach(attr => {
                if (!allowedAttrs.includes(attr.name)) el.removeAttribute(attr.name);
            });
            // Text durch K ersetzen (Skelett-Modus)
            el.childNodes.forEach(node => {
                if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
                    node.nodeValue = 'K';
                }
            });
        });

        let htmlString = clone.outerHTML.replace(/^\s*[\r\n]/gm, '');
        return `\n${htmlString}\n`;
    }

    function downloadCleanHTML() {
        const htmlContent = getCleanHTML();
        const filename = `${window.location.hostname.replace(/[^a-z0-9]/gi, '_')}_clean.html`;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showFeedback(`Datei '${filename}' heruntergeladen!`);
    }

    // #############################################################################
    // # TEIL 2: INTELLIGENTER ELEMENT PICKER
    // #############################################################################

    function togglePicker() {
        isPicking = !isPicking;
        const btn = document.getElementById('gemini-pick-btn');
        const body = document.body;

        if (isPicking) {
            btn.textContent = '✅ Fertig & Kopieren';
            btn.style.background = '#ff6b6b'; // Rot zum Stoppen
            
            // Event Listener HINZUFÜGEN (Capture Phase um Links zu blockieren!)
            document.addEventListener('mouseover', onHover, true);
            document.addEventListener('mouseout', onHoverOut, true);
            document.addEventListener('click', onClick, true);
            
            showFeedback("Pick-Modus AKTIV. Links sind deaktiviert.");
        } else {
            // Beenden und Report erstellen
            finishPicking();
            
            btn.textContent = '🎯 Element Picken';
            btn.style.background = '#77dd77'; // Grün zum Starten
            
            // Event Listener ENTFERNEN
            document.removeEventListener('mouseover', onHover, true);
            document.removeEventListener('mouseout', onHoverOut, true);
            document.removeEventListener('click', onClick, true);
            
            // Aufräumen
            document.querySelectorAll('.gemini-selected, .gemini-similar, .gemini-hover').forEach(el => {
                el.classList.remove('gemini-selected', 'gemini-similar', 'gemini-hover');
            });
            selectedElements.clear();
        }
    }

    function onHover(e) {
        if (!isPicking || e.target.closest('#gemini-panel')) return;
        e.stopPropagation();
        e.target.classList.add('gemini-hover');
    }

    function onHoverOut(e) {
        if (!isPicking) return;
        e.target.classList.remove('gemini-hover');
    }

    function onClick(e) {
        if (!isPicking || e.target.closest('#gemini-panel')) return;
        
        // KILLT ALLE KLICKS AUF DER SEITE (Links, Buttons, etc.)
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const el = e.target;

        // Toggle Auswahl
        if (selectedElements.has(el)) {
            el.classList.remove('gemini-selected');
            selectedElements.delete(el);
            // Ähnliche entfernen (einfachheitshalber alle ähnlichen resetten und neu berechnen)
            document.querySelectorAll('.gemini-similar').forEach(sim => sim.classList.remove('gemini-similar'));
        } else {
            el.classList.add('gemini-selected');
            selectedElements.add(el);
            highlightSimilar(el);
        }
    }

    // Findet Elemente, die genauso aussehen (gleiche Klassen)
    function highlightSimilar(el) {
        if (!el.className) return; // Ohne Klassen zu riskant
        
        // Wir bauen einen Selektor aus dem Tag und den Klassen
        const classes = Array.from(el.classList)
            .filter(c => !c.startsWith('gemini-')) // Unsere eigenen Klassen ignorieren
            .join('.');
            
        if (!classes) return;

        const selector = `${el.tagName.toLowerCase()}.${classes}`;
        
        // Alle finden
        try {
            const similar = document.querySelectorAll(selector);
            similar.forEach(sim => {
                if (sim !== el && !selectedElements.has(sim)) {
                    sim.classList.add('gemini-similar');
                }
            });
            showFeedback(`${similar.length} ähnliche Elemente gefunden!`);
        } catch (err) {
            // Manchmal sind Klassen ungültige Selektoren (z.B. mit Doppelpunkt), ignorieren wir.
        }
    }

    function finishPicking() {
        if (selectedElements.size === 0) {
            showFeedback("Nichts ausgewählt.");
            return;
        }

        let report = "### GEMINI ELEMENT REPORT ###\n\n";

        selectedElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            
            // Versuchen, einen eindeutigen Selektor zu bauen
            let selector = el.tagName.toLowerCase();
            if (el.id) selector += `#${el.id}`;
            if (el.className) {
                 const cleanClasses = Array.from(el.classList)
                    .filter(c => !c.startsWith('gemini-'))
                    .join('.');
                 if (cleanClasses) selector += `.${cleanClasses}`;
            }

            report += `ITEM: ${selector}\n`;
            report += `--------------------------------------------------\n`;
            report += `INNER TEXT: "${el.innerText.substring(0, 50)}..."\n`;
            report += `HTML (Outer): \n${el.outerHTML.replace(/gemini-[a-z]+\s?/g, '')}\n`; // Unsere Klassen aus HTML entfernen
            report += `COMPUTED STYLES:\n`;
            report += `- Display: ${styles.display}\n`;
            report += `- Color: ${styles.color}\n`;
            report += `- Background: ${styles.backgroundColor}\n`;
            report += `- Font: ${styles.fontSize} ${styles.fontFamily}\n`;
            report += `- Padding/Margin: ${styles.padding} / ${styles.margin}\n`;
            report += `\n\n`;
        });

        GM_setClipboard(report);
        showFeedback(`${selectedElements.size} Elemente kopiert!`);
    }

    // #############################################################################
    // # UI & CSS
    // #############################################################################

    function showFeedback(text) {
        const fb = document.getElementById('gemini-feedback');
        fb.innerText = text;
        fb.classList.add('visible');
        setTimeout(() => fb.classList.remove('visible'), 3000);
    }

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'gemini-panel';
        
        const btnClean = document.createElement('button');
        btnClean.innerHTML = '💀 <b>Clean HTML</b> (Skelett)';
        btnClean.onclick = downloadCleanHTML;
        
        const btnPick = document.createElement('button');
        btnPick.id = 'gemini-pick-btn';
        btnPick.innerHTML = '🎯 <b>Element Picken</b>';
        btnPick.onclick = togglePicker;

        const feedback = document.createElement('div');
        feedback.id = 'gemini-feedback';

        panel.appendChild(btnClean);
        panel.appendChild(btnPick);
        document.body.appendChild(panel);
        document.body.appendChild(feedback);
    }

    GM_addStyle(`
        /* GUI Styles */
        #gemini-panel {
            position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
            display: flex; gap: 10px; background: #222; padding: 10px;
            border-radius: 50px; box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            border: 1px solid #444;
        }
        #gemini-panel button {
            background: #444; color: white; border: none; padding: 10px 20px;
            border-radius: 30px; cursor: pointer; font-family: sans-serif; font-size: 14px;
            transition: all 0.2s;
        }
        #gemini-panel button:hover { transform: scale(1.05); filter: brightness(1.2); }
        
        #gemini-feedback {
            position: fixed; bottom: 80px; right: 20px; z-index: 2147483647;
            background: #333; color: #fff; padding: 10px 20px; border-radius: 5px;
            font-family: sans-serif; opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        #gemini-feedback.visible { opacity: 1; }

        /* HIGHLIGHT STYLES */
        .gemini-hover {
            outline: 2px dashed #ff00ff !important;
            cursor: crosshair !important;
        }
        .gemini-selected {
            outline: 3px solid #0044ff !important; /* Dunkelblau für das Gewählte */
            background-color: rgba(0, 68, 255, 0.2) !important;
            box-shadow: 0 0 10px rgba(0, 68, 255, 0.5) !important;
        }
        .gemini-similar {
            outline: 2px dotted #00ccff !important; /* Hellblau für ähnliche */
            background-color: rgba(0, 204, 255, 0.1) !important;
        }
    `);

    createUI();

})();