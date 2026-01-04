// ==UserScript==
// @name         Ajuda Cart Batch Selector
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Select cart items based on layer rules with vertical and function selection and memory
// @author       MajaBukvic
// @match        https://ajuda.a2z.com/cms.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550365/Ajuda%20Cart%20Batch%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/550365/Ajuda%20Cart%20Batch%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COMMON_CONFIGS = {
        layers: {
            US_AE_JP_IN_TR_AU_SE_SG_DE: ['US', 'AE', 'JP', 'IN', 'TR', 'AU', 'SE', 'SG', 'DE'],
            TSE_Common: ['US', 'AE', 'EG', 'SA', 'AU', 'BE', 'IE', 'NL', 'PL', 'SE', 'SG', 'MX', 'BR', 'CA', 'ES', 'FR', 'IT', 'JP', 'DE', 'IN', 'TR', 'UK']
        },
        primaryLayers: {
            US_Only: ['US'],
            US_UK: ['US', 'UK'],
            TSE_Common: ['UK', 'AE', 'BE', 'MX', 'NL', 'PL', 'SE', 'TR']
        },
        secondaryLayers: {
            TSE_Common: ['US', 'AE', 'EG', 'SA', 'AU', 'BE', 'IE', 'NL', 'PL', 'SE', 'SG', 'MX', 'BR', 'CA', 'ES', 'FR', 'IT', 'JP', 'DE', 'IN', 'TR']
        }
    };

    const VERTICAL_CONFIGS = {
        TSI: {
            name: "Trust and Store Integrity (TSI)",
            functions: {
                SIV: {
                    name: "Seller Identity Verification (SIV)",
                    layers: ['US', 'AE', 'JP', 'IN', 'TR', 'AU', 'SA', 'SE', 'SG'],
                    primaryLayers: COMMON_CONFIGS.primaryLayers.US_Only,
                    secondaryLayers: ['AE', 'EG', 'SA', 'JP', 'IN', 'TR', 'AU', 'SE', 'SG']
                },
                IPV: {
                    name: "In-person Verification (IPV)",
                    layers: ['US', 'AE', 'DE', 'ES', 'MX', 'BE', 'FR', 'IN', 'IT', 'JP', 'KR', 'NL', 'PL', 'BR', 'SE', 'TH', 'TR', 'VN', 'CN', 'TW'],
                    primaryLayers: COMMON_CONFIGS.primaryLayers.US_Only,
                    secondaryLayers: ['AE', 'DE', 'ES', 'MX', 'BE', 'FR', 'IN', 'IT', 'JP', 'KR', 'NL', 'PL', 'BR', 'SE', 'TH', 'TR', 'VN', 'CN', 'TW']
                },
                TT: {
                    name: "Transaction Trust (TT)",
                    layers: ['US', 'ES', 'MX', 'SE', 'PL', 'CN', 'DE', 'FR', 'IT', 'JP', 'AE', 'NL', 'TR'],
                    primaryLayers: COMMON_CONFIGS.primaryLayers.US_Only,
                    secondaryLayers: ['ES', 'MX', 'SE', 'PL', 'CN', 'DE', 'FR', 'IT', 'JP', 'AE', 'NL', 'TR']
                },
                'EU KYC': {
                    name: "EU Know Your Customer (KYC)",
                    layers: ['US', 'AE'],
                    primaryLayers: COMMON_CONFIGS.primaryLayers.US_Only,
                    secondaryLayers: ['AE', 'SA']
                },
                'ROW KYC': {
                    name: "ROW Know Your Customer (KYC)",
                    layers: ['US', 'JP'],
                    primaryLayers: COMMON_CONFIGS.primaryLayers.US_Only,
                    secondaryLayers: ['JP']
                },
                SAM: {
                    name: "Suspicious Activity Monitoring (SAM)",
                    layers: ['AE', 'AU', 'BE', 'BR', 'CA', 'DE', 'EG', 'ES', 'FR', 'IE', 'IN', 'IT', 'JP', 'MX', 'NL', 'PL', 'SA', 'SE', 'SG', 'TR', 'UK', 'US', 'ZA'],
                    primaryLayers: ['BE', 'MX'],
                    secondaryLayers: ['AE', 'AU', 'BR', 'CA', 'DE', 'EG', 'ES', 'FR', 'IE', 'IN', 'IT', 'JP', 'MX', 'NL', 'PL', 'SA', 'SE', 'SG', 'TR', 'UK', 'US', 'ZA']
                },
                DAC7: {
                    name: "DAC7",
                    layers: ['AE', 'AU', 'BE', 'BR', 'CA', 'DE', 'EG', 'ES', 'FR', 'IN', 'IT', 'JP', 'MX', 'NL', 'PL', 'SA', 'SE', 'SG', 'TR', 'US', 'UK'],
                    primaryLayers: ['UK'],
                    secondaryLayers: ['AE', 'AU', 'BE', 'BR', 'CA', 'DE', 'EG', 'ES', 'FR', 'IN', 'IT', 'JP', 'MX', 'NL', 'PL', 'SA', 'SE', 'SG', 'TR', 'US']
                },
                VAT: {
                    name: "Value Added Tax (VAT)",
                    layers: ['BE', 'BR', 'DE', 'EG', 'FR', 'IT', 'IN', 'TR', 'US', 'JP'],
                    primaryLayers: ['US', 'JP'],
                    secondaryLayers: ['BE', 'BR', 'DE', 'EG', 'FR', 'IT', 'IN', 'TR']
                }
            }
        },
        TSE: {
            name: "Trusted Seller Experience (TSE)",
            functions: {
                PQ: {
                    name: "Product Quality (PQ)",
                    layers: COMMON_CONFIGS.layers.TSE_Common,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.TSE_Common,
                    secondaryLayers: COMMON_CONFIGS.secondaryLayers.TSE_Common
                },
                RA: {
                    name: "Reported Abuse (RA)",
                    layers: COMMON_CONFIGS.layers.TSE_Common,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.TSE_Common,
                    secondaryLayers: COMMON_CONFIGS.secondaryLayers.TSE_Common
                },
                AtoZ: {
                    name: "A-to-z Guarantee Claims seller-facing (Claims-seller)",
                    layers: COMMON_CONFIGS.layers.TSE_Common,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.TSE_Common,
                    secondaryLayers: COMMON_CONFIGS.secondaryLayers.TSE_Common
                },
                SAP: {
                    name: "Sales Abuse Prevention (SAP)",
                    layers: COMMON_CONFIGS.layers.TSE_Common,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.TSE_Common,
                    secondaryLayers: COMMON_CONFIGS.secondaryLayers.TSE_Common
                },
                RPSA: {
                    name: "Restricted Product Seller Appeals (RPSA)",
                    layers: COMMON_CONFIGS.layers.TSE_Common,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.TSE_Common,
                    secondaryLayers: COMMON_CONFIGS.secondaryLayers.TSE_Common
                },
                PAT: {
                    name: "Product Authentication Team (PAT)",
                    layers: COMMON_CONFIGS.layers.TSE_Common,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.TSE_Common,
                    secondaryLayers: COMMON_CONFIGS.secondaryLayers.TSE_Common
                },
                CERT: {
                    name: "Certification Team (CERT)",
                    layers: COMMON_CONFIGS.layers.TSE_Common,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.TSE_Common,
                    secondaryLayers: COMMON_CONFIGS.secondaryLayers.TSE_Common
                },
                APAY_Seller: {
                    name: "APAY Seller",
                    layers: ['US', 'DE', 'ES', 'FR', 'IN', 'IT', 'JP', 'UK'],
                    primaryLayers: ['UK', 'US'],
                    secondaryLayers: ['US', 'DE', 'ES', 'FR', 'IN', 'IT', 'JP']
                },
                FP: {
                    name: "Fraud Prevention (FP)",
                    layers: COMMON_CONFIGS.layers.US_AE_JP_IN_TR_AU_SE_SG_DE,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.US_Only,
                    secondaryLayers: ['UK', 'DE', 'FR']
                }
            }
        },
        Buyer: {
            name: "Buyer",
            functions: {
                CatalogRisk: {
                    name: "Catalog Risk",
                    layers: COMMON_CONFIGS.layers.US_AE_JP_IN_TR_AU_SE_SG_DE,
                    primaryLayers: COMMON_CONFIGS.primaryLayers.US_UK,
                    secondaryLayers: ['US', 'UK', 'DE', 'FR']
                },
                BuyerRiskInvestigations: {
                    name: "Buyer Risk Investigations",
                    layers: COMMON_CONFIGS.layers.US_AE_JP_IN_TR_AU_SE_SG_DE,
                    primaryLayers: ['US', 'CA'],
                    secondaryLayers: ['US', 'CA', 'MX']
                }
            }
        }
    };

    let selectedVertical = null;
    let selectedFunction = null;

    function saveSelections(vertical, func) {
        localStorage.setItem('selectedVertical', vertical);
        localStorage.setItem('selectedFunction', func);
    }

    function loadSelections() {
        return {
            vertical: localStorage.getItem('selectedVertical'),
            function: localStorage.getItem('selectedFunction')
        };
    }

    function createBatchButton() {
        const button = document.createElement('button');
        button.textContent = 'Batch Selector';
        button.className = 'btn btn-info';
        button.style.marginLeft = '5px';

        const bulkOperations = document.querySelector('.bulk-operations');
        if (bulkOperations) {
            const deleteButton = bulkOperations.querySelector('.btn-warning');
            if (deleteButton) {
                deleteButton.parentNode.insertAdjacentElement('afterend', button);
            } else {
                bulkOperations.appendChild(button);
            }
        }

        button.addEventListener('click', handleBatchSelection);
    }

    function parseObjectId(text) {
        const match = text.match(/([^\/]+)\/Published\/([^\/]+)\/([^\/]+)/);
        return match ? { id: match[1], layer: match[2], locale: match[3] } : null;
    }

    function simulateClick(element) {
        if (!element) return;
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    function groupBlurbs() {
        const rows = document.querySelectorAll('#version-list tbody tr');
        const groups = {};

        Array.from(rows).forEach(element => {
            const blurbName = element.querySelector('td:nth-child(2) div:first-child').textContent;
            const objInfo = parseObjectId(element.querySelector('.sub-text').textContent);

            if (objInfo && selectedFunction.layers.includes(objInfo.layer)) {
                if (!groups[blurbName]) {
                    groups[blurbName] = {
                        versions: []
                    };
                }
                groups[blurbName].versions.push({
                    element: element,
                    layer: objInfo.layer,
                    locale: objInfo.locale,
                    id: objInfo.id
                });
            }
        });

        return groups;
    }

    function selectBatch(isPrimary) {
        const groups = groupBlurbs();
        const toSelect = new Set();

        Object.entries(groups).forEach(([blurbName, group]) => {
            if (isPrimary) {
                // Primary selection: ONLY select primary layers
                selectedFunction.primaryLayers.forEach(layer => {
                    const layerVersions = group.versions.filter(v => v.layer === layer);
                    if (layerVersions.length > 0) {
                        toSelect.add(layerVersions[0].element);
                    }
                });
            } else {
                // Secondary selection: select ALL layers in secondaryLayers, including primary layers if they're listed
                selectedFunction.secondaryLayers.forEach(layer => {
                    const layerVersions = group.versions.filter(v => v.layer === layer);
                    if (layerVersions.length > 0) {
                        toSelect.add(layerVersions[0].element);
                    }
                });
            }
        });

        // First uncheck all checkboxes
        document.querySelectorAll('#version-list tbody tr input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) simulateClick(checkbox);
        });

        // Then select the ones we want
        toSelect.forEach(element => {
            let checkbox = element.querySelector('input[type="checkbox"]');
            if (!checkbox.checked) simulateClick(checkbox);
        });
    }

    function updateFunctionSelect(verticalKey) {
        const functionSelect = document.getElementById('functionSelect');
        functionSelect.innerHTML = '';
        const savedSelections = loadSelections();

        if (verticalKey && VERTICAL_CONFIGS[verticalKey]) {
            const functions = VERTICAL_CONFIGS[verticalKey].functions;
            Object.entries(functions).forEach(([key, config]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = config.name;
                if (savedSelections.function === key) {
                    option.selected = true;
                }
                functionSelect.appendChild(option);
            });
            functionSelect.disabled = false;
            selectedFunction = functions[savedSelections.function] || functions[Object.keys(functions)[0]];
        } else {
            functionSelect.disabled = true;
            selectedFunction = null;
        }
    }

    function handleBatchSelection() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 1001;
            border-radius: 4px;
            min-width: 300px;
        `;

        const savedSelections = loadSelections();

        let html = `
            <div style="margin-bottom: 15px;">
                <label for="verticalSelect">Select Vertical:</label>
                <select id="verticalSelect" class="form-control" style="margin-bottom: 10px;">
                    ${Object.entries(VERTICAL_CONFIGS).map(([key, config]) =>
                                                           `<option value="${key}" ${savedSelections.vertical === key ? 'selected' : ''}>${config.name}</option>`
                    ).join('')}
                </select>

                <label for="functionSelect">Select Function:</label>
                <select id="functionSelect" class="form-control">
                </select>
            </div>
            <div style="text-align: center;">
                <button id="selectPrimary" class="btn btn-primary" style="margin: 5px;">Select Primary Batch</button><br>
                <button id="selectSecondary" class="btn btn-info" style="margin: 5px;">Select Secondary Batch</button><br>
                <button id="closeDialog" class="btn" style="margin: 5px;">Close</button>
            </div>
        `;

        dialog.innerHTML = html;
        document.body.appendChild(dialog);

        const verticalSelect = document.getElementById('verticalSelect');
        updateFunctionSelect(savedSelections.vertical || verticalSelect.value);

        verticalSelect.onchange = (e) => {
            selectedVertical = VERTICAL_CONFIGS[e.target.value];
            updateFunctionSelect(e.target.value);
            saveSelections(e.target.value, document.getElementById('functionSelect').value);
        };

        document.getElementById('functionSelect').onchange = (e) => {
            const verticalKey = verticalSelect.value;
            selectedFunction = VERTICAL_CONFIGS[verticalKey].functions[e.target.value];
            saveSelections(verticalKey, e.target.value);
        };

        document.getElementById('selectPrimary').onclick = () => {
            if (selectedFunction) {
                selectBatch(true);
                dialog.remove();
            } else {
                alert("Please select a vertical and function first.");
            }
        };

        document.getElementById('selectSecondary').onclick = () => {
            if (selectedFunction) {
                selectBatch(false);
                dialog.remove();
            } else {
                alert("Please select a vertical and function first.");
            }
        };

        document.getElementById('closeDialog').onclick = () => {
            dialog.remove();
        };

        if (savedSelections.vertical) {
            selectedVertical = VERTICAL_CONFIGS[savedSelections.vertical];
            selectedFunction = VERTICAL_CONFIGS[savedSelections.vertical].functions[savedSelections.function];
        } else {
            selectedVertical = VERTICAL_CONFIGS[verticalSelect.value];
            selectedFunction = VERTICAL_CONFIGS[verticalSelect.value].functions[document.getElementById('functionSelect').value];
        }
    }

    if (window.location.href.includes('ajuda.a2z.com/cms.html')) {
        const observer = new MutationObserver((mutations, obs) => {
            const bulkOperations = document.querySelector('.bulk-operations');
            if (bulkOperations) {
                createBatchButton();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
