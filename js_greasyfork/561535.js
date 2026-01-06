// ==UserScript==
// @name         MercadoLibre - Filtro Regional de Envíos Internacionales
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Oculta resultados internacionales, ajusta el contador de resultados reales y optimiza el rendimiento.
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
// @grant        none
// @license      MIT 
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
        textNodes: null // Para guardar referencia al nodo de texto original
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

    // Debounce para evitar ejecuciones excesivas durante scroll
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Extraer número de strings como "1.234 resultados" o "1,234 resultados"
    function parseNumber(str) {
        if (!str) return 0;
        // Eliminar todo lo que no sea número, punto o coma
        const cleanStr = str.replace(/[^\d.,]/g, '');
        // Eliminar puntos y comas para obtener el entero puro (asumiendo formato estándar)
        const numberStr = cleanStr.replace(/[.,]/g, '');
        return parseInt(numberStr, 10) || 0;
    }

    // Formatear número con separadores de miles según configuración local
    function formatNumber(num) {
        return num.toLocaleString('es-MX'); // Usamos es-MX como base genérica para Latam
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
            e.stopPropagation(); // Evitar propagación
            isFilterEnabled = !isFilterEnabled;
            localStorage.setItem(STORAGE_KEY, isFilterEnabled);
            
            // Actualización visual inmediata
            updateBodyClass();
            updateUI();
        });

        document.body.appendChild(btn);
        updateUI(); // Render inicial
    }

    function updateUI() {
        const btn = document.getElementById('meli-filter-toggle');
        if (!btn) return;

        // Actualizar botón flotante
        const icon = isFilterEnabled ? '🌎🚫' : '🌎👀';
        const statusClass = isFilterEnabled ? 'active' : 'inactive';
        
        // Calcular visibles (aproximado basado en lo cargado en DOM)
        // Nota: Total visible real es difícil de saber sin paginación, 
        // así que mostramos "Visibles en pantalla" o "Resultados ajustados".
        
        // Lógica para el botón
        const visibleText = isFilterEnabled ? (stats.totalOriginal - stats.hidden) : stats.totalOriginal;
        
        btn.className = statusClass;
        btn.innerHTML = `
            <span style="font-size: 20px;">${icon}</span>
            <div class="meli-stat-group">
                <span>
                    <span class="meli-stat-label">Visibles:</span> 
                    <span class="meli-stat-value" style="color: ${isFilterEnabled ? '#333' : '#00a650'}">
                        ${isFilterEnabled ? 'Filtrados' : 'Todos'}
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

    function updateHeaderCounter() {
        const countElement = document.querySelector(RESULT_COUNT_SELECTORS.join(', '));
        if (!countElement) return;

        // 1. Obtener y guardar el texto original UNA sola vez para evitar recursividad
        if (!countElement.dataset.originalHtml) {
            countElement.dataset.originalHtml = countElement.innerHTML;
            countElement.dataset.originalText = countElement.innerText;
            stats.totalOriginal = parseNumber(countElement.innerText);
        }

        // Si el sitio actualizó el contador por AJAX (ej. filtros laterales), detectamos cambio
        const currentText = countElement.innerText;
        // Si el texto actual no contiene nuestra marca y es diferente al guardado, es nuevo
        if (!currentText.includes('meli-original-count-sub') && currentText !== countElement.dataset.originalText) {
             countElement.dataset.originalHtml = countElement.innerHTML;
             countElement.dataset.originalText = countElement.innerText;
             stats.totalOriginal = parseNumber(currentText);
        }

        if (isFilterEnabled && stats.hidden > 0) {
            const newTotal = Math.max(0, stats.totalOriginal - stats.hidden);
            const newTotalFormatted = formatNumber(newTotal);
            
            // Reconstruimos el string "134 resultados" manteniendo el estilo
            // Usamos el texto original pero reemplazamos el número
            let originalText = countElement.dataset.originalText;
            
            // Buscar la parte del número en el texto original para reemplazarla
            // Esto preserva palabras como "resultados" o "productos"
            const match = originalText.match(/[\d.,]+/);
            let finalText = originalText;
            
            if (match) {
                finalText = originalText.replace(match[0], newTotalFormatted);
            }

            // Inyectamos HTML limpio
            countElement.innerHTML = `
                ${finalText}
                <span class="meli-original-count-sub" title="Original: ${formatNumber(stats.totalOriginal)}">
                    (${stats.hidden} ocultos)
                </span>
            `;
        } else {
            // Restaurar original
            countElement.innerHTML = countElement.dataset.originalHtml;
        }
    }

    function processItems() {
        const items = document.querySelectorAll(ITEM_SELECTORS.join(', '));
        let currentHiddenCount = 0;
        
        items.forEach(item => {
            // Chequeo rápido de clase para rendimiento
            let isIntl = false;

            if (item.classList.contains('meli-processed')) {
                // Si ya fue procesado, solo verificamos si es internacional
                if (item.classList.contains('meli-item-international')) {
                    isIntl = true;
                }
            } else {
                // Primer procesamiento
                item.classList.add('meli-processed');
                const textContent = item.innerText.toLowerCase();
                
                // Verificación de palabras clave
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
            // Si stats.totalOriginal es 0 (primera carga), intentamos leerlo
            if (stats.totalOriginal === 0) updateHeaderCounter();
            updateUI();
        }
    }

    // Versión optimizada con Debounce para el Observer
    const debouncedProcess = debounce(processItems, 150);

    // --- Inicialización ---

    updateBodyClass();

    // Iniciar UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }

    // Iniciar lógica
    window.addEventListener('load', () => {
        processItems(); // Ejecución inicial fuerte
        updateHeaderCounter();
    });

    // Observer optimizado
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        for (const mutation of mutations) {
            // Ignoramos cambios que hacemos nosotros mismos al botón o header
            if (mutation.target.id === 'meli-filter-toggle' || 
                mutation.target.classList.contains('ui-search-search-result__quantity-results')) {
                continue;
            }
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
        }

        if (shouldUpdate) {
            debouncedProcess();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Filtro ML Optimizado v2.3 activo");

})();