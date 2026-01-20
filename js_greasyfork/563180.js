// ==UserScript==
// @name         WME Google Places Link Checker
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2026.01.22
// @description  Prüft Places auf Google-Verknüpfungen und listet fehlende/doppelte Verknüpfungen tabellarisch auf. Mit Auto-Scroll für große Bereiche.
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563180/WME%20Google%20Places%20Link%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/563180/WME%20Google%20Places%20Link%20Checker.meta.js
// ==/UserScript==

(function() {
'use strict';

const SCRIPT_NAME = 'WME Google Places Link Checker';
const SCRIPT_ID = 'wme-google-places-link-checker';
const SCRIPT_VERSION = '1.0.0';

// ============ I18N ============
const I18N = {
    de: {
        tabName: 'G Link',
        tabTitle: 'Google Places Link Checker',
        selectShape: 'Form wählen:',
        size: 'Größe:',
        radius: 'Radius:',
        filterOptions: 'Filter & Optionen',
        categories: 'Kategorien:',
        allCategories: 'Alle Kategorien',
        ctrlClickMulti: 'Strg+Klick für Mehrfachauswahl',
        lockLevel: 'Lock Level:',
        allLockLevels: 'Alle Lock Levels',
        nameContains: 'Name enthält:',
        useRegex: 'Regex verwenden',
        placeType: 'Place Typ:',
        pointPlaces: 'Point Places',
        areaPlaces: 'Area Places',
        scanArea: 'Scan-Bereich:',
        scanOnlyEditable: 'Viewport editierbar',
        scanEntireViewport: 'Gesamten Viewport',
        scanSelectedAreas: 'Ausgewählte Gebiete',
        selectEditableAreas: 'Editierbare Gebiete auswählen:',
        selectAllAreas: 'Alle auswählen',
        deselectAllAreas: 'Alle abwählen',
        noEditableAreasFound: 'Keine editierbaren Gebiete gefunden',
        analyzingEditableAreas: 'Analysiere editierbare Gebiete...',
        scanOnlyEditableTooltip: 'Scannt nur editierbare Bereiche im aktuellen Viewport (basierend auf Ihrem Rang und Lock-Levels)',
        scanEntireViewportTooltip: 'Scannt den gesamten sichtbaren Kartenbereich',
        startScan: 'Scan Starten',
        pause: 'Pause',
        resume: 'Fortsetzen',
        stop: 'Stop',
        progress: 'Fortschritt:',
        placesChecked: 'Places geprüft:',
        noLink: 'Ohne Link:',
        linkSharedMultiplePOIs: 'Link mehreren POIs zugeordnet:',
        multipleLinksOnePlace: 'Mehrere Links am selben Ort:',
        results: 'Ergebnisse:',
        sortBy: 'Sortieren:',
        byName: 'Nach Name',
        byCategory: 'Nach Kategorie',
        byLockLevel: 'Nach Lock Level',
        exportCSV: 'CSV',
        exportJSON: 'JSON',
        clear: 'Löschen',
        showNoLink: 'Ohne Link anzeigen',
        showDuplicateLinks: 'Doppelte Links anzeigen (geteilt)',
        showMultipleLinks: 'Mehrere Links anzeigen (selber Ort)',
        highlightOnMap: 'Duplikate auf Karte hervorheben',
        scanStarted: 'Starte Scan über {tiles} Bereiche...',
        scanPaused: 'Scan pausiert',
        scanResumed: 'Scan fortgesetzt',
        scanStopped: 'Scan gestoppt',
        scanComplete: 'Scan abgeschlossen! {places} Places geprüft.',
        scanStats: 'Ohne Link: {nolink}, Mehrere Links: {multiple}, Link mehreren POIs zugeordnet: {shared}',
        highlighted: '{count} Places auf der Karte hervorgehoben',
        resultsCleared: 'Ergebnisse gelöscht',
        csvExported: 'Ergebnisse als CSV exportiert',
        jsonExported: 'Ergebnisse als JSON exportiert',
        noResults: 'Keine Ergebnisse gefunden',
        status: 'Status',
        name: 'Name',
        category: 'Kategorie',
        lock: 'Lock',
        info: 'Info',
        noGoogleLink: 'Kein Google Link',
        sharedWith: 'Geteilt mit {count} anderen',
        differentLinks: '{count} verschiedene Links',
        thisLinkUsedBy: 'Dieser Google Link wird auch verwendet von:',
        thisPlaceHasLinks: 'Dieser Place hat {count} verschiedene Google Links:',
        noLinkDescription: 'Dieser Place hat keine Google-Verknüpfung',
        // Kategorien
        catGasStation: '⛽ Tankstelle',
        catParkingLot: '🅿️ Parkplatz',
        catHospital: '🏥 Krankenhaus',
        catRestaurant: '🍽️ Restaurant',
        catHotel: '🏨 Hotel',
        catSupermarket: '🛒 Supermarkt',
        catBank: '🏦 Bank',
        catShoppingCenter: '🛍️ Einkaufszentrum',
        catPharmacy: '💊 Apotheke',
        catCafe: '☕ Café',
        catBar: '🍺 Bar',
        catFastFood: '🍔 Fast Food',
        catBakery: '🥖 Bäckerei',
        catConvenienceStore: '🏪 Kiosk',
        catSchool: '🏫 Schule',
        catUniversity: '🎓 Universität',
        catLibrary: '📚 Bibliothek',
        catPostOffice: '📮 Post',
        catPoliceStation: '👮 Polizei',
        catFireDepartment: '🚒 Feuerwehr',
        catGovernment: '🏛️ Behörde',
        catTouristAttraction: '🎭 Sehenswürdigkeit',
        catMuseum: '🖼️ Museum',
        catPark: '🌳 Park',
        catSportsCourt: '⚽ Sportplatz',
        catGym: '💪 Fitnessstudio',
        catSwimmingPool: '🏊 Schwimmbad',
        catStadium: '🏟️ Stadion',
        catMovieTheater: '🎬 Kino',
        catTheater: '🎭 Theater',
        catNightclub: '🎵 Nachtclub',
        catChurch: '⛪ Kirche',
        catCemetery: '🪦 Friedhof',
        catCarWash: '🚿 Autowaschanlage',
        catCarRental: '🚗 Autovermietung',
        catCarDealer: '🚙 Autohaus',
        catAutoRepair: '🔧 Autowerkstatt',
        catChargingStation: '🔌 Ladestation',
        catAirport: '✈️ Flughafen',
        catTrainStation: '🚂 Bahnhof',
        catBusStation: '🚌 Bushaltestelle',
        catFerryPier: '⛴️ Fähranleger',
        catBridge: '🌉 Brücke',
        catTunnel: '🚇 Tunnel',
        catJunction: '🛣️ Autobahnkreuz',
        catTollBooth: '💰 Mautstelle',
        catConstruction: '🚧 Baustelle',
        catFactory: '🏭 Fabrik',
        catOffice: '🏢 Büro',
        catResidential: '🏘️ Wohngebiet',
        catNaturalFeatures: '🏔️ Naturmerkmal'
    },
    en: {
        tabName: 'G Link',
        tabTitle: 'Google Places Link Checker',
        selectShape: 'Select shape:',
        size: 'Size:',
        radius: 'Radius:',
        filterOptions: 'Filter & Options',
        categories: 'Categories:',
        allCategories: 'All Categories',
        ctrlClickMulti: 'Ctrl+Click for multi-select',
        lockLevel: 'Lock Level:',
        allLockLevels: 'All Lock Levels',
        nameContains: 'Name contains:',
        useRegex: 'Use regex',
        placeType: 'Place Type:',
        pointPlaces: 'Point Places',
        areaPlaces: 'Area Places',
        scanArea: 'Scan Area:',
        scanOnlyEditable: 'Viewport editable',
        scanEntireViewport: 'Entire viewport',
        scanSelectedAreas: 'Selected areas',
        selectEditableAreas: 'Select editable areas:',
        selectAllAreas: 'Select all',
        deselectAllAreas: 'Deselect all',
        noEditableAreasFound: 'No editable areas found',
        analyzingEditableAreas: 'Analyzing editable areas...',
        scanOnlyEditableTooltip: 'Scans only editable areas in current viewport (based on your rank and lock levels)',
        scanEntireViewportTooltip: 'Scans the entire visible map area',
        startScan: 'Start Scan',
        pause: 'Pause',
        resume: 'Resume',
        stop: 'Stop',
        progress: 'Progress:',
        placesChecked: 'Places checked:',
        noLink: 'No link:',
        linkSharedMultiplePOIs: 'Link shared with multiple POIs:',
        multipleLinksOnePlace: 'Multiple links on same place:',
        results: 'Results:',
        sortBy: 'Sort by:',
        byName: 'By Name',
        byCategory: 'By Category',
        byLockLevel: 'By Lock Level',
        exportCSV: 'CSV',
        exportJSON: 'JSON',
        clear: 'Clear',
        showNoLink: 'Show without link',
        showDuplicateLinks: 'Show duplicate links (shared)',
        showMultipleLinks: 'Show multiple links (same place)',
        highlightOnMap: 'Highlight duplicates on map',
        scanStarted: 'Starting scan over {tiles} areas...',
        scanPaused: 'Scan paused',
        scanResumed: 'Scan resumed',
        scanStopped: 'Scan stopped',
        scanComplete: 'Scan complete! {places} places checked.',
        scanStats: 'No link: {nolink}, Multiple links: {multiple}, Link shared with multiple POIs: {shared}',
        highlighted: '{count} places highlighted on map',
        resultsCleared: 'Results cleared',
        csvExported: 'Results exported as CSV',
        jsonExported: 'Results exported as JSON',
        noResults: 'No results found',
        status: 'Status',
        name: 'Name',
        category: 'Category',
        lock: 'Lock',
        info: 'Info',
        noGoogleLink: 'No Google Link',
        sharedWith: 'Shared with {count} others',
        differentLinks: '{count} different links',
        thisLinkUsedBy: 'This Google link is also used by:',
        thisPlaceHasLinks: 'This place has {count} different Google links:',
        noLinkDescription: 'This place has no Google connection',
        // Categories
        catGasStation: '⛽ Gas Station',
        catParkingLot: '🅿️ Parking Lot',
        catHospital: '🏥 Hospital',
        catRestaurant: '🍽️ Restaurant',
        catHotel: '🏨 Hotel',
        catSupermarket: '🛒 Supermarket',
        catBank: '🏦 Bank',
        catShoppingCenter: '🛍️ Shopping Center',
        catPharmacy: '💊 Pharmacy',
        catCafe: '☕ Cafe',
        catBar: '🍺 Bar',
        catFastFood: '🍔 Fast Food',
        catBakery: '🥖 Bakery',
        catConvenienceStore: '🏪 Convenience Store',
        catSchool: '🏫 School',
        catUniversity: '🎓 University',
        catLibrary: '📚 Library',
        catPostOffice: '📮 Post Office',
        catPoliceStation: '👮 Police Station',
        catFireDepartment: '🚒 Fire Department',
        catGovernment: '🏛️ Government',
        catTouristAttraction: '🎭 Tourist Attraction',
        catMuseum: '🖼️ Museum',
        catPark: '🌳 Park',
        catSportsCourt: '⚽ Sports Court',
        catGym: '💪 Gym',
        catSwimmingPool: '🏊 Swimming Pool',
        catStadium: '🏟️ Stadium',
        catMovieTheater: '🎬 Movie Theater',
        catTheater: '🎭 Theater',
        catNightclub: '🎵 Nightclub',
        catChurch: '⛪ Church',
        catCemetery: '🪦 Cemetery',
        catCarWash: '🚿 Car Wash',
        catCarRental: '🚗 Car Rental',
        catCarDealer: '🚙 Car Dealer',
        catAutoRepair: '🔧 Auto Repair',
        catChargingStation: '🔌 Charging Station',
        catAirport: '✈️ Airport',
        catTrainStation: '🚂 Train Station',
        catBusStation: '🚌 Bus Station',
        catFerryPier: '⛴️ Ferry Pier',
        catBridge: '🌉 Bridge',
        catTunnel: '🚇 Tunnel',
        catJunction: '🛣️ Junction',
        catTollBooth: '💰 Toll Booth',
        catConstruction: '🚧 Construction',
        catFactory: '🏭 Factory',
        catOffice: '🏢 Office',
        catResidential: '🏘️ Residential',
        catNaturalFeatures: '🏔️ Natural Features'
    },
    it: {
        tabName: 'G Link',
        tabTitle: 'Google Places Link Checker',
        filterOptions: 'Filtri & Opzioni',
        categories: 'Categorie:',
        allCategories: 'Tutte le Categorie',
        ctrlClickMulti: 'Ctrl+Clic per selezione multipla',
        lockLevel: 'Livello Lock:',
        allLockLevels: 'Tutti i Livelli Lock',
        nameContains: 'Nome contiene:',
        useRegex: 'Usa regex',
        placeType: 'Tipo Luogo:',
        pointPlaces: 'Luoghi Punto',
        areaPlaces: 'Luoghi Area',
        scanArea: 'Area di Scansione:',
        scanOnlyEditable: 'Viewport modificabile',
        scanEntireViewport: 'Intero viewport',
        scanSelectedAreas: 'Aree selezionate',
        selectEditableAreas: 'Seleziona aree modificabili:',
        selectAllAreas: 'Seleziona tutto',
        deselectAllAreas: 'Deseleziona tutto',
        noEditableAreasFound: 'Nessuna area modificabile trovata',
        analyzingEditableAreas: 'Analizzando aree modificabili...',
        scanOnlyEditableTooltip: 'Scansiona solo le aree modificabili nel viewport corrente (basato sul tuo rango e livelli di blocco)',
        scanEntireViewportTooltip: 'Scansiona l\'intera area della mappa visibile',
        startScan: 'Avvia Scansione',
        pause: 'Pausa',
        resume: 'Riprendi',
        stop: 'Stop',
        progress: 'Progresso:',
        placesChecked: 'Luoghi controllati:',
        noLink: 'Senza link:',
        linkSharedMultiplePOIs: 'Link condiviso con più POI:',
        multipleLinksOnePlace: 'Più link nello stesso luogo:',
        results: 'Risultati:',
        sortBy: 'Ordina per:',
        byName: 'Per Nome',
        byCategory: 'Per Categoria',
        byLockLevel: 'Per Livello Lock',
        exportCSV: 'CSV',
        exportJSON: 'JSON',
        clear: 'Cancella',
        showNoLink: 'Mostra senza link',
        showDuplicateLinks: 'Mostra link duplicati (condivisi)',
        showMultipleLinks: 'Mostra più link (stesso luogo)',
        highlightOnMap: 'Evidenzia duplicati sulla mappa',
        scanComplete: 'Scansione completata! {places} luoghi controllati.',
        noResults: 'Nessun risultato trovato',
        noGoogleLink: 'Nessun Link Google',
        sharedWith: 'Condiviso con {count} altri',
        // Categorie
        catGasStation: '⛽ Stazione di Servizio',
        catParkingLot: '🅿️ Parcheggio',
        catHospital: '🏥 Ospedale',
        catRestaurant: '🍽️ Ristorante',
        catHotel: '🏨 Hotel',
        catSupermarket: '🛒 Supermercato',
        catBank: '🏦 Banca',
        catShoppingCenter: '🛍️ Centro Commerciale',
        catPharmacy: '💊 Farmacia',
        catCafe: '☕ Caffè',
        catBar: '🍺 Bar',
        catFastFood: '🍔 Fast Food',
        catBakery: '🥖 Panetteria',
        catConvenienceStore: '🏪 Minimarket',
        catSchool: '🏫 Scuola',
        catUniversity: '🎓 Università',
        catLibrary: '📚 Biblioteca',
        catPostOffice: '📮 Ufficio Postale',
        catPoliceStation: '👮 Stazione di Polizia',
        catFireDepartment: '🚒 Vigili del Fuoco',
        catGovernment: '🏛️ Governo',
        catTouristAttraction: '🎭 Attrazione Turistica',
        catMuseum: '🖼️ Museo',
        catPark: '🌳 Parco',
        catSportsCourt: '⚽ Campo Sportivo',
        catGym: '💪 Palestra',
        catSwimmingPool: '🏊 Piscina',
        catStadium: '🏟️ Stadio',
        catMovieTheater: '🎬 Cinema',
        catTheater: '🎭 Teatro',
        catNightclub: '🎵 Discoteca',
        catChurch: '⛪ Chiesa',
        catCemetery: '🪦 Cimitero',
        catCarWash: '🚿 Autolavaggio',
        catCarRental: '🚗 Noleggio Auto',
        catCarDealer: '🚙 Concessionaria',
        catAutoRepair: '🔧 Officina',
        catChargingStation: '🔌 Stazione di Ricarica',
        catAirport: '✈️ Aeroporto',
        catTrainStation: '🚂 Stazione Ferroviaria',
        catBusStation: '🚌 Stazione degli Autobus',
        catFerryPier: '⛴️ Molo Traghetti',
        catBridge: '🌉 Ponte',
        catTunnel: '🚇 Tunnel',
        catJunction: '🛣️ Svincolo',
        catTollBooth: '💰 Casello',
        catConstruction: '🚧 Cantiere',
        catFactory: '🏭 Fabbrica',
        catOffice: '🏢 Ufficio',
        catResidential: '🏘️ Residenziale',
        catNaturalFeatures: '🏔️ Caratteristiche Naturali'
    },
    es: {
        tabName: 'G Link',
        tabTitle: 'Google Places Link Checker',
        filterOptions: 'Filtros y Opciones',
        categories: 'Categorías:',
        allCategories: 'Todas las Categorías',
        ctrlClickMulti: 'Ctrl+Clic para selección múltiple',
        lockLevel: 'Nivel de Bloqueo:',
        allLockLevels: 'Todos los Niveles',
        nameContains: 'Nombre contiene:',
        useRegex: 'Usar regex',
        placeType: 'Tipo de Lugar:',
        pointPlaces: 'Lugares Punto',
        areaPlaces: 'Lugares Área',
        scanArea: 'Área de Escaneo:',
        scanOnlyEditable: 'Viewport editable',
        scanEntireViewport: 'Todo el viewport',
        scanSelectedAreas: 'Áreas seleccionadas',
        selectEditableAreas: 'Seleccionar áreas editables:',
        selectAllAreas: 'Seleccionar todo',
        deselectAllAreas: 'Deseleccionar todo',
        noEditableAreasFound: 'No se encontraron áreas editables',
        analyzingEditableAreas: 'Analizando áreas editables...',
        scanOnlyEditableTooltip: 'Escanea solo áreas editables en el viewport actual (basado en tu rango y niveles de bloqueo)',
        scanEntireViewportTooltip: 'Escanea toda el área visible del mapa',
        startScan: 'Iniciar Escaneo',
        pause: 'Pausa',
        resume: 'Reanudar',
        stop: 'Detener',
        progress: 'Progreso:',
        placesChecked: 'Lugares verificados:',
        noLink: 'Sin enlace:',
        linkSharedMultiplePOIs: 'Enlace compartido con múltiples POIs:',
        multipleLinksOnePlace: 'Múltiples enlaces en el mismo lugar:',
        results: 'Resultados:',
        sortBy: 'Ordenar por:',
        byName: 'Por Nombre',
        byCategory: 'Por Categoría',
        byLockLevel: 'Por Nivel de Bloqueo',
        exportCSV: 'CSV',
        exportJSON: 'JSON',
        clear: 'Limpiar',
        showNoLink: 'Mostrar sin enlace',
        showDuplicateLinks: 'Mostrar enlaces duplicados (compartidos)',
        showMultipleLinks: 'Mostrar múltiples enlaces (mismo lugar)',
        highlightOnMap: 'Resaltar duplicados en el mapa',
        scanComplete: '¡Escaneo completado! {places} lugares verificados.',
        noResults: 'No se encontraron resultados',
        noGoogleLink: 'Sin Enlace Google',
        sharedWith: 'Compartido con {count} otros',
        // Categorías
        catGasStation: '⛽ Gasolinera',
        catParkingLot: '🅿️ Estacionamiento',
        catHospital: '🏥 Hospital',
        catRestaurant: '🍽️ Restaurante',
        catHotel: '🏨 Hotel',
        catSupermarket: '🛒 Supermercado',
        catBank: '🏦 Banco',
        catShoppingCenter: '🛍️ Centro Comercial',
        catPharmacy: '💊 Farmacia',
        catCafe: '☕ Cafetería',
        catBar: '🍺 Bar',
        catFastFood: '🍔 Comida Rápida',
        catBakery: '🥖 Panadería',
        catConvenienceStore: '🏪 Tienda de Conveniencia',
        catSchool: '🏫 Escuela',
        catUniversity: '🎓 Universidad',
        catLibrary: '📚 Biblioteca',
        catPostOffice: '📮 Oficina de Correos',
        catPoliceStation: '👮 Estación de Policía',
        catFireDepartment: '🚒 Estación de Bomberos',
        catGovernment: '🏛️ Gobierno',
        catTouristAttraction: '🎭 Atracción Turística',
        catMuseum: '🖼️ Museo',
        catPark: '🌳 Parque',
        catSportsCourt: '⚽ Campo Deportivo',
        catGym: '💪 Gimnasio',
        catSwimmingPool: '🏊 Piscina',
        catStadium: '🏟️ Estadio',
        catMovieTheater: '🎬 Cine',
        catTheater: '🎭 Teatro',
        catNightclub: '🎵 Discoteca',
        catChurch: '⛪ Iglesia',
        catCemetery: '🪦 Cementerio',
        catCarWash: '🚿 Lavado de Autos',
        catCarRental: '🚗 Alquiler de Autos',
        catCarDealer: '🚙 Concesionario',
        catAutoRepair: '🔧 Taller Mecánico',
        catChargingStation: '🔌 Estación de Carga',
        catAirport: '✈️ Aeropuerto',
        catTrainStation: '🚂 Estación de Tren',
        catBusStation: '🚌 Estación de Autobuses',
        catFerryPier: '⛴️ Muelle de Ferry',
        catBridge: '🌉 Puente',
        catTunnel: '🚇 Túnel',
        catJunction: '🛣️ Intercambio',
        catTollBooth: '💰 Peaje',
        catConstruction: '🚧 Construcción',
        catFactory: '🏭 Fábrica',
        catOffice: '🏢 Oficina',
        catResidential: '🏘️ Residencial',
        catNaturalFeatures: '🏔️ Características Naturales'
    },
    fr: {
        tabName: 'G Link',
        tabTitle: 'Google Places Link Checker',
        filterOptions: 'Filtres et Options',
        categories: 'Catégories:',
        allCategories: 'Toutes les Catégories',
        ctrlClickMulti: 'Ctrl+Clic pour sélection multiple',
        lockLevel: 'Niveau de Verrouillage:',
        allLockLevels: 'Tous les Niveaux',
        nameContains: 'Nom contient:',
        useRegex: 'Utiliser regex',
        placeType: 'Type de Lieu:',
        pointPlaces: 'Lieux Point',
        areaPlaces: 'Lieux Zone',
        scanArea: 'Zone de Scan:',
        scanOnlyEditable: 'Viewport éditable',
        scanEntireViewport: 'Viewport entier',
        scanSelectedAreas: 'Zones sélectionnées',
        selectEditableAreas: 'Sélectionner zones éditables:',
        selectAllAreas: 'Tout sélectionner',
        deselectAllAreas: 'Tout désélectionner',
        noEditableAreasFound: 'Aucune zone éditable trouvée',
        analyzingEditableAreas: 'Analyse des zones éditables...',
        scanOnlyEditableTooltip: 'Scanne seulement les zones éditables dans le viewport actuel (basé sur votre rang et niveaux de verrouillage)',
        scanEntireViewportTooltip: 'Scanne toute la zone visible de la carte',
        startScan: 'Démarrer Scan',
        pause: 'Pause',
        resume: 'Reprendre',
        stop: 'Arrêter',
        progress: 'Progression:',
        placesChecked: 'Lieux vérifiés:',
        noLink: 'Sans lien:',
        linkSharedMultiplePOIs: 'Lien partagé avec plusieurs POIs:',
        multipleLinksOnePlace: 'Plusieurs liens au même endroit:',
        results: 'Résultats:',
        sortBy: 'Trier par:',
        byName: 'Par Nom',
        byCategory: 'Par Catégorie',
        byLockLevel: 'Par Niveau de Verrouillage',
        exportCSV: 'CSV',
        exportJSON: 'JSON',
        clear: 'Effacer',
        showNoLink: 'Afficher sans lien',
        showDuplicateLinks: 'Afficher liens dupliqués (partagés)',
        showMultipleLinks: 'Afficher plusieurs liens (même lieu)',
        highlightOnMap: 'Surligner les doublons sur la carte',
        scanComplete: 'Scan terminé! {places} lieux vérifiés.',
        noResults: 'Aucun résultat trouvé',
        noGoogleLink: 'Pas de Lien Google',
        sharedWith: 'Partagé avec {count} autres',
        // Catégories
        catGasStation: '⛽ Station-service',
        catParkingLot: '🅿️ Parking',
        catHospital: '🏥 Hôpital',
        catRestaurant: '🍽️ Restaurant',
        catHotel: '🏨 Hôtel',
        catSupermarket: '🛒 Supermarché',
        catBank: '🏦 Banque',
        catShoppingCenter: '🛍️ Centre Commercial',
        catPharmacy: '💊 Pharmacie',
        catCafe: '☕ Café',
        catBar: '🍺 Bar',
        catFastFood: '🍔 Fast Food',
        catBakery: '🥖 Boulangerie',
        catConvenienceStore: '🏪 Supérette',
        catSchool: '🏫 École',
        catUniversity: '🎓 Université',
        catLibrary: '📚 Bibliothèque',
        catPostOffice: '📮 Bureau de Poste',
        catPoliceStation: '👮 Commissariat',
        catFireDepartment: '🚒 Caserne de Pompiers',
        catGovernment: '🏛️ Gouvernement',
        catTouristAttraction: '🎭 Attraction Touristique',
        catMuseum: '🖼️ Musée',
        catPark: '🌳 Parc',
        catSportsCourt: '⚽ Terrain de Sport',
        catGym: '💪 Salle de Sport',
        catSwimmingPool: '🏊 Piscine',
        catStadium: '🏟️ Stade',
        catMovieTheater: '🎬 Cinéma',
        catTheater: '🎭 Théâtre',
        catNightclub: '🎵 Boîte de Nuit',
        catChurch: '⛪ Église',
        catCemetery: '🪦 Cimetière',
        catCarWash: '🚿 Lavage Auto',
        catCarRental: '🚗 Location de Voiture',
        catCarDealer: '🚙 Concessionnaire',
        catAutoRepair: '🔧 Garage',
        catChargingStation: '🔌 Borne de Recharge',
        catAirport: '✈️ Aéroport',
        catTrainStation: '🚂 Gare',
        catBusStation: '🚌 Gare Routière',
        catFerryPier: '⛴️ Embarcadère',
        catBridge: '🌉 Pont',
        catTunnel: '🚇 Tunnel',
        catJunction: '🛣️ Échangeur',
        catTollBooth: '💰 Péage',
        catConstruction: '🚧 Chantier',
        catFactory: '🏭 Usine',
        catOffice: '🏢 Bureau',
        catResidential: '🏘️ Résidentiel',
        catNaturalFeatures: '🏔️ Caractéristiques Naturelles'
    },
    nl: {
        tabName: 'G Link',
        tabTitle: 'Google Places Link Checker',
        filterOptions: 'Filters & Opties',
        categories: 'Categorieën:',
        allCategories: 'Alle Categorieën',
        ctrlClickMulti: 'Ctrl+Klik voor meervoudige selectie',
        lockLevel: 'Vergrendelniveau:',
        allLockLevels: 'Alle Niveaus',
        nameContains: 'Naam bevat:',
        useRegex: 'Gebruik regex',
        placeType: 'Plaats Type:',
        pointPlaces: 'Punt Plaatsen',
        areaPlaces: 'Gebied Plaatsen',
        scanArea: 'Scan Gebied:',
        scanOnlyEditable: 'Viewport bewerkbaar',
        scanEntireViewport: 'Hele viewport',
        scanSelectedAreas: 'Geselecteerde gebieden',
        selectEditableAreas: 'Selecteer bewerkbare gebieden:',
        selectAllAreas: 'Alles selecteren',
        deselectAllAreas: 'Alles deselecteren',
        noEditableAreasFound: 'Geen bewerkbare gebieden gevonden',
        analyzingEditableAreas: 'Analyseren bewerkbare gebieden...',
        scanOnlyEditableTooltip: 'Scant alleen bewerkbare gebieden in de huidige viewport (gebaseerd op je rang en vergrendelniveaus)',
        scanEntireViewportTooltip: 'Scant het hele zichtbare kaartgebied',
        startScan: 'Start Scan',
        pause: 'Pauze',
        resume: 'Hervatten',
        stop: 'Stop',
        progress: 'Voortgang:',
        placesChecked: 'Plaatsen gecontroleerd:',
        noLink: 'Zonder link:',
        linkSharedMultiplePOIs: 'Link gedeeld met meerdere POIs:',
        multipleLinksOnePlace: 'Meerdere links op dezelfde plaats:',
        results: 'Resultaten:',
        sortBy: 'Sorteren op:',
        byName: 'Op Naam',
        byCategory: 'Op Categorie',
        byLockLevel: 'Op Vergrendelniveau',
        exportCSV: 'CSV',
        exportJSON: 'JSON',
        clear: 'Wissen',
        showNoLink: 'Toon zonder link',
        showDuplicateLinks: 'Toon dubbele links (gedeeld)',
        showMultipleLinks: 'Toon meerdere links (zelfde plaats)',
        highlightOnMap: 'Markeer duplicaten op kaart',
        scanComplete: 'Scan voltooid! {places} plaatsen gecontroleerd.',
        noResults: 'Geen resultaten gevonden',
        noGoogleLink: 'Geen Google Link',
        sharedWith: 'Gedeeld met {count} anderen',
        // Categorieën
        catGasStation: '⛽ Tankstation',
        catParkingLot: '🅿️ Parkeerplaats',
        catHospital: '🏥 Ziekenhuis',
        catRestaurant: '🍽️ Restaurant',
        catHotel: '🏨 Hotel',
        catSupermarket: '🛒 Supermarkt',
        catBank: '🏦 Bank',
        catShoppingCenter: '🛍️ Winkelcentrum',
        catPharmacy: '💊 Apotheek',
        catCafe: '☕ Café',
        catBar: '🍺 Bar',
        catFastFood: '🍔 Fast Food',
        catBakery: '🥖 Bakkerij',
        catConvenienceStore: '🏪 Buurtwinkel',
        catSchool: '🏫 School',
        catUniversity: '🎓 Universiteit',
        catLibrary: '📚 Bibliotheek',
        catPostOffice: '📮 Postkantoor',
        catPoliceStation: '👮 Politiebureau',
        catFireDepartment: '🚒 Brandweerkazerne',
        catGovernment: '🏛️ Overheid',
        catTouristAttraction: '🎭 Toeristische Attractie',
        catMuseum: '🖼️ Museum',
        catPark: '🌳 Park',
        catSportsCourt: '⚽ Sportveld',
        catGym: '💪 Sportschool',
        catSwimmingPool: '🏊 Zwembad',
        catStadium: '🏟️ Stadion',
        catMovieTheater: '🎬 Bioscoop',
        catTheater: '🎭 Theater',
        catNightclub: '🎵 Nachtclub',
        catChurch: '⛪ Kerk',
        catCemetery: '🪦 Begraafplaats',
        catCarWash: '🚿 Autowasserette',
        catCarRental: '🚗 Autoverhuur',
        catCarDealer: '🚙 Autodealer',
        catAutoRepair: '🔧 Garage',
        catChargingStation: '🔌 Laadstation',
        catAirport: '✈️ Luchthaven',
        catTrainStation: '🚂 Treinstation',
        catBusStation: '🚌 Busstation',
        catFerryPier: '⛴️ Veersteiger',
        catBridge: '🌉 Brug',
        catTunnel: '🚇 Tunnel',
        catJunction: '🛣️ Knooppunt',
        catTollBooth: '💰 Tolpoort',
        catConstruction: '🚧 Bouwplaats',
        catFactory: '🏭 Fabriek',
        catOffice: '🏢 Kantoor',
        catResidential: '🏘️ Woonwijk',
        catNaturalFeatures: '🏔️ Natuurlijke Kenmerken'
    }
};

let currentLang = 'en';
let languageCheckInterval = null;

function detectLanguage() {
    try {
        // Priorität 1: WME Sprache aus I18n (nach WME-Ready)
        // Versuche verschiedene Methoden
        let locale = null;
        
        // Methode 1: I18n.locale (ältere WME Scripts)
        if (typeof I18n !== 'undefined' && I18n.locale) {
            locale = I18n.locale;
            console.log(`${SCRIPT_NAME}: I18n.locale detected: ${locale}`);
        }
        // Methode 2: window.I18n.currentLocale() (neuere Methode)
        else if (window.I18n?.currentLocale) {
            locale = window.I18n.currentLocale();
            console.log(`${SCRIPT_NAME}: window.I18n.currentLocale() detected: ${locale}`);
        }
        
        if (locale) {
            const lang = locale.split('-')[0].toLowerCase();
            console.log(`${SCRIPT_NAME}: Extracted language: ${lang}`);
            if (I18N[lang]) {
                console.log(`${SCRIPT_NAME}: Using WME language: ${lang}`);
                return lang;
            }
        }
        
        // Priorität 2: Browser-Sprache (nur als Fallback)
        const browserLang = navigator.language?.split('-')[0].toLowerCase();
        if (I18N[browserLang]) {
            console.log(`${SCRIPT_NAME}: Using browser language as fallback: ${browserLang}`);
            return browserLang;
        }
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Error detecting language:`, e);
    }
    
    console.log(`${SCRIPT_NAME}: Using default language: en`);
    return 'en';
}

function startLanguageMonitoring() {
    // Überwache Sprachwechsel alle 2 Sekunden
    if (languageCheckInterval) {
        clearInterval(languageCheckInterval);
    }
    
    languageCheckInterval = setInterval(() => {
        const newLang = detectLanguage();
        if (newLang !== currentLang) {
            console.log(`${SCRIPT_NAME}: Sprachwechsel erkannt: ${currentLang} -> ${newLang}`);
            currentLang = newLang;
            updateUILanguage();
        }
    }, 2000);
}

function updateUILanguage() {
    console.log(`${SCRIPT_NAME}: Aktualisiere UI auf Sprache: ${currentLang}`);
    
    // Tab-Titel aktualisieren
    const tabLabel = document.querySelector('.sidebar-tab-label');
    if (tabLabel && tabLabel.textContent.includes('🔗')) {
        tabLabel.textContent = `🔗 ${t('tabName')}`;
        tabLabel.title = t('tabTitle');
    }
    
    // Tab-Inhalt neu erstellen
    let tabPane = document.querySelector(`#sidepanel-${SCRIPT_ID}`);
    
    // Fallback UI Container
    let fallbackContainer = document.getElementById('google-places-checker-ui');
    
    if (tabPane || fallbackContainer) {
        // Aktuelle Werte speichern
        const categoryFilter = document.getElementById('gplc-category-filter');
        const lockFilter = document.getElementById('gplc-lock-filter');
        const nameFilter = document.getElementById('gplc-name-filter');
        const nameRegex = document.getElementById('gplc-name-regex');
        const filterPoint = document.getElementById('gplc-filter-point');
        const filterArea = document.getElementById('gplc-filter-area');
        const scanEditable = document.getElementById('gplc-scan-editable');
        const scanViewport = document.getElementById('gplc-scan-viewport');
        const scanSelected = document.getElementById('gplc-scan-selected');
        const showNoLink = document.getElementById('gplc-show-nolink');
        const showDuplicateLinks = document.getElementById('gplc-show-duplicate');
        const showMultipleLinks = document.getElementById('gplc-show-multiple');
        const highlightOnMap = document.getElementById('gplc-highlight-map');
        
        const savedValues = {
            categories: categoryFilter ? Array.from(categoryFilter.selectedOptions).map(o => o.value) : ['ALL'],
            lockLevel: lockFilter ? lockFilter.value : 'ALL',
            nameText: nameFilter ? nameFilter.value : '',
            nameRegexChecked: nameRegex ? nameRegex.checked : false,
            pointChecked: filterPoint ? filterPoint.checked : true,
            areaChecked: filterArea ? filterArea.checked : true,
            scanEditableChecked: scanEditable ? scanEditable.checked : false,
            scanViewportChecked: scanViewport ? scanViewport.checked : true,
            scanSelectedChecked: scanSelected ? scanSelected.checked : false,
            showNoLinkChecked: showNoLink ? showNoLink.checked : true,
            showDuplicateChecked: showDuplicateLinks ? showDuplicateLinks.checked : true,
            showMultipleChecked: showMultipleLinks ? showMultipleLinks.checked : true,
            highlightChecked: highlightOnMap ? highlightOnMap.checked : false
        };
        
        // UI neu erstellen
        if (tabPane) {
            tabPane.innerHTML = getTabContent();
        } else if (fallbackContainer) {
            // Für Fallback UI nur den Inhalt aktualisieren, nicht den Header
            fallbackContainer.innerHTML = `
                <div style="background: #4a90e2; color: white; padding: 12px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 16px;">🔗 ${t('tabTitle')}</h3>
                    <button id="gplc-close-btn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 25px; height: 25px;">&times;</button>
                </div>
                ${getTabContent()}
            `;
            
            // Close button wieder verbinden
            document.getElementById('gplc-close-btn').onclick = () => {
                fallbackContainer.style.display = 'none';
            };
        }
        
        attachEventListeners();
        
        // Werte wiederherstellen
        setTimeout(() => {
            const newCategoryFilter = document.getElementById('gplc-category-filter');
            const newLockFilter = document.getElementById('gplc-lock-filter');
            const newNameFilter = document.getElementById('gplc-name-filter');
            const newNameRegex = document.getElementById('gplc-name-regex');
            const newFilterPoint = document.getElementById('gplc-filter-point');
            const newFilterArea = document.getElementById('gplc-filter-area');
            const newScanEditable = document.getElementById('gplc-scan-editable');
            const newScanViewport = document.getElementById('gplc-scan-viewport');
            const newScanSelected = document.getElementById('gplc-scan-selected');
            const newShowNoLink = document.getElementById('gplc-show-nolink');
            const newShowDuplicateLinks = document.getElementById('gplc-show-duplicate');
            const newShowMultipleLinks = document.getElementById('gplc-show-multiple');
            const newHighlightOnMap = document.getElementById('gplc-highlight-map');
            
            if (newCategoryFilter) {
                Array.from(newCategoryFilter.options).forEach(option => {
                    option.selected = savedValues.categories.includes(option.value);
                });
            }
            if (newLockFilter) newLockFilter.value = savedValues.lockLevel;
            if (newNameFilter) newNameFilter.value = savedValues.nameText;
            if (newNameRegex) newNameRegex.checked = savedValues.nameRegexChecked;
            if (newFilterPoint) newFilterPoint.checked = savedValues.pointChecked;
            if (newFilterArea) newFilterArea.checked = savedValues.areaChecked;
            if (newScanEditable) newScanEditable.checked = savedValues.scanEditableChecked;
            if (newScanViewport) newScanViewport.checked = savedValues.scanViewportChecked;
            if (newScanSelected) newScanSelected.checked = savedValues.scanSelectedChecked;
            if (newShowNoLink) newShowNoLink.checked = savedValues.showNoLinkChecked;
            if (newShowDuplicateLinks) newShowDuplicateLinks.checked = savedValues.showDuplicateChecked;
            if (newShowMultipleLinks) newShowMultipleLinks.checked = savedValues.showMultipleChecked;
            if (newHighlightOnMap) newHighlightOnMap.checked = savedValues.highlightChecked;
            
            // Ergebnisse neu rendern falls vorhanden
            if (scanState.results.length > 0) {
                renderResults();
            }
        }, 100);
    }
    
    console.log(`${SCRIPT_NAME}: UI-Sprache aktualisiert`);
}

function t(key, params = {}) {
    let text = I18N[currentLang]?.[key] || I18N.en[key] || key;
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

// SDK Instanz
let wmeSDK = null;

// Scan-Status
let scanState = {
    isScanning: false,
    isPaused: false,
    currentTile: 0,
    totalTiles: 0,
    placesFound: 0,
    placesWithoutLink: 0,
    placesWithDuplicateLinks: 0,
    placesWithSharedLinks: 0, // Neue Kategorie: Places die Links mit anderen teilen
    results: [],
    googleLinkMap: new Map(), // Map: Google Link ID -> Array von Places
    highlightLayer: null // OpenLayers Layer für visuelle Hervorhebung
};

// Grid-Scanner für Auto-Scroll
class GridScanner {
    constructor(bounds, tileSize = 500) {
        this.bounds = bounds;
        this.tileSize = tileSize; // Meter
        this.tiles = [];
        this.currentIndex = 0;
        this.generateTiles();
    }

    generateTiles() {
        const { minLon, minLat, maxLon, maxLat } = this.bounds;
        
        // Berechne Anzahl der Tiles
        const latDelta = this.tileSize / 111320; // 1 Grad Lat ≈ 111.32 km
        const lonDelta = this.tileSize / (111320 * Math.cos((minLat + maxLat) / 2 * Math.PI / 180));
        
        let lat = minLat;
        while (lat < maxLat) {
            let lon = minLon;
            while (lon < maxLon) {
                this.tiles.push({
                    centerLon: lon + lonDelta / 2,
                    centerLat: lat + latDelta / 2,
                    minLon: lon,
                    minLat: lat,
                    maxLon: Math.min(lon + lonDelta, maxLon),
                    maxLat: Math.min(lat + latDelta, maxLat)
                });
                lon += lonDelta;
            }
            lat += latDelta;
        }
        
        console.log(`${SCRIPT_NAME}: ${this.tiles.length} Tiles generiert`);
    }

    hasNext() {
        return this.currentIndex < this.tiles.length;
    }

    next() {
        if (!this.hasNext()) return null;
        return this.tiles[this.currentIndex++];
    }

    reset() {
        this.currentIndex = 0;
    }

    getProgress() {
        return {
            current: this.currentIndex,
            total: this.tiles.length,
            percentage: Math.round((this.currentIndex / this.tiles.length) * 100)
        };
    }
}

// Koordinaten-Utilities
const CoordUtils = {
    getCurrentBounds() {
        try {
            if (wmeSDK && wmeSDK.Map) {
                const center = wmeSDK.Map.getMapCenter();
                const zoom = wmeSDK.Map.getZoomLevel();
                
                if (center && center.lon !== undefined && center.lat !== undefined) {
                    const radiusMeters = Math.max(1000, 50000 / Math.pow(2, zoom - 10));
                    return this.getBoundsFromCenter(center.lon, center.lat, radiusMeters);
                }
            }
            
            // Fallback: W.map verwenden
            if (W && W.map) {
                const extent = W.map.getExtent();
                if (extent) {
                    const toWGS84 = (x, y) => {
                        const lon = x * 180 / 20037508.34;
                        let lat = y * 180 / 20037508.34;
                        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                        return { lon, lat };
                    };
                    
                    const bl = toWGS84(extent.left, extent.bottom);
                    const tr = toWGS84(extent.right, extent.top);
                    
                    return {
                        minLon: bl.lon,
                        minLat: bl.lat,
                        maxLon: tr.lon,
                        maxLat: tr.lat
                    };
                }
            }
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Abrufen der Bounds:`, e);
        }
        return null;
    },

    getBoundsFromCenter(centerLon, centerLat, radiusMeters) {
        const latDelta = radiusMeters / 111320;
        const lonDelta = radiusMeters / (111320 * Math.cos(centerLat * Math.PI / 180));
        return {
            minLon: centerLon - lonDelta,
            minLat: centerLat - latDelta,
            maxLon: centerLon + lonDelta,
            maxLat: centerLat + latDelta
        };
    },

    getEditableBounds() {
        try {
            // Methode 1: Verwende die aktuellen Edit-Rechte des Benutzers
            if (W && W.loginManager && W.loginManager.user) {
                const user = W.loginManager.user;
                const userRank = user.attributes.rank;
                
                // Hole die aktuell sichtbaren Segmente und prüfe Editierbarkeit
                if (W.model && W.model.segments) {
                    const segments = W.model.segments.getObjectArray();
                    const editableSegments = segments.filter(segment => {
                        if (!segment || !segment.attributes) return false;
                        
                        // Prüfe ob das Segment editierbar ist basierend auf Lock-Level und User-Rank
                        const lockRank = segment.attributes.lockRank || 0;
                        return userRank >= lockRank;
                    });
                    
                    if (editableSegments.length > 0) {
                        // Berechne Bounding Box aller editierbaren Segmente
                        let minLon = Infinity, minLat = Infinity;
                        let maxLon = -Infinity, maxLat = -Infinity;
                        
                        editableSegments.forEach(segment => {
                            const geometry = segment.getOLGeometry();
                            if (geometry && geometry.getBounds) {
                                const bounds = geometry.getBounds();
                                
                                // Konvertiere von Web Mercator zu WGS84
                                const toWGS84 = (x, y) => {
                                    const lon = x * 180 / 20037508.34;
                                    let lat = y * 180 / 20037508.34;
                                    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                                    return { lon, lat };
                                };
                                
                                const bl = toWGS84(bounds.left, bounds.bottom);
                                const tr = toWGS84(bounds.right, bounds.top);
                                
                                minLon = Math.min(minLon, bl.lon);
                                minLat = Math.min(minLat, bl.lat);
                                maxLon = Math.max(maxLon, tr.lon);
                                maxLat = Math.max(maxLat, tr.lat);
                            }
                        });
                        
                        if (minLon !== Infinity) {
                            console.log(`${SCRIPT_NAME}: Editierbare Bereiche basierend auf Segmenten ermittelt`);
                            return {
                                minLon: minLon,
                                minLat: minLat,
                                maxLon: maxLon,
                                maxLat: maxLat
                            };
                        }
                    }
                }
            }
            
            // Methode 2: Verwende kleineren Bereich um aktuellen Standort (editierbare Bereiche sind meist lokal)
            const currentBounds = this.getCurrentBounds();
            if (currentBounds) {
                // Reduziere den Bereich auf 50% der ursprünglichen Größe
                const centerLon = (currentBounds.minLon + currentBounds.maxLon) / 2;
                const centerLat = (currentBounds.minLat + currentBounds.maxLat) / 2;
                const lonDelta = (currentBounds.maxLon - currentBounds.minLon) * 0.25; // 50% / 2
                const latDelta = (currentBounds.maxLat - currentBounds.minLat) * 0.25; // 50% / 2
                
                console.log(`${SCRIPT_NAME}: Verwende reduzierten Bereich als editierbare Zone`);
                return {
                    minLon: centerLon - lonDelta,
                    minLat: centerLat - latDelta,
                    maxLon: centerLon + lonDelta,
                    maxLat: centerLat + latDelta
                };
            }
            
            // Fallback: Verwende aktuellen Viewport
            console.log(`${SCRIPT_NAME}: Konnte editierbare Bereiche nicht ermitteln, verwende Viewport`);
            return currentBounds;
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Abrufen der editierbaren Bounds:`, e);
            return this.getCurrentBounds();
        }
    }
};

// Places-Checker
class PlacesChecker {
    constructor() {
        this.scanner = null;
    }

    async startScan(bounds) {
        scanState.isScanning = true;
        scanState.isPaused = false;
        scanState.currentTile = 0;
        scanState.placesFound = 0;
        scanState.placesWithoutLink = 0;
        scanState.placesWithDuplicateLinks = 0;
        scanState.placesWithSharedLinks = 0;
        scanState.results = [];
        scanState.googleLinkMap = new Map(); // Reset der Link-Map
        
        // Entferne alte Highlights
        clearHighlights();

        this.scanner = new GridScanner(bounds, 500);
        scanState.totalTiles = this.scanner.tiles.length;

        log(`Starte Scan über ${scanState.totalTiles} Bereiche...`, 'info');
        updateUI();

        while (this.scanner.hasNext() && scanState.isScanning) {
            if (scanState.isPaused) {
                await this.waitForResume();
            }

            const tile = this.scanner.next();
            scanState.currentTile = this.scanner.currentIndex;

            // Karte zum Tile zentrieren
            await this.centerMapToTile(tile);

            // Warte auf Daten-Laden
            await this.waitForDataLoad();

            // Places im aktuellen Bereich prüfen
            await this.checkPlacesInView();

            updateUI();

            // Kurze Pause zwischen Tiles
            await this.delay(300);
        }

        if (scanState.isScanning) {
            scanState.isScanning = false;
            
            // Nach dem Scan: Duplikate identifizieren
            this.identifyDuplicates();
            
            // Highlights aktualisieren wenn aktiviert
            if (document.getElementById('gplc-highlight-map')?.checked) {
                updateMapHighlights();
            }
            
            log(`Scan abgeschlossen! ${scanState.placesFound} Places geprüft.`, 'success');
            log(`Ohne Link: ${scanState.placesWithoutLink}, Mehrere Links: ${scanState.placesWithDuplicateLinks}, Link mehreren POIs zugeordnet: ${scanState.placesWithSharedLinks}`, 'info');
            updateUI();
        }
    }

    async centerMapToTile(tile) {
        try {
            if (wmeSDK && wmeSDK.Map) {
                // SDK erwartet lonLat Objekt mit korrekter Struktur
                await wmeSDK.Map.setMapCenter({
                    lonLat: {
                        lon: tile.centerLon,
                        lat: tile.centerLat
                    }
                });
            } else if (W && W.map) {
                const toWebMercator = (lon, lat) => {
                    const x = lon * 20037508.34 / 180;
                    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
                    y = y * 20037508.34 / 180;
                    return { x, y };
                };
                
                const center = toWebMercator(tile.centerLon, tile.centerLat);
                W.map.setCenter(new OpenLayers.LonLat(center.x, center.y));
            }
            
            await this.delay(800);
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Zentrieren:`, e);
        }
    }

    async waitForDataLoad() {
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 20;
            
            const checkData = () => {
                attempts++;
                
                if (attempts >= maxAttempts) {
                    resolve();
                    return;
                }
                
                // Prüfe ob Daten geladen sind
                if (W && W.model && W.model.venues) {
                    const venues = W.model.venues.getObjectArray();
                    if (venues && venues.length > 0) {
                        resolve();
                        return;
                    }
                }
                
                setTimeout(checkData, 200);
            };
            
            checkData();
        });
    }

    async checkPlacesInView() {
        try {
            if (!W || !W.model || !W.model.venues) return;

            const venues = W.model.venues.getObjectArray();
            
            // Filter-Einstellungen holen
            const categoryFilter = getSelectedCategories();
            const lockFilter = document.getElementById('gplc-lock-filter')?.value || 'ALL';
            const nameFilter = document.getElementById('gplc-name-filter')?.value || '';
            const useRegex = document.getElementById('gplc-name-regex')?.checked || false;
            const filterPoint = document.getElementById('gplc-filter-point')?.checked ?? true;
            const filterArea = document.getElementById('gplc-filter-area')?.checked ?? true;
            
            for (const venue of venues) {
                if (!venue || !venue.attributes) continue;

                // Place-Typ Filter
                const isPoint = venue.isPoint();
                if (isPoint && !filterPoint) continue;
                if (!isPoint && !filterArea) continue;

                // Kategorie Filter
                if (!categoryFilter.includes('ALL')) {
                    const hasMatchingCategory = venue.attributes.categories.some(cat => 
                        categoryFilter.includes(cat)
                    );
                    if (!hasMatchingCategory) continue;
                }
                
                // Lock Level Filter
                if (lockFilter !== 'ALL') {
                    if (venue.attributes.lockRank !== parseInt(lockFilter)) continue;
                }
                
                // Namen Filter
                if (nameFilter) {
                    const name = venue.attributes.name || '';
                    let matches = false;
                    
                    if (useRegex) {
                        try {
                            const regex = new RegExp(nameFilter, 'i');
                            matches = regex.test(name);
                        } catch (e) {
                            // Ungültige Regex - als normaler Text behandeln
                            matches = name.toLowerCase().includes(nameFilter.toLowerCase());
                        }
                    } else {
                        matches = name.toLowerCase().includes(nameFilter.toLowerCase());
                    }
                    
                    if (!matches) continue;
                }

                scanState.placesFound++;

                const venueId = venue.attributes.id;
                const name = venue.attributes.name || 'Unbenannt';
                const categories = this.getVenueCategories(venue);
                const lockLevel = venue.attributes.lockRank + 1;
                
                // Prüfe Google Places Links
                const googleLinks = this.getGooglePlacesLinks(venue);
                
                // Speichere Place-Info für spätere Duplikat-Erkennung
                const placeInfo = {
                    venueId: venueId,
                    name: name,
                    categories: categories,
                    lockLevel: lockLevel,
                    permalink: this.getPermalink(venue),
                    googleLinks: googleLinks
                };
                
                if (googleLinks.length === 0) {
                    // Keine Google-Verknüpfung
                    scanState.placesWithoutLink++;
                    scanState.results.push({
                        type: 'no-link',
                        ...placeInfo
                    });
                } else {
                    // Place hat Google Links - in Map speichern für Duplikat-Check
                    googleLinks.forEach(link => {
                        if (!scanState.googleLinkMap.has(link.id)) {
                            scanState.googleLinkMap.set(link.id, []);
                        }
                        // Prüfe ob dieser Place nicht schon in der Liste ist (bei mehreren Links)
                        const alreadyAdded = scanState.googleLinkMap.get(link.id).some(p => p.venueId === venueId);
                        if (!alreadyAdded) {
                            scanState.googleLinkMap.get(link.id).push(placeInfo);
                        }
                    });
                    
                    // NICHT hier in results pushen - wir warten bis identifyDuplicates()
                    // um zu entscheiden ob es ein Problem gibt oder nicht
                }
            }
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Prüfen der Places:`, e);
        }
    }
    
    identifyDuplicates() {
        // Durchsuche die googleLinkMap nach Links, die von mehreren Places verwendet werden
        // oder Places die mehrere Links haben
        const processedVenues = new Set(); // Verhindere doppelte Einträge
        const venuesWithMultipleLinks = new Set(); // Places die mehrere Links haben
        
        // Erste Pass: Finde alle Places mit mehreren Links
        scanState.googleLinkMap.forEach((places, linkId) => {
            places.forEach(placeInfo => {
                if (placeInfo.googleLinks.length > 1) {
                    venuesWithMultipleLinks.add(placeInfo.venueId);
                }
            });
        });
        
        // Zweite Pass: Finde echte Duplikate (Links die von mehreren Places geteilt werden)
        scanState.googleLinkMap.forEach((places, linkId) => {
            if (places.length > 1) {
                // Dieser Google Link wird von mehreren Places verwendet - ECHTES DUPLIKAT
                scanState.placesWithSharedLinks += places.length; // Zähle alle betroffenen Places
                
                places.forEach((placeInfo, index) => {
                    if (processedVenues.has(placeInfo.venueId)) return;
                    
                    const otherPlaces = places.filter((_, i) => i !== index);
                    
                    // Prüfe ob dieser Place auch mehrere Links hat
                    let duplicateInfo = `Google Link wird von ${places.length} Places verwendet`;
                    if (venuesWithMultipleLinks.has(placeInfo.venueId)) {
                        duplicateInfo += ` (Place hat ${placeInfo.googleLinks.length} verschiedene Links)`;
                    }
                    
                    scanState.results.push({
                        type: 'duplicate-links',
                        ...placeInfo,
                        duplicateInfo: duplicateInfo,
                        duplicatePlaces: otherPlaces.map(p => ({
                            name: p.name,
                            venueId: p.venueId
                        }))
                    });
                    
                    processedVenues.add(placeInfo.venueId);
                });
            }
        });
        
        // Dritte Pass: Finde Places mit mehreren verschiedenen Links (die noch nicht als Duplikate markiert wurden)
        scanState.googleLinkMap.forEach((places, linkId) => {
            places.forEach(placeInfo => {
                // Wenn dieser Place mehr als einen Link hat UND noch nicht verarbeitet wurde
                if (placeInfo.googleLinks.length > 1 && !processedVenues.has(placeInfo.venueId)) {
                    scanState.results.push({
                        type: 'multiple-links-same-place',
                        ...placeInfo,
                        duplicateInfo: `Dieser Place hat ${placeInfo.googleLinks.length} verschiedene Google Links`
                    });
                    
                    processedVenues.add(placeInfo.venueId);
                }
            });
        });
        
        // Zähle die Duplikate korrekt (nur Places mit mehreren verschiedenen Links, NICHT die geteilten)
        scanState.placesWithDuplicateLinks = scanState.results.filter(r => 
            r.type === 'multiple-links-same-place'
        ).length;
    }

    getVenueCategories(venue) {
        try {
            const categories = venue.attributes.categories || [];
            return categories.map(cat => {
                if (typeof cat === 'string') return cat;
                if (cat && cat.name) return cat.name;
                return 'Unbekannt';
            }).join(', ');
        } catch (e) {
            return 'Unbekannt';
        }
    }

    getGooglePlacesLinks(venue) {
        const links = [];
        
        try {
            // externalProviderIDs ist ein Array von Provider-Objekten
            // Jeder Provider hat ein attributes-Objekt mit uuid
            const externalProviders = venue.attributes.externalProviderIDs || [];
            
            for (const provider of externalProviders) {
                if (!provider || !provider.attributes) continue;
                
                // Die UUID ist in provider.attributes.uuid
                const googleId = provider.attributes.uuid;
                
                if (googleId && typeof googleId === 'string') {
                    links.push({
                        provider: 'google',
                        id: googleId,
                        source: 'externalProviderIDs'
                    });
                }
            }

            // Duplikate entfernen (falls vorhanden)
            const uniqueLinks = [];
            const seenIds = new Set();
            for (const link of links) {
                if (!seenIds.has(link.id)) {
                    seenIds.add(link.id);
                    uniqueLinks.push(link);
                }
            }

            return uniqueLinks;
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Abrufen der Google Links:`, e);
        }
        
        return links;
    }

    getPermalink(venue) {
        try {
            const venueId = venue.attributes.id;
            const geometry = venue.getOLGeometry();
            
            if (geometry) {
                let centerPoint;
                
                if (geometry.CLASS_NAME === 'OpenLayers.Geometry.Point') {
                    // Point Place - verwende direkt die Koordinaten
                    centerPoint = geometry;
                } else {
                    // Area Place - berechne das Zentrum
                    centerPoint = geometry.getCentroid();
                }
                
                if (centerPoint) {
                    // Konvertiere von Web Mercator zu WGS84
                    const toWGS84 = (x, y) => {
                        const lon = x * 180 / 20037508.34;
                        let lat = y * 180 / 20037508.34;
                        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                        return { lon, lat };
                    };
                    
                    const coords = toWGS84(centerPoint.x, centerPoint.y);
                    return `https://www.waze.com/editor?env=row&lon=${coords.lon.toFixed(5)}&lat=${coords.lat.toFixed(5)}&zoomLevel=17&venues=${venueId}`;
                }
            }
            
            return `https://www.waze.com/editor?venues=${venueId}`;
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Erstellen des Permalinks:`, e);
            return '#';
        }
    }

    stopScan() {
        scanState.isScanning = false;
        scanState.isPaused = false;
        log('Scan gestoppt', 'warning');
        updateUI();
    }

    pauseScan() {
        scanState.isPaused = true;
        log('Scan pausiert', 'warning');
        updateUI();
    }

    resumeScan() {
        scanState.isPaused = false;
        log('Scan fortgesetzt', 'info');
        updateUI();
    }

    async waitForResume() {
        return new Promise(resolve => {
            const checkPause = () => {
                if (!scanState.isPaused || !scanState.isScanning) {
                    resolve();
                } else {
                    setTimeout(checkPause, 500);
                }
            };
            checkPause();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Editierbare Gebiete Analyzer
class EditableAreasAnalyzer {
    constructor() {
        this.editableAreas = [];
        this.selectedAreas = new Set();
    }

    async analyzeEditableAreas() {
        try {
            log(t('analyzingEditableAreas'), 'info');
            this.editableAreas = [];
            
            // Methode 1: Versuche WME "Your areas" Panel zu finden
            const areas = this.getAreasFromSidebar();
            if (areas.length > 0) {
                this.editableAreas = areas;
                log(`${this.editableAreas.length} Gebiete aus "Your areas" Panel gefunden`, 'success');
                return this.editableAreas;
            }
            
            // Methode 2: Versuche über WME API/Model
            const apiAreas = await this.getAreasFromAPI();
            if (apiAreas.length > 0) {
                this.editableAreas = apiAreas;
                log(`${this.editableAreas.length} Gebiete über API gefunden`, 'success');
                return this.editableAreas;
            }
            
            // Methode 3: Fallback - Analysiere basierend auf Segmenten (alte Methode)
            const segmentAreas = await this.getAreasFromSegments();
            if (segmentAreas.length > 0) {
                this.editableAreas = segmentAreas;
                log(`${this.editableAreas.length} Gebiete über Segment-Analyse gefunden`, 'success');
                return this.editableAreas;
            }
            
            log('Keine editierbaren Gebiete gefunden', 'warning');
            return [];
            
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler bei der Gebietsanalyse:`, e);
            log('Fehler bei der Gebietsanalyse', 'error');
            return [];
        }
    }

    getAreasFromSidebar() {
        try {
            const areas = [];
            
            // Suche nach "Your areas" Panel im DOM
            const areaItems = document.querySelectorAll('.area-item');
            
            areaItems.forEach((item, index) => {
                const titleElement = item.querySelector('.list-item-card-title');
                const captionElement = item.querySelector('wz-caption');
                
                if (titleElement && captionElement) {
                    const name = titleElement.textContent.trim();
                    const sizeText = captionElement.textContent.trim();
                    
                    // Extrahiere Größe (z.B. "4900 km²" -> 4900)
                    const sizeMatch = sizeText.match(/(\d+(?:\.\d+)?)\s*km²/);
                    const sizeKm2 = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
                    
                    // Versuche Bounds zu ermitteln (falls verfügbar)
                    const bounds = this.estimateBoundsFromSize(sizeKm2);
                    
                    areas.push({
                        id: `wme_area_${index}`,
                        name: name,
                        type: 'managed_area',
                        country: 'Managed Area',
                        bounds: bounds,
                        sizeKm2: sizeKm2,
                        segmentCount: Math.round(sizeKm2 * 50), // Grobe Schätzung: 50 Segmente pro km²
                        element: item // Referenz auf DOM Element für weitere Aktionen
                    });
                }
            });
            
            console.log(`${SCRIPT_NAME}: ${areas.length} Gebiete aus Sidebar gefunden:`, areas);
            return areas;
            
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Lesen der Sidebar-Gebiete:`, e);
            return [];
        }
    }

    async getAreasFromAPI() {
        try {
            // Versuche über WME Model/API an die Gebietsdaten zu kommen
            if (W && W.loginManager && W.loginManager.user) {
                const user = W.loginManager.user;
                
                // Prüfe verschiedene mögliche Eigenschaften für Gebiete
                const possibleAreaProps = [
                    'managedAreas',
                    'areas',
                    'editableAreas',
                    'assignedAreas',
                    'userAreas'
                ];
                
                for (const prop of possibleAreaProps) {
                    if (user.attributes && user.attributes[prop]) {
                        console.log(`${SCRIPT_NAME}: Gefunden: user.attributes.${prop}`, user.attributes[prop]);
                        return this.parseAPIAreas(user.attributes[prop], prop);
                    }
                }
                
                // Prüfe auch direkt am User-Objekt
                for (const prop of possibleAreaProps) {
                    if (user[prop]) {
                        console.log(`${SCRIPT_NAME}: Gefunden: user.${prop}`, user[prop]);
                        return this.parseAPIAreas(user[prop], prop);
                    }
                }
            }
            
            return [];
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim API-Zugriff:`, e);
            return [];
        }
    }

    parseAPIAreas(areasData, source) {
        try {
            const areas = [];
            
            if (Array.isArray(areasData)) {
                areasData.forEach((area, index) => {
                    if (area && (area.name || area.id)) {
                        areas.push({
                            id: `api_area_${source}_${area.id || index}`,
                            name: area.name || `Area ${index + 1}`,
                            type: 'api_area',
                            country: area.country || 'API Area',
                            bounds: area.bounds || this.estimateBoundsFromSize(1000),
                            sizeKm2: area.size || 1000,
                            segmentCount: area.segmentCount || 50000,
                            source: source
                        });
                    }
                });
            }
            
            return areas;
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler beim Parsen der API-Gebiete:`, e);
            return [];
        }
    }

    async getAreasFromSegments() {
        // Fallback zur alten Methode über Staaten/Länder
        try {
            if (!W || !W.model || !W.loginManager || !W.loginManager.user) {
                return [];
            }

            const user = W.loginManager.user;
            const userRank = user.attributes.rank;
            const areas = [];
            
            // Sammle alle Staaten/Länder im aktuellen Viewport
            const states = W.model.states?.getObjectArray() || [];
            const countries = W.model.countries?.getObjectArray() || [];
            
            // Analysiere Staaten
            for (const state of states) {
                if (!state || !state.attributes) continue;
                
                const stateName = state.attributes.name;
                const countryCode = state.attributes.countryID;
                
                // Hole das zugehörige Land
                const country = countries.find(c => c.attributes.id === countryCode);
                const countryName = country?.attributes?.name || 'Unbekannt';
                
                // Prüfe ob der Benutzer in diesem Staat editieren kann
                const canEdit = this.canUserEditInState(state, userRank);
                
                if (canEdit) {
                    const bounds = this.getStateBounds(state);
                    if (bounds) {
                        areas.push({
                            id: `state_${state.attributes.id}`,
                            name: stateName,
                            type: 'state',
                            country: countryName,
                            countryCode: countryCode,
                            bounds: bounds,
                            segmentCount: this.estimateSegmentCount(bounds)
                        });
                    }
                }
            }
            
            return areas;
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Fehler bei Segment-Analyse:`, e);
            return [];
        }
    }

    estimateBoundsFromSize(sizeKm2) {
        // Grobe Schätzung: Quadratisches Gebiet um aktuellen Standort
        const currentBounds = CoordUtils.getCurrentBounds();
        if (!currentBounds) {
            // Fallback: Deutschland-Zentrum
            return {
                minLon: 10.0,
                minLat: 51.0,
                maxLon: 11.0,
                maxLat: 52.0
            };
        }
        
        // Berechne Seitenlänge eines quadratischen Gebiets
        const sideLengthKm = Math.sqrt(sizeKm2);
        const sideLengthDeg = sideLengthKm / 111.32; // Grobe Umrechnung km zu Grad
        
        const centerLon = (currentBounds.minLon + currentBounds.maxLon) / 2;
        const centerLat = (currentBounds.minLat + currentBounds.maxLat) / 2;
        
        return {
            minLon: centerLon - sideLengthDeg / 2,
            minLat: centerLat - sideLengthDeg / 2,
            maxLon: centerLon + sideLengthDeg / 2,
            maxLat: centerLat + sideLengthDeg / 2
        };
    }

    canUserEditInState(state, userRank) {
        try {
            // Prüfe Permissions des Staates
            if (state.attributes.permissions) {
                return state.attributes.permissions.some(perm => 
                    perm.editable && (perm.rank === undefined || userRank >= perm.rank)
                );
            }
            
            // Fallback: Prüfe Lock-Level von Segmenten in diesem Staat
            const segments = W.model.segments?.getObjectArray() || [];
            const stateSegments = segments.filter(seg => 
                seg.attributes.primaryStreetID && 
                seg.attributes.state === state.attributes.id
            );
            
            return stateSegments.some(seg => userRank >= (seg.attributes.lockRank || 0));
        } catch (e) {
            return false;
        }
    }

    getStateBounds(state) {
        try {
            const geometry = state.getOLGeometry();
            if (geometry && geometry.getBounds) {
                return this.convertBoundsToWGS84(geometry.getBounds());
            }
        } catch (e) {
            console.error('Fehler beim Abrufen der State-Bounds:', e);
        }
        return null;
    }

    convertBoundsToWGS84(bounds) {
        const toWGS84 = (x, y) => {
            const lon = x * 180 / 20037508.34;
            let lat = y * 180 / 20037508.34;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return { lon, lat };
        };
        
        const bl = toWGS84(bounds.left, bounds.bottom);
        const tr = toWGS84(bounds.right, bounds.top);
        
        return {
            minLon: bl.lon,
            minLat: bl.lat,
            maxLon: tr.lon,
            maxLat: tr.lat
        };
    }

    estimateSegmentCount(bounds) {
        // Grobe Schätzung basierend auf der Gebietsgröße
        const area = (bounds.maxLon - bounds.minLon) * (bounds.maxLat - bounds.minLat);
        return Math.round(area * 100000); // Sehr grobe Schätzung
    }

    getSelectedAreasBounds() {
        if (this.selectedAreas.size === 0) return null;
        
        const selectedAreaObjects = this.editableAreas.filter(area => 
            this.selectedAreas.has(area.id)
        );
        
        if (selectedAreaObjects.length === 0) return null;
        
        // Berechne die kombinierte Bounding Box aller ausgewählten Gebiete
        let minLon = Infinity, minLat = Infinity;
        let maxLon = -Infinity, maxLat = -Infinity;
        
        selectedAreaObjects.forEach(area => {
            minLon = Math.min(minLon, area.bounds.minLon);
            minLat = Math.min(minLat, area.bounds.minLat);
            maxLon = Math.max(maxLon, area.bounds.maxLon);
            maxLat = Math.max(maxLat, area.bounds.maxLat);
        });
        
        return {
            minLon: minLon,
            minLat: minLat,
            maxLon: maxLon,
            maxLat: maxLat
        };
    }

    selectArea(areaId) {
        this.selectedAreas.add(areaId);
    }

    deselectArea(areaId) {
        this.selectedAreas.delete(areaId);
    }

    selectAllAreas() {
        this.editableAreas.forEach(area => this.selectedAreas.add(area.id));
    }

    deselectAllAreas() {
        this.selectedAreas.clear();
    }

    isAreaSelected(areaId) {
        return this.selectedAreas.has(areaId);
    }
}

