// ==UserScript==
// @name         Barra de Noticias Genbeta
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Muestra una barra de noticias flotante de Genbeta en cualquier web real
// @match        https://aulavirtual33.educa.madrid.org/ies.claradelrey.madrid/*
// @match        https://site.educa.madrid.org/ies.claradelrey.madrid/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555246/Barra%20de%20Noticias%20Genbeta.user.js
// @updateURL https://update.greasyfork.org/scripts/555246/Barra%20de%20Noticias%20Genbeta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Solo añadimos la barra si no existe ya, para evitar duplicados al recargar
    if (document.getElementById('barra-genbeta')) return;

    console.log("¡Barra de noticias activada!");

    (async function() {
        try {
            // 1. Leer el feed RSS de Genbeta usando un proxy que devuelve JSON
            const rssUrl = 'https://feeds.weblogssl.com/genbeta';
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            // 2. Formatear los títulos de las noticias
            const noticias = data.items.slice(0,10).map(item =>
                `<a href="${item.link}" target="_blank" style="color:#fff;text-decoration:none;">${item.title}</a>`
            );

            // 3. Crear barra de noticias flotante y estilos
            const barra = document.createElement("div");
            barra.id = "barra-genbeta";
            barra.style.position = "fixed";
            barra.style.bottom = "0";
            barra.style.left = "0";
            barra.style.width = "100%";
            barra.style.background = "#222";
            barra.style.color = "#fff";
            barra.style.zIndex = "9999";
            barra.style.padding = "8px 0";
            barra.style.fontFamily = "sans-serif";
            barra.style.overflow = "hidden";
            barra.innerHTML = `<div id="marquesina" style="white-space:nowrap;display:inline-block;">${noticias.join(' &nbsp;|&nbsp; ')}</div>`;

            document.body.appendChild(barra);

            // 4. Animación de scroll continuo y circular
            const marquesina = document.getElementById("marquesina");
            let x = 0;
            setInterval(() => {
                x -= 1;
                marquesina.style.transform = `translateX(${x}px)`;
                if (Math.abs(x) > marquesina.offsetWidth) x = barra.offsetWidth;
            }, 20);
        } catch (error) {
            console.error("No se pudo cargar el feed de Genbeta:", error);
        }
    })();

})();
