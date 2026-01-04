// ==UserScript==
// @name         Linkify
// @name:es      Linkify
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Echo_link-blue_icon_slanted.svg/1024px-Echo_link-blue_icon_slanted.svg.png
// @description  Convert plain text URLs and emails into clickable links
// @description:es Convierte URLs y correos en enlaces clicables
// @namespace    personal.linkify
// @version      2025.10.15.1
// @author       Personal
// @license      MIT
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/552580/Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/552580/Linkify.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // --------------------------
    // Configuración y utilidades
    // --------------------------

    // Patrón unificado para URL y correo:
    // - URL: http, https, ftp o www.
    // - Correo: RFC simple y robusto para uso general.
    // Evita capturar signos de cierre comunes al final.
    const PATRON_ENLACE_GLOBAL = /((?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"'）\)\]\}]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63})/gi;
    const PATRON_ENLACE_TEST   = /((?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"'）\)\]\}]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63})/i;

    // Etiquetas en las que NO se debe intervenir
    const ETIQUETAS_EXCLUIDAS = new Set([
        "A","SCRIPT","STYLE","TEXTAREA","CODE","PRE","NOSCRIPT","INPUT","BUTTON",
        "SELECT","OPTION","SVG","CANVAS","IFRAME","OBJECT","EMBED","MAP","AREA","HEAD"
    ]);

    // Atributos para enlaces creados
    const ATRIBUTOS_ENLACE = {
        target: "_blank",
        rel: "noopener noreferrer nofollow ugc",
    };

    // --------------------------
    // Núcleo de la transformación
    // --------------------------

    /**
   * Determina si un nodo de texto es candidato:
   * - Debe tener padre válido
   * - No debe estar dentro de etiquetas excluidas
   * - No debe estar dentro de contenido editable
   * - Debe contener al menos un posible enlace o correo
   */
    function esNodoTextoCandidato(nodoTexto) {
        const padre = nodoTexto.parentElement;
        if (!padre) return false;
        if (ETIQUETAS_EXCLUIDAS.has(padre.tagName)) return false;
        if (padre.isContentEditable || nodoTexto.isContentEditable) return false;

        // Evitar procesar nodos dentro de enlaces ya existentes
        if (ancestroEs(padre, "A")) return false;

        // Comprobación rápida de contenido enlazable
        return PATRON_ENLACE_TEST.test(nodoTexto.nodeValue);
    }

    /**
   * Verifica si algún ancestro del nodo coincide con una etiqueta
   */
    function ancestroEs(nodo, nombreEtiqueta) {
        let actual = nodo;
        const etiqueta = String(nombreEtiqueta).toUpperCase();
        while (actual) {
            if (actual.tagName === etiqueta) return true;
            actual = actual.parentElement;
        }
        return false;
    }

    /**
   * Normaliza el texto de un enlace para usarlo en href
   * - Correo → mailto:
   * - www. → http://
   * - http/https/ftp → tal cual
   * - Otro texto que parece dominio → http://
   */
    function normalizarTextoParaHref(texto) {
        const esCorreo = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/.test(texto);
        if (esCorreo) return `mailto:${texto}`;
        if (/^(?:https?:\/\/|ftp:\/\/)/i.test(texto)) return texto;
        if (/^www\./i.test(texto)) return `http://${texto}`;
        return `http://${texto}`;
    }

    /**
   * Crea un elemento <a> seguro y descriptivo
   */
    function crearEnlace(texto) {
        const a = document.createElement("a");
        a.textContent = texto;
        a.href = normalizarTextoParaHref(texto);
        a.target = ATRIBUTOS_ENLACE.target;
        a.rel = ATRIBUTOS_ENLACE.rel;
        return a;
    }

    /**
   * Reemplaza un nodo de texto por un fragmento con enlaces.
   * Mantiene el resto del texto intacto y evita usar innerHTML.
   */
    function convertirTextoEnEnlaces(nodoTexto) {
        const texto = nodoTexto.nodeValue;
        if (!PATRON_ENLACE_TEST.test(texto)) return;

        const fragmento = document.createDocumentFragment();
        let indice = 0;
        let match;
        const regex = new RegExp(PATRON_ENLACE_GLOBAL); // clonar para no compartir lastIndex

        while ((match = regex.exec(texto)) !== null) {
            const inicio = match.index;
            const fin = regex.lastIndex;

            // Texto previo al enlace
            if (inicio > indice) {
                fragmento.append(document.createTextNode(texto.slice(indice, inicio)));
            }

            // Enlace o correo detectado
            const parte = match[0];
            fragmento.append(crearEnlace(parte));

            indice = fin;
        }

        // Resto del texto
        if (indice < texto.length) {
            fragmento.append(document.createTextNode(texto.slice(indice)));
        }

        nodoTexto.parentNode.replaceChild(fragmento, nodoTexto);
    }

    /**
   * Recorre una rama del DOM y convierte nodos de texto candidatos
   */
    function procesarRama(raiz) {
        if (!raiz || raiz.nodeType !== Node.ELEMENT_NODE) return;
        const caminante = document.createTreeWalker(
            raiz,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (n) => (esNodoTextoCandidato(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
            }
        );

        const lote = [];
        while (caminante.nextNode()) lote.push(caminante.currentNode);

        // Procesamiento en lote para evitar bloqueos largos
        for (const nodoTexto of lote) convertirTextoEnEnlaces(nodoTexto);
    }

    // --------------------------
    // Observación de cambios DOM
    // --------------------------

    /**
   * Observa cambios en el DOM para procesar nodos añadidos dinámicamente
   */
    function iniciarObservador() {
        const observador = new MutationObserver((mutaciones) => {
            for (const m of mutaciones) {
                if (m.type === "childList") {
                    for (const nodo of m.addedNodes) {
                        if (nodo.nodeType === Node.TEXT_NODE) {
                            if (esNodoTextoCandidato(nodo)) convertirTextoEnEnlaces(nodo);
                        } else if (nodo.nodeType === Node.ELEMENT_NODE) {
                            // Saltar si el nodo añadido es un enlace completo
                            if (nodo.tagName === "A") continue;
                            procesarRama(nodo);
                        }
                    }
                } else if (m.type === "characterData") {
                    const nodo = m.target;
                    if (nodo.nodeType === Node.TEXT_NODE && esNodoTextoCandidato(nodo)) {
                        convertirTextoEnEnlaces(nodo);
                    }
                }
            }
        });

        observador.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

    // --------------------------
    // Ciclo de vida del script
    // --------------------------

    function iniciar() {
        // Evitar marcos anidados para reducir costo y efectos no deseados
        if (window.top !== window.self) return;

        // Procesamiento inicial
        procesarRama(document.body);

        // Observación continua
        iniciarObservador();
    }

    // Iniciar cuando el documento esté listo
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();