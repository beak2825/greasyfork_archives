// ==UserScript==
// @name         Neopets: Kacheek Seek Fix
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Fixes Kacheek Seek and adds a list of hiding spots for your convenience
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/games/hidenseek/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/564182/Neopets%3A%20Kacheek%20Seek%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/564182/Neopets%3A%20Kacheek%20Seek%20Fix.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Adds a list of links to each hiding place under the Kacheek Seek image
    - Fixes all locations that broke because of https, IF you play in a single tab (don't open hiding spots in new tabs)

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const onClick = async e => {
    e.preventDefault();
    const url = e.target.href;
    const page = await (await fetch(url.replace('http:', 'https:'))).text();
    document.head.innerHTML = page.match(/<head>([\s\S]+)<\/head>/)[1];
    document.body.innerHTML = page.match(/<body.+?>([\s\S]+)(?:<\/body>)?/)[1];
}

const createLink = area => {
    const a = document.createElement('a');
    a.textContent = area.alt;
    a.href = area.href;
    if(!a.href.startsWith('https')) a.addEventListener('click', onClick);
    return a;
}

(function() {
    'use strict';
    const ul = document.createElement('ul');
    document.getElementsByTagName('map')[0].insertAdjacentElement('afterend', ul);
    document.querySelectorAll('area').forEach(area => {
        const li = document.createElement('li');
        ul.appendChild(li);
        li.appendChild(createLink(area));
    });
})();
