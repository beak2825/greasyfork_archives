// ==UserScript==
// @name         BBCode Table Generator & Image Uploader
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Genera tabelle in BBCode e aggiunge un pulsante per caricare immagini vicino al pulsante delle tabelle
// @author       Ace D.Portugal
// @match        *://bitcointalk.org/*
// @match        *://altcoinstalks.com/*
// @match        *://www.altcoinstalks.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/548629/BBCode%20Table%20Generator%20%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/548629/BBCode%20Table%20Generator%20%20Image%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isVisible(el) {
        return el && el.offsetParent !== null && window.getComputedStyle(el).display !== 'none';
    }

    function waitForElement(selectors, callback, maxAttempts = 40, interval = 500) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && isVisible(element)) {
                    clearInterval(checkInterval);
                    callback(element);
                    return;
                }
            }
            if (attempts++ >= maxAttempts) {
                clearInterval(checkInterval);
                console.error("Nessun elemento visibile trovato con i selettori:", selectors);
            }
        }, interval);
    }

    function loadTemplates() {
        return GM_getValue('bbcodeTableTemplates', []);
    }

    function saveTemplates(templates) {
        GM_setValue('bbcodeTableTemplates', templates);
    }

    function addTemplate(name, data) {
        const templates = loadTemplates();
        templates.push({ name, data });
        saveTemplates(templates);
    }

    function removeTemplate(index) {
        const templates = loadTemplates();
        templates.splice(index, 1);
        saveTemplates(templates);
    }

    function insertBBCode(openTag, closeTag = '') {
        const textarea = document.getElementById('bbcodeDataInput');
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const newText = textarea.value.substring(0, start) + openTag + selectedText + closeTag + textarea.value.substring(end);
        textarea.value = newText;
        textarea.focus();
        textarea.selectionStart = start + openTag.length;
        textarea.selectionEnd = end + openTag.length;
    }

    function bbcodeToHtml(bbcode) {
        return bbcode
            .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
            .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
            .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
            .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank">$2</a>')
            .replace(/\[img(?:=([^\]]*))?\](.*?)\[\/img\]/g, function(match, attributes, url) {
                if (attributes) {
                    const style = attributes.split('|').map(attr => {
                        const [key, value] = attr.split('=');
                        return `${key}:${value}`;
                    }).join(';');
                    return `<img src="${url}" style="${style};max-width: 100%;height: auto;">`;
                } else {
                    return `<img src="${url}" style="max-width: 100%;height: auto;">`;
                }
            })
            .replace(/\[color=(.*?)\](.*?)\[\/color\]/g, '<span style="color: $1;">$2</span>')
            .replace(/\[size=(.*?)\](.*?)\[\/size\]/g, '<span style="font-size: $1;">$2</span>')
            .replace(/\[font=(.*?)\](.*?)\[\/font\]/g, '<span style="font-family: $1;">$2</span>')
            .replace(/\[glow=(.*?),2,300\](.*?)\[\/glow\]/g, '<span style="text-shadow: 0 0 8px $1;">$2</span>');
    }

    function uploadImage(e) {
        e.preventDefault();
        e.stopPropagation();

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const uploadButton = document.getElementById('uploadImageBtn');
            if (uploadButton) {
                uploadButton.textContent = 'Caricamento...';
            }

            try {
                const formData = new FormData();
                formData.append('image', file);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://hostmeme.com/bitcointalk.php',
                    data: formData,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.success && data.url) {
                                let bbcode = `[img]${data.url}[/img]`;
                                if (data.width && data.height) {
                                    bbcode = `[img width=${data.width} height=${data.height}]${data.url}[/img]`;
                                }

                                const textarea = document.querySelector('textarea[name="message"]');
                                if (textarea) {
                                    textarea.value += `\n${bbcode}\n`;
                                    textarea.focus();
                                }
                            } else {
                                alert("Caricamento fallito: " + (data.error || "Errore sconosciuto"));
                            }
                        } catch (e) {
                            alert("Errore di caricamento: risposta non valida");
                        } finally {
                            if (uploadButton) {
                                uploadButton.textContent = 'Carica Immagine';
                            }
                        }
                    },
                    onerror: function(error) {
                        alert("Errore di caricamento: " + error);
                        if (uploadButton) {
                            uploadButton.textContent = 'Carica Immagine';
                        }
                    }
                });
            } catch (err) {
                alert("Errore di caricamento: " + err.message);
                if (uploadButton) {
                    uploadButton.textContent = 'Carica Immagine';
                }
            }
        };

        input.click();
    }

    window.addEventListener('load', function() {
        setTimeout(function() {
            const replySelectors = [
                'textarea[name="message"]',
                '.postingbox',
                '#quick_reply',
                'form#postmodify textarea[name="message"]',
                '#vB_Editor_QR_textarea',
                '#fast_reply',
                '#message',
                'textarea.editor',
            ];

            waitForElement(replySelectors, function(replyBox) {
                // Container per i pulsanti
                const buttonContainer = document.createElement('div');
                buttonContainer.style.margin = '10px 0';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '5px';

                // Pulsante per generare tabelle
                const tableButton = document.createElement('button');
                tableButton.textContent = 'Genera Tabella da Testo';
                tableButton.style.padding = '5px 10px';
                tableButton.style.backgroundColor = '#4CAF50';
                tableButton.style.color = 'white';
                tableButton.style.border = 'none';
                tableButton.style.borderRadius = '4px';
                tableButton.style.cursor = 'pointer';
                tableButton.onclick = openTableGenerator;

                // Pulsante per caricare immagini
                const uploadButton = document.createElement('button');
                uploadButton.id = 'uploadImageBtn';
                uploadButton.textContent = 'Carica Immagine';
                uploadButton.style.padding = '5px 10px';
                uploadButton.style.backgroundColor = '#FF9800';
                uploadButton.style.color = 'white';
                uploadButton.style.border = 'none';
                uploadButton.style.borderRadius = '4px';
                uploadButton.style.cursor = 'pointer';
                uploadButton.onclick = uploadImage;

                // Aggiungi i pulsanti al container
                buttonContainer.appendChild(tableButton);
                buttonContainer.appendChild(uploadButton);

                // Aggiungi il container al DOM
                replyBox.parentNode.insertBefore(buttonContainer, replyBox);
                console.log("Pulsanti aggiunti con successo!");
            });
        }, 2000);
    });

    function openTableGenerator(e) {
        e.preventDefault();
        e.stopPropagation();

        const oldOverlay = document.getElementById('bbcodeTableOverlay');
        if (oldOverlay) oldOverlay.remove();
        const oldModal = document.getElementById('bbcodeTableModal');
        if (oldModal) oldModal.remove();

        const overlay = document.createElement('div');
        overlay.id = 'bbcodeTableOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        const modal = document.createElement('div');
        modal.id = 'bbcodeTableModal';
        modal.style.background = 'white';
        modal.style.padding = '20px';
        modal.style.borderRadius = '5px';
        modal.style.maxWidth = '80%';
        modal.style.maxHeight = '80%';
        modal.style.overflow = 'auto';
        modal.style.zIndex = '9999';

        const templates = loadTemplates();
        let templateOptions = '<option value="">-- Seleziona un modello --</option>';
        templates.forEach((template, index) => {
            templateOptions += `<option value="${index}">${template.name}</option>`;
        });

        // Opzioni per colori
        const colorOptions = [
            { value: 'black', label: 'Nero' },
            { value: 'white', label: 'Bianco' },
            { value: 'red', label: 'Rosso' },
            { value: 'green', label: 'Verde' },
            { value: 'blue', label: 'Blu' },
            { value: 'yellow', label: 'Giallo' },
            { value: 'orange', label: 'Arancione' },
            { value: '#ff00ff', label: 'Magenta' },
            { value: '#00ffff', label: 'Ciano' },
            { value: '#ffa500', label: 'Arancione Scuro' },
            { value: '#800080', label: 'Viola' }
        ];

        let colorSelectOptions = colorOptions.map(color => `<option value="${color.value}" style="color: ${color.value};">${color.label}</option>`).join('');

        // Opzioni per font
        const fontOptions = [
            { value: 'Arial', label: 'Arial' },
            { value: 'Verdana', label: 'Verdana' },
            { value: 'Times New Roman', label: 'Times New Roman' },
            { value: 'Courier New', label: 'Courier New' },
            { value: 'Georgia', label: 'Georgia' },
            { value: 'Impact', label: 'Impact' },
            { value: 'Comic Sans MS', label: 'Comic Sans MS' }
        ];

        let fontSelectOptions = fontOptions.map(font => `<option value="${font.value}">${font.label}</option>`).join('');

        // Opzioni per dimensioni font
        const sizeOptions = [
            { value: '8pt', label: '8pt' },
            { value: '10pt', label: '10pt' },
            { value: '12pt', label: '12pt' },
            { value: '14pt', label: '14pt' },
            { value: '16pt', label: '16pt' },
            { value: '18pt', label: '18pt' },
            { value: '20pt', label: '20pt' }
        ];

        let sizeSelectOptions = sizeOptions.map(size => `<option value="${size.value}">${size.label}</option>`).join('');

        modal.innerHTML = `
            <h3 style="margin-top: 0;">Genera Tabella da Testo</h3>

            <div style="margin-bottom: 10px;">
                <label>Modelli salvati: </label>
                <select id="bbcodeTemplateSelect" style="padding: 5px;">
                    ${templateOptions}
                </select>
                <button id="bbcodeLoadTemplate" style="margin-left: 5px; padding: 5px 10px; background-color: #2196F3; color: white; border: none; border-radius: 4px;">Carica</button>
                <button id="bbcodeDeleteTemplate" style="margin-left: 5px; padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px;">Elimina</button>
            </div>

            <div style="margin-bottom: 10px;">
                <label>Nome modello: </label>
                <input type="text" id="bbcodeTemplateName" style="padding: 5px; width: 200px;" placeholder="Nome del modello">
                <button id="bbcodeSaveTemplate" style="margin-left: 5px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">Salva Modello</button>
            </div>

            <p>Inserisci i dati separando le colonne con una virgola (,) e le righe con un a capo.</p>

            <div style="margin-bottom: 10px;">
                <div style="margin-bottom: 5px; font-weight: bold;">Pulsanti di formattazione rapida:</div>
                <button class="format-button" data-open="[b]" data-close="[/b]" style="margin-right: 5px; padding: 3px 8px; background-color: #4CAF50; color: white; border: none; border-radius: 3px;">Grassetto</button>
                <button class="format-button" data-open="[i]" data-close="[/i]" style="margin-right: 5px; padding: 3px 8px; background-color: #2196F3; color: white; border: none; border-radius: 3px;">Corsivo</button>
                <button class="format-button" data-open="[u]" data-close="[/u]" style="margin-right: 5px; padding: 3px 8px; background-color: #9C27B0; color: white; border: none; border-radius: 3px;">Sottolineato</button>
                <button class="format-button" data-open="[url=" data-close="][/url]" style="margin-right: 5px; padding: 3px 8px; background-color: #FF5722; color: white; border: none; border-radius: 3px;">Link</button>
                <button class="format-button" data-open="[img]" data-close="[/img]" style="margin-right: 5px; padding: 3px 8px; background-color: #FF9800; color: white; border: none; border-radius: 3px;">Immagine</button>
            </div>

            <div style="margin-bottom: 10px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                <div style="margin-bottom: 5px; font-weight: bold;">Formattazione globale:</div>
                <div style="margin-bottom: 10px;">
                    <label>Colore testo: </label>
                    <select id="bbcodeTextColor" style="padding: 5px; margin-right: 10px;">
                        <option value="">Nessuno</option>
                        ${colorSelectOptions}
                    </select>

                    <label>Font: </label>
                    <select id="bbcodeTextFont" style="padding: 5px; margin-right: 10px;">
                        <option value="">Nessuno</option>
                        ${fontSelectOptions}
                    </select>

                    <label>Dimensione: </label>
                    <select id="bbcodeTextSize" style="padding: 5px;">
                        <option value="">Nessuna</option>
                        ${sizeSelectOptions}
                    </select>
                </div>

                <div style="margin-bottom: 10px;">
                    <label><input type="checkbox" id="bbcodeBoldHeaders" checked> Header in grassetto</label>
                    <label style="margin-left: 10px;"><input type="checkbox" id="bbcodeGlowHeaders"> Effetto Glow su Header</label>
                    <label style="margin-left: 10px;">Colore glow header: <input type="color" id="bbcodeGlowColorHeaders" value="#ff0000"></label>
                </div>

                <div style="margin-bottom: 10px;">
                    <label><input type="checkbox" id="bbcodeGlowBody"> Effetto Glow su Corpo</label>
                    <label style="margin-left: 10px;">Colore glow corpo: <input type="color" id="bbcodeGlowColorBody" value="#00ff00"></label>
                </div>
            </div>

            <textarea id="bbcodeDataInput" style="width: 100%; height: 100px; margin: 10px 0; padding: 8px; box-sizing: border-box;" placeholder="Esempio:
Match, Date, Odds
Inter vs Juventus, 13/08/24, X
Milan vs Roma, 14/08/24, 2"></textarea>

            <button id="bbcodeGenerateTable" style="margin: 5px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">Genera Tabella</button>

            <div id="bbcodeTablePreview" style="margin: 10px 0; border: 1px solid #ddd; padding: 10px; min-height: 50px;"></div>

            <div>
                <button id="bbcodeCopyBBCode" style="margin: 5px; padding: 5px 10px; background-color: #2196F3; color: white; border: none; border-radius: 4px;">Copia BBCode</button>
                <button id="bbcodeCloseModal" style="margin: 5px; padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px;">Chiudi</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Aggiungi gestione pulsanti di formattazione
        const formatButtons = modal.querySelectorAll('.format-button');
        formatButtons.forEach(button => {
            button.addEventListener('click', function() {
                const openTag = this.getAttribute('data-open');
                const closeTag = this.getAttribute('data-close') || '';
                if (openTag === '[url=') {
                    const url = prompt("Inserisci l'URL:", "https://");
                    if (url) insertBBCode(`[url=${url}]`, '[/url]');
                } else if (openTag === '[img]') {
                    const imgUrl = prompt("Inserisci l'URL dell'immagine:", "https://");
                    if (imgUrl) {
                        const width = prompt("Inserisci la larghezza (es: 100px, 50%, lascialo vuoto per auto):", "");
                        const height = prompt("Inserisci l'altezza (es: 100px, 50%, lascialo vuoto per auto):", "");

                        let attributes = [];
                        if (width) attributes.push(`width=${width}`);
                        if (height) attributes.push(`height=${height}`);

                        let imgTag;
                        if (attributes.length > 0) {
                            imgTag = `[img=${attributes.join('|')}]${imgUrl}[/img]`;
                        } else {
                            imgTag = `[img]${imgUrl}[/img]`;
                        }

                        insertBBCode(imgTag, '');
                    }
                } else {
                    insertBBCode(openTag, closeTag);
                }
            });
        });

        // Carica un modello
        modal.querySelector('#bbcodeLoadTemplate').addEventListener('click', function() {
            const select = modal.querySelector('#bbcodeTemplateSelect');
            const index = select.value;
            if (index !== "") {
                const templates = loadTemplates();
                modal.querySelector('#bbcodeDataInput').value = templates[index].data;
            }
        });

        // Elimina un modello
        modal.querySelector('#bbcodeDeleteTemplate').addEventListener('click', function() {
            const select = modal.querySelector('#bbcodeTemplateSelect');
            const index = select.value;
            if (index !== "") {
                removeTemplate(index);
                select.remove(select.selectedIndex);
                GM_notification({text: 'Modello eliminato!', title: 'Successo'});
            }
        });

        // Salva un modello
        modal.querySelector('#bbcodeSaveTemplate').addEventListener('click', function() {
            const name = modal.querySelector('#bbcodeTemplateName').value.trim();
            const data = modal.querySelector('#bbcodeDataInput').value.trim();
            if (name && data) {
                addTemplate(name, data);
                GM_notification({text: 'Modello salvato!', title: 'Successo'});
            } else {
                alert("Inserisci un nome e dei dati per il modello.");
            }
        });

        modal.querySelector('#bbcodeGenerateTable').addEventListener('click', generateTableFromText);
        modal.querySelector('#bbcodeCopyBBCode').addEventListener('click', copyBBCode);
        modal.querySelector('#bbcodeCloseModal').addEventListener('click', () => {
            overlay.remove();
            modal.remove();
        });
    }

    function generateTableFromText() {
        const inputText = document.getElementById('bbcodeDataInput').value.trim();
        const lines = inputText.split('\n');
        if (lines.length < 2) {
            alert("Inserisci almeno due righe di dati (intestazione + almeno una riga).");
            return;
        }

        const isBoldHeaders = document.getElementById('bbcodeBoldHeaders').checked;
        const isGlowHeaders = document.getElementById('bbcodeGlowHeaders').checked;
        const isGlowBody = document.getElementById('bbcodeGlowBody').checked;
        const glowColorHeaders = document.getElementById('bbcodeGlowColorHeaders').value;
        const glowColorBody = document.getElementById('bbcodeGlowColorBody').value;
        const textColor = document.getElementById('bbcodeTextColor').value;
        const textFont = document.getElementById('bbcodeTextFont').value;
        const textSize = document.getElementById('bbcodeTextSize').value;

        let bbcode = '[table]';
        let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin-top: 10px;">';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') continue;
            const cells = line.split(',').map(cell => cell.trim());
            if (cells.length === 0) continue;

            tableHTML += '<tr>';
            bbcode += '[tr]';

            for (let j = 0; j < cells.length; j++) {
                let cell = cells[j];
                const isHeader = (i === 0);

                // Applica formattazione globale
                let bbcodeCell = cell;
                if (textColor) bbcodeCell = `[color=${textColor}]${bbcodeCell}[/color]`;
                if (textFont) bbcodeCell = `[font=${textFont}]${bbcodeCell}[/font]`;
                if (textSize) bbcodeCell = `[size=${textSize}]${bbcodeCell}[/size]`;

                if (isHeader) {
                    if (isBoldHeaders) bbcodeCell = `[b]${bbcodeCell}[/b]`;
                    if (isGlowHeaders) bbcodeCell = `[glow=${glowColorHeaders},2,300]${bbcodeCell}[/glow]`;
                } else if (isGlowBody) {
                    bbcodeCell = `[glow=${glowColorBody},2,300]${bbcodeCell}[/glow]`;
                }

                // Applica formattazione globale all'HTML
                let htmlCell = bbcodeToHtml(cell);
                let style = '';
                if (textColor) style += `color: ${textColor};`;
                if (textFont) style += `font-family: ${textFont};`;
                if (textSize) style += `font-size: ${textSize};`;
                if (style) htmlCell = `<span style="${style}">${htmlCell}</span>`;

                if (isHeader) {
                    if (isBoldHeaders) htmlCell = `<strong>${htmlCell}</strong>`;
                    if (isGlowHeaders) htmlCell = `<span style="text-shadow: 0 0 8px ${glowColorHeaders};">${htmlCell}</span>`;
                } else if (isGlowBody) {
                    htmlCell = `<span style="text-shadow: 0 0 8px ${glowColorBody};">${htmlCell}</span>`;
                }

                tableHTML += `<td style="border: 1px solid #ddd; padding: 5px;">${htmlCell}</td>`;
                bbcode += `[td]${bbcodeCell}[/td]`;
            }

            tableHTML += '</tr>';
            bbcode += '[/tr]';
        }

        tableHTML += '</table>';
        bbcode += '[/table]';

        const preview = document.getElementById('bbcodeTablePreview');
        preview.innerHTML = tableHTML;
        preview.setAttribute('data-bbcode', bbcode);
    }

    function copyBBCode() {
        const preview = document.getElementById('bbcodeTablePreview');
        const bbcode = preview.getAttribute('data-bbcode');
        if (bbcode) {
            GM_setClipboard(bbcode, 'text');
            GM_notification({text: 'BBCode copiato negli appunti!', title: 'Successo'});
        } else {
            alert("Genera prima la tabella!");
        }
    }
})();
