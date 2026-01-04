// ==UserScript==
// @name         Grand RP Template Manager
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Simple template dropdown for Grand RP Forum
// @author       Made with ❤️ by Tom Fresh
// @license      GNU General Public License v3.0
// @match        https://gta5grand.com/forum/threads/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @supportURL   https://greasyfork.org/de/scripts/548457-grand-rp-template-manager/feedback
// @downloadURL https://update.greasyfork.org/scripts/548457/Grand%20RP%20Template%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/548457/Grand%20RP%20Template%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let templateData = {};

    // Warte bis die Seite vollständig geladen ist
    $(document).ready(function() {
        if (!window.location.href.match(/threads\/\d+/)) {
            return;
        }

        const checkButton = setInterval(function() {
            const postReplyButton = $('.formButtonGroup-primary .button--primary');
            if (postReplyButton.length > 0) {
                clearInterval(checkButton);
                setTimeout(createTemplateButton, 800);
            }
        }, 600);
    });

    function createTemplateButton() {
        const buttonHTML = `
            <div class="template-manager" style="margin-right: 8px; display: flex; align-items: center; gap: 6px;">
                <button type="button" id="template-main-btn" style="
                    background: #ffca1d;
                    border: 1px solid #e6b61a;
                    color: #333;
                    border-radius: 16px;
                    padding: 12px 18px;
                    font-size: 13px;
                    cursor: pointer;
                    outline: none;
                    font-weight: 500;
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                    <span>Templates</span>
                    <i class="fa--xf far fa-chevron-down" aria-hidden="true" style="font-size: 11px;"></i>
                </button>
                <div id="update-notification" style="
                    display: none;
                    background: #d32f2f;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    position: relative;
                " title="Update verfügbar">
                    !
                </div>
                <div id="template-main-menu" class="dropdown-menu" style="
                    position: absolute;
                    background: #ffca1d;
                    border: 1px solid #e6b61a;
                    border-radius: 16px;
                    padding: 15px 18px 13px 18px;
                    min-width: 200px;
                    z-index: 1000;
                    display: none;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    margin-top: 4px;
                ">
                    <div id="load-menu-item" style="
                        padding: 8px 0;
                        border-bottom: 1px solid #e6b61a;
                        margin-bottom: 8px;
                        cursor: pointer;
                        color: #333;
                        font-weight: 500;
                        font-size: 13px;
                    ">
                        <i class="fa--xf far fa-folder-open" aria-hidden="true" style="margin-right: 6px;"></i>
                        Templates laden
                    </div>
                    <div id="clear-menu-item" style="
                        padding: 8px 0;
                        border-bottom: 1px solid #e6b61a;
                        margin-bottom: 8px;
                        cursor: pointer;
                        color: #d32f2f;
                        font-weight: 500;
                        font-size: 13px;
                    ">
                        <i class="fa--xf far fa-trash-alt" aria-hidden="true" style="margin-right: 6px;"></i>
                        Templates löschen
                    </div>
                    <div id="template-entries"></div>
                </div>
                <input type="file" id="file-input-hidden" webkitdirectory directory style="display: none;" accept=".txt">
            </div>
        `;

        const formButtonGroupPrimary = $('.formButtonGroup-primary');
        if (formButtonGroupPrimary.length > 0) {
            formButtonGroupPrimary.after(buttonHTML);
            setupEventHandlers();
            loadSavedTemplates();
            
            // Einmalige Update-Prüfung beim Laden der Seite
            checkForUpdates(false);
        }
    }

    function setupEventHandlers() {
        // Hauptbutton Toggle
        $('#template-main-btn').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const menu = $('#template-main-menu');
            const chevron = $(this).find('i');
            
            if (menu.is(':visible')) {
                menu.hide();
                chevron.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            } else {
                // Berechne optimale Position (oben oder unten)
                calculateDropdownPosition(menu, $(this));
                menu.show();
                chevron.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            }
        });

        // Klick außerhalb schließt Menü
        $(document).click(function(e) {
            if (!$(e.target).closest('.template-manager').length) {
                $('#template-main-menu').hide();
                $('#template-main-btn i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }
        });

        // Templates laden
        $('#load-menu-item').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#file-input-hidden').click();
        });

        // Templates löschen
        $('#clear-menu-item').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            clearAllTemplates();
        });

        // Update-Notification Klick
        $('#update-notification').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            const newVersion = $(this).data('version');
            if (confirm(`Update auf Version ${newVersion} verfügbar!\n\nMöchten Sie das Update jetzt installieren?`)) {
                window.open('https://greasyfork.org/de/scripts/548457-grand-rp-template-manager', '_blank');
            }
        });

        // File Input
        $('#file-input-hidden').change(function(e) {
            processFiles(e.target.files);
        });

        // Template Auswahl
        $(document).on('click', '.template-entry', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const templateKey = $(this).data('key');
            insertTemplateContent(templateKey);
            $('#template-main-menu').hide();
            $('#template-main-btn i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        });
    }

    function processFiles(files) {
        templateData = {};
        let processCount = 0;
        const txtFiles = Array.from(files).filter(f => f.name.endsWith('.txt'));
        
        if (txtFiles.length === 0) {
            alert('Keine .txt Dateien gefunden.');
            return;
        }

        txtFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const nameWithoutExt = file.name.substring(0, file.name.length - 4);
                templateData[nameWithoutExt] = event.target.result;
                processCount++;
                
                if (processCount === txtFiles.length) {
                    updateTemplateList();
                    saveToStorage();
                    $('#template-main-menu').hide();
                    $('#template-main-btn i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
            };
            reader.readAsText(file, 'utf-8');
        });
    }

    function updateTemplateList() {
        const container = $('#template-entries');
        container.empty();
        
        const sortedKeys = Object.keys(templateData).sort();
        
        if (sortedKeys.length === 0) {
            container.html('<div style="color: #666; font-size: 12px; text-align: center; padding: 12px 0;">Keine Templates geladen</div>');
            return;
        }

        sortedKeys.forEach(key => {
            const entry = $(`
                <div class="template-entry" data-key="${key}" style="
                    padding: 6px 0;
                    cursor: pointer;
                    color: #333;
                    border-bottom: 1px solid rgba(230, 182, 26, 0.3);
                    margin-bottom: 4px;
                    font-size: 12px;
                    font-weight: 500;
                ">${key}</div>
            `);
            container.append(entry);
        });
    }

    function insertTemplateContent(templateKey) {
        const content = templateData[templateKey];
        if (!content) return;

        const editor = $('.fr-element.fr-view[contenteditable="true"]');
        if (editor.length > 0) {
            $('.fr-placeholder').remove();
            editor.focus();
            
            const htmlContent = content.replace(/\n/g, '<br>');
            editor.html(htmlContent);
            
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(editor[0]);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            
            editor.trigger('input');
            editor.trigger('keyup');
        }
    }

    function calculateDropdownPosition(menu, button) {
        const buttonRect = button[0].getBoundingClientRect();
        const menuHeight = 200; // Geschätzte Menü-Höhe
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();
        
        // Verfügbarer Platz nach unten
        const spaceBelow = windowHeight - (buttonRect.bottom - scrollTop);
        // Verfügbarer Platz nach oben
        const spaceAbove = buttonRect.top - scrollTop;
        
        // Entscheide ob Menü nach oben oder unten angezeigt wird
        if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
            // Nach unten anzeigen
            menu.css({
                top: '100%',
                bottom: 'auto',
                left: '0',
                marginTop: '4px',
                marginBottom: '0'
            });
        } else {
            // Nach oben anzeigen
            menu.css({
                top: 'auto',
                bottom: '100%',
                left: '0',
                marginTop: '0',
                marginBottom: '4px'
            });
        }
    }

    function clearAllTemplates() {
        if (confirm('Alle Templates löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
            templateData = {};
            localStorage.removeItem('grp_template_manager_v2');
            updateTemplateList();
            $('#template-main-menu').hide();
            $('#template-main-btn i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
            console.log('Alle Templates wurden gelöscht');
        }
    }

    function checkForUpdates(manualCheck = false) {
        const currentVersion = '2.7';
        const greasyforkUrl = 'https://greasyfork.org/de/scripts/548457-grand-rp-template-manager';
        
        fetch(greasyforkUrl)
            .then(response => response.text())
            .then(html => {
                // Parse HTML und suche nach Version
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Suche nach Version im HTML (verschiedene mögliche Selektoren)
                let latestVersion = null;
                
                // Möglichkeit 1: Suche nach "Version" Text
                const versionElements = doc.querySelectorAll('*');
                for (let element of versionElements) {
                    const text = element.textContent || '';
                    const versionMatch = text.match(/Version\s+(\d+\.\d+(?:\.\d+)?)/i) || 
                                       text.match(/v(\d+\.\d+(?:\.\d+)?)/i) ||
                                       text.match(/(\d+\.\d+(?:\.\d+)?)/);
                    if (versionMatch) {
                        const version = versionMatch[1];
                        if (compareVersions(version, '1.0') > 0) { // Stelle sicher, dass es eine gültige Version ist
                            latestVersion = version;
                            break;
                        }
                    }
                }
                
                // Möglichkeit 2: Suche nach Meta-Tags oder Script-Header
                if (!latestVersion) {
                    const scriptContent = html.match(/@version\s+(\d+\.\d+(?:\.\d+)?)/);
                    if (scriptContent) {
                        latestVersion = scriptContent[1];
                    }
                }
                
                if (latestVersion && compareVersions(latestVersion, currentVersion) > 0) {
                    showUpdateNotification(latestVersion);
                    if (manualCheck) {
                        if (confirm(`Ein Update ist verfügbar!\n\nAktuelle Version: ${currentVersion}\nNeue Version: ${latestVersion}\n\nMöchten Sie das Update jetzt installieren?`)) {
                            window.open(greasyforkUrl, '_blank');
                        }
                    }
                } else if (manualCheck) {
                    alert(`Sie verwenden bereits die neueste Version!\n\nAktuelle Version: ${currentVersion}\nGreasyfork Version: ${latestVersion || 'Nicht gefunden'}`);
                }
            })
            .catch(error => {
                console.error('Update-Prüfung fehlgeschlagen:', error);
                if (manualCheck) {
                    if (confirm('Update-Prüfung fehlgeschlagen.\n\nMöchten Sie die Greasyfork-Seite manuell öffnen?')) {
                        window.open(greasyforkUrl, '_blank');
                    }
                }
            });
            
        if (manualCheck) {
            $('#template-main-menu').hide();
            $('#template-main-btn i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
    }

    function showUpdateNotification(newVersion) {
        const notification = $('#update-notification');
        notification.data('version', newVersion);
        notification.attr('title', `Update auf v${newVersion} verfügbar`);
        notification.show();
    }

    function compareVersions(version1, version2) {
        const v1parts = version1.split('.').map(Number);
        const v2parts = version2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            const v1part = v1parts[i] || 0;
            const v2part = v2parts[i] || 0;
            
            if (v1part > v2part) return 1;
            if (v1part < v2part) return -1;
        }
        
        return 0;
    }

    function saveToStorage() {
        try {
            localStorage.setItem('grp_template_manager_v2', JSON.stringify(templateData));
        } catch (e) {
            console.error('Speichern fehlgeschlagen:', e);
        }
    }

    function loadSavedTemplates() {
        try {
            const saved = localStorage.getItem('grp_template_manager_v2');
            if (saved) {
                templateData = JSON.parse(saved);
                updateTemplateList();
            }
        } catch (e) {
            console.error('Laden fehlgeschlagen:', e);
        }
    }

    // CSS Styles
    const styles = `
        <style>
            .template-manager {
                display: inline-flex;
                align-items: center;
                position: relative;
            }
            
            #template-main-btn:hover {
                background: #e6b61a !important;
                border-color: #cc9f00 !important;
            }
            
            #template-main-btn:focus {
                outline: none !important;
                box-shadow: 0 0 0 2px rgba(255, 202, 29, 0.3) !important;
            }
            
            #load-menu-item:hover {
                background: rgba(230, 182, 26, 0.3) !important;
            }
            
            .template-entry:hover {
                background: rgba(230, 182, 26, 0.3) !important;
            }
            
            .template-entry:last-child {
                border-bottom: none !important;
                margin-bottom: 0 !important;
            }
            
            .formButtonGroup {
                display: flex !important;
                align-items: center !important;
                flex-wrap: wrap !important;
                gap: 0 !important;
            }
        </style>
    `;
    
    $('head').append(styles);

})();