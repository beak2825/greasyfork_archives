// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Agla Árnadóttir | 110307-2330)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547745/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Agla%20%C3%81rnad%C3%B3ttir%20%7C%20110307-2330%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547745/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Agla%20%C3%81rnad%C3%B3ttir%20%7C%20110307-2330%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '110307-2330';
    const newKT = '110304-2330';
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