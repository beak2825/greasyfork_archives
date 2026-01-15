// ==UserScript==
// @name         Jira - Custom script specific for work usecase
// @namespace    http://tampermonkey.net/
// @version      8.3.0
// @description  Changes jira display for custom label styling and caches labels in local storage for swimlane view. Includes a settings panel.
// @author       Roy
// @match        https://jira.onderwijstransparant.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551248/Jira%20-%20Custom%20script%20specific%20for%20work%20usecase.user.js
// @updateURL https://update.greasyfork.org/scripts/551248/Jira%20-%20Custom%20script%20specific%20for%20work%20usecase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = '8.3.0';
    const PATCH_NOTES = [
        {
            version: '8.3.0',
            title: 'Labels verversen nu vanzelf',
            date: '2026-01-14',
            changes: [
                'Labels in swimlanes updaten zichzelf elk uur – je hoeft niet langer eerst de backlog te openen.',
                'Het script onthoudt wanneer je een ticket voor het laatst zag en ruimt oude cache-items automatisch op.'
            ]
        },
        {
            version: '8.2.1',
            title: 'Visuele uitleg en nieuwe labels',
            date: '2026-01-09',
            changes: [
                'Nieuw label "hotfix": Tickets krijgen een 🔥 lozenge en vallen op in backlog en swimlane.',
                'Nieuw label "geen-punten": story point bolletje wordt vervangen door een ✕ om aan te geven dat er bewust geen inschatting is.',
                'Nieuw label "onduidelijk-punten": story point bolletje toont een ? wanneer de scope nog onbekend is.',
                'Instellingenscherm opgesplitst met visuele uitleg en directe patchnotes-link.',
                'Bugtickets zonder punten tonen automatisch een ✕, met een instelling om dit gedrag te beheren.'
            ]
        }
    ];

    const ONE_HOUR = 60 * 60 * 1000;
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
    const pendingRequests = new Set();

    // Voorkom dat het script in iframes draait (zoals de comment editor)
    if (window.top !== window.self) {
        return;
    }

    function setupUpdateModal() {
        const versionKey = `jiraUpdateSeen-${SCRIPT_VERSION}`;
        if (document.getElementById('jira-update-modal')) {
            return {
                open: () => {
                    document.getElementById('jira-update-overlay').style.display = 'block';
                    document.getElementById('jira-update-modal').style.display = 'block';
                },
                shouldShowOnLoad: localStorage.getItem(versionKey) !== 'true'
            };
        }

        const overlay = document.createElement('div');
        overlay.id = 'jira-update-overlay';
        const modal = document.createElement('div');
        modal.id = 'jira-update-modal';

        const notesMarkup = PATCH_NOTES.map((note, index) => {
            const listItems = note.changes.map(change => `<li>${change}</li>`).join('');
            return `
                <section class="jira-update-note ${index === 0 ? 'is-latest' : ''}">
                    <h4>${note.version} - ${note.title}</h4>
                    <small style="color:#5f6b7c;">${note.date}</small>
                    <ul>${listItems}</ul>
                </section>
            `;
        }).join('');

        modal.innerHTML = `
            <div class="jira-update-header">
                <h3>Wat is er nieuw (${PATCH_NOTES[0].version})</h3>
                <button type="button" id="jira-update-close-btn" aria-label="Sluiten">×</button>
            </div>
            <div class="jira-update-content">
                ${notesMarkup}
            </div>
            <div class="jira-update-actions">
                <button type="button" id="jira-update-done-btn">Gelezen</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        const hideModal = (markSeen = false) => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
            if (markSeen) {
                try {
                    localStorage.setItem(versionKey, 'true');
                } catch (e) {
                    console.warn('Patchnotes voorkeur kon niet opgeslagen worden:', e);
                }
            }
        };

        modal.querySelector('#jira-update-close-btn').addEventListener('click', () => hideModal(false));
        modal.querySelector('#jira-update-done-btn').addEventListener('click', () => hideModal(true));
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                hideModal(false);
            }
        });

        const openModal = () => {
            overlay.style.display = 'block';
            modal.style.display = 'block';
        };

        return {
            open: openModal,
            shouldShowOnLoad: localStorage.getItem(versionKey) !== 'true'
        };
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
            markBugWithoutPoints: true,
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
            const cache = cachedData ? JSON.parse(cachedData) : {};
            const now = Date.now();
            let changed = false;
            for (const key in cache) {
                const entry = cache[key];
                const malformed = !entry || !Array.isArray(entry.labels) || typeof entry.lastFetched !== 'number' || typeof entry.lastSeen !== 'number';
                const expired = !malformed && (now - entry.lastSeen > ONE_MONTH);
                if (malformed || expired) {
                    delete cache[key];
                    changed = true;
                }
            }
            if (changed) saveLabelCache(cache);
            return cache;
        } catch (e) { console.error('Fout bij het lezen van de Jira label-cache:', e); return {}; }
    }

    function saveLabelCache(cache) {
        try {
            localStorage.setItem('jiraLabelCache', JSON.stringify(cache));
        } catch (e) { console.error('Fout bij het opslaan van de Jira label-cache:', e); }
    }

    async function fetchLabelsViaAPI(issueKey) {
        if (!issueKey || pendingRequests.has(issueKey)) return;
        pendingRequests.add(issueKey);

        try {
            const response = await fetch(`/rest/api/2/issue/${issueKey}?fields=labels`);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            const labels = data?.fields?.labels || [];
            const cache = getLabelCache();
            cache[issueKey] = {
                labels,
                lastFetched: Date.now(),
                lastSeen: Date.now()
            };
            saveLabelCache(cache);
            const card = document.querySelector(`.ghx-issue[data-issue-key="${issueKey}"]`);
            if (card) {
                card.classList.remove('ghx-swimlane-processed');
            }
        } catch (e) {
            console.warn(`Fetch faalde voor ${issueKey}:`, e);
        } finally {
            setTimeout(() => pendingRequests.delete(issueKey), 2000);
        }
    }

    function getStoryPointBadge(card) {
        return card.querySelector('.ghx-statistic-badge[title="Story Points"], .ghx-end [title="Story Points"]');
    }

    function applyStoryPointMarker(card, marker) {
        const badge = getStoryPointBadge(card);
        if (!badge) return;
        const alreadyOverridden = badge.classList.contains('ghx-storypoint-override');

        if (marker) {
            if (!alreadyOverridden) {
                badge.dataset.storyPointOriginal = badge.textContent.trim();
            }
            badge.textContent = marker;
            badge.classList.add('ghx-storypoint-override');
        } else if (alreadyOverridden) {
            const originalValue = badge.dataset.storyPointOriginal ?? '';
            badge.textContent = originalValue;
            delete badge.dataset.storyPointOriginal;
            badge.classList.remove('ghx-storypoint-override');
        }
    }

    function isStoryPointFieldEmpty(badge) {
        if (!badge) return true;
        const baseValue = (badge.classList.contains('ghx-storypoint-override') && badge.dataset.storyPointOriginal !== undefined)
            ? badge.dataset.storyPointOriginal
            : badge.textContent;
        const normalized = (baseValue || '').replace(/[\s\u00A0\u2007\u200B\uFEFF]/g, '').replace(/[\u2013\u2014-]/g, '');
        return normalized.length === 0;
    }

    function shouldAutoMarkBugWithoutPoints(card, typeSpan, settings) {
        if (!settings.markBugWithoutPoints || !typeSpan) return false;
        const issueType = (typeSpan.title || '').toLowerCase();
        if (issueType !== 'bug') return false;
        const badge = getStoryPointBadge(card);
        if (!badge) return false;
        return isStoryPointFieldEmpty(badge);
    }

    // --- UI INJECTIE (INSTELLINGEN-PANEEL) ---

    /**
     * Creëert en injecteert de UI voor het instellingenpaneel en de knop om het te openen.
     */
    function setupSettingsUI(openUpdateNotes) {
        if (document.getElementById('jira-custom-settings-modal')) return; // Voorkom dubbel injecteren

        const modal = document.createElement('div');
        modal.id = 'jira-custom-settings-modal';
        Object.assign(modal.style, {
            display: 'none', position: 'fixed', zIndex: '1001', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)', backgroundColor: '#f5f5f5', padding: '25px',
            border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            minWidth: '400px', maxWidth: '720px', maxHeight: '85vh', overflowY: 'auto'
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
            <div class="jira-settings-section">
                <h3>Script Instellingen</h3>
                <p style="margin: 0 0 10px 0; color: #5f6b7c; font-size: 13px;">Personaliseer hoe labels, waarschuwingen en standaardvelden werken.</p>
                <div class="jira-settings-grid">
                    <label>
                        <input type="checkbox" id="setting-highlight-bugs" ${currentSettings.highlightBugs ? 'checked' : ''}>
                        <span>Bugs een rode achtergrond geven</span>
                    </label>
                    <label>
                        <input type="checkbox" id="setting-treat-sd-as-bug" ${currentSettings.treatSDAsBug ? 'checked' : ''}>
                        <span>'SD Ondersteuning' als bug markeren</span>
                    </label>
                    <label>
                        <input type="checkbox" id="setting-bug-empty-points" ${currentSettings.markBugWithoutPoints ? 'checked' : ''}>
                        <span>Bugs zonder punten tonen als ✕</span>
                    </label>
                    <label>
                        <input type="checkbox" id="setting-show-priority" ${currentSettings.showPriority ? 'checked' : ''}>
                        <span>Prioriteit-icoon tonen</span>
                    </label>
                    <label>
                        <input type="checkbox" id="setting-set-billable" ${currentSettings.setBillableToNo ? 'checked' : ''}>
                        <span>'Facturabel' standaard op "No" zetten (bij aanmaken)</span>
                    </label>
                    <label>
                        <input type="checkbox" id="setting-default-region" ${currentSettings.setDefaultRegion ? 'checked' : ''}>
                        <span>Standaard regio op "ALG" zetten</span>
                    </label>
                    <label>
                        <input type="checkbox" id="setting-default-component" ${currentSettings.setDefaultComponent ? 'checked' : ''}>
                        <span>Standaard component instellen</span>
                    </label>
                    <select id="setting-component-choice" style="margin-left: 24px; padding: 4px;" ${!currentSettings.setDefaultComponent ? 'disabled' : ''}>
                        <option value="OT Software" ${currentSettings.defaultComponent === 'OT Software' ? 'selected' : ''}>OT Software</option>
                        <option value="OT Producten" ${currentSettings.defaultComponent === 'OT Producten' ? 'selected' : ''}>OT Producten</option>
                    </select>
                </div>
                <div class="jira-settings-explain">
                    <h4 style="margin: 0 0 6px 0;">Wat doet elke instelling?</h4>
                    <ul style="list-style: none; padding-left: 0; margin: 0;">
                        <li><strong>Bugs highlight</strong> Geeft alle bugs (en optioneel SD) een zachte rode achtergrond in board en swimlane.</li>
                        <li><strong>'SD Ondersteuning' als bug</strong> Laat SD tickets dezelfde styling erven als echte bugs.</li>
                        <li><strong>Bugtickets zonder punten</strong> Laat bug-issues zonder story points toch een ✕ tonen zodat refinement zichtbaarder blijft.</li>
                        <li><strong>Prioriteit tonen</strong> Houd het Jira-prioriteitsicoon zichtbaar.</li>
                        <li><strong>Facturabel naar "No"</strong> Zet het veld tijdens issue creatie automatisch naar "No" zodat je het niet vergeet.</li>
                        <li><strong>Regio standaard ALG</strong> Vult het regioveld bij verplichte issues alvast voor je in.</li>
                        <li><strong>Component auto-select</strong> Activeer en kies hieronder welk component er automatisch gekozen wordt.</li>
                    </ul>
                </div>
                <div class="jira-settings-actions">
                    <button id="save-settings-btn" style="background-color: #0052cc; color: white;">Opslaan en sluiten</button>
                    <button type="button" id="view-update-notes-link">Bekijk patchnotes (${PATCH_NOTES[0].version})</button>
                </div>
            </div>
            <div class="jira-feature-guide">
                <h4>Label gids</h4>
                <p style="margin: 0 0 12px 0; color: #54617a; font-size: 13px;">Voer onderstaande labelnamen exact in op tickets. Het script past de vormgeving automatisch aan.</p>
                 <p style="margin: 0 0 12px 0; color: #54617a; font-size: 13px;"><b>Let op: </b> Het is helaas niet mogelijk om vanuit de swimlanes de labels in te laden. Je moet de backlog openen voordat labels in de swimlane aangepast worden.</p>
               
                <div class="jira-label-guide">
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">divider</span>
                            <div class="jira-divider-preview">Visuele scheiding op het board</div>
                        </div>
                        <div>
                            <div class="jira-label-title">Divider kaart</div>
                            <p style="margin: 0;">Gebruik dit label om een dragbare scheidingskaart te maken die uitsluitend een titel toont. Handig om swimlanes logisch te verdelen.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">deadline:01-01-2026</span>
                            <span class="aui-label" style="background-color:#deebff;border-color:#b3d4ff;color:#0747a6;">📅 Deadline 01-01-2026</span>
                        </div>
                        <div>
                            <div class="jira-label-title">Deadline lozenge</div>
                            <p style="margin: 0;">Elke labelwaarde die begint met <strong>deadline:</strong> krijgt automatisch een blauwe 📅 lozenge bij de kaarttitel en in swimlanes.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">urgent</span>
                            <span class="aui-label" style="background-color:#d04437;color:#fff;border-color:#d04437;">urgent</span>
                        </div>
                        <div>
                            <div class="jira-label-title">Urgente tickets</div>
                            <p style="margin: 0;">De <strong>urgent</strong> tag kleurt fel rood om direct te tonen dat het ticket voorrang moet krijgen.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">on-hold</span>
                            <span class="aui-label" style="background:#fff;border:1px solid #dfe1e6;">🛑 On Hold</span>
                        </div>
                        <div>
                            <div class="jira-label-title">On Hold indicator</div>
                            <p style="margin: 0;">Voeg <strong>on-hold</strong> toe als het ticket tijdelijk stil ligt. De kaart krijgt een duidelijke 🛑 badge en wordt iets uitgegrijsd.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">small</span>
                            <span class="jira-label-code">medium</span>
                            <span class="jira-label-code">large</span>
                            <div class="jira-size-preview">
                                <span class="jira-size-icon">S</span>
                                <span class="jira-size-icon">M</span>
                                <span class="jira-size-icon">L</span>
                            </div>
                        </div>
                        <div>
                            <div class="jira-label-title">Grootte badges</div>
                            <p style="margin: 0;">De labels <strong>small</strong>, <strong>medium</strong> en <strong>large</strong> tonen een compact S/M/L bolletje aan de rechterkant van de kaart.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">onderzoek</span>
                            <span class="aui-label" style="border:1px solid #3572b0;color:#0a3d80; display:flex; align-items:center; gap:4px;">🔍 Onderzoek</span>
                        </div>
                        <div>
                            <div class="jira-label-title">Onderzoek</div>
                            <p style="margin: 0;">Gebruik <strong>onderzoek</strong> wanneer een kaart puur verkennend is. Het label krijgt een blauw randje en vergrootglas.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">tijdskritisch</span>
                            <span class="aui-label ghx-time-critical-label">⏰ Tijdskritisch</span>
                        </div>
                        <div>
                            <div class="jira-label-title">Tijdskritisch</div>
                            <p style="margin: 0;">Met <strong>tijdskritisch</strong> verschijnt een feloranje lozenge zodat iedereen direct ziet dat er haast bij is.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">hotfix</span>
                            <span class="aui-label ghx-hotfix-label">🔥 Hotfix</span>
                        </div>
                        <div>
                            <div class="jira-label-title">Hotfix</div>
                            <p style="margin: 0;">Het label <strong>hotfix</strong> toont een vuur-icoon naast de sleutel en in swimlanes zodat het onmiddellijk herkenbaar is.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">geen-punten</span>
                            <span class="jira-story-badge">✕</span>
                        </div>
                        <div>
                            <div class="jira-label-title">Geen storypoints</div>
                            <p style="margin: 0;">Laat het label <strong>geen-punten</strong> achter als je bewust geen inschatting wilt geven. Het story point bolletje toont een ✕.</p>
                        </div>
                    </div>
                    <div class="jira-label-row">
                        <div class="jira-label-preview">
                            <span class="jira-label-code">onduidelijk-punten</span>
                            <span class="jira-story-badge">?</span>
                        </div>
                        <div>
                            <div class="jira-label-title">Scope onduidelijk</div>
                            <p style="margin: 0;">Gebruik <strong>onduidelijk-punten</strong> wanneer de scope nog niet helder is. Het story point bolletje toont dan een vraagteken.</p>
                        </div>
                    </div>
                </div>
                <p class="jira-label-note">Labels zijn hoofdletterongevoelig. De weergave past zich automatisch aan in backlog, swimlanes en parent headers.</p>
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


        const updateLink = document.getElementById('view-update-notes-link');
        if (updateLink && typeof openUpdateNotes === 'function') {
            updateLink.addEventListener('click', () => {
                modal.style.display = 'none';
                overlay.style.display = 'none';
                openUpdateNotes();
            });
        }

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const newSettings = {
                highlightBugs: document.getElementById('setting-highlight-bugs').checked,
                setBillableToNo: document.getElementById('setting-set-billable').checked,
                setDefaultComponent: document.getElementById('setting-default-component').checked,
                defaultComponent: document.getElementById('setting-component-choice').value,
                setDefaultRegion: document.getElementById('setting-default-region').checked,
                showPriority: document.getElementById('setting-show-priority').checked,
                treatSDAsBug: document.getElementById('setting-treat-sd-as-bug').checked,
                markBugWithoutPoints: document.getElementById('setting-bug-empty-points').checked,
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
            /* Hotfix label styling */
            .aui-label.ghx-hotfix-label { background-color: #ff4500; color: white; border-color: #cc3700; display: flex; align-items: center; gap: 5px; font-weight: bold; border-radius: 3px; box-shadow: 0 0 5px rgba(255, 69, 0, 0.4); }

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
            .ghx-storypoint-override {
                font-weight: bold;
                font-size: 14px;
            }

            #jira-custom-settings-modal {
                max-width: 720px;
                max-height: 85vh;
                overflow-y: auto;
                color: #172b4d;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            #jira-custom-settings-modal h3,
            #jira-custom-settings-modal h4 {
                margin-top: 0;
            }
            .jira-settings-section {
                background: #fff;
                border: 1px solid #dde0e6;
                border-radius: 6px;
                padding: 16px 20px;
                margin-bottom: 16px;
            }
            .jira-settings-grid label {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 0;
                cursor: pointer;
            }
            .jira-settings-explain {
                margin-top: 12px;
                border-top: 1px solid #edf0f6;
                padding-top: 12px;
                font-size: 13px;
                color: #4a5c78;
            }
            .jira-settings-explain li {
                margin-bottom: 4px;
            }
            .jira-settings-explain strong {
                display: inline-block;
                min-width: 170px;
            }
            .jira-settings-actions {
                display: flex;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
                margin-top: 16px;
            }
            .jira-settings-actions button {
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
            }
            .jira-feature-guide {
                background: linear-gradient(135deg, #f4f7ff 0%, #ffffff 100%);
                border: 1px solid #d4ddf7;
                border-radius: 6px;
                padding: 16px 20px;
                box-shadow: inset 0 1px 6px rgba(103, 126, 198, 0.15);
            }
            .jira-label-guide {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 12px;
            }
            .jira-label-row {
                display: flex;
                gap: 12px;
                border: 1px solid #d7def1;
                border-radius: 6px;
                padding: 10px 14px;
                background: #fff;
                box-shadow: 0 1px 4px rgba(37, 56, 88, 0.05);
            }
            .jira-label-preview {
                min-width: 150px;
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: center;
                justify-content: flex-start;
            }
            .jira-label-title {
                font-weight: 600;
                margin-bottom: 4px;
            }
            .jira-label-code {
                font-family: Consolas, 'Courier New', monospace;
                background: #f1f3f8;
                border: 1px solid #ccd4e4;
                border-radius: 4px;
                padding: 0 6px;
                font-size: 12px;
                margin-right: 6px;
            }
            .jira-divider-preview {
                padding: 4px 0;
                width: 100%;
                border-top: 1px dashed #97a0bf;
                text-align: center;
                font-size: 12px;
                color: #6b778c;
                font-style: italic;
            }
            .jira-size-preview {
                display: flex;
                gap: 6px;
            }
            .jira-size-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #f5f6fa;
                border: 1px solid #cbd2e6;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: #344563;
            }
            .jira-story-badge {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 1px solid #b8c5d6;
                background: #f4f6fb;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                color: #253858;
            }
            .jira-label-note {
                margin-top: 12px;
                font-size: 12px;
                color: #566074;
            }
            #jira-update-overlay {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.55);
                z-index: 1002;
            }
            #jira-update-modal {
                display: none;
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: min(520px, 90vw);
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 18px 45px rgba(0,0,0,0.25);
                padding: 20px 24px;
                font-family: 'Segoe UI', Arial, sans-serif;
                z-index: 1003;
            }
            .jira-update-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            .jira-update-header h3 { margin: 0; }
            .jira-update-header button {
                background: transparent;
                border: none;
                font-size: 20px;
                cursor: pointer;
            }
            .jira-update-note {
                border: 1px solid #e3e9ff;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 12px;
                background: #fefefe;
            }
            .jira-update-note.is-latest {
                border-color: #3f51b5;
                box-shadow: 0 4px 12px rgba(63, 81, 181, 0.15);
                background: #f5f7ff;
            }
            .jira-update-note h4 {
                margin: 0 0 4px 0;
                font-size: 15px;
            }
            .jira-update-note ul {
                margin: 6px 0 0 18px;
                padding: 0;
            }
            .jira-update-note li {
                font-size: 13px;
                line-height: 1.4;
                margin-bottom: 4px;
            }
            .jira-update-actions {
                text-align: right;
            }
            .jira-update-actions button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background: #0052cc;
                color: #fff;
                cursor: pointer;
            }
            #view-update-notes-link {
                background: transparent;
                border: none;
                color: #0052cc;
                cursor: pointer;
                text-decoration: underline;
                font-size: 13px;
                padding: 0;
            }
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
        'urgent': { type: 'style', styles: { backgroundColor: '#d04437', color: 'white', borderColor: '#d04437' } },
        'on-hold': { type: 'custom', handler: function(card) { if (card.querySelector('.on-hold-label')) return false; const onHoldLabel = document.createElement('span'); onHoldLabel.textContent = `🛑 On Hold`; onHoldLabel.className = 'aui-label on-hold-label'; Object.assign(onHoldLabel.style, { marginLeft: '5px', flexShrink: '0' }); const keyElement = card.querySelector('.ghx-key'); const summaryElement = card.querySelector('.ghx-summary'); if (keyElement) keyElement.insertAdjacentElement('afterend', onHoldLabel); if (summaryElement) summaryElement.style.opacity = '0.6'; return false; } },
        'small': { type: 'custom', handler: function(card, labelText, rightContainer) { if (!card.querySelector('.size-icon-s')) { const icon = createSizeIcon('S'); icon.classList.add('size-icon-s'); rightContainer.appendChild(icon); } return false; } },
        'medium': { type: 'custom', handler: function(card, labelText, rightContainer) { if (!card.querySelector('.size-icon-m')) { const icon = createSizeIcon('M'); icon.classList.add('size-icon-m'); rightContainer.appendChild(icon); } return false; } },
        'large': { type: 'custom', handler: function(card, labelText, rightContainer) { if (!card.querySelector('.size-icon-l')) { const icon = createSizeIcon('L'); icon.classList.add('size-icon-l'); rightContainer.appendChild(icon); } return false; } },
        'onderzoek': { type: 'custom', handler: function(card, labelText, rightContainer) { if (card.querySelector('.research-label')) return false; const researchLabel = document.createElement('span'); researchLabel.className = 'aui-label research-label'; researchLabel.innerHTML = '🔍 Onderzoek'; Object.assign(researchLabel.style, { borderColor: '#3572b0', display: 'flex', alignItems: 'center', gap: '4px' }); rightContainer.appendChild(researchLabel); return false; } },
        'tijdskritisch': { type: 'custom', handler: function(card, labelText, rightContainer) { if (card.querySelector('.ghx-time-critical-label')) return false; const timeCriticalLabel = document.createElement('span'); timeCriticalLabel.className = 'aui-label ghx-time-critical-label'; timeCriticalLabel.innerHTML = '⏰ Tijdskritisch'; rightContainer.appendChild(timeCriticalLabel); return false; } },
        'hotfix': { type: 'custom', handler: function(card, labelText, rightContainer) { if (card.querySelector('.ghx-hotfix-label')) return false; const hotfixLabel = document.createElement('span'); hotfixLabel.className = 'aui-label ghx-hotfix-label'; hotfixLabel.innerHTML = '🔥 Hotfix'; rightContainer.appendChild(hotfixLabel); return false; } },
        'geen-punten': { type: 'storypoint', marker: '✕' },
        'onduidelijk-punten': { type: 'storypoint', marker: '?' },
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
        const typeName = typeSpan ? (typeSpan.title || '').toLowerCase() : '';
        const isBugType = typeName === 'bug';
        const isSDType = typeName === 'sd ondersteuning';
        if (settings.highlightBugs) {
            if (isBugType || (settings.treatSDAsBug && isSDType)) {
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
    let storyPointMarker = null;
        card.querySelectorAll('.ghx-plan-extra-fields, .ghx-issue-content > .ghx-end.ghx-row').forEach(container => { elementsToProcess.push(...container.children); containersToRemove.push(container); });
        const statusField = elementsToProcess.find(field => field.matches('span[data-tooltip^="Status:"]'));
        if (statusField) { const statusText = (statusField.dataset.tooltip || '').replace('Status:', '').trim().toLowerCase(); const statusClasses = ['status-open', 'status-reopened', 'status-inprogress', 'status-test', 'status-closed', 'status-done']; card.classList.remove(...statusClasses); const statusMap = { 'open': { class: 'status-open', name: 'Open' }, 'reopened': { class: 'status-reopened', name: 'Reopened' }, 'in progress': { class: 'status-inprogress', name: 'In Progress' }, 'test': { class: 'status-test', name: 'Test' }, 'closed': { class: 'status-closed', name: 'Closed' }, 'done': { class: 'status-done', name: 'Done' } }; if (statusMap[statusText]) { card.classList.add(statusMap[statusText].class); const progressIndicator = document.createElement('div'); progressIndicator.className = 'ghx-status-indicator'; progressIndicator.title = `Status: ${statusMap[statusText].name}`; for (let i = 0; i < 3; i++) { const bar = document.createElement('div'); bar.className = 'ghx-status-indicator-bar'; progressIndicator.appendChild(bar); } if(typeSpan) typeSpan.insertAdjacentElement('afterend', progressIndicator); } }
        elementsToProcess.forEach(field => { if (field.matches('span[data-tooltip^="Status:"]') || field.classList.contains('ghx-extra-field-seperator')) return; if (field.matches('span[data-tooltip^="Labels:"]')) { const labelContentEl = field.querySelector('.ghx-extra-field-content'); const labels = (labelContentEl && labelContentEl.textContent.trim() !== 'None') ? labelContentEl.textContent.trim().split(/,\s*/).filter(Boolean) : []; const ticketKeyElement = card.querySelector('.ghx-key a'); if (ticketKeyElement) { const ticketKey = ticketKeyElement.textContent.trim(); const cache = getLabelCache(); const now = Date.now(); const existingEntry = cache[ticketKey]; const existingLabels = Array.isArray(existingEntry?.labels) ? existingEntry.labels : null; const labelsChanged = !existingLabels || JSON.stringify(existingLabels) !== JSON.stringify(labels); if (labelsChanged) { cache[ticketKey] = { labels, lastFetched: now, lastSeen: now }; saveLabelCache(cache); } else if (existingEntry) { existingEntry.lastSeen = now; saveLabelCache(cache); } }
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
                } else if (action?.type === 'storypoint') {
                    storyPointMarker = action.marker;
                    addToRightAsDefault = false;
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
        if (!storyPointMarker && shouldAutoMarkBugWithoutPoints(card, typeSpan, settings)) {
            storyPointMarker = '✕';
        }
        applyStoryPointMarker(card, storyPointMarker);
        card.classList.add('ghx-layout-processed');
    }

    function processSwimlaneCards(settings) {
        const cache = getLabelCache();
        const now = Date.now();
        const swimlaneCards = document.querySelectorAll('.ghx-swimlane .ghx-issue:not(.ghx-swimlane-processed)');
        let cacheTouched = false;

        swimlaneCards.forEach(card => {
            const issueKey = card.dataset.issueKey;
            if (!issueKey) {
                card.classList.add('ghx-swimlane-processed');
                return;
            }

            const typeSpan = card.querySelector('.ghx-type');
            const typeName = typeSpan ? (typeSpan.title || '').toLowerCase() : '';
            const isBugType = typeName === 'bug';
            const isSDType = typeName === 'sd ondersteuning';
            if (settings.highlightBugs) {
                if (isBugType || (settings.treatSDAsBug && isSDType)) {
                    card.classList.add('ghx-bug-card');
                } else {
                    card.classList.remove('ghx-bug-card');
                }
            } else {
                card.classList.remove('ghx-bug-card');
            }

            let entry = cache[issueKey];
            if (entry && typeof entry === 'object') {
                entry.lastSeen = now;
                cacheTouched = true;
            }

            const needsRefresh = !entry || typeof entry.lastFetched !== 'number' || (now - entry.lastFetched > ONE_HOUR);
            if (needsRefresh) {
                fetchLabelsViaAPI(issueKey);
                if (!entry) {
                    card.classList.add('ghx-swimlane-processed');
                    return;
                }
            }

            const cachedLabels = Array.isArray(entry.labels) ? entry.labels : [];
            let storyPointMarker = null;
            card.style.opacity = '1';

            if (cachedLabels.length > 0) {
                let labelContainer = card.querySelector('.ghx-cached-labels');
                if (!labelContainer) {
                    labelContainer = document.createElement('div');
                    labelContainer.className = 'ghx-cached-labels';
                    card.querySelector('.ghx-issue-fields')?.appendChild(labelContainer);
                }
                labelContainer.innerHTML = '';

                cachedLabels.forEach(label => {
                    const labelLower = label.toLowerCase();
                    if (labelLower === 'divider') return;

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
                        return;
                    }

                    const action = labelActions[labelLower];
                    if (action?.type === 'storypoint') {
                        storyPointMarker = action.marker;
                        return;
                    }

                    const lozenge = document.createElement('span');
                    lozenge.className = 'aui-label';
                    lozenge.textContent = label;
                    if (action?.type === 'style') { Object.assign(lozenge.style, action.styles); }
                    if (labelLower === 'tijdskritisch') { lozenge.className = 'aui-label ghx-time-critical-label'; lozenge.innerHTML = '⏰ Tijdskritisch'; }
                    else if (labelLower === 'hotfix') { lozenge.className = 'aui-label ghx-hotfix-label'; lozenge.innerHTML = '🔥 Hotfix'; }
                    else if (labelLower === 'onderzoek') { lozenge.innerHTML = '🔍 Onderzoek'; }
                    else if (labelLower === 'on-hold') { lozenge.textContent = '🛑 On Hold'; card.style.opacity = '0.7'; }
                    labelContainer.appendChild(lozenge);
                });
            }

            if (!storyPointMarker && shouldAutoMarkBugWithoutPoints(card, typeSpan, settings)) {
                storyPointMarker = '✕';
            }

            applyStoryPointMarker(card, storyPointMarker);
            card.classList.add('ghx-swimlane-processed');
        });

        if (cacheTouched) {
            saveLabelCache(cache);
        }
    }

    /**
     * --- NIEUWE FUNCTIE ---
     * Voegt labels toe aan de swimlane headers (de 'ouder-balken')
     * Leest labels uit de cache die door processSingleCard() is gevuld.
     */
    function processSwimlaneHeaders(settings) {
        const cache = getLabelCache();
        const now = Date.now();
        let cacheTouched = false;
        const headers = document.querySelectorAll('.ghx-swimlane-header:not(.ghx-labels-processed)');

        headers.forEach(header => {
            const issueKey = header.dataset.issueKey;
            if (!issueKey) {
                header.classList.add('ghx-labels-processed'); // Markeer als verwerkt om herhaling te voorkomen
                return;
            }

            const entry = cache[issueKey];
            const cachedLabels = Array.isArray(entry?.labels) ? entry.labels : [];

            if (!cachedLabels.length) {
                header.classList.add('ghx-labels-processed'); // Markeer als verwerkt, ook als er geen labels zijn
                return;
            }

            if (entry) {
                entry.lastSeen = now;
                cacheTouched = true;
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
                if (labelLower === 'divider' || ['small', 'medium', 'large', 'geen-punten', 'onduidelijk-punten'].includes(labelLower)) {
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
                } else if (labelLower === 'hotfix') {
                    lozenge.className = 'aui-label ghx-hotfix-label';
                    lozenge.innerHTML = '🔥 Hotfix';
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

        if (cacheTouched) {
            saveLabelCache(cache);
        }
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
    const updateModalController = setupUpdateModal();
    setupSettingsUI(updateModalController ? updateModalController.open : undefined);
    if (updateModalController && updateModalController.shouldShowOnLoad) {
        updateModalController.open();
    }

    const observer = new MutationObserver(() => {
        clearTimeout(observer.timeout);
        // Laad de instellingen opnieuw voor het geval ze in een ander tabblad zijn gewijzigd.
        observer.timeout = setTimeout(() => runAllProcessors(loadSettings()), 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => runAllProcessors(currentSettings), 500);

})();