// ==UserScript==
// @name         Icons8 Floating Search
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  A floating search bar to filter Icons8.com/icons/set/popular page content.
// @author       YouTubeDrawaria
// @match        https://icons8.com/icons/set/popular
// @match        https://icons8.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icons8.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549684/Icons8%20Floating%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/549684/Icons8%20Floating%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Añadir CSS para el buscador flotante y una clase para ocultar las secciones
    GM_addStyle(`
        #floating-search-bar {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border-radius: 5px;
            display: flex;
            gap: 5px;
            align-items: center;
        }
        #floating-search-input {
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
            width: 150px; /* Ancho ajustado para el campo de entrada */
        }
        #toggle-sections-button, #search-icons-button {
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            white-space: nowrap; /* Evita que el texto del botón se rompa */
        }
        #toggle-sections-button:hover, #search-icons-button:hover {
            background-color: #45a049;
        }
        .userscript-hidden-section {
            display: none !important;
        }
    `);

    // 2. Crear el HTML del buscador flotante (campo de entrada, botón de buscar y botón de alternar secciones)
    const searchBar = document.createElement('div');
    searchBar.id = 'floating-search-bar';
    searchBar.innerHTML = `
        <input type="text" id="floating-search-input" placeholder="Buscar iconos...">
        <button id="search-icons-button">Buscar</button>
        <button id="toggle-sections-button">Mostrar Secciones</button>
    `;
    document.body.appendChild(searchBar);

    // 3. Obtener las secciones de la página a controlar y ocultarlas inicialmente
    const targetSelectors = [
        '.search-cards', // Contiene la cuadrícula de los iconos
        '.app-bottom-info.category-cards__seo', // Sección de texto SEO
        '.search-tags' // Sección de etiquetas de búsqueda
    ];

    const targetSections = targetSelectors
        .map(selector => document.querySelector(selector))
        .filter(Boolean);

    // Oculta todas las secciones objetivo añadiéndoles la clase CSS
    targetSections.forEach(section => {
        section.classList.add('userscript-hidden-section');
    });

    // 4. Añadir el evento al botón flotante para alternar la visibilidad
    const toggleButton = document.getElementById('toggle-sections-button');
    let sectionsVisible = false; // Estado inicial: las secciones están ocultas

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            sectionsVisible = !sectionsVisible; // Invierte el estado de visibilidad

            targetSections.forEach(section => {
                if (sectionsVisible) {
                    section.classList.remove('userscript-hidden-section'); // Muestra la sección
                } else {
                    section.classList.add('userscript-hidden-section'); // Oculta la sección
                }
            });

            // Cambia el texto del botón según el estado actual
            toggleButton.textContent = sectionsVisible ? 'Ocultar Secciones' : 'Mostrar Secciones';
        });
    }

    // 5. Añadir el evento al botón de búsqueda
    const searchInput = document.getElementById('floating-search-input');
    const searchButton = document.getElementById('search-icons-button');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Codifica el término de búsqueda para usarlo en la URL
                const encodedSearchTerm = encodeURIComponent(searchTerm);
                // Construye la URL de búsqueda de Icons8
                window.location.href = `https://icons8.com/icons/set/${encodedSearchTerm}`;
            } else {
                alert('Por favor, ingresa un término de búsqueda.');
            }
        });

        // Opcional: Permitir buscar presionando Enter en el campo de texto
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click(); // Simula un clic en el botón de búsqueda
            }
        });
    }

})();