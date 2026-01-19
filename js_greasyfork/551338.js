// ==UserScript==
// @name         referenzanschluss-sortierer
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      2.0.4
// @description  Sortiert Referenzanschluss-Zeilen - Vereinfachte UI ohne Checkboxen, +3 Button
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel?id=*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551338/referenzanschluss-sortierer.user.js
// @updateURL https://update.greasyfork.org/scripts/551338/referenzanschluss-sortierer.meta.js
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
    if (window.__referenzanschlussSortiererInitialized) return;
    window.__referenzanschlussSortiererInitialized = true;

    // ==================== CONSTANTS ====================
    const KEY_PATTERNS = [
        'hw_referenzanschluss',
        'hw_nas_anschluss_extern',
        'hw_mainboards_slots_pcie',
        'hw_mainboards_slots_m2',
		'hw_mainboards_slots_sonstige',
		'hw_mainboards_header_usb',
		'hw_mainboards_header_sonstige',
		'hw_mainboards_header_kuehlung',
		'hw_mainboards_header_strom',
		'hw_mainboards_header_beleuchtung'
    ];

    // Selektoren für die aktualisierte HTML-Struktur
    // Preview Container: .px-2.position-relative.d-flex.justify-content-between.template-row
    // Dazwischen: .row-background mit .preview--short--success (Vorschau der Werte)
    // Daten-Container: .d-grid (enthält die Gruppen)
    // Gruppen-Header: .p-1.fw-bold.row-background (innerhalb .d-grid)
    // Property-Elemente: .d-flex.p-1.row-background (statt .property)
    const PREVIEW_CONTAINER_SELECTOR = '.px-2.position-relative.d-flex.justify-content-between.template-row';
    const DATA_CONTAINER_SELECTOR = '.d-grid';
    const GROUP_HEADER_SELECTOR = '.p-1.fw-bold.row-background';
    const PROPERTY_SELECTOR = '.d-flex.p-1.row-background';
    const PROPERTIES_GRID_SELECTOR = '.properties-grid';

    function getPatternFromFieldName(fieldName) {
        for (const pattern of KEY_PATTERNS) {
            if (fieldName.startsWith(pattern + '_')) {
                return pattern;
            }
        }
        return null;
    }
    const COLOR_ENABLED = '#007bff';
    const COLOR_DISABLED = '#ccc';
    const COLOR_DELETE = '#dc3545';
    const COLOR_DEFRAG = '#28a745';

    // ==================== GLOBAL STATE ====================
    let isOperationInProgress = false;
    let cachedRoot = null;
    let isSwappingInProgress = false;

    // ==================== CSS INJECTION ====================
    const CSS_STYLES = `
        .referenzanschluss-button {
            padding: 3px 8px;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            font-size: 11px;
            font-weight: normal;
            transition: background-color 0.2s;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .referenzanschluss-button:hover:not(:disabled) {
            background: #0056b3;
        }

        .referenzanschluss-button:disabled {
            background: #ccc;
            cursor: not-allowed;
            opacity: 0.3;
        }

        .delete-button-single {
            background: white !important;
            color: #dc3545 !important;
            border: 2px solid #dc3545 !important;
            padding: 0px 6px 2px 6px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 23px !important;
        }

        .delete-button-single:hover:not(:disabled) {
            background: #ffe6e6 !important;
            padding: 0px 6px 2px 6px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 23px !important;
        }

        .delete-button-single:disabled {
            background: white !important;
            color: #dc3545 !important;
            border: 2px solid #ffcccc !important;
            opacity: 0.3;
            padding: 0px 6px 2px 6px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 23px !important;
        }

        .referenzanschluss-group-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 10px !important;
            transition: background-color 0.5s ease-out;
        }

        .d-flex.p-1.row-background {
            transition: background-color 0.5s ease-out;
        }

        .referenzanschluss-button-container {
            display: flex !important;
            gap: 4px !important;
            align-items: center !important;
            flex-wrap: nowrap;
            flex-shrink: 0;
        }

        [class*="group-control-buttons"] {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }

        /* Panel im Preview-Container/Header - horizontal und kompakt */
        .d-flex.gap-1 > [class*="group-control-buttons"] {
            flex-direction: row;
            gap: 4px;
            margin: 0;
            padding: 0;
            background: transparent;
            border: none;
            align-items: center;
        }

        .d-flex.gap-1 > [class*="group-control-buttons"] .button-row-middle {
            margin: 0;
        }

        [class*="group-control-buttons"] > div {
            display: flex;
            gap: 4px;
            align-items: center;
        }

        [class*="group-control-buttons"] .button-row-middle {
            flex-wrap: nowrap;
        }

        [class*="defrag-btn"] {
            padding: 4px 8px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            font-weight: normal;
            transition: background-color 0.2s;
        }

        [class*="defrag-btn"]:hover {
            background: #218838;
        }

        [class*="defrag-btn"]:disabled {
            background: #ccc;
            cursor: not-allowed;
            opacity: 0.3;
        }

        .referenzanschluss-spinner {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: rgba(0, 0, 0, 0.7);
            padding: 20px;
            border-radius: 8px;
            color: white;
            text-align: center;
            display: none;
        }

        .referenzanschluss-spinner.active {
            display: block;
        }

        .refanschluss-copy-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
            cursor: pointer;
            background: transparent;
            border: none;
            font-size: 14px;
            color: gray;
            transition: color 0.2s;
        }

        .refanschluss-copy-btn:hover {
            color: #007bff;
        }

        .refanschluss-copy-btn.copied {
            color: #28a745 !important;
        }
    `;

    // ==================== REACT HELPERS ====================

    function getReactFiber(element) {
        const keys = Object.keys(element);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance') || key.startsWith('_reactInternalFiber')) {
                return element[key];
            }
        }
        return null;
    }

    function findReactComponent(element, maxLevels) {
        maxLevels = maxLevels || 15;
        let fiber = getReactFiber(element);
        if (!fiber) return null;

        let level = 0;
        while (fiber && level < maxLevels) {
            if (fiber.stateNode && typeof fiber.stateNode === 'object') {
                if (fiber.stateNode.setState || fiber.stateNode.forceUpdate) {
                    return fiber.stateNode;
                }
            }
            fiber = fiber.return;
            level++;
        }
        return null;
    }

    function getReactSelectData(container) {
        const reactInput = container ? container.querySelector('input[id^="react-select"]') : null;
        if (!reactInput) return null;

        const component = findReactComponent(reactInput);
        if (component && component.props && component.props.value) {
            return component.props.value;
        }

        const fiber = getReactFiber(reactInput);
        if (fiber) {
            let current = fiber.return;
            let attempts = 0;
            while (current && attempts < 15) {
                if (current.memoizedProps && current.memoizedProps.value) {
                    return current.memoizedProps.value;
                }
                if (current.stateNode && current.stateNode.state && current.stateNode.state.value) {
                    return current.stateNode.state.value;
                }
                current = current.return;
                attempts++;
            }
        }
        return null;
    }

    function getReactMultiSelectData(container) {
        const reactInput = container ? container.querySelector('input[id^="react-select"]') : null;
        if (!reactInput) return null;

        // Versuche zuerst React-State zu lesen
        const component = findReactComponent(reactInput);
        if (component && component.props && component.props.value) {
            return component.props.value;
        }

        const fiber = getReactFiber(reactInput);
        if (fiber) {
            let current = fiber.return;
            let attempts = 0;
            while (current && attempts < 15) {
                if (current.memoizedProps && current.memoizedProps.value) {
                    return current.memoizedProps.value;
                }
                if (current.stateNode && current.stateNode.state && current.stateNode.state.value) {
                    return current.stateNode.state.value;
                }
                current = current.return;
                attempts++;
            }
        }

        // Fallback: Lese direkt aus dem DOM
        // 1. Versuche hidden inputs mit name="keys" zu lesen
        const reactSelectContainer = container.querySelector('[class*="-container"]');
        if (reactSelectContainer) {
            const hiddenInputs = reactSelectContainer.querySelectorAll('input[type="hidden"][name="keys"]');
            if (hiddenInputs.length > 0) {
                const values = [];
                hiddenInputs.forEach(input => {
                    if (input.value) {
                        values.push({ label: input.value, value: input.value });
                    }
                });
                if (values.length > 0) return values;
            }
        }

        // 2. Fallback: Lese aus den sichtbaren multiValue-Elementen
        const multiValueDivs = container.querySelectorAll('[class*="multiValue"] [class*="9jq23d"]');
        if (multiValueDivs.length > 0) {
            const values = [];
            multiValueDivs.forEach(div => {
                const text = div.textContent.trim();
                if (text) {
                    values.push({ label: text, value: text });
                }
            });
            if (values.length > 0) return values;
        }

        return null;
    }

    function setInputValue(element, value) {
        if (!element) return;
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(element, value || '');
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * Entfernt die changed__field Klasse von einem Element und seinen Nachbarn
     * um die grüne Hervorhebung nach Script-Manipulationen zu unterdrücken
     */
    function removeChangedFieldHighlight(element) {
        if (!element) return;

        // Entferne von Element selbst
        if (element.classList && element.classList.contains('changed__field')) {
            element.classList.remove('changed__field');
        }

        // Suche in Eltern-Elementen
        let parent = element.parentElement;
        let attempts = 0;
        while (parent && attempts < 10) {
            if (parent.classList && parent.classList.contains('changed__field')) {
                parent.classList.remove('changed__field');
            }
            parent = parent.parentElement;
            attempts++;
        }

        // Suche in Kind-Elementen
        const changedChildren = element.querySelectorAll('.changed__field');
        changedChildren.forEach(child => {
            child.classList.remove('changed__field');
        });
    }

    /**
     * Entfernt changed__field Hervorhebung für ein Feld anhand des Feldnamens
     */
    function removeChangedFieldHighlightByName(root, fieldName) {
        // Versuche Element direkt per ID zu finden
        const directElement = document.getElementById(fieldName);
        if (directElement) {
            removeChangedFieldHighlight(directElement);
        }

        // Versuche über Label zu finden
        const label = root.querySelector('label[for="' + fieldName + '"]');
        if (label) {
            const prop = label.closest(PROPERTY_SELECTOR);
            if (prop) {
                removeChangedFieldHighlight(prop);
                // Auch alle Inputs und React-Select-Container im Property
                const inputs = prop.querySelectorAll('input, select, [class*="-container"]');
                inputs.forEach(input => removeChangedFieldHighlight(input));
            }
        }
    }

    function setReactSelectValue(root, fieldName, optionData) {
        return new Promise(function(resolve) {
            const label = root.querySelector('label[for="' + fieldName + '"]');
            if (!label) return resolve(false);

            // Finde Property-Container (neue Struktur: .d-flex.p-1.row-background)
            const container = label.closest(PROPERTY_SELECTOR);
            if (!container) return resolve(false);

            let option = optionData;
            if (typeof optionData === 'string') {
                option = { label: optionData, value: optionData };
            }

            const isDelete = !option;
            const reactInput = container.querySelector('input[id^="react-select"]');
            if (!reactInput) return resolve(false);

            try {
                const component = findReactComponent(reactInput);
                if (component && component.props && component.props.onChange) {
                    if (isDelete) {
                        component.props.onChange(null, { action: 'clear' });
                    } else {
                        component.props.onChange(option, { action: 'select-option' });
                    }
                }

                const fiber = getReactFiber(reactInput);
                if (fiber && fiber.return) {
                    let current = fiber.return;
                    let attempts = 0;
                    while (current && attempts < 15) {
                        if (current.stateNode && current.stateNode.setState) {
                            current.stateNode.setState({
                                value: isDelete ? null : option
                            }, function() {
                                if (current.stateNode.forceUpdate) {
                                    current.stateNode.forceUpdate();
                                }
                            });
                            break;
                        }
                        current = current.return;
                        attempts++;
                    }
                }

                reactInput.dispatchEvent(new Event('input', { bubbles: true }));
                reactInput.dispatchEvent(new Event('change', { bubbles: true }));

                resolve(true);
            } catch (error) {
                resolve(false);
            }
        });
    }

    function setReactMultiSelectValue(root, fieldName, optionsData) {
        return new Promise(function(resolve) {
            const label = root.querySelector('label[for="' + fieldName + '"]');
            if (!label) return resolve(false);

            const container = label.closest(PROPERTY_SELECTOR);
            if (!container) return resolve(false);

            let options = optionsData;
            if (Array.isArray(optionsData) && optionsData.length > 0) {
                if (typeof optionsData[0] === 'string') {
                    options = [];
                    for (let i = 0; i < optionsData.length; i++) {
                        options.push({ label: optionsData[i], value: optionsData[i] });
                    }
                }
                const seen = {};
                const sanitized = [];
                for (let i = 0; i < options.length; i++) {
                    const key = options[i].value || options[i].label;
                    if (!seen[key]) {
                        seen[key] = true;
                        sanitized.push(options[i]);
                    }
                }
                options = sanitized;
            }

            const isDelete = !Array.isArray(options) || options.length === 0;
            const reactInput = container.querySelector('input[id^="react-select"]');
            if (!reactInput) return resolve(false);

            try {
                const component = findReactComponent(reactInput);
                if (component && component.props && component.props.onChange) {
                    if (isDelete) {
                        component.props.onChange([], { action: 'clear' });
                    } else {
                        component.props.onChange(options, { action: 'set-value' });
                    }
                }

                const fiber = getReactFiber(reactInput);
                if (fiber && fiber.return) {
                    let current = fiber.return;
                    let attempts = 0;
                    while (current && attempts < 15) {
                        if (current.stateNode && current.stateNode.setState) {
                            current.stateNode.setState({
                                value: isDelete ? [] : options
                            }, function() {
                                if (current.stateNode.forceUpdate) {
                                    current.stateNode.forceUpdate();
                                }
                            });
                            break;
                        }
                        current = current.return;
                        attempts++;
                    }
                }

                reactInput.dispatchEvent(new Event('input', { bubbles: true }));
                reactInput.dispatchEvent(new Event('change', { bubbles: true }));

                resolve(true);
            } catch (error) {
                resolve(false);
            }
        });
    }

    function detectFieldType(root, fieldName) {
        const label = root.querySelector('label[for="' + fieldName + '"]');
        if (!label) return null;

        const container = label.closest(PROPERTY_SELECTOR);
        if (!container) return null;

        const inputGroup = container.querySelector('.input-group');
        const reactInput = container.querySelector('input[id^="react-select"]');
        const isMultiple = !!container.querySelector('.multiple-select-indicator');

        if (inputGroup) {
            const numInput = inputGroup.querySelector('input.input-numeric');
            const unitSelect = inputGroup.querySelector('select.input-numeric');

            // React-Select innerhalb input-group (Array-Typen mit/ohne Unit)
            if (reactInput && isMultiple) {
                return unitSelect ? 'NUMERIC+UNIT+ARRAY' : 'NUMERIC+ARRAY';
            }

            // Numerische Typen
            if (numInput) {
                return unitSelect ? 'NUMERIC+UNIT' : 'NUMERIC';
            }

            // TEXT: Einfaches Input-Feld mit Clear-Button (kein input-numeric, kein react-select)
            const textInput = inputGroup.querySelector('input.form-control:not(.input-numeric)');
            if (textInput) return 'TEXT';
        }

        // React-Select ohne input-group
        if (reactInput) {
            if (isMultiple) return 'TEXT+ARRAY';
            return 'REFERENCE';
        }

        // Fallback: Einfaches Input-Feld (NUMERIC)
        const simpleInput = container.querySelector('#' + fieldName);
        if (simpleInput && simpleInput.tagName === 'INPUT') return 'NUMERIC';

        return 'UNKNOWN';
    }

    function getFieldValue(root, fieldName, fieldType) {
        const label = root.querySelector('label[for="' + fieldName + '"]');
        if (!label) return null;
        const prop = label.closest(PROPERTY_SELECTOR);
        if (!prop) return null;

        let result = null;

        // TEXT: Einfaches Input-Feld mit Clear-Button
        if (fieldType === 'TEXT') {
            const inputGroup = prop.querySelector('.input-group');
            if (inputGroup) {
                const textInput = inputGroup.querySelector('input.form-control:not(.input-numeric)');
                result = textInput ? textInput.value : '';
            }
        }

        // NUMERIC: Einfaches numerisches Input-Feld
        if (fieldType === 'NUMERIC') {
            const input = document.getElementById(fieldName);
            result = input ? input.value : '';
        }

        // NUMERIC+UNIT: Numerisches Feld mit Einheiten-Dropdown
        if (fieldType === 'NUMERIC+UNIT') {
            const input = prop.querySelector('input.input-numeric');
            const select = prop.querySelector('select.input-numeric');
            result = {
                value: input ? input.value : '',
                unit: select ? select.value : ''
            };
        }

        // REFERENCE: React-Select Einzelauswahl (speichert Integer)
        if (fieldType === 'REFERENCE') {
            const data = getReactSelectData(prop);
            if (data && (data.label || data.value)) result = data;
            const selected = prop.querySelector('.text-select-a87lys');
            if (selected) result = { label: selected.textContent, value: selected.textContent };
            if (!result) result = null;
        }

        // TEXT+ARRAY: React-Select Mehrfachauswahl (Text-Werte)
        if (fieldType === 'TEXT+ARRAY') {
            const data = getReactMultiSelectData(prop);
            result = data || [];
        }

        // NUMERIC+ARRAY: React-Select Mehrfachauswahl (Numerische Werte)
        if (fieldType === 'NUMERIC+ARRAY') {
            const data = getReactMultiSelectData(prop);
            result = data || [];
        }

        // NUMERIC+UNIT+ARRAY: React-Select Mehrfachauswahl mit Einheiten-Dropdown
        if (fieldType === 'NUMERIC+UNIT+ARRAY') {
            const inputGroup = prop.querySelector('.input-group');
            const select = inputGroup ? inputGroup.querySelector('select.input-numeric') : null;
            const data = getReactMultiSelectData(prop);
            result = {
                values: data || [],
                unit: select ? select.value : ''
            };
        }

        return result;
    }

    async function setFieldValue(root, fieldName, fieldType, value, isEmptyValue) {
        // TEXT: Einfaches Input-Feld mit Clear-Button
        if (fieldType === 'TEXT') {
            const label = root.querySelector('label[for="' + fieldName + '"]');
            if (!label) return false;
            const prop = label.closest(PROPERTY_SELECTOR);
            if (!prop) return false;
            const inputGroup = prop.querySelector('.input-group');
            if (!inputGroup) return false;
            const textInput = inputGroup.querySelector('input.form-control:not(.input-numeric)');
            if (!textInput) return false;

            if (isEmptyValue && textInput.value === '') return true;

            if (value === null || value === undefined || value === '') {
                if (textInput.value !== '') setInputValue(textInput, '');
            } else {
                if (textInput.value === value) return true;
                setInputValue(textInput, value);
            }
            return true;
        }

        // NUMERIC: Einfaches numerisches Input-Feld
        if (fieldType === 'NUMERIC') {
            const input = document.getElementById(fieldName);
            if (!input) return false;

            if (isEmptyValue && input.value === '') return true;

            if (value === null || value === undefined || value === '') {
                if (input.value !== '') setInputValue(input, '');
            } else {
                if (input.value === value) return true;
                setInputValue(input, value);
            }
            return true;
        }

        // NUMERIC+UNIT: Numerisches Feld mit Einheiten-Dropdown
        if (fieldType === 'NUMERIC+UNIT') {
            const label = root.querySelector('label[for="' + fieldName + '"]');
            if (!label) return false;

            const prop = label.closest(PROPERTY_SELECTOR);
            if (!prop) return false;

            const input = prop.querySelector('input.input-numeric');
            const select = prop.querySelector('select.input-numeric');

            if (isEmptyValue) {
                if (input && input.value !== '') setInputValue(input, '');
            } else {
                if (input && value && typeof value === 'object') {
                    const currentValue = input.value;
                    const currentUnit = select ? select.value : '';
                    const newValue = value.value || '';
                    const newUnit = value.unit || '';

                    if (currentValue === newValue && currentUnit === newUnit) return true;

                    if (value.value || input.value !== '') setInputValue(input, value.value || '');
                    if (select && value.unit) {
                        select.value = value.unit;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else if (input) {
                    if (input.value === '') return true;
                    if (input.value !== '') setInputValue(input, '');
                }
            }
            return true;
        }

        // REFERENCE: React-Select Einzelauswahl (speichert Integer)
        if (fieldType === 'REFERENCE') {
            const currentValue = getFieldValue(root, fieldName, fieldType);
            const currentText = currentValue && typeof currentValue === 'object' ? currentValue.value : (currentValue || '');
            const newText = typeof value === 'string' ? value : (value && typeof value === 'object' ? value.value : (value || ''));

            if (currentText === newText) return true;

            const isCurrentEmpty = !currentValue || (typeof currentValue === 'object' && !currentValue.value) || currentValue === '';

            if (!isEmptyValue || !isCurrentEmpty) {
                let textOption = null;
                if (typeof value === 'string') {
                    textOption = { label: value, value: value };
                } else if (value && typeof value === 'object' && (value.label || value.value)) {
                    textOption = value;
                } else if (value) {
                    textOption = { label: value, value: value };
                }
                return await setReactSelectValue(root, fieldName, textOption);
            }
            return true;
        }

        // TEXT+ARRAY: React-Select Mehrfachauswahl (Text-Werte)
        if (fieldType === 'TEXT+ARRAY') {
            const currentValue = getFieldValue(root, fieldName, fieldType);
            const currentArray = currentValue || [];
            const newArray = value || [];

            if (currentArray.length === newArray.length) {
                let areIdentical = true;
                for (let i = 0; i < currentArray.length; i++) {
                    const curr = currentArray[i];
                    const newItem = newArray[i];
                    const currLabel = curr ? curr.label : '';
                    const currVal = curr ? curr.value : '';
                    const newLabel = newItem ? newItem.label : '';
                    const newVal = newItem ? newItem.value : '';
                    if (currLabel !== newLabel || currVal !== newVal) {
                        areIdentical = false;
                        break;
                    }
                }
                if (areIdentical) return true;
            }

            const isCurrentEmpty = !currentValue || currentValue.length === 0;
            if (!isEmptyValue || !isCurrentEmpty) {
                return await setReactMultiSelectValue(root, fieldName, value);
            }
            return true;
        }

        // NUMERIC+ARRAY: React-Select Mehrfachauswahl (Numerische Werte)
        if (fieldType === 'NUMERIC+ARRAY') {
            const currentValue = getFieldValue(root, fieldName, fieldType);
            const currentArray = currentValue || [];
            const newArray = value || [];

            if (currentArray.length === newArray.length) {
                let areIdentical = true;
                for (let i = 0; i < currentArray.length; i++) {
                    const curr = currentArray[i];
                    const newItem = newArray[i];
                    const currLabel = curr ? curr.label : '';
                    const currVal = curr ? curr.value : '';
                    const newLabel = newItem ? newItem.label : '';
                    const newVal = newItem ? newItem.value : '';
                    if (currLabel !== newLabel || currVal !== newVal) {
                        areIdentical = false;
                        break;
                    }
                }
                if (areIdentical) return true;
            }

            const isCurrentEmpty = !currentValue || currentValue.length === 0;
            if (!isEmptyValue || !isCurrentEmpty) {
                return await setReactMultiSelectValue(root, fieldName, value);
            }
            return true;
        }

        // NUMERIC+UNIT+ARRAY: React-Select Mehrfachauswahl mit Einheiten-Dropdown
        if (fieldType === 'NUMERIC+UNIT+ARRAY') {
            const label = root.querySelector('label[for="' + fieldName + '"]');
            if (!label) return false;
            const prop = label.closest(PROPERTY_SELECTOR);
            if (!prop) return false;
            const inputGroup = prop.querySelector('.input-group');
            const select = inputGroup ? inputGroup.querySelector('select.input-numeric') : null;

            const currentValue = getFieldValue(root, fieldName, fieldType);
            const currentArray = currentValue ? currentValue.values : [];
            const currentUnit = currentValue ? currentValue.unit : '';

            let newArray, newUnit;
            if (value && typeof value === 'object' && 'values' in value) {
                newArray = value.values || [];
                newUnit = value.unit || '';
            } else {
                newArray = value || [];
                newUnit = '';
            }

            // Check if arrays are identical
            let arraysIdentical = currentArray.length === newArray.length;
            if (arraysIdentical) {
                for (let i = 0; i < currentArray.length; i++) {
                    const curr = currentArray[i];
                    const newItem = newArray[i];
                    const currLabel = curr ? curr.label : '';
                    const currVal = curr ? curr.value : '';
                    const newLabel = newItem ? newItem.label : '';
                    const newVal = newItem ? newItem.value : '';
                    if (currLabel !== newLabel || currVal !== newVal) {
                        arraysIdentical = false;
                        break;
                    }
                }
            }

            if (arraysIdentical && currentUnit === newUnit) return true;

            const isCurrentEmpty = (!currentArray || currentArray.length === 0);
            if (!isEmptyValue || !isCurrentEmpty) {
                await setReactMultiSelectValue(root, fieldName, newArray);
                if (select && newUnit) {
                    select.value = newUnit;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            return true;
        }

        return false;
    }

    function getAllFieldsInGroup(root, groupIndex, containerScope) {
        const fields = [];
        const searchRoot = containerScope || root;

        const containerPattern = containerScope ? getContainerPattern(containerScope) : null;

        const allLabels = searchRoot.querySelectorAll('label[for*="_' + groupIndex + '_"]');
        const labels = [];

        for (let i = 0; i < allLabels.length; i++) {
            const label = allLabels[i];
            const fieldName = label.getAttribute('for');
            const pattern = getPatternFromFieldName(fieldName);

            if (containerPattern && pattern !== containerPattern) {
                continue;
            }

            if (pattern) {
                labels.push(label);
            }
        }

        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            const fieldName = label.getAttribute('for');
            if (!fieldName) continue;

            const pattern = getPatternFromFieldName(fieldName);
            if (!pattern) continue;
            if (containerPattern && pattern !== containerPattern) continue;

            const regex = new RegExp('^' + pattern + '_' + groupIndex + '_(.+)$');
            const match = fieldName.match(regex);
            if (!match) continue;

            const fieldBaseName = match[1];
            const fieldType = detectFieldType(root, fieldName);

            if (fieldType && fieldType !== 'UNKNOWN') {
                fields.push({
                    name: fieldName,
                    baseName: fieldBaseName,
                    type: fieldType
                });
            }
        }

        return fields;
    }

    function getGroupValues(root, index, containerScope) {
        const values = {};
        const fields = getAllFieldsInGroup(root, index, containerScope);

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const value = getFieldValue(root, field.name, field.type);
            values[field.baseName] = {
                type: field.type,
                value: value
            };
        }

        return values;
    }

    // ==================== CLIPBOARD EXPORT/IMPORT ====================

    /**
     * Exportiert eine Gruppe im nativen Geizhals-Format für Clipboard
     * Format: { pattern: "...", index: N, keys: { "keyName.unit": "", "keyName.val": ..., "keyName.name": "" } }
     */
    function exportGroupToClipboardFormat(root, groupIndex, containerScope) {
        const pattern = getContainerPattern(containerScope);
        const fields = getAllFieldsInGroup(root, groupIndex, containerScope);
        const keys = {};

        for (const field of fields) {
            const value = getFieldValue(root, field.name, field.type);
            const keyBase = field.name; // Vollständiger Key mit Pattern und Index

            // Initialisiere die drei Eigenschaften
            keys[keyBase + '.unit'] = '';
            keys[keyBase + '.val'] = null;
            keys[keyBase + '.name'] = '';

            if (field.type === 'TEXT') {
                keys[keyBase + '.val'] = value || '';
            }
            else if (field.type === 'NUMERIC') {
                keys[keyBase + '.val'] = value || '';
            }
            else if (field.type === 'NUMERIC+UNIT') {
                if (value && typeof value === 'object') {
                    keys[keyBase + '.val'] = value.value || '';
                    keys[keyBase + '.unit'] = value.unit || '';
                }
            }
            else if (field.type === 'REFERENCE') {
                if (value && typeof value === 'object') {
                    // .val ist Integer (Artikel-ID), .name ist Anzeige-Text
                    keys[keyBase + '.val'] = value.value ? parseInt(value.value) : null;
                    keys[keyBase + '.name'] = value.label || '';
                }
            }
            else if (field.type === 'TEXT+ARRAY') {
                if (Array.isArray(value)) {
                    keys[keyBase + '.val'] = value.map(v => v.label || v.value || v);
                } else {
                    keys[keyBase + '.val'] = [];
                }
            }
            else if (field.type === 'NUMERIC+ARRAY') {
                if (Array.isArray(value)) {
                    keys[keyBase + '.val'] = value.map(v => String(v.label || v.value || v));
                } else {
                    keys[keyBase + '.val'] = [];
                }
            }
            else if (field.type === 'NUMERIC+UNIT+ARRAY') {
                if (value && typeof value === 'object') {
                    keys[keyBase + '.val'] = (value.values || []).map(v => String(v.label || v.value || v));
                    keys[keyBase + '.unit'] = value.unit || '';
                } else {
                    keys[keyBase + '.val'] = [];
                }
            }
        }

        return {
            version: 1,
            pattern: pattern,
            index: groupIndex,
            keys: keys
        };
    }

    /**
     * Validiert Clipboard-Daten für Import
     * Prüft ob Pattern übereinstimmt und Keys kompatibel sind
     */
    function validateClipboardData(clipboardData, targetPattern, targetIndex, containerScope, root) {
        // Prüfe Grundstruktur
        if (!clipboardData || typeof clipboardData !== 'object') {
            return { valid: false, error: 'Ungültiges Datenformat: Kein gültiges JSON-Objekt' };
        }

        if (!clipboardData.keys || typeof clipboardData.keys !== 'object') {
            return { valid: false, error: 'Ungültiges Datenformat: Keine Keys gefunden' };
        }

        if (!clipboardData.pattern) {
            return { valid: false, error: 'Ungültiges Datenformat: Kein Pattern gefunden' };
        }

        // Prüfe ob Pattern übereinstimmt
        if (clipboardData.pattern !== targetPattern) {
            return { valid: false, error: `Pattern stimmt nicht überein: Quelle="${clipboardData.pattern}", Ziel="${targetPattern}"` };
        }

        // Extrahiere Key-Namen aus Clipboard (ohne .val/.unit/.name Suffix)
        const clipboardKeyBases = new Set();
        for (const key of Object.keys(clipboardData.keys)) {
            const match = key.match(/^(.+)\.(val|unit|name)$/);
            if (match) {
                clipboardKeyBases.add(match[1]);
            }
        }

        // Hole Ziel-Felder
        const targetFields = getAllFieldsInGroup(root, targetIndex, containerScope);
        const targetKeyBases = new Set(targetFields.map(f => f.name));

        // Konvertiere Clipboard-Keys zu Ziel-Index
        const sourceIndex = clipboardData.index;
        const convertedClipboardKeys = new Set();
        for (const keyBase of clipboardKeyBases) {
            // Prüfe ob Key mit einem der KEY_PATTERNS beginnt
            let foundPattern = null;
            for (const p of KEY_PATTERNS) {
                if (keyBase.startsWith(p + '_')) {
                    foundPattern = p;
                    break;
                }
            }

            if (!foundPattern) {
                return { valid: false, error: `Ungültiger Key: "${keyBase}" beginnt nicht mit einem gültigen Pattern` };
            }

            // Ersetze Source-Index mit Target-Index
            const regex = new RegExp('^(' + foundPattern + '_)' + sourceIndex + '_(.+)$');
            const match = keyBase.match(regex);
            if (!match) {
                return { valid: false, error: `Ungültiges Key-Format: "${keyBase}"` };
            }

            const convertedKey = match[1] + targetIndex + '_' + match[2];
            convertedClipboardKeys.add(convertedKey);
        }

        // Prüfe ob alle konvertierten Keys in den Ziel-Keys existieren
        for (const key of convertedClipboardKeys) {
            if (!targetKeyBases.has(key)) {
                return { valid: false, error: `Key "${key}" existiert nicht im Ziel` };
            }
        }

        // Prüfe ob alle Ziel-Keys in den Clipboard-Keys existieren
        for (const key of targetKeyBases) {
            // Konvertiere zurück zu Source-Index für Vergleich
            const regex = new RegExp('^(' + targetPattern + '_)' + targetIndex + '_(.+)$');
            const match = key.match(regex);
            if (match) {
                const sourceKey = match[1] + sourceIndex + '_' + match[2];
                if (!clipboardKeyBases.has(sourceKey)) {
                    return { valid: false, error: `Key "${key}" fehlt in den Quelldaten` };
                }
            }
        }

        return { valid: true };
    }

    /**
     * Importiert Clipboard-Daten in eine Gruppe
     */
    async function importClipboardDataToGroup(root, clipboardData, targetIndex, containerScope) {
        const targetPattern = getContainerPattern(containerScope);
        const sourceIndex = clipboardData.index;
        const targetFields = getAllFieldsInGroup(root, targetIndex, containerScope);

        const changes = [];

        for (const field of targetFields) {
            // Konvertiere Ziel-Feldname zu Quell-Feldname
            const regex = new RegExp('^(' + targetPattern + '_)' + targetIndex + '_(.+)$');
            const match = field.name.match(regex);
            if (!match) continue;

            const sourceKeyBase = match[1] + sourceIndex + '_' + match[2];

            // Hole Werte aus Clipboard
            const clipVal = clipboardData.keys[sourceKeyBase + '.val'];
            const clipUnit = clipboardData.keys[sourceKeyBase + '.unit'];
            const clipName = clipboardData.keys[sourceKeyBase + '.name'];

            let value = null;

            if (field.type === 'TEXT') {
                value = clipVal || '';
            }
            else if (field.type === 'NUMERIC') {
                value = clipVal || '';
            }
            else if (field.type === 'NUMERIC+UNIT') {
                value = { value: clipVal || '', unit: clipUnit || '' };
            }
            else if (field.type === 'REFERENCE') {
                if (clipVal !== null && clipVal !== undefined) {
                    value = { value: String(clipVal), label: clipName || '' };
                } else {
                    value = null;
                }
            }
            else if (field.type === 'TEXT+ARRAY') {
                if (Array.isArray(clipVal)) {
                    value = clipVal.map(v => ({ label: String(v), value: String(v) }));
                } else {
                    value = [];
                }
            }
            else if (field.type === 'NUMERIC+ARRAY') {
                if (Array.isArray(clipVal)) {
                    value = clipVal.map(v => ({ label: String(v), value: String(v) }));
                } else {
                    value = [];
                }
            }
            else if (field.type === 'NUMERIC+UNIT+ARRAY') {
                if (Array.isArray(clipVal)) {
                    value = {
                        values: clipVal.map(v => ({ label: String(v), value: String(v) })),
                        unit: clipUnit || ''
                    };
                } else {
                    value = { values: [], unit: clipUnit || '' };
                }
            }

            changes.push({
                fieldName: field.name,
                fieldType: field.type,
                value: value,
                isEmptyValue: false
            });
        }

        await applyFieldChangesInParallel(root, changes);
    }

    /**
     * Kopiert Gruppe ins Clipboard
     */
    async function copyGroupToClipboard(root, groupIndex, containerScope) {
        const exportData = exportGroupToClipboardFormat(root, groupIndex, containerScope);
        const jsonString = JSON.stringify(exportData, null, 2);

        try {
            await navigator.clipboard.writeText(jsonString);
            return true;
        } catch (err) {
            console.error('[sort99] Clipboard write failed:', err);
            alert('Fehler beim Kopieren in die Zwischenablage!');
            return false;
        }
    }

    /**
     * Fügt Clipboard-Daten in Gruppe ein
     */
    async function pasteGroupFromClipboard(root, groupIndex, containerScope) {
        try {
            const clipboardText = await navigator.clipboard.readText();

            let clipboardData;
            try {
                clipboardData = JSON.parse(clipboardText);
            } catch (e) {
                alert('Fehler: Zwischenablage enthält kein gültiges JSON-Format');
                return false;
            }

            const targetPattern = getContainerPattern(containerScope);
            const validation = validateClipboardData(clipboardData, targetPattern, groupIndex, containerScope, root);

            if (!validation.valid) {
                alert('Fehler beim Einfügen:\n' + validation.error);
                return false;
            }

            // Prüfe ob Ziel-Gruppe befüllt ist
            const isEmpty = isGroupEmpty(root, groupIndex, containerScope);

            if (!isEmpty) {
                const confirmed = confirm('Die Zielgruppe enthält bereits Daten.\nMöchten Sie diese überschreiben?');
                if (!confirmed) {
                    return false;
                }
            }

            showSpinner();
            try {
                await importClipboardDataToGroup(root, clipboardData, groupIndex, containerScope);

                // Highlight
                setGroupColorMoving(root, groupIndex, containerScope);
                setTimeout(() => {
                    clearGroupColor(root, groupIndex, containerScope, 800);
                }, 500);

                return true;
            } finally {
                hideSpinner();
            }
        } catch (err) {
            console.error('[sort99] Clipboard read failed:', err);
            alert('Fehler beim Lesen der Zwischenablage!\nBitte erlauben Sie den Zugriff auf die Zwischenablage.');
            return false;
        }
    }

    function isGroupEmpty(root, index, containerScope) {
        const values = getGroupValues(root, index, containerScope);

        for (const fieldName in values) {
            const fieldData = values[fieldName];
            const value = fieldData.value;
            const fieldType = fieldData.type;

            // TEXT: Einfacher String
            if (fieldType === 'TEXT') {
                if (value && value !== '') return false;
            }

            // NUMERIC: Einfacher String
            else if (fieldType === 'NUMERIC') {
                if (value && value !== '') return false;
            }

            // NUMERIC+UNIT: Objekt mit {value, unit}
            else if (fieldType === 'NUMERIC+UNIT') {
                if (value && typeof value === 'object' && value.value && value.value !== '') {
                    return false;
                }
            }

            // REFERENCE: Objekt mit {label, value}
            else if (fieldType === 'REFERENCE') {
                if (value && typeof value === 'object' && (value.label || value.value)) {
                    return false;
                }
            }

            // TEXT+ARRAY, NUMERIC+ARRAY: Array von Objekten
            else if (fieldType === 'TEXT+ARRAY' || fieldType === 'NUMERIC+ARRAY') {
                if (Array.isArray(value) && value.length > 0) {
                    return false;
                }
            }

            // NUMERIC+UNIT+ARRAY: Objekt mit {values: [], unit}
            else if (fieldType === 'NUMERIC+UNIT+ARRAY') {
                if (value && typeof value === 'object' && value.values && value.values.length > 0) {
                    return false;
                }
            }

            // Fallback für unbekannte Typen
            else if (value !== null && value !== undefined && value !== '') {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    if (value.value !== '' && value.value !== null && value.value !== undefined) {
                        return false;
                    }
                    if (value.label || value.value) {
                        return false;
                    }
                } else if (Array.isArray(value)) {
                    if (value.length > 0) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }

        return true;
    }

    // ==================== PARALLELIZED BATCH OPERATIONS ====================

    /**
     * Applies multiple field value changes in parallel
     * @param {Element} root - Root element
     * @param {Array} changes - Array of {fieldName, fieldType, value, isEmptyValue}
     * @returns {Promise<boolean[]>} - Array of results
     */
    async function applyFieldChangesInParallel(root, changes) {
        const promises = changes.map(change =>
            setFieldValue(root, change.fieldName, change.fieldType, change.value, change.isEmptyValue)
        );
        const results = await Promise.all(promises);

        // Entferne changed__field Hervorhebungen nach kurzer Verzögerung
        // (damit React Zeit hat, die Klasse hinzuzufügen, bevor wir sie entfernen)
        setTimeout(() => {
            for (const change of changes) {
                removeChangedFieldHighlightByName(root, change.fieldName);
            }
        }, 50);

        return results;
    }

    /**
     * Clears multiple groups in parallel
     */
    async function clearGroupsInParallel(root, indices, containerScope) {
        const allChanges = [];

        for (const index of indices) {
            const fields = getAllFieldsInGroup(root, index, containerScope);
            for (const field of fields) {
                allChanges.push({
                    fieldName: field.name,
                    fieldType: field.type,
                    value: null,
                    isEmptyValue: true
                });
            }
        }

        await applyFieldChangesInParallel(root, allChanges);
    }

    /**
     * Sets values for multiple groups in parallel
     */
    async function setMultipleGroupValuesInParallel(root, groupDataPairs, containerScope) {
        const allChanges = [];

        for (const pair of groupDataPairs) {
            const { targetIndex, data } = pair;
            const sourceFields = getAllFieldsInGroup(root, targetIndex, containerScope);
            const pattern = sourceFields.length > 0 ? getPatternFromFieldName(sourceFields[0].name) : KEY_PATTERNS[0];

            for (const baseName in data) {
                const fieldName = pattern + '_' + targetIndex + '_' + baseName;
                const fieldData = data[baseName];
                if (fieldData && fieldData.type) {
                    allChanges.push({
                        fieldName: fieldName,
                        fieldType: fieldData.type,
                        value: fieldData.value,
                        isEmptyValue: false
                    });
                }
            }
        }

        await applyFieldChangesInParallel(root, allChanges);
    }

    // ==================== SPINNER ====================
    function showSpinner() {
        let spinner = document.getElementById('referenzanschluss-spinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'referenzanschluss-spinner';
            spinner.className = 'referenzanschluss-spinner';
            spinner.textContent = 'Wird verarbeitet...';
            document.body.appendChild(spinner);
        }
        spinner.classList.add('active');
        isOperationInProgress = true;
    }

    function hideSpinner() {
        const spinner = document.getElementById('referenzanschluss-spinner');
        if (spinner) {
            spinner.classList.remove('active');
        }
        isOperationInProgress = false;
    }

    // ==================== GROUP COLORS ====================

    function getGroupElements(root, groupIndex, container) {
        const elements = [];
        const groups = findGroups(root, container);
        const group = groups.find(g => g.index === groupIndex);

        if (!group) return elements;

        // Find the group header
        const header = group.header.querySelector('.referenzanschluss-group-header');
        if (header) elements.push(header);

        // Find all property elements within this group's properties-grid
        const groupContainer = group.container;
        if (groupContainer) {
            const properties = groupContainer.querySelectorAll(PROPERTY_SELECTOR);
            properties.forEach(prop => elements.push(prop));
        }

        return elements;
    }

    function setGroupColor(root, groupIndex, container, color) {
        const elements = getGroupElements(root, groupIndex, container);
        elements.forEach(el => {
            el.style.backgroundColor = color;
        });
    }

    function clearGroupColor(root, groupIndex, container, delay = 500) {
        setTimeout(() => {
            const elements = getGroupElements(root, groupIndex, container);
            elements.forEach(el => {
                el.style.backgroundColor = '';
            });
        }, delay);
    }

    function setGroupColorSelected(root, groupIndex, container) {
        setGroupColor(root, groupIndex, container, '#FFF8B2');
    }

    function setGroupColorMoving(root, groupIndex, container) {
        setGroupColor(root, groupIndex, container, '#FFC107');
    }

    function setGroupColorDeleting(root, groupIndex, container) {
        setGroupColor(root, groupIndex, container, '#F8D7DA');
    }

    function setGroupColorCreating(root, groupIndex, container) {
        setGroupColor(root, groupIndex, container, '#D4EDDA');
    }

    // ==================== HELPERS ====================
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = CSS_STYLES;
        style.id = 'referenzanschluss-styles';
        document.head.appendChild(style);
    }

    function createButton(id, icon, disabled = false, className = 'referenzanschluss-button') {
        const btn = document.createElement('button');
        btn.id = id;
        btn.className = className;
        btn.textContent = icon;
        btn.disabled = disabled;
        btn.type = 'button';
        return btn;
    }

    // ==================== COPY ICON FOR REFERENZANSCHLUSS ====================

    function addCopyIconsToReferenzanschluss() {
        // Find all list icons (bi-list-ul) - these are present on all reference keys
        const listIcons = document.querySelectorAll('svg.bi-list-ul');

        listIcons.forEach(svg => {
            const listIconLink = svg.closest('a');
            if (!listIconLink) return;

            // Check if we already added a copy icon next to this link
            if (listIconLink.nextElementSibling && listIconLink.nextElementSibling.classList.contains('refanschluss-copy-btn')) {
                // Already has a copy button, check if it should still be visible
                const copyBtn = listIconLink.nextElementSibling;
                const controlContainer = listIconLink.closest('[class*="control"]') || listIconLink.closest('.d-flex');
                if (!controlContainer) return;

                // Find the parent React select container
                const reactSelectContainer = controlContainer.closest('[class*="css-"]');
                if (!reactSelectContainer) return;

                // Check if the field is filled (has singleValue, not placeholder)
                const singleValue = reactSelectContainer.querySelector('[class*="singleValue"]');
                const placeholder = reactSelectContainer.querySelector('[class*="placeholder"]');

                const isFilled = singleValue && !placeholder;

                // Update visibility
                copyBtn.style.display = isFilled ? 'inline-flex' : 'none';
                return;
            }

            // Find the parent container that has the controls
            const controlContainer = listIconLink.closest('[class*="control"]') || listIconLink.closest('.d-flex');
            if (!controlContainer) return;

            // Find the parent React select container
            const reactSelectContainer = controlContainer.closest('[class*="css-"]');
            if (!reactSelectContainer) return;

            // Check if the field is filled (has singleValue, not placeholder)
            const singleValue = reactSelectContainer.querySelector('[class*="singleValue"]');
            const placeholder = reactSelectContainer.querySelector('[class*="placeholder"]');

            const isFilled = singleValue && !placeholder;

            // Find the pencil/edit link to extract the article ID
            const pencilLink = controlContainer.querySelector('a[href*="/kalif/artikel?id="]');
            let articleId = null;

            if (pencilLink) {
                const href = pencilLink.getAttribute('href');
                const match = href.match(/id=(\d+)/);
                if (match) {
                    articleId = match[1];
                }
            }

            // Create the copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'refanschluss-copy-btn btn btn-link btn-sm';
            copyBtn.type = 'button';
            copyBtn.textContent = '⧉';
            copyBtn.title = articleId ? `Artikel-ID ${articleId} kopieren` : 'Artikel-ID kopieren';
            copyBtn.style.display = isFilled ? 'inline-flex' : 'none';

            // Store the article ID on the button for easy access
            if (articleId) {
                copyBtn.dataset.articleId = articleId;
            }

            // Add click handler
            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Re-find the pencil link in case it changed
                const currentPencilLink = controlContainer.querySelector('a[href*="/kalif/artikel?id="]');
                let currentArticleId = this.dataset.articleId;

                if (currentPencilLink) {
                    const href = currentPencilLink.getAttribute('href');
                    const match = href.match(/id=(\d+)/);
                    if (match) {
                        currentArticleId = match[1];
                    }
                }

                if (currentArticleId) {
                    navigator.clipboard.writeText(currentArticleId).then(() => {
                        // Show green flash
                        this.classList.add('copied');
                        setTimeout(() => {
                            this.classList.remove('copied');
                        }, 1000);
                    }).catch(err => {
                        try { console.error('Failed to copy:', err); } catch (e) {}
                    });
                }
            });

            // Insert the copy button after the list icon link
            listIconLink.parentNode.insertBefore(copyBtn, listIconLink.nextSibling);
        });
    }

    function updateCopyIconsVisibility() {
        // Update visibility of all copy icons based on whether their fields are filled
        const copyBtns = document.querySelectorAll('.refanschluss-copy-btn');

        copyBtns.forEach(copyBtn => {
            const controlContainer = copyBtn.closest('[class*="control"]') || copyBtn.closest('.d-flex');
            if (!controlContainer) return;

            const reactSelectContainer = controlContainer.closest('[class*="css-"]');
            if (!reactSelectContainer) return;

            const singleValue = reactSelectContainer.querySelector('[class*="singleValue"]');
            const placeholder = reactSelectContainer.querySelector('[class*="placeholder"]');

            const isFilled = singleValue && !placeholder;

            copyBtn.style.display = isFilled ? 'inline-flex' : 'none';

            // Update the article ID if needed
            const pencilLink = controlContainer.querySelector('a[href*="/kalif/artikel?id="]');
            if (pencilLink) {
                const href = pencilLink.getAttribute('href');
                const match = href.match(/id=(\d+)/);
                if (match) {
                    copyBtn.dataset.articleId = match[1];
                    copyBtn.title = `Artikel-ID ${match[1]} kopieren`;
                }
            }
        });
    }

    // ==================== PHASE 3: STATE MANAGEMENT ====================

    function getContainerCheckboxKey(container) {
        if (!container) return 'global';
        const pattern = getContainerPattern(container) || 'default';
        const allPreviewContainers = document.querySelectorAll(PREVIEW_CONTAINER_SELECTOR);
        let containerIndex = 0;
        for (let i = 0; i < allPreviewContainers.length; i++) {
            const pc = allPreviewContainers[i];
            // Finde den .d-grid Container (überspringe den .row-background mit preview)
            let siblingDGrid = pc.nextElementSibling;
            while (siblingDGrid && !siblingDGrid.classList.contains('d-grid')) {
                siblingDGrid = siblingDGrid.nextElementSibling;
            }
            if (siblingDGrid === container) {
                containerIndex = i;
                break;
            }
        }
        return pattern + '-' + containerIndex;
    }

    function getContainerPattern(container) {
        if (!container) return null;
        for (const pattern of KEY_PATTERNS) {
            if (container.querySelector('[id*="' + pattern + '"]')) {
                return pattern;
            }
        }
        return null;
    }

    function getContainerId(container) {
        if (!container) return 'default';
        // Generate a unique ID based on container position in DOM
        let id = Array.from(document.querySelectorAll(DATA_CONTAINER_SELECTOR)).indexOf(container);
        return 'c' + (id >= 0 ? id : 'unknown');
    }

    function getContainerIndexForDGrid(dGridContainer) {
        if (!dGridContainer) return -1;

        // Finde den zugehörigen previewContainer (ein vorheriges Sibling, überspringe .row-background)
        let prevSibling = dGridContainer.previousElementSibling;
        let previewContainer = null;

        while (prevSibling) {
            if (prevSibling.matches(PREVIEW_CONTAINER_SELECTOR)) {
                previewContainer = prevSibling;
                break;
            }
            prevSibling = prevSibling.previousElementSibling;
        }

        if (!previewContainer) return -1;

        // Finde den Index dieses previewContainers in der Liste aller previewContainers MIT Checkbox
        // (gleiche Logik wie findAllPreviewContainers)
        const allPreviewContainers = document.querySelectorAll(PREVIEW_CONTAINER_SELECTOR);
        let idx = 0;
        for (const row of allPreviewContainers) {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox) {
                if (row === previewContainer) {
                    return idx;
                }
                idx++;
            }
        }
        return -1;
    }

    function getLastFilledGroupIndex(root, containerScope) {
        const groups = findGroups(root, containerScope);
        let lastFilled = 0;

        for (let i = groups.length - 1; i >= 0; i--) {
            if (!isGroupEmpty(root, groups[i].index, containerScope)) {
                lastFilled = groups[i].index;
                break;
            }
        }

        return lastFilled;
    }

    function hasGapBeforeLastFilled(root, containerScope) {
        const groups = findGroups(root, containerScope);
        if (groups.length === 0) return false;

        const lastFilled = getLastFilledGroupIndex(root, containerScope);
        if (lastFilled === 0) return false;

        // Check all actual groups that come before the last filled one
        for (const group of groups) {
            if (group.index < lastFilled && isGroupEmpty(root, group.index, containerScope)) {
                return true;
            }
        }

        return false;
    }

    // ==================== MINIMUM GROUPS VALIDATION ====================

    function countVisibleRefGroupsInContainer(root, container) {
        const groups = findGroups(root, container);
        const refGroups = groups.filter(g => groupHasReferenzanschlussFields(g.container));
        return refGroups.length;
    }

    function shouldShowUIForContainer(root, container) {
        const count = countVisibleRefGroupsInContainer(root, container);
        return count >= 2;
    }

    function removeButtonsFromGroup(groupHeader) {
        const buttonContainer = groupHeader.querySelector('.referenzanschluss-button-container');
        if (buttonContainer) {
            buttonContainer.remove();
        }
        // Restore original header structure if wrapped
        const wrapper = groupHeader.querySelector('.referenzanschluss-group-header');
        if (wrapper) {
            while (wrapper.firstChild) {
                groupHeader.appendChild(wrapper.firstChild);
            }
            wrapper.remove();
        }
    }

    function removeControlPanelForContainer(pattern, containerIndex) {
        const controlPanel = document.querySelector('#group-control-buttons-' + pattern + '-' + containerIndex);
        if (controlPanel) {
            controlPanel.remove();
        }
    }

    function updateUIVisibilityForAllContainers(root) {
        const containers = root.querySelectorAll(DATA_CONTAINER_SELECTOR);
        containers.forEach((container, cIdx) => {
            const pattern = getContainerPattern(container);
            if (!pattern) return;

            const shouldShow = shouldShowUIForContainer(root, container);
            const groups = findGroups(root, container);
            const refGroups = groups.filter(g => groupHasReferenzanschlussFields(g.container));

            if (shouldShow) {
                // Ensure buttons exist for all groups
                let needsRerender = false;
                for (const group of refGroups) {
                    if (!group.header.querySelector('.referenzanschluss-button-container')) {
                        needsRerender = true;
                        break;
                    }
                }

                // Check if control panel exists
                const previewContainers = findAllPreviewContainers(root);
                let controlPanelExists = false;
                previewContainers.forEach((pc, idx) => {
                    let siblingDGrid = pc.nextElementSibling;
                    while (siblingDGrid && !siblingDGrid.classList.contains('d-grid')) {
                        siblingDGrid = siblingDGrid.nextElementSibling;
                    }
                    if (siblingDGrid === container) {
                        const existingPanel = document.querySelector('#group-control-buttons-' + pattern + '-' + idx);
                        if (existingPanel) {
                            controlPanelExists = true;
                        }
                    }
                });

                if (needsRerender || !controlPanelExists) {
                    // Re-render buttons and control panel
                    insertButtonsForContainer(root, container);
                    insertControlButtonsForContainer(root, container);
                    attachAllEventHandlers(root);
                    updateAllButtonStates(root, container);
                }
            } else {
                // Remove buttons from all groups in this container
                for (const group of refGroups) {
                    removeButtonsFromGroup(group.header);
                }

                // Remove control panel
                const previewContainers = findAllPreviewContainers(root);
                previewContainers.forEach((pc, idx) => {
                    let siblingDGrid = pc.nextElementSibling;
                    while (siblingDGrid && !siblingDGrid.classList.contains('d-grid')) {
                        siblingDGrid = siblingDGrid.nextElementSibling;
                    }
                    if (siblingDGrid === container) {
                        removeControlPanelForContainer(pattern, idx);
                    }
                });

                // Clear checkbox states for this container
                const key = getContainerCheckboxKey(container);
            }
        });
    }

    function insertButtonsForContainer(root, container) {
        const groups = findGroups(root, container);
        const refGroups = groups.filter(g => groupHasReferenzanschlussFields(g.container));

        if (refGroups.length < 2) {
            return false;
        }

        let insertedCount = 0;
        const pattern = getContainerPattern(container);

        refGroups.forEach(group => {
            if (group.header.querySelector('.referenzanschluss-button-container')) {
                return;
            }

            const groupHeader = document.createElement('div');
            groupHeader.className = 'referenzanschluss-group-header';

            while (group.header.firstChild) {
                groupHeader.appendChild(group.header.firstChild);
            }

            const buttonContainer = createButtonContainer(root, group.index, refGroups.length, pattern);
            groupHeader.appendChild(buttonContainer);

            group.header.appendChild(groupHeader);
            insertedCount++;
        });

        return insertedCount > 0;
    }

    function insertControlButtonsForContainer(root, container) {
        const previewContainers = findAllPreviewContainers(root);

        if (previewContainers.length === 0) {
            return false;
        }

        const pattern = getContainerPattern(container);
        if (!pattern) return false;

        // Check if container has enough groups
        if (!shouldShowUIForContainer(root, container)) {
            return false;
        }

        let insertedCount = 0;

        previewContainers.forEach((previewContainer, idx) => {
            if (!hasReferenzanschlussFields(previewContainer)) {
                return;
            }

            // Find the sibling d-grid container (skip .row-background preview)
            let siblingDGrid = previewContainer.nextElementSibling;
            while (siblingDGrid && !siblingDGrid.classList.contains('d-grid')) {
                siblingDGrid = siblingDGrid.nextElementSibling;
            }

            if (!siblingDGrid || siblingDGrid !== container) return;

            const containerPattern = getContainerPattern(siblingDGrid);
            if (containerPattern !== pattern) return;

            // Check if control buttons already exist
            const existingControlBtns = document.querySelector('#group-control-buttons-' + pattern + '-' + idx);
            if (existingControlBtns) return;

            // Find the btn-group inside previewContainer (new structure)
            const btnGroup = previewContainer.querySelector('.btn-group');
            if (!btnGroup) return;

            const controlButtons = createControlButtonsContainer(pattern, idx);
            // Insert before the btn-group
            btnGroup.parentNode.insertBefore(controlButtons, btnGroup);
            insertedCount++;
        });

        return insertedCount > 0;
    }

    // ==================== PHASE 3: GROUP OPERATIONS ====================

    function getMaxAvailableGroupIndex(root, containerScope) {
        const searchRoot = containerScope || root;
        const labels = searchRoot.querySelectorAll('label[for*="_"]');
        let maxIndex = 0;

        for (const label of labels) {
            const fieldName = label.getAttribute('for');
            const pattern = getPatternFromFieldName(fieldName);
            if (!pattern) continue;
            const match = fieldName.match(new RegExp('^' + pattern + '_(\\d+)_'));
            if (match) {
                const index = parseInt(match[1]);
                if (index > maxIndex) {
                    maxIndex = index;
                }
            }
        }
        return maxIndex;
    }

    async function clickAddGroupButton(root, containerScope) {
        const initialMaxIndex = getMaxAvailableGroupIndex(root, containerScope);
        const key = getContainerCheckboxKey(containerScope);

        // Der "Gruppe hinzufügen" Button ist im preview-container (.template-row) im .btn-group
        let button = null;

        // Suche rückwärts durch die Siblings bis wir den .template-row finden
        let templateRow = containerScope.previousElementSibling;
        while (templateRow) {
            if (templateRow.matches(PREVIEW_CONTAINER_SELECTOR)) {
                // Gefunden! Suche den Button in diesem template-row
                const buttons = templateRow.querySelectorAll('button');
                for (let btn of buttons) {
                    if (btn.textContent && btn.textContent.trim().includes('Gruppe hinzufügen')) {
                        button = btn;
                        break;
                    }
                }
                break;
            }
            templateRow = templateRow.previousElementSibling;
        }

        if (!button) {
            try { console.error('clickAddGroupButton: Button "Gruppe hinzufügen" nicht gefunden für Container', containerScope); } catch (e) {}
            return false;
        }

        button.click();

        return await new Promise(function(resolve) {
            let attempts = 0;
            const checkInterval = setInterval(function() {
                const newMaxIndex = getMaxAvailableGroupIndex(root, containerScope);
                if (newMaxIndex > initialMaxIndex) {
                    clearInterval(checkInterval);

                    // Highlight the newly created group
                    setGroupColorCreating(root, newMaxIndex, containerScope);

                    // Nach erfolgreichem Hinzufügen: Container neu finden und UI aktualisieren
                    setTimeout(() => {
                        const allContainers = document.querySelectorAll(DATA_CONTAINER_SELECTOR);
                        let freshContainer = null;
                        for (let i = 0; i < allContainers.length; i++) {
                            const containerKey = getContainerCheckboxKey(allContainers[i]);
                            if (containerKey === key) {
                                freshContainer = allContainers[i];
                                break;
                            }
                        }

                        if (freshContainer) {
                            attachAllEventHandlers(root);

                            setTimeout(() => {
                                updateAllButtonStates(root, freshContainer);

                                // Clear color for newly created group
                                clearGroupColor(root, newMaxIndex, freshContainer, 800);

                                // Update copy icons
                                addCopyIconsToReferenzanschluss();

                                hideSpinner();
                            }, 500);
                        } else {
                            hideSpinner();
                        }
                    }, 500);
                    resolve(true);
                }
                attempts++;
                if (attempts > 20) {
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, 100);
        });
    }

    async function clearGroup(root, index, containerScope) {
        // Highlight group being deleted
        setGroupColorDeleting(root, index, containerScope);

        const fields = getAllFieldsInGroup(root, index, containerScope);

        // Collect all changes
        const changes = fields.map(field => ({
            fieldName: field.name,
            fieldType: field.type,
            value: null,
            isEmptyValue: true
        }));

        // Apply all changes in parallel
        await applyFieldChangesInParallel(root, changes);

        // Clear color after deletion
        clearGroupColor(root, index, containerScope, 800);

        // Update copy icons visibility
        setTimeout(() => {
            updateCopyIconsVisibility();
        }, 300);
    }

    async function insertNewGroupAfter(root, groupIndex, containerScope) {
        // Wrapper für insertMultipleGroupsAfter mit count=1
        showSpinner();
        try {
            await insertMultipleGroupsAfter(root, groupIndex, 1, containerScope);
        } finally {
            hideSpinner();
        }
    }

    async function insertMultipleGroupsAfter(root, groupIndex, count, containerScope) {
        // Fügt 'count' neue leere Gruppen nach groupIndex ein und verschiebt ALLE nachfolgenden Gruppen
        const key = getContainerCheckboxKey(containerScope);

        try {
            // Erstelle 'count' neue Gruppen am Ende
            for (let i = 0; i < count; i++) {
                const success = await clickAddGroupButton(root, containerScope);
                if (!success) {
                    alert('Fehler: Neue Gruppe konnte nicht erstellt werden.');
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // Aktualisiere maxIndex nach dem Erstellen
            const newMaxIndex = getMaxAvailableGroupIndex(root, containerScope);

            // Sammle alle Daten der Gruppen die verschoben werden müssen (von groupIndex bis newMaxIndex - count)
            // Diese müssen um 'count' Positionen nach unten verschoben werden
            // ALLE Gruppen werden verschoben, auch leere
            const groupDataToShift = [];
            for (let i = newMaxIndex - count; i >= groupIndex; i--) {
                groupDataToShift.push({
                    sourceIndex: i,
                    targetIndex: i + count,
                    data: getGroupValues(root, i, containerScope)
                });
            }

            // Wende alle Verschiebungen parallel an (von hinten nach vorne, um Überschreibungen zu vermeiden)
            const shiftChanges = [];
            for (const shift of groupDataToShift) {
                const sourceFields = getAllFieldsInGroup(root, shift.targetIndex, containerScope);
                const pattern = sourceFields.length > 0 ? getPatternFromFieldName(sourceFields[0].name) : KEY_PATTERNS[0];

                // Highlight Quell- und Zielgruppe
                setGroupColorMoving(root, shift.sourceIndex, containerScope);
                setGroupColorMoving(root, shift.targetIndex, containerScope);

                for (const baseName in shift.data) {
                    const fieldName = pattern + '_' + shift.targetIndex + '_' + baseName;
                    const fieldData = shift.data[baseName];
                    if (fieldData.type) {
                        shiftChanges.push({
                            fieldName: fieldName,
                            fieldType: fieldData.type,
                            value: fieldData.value,
                            isEmptyValue: false
                        });
                    }
                }
            }

            await applyFieldChangesInParallel(root, shiftChanges);

            // Lösche die Quellgruppen (die jetzt die neuen leeren Gruppen werden)
            const clearIndices = [];
            for (let i = groupIndex; i < groupIndex + count; i++) {
                clearIndices.push(i);
                setGroupColorCreating(root, i, containerScope);
            }

            await clearGroupsInParallel(root, clearIndices, containerScope);

            // UI aktualisieren
            await new Promise(resolve => setTimeout(resolve, 150));
            updateUIVisibilityForAllContainers(root);
            await new Promise(resolve => setTimeout(resolve, 300));

            // Finde Container neu nach DOM-Update
            const allContainers = document.querySelectorAll(DATA_CONTAINER_SELECTOR);
            let freshContainer = containerScope;
            for (let i = 0; i < allContainers.length; i++) {
                const containerKey = getContainerCheckboxKey(allContainers[i]);
                if (containerKey === key) {
                    freshContainer = allContainers[i];
                    break;
                }
            }

            attachAllEventHandlers(root);
            await new Promise(resolve => setTimeout(resolve, 500));

            updateAllButtonStates(root, freshContainer);

            // Clear colors
            for (const shift of groupDataToShift) {
                clearGroupColor(root, shift.sourceIndex, freshContainer, 800);
                clearGroupColor(root, shift.targetIndex, freshContainer, 800);
            }
            for (let i = groupIndex; i < groupIndex + count; i++) {
                clearGroupColor(root, i, freshContainer, 800);
            }

            addCopyIconsToReferenzanschluss();

        } catch (error) {
            console.error('[sort99] insertMultipleGroupsAfter error:', error);
            alert('Fehler beim Einfügen der Gruppen!');
        }
    }

    // ==================== SWAP VALIDATION ====================

    function getRawFieldsInGroup(root, groupIndex, containerScope) {
        // Returns raw field data with original field names for validation
        const fields = [];
        const searchRoot = containerScope || root;
        const containerPattern = containerScope ? getContainerPattern(containerScope) : null;

        const allLabels = searchRoot.querySelectorAll('label[for*="_' + groupIndex + '_"]');

        for (let i = 0; i < allLabels.length; i++) {
            const label = allLabels[i];
            const fieldName = label.getAttribute('for');
            if (!fieldName) continue;

            const pattern = getPatternFromFieldName(fieldName);
            if (!pattern) continue;
            if (containerPattern && pattern !== containerPattern) continue;

            // Extract index from field name
            const indexMatch = fieldName.match(new RegExp('^' + pattern + '_(\\d+)_(.+)$'));
            if (!indexMatch) continue;

            const extractedIndex = parseInt(indexMatch[1]);
            const baseName = indexMatch[2];

            fields.push({
                name: fieldName,
                pattern: pattern,
                index: extractedIndex,
                baseName: baseName
            });
        }

        return fields;
    }

    function validateSwapStructure(root, index1, index2, containerScope) {
        const fields1 = getRawFieldsInGroup(root, index1, containerScope);
        const fields2 = getRawFieldsInGroup(root, index2, containerScope);

        // Check 1: Same number of keys
        if (fields1.length !== fields2.length) {
            return {
                valid: false,
                reason: 'Key-Anzahl unterschiedlich'
            };
        }

        // Check 2: All keys in group 1 have consistent index
        const indices1 = fields1.map(f => f.index);
        const uniqueIndices1 = [...new Set(indices1)];
        if (uniqueIndices1.length > 1) {
            return {
                valid: false,
                reason: 'Inkonsistenter Index in Gruppe #' + index1
            };
        }

        // Check 3: All keys in group 2 have consistent index
        const indices2 = fields2.map(f => f.index);
        const uniqueIndices2 = [...new Set(indices2)];
        if (uniqueIndices2.length > 1) {
            return {
                valid: false,
                reason: 'Inkonsistenter Index in Gruppe #' + index2
            };
        }

        // Check 4: Same base names in same order
        const baseNames1 = fields1.map(f => f.baseName);
        const baseNames2 = fields2.map(f => f.baseName);

        for (let i = 0; i < baseNames1.length; i++) {
            if (baseNames1[i] !== baseNames2[i]) {
                return {
                    valid: false,
                    reason: 'Key-Namen oder Reihenfolge unterschiedlich'
                };
            }
        }

        // Check 5: Same patterns in same order
        const patterns1 = fields1.map(f => f.pattern);
        const patterns2 = fields2.map(f => f.pattern);

        for (let i = 0; i < patterns1.length; i++) {
            if (patterns1[i] !== patterns2[i]) {
                return {
                    valid: false,
                    reason: 'Pattern unterschiedlich'
                };
            }
        }

        return { valid: true };
    }

    async function swapGroups(root, index1, index2, containerScope) {
        try {
            // Validate structure before swap
            const validation = validateSwapStructure(root, index1, index2, containerScope);
            if (!validation.valid) {
                alert('Swap nicht möglich: Ungültige Key-Struktur in Gruppe #' + index1 + ' und Gruppe #' + index2);
                return false;
            }

            // Highlight groups being swapped
            setGroupColorMoving(root, index1, containerScope);
            setGroupColorMoving(root, index2, containerScope);

            const v1 = getGroupValues(root, index1, containerScope);
            const v2 = getGroupValues(root, index2, containerScope);

            const allKeys = {};
            for (const key in v1) allKeys[key] = true;
            for (const key in v2) allKeys[key] = true;

            // Collect all changes for both groups
            const allChanges = [];

            // Changes for group 1 (gets values from v2)
            for (const baseName in allKeys) {
                const sourceFields = getAllFieldsInGroup(root, index1, containerScope);
                const pattern = sourceFields.length > 0 ? getPatternFromFieldName(sourceFields[0].name) : KEY_PATTERNS[0];
                const fieldName = pattern + '_' + index1 + '_' + baseName;
                const fieldData = v2[baseName] || { type: v1[baseName].type, value: null };
                if (fieldData.type) {
                    allChanges.push({
                        fieldName: fieldName,
                        fieldType: fieldData.type,
                        value: fieldData.value,
                        isEmptyValue: false
                    });
                }
            }

            // Changes for group 2 (gets values from v1)
            for (const baseName in allKeys) {
                const sourceFields = getAllFieldsInGroup(root, index2, containerScope);
                const pattern = sourceFields.length > 0 ? getPatternFromFieldName(sourceFields[0].name) : KEY_PATTERNS[0];
                const fieldName = pattern + '_' + index2 + '_' + baseName;
                const fieldData = v1[baseName] || { type: v2[baseName].type, value: null };
                if (fieldData.type) {
                    allChanges.push({
                        fieldName: fieldName,
                        fieldType: fieldData.type,
                        value: fieldData.value,
                        isEmptyValue: false
                    });
                }
            }

            // Apply all changes in parallel
            await applyFieldChangesInParallel(root, allChanges);

            // Clear colors after swap
            clearGroupColor(root, index1, containerScope, 800);
            clearGroupColor(root, index2, containerScope, 800);

            // Update copy icons visibility
            setTimeout(() => {
                updateCopyIconsVisibility();
            }, 300);

            return true;
        } catch (error) {
            return false;
        }
    }

    async function defragmentGroupsInContainer(root, container) {
        if (isSwappingInProgress) {
            return;
        }

        isSwappingInProgress = true;
        showSpinner();
        try {
            // Hole die tatsächlich vorhandenen Gruppen (sortiert nach Index)
            const groups = findGroups(root, container);
            if (groups.length === 0) {
                hideSpinner();
                isSwappingInProgress = false;
                return;
            }

            // Sortiere nach Index
            groups.sort((a, b) => a.index - b.index);

            // Extrahiere die tatsächlichen Indizes
            const actualIndices = groups.map(g => g.index);

            // Finde die erste Lücke: eine leere Gruppe vor einer gefüllten Gruppe
            let firstGapIndex = null;
            let lastFilledIndex = null;

            // Finde den letzten gefüllten Index
            for (let i = actualIndices.length - 1; i >= 0; i--) {
                if (!isGroupEmpty(root, actualIndices[i], container)) {
                    lastFilledIndex = actualIndices[i];
                    break;
                }
            }

            if (lastFilledIndex === null) {
                // Keine gefüllten Gruppen
                hideSpinner();
                isSwappingInProgress = false;
                return;
            }

            // Finde die erste leere Gruppe VOR der letzten gefüllten
            for (const idx of actualIndices) {
                if (idx >= lastFilledIndex) break;
                if (isGroupEmpty(root, idx, container)) {
                    firstGapIndex = idx;
                    break;
                }
            }

            if (firstGapIndex === null) {
                // Keine Lücken gefunden
                hideSpinner();
                isSwappingInProgress = false;
                return;
            }

            // Sammle alle gefüllten Gruppen ab der ersten Lücke
            const filledGroupsAfterGap = [];
            for (const idx of actualIndices) {
                if (idx >= firstGapIndex && !isGroupEmpty(root, idx, container)) {
                    filledGroupsAfterGap.push({
                        index: idx,
                        data: getGroupValues(root, idx, container)
                    });
                }
            }

            // Sammle alle Indizes ab der ersten Lücke bis zum Ende
            const indicesToClear = actualIndices.filter(idx => idx >= firstGapIndex);

            await clearGroupsInParallel(root, indicesToClear, container);

            await new Promise(resolve => setTimeout(resolve, 150));

            // Berechne die Ziel-Indizes: fortlaufend ab firstGapIndex
            // Aber nur für Indizes, die tatsächlich existieren!
            const availableTargetIndices = actualIndices.filter(idx => idx >= firstGapIndex);

            // Set values for target groups in parallel
            const groupDataPairs = [];
            for (let i = 0; i < filledGroupsAfterGap.length && i < availableTargetIndices.length; i++) {
                const targetIndex = availableTargetIndices[i];
                const sourceIndex = filledGroupsAfterGap[i].index;

                // Highlight source and target groups during move
                setGroupColorMoving(root, sourceIndex, container);
                setGroupColorMoving(root, targetIndex, container);

                groupDataPairs.push({
                    targetIndex: targetIndex,
                    data: filledGroupsAfterGap[i].data
                });
            }

            await setMultipleGroupValuesInParallel(root, groupDataPairs, container);

            // Clear highlighting for all groups
            for (let i = 0; i < filledGroupsAfterGap.length && i < availableTargetIndices.length; i++) {
                const targetIndex = availableTargetIndices[i];
                const sourceIndex = filledGroupsAfterGap[i].index;
                clearGroupColor(root, sourceIndex, container, 800);
                clearGroupColor(root, targetIndex, container, 800);
            }

            // Die restlichen Gruppen am Ende sind bereits leer (wurden mit clearGroupsInParallel gelöscht)

            await new Promise(resolve => setTimeout(resolve, 150));

            updateAllButtonStates(root, container);

            setTimeout(() => {
                updateUIVisibilityForAllContainers(root);
                attachAllEventHandlers(root);
                updateAllButtonStates(root, container);

                // Update copy icons
                addCopyIconsToReferenzanschluss();
            }, 200);

            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            alert('Fehler beim Defragmentieren!');
        } finally {
            isSwappingInProgress = false;
            hideSpinner();
        }
    }

    // ==================== PHASE 3: BUTTON STATE MANAGEMENT ====================

    function updateDeleteButtonState(root, index, container) {
        const pattern = getContainerPattern(container) || 'default';
        const deleteBtn = container.querySelector('#delete-group-' + pattern + '-' + index);
        if (!deleteBtn) return;

        const isEmpty = isGroupEmpty(root, index, container);

        if (isEmpty) {
            deleteBtn.disabled = true;
            deleteBtn.style.opacity = '0.3';
            deleteBtn.style.cursor = 'not-allowed';
            deleteBtn.style.background = '#ccc';
        } else {
            deleteBtn.disabled = false;
            deleteBtn.style.opacity = '1';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.background = '#dc3545';
        }
    }

    function updateSingleGroupButtons(root, container, controlPanel) {
        if (!root || !container) return;

        const pattern = getContainerPattern(container);
        if (!pattern) return;

        const groups = findGroups(root, container);
        const refGroups = groups.filter(g => groupHasReferenzanschlussFields(g.container));

        if (refGroups.length === 0) return;

        // Get controlPanel from container's data attribute if not provided
        if (!controlPanel) {
            controlPanel = container.__controlPanel;
        }

        // Fallback: Ermittle controlPanel basierend auf containerIndex
        if (!controlPanel) {
            const containerIndex = getContainerIndexForDGrid(container);
            if (containerIndex >= 0) {
                controlPanel = document.querySelector('#group-control-buttons-' + pattern + '-' + containerIndex);
            }
        }

        for (let i = 0; i < refGroups.length; i++) {
            const group = refGroups[i];
            const isFirstInContainer = i === 0;
            const isLastInContainer = i === refGroups.length - 1;

            const upBtn = container.querySelector(`#up-group-${pattern}-${group.index}`);
            const downBtn = container.querySelector(`#down-group-${pattern}-${group.index}`);
            const insertBtn = container.querySelector(`#insert-group-${pattern}-${group.index}`);
            const insert3Btn = container.querySelector(`#insert3-group-${pattern}-${group.index}`);

            if (upBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                const previousGroupEmpty = !isFirstInContainer && isGroupEmpty(root, refGroups[i - 1].index, container);
                const bothEmpty = currentGroupEmpty && previousGroupEmpty;

                const shouldDisable = isFirstInContainer || bothEmpty;
                upBtn.disabled = shouldDisable;
                if (shouldDisable) {
                    upBtn.style.background = '#ccc';
                    upBtn.style.opacity = '0.3';
                    upBtn.style.cursor = 'not-allowed';
                } else {
                    upBtn.style.background = '#007bff';
                    upBtn.style.opacity = '1';
                    upBtn.style.cursor = 'pointer';
                }
            }

            if (downBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                const nextGroupEmpty = !isLastInContainer && isGroupEmpty(root, refGroups[i + 1].index, container);
                const bothEmpty = currentGroupEmpty && nextGroupEmpty;

                const shouldDisable = isLastInContainer || bothEmpty;
                downBtn.disabled = shouldDisable;
                if (shouldDisable) {
                    downBtn.style.background = '#ccc';
                    downBtn.style.opacity = '0.3';
                    downBtn.style.cursor = 'not-allowed';
                } else {
                    downBtn.style.background = '#007bff';
                    downBtn.style.opacity = '1';
                    downBtn.style.cursor = 'pointer';
                }
            }

            if (insertBtn) {
                insertBtn.disabled = false;
                insertBtn.style.background = '#007bff';
                insertBtn.style.opacity = '1';
                insertBtn.style.cursor = 'pointer';
            }

            if (insert3Btn) {
                insert3Btn.disabled = false;
                insert3Btn.style.background = '#007bff';
                insert3Btn.style.opacity = '1';
                insert3Btn.style.cursor = 'pointer';
            }

            // Copy button - disabled if group is empty
            const copyBtn = container.querySelector(`#copy-group-${pattern}-${group.index}`);
            if (copyBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                copyBtn.disabled = currentGroupEmpty;
                if (currentGroupEmpty) {
                    copyBtn.style.background = '#eee';
                    copyBtn.style.border = '1px solid #ccc';
                    copyBtn.style.opacity = '0.3';
                    copyBtn.style.cursor = 'not-allowed';
                } else {
                    copyBtn.style.background = 'white';
                    copyBtn.style.border = '1px solid #555';
                    copyBtn.style.opacity = '1';
                    copyBtn.style.cursor = 'pointer';
                }
            }

            // Cut button - disabled if group is empty
            const cutBtn = container.querySelector(`#cut-group-${pattern}-${group.index}`);
            if (cutBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                cutBtn.disabled = currentGroupEmpty;
                if (currentGroupEmpty) {
                    cutBtn.style.background = '#eee';
                    cutBtn.style.border = '1px solid #ccc';
                    cutBtn.style.opacity = '0.3';
                    cutBtn.style.cursor = 'not-allowed';
                } else {
                    cutBtn.style.background = 'white';
                    cutBtn.style.border = '1px solid #555';
                    cutBtn.style.opacity = '1';
                    cutBtn.style.cursor = 'pointer';
                }
            }

            // Paste button - always enabled
            const pasteBtn = container.querySelector(`#paste-group-${pattern}-${group.index}`);
            if (pasteBtn) {
                pasteBtn.disabled = false;
                pasteBtn.style.background = 'white';
                pasteBtn.style.border = '1px solid #555';
                pasteBtn.style.opacity = '1';
                pasteBtn.style.cursor = 'pointer';
            }
        }
    }

    function updateAllButtonStates(root, container) {
        if (!root || !container) return;

        const pattern = getContainerPattern(container);
        if (!pattern) {
            return;
        }

        if (!shouldShowUIForContainer(root, container)) {
            return;
        }

        const groups = findGroups(root, container);
        const refGroups = groups.filter(g => groupHasReferenzanschlussFields(g.container));

        if (refGroups.length === 0) {
            return;
        }

        for (let i = 0; i < refGroups.length; i++) {
            const group = refGroups[i];
            const isFirstInContainer = i === 0;
            const isLastInContainer = i === refGroups.length - 1;

            const upBtn = container.querySelector(`#up-group-${pattern}-${group.index}`);
            const downBtn = container.querySelector(`#down-group-${pattern}-${group.index}`);
            const insertBtn = container.querySelector(`#insert-group-${pattern}-${group.index}`);
            const insert3Btn = container.querySelector(`#insert3-group-${pattern}-${group.index}`);

            if (upBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                const previousGroupEmpty = !isFirstInContainer && isGroupEmpty(root, refGroups[i - 1].index, container);
                const bothEmpty = currentGroupEmpty && previousGroupEmpty;

                const shouldDisable = isFirstInContainer || bothEmpty;
                upBtn.disabled = shouldDisable;
                upBtn.style.opacity = shouldDisable ? '0.3' : '1';
                upBtn.style.cursor = shouldDisable ? 'not-allowed' : 'pointer';
                upBtn.style.pointerEvents = shouldDisable ? 'none' : 'auto';
                upBtn.style.background = shouldDisable ? '#ccc' : '#007bff';
            }

            if (downBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                const nextGroupEmpty = !isLastInContainer && isGroupEmpty(root, refGroups[i + 1].index, container);
                const bothEmpty = currentGroupEmpty && nextGroupEmpty;

                const shouldDisable = isLastInContainer || bothEmpty;
                downBtn.disabled = shouldDisable;
                downBtn.style.opacity = shouldDisable ? '0.3' : '1';
                downBtn.style.cursor = shouldDisable ? 'not-allowed' : 'pointer';
                downBtn.style.pointerEvents = shouldDisable ? 'none' : 'auto';
                downBtn.style.background = shouldDisable ? '#ccc' : '#007bff';
            }

            if (insertBtn) {
                insertBtn.disabled = false;
                insertBtn.style.opacity = '1';
                insertBtn.style.cursor = 'pointer';
                insertBtn.style.pointerEvents = 'auto';
                insertBtn.style.background = '#007bff';
            }

            if (insert3Btn) {
                insert3Btn.disabled = false;
                insert3Btn.style.opacity = '1';
                insert3Btn.style.cursor = 'pointer';
                insert3Btn.style.pointerEvents = 'auto';
                insert3Btn.style.background = '#007bff';
            }

            // Copy button - disabled if group is empty
            const copyBtn = container.querySelector(`#copy-group-${pattern}-${group.index}`);
            if (copyBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                copyBtn.disabled = currentGroupEmpty;
                copyBtn.style.opacity = currentGroupEmpty ? '0.3' : '1';
                copyBtn.style.cursor = currentGroupEmpty ? 'not-allowed' : 'pointer';
                copyBtn.style.pointerEvents = currentGroupEmpty ? 'none' : 'auto';
                copyBtn.style.background = currentGroupEmpty ? '#eee' : 'white';
                copyBtn.style.border = currentGroupEmpty ? '1px solid #ccc' : '1px solid #555';
            }

            // Cut button - disabled if group is empty
            const cutBtn = container.querySelector(`#cut-group-${pattern}-${group.index}`);
            if (cutBtn) {
                const currentGroupEmpty = isGroupEmpty(root, group.index, container);
                cutBtn.disabled = currentGroupEmpty;
                cutBtn.style.opacity = currentGroupEmpty ? '0.3' : '1';
                cutBtn.style.cursor = currentGroupEmpty ? 'not-allowed' : 'pointer';
                cutBtn.style.pointerEvents = currentGroupEmpty ? 'none' : 'auto';
                cutBtn.style.background = currentGroupEmpty ? '#eee' : 'white';
                cutBtn.style.border = currentGroupEmpty ? '1px solid #ccc' : '1px solid #555';
            }

            // Paste button - always enabled
            const pasteBtn = container.querySelector(`#paste-group-${pattern}-${group.index}`);
            if (pasteBtn) {
                pasteBtn.disabled = false;
                pasteBtn.style.opacity = '1';
                pasteBtn.style.cursor = 'pointer';
                pasteBtn.style.pointerEvents = 'auto';
                pasteBtn.style.background = 'white';
                pasteBtn.style.border = '1px solid #555';
            }
        }

        for (let group of groups) {
            updateDeleteButtonState(root, group.index, container);
        }

        // Update defrag button
        const containerIndex = getContainerIndexForDGrid(container);
        const defragBtn = containerIndex >= 0
            ? document.querySelector('#defrag-btn-' + pattern + '-' + containerIndex)
            : null;

        if (defragBtn) {
            const hasGap = hasGapBeforeLastFilled(root, container);
            defragBtn.disabled = !hasGap;
            defragBtn.style.background = !hasGap ? COLOR_DISABLED : COLOR_DEFRAG;
            defragBtn.style.opacity = !hasGap ? '0.3' : '1';
        }

        updateSingleGroupButtons(root, container);
    }

    // ==================== PHASE 3: EVENT HANDLERS ====================


    function attachAllEventHandlers(root) {

        // Attach event handlers to "Gruppe hinzufügen" buttons (in btn-group)
        const addGroupButtons = document.querySelectorAll('.btn-group button');
        addGroupButtons.forEach(btn => {
            if (btn.textContent && btn.textContent.trim().includes('Gruppe hinzufügen')) {
                if (!btn.__addGroupHandlerAttached) {
                    btn.__addGroupHandlerAttached = true;
                    btn.addEventListener('click', function() {
                        setTimeout(() => {
                            updateUIVisibilityForAllContainers(root);
                            attachAllEventHandlers(root);
                            addCopyIconsToReferenzanschluss();
                        }, 500);
                    });
                }
            }
        });

        // Attach button event handlers
        const containers = document.querySelectorAll(DATA_CONTAINER_SELECTOR);
        containers.forEach(container => {
            const pattern = getContainerPattern(container);
            if (!pattern) return;

            const groups = findGroups(root, container);
            const refGroups = groups.filter(g => groupHasReferenzanschlussFields(g.container));

            refGroups.forEach(group => {
                const upBtn = container.querySelector(`#up-group-${pattern}-${group.index}`);

                // Finde den echten Up-Button (der mit dem "↑" Text)
                let actualUpBtn = upBtn;
                if (!upBtn) {
                    const buttons = group.header.querySelectorAll('.referenzanschluss-button');
                    for (let btn of buttons) {
                        if (btn.textContent === '↑') {
                            actualUpBtn = btn;
                            break;
                        }
                    }
                }

                if (actualUpBtn && !actualUpBtn.__handlerAttached) {
                    actualUpBtn.__handlerAttached = true;
                    actualUpBtn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));

                        const clickedGroups = findGroups(root, container);
                        const clickedRefGroups = clickedGroups.filter(g => groupHasReferenzanschlussFields(g.container));

                        const currentIdx = clickedRefGroups.findIndex(g => g.index === groupIndexFromBtn);
                        if (currentIdx <= 0) {
                            alert('Bereits die erste Gruppe!');
                            return;
                        }

                        const targetGroup = clickedRefGroups[currentIdx - 1];
                        showSpinner();
                        const swapSuccess = await swapGroups(root, groupIndexFromBtn, targetGroup.index, container);
                        hideSpinner();
                        if (swapSuccess) {
                            updateAllButtonStates(root, container);
                        }
                    });
                }

                const downBtn = container.querySelector(`#down-group-${pattern}-${group.index}`);

                // Finde den echten Down-Button (der mit dem "↓" Text)
                let actualDownBtn = downBtn;
                if (!downBtn) {
                    const buttons = group.header.querySelectorAll('.referenzanschluss-button');
                    for (let btn of buttons) {
                        if (btn.textContent === '↓') {
                            actualDownBtn = btn;
                            break;
                        }
                    }
                }

                if (actualDownBtn && !actualDownBtn.__handlerAttached) {
                    actualDownBtn.__handlerAttached = true;
                    actualDownBtn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));

                        const clickedGroups = findGroups(root, container);
                        const clickedRefGroups = clickedGroups.filter(g => groupHasReferenzanschlussFields(g.container));

                        const currentIdx = clickedRefGroups.findIndex(g => g.index === groupIndexFromBtn);
                        if (currentIdx >= clickedRefGroups.length - 1) {
                            alert('Bereits die letzte Gruppe!');
                            return;
                        }

                        const targetGroup = clickedRefGroups[currentIdx + 1];
                        showSpinner();
                        const swapSuccess = await swapGroups(root, groupIndexFromBtn, targetGroup.index, container);
                        hideSpinner();
                        if (swapSuccess) {
                            updateAllButtonStates(root, container);
                        }
                    });
                }

                const insertBtn = container.querySelector(`#insert-group-${pattern}-${group.index}`);
                if (insertBtn && !insertBtn.__handlerAttached) {
                    insertBtn.__handlerAttached = true;
                    insertBtn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));
                        await insertNewGroupAfter(root, groupIndexFromBtn, container);
                    });
                }

                const insert3Btn = container.querySelector(`#insert3-group-${pattern}-${group.index}`);
                if (insert3Btn && !insert3Btn.__handlerAttached) {
                    insert3Btn.__handlerAttached = true;
                    insert3Btn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));
                        showSpinner();
                        try {
                            await insertMultipleGroupsAfter(root, groupIndexFromBtn, 3, container);
                        } finally {
                            hideSpinner();
                        }
                    });
                }

                const deleteBtn = container.querySelector(`#delete-group-${pattern}-${group.index}`);
                if (deleteBtn && !deleteBtn.__handlerAttached) {
                    deleteBtn.__handlerAttached = true;
                    deleteBtn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));
                        await clearGroup(root, groupIndexFromBtn, container);
                        updateDeleteButtonState(root, groupIndexFromBtn, container);
                        updateAllButtonStates(root, container);
                    });
                }

                const copyBtn = container.querySelector(`#copy-group-${pattern}-${group.index}`);
                if (copyBtn && !copyBtn.__handlerAttached) {
                    copyBtn.__handlerAttached = true;
                    copyBtn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));
                        const success = await copyGroupToClipboard(root, groupIndexFromBtn, container);
                        if (success) {
                            // Kurzes visuelles Feedback
                            const originalText = this.textContent;
                            this.textContent = '✓';
                            setTimeout(() => {
                                this.textContent = originalText;
                            }, 1000);
                        }
                    });
                }

                const cutBtn = container.querySelector(`#cut-group-${pattern}-${group.index}`);
                if (cutBtn && !cutBtn.__handlerAttached) {
                    cutBtn.__handlerAttached = true;
                    cutBtn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));
                        const success = await copyGroupToClipboard(root, groupIndexFromBtn, container);
                        if (success) {
                            // Kurzes visuelles Feedback
                            const originalText = this.textContent;
                            this.textContent = '✓';
                            // Lösche die Gruppe nach dem Kopieren
                            await clearGroup(root, groupIndexFromBtn, container);
                            updateAllButtonStates(root, container);
                            setTimeout(() => {
                                this.textContent = originalText;
                            }, 1000);
                        }
                    });
                }

                const pasteBtn = container.querySelector(`#paste-group-${pattern}-${group.index}`);
                if (pasteBtn && !pasteBtn.__handlerAttached) {
                    pasteBtn.__handlerAttached = true;
                    pasteBtn.addEventListener('click', async function() {
                        const groupIndexFromBtn = parseInt(this.getAttribute('data-group'));
                        const success = await pasteGroupFromClipboard(root, groupIndexFromBtn, container);
                        if (success) {
                            updateAllButtonStates(root, container);
                        }
                    });
                }
            });
        });

        // Attach handlers for control panel buttons
        const previewContainers = document.querySelectorAll(PREVIEW_CONTAINER_SELECTOR);
        previewContainers.forEach((previewContainer) => {
            const controlPanel = previewContainer.querySelector('[class*="group-control-buttons"]');
            if (!controlPanel) return;

            const defragBtn = controlPanel.querySelector('.defrag-btn');
            if (defragBtn && !defragBtn.__handlerAttached) {
                defragBtn.__handlerAttached = true;
                defragBtn.addEventListener('click', async function() {
                    let groupGrid = null;
                    let nextSibling = previewContainer.nextElementSibling;
                    while (nextSibling && !nextSibling.classList.contains('d-grid')) {
                        nextSibling = nextSibling.nextElementSibling;
                    }
                    groupGrid = nextSibling;

                    if (groupGrid) await defragmentGroupsInContainer(root, groupGrid);
                });
            }
        });
    }

    // ==================== PHASE 1: EINGABEBEREICH ====================

    function findGroups(root, containerScope) {
        const groups = [];
        const searchRoot = containerScope || root;

        // Neue Struktur: Gruppen-Header sind .p-1.fw-bold.row-background innerhalb des .d-grid
        // und enthalten nur die Nummer (z.B. " 1", " 7")
        let headers;
        if (containerScope) {
            // Nur direkte Kinder des containerScope, die fw-bold und row-background sind
            headers = Array.from(searchRoot.children).filter(el =>
                el.classList.contains('p-1') &&
                el.classList.contains('fw-bold') &&
                el.classList.contains('row-background')
            );
        } else {
            headers = searchRoot.querySelectorAll(GROUP_HEADER_SELECTOR);
        }

        headers.forEach((header, index) => {
            // Das nächste Sibling sollte das properties-grid sein
            let container = header.nextElementSibling;

            // Überspringe 1px Separator-Divs falls vorhanden
            while (container && container.style && container.style.height === '1px') {
                container = container.nextElementSibling;
            }

            if (container && container.classList.contains('properties-grid')) {
                let groupIndex = null;
                let firstLabel = null;
                for (const pattern of KEY_PATTERNS) {
                    firstLabel = container.querySelector('label[for^="' + pattern + '_"]');
                    if (firstLabel) break;
                }

                if (firstLabel) {
                    const fieldName = firstLabel.getAttribute('for');
                    const pattern = getPatternFromFieldName(fieldName);
                    if (pattern) {
                        const match = fieldName.match(new RegExp('^' + pattern + '_(\\d+)_'));
                        if (match) {
                            groupIndex = parseInt(match[1]);
                        }
                    }
                }

                if (groupIndex === null) {
                    // Fallback: Parse die Nummer aus dem Header-Text
                    const headerText = header.textContent.trim();
                    const numMatch = headerText.match(/(\d+)/);
                    if (numMatch) {
                        groupIndex = parseInt(numMatch[1]);
                    } else {
                        groupIndex = index + 1;
                    }
                }

                // Finde den parent d-grid Container
                let parentDGrid = header.closest(DATA_CONTAINER_SELECTOR);

                groups.push({
                    index: groupIndex,
                    header: header,
                    container: container,
                    parentDGrid: parentDGrid
                });
            }
        });

        return groups;
    }

    function getContainerForElement(element) {
        let current = element;
        let lastValidContainer = null;

        while (current && current !== document) {
            if (current.classList && current.classList.contains('d-grid')) {
                let hasPatternField = false;
                for (const pattern of KEY_PATTERNS) {
                    if (current.querySelector('[id*="' + pattern + '"]')) {
                        hasPatternField = true;
                        break;
                    }
                }
                if (hasPatternField) {
                    lastValidContainer = current;
                }
            }
            current = current.parentElement;
        }

        return lastValidContainer;
    }

    function createButtonContainer(root, groupIndex, totalGroups, pattern = 'default') {
        const container = document.createElement('div');
        container.className = 'referenzanschluss-button-container';

        const downBtn = createButton(`down-group-${pattern}-${groupIndex}`, '↓', false);
        downBtn.className = 'referenzanschluss-button sort-button-single';
        downBtn.setAttribute('data-pattern', pattern);
        downBtn.setAttribute('data-group', groupIndex);
        downBtn.title = 'Gruppe nach unten verschieben (mit nächster tauschen)';
        container.appendChild(downBtn);

        const upBtn = createButton(`up-group-${pattern}-${groupIndex}`, '↑', false);
        upBtn.className = 'referenzanschluss-button sort-button-single';
        upBtn.setAttribute('data-pattern', pattern);
        upBtn.setAttribute('data-group', groupIndex);
        upBtn.title = 'Gruppe nach oben verschieben (mit vorheriger tauschen)';
        container.appendChild(upBtn);

        const insertBtn = createButton(`insert-group-${pattern}-${groupIndex}`, '+1');
        insertBtn.className = 'referenzanschluss-button sort-button-single';
        insertBtn.setAttribute('data-pattern', pattern);
        insertBtn.setAttribute('data-group', groupIndex);
        insertBtn.title = '1 neue leere Gruppe an dieser Position einfügen';
        container.appendChild(insertBtn);

        const insert3Btn = createButton(`insert3-group-${pattern}-${groupIndex}`, '+3');
        insert3Btn.className = 'referenzanschluss-button sort-button-single';
        insert3Btn.setAttribute('data-pattern', pattern);
        insert3Btn.setAttribute('data-group', groupIndex);
        insert3Btn.title = '3 neue leere Gruppen an dieser Position einfügen';
        container.appendChild(insert3Btn);

        const deleteBtn = createButton(`delete-group-${pattern}-${groupIndex}`, '×');
        deleteBtn.className = 'referenzanschluss-button delete-button-single';
        deleteBtn.setAttribute('data-pattern', pattern);
        deleteBtn.setAttribute('data-group', groupIndex);
        deleteBtn.title = 'Gruppeninhalt löschen';
        deleteBtn.style.fontSize = '16px';
        container.appendChild(deleteBtn);

        const copyBtn = createButton(`copy-group-${pattern}-${groupIndex}`, '🗐');
        copyBtn.className = 'referenzanschluss-button clipboard-button-single';
        copyBtn.setAttribute('data-pattern', pattern);
        copyBtn.setAttribute('data-group', groupIndex);
        copyBtn.title = 'Gruppe kopieren';
        copyBtn.style.background = 'white';
        copyBtn.style.border = '1px solid #555';
        copyBtn.style.color = '#333';
        container.appendChild(copyBtn);

        const cutBtn = createButton(`cut-group-${pattern}-${groupIndex}`, '✂️');
        cutBtn.className = 'referenzanschluss-button clipboard-button-single';
        cutBtn.setAttribute('data-pattern', pattern);
        cutBtn.setAttribute('data-group', groupIndex);
        cutBtn.title = 'Gruppe ausschneiden';
        cutBtn.style.background = 'white';
        cutBtn.style.border = '1px solid #555';
        cutBtn.style.color = '#333';
        container.appendChild(cutBtn);

        const pasteBtn = createButton(`paste-group-${pattern}-${groupIndex}`, '📥');
        pasteBtn.className = 'referenzanschluss-button clipboard-button-single';
        pasteBtn.setAttribute('data-pattern', pattern);
        pasteBtn.setAttribute('data-group', groupIndex);
        pasteBtn.title = 'Gruppe einfügen';
        pasteBtn.style.background = 'white';
        pasteBtn.style.border = '1px solid #555';
        pasteBtn.style.color = '#333';
        container.appendChild(pasteBtn);

        return container;
    }

    function insertButtons(root) {
        try {
            const containers = root.querySelectorAll(DATA_CONTAINER_SELECTOR);
            let totalInsertedCount = 0;

            containers.forEach(container => {
                const pattern = getContainerPattern(container);
                if (!pattern) return;

                // Check if container has at least 2 groups
                if (!shouldShowUIForContainer(root, container)) {
                    return;
                }

                const groups = findGroups(root, container);
                const refGroups = groups.filter(g => groupHasReferenzanschlussFields(g.container));

                if (refGroups.length < 2) {
                    return;
                }

                refGroups.forEach(group => {
                    if (group.header.querySelector('.referenzanschluss-button-container')) {
                        return;
                    }

                    const groupHeader = document.createElement('div');
                    groupHeader.className = 'referenzanschluss-group-header';

                    while (group.header.firstChild) {
                        groupHeader.appendChild(group.header.firstChild);
                    }

                    const buttonContainer = createButtonContainer(root, group.index, refGroups.length, pattern);
                    groupHeader.appendChild(buttonContainer);

                    group.header.appendChild(groupHeader);
                    totalInsertedCount++;
                });
            });

            return totalInsertedCount > 0;
        } catch (error) {
            return false;
        }
    }

    // ==================== PHASE 2: PREVIEW BEREICH ====================

    function groupHasReferenzanschlussFields(propertiesGrid) {
        if (!propertiesGrid) return false;

        let anyRefField = null;
        for (const pattern of KEY_PATTERNS) {
            anyRefField = propertiesGrid.querySelector('[id*="' + pattern + '"]');
            if (anyRefField) break;
        }

        if (anyRefField) {
            return true;
        } else {
            return false;
        }
    }

    function hasReferenzanschlussFields(previewContainer) {
        if (!previewContainer) {
            return false;
        }

        // Finde den d-grid Container (überspringe .row-background preview)
        let nextSibling = previewContainer.nextElementSibling;

        while (nextSibling && !nextSibling.classList.contains('d-grid')) {
            nextSibling = nextSibling.nextElementSibling;
        }

        if (!nextSibling) {
            return false;
        }

        let anyRefField = null;
        for (const pattern of KEY_PATTERNS) {
            anyRefField = nextSibling.querySelector('[id*="' + pattern + '"]');
            if (anyRefField) break;
        }

        if (anyRefField) {
            return true;
        } else {
            return false;
        }
    }

    function findAllPreviewContainers(root) {
        const containers = [];
        const allRows = root.querySelectorAll(PREVIEW_CONTAINER_SELECTOR);

        for (const row of allRows) {
            // In der neuen Struktur haben die Preview-Container eine Checkbox
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox) {
                const title = row.querySelector('strong');
                const titleText = title ? title.textContent : 'unbekannt';
                containers.push(row);
            }
        }

        return containers;
    }

    function createControlButtonsContainer(pattern, containerIndex) {
        const container = document.createElement('div');
        container.id = 'group-control-buttons-' + pattern + '-' + containerIndex;
        container.className = 'group-control-buttons-' + pattern;

        const middleRow = document.createElement('div');
        middleRow.className = 'button-row-middle';

        const defragBtn = document.createElement('button');
        defragBtn.className = 'defrag-btn btn btn-sm';
        defragBtn.id = 'defrag-btn-' + pattern + '-' + containerIndex;
        defragBtn.textContent = 'Lücken schließen';
        defragBtn.type = 'button';
        defragBtn.title = 'Leere Gruppen zwischen befüllten Gruppen entfernen';
        defragBtn.disabled = true;
        defragBtn.style.padding = '3px 8px';
        defragBtn.style.fontSize = '11px';
        defragBtn.style.background = '#ccc';
        defragBtn.style.color = 'white';
        defragBtn.style.border = 'none';
        defragBtn.style.borderRadius = '3px';
        defragBtn.style.opacity = '0.3';
        middleRow.appendChild(defragBtn);

        container.appendChild(middleRow);

        return container;
    }

    function insertControlButtons(root) {
        const previewContainers = findAllPreviewContainers(root);

        if (previewContainers.length === 0) {
            return false;
        }

        try {
            let insertedCount = 0;

            previewContainers.forEach((previewContainer, idx) => {
                if (!hasReferenzanschlussFields(previewContainer)) {
                    return;
                }

                // Find the sibling d-grid container to get the correct pattern
                let siblingDGrid = previewContainer.nextElementSibling;
                while (siblingDGrid && !siblingDGrid.classList.contains('d-grid')) {
                    siblingDGrid = siblingDGrid.nextElementSibling;
                }

                if (!siblingDGrid) return;

                const pattern = getContainerPattern(siblingDGrid);
                if (!pattern) return;

                // Check if container has at least 2 groups
                if (!shouldShowUIForContainer(root, siblingDGrid)) {
                    return;
                }

                // Check if control buttons for THIS pattern already exist
                const existingControlBtns = document.querySelector('#group-control-buttons-' + pattern + '-' + idx);
                if (existingControlBtns) return;

                const controlButtons = createControlButtonsContainer(pattern, idx);

                // Panel immer im Header vor btn-group einfügen
                const btnGroup = previewContainer.querySelector('.btn-group');
                if (!btnGroup) return;
                btnGroup.parentNode.insertBefore(controlButtons, btnGroup);

                insertedCount++;
            });

            if (insertedCount > 0) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Stellt sicher, dass alle Control-Panels existieren und im Header sind
     * Erstellt Panels neu wenn sie von React gelöscht wurden
     * @param {Element} root - Root-Element
     */
    function ensureControlPanels(root) {
        const previewContainers = findAllPreviewContainers(root);

        previewContainers.forEach((previewContainer, idx) => {
            if (!hasReferenzanschlussFields(previewContainer)) {
                return;
            }

            // Find the sibling d-grid container to get the correct pattern
            let siblingDGrid = previewContainer.nextElementSibling;
            while (siblingDGrid && !siblingDGrid.classList.contains('d-grid')) {
                siblingDGrid = siblingDGrid.nextElementSibling;
            }

            if (!siblingDGrid) return;

            const pattern = getContainerPattern(siblingDGrid);
            if (!pattern) return;

            // Check if container has at least 2 groups
            if (!shouldShowUIForContainer(root, siblingDGrid)) {
                return;
            }

            // Find existing control panel
            const panelId = 'group-control-buttons-' + pattern + '-' + idx;
            let controlPanel = document.querySelector('#' + panelId);

            // Wenn Panel nicht gefunden, neu erstellen (React hat es gelöscht)
            if (!controlPanel) {
                controlPanel = createControlButtonsContainer(pattern, idx);

                // Panel im Header vor btn-group einfügen
                const btnGroup = previewContainer.querySelector('.btn-group');
                if (btnGroup && btnGroup.parentNode) {
                    btnGroup.parentNode.insertBefore(controlPanel, btnGroup);
                }
            }
        });

        // Event Handler aktualisieren
        attachAllEventHandlers(root);

        // Button-States aktualisieren
        const containers = document.querySelectorAll(DATA_CONTAINER_SELECTOR);
        containers.forEach(container => {
            if (shouldShowUIForContainer(root, container)) {
                updateAllButtonStates(root, container);
            }
        });
    }

    // ==================== PHASE 3: MUTATION OBSERVER ====================

    function startMutationObserver(root) {
        const observer = new MutationObserver(function(mutations) {
            if (isSwappingInProgress) {
                return;
            }

            let hasNewGroups = false;
            let hasFieldChanges = false;
            const addedGroupContainers = [];

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    const newGroupsInMutation = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === 1) {
                            return node.classList && (node.classList.contains('properties-grid') ||
                                   node.querySelector && (() => {
                                       for (const p of KEY_PATTERNS) {
                                           if (node.querySelector('[id*="' + p + '"]')) return true;
                                       }
                                       return false;
                                   })());
                        }
                        return false;
                    });

                    if (newGroupsInMutation) {
                        hasNewGroups = true;
                        // Identify newly added group elements
                        Array.from(mutation.addedNodes).forEach(node => {
                            if (node.nodeType === 1 && node.classList && node.classList.contains('properties-grid')) {
                                // This is a new group container (properties-grid)
                                addedGroupContainers.push(node);
                            } else if (node.nodeType === 1 && node.querySelector) {
                                // Check if this node contains new properties-grid elements
                                const propGrids = node.querySelectorAll('.properties-grid');
                                propGrids.forEach(pg => addedGroupContainers.push(pg));
                            }
                        });
                    }
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // Check if this is a React select value change (placeholder <-> singleValue)
                    const target = mutation.target;
                    if (target.classList && (target.classList.contains('css-kmdooj-singleValue') ||
                                             target.classList.contains('css-1jqq78o-placeholder'))) {
                        hasFieldChanges = true;
                    }
                }
            }

            if (hasNewGroups) {
                setTimeout(() => {
                    // Use the new unified update function
                    updateUIVisibilityForAllContainers(root);
                    attachAllEventHandlers(root);
                    const containers = document.querySelectorAll(DATA_CONTAINER_SELECTOR);
                    containers.forEach(container => {
                        if (shouldShowUIForContainer(root, container)) {
                            updateAllButtonStates(root, container);
                        }
                    });

                    // Update copy icons
                    addCopyIconsToReferenzanschluss();

                    // Wait longer for DOM to fully update before highlighting
                    setTimeout(() => {
                        // Highlight newly added groups
                        addedGroupContainers.forEach(addedPropertiesGrid => {
                            // Find the header element that precedes this properties-grid
                            let header = addedPropertiesGrid.previousElementSibling;
                            while (header && !header.classList.contains('fw-bold')) {
                                header = header.previousElementSibling;
                            }

                            if (header) {
                                // Find the parent .d-grid container
                                let parentContainer = header.closest(DATA_CONTAINER_SELECTOR);

                                if (parentContainer) {
                                    // Find all groups in this container
                                    const groups = findGroups(root, parentContainer);

                                    // Find the group that has this properties-grid as container
                                    const matchingGroup = groups.find(g => g.container === addedPropertiesGrid);

                                    if (matchingGroup) {
                                        // Apply green highlight
                                        setGroupColorCreating(root, matchingGroup.index, parentContainer);
                                        // Clear after delay
                                        clearGroupColor(root, matchingGroup.index, parentContainer, 2000);
                                    }
                                }
                            }
                        });
                    }, 100);
                }, 500);
            } else if (hasFieldChanges) {
                // Field values changed - update button states
                setTimeout(() => {
                    const containers = document.querySelectorAll(DATA_CONTAINER_SELECTOR);
                    containers.forEach(container => {
                        if (shouldShowUIForContainer(root, container)) {
                            updateAllButtonStates(root, container);
                        }
                    });
                }, 100);
            }
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
            characterData: false
        });

    }

    // ==================== INITIALISIERUNG ====================

    /**
     * Wartet auf das Erscheinen eines DOM-Elements mit Timeout
     * @param {string} selector - CSS Selector
     * @param {number} timeout - Timeout in ms (default: 30000)
     * @param {number} interval - Prüfintervall in ms (default: 500)
     * @returns {Promise<Element|null>}
     */
    function waitForElement(selector, timeout = 30000, interval = 500) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    resolve(null);
                    return;
                }

                setTimeout(check, interval);
            };

            check();
        });
    }

    /**
     * Wartet auf React-Container mit Referenzanschluss-Feldern
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<boolean>}
     */
    async function waitForReactContainers(timeout = 30000) {
        const startTime = Date.now();
        const interval = 500;

        while (Date.now() - startTime < timeout) {
            // Prüfe ob mindestens ein Container mit Referenzanschluss-Feldern existiert
            for (const pattern of KEY_PATTERNS) {
                const element = document.querySelector(`[id*="${pattern}"]`);
                if (element) {
                    // Zusätzlich prüfen ob der d-grid Container existiert
                    const dGrid = document.querySelector(DATA_CONTAINER_SELECTOR);
                    if (dGrid) {
                        return true;
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, interval));
        }

        return false;
    }

    async function init() {
        try {
            injectCSS();

            let root = document.documentElement;
            cachedRoot = root;

            // Warte auf React-Container bevor Initialisierung startet
            const containersReady = await waitForReactContainers(30000);

            if (!containersReady) {
                // Starte trotzdem MutationObserver um späteres Laden zu erfassen
                startMutationObserver(root);
                return;
            }

            let phase1Success = false;
            let phase2Success = false;
            const delays = [100, 500, 1000, 2000, 3000, 5000];

            for (const delay of delays) {
                await new Promise(resolve => setTimeout(resolve, delay));

                if (!phase1Success) {
                    phase1Success = insertButtons(root);
                }
                if (!phase2Success) {
                    phase2Success = insertControlButtons(root);
                }

                if (phase1Success && phase2Success) {
                    break;
                }
            }

            if (phase1Success) {
                attachAllEventHandlers(root);
                startMutationObserver(root);
                const containers = document.querySelectorAll(DATA_CONTAINER_SELECTOR);
                containers.forEach(container => {
                    if (shouldShowUIForContainer(root, container)) {
                        updateAllButtonStates(root, container);
                    }
                });

                // Add copy icons to Referenzanschluss fields
                addCopyIconsToReferenzanschluss();

                // Set up a periodic check for copy icons and control panels
                setInterval(() => {
                    addCopyIconsToReferenzanschluss();
                    updateCopyIconsVisibility();

                    // Stelle sicher dass Control-Panels existieren (React kann sie löschen)
                    // MUSS vor updateAllButtonStates aufgerufen werden!
                    ensureControlPanels(root);
                }, 2000);
            } else {
                // Falls Initialisierung fehlschlägt, starte trotzdem MutationObserver
                startMutationObserver(root);
            }

        } catch (error) {
            try { console.error('Referenzanschluss-Sortierer Init-Fehler:', error); } catch (e) {}
        }
    }

    init();

})();