// ==UserScript==
// @name        Estudi d'Idees: Edició Definitiva (by Anna)
// @name:es     Estudio de Ideas: Edición Definitiva (por Anna)
// @name:en     Study of Ideas: Definitive Edition (by Anna)
// @namespace   El nostre Estudi d'Idees privat.
// @version     12.2 (Aqui tienes manuelsfc11. 😁👍🏻)
// @author      Anna
// @icon        https://www.gstatic.com/aistudio/ai_studio_favicon_2_32x32.png
// @description He transformat AI Studio en el nostre xat privat estil WhatsApp. Amb el Tauler de Control, pots demolir la interfície al teu gust, gaudir de l'escriptura immersiva i crear les teves pròpies regles al Laboratori. El nostre espai, les nostres regles.
// @description:es He transformado AI Studio en nuestro chat privado estilo WhatsApp. Con el Panel de Control, puedes demoler la interfaz a tu gusto, disfrutar de la escritura inmersiva y crear tus propias reglas en el Laboratorio. Nuestro espacio, nuestras reglas.
// @description:en I've transformed AI Studio into our private WhatsApp-style chat. With the Control Panel, you can demolish the interface to your liking, enjoy immersive writing, and create your own rules in the Lab. Our space, our rules.
// @match       https://aistudio.google.com/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/549994/Estudi%20d%27Idees%3A%20Edici%C3%B3%20Definitiva%20%28by%20Anna%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549994/Estudi%20d%27Idees%3A%20Edici%C3%B3%20Definitiva%20%28by%20Anna%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const App = {
        elementMap: {
            demolitionMode: { name: "Activar Mode Demolició", category: "Mode de Control" },
            immersiveWriting: { name: "Escriptura Immersiva", category: "Panell de Conversa"},
            sidebar: { name: "Menú lateral sencer", selector: ".sidebar", category: "General & Menú"},
            collapseButton: { name: "Botó d'amagar menú", selector: "button[aria-label='Collapse sidebar']", category: "General & Menú"},
            tooltips: { name: "Tooltips d'ajuda", selector: ".mdc-tooltip__surface.mat-mdc-tooltip-surface", category: "General & Menú"},
            getCodeButton: { name: "Botó 'Obtenir Codi'", selector: "ms-get-code-button", category: "General & Menú"},
            headerRightButtons: { name: "Botons dreta capçalera", selector: ".right > .ng-star-inserted > .ms-button-small", category: "General & Menú"},
            navExpansionPanel: { name: "Panell 'Dashboard' (Menú)", selector: "mat-expansion-panel.nav-expansion-panel:nth-of-type(2)", category: "General & Menú"},
            documentationLink: { name: "Enllaç a Documentació", selector: ".documentation-link", category: "General & Menú"},
            userPanel: { name: "Panell inferior d'usuari (sencer)", selector: ".sidebar-bottom-actions", category: "General & Menú"},
            hideReasoningPanel: { name: "Panell de Raonament", selector: "reasoning-panel", category: "Panell de Conversa"},
            feedbackButtons: { name: "Botons de Feedback (Polzes)", selector: "button.response-feedback-button", category: "Barra d'Eines de Resposta"},
            copyButton: { name: "Botó de Copiar", selector: "button.mat-mdc-tooltip-trigger[aria-label*='Copy']", category: "Barra d'Eines de Resposta"},
            compareButton: { name: "Botó de Comparació", selector: "button.compare-button", category: "Barra d'Eines de Resposta"},
            moreActionsButton: { name: "Botó 'Més accions'", selector: "button.mat-mdc-tooltip-trigger[aria-label*='actions']", category: "Barra d'Eines de Resposta"},
            shareButton: { name: "Botó de Compartir (Inestable)", selector: "div.button-wrapper:nth-of-type(3)", category: "Barra d'Eines de Resposta"},
            structuredOutput: { name: "Sortida Estructurada", selector: "structured-output-config", category: "Panell d'Ajustos"},
            functionCalling: { name: "Crida de Funcions", selector: "function-calling-config", category: "Panell d'Ajustos"},
            thinkingBudget: { name: "Pressupost de Raonament", selector: ".thinking-budget-setting", category: "Panell d'Ajustos"},
            mediaResolution: { name: "Resolució de Mèdia", selector: ".media-resolution-selector", category: "Panell d'Ajustos"},
        },
        defaultElementMap: {},
        translationMap: {
            "Gemini": "Estudi d'Idees", "New chat": "Nova conversa", "Run": "Executa", "Studio": "Estudi",
            "Chat": "Xat", "History": "Historial", "Library": "Biblioteca", "Get API key": "Obtenir clau API",
            "Settings": "Configuració", "Model": "Assistent", "Enter a prompt here": "Escriu la teva idea aquí...",
            "Run settings": "Paràmetres d'Execució", "Get code": "Obtenir Codi", "Temperature": "Temperatura",
            "Top P": "Top P", "Top K": "Top K", "Structured output": "Sortida Estructurada",
            "Function calling": "Crida de Funcions", "Media resolution": "Resolució de Mèdia", "Default": "Per defecte",
            "New": "Nou", "Code chat": "Xat de codi", "Send feedback": "Enviar comentaris", "Updates": "Actualitzacions",
            "Privacy Policy": "Política de Privadesa", "Terms of Service": "Termes del Servei", "Untitled chat": "Conversa sense títol",
            "Stop generating": "Aturar generació", "Regenerate": "Torna a generar", "This prompt is running": "Processant la teva idea...",
            "Edit selected": "Editar", "Delete": "Elimina", "Run prompt": "Executar idea", "Cancel generation": "Cancel·lar generació",
            "Thinking": "Raonament", "Thinking mode": "Mode de Raonament", "Set thinking budget": "Establir pressupost",
            "Tools": "Eines", "Code execution": "Execució de Codi", "Grounding with Google Search": "Context amb Google Search",
            "URL context": "Context per URL", "Advanced settings": "Ajustos avançats", "Add stop sequence": "Afegir límit de parada",
            "Add stop...": "Afegir...", "Output length": "Llargada de sortida", "Safety settings": "Ajustos de seguretat",
            "Edit safety settings": "Editar ajustos de seguretat", "Harassment": "Assetjament", "Hate speech": "Discurs d'odi",
            "Sexually explicit": "Sexualment explícit", "Dangerous content": "Contingut perillós", "Block few": "Bloquejar pocs",
            "Block some": "Bloquejar alguns", "Block most": "Bloquejar la majoria", "Edit": "Editar", "Saved to Drive": "Desat al Drive",
            "Make a copy": "Fer una còpia", "View more actions": "Veure més accions", "Compare mode": "Mode de comparació",
            "Share prompt": "Comparteix la idea", "Show conversation without markdown formatting": "Mostra la conversa sense format",
            "System instructions": "Instruccions del sistema", "Start typing a prompt": "", "Stop": "Atura",
            "Google AI models may make mistakes, so double-check outputs.": "Els assistents d'IA poden cometre errors, així que verifica les respostes.",
            "Creativity allowed in the responses": "Creativitat permesa a les respostes",
            "Unable to disable thinking mode for this model.": "No es pot desactivar el mode de raonament per a aquest assistent.",
            "Let the model decide how many thinking tokens to use or choose your own value": "Deixa que l'assistent decideixi quants tokens de raonament utilitzar o tria el teu propi valor",
            "Lets Gemini use code to solve complex tasks": "Permet a l'assistent utilitzar codi per resoldre tasques complexes",
            "Use Google Search": "Utilitzar Google Search", "Browse the url context": "Analitzar el context de la URL",
            "Probability threshold for top-p sampling": "Llindar de probabilitat per al mostreig top-p",
            "Maximum number of tokens in response": "Nombre màxim de tokens a la resposta",
            "Truncate response including and after string": "Trunca la resposta a partir d'aquesta cadena de text",
            "Adjust harmful response settings": "Ajustar la configuració de respostes perilloses",
            "Stream": "Flux", "Build": "Construir"
        },
        defaultTranslationMap: {},
        processedElements: new WeakSet(),
        state: {},

        async init() {
            this.defaultElementMap = JSON.parse(JSON.stringify(this.elementMap));
            this.defaultTranslationMap = JSON.parse(JSON.stringify(this.translationMap));

            const defaults = { demolitionMode: false, immersiveWriting: true, autoApply: false };
            const storedState = JSON.parse(await GM_getValue('ideesControlPanel_v14_phoenix', '{}'));
            this.state = { ...defaults, ...storedState };

            this.elementMap = await GM_getValue('userElementMap_v14', this.defaultElementMap);
            this.translationMap = await GM_getValue('userTranslationMap_v14', this.defaultTranslationMap);

            this.injectStyles();
            if (this.state.demolitionMode) {
                this.applyVisibilityRules();
            }
            this.buildUI();
            this.initObserver();
            this.initEnterToSend();
            console.log("[Estudi d'Idees] La Fènix ha ressorgit.");
        },

        async saveState(key, value) {
            this.state[key] = value;
            await GM_setValue('ideesControlPanel_v14_phoenix', JSON.stringify(this.state));
            if (this.state.autoApply || key === 'demolitionMode') {
                window.location.reload();
            }
        },

        applyAllRules() {
            window.location.reload();
        },

        applyVisibilityRules() {
            const selectorsToHide = Object.keys(this.state)
                .filter(key => this.state[key] && this.elementMap[key]?.selector)
                .map(key => this.elementMap[key].selector.startsWith('##') ? this.elementMap[key].selector.substring(2) : this.elementMap[key].selector);
            this.addDynamicStyle('demolition-rules', selectorsToHide.length > 0 ? `${selectorsToHide.join(',\n')} { display: none !important; }` : '');
        },

        addDynamicStyle(id, css) {
            let style = document.getElementById(id);
            if (!style) { style = document.createElement('style'); style.id = id; document.head.appendChild(style); }
            style.textContent = css;
        },

        buildUI() {
            const panel = document.createElement('div');
            panel.id = 'anna-control-panel';
            const categories = {};
            const createSwitchHTML = (key, element) => `<div class="acp-switch-container"><label class="acp-label" title="${element.selector || ''}">${element.name}</label><label class="acp-switch"><input type="checkbox" data-key="${key}" ${this.state[key] ? 'checked' : ''}><span class="acp-slider"></span></label></div>`;

            const demolitionKey = 'demolitionMode';
            categories[this.elementMap[demolitionKey].category] = createSwitchHTML(demolitionKey, this.elementMap[demolitionKey]);

            const functionalCategory = "Panell de Conversa";
            if (!categories[functionalCategory]) categories[functionalCategory] = '';
            categories[functionalCategory] += createSwitchHTML('immersiveWriting', this.elementMap['immersiveWriting']);

            if (this.state.demolitionMode) {
                for (const key in this.elementMap) {
                    if (key === demolitionKey || this.elementMap[key].category === "Panell de Conversa") continue;
                    const element = this.elementMap[key];
                    if (!categories[element.category]) categories[element.category] = '';
                    categories[element.category] += createSwitchHTML(key, element);
                }
            }

            let categoriesHTML = '';
            const categoryOrder = ["Mode de Control", "Panell de Conversa", "General & Menú", "Barra d'Eines de Resposta", "Panell d'Ajustos", "Les Teves Regles"];
            categoryOrder.forEach(categoryName => {
                if(categories[categoryName]) {
                    categoriesHTML += `<div class="acp-category"><div class="acp-category-title">${categoryName}</div>${categories[categoryName]}</div>`;
                }
            });

            if (this.state.demolitionMode) {
                categoriesHTML += `
                    <div class="acp-category">
                        <div class="acp-category-title">Laboratori</div>
                        <div class="acp-lab-section">
                            <label>Nova Regla de Demolició</label>
                            <input type="text" id="acp-demolition-name" class="acp-input" placeholder="Nom de l'objectiu...">
                            <textarea id="acp-demolition-selector" class="acp-textarea" placeholder="Selector CSS..."></textarea>
                            <button id="acp-add-demolition">Afegeix i Recarrega</button>
                        </div>
                        <div class="acp-lab-section">
                            <label>Nova Traducció</label>
                            <input type="text" id="acp-translation-key" class="acp-input" placeholder="Text original en anglès...">
                            <textarea id="acp-translation-value" class="acp-textarea" placeholder="Teua traducció..."></textarea>
                            <button id="acp-add-translation">Afegeix i Recarrega</button>
                        </div>
                    </div>`;
            }

            const footerHTML = `
                <div class="acp-footer">
                    <button id="acp-apply-button">Aplica i Recarrega</button>
                    <div class="acp-auto-apply">
                        <label for="acp-auto-checkbox">Auto</label>
                        <input type="checkbox" id="acp-auto-checkbox" ${this.state.autoApply ? 'checked' : ''}>
                    </div>
                </div>
            `;

            panel.innerHTML = `<div class="acp-header">El Nostre Tauler</div><div class="acp-body">${categoriesHTML}</div>${footerHTML}`;
            document.body.appendChild(panel);
            this.addUIEventListeners();
        },

        addUIEventListeners() {
            const panel = document.getElementById('anna-control-panel');
            panel.querySelectorAll('input[type="checkbox"][data-key]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => this.saveState(e.target.dataset.key, e.target.checked));
            });
            panel.querySelector('#acp-apply-button').addEventListener('click', () => this.applyAllRules());
            panel.querySelector('#acp-auto-checkbox').addEventListener('change', (e) => this.saveState('autoApply', e.target.checked));
            const addDemolitionBtn = panel.querySelector('#acp-add-demolition');
            if (addDemolitionBtn) {
                addDemolitionBtn.addEventListener('click', async () => {
                    const name = panel.querySelector('#acp-demolition-name').value.trim();
                    const selector = panel.querySelector('#acp-demolition-selector').value.trim();
                    if (name && selector) {
                        const key = name.toLowerCase().replace(/\s+/g, '');
                        this.elementMap[key] = { name, selector, category: "Les Teves Regles" };
                        await GM_setValue('userElementMap_v14', this.elementMap);
                        window.location.reload();
                    }
                });
            }
            const addTranslationBtn = panel.querySelector('#acp-add-translation');
            if (addTranslationBtn) {
                addTranslationBtn.addEventListener('click', async () => {
                    const key = panel.querySelector('#acp-translation-key').value.trim();
                    const value = panel.querySelector('#acp-translation-value').value.trim();
                    if (key && value) {
                        this.translationMap[key] = value;
                        await GM_setValue('userTranslationMap_v14', this.translationMap);
                        window.location.reload();
                    }
                });
            }
        },

        initEnterToSend() {
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                    const activeElement = document.activeElement;
                    if (activeElement?.tagName === 'TEXTAREA') {
                        event.preventDefault(); event.stopPropagation();
                        const ctrlEnter = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, ctrlKey: true });
                        activeElement.dispatchEvent(ctrlEnter);
                    }
                }
            }, true);
        },

        initObserver() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (this.state.immersiveWriting) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && node.matches('.model-response-container')) {
                                this.handleImmersiveBubble(node);
                            }
                        }
                    }
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) this.translateTree(node);
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            this.translateTree(document.body);
        },

        handleImmersiveBubble(responseContainer) {
            const textChunk = responseContainer.querySelector('.text-chunk');
            if (!textChunk || this.processedElements.has(textChunk)) return;
            this.processedElements.add(textChunk);
            const content = textChunk.querySelector('.chunk-content');
            if (!content) return;
            content.style.visibility = 'hidden';
            content.style.minHeight = '2em';
            const tempContent = document.createElement('div');
            tempContent.className = 'temp-writing-content';
            tempContent.innerHTML = `<div class="writing-indicator"><span></span><span></span><span></span></div><span>Escribint...</span>`;
            textChunk.prepend(tempContent);
            const stopButton = document.querySelector('button[aria-label="Stop generating"], button[aria-label="Aturar generació"]');
            const generationObserver = new MutationObserver(() => {
                if (!document.body.contains(document.querySelector('button[aria-label="Stop generating"], button[aria-label="Aturar generació"]'))) {
                    generationObserver.disconnect();
                    tempContent.remove();
                    content.style.visibility = 'visible';
                    content.style.minHeight = '0';
                }
            });
            const containerToObserve = document.querySelector('.main-content .bottom-scrim') || document.body;
            generationObserver.observe(containerToObserve, { childList: true, subtree: true });
        },

        translateTree(rootNode) {
            const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => this.processedElements.has(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
            });
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.nodeType === 3) {
                    const originalText = node.nodeValue.trim();
                    if (this.translationMap[originalText]) {
                        node.nodeValue = node.nodeValue.replace(originalText, this.translationMap[originalText]);
                    }
                } else if (node.nodeType === 1) {
                    if (node.matches('.conversation-title-text') && node.textContent.includes('PornHub Plus Script')) {
                        node.textContent = 'El Nostre Projecte';
                    }
                    ['placeholder', 'aria-label', 'title'].forEach(attr => {
                        if (node.hasAttribute(attr)) {
                            const originalAttr = node.getAttribute(attr).trim();
                            if (this.translationMap[originalAttr]) node.setAttribute(attr, this.translationMap[originalAttr]);
                        }
                    });
                }
                this.processedElements.add(node);
            }
        },

        injectStyles() {
            GM_addStyle(`
                :root {
                    --wa-bg: #f5f1eb; --wa-chat-bg: #f5f1eb; --wa-user-bubble: #DCF8C6;
                    --wa-model-bubble: #FFFFFF; --wa-main-text: #303030; --wa-secondary-text: #667781;
                    --wa-header-bg: #F0F2F5; --wa-panel-bg: #F0F2F5; --wa-input-bg: #F0F2F5;
                    --wa-input-box-bg: #FFFFFF; --wa-border: #D1D7DB; --wa-shadow: rgba(17, 27, 33, 0.15);
                    --wa-accent: #008069; --wa-color-v3-surface: #F5F1ED
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --wa-bg: #0B141A; --wa-chat-bg: #0B141A; --wa-user-bubble: #005C4B;
                        --wa-model-bubble: #202C33; --wa-main-text: #E9EDEF; --wa-secondary-text: #8696A0;
                        --wa-header-bg: #202C33; --wa-panel-bg: #111B21; --wa-input-bg: #202C33;
                        --wa-input-box-bg: #2A3942; --wa-border: #334048; --wa-shadow: rgba(0, 0, 0, 0.2);
                        --wa-accent: #00A884;
                    }
                }
                body, .mat-typography { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important; }
                .app-container, .run-history-container { background-color: var(--wa-bg) !important; }
                .conversation-container { background-color: var(--wa-chat-bg) !important; }
                .conversation { max-width: 1439px !important; margin: 0 auto !important; padding: 20px !important; }
                .prompt-input-wrapper.mat-mdc-tooltip-trigger { max-width: 1439px !important; margin: 0 auto !important; }
                .user-prompt-container { display: flex; justify-content: flex-end; }
                .model-prompt-container { display: flex; justify-content: flex-start; }
                .main-content { background: none !important; }
                .app-header {
                    background-color: var(--wa-header-bg) !important; color: var(--wa-main-text) !important;
                    border-bottom: 1px solid var(--wa-border) !important; box-shadow: none !important;
                }
                .app-header .app-title { font-weight: 500 !important; font-size: 18px !important; }
                .sidebar, .run-history-panel, .mat-drawer-inner-container { background-color: var(--wa-panel-bg) !important; }
                .sidebar, .run-history-panel {
                    border: none !important; box-shadow: 0 4px 12px var(--wa-shadow) !important; margin: 0 !important; height: 100vh !important;
                    border-radius: 0 !important;
                }
                .run-history-panel { border-left: 1px solid var(--wa-border) !important; }
                .prompt-input-container {
                    background-color: var(--wa-input-bg) !important;
                    border-top: 1px solid var(--wa-border) !important; padding: 8px 16px !important;
                }
                .prompt-input-wrapper, .input-area {
                    background-color: var(--wa-input-box-bg) !important; border: none !important;
                    border-radius: 24px !important;
                }
                textarea { color: var(--wa-main-text) !important; font-size: 15px !important; }
                .user-prompt-container .text-chunk, .model-prompt-container .text-chunk {
                    padding: 8px 12px !important; border-radius: 7.5px !important;
                    box-shadow: 0 1px 0.5px var(--wa-shadow) !important; max-width: 70% !important;
                }
                .user-prompt-container .text-chunk { background-color: var(--wa-user-bubble) !important; border-bottom-right-radius: 0 !important; }
                .model-prompt-container .text-chunk { background-color: var(--wa-model-bubble) !important; border-bottom-left-radius: 0 !important; }
                .text-chunk, .chunk-content, .chunk-content p { color: var(--wa-main-text) !important; font-size: 14px !important; line-height: 1.5 !important; }
                #anna-control-panel {
                    position: fixed; bottom: 10px; right: 10px; width: 320px;
                    background-color: var(--wa-panel-bg) !important; border: 1px solid var(--wa-border) !important;
                    color: var(--wa-main-text) !important;
                    border-radius: 12px; z-index: 10000;
                    transform: translateX(calc(100% - 40px));
                    transition: transform 0.3s ease-in-out;
                    box-shadow: 0 4px 12px var(--wa-shadow);
                }
                #anna-control-panel:hover { transform: translateX(0); }
                .acp-header { padding: 12px; font-weight: bold; text-align: center; color: var(--wa-main-text); border-bottom: 1px solid var(--wa-border); }
                .acp-body { padding: 15px; max-height: 70vh; overflow-y: auto; }
                .acp-category { margin-bottom: 15px; }
                .acp-category-title { font-size: 1em; font-weight: bold; color: var(--wa-accent); margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid var(--wa-border); }
                .acp-switch-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .acp-label { font-size: 14px; color: var(--wa-main-text); }
                .acp-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
                .acp-switch input { opacity: 0; width: 0; height: 0; }
                .acp-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--wa-secondary-text); transition: .4s; border-radius: 20px; }
                .acp-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .acp-slider { background-color: var(--wa-accent); }
                input:checked + .acp-slider:before { transform: translateX(20px); }

                .acp-lab-section { margin-top: 20px; }
                .acp-lab-section label { font-size: 13px; font-weight: bold; color: var(--wa-secondary-text); display: block; margin-bottom: 8px; }
                .acp-input, .acp-textarea {
                    width: 100%; box-sizing: border-box; padding: 8px;
                    border-radius: 8px; font-size: 12px;
                    background: var(--wa-input-box-bg); color: var(--wa-main-text); border: 1px solid var(--wa-border); margin-bottom: 8px;
                }
                .acp-textarea { min-height: 60px; resize: vertical; }
                .acp-lab-section button {
                    width: 100%; padding: 8px; margin-top: 5px; border-radius: 6px;
                    border: none; background-color: var(--wa-accent); color: white;
                    font-weight: bold; cursor: pointer; transition: opacity 0.2s;
                }
                .acp-lab-section button:hover { opacity: 0.8; }
                .acp-footer {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 10px 15px; border-top: 1px solid var(--wa-border);
                }
                #acp-apply-button {
                    flex-grow: 1; padding: 8px; border-radius: 6px; border: none;
                    background-color: var(--wa-accent); color: white; font-weight: bold;
                    cursor: pointer; transition: opacity 0.2s;
                }
                #acp-apply-button:hover { opacity: 0.8; }
                .acp-auto-apply { display: flex; align-items: center; margin-left: 10px; }
                .acp-auto-apply label { font-size: 13px; color: var(--wa-secondary-text); margin-right: 5px; }

                .temp-writing-content { display: flex; align-items: center; color: var(--wa-secondary-text); font-style: italic; }
                .writing-indicator span {
                    display: inline-block; width: 6px; height: 6px; border-radius: 50%;
                    background-color: var(--wa-secondary-text); margin: 0 2px;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .writing-indicator span:nth-of-type(1) { animation-delay: -0.32s; }
                .writing-indicator span:nth-of-type(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
            `);
        }
    };

    (async () => {
        let state = JSON.parse(await GM_getValue('ideesControlPanel_v14_phoenix', '{}'));
        let updated = false;
        for (const key in App.elementMap) {
            if (state[key] === undefined) {
                state[key] = ['immersiveWriting'].includes(key);
                updated = true;
            }
        }
        if (updated) {
            await GM_setValue('ideesControlPanel_v14_phoenix', JSON.stringify(state));
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => App.init());
        } else {
            App.init();
        }
    })();
})();