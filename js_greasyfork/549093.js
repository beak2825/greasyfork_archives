// ==UserScript==
// @name         Reimu Sidebar
// @namespace    http://chireiden.alwinfy.net/
// @version      1.2
// @description  adds reimu to the tumblr sidebar!
// @author       You
// @match        https://www.tumblr.com
// @match        https://www.tumblr.com/dashboard*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549093/Reimu%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/549093/Reimu%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const injectionPoint = '.e1knl > aside';

    new MutationObserver(muts => muts.forEach(mut => mut.addedNodes.forEach(n => n instanceof HTMLElement && adjoinReimu(n.querySelector(injectionPoint))))).observe(document.body, {subtree: true, childList: true});

    adjoinReimu(document.querySelector(injectionPoint));
    function adjoinReimu(aside) {
        if (!aside) return;
        const reimu = document.createElement('img');
        reimu.src = 'https://files.catbox.moe/52fotb.png';
        Object.assign(reimu.style, {position: 'sticky', width: '100%', top: '50vh'});
        reimu.addEventListener('dragstart', ev => ev.preventDefault());
        reimu.addEventListener('pointerdown', ev => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.innerHTML = '<path fill="RGB(var(--red))" d="M17.888 1.1C16.953.38 15.87 0 14.758 0c-1.6 0-3.162.76-4.402 2.139-.098.109-.217.249-.358.42a12.862 12.862 0 0 0-.36-.421C8.4.758 6.84 0 5.248 0 4.14 0 3.06.381 2.125 1.1-.608 3.201-.44 6.925 1.14 9.516c2.186 3.59 6.653 7.301 7.526 8.009.38.307.851.474 1.333.474a2.12 2.12 0 0 0 1.332-.473c.873-.71 5.34-4.42 7.526-8.01 1.581-2.597 1.755-6.321-.968-8.418"></path>';
            Object.assign(svg.style, {
                animation: '.8s ease-out kvrGC',
                position: 'absolute',
                top: ev.pageY-6+'px',
                left: ev.pageX-10+'px',
                pointerEvents: 'none'
            });

            svg.setAttribute("width", 57);
            svg.setAttribute("height", 51);
            document.body.appendChild(svg);
            setTimeout(() => document.body.removeChild(svg), 800);
        })
        aside.appendChild(reimu);
    }
})();