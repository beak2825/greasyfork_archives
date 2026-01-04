// ==UserScript==
// @name         AllMyLinks Shortened Links Replacer
// @description  Replace shortened (tracked) links from AllMyLinks with the real link on all websites
// @namespace    https://gitlab.com/breatfr/allmylinks
// @match        *://*/*
// @version      1.0.0
// @homepageURL  https://gitlab.com/breatfr/allmylinks
// @supportURL   https://discord.gg/Q8KSHzdBxs
// @author       BreatFR
// @license      AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @icon         https://gitlab.com/uploads/-/system/project/avatar/77034318/allmylinks.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558631/AllMyLinks%20Shortened%20Links%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/558631/AllMyLinks%20Shortened%20Links%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour remplacer les href des liens AllMyLinks
    function replaceAllMyLinks(container) {
        // Sélectionner tous les éléments <a> dans le conteneur spécifié
        const links = container.querySelectorAll('a');

        // Parcourir chaque lien
        links.forEach(link => {
            // Vérifier si le lien contient un href et du texte
            if (link.href && link.textContent) {
                // Vérifier si le href contient "allmylinks.com/link/out?id="
                if (link.href.includes('allmylinks.com/link/out?id=')) {
                    let newHref = '';

                    // Vérifier la structure du lien
                    const spans = link.querySelectorAll('span');
                    if (spans.length === 1) {
                        // Cas des emails : un seul span
                        newHref = spans[0].textContent.trim();
                    } else if (spans.length >= 2) {
                        // Cas du site web : deux spans ou plus
                        newHref = spans[1].textContent.trim();
                    }

                    // Nettoyer le texte du lien (supprimer les espaces et sauts de ligne)
                    newHref = newHref.replace(/\s+/g, '');

                    // Remplacer le href par le texte du lien avec le préfixe https://
                    link.href = 'https://' + newHref;
                }
            }
        });
    }

    // Fonction pour vérifier périodiquement les liens
    function checkLinksPeriodically() {
        // Appliquer la fonction à la page principale
        replaceAllMyLinks(document);

        // Appliquer la fonction à tous les iframes
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                replaceAllMyLinks(iframeDocument);
            } catch (e) {
                // console.error('Unable to access iframe:', e);
            }
        });

        setTimeout(checkLinksPeriodically, 500); // Vérifier toutes les 5 secondes
    }

    // Exécuter la fonction après le chargement de la page
    window.addEventListener('load', checkLinksPeriodically);
})();
