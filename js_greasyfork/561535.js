// ==UserScript==
// @name         MercadoLibre - Filtro Regional de Envíos Internacionales
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  Oculta resultados internacionales en la búsqueda y muestra contador de publicaciones ocultas.
// @author       Gemini
// @match        https://*.mercadolibre.com.ar/*
// @match        https://*.mercadolibre.com.bo/*
// @match        https://*.mercadolivre.com.br/*
// @match        https://*.mercadolibre.com.br/*
// @match        https://*.mercadolibre.cl/*
// @match        https://*.mercadolibre.com.co/*
// @match        https://*.mercadolibre.co.cr/*
// @match        https://*.mercadolibre.com.do/*
// @match        https://*.mercadolibre.com.ec/*
// @match        https://*.mercadolibre.com.gt/*
// @match        https://*.mercadolibre.hn/*
// @match        https://*.mercadolibre.com.mx/*
// @match        https://*.mercadolibre.com.ni/*
// @match        https://*.mercadolibre.com.pa/*
// @match        https://*.mercadolibre.com.py/*
// @match        https://*.mercadolibre.com.pe/*
// @match        https://*.mercadolibre.com.sv/*
// @match        https://*.mercadolibre.com.uy/*
// @match        https://*.mercadolibre.com.ve/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercadolibre.com
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561535/MercadoLibre%20-%20Filtro%20Regional%20de%20Env%C3%ADos%20Internacionales.user.js
// @updateURL https://update.greasyfork.org/scripts/561535/MercadoLibre%20-%20Filtro%20Regional%20de%20Env%C3%ADos%20Internacionales.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuración ---
    const KEYWORDS = [
        "Compra Internacional",
        "Envío internacional",
        "Envio internacional",
        "Internacional",
        "Vendido por tienda internacional",
        "Vendido por loja internacional",
        "desde el exterior",
        "do exterior"
    ];

    const ITEM_SELECTORS = [
        '.ui-search-layout__item',
        '.ui-search-result__wrapper',
        'li.ui-search-layout__item',
        '.ui-search-result',
        '.andes-card'
    ];

    const RESULT_COUNT_SELECTORS = [
        '.ui-search-search-result__quantity-results',
        '.ui-search-header__title-card .ui-search-search-result__quantity-results',
        '.ui-search-search-result__quantity-results span'
    ];

    const STORAGE_KEY = 'meli_hide_intl_enabled';

    // --- Variables de Estado ---
    let isFilterEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';
    let stats = {
        totalOriginal: 0,
        hidden: 0,
        visible: 0,
        lastCleanText: "" // Caché para detectar cambios reales
    };

    // --- Estilos ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Ocultamiento eficiente */
        body.meli-filter-active .meli-item-international {
            display: none !important;
        }

        /* Botón Flotante Optimizado */
        #meli-filter-toggle {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            background-color: white;
            border: 1px solid #ddd;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-family: "Proxima Nova", -apple-system, Roboto, Arial, sans-serif;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            user-select: none;
            color: #333;
        }

        #meli-filter-toggle:hover {
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            transform: translateY(-2px);
        }

        #meli-filter-toggle.active { border-left: 4px solid #00a650; }
        #meli-filter-toggle.inactive { border-left: 4px solid #999; opacity: 0.8; }

        .meli-stat-group { display: flex; flex-direction: column; line-height: 1.2; }
        .meli-stat-label { font-size: 10px; color: #999; text-transform: uppercase; }
        .meli-stat-value { font-weight: 600; font-size: 14px; }
        
        /* Estilos integrados para el header */
        .meli-original-count-sub {
            font-weight: normal;
            color: #999;
            font-size: 0.85em;
            margin-left: 6px;
        }
    `;
    document.head.appendChild(style);

    // --- Funciones de Utilidad ---

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // CORRECCIÓN PRINCIPAL: Extraer solo el PRIMER bloque numérico
    // Evita concatenar "100" y "20" en "10020"
    function parseNumber(str) {
        if (!str) return 0;
        // Busca la primera ocurrencia de dígitos, puntos o comas seguidos
        const match = str.match(/[\d.,]+/); 
        if (!match) return 0;
        
        // Limpiar puntos y comas del número encontrado
        const numberStr = match[0].replace(/[.,]/g, '');
        return parseInt(numberStr, 10) || 0;
    }

    function formatNumber(num) {
        return num.toLocaleString('es-MX');
    }

    // --- Funciones Principales ---

    function updateBodyClass() {
        if (isFilterEnabled) {
            document.body.classList.add('meli-filter-active');
        } else {
            document.body.classList.remove('meli-filter-active');
        }
    }

    function createToggleButton() {
        if (document.getElementById('meli-filter-toggle')) return;

        const btn = document.createElement('div');
        btn.id = 'meli-filter-toggle';
        btn.title = 'Click para alternar filtro internacional';
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            isFilterEnabled = !isFilterEnabled;
            localStorage.setItem(STORAGE_KEY, isFilterEnabled);
            
            updateBodyClass();
            // IMPORTANTE: Forzar restauración del header antes de recalcular
            // Esto "limpia" la vista antes de aplicar nuevos cambios
            restoreHeaderOriginal(); 
            updateUI();
        });

        document.body.appendChild(btn);
        updateUI();
    }

    function updateUI() {
        const btn = document.getElementById('meli-filter-toggle');
        if (!btn) return;

        const icon = isFilterEnabled ? '🌎🚫' : '🌎👀';
        const statusClass = isFilterEnabled ? 'active' : 'inactive';
        
        // Solo mostramos resta si el filtro está activo
        const visibleValue = isFilterEnabled ? Math.max(0, stats.totalOriginal - stats.hidden) : stats.totalOriginal;
        // Si totalOriginal es 0 (aún no cargó), mostramos "?"
        const visibleText = stats.totalOriginal > 0 ? formatNumber(visibleValue) : '...';

        btn.className = statusClass;
        btn.innerHTML = `
            <span style="font-size: 20px;">${icon}</span>
            <div class="meli-stat-group">
                <span>
                    <span class="meli-stat-label">Visibles:</span> 
                    <span class="meli-stat-value" style="color: ${isFilterEnabled ? '#333' : '#00a650'}">
                        ${isFilterEnabled ? visibleText : 'Todos'}
                    </span>
                </span>
                <span>
                    <span class="meli-stat-label">Intl. Ocultos:</span> 
                    <span class="meli-stat-value" style="color: #ff5a5f">${stats.hidden}</span>
                </span>
            </div>
        `;

        updateHeaderCounter();
    }

    // Función dedicada para restaurar el texto limpio
    function restoreHeaderOriginal() {
        const countElement = document.querySelector(RESULT_COUNT_SELECTORS.join(', '));
        if (countElement && countElement.dataset.originalHtml) {
            countElement.innerHTML = countElement.dataset.originalHtml;
        }
    }

    function updateHeaderCounter() {
        const countElement = document.querySelector(RESULT_COUNT_SELECTORS.join(', '));
        if (!countElement) return;

        const currentText = countElement.innerText;

        // SEGURIDAD: Si detectamos nuestro propio span, NO leemos el número,
        // asumimos que el DOM está "sucio" con nuestros cambios.
        const isTainted = currentText.includes('meli-original-count-sub') || countElement.querySelector('.meli-original-count-sub');

        // 1. Inicialización de caché (Solo si no está sucio)
        if (!countElement.dataset.originalHtml && !isTainted) {
            countElement.dataset.originalHtml = countElement.innerHTML;
            countElement.dataset.originalText = currentText;
            stats.totalOriginal = parseNumber(currentText);
            stats.lastCleanText = currentText;
        }

        // 2. Detección de cambios externos (AJAX de MercadoLibre)
        // Solo actualizamos el original si el texto cambió Y no es nuestra culpa
        if (!isTainted && currentText !== stats.lastCleanText && currentText.trim() !== "") {
             countElement.dataset.originalHtml = countElement.innerHTML;
             countElement.dataset.originalText = currentText;
             stats.totalOriginal = parseNumber(currentText);
             stats.lastCleanText = currentText;
        }

        // 3. Aplicar cambios visuales
        if (isFilterEnabled && stats.hidden > 0 && stats.totalOriginal > 0) {
            const newTotal = Math.max(0, stats.totalOriginal - stats.hidden);
            const newTotalFormatted = formatNumber(newTotal);
            
            let originalText = countElement.dataset.originalText || currentText;
            
            // Reemplazo inteligente: solo el número
            const match = originalText.match(/[\d.,]+/);
            let finalText = originalText;
            
            if (match) {
                // Reemplazamos solo la primera coincidencia numérica
                finalText = originalText.replace(match[0], newTotalFormatted);
            }

            // Inyectamos
            countElement.innerHTML = `
                ${finalText}
                <span class="meli-original-count-sub" title="Original: ${formatNumber(stats.totalOriginal)}">
                    (${stats.hidden} ocultos)
                </span>
            `;
        } else if (!isFilterEnabled && countElement.dataset.originalHtml) {
            // Asegurar restauración si el filtro se apagó
            countElement.innerHTML = countElement.dataset.originalHtml;
        }
    }

    function processItems() {
        const items = document.querySelectorAll(ITEM_SELECTORS.join(', '));
        let currentHiddenCount = 0;
        
        items.forEach(item => {
            let isIntl = false;

            if (item.classList.contains('meli-processed')) {
                if (item.classList.contains('meli-item-international')) {
                    isIntl = true;
                }
            } else {
                item.classList.add('meli-processed');
                const textContent = item.innerText.toLowerCase();
                
                if (KEYWORDS.some(k => textContent.includes(k.toLowerCase()))) {
                    item.classList.add('meli-item-international');
                    isIntl = true;
                }
            }

            if (isIntl) currentHiddenCount++;
        });

        // Solo actualizamos si cambiaron los números
        if (currentHiddenCount !== stats.hidden) {
            stats.hidden = currentHiddenCount;
            // Intento de re-leer el total si estaba en 0
            if (stats.totalOriginal === 0) updateHeaderCounter();
            updateUI();
        } else {
            // A veces el número de ocultos no cambia, pero el total original sí (paginación)
            // Forzamos chequeo del header
            updateHeaderCounter();
        }
    }

    const debouncedProcess = debounce(processItems, 150);

    // --- Inicialización ---

    updateBodyClass();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }

    window.addEventListener('load', () => {
        processItems();
    });

    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        for (const mutation of mutations) {
            if (mutation.target.id === 'meli-filter-toggle' || 
                mutation.target.classList.contains('meli-original-count-sub')) {
                continue;
            }
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
             // Si cambia el texto del header (navegación entre páginas)
            if (mutation.target.matches && mutation.target.matches(RESULT_COUNT_SELECTORS.join(', '))) {
                 shouldUpdate = true;
            }
        }

        if (shouldUpdate) {
            debouncedProcess();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Filtro ML v2.4 (Bugfix Conteo) activo");

})();