// ==UserScript==
// @name         enhanced rulematcher.pl
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.1.1
// @description  Copy-Icons, Pattern Generator, Extract/Incept UI
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/rulematcher.pl*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/554117/enhanced%20rulematcherpl.user.js
// @updateURL https://update.greasyfork.org/scripts/554117/enhanced%20rulematcherpl.meta.js
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
    if (!window.location.pathname.startsWith('/pv-edit/rulematcher.pl')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedRulematcherInitialized) return;
    window.__enhancedRulematcherInitialized = true;

    // Hilfsfunktion: Extrahiere Hersteller aus Titel-Element
    const extractManufacturerFromTitle = () => {
        let titleElement = document.querySelector('table#filtertable td b');
        if (!titleElement) {
            // Fallback: Suche nach Link zu /kalif/artikel
            const artikelLink = document.querySelector('td > b > a[href*="/kalif/artikel"]');
            if (artikelLink) {
                titleElement = artikelLink.parentElement;
            }
        }
        if (!titleElement) {
            titleElement = document.querySelector('td b');
        }

        if (!titleElement) return null;

        const titleText = titleElement.textContent.trim();
        const match = titleText.match(/^\d+\s+([A-Za-z0-9]+)/);
        if (match) {
            return match[1];
        }
        return null;
    };

    // Hilfsfunktion: Escape Text für Rule-Feld
    const escapeForRule = (text) => {
        let escaped = text.replace(/[\s\-]+/g, '_');
        return escaped;
    };

    // SVG Copy Icon Definition
    const createCopyIcon = () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '14');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.style.cursor = 'pointer';
        svg.style.marginLeft = '5px';
        svg.style.marginRight = '2px';
        svg.style.verticalAlign = 'middle';
        svg.style.display = 'inline-block';
        svg.style.overflow = 'visible';
        svg.style.flexShrink = '0';

        const backRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backRect.setAttribute('x', '4');
        backRect.setAttribute('y', '4');
        backRect.setAttribute('width', '12');
        backRect.setAttribute('height', '12');
        backRect.setAttribute('rx', '2');
        backRect.setAttribute('ry', '2');
        svg.appendChild(backRect);

        const frontRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontRect.setAttribute('x', '8');
        frontRect.setAttribute('y', '8');
        frontRect.setAttribute('width', '12');
        frontRect.setAttribute('height', '12');
        frontRect.setAttribute('rx', '2');
        frontRect.setAttribute('ry', '2');
        frontRect.setAttribute('fill', 'white');
        svg.appendChild(frontRect);

        return svg;
    };

    // Funktion zum Kopieren in die Zwischenablage mit Animation (VERBESSERT)
    const copyToClipboard = (text, iconElement) => {
        navigator.clipboard.writeText(text).then(() => {
            if (iconElement) {
                // Speichere die ORIGINAL-Attribute VOR der Änderung
                const originalStrokeStyle = iconElement.style.stroke;
                const originalStrokeAttr = iconElement.getAttribute('stroke');

                // Setze grüne Farbe
                iconElement.style.stroke = '#00cc00';
                iconElement.style.transform = 'scale(1.2)';
                iconElement.style.transition = 'all 0.2s ease';

                setTimeout(() => {
                    // Stelle EXAKT wieder her
                    if (originalStrokeStyle) {
                        iconElement.style.stroke = originalStrokeStyle;
                    } else {
                        iconElement.style.stroke = '';
                    }
                    iconElement.style.transform = 'scale(1)';
                }, 300);
            }
        }).catch(err => {
            if (iconElement) {
                iconElement.style.stroke = '#cc0000';
                setTimeout(() => {
                    iconElement.style.stroke = '';
                }, 300);
            }
        });
    };

    // 1. Copy-Icons für erste Zeile in Angebotsbezeichnung (VERBESSERT)
    const addCopyIconsToFirstLine = () => {
        const offerCells = document.querySelectorAll('td[class*="td_"]');

        offerCells.forEach(cell => {
            // Prüfe ob bereits ein Icon existiert
            if (cell.querySelector('.copy-icon-first-line')) return;

            const childNodes = Array.from(cell.childNodes);

            let firstLineNodes = [];
            let restNodes = [];
            let foundBr = false;

            for (let node of childNodes) {
                if (node.nodeName === 'BR' && !foundBr) {
                    foundBr = true;
                    restNodes.push(node);
                    continue;
                }

                if (!foundBr) {
                    firstLineNodes.push(node);
                } else {
                    restNodes.push(node);
                }
            }

            if (firstLineNodes.length > 0) {
                let firstLineText = '';
                firstLineNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        firstLineText += node.textContent;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        // Klone den Node
                        const clonedNode = node.cloneNode(true);

                        // 1. Entferne script-Tags
                        clonedNode.querySelectorAll('script').forEach(el => el.remove());

                        // 2. Entferne popuptext-Spans (versteckte Inhalte)
                        clonedNode.querySelectorAll('.popuptext').forEach(el => el.remove());

                        // 3. "Unwrap" Highlighting-Spans (behalte Text, entferne Span)
                        clonedNode.querySelectorAll('span[class*="colour_"], span.popup').forEach(span => {
                            const parent = span.parentNode;
                            // Verschiebe alle Kinder des Spans zum Parent
                            while (span.firstChild) {
                                parent.insertBefore(span.firstChild, span);
                            }
                            parent.removeChild(span);
                        });

                        firstLineText += clonedNode.textContent;
                    } else if (node.textContent) {
                        firstLineText += node.textContent;
                    }
                });
                firstLineText = firstLineText.trim();

                if (firstLineText) {
                    const wrapper = document.createElement('span');
                    wrapper.style.display = 'inline';

                    firstLineNodes.forEach(node => {
                        wrapper.appendChild(node.cloneNode(true));
                    });

                    const copyIcon = createCopyIcon();
                    copyIcon.classList.add('copy-icon-first-line');
                    copyIcon.title = 'Text kopieren';

                    // Event Listener mit Fehlerbehandlung
                    copyIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        let textToCopy = firstLineText.trim();
                        const manufacturer = extractManufacturerFromTitle();

                        if (manufacturer) {
                            const escapedManufacturer = manufacturer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp('^' + escapedManufacturer + '\\s+', 'i');

                            if (regex.test(textToCopy)) {
                                textToCopy = textToCopy.replace(regex, '').trim();
                            }
                        }

                        copyToClipboard(textToCopy, copyIcon);
                    }, true); // useCapture für zuverlässigere Event-Erfassung

                    wrapper.appendChild(document.createTextNode(' '));
                    wrapper.appendChild(copyIcon);

                    cell.innerHTML = '';
                    cell.appendChild(wrapper);
                    restNodes.forEach(node => {
                        cell.appendChild(node.cloneNode(true));
                    });
                }
            }
        });
    };

    // 2. Copy-Icons für Matchcode (EAN) (VERBESSERT)
    const addCopyIconsToMatchcode = () => {
        const matchcodeCells = document.querySelectorAll('td span[class*="td_"]');

        matchcodeCells.forEach(span => {
            if (span.querySelector('.copy-icon-matchcode')) return;

            const link = span.querySelector('a');
            if (!link) return;

            // Extrahiere nur den reinen Text, ignoriere Scripts und Popups
            let matchcodeText = '';

            for (const child of link.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    matchcodeText += child.textContent;
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    // Ignoriere script-Tags und popuptext-Spans
                    if (child.tagName !== 'SCRIPT' && !child.classList.contains('popuptext')) {
                        // Für andere Elemente (z.B. Farb-Spans) nur den direkt enthaltenen Text
                        for (const subChild of child.childNodes) {
                            if (subChild.nodeType === Node.TEXT_NODE) {
                                matchcodeText += subChild.textContent;
                            } else if (subChild.nodeType === Node.ELEMENT_NODE &&
                                       subChild.tagName !== 'SCRIPT' &&
                                       !subChild.classList.contains('popuptext')) {
                                matchcodeText += subChild.textContent;
                            }
                        }
                    }
                }
            }

            matchcodeText = matchcodeText.trim();

            if (matchcodeText.startsWith('ean=')) {
                matchcodeText = matchcodeText.substring(4);
            }

            const copyIcon = createCopyIcon();
            copyIcon.classList.add('copy-icon-matchcode');
            copyIcon.title = 'EAN kopieren (regex-escaped)';

            copyIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                let escapedText = matchcodeText.replace(/[\s\-]+/g, '_');

                escapedText = escapedText.replace(/\+/g, '\\+');
                escapedText = escapedText.replace(/\(/g, '\\(');
                escapedText = escapedText.replace(/\)/g, '\\)');
                escapedText = escapedText.replace(/\[/g, '\\[');
                escapedText = escapedText.replace(/\]/g, '\\]');
                escapedText = escapedText.replace(/\./g, '\\.');
                escapedText = escapedText.replace(/\//g, '\\/');

                copyToClipboard(escapedText, copyIcon);
            }, true);

            span.appendChild(document.createTextNode(' '));
            span.appendChild(copyIcon);
        });
    };

    // 3. Pattern-Generator Icon neben T-Button
    const addPatternGeneratorIcons = () => {
        const tButtons = document.querySelectorAll('input[type="button"][value="T"]');

        tButtons.forEach(tButton => {
            if (tButton.nextElementSibling?.classList.contains('pattern-generator-icon')) return;

            const patternIcon = document.createElement('span');
            patternIcon.textContent = '🔣';
            patternIcon.classList.add('pattern-generator-icon');
            patternIcon.style.cursor = 'pointer';
            patternIcon.style.marginLeft = '5px';
            patternIcon.style.fontSize = '14px';
            patternIcon.style.transition = 'transform 0.2s ease';
            patternIcon.style.display = 'inline-block';
            patternIcon.title = 'Pattern generieren';

            patternIcon.addEventListener('click', (e) => {
                e.stopPropagation();

                const row = tButton.closest('tr');
                if (!row) return;

                const offerCell = row.querySelector('td[class*="td_"]');
                if (!offerCell) return;

                const html = offerCell.innerHTML;
                const parts = html.split('<br>');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = parts[0].trim();
                let firstLine = tempDiv.textContent.trim();

                firstLine = firstLine.replace(/[\s-]/g, '_');

                const matchcodeSpan = row.querySelector('td span[class*="td_"]');
                if (!matchcodeSpan) return;

                const matchcodeLink = matchcodeSpan.querySelector('a');
                if (!matchcodeLink) return;

                let matchcode = matchcodeLink.textContent.trim();

                if (matchcode.startsWith('ean=')) {
                    matchcode = matchcode.substring(4);
                }

                const pattern = `(\\y${firstLine}\\y|${matchcode})`;

                navigator.clipboard.writeText(pattern).then(() => {
                    patternIcon.style.transform = 'scale(1.3)';
                    patternIcon.style.filter = 'brightness(1.5)';

                    setTimeout(() => {
                        patternIcon.style.transform = 'scale(1)';
                        patternIcon.style.filter = 'brightness(1)';
                    }, 300);
                }).catch(err => {
                    patternIcon.style.filter = 'hue-rotate(180deg)';
                    setTimeout(() => {
                        patternIcon.style.filter = 'brightness(1)';
                    }, 300);
                });
            });

            tButton.parentNode.insertBefore(patternIcon, tButton.nextSibling);
        });
    };

    // NEUE FUNKTION: MPN aus Seitentitel extrahieren und ins Clipboard kopieren
    const findAndCopyMpn = () => {
        let titleElement = null;

        const allB = Array.from(document.querySelectorAll('b'));
        for (const b of allB) {
            const text = b.textContent.trim();
            if (/\([^)]+\)\s*$/.test(text) || /\([^)]+\)\s*-/.test(text)) {
                titleElement = b;
                break;
            }
        }

        if (!titleElement) return null;

        const titleText = titleElement.textContent.trim();
        const mpnMatch = titleText.match(/\(([^)]+)\)\s*(?:-|$)/);

        if (mpnMatch) {
            return mpnMatch[1].trim();
        }

        return null;
    };

    // 4. Extract/Incept UI hinzufügen
    const addExtractInceptUI = () => {
        if (document.getElementById('extract-incept-ui')) return;

        const katrDiv = document.getElementById('katr_div');
        if (!katrDiv) return;

        const separatorRow = katrDiv.closest('tr');
        if (!separatorRow) return;

        const newRow = document.createElement('tr');
        newRow.style.backgroundColor = 'whitesmoke';
        newRow.id = 'extract-incept-ui';

        const newCell = document.createElement('td');
        newCell.colSpan = '5';
        newCell.style.padding = '8px 5px';

        const extractBtn = document.createElement('input');
        extractBtn.type = 'button';
        extractBtn.value = 'Extract';
        extractBtn.className = 'button';
        extractBtn.id = 'extract-btn';

        const inceptInput = document.createElement('input');
        inceptInput.type = 'text';
        inceptInput.placeholder = 'Text für Incept...';
        inceptInput.style.marginLeft = '15px';
        inceptInput.style.width = '300px';
        inceptInput.id = 'incept-input';

        const inceptBtn = document.createElement('input');
        inceptBtn.type = 'button';
        inceptBtn.value = 'Incept';
        inceptBtn.className = 'button';
        inceptBtn.style.marginLeft = '8px';
        inceptBtn.id = 'incept-btn';
        inceptBtn.disabled = true;

        const copyMpnBtn = document.createElement('input');
        copyMpnBtn.type = 'button';
        copyMpnBtn.value = 'Copy MPN';
        copyMpnBtn.className = 'button';
        copyMpnBtn.style.marginLeft = '8px';
        copyMpnBtn.id = 'copy-mpn-btn';

        const inceptMpnBtn = document.createElement('input');
        inceptMpnBtn.type = 'button';
        inceptMpnBtn.value = 'Incept MPN';
        inceptMpnBtn.className = 'button';
        inceptMpnBtn.style.marginLeft = '8px';
        inceptMpnBtn.id = 'incept-mpn-btn';

        newCell.appendChild(extractBtn);
        newCell.appendChild(inceptInput);
        newCell.appendChild(inceptBtn);
        newCell.appendChild(copyMpnBtn);
        newCell.appendChild(inceptMpnBtn);
        newRow.appendChild(newCell);

        separatorRow.parentNode.insertBefore(newRow, separatorRow.nextSibling);

        // Event Listeners

        const updateExtractButtonState = () => {
            const ruleTextarea = document.getElementById('rule');
            if (!ruleTextarea) return;

            const lines = ruleTextarea.value.split('\n');
            const nonEmptyLines = lines.filter(l => l.trim());

            const canExtract = nonEmptyLines.some(l => l.includes('|'));
            extractBtn.disabled = !canExtract;
        };

        extractBtn.addEventListener('click', () => {
            const ruleTextarea = document.getElementById('rule');
            if (!ruleTextarea) return;

            let lines = ruleTextarea.value.split('\n');
            const nonEmptyLines = lines.filter(l => l.trim());

            const linesWithPipes = nonEmptyLines.filter(l => l.includes('|'));

            if (linesWithPipes.length === 0) {
                return;
            }

            if (linesWithPipes.length === 1) {
                const newLines = lines.map(line => {
                    if (line.trim() && line.includes('|')) {
                        const pipeIndex = line.indexOf('|');
                        return line.substring(pipeIndex + 1);
                    }
                    return line;
                });
                ruleTextarea.value = newLines.join('\n');
            } else {
                const prefixes = linesWithPipes.map(l => {
                    const pipeIndex = l.indexOf('|');
                    return l.substring(0, pipeIndex + 1);
                });

                const firstPrefix = prefixes[0];
                const allSame = prefixes.every(p => p === firstPrefix);

                if (allSame && firstPrefix) {
                    const newLines = lines.map(line => {
                        if (line.trim() && line.startsWith(firstPrefix)) {
                            return line.substring(firstPrefix.length);
                        }
                        return line;
                    });
                    ruleTextarea.value = newLines.join('\n');
                } else {
                    const newLines = lines.map(line => {
                        if (line.trim() && line.includes('|')) {
                            const pipeIndex = line.indexOf('|');
                            return line.substring(pipeIndex + 1);
                        }
                        return line;
                    });
                    ruleTextarea.value = newLines.join('\n');
                }
            }

            updateExtractButtonState();
        });

        inceptInput.addEventListener('input', () => {
            inceptBtn.disabled = inceptInput.value.trim() === '';
        });

        // Hover Preview für Incept Button
        inceptBtn.addEventListener('mouseenter', () => {
            const inputText = inceptInput.value.trim();
            if (inputText === '' || inceptBtn.disabled) return;

            const escaped = escapeForRule(inputText);
            const ruleTextarea = document.getElementById('rule');
            const currentValue = ruleTextarea ? ruleTextarea.value.trim() : '';

            let previewText;
            if (currentValue === '') {
                previewText = `\\y${escaped}\\y`;
            } else {
                previewText = `\\y${escaped}\\y|`;
            }

            // Erstelle oder zeige Preview Element
            if (!inceptBtn.previewElement) {
                inceptBtn.previewElement = document.createElement('div');
                inceptBtn.previewElement.style.position = 'absolute';
                inceptBtn.previewElement.style.backgroundColor = '#EF0FFF';
                inceptBtn.previewElement.style.color = 'white';
                inceptBtn.previewElement.style.padding = '6px 10px';
                inceptBtn.previewElement.style.borderRadius = '4px';
                inceptBtn.previewElement.style.fontSize = '12px';
                inceptBtn.previewElement.style.whiteSpace = 'nowrap';
                inceptBtn.previewElement.style.zIndex = '10000';
                inceptBtn.previewElement.style.marginTop = '5px';
                inceptBtn.previewElement.style.fontFamily = 'monospace';
                inceptBtn.previewElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                document.body.appendChild(inceptBtn.previewElement);
            }

            inceptBtn.previewElement.textContent = previewText;
            const rect = inceptBtn.getBoundingClientRect();
            inceptBtn.previewElement.style.top = (rect.bottom + window.scrollY) + 'px';
            inceptBtn.previewElement.style.left = rect.left + 'px';
            inceptBtn.previewElement.style.display = 'block';
        });

        inceptBtn.addEventListener('mouseleave', () => {
            if (inceptBtn.previewElement) {
                inceptBtn.previewElement.style.display = 'none';
            }
        });

        inceptBtn.addEventListener('click', () => {
            const ruleTextarea = document.getElementById('rule');
            const inputText = inceptInput.value.trim();
            if (!ruleTextarea || !inputText) return;

            const escaped = escapeForRule(inputText);
            const currentValue = ruleTextarea.value.trim();

            if (currentValue === '') {
                ruleTextarea.value = `\\y${escaped}\\y`;
            } else {
                const lines = currentValue.split('\n');
                const newLines = lines.map(line => {
                    if (line.trim()) {
                        return `\\y${escaped}\\y|` + line;
                    }
                    return line;
                });
                ruleTextarea.value = newLines.join('\n');
            }

            inceptInput.value = '';
            inceptBtn.disabled = true;

            // Preview ausblenden
            if (inceptBtn.previewElement) {
                inceptBtn.previewElement.style.display = 'none';
            }

            updateExtractButtonState();
        });

        // Copy MPN Button (VERBESSERT mit Fehlerbehandlung)
        copyMpnBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const mpn = findAndCopyMpn();

            if (mpn && mpn.length > 0) {
                navigator.clipboard.writeText(mpn).then(() => {
                    const originalBg = copyMpnBtn.style.backgroundColor;
                    copyMpnBtn.style.backgroundColor = '#00cc00';
                    copyMpnBtn.style.color = 'white';

                    setTimeout(() => {
                        copyMpnBtn.style.backgroundColor = originalBg || '';
                        copyMpnBtn.style.color = '';
                    }, 300);
                }).catch(err => {
                    copyMpnBtn.style.backgroundColor = '#cc0000';
                    setTimeout(() => {
                        copyMpnBtn.style.backgroundColor = '';
                    }, 300);
                });
            } else {
                copyMpnBtn.style.backgroundColor = '#ffaa00';
                copyMpnBtn.title = 'Keine MPN gefunden';
                setTimeout(() => {
                    copyMpnBtn.style.backgroundColor = '';
                }, 500);
            }
        });

        // Incept MPN Button
        inceptMpnBtn.addEventListener('click', () => {
            const ruleTextarea = document.getElementById('rule');
            if (!ruleTextarea) return;

            const mpn = findAndCopyMpn();

            if (!mpn) return;

            const hasMultipleMpns = /\s+\/\s+/.test(mpn);

            let mpnString;

            if (hasMultipleMpns) {
                const mpns = mpn.split(/\s*\/\s+/).map(m => m.trim());
                const escapedMpns = mpns.map(m => `\\y${escapeForRule(m)}\\y`);
                mpnString = escapedMpns.join('|');
            } else {
                mpnString = '\\y%mpn%\\y';
            }

            const currentValue = ruleTextarea.value.trim();

            if (currentValue === '') {
                ruleTextarea.value = mpnString;
            } else {
                const lines = currentValue.split('\n');
                const newLines = lines.map(line => {
                    if (line.trim()) {
                        return mpnString + '|' + line;
                    }
                    return line;
                });
                ruleTextarea.value = newLines.join('\n');
            }

            updateExtractButtonState();
        });

        const updateMpnButtonState = () => {
            const mpn = findAndCopyMpn();
            const isDisabled = !mpn;

            copyMpnBtn.disabled = isDisabled;
            inceptMpnBtn.disabled = isDisabled;

            // Visuelles Feedback
            copyMpnBtn.style.opacity = isDisabled ? '0.5' : '';
            copyMpnBtn.style.cursor = isDisabled ? 'not-allowed' : '';
            inceptMpnBtn.style.opacity = isDisabled ? '0.5' : '';
            inceptMpnBtn.style.cursor = isDisabled ? 'not-allowed' : '';

            // Tooltip setzen
            copyMpnBtn.title = isDisabled ? 'Keine MPN gefunden' : 'MPN in Zwischenablage kopieren';
            inceptMpnBtn.title = isDisabled ? 'Keine MPN gefunden' : 'MPN ins Rule-Feld einfügen';
        };

        updateMpnButtonState();
        updateExtractButtonState();

        const ruleTextarea = document.getElementById('rule');
        if (ruleTextarea) {
            ruleTextarea.addEventListener('input', updateExtractButtonState);
        }
    };

    // 5. Auto-fill für ID 9999999
    const autoFillPriceFor9999999 = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id === '9999999') {
            const applyChanges = () => {
                const lowInput = document.querySelector('input[name="low"]');
                const highInput = document.querySelector('input[name="high"]');
                const testBtn = document.querySelector('input[name="rm_match"]');
                const saveTestBtn = document.querySelector('input[name="rm_wr_match"]');
                const saveOnlyBtn = document.querySelector('input[name="rm_save"]');

                if (lowInput && highInput) {
                    lowInput.value = '0.000';
                    highInput.value = '50000.000';
                }

                if (testBtn && saveTestBtn) {
                    if (saveTestBtn.hasAttribute('accesskey')) {
                        saveTestBtn.removeAttribute('accesskey');
                    }
                    testBtn.setAttribute('accesskey', 'S');
                }

                // Deaktiviere "Speichern & Testen" und "Nur Speichern"
                if (saveTestBtn) {
                    saveTestBtn.disabled = true;
                    saveTestBtn.style.opacity = '0.5';
                    saveTestBtn.style.cursor = 'not-allowed';
                }

                if (saveOnlyBtn) {
                    saveOnlyBtn.disabled = true;
                    saveOnlyBtn.style.opacity = '0.5';
                    saveOnlyBtn.style.cursor = 'not-allowed';
                }

                // Ersetze "(no name)" mit "(BLANKO STARO)" in roter Farbe und fett
                const filterTable = document.getElementById('filtertable');
                if (filterTable) {
                    const boldElements = filterTable.querySelectorAll('b');
                    for (const boldElem of boldElements) {
                        if (boldElem.textContent.includes('(no name)')) {
                            // Erstelle neues HTML mit BLANKO STARO in roter Farbe und fett
                            boldElem.innerHTML = boldElem.innerHTML.replace(
                                '(no name)',
                                '(<span style="color: red; font-weight: bold;">BLANKO STARO</span>)'
                            );
                        }
                    }
                }
            };

            // Versuche sofort anzuwenden
            applyChanges();

            // Versuche mehrmals mit kurzen Intervallen
            for (let i = 1; i <= 5; i++) {
                setTimeout(applyChanges, i * 100);
            }

            // Beobachte Änderungen am DOM als Fallback
            const buttonObserver = new MutationObserver(() => {
                applyChanges();
            });

            buttonObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    };

    // 6. Preisbereich-Preset Button hinzufügen
    const addPriceRangePreset = () => {
        // Überprüfe ob der Button bereits existiert
        if (document.getElementById('price-range-preset-btn')) return;

        // Finde die low und high input felder
        const lowInput = document.querySelector('input[name="low"]');
        const highInput = document.querySelector('input[name="high"]');

        if (!lowInput || !highInput) return;

        // Finde die td die beide inputs enthält
        const td = lowInput.closest('td');
        if (!td) return;

        // Erstelle einen Container div für den button
        const buttonDiv = document.createElement('div');
        buttonDiv.style.marginTop = '8px';
        buttonDiv.style.paddingTop = '8px';
        buttonDiv.style.borderTop = '1px solid #ddd';
        buttonDiv.id = 'price-range-preset-container';

        // Erstelle den button
        const presetBtn = document.createElement('input');
        presetBtn.type = 'button';
        presetBtn.value = 'Preisbereich: 0 - 50000';
        presetBtn.className = 'button';
        presetBtn.id = 'price-range-preset-btn';
        presetBtn.style.width = '100%';
        presetBtn.style.boxSizing = 'border-box';

        // Click event
        presetBtn.addEventListener('click', () => {
            lowInput.value = '0.000';
            highInput.value = '50000.000';

            // Finde den Testen-Button und klicke ihn
            const testBtn = document.querySelector('input[name="rm_match"]');
            if (testBtn) {
                setTimeout(() => {
                    testBtn.click();
                }, 100);
            }

            // Optional: Visuelles Feedback
            presetBtn.style.backgroundColor = '#00cc00';
            presetBtn.style.color = 'white';
            setTimeout(() => {
                presetBtn.style.backgroundColor = '';
                presetBtn.style.color = '';
            }, 300);
        });

        buttonDiv.appendChild(presetBtn);
        td.appendChild(buttonDiv);
    };

    // Initialisierung
    const initializeScript = () => {
        autoFillPriceFor9999999();
        addCopyIconsToFirstLine();
        addCopyIconsToMatchcode();
        addPatternGeneratorIcons();
        addExtractInceptUI();
        addPriceRangePreset();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                initializeScript();
            }, 300);
        });
    } else {
        setTimeout(() => {
            initializeScript();
        }, 300);
    }

    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
        });
        if (shouldUpdate) {
            setTimeout(initializeScript, 200);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();