// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Nadía Karen Aziza Lakhlifi | 230308-2170)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @match        https://island.is/minarsidur/skirteini/okurettindi/default
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/549739/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Nad%C3%ADa%20Karen%20Aziza%20Lakhlifi%20%7C%20230308-2170%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549739/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Nad%C3%ADa%20Karen%20Aziza%20Lakhlifi%20%7C%20230308-2170%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '230308-2170';
    const newKT = '230304-2170';
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