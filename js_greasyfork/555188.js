// ==UserScript==
// @name         Tripletex Weekly Pay Summary
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display estimated value for hours in Tripletex.
// @author       Danielv123
// @match        https://tripletex.no/execute/updateHourlist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tripletex.no
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555188/Tripletex%20Weekly%20Pay%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/555188/Tripletex%20Weekly%20Pay%20Summary.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.__tripletexWeeklyPaySummaryLoaded) {
        return;
    }
    window.__tripletexWeeklyPaySummaryLoaded = true;

    const BASE_RATE_STORAGE_KEY = 'tm_tripletex_base_hourly_rate';
    const RATE_CONFIG_STORAGE_KEY = 'tm_tripletex_hour_type_multipliers_v1';
    const OBSERVER_OPTIONS = { childList: true, subtree: true };
    const HOURS_REGEX = /^-?\d+(?:[.,]\d+)?$/;
    const HOUR_CODE_REGEX = /\b(\d{3,4})\b/;
    const STYLE_ELEMENT_ID = 'tm-weekly-pay-summary-styles';
    const SET_RATE_BUTTON_ID = 'tm-set-base-rate-button';
    const SET_RATE_BUTTON_CLASS = 'tm-set-rate-button';
    const CONFIG_PANEL_ID = 'tm-rate-config-panel';
    const CONFIG_PANEL_CLASS = 'tm-rate-config-panel';
    const CONFIG_PANEL_VISIBLE_CLASS = 'tm-rate-config-panel--open';
    const CONFIG_PANEL_FORM_ID = 'tm-rate-config-form';
    const PAY_HEADER_LABEL_CLASS = 'tm-pay-header-label';
    const PAY_CELL_CLASS = 'tm-pay-cell';

    let baseRateCache = null;
    let multipliersCache = null;
    let setRateButton = null;
    let configPanel = null;
    let configPanelOpen = false;
    let outsideClickHandlerBound = false;
    let updateScheduled = false;

    function parseNumber(raw) {
        if (!raw) {
            return NaN;
        }
        const normalised = raw.replace(/\s/g, '').replace(',', '.');
        const value = Number.parseFloat(normalised);
        return Number.isFinite(value) ? value : NaN;
    }

    function getStoredBaseRate() {
        if (baseRateCache !== null) {
            return baseRateCache;
        }
        const stored = localStorage.getItem(BASE_RATE_STORAGE_KEY);
        if (!stored) {
            baseRateCache = null;
            return null;
        }
        const value = parseNumber(stored);
        baseRateCache = Number.isFinite(value) && value > 0 ? value : null;
        return baseRateCache;
    }

    function saveBaseRate(value) {
        baseRateCache = value;
        localStorage.setItem(BASE_RATE_STORAGE_KEY, String(value));
    }

    function clearBaseRate() {
        baseRateCache = null;
        localStorage.removeItem(BASE_RATE_STORAGE_KEY);
    }

    function getStoredMultipliers() {
        if (multipliersCache) {
            return multipliersCache;
        }
        const stored = localStorage.getItem(RATE_CONFIG_STORAGE_KEY);
        const result = {};
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    for (const [code, rawValue] of Object.entries(parsed)) {
                        const value = Number(rawValue);
                        if (Number.isFinite(value) && value > 0) {
                            result[code] = value;
                        }
                    }
                }
            } catch {
                // Ignore parse errors and fall back to empty config.
            }
        }
        multipliersCache = result;
        return multipliersCache;
    }

    function saveMultipliers(map) {
        const normalized = {};
        for (const [code, rawValue] of Object.entries(map)) {
            const value = Number(rawValue);
            if (Number.isFinite(value) && value > 0) {
                normalized[code] = value;
            }
        }
        multipliersCache = normalized;
        localStorage.setItem(RATE_CONFIG_STORAGE_KEY, JSON.stringify(normalized));
    }

    function deriveDefaultMultiplier(labelText) {
        if (!labelText) {
            return 1;
        }
        const percentMatch = labelText.match(/(\d{1,3})(?:[.,](\d+))?\s*%/);
        if (percentMatch) {
            const integerPart = percentMatch[1];
            const fractionalPart = percentMatch[2] || '';
            const combined = fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
            const percentValue = Number.parseFloat(combined.replace(',', '.'));
            if (Number.isFinite(percentValue)) {
                return 1 + percentValue / 100;
            }
        }
        return 1;
    }

    function ensureMultipliers(hourTypes) {
        const multipliers = { ...getStoredMultipliers() };
        let changed = false;
        for (const hourType of hourTypes) {
            if (!Number.isFinite(multipliers[hourType.code])) {
                multipliers[hourType.code] = deriveDefaultMultiplier(hourType.label);
                changed = true;
            }
        }
        if (changed) {
            saveMultipliers(multipliers);
            return getStoredMultipliers();
        }
        return multipliers;
    }

    function ensureStyles() {
        if (document.getElementById(STYLE_ELEMENT_ID)) {
            return;
        }

        const style = document.createElement('style');
        style.id = STYLE_ELEMENT_ID;
        style.textContent = `
            #${SET_RATE_BUTTON_ID} {
                margin-left: 12px;
                padding: 4px 10px;
                border-radius: 6px;
                border: 1px solid #cbd5e1;
                background: #ffffff;
                font-weight: 600;
                font-size: 12px;
                cursor: pointer;
                color: #1f2937;
                transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
            }
            #${SET_RATE_BUTTON_ID}:hover,
            #${SET_RATE_BUTTON_ID}:focus-visible {
                border-color: #93c5fd;
                color: #1d4ed8;
                outline: none;
            }
            .${PAY_CELL_CLASS} {
                color: #0f172a;
                text-align: right;
                white-space: nowrap;
            }
            .${PAY_CELL_CLASS}[data-placeholder="1"] {
                color: #94a3b8;
            }
            .${PAY_HEADER_LABEL_CLASS} {
                display: block;
                font-weight: 600;
                font-size: 12px;
                color: #1f2937;
                margin-bottom: 4px;
            }
            #${CONFIG_PANEL_ID} {
                position: fixed;
                z-index: 2147483647;
                background: #ffffff;
                border: 1px solid #cbd5e1;
                border-radius: 10px;
                box-shadow: 0 12px 36px rgba(15, 23, 42, 0.22);
                padding: 16px;
                width: min(400px, calc(100vw - 32px));
                color: #0f172a;
                font-size: 13px;
                line-height: 1.45;
                display: none;
            }
            #${CONFIG_PANEL_ID}.${CONFIG_PANEL_VISIBLE_CLASS} {
                display: block;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__title {
                font-size: 14px;
                font-weight: 600;
                color: #1f2937;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__close {
                border: none;
                background: transparent;
                color: #64748b;
                font-size: 18px;
                cursor: pointer;
                line-height: 1;
                padding: 4px;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__close:hover {
                color: #1f2937;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__section {
                margin-bottom: 14px;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__label {
                display: block;
                font-weight: 600;
                margin-bottom: 6px;
                color: #1f2937;
            }
            #${CONFIG_PANEL_ID} input.${CONFIG_PANEL_CLASS}__input {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                padding: 6px 8px;
                font-size: 13px;
                color: #0f172a;
                background: #ffffff;
            }
            #${CONFIG_PANEL_ID} input.${CONFIG_PANEL_CLASS}__input:focus {
                border-color: #2563eb;
                outline: 2px solid rgba(37, 99, 235, 0.15);
                outline-offset: 0;
            }
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table {
                width: 100%;
                border-collapse: collapse;
            }
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table thead th {
                text-align: left;
                font-size: 12px;
                font-weight: 600;
                color: #475569;
                padding-bottom: 6px;
            }
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table tbody td {
                padding: 4px 0;
                vertical-align: middle;
            }
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table tbody td:nth-child(1),
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table tbody td:nth-child(3),
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table tbody td:nth-child(5) {
                font-variant-numeric: tabular-nums;
            }
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table tbody td:nth-child(3),
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table tbody td:nth-child(5) {
                text-align: right;
            }
            #${CONFIG_PANEL_ID} table.${CONFIG_PANEL_CLASS}__table tbody td:nth-child(4) {
                padding-left: 8px;
                padding-right: 8px;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 16px;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__button {
                padding: 6px 14px;
                border-radius: 6px;
                border: 1px solid #cbd5e1;
                background: #f8fafc;
                font-size: 13px;
                font-weight: 600;
                color: #1f2937;
                cursor: pointer;
                transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__button--primary {
                background: #2563eb;
                border-color: #2563eb;
                color: #ffffff;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__button:hover {
                border-color: #2563eb;
                color: #1d4ed8;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__button--primary:hover {
                background: #1d4ed8;
                border-color: #1d4ed8;
                color: #ffffff;
            }
            #${CONFIG_PANEL_ID} .${CONFIG_PANEL_CLASS}__hint {
                font-size: 12px;
                color: #64748b;
                margin-top: 6px;
            }
        `;
        document.head.appendChild(style);
    }

    function handleSetRateButtonClick() {
        const button = ensureSetRateButton();
        if (!button) {
            return;
        }
        if (configPanelOpen) {
            closeConfigPanel();
            return;
        }
        const hourTypes = discoverHourTypes();
        if (hourTypes.length === 0) {
            window.alert('Fant ingen lønnskoder i tabellen.');
            return;
        }
        ensureMultipliers(hourTypes);
        openConfigPanel(button, hourTypes);
    }

    function ensurePayHeaderCell() {
        const headerRow = document.querySelector('#existingRows > tr.wageSpecColHeadRow');
        if (!headerRow) {
            return null;
        }
        let headerCell = headerRow.querySelector('th[data-tm-pay-header="1"]');
        if (!headerCell) {
            const candidates = Array.from(headerRow.querySelectorAll('th.table-cell--number-three-digits'));
            headerCell = candidates.reverse().find((cell) => cell.textContent.trim() === '');
            if (!headerCell) {
                headerCell = document.createElement('th');
                headerCell.classList.add('table-cell--number-three-digits');
                const actionsCell = headerRow.querySelector('th.do');
                if (actionsCell) {
                    headerRow.insertBefore(headerCell, actionsCell);
                } else {
                    headerRow.appendChild(headerCell);
                }
            }
            headerCell.dataset.tmPayHeader = '1';
        }
        return headerCell;
    }

    function ensureSetRateButton() {
        const targetCell = ensurePayHeaderCell();
        if (!targetCell) {
            if (setRateButton) {
                setRateButton = null;
            }
            return null;
        }

        let button = setRateButton;
        if (!button || !button.isConnected) {
            button = targetCell.querySelector(`#${SET_RATE_BUTTON_ID}`) || document.createElement('button');
        }

        if (!button.id) {
            button.type = 'button';
            button.id = SET_RATE_BUTTON_ID;
        }
        if (!button.classList.contains(SET_RATE_BUTTON_CLASS)) {
            button.classList.add(SET_RATE_BUTTON_CLASS);
        }
        if (button.textContent !== 'Satser') {
            button.textContent = 'Satser';
        }
        if (button.parentElement !== targetCell) {
            targetCell.appendChild(button);
        }
        if (!button.dataset.tmSetRateBound) {
            button.addEventListener('click', handleSetRateButtonClick);
            button.dataset.tmSetRateBound = '1';
        }

        setRateButton = button;
        return button;
    }

    function setAttributeIfChanged(node, attribute, value) {
        if (!node) {
            return;
        }
        if (value == null) {
            if (node.hasAttribute(attribute)) {
                node.removeAttribute(attribute);
            }
            return;
        }
        if (node.getAttribute(attribute) !== value) {
            node.setAttribute(attribute, value);
        }
    }

    function syncSetRateButton(baseRate) {
        const button = ensureSetRateButton();
        if (!button) {
            return;
        }
        const title = baseRate != null
            ? `Grunnsats: ${formatCurrency(baseRate)}\nKlikk for å endre satser`
            : 'Klikk for å sette grunnsats og multiplikatorer';
        setAttributeIfChanged(button, 'title', title);
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, (match) => {
            switch (match) {
                case '&':
                    return '&amp;';
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '"':
                    return '&quot;';
                case '\'':
                    return '&#39;';
                default:
                    return match;
            }
        });
    }

    function getRowHoursFromInputs(row) {
        const inputs = row.querySelectorAll('input.tlx-textfield__input');
        if (!inputs.length) {
            return null;
        }
        let total = 0;
        let hasValue = false;
        for (const input of inputs) {
            const parsed = parseNumber(input.value);
            if (Number.isFinite(parsed)) {
                total += parsed;
                hasValue = true;
            }
        }
        return hasValue ? total : null;
    }

    function getHoursFromRow(row) {
        const sumSpan = row.querySelector('span.hourlistSum.sum');
        if (sumSpan) {
            const parsed = parseNumber(sumSpan.textContent);
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }
        return getRowHoursFromInputs(row);
    }

    function getOrCreatePayCell(row) {
        const existing = row.querySelector('td[data-tm-pay-cell="1"]');
        if (existing) {
            return existing;
        }
        const sumSpan = row.querySelector('td span.hourlistSum.sum');
        const sumCell = sumSpan ? sumSpan.closest('td') : null;
        if (!sumCell) {
            return null;
        }
        let candidate = sumCell.nextElementSibling;
        if (!candidate || !candidate.matches('td.table-cell--number-three-digits')) {
            candidate = document.createElement('td');
            candidate.classList.add('table-cell--number-three-digits');
            sumCell.insertAdjacentElement('afterend', candidate);
        }
        candidate.dataset.tmPayCell = '1';
        return candidate;
    }

    function getOrCreateSumPayCell() {
        const sumRows = Array.from(document.querySelectorAll('#existingRows > tr.sum'));
        if (!sumRows.length) {
            return null;
        }
        const sumRow = sumRows[sumRows.length - 1];
        if (!sumRow) {
            return null;
        }
        const existing = sumRow.querySelector('td[data-tm-pay-cell="1"]');
        if (existing) {
            return existing;
        }
        const cells = Array.from(sumRow.querySelectorAll('td.table-cell--number-three-digits'));
        if (!cells.length) {
            return null;
        }
        const candidate = cells[cells.length - 1];
        candidate.dataset.tmPayCell = '1';
        return candidate;
    }

    function discoverHourTypes() {
        const rows = Array.from(document.querySelectorAll('#existingRows > tr[id^="ajaxContentwageSpecification"]'));
        const hourTypes = [];
        for (const row of rows) {
            const labelCell = row.querySelector('td.table-cell--text');
            if (!labelCell) {
                continue;
            }
            const labelText = labelCell.textContent.replace(/\s+/g, ' ').trim();
            if (!labelText) {
                continue;
            }
            const codeMatch = labelText.match(HOUR_CODE_REGEX);
            if (!codeMatch) {
                continue;
            }
            const code = codeMatch[1];
            const label = labelText.replace(code, '').replace(/^[\s\-–—:]+/, '').trim() || labelText;
            const hours = getHoursFromRow(row);
            const payCell = getOrCreatePayCell(row);
            hourTypes.push({
                code,
                label,
                rawLabel: labelText,
                row,
                payCell,
                hours
            });
            row.dataset.tmHourCode = code;
        }
        return hourTypes;
    }

    function formatHours(hours) {
        if (!Number.isFinite(hours)) {
            return '—';
        }
        try {
            return new Intl.NumberFormat('nb-NO', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }).format(hours);
        } catch {
            return hours.toFixed(1);
        }
    }

    function formatNumberForInput(value) {
        if (!Number.isFinite(value)) {
            return '';
        }
        return String(value).replace('.', ',');
    }

    function ensureConfigPanel() {
        if (configPanel && configPanel.isConnected) {
            return configPanel;
        }
        configPanel = document.getElementById(CONFIG_PANEL_ID);
        if (!configPanel) {
            configPanel = document.createElement('div');
            configPanel.id = CONFIG_PANEL_ID;
            configPanel.className = CONFIG_PANEL_CLASS;
            document.body.appendChild(configPanel);
        }
        if (!configPanel.dataset.tmPanelBound) {
            configPanel.addEventListener('submit', handleConfigPanelSubmit);
            configPanel.addEventListener('click', handleConfigPanelClick);
            configPanel.addEventListener('input', handleConfigPanelInput);
            configPanel.dataset.tmPanelBound = '1';
        }
        return configPanel;
    }

    function buildConfigPanelRows(hourTypes, multipliers, baseRate) {
        return hourTypes.map((hourType) => {
            const code = escapeHtml(hourType.code);
            const label = escapeHtml(hourType.label || hourType.rawLabel || hourType.code);
            const hoursText = formatHours(hourType.hours);
            const multiplier = Number.isFinite(multipliers[hourType.code])
                ? multipliers[hourType.code]
                : deriveDefaultMultiplier(hourType.label);
            const multiplierValue = escapeHtml(formatNumberForInput(multiplier));
            const ratePreview = Number.isFinite(multiplier) && Number.isFinite(baseRate)
                ? escapeHtml(formatCurrency(baseRate * multiplier))
                : '—';
            return `
                <tr data-code="${code}">
                    <td>${code}</td>
                    <td>${label}</td>
                    <td data-hours="1">${escapeHtml(hoursText)}</td>
                    <td>
                        <input
                            type="text"
                            class="${CONFIG_PANEL_CLASS}__input"
                            name="multiplier"
                            data-code="${code}"
                            inputmode="decimal"
                            autocomplete="off"
                            value="${multiplierValue}"
                        />
                    </td>
                    <td data-rate="1">${ratePreview}</td>
                </tr>
            `;
        }).join('');
    }

    function renderConfigPanel(panel, hourTypes) {
        const baseRate = getStoredBaseRate();
        const multipliers = ensureMultipliers(hourTypes);
        const baseRateValue = escapeHtml(formatNumberForInput(baseRate));
        const rowsHtml = buildConfigPanelRows(hourTypes, multipliers, baseRate);
        panel.innerHTML = `
            <div class="${CONFIG_PANEL_CLASS}__header">
                <span class="${CONFIG_PANEL_CLASS}__title">Satser</span>
                <button type="button" class="${CONFIG_PANEL_CLASS}__close" data-action="close" aria-label="Lukk panel">&times;</button>
            </div>
            <form id="${CONFIG_PANEL_FORM_ID}">
                <div class="${CONFIG_PANEL_CLASS}__section">
                    <label class="${CONFIG_PANEL_CLASS}__label" for="${CONFIG_PANEL_ID}-base-rate">Grunnsats (NOK)</label>
                    <input
                        type="text"
                        id="${CONFIG_PANEL_ID}-base-rate"
                        class="${CONFIG_PANEL_CLASS}__input"
                        name="baseRate"
                        inputmode="decimal"
                        autocomplete="off"
                        value="${baseRateValue}"
                        placeholder="F.eks. 275"
                    />
                    <div class="${CONFIG_PANEL_CLASS}__hint">Bruk komma eller punktum for desimaler. La feltet stå tomt for å fjerne grunnsatsen.</div>
                </div>
                <div class="${CONFIG_PANEL_CLASS}__section">
                    <table class="${CONFIG_PANEL_CLASS}__table">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Beskrivelse</th>
                                <th>Timer</th>
                                <th>Faktor</th>
                                <th>Sats</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
                <div class="${CONFIG_PANEL_CLASS}__actions">
                    <button type="button" class="${CONFIG_PANEL_CLASS}__button" data-action="cancel">Avbryt</button>
                    <button type="submit" class="${CONFIG_PANEL_CLASS}__button ${CONFIG_PANEL_CLASS}__button--primary" data-action="save">Lagre</button>
                </div>
            </form>
        `;
    }

    function positionConfigPanel(panel, anchor) {
        const rect = anchor.getBoundingClientRect();
        const spacing = 8;
        // Force layout to ensure measurements.
        const panelRect = panel.getBoundingClientRect();
        const panelWidth = panelRect.width || panel.offsetWidth || 0;
        const panelHeight = panelRect.height || panel.offsetHeight || 0;
        let left = rect.left;
        let top = rect.bottom + spacing;
        const maxLeft = window.innerWidth - panelWidth - 16;
        const maxTop = window.innerHeight - panelHeight - 16;
        left = Math.min(Math.max(16, left), Math.max(16, maxLeft));
        if (panelHeight > 0) {
            if (top > maxTop) {
                const alternativeTop = rect.top - panelHeight - spacing;
                if (alternativeTop >= 16) {
                    top = alternativeTop;
                } else {
                    top = Math.max(16, maxTop);
                }
            }
        }
        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(top)}px`;
    }

    function openConfigPanel(anchor, hourTypes) {
        const panel = ensureConfigPanel();
        renderConfigPanel(panel, hourTypes);
        panel.classList.add(CONFIG_PANEL_VISIBLE_CLASS);
        panel.setAttribute('aria-live', 'polite');
        configPanelOpen = true;
        if (!outsideClickHandlerBound) {
            document.addEventListener('mousedown', handleDocumentMouseDown, true);
            document.addEventListener('keydown', handleDocumentKeyDown, true);
            outsideClickHandlerBound = true;
        }
        // Allow layout to update before positioning for accurate width/height.
        requestAnimationFrame(() => {
            positionConfigPanel(panel, anchor);
            updateConfigPanelPreview(panel);
            const baseRateInput = panel.querySelector('input[name="baseRate"]');
            if (baseRateInput) {
                baseRateInput.focus();
                baseRateInput.select();
            }
        });
    }

    function closeConfigPanel() {
        if (!configPanelOpen) {
            return;
        }
        const panel = configPanel || document.getElementById(CONFIG_PANEL_ID);
        if (panel) {
            panel.classList.remove(CONFIG_PANEL_VISIBLE_CLASS);
        }
        configPanelOpen = false;
        if (outsideClickHandlerBound) {
            document.removeEventListener('mousedown', handleDocumentMouseDown, true);
            document.removeEventListener('keydown', handleDocumentKeyDown, true);
            outsideClickHandlerBound = false;
        }
    }

    function handleDocumentMouseDown(event) {
        if (!configPanelOpen || !configPanel) {
            return;
        }
        if (configPanel.contains(event.target)) {
            return;
        }
        if (setRateButton && setRateButton.contains(event.target)) {
            return;
        }
        closeConfigPanel();
    }

    function handleDocumentKeyDown(event) {
        if (event.key === 'Escape' && configPanelOpen) {
            closeConfigPanel();
        }
    }

    function handleConfigPanelClick(event) {
        const action = event.target instanceof HTMLElement ? event.target.dataset.action : null;
        if (!action) {
            return;
        }
        if (action === 'cancel' || action === 'close') {
            event.preventDefault();
            closeConfigPanel();
        }
    }

    function handleConfigPanelSubmit(event) {
        if (event.target && event.target.id !== CONFIG_PANEL_FORM_ID) {
            return;
        }
        event.preventDefault();
        const panel = configPanel;
        if (!panel) {
            return;
        }
        const result = readConfigPanelValues(panel);
        if (result.error) {
            window.alert(result.error);
            if (result.focus) {
                result.focus.focus();
                if (result.focus.select) {
                    result.focus.select();
                }
            }
            return;
        }
        if (result.baseRate == null) {
            clearBaseRate();
        } else {
            saveBaseRate(result.baseRate);
        }
        saveMultipliers(result.multipliers);
        closeConfigPanel();
        scheduleUpdate(true);
    }

    function handleConfigPanelInput(event) {
        const panel = configPanel;
        if (!panel) {
            return;
        }
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            return;
        }
        if (target.name === 'baseRate' || target.name === 'multiplier') {
            updateConfigPanelPreview(panel);
        }
    }

    function readConfigPanelValues(panel) {
        const baseRateInput = panel.querySelector('input[name="baseRate"]');
        const rawBaseRate = baseRateInput ? baseRateInput.value.trim() : '';
        let baseRate = null;
        if (rawBaseRate !== '') {
            const parsed = parseNumber(rawBaseRate);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                return {
                    error: 'Oppgi en gyldig grunnsats større enn 0.',
                    focus: baseRateInput
                };
            }
            baseRate = parsed;
        }
        const multipliers = { ...getStoredMultipliers() };
        const rows = panel.querySelectorAll(`tbody tr[data-code]`);
        for (const row of rows) {
            const code = row.getAttribute('data-code');
            if (!code) {
                continue;
            }
            const input = row.querySelector('input[name="multiplier"]');
            if (!input) {
                continue;
            }
            const rawValue = input.value.trim();
            const parsedValue = parseNumber(rawValue);
            if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
                return {
                    error: `Ugyldig faktor for lønnskode ${code}.`,
                    focus: input
                };
            }
            multipliers[code] = parsedValue;
        }
        return { baseRate, multipliers };
    }

    function updateConfigPanelPreview(panel) {
        const baseRateInput = panel.querySelector('input[name="baseRate"]');
        const baseRateValue = baseRateInput ? parseNumber(baseRateInput.value) : NaN;
        const hasBaseRate = Number.isFinite(baseRateValue) && baseRateValue > 0;
        const rows = panel.querySelectorAll('tbody tr[data-code]');
        for (const row of rows) {
            const rateCell = row.querySelector('[data-rate]');
            const multiplierInput = row.querySelector('input[name="multiplier"]');
            if (!rateCell || !multiplierInput) {
                continue;
            }
            const multiplierValue = parseNumber(multiplierInput.value);
            if (hasBaseRate && Number.isFinite(multiplierValue) && multiplierValue > 0) {
                rateCell.textContent = formatCurrency(baseRateValue * multiplierValue);
                rateCell.removeAttribute('data-placeholder');
            } else {
                rateCell.textContent = '—';
                rateCell.setAttribute('data-placeholder', '1');
            }
        }
    }

    function formatCurrency(amountNok) {
        if (!Number.isFinite(amountNok)) {
            return '—';
        }
        try {
            return new Intl.NumberFormat('nb-NO', {
                style: 'currency',
                currency: 'NOK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amountNok);
        } catch (error) {
            return `${amountNok.toFixed(0)} kr`;
        }
    }

    function setTextContentIfChanged(node, value) {
        const next = value == null ? '' : String(value);
        if (node.textContent !== next) {
            node.textContent = next;
        }
    }

    function formatMultiplier(multiplier) {
        if (!Number.isFinite(multiplier)) {
            return '';
        }
        try {
            return new Intl.NumberFormat('nb-NO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(multiplier);
        } catch {
            return multiplier.toFixed(2);
        }
    }

    function renderTablePayBreakdown({ hourTypes, baseRate, multipliers }) {
        const hasBaseRate = Number.isFinite(baseRate) && baseRate > 0;
        let accumulatedPay = 0;

        for (const hourType of hourTypes) {
            const cell = hourType.payCell;
            if (!cell) {
                continue;
            }
            cell.classList.add(PAY_CELL_CLASS);

            const multiplier = Number.isFinite(multipliers[hourType.code])
                ? multipliers[hourType.code]
                : deriveDefaultMultiplier(hourType.label);
            const hours = Number.isFinite(hourType.hours) ? hourType.hours : 0;

            if (!hasBaseRate || !Number.isFinite(multiplier)) {
                setTextContentIfChanged(cell, '—');
                cell.setAttribute('data-placeholder', '1');
                setAttributeIfChanged(cell, 'title', 'Angi grunnsats og faktor for å beregne beløp.');
                continue;
            }

            const pay = baseRate * multiplier * hours;
            accumulatedPay += pay;
            setTextContentIfChanged(cell, formatCurrency(pay));
            cell.removeAttribute('data-placeholder');

            const rateLabel = formatCurrency(baseRate * multiplier);
            const hoursLabel = formatHours(hours);
            const multiplierLabel = formatMultiplier(multiplier);
            const tooltip = `Timer: ${hoursLabel} • Faktor: ${multiplierLabel} • Sats: ${rateLabel}`;
            setAttributeIfChanged(cell, 'title', tooltip);
        }

        const sumCell = getOrCreateSumPayCell();
        if (!sumCell) {
            return;
        }
        sumCell.classList.add(PAY_CELL_CLASS);
        if (!hasBaseRate) {
            setTextContentIfChanged(sumCell, '—');
            sumCell.setAttribute('data-placeholder', '1');
            setAttributeIfChanged(sumCell, 'title', 'Angi grunnsats for å se totalbeløp.');
            return;
        }

        setTextContentIfChanged(sumCell, formatCurrency(accumulatedPay));
        sumCell.removeAttribute('data-placeholder');
        setAttributeIfChanged(sumCell, 'title', 'Totalbeløp for uken');
    }

    function updateSummary() {
        const hourTypes = discoverHourTypes();
        const baseRate = getStoredBaseRate();
        const multipliers = ensureMultipliers(hourTypes);
        syncSetRateButton(baseRate);
        renderTablePayBreakdown({ hourTypes, baseRate, multipliers });
    }


    function scheduleUpdate(force = false) {
        if (!force && updateScheduled) {
            return;
        }
        updateScheduled = true;
        requestAnimationFrame(() => {
            updateScheduled = false;
            updateSummary();
        });
    }

    function bootstrap() {
        ensureStyles();
        ensureSetRateButton();
        updateSummary();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (setRateButton && (setRateButton === mutation.target || setRateButton.contains(mutation.target))) {
                    continue;
                }
                scheduleUpdate();
                break;
            }
        });
        observer.observe(document.body, OBSERVER_OPTIONS);

        window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        bootstrap();
    } else {
        document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    }
})();

