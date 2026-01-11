// ==UserScript==
// @name         WME Mapillary Viewer
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2026.01.11
// @author       Hiwi234
// @description  Zeigt Mapillary Viewer, Traffic Signs, Map Features und Street-Level Imagery im Waze Map Editor
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      graph.mapillary.com
// @connect      www.mapillary.com
// @connect      thumbnails.mapillary.com
// @connect      *
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562164/WME%20Mapillary%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/562164/WME%20Mapillary%20Viewer.meta.js
// ==/UserScript==

/* global W, OpenLayers, GM_xmlhttpRequest, GM_addStyle, GM_setClipboard */

(function () {
    'use strict';

    if (window._wmeMapillaryV8) return;
    window._wmeMapillaryV8 = true;

    const SCRIPT_ID = 'wme-mapillary-v8';
    const SCRIPT_NAME = 'Mapillary';
    const SCRIPT_VERSION = '2026.01.11.12';
    const ACCESS_TOKEN = 'MLY|9425779667550855|8ed93f7c998fd15d39e3a693638e2ac8';

    // ============ I18N ============
    const I18N = {
        de: {
            // UI Labels
            enabled: 'Aktiviert',
            display: 'Anzeige',
            images: 'Bilder',
            panoramas: '360° Panoramas',
            trafficSigns: 'Verkehrsschilder',
            objects: 'Objekte (Ampeln, etc.)',
            sequenceLines: 'Sequenz-Linien',
            signFilters: 'Schilder-Filter',
            speed: 'Geschwindigkeit',
            stopYield: 'Stop/Vorfahrt',
            turnDirection: 'Abbiegen/Richtung',
            prohibitions: 'Verbote',
            parking: 'Parken',
            pedestrianCyclist: 'Fußgänger/Radfahrer',
            warningSigns: 'Warnschilder',
            infoSigns: 'Hinweisschilder',
            all: 'Alle',
            none: 'Keine',
            appearance: 'Darstellung',
            opacity: 'Deckkraft',
            performance: 'Performance',
            maxImages: 'Max. Bilder',
            maxSigns: 'Max. Schilder',
            fast: 'Schnell',
            complete: 'Vollständig',
            dateFilter: 'Datumsfilter',
            filterByDate: 'Nach Datum filtern',
            from: 'Von',
            to: 'Bis',
            noLimit: 'Leer lassen = kein Limit',
            refresh: 'Daten neu laden',
            clearCache: 'Cache leeren',
            shortcuts: 'Tastenkürzel',
            shortcutToggle: 'M = Ein/Aus',
            shortcutClose: 'ESC = Viewer schließen',
            // Status
            ready: 'Bereit',
            loading: 'Lade...',
            disabled: 'Deaktiviert',
            zoomIn: 'Zoom {zoom}+ für Daten',
            zoomMore: 'Weiter reinzoomen',
            cacheCleared: 'Cache geleert',
            linkCopied: 'Link kopiert!',
            noImageFound: 'Kein Bild gefunden',
            // Viewer
            viewer: 'Mapillary Viewer',
            date: 'Datum',
            creator: 'Ersteller',
            camera: 'Kamera',
            resolution: 'Auflösung',
            firstSeen: 'Zuerst',
            lastSeen: 'Zuletzt',
            // Stats
            statsImages: 'Bilder',
            statsSigns: 'Schilder',
            statsObjects: 'Objekte',
            sequenceLoaded: 'Sequenz: {count} Bilder',
            prevImage: 'Vorheriges Bild',
            nextImage: 'Nächstes Bild'
        },
        en: {
            enabled: 'Enabled',
            display: 'Display',
            images: 'Images',
            panoramas: '360° Panoramas',
            trafficSigns: 'Traffic Signs',
            objects: 'Objects (Traffic lights, etc.)',
            sequenceLines: 'Sequence Lines',
            signFilters: 'Sign Filters',
            speed: 'Speed',
            stopYield: 'Stop/Yield',
            turnDirection: 'Turn/Direction',
            prohibitions: 'Prohibitions',
            parking: 'Parking',
            pedestrianCyclist: 'Pedestrian/Cyclist',
            warningSigns: 'Warning Signs',
            infoSigns: 'Info Signs',
            all: 'All',
            none: 'None',
            appearance: 'Appearance',
            opacity: 'Opacity',
            performance: 'Performance',
            maxImages: 'Max. Images',
            maxSigns: 'Max. Signs',
            fast: 'Fast',
            complete: 'Complete',
            dateFilter: 'Date Filter',
            filterByDate: 'Filter by date',
            from: 'From',
            to: 'To',
            noLimit: 'Leave empty = no limit',
            refresh: 'Reload data',
            clearCache: 'Clear cache',
            shortcuts: 'Shortcuts',
            shortcutToggle: 'M = Toggle',
            shortcutClose: 'ESC = Close viewer',
            ready: 'Ready',
            loading: 'Loading...',
            disabled: 'Disabled',
            zoomIn: 'Zoom {zoom}+ for data',
            zoomMore: 'Zoom in more',
            cacheCleared: 'Cache cleared',
            linkCopied: 'Link copied!',
            noImageFound: 'No image found',
            viewer: 'Mapillary Viewer',
            date: 'Date',
            creator: 'Creator',
            camera: 'Camera',
            resolution: 'Resolution',
            firstSeen: 'First seen',
            lastSeen: 'Last seen',
            statsImages: 'Images',
            statsSigns: 'Signs',
            statsObjects: 'Objects',
            sequenceLoaded: 'Sequence: {count} images',
            prevImage: 'Previous image',
            nextImage: 'Next image'
        },
        fr: {
            enabled: 'Activé',
            display: 'Affichage',
            images: 'Images',
            panoramas: 'Panoramas 360°',
            trafficSigns: 'Panneaux de signalisation',
            objects: 'Objets (Feux, etc.)',
            sequenceLines: 'Lignes de séquence',
            signFilters: 'Filtres de panneaux',
            speed: 'Vitesse',
            stopYield: 'Stop/Cédez',
            turnDirection: 'Tourner/Direction',
            prohibitions: 'Interdictions',
            parking: 'Stationnement',
            pedestrianCyclist: 'Piétons/Cyclistes',
            warningSigns: 'Panneaux d\'avertissement',
            infoSigns: 'Panneaux d\'information',
            all: 'Tous',
            none: 'Aucun',
            appearance: 'Apparence',
            opacity: 'Opacité',
            performance: 'Performance',
            maxImages: 'Max. Images',
            maxSigns: 'Max. Panneaux',
            fast: 'Rapide',
            complete: 'Complet',
            dateFilter: 'Filtre de date',
            filterByDate: 'Filtrer par date',
            from: 'De',
            to: 'À',
            noLimit: 'Vide = pas de limite',
            refresh: 'Recharger les données',
            clearCache: 'Vider le cache',
            shortcuts: 'Raccourcis',
            shortcutToggle: 'M = Activer/Désactiver',
            shortcutClose: 'ESC = Fermer la visionneuse',
            ready: 'Prêt',
            loading: 'Chargement...',
            disabled: 'Désactivé',
            zoomIn: 'Zoom {zoom}+ pour les données',
            zoomMore: 'Zoomer plus',
            cacheCleared: 'Cache vidé',
            linkCopied: 'Lien copié!',
            noImageFound: 'Aucune image trouvée',
            viewer: 'Visionneuse Mapillary',
            date: 'Date',
            creator: 'Créateur',
            camera: 'Caméra',
            resolution: 'Résolution',
            firstSeen: 'Première fois',
            lastSeen: 'Dernière fois',
            statsImages: 'Images',
            statsSigns: 'Panneaux',
            statsObjects: 'Objets',
            sequenceLoaded: 'Séquence: {count} images',
            prevImage: 'Image précédente',
            nextImage: 'Image suivante'
        },
        es: {
            enabled: 'Activado',
            display: 'Visualización',
            images: 'Imágenes',
            panoramas: 'Panoramas 360°',
            trafficSigns: 'Señales de tráfico',
            objects: 'Objetos (Semáforos, etc.)',
            sequenceLines: 'Líneas de secuencia',
            signFilters: 'Filtros de señales',
            speed: 'Velocidad',
            stopYield: 'Stop/Ceda',
            turnDirection: 'Giro/Dirección',
            prohibitions: 'Prohibiciones',
            parking: 'Aparcamiento',
            pedestrianCyclist: 'Peatones/Ciclistas',
            warningSigns: 'Señales de advertencia',
            infoSigns: 'Señales informativas',
            all: 'Todos',
            none: 'Ninguno',
            appearance: 'Apariencia',
            opacity: 'Opacidad',
            performance: 'Rendimiento',
            maxImages: 'Máx. Imágenes',
            maxSigns: 'Máx. Señales',
            fast: 'Rápido',
            complete: 'Completo',
            dateFilter: 'Filtro de fecha',
            filterByDate: 'Filtrar por fecha',
            from: 'Desde',
            to: 'Hasta',
            noLimit: 'Vacío = sin límite',
            refresh: 'Recargar datos',
            clearCache: 'Limpiar caché',
            shortcuts: 'Atajos',
            shortcutToggle: 'M = Activar/Desactivar',
            shortcutClose: 'ESC = Cerrar visor',
            ready: 'Listo',
            loading: 'Cargando...',
            disabled: 'Desactivado',
            zoomIn: 'Zoom {zoom}+ para datos',
            zoomMore: 'Acercar más',
            cacheCleared: 'Caché limpiado',
            linkCopied: '¡Enlace copiado!',
            noImageFound: 'No se encontró imagen',
            viewer: 'Visor Mapillary',
            date: 'Fecha',
            creator: 'Creador',
            camera: 'Cámara',
            resolution: 'Resolución',
            firstSeen: 'Primera vez',
            lastSeen: 'Última vez',
            statsImages: 'Imágenes',
            statsSigns: 'Señales',
            statsObjects: 'Objetos',
            sequenceLoaded: 'Secuencia: {count} imágenes',
            prevImage: 'Imagen anterior',
            nextImage: 'Imagen siguiente'
        },
        it: {
            enabled: 'Attivato',
            display: 'Visualizzazione',
            images: 'Immagini',
            panoramas: 'Panorami 360°',
            trafficSigns: 'Segnali stradali',
            objects: 'Oggetti (Semafori, ecc.)',
            sequenceLines: 'Linee di sequenza',
            signFilters: 'Filtri segnali',
            speed: 'Velocità',
            stopYield: 'Stop/Precedenza',
            turnDirection: 'Svolta/Direzione',
            prohibitions: 'Divieti',
            parking: 'Parcheggio',
            pedestrianCyclist: 'Pedoni/Ciclisti',
            warningSigns: 'Segnali di avvertimento',
            infoSigns: 'Segnali informativi',
            all: 'Tutti',
            none: 'Nessuno',
            appearance: 'Aspetto',
            opacity: 'Opacità',
            performance: 'Prestazioni',
            maxImages: 'Max. Immagini',
            maxSigns: 'Max. Segnali',
            fast: 'Veloce',
            complete: 'Completo',
            dateFilter: 'Filtro data',
            filterByDate: 'Filtra per data',
            from: 'Da',
            to: 'A',
            noLimit: 'Vuoto = nessun limite',
            refresh: 'Ricarica dati',
            clearCache: 'Svuota cache',
            shortcuts: 'Scorciatoie',
            shortcutToggle: 'M = Attiva/Disattiva',
            shortcutClose: 'ESC = Chiudi visualizzatore',
            ready: 'Pronto',
            loading: 'Caricamento...',
            disabled: 'Disattivato',
            zoomIn: 'Zoom {zoom}+ per i dati',
            zoomMore: 'Ingrandisci di più',
            cacheCleared: 'Cache svuotata',
            linkCopied: 'Link copiato!',
            noImageFound: 'Nessuna immagine trovata',
            viewer: 'Visualizzatore Mapillary',
            date: 'Data',
            creator: 'Creatore',
            camera: 'Fotocamera',
            resolution: 'Risoluzione',
            firstSeen: 'Prima volta',
            lastSeen: 'Ultima volta',
            statsImages: 'Immagini',
            statsSigns: 'Segnali',
            statsObjects: 'Oggetti',
            sequenceLoaded: 'Sequenza: {count} immagini',
            prevImage: 'Immagine precedente',
            nextImage: 'Immagine successiva'
        },
        nl: {
            enabled: 'Ingeschakeld',
            display: 'Weergave',
            images: 'Afbeeldingen',
            panoramas: '360° Panorama\'s',
            trafficSigns: 'Verkeersborden',
            objects: 'Objecten (Verkeerslichten, etc.)',
            sequenceLines: 'Sequentielijnen',
            signFilters: 'Bordenfilters',
            speed: 'Snelheid',
            stopYield: 'Stop/Voorrang',
            turnDirection: 'Afslaan/Richting',
            prohibitions: 'Verboden',
            parking: 'Parkeren',
            pedestrianCyclist: 'Voetgangers/Fietsers',
            warningSigns: 'Waarschuwingsborden',
            infoSigns: 'Informatieborden',
            all: 'Alle',
            none: 'Geen',
            appearance: 'Uiterlijk',
            opacity: 'Dekking',
            performance: 'Prestaties',
            maxImages: 'Max. Afbeeldingen',
            maxSigns: 'Max. Borden',
            fast: 'Snel',
            complete: 'Volledig',
            dateFilter: 'Datumfilter',
            filterByDate: 'Filteren op datum',
            from: 'Van',
            to: 'Tot',
            noLimit: 'Leeg = geen limiet',
            refresh: 'Gegevens herladen',
            clearCache: 'Cache wissen',
            shortcuts: 'Sneltoetsen',
            shortcutToggle: 'M = Aan/Uit',
            shortcutClose: 'ESC = Viewer sluiten',
            ready: 'Gereed',
            loading: 'Laden...',
            disabled: 'Uitgeschakeld',
            zoomIn: 'Zoom {zoom}+ voor gegevens',
            zoomMore: 'Verder inzoomen',
            cacheCleared: 'Cache gewist',
            linkCopied: 'Link gekopieerd!',
            noImageFound: 'Geen afbeelding gevonden',
            viewer: 'Mapillary Viewer',
            date: 'Datum',
            creator: 'Maker',
            camera: 'Camera',
            resolution: 'Resolutie',
            firstSeen: 'Eerste keer',
            lastSeen: 'Laatste keer',
            statsImages: 'Afbeeldingen',
            statsSigns: 'Borden',
            statsObjects: 'Objecten',
            sequenceLoaded: 'Sequentie: {count} afbeeldingen',
            prevImage: 'Vorige afbeelding',
            nextImage: 'Volgende afbeelding'
        },
        pl: {
            enabled: 'Włączony',
            display: 'Wyświetlanie',
            images: 'Zdjęcia',
            panoramas: 'Panoramy 360°',
            trafficSigns: 'Znaki drogowe',
            objects: 'Obiekty (Sygnalizacja, itp.)',
            sequenceLines: 'Linie sekwencji',
            signFilters: 'Filtry znaków',
            speed: 'Prędkość',
            stopYield: 'Stop/Ustąp',
            turnDirection: 'Skręt/Kierunek',
            prohibitions: 'Zakazy',
            parking: 'Parkowanie',
            pedestrianCyclist: 'Piesi/Rowerzyści',
            warningSigns: 'Znaki ostrzegawcze',
            infoSigns: 'Znaki informacyjne',
            all: 'Wszystkie',
            none: 'Żadne',
            appearance: 'Wygląd',
            opacity: 'Przezroczystość',
            performance: 'Wydajność',
            maxImages: 'Maks. Zdjęć',
            maxSigns: 'Maks. Znaków',
            fast: 'Szybko',
            complete: 'Kompletnie',
            dateFilter: 'Filtr daty',
            filterByDate: 'Filtruj po dacie',
            from: 'Od',
            to: 'Do',
            noLimit: 'Puste = bez limitu',
            refresh: 'Odśwież dane',
            clearCache: 'Wyczyść cache',
            shortcuts: 'Skróty',
            shortcutToggle: 'M = Włącz/Wyłącz',
            shortcutClose: 'ESC = Zamknij przeglądarkę',
            ready: 'Gotowy',
            loading: 'Ładowanie...',
            disabled: 'Wyłączony',
            zoomIn: 'Zoom {zoom}+ dla danych',
            zoomMore: 'Przybliż więcej',
            cacheCleared: 'Cache wyczyszczony',
            linkCopied: 'Link skopiowany!',
            noImageFound: 'Nie znaleziono zdjęcia',
            viewer: 'Przeglądarka Mapillary',
            date: 'Data',
            creator: 'Twórca',
            camera: 'Aparat',
            resolution: 'Rozdzielczość',
            firstSeen: 'Pierwszy raz',
            lastSeen: 'Ostatni raz',
            statsImages: 'Zdjęcia',
            statsSigns: 'Znaki',
            statsObjects: 'Obiekty',
            sequenceLoaded: 'Sekwencja: {count} zdjęć',
            prevImage: 'Poprzednie zdjęcie',
            nextImage: 'Następne zdjęcie'
        },
        pt: {
            enabled: 'Ativado',
            display: 'Exibição',
            images: 'Imagens',
            panoramas: 'Panoramas 360°',
            trafficSigns: 'Sinais de trânsito',
            objects: 'Objetos (Semáforos, etc.)',
            sequenceLines: 'Linhas de sequência',
            signFilters: 'Filtros de sinais',
            speed: 'Velocidade',
            stopYield: 'Pare/Dê preferência',
            turnDirection: 'Curva/Direção',
            prohibitions: 'Proibições',
            parking: 'Estacionamento',
            pedestrianCyclist: 'Pedestres/Ciclistas',
            warningSigns: 'Sinais de advertência',
            infoSigns: 'Sinais informativos',
            all: 'Todos',
            none: 'Nenhum',
            appearance: 'Aparência',
            opacity: 'Opacidade',
            performance: 'Desempenho',
            maxImages: 'Máx. Imagens',
            maxSigns: 'Máx. Sinais',
            fast: 'Rápido',
            complete: 'Completo',
            dateFilter: 'Filtro de data',
            filterByDate: 'Filtrar por data',
            from: 'De',
            to: 'Até',
            noLimit: 'Vazio = sem limite',
            refresh: 'Recarregar dados',
            clearCache: 'Limpar cache',
            shortcuts: 'Atalhos',
            shortcutToggle: 'M = Ativar/Desativar',
            shortcutClose: 'ESC = Fechar visualizador',
            ready: 'Pronto',
            loading: 'Carregando...',
            disabled: 'Desativado',
            zoomIn: 'Zoom {zoom}+ para dados',
            zoomMore: 'Aproximar mais',
            cacheCleared: 'Cache limpo',
            linkCopied: 'Link copiado!',
            noImageFound: 'Nenhuma imagem encontrada',
            viewer: 'Visualizador Mapillary',
            date: 'Data',
            creator: 'Criador',
            camera: 'Câmera',
            resolution: 'Resolução',
            firstSeen: 'Primeira vez',
            lastSeen: 'Última vez',
            statsImages: 'Imagens',
            statsSigns: 'Sinais',
            statsObjects: 'Objetos',
            sequenceLoaded: 'Sequência: {count} imagens',
            prevImage: 'Imagem anterior',
            nextImage: 'Próxima imagem'
        }
    };

    let currentLang = 'en';

    function detectLanguage() {
        try {
            if (window.I18n?.currentLocale) {
                const locale = window.I18n.currentLocale();
                const lang = locale.split('-')[0].toLowerCase();
                if (I18N[lang]) return lang;
            }
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

    // Schilder-Kategorien für Filter (mit I18N)
    function getSignFilterCategories() {
        return {
            speed: { name: t('speed'), pattern: 'regulatory--speed-limit*,regulatory--maximum-speed*,warning--speed*', icon: '🚗' },
            stop: { name: t('stopYield'), pattern: 'regulatory--stop*,regulatory--yield*,regulatory--give-way*', icon: '🛑' },
            turn: { name: t('turnDirection'), pattern: 'regulatory--turn*,regulatory--go-straight*,regulatory--one-way*,regulatory--keep*', icon: '↩️' },
            noEntry: { name: t('prohibitions'), pattern: 'regulatory--no-entry*,regulatory--no-*', icon: '⛔' },
            parking: { name: t('parking'), pattern: 'regulatory--parking*,regulatory--no-parking*,information--parking*', icon: '🅿️' },
            pedestrian: { name: t('pedestrianCyclist'), pattern: 'warning--pedestrians*,warning--cyclists*,regulatory--pedestrians*,regulatory--bicycles*', icon: '🚶' },
            warning: { name: t('warningSigns'), pattern: 'warning--*', icon: '⚠️' },
            info: { name: t('infoSigns'), pattern: 'information--*', icon: 'ℹ️' }
        };
    }

    // Legacy constant for pattern matching (without I18N names)
    const SIGN_FILTER_CATEGORIES = {
        speed: { pattern: 'regulatory--speed-limit*,regulatory--maximum-speed*,warning--speed*', icon: '🚗' },
        stop: { pattern: 'regulatory--stop*,regulatory--yield*,regulatory--give-way*', icon: '🛑' },
        turn: { pattern: 'regulatory--turn*,regulatory--go-straight*,regulatory--one-way*,regulatory--keep*', icon: '↩️' },
        noEntry: { pattern: 'regulatory--no-entry*,regulatory--no-*', icon: '⛔' },
        parking: { pattern: 'regulatory--parking*,regulatory--no-parking*,information--parking*', icon: '🅿️' },
        pedestrian: { pattern: 'warning--pedestrians*,warning--cyclists*,regulatory--pedestrians*,regulatory--bicycles*', icon: '🚶' },
        warning: { pattern: 'warning--*', icon: '⚠️' },
        info: { pattern: 'information--*', icon: 'ℹ️' }
    };

    let CONFIG = {
        enabled: true,
        opacity: 0.85,
        showImages: true,
        showPanos: true,
        showSigns: true,
        showFeatures: false,
        imageColor: '#05CB63',
        panoColor: '#9B59B6',
        signColor: '#E74C3C',
        featureColor: '#3498DB',
        filterByDate: false,
        dateFrom: '',
        dateTo: '',
        minZoom: 16,
        clusterFeatures: true,
        showSequenceLines: false,
        maxImages: 1000,
        maxSigns: 500,
        // Schilder-Filter (alle aktiv = alle anzeigen)
        signFilters: {
            speed: true,
            stop: true,
            turn: true,
            noEntry: true,
            parking: true,
            pedestrian: true,
            warning: true,
            info: true
        }
    };

    const STORAGE_KEY = 'wme_mapillary_v8';
    let imageLayer = null;
    let signLayer = null;
    let featureLayer = null;
    let sequenceLayer = null;
    let viewerDiv = null;
    let refreshTimer = null;
    let lastBbox = '';
    let cache = new Map();
    let featuresById = new Map();
    let currentSequence = null;
    let sequenceImages = [];
    let currentImageIndex = 0;

    const log = (msg) => console.log(`[${SCRIPT_NAME}] ${msg}`);

    // ============ CONFIG ============
    function loadConfig() {
        try {
            const s = localStorage.getItem(STORAGE_KEY);
            if (s) {
                const saved = JSON.parse(s);
                // Merge top-level
                Object.assign(CONFIG, saved);
                // Merge nested signFilters
                if (saved.signFilters) {
                    CONFIG.signFilters = { ...CONFIG.signFilters, ...saved.signFilters };
                }
            }
        } catch (e) {
            log('Config laden fehlgeschlagen: ' + e.message);
        }
    }

    function saveConfig() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(CONFIG));
        } catch (e) {
            log('Config speichern fehlgeschlagen: ' + e.message);
        }
    }

    // ============ API ============
    const CACHE_MAX_SIZE = 200; // Größerer Cache
    const CACHE_TTL = 5 * 60 * 1000; // 5 Minuten TTL
    
    function api(url) {
        return new Promise((resolve) => {
            // Cache prüfen mit TTL
            const cached = cache.get(url);
            if (cached && (Date.now() - cached.time < CACHE_TTL)) {
                resolve(cached.data);
                return;
            }
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 15000,
                onload: (r) => {
                    try {
                        const data = JSON.parse(r.responseText);
                        // Cache mit Zeitstempel
                        cache.set(url, { data, time: Date.now() });
                        // Cache-Größe begrenzen
                        if (cache.size > CACHE_MAX_SIZE) {
                            const firstKey = cache.keys().next().value;
                            cache.delete(firstKey);
                        }
                        resolve(data);
                    } catch (e) {
                        resolve({ data: [] });
                    }
                },
                onerror: () => resolve({ data: [] }),
                ontimeout: () => resolve({ data: [] })
            });
        });
    }

    async function loadImages(bbox) {
        let url = `https://graph.mapillary.com/images?access_token=${ACCESS_TOKEN}&fields=id,geometry,captured_at,is_pano,sequence,compass_angle,creator&bbox=${bbox}&limit=${CONFIG.maxImages}`;
        
        // Datumsfilter
        if (CONFIG.filterByDate) {
            if (CONFIG.dateFrom) url += `&start_captured_at=${CONFIG.dateFrom}T00:00:00Z`;
            if (CONFIG.dateTo) url += `&end_captured_at=${CONFIG.dateTo}T23:59:59Z`;
        }
        
        const data = await api(url);
        return data.data || [];
    }

    async function loadSigns(bbox) {
        // Baue object_values basierend auf aktiven Filtern
        const patterns = [];
        for (const [key, filter] of Object.entries(SIGN_FILTER_CATEGORIES)) {
            if (CONFIG.signFilters[key]) {
                patterns.push(...filter.pattern.split(','));
            }
        }
        
        // Wenn keine Filter aktiv, lade nichts
        if (patterns.length === 0) return [];
        
        // Deduplizieren und zu String
        const uniquePatterns = [...new Set(patterns)].join(',');
        
        const url = `https://graph.mapillary.com/map_features?access_token=${ACCESS_TOKEN}&fields=id,geometry,object_value,first_seen_at,last_seen_at,images&bbox=${bbox}&object_values=${uniquePatterns}&limit=${CONFIG.maxSigns}`;
        const data = await api(url);
        return data.data || [];
    }

    // Prüft ob ein Schild zu einer Kategorie gehört
    function matchesSignCategory(objectValue, categoryKey) {
        if (!objectValue || !SIGN_FILTER_CATEGORIES[categoryKey]) return false;
        const patterns = SIGN_FILTER_CATEGORIES[categoryKey].pattern.split(',');
        for (const pattern of patterns) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*'));
            if (regex.test(objectValue)) return true;
        }
        return false;
    }

    // Filtert Schilder nach aktiven Kategorien
    function filterSignsByCategory(signs) {
        return signs.filter(sign => {
            if (!sign.object_value) return false;
            for (const [key, enabled] of Object.entries(CONFIG.signFilters)) {
                if (enabled && matchesSignCategory(sign.object_value, key)) {
                    return true;
                }
            }
            return false;
        });
    }

    async function loadFeatures(bbox) {
        const url = `https://graph.mapillary.com/map_features?access_token=${ACCESS_TOKEN}&fields=id,geometry,object_value,first_seen_at,last_seen_at,images&bbox=${bbox}&object_values=object--*&limit=300`;
        const data = await api(url);
        return data.data || [];
    }

    async function loadSequenceImages(sequenceId) {
        const url = `https://graph.mapillary.com/image_ids?access_token=${ACCESS_TOKEN}&sequence_id=${sequenceId}`;
        const data = await api(url);
        return data.data || [];
    }

    async function getImageDetails(imageId) {
        const url = `https://graph.mapillary.com/${imageId}?access_token=${ACCESS_TOKEN}&fields=id,thumb_1024_url,thumb_2048_url,captured_at,creator,is_pano,compass_angle,computed_geometry,sequence,width,height,camera_type,make,model`;
        return await api(url);
    }

    async function getSignImage(signId) {
        const url = `https://graph.mapillary.com/${signId}?access_token=${ACCESS_TOKEN}&fields=images`;
        const data = await api(url);
        return data.images?.data?.[0]?.id || null;
    }

    // ============ SIGN CATEGORIES ============
    const SIGN_CATEGORIES = {
        'regulatory--stop': { icon: '🛑', name: 'Stop' },
        'regulatory--yield': { icon: '⚠️', name: 'Vorfahrt gewähren' },
        'regulatory--speed-limit': { icon: '🚗', name: 'Tempolimit' },
        'regulatory--no-entry': { icon: '⛔', name: 'Einfahrt verboten' },
        'regulatory--no-parking': { icon: '🅿️', name: 'Parkverbot' },
        'regulatory--one-way': { icon: '➡️', name: 'Einbahnstraße' },
        'regulatory--turn': { icon: '↩️', name: 'Abbiegen' },
        'warning--pedestrians': { icon: '🚶', name: 'Fußgänger' },
        'warning--children': { icon: '🚸', name: 'Kinder' },
        'warning--curve': { icon: '↪️', name: 'Kurve' },
        'warning--crossroads': { icon: '✚', name: 'Kreuzung' },
        'information--parking': { icon: '🅿️', name: 'Parken' },
        'information--highway': { icon: '🛣️', name: 'Autobahn' }
    };

    function getSignInfo(value) {
        if (!value) return { icon: '🚦', name: 'Schild' };
        for (const [key, info] of Object.entries(SIGN_CATEGORIES)) {
            if (value.includes(key)) return info;
        }
        const parts = value.split('--');
        return { 
            icon: value.startsWith('warning') ? '⚠️' : value.startsWith('regulatory') ? '🚫' : 'ℹ️',
            name: parts.length >= 2 ? parts[1].replace(/-/g, ' ') : value 
        };
    }

    // ============ FEATURE CATEGORIES ============
    const FEATURE_CATEGORIES = {
        'object--traffic-light': { icon: '🚦', name: 'Ampel' },
        'object--street-light': { icon: '💡', name: 'Straßenlaterne' },
        'object--fire-hydrant': { icon: '🧯', name: 'Hydrant' },
        'object--bench': { icon: '🪑', name: 'Bank' },
        'object--trash-can': { icon: '🗑️', name: 'Mülleimer' },
        'object--mailbox': { icon: '📮', name: 'Briefkasten' },
        'object--phone-booth': { icon: '📞', name: 'Telefonzelle' },
        'object--pole': { icon: '📍', name: 'Mast' },
        'object--manhole': { icon: '⭕', name: 'Kanaldeckel' },
        'object--utility-pole': { icon: '⚡', name: 'Strommast' }
    };

    function getFeatureInfo(value) {
        if (!value) return { icon: '📍', name: 'Objekt' };
        for (const [key, info] of Object.entries(FEATURE_CATEGORIES)) {
            if (value.includes(key)) return info;
        }
        const parts = value.split('--');
        return { icon: '📍', name: parts.length >= 2 ? parts[1].replace(/-/g, ' ') : value };
    }

    // ============ LAYERS ============
    function createLayers() {
        if (!W?.map) return;
        removeLayers();

        const ts = Date.now();

        // Sequence Layer (Linien)
        sequenceLayer = new OpenLayers.Layer.Vector('MLY_Seq_' + ts, {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    strokeColor: '#05CB63',
                    strokeWidth: 3,
                    strokeOpacity: 0.6
                })
            })
        });

        // Image Layer
        imageLayer = new OpenLayers.Layer.Vector('MLY_Img_' + ts, {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    pointRadius: 6,
                    fillColor: '${fillColor}',
                    fillOpacity: CONFIG.opacity,
                    strokeColor: '#fff',
                    strokeWidth: 1.5,
                    rotation: '${rotation}'
                })
            })
        });

        // Sign Layer
        signLayer = new OpenLayers.Layer.Vector('MLY_Sign_' + ts, {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    pointRadius: 8,
                    fillColor: CONFIG.signColor,
                    fillOpacity: CONFIG.opacity,
                    strokeColor: '#fff',
                    strokeWidth: 2,
                    graphicName: 'triangle'
                })
            })
        });

        // Feature Layer
        featureLayer = new OpenLayers.Layer.Vector('MLY_Feat_' + ts, {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    pointRadius: 6,
                    fillColor: CONFIG.featureColor,
                    fillOpacity: CONFIG.opacity,
                    strokeColor: '#fff',
                    strokeWidth: 1.5,
                    graphicName: 'square'
                })
            })
        });

        W.map.addLayer(sequenceLayer);
        W.map.addLayer(imageLayer);
        W.map.addLayer(signLayer);
        W.map.addLayer(featureLayer);

        W.map.setLayerIndex(sequenceLayer, 99);
        W.map.setLayerIndex(imageLayer, 100);
        W.map.setLayerIndex(signLayer, 101);
        W.map.setLayerIndex(featureLayer, 102);

        W.map.events.register('moveend', null, scheduleRefresh);

        log('Layers erstellt');
        refreshData();
    }

    function removeLayers() {
        if (!W?.map) return;
        W.map.events.unregister('moveend', null, scheduleRefresh);

        [sequenceLayer, imageLayer, signLayer, featureLayer].forEach(layer => {
            if (layer) {
                try { W.map.removeLayer(layer); layer.destroy(); } catch(e) {}
            }
        });
        sequenceLayer = imageLayer = signLayer = featureLayer = null;
        featuresById.clear();
    }

    function scheduleRefresh() {
        if (refreshTimer) clearTimeout(refreshTimer);
        // 2 Sekunden warten bevor neu geladen wird (Debounce beim Scrollen)
        refreshTimer = setTimeout(refreshData, 2000);
    }

    let isLoading = false;
    let pendingRefresh = false;

    async function refreshData() {
        if (!CONFIG.enabled || !imageLayer) return;

        // Verhindere parallele Ladevorgänge
        if (isLoading) {
            pendingRefresh = true;
            return;
        }

        const zoom = W.map.getZoom();
        if (zoom < CONFIG.minZoom) {
            setStatus(t('zoomIn', { zoom: CONFIG.minZoom }));
            [sequenceLayer, imageLayer, signLayer, featureLayer].forEach(l => l?.removeAllFeatures());
            return;
        }

        const bounds = W.map.getExtent();
        const proj4326 = new OpenLayers.Projection('EPSG:4326');
        const projMap = W.map.getProjectionObject();
        const b = bounds.clone().transform(projMap, proj4326);

        const bbox = `${b.left.toFixed(6)},${b.bottom.toFixed(6)},${b.right.toFixed(6)},${b.top.toFixed(6)}`;

        const area = (b.right - b.left) * (b.top - b.bottom);
        if (area > 0.01) {
            setStatus(t('zoomMore'));
            return;
        }

        if (bbox === lastBbox) return;
        lastBbox = bbox;

        isLoading = true;
        setStatus(t('loading'));

        try {
            // Parallel laden
            const promises = [];
            if (CONFIG.showImages || CONFIG.showPanos) promises.push(loadImages(bbox));
            else promises.push(Promise.resolve([]));
            
            if (CONFIG.showSigns) promises.push(loadSigns(bbox));
            else promises.push(Promise.resolve([]));
            
            if (CONFIG.showFeatures) promises.push(loadFeatures(bbox));
            else promises.push(Promise.resolve([]));

            const [images, signs, features] = await Promise.all(promises);

            // Prüfe ob sich die Ansicht während des Ladens geändert hat
            const currentBounds = W.map.getExtent();
            const cb = currentBounds.clone().transform(projMap, proj4326);
            const currentBbox = `${cb.left.toFixed(6)},${cb.bottom.toFixed(6)},${cb.right.toFixed(6)},${cb.top.toFixed(6)}`;
            
            if (currentBbox !== bbox) {
                // Ansicht hat sich geändert, verwerfe Ergebnisse
                return;
            }

            featuresById.clear();
            [sequenceLayer, imageLayer, signLayer, featureLayer].forEach(l => l?.removeAllFeatures());

            // Sequences sammeln
            const sequences = new Map();

            // Images
            const imgFeatures = [];
            for (const img of images) {
                if (!img.geometry?.coordinates) continue;
                const isPano = img.is_pano || false;
                if (isPano && !CONFIG.showPanos) continue;
                if (!isPano && !CONFIG.showImages) continue;

                const [lon, lat] = img.geometry.coordinates;
                const pt = new OpenLayers.Geometry.Point(lon, lat).transform(proj4326, projMap);
                const fid = 'img_' + img.id;

                const f = new OpenLayers.Feature.Vector(pt, {
                    fid: fid,
                    fillColor: isPano ? CONFIG.panoColor : CONFIG.imageColor,
                    rotation: img.compass_angle || 0
                });
                f.fid = fid;
                imgFeatures.push(f);

                featuresById.set(fid, { 
                    type: 'image', 
                    id: img.id, 
                    date: img.captured_at, 
                    isPano,
                    sequence: img.sequence,
                    creator: img.creator,
                    compass: img.compass_angle
                });

                // Sequence sammeln
                if (img.sequence && CONFIG.showSequenceLines) {
                    if (!sequences.has(img.sequence)) {
                        sequences.set(img.sequence, []);
                    }
                    sequences.get(img.sequence).push({ lon, lat, date: img.captured_at });
                }
            }
            imageLayer.addFeatures(imgFeatures);

            // Sequence Lines
            if (CONFIG.showSequenceLines) {
                const seqFeatures = [];
                for (const [seqId, points] of sequences) {
                    if (points.length < 2) continue;
                    points.sort((a, b) => a.date - b.date);
                    const linePoints = points.map(p => 
                        new OpenLayers.Geometry.Point(p.lon, p.lat).transform(proj4326, projMap)
                    );
                    const line = new OpenLayers.Geometry.LineString(linePoints);
                    seqFeatures.push(new OpenLayers.Feature.Vector(line));
                }
                sequenceLayer.addFeatures(seqFeatures);
            }

            // Signs
            const signFeatures = [];
            for (const sign of signs) {
                if (!sign.geometry?.coordinates) continue;
                const [lon, lat] = sign.geometry.coordinates;
                const pt = new OpenLayers.Geometry.Point(lon, lat).transform(proj4326, projMap);
                const fid = 'sign_' + sign.id;

                const f = new OpenLayers.Feature.Vector(pt, {});
                f.fid = fid;
                signFeatures.push(f);

                const info = getSignInfo(sign.object_value);
                featuresById.set(fid, { 
                    type: 'sign', 
                    id: sign.id, 
                    value: sign.object_value,
                    icon: info.icon,
                    name: info.name,
                    firstSeen: sign.first_seen_at,
                    lastSeen: sign.last_seen_at,
                    images: sign.images?.data || []
                });
            }
            signLayer.addFeatures(signFeatures);

            // Features
            const featFeatures = [];
            for (const feat of features) {
                if (!feat.geometry?.coordinates) continue;
                const [lon, lat] = feat.geometry.coordinates;
                const pt = new OpenLayers.Geometry.Point(lon, lat).transform(proj4326, projMap);
                const fid = 'feat_' + feat.id;

                const f = new OpenLayers.Feature.Vector(pt, {});
                f.fid = fid;
                featFeatures.push(f);

                const info = getFeatureInfo(feat.object_value);
                featuresById.set(fid, { 
                    type: 'feature', 
                    id: feat.id, 
                    value: feat.object_value,
                    icon: info.icon,
                    name: info.name,
                    firstSeen: feat.first_seen_at,
                    lastSeen: feat.last_seen_at,
                    images: feat.images?.data || []
                });
            }
            featureLayer.addFeatures(featFeatures);

            setStatus(`${imgFeatures.length} ${t('statsImages')} | ${signFeatures.length} ${t('statsSigns')} | ${featFeatures.length} ${t('statsObjects')}`);
        } finally {
            isLoading = false;
            // Falls während des Ladens eine neue Anfrage kam
            if (pendingRefresh) {
                pendingRefresh = false;
                lastBbox = ''; // Force reload
                scheduleRefresh();
            }
        }
    }

    // ============ CLICK HANDLER ============
    function setupClickHandler() {
        const mapEl = document.getElementById('WazeMap') || document.getElementById('map');
        if (!mapEl) {
            setTimeout(setupClickHandler, 1000);
            return;
        }
        mapEl.addEventListener('click', handleClick, true);
        log('Click handler installiert');
    }

    function handleClick(e) {
        if (!CONFIG.enabled) return;
        if (e.target.closest('.sidebar, .toolbar, #mly-viewer, button, input, a, select, .olControlPanel')) return;

        const mapEl = e.currentTarget;
        const rect = mapEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const feature = findFeatureAt(x, y);
        if (feature) {
            e.stopPropagation();
            e.preventDefault();
            onFeatureClick(feature);
        }
    }

    function findFeatureAt(x, y) {
        const tolerance = 15;
        let best = null;
        let bestDist = Infinity;

        const olMap = W.map.olMap || W.map.getOLMap?.() || W.map;

        const check = (layer) => {
            if (!layer?.features) return;
            for (const f of layer.features) {
                if (!f.geometry || !f.fid) continue;
                try {
                    const lonlat = new OpenLayers.LonLat(f.geometry.x, f.geometry.y);
                    let px;
                    if (olMap.getPixelFromLonLat) {
                        px = olMap.getPixelFromLonLat(lonlat);
                    } else {
                        const res = olMap.getResolution();
                        const extent = olMap.getExtent();
                        if (res && extent) {
                            px = {
                                x: (f.geometry.x - extent.left) / res,
                                y: (extent.top - f.geometry.y) / res
                            };
                        }
                    }
                    if (!px) continue;

                    const dx = x - px.x;
                    const dy = y - px.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < tolerance && dist < bestDist) {
                        bestDist = dist;
                        best = f;
                    }
                } catch (e) {}
            }
        };

        check(featureLayer);
        check(signLayer);
        check(imageLayer);
        return best;
    }

    async function onFeatureClick(feature) {
        const data = featuresById.get(feature.fid);
        if (!data) return;

        log('Klick:', feature.fid);

        if (data.type === 'image') {
            currentSequence = data.sequence;
            // Sequenz automatisch laden für Navigation
            if (data.sequence) {
                loadSequenceForNavigation(data.sequence, data.id);
            }
            openViewer(data.id, data);
        } else if (data.type === 'sign' || data.type === 'feature') {
            // Zeige Info und lade erstes Bild
            if (data.images && data.images.length > 0) {
                openViewer(data.images[0].id, data);
            } else {
                const imgId = await getSignImage(data.id);
                if (imgId) {
                    openViewer(imgId, data);
                } else {
                    setStatus(t('noImageFound'));
                }
            }
        }
    }

    // Sequenz im Hintergrund laden
    async function loadSequenceForNavigation(sequenceId, currentImageId) {
        const images = await loadSequenceImages(sequenceId);
        sequenceImages = images.map(i => i.id);
        currentImageIndex = sequenceImages.indexOf(currentImageId);
        if (currentImageIndex === -1) currentImageIndex = 0;
        updateNavButtons();
        log(`Sequenz geladen: ${sequenceImages.length} Bilder`);
    }

    // ============ VIEWER ============
    function createViewer() {
        if (viewerDiv) return;

        GM_addStyle(`
            #mly-viewer {
                position: fixed; bottom: 20px; right: 20px;
                width: 420px; background: #1a1a2e; border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.6);
                z-index: 100000; display: none; flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-height: 90vh; overflow: hidden;
            }
            #mly-viewer.open { display: flex !important; }
            #mly-viewer-head {
                display: flex; justify-content: space-between; align-items: center;
                padding: 12px 15px; background: linear-gradient(135deg, #16213e, #1a1a2e);
                cursor: move; border-radius: 12px 12px 0 0;
            }
            #mly-viewer-head span { color: #05CB63; font-weight: 600; font-size: 14px; }
            #mly-viewer-head .mly-btns { display: flex; gap: 5px; }
            #mly-viewer-head button {
                background: rgba(255,255,255,0.1); border: none; color: #fff;
                font-size: 14px; cursor: pointer; padding: 6px 10px; border-radius: 6px;
            }
            #mly-viewer-head button:hover { background: rgba(255,255,255,0.2); }
            #mly-viewer-body { padding: 15px; overflow-y: auto; }
            #mly-thumb-container { position: relative; }
            #mly-thumb {
                width: 100%; height: 240px; object-fit: cover;
                border-radius: 8px; background: #000; cursor: pointer;
            }
            #mly-thumb:hover { opacity: 0.95; }
            #mly-nav {
                position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
                display: flex; gap: 8px;
            }
            #mly-nav button {
                background: rgba(0,0,0,0.7); border: none; color: #fff;
                padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 16px;
            }
            #mly-nav button:hover { background: rgba(0,0,0,0.9); }
            #mly-nav button:disabled { opacity: 0.3; cursor: not-allowed; }
            #mly-badge {
                position: absolute; top: 10px; left: 10px;
                background: rgba(0,0,0,0.7); color: #fff; padding: 5px 10px;
                border-radius: 15px; font-size: 12px;
            }
            #mly-viewer-info {
                margin-top: 12px; color: #ccc; font-size: 12px;
                background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;
            }
            #mly-viewer-info .mly-row {
                display: flex; justify-content: space-between; margin: 4px 0;
            }
            #mly-viewer-info .mly-label { color: #888; }
            #mly-viewer-info .mly-value { color: #fff; }
            #mly-detection-info {
                margin-top: 10px; padding: 10px; background: rgba(231,76,60,0.3);
                border-radius: 8px; border-left: 3px solid #e74c3c;
                color: #fff;
            }
            #mly-detection-info .mly-icon { font-size: 24px; margin-right: 8px; }
            #mly-detection-info b { color: #fff; }
            #mly-detection-info small { color: #ddd; }
        `);

        viewerDiv = document.createElement('div');
        viewerDiv.id = 'mly-viewer';
        viewerDiv.innerHTML = `
            <div id="mly-viewer-head">
                <span>🗺️ ${t('viewer')}</span>
                <div class="mly-btns">
                    <button id="mly-btn-copy" title="${t('linkCopied').replace('!', '')}">📋</button>
                    <button id="mly-btn-close" title="${t('shortcutClose')}">✕</button>
                </div>
            </div>
            <div id="mly-viewer-body">
                <div id="mly-thumb-container">
                    <img id="mly-thumb" src="" alt="Mapillary">
                    <div id="mly-badge"></div>
                    <div id="mly-nav">
                        <button id="mly-prev" title="${t('prevImage')}">◀</button>
                        <button id="mly-next" title="${t('nextImage')}">▶</button>
                    </div>
                </div>
                <div id="mly-detection-info" style="display:none;"></div>
                <div id="mly-viewer-info"></div>
            </div>
        `;
        document.body.appendChild(viewerDiv);

        // Events
        document.getElementById('mly-btn-close').onclick = closeViewer;
        document.getElementById('mly-btn-copy').onclick = copyImageLink;
        document.getElementById('mly-thumb').onclick = openInMapillary;
        document.getElementById('mly-prev').onclick = () => navigateSequence(-1);
        document.getElementById('mly-next').onclick = () => navigateSequence(1);

        // Draggable
        let drag = false, sx, sy, sl, st;
        const head = document.getElementById('mly-viewer-head');
        head.onmousedown = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            drag = true; sx = e.clientX; sy = e.clientY;
            const r = viewerDiv.getBoundingClientRect();
            sl = r.left; st = r.top;
        };
        document.onmousemove = (e) => {
            if (!drag) return;
            viewerDiv.style.left = (sl + e.clientX - sx) + 'px';
            viewerDiv.style.top = (st + e.clientY - sy) + 'px';
            viewerDiv.style.right = 'auto';
            viewerDiv.style.bottom = 'auto';
        };
        document.onmouseup = () => drag = false;
    }

    let currentImageData = null;

    async function openViewer(imageId, featureData = {}) {
        createViewer();
        viewerDiv.classList.add('open');

        const thumb = document.getElementById('mly-thumb');
        const badge = document.getElementById('mly-badge');
        const infoEl = document.getElementById('mly-viewer-info');
        const detectionEl = document.getElementById('mly-detection-info');

        // Sofort Thumbnail laden (Mapillary URL-Schema)
        thumb.src = `https://thumbnails.mapillary.com/${imageId}/thumb-1024.jpg`;
        
        // Badge sofort setzen wenn bekannt
        badge.textContent = '';
        if (featureData.type === 'sign') badge.textContent = featureData.icon + ' ' + featureData.name;
        else if (featureData.type === 'feature') badge.textContent = featureData.icon + ' ' + featureData.name;
        else if (featureData.isPano) badge.textContent = '360°';

        // Detection Info sofort anzeigen
        if (featureData.type === 'sign' || featureData.type === 'feature') {
            detectionEl.style.display = 'block';
            const firstSeen = featureData.firstSeen ? new Date(featureData.firstSeen).toLocaleDateString(currentLang) : '-';
            const lastSeen = featureData.lastSeen ? new Date(featureData.lastSeen).toLocaleDateString(currentLang) : '-';
            detectionEl.innerHTML = `
                <span class="mly-icon">${featureData.icon}</span>
                <b>${featureData.name}</b><br>
                <small>${t('firstSeen')}: ${firstSeen} | ${t('lastSeen')}: ${lastSeen}</small>
            `;
        } else {
            detectionEl.style.display = 'none';
        }

        // Basis-Info sofort anzeigen
        const dateStr = featureData.date ? new Date(featureData.date).toLocaleDateString(currentLang, { 
            year: 'numeric', month: 'long', day: 'numeric'
        }) : '';
        
        infoEl.innerHTML = `
            <div class="mly-row"><span class="mly-label">${t('date')}:</span><span class="mly-value">${dateStr || t('loading')}</span></div>
            <div class="mly-row"><span class="mly-label">${t('creator')}:</span><span class="mly-value" id="mly-info-creator">${t('loading')}</span></div>
            <div class="mly-row"><span class="mly-label">${t('camera')}:</span><span class="mly-value" id="mly-info-camera">-</span></div>
            <div class="mly-row"><span class="mly-label">${t('resolution')}:</span><span class="mly-value" id="mly-info-size">-</span></div>
            <div class="mly-row"><span class="mly-label">ID:</span><span class="mly-value" style="font-size:10px;">${imageId}</span></div>
        `;

        currentImageData = { id: imageId, featureData };
        updateNavButtons();

        // Details im Hintergrund laden
        getImageDetails(imageId).then(data => {
            if (currentImageData?.id !== imageId) return; // Abgebrochen
            
            currentImageData = { ...data, featureData };
            
            // Besseres Thumbnail wenn verfügbar
            if (data.thumb_2048_url) {
                thumb.src = data.thumb_2048_url;
            }
            
            // Badge aktualisieren
            if (data.is_pano && !featureData.type) badge.textContent = '360°';
            
            // Details aktualisieren
            const date = data.captured_at ? new Date(data.captured_at).toLocaleDateString(currentLang, { 
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            }) : '-';
            const creator = data.creator?.username || '-';
            const camera = [data.make, data.model].filter(Boolean).join(' ') || '-';
            const size = data.width && data.height ? `${data.width}×${data.height}` : '-';

            infoEl.innerHTML = `
                <div class="mly-row"><span class="mly-label">${t('date')}:</span><span class="mly-value">${date}</span></div>
                <div class="mly-row"><span class="mly-label">${t('creator')}:</span><span class="mly-value">${creator}</span></div>
                <div class="mly-row"><span class="mly-label">${t('camera')}:</span><span class="mly-value">${camera}</span></div>
                <div class="mly-row"><span class="mly-label">${t('resolution')}:</span><span class="mly-value">${size}</span></div>
                <div class="mly-row"><span class="mly-label">ID:</span><span class="mly-value" style="font-size:10px;">${imageId}</span></div>
            `;
        });

        log('Viewer:', imageId);
    }

    function closeViewer() {
        if (viewerDiv) viewerDiv.classList.remove('open');
        sequenceImages = [];
        currentImageIndex = 0;
    }

    function getMapillaryUrl(imageId) {
        // Koordinaten aus currentImageData wenn verfügbar
        let url = `https://www.mapillary.com/app/?pKey=${imageId}&focus=photo`;
        
        if (currentImageData?.computed_geometry?.coordinates) {
            const [lon, lat] = currentImageData.computed_geometry.coordinates;
            url += `&lat=${lat.toFixed(7)}&lng=${lon.toFixed(7)}&z=17`;
        }
        
        return url;
    }

    function openInMapillary() {
        if (currentImageData?.id) {
            window.open(getMapillaryUrl(currentImageData.id), '_blank');
        }
    }

    function copyImageLink() {
        if (currentImageData?.id) {
            const url = getMapillaryUrl(currentImageData.id);
            GM_setClipboard(url);
            setStatus(t('linkCopied'));
        }
    }

    function navigateSequence(direction) {
        if (sequenceImages.length === 0) return;

        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = 0;
        if (currentImageIndex >= sequenceImages.length) currentImageIndex = sequenceImages.length - 1;

        openViewer(sequenceImages[currentImageIndex], currentImageData?.featureData || {});
    }

    function updateNavButtons() {
        const prevBtn = document.getElementById('mly-prev');
        const nextBtn = document.getElementById('mly-next');

        if (sequenceImages.length > 0) {
            prevBtn.disabled = currentImageIndex <= 0;
            nextBtn.disabled = currentImageIndex >= sequenceImages.length - 1;
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }

    // ============ STATUS ============
    function setStatus(msg) {
        const el = document.getElementById('mly-status');
        if (el) el.textContent = msg;
        log(msg);
    }

    // ============ UI PANEL ============
    function createUI() {
        const tabHtml = `
            <div id="mly-panel" style="padding: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 24px; margin-right: 10px;">🗺️</span>
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">Mapillary Viewer</div>
                        <div style="font-size: 11px; color: #888;">v${SCRIPT_VERSION}</div>
                    </div>
                </div>

                <div id="mly-status" style="background: #f0f0f0; padding: 8px; border-radius: 6px; margin-bottom: 15px; font-size: 12px; text-align: center;">
                    ${t('ready')}
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                        <input type="checkbox" id="mly-enabled" ${CONFIG.enabled ? 'checked' : ''} style="margin-right: 8px;">
                        <span style="font-weight: 500;">${t('enabled')}</span>
                    </label>
                </div>

                <div style="border-top: 1px solid #ddd; padding-top: 12px; margin-bottom: 12px;">
                    <div style="font-weight: 600; margin-bottom: 10px; font-size: 13px;">📷 ${t('display')}</div>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 6px;">
                        <input type="checkbox" id="mly-showImages" ${CONFIG.showImages ? 'checked' : ''} style="margin-right: 8px;">
                        <span style="color: ${CONFIG.imageColor};">●</span>&nbsp;${t('images')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 6px;">
                        <input type="checkbox" id="mly-showPanos" ${CONFIG.showPanos ? 'checked' : ''} style="margin-right: 8px;">
                        <span style="color: ${CONFIG.panoColor};">●</span>&nbsp;${t('panoramas')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 6px;">
                        <input type="checkbox" id="mly-showSigns" ${CONFIG.showSigns ? 'checked' : ''} style="margin-right: 8px;">
                        <span style="color: ${CONFIG.signColor};">▲</span>&nbsp;${t('trafficSigns')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 6px;">
                        <input type="checkbox" id="mly-showFeatures" ${CONFIG.showFeatures ? 'checked' : ''} style="margin-right: 8px;">
                        <span style="color: ${CONFIG.featureColor};">■</span>&nbsp;${t('objects')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 6px;">
                        <input type="checkbox" id="mly-showSequenceLines" ${CONFIG.showSequenceLines ? 'checked' : ''} style="margin-right: 8px;">
                        <span>📍</span>&nbsp;${t('sequenceLines')}
                    </label>
                </div>

                <div id="mly-sign-filters" style="border-top: 1px solid #ddd; padding-top: 12px; margin-bottom: 12px; display: ${CONFIG.showSigns ? 'block' : 'none'};">
                    <div style="font-weight: 600; margin-bottom: 10px; font-size: 13px;">🚦 ${t('signFilters')}</div>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-speed" ${CONFIG.signFilters.speed ? 'checked' : ''} style="margin-right: 6px;">
                        <span>🚗</span>&nbsp;${t('speed')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-stop" ${CONFIG.signFilters.stop ? 'checked' : ''} style="margin-right: 6px;">
                        <span>🛑</span>&nbsp;${t('stopYield')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-turn" ${CONFIG.signFilters.turn ? 'checked' : ''} style="margin-right: 6px;">
                        <span>↩️</span>&nbsp;${t('turnDirection')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-noEntry" ${CONFIG.signFilters.noEntry ? 'checked' : ''} style="margin-right: 6px;">
                        <span>⛔</span>&nbsp;${t('prohibitions')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-parking" ${CONFIG.signFilters.parking ? 'checked' : ''} style="margin-right: 6px;">
                        <span>🅿️</span>&nbsp;${t('parking')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-pedestrian" ${CONFIG.signFilters.pedestrian ? 'checked' : ''} style="margin-right: 6px;">
                        <span>🚶</span>&nbsp;${t('pedestrianCyclist')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-warning" ${CONFIG.signFilters.warning ? 'checked' : ''} style="margin-right: 6px;">
                        <span>⚠️</span>&nbsp;${t('warningSigns')}
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px; font-size: 12px;">
                        <input type="checkbox" id="mly-sign-info" ${CONFIG.signFilters.info ? 'checked' : ''} style="margin-right: 6px;">
                        <span>ℹ️</span>&nbsp;${t('infoSigns')}
                    </label>
                    
                    <div style="margin-top: 8px; display: flex; gap: 6px;">
                        <button id="mly-signs-all" style="flex: 1; padding: 4px 8px; font-size: 11px; background: #05CB63; color: white; border: none; border-radius: 4px; cursor: pointer;">${t('all')}</button>
                        <button id="mly-signs-none" style="flex: 1; padding: 4px 8px; font-size: 11px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">${t('none')}</button>
                    </div>
                </div>

                <div style="border-top: 1px solid #ddd; padding-top: 12px; margin-bottom: 12px;">
                    <div style="font-weight: 600; margin-bottom: 10px; font-size: 13px;">🎨 ${t('appearance')}</div>
                    
                    <div style="margin-bottom: 8px;">
                        <label style="font-size: 12px; display: block; margin-bottom: 4px;">${t('opacity')}: <span id="mly-opacity-val">${Math.round(CONFIG.opacity * 100)}%</span></label>
                        <input type="range" id="mly-opacity" min="20" max="100" value="${CONFIG.opacity * 100}" style="width: 100%;">
                    </div>
                </div>

                <div style="border-top: 1px solid #ddd; padding-top: 12px; margin-bottom: 12px;">
                    <div style="font-weight: 600; margin-bottom: 10px; font-size: 13px;">⚡ ${t('performance')}</div>
                    
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label style="font-size: 12px;">${t('maxImages')}:</label>
                            <span id="mly-maxImages-val" style="font-weight: 600; color: #05CB63; background: #e8f5e9; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${CONFIG.maxImages}</span>
                        </div>
                        <input type="range" id="mly-maxImages" min="100" max="5000" step="100" value="${CONFIG.maxImages}" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #888;">
                            <span>100 (${t('fast')})</span>
                            <span>5000 (${t('complete')})</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label style="font-size: 12px;">${t('maxSigns')}:</label>
                            <span id="mly-maxSigns-val" style="font-weight: 600; color: #e74c3c; background: #ffebee; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${CONFIG.maxSigns}</span>
                        </div>
                        <input type="range" id="mly-maxSigns" min="50" max="2000" step="50" value="${CONFIG.maxSigns}" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #888;">
                            <span>50 (${t('fast')})</span>
                            <span>2000 (${t('complete')})</span>
                        </div>
                    </div>
                </div>

                <div style="border-top: 1px solid #ddd; padding-top: 12px; margin-bottom: 12px;">
                    <div style="font-weight: 600; margin-bottom: 10px; font-size: 13px;">📅 ${t('dateFilter')}</div>
                    
                    <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                        <input type="checkbox" id="mly-filterByDate" ${CONFIG.filterByDate ? 'checked' : ''} style="margin-right: 8px;">
                        <span>${t('filterByDate')}</span>
                    </label>
                    
                    <div id="mly-date-fields" style="display: ${CONFIG.filterByDate ? 'block' : 'none'}; background: #f5f5f5; padding: 10px; border-radius: 6px;">
                        <div style="margin-bottom: 8px;">
                            <label style="font-size: 11px; display: block; margin-bottom: 4px; font-weight: 500;">${t('from')}:</label>
                            <input type="date" id="mly-dateFrom" value="${CONFIG.dateFrom}" style="width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; background: white;">
                        </div>
                        <div>
                            <label style="font-size: 11px; display: block; margin-bottom: 4px; font-weight: 500;">${t('to')}:</label>
                            <input type="date" id="mly-dateTo" value="${CONFIG.dateTo}" style="width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; background: white;">
                        </div>
                        <div style="margin-top: 8px; font-size: 10px; color: #666;">
                            ${t('noLimit')}
                        </div>
                    </div>
                </div>

                <div style="border-top: 1px solid #ddd; padding-top: 12px;">
                    <button id="mly-refresh" style="width: 100%; padding: 10px; background: #05CB63; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; margin-bottom: 8px;">
                        🔄 ${t('refresh')}
                    </button>
                    <button id="mly-clear-cache" style="width: 100%; padding: 8px; background: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        🗑️ ${t('clearCache')}
                    </button>
                </div>

                <div style="margin-top: 15px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 11px; color: #888;">
                    <div style="margin-bottom: 4px;"><b>${t('shortcuts')}:</b></div>
                    <div>${t('shortcutClose')}</div>
                </div>
            </div>
        `;

        try {
            const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);
            tabLabel.innerText = 'Mapillary';
            tabLabel.title = 'Mapillary Viewer';
            tabPane.innerHTML = tabHtml;

            // Helper-Funktionen die im tabPane suchen
            const getEl = (id) => tabPane.querySelector('#' + id);
            const setVal = (id, val) => { const el = getEl(id); if (el) el.value = val; };
            const setChecked = (id, val) => { const el = getEl(id); if (el) el.checked = val; };
            const setText = (id, val) => { const el = getEl(id); if (el) el.textContent = val; };
            
            // UI-Werte aus gespeicherter Config setzen
            setChecked('mly-enabled', CONFIG.enabled);
            setChecked('mly-showImages', CONFIG.showImages);
            setChecked('mly-showPanos', CONFIG.showPanos);
            setChecked('mly-showSigns', CONFIG.showSigns);
            setChecked('mly-showFeatures', CONFIG.showFeatures);
            setChecked('mly-showSequenceLines', CONFIG.showSequenceLines);
            setChecked('mly-filterByDate', CONFIG.filterByDate);
            
            setVal('mly-opacity', CONFIG.opacity * 100);
            setText('mly-opacity-val', Math.round(CONFIG.opacity * 100) + '%');
            
            setVal('mly-maxImages', CONFIG.maxImages);
            setText('mly-maxImages-val', CONFIG.maxImages);
            
            setVal('mly-maxSigns', CONFIG.maxSigns);
            setText('mly-maxSigns-val', CONFIG.maxSigns);
            
            setVal('mly-dateFrom', CONFIG.dateFrom || '');
            setVal('mly-dateTo', CONFIG.dateTo || '');
            
            // Schilder-Filter
            ['speed', 'stop', 'turn', 'noEntry', 'parking', 'pedestrian', 'warning', 'info'].forEach(key => {
                setChecked('mly-sign-' + key, CONFIG.signFilters?.[key] ?? true);
            });
            
            // Sichtbarkeit der Bereiche
            const signFiltersDiv = getEl('mly-sign-filters');
            if (signFiltersDiv) signFiltersDiv.style.display = CONFIG.showSigns ? 'block' : 'none';
            
            const dateFieldsDiv = getEl('mly-date-fields');
            if (dateFieldsDiv) dateFieldsDiv.style.display = CONFIG.filterByDate ? 'block' : 'none';

            // Event Listeners - auch mit getEl
            const bindCheckbox = (id, key) => {
                const el = getEl(id);
                if (el) {
                    el.onchange = () => {
                        CONFIG[key] = el.checked;
                        saveConfig();
                        if (key === 'enabled') {
                            syncLayerToggle(CONFIG.enabled);
                            if (CONFIG.enabled) createLayers();
                            else removeLayers();
                        } else if (key === 'filterByDate') {
                            getEl('mly-date-fields').style.display = CONFIG.filterByDate ? 'block' : 'none';
                            lastBbox = '';
                            refreshData();
                        } else {
                            lastBbox = '';
                            refreshData();
                        }
                    };
                }
            };

            bindCheckbox('mly-enabled', 'enabled');
            bindCheckbox('mly-showImages', 'showImages');
            bindCheckbox('mly-showPanos', 'showPanos');
            bindCheckbox('mly-showFeatures', 'showFeatures');
            bindCheckbox('mly-showSequenceLines', 'showSequenceLines');
            bindCheckbox('mly-filterByDate', 'filterByDate');

            // Schilder-Checkbox mit Sichtbarkeit des Filter-Bereichs
            const showSignsEl = getEl('mly-showSigns');
            if (showSignsEl) {
                showSignsEl.onchange = () => {
                    CONFIG.showSigns = showSignsEl.checked;
                    saveConfig();
                    getEl('mly-sign-filters').style.display = CONFIG.showSigns ? 'block' : 'none';
                    lastBbox = '';
                    refreshData();
                };
            }

            // Schilder-Filter Checkboxen
            const signFilterKeys = ['speed', 'stop', 'turn', 'noEntry', 'parking', 'pedestrian', 'warning', 'info'];
            signFilterKeys.forEach(key => {
                const el = getEl('mly-sign-' + key);
                if (el) {
                    el.onchange = () => {
                        CONFIG.signFilters[key] = el.checked;
                        saveConfig();
                        lastBbox = '';
                        refreshData();
                    };
                }
            });

            // Alle/Keine Buttons
            const signsAllBtn = getEl('mly-signs-all');
            const signsNoneBtn = getEl('mly-signs-none');
            if (signsAllBtn) {
                signsAllBtn.onclick = () => {
                    signFilterKeys.forEach(key => {
                        CONFIG.signFilters[key] = true;
                        const el = getEl('mly-sign-' + key);
                        if (el) el.checked = true;
                    });
                    saveConfig();
                    lastBbox = '';
                    refreshData();
                };
            }
            if (signsNoneBtn) {
                signsNoneBtn.onclick = () => {
                    signFilterKeys.forEach(key => {
                        CONFIG.signFilters[key] = false;
                        const el = getEl('mly-sign-' + key);
                        if (el) el.checked = false;
                    });
                    saveConfig();
                    lastBbox = '';
                    refreshData();
                };
            }

            const opacityEl = getEl('mly-opacity');
            const opacityValEl = getEl('mly-opacity-val');
            if (opacityEl) {
                opacityEl.oninput = () => {
                    CONFIG.opacity = opacityEl.value / 100;
                    if (opacityValEl) opacityValEl.textContent = opacityEl.value + '%';
                    saveConfig();
                    // Update layer styles
                    [imageLayer, signLayer, featureLayer].forEach(l => {
                        if (l?.styleMap?.styles?.default?.defaultStyle) {
                            l.styleMap.styles.default.defaultStyle.fillOpacity = CONFIG.opacity;
                            l.redraw();
                        }
                    });
                };
            }

            // Max Images Slider
            const maxImagesEl = getEl('mly-maxImages');
            const maxImagesValEl = getEl('mly-maxImages-val');
            if (maxImagesEl) {
                maxImagesEl.oninput = () => {
                    CONFIG.maxImages = parseInt(maxImagesEl.value);
                    if (maxImagesValEl) maxImagesValEl.textContent = CONFIG.maxImages;
                };
                maxImagesEl.onchange = () => {
                    saveConfig();
                    lastBbox = '';
                    refreshData();
                };
            }

            // Max Signs Slider
            const maxSignsEl = getEl('mly-maxSigns');
            const maxSignsValEl = getEl('mly-maxSigns-val');
            if (maxSignsEl) {
                maxSignsEl.oninput = () => {
                    CONFIG.maxSigns = parseInt(maxSignsEl.value);
                    if (maxSignsValEl) maxSignsValEl.textContent = CONFIG.maxSigns;
                };
                maxSignsEl.onchange = () => {
                    saveConfig();
                    lastBbox = '';
                    refreshData();
                };
            }

            const dateFromEl = getEl('mly-dateFrom');
            const dateToEl = getEl('mly-dateTo');
            if (dateFromEl) {
                dateFromEl.onchange = () => {
                    CONFIG.dateFrom = dateFromEl.value;
                    saveConfig();
                    if (CONFIG.filterByDate) { lastBbox = ''; refreshData(); }
                };
            }
            if (dateToEl) {
                dateToEl.onchange = () => {
                    CONFIG.dateTo = dateToEl.value;
                    saveConfig();
                    if (CONFIG.filterByDate) { lastBbox = ''; refreshData(); }
                };
            }

            const refreshBtn = getEl('mly-refresh');
            if (refreshBtn) {
                refreshBtn.onclick = () => {
                    lastBbox = '';
                    refreshData();
                };
            }

            const clearCacheBtn = getEl('mly-clear-cache');
            if (clearCacheBtn) {
                clearCacheBtn.onclick = () => {
                    cache.clear();
                    lastBbox = '';
                    setStatus(t('cacheCleared'));
                    refreshData();
                };
            }

            log('UI erstellt');
        } catch (e) {
            log('UI Fehler: ' + e.message);
        }
    }

    // ============ KEYBOARD SHORTCUTS ============
    function setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ignoriere wenn in Input-Feld
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

            if (e.key === 'Escape') {
                closeViewer();
            }

            // Pfeiltasten für Navigation
            if (viewerDiv?.classList.contains('open') && sequenceImages.length > 0) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    navigateSequence(-1);
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    navigateSequence(1);
                }
            }
        });
        log('Tastenkürzel aktiviert');
    }

    // ============ LAYER CHECKBOX (rechte Sidebar - Andere Daten) ============
    let layerSidebarCheckbox = null;
    
    function createLayerCheckbox() {
        // Finde "Andere Daten" / "Other Data" Sektion
        function findInsertionPoint() {
            // Suche nach "Satellitenbild" Label
            const labels = document.querySelectorAll('wz-checkbox, label');
            for (const el of labels) {
                const text = el.textContent || '';
                if (/Satellitenbild|Satellite/i.test(text)) {
                    return { element: el, mode: 'after' };
                }
            }
            
            // Fallback: Suche "Andere Daten" Header
            const headers = document.querySelectorAll('wz-section-header, h3, h4');
            for (const h of headers) {
                if (/Andere Daten|Other Data/i.test(h.textContent || '')) {
                    const section = h.closest('wz-card, section, div');
                    if (section) {
                        const list = section.querySelector('wz-list, ul, div');
                        if (list) return { element: list, mode: 'prepend' };
                    }
                }
            }
            
            return null;
        }
        
        function buildCheckbox() {
            const item = document.createElement('wz-checkbox');
            item.id = 'mly-layer-toggle';
            item.checked = CONFIG.enabled;
            item.innerHTML = 'Mapillary';
            
            item.addEventListener('change', (e) => {
                CONFIG.enabled = e.target.checked;
                saveConfig();
                syncPanelCheckbox();
                
                if (CONFIG.enabled) {
                    createLayers();
                } else {
                    removeLayers();
                }
            });
            
            return item;
        }
        
        function mount() {
            // Prüfe ob schon vorhanden
            if (document.getElementById('mly-layer-toggle')) return true;
            
            const target = findInsertionPoint();
            if (!target) return false;
            
            const checkbox = buildCheckbox();
            layerSidebarCheckbox = checkbox;
            
            if (target.mode === 'after') {
                target.element.insertAdjacentElement('afterend', checkbox);
            } else if (target.mode === 'prepend') {
                target.element.insertBefore(checkbox, target.element.firstChild);
            } else {
                target.element.appendChild(checkbox);
            }
            
            log('Layer-Toggle in Sidebar eingefügt');
            return true;
        }
        
        // Versuche sofort zu mounten
        if (!mount()) {
            // Falls nicht gefunden, beobachte DOM-Änderungen
            const observer = new MutationObserver(() => {
                if (mount()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Timeout nach 30 Sekunden
            setTimeout(() => observer.disconnect(), 30000);
        }
    }
    
    // Sync Panel-Checkbox mit Sidebar-Checkbox
    function syncPanelCheckbox() {
        const panelCheckbox = document.getElementById('mly-enabled');
        if (panelCheckbox) panelCheckbox.checked = CONFIG.enabled;
    }
    
    // Sync Sidebar-Checkbox mit Panel-Checkbox
    function syncLayerToggle(enabled) {
        if (layerSidebarCheckbox) layerSidebarCheckbox.checked = enabled;
    }

    // ============ INIT ============
    function init() {
        // Sprache erkennen
        currentLang = detectLanguage();
        log(`Language: ${currentLang}`);
        
        loadConfig();
        log(`v${SCRIPT_VERSION} gestartet`);

        createUI();
        createLayerCheckbox();
        setupClickHandler();
        setupKeyboard();

        if (CONFIG.enabled) {
            createLayers();
        }

        setStatus(t('ready'));
    }

    // Warte auf WME
    if (W?.userscripts?.state?.isReady) {
        init();
    } else {
        document.addEventListener('wme-ready', init, { once: true });
    }

})();
