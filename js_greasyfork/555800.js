// ==UserScript==
// @name         Rozed - Force Modo Messi (Interceptor)
// @namespace    http://tampermonkey.net/
// @version      10.1
// @description  Intercepta y reescribe el script de configuración inicial de la página para forzar modoMessi=true antes de que la aplicación se cargue. La solución definitiva.
// @author       You
// @match        https://rozed.pro/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555800/Rozed%20-%20Force%20Modo%20Messi%20%28Interceptor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555800/Rozed%20-%20Force%20Modo%20Messi%20%28Interceptor%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[ModoMessi V10] Interceptor de scripts iniciado. Observando el DOM...');

    // La cadena de texto específica que buscamos para identificar el script correcto.
    const targetString = '"modoMessi":false';

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                // Nos interesan únicamente las etiquetas <script> que no tengan un atributo 'src' (scripts en línea).
                if (node.tagName === 'SCRIPT' && !node.src && node.textContent.includes(targetString)) {

                    console.log('[ModoMessi] ¡Script de configuración inicial detectado!');

                    // 1. Copiamos el contenido original.
                    const originalText = node.textContent;

                    // 2. Creamos la versión modificada, reemplazando el valor.
                    const modifiedText = originalText.replace(targetString, '"modoMessi":true');

                    // 3. Neutralizamos el script original para que el navegador no lo ejecute.
                    // Cambiar su tipo es una forma efectiva de hacerlo.
                    node.type = 'text/plain';
                    // También lo eliminamos del DOM para mayor limpieza.
                    node.remove();

                    // 4. Creamos y añadimos nuestro nuevo script con los datos corregidos.
                    const newScript = document.createElement('script');
                    newScript.textContent = modifiedText;
                    // Es importante añadirlo al mismo lugar o al <head> para que se ejecute en el momento adecuado.
                    document.head.appendChild(newScript);

                    console.log('[ModoMessi] Script original neutralizado y reemplazado con modoMessi=true.');

                    // 5. Hemos cumplido nuestra misión. Desconectamos el observador para no gastar más recursos.
                    observer.disconnect();
                    console.log('[ModoMessi] Interceptor desconectado. Misión cumplida.');

                    // Salimos de los bucles ya que encontramos lo que buscábamos.
                    return;
                }
            }
        }
    });

    // Empezamos a observar desde la raíz del documento (<html>) para capturar todo
    // lo que se añada al <head> o al <body> lo antes posible.
    observer.observe(document.documentElement, {
        childList: true, // Observar la adición/eliminación de nodos hijos.
        subtree: true    // Extender la observación a todos los descendientes.
    });

})();