// ==UserScript==
// @name         		Diário Tools
// @namespace    		https://github.com/0H4S
// @version      		1.1
// @description  		Ferramentas que melhoram a experiência no Diário Oficial, como download em massa, auto click em links de PDF, botão de impressão e numeração dos diários.
// @author       		OHAS
// @license      		CC-BY-NC-ND-4.0
// @homepageURL  		https://github.com/0H4S
// @icon         		https://cdn-icons-png.flaticon.com/512/887/887997.png
// @match        		https://www.diario.piraidosul.pr.gov.br/*
// @grant        		window.close
// @grant        		GM_registerMenuCommand
// @grant        		GM_setValue
// @grant        		GM_getValue
// @grant        		GM_notification
// @compatible			chrome
// @compatible			edge
// @bgf-colorLT         #fc4903
// @bgf-colorDT         #fcba03
// @bgf-copyright   	[2025 OHAS. All Rights Reserved.](https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438)
// @downloadURL https://update.greasyfork.org/scripts/548834/Di%C3%A1rio%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/548834/Di%C3%A1rio%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // =========================================================================
    // #region AUTO CLICK E BOTÃO DE IMPRESSÃO
    // =========================================================================
    (function() {
        if (GM_getValue('printButtonEnabled') === undefined) {
            GM_setValue('printButtonEnabled', true);
        }
        GM_registerMenuCommand('🟢 Ligar Botão', function() {
            GM_setValue('printButtonEnabled', true);
            if (window.location.href.match(/https:\/\/www\.diario\.piraidosul\.pr\.gov\.br\/admin\/globalarq\/diario-eletronico\/diario\/.*\.pdf/)) {
                const printButton = document.getElementById('auto-print-button');
                if (printButton) {
                    printButton.style.display = 'flex';
                    printButton.style.animation = 'zoomIn 0.5s ease forwards';
                } else {
                    createPrintButton();
                }
            }
        });
        GM_registerMenuCommand('🔴 Desligar Botão', function() {
            GM_setValue('printButtonEnabled', false);
            if (window.location.href.match(/https:\/\/www\.diario\.piraidosul\.pr\.gov\.br\/admin\/globalarq\/diario-eletronico\/diario\/.*\.pdf/)) {
                const printButton = document.getElementById('auto-print-button');
                if (printButton) {
                    printButton.style.animation = 'zoomOut 0.5s ease forwards';
                    setTimeout(() => {
                        printButton.style.display = 'none';
                    }, 500);
                }
            }
        });

        function createPrintButton() {
            if (document.getElementById('auto-print-button')) {
                return;
            }
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes zoomIn {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                @keyframes zoomOut {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                }
                #auto-print-button {
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                                background-color 0.3s ease,
                                box-shadow 0.3s ease;
                }
                #auto-print-button:hover {
                    transform: translate(-50%, -50%) scale(1.1) !important;
                    background-color: #45a049 !important;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.3) !important;
                }
            `;
            document.head.appendChild(styleElement);
            const buttonEnabled = GM_getValue('printButtonEnabled', true);
            const printButton = document.createElement('button');
            printButton.id = 'auto-print-button';
            const printerSVG = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
            `;
            printButton.innerHTML = printerSVG;
            printButton.style.position = 'fixed';
            printButton.style.left = '50%';
            printButton.style.top = '50%';
            printButton.style.transform = 'translate(-50%, -50%)';
            printButton.style.zIndex = '9999';
            printButton.style.backgroundColor = '#4CAF50';
            printButton.style.color = 'white';
            printButton.style.border = 'none';
            printButton.style.borderRadius = '50%';
            printButton.style.width = '60px';
            printButton.style.height = '60px';
            printButton.style.cursor = 'pointer';
            printButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            printButton.style.display = buttonEnabled ? 'flex' : 'none';
            printButton.style.justifyContent = 'center';
            printButton.style.alignItems = 'center';
            printButton.style.animation = 'zoomIn 0.5s ease forwards';
            printButton.onmousedown = function() {
                this.style.transform = 'translate(-50%, -50%) scale(0.95)';
            };
            printButton.onmouseup = function() {
                if (this.matches(':hover')) {
                    this.style.transform = 'translate(-50%, -50%) scale(1.1)';
                } else {
                    this.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            };
            printButton.addEventListener('click', function() {
                window.print();
            });
            document.body.appendChild(printButton);
        }

        if (window.location.href.match(/https:\/\/www\.diario\.piraidosul\.pr\.gov\.br\/admin\/globalarq\/diario-eletronico\/diario\/.*\.pdf/)) {
            createPrintButton();
        } else if (window.location.href.includes('/prepara-pdf/')) {
            let pdfClicked = false;

            function clickPDFLink() {
                if (pdfClicked) {
                    return;
                }
                const pdfDescription = document.getElementById('pdf-description');
                if (pdfDescription) {
                    const link = pdfDescription.querySelector('a[target="_blank"]');
                    if (link && link.href.includes('.pdf')) {
                        pdfClicked = true;
                        link.click();
                        setTimeout(function() {
                            window.close();
                            if (!window.closed) {
                                window.open('', '_self').close();
                            }
                        }, 100);
                    }
                }
            }
            window.addEventListener('load', function() {
                setTimeout(clickPDFLink, 50);
            });
            const observer = new MutationObserver(function() {
                const pdfDescription = document.getElementById('pdf-description');
                if (pdfDescription && pdfDescription.querySelector('a[target="_blank"]')) {
                    clickPDFLink();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    })();
    // =========================================================================
    // #region DOWNLOAD EM MASSA
    // =========================================================================
    (function() {
        const BASE_DELAY_MS = 1500;
        const RANDOM_DELAY_MS = 1000;
        let isDownloading = false;
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        async function startMassDownload() {
            if (isDownloading) {
                GM_notification({ title: 'Aguarde', text: 'O processo de download em massa já está em execução.', timeout: 3000 });
                return;
            }
            const container = document.querySelector('#content > div.events-container-busca');
            if (!container) {
                GM_notification({ title: 'Contêiner não encontrado', text: 'Não foi encontrado o contêiner de diários filtrados.', timeout: 4000 });
                return;
            }
            const downloadButtons = Array.from(container.querySelectorAll('.conteudo-btn a')).filter(link => {
                if (!link.querySelector('.btn-download')) return false;
                const diarioItem = link.closest('.event-card');
                if (!diarioItem) return false;
                const style = window.getComputedStyle(diarioItem);
                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            });
            if (downloadButtons.length === 0) {
                GM_notification({ title: 'Nenhum PDF Encontrado', text: 'Não foram encontrados botões de download visíveis no contêiner de busca.', timeout: 4000 });
                return;
            }
            isDownloading = true;
            const totalFiles = downloadButtons.length;
            GM_notification({
                title: 'Iniciando Downloads',
                text: `${totalFiles} arquivos serão baixados. Por favor, mantenha esta aba aberta e em primeiro plano.`,
                timeout: 6000
            });
            for (let i = 0; i < totalFiles; i++) {
                const linkElement = downloadButtons[i];
                const fileNumber = i + 1;
                const itemContainer = linkElement.closest('.event-card');
                let fileName = `Arquivo ${fileNumber} de ${totalFiles}`;
                if (itemContainer) {
                    const editionElement = itemContainer.querySelector('.event-data h4');
                    if (editionElement) {
                        fileName = editionElement.textContent.trim();
                    }
                }
                GM_notification({
                    title: `Baixando Arquivo (${fileNumber}/${totalFiles})`,
                    text: fileName,
                    timeout: 3000
                });
                linkElement.click();
                const currentDelay = BASE_DELAY_MS + Math.random() * RANDOM_DELAY_MS;
                if (fileNumber < totalFiles) {
                    await sleep(currentDelay);
                }
            }
            isDownloading = false;
            GM_notification({
                title: 'Downloads Concluídos',
                text: `Todos os ${totalFiles} arquivos foram processados com sucesso.`,
                timeout: 5000
            });
        }
        GM_registerMenuCommand('⬇️ Baixar Tudo', startMassDownload);
    })();
    // =========================================================================
    // #region MARCAR DIÁRIOS LIDOS
    // =========================================================================
    (function() {
        if (window.location.href.includes('/prepara-pdf/') || window.location.href.endsWith('.pdf')) {
            return;
        }

        const style = document.createElement('style');
        style.innerHTML = `
            .diario-lido {
                border: 3px solid #ff0000 !important;
                box-shadow: 0 0 8px rgba(255, 0, 0, 0.5) !important;
            }
        `;
        document.head.appendChild(style);

        const diariosLidos = new Set();

        function marcarComoLido(id) {
            diariosLidos.add(id);
            const card = document.querySelector(`.event-card a[href*="/prepara-pdf/${id}"]`)?.closest('.event-card');
            if (card) {
                card.classList.add('diario-lido');
            }
        }

        function verificarLidos() {
            const cards = document.querySelectorAll('.event-card');
            cards.forEach(card => {
                const link = card.querySelector('a[href*="/prepara-pdf/"]');
                if (link) {
                    const match = link.href.match(/\/prepara-pdf\/(\d+)/);
                    if (match && diariosLidos.has(match[1])) {
                        card.classList.add('diario-lido');
                    }
                }
            });
        }

        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-leitura');
            if (btn) {
                const link = btn.closest('a');
                if (link) {
                    const match = link.href.match(/\/prepara-pdf\/(\d+)/);
                    if (match) {
                        const id = match[1];
                        marcarComoLido(id);
                    }
                }
            }
        });
        function modifyLeituraDigitalLinks() {
            const leituraBtns = document.querySelectorAll('.btn-leitura');
            leituraBtns.forEach(btn => {
                const linkParent = btn.closest('a');
                if (linkParent && !linkParent.dataset.modified) {
                    linkParent.dataset.modified = 'true';
                    const originalHref = linkParent.href;
                    linkParent.addEventListener('click', function(e) {
                        e.preventDefault();
                        const newTab = window.open(originalHref, '_blank');
                        if (newTab) {
                            newTab.focus();
                        }
                        return false;
                    });
                }
            });
        }
        function runOnPageLoadAndMutation() {
            verificarLidos();
            modifyLeituraDigitalLinks();
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runOnPageLoadAndMutation);
        } else {
            runOnPageLoadAndMutation();
        }
        const observer = new MutationObserver(function(mutations) {
            let shouldRun = false;
            mutations.forEach(function(mutation) {
                if (!shouldRun) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList.contains('event-card') || node.querySelector('.event-card')) {
                                shouldRun = true;
                                break;
                            }
                        }
                    }
                }
            });
            if (shouldRun) {
                runOnPageLoadAndMutation();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    })();
    // =========================================================================
    // #region NUMERAÇÃO DE DIÁRIOS
    // =========================================================================
    (function() {
        if (window.location.href.includes('/prepara-pdf/') || window.location.href.endsWith('.pdf')) {
            return;
        }

        const style = document.createElement('style');
        style.innerHTML = `
            .event-card {
                position: relative;
            }
            .diario-counter-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #007bff;
                color: white;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                font-size: 14px;
                z-index: 10;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                font-family: sans-serif;
            }
        `;
        document.head.appendChild(style);

        function adicionarNumeracao() {
            const allCards = document.querySelectorAll('.event-card');
            allCards.forEach((card, index) => {
                if (card.querySelector('.diario-counter-badge')) {
                    return;
                }
                const numero = index + 1;
                const badge = document.createElement('span');
                badge.className = 'diario-counter-badge';
                badge.textContent = numero;
                card.appendChild(badge);
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', adicionarNumeracao);
        } else {
            adicionarNumeracao();
        }

        const observer = new MutationObserver(function(mutations) {
            let shouldRun = false;
            mutations.forEach(function(mutation) {
                if (!shouldRun) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList.contains('event-card') || node.querySelector('.event-card')) {
                                shouldRun = true;
                                break;
                            }
                        }
                    }
                }
            });
            if (shouldRun) {
                adicionarNumeracao();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    })();
})();