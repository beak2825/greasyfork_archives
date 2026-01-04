// ==UserScript==
// @name         WME Map Comment Shapes
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2026.01.04
// @author       Hiwi234
// @description  Erstelle Map Comments mit vordefinierten Formen (Kreis, Quadrat, etc.) im Waze Map Editor
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @author       Custom
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
    const SCRIPT_VERSION = '2025.01.02.17';

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
            save: 'Speichern'
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
            save: 'Save'
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
            save: 'Salva'
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
            save: 'Guardar'
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
            save: 'Enregistrer'
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
            save: 'Opslaan'
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
                <h3>📝 Map Comment Shapes</h3>
                <p class="mcs-version">v${SCRIPT_VERSION}</p>

                <div class="mcs-section">
                    <label class="mcs-label">${t('selectShape')}</label>
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
                    </div>
                    <label class="mcs-label mcs-sublabel">${t('arrows')}</label>
                    <div class="mcs-shape-grid mcs-arrows">
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_UP}" title="${t('shapeArrowUp')}">⬆️</button>
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_DOWN}" title="${t('shapeArrowDown')}">⬇️</button>
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_LEFT}" title="${t('shapeArrowLeft')}">⬅️</button>
                        <button class="mcs-btn" data-shape="${SHAPES.ARROW_RIGHT}" title="${t('shapeArrowRight')}">➡️</button>
                    </div>
                    <label class="mcs-label mcs-sublabel">${t('speechBubbles')}</label>
                    <div class="mcs-shape-grid mcs-speech">
                        <button class="mcs-btn" data-shape="${SHAPES.SPEECH_RECT}" title="${t('shapeSpeechRect')}">💬</button>
                        <button class="mcs-btn" data-shape="${SHAPES.SPEECH_ROUND}" title="${t('shapeSpeechRound')}">🗨️</button>
                    </div>
                </div>

                <div class="mcs-section">
                    <label class="mcs-label">${t('size')}</label>
                    <div class="mcs-row">
                        <label class="mcs-checkbox">
                            <input type="checkbox" id="mcs-dynamic" checked>
                            ${t('dynamic')}
                        </label>
                    </div>
                    <div class="mcs-row" id="mcs-radius-row">
                        <span>${t('radius')}</span>
                        <input type="number" id="mcs-radius" min="5" max="1000" value="50"> m
                    </div>
                </div>

                <div class="mcs-section">
                    <label class="mcs-label">${t('commentContent')}</label>
                    <div class="mcs-row-full">
                        <input type="text" id="mcs-subject" maxlength="30" placeholder="${t('titlePlaceholder')}">
                    </div>
                    <div class="mcs-row-full">
                        <textarea id="mcs-body" rows="3" maxlength="2000" placeholder="${t('descPlaceholder')}"></textarea>
                    </div>
                    <div class="mcs-row">
                        <span>${t('expiresIn')}</span>
                        <input type="number" id="mcs-expiration" min="1" max="365" value="30"> ${t('days')}
                    </div>
                </div>

                <div class="mcs-section">
                    <label class="mcs-label">📋 ${t('templates')}</label>
                    <div class="mcs-row">
                        <select id="mcs-template-select" class="mcs-select">
                            <option value="">${t('selectTemplate')}</option>
                        </select>
                        <button id="mcs-template-load" class="mcs-small-btn" title="${t('load')}">📥</button>
                        <button id="mcs-template-delete" class="mcs-small-btn mcs-delete" title="${t('delete')}">🗑️</button>
                    </div>
                    <div class="mcs-row">
                        <input type="text" id="mcs-template-name" placeholder="${t('templateName')}" class="mcs-template-input">
                        <button id="mcs-template-save" class="mcs-small-btn mcs-save" title="${t('save')}">💾</button>
                    </div>
                </div>

                <div class="mcs-section">
                    <div id="mcs-status" class="mcs-status">${t('defaultStatus')}</div>
                    <div class="mcs-actions">
                        <button id="mcs-cancel" class="mcs-action-btn mcs-cancel" style="display:none;">${t('cancel')}</button>
                    </div>
                </div>

                <div class="mcs-section mcs-simplify-section">
                    <label class="mcs-label">✂️ ${t('simplify')}</label>
                    <p class="mcs-hint">${t('simplifyHint')}</p>
                    <div class="mcs-row">
                        <span>${t('tolerance')}</span>
                        <input type="range" id="mcs-simplify-tolerance" min="1" max="50" value="5" class="mcs-slider">
                        <span id="mcs-tolerance-value">5m</span>
                    </div>
                    <div class="mcs-row">
                        <label class="mcs-checkbox">
                            <input type="checkbox" id="mcs-simplify-hq" checked>
                            ${t('highQuality')}
                        </label>
                    </div>
                    <div class="mcs-row mcs-simplify-actions">
                        <button id="mcs-simplify-btn" class="mcs-action-btn mcs-simplify">✂️ Simplify</button>
                        <button id="mcs-simplify-preview" class="mcs-small-btn" title="${t('preview')}">👁️</button>
                    </div>
                    <div id="mcs-simplify-info" class="mcs-simplify-info"></div>
                </div>

                <div class="mcs-section mcs-rotate-section">
                    <label class="mcs-label">🔄 ${t('rotate')}</label>
                    <p class="mcs-hint">${t('rotateHint')}</p>
                    <div class="mcs-row">
                        <span>${t('angle')}</span>
                        <input type="range" id="mcs-rotate-angle" min="-180" max="180" value="45" class="mcs-slider">
                        <span id="mcs-angle-value">45°</span>
                    </div>
                    <div class="mcs-row mcs-rotate-actions">
                        <button id="mcs-rotate-btn" class="mcs-action-btn mcs-rotate">🔄 ${t('rotateBtn')}</button>
                    </div>
                </div>

                <div class="mcs-section mcs-custom-section">
                    <label class="mcs-label">🎨 ${t('customShapes')}</label>
                    <div class="mcs-row">
                        <select id="mcs-custom-select" class="mcs-select">
                            <option value="">${t('selectCustomShape')}</option>
                        </select>
                        <button id="mcs-custom-use" class="mcs-small-btn" title="${t('load')}">▶️</button>
                        <button id="mcs-custom-delete" class="mcs-small-btn mcs-delete" title="${t('delete')}">🗑️</button>
                    </div>
                    <div class="mcs-row">
                        <input type="text" id="mcs-custom-name" placeholder="${t('shapeName')}" class="mcs-template-input">
                        <button id="mcs-custom-save" class="mcs-small-btn mcs-save" title="${t('saveShape')}">💾</button>
                    </div>
                    <p class="mcs-hint-small">💡 ${t('simplifyHint').replace('Simplify', t('saveShape'))}</p>
                </div>

                <div class="mcs-section mcs-help">
                    <label class="mcs-label">${t('instructions')}</label>
                    <ul>
                        <li>${t('instrPoint')}</li>
                        <li>${t('instrDynamicOn')}</li>
                        <li>${t('instrDynamicOff')}</li>
                    </ul>
                </div>
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

        // Custom shapes buttons
        document.getElementById('mcs-custom-save')?.addEventListener('click', saveCustomShape);
        document.getElementById('mcs-custom-use')?.addEventListener('click', useCustomShape);
        document.getElementById('mcs-custom-delete')?.addEventListener('click', deleteCustomShape);

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

        } catch (e) {
            console.error(`${SCRIPT_NAME} - Rotate error:`, e);
            updateStatus('❌ ' + t('error') + ' ' + e.message);
        }
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
            .mcs-container {
                padding: 8px;
                font-family: 'Segoe UI', Tahoma, sans-serif;
                font-size: 12px;
            }
            .mcs-container h3 {
                margin: 0 0 3px 0;
                color: #333;
                font-size: 15px;
            }
            .mcs-version {
                color: #888;
                font-size: 10px;
                margin: 0 0 8px 0;
            }
            .mcs-section {
                margin-bottom: 10px;
            }
            .mcs-label {
                display: block;
                font-weight: bold;
                margin-bottom: 4px;
                color: #444;
            }
            .mcs-shape-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 3px;
            }
            .mcs-shape-grid.mcs-arrows {
                grid-template-columns: repeat(4, 1fr);
                margin-top: 3px;
            }
            .mcs-shape-grid.mcs-speech {
                grid-template-columns: repeat(2, 1fr);
                margin-top: 3px;
            }
            .mcs-sublabel {
                margin-top: 6px;
                font-size: 10px;
                color: #666;
            }
            .mcs-btn {
                padding: 6px;
                font-size: 20px;
                line-height: 1;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: #f5f5f5;
                cursor: pointer;
                transition: all 0.15s;
                min-width: 36px;
                min-height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .mcs-btn:hover {
                background: #e8e8e8;
                border-color: #4a90d9;
            }
            .mcs-btn.active {
                background: #4a90d9;
                border-color: #357abd;
                color: white;
            }
            .mcs-row {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 3px;
            }
            .mcs-row span {
                min-width: 60px;
                color: #555;
            }
            .mcs-row input[type="number"] {
                width: 55px;
                padding: 3px;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            .mcs-checkbox {
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                color: #555;
            }
            .mcs-checkbox input {
                cursor: pointer;
            }
            .mcs-select {
                flex: 1;
                padding: 3px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 11px;
            }
            .mcs-small-btn {
                padding: 3px 6px;
                border: 1px solid #ccc;
                border-radius: 3px;
                background: #f5f5f5;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.15s;
            }
            .mcs-small-btn:hover {
                background: #e8e8e8;
            }
            .mcs-small-btn.mcs-save {
                background: #d4edda;
                border-color: #28a745;
            }
            .mcs-small-btn.mcs-save:hover {
                background: #c3e6cb;
            }
            .mcs-small-btn.mcs-delete {
                background: #f8d7da;
                border-color: #dc3545;
            }
            .mcs-small-btn.mcs-delete:hover {
                background: #f5c6cb;
            }
            .mcs-template-input {
                flex: 1;
                padding: 4px 6px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 12px;
            }
            .mcs-row-full {
                margin-bottom: 8px;
            }
            .mcs-row-full input,
            .mcs-row-full textarea {
                width: 100%;
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-family: inherit;
                font-size: 12px;
                box-sizing: border-box;
            }
            .mcs-row-full textarea {
                resize: vertical;
            }
            .mcs-status {
                background: #e8f4fc;
                border: 1px solid #b8d4e8;
                border-radius: 4px;
                padding: 8px;
                text-align: center;
                color: #2c5282;
                margin-bottom: 8px;
            }
            .mcs-actions {
                display: flex;
                gap: 8px;
                justify-content: center;
            }
            .mcs-action-btn {
                padding: 6px 14px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
            }
            .mcs-cancel {
                background: #dc3545;
                color: white;
            }
            .mcs-cancel:hover { background: #c82333; }
            .mcs-help {
                background: #fffbeb;
                border-radius: 4px;
                padding: 10px;
                margin-top: 10px;
            }
            .mcs-help ul {
                margin: 0;
                padding-left: 16px;
                font-size: 11px;
                color: #666;
            }
            .mcs-help li { margin-bottom: 3px; }
            .mcs-help b { color: #333; }

            /* Simplify Section */
            .mcs-simplify-section {
                background: #f0f7ff;
                border: 1px solid #b8d4e8;
                border-radius: 6px;
                padding: 10px;
            }
            .mcs-hint {
                font-size: 11px;
                color: #666;
                margin: 0 0 10px 0;
            }
            .mcs-hint-small {
                font-size: 10px;
                color: #888;
                margin: 5px 0 0 0;
            }
            .mcs-slider {
                flex: 1;
                cursor: pointer;
            }
            .mcs-simplify-actions, .mcs-rotate-actions {
                justify-content: center;
                gap: 10px;
                margin-top: 8px;
            }
            .mcs-simplify {
                background: #17a2b8;
                color: white;
                padding: 8px 16px;
            }
            .mcs-simplify:hover { background: #138496; }
            .mcs-simplify-info {
                margin-top: 8px;
                padding: 6px;
                background: #e8f4fc;
                border-radius: 4px;
                font-size: 11px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
            }
            .mcs-simplify-info:empty { display: none; }
            .mcs-info-item { color: #555; }
            .mcs-info-item b { color: #333; }
            .mcs-reduction b { color: #28a745; }

            /* Rotate Section */
            .mcs-rotate-section {
                background: #fff8e6;
                border: 1px solid #f0d78c;
                border-radius: 6px;
                padding: 10px;
            }
            .mcs-rotate {
                background: #ffc107;
                color: #333;
                padding: 8px 16px;
            }
            .mcs-rotate:hover { background: #e0a800; }

            /* Custom Shapes Section */
            .mcs-custom-section {
                background: #f0fff0;
                border: 1px solid #90ee90;
                border-radius: 6px;
                padding: 10px;
            }

            body.mcs-drawing-mode #WazeMap,
            body.mcs-drawing-mode #WazeMap * {
                cursor: crosshair !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============ START ============

    init();

})();