const editableAreasAnalyzer = new EditableAreasAnalyzer();

const placesChecker = new PlacesChecker();

// Debug-Funktion: Teste aktuell ausgewählten Place
window.testCurrentPlace = function() {
    try {
        if (!W || !W.selectionManager) {
            console.log('W.selectionManager nicht verfügbar');
            return;
        }

        const selected = W.selectionManager.getSelectedFeatures();
        if (!selected || selected.length === 0) {
            console.log('Kein Place ausgewählt');
            return;
        }

        const venue = selected[0];
        if (!venue || !venue.model || venue.model.type !== 'venue') {
            console.log('Ausgewähltes Objekt ist kein Place');
            return;
        }

        const model = venue.model;
        console.log('========== SELECTED PLACE DEBUG ==========');
        console.log('Name:', model.attributes.name);
        console.log('ID:', model.attributes.id);
        console.log('Alle Attributes:', model.attributes);
        console.log('Alle Attribute Keys:', Object.keys(model.attributes));
        console.log('externalProviderIDs:', model.attributes.externalProviderIDs);
        console.log('aliases:', model.attributes.aliases);
        
        // Suche nach Google-Feldern
        const googleFields = {};
        for (const [key, value] of Object.entries(model.attributes)) {
            if (key.toLowerCase().includes('google') || 
                key.toLowerCase().includes('provider') ||
                key.toLowerCase().includes('external') ||
                (typeof value === 'string' && value.toLowerCase().includes('google'))) {
                googleFields[key] = value;
            }
        }
        console.log('Google/Provider-bezogene Felder:', googleFields);
        
        // Teste Link-Erkennung
        const links = placesChecker.getGooglePlacesLinks(model);
        console.log('Erkannte Google Links:', links);
        console.log('========================================');
        
        return {
            name: model.attributes.name,
            attributes: model.attributes,
            googleLinks: links
        };
    } catch (e) {
        console.error('Fehler beim Testen:', e);
    }
};

