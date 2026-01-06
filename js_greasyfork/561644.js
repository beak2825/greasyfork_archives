// ==UserScript==
// @name         Duolingo Max & Super Family Selector
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Panneau flottant permettant de choisir entre les modes Duolingo Max et Duolingo Super. Inclut une fonctionnalité d'acceptation automatique des invitations de famille. Code propre et non obfusqué.
// @author       DuolingoHackerScript🤪
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/max/9f30dad6d7cc6723deeb2bd9e2f85dd8.svg
// @match        *://*.duolingo.com/*
// @match        *://*.duolingo.cn/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561644/Duolingo%20Max%20%20Super%20Family%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/561644/Duolingo%20Max%20%20Super%20Family%20Selector.meta.js
// ==/UserScript==

/**
 * Ce script intercepte les requêtes API de Duolingo pour simuler un abonnement Premium (Max ou Super).
 * Il respecte les règles de transparence : le code est lisible et modifiable par l'utilisateur.
 */

(function() {
    'use strict';

    // --- ÉTAT ET SAUVEGARDE ---
    // Récupération du mode préféré (par défaut : MAX)
    let currentMode = localStorage.getItem('duo_plus_mode') || 'MAX';

    // --- CONFIGURATION DES ABONNEMENTS ---
    const SUBSCRIPTIONS = {
        MAX: {
            id: 'gold_subscription',
            track: 'has_item_gold_subscription',
            icon: 'https://d35aaqx5ub95lt.cloudfront.net/images/max/9f30dad6d7cc6723deeb2bd9e2f85dd8.svg'
        },
        SUPER: {
            id: 'premium_subscription',
            track: 'has_item_premium_subscription',
            icon: 'https://d35aaqx5ub95lt.cloudfront.net/images/hearts/b3a04a561c7d0b2b5247a40e18d64946.svg'
        }
    };

    // --- LOGIQUE D'INTERCEPTION API ---
    const TARGET_URL_REGEX = /https?:\/\/(?:[a-zA-Z0-9-]+\.)?duolingo\.[a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?\/\d{4}-\d{2}-\d{2}\/users\/.+/;

    /**
     * Modifie la réponse JSON pour activer les fonctionnalités premium
     * @param {string} jsonText - Le contenu original de la réponse
     * @returns {string} - Le contenu modifié
     */
    function modifyJson(jsonText) {
        try {
            const data = JSON.parse(jsonText);
            const mode = SUBSCRIPTIONS[currentMode];

            data.hasPlus = true;
            if (!data.trackingProperties) data.trackingProperties = {};
            
            // Mise à jour des propriétés de suivi selon le mode choisi
            data.trackingProperties.has_item_gold_subscription = (currentMode === 'MAX');
            data.trackingProperties.has_item_premium_subscription = (currentMode === 'SUPER');

            // Injection de l'item d'abonnement dans le magasin
            data.shopItems = { 
                ...data.shopItems, 
                [mode.id]: {
                    itemName: mode.id,
                    subscriptionInfo: {
                        vendor: "STRIPE",
                        renewing: true,
                        isFamilyPlan: true,
                        expectedExpiration: 9999999999000
                    }
                }
            };
            return JSON.stringify(data);
        } catch (e) { 
            return jsonText; 
        }
    }

    // Interception globale des appels fetch
    const originalFetch = window.fetch;
    window.fetch = function(resource, options) {
        const url = resource instanceof Request ? resource.url : resource;
        const method = (resource instanceof Request) ? resource.method : (options?.method || 'GET');
        
        if (method.toUpperCase() === 'GET' && TARGET_URL_REGEX.test(url) && !url.includes('/shop-items')) {
            return originalFetch.apply(this, arguments).then(async (response) => {
                const cloned = response.clone();
                const text = await cloned.text();
                const modified = modifyJson(text);
                return new Response(modified, { 
                    status: response.status, 
                    statusText: response.statusText, 
                    headers: response.headers 
                });
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // --- INTERFACE UTILISATEUR (PANNEAU FLOTTANT) ---
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'duo-selector-panel';
        panel.innerHTML = `
            <div id="duo-panel-header">
                <div id="duo-header-title">
                    <div class="header-icons">
                        <img src="${SUBSCRIPTIONS.MAX.icon}" class="mini-heart">
                        <img src="${SUBSCRIPTIONS.SUPER.icon}" class="mini-heart">
                    </div>
                    <span>DuoHack Premium</span>
                </div>
                <div class="header-right">
                    <span id="duo-version-tag">V.4.4</span>
                    <div id="duo-drag-handle">⠿</div>
                </div>
            </div>
            <div id="duo-author-info">
                By DuolingoHackerScript🤪
            </div>
            <div class="duo-option ${currentMode === 'MAX' ? 'active' : ''}" data-mode="MAX">
                <div class="option-content">
                    <img src="${SUBSCRIPTIONS.MAX.icon}" alt="Cœur Max">
                    <span>Duolingo Max</span>
                </div>
                <div class="status-dot"></div>
            </div>
            <div class="duo-option ${currentMode === 'SUPER' ? 'active' : ''}" data-mode="SUPER">
                <div class="option-content">
                    <img src="${SUBSCRIPTIONS.SUPER.icon}" alt="Cœur Super">
                    <span>Duolingo Super</span>
                </div>
                <div class="status-dot"></div>
            </div>
            <div id="duo-footer-status">Système actif</div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #duo-selector-panel {
                position: fixed; top: 120px; right: 20px; width: 260px;
                background: white; border: 3px solid #58cc02; border-radius: 20px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15); z-index: 999999;
                font-family: "din-round", "Segoe UI", sans-serif; overflow: hidden;
                user-select: none;
            }
            #duo-panel-header {
                background: #58cc02; padding: 12px 15px;
                display: flex; justify-content: space-between; align-items: center;
                color: white; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
            }
            #duo-header-title { display: flex; align-items: center; gap: 10px; }
            .header-icons { display: flex; align-items: center; gap: 4px; }
            .mini-heart { width: 22px; height: 22px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
            .header-right { display: flex; align-items: center; gap: 8px; }
            #duo-version-tag { font-size: 10px; opacity: 0.9; font-weight: 900; background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 8px; }
            #duo-drag-handle { cursor: move; font-size: 20px; opacity: 0.8; }
            #duo-author-info {
                background: #f1f1f1; color: #777; font-size: 11px;
                text-align: center; padding: 6px 0; border-bottom: 2px solid #e5e5e5;
                font-weight: 700;
            }
            .duo-option {
                display: flex; justify-content: space-between; align-items: center;
                padding: 15px; cursor: pointer; border-bottom: 2px solid #f0f0f0;
                transition: all 0.2s;
            }
            .duo-option:hover { background: #f7f7f7; }
            .duo-option.active { background: #e5f9ff; border-left: 6px solid #1cb0f6; }
            .option-content { display: flex; align-items: center; }
            .duo-option img { width: 32px; height: 32px; margin-right: 12px; }
            .duo-option span { font-weight: 700; color: #4b4b4b; font-size: 15px; }
            .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #ddd; }
            .active .status-dot { background: #1cb0f6; box-shadow: 0 0 5px #1cb0f6; }
            #duo-footer-status {
                font-size: 10px; padding: 8px; text-align: center;
                color: #58cc02; font-weight: 800; text-transform: uppercase;
                background: #f7fff0;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);

        // Sélection du mode au clic
        panel.querySelectorAll('.duo-option').forEach(opt => {
            opt.onclick = () => {
                const mode = opt.dataset.mode;
                localStorage.setItem('duo_plus_mode', mode);
                window.location.reload();
            };
        });

        // Gestion du déplacement (Drag & Drop)
        let isDragging = false;
        let offsetX, offsetY;
        const handle = document.getElementById('duo-drag-handle');
        
        handle.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = "none";
        };
        
        document.onmousemove = (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        };
        
        document.onmouseup = () => { 
            isDragging = false; 
        };
    }

    // --- LOGIQUE AUTOMATIQUE D'ACCEPTATION ---
    function autoClickInvitation() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            const text = btn.innerText.toLowerCase();
            if (text.includes('rejoindre') || text.includes('accept') || text.includes('invitation')) {
                btn.click();
            }
        });
    }

    // Initialisation au chargement de la page
    window.addEventListener('load', () => {
        createUI();
        const observer = new MutationObserver(autoClickInvitation);
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();