// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Matheus B. Oliveira De Souza | 200807-3400)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547749/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Matheus%20B%20Oliveira%20De%20Souza%20%7C%20200807-3400%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547749/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Matheus%20B%20Oliveira%20De%20Souza%20%7C%20200807-3400%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '200807-3400';
    const newKT = '200805-3400';
    const oldKTplain = oldKT.replace('-', '');
    const newKTplain = newKT.replace('-', '');
    setInterval(() => {
        document.querySelectorAll('p, span, div').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                let text = el.textContent;

                if (text.includes(oldKT)) {
                    el.textContent = text.replace(oldKT, newKT);
                }

                if (text.includes(oldKTplain)) {
                    el.textContent = text.replace(oldKTplain, newKTplain);
                }
            }
        });
    }, 50);
})();