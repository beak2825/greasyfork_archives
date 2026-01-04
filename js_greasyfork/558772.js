// ==UserScript==
// @name         Auto-Close oundhertobeconsist killer
// @namespace    tab-killer
// @version      4.0
// @description  Ferme automatiquement tout onglet qui charge oundhertobeconsist.org
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558772/Auto-Close%20oundhertobeconsist%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/558772/Auto-Close%20oundhertobeconsist%20killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BLOCK = "oundhertobeconsist.org";

    // Fonction pour tuer la page
    function killPage() {
        // Tente de fermer directement (fonctionne si redirection popup)
        window.close();

        // Si pas fermé → tente retour arrière
        history.back();

        // Si impossible → force le blanc puis ferme
        setTimeout(() => {
            document.documentElement.innerHTML = "";
            location.replace("about:blank");
            setTimeout(() => window.close(), 10);
        }, 10);
    }

    // Si la page actuelle est le domaine bloqué → KILL
    if (location.hostname.includes(BLOCK)) {
        killPage();
        return;
    }

    // Bloque toutes redirections vers ce domaine
    const hardBlock = url => url && url.includes(BLOCK);

    const origAssign = window.location.assign;
    window.location.assign = function(url) {
        if (hardBlock(url)) return killPage();
        return origAssign.call(window.location, url);
    };

    const origReplace = window.location.replace;
    window.location.replace = function(url) {
        if (hardBlock(url)) return killPage();
        return origReplace.call(window.location, url);
    };

    Object.defineProperty(window.location, "href", {
        set(url) {
            if (hardBlock(url)) return killPage();
            return origAssign.call(window.location, url);
        }
    });

    // Bloque les clics sur les liens
    document.addEventListener("click", e => {
        const a = e.target.closest("a");
        if (!a) return;
        if (hardBlock(a.href)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            killPage();
        }
    }, true);

})();
