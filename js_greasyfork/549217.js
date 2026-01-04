// ==UserScript==
// @name         Webdoc - Klinikfavoriter e-recept
// @namespace    http://tampermonkey.net/
// @version      1.41
// @description  Transform Webdoc favorites list into an interactive tree structure. (Production ready - Three-level tree with custom main group order)
// @author       You & Assistant
// @match        https://webdoc.atlan.se/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549217/Webdoc%20-%20Klinikfavoriter%20e-recept.user.js
// @updateURL https://update.greasyfork.org/scripts/549217/Webdoc%20-%20Klinikfavoriter%20e-recept.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CUSTOM_MAIN_GROUP_ORDER = [
        "Infektion"
    ];
    // --- End Configuration ---

    let isTransformed = false;
    let observer = null;
    let attemptCount = 0;
    const maxAttempts = 2;
    let attachedCloseListenerDialog = null;
    let drugListCustomizationsObserver = null;

    function resetTransformationFlag() {
        isTransformed = false;
        attachedCloseListenerDialog = null;
        if (drugListCustomizationsObserver) {
            drugListCustomizationsObserver.disconnect();
            drugListCustomizationsObserver = null;
        }
    }

    function sortMainGroups(mainGroupNames) {
        return mainGroupNames.sort((a, b) => {
            const indexA = CUSTOM_MAIN_GROUP_ORDER.indexOf(a);
            const indexB = CUSTOM_MAIN_GROUP_ORDER.indexOf(b);

            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            if (indexA !== -1) {
                return -1;
            }
            if (indexB !== -1) {
                return 1;
            }
            return a.localeCompare(b);
        });
    }

    function transformFavorites(reason = "Unknown") {
        if (isTransformed) {
            return { success: true, transformed: true };
        }
        attemptCount++;

        const dialog = document.querySelector('.ui-dialog[aria-describedby="JQDialogDivPOPUP"]');
        if (!dialog || window.getComputedStyle(dialog).display === 'none') {
            return { success: false, reason: "Dialog not visible" };
        }
        const dialogContent = dialog.querySelector('#JQDialogDivPOPUP');
        if (!dialogContent) {
            return { success: false, reason: "Dialog content missing" };
        }
        const favoritesContainer = dialogContent.querySelector('#userDrugFavoritesContainer');
        if (!favoritesContainer) {
             return { success: false, reason: "Favorites container missing" };
        }
        const leftSide = favoritesContainer.querySelector('#leftSide');
        if (!leftSide) {
             return { success: false, reason: "Left side missing" };
        }
        const favoriterLabel = Array.from(leftSide.querySelectorAll('label.labelStyle')).find(label => label.textContent.trim() === 'Favoriter');
        if (!favoriterLabel) {
            return { success: false, reason: "Favoriter label missing" };
        }
        const targetContainer = leftSide.querySelector('.favoriteGroupsContainer');
        if (!targetContainer) {
             return { success: false, reason: "Target container missing" };
        }
        const originalItemWrappers = targetContainer.querySelectorAll('.favoriteGroupsWrapper');
        if (originalItemWrappers.length === 0) {
             if (document.getElementById('favoriteTreeContainer')) {
                 isTransformed = true;
                 return { success: true, transformed: true };
             }
             return { success: false, reason: "No original item wrappers found" };
        }

        const favoritesData = {};
        originalItemWrappers.forEach(wrapper => {
            const pElement = wrapper.querySelector('p');
            if (!pElement) {
                return;
            }

            const groupId = pElement.getAttribute('data-favorite-group-id');
            let textContent = pElement.innerText || pElement.textContent || "";
            textContent = textContent.trim();

            if (!groupId || !textContent) {
                return;
            }

            const parts = textContent.split(',').map(part => part.trim());

            if (parts.length < 2) {
                 return;
            }

            const mainGroupName = parts[0];
            const subGroupName = parts[1];
            let thirdLevelName = null;
            if (parts.length >= 3) {
                thirdLevelName = parts.slice(2).join(', ');
            }

            if (!favoritesData[mainGroupName]) {
                favoritesData[mainGroupName] = {};
            }
            if (!favoritesData[mainGroupName][subGroupName]) {
                favoritesData[mainGroupName][subGroupName] = [];
            }

            favoritesData[mainGroupName][subGroupName].push({
                name: thirdLevelName || subGroupName,
                id: groupId,
                fullPath: textContent,
                isLeaf: !!thirdLevelName
            });
        });

        if (Object.keys(favoritesData).length === 0) {
             return { success: false, reason: "No data parsed" };
        }

        targetContainer.innerHTML = '';
        const treeContainer = document.createElement('div');
        treeContainer.id = 'favoriteTreeContainer';
        treeContainer.style.marginTop = '10px';

        const cssId = 'webdoc-favorite-tree-css-v141';
        let style = document.getElementById(cssId);
        if (!style) {
            style = document.createElement('style');
            style.id = cssId;
            document.head.appendChild(style);
        }
        style.textContent = `
            #favoriteTreeContainer .drug-item:hover {
                background-color: #f0f0f0;
            }
            #favoriteTreeContainer .tree-main-group,
            #favoriteTreeContainer .tree-sub-group {
                position: relative;
                padding-left: 15px;
            }
            #favoriteTreeContainer .tree-main-group::before,
            #favoriteTreeContainer .tree-sub-group::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 1px;
                background-color: #ccc;
            }
            #favoriteTreeContainer .tree-main-group::after,
            #favoriteTreeContainer .tree-sub-group::after {
                content: none;
            }
            #favoriteTreeContainer .drug-list {
                position: relative;
                padding-left: 15px;
            }
            #favoriteTreeContainer .drug-list::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 50%;
                width: 1px;
                background-color: #ccc;
            }
            #favoriteTreeContainer .drug-item::before {
                content: none;
            }
            #favoriteTreeContainer .drug-list::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 1px;
                background-color: #ccc;
            }
            #favoriteProductsTableBody .favoritePrescriptionsInformationRow {
                border-bottom: 1px solid #eee;
                padding: 5px 0;
            }
            #favoriteProductsTableBody .prescriptionTitle {
                color: #000 !important;
            }
            #favoriteProductsTableBody .checkbox-column {
                flex: 0 0 40px !important;
            }
            #favoriteProductsTableBody .prescriptionTitle:nth-child(2) {
                flex: 2 !important;
            }
            #favoriteProductsTableBody .prescriptionTitle:nth-child(3) {
                flex: 1 !important;
            }
            #favoriteProductsTableBody .prescriptionTitle:nth-child(4) {
                flex: 3 !important;
            }
        `;

        const mainGroupNames = Object.keys(favoritesData);
        const sortedMainGroupNames = sortMainGroups(mainGroupNames);

        sortedMainGroupNames.forEach(mainGroupName => {
            const subGroupsData = favoritesData[mainGroupName];

            const mainGroupItem = document.createElement('div');
            mainGroupItem.className = 'tree-main-group';
            mainGroupItem.style.marginBottom = '5px';
            mainGroupItem.dataset.mainGroup = mainGroupName;

            const mainGroupLabel = document.createElement('span');
            mainGroupLabel.className = 'category-label main-group-label';
            mainGroupLabel.style.cursor = 'pointer';
            mainGroupLabel.style.userSelect = 'none';
            mainGroupLabel.innerHTML = `<span class="toggle">+</span> ${mainGroupName}`;
            mainGroupLabel.title = `Expand/collapse ${mainGroupName}`;

            const subGroupsContainer = document.createElement('div');
            subGroupsContainer.className = 'sub-groups-container';
            subGroupsContainer.style.display = 'none';
            subGroupsContainer.style.marginLeft = '20px';
            subGroupsContainer.dataset.expanded = 'false';

            const subGroupNames = Object.keys(subGroupsData);
            const sortedSubGroupNames = subGroupNames.sort();

            sortedSubGroupNames.forEach(subGroupName => {
                const items = subGroupsData[subGroupName];

                const allAreLeaves = items.every(item => item.isLeaf);

                if (allAreLeaves) {
                    const subGroupItem = document.createElement('div');
                    subGroupItem.className = 'tree-sub-group';
                    subGroupItem.style.marginBottom = '3px';
                    subGroupItem.dataset.subGroup = subGroupName;

                    const subGroupLabel = document.createElement('span');
                    subGroupLabel.className = 'category-label sub-group-label';
                    subGroupLabel.style.cursor = 'pointer';
                    subGroupLabel.style.userSelect = 'none';
                    subGroupLabel.innerHTML = `<span class="toggle">+</span> ${subGroupName}`;
                    subGroupLabel.title = `Expand/collapse ${subGroupName}`;

                    const itemsContainer = document.createElement('div');
                    itemsContainer.className = 'drug-list';
                    itemsContainer.style.display = 'none';
                    itemsContainer.style.marginLeft = '20px';
                    itemsContainer.dataset.expanded = 'false';

                    items.forEach(item => {
                        const drugItem = document.createElement('div');
                        drugItem.className = 'drug-item';
                        drugItem.dataset.drugId = item.id;
                        drugItem.dataset.mainGroup = mainGroupName;
                        drugItem.dataset.subGroup = subGroupName;
                        drugItem.dataset.leafName = item.name;
                        drugItem.textContent = item.name;
                        drugItem.style.cursor = 'pointer';
                        drugItem.style.padding = '2px 0';
                        drugItem.style.borderRadius = '3px';
                        drugItem.title = `Load prescriptions for ${item.fullPath}`;
                        drugItem.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (typeof UserDrugFavorites !== 'undefined' && UserDrugFavorites.loadGroupProducts) {
                                UserDrugFavorites.loadGroupProducts(item.id);
                            } else {
                                loadPrescriptionsFallback(item.id, favoritesContainer, dialogContent);
                            }
                        });
                        itemsContainer.appendChild(drugItem);
                    });

                    subGroupLabel.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isExpanded = itemsContainer.dataset.expanded === 'true';
                        if (isExpanded) {
                            itemsContainer.style.display = 'none';
                            itemsContainer.dataset.expanded = 'false';
                            subGroupLabel.querySelector('.toggle').textContent = '+';
                        } else {
                            itemsContainer.style.display = 'block';
                            itemsContainer.dataset.expanded = 'true';
                            subGroupLabel.querySelector('.toggle').textContent = '-';
                        }
                    });

                    subGroupItem.appendChild(subGroupLabel);
                    subGroupItem.appendChild(itemsContainer);
                    subGroupsContainer.appendChild(subGroupItem);

                } else {
                    items.forEach(item => {
                        const drugItem = document.createElement('div');
                        drugItem.className = 'drug-item';
                        drugItem.dataset.drugId = item.id;
                        drugItem.dataset.mainGroup = mainGroupName;
                        drugItem.dataset.subGroup = subGroupName;
                        drugItem.dataset.leafName = item.name;
                        drugItem.textContent = item.name;
                        drugItem.style.cursor = 'pointer';
                        drugItem.style.padding = '2px 0';
                        drugItem.style.borderRadius = '3px';
                        drugItem.title = `Load prescriptions for ${item.fullPath}`;
                        drugItem.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (typeof UserDrugFavorites !== 'undefined' && UserDrugFavorites.loadGroupProducts) {
                                UserDrugFavorites.loadGroupProducts(item.id);
                            } else {
                                loadPrescriptionsFallback(item.id, favoritesContainer, dialogContent);
                            }
                        });
                        subGroupsContainer.appendChild(drugItem);
                    });
                }
            });

            mainGroupLabel.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = subGroupsContainer.dataset.expanded === 'true';
                if (isExpanded) {
                    subGroupsContainer.style.display = 'none';
                    subGroupsContainer.dataset.expanded = 'false';
                    mainGroupLabel.querySelector('.toggle').textContent = '+';
                } else {
                    subGroupsContainer.style.display = 'block';
                    subGroupsContainer.dataset.expanded = 'true';
                    mainGroupLabel.querySelector('.toggle').textContent = '-';
                }
            });

            mainGroupItem.appendChild(mainGroupLabel);
            mainGroupItem.appendChild(subGroupsContainer);
            treeContainer.appendChild(mainGroupItem);
        });

        targetContainer.appendChild(treeContainer);
        const rightSide = favoritesContainer.querySelector('#rightSide');
        const largeSection = favoritesContainer.querySelector('.largeSection');
        if (dialog && dialogContent && largeSection) {
            dialog.style.width = '1040px';
            dialog.style.height = 'auto';
            dialog.style.minHeight = '650px';
            dialog.style.maxHeight = 'none';
            dialogContent.style.minHeight = '600px';
            dialogContent.style.height = 'auto';
            dialogContent.style.maxHeight = 'none';
            largeSection.style.height = '600px';
            largeSection.style.minHeight = '600px';
            largeSection.style.display = 'flex';
            largeSection.style.flexDirection = 'row';
            leftSide.style.display = 'flex';
            leftSide.style.flexDirection = 'column';
            leftSide.style.height = '100%';
            leftSide.style.flex = '1';
            rightSide.style.display = 'flex';
            rightSide.style.flexDirection = 'column';
            rightSide.style.height = '100%';
            rightSide.style.flex = '2';
            rightSide.style.marginLeft = '10px';
            targetContainer.style.flexGrow = '1';
            targetContainer.style.overflowY = 'auto';
            targetContainer.style.minHeight = '0';
            const container = rightSide.querySelector('.container');
            if (container) {
                container.style.flexGrow = '1';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.minHeight = '0';
            }
            const userDrugFavoritePrescriptions = rightSide.querySelector('.userDrugFavoritePrescriptions');
            if (userDrugFavoritePrescriptions) {
                userDrugFavoritePrescriptions.style.flexGrow = '1';
                userDrugFavoritePrescriptions.style.display = 'flex';
                userDrugFavoritePrescriptions.style.flexDirection = 'column';
                userDrugFavoritePrescriptions.style.minHeight = '0';
            }
            const favoriteProductsTableBody = dialogContent.querySelector('#favoriteProductsTableBody');
            if (favoriteProductsTableBody) {
                favoriteProductsTableBody.style.flexGrow = '1';
                favoriteProductsTableBody.style.overflowY = 'auto';
                favoriteProductsTableBody.style.display = 'block';
            }
            favoritesContainer.style.padding = '0 10px 20px 10px';
        } else {
        }
        if (typeof jQuery !== 'undefined') {
            if (attachedCloseListenerDialog !== dialog) {
                 if (attachedCloseListenerDialog) {
                      try {
                          jQuery(attachedCloseListenerDialog).off('dialogclose', resetTransformationFlag);
                      } catch (e) {
                      }
                 }
                 jQuery(dialog).on('dialogclose', resetTransformationFlag);
                 attachedCloseListenerDialog = dialog;
            } else {
            }
        } else {
            const closeButton = dialog.querySelector('.ui-dialog-titlebar-close');
            if (closeButton) {
                closeButton.removeEventListener('click', resetTransformationFlag);
                closeButton.addEventListener('click', resetTransformationFlag);
            } else {
            }
        }

        const dialogContentForCustomizations = dialog.querySelector('#JQDialogDivPOPUP');
        if (dialogContentForCustomizations) {
            applyDrugListCustomizations(dialogContentForCustomizations);
        }

        isTransformed = true;
        return { success: true, transformed: false };
    }

    function applyDrugListCustomizations(dialogContent) {
        if (!dialogContent) {
            return;
        }

        const favoriteProductsTableBody = dialogContent.querySelector('#favoriteProductsTableBody');
        if (!favoriteProductsTableBody) {
            return;
        }

        if (drugListCustomizationsObserver) {
            drugListCustomizationsObserver.disconnect();
        }

        drugListCustomizationsObserver = new MutationObserver(function(mutations) {
            let shouldProcess = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                }
            });

            if (shouldProcess) {
                setTimeout(() => {
                    const allOrNoneContainer = dialogContent.querySelector('.allOrNoneDrugContainer');
                    if (allOrNoneContainer) {
                        allOrNoneContainer.remove();
                    }

                    const checkboxes = favoriteProductsTableBody.querySelectorAll('input[type="checkbox"].selectProductCheckbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.removeAttribute('checked');
                        checkbox.checked = false;
                    });

                    const rows = favoriteProductsTableBody.querySelectorAll('.favoritePrescriptionsInformationRow');
                    rows.forEach(row => {
                        if (!row.dataset.listenerAddedV141) {
                            row.style.cursor = 'pointer';
                            row.addEventListener('click', function(e) {
                                if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                                    return;
                                }
                                const checkbox = this.querySelector('input[type="checkbox"].selectProductCheckbox');
                                if (checkbox) {
                                    checkbox.checked = !checkbox.checked;
                                    const event = new Event('change', { bubbles: true });
                                    checkbox.dispatchEvent(event);
                                }
                            });
                            row.dataset.listenerAddedV141 = 'true';
                        }
                    });

                    rows.forEach(row => {
                        if (row.dataset.restructuredV141) return;

                        const pElements = row.querySelectorAll('p.prescriptionTitle');
                        const divWithTitleInput = row.querySelector('div.prescriptionTitle');

                        if (pElements.length >= 3 && divWithTitleInput) {
                            const checkboxContainer = document.createElement('div');
                            checkboxContainer.className = 'prescriptionTitle checkbox-column';
                            checkboxContainer.style.flexShrink = '0';
                            checkboxContainer.style.width = '40px';
                            checkboxContainer.style.textAlign = 'center';

                            const checkbox = divWithTitleInput.querySelector('input[type="checkbox"]');
                            if (checkbox) {
                                checkboxContainer.appendChild(checkbox);
                                divWithTitleInput.style.display = 'none';
                            }

                            row.insertBefore(checkboxContainer, pElements[0]);
                            row.dataset.restructuredV141 = 'true';
                        }
                    });

                    rows.forEach(row => {
                        if (row.dataset.flexLayoutAppliedV141) return;

                        row.style.display = 'flex';
                        row.style.alignItems = 'center';

                        const children = row.children;
                        for (let i = 0; i < children.length; i++) {
                            const child = children[i];
                            if (child.classList.contains('checkbox-column')) {
                                child.style.flex = '0 0 auto';
                            } else if (child.tagName === 'P' && child.classList.contains('prescriptionTitle')) {
                                child.style.flex = '1';
                                child.style.margin = '0 5px';
                            }
                        }

                        row.dataset.flexLayoutAppliedV141 = 'true';
                    });

                    const userDrugFavoritePrescriptionsContainer = favoriteProductsTableBody.closest('.userDrugFavoritePrescriptions');
                    if (userDrugFavoritePrescriptionsContainer) {
                        const headerToHide1 = userDrugFavoritePrescriptionsContainer.querySelector('.prescriptionSectionTitles');
                        if (headerToHide1) {
                            headerToHide1.style.display = 'none';
                        }
                    }

                    const headerRows = favoriteProductsTableBody.querySelectorAll('tr');
                    headerRows.forEach(hr => {
                       hr.style.display = 'none';
                    });

                    const allPotentialHeaders = favoriteProductsTableBody.querySelectorAll('p, div, span');
                    allPotentialHeaders.forEach(el => {
                        const text = el.textContent.trim().toLowerCase();
                        if (text.includes('namn') && text.includes('dosering') && text.includes('styrka')) {
                            el.style.display = 'none';
                        }
                    });

                    rows.forEach(row => {
                        if (row.dataset.columnsReorderedV141) return;

                        const pElements = row.querySelectorAll('p.prescriptionTitle:not(.checkbox-column)');
                        if (pElements.length >= 3) {
                            const nameP = pElements[0];
                            const dosageP = pElements[1];
                            const strengthP = pElements[2];

                            row.insertBefore(dosageP, strengthP.nextSibling);
                            row.insertBefore(strengthP, dosageP.nextSibling);

                            row.dataset.columnsReorderedV141 = 'true';
                        }
                    });

                }, 150);
            }
        });

        drugListCustomizationsObserver.observe(favoriteProductsTableBody, { childList: true, subtree: true });

        const initialAllOrNoneContainer = dialogContent.querySelector('.allOrNoneDrugContainer');
        if (initialAllOrNoneContainer) {
            initialAllOrNoneContainer.remove();
        }

        const initialRows = favoriteProductsTableBody.querySelectorAll('.favoritePrescriptionsInformationRow');
        if (initialRows.length > 0) {
            const event = new CustomEvent('manualProcessRows');
            favoriteProductsTableBody.dispatchEvent(event);
        }

        const userDrugFavoritePrescriptionsContainerImmediate = favoriteProductsTableBody.closest('.userDrugFavoritePrescriptions');
        if (userDrugFavoritePrescriptionsContainerImmediate) {
            const headerToHide1Immediate = userDrugFavoritePrescriptionsContainerImmediate.querySelector('.prescriptionSectionTitles');
            if (headerToHide1Immediate) {
                headerToHide1Immediate.style.display = 'none';
            }
        }

        const headerRowsImmediate = favoriteProductsTableBody.querySelectorAll('tr');
        headerRowsImmediate.forEach(hr => {
           hr.style.display = 'none';
        });
    }

    function loadPrescriptionsFallback(groupId, favoritesContainer, dialogContent) {
                const patientId = favoritesContainer.getAttribute('data-patient-id');
                if (!patientId) {
                    return;
                }

                const url = `https://webdoc.atlan.se/loadGroupPrescriptions/${groupId}?patientId=${patientId}`;

                fetch(url, {
                    method: 'GET',
                    headers: {
                        "accept": "*/*",
                        "x-requested-with": "XMLHttpRequest"
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return response.json();
                    } else {
                        return response.text();
                    }
                })
                .then(data => {
                    const favoriteProductsTableBody = dialogContent.querySelector('#favoriteProductsTableBody');
                    if (!favoriteProductsTableBody) {
                        return;
                    }

                    favoriteProductsTableBody.innerHTML = '';

                    if (typeof data === 'object' && data !== null) {
                        let prescriptions = [];
                        function searchForArray(obj) {
                            for (const key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    const value = obj[key];
                                    if (Array.isArray(value)) {
                                        prescriptions = value;
                                        break;
                                    } else if (typeof value === 'object' && value !== null) {
                                        searchForArray(value);
                                    }
                                }
                            }
                        }
                        searchForArray(data);

                        if (prescriptions.length > 0) {
                            prescriptions.forEach(prescription => {
                                let name = prescription.name || prescription.prescriptionName || prescription.drugName || 'Unknown';
                                let dosage = prescription.dosage || prescription.dose || prescription.dosing || 'Unknown';
                                let strength = prescription.strength || prescription.styrka || 'Unknown';
                                let productId = prescription.productId || prescription.id || prescription.product_id || '0';

                                const row = document.createElement('span');
                                row.className = 'favoritePrescriptionsInformationRow';
                                row.setAttribute('data-product-id', productId);

                                row.innerHTML = `
                                    <p class="prescriptionTitle warning" id="favoriteDrugName">${name}</p>
                                    <p class="prescriptionTitle webDocQTip warning" id="favoriteDosage">${dosage}</p>
                                    <p class="prescriptionTitle warning" id="favoriteStrength">${strength}</p>
                                    <div class="prescriptionTitle">
                                        <input class="allOrNoneDrug selectProductCheckbox" type="checkbox" value="1" checked="">
                                    </div>
                                `;
                                favoriteProductsTableBody.appendChild(row);
                            });

                            setTimeout(() => {
                                if (drugListCustomizationsObserver) {
                                    const event = new CustomEvent('manualProcess');
                                    favoriteProductsTableBody.dispatchEvent(event);
                                }
                            }, 200);

                        } else {
                            favoriteProductsTableBody.innerHTML = JSON.stringify(data, null, 2);
                        }
                    } else if (typeof data === 'string') {
                        favoriteProductsTableBody.innerHTML = data;

                        setTimeout(() => {
                            if (drugListCustomizationsObserver) {
                                const event = new CustomEvent('manualProcess');
                                favoriteProductsTableBody.dispatchEvent(event);
                            }
                        }, 200);

                    } else {
                        favoriteProductsTableBody.innerHTML = String(data);
                    }
                })
                .catch(error => {
                });
    }

    function setupObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            let shouldTransform = false;
            let transformReason = "";
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                             if (node.matches && node.matches('.ui-dialog[aria-describedby="JQDialogDivPOPUP"]')) {
                                 shouldTransform = true;
                                 transformReason = "Dialog added";
                                 break;
                             }
                             if (node.id === 'JQDialogDivPOPUP') {
                                 shouldTransform = true;
                                 transformReason = "Dialog content added";
                                 break;
                             }
                             if (node.id === 'userDrugFavoritesContainer') {
                                 shouldTransform = true;
                                 transformReason = "User drug favorites container added";
                                 break;
                             }
                             if (node.closest && node.closest('#JQDialogDivPOPUP')) {
                                 shouldTransform = true;
                                 transformReason = "Content added inside dialog";
                                 break;
                             }
                        }
                    }
                    if (shouldTransform) break;
                }
            }
            if (shouldTransform) {
                attemptCount = 0;

                const runTransform = () => {
                    const result = transformFavorites(transformReason);
                    if (result.success) {
                        if (result.transformed) {
                             const dialog = document.querySelector('.ui-dialog[aria-describedby="JQDialogDivPOPUP"]');
                             if (dialog) {
                                const dialogContent = dialog.querySelector('#JQDialogDivPOPUP');
                                if (dialogContent) {
                                    applyDrugListCustomizations(dialogContent);
                                }
                             }

                        } else {
                        }
                    } else {
                        if (attemptCount < maxAttempts) {
                            setTimeout(runTransform, 500);
                        } else {
                        }
                    }
                };

                setTimeout(runTransform, 100);
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupObserver();
        });
    } else {
        setupObserver();
    }

})();