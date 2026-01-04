// ==UserScript==
// @name         [EOL] enhanced edneu.pl
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      2.0.8
// @description  Kombiniert: Clone-Info mit Artikel-Edit Button | MPN-Check | Copy-Icons für Herstellerlinks | Artikelersetzer/Value-CleanUP Buttons | Kopierbuttons für Referenzartikel | Link-IDs kopieren Buttons | Product Name Copy-Icons (inkl. eckige Klammern und Artikel-IDs)
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/edneu.pl*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      opus.geizhals.at
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551868/%5BEOL%5D%20enhanced%20edneupl.user.js
// @updateURL https://update.greasyfork.org/scripts/551868/%5BEOL%5D%20enhanced%20edneupl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================================================================
    // MODUL 1: Clone-Info anzeigen (geklont von <id>) - KOMPLETT ÜBERARBEITETE VERSION
    // =============================================================================
    function initCloneInfo() {
        const gmXHR = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest : (typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : null);

        if (!gmXHR) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const currentId = urlParams.get('id');

        if (!currentId) {
            return;
        }

        function findNeuLadenLink() {
            // Suche 1: Direktes href Attribut mit edneu.pl?id=DIESE_ID
            let link = document.querySelector(`a[href="edneu.pl?id=${currentId}"]`);
            if (link) {
                return link;
            }

            // Suche 2: Jeder Link mit edneu.pl und beliebiger ID
            const allLinks = document.querySelectorAll('a[href*="edneu.pl?id="]');
            for (let l of allLinks) {
                if (l.textContent.trim() === 'Neu laden') {
                    return l;
                }
            }

            // Suche 3: Fallback - nimm einfach ersten edneu.pl Link
            if (allLinks.length > 0) {
                return allLinks[allLinks.length - 1]; // Der letzte ist wahrscheinlich "Neu laden"
            }

            return null;
        }

        function processCloneInfo() {
            // Prüfe ob Clone-Info bereits existiert
            if (document.querySelector('span[data-clone-info="true"]')) {
                return;
            }

            const neuLadenLink = findNeuLadenLink();
            if (!neuLadenLink) {
                return;
            }

            const showlogUrl = `https://opus.geizhals.at/pv-edit/showlog.pl?id=${currentId}`;

            gmXHR({
                method: 'GET',
                url: showlogUrl,
                onload: function(response) {
                    try {
                        let clonedFromId = null;

                        // Methode 1: Suche nach "Cloned from => XXXX" mit Regex
                        const cloneRegex = /Cloned from\s*=>\s*(\d+)/i;
                        const cloneMatch = response.responseText.match(cloneRegex);
                        if (cloneMatch && cloneMatch[1]) {
                            clonedFromId = cloneMatch[1];
                        }

                        // Fallback Methode 2: Parse HTML und suche in allen Zellen
                        if (!clonedFromId) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const allCells = doc.querySelectorAll('td');
                            
                            for (let cell of allCells) {
                                if (cell.textContent.includes('Cloned from')) {
                                    const linkMatch = cell.textContent.match(/Cloned from.*?(\d+)/i);
                                    if (linkMatch && linkMatch[1]) {
                                        clonedFromId = linkMatch[1];
                                        break;
                                    }
                                }
                            }
                        }

                        if (clonedFromId) {
                            // Erstelle Container für alle Links
                            const container = document.createElement('span');
                            container.setAttribute('data-clone-info', 'true');

                            // Separator VOR der Clone-Info
                            const separatorBefore = document.createTextNode(' | ');
                            
                            // Text
                            container.appendChild(document.createTextNode('geklont von '));

                            // ID Link
                            const idLink = document.createElement('a');
                            idLink.href = `edneu.pl?id=${clonedFromId}`;
                            idLink.className = 'topnav_item';
                            idLink.textContent = clonedFromId;
                            container.appendChild(idLink);

                            // Öffnende Klammer
                            container.appendChild(document.createTextNode(' ('));

                            // Vergleich GH Link
                            const compareGhLink = document.createElement('a');
                            compareGhLink.href = `https://geizhals.eu/?cmp=${clonedFromId}&cmp=${currentId}&active=1`;
                            compareGhLink.className = 'topnav_item';
                            compareGhLink.textContent = 'Vergleich GH';
                            compareGhLink.target = '_blank';
                            compareGhLink.rel = 'noopener noreferrer';
                            container.appendChild(compareGhLink);

                            container.appendChild(document.createTextNode(' | '));

                            // Vergleich Kalif Link
                            const compareKalifLink = document.createElement('a');
                            compareKalifLink.href = `https://opus.geizhals.at/kalif/artikel/diff#id=${currentId}&id=${clonedFromId}&primary=${clonedFromId}`;
                            compareKalifLink.className = 'topnav_item';
                            compareKalifLink.textContent = 'Vergleich Kalif';
                            compareKalifLink.target = '_blank';
                            compareKalifLink.rel = 'noopener noreferrer';
                            container.appendChild(compareKalifLink);

                            container.appendChild(document.createTextNode(' | '));

                            // Vergleich Bilder Link
                            const compareImagesLink = document.createElement('a');
                            compareImagesLink.href = `https://opus.geizhals.at/kalif/artikel/mass-image?artikel=${clonedFromId}&artikel=${currentId}&autoGallery=true`;
                            compareImagesLink.className = 'topnav_item';
                            compareImagesLink.textContent = 'Vergleich Bilder';
                            compareImagesLink.target = '_blank';
                            compareImagesLink.rel = 'noopener noreferrer';
                            container.appendChild(compareImagesLink);

                            container.appendChild(document.createTextNode(' | '));

                            // Bilder Klonartikel Link
                            const bilderLink = document.createElement('a');
                            bilderLink.href = `https://opus.geizhals.at/kalif/artikel?id=${clonedFromId}&mode=image`;
                            bilderLink.className = 'topnav_item';
                            bilderLink.textContent = 'Bilder Klonartikel';
                            bilderLink.target = '_blank';
                            bilderLink.rel = 'noopener noreferrer';
                            container.appendChild(bilderLink);

                            // Schließende Klammer
                            container.appendChild(document.createTextNode(') | '));

                            // Artikel Edit Link
                            const artikelEditLink = document.createElement('a');
                            artikelEditLink.href = `https://opus.geizhals.at/kalif/artikel?id=${currentId}`;
                            artikelEditLink.className = 'topnav_item';
                            artikelEditLink.textContent = 'artikel edit';
                            artikelEditLink.target = '_blank';
                            artikelEditLink.rel = 'noopener noreferrer';
                            container.appendChild(artikelEditLink);

                            // EINFÜGEN VOR dem "Neu laden" Link
                            const freshNeuLadenLink = findNeuLadenLink();
                            if (freshNeuLadenLink) {
                                freshNeuLadenLink.parentNode.insertBefore(separatorBefore, freshNeuLadenLink);
                                freshNeuLadenLink.parentNode.insertBefore(container, separatorBefore);
                            }
                        }
                    } catch (error) {
                        // Fehler werden stillschweigend ignoriert
                    }
                },
                onerror: function(error) {
                    // Fehler werden stillschweigend ignoriert
                }
            });
        }

        // Sofort versuchen nach kurzem Delay
        setTimeout(processCloneInfo, 500);

        // Nochmal später versuchen falls Link dynamisch wird
        setTimeout(processCloneInfo, 2000);
    }

    // =============================================================================
    // MODUL 2: MPN-Check beim Klonen
    // =============================================================================
    function initMpnCheck() {
        function checkMpnCondition() {
            const mpnField = document.getElementById('mpn');
            const matchruleField = document.querySelector('input[name="matchrule"]');

            if (!mpnField || !matchruleField) {
                return true;
            }

            const mpnValue = mpnField.value.trim();
            const matchruleValue = matchruleField.value;
            const hasMpnMacro = matchruleValue.includes('%mpn%');
            const hasNoMpn = mpnValue === '' || mpnValue === '_OHNE_';

            if (hasMpnMacro && hasNoMpn) {
                alert('Klonen abgebrochen: Matchrule mit MPN-Makro aber kein MPN eingetragen');
                return false;
            }

            return true;
        }

        function attachListeners() {
            const cloneButtons = [
                document.querySelector('input[name="submit_clone_withvariant"]'),
                document.querySelector('input[name="submit_clone_newvariant"]'),
                document.querySelector('input[name="submit_clone_withoutvariant"]')
            ];

            cloneButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', function(event) {
                        if (!checkMpnCondition()) {
                            event.preventDefault();
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                        }
                    }, true);
                }
            });
        }

        attachListeners();
    }

    // =============================================================================
    // MODUL 3: Copy-Icons bei Herstellerlinks
    // =============================================================================
    function initHerstellerlinkCopyIcons() {
        let isProcessing = false;

        const copyIconSVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 9a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z"/>
            <path d="M7 2h11a2 2 0 0 1 2 2v11"/>
        </svg>`;

        function addCopyIcon() {
            if (isProcessing) {
                return;
            }
            isProcessing = true;

            const hlinkDivs = document.querySelectorAll('.hlink-view[id^="hlink-view__"]');

            hlinkDivs.forEach(hlinkDiv => {
                const linkElement = hlinkDiv.querySelector('a[id^="hlink-anchor__"]');

                if (!linkElement) {
                    return;
                }

                if (linkElement.parentNode.querySelector('.copy-link-icon')) {
                    return;
                }

                const linkUrl = linkElement.href;

                const iconWrapper = document.createElement('span');
                iconWrapper.className = 'copy-link-icon';
                iconWrapper.innerHTML = copyIconSVG;
                iconWrapper.title = 'Link in Zwischenablage kopieren';
                iconWrapper.style.cssText = `
                    display: inline-block;
                    margin-left: 6px;
                    vertical-align: middle;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: opacity 0.2s, color 0.2s;
                `;

                iconWrapper.addEventListener('mouseenter', function() {
                    this.style.opacity = '1';
                });

                iconWrapper.addEventListener('mouseleave', function() {
                    this.style.opacity = '0.6';
                });

                iconWrapper.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    navigator.clipboard.writeText(linkUrl).then(function() {
                        iconWrapper.style.color = '#4CAF50';
                        iconWrapper.style.opacity = '1';

                        setTimeout(function() {
                            iconWrapper.style.color = '';
                            iconWrapper.style.opacity = '0.6';
                        }, 500);
                    }).catch(function() {
                        alert('Fehler beim Kopieren in die Zwischenablage');
                    });
                });

                linkElement.parentNode.insertBefore(iconWrapper, linkElement.nextSibling);
            });

            isProcessing = false;
        }

        addCopyIcon();

        let observerTimeout;
        const observer = new MutationObserver(function(mutations) {
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(addCopyIcon, 500);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // =============================================================================
    // MODUL 4: Buttons für Artikelersetzer und Value CleanUP
    // =============================================================================
    function initArtikelButtons() {
        const submitButton = document.querySelector('input[type="submit"][name="submit_e"]');
        if (!submitButton) {
            return;
        }

        const id1 = document.querySelector('input[name="id"]')?.value;
        
        if (id1) {
            const link1 = document.createElement("a");
            link1.setAttribute("href", "https://opus.geizhals.at/kalif/artikel/ersetzer#" + id1);
            link1.setAttribute("target", "_blank");
            link1.innerHTML = "Artikelersetzer";
            link1.style.margin = "0px 20px 0px 0px";
            link1.style.display = "inline-block";
            link1.style.fontSize = "1em";
            link1.style.fontFamily = "Microsoft Serif, serif";
            link1.style.verticalAlign = "middle";
            link1.style.lineHeight = "18px";
            link1.style.textDecoration = "underline";
            link1.style.color = "#0000EE";
            
            submitButton.parentNode.insertBefore(link1, submitButton);
        }

        const cat1 = document.querySelector('textarea[name="cat"]')?.value;
        
        if (cat1) {
            const link2 = document.createElement("a");
            link2.setAttribute("href", "https://opus.geizhals.at/pv-edit/kvmigration-value_cleanup.pl/kategorie/" + cat1);
            link2.setAttribute("target", "_blank");
            link2.innerHTML = "Value CleanUp";
            link2.style.margin = "0px 20px 0px 0px";
            link2.style.display = "inline-block";
            link2.style.fontSize = "1em";
            link2.style.fontFamily = "Microsoft Serif, serif";
            link2.style.verticalAlign = "middle";
            link2.style.lineHeight = "18px";
            link2.style.textDecoration = "underline";
            link2.style.color = "#0000EE";
            
            submitButton.parentNode.insertBefore(link2, submitButton);
        }
    }

    // =============================================================================
    // MODUL 5: Kopierbuttons für Referenzartikel
    // =============================================================================
    function initReferenzartikelCopyButtons() {
        const saveIconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18" fill="gray" class="bi bi-save save-icon">
                <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z"/>
            </svg>
        `;

        function extractIdFromHref(href) {
            const match = href.match(/id=(\d+)/);
            return match ? match[1] : null;
        }

        async function copyToClipboard(text, linkElement) {
            try {
                await navigator.clipboard.writeText(text);

                const iconElement = linkElement.querySelector('.save-icon');

                linkElement.style.backgroundColor = '#28a745';
                linkElement.style.borderRadius = '4px';
                linkElement.style.transition = 'background-color 0.2s';
                iconElement.setAttribute('fill', 'white');

                setTimeout(() => {
                    linkElement.style.backgroundColor = '';
                    iconElement.setAttribute('fill', 'gray');
                }, 500);
            } catch (err) {
                // Fehler wird stillschweigend ignoriert
            }
        }

        function addSaveIcon(pencilLink) {
            const parent = pencilLink.parentElement;
            if (parent.querySelector('.save-icon')) {
                return;
            }

            const href = pencilLink.getAttribute('href');
            const id = extractIdFromHref(href);

            if (!id) {
                return;
            }

            const saveLink = document.createElement('a');
            saveLink.role = 'button';
            saveLink.tabIndex = 0;
            saveLink.className = 'd-flex align-items-center px-0 btn btn-link btn-sm';
            saveLink.innerHTML = saveIconSVG;
            saveLink.style.cursor = 'pointer';

            saveLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(id, saveLink);
            });

            parent.insertBefore(saveLink, pencilLink);
        }

        function processShadowDOM(root) {
            const pencilLinks = root.querySelectorAll('a[href*="edneu.pl?id="] .bi-pencil');

            pencilLinks.forEach(pencilIcon => {
                const pencilLink = pencilIcon.closest('a');
                if (pencilLink) {
                    addSaveIcon(pencilLink);
                }
            });
        }

        function findAndProcessShadowRoots(node = document.body) {
            if (node.shadowRoot) {
                processShadowDOM(node.shadowRoot);
            }

            const children = node.querySelectorAll('*');
            children.forEach(child => {
                if (child.shadowRoot) {
                    processShadowDOM(child.shadowRoot);
                }
            });
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        findAndProcessShadowRoots(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            findAndProcessShadowRoots();
        }, 1000);

        setTimeout(() => {
            findAndProcessShadowRoots();
        }, 4000);

        setInterval(() => {
            findAndProcessShadowRoots();
        }, 500);
    }

    // =============================================================================
    // MODUL 6: Link-IDs kopieren Buttons
    // =============================================================================
    function initLinkIdsCopyButtons() {
        // Hilfsfunktion: Kopiert IDs via iframe
        function copyIdsViaIframe(linkId, button) {
            button.disabled = true;
            const originalValue = button.value;
            button.value = 'Lädt...';

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';

            const url = `https://opus.geizhals.at/kalif/artikel/link#id=${linkId}&order=ctime&direction=desc`;

            iframe.addEventListener('load', function() {
                try {
                    setTimeout(function() {
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                            const checkAndClick = setInterval(function() {
                                try {
                                    const table = iframeDoc.querySelector('table');
                                    if (!table) return;

                                    const ids = [];
                                    const rows = table.querySelectorAll('tbody tr');

                                    rows.forEach((row, index) => {
                                        const links = row.querySelectorAll('a');

                                        links.forEach(link => {
                                            const href = link.getAttribute('href');
                                            if (href) {
                                                const idMatch = href.match(/[?&]id=(\d+)/);
                                                if (idMatch) {
                                                    if (!ids.includes(idMatch[1])) {
                                                        ids.push(idMatch[1]);
                                                    }
                                                }
                                            }
                                        });
                                    });

                                    if (ids.length > 0) {
                                        clearInterval(checkAndClick);

                                        const idsText = ids.join(' ');

                                        navigator.clipboard.writeText(idsText).then(function() {
                                            button.style.backgroundColor = '#4CAF50';
                                            button.style.color = 'white';
                                            button.value = `${ids.length} IDs kopiert!`;

                                            setTimeout(function() {
                                                button.style.backgroundColor = '';
                                                button.style.color = '';
                                                button.value = originalValue;
                                                button.disabled = false;
                                            }, 2000);
                                        }).catch(function(err) {
                                            button.value = 'Clipboard-Fehler!';
                                            setTimeout(function() {
                                                button.value = originalValue;
                                                button.disabled = false;
                                            }, 2000);
                                        });

                                        setTimeout(function() {
                                            try {
                                                if (iframe.parentNode) {
                                                    document.body.removeChild(iframe);
                                                }
                                            } catch (e) {
                                                // Ignoriere Fehler
                                            }
                                        }, 500);
                                    }
                                } catch (e) {
                                    clearInterval(checkAndClick);
                                    button.value = 'Fehler!';
                                    setTimeout(function() {
                                        button.value = originalValue;
                                        button.disabled = false;
                                    }, 2000);
                                    try {
                                        if (iframe.parentNode) {
                                            document.body.removeChild(iframe);
                                        }
                                    } catch (e) {
                                        // Ignoriere Fehler
                                    }
                                }
                            }, 200);

                            setTimeout(function() {
                                clearInterval(checkAndClick);
                                if (button.value === 'Lädt...') {
                                    button.value = 'Timeout!';
                                    setTimeout(function() {
                                        button.value = originalValue;
                                        button.disabled = false;
                                    }, 2000);
                                    try {
                                        if (iframe.parentNode) {
                                            document.body.removeChild(iframe);
                                        }
                                    } catch (e) {
                                        // Ignoriere Fehler
                                    }
                                }
                            }, 5000);

                        } catch (e) {
                            button.value = 'Fehler!';
                            setTimeout(function() {
                                button.value = originalValue;
                                button.disabled = false;
                            }, 2000);
                            try {
                                if (iframe.parentNode) {
                                    document.body.removeChild(iframe);
                                }
                            } catch (e) {
                                // Ignoriere Fehler
                            }
                        }
                    }, 500);

                } catch (e) {
                    button.value = 'Fehler!';
                    setTimeout(function() {
                        button.value = originalValue;
                        button.disabled = false;
                    }, 2000);
                    try {
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                    } catch (e) {
                        // Ignoriere Fehler
                    }
                }
            });

            document.body.appendChild(iframe);
            iframe.src = url;
        }

        // Funktion zum Erstellen des Buttons für eine bestimmte Sprache
        function createButtonForLanguage(lang) {
            const hlinkView = document.getElementById(`hlink-view__${lang}`);
            if (!hlinkView) return;

            const editLink = hlinkView.querySelector('a[name="open_link_edit"]');
            if (!editLink) return;

            const href = editLink.getAttribute('href');
            const idMatch = href.match(/id=(\d+)/);
            if (!idMatch) return;

            const linkId = idMatch[1];

            const existingButton = hlinkView.querySelector(`input[data-link-id="${linkId}"]`);
            if (existingButton) return;

            const button = document.createElement('input');
            button.type = 'button';
            button.value = 'IDs kopieren';
            button.className = 'btn';
            button.style.width = '120px';
            button.style.minWidth = '120px';
            button.title = 'Kopiert IDs via verstecktem iframe';
            button.setAttribute('data-link-id', linkId);

            button.addEventListener('click', function() {
                copyIdsViaIframe(linkId, button);
            });

            editLink.parentNode.insertBefore(document.createTextNode('\u00A0'), editLink.nextSibling);
            editLink.parentNode.insertBefore(button, editLink.nextSibling.nextSibling);
        }

        // Funktion zum Erstellen von Buttons für Tabellen-Edit-Links
        function createButtonsForTableEditLinks() {
            const editLinks = document.querySelectorAll('a[href*="/kalif/artikel/link?id="][target="_blank"]');

            editLinks.forEach(editLink => {
                const linkText = editLink.textContent.trim();

                if (linkText !== 'Edit') return;

                const href = editLink.getAttribute('href');
                const idMatch = href.match(/id=(\d+)/);
                if (!idMatch) return;

                const linkId = idMatch[1];

                const parent = editLink.parentNode;
                const existingButton = parent.querySelector(`input[data-link-id="${linkId}"]`);
                if (existingButton) return;

                const button = document.createElement('input');
                button.type = 'button';
                button.value = 'IDs kopieren';
                button.className = 'btn';
                button.style.marginLeft = '5px';
                button.style.width = '120px';
                button.style.minWidth = '120px';
                button.title = 'Kopiert IDs via verstecktem iframe';
                button.setAttribute('data-link-id', linkId);

                button.addEventListener('click', function() {
                    copyIdsViaIframe(linkId, button);
                });

                parent.insertBefore(document.createTextNode('\u00A0'), editLink.nextSibling);
                parent.insertBefore(button, editLink.nextSibling.nextSibling);
            });
        }

        // Funktion zum Erstellen des Varianten-Buttons
        function createVariantButton() {
            const artikelErsetzerButton = document.querySelector('input[name="artikerl_ersetzer"]');
            if (!artikelErsetzerButton) return;

            const existingButton = artikelErsetzerButton.parentNode.querySelector('input[data-variant-button="true"]');
            if (existingButton) return;

            const button = document.createElement('input');
            button.type = 'button';
            button.value = 'IDs kopieren';
            button.className = 'btn';
            button.style.marginLeft = '5px';
            button.style.width = '120px';
            button.style.minWidth = '120px';
            button.title = 'Kopiert Varianten-IDs';
            button.setAttribute('data-variant-button', 'true');

            button.addEventListener('click', function() {
                button.disabled = true;
                const originalValue = button.value;

                try {
                    const onclick = artikelErsetzerButton.getAttribute('onclick');
                    const match = onclick.match(/ersetzer#([0-9,]+)/);

                    if (match && match[1]) {
                        const idsWithCommas = match[1];
                        const idsArray = idsWithCommas.split(',');
                        const idsText = idsArray.join(' ');

                        navigator.clipboard.writeText(idsText).then(function() {
                            button.style.backgroundColor = '#4CAF50';
                            button.style.color = 'white';
                            button.value = `${idsArray.length} IDs kopiert!`;

                            setTimeout(function() {
                                button.style.backgroundColor = '';
                                button.style.color = '';
                                button.value = originalValue;
                                button.disabled = false;
                            }, 2000);
                        }).catch(function(err) {
                            button.value = 'Fehler!';
                            setTimeout(function() {
                                button.value = originalValue;
                                button.disabled = false;
                            }, 2000);
                        });
                    } else {
                        button.value = 'Keine IDs gefunden!';
                        setTimeout(function() {
                            button.value = originalValue;
                            button.disabled = false;
                        }, 2000);
                    }
                } catch (e) {
                    button.value = 'Fehler!';
                    setTimeout(function() {
                        button.value = originalValue;
                        button.disabled = false;
                    }, 2000);
                }
            });

            artikelErsetzerButton.parentNode.insertBefore(document.createTextNode('\u00A0'), artikelErsetzerButton.nextSibling);
            artikelErsetzerButton.parentNode.insertBefore(button, artikelErsetzerButton.nextSibling.nextSibling);
        }

        // Erstelle Buttons für alle Sprachen
        const languages = ['DE', 'EN', 'PL', 'mlt'];
        languages.forEach(lang => createButtonForLanguage(lang));

        // Erstelle Buttons für Tabellen-Edit-Links
        createButtonsForTableEditLinks();

        // Erstelle Varianten-Button
        createVariantButton();

        // Beobachte DOM-Änderungen für dynamisch geladene Tabellen
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            (node.tagName === 'TR' || node.tagName === 'TABLE' || node.querySelector && node.querySelector('table'))) {
                            shouldUpdate = true;
                        }
                    });
                }
            });

            if (shouldUpdate) {
                createButtonsForTableEditLinks();
                createVariantButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // =============================================================================
    // MODUL 7: Copy-Icon für Produktnamen und Artikel-IDs
    // =============================================================================
    function initProductNameCopyIcons() {
        // SVG Copy-Icon erstellen
        function createCopyIcon() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.style.cursor = 'pointer';
            svg.style.marginLeft = '6px';
            svg.style.verticalAlign = 'middle';
            svg.style.opacity = '0.6';
            svg.style.transition = 'opacity 0.2s';
            
            // Hinteres Blatt (leicht versetzt nach links/oben)
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'M4 9h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2');
            svg.appendChild(path1);
            
            // Vorderes Blatt (abgerundetes Rechteck)
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '9');
            rect.setAttribute('y', '2');
            rect.setAttribute('width', '13');
            rect.setAttribute('height', '13');
            rect.setAttribute('rx', '2');
            svg.appendChild(rect);
            
            return svg;
        }
        
        // Text ins Clipboard kopieren
        function copyToClipboard(text, icon) {
            navigator.clipboard.writeText(text).then(() => {
                icon.style.opacity = '1';
                icon.style.color = '#4CAF50';
                
                setTimeout(() => {
                    icon.style.opacity = '0.6';
                    icon.style.color = '';
                }, 1500);
            }).catch(err => {
                icon.style.color = '#f44336';
                setTimeout(() => {
                    icon.style.opacity = '0.6';
                    icon.style.color = '';
                }, 1500);
            });
        }
        
        // Finde alle <b> Elemente und füge Icons hinzu
        function addCopyIcons() {
            const boldElements = document.querySelectorAll('b');
            
            boldElements.forEach(boldElement => {
                // Prüfe ob bereits ein Copy-Icon existiert
                if (boldElement.querySelector('[data-copy-icon]')) {
                    return;
                }
                
                // Extrahiere den vollständigen Text
                const fullText = boldElement.textContent.trim();
                if (!fullText) {
                    return;
                }
                
                // Fall 1: box_artikel_id - Artikel-ID
                if (boldElement.classList.contains('box_artikel_id')) {
                    // Extrahiere nur Ziffern (entferne alle Nicht-Ziffern)
                    const articleId = fullText.replace(/\D/g, '');
                    
                    if (!articleId) {
                        return;
                    }
                    
                    const copyIcon = createCopyIcon();
                    copyIcon.setAttribute('data-copy-icon', 'true');
                    copyIcon.title = 'Artikel-ID kopieren';
                    
                    // Hover-Effekt
                    copyIcon.addEventListener('mouseenter', () => {
                        copyIcon.style.opacity = '1';
                    });
                    
                    copyIcon.addEventListener('mouseleave', () => {
                        if (copyIcon.style.color !== 'rgb(76, 175, 80)' && copyIcon.style.color !== '#4CAF50') {
                            copyIcon.style.opacity = '0.6';
                        }
                    });
                    
                    // Click-Handler
                    copyIcon.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClipboard(articleId, copyIcon);
                    });
                    
                    boldElement.appendChild(copyIcon);
                    return;
                }
                
                // Fall 2: Herstellerlink oder eckige Klammern
                const herstellerLink = boldElement.querySelector('a[href*="/kalif/hersteller"]');
                const startsWithBracket = /^\[/.test(fullText);
                
                if (!herstellerLink && !startsWithBracket) {
                    return;
                }
                
                // Bestimme den zu kopierenden Text
                let textToCopy;
                if (startsWithBracket) {
                    // Entferne eckige Klammer und Inhalt vom Anfang
                    textToCopy = fullText.replace(/^\[[^\]]+\]\s*/, '').trim();
                } else {
                    textToCopy = fullText;
                }
                
                if (!textToCopy) {
                    return;
                }
                
                const copyIcon = createCopyIcon();
                copyIcon.setAttribute('data-copy-icon', 'true');
                copyIcon.title = 'Text kopieren';
                
                // Hover-Effekt
                copyIcon.addEventListener('mouseenter', () => {
                    copyIcon.style.opacity = '1';
                });
                
                copyIcon.addEventListener('mouseleave', () => {
                    if (copyIcon.style.color !== 'rgb(76, 175, 80)' && copyIcon.style.color !== '#4CAF50') {
                        copyIcon.style.opacity = '0.6';
                    }
                });
                
                // Click-Handler
                copyIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(textToCopy, copyIcon);
                });
                
                boldElement.appendChild(copyIcon);
            });
        }
        
        // Initial ausführen
        addCopyIcons();
        
        // Beobachte DOM-Änderungen für dynamisch geladene Inhalte
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'B' || node.querySelector('b')) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldUpdate) {
                addCopyIcons();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // =============================================================================
    // INITIALISIERUNG ALLER MODULE
    // =============================================================================
    
    // Module 1: Clone-Info (läuft sofort)
    initCloneInfo();
    
    // Modul 2: MPN-Check (läuft sofort)
    initMpnCheck();
    
    // Modul 3: Copy-Icons Herstellerlinks (läuft sofort)
    initHerstellerlinkCopyIcons();
    
    // Modul 4: Artikelersetzer/Value CleanUP Buttons (läuft sofort)
    initArtikelButtons();
    
    // Modul 5: Referenzartikel Copy-Buttons (läuft sofort)
    initReferenzartikelCopyButtons();
    
    // Modul 6: Link-IDs kopieren Buttons (läuft sofort)
    initLinkIdsCopyButtons();
    
    // Modul 7: Product Name Copy-Icons (läuft sofort)
    initProductNameCopyIcons();

})();