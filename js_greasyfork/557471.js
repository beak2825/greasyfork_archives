// ==UserScript==
// @name                Better WhatsApp
// @name:pt-BR          Better WhatsApp
// @name:en             Better WhatsApp
// @name:es             Better WhatsApp
// @name:id             Better WhatsApp
// @name:hi             Better WhatsApp
// @namespace           http://github.com/0H4S
// @version             1.0
// @description         Enhance your WhatsApp Web experience with additional features such as collapsing the chat panel, quickly opening the options menu with a right-click, and marking messages for reply with a simple left-click.
// @description:pt-BR   Aprimore sua experiência no WhatsApp Web com recursos adicionais, como recolher o painel de conversas, abrir rapidamente o menu de opções com o clique direito e marcar mensagens para resposta com um simples clique esquerdo.
// @description:en      Enhance your WhatsApp Web experience with additional features such as collapsing the chat panel, quickly opening the options menu with a right-click, and marking messages for reply with a simple left-click.
// @description:es      Mejora tu experiencia en WhatsApp Web con funciones adicionales como contraer el panel de chats, abrir rápidamente el menú de opciones con un clic derecho y marcar mensajes para responder con un simple clic izquierdo.
// @description:id      Tingkatkan pengalaman Anda di WhatsApp Web dengan fitur tambahan seperti mengecilkan panel percakapan, membuka menu opsi dengan cepat menggunakan klik kanan, dan menandai pesan untuk dibalas dengan klik kiri sederhana.
// @description:hi      WhatsApp Web का उपयोग अनुभव बेहतर बनाएं अतिरिक्त सुविधाओं के साथ, जैसे चैट पैनल को संक्षिप्त करना, राइट-क्लिक से विकल्प मेनू को जल्दी खोलना, और लेफ्ट-क्लिक से संदेशों को उत्तर के लिए चिह्नित करना.
// @author              OHAS
// @copyright           2025 OHAS. All Rights Reserved.
// @license             CC-BY-NC-ND-4.0
// @icon                https://cdn-icons-png.flaticon.com/512/16566/16566143.png
// @require             https://update.greasyfork.org/scripts/549920.js
// @match               https://web.whatsapp.com/*
// @connect             gist.github.com
// @grant               GM_addStyle
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_xmlhttpRequest
// @grant               GM_registerMenuCommand
// @run-at              document-idle
// @noframes
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @bgf-copyright       https://gist.github.com/0H4S/ae2fa82957a089576367e364cbf02438
// @bgf-colorLT         #007e0aff
// @bgf-colorDT         #00c510ff
// @downloadURL https://update.greasyfork.org/scripts/557471/Better%20WhatsApp.user.js
// @updateURL https://update.greasyfork.org/scripts/557471/Better%20WhatsApp.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*eslint-disable*/
    const SCRIPT_CONFIG = {
        notificationsUrl:   'https://gist.github.com/0H4S/4e3333a7048c03d9c0f740ab0270eb5e',
        scriptVersion:      '1.0',
    };

    const notifier = new ScriptNotifier(SCRIPT_CONFIG);
    notifier.run();

    // #region ESTILOS E CONFIGURAÇÃO

    // --- CONFIGURAÇÕES DO SCRIPT ---
    const CONFIG = {
        storageKey: 'SidePanelCollapsed',
        buttonId:   'layout-toggle-button',
        tooltipId:  'layout-toggle-tooltip',
        selectors: {
            sidePanelContainer: 'div[class*="_aigw"]',
            navBar:             'header[data-tab="2"] > div > div:first-child',
            messageContainer:   'div[role="row"]',
            messageMenuTrigger: 'div[data-js-context-icon="true"]',
            tabContent:         'span.x10l6tqk.x13vifvy.xtijo5x.x1ey2m1c.x1o0tod',
            ignoreClick:        'a, button, [role="button"], img[src*="blob:"], span[data-icon="audio-play"], span[data-icon="audio-pause"]'
        },
        icons: {
            collapse:   `<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>`,
            expand:     `<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>`,
            replyPath:  `M6.8249 12L9.7249 14.9C9.9249 15.1 10.0207 15.3334 10.0124 15.6C10.0041 15.8667 9.8999 16.1 9.6999 16.3C9.4999 16.4834 9.26657 16.5792 8.9999 16.5875C8.73324 16.5959 8.4999 16.5 8.2999 16.3L3.6999 11.7C3.4999 11.5 3.3999 11.2667 3.3999 11C3.3999 10.7334 3.4999 10.5 3.6999 10.3L8.2999 5.70005C8.48324 5.51672 8.7124 5.42505 8.9874 5.42505C9.2624 5.42505 9.4999 5.51672 9.6999 5.70005C9.8999 5.90005 9.9999 6.13755 9.9999 6.41255C9.9999 6.68755 9.8999 6.92505 9.6999 7.12505L6.8249 10H15.9999C17.3832 10 18.5624 10.4875 19.5374 11.4625C20.5124 12.4375 20.9999 13.6167 20.9999 15V18C20.9999 18.2834 20.9041 18.5209 20.7124 18.7125C20.5207 18.9042 20.2832 19 19.9999 19C19.7166 19 19.4791 18.9042 19.2874 18.7125C19.0957 18.5209 18.9999 18.2834 18.9999 18V15C18.9999 14.1667 18.7082 13.4584 18.1249 12.875C17.5416 12.2917 16.8332 12 15.9999 12H6.8249Z`
        }
    };

    // --- TRADUÇÕES ---
    const TRANSLATIONS = {
        'pt': {
            expandPanel:    'Expandir Painel',
            collapsePanel:  'Recolher Painel'
        },
        'en': {
            expandPanel:    'Expand Panel',
            collapsePanel:  'Collapse Panel'
        },
        'es': {
            expandPanel:    'Expandir Panel',
            collapsePanel:  'Contraer Panel'
        },
        'id': {
            expandPanel:    'Perluas Panel',
            collapsePanel:  'Ciutkan Panel'
        },
        'hi': {
            expandPanel:    'पैनल विस्तृत करें',
            collapsePanel:  'पैनल संक्षिप्त करें'
        }
    };

    function getTranslation(key) {
        const lang = (navigator.language || navigator.userLanguage).split('-')[0];
        const langTranslations = TRANSLATIONS[lang] || TRANSLATIONS['en'];
        return langTranslations[key] || TRANSLATIONS['en'][key];
    }

    // --- ESTILOS CSS ---
    const STYLES = `
        body.side-panel-collapsed ${CONFIG.selectors.sidePanelContainer}    {display: none !important;}
        body.side-panel-collapsed div[class*="_aigv"]                       {grid-template-columns: 0fr 10fr !important;}
        body.side-panel-collapsed header[data-tab="2"]                      {display: flex !important;visibility: visible !important;opacity: 1 !important;}
        body.side-panel-collapsed ${CONFIG.selectors.tabContent}            {display: none !important;}
        #${CONFIG.tooltipId}                                                {position: fixed;z-index: 9999;pointer-events: none;display: none;}
        #${CONFIG.tooltipId}.show                                           {display: block;}
        #${CONFIG.tooltipId} [role="tooltip"]                               {color: #303030;}
        @media (prefers-color-scheme: light) {
            #${CONFIG.tooltipId} [role="tooltip"]                           {color: #ffffff;}
        }
    `;
    GM_addStyle(STYLES);
    // #endregion

    // #region LÓGICA DE FUNCIONAMENTO

    let isCollapsed = GM_getValue(CONFIG.storageKey, false);

    // --- APLICAR ESTADO DO PAINEL (OCULTAR/MOSTRAR) ---
    function applyPanelState() {
        document.body.classList.toggle('side-panel-collapsed', isCollapsed);
        const toggleButton = document.getElementById(CONFIG.buttonId);
        if (toggleButton) {
            const iconContainer = toggleButton.querySelector('.icon-container');
            if (iconContainer) {
                iconContainer.innerHTML = isCollapsed ? CONFIG.icons.expand : CONFIG.icons.collapse;
            }
            updateTooltipText();
        }
    }

    // --- ALTERNAR ESTADO DO PAINEL LATERAL ---
    function togglePanel() {
        isCollapsed = !isCollapsed;
        GM_setValue(CONFIG.storageKey, isCollapsed);
        applyPanelState();
    }

    // --- CRIAR DICA DE FERRAMENTA ---
    function createTooltip() {
        const tooltipContainer = document.createElement('div');
        tooltipContainer.id    = CONFIG.tooltipId;
        tooltipContainer.setAttribute('data-animate-dropdown-item', 'true');
        tooltipContainer.className = 'xixxii4 x14g40p9 x1al4vs7';
        tooltipContainer.innerHTML = `<div class="x10l6tqk x8knxv4" style="inset: -8px;"></div><div class="x1n2onr6"><div role="tooltip" class="x1rg5ohu x1dc814f x1nxh6w3 xjafh1k x2b8uid xlyipyv x7opvkv xj5tmjb x12l2aii x1mbk4o x14vvt0a x1w3ol1v xf7dkkf xv54qhq x1y1aw1k xwib8y2">${getTranslation(isCollapsed ? 'expandPanel' : 'collapsePanel')}</div></div>`;
        document.body.appendChild(tooltipContainer);
        return tooltipContainer;
    }

    // --- ATUALIZAR TEXTO DA DICA DE FERRAMENTA ---
    function updateTooltipText() {
        const tooltip = document.getElementById(CONFIG.tooltipId);
        if (tooltip) {
            const tooltipText = tooltip.querySelector('[role="tooltip"]');
            if (tooltipText) {
                tooltipText.textContent = getTranslation(isCollapsed ? 'expandPanel' : 'collapsePanel');
            }
        }
    }

    // --- MOSTRAR DICA DE FERRAMENTA ---
    function showTooltip(button) {
        let tooltip = document.getElementById(CONFIG.tooltipId);
        if (!tooltip) {
            tooltip = createTooltip();
        }
        const svgIcon = button.querySelector('svg');
        if (svgIcon) {
            const svgRect                 = svgIcon.getBoundingClientRect();
            tooltip.style.visibility      = 'hidden';
            tooltip.style.display         = 'block';
            const tooltipHeight           = tooltip.offsetHeight;
            const svgCenterY              = svgRect.top + (svgRect.height / 2);
            const tooltipTop              = svgCenterY - (tooltipHeight / 2);
            const tooltipLeft             = svgRect.right + 16;
            tooltip.style.top             = `${tooltipTop}px`;
            tooltip.style.left            = `${tooltipLeft}px`;
            tooltip.style.transformOrigin = 'left center';
            tooltip.style.visibility      = 'visible';
        }
        tooltip.classList.add('show');
    }

    // --- ESCONDER DICA DE FERRAMENTA ---
    function hideTooltip() {
        const tooltip = document.getElementById(CONFIG.tooltipId);
        if (tooltip) {
            tooltip.classList.remove('show');
            tooltip.style.display    = 'none';
            tooltip.style.visibility = 'hidden';
        }
    }

    // --- BOTÃO DE ALTERNÂNCIA ---
    function createToggleButton(navBar) {
        if (document.getElementById(CONFIG.buttonId)) {
            return;
        }
        const buttonContainer = document.createElement('div');
        buttonContainer.className   = "x1c4vz4f xs83m0k xdl72j9 x1g77sc7 x78zum5 xozqiw3 x1oa3qoh x12fk4p8 xeuugli x2lwn1j x1nhvcw1 x1q0g3np x1cy8zhl x100vrsf x1vqgdyp x1ekkm8c x1143rjc xum4auv xj21bgg x1277o0a x13i9f1t xr9ek0c xjpr12u xw2npq5 xzs022t";
        buttonContainer.style.order = "-1";
        const button = document.createElement('button');
        button.id = CONFIG.buttonId;
        button.className = "xjb2p0i xk390pu x1heor9g x1ypdohk xjbqb8w x972fbf x10w94by x1qhh985 x14e42zd xtnn1bt x9v5kkp xmw7ebm xrdum7p xt8t1vi x1xc408v x129tdwq x15urzxu xh8yej3 x1y1aw1k xf159sx xwib8y2 xmzvs34";
        button.setAttribute('tabindex', '-1');
        button.addEventListener('click', togglePanel);
        button.addEventListener('mouseenter', () => showTooltip(button));
        button.addEventListener('mouseleave', hideTooltip);
        button.innerHTML = `<div class="x1c4vz4f xs83m0k xdl72j9 x1g77sc7 x78zum5 xozqiw3 x1oa3qoh x12fk4p8 xeuugli x2lwn1j x1nhvcw1 x1q0g3np x6s0dn4 xh8yej3"><div class="x1c4vz4f xs83m0k xdl72j9 x1g77sc7 x78zum5 xozqiw3 x1oa3qoh x12fk4p8 xeuugli x2lwn1j x1nhvcw1 x1q0g3np x6s0dn4 x1n2onr6" style="flex-grow: 1;"><div class="icon-container"></div></div></div>`;
        buttonContainer.appendChild(button);
        navBar.prepend(buttonContainer);
        applyPanelState();
    }

    // --- CLIQUE DIREITO ---
    function handleContextMenu(event) {
        const messageContainer = event.target.closest(CONFIG.selectors.messageContainer);
        if (messageContainer) {
            const menuTrigger = messageContainer.querySelector(CONFIG.selectors.messageMenuTrigger);
            if (menuTrigger) {
                event.preventDefault();
                event.stopPropagation();
                menuTrigger.click();
            }
        }
    }

    // --- CLIQUE ESQUERDO ---
    function handleMessageLeftClick(event) {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        if (event.target.closest(CONFIG.selectors.ignoreClick) || event.target.closest(CONFIG.selectors.messageMenuTrigger)) return;
        const messageContainer = event.target.closest(CONFIG.selectors.messageContainer);
        if (!messageContainer) return;
        const menuTrigger = messageContainer.querySelector(CONFIG.selectors.messageMenuTrigger);
        if (!menuTrigger) return;
        menuTrigger.click();
        clickReplyOption();
    }

    // --- RESPONDER ---
    function clickReplyOption() {
        let attempts      = 0;
        const maxAttempts = 50;
        const interval    = setInterval(() => {
            attempts++;
            const paths = document.querySelectorAll(`path[d="${CONFIG.icons.replyPath}"]`);
            if (paths.length > 0) {
                const targetPath = paths[paths.length - 1];
                const clickableItem = targetPath.closest('div[role="button"]') || targetPath.closest('li');
                if (clickableItem) {
                    clickableItem.click();
                    clearInterval(interval);
                    return;
                }
            }
            if (attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 10);
    }
    // #endregion

    // #region INICIALIZAR E OBSERVAR

    // --- OUVINTE PARA O BOTÃO DIREITO ---
    document.body.addEventListener('contextmenu', handleContextMenu, true);

    // --- OUVINTE PARA O BOTÃO ESQUERDO ---
    document.body.addEventListener('click', handleMessageLeftClick, true);

    // --- ESTADO INICIAL ---
    if (isCollapsed) {
        applyPanelState();
    }

    // --- MONITORAR MUDANÇAS E INJETAR ---
    const observer = new MutationObserver(() => {
        const navBar = document.querySelector(CONFIG.selectors.navBar);
        const sidePanel = document.querySelector(CONFIG.selectors.sidePanelContainer);
        if (navBar && sidePanel) {
            createToggleButton(navBar);
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    // #endregion
})();