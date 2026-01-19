// ==UserScript==
// @name         enhanced artikel-edit
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      0.9.2
// @description  Klon-Artikel Info | Vergleichslinks | Clone-Optionen | Grid Divider | Created-From-Info | Einstellungsmenü
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel?id=*
// @match        https://opus.geizhals.at/kalif/artikel?clone_id=*
// @noframes
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/555708/enhanced%20artikel-edit.user.js
// @updateURL https://update.greasyfork.org/scripts/555708/enhanced%20artikel-edit.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    // Nicht in iframes ausführen - verhindert mehrfache Skript-Instanzen
    try {
        if (window.self !== window.top) return;
    } catch (e) {
        // Cross-origin iframe - auch nicht ausführen
        return;
    }

    // Zusätzliche Prüfung: Nur auf der Haupt-Artikel-Seite ausführen
    if (!window.location.pathname.startsWith('/kalif/artikel')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedArtikelEditInitialized) return;
    window.__enhancedArtikelEditInitialized = true;

    // ===== CLIPBOARD INTERCEPTOR =====
    // Fängt clipboard.writeText ab und speichert Daten im sessionStorage
    // Damit können wir auf der clone_id-Seite die Daten ohne "Einfügen"-Button verwenden
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = function(text) {
        // Speichere die kopierten Daten im sessionStorage
        try {
            sessionStorage.setItem('geizhals-clipboard-data', text);
        } catch (e) {
            // ignore
        }
        // Rufe die originale Funktion auf
        return originalWriteText(text);
    };

    // Interceptor für clipboard.readText - liefert Daten aus sessionStorage
    const originalReadText = navigator.clipboard.readText.bind(navigator.clipboard);
    navigator.clipboard.readText = async function() {
        // Prüfe ob wir gecachte Daten haben
        const cachedData = sessionStorage.getItem('geizhals-clipboard-data');
        if (cachedData) {
            return cachedData;
        }
        // Fallback auf originale Funktion
        return originalReadText();
    };

    // ===== GLOBAL ERROR HANDLER für DOM-Manipulations-Fehler =====
    // Fängt "removeChild" und "insertBefore" Fehler ab, die durch React-Updates während unserer DOM-Manipulationen entstehen

    // Patche Node.prototype.insertBefore um Fehler abzufangen
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
        try {
            return originalInsertBefore.call(this, newNode, referenceNode);
        } catch (e) {
            if (e.name === 'NotFoundError' || (e.message && e.message.includes('not a child'))) {
                // Silently ignore - DOM wurde während der Operation geändert
                return newNode;
            }
            throw e;
        }
    };

    // Patche Node.prototype.removeChild um Fehler abzufangen
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(child) {
        try {
            return originalRemoveChild.call(this, child);
        } catch (e) {
            if (e.name === 'NotFoundError' || (e.message && e.message.includes('not a child'))) {
                // Silently ignore - DOM wurde während der Operation geändert
                return child;
            }
            throw e;
        }
    };

    // Verwende window.onerror für synchrone Fehler
    const originalOnerror = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (message && (
            (message.includes('removeChild') && message.includes('not a child')) ||
            (message.includes('insertBefore') && message.includes('not a child'))
        )) {
            return true; // Fehler unterdrücken
        }
        if (originalOnerror) {
            return originalOnerror.call(this, message, source, lineno, colno, error);
        }
        return false;
    };

    // Zusätzlich addEventListener für capturing phase
    window.addEventListener('error', function(e) {
        if (e.message && (
            (e.message.includes('removeChild') && e.message.includes('not a child')) ||
            (e.message.includes('insertBefore') && e.message.includes('not a child'))
        )) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
        }
    }, true);

    // Auch für unhandled Promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && e.reason.message && (
            (e.reason.message.includes('removeChild') && e.reason.message.includes('not a child')) ||
            (e.reason.message.includes('insertBefore') && e.reason.message.includes('not a child'))
        )) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
        }
    }, true);

    // Überschreibe console.error um DOM-Manipulations-Fehler zu unterdrücken
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (message && (
            (message.includes('removeChild') && message.includes('not a child')) ||
            (message.includes('insertBefore') && message.includes('not a child'))
        )) {
            return; // Fehler unterdrücken
        }
        originalConsoleError.apply(console, args);
    };

    // ===== BEFOREUNLOAD INTERCEPTOR =====
    // Speichere alle beforeunload-Listener, damit wir sie später entfernen können
    const beforeUnloadListeners = [];
    const originalAddEventListener = window.addEventListener.bind(window);
    const originalRemoveEventListener = window.removeEventListener.bind(window);

    window.addEventListener = function(type, listener, options) {
        if (type === 'beforeunload') {
            beforeUnloadListeners.push({ listener, options });
        }
        return originalAddEventListener(type, listener, options);
    };

    window.removeEventListener = function(type, listener, options) {
        if (type === 'beforeunload') {
            const index = beforeUnloadListeners.findIndex(l => l.listener === listener);
            if (index !== -1) {
                beforeUnloadListeners.splice(index, 1);
            }
        }
        return originalRemoveEventListener(type, listener, options);
    };

    // Funktion zum Entfernen aller beforeunload-Listener
    function removeAllBeforeUnloadListeners() {
        // Entferne alle gespeicherten Listener
        beforeUnloadListeners.forEach(({ listener, options }) => {
            originalRemoveEventListener('beforeunload', listener, options);
        });
        beforeUnloadListeners.length = 0;

        // Setze onbeforeunload auf null
        window.onbeforeunload = null;
    }

    // ===== KONFIGURATION =====
    const BUTTONS = [
        {
            id: 'cloned-from',
            label: 'geklont von',
            type: 'normal'
        },
        {
            id: 'vergleich-gh-eu',
            label: 'Vergleich GH',
            variant: '(eu)',
            type: 'normal'
        },
        {
            id: 'vergleich-gh-de',
            label: 'Vergleich GH',
            variant: '(de)',
            type: 'normal'
        },
        {
            id: 'vergleich-gh-at',
            label: 'Vergleich GH',
            variant: '(at)',
            type: 'normal'
        },
        {
            id: 'vergleich-kalif',
            label: 'Vergleich Kalif',
            type: 'normal'
        },
        {
            id: 'vergleich-bilder',
            label: 'Vergleich Bilder',
            type: 'normal'
        }
    ];

    // ===== GLOBALE VARIABLEN =====
    let currentId = null;
    let clonedFromId = null;
    let bulkId = null;  // Bulk-Klonvorgang ID (wenn über BULK-CREATE erstellt)
    let cloneConfig = null;  // Global für localStorage Speicherung
    let createdFromUser = null;       // Creator username
    let createdFromUserDate = null;   // Creator date formatted

    // Tracking für Initialisierung
    let initDone = {
        cloneInfo: false,
        nativeInterceptor: false,
        pendingClone: false
    };

    // ===== CONFIG-VERWALTUNG =====
    function getDefaultConfig() {
        const config = {};
        BUTTONS.forEach((btn, index) => {
            const isHidden = (btn.id === 'vergleich-gh-de' || btn.id === 'vergleich-gh-at');
            config[btn.id] = { visible: !isHidden, order: index };
        });
        return config;
    }

    function getConfig() {
        try {
            const stored = localStorage.getItem('geizhals-clone-info-config');
            return stored ? JSON.parse(stored) : getDefaultConfig();
        } catch (e) {
            return getDefaultConfig();
        }
    }

    function saveConfig(config) {
        try {
            localStorage.setItem('geizhals-clone-info-config', JSON.stringify(config));
        } catch (e) {
            // ignore
        }
    }

    // ===== CONFIG-VERWALTUNG FÜR CLONE-OPTIONEN =====
    function getCloneOptionsConfig() {
        try {
            const stored = localStorage.getItem('geizhals-clone-options-config');
            const defaults = {
                all: false,
                hlink: true,
                comment: true,
                eprel: false,
                images: true,
                links: true,
                autoActivateEnabled: true
            };
            if (!stored) return defaults;
            const parsed = JSON.parse(stored);
            return { ...defaults, ...parsed };
        } catch (e) {
            return {
                all: false,
                hlink: true,
                comment: true,
                eprel: false,
                images: true,
                links: true,
                autoActivateEnabled: true
            };
        }
    }

    function saveCloneOptionsConfig(config) {
        try {
            localStorage.setItem('geizhals-clone-options-config', JSON.stringify(config));
        } catch (e) {
            // ignore
        }
    }

    // ===== CONFIG-VERWALTUNG FÜR SONSTIGE EINSTELLUNGEN =====
    function getOtherSettingsConfig() {
        const defaults = {
            cloneDropdownEnabled: true,
            cloneDropdownDomain: 'DE',
            gridDivider: true,
            cloneApplyChanges: true,
            cloneBlockBeforeUnload: true,
            titlebarCreatedFromInTitlebar: true,
            imageViewerMode: true,
            imageViewerModeNoHoverAnimation: true,
            previewSectionSearchOverlay: true,
            previewSectionSearchTrigger: 'mousewheel', // 'mousewheel', 'ctrlf', 'both'
            titlebarIdLinkToArticleEdit: true,
            titlebarRemoveHerstellerLink: true,
            titlebarIdCopyIcon: true,
            titlebarCloneButton: false,
            titlebarSaveButton: false,
            titlebarCopyButton: false,
            titlebarPasteButton: false,
            sidebarToggleButtonInHeadbar: false,
            sidebarAutoCollapse: false,
            sidebarAutoCollapseMode: 'always', // 'always' oder 'maxWidth'
            sidebarAutoCollapseMaxWidth: 2560,
            titlebarReloadButton: false,
            commentFieldCollapsed: true,
            mpnOverlayButton: true,
            herstellerlinkOverlayButton: true,
            herstellerlinkCaseButton: true,
            matchruleContainerReorder: true,
            bezeichnungKvHinweisEntfernen: true,
            linksCountDisplay: true,
            linksAddArticleIds: true,
            imageGalleryHoverPreview: true,
            titlebarDatasheets: true
        };
        try {
            const stored = localStorage.getItem('geizhals-other-settings-config');
            if (!stored) return defaults;
            const parsed = JSON.parse(stored);
            return { ...defaults, ...parsed };
        } catch (e) {
            return defaults;
        }
    }

    function saveOtherSettingsConfig(config) {
        try {
            localStorage.setItem('geizhals-other-settings-config', JSON.stringify(config));
        } catch (e) {
            // ignore
        }
    }


    // ===== GRID DIVIDER MODULE =====
    const gridDividerState = {
        isDragging: false,
        startX: 0,
        startPrimaryWidth: 0,
        startSecondaryWidth: 0,
        overlayDivider: null,
        ratioOverlay: null,
        primaryPane: null,
        secondaryPane: null,
        panesContainer: null,
        resizeObserver: null,
        sidebarVisibilityObserver: null
    };

    function getGridDividerConfig() {
        try {
            const stored = localStorage.getItem('geizhals-grid-divider-config');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            return {};
        }
    }

    function saveGridDividerConfig(config) {
        try {
            localStorage.setItem('geizhals-grid-divider-config', JSON.stringify(config));
        } catch (e) {
            // ignore
        }
    }

    function resetGridDividerPosition() {
        try {
            localStorage.removeItem('geizhals-grid-divider-config');
        } catch (e) {
            // ignore
        }
        if (gridDividerState.primaryPane && gridDividerState.secondaryPane) {
            gridDividerState.primaryPane.style.width = '';
            gridDividerState.primaryPane.style.flexBasis = '';
            gridDividerState.secondaryPane.style.width = '';
            gridDividerState.secondaryPane.style.flexBasis = '';
            updateGridDividerPosition();
        }
    }

    function initGridDividerModule() {
        const otherSettings = getOtherSettingsConfig();
        if (!otherSettings.gridDivider) return;

        injectGridDividerStyles();

        // Versuche sofort zu initialisieren
        setupGridDrag();

        // Falls nicht erfolgreich, mehrere Retry-Versuche mit steigenden Delays
        const retryDelays = [100, 300, 500, 1000, 2000, 3000];
        retryDelays.forEach(delay => {
            setTimeout(() => {
                if (!document.querySelector('.grid-divider-overlay')) {
                    setupGridDrag();
                }
            }, delay);
        });

        // Falls immer noch nicht erfolgreich, beobachte DOM-Änderungen
        setTimeout(() => {
            if (!document.querySelector('.grid-divider-overlay')) {
                const panesContainer = document.querySelector('.panes');
                if (panesContainer) {
                    const observer = new MutationObserver((mutations) => {
                        // Prüfe ob secondary pane jetzt vorhanden und sichtbar ist
                        const secondaryPane = document.querySelector('.pane__secondary');
                        if (secondaryPane && secondaryPane.offsetWidth > 0 && !document.querySelector('.grid-divider-overlay')) {
                            setupGridDrag();
                            // Observer stoppen wenn erfolgreich
                            if (document.querySelector('.grid-divider-overlay')) {
                                observer.disconnect();
                            }
                        }
                    });

                    observer.observe(panesContainer, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class', 'style']
                    });

                    // Observer nach 30 Sekunden stoppen um Memory Leaks zu vermeiden
                    setTimeout(() => observer.disconnect(), 30000);
                }
            }
        }, 500);
    }

    function injectGridDividerStyles() {
        if (document.getElementById('geizhals-grid-divider-styles')) return;

        const style = document.createElement('style');
        style.id = 'geizhals-grid-divider-styles';
        style.textContent = `
            .grid-divider-overlay {
                position: absolute !important;
                width: 12px !important;
                cursor: col-resize !important;
                user-select: none !important;
                background-color: #bbb !important;
                border-left: 1px solid #888 !important;
                border-right: 1px solid #888 !important;
                z-index: 1000 !important;
                transition: background-color 0.15s !important;
            }
            .grid-divider-overlay:hover {
                background-color: #007bff !important;
                border-left-color: #0056b3 !important;
                border-right-color: #0056b3 !important;
            }
            .grid-divider-overlay.dragging {
                background-color: #0056b3 !important;
            }
            .grid-ratio-overlay {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                background-color: rgba(0, 0, 0, 0.85) !important;
                color: #fff !important;
                padding: 16px 24px !important;
                border-radius: 8px !important;
                font-size: 18px !important;
                font-weight: bold !important;
                z-index: 2000 !important;
                pointer-events: none !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                display: none !important;
            }
            .grid-ratio-overlay.visible {
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }

    function setupGridDrag() {
        // Prüfe ob Divider bereits existiert
        if (document.querySelector('.grid-divider-overlay')) {
            return;
        }

        gridDividerState.primaryPane = document.querySelector('.pane__primary');
        gridDividerState.secondaryPane = document.querySelector('.pane__secondary');
        gridDividerState.panesContainer = document.querySelector('.panes');

        if (!gridDividerState.primaryPane || !gridDividerState.secondaryPane || !gridDividerState.panesContainer) {
            return;
        }

        if (gridDividerState.panesContainer.classList.contains('panes--no-secondary')) {
            return;
        }

        // Prüfe ob secondary pane sichtbar ist (nicht display:none oder visibility:hidden)
        const secondaryStyle = window.getComputedStyle(gridDividerState.secondaryPane);
        if (secondaryStyle.display === 'none' || secondaryStyle.visibility === 'hidden' || gridDividerState.secondaryPane.offsetWidth === 0) {
            return;
        }

        const savedConfig = getGridDividerConfig();
        if (savedConfig.primaryWidth) {
            gridDividerState.primaryPane.style.width = savedConfig.primaryWidth + 'px';
            gridDividerState.secondaryPane.style.width = savedConfig.secondaryWidth + 'px';
            gridDividerState.primaryPane.style.flexBasis = savedConfig.primaryWidth + 'px';
            gridDividerState.secondaryPane.style.flexBasis = savedConfig.secondaryWidth + 'px';
        }

        createGridOverlayDivider();
        attachGridEventListeners();

        window.addEventListener('resize', () => {
            updateGridDividerPosition();
        });

        if (window.ResizeObserver) {
            gridDividerState.resizeObserver = new ResizeObserver(() => {
                if (!gridDividerState.primaryPane || !gridDividerState.secondaryPane || !gridDividerState.panesContainer) {
                    return;
                }

                const primaryWidth = gridDividerState.primaryPane.offsetWidth;
                const secondaryWidth = gridDividerState.secondaryPane.offsetWidth;
                const containerWidth = gridDividerState.panesContainer.offsetWidth;
                const totalPanesWidth = primaryWidth + secondaryWidth;

                const actionPane = gridDividerState.panesContainer.querySelector('.pane__action');
                let actionWidth = 0;
                if (actionPane) {
                    actionWidth = actionPane.offsetWidth;
                }

                const availableWidth = containerWidth - actionWidth;

                if (totalPanesWidth !== availableWidth && !gridDividerState.isDragging) {
                    const primaryRatio = primaryWidth / totalPanesWidth;
                    const secondaryRatio = secondaryWidth / totalPanesWidth;

                    const newPrimaryWidth = Math.floor(availableWidth * primaryRatio);
                    const newSecondaryWidth = availableWidth - newPrimaryWidth;

                    gridDividerState.primaryPane.style.width = newPrimaryWidth + 'px';
                    gridDividerState.secondaryPane.style.width = newSecondaryWidth + 'px';
                    gridDividerState.primaryPane.style.flexBasis = newPrimaryWidth + 'px';
                    gridDividerState.secondaryPane.style.flexBasis = newSecondaryWidth + 'px';
                }

                updateGridDividerPosition();
            });

            gridDividerState.resizeObserver.observe(gridDividerState.panesContainer);
        }

        // Add MutationObserver for sidebar visibility changes
        setupSidebarVisibilityObserver();

        updateGridDividerPosition();
        startGridURLMonitoring();
    }

    function setupSidebarVisibilityObserver() {
        const actionPane = gridDividerState.panesContainer.querySelector('.pane__action');
        if (!actionPane || !gridDividerState.primaryPane || !gridDividerState.secondaryPane || !gridDividerState.panesContainer) {
            return;
        }

        let lastActionWidth = actionPane.offsetWidth;

        // Polling approach - check every 200ms if action pane width changed
        const pollInterval = setInterval(() => {
            if (!actionPane || !gridDividerState.primaryPane || !gridDividerState.secondaryPane || !gridDividerState.panesContainer) {
                clearInterval(pollInterval);
                return;
            }

            const currentActionWidth = actionPane.offsetWidth;

            if (currentActionWidth !== lastActionWidth) {
                lastActionWidth = currentActionWidth;

                setTimeout(() => {
                    // Get current dimensions
                    if (!gridDividerState.primaryPane || !gridDividerState.secondaryPane || !gridDividerState.panesContainer) {
                        return;
                    }

                    const primaryWidth = gridDividerState.primaryPane.offsetWidth;
                    const secondaryWidth = gridDividerState.secondaryPane.offsetWidth;
                    const containerWidth = gridDividerState.panesContainer.offsetWidth;
                    let actionWidth = 0;
                    const currentActionPane = gridDividerState.panesContainer.querySelector('.pane__action');
                    if (currentActionPane) {
                        actionWidth = currentActionPane.offsetWidth;
                    }

                    const availableWidth = containerWidth - actionWidth;
                    const totalPanesWidth = primaryWidth + secondaryWidth;
                    const primaryRatio = primaryWidth / totalPanesWidth;

                    const newPrimaryWidth = Math.floor(availableWidth * primaryRatio);
                    const newSecondaryWidth = availableWidth - newPrimaryWidth;

                    gridDividerState.primaryPane.style.width = newPrimaryWidth + 'px';
                    gridDividerState.secondaryPane.style.width = newSecondaryWidth + 'px';
                    gridDividerState.primaryPane.style.flexBasis = newPrimaryWidth + 'px';
                    gridDividerState.secondaryPane.style.flexBasis = newSecondaryWidth + 'px';

                    updateGridDividerPosition();
                }, 50);
            }
        }, 200);
    }

    function createGridOverlayDivider() {
        if (gridDividerState.overlayDivider) return;

        gridDividerState.overlayDivider = document.createElement('div');
        gridDividerState.overlayDivider.className = 'grid-divider-overlay';
        document.body.appendChild(gridDividerState.overlayDivider);

        gridDividerState.ratioOverlay = document.createElement('div');
        gridDividerState.ratioOverlay.className = 'grid-ratio-overlay';
        document.body.appendChild(gridDividerState.ratioOverlay);
    }

    function updateGridDividerPosition() {
        if (!gridDividerState.overlayDivider || !gridDividerState.primaryPane || !gridDividerState.panesContainer) return;

        const containerRect = gridDividerState.panesContainer.getBoundingClientRect();
        const primaryRect = gridDividerState.primaryPane.getBoundingClientRect();

        const headbar = gridDividerState.panesContainer.querySelector('.pane__headbar');
        let headbarHeight = 0;

        if (headbar) {
            const headbarRect = headbar.getBoundingClientRect();
            headbarHeight = headbarRect.height;
        }

        const dividerLeft = primaryRect.right - window.scrollX;
        const dividerTop = (containerRect.top + headbarHeight) - window.scrollY;
        const dividerHeight = containerRect.height - headbarHeight;

        gridDividerState.overlayDivider.style.left = dividerLeft + 'px';
        gridDividerState.overlayDivider.style.top = dividerTop + 'px';
        gridDividerState.overlayDivider.style.height = dividerHeight + 'px';
    }

    function startGridURLMonitoring() {
        let lastUrl = window.location.href;

        setInterval(() => {
            const currentUrl = window.location.href;

            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                updateGridDividerVisibility();
            }
        }, 500);

        window.addEventListener('popstate', updateGridDividerVisibility);
    }

    function updateGridDividerVisibility() {
        if (!gridDividerState.overlayDivider || !gridDividerState.primaryPane || !gridDividerState.secondaryPane) return;

        const hasMode = window.location.search.includes('&mode=') || new URLSearchParams(window.location.search).has('mode');

        if (hasMode) {
            gridDividerState.overlayDivider.style.display = 'none';
            gridDividerState.primaryPane.style.width = '';
            gridDividerState.primaryPane.style.flexBasis = '';
            gridDividerState.secondaryPane.style.width = '';
            gridDividerState.secondaryPane.style.flexBasis = '';
        } else {
            gridDividerState.overlayDivider.style.display = 'block';
            updateGridDividerPosition();
        }
    }

    function attachGridEventListeners() {
        const divider = gridDividerState.overlayDivider;

        divider.addEventListener('mousedown', (e) => {
            gridDividerState.isDragging = true;
            gridDividerState.startX = e.clientX;
            gridDividerState.startPrimaryWidth = gridDividerState.primaryPane.offsetWidth;
            gridDividerState.startSecondaryWidth = gridDividerState.secondaryPane.offsetWidth;

            divider.classList.add('dragging');
            if (gridDividerState.ratioOverlay) {
                gridDividerState.ratioOverlay.classList.add('visible');
            }
            document.body.style.userSelect = 'none !important';
            document.body.style.cursor = 'col-resize !important';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!gridDividerState.isDragging || !gridDividerState.primaryPane || !gridDividerState.secondaryPane) return;

            const deltaX = e.clientX - gridDividerState.startX;
            const newPrimaryWidth = Math.max(200, gridDividerState.startPrimaryWidth + deltaX);
            const newSecondaryWidth = Math.max(200, gridDividerState.startSecondaryWidth - deltaX);

            gridDividerState.primaryPane.style.width = newPrimaryWidth + 'px';
            gridDividerState.secondaryPane.style.width = newSecondaryWidth + 'px';
            gridDividerState.primaryPane.style.flexBasis = newPrimaryWidth + 'px';
            gridDividerState.secondaryPane.style.flexBasis = newSecondaryWidth + 'px';

            const totalWidth = newPrimaryWidth + newSecondaryWidth;
            const primaryPercent = Math.round((newPrimaryWidth / totalWidth) * 100);
            const secondaryPercent = 100 - primaryPercent;

            if (gridDividerState.ratioOverlay) {
                gridDividerState.ratioOverlay.innerHTML = `<div>${primaryPercent}:${secondaryPercent}</div><div style="font-size: 14px; margin-top: 4px; opacity: 0.8;">${newPrimaryWidth}:${newSecondaryWidth}</div>`;
            }

            updateGridDividerPosition();
            window.dispatchEvent(new Event('resize'));
        });

        document.addEventListener('mouseup', () => {
            if (!gridDividerState.isDragging) return;
            gridDividerState.isDragging = false;

            divider.classList.remove('dragging');
            if (gridDividerState.ratioOverlay) {
                gridDividerState.ratioOverlay.classList.remove('visible');
            }
            document.body.style.userSelect = '';
            document.body.style.cursor = '';

            saveGridDividerConfig({
                primaryWidth: gridDividerState.primaryPane.offsetWidth,
                secondaryWidth: gridDividerState.secondaryPane.offsetWidth
            });
        });
    }

        function updateAllCheckbox(config) {
        config.all = config.hlink && config.comment && config.eprel && config.images && config.links;
        return config;
    }

    // ===== UTILITY FUNCTIONS =====
    function applyDarkModeStyles(element) {
        if (document.body.getAttribute('data-darkmode') === 'on') {
            element.classList.add('geizhals-clone-info-dark');
        }
    }

    // ===== CLONE WITH CHANGES APPLY FUNCTION =====
    let isPerformingCloneWithChanges = false; // Flag um Rekursion zu verhindern

    function getMpnField() {
        // Direkter Selektor für das MPN-Feld im form#section_form_mpn
        const mpnForm = document.getElementById('section_form_mpn');
        if (mpnForm) {
            const input = mpnForm.querySelector('input.form-control.form-control-sm');
            if (input) return input;
        }
        // Fallback: Suche im pane primary
        const primaryPane = document.querySelector('.pane__primary, .pane.primary');
        if (primaryPane) {
            const mpnFormInPane = primaryPane.querySelector('#section_form_mpn');
            if (mpnFormInPane) {
                const input = mpnFormInPane.querySelector('input.form-control.form-control-sm');
                if (input) return input;
            }
        }
        // Weiterer Fallback: Suche nach h5 mit "MPN" Text
        const h5Elements = document.querySelectorAll('h5');
        for (const h5 of h5Elements) {
            if (h5.textContent.trim() === 'MPN') {
                const section = h5.closest('section');
                if (section) {
                    const input = section.querySelector('input.form-control.form-control-sm');
                    if (input) return input;
                }
            }
        }
        return null;
    }

    // Findet das Bezeichnungsfeld und prüft ob es manuell (nicht disabled) ist
    function getBezeichnungsField() {
        // Suche nach dem Bezeichnungs-Formular
        const bezeichnungsForm = document.getElementById('section_form_bezeichnung');
        if (bezeichnungsForm) {
            const input = bezeichnungsForm.querySelector('input.form-control.form-control-sm');
            if (input) return input;
        }
        // Fallback: Suche nach h5 mit "Bezeichnung" Text
        const h5Elements = document.querySelectorAll('h5');
        for (const h5 of h5Elements) {
            if (h5.textContent.trim() === 'Bezeichnung') {
                const section = h5.closest('section');
                if (section) {
                    const input = section.querySelector('input.form-control.form-control-sm');
                    if (input) return input;
                }
            }
        }
        return null;
    }

    // Prüft ob das Bezeichnungsfeld manuell ist (nicht disabled)
    function isBezeichnungManual() {
        const field = getBezeichnungsField();
        if (!field) return false;
        // Manuell = nicht disabled
        return !field.disabled && !field.hasAttribute('disabled');
    }

    // Liest den Wert des Bezeichnungsfeldes, aber nur wenn es manuell ist
    function getBezeichnungValue() {
        if (!isBezeichnungManual()) return '';
        const field = getBezeichnungsField();
        return field ? (field.value || '') : '';
    }

    // Warte auf MPN-Feld mit MutationObserver
    function waitForMpnField(timeout = 5000) {
        return new Promise((resolve) => {
            const mpnField = getMpnField();
            if (mpnField) {
                resolve(mpnField);
                return;
            }

            const startTime = Date.now();
            let observer = null;

            const checkField = () => {
                const field = getMpnField();
                if (field) {
                    if (observer) observer.disconnect();
                    resolve(field);
                    return true;
                }
                return false;
            };

            // MutationObserver für DOM-Änderungen
            observer = new MutationObserver(() => {
                if (checkField()) return;
                if (Date.now() - startTime > timeout) {
                    observer.disconnect();
                    resolve(null);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Fallback: Polling alle 100ms
            const pollInterval = setInterval(() => {
                if (checkField()) {
                    clearInterval(pollInterval);
                    return;
                }
                if (Date.now() - startTime > timeout) {
                    clearInterval(pollInterval);
                    if (observer) observer.disconnect();
                    resolve(null);
                }
            }, 100);
        });
    }

    // Finde Herstellerlink-Felder
    function getHerstellerlinkFields() {
        const fields = {
            DE: null,
            EN: null,
            MLT: null
        };

        // Suche nach input-Feldern mit name="hlink_new_DE", "hlink_new_EN", "hlink_new_mlt"
        const hlinkForm = document.getElementById('section_form_hlink');
        if (hlinkForm) {
            fields.DE = hlinkForm.querySelector('input[name="hlink_new_DE"]');
            fields.EN = hlinkForm.querySelector('input[name="hlink_new_EN"]');
            fields.MLT = hlinkForm.querySelector('input[name="hlink_new_mlt"]');
        }

        // Fallback: Suche im pane primary
        if (!fields.DE && !fields.EN && !fields.MLT) {
            const primaryPane = document.querySelector('.pane__primary, .pane.primary');
            if (primaryPane) {
                fields.DE = primaryPane.querySelector('input[name="hlink_new_DE"]');
                fields.EN = primaryPane.querySelector('input[name="hlink_new_EN"]');
                fields.MLT = primaryPane.querySelector('input[name="hlink_new_mlt"]');
            }
        }

        return fields;
    }

    // Lese alle befüllten Herstellerlinks aus
    function getHerstellerlinkValues() {
        const fields = getHerstellerlinkFields();
        const values = {};

        if (fields.DE && fields.DE.value) {
            values.DE = fields.DE.value;
        }
        if (fields.EN && fields.EN.value) {
            values.EN = fields.EN.value;
        }
        if (fields.MLT && fields.MLT.value) {
            values.MLT = fields.MLT.value;
        }

        return values;
    }

    // Warte auf Herstellerlink-Felder mit MutationObserver
    function waitForHerstellerlinkFields(timeout = 5000) {
        return new Promise((resolve) => {
            const fields = getHerstellerlinkFields();
            if (fields.DE || fields.EN || fields.MLT) {
                resolve(fields);
                return;
            }

            const startTime = Date.now();
            let observer = null;

            const checkFields = () => {
                const fields = getHerstellerlinkFields();
                if (fields.DE || fields.EN || fields.MLT) {
                    if (observer) observer.disconnect();
                    resolve(fields);
                    return true;
                }
                return false;
            };

            // MutationObserver für DOM-Änderungen
            observer = new MutationObserver(() => {
                if (checkFields()) return;
                if (Date.now() - startTime > timeout) {
                    observer.disconnect();
                    resolve({ DE: null, EN: null, MLT: null });
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Fallback: Polling alle 100ms
            const pollInterval = setInterval(() => {
                if (checkFields()) {
                    clearInterval(pollInterval);
                    return;
                }
                if (Date.now() - startTime > timeout) {
                    clearInterval(pollInterval);
                    if (observer) observer.disconnect();
                    resolve({ DE: null, EN: null, MLT: null });
                }
            }, 100);
        });
    }

    // Hilfsfunktion: Findet einen Text-Button ohne SVG/Icons anhand des Textes
    function findTextButton(container, buttonText) {
        const allButtons = container.querySelectorAll('button.btn.btn-outline-dark.btn-sm');

        for (const btn of allButtons) {
            const text = btn.textContent.trim();
            const hasSvg = btn.querySelector('svg') !== null;
            const hasChildren = btn.children.length > 0;

            // Der gesuchte Button hat:
            // 1. Exakt den gesuchten Text
            // 2. KEIN SVG
            // 3. KEINE Element-Kinder (nur Text-Node)
            if (text === buttonText && !hasSvg && !hasChildren) {
                return btn;
            }
        }

        return null;
    }

    async function performCloneWithChangesApply() {
        const otherSettings = getOtherSettingsConfig();
        if (!otherSettings.cloneApplyChanges) {
            return false; // Funktion nicht aktiv, normales Klonen durchführen
        }

        if (isPerformingCloneWithChanges) {
            return true; // Bereits in Bearbeitung
        }

        isPerformingCloneWithChanges = true;

        // 1b. MPN-Feld auslesen
        let mpnValue = '';
        const mpnField = getMpnField();
        if (mpnField) {
            mpnValue = mpnField.value || '';
        }

        // 1c. Herstellerlinks auslesen
        const herstellerlinkValues = getHerstellerlinkValues();

        // 1d. Bezeichnungsfeld auslesen (nur wenn manuell/nicht disabled)
        const bezeichnungValue = getBezeichnungValue();

        // 1e. Matchrule-Feld auslesen
        let matchruleValue = '';
        const matchruleField = document.querySelector('input[name="matchrule"]') ||
                               document.querySelector('textarea[name="matchrule"]');
        if (matchruleField) {
            matchruleValue = matchruleField.value || '';
        }

        // Hilfsfunktion: Seitenleiste ausklappen wenn nötig
        async function ensureSidebarExpanded() {
            const sidebarBtn = getSidebarButton();
            if (sidebarBtn && isSidebarCollapsed()) {
                sidebarBtn.click();
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }

        // 2. Seitenleiste ausklappen wenn nötig
        await ensureSidebarExpanded();

        // 2b. Ursprünglichen Clipboard-Inhalt speichern (vor dem Kopieren)
        try {
            const originalClipboardContent = await originalReadText();
            if (originalClipboardContent) {
                sessionStorage.setItem('geizhals-original-clipboard-data', originalClipboardContent);
            }
        } catch (e) {
            // Clipboard-Zugriff fehlgeschlagen, ignorieren
        }

        // 3. "Kopieren"-Button in der Seitenleiste finden und klicken
        const actionPane = document.querySelector('.pane__action');
        if (!actionPane) {
            alert('Fehler: Seitenleiste nicht gefunden.');
            isPerformingCloneWithChanges = false;
            return true;
        }

        const copyButton = findTextButton(actionPane, 'Kopieren');

        if (!copyButton) {
            alert('Fehler: "Kopieren"-Button nicht gefunden.');
            isPerformingCloneWithChanges = false;
            return true;
        }

        copyButton.click();
        await new Promise(resolve => setTimeout(resolve, 200));

        // 4. Nativen Klon-Button finden - URL extrahieren und direkt navigieren
        await ensureSidebarExpanded();

        const nativeCloneButton = document.querySelector('a[name="clone"]');
        if (!nativeCloneButton || !nativeCloneButton.href) {
            alert('Fehler: Nativer "Klonen"-Button nicht gefunden.');
            isPerformingCloneWithChanges = false;
            return true;
        }

        // Speichere MPN-Wert, Herstellerlinks, Bezeichnung und Matchrule im sessionStorage für nach dem Seitenwechsel
        try {
            sessionStorage.setItem('geizhals-clone-mpn-value', mpnValue);
            sessionStorage.setItem('geizhals-clone-herstellerlinks', JSON.stringify(herstellerlinkValues));
            sessionStorage.setItem('geizhals-clone-bezeichnung-value', bezeichnungValue);
            sessionStorage.setItem('geizhals-clone-matchrule-value', matchruleValue);
            sessionStorage.setItem('geizhals-clone-pending-paste', 'true');
        } catch (e) {
            // ignore
        }

        // Unterdrücke den "Website verlassen?"-Dialog (beforeunload)
        // Entferne alle beforeunload-Listener, die von der Seite registriert wurden
        const otherSettingsForUnload = getOtherSettingsConfig();
        if (otherSettingsForUnload.cloneBlockBeforeUnload) {
            removeAllBeforeUnloadListeners();
        }

        // Navigiere direkt zur Klon-URL (dies löst einen Seitenwechsel aus)
        window.location.href = nativeCloneButton.href;

        return true; // Klonen wurde gestartet
    }

    // Funktion die nach dem Seitenwechsel aufgerufen wird
    // ===== CLONE SPINNER OVERLAY =====
    function showCloneSpinner() {
        // Entferne existierenden Spinner falls vorhanden
        hideCloneSpinner();

        const overlay = document.createElement('div');
        overlay.id = 'geizhals-clone-spinner-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 9999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        `;

        // Spinner-Animation
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #ffffff;
            border-radius: 50%;
            animation: geizhals-spin 1s linear infinite;
        `;

        // Text
        const text = document.createElement('div');
        text.textContent = 'Daten werden eingefügt...';
        text.style.cssText = `
            color: white;
            font-size: 1.2rem;
            font-weight: 500;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        `;

        // CSS Animation hinzufügen
        const style = document.createElement('style');
        style.id = 'geizhals-clone-spinner-style';
        style.textContent = `
            @keyframes geizhals-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        overlay.appendChild(spinner);
        overlay.appendChild(text);
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }

    function hideCloneSpinner() {
        const overlay = document.getElementById('geizhals-clone-spinner-overlay');
        if (overlay) overlay.remove();
        const style = document.getElementById('geizhals-clone-spinner-style');
        if (style) style.remove();
    }

    async function checkAndCompletePendingClone() {
        try {
            const pendingPaste = sessionStorage.getItem('geizhals-clone-pending-paste');
            if (pendingPaste !== 'true') return;

            // Prüfen ob wir auf einer clone_id URL sind
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.has('clone_id')) return;

            // Spinner anzeigen
            showCloneSpinner();

            // Warten bis die Seite vollständig geladen ist
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Seitenleiste ausklappen wenn nötig
            const sidebarBtn = getSidebarButton();
            if (sidebarBtn && isSidebarCollapsed()) {
                sidebarBtn.click();
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // "Einfügen"-Button finden und klicken (nur den Text-Button, nicht den mit Icon)
            const actionPane = document.querySelector('.pane__action');
            if (!actionPane) {
                hideCloneSpinner();
                alert('Fehler: Seitenleiste nach Klonen nicht gefunden.');
                sessionStorage.removeItem('geizhals-clone-pending-paste');
                sessionStorage.removeItem('geizhals-clone-mpn-value');
                sessionStorage.removeItem('geizhals-clone-herstellerlinks');
                sessionStorage.removeItem('geizhals-clone-bezeichnung-value');
                sessionStorage.removeItem('geizhals-clone-matchrule-value');
                sessionStorage.removeItem('geizhals-clipboard-data');
                sessionStorage.removeItem('geizhals-original-clipboard-data');
                return;
            }

            const pasteButton = findTextButton(actionPane, 'Einfügen');

            if (!pasteButton) {
                hideCloneSpinner();
                alert('Fehler: "Einfügen"-Button nicht gefunden.');
                sessionStorage.removeItem('geizhals-clone-pending-paste');
                sessionStorage.removeItem('geizhals-clone-mpn-value');
                sessionStorage.removeItem('geizhals-clone-herstellerlinks');
                sessionStorage.removeItem('geizhals-clone-bezeichnung-value');
                sessionStorage.removeItem('geizhals-clone-matchrule-value');
                sessionStorage.removeItem('geizhals-clipboard-data');
                sessionStorage.removeItem('geizhals-original-clipboard-data');
                return;
            }

            // Klicke den Einfügen-Button
            // Dank des clipboard.readText Interceptors funktioniert das jetzt auch in Firefox
            pasteButton.click();
            await new Promise(resolve => setTimeout(resolve, 300));

            await completePasteOperations();

        } catch (e) {
            // Bei Fehlern aufräumen
            hideCloneSpinner();
            sessionStorage.removeItem('geizhals-clone-pending-paste');
            sessionStorage.removeItem('geizhals-clone-mpn-value');
            sessionStorage.removeItem('geizhals-clone-herstellerlinks');
            sessionStorage.removeItem('geizhals-clone-bezeichnung-value');
            sessionStorage.removeItem('geizhals-clone-matchrule-value');
            sessionStorage.removeItem('geizhals-clipboard-data');
            sessionStorage.removeItem('geizhals-original-clipboard-data');
        }
    }

    // Ausgelagerte Funktion für den Rest der Paste-Operationen
    async function completePasteOperations() {
        try {
            // MPN-Feld setzen mit Warten und Verifikation
            const mpnValue = sessionStorage.getItem('geizhals-clone-mpn-value') || '';
            if (mpnValue) {
                // Warte auf das MPN-Feld mit MutationObserver
                const mpnField = await waitForMpnField(5000);

                if (mpnField) {
                    // Verwende den nativen Setter für React-Kompatibilität
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

                    // Setze den Wert über den nativen Setter
                    mpnField.focus();
                    nativeInputValueSetter.call(mpnField, mpnValue);

                    // Trigger synthetische Events damit React die Änderung mitbekommt
                    mpnField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    mpnField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

                    // Kurz warten und dann verifizieren
                    await new Promise(resolve => setTimeout(resolve, 200));

                    // Verifikation: Prüfe ob der Wert gesetzt wurde
                    const verifyField = getMpnField();
                    if (!verifyField || verifyField.value !== mpnValue) {
                        // Zweiter Versuch
                        await new Promise(resolve => setTimeout(resolve, 500));
                        const retryField = await waitForMpnField(3000);
                        if (retryField) {
                            retryField.focus();
                            nativeInputValueSetter.call(retryField, mpnValue);
                            retryField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                            retryField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

                            // Nochmal warten und verifizieren
                            await new Promise(resolve => setTimeout(resolve, 200));
                            const finalField = getMpnField();
                            if (!finalField || finalField.value !== mpnValue) {
                                alert('Warnung: MPN-Feld konnte nicht automatisch gesetzt werden. Bitte manuell eintragen: ' + mpnValue);
                            }
                        } else {
                            alert('Warnung: MPN-Feld nicht gefunden. Bitte manuell eintragen: ' + mpnValue);
                        }
                    }
                } else {
                    alert('Warnung: MPN-Feld nicht gefunden. Bitte manuell eintragen: ' + mpnValue);
                }
            }

            // Herstellerlinks setzen mit Warten und Verifikation
            const herstellerlinksJson = sessionStorage.getItem('geizhals-clone-herstellerlinks');
            if (herstellerlinksJson) {
                try {
                    const herstellerlinks = JSON.parse(herstellerlinksJson);

                    // Warte auf die Herstellerlink-Felder
                    const hlinkFields = await waitForHerstellerlinkFields(5000);

                    // Verwende den nativen Setter für React-Kompatibilität
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

                    // Setze DE-Link wenn vorhanden
                    if (herstellerlinks.DE && hlinkFields.DE) {
                        hlinkFields.DE.focus();
                        nativeInputValueSetter.call(hlinkFields.DE, herstellerlinks.DE);
                        hlinkFields.DE.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                        hlinkFields.DE.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    }

                    // Setze EN-Link wenn vorhanden
                    if (herstellerlinks.EN && hlinkFields.EN) {
                        hlinkFields.EN.focus();
                        nativeInputValueSetter.call(hlinkFields.EN, herstellerlinks.EN);
                        hlinkFields.EN.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                        hlinkFields.EN.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    }

                    // Setze MLT-Link wenn vorhanden
                    if (herstellerlinks.MLT && hlinkFields.MLT) {
                        hlinkFields.MLT.focus();
                        nativeInputValueSetter.call(hlinkFields.MLT, herstellerlinks.MLT);
                        hlinkFields.MLT.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                        hlinkFields.MLT.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    }

                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (e) {
                    // Fehler ignorieren
                }
            }

            // Bezeichnungsfeld setzen (nur wenn es manuell ist)
            const bezeichnungValue = sessionStorage.getItem('geizhals-clone-bezeichnung-value');
            if (bezeichnungValue) {
                try {
                    // Warte kurz bis das Feld verfügbar ist
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const bezeichnungsField = getBezeichnungsField();

                    // Nur setzen wenn das Feld manuell ist (nicht disabled)
                    if (bezeichnungsField && !bezeichnungsField.disabled && !bezeichnungsField.hasAttribute('disabled')) {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

                        bezeichnungsField.focus();
                        nativeInputValueSetter.call(bezeichnungsField, bezeichnungValue);
                        bezeichnungsField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                        bezeichnungsField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                } catch (e) {
                    // Fehler ignorieren
                }
            }

            // Matchrule-Feld setzen
            const matchruleValue = sessionStorage.getItem('geizhals-clone-matchrule-value');
            if (matchruleValue) {
                try {
                    // Warte kurz bis das Feld verfügbar ist
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Funktion zum Setzen des Matchrule-Werts
                    const setMatchruleValue = async () => {
                        const matchruleField = document.querySelector('input[name="matchrule"]') ||
                                               document.querySelector('textarea[name="matchrule"]');

                        if (matchruleField) {
                            const isTextarea = matchruleField.tagName === 'TEXTAREA';
                            const nativeValueSetter = Object.getOwnPropertyDescriptor(
                                isTextarea ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
                                'value'
                            ).set;

                            // Focus setzen
                            matchruleField.focus();

                            // Wert mit nativem Setter setzen
                            nativeValueSetter.call(matchruleField, matchruleValue);

                            // Mehrere Event-Typen dispatchen für React-Kompatibilität
                            matchruleField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                            matchruleField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                            matchruleField.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));

                            // Auch KeyboardEvent simulieren (manche React-Versionen brauchen das)
                            matchruleField.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'a' }));
                            matchruleField.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'a' }));

                            // Zusätzlich: Setze auch das value-Attribut direkt
                            matchruleField.value = matchruleValue;

                            // Nochmal Input-Event
                            matchruleField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

                            return true;
                        }
                        return false;
                    };

                    // Erstes Setzen
                    await setMatchruleValue();
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Zweites Setzen nach kurzem Warten (falls React/DOM sich verändert hat)
                    await setMatchruleValue();
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Drittes Setzen (falls applyMatchruleContainerReorder das Feld ersetzt hat)
                    await setMatchruleValue();
                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Viertes Setzen - nochmals für den Fall dass die Textarea gerade erst erstellt wurde
                    await setMatchruleValue();

                } catch (e) {
                    // Fehler ignorieren
                }
            }

            // Aufräumen (matchrule-value wird von applyMatchruleContainerReorder gelöscht)
            sessionStorage.removeItem('geizhals-clone-pending-paste');
            sessionStorage.removeItem('geizhals-clone-mpn-value');
            sessionStorage.removeItem('geizhals-clone-herstellerlinks');
            sessionStorage.removeItem('geizhals-clone-bezeichnung-value');
            // geizhals-clone-matchrule-value wird von applyMatchruleContainerReorder gelöscht
            sessionStorage.removeItem('geizhals-clipboard-data');

            // Ursprünglichen Clipboard-Inhalt wiederherstellen
            try {
                const originalClipboardContent = sessionStorage.getItem('geizhals-original-clipboard-data');
                if (originalClipboardContent) {
                    await originalWriteText(originalClipboardContent);
                    sessionStorage.removeItem('geizhals-original-clipboard-data');
                }
            } catch (e) {
                // Clipboard-Wiederherstellung fehlgeschlagen, ignorieren
            }

            // Spinner ausblenden
            hideCloneSpinner();

        } catch (e) {
            // Bei Fehlern aufräumen
            hideCloneSpinner();
            sessionStorage.removeItem('geizhals-clone-pending-paste');
            sessionStorage.removeItem('geizhals-clone-mpn-value');
            sessionStorage.removeItem('geizhals-clone-herstellerlinks');
            sessionStorage.removeItem('geizhals-clone-bezeichnung-value');
            sessionStorage.removeItem('geizhals-clone-matchrule-value');
            sessionStorage.removeItem('geizhals-clipboard-data');
            sessionStorage.removeItem('geizhals-original-clipboard-data');
        }
    }

    // ===== OVERLAY MANAGEMENT =====
    function createOverlay() {
        if (document.getElementById('geizhals-clone-info-overlay')) {
            document.getElementById('geizhals-clone-info-overlay').classList.add('active');
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'geizhals-clone-info-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
        `;

        const modal = document.createElement('div');
        modal.className = 'ghodmode-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 600px;
            display: flex;
            flex-direction: column;
            max-height: 80vh;
            overflow: auto;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #ddd;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; font-size: 1.25rem;">Verwaltung</h3>
            <button class="ghodmode-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #333;">&times;</button>
        `;

        // Body mit zwei Sections
        const body = document.createElement('div');
        body.className = 'ghodmode-modal-body';
        body.style.cssText = `
            padding: 1rem;
            flex: 1;
            overflow-y: auto;
        `;

        // Section 0: Titelleiste
        const section0 = document.createElement('div');
        section0.style.cssText = `
            margin-bottom: 2rem;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #f9f9f9;
        `;
        const section0Title = document.createElement('h4');
        section0Title.textContent = 'Titelleiste';
        section0Title.style.cssText = 'margin: 0 0 1rem 0; font-size: 1rem; border-bottom: 2px solid #007bff; padding-bottom: 0.5rem;';
        section0.appendChild(section0Title);

        const titlebarSettingsContainer = document.createElement('div');
        titlebarSettingsContainer.className = 'ghodmode-titlebar-settings';
        titlebarSettingsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;
        section0.appendChild(titlebarSettingsContainer);
        body.appendChild(section0);

        // Section 1: Klonoptionen
        const section1 = document.createElement('div');
        section1.style.cssText = `
            margin-bottom: 2rem;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #f9f9f9;
        `;
        const section1Title = document.createElement('h4');
        section1Title.textContent = 'Klonmodus';
        section1Title.style.cssText = 'margin: 0 0 1rem 0; font-size: 1rem; border-bottom: 2px solid #28a745; padding-bottom: 0.5rem;';
        section1.appendChild(section1Title);

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'ghodmode-clone-options';
        checkboxContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;
        section1.appendChild(checkboxContainer);
        body.appendChild(section1);

        // Section 2: Sonstiges
        const section2 = document.createElement('div');
        section2.style.cssText = `
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #f9f9f9;
        `;
        const section2Title = document.createElement('h4');
        section2Title.textContent = 'Sonstiges';
        section2Title.style.cssText = 'margin: 0 0 1rem 0; font-size: 1rem; border-bottom: 2px solid #6c757d; padding-bottom: 0.5rem;';
        section2.appendChild(section2Title);

        const otherSettingsContainer = document.createElement('div');
        otherSettingsContainer.className = 'ghodmode-other-settings';
        otherSettingsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;
        section2.appendChild(otherSettingsContainer);
        body.appendChild(section2);

        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            display: flex;
            gap: 0.5rem;
            padding: 1rem;
            border-top: 1px solid #ddd;
            justify-content: flex-end;
        `;

        const resetBtn = document.createElement('button');
        resetBtn.className = 'ghodmode-btn-reset';
        resetBtn.textContent = 'Zurücksetzen';
        resetBtn.style.cssText = `
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'ghodmode-btn-close';
        closeBtn.textContent = 'Schließen';
        closeBtn.style.cssText = `
            padding: 0.5rem 1rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
        `;

        footer.appendChild(resetBtn);
        footer.appendChild(closeBtn);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        applyDarkModeStyles(modal);

        header.querySelector('.ghodmode-close').addEventListener('click', () => overlay.remove());
        closeBtn.addEventListener('click', () => overlay.remove());
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('geizhals-clone-info-config');
            localStorage.removeItem('geizhals-clone-options-config');
            localStorage.removeItem('geizhals-other-settings-config');
            updateOverlayUI();
            renderCloneInfo();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        updateOverlayUI();
    }

    function updateOverlayUI() {
        updateTitlebarSettingsUI();
        updateCloneOptionsUI();
        updateOtherSettingsUI();
    }

    function updateCloneOptionsUI() {
        const checkboxContainer = document.querySelector('.ghodmode-clone-options');
        if (!checkboxContainer) return;

        checkboxContainer.innerHTML = '';
        cloneConfig = getCloneOptionsConfig();
        const otherSettings = getOtherSettingsConfig();

        // Helper function to create a setting row for otherSettings
        function createOtherSettingRow(setting) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = otherSettings[setting.key];
            checkbox.style.cssText = 'cursor: pointer;';

            checkbox.addEventListener('change', () => {
                otherSettings[setting.key] = checkbox.checked;
                saveOtherSettingsConfig(otherSettings);
            });

            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.cssText = 'cursor: pointer; margin: 0;';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            return wrapper;
        }

        // 1. Wechsel in Klonmodus Optionen
        const cloneModeSettings = [
            { id: 'cloneApplyChanges', label: 'Wechsel in Klonmodus: Daten werden übernommen', key: 'cloneApplyChanges' },
            { id: 'cloneBlockBeforeUnload', label: 'Wechsel in Klonmodus: Dialog \'Website verlassen?\' blockieren', key: 'cloneBlockBeforeUnload' }
        ];

        cloneModeSettings.forEach(setting => {
            const wrapper = createOtherSettingRow(setting);

            // Special handling for cloneApplyChanges - add info button
            if (setting.key === 'cloneApplyChanges') {
                const infoButton = document.createElement('button');
                infoButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align: middle;"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="10" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">i</text></svg>';
                infoButton.style.cssText = `
                    margin-left: 0.25rem;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #0056b3;
                    font-size: 1.1em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.2em;
                    height: 1.2em;
                `;
                infoButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let existingTooltip = document.getElementById('geizhals-cloneapply-info-tooltip');
                    if (existingTooltip) {
                        existingTooltip.remove();
                        const existingBackdrop = document.getElementById('geizhals-cloneapply-backdrop');
                        if (existingBackdrop) existingBackdrop.remove();
                        return;
                    }

                    const tooltip = document.createElement('div');
                    tooltip.id = 'geizhals-cloneapply-info-tooltip';
                    tooltip.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 1.5rem;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        z-index: 9999999;
                        max-width: 400px;
                        font-size: 0.95rem;
                        line-height: 1.6;
                    `;
                    tooltip.innerHTML = `
                        <h4 style="margin: 0 0 1rem 0; border-bottom: 2px solid #28a745; padding-bottom: 0.5rem;">Datenübernahme beim Klonen</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong style="color: #28a745;">Folgende Daten werden übernommen:</strong>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
                                <li>Herstellerlinks</li>
                                <li>MPN</li>
                                <li>Matchrule</li>
                                <li>Freitext-Bezeichnung</li>
                            </ul>
                        </div>
                        <button id="geizhals-cloneapply-tooltip-close" style="
                            margin-top: 1rem;
                            padding: 0.5rem 1rem;
                            background-color: #28a745;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 0.95rem;
                        ">Schließen</button>
                    `;

                    const backdrop = document.createElement('div');
                    backdrop.id = 'geizhals-cloneapply-backdrop';
                    backdrop.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3);
                        z-index: 9999998;
                    `;

                    document.body.appendChild(backdrop);
                    document.body.appendChild(tooltip);

                    const closeButton = tooltip.querySelector('#geizhals-cloneapply-tooltip-close');
                    const closeTooltip = () => {
                        tooltip.remove();
                        backdrop.remove();
                    };

                    closeButton.addEventListener('click', closeTooltip);
                    backdrop.addEventListener('click', closeTooltip);
                });

                wrapper.appendChild(infoButton);
            }

            checkboxContainer.appendChild(wrapper);
        });

        // 2. Label "Checkboxen automatisch aktivieren:" mit Toggle
        const checkboxLabelContainer = document.createElement('div');
        checkboxLabelContainer.style.cssText = 'margin-top: 1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem;';

        const checkboxLabel = document.createElement('div');
        checkboxLabel.textContent = 'Checkboxen automatisch aktivieren:';
        checkboxLabel.style.cssText = 'font-weight: 500; color: #333;';
        checkboxLabelContainer.appendChild(checkboxLabel);

        // Toggle-Slider
        const toggleWrapper = document.createElement('label');
        toggleWrapper.style.cssText = `
            position: relative;
            display: inline-block;
            width: 36px;
            height: 20px;
            cursor: pointer;
        `;

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = cloneConfig.autoActivateEnabled !== false;
        toggleInput.style.cssText = 'opacity: 0; width: 0; height: 0;';

        const toggleSlider = document.createElement('span');
        toggleSlider.style.cssText = `
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${toggleInput.checked ? '#0d6efd' : '#ccc'};
            transition: 0.3s;
            border-radius: 20px;
        `;

        const toggleKnob = document.createElement('span');
        toggleKnob.style.cssText = `
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: ${toggleInput.checked ? '19px' : '3px'};
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        `;
        toggleSlider.appendChild(toggleKnob);

        toggleWrapper.appendChild(toggleInput);
        toggleWrapper.appendChild(toggleSlider);
        checkboxLabelContainer.appendChild(toggleWrapper);

        checkboxContainer.appendChild(checkboxLabelContainer);

        // 3. Checkboxen (eingerückt)
        const checkboxes = [
            { id: 'all', label: 'Alle', key: 'all', defaultActive: false },
            { id: 'hlink', label: 'Herstellerlinks', key: 'hlink', defaultActive: true },
            { id: 'comment', label: 'Hinweis', key: 'comment', defaultActive: true },
            { id: 'eprel', label: 'EPREL', key: 'eprel', defaultActive: false },
            { id: 'images', label: 'Bilder', key: 'images', defaultActive: false },
            { id: 'links', label: 'weitere Links & Files', key: 'links', defaultActive: false }
        ];

        const checkboxWrappers = []; // Speichere Referenzen für späteres Update

        checkboxes.forEach(cb => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-left: 1.5rem;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = cloneConfig[cb.key];
            checkbox.disabled = !toggleInput.checked;
            checkbox.style.cssText = `cursor: ${toggleInput.checked ? 'pointer' : 'not-allowed'}; ${!toggleInput.checked ? 'opacity: 0.5;' : ''}`;

            checkbox.addEventListener('change', () => {
                if (cb.key === 'all') {
                    cloneConfig.all = checkbox.checked;
                    cloneConfig.hlink = checkbox.checked;
                    cloneConfig.comment = checkbox.checked;
                    cloneConfig.eprel = checkbox.checked;
                    cloneConfig.images = checkbox.checked;
                    cloneConfig.links = checkbox.checked;
                } else {
                    cloneConfig[cb.key] = checkbox.checked;
                    cloneConfig = updateAllCheckbox(cloneConfig);
                }
                saveCloneOptionsConfig(cloneConfig);
                updateCloneOptionsUI();
            });

            const label = document.createElement('label');
            label.style.cssText = `cursor: ${toggleInput.checked ? 'pointer' : 'not-allowed'}; margin: 0; ${!toggleInput.checked ? 'opacity: 0.5; color: #999;' : ''}`;

            // Label mit "(Standard: aktiv/inaktiv)" - "aktiv" fett
            const labelText = document.createTextNode(cb.label + ' (Standard: ');
            label.appendChild(labelText);

            if (cb.defaultActive) {
                const boldSpan = document.createElement('strong');
                boldSpan.textContent = 'aktiv';
                label.appendChild(boldSpan);
            } else {
                label.appendChild(document.createTextNode('inaktiv'));
            }
            label.appendChild(document.createTextNode(')'));

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            checkboxContainer.appendChild(wrapper);

            checkboxWrappers.push({ wrapper, checkbox, label });
        });

        // Toggle Event-Handler
        toggleInput.addEventListener('change', () => {
            const isEnabled = toggleInput.checked;
            cloneConfig.autoActivateEnabled = isEnabled;
            saveCloneOptionsConfig(cloneConfig);

            // Update Toggle-Slider Aussehen
            toggleSlider.style.backgroundColor = isEnabled ? '#0d6efd' : '#ccc';
            toggleKnob.style.left = isEnabled ? '19px' : '3px';

            // Update alle Checkboxen
            checkboxWrappers.forEach(({ checkbox, label }) => {
                checkbox.disabled = !isEnabled;
                checkbox.style.cssText = `cursor: ${isEnabled ? 'pointer' : 'not-allowed'}; ${!isEnabled ? 'opacity: 0.5;' : ''}`;
                label.style.cssText = `cursor: ${isEnabled ? 'pointer' : 'not-allowed'}; margin: 0; ${!isEnabled ? 'opacity: 0.5; color: #999;' : ''}`;
            });
        });
    }

    function updateTitlebarSettingsUI() {
        const titlebarSettingsContainer = document.querySelector('.ghodmode-titlebar-settings');
        if (!titlebarSettingsContainer) return;

        titlebarSettingsContainer.innerHTML = '';
        const otherSettings = getOtherSettingsConfig();

        // Helper function to create a separator
        function createSeparator() {
            const separator = document.createElement('hr');
            separator.style.cssText = 'margin: 0.75rem 0; border: none; border-top: 1px dashed #ccc;';
            return separator;
        }

        // Helper function to create a setting row
        function createSettingRow(setting, otherSettings, changeCallback) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ${setting.dependsOn ? 'margin-left: 2rem;' : ''}
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = otherSettings[setting.key];
            checkbox.style.cssText = 'cursor: pointer;';

            if (setting.dependsOn) {
                const isParentEnabled = otherSettings[setting.dependsOn];
                checkbox.disabled = !isParentEnabled;
                if (!isParentEnabled) {
                    checkbox.checked = false;
                }
            }

            checkbox.addEventListener('change', () => {
                otherSettings[setting.key] = checkbox.checked;
                saveOtherSettingsConfig(otherSettings);
                if (changeCallback) changeCallback(setting.key, checkbox.checked);
            });

            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.cssText = `cursor: pointer; margin: 0; ${setting.dependsOn && !otherSettings[setting.dependsOn] ? 'opacity: 0.5; color: #999;' : ''}`;

            if (setting.tooltip) {
                label.title = setting.tooltip;
                wrapper.title = setting.tooltip;
            }

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            return { wrapper, checkbox, label };
        }

        // Common change callback
        const commonChangeCallback = (key, checked) => {
            if (key === 'gridDivider' && checked) {
                initGridDividerModule();
            }
            if (key === 'cloneDropdownEnabled') {
                renderCloneInfo();
            }
            if (key === 'sidebarToggleButtonInHeadbar' || key === 'titlebarCloneButton' || key === 'titlebarReloadButton' || key === 'titlebarSaveButton' || key === 'titlebarCopyButton' || key === 'titlebarPasteButton') {
                updateTitlebarSettingsUI();
                updateOtherSettingsUI();
            }
            updateTitlebarSettingsUI();
            updateOtherSettingsUI();
            applyImageViewerBehavior();
            applyPreviewSectionSearchOverlay();
            applyTitlebarIdLink();
            applyTitlebarRemoveHerstellerLink();
            applyTitlebarIdCopyIcon();
            applyImageGalleryHoverPreview();
            applySidebarToggleButton();
            applyTitlebarCloneButton();
            applyTitlebarSaveButton();
            applyTitlebarCopyButton();
            applyTitlebarPasteButton();
            applyTitlebarReloadButton();
            applyCommentFieldCollapse();
            applyMpnOverlayButton();
            applyHerstellerlinkOverlayButton();
            applyHerstellerlinkCaseButton();
            applyMatchruleContainerReorder();
            applyBezeichnungKvHinweisEntfernen();
            applyLinksCountDisplay();
            applyLinksAddArticleIds();
            applyTitlebarDatasheets();
        };

        // Titelleiste - other settings
        const titlebarOtherSettings = [
            { id: 'imageViewerModeNoHoverAnimation', label: 'Bild: ohne Hover-Animation', key: 'imageViewerModeNoHoverAnimation' },
            { id: 'imageViewerMode', label: 'Bild: Klick öffnet Bilderansicht in neuen Tab', key: 'imageViewerMode' },
            { id: 'titlebarIdCopyIcon', label: 'Artikel-ID: Copy-Icon', key: 'titlebarIdCopyIcon' },
            { id: 'titlebarIdLinkToArticleEdit', label: 'Artikel-ID: Link auf artikel-edit', key: 'titlebarIdLinkToArticleEdit' },
            { id: 'titlebarRemoveHerstellerLink', label: 'Hersteller: Entferne Link zu Herstellerverzeichnis', key: 'titlebarRemoveHerstellerLink' },
            { id: 'titlebarCreatedFromInTitlebar', label: 'Klon-Infos anzeigen (<created from>/<cloned from>)', key: 'titlebarCreatedFromInTitlebar' },
            { id: 'cloneDropdownEnabled', label: 'Compare-Dropdown anzeigen', key: 'cloneDropdownEnabled' },
            { id: 'imageGalleryHoverPreview', label: 'Bildergalerie mit Hover-Vorschau', key: 'imageGalleryHoverPreview' },
            { id: 'titlebarDatasheets', label: 'Datenblätter anzeigen', key: 'titlebarDatasheets' }
        ];

        titlebarOtherSettings.forEach(setting => {
            const { wrapper, checkbox } = createSettingRow(setting, otherSettings, commonChangeCallback);

            // Special handling for cloneDropdownEnabled - add domain dropdown
            if (setting.key === 'cloneDropdownEnabled') {
                titlebarSettingsContainer.appendChild(wrapper);

                const domainWrapper = document.createElement('div');
                domainWrapper.style.cssText = 'margin-left: 2rem; display: flex; align-items: center; gap: 0.5rem;';

                const domainLabel = document.createElement('label');
                domainLabel.textContent = 'GH Domain für PV-Vergleich:';
                domainLabel.style.cssText = `margin: 0; ${!checkbox.checked ? 'opacity: 0.5; color: #999;' : ''}`;

                const domainSelect = document.createElement('select');
                domainSelect.style.cssText = `
                    padding: 0.25rem 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    cursor: pointer;
                    ${!checkbox.checked ? 'opacity: 0.5; pointer-events: none;' : ''}
                `;
                domainSelect.disabled = !checkbox.checked;

                ['DE', 'AT', 'EU'].forEach(domain => {
                    const option = document.createElement('option');
                    option.value = domain;
                    option.textContent = domain;
                    option.selected = otherSettings.cloneDropdownDomain === domain;
                    domainSelect.appendChild(option);
                });

                domainSelect.addEventListener('change', () => {
                    otherSettings.cloneDropdownDomain = domainSelect.value;
                    saveOtherSettingsConfig(otherSettings);
                    renderCloneInfo();
                });

                domainWrapper.appendChild(domainLabel);
                domainWrapper.appendChild(domainSelect);
                titlebarSettingsContainer.appendChild(domainWrapper);
                return;
            }

            // Special handling for imageViewerMode - add info button
            if (setting.key === 'imageViewerMode') {
                const infoButton = document.createElement('button');
                infoButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align: middle;"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="10" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">i</text></svg>';
                infoButton.style.cssText = `
                    margin-left: 0.25rem;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #0056b3;
                    font-size: 1.1em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.2em;
                    height: 1.2em;
                `;
                infoButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let existingTooltip = document.getElementById('geizhals-imageviewer-info-tooltip');
                    if (existingTooltip) {
                        existingTooltip.remove();
                        return;
                    }

                    const tooltip = document.createElement('div');
                    tooltip.id = 'geizhals-imageviewer-info-tooltip';
                    tooltip.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 1.5rem;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        z-index: 9999999;
                        max-width: 500px;
                        font-size: 0.95rem;
                        line-height: 1.6;
                    `;
                    tooltip.innerHTML = `
                        <h4 style="margin: 0 0 1rem 0; border-bottom: 2px solid #007bff; padding-bottom: 0.5rem;">Bildansicht in neuem Tab</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong style="color: #28a745;">Aktiviert auf:</strong>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
                                <li><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">?id=&lt;id&gt;</code> (normale Artikel-Seite)</li>
                                <li><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">?id=&lt;id&gt;&mode=log</code> (Log-Seite)</li>
                            </ul>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong style="color: #dc3545;">Deaktiviert auf:</strong>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
                                <li><code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">?id=&lt;id&gt;&mode=image</code> (Bildansicht-Seite)</li>
                            </ul>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">Hier funktioniert die native Seitenweiterleitung.</p>
                        </div>
                        <button id="geizhals-tooltip-close" style="
                            margin-top: 1rem;
                            padding: 0.5rem 1rem;
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 0.95rem;
                        ">Schließen</button>
                    `;

                    const backdrop = document.createElement('div');
                    backdrop.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3);
                        z-index: 9999998;
                    `;

                    document.body.appendChild(backdrop);
                    document.body.appendChild(tooltip);

                    const closeButton = tooltip.querySelector('#geizhals-tooltip-close');
                    const closeTooltip = () => {
                        tooltip.remove();
                        backdrop.remove();
                    };

                    closeButton.addEventListener('click', closeTooltip);
                    backdrop.addEventListener('click', closeTooltip);
                });

                wrapper.appendChild(infoButton);
            }

            titlebarSettingsContainer.appendChild(wrapper);
        });

        // Label "Separate Buttons für:"
        const buttonsLabel = document.createElement('div');
        buttonsLabel.textContent = 'Separate Buttons für:';
        buttonsLabel.style.cssText = 'margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 500; color: #333;';
        titlebarSettingsContainer.appendChild(buttonsLabel);

        // Titelleiste - Buttons (eingerückt)
        const titlebarButtonSettings = [
            { id: 'titlebarCloneButton', label: 'Klonen', key: 'titlebarCloneButton' },
            { id: 'titlebarReloadButton', label: 'Neu laden', key: 'titlebarReloadButton' },
            { id: 'titlebarSaveButton', label: 'Speichern', key: 'titlebarSaveButton' },
            { id: 'titlebarCopyButton', label: 'Kopieren', key: 'titlebarCopyButton' },
            { id: 'titlebarPasteButton', label: 'Einfügen', key: 'titlebarPasteButton' },
            { id: 'sidebarToggleButtonInHeadbar', label: 'Seitenleiste ein-/ausklappen', key: 'sidebarToggleButtonInHeadbar' }
        ];

        titlebarButtonSettings.forEach(setting => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-left: 1.5rem;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = otherSettings[setting.key];
            checkbox.style.cssText = 'cursor: pointer;';

            checkbox.addEventListener('change', () => {
                otherSettings[setting.key] = checkbox.checked;
                saveOtherSettingsConfig(otherSettings);
                if (commonChangeCallback) commonChangeCallback(setting.key, checkbox.checked);
            });

            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.cssText = 'cursor: pointer; margin: 0;';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            titlebarSettingsContainer.appendChild(wrapper);
        });
    }

    function updateOtherSettingsUI() {
        const otherSettingsContainer = document.querySelector('.ghodmode-other-settings');
        if (!otherSettingsContainer) return;

        otherSettingsContainer.innerHTML = '';
        const otherSettings = getOtherSettingsConfig();

        // Helper function to create a setting row
        function createSettingRow(setting, otherSettings, changeCallback) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ${setting.dependsOn ? 'margin-left: 2rem;' : ''}
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = otherSettings[setting.key];
            checkbox.style.cssText = 'cursor: pointer;';

            if (setting.dependsOn) {
                const isParentEnabled = otherSettings[setting.dependsOn];
                checkbox.disabled = !isParentEnabled;
                if (!isParentEnabled) {
                    checkbox.checked = false;
                }
            }

            checkbox.addEventListener('change', () => {
                otherSettings[setting.key] = checkbox.checked;
                saveOtherSettingsConfig(otherSettings);
                if (changeCallback) changeCallback(setting.key, checkbox.checked);
            });

            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.cssText = `cursor: pointer; margin: 0; ${setting.dependsOn && !otherSettings[setting.dependsOn] ? 'opacity: 0.5; color: #999;' : ''}`;

            if (setting.tooltip) {
                label.title = setting.tooltip;
                wrapper.title = setting.tooltip;
            }

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            return { wrapper, checkbox, label };
        }

        // Common change callback
        const commonChangeCallback = (key, checked) => {
            if (key === 'gridDivider' && checked) {
                initGridDividerModule();
            }
            if (key === 'cloneDropdownEnabled') {
                renderCloneInfo();
            }
            if (key === 'sidebarToggleButtonInHeadbar' || key === 'titlebarCloneButton' || key === 'titlebarReloadButton' || key === 'titlebarSaveButton' || key === 'titlebarCopyButton' || key === 'titlebarPasteButton') {
                updateTitlebarSettingsUI();
                updateOtherSettingsUI();
            }
            updateTitlebarSettingsUI();
            updateOtherSettingsUI();
            applyImageViewerBehavior();
            applyPreviewSectionSearchOverlay();
            applyTitlebarIdLink();
            applyTitlebarRemoveHerstellerLink();
            applyTitlebarIdCopyIcon();
            applyImageGalleryHoverPreview();
            applySidebarToggleButton();
            applyTitlebarCloneButton();
            applyTitlebarSaveButton();
            applyTitlebarCopyButton();
            applyTitlebarPasteButton();
            applyTitlebarReloadButton();
            applyCommentFieldCollapse();
            applyMpnOverlayButton();
            applyHerstellerlinkOverlayButton();
            applyHerstellerlinkCaseButton();
            applyMatchruleContainerReorder();
            applyBezeichnungKvHinweisEntfernen();
            applyLinksCountDisplay();
            applyLinksAddArticleIds();
            applyTitlebarDatasheets();
        };

        // Sonstige Einstellungen
        const otherSettingsList = [
            { id: 'gridDivider', label: 'Bereichstrenner verschiebbar (bei geteilter Ansicht)', key: 'gridDivider' },
            { id: 'bezeichnungKvHinweisEntfernen', label: 'Bezeichnung: Hinweis "Bezeichnung wird über KV generiert!" entfernen', key: 'bezeichnungKvHinweisEntfernen' },
            { id: 'linksCountDisplay', label: 'Testberichte & weiterführende Links: Anzahl der Verlinkungen anzeigen', key: 'linksCountDisplay' },
            { id: 'linksAddArticleIds', label: 'Testberichte & weiterführende Links: Button für "Artikel-ID(s) nachtragen"', key: 'linksAddArticleIds' },
            { id: 'matchruleContainerReorder', label: 'Matchrule-Feld: Mehrzeilig + Volle Breite', key: 'matchruleContainerReorder' },
            { id: 'commentFieldCollapsed', label: 'Hinweis-Feld: Höhe begrenzen', key: 'commentFieldCollapsed' },
            { id: 'previewSectionSearchOverlay', label: 'Suchfeld für Artikelvorschau / Eingabemaske', key: 'previewSectionSearchOverlay', hasDropdown: true },
            { id: 'mpnOverlayButton', label: 'Button: MPN(s) bearbeiten', key: 'mpnOverlayButton' },
            { id: 'herstellerlinkOverlayButton', label: 'Button: Herstellerlinks bearbeiten', key: 'herstellerlinkOverlayButton' },
            { id: 'herstellerlinkCaseButton', label: 'Button: Case Converter für Herstellerlinks', key: 'herstellerlinkCaseButton' },
            { id: 'sidebarAutoCollapse', label: 'Seitenleiste automatisch ein-/ausklappen', key: 'sidebarAutoCollapse' }
        ];

        otherSettingsList.forEach(setting => {
            const { wrapper, checkbox } = createSettingRow(setting, otherSettings, commonChangeCallback);

            // Special handling for gridDivider - add reset button
            if (setting.key === 'gridDivider') {
                const resetButton = document.createElement('button');
                resetButton.textContent = 'Position zurücksetzen';
                resetButton.style.cssText = `
                    margin-left: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.875rem;
                `;
                resetButton.addEventListener('mouseover', () => {
                    resetButton.style.backgroundColor = '#5a6268';
                });
                resetButton.addEventListener('mouseout', () => {
                    resetButton.style.backgroundColor = '#6c757d';
                });
                resetButton.addEventListener('click', resetGridDividerPosition);
                wrapper.appendChild(resetButton);
            }

            // Special handling for commentFieldCollapsed - add info button
            if (setting.key === 'commentFieldCollapsed') {
                const infoButton = document.createElement('button');
                infoButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align: middle;"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="10" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">i</text></svg>';
                infoButton.style.cssText = `
                    margin-left: 0.25rem;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #0056b3;
                    font-size: 1.1em;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.2em;
                    height: 1.2em;
                    vertical-align: middle;
                `;
                infoButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let existingTooltip = document.getElementById('geizhals-commentfield-info-tooltip');
                    if (existingTooltip) {
                        existingTooltip.remove();
                        const existingBackdrop = document.getElementById('geizhals-commentfield-backdrop');
                        if (existingBackdrop) existingBackdrop.remove();
                        return;
                    }

                    const tooltip = document.createElement('div');
                    tooltip.id = 'geizhals-commentfield-info-tooltip';
                    tooltip.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 1.5rem;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        z-index: 9999999;
                        max-width: 450px;
                        font-size: 0.95rem;
                        line-height: 1.6;
                    `;
                    tooltip.innerHTML = `
                        <h4 style="margin: 0 0 1rem 0; border-bottom: 2px solid #0d6efd; padding-bottom: 0.5rem;">Hinweis-Feld: Höhe begrenzen</h4>
                        <div style="margin-bottom: 1rem;">
                            Kollabiert bei langen Hinweistexten das Hinweisfeld beim Seitenladen auf 180px Höhe.<br><br>
                            Ein "Expandieren/Reduzieren"-Button ermöglicht das Umschalten zwischen kollabierter Ansicht und voller Höhe.
                        </div>
                        <button id="geizhals-commentfield-tooltip-close" style="
                            margin-top: 0.5rem;
                            padding: 0.5rem 1rem;
                            background-color: #0d6efd;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 0.95rem;
                        ">Schließen</button>
                    `;

                    const backdrop = document.createElement('div');
                    backdrop.id = 'geizhals-commentfield-backdrop';
                    backdrop.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3);
                        z-index: 9999998;
                    `;

                    document.body.appendChild(backdrop);
                    document.body.appendChild(tooltip);

                    const closeButton = tooltip.querySelector('#geizhals-commentfield-tooltip-close');
                    const closeTooltip = () => {
                        tooltip.remove();
                        backdrop.remove();
                    };

                    closeButton.addEventListener('click', closeTooltip);
                    backdrop.addEventListener('click', closeTooltip);
                });
                wrapper.appendChild(infoButton);
            }

            // Special handling for sidebarAutoCollapse - add info button
            if (setting.key === 'sidebarAutoCollapse') {
                const infoButton = document.createElement('button');
                infoButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align: middle;"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="10" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">i</text></svg>';
                infoButton.style.cssText = `
                    margin-left: 0.25rem;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #0056b3;
                    font-size: 1.1em;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.2em;
                    height: 1.2em;
                    vertical-align: middle;
                `;
                infoButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let existingTooltip = document.getElementById('geizhals-sidebarautocollapse-info-tooltip');
                    if (existingTooltip) {
                        existingTooltip.remove();
                        const existingBackdrop = document.getElementById('geizhals-sidebarautocollapse-backdrop');
                        if (existingBackdrop) existingBackdrop.remove();
                        return;
                    }

                    const tooltip = document.createElement('div');
                    tooltip.id = 'geizhals-sidebarautocollapse-info-tooltip';
                    tooltip.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 1.5rem;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        z-index: 9999999;
                        max-width: 450px;
                        font-size: 0.95rem;
                        line-height: 1.6;
                    `;
                    tooltip.innerHTML = `
                        <h4 style="margin: 0 0 1rem 0; border-bottom: 2px solid #0d6efd; padding-bottom: 0.5rem;">Seitenleiste automatisch ein-/ausklappen</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong>Einklappen:</strong> Die Seitenleiste wird beim Öffnen eines Artikels automatisch eingeklappt.<br><br>
                            <strong>Ausklappen:</strong> Im Klonmodus wird die Seitenleiste automatisch ausgeklappt, damit die Klon-Optionen sichtbar sind. Nach dem Klonen wird sie wieder eingeklappt.
                        </div>
                        <button id="geizhals-sidebarautocollapse-tooltip-close" style="
                            margin-top: 0.5rem;
                            padding: 0.5rem 1rem;
                            background-color: #0d6efd;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 0.95rem;
                        ">Schließen</button>
                    `;

                    const backdrop = document.createElement('div');
                    backdrop.id = 'geizhals-sidebarautocollapse-backdrop';
                    backdrop.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3);
                        z-index: 9999998;
                    `;

                    document.body.appendChild(backdrop);
                    document.body.appendChild(tooltip);

                    const closeButton = tooltip.querySelector('#geizhals-sidebarautocollapse-tooltip-close');
                    const closeTooltip = () => {
                        tooltip.remove();
                        backdrop.remove();
                    };

                    closeButton.addEventListener('click', closeTooltip);
                    backdrop.addEventListener('click', closeTooltip);
                });
                wrapper.appendChild(infoButton);

                // Wrapper auf flex-wrap umstellen für Radio-Buttons in neuer Zeile
                wrapper.style.flexWrap = 'wrap';

                // Radio-Buttons für Modus-Auswahl (unter der Checkbox)
                const radioContainer = document.createElement('div');
                radioContainer.id = 'sidebarAutoCollapseRadioContainer';
                radioContainer.style.cssText = `
                    width: 100%;
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                `;

                // Radio 1: Immer
                const radio1Wrapper = document.createElement('div');
                radio1Wrapper.style.cssText = 'display: flex; align-items: center; gap: 0.4rem;';

                const radio1 = document.createElement('input');
                radio1.type = 'radio';
                radio1.name = 'sidebarAutoCollapseMode';
                radio1.value = 'always';
                radio1.id = 'sidebarAutoCollapseMode_always';
                radio1.checked = otherSettings.sidebarAutoCollapseMode === 'always' || !otherSettings.sidebarAutoCollapseMode;
                radio1.style.cursor = 'pointer';

                const label1 = document.createElement('label');
                label1.textContent = 'Immer';
                label1.htmlFor = 'sidebarAutoCollapseMode_always';
                label1.style.cssText = 'cursor: pointer; margin: 0;';

                radio1Wrapper.appendChild(radio1);
                radio1Wrapper.appendChild(label1);

                // Radio 2: Nur bis max. Fensterbreite
                const radio2Wrapper = document.createElement('div');
                radio2Wrapper.style.cssText = 'display: flex; align-items: center; gap: 0.4rem;';

                const radio2 = document.createElement('input');
                radio2.type = 'radio';
                radio2.name = 'sidebarAutoCollapseMode';
                radio2.value = 'maxWidth';
                radio2.id = 'sidebarAutoCollapseMode_maxWidth';
                radio2.checked = otherSettings.sidebarAutoCollapseMode === 'maxWidth';
                radio2.style.cursor = 'pointer';

                const label2 = document.createElement('label');
                label2.textContent = 'Nur bis max. Fensterbreite (in Pixel):';
                label2.htmlFor = 'sidebarAutoCollapseMode_maxWidth';
                label2.style.cssText = 'cursor: pointer; margin: 0;';

                const maxWidthInput = document.createElement('input');
                maxWidthInput.type = 'number';
                maxWidthInput.id = 'sidebarAutoCollapseMaxWidth';
                maxWidthInput.value = otherSettings.sidebarAutoCollapseMaxWidth || 2560;
                maxWidthInput.min = '1';
                maxWidthInput.step = '1';
                maxWidthInput.style.cssText = `
                    width: 80px;
                    padding: 0.2rem 0.4rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    margin-left: 0.5rem;
                `;

                // Aktuelle Fensterbreite anzeigen (in physischen Pixeln)
                const currentWidthDisplay = document.createElement('span');
                currentWidthDisplay.id = 'sidebarAutoCollapseCurrentWidth';
                currentWidthDisplay.style.cssText = `
                    margin-left: 0.5rem;
                    color: #888;
                    font-size: 0.8rem;
                `;
                const updateCurrentWidthDisplay = () => {
                    const physicalWidth = Math.floor(window.innerWidth * window.devicePixelRatio);
                    currentWidthDisplay.textContent = `(aktuell: ${physicalWidth}px)`;
                };
                updateCurrentWidthDisplay();
                // Update bei Fenstergrößenänderung
                window.addEventListener('resize', updateCurrentWidthDisplay);

                radio2Wrapper.appendChild(radio2);
                radio2Wrapper.appendChild(label2);
                radio2Wrapper.appendChild(maxWidthInput);
                radio2Wrapper.appendChild(currentWidthDisplay);

                // Funktion zum Aktualisieren des Radio-States
                const updateRadioState = () => {
                    const isMainCheckboxChecked = checkbox.checked;

                    // Radio-Buttons nur aktiv wenn Hauptcheckbox aktiv
                    radio1.disabled = !isMainCheckboxChecked;
                    radio2.disabled = !isMainCheckboxChecked;
                    label1.style.opacity = isMainCheckboxChecked ? '1' : '0.5';
                    label2.style.opacity = isMainCheckboxChecked ? '1' : '0.5';
                    label1.style.cursor = isMainCheckboxChecked ? 'pointer' : 'default';
                    label2.style.cursor = isMainCheckboxChecked ? 'pointer' : 'default';
                    radio1.style.cursor = isMainCheckboxChecked ? 'pointer' : 'default';
                    radio2.style.cursor = isMainCheckboxChecked ? 'pointer' : 'default';

                    // Input-Feld nur aktiv wenn Radio 2 ausgewählt UND Hauptcheckbox aktiv
                    const isMaxWidthActive = isMainCheckboxChecked && radio2.checked;
                    maxWidthInput.disabled = !isMaxWidthActive;
                    maxWidthInput.style.opacity = isMaxWidthActive ? '1' : '0.5';
                };

                // Event-Handler für Hauptcheckbox
                checkbox.addEventListener('change', updateRadioState);

                radio1.addEventListener('change', () => {
                    if (radio1.checked) {
                        otherSettings.sidebarAutoCollapseMode = 'always';
                        saveOtherSettingsConfig(otherSettings);
                        updateRadioState();
                    }
                });

                radio2.addEventListener('change', () => {
                    if (radio2.checked) {
                        otherSettings.sidebarAutoCollapseMode = 'maxWidth';
                        saveOtherSettingsConfig(otherSettings);
                        updateRadioState();
                    }
                });

                maxWidthInput.addEventListener('change', () => {
                    const value = parseInt(maxWidthInput.value, 10);
                    if (value && value > 0) {
                        otherSettings.sidebarAutoCollapseMaxWidth = value;
                        saveOtherSettingsConfig(otherSettings);
                    } else {
                        maxWidthInput.value = otherSettings.sidebarAutoCollapseMaxWidth || 2560;
                    }
                });

                // Initial state
                updateRadioState();

                radioContainer.appendChild(radio1Wrapper);
                radioContainer.appendChild(radio2Wrapper);
                wrapper.appendChild(radioContainer);
            }

            // Special handling for matchruleContainerReorder - add info button
            if (setting.key === 'matchruleContainerReorder') {
                const infoButton = document.createElement('button');
                infoButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align: middle;"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="10" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">i</text></svg>';
                infoButton.style.cssText = `
                    margin-left: 0.25rem;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    color: #0056b3;
                    font-size: 1.1em;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.2em;
                    height: 1.2em;
                    vertical-align: middle;
                `;
                infoButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let existingTooltip = document.getElementById('geizhals-matchrule-info-tooltip');
                    if (existingTooltip) {
                        existingTooltip.remove();
                        const existingBackdrop = document.getElementById('geizhals-matchrule-backdrop');
                        if (existingBackdrop) existingBackdrop.remove();
                        return;
                    }

                    const tooltip = document.createElement('div');
                    tooltip.id = 'geizhals-matchrule-info-tooltip';
                    tooltip.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 1.5rem;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        z-index: 9999999;
                        max-width: 450px;
                        font-size: 0.95rem;
                        line-height: 1.6;
                    `;
                    tooltip.innerHTML = `
                        <h4 style="margin: 0 0 1rem 0; border-bottom: 2px solid #0d6efd; padding-bottom: 0.5rem;">Matchrule-Feld: Mehrzeilig + Volle Breite</h4>
                        <div style="margin-bottom: 1rem;">
                            Wandelt das Matchrule-Eingabefeld in eine mehrzeilige Textarea mit voller Breite um. Steuerelemente werden darunter verschoben.<br><br>
                            Bei langen Matchrules (>180px) wird das Feld kollabiert angezeigt. Ein "Expandieren/Reduzieren"-Button ermöglicht das Umschalten zwischen den Ansichten.
                        </div>
                        <button id="geizhals-matchrule-tooltip-close" style="
                            margin-top: 0.5rem;
                            padding: 0.5rem 1rem;
                            background-color: #0d6efd;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 0.95rem;
                        ">Schließen</button>
                    `;

                    const backdrop = document.createElement('div');
                    backdrop.id = 'geizhals-matchrule-backdrop';
                    backdrop.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3);
                        z-index: 9999998;
                    `;

                    document.body.appendChild(backdrop);
                    document.body.appendChild(tooltip);

                    const closeButton = tooltip.querySelector('#geizhals-matchrule-tooltip-close');
                    const closeTooltip = () => {
                        tooltip.remove();
                        backdrop.remove();
                    };

                    closeButton.addEventListener('click', closeTooltip);
                    backdrop.addEventListener('click', closeTooltip);
                });
                wrapper.appendChild(infoButton);
            }

            // Special handling for previewSectionSearchOverlay - add trigger dropdown
            if (setting.key === 'previewSectionSearchOverlay') {
                const dropdown = document.createElement('select');
                dropdown.id = 'previewSectionSearchTrigger';
                dropdown.style.cssText = `
                    margin-left: 0.5rem;
                    padding: 0.2rem 0.4rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    cursor: pointer;
                `;

                const options = [
                    { value: 'mousewheel', label: 'Mausrad-Button' },
                    { value: 'ctrlf', label: 'STRG+F' },
                    { value: 'both', label: 'Mausrad-Button oder STRG+F' }
                ];

                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    if (otherSettings.previewSectionSearchTrigger === opt.value) {
                        option.selected = true;
                    }
                    dropdown.appendChild(option);
                });

                dropdown.addEventListener('change', () => {
                    otherSettings.previewSectionSearchTrigger = dropdown.value;
                    saveOtherSettingsConfig(otherSettings);
                    if (commonChangeCallback) commonChangeCallback('previewSectionSearchTrigger', dropdown.value);
                });

                wrapper.appendChild(dropdown);
            }

            otherSettingsContainer.appendChild(wrapper);
        });
    }

    // ===== APPLY CLONE OPTIONS TO PAGE =====
    async function applyCloneOptionsToPage() {
        cloneConfig = getCloneOptionsConfig();

        // Wenn autoActivateEnabled deaktiviert ist, keine Checkboxen automatisch setzen
        if (cloneConfig.autoActivateEnabled === false) {
            // Nur die anderen Funktionen ausführen
            applyImageViewerBehavior();
            applyPreviewSectionSearchOverlay();
            applyCommentFieldCollapse();
            applyTitlebarIdLink();
            applyTitlebarRemoveHerstellerLink();
            applyTitlebarIdCopyIcon();
            applyImageGalleryHoverPreview();
            applyTitlebarDatasheets();
            return;
        }

        // Im Klonmodus: Seitenleiste ausklappen wenn nötig, damit Checkboxen sichtbar sind
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('clone_id')) {
            const sidebarBtn = getSidebarButton();
            if (sidebarBtn && isSidebarCollapsed()) {
                sidebarBtn.click();
                // Warte auf DOM-Update
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }

        const checkboxMapping = {
            'all': cloneConfig.all,
            'clone_hlink': cloneConfig.hlink,
            'clone_comment': cloneConfig.comment,
            'clone_eprel': cloneConfig.eprel,
            'clone_images': cloneConfig.images,
            'clone_links': cloneConfig.links
        };

        // Warte kurz und versuche dann die Checkboxen zu setzen
        const applyCheckboxes = () => {
            Object.entries(checkboxMapping).forEach(([id, checked]) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    if (checkbox.checked !== checked) {
                        checkbox.click();
                    }
                }
            });
        };

        // Sofort versuchen
        applyCheckboxes();

        // Nach kurzer Verzögerung nochmal versuchen (falls DOM noch nicht fertig)
        setTimeout(applyCheckboxes, 300);
        setTimeout(applyCheckboxes, 600);

        applyImageViewerBehavior();
        applyPreviewSectionSearchOverlay();
        applyCommentFieldCollapse();
        applyTitlebarIdLink();
        applyTitlebarRemoveHerstellerLink();
        applyTitlebarIdCopyIcon();
        applyImageGalleryHoverPreview();
        applyTitlebarDatasheets();
    }

    // ===== APPLY IMAGE VIEWER BEHAVIOR =====
    function applyImageViewerBehavior() {
        try {
            const otherSettings = getOtherSettingsConfig();
            const urlParams = new URLSearchParams(window.location.search);

            // Disable this function on image mode page
            if (urlParams.get('mode') === 'image') {
                return;
            }

            if (!otherSettings.imageViewerMode) {
                return;
            }

            let retryCount = 0;
            const maxRetries = 10;

            function setupImageViewer() {
                try {
                    // Try to find the link that contains the image (a href="...?mode=image")
                    let link = document.querySelector('a[href*="mode=image"] > img')?.parentElement;

                    // Fallback: Find the image with the specific style
                    let img = null;
                    if (!link) {
                        img = document.querySelector('img.d-block[style*="max-height: 3rem"]');
                        if (img) {
                            link = img.closest('a[href*="mode=image"]');
                        }
                    }

                    if (!link && !img) {
                        if (retryCount < maxRetries) {
                            retryCount++;
                            setTimeout(setupImageViewer, 300);
                        }
                        return;
                    }

                    // Disable hover animation if option is enabled
                    if (otherSettings.imageViewerModeNoHoverAnimation) {
                        if (!document.getElementById('geizhals-image-viewer-no-hover-styles')) {
                            const style = document.createElement('style');
                            style.id = 'geizhals-image-viewer-no-hover-styles';
                            style.textContent = `
                                img.fade.d-block.m-auto.bg-black.show {
                                    display: none !important;
                                    visibility: hidden !important;
                                    pointer-events: none !important;
                                }
                            `;
                            document.head.appendChild(style);
                        }
                    } else {
                        // Remove the style if option is disabled
                        const existingStyle = document.getElementById('geizhals-image-viewer-no-hover-styles');
                        if (existingStyle) {
                            existingStyle.remove();
                        }
                    }

                    link.style.cursor = 'pointer';

                    // Remove existing click listeners by cloning
                    const newLink = link.cloneNode(true);
                    link.parentNode.replaceChild(newLink, link);

                    newLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const imageViewerUrl = `https://opus.geizhals.at/kalif/artikel?id=${currentId}&mode=image`;
                        window.open(imageViewerUrl, '_blank');
                    });
                } catch (e) {
                    // Fehler ignorieren
                }
            }

            setupImageViewer();
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== APPLY COMMENT FIELD COLLAPSE =====
    function applyCommentFieldCollapse() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Finde alle Hinweisfeld-Formulare
            const commentForms = document.querySelectorAll('form#section_form_comment');

            // Wenn Option deaktiviert ist, nur aufräumen falls vorher aktiviert war
            if (!otherSettings.commentFieldCollapsed) {
                commentForms.forEach(form => {
                    const textarea = form.querySelector('textarea');
                    const h5 = form.querySelector('h5');
                    if (!textarea || !h5) return;

                    // Entferne Button falls vorhanden
                    const existingButton = h5.querySelector('.geizhals-comment-toggle-btn');
                    if (existingButton) {
                        existingButton.remove();
                    }

                    // Entferne Observer falls vorhanden
                    if (textarea._geizhalsResizeObserver) {
                        textarea._geizhalsResizeObserver.disconnect();
                        textarea._geizhalsResizeObserver = null;
                    }

                    // Entferne Event-Listener falls vorhanden (Rückwärtskompatibilität)
                    if (textarea._geizhalsInputHandler) {
                        textarea.removeEventListener('input', textarea._geizhalsInputHandler);
                        textarea._geizhalsInputHandler = null;
                    }

                    // Styles zurücksetzen
                    if (textarea.dataset.geizhalsgCollapsed !== undefined) {
                        textarea.style.height = '';
                        delete textarea.dataset.geizhalsgCollapsed;
                    }
                });
                return;
            }

            // Option ist aktiviert - normale Logik
            commentForms.forEach(form => {
                const textarea = form.querySelector('textarea');
                const h5 = form.querySelector('h5');

                if (!textarea || !h5) return;

                // Wenn Button bereits existiert, nichts tun (bereits initialisiert)
                const existingButton = h5.querySelector('.geizhals-comment-toggle-btn');
                if (existingButton) {
                    return;
                }

                // Höhe für kollabiertes Feld (ca. 5 Zeilen)
                const collapsedHeight = 180;

                // Prüfe ob Inhalt groß genug ist um kollabiert zu werden
                // scrollHeight gibt die tatsächliche Inhaltshöhe an
                const needsCollapse = textarea.scrollHeight > collapsedHeight;

                // Wenn kein Kollabieren nötig, keinen Button hinzufügen
                if (!needsCollapse) {
                    return;
                }

                // Erstelle Toggle-Button
                const toggleButton = document.createElement('button');
                toggleButton.type = 'button';
                toggleButton.className = 'geizhals-comment-toggle-btn';
                toggleButton.textContent = 'Expandieren';
                toggleButton.style.cssText = `
                    margin-left: 0.5rem;
                    padding: 0.1rem 0.4rem;
                    font-size: 0.7rem;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    background: white;
                    cursor: pointer;
                    color: #666;
                    display: inline-block;
                    vertical-align: middle;
                    width: 70px;
                    text-align: center;
                `;

                // Initial kollabieren
                textarea.style.height = collapsedHeight + 'px';
                textarea.dataset.geizhalsgCollapsed = 'true';

                // Toggle-Funktionalität
                toggleButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCollapsed = textarea.dataset.geizhalsgCollapsed === 'true';

                    if (isCollapsed) {
                        // Expandieren - setze Höhe auf scrollHeight
                        textarea.style.height = textarea.scrollHeight + 'px';
                        textarea.dataset.geizhalsgCollapsed = 'false';
                        toggleButton.textContent = 'Reduzieren';
                    } else {
                        // Kollabieren - setze Höhe auf collapsedHeight
                        textarea.style.height = collapsedHeight + 'px';
                        textarea.dataset.geizhalsgCollapsed = 'true';
                        toggleButton.textContent = 'Expandieren';
                    }
                });

                // Füge Button zum h5 hinzu
                h5.appendChild(toggleButton);
            });
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== MPN OVERLAY BUTTON =====
    function applyMpnOverlayButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.mpnOverlayButton) return;

            // Finde das MPN-Formular
            const mpnForm = document.getElementById('section_form_mpn');
            if (!mpnForm) return;

            // Finde das h5 Element
            const h5 = mpnForm.querySelector('h5');
            if (!h5) return;

            // Prüfe ob Button bereits existiert
            if (h5.querySelector('.geizhals-mpn-overlay-btn')) return;

            // Erstelle den Overlay-Button
            const overlayBtn = document.createElement('button');
            overlayBtn.type = 'button';
            overlayBtn.className = 'geizhals-mpn-overlay-btn btn btn-outline-primary btn-sm';
            overlayBtn.textContent = '⤢';
            overlayBtn.style.cssText = `
                margin-left: 0.5rem;
                padding: 0.2rem 0.6rem;
                font-size: 1rem;
                font-weight: 500;
            `;

            overlayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Übergebe Mausposition an Overlay
                openMpnOverlay(e.clientX, e.clientY);
            });

            h5.appendChild(overlayBtn);

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function openMpnOverlay(mouseX, mouseY) {
        // Entferne existierendes Overlay falls vorhanden
        const existingOverlay = document.getElementById('geizhals-mpn-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Erstelle Overlay
        const overlay = document.createElement('div');
        overlay.id = 'geizhals-mpn-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;

        // Erstelle Dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: absolute;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 90%;
        `;

        const title = document.createElement('h4');
        title.textContent = 'MPN bearbeiten';
        title.style.cssText = 'margin: 0 0 1.5rem 0; font-size: 1.25rem;';
        dialog.appendChild(title);

        // Lese aktuellen MPN-Wert
        const mpnField = getMpnField();
        const currentValue = mpnField ? mpnField.value : '';

        // Container für Button + Input (Flexbox)
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.style.cssText = `
            flex: 1;
            padding: 0.5rem;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 0.9rem;
        `;

        // "_OHNE_" Button
        const ohneButton = document.createElement('button');
        ohneButton.type = 'button';
        ohneButton.textContent = '_OHNE_';
        ohneButton.style.cssText = `
            padding: 0.5rem 1rem;
            border: 1px solid #6c757d;
            border-radius: 4px;
            background: #f8f9fa;
            color: #212529;
            cursor: pointer;
            font-size: 0.9rem;
            white-space: nowrap;
        `;

        ohneButton.addEventListener('click', () => {
            input.value = '_OHNE_';
            input.focus();
            // Trigger input event
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Input-Änderungen -> natives Feld aktualisieren
        input.addEventListener('input', () => {
            updateMpnNativeField(input.value);
        });

        inputContainer.appendChild(input);
        inputContainer.appendChild(ohneButton);
        dialog.appendChild(inputContainer);

        // Verhindere Schließen beim Text-Markieren
        let mouseDownOnOverlay = false;

        overlay.addEventListener('mousedown', (e) => {
            if (e.target === overlay) {
                mouseDownOnOverlay = true;
            }
        });

        overlay.addEventListener('mouseup', (e) => {
            if (e.target === overlay && mouseDownOnOverlay) {
                overlay.remove();
            }
            mouseDownOnOverlay = false;
        });

        dialog.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        dialog.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            mouseDownOnOverlay = false;
        });

        // ESC-Taste schließt Overlay
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Positioniere Dialog an Cursor-Position
        requestAnimationFrame(() => {
            const dialogRect = dialog.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let left = mouseX;
            let top = mouseY;

            // Bounds-Checking
            if (left + dialogRect.width > viewportWidth) {
                left = viewportWidth - dialogRect.width - 20;
            }
            if (left < 0) {
                left = 10;
            }
            if (top + dialogRect.height > viewportHeight) {
                top = viewportHeight - dialogRect.height - 20;
            }
            if (top < 0) {
                top = 10;
            }

            dialog.style.left = left + 'px';
            dialog.style.top = top + 'px';
        });

        // Fokus ins Input-Feld
        input.focus();
        input.select();
    }

    function updateMpnNativeField(value) {
        try {
            const mpnField = getMpnField();
            if (mpnField) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(mpnField, value);
                mpnField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                mpnField.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== HERSTELLERLINK OVERLAY BUTTON =====
    function applyHerstellerlinkOverlayButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.herstellerlinkOverlayButton) return;

            // Finde das Herstellerlink-Formular
            const hlinkForm = document.getElementById('section_form_hlink');
            if (!hlinkForm) return;

            // Finde das h5 Element
            const h5 = hlinkForm.querySelector('h5');
            if (!h5) return;

            // Prüfe ob Button bereits existiert
            if (h5.querySelector('.geizhals-hlink-overlay-btn')) return;

            // Erstelle den Overlay-Button
            const overlayBtn = document.createElement('button');
            overlayBtn.type = 'button';
            overlayBtn.className = 'geizhals-hlink-overlay-btn btn btn-outline-primary btn-sm';
            overlayBtn.textContent = '⤢';
            overlayBtn.style.cssText = `
                margin-left: 0.5rem;
                padding: 0.2rem 0.6rem;
                font-size: 1rem;
                font-weight: 500;
            `;

            overlayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Übergebe Mausposition an Overlay
                openHerstellerlinkOverlay(e.clientX, e.clientY);
            });

            h5.appendChild(overlayBtn);

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function openHerstellerlinkOverlay(mouseX, mouseY) {
        // Hole Settings für Case Converter Button
        const otherSettings = getOtherSettingsConfig();

        // Entferne existierendes Overlay falls vorhanden
        const existingOverlay = document.getElementById('geizhals-hlink-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Erstelle Overlay
        const overlay = document.createElement('div');
        overlay.id = 'geizhals-hlink-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;

        // Erstelle Dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: absolute;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 1040px;
            width: 90%;
        `;

        // Header Container (Titel + Case Converter Button)
        const headerContainer = document.createElement('div');
        headerContainer.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;';

        const title = document.createElement('h4');
        title.textContent = 'Herstellerlinks bearbeiten';
        title.style.cssText = 'margin: 0; font-size: 1.25rem;';
        headerContainer.appendChild(title);

        // Case Converter Button (nur wenn beide Optionen aktiviert)
        if (otherSettings.herstellerlinkCaseButton) {
            const caseBtn = document.createElement('button');
            caseBtn.type = 'button';
            caseBtn.className = 'geizhals-hlink-overlay-case-btn';
            caseBtn.textContent = '🔤';
            caseBtn.title = 'Case Converter';
            caseBtn.style.cssText = `
                padding: 0.2rem 0.6rem;
                font-size: 1rem;
                border: 1px solid #0d6efd;
                border-radius: 3px;
                background: #0d6efd;
                color: white;
                cursor: pointer;
                font-weight: 500;
            `;

            caseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openCaseConverterPanel(e.clientX, e.clientY);
            });

            headerContainer.appendChild(caseBtn);
        }

        dialog.appendChild(headerContainer);

        // Lese aktuelle Werte
        const currentValues = getHerstellerlinkValues();

        // Prüfe ob MLT befüllt ist
        const isMltFilled = !!currentValues.MLT;
        const isDeEnFilled = !!(currentValues.DE || currentValues.EN);

        // Erstelle Eingabefelder
        const languages = ['DE', 'EN', 'MLT'];
        const inputs = {};
        const clearButtonUpdaters = []; // Array für alle Clear-Button Update-Funktionen
        let lastFocusedLang = null; // Track welches Feld zuletzt fokussiert war

        languages.forEach(lang => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.style.cssText = 'margin-bottom: 1rem;';

            const label = document.createElement('label');
            label.textContent = lang;
            label.style.cssText = 'display: block; font-weight: 500; margin-bottom: 0.25rem; font-size: 0.9rem;';

            // Container für Button + Input (Flexbox)
            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';

            // Clear-Button (X)
            const clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.innerHTML = '✕';
            clearButton.style.cssText = `
                width: 32px;
                height: 32px;
                border: 1px solid #dc3545;
                border-radius: 4px;
                background: white;
                color: #dc3545;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                line-height: 1;
                flex-shrink: 0;
            `;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'geizhals-hlink-overlay-input';
            input.value = currentValues[lang] || '';
            input.dataset.lang = lang;
            input.style.cssText = `
                flex: 1;
                padding: 0.5rem;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 0.9rem;
            `;

            // Clear-Button Click-Handler
            clearButton.addEventListener('click', async () => {
                input.value = '';
                // Trigger input event um Synchronisation auszulösen
                input.dispatchEvent(new Event('input', { bubbles: true }));
                updateClearButtonState();
            });

            // Funktion um Clear-Button State zu aktualisieren
            function updateClearButtonState() {
                const hasValue = input.value.trim() !== '';
                if (hasValue && !input.disabled) {
                    clearButton.disabled = false;
                    clearButton.style.opacity = '1';
                    clearButton.style.cursor = 'pointer';
                } else {
                    clearButton.disabled = true;
                    clearButton.style.opacity = '0.3';
                    clearButton.style.cursor = 'not-allowed';
                }
            }

            // Speichere Update-Funktion für späteren Aufruf
            clearButtonUpdaters.push(updateClearButtonState);

            // Initiale Button-State-Aktualisierung
            updateClearButtonState();

            // Deaktiviere Felder basierend auf MLT-Logik
            if (lang === 'MLT' && isDeEnFilled) {
                input.disabled = true;
                input.style.backgroundColor = '#e9ecef';
                input.style.color = '#6c757d';
                input.style.cursor = 'not-allowed';
                input.style.opacity = '1';
            } else if ((lang === 'DE' || lang === 'EN') && isMltFilled) {
                input.disabled = true;
                input.style.backgroundColor = '#e9ecef';
                input.style.color = '#6c757d';
                input.style.cursor = 'not-allowed';
                input.style.opacity = '1';
            }

            // Event Listener für Focus - KEIN Erstellen des nativen Feldes mehr
            input.addEventListener('focus', async () => {
                if (!input.disabled) {
                    // Schließe vorheriges leeres Feld wenn man zu einem anderen wechselt
                    if (lastFocusedLang && lastFocusedLang !== lang) {
                        await closeEmptyNativeField(lastFocusedLang);
                    }

                    // Update lastFocused
                    lastFocusedLang = lang;
                }
            });

            // Event Listener für Input-Änderungen - natives Feld wird HIER erstellt
            input.addEventListener('input', async () => {
                const trimmedValue = input.value.trim();

                // Wenn Feld geleert wurde, klicke den Close-Button
                if (trimmedValue === '') {
                    await clickNativeCloseButton(lang);
                } else {
                    // Erst bei Text-Eingabe: Stelle sicher dass natives Feld existiert
                    await ensureNativeFieldExists(lang);
                    // Übertrage Wert
                    updateHerstellerlinkNativeFields(lang, input.value);
                }

                // Aktualisiere Clear-Button State
                updateClearButtonState();

                // Aktualisiere Disabled-States
                updateOverlayFieldStates();
            });

            inputs[lang] = input;

            // DOM-Struktur aufbauen
            inputContainer.appendChild(clearButton);
            inputContainer.appendChild(input);
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(inputContainer);
            dialog.appendChild(fieldWrapper);
        });

        // Hilfsfunktion: Gibt den korrekten nativen Input-Namen zurück
        // DE/EN bleiben uppercase, MLT wird zu lowercase
        function getNativeInputName(lang) {
            return lang === 'MLT' ? 'hlink_new_mlt' : `hlink_new_${lang}`;
        }

        // Funktion um sicherzustellen dass natives Feld existiert
        async function ensureNativeFieldExists(lang) {
            const hlinkForm = document.getElementById('section_form_hlink');
            if (!hlinkForm) return;

            const inputName = getNativeInputName(lang);
            let nativeInput = hlinkForm.querySelector(`input[name="${inputName}"]`);

            // Wenn Feld nicht existiert, erstelle es durch Button-Klick
            if (!nativeInput) {
                const langButtons = hlinkForm.querySelectorAll('.btn-group button');
                for (const btn of langButtons) {
                    if (btn.textContent.trim() === lang) {
                        btn.click();
                        // Warte bis Feld erstellt wurde
                        await new Promise(resolve => setTimeout(resolve, 150));
                        break;
                    }
                }
            }
        }

        // Funktion um den nativen Close-Button zu klicken (Feld zu entfernen)
        async function clickNativeCloseButton(lang) {
            const hlinkForm = document.getElementById('section_form_hlink');
            if (!hlinkForm) return;

            // Finde das native Input-Feld
            const inputName = getNativeInputName(lang);
            const nativeInput = hlinkForm.querySelector(`input[name="${inputName}"]`);
            if (!nativeInput) return; // Feld existiert nicht, nichts zu tun

            // Finde die input-group (Parent des Input-Feldes)
            const inputGroup = nativeInput.closest('.input-group');
            if (!inputGroup) return;

            // Finde alle Buttons in der input-group
            const buttons = inputGroup.querySelectorAll('button.btn-outline-secondary');

            // Suche den Button mit dem X-Icon
            for (const button of buttons) {
                const xIcon = button.querySelector('svg.bi-x');
                if (xIcon) {
                    button.click();
                    // Warte kurz bis DOM aktualisiert wurde
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return;
                }
            }
        }

        // Funktion um leeres natives Feld zu schließen
        async function closeEmptyNativeField(lang) {
            const hlinkForm = document.getElementById('section_form_hlink');
            if (!hlinkForm) return;

            // Finde das native Input-Feld
            const inputName = getNativeInputName(lang);
            const nativeInput = hlinkForm.querySelector(`input[name="${inputName}"]`);
            if (!nativeInput) return; // Feld existiert nicht

            // Prüfe ob Feld leer ist
            const value = nativeInput.value.trim();
            if (value === '') {
                // Feld ist leer → Close-Button klicken
                await clickNativeCloseButton(lang);
            }
        }

        // Funktion um alle leeren nativen Felder zu schließen
        async function closeAllEmptyNativeFields() {
            for (const lang of languages) {
                await closeEmptyNativeField(lang);
            }
        }

        // Funktion um Field States zu aktualisieren
        function updateOverlayFieldStates() {
            const deValue = inputs.DE.value.trim();
            const enValue = inputs.EN.value.trim();
            const mltValue = inputs.MLT.value.trim();

            const isDeEnFilled = !!(deValue || enValue);
            const isMltFilled = !!mltValue;

            // MLT deaktivieren wenn DE/EN befüllt
            if (isDeEnFilled) {
                inputs.MLT.disabled = true;
                inputs.MLT.style.backgroundColor = '#e9ecef';
                inputs.MLT.style.color = '#6c757d';
                inputs.MLT.style.cursor = 'not-allowed';
                inputs.MLT.style.opacity = '1';
            } else {
                inputs.MLT.disabled = false;
                inputs.MLT.style.backgroundColor = 'white';
                inputs.MLT.style.color = '#212529';
                inputs.MLT.style.cursor = 'text';
                inputs.MLT.style.opacity = '1';
            }

            // DE/EN deaktivieren wenn MLT befüllt
            if (isMltFilled) {
                inputs.DE.disabled = true;
                inputs.EN.disabled = true;
                inputs.DE.style.backgroundColor = '#e9ecef';
                inputs.EN.style.backgroundColor = '#e9ecef';
                inputs.DE.style.color = '#6c757d';
                inputs.EN.style.color = '#6c757d';
                inputs.DE.style.cursor = 'not-allowed';
                inputs.EN.style.cursor = 'not-allowed';
                inputs.DE.style.opacity = '1';
                inputs.EN.style.opacity = '1';
            } else {
                inputs.DE.disabled = false;
                inputs.EN.disabled = false;
                inputs.DE.style.backgroundColor = 'white';
                inputs.EN.style.backgroundColor = 'white';
                inputs.DE.style.color = '#212529';
                inputs.EN.style.color = '#212529';
                inputs.DE.style.cursor = 'text';
                inputs.EN.style.cursor = 'text';
                inputs.DE.style.opacity = '1';
                inputs.EN.style.opacity = '1';
            }

            // Aktualisiere alle Clear-Button States
            clearButtonUpdaters.forEach(updater => updater());
        }

        // FIX 1: Verhindere Schließen beim Text-Markieren
        let mouseDownOnOverlay = false;

        overlay.addEventListener('mousedown', (e) => {
            if (e.target === overlay) {
                mouseDownOnOverlay = true;
            }
        });

        overlay.addEventListener('mouseup', async (e) => {
            // Nur schließen wenn mousedown UND mouseup auf overlay passiert sind
            if (e.target === overlay && mouseDownOnOverlay) {
                // Schließe alle leeren nativen Felder vor dem Overlay-Close
                await closeAllEmptyNativeFields();
                overlay.remove();
            }
            mouseDownOnOverlay = false;
        });

        // Dialog-Klicks nicht propagieren
        dialog.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Dialog-Mousedown nicht propagieren (verhindert Tracking)
        dialog.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            mouseDownOnOverlay = false;
        });

        // ESC-Taste schließt Overlay
        const escHandler = async (e) => {
            if (e.key === 'Escape') {
                await closeAllEmptyNativeFields();
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // FIX 3: Positioniere Dialog an Cursor-Position
        // Setze Position nach dem Append, damit Größe bekannt ist
        requestAnimationFrame(() => {
            const dialogRect = dialog.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Position mit Bounds-Checking (damit Dialog nicht aus Viewport ragt)
            let left = mouseX;
            let top = mouseY;

            // Rechts-Check
            if (left + dialogRect.width > viewportWidth) {
                left = viewportWidth - dialogRect.width - 20;
            }
            // Links-Check
            if (left < 0) {
                left = 10;
            }

            // Unten-Check
            if (top + dialogRect.height > viewportHeight) {
                top = viewportHeight - dialogRect.height - 20;
            }
            // Oben-Check
            if (top < 0) {
                top = 10;
            }

            dialog.style.left = left + 'px';
            dialog.style.top = top + 'px';
        });

        // KEIN Auto-Focus mehr - würde natives Feld erstellen
        // User klickt selbst ins gewünschte Feld
    }

    function updateHerstellerlinkNativeFields(lang, value) {
        try {
            const hlinkForm = document.getElementById('section_form_hlink');
            if (!hlinkForm) return;

            // Finde das native Input-Feld (sollte durch ensureNativeFieldExists bereits existieren)
            // MLT verwendet lowercase, DE/EN uppercase
            const inputName = lang === 'MLT' ? 'hlink_new_mlt' : `hlink_new_${lang}`;
            const nativeInput = hlinkForm.querySelector(`input[name="${inputName}"]`);

            // Wenn Feld existiert, setze den Wert
            if (nativeInput) {
                setInputValue(nativeInput, value);
            }

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function setInputValue(input, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    }

    // ===== HERSTELLERLINK CASE CONVERTER BUTTON =====
    function applyHerstellerlinkCaseButton() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Finde das Herstellerlink-Formular
            const hlinkForm = document.getElementById('section_form_hlink');
            if (!hlinkForm) return;

            // Finde das h5 Element
            const h5 = hlinkForm.querySelector('h5');
            if (!h5) return;

            // Entferne existierenden Button
            const existingBtn = h5.querySelector('.geizhals-hlink-case-btn');
            if (existingBtn) existingBtn.remove();

            // Wenn deaktiviert, nicht neu erstellen
            if (!otherSettings.herstellerlinkCaseButton) return;

            // Erstelle den Case Converter Button
            const caseBtn = document.createElement('button');
            caseBtn.type = 'button';
            caseBtn.className = 'geizhals-hlink-case-btn btn btn-outline-primary btn-sm';
            caseBtn.textContent = '🔤';
            caseBtn.title = 'Case Converter';
            caseBtn.style.cssText = `
                margin-left: 0.5rem;
                padding: 0.2rem 0.6rem;
                font-size: 1rem;
                font-weight: 500;
            `;

            caseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openCaseConverterPanel(e.clientX, e.clientY);
            });

            h5.appendChild(caseBtn);

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function openCaseConverterPanel(mouseX, mouseY) {
        // Entferne existierendes Panel falls vorhanden
        const existingPanel = document.getElementById('geizhals-case-converter-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Erstelle Overlay
        const overlay = document.createElement('div');
        overlay.id = 'geizhals-case-converter-panel';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;

        // Erstelle Dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: absolute;
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 90%;
        `;

        // Titel
        const title = document.createElement('h4');
        title.textContent = 'Case Converter';
        title.style.cssText = 'margin: 0 0 1rem 0; font-size: 1.25rem;';
        dialog.appendChild(title);

        // Container für Eingabe und Buttons
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 1rem;';

        // Eingabefeld
        const inputField = document.createElement('textarea');
        inputField.placeholder = 'Text eingeben...';
        inputField.style.cssText = `
            flex: 1;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.95rem;
            resize: vertical;
            min-height: 60px;
        `;

        // Button Container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';

        // Lower Case Button
        const lowerBtn = document.createElement('button');
        lowerBtn.type = 'button';
        lowerBtn.textContent = 'lower case';
        lowerBtn.disabled = true;
        lowerBtn.style.cssText = `
            padding: 0.5rem 1rem;
            border: 1px solid #6c757d;
            border-radius: 4px;
            background: #e9ecef;
            color: #6c757d;
            cursor: not-allowed;
            font-size: 0.875rem;
            white-space: nowrap;
        `;

        // Upper Case Button
        const upperBtn = document.createElement('button');
        upperBtn.type = 'button';
        upperBtn.textContent = 'UPPER CASE';
        upperBtn.disabled = true;
        upperBtn.style.cssText = `
            padding: 0.5rem 1rem;
            border: 1px solid #6c757d;
            border-radius: 4px;
            background: #e9ecef;
            color: #6c757d;
            cursor: not-allowed;
            font-size: 0.875rem;
            white-space: nowrap;
        `;

        // Funktion um Button-Status zu aktualisieren
        function updateButtonStates() {
            const hasText = inputField.value.trim().length > 0;
            if (hasText) {
                lowerBtn.disabled = false;
                lowerBtn.style.cssText = `
                    padding: 0.5rem 1rem;
                    border: 1px solid #0d6efd;
                    border-radius: 4px;
                    background: #0d6efd;
                    color: white;
                    cursor: pointer;
                    font-size: 0.875rem;
                    white-space: nowrap;
                `;
                upperBtn.disabled = false;
                upperBtn.style.cssText = `
                    padding: 0.5rem 1rem;
                    border: 1px solid #0d6efd;
                    border-radius: 4px;
                    background: #0d6efd;
                    color: white;
                    cursor: pointer;
                    font-size: 0.875rem;
                    white-space: nowrap;
                `;
            } else {
                lowerBtn.disabled = true;
                lowerBtn.style.cssText = `
                    padding: 0.5rem 1rem;
                    border: 1px solid #6c757d;
                    border-radius: 4px;
                    background: #e9ecef;
                    color: #6c757d;
                    cursor: not-allowed;
                    font-size: 0.875rem;
                    white-space: nowrap;
                `;
                upperBtn.disabled = true;
                upperBtn.style.cssText = `
                    padding: 0.5rem 1rem;
                    border: 1px solid #6c757d;
                    border-radius: 4px;
                    background: #e9ecef;
                    color: #6c757d;
                    cursor: not-allowed;
                    font-size: 0.875rem;
                    white-space: nowrap;
                `;
            }
        }

        // Input Event Listener
        inputField.addEventListener('input', updateButtonStates);

        // Label für Ausgabe
        const outputLabel = document.createElement('label');
        outputLabel.textContent = 'Ergebnis:';
        outputLabel.style.cssText = 'display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem;';

        // Ausgabefeld
        const outputField = document.createElement('textarea');
        outputField.readOnly = true;
        outputField.placeholder = 'Konvertierter Text erscheint hier...';
        outputField.style.cssText = `
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.95rem;
            resize: vertical;
            min-height: 60px;
            background: #f8f9fa;
            box-sizing: border-box;
        `;

        // Lower Case Click Handler
        lowerBtn.addEventListener('click', () => {
            if (inputField.value.trim()) {
                outputField.value = inputField.value.toLowerCase();
            }
        });

        // Upper Case Click Handler
        upperBtn.addEventListener('click', () => {
            if (inputField.value.trim()) {
                outputField.value = inputField.value.toUpperCase();
            }
        });

        // Elemente zusammenbauen
        buttonContainer.appendChild(lowerBtn);
        buttonContainer.appendChild(upperBtn);
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(buttonContainer);
        dialog.appendChild(inputContainer);
        dialog.appendChild(outputLabel);
        dialog.appendChild(outputField);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Positioniere Dialog
        const dialogRect = dialog.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = mouseX - dialogRect.width / 2;
        let top = mouseY - 50;

        // Stelle sicher, dass Dialog im Viewport bleibt
        if (left < 20) left = 20;
        if (left + dialogRect.width > viewportWidth - 20) left = viewportWidth - dialogRect.width - 20;
        if (top < 20) top = 20;
        if (top + dialogRect.height > viewportHeight - 20) top = viewportHeight - dialogRect.height - 20;

        dialog.style.left = left + 'px';
        dialog.style.top = top + 'px';

        // Click-Outside schließt Panel (aber nicht beim Textmarkieren)
        let mouseDownOnOverlay = false;

        overlay.addEventListener('mousedown', (e) => {
            // Nur merken wenn mousedown direkt auf dem Overlay war (nicht im Dialog)
            mouseDownOnOverlay = (e.target === overlay);
        });

        overlay.addEventListener('click', (e) => {
            // Nur schließen wenn sowohl mousedown als auch click auf dem Overlay waren
            // Das verhindert Schließen beim Textmarkieren (wo mousedown im Dialog ist)
            if (e.target === overlay && mouseDownOnOverlay) {
                overlay.remove();
            }
        });

        // Fokus auf Eingabefeld
        inputField.focus();
    }

    // ===== MATCHRULE CONTAINER REORDER =====
    function applyMatchruleContainerReorder() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Finde das Matchrule-Formular
            const matchruleForm = document.getElementById('section_form_matchrule');
            if (!matchruleForm) return;

            // Wenn ein Klon-Prozess läuft, warte bis er abgeschlossen ist
            const clonePending = sessionStorage.getItem('geizhals-clone-pending-paste');
            if (clonePending) {
                // Versuche es später nochmal (längerer Timeout)
                setTimeout(() => applyMatchruleContainerReorder(), 800);
                return;
            }

            // Finde den flex Container mit den Controls
            const flexContainer = matchruleForm.querySelector('.d-flex.align-items-start.gap-2');
            if (!flexContainer) return;

            // Finde das Input-Element ODER die bereits existierende Textarea
            let matchruleInput = matchruleForm.querySelector('input[name="matchrule"]');
            const existingTextarea = matchruleForm.querySelector('textarea[name="matchrule"]');

            // Wenn bereits eine Textarea existiert (von uns erstellt), verwende deren Wert
            if (existingTextarea && !matchruleInput) {
                // Bereits modifiziert, nichts tun
                return;
            }

            if (!matchruleInput) return;

            // Finde das h5 Element mit dem Matchrule-Link
            const h5 = matchruleForm.querySelector('h5.pt-1.mb-0');

            // Wenn Option deaktiviert ist, stelle Original wieder her
            if (!otherSettings.matchruleContainerReorder) {
                // Prüfe ob wir modifiziert haben
                const reorderedContainer = matchruleForm.querySelector('.geizhals-matchrule-reordered');
                if (!reorderedContainer) return;

                // Finde die Textarea (falls vorhanden)
                const textarea = reorderedContainer.querySelector('textarea[name="matchrule"]');
                if (textarea) {
                    // Entferne Observer und Event-Listener
                    if (textarea._geizhalsResizeObserver) {
                        textarea._geizhalsResizeObserver.disconnect();
                        textarea._geizhalsResizeObserver = null;
                    }
                    if (textarea._geizhalsInputHandler) {
                        textarea.removeEventListener('input', textarea._geizhalsInputHandler);
                        textarea._geizhalsInputHandler = null;
                    }
                }

                // Entferne Toggle-Button aus h5
                if (h5) {
                    const existingBtn = h5.querySelector('.geizhals-matchrule-toggle-btn');
                    if (existingBtn) existingBtn.remove();
                }

                // Seite neu laden ist der einfachste Weg das Original wiederherzustellen
                // Da dieses Feature selten umgeschaltet wird, ist das akzeptabel
                location.reload();
                return;
            }

            // Prüfe ob bereits modifiziert
            if (matchruleForm.querySelector('.geizhals-matchrule-reordered')) return;

            // Finde alle Elemente die wir verschieben müssen
            const inputWrapper = matchruleInput.closest('.w-100'); // Das div das nur den Input enthält
            const testButton = flexContainer.querySelector('a[role="button"][href*="rulematcher"]');
            const prioContainer = flexContainer.querySelector('.d-flex.gap-2.align-items-center');
            const preislimitContainer = flexContainer.querySelector('.input-group');

            if (!inputWrapper) return;

            // Speichere den ursprünglichen Wert
            // Prüfe auch sessionStorage falls ein Klon-Wert noch nicht ins Input übernommen wurde
            let originalValue = matchruleInput.value;
            const sessionMatchrule = sessionStorage.getItem('geizhals-clone-matchrule-value');
            if (sessionMatchrule && (!originalValue || originalValue.trim() === '')) {
                originalValue = sessionMatchrule;
            }
            // Lösche den sessionStorage-Key nachdem er verwendet wurde
            if (sessionMatchrule) {
                sessionStorage.removeItem('geizhals-clone-matchrule-value');
            }

            // Höhe für kollabiertes Feld (ca. 5 Zeilen, wie bei Hinweisfeld)
            const collapsedHeight = 180;

            // Erstelle neues Layout-Container
            const reorderedContainer = document.createElement('div');
            reorderedContainer.className = 'geizhals-matchrule-reordered';
            reorderedContainer.style.cssText = 'width: 100%;';

            // Erste Zeile: Textarea (volle Breite)
            const row1 = document.createElement('div');
            row1.className = 'd-flex align-items-start';
            row1.style.cssText = 'width: 100%; margin-bottom: 0.5rem;';

            // Erstelle Textarea statt Input
            const textarea = document.createElement('textarea');
            textarea.className = matchruleInput.className;
            textarea.name = 'matchrule';
            textarea.style.cssText = 'width: 100%; min-height: 31px; resize: vertical;';

            // Baue erste Zeile
            row1.appendChild(textarea);

            // Zweite Zeile: Controls rechtsbündig
            const row2 = document.createElement('div');
            row2.className = 'd-flex justify-content-end gap-2 align-items-center';
            row2.style.cssText = 'width: 100%;';

            // Verschiebe Controls in die zweite Zeile
            if (testButton) row2.appendChild(testButton);
            if (prioContainer) row2.appendChild(prioContainer);
            if (preislimitContainer) row2.appendChild(preislimitContainer);

            // Baue reordered Container zusammen
            reorderedContainer.appendChild(row1);
            reorderedContainer.appendChild(row2);

            // Ersetze den Original flex-Container Inhalt
            const outerW100 = flexContainer.parentElement;
            outerW100.innerHTML = '';
            outerW100.appendChild(reorderedContainer);

            // Setze den Wert nach dem Einfügen ins DOM mit nativem Setter und Events
            if (originalValue) {
                const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
                    HTMLTextAreaElement.prototype, 'value'
                ).set;
                nativeTextareaSetter.call(textarea, originalValue);
                textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            }

            // Prüfe ob Inhalt groß genug ist um kollabiert zu werden
            // scrollHeight gibt die tatsächliche Inhaltshöhe an
            const needsCollapse = textarea.scrollHeight > collapsedHeight;

            // Wenn kein Kollabieren nötig, keinen Button hinzufügen
            if (!needsCollapse || !h5) {
                return;
            }

            // Erstelle Toggle-Button (wie bei Hinweisfeld)
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'geizhals-matchrule-toggle-btn';
            toggleButton.textContent = 'Expandieren';
            toggleButton.style.cssText = `
                margin-left: 0.5rem;
                padding: 0.1rem 0.4rem;
                font-size: 0.7rem;
                border: 1px solid #ccc;
                border-radius: 3px;
                background: white;
                cursor: pointer;
                color: #666;
                display: inline-block;
                vertical-align: middle;
                width: 70px;
                text-align: center;
            `;

            // Initial kollabieren
            textarea.style.height = collapsedHeight + 'px';
            textarea.dataset.geizhalsgCollapsed = 'true';

            // Toggle-Funktionalität
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isCollapsed = textarea.dataset.geizhalsgCollapsed === 'true';

                if (isCollapsed) {
                    // Expandieren - setze Höhe auf scrollHeight
                    textarea.style.height = textarea.scrollHeight + 'px';
                    textarea.dataset.geizhalsgCollapsed = 'false';
                    toggleButton.textContent = 'Reduzieren';
                } else {
                    // Kollabieren - setze Höhe auf collapsedHeight
                    textarea.style.height = collapsedHeight + 'px';
                    textarea.dataset.geizhalsgCollapsed = 'true';
                    toggleButton.textContent = 'Expandieren';
                }
            });

            // Füge Button zum h5 hinzu (neben dem Matchrule-Link)
            h5.appendChild(toggleButton);

        } catch (e) {
            // Fehler ignorieren
        }
    }


    // ===== BEZEICHNUNG KV HINWEIS ENTFERNEN =====
    function applyBezeichnungKvHinweisEntfernen() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Finde das Bezeichnung-Formular
            const bezeichnungForm = document.querySelector('form#section_form_bezeichnung');
            if (!bezeichnungForm) return;

            // Finde das small-Element mit dem Kommentar
            const smallElement = bezeichnungForm.querySelector('small.d-flex');
            if (!smallElement) return;

            // Prüfe ob der Text "Bezeichnung wird über KV generiert" enthält
            const textContent = smallElement.textContent || '';
            const containsKvHinweis = textContent.includes('Bezeichnung wird über KV generiert');

            if (!containsKvHinweis) return;

            if (otherSettings.bezeichnungKvHinweisEntfernen) {
                // Verstecke das Element
                smallElement.style.display = 'none';
                smallElement.dataset.geizhalsHidden = 'true';
            } else {
                // Zeige das Element wieder an, falls es vorher versteckt war
                if (smallElement.dataset.geizhalsHidden === 'true') {
                    smallElement.style.display = '';
                    delete smallElement.dataset.geizhalsHidden;
                }
            }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== APPLY LINKS COUNT DISPLAY =====
    let linksCountDisplayRunning = false;
    function applyLinksCountDisplay() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Finde die Links-Sektion
            const linksForm = document.getElementById('section_form_links');
            if (!linksForm) return;

            // Wenn deaktiviert, entferne vorhandene Count-Anzeigen
            if (!otherSettings.linksCountDisplay) {
                const existingCounts = linksForm.querySelectorAll('.geizhals-link-count');
                existingCounts.forEach(el => el.remove());
                return;
            }

            // Prüfe ob bereits läuft
            if (linksCountDisplayRunning) return;

            // Finde alle Bleistift-Links in der Tabelle
            const pencilLinks = linksForm.querySelectorAll('a[href*="kalif/artikel/link?id="]');
            if (pencilLinks.length === 0) return;

            // Prüfe ob bereits alle Counts geladen wurden
            const existingCounts = linksForm.querySelectorAll('.geizhals-link-count');
            if (existingCounts.length >= pencilLinks.length) return;

            linksCountDisplayRunning = true;

            // Für jeden Link die Anzahl der Verlinkungen laden
            let pendingLoads = pencilLinks.length;

            const finishAllLoads = () => {
                pendingLoads--;
                if (pendingLoads <= 0) linksCountDisplayRunning = false;
            };

            pencilLinks.forEach((link, index) => {
                // Prüfe ob für diesen Link bereits ein Count existiert
                if (link.parentElement.querySelector('.geizhals-link-count')) {
                    finishAllLoads();
                    return;
                }

                const url = link.href;

                // Erstelle iframe - muss JavaScript ausführen können für React-SPA
                const iframe = document.createElement('iframe');
                iframe.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 800px; height: 600px; visibility: hidden;';
                iframe.src = url;

                let checkCount = 0;
                const maxChecks = 50; // Max 5 Sekunden warten (50 x 100ms)

                const checkForContent = () => {
                    checkCount++;
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // Suche nach "Artikelauswahl (X)"
                        const h5Elements = iframeDoc.querySelectorAll('h5');
                        let count = null;

                        for (const h5 of h5Elements) {
                            const text = h5.textContent || '';
                            const match = text.match(/Artikelauswahl\s*\((\d+)\)/);
                            if (match) {
                                count = match[1];
                                break;
                            }
                        }

                        if (count !== null) {
                            // Füge die Anzahl neben dem Bleistift-Icon ein
                            const countSpan = document.createElement('span');
                            countSpan.className = 'geizhals-link-count';
                            countSpan.textContent = `(${count})`;
                            countSpan.style.cssText = 'margin-left: 2px; font-size: 0.85em; color: #666;';

                            // Prüfe ob bereits eingefügt und mache Parent nowrap + dynamische Breite
                            if (!link.parentElement.querySelector('.geizhals-link-count')) {
                                link.parentElement.style.whiteSpace = 'nowrap';
                                link.parentElement.style.width = 'auto';
                                link.parentElement.appendChild(countSpan);
                            }

                            iframe.remove();
                            finishAllLoads();
                        } else if (checkCount < maxChecks) {
                            // Noch nicht gefunden, nochmal prüfen
                            setTimeout(checkForContent, 100);
                        } else {
                            iframe.remove();
                            finishAllLoads();
                        }
                    } catch (e) {
                        if (checkCount < maxChecks) {
                            setTimeout(checkForContent, 100);
                        } else {
                            iframe.remove();
                            finishAllLoads();
                        }
                    }
                };

                iframe.onload = () => {
                    // Warte kurz damit React rendern kann
                    setTimeout(checkForContent, 200);
                };

                iframe.onerror = () => {
                    iframe.remove();
                    finishAllLoads();
                };

                document.body.appendChild(iframe);
            });

        } catch (e) {
            linksCountDisplayRunning = false;
        }
    }

    // ===== APPLY LINKS ADD ARTICLE IDS =====
    function applyLinksAddArticleIds() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Finde die Links-Sektion
            const linksForm = document.getElementById('section_form_links');
            if (!linksForm) return;

            // Entferne vorhandenen Button
            const existingButton = linksForm.querySelector('.geizhals-add-article-ids-btn');
            if (existingButton) existingButton.remove();

            if (!otherSettings.linksAddArticleIds) return;

            // Finde den Header
            const header = linksForm.querySelector('h5.pt-1.mb-0');
            if (!header) return;

            // Finde den übergeordneten flex-Container und die Button-Gruppe
            const headerContainer = header.parentElement;
            const btnGroup = headerContainer ? headerContainer.querySelector('.section__header__buttons') : null;

            // Erstelle Button
            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.className = 'geizhals-add-article-ids-btn btn btn-outline-primary btn-sm';
            addButton.textContent = 'Artikel-ID(s) nachtragen';
            addButton.style.cssText = 'font-size: 0.85rem; padding: 0.2rem 0.6rem; margin-right: 0.5rem;';

            addButton.addEventListener('click', () => {
                openAddArticleIdsOverlay();
            });

            // Füge Button vor der Button-Gruppe ein (rechtsbündig)
            if (btnGroup) {
                btnGroup.parentElement.insertBefore(addButton, btnGroup);
            } else {
                header.appendChild(addButton);
            }

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function applyTitlebarDatasheets() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Entferne existierenden Container
            const existingContainer = document.querySelector('.geizhals-datasheet-favicons');
            if (existingContainer) existingContainer.remove();

            if (!otherSettings.titlebarDatasheets) {
                return;
            }

            // Prüfe ob wir auf der richtigen URL sind (nur ?id=<id>, nicht mode= oder clone=)
            const url = new URL(window.location.href);
            if (!url.pathname.endsWith('/kalif/artikel')) return;

            const params = url.searchParams;
            const hasId = params.has('id');
            const hasMode = params.has('mode');
            const hasClone = params.has('clone') || params.has('clone_id');

            // Nur wenn id vorhanden und kein mode/clone Parameter
            if (!hasId || hasMode || hasClone) return;

            // Finde den Datenblatt-Bereich
            const datasheetContainers = document.querySelectorAll('div.d-flex.flex-wrap.justify-content-between.gap-0.border');
            if (datasheetContainers.length === 0) return;

            // Suche nach dem Container mit "Datenblatt" als strong-Element
            let datasheetSection = null;
            datasheetContainers.forEach(container => {
                const strongElements = container.querySelectorAll('strong');
                strongElements.forEach(strong => {
                    if (strong.textContent === 'Datenblatt') {
                        datasheetSection = strong.closest('div.px-1');
                    }
                });
            });

            if (!datasheetSection) return;

            // Finde alle Links im Datenblatt-Bereich
            const datasheetLinks = datasheetSection.querySelectorAll('a[href*="gzhls.at/blob/ldb"]');
            if (datasheetLinks.length === 0) return;

            // Finde die Titelleiste
            const headbar = document.querySelector('.pane__headbar');
            if (!headbar) return;

            const navbarNav = headbar.querySelector('.navbar-nav');
            if (!navbarNav) return;

            // Erstelle Container für die Favicons
            const faviconContainer = document.createElement('div');
            faviconContainer.className = 'geizhals-datasheet-favicons';
            faviconContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 4px;
                margin-right: 0.5rem;
            `;

            // Label
            const label = document.createElement('span');
            label.textContent = 'Datenblätter:';
            label.style.cssText = 'font-size: 0.75rem; color: #fff; margin-right: 2px;';
            faviconContainer.appendChild(label);

            // Erstelle Favicons für jeden Datenblatt-Link
            datasheetLinks.forEach(link => {
                // Finde das Flaggen-Icon im Link
                const flagImg = link.querySelector('img');
                if (!flagImg) return;

                const faviconLink = document.createElement('a');
                faviconLink.href = link.href;
                faviconLink.target = '_blank';
                faviconLink.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 14px;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                    background: white;
                    cursor: pointer;
                    transition: border-color 0.2s;
                `;
                faviconLink.title = 'Datenblatt öffnen';

                // Klone das Flaggen-Icon
                const flagClone = flagImg.cloneNode(true);
                flagClone.style.cssText = 'display: block; height: 10px; width: auto;';
                flagClone.removeAttribute('data-doubleclick-listener');

                faviconLink.appendChild(flagClone);

                faviconLink.addEventListener('mouseenter', () => {
                    faviconLink.style.borderColor = '#0d6efd';
                });
                faviconLink.addEventListener('mouseleave', () => {
                    faviconLink.style.borderColor = '#ccc';
                });

                faviconContainer.appendChild(faviconLink);
            });

            // Füge Container am Anfang der navbar-nav ein
            navbarNav.insertBefore(faviconContainer, navbarNav.firstChild);

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function openAddArticleIdsOverlay() {
        // Entferne vorhandenes Overlay falls vorhanden
        const existingOverlay = document.getElementById('geizhals-add-article-ids-overlay');
        if (existingOverlay) existingOverlay.remove();
        const existingBackdrop = document.getElementById('geizhals-add-article-ids-backdrop');
        if (existingBackdrop) existingBackdrop.remove();

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'geizhals-add-article-ids-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999998;
        `;

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'geizhals-add-article-ids-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            z-index: 9999999;
            min-width: 400px;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        overlay.innerHTML = `
            <h5 style="margin: 0 0 1rem 0; border-bottom: 2px solid #0d6efd; padding-bottom: 0.5rem;">Artikel-ID(s) nachtragen</h5>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Artikel-ID(s) eingeben:</label>
                <input type="text" id="geizhals-article-ids-input" placeholder="z.B. 123456 oder 123456 123457 123458" style="
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 0.95rem;
                ">
                <small style="color: #666; display: block; margin-top: 0.25rem;">Mehrere IDs mit Leerzeichen trennen</small>
            </div>
            <div id="geizhals-article-ids-status" style="display: none; margin-bottom: 1rem; padding: 0.75rem; background: #f8f9fa; border-radius: 4px;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                    <span id="geizhals-article-ids-status-text">Verarbeite...</span>
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button type="button" id="geizhals-article-ids-cancel" class="btn btn-secondary btn-sm">Abbrechen</button>
                <button type="button" id="geizhals-article-ids-save" class="btn btn-primary btn-sm" disabled>Speichern</button>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(overlay);

        const input = overlay.querySelector('#geizhals-article-ids-input');
        const saveButton = overlay.querySelector('#geizhals-article-ids-save');
        const cancelButton = overlay.querySelector('#geizhals-article-ids-cancel');
        const statusDiv = overlay.querySelector('#geizhals-article-ids-status');
        const statusText = overlay.querySelector('#geizhals-article-ids-status-text');

        // Validierung
        const validateInput = () => {
            const value = input.value.trim();
            if (!value) {
                saveButton.disabled = true;
                return false;
            }
            // Prüfe ob nur Zahlen und Leerzeichen
            const isValid = /^(\d+)(\s+\d+)*$/.test(value);
            saveButton.disabled = !isValid;
            return isValid;
        };

        input.addEventListener('input', validateInput);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && validateInput()) {
                saveButton.click();
            }
        });

        // Abbrechen
        const closeOverlay = () => {
            overlay.remove();
            backdrop.remove();
        };

        cancelButton.addEventListener('click', closeOverlay);
        backdrop.addEventListener('click', closeOverlay);

        // Speichern
        saveButton.addEventListener('click', async () => {
            const ids = input.value.trim().split(/\s+/).filter(id => id);
            if (ids.length === 0) return;

            // Deaktiviere Buttons
            saveButton.disabled = true;
            cancelButton.disabled = true;
            input.disabled = true;

            // Zeige Status
            statusDiv.style.display = 'block';

            // Finde alle Bleistift-Links
            const linksForm = document.getElementById('section_form_links');
            const pencilLinks = linksForm ? linksForm.querySelectorAll('a[href*="kalif/artikel/link?id="]') : [];

            if (pencilLinks.length === 0) {
                statusText.textContent = 'Keine Links gefunden!';
                setTimeout(closeOverlay, 2000);
                return;
            }

            const totalLinks = pencilLinks.length;
            let processedLinks = 0;

            // Verarbeite alle Links sequentiell
            for (const link of pencilLinks) {
                processedLinks++;
                statusText.textContent = `Link ${processedLinks}/${totalLinks} wird verarbeitet...`;

                try {
                    await processLinkWithIds(link.href, ids);
                    statusText.textContent = `Link ${processedLinks}/${totalLinks} gespeichert`;
                } catch (e) {
                    statusText.textContent = `Link ${processedLinks}/${totalLinks} - Fehler`;
                }

                // Kurze Pause zwischen den Links
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            statusText.textContent = `Fertig! ${totalLinks} Links verarbeitet.`;

            // Schließe Overlay nach kurzer Pause
            setTimeout(closeOverlay, 1500);
        });

        // Fokus auf Input
        input.focus();
    }

    function processLinkWithIds(url, ids) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 1200px; height: 800px; visibility: hidden;';
            iframe.src = url;

            let checkCount = 0;
            const maxChecks = 100; // Max 10 Sekunden warten

            const checkForReactSelect = () => {
                checkCount++;
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeWin = iframe.contentWindow;

                    // Suche nach dem React-Select Input für "Einen Artikel oder mehrere (mit IDs) hinzufügen"
                    let reactSelectInput = null;
                    let container = null;

                    // Finde das richtige React-Select (das mit "Einen Artikel oder mehrere")
                    const allPlaceholders = iframeDoc.querySelectorAll('div[id$="-placeholder"]');

                    for (const ph of allPlaceholders) {
                        if (ph.textContent && ph.textContent.includes('Artikel oder mehrere')) {
                            container = ph.closest('.css-b62m3t-container');
                            if (container) {
                                reactSelectInput = container.querySelector('input[role="combobox"]');
                                break;
                            }
                        }
                    }

                    if (reactSelectInput) {
                        // IDs als String vorbereiten
                        const idsString = ids.join(' ');

                        // Klicke auf den Container um das Dropdown zu öffnen
                        const controlDiv = container.querySelector('[class*="-control"]');

                        if (controlDiv) {
                            controlDiv.dispatchEvent(new iframeWin.MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                        }

                        setTimeout(() => {
                            // Fokussiere das Input
                            reactSelectInput.focus();

                            // Methode 1: Native value setter für React-Inputs (funktioniert in Chrome und Firefox)
                            try {
                                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(iframeWin.HTMLInputElement.prototype, 'value').set;
                                nativeInputValueSetter.call(reactSelectInput, idsString);
                            } catch (e) {
                                // Fallback: Direktes Setzen
                                reactSelectInput.value = idsString;
                            }

                            // Feuere Input-Event für React (verschiedene Varianten für Browser-Kompatibilität)
                            try {
                                // Versuche InputEvent (moderner)
                                const inputEvent = new iframeWin.InputEvent('input', {
                                    bubbles: true,
                                    cancelable: true,
                                    inputType: 'insertText',
                                    data: idsString
                                });
                                reactSelectInput.dispatchEvent(inputEvent);
                            } catch (e) {
                                // Fallback: Standard Event
                                const event = new iframeWin.Event('input', { bubbles: true });
                                reactSelectInput.dispatchEvent(event);
                            }

                            // Zusätzlich Change-Event (manche React-Komponenten brauchen das)
                            try {
                                const changeEvent = new iframeWin.Event('change', { bubbles: true });
                                reactSelectInput.dispatchEvent(changeEvent);
                            } catch (e) {}

                            // Methode 2: Simuliere Tastatureingabe (Fallback für React-Select)
                            // React-Select verwendet onInputChange, das auf Keyboard-Events reagiert
                            setTimeout(() => {
                                // Setze nochmals den Wert
                                try {
                                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(iframeWin.HTMLInputElement.prototype, 'value').set;
                                    nativeInputValueSetter.call(reactSelectInput, idsString);
                                } catch (e) {
                                    reactSelectInput.value = idsString;
                                }

                                // Feuere Events erneut
                                reactSelectInput.dispatchEvent(new iframeWin.Event('input', { bubbles: true }));
                                reactSelectInput.dispatchEvent(new iframeWin.Event('change', { bubbles: true }));

                                // Simuliere keydown/keyup für das letzte Zeichen
                                const lastChar = idsString.slice(-1);
                                reactSelectInput.dispatchEvent(new iframeWin.KeyboardEvent('keydown', {
                                    key: lastChar,
                                    bubbles: true,
                                    cancelable: true
                                }));
                                reactSelectInput.dispatchEvent(new iframeWin.KeyboardEvent('keyup', {
                                    key: lastChar,
                                    bubbles: true,
                                    cancelable: true
                                }));
                            }, 100);

                            // Delay basierend auf Anzahl der IDs
                            const delay = Math.max(2000, ids.length * 400);

                            setTimeout(() => {
                                // Enter drücken um die IDs zu übernehmen
                                reactSelectInput.dispatchEvent(new iframeWin.KeyboardEvent('keydown', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    keyCode: 13,
                                    which: 13,
                                    bubbles: true,
                                    cancelable: true
                                }));

                                // Warte und prüfe ob Speichern-Button aktiviert wurde
                                let saveCheckCount = 0;
                                const maxSaveChecks = 50;

                                const checkSaveButton = () => {
                                    saveCheckCount++;
                                    // Finde den richtigen Speichern-Button in der expanded-actions Toolbar
                                    const expandedActions = iframeDoc.querySelector('.expanded-actions');
                                    const saveButton = expandedActions ? expandedActions.querySelector('button.btn-success:not([disabled])') : null;

                                    if (saveButton) {
                                        saveButton.click();
                                        setTimeout(() => {
                                            iframe.remove();
                                            resolve();
                                        }, 1500);
                                    } else if (saveCheckCount < maxSaveChecks) {
                                        setTimeout(checkSaveButton, 100);
                                    } else {
                                        iframe.remove();
                                        resolve();
                                    }
                                };

                                setTimeout(checkSaveButton, 500);
                            }, delay);
                        }, 300);

                    } else if (checkCount < maxChecks) {
                        setTimeout(checkForReactSelect, 100);
                    } else {
                        iframe.remove();
                        reject(new Error('Timeout'));
                    }
                } catch (e) {
                    if (checkCount < maxChecks) {
                        setTimeout(checkForReactSelect, 100);
                    } else {
                        iframe.remove();
                        reject(e);
                    }
                }
            };

            iframe.onload = () => {
                setTimeout(checkForReactSelect, 300);
            };

            iframe.onerror = () => {
                iframe.remove();
                reject(new Error('iframe load error'));
            };

            document.body.appendChild(iframe);
        });
    }


    // ===== PREVIEW SECTION SEARCH OVERLAY (Neue Version) =====
    let previewSectionSearchActive = false;
    let previewSectionSearchCurrentIndex = -1;
    let previewSectionSearchMatches = [];

    function applyPreviewSectionSearchOverlay() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Entferne existierende Event-Listener
            const existingHandler = window._geizhalsPreviewSectionSearchHandler;
            if (existingHandler) {
                document.removeEventListener('mousedown', existingHandler);
                window._geizhalsPreviewSectionSearchHandler = null;
            }

            const existingCtrlFHandler = window._geizhalsPreviewSectionCtrlFHandler;
            if (existingCtrlFHandler) {
                document.removeEventListener('keydown', existingCtrlFHandler, true);
                window._geizhalsPreviewSectionCtrlFHandler = null;
            }

            const existingMouseMoveHandler = window._geizhalsPreviewSectionMouseMoveHandler;
            if (existingMouseMoveHandler) {
                document.removeEventListener('mousemove', existingMouseMoveHandler);
                window._geizhalsPreviewSectionMouseMoveHandler = null;
            }

            if (!otherSettings.previewSectionSearchOverlay) {
                return;
            }

            // Prüfe ob wir auf der richtigen URL sind
            const url = new URL(window.location.href);
            if (!url.pathname.endsWith('/kalif/artikel')) return;

            const triggerMode = otherSettings.previewSectionSearchTrigger || 'mousewheel';

            // Speichere Mausposition für STRG+F
            let lastMouseX = 0;
            let lastMouseY = 0;
            let hoveredSection = null;
            let hoveredSectionType = null;

            const mouseMoveHandler = (e) => {
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;

                // Prüfe ob Maus über einer relevanten Section ist
                const target = document.elementFromPoint(e.clientX, e.clientY);
                if (target) {
                    const section = target.closest('section.section');
                    if (section) {
                        const formDesc = section.querySelector('form#section_form_desc');
                        const header = section.querySelector('h5');
                        const isArticlePreview = formDesc || (header && header.textContent.includes('Artikelvorschau'));

                        const formData = section.querySelector('form#section_form_data');
                        const isDataSection = formData || (header && header.textContent.includes('Beschreibung'));

                        if (isArticlePreview) {
                            hoveredSection = section;
                            hoveredSectionType = 'preview';
                        } else if (isDataSection) {
                            hoveredSection = section;
                            hoveredSectionType = 'data';
                        } else {
                            hoveredSection = null;
                            hoveredSectionType = null;
                        }
                    } else {
                        hoveredSection = null;
                        hoveredSectionType = null;
                    }
                }
            };

            // Nur mousemove tracken wenn STRG+F aktiv ist
            if (triggerMode === 'ctrlf' || triggerMode === 'both') {
                document.addEventListener('mousemove', mouseMoveHandler);
                window._geizhalsPreviewSectionMouseMoveHandler = mouseMoveHandler;
            }

            // Event-Listener für Mausrad-Button (mittlere Maustaste)
            if (triggerMode === 'mousewheel' || triggerMode === 'both') {
                const mouseHandler = (e) => {
                    // button === 1 ist die mittlere Maustaste (Mausrad-Klick)
                    if (e.button === 1) {
                        // Prüfe ob der Klick über einer relevanten Section war
                        const target = e.target;
                        const section = target.closest('section.section');

                        if (section) {
                            // Prüfe ob es die Artikelvorschau-Section ist (hat form#section_form_desc oder h5 mit "Artikelvorschau")
                            const formDesc = section.querySelector('form#section_form_desc');
                            const header = section.querySelector('h5');
                            const isArticlePreview = formDesc || (header && header.textContent.includes('Artikelvorschau'));

                            // Prüfe ob es die Eingabemaske-Section ist (hat form#section_form_data oder h5 mit "Beschreibung")
                            const formData = section.querySelector('form#section_form_data');
                            const isDataSection = formData || (header && header.textContent.includes('Beschreibung'));

                            if (isArticlePreview) {
                                e.preventDefault();
                                e.stopPropagation();
                                openPreviewSectionSearchOverlay(e.clientX, e.clientY, section, 'preview');
                            } else if (isDataSection) {
                                e.preventDefault();
                                e.stopPropagation();
                                openPreviewSectionSearchOverlay(e.clientX, e.clientY, section, 'data');
                            }
                        }
                    }
                };

                window._geizhalsPreviewSectionSearchHandler = mouseHandler;
                document.addEventListener('mousedown', mouseHandler);
            }

            // Event-Listener für STRG+F
            if (triggerMode === 'ctrlf' || triggerMode === 'both') {
                const ctrlFHandler = (e) => {
                    // Prüfe ob Overlay bereits offen ist
                    if (document.getElementById('geizhals-preview-section-search-overlay')) {
                        return;
                    }

                    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                        // Prüfe ob Maus über einer relevanten Section ist
                        if (hoveredSection && hoveredSectionType) {
                            e.preventDefault();
                            e.stopPropagation();
                            openPreviewSectionSearchOverlay(lastMouseX, lastMouseY, hoveredSection, hoveredSectionType);
                        }
                    }
                };

                window._geizhalsPreviewSectionCtrlFHandler = ctrlFHandler;
                document.addEventListener('keydown', ctrlFHandler, true);
            }

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function openPreviewSectionSearchOverlay(mouseX, mouseY, targetSection, sectionType) {
        // Prüfe ob Overlay bereits offen ist
        if (document.getElementById('geizhals-preview-section-search-overlay')) {
            return;
        }

        previewSectionSearchActive = true;
        previewSectionSearchCurrentIndex = -1;
        previewSectionSearchMatches = [];

        // Speichere die Ziel-Section und den Typ für die Suche
        window._geizhalsPreviewSectionSearchTarget = targetSection;
        window._geizhalsPreviewSectionSearchType = sectionType;

        // Blockiere native Browser-Suche (Strg+F) während Overlay aktiv ist
        const blockBrowserSearch = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                e.stopPropagation();
                const searchInput = document.getElementById('geizhals-preview-section-search-input');
                if (searchInput) searchInput.focus();
            }
        };
        window._geizhalsPreviewSectionBlockSearch = blockBrowserSearch;
        document.addEventListener('keydown', blockBrowserSearch, true);

        // Erstelle Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'geizhals-preview-section-search-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9999998;
        `;

        // Berechne Position - Cursor zeigt auf Mitte der oberen Kante
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const overlayWidth = 400;

        let left = mouseX;
        let top = mouseY;

        if (left + (overlayWidth / 2) > viewportWidth - 10) {
            left = viewportWidth - (overlayWidth / 2) - 10;
        }
        if (left - (overlayWidth / 2) < 10) {
            left = (overlayWidth / 2) + 10;
        }
        if (top + 150 > viewportHeight - 10) {
            top = viewportHeight - 150 - 10;
        }
        if (top < 10) {
            top = 10;
        }

        // Bestimme Titel und Placeholder basierend auf sectionType
        const titleText = sectionType === 'data' ? 'Suche in Eingabemaske' : 'Suche in Artikelvorschau';
        const placeholderText = sectionType === 'data'
            ? 'Labels, Werte & Überschriften durchsuchen...'
            : 'Bezeichnungs- & Beschreibungszeilen durchsuchen...';

        // Erstelle Overlay
        const overlay = document.createElement('div');
        overlay.id = 'geizhals-preview-section-search-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            transform: translateX(-50%);
            background: white;
            border: 3px solid #0d6efd;
            border-radius: 8px;
            padding: 1rem;
            z-index: 9999999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            min-width: 400px;
        `;

        // Erstelle Titel
        const title = document.createElement('div');
        title.textContent = titleText;
        title.style.cssText = 'font-weight: bold; margin-bottom: 0.5rem; color: #0d6efd;';
        overlay.appendChild(title);

        // Erstelle Suchfeld
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'geizhals-preview-section-search-input';
        searchInput.placeholder = placeholderText;
        searchInput.style.cssText = `
            width: 100%;
            padding: 0.5rem;
            border: 2px solid #0d6efd;
            border-radius: 4px;
            font-size: 1rem;
            outline: none;
            box-sizing: border-box;
        `;
        overlay.appendChild(searchInput);

        // Erstelle Status-Anzeige
        const statusDiv = document.createElement('div');
        statusDiv.id = 'geizhals-preview-section-search-status';
        statusDiv.style.cssText = 'margin-top: 0.5rem; font-size: 0.85rem; color: #666;';
        statusDiv.textContent = 'Enter = nächster Treffer | Esc = schließen';
        overlay.appendChild(statusDiv);

        // Event-Listener für Input
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            performPreviewSectionSearch(searchTerm);
        });

        // Event-Listener für Tasten
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                jumpToNextPreviewSectionMatch();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closePreviewSectionSearchOverlay();
            }
        });

        // Klick auf Backdrop schließt Overlay
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closePreviewSectionSearchOverlay();
            }
        });

        // Füge zum DOM hinzu
        document.body.appendChild(backdrop);
        document.body.appendChild(overlay);

        // Fokussiere Eingabefeld
        setTimeout(() => searchInput.focus(), 50);
    }

    function performPreviewSectionSearch(searchTerm) {
        // Lösche vorherige Highlights
        clearPreviewSectionHighlights();
        previewSectionSearchMatches = [];
        previewSectionSearchCurrentIndex = -1;

        if (!searchTerm) {
            updatePreviewSectionSearchStatus(0);
            return;
        }

        const targetSection = window._geizhalsPreviewSectionSearchTarget;
        const sectionType = window._geizhalsPreviewSectionSearchType;
        if (!targetSection) return;

        // Erstelle Style
        let highlightStyle = document.getElementById('geizhals-preview-section-highlight-styles');
        if (!highlightStyle) {
            highlightStyle = document.createElement('style');
            highlightStyle.id = 'geizhals-preview-section-highlight-styles';
            document.head.appendChild(highlightStyle);
        }
        highlightStyle.textContent = `
            .geizhals-ps-match {
                outline: 3px solid red !important;
                padding: 2px !important;
                background: yellow !important;
            }
            .geizhals-ps-current-match.geizhals-ps-match {
                background: #EF0FFF !important;
                outline: 3px solid red !important;
            }
            mark.geizhals-ps-text-match {
                background: yellow;
                color: inherit;
                padding: 0;
                border-radius: 2px;
                outline: 2px solid red;
            }
            mark.geizhals-ps-text-match.geizhals-ps-current-match {
                background: #EF0FFF !important;
            }
        `;

        const searchTermLower = searchTerm.toLowerCase();

        // Hilfsfunktion: Markiere gefundenen Text in einem Element
        function highlightTextInElement(element, searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            const marks = [];

            // Rekursiv durch alle Textknoten gehen
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.toLowerCase().includes(searchTermLower)) {
                    textNodes.push(node);
                }
            }

            textNodes.forEach(textNode => {
                const text = textNode.textContent;
                const lowerText = text.toLowerCase();
                let lastIndex = 0;
                const fragments = [];
                let index;

                while ((index = lowerText.indexOf(searchTermLower, lastIndex)) !== -1) {
                    // Text vor dem Match
                    if (index > lastIndex) {
                        fragments.push(document.createTextNode(text.substring(lastIndex, index)));
                    }

                    // Der gematchte Text in einem Mark-Element
                    const mark = document.createElement('mark');
                    mark.className = 'geizhals-ps-text-match geizhals-ps-match';
                    mark.textContent = text.substring(index, index + searchTerm.length);
                    fragments.push(mark);
                    marks.push(mark);

                    lastIndex = index + searchTerm.length;
                }

                // Restlicher Text nach dem letzten Match
                if (lastIndex < text.length) {
                    fragments.push(document.createTextNode(text.substring(lastIndex)));
                }

                // Ersetze den Textknoten durch die Fragments
                if (fragments.length > 0) {
                    const parent = textNode.parentNode;
                    fragments.forEach(fragment => {
                        parent.insertBefore(fragment, textNode);
                    });
                    parent.removeChild(textNode);
                }
            });

            return marks;
        }

        if (sectionType === 'preview') {
            // Suche in der Artikelvorschau (Tabellen-Struktur)
            const tbody = targetSection.querySelector('table tbody');
            if (!tbody) return;

            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach((row) => {
                const tds = row.querySelectorAll('td');
                if (tds.length >= 3) {
                    // Dritte Spalte (Index 2) - Bezeichnung
                    const labelCell = tds[2];
                    const labelSpan = labelCell.querySelector('span');
                    if (labelSpan && labelSpan.textContent.toLowerCase().includes(searchTermLower)) {
                        const marks = highlightTextInElement(labelSpan, searchTerm);
                        marks.forEach(mark => {
                            previewSectionSearchMatches.push({ element: mark, type: 'label' });
                        });
                    }

                    // Vierte Spalte (Index 3) - Wert (wenn vorhanden)
                    if (tds.length >= 4) {
                        const valueCell = tds[3];
                        const textContent = valueCell.textContent;
                        if (textContent.toLowerCase().includes(searchTermLower)) {
                            const marks = highlightTextInElement(valueCell, searchTerm);
                            marks.forEach(mark => {
                                previewSectionSearchMatches.push({ element: mark, type: 'value' });
                            });
                        }
                    }
                }
            });
        } else if (sectionType === 'data') {
            // Suche in der Eingabemaske

            // 1. Suche in Gruppen-Überschriften (fw-bold row-background Elemente wie "KVM-Switch", "Beleuchtung" etc.)
            const groupHeaders = targetSection.querySelectorAll('.fw-bold.row-background');
            groupHeaders.forEach((header) => {
                if (header.textContent.toLowerCase().includes(searchTermLower)) {
                    const marks = highlightTextInElement(header, searchTerm);
                    marks.forEach(mark => {
                        previewSectionSearchMatches.push({ element: mark, type: 'group-header' });
                    });
                }
            });

            // 2. Suche in Template-Row Überschriften (strong-Elemente)
            const templateRows = targetSection.querySelectorAll('.template-row');
            templateRows.forEach((row) => {
                const strongEl = row.querySelector('strong');
                if (strongEl && strongEl.textContent.toLowerCase().includes(searchTermLower)) {
                    const marks = highlightTextInElement(strongEl, searchTerm);
                    marks.forEach(mark => {
                        previewSectionSearchMatches.push({ element: mark, type: 'header' });
                    });
                }
            });

            // 3. Suche in Labels (.form-label)
            const labels = targetSection.querySelectorAll('label.form-label');
            labels.forEach((label) => {
                if (label.textContent.toLowerCase().includes(searchTermLower)) {
                    const marks = highlightTextInElement(label, searchTerm);
                    marks.forEach(mark => {
                        previewSectionSearchMatches.push({ element: mark, type: 'label' });
                    });
                }
            });

            // 4. Suche in Input-Feldern (Werte) - excludiere hidden inputs und React-Select combobox inputs
            // Input-Felder werden als Ganzes markiert (Text ist im value-Attribut, nicht im DOM)
            const inputs = targetSection.querySelectorAll('input.form-control:not([type="hidden"]):not([role="combobox"]), input.input-numeric:not([type="hidden"])');
            inputs.forEach((input) => {
                if (input.value && input.value.toLowerCase().includes(searchTermLower)) {
                    input.classList.add('geizhals-ps-match');
                    previewSectionSearchMatches.push({ element: input, type: 'input-value' });
                }
            });

            // 5. Suche in Select-Feldern (ausgewählte Option mit Wert)
            // Select-Felder werden als Ganzes markiert
            const selects = targetSection.querySelectorAll('select.form-select, select.input-numeric');
            selects.forEach((select) => {
                const selectedOption = select.options[select.selectedIndex];
                // Prüfe ob eine Option mit Wert ausgewählt ist
                if (selectedOption && selectedOption.value && selectedOption.text.toLowerCase().includes(searchTermLower)) {
                    select.classList.add('geizhals-ps-match');
                    previewSectionSearchMatches.push({ element: select, type: 'select-value' });
                }
            });

            // 6. Suche in React-Select Komponenten (Single-Select Werte)
            // Verwendet Attribut-Selektor da CSS-Klassen dynamisch generiert werden
            const reactSelectSingleValues = targetSection.querySelectorAll('[class*="-singleValue"]');
            reactSelectSingleValues.forEach((valueEl) => {
                if (valueEl.textContent.toLowerCase().includes(searchTermLower)) {
                    const marks = highlightTextInElement(valueEl, searchTerm);
                    marks.forEach(mark => {
                        previewSectionSearchMatches.push({ element: mark, type: 'react-select-value' });
                    });
                }
            });

            // 7. Suche in React-Select Multi-Select Werten
            // Die Multi-Value Elemente sind divs innerhalb von [class*="-multiValue"]
            const reactSelectMultiContainers = targetSection.querySelectorAll('[class*="-multiValue"]');
            reactSelectMultiContainers.forEach((container) => {
                // Das erste div-Kind enthält den Text
                const valueEl = container.querySelector('div');
                if (valueEl && valueEl.textContent.toLowerCase().includes(searchTermLower)) {
                    valueEl.classList.add('geizhals-ps-match');
                    previewSectionSearchMatches.push({ element: valueEl, type: 'react-select-multi-value' });
                }
            });

            // 8. Suche in Textarea-Feldern (z.B. Matchrule, Hinweis)
            const textareas = targetSection.querySelectorAll('textarea.form-control');
            textareas.forEach((textarea) => {
                if (textarea.value && textarea.value.toLowerCase().includes(searchTermLower)) {
                    textarea.classList.add('geizhals-ps-match');
                    previewSectionSearchMatches.push({ element: textarea, type: 'textarea-value' });
                }
            });
        }

        updatePreviewSectionSearchStatus(previewSectionSearchMatches.length);

        // Automatisch zum ersten Treffer scrollen wenn vorhanden
        if (previewSectionSearchMatches.length > 0) {
            previewSectionSearchCurrentIndex = 0;
            scrollToPreviewSectionMatch(previewSectionSearchMatches[0].element);
            updatePreviewSectionSearchStatus(previewSectionSearchMatches.length, 1);
        }
    }

    function jumpToNextPreviewSectionMatch() {
        if (previewSectionSearchMatches.length === 0) return;

        // Entferne vorherige aktuelle Markierung
        const previousCurrent = document.querySelector('.geizhals-ps-current-match');
        if (previousCurrent) {
            previousCurrent.classList.remove('geizhals-ps-current-match');
        }

        previewSectionSearchCurrentIndex = (previewSectionSearchCurrentIndex + 1) % previewSectionSearchMatches.length;
        const match = previewSectionSearchMatches[previewSectionSearchCurrentIndex];
        scrollToPreviewSectionMatch(match.element);
        updatePreviewSectionSearchStatus(previewSectionSearchMatches.length, previewSectionSearchCurrentIndex + 1);
    }

    function scrollToPreviewSectionMatch(element) {
        if (!element) return;

        // Entferne vorherige aktuelle Markierung und inline-style
        const previousCurrent = document.querySelector('.geizhals-ps-current-match');
        if (previousCurrent) {
            previousCurrent.classList.remove('geizhals-ps-current-match');
            previousCurrent.style.backgroundColor = '';
        }

        // Markiere aktuellen Treffer (nur Klasse, Farbe kommt nach Scroll)
        element.classList.add('geizhals-ps-current-match');

        // Berechne Overlay-Höhe um Überlappung zu vermeiden
        const searchOverlay = document.getElementById('geizhals-preview-section-search-overlay');
        let overlayBottom = 0;
        if (searchOverlay) {
            const overlayRect = searchOverlay.getBoundingClientRect();
            overlayBottom = overlayRect.bottom + 30; // 30px Abstand unter dem Overlay
        }

        // Scrolle Element in den sichtbaren Bereich
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Nach dem Scroll prüfen ob Element vom Overlay überdeckt wird
        setTimeout(() => {
            const elementRect = element.getBoundingClientRect();

            // Wenn Element-Oberkante unter der Overlay-Unterkante liegt, ist alles OK
            // Wenn nicht, müssen wir nachjustieren
            if (elementRect.top < overlayBottom) {
                // Element wird vom Overlay überdeckt - scrolle nach unten
                const adjustment = overlayBottom - elementRect.top + 10;
                window.scrollBy({
                    top: -adjustment,
                    behavior: 'smooth'
                });

                // Setze Hintergrundfarbe erst nach der Korrektur
                setTimeout(() => {
                    element.style.backgroundColor = '#EF0FFF';
                }, 350);
            } else {
                // Setze Hintergrundfarbe jetzt (Scroll ist fertig)
                element.style.backgroundColor = '#EF0FFF';
            }
        }, 350);
    }

    function createHighlightOverlay(element, overlayId) {
        // Entferne existierendes Overlay
        const existing = document.getElementById(overlayId);
        if (existing) existing.remove();

        const rect = element.getBoundingClientRect();

        const overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background: #EF0FFF;
            opacity: 0.7;
            pointer-events: none;
            z-index: 9999990;
            border-radius: 2px;
        `;
        document.body.appendChild(overlay);

        // Speichere Element-Referenz für Updates
        overlay._targetElement = element;
    }

    function updateHighlightOverlayPosition(element, overlayId) {
        const overlay = document.getElementById(overlayId);
        if (!overlay || !element) return;

        const rect = element.getBoundingClientRect();
        overlay.style.top = `${rect.top}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
    }

    function updatePreviewSectionSearchStatus(total, current = null) {
        const statusDiv = document.getElementById('geizhals-preview-section-search-status');
        if (!statusDiv) return;

        if (total === 0) {
            statusDiv.textContent = 'Keine Treffer | Enter = nächster Treffer | Esc = schließen';
            statusDiv.style.color = '#666';
        } else if (current !== null) {
            statusDiv.textContent = `Treffer ${current} von ${total} | Enter = nächster | Esc = schließen`;
            statusDiv.style.color = '#0d6efd';
        } else {
            statusDiv.textContent = `${total} Treffer gefunden | Enter = nächster | Esc = schließen`;
            statusDiv.style.color = '#28a745';
        }
    }

    function clearPreviewSectionHighlights() {
        try {
            // Entferne Mark-Elemente und stelle ursprünglichen Text wieder her
            const markElements = document.querySelectorAll('mark.geizhals-ps-text-match');
            markElements.forEach(mark => {
                try {
                    if (!document.contains(mark)) return;
                    // Entferne inline-style
                    mark.style.backgroundColor = '';
                    const parent = mark.parentNode;
                    const textNode = document.createTextNode(mark.textContent);
                    parent.replaceChild(textNode, mark);
                    // Normalisiere den Parent um benachbarte Textknoten zu vereinen
                    parent.normalize();
                } catch (e) {
                    // Element wurde bereits vom DOM entfernt, ignorieren
                }
            });

            const matchedElements = document.querySelectorAll('.geizhals-ps-match');
            matchedElements.forEach(el => {
                try {
                    if (!document.contains(el)) return;
                    el.classList.remove('geizhals-ps-match', 'geizhals-ps-current-match');
                    el.style.backgroundColor = '';
                } catch (e) {
                    // Element wurde bereits vom DOM entfernt, ignorieren
                }
            });
        } catch (outerError) {
            // Gesamte Funktion fehlgeschlagen, ignorieren
        }
    }

    function closePreviewSectionSearchOverlay() {
        previewSectionSearchActive = false;
        previewSectionSearchCurrentIndex = -1;
        previewSectionSearchMatches = [];
        window._geizhalsPreviewSectionSearchTarget = null;
        window._geizhalsPreviewSectionSearchType = null;

        // Entferne Browser-Suche Blockierung
        if (window._geizhalsPreviewSectionBlockSearch) {
            document.removeEventListener('keydown', window._geizhalsPreviewSectionBlockSearch, true);
            window._geizhalsPreviewSectionBlockSearch = null;
        }

        const backdrop = document.getElementById('geizhals-preview-section-search-backdrop');
        const overlay = document.getElementById('geizhals-preview-section-search-overlay');

        if (backdrop) backdrop.remove();
        if (overlay) overlay.remove();

        // Fade-Out Style hinzufügen wenn nicht vorhanden
        if (!document.getElementById('geizhals-ps-fadeout-styles')) {
            const style = document.createElement('style');
            style.id = 'geizhals-ps-fadeout-styles';
            style.textContent = `
                .geizhals-ps-highlight-fadeout-filled {
                    animation: geizhals-ps-fadeout-filled 1s ease-out forwards !important;
                }
                .geizhals-ps-highlight-fadeout-other {
                    animation: geizhals-ps-fadeout-other 1s ease-out forwards !important;
                }
                @keyframes geizhals-ps-fadeout-filled {
                    0% { background: #EF0FFF; outline: 3px solid red; }
                    70% { background: #EF0FFF; outline: 3px solid red; }
                    100% { background: transparent; outline: 3px solid transparent; }
                }
                @keyframes geizhals-ps-fadeout-other {
                    0% { background: yellow; outline: 3px solid red; }
                    70% { background: yellow; outline: 3px solid red; }
                    100% { background: transparent; outline: 3px solid transparent; }
                }
                mark.geizhals-ps-text-fadeout-current {
                    animation: geizhals-ps-text-fadeout-current 1s ease-out forwards !important;
                }
                mark.geizhals-ps-text-fadeout-other {
                    animation: geizhals-ps-text-fadeout-other 1s ease-out forwards !important;
                }
                @keyframes geizhals-ps-text-fadeout-current {
                    0% { background: #EF0FFF; outline: 2px solid red; }
                    70% { background: #EF0FFF; outline: 2px solid red; }
                    100% { background: transparent; outline: 2px solid transparent; }
                }
                @keyframes geizhals-ps-text-fadeout-other {
                    0% { background: yellow; outline: 2px solid red; }
                    70% { background: yellow; outline: 2px solid red; }
                    100% { background: transparent; outline: 2px solid transparent; }
                }
            `;
            document.head.appendChild(style);
        }

        // Markierte Elemente finden und Fadeout anwenden
        const matchedElements = document.querySelectorAll('.geizhals-ps-match:not(mark)');
        const markElements = document.querySelectorAll('mark.geizhals-ps-text-match');

        matchedElements.forEach(el => {
            const isCurrent = el.classList.contains('geizhals-ps-current-match');
            el.classList.remove('geizhals-ps-match', 'geizhals-ps-current-match');
            // Entferne inline-style damit Animation greift
            el.style.backgroundColor = '';
            el.classList.add(isCurrent ? 'geizhals-ps-highlight-fadeout-filled' : 'geizhals-ps-highlight-fadeout-other');
        });

        markElements.forEach(el => {
            const isCurrent = el.classList.contains('geizhals-ps-current-match');
            el.classList.remove('geizhals-ps-match', 'geizhals-ps-current-match', 'geizhals-ps-text-match');
            // Entferne inline-style damit Animation greift
            el.style.backgroundColor = '';
            el.classList.add(isCurrent ? 'geizhals-ps-text-fadeout-current' : 'geizhals-ps-text-fadeout-other');
        });

        // Nach 1 Sekunde Fadeout-Klassen entfernen und Mark-Elemente durch Text ersetzen
        setTimeout(() => {
            document.querySelectorAll('.geizhals-ps-highlight-fadeout-filled, .geizhals-ps-highlight-fadeout-other').forEach(el => {
                el.classList.remove('geizhals-ps-highlight-fadeout-filled', 'geizhals-ps-highlight-fadeout-other');
            });

            // Entferne Mark-Elemente und stelle ursprünglichen Text wieder her
            document.querySelectorAll('mark.geizhals-ps-text-fadeout-current, mark.geizhals-ps-text-fadeout-other').forEach(mark => {
                try {
                    const parent = mark.parentNode;
                    const textNode = document.createTextNode(mark.textContent);
                    parent.replaceChild(textNode, mark);
                    parent.normalize();
                } catch (e) {
                    // Ignorieren
                }
            });
        }, 1000);
    }

    // ===== APPLY TITLEBAR ID LINK =====
    function applyTitlebarIdLink() {
        try {
            const otherSettings = getOtherSettingsConfig();

            if (!otherSettings.titlebarIdLinkToArticleEdit) {
                return;
            }

            // Finde die Titelleiste
            const titleContainer = document.querySelector('div[style*="grid-column: 2 / -1"]');
            if (!titleContainer) return;

            // Prüfe ob bereits ein Link für die ID existiert
            const existingIdLink = titleContainer.querySelector('.geizhals-id-link');
            if (existingIdLink) return;

            // Suche nach der ID - kann im ersten Text-Node oder nach "Klon von" sein
            let idTextNode = null;
            let idMatch = null;

            // Durchlaufe alle Child-Nodes um die ID zu finden
            for (let i = 0; i < titleContainer.childNodes.length; i++) {
                const node = titleContainer.childNodes[i];

                if (node.nodeType === Node.TEXT_NODE) {
                    const textContent = node.textContent.trim();
                    const match = textContent.match(/^(\d+)\s*/);

                    if (match) {
                        idTextNode = node;
                        idMatch = match;
                        break;
                    }
                }
            }

            if (!idTextNode || !idMatch) return;

            const id = idMatch[1];
            const restText = idTextNode.textContent.substring(idMatch[0].length);

            // Erstelle Link für die ID
            const idLink = document.createElement('a');
            idLink.href = `https://opus.geizhals.at/kalif/artikel?id=${id}`;
            idLink.textContent = id;
            idLink.className = 'geizhals-id-link';
            idLink.style.cssText = 'text-decoration: none; color: rgb(207, 226, 255);';
            idLink.addEventListener('mouseenter', () => {
                idLink.style.textDecoration = 'underline';
            });
            idLink.addEventListener('mouseleave', () => {
                idLink.style.textDecoration = 'none';
            });

            // Ersetze den Text-Node
            try {
                const restTextNode = document.createTextNode(restText);
                if (idTextNode.parentElement === titleContainer && titleContainer.isConnected) {
                    titleContainer.insertBefore(idLink, idTextNode);
                    titleContainer.insertBefore(restTextNode, idTextNode);
                    titleContainer.removeChild(idTextNode);
                }
            } catch (insertError) {
                // Silently ignore insertBefore errors
            }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== APPLY TITLEBAR REMOVE HERSTELLER LINK =====
    function applyTitlebarRemoveHerstellerLink() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Finde die Titelleiste
            const titleContainer = document.querySelector('div[style*="grid-column: 2 / -1"]');
            if (!titleContainer) return;

            // Prüfe ob Option aktiviert ist
            if (otherSettings.titlebarRemoveHerstellerLink) {
                // Finde den Hersteller-Link
                const herstellerLink = titleContainer.querySelector('a[href*="kalif/hersteller"]');
                if (!herstellerLink) return;

                // Ersetze den Link durch einen Span mit dem Text
                const textSpan = document.createElement('span');
                textSpan.textContent = herstellerLink.textContent;
                textSpan.className = 'geizhals-hersteller-text';
                textSpan.dataset.geizhalsOriginalHref = herstellerLink.href;
                textSpan.dataset.geizhalsOriginalText = herstellerLink.textContent;

                // Behalte die Farbe bei
                textSpan.style.cssText = 'color: var(--bs-primary-bg-subtle);';

                herstellerLink.replaceWith(textSpan);
            } else {
                // Stelle den Link wieder her wenn Option deaktiviert
                const textSpan = titleContainer.querySelector('.geizhals-hersteller-text');
                if (textSpan && textSpan.dataset.geizhalsOriginalHref) {
                    const link = document.createElement('a');
                    link.href = textSpan.dataset.geizhalsOriginalHref;
                    link.textContent = textSpan.dataset.geizhalsOriginalText || textSpan.textContent;
                    link.className = 'text-decoration-underline';
                    link.style.cssText = 'color: var(--bs-primary-bg-subtle);';

                    textSpan.replaceWith(link);
                }
            }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== APPLY TITLEBAR ID COPY ICON =====
    function applyTitlebarIdCopyIcon() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Entferne alte Icons
            const existingIcons = document.querySelectorAll('.geizhals-titlebar-copy-icon');
            existingIcons.forEach(icon => icon.remove());

            if (!otherSettings.titlebarIdCopyIcon) {
                return;
            }

            // Finde die Titelleiste
            const titleContainer = document.querySelector('div[style*="grid-column: 2 / -1"]');
            if (!titleContainer) return;

            // Finde den ID-Link (wenn vorhanden) oder erstelle einen Span um die ID
            let insertAfterElement = titleContainer.querySelector('.geizhals-id-link');

            if (!insertAfterElement) {
                // Kein ID-Link vorhanden, suche die ID im Text
                let idTextNode = null;
                let idMatch = null;

                // Durchlaufe alle Child-Nodes um die ID zu finden
                for (let i = 0; i < titleContainer.childNodes.length; i++) {
                    const node = titleContainer.childNodes[i];

                    if (node.nodeType === Node.TEXT_NODE) {
                        const textContent = node.textContent.trim();
                        const match = textContent.match(/^(\d+)\s*/);

                        if (match) {
                            idTextNode = node;
                            idMatch = match;
                            break;
                        }
                    }
                }

                if (!idTextNode || !idMatch) return;

                const id = idMatch[1];
                const restText = idTextNode.textContent.substring(idMatch[0].length);

                // Erstelle Span für die ID (als Anker für das Copy-Icon)
                const idSpan = document.createElement('span');
                idSpan.textContent = id;
                idSpan.className = 'geizhals-id-span';

                // Ersetze den Text-Node
                try {
                    const restTextNode = document.createTextNode(restText);
                    if (idTextNode.parentElement === titleContainer && titleContainer.isConnected) {
                        titleContainer.insertBefore(idSpan, idTextNode);
                        titleContainer.insertBefore(restTextNode, idTextNode);
                        titleContainer.removeChild(idTextNode);
                        insertAfterElement = idSpan;
                    } else {
                        return;
                    }
                } catch (insertError) {
                    // Silently ignore insertBefore errors
                    return;
                }
            }

            // Erstelle Copy-Icon
            const copyIcon = document.createElement('button');
            copyIcon.type = 'button';
            copyIcon.className = 'geizhals-titlebar-copy-icon';
            copyIcon.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                margin-left: 0.3rem;
                color: inherit;
                display: inline-flex;
                align-items: center;
                transition: color 0.3s ease;
            `;
            copyIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

            copyIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(currentId).then(() => {
                    const originalColor = copyIcon.style.color;
                    copyIcon.style.color = '#28a745';
                    setTimeout(() => {
                        copyIcon.style.color = originalColor;
                    }, 1000);
                });
            });

            // Füge Icon nach dem ID-Element ein
            insertAfterElement.insertAdjacentElement('afterend', copyIcon);
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // Bildergalerie Variablen
    let imageGalleryLoading = false;
    let imageGalleryIframe = null;

    function applyImageGalleryHoverPreview() {
        try {
            const otherSettings = getOtherSettingsConfig();

            if (!otherSettings.imageGalleryHoverPreview) {
                // Feature deaktiviert - aufräumen
                document.querySelectorAll('.geizhals-image-gallery-container').forEach(el => el.remove());
                document.querySelectorAll('.geizhals-image-gallery-overlay').forEach(el => el.remove());
                imageGalleryLoading = false;
                if (imageGalleryIframe) {
                    imageGalleryIframe.remove();
                    imageGalleryIframe = null;
                }
                return;
            }

            // Prüfe ob wir auf der richtigen URL sind (nur ?id=<id>, nicht mode= oder clone=)
            const url = new URL(window.location.href);
            if (!url.pathname.endsWith('/kalif/artikel')) return;

            const params = url.searchParams;
            const hasId = params.has('id');
            const hasMode = params.has('mode');
            const hasClone = params.has('clone') || params.has('clone_id');

            // Nur wenn id vorhanden und kein mode/clone Parameter
            if (!hasId || hasMode || hasClone) return;

            const articleId = params.get('id');
            if (!articleId) return;

            // Prüfe ob Container bereits existiert
            const existingContainer = document.querySelector('.geizhals-image-gallery-container');
            if (existingContainer) return;

            // Prüfe ob bereits am Laden
            if (imageGalleryLoading) return;

            // Finde die Titelleiste
            const headbar = document.querySelector('.pane__headbar');
            if (!headbar) return;

            // Finde das Grid
            const grid = headbar.querySelector('.d-grid');
            if (!grid) return;

            // Grid-Kinder (nur divs): <div> (Titel), <div> (Variante), <div> (Navigation)
            const gridDivs = grid.querySelectorAll(':scope > div');
            if (gridDivs.length < 2) return;

            const varianteDiv = gridDivs[1];
            if (!varianteDiv) return;

            // Extrahiere Bildanzahl aus der Seite (z.B. "Bilder (9)")
            let imageCount = 0;
            const bilderHeader = document.querySelector('h6.d-inline');
            if (bilderHeader && bilderHeader.textContent.includes('Bilder')) {
                const match = bilderHeader.textContent.match(/\((\d+)\)/);
                if (match) {
                    imageCount = parseInt(match[1], 10);
                }
            }

            // Zeige sofort Platzhalter an
            if (imageCount > 0) {
                createGalleryPlaceholders(imageCount, varianteDiv);
            }

            // Lade Bilder aus iframe - IMMER, auch wenn imageCount 0 ist
            imageGalleryLoading = true;

            // Failsafe: Reset imageGalleryLoading nach 20 Sekunden falls es hängen bleibt
            setTimeout(() => {
                if (imageGalleryLoading) {
                    imageGalleryLoading = false;
                }
            }, 20000);

            // Verzögertes Laden um das Rendern der Seite nicht zu blockieren
            setTimeout(() => {
                requestAnimationFrame(() => {
                    loadImagesFromIframe(articleId, varianteDiv);
                });
            }, 100);

        } catch (e) {
            imageGalleryLoading = false;
        }
    }

    function createGalleryPlaceholders(count, varianteDiv) {
        // Entferne existierende Container
        document.querySelectorAll('.geizhals-image-gallery-container').forEach(el => el.remove());
        document.querySelectorAll('.geizhals-image-gallery-overlay').forEach(el => el.remove());

        // Finde varianteDiv neu falls nötig
        if (!varianteDiv || !varianteDiv.isConnected) {
            const headbar = document.querySelector('.pane__headbar');
            if (headbar) {
                const grid = headbar.querySelector('.d-grid');
                if (grid) {
                    const gridDivs = grid.querySelectorAll(':scope > div');
                    if (gridDivs.length >= 2) {
                        varianteDiv = gridDivs[1];
                    }
                }
            }
        }

        if (!varianteDiv) return;

        // Erstelle Container für die Bildergalerie
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'geizhals-image-gallery-container';
        galleryContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 2px;
            margin-left: 0.5rem;
        `;

        // Erstelle Platzhalter-Kästchen
        for (let i = 0; i < count; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'geizhals-image-placeholder';
            placeholder.style.cssText = `
                width: 25px;
                height: 25px;
                border: 1px solid #fff;
                border-radius: 2px;
                background: linear-gradient(90deg, #444 25%, #555 50%, #444 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            `;
            galleryContainer.appendChild(placeholder);
        }

        // Zeige Anzahl
        const countLabel = document.createElement('span');
        countLabel.textContent = `(${count})`;
        countLabel.style.cssText = 'color: #ccc; font-size: 0.75rem; margin-left: 4px;';
        galleryContainer.appendChild(countLabel);

        // Füge Shimmer-Animation hinzu (falls noch nicht vorhanden)
        if (!document.getElementById('geizhals-shimmer-style')) {
            const style = document.createElement('style');
            style.id = 'geizhals-shimmer-style';
            style.textContent = `
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Füge Galerie in Titelleiste ein
        const hasVariante = varianteDiv.textContent.includes('Variante:');
        if (hasVariante) {
            varianteDiv.style.display = 'flex';
            varianteDiv.style.alignItems = 'center';
        }
        varianteDiv.appendChild(galleryContainer);
    }

    function loadImagesFromIframe(articleId, varianteDiv) {
        // Entferne alten iframe falls vorhanden
        if (imageGalleryIframe) {
            imageGalleryIframe.remove();
            imageGalleryIframe = null;
        }

        const iframe = document.createElement('iframe');
        imageGalleryIframe = iframe;
        iframe.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 1200px; height: 800px; visibility: hidden;';
        // Cache-Busting mit Timestamp um immer frische Daten zu laden
        iframe.src = `https://opus.geizhals.at/kalif/artikel?id=${articleId}&mode=image&_t=${Date.now()}`;

        let checkCount = 0;
        const maxChecks = 150; // Max 15 Sekunden warten
        const minChecksBeforeEmpty = 50; // Mindestens 5 Sekunden warten bevor wir "keine Bilder" akzeptieren
        let lastImageCount = -1;
        let stableCount = 0;

        const checkForImages = () => {
            // Prüfe ob dieser iframe noch gültig ist
            if (imageGalleryIframe !== iframe) {
                iframe.remove();
                return;
            }

            checkCount++;
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // Suche nach allen Bildern mit pix_original im gesamten Dokument
                const images = iframeDoc.querySelectorAll('img[src*="pix_original"]');
                const currentImageCount = images.length;

                // Warte bis die Bildanzahl stabil ist (5 aufeinanderfolgende gleiche Werte)
                if (currentImageCount === lastImageCount) {
                    stableCount++;
                } else {
                    stableCount = 0;
                    lastImageCount = currentImageCount;
                }

                // Wenn Bilder gefunden und stabil (mind. 5 Checks)
                if (currentImageCount > 0 && stableCount >= 5) {
                    const imageUrls = [];
                    images.forEach(img => {
                        if (img.src && !imageUrls.includes(img.src)) {
                            imageUrls.push(img.src);
                        }
                    });

                    imageGalleryLoading = false;
                    imageGalleryIframe = null;
                    createGalleryUI(imageUrls, varianteDiv);
                    iframe.remove();
                }
                // Keine Bilder, aber genug gewartet und stabil
                else if (currentImageCount === 0 && stableCount >= 5 && checkCount >= minChecksBeforeEmpty) {
                    imageGalleryLoading = false;
                    imageGalleryIframe = null;
                    createGalleryUI([], varianteDiv);
                    iframe.remove();
                }
                // Timeout erreicht
                else if (checkCount >= maxChecks) {
                    const imageUrls = [];
                    images.forEach(img => {
                        if (img.src && !imageUrls.includes(img.src)) {
                            imageUrls.push(img.src);
                        }
                    });

                    imageGalleryLoading = false;
                    imageGalleryIframe = null;
                    createGalleryUI(imageUrls, varianteDiv);
                    iframe.remove();
                }
                // Weiter warten
                else {
                    setTimeout(checkForImages, 100);
                }
            } catch (e) {
                // Bei Cross-Origin-Fehler oder anderen Problemen weiter versuchen
                if (checkCount < maxChecks) {
                    setTimeout(checkForImages, 100);
                } else {
                    imageGalleryLoading = false;
                    imageGalleryIframe = null;
                    createGalleryUI([], varianteDiv);
                    iframe.remove();
                }
            }
        };

        iframe.onload = () => {
            setTimeout(checkForImages, 500);
        };

        iframe.onerror = () => {
            imageGalleryLoading = false;
            imageGalleryIframe = null;
            createGalleryUI([], varianteDiv);
            iframe.remove();
        };

        document.body.appendChild(iframe);

        // Fallback: Starte Check auch ohne onload nach 1 Sekunde
        setTimeout(() => {
            if (checkCount === 0 && imageGalleryIframe === iframe) {
                checkForImages();
            }
        }, 1000);
    }

    function createGalleryUI(imageUrls, varianteDivOriginal) {
        // Entferne existierende Galerien
        document.querySelectorAll('.geizhals-image-gallery-container').forEach(el => el.remove());
        document.querySelectorAll('.geizhals-image-gallery-overlay').forEach(el => el.remove());

        // Speichere originale URLs für späteren Zugriff auf Originalauflösung
        const originalImageUrls = imageUrls ? [...imageUrls] : [];

        // Konvertiere immer zu externen URLs (Webversion)
        if (imageUrls && imageUrls.length > 0) {
            // Konvertiere interne URLs zu externen URLs
            // Intern: https://opus.geizhals.at/pix_original/db/44/db448d54184c37f9
            // Extern: https://gzhls.at/pix/db/44/db448d54184c37f9-l.webp
            imageUrls = imageUrls.map(url => {
                if (url.includes('opus.geizhals.at/pix_original/')) {
                    return url
                        .replace('opus.geizhals.at/pix_original/', 'gzhls.at/pix/')
                        .replace(/^https?:\/\//, 'https://') + '-l.webp';
                }
                return url;
            });
        }

        // Finde das varianteDiv neu (falls React neu gerendert hat)
        let varianteDiv = varianteDivOriginal;
        if (!varianteDiv || !varianteDiv.isConnected) {
            const headbar = document.querySelector('.pane__headbar');
            if (headbar) {
                const grid = headbar.querySelector('.d-grid');
                if (grid) {
                    // Grid-Kinder (nur divs): <div> (Titel), <div> (Variante), <div> (Navigation)
                    const gridDivs = grid.querySelectorAll(':scope > div');
                    if (gridDivs.length >= 2) {
                        varianteDiv = gridDivs[1];
                    }
                }
            }
        }

        if (!varianteDiv) {
            return;
        }

        // Erstelle Container für die Bildergalerie
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'geizhals-image-gallery-container';
        galleryContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 2px;
            margin-left: 0.5rem;
        `;

        // Erstelle das Overlay
        const overlay = document.createElement('div');
        overlay.className = 'geizhals-image-gallery-overlay';
        overlay.style.cssText = `
            position: fixed;
            display: none;
            z-index: 999999;
            pointer-events: none;
            background: white;
            border: 2px solid #333;
            border-radius: 4px;
            padding: 4px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        `;
        document.body.appendChild(overlay);

        // Render Thumbnails
        if (!imageUrls || imageUrls.length === 0) {
            const noImages = document.createElement('span');
            noImages.textContent = '(keine Bilder)';
            noImages.style.cssText = 'color: #888; font-size: 0.8rem; font-style: italic;';
            galleryContainer.appendChild(noImages);
        } else {
            // Variable zum Tracken des gepinnten Thumbnails
            let pinnedThumb = null;

            // Funktion zum Erstellen des X-Buttons
            const createCloseButton = () => {
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '×';
                closeBtn.className = 'geizhals-overlay-close-btn';
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 28px;
                    height: 28px;
                    border: none;
                    background: rgba(220, 53, 69, 0.9);
                    color: white;
                    font-size: 20px;
                    line-height: 1;
                    cursor: pointer;
                    border-radius: 4px;
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                `;
                closeBtn.addEventListener('mouseenter', () => {
                    closeBtn.style.background = 'rgba(220, 53, 69, 1)';
                });
                closeBtn.addEventListener('mouseleave', () => {
                    closeBtn.style.background = 'rgba(220, 53, 69, 0.9)';
                });
                return closeBtn;
            };

            // Funktion zum Schließen des gepinnten Overlays
            const closePinnedOverlay = () => {
                if (pinnedThumb) {
                    pinnedThumb.style.borderColor = '#fff';
                    pinnedThumb.style.borderWidth = '1px';
                    pinnedThumb.style.transform = 'scale(1)';
                    pinnedThumb.style.zIndex = '';
                    pinnedThumb.style.position = '';
                    pinnedThumb = null;
                }
                // Entferne globale Event-Handler
                if (overlay._handleWheel) {
                    overlay.removeEventListener('wheel', overlay._handleWheel);
                    overlay._handleWheel = null;
                }
                if (overlay._handleMouseMove) {
                    document.removeEventListener('mousemove', overlay._handleMouseMove);
                    overlay._handleMouseMove = null;
                }
                if (overlay._handleMouseUp) {
                    document.removeEventListener('mouseup', overlay._handleMouseUp);
                    overlay._handleMouseUp = null;
                }
                overlay.style.display = 'none';
                // Entferne X-Button, Reset-Button und Brightness-Slider falls vorhanden
                const existingCloseBtn = overlay.querySelector('.geizhals-overlay-close-btn');
                if (existingCloseBtn) existingCloseBtn.remove();
                const existingResetBtn = overlay.querySelector('.geizhals-overlay-reset-btn');
                if (existingResetBtn) existingResetBtn.remove();
                const existingBrightnessSlider = overlay.querySelector('.geizhals-overlay-brightness-slider');
                if (existingBrightnessSlider) existingBrightnessSlider.remove();
            };

            // Funktion zum Anzeigen des Overlays
            const showOverlay = (thumb, imgUrl, isPinned) => {
                // Finde die Unterkante der Titelleiste/Miniaturbilder
                const headbar = document.querySelector('.pane__headbar');
                const headbarBottom = headbar ? headbar.getBoundingClientRect().bottom : 50;

                // Berechne verfügbare Höhe für das Overlay (unterhalb Titelleiste bis Viewport-Ende)
                const viewportHeight = window.innerHeight;
                // 20px Padding (5 oben Abstand, 10 unten Abstand) + 8px Overlay-Padding (4px oben/unten) + 4px Border
                const availableHeight = viewportHeight - headbarBottom - 32;

                // Erstelle neues Overlay-Bild mit dynamischer max-height
                overlay.innerHTML = '';
                const overlayImg = document.createElement('img');
                overlayImg.src = imgUrl;
                overlayImg.style.cssText = `display: block; max-width: 1500px; max-height: ${availableHeight}px;`;
                overlayImg.draggable = false; // Verhindere natives Bild-Dragging
                overlay.appendChild(overlayImg);

                // Füge X-Button und Resize-Handle hinzu wenn gepinnt
                if (isPinned) {
                    // Zoom-Funktionalität - sofort aktiv wenn gepinnt
                    let zoomLevel = 1;
                    let translateX = 0;
                    let translateY = 0;
                    let isDragging = false;
                    let dragStartX = 0;
                    let dragStartY = 0;
                    let dragStartTranslateX = 0;
                    let dragStartTranslateY = 0;

                    // Funktion zum Aktualisieren der Bild-Transformation
                    const updateTransform = () => {
                        overlayImg.style.transformOrigin = '0 0';
                        overlayImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
                        // Zeige Reset-Button wenn gezoomt oder verschoben
                        const resetBtn = overlay.querySelector('.geizhals-overlay-reset-btn');
                        if (zoomLevel !== 1 || translateX !== 0 || translateY !== 0) {
                            if (resetBtn) {
                                resetBtn.style.display = 'flex';
                            }
                        }
                    };

                    // Mausrad-Handler für Zoom an Cursor-Position
                    const handleWheel = (e) => {
                        e.preventDefault();

                        const rect = overlay.getBoundingClientRect();
                        // Cursor-Position relativ zum Overlay
                        const cursorX = e.clientX - rect.left;
                        const cursorY = e.clientY - rect.top;

                        const oldZoom = zoomLevel;
                        const zoomSpeed = 0.1;

                        if (e.deltaY < 0) {
                            // Zoom in
                            zoomLevel = Math.min(5, zoomLevel + zoomSpeed);
                        } else {
                            // Zoom out
                            zoomLevel = Math.max(0.5, zoomLevel - zoomSpeed);
                        }

                        // Berechne den Bildpunkt unter dem Cursor (vor dem Zoom)
                        const imagePointX = (cursorX - translateX) / oldZoom;
                        const imagePointY = (cursorY - translateY) / oldZoom;

                        // Neue Translation, damit der gleiche Bildpunkt unter dem Cursor bleibt
                        translateX = cursorX - imagePointX * zoomLevel;
                        translateY = cursorY - imagePointY * zoomLevel;

                        updateTransform();
                    };

                    // Drag-Start
                    const handleMouseDown = (e) => {
                        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                        if (e.target.classList.contains('geizhals-overlay-resize-handle')) return;

                        isDragging = true;
                        dragStartX = e.clientX;
                        dragStartY = e.clientY;
                        dragStartTranslateX = translateX;
                        dragStartTranslateY = translateY;
                        overlayImg.style.cursor = 'grabbing';
                        e.preventDefault();
                    };

                    // Drag-Move
                    const handleMouseMove = (e) => {
                        if (!isDragging) return;

                        const deltaX = e.clientX - dragStartX;
                        const deltaY = e.clientY - dragStartY;

                        translateX = dragStartTranslateX + deltaX;
                        translateY = dragStartTranslateY + deltaY;

                        updateTransform();
                    };

                    // Drag-End
                    const handleMouseUp = () => {
                        if (isDragging) {
                            isDragging = false;
                            overlayImg.style.cursor = 'grab';
                        }
                    };

                    // Setze Cursor auf grab
                    overlayImg.style.cursor = 'grab';

                    overlay.addEventListener('wheel', handleWheel, { passive: false });
                    overlay.addEventListener('mousedown', handleMouseDown);
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);

                    // Speichere Handler-Referenzen für Cleanup
                    overlay._handleWheel = handleWheel;
                    overlay._handleMouseMove = handleMouseMove;
                    overlay._handleMouseUp = handleMouseUp;

                    const closeBtn = createCloseButton();
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        closePinnedOverlay();
                    });
                    overlay.appendChild(closeBtn);

                    // Reset-Button erstellen (links neben X-Button)
                    const resetBtn = document.createElement('button');
                    resetBtn.className = 'geizhals-overlay-reset-btn';
                    resetBtn.textContent = 'Reset';
                    resetBtn.style.cssText = `
                        position: absolute;
                        top: 8px;
                        right: 44px;
                        height: 28px;
                        padding: 0 10px;
                        border: none;
                        background: rgba(40, 167, 69, 0.9);
                        color: white;
                        font-size: 12px;
                        line-height: 1;
                        cursor: pointer;
                        border-radius: 4px;
                        pointer-events: auto;
                        display: none;
                        align-items: center;
                        justify-content: center;
                        transition: background 0.2s;
                        white-space: nowrap;
                    `;
                    resetBtn.addEventListener('mouseenter', () => {
                        resetBtn.style.background = 'rgba(40, 167, 69, 1)';
                    });
                    resetBtn.addEventListener('mouseleave', () => {
                        resetBtn.style.background = 'rgba(40, 167, 69, 0.9)';
                    });

                    // Reset-Button Klick-Handler
                    resetBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        zoomLevel = 1;
                        translateX = 0;
                        translateY = 0;
                        overlayImg.style.transform = '';
                        overlayImg.style.transformOrigin = '';
                        overlayImg.style.filter = '';
                        // Auch Brightness-Slider zurücksetzen
                        const slider = overlay.querySelector('.geizhals-overlay-brightness-slider');
                        if (slider) slider.value = '1';
                        resetBtn.style.display = 'none';
                    });

                    overlay.appendChild(resetBtn);

                    // Helligkeits-Slider erstellen (immer sichtbar, links neben Reset-Button)
                    // Position: X-Button (right: 8px, 28px breit) + Reset-Button (right: 44px, ~58px breit) + 8px Abstand
                    const brightnessSlider = document.createElement('input');
                    brightnessSlider.type = 'range';
                    brightnessSlider.className = 'geizhals-overlay-brightness-slider';
                    brightnessSlider.min = '0.2';
                    brightnessSlider.max = '2';
                    brightnessSlider.step = '0.05';
                    brightnessSlider.value = '1';
                    brightnessSlider.title = 'Helligkeit anpassen';
                    brightnessSlider.style.cssText = `
                        position: absolute;
                        top: 12px;
                        right: 110px;
                        width: 80px;
                        height: 20px;
                        cursor: pointer;
                        pointer-events: auto;
                        accent-color: #ffc107;
                        opacity: 0.8;
                        transition: opacity 0.2s;
                    `;

                    brightnessSlider.addEventListener('mouseenter', () => {
                        brightnessSlider.style.opacity = '1';
                    });
                    brightnessSlider.addEventListener('mouseleave', () => {
                        brightnessSlider.style.opacity = '0.8';
                    });

                    // Helligkeit in Echtzeit anpassen
                    brightnessSlider.addEventListener('input', (e) => {
                        e.stopPropagation();
                        const brightness = parseFloat(brightnessSlider.value);
                        overlayImg.style.filter = `brightness(${brightness})`;
                        // Zeige Reset-Button wenn Helligkeit nicht auf Neutralwert
                        if (brightness !== 1) {
                            resetBtn.style.display = 'flex';
                        } else if (zoomLevel === 1 && translateX === 0 && translateY === 0) {
                            // Verstecke Reset-Button nur wenn auch Zoom/Position auf Standard
                            resetBtn.style.display = 'none';
                        }
                    });

                    // Verhindere Drag beim Slider
                    brightnessSlider.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                    });

                    overlay.appendChild(brightnessSlider);

                    // Resize-Handle erstellen (unten rechts)
                    const resizeHandle = document.createElement('div');
                    resizeHandle.className = 'geizhals-overlay-resize-handle';
                    resizeHandle.style.cssText = `
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        width: 20px;
                        height: 20px;
                        cursor: nwse-resize;
                        pointer-events: auto;
                        background: linear-gradient(135deg, transparent 50%, rgba(220, 53, 69, 0.8) 50%);
                        border-bottom-right-radius: 4px;
                    `;

                    // Resize-Logik
                    let isResizing = false;
                    let startX, startY, startWidth, startHeight, aspectRatio;

                    const onResizeStart = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        isResizing = true;

                        // Reset Zoom, Translation und Helligkeit beim Resize
                        if (zoomLevel !== 1 || translateX !== 0 || translateY !== 0) {
                            zoomLevel = 1;
                            translateX = 0;
                            translateY = 0;
                            overlayImg.style.transform = '';
                            overlayImg.style.transformOrigin = '';
                            resetBtn.style.display = 'none';
                        }
                        // Auch Helligkeit zurücksetzen
                        overlayImg.style.filter = '';
                        const slider = overlay.querySelector('.geizhals-overlay-brightness-slider');
                        if (slider) slider.value = '1';

                        startX = e.clientX || e.touches[0].clientX;
                        startY = e.clientY || e.touches[0].clientY;
                        startWidth = overlayImg.offsetWidth;
                        startHeight = overlayImg.offsetHeight;
                        aspectRatio = startWidth / startHeight;

                        document.addEventListener('mousemove', onResizeMove);
                        document.addEventListener('mouseup', onResizeEnd);
                        document.addEventListener('touchmove', onResizeMove);
                        document.addEventListener('touchend', onResizeEnd);
                    };

                    const onResizeMove = (e) => {
                        if (!isResizing) return;
                        e.preventDefault();

                        const clientX = e.clientX || e.touches[0].clientX;
                        const clientY = e.clientY || e.touches[0].clientY;

                        const deltaX = clientX - startX;
                        const deltaY = clientY - startY;

                        // Verwende die größere Änderung für proportionale Skalierung
                        let newWidth, newHeight;
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            newWidth = Math.max(100, startWidth + deltaX);
                            newHeight = newWidth / aspectRatio;
                        } else {
                            newHeight = Math.max(100, startHeight + deltaY);
                            newWidth = newHeight * aspectRatio;
                        }

                        // Begrenze auf max-Werte
                        const maxWidth = window.innerWidth - 40;
                        const maxHeight = viewportHeight - headbarBottom - 32;

                        if (newWidth > maxWidth) {
                            newWidth = maxWidth;
                            newHeight = newWidth / aspectRatio;
                        }
                        if (newHeight > maxHeight) {
                            newHeight = maxHeight;
                            newWidth = newHeight * aspectRatio;
                        }

                        overlayImg.style.width = `${newWidth}px`;
                        overlayImg.style.height = `${newHeight}px`;
                        overlayImg.style.maxWidth = 'none';
                        overlayImg.style.maxHeight = 'none';
                    };

                    const onResizeEnd = () => {
                        isResizing = false;
                        document.removeEventListener('mousemove', onResizeMove);
                        document.removeEventListener('mouseup', onResizeEnd);
                        document.removeEventListener('touchmove', onResizeMove);
                        document.removeEventListener('touchend', onResizeEnd);
                    };

                    resizeHandle.addEventListener('mousedown', onResizeStart);
                    resizeHandle.addEventListener('touchstart', onResizeStart);

                    overlay.appendChild(resizeHandle);
                    overlay.style.pointerEvents = 'auto';
                } else {
                    overlay.style.pointerEvents = 'none';
                }

                // Position berechnen
                const rect = thumb.getBoundingClientRect();

                // Overlay sichtbar machen
                overlay.style.display = 'block';

                // Warte auf Bild-Laden für korrekte Größe
                const positionOverlay = () => {
                    const viewportWidth = window.innerWidth;
                    const overlayWidth = overlay.offsetWidth;

                    const minTop = headbarBottom + 5; // Mindest-Abstand zur Titelleiste

                    // Position unter dem Thumbnail, zentriert
                    let left = rect.left + (rect.width / 2) - (overlayWidth / 2);
                    let top = minTop; // Immer direkt unterhalb der Titelleiste

                    // Prüfe ob Overlay aus dem Viewport ragt (horizontal)
                    if (left < 10) left = 10;
                    if (left + overlayWidth > viewportWidth - 10) {
                        left = viewportWidth - overlayWidth - 10;
                    }

                    overlay.style.left = `${left}px`;
                    overlay.style.top = `${top}px`;
                };

                if (overlayImg.complete) {
                    positionOverlay();
                } else {
                    overlayImg.onload = positionOverlay;
                }
            };

            imageUrls.forEach((imgUrl, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgUrl;
                thumb.loading = 'lazy';
                thumb.dataset.originalUrl = originalImageUrls[index]; // Speichere originale URL
                thumb.dataset.externalUrl = imgUrl; // Speichere externe URL
                thumb.style.cssText = `
                    width: 25px;
                    height: 25px;
                    object-fit: cover;
                    border: 1px solid #fff;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: transform 0.1s, border-color 0.1s, border-width 0.1s;
                `;
                thumb.title = `Bild ${index + 1} von ${imageUrls.length}`;

                thumb.addEventListener('mouseenter', () => {
                    // Nur Hover-Effekt wenn nicht gepinnt oder dieses Bild gepinnt ist
                    if (pinnedThumb && pinnedThumb !== thumb) {
                        // Ein anderes Bild ist gepinnt - nur leichten Hover-Effekt
                        thumb.style.transform = 'scale(1.1)';
                        thumb.style.zIndex = '10';
                        thumb.style.position = 'relative';
                        return;
                    }

                    thumb.style.borderColor = '#0d6efd';
                    thumb.style.transform = 'scale(1.1)';
                    thumb.style.zIndex = '10';
                    thumb.style.position = 'relative';

                    // Zeige Overlay nur wenn nicht gepinnt
                    if (!pinnedThumb) {
                        showOverlay(thumb, imgUrl, false);
                    }
                });

                thumb.addEventListener('mouseleave', () => {
                    // Wenn dieses Bild gepinnt ist, nichts tun
                    if (pinnedThumb === thumb) {
                        return;
                    }

                    // Wenn ein anderes Bild gepinnt ist, nur Hover-Effekt zurücksetzen
                    if (pinnedThumb) {
                        thumb.style.transform = 'scale(1)';
                        thumb.style.zIndex = '';
                        thumb.style.position = '';
                        return;
                    }

                    // Kein Bild gepinnt - normale Hover-Logik
                    thumb.style.borderColor = '#fff';
                    thumb.style.transform = 'scale(1)';
                    thumb.style.zIndex = '';
                    thumb.style.position = '';
                    overlay.style.display = 'none';
                });

                thumb.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Prüfe ob Bild vollständig geladen ist
                    if (!thumb.complete || thumb.naturalWidth === 0) {
                        // Bild noch nicht geladen - nichts tun
                        return;
                    }

                    // Wenn dieses Bild bereits gepinnt ist -> Schließen
                    if (pinnedThumb === thumb) {
                        closePinnedOverlay();
                        return;
                    }

                    // Wenn ein anderes Bild gepinnt ist -> Umschalten
                    if (pinnedThumb) {
                        pinnedThumb.style.borderColor = '#fff';
                        pinnedThumb.style.borderWidth = '1px';
                        pinnedThumb.style.transform = 'scale(1)';
                        pinnedThumb.style.zIndex = '';
                        pinnedThumb.style.position = '';
                    }

                    // Dieses Bild pinnen
                    pinnedThumb = thumb;
                    thumb.style.borderColor = 'red';
                    thumb.style.borderWidth = '3px';
                    thumb.style.transform = 'scale(1.1)';
                    thumb.style.zIndex = '10';
                    thumb.style.position = 'relative';

                    // Overlay mit X-Button anzeigen (mit Originalauflösung)
                    showOverlay(thumb, thumb.dataset.originalUrl, true);
                });

                galleryContainer.appendChild(thumb);
            });

            // Zeige Anzahl
            const countLabel = document.createElement('span');
            countLabel.textContent = `(${imageUrls.length})`;
            countLabel.style.cssText = 'color: #ccc; font-size: 0.75rem; margin-left: 4px;';
            galleryContainer.appendChild(countLabel);
        }

        // Füge Galerie in Titelleiste ein
        const hasVariante = varianteDiv.textContent.includes('Variante:');

        if (hasVariante) {
            varianteDiv.style.display = 'flex';
            varianteDiv.style.alignItems = 'center';
            varianteDiv.appendChild(galleryContainer);
        } else {
            varianteDiv.appendChild(galleryContainer);
        }
    }

    function buildLink(id) {
        switch(id) {
            case 'cloned-from':
                if (bulkId) {
                    return `<a href="https://opus.geizhals.at/kalif/bulkuploader?id=${bulkId}" target="_blank" style="color: inherit; text-decoration: none; font-weight: 600; border-bottom: 1px dotted; cursor: pointer;">${bulkId}</a>`;
                }
                return `<a href="https://opus.geizhals.at/kalif/artikel?id=${clonedFromId}" target="_blank" style="color: inherit; text-decoration: none; font-weight: 600; border-bottom: 1px dotted; cursor: pointer;">${clonedFromId}</a>`;
            case 'vergleich-gh-eu':
                return `<a href="https://geizhals.eu/?cmp=${clonedFromId}&cmp=${currentId}&active=1" target="_blank" style="color: #0d6efd; text-decoration: none; cursor: pointer;">Vergleich GH</a>`;
            case 'vergleich-gh-de':
                return `<a href="https://geizhals.de/?cmp=${clonedFromId}&cmp=${currentId}&active=1" target="_blank" style="color: #0d6efd; text-decoration: none; cursor: pointer;">Vergleich GH</a>`;
            case 'vergleich-gh-at':
                return `<a href="https://geizhals.at/?cmp=${clonedFromId}&cmp=${currentId}&active=1" target="_blank" style="color: #0d6efd; text-decoration: none; cursor: pointer;">Vergleich GH</a>`;
            case 'vergleich-kalif':
                return `<a href="https://opus.geizhals.at/kalif/artikel/diff#id=${currentId}&id=${clonedFromId}&primary=${clonedFromId}" target="_blank" style="color: #0d6efd; text-decoration: none; cursor: pointer;">Vergleich Kalif</a>`;
            case 'vergleich-bilder':
                return `<a href="https://opus.geizhals.at/kalif/artikel/mass-image?artikel=${clonedFromId}&artikel=${currentId}&autoGallery=true" target="_blank" style="color: #0d6efd; text-decoration: none; cursor: pointer;">Vergleich Bilder</a>`;
            default:
                return '';
        }
    }

    // ===== URL MONITORING FOR SIDEBAR BUTTON =====
    let lastKnownUrl = window.location.href;

    function isCleanArticleUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const hasId = urlParams.has('id');
        const hasCloneId = urlParams.has('clone_id');
        const paramCount = Array.from(urlParams.keys()).length;
        return (hasId || hasCloneId) && paramCount === 1;
    }

    function getSidebarButton() {
        let actionPane = document.querySelector('.pane__action');
        if (!actionPane) {
            actionPane = document.querySelector('[class*="pane"][class*="action"]');
        }
        if (!actionPane) return null;

        // Neuer Frame: Suche im unteren position-sticky Container (mit bottom: 0rem)
        const stickyContainers = actionPane.querySelectorAll('.position-sticky');
        for (let container of stickyContainers) {
            const style = container.getAttribute('style') || '';
            if (style.includes('bottom:') || style.includes('bottom :')) {
                // Suche nach Button mit Text "einklappen" oder "ausklappen"
                const buttons = container.querySelectorAll('button');
                for (let btn of buttons) {
                    const text = btn.textContent.trim().toLowerCase();
                    if (text.includes('einklappen') || text.includes('ausklappen')) {
                        return btn;
                    }
                    // Im eingeklappten Zustand: Button mit chevron-left SVG
                    const svg = btn.querySelector('svg.bi-chevron-left, svg[class*="chevron-left"]');
                    if (svg) {
                        return btn;
                    }
                }
            }
        }

        // Fallback: Suche nach Button mit Text "einklappen" oder "ausklappen" in gesamtem actionPane
        const allButtons = actionPane.querySelectorAll('button');
        for (let btn of allButtons) {
            const text = btn.textContent.trim().toLowerCase();
            if (text.includes('einklappen') || text.includes('ausklappen')) {
                return btn;
            }
        }

        // Letzter Fallback: Suche nach Button mit chevron-left SVG
        for (let btn of allButtons) {
            const svg = btn.querySelector('svg.bi-chevron-left, svg[class*="chevron-left"]');
            if (svg && btn.classList.contains('btn-outline-dark')) {
                return btn;
            }
        }

        return null;
    }

    function isSidebarCollapsed() {
        const sidebarBtn = getSidebarButton();
        if (!sidebarBtn) return false;

        // Alte Prüfung (Klasse)
        if (sidebarBtn.classList.contains('sidebar__expand__button')) {
            return true;
        }

        // Neue Prüfung: Im eingeklappten Zustand enthält der Button ein SVG (chevron-left) und keinen sichtbaren Text
        const svg = sidebarBtn.querySelector('svg.bi-chevron-left, svg[class*="chevron-left"]');
        if (svg) {
            // Wenn SVG vorhanden und kein Text außer dem SVG
            const textContent = sidebarBtn.textContent.trim();
            if (!textContent || textContent.length === 0) {
                return true;
            }
        }

        // Prüfe ob Text "ausklappen" enthält (= eingeklappt)
        const text = sidebarBtn.textContent.trim().toLowerCase();
        if (text.includes('ausklappen')) {
            return true;
        }

        return false;
    }

    function checkUrlChangedAndUpdateButton() {
        try {
            const currentUrl = window.location.href;
        if (currentUrl !== lastKnownUrl) {
            lastKnownUrl = currentUrl;
            const urlParams = new URLSearchParams(window.location.search);

            // Update currentId
            currentId = urlParams.get('id') || urlParams.get('clone_id');

            // Reset Clone-Info bei URL-Wechsel
            clonedFromId = null;
            bulkId = null;

            // Reset Created-From-Info bei URL-Wechsel
            createdFromUser = null;
            createdFromUserDate = null;
            const existingCreatedFrom = document.getElementById('geizhals-created-from-info');
            if (existingCreatedFrom) existingCreatedFrom.remove();

            // Reset initDone für Features die neu geladen werden müssen
            initDone.cloneInfo = false;

            // Reset Bildergalerie bei URL-Wechsel
            imageGalleryLoading = false;
            document.querySelectorAll('.geizhals-image-gallery-container').forEach(el => el.remove());
            document.querySelectorAll('.geizhals-image-gallery-overlay').forEach(el => el.remove());
            if (imageGalleryIframe) {
                imageGalleryIframe.remove();
                imageGalleryIframe = null;
            }

            // Reset Datenblatt-Favicons bei URL-Wechsel
            document.querySelectorAll('.geizhals-datasheet-favicons').forEach(el => el.remove());

            // Reset Preview Section Suche bei URL-Wechsel
            if (typeof closePreviewSectionSearchOverlay === 'function') {
                closePreviewSectionSearchOverlay();
            }

            // Reset Grid-Divider bei URL-Wechsel (damit es auf neuer Seite neu initialisiert wird)
            const existingGridDivider = document.querySelector('.grid-divider-overlay');
            if (existingGridDivider) existingGridDivider.remove();
            const existingRatioOverlay = document.querySelector('.grid-divider-ratio-overlay');
            if (existingRatioOverlay) existingRatioOverlay.remove();
            // Reset State
            gridDividerState.overlayDivider = null;
            gridDividerState.ratioOverlay = null;
            gridDividerState.primaryPane = null;
            gridDividerState.secondaryPane = null;
            gridDividerState.panesContainer = null;
            if (gridDividerState.resizeObserver) {
                gridDividerState.resizeObserver.disconnect();
                gridDividerState.resizeObserver = null;
            }
            if (gridDividerState.sidebarVisibilityObserver) {
                gridDividerState.sidebarVisibilityObserver.disconnect();
                gridDividerState.sidebarVisibilityObserver = null;
            }

            // Entferne existierende UI-Elemente für Neuinitialisierung
            const existingCloneInfo = document.getElementById('geizhals-clone-info');
            if (existingCloneInfo) existingCloneInfo.remove();
            const existingSidebarBtn = document.getElementById('geizhals-sidebar-toggle-btn');
            if (existingSidebarBtn) existingSidebarBtn.remove();
            const existingCloneBtn = document.getElementById('geizhals-clone-btn');
            if (existingCloneBtn) existingCloneBtn.remove();
            const existingCopyIcons = document.querySelectorAll('.geizhals-titlebar-copy-icon');
            existingCopyIcons.forEach(icon => icon.remove());

            const hasModeParam = Array.from(urlParams.keys()).some(key =>
                key === 'mode' || key.includes('mode')
            );
            const hasCloneId = urlParams.has('clone_id');
            const hasIdParam = urlParams.has('id');
            const isClean = isCleanArticleUrl();
            const otherSettings = getOtherSettingsConfig();

            // Auto-collapse on clean URLs with id parameter if setting is enabled (not on clone_id URLs)
            if (isClean && hasIdParam && !hasCloneId && otherSettings.sidebarAutoCollapse) {
                // Prüfe ob Modus 'maxWidth': nur einklappen wenn Fensterbreite <= maxWidth
                // Verwende physische Pixel (innerWidth * devicePixelRatio) für korrekte Berechnung bei HiDPI-Displays
                const currentWidth = Math.floor(window.innerWidth * window.devicePixelRatio);
                const maxWidth = otherSettings.sidebarAutoCollapseMaxWidth || 2560;

                const shouldCollapse = otherSettings.sidebarAutoCollapseMode === 'maxWidth'
                    ? currentWidth <= maxWidth
                    : true; // 'always' Modus

                if (shouldCollapse) {
                    // Mehrere Versuche mit steigenden Verzögerungen für robusteres Einklappen
                    const collapseDelays = [100, 500, 1000, 2000, 3500, 5000];
                    collapseDelays.forEach(delay => {
                        setTimeout(() => {
                            const sidebarBtn = getSidebarButton();
                            if (sidebarBtn && !isSidebarCollapsed()) {
                                sidebarBtn.click();
                            }
                        }, delay);
                    });
                }
            }
            // Auto-expand on mode URLs if sidebar is collapsed
            if (hasModeParam) {
                setTimeout(() => {
                    const sidebarBtn = getSidebarButton();
                    if (isSidebarCollapsed() && sidebarBtn) {
                        sidebarBtn.click();
                    }
                }, 150);
            }
            // Auto-expand on clone_id URLs if sidebar is collapsed
            if (hasCloneId) {
                setTimeout(() => {
                    const sidebarBtn = getSidebarButton();
                    if (isSidebarCollapsed() && sidebarBtn) {
                        sidebarBtn.click();
                    }
                }, 150);
            }

            // Re-apply all functions on URL change mit wiederholten Versuchen
            renderCloneInfo();
            applyDomDependentFeatures();
            setTimeout(applyDomDependentFeatures, 300);
            setTimeout(applyDomDependentFeatures, 600);
            setTimeout(applyDomDependentFeatures, 1000);
            setTimeout(applyDomDependentFeatures, 2000);
            setTimeout(applyDomDependentFeatures, 3500);
            setTimeout(applyDomDependentFeatures, 5000);

            // Expliziter Aufruf für Bildergalerie mit verschiedenen Verzögerungen
            if (otherSettings.imageGalleryHoverPreview && !hasModeParam && !hasCloneId) {
                setTimeout(applyImageGalleryHoverPreview, 500);
                setTimeout(applyImageGalleryHoverPreview, 1500);
                setTimeout(applyImageGalleryHoverPreview, 3000);
            }

            // Aktualisiere clonedFromId und wende Clone-Optionen an wenn nötig
            (async () => {
                if (hasCloneId) {
                    // Bei clone_id URL: clonedFromId aus HTML oder Log-Seite holen
                    clonedFromId = getClonedFromIdFromHTML();
                    if (!clonedFromId) {
                        try {
                            const logResult = await getClonedFromIdFromLogPage();
                            if (logResult) {
                                if (logResult.type === 'bulk') {
                                    bulkId = logResult.id;
                                    clonedFromId = logResult.id;
                                } else {
                                    clonedFromId = logResult.id;
                                }
                            }
                        } catch (e) {
                            clonedFromId = null;
                        }
                    }
                    if (clonedFromId) {
                        await applyCloneOptionsToPage();
                        renderCloneInfo();
                        applyDomDependentFeatures();
                    }
                } else if (hasIdParam && !hasModeParam) {
                    // Bei normaler id URL: clonedFromId aus Log-Seite holen
                    try {
                        const logResult = await getClonedFromIdFromLogPage();
                        if (logResult) {
                            if (logResult.type === 'bulk') {
                                bulkId = logResult.id;
                                clonedFromId = logResult.id;
                            } else {
                                clonedFromId = logResult.id;
                            }
                        }
                    } catch (e) {
                        clonedFromId = null;
                    }
                    renderCloneInfo();
                    if (clonedFromId) {
                        applyDomDependentFeatures();
                    }
                }
            })();
        }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== APPLY SIDEBAR TOGGLE BUTTON IN HEADBAR =====
    function applySidebarToggleButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.sidebarToggleButtonInHeadbar) {
                const existingBtn = document.getElementById('geizhals-sidebar-toggle-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

        // Check if URL is clean (only id parameter, no additional params like mode=log)
        if (!isCleanArticleUrl()) {
            const existingBtn = document.getElementById('geizhals-sidebar-toggle-btn');
            if (existingBtn) existingBtn.remove();
            return;
        }

        // Find the headbar
        const headbar = document.querySelector('.pane__headbar');
        if (!headbar) return;

        // Find the navbar-nav
        const navbarNav = headbar.querySelector('.navbar-nav');
        if (!navbarNav) return;

        // Remove existing button if present
        const existingBtn = document.getElementById('geizhals-sidebar-toggle-btn');
        if (existingBtn) existingBtn.remove();
        // Create the toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'geizhals-sidebar-toggle-btn';
        toggleBtn.type = 'button';
        toggleBtn.className = 'py-0 nav-link';
        toggleBtn.style.cssText = `
            background-color: #FFC107;
            color: #000;
            border: none;
            padding: 0 0.3rem;
			line-height: 1;
			height: 1.5rem;
            font-size: 0.875rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            margin-right: 0.5rem;
            flex-shrink: 0;
            white-space: nowrap;
            min-width: 4rem;
            text-align: center;
        `;

        function getSidebarButton() {
            // Search specifically in the action pane
            let actionPane = document.querySelector('.pane__action');
            if (!actionPane) {
                actionPane = document.querySelector('[class*="pane"][class*="action"]');
            }
            if (!actionPane) return null;

            // Neuer Frame: Suche im unteren position-sticky Container (mit bottom: 0rem)
            const stickyContainers = actionPane.querySelectorAll('.position-sticky');
            for (let container of stickyContainers) {
                const style = container.getAttribute('style') || '';
                if (style.includes('bottom:') || style.includes('bottom :')) {
                    const buttons = container.querySelectorAll('button');
                    for (let btn of buttons) {
                        const text = btn.textContent.trim().toLowerCase();
                        if (text.includes('einklappen') || text.includes('ausklappen')) {
                            return btn;
                        }
                        // Im eingeklappten Zustand: Button mit chevron-left SVG
                        const svg = btn.querySelector('svg.bi-chevron-left, svg[class*="chevron-left"]');
                        if (svg) {
                            return btn;
                        }
                    }
                }
            }

            // Fallback: Suche nach Button mit Text "einklappen" oder "ausklappen"
            const buttons = actionPane.querySelectorAll('button');
            for (let btn of buttons) {
                const text = btn.textContent.trim().toLowerCase();
                if (text.includes('einklappen') || text.includes('ausklappen')) {
                    return btn;
                }
            }

            // Letzter Fallback: Button mit chevron-left SVG
            for (let btn of buttons) {
                const svg = btn.querySelector('svg.bi-chevron-left, svg[class*="chevron-left"]');
                if (svg && btn.classList.contains('btn-outline-dark')) {
                    return btn;
                }
            }

            return null;
        }

        function updateButtonText() {
            const sidebarBtn = getSidebarButton();

            if (sidebarBtn) {
                // Alte Prüfung (Klasse)
                if (sidebarBtn.classList.contains('sidebar__expand__button')) {
                    toggleBtn.textContent = 'Seitenleiste ⬅️';
                    return;
                }

                // Neue Prüfung: SVG (chevron-left) = eingeklappt
                const svg = sidebarBtn.querySelector('svg.bi-chevron-left, svg[class*="chevron-left"]');
                if (svg) {
                    const textContent = sidebarBtn.textContent.trim();
                    if (!textContent || textContent.length === 0) {
                        toggleBtn.textContent = 'Seitenleiste ⬅️';
                        return;
                    }
                }

                // Textbasierte Prüfung
                const text = sidebarBtn.textContent.trim().toLowerCase();
                if (text.includes('ausklappen')) {
                    toggleBtn.textContent = 'Seitenleiste ⬅️';
                } else {
                    toggleBtn.textContent = 'Seitenleiste ➡️';
                }
            } else {
                toggleBtn.textContent = 'Seitenleiste ➡️';
            }
        }

        // Set initial text with fallback
        setTimeout(updateButtonText, 100);

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const sidebarBtn = getSidebarButton();
            if (sidebarBtn) {
                sidebarBtn.click();
                setTimeout(updateButtonText, 150);
            }
        });

        toggleBtn.addEventListener('mouseover', () => {
            toggleBtn.style.opacity = '0.9';
        });

        toggleBtn.addEventListener('mouseout', () => {
            toggleBtn.style.opacity = '1';
        });

        // Insert button at the beginning of navbar-nav (before "Neu laden")
        try {
            if (navbarNav && navbarNav.isConnected) {
                navbarNav.insertBefore(toggleBtn, navbarNav.firstChild);
            }
        } catch (insertError) {
            // Silently ignore insertBefore errors
        }

        // Polling to keep button text updated
        setInterval(updateButtonText, 800);
        } catch (e) {
            // Fehler ignorieren
        }
    }

    function applyTitlebarCloneButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.titlebarCloneButton) {
                const existingBtn = document.getElementById('geizhals-clone-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

        // Check if URL is clean (only id parameter, no additional params like mode=log)
        if (!isCleanArticleUrl()) {
            const existingBtn = document.getElementById('geizhals-clone-btn');
            if (existingBtn) existingBtn.remove();
            return;
        }

        // Find the headbar
        const headbar = document.querySelector('.pane__headbar');
        if (!headbar) return;

        // Find the navbar-nav
        const navbarNav = headbar.querySelector('.navbar-nav');
        if (!navbarNav) return;

        // Remove existing button if present
        const existingBtn = document.getElementById('geizhals-clone-btn');
        if (existingBtn) existingBtn.remove();

        // Get current ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const currentId = urlParams.get('id');
        if (!currentId) return;

        // Create the clone button
        const cloneBtn = document.createElement('button');
        cloneBtn.id = 'geizhals-clone-btn';
        cloneBtn.type = 'button';
        cloneBtn.className = 'py-0 nav-link';
        cloneBtn.textContent = 'Klonen';
        cloneBtn.style.cssText = `
            background-color: #0D6EFD;
            color: #ffffff;
            border: 1px solid #0D6EFD;
            padding: 0 0.3rem;
            line-height: 1;
            height: 1.5rem;
            font-size: 0.875rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            margin-right: 0.5rem;
            flex-shrink: 0;
            white-space: nowrap;
            min-width: 4rem;
            text-align: center;
        `;

        cloneBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const otherSettings = getOtherSettingsConfig();
            if (otherSettings.cloneApplyChanges) {
                // Verwende die neue Funktion mit Änderungsübernahme
                await performCloneWithChangesApply();
            } else {
                // Normales Klonen ohne Änderungsübernahme
                const sidebarBtn = getSidebarButton();
                if (sidebarBtn && isSidebarCollapsed()) {
                    sidebarBtn.click();
                    setTimeout(() => {
                        const nativeCloneButton = document.querySelector('a[name="clone"]');
                        if (nativeCloneButton) {
                            nativeCloneButton.click();
                        }
                    }, 200);
                } else {
                    const nativeCloneButton = document.querySelector('a[name="clone"]');
                    if (nativeCloneButton) {
                        nativeCloneButton.click();
                    }
                }
            }
        });

        cloneBtn.addEventListener('mouseover', () => {
            cloneBtn.style.opacity = '0.9';
        });

        cloneBtn.addEventListener('mouseout', () => {
            cloneBtn.style.opacity = '1';
        });

        // Insert button at the beginning of navbar-nav (before other buttons)
        try {
            if (navbarNav && navbarNav.isConnected) {
                navbarNav.insertBefore(cloneBtn, navbarNav.firstChild);
            }
        } catch (insertError) {
            // Silently ignore insertBefore errors
        }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== APPLY TITLEBAR SAVE BUTTON =====
    // Global variable to store the MutationObserver for the save button state
    let saveButtonObserver = null;

    function applyTitlebarSaveButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.titlebarSaveButton) {
                const existingBtn = document.getElementById('geizhals-save-btn');
                if (existingBtn) existingBtn.remove();
                // Disconnect observer if it exists
                if (saveButtonObserver) {
                    saveButtonObserver.disconnect();
                    saveButtonObserver = null;
                }
                return;
            }

            // Check if URL is clean (only id parameter, no additional params like mode=log)
            if (!isCleanArticleUrl()) {
                const existingBtn = document.getElementById('geizhals-save-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            // Find the headbar
            const headbar = document.querySelector('.pane__headbar');
            if (!headbar) return;

            // Find the navbar-nav
            const navbarNav = headbar.querySelector('.navbar-nav');
            if (!navbarNav) return;

            // Remove existing button if present
            const existingBtn = document.getElementById('geizhals-save-btn');
            if (existingBtn) existingBtn.remove();

            // Create the save button
            const saveBtn = document.createElement('button');
            saveBtn.id = 'geizhals-save-btn';
            saveBtn.type = 'button';
            saveBtn.className = 'py-0 nav-link';
            saveBtn.textContent = 'Speichern';

            // Check if native save button is enabled
            const nativeSaveBtn = findNativeSaveButton();
            const isEnabled = nativeSaveBtn && !nativeSaveBtn.disabled;

            // Apply initial style based on state
            updateSaveButtonStyle(saveBtn, isEnabled);

            saveBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Only click if native button is enabled
                const nativeSaveButton = findNativeSaveButton();
                if (nativeSaveButton && !nativeSaveButton.disabled) {
                    nativeSaveButton.click();
                }
            });

            saveBtn.addEventListener('mouseover', () => {
                if (!saveBtn.disabled) {
                    saveBtn.style.opacity = '0.9';
                }
            });

            saveBtn.addEventListener('mouseout', () => {
                saveBtn.style.opacity = '1';
            });

            // Insert button after clone button
            try {
                if (navbarNav && navbarNav.isConnected) {
                    const cloneBtn = document.getElementById('geizhals-clone-btn');
                    if (cloneBtn && cloneBtn.parentElement === navbarNav && cloneBtn.nextSibling) {
                        navbarNav.insertBefore(saveBtn, cloneBtn.nextSibling);
                    } else if (cloneBtn && cloneBtn.parentElement === navbarNav) {
                        navbarNav.appendChild(saveBtn);
                    } else {
                        navbarNav.insertBefore(saveBtn, navbarNav.firstChild);
                    }
                }
            } catch (insertError) {
                // Silently ignore insertBefore errors
            }

            // Setup observer to watch for native save button state changes
            setupSaveButtonStateObserver();

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function updateSaveButtonStyle(saveBtn, isEnabled) {
        if (isEnabled) {
            saveBtn.disabled = false;
            saveBtn.style.cssText = `
                background-color: #198754;
                color: #ffffff;
                border: 1px solid #198754;
                padding: 0 0.3rem;
                line-height: 1;
                height: 1.5rem;
                font-size: 0.875rem;
                border-radius: 0.25rem;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                margin-right: 0.5rem;
                flex-shrink: 0;
                white-space: nowrap;
                min-width: 5rem;
                text-align: center;
            `;
        } else {
            saveBtn.disabled = true;
            saveBtn.style.cssText = `
                background-color: #e9ecef;
                color: #6c757d;
                border: 1px solid #dee2e6;
                padding: 0 0.3rem;
                line-height: 1;
                height: 1.5rem;
                font-size: 0.875rem;
                border-radius: 0.25rem;
                cursor: not-allowed;
                font-weight: 500;
                transition: all 0.2s;
                margin-right: 0.5rem;
                flex-shrink: 0;
                white-space: nowrap;
                min-width: 5rem;
                text-align: center;
                opacity: 0.65;
            `;
        }
    }

    function findNativeSaveButton() {
        // The native save button is a <button> with class "btn-success" or "btn-outline-success"
        // and text "Speichern" or contains the floppy disk SVG icon
        const actionPane = document.querySelector('.pane__action');
        if (!actionPane) return null;

        const buttons = actionPane.querySelectorAll('button.btn');
        for (const btn of buttons) {
            // Check for text "Speichern" or SVG icon
            if (btn.textContent.trim() === 'Speichern' ||
                btn.querySelector('svg.bi-floppy2')) {
                return btn;
            }
        }
        return null;
    }

    function setupSaveButtonStateObserver() {
        // Disconnect existing observer if any
        if (saveButtonObserver) {
            saveButtonObserver.disconnect();
        }

        const actionPane = document.querySelector('.pane__action');
        if (!actionPane) return;

        saveButtonObserver = new MutationObserver((mutations) => {
            const titlebarSaveBtn = document.getElementById('geizhals-save-btn');
            if (!titlebarSaveBtn) return;

            const nativeSaveBtn = findNativeSaveButton();
            const isEnabled = nativeSaveBtn && !nativeSaveBtn.disabled;
            updateSaveButtonStyle(titlebarSaveBtn, isEnabled);
        });

        // Observe the action pane for changes
        saveButtonObserver.observe(actionPane, {
            attributes: true,
            attributeFilter: ['disabled', 'class'],
            subtree: true,
            childList: true
        });
    }

    // ===== APPLY TITLEBAR RELOAD BUTTON =====
    function applyTitlebarReloadButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.titlebarReloadButton) {
                const existingBtn = document.getElementById('geizhals-reload-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            // Check if URL is clean (only id parameter, no additional params like mode=log)
            if (!isCleanArticleUrl()) {
                const existingBtn = document.getElementById('geizhals-reload-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            // Find the headbar
            const headbar = document.querySelector('.pane__headbar');
            if (!headbar) return;

            // Find the navbar-nav
            const navbarNav = headbar.querySelector('.navbar-nav');
            if (!navbarNav) return;

            // Remove existing button if present
            const existingBtn = document.getElementById('geizhals-reload-btn');
            if (existingBtn) existingBtn.remove();

            // Create the reload button
            const reloadBtn = document.createElement('button');
            reloadBtn.id = 'geizhals-reload-btn';
            reloadBtn.type = 'button';
            reloadBtn.className = 'py-0 nav-link';
            reloadBtn.textContent = 'Neu laden';
            reloadBtn.style.cssText = `
                background-color: #000000;
                color: #ffffff;
                border: 1px solid #ffffff;
                padding: 0 0.3rem;
                line-height: 1;
                height: 1.5rem;
                font-size: 0.875rem;
                border-radius: 0.25rem;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                margin-right: 0.5rem;
                flex-shrink: 0;
                white-space: nowrap;
                min-width: 5rem;
                text-align: center;
            `;

            reloadBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Find and click the native "Neu laden" button in the sidebar
                const nativeReloadButton = findNativeReloadButton();
                if (nativeReloadButton) {
                    nativeReloadButton.click();
                }
            });

            reloadBtn.addEventListener('mouseover', () => {
                reloadBtn.style.opacity = '0.8';
            });

            reloadBtn.addEventListener('mouseout', () => {
                reloadBtn.style.opacity = '1';
            });

            // Insert button after paste button (or after save, or after clone, or at the beginning)
            try {
                if (navbarNav && navbarNav.isConnected) {
                    const pasteBtn = document.getElementById('geizhals-paste-btn');
                    const saveBtn = document.getElementById('geizhals-save-btn');
                    const cloneBtn = document.getElementById('geizhals-clone-btn');

                    if (pasteBtn && pasteBtn.parentElement === navbarNav && pasteBtn.nextSibling) {
                        navbarNav.insertBefore(reloadBtn, pasteBtn.nextSibling);
                    } else if (pasteBtn && pasteBtn.parentElement === navbarNav) {
                        navbarNav.appendChild(reloadBtn);
                    } else if (saveBtn && saveBtn.parentElement === navbarNav && saveBtn.nextSibling) {
                        navbarNav.insertBefore(reloadBtn, saveBtn.nextSibling);
                    } else if (saveBtn && saveBtn.parentElement === navbarNav) {
                        navbarNav.appendChild(reloadBtn);
                    } else if (cloneBtn && cloneBtn.parentElement === navbarNav && cloneBtn.nextSibling) {
                        navbarNav.insertBefore(reloadBtn, cloneBtn.nextSibling);
                    } else if (cloneBtn && cloneBtn.parentElement === navbarNav) {
                        navbarNav.appendChild(reloadBtn);
                    } else {
                        navbarNav.insertBefore(reloadBtn, navbarNav.firstChild);
                    }
                }
            } catch (insertError) {
                // Silently ignore insertBefore errors
            }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // Helper function to find the native "Neu laden" button in the sidebar
    function findNativeReloadButton() {
        // The native reload button is an <a> with class "btn btn-dark" and text "Neu laden"
        const actionPane = document.querySelector('.pane__action');
        if (!actionPane) return null;

        const links = actionPane.querySelectorAll('a.btn.btn-dark');
        for (const link of links) {
            if (link.textContent.trim() === 'Neu laden' ||
                link.querySelector('svg.bi-arrow-clockwise')) {
                return link;
            }
        }
        return null;
    }

    // ===== APPLY TITLEBAR PASTE BUTTON =====
    function applyTitlebarPasteButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.titlebarPasteButton) {
                const existingBtn = document.getElementById('geizhals-paste-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            // Check if URL is clean (only id parameter, no additional params like mode=log)
            if (!isCleanArticleUrl()) {
                const existingBtn = document.getElementById('geizhals-paste-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            // Find the headbar
            const headbar = document.querySelector('.pane__headbar');
            if (!headbar) return;

            // Find the navbar-nav
            const navbarNav = headbar.querySelector('.navbar-nav');
            if (!navbarNav) return;

            // Remove existing button if present
            const existingBtn = document.getElementById('geizhals-paste-btn');
            if (existingBtn) existingBtn.remove();

            // Create the paste button
            const pasteBtn = document.createElement('button');
            pasteBtn.id = 'geizhals-paste-btn';
            pasteBtn.type = 'button';
            pasteBtn.className = 'py-0 nav-link';
            pasteBtn.textContent = 'Einfügen';

            // Always active style
            pasteBtn.style.cssText = `
                background-color: #ffffff;
                color: #000000;
                border: 1px solid #000000;
                padding: 0 0.3rem;
                line-height: 1;
                height: 1.5rem;
                font-size: 0.875rem;
                border-radius: 0.25rem;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                margin-right: 0.5rem;
                flex-shrink: 0;
                white-space: nowrap;
                min-width: 5rem;
                text-align: center;
            `;

            pasteBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Find and click the native "Einfügen" button in the sidebar
                const nativePasteButton = findNativePasteButton();
                if (nativePasteButton) {
                    nativePasteButton.click();
                }
            });

            pasteBtn.addEventListener('mouseover', () => {
                pasteBtn.style.opacity = '0.8';
            });

            pasteBtn.addEventListener('mouseout', () => {
                pasteBtn.style.opacity = '1';
            });

            // Insert button after copy button (or after save button if no copy button)
            try {
                if (navbarNav && navbarNav.isConnected) {
                    const copyBtn = document.getElementById('geizhals-copy-btn');
                    const saveBtn = document.getElementById('geizhals-save-btn');
                    if (copyBtn && copyBtn.parentElement === navbarNav && copyBtn.nextSibling) {
                        navbarNav.insertBefore(pasteBtn, copyBtn.nextSibling);
                    } else if (copyBtn && copyBtn.parentElement === navbarNav) {
                        navbarNav.appendChild(pasteBtn);
                    } else if (saveBtn && saveBtn.parentElement === navbarNav && saveBtn.nextSibling) {
                        navbarNav.insertBefore(pasteBtn, saveBtn.nextSibling);
                    } else if (saveBtn && saveBtn.parentElement === navbarNav) {
                        navbarNav.appendChild(pasteBtn);
                    } else {
                        // If no save button, insert after clone button
                        const cloneBtn = document.getElementById('geizhals-clone-btn');
                        if (cloneBtn && cloneBtn.parentElement === navbarNav && cloneBtn.nextSibling) {
                            navbarNav.insertBefore(pasteBtn, cloneBtn.nextSibling);
                        } else if (cloneBtn && cloneBtn.parentElement === navbarNav) {
                            navbarNav.appendChild(pasteBtn);
                        } else {
                            navbarNav.insertBefore(pasteBtn, navbarNav.firstChild);
                        }
                    }
                }
            } catch (insertError) {
                // Silently ignore insertBefore errors
            }

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function findNativePasteButton() {
        // The native paste button is a <button> with class "btn-outline-dark" and text "Einfügen"
        // or with SVG class "bi-clipboard"
        const actionPane = document.querySelector('.pane__action');
        if (!actionPane) return null;

        const buttons = actionPane.querySelectorAll('button.btn');
        for (const btn of buttons) {
            if (btn.textContent.trim() === 'Einfügen' ||
                btn.querySelector('svg.bi-clipboard')) {
                return btn;
            }
        }
        return null;
    }

    function applyTitlebarCopyButton() {
        try {
            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.titlebarCopyButton) {
                const existingBtn = document.getElementById('geizhals-copy-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            // Check if URL is clean (only id parameter, no additional params like mode=log)
            if (!isCleanArticleUrl()) {
                const existingBtn = document.getElementById('geizhals-copy-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            // Find the headbar
            const headbar = document.querySelector('.pane__headbar');
            if (!headbar) return;

            // Find the navbar-nav
            const navbarNav = headbar.querySelector('.navbar-nav');
            if (!navbarNav) return;

            // Remove existing button if present
            const existingBtn = document.getElementById('geizhals-copy-btn');
            if (existingBtn) existingBtn.remove();

            // Create the copy button
            const copyBtn = document.createElement('button');
            copyBtn.id = 'geizhals-copy-btn';
            copyBtn.type = 'button';
            copyBtn.className = 'py-0 nav-link';
            copyBtn.textContent = 'Kopieren';

            // Always active style
            copyBtn.style.cssText = `
                background-color: #ffffff;
                color: #000000;
                border: 1px solid #000000;
                padding: 0 0.3rem;
                line-height: 1;
                height: 1.5rem;
                font-size: 0.875rem;
                border-radius: 0.25rem;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                margin-right: 0.5rem;
                flex-shrink: 0;
                white-space: nowrap;
                min-width: 5rem;
                text-align: center;
            `;

            copyBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Find and click the native "Kopieren" button in the sidebar
                const nativeCopyButton = findNativeCopyButton();
                if (nativeCopyButton) {
                    nativeCopyButton.click();
                }
            });

            copyBtn.addEventListener('mouseover', () => {
                copyBtn.style.opacity = '0.8';
            });

            copyBtn.addEventListener('mouseout', () => {
                copyBtn.style.opacity = '1';
            });

            // Insert button after save button (before paste button)
            try {
                if (navbarNav && navbarNav.isConnected) {
                    const pasteBtn = document.getElementById('geizhals-paste-btn');
                    const saveBtn = document.getElementById('geizhals-save-btn');
                    if (pasteBtn && pasteBtn.parentElement === navbarNav) {
                        navbarNav.insertBefore(copyBtn, pasteBtn);
                    } else if (saveBtn && saveBtn.parentElement === navbarNav && saveBtn.nextSibling) {
                        navbarNav.insertBefore(copyBtn, saveBtn.nextSibling);
                    } else if (saveBtn && saveBtn.parentElement === navbarNav) {
                        navbarNav.appendChild(copyBtn);
                    } else {
                        // If no save button, insert after clone button
                        const cloneBtn = document.getElementById('geizhals-clone-btn');
                        if (cloneBtn && cloneBtn.parentElement === navbarNav && cloneBtn.nextSibling) {
                            navbarNav.insertBefore(copyBtn, cloneBtn.nextSibling);
                        } else if (cloneBtn && cloneBtn.parentElement === navbarNav) {
                            navbarNav.appendChild(copyBtn);
                        } else {
                            navbarNav.insertBefore(copyBtn, navbarNav.firstChild);
                        }
                    }
                }
            } catch (insertError) {
                // Silently ignore insertBefore errors
            }

        } catch (e) {
            // Fehler ignorieren
        }
    }

    function findNativeCopyButton() {
        // The native copy button is a <button> with class "btn-outline-dark" and text "Kopieren"
        // or with SVG class "bi-copy"
        const actionPane = document.querySelector('.pane__action');
        if (!actionPane) return null;

        const buttons = actionPane.querySelectorAll('button.btn');
        for (const btn of buttons) {
            if (btn.textContent.trim() === 'Kopieren' ||
                btn.querySelector('svg.bi-copy')) {
                return btn;
            }
        }
        return null;
    }

    // ===== INTERCEPT NATIVE CLONE BUTTON =====
    function setupNativeCloneButtonInterceptor() {
        // Überwache Klicks auf den nativen Klon-Button
        document.addEventListener('click', async (e) => {
            // Wenn bereits ein Klonvorgang läuft, nicht abfangen
            if (isPerformingCloneWithChanges) return;

            const target = e.target.closest('a[name="clone"]');
            if (!target) return;

            const otherSettings = getOtherSettingsConfig();
            if (!otherSettings.cloneApplyChanges) return;

            // Verhindere das Standard-Verhalten
            e.preventDefault();
            e.stopPropagation();

            // Führe die Klonen-mit-Änderungen-Funktion aus
            await performCloneWithChangesApply();
        }, true); // Capture-Phase, um vor dem nativen Handler zu fangen
    }

    function getDisplayLabel(btn, showBrackets) {
        if (btn.variant) {
            return showBrackets ? `${btn.label} ${btn.variant}` : btn.label;
        }
        return btn.label;
    }

    function renderCloneInfo() {
        try {
            const otherSettings = getOtherSettingsConfig();

        const existingContainer = document.getElementById('geizhals-clone-info');
        if (existingContainer) {
            existingContainer.remove();
        }

        // IMMER das Gear-Icon rendern (auch ohne clonedFromId)
        let rightValue = '240px';

        const container = document.createElement('div');
        container.id = 'geizhals-clone-info';
        container.style.cssText = `position: fixed; top: 0.5rem; right: ${rightValue}; display: flex; align-items: center; padding: 0.21rem 0.6rem; z-index: 999; background-color: rgb(248, 249, 250); color: rgb(33, 37, 41); border: 1px solid rgb(222, 226, 230); border-radius: 4px; cursor: default; font-size: 0.875rem; font-weight: 400; opacity: 1; visibility: visible; gap: 0.5rem; height: 1.5rem;`;

        // Gear-Icon (IMMER anzeigen)
        const gearBtn = document.createElement('button');
        gearBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            color: inherit;
            font-size: 1em;
        `;
        gearBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" style="vertical-align: middle;"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"></path></svg>`;
        gearBtn.addEventListener('click', createOverlay);
        container.appendChild(gearBtn);

        // Dropdown-Teil nur anzeigen wenn:
        // 1. Dropdown aktiviert ist UND
        // 2. clonedFromId oder bulkId vorhanden ist
        if (otherSettings.cloneDropdownEnabled && (clonedFromId || bulkId)) {

        // Label als Link (klickbar)
        const labelLink = document.createElement('a');
        const sourceId = bulkId || clonedFromId;
        labelLink.href = `https://opus.geizhals.at/kalif/artikel?id=${sourceId}`;
        labelLink.target = '_blank';
        labelLink.textContent = bulkId ? `Bulk-Klonvorgang: ${bulkId}` : `geklont von: ${clonedFromId}`;
        labelLink.style.cssText = 'font-weight: 500; text-decoration: none; color: inherit;';
        labelLink.addEventListener('mouseenter', () => {
            labelLink.style.textDecoration = 'underline';
        });
        labelLink.addEventListener('mouseleave', () => {
            labelLink.style.textDecoration = 'none';
        });
        container.appendChild(labelLink);

        // Dropdown-Button (Pfeil nach unten)
        const dropdownBtn = document.createElement('button');
        dropdownBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            color: inherit;
            font-size: 0.85em;
        `;
        dropdownBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"></path></svg>`;

        // Dropdown-Menu
        const dropdown = document.createElement('div');
        dropdown.id = 'geizhals-clone-dropdown';
        dropdown.style.cssText = `
            display: none;
            position: fixed;
            top: 2.2rem;
            right: ${rightValue};
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 1000;
            min-width: 280px;
            padding: 0.5rem 0;
        `;

        const domain = otherSettings.cloneDropdownDomain || 'DE';
        const baseId = bulkId || clonedFromId;

        // Dropdown-Einträge
        const items = [
            { label: 'Vergleich PV', url: `https://geizhals.${domain.toLowerCase()}/?cmp=${baseId}&cmp=${currentId}&active=1` },
            { label: 'Vergleich Kalif', url: `https://opus.geizhals.at/kalif/artikel/diff#id=${currentId}&id=${baseId}&primary=${baseId}` },
            { label: 'Vergleich Bilder', url: `https://opus.geizhals.at/kalif/artikel/mass-image?artikel=${baseId}&artikel=${currentId}&autoGallery=true` }
        ];

        items.forEach(item => {
            const itemLink = document.createElement('a');
            itemLink.href = item.url;
            itemLink.target = '_blank';
            itemLink.textContent = item.label;
            itemLink.style.cssText = `
                display: block;
                padding: 0.5rem 1rem;
                text-decoration: none;
                color: #212529;
                transition: background-color 0.2s;
            `;
            itemLink.addEventListener('mouseenter', () => {
                itemLink.style.backgroundColor = '#f8f9fa';
            });
            itemLink.addEventListener('mouseleave', () => {
                itemLink.style.backgroundColor = '';
            });
            itemLink.addEventListener('click', () => {
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(itemLink);
        });

        // Separator
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background: #dee2e6; margin: 0.5rem 0;';
        dropdown.appendChild(separator);

        // Input-Handler für Aktivierung - Hilfsfunktion
        function parseAdditionalIds(text) {
            if (!text || !text.trim()) return [];

            // Split by newlines, commas, or spaces
            const ids = text.split(/[\n,\s]+/).filter(id => id.trim());
            return ids.map(id => id.trim()).filter(id => /^\d+$/.test(id));
        }

        // "Vergleichen PV mit zus. IDs" mit Eingabefeld
        const pvWithInputContainer = document.createElement('div');
        pvWithInputContainer.className = 'gh-dropdown__item-with-input';
        pvWithInputContainer.style.cssText = `
            padding: 0.5rem 1rem;
            opacity: 0.5;
        `;
        pvWithInputContainer.dataset.mode = 'pv-additional';

        // Label mit Tooltip
        const pvLabelContainer = document.createElement('div');
        pvLabelContainer.style.cssText = 'display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;';

        const pvLabel = document.createElement('label');
        pvLabel.textContent = 'Vergleichen PV mit zus. IDs:';
        pvLabel.style.cssText = 'font-size: 0.8rem; font-weight: 500; pointer-events: none; margin: 0;';

        const pvTooltipIcon = document.createElement('span');
        pvTooltipIcon.innerHTML = '&#9432;'; // Info icon (ℹ)
        pvTooltipIcon.title = 'IDs können getrennt werden durch:\n• Zeilenumbrüche\n• Kommas\n• Leerzeichen\n\nBeispiele:\n123,456,789\n123 456 789';
        pvTooltipIcon.style.cssText = `
            font-size: 0.75rem;
            color: #6c757d;
            cursor: help;
            pointer-events: auto;
            border: 1px solid #6c757d;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        `;

        pvLabelContainer.appendChild(pvLabel);
        pvLabelContainer.appendChild(pvTooltipIcon);
        pvWithInputContainer.appendChild(pvLabelContainer);

        // Input + Button Wrapper
        const pvInputWrapper = document.createElement('div');
        pvInputWrapper.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';

        const pvInput = document.createElement('input');
        pvInput.type = 'text';
        pvInput.id = 'gh-additional-pv-input';
        pvInput.placeholder = 'IDs eingeben...';
        pvInput.style.cssText = `
            flex: 1;
            padding: 0.3rem 0.5rem;
            border: 1px solid #ced4da;
            border-radius: 3px;
            font-size: 0.8rem;
            pointer-events: auto;
        `;
        pvInput.addEventListener('click', (e) => e.stopPropagation());
        pvInput.addEventListener('mousedown', (e) => e.stopPropagation());
        pvInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                pvButton.click();
            }
        });

        const pvButton = document.createElement('button');
        pvButton.type = 'button';
        pvButton.textContent = 'Go';
        pvButton.style.cssText = `
            padding: 0.3rem 0.75rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            font-size: 0.8rem;
            cursor: pointer;
            pointer-events: auto;
            transition: background-color 0.2s;
            opacity: 0.5;
        `;
        pvButton.disabled = true;
        pvButton.addEventListener('mouseenter', () => {
            if (!pvButton.disabled) {
                pvButton.style.backgroundColor = '#0056b3';
            }
        });
        pvButton.addEventListener('mouseleave', () => {
            if (!pvButton.disabled) {
                pvButton.style.backgroundColor = '#007bff';
            }
        });
        pvButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const additionalIds = parseAdditionalIds(pvInput.value);
            if (additionalIds.length === 0) return;

            const allIds = [baseId, ...additionalIds];
            const cmpParams = allIds.map(id => `cmp=${id}`).join('&');
            const url = `https://geizhals.${domain.toLowerCase()}/?${cmpParams}&active=1`;
            window.open(url, '_blank');
            dropdown.style.display = 'none';
        });

        pvInputWrapper.appendChild(pvInput);
        pvInputWrapper.appendChild(pvButton);
        pvWithInputContainer.appendChild(pvInputWrapper);

        dropdown.appendChild(pvWithInputContainer);

        // "Vergleichen Kalif mit zus. IDs" mit Eingabefeld
        const kalifWithInputContainer = document.createElement('div');
        kalifWithInputContainer.className = 'gh-dropdown__item-with-input';
        kalifWithInputContainer.style.cssText = `
            padding: 0.5rem 1rem;
            opacity: 0.5;
        `;
        kalifWithInputContainer.dataset.mode = 'kalif-additional';

        // Label mit Tooltip
        const kalifLabelContainer = document.createElement('div');
        kalifLabelContainer.style.cssText = 'display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;';

        const kalifLabel = document.createElement('label');
        kalifLabel.textContent = 'Vergleichen Kalif mit zus. IDs:';
        kalifLabel.style.cssText = 'font-size: 0.8rem; font-weight: 500; pointer-events: none; margin: 0;';

        const kalifTooltipIcon = document.createElement('span');
        kalifTooltipIcon.innerHTML = '&#9432;'; // Info icon (ℹ)
        kalifTooltipIcon.title = 'IDs können getrennt werden durch:\n• Zeilenumbrüche\n• Kommas\n• Leerzeichen\n\nBeispiele:\n123,456,789\n123 456 789';
        kalifTooltipIcon.style.cssText = `
            font-size: 0.75rem;
            color: #6c757d;
            cursor: help;
            pointer-events: auto;
            border: 1px solid #6c757d;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        `;

        kalifLabelContainer.appendChild(kalifLabel);
        kalifLabelContainer.appendChild(kalifTooltipIcon);
        kalifWithInputContainer.appendChild(kalifLabelContainer);

        // Input + Button Wrapper
        const kalifInputWrapper = document.createElement('div');
        kalifInputWrapper.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';

        const kalifInput = document.createElement('input');
        kalifInput.type = 'text';
        kalifInput.id = 'gh-additional-kalif-input';
        kalifInput.placeholder = 'IDs eingeben...';
        kalifInput.style.cssText = `
            flex: 1;
            padding: 0.3rem 0.5rem;
            border: 1px solid #ced4da;
            border-radius: 3px;
            font-size: 0.8rem;
            pointer-events: auto;
        `;
        kalifInput.addEventListener('click', (e) => e.stopPropagation());
        kalifInput.addEventListener('mousedown', (e) => e.stopPropagation());
        kalifInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                kalifButton.click();
            }
        });

        const kalifButton = document.createElement('button');
        kalifButton.type = 'button';
        kalifButton.textContent = 'Go';
        kalifButton.style.cssText = `
            padding: 0.3rem 0.75rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            font-size: 0.8rem;
            cursor: pointer;
            pointer-events: auto;
            transition: background-color 0.2s;
            opacity: 0.5;
        `;
        kalifButton.disabled = true;
        kalifButton.addEventListener('mouseenter', () => {
            if (!kalifButton.disabled) {
                kalifButton.style.backgroundColor = '#0056b3';
            }
        });
        kalifButton.addEventListener('mouseleave', () => {
            if (!kalifButton.disabled) {
                kalifButton.style.backgroundColor = '#007bff';
            }
        });
        kalifButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const additionalIds = parseAdditionalIds(kalifInput.value);
            if (additionalIds.length === 0) return;

            const allIds = [currentId, baseId, ...additionalIds];
            const idParams = allIds.map(id => `id=${id}`).join('&');
            const url = `https://opus.geizhals.at/kalif/artikel/diff#${idParams}&primary=${baseId}`;
            window.open(url, '_blank');
            dropdown.style.display = 'none';
        });

        kalifInputWrapper.appendChild(kalifInput);
        kalifInputWrapper.appendChild(kalifButton);
        kalifWithInputContainer.appendChild(kalifInputWrapper);

        dropdown.appendChild(kalifWithInputContainer);

        pvInput.addEventListener('input', () => {
            const hasIds = parseAdditionalIds(pvInput.value).length > 0;
            if (hasIds) {
                pvWithInputContainer.style.opacity = '1';
                pvButton.disabled = false;
                pvButton.style.opacity = '1';
                pvButton.style.cursor = 'pointer';
            } else {
                pvWithInputContainer.style.opacity = '0.5';
                pvButton.disabled = true;
                pvButton.style.opacity = '0.5';
                pvButton.style.cursor = 'not-allowed';
            }
        });

        kalifInput.addEventListener('input', () => {
            const hasIds = parseAdditionalIds(kalifInput.value).length > 0;
            if (hasIds) {
                kalifWithInputContainer.style.opacity = '1';
                kalifButton.disabled = false;
                kalifButton.style.opacity = '1';
                kalifButton.style.cursor = 'pointer';
            } else {
                kalifWithInputContainer.style.opacity = '0.5';
                kalifButton.disabled = true;
                kalifButton.style.opacity = '0.5';
                kalifButton.style.cursor = 'not-allowed';
            }
        });

        // Toggle Dropdown
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        container.appendChild(dropdownBtn);
        document.body.appendChild(container);
        document.body.appendChild(dropdown);

        // Update created-from position wenn es existiert
        setTimeout(() => {
            applyCreatedFromInfoInTitlebar();
        }, 0);
        } else {
            // Wenn kein Dropdown angezeigt wird, trotzdem Gear-Icon hinzufügen
            document.body.appendChild(container);

            // Update created-from position wenn es existiert
            setTimeout(() => {
                applyCreatedFromInfoInTitlebar();
            }, 0);
        }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // ===== MAIN EXECUTION =====
    const urlParams = new URLSearchParams(window.location.search);

    currentId = urlParams.get('id') || urlParams.get('clone_id');
    const isCloneMode = urlParams.has('clone_id');

    if (!currentId || isNaN(parseInt(currentId))) {
        return;
    }

    function getClonedFromIdFromHTML() {
        const grid = document.querySelector('div[style*="grid-template-columns: 48px auto auto"]');
        if (!grid) return null;

        const html = grid.outerHTML;
        const match = html.match(/Klon von\s*<\/strong>\s*<a[^>]*>(\d+)<\/a>/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    function getClonedFromIdFromLogPage() {
        return new Promise((resolve) => {
            const logUrl = `https://opus.geizhals.at/kalif/artikel?id=${currentId}&mode=log`;

            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display: none !important; width: 0; height: 0; border: none;';
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');

            let timeoutId = null;
            let isResolved = false;

            function checkForClonedId() {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!iframeDoc) return;

                    const html = iframeDoc.documentElement.outerHTML;

                    // Zuerst nach normalem CREATE mit "Cloned from" suchen
                    const cloneMatch = html.match(/Cloned from\s*(?:=&gt;)?\s*(\d+)/i);

                    if (cloneMatch && cloneMatch[1]) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        try {
                            iframe.remove();
                        } catch (e) {
                            // ignore
                        }
                        resolve({ type: 'clone', id: cloneMatch[1] });
                        return;
                    }

                    // Dann nach BULK-CREATE mit "bulk_artikel_id" suchen
                    const bulkMatch = html.match(/bulk_artikel_id\s+(\d+)/i);

                    if (bulkMatch && bulkMatch[1]) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        try {
                            iframe.remove();
                        } catch (e) {
                            // ignore
                        }
                        resolve({ type: 'bulk', id: bulkMatch[1] });
                        return;
                    }
                } catch (error) {
                    // ignore
                }
            }

            const checkInterval = setInterval(() => {
                if (isResolved) {
                    clearInterval(checkInterval);
                    return;
                }
                checkForClonedId();
            }, 100);

            timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    clearInterval(checkInterval);
                    try {
                        iframe.remove();
                    } catch (e) {
                        // ignore
                    }
                    resolve(null);
                }
            }, 5000);

            iframe.onload = () => {
                checkForClonedId();
            };

            iframe.onerror = () => {
                if (!isResolved) {
                    isResolved = true;
                    clearInterval(checkInterval);
                    clearTimeout(timeoutId);
                    try {
                        iframe.remove();
                    } catch (e) {
                        // ignore
                    }
                    resolve(null);
                }
            };

            iframe.src = logUrl;
            document.body.appendChild(iframe);
        });
    }

    // ===== GET CREATED FROM USER FROM LOG PAGE =====
    function getCreatedFromUserFromLogPage() {
        return new Promise((resolve) => {
            const logUrl = `https://opus.geizhals.at/kalif/artikel?id=${currentId}&mode=log`;

            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display: none !important; width: 0; height: 0; border: none;';
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');

            let timeoutId = null;
            let isResolved = false;

            function checkForCreateUser() {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!iframeDoc) return;

                    // Suche nach allen Tabellen
                    const tables = iframeDoc.querySelectorAll('table');

                    for (let table of tables) {
                        const tbody = table.querySelector('tbody') || table;
                        const rows = tbody.querySelectorAll('tr');

                        for (let row of rows) {
                            const cells = row.querySelectorAll('td');
                            if (cells.length >= 3) {
                                // Suche nach <code>CREATE</code> in der Zeile
                                const codeElements = row.querySelectorAll('code');
                                let foundCreate = false;
                                for (let code of codeElements) {
                                    if (code.textContent.trim() === 'CREATE') {
                                        foundCreate = true;
                                        break;
                                    }
                                }

                                // Fallback: Suche nach CREATE im Text der Zeile
                                if (!foundCreate) {
                                    const rowText = row.textContent;
                                    if (rowText.includes('CREATE') && !rowText.includes('CREATEVAR')) {
                                        foundCreate = true;
                                    }
                                }

                                if (foundCreate) {
                                    // Versuche verschiedene Spalten-Kombinationen
                                    // Standard: Spalte 2 = Datum (Index 1), Spalte 3 = User (Index 2)
                                    let dateCell = cells[1];
                                    let userCell = cells[2];

                                    // Fallback wenn weniger Spalten
                                    if (cells.length === 3) {
                                        dateCell = cells[0];
                                        userCell = cells[1];
                                    }

                                    const userRaw = userCell ? userCell.textContent.trim() : '';
                                    const dateRaw = dateCell ? dateCell.textContent.trim() : '';

                                    if (!userRaw || !dateRaw) continue;

                                    // Datum-Format transformieren: YYYY.MM.DD [HH:MM] → relatives Format
                                    let formattedDate = dateRaw;
                                    try {
                                        const dateParts = dateRaw.split(' ');
                                        const hasTime = dateParts.length >= 2;
                                        const dateStr = dateParts[0];
                                        const time = hasTime ? dateParts[1] : null;

                                        const dateFormatted = dateStr
                                            .split('.')
                                            .reverse()
                                            .join('.');

                                        // Relatives Datum berechnen
                                        const [year, month, day] = dateStr.split('.').map(Number);
                                        const createdDate = new Date(year, month - 1, day);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        createdDate.setHours(0, 0, 0, 0);

                                        const diffMs = today - createdDate;
                                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                                        let relativeText = '';

                                        if (diffDays === 0) {
                                            relativeText = hasTime ? `Heute ${time}` : 'Heute';
                                        } else if (diffDays === 1) {
                                            relativeText = hasTime ? `gestern ${time}` : 'gestern';
                                        } else if (diffDays < 365) {
                                            relativeText = `vor ${diffDays} Tagen`;
                                        } else {
                                            const years = Math.floor(diffDays / 365);
                                            const remainingDays = diffDays % 365;

                                            if (years === 1) {
                                                if (remainingDays === 0) {
                                                    relativeText = 'vor 1 Jahr';
                                                } else if (remainingDays === 1) {
                                                    relativeText = 'vor 1 Jahr + 1 Tag';
                                                } else {
                                                    relativeText = `vor 1 Jahr + ${remainingDays} Tagen`;
                                                }
                                            } else {
                                                if (remainingDays === 0) {
                                                    relativeText = `vor ${years} Jahren`;
                                                } else if (remainingDays === 1) {
                                                    relativeText = `vor ${years} Jahren + 1 Tag`;
                                                } else {
                                                    relativeText = `vor ${years} Jahren + ${remainingDays} Tagen`;
                                                }
                                            }
                                        }

                                        formattedDate = `${relativeText} - ${dateFormatted}`;
                                    } catch (e) {
                                        // Bei Fehler Originalformat beibehalten
                                    }

                                    isResolved = true;
                                    clearTimeout(timeoutId);
                                    try {
                                        iframe.remove();
                                    } catch (e) {
                                        // ignore
                                    }
                                    resolve({ user: userRaw, date: formattedDate });
                                    return;
                                }
                            }
                        }
                    }
                } catch (error) {
                    // ignore
                }
            }

            const checkInterval = setInterval(() => {
                if (isResolved) {
                    clearInterval(checkInterval);
                    return;
                }
                checkForCreateUser();
            }, 100);

            timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    clearInterval(checkInterval);
                    try {
                        iframe.remove();
                    } catch (e) {
                        // ignore
                    }
                    resolve(null);
                }
            }, 8000); // Längerer Timeout da mehr zu laden

            iframe.onload = () => {
                checkForCreateUser();
            };

            iframe.onerror = () => {
                if (!isResolved) {
                    isResolved = true;
                    clearInterval(checkInterval);
                    clearTimeout(timeoutId);
                    try {
                        iframe.remove();
                    } catch (e) {
                        // ignore
                    }
                    resolve(null);
                }
            };

            iframe.src = logUrl;
            document.body.appendChild(iframe);
        });
    }

    // ===== APPLY CREATED FROM INFO IN TITLEBAR =====
    function applyCreatedFromInfoInTitlebar() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Entferne existierendes Element
            const existingElement = document.getElementById('geizhals-created-from-info');
            if (existingElement) {
                existingElement.remove();
            }

            if (!otherSettings.titlebarCreatedFromInTitlebar) {
                return;
            }

            if (!createdFromUser || !createdFromUserDate) {
                return;
            }

        // Erstelle neuen Container für Created-From-Info
        const createdFromContainer = document.createElement('div');
        createdFromContainer.id = 'geizhals-created-from-info';
        createdFromContainer.style.cssText = `
            position: fixed;
            top: 0.5rem;
            display: flex;
            align-items: center;
            padding: 0.21rem 0.6rem;
            z-index: 999;
            background-color: rgb(248, 249, 250);
            color: rgb(33, 37, 41);
            border: 1px solid rgb(222, 226, 230);
            border-radius: 4px;
            cursor: default;
            font-size: 0.875rem;
            font-weight: 400;
            opacity: 1;
            visibility: visible;
            gap: 0.2rem;
            height: 1.5rem;
        `;

        // Positioniere das Element
        // Finde den geizhals-clone-info Container für dynamische Positionierung
        const cloneInfoContainer = document.getElementById('geizhals-clone-info');
        if (cloneInfoContainer) {
            // Positioniere links neben dem clone-info Container
            const cloneInfoRight = parseInt(cloneInfoContainer.style.right) || 240;
            const cloneInfoWidth = cloneInfoContainer.offsetWidth;
            createdFromContainer.style.right = (cloneInfoRight + cloneInfoWidth + 10) + 'px';
        } else {
            // Fallback: Feste Position wenn clone-info nicht existiert
            createdFromContainer.style.right = '240px';
        }

        // Inhalt: "von: [user] ([date])"
        const textSpan = document.createElement('span');
        const dateText = createdFromUserDate;

        // Mache "Heute" bold wenn es im Text vorkommt
        if (dateText && dateText.includes('Heute')) {
            const parts = dateText.split('Heute');
            textSpan.innerHTML = `von: ${createdFromUser} (${parts[0]}<strong>Heute</strong>${parts[1] || ''})`;
        } else {
            textSpan.textContent = `von: ${createdFromUser} (${dateText})`;
        }

        createdFromContainer.appendChild(textSpan);

        document.body.appendChild(createdFromContainer);
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // Async Funktion zum Laden der Created-From-Info (nicht blockierend)
    async function loadCreatedFromInfo() {
        const otherSettings = getOtherSettingsConfig();
        if (!otherSettings.titlebarCreatedFromInTitlebar) {
            return;
        }

        try {
            const createdFromData = await getCreatedFromUserFromLogPage();
            if (createdFromData) {
                createdFromUser = createdFromData.user;
                createdFromUserDate = createdFromData.date;
                applyCreatedFromInfoInTitlebar();
            }
        } catch (e) {
            createdFromUser = null;
            createdFromUserDate = null;
        }
    }

    if (isCloneMode) {
        clonedFromId = getClonedFromIdFromHTML();
        if (!clonedFromId) {
            try {
                const logResult = await getClonedFromIdFromLogPage();
                if (logResult) {
                    if (logResult.type === 'bulk') {
                        bulkId = logResult.id;
                        clonedFromId = logResult.id;  // Setze auch clonedFromId damit die Anzeige funktioniert
                    } else {
                        clonedFromId = logResult.id;
                    }
                    // Re-render clone info with dropdown now that we have the ID
                    renderCloneInfo();
                }
            } catch (e) {
                clonedFromId = null;
            }
        }
    } else {
        try {
            const logResult = await getClonedFromIdFromLogPage();
            if (logResult) {
                if (logResult.type === 'bulk') {
                    bulkId = logResult.id;
                    clonedFromId = logResult.id;  // Setze auch clonedFromId damit die Anzeige funktioniert
                } else {
                    clonedFromId = logResult.id;
                }
                // Re-render clone info with dropdown now that we have the ID
                renderCloneInfo();
            }
        } catch (e) {
            clonedFromId = null;
        }
    }


    function tryInjectOnce() {
        try {
            // Gear-Icon immer rendern/aktualisieren (auch wenn clonedFromId später kommt)
            if (!document.getElementById('geizhals-clone-info')) {
                renderCloneInfo();
            }

            if (!initDone.nativeInterceptor) {
                setupNativeCloneButtonInterceptor();
                initDone.nativeInterceptor = true;
            }

            if (!initDone.pendingClone) {
                checkAndCompletePendingClone();
                initDone.pendingClone = true;
            }

            // Auto-collapse sidebar on initial load if setting is enabled
            if (isCleanArticleUrl()) {
                const urlParams = new URLSearchParams(window.location.search);
                const hasIdParam = urlParams.has('id');
                const hasCloneId = urlParams.has('clone_id');
                if (hasIdParam && !hasCloneId) {
                    const otherSettings = getOtherSettingsConfig();
                    if (otherSettings.sidebarAutoCollapse) {
                        // Prüfe ob Modus 'maxWidth': nur einklappen wenn Fensterbreite <= maxWidth
                        // Verwende physische Pixel (innerWidth * devicePixelRatio) für korrekte Berechnung bei HiDPI-Displays
                        const currentWidth = Math.floor(window.innerWidth * window.devicePixelRatio);
                        const maxWidth = otherSettings.sidebarAutoCollapseMaxWidth || 2560;

                        const shouldCollapse = otherSettings.sidebarAutoCollapseMode === 'maxWidth'
                            ? currentWidth <= maxWidth
                            : true; // 'always' Modus

                        if (shouldCollapse) {
                            // Mehrere Versuche mit steigenden Verzögerungen für robusteres Einklappen
                            const collapseDelays = [300, 800, 1500, 2500, 4000];
                            collapseDelays.forEach(delay => {
                                setTimeout(() => {
                                    const sidebarBtn = getSidebarButton();
                                    if (sidebarBtn && !isSidebarCollapsed()) {
                                        sidebarBtn.click();
                                    }
                                }, delay);
                            });
                        }
                    }
                }
            }

            if (clonedFromId) {
                applyCloneOptionsToPage();
            }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // Separate Funktion für DOM-abhängige Features
    function applyDomDependentFeatures() {
        try {
            const otherSettings = getOtherSettingsConfig();

            // Sidebar Toggle Button
            if (otherSettings.sidebarToggleButtonInHeadbar && isCleanArticleUrl()) {
                if (!document.getElementById('geizhals-sidebar-toggle-btn')) {
                    const headbar = document.querySelector('.pane__headbar');
                    const navbarNav = headbar ? headbar.querySelector('.navbar-nav') : null;
                    if (headbar && navbarNav) {
                        applySidebarToggleButton();
                    }
                }
            }

            // Titlebar Clone Button
            if (otherSettings.titlebarCloneButton && isCleanArticleUrl()) {
                if (!document.getElementById('geizhals-clone-btn')) {
                    const headbar = document.querySelector('.pane__headbar');
                    const navbarNav = headbar ? headbar.querySelector('.navbar-nav') : null;
                    if (headbar && navbarNav) {
                        applyTitlebarCloneButton();
                    }
                }
            }

            // Titlebar Save Button
            if (otherSettings.titlebarSaveButton && isCleanArticleUrl()) {
                if (!document.getElementById('geizhals-save-btn')) {
                    const headbar = document.querySelector('.pane__headbar');
                    const navbarNav = headbar ? headbar.querySelector('.navbar-nav') : null;
                    if (headbar && navbarNav) {
                        applyTitlebarSaveButton();
                    }
                }
            }

            // Titlebar Copy Button
            if (otherSettings.titlebarCopyButton && isCleanArticleUrl()) {
                if (!document.getElementById('geizhals-copy-btn')) {
                    const headbar = document.querySelector('.pane__headbar');
                    const navbarNav = headbar ? headbar.querySelector('.navbar-nav') : null;
                    if (headbar && navbarNav) {
                        applyTitlebarCopyButton();
                    }
                }
            }

            // Titlebar Paste Button
            if (otherSettings.titlebarPasteButton && isCleanArticleUrl()) {
                if (!document.getElementById('geizhals-paste-btn')) {
                    const headbar = document.querySelector('.pane__headbar');
                    const navbarNav = headbar ? headbar.querySelector('.navbar-nav') : null;
                    if (headbar && navbarNav) {
                        applyTitlebarPasteButton();
                    }
                }
            }

            // Titlebar Reload Button
            if (otherSettings.titlebarReloadButton && isCleanArticleUrl()) {
                if (!document.getElementById('geizhals-reload-btn')) {
                    const headbar = document.querySelector('.pane__headbar');
                    const navbarNav = headbar ? headbar.querySelector('.navbar-nav') : null;
                    if (headbar && navbarNav) {
                        applyTitlebarReloadButton();
                    }
                }
            }

            // Titlebar ID Copy Icon
            if (otherSettings.titlebarIdCopyIcon) {
                if (!document.querySelector('.geizhals-titlebar-copy-icon')) {
                    const titleContainer = document.querySelector('div[style*="grid-column: 2 / -1"]');
                    const link = titleContainer ? titleContainer.querySelector('a[href*="kalif/artikel"]') : null;
                    if (titleContainer && link) {
                        applyTitlebarIdCopyIcon();
                    }
                }
            }

            // Image Gallery Hover Preview
            if (otherSettings.imageGalleryHoverPreview) {
                // Prüfe ob URL korrekt ist (kein mode/clone Parameter)
                const url = new URL(window.location.href);
                const hasMode = url.searchParams.has('mode');
                const hasClone = url.searchParams.has('clone') || url.searchParams.has('clone_id');
                const containerExists = document.querySelector('.geizhals-image-gallery-container');

                if (!hasMode && !hasClone && !containerExists) {
                    applyImageGalleryHoverPreview();
                }
            }

            // Titlebar Datasheets
            if (otherSettings.titlebarDatasheets) {
                if (!document.querySelector('.geizhals-datasheet-favicons')) {
                    applyTitlebarDatasheets();
                }
            }

            // Created From Info
            if (otherSettings.titlebarCreatedFromInTitlebar) {
                if (!document.getElementById('geizhals-created-from-info') && !createdFromUser) {
                    loadCreatedFromInfo();
                }
            }

            // Titlebar ID Link
            applyTitlebarIdLink();
            applyTitlebarRemoveHerstellerLink();

            // Image Viewer
            applyImageViewerBehavior();

            // Preview Search Field

            // Global Search Overlay

            // Preview Section Search Overlay
            applyPreviewSectionSearchOverlay();

            // Description Header Search Field

            // Header Separator Line

            // Comment Field Collapse
            applyCommentFieldCollapse();

            // MPN Overlay Button
            applyMpnOverlayButton();

            // Herstellerlink Overlay Button
            applyHerstellerlinkOverlayButton();

            // Herstellerlink Case Converter Button
            applyHerstellerlinkCaseButton();

            // Matchrule Container Reorder
            applyMatchruleContainerReorder();

            // Bezeichnung KV Hinweis entfernen
            applyBezeichnungKvHinweisEntfernen();

            // Links Count Display
            applyLinksCountDisplay();

            // Links Add Article IDs Button
            applyLinksAddArticleIds();

            // Grid Divider - wird angezeigt wenn secondary pane vorhanden ist (Vergleichsansicht)
            if (otherSettings.gridDivider) {
                if (!document.querySelector('.grid-divider-overlay')) {
                    const primaryPane = document.querySelector('.pane__primary');
                    const secondaryPane = document.querySelector('.pane__secondary');
                    const panesContainer = document.querySelector('.panes');
                    // Nur initialisieren wenn beide Panes vorhanden und nicht im "no-secondary" Modus
                    if (primaryPane && secondaryPane && panesContainer && !panesContainer.classList.contains('panes--no-secondary')) {
                        initGridDividerModule();
                    }
                }
            }
        } catch (e) {
            // Fehler ignorieren
        }
    }

    // Haupt-Initialisierung
    function fullInit() {
        try {
            tryInjectOnce();
            applyDomDependentFeatures();
        } catch (e) {
            // Fehler ignorieren
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fullInit);
    } else {
        fullInit();
    }

    // Wiederholte Versuche für langsam ladende DOM-Elemente
    setTimeout(applyDomDependentFeatures, 300);
    setTimeout(applyDomDependentFeatures, 600);
    setTimeout(applyDomDependentFeatures, 1000);
    setTimeout(applyDomDependentFeatures, 1500);
    setTimeout(applyDomDependentFeatures, 2500);
    setTimeout(applyDomDependentFeatures, 4000);

    // Start URL monitoring to update sidebar button visibility
    setInterval(checkUrlChangedAndUpdateButton, 200);

})();

// Global error handler - unterdrücke DOM-Manipulations-Fehler
window.addEventListener('error', (event) => {
    if (event.message && (
        (event.message.includes('removeChild') && event.message.includes('not a child')) ||
        (event.message.includes('insertBefore') && event.message.includes('not a child'))
    )) {
        event.preventDefault();
        event.stopPropagation();
        return true;
    }
});

// Global unhandled promise rejection handler - unterdrücke DOM-Manipulations-Fehler
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && (
        (event.reason.message.includes('removeChild') && event.reason.message.includes('not a child')) ||
        (event.reason.message.includes('insertBefore') && event.reason.message.includes('not a child'))
    )) {
        event.preventDefault();
        event.stopPropagation();
        return true;
    }
});