// ==UserScript==
// @name         Rule34 Favorite Button
// @version      1.1
// @description  Adds a more convenient favorite button to rule34.xxx
// @author       littlesmella
// @namespace    littlesmella
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560582/Rule34%20Favorite%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/560582/Rule34%20Favorite%20Button.meta.js
// ==/UserScript==

(() => {
    'use strict';

    function getIdFromUrl() {
        const searchParams = new URLSearchParams(window.location.search);
        const paramValue = searchParams.get('id');
        return paramValue;
    }

    const sidebar = document.querySelector('.postViewSidebarRight');
    if (sidebar) {
        const id = getIdFromUrl();
        const favButton = document.createElement('a');
        const sidebarClass = sidebar.getAttribute('class');

        favButton.href = '#';
        favButton.textContent = "♥";
        favButton.setAttribute('onclick', `post_vote('${id}', 'up'); addFav('${id}'); return false;`);
        favButton.setAttribute('style', `font-size: 300px; text-align: center; display: block;`);

        sidebar.prepend(favButton);
        sidebar.setAttribute('class', `${sidebarClass} tag-type-artist`);
    } else {
        console.log('Sidebar not found');
    }
})();