// Debug-Funktion: Teste Gebiets-Erkennung
window.testAreaDetection = function() {
    console.log('========== AREA DETECTION DEBUG ==========');
    
    // Teste Sidebar-Methode
    console.log('1. Teste Sidebar-Methode:');
    const sidebarAreas = editableAreasAnalyzer.getAreasFromSidebar();
    console.log('Sidebar Areas:', sidebarAreas);
    
    // Teste DOM-Elemente
    console.log('2. DOM-Elemente:');
    const areaItems = document.querySelectorAll('.area-item');
    console.log('Gefundene .area-item Elemente:', areaItems.length);
    areaItems.forEach((item, index) => {
        const title = item.querySelector('.list-item-card-title')?.textContent;
        const caption = item.querySelector('wz-caption')?.textContent;
        console.log(`  Area ${index + 1}: ${title} (${caption})`);
    });
    
    // Teste User-Objekt
    console.log('3. User-Objekt:');
    if (W && W.loginManager && W.loginManager.user) {
        const user = W.loginManager.user;
        console.log('User attributes:', Object.keys(user.attributes || {}));
        console.log('User properties:', Object.keys(user));
        
        // Suche nach area-bezogenen Eigenschaften
        const areaProps = [];
        for (const key of Object.keys(user.attributes || {})) {
            if (key.toLowerCase().includes('area') || key.toLowerCase().includes('manage')) {
                areaProps.push({ key, value: user.attributes[key] });
            }
        }
        console.log('Area-bezogene User-Eigenschaften:', areaProps);
    }
    
    console.log('==========================================');
    return { sidebarAreas, areaItems: areaItems.length };
};

