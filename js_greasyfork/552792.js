// ==UserScript==
// @name         enhanced artikel-bilderansicht
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.2.2
// @description  Download-Button, Öffnen-Link, verbesserte Button-Verwaltung
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel?id=*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/552792/enhanced%20artikel-bilderansicht.user.js
// @updateURL https://update.greasyfork.org/scripts/552792/enhanced%20artikel-bilderansicht.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Nicht in iframes ausführen - verhindert mehrfache Skript-Instanzen
    try {
        if (window.self !== window.top) return;
    } catch (e) {
        // Cross-origin iframe - auch nicht ausführen
        return;
    }

    // Zusätzliche Prüfung: Nur auf der erwarteten Seite ausführen
    if (!window.location.pathname.startsWith('/kalif/artikel')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedArtikelBilderansichtInitialized) return;
    window.__enhancedArtikelBilderansichtInitialized = true;

    // Globale Variablen
    let initialImageCount = 0;
    let initialImageOrder = [];
    let hasChanges = false;
    let hasSaveChanges = false;
    let isResetting = false;
    let isUpdating = false;
    let saveButton = null;
    let downloadButton = null;
    let sizeDropdown = null;
    let dropdownContainer = null;
    let dropdownLabel = null;
    let urlObserver = null;
    let lastUrl = '';
    let debounceTimer = null;
    const IMAGE_SIZE_KEY = 'geizhals_image_size_setting';

    // Bildgrößen-Konfiguration
    const IMAGE_SIZES = {
        'large': { label: 'Groß (Standard)', height: '24rem', gridMin: '24rem' },
        'medium': { label: 'Mittel', height: '16.8rem', gridMin: '16.8rem' },
        'small': { label: 'Klein', height: '12rem', gridMin: '12rem' }
    };

    // Extrahiere die ID aus der URL
    function getArticleId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Prüfe ob wir auf der Bilder-Seite sind (mode=image)
    function isImageMode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('mode') === 'image';
    }

    // Erfasse den initialen Zustand
    function captureInitialState() {
        const imageContainers = document.querySelectorAll('div[draggable="true"][role="button"]');
        initialImageCount = imageContainers.length;
        initialImageOrder = Array.from(imageContainers).map(container => {
            const img = container.querySelector('img');
            return img ? img.src : null;
        }).filter(src => src !== null);
    }

    // Prüfe ob sich etwas geändert hat
    function checkForChanges() {
        const imageContainers = document.querySelectorAll('div[draggable="true"][role="button"]');
        const currentImageCount = imageContainers.length;
        const currentImageOrder = Array.from(imageContainers).map(container => {
            const img = container.querySelector('img');
            return img ? img.src : null;
        }).filter(src => src !== null);

        // Prüfe ob sich die Anzahl geändert hat
        if (currentImageCount !== initialImageCount) {
            return true;
        }

        // Prüfe ob sich die Reihenfolge geändert hat
        if (currentImageOrder.length !== initialImageOrder.length) {
            return true;
        }

        for (let i = 0; i < currentImageOrder.length; i++) {
            if (currentImageOrder[i] !== initialImageOrder[i]) {
                return true;
            }
        }

        return false;
    }

    // Setze alle Buttons auf neutral zurück
    function resetButtonsToNeutral() {
        isResetting = true;

        // Reset Flags
        hasChanges = false;
        hasSaveChanges = false;

        // Reset Save Button
        if (saveButton) {
            saveButton.className = saveButton.className.replace('btn-success', 'btn-secondary');
        }

        // Erfasse neuen Ausgangszustand
        setTimeout(() => {
            captureInitialState();
            isResetting = false;
        }, 1000);
    }

    // Aktualisiere den Save-Button Style
    function updateSaveButtonStyle() {
        if (!saveButton || isResetting) return;

        if (checkForChanges() || hasSaveChanges) {
            saveButton.className = saveButton.className.replace('btn-secondary', 'btn-success');
        }
    }

    // Setze Save-Button auf neutral
    function setSaveButtonNeutral() {
        if (!saveButton) return;
        saveButton.className = saveButton.className.replace('btn-success', 'btn-secondary');
    }

    // Markiere dass Änderungen vorgenommen wurden
    function markSaveChanges() {
        hasSaveChanges = true;
        updateSaveButtonStyle();
    }

    // Download alle Bilder
    async function downloadAllImages() {
        const articleId = getArticleId();
        const imageContainers = document.querySelectorAll('div[draggable="true"][role="button"]');

        if (imageContainers.length === 0) return;

        for (let i = 0; i < imageContainers.length; i++) {
            const container = imageContainers[i];
            const img = container.querySelector('img');

            if (img && img.src) {
                try {
                    // Lade das Bild
                    const response = await fetch(img.src);
                    const blob = await response.blob();

                    // Erstelle Download-Link
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${articleId}_${i}.webp`;

                    document.body.appendChild(a);
                    a.click();

                    // Cleanup
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    // Kleine Verzögerung zwischen Downloads
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    try { console.error(`Fehler beim Download von Bild ${i}:`, error); } catch (e) {}
                }
            }
        }
    }

    // Aktualisiere Download-Button Status
    function updateDownloadButtonState() {
        if (!downloadButton) return;

        const imageContainers = document.querySelectorAll('div[draggable="true"][role="button"]');
        downloadButton.disabled = imageContainers.length === 0;
    }

    // Wende Bildgröße an
    function applyImageSize(size) {
        const images = document.querySelectorAll('div[draggable="true"][role="button"] img');
        const height = IMAGE_SIZES[size].height;
        const gridMin = IMAGE_SIZES[size].gridMin;

        images.forEach(img => {
            img.style.maxHeight = height;
        });

        const firstImageContainer = document.querySelector('div[draggable="true"][role="button"]');
        if (firstImageContainer) {
            const gridContainer = firstImageContainer.parentElement;
            if (gridContainer && gridContainer.classList.contains('d-grid')) {
                gridContainer.style.gridTemplateColumns = `repeat(auto-fill, minmax(${gridMin}, 1fr))`;
            }
        }
    }

    // Finde den "Neu laden" Link (hat href mit mode=image)
    function findReloadLink() {
        return document.querySelector('.pane__action a[href*="mode=image"]');
    }

    // Finde den "Alle Bilder löschen" Button (btn-danger)
    function findDeleteAllButton() {
        return document.querySelector('.pane__action button.btn-danger');
    }

    // Prüfe ob Seitenleiste eingeklappt ist
    function isSidebarCollapsed() {
        const reloadLink = findReloadLink();
        // Wenn der Link kein Text hat (nur Icon), ist die Seitenleiste eingeklappt
        return reloadLink && reloadLink.textContent.trim() === '';
    }

    // Aktualisiere Dropdown-Aussehen basierend auf Sidebar-Zustand
    function updateSizeDropdownAppearance() {
        if (!dropdownContainer || !dropdownLabel || !sizeDropdown) return;

        const collapsed = isSidebarCollapsed();

        if (collapsed) {
            // Eingeklappt: Label ausblenden, Select kompakt wie Button
            dropdownLabel.style.display = 'none';
            dropdownContainer.className = 'mx-2 px-0';
            dropdownContainer.style.cssText = 'width:auto;';
            sizeDropdown.style.cssText = 'width:auto;padding:0.25rem 0.5rem;font-size:0.875rem;background-image:url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23212529\'%3e%3cpath fill-rule=\'evenodd\' d=\'M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z\'/%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right 0.3rem center;background-size:12px;padding-right:1.2rem;';
        } else {
            // Ausgeklappt: Text-Label, volle Breite
            dropdownLabel.style.display = '';
            dropdownLabel.innerHTML = 'Bildgröße:';
            dropdownLabel.className = 'form-label mb-2';
            dropdownContainer.className = 'p-2 w-100 bg-light';
            dropdownContainer.style.cssText = '';
            sizeDropdown.style.cssText = '';
            sizeDropdown.className = 'form-select form-select-sm';
        }
    }

    // Erstelle Größen-Dropdown
    function createSizeDropdown() {
        // Nur auf mode=image Seite anzeigen
        if (!isImageMode()) return;

        // Prüfe ob bereits im DOM
        const existing = document.getElementById('gh-image-size-dropdown');
        if (existing) {
            dropdownContainer = existing;
            sizeDropdown = existing.querySelector('select');
            dropdownLabel = existing.querySelector('label');
            updateSizeDropdownAppearance();
            return;
        }

        const savedSize = localStorage.getItem(IMAGE_SIZE_KEY) || 'large';
        const collapsed = isSidebarCollapsed();

        // Erstelle Container für Dropdown
        dropdownContainer = document.createElement('div');
        dropdownContainer.id = 'gh-image-size-dropdown';

        // Label
        dropdownLabel = document.createElement('label');
        dropdownLabel.className = 'form-label mb-2';
        dropdownLabel.textContent = 'Bildgröße:';

        // Dropdown
        sizeDropdown = document.createElement('select');
        sizeDropdown.className = 'form-select form-select-sm';

        // Optionen
        for (const [key, value] of Object.entries(IMAGE_SIZES)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value.label;
            sizeDropdown.appendChild(option);
        }

        // Setze Wert nach dem Erstellen der Optionen
        sizeDropdown.value = savedSize;

        // Event Listener - mehrere Events für zuverlässiges Speichern
        const saveSize = function() {
            try {
                localStorage.setItem(IMAGE_SIZE_KEY, sizeDropdown.value);
                applyImageSize(sizeDropdown.value);
            } catch (e) {
                try { console.error('Fehler beim Speichern der Bildgröße:', e); } catch (e) {}
            }
        };

        sizeDropdown.addEventListener('change', saveSize);
        sizeDropdown.addEventListener('input', saveSize);
        sizeDropdown.addEventListener('blur', saveSize);

        // Zusammenbauen
        dropdownContainer.appendChild(dropdownLabel);
        dropdownContainer.appendChild(sizeDropdown);

        // Aussehen anpassen
        updateSizeDropdownAppearance();

        // Finde den btn-danger (Alle Bilder löschen) und füge davor ein
        const deleteAllBtn = findDeleteAllButton();
        if (deleteAllBtn) {
            const parentContainer = deleteAllBtn.parentElement;
            if (parentContainer) {
                parentContainer.insertBefore(dropdownContainer, deleteAllBtn);
            }
        }

        // Wende Größe an
        applyImageSize(savedSize);
    }

    // Erstelle oder aktualisiere Download-Button
    function createDownloadButton() {
        // Nur auf mode=image Seite anzeigen
        if (!isImageMode()) return;

        const reloadLink = findReloadLink();
        if (!reloadLink) return;

        const collapsed = isSidebarCollapsed();
        const existing = document.getElementById('gh-download-button');

        // Prüfe ob Button existiert und an richtiger Position ist
        if (existing) {
            // Prüfe ob Button direkt nach dem Reload-Link ist
            if (existing.previousElementSibling === reloadLink) {
                // Position ist korrekt, nur Aussehen aktualisieren
                downloadButton = existing;
                updateDownloadButtonAppearance();
                return;
            } else {
                // Position ist falsch, Button entfernen und neu erstellen
                existing.remove();
            }
        }

        // Neuen Button erstellen
        downloadButton = document.createElement('button');
        downloadButton.type = 'button';
        downloadButton.id = 'gh-download-button';
        downloadButton.addEventListener('click', downloadAllImages);

        if (collapsed) {
            downloadButton.className = 'mx-2 px-0 btn btn-info btn-sm';
            downloadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" class="bi bi-download"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>';
        } else {
            downloadButton.className = 'mx-2 btn btn-info btn-sm';
            downloadButton.textContent = 'Download';
        }

        // Füge nach dem "Neu laden" Link ein
        reloadLink.parentElement.insertBefore(downloadButton, reloadLink.nextSibling);
    }

    // Aktualisiere Download-Button Aussehen (ohne Position zu ändern)
    function updateDownloadButtonAppearance() {
        if (!downloadButton || !document.body.contains(downloadButton)) return;

        const collapsed = isSidebarCollapsed();

        if (collapsed) {
            downloadButton.className = 'mx-2 px-0 btn btn-info btn-sm';
            downloadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" class="bi bi-download"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>';
        } else {
            downloadButton.className = 'mx-2 btn btn-info btn-sm';
            downloadButton.textContent = 'Download';
        }
    }

    // Finde und modifiziere den "Bilder Speichern" Button
    function modifySaveButton() {
        if (!isImageMode()) return;

        const paneAction = document.querySelector('.pane__action');
        if (!paneAction) return;

        // Finde den btn-success Button (Save-Button, hat floppy2 SVG-Icon)
        saveButton = paneAction.querySelector('button.btn-success');

        if (saveButton) {
            setSaveButtonNeutral();
        }
    }

    // Beobachte Toast-Nachrichten
    function observeToastMessages() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const toastHeader = node.querySelector?.('.toast-header');
                        if (toastHeader) {
                            const strongText = toastHeader.querySelector('strong');
                            if (strongText && strongText.textContent.includes('Bilder erfolgreich gespeichert')) {
                                resetButtonsToNeutral();
                            }
                        }

                        if (node.classList && node.classList.contains('toast-header')) {
                            const strongText = node.querySelector('strong');
                            if (strongText && strongText.textContent.includes('Bilder erfolgreich gespeichert')) {
                                resetButtonsToNeutral();
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Beobachte Klicks auf Löschen-Buttons
    function observeDeleteButtons() {
        document.body.addEventListener('click', function(e) {
            const target = e.target;

            if (target.classList.contains('btn-outline-danger') &&
                target.textContent.trim() === 'Löschen') {
                markSaveChanges();
            }
        });
    }

    // Blockiere Click auf Bild-Links (verhindere Öffnen von Bildern durch Link)
    function preventImageLinkClicks() {
        document.addEventListener('click', function(e) {
            // Wenn auf ein img geklickt wurde und es in einem Link ist
            if (e.target.tagName === 'IMG') {
                const parentLink = e.target.closest('a');
                if (parentLink && parentLink.href && e.target.closest('div[draggable="true"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
            }
            // Wenn direkt auf einen Link mit Bild geklickt wurde
            if (e.target.tagName === 'A' && e.target.querySelector('img')) {
                if (e.target.closest('div[draggable="true"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
            }
        }, { capture: true });
    }

    // Füge "ÖFFNEN" Link zu Bildern hinzu
    function addOpenLinksToImages() {
        if (!isImageMode()) return;

        const imageContainers = document.querySelectorAll('div[draggable="true"][role="button"]');

        imageContainers.forEach(container => {
            const existingLink = container.querySelector('a.sb-open-link');
            if (existingLink) return;

            const img = container.querySelector('img');
            if (!img) return;

            // Erstelle Link
            const openLink = document.createElement('a');
            openLink.className = 'sb-open-link';
            openLink.href = img.src;
            openLink.target = '_blank';
            openLink.rel = 'noopener noreferrer';
            openLink.textContent = 'ÖFFNEN';
            openLink.style.cssText = 'position:absolute;bottom:5px;right:5px;background-color:rgba(0,0,0,0.7);color:white;text-decoration:none;padding:5px 10px;border-radius:3px;font-size:12px;font-weight:bold;cursor:pointer;z-index:10;opacity:0;transition:opacity 0.2s;display:inline-block;';

            // Zeige Link bei Hover
            container.addEventListener('mouseenter', function() {
                openLink.style.opacity = '1';
            });

            container.addEventListener('mouseleave', function() {
                openLink.style.opacity = '0';
            });

            container.appendChild(openLink);
        });
    }

    // Debounced Update-Funktion
    function debouncedUpdate() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            if (isUpdating) return;
            isUpdating = true;

            try {
                // Nur auf mode=image Seite
                if (!isImageMode()) {
                    isUpdating = false;
                    return;
                }

                updateSaveButtonStyle();
                updateDownloadButtonState();
                addOpenLinksToImages();

                // Prüfe ob Download-Button existiert und an richtiger Position ist
                createDownloadButton();

                // Prüfe ob Dropdown existiert
                if (!document.getElementById('gh-image-size-dropdown')) {
                    dropdownContainer = null;
                    sizeDropdown = null;
                    dropdownLabel = null;
                    createSizeDropdown();
                } else {
                    updateSizeDropdownAppearance();
                }

                // Wende aktuelle Bildgröße auf neue Bilder an
                if (sizeDropdown) {
                    const selectedSize = sizeDropdown.value;
                    applyImageSize(selectedSize);
                }
            } finally {
                isUpdating = false;
            }
        }, 100);
    }

    // Beobachte DOM-Änderungen für Bild-Container und Sidebar
    function observeImageChanges() {
        const observer = new MutationObserver(function(mutations) {
            // Ignoriere Änderungen die von uns selbst kommen
            const dominated = mutations.some(m =>
                m.target.id === 'gh-download-button' ||
                m.target.id === 'gh-image-size-dropdown' ||
                m.target.closest?.('#gh-download-button') ||
                m.target.closest?.('#gh-image-size-dropdown')
            );
            if (dominated) return;

            debouncedUpdate();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Beobachte URL-Änderungen
    function observeUrlChanges() {
        if (urlObserver) clearInterval(urlObserver);

        urlObserver = setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                // Reset globale Variablen für Reinitialisierung
                initialImageCount = 0;
                initialImageOrder = [];
                hasChanges = false;
                hasSaveChanges = false;
                isResetting = false;
                isUpdating = false;
                saveButton = null;
                downloadButton = null;
                sizeDropdown = null;
                dropdownContainer = null;
                dropdownLabel = null;
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                    debounceTimer = null;
                }
                // Starte Initialisierung neu
                init();
            }
        }, 500);
    }

    // Initialisierung
    function init() {
        // Warte bis die Seite vollständig geladen ist
        setTimeout(() => {
            captureInitialState();
            preventImageLinkClicks();
            modifySaveButton();
            createDownloadButton();
            createSizeDropdown();
            addOpenLinksToImages();
            observeToastMessages();
            observeDeleteButtons();
            observeImageChanges();
        }, 1000);
    }

    // Starte das Script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            lastUrl = window.location.href;
            init();
            observeUrlChanges();
        });
    } else {
        lastUrl = window.location.href;
        init();
        observeUrlChanges();
    }

})();