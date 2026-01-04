// ==UserScript==
// @name              Game8.co Precision Responsive Fix
// @name:es           Corrección de Diseño Responsivo para Game8.co
// @name:fr           Correction de Mise en Page Réactive pour Game8.co
// @name:de           Präzise Responsive-Fix für Game8.co
// @name:pt-PT        Correção de Layout Responsivo para Game8.co
// @name:ja           Game8.co 精密レスポンシブ修正
// @name:zh-CN        Game8.co 精准响应式修复
//
// @description       Allows the main content within game8 to fit based on window width instead of being fixed.
// @description:es    Permite que el contenido principal de game8 se ajuste al ancho de la ventana en lugar de estar fijo.
// @description:fr    Permet au contenu principal de game8 de s'adapter à la largeur de la fenêtre au lieu d'être fixe.
// @description:de    Ermöglicht, dass der Hauptinhalt von game8 auf Basis der Fensterbreite angepasst wird, anstatt fest fixiert zu sein.
// @description:pt-PT Permite que o conteúdo principal do game8 se ajuste com base na largura da janela em vez de ser fixo.
// @description:ja    game8のメインコンテンツが固定幅ではなくウィンドウ幅に基づいて調整されるようにします。
// @description:zh-CN 使game8的主内容能够根据窗口宽度自适应，而不是固定布局。
//
// @namespace         http://tampermonkey.net/
// @version           1.3
// @author            Understandable
// @match             https://game8.co/*
// @match             http://game8.co/*
// @license           MIT
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/550865/Game8co%20Precision%20Responsive%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/550865/Game8co%20Precision%20Responsive%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyPrecisionFix() {
        const style = document.createElement('style');
        style.textContent = `
            /* Reset base containers */
            body, html {
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* Main container hierarchy */
            .p-archiveBody__container,
            .p-archiveBody__main,
            .p-archiveContent__container,
            .p-archiveContent__main {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                overflow-x: hidden !important;
            }

            /* ===== SIDEBAR FIX - Remove cutoff and scrollbar ===== */
            .p-archiveBody__side,
            .p-archiveBody__side-inner,
            #gameMenuScrollArea {
                height: auto !important;
                max-height: none !important;
                min-height: auto !important;
                overflow: visible !important;
                position: relative !important;
                top: auto !important;
                bottom: auto !important;
            }

            /* Remove any fixed positioning or sticky behavior */
            .p-archiveBody__side {
                position: static !important;
            }

            /* Ensure the scroll area container doesn't restrict height */
            #gameMenuScrollArea {
                display: block !important;
                transform: none !important;
            }

            /* Fix the announcement div that goes past screen */
            .a-announce {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 10px !important;
                box-sizing: border-box !important;
            }

            .a-announce__inner {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* Fix paragraphs and text content */
            .a-paragraph {
                width: 100% !important;
                max-width: 100% !important;
                word-wrap: break-word !important;
                word-break: break-word !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
            }

            /* Force ALL tables to fit screen width */
            .a-table {
                width: 100% !important;
                max-width: 100% !important;
                table-layout: fixed !important;
                border-collapse: collapse !important;
            }

            /* Specifically target fixed tables and override them */
            .table--fixed,
            .a-table.table--fixed {
                width: 100% !important;
                max-width: 100% !important;
                table-layout: auto !important;
            }

            /* Force table cells to wrap and fit */
            .a-table td,
            .a-table th {
                word-wrap: break-word !important;
                word-break: break-word !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
                max-width: 100% !important;
                min-width: 0 !important;
                padding: 6px 8px !important;
                box-sizing: border-box !important;
            }

            /* Fix outline containers */
            .a-outline {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            .a-outline ul {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                padding-left: 20px !important;
            }

            /* Fix headers - target all header classes */
            .a-header--3,
            .a-header--4,
            [class*="a-header"] {
                width: 100% !important;
                max-width: 100% !important;
                word-wrap: break-word !important;
                word-break: break-word !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
                box-sizing: border-box !important;
            }

            /* Fix tab containers */
            .a-tabContainer {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* Fix images and videos */
            .a-img,
            video.a-img {
                max-width: 100% !important;
                height: auto !important;
                box-sizing: border-box !important;
            }

            /* Archive style wrapper - the main content container */
            .archive-style-wrapper {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                margin: 0 !important;
                padding: 10px !important;
                box-sizing: border-box !important;
                overflow-x: hidden !important;
            }

            /* Force everything inside archive-style-wrapper to be constrained */
            .archive-style-wrapper * {
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* Specific fix for bullet point lists */
            .a-announce .a-paragraph,
            .archive-style-wrapper .a-paragraph {
                width: 100% !important;
                max-width: 100% !important;
                margin: 5px 0 !important;
                padding: 0 !important;
            }

            /* Ensure no horizontal scrolling anywhere */
            body {
                overflow-x: hidden !important;
            }

            /* ===== SIDEBAR REMOVAL ===== */
            .p-archiveContent__side {
                display: none !important;
            }

            /* ===== FOOTER GUIDES LIMITATION ===== */
            .l-footerGame__col_links li:nth-child(n+6) {
                display: none !important;
            }

            /* Alternative: Show only first 5 guides */
            .l-footerGame__col_links {
                max-height: 150px !important;
                overflow: hidden !important;
            }

            /* ===== FOOTER CORP LIST FIX ===== */
            .l-footerCorp__center ul {
                padding: 10px 0 !important;
                line-height: 1.5 !important;
            }

            .l-footerCorp__center ul li {
                padding: 4px 0 !important;
                margin: 2px 0 !important;
            }

            .l-footerCorp__center a {
                padding: 6px 0 !important;
                display: block !important;
                text-decoration: none !important;
            }

            /* ===== MAP SPECIFIC FIXES ===== */

            /* Fix map container z-index to not cover header */
            .react-new_map_tool-wrapper,
            .a-catalog__bg,
            #react-new_map_tool-wrapper {
                z-index: 1 !important;
                position: relative !important;
            }

            /* Fix Leaflet map container */
            .leaflet-container {
                z-index: 1 !important;
            }

            /* Fix map marker tooltips - KEEP TEXT ON ONE LINE */
            .leaflet-tooltip {
                background: white !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                padding: 4px 8px !important;
                white-space: nowrap !important;
                max-width: none !important;
                min-width: auto !important;
                width: auto !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
                z-index: 1000 !important;
            }

            /* Remove text wrapping for tooltip content */
            .leaflet-tooltip-content {
                width: auto !important;
                white-space: nowrap !important;
            }

            /* Fix marker images */
            .leaflet-marker-icon {
                z-index: 10 !important;
            }

            /* Ensure header stays above map */
            .l-header,
            [class*="header"],
            [class*="Header"] {
                z-index: 100 !important;
                position: relative !important;
            }

            /* Fix any popups or overlays */
            .leaflet-popup {
                z-index: 1000 !important;
            }

            .leaflet-popup-content-wrapper {
                background: white !important;
                border-radius: 4px !important;
                padding: 8px !important;
            }

            .leaflet-popup-content {
                width: auto !important;
                word-wrap: break-word !important;
                white-space: normal !important;
            }

            /* Mobile optimization for very small screens */
            @media (max-width: 768px) {
                .a-table {
                    display: block !important;
                    overflow-x: auto !important;
                }

                .a-table td,
                .a-table th {
                    font-size: 12px !important;
                    padding: 4px 6px !important;
                }
            }
        `;

        // Remove existing style if present
        const existingStyle = document.getElementById('game8-precision-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        style.id = 'game8-precision-fix';
        document.head.appendChild(style);

        // Also directly manipulate stubborn elements
        setTimeout(() => {
            // Fix all tables
            const tables = document.querySelectorAll('.a-table, .table--fixed');
            tables.forEach(table => {
                table.style.width = '100%';
                table.style.maxWidth = '100%';
                table.style.tableLayout = 'auto';
            });

            // Fix all cells
            const cells = document.querySelectorAll('.a-table td, .a-table th');
            cells.forEach(cell => {
                cell.style.whiteSpace = 'normal';
                cell.style.wordWrap = 'break-word';
                cell.style.wordBreak = 'break-word';
            });

            // Fix headers (target by class pattern)
            const headers = document.querySelectorAll('[class*="a-header"]');
            headers.forEach(header => {
                header.style.whiteSpace = 'normal';
                header.style.wordWrap = 'break-word';
                header.style.maxWidth = '100%';
            });

            // Remove sidebar completely using DOM manipulation as backup
            const sidebar = document.querySelector('.p-archiveContent__side');
            if (sidebar) {
                sidebar.style.display = 'none';
                sidebar.remove();
            }

            // Fix the game menu sidebar to remove cutoff and scrollbar
            const bodySidebar = document.querySelector('.p-archiveBody__side');
            const bodySidebarInner = document.querySelector('.p-archiveBody__side-inner');
            const gameMenuScrollArea = document.getElementById('gameMenuScrollArea');

            if (bodySidebar) {
                bodySidebar.style.height = 'auto';
                bodySidebar.style.maxHeight = 'none';
                bodySidebar.style.overflow = 'visible';
                bodySidebar.style.position = 'static';
            }

            if (bodySidebarInner) {
                bodySidebarInner.style.height = 'auto';
                bodySidebarInner.style.maxHeight = 'none';
                bodySidebarInner.style.overflow = 'visible';
            }

            if (gameMenuScrollArea) {
                gameMenuScrollArea.style.height = 'auto';
                gameMenuScrollArea.style.maxHeight = 'none';
                gameMenuScrollArea.style.overflow = 'visible';
                gameMenuScrollArea.style.display = 'block';
                gameMenuScrollArea.style.transform = 'none';
            }

            // Limit footer guides to 5 items using DOM manipulation
            const guideLists = document.querySelectorAll('.l-footerGame__col_links');
            guideLists.forEach(list => {
                const items = list.querySelectorAll('li');
                if (items.length > 5) {
                    for (let i = 5; i < items.length; i++) {
                        items[i].style.display = 'none';
                    }
                }
            });

            // Fix footer corp list spacing
            const corpLists = document.querySelectorAll('.l-footerCorp__center ul');
            corpLists.forEach(list => {
                list.style.padding = '10px 0';
                list.style.lineHeight = '1.5';
                const listItems = list.querySelectorAll('li');
                listItems.forEach(li => {
                    li.style.padding = '4px 0';
                    li.style.margin = '2px 0';
                });
            });

            // Fix map tooltips dynamically
            fixMapTooltips();
        }, 100);
    }

    function fixMapTooltips() {
        // Wait for map to load and then fix tooltips
        setTimeout(() => {
            // Fix existing tooltips - KEEP TEXT ON ONE LINE
            const tooltips = document.querySelectorAll('.leaflet-tooltip');
            tooltips.forEach(tooltip => {
                tooltip.style.whiteSpace = 'nowrap';
                tooltip.style.maxWidth = 'none';
                tooltip.style.width = 'auto';
                tooltip.style.minWidth = 'auto';
                tooltip.style.padding = '4px 8px';
            });
        }, 2000);

        // Also observe for new tooltips being added dynamically
        const mapObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.classList && (node.classList.contains('leaflet-tooltip') ||
                                node.querySelector('.leaflet-tooltip'))) {
                                setTimeout(() => {
                                    const tooltips = document.querySelectorAll('.leaflet-tooltip');
                                    tooltips.forEach(tooltip => {
                                        tooltip.style.whiteSpace = 'nowrap';
                                        tooltip.style.maxWidth = 'none';
                                        tooltip.style.width = 'auto';
                                        tooltip.style.minWidth = 'auto';
                                        tooltip.style.padding = '4px 8px';
                                    });
                                }, 100);
                            }
                        }
                    });
                }
            });
        });

        // Start observing for map container changes
        const mapContainer = document.querySelector('.react-new_map_tool-wrapper, .leaflet-container');
        if (mapContainer) {
            mapObserver.observe(mapContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    // Apply immediately
    applyPrecisionFix();

    // Set up observer for dynamic content
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length || mutation.type === 'attributes') {
                shouldUpdate = true;
            }
        });
        if (shouldUpdate) {
            setTimeout(applyPrecisionFix, 50);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Re-apply on resize and load
    window.addEventListener('resize', applyPrecisionFix);
    window.addEventListener('load', applyPrecisionFix);

    // Additional timeouts to catch late-loading content
    setTimeout(applyPrecisionFix, 500);
    setTimeout(applyPrecisionFix, 2000);
})();