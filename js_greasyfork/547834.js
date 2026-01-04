// ==UserScript==
// @name         Ísland.is Kennitala Fix (SPA-safe) (Ragnhildur Arna | 180908-3070)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Works with React routing on island.is and safely replaces Kennitala without breaking layout or styles.
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547834/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Ragnhildur%20Arna%20%7C%20180908-3070%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547834/%C3%8Dslandis%20Kennitala%20Fix%20%28SPA-safe%29%20%28Ragnhildur%20Arna%20%7C%20180908-3070%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldKTdash = '180908-3070';
    const newKTdash = '180903-3070';

    const oldKTplain = '';
    const newKTplain = '';

    // Check every second forever
    setInterval(() => {
        document.querySelectorAll('p, span, div').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                let text = el.textContent;

                if (text.includes(oldKTdash)) {
                    el.textContent = text.replace(oldKTdash, newKTdash);
                }

                if (text.includes(oldKTplain)) {
                    el.textContent = text.replace(oldKTplain, newKTplain);
                }
            }
        });
    }, 50); // runs every second
})();