// ==UserScript==
// @name         Copy FuckingFast Links
// @namespace    https://fitgirl-repacks.site/
// @version      1.0
// @description  Adds a button to copy all https://fuckingfast.co/ links
// @author       Jony6763
// @match        https://fitgirl-repacks.site/*
// @grant        none
// @icon         https://fitgirl-repacks.site/wp-content/uploads/2016/08/cropped-icon-180x180.jpg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552552/Copy%20FuckingFast%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/552552/Copy%20FuckingFast%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        document.querySelectorAll('p[style="height: 200px; display: block;"]').forEach(p => {
            const btn = document.createElement('button');
            btn.textContent = 'Copy FuckingFast Links';
            btn.onclick = () => {
                const links = Array.from(document.querySelectorAll('a'))
                    .map(a => a.href)
                    .filter(h => h.startsWith('https://fuckingfast.co/'));
                if (!links.length) return alert('❌ No Matching URLs Found');
                const ta = document.createElement('textarea');
                ta.value = links.join("\n");
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                alert(`✅ ${links.length} links copied!`);
            };
            p.parentNode.insertBefore(btn, p.nextSibling);
        });
    });
})();