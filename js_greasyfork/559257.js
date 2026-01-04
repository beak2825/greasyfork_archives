// ==UserScript==
// @name         TETR.IO custom skins
// @namespace    https://reycko.xyz/
// @version      1.0.0
// @description  Very basic skin changer for tetr.io (requires manual editing, default is jstris-like)
// @author       Reycko
// @match        https://tetr.io/
// @icon         https://tetr.io/favicon.ico
// @grant        unsafeWindow
// @license      LGPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/559257/TETRIO%20custom%20skins.user.js
// @updateURL https://update.greasyfork.org/scripts/559257/TETRIO%20custom%20skins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SKIN_URL = 'https://i.imgur.com/BC1pUG6.png';
    const GHOST_URL = 'https://i.imgur.com/BNl0iOw.png';

    const _HTMLImageElement = window.HTMLImageElement || unsafeWindow.HTMLImageElement;
    const _HTMLImageElement_proto = _HTMLImageElement.prototype;
    const _HTMLImageElement_src = Object.getOwnPropertyDescriptor(_HTMLImageElement.prototype, 'src');

    Object.defineProperty(_HTMLImageElement_proto, 'src', {
        set: function(value) {
            if (value.includes('res/skins') && value.includes('tetrio.png')) {
                console.log('tetrio jstris: changing source for', value);

                value = (value.includes('ghost') ? GHOST_URL : SKIN_URL);
            }

            _HTMLImageElement_src.set.call(this, value);
        },

        get: function() {
            return _HTMLImageElement_src.get.call(this);
        },
        enumerable: _HTMLImageElement_src.enumerable,
        configurable: _HTMLImageElement_src.configurable,
    });
})();