// ==UserScript==
// @name         Jira - Custom script specific for work usecase
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Changes jira display for custom label styling and caches labels in local storage for swimlane view. Includes a settings panel.
// @author       Roy (aangepast door Gemini)
// @match        https://jira.onderwijstransparant.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551248/Jira%20-%20Custom%20script%20specific%20for%20work%20usecase.user.js
// @updateURL https://update.greasyfork.org/scripts/551248/Jira%20-%20Custom%20script%20specific%20for%20work%20usecase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Voorkom dat het script in iframes draait (zoals de comment editor)
    if (window.top !== window.self) {
        return;
    }

    // --- INSTELLINGEN BEHEER ---

    /**
     * Laadt de instellingen uit localStorage. Geeft standaardwaarden terug als er geen zijn.
     * @returns {Object} Het instellingen-object.
     */
    function loadSettings() {
        const defaults = {
            highlightBugs: true,
            setBillableToNo: true,
            setDefaultComponent: false,
            defaultComponent: 'OT Software',
            setDefaultRegion: false,
            showPriority: false,
            treatSDAsBug: false,
        };
        try {
            const savedSettings = localStorage.getItem('jiraCustomScriptSettings');
            return savedSettings ? { ...defaults, ...JSON.parse(savedSettings) } : defaults;
        } catch (e) {
            console.error('Fout bij het laden van instellingen:', e);
            return defaults;
        }
    }

    /**
     * Slaat het instellingen-object op in localStorage.
     * @param {Object} settings - Het instellingen-object om op te slaan.
     */
    function saveSettings(settings) {
        try {
            localStorage.setItem('jiraCustomScriptSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Fout bij het opslaan van instellingen:', e);
        }
    }


    // --- FUNCTIES VOOR LOKALE OPSLAG (CACHE) ---
    function getLabelCache() {
        try {
            const cachedData = localStorage.getItem('jiraLabelCache');
            return cachedData ? JSON.parse(cachedData) : {};
        } catch (e) { console.error('Fout bij het lezen van de Jira label-cache:', e); return {}; }
    }

    function saveLabelCache(cache) {
        try {
            localStorage.setItem('jiraLabelCache', JSON.stringify(cache));
        } catch (e) { console.error('Fout bij het opslaan van de Jira label-cache:', e); }
    }

    // --- UI INJECTIE (INSTELLINGEN-PANEEL) ---

    /**
     * Creëert en injecteert de UI voor het instellingenpaneel en de knop om het te openen.
     */
    function setupSettingsUI() {
        if (document.getElementById('jira-custom-settings-modal')) return; // Voorkom dubbel injecteren

        const modal = document.createElement('div');
        modal.id = 'jira-custom-settings-modal';
        Object.assign(modal.style, {
            display: 'none', position: 'fixed', zIndex: '1001', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)', backgroundColor: '#f5f5f5', padding: '25px',
            border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            minWidth: '400px'
        });

        const overlay = document.createElement('div');
        overlay.id = 'jira-custom-settings-overlay';
        Object.assign(overlay.style, {
            display: 'none', position: 'fixed', zIndex: '1000', left: '0', top: '0',
            width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'
        });
        overlay.onclick = () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        };

        const currentSettings = loadSettings();
        modal.innerHTML = `
            <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Script Instellingen</h3>
            <div>
                <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 0;">
                    <input type="checkbox" id="setting-highlight-bugs" ${currentSettings.highlightBugs ? 'checked' : ''}>
                    <span style="margin-left: 8px;">Bugs een rode achtergrond geven</span>
                </label>
                 <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 0;">
                    <input type="checkbox" id="setting-treat-sd-as-bug" ${currentSettings.treatSDAsBug ? 'checked' : ''}>
                    <span style="margin-left: 8px;">'SD Ondersteuning' als bug markeren</span>
                </label>
                 <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 0;">
                    <input type="checkbox" id="setting-show-priority" ${currentSettings.showPriority ? 'checked' : ''}>
                    <span style="margin-left: 8px;">Prioriteit-icoon tonen</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 0;">
                    <input type="checkbox" id="setting-set-billable" ${currentSettings.setBillableToNo ? 'checked' : ''}>
                    <span style="margin-left: 8px;">'Facturabel' standaard op "No" zetten (bij aanmaken)</span>
                </label>
                 <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 0;">
                    <input type="checkbox" id="setting-default-region" ${currentSettings.setDefaultRegion ? 'checked' : ''}>
                    <span style="margin-left: 8px;">Standaard regio op "ALG" zetten</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; padding: 8px 0;">
                    <input type="checkbox" id="setting-default-component" ${currentSettings.setDefaultComponent ? 'checked' : ''}>
                    <span style="margin-left: 8px;">Standaard component instellen:</span>
                </label>
                <select id="setting-component-choice" style="margin-left: 30px; padding: 4px;" ${!currentSettings.setDefaultComponent ? 'disabled' : ''}>
                    <option value="OT Software" ${currentSettings.defaultComponent === 'OT Software' ? 'selected' : ''}>OT Software</option>
                    <option value="OT Producten" ${currentSettings.defaultComponent === 'OT Producten' ? 'selected' : ''}>OT Producten</option>
                </select>
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <button id="save-settings-btn" style="padding: 8px 16px; border: none; background-color: #0052cc; color: white; border-radius: 3px; cursor: pointer;">Opslaan en sluiten</button>
            </div>
        `;

        const settingsButton = document.createElement('div');
        settingsButton.innerHTML = '⚙️';
        Object.assign(settingsButton.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '999',
            backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '50%',
            width: '40px', height: '40px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontSize: '24px'
        });
        settingsButton.title = 'Jira Script Instellingen';
        settingsButton.onclick = () => {
            modal.style.display = 'block';
            overlay.style.display = 'block';
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        document.body.appendChild(settingsButton);

        // Event listener om de dropdown te enablen/disablen
        document.getElementById('setting-default-component').addEventListener('change', (e) => {
            document.getElementById('setting-component-choice').disabled = !e.target.checked;
        });


        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const newSettings = {
                highlightBugs: document.getElementById('setting-highlight-bugs').checked,
                setBillableToNo: document.getElementById('setting-set-billable').checked,
                setDefaultComponent: document.getElementById('setting-default-component').checked,
                defaultComponent: document.getElementById('setting-component-choice').value,
                setDefaultRegion: document.getElementById('setting-default-region').checked,
                showPriority: document.getElementById('setting-show-priority').checked,
                treatSDAsBug: document.getElementById('setting-treat-sd-as-bug').checked,
            };
            saveSettings(newSettings);
            modal.style.display = 'none';
            overlay.style.display = 'none';
            alert('Instellingen opgeslagen. De pagina wordt herladen om de wijzigingen toe te passen.');
            location.reload();
        });
    }

    /**
     * Injecteert een <style> tag in de <head> van de pagina met alle custom CSS.
     */
    function injectCustomStyles(settings) {
        const styleId = 'jira-custom-card-styles';
        if (document.getElementById(styleId)) {
            document.getElementById(styleId).remove(); // Verwijder oude stijl om bij te werken
        }

        const style = document.createElement('style');
        style.id = styleId;

        // Bouw de CSS string op. Voeg bug-stijlen conditioneel toe.
        let css = `
            .aui-label.ghx-title-label { background-color: #ffffff; color: #333; border: 1px solid #ccc; }
            .ghx-issue-compact.ghx-divider { height: auto !important; margin: 5px 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; display: flex !important; align-items: center; justify-content: center; padding: 10px 0; position: relative; overflow: visible; cursor: move !important; }
            .ghx-issue-compact.ghx-divider::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background-color: #ccc; z-index: 0; }
            .ghx-issue-compact.ghx-divider .ghx-row > *:not(.ghx-summary) { display: none !important; }
            .ghx-issue-compact.ghx-divider .ghx-summary { display: block !important; text-align: center; font-size: 14px; font-weight: bold; color: #707070; background-color: #f5f5f5; padding: 2px 15px; border-radius: 10px; position: relative; z-index: 1; flex-grow: 0 !important; opacity: 1 !important; }
            .ghx-issue-compact.ghx-divider .ghx-grabber, .ghx-issue-compact.ghx-divider .ghx-end, .ghx-issue-compact.ghx-divider .ghx-plan-extra-fields { display: none !important; }
            .ghx-issue-compact.ghx-divider .ghx-row { display: block !important; text-align: center; }
            .aui-label.ghx-time-critical-label { background-color: #ff5722; color: white; border-color: #e64a19; display: flex; align-items: center; gap: 5px; font-weight: bold; border-radius: 3px; }
            .ghx-cached-labels { margin-top: 5px; padding-left: 28px; display: flex; flex-wrap: wrap; gap: 5px; }

            /* --- NIEUWE STIJLEN VOOR SWIMLANE HEADERS --- */
            .ghx-header-labels {
                display: inline-flex;
                flex-wrap: wrap;
                gap: 4px; /* Kleinere tussenruimte */
                margin-left: 10px; /* Ruimte na de summary-titel */
                vertical-align: middle; /* Lijn uit met de summary tekst */
                max-width: 450px; /* Voorkom dat labels de hele balk overnemen */
            }
            .ghx-header-labels .aui-label {
                font-size: 11px !important; /* Maak labels kleiner om te passen */
                padding: 0 4px !important;
                line-height: 1.5 !important;
                font-weight: normal !important;
            }
            /* --- EINDE NIEUWE STIJLEN --- */

            .ghx-status-indicator { display: flex; flex-direction: column-reverse; gap: 1px; width: 8px; height: 11px; justify-content: center; flex-shrink: 0; margin: 0 2px; vertical-align: middle; }
            .ghx-status-indicator-bar { height: 3px; width: 100%; background-color: #fff; border: 1px solid #ccc; box-sizing: border-box; }
            .ghx-issue-compact.status-inprogress .ghx-status-indicator-bar:nth-child(-n+1) { background-color: #59afe1; border-color: #59afe1; }
            .ghx-issue-compact.status-test .ghx-status-indicator-bar:nth-child(-n+2) { background-color: #f6c342; border-color: #f6c342; }
            .ghx-issue-compact.status-done .ghx-status-indicator-bar, .ghx-issue-compact.status-closed .ghx-status-indicator-bar { background-color: #8eb021; border-color: #8eb021; }
        `;

        if (settings.highlightBugs) {
            css += `
                .ghx-issue-compact.ghx-bug-card,
                .ghx-swimlane .ghx-issue.ghx-bug-card,
                .ghx-issue-compact.ghx-bug-card .ghx-end {
                    background-color: #ffe7e7 !important;
                }
            `;
        }

        style.innerHTML = css;
        document.head.appendChild(style);
    }


    function createSizeIcon(sizeText) {
        const icon = document.createElement('div');
        icon.textContent = sizeText;
        Object.assign(icon.style, { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f5f5f5', border: '1px solid #ccc', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: '0', fontFamily: 'Arial, sans-serif' });
        return icon;
    }

    const labelActions = {
        'divider': { type: 'custom', handler: function(card) { if (card.classList.contains('ghx-divider')) return false; card.classList.add('ghx-divider'); const summary = card.querySelector('.ghx-summary'); if (summary) { summary.style.opacity = '1'; const inner = summary.querySelector('.ghx-inner'); if (inner && inner.dataset.originalTitle) { inner.innerHTML = inner.dataset.originalTitle; } } card.querySelectorAll('.ghx-plan-extra-fields, .ghx-end.ghx-row').forEach(el => el.remove()); return false; } },
        'p048': { type: 'style', styles: { backgroundColor: '#f79232', color: '#fff', borderColor: '#f79232' } },
        'urgent': { type: 'style', styles: { backgroundColor: '#d04437', color: 'white', borderColor: '#d04437' } },
        'on-hold': { type: 'custom', handler: function(card) { if (card.querySelector('.on-hold-label')) return false; const onHoldLabel = document.createElement('span'); onHoldLabel.textContent = `🛑 On Hold`; onHoldLabel.className = 'aui-label on-hold-label'; Object.assign(onHoldLabel.style, { marginLeft: '5px', flexShrink: '0' }); const keyElement = card.querySelector('.ghx-key'); const summaryElement = card.querySelector('.ghx-summary'); if (keyElement) keyElement.insertAdjacentElement('afterend', onHoldLabel); if (summaryElement) summaryElement.style.opacity = '0.6'; return false; } },
        'small': { type: 'custom', handler: function(card, labelText, rightContainer) { if (!card.querySelector('.size-icon-s')) { const icon = createSizeIcon('S'); icon.classList.add('size-icon-s'); rightContainer.appendChild(icon); } return false; } },
        'medium': { type: 'custom', handler: function(card, labelText, rightContainer) { if (!card.querySelector('.size-icon-m')) { const icon = createSizeIcon('M'); icon.classList.add('size-icon-m'); rightContainer.appendChild(icon); } return false; } },
        'large': { type: 'custom', handler: function(card, labelText, rightContainer) { if (!card.querySelector('.size-icon-l')) { const icon = createSizeIcon('L'); icon.classList.add('size-icon-l'); rightContainer.appendChild(icon); } return false; } },
        'onderzoek': { type: 'custom', handler: function(card, labelText, rightContainer) { if (card.querySelector('.research-label')) return false; const researchLabel = document.createElement('span'); researchLabel.className = 'aui-label research-label'; researchLabel.innerHTML = '🔍 Onderzoek'; Object.assign(researchLabel.style, { borderColor: '#3572b0', display: 'flex', alignItems: 'center', gap: '4px' }); rightContainer.appendChild(researchLabel); return false; } },
        'tijdskritisch': { type: 'custom', handler: function(card, labelText, rightContainer) { if (card.querySelector('.ghx-time-critical-label')) return false; const timeCriticalLabel = document.createElement('span'); timeCriticalLabel.className = 'aui-label ghx-time-critical-label'; timeCriticalLabel.innerHTML = '⏰ Tijdskritisch'; rightContainer.appendChild(timeCriticalLabel); return false; } },
    };

    function processSingleCard(card, settings) {
        const labelTooltip = card.querySelector('span[data-tooltip^="Labels:"]');
        if (labelTooltip && labelTooltip.dataset.tooltip.toLowerCase().includes('divider')) {
            labelActions['divider'].handler(card);
            card.classList.add('ghx-layout-processed');
            return;
        }

        if (!settings.showPriority) {
            card.querySelector('.ghx-flags')?.remove();
        }

        const typeSpan = card.querySelector('.ghx-type');
        if (settings.highlightBugs) {
            const isBug = typeSpan && typeSpan.title.toLowerCase() === 'bug';
            const isSDAsBug = settings.treatSDAsBug && typeSpan && typeSpan.title.toLowerCase() === 'sd ondersteuning';
            if (isBug || isSDAsBug) {
                card.classList.add('ghx-bug-card');
            } else {
                card.classList.remove('ghx-bug-card');
            }
        } else {
             card.classList.remove('ghx-bug-card');
        }


        const summaryElementReset = card.querySelector('.ghx-summary');
        if (summaryElementReset) { summaryElementReset.style.opacity = '1'; const innerSpan = summaryElementReset.querySelector('.ghx-inner'); if (innerSpan && innerSpan.dataset.originalTitle) { innerSpan.innerHTML = innerSpan.dataset.originalTitle; } }
        const issueContent = card.querySelector('.ghx-issue-content');
        if (!issueContent) return;
        const mainRow = issueContent.querySelector('.ghx-row');
        if (!mainRow) return;
        mainRow.querySelectorAll('.on-hold-label, .ghx-deadline-label, .ghx-status-indicator').forEach(el => el.remove());
        Object.assign(mainRow.style, { display: 'flex', alignItems: 'center', gap: '5px' });
        const masterRightContainer = document.createElement('span');
        masterRightContainer.className = 'ghx-end';
        Object.assign(masterRightContainer.style, { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: '0' });
        const labelsSubContainer = document.createElement('span');
        Object.assign(labelsSubContainer.style, { display: 'flex', alignItems: 'center', gap: '5px' });
        const sizeIconsSubContainer = document.createElement('span');
        Object.assign(sizeIconsSubContainer.style, { display: 'flex', alignItems: 'center', gap: '5px' });
        const titleCategorySubContainer = document.createElement('span');
        Object.assign(titleCategorySubContainer.style, { display: 'flex', alignItems: 'center', gap: '5px' });
        const otherFieldsSubContainer = document.createElement('span');
        Object.assign(otherFieldsSubContainer.style, { display: 'flex', alignItems: 'center', gap: '5px' });
        const elementsToProcess = [];
        const containersToRemove = [];
        card.querySelectorAll('.ghx-plan-extra-fields, .ghx-issue-content > .ghx-end.ghx-row').forEach(container => { elementsToProcess.push(...container.children); containersToRemove.push(container); });
        const statusField = elementsToProcess.find(field => field.matches('span[data-tooltip^="Status:"]'));
        if (statusField) { const statusText = (statusField.dataset.tooltip || '').replace('Status:', '').trim().toLowerCase(); const statusClasses = ['status-open', 'status-reopened', 'status-inprogress', 'status-test', 'status-closed', 'status-done']; card.classList.remove(...statusClasses); const statusMap = { 'open': { class: 'status-open', name: 'Open' }, 'reopened': { class: 'status-reopened', name: 'Reopened' }, 'in progress': { class: 'status-inprogress', name: 'In Progress' }, 'test': { class: 'status-test', name: 'Test' }, 'closed': { class: 'status-closed', name: 'Closed' }, 'done': { class: 'status-done', name: 'Done' } }; if (statusMap[statusText]) { card.classList.add(statusMap[statusText].class); const progressIndicator = document.createElement('div'); progressIndicator.className = 'ghx-status-indicator'; progressIndicator.title = `Status: ${statusMap[statusText].name}`; for (let i = 0; i < 3; i++) { const bar = document.createElement('div'); bar.className = 'ghx-status-indicator-bar'; progressIndicator.appendChild(bar); } if(typeSpan) typeSpan.insertAdjacentElement('afterend', progressIndicator); } }
        elementsToProcess.forEach(field => { if (field.matches('span[data-tooltip^="Status:"]') || field.classList.contains('ghx-extra-field-seperator')) return; if (field.matches('span[data-tooltip^="Labels:"]')) { const labelContentEl = field.querySelector('.ghx-extra-field-content'); const labels = (labelContentEl && labelContentEl.textContent.trim() !== 'None') ? labelContentEl.textContent.trim().split(/,\s*/).filter(Boolean) : []; const ticketKeyElement = card.querySelector('.ghx-key a'); if (ticketKeyElement) { const ticketKey = ticketKeyElement.textContent.trim(); const cache = getLabelCache(); if (JSON.stringify(cache[ticketKey]) !== JSON.stringify(labels)) { cache[ticketKey] = labels; saveLabelCache(cache); } }
            labels.forEach(label => {
                const labelLower = label.toLowerCase();

                // Handel 'deadline:' labels af met prefix-logica
                if (labelLower.startsWith('deadline:')) {
                    if (card.querySelector('.ghx-deadline-label')) return; // Voorkom duplicaten

                    const deadlineText = label.substring('deadline:'.length).trim();
                    const deadlineLabel = document.createElement('span');
                    deadlineLabel.className = 'aui-label ghx-deadline-label'; // Specifieke class voor herkenning en opschonen
                    deadlineLabel.innerHTML = `📅 Deadline ${deadlineText}`; // Icoon + tekst
                    Object.assign(deadlineLabel.style, {
                        backgroundColor: '#DEEBFF', // Atlassian Light Blue
                        borderColor: '#B3D4FF',
                        color: '#0747A6',
                        marginLeft: '5px',
                        flexShrink: '0'
                    });

                    const keyElement = card.querySelector('.ghx-key');
                    if (keyElement) {
                        keyElement.insertAdjacentElement('afterend', deadlineLabel);
                    }
                    return; // Label is afgehandeld, sla standaardverwerking over
                }

                const action = labelActions[labelLower];
                let addToRightAsDefault = true;
                if (action?.type === 'custom') {
                    let targetContainer = labelsSubContainer;
                    if (['small', 'medium', 'large'].includes(labelLower)) {
                        targetContainer = sizeIconsSubContainer;
                    }
                    if (action.handler(card, label, targetContainer) === false) {
                        addToRightAsDefault = false;
                    }
                }
                if (addToRightAsDefault) {
                    const lozenge = document.createElement('span');
                    lozenge.className = 'aui-label';
                    lozenge.textContent = label;
                    if (action?.type === 'style') Object.assign(lozenge.style, action.styles);
                    labelsSubContainer.appendChild(lozenge);
                }
            });
        } else { otherFieldsSubContainer.appendChild(field.cloneNode(true)); } });
        containersToRemove.forEach(container => container.remove());
        mainRow.querySelector('.ghx-end')?.remove();
        if (labelsSubContainer.hasChildNodes()) masterRightContainer.appendChild(labelsSubContainer);
        if (sizeIconsSubContainer.hasChildNodes()) masterRightContainer.appendChild(sizeIconsSubContainer);
        if (titleCategorySubContainer.hasChildNodes()) masterRightContainer.appendChild(titleCategorySubContainer);
        if (otherFieldsSubContainer.hasChildNodes()) masterRightContainer.appendChild(otherFieldsSubContainer);
        if (masterRightContainer.hasChildNodes()) { mainRow.appendChild(masterRightContainer); }
        card.classList.add('ghx-layout-processed');
    }

    function processSwimlaneCards(settings) {
        const labelCache = getLabelCache();
        const swimlaneCards = document.querySelectorAll('.ghx-swimlane .ghx-issue:not(.ghx-swimlane-processed)');

        swimlaneCards.forEach(card => {
            const issueKey = card.dataset.issueKey;
            if (!issueKey) return;

            const typeSpan = card.querySelector('.ghx-type');
            if (settings.highlightBugs) {
                const isBug = typeSpan && typeSpan.title.toLowerCase() === 'bug';
                const isSDAsBug = settings.treatSDAsBug && typeSpan && typeSpan.title.toLowerCase() === 'sd ondersteuning';
                if (isBug || isSDAsBug) {
                    card.classList.add('ghx-bug-card');
                } else {
                    card.classList.remove('ghx-bug-card');
                }
            } else {
                card.classList.remove('ghx-bug-card');
            }


            const cachedLabels = labelCache[issueKey];
            if (cachedLabels && Array.isArray(cachedLabels) && cachedLabels.length > 0) {
                let labelContainer = card.querySelector('.ghx-cached-labels');
                if (!labelContainer) {
                    labelContainer = document.createElement('div');
                    labelContainer.className = 'ghx-cached-labels';
                    card.querySelector('.ghx-issue-fields')?.appendChild(labelContainer);
                }
                labelContainer.innerHTML = '';
                card.style.opacity = '1';
                cachedLabels.forEach(label => {
                    const labelLower = label.toLowerCase();
                    if (labelLower === 'divider') return;

                    // Handel 'deadline:' labels af in swimlane
                    if (labelLower.startsWith('deadline:')) {
                        const deadlineText = label.substring('deadline:'.length).trim();
                        const lozenge = document.createElement('span');
                        lozenge.className = 'aui-label';
                        lozenge.innerHTML = `📅 Deadline ${deadlineText}`;
                        Object.assign(lozenge.style, {
                            backgroundColor: '#DEEBFF',
                            borderColor: '#B3D4FF',
                            color: '#0747A6'
                        });
                        labelContainer.appendChild(lozenge);
                        return; // Ga naar het volgende label
                    }

                    const action = labelActions[labelLower];
                    const lozenge = document.createElement('span');
                    lozenge.className = 'aui-label';
                    lozenge.textContent = label;
                    if (action?.type === 'style') { Object.assign(lozenge.style, action.styles); }
                    if (labelLower === 'tijdskritisch') { lozenge.className = 'aui-label ghx-time-critical-label'; lozenge.innerHTML = '⏰ Tijdskritisch'; }
                    else if (labelLower === 'onderzoek') { lozenge.innerHTML = '🔍 Onderzoek'; }
                    else if (labelLower === 'on-hold') { lozenge.textContent = '🛑 On Hold'; card.style.opacity = '0.7'; }
                    labelContainer.appendChild(lozenge);
                });
            }
            card.classList.add('ghx-swimlane-processed');
        });
    }

    /**
     * --- NIEUWE FUNCTIE ---
     * Voegt labels toe aan de swimlane headers (de 'ouder-balken')
     * Leest labels uit de cache die door processSingleCard() is gevuld.
     */
    function processSwimlaneHeaders(settings) {
        const labelCache = getLabelCache();
        // Zoek naar headers die we nog niet verwerkt hebben
        const headers = document.querySelectorAll('.ghx-swimlane-header:not(.ghx-labels-processed)');

        headers.forEach(header => {
            const issueKey = header.dataset.issueKey;
            if (!issueKey) {
                header.classList.add('ghx-labels-processed'); // Markeer als verwerkt om herhaling te voorkomen
                return;
            }

            const cachedLabels = labelCache[issueKey];
            if (!cachedLabels || !Array.isArray(cachedLabels) || cachedLabels.length === 0) {
                header.classList.add('ghx-labels-processed'); // Markeer als verwerkt, ook als er geen labels zijn
                return;
            }

            // Zoek het .ghx-summary element, daar injecteren we de labels na
            const summaryElement = header.querySelector('.ghx-summary');
            if (!summaryElement) return; // Geen plek om te injecteren

            // Maak de container voor de labels aan (of zoek 'm op als 'ie al bestaat)
            let labelContainer = header.querySelector('.ghx-header-labels');
            if (!labelContainer) {
                labelContainer = document.createElement('span');
                labelContainer.className = 'ghx-header-labels';
                // Voeg de label container IN de heading, NA de summary
                summaryElement.insertAdjacentElement('afterend', labelContainer);
            }
            labelContainer.innerHTML = ''; // Altijd opschonen voor het geval van re-render

            cachedLabels.forEach(label => {
                const labelLower = label.toLowerCase();
                // Sla labels over die we niet als tekst willen tonen in de header (zoals 'divider' of maten)
                if (labelLower === 'divider' || ['small', 'medium', 'large'].includes(labelLower)) {
                    return;
                }

                const action = labelActions[labelLower];
                const lozenge = document.createElement('span');
                lozenge.className = 'aui-label';
                lozenge.textContent = label;

                // Pas custom styling toe indien gedefinieerd in labelActions
                if (action?.type === 'style') {
                    Object.assign(lozenge.style, action.styles);
                }

                // Speciale gevallen voor iconen/tekst (logic gekopieerd van processSwimlaneCards)
                if (labelLower === 'tijdskritisch') {
                    lozenge.className = 'aui-label ghx-time-critical-label';
                    lozenge.innerHTML = '⏰ Tijdskritisch';
                } else if (labelLower === 'onderzoek') {
                    lozenge.innerHTML = '🔍 Onderzoek';
                } else if (labelLower === 'on-hold') {
                    lozenge.textContent = '🛑 On Hold';
                    // We faden niet de hele swimlane, alleen het label is genoeg
                } else if (labelLower.startsWith('deadline:')) {
                    const deadlineText = label.substring('deadline:'.length).trim();
                    lozenge.innerHTML = `📅 ${deadlineText}`; // Kortere versie voor de header
                    Object.assign(lozenge.style, {
                        backgroundColor: '#DEEBFF',
                        borderColor: '#B3D4FF',
                        color: '#0747A6'
                    });
                }

                labelContainer.appendChild(lozenge);
            });

            // Markeer de header als verwerkt
            header.classList.add('ghx-labels-processed');
        });
    }


    /**
     * Past het 'Create/Edit Issue' scherm aan op basis van instellingen.
     * @param {Object} settings - Het huidige instellingen-object.
     */
    function enhanceCreateEditScreen(settings) {
        // 1. Facturabel
        if (settings.setBillableToNo) {
            const billableSelect = document.getElementById('customfield_10207');
            if (billableSelect && !billableSelect.dataset.scriptProcessed) {
                const label = document.querySelector('label[for="customfield_10207"]');
                const isRequired = label && label.querySelector('.icon-required');
                if (isRequired && billableSelect.value === '') {
                    const noOption = Array.from(billableSelect.options).find(opt => opt.text.trim() === 'No');
                    if (noOption) {
                        billableSelect.value = noOption.value;
                        billableSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                billableSelect.dataset.scriptProcessed = 'true';
            }
        }

        // 2. Component
        if (settings.setDefaultComponent) {
            const componentsContainer = document.getElementById('components-multi-select');
            if (componentsContainer && !componentsContainer.dataset.scriptProcessed) {
                const hasExistingComponent = componentsContainer.querySelector('.items li');
                if (!hasExistingComponent) {
                    const textarea = document.getElementById('components-textarea');
                    if (textarea) {
                        textarea.focus();
                        textarea.value = settings.defaultComponent;
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        textarea.dispatchEvent(new Event('keyup', { bubbles: true }));

                        setTimeout(() => {
                            const suggestionsContainer = document.getElementById('components-suggestions');
                            if(suggestionsContainer) {
                                const suggestionLink = Array.from(suggestionsContainer.querySelectorAll('li a')).find(a => a.title.trim() === settings.defaultComponent);
                                if(suggestionLink) {
                                    suggestionLink.click();
                                } else {
                                     textarea.blur();
                                }
                            }
                        }, 250);
                    }
                }
                componentsContainer.dataset.scriptProcessed = 'true';
            }
        }

        // 3. Region
        if (settings.setDefaultRegion) {
            const regionSelect = document.getElementById('customfield_10210');
            if (regionSelect && !regionSelect.dataset.scriptProcessed) {
                 const isRequired = document.querySelector('label[for="customfield_10210"] .icon-required');
                 if (isRequired && regionSelect.value === '') {
                     const algOption = Array.from(regionSelect.options).find(opt => opt.text.trim() === 'ALG');
                     if (algOption) {
                         regionSelect.value = algOption.value;
                         regionSelect.dispatchEvent(new Event('change', { bubbles: true }));
                     }
                 }
                 regionSelect.dataset.scriptProcessed = 'true';
            }
        }
    }

    /**
     * Zoekt naar onverwerkte elementen en voert de juiste processoren uit.
     */
    function runAllProcessors(settings) {
        // Verwerk kaarten op het bord en in swimlanes
        const compactCards = document.querySelectorAll('.ghx-issue-compact:not(.ghx-layout-processed)');
        if (compactCards.length > 0) {
            compactCards.forEach(card => processSingleCard(card, settings));
        }
        processSwimlaneCards(settings);
        processSwimlaneHeaders(settings); // <-- HIER IS DE NIEUWE FUNCTIE AANGEROEPEN

        // Verwerk velden op het create/edit scherm
        enhanceCreateEditScreen(settings);
    }

    // --- Script Initialisatie ---
    const currentSettings = loadSettings();
    injectCustomStyles(currentSettings);
    setupSettingsUI();

    const observer = new MutationObserver(() => {
        clearTimeout(observer.timeout);
        // Laad de instellingen opnieuw voor het geval ze in een ander tabblad zijn gewijzigd.
        observer.timeout = setTimeout(() => runAllProcessors(loadSettings()), 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => runAllProcessors(currentSettings), 500);

})();