console.log(`${SCRIPT_NAME}: Debug-Funktionen verfügbar!`);
console.log('- testCurrentPlace(): Teste ausgewählten Place');
console.log('- testAreaDetection(): Teste Gebiets-Erkennung');


// UI im Sidebar-Tab erstellen
async function createSidebarTab() {
    try {
        if (!wmeSDK || !wmeSDK.Sidebar) {
            console.log(`${SCRIPT_NAME}: SDK Sidebar nicht verfügbar, verwende Fallback-UI`);
            createFallbackUI();
            return;
        }

        const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();

        tabLabel.innerText = `🔗 ${t('tabName')}`;
        tabLabel.title = t('tabTitle');

        tabPane.innerHTML = getTabContent();
        attachEventListeners();

        // Starte Sprachüberwachung
        startLanguageMonitoring();

        log('Sidebar-Tab erstellt', 'success');
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Fehler beim Erstellen des Sidebar-Tabs:`, e);
        createFallbackUI();
    }
}

// Fallback UI (wenn SDK nicht verfügbar)
function createFallbackUI() {
    const container = document.createElement('div');
    container.id = 'google-places-checker-ui';
    container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        width: 400px;
        max-height: 80vh;
        background: white;
        border: 2px solid #4a90e2;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
    `;

    container.innerHTML = `
        <div style="background: #4a90e2; color: white; padding: 12px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 16px;">🔗 Google Places Link Checker</h3>
            <button id="gplc-close-btn" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 25px; height: 25px;">&times;</button>
        </div>
        ${getTabContent()}
    `;

    document.body.appendChild(container);

    // Event Listeners
    document.getElementById('gplc-close-btn').onclick = () => {
        container.style.display = 'none';
    };

    attachEventListeners();
    
    // Starte Sprachüberwachung
    startLanguageMonitoring();
}

function getCategoryOptions() {
    const categories = [
        { value: 'ALL', key: 'allCategories' },
        { value: 'GAS_STATION', key: 'catGasStation' },
        { value: 'PARKING_LOT', key: 'catParkingLot' },
        { value: 'HOSPITAL_URGENT_CARE', key: 'catHospital' },
        { value: 'RESTAURANT', key: 'catRestaurant' },
        { value: 'HOTEL', key: 'catHotel' },
        { value: 'SUPERMARKET_GROCERY', key: 'catSupermarket' },
        { value: 'BANK_FINANCIAL', key: 'catBank' },
        { value: 'SHOPPING_CENTER', key: 'catShoppingCenter' },
        { value: 'PHARMACY', key: 'catPharmacy' },
        { value: 'CAFE', key: 'catCafe' },
        { value: 'BAR', key: 'catBar' },
        { value: 'FAST_FOOD', key: 'catFastFood' },
        { value: 'BAKERY', key: 'catBakery' },
        { value: 'CONVENIENCE_STORE', key: 'catConvenienceStore' },
        { value: 'SCHOOL', key: 'catSchool' },
        { value: 'COLLEGE_UNIVERSITY', key: 'catUniversity' },
        { value: 'LIBRARY', key: 'catLibrary' },
        { value: 'POST_OFFICE', key: 'catPostOffice' },
        { value: 'POLICE_STATION', key: 'catPoliceStation' },
        { value: 'FIRE_DEPARTMENT', key: 'catFireDepartment' },
        { value: 'GOVERNMENT', key: 'catGovernment' },
        { value: 'TOURIST_ATTRACTION', key: 'catTouristAttraction' },
        { value: 'MUSEUM', key: 'catMuseum' },
        { value: 'PARK', key: 'catPark' },
        { value: 'SPORTS_COURT', key: 'catSportsCourt' },
        { value: 'GYM_FITNESS', key: 'catGym' },
        { value: 'SWIMMING_POOL', key: 'catSwimmingPool' },
        { value: 'STADIUM_ARENA', key: 'catStadium' },
        { value: 'MOVIE_THEATER', key: 'catMovieTheater' },
        { value: 'THEATER', key: 'catTheater' },
        { value: 'NIGHTCLUB', key: 'catNightclub' },
        { value: 'CHURCH', key: 'catChurch' },
        { value: 'CEMETERY', key: 'catCemetery' },
        { value: 'CAR_WASH', key: 'catCarWash' },
        { value: 'CAR_RENTAL', key: 'catCarRental' },
        { value: 'CAR_DEALER', key: 'catCarDealer' },
        { value: 'AUTO_REPAIR_SHOP', key: 'catAutoRepair' },
        { value: 'CHARGING_STATION', key: 'catChargingStation' },
        { value: 'AIRPORT', key: 'catAirport' },
        { value: 'TRAIN_STATION', key: 'catTrainStation' },
        { value: 'BUS_STATION', key: 'catBusStation' },
        { value: 'FERRY_PIER', key: 'catFerryPier' },
        { value: 'BRIDGE', key: 'catBridge' },
        { value: 'TUNNEL', key: 'catTunnel' },
        { value: 'JUNCTION_INTERCHANGE', key: 'catJunction' },
        { value: 'TOLL_BOOTH', key: 'catTollBooth' },
        { value: 'CONSTRUCTION_SITE', key: 'catConstruction' },
        { value: 'FACTORY', key: 'catFactory' },
        { value: 'OFFICE', key: 'catOffice' },
        { value: 'RESIDENTIAL', key: 'catResidential' },
        { value: 'NATURAL_FEATURES', key: 'catNaturalFeatures' }
    ];
    
    return categories.map(cat => 
        `<option value="${cat.value}"${cat.value === 'ALL' ? ' selected' : ''}>${t(cat.key)}</option>`
    ).join('\n                        ');
}

// Tab-Inhalt generieren (für Sidebar und Fallback)
function getTabContent() {
    return `
        <div style="padding: 15px; overflow-y: auto; flex: 1;">
            <!-- Filter Section -->
            <div style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                <h4 style="margin: 5px 0 10px 0;">⚙️ ${t('filterOptions')}</h4>
                
                <!-- Kategoriefilter -->
                <div style="margin-bottom: 10px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">${t('categories')}</label>
                    <select id="gplc-category-filter" multiple style="width: 100%; height: 120px; font-size: 11px;">
                        ${getCategoryOptions()}
                    </select>
                    <small style="color: #666;">${t('ctrlClickMulti')}</small>
                </div>
                
                <!-- Lock Level Filter -->
                <div style="margin-bottom: 10px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">${t('lockLevel')}</label>
                    <select id="gplc-lock-filter" style="width: 100%;">
                        <option value="ALL" selected>${t('allLockLevels')}</option>
                        <option value="0">🔓 Level 1</option>
                        <option value="1">🔒 Level 2</option>
                        <option value="2">🔒 Level 3</option>
                        <option value="3">🔒 Level 4</option>
                        <option value="4">🔒 Level 5</option>
                        <option value="5">🔒 Level 6</option>
                    </select>
                </div>
                
                <!-- Namensfilter -->
                <div style="margin-bottom: 10px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">${t('nameContains')}</label>
                    <input type="text" id="gplc-name-filter" placeholder="z.B. McDonald, Aldi..." style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
                    <label style="display: block; margin-top: 3px;">
                        <input type="checkbox" id="gplc-name-regex"> ${t('useRegex')}
                    </label>
                </div>
                
                <!-- Place Typ Filter -->
                <div style="margin-bottom: 10px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">${t('placeType')}</label>
                    <label><input type="checkbox" id="gplc-filter-point" checked> 📍 ${t('pointPlaces')}</label><br>
                    <label><input type="checkbox" id="gplc-filter-area" checked> ⬜ ${t('areaPlaces')}</label>
                </div>
                
                <!-- Scan-Bereich Filter -->
                <div style="margin-bottom: 10px;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">${t('scanArea')}</label>
                    <label title="${t('scanEntireViewportTooltip')}"><input type="radio" name="gplc-scan-area" id="gplc-scan-viewport" value="viewport" checked> 🗺️ ${t('scanEntireViewport')}</label><br>
                    <label title="${t('scanOnlyEditableTooltip')}"><input type="radio" name="gplc-scan-area" id="gplc-scan-editable" value="editable"> 🔓 ${t('scanOnlyEditable')}</label><br>
                    <label><input type="radio" name="gplc-scan-area" id="gplc-scan-selected" value="selected"> 🎯 ${t('scanSelectedAreas')}</label>
                    
                    <!-- Gebietsauswahl (nur sichtbar wenn "Ausgewählte Gebiete" aktiviert) -->
                    <div id="gplc-area-selection" style="display: none; margin-top: 10px; padding: 8px; background: #f0f0f0; border-radius: 4px; max-height: 200px; overflow-y: auto;">
                        <div style="margin-bottom: 8px;">
                            <button type="button" id="gplc-analyze-areas" style="padding: 4px 8px; background: #2196f3; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer; margin-right: 5px;">🔍 Analysieren</button>
                            <button type="button" id="gplc-select-all-areas" style="padding: 4px 8px; background: #4caf50; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer; margin-right: 5px;">${t('selectAllAreas')}</button>
                            <button type="button" id="gplc-deselect-all-areas" style="padding: 4px 8px; background: #9e9e9e; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;">${t('deselectAllAreas')}</button>
                        </div>
                        <div id="gplc-areas-list" style="font-size: 11px;">
                            <div style="color: #666; font-style: italic;">${t('selectEditableAreas')}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Scan Controls -->
            <div style="margin-bottom: 15px;">
                <button id="gplc-start-btn" style="width: 100%; padding: 10px; background: #4caf50; color: white; border: none; border-radius: 5px; font-size: 14px; font-weight: bold; cursor: pointer; margin-bottom: 5px;">
                    🚀 ${t('startScan')}
                </button>
                <div style="display: flex; gap: 5px;">
                    <button id="gplc-pause-btn" style="flex: 1; padding: 8px; background: #ff9800; color: white; border: none; border-radius: 5px; font-size: 13px; cursor: pointer; display: none;">
                        ⏸️ ${t('pause')}
                    </button>
                    <button id="gplc-stop-btn" style="flex: 1; padding: 8px; background: #f44336; color: white; border: none; border-radius: 5px; font-size: 13px; cursor: pointer; display: none;">
                        ⏹️ ${t('stop')}
                    </button>
                </div>
            </div>

            <div id="gplc-progress" style="display: none; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                <div style="margin-bottom: 5px;">
                    <strong>${t('progress')}</strong> <span id="gplc-progress-text">0 / 0 (0%)</span>
                </div>
                <div style="background: #ddd; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div id="gplc-progress-bar" style="background: #4caf50; height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
            </div>

            <div id="gplc-stats" style="display: none; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                <div><strong>${t('placesChecked')}</strong> <span id="gplc-stat-total">0</span></div>
                <div style="color: #ff9800;"><strong>${t('noLink')}</strong> <span id="gplc-stat-nolink">0</span></div>
                <div style="color: #f44336;"><strong>${t('linkSharedMultiplePOIs')}</strong> <span id="gplc-stat-shared">0</span></div>
                <div style="color: #ff9800;"><strong>${t('multipleLinksOnePlace')}</strong> <span id="gplc-stat-multiple">0</span></div>
            </div>

            <div id="gplc-results" style="display: none;">
                <h4 style="margin: 10px 0;">${t('results')}</h4>
                
                <!-- Sortierung und Aktionen -->
                <div style="margin-bottom: 10px; display: flex; gap: 5px; flex-wrap: wrap;">
                    <select id="gplc-sort" style="flex: 1; min-width: 120px; padding: 5px;">
                        <option value="name">📝 ${t('byName')}</option>
                        <option value="category">📂 ${t('byCategory')}</option>
                        <option value="lock">🔒 ${t('byLockLevel')}</option>
                    </select>
                    <button id="gplc-export-btn" style="padding: 5px 10px; background: #2196f3; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        📋 ${t('exportCSV')}
                    </button>
                    <button id="gplc-export-json-btn" style="padding: 5px 10px; background: #9c27b0; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        📄 ${t('exportJSON')}
                    </button>
                    <button id="gplc-clear-btn" style="padding: 5px 10px; background: #9e9e9e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        🗑️ ${t('clear')}
                    </button>
                </div>
                
                <!-- Ergebnisfilter -->
                <div style="margin-bottom: 10px;">
                    <label><input type="checkbox" id="gplc-show-nolink" checked> ❌ ${t('showNoLink')}</label><br>
                    <label><input type="checkbox" id="gplc-show-duplicate" checked> 🔗 ${t('showDuplicateLinks')}</label><br>
                    <label><input type="checkbox" id="gplc-show-multiple" checked> ⚠️ ${t('showMultipleLinks')}</label><br>
                    <label><input type="checkbox" id="gplc-highlight-map"> 🗺️ ${t('highlightOnMap')}</label>
                </div>
                
                <div id="gplc-results-table" style="max-height: 400px; overflow-y: auto; overflow-x: auto; border: 1px solid #ddd; border-radius: 5px;"></div>
            </div>

            <div id="gplc-log" style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px; max-height: 150px; overflow-y: auto; font-size: 12px; font-family: monospace;"></div>
        </div>
    `;
}

// Event Listeners anhängen
function attachEventListeners() {

    const startBtn = document.getElementById('gplc-start-btn');
    const pauseBtn = document.getElementById('gplc-pause-btn');
    const stopBtn = document.getElementById('gplc-stop-btn');
    const exportBtn = document.getElementById('gplc-export-btn');
    const exportJsonBtn = document.getElementById('gplc-export-json-btn');
    const clearBtn = document.getElementById('gplc-clear-btn');
    const sortSelect = document.getElementById('gplc-sort');
    const showNolinkCheckbox = document.getElementById('gplc-show-nolink');
    const showDuplicateCheckbox = document.getElementById('gplc-show-duplicate');
    
    // Scan-Bereich Radio Buttons
    const scanViewportRadio = document.getElementById('gplc-scan-viewport');
    const scanEditableRadio = document.getElementById('gplc-scan-editable');
    const scanSelectedRadio = document.getElementById('gplc-scan-selected');
    const areaSelectionDiv = document.getElementById('gplc-area-selection');
    
    // Gebietsauswahl Buttons
    const analyzeAreasBtn = document.getElementById('gplc-analyze-areas');
    const selectAllAreasBtn = document.getElementById('gplc-select-all-areas');
    const deselectAllAreasBtn = document.getElementById('gplc-deselect-all-areas');

    // Zeige/Verstecke Gebietsauswahl basierend auf Radio Button
    function toggleAreaSelection() {
        if (scanSelectedRadio && scanSelectedRadio.checked) {
            areaSelectionDiv.style.display = 'block';
        } else {
            areaSelectionDiv.style.display = 'none';
        }
    }

    if (scanViewportRadio) scanViewportRadio.onchange = toggleAreaSelection;
    if (scanEditableRadio) scanEditableRadio.onchange = toggleAreaSelection;
    if (scanSelectedRadio) scanSelectedRadio.onchange = toggleAreaSelection;

    // Gebiete analysieren
    if (analyzeAreasBtn) {
        analyzeAreasBtn.onclick = async () => {
            analyzeAreasBtn.disabled = true;
            analyzeAreasBtn.textContent = '⏳ Analysiere...';
            
            try {
                const areas = await editableAreasAnalyzer.analyzeEditableAreas();
                renderAreasList(areas);
            } catch (e) {
                log('Fehler bei der Gebietsanalyse', 'error');
            } finally {
                analyzeAreasBtn.disabled = false;
                analyzeAreasBtn.textContent = '🔍 Analysieren';
            }
        };
    }

    // Alle Gebiete auswählen/abwählen
    if (selectAllAreasBtn) {
        selectAllAreasBtn.onclick = () => {
            editableAreasAnalyzer.selectAllAreas();
            updateAreasListCheckboxes();
        };
    }

    if (deselectAllAreasBtn) {
        deselectAllAreasBtn.onclick = () => {
            editableAreasAnalyzer.deselectAllAreas();
            updateAreasListCheckboxes();
        };
    }

    if (startBtn) {
        startBtn.onclick = async () => {
            // Prüfe welcher Scan-Bereich ausgewählt ist
            const scanEditableOnly = document.getElementById('gplc-scan-editable')?.checked || false;
            const scanSelectedAreas = document.getElementById('gplc-scan-selected')?.checked || false;
            
            let bounds;
            if (scanSelectedAreas) {
                bounds = editableAreasAnalyzer.getSelectedAreasBounds();
                if (!bounds) {
                    log('Fehler: Keine Gebiete ausgewählt. Bitte erst Gebiete analysieren und auswählen.', 'error');
                    return;
                }
                const selectedCount = editableAreasAnalyzer.selectedAreas.size;
                log(`Scanne ${selectedCount} ausgewählte Gebiete...`, 'info');
            } else if (scanEditableOnly) {
                bounds = CoordUtils.getEditableBounds();
                if (!bounds) {
                    log('Fehler: Konnte editierbare Bereiche nicht ermitteln', 'error');
                    return;
                }
                log('Scanne editierbare Bereiche im Viewport...', 'info');
            } else {
                bounds = CoordUtils.getCurrentBounds();
                if (!bounds) {
                    log('Fehler: Konnte Kartengrenzen nicht ermitteln', 'error');
                    return;
                }
                log('Scanne gesamten Viewport...', 'info');
            }
            
            await placesChecker.startScan(bounds);
        };
    }

    if (pauseBtn) {
        pauseBtn.onclick = () => {
            if (scanState.isPaused) {
                placesChecker.resumeScan();
            } else {
                placesChecker.pauseScan();
            }
        };
    }

    if (stopBtn) {
        stopBtn.onclick = () => {
            placesChecker.stopScan();
        };
    }

    if (exportBtn) {
        exportBtn.onclick = () => {
            exportResults('csv');
        };
    }
    
    if (exportJsonBtn) {
        exportJsonBtn.onclick = () => {
            exportResults('json');
        };
    }

    if (clearBtn) {
        clearBtn.onclick = () => {
            scanState.results = [];
            updateUI();
            log('Ergebnisse gelöscht', 'info');
        };
    }
    
    if (sortSelect) {
        sortSelect.onchange = () => {
            sortResults(sortSelect.value);
            updateResultsTable();
        };
    }
    
    if (showNolinkCheckbox) {
        showNolinkCheckbox.onchange = () => {
            updateResultsTable();
            // Update Highlights wenn aktiviert
            if (document.getElementById('gplc-highlight-map')?.checked) {
                updateMapHighlights();
            }
        };
    }
    
    if (showDuplicateCheckbox) {
        showDuplicateCheckbox.onchange = () => {
            updateResultsTable();
            // Update Highlights wenn aktiviert
            if (document.getElementById('gplc-highlight-map')?.checked) {
                updateMapHighlights();
            }
        };
    }
    
    const showMultipleCheckbox = document.getElementById('gplc-show-multiple');
    if (showMultipleCheckbox) {
        showMultipleCheckbox.onchange = () => {
            updateResultsTable();
            // Update Highlights wenn aktiviert
            if (document.getElementById('gplc-highlight-map')?.checked) {
                updateMapHighlights();
            }
        };
    }
    
    const highlightMapCheckbox = document.getElementById('gplc-highlight-map');
    if (highlightMapCheckbox) {
        highlightMapCheckbox.onchange = () => {
            if (highlightMapCheckbox.checked) {
                updateMapHighlights();
            } else {
                clearHighlights();
            }
        };
    }
}

// Gebietsliste rendern
function renderAreasList(areas) {
    const areasListDiv = document.getElementById('gplc-areas-list');
    if (!areasListDiv) return;

    if (areas.length === 0) {
        areasListDiv.innerHTML = `<div style="color: #f44336; font-style: italic;">${t('noEditableAreasFound')}</div>`;
        return;
    }

    let html = '';
    let currentCountry = '';
    
    areas.forEach(area => {
        // Gruppiere nach Land/Typ
        const groupName = area.type === 'managed_area' ? 'Your Areas' : area.country;
        if (groupName !== currentCountry) {
            if (currentCountry !== '') {
                html += '</div>'; // Schließe vorherige Gruppe
            }
            currentCountry = groupName;
            html += `<div style="margin-bottom: 8px;">`;
            
            const groupIcon = area.type === 'managed_area' ? '👤' : '🌍';
            html += `<div style="font-weight: bold; color: #333; margin-bottom: 4px; border-bottom: 1px solid #ddd; padding-bottom: 2px;">${groupIcon} ${escapeHtml(currentCountry)}</div>`;
        }
        
        const isSelected = editableAreasAnalyzer.isAreaSelected(area.id);
        
        // Icon basierend auf Typ
        let typeIcon = '🏛️';
        if (area.type === 'managed_area') typeIcon = '📍';
        else if (area.type === 'api_area') typeIcon = '🔗';
        else if (area.type === 'state') typeIcon = '🏛️';
        else if (area.type === 'country') typeIcon = '🌍';
        
        // Größenanzeige
        let sizeDisplay = '';
        if (area.sizeKm2) {
            sizeDisplay = `${area.sizeKm2.toLocaleString()} km²`;
        } else {
            sizeDisplay = `~${area.segmentCount.toLocaleString()} Segmente`;
        }
        
        html += `
            <label style="display: block; margin-bottom: 2px; cursor: pointer; padding: 2px 4px; border-radius: 3px; background: ${isSelected ? '#e3f2fd' : 'transparent'};">
                <input type="checkbox" class="gplc-area-checkbox" data-area-id="${area.id}" ${isSelected ? 'checked' : ''}> 
                ${typeIcon} ${escapeHtml(area.name)}
                <span style="color: #666; font-size: 10px;">(${sizeDisplay})</span>
            </label>
        `;
    });
    
    if (currentCountry !== '') {
        html += '</div>'; // Schließe letzte Gruppe
    }

    areasListDiv.innerHTML = html;

    // Event Listeners für Checkboxen hinzufügen
    document.querySelectorAll('.gplc-area-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const areaId = this.getAttribute('data-area-id');
            if (this.checked) {
                editableAreasAnalyzer.selectArea(areaId);
            } else {
                editableAreasAnalyzer.deselectArea(areaId);
            }
            
            // Aktualisiere Hintergrundfarbe des Labels
            const label = this.parentElement;
            label.style.background = this.checked ? '#e3f2fd' : 'transparent';
        });
    });
}

