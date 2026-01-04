// ==UserScript==
// @name           Collapse physical items on Bandcamp
// @description    Collapse everything except digital downloads by default.
// @version        2025.09.14
// @author         belewiw366
// @namespace      belewiw366
// @license        MIT
// @match          *://*.bandcamp.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/549569/Collapse%20physical%20items%20on%20Bandcamp.user.js
// @updateURL https://update.greasyfork.org/scripts/549569/Collapse%20physical%20items%20on%20Bandcamp.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let css = `
.collapsible-btn:before {
    content: '▶';
    display: inline-block;
    margin-left: 0.35em;
    width: 1.3em;
}

.active-btn:before {
    content: '▼';
    display: inline-block;
    margin-left: 0.35em;
    width: 1.3em;
}
`;

    document.head.appendChild(document.createElement("style")).innerHTML=css;

    var buyItems = document.getElementsByClassName('buyItem');
    for (const item of buyItems) {
        if (item.className == 'buyItem digital') {
            continue;
        }

        item.style.display = 'none';

        let li = document.createElement('li');

        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'collapsible-btn';
        button.classList.toggle('order_package_link');
        button.classList.toggle('buy-link');
        button.classList.toggle('primaryText');
        button.classList.toggle('hd');
        button.textContent = item.children[0].children[0].innerText.trim();
        item.children[0].children[0].remove();

        button.addEventListener('click', function() {
            this.classList.toggle('active-btn');
            let content = this.parentNode.nextElementSibling;
            if (content.style.display == 'none') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        } );
        li.append(button);

        item.parentNode.insertBefore(li, item);
    }
})();
