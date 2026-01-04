// ==UserScript==
// @name         Better Stamp Album
// @version      2025.12.31
// @license      GNU GPLv3
// @description  Replaces Stamp album links with Form
// @match        https://www.neopets.com/stamps.phtml?*
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @namespace    https://www.youtube.com/@Neo_PosterBoy
// @downloadURL https://update.greasyfork.org/scripts/560926/Better%20Stamp%20Album.user.js
// @updateURL https://update.greasyfork.org/scripts/560926/Better%20Stamp%20Album.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const para = Array.from(document.querySelectorAll('p')).find(p =>
        p.querySelector('a[href*="stamps.phtml?type=album"]')
    );

    if (!para) return;

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.gap = '5px';
    container.style.margin = '10px 0';
    const select = document.createElement('select');
    const links = Array.from(para.querySelectorAll('a[href*="stamps.phtml?type=album"]'));
    const currentUrl = window.location.href;

    let currentIndex = -1;

    // Dropdown and find current selection
    links.forEach((link, index) => {
        const option = document.createElement('option');
        option.textContent = link.textContent.trim();
        option.value = link.href;

        if (currentUrl.includes(link.getAttribute('href')) || link.href === currentUrl) {
            option.selected = true;
            currentIndex = index;
        }

        select.appendChild(option);
    });

    // Create buttons
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◄ Prev';
    prevBtn.disabled = currentIndex <= 0;

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next ►';
    nextBtn.disabled = currentIndex === -1 || currentIndex >= links.length - 1;

    prevBtn.onclick = () => {
        if (currentIndex > 0) window.location.href = links[currentIndex - 1].href;
    };

    nextBtn.onclick = () => {
        if (currentIndex < links.length - 1) window.location.href = links[currentIndex + 1].href;
    };

    select.onchange = () => {
        window.location.href = select.value;
    };

    // Assemble and Replace
    container.appendChild(prevBtn);
    container.appendChild(select);
    container.appendChild(nextBtn);
    para.parentNode.replaceChild(container, para);

})();