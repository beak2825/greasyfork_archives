// ==UserScript==
// @name         Darkiworld Link Transformer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Transforme automatiquement les liens darkiworld en changeant les valeurs de filtres de 2 à 5
// @author       User
// @match        *://darkiworld*.com/*
// @match        *://*/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/552412/Darkiworld%20Link%20Transformer.user.js
// @updateURL https://update.greasyfork.org/scripts/552412/Darkiworld%20Link%20Transformer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fonction pour transformer une URL
    function transformUrl(url) {
        try {
            const urlObj = new URL(url);
            const filtersParam = urlObj.searchParams.get('filters');

            if (!filtersParam) return url;

            // Décoder l'URL
            const decodedFilters = decodeURIComponent(filtersParam);

            // Décoder le base64
            const jsonString = atob(decodedFilters);
            const filtersArray = JSON.parse(jsonString);

            // Transformer les valeurs 2 en 5
            let modified = false;
            filtersArray.forEach(filter => {
                if (filter.value === 2) {
                    filter.value = 5;
                    modified = true;
                }
                if (filter.valueKey === 2) {
                    filter.valueKey = 5;
                    modified = true;
                }
            });

            if (!modified) return url;

            // Re-encoder
            const newJsonString = JSON.stringify(filtersArray);
            const newBase64 = btoa(newJsonString);
            const newEncodedFilters = encodeURIComponent(newBase64);

            // Créer la nouvelle URL
            urlObj.searchParams.set('filters', newEncodedFilters);
            return urlObj.toString();

        } catch (error) {
            console.log('Erreur lors de la transformation de l\'URL:', error);
            return url;
        }
    }

    // Fonction pour vérifier si c'est un lien darkiworld
    function isDarkiworldLink(href) {
        return href &&
               /darkiworld\d*\.com/i.test(href) &&
               href.includes('titles') &&
               href.includes('download') &&
               href.includes('filters=');
    }

    // Fonction pour transformer tous les liens sur la page
    function transformLinks() {
        const links = document.querySelectorAll('a[href*="titles"][href*="download"][href*="filters="]');

        links.forEach(link => {
            // Vérifier si c'est un lien darkiworld et s'il a déjà été transformé
            if (!isDarkiworldLink(link.href)) return;
            if (link.dataset.transformed === 'true') return;

            const originalHref = link.href;
            const transformedHref = transformUrl(originalHref);

            if (transformedHref !== originalHref) {
                link.href = transformedHref;
                link.dataset.transformed = 'true'; // Marquer comme transformé
                console.log('Lien transformé:', originalHref, '->', transformedHref);
            }
        });
    }

    // Fonction pour intercepter les clics et rediriger
    function interceptClicks() {
        document.addEventListener('click', function (event) {
            const target = event.target.closest('a');
            if (!target) return;

            const href = target.href;
            if (isDarkiworldLink(href)) {
                const transformedUrl = transformUrl(href);
                if (transformedUrl !== href) {
                    event.preventDefault();
                    console.log('Interception du clic, redirection vers:', transformedUrl);
                    window.location.href = transformedUrl;
                }
            }
        });
    }

    // Fonction pour surveiller les changements dynamiques dans le DOM
    function observeChanges() {
        const observer = new MutationObserver(function (mutations) {
            let shouldTransform = false;

            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Vérifier si des liens ont été ajoutés
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'A' || node.querySelector('a')) {
                                shouldTransform = true;
                            }
                        }
                    });
                }
            });

            if (shouldTransform) {
                // Attendre un peu pour que les éléments soient complètement ajoutés
                setTimeout(transformLinks, 200);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Intercepter les navigations directes via l'URL
    function checkAndRedirect() {
        if (isDarkiworldLink(window.location.href)) {
            const transformedUrl = transformUrl(window.location.href);
            if (transformedUrl !== window.location.href) {
                console.log('Redirection automatique vers:', transformedUrl);
                window.location.replace(transformedUrl);
                return true;
            }
        }
        return false;
    }

    // Exécuter la redirection immédiatement
    if (checkAndRedirect()) {
        return; // Arrêter l'exécution si redirection en cours
    }

    // Vérification périodique pour capturer les liens chargés tardivement
    function periodicCheck() {
        transformLinks();
        setTimeout(periodicCheck, 2000); // Vérifier toutes les 2 secondes
    }

    // Détecter les changements d'URL sans rechargement (pour les SPAs)
    let lastUrl = window.location.href;
    function checkUrlChange() {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            console.log('Changement d\'URL détecté:', lastUrl);
            checkAndRedirect();
        }
        setTimeout(checkUrlChange, 500); // Vérifier toutes les 500ms
    }

    // Initialiser le script quand la page est chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            transformLinks();
            interceptClicks();
            observeChanges();
            periodicCheck(); // Démarrer la vérification périodique
            checkUrlChange(); // Surveiller les changements d'URL
        });
    } else {
        transformLinks();
        interceptClicks();
        observeChanges();
        periodicCheck(); // Démarrer la vérification périodique
        checkUrlChange(); // Surveiller les changements d'URL
    }

    console.log('UserScript Darkiworld Link Transformer activé');
})();