// Checkboxen in der Gebietsliste aktualisieren
function updateAreasListCheckboxes() {
    document.querySelectorAll('.gplc-area-checkbox').forEach(checkbox => {
        const areaId = checkbox.getAttribute('data-area-id');
        const isSelected = editableAreasAnalyzer.isAreaSelected(areaId);
        checkbox.checked = isSelected;
        
        // Aktualisiere Hintergrundfarbe des Labels
        const label = checkbox.parentElement;
        label.style.background = isSelected ? '#e3f2fd' : 'transparent';
    });
}

// UI aktualisieren
function updateUI() {
    const startBtn = document.getElementById('gplc-start-btn');
    const pauseBtn = document.getElementById('gplc-pause-btn');
    const stopBtn = document.getElementById('gplc-stop-btn');
    const progressDiv = document.getElementById('gplc-progress');
    const statsDiv = document.getElementById('gplc-stats');
    const resultsDiv = document.getElementById('gplc-results');

    if (scanState.isScanning) {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        stopBtn.style.display = 'inline-block';
        progressDiv.style.display = 'block';
        statsDiv.style.display = 'block';

        pauseBtn.textContent = scanState.isPaused ? '▶️ Fortsetzen' : '⏸️ Pause';

        const progress = Math.round((scanState.currentTile / scanState.totalTiles) * 100);
        document.getElementById('gplc-progress-text').textContent = 
            `${scanState.currentTile} / ${scanState.totalTiles} (${progress}%)`;
        document.getElementById('gplc-progress-bar').style.width = `${progress}%`;
    } else {
        startBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        progressDiv.style.display = 'none';
    }

    document.getElementById('gplc-stat-total').textContent = scanState.placesFound;
    document.getElementById('gplc-stat-nolink').textContent = scanState.placesWithoutLink;
    document.getElementById('gplc-stat-shared').textContent = scanState.placesWithSharedLinks;
    document.getElementById('gplc-stat-multiple').textContent = scanState.placesWithDuplicateLinks;

    if (scanState.results.length > 0) {
        resultsDiv.style.display = 'block';
        updateResultsTable();
    } else {
        resultsDiv.style.display = 'none';
    }
}

