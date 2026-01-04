// ==UserScript==
// @name         [LSS] Erweiterungs-Manager (Optimiert)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Listet Wachen auf, bei denen Erweiterungen fehlen und ermöglicht das Hinzufügen dieser Erweiterungen mit parallelen Anfragen.
// @author       Caddy21 / Überarbeitet von Gemini
// @match        https://www.leitstellenspiel.de/
// @grant        GM_xmlhttpRequest
// @connect      api.lss-manager.de
// @connect      leitstellenspiel.de
// @icon         https://github.com/Caddy21/-docs-assets-css/raw/main/yoshi_icon__by_josecapes_dgqbro3-fullview.png
// @run-at       document-end
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/552237/%5BLSS%5D%20Erweiterungs-Manager%20%28Optimiert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552237/%5BLSS%5D%20Erweiterungs-Manager%20%28Optimiert%29.meta.js
// ==/UserScript==

// To-Do
// Lagererweiterungen einbauen
// manualExtensions verbessern um etliches Ausklammern zu verhindern und dem User weniger Arbeit zu machen
// Suche verbessern

(function() {
    'use strict';
    // Manuelle Konfiguration der Erweiterungen

    // Hier könnt Ihr auswählen welche Erweiterung in der Tabelle angezeigt werden soll, dafür die nicht benötigten einfach mit // ausklammern.
    const manualExtensions = {
        '0_normal': [ // Feuerwache (normal)
            { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 },
            { id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 3, name: '3te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 4, name: '4te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 5, name: '5te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },
            { id: 7, name: '6te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            { id: 9, name: 'Großwache', cost: 1000000, coins: 50 },
            { id: 10, name: '7te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 11, name: '8te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 12, name: '9te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 15, name: 'Netzersatzanlage 200', cost: 100000, coins: 20 },
            { id: 16, name: 'Großlüfter', cost: 75000, coins: 15 },
            { id: 17, name: '10te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 22, name: '3te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 23, name: '4te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 24, name: '5te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },
            { id: 26, name: '11te Ab-Stellplatz', cost: 150000, coins: 20 },
            { id: 27, name: '12te Ab-Stellplatz', cost: 150000, coins: 20 },
        ],

        '1_normal': [ // Feuerwehrschule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '2_normal': [ // Rettungswache
            { id: 0, name: 'Großwache', cost: 1000000, coins: 50 },
        ],

        '3_normal': [ // Rettungsschule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '4_normal': [ // Krankenhaus
            { id: 0, name: 'Allgemeine Innere', cost: 10000, coins: 10 },
            { id: 1, name: 'Allgemeine Chirugie', cost: 10000, coins: 10 },
            { id: 2, name: 'Gynäkologie', cost: 70000, coins: 15 },
            { id: 3, name: 'Urologie', cost: 70000, coins: 15 },
            { id: 4, name: 'Unfallchirugie', cost: 70000, coins: 15 },
            { id: 5, name: 'Neurologie', cost: 70000, coins: 15 },
            { id: 6, name: 'Neurochirugie', cost: 70000, coins: 15 },
            { id: 7, name: 'Kardiologie', cost: 70000, coins: 15 },
            { id: 8, name: 'Kardiochirugie', cost: 70000, coins: 15 },
            { id: 9, name: 'Großkrankenhaus', cost: 200000, coins: 50 },
        ],

        '5_normal': [ // Rettungshubschrauber-Station
            { id: 0, name: 'Windenrettung', cost: 200000, coins: 15 },
        ],

        '6_normal': [ // Polizeiwache
            { id: 0, name: '1te Zelle', cost: 25000, coins: 5 },
            { id: 1, name: '2te Zelle', cost: 25000, coins: 5 },
            { id: 2, name: '3te Zelle', cost: 25000, coins: 5 },
            { id: 3, name: '4te Zelle', cost: 25000, coins: 5 },
            { id: 4, name: '5te Zelle', cost: 25000, coins: 5 },
            { id: 5, name: '6te Zelle', cost: 25000, coins: 5 },
            { id: 6, name: '7te Zelle', cost: 25000, coins: 5 },
            { id: 7, name: '8te Zelle', cost: 25000, coins: 5 },
            { id: 8, name: '9te Zelle', cost: 25000, coins: 5 },
            { id: 9, name: '10te Zelle', cost: 25000, coins: 5 },
            { id: 10, name: 'Diensthundestaffel', cost: 100000, coins: 10 },
            { id: 11, name: 'Kriminalpolizei', cost: 100000, coins: 20 },
            { id: 12, name: 'Dienstgruppenleitung', cost: 200000, coins: 25 },
            { id: 13, name: 'Motorradstaffel', cost: 75000, coins: 15 },
            { id: 14, name: 'Großwache', cost: 1000000, coins: 50 },
            { id: 15, name: 'Großgewahrsam', cost: 200000, coins: 50 },
        ],

        '8_normal': [ // Polizeischule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '9_normal': [ // THW
            { id: 0, name: '1. Technischer Zug: Fachgruppe Bergung/Notinstandsetzung', cost: 25000, coins: 5 },
            { id: 1, name: '1. Technischer Zug: Zugtrupp', cost: 25000, coins: 5 },
            { id: 2, name: 'Fachgruppe Räumen', cost: 25000, coins: 5 },
            { id: 3, name: 'Fachgruppe Wassergefahren', cost: 500000, coins: 15 },
            { id: 4, name: '2. Technischer Zug - Bergungsgruppe', cost: 25000, coins: 5 },
            { id: 5, name: '2. Technischer Zug: Fachgruppe Bergung/Notinstandsetzung', cost: 25000, coins: 5 },
            { id: 6, name: '2. Technischer Zug: Zugtrupp', cost: 25000, coins: 5 },
            { id: 7, name: 'Fachgruppe Ortung', cost: 450000, coins: 25 },
            { id: 8, name: 'Fachgruppe Wasserschaden/Pumpen', cost: 200000, coins: 25 },
            { id: 9, name: 'Fachruppe Schwere Bergung', cost: 200000, coins: 25 },
            { id: 10, name: 'Fachgruppe Elektroversorgung', cost: 200000, coins: 25 },
            { id: 11, name: 'Ortsverband-Mannschaftstransportwagen', cost: 50000, coins: 15 },
            { id: 12, name: 'Trupp Unbenannte Luftfahrtsysteme', cost: 50000, coins: 15 },
            { id: 13, name: 'Fachzug Führung und Kommunikation', cost: 300000, coins: 25 },
        ],

        '10_normal': [ // THW-Bundesschule
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

        '11_normal': [ // Bereitschaftspolizei
            { id: 0, name: '2. Zug der 1. Hundertschaft', cost: 25000, coins: 5 },
            { id: 1, name: '3. Zug der 1. Hundertschaft', cost: 25000, coins: 5 },
            { id: 2, name: 'Sonderfahrzeug: Gefangenenkraftwagen', cost: 25000, coins: 5 },
            { id: 3, name: 'Technischer Zug: Wasserwerfer', cost: 25000, coins: 5 },
            { id: 4, name: 'SEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 5, name: 'SEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 6, name: 'MEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 7, name: 'MEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 8, name: 'Diensthundestaffel', cost: 100000, coins: 10 },
            { id: 9, name: 'Reiterstaffel', cost: 300000, coins: 25},
            { id: 10, name: 'Lautsprecherkraftwagen', cost: 100000, coins: 10},
        ],

        '12_normal': [ // SEG
            { id: 0, name: 'Führung', cost: 25000, coins: 5 },
            { id: 1, name: 'Sanitätsdienst', cost: 25500, coins: 5 },
            { id: 2, name: 'Wasserrettung', cost: 500000, coins: 25 },
            { id: 3, name: 'Rettungshundestaffel', cost: 350000, coins: 25 },
            { id: 4, name: 'SEG-Drohne', cost: 50000, coins: 15 },
            { id: 5, name: 'Betreuungs- und Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 6, name: 'Technik und Sicherheit', cost: 200000, coins: 25 },
        ],

        '13_normal': [ // Polizeihubschrauberstation
            { id: 0, name: 'Außenlastbehälter', cost: 200000, coins: 15 },
            { id: 1, name: 'Windenrettung', cost: 200000, coins: 15 },
        ],

        '17_normal': [ // Polizeisondereinheit
            { id: 0, name: 'SEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 1, name: 'SEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 2, name: 'MEK: 1. Zug', cost: 100000, coins: 10 },
            { id: 3, name: 'MEK: 2. Zug', cost: 100000, coins: 10 },
            { id: 4, name: 'Diensthundestaffel', cost: 100000, coins: 10 },

        ],
        '0_small': [ // Feuerwehr (Kleinwache)
            { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 },
            { id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 },
            { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },
            { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },
            { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },
            { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },
            { id: 16, name: 'Großlüfter', cost: 75000, coins: 25 },
            { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },
            { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },
            { id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 },
            { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },
        ],

        '6_small': [ // Polizei (Kleinwache)
            { id: 0, name: '1te Zelle', cost: 25000, coins: 5 },
            { id: 1, name: '2te Zelle', cost: 25000, coins: 5 },
            { id: 10, name: 'Diensthundestaffel', cost: 100000, coins: 10 },
            { id: 11, name: 'Kriminalpolizei', cost: 100000, coins: 20 },
            { id: 12, name: 'Dienstgruppenleitung', cost: 200000, coins: 25 },
            { id: 13, name: 'Motorradstaffel', cost: 75000, coins: 15 },
        ],

        '24_normal': [ // Reiterstaffel
            { id: 0, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 1, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 2, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 3, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 4, name: 'Reiterstaffel', cost: 300000, coins: 25 },
            { id: 5, name: 'Reiterstaffel', cost: 300000, coins: 25 },
        ],

        '25_normal': [ // Bergrettungswache
            { id: 0, name: 'Höhenrettung', cost: 50000, coins: 25 },
            { id: 1, name: 'Drohneneinheit', cost: 75000, coins: 25 },
            { id: 2, name: 'Rettungshundestaffel', cost: 350000, coins: 25 },
            { id: 3, name: 'Rettungsdienst', cost: 100000, coins: 20 },
        ],

        '27_normal': [ // Schule für Seefahrt und Seenotrettung
            { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
            { id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },
        ],

    };

    // Ab hier nichts mehr ändern! (Es sei denn Ihr wisst was Ihr tut)

    // Funktion um die Lightbox und Stile zu erstellen
    const styles = `
        #extension-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        #extension-lightbox #extension-lightbox-content {
            background: var(--background-color, white);
            color: var(--text-color, black);
            border: 1px solid var(--border-color, black);
            padding: 20px;
            width: 80%;
            max-width: 1500px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            text-align: center;
            border-radius: 10px; /* Abgerundete Ecken */
        }
        #extension-lightbox #close-extension-helper {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
        }
        :root {
            --background-color: #f2f2f2;
            --text-color: #000;
            --border-color: #ccc;
            --button-background-color: #007bff;
            --button-text-color: #ffffff;
            --button-hover-background-color: #0056b3;
        }
        #extension-lightbox table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 16px;
        }
        #extension-lightbox th {
            text-align: center;
            vertical-align: middle;
        }
        #extension-lightbox table td {
            background-color: var(--background-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 10px;
            text-align: center; /* Text in der Mitte */
            vertical-align: middle;
        }
        #extension-lightbox thead {
            background-color: #f2f2f2;
            font-weight: bold;
            border-bottom: 2px solid #ccc;
        }
        #extension-lightbox .extension-button,
        #extension-lightbox .build-selected-button,
        #extension-lightbox .build-all-button,
        #extension-lightbox .spoiler-button {
            color: var(--button-text-color);
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;
            transition: background-color 0.2s ease-in-out;
        }
        #extension-lightbox .extension-button {
            background-color: var(--button-background-color);
        }
        #extension-lightbox .extension-button:hover:enabled {
            background-color: var(--button-hover-background-color);
        }
        #extension-lightbox .build-selected-button {
            background-color: blue;
        }
        #extension-lightbox .build-all-button {
            background-color: red;
        }
        #extension-lightbox .build-selected-button:hover:enabled,
        #extension-lightbox .build-all-button:hover:enabled {
            filter: brightness(90%);
        }
        #extension-lightbox .spoiler-button {
            background-color: green;
        }
        #extension-lightbox .extension-button:disabled,
        #extension-lightbox .build-selected-button:disabled,
        #extension-lightbox .build-all-button:disabled {
            background-color: gray !important;
            cursor: not-allowed;
        }
        #extension-lightbox .spoiler-content {
            display: none;
        }
        #extension-lightbox .extension-search {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 14px;
        }
        .currency-selection {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid black;
            padding: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .currency-button {
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 4px;
            border: none;
            color: #ffffff;
        }
        .credits-button {
            background-color: #28a745;
        }
        .coins-button {
            background-color: #dc3545;
        }
        .cancel-button {
            background-color: #6c757d;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 4px;
        }
        #open-extension-helper {
            cursor: pointer;
        }
    `;

    // Funktion zum Abrufen der Benutzereinstellungen vom API
    async function getUserMode() {
        try {
            const response = await fetch('https://www.leitstellenspiel.de/api/settings');
            const data = await response.json();
            return data; // Gibt die vollständige Antwort zurück
        } catch (error) {
            console.error("Fehler beim Abrufen der Einstellungen: ", error);
            return null;
        }
    }

    // Funktion zum Anwenden des Dark- oder Light-Modus basierend auf der API-Antwort
    async function applyMode() {
        const userSettings = await getUserMode();
        if (!userSettings) {
            return;
        }

        const mode = userSettings.design_mode; // Benutze jetzt "design_mode" anstelle von "mode"
        // Warten auf das Lightbox-Element
        const lightboxContent = document.getElementById('extension-lightbox-content');
        if (!lightboxContent) {
            return;
        }

        // Entferne alle möglichen Modus-Klassen
        lightboxContent.classList.remove('dark', 'light');

        // Modus anwenden
        if (mode === 1 || mode === 4) { // Dunkelmodus
            lightboxContent.classList.add('dark');

            // Dark Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#333');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--border-color', '#444');
        } else if (mode === 2 || mode === 3) { // Hellmodus
            lightboxContent.classList.add('light');

            // Light Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#f2f2f2');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        } else { // Standardmodus (wenn der Modus unbekannt ist)
            lightboxContent.classList.add('light'); // Standardmäßig hell

            // Standard Light Mode für Tabelle
            document.documentElement.style.setProperty('--background-color', '#f2f2f2');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        }
    }

    // Funktion zur Beobachtung der Lightbox auf Änderungen (für dynamisch geladene Elemente)
    function observeLightbox() {
        const lightboxContainer = document.getElementById('extension-lightbox');
        if (!lightboxContainer) {
            return;
        }

        const observer = new MutationObserver(() => {
            // Überprüfe, ob das Content-Element in der Lightbox existiert
            const lightboxContent = document.getElementById('extension-lightbox-content');
            if (lightboxContent) {
                applyMode(); // Wenn das Lightbox-Inhalt gefunden wird, Modus anwenden
                observer.disconnect(); // Beende die Beobachtung, wenn die Lightbox gefunden wurde
            }
        });

        // Beobachte das Hinzufügen von neuen Kindelementen (wie die Lightbox-Inhalte)
        observer.observe(lightboxContainer, { childList: true, subtree: true });
    }

    // Wende den Modus an, wenn das DOM bereit ist
    window.addEventListener('load', () => {
        applyMode();
        observeLightbox(); // Beobachtet dynamische Änderungen
    });

    // Fügt die Stile hinzu
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    // Erstellt das Lightbox-Interface
    const lightbox = document.createElement('div');
    lightbox.id = 'extension-lightbox';
    lightbox.style.display = 'none';
    lightbox.innerHTML = `
            <div id="extension-lightbox-content">
                <button id="close-extension-helper">Schließen</button>
                <h2>Erweiterungs-Manager<br><h5>
                <br>In den unteren Tabellen könnt Ihr eure Erweiterungen verwalten und über die verschiedenen Möglichkeiten in Auftraug geben.
                <br>Feedback jeglicher Art könnt Ihr gern im Forum im entsprechenden Thread hinterlassen.
                <br>
                <br>
                <br>
                <div id="extension-list">
                Bitte habe einen Moment Geduld!
                <br>
                <br>
                Lade Gebäudedaten und erstelle die Tabellen...</div>
            </div>
        `;

    document.body.appendChild(lightbox);

    const lightboxContent = lightbox.querySelector('#extension-lightbox-content');

    // Darkmode oder Whitemode anwenden
    function applyTheme() {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        lightboxContent.classList.toggle('dark', isDarkMode);
        lightboxContent.classList.toggle('light', !isDarkMode);
    }

    // Event-Listener für Theme-Änderungen
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

    // Theme initial anwenden
    applyTheme();

    // Funktion zum Formatieren der Zahl
    function formatNumber(number) {
        return new Intl.NumberFormat('de-DE').format(number);
    }

    // Funktion zum Abrufen des CSRF-Tokens
    function getCSRFToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : '';
    }

    // Button im Profilmenü hinzufügen
    function addMenuButton() {
        const profileMenu = document.querySelector('#menu_profile + .dropdown-menu');
        if (profileMenu) {
            let menuButton = document.querySelector('#menu_profile + .dropdown-menu #open-extension-helper');
            if (!menuButton) {
                const divider = profileMenu.querySelector('li.divider');
                menuButton = document.createElement('li');
                menuButton.setAttribute('role', 'presentation');
                menuButton.innerHTML = `
                <a href="#" id="open-extension-helper">
                    <span class="glyphicon glyphicon-wrench"></span>&nbsp;&nbsp; Erweiterungs-Manager
                </a>
            `;
                if (divider) {
                    profileMenu.insertBefore(menuButton, divider);
                } else {
                    profileMenu.appendChild(menuButton);
                }
            }
            // Entfernen des href-Attribut, um das Standard-Linkverhalten zu verhindern
            const link = menuButton.querySelector('a');
            link.removeAttribute('href');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                checkPremiumAndShowHint();
            });
        } else {
            console.error('Profilmenü (#menu_profile + .dropdown-menu) nicht gefunden. Der Button konnte nicht hinzugefügt werden.');
        }
    }

    // Initial den Button hinzufügen
    addMenuButton();

    // Globale Variable definieren
    var user_premium = false;

    // Funktion, um den Premium-Status zu überprüfen
    function checkPremiumStatus() {
        // Suchen Sie nach dem Skript-Tag, das die Variable user_premium setzt
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var scriptContent = scripts[i].textContent;
            var premiumMatch = scriptContent.match(/var user_premium\s*=\s*(true|false);/);
            if (premiumMatch) {
                user_premium = (premiumMatch[1] === 'true');
                break;
            }
        }

        // Fallback, falls die Variable nicht gefunden wird
        if (typeof user_premium === 'undefined') {
            console.error("Die Variable 'user_premium' ist nicht definiert. Bitte prüfen Sie die HTML-Struktur.");
            user_premium = false; // Standardwert setzen
        }
    }

    // Rufen Sie die Funktion auf, um den Status zu überprüfen
    checkPremiumStatus();

    // Funktion zur Prüfung von Premium und Hinweis
    async function checkPremiumAndShowHint() {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        function createCustomAlert(message, isDarkMode, callback) {
            const alertDiv = document.createElement('div');
            alertDiv.style.position = 'fixed';
            alertDiv.style.top = '50%';
            alertDiv.style.left = '50%';
            alertDiv.style.transform = 'translate(-50%, -50%)';
            alertDiv.style.padding = '20px';
            alertDiv.style.border = '1px solid';
            alertDiv.style.borderRadius = '10px';
            alertDiv.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
            alertDiv.style.width = '300px';
            alertDiv.style.textAlign = 'center';
            alertDiv.style.zIndex = '10002';

            alertDiv.style.background = isDarkMode ? '#333' : '#fff';
            alertDiv.style.color = isDarkMode ? '#fff' : '#000';
            alertDiv.style.borderColor = isDarkMode ? '#444' : '#ccc';

            const alertText = document.createElement('p');
            alertText.textContent = message;
            alertDiv.appendChild(alertText);

            const closeButton = document.createElement('button');
            closeButton.textContent = 'OK';
            closeButton.style.marginTop = '10px';
            closeButton.style.padding = '5px 10px';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.style.borderRadius = '4px';
            closeButton.style.backgroundColor = isDarkMode ? '#444' : '#007bff';
            closeButton.style.color = isDarkMode ? '#fff' : '#fff';
            closeButton.onclick = () => {
                document.body.removeChild(alertDiv);
                callback();
            };
            alertDiv.appendChild(closeButton);

            document.body.appendChild(alertDiv);
        }

        if (typeof user_premium !== 'undefined') {

            if (!user_premium) {
                createCustomAlert("Du kannst dieses Script nur mit Einschränkungen nutzen da du keinen Premium-Account hast.", isDarkMode, () => {
                    const lightbox = document.getElementById('extension-lightbox');
                    lightbox.style.display = 'flex';
                    fetchBuildingsAndRender(); // API-Daten abrufen, wenn das Script geöffnet wird
                });
            } else {
                const lightbox = document.getElementById('extension-lightbox');
                lightbox.style.display = 'flex';
                fetchBuildingsAndRender(); // API-Daten abrufen, wenn das Script geöffnet wird
            }
        } else {
            console.error("Die Variable 'user_premium' ist nicht definiert. Bitte prüfe, ob sie korrekt geladen wurde.");
        }
    }

    // Funktion, um den Namen eines Gebäudes anhand der ID zu bekommen
    function getBuildingCaption(buildingId) {
        const building = buildingsData.find(b => String(b.id) === String(buildingId));
        if (building) {

            return building.caption; // Direkt den Gebäudennamen zurückgeben
        }

        return 'Unbekanntes Gebäude';
    }

    let buildingsData = []; // Globale Variable, um die abgerufenen Gebäudedaten zu speichern
    let buildingGroups = {}; // Globale Definition

    // Funktion zum Abrufen der Gebäudedaten
    function fetchBuildingsAndRender() {
        fetch('https://www.leitstellenspiel.de/api/buildings')
            .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Daten');
            }
            return response.json();
        })
            .then(data => {
            buildingsData = data; // Speichern der Gebäudedaten in einer globalen Variablen
            renderMissingExtensions(data); // Weiterverarbeiten der abgerufenen Daten
        })
            .catch(error => {
            const list = document.getElementById('extension-list');
            list.innerHTML = 'Fehler beim Laden der Gebäudedaten.';
        });
    }

    // Funktion, um den Namen der zugehörigen Leitstelle zu ermitteln
    function getLeitstelleName(building) {
        if (!building.leitstelle_building_id) return 'Keine Leitstelle';

        const leitstelle = buildingsData.find(b => b.id === building.leitstelle_building_id);
        return leitstelle ? leitstelle.caption : 'Unbekannt';
    }

    // Funktion um die aktuelle Credits und Coins des USERS abzurufen
    async function getUserCredits() {
        try {
            const response = await fetch('https://www.leitstellenspiel.de/api/userinfo');
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Credits und Coins');
            }
            const data = await response.json();
            return {
                credits: data.credits_user_current,
                coins: data.coins_user_current,
                premium: data.premium // Fügen Sie diese Zeile hinzu, um den Premium-Status zurückzugeben
            };
        } catch (error) {
            console.error('Fehler beim Abrufen der Credits und Coins:', error);
            throw error;
        }
    }

    // Funktion um die Tabellen mit Daten zu füllen
    async function renderMissingExtensions(buildings) {
        const userInfo = await getUserCredits();
        const list = document.getElementById('extension-list');
        list.innerHTML = ''; // Lösche den Inhalt der Lightbox

        // Setze die globalen Variablen zurück
        buildingGroups = {};
        buildingsData = buildings;

        buildings.sort((a, b) => {
            if (a.building_type === b.building_type) {
                return a.caption.localeCompare(b.caption);
            }
            return a.building_type - b.building_type;
        });

        buildings.forEach(building => {
            const buildingTypeKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;
            const extensions = manualExtensions[buildingTypeKey];
            if (!extensions) return;

            const existingExtensions = new Set(building.extensions.map(e => e.type_id));

            const allowedExtensions = extensions.filter(extension => {
                if (isExtensionLimitReached(building, extension.id)) {
                    return false;
                }

                // Spezifische Erweiterungen ausblenden, wenn bereits eine der relevanten Erweiterungen vorhanden ist
                if (building.building_type === 6 && building.small_building) { // Polizeiwache (Kleinwache)
                    const forbiddenExtensions = [10, 11, 12, 13];
                    if (forbiddenExtensions.some(id => existingExtensions.has(id))) {
                        return !forbiddenExtensions.includes(extension.id);
                    }
                }

                if (building.building_type === 0 && building.small_building) { // Feuerwache (Kleinwache)
                    const forbiddenExtensions = [0, 6, 8, 13, 14, 16, 18, 19, 25];
                    if (forbiddenExtensions.some(id => existingExtensions.has(id))) {
                        return !forbiddenExtensions.includes(extension.id);
                    }
                }

                return !existingExtensions.has(extension.id);
            });

            if (allowedExtensions.length > 0) {
                if (!buildingGroups[buildingTypeKey]) {
                    buildingGroups[buildingTypeKey] = [];
                }
                buildingGroups[buildingTypeKey].push({ building, missingExtensions: allowedExtensions });
            }
        });

        const buildingTypeNames = {
            '0_normal': 'Feuerwache (Normal)',
            '0_small': 'Feuerwache (Kleinwache)',
            '1_normal': 'Feuerwehrschule',
            '2_normal': 'Rettungswache',
            '3_normal': 'Rettungsschule',
            '4_normal': 'Krankenhaus',
            '5_normal': 'Rettungshubschrauber-Station',
            '6_normal': 'Polizeiwache (Normal)',
            '6_small': 'Polizeiwache (Kleinwache)',
            '8_normal': 'Polizeischule',
            '9_normal': 'Technisches Hilfswerk',
            '10_normal': 'Technisches Hilfswerk - Bundesschule',
            '11_normal': 'Bereitschaftspolizei',
            '12_normal': 'Schnelleinsatzgruppe (SEG)',
            '13_normal': 'Polizeihubschrauber-Station',
            '17_normal': 'Polizei-Sondereinheiten',
            '24_normal': 'Reiterstaffel',
            '25_normal': 'Bergrettungswache',
            '27_normal': 'Schule für Seefahrt und Seenotrettung',
        };

        Object.keys(buildingGroups).forEach(groupKey => {
            const group = buildingGroups[groupKey];
            const buildingType = buildingTypeNames[groupKey] || 'Unbekannt';

            const buildingHeader = document.createElement('h4');
            buildingHeader.textContent = `${buildingType}`;
            buildingHeader.classList.add('building-header');
            list.appendChild(buildingHeader);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.alignItems = 'center';

            const spoilerButton = document.createElement('button');
            spoilerButton.textContent = 'Erweiterungen anzeigen';
            spoilerButton.classList.add('btn', 'spoiler-button');
            buttonContainer.appendChild(spoilerButton);

            const buildSelectedButton = document.createElement('button');
            buildSelectedButton.textContent = 'Ausgewählte Erweiterungen bauen';
            buildSelectedButton.classList.add('btn', 'build-selected-button');
            buildSelectedButton.disabled = true; // Initial disabled
            buildSelectedButton.onclick = () => buildSelectedExtensions();
            buttonContainer.appendChild(buildSelectedButton);

            const buildAllButton = document.createElement('button');
            buildAllButton.textContent = 'Sämtliche Erweiterungen bei allen Wachen bauen';
            buildAllButton.classList.add('btn', 'build-all-button');
            buildAllButton.onclick = () => showCurrencySelectionForAll(groupKey);
            buttonContainer.appendChild(buildAllButton);

            document.body.appendChild(buttonContainer);

            list.appendChild(buttonContainer);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'spoiler-content';
            contentWrapper.style.display = 'none';

            const searchInput = document.createElement('input');
            searchInput.type = "text";
            searchInput.placeholder = "🔍 Hier könnt Ihr nach Leistellen, Wachen oder Erweiterungen suchen...";
            searchInput.style.width = "100%";
            searchInput.style.marginBottom = "10px";
            searchInput.style.padding = "5px";
            searchInput.style.fontSize = "14px";
            searchInput.style.display = 'block';

            spoilerButton.addEventListener('click', () => {
                if (contentWrapper.style.display === 'none') {
                    contentWrapper.style.display = 'block';
                    spoilerButton.textContent = 'Erweiterungen ausblenden';
                } else {
                    contentWrapper.style.display = 'none';
                    spoilerButton.textContent = 'Erweiterungen anzeigen';
                }
            });

            const table = document.createElement('table');
            table.innerHTML = `
            <thead style="background-color: #f2f2f2; font-weight: bold; border-bottom: 2px solid #ccc;">
             <tr>
               <th style="padding: 10px; text-align: center; vertical-align: middle;">
               Alle An- / Abwählen <br>
               <input type="checkbox" class="select-all-checkbox" data-group="${groupKey}">
             </th>
                 <th style="padding: 10px; text-align: center; vertical-align: middle;">Leitstellen</th>
                 <th style="padding: 10px; text-align: center; vertical-align: middle;">Wachen</th>
                 <th style="padding: 10px; text-align: center; vertical-align: middle;">Baubare Erweiterungen</th>
                 <th style="padding: 10px; text-align: center; vertical-align: middle;">Bauen mit Credits</th>
                 <th style="padding: 10px; text-align: center; vertical-align: middle;">Bauen mit Coins</th>
            </tr>
          </thead>
      <tbody></tbody>
    `;

            const tbody = table.querySelector('tbody');
            const selectAllCheckbox = table.querySelector('.select-all-checkbox');

            selectAllCheckbox.addEventListener('change', function() {
                const groupCheckboxes = table.querySelectorAll('.extension-checkbox');
                groupCheckboxes.forEach(checkbox => {
                    if (!checkbox.disabled && checkbox.offsetParent !== null) {
                        checkbox.checked = selectAllCheckbox.checked;
                    }
                });

                updateBuildSelectedButton();
            });

            group.forEach(({ building, missingExtensions }) => {
                missingExtensions.forEach(extension => {
                    if (isExtensionLimitReached(building, extension.id)) {
                        return;
                    }

                    const row = document.createElement('tr');
                    row.classList.add(`row-${building.id}-${extension.id}`);

                    const checkboxCell = document.createElement('td');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'extension-checkbox';
                    checkbox.dataset.buildingId = building.id;
                    checkbox.dataset.extensionId = extension.id;
                    checkbox.dataset.cost = extension.cost;
                    checkbox.dataset.coins = extension.coins;
                    checkbox.disabled = userInfo.credits < extension.cost && userInfo.coins < extension.coins;
                    checkbox.addEventListener('change', updateBuildSelectedButton);
                    checkboxCell.style.textAlign = 'center';
                    checkboxCell.style.verticalAlign = 'middle';
                    checkboxCell.appendChild(checkbox);
                    row.appendChild(checkboxCell);

                    const leitstelleCell = document.createElement('td');
                    leitstelleCell.textContent = getLeitstelleName(building);
                    leitstelleCell.style.textAlign = 'center';
                    leitstelleCell.style.verticalAlign = 'middle';
                    row.appendChild(leitstelleCell);

                    const nameCell = document.createElement('td');
                    nameCell.textContent = building.caption;
                    nameCell.style.textAlign = 'center';
                    nameCell.style.verticalAlign = 'middle';
                    row.appendChild(nameCell);

                    const extensionCell = document.createElement('td');
                    extensionCell.textContent = extension.name;
                    extensionCell.style.textAlign = 'center';
                    extensionCell.style.verticalAlign = 'middle';
                    row.appendChild(extensionCell);

                    const creditCell = document.createElement('td');
                    const creditButton = document.createElement('button');
                    creditButton.textContent = `${formatNumber(extension.cost)} Credits`;
                    creditButton.classList.add('btn', 'btn-xl', 'credit-button');
                    creditButton.style.backgroundColor = '#28a745';
                    creditButton.style.color = 'white';
                    creditButton.disabled = userInfo.credits < extension.cost;
                    creditButton.onclick = () => buildExtension(building, extension.id, 'credits', row);
                    creditCell.style.textAlign = 'center';
                    creditCell.style.verticalAlign = 'middle';
                    creditCell.appendChild(creditButton);
                    row.appendChild(creditCell);

                    const coinsCell = document.createElement('td');
                    const coinsButton = document.createElement('button');
                    coinsButton.textContent = `${extension.coins} Coins`;
                    coinsButton.classList.add('btn', 'btn-xl', 'coins-button');
                    coinsButton.style.backgroundColor = '#dc3545';
                    coinsButton.style.color = 'white';
                    coinsButton.disabled = userInfo.coins < extension.coins;
                    coinsButton.onclick = () => buildExtension(building, extension.id, 'coins', row);
                    coinsCell.style.textAlign = 'center';
                    coinsCell.style.verticalAlign = 'middle';
                    coinsCell.appendChild(coinsButton);
                    row.appendChild(coinsCell);

                    tbody.appendChild(row);
                });
            });

            contentWrapper.appendChild(searchInput);
            contentWrapper.appendChild(table);
            list.appendChild(contentWrapper);

            searchInput.addEventListener("input", function() {
                const searchTerm = searchInput.value.toLowerCase();
                filterTable(tbody, searchTerm);
            });
        });
    }

    // Schließen-Button-Funktionalität
    document.getElementById('close-extension-helper').addEventListener('click', () => {
        const lightbox = document.getElementById('extension-lightbox');
        lightbox.style.display = 'none';

        // Setze die globalen Variablen zurück
        buildingGroups = {};
        buildingsData = [];
    });

    // Initial den Button hinzufügen
    addMenuButton();

    // Funktion zur Filterungen der Tabelleninhalten
    function filterTable(tbody, searchTerm) {
        const rows = tbody.querySelectorAll("tr");

        rows.forEach(row => {
            const leitstelle = row.cells[1]?.textContent.toLowerCase() || "";
            const wachenName = row.cells[2]?.textContent.toLowerCase() || "";
            const erweiterung = row.cells[3]?.textContent.toLowerCase() || "";
            const isBuilt = row.classList.contains("built"); // Prüft, ob bereits gebaut

            if (isBuilt) {
                row.style.display = "none"; // Gebaute Zeilen bleiben unsichtbar
            } else if (leitstelle.includes(searchTerm) || wachenName.includes(searchTerm) || erweiterung.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Funktion zur Unterscheidung der Erweiterungswarteschlange zwischen Premium und Nicht Premium User
    function isExtensionLimitReached(building, extensionId) {
        const fireStationSmallAlwaysAllowed = [1, 2, 10, 11];
        const fireStationSmallLimited = [0, 6, 8, 13, 14, 16, 18, 19, 25];

        const policeStationSmallAlwaysAllowed = [0, 1];
        const policeStationSmallLimited = [10, 11, 12, 13];

        const thwAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Alle THW-Erweiterungen
        const bpolAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Alle BPol-Erweiterungen
        const polSonderEinheitAllExtensions = [0, 1, 2, 3, 4]; // Alle PolSondereinheit-Erweiterungen
        const KhAllExtensions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Alle Krankenhaus-Erweiterungen

        // Falls Premium aktiv ist, gibt es keine Einschränkungen für THW, B-Pol, Schulen und Pol-Sondereinheit
        if (typeof !user_premium !== "undefined" && user_premium) {
            return false; // Keine Einschränkungen für Premium-Nutzer
        }

        // Falls es sich um eine Schule handelt und der Benutzer kein Premium hat
        if (building.building_type === 1 || building.building_type === 3 || building.building_type === 8 || building.building_type === 10 || building.building_type === 27) {
            // Erweiterung 0 und 1 sind immer erlaubt
            if (extensionId === 0 || extensionId === 1) return false;

            // Erweiterung 2 nur erlaubt, wenn Erweiterung 0 bereits gebaut wurde
            if (extensionId === 2) {
                const hasExtension0 = building.extensions.some(ext => ext.type_id === 0);
                if (!hasExtension0) return true; // Blockiere Erweiterung 2, wenn Erweiterung 0 noch nicht gebaut wurde
            }
        }

        if (building.building_type === 0 && building.small_building) {
            // Feuerwache (Kleinwache): Prüfen, ob die Erweiterung limitiert ist
            if (fireStationSmallAlwaysAllowed.includes(extensionId)) return false;
            return building.extensions.some(ext => fireStationSmallLimited.includes(ext.type_id));
        }

        if (building.building_type === 6 && building.small_building) {
            // Polizeiwache (Kleinwache): Prüfen, ob die Erweiterung limitiert ist
            if (policeStationSmallAlwaysAllowed.includes(extensionId)) return false;
            return building.extensions.some(ext => policeStationSmallLimited.includes(ext.type_id));
        }

        if (building.building_type === 4) {
            // Krankenhaus
            const khRequiredFirst = [0, 1];
            const khRestrictedUntilFirstTwo = [2, 3, 4, 5, 6, 7, 8];
            const khAlwaysAllowed = [9];

            if (khAlwaysAllowed.includes(extensionId)) return false;

            const hasRequiredFirstExtensions = khRequiredFirst.every(reqId =>
                                                                     building.extensions.some(ext => ext.type_id === reqId)
                                                                    );

            if (khRestrictedUntilFirstTwo.includes(extensionId) && !hasRequiredFirstExtensions) {
                return true;
            }

            return false;
        }

        if (building.building_type === 9) {
            // THW
            const thwRequiredFirst = [0, 1];
            const thwRestrictedUntilFirstTwo = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13];
            const thwAlwaysAllowed = [11];

            if (thwAlwaysAllowed.includes(extensionId)) return false;

            const hasRequiredFirstExtensions = thwRequiredFirst.every(reqId =>
                                                                      building.extensions.some(ext => ext.type_id === reqId)
                                                                     );

            if (thwRestrictedUntilFirstTwo.includes(extensionId) && !hasRequiredFirstExtensions) {
                return true;
            }

            return false;
        }

        if (building.building_type === 11) {
            // BPol
            const bpolAlwaysAllowed = [0, 3, 4, 6, 8, 9, 10];
            const bpolConditional = { 1: 0, 2: 1, 5: 4, 7: 8 };

            if (bpolAlwaysAllowed.includes(extensionId)) return false;
            if (bpolConditional[extensionId] !== undefined) {
                return !building.extensions.some(ext => ext.type_id === bpolConditional[extensionId]);
            }

            return false;
        }

        if (building.building_type === 17) {
            // PolSonderEinheit
            const polSonderEinheitAlwaysAllowed = [0, 2, 4];
            const polSonderEinheitConditional = { 1: 0, 3: 1 };

            if (polSonderEinheitAlwaysAllowed.includes(extensionId)) return false;
            if (polSonderEinheitConditional[extensionId] !== undefined) {
                return !building.extensions.some(ext => ext.type_id === polSonderEinheitConditional[extensionId]);
            }

            return false;
        }

        return false;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // NEUER BEREICH: PARALLELE VERARBEITUNG
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * Führt eine Warteschlange von Aufgaben mit einer begrenzten Anzahl paralleler "Worker" aus.
     * @param {Array<Object>} tasks - Eine Liste von Aufgabenobjekten, die verarbeitet werden sollen.
     * @param {Function} taskProcessor - Die Funktion, die eine einzelne Aufgabe ausführt. Muss ein Promise zurückgeben.
     * @param {number} concurrency - Die Anzahl der Aufgaben, die gleichzeitig ausgeführt werden sollen.
     * @param {Function} progressCallback - Eine Funktion, die bei Fortschritt aufgerufen wird. Erhält (completed, total).
     */
    async function processTaskQueue(tasks, taskProcessor, concurrency, progressCallback) {
        const queue = [...tasks];
        let completed = 0;
        const total = tasks.length;
        const workers = [];

        // Initialer Fortschrittsaufruf
        if (progressCallback) progressCallback(completed, total);

        const run = async () => {
            while (queue.length > 0) {
                const task = queue.shift();
                await taskProcessor(task);
                completed++;
                if (progressCallback) progressCallback(completed, total);
            }
        };

        for (let i = 0; i < concurrency; i++) {
            workers.push(run());
        }

        await Promise.all(workers);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Anfang des Bereichs für den Bau einer Erweiterung in einem Gebäude

    // Funktion zum Bau einer Erweiterung
    function buildExtension(building, extensionId, currency, row) {
        return new Promise((resolve, reject) => {
            const csrfToken = getCSRFToken();
            const buildUrl = `/buildings/${building.id}/extension/${currency}/${extensionId}`;

            GM_xmlhttpRequest({
                method: 'POST',
                url: buildUrl,
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                    if (row) {
                        // Logik zum Ausblenden von Zeilen für Kleinwachen
                         if (building.building_type === 6 && building.small_building && [10, 11, 12, 13].includes(extensionId)) {
                            const allRows = document.querySelectorAll(`.row-${building.id}-10, .row-${building.id}-11, .row-${building.id}-12, .row-${building.id}-13`);
                            allRows.forEach(otherRow => { otherRow.style.display = 'none'; });
                        }
                        if (building.building_type === 0 && building.small_building && [0, 6, 8, 13, 14, 16, 18, 19, 25].includes(extensionId)) {
                            const allRows = document.querySelectorAll(`.row-${building.id}-0, .row-${building.id}-6, .row-${building.id}-8, .row-${building.id}-13, .row-${building.id}-14, .row-${building.id}-16, .row-${building.id}-18, .row-${building.id}-19, .row-${building.id}-25`);
                            allRows.forEach(otherRow => { otherRow.style.display = 'none'; });
                        }

                        row.classList.add("built");
                        row.style.display = "none";
                    }
                    resolve(response);
                },
                onerror: function(error) {
                    console.error(`Fehler beim Bauen der Erweiterung in Gebäude ${building.id}.`, error);
                    reject(error);
                }
            });
        });
    }

    // Ende des Bereichs für den Bau * einer Erweiterung * in einem Gebäude


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Anfang der Funktion für * Bau von ausgewählten Erweiterungen *

    // Funktion zum Bau der ausgewählten Erweiterungen
    async function buildSelectedExtensions() {
        const selectedCheckboxes = document.querySelectorAll('.extension-checkbox:checked');
        const tasks = [];
        const selectedExtensionsByBuilding = {};

        selectedCheckboxes.forEach(checkbox => {
            const buildingId = checkbox.dataset.buildingId;
            const extensionId = parseInt(checkbox.dataset.extensionId, 10);
            const cost = parseInt(checkbox.dataset.cost, 10);
            const coins = parseInt(checkbox.dataset.coins, 10);
            const row = checkbox.closest('tr');

            tasks.push({ buildingId, extensionId, cost, coins, row });

            if (!selectedExtensionsByBuilding[buildingId]) {
                selectedExtensionsByBuilding[buildingId] = [];
            }
            selectedExtensionsByBuilding[buildingId].push(extensionId);
        });

        // Checkboxen sofort entmarkieren und Button deaktivieren
        selectedCheckboxes.forEach(checkbox => { checkbox.checked = false; });
        updateBuildSelectedButton();
        document.querySelectorAll('.select-all-checkbox').forEach(cb => cb.checked = false);


        // Validierungslogik für Kleinwachen
        for (const [buildingId, extensions] of Object.entries(selectedExtensionsByBuilding)) {
            const building = buildingsData.find(b => String(b.id) === String(buildingId));
            if (!building || !building.small_building) continue;

             if (building.building_type === 0) { // Feuerwehr Kleinwache
                const invalidCombinations = [0, 6, 8, 13, 14, 16, 18, 19, 25];
                if (extensions.filter(id => invalidCombinations.includes(id)).length > 1) {
                    showError("Information: Für Feuerwachen (Kleinwache) kann nur eine der speziellen Erweiterungen gleichzeitig gebaut werden.");
                    return;
                }
            }

            if (building.building_type === 6) { // Polizei Kleinwache
                const invalidCombinations = [10, 11, 12, 13];
                 if (extensions.filter(id => invalidCombinations.includes(id)).length > 1) {
                    showError("Information: Für Polizeiwachen (Kleinwache) kann nur eine der speziellen Erweiterungen gleichzeitig gebaut werden.");
                    return;
                }
            }
        }

        // Non-Premium Limit
        if (!user_premium) {
            for (const extensions of Object.values(selectedExtensionsByBuilding)) {
                if (extensions.length > 2) {
                    alert(`Zu viele Erweiterungen für ein Gebäude ausgewählt.\n\nDa du keinen Premium-Account hast, kannst du maximal 2 Ausbauten pro Wache auswählen.`);
                    return;
                }
            }
        }

        if (tasks.length > 0) {
            showCurrencySelection(tasks);
        }
    }

    // Funktiom um eine Fehlermeldung auszugeben
    function showError(message) {
        alert(message);
        updateBuildSelectedButton();
    }

    // Funktion zur Auswahl der Zahlmöglichkeit sowie Prüfung der ausgewählten Erweiterungen
    async function showCurrencySelection(tasks) {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);
        const userInfo = await getUserCredits();

        let totalCredits = tasks.reduce((sum, task) => sum + task.cost, 0);
        let totalCoins = tasks.reduce((sum, task) => sum + task.coins, 0);

        const fehlendeCredits = Math.max(0, totalCredits - userInfo.credits);
        const fehlendeCoins = Math.max(0, totalCoins - userInfo.coins);

        if (userInfo.credits < totalCredits && userInfo.coins < totalCoins) {
            alert(`Du hast nicht genug Ressourcen!\n\n- Fehlende Credits: ${formatNumber(fehlendeCredits)}\n- Fehlende Coins: ${formatNumber(fehlendeCoins)}`);
            return;
        }

        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'currency-selection';
        selectionDiv.style.background = isDarkMode ? '#333' : '#fff';
        selectionDiv.style.color = isDarkMode ? '#fff' : '#000';
        selectionDiv.style.borderColor = isDarkMode ? '#444' : '#ccc';
        selectionDiv.innerHTML = `<p>Wähle zwischen <b>Credits (grün)</b> oder <b>Coins (rot)</b><br><br>Info:<br>Sollte eine Währung <b>nicht</b> ausreichend vorhanden sein,<br>kannst Du diese nicht auswählen</p>`;

        const processAndClose = async (currency) => {
            document.body.removeChild(selectionDiv);
            const { progressContainer, updateProgress } = await createProgressBar(tasks.length);

            const taskProcessor = (task) => buildExtension({ id: task.buildingId }, task.extensionId, currency, task.row);

            await processTaskQueue(tasks, taskProcessor, 30, (completed, total) => {
                updateProgress(completed, total);
            });

            removeProgressBar(progressContainer);
        };

        const creditsButton = document.createElement('button');
        creditsButton.className = 'currency-button credits-button';
        creditsButton.textContent = `${formatNumber(totalCredits)} Credits`;
        creditsButton.disabled = userInfo.credits < totalCredits;
        creditsButton.onclick = () => processAndClose('credits');

        const coinsButton = document.createElement('button');
        coinsButton.className = 'currency-button coins-button';
        coinsButton.textContent = `${formatNumber(totalCoins)} Coins`;
        coinsButton.disabled = userInfo.coins < totalCoins;
        coinsButton.onclick = () => processAndClose('coins');

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Abbrechen';
        cancelButton.onclick = () => document.body.removeChild(selectionDiv);

        selectionDiv.appendChild(creditsButton);
        selectionDiv.appendChild(coinsButton);
        selectionDiv.appendChild(cancelButton);
        document.body.appendChild(selectionDiv);
    }

    // Updatefunktion des Buttons
    function updateBuildSelectedButton() {
        const groups = document.querySelectorAll('.spoiler-content');
        groups.forEach(group => {
            const buildSelectedButton = group.previousElementSibling.querySelector('.build-selected-button');
            const selectedCheckboxes = group.querySelectorAll('.extension-checkbox:checked');
            if (buildSelectedButton) {
                buildSelectedButton.disabled = selectedCheckboxes.length === 0;
            }
        });
    }

    // Event-Listener für Checkbox-Änderungen hinzufügen
    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('extension-checkbox')) {
            updateBuildSelectedButton();
        }
    });

    // Ende der Funktion für * Bau von ausgewählten Erweiterungen *


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Anfang der Funktion * Alle Erweiterungen * in einem Gebäude bauen

    // Funktion zur Auswahl der Währung und Prüfung der Credit/Coins vorhandenheit
    async function showCurrencySelectionForAll(groupKey) {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        if (!buildingGroups[groupKey]) return;

        const group = buildingGroups[groupKey];
        let totalCredits = 0;
        let totalCoins = 0;

        group.forEach(({ missingExtensions }) => {
            missingExtensions.forEach(extension => {
                totalCredits += extension.cost;
                totalCoins += extension.coins;
            });
        });

        const userInfo = await getUserCredits();
        const fehlendeCredits = Math.max(0, totalCredits - userInfo.credits);
        const fehlendeCoins = Math.max(0, totalCoins - userInfo.coins);

        if (userInfo.credits < totalCredits && userInfo.coins < totalCoins) {
            alert(`Du hast nicht genug Ressourcen!\n\n- Fehlende Credits: ${formatNumber(fehlendeCredits)}\n- Fehlende Coins: ${formatNumber(fehlendeCoins)}`);
            return;
        }

        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'currency-selection';
        selectionDiv.style.background = isDarkMode ? '#333' : '#fff';
        selectionDiv.style.color = isDarkMode ? '#fff' : '#000';
        selectionDiv.style.borderColor = isDarkMode ? '#444' : '#ccc';
        selectionDiv.innerHTML = `<p>Wähle zwischen <b>Credits (grün)</b> oder <b>Coins (rot)</b><br><br>Info:<br>Sollte eine Währung <b>nicht</b> ausreichend vorhanden sein,<br>kannst Du diese nicht auswählen</p>`;

        const processAndClose = async (currency) => {
            document.body.removeChild(selectionDiv);
            await calculateAndBuildAllExtensions(groupKey, currency);
        };

        const creditsButton = document.createElement('button');
        creditsButton.className = 'currency-button credits-button';
        creditsButton.textContent = `${formatNumber(totalCredits)} Credits`;
        creditsButton.disabled = userInfo.credits < totalCredits;
        creditsButton.onclick = () => processAndClose('credits');

        const coinsButton = document.createElement('button');
        coinsButton.className = 'currency-button coins-button';
        coinsButton.textContent = `${formatNumber(totalCoins)} Coins`;
        coinsButton.disabled = userInfo.coins < totalCoins;
        coinsButton.onclick = () => processAndClose('coins');

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Abbrechen';
        cancelButton.onclick = () => document.body.removeChild(selectionDiv);

        selectionDiv.appendChild(creditsButton);
        selectionDiv.appendChild(coinsButton);
        selectionDiv.appendChild(cancelButton);
        document.body.appendChild(selectionDiv);
    }

    // Funktion um die Gesamtkosten zu errechnen und den Bauprozess zu starten
    async function calculateAndBuildAllExtensions(groupKey, currency) {
        const group = buildingGroups[groupKey];
        if (!group) return;

        const tasks = [];
        group.forEach(({ building, missingExtensions }) => {
            missingExtensions.forEach(extension => {
                if (!isExtensionLimitReached(building, extension.id)) {
                    const row = document.querySelector(`.row-${building.id}-${extension.id}`);
                    tasks.push({ building, extension, row });
                }
            });
        });

        const { progressContainer, updateProgress } = await createProgressBar(tasks.length);

        const taskProcessor = (task) => buildExtension(task.building, task.extension.id, currency, task.row);

        await processTaskQueue(tasks, taskProcessor, 30, (completed, total) => {
            updateProgress(completed, total);
        });

        removeProgressBar(progressContainer);
        // Nach Abschluss die Tabellen neu laden, um den aktuellen Stand anzuzeigen
        fetchBuildingsAndRender();
    }

    // Funktion zur Erstellung der Fortschrittsanzeige
    async function createProgressBar(totalExtensions) {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.position = 'fixed';
        progressContainer.style.top = '50%';
        progressContainer.style.left = '50%';
        progressContainer.style.transform = 'translate(-50%, -50%)';
        progressContainer.style.padding = '20px';
        progressContainer.style.border = '1px solid #ccc';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
        progressContainer.style.width = '300px';
        progressContainer.style.textAlign = 'center';
        progressContainer.style.zIndex = '10002';

        progressContainer.style.background = isDarkMode ? '#333' : '#fff';
        progressContainer.style.color = isDarkMode ? '#fff' : '#000';

        const progressText = document.createElement('p');
        progressText.style.fontWeight = 'bold';
        progressText.style.fontSize = '16px';

        const progressBar = document.createElement('div');
        progressBar.style.width = '100%';
        progressBar.style.background = isDarkMode ? '#555' : '#ddd';
        progressBar.style.borderRadius = '5px';
        progressBar.style.marginTop = '10px';
        progressBar.style.overflow = 'hidden';

        const progressFill = document.createElement('div');
        progressFill.style.width = '0%';
        progressFill.style.height = '20px';
        progressFill.style.background = '#4caf50';
        progressFill.style.borderRadius = '5px';

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);

        const updateProgress = (builtCount, total) => {
            progressText.textContent = `${builtCount} / ${total} Erweiterungen gebaut`;
            progressFill.style.width = total > 0 ? Math.min(100, (builtCount / total) * 100) + '%' : '0%';
        };

        return { progressContainer, updateProgress };
    }

    // Funktion zum Entfernen der Fortschrittsanzeige mit 500ms Verzögerung
    function removeProgressBar(progressContainer) {
        if (progressContainer && progressContainer.parentNode) {
            setTimeout(() => {
                document.body.removeChild(progressContainer);
            }, 500); // 500ms Pause bevor die Fortschrittsanzeige entfernt wird
        }
    }

})();