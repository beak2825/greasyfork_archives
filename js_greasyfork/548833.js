// ==UserScript==
// @name         Assistente
// @namespace    https://github.com/0H4S
// @version      1.3
// @description  Automatiza ações repetitivas na plataforma de compras públicas Oxy, como expandir seções, confirmar diálogos de forma invisível, salvar arquivos, preencher datas e selecionar opções de formulário, melhorando a eficiência do usuário.
// @author       OHAS
// @license      Copyright (c) 2025 OHAS - Todos os direitos reservados.
// @homepageURL  https://github.com/0H4S
// @icon         https://img.icons8.com/?size=600&id=9inONWn9EvfI&format=png
// @match        https://piraidosul.oxy.elotech.com.br/compras/processo-administrativo/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548833/Assistente.user.js
// @updateURL https://update.greasyfork.org/scripts/548833/Assistente.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const elementDesiredStates = {};
    const mainActionButtons = [
        { id: 'Habilitação', icon: 'list-ul', text: 'Habilitação' },
        { id: 'Anexos', icon: 'paperclip', text: 'Anexos' }
    ];
    const detailRowIcons = ['file', 'cubes'];
    let homologationSequenceActive = false;
    let propostaComercialObserver = null;

    function simulateFullClick(element) {
        const dispatchMouseEvent = (type) => {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        };
        dispatchMouseEvent('mousedown');
        dispatchMouseEvent('mouseup');
        element.click();
    }

    function observeAndHandleConfirmModals() {
        const style = document.createElement('style');
        style.textContent = `
            .swal2-container.userscript-invisible {
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('swal2-container')) {
                        const confirmButton = node.querySelector('button.swal2-confirm.swal2-styled');
                        if (confirmButton && confirmButton.textContent.trim() === 'Sim') {
                            node.classList.add('userscript-invisible');
                            simulateFullClick(confirmButton);
                        }
                    }
                });
            }
        });
        observer.observe(document.body, { childList: true });
    }

    function handleHomologarClick(event) {
        const homologarButton = event.target.closest('button[data-testid="fab-button"]');
        if (homologarButton && homologarButton.querySelector('.hint-content')?.textContent.trim() === 'Homologar') {
            event.preventDefault();
            event.stopPropagation();
            const licitacaoLink = document.querySelector('a svg[data-icon="clipboard-check"]').closest('a');
            if (licitacaoLink) {
                licitacaoLink.click();
            }
        }
    }

    function handlePropostaComercialFileUpload() {
        if (!window.location.href.includes('/proposta-comercial')) return;
        if (propostaComercialObserver) {
            try {
                propostaComercialObserver.disconnect();
            } catch (e) {
            }
            propostaComercialObserver = null;
        }
        try {
            const checkAndClickNext = () => {
                const downloadButton = document.querySelector('button.btn.circle i.fa-download');
                if (!downloadButton) return false;
                let nextButton = null;
                const allInlineButtons = document.querySelectorAll('button#inline-button');
                for (const btn of allInlineButtons) {
                    if (btn.querySelector('.fa-chevron-right') || btn.textContent.includes('Próximo')) {
                        nextButton = btn;
                        break;
                    }
                }
                if (!nextButton) {
                    nextButton = Array.from(document.querySelectorAll('button.btn.module-color'))
                        .find(btn => {
                            const hasRightIcon = btn.querySelector('.fa-chevron-right') !== null;
                            const hasProximoText = btn.textContent.trim() === 'Próximo' ||
                                                   btn.textContent.includes('Próximo');
                            return (hasRightIcon || hasProximoText) && !btn.disabled;
                        });
                }
                if (nextButton) {
                    const isEnabled = !nextButton.disabled && !nextButton.hasAttribute('disabled');
                    const isVisible = nextButton.offsetParent !== null &&
                                     getComputedStyle(nextButton).display !== 'none' &&
                                     getComputedStyle(nextButton).visibility !== 'hidden';
                    if (isEnabled && isVisible) {
                        nextButton.click();
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            };
            const observer = new MutationObserver(() => {
                if (checkAndClickNext()) {
                    try {
                        observer.disconnect();
                        if (propostaComercialObserver === observer) {
                            propostaComercialObserver = null;
                        }
                    } catch (e) {
                    }
                }
            });
            propostaComercialObserver = observer;
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            checkAndClickNext();
        } catch (e) {
        }
    }

    function hidePropostaComercialElements() {
        if (!window.location.href.includes('/proposta-comercial')) return;
        const importJSONArea = document.querySelector('div.mt-xs > div.dragdrop');
        if (importJSONArea && importJSONArea.querySelector('input[accept="application/json,.json"]')) {
            const parentElement = importJSONArea.parentElement;
            if (parentElement) {
                parentElement.style.display = 'none';
            }
        }
        const copyAddressButton = document.querySelector('button.blue-90.mt-xs');
        if (copyAddressButton) {
            copyAddressButton.style.display = 'none';
        }
        const infoPanel = document.querySelector('div.display-data.border.reduced.small');
        if (infoPanel) {
            infoPanel.style.display = 'none';
        }
        const itemsTable = document.querySelector('div.panel.table.table-responsive.mt-xs');
        if (itemsTable) {
            itemsTable.style.display = 'none';
        }
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const saveButton = document.querySelector('button[data-testid="elo-button"]');
            if (saveButton && saveButton.textContent.trim() === 'Salvar arquivos') {
                saveButton.click();
            }
        }
    });

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function processNextHomologationButton() {
        const allFileButtons = Array.from(document.querySelectorAll('button.sc-ifAKCX.cFlEyZ.btn.circle'))
            .filter(btn => btn.querySelector('svg[data-icon="file-alt"]') && btn.querySelector('.btn-actions-label')?.textContent.trim() === 'Arquivos');
        const nextButton = allFileButtons.find(btn => !btn.dataset.isProcessed);
        if (!nextButton) {
            homologationSequenceActive = false;
            return;
        }
        nextButton.dataset.isProcessed = 'true';
        const itemRow = nextButton.closest('tr');
        if (!itemRow) {
            processNextHomologationButton();
            return;
        }
        nextButton.click();
        setTimeout(() => {
            const detailsRow = itemRow.nextElementSibling;
            if (!detailsRow) return;
            const dragdropContainer = detailsRow.querySelector('div.dragdrop');
            if (!dragdropContainer) return;
            if (dragdropContainer.querySelector('ul')) {
                processNextHomologationButton();
                return;
            }
            const observer = new MutationObserver((mutations, obs) => {
                for (const mutation of mutations) {
                    if (Array.from(mutation.addedNodes).some(node => node.tagName === 'UL')) {
                        obs.disconnect();
                        processNextHomologationButton();
                        return;
                    }
                }
            });
            observer.observe(dragdropContainer, { childList: true });
        }, 500);
    }

    function startHomologationSequence() {
        if (homologationSequenceActive) return;
        document.querySelectorAll('button[data-is-processed]').forEach(btn => delete btn.dataset.isProcessed);
        homologationSequenceActive = true;
        processNextHomologationButton();
    }

    function setReactInputValue(element, value) {
        const prototype = Object.getPrototypeOf(element);
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        valueSetter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function fillPublicationDate() {
        if (!window.location.href.includes('/midia-publicacao')) return;
        const dateInput = document.querySelector('input[id="arquivo.dataCriacao"]:not([data-auto-date-filled="true"])');
        if (!dateInput) return;
        let publicationDate = null;
        const dateLabels = document.querySelectorAll('b.td-label');
        dateLabels.forEach(label => {
            if (label.textContent.trim() === 'Data') {
                const contentSpan = label.nextElementSibling;
                if (contentSpan && contentSpan.classList.contains('td-content')) {
                    publicationDate = contentSpan.textContent.trim();
                }
            }
        });
        if (!publicationDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(publicationDate)) return;
        const dateParts = publicationDate.split('/');
        const isoFormattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        dateInput.dataset.autoDateFilled = 'true';
        setReactInputValue(dateInput, isoFormattedDate);
    }

    function fillAdditionalDate() {
        if (!window.location.href.includes('/midia-publicacao')) return;
        const dateInput = document.querySelector('form input#data[type="date"]');
        if (!dateInput || dateInput.value) return;
        let publicationDate = null;
        const dateLabels = document.querySelectorAll('b.td-label');
        dateLabels.forEach(label => {
            if (label.textContent.trim() === 'Data') {
                const contentSpan = label.nextElementSibling;
                if (contentSpan && contentSpan.classList.contains('td-content')) {
                    publicationDate = contentSpan.textContent.trim();
                }
            }
        });
        if (!publicationDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(publicationDate)) return;
        const dateParts = publicationDate.split('/');
        const isoFormattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        setReactInputValue(dateInput, isoFormattedDate);
    }

    function autoClickSaveArchivesButton() {
        if (!window.location.href.includes('/arquivos')) return;

        const saveButton = document.querySelector('button[data-testid="elo-button"]:not([data-auto-save-clicked="true"])');
        if (saveButton && saveButton.textContent.trim() === 'Salvar arquivos') {
            saveButton.dataset.autoSaveClicked = 'true';
            setTimeout(() => saveButton.click(), 200);
        }
    }

    function selectFileType() {
        if (!window.location.href.includes('/midia-publicacao')) return;
        const selectElement = document.querySelector('select[id="tipoArquivo.id"]:not([data-auto-select-filled="true"])');
        if (!selectElement) return;
        const optionToSelect = Array.from(selectElement.options).find(opt => opt.textContent.trim() === 'Outros');
        if (optionToSelect && optionToSelect.value) {
            selectElement.dataset.autoSelectFilled = 'true';
            setReactInputValue(selectElement, optionToSelect.value);
        }
    }

    function autoClickSaveButton() {
        if (!window.location.href.includes('/midia-publicacao')) return;
        const saveButton = document.querySelector('button[data-testid="elo-button"]:not([data-auto-save-clicked="true"])');
        const dateInput = document.querySelector('input[id="arquivo.dataCriacao"]');
        const selectElement = document.querySelector('select[id="tipoArquivo.id"]');
        if (!saveButton || !dateInput || !selectElement) return;
        if (dateInput.dataset.autoDateFilled === 'true' && selectElement.dataset.autoSelectFilled === 'true') {
            saveButton.dataset.autoSaveClicked = 'true';
            setTimeout(() => saveButton.click(), 200);
        }
    }

    function moveArquivosSection() {
        if (window.location.href.includes('/proposta-comercial')) {
            const arquivosContainer = Array.from(document.querySelectorAll('div.Title__SectionTitleContainer-sc-17u7tu7-2.bGuDHo'))
                .find(el => el.querySelector('h4.Title__SectionTitleText-sc-17u7tu7-3.imBsxQ')?.textContent.trim() === 'Arquivos')
                ?.closest('.row');
            const panelTable = document.querySelector('.panel.table.table-responsive.mt-xs');
            if (arquivosContainer && panelTable && panelTable.parentNode && !arquivosContainer.isEqualNode(panelTable.previousSibling)) {
                panelTable.parentNode.insertBefore(arquivosContainer, panelTable);
            }
        }
    }

    const processPageChanges = () => {
        if (window.location.href.includes('/parecer')) {
            const labelsToHide = ['Modelo', 'Template', 'Parecer'];
            document.querySelectorAll('.form-group').forEach(group => {
                const label = group.querySelector('label');
                if (label && labelsToHide.includes(label.textContent.trim())) {
                    const container = group.closest('.row') || group;
                    container.style.display = 'none';
                }
            });
            const displayData = document.querySelector('div.display-data.border.reduced.small');
            if (displayData) displayData.style.display = 'none';
            const formParecer = document.querySelector('form:has(select#tipoParecer)');
            if (formParecer) formParecer.style.display = 'none';
        }
        if (window.location.href.includes('/homologacao')) {
            startHomologationSequence();
        }
        if (window.location.href.includes('/proposta-comercial')) {
            handlePropostaComercialFileUpload();
            hidePropostaComercialElements();
        }
        if (window.location.href.includes('/arquivos')) {
            autoClickSaveArchivesButton();
        }
        document.querySelectorAll('button').forEach(buttonElement => {
            mainActionButtons.forEach(target => {
                if (buttonElement.querySelector(`svg[data-icon="${target.icon}"]`) && buttonElement.textContent.trim().startsWith(target.text)) {
                    const buttonId = target.id;
                    if (elementDesiredStates[buttonId] === undefined) elementDesiredStates[buttonId] = 'open';
                    if (elementDesiredStates[buttonId] === 'open' && buttonElement.getAttribute('aria-expanded') !== 'true') {
                        buttonElement.click();
                    }
                }
            });
        });
        document.querySelectorAll('tr.reduced').forEach(row => {
            const button = row.querySelector(`button svg[data-icon="${detailRowIcons.join('"], button svg[data-icon="')}"]`);
            if (!button) return;
            const rowId = `row_${row.textContent.trim().replace(/\s+/g, '-')}`;
            if (elementDesiredStates[rowId] === undefined) elementDesiredStates[rowId] = 'open';
            if (elementDesiredStates[rowId] === 'open') {
                button.closest('button').click();
            }
        });
        if (window.location.href.includes('/tce-pr')) {
            const saveTceButton = document.querySelector('.btn-save button[data-testid="fab-button"]:not([data-auto-clicked="true"])');
            if (saveTceButton) {
                saveTceButton.dataset.autoClicked = 'true';
                saveTceButton.click();
            }
        }

        if (window.location.href.includes('/midia-publicacao')) {
            const orgaoInput = document.querySelector('form input#orgaoPublicacao');
            const newPublicationDateInput = document.querySelector('form input#data[type="date"]');
            if (orgaoInput && newPublicationDateInput) {
                const autocompleteList = orgaoInput.parentElement.querySelector('ul.autocomplete.open');
                if (orgaoInput.value && !autocompleteList && !newPublicationDateInput.value) {
                    fillAdditionalDate();
                }
            }
            fillPublicationDate();
            selectFileType();
            autoClickSaveButton();
        }

        moveArquivosSection();
    };


    document.addEventListener('click', (event) => {
        handleHomologarClick(event);
        const buttonElement = event.target.closest('button');
        if (!buttonElement) return;

        if (buttonElement.dataset.testid === 'addButton') {
        }

        let wasHandled = false;
        mainActionButtons.forEach(target => {
            if (buttonElement.querySelector(`svg[data-icon="${target.icon}"]`) && buttonElement.textContent.trim().startsWith(target.text)) {
                setTimeout(() => {
                    elementDesiredStates[target.id] = buttonElement.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed';
                }, 50);
                wasHandled = true;
            }
        });
        if (wasHandled) return;
        const clickedRow = event.target.closest('tr.reduced, tr.success');
        if (clickedRow && clickedRow.querySelector(`button svg[data-icon="${detailRowIcons.join('"], button svg[data-icon="')}"]`)) {
            const rowId = `row_${clickedRow.textContent.trim().replace(/\s+/g, '-')}`;
            setTimeout(() => {
                const isNowExpanded = !clickedRow.classList.contains('reduced');
                elementDesiredStates[rowId] = isNowExpanded ? 'open' : 'closed';
            }, 100);
        }
    }, true);

    observeAndHandleConfirmModals();
    const debouncedProcessPageChanges = debounce(processPageChanges, 250);
    const mainObserver = new MutationObserver(debouncedProcessPageChanges);
    mainObserver.observe(document.body, { childList: true, subtree: true });
})();