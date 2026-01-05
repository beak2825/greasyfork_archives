// ==UserScript==
// @name         Clean_Pub_Risi_JVC
// @namespace    Clean_Pub_Risi_JVC
// @version      7.3.1
// @description  Vire les onglets secondaires dans risibank.
// @author       Atlantis
// @match        *://risibank.fr/embed*
// @grant        none
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/128px/1f7ea.png
// @license      CC0-1.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559084/Clean_Pub_Risi_JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/559084/Clean_Pub_Risi_JVC.meta.js
// ==/UserScript==


const style = document.createElement("style");
style.id = 'risiCleanCss';
style.textContent = `

    /* reduit marge en haut */
    .themed-container > .mt-4{margin-top: 0px !important }

    /* masque icone discord + le layout fav */
    .favorite-heart,
    .bookmark,
    .fa-discord {
        display: none !important;
    }
    /* masque icone risibank sur petit ecran (410px) */
    @media(max-width: 410px) {
        .tabs.btn-group > a[href^="https://risibank.fr"] { display : none !important; }
    }

`;
document.head.append(style);
