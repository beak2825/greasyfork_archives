// ==UserScript==
// @name         ZonaTMO Auto Cascada
// @namespace    https://zonatmo.com/
// @version      2.1
// @description  Activa automáticamente el modo Cascada al abrir cualquier capítulo en ZonaTMO.
// @author       Edward Pérez
// @license      MIT
// @match        *://zonatmo.com/viewer/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553109/ZonaTMO%20Auto%20Cascada.user.js
// @updateURL https://update.greasyfork.org/scripts/553109/ZonaTMO%20Auto%20Cascada.meta.js
// ==/UserScript==

/*
Copyright (c) 2025 Edward Pérez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function() {
    'use strict';

    // Si ya estás en modo cascada, no hacer nada
    if (window.location.href.includes('/cascade')) return;

    // Buscar enlace al modo cascada y redirigir automáticamente
    const checkInterval = setInterval(() => {
        const enlaceCascada = document.querySelector('a.nav-link[title="Cascada"]');
        if (enlaceCascada) {
            clearInterval(checkInterval);
            console.log("✅ Redirigiendo automáticamente al modo cascada...");
            window.location.href = enlaceCascada.href;
        }
    }, 800);
})();
