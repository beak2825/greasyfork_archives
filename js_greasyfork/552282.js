// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Sóldís Erla Hjartardóttir | 280907-2190)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @match        https://island.is/minarsidur/skirteini/okurettindi/default
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/552282/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28S%C3%B3ld%C3%ADs%20Erla%20Hjartard%C3%B3ttir%20%7C%20280907-2190%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552282/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28S%C3%B3ld%C3%ADs%20Erla%20Hjartard%C3%B3ttir%20%7C%20280907-2190%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '280907-2190';
    const newKT = '280904-2190';
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