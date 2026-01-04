// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Embla Mjöll Auðunsdóttir | 291008-3050)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @match        https://island.is/minarsidur/skirteini/okurettindi/default
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/553043/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Embla%20Mj%C3%B6ll%20Au%C3%B0unsd%C3%B3ttir%20%7C%20291008-3050%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553043/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Embla%20Mj%C3%B6ll%20Au%C3%B0unsd%C3%B3ttir%20%7C%20291008-3050%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const oldKT = '291008-3050';
    const newKT = '291004-3050';
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