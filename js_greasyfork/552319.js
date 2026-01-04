// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Elín Gróa Elvarsdóttir | 010406-2850)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @match        https://island.is/minarsidur/skirteini/okurettindi/default
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/552319/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28El%C3%ADn%20Gr%C3%B3a%20Elvarsd%C3%B3ttir%20%7C%20010406-2850%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552319/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28El%C3%ADn%20Gr%C3%B3a%20Elvarsd%C3%B3ttir%20%7C%20010406-2850%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '010406-2850';
    const newKT = '010405-2850';
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