// Ergebnistabelle aktualisieren
function updateResultsTable() {
    const tableDiv = document.getElementById('gplc-results-table');
    
    // Filter-Einstellungen
    const showNolink = document.getElementById('gplc-show-nolink')?.checked ?? true;
    const showDuplicate = document.getElementById('gplc-show-duplicate')?.checked ?? true;
    const showMultiple = document.getElementById('gplc-show-multiple')?.checked ?? true;
    
    // Gefilterte Ergebnisse
    const filteredResults = scanState.results.filter(result => {
        if (result.type === 'no-link' && !showNolink) return false;
        if (result.type === 'duplicate-links' && !showDuplicate) return false;
        if (result.type === 'multiple-links-same-place' && !showMultiple) return false;
        return true;
    });
    
    let html = '<table style="width: 100%; border-collapse: collapse; font-size: 11px;">';
    html += '<thead><tr style="background: #f0f0f0; position: sticky; top: 0;">';
    html += '<th style="padding: 4px 6px; border: 1px solid #ddd; text-align: center; width: 30px;">St</th>';
    html += '<th style="padding: 4px 6px; border: 1px solid #ddd; text-align: left;">Name</th>';
    html += '<th style="padding: 4px 6px; border: 1px solid #ddd; text-align: left; max-width: 80px;">Kategorie</th>';
    html += '<th style="padding: 4px 6px; border: 1px solid #ddd; text-align: center; width: 40px;">🔒</th>';
    html += '<th style="padding: 4px 6px; border: 1px solid #ddd; text-align: left; min-width: 100px;">Info</th>';
    html += '</tr></thead><tbody>';

    if (filteredResults.length === 0) {
        html += '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999;">Keine Ergebnisse gefunden</td></tr>';
    } else {
        for (const result of filteredResults) {
            const statusIcon = result.type === 'no-link' ? '❌' : '⚠️';
            const statusColor = result.type === 'no-link' ? '#ff9800' : '#f44336';
            
            // Hintergrundfarbe NUR für echte Duplikate (Links die mit anderen Places geteilt werden)
            let rowBgColor = '';
            if (result.type === 'duplicate-links') {
                rowBgColor = 'background: #ffebee;'; // Hellrot für echte Duplikate
            }
            
            const shortName = result.name.length > 30 ? result.name.substring(0, 27) + '...' : result.name;
            const shortCat = result.categories.length > 20 ? result.categories.substring(0, 17) + '...' : result.categories;
            
            // Info-Text erstellen
            let infoText = '';
            let infoTitle = '';
            if (result.type === 'no-link') {
                infoText = 'Kein Google Link';
                infoTitle = 'Dieser Place hat keine Google-Verknüpfung';
            } else if (result.type === 'duplicate-links') {
                if (result.duplicatePlaces && result.duplicatePlaces.length > 0) {
                    infoText = `🔗 Geteilt mit ${result.duplicatePlaces.length} anderen`;
                    const otherNames = result.duplicatePlaces.map(p => p.name).join('\n');
                    infoTitle = `Dieser Google Link wird auch verwendet von:\n${otherNames}`;
                } else {
                    infoText = result.duplicateInfo || 'Doppelter Link';
                    infoTitle = result.duplicateInfo || '';
                }
            } else if (result.type === 'multiple-links-same-place') {
                infoText = `📎 ${result.googleLinks.length} verschiedene Links`;
                infoTitle = `Dieser Place hat ${result.googleLinks.length} verschiedene Google Links:\n${result.googleLinks.map(l => l.id).join('\n')}`;
            }

            html += `<tr style="border-bottom: 1px solid #eee; ${rowBgColor}">`;
            html += `<td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center; color: ${statusColor};" title="${result.type === 'no-link' ? 'Kein Link' : result.googleLinks.length + ' Links'}">${statusIcon}</td>`;
            html += `<td style="padding: 4px 6px; border: 1px solid #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">`;
            // Fett nur bei echten Duplikaten
            html += `<a href="#" class="gplc-place-link" data-venue-id="${result.venueId}" style="color: #2196f3; text-decoration: none; font-weight: ${result.type === 'duplicate-links' ? 'bold' : 'normal'};" title="${escapeHtml(result.name)}">${escapeHtml(shortName)}</a>`;
            html += `</td>`;
            html += `<td style="padding: 4px 6px; border: 1px solid #ddd; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(result.categories)}">${escapeHtml(shortCat)}</td>`;
            html += `<td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center; font-size: 10px;">${result.lockLevel}</td>`;
            // Fett nur bei echten Duplikaten
            html += `<td style="padding: 4px 6px; border: 1px solid #ddd; font-size: 10px; color: ${statusColor}; font-weight: ${result.type === 'duplicate-links' ? 'bold' : 'normal'};" title="${escapeHtml(infoTitle)}">${escapeHtml(infoText)}</td>`;
            html += '</tr>';
        }
    }

    html += '</tbody></table>';
    tableDiv.innerHTML = html;
    
    // Event Listener für Place-Links hinzufügen
    document.querySelectorAll('.gplc-place-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const venueId = this.getAttribute('data-venue-id');
            centerAndSelectPlace(venueId);
        });
    });
}

