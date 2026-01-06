// ==UserScript==
// @name         WME Map Comment Shapes
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2026.01.08
// @author       Hiwi234
// @description  Erstelle Map Comments mit vordefinierten Formen (Kreis, Quadrat, etc.) im Waze Map Editor
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560793/WME%20Map%20Comment%20Shapes.user.js
// @updateURL https://update.greasyfork.org/scripts/560793/WME%20Map%20Comment%20Shapes.meta.js
// ==/UserScript==

/* global W, getWmeSdk */

(function () {
    'use strict';

    const SCRIPT_ID = 'wme-mapcomment-shapes';
    const SCRIPT_NAME = 'Map Comment Shapes';
    const SCRIPT_VERSION = '2026.01.09';

    const SHAPES = {
        POINT: 'point',
        CIRCLE: 'circle',
        SQUARE: 'square',
        RECTANGLE: 'rectangle',
        TRIANGLE: 'triangle',
        PENTAGON: 'pentagon',
        HEXAGON: 'hexagon',
        OCTAGON: 'octagon',
        STAR: 'star',
        ARROW_UP: 'arrow_up',
        ARROW_DOWN: 'arrow_down',
        ARROW_LEFT: 'arrow_left',
        ARROW_RIGHT: 'arrow_right',
        SPEECH_RECT: 'speech_rect',
        SPEECH_ROUND: 'speech_round',
        CUSTOM: 'custom'
    };

    // ============ I18N ============
    const I18N = {
        de: {
            // UI Labels
            selectShape: 'Form wählen:',
            arrows: 'Pfeile:',
            speechBubbles: 'Sprechblasen:',
            customShapes: 'Eigene Formen:',
            size: 'Größe:',
            dynamic: 'Dynamisch (2 Klicks)',
            radius: 'Radius:',
            commentContent: 'Kommentar-Inhalt:',
            titlePlaceholder: 'Titel (max 30 Zeichen)',
            descPlaceholder: 'Beschreibung (optional)',
            expiresIn: 'Ablauf in:',
            days: 'Tagen',
            templates: 'Vorlagen:',
            selectTemplate: '-- Vorlage wählen --',
            templateName: 'Vorlagenname',
            simplify: 'Simplify (Vereinfachen):',
            simplifyHint: 'Wähle einen Map Comment aus und klicke Simplify',
            tolerance: 'Toleranz:',
            highQuality: 'High Quality',
            instructions: 'Anleitung:',
            instrPoint: 'Punkt: 1 Klick = Position',
            instrDynamicOn: 'Dynamisch AN: 1. Klick = Mitte, 2. Klick = Radius',
            instrDynamicOff: 'Dynamisch AUS: 1 Klick = Mitte (fester Radius)',
            // Rotate
            rotate: 'Drehen:',
            rotateHint: 'Wähle einen Map Comment aus',
            angle: 'Winkel:',
            rotateBtn: 'Drehen',
            rotated: 'Gedreht um {angle}°',
            // Orthogonalize
            orthogonalize: 'Orthogonalisieren:',
            orthogonalizeHint: 'Macht Winkel rechtwinklig (90°)',
            orthogonalizeBtn: 'Orthogonalisieren',
            orthogonalized: 'Orthogonalisiert!',
            // Scale/Resize
            scale: 'Skalieren:',
            scaleHint: 'Größe der Form anpassen',
            width: 'Breite:',
            height: 'Höhe:',
            scaleBtn: 'Anwenden',
            scaled: 'Skaliert!',
            keepRatio: 'Seitenverhältnis beibehalten',
            // Custom Shapes
            saveShape: 'Form speichern',
            shapeName: 'Formname',
            selectCustomShape: '-- Eigene Form wählen --',
            noCustomShapes: 'Keine eigenen Formen',
            shapeSaved: 'Form "{name}" gespeichert',
            shapeDeleted: 'Form "{name}" gelöscht',
            confirmDeleteShape: 'Form "{name}" wirklich löschen?',
            enterShapeName: 'Bitte Formname eingeben!',
            customShapeLoaded: 'Eigene Form geladen',
            // Shape titles
            shapePoint: 'Punkt',
            shapeCircle: 'Kreis',
            shapeSquare: 'Quadrat',
            shapeRectangle: 'Rechteck',
            shapeTriangle: 'Dreieck',
            shapePentagon: 'Fünfeck',
            shapeHexagon: 'Sechseck',
            shapeOctagon: 'Achteck',
            shapeStar: 'Stern',
            shapeArrowUp: 'Pfeil hoch',
            shapeArrowDown: 'Pfeil runter',
            shapeArrowLeft: 'Pfeil links',
            shapeArrowRight: 'Pfeil rechts',
            shapeSpeechRect: 'Sprechblase eckig',
            shapeSpeechRound: 'Sprechblase rund',
            shapeCustom: 'Eigene Form',
            // Status messages
            defaultStatus: 'Wähle eine Form und klicke auf die Karte',
            clickForCenter: 'Klicke für {shape}-Mittelpunkt',
            clickForPosition: 'Klicke für {shape}-Position',
            moveForSize: 'Bewege Maus für Größe, klicke zum Bestätigen',
            radiusDisplay: 'Radius: {radius}m - Klicke zum Bestätigen',
            commentCreated: 'Kommentar erstellt!',
            commentCreatedId: 'Kommentar erstellt! (ID: {id})',
            error: 'Fehler:',
            // Template messages
            enterTemplateName: 'Bitte Vorlagenname eingeben!',
            enterTitleOrDesc: 'Titel oder Beschreibung eingeben!',
            templateUpdated: 'Vorlage "{name}" aktualisiert',
            templateSaved: 'Vorlage "{name}" gespeichert',
            noTemplateSelected: 'Keine Vorlage ausgewählt!',
            templateLoaded: 'Vorlage "{name}" geladen',
            templateDeleted: 'Vorlage "{name}" gelöscht',
            confirmDelete: 'Vorlage "{name}" wirklich löschen?',
            // Simplify messages
            selectMapComment: 'Bitte Map Comment auswählen!',
            noValidPolygon: 'Kein gültiges Polygon!',
            tooFewPoints: 'Zu wenig Punkte nach Simplify!',
            simplified: 'Vereinfacht: {from} → {to} Punkte (Speichern!)',
            simplifyError: 'Fehler beim Vereinfachen:',
            preview: 'Vorschau: {from} → {to} Punkte',
            before: 'Vorher:',
            after: 'Nachher:',
            points: 'Punkte',
            reduction: 'Reduktion:',
            // Buttons
            cancel: 'Abbrechen',
            load: 'Laden',
            delete: 'Löschen',
            save: 'Speichern',
            // Edit section
            editSection: 'Bearbeiten',
            editHint: 'Zuerst einen Map Comment auf der Karte auswählen!',
            customShapesHint: 'Speichere einen ausgewählten Map Comment als wiederverwendbare Form',
            simplifyTitle: 'Simplify - Punkte reduzieren',
            simplifyDesc: 'Vereinfacht komplexe Formen durch Entfernen überflüssiger Punkte',
            rotateTitle: 'Form drehen',
            rotateDesc: 'Dreht die Form um ihren Mittelpunkt',
            orthogonalizeTitle: 'Rechte Winkel',
            orthogonalizeDesc: 'Macht alle Winkel rechtwinklig (90°) - ideal für Gebäude',
            scaleTitle: 'Größe ändern',
            scaleDesc: 'Ändert Breite und/oder Höhe der Form',
            previewBtn: 'Vorschau',
            // Image Upload
            imageUpload: 'Bild zu Form:',
            imageUploadHint: 'Lade ein Bild hoch um die Kontur zu erkennen',
            selectImage: 'Bild wählen',
            threshold: 'Schwellwert:',
            minArea: 'Min. Fläche:',
            detectContour: 'Kontur erkennen',
            imageLoaded: 'Bild geladen: {width}x{height}',
            contourDetected: 'Kontur erkannt: {points} Punkte',
            noContourFound: 'Keine Kontur gefunden!',
            clickToPlace: 'Klicke auf die Karte um die Form zu platzieren',
            processing: 'Verarbeite Bild...',
            invertColors: 'Farben invertieren',
            smoothing: 'Glättung:',
            // Update Popup
            updateTitle: '🎉 Update v{version}',
            updateNewFeatures: 'Neue Funktionen:',
            updateFeature1: '📐 Orthogonalisieren - Macht alle Winkel rechtwinklig (90°)',
            updateFeature2: '↔️ Skalieren - Breite und Höhe unabhängig anpassen mit Live-Vorschau',
            updateFeature3: '🖼️ Bild zu Form - Lade ein Bild hoch und erkenne automatisch die Kontur',
            updateFeature4: '🎨 Eigene Formen - Speichere Map Comments als wiederverwendbare Formen',
            updateUIChanges: 'UI Verbesserungen:',
            updateUI1: '📦 Kompaktere Oberfläche mit Akkordeon-Menüs',
            updateUI2: '📝 Bessere Beschreibungen für alle Werkzeuge',
            updateUI3: '⚡ Live-Vorschau beim Skalieren und Drehen',
            updateClose: 'Verstanden!',
            // Converter
            converter: 'Konverter:',
            converterHint: 'Wandle Map Comments in Places um',
            convertToPlace: 'In Place umwandeln',
            selectCategory: 'Kategorie wählen:',
            placeCategories: 'Place-Kategorien:',
            categoryParking: 'Parkplatz',
            categoryGasStation: 'Tankstelle',
            categoryRestaurant: 'Restaurant',
            categoryCafe: 'Café',
            categoryHotel: 'Hotel',
            categoryHospital: 'Krankenhaus',
            categorySchool: 'Schule',
            categoryShoppingCenter: 'Einkaufszentrum',
            categorySupermarket: 'Supermarkt',
            categoryBank: 'Bank',
            categoryATM: 'Geldautomat',
            categoryPharmacy: 'Apotheke',
            categoryPostOffice: 'Postamt',
            categoryPolice: 'Polizeistation',
            categoryFireStation: 'Feuerwehr',
            categoryChurch: 'Kirche',
            categoryMosque: 'Moschee',
            categorySynagogue: 'Synagoge',
            categoryPark: 'Park',
            categoryPlayground: 'Spielplatz',
            categorySportsField: 'Sportplatz',
            categoryGym: 'Fitnessstudio',
            categorySwimmingPool: 'Schwimmbad',
            categoryTheater: 'Theater',
            categoryCinema: 'Kino',
            categoryMuseum: 'Museum',
            categoryLibrary: 'Bibliothek',
            categoryOther: 'Sonstiges',
            convertSuccess: 'Erfolgreich umgewandelt!',
            convertError: 'Fehler beim Umwandeln:',
            deleteOriginal: 'Original Map Comment löschen'
        },
        en: {
            selectShape: 'Select shape:',
            arrows: 'Arrows:',
            speechBubbles: 'Speech bubbles:',
            customShapes: 'Custom shapes:',
            size: 'Size:',
            dynamic: 'Dynamic (2 clicks)',
            radius: 'Radius:',
            commentContent: 'Comment content:',
            titlePlaceholder: 'Title (max 30 chars)',
            descPlaceholder: 'Description (optional)',
            expiresIn: 'Expires in:',
            days: 'days',
            templates: 'Templates:',
            selectTemplate: '-- Select template --',
            templateName: 'Template name',
            simplify: 'Simplify:',
            simplifyHint: 'Select a Map Comment and click Simplify',
            tolerance: 'Tolerance:',
            highQuality: 'High Quality',
            instructions: 'Instructions:',
            instrPoint: 'Point: 1 click = position',
            instrDynamicOn: 'Dynamic ON: 1st click = center, 2nd click = radius',
            instrDynamicOff: 'Dynamic OFF: 1 click = center (fixed radius)',
            // Rotate
            rotate: 'Rotate:',
            rotateHint: 'Select a Map Comment',
            angle: 'Angle:',
            rotateBtn: 'Rotate',
            rotated: 'Rotated by {angle}°',
            // Orthogonalize
            orthogonalize: 'Orthogonalize:',
            orthogonalizeHint: 'Makes angles right-angled (90°)',
            orthogonalizeBtn: 'Orthogonalize',
            orthogonalized: 'Orthogonalized!',
            // Scale/Resize
            scale: 'Scale:',
            scaleHint: 'Adjust shape size',
            width: 'Width:',
            height: 'Height:',
            scaleBtn: 'Apply',
            scaled: 'Scaled!',
            keepRatio: 'Keep aspect ratio',
            // Custom Shapes
            saveShape: 'Save shape',
            shapeName: 'Shape name',
            selectCustomShape: '-- Select custom shape --',
            noCustomShapes: 'No custom shapes',
            shapeSaved: 'Shape "{name}" saved',
            shapeDeleted: 'Shape "{name}" deleted',
            confirmDeleteShape: 'Really delete shape "{name}"?',
            enterShapeName: 'Please enter shape name!',
            customShapeLoaded: 'Custom shape loaded',
            shapePoint: 'Point',
            shapeCircle: 'Circle',
            shapeSquare: 'Square',
            shapeRectangle: 'Rectangle',
            shapeTriangle: 'Triangle',
            shapePentagon: 'Pentagon',
            shapeHexagon: 'Hexagon',
            shapeOctagon: 'Octagon',
            shapeStar: 'Star',
            shapeArrowUp: 'Arrow up',
            shapeArrowDown: 'Arrow down',
            shapeArrowLeft: 'Arrow left',
            shapeArrowRight: 'Arrow right',
            shapeSpeechRect: 'Speech bubble rect',
            shapeSpeechRound: 'Speech bubble round',
            shapeCustom: 'Custom shape',
            defaultStatus: 'Select a shape and click on the map',
            clickForCenter: 'Click for {shape} center',
            clickForPosition: 'Click for {shape} position',
            moveForSize: 'Move mouse for size, click to confirm',
            radiusDisplay: 'Radius: {radius}m - Click to confirm',
            commentCreated: 'Comment created!',
            commentCreatedId: 'Comment created! (ID: {id})',
            error: 'Error:',
            enterTemplateName: 'Please enter template name!',
            enterTitleOrDesc: 'Enter title or description!',
            templateUpdated: 'Template "{name}" updated',
            templateSaved: 'Template "{name}" saved',
            noTemplateSelected: 'No template selected!',
            templateLoaded: 'Template "{name}" loaded',
            templateDeleted: 'Template "{name}" deleted',
            confirmDelete: 'Really delete template "{name}"?',
            selectMapComment: 'Please select a Map Comment!',
            noValidPolygon: 'No valid polygon!',
            tooFewPoints: 'Too few points after simplify!',
            simplified: 'Simplified: {from} → {to} points (Save!)',
            simplifyError: 'Error simplifying:',
            preview: 'Preview: {from} → {to} points',
            before: 'Before:',
            after: 'After:',
            points: 'points',
            reduction: 'Reduction:',
            cancel: 'Cancel',
            load: 'Load',
            delete: 'Delete',
            save: 'Save',
            // Edit section
            editSection: 'Edit',
            editHint: 'First select a Map Comment on the map!',
            customShapesHint: 'Save a selected Map Comment as a reusable shape',
            simplifyTitle: 'Simplify - Reduce points',
            simplifyDesc: 'Simplifies complex shapes by removing unnecessary points',
            rotateTitle: 'Rotate shape',
            rotateDesc: 'Rotates the shape around its center',
            orthogonalizeTitle: 'Right angles',
            orthogonalizeDesc: 'Makes all angles right-angled (90°) - ideal for buildings',
            scaleTitle: 'Change size',
            scaleDesc: 'Changes width and/or height of the shape',
            previewBtn: 'Preview',
            // Image Upload
            imageUpload: 'Image to Shape:',
            imageUploadHint: 'Upload an image to detect its contour',
            selectImage: 'Select Image',
            threshold: 'Threshold:',
            minArea: 'Min. Area:',
            detectContour: 'Detect Contour',
            imageLoaded: 'Image loaded: {width}x{height}',
            contourDetected: 'Contour detected: {points} points',
            noContourFound: 'No contour found!',
            clickToPlace: 'Click on the map to place the shape',
            processing: 'Processing image...',
            invertColors: 'Invert colors',
            smoothing: 'Smoothing:',
            // Update Popup
            updateTitle: '🎉 Update v{version}',
            updateNewFeatures: 'New Features:',
            updateFeature1: '📐 Orthogonalize - Makes all angles right-angled (90°)',
            updateFeature2: '↔️ Scale - Adjust width and height independently with live preview',
            updateFeature3: '🖼️ Image to Shape - Upload an image and automatically detect its contour',
            updateFeature4: '🎨 Custom Shapes - Save Map Comments as reusable shapes',
            updateUIChanges: 'UI Improvements:',
            updateUI1: '📦 More compact interface with accordion menus',
            updateUI2: '📝 Better descriptions for all tools',
            updateUI3: '⚡ Live preview when scaling and rotating',
            updateClose: 'Got it!',
            // Converter
            converter: 'Converter:',
            converterHint: 'Convert Map Comments to Places',
            convertToPlace: 'Convert to Place',
            selectCategory: 'Select category:',
            placeCategories: 'Place Categories:',
            categoryParking: 'Parking Lot',
            categoryGasStation: 'Gas Station',
            categoryRestaurant: 'Restaurant',
            categoryCafe: 'Cafe',
            categoryHotel: 'Hotel',
            categoryHospital: 'Hospital',
            categorySchool: 'School',
            categoryShoppingCenter: 'Shopping Center',
            categorySupermarket: 'Supermarket',
            categoryBank: 'Bank',
            categoryATM: 'ATM',
            categoryPharmacy: 'Pharmacy',
            categoryPostOffice: 'Post Office',
            categoryPolice: 'Police Station',
            categoryFireStation: 'Fire Station',
            categoryChurch: 'Church',
            categoryMosque: 'Mosque',
            categorySynagogue: 'Synagogue',
            categoryPark: 'Park',
            categoryPlayground: 'Playground',
            categorySportsField: 'Sports Field',
            categoryGym: 'Gym',
            categorySwimmingPool: 'Swimming Pool',
            categoryTheater: 'Theater',
            categoryCinema: 'Cinema',
            categoryMuseum: 'Museum',
            categoryLibrary: 'Library',
            categoryOther: 'Other',
            convertSuccess: 'Converted successfully!',
            convertError: 'Error converting:',
            deleteOriginal: 'Delete original Map Comment'
        },
        it: {
            selectShape: 'Seleziona forma:',
            arrows: 'Frecce:',
            speechBubbles: 'Fumetti:',
            customShapes: 'Forme personalizzate:',
            size: 'Dimensione:',
            dynamic: 'Dinamico (2 clic)',
            radius: 'Raggio:',
            commentContent: 'Contenuto commento:',
            titlePlaceholder: 'Titolo (max 30 caratteri)',
            descPlaceholder: 'Descrizione (opzionale)',
            expiresIn: 'Scade tra:',
            days: 'giorni',
            templates: 'Modelli:',
            selectTemplate: '-- Seleziona modello --',
            templateName: 'Nome modello',
            simplify: 'Semplifica:',
            simplifyHint: 'Seleziona un Map Comment e clicca Semplifica',
            tolerance: 'Tolleranza:',
            highQuality: 'Alta qualità',
            instructions: 'Istruzioni:',
            instrPoint: 'Punto: 1 clic = posizione',
            instrDynamicOn: 'Dinamico ON: 1° clic = centro, 2° clic = raggio',
            instrDynamicOff: 'Dinamico OFF: 1 clic = centro (raggio fisso)',
            rotate: 'Ruota:',
            rotateHint: 'Seleziona un Map Comment',
            angle: 'Angolo:',
            rotateBtn: 'Ruota',
            rotated: 'Ruotato di {angle}°',
            // Orthogonalize
            orthogonalize: 'Ortogonalizza:',
            orthogonalizeHint: 'Rende gli angoli retti (90°)',
            orthogonalizeBtn: 'Ortogonalizza',
            orthogonalized: 'Ortogonalizzato!',
            // Scale/Resize
            scale: 'Scala:',
            scaleHint: 'Regola la dimensione della forma',
            width: 'Larghezza:',
            height: 'Altezza:',
            scaleBtn: 'Applica',
            scaled: 'Scalato!',
            keepRatio: 'Mantieni proporzioni',
            saveShape: 'Salva forma',
            shapeName: 'Nome forma',
            selectCustomShape: '-- Seleziona forma --',
            noCustomShapes: 'Nessuna forma personalizzata',
            shapeSaved: 'Forma "{name}" salvata',
            shapeDeleted: 'Forma "{name}" eliminata',
            confirmDeleteShape: 'Eliminare davvero la forma "{name}"?',
            enterShapeName: 'Inserisci il nome della forma!',
            customShapeLoaded: 'Forma personalizzata caricata',
            shapePoint: 'Punto',
            shapeCircle: 'Cerchio',
            shapeSquare: 'Quadrato',
            shapeRectangle: 'Rettangolo',
            shapeTriangle: 'Triangolo',
            shapePentagon: 'Pentagono',
            shapeHexagon: 'Esagono',
            shapeOctagon: 'Ottagono',
            shapeStar: 'Stella',
            shapeArrowUp: 'Freccia su',
            shapeArrowDown: 'Freccia giù',
            shapeArrowLeft: 'Freccia sinistra',
            shapeArrowRight: 'Freccia destra',
            shapeSpeechRect: 'Fumetto rettangolare',
            shapeSpeechRound: 'Fumetto rotondo',
            shapeCustom: 'Forma personalizzata',
            defaultStatus: 'Seleziona una forma e clicca sulla mappa',
            clickForCenter: 'Clicca per il centro del {shape}',
            clickForPosition: 'Clicca per la posizione del {shape}',
            moveForSize: 'Muovi il mouse per la dimensione, clicca per confermare',
            radiusDisplay: 'Raggio: {radius}m - Clicca per confermare',
            commentCreated: 'Commento creato!',
            commentCreatedId: 'Commento creato! (ID: {id})',
            error: 'Errore:',
            enterTemplateName: 'Inserisci il nome del modello!',
            enterTitleOrDesc: 'Inserisci titolo o descrizione!',
            templateUpdated: 'Modello "{name}" aggiornato',
            templateSaved: 'Modello "{name}" salvato',
            noTemplateSelected: 'Nessun modello selezionato!',
            templateLoaded: 'Modello "{name}" caricato',
            templateDeleted: 'Modello "{name}" eliminato',
            confirmDelete: 'Eliminare davvero il modello "{name}"?',
            selectMapComment: 'Seleziona un Map Comment!',
            noValidPolygon: 'Nessun poligono valido!',
            tooFewPoints: 'Troppo pochi punti dopo la semplificazione!',
            simplified: 'Semplificato: {from} → {to} punti (Salva!)',
            simplifyError: 'Errore nella semplificazione:',
            preview: 'Anteprima: {from} → {to} punti',
            before: 'Prima:',
            after: 'Dopo:',
            points: 'punti',
            reduction: 'Riduzione:',
            cancel: 'Annulla',
            load: 'Carica',
            delete: 'Elimina',
            save: 'Salva',
            // Edit section
            editSection: 'Modifica',
            editHint: 'Prima seleziona un Map Comment sulla mappa!',
            customShapesHint: 'Salva un Map Comment selezionato come forma riutilizzabile',
            simplifyTitle: 'Semplifica - Riduci punti',
            simplifyDesc: 'Semplifica forme complesse rimuovendo punti non necessari',
            rotateTitle: 'Ruota forma',
            rotateDesc: 'Ruota la forma attorno al suo centro',
            orthogonalizeTitle: 'Angoli retti',
            orthogonalizeDesc: 'Rende tutti gli angoli retti (90°) - ideale per edifici',
            scaleTitle: 'Cambia dimensione',
            scaleDesc: 'Cambia larghezza e/o altezza della forma',
            previewBtn: 'Anteprima',
            // Image Upload
            imageUpload: 'Immagine a Forma:',
            imageUploadHint: 'Carica un\'immagine per rilevare il contorno',
            selectImage: 'Seleziona Immagine',
            threshold: 'Soglia:',
            minArea: 'Area min.:',
            detectContour: 'Rileva Contorno',
            imageLoaded: 'Immagine caricata: {width}x{height}',
            contourDetected: 'Contorno rilevato: {points} punti',
            noContourFound: 'Nessun contorno trovato!',
            clickToPlace: 'Clicca sulla mappa per posizionare la forma',
            processing: 'Elaborazione immagine...',
            invertColors: 'Inverti colori',
            smoothing: 'Levigatura:',
            // Update Popup
            updateTitle: '🎉 Aggiornamento v{version}',
            updateNewFeatures: 'Nuove Funzionalità:',
            updateFeature1: '📐 Ortogonalizza - Rende tutti gli angoli retti (90°)',
            updateFeature2: '↔️ Scala - Regola larghezza e altezza indipendentemente con anteprima live',
            updateFeature3: '🖼️ Immagine a Forma - Carica un\'immagine e rileva automaticamente il contorno',
            updateFeature4: '🎨 Forme Personalizzate - Salva i Map Comment come forme riutilizzabili',
            updateUIChanges: 'Miglioramenti UI:',
            updateUI1: '📦 Interfaccia più compatta con menu a fisarmonica',
            updateUI2: '📝 Descrizioni migliori per tutti gli strumenti',
            updateUI3: '⚡ Anteprima live durante la scala e la rotazione',
            updateClose: 'Capito!',
            // Converter
            converter: 'Convertitore:',
            converterHint: 'Converti i Map Comment in Places',
            convertToPlace: 'Converti in Luogo',
            selectCategory: 'Seleziona categoria:',
            placeCategories: 'Categorie Luoghi:',
            categoryParking: 'Parcheggio',
            categoryGasStation: 'Stazione di Servizio',
            categoryRestaurant: 'Ristorante',
            categoryCafe: 'Caffè',
            categoryHotel: 'Hotel',
            categoryHospital: 'Ospedale',
            categorySchool: 'Scuola',
            categoryShoppingCenter: 'Centro Commerciale',
            categorySupermarket: 'Supermercato',
            categoryBank: 'Banca',
            categoryATM: 'Bancomat',
            categoryPharmacy: 'Farmacia',
            categoryPostOffice: 'Ufficio Postale',
            categoryPolice: 'Stazione di Polizia',
            categoryFireStation: 'Vigili del Fuoco',
            categoryChurch: 'Chiesa',
            categoryMosque: 'Moschea',
            categorySynagogue: 'Sinagoga',
            categoryPark: 'Parco',
            categoryPlayground: 'Parco Giochi',
            categorySportsField: 'Campo Sportivo',
            categoryGym: 'Palestra',
            categorySwimmingPool: 'Piscina',
            categoryTheater: 'Teatro',
            categoryCinema: 'Cinema',
            categoryMuseum: 'Museo',
            categoryLibrary: 'Biblioteca',
            categoryOther: 'Altro',
            convertSuccess: 'Convertito con successo!',
            convertError: 'Errore nella conversione:',
            deleteOriginal: 'Elimina Map Comment originale'
        },
        es: {
            selectShape: 'Seleccionar forma:',
            arrows: 'Flechas:',
            speechBubbles: 'Bocadillos:',
            customShapes: 'Formas personalizadas:',
            size: 'Tamaño:',
            dynamic: 'Dinámico (2 clics)',
            radius: 'Radio:',
            commentContent: 'Contenido del comentario:',
            titlePlaceholder: 'Título (máx 30 caracteres)',
            descPlaceholder: 'Descripción (opcional)',
            expiresIn: 'Expira en:',
            days: 'días',
            templates: 'Plantillas:',
            selectTemplate: '-- Seleccionar plantilla --',
            templateName: 'Nombre de plantilla',
            simplify: 'Simplificar:',
            simplifyHint: 'Selecciona un Map Comment y haz clic en Simplificar',
            tolerance: 'Tolerancia:',
            highQuality: 'Alta calidad',
            instructions: 'Instrucciones:',
            instrPoint: 'Punto: 1 clic = posición',
            instrDynamicOn: 'Dinámico ON: 1er clic = centro, 2do clic = radio',
            instrDynamicOff: 'Dinámico OFF: 1 clic = centro (radio fijo)',
            rotate: 'Rotar:',
            rotateHint: 'Selecciona un Map Comment',
            angle: 'Ángulo:',
            rotateBtn: 'Rotar',
            rotated: 'Rotado {angle}°',
            // Orthogonalize
            orthogonalize: 'Ortogonalizar:',
            orthogonalizeHint: 'Hace los ángulos rectos (90°)',
            orthogonalizeBtn: 'Ortogonalizar',
            orthogonalized: '¡Ortogonalizado!',
            // Scale/Resize
            scale: 'Escalar:',
            scaleHint: 'Ajustar tamaño de la forma',
            width: 'Ancho:',
            height: 'Alto:',
            scaleBtn: 'Aplicar',
            scaled: '¡Escalado!',
            keepRatio: 'Mantener proporción',
            saveShape: 'Guardar forma',
            shapeName: 'Nombre de forma',
            selectCustomShape: '-- Seleccionar forma --',
            noCustomShapes: 'Sin formas personalizadas',
            shapeSaved: 'Forma "{name}" guardada',
            shapeDeleted: 'Forma "{name}" eliminada',
            confirmDeleteShape: '¿Eliminar realmente la forma "{name}"?',
            enterShapeName: '¡Introduce el nombre de la forma!',
            customShapeLoaded: 'Forma personalizada cargada',
            shapePoint: 'Punto',
            shapeCircle: 'Círculo',
            shapeSquare: 'Cuadrado',
            shapeRectangle: 'Rectángulo',
            shapeTriangle: 'Triángulo',
            shapePentagon: 'Pentágono',
            shapeHexagon: 'Hexágono',
            shapeOctagon: 'Octágono',
            shapeStar: 'Estrella',
            shapeArrowUp: 'Flecha arriba',
            shapeArrowDown: 'Flecha abajo',
            shapeArrowLeft: 'Flecha izquierda',
            shapeArrowRight: 'Flecha derecha',
            shapeSpeechRect: 'Bocadillo rectangular',
            shapeSpeechRound: 'Bocadillo redondo',
            shapeCustom: 'Forma personalizada',
            defaultStatus: 'Selecciona una forma y haz clic en el mapa',
            clickForCenter: 'Clic para el centro del {shape}',
            clickForPosition: 'Clic para la posición del {shape}',
            moveForSize: 'Mueve el ratón para el tamaño, clic para confirmar',
            radiusDisplay: 'Radio: {radius}m - Clic para confirmar',
            commentCreated: '¡Comentario creado!',
            commentCreatedId: '¡Comentario creado! (ID: {id})',
            error: 'Error:',
            enterTemplateName: '¡Introduce el nombre de la plantilla!',
            enterTitleOrDesc: '¡Introduce título o descripción!',
            templateUpdated: 'Plantilla "{name}" actualizada',
            templateSaved: 'Plantilla "{name}" guardada',
            noTemplateSelected: '¡Ninguna plantilla seleccionada!',
            templateLoaded: 'Plantilla "{name}" cargada',
            templateDeleted: 'Plantilla "{name}" eliminada',
            confirmDelete: '¿Eliminar realmente la plantilla "{name}"?',
            selectMapComment: '¡Selecciona un Map Comment!',
            noValidPolygon: '¡No hay polígono válido!',
            tooFewPoints: '¡Muy pocos puntos después de simplificar!',
            simplified: 'Simplificado: {from} → {to} puntos (¡Guardar!)',
            simplifyError: 'Error al simplificar:',
            preview: 'Vista previa: {from} → {to} puntos',
            before: 'Antes:',
            after: 'Después:',
            points: 'puntos',
            reduction: 'Reducción:',
            cancel: 'Cancelar',
            load: 'Cargar',
            delete: 'Eliminar',
            save: 'Guardar',
            // Edit section
            editSection: 'Editar',
            editHint: '¡Primero selecciona un Map Comment en el mapa!',
            customShapesHint: 'Guarda un Map Comment seleccionado como forma reutilizable',
            simplifyTitle: 'Simplificar - Reducir puntos',
            simplifyDesc: 'Simplifica formas complejas eliminando puntos innecesarios',
            rotateTitle: 'Rotar forma',
            rotateDesc: 'Rota la forma alrededor de su centro',
            orthogonalizeTitle: 'Ángulos rectos',
            orthogonalizeDesc: 'Hace todos los ángulos rectos (90°) - ideal para edificios',
            scaleTitle: 'Cambiar tamaño',
            scaleDesc: 'Cambia ancho y/o alto de la forma',
            previewBtn: 'Vista previa',
            // Image Upload
            imageUpload: 'Imagen a Forma:',
            imageUploadHint: 'Sube una imagen para detectar su contorno',
            selectImage: 'Seleccionar Imagen',
            threshold: 'Umbral:',
            minArea: 'Área mín.:',
            detectContour: 'Detectar Contorno',
            imageLoaded: 'Imagen cargada: {width}x{height}',
            contourDetected: 'Contorno detectado: {points} puntos',
            noContourFound: '¡No se encontró contorno!',
            clickToPlace: 'Haz clic en el mapa para colocar la forma',
            processing: 'Procesando imagen...',
            invertColors: 'Invertir colores',
            smoothing: 'Suavizado:',
            // Update Popup
            updateTitle: '🎉 Actualización v{version}',
            updateNewFeatures: 'Nuevas Funciones:',
            updateFeature1: '📐 Ortogonalizar - Hace todos los ángulos rectos (90°)',
            updateFeature2: '↔️ Escalar - Ajusta ancho y alto independientemente con vista previa en vivo',
            updateFeature3: '🖼️ Imagen a Forma - Sube una imagen y detecta automáticamente su contorno',
            updateFeature4: '🎨 Formas Personalizadas - Guarda Map Comments como formas reutilizables',
            updateUIChanges: 'Mejoras de UI:',
            updateUI1: '📦 Interfaz más compacta con menús acordeón',
            updateUI2: '📝 Mejores descripciones para todas las herramientas',
            updateUI3: '⚡ Vista previa en vivo al escalar y rotar',
            updateClose: '¡Entendido!',
            // Converter
            converter: 'Convertidor:',
            converterHint: 'Convierte Map Comments a Places',
            convertToPlace: 'Convertir a Lugar',
            selectCategory: 'Seleccionar categoría:',
            placeCategories: 'Categorías de Lugares:',
            categoryParking: 'Estacionamiento',
            categoryGasStation: 'Gasolinera',
            categoryRestaurant: 'Restaurante',
            categoryCafe: 'Cafetería',
            categoryHotel: 'Hotel',
            categoryHospital: 'Hospital',
            categorySchool: 'Escuela',
            categoryShoppingCenter: 'Centro Comercial',
            categorySupermarket: 'Supermercado',
            categoryBank: 'Banco',
            categoryATM: 'Cajero Automático',
            categoryPharmacy: 'Farmacia',
            categoryPostOffice: 'Oficina de Correos',
            categoryPolice: 'Estación de Policía',
            categoryFireStation: 'Estación de Bomberos',
            categoryChurch: 'Iglesia',
            categoryMosque: 'Mezquita',
            categorySynagogue: 'Sinagoga',
            categoryPark: 'Parque',
            categoryPlayground: 'Área de Juegos',
            categorySportsField: 'Campo Deportivo',
            categoryGym: 'Gimnasio',
            categorySwimmingPool: 'Piscina',
            categoryTheater: 'Teatro',
            categoryCinema: 'Cine',
            categoryMuseum: 'Museo',
            categoryLibrary: 'Biblioteca',
            categoryOther: 'Otro',
            convertSuccess: '¡Convertido con éxito!',
            convertError: 'Error al convertir:',
            deleteOriginal: 'Eliminar Map Comment original'
        },
        fr: {
            selectShape: 'Choisir forme:',
            arrows: 'Flèches:',
            speechBubbles: 'Bulles:',
            customShapes: 'Formes personnalisées:',
            size: 'Taille:',
            dynamic: 'Dynamique (2 clics)',
            radius: 'Rayon:',
            commentContent: 'Contenu du commentaire:',
            titlePlaceholder: 'Titre (max 30 caractères)',
            descPlaceholder: 'Description (optionnel)',
            expiresIn: 'Expire dans:',
            days: 'jours',
            templates: 'Modèles:',
            selectTemplate: '-- Choisir modèle --',
            templateName: 'Nom du modèle',
            simplify: 'Simplifier:',
            simplifyHint: 'Sélectionnez un Map Comment et cliquez sur Simplifier',
            tolerance: 'Tolérance:',
            highQuality: 'Haute qualité',
            instructions: 'Instructions:',
            instrPoint: 'Point: 1 clic = position',
            instrDynamicOn: 'Dynamique ON: 1er clic = centre, 2e clic = rayon',
            instrDynamicOff: 'Dynamique OFF: 1 clic = centre (rayon fixe)',
            rotate: 'Rotation:',
            rotateHint: 'Sélectionnez un Map Comment',
            angle: 'Angle:',
            rotateBtn: 'Rotation',
            rotated: 'Pivoté de {angle}°',
            // Orthogonalize
            orthogonalize: 'Orthogonaliser:',
            orthogonalizeHint: 'Rend les angles droits (90°)',
            orthogonalizeBtn: 'Orthogonaliser',
            orthogonalized: 'Orthogonalisé!',
            // Scale/Resize
            scale: 'Échelle:',
            scaleHint: 'Ajuster la taille de la forme',
            width: 'Largeur:',
            height: 'Hauteur:',
            scaleBtn: 'Appliquer',
            scaled: 'Mis à l\'échelle!',
            keepRatio: 'Conserver les proportions',
            saveShape: 'Enregistrer forme',
            shapeName: 'Nom de forme',
            selectCustomShape: '-- Choisir forme --',
            noCustomShapes: 'Pas de formes personnalisées',
            shapeSaved: 'Forme "{name}" enregistrée',
            shapeDeleted: 'Forme "{name}" supprimée',
            confirmDeleteShape: 'Vraiment supprimer la forme "{name}"?',
            enterShapeName: 'Veuillez entrer le nom de la forme!',
            customShapeLoaded: 'Forme personnalisée chargée',
            shapePoint: 'Point',
            shapeCircle: 'Cercle',
            shapeSquare: 'Carré',
            shapeRectangle: 'Rectangle',
            shapeTriangle: 'Triangle',
            shapePentagon: 'Pentagone',
            shapeHexagon: 'Hexagone',
            shapeOctagon: 'Octogone',
            shapeStar: 'Étoile',
            shapeArrowUp: 'Flèche haut',
            shapeArrowDown: 'Flèche bas',
            shapeArrowLeft: 'Flèche gauche',
            shapeArrowRight: 'Flèche droite',
            shapeSpeechRect: 'Bulle rectangulaire',
            shapeSpeechRound: 'Bulle ronde',
            shapeCustom: 'Forme personnalisée',
            defaultStatus: 'Choisissez une forme et cliquez sur la carte',
            clickForCenter: 'Cliquez pour le centre du {shape}',
            clickForPosition: 'Cliquez pour la position du {shape}',
            moveForSize: 'Déplacez la souris pour la taille, cliquez pour confirmer',
            radiusDisplay: 'Rayon: {radius}m - Cliquez pour confirmer',
            commentCreated: 'Commentaire créé!',
            commentCreatedId: 'Commentaire créé! (ID: {id})',
            error: 'Erreur:',
            enterTemplateName: 'Veuillez entrer le nom du modèle!',
            enterTitleOrDesc: 'Entrez titre ou description!',
            templateUpdated: 'Modèle "{name}" mis à jour',
            templateSaved: 'Modèle "{name}" enregistré',
            noTemplateSelected: 'Aucun modèle sélectionné!',
            templateLoaded: 'Modèle "{name}" chargé',
            templateDeleted: 'Modèle "{name}" supprimé',
            confirmDelete: 'Vraiment supprimer le modèle "{name}"?',
            selectMapComment: 'Veuillez sélectionner un Map Comment!',
            noValidPolygon: 'Pas de polygone valide!',
            tooFewPoints: 'Trop peu de points après simplification!',
            simplified: 'Simplifié: {from} → {to} points (Enregistrer!)',
            simplifyError: 'Erreur lors de la simplification:',
            preview: 'Aperçu: {from} → {to} points',
            before: 'Avant:',
            after: 'Après:',
            points: 'points',
            reduction: 'Réduction:',
            cancel: 'Annuler',
            load: 'Charger',
            delete: 'Supprimer',
            save: 'Enregistrer',
            // Edit section
            editSection: 'Modifier',
            editHint: 'Sélectionnez d\'abord un Map Comment sur la carte!',
            customShapesHint: 'Enregistrez un Map Comment sélectionné comme forme réutilisable',
            simplifyTitle: 'Simplifier - Réduire les points',
            simplifyDesc: 'Simplifie les formes complexes en supprimant les points inutiles',
            rotateTitle: 'Rotation de forme',
            rotateDesc: 'Fait pivoter la forme autour de son centre',
            orthogonalizeTitle: 'Angles droits',
            orthogonalizeDesc: 'Rend tous les angles droits (90°) - idéal pour les bâtiments',
            scaleTitle: 'Changer la taille',
            scaleDesc: 'Change la largeur et/ou la hauteur de la forme',
            previewBtn: 'Aperçu',
            // Image Upload
            imageUpload: 'Image vers Forme:',
            imageUploadHint: 'Téléchargez une image pour détecter son contour',
            selectImage: 'Sélectionner Image',
            threshold: 'Seuil:',
            minArea: 'Surface min.:',
            detectContour: 'Détecter Contour',
            imageLoaded: 'Image chargée: {width}x{height}',
            contourDetected: 'Contour détecté: {points} points',
            noContourFound: 'Aucun contour trouvé!',
            clickToPlace: 'Cliquez sur la carte pour placer la forme',
            processing: 'Traitement de l\'image...',
            invertColors: 'Inverser les couleurs',
            smoothing: 'Lissage:',
            // Update Popup
            updateTitle: '🎉 Mise à jour v{version}',
            updateNewFeatures: 'Nouvelles Fonctionnalités:',
            updateFeature1: '📐 Orthogonaliser - Rend tous les angles droits (90°)',
            updateFeature2: '↔️ Échelle - Ajustez largeur et hauteur indépendamment avec aperçu en direct',
            updateFeature3: '🖼️ Image vers Forme - Téléchargez une image et détectez automatiquement son contour',
            updateFeature4: '🎨 Formes Personnalisées - Enregistrez les Map Comments comme formes réutilisables',
            updateUIChanges: 'Améliorations UI:',
            updateUI1: '📦 Interface plus compacte avec menus accordéon',
            updateUI2: '📝 Meilleures descriptions pour tous les outils',
            updateUI3: '⚡ Aperçu en direct lors de la mise à l\'échelle et de la rotation',
            updateClose: 'Compris!',
            // Converter
            converter: 'Convertisseur:',
            converterHint: 'Convertir les Map Comments en Places',
            convertToPlace: 'Convertir en Lieu',
            selectCategory: 'Sélectionner catégorie:',
            placeCategories: 'Catégories de Lieux:',
            categoryParking: 'Parking',
            categoryGasStation: 'Station-service',
            categoryRestaurant: 'Restaurant',
            categoryCafe: 'Café',
            categoryHotel: 'Hôtel',
            categoryHospital: 'Hôpital',
            categorySchool: 'École',
            categoryShoppingCenter: 'Centre Commercial',
            categorySupermarket: 'Supermarché',
            categoryBank: 'Banque',
            categoryATM: 'Distributeur',
            categoryPharmacy: 'Pharmacie',
            categoryPostOffice: 'Bureau de Poste',
            categoryPolice: 'Commissariat',
            categoryFireStation: 'Caserne de Pompiers',
            categoryChurch: 'Église',
            categoryMosque: 'Mosquée',
            categorySynagogue: 'Synagogue',
            categoryPark: 'Parc',
            categoryPlayground: 'Aire de Jeux',
            categorySportsField: 'Terrain de Sport',
            categoryGym: 'Salle de Sport',
            categorySwimmingPool: 'Piscine',
            categoryTheater: 'Théâtre',
            categoryCinema: 'Cinéma',
            categoryMuseum: 'Musée',
            categoryLibrary: 'Bibliothèque',
            categoryOther: 'Autre',
            convertSuccess: 'Converti avec succès!',
            convertError: 'Erreur de conversion:',
            deleteOriginal: 'Supprimer le Map Comment original'
        },
        nl: {
            selectShape: 'Kies vorm:',
            arrows: 'Pijlen:',
            speechBubbles: 'Tekstballonnen:',
            customShapes: 'Aangepaste vormen:',
            size: 'Grootte:',
            dynamic: 'Dynamisch (2 klikken)',
            radius: 'Straal:',
            commentContent: 'Commentaar inhoud:',
            titlePlaceholder: 'Titel (max 30 tekens)',
            descPlaceholder: 'Beschrijving (optioneel)',
            expiresIn: 'Verloopt over:',
            days: 'dagen',
            templates: 'Sjablonen:',
            selectTemplate: '-- Kies sjabloon --',
            templateName: 'Sjabloonnaam',
            simplify: 'Vereenvoudigen:',
            simplifyHint: 'Selecteer een Map Comment en klik op Vereenvoudigen',
            tolerance: 'Tolerantie:',
            highQuality: 'Hoge kwaliteit',
            instructions: 'Instructies:',
            instrPoint: 'Punt: 1 klik = positie',
            instrDynamicOn: 'Dynamisch AAN: 1e klik = midden, 2e klik = straal',
            instrDynamicOff: 'Dynamisch UIT: 1 klik = midden (vaste straal)',
            rotate: 'Draaien:',
            rotateHint: 'Selecteer een Map Comment',
            angle: 'Hoek:',
            rotateBtn: 'Draaien',
            rotated: 'Gedraaid met {angle}°',
            // Orthogonalize
            orthogonalize: 'Orthogonaliseren:',
            orthogonalizeHint: 'Maakt hoeken haaks (90°)',
            orthogonalizeBtn: 'Orthogonaliseren',
            orthogonalized: 'Georthogonaliseerd!',
            // Scale/Resize
            scale: 'Schalen:',
            scaleHint: 'Pas de grootte van de vorm aan',
            width: 'Breedte:',
            height: 'Hoogte:',
            scaleBtn: 'Toepassen',
            scaled: 'Geschaald!',
            keepRatio: 'Verhouding behouden',
            saveShape: 'Vorm opslaan',
            shapeName: 'Vormnaam',
            selectCustomShape: '-- Kies vorm --',
            noCustomShapes: 'Geen aangepaste vormen',
            shapeSaved: 'Vorm "{name}" opgeslagen',
            shapeDeleted: 'Vorm "{name}" verwijderd',
            confirmDeleteShape: 'Vorm "{name}" echt verwijderen?',
            enterShapeName: 'Voer vormnaam in!',
            customShapeLoaded: 'Aangepaste vorm geladen',
            shapePoint: 'Punt',
            shapeCircle: 'Cirkel',
            shapeSquare: 'Vierkant',
            shapeRectangle: 'Rechthoek',
            shapeTriangle: 'Driehoek',
            shapePentagon: 'Vijfhoek',
            shapeHexagon: 'Zeshoek',
            shapeOctagon: 'Achthoek',
            shapeStar: 'Ster',
            shapeArrowUp: 'Pijl omhoog',
            shapeArrowDown: 'Pijl omlaag',
            shapeArrowLeft: 'Pijl links',
            shapeArrowRight: 'Pijl rechts',
            shapeSpeechRect: 'Tekstballon rechthoekig',
            shapeSpeechRound: 'Tekstballon rond',
            shapeCustom: 'Aangepaste vorm',
            defaultStatus: 'Kies een vorm en klik op de kaart',
            clickForCenter: 'Klik voor {shape} middelpunt',
            clickForPosition: 'Klik voor {shape} positie',
            moveForSize: 'Beweeg muis voor grootte, klik om te bevestigen',
            radiusDisplay: 'Straal: {radius}m - Klik om te bevestigen',
            commentCreated: 'Commentaar aangemaakt!',
            commentCreatedId: 'Commentaar aangemaakt! (ID: {id})',
            error: 'Fout:',
            enterTemplateName: 'Voer sjabloonnaam in!',
            enterTitleOrDesc: 'Voer titel of beschrijving in!',
            templateUpdated: 'Sjabloon "{name}" bijgewerkt',
            templateSaved: 'Sjabloon "{name}" opgeslagen',
            noTemplateSelected: 'Geen sjabloon geselecteerd!',
            templateLoaded: 'Sjabloon "{name}" geladen',
            templateDeleted: 'Sjabloon "{name}" verwijderd',
            confirmDelete: 'Sjabloon "{name}" echt verwijderen?',
            selectMapComment: 'Selecteer een Map Comment!',
            noValidPolygon: 'Geen geldig polygoon!',
            tooFewPoints: 'Te weinig punten na vereenvoudigen!',
            simplified: 'Vereenvoudigd: {from} → {to} punten (Opslaan!)',
            simplifyError: 'Fout bij vereenvoudigen:',
            preview: 'Voorbeeld: {from} → {to} punten',
            before: 'Voor:',
            after: 'Na:',
            points: 'punten',
            reduction: 'Reductie:',
            cancel: 'Annuleren',
            load: 'Laden',
            delete: 'Verwijderen',
            save: 'Opslaan',
            // Edit section
            editSection: 'Bewerken',
            editHint: 'Selecteer eerst een Map Comment op de kaart!',
            customShapesHint: 'Sla een geselecteerde Map Comment op als herbruikbare vorm',
            simplifyTitle: 'Vereenvoudigen - Punten verminderen',
            simplifyDesc: 'Vereenvoudigt complexe vormen door onnodige punten te verwijderen',
            rotateTitle: 'Vorm draaien',
            rotateDesc: 'Draait de vorm rond het middelpunt',
            orthogonalizeTitle: 'Rechte hoeken',
            orthogonalizeDesc: 'Maakt alle hoeken recht (90°) - ideaal voor gebouwen',
            scaleTitle: 'Grootte wijzigen',
            scaleDesc: 'Wijzigt breedte en/of hoogte van de vorm',
            previewBtn: 'Voorbeeld',
            // Image Upload
            imageUpload: 'Afbeelding naar Vorm:',
            imageUploadHint: 'Upload een afbeelding om de contour te detecteren',
            selectImage: 'Selecteer Afbeelding',
            threshold: 'Drempel:',
            minArea: 'Min. Oppervlakte:',
            detectContour: 'Detecteer Contour',
            imageLoaded: 'Afbeelding geladen: {width}x{height}',
            contourDetected: 'Contour gedetecteerd: {points} punten',
            noContourFound: 'Geen contour gevonden!',
            clickToPlace: 'Klik op de kaart om de vorm te plaatsen',
            processing: 'Afbeelding verwerken...',
            invertColors: 'Kleuren inverteren',
            smoothing: 'Afvlakking:',
            // Update Popup
            updateTitle: '🎉 Update v{version}',
            updateNewFeatures: 'Nieuwe Functies:',
            updateFeature1: '📐 Orthogonaliseren - Maakt alle hoeken recht (90°)',
            updateFeature2: '↔️ Schalen - Pas breedte en hoogte onafhankelijk aan met live voorbeeld',
            updateFeature3: '🖼️ Afbeelding naar Vorm - Upload een afbeelding en detecteer automatisch de contour',
            updateFeature4: '🎨 Aangepaste Vormen - Sla Map Comments op als herbruikbare vormen',
            updateUIChanges: 'UI Verbeteringen:',
            updateUI1: '📦 Compactere interface met accordeonmenu\'s',
            updateUI2: '📝 Betere beschrijvingen voor alle tools',
            updateUI3: '⚡ Live voorbeeld bij schalen en roteren',
            updateClose: 'Begrepen!',
            // Converter
            converter: 'Converter:',
            converterHint: 'Converteer Map Comments naar Places',
            convertToPlace: 'Converteren naar Plaats',
            selectCategory: 'Selecteer categorie:',
            placeCategories: 'Plaats Categorieën:',
            categoryParking: 'Parkeerplaats',
            categoryGasStation: 'Tankstation',
            categoryRestaurant: 'Restaurant',
            categoryCafe: 'Café',
            categoryHotel: 'Hotel',
            categoryHospital: 'Ziekenhuis',
            categorySchool: 'School',
            categoryShoppingCenter: 'Winkelcentrum',
            categorySupermarket: 'Supermarkt',
            categoryBank: 'Bank',
            categoryATM: 'Geldautomaat',
            categoryPharmacy: 'Apotheek',
            categoryPostOffice: 'Postkantoor',
            categoryPolice: 'Politiebureau',
            categoryFireStation: 'Brandweerkazerne',
            categoryChurch: 'Kerk',
            categoryMosque: 'Moskee',
            categorySynagogue: 'Synagoge',
            categoryPark: 'Park',
            categoryPlayground: 'Speeltuin',
            categorySportsField: 'Sportveld',
            categoryGym: 'Sportschool',
            categorySwimmingPool: 'Zwembad',
            categoryTheater: 'Theater',
            categoryCinema: 'Bioscoop',
            categoryMuseum: 'Museum',
            categoryLibrary: 'Bibliotheek',
            categoryOther: 'Anders',
            convertSuccess: 'Succesvol geconverteerd!',
            convertError: 'Fout bij converteren:',
            deleteOriginal: 'Originele Map Comment verwijderen'
        }
    };

    let currentLang = 'en';

    function detectLanguage() {
        try {
            // WME Sprache aus I18n
            if (window.I18n?.currentLocale) {
                const locale = window.I18n.currentLocale();
                const lang = locale.split('-')[0].toLowerCase();
                if (I18N[lang]) return lang;
            }
            // Fallback: Browser-Sprache
            const browserLang = navigator.language?.split('-')[0].toLowerCase();
            if (I18N[browserLang]) return browserLang;
        } catch (e) {}
        return 'en';
    }

    function t(key, params = {}) {
        let text = I18N[currentLang]?.[key] || I18N.en[key] || key;
        for (const [k, v] of Object.entries(params)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    }

    function getShapeName(shape) {
        const shapeNames = {
            [SHAPES.POINT]: t('shapePoint'),
            [SHAPES.CIRCLE]: t('shapeCircle'),
            [SHAPES.SQUARE]: t('shapeSquare'),
            [SHAPES.RECTANGLE]: t('shapeRectangle'),
            [SHAPES.TRIANGLE]: t('shapeTriangle'),
            [SHAPES.PENTAGON]: t('shapePentagon'),
            [SHAPES.HEXAGON]: t('shapeHexagon'),
            [SHAPES.OCTAGON]: t('shapeOctagon'),
            [SHAPES.STAR]: t('shapeStar'),
            [SHAPES.ARROW_UP]: t('shapeArrowUp'),
            [SHAPES.ARROW_DOWN]: t('shapeArrowDown'),
            [SHAPES.ARROW_LEFT]: t('shapeArrowLeft'),
            [SHAPES.ARROW_RIGHT]: t('shapeArrowRight'),
            [SHAPES.SPEECH_RECT]: t('shapeSpeechRect'),
            [SHAPES.SPEECH_ROUND]: t('shapeSpeechRound')
        };
        return shapeNames[shape] || shape;
    }

    const EARTH_RADIUS = 6371000;
    const PREVIEW_LAYER = '__MCS_Preview';

    let sdk = null;
    let _settings;
    let isDrawing = false;
    let drawingMode = null;
    let drawPoints = [];
    let shapeCenter = null;
    let previewLayerCreated = false;
    let customShapeCoords = null; // Für eigene Form beim Zeichnen

    const defaultSettings = {
        defaultRadius: 50,
        defaultSubject: '',
        defaultBody: '',
        expirationDays: 30,
        dynamicSize: true,
        templates: [], // Gespeicherte Vorlagen: [{name, subject, body}]
        customShapes: [] // Eigene Formen: [{name, coords}] - coords sind normalisiert (-1 bis 1)
    };

    // ============ GEO MATH ============

    function toRadians(deg) { return deg * Math.PI / 180; }
    function toDegrees(rad) { return rad * 180 / Math.PI; }

    // Berechne Distanz zwischen zwei Punkten in Metern (Haversine)
    function distanceBetween(coord1, coord2) {
        const lon1 = toRadians(coord1[0]);
        const lat1 = toRadians(coord1[1]);
        const lon2 = toRadians(coord2[0]);
        const lat2 = toRadians(coord2[1]);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    // ============ SIMPLIFY (Douglas-Peucker + Radial Distance) ============
    // Basiert auf simplify-js von Vladimir Agafonkin (mourner)
    // Angepasst für Geo-Koordinaten mit Meter-Toleranz

    // Quadratische Distanz in Metern zwischen zwei Geo-Punkten
    function getSqDistMeters(p1, p2) {
        const avgLat = (p1[1] + p2[1]) / 2;
        const latScale = 111000; // Meter pro Grad Latitude
        const lonScale = 111000 * Math.cos(avgLat * Math.PI / 180);

        const dx = (p2[0] - p1[0]) * lonScale;
        const dy = (p2[1] - p1[1]) * latScale;

        return dx * dx + dy * dy;
    }

    // Quadratische Distanz in Metern von Punkt zu Liniensegment
    function getSqSegDistMeters(p, p1, p2) {
        const avgLat = (p1[1] + p2[1] + p[1]) / 3;
        const latScale = 111000;
        const lonScale = 111000 * Math.cos(avgLat * Math.PI / 180);

        const px = p[0] * lonScale, py = p[1] * latScale;
        const p1x = p1[0] * lonScale, p1y = p1[1] * latScale;
        const p2x = p2[0] * lonScale, p2y = p2[1] * latScale;

        let x = p1x, y = p1y;
        let dx = p2x - x, dy = p2y - y;

        if (dx !== 0 || dy !== 0) {
            const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x = p2x;
                y = p2y;
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = px - x;
        dy = py - y;
        return dx * dx + dy * dy;
    }

    // Radial Distance Simplification
    function simplifyRadialDist(points, sqToleranceMeters) {
        let prevPoint = points[0];
        const newPoints = [prevPoint];

        for (let i = 1, len = points.length; i < len; i++) {
            const point = points[i];
            if (getSqDistMeters(point, prevPoint) > sqToleranceMeters) {
                newPoints.push(point);
                prevPoint = point;
            }
        }

        if (prevPoint !== points[points.length - 1]) {
            newPoints.push(points[points.length - 1]);
        }

        return newPoints;
    }

    // Douglas-Peucker Simplification (rekursiv)
    function simplifyDPStep(points, first, last, sqToleranceMeters, simplified) {
        let maxSqDist = sqToleranceMeters;
        let index = 0;

        for (let i = first + 1; i < last; i++) {
            const sqDist = getSqSegDistMeters(points[i], points[first], points[last]);
            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqToleranceMeters) {
            if (index - first > 1) simplifyDPStep(points, first, index, sqToleranceMeters, simplified);
            simplified.push(points[index]);
            if (last - index > 1) simplifyDPStep(points, index, last, sqToleranceMeters, simplified);
        }
    }

    function simplifyDouglasPeucker(points, sqToleranceMeters) {
        const last = points.length - 1;
        const simplified = [points[0]];
        simplifyDPStep(points, 0, last, sqToleranceMeters, simplified);
        simplified.push(points[last]);
        return simplified;
    }

    // Hauptfunktion: Simplify (Toleranz in Metern)
    function simplify(points, toleranceMeters, highQuality) {
        if (points.length <= 2) return points;

        const sqToleranceMeters = toleranceMeters * toleranceMeters;

        let result = highQuality ? points : simplifyRadialDist(points, sqToleranceMeters);
        result = simplifyDouglasPeucker(result, sqToleranceMeters);

        return result;
    }

    function destinationPoint(start, distanceMeters, bearingDegrees) {
        // Sicherstellen dass alle Werte Numbers sind
        const startLon = Number(start[0]);
        const startLat = Number(start[1]);
        const dist = Number(distanceMeters);
        const bearing = Number(bearingDegrees);

        const lon1 = toRadians(startLon);
        const lat1 = toRadians(startLat);
        const bearingRad = toRadians(bearing);
        const angularDist = dist / EARTH_RADIUS;

        const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(angularDist) +
            Math.cos(lat1) * Math.sin(angularDist) * Math.cos(bearingRad)
        );
        const lon2 = lon1 + Math.atan2(
            Math.sin(bearingRad) * Math.sin(angularDist) * Math.cos(lat1),
            Math.cos(angularDist) - Math.sin(lat1) * Math.sin(lat2)
        );
        return [toDegrees(lon2), toDegrees(lat2)];
    }

    function createCircleCoords(center, radius, steps = 32) {
        const coords = [];
        for (let i = 0; i <= steps; i++) {
            coords.push(destinationPoint(center, radius, (i / steps) * 360));
        }
        return coords;
    }

    function createRegularPolygonCoords(center, radius, sides, rotationOffset = 0) {
        const coords = [];
        for (let i = 0; i <= sides; i++) {
            const angle = (i * 360 / sides) + rotationOffset - 90;
            coords.push(destinationPoint(center, radius, angle));
        }
        return coords;
    }

    // Rechteck: Breite = 1.5x Höhe
    function createRectangleCoords(center, radius) {
        const width = radius * 1.5;
        const height = radius;
        const coords = [
            destinationPoint(destinationPoint(center, height, 0), width, 90),    // Oben rechts
            destinationPoint(destinationPoint(center, height, 180), width, 90),  // Unten rechts
            destinationPoint(destinationPoint(center, height, 180), width, 270), // Unten links
            destinationPoint(destinationPoint(center, height, 0), width, 270),   // Oben links
            destinationPoint(destinationPoint(center, height, 0), width, 90)     // Zurück zum Start
        ];
        return coords;
    }

    function createStarCoords(center, outerRadius, points = 5) {
        const innerRadius = outerRadius * 0.4;
        const coords = [];
        const total = points * 2;
        // Start bei 144° (= -36° + 180°) damit Spitze nach oben zeigt
        const startAngle = 144;
        for (let i = 0; i <= total; i++) {
            const angle = startAngle + (i * 360 / total);
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            coords.push(destinationPoint(center, r, angle));
        }
        return coords;
    }

    // Pfeil-Form erstellen (Richtung: 0=hoch, 90=rechts, 180=runter, 270=links)
    function createArrowCoords(center, size, direction = 0) {
        // Pfeil-Punkte relativ (normalisiert auf 1)
        // Spitze oben, Basis unten
        const arrowPoints = [
            [0, 1],      // Spitze
            [0.4, 0.3],  // Rechte Schulter
            [0.2, 0.3],  // Rechter Schaft oben
            [0.2, -1],   // Rechter Schaft unten
            [-0.2, -1],  // Linker Schaft unten
            [-0.2, 0.3], // Linker Schaft oben
            [-0.4, 0.3], // Linke Schulter
            [0, 1]       // Zurück zur Spitze
        ];

        const coords = [];
        for (const [x, y] of arrowPoints) {
            // Rotieren
            const rad = toRadians(direction);
            const rx = x * Math.cos(rad) - y * Math.sin(rad);
            const ry = x * Math.sin(rad) + y * Math.cos(rad);

            // Bearing und Distanz berechnen
            const bearing = toDegrees(Math.atan2(rx, ry));
            const dist = Math.sqrt(rx * rx + ry * ry) * size;

            coords.push(destinationPoint(center, dist, bearing));
        }
        return coords;
    }

    // Eckige Sprechblase (Rechteck mit Spitze unten links)
    function createSpeechRectCoords(center, size) {
        const points = [
            [-1, 0.6],    // Oben links
            [1, 0.6],     // Oben rechts
            [1, -0.3],    // Unten rechts
            [-0.3, -0.3], // Vor der Spitze
            [-0.6, -1],   // Spitze
            [-0.6, -0.3], // Nach der Spitze
            [-1, -0.3],   // Unten links
            [-1, 0.6]     // Zurück
        ];

        const coords = [];
        for (const [x, y] of points) {
            const bearing = toDegrees(Math.atan2(x, y));
            const dist = Math.sqrt(x * x + y * y) * size;
            coords.push(destinationPoint(center, dist, bearing));
        }
        return coords;
    }

    // Runde Sprechblase (Ellipse mit Spitze unten links)
    function createSpeechRoundCoords(center, size) {
        const coords = [];
        const steps = 24;

        // Ellipse zeichnen (etwas breiter als hoch)
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * 360;
            const rad = toRadians(angle);

            // Ellipse: breiter (1.2) als hoch (0.8), nach oben verschoben
            const x = Math.sin(rad) * 1.0;
            const y = Math.cos(rad) * 0.7 + 0.2; // Nach oben verschieben

            const bearing = toDegrees(Math.atan2(x, y));
            const dist = Math.sqrt(x * x + y * y) * size;
            coords.push(destinationPoint(center, dist, bearing));
        }

        // Spitze einfügen (bei ca. 210° = unten links)
        const tipIndex = Math.floor(steps * 0.6); // Position für Spitze
        const tipPoint = destinationPoint(center, size * 1.3, 210); // Spitze nach unten-links

        // Spitze in die Koordinaten einfügen
        coords.splice(tipIndex, 0, tipPoint);

        return coords;
    }

    // ============ INIT ============

    function init() {
        if (typeof W === 'undefined' || !W.userscripts) {
            setTimeout(init, 500);
            return;
        }

        if (W.userscripts.state?.isReady) {
            onWmeReady();
        } else {
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    function onWmeReady() {
        console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION} - Initializing`);

        // Sprache erkennen
        currentLang = detectLanguage();
        console.log(`${SCRIPT_NAME} - Language: ${currentLang}`);

        // SDK initialisieren
        if (typeof getWmeSdk === 'function') {
            sdk = getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME });
        }

        if (!sdk) {
            console.error(`${SCRIPT_NAME} - SDK not available!`);
            return;
        }

        loadSettings();
        injectStyles();
        createPreviewLayer();
        createSidebarTab();
        checkForUpdate();

        // Selection-Event für Edit-Hint
        sdk.Events.on({
            eventName: 'wme-selection-changed',
            eventHandler: updateEditHint
        });
    }

    function updateEditHint() {
        const hint = document.getElementById('mcs-edit-hint');
        const convertHint = document.getElementById('mcs-convert-hint');
        
        const selectedComment = getSelectedMapComment();
        
        if (hint) {
            hint.style.display = selectedComment ? 'none' : 'block';
        }
        if (convertHint) {
            convertHint.style.display = selectedComment ? 'none' : 'block';
        }
    }

    // ============ UPDATE POPUP ============

    function checkForUpdate() {
        const storageKey = `${SCRIPT_ID}-lastVersion`;
        const lastVersion = localStorage.getItem(storageKey);

        if (lastVersion !== SCRIPT_VERSION) {
            showUpdatePopup();
            localStorage.setItem(storageKey, SCRIPT_VERSION);
        }
    }

    function showUpdatePopup() {
        // Popup Container
        const overlay = document.createElement('div');
        overlay.id = 'mcs-update-overlay';
        overlay.innerHTML = `
            <div class="mcs-update-popup">
                <div class="mcs-update-header">
                    <span class="mcs-update-title">${SCRIPT_NAME} - ${t('updateTitle').replace('{version}', SCRIPT_VERSION)}</span>
                    <button class="mcs-update-close" id="mcs-update-close">✕</button>
                </div>
                <div class="mcs-update-content">
                    <div class="mcs-update-section">
                        <div class="mcs-update-section-title">✨ ${t('updateNewFeatures')}</div>
                        <ul class="mcs-update-list">
                            <li>${t('updateFeature1')}</li>
                            <li>${t('updateFeature2')}</li>
                            <li>${t('updateFeature3')}</li>
                            <li>${t('updateFeature4')}</li>
                        </ul>
                    </div>
                    <div class="mcs-update-section">
                        <div class="mcs-update-section-title">🎨 ${t('updateUIChanges')}</div>
                        <ul class="mcs-update-list">
                            <li>${t('updateUI1')}</li>
                            <li>${t('updateUI2')}</li>
                            <li>${t('updateUI3')}</li>
                        </ul>
                    </div>
                </div>
                <div class="mcs-update-footer">
                    <button class="mcs-update-btn" id="mcs-update-ok">${t('updateClose')}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event Listeners
        document.getElementById('mcs-update-close').addEventListener('click', () => overlay.remove());
        document.getElementById('mcs-update-ok').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    function createPreviewLayer() {
        if (previewLayerCreated) return;

        try {
            sdk.Map.addLayer({
                layerName: PREVIEW_LAYER,
                styleRules: [{
                    predicate: () => true,
                    style: {
                        fillColor: '#4a90d9',
                        fillOpacity: 0.3,
                        strokeColor: '#357abd',
                        strokeWidth: 2,
                        strokeDashstyle: 'dash'
                    }
                }]
            });
            sdk.Map.setLayerVisibility({ layerName: PREVIEW_LAYER, visibility: true });
            previewLayerCreated = true;
            console.log(`${SCRIPT_NAME} - Preview layer created`);
        } catch (e) {
            console.warn(`${SCRIPT_NAME} - Could not create preview layer:`, e);
        }
    }

    function updatePreview(coords) {
        if (!previewLayerCreated || !coords || coords.length < 3) {
            clearPreview();
            return;
        }

        try {
            sdk.Map.removeAllFeaturesFromLayer({ layerName: PREVIEW_LAYER });

            const feature = {
                type: 'Feature',
                id: 'preview',
                geometry: {
                    type: 'Polygon',
                    coordinates: [coords]
                },
                properties: {}
            };

            sdk.Map.addFeaturesToLayer({
                layerName: PREVIEW_LAYER,
                features: [feature]
            });
        } catch (e) {
            // Ignore preview errors
        }
    }

    function clearPreview() {
        if (!previewLayerCreated) return;
        try {
            sdk.Map.removeAllFeaturesFromLayer({ layerName: PREVIEW_LAYER });
        } catch (e) {
            // Ignore
        }
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem('WME_MapCommentShapes');
            _settings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
        } catch (e) {
            _settings = { ...defaultSettings };
        }
    }

    function saveSettings() {
        try {
            _settings.defaultRadius = parseInt(document.getElementById('mcs-radius')?.value) || 50;
            _settings.defaultSubject = document.getElementById('mcs-subject')?.value || '';
            _settings.defaultBody = document.getElementById('mcs-body')?.value || '';
            _settings.expirationDays = parseInt(document.getElementById('mcs-expiration')?.value) || 30;
            _settings.dynamicSize = document.getElementById('mcs-dynamic')?.checked ?? true;
            localStorage.setItem('WME_MapCommentShapes', JSON.stringify(_settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    // ============ SIDEBAR TAB ============

    function createSidebarTab() {
        try {
            const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);

            tabLabel.innerText = '📝';
            tabLabel.title = SCRIPT_NAME;

            W.userscripts.waitForElementConnected(tabPane).then(() => {
                tabPane.innerHTML = buildTabContent();
                bindEvents();
                applySettings();
                console.log(`${SCRIPT_NAME} - Tab created`);
            });
        } catch (e) {
            console.error(`${SCRIPT_NAME} - Error creating tab:`, e);
        }
    }

    function buildTabContent() {
        return `
            <div class="mcs-container">
                <div class="mcs-header">
                    <span class="mcs-title">📝 Map Comment Shapes</span>
                    <span class="mcs-version">v${SCRIPT_VERSION}</span>
                </div>

                <!-- Status -->
                <div id="mcs-status" class="mcs-status">${t('defaultStatus')}</div>
                <div class="mcs-actions">
                    <button id="mcs-cancel" class="mcs-action-btn mcs-cancel" style="display:none;">${t('cancel')}</button>
                </div>

                <!-- Formen -->
                <div class="mcs-section">
                    <div class="mcs-label">${t('selectShape')}</div>
                    <div class="mcs-shape-grid">
                        <button class="mcs-btn" data-shape="${SHAPES.POINT}" title="${t('shapePoint')}">•</button>
                        <button class="mcs-btn" data-shape="${SHAPES.CIRCLE}" title="${t('shapeCircle')}">●</button>
                        <button class="mcs-btn" data-shape="${SHAPES.SQUARE}" title="${t('shapeSquare')}">■</button>
                        <button class="mcs-btn" data-shape="${SHAPES.RECTANGLE}" title="${t('shapeRectangle')}">▬</button>
                        <button class="mcs-btn" data-shape="${SHAPES.TRIANGLE}" title="${t('shapeTriangle')}">▲</button>
                        <button class="mcs-btn" data-shape="${SHAPES.PENTAGON}" title="${t('shapePentagon')}">⬟</button>
                        <button class="mcs-btn" data-shape="${SHAPES.HEXAGON}" title="${t('shapeHexagon')}">⬢</button>
                        <button class="mcs-btn" data-shape="${SHAPES.OCTAGON}" title="${t('shapeOctagon')}">⯃</button>
                        <button class="mcs-btn" data-shape="${SHAPES.STAR}" title="${t('shapeStar')}">★</button>
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_UP}" title="${t('shapeArrowUp')}">⬆️</button>
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_DOWN}" title="${t('shapeArrowDown')}">⬇️</button>
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_LEFT}" title="${t('shapeArrowLeft')}">⬅️</button>
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_RIGHT}" title="${t('shapeArrowRight')}">➡️</button>
                        <button class="mcs-btn" data-shape="${SHAPES.SPEECH_RECT}" title="${t('shapeSpeechRect')}">💬</button>
                        <button class="mcs-btn" data-shape="${SHAPES.SPEECH_ROUND}" title="${t('shapeSpeechRound')}">🗨️</button>
                    </div>
                    <div class="mcs-size-row">
                        <label class="mcs-checkbox"><input type="checkbox" id="mcs-dynamic" checked> ${t('dynamic')}</label>
                    </div>
                    <div id="mcs-radius-row" class="mcs-size-row" style="display:none;">
                        <label>${t('radius')}</label>
                        <input type="number" id="mcs-radius" min="5" max="1000" value="50" class="mcs-input-num"> m
                    </div>
                </div>

                <!-- Kommentar-Inhalt -->
                <details class="mcs-accordion" open>
                    <summary class="mcs-accordion-header">📝 ${t('commentContent')}</summary>
                    <div class="mcs-accordion-body">
                        <input type="text" id="mcs-subject" maxlength="30" placeholder="${t('titlePlaceholder')}" class="mcs-input">
                        <textarea id="mcs-body" rows="2" maxlength="2000" placeholder="${t('descPlaceholder')}" class="mcs-textarea"></textarea>
                        <div class="mcs-field-row">
                            <label>${t('expiresIn')}</label>
                            <input type="number" id="mcs-expiration" min="1" max="365" value="30" class="mcs-input-num"> ${t('days')}
                        </div>
                        <div class="mcs-divider"></div>
                        <div class="mcs-sublabel">📋 ${t('templates')}</div>
                        <div class="mcs-field-row">
                            <select id="mcs-template-select" class="mcs-select"><option value="">${t('selectTemplate')}</option></select>
                            <button id="mcs-template-load" class="mcs-btn-sm">📥 ${t('load')}</button>
                            <button id="mcs-template-delete" class="mcs-btn-sm mcs-btn-red">🗑️</button>
                        </div>
                        <div class="mcs-field-row">
                            <input type="text" id="mcs-template-name" placeholder="${t('templateName')}" class="mcs-input">
                            <button id="mcs-template-save" class="mcs-btn-sm mcs-btn-green">💾 ${t('save')}</button>
                        </div>
                    </div>
                </details>

                <!-- Bearbeiten -->
                <details class="mcs-accordion">
                    <summary class="mcs-accordion-header">🛠️ ${t('editSection')}</summary>
                    <div class="mcs-accordion-body">
                        <p class="mcs-hint" id="mcs-edit-hint">⚠️ ${t('editHint')}</p>

                        <div class="mcs-tool-box">
                            <div class="mcs-tool-title">✂️ ${t('simplifyTitle')}</div>
                            <div class="mcs-tool-desc">${t('simplifyDesc')}</div>
                            <div class="mcs-field-row">
                                <label>${t('tolerance')}</label>
                                <input type="range" id="mcs-simplify-tolerance" min="1" max="50" value="5" class="mcs-range">
                                <span id="mcs-tolerance-value" class="mcs-range-val">5m</span>
                            </div>
                            <div class="mcs-btn-row">
                                <button id="mcs-simplify-preview" class="mcs-btn-sm">👁️ ${t('previewBtn')}</button>
                                <button id="mcs-simplify-btn" class="mcs-btn-sm mcs-btn-blue">✂️ Simplify</button>
                            </div>
                        </div>

                        <div class="mcs-tool-box">
                            <div class="mcs-tool-title">🔄 ${t('rotate')} - ${t('rotateTitle')}</div>
                            <div class="mcs-tool-desc">${t('rotateDesc')}</div>
                            <div class="mcs-field-row">
                                <label>${t('angle')}</label>
                                <input type="range" id="mcs-rotate-angle" min="-180" max="180" value="45" class="mcs-range">
                                <span id="mcs-angle-value" class="mcs-range-val">45°</span>
                            </div>
                            <div class="mcs-btn-row">
                                <button id="mcs-rotate-btn" class="mcs-btn-sm mcs-btn-blue">🔄 ${t('rotateBtn')}</button>
                            </div>
                        </div>

                        <div class="mcs-tool-box">
                            <div class="mcs-tool-title">📐 ${t('orthogonalize')} - ${t('orthogonalizeTitle')}</div>
                            <div class="mcs-tool-desc">${t('orthogonalizeDesc')}</div>
                            <div class="mcs-btn-row">
                                <button id="mcs-orthogonalize-btn" class="mcs-btn-sm mcs-btn-blue">📐 ${t('orthogonalizeBtn')}</button>
                            </div>
                        </div>

                        <div class="mcs-tool-box">
                            <div class="mcs-tool-title">↔️ ${t('scale')} - ${t('scaleTitle')}</div>
                            <div class="mcs-tool-desc">${t('scaleDesc')}</div>
                            <div class="mcs-field-row">
                                <label>${t('width')}</label>
                                <input type="range" id="mcs-scale-width" min="10" max="500" value="100" class="mcs-range">
                                <span id="mcs-width-value" class="mcs-range-val">100%</span>
                            </div>
                            <div class="mcs-field-row">
                                <label>${t('height')}</label>
                                <input type="range" id="mcs-scale-height" min="10" max="500" value="100" class="mcs-range">
                                <span id="mcs-height-value" class="mcs-range-val">100%</span>
                            </div>
                            <div class="mcs-field-row">
                                <label class="mcs-checkbox"><input type="checkbox" id="mcs-keep-ratio" checked> ${t('keepRatio')}</label>
                            </div>
                            <div class="mcs-btn-row">
                                <button id="mcs-scale-btn" class="mcs-btn-sm mcs-btn-blue">↔️ ${t('scaleBtn')}</button>
                            </div>
                        </div>

                        <div id="mcs-simplify-info" class="mcs-result-box"></div>
                    </div>
                </details>

                <!-- Bild zu Form -->
                <details class="mcs-accordion">
                    <summary class="mcs-accordion-header">🖼️ ${t('imageUpload')}</summary>
                    <div class="mcs-accordion-body">
                        <div class="mcs-tool-desc">${t('imageUploadHint')}</div>
                        <input type="file" id="mcs-image-input" accept="image/*" style="display:none;">
                        <button id="mcs-image-select" class="mcs-btn-full">📁 ${t('selectImage')}</button>
                        <div id="mcs-image-preview-container" class="mcs-image-box" style="display:none;">
                            <canvas id="mcs-image-canvas"></canvas>
                        </div>
                        <div id="mcs-image-controls" style="display:none;">
                            <div class="mcs-field-row">
                                <label>${t('threshold')}</label>
                                <input type="range" id="mcs-image-threshold" min="1" max="255" value="128" class="mcs-range">
                                <span id="mcs-threshold-value" class="mcs-range-val">128</span>
                            </div>
                            <div class="mcs-field-row">
                                <label>${t('smoothing')}</label>
                                <input type="range" id="mcs-image-smoothing" min="0" max="10" value="2" class="mcs-range">
                                <span id="mcs-smoothing-value" class="mcs-range-val">2</span>
                            </div>
                            <div class="mcs-field-row">
                                <label>${t('minArea')}</label>
                                <input type="range" id="mcs-image-minarea" min="10" max="1000" value="100" class="mcs-range">
                                <span id="mcs-minarea-value" class="mcs-range-val">100</span>
                            </div>
                            <div class="mcs-field-row">
                                <label class="mcs-checkbox"><input type="checkbox" id="mcs-image-invert"> ${t('invertColors')}</label>
                            </div>
                            <div class="mcs-btn-row">
                                <button id="mcs-detect-contour" class="mcs-btn-sm mcs-btn-green">🔍 ${t('detectContour')}</button>
                            </div>
                            <div id="mcs-contour-info" class="mcs-result-box"></div>
                        </div>
                    </div>
                </details>

                <!-- Eigene Formen -->
                <details class="mcs-accordion">
                    <summary class="mcs-accordion-header">🎨 ${t('customShapes')}</summary>
                    <div class="mcs-accordion-body">
                        <div class="mcs-tool-desc">${t('customShapesHint')}</div>
                        <div class="mcs-field-row">
                            <select id="mcs-custom-select" class="mcs-select"><option value="">${t('selectCustomShape')}</option></select>
                            <button id="mcs-custom-use" class="mcs-btn-sm">▶️ ${t('load')}</button>
                            <button id="mcs-custom-delete" class="mcs-btn-sm mcs-btn-red">🗑️</button>
                        </div>
                        <div class="mcs-field-row">
                            <input type="text" id="mcs-custom-name" placeholder="${t('shapeName')}" class="mcs-input">
                            <button id="mcs-custom-save" class="mcs-btn-sm mcs-btn-green">💾 ${t('saveShape')}</button>
                        </div>
                    </div>
                </details>

                <!-- Konverter -->
                <details class="mcs-accordion">
                    <summary class="mcs-accordion-header">🔄 ${t('converter')}</summary>
                    <div class="mcs-accordion-body">
                        <p class="mcs-hint" id="mcs-convert-hint">⚠️ ${t('selectMapComment')}</p>
                        <div class="mcs-tool-desc">${t('converterHint')}</div>
                        
                        <div class="mcs-tool-box">
                            <div class="mcs-tool-title">📍 ${t('convertToPlace')}</div>
                            <div class="mcs-field-row">
                                <label>${t('selectCategory')}</label>
                                <select id="mcs-place-category" class="mcs-select">
                                    <option value="PARKING_LOT">${t('categoryParking')}</option>
                                    <option value="GAS_STATION">${t('categoryGasStation')}</option>
                                    <option value="RESTAURANT">${t('categoryRestaurant')}</option>
                                    <option value="CAFE">${t('categoryCafe')}</option>
                                    <option value="HOTEL">${t('categoryHotel')}</option>
                                    <option value="HOSPITAL_URGENT_CARE">${t('categoryHospital')}</option>
                                    <option value="SCHOOL">${t('categorySchool')}</option>
                                    <option value="SHOPPING_CENTER">${t('categoryShoppingCenter')}</option>
                                    <option value="SUPERMARKET_GROCERY">${t('categorySupermarket')}</option>
                                    <option value="BANK_FINANCIAL">${t('categoryBank')}</option>
                                    <option value="ATM">${t('categoryATM')}</option>
                                    <option value="PHARMACY">${t('categoryPharmacy')}</option>
                                    <option value="POST_OFFICE">${t('categoryPostOffice')}</option>
                                    <option value="POLICE_STATION">${t('categoryPolice')}</option>
                                    <option value="FIRE_DEPARTMENT">${t('categoryFireStation')}</option>
                                    <option value="CHURCH">${t('categoryChurch')}</option>
                                    <option value="MOSQUE">${t('categoryMosque')}</option>
                                    <option value="SYNAGOGUE">${t('categorySynagogue')}</option>
                                    <option value="PARK">${t('categoryPark')}</option>
                                    <option value="PLAYGROUND">${t('categoryPlayground')}</option>
                                    <option value="SPORTS_COURT">${t('categorySportsField')}</option>
                                    <option value="GYM_FITNESS">${t('categoryGym')}</option>
                                    <option value="POOL">${t('categorySwimmingPool')}</option>
                                    <option value="THEATER">${t('categoryTheater')}</option>
                                    <option value="MOVIE_THEATER">${t('categoryCinema')}</option>
                                    <option value="MUSEUM">${t('categoryMuseum')}</option>
                                    <option value="LIBRARY">${t('categoryLibrary')}</option>
                                    <option value="OTHER">${t('categoryOther')}</option>
                                </select>
                            </div>
                            <div class="mcs-field-row">
                                <label class="mcs-checkbox"><input type="checkbox" id="mcs-delete-after-place" checked> ${t('deleteOriginal')}</label>
                            </div>
                            <div class="mcs-btn-row">
                                <button id="mcs-convert-place" class="mcs-btn-sm mcs-btn-green">📍 ${t('convertToPlace')}</button>
                            </div>
                        </div>

                        <div id="mcs-convert-info" class="mcs-result-box"></div>
                    </div>
                </details>

                <!-- Hilfe -->
                <details class="mcs-accordion">
                    <summary class="mcs-accordion-header">❓ ${t('instructions')}</summary>
                    <div class="mcs-accordion-body mcs-help">
                        <div><b>${t('shapePoint')}:</b> ${t('instrPoint')}</div>
                        <div><b>Dynamic ON:</b> ${t('instrDynamicOn')}</div>
                        <div><b>Dynamic OFF:</b> ${t('instrDynamicOff')}</div>
                    </div>
                </details>
            </div>
        `;
    }

    function bindEvents() {
        document.querySelectorAll('.mcs-btn[data-shape]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const shape = btn.dataset.shape;
                startDrawing(shape);
                document.querySelectorAll('.mcs-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        document.getElementById('mcs-cancel')?.addEventListener('click', cancelDrawing);

        // Dynamic checkbox toggle
        document.getElementById('mcs-dynamic')?.addEventListener('change', (e) => {
            const radiusRow = document.getElementById('mcs-radius-row');
            if (radiusRow) {
                radiusRow.style.display = e.target.checked ? 'none' : 'flex';
            }
            saveSettings();
        });

        // Template buttons
        document.getElementById('mcs-template-save')?.addEventListener('click', saveTemplate);
        document.getElementById('mcs-template-load')?.addEventListener('click', loadTemplate);
        document.getElementById('mcs-template-delete')?.addEventListener('click', deleteTemplate);

        // Simplify buttons
        document.getElementById('mcs-simplify-btn')?.addEventListener('click', simplifySelectedComment);
        document.getElementById('mcs-simplify-preview')?.addEventListener('click', previewSimplify);
        document.getElementById('mcs-simplify-tolerance')?.addEventListener('input', (e) => {
            document.getElementById('mcs-tolerance-value').textContent = e.target.value + 'm';
        });

        // Rotate buttons
        document.getElementById('mcs-rotate-btn')?.addEventListener('click', rotateSelectedComment);
        document.getElementById('mcs-rotate-angle')?.addEventListener('input', (e) => {
            document.getElementById('mcs-angle-value').textContent = e.target.value + '°';
            // Echtzeit-Vorschau beim Slider-Bewegen
            previewRotate();
        });
        // Vorschau löschen wenn Slider losgelassen wird
        document.getElementById('mcs-rotate-angle')?.addEventListener('change', () => {
            clearPreview();
        });

        // Orthogonalize button
        document.getElementById('mcs-orthogonalize-btn')?.addEventListener('click', orthogonalizeSelectedComment);

        // Scale buttons
        document.getElementById('mcs-scale-btn')?.addEventListener('click', scaleSelectedComment);
        document.getElementById('mcs-scale-width')?.addEventListener('input', (e) => {
            document.getElementById('mcs-width-value').textContent = e.target.value + '%';
            const keepRatio = document.getElementById('mcs-keep-ratio')?.checked;
            if (keepRatio) {
                document.getElementById('mcs-scale-height').value = e.target.value;
                document.getElementById('mcs-height-value').textContent = e.target.value + '%';
            }
            previewScale();
        });
        document.getElementById('mcs-scale-height')?.addEventListener('input', (e) => {
            document.getElementById('mcs-height-value').textContent = e.target.value + '%';
            const keepRatio = document.getElementById('mcs-keep-ratio')?.checked;
            if (keepRatio) {
                document.getElementById('mcs-scale-width').value = e.target.value;
                document.getElementById('mcs-width-value').textContent = e.target.value + '%';
            }
            previewScale();
        });
        document.getElementById('mcs-scale-width')?.addEventListener('change', () => clearPreview());
        document.getElementById('mcs-scale-height')?.addEventListener('change', () => clearPreview());

        // Custom shapes buttons
        document.getElementById('mcs-custom-save')?.addEventListener('click', saveCustomShape);
        document.getElementById('mcs-custom-use')?.addEventListener('click', useCustomShape);
        document.getElementById('mcs-custom-delete')?.addEventListener('click', deleteCustomShape);

        // Image upload buttons
        document.getElementById('mcs-image-select')?.addEventListener('click', () => {
            document.getElementById('mcs-image-input')?.click();
        });
        document.getElementById('mcs-image-input')?.addEventListener('change', handleImageUpload);
        document.getElementById('mcs-detect-contour')?.addEventListener('click', detectContourFromImage);
        document.getElementById('mcs-image-threshold')?.addEventListener('input', (e) => {
            document.getElementById('mcs-threshold-value').textContent = e.target.value;
            updateImagePreview();
        });
        document.getElementById('mcs-image-smoothing')?.addEventListener('input', (e) => {
            document.getElementById('mcs-smoothing-value').textContent = e.target.value;
        });
        document.getElementById('mcs-image-minarea')?.addEventListener('input', (e) => {
            document.getElementById('mcs-minarea-value').textContent = e.target.value;
        });
        document.getElementById('mcs-image-invert')?.addEventListener('change', updateImagePreview);

        // Converter buttons
        document.getElementById('mcs-convert-place')?.addEventListener('click', convertToPlace);

        ['mcs-radius', 'mcs-subject', 'mcs-body', 'mcs-expiration'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', saveSettings);
        });
    }

    function applySettings() {
        const el = (id) => document.getElementById(id);
        if (el('mcs-radius')) el('mcs-radius').value = _settings.defaultRadius;
        if (el('mcs-subject')) el('mcs-subject').value = _settings.defaultSubject;
        if (el('mcs-body')) el('mcs-body').value = _settings.defaultBody;
        if (el('mcs-expiration')) el('mcs-expiration').value = _settings.expirationDays;
        if (el('mcs-dynamic')) {
            el('mcs-dynamic').checked = _settings.dynamicSize;
            const radiusRow = el('mcs-radius-row');
            if (radiusRow) {
                radiusRow.style.display = _settings.dynamicSize ? 'none' : 'flex';
            }
        }
        // Vorlagen-Dropdown aktualisieren
        updateTemplateDropdown();
        // Custom Shapes Dropdown aktualisieren
        updateCustomShapesDropdown();
    }

    // ============ TEMPLATES ============

    function updateTemplateDropdown() {
        const select = document.getElementById('mcs-template-select');
        if (!select) return;

        // Aktuelle Auswahl merken
        const currentValue = select.value;

        // Dropdown leeren und neu befüllen
        select.innerHTML = `<option value="">${t('selectTemplate')}</option>`;

        if (_settings.templates && _settings.templates.length > 0) {
            _settings.templates.forEach((tpl, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = tpl.name || `Template ${index + 1}`;
                select.appendChild(option);
            });
        }

        // Auswahl wiederherstellen falls möglich
        if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
            select.value = currentValue;
        }
    }

    function saveTemplate() {
        const nameInput = document.getElementById('mcs-template-name');
        const subjectInput = document.getElementById('mcs-subject');
        const bodyInput = document.getElementById('mcs-body');

        const name = nameInput?.value?.trim();
        const subject = subjectInput?.value || '';
        const body = bodyInput?.value || '';

        if (!name) {
            updateStatus('⚠️ ' + t('enterTemplateName'));
            return;
        }

        if (!subject && !body) {
            updateStatus('⚠️ ' + t('enterTitleOrDesc'));
            return;
        }

        // Prüfen ob Name schon existiert
        const existingIndex = _settings.templates.findIndex(tpl => tpl.name === name);
        if (existingIndex >= 0) {
            // Überschreiben
            _settings.templates[existingIndex] = { name, subject, body };
            updateStatus('✅ ' + t('templateUpdated', { name }));
        } else {
            // Neu hinzufügen
            _settings.templates.push({ name, subject, body });
            updateStatus('✅ ' + t('templateSaved', { name }));
        }

        // Speichern und UI aktualisieren
        localStorage.setItem('WME_MapCommentShapes', JSON.stringify(_settings));
        updateTemplateDropdown();

        // Name-Feld leeren
        if (nameInput) nameInput.value = '';
    }

    function loadTemplate() {
        const select = document.getElementById('mcs-template-select');
        const index = parseInt(select?.value);

        if (isNaN(index) || !_settings.templates[index]) {
            updateStatus('⚠️ ' + t('noTemplateSelected'));
            return;
        }

        const tpl = _settings.templates[index];
        const subjectInput = document.getElementById('mcs-subject');
        const bodyInput = document.getElementById('mcs-body');

        if (subjectInput) subjectInput.value = tpl.subject || '';
        if (bodyInput) bodyInput.value = tpl.body || '';

        updateStatus('📋 ' + t('templateLoaded', { name: tpl.name }));
    }

    function deleteTemplate() {
        const select = document.getElementById('mcs-template-select');
        const index = parseInt(select?.value);

        if (isNaN(index) || !_settings.templates[index]) {
            updateStatus('⚠️ ' + t('noTemplateSelected'));
            return;
        }

        const name = _settings.templates[index].name;

        if (confirm(t('confirmDelete', { name }))) {
            _settings.templates.splice(index, 1);
            localStorage.setItem('WME_MapCommentShapes', JSON.stringify(_settings));
            updateTemplateDropdown();
            updateStatus('🗑️ ' + t('templateDeleted', { name }));
        }
    }

    // ============ SIMPLIFY ============

    function getSelectedMapComment() {
        try {
            // Versuche über Selection API
            const selection = W.selectionManager?.getSelectedDataModelObjects?.();
            if (selection && selection.length > 0) {
                const selected = selection[0];
                if (selected.type === 'mapComment' || selected.CLASS_NAME?.includes('MapComment')) {
                    return selected;
                }
            }

            // Alternative: über W.model
            const selectedItems = W.selectionManager?.getSelectedFeatures?.();
            if (selectedItems && selectedItems.length > 0) {
                const feature = selectedItems[0];
                if (feature.model?.type === 'mapComment') {
                    return feature.model;
                }
            }

            return null;
        } catch (e) {
            console.warn(`${SCRIPT_NAME} - Error getting selected comment:`, e);
            return null;
        }
    }

    function getCommentGeometry(comment) {
        try {
            // OL Geometry zuerst versuchen (gibt Mercator-Koordinaten)
            let olGeom = null;
            if (comment.getOLGeometry) {
                olGeom = comment.getOLGeometry();
            } else if (comment.geometry && comment.geometry.CLASS_NAME) {
                olGeom = comment.geometry;
            }

            if (olGeom && olGeom.getVertices) {
                // OpenLayers Polygon - Vertices extrahieren
                const vertices = olGeom.getVertices();
                if (vertices && vertices.length > 0) {
                    // Mercator zu WGS84 konvertieren
                    const wgs84Coords = vertices.map(v => mercatorToWgs84(v.x, v.y));
                    // Polygon schließen
                    if (wgs84Coords.length > 0) {
                        wgs84Coords.push(wgs84Coords[0]);
                    }
                    return [wgs84Coords];
                }
            }

            // GeoJSON Format versuchen
            if (comment.getGeometry) {
                const geom = comment.getGeometry();
                if (geom?.coordinates) return geom.coordinates;
            }
            if (comment.geometry?.coordinates) {
                return comment.geometry.coordinates;
            }
            if (comment.attributes?.geometry?.coordinates) {
                return comment.attributes.geometry.coordinates;
            }

            return null;
        } catch (e) {
            console.warn(`${SCRIPT_NAME} - Error getting geometry:`, e);
            return null;
        }
    }

    // Mercator (EPSG:3857) zu WGS84 (EPSG:4326)
    function mercatorToWgs84(x, y) {
        const lon = (x / 20037508.34) * 180;
        let lat = (y / 20037508.34) * 180;
        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
        return [lon, lat];
    }

    // WGS84 (EPSG:4326) zu Mercator (EPSG:3857)
    function wgs84ToMercator(lon, lat) {
        const x = lon * 20037508.34 / 180;
        let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        return [x, y];
    }

    function updateSimplifyInfo(original, simplified) {
        const infoEl = document.getElementById('mcs-simplify-info');
        if (!infoEl) return;

        const reduction = ((1 - simplified.length / original.length) * 100).toFixed(1);
        infoEl.innerHTML = `
            <span class="mcs-info-item">${t('before')} <b>${original.length}</b> ${t('points')}</span>
            <span class="mcs-info-item">${t('after')} <b>${simplified.length}</b> ${t('points')}</span>
            <span class="mcs-info-item mcs-reduction">${t('reduction')} <b>${reduction}%</b></span>
        `;
    }

    function previewSimplify() {
        const comment = getSelectedMapComment();
        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 4) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        const tolerance = parseInt(document.getElementById('mcs-simplify-tolerance')?.value) || 5;
        const highQuality = document.getElementById('mcs-simplify-hq')?.checked ?? true;

        const originalCoords = coords[0];
        const simplifiedCoords = simplify(originalCoords, tolerance, highQuality);

        // Polygon schließen falls nötig
        if (simplifiedCoords.length > 0 &&
            (simplifiedCoords[0][0] !== simplifiedCoords[simplifiedCoords.length-1][0] ||
             simplifiedCoords[0][1] !== simplifiedCoords[simplifiedCoords.length-1][1])) {
            simplifiedCoords.push(simplifiedCoords[0]);
        }

        updateSimplifyInfo(originalCoords, simplifiedCoords);
        updatePreview(simplifiedCoords);
        updateStatus('👁️ ' + t('preview', { from: originalCoords.length, to: simplifiedCoords.length }));
    }

    function simplifySelectedComment() {
        const comment = getSelectedMapComment();
        console.log(`${SCRIPT_NAME} - DEBUG: Selected comment:`, comment);

        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        console.log(`${SCRIPT_NAME} - DEBUG: Comment type:`, comment.type, comment.CLASS_NAME);
        console.log(`${SCRIPT_NAME} - DEBUG: Comment attributes:`, comment.attributes);

        const coords = getCommentGeometry(comment);
        console.log(`${SCRIPT_NAME} - DEBUG: Geometry coords:`, coords);

        if (!coords || !coords[0] || coords[0].length < 4) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        const tolerance = parseInt(document.getElementById('mcs-simplify-tolerance')?.value) || 5;
        const highQuality = document.getElementById('mcs-simplify-hq')?.checked ?? true;

        const originalCoords = coords[0];
        const simplifiedCoords = simplify(originalCoords, tolerance, highQuality);

        console.log(`${SCRIPT_NAME} - DEBUG: Original coords sample:`, originalCoords.slice(0, 3));
        console.log(`${SCRIPT_NAME} - DEBUG: Simplified coords sample:`, simplifiedCoords.slice(0, 3));

        // Mindestens 3 Punkte + Schlusspunkt
        if (simplifiedCoords.length < 4) {
            updateStatus('⚠️ ' + t('tooFewPoints'));
            return;
        }

        // Polygon schließen falls nötig
        if (simplifiedCoords[0][0] !== simplifiedCoords[simplifiedCoords.length-1][0] ||
            simplifiedCoords[0][1] !== simplifiedCoords[simplifiedCoords.length-1][1]) {
            simplifiedCoords.push(simplifiedCoords[0]);
        }

        try {
            // WME erwartet OpenLayers Geometry in Mercator (EPSG:3857)

            // Alte Geometrie für Undo speichern
            const originalOLGeometry = comment.getOLGeometry().clone();

            // Konvertiere WGS84 (lon/lat) zu Mercator und erstelle OL Points
            const mercatorCoords = simplifiedCoords.map(coord => {
                const [x, y] = wgs84ToMercator(coord[0], coord[1]);
                return new OpenLayers.Geometry.Point(x, y);
            });

            console.log(`${SCRIPT_NAME} - DEBUG: Mercator coords sample:`, mercatorCoords.slice(0, 2).map(p => ({x: p.x, y: p.y})));

            // Neues Polygon erstellen
            const ring = new OpenLayers.Geometry.LinearRing(mercatorCoords);
            const newOLGeometry = new OpenLayers.Geometry.Polygon([ring]);

            console.log(`${SCRIPT_NAME} - DEBUG: New OL Geometry:`, newOLGeometry);

            // UpdateFeatureGeometry Action verwenden damit WME die Änderung erkennt
            const UpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
            const oldGeoJSON = W.userscripts.toGeoJSONGeometry(originalOLGeometry);
            const newGeoJSON = W.userscripts.toGeoJSONGeometry(newOLGeometry);

            W.model.actionManager.add(new UpdateFeatureGeometry(comment, W.model.mapComments, oldGeoJSON, newGeoJSON));

            clearPreview();
            updateSimplifyInfo(originalCoords, simplifiedCoords);
            updateStatus('✅ ' + t('simplified', { from: originalCoords.length, to: simplifiedCoords.length }));
            console.log(`${SCRIPT_NAME} - Simplified: ${originalCoords.length} → ${simplifiedCoords.length} points`);

            // Status nach 3 Sekunden zurücksetzen
            setTimeout(() => updateStatus(t('defaultStatus')), 3000);

        } catch (e) {
            console.error(`${SCRIPT_NAME} - Simplify error:`, e);
            console.error(`${SCRIPT_NAME} - Error stack:`, e.stack);
            updateStatus('❌ ' + t('simplifyError') + ' ' + e.message);
        }
    }

    // ============ ROTATE ============

    function rotatePoint(point, center, angleDeg) {
        const angleRad = toRadians(angleDeg);

        // Konvertiere zu lokalen Koordinaten (Meter)
        const avgLat = center[1];
        const lonScale = 111000 * Math.cos(toRadians(avgLat));
        const latScale = 111000;

        const dx = (point[0] - center[0]) * lonScale;
        const dy = (point[1] - center[1]) * latScale;

        // Rotieren
        const rx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
        const ry = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

        // Zurück zu Geo-Koordinaten
        return [
            center[0] + rx / lonScale,
            center[1] + ry / latScale
        ];
    }

    function getPolygonCenter(coords) {
        let sumLon = 0, sumLat = 0;
        const n = coords.length - 1; // Letzter Punkt = erster Punkt
        for (let i = 0; i < n; i++) {
            sumLon += coords[i][0];
            sumLat += coords[i][1];
        }
        return [sumLon / n, sumLat / n];
    }

    function rotateCoords(coords, angleDeg) {
        const center = getPolygonCenter(coords);
        return coords.map(coord => rotatePoint(coord, center, angleDeg));
    }

    function previewRotate() {
        const comment = getSelectedMapComment();
        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 4) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        const angle = parseInt(document.getElementById('mcs-rotate-angle')?.value) || 45;
        const rotatedCoords = rotateCoords(coords[0], angle);

        updatePreview(rotatedCoords);
        updateStatus('👁️ ' + t('rotated', { angle }));
    }

    function rotateSelectedComment() {
        const comment = getSelectedMapComment();
        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 4) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        const angle = parseInt(document.getElementById('mcs-rotate-angle')?.value) || 45;
        const rotatedCoords = rotateCoords(coords[0], angle);

        try {
            // Alte Geometrie für Undo speichern
            const originalOLGeometry = comment.getOLGeometry().clone();

            // Konvertiere zu Mercator und erstelle OL Geometry
            const mercatorCoords = rotatedCoords.map(coord => {
                const [x, y] = wgs84ToMercator(coord[0], coord[1]);
                return new OpenLayers.Geometry.Point(x, y);
            });

            const ring = new OpenLayers.Geometry.LinearRing(mercatorCoords);
            const newOLGeometry = new OpenLayers.Geometry.Polygon([ring]);

            // UpdateFeatureGeometry Action verwenden damit WME die Änderung erkennt
            const UpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
            const oldGeoJSON = W.userscripts.toGeoJSONGeometry(originalOLGeometry);
            const newGeoJSON = W.userscripts.toGeoJSONGeometry(newOLGeometry);

            W.model.actionManager.add(new UpdateFeatureGeometry(comment, W.model.mapComments, oldGeoJSON, newGeoJSON));

            clearPreview();
            updateStatus('✅ ' + t('rotated', { angle }));
            console.log(`${SCRIPT_NAME} - Rotated by ${angle}°`);

            // Status nach 3 Sekunden zurücksetzen
            setTimeout(() => updateStatus(t('defaultStatus')), 3000);

        } catch (e) {
            console.error(`${SCRIPT_NAME} - Rotate error:`, e);
            updateStatus('❌ ' + t('error') + ' ' + e.message);
        }
    }

    // ============ ORTHOGONALIZE ============

    function orthogonalizeSelectedComment() {
        const comment = getSelectedMapComment();
        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 4) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        const orthogonalizedCoords = orthogonalizeCoords(coords[0]);

        try {
            const originalOLGeometry = comment.getOLGeometry().clone();

            const mercatorCoords = orthogonalizedCoords.map(coord => {
                const [x, y] = wgs84ToMercator(coord[0], coord[1]);
                return new OpenLayers.Geometry.Point(x, y);
            });

            const ring = new OpenLayers.Geometry.LinearRing(mercatorCoords);
            const newOLGeometry = new OpenLayers.Geometry.Polygon([ring]);

            const UpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
            const oldGeoJSON = W.userscripts.toGeoJSONGeometry(originalOLGeometry);
            const newGeoJSON = W.userscripts.toGeoJSONGeometry(newOLGeometry);

            W.model.actionManager.add(new UpdateFeatureGeometry(comment, W.model.mapComments, oldGeoJSON, newGeoJSON));

            clearPreview();
            updateStatus('✅ ' + t('orthogonalized'));
            console.log(`${SCRIPT_NAME} - Orthogonalized`);

            // Status nach 3 Sekunden zurücksetzen
            setTimeout(() => updateStatus(t('defaultStatus')), 3000);

        } catch (e) {
            console.error(`${SCRIPT_NAME} - Orthogonalize error:`, e);
            updateStatus('❌ ' + t('error') + ' ' + e.message);
        }
    }

    function orthogonalizeCoords(coords) {
        // Orthogonalisierung: Macht Winkel möglichst rechtwinklig (90°)
        // Basiert auf dem Algorithmus von JOSM/iD Editor

        const center = getPolygonCenter(coords);
        const avgLat = center[1];
        const lonScale = 111000 * Math.cos(toRadians(avgLat));
        const latScale = 111000;

        // Konvertiere zu lokalen Koordinaten (Meter)
        const localCoords = coords.map(coord => [
            (coord[0] - center[0]) * lonScale,
            (coord[1] - center[1]) * latScale
        ]);

        // Finde die dominante Ausrichtung (Hauptachse)
        let totalAngle = 0;
        let count = 0;
        for (let i = 0; i < localCoords.length - 1; i++) {
            const dx = localCoords[i + 1][0] - localCoords[i][0];
            const dy = localCoords[i + 1][1] - localCoords[i][1];
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                let angle = Math.atan2(dy, dx);
                // Normalisiere auf 0-90° Bereich
                while (angle < 0) angle += Math.PI / 2;
                while (angle >= Math.PI / 2) angle -= Math.PI / 2;
                totalAngle += angle;
                count++;
            }
        }
        const dominantAngle = count > 0 ? totalAngle / count : 0;

        // Orthogonalisiere jeden Punkt
        const orthogonalized = [];
        for (let i = 0; i < localCoords.length - 1; i++) {
            const curr = localCoords[i];
            const next = localCoords[(i + 1) % (localCoords.length - 1)];

            const dx = next[0] - curr[0];
            const dy = next[1] - curr[1];
            const length = Math.sqrt(dx * dx + dy * dy);

            if (length < 0.1) {
                orthogonalized.push(curr);
                continue;
            }

            // Bestimme ob diese Kante horizontal oder vertikal sein sollte
            let edgeAngle = Math.atan2(dy, dx);

            // Runde auf nächstes 90°-Vielfaches relativ zur dominanten Ausrichtung
            const relativeAngle = edgeAngle - dominantAngle;
            const snappedRelative = Math.round(relativeAngle / (Math.PI / 2)) * (Math.PI / 2);
            const snappedAngle = dominantAngle + snappedRelative;

            if (i === 0) {
                orthogonalized.push(curr);
            }

            // Berechne neuen Endpunkt
            const newNext = [
                curr[0] + Math.cos(snappedAngle) * length,
                curr[1] + Math.sin(snappedAngle) * length
            ];
            orthogonalized.push(newNext);
        }

        // Schließe das Polygon
        if (orthogonalized.length > 0) {
            orthogonalized.push(orthogonalized[0]);
        }

        // Konvertiere zurück zu Geo-Koordinaten
        return orthogonalized.map(([x, y]) => [
            center[0] + x / lonScale,
            center[1] + y / latScale
        ]);
    }

    // ============ SCALE ============

    function scaleCoords(coords, scaleX, scaleY) {
        const center = getPolygonCenter(coords);
        const avgLat = center[1];
        const lonScale = 111000 * Math.cos(toRadians(avgLat));
        const latScale = 111000;

        return coords.map(coord => {
            const dx = (coord[0] - center[0]) * lonScale;
            const dy = (coord[1] - center[1]) * latScale;

            const scaledX = dx * scaleX;
            const scaledY = dy * scaleY;

            return [
                center[0] + scaledX / lonScale,
                center[1] + scaledY / latScale
            ];
        });
    }

    function previewScale() {
        const comment = getSelectedMapComment();
        if (!comment) return;

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 4) return;

        const scaleX = (parseInt(document.getElementById('mcs-scale-width')?.value) || 100) / 100;
        const scaleY = (parseInt(document.getElementById('mcs-scale-height')?.value) || 100) / 100;

        const scaledCoords = scaleCoords(coords[0], scaleX, scaleY);
        updatePreview(scaledCoords);
    }

    function scaleSelectedComment() {
        const comment = getSelectedMapComment();
        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 4) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        const scaleX = (parseInt(document.getElementById('mcs-scale-width')?.value) || 100) / 100;
        const scaleY = (parseInt(document.getElementById('mcs-scale-height')?.value) || 100) / 100;

        const scaledCoords = scaleCoords(coords[0], scaleX, scaleY);

        try {
            const originalOLGeometry = comment.getOLGeometry().clone();

            const mercatorCoords = scaledCoords.map(coord => {
                const [x, y] = wgs84ToMercator(coord[0], coord[1]);
                return new OpenLayers.Geometry.Point(x, y);
            });

            const ring = new OpenLayers.Geometry.LinearRing(mercatorCoords);
            const newOLGeometry = new OpenLayers.Geometry.Polygon([ring]);

            const UpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
            const oldGeoJSON = W.userscripts.toGeoJSONGeometry(originalOLGeometry);
            const newGeoJSON = W.userscripts.toGeoJSONGeometry(newOLGeometry);

            W.model.actionManager.add(new UpdateFeatureGeometry(comment, W.model.mapComments, oldGeoJSON, newGeoJSON));

            clearPreview();

            // Reset sliders
            document.getElementById('mcs-scale-width').value = 100;
            document.getElementById('mcs-scale-height').value = 100;
            document.getElementById('mcs-width-value').textContent = '100%';
            document.getElementById('mcs-height-value').textContent = '100%';

            updateStatus('✅ ' + t('scaled'));
            console.log(`${SCRIPT_NAME} - Scaled: ${scaleX * 100}% x ${scaleY * 100}%`);

            // Status nach 3 Sekunden zurücksetzen
            setTimeout(() => updateStatus(t('defaultStatus')), 3000);

        } catch (e) {
            console.error(`${SCRIPT_NAME} - Scale error:`, e);
            updateStatus('❌ ' + t('error') + ' ' + e.message);
        }
    }

    // ============ IMAGE TO SHAPE ============

    let uploadedImageData = null;
    let detectedContourCoords = null;

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        updateStatus(t('processing'));

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.getElementById('mcs-image-canvas');
                const ctx = canvas.getContext('2d');

                // Skaliere das Bild auf max 300px für die Vorschau
                const maxSize = 300;
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                uploadedImageData = {
                    width: width,
                    height: height,
                    originalWidth: img.width,
                    originalHeight: img.height
                };

                // Zeige Vorschau und Steuerelemente
                document.getElementById('mcs-image-preview-container').style.display = 'block';
                document.getElementById('mcs-image-controls').style.display = 'block';

                updateStatus(t('imageLoaded', { width: img.width, height: img.height }));
                updateImagePreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function updateImagePreview() {
        if (!uploadedImageData) return;

        const canvas = document.getElementById('mcs-image-canvas');
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const threshold = parseInt(document.getElementById('mcs-image-threshold')?.value) || 128;
        const invert = document.getElementById('mcs-image-invert')?.checked || false;

        // Erstelle eine Kopie für die Vorschau mit Schwellwert-Anzeige
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = canvas.width;
        previewCanvas.height = canvas.height;
        const previewCtx = previewCanvas.getContext('2d');
        const previewData = previewCtx.createImageData(canvas.width, canvas.height);

        for (let i = 0; i < data.length; i += 4) {
            // Grauwert berechnen
            const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            let isWhite = gray > threshold;
            if (invert) isWhite = !isWhite;

            const val = isWhite ? 255 : 0;
            previewData.data[i] = val;
            previewData.data[i + 1] = val;
            previewData.data[i + 2] = val;
            previewData.data[i + 3] = 255;
        }

        // Zeige die Schwellwert-Vorschau
        ctx.putImageData(previewData, 0, 0);
    }

    function detectContourFromImage() {
        if (!uploadedImageData) {
            updateStatus('⚠️ ' + t('selectImage'));
            return;
        }

        const canvas = document.getElementById('mcs-image-canvas');
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const threshold = parseInt(document.getElementById('mcs-image-threshold')?.value) || 128;
        const minArea = parseInt(document.getElementById('mcs-image-minarea')?.value) || 100;
        const smoothing = parseInt(document.getElementById('mcs-image-smoothing')?.value) || 2;
        const invert = document.getElementById('mcs-image-invert')?.checked || false;

        // Konvertiere zu Binärbild
        const binary = createBinaryImage(imageData, threshold, invert);

        // Finde Konturen mit Marching Squares
        const contours = findContours(binary, canvas.width, canvas.height, minArea);

        if (contours.length === 0) {
            updateStatus('⚠️ ' + t('noContourFound'));
            return;
        }

        // Nimm die größte Kontur
        let largestContour = contours[0];
        for (const contour of contours) {
            if (contour.length > largestContour.length) {
                largestContour = contour;
            }
        }

        // Glätte die Kontur
        let smoothedContour = smoothContour(largestContour, smoothing);

        // Vereinfache die Kontur
        const tolerance = Math.max(1, canvas.width / 100);
        smoothedContour = simplifyContour(smoothedContour, tolerance);

        // Normalisiere auf -1 bis 1
        const normalizedCoords = normalizeImageContour(smoothedContour, canvas.width, canvas.height);

        if (normalizedCoords.length < 3) {
            updateStatus('⚠️ ' + t('noContourFound'));
            return;
        }

        // Schließe das Polygon
        if (normalizedCoords[0][0] !== normalizedCoords[normalizedCoords.length - 1][0] ||
            normalizedCoords[0][1] !== normalizedCoords[normalizedCoords.length - 1][1]) {
            normalizedCoords.push(normalizedCoords[0]);
        }

        detectedContourCoords = normalizedCoords;

        // Zeichne die erkannte Kontur auf das Canvas
        drawContourOnCanvas(smoothedContour);

        // Zeige Info
        const infoEl = document.getElementById('mcs-contour-info');
        if (infoEl) {
            infoEl.innerHTML = `✅ ${t('contourDetected', { points: normalizedCoords.length })}<br>
                               <small>${t('clickToPlace')}</small>`;
        }

        updateStatus(t('clickToPlace'));

        // Starte Platzierungsmodus
        startImageShapePlacement();
    }

    function createBinaryImage(imageData, threshold, invert) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const binary = new Uint8Array(width * height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                let isObject = gray <= threshold;
                if (invert) isObject = !isObject;
                binary[y * width + x] = isObject ? 1 : 0;
            }
        }

        return binary;
    }

    function findContours(binary, width, height, minArea) {
        const contours = [];
        const visited = new Uint8Array(width * height);

        // Einfacher Kontur-Finder: Suche Kanten zwischen 0 und 1
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                if (binary[idx] === 1 && !visited[idx]) {
                    // Prüfe ob es eine Kante ist (Nachbar ist 0)
                    const isEdge =
                        binary[idx - 1] === 0 || binary[idx + 1] === 0 ||
                        binary[idx - width] === 0 || binary[idx + width] === 0;

                    if (isEdge) {
                        const contour = traceContour(binary, visited, x, y, width, height);
                        if (contour.length >= minArea / 10) {
                            contours.push(contour);
                        }
                    }
                }
            }
        }

        return contours;
    }

    function traceContour(binary, visited, startX, startY, width, height) {
        const contour = [];
        const directions = [
            [1, 0], [1, 1], [0, 1], [-1, 1],
            [-1, 0], [-1, -1], [0, -1], [1, -1]
        ];

        let x = startX;
        let y = startY;
        let dir = 0;
        let steps = 0;
        const maxSteps = width * height;

        do {
            const idx = y * width + x;
            if (!visited[idx]) {
                contour.push([x, y]);
                visited[idx] = 1;
            }

            // Suche nächsten Kantenpunkt
            let found = false;
            for (let i = 0; i < 8; i++) {
                const newDir = (dir + i) % 8;
                const nx = x + directions[newDir][0];
                const ny = y + directions[newDir][1];

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nidx = ny * width + nx;
                    if (binary[nidx] === 1) {
                        // Prüfe ob es eine Kante ist
                        const isEdge =
                            (nx > 0 && binary[nidx - 1] === 0) ||
                            (nx < width - 1 && binary[nidx + 1] === 0) ||
                            (ny > 0 && binary[nidx - width] === 0) ||
                            (ny < height - 1 && binary[nidx + width] === 0);

                        if (isEdge && !visited[nidx]) {
                            x = nx;
                            y = ny;
                            dir = (newDir + 5) % 8; // Rückwärts starten
                            found = true;
                            break;
                        }
                    }
                }
            }

            if (!found) break;
            steps++;
        } while (steps < maxSteps && (x !== startX || y !== startY || contour.length < 3));

        return contour;
    }

    function smoothContour(contour, iterations) {
        if (iterations <= 0 || contour.length < 3) return contour;

        let result = contour;
        for (let iter = 0; iter < iterations; iter++) {
            const smoothed = [];
            for (let i = 0; i < result.length; i++) {
                const prev = result[(i - 1 + result.length) % result.length];
                const curr = result[i];
                const next = result[(i + 1) % result.length];

                smoothed.push([
                    (prev[0] + curr[0] * 2 + next[0]) / 4,
                    (prev[1] + curr[1] * 2 + next[1]) / 4
                ]);
            }
            result = smoothed;
        }
        return result;
    }

    function simplifyContour(contour, tolerance) {
        // Douglas-Peucker für Pixel-Koordinaten
        if (contour.length < 3) return contour;

        const sqTolerance = tolerance * tolerance;

        function getSqDist(p1, p2) {
            const dx = p1[0] - p2[0];
            const dy = p1[1] - p2[1];
            return dx * dx + dy * dy;
        }

        function getSqSegDist(p, p1, p2) {
            let x = p1[0], y = p1[1];
            let dx = p2[0] - x, dy = p2[1] - y;

            if (dx !== 0 || dy !== 0) {
                const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
                if (t > 1) { x = p2[0]; y = p2[1]; }
                else if (t > 0) { x += dx * t; y += dy * t; }
            }

            dx = p[0] - x;
            dy = p[1] - y;
            return dx * dx + dy * dy;
        }

        function simplifyDPStep(points, first, last, sqTol, simplified) {
            let maxSqDist = sqTol;
            let index = 0;

            for (let i = first + 1; i < last; i++) {
                const sqDist = getSqSegDist(points[i], points[first], points[last]);
                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }

            if (maxSqDist > sqTol) {
                if (index - first > 1) simplifyDPStep(points, first, index, sqTol, simplified);
                simplified.push(points[index]);
                if (last - index > 1) simplifyDPStep(points, index, last, sqTol, simplified);
            }
        }

        const last = contour.length - 1;
        const simplified = [contour[0]];
        simplifyDPStep(contour, 0, last, sqTolerance, simplified);
        simplified.push(contour[last]);

        return simplified;
    }

    function normalizeImageContour(contour, width, height) {
        // Finde Bounding Box
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const [x, y] of contour) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const size = Math.max(maxX - minX, maxY - minY);

        if (size === 0) return [];

        // Normalisiere auf -1 bis 1
        return contour.map(([x, y]) => [
            (x - centerX) / (size / 2),
            -(y - centerY) / (size / 2) // Y invertieren (Bild-Y ist umgekehrt)
        ]);
    }

    function drawContourOnCanvas(contour) {
        const canvas = document.getElementById('mcs-image-canvas');
        const ctx = canvas.getContext('2d');

        // Zeichne die Kontur in Rot
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();

        if (contour.length > 0) {
            ctx.moveTo(contour[0][0], contour[0][1]);
            for (let i = 1; i < contour.length; i++) {
                ctx.lineTo(contour[i][0], contour[i][1]);
            }
            ctx.closePath();
        }

        ctx.stroke();

        // Zeichne Punkte
        ctx.fillStyle = '#00ff00';
        for (const [x, y] of contour) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function startImageShapePlacement() {
        if (!detectedContourCoords || detectedContourCoords.length < 3) return;

        // Setze die erkannte Kontur als Custom Shape
        customShapeCoords = detectedContourCoords;

        // Starte Zeichenmodus
        drawingMode = SHAPES.CUSTOM;
        isDrawing = true;
        shapeCenter = null;

        const cancelBtn = document.getElementById('mcs-cancel');
        if (cancelBtn) cancelBtn.style.display = 'inline-block';

        document.querySelectorAll('.mcs-btn').forEach(b => b.classList.remove('active'));

        const isDynamic = document.getElementById('mcs-dynamic')?.checked;
        if (isDynamic) {
            updateStatus(t('clickForCenter', { shape: t('shapeCustom') }));
        } else {
            updateStatus(t('clickForPosition', { shape: t('shapeCustom') }));
        }

        document.body.classList.add('mcs-drawing-mode');
        sdk.Events.on({ eventName: 'wme-map-mouse-up', eventHandler: onMapClick });
        sdk.Events.on({ eventName: 'wme-map-mouse-move', eventHandler: onMapMouseMove });
    }

    // ============ CUSTOM SHAPES ============

    function updateCustomShapesDropdown() {
        const select = document.getElementById('mcs-custom-select');
        if (!select) return;

        const currentValue = select.value;
        select.innerHTML = `<option value="">${t('selectCustomShape')}</option>`;

        if (_settings.customShapes && _settings.customShapes.length > 0) {
            _settings.customShapes.forEach((shape, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = shape.name || `Shape ${index + 1}`;
                select.appendChild(option);
            });
        }

        if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
            select.value = currentValue;
        }
    }

    function normalizeCoords(coords) {
        // Normalisiere Koordinaten auf -1 bis 1 relativ zum Zentrum
        const center = getPolygonCenter(coords);
        const avgLat = center[1];
        const lonScale = 111000 * Math.cos(toRadians(avgLat));
        const latScale = 111000;

        // Finde maximale Ausdehnung
        let maxDist = 0;
        for (const coord of coords) {
            const dx = (coord[0] - center[0]) * lonScale;
            const dy = (coord[1] - center[1]) * latScale;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxDist) maxDist = dist;
        }

        if (maxDist === 0) maxDist = 1;

        // Normalisiere
        return coords.map(coord => {
            const dx = (coord[0] - center[0]) * lonScale / maxDist;
            const dy = (coord[1] - center[1]) * latScale / maxDist;
            return [dx, dy];
        });
    }

    function denormalizeCoords(normalizedCoords, center, radius) {
        const avgLat = center[1];
        const lonScale = 111000 * Math.cos(toRadians(avgLat));
        const latScale = 111000;

        return normalizedCoords.map(([nx, ny]) => {
            const lon = center[0] + (nx * radius) / lonScale;
            const lat = center[1] + (ny * radius) / latScale;
            return [lon, lat];
        });
    }

    function saveCustomShape() {
        const nameInput = document.getElementById('mcs-custom-name');
        const name = nameInput?.value?.trim();

        if (!name) {
            updateStatus('⚠️ ' + t('enterShapeName'));
            return;
        }

        const comment = getSelectedMapComment();
        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 4) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        // Normalisiere die Koordinaten
        const normalizedCoords = normalizeCoords(coords[0]);

        // Prüfen ob Name schon existiert
        const existingIndex = _settings.customShapes.findIndex(s => s.name === name);
        if (existingIndex >= 0) {
            _settings.customShapes[existingIndex] = { name, coords: normalizedCoords };
        } else {
            _settings.customShapes.push({ name, coords: normalizedCoords });
        }

        localStorage.setItem('WME_MapCommentShapes', JSON.stringify(_settings));
        updateCustomShapesDropdown();
        updateStatus('✅ ' + t('shapeSaved', { name }));

        if (nameInput) nameInput.value = '';
    }

    function useCustomShape() {
        const select = document.getElementById('mcs-custom-select');
        const index = parseInt(select?.value);

        if (isNaN(index) || !_settings.customShapes[index]) {
            updateStatus('⚠️ ' + t('noTemplateSelected'));
            return;
        }

        const shape = _settings.customShapes[index];
        customShapeCoords = shape.coords;

        // Starte Zeichenmodus mit Custom Shape
        drawingMode = SHAPES.CUSTOM;
        isDrawing = true;
        shapeCenter = null;

        const cancelBtn = document.getElementById('mcs-cancel');
        if (cancelBtn) cancelBtn.style.display = 'inline-block';

        document.querySelectorAll('.mcs-btn').forEach(b => b.classList.remove('active'));

        const isDynamic = document.getElementById('mcs-dynamic')?.checked;
        if (isDynamic) {
            updateStatus(t('clickForCenter', { shape: shape.name }));
        } else {
            updateStatus(t('clickForPosition', { shape: shape.name }));
        }

        document.body.classList.add('mcs-drawing-mode');
        sdk.Events.on({ eventName: 'wme-map-mouse-up', eventHandler: onMapClick });
        sdk.Events.on({ eventName: 'wme-map-mouse-move', eventHandler: onMapMouseMove });

        updateStatus('✅ ' + t('customShapeLoaded') + ': ' + shape.name);
    }

    function deleteCustomShape() {
        const select = document.getElementById('mcs-custom-select');
        const index = parseInt(select?.value);

        if (isNaN(index) || !_settings.customShapes[index]) {
            updateStatus('⚠️ ' + t('noTemplateSelected'));
            return;
        }

        const name = _settings.customShapes[index].name;

        if (confirm(t('confirmDeleteShape', { name }))) {
            _settings.customShapes.splice(index, 1);
            localStorage.setItem('WME_MapCommentShapes', JSON.stringify(_settings));
            updateCustomShapesDropdown();
            updateStatus('🗑️ ' + t('shapeDeleted', { name }));
        }
    }

    function createCustomShapeCoords(center, radius) {
        if (!customShapeCoords) return null;
        return denormalizeCoords(customShapeCoords, center, radius);
    }

    // ============ CONVERTER ============

    // WME Place Kategorien (interne IDs)
    const PLACE_CATEGORIES = {
        'PARKING_LOT': 'PARKING_LOT',
        'GAS_STATION': 'GAS_STATION',
        'RESTAURANT': 'FOOD_AND_DRINK',
        'CAFE': 'FOOD_AND_DRINK',
        'HOTEL': 'LODGING',
        'HOSPITAL_URGENT_CARE': 'HOSPITAL_URGENT_CARE',
        'SCHOOL': 'SCHOOL',
        'SHOPPING_CENTER': 'SHOPPING_AND_SERVICES',
        'SUPERMARKET_GROCERY': 'SHOPPING_AND_SERVICES',
        'BANK_FINANCIAL': 'BANK_FINANCIAL',
        'ATM': 'ATM',
        'PHARMACY': 'PHARMACY',
        'POST_OFFICE': 'POST_OFFICE',
        'POLICE_STATION': 'POLICE_STATION',
        'FIRE_DEPARTMENT': 'FIRE_DEPARTMENT',
        'CHURCH': 'RELIGIOUS_CENTER',
        'MOSQUE': 'RELIGIOUS_CENTER',
        'SYNAGOGUE': 'RELIGIOUS_CENTER',
        'PARK': 'PARK',
        'PLAYGROUND': 'PARK',
        'SPORTS_COURT': 'GYM_FITNESS',
        'GYM_FITNESS': 'GYM_FITNESS',
        'POOL': 'GYM_FITNESS',
        'THEATER': 'CULTURE_AND_ENTERTAINMENT',
        'MOVIE_THEATER': 'CULTURE_AND_ENTERTAINMENT',
        'MUSEUM': 'CULTURE_AND_ENTERTAINMENT',
        'LIBRARY': 'CULTURE_AND_ENTERTAINMENT',
        'OTHER': 'OTHER'
    };

    function convertToPlace() {
        const comment = getSelectedMapComment();
        if (!comment) {
            updateStatus('⚠️ ' + t('selectMapComment'));
            return;
        }

        const coords = getCommentGeometry(comment);
        if (!coords || !coords[0] || coords[0].length < 3) {
            updateStatus('⚠️ ' + t('noValidPolygon'));
            return;
        }

        const categorySelect = document.getElementById('mcs-place-category')?.value || 'OTHER';
        const category = PLACE_CATEGORIES[categorySelect] || 'OTHER';
        const deleteOriginal = document.getElementById('mcs-delete-after-place')?.checked ?? true;

        try {
            // Hole Titel und Beschreibung vom Map Comment
            const subject = comment.attributes?.subject || comment.getSubject?.() || '';
            const body = comment.attributes?.body || comment.getBody?.() || '';

            // Erstelle Place über WME SDK
            if (sdk && sdk.DataModel && sdk.DataModel.Venues && sdk.DataModel.Venues.addVenue) {
                const placeData = {
                    geometry: {
                        type: 'Polygon',
                        coordinates: coords
                    },
                    name: subject || 'Converted Place',
                    category: category  // Einzelne Kategorie, nicht Array!
                };

                console.log(`${SCRIPT_NAME} - Creating place with data:`, placeData);

                const result = sdk.DataModel.Venues.addVenue(placeData);
                
                if (result) {
                    console.log(`${SCRIPT_NAME} - Place created:`, result);
                    
                    // Lösche Original wenn gewünscht
                    if (deleteOriginal) {
                        setTimeout(() => deleteMapComment(comment), 200);
                    }

                    updateStatus('✅ ' + t('convertSuccess'));
                    updateConvertInfo(`📍 Place erstellt: ${subject || 'Converted Place'} (${category})`);
                    
                    // Status nach 3 Sekunden zurücksetzen
                    setTimeout(() => updateStatus(t('defaultStatus')), 3000);
                }
            } else {
                // Fallback: Verwende WME Actions direkt
                createPlaceViaWME(coords, subject, body, category, deleteOriginal, comment);
            }

        } catch (e) {
            console.error(`${SCRIPT_NAME} - Convert to Place error:`, e);
            updateStatus('❌ ' + t('convertError') + ' ' + e.message);
            
            // Zeige Hilfe bei Fehler
            updateConvertInfo(`
                <div style="text-align:left; font-size:11px; color:#856404;">
                    <b>Fehler:</b> ${e.message}<br>
                    <b>Tipp:</b> Versuche einen anderen Kategorietyp oder erstelle den Place manuell.
                </div>
            `);
        }
    }

    function createPlaceViaWME(coords, name, description, category, deleteOriginal, originalComment) {
        try {
            // WME Place-Erstellung über Actions
            const AddVenue = require('Waze/Action/AddVenue');

            // Konvertiere Koordinaten zu Mercator für WME
            const mercatorCoords = coords[0].map(coord => {
                const [x, y] = wgs84ToMercator(coord[0], coord[1]);
                return new OpenLayers.Geometry.Point(x, y);
            });

            const ring = new OpenLayers.Geometry.LinearRing(mercatorCoords);
            const polygon = new OpenLayers.Geometry.Polygon([ring]);

            // Berechne Zentrum für Entry Point
            const center = getPolygonCenter(coords[0]);
            const [cx, cy] = wgs84ToMercator(center[0], center[1]);
            const centerPoint = new OpenLayers.Geometry.Point(cx, cy);

            // Venue-Attribute
            const venueAttributes = {
                name: name || 'Converted Place',
                categories: [category],
                description: description || '',
                geometry: polygon,
                entryExitPoints: [{
                    entry: true,
                    exit: true,
                    point: centerPoint
                }]
            };

            // Erstelle Action
            const addAction = new AddVenue(venueAttributes, W.model.venues);
            W.model.actionManager.add(addAction);

            // Lösche Original wenn gewünscht
            if (deleteOriginal && originalComment) {
                setTimeout(() => deleteMapComment(originalComment), 200);
            }

            updateStatus('✅ ' + t('convertSuccess'));
            updateConvertInfo(`📍 Place erstellt: ${name || 'Converted Place'}`);
            
            // Status nach 3 Sekunden zurücksetzen
            setTimeout(() => updateStatus(t('defaultStatus')), 3000);

        } catch (e) {
            console.error(`${SCRIPT_NAME} - WME Place creation error:`, e);
            
            // Zeige Anleitung für manuelle Erstellung
            updateStatus('⚠️ Manuelle Erstellung erforderlich');
            updateConvertInfo(`
                <div style="text-align:left; font-size:11px;">
                    <b>Automatische Erstellung fehlgeschlagen</b><br>
                    <small>Fehler: ${e.message}</small><br><br>
                    <b>Manuelle Schritte:</b><br>
                    1. Zeichne einen neuen Place<br>
                    2. Kopiere die Form vom Map Comment<br>
                    3. Setze Kategorie: ${category}<br>
                    4. Name: ${name || 'Converted Place'}
                </div>
            `);
        }
    }

    function deleteMapComment(comment) {
        try {
            const commentId = comment.attributes?.id || comment.id;
            
            if (sdk && sdk.DataModel && sdk.DataModel.MapComments && sdk.DataModel.MapComments.deleteComment) {
                sdk.DataModel.MapComments.deleteComment({ commentId: commentId });
                console.log(`${SCRIPT_NAME} - Original Map Comment deleted via SDK`);
            } else {
                // Fallback über WME Actions
                const DeleteObject = require('Waze/Action/DeleteObject');
                W.model.actionManager.add(new DeleteObject(comment, W.model.mapComments));
                console.log(`${SCRIPT_NAME} - Original Map Comment deleted via Action`);
            }
        } catch (e) {
            console.warn(`${SCRIPT_NAME} - Could not delete original comment:`, e);
        }
    }

    function updateConvertInfo(html) {
        const infoEl = document.getElementById('mcs-convert-info');
        if (infoEl) {
            infoEl.innerHTML = html;
        }
    }

    // ============ DRAWING ============

    function startDrawing(shape) {
        isDrawing = true;
        drawingMode = shape;
        drawPoints = [];
        shapeCenter = null;

        const cancelBtn = document.getElementById('mcs-cancel');
        const finishBtn = document.getElementById('mcs-finish');

        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        if (finishBtn) finishBtn.style.display = 'none';

        const isDynamic = document.getElementById('mcs-dynamic')?.checked;
        const isShapeWithRadius = [SHAPES.CIRCLE, SHAPES.SQUARE, SHAPES.RECTANGLE, SHAPES.TRIANGLE,
                                   SHAPES.PENTAGON, SHAPES.HEXAGON, SHAPES.OCTAGON, SHAPES.STAR,
                                   SHAPES.ARROW_UP, SHAPES.ARROW_DOWN, SHAPES.ARROW_LEFT, SHAPES.ARROW_RIGHT,
                                   SHAPES.SPEECH_RECT, SHAPES.SPEECH_ROUND, SHAPES.CUSTOM].includes(shape);

        const shapeName = getShapeName(shape);
        let statusMsg;
        if (isDynamic && isShapeWithRadius) {
            statusMsg = t('clickForCenter', { shape: shapeName });
        } else {
            statusMsg = t('clickForPosition', { shape: shapeName });
        }

        updateStatus(statusMsg);
        document.body.classList.add('mcs-drawing-mode');

        // SDK Events registrieren
        sdk.Events.on({ eventName: 'wme-map-mouse-up', eventHandler: onMapClick });
        sdk.Events.on({ eventName: 'wme-map-mouse-move', eventHandler: onMapMouseMove });
    }

    function cancelDrawing() {
        isDrawing = false;
        drawingMode = null;
        drawPoints = [];
        shapeCenter = null;

        document.querySelectorAll('.mcs-btn').forEach(b => b.classList.remove('active'));

        const cancelBtn = document.getElementById('mcs-cancel');
        const finishBtn = document.getElementById('mcs-finish');
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (finishBtn) finishBtn.style.display = 'none';

        updateStatus(t('defaultStatus'));
        document.body.classList.remove('mcs-drawing-mode');
        clearPreview();

        // Event Listener entfernen
        sdk.Events.off({ eventName: 'wme-map-mouse-up', eventHandler: onMapClick });
        sdk.Events.off({ eventName: 'wme-map-mouse-move', eventHandler: onMapMouseMove });
    }

    function updateStatus(msg) {
        const el = document.getElementById('mcs-status');
        if (el) el.textContent = msg;
    }

    // Echtzeit-Vorschau bei Mausbewegung
    function onMapMouseMove(event) {
        // Debug: Prüfen ob Funktion aufgerufen wird
        if (!onMapMouseMove.callCount) onMapMouseMove.callCount = 0;
        onMapMouseMove.callCount++;

        if (onMapMouseMove.callCount % 100 === 1) {
            console.log(`${SCRIPT_NAME} - MouseMove called (${onMapMouseMove.callCount}x), isDrawing=${isDrawing}, shapeCenter=${JSON.stringify(shapeCenter)}`);
        }

        if (!isDrawing || !shapeCenter) return;

        const isDynamic = document.getElementById('mcs-dynamic')?.checked;
        if (!isDynamic) return;

        let coords;
        if (event.lon !== undefined && event.lat !== undefined) {
            coords = [Number(event.lon), Number(event.lat)];
        }
        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

        const radius = distanceBetween(shapeCenter, coords);

        // Debug: Nur alle 500ms loggen um Console nicht zu fluten
        if (!onMapMouseMove.lastLog || Date.now() - onMapMouseMove.lastLog > 500) {
            console.log(`${SCRIPT_NAME} - Preview: center=${JSON.stringify(shapeCenter)}, mouse=${JSON.stringify(coords)}, radius=${radius.toFixed(1)}m`);
            onMapMouseMove.lastLog = Date.now();
        }

        const previewCoords = getShapeCoords(shapeCenter, radius);

        if (previewCoords && previewCoords.length >= 3) {
            updatePreview(previewCoords);
            updateStatus(t('radiusDisplay', { radius: Math.round(radius) }));
        }
    }

    // Hilfsfunktion: Koordinaten für aktuelle Form berechnen
    function getShapeCoords(center, radius) {
        switch (drawingMode) {
            case SHAPES.CIRCLE:
                return createCircleCoords(center, radius, 32);
            case SHAPES.SQUARE:
                return createRegularPolygonCoords(center, radius, 4, 45);
            case SHAPES.RECTANGLE:
                return createRectangleCoords(center, radius);
            case SHAPES.TRIANGLE:
                return createRegularPolygonCoords(center, radius, 3, 90);
            case SHAPES.PENTAGON:
                return createRegularPolygonCoords(center, radius, 5, 162);
            case SHAPES.HEXAGON:
                return createRegularPolygonCoords(center, radius, 6, 0);
            case SHAPES.OCTAGON:
                return createRegularPolygonCoords(center, radius, 8, 22.5);
            case SHAPES.STAR:
                return createStarCoords(center, radius, 5);
            case SHAPES.ARROW_UP:
                return createArrowCoords(center, radius, 0);
            case SHAPES.ARROW_DOWN:
                return createArrowCoords(center, radius, 180);
            case SHAPES.ARROW_LEFT:
                return createArrowCoords(center, radius, 90);
            case SHAPES.ARROW_RIGHT:
                return createArrowCoords(center, radius, 270);
            case SHAPES.SPEECH_RECT:
                return createSpeechRectCoords(center, radius);
            case SHAPES.SPEECH_ROUND:
                return createSpeechRoundCoords(center, radius);
            case SHAPES.CUSTOM:
                return createCustomShapeCoords(center, radius);
            default:
                return null;
        }
    }

    function onMapClick(event) {
        if (!isDrawing || !drawingMode) return;

        let coords;
        if (event.lon !== undefined && event.lat !== undefined) {
            // Sicherstellen dass es Numbers sind
            coords = [Number(event.lon), Number(event.lat)];
        } else if (event.coordinates && event.coordinates.length >= 2) {
            coords = [Number(event.coordinates[0]), Number(event.coordinates[1])];
        }

        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) {
            console.warn(`${SCRIPT_NAME} - Could not get valid coordinates from event:`, event);
            return;
        }

        console.log(`${SCRIPT_NAME} - Click at:`, coords, `(types: ${typeof coords[0]}, ${typeof coords[1]})`);

        const isDynamic = document.getElementById('mcs-dynamic')?.checked;

        switch (drawingMode) {
            case SHAPES.POINT:
                createPointComment(coords);
                cancelDrawing();
                break;

            case SHAPES.CIRCLE:
            case SHAPES.SQUARE:
            case SHAPES.RECTANGLE:
            case SHAPES.TRIANGLE:
            case SHAPES.PENTAGON:
            case SHAPES.HEXAGON:
            case SHAPES.OCTAGON:
            case SHAPES.STAR:
            case SHAPES.ARROW_UP:
            case SHAPES.ARROW_DOWN:
            case SHAPES.ARROW_LEFT:
            case SHAPES.ARROW_RIGHT:
            case SHAPES.SPEECH_RECT:
            case SHAPES.SPEECH_ROUND:
            case SHAPES.CUSTOM:
                if (isDynamic) {
                    if (!shapeCenter) {
                        shapeCenter = [coords[0], coords[1]]; // Explizite Kopie
                        console.log(`${SCRIPT_NAME} - Shape center set:`, shapeCenter);
                        updateStatus(t('moveForSize'));
                    } else {
                        const radius = distanceBetween(shapeCenter, coords);
                        console.log(`${SCRIPT_NAME} - Dynamic radius: ${radius.toFixed(1)}m from center ${JSON.stringify(shapeCenter)} to ${JSON.stringify(coords)}`);
                        createShapeCommentWithRadius(shapeCenter, radius);
                        cancelDrawing();
                    }
                } else {
                    createShapeComment(coords);
                    cancelDrawing();
                }
                break;
        }
    }

    // ============ MAP COMMENT CREATION ============

    function getCommentData() {
        const subject = document.getElementById('mcs-subject')?.value || 'Map Comment';
        const body = document.getElementById('mcs-body')?.value || '';
        const days = parseInt(document.getElementById('mcs-expiration')?.value) || 30;
        const endDate = Date.now() + (days * 24 * 60 * 60 * 1000);

        return { subject, body, endDate };
    }

    function createPointComment(coords) {
        const { subject, body, endDate } = getCommentData();

        const geometry = {
            type: 'Point',
            coordinates: coords
        };

        addMapComment(geometry, subject, body, endDate);
    }

    function createShapeComment(center) {
        const radius = parseInt(document.getElementById('mcs-radius')?.value) || 50;
        createShapeCommentWithRadius(center, radius);
    }

    function createShapeCommentWithRadius(center, radius) {
        const { subject, body, endDate } = getCommentData();

        // Sicherstellen dass center Numbers enthält
        const safeCenter = [parseFloat(center[0]), parseFloat(center[1])];

        // Mindestradius 5m
        const safeRadius = Math.max(5, parseFloat(radius));

        let coords = getShapeCoords(safeCenter, safeRadius);
        if (!coords) return;

        const geometry = {
            type: 'Polygon',
            coordinates: [coords]
        };

        clearPreview();
        addMapComment(geometry, subject, body, endDate);
    }

    function addMapComment(geometry, subject, body, endDate) {
        try {
            let cleanGeometry;

            if (geometry.type === 'Point') {
                // Point: coordinates ist direkt [lon, lat]
                cleanGeometry = {
                    type: 'Point',
                    coordinates: [Number(geometry.coordinates[0]), Number(geometry.coordinates[1])]
                };
            } else {
                // Polygon: coordinates ist [[...points...]]
                const coords = geometry.coordinates[0].map(coord => {
                    if (Array.isArray(coord)) {
                        return [Number(coord[0]), Number(coord[1])];
                    }
                    return coord;
                });
                cleanGeometry = {
                    type: 'Polygon',
                    coordinates: [coords]
                };
            }

            console.log(`${SCRIPT_NAME} - Creating map comment with geometry:`, JSON.stringify(cleanGeometry));

            const result = sdk.DataModel.MapComments.addComment({
                geometry: cleanGeometry,
                subject: String(subject).substring(0, 30),
                body: String(body).substring(0, 2000),
                endDate: Number(endDate)
            });

            if (result) {
                updateStatus('✅ ' + t('commentCreatedId', { id: result.id }));
                console.log(`${SCRIPT_NAME} - Map comment created:`, result);

                // Neu erstellten Map Comment automatisch auswählen
                setTimeout(() => {
                    try {
                        if (W.selectionManager && result) {
                            // Versuche den Comment zu finden und auszuwählen
                            const comment = W.model.mapComments.getObjectById(result.id);
                            if (comment) {
                                W.selectionManager.setSelectedModels([comment]);
                                console.log(`${SCRIPT_NAME} - Auto-selected created comment:`, result.id);

                                // Tab wieder auf unser Script setzen (WME springt automatisch zum Edit-Tab)
                                setTimeout(() => {
                                    try {
                                        // Versuche verschiedene Selektoren
                                        const tabSelectors = [
                                            `#user-tabs [data-tab-id="${SCRIPT_ID}"]`,
                                            `#sidepanel-scripts [data-tab-id="${SCRIPT_ID}"]`,
                                            `.nav-tabs [data-tab-id="${SCRIPT_ID}"]`,
                                            `[id*="${SCRIPT_ID}"]`,
                                            `a[href="#${SCRIPT_ID}"]`
                                        ];

                                        let clicked = false;
                                        for (const selector of tabSelectors) {
                                            const tab = document.querySelector(selector);
                                            if (tab) {
                                                tab.click();
                                                clicked = true;
                                                console.log(`${SCRIPT_NAME} - Restored script tab via:`, selector);
                                                break;
                                            }
                                        }

                                        // Fallback: Suche nach Tab mit unserem Emoji
                                        if (!clicked) {
                                            const allTabs = document.querySelectorAll('#user-tabs .nav-tabs li a, #sidepanel-scripts .nav-tabs li a');
                                            for (const tab of allTabs) {
                                                if (tab.textContent.includes('📝') || tab.title?.includes('Map Comment')) {
                                                    tab.click();
                                                    console.log(`${SCRIPT_NAME} - Restored script tab via emoji search`);
                                                    break;
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        console.warn(`${SCRIPT_NAME} - Could not restore tab:`, e);
                                    }
                                }, 150);
                            }
                        }
                    } catch (e) {
                        console.warn(`${SCRIPT_NAME} - Could not auto-select comment:`, e);
                    }
                }, 100); // Kurze Verzögerung damit der Comment vollständig erstellt ist

            } else {
                updateStatus('⚠️ ' + t('commentCreated'));
            }

        } catch (err) {
            console.error(`${SCRIPT_NAME} - Error:`, err);
            updateStatus('❌ ' + t('error') + ' ' + err.message);
        }
    }

    // ============ STYLES ============

    function injectStyles() {
        if (document.getElementById('mcs-styles')) return;

        const style = document.createElement('style');
        style.id = 'mcs-styles';
        style.textContent = `
            .mcs-container { padding: 8px; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 12px; }
            .mcs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .mcs-title { font-weight: bold; font-size: 14px; color: #333; }
            .mcs-version { color: #999; font-size: 10px; }
            .mcs-section { margin-bottom: 8px; }
            .mcs-label { font-weight: 600; color: #444; margin-bottom: 6px; font-size: 11px; }

            /* Shape Grid */
            .mcs-shape-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 8px; }
            .mcs-btn { padding: 6px; font-size: 16px; line-height: 1; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer; transition: all 0.15s; min-width: 32px; min-height: 32px; display: flex; align-items: center; justify-content: center; }
            .mcs-btn:hover { background: #e0e0e0; border-color: #4a90d9; transform: scale(1.05); }
            .mcs-btn.active { background: #4a90d9; border-color: #357abd; color: white; }

            /* Size Row */
            .mcs-size-row { display: flex; align-items: center; gap: 8px; font-size: 11px; flex-wrap: wrap; }
            .mcs-checkbox { display: flex; align-items: center; gap: 4px; cursor: pointer; color: #555; }
            .mcs-checkbox input { width: 14px; height: 14px; }
            .mcs-input-num { width: 55px; padding: 4px 6px; border: 1px solid #ccc; border-radius: 3px; font-size: 11px; }

            /* Status */
            .mcs-status { background: linear-gradient(135deg, #e8f4fc, #d4e8f7); border: 1px solid #b8d4e8; border-radius: 4px; padding: 8px; text-align: center; color: #2c5282; margin-bottom: 8px; font-size: 12px; font-weight: 500; }
            .mcs-actions { display: flex; gap: 8px; justify-content: center; margin-bottom: 8px; }
            .mcs-action-btn { padding: 6px 14px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; }
            .mcs-cancel { background: #dc3545; color: white; }
            .mcs-cancel:hover { background: #c82333; }

            /* Accordion */
            .mcs-accordion { border: 1px solid #ddd; border-radius: 6px; margin-bottom: 6px; overflow: hidden; }
            .mcs-accordion:nth-of-type(1) { background: #e8f4fc; border-color: #b8d4e8; }
            .mcs-accordion:nth-of-type(1) .mcs-accordion-header { background: linear-gradient(135deg, #4a90d9, #357abd); color: white; }
            .mcs-accordion:nth-of-type(2) { background: #e8fcf4; border-color: #b8e8d4; }
            .mcs-accordion:nth-of-type(2) .mcs-accordion-header { background: linear-gradient(135deg, #28a745, #218838); color: white; }
            .mcs-accordion:nth-of-type(3) { background: #fcf4e8; border-color: #e8d4b8; }
            .mcs-accordion:nth-of-type(3) .mcs-accordion-header { background: linear-gradient(135deg, #fd7e14, #e06b0a); color: white; }
            .mcs-accordion:nth-of-type(4) { background: #e8fcfc; border-color: #b8e8e8; }
            .mcs-accordion:nth-of-type(4) .mcs-accordion-header { background: linear-gradient(135deg, #17a2b8, #138496); color: white; }
            .mcs-accordion:nth-of-type(5) { background: #fffde8; border-color: #f0e8a0; }
            .mcs-accordion:nth-of-type(5) .mcs-accordion-header { background: linear-gradient(135deg, #ffc107, #e0a800); color: white; }
            .mcs-accordion:nth-of-type(6) { background: #fce8fc; border-color: #e8b8e8; }
            .mcs-accordion:nth-of-type(6) .mcs-accordion-header { background: linear-gradient(135deg, #9c27b0, #7b1fa2); color: white; }
            .mcs-accordion:nth-of-type(7) { background: #f8f9fa; border-color: #dee2e6; }
            .mcs-accordion:nth-of-type(7) .mcs-accordion-header { background: linear-gradient(135deg, #6c757d, #5a6268); color: white; }
            .mcs-accordion-header { padding: 8px 10px; cursor: pointer; font-weight: 600; font-size: 12px; list-style: none; display: flex; align-items: center; }
            .mcs-accordion-header::-webkit-details-marker { display: none; }
            .mcs-accordion-header::before { content: '▶'; font-size: 9px; margin-right: 8px; transition: transform 0.2s; opacity: 0.8; }
            .mcs-accordion[open] .mcs-accordion-header::before { transform: rotate(90deg); }
            .mcs-accordion-body { padding: 10px; border-top: 1px solid #eee; background: white; }

            /* Inputs */
            .mcs-input { width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; box-sizing: border-box; margin-bottom: 6px; }
            .mcs-input:focus { border-color: #4a90d9; outline: none; box-shadow: 0 0 0 2px rgba(74,144,217,0.2); }
            .mcs-textarea { width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; box-sizing: border-box; resize: vertical; margin-bottom: 6px; }
            .mcs-select { flex: 1; padding: 5px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 11px; min-width: 0; background: white; }

            /* Field Rows */
            .mcs-field-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
            .mcs-field-row label { font-size: 11px; color: #555; min-width: 60px; }
            .mcs-divider { height: 1px; background: #e0e0e0; margin: 10px 0; }
            .mcs-sublabel { font-size: 11px; font-weight: 600; color: #666; margin-bottom: 6px; }

            /* Buttons */
            .mcs-btn-sm { padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5; cursor: pointer; font-size: 11px; white-space: nowrap; }
            .mcs-btn-sm:hover { background: #e8e8e8; }
            .mcs-btn-blue { background: #4a90d9; border-color: #4a90d9; color: white; }
            .mcs-btn-blue:hover { background: #357abd; }
            .mcs-btn-green { background: #28a745; border-color: #28a745; color: white; }
            .mcs-btn-green:hover { background: #218838; }
            .mcs-btn-red { background: #dc3545; border-color: #dc3545; color: white; }
            .mcs-btn-red:hover { background: #c82333; }
            .mcs-btn-full { width: 100%; padding: 8px; border: 1px solid #8b5cf6; border-radius: 4px; background: #8b5cf6; color: white; cursor: pointer; font-size: 12px; margin-bottom: 6px; }
            .mcs-btn-full:hover { background: #7c3aed; }
            .mcs-btn-row { display: flex; gap: 8px; margin-top: 8px; }

            /* Tool Box */
            .mcs-tool-box { background: linear-gradient(135deg, #e8f4fc, #d4e8f7); border: 1px solid #b8d4e8; border-radius: 6px; padding: 10px; margin-bottom: 10px; }
            .mcs-tool-box:nth-child(odd) { background: linear-gradient(135deg, #e8f4fc, #d4e8f7); border-color: #b8d4e8; }
            .mcs-tool-box:nth-child(even) { background: linear-gradient(135deg, #f0e8fc, #e4d4f7); border-color: #d4b8e8; }
            .mcs-tool-title { font-weight: 600; font-size: 12px; color: #333; margin-bottom: 4px; }
            .mcs-tool-desc { font-size: 10px; color: #666; margin-bottom: 8px; line-height: 1.4; }

            /* Range Slider */
            .mcs-range { flex: 1; height: 18px; cursor: pointer; min-width: 80px; }
            .mcs-range-val { font-size: 11px; color: #4a90d9; font-weight: 600; min-width: 40px; text-align: right; }

            /* Result/Info Box */
            .mcs-result-box { margin-top: 8px; padding: 8px; background: #e8f4fc; border-radius: 4px; font-size: 11px; text-align: center; }
            .mcs-result-box:empty { display: none; }

            /* Image Box */
            .mcs-image-box { margin: 8px 0; text-align: center; background: #f8f8f8; border: 1px solid #ddd; border-radius: 4px; padding: 8px; }
            .mcs-image-box canvas { max-width: 100%; max-height: 150px; border: 1px solid #ccc; border-radius: 2px; }

            /* Hint */
            .mcs-hint { background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 8px; font-size: 11px; color: #856404; margin-bottom: 10px; text-align: center; }

            /* Help */
            .mcs-help { font-size: 11px; color: #555; line-height: 1.6; }
            .mcs-help div { margin-bottom: 4px; }
            .mcs-help b { color: #333; }

            /* Drawing Mode */
            body.mcs-drawing-mode #WazeMap, body.mcs-drawing-mode #WazeMap * { cursor: crosshair !important; }

            /* Update Popup */
            #mcs-update-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; }
            .mcs-update-popup { background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); max-width: 420px; width: 90%; max-height: 80vh; overflow: hidden; animation: mcs-popup-in 0.3s ease; }
            @keyframes mcs-popup-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            .mcs-update-header { background: linear-gradient(135deg, #4a90d9, #357abd); color: white; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
            .mcs-update-title { font-size: 18px; font-weight: bold; }
            .mcs-update-close { background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; line-height: 1; opacity: 0.8; }
            .mcs-update-close:hover { opacity: 1; }
            .mcs-update-content { padding: 20px; max-height: 50vh; overflow-y: auto; }
            .mcs-update-section { margin-bottom: 16px; }
            .mcs-update-section:last-child { margin-bottom: 0; }
            .mcs-update-section-title { font-weight: 600; font-size: 14px; color: #333; margin-bottom: 8px; }
            .mcs-update-list { margin: 0; padding-left: 20px; color: #555; font-size: 13px; line-height: 1.8; }
            .mcs-update-list li { margin-bottom: 4px; }
            .mcs-update-footer { padding: 16px 20px; background: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center; }
            .mcs-update-btn { background: linear-gradient(135deg, #28a745, #218838); color: white; border: none; padding: 10px 30px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: transform 0.15s; }
            .mcs-update-btn:hover { transform: scale(1.05); }
        `;
        document.head.appendChild(style);
    }

    // ============ START ============

    init();

})();
