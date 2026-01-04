// ==UserScript==
// @name         Flight Rising - Add Hoard Search Link
// @namespace    https://greasyfork.org/en/users/322117
// @version      0.1
// @description  Adds links to search your hoard or vault for items from the Game Database.
// @author       mechagotch
// @match        https://*.flightrising.com/game-database/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549182/Flight%20Rising%20-%20Add%20Hoard%20Search%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/549182/Flight%20Rising%20-%20Add%20Hoard%20Search%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let breadcrumbs = document.querySelector('.breadcrumbs');

    if (breadcrumbs) {
        let links = breadcrumbs.querySelectorAll('a');
        let item_key = null;
        let item_type_name = null;

        if (links.length >= 3) {
            let type_link = links[2];
            let type_href = type_link.href;

            let url_parts = type_href.split('/items/');
            if (url_parts.length > 1) {
                item_key = url_parts[1].split('?')[0];
                item_type_name = type_link.textContent.trim();
            }
        }

        let hoard_path = item_key;

        if (hoard_path) {

            let nodes = breadcrumbs.childNodes;
            let item_name = '';

            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                if (node.nodeType == 3) {
                    let text = node.textContent.trim().replace('» ', '');
                    if (text && text != '»') {
                        item_name = text;
                    }
                }
            }

            if (item_name != '') {
                let hoard_search_url = `https://www1.flightrising.com/hoard/${hoard_path}/1?name=${item_name}&sort=id_asc`;
                let vault_search_url = `https://www1.flightrising.com/vault/${hoard_path}/1?name=${item_name}&sort=id_asc`;

                let search_links = document.createElement('div');
                search_links.style = "margin:0.25rem 0"
                search_links.innerHTML = `<b>»</b> <a href="${hoard_search_url}" target="_blank">Search Hoard</a> <b>|</b> <a href="${vault_search_url}" target="_blank">Search Vault</a>`

                breadcrumbs.appendChild(search_links);
            }

        }

    }
})();