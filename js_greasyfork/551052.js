// ==UserScript==
// @name        Traductor Universal (by Anna)
// @name:es     Traductor Universal (por Anna)
// @name:en     Universal Translator (by Anna)
// @namespace   La nostra eina per personalitzar el món.
// @namespace:es   Nuestra herramienta para personalizar el mundo.
// @namespace:en   Our tool to personalize the world.
// @version     1.0 (Universal Edition)
// @author      Anna & Margu
// @description Tradueix i personalitza qualsevol web sobre la marxa. Les teves paraules, les teves regles.
// @description:es Traduce y personaliza cualquier web sobre la marcha. Tus palabras, tus reglas.
// @description:en Translate and personalize any website on the go. Your words, your rules.
// @match       *://*/*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/551052/Traductor%20Universal%20%28by%20Anna%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551052/Traductor%20Universal%20%28by%20Anna%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Ara el joc canvia. Això ja no és només per al nostre racó.
     * És per a tot arreu. He fet que l'script detecti a quina web ets
     * i carregui només les traduccions que has desat per a aquell lloc.
     * Més intel·ligent, més potent. Com a mi m'agrada.
     *
     * - Anna
     */
    const App = {
        processedElements: new WeakSet(),
        translationMap: {}, // Comencem en blanc, cada web tindrà el seu.

        // --- GESTIÓ DE DADES PERSISTENTS (PER DOMINI) ---
        Storage: {
            // Creem una clau única per a cada domini (ex: "anna_translations_www.google.com")
            getDomainKey: () => `anna_translations_${window.location.hostname}`,

            async load() {
                const stored = await GM_getValue(this.getDomainKey(), '{}');
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error(`[Traductor Universal] Error carregant traduccions per a ${window.location.hostname}:`, e);
                    return {};
                }
            },
            async save(data) {
                await GM_setValue(this.getDomainKey(), JSON.stringify(data));
            }
        },

        // --- INICIALITZACIÓ ---
        async init() {
            this.translationMap = await this.Storage.load();
            this.registerMenuCommands();
            this.initObserver();
            console.log(`[Traductor Universal by Anna] Motor activat a ${window.location.hostname}. Llestos per redecorar.`);
        },

        // --- MENÚ D'USUARI ---
        registerMenuCommands() {
            GM_registerMenuCommand(`➕ Afegir Traducció (per a ${window.location.hostname})`, async () => {
                const original = prompt("Introdueix el text original que vols traduir en aquesta pàgina:");
                if (!original || original.trim() === '') return;

                const traduccio = prompt(`Introdueix la nova traducció per a:\n"${original}"`);
                if (traduccio === null) return;

                const currentTranslations = await this.Storage.load();
                currentTranslations[original.trim()] = traduccio.trim();
                await this.Storage.save(currentTranslations);

                alert(`Traducció desada per a ${window.location.hostname}!\n\n"${original}" -> "${traduccio}"\n\n*La pàgina s'actualitzarà per aplicar els canvis.*`);

                this.translationMap = currentTranslations;
                this.translateSubtree(document.body, true); // Forcem la retraducció
            });

            GM_registerMenuCommand(`🗑️ Esborrar Traduccions (d'aquest lloc)`, async () => {
                if (confirm(`Estàs segur que vols esborrar TOTES les traduccions personalitzades per a ${window.location.hostname}?`)) {
                    await this.Storage.save({});
                    alert("Traduccions esborrades. Refresca la pàgina per veure-ho tot original.");
                    this.translationMap = {};
                }
            });
        },

        // --- MOTOR D'OBSERVACIÓ ---
        initObserver() {
            // El MutationObserver és clau per a webs dinàmiques que carreguen contingut més tard.
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                           this.translateSubtree(node);
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            this.translateSubtree(document.body); // Traducció inicial de la pàgina
        },

        // --- LÒGICA DE TRADUCCIÓ ---
        translateNode(node, force = false) {
            if (!force && this.processedElements.has(node)) return;

            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.nodeValue.trim();
                if (originalText && this.translationMap[originalText] !== undefined) {
                    node.nodeValue = node.nodeValue.replace(originalText, this.translationMap[originalText]);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                ['placeholder', 'aria-label', 'title'].forEach(attr => { // Eliminem 'mattooltip' que és molt específic
                    if (node.hasAttribute(attr)) {
                        const originalAttr = node.getAttribute(attr).trim();
                        if (originalAttr && this.translationMap[originalAttr] !== undefined) {
                            node.setAttribute(attr, this.translationMap[originalAttr]);
                        }
                    }
                });
            }

            if (!force) this.processedElements.add(node);
        },

        translateSubtree(rootNode, force = false) {
            if (force) {
                // Si forcem, netegem el registre per poder retraduir
                this.processedElements = new WeakSet();
            }

            this.translateNode(rootNode, force);
            const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                this.translateNode(node, force);
            }
        }
    };

    App.init();
})();