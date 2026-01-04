// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Ástríður Embla Rögnvaldsdóttir | 190506-2070)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @match        https://island.is/minarsidur/skirteini/okurettindi/default
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/550197/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28%C3%81str%C3%AD%C3%B0ur%20Embla%20R%C3%B6gnvaldsd%C3%B3ttir%20%7C%20190506-2070%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550197/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28%C3%81str%C3%AD%C3%B0ur%20Embla%20R%C3%B6gnvaldsd%C3%B3ttir%20%7C%20190506-2070%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '190506-2070';
    const newKT = '190503-2070';
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