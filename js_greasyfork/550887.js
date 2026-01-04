// ==UserScript==
// @name         Eliminar publicidad footer OlympusBiblioteca
// @namespace    Violentmonkey Script
// @version      1.2
// @description  Elimina el div con ad-placement="footer" en olympusbiblioteca.com
// @author       Wilson
// @license      MIT
// @match        *://*.olympusbiblioteca.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550887/Eliminar%20publicidad%20footer%20OlympusBiblioteca.user.js
// @updateURL https://update.greasyfork.org/scripts/550887/Eliminar%20publicidad%20footer%20OlympusBiblioteca.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 [Wilson]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    function eliminarDiv() {
        const divs = document.querySelectorAll('div[ad-placement="footer"]');
        if (divs.length > 0) {
            divs.forEach(div => div.remove());
            console.log(`✅ Eliminados ${divs.length} div(s) con ad-placement="footer"`);
        }
    }

    eliminarDiv();

    const observer = new MutationObserver(() => {
        eliminarDiv();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
