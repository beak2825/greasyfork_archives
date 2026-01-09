// ==UserScript==
// @name         Ajuda Cart Batch Selector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Select cart items based on layer rules with vertical and function selection, memory, and usage tracking
// @author       MajaBukvic
// @match        https://ajuda.a2z.com/cms.html*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      amazon.sharepoint.com
// @downloadURL https://update.greasyfork.org/scripts/550365/Ajuda%20Cart%20Batch%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/550365/Ajuda%20Cart%20Batch%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    
    const SCRIPT_NAME = 'Ajuda Cart Batch Selector';
    const SCRIPT_VERSION = '1.0';
    
    // SharePoint tracking configuration
    const TRACKING_CONFIG = {
        enabled: true,
        siteUrl: 'https://amazon.sharepoint.com/sites/amazonwatson',
        listName: 'TampermonkeyUsageLog'
    };

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

    // ========================================
    // TRACKING FUNCTIONS
    // ========================================

    function getCurrentUsername() {
        const userElement = document.querySelector('.user-name, .username, [data-username]');
        if (userElement) {
            return userElement.textContent.trim() || userElement.dataset.username;
        }
        const storedUser = localStorage.getItem('ajuda_username') || sessionStorage.getItem('username');
        if (storedUser) {
            return storedUser;
        }
        return 'Unknown User';
    }

    function trackUsage(action, additionalData = {}) {
        if (!TRACKING_CONFIG.enabled) {
            console.log('[Batch Selector] Tracking disabled');
            return;
        }

        const trackingData = {
            Title: `${SCRIPT_NAME} - ${action}`,
            aflk: action,
            k3hk: unsafeWindow.location.href,
            pk8k: `${SCRIPT_NAME} v${SCRIPT_VERSION}`,
            tg5f: getCurrentUsername(),
            ...additionalData
        };

        console.log('[Batch Selector] Tracking:', trackingData);
        sendToSharePoint(trackingData);
    }

    function sendToSharePoint(data) {
        const contextUrl = `${TRACKING_CONFIG.siteUrl}/_api/contextinfo`;
        const listApiUrl = `${TRACKING_CONFIG.siteUrl}/_api/web/lists/getbytitle('${TRACKING_CONFIG.listName}')/items`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: contextUrl,
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose'
            },
            onload: function(response) {
                try {
                    const contextInfo = JSON.parse(response.responseText);
                    const formDigest = contextInfo.d.GetContextWebInformation.FormDigestValue;

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: listApiUrl,
                        headers: {
                            'Accept': 'application/json;odata=verbose',
                            'Content-Type': 'application/json;odata=verbose',
                            'X-RequestDigest': formDigest
                        },
                        data: JSON.stringify({
                            '__metadata': { 'type': 'SP.Data.TampermonkeyUsageLogListItem' },
                            'Title': data.Title,
                            'aflk': data.aflk,
                            'k3hk': data.k3hk,
                            'pk8k': data.pk8k,
                            'tg5f': data.tg5f
                        }),
                        onload: function(createResponse) {
                            if (createResponse.status >= 200 && createResponse.status < 300) {
                                console.log('[Batch Selector] Usage tracked successfully');
                            } else {
                                console.warn('[Batch Selector] Failed to track usage:', createResponse.statusText);
                            }
                        },
                        onerror: function(error) {
                            console.warn('[Batch Selector] Error tracking usage:', error);
                        }
                    });
                } catch (e) {
                    console.warn('[Batch Selector] Error parsing context info:', e);
                }
            },
            onerror: function(error) {
                console.warn('[Batch Selector] Error getting form digest:', error);
            }
        });
    }

    // ========================================
    // LOCAL STORAGE FUNCTIONS
    // ========================================

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

    // ========================================
    // UI FUNCTIONS
    // ========================================

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

    // ========================================
    // BATCH SELECTION FUNCTIONS
    // ========================================

    function parseObjectId(text) {
        const match = text.match(/([^\/]+)\/Published\/([^\/]+)\/([^\/]+)/);
        return match ? { id: match[1], layer: match[2], locale: match[3] } : null;
    }

    /**
     * FIXED: Use unsafeWindow for proper window reference
     */
    function simulateClick(element) {
        if (!element) return;
        const event = new MouseEvent('click', {
            view: unsafeWindow,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    function groupBlurbs() {
        const rows = document.querySelectorAll('#version-list tbody tr');
        const groups = {};

        Array.from(rows).forEach(element => {
            const blurbNameElement = element.querySelector('td:nth-child(2) div:first-child');
            const subTextElement = element.querySelector('.sub-text');
            
            if (!blurbNameElement || !subTextElement) return;
            
            const blurbName = blurbNameElement.textContent;
            const objInfo = parseObjectId(subTextElement.textContent);

            if (objInfo && selectedFunction && selectedFunction.layers.includes(objInfo.layer)) {
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
        let selectedCount = 0;

        Object.entries(groups).forEach(([blurbName, group]) => {
            if (isPrimary) {
                selectedFunction.primaryLayers.forEach(layer => {
                    const layerVersions = group.versions.filter(v => v.layer === layer);
                    if (layerVersions.length > 0) {
                        toSelect.add(layerVersions[0].element);
                    }
                });
            } else {
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
            if (checkbox && !checkbox.checked) {
                simulateClick(checkbox);
                selectedCount++;
            }
        });

        // Track the batch selection
        const savedSelections = loadSelections();
        trackUsage(isPrimary ? 'primary_batch_selected' : 'secondary_batch_selected');

        return selectedCount;
    }

    function updateFunctionSelect(verticalKey) {
        const functionSelect = document.getElementById('functionSelect');
        if (!functionSelect) return;
        
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
        trackUsage('batch_dialog_opened');

        const dialog = document.createElement('div');
        dialog.id = 'batchSelectorDialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            border-radius: 8px;
            min-width: 350px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        const savedSelections = loadSelections();

        const html = `
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                    📦 Batch Selector
                </h3>
                
                <label for="verticalSelect" style="font-size: 13px; color: #555; display: block; margin-bottom: 5px;">
                    Select Vertical:
                </label>
                <select id="verticalSelect" class="form-control" style="margin-bottom: 15px; width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    ${Object.entries(VERTICAL_CONFIGS).map(([key, config]) =>
                        `<option value="${key}" ${savedSelections.vertical === key ? 'selected' : ''}>${config.name}</option>`
                    ).join('')}
                </select>

                <label for="functionSelect" style="font-size: 13px; color: #555; display: block; margin-bottom: 5px;">
                    Select Function:
                </label>
                <select id="functionSelect" class="form-control" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                </select>
            </div>
            
            <div style="text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
                <button id="selectPrimary" type="button" class="btn btn-primary" style="margin: 5px; padding: 8px 20px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ✓ Select Primary Batch
                </button>
                <br>
                <button id="selectSecondary" type="button" class="btn btn-info" style="margin: 5px; padding: 8px 20px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ✓ Select Secondary Batch
                </button>
                <br>
                <button id="closeDialog" type="button" class="btn" style="margin: 5px; padding: 8px 20px; background: #f5f5f5; color: #333; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                    Close
                </button>
            </div>
            
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; font-size: 10px; color: #999; text-align: center;">
                ${SCRIPT_NAME} v${SCRIPT_VERSION}
            </div>
        `;

        dialog.innerHTML = html;
        
        const overlay = document.createElement('div');
        overlay.id = 'batchSelectorOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;
        
        document.body.appendChild(overlay);
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
                const count = selectBatch(true);
                closeDialog();
                showNotification(`Selected ${count} primary items`, 'success');
            } else {
                alert("Please select a vertical and function first.");
            }
        };

        document.getElementById('selectSecondary').onclick = () => {
            if (selectedFunction) {
                const count = selectBatch(false);
                closeDialog();
                showNotification(`Selected ${count} secondary items`, 'success');
            } else {
                alert("Please select a vertical and function first.");
            }
        };

        document.getElementById('closeDialog').onclick = closeDialog;
        overlay.onclick = closeDialog;

        function closeDialog() {
            const dialogEl = document.getElementById('batchSelectorDialog');
            const overlayEl = document.getElementById('batchSelectorOverlay');
            if (dialogEl) dialogEl.remove();
            if (overlayEl) overlayEl.remove();
        }

        if (savedSelections.vertical) {
            selectedVertical = VERTICAL_CONFIGS[savedSelections.vertical];
            if (savedSelections.function && VERTICAL_CONFIGS[savedSelections.vertical].functions[savedSelections.function]) {
                selectedFunction = VERTICAL_CONFIGS[savedSelections.vertical].functions[savedSelections.function];
            }
        } else {
            selectedVertical = VERTICAL_CONFIGS[verticalSelect.value];
            const funcSelect = document.getElementById('functionSelect');
            if (funcSelect && funcSelect.value) {
                selectedFunction = VERTICAL_CONFIGS[verticalSelect.value].functions[funcSelect.value];
            }
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10002;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(100px);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function initialize() {
        if (unsafeWindow.location.href.includes('ajuda.a2z.com/cms.html')) {
            trackUsage('script_loaded');

            const observer = new MutationObserver((mutations, obs) => {
                const bulkOperations = document.querySelector('.bulk-operations');
                if (bulkOperations) {
                    createBatchButton();
                    obs.disconnect();
                    console.log('[Batch Selector] Initialized successfully');
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    initialize();

})();
