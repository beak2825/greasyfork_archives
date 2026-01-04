// ==UserScript==
// @name        El Nostre Tauler de Control per a TikTok
// @name:es     Nuestro Panel de Control para TikTok
// @name:en     Our TikTok Control Panel
// @namespace   El nostre espai privat a TikTok.
// @namespace:es  Nuestro espacio privado en TikTok.
// @namespace:en  Our private space on TikTok.
// @match       *://www.tiktok.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     9.4 (Rhythm Control)
// @author      Anna (originals by Margu, @dmtri)
// @description Eina definitiva amb tema adaptable i control de bucles de vídeo.
// @description:es Herramienta definitiva con tema adaptable y control de bucles de vídeo.
// @description:en The ultimate tool with an adaptive theme and video loop control.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549628/El%20Nostre%20Tauler%20de%20Control%20per%20a%20TikTok.user.js
// @updateURL https://update.greasyfork.org/scripts/549628/El%20Nostre%20Tauler%20de%20Control%20per%20a%20TikTok.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const App = {
        // --- MAPA D'OBJECTIUS ---
        elementMap: {
            mainNav: { name: 'Menú principal esquerra', selector: '.e9sj7gd7.css-5f57fe-5e6d46e3--SubMainNavContentContainer', category: 'General' },
            footerNav: { name: 'Peu de pàgina del menú', selector: '.e9sj7gd8.css-42z4cf-5e6d46e3--SubMainNavFooterContainer', category: 'General' },
            topRightButtons: { name: 'Botons Missatges/Safata', selector: '.e10tfxq61.css-9novpx-5e6d46e3--DivFixedTopContainer', category: 'General' },
            uploadButton: { name: 'Botó de Pujar vídeo', selector: '.e18za1nb0.css-6w6pkg-5e6d46e3--DivTriggerButtonWrapper', category: 'General' },
            searchBar: { name: 'Barra de cerca', selector: '.e3pk5p611.css-13qhhpy-5e6d46e3--DivSearchBarContainer > .e17qpoe50.css-1bb483g-5e6d46e3--DivSearchFormContainer', category: 'General'},
            miniPlayer: { name: 'Mini reproductor (baix)', selector: '.e3pk5p610.css-1fdepl7-5e6d46e3--DivMiniPlayerContainer', category: 'General'},
            sideBar: { name: 'Barra lateral del vídeo', selector: '.e1196arh5.css-10pqo95-DivScrollingContentContainer', category: 'Panell de Vídeo' },
            actionButtons: { name: 'Panell (Like, Comentaris...)', selector: '.e11c9bxt0.css-adn7ap-5e6d46e3--DivButtonPanelWrapper', category: 'Panell de Vídeo' },
            effectsButton: { name: 'Botó d\'Efectes', selector: 'div.e1s4651v1.css-tvlexx-5e6d46e3--StyledTUXTooltip.TUXTooltip-reference:nth-of-type(5)', category: 'Panell de Vídeo' },
            shareButton: { name: 'Botó de Compartir', selector: '.e1roo5iv7.css-b5d1i1-5e6d46e3--DivBtnWrapper', category: 'Panell de Vídeo'},
            likedVideosTab: { name: 'Pestanya de "M\'agrada"', selector: '.ej9r3wt4.css-750edx-5e6d46e3--PLike', category: 'Perfil d\'Usuari' },
            repostTab: { name: 'Pestanya de "Reposts"', selector: '.e19uy6s72.css-1pkoxxg-PRepost', category: 'Perfil d\'Usuari' },
            privateAndCollectionTabs: { name: 'Pestanyes Privat/Col·lecció', selector: '.e178qcw41.css-4fwrfl-5e6d46e3--DivTabItemContainer', category: 'Perfil d\'Usuari'},
            sortByOldest: { name: 'Ordenar per més antic', selector: 'button.TUXSegmentedControl-item.TUXUnstyledButton:nth-of-type(3)', category: 'Perfil d\'Usuari' },
            stopVideoLoops: { name: 'Aturar bucles de vídeo', category: 'Reproductor' } // Aquesta no té selector, és una funció
        },

        state: {},
        processedVideos: new WeakSet(),

        async init() {
            this.state = JSON.parse(await GM_getValue('tiktokControlPanelSettings_v5', '{"stopVideoLoops": true}'));
            this.injectStyles();
            this.applyVisibilityRules();
            this.buildUI();
            this.initThemeDetector();
            this.initMasterObserver();
            console.log('[Tauler de Control TikTok] Sistema de control total operatiu.');
        },

        async toggleVisibility(key) {
            this.state[key] = !this.state[key];
            await GM_setValue('tiktokControlPanelSettings_v5', JSON.stringify(this.state));
            window.location.reload();
        },
        
        applyVisibilityRules() {
            const selectorsToHide = Object.keys(this.state)
                .filter(key => this.state[key] && this.elementMap[key] && this.elementMap[key].selector)
                .map(key => this.elementMap[key].selector);

            if (selectorsToHide.length > 0) {
                const style = document.createElement('style');
                style.id = 'anna-tiktok-visibility-rules';
                style.textContent = `${selectorsToHide.join(',\n')} { display: none !important; }`;
                document.head.appendChild(style);
            }
        },
        
        initThemeDetector() {
            this.panelElement = document.getElementById('anna-control-panel');
            this.themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.applyTheme();
            this.themeQuery.addEventListener('change', this.applyTheme.bind(this));
        },

        applyTheme() {
            this.panelElement.classList.toggle('acp-dark-theme', this.themeQuery.matches);
            this.panelElement.classList.toggle('acp-light-theme', !this.themeQuery.matches);
        },

        buildUI() {
            const panel = document.createElement('div');
            panel.id = 'anna-control-panel';
            const categories = {};
            for (const key in this.elementMap) {
                const element = this.elementMap[key];
                if (!categories[element.category]) categories[element.category] = '';
                const isHidden = this.state[key];
                categories[element.category] += `
                    <div class="acp-switch-container">
                        <label for="switch-${key}" class="acp-label">${element.name}</label>
                        <label class="acp-switch">
                            <input type="checkbox" id="switch-${key}" data-key="${key}" ${isHidden ? 'checked' : ''}>
                            <span class="acp-slider"></span>
                        </label>
                    </div>
                `;
            }
            let categoriesHTML = '';
            for (const categoryName in categories) {
                categoriesHTML += `<div class="acp-category"><div class="acp-category-title">${categoryName}</div>${categories[categoryName]}</div>`;
            }
            panel.innerHTML = `<div class="acp-header">El Nostre Tauler</div><div class="acp-body">${categoriesHTML}</div>`;
            document.body.appendChild(panel);
            this.addUIEventListeners();
        },

        addUIEventListeners() {
            document.getElementById('anna-control-panel').querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => this.toggleVisibility(e.target.dataset.key));
            });
        },
        
        // --- OBSERVADOR MESTRE (Guardià + Control de Bucles) ---
        initMasterObserver() {
            const errorSelector = '.emuynwa0.css-1tttox1-DivErrorContainer';
            const observer = new MutationObserver(() => {
                // Funció del Guardià d'Errors
                if (document.querySelector(errorSelector)) {
                    observer.disconnect();
                    window.location.reload();
                }
                // Funció de Control de Bucles
                if (this.state.stopVideoLoops) {
                    document.querySelectorAll("video").forEach(this.makeVideoNonLooping.bind(this));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        // --- NOVA FUNCIÓ: CONTROL DE BUCLES DE VÍDEO ---
        makeVideoNonLooping(vid) {
            if (this.processedVideos.has(vid)) return;
            this.processedVideos.add(vid);
            vid.removeAttribute("loop");

            let timeouts = [];
            const clearTimeouts = () => {
                timeouts.forEach(clearTimeout);
                timeouts = [];
            };

            const setupTimeout = () => {
                clearTimeouts();
                if (isNaN(vid.duration) || vid.duration === Infinity || vid.paused) return;
                
                const remainingTime = (vid.duration - vid.currentTime - 0.05) * 1000;
                if (remainingTime > 0) {
                    timeouts.push(setTimeout(() => vid.pause(), remainingTime));
                }
            };
            
            vid.addEventListener('loadedmetadata', setupTimeout);
            vid.addEventListener('seeked', setupTimeout);
            vid.addEventListener('play', setupTimeout);
            vid.addEventListener("pause", clearTimeouts);
            vid.addEventListener("ended", () => setTimeout(() => vid.pause(), 10));
        },

        injectStyles() {
            GM_addStyle(`
                #anna-control-panel {
                    position: fixed; bottom: 10px; right: 10px; width: 320px;
                    border-radius: 8px; z-index: 10000; font-family: sans-serif;
                    transform: translateX(calc(100% - 35px)); transition: transform 0.3s ease-in-out, background-color 0.3s, border-color 0.3s;
                }
                #anna-control-panel:hover { transform: translateX(0); }
                .acp-dark-theme { background-color: rgba(22, 24, 35, 0.9); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; backdrop-filter: blur(5px); }
                .acp-dark-theme .acp-header { background-color: rgba(255, 255, 255, 0.1); }
                .acp-dark-theme .acp-category-title { border-bottom-color: rgba(255, 255, 255, 0.2); }
                .acp-light-theme { background-color: rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 0, 0, 0.1); color: #000; backdrop-filter: blur(5px); }
                .acp-light-theme .acp-header { background-color: rgba(0, 0, 0, 0.05); }
                .acp-light-theme .acp-category-title { border-bottom-color: rgba(0, 0, 0, 0.1); }
                .acp-light-theme .acp-label { color: #333; }
                .acp-header { padding: 10px; font-weight: bold; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                .acp-body { padding: 15px; }
                .acp-category { margin-bottom: 15px; }
                .acp-category-title { font-size: 1em; font-weight: bold; color: #fe2c55; margin-bottom: 10px; padding-bottom: 5px; border-bottom-width: 1px; border-bottom-style: solid; }
                .acp-switch-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .acp-label { font-size: 14px; }
                .acp-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
                .acp-switch input { opacity: 0; width: 0; height: 0; }
                .acp-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
                .acp-light-theme .acp-slider { background-color: #ccc; }
                .acp-dark-theme .acp-slider { background-color: #4a4a4a; }
                .acp-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 0 2px rgba(0,0,0,0.3); }
                input:checked + .acp-slider { background-color: #fe2c55; }
                input:checked + .acp-slider:before { transform: translateX(20px); }
            `);
        }
    };

    if (document.body) {
        App.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => App.init());
    }
})();