// ==UserScript==
// @name         Grand RP Fort Zancudo Logs
// @namespace    Grand RP Fort Zancudo Logs
// @version      3.1
// @description  Fort Zancudo log parser
// @author       Made with ❤️ by Tom Fresh
// @license      GNU General Public License v3.0
// @match        https://gta5grand.com/admin*
// @supportURL   https://greasyfork.org/de/scripts/548616-grand-rp-fort-zancudo-parser
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/548616/Grand%20RP%20Fort%20Zancudo%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/548616/Grand%20RP%20Fort%20Zancudo%20Logs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CURRENT_VERSION = "3.1";
    const UPDATE_CHECK_URL = "https://greasyfork.org/de/scripts/548616-grand-rp-fort-zancudo-parser";
    
    // Warten bis die Seite vollständig geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
    
    function initScript() {
        // Prüfen ob wir uns auf der richtigen Seite befinden
        if (!window.location.href.includes('gta5grand.com/admin')) return;
        
        // Update-Überprüfung bei jedem Seitenaufruf
        checkForUpdates();
        
        // Sidebar-Element zur Navigation hinzufügen
        addSidebarEntry();
        
        // CSS für das Popup
        addPopupStyles();
    }
    
    function checkForUpdates() {
        // Version auf Greasyfork überprüfen
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://greasyfork.org/de/scripts/548616-grand-rp-fort-zancudo-parser.json',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const latestVersion = data.version;
                    
                    if (latestVersion && compareVersions(latestVersion, CURRENT_VERSION) > 0) {
                        showUpdateNotification();
                    }
                } catch (e) {
                    console.log('Fort Zancudo: Fehler beim Überprüfen der Updates');
                }
            },
            onerror: function() {
                console.log('Fort Zancudo: Update-Überprüfung fehlgeschlagen');
            }
        });
    }
    
    function compareVersions(a, b) {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            
            if (aPart > bPart) return 1;
            if (aPart < bPart) return -1;
        }
        return 0;
    }
    
    function showUpdateNotification() {
        const navDrawer = document.querySelector('.nav.nav-drawer');
        if (!navDrawer) return;
        
        const updateItem = document.createElement('li');
        updateItem.className = 'nav-item';
        updateItem.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
        updateItem.style.borderLeft = '4px solid #ffc107';
        updateItem.innerHTML = `
            <a href="${UPDATE_CHECK_URL}" target="_blank" style="color: #ffc107 !important;">
                <i class="fa fa-exclamation-triangle"></i> Fort Zancudo Update verfügbar
            </a>
        `;
        
        // Update-Hinweis vor dem Fort Zancudo Eintrag einfügen
        const fortZancudoItem = document.getElementById('fort-zancudo-trigger')?.parentElement;
        if (fortZancudoItem) {
            navDrawer.insertBefore(updateItem, fortZancudoItem);
        } else {
            navDrawer.appendChild(updateItem);
        }
    }
    
    function addSidebarEntry() {
        // Sidebar Navigation finden
        const navDrawer = document.querySelector('.nav.nav-drawer');
        if (!navDrawer) return;
        
        // Neuen Sidebar-Eintrag erstellen
        const fortZancudoItem = document.createElement('li');
        fortZancudoItem.className = 'nav-item';
        fortZancudoItem.innerHTML = `
            <a href="#" id="fort-zancudo-trigger">
                <i class="fa fa-fighter-jet"></i> Fort Zancudo
            </a>
        `;
        
        // Element zur Sidebar hinzufügen (nach den bestehenden Einträgen)
        navDrawer.appendChild(fortZancudoItem);
        
        // Event Listener für den Klick
        document.getElementById('fort-zancudo-trigger').addEventListener('click', function(e) {
            e.preventDefault();
            createPopup();
        });
    }
    
    function addPopupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #fortZancudoPopup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--card, white);
                border: 2px solid var(--border, #333);
                border-radius: 8px;
                padding: 20px;
                z-index: 10000;
                width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                color: var(--text, #333);
            }
            
            #fortZancudoPopup h3 {
                margin-top: 0;
                color: var(--text, #333);
                border-bottom: 2px solid var(--border, #ccc);
                padding-bottom: 10px;
            }
            
            #fortZancudoPopup textarea {
                width: 100%;
                height: 200px;
                margin: 10px 0;
                padding: 8px;
                border: 1px solid var(--border, #ccc);
                border-radius: 4px;
                font-family: monospace;
                resize: vertical;
                background: var(--inp, white);
                color: var(--text, #333);
            }
            
            #fortZancudoPopup button {
                background: #007cba;
                color: white;
                border: none;
                padding: 10px 20px;
                margin: 5px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            #fortZancudoPopup button:hover {
                background: #005a87;
            }
            
            #fortZancudoPopup .close-btn {
                background: #dc3545;
                float: right;
                margin-top: -10px;
                margin-right: -10px;
                padding: 5px 10px;
            }
            
            #fortZancudoPopup .close-btn:hover {
                background: #a71e2a;
            }
            
            #csvOutput {
                background: var(--rowB, #f8f9fa);
                border: 1px solid var(--border, #dee2e6);
                border-radius: 4px;
                padding: 10px;
                font-family: monospace;
                max-height: 200px;
                overflow-y: auto;
                margin-top: 0px;
                color: var(--text, #333);
            }
            
            #popupOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            }
            
            .popup-info {
                background: var(--rowA, #e9ecef);
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 15px;
                font-size: 14px;
                color: var(--text, #666);
            }
        `;
        document.head.appendChild(style);
    }
    
    function createPopup() {
        // Prüfen ob Popup bereits existiert
        if (document.getElementById('fortZancudoPopup')) return;
        
        // Overlay erstellen
        const overlay = document.createElement('div');
        overlay.id = 'popupOverlay';
        
        // Popup erstellen
        const popup = document.createElement('div');
        popup.id = 'fortZancudoPopup';
        popup.innerHTML = `
            <button class="close-btn" id="closeBtn">×</button>
            <h3><i class="fa fa-fighter-jet"></i> Fort Zancudo - Gang War Parser</h3>
            
            <div class="popup-info">
                <strong>Anleitung:</strong> Wähle das Datum aus und füge die Gang War Chat Nachrichten ein. 
                Das Tool kombiniert Datum + Nachrichtenzeit und extrahiert die Angriffszeit (aus "Zeit:") für Google Docs.
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="dateInput" style="display: block; margin-bottom: 5px; font-weight: bold;">Datum:</label>
                <input type="date" id="dateInput" style="padding: 8px; border: 1px solid var(--border, #ccc); border-radius: 4px; background: var(--inp, white); color: var(--text, #333); width: 200px;">
            </div>
            
            <textarea id="inputText" placeholder="Beispiel:
[14:11]Gina Sweet**cute**: 
Wer greift an: Ballas Wer wird angegriffen: Army Zeit: 16:00 @DE 02 | Berater Kriminalität

[16:01]Buny Azteca | 51439: 
Wer greift an: MG13 Wer wird angegriffen: Army Zeit: 18:00Uhr @DE 02

Füge hier deinen Gang War Text ein..."></textarea>
            
            <div style="text-align: center;">
                <button id="parseBtn"><i class="fa fa-cogs"></i> Text parsen</button>
                <button id="copyBtn"><i class="fa fa-copy"></i> Für Google Docs kopieren</button>
                <button id="clearBtn"><i class="fa fa-trash"></i> Alles löschen</button>
            </div>
            
            <div id="statusMessage" style="margin: 10px 0; text-align: center;"></div>
            
            <div id="csvOutput"></div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
        
        // Event Listeners mit setTimeout verzögert hinzufügen
        setTimeout(() => {
            setupPopupEventListeners();
        }, 100);
        
        // Focus auf Textarea setzen
        setTimeout(() => {
            const textArea = document.getElementById('inputText');
            if (textArea) textArea.focus();
        }, 200);
    }
    
    function setupPopupEventListeners() {
        // Event-Propagation stoppen und robuste Event Listener
        const closeBtn = document.getElementById('closeBtn');
        const overlay = document.getElementById('popupOverlay');
        const parseBtn = document.getElementById('parseBtn');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                closeFortZancudoPopup();
            }, true);
        }
        
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    e.stopPropagation();
                    e.preventDefault();
                    closeFortZancudoPopup();
                }
            }, true);
        }
        
        if (parseBtn) {
            parseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                parseGangWarText();
            }, true);
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                copyForGoogleDocs();
            }, true);
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                clearAll();
            }, true);
        }
        
        // Zusätzlicher ESC-Key Handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('fortZancudoPopup')) {
                e.stopPropagation();
                e.preventDefault();
                closeFortZancudoPopup();
            }
        }, true);
    }
    
    function closeFortZancudoPopup() {
        const popup = document.getElementById('fortZancudoPopup');
        const overlay = document.getElementById('popupOverlay');
        if (popup) popup.remove();
        if (overlay) overlay.remove();
    }
    
    function parseGangWarText() {
        const inputText = document.getElementById('inputText').value;
        const dateInput = document.getElementById('dateInput').value;
        const outputDiv = document.getElementById('csvOutput');
        const statusDiv = document.getElementById('statusMessage');
        
        if (!inputText.trim()) {
            statusDiv.innerHTML = '<span style="color: #dc3545;">Bitte Text eingeben!</span>';
            outputDiv.innerHTML = '';
            return;
        }
        
        if (!dateInput) {
            statusDiv.innerHTML = '<span style="color: #dc3545;">Bitte Datum auswählen!</span>';
            outputDiv.innerHTML = '';
            return;
        }
        
        // Verwende die separate Parsing-Funktion
        const parsedEntries = performParsing(inputText, dateInput);
        
        if (parsedEntries.length > 0) {
            // Erfolgsmeldung direkt unter Buttons
            statusDiv.innerHTML = `<span style="color: #28a745;"><strong>✓ ${parsedEntries.length} Einträge erfolgreich geparst!</strong></span>`;
            
            // Nur die Tabelle im umrandeten Bereich
            let tableHTML = `
                <table style="border-collapse: collapse; width: 100%; font-size: 12px;">
                    <thead>
                        <tr style="background: var(--rowH, #f8f9fa);">
                            <th style="border: 1px solid var(--border, #dee2e6); padding: 8px;">Datum & Zeit</th>
                            <th style="border: 1px solid var(--border, #dee2e6); padding: 8px;">Angriffszeit</th>
                            <th style="border: 1px solid var(--border, #dee2e6); padding: 8px;">Name</th>
                            <th style="border: 1px solid var(--border, #dee2e6); padding: 8px;">Wer greift an</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            parsedEntries.forEach(entry => {
                tableHTML += `
                    <tr>
                        <td style="border: 1px solid var(--border, #dee2e6); padding: 8px;">${entry.datumzeit}</td>
                        <td style="border: 1px solid var(--border, #dee2e6); padding: 8px;">${entry.angriffszeit}</td>
                        <td style="border: 1px solid var(--border, #dee2e6); padding: 8px;">${entry.name}</td>
                        <td style="border: 1px solid var(--border, #dee2e6); padding: 8px;">${entry.angreifer}</td>
                    </tr>
                `;
            });
            
            tableHTML += '</tbody></table>';
            outputDiv.innerHTML = tableHTML;
        } else {
            statusDiv.innerHTML = '<span style="color: #ffc107;">⚠ Keine gültigen Einträge gefunden. Prüfe das Format!</span>';
            outputDiv.innerHTML = '';
        }
        
        // Daten global speichern
        window.parsedData = parsedEntries;
    }
    
    function copyForGoogleDocs() {
        const inputText = document.getElementById('inputText').value;
        const dateInput = document.getElementById('dateInput').value;
        
        // Automatisches Parsing falls noch nicht geparst oder Daten haben sich geändert
        if (!window.parsedData || window.parsedData.length === 0 || 
            !inputText.trim() || !dateInput) {
            
            if (!inputText.trim()) {
                alert('Bitte Text eingeben!');
                return;
            }
            
            if (!dateInput) {
                alert('Bitte Datum auswählen!');
                return;
            }
            
            // Automatisch parsen vor dem Kopieren
            const parsedData = performParsing(inputText, dateInput);
            if (!parsedData || parsedData.length === 0) {
                alert('Keine gültigen Einträge zum Kopieren gefunden!');
                return;
            }
            window.parsedData = parsedData;
        }
        
        // Tabellendaten für Google Docs formatieren (Tab-getrennt) - OHNE Header
        let googleDocsContent = "";
        
        window.parsedData.forEach(entry => {
            googleDocsContent += `${entry.datumzeit}\t${entry.angriffszeit}\t${entry.name}\t${entry.angreifer}\n`;
        });
        
        navigator.clipboard.writeText(googleDocsContent).then(function() {
            // Feedback in Status-Bereich anzeigen
            const statusDiv = document.getElementById('statusMessage');
            const originalContent = statusDiv.innerHTML;
            statusDiv.innerHTML = '<span style="color: #28a745;"><strong>✓ Tabelle erfolgreich kopiert! Füge sie in Google Docs ein (Strg+V)</strong></span>';
            
            setTimeout(() => {
                statusDiv.innerHTML = originalContent;
            }, 3000);
        }).catch(function() {
            alert('Fehler beim Kopieren. Versuche es manuell zu markieren und zu kopieren.');
        });
    }
    
    // Separate Parsing-Funktion für Wiederverwendung
    function performParsing(inputText, dateInput) {
        // Text bereinigen und normalisieren
        let cleanedText = inputText.replace(/(\d{1,2}:\d{2})\]/g, '[$1]'); // Fehlende [ ergänzen
        
        // Primäres Splitting nach Zeit-Pattern
        let blocks = cleanedText.split(/(?=\[?\d{1,2}:\d{2}\])/);
        
        // Fallback: Wenn wenige Blöcke gefunden wurden, zusätzlich nach "Wer greift an:" splitten
        if (blocks.length <= 2) {
            const fallbackBlocks = [];
            for (let block of blocks) {
                const subBlocks = block.split(/(?=Wer greift an:)/);
                if (subBlocks.length > 1) {
                    fallbackBlocks.push(subBlocks[0]);
                    for (let i = 1; i < subBlocks.length; i++) {
                        fallbackBlocks.push(subBlocks[i]);
                    }
                } else {
                    fallbackBlocks.push(block);
                }
            }
            blocks = fallbackBlocks;
        }
        
        const parsedEntries = [];
        
        for (let block of blocks) {
            block = block.trim();
            if (!block) continue;
            
            // Zeit extrahieren - flexibleres Pattern
            const timeMatch = block.match(/\[?(\d{1,2}:\d{2})\]?/);
            if (!timeMatch) continue;
            
            // Name extrahieren - nach ] oder Zeit bis zur nächsten Zeile oder :
            let nameMatch = block.match(/\]([^\n:]+?)(?:\n|:)/);
            if (!nameMatch) {
                nameMatch = block.match(/\d{1,2}:\d{2}\]?([^\n:]+?)(?:\n|:)/);
            }
            if (!nameMatch) continue;
            
            // "Wer greift an" extrahieren
            const attackerMatch = block.match(/Wer greift an:\s*([^\n]+)/);
            if (!attackerMatch) continue;
            
            // Angriffszeit extrahieren aus "Zeit: XX:XX"
            const attackTimeMatch = block.match(/Zeit:\s*(\d{1,2}:\d{2})/);
            
            const time = timeMatch[1];
            let name = nameMatch[1].trim();
            let attacker = attackerMatch[1].trim();
            let attackTime = attackTimeMatch ? attackTimeMatch[1] : '';
            
            // Zeiten direkt ohne Konvertierung im 24h-Format belassen
            let formattedMessageTime = time;
            let formattedAttackTime = attackTime;
            
            // Sicherstellen, dass beide Zeiten korrekt formatiert sind (mit führenden Nullen)
            if (time.match(/^\d{1,2}:\d{2}$/)) {
                const [hours, minutes] = time.split(':');
                // Direkte String-Formatierung ohne Date-Objekt
                formattedMessageTime = hours.padStart(2, '0') + ':' + minutes.padStart(2, '0');
            }
            
            if (attackTime && attackTime.match(/^\d{1,2}:\d{2}$/)) {
                const [hours, minutes] = attackTime.split(':');
                // Direkte String-Formatierung ohne Date-Objekt
                formattedAttackTime = hours.padStart(2, '0') + ':' + minutes.padStart(2, '0');
            }
            
            // Bereinigung der Daten
            name = name.replace(/\s+/g, ' ');
            name = name.replace(/\[.*?\]/g, '').replace(/\b(PEPE|GRND|cute)\b/g, '').trim();
            name = name.replace(/\s+/g, ' ');
            attacker = attacker.replace(/\s+/g, ' ');
            
            // Nur hinzufügen wenn alle Daten vorhanden
            if (formattedMessageTime && name && attacker) {
                // Datum manuell parsen um 24h-Format zu gewährleisten
                const dateParts = dateInput.split('-'); // YYYY-MM-DD
                const formattedDate = dateParts[2] + '.' + dateParts[1] + '.' + dateParts[0]; // DD.MM.YYYY
                
                // Datum und Nachrichtenzeit kombinieren
                const combinedDateTime = `${formattedDate} ${formattedMessageTime}`;
                
                parsedEntries.push({
                    datumzeit: combinedDateTime,
                    angriffszeit: formattedAttackTime || 'N/A',
                    name: name,
                    angreifer: attacker
                });
            }
        }
        
        return parsedEntries;
    }
    
    function clearAll() {
        document.getElementById('inputText').value = '';
        document.getElementById('dateInput').value = '';
        document.getElementById('csvOutput').innerHTML = '';
        document.getElementById('statusMessage').innerHTML = '';
        window.parsedData = null;
    }
    
})();