// Ergebnisse exportieren
function exportResults(format = 'csv') {
    if (format === 'csv') {
        let csv = 'Status;Name;Kategorie;Lock Level;Google Links;Info;Permalink\n';
        
        for (const result of scanState.results) {
            let status = '';
            let info = '';
            
            if (result.type === 'no-link') {
                status = 'Kein Link';
                info = 'Keine Google-Verknüpfung';
            } else if (result.type === 'duplicate-links') {
                status = 'Doppelter Link';
                if (result.duplicatePlaces && result.duplicatePlaces.length > 0) {
                    info = `Geteilt mit: ${result.duplicatePlaces.map(p => p.name).join(', ')}`;
                } else {
                    info = result.duplicateInfo || '';
                }
            } else if (result.type === 'multiple-links-same-place') {
                status = 'Mehrere Links';
                info = `${result.googleLinks.length} verschiedene Google Links`;
            }
            
            const googleLinksStr = result.googleLinks ? result.googleLinks.map(l => l.id).join(' | ') : '';
            
            csv += `"${status}";"${result.name}";"${result.categories}";"${result.lockLevel}";"${googleLinksStr}";"${info}";"${result.permalink}"\n`;
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `google-places-check-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        log('Ergebnisse als CSV exportiert', 'success');
    } else if (format === 'json') {
        const json = JSON.stringify(scanState.results, null, 2);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `google-places-check-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        log('Ergebnisse als JSON exportiert', 'success');
    }
}

// Ausgewählte Kategorien holen
function getSelectedCategories() {
    const select = document.getElementById('gplc-category-filter');
    if (!select) return ['ALL'];
    
    const selected = Array.from(select.selectedOptions).map(opt => opt.value);
    return selected.length > 0 ? selected : ['ALL'];
}

// Ergebnisse sortieren
function sortResults(sortBy) {
    scanState.results.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'category':
                return a.categories.localeCompare(b.categories);
            case 'lock':
                return a.lockLevel - b.lockLevel;
            default:
                return 0;
        }
    });
}

// Log-Funktion
function log(message, type = 'info') {
    const logDiv = document.getElementById('gplc-log');
    if (!logDiv) return;

    const colors = {
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336'
    };

    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.style.cssText = `margin-bottom: 3px; color: ${colors[type] || colors.info};`;
    entry.innerHTML = `<span style="color: #999;">[${time}]</span> ${escapeHtml(message)}`;
    
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;

    console.log(`${SCRIPT_NAME}: ${message}`);
}

// HTML escapen
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Place zentrieren und auswählen
function centerAndSelectPlace(venueId) {
    try {
        // Hole den Permalink aus den Ergebnissen
        const result = scanState.results.find(r => r.venueId === venueId);
        
        if (result && result.permalink && result.permalink !== '#') {
            // Öffne den Permalink in einem neuen Tab
            window.open(result.permalink, '_blank');
        } else {
            // Fallback: Versuche den Place direkt zu laden
            const venue = W.model.venues.getObjectById(venueId);
            if (venue) {
                const geometry = venue.getOLGeometry();
                let centerPoint;
                
                if (geometry.CLASS_NAME === 'OpenLayers.Geometry.Point') {
                    centerPoint = geometry;
                } else {
                    centerPoint = geometry.getCentroid();
                }
                
                W.map.setCenter([centerPoint.x, centerPoint.y], Math.max(W.map.getZoom(), 17));
                W.selectionManager.setSelectedModels([venue]);
            } else {
                console.error(`${SCRIPT_NAME}: Place mit ID ${venueId} nicht gefunden`);
            }
        }
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Fehler beim Zentrieren auf Place:`, e);
    }
}

// Karten-Highlights für Duplikate
function updateMapHighlights() {
    try {
        clearHighlights();
        
        if (!W || !W.map) return;
        
        // Hole Filter-Einstellungen
        const showNolink = document.getElementById('gplc-show-nolink')?.checked ?? true;
        const showDuplicate = document.getElementById('gplc-show-duplicate')?.checked ?? true;
        const showMultiple = document.getElementById('gplc-show-multiple')?.checked ?? true;
        
        // Erstelle einen neuen Layer für Highlights
        scanState.highlightLayer = new OpenLayers.Layer.Vector("Google Places Duplicates", {
            displayInLayerSwitcher: false,
            uniqueName: "__gplc_highlights"
        });
        
        W.map.addLayer(scanState.highlightLayer);
        scanState.highlightLayer.setZIndex(1000);
        
        // Erstelle Styles für verschiedene Problemtypen
        const nolinkStyle = new OpenLayers.Style({
            strokeColor: "#ff9800",
            strokeWidth: 3,
            strokeOpacity: 0.7,
            fillColor: "#ff9800",
            fillOpacity: 0.15,
            pointRadius: 10
        });
        
        const duplicateStyle = new OpenLayers.Style({
            strokeColor: "#ff0000",
            strokeWidth: 4,
            strokeOpacity: 0.8,
            fillColor: "#ff0000",
            fillOpacity: 0.2,
            pointRadius: 12
        });
        
        const multipleStyle = new OpenLayers.Style({
            strokeColor: "#9c27b0",
            strokeWidth: 3,
            strokeOpacity: 0.7,
            fillColor: "#9c27b0",
            fillOpacity: 0.15,
            pointRadius: 10
        });
        
        // Füge Features basierend auf Filter-Einstellungen hinzu
        const features = [];
        
        scanState.results.forEach(result => {
            let shouldHighlight = false;
            let style = null;
            
            // Prüfe ob dieser Typ angezeigt werden soll
            if (result.type === 'no-link' && showNolink) {
                shouldHighlight = true;
                style = nolinkStyle;
            } else if (result.type === 'duplicate-links' && showDuplicate) {
                shouldHighlight = true;
                style = duplicateStyle;
            } else if (result.type === 'multiple-links-same-place' && showMultiple) {
                shouldHighlight = true;
                style = multipleStyle;
            }
            
            if (shouldHighlight) {
                const venue = W.model.venues.getObjectById(result.venueId);
                if (venue) {
                    const geometry = venue.getOLGeometry().clone();
                    const feature = new OpenLayers.Feature.Vector(geometry);
                    feature.style = style;
                    features.push(feature);
                }
            }
        });
        
        scanState.highlightLayer.addFeatures(features);
        
        let message = `${features.length} Places auf der Karte hervorgehoben`;
        if (features.length > 0) {
            const counts = {
                nolink: features.filter((_, i) => scanState.results[i]?.type === 'no-link').length,
                duplicate: features.filter((_, i) => scanState.results[i]?.type === 'duplicate-links').length,
                multiple: features.filter((_, i) => scanState.results[i]?.type === 'multiple-links-same-place').length
            };
            message += ` (`;
            const parts = [];
            if (showNolink && counts.nolink > 0) parts.push(`${counts.nolink} ohne Link`);
            if (showDuplicate && counts.duplicate > 0) parts.push(`${counts.duplicate} geteilt`);
            if (showMultiple && counts.multiple > 0) parts.push(`${counts.multiple} mehrere`);
            message += parts.join(', ') + ')';
        }
        log(message, 'info');
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Fehler beim Hervorheben:`, e);
    }
}

function clearHighlights() {
    try {
        if (scanState.highlightLayer) {
            if (W && W.map && scanState.highlightLayer.map) {
                W.map.removeLayer(scanState.highlightLayer);
            }
            scanState.highlightLayer.destroy();
            scanState.highlightLayer = null;
        }
    } catch (e) {
        console.error(`${SCRIPT_NAME}: Fehler beim Entfernen der Highlights:`, e);
    }
}

// Initialisierung
async function init() {
    console.log(`${SCRIPT_NAME}: Initialisierung gestartet...`);

    // Warte auf SDK
    if (unsafeWindow.SDK_INITIALIZED) {
        try {
            await unsafeWindow.SDK_INITIALIZED;
            
            if (unsafeWindow.getWmeSdk) {
                wmeSDK = unsafeWindow.getWmeSdk({
                    scriptId: SCRIPT_ID,
                    scriptName: SCRIPT_NAME
                });
                console.log(`${SCRIPT_NAME}: SDK initialisiert`);
            }

            // Warte auf WME-Ready Event
            if (wmeSDK && wmeSDK.Events) {
                await wmeSDK.Events.once({ eventName: 'wme-ready' });
                console.log(`${SCRIPT_NAME}: WME ist bereit`);
            }
            
            // Sprache erkennen NACH WME-Ready
            currentLang = detectLanguage();
            console.log(`${SCRIPT_NAME}: Sprache: ${currentLang}`);

            await createSidebarTab();
        } catch (e) {
            console.error(`${SCRIPT_NAME}: SDK-Initialisierung fehlgeschlagen:`, e);
            // Sprache auch im Fehlerfall erkennen
            currentLang = detectLanguage();
            createFallbackUI();
        }
    } else {
        // Fallback ohne SDK
        console.log(`${SCRIPT_NAME}: SDK nicht verfügbar, verwende Fallback`);
        setTimeout(() => {
            currentLang = detectLanguage();
            createFallbackUI();
        }, 2000);
    }
}

// Warte auf WME-Initialisierung
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
