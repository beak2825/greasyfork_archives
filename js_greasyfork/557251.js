// ==UserScript==
// @name         SIGSA 5a - Generador PDF (V37.5 Final - Fix Redondeo Kilos)
// @namespace    http://tampermonkey.net/
// @version      37.5
// @description  Versión definitiva. Fix: Cálculo de Kilos usa redondeo a 2 decimales para coincidir con límite superior TAB.
// @author       Jonatan Hernandez & Gemini AI
// @match        *://*.mspas.gob.gt/*/Sigsa5a/*
// @match        *://*.mspas.gob.gt/*/sigsa5a/*
// @match        *://*.mspas.gob.gt/Sigsa5a/*
// @match        *://*.mspas.gob.gt/sigsa5a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557251/SIGSA%205a%20-%20Generador%20PDF%20%28V375%20Final%20-%20Fix%20Redondeo%20Kilos%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557251/SIGSA%205a%20-%20Generador%20PDF%20%28V375%20Final%20-%20Fix%20Redondeo%20Kilos%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CARGA DE LIBRERÍA ---
    if (typeof window.jspdf === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.head.appendChild(script);
    }

    setTimeout(initScript, 1500);

    function initScript() {
        console.log("🚀 Script V37.4 Final Iniciado");

        // =================================================================================
        // --- ZONA DE EDICION DE TABLAS TAB (Tendencia a la Baja) ---
        // PEGA AQUI TUS DATOS DE EXCEL CON EL FORMATO: Talla;LimiteDAM;LimiteTAB
        // Ejemplo: 65;6.1;6.6
        // =================================================================================

        // Tabla 1: Niños (Masculino) de 0 a < 2 años
        const DATA_0_2_M = `
        45;2;2.2
        45.5;2.1;2.3
        46;2.2;2.4
        46.5;2.3;2.5
        47;2.3;2.5
        47.5;2.4;2.6
        48;2.5;2.7
        48.5;2.6;2.8
        49;2.6;2.9
        49.5;2.7;3
        50;2.8;3
        50.5;2.9;3.1
        51;3;3.2
        51.5;3.1;3.3
        52;3.2;3.5
        52.5;3.3;3.6
        53;3.4;3.7
        53.5;3.5;3.8
        54;3.6;3.9
        54.5;3.7;4
        55;3.8;4.2
        55.5;4;4.3
        56;4.1;4.4
        56.5;4.2;4.6
        57;4.3;4.7
        57.5;4.5;4.9
        58;4.6;5
        58.5;4.7;5.1
        59;4.8;5.3
        59.5;5;5.4
        60;5.1;5.5
        60.5;5.2;5.6
        61;5.3;5.8
        61.5;5.4;5.9
        62;5.6;6
        62.5;5.7;6.1
        63;5.8;6.2
        63.5;5.9;6.4
        64;6;6.5
        64.5;6.1;6.6
        65;6.2;6.7
        65.5;6.3;6.8
        66;6.4;6.9
        66.5;6.5;7
        67;6.6;7.1
        67.5;6.7;7.2
        68;6.8;7.3
        68.5;6.9;7.5
        69;7;7.6
        69.5;7.1;7.7
        70;7.2;7.8
        70.5;7.3;7.9
        71;7.4;8
        71.5;7.5;8.1
        72;7.6;8.2
        72.5;7.6;8.3
        73;7.7;8.4
        73.5;7.8;8.5
        74;7.9;8.6
        74.5;8;8.7
        75;8.1;8.8
        75.5;8.2;8.8
        76;8.3;8.9
        76.5;8.3;9
        77;8.4;9.1
        77.5;8.5;9.2
        78;8.6;9.3
        78.5;8.7;9.4
        79;8.7;9.5
        79.5;8.8;9.5
        80;8.9;9.6
        80.5;9;9.7
        81;9.1;9.8
        81.5;9.1;9.9
        82;9.2;10
        82.5;9.3;10.1
        83;9.4;10.2
        83.5;9.5;10.3
        84;9.6;10.4
        84.5;9.7;10.5
        85;9.8;10.6
        85.5;9.9;10.7
        86;10;10.8
        86.5;10.1;11
        87;10.2;11.1
        87.5;10.4;11.2
        88;10.5;11.3
        88.5;10.6;11.4
        89;10.7;11.5
        89.5;10.8;11.6
        90;10.9;11.8
        90.5;11;11.9
        91;11.1;12
        91.5;11.2;12.1
        92;11.3;12.2
        92.5;11.4;12.3
        93;11.5;12.4
        93.5;11.6;12.5
        94;11.7;12.6
        94.5;11.8;12.7
        95;11.9;12.8
        95.5;12;12.9
        96;12.1;13.1
        96.5;12.2;13.2
        97;12.3;13.3
        97.5;12.4;13.4
        98;12.5;13.5
        98.5;12.6;13.6
        99;12.7;13.7
        99.5;12.8;13.9
        100;12.9;14
        100.5;13;14.1
        101;13.2;14.2
        101.5;13.3;14.4
        102;13.4;14.5
        102.5;13.5;14.6
        103;13.6;14.8
        103.5;13.7;14.9
        104;13.9;15
        104.5;14;15.2
        105;14.1;15.3
        105.5;14.2;15.4
        106;14.4;15.6
        106.5;14.5;15.7
        107;14.6;15.9
        107.5;14.7;16
        108;14.9;16.2
        108.5;15;16.3
        109;15.1;16.5
        109.5;15.3;16.6
        110;15.4;16.8
        `;

        // Tabla 2: Niñas (Femenino) de 0 a < 2 años
        const DATA_0_2_F = `
        45;2.1;2.3
        45.5;2.1;2.3
        46;2.2;2.4
        46.5;2.3;2.5
        47;2.4;2.6
        47.5;2.4;2.6
        48;2.5;2.7
        48.5;2.6;2.8
        49;2.6;2.9
        49.5;2.7;3
        50;2.8;3.1
        50.5;2.9;3.2
        51;3;3.3
        51.5;3.1;3.4
        52;3.2;3.5
        52.5;3.3;3.6
        53;3.4;3.7
        53.5;3.5;3.8
        54;3.6;3.9
        54.5;3.7;4
        55;3.8;4.2
        55.5;3.9;4.3
        56;4;4.4
        56.5;4.1;4.5
        57;4.3;4.6
        57.5;4.4;4.8
        58;4.5;4.9
        58.5;4.6;5
        59;4.7;5.1
        59.5;4.8;5.3
        60;4.9;5.4
        60.5;5;5.5
        61;5.1;5.6
        61.5;5.2;5.7
        62;5.3;5.8
        62.5;5.4;5.9
        63;5.5;6
        63.5;5.6;6.2
        64;5.7;6.3
        64.5;5.8;6.4
        65;5.9;6.5
        65.5;6;6.6
        66;6.1;6.7
        66.5;6.2;6.8
        67;6.3;6.9
        67.5;6.4;7
        68;6.5;7.1
        68.5;6.6;7.2
        69;6.7;7.3
        69.5;6.8;7.4
        70;6.9;7.5
        70.5;6.9;7.6
        71;7;7.7
        71.5;7.1;7.7
        72;7.2;7.8
        72.5;7.3;7.9
        73;7.4;8
        73.5;7.4;8.1
        74;7.5;8.2
        74.5;7.6;8.3
        75;7.7;8.4
        75.5;7.8;8.5
        76;7.8;8.5
        76.5;7.9;8.6
        77;8;8.7
        77.5;8.1;8.8
        78;8.2;8.9
        78.5;8.2;9
        79;8.3;9.1
        79.5;8.4;9.1
        80;8.5;9.2
        80.5;8.6;9.3
        81;8.7;9.4
        81.5;8.8;9.5
        82;8.8;9.6
        82.5;8.9;9.7
        83;9;9.8
        83.5;9.1;9.9
        84;9.2;10.1
        84.5;9.3;10.2
        85;9.4;10.3
        85.5;9.5;10.4
        86;9.7;10.5
        86.5;9.8;10.6
        87;9.9;10.7
        87.5;10;10.9
        88;10.1;11
        88.5;10.2;11.1
        89;10.3;11.2
        89.5;10.4;11.3
        90;10.5;11.4
        90.5;10.6;11.5
        91;10.7;11.7
        91.5;10.8;11.8
        92;10.9;11.9
        92.5;11;12
        93;11.1;12.1
        93.5;11.2;12.2
        94;11.3;12.3
        94.5;11.4;12.4
        95;11.5;12.6
        95.5;11.6;12.7
        96;11.7;12.8
        96.5;11.8;12.9
        97;12;13
        97.5;12.1;13.1
        98;12.2;13.3
        98.5;12.3;13.4
        99;12.4;13.5
        99.5;12.5;13.6
        100;12.6;13.7
        100.5;12.7;13.9
        101;12.8;14
        101.5;13;14.1
        102;13.1;14.3
        102.5;13.2;14.4
        103;13.3;14.5
        103.5;13.5;14.7
        104;13.6;14.8
        104.5;13.7;15
        105;13.8;15.1
        105.5;14;15.3
        106;14.1;15.4
        106.5;14.3;15.6
        107;14.4;15.7
        107.5;14.5;15.9
        108;14.7;16
        108.5;14.8;16.2
        109;15;16.4
        109.5;15.1;16.5
        110;15.3;16.7
        `;

        // Tabla 3: Niños (Masculino) de 2 a < 5 años
        const DATA_2_5_M = `
        65;5.9;6.9
        65.5;6;7
        66;6.1;7.1
        66.5;6.1;7.2
        67;6.2;7.3
        67.5;6.3;7.4
        68;6.4;7.5
        68.5;6.5;7.6
        69;6.6;7.7
        69.5;6.7;7.8
        70;6.8;7.9
        70.5;6.9;8
        71;6.9;8.1
        71.5;7;8.2
        72;7.1;8.3
        72.5;7.2;8.4
        73;7.3;8.5
        73.5;7.4;8.6
        74;7.4;8.7
        74.5;7.5;8.8
        75;7.6;8.9
        75.5;7.7;9
        76;7.7;9.1
        76.5;7.8;9.2
        77;7.9;9.2
        77.5;8;9.3
        78;8;9.4
        78.5;8.1;9.5
        79;8.2;9.6
        79.5;8.3;9.7
        80;8.3;9.7
        80.5;8.4;9.8
        81;8.5;9.9
        81.5;8.6;10
        82;8.7;10.1
        82.5;8.7;10.2
        83;8.8;10.3
        83.5;8.9;10.4
        84;9;10.5
        84.5;9.1;10.7
        85;9.2;10.8
        85.5;9.3;10.9
        86;9.4;11
        86.5;9.5;11.1
        87;9.6;11.2
        87.5;9.7;11.3
        88;9.8;11.5
        88.5;9.9;11.6
        89;10;11.7
        89.5;10.1;11.8
        90;10.2;11.9
        90.5;10.3;12
        91;10.4;12.1
        91.5;10.5;12.2
        92;10.6;12.3
        92.5;10.7;12.4
        93;10.8;12.6
        93.5;10.9;12.7
        94;11;12.8
        94.5;11.1;12.9
        95;11.1;13
        95.5;11.2;13.1
        96;11.3;13.2
        96.5;11.4;13.3
        97;11.5;13.4
        97.5;11.6;13.6
        98;11.7;13.7
        98.5;11.8;13.8
        99;11.9;13.9
        99.5;12;14
        100;12.1;14.2
        100.5;12.2;14.3
        101;12.3;14.4
        101.5;12.4;14.5
        102;12.5;14.7
        102.5;12.6;14.8
        103;12.8;14.9
        103.5;12.9;15.1
        104;13;15.2
        104.5;13.1;15.4
        105;13.2;15.5
        105.5;13.3;15.6
        106;13.4;15.8
        106.5;13.5;15.9
        107;13.7;16.1
        107.5;13.8;16.2
        108;13.9;16.4
        108.5;14;16.5
        109;14.1;16.7
        109.5;14.3;16.8
        110;14.4;17
        110.5;14.5;17.1
        111;14.6;17.3
        111.5;14.8;17.5
        112;14.9;17.6
        112.5;15;17.8
        113;15.2;18
        113.5;15.3;18.1
        114;15.4;18.3
        114.5;15.6;18.5
        115;15.7;18.6
        115.5;15.8;18.8
        116;16;19
        116.5;16.1;19.2
        117;16.2;19.3
        117.5;16.4;19.5
        118;16.5;19.7
        118.5;16.7;19.9
        119;16.8;20
        119.5;16.9;20.2
        120;17.1;20.4
        `;

        // Tabla 4: Niñas (Femenino) de 2 a < 5 años
        const DATA_2_5_F = `
        65;5.6;6.6
        65.5;5.7;6.7
        66;5.8;6.8
        66.5;5.8;6.9
        67;5.9;7
        67.5;6;7.1
        68;6.1;7.2
        68.5;6.2;7.3
        69;6.3;7.4
        69.5;6.3;7.5
        70;6.4;7.6
        70.5;6.5;7.7
        71;6.6;7.8
        71.5;6.7;7.9
        72;6.7;8
        72.5;6.8;8.1
        73;6.9;8.1
        73.5;7;8.2
        74;7;8.3
        74.5;7.1;8.4
        75;7.2;8.5
        75.5;7.2;8.6
        76;7.3;8.7
        76.5;7.4;8.7
        77;7.5;8.8
        77.5;7.5;8.9
        78;7.6;9
        78.5;7.7;9.1
        79;7.8;9.2
        79.5;7.8;9.3
        80;7.9;9.4
        80.5;8;9.5
        81;8.1;9.6
        81.5;8.2;9.7
        82;8.3;9.8
        82.5;8.4;9.9
        83;8.5;10
        83.5;8.5;10.1
        84;8.6;10.2
        84.5;8.7;10.3
        85;8.8;10.4
        85.5;8.9;10.6
        86;9;10.7
        86.5;9.1;10.8
        87;9.2;10.9
        87.5;9.3;11
        88;9.4;11.1
        88.5;9.5;11.2
        89;9.6;11.4
        89.5;9.7;11.5
        90;9.8;11.6
        90.5;9.9;11.7
        91;10;11.8
        91.5;10.1;11.9
        92;10.2;12
        92.5;10.3;12.1
        93;10.4;12.3
        93.5;10.5;12.4
        94;10.6;12.5
        94.5;10.7;12.6
        95;10.8;12.7
        95.5;10.8;12.8
        96;10.9;12.9
        96.5;11;13.1
        97;11.1;13.2
        97.5;11.2;13.3
        98;11.3;13.4
        98.5;11.4;13.5
        99;11.5;13.7
        99.5;11.6;13.8
        100;11.7;13.9
        100.5;11.9;14.1
        101;12;14.2
        101.5;12.1;14.3
        102;12.2;14.5
        102.5;12.3;14.6
        103;12.4;14.7
        103.5;12.5;14.9
        104;12.6;15
        104.5;12.8;15.2
        105;12.9;15.3
        105.5;13;15.5
        106;13.1;15.6
        106.5;13.3;15.8
        107;13.4;15.9
        107.5;13.5;16.1
        108;13.7;16.3
        108.5;13.8;16.4
        109;13.9;16.6
        109.5;14.1;16.8
        110;14.2;17
        110.5;14.4;17.1
        111;14.5;17.3
        111.5;14.7;17.5
        112;14.8;17.7
        112.5;15;17.9
        113;15.1;18
        113.5;15.3;18.2
        114;15.4;18.4
        114.5;15.6;18.6
        115;15.7;18.8
        115.5;15.9;19
        116;16;19.2
        116.5;16.2;19.4
        117;16.3;19.6
        117.5;16.5;19.8
        118;16.6;19.9
        118.5;16.8;20.1
        119;16.9;20.3
        119.5;17.1;20.5
        120;17.3;20.7
        `;

        // =================================================================================

        const Palette = {
            BG_PAGE: "#f8fafc", BG_CARD: "#ffffff", BORDER_CARD: "#e2e8f0",
            TEXT_PRIMARY: "#1e293b", TEXT_SECONDARY: "#64748b", TEXT_LABEL: "#94a3b8",
            BLUE_700: "#1d4ed8", BLUE_500: "#3b82f6", BLUE_50: "#eff6ff", BLUE_100: "#dbeafe",
            GREEN_600: "#16a34a", GREEN_50: "#f0fdf4",
            ORANGE_600: "#ea580c", ORANGE_500: "#f97316", ORANGE_50: "#fff7ed", ORANGE_100: "#ffedd5",
            RED_600: "#dc2626", RED_50: "#fef2f2",
            PINK_500: "#ec4899", PINK_50: "#fdf2f8",
            YELLOW_700: "#a16207", YELLOW_200: "#fef08a",
            PURPLE_500: "#8b5cf6", PURPLE_600: "#7c3aed", PURPLE_50: "#f5f3ff", PURPLE_100: "#ede9fe",
            GRAY_100: "#f3f4f6", GRAY_400: "#9ca3af",
            LINE_SEPARATOR: "#cbd5e1",

            // --- PALETA DE DIAGNÓSTICOS (Fondo, Texto, Borde) ---
            DIAG_NORMAL:    { bg: "#f0fdf4", tx: "#15803d", bd: "#86efac" }, // Verde
            DIAG_MODERADO:  { bg: "#fff7ed", tx: "#c2410c", bd: "#fdba74" }, // Naranja
            DIAG_SEVERO:    { bg: "#fef2f2", tx: "#b91c1c", bd: "#fca5a5" }, // Rojo
            DIAG_SOBREPESO: { bg: "#eff6ff", tx: "#1d4ed8", bd: "#93c5fd" }, // Azul
            DIAG_OBESIDAD:  { bg: "#ecfeff", tx: "#0e7490", bd: "#67e8f9" }, // Celeste
            DIAG_TAB:       { bg: "#fefce8", tx: "#a16207", bd: "#fde047" }  // Amarillo (NUEVO)
        };

        // --- PARSER PARA LAS TABLAS DE EXCEL ---
        const parseTabTables = () => {
            const parseStr = (str) => {
                const map = new Map();
                if(!str) return map;
                str.trim().split('\n').forEach(line => {
                    const parts = line.trim().split(';');
                    if(parts.length >= 3) {
                        const talla = parseFloat(parts[0]);
                        const dam = parseFloat(parts[1]);
                        const tab = parseFloat(parts[2]);
                        map.set(talla, { dam, tab });
                    }
                });
                return map;
            };
            return {
                m_0_2: parseStr(DATA_0_2_M),
                f_0_2: parseStr(DATA_0_2_F),
                m_2_5: parseStr(DATA_2_5_M),
                f_2_5: parseStr(DATA_2_5_F)
            };
        };

        const TAB_TABLES = parseTabTables();

        // --- SISTEMA DE DIBUJADO DE ICONOS (EXPANDIDO) ---
        const drawIcon = (doc, type, x, y, size) => {
            const cx = x + size / 2;
            const cy = y + size / 2;

            doc.saveGraphicsState();

            switch (type) {
                case 'UBICACION':
                    doc.setFillColor("#fee2e2");
                    doc.roundedRect(x, y, size, size, size/4, size/4, 'F');
                    doc.setFillColor("#dc2626");
                    doc.circle(cx, cy - size*0.1, size*0.25, 'F');
                    doc.triangle(cx - size*0.25, cy, cx + size*0.25, cy, cx, cy + size*0.35, 'F');
                    doc.setFillColor("#ffffff");
                    doc.circle(cx, cy - size*0.1, size*0.1, 'F');
                    break;

                case 'RUP':
                    doc.setFillColor("#f1f5f9");
                    doc.roundedRect(x, y, size, size, size/4, size/4, 'F');
                    doc.setFillColor("#64748b");
                    const cardW = size * 0.7;
                    const cardH = size * 0.5;
                    const cardX = cx - cardW/2;
                    const cardY = cy - cardH/2;
                    doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2, 'F');
                    doc.setFillColor("#e2e8f0");
                    doc.rect(cardX + 3, cardY + 3, cardW * 0.3, cardH - 6, 'F');
                    doc.rect(cardX + cardW * 0.4, cardY + 5, cardW * 0.5, 2, 'F');
                    doc.rect(cardX + cardW * 0.4, cardY + 10, cardW * 0.4, 2, 'F');
                    break;

                case 'MONITOREO':
                    doc.setFillColor("#d1fae5");
                    doc.roundedRect(x, y, size, size, size/4, size/4, 'F');
                    doc.setDrawColor("#059669");
                    doc.setLineWidth(1.5);
                    const pad = size * 0.25;
                    doc.line(x + pad, y + pad, x + pad, y + size - pad);
                    doc.line(x + pad, y + size - pad, x + size - pad, y + size - pad);
                    doc.setDrawColor("#10b981");
                    doc.line(x + pad, y + size - pad, x + size * 0.5, y + size * 0.5);
                    doc.line(x + size * 0.5, y + size * 0.5, x + size * 0.7, y + size * 0.65);
                    doc.line(x + size * 0.7, y + size * 0.65, x + size - pad, y + pad);
                    break;

                case 'VACUNACION':
                    doc.setFillColor("#dbeafe");
                    doc.circle(cx, cy, size/2, 'F');
                    doc.setFillColor("#1d4ed8");
                    doc.rect(cx - size*0.1, cy - size*0.15, size*0.2, size*0.35, 'F');
                    doc.rect(cx - size*0.05, cy - size*0.35, size*0.1, size*0.2, 'F');
                    doc.setLineWidth(1); doc.setDrawColor("#1d4ed8");
                    doc.line(cx, cy + size*0.2, cx, cy + size*0.35);
                    doc.setDrawColor("#ffffff"); doc.setLineWidth(0.5);
                    doc.line(cx - size*0.1, cy, cx + size*0.1, cy);
                    doc.line(cx - size*0.1, cy + size*0.1, cx + size*0.1, cy + size*0.1);
                    break;

                case 'SUPLEMENTACION':
                    doc.setFillColor("#ffedd5");
                    doc.roundedRect(x, y, size, size, size/4, size/4, 'F');
                    doc.setFillColor("#ea580c");
                    doc.roundedRect(cx - size*0.35, cy - size*0.1, size*0.25, size*0.3, 2, 2, 'F');
                    doc.rect(cx - size*0.3, cy - size*0.15, size*0.15, size*0.05, 'F');
                    doc.setFillColor("#f97316");
                    doc.roundedRect(cx + size*0.05, cy - size*0.2, size*0.3, size*0.4, 2, 2, 'F');
                    doc.setDrawColor("#ffffff"); doc.setLineWidth(1);
                    doc.line(cx + size*0.05, cy, cx + size*0.35, cy);
                    break;

                case 'ALIMENTACION':
                    doc.setFillColor("#f3e8ff");
                    doc.circle(cx, cy, size/2, 'F');
                    doc.setFillColor("#9333ea");
                    doc.roundedRect(cx - size*0.25, cy - size*0.15, size*0.5, size*0.4, 3, 3, 'F');
                    doc.setDrawColor("#9333ea"); doc.setLineWidth(2);
                    doc.line(cx - size*0.15, cy - size*0.15, cx - size*0.15, cy - size*0.3);
                    doc.line(cx + size*0.15, cy - size*0.15, cx + size*0.15, cy - size*0.3);
                    doc.line(cx - size*0.15, cy - size*0.3, cx + size*0.15, cy - size*0.3);
                    doc.setFillColor("#d8b4fe");
                    doc.rect(cx - size*0.15, cy + size*0.05, size*0.3, size*0.1, 'F');
                    break;
            }
            doc.restoreGraphicsState();
        };

        // --- DOM HELPERS ---
        const getValue = (suffix) => {
            const el = document.querySelector(`input[id$="${suffix}"]`);
            if (!el) return "";
            if (el.type === 'checkbox' || el.type === 'radio') return el.checked;
            return el.value.trim();
        };

        const getRadioValue = (suffix) => {
            const table = document.querySelector(`table[id$="${suffix}"]`);
            if(!table) return null;
            const checked = table.querySelector('input:checked');
            if (checked) {
                const val = checked.value;
                if (val === '1') return 'Produccion';
                if (val === '2') return 'Cobertura';
                if (val === '3') return 'Contactado';
            }
            return null;
        };

        // --- PARSEO ---
        const parseDosis = (id) => ({ fecha: getValue(`txtDosis_${id}`), estado: getRadioValue(`RdSeleccion_${id}`) });

        const parseCrecimiento = (id) => {
            const fecha = getValue(`txtTallaFecha_${id}`);
            if (!fecha) return null;

            let data = {
                fecha: fecha,
                libras: getValue(`txtPesoLibras_${id}`),
                onzas: getValue(`txtPesoOnz_${id}`),
                talla: getValue(`txtTallaMedicion_${id}`),
                entrega_alimento_complementario: getValue(`chkAlimentoC_${id}`),
                diagnostico: { peso_edad: "--", longitud_edad: "--", peso_longitud: "--" }
            };

            try {
                const input = document.querySelector(`input[id$="txtTallaFecha_${id}"]`);
                if(input) {
                    let container = input.closest('table');
                    if(container) {
                        let rows = container.rows;
                        let lastRow = rows[rows.length - 1];
                        let cells = lastRow.cells;
                        if(cells.length > 1) data.diagnostico.peso_edad = cells[1].innerText.trim();
                        if(cells.length > 3) data.diagnostico.longitud_edad = cells[3].innerText.trim();
                        if(cells.length > 5) data.diagnostico.peso_longitud = cells[5].innerText.trim();
                    }
                }
            } catch(e) {}

            if(id === '74') {
                if(document.querySelector(`input[id$="Nacimiento_74_1"]`)?.checked) data.Prematuro = true;
                else if(document.querySelector(`input[id$="Nacimiento_74_2"]`)?.checked) data['A Termino'] = true;
                else data['N/D'] = true;
            }
            return data;
        };

        // Función para calcular edad de padres
        const getAge = (dateStr, refDate) => {
            if (!dateStr) return "";
            const parts = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
            if (!parts) return "";
            const day = parseInt(parts[1], 10);
            const month = parseInt(parts[2], 10) - 1;
            const year = parseInt(parts[3], 10);
            const birth = new Date(year, month, day);

            let age = refDate.getFullYear() - birth.getFullYear();
            const m = refDate.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && refDate.getDate() < birth.getDate())) {
                age--;
            }
            return `(${age} años)`;
        };

        const collectData = () => {
            return {
                datos_nino: {
                    nombre: getValue('txtNombre'),
                    rup: getValue('txtRUP'),
                    sexo: getValue('txtSexo'),
                    fecha_nacimiento: getValue('txtNacimiento'),
                    edad_anios: getValue('txtEdadAnio'),
                    edad_meses: getValue('txtEdadMes'),
                    edad_dias: getValue('txtEdadDias'),
                    edad_total_meses: getValue('txtMeses'),
                    municipio: getValue('TxtMunicipio'),
                    comunidad: getValue('TxtComunidad'),
                    direccion_exacta: getValue('txtDireccionExacta'),
                    departamento: getValue('txtDepartamento')
                },
                datos_relacion: {
                    madre: { nombre: getValue('TxtNombreMadre'), fecha_nacimiento: getValue('txtFechaNacMadre') },
                    padre: { nombre: getValue('TxtNombrePadre'), fecha_nacimiento: getValue('txtFechaNacPadre') },
                    responsable_nino: { nombre: getValue('TxtNombreResponsable'), fecha_nacimiento: getValue('txtFechaNacResponsable') }
                },
                registro_vacunacion: {
                    '< 1 Año': {
                        bcg: { '1a': parseDosis('1') }, hepatitis_b: { '1a': parseDosis('109') },
                        influenza: { '1a': parseDosis('113'), '2a': parseDosis('114') },
                        ipv1: { '1a': parseDosis('218') },
                        neumococo: { '1a': parseDosis('170'), '2a': parseDosis('171') },
                        pentavalente: { '1a': parseDosis('5'), '2a': parseDosis('6'), '3a': parseDosis('7') },
                        polio: { '2a': parseDosis('3'), '3a': parseDosis('4') },
                        rotavirus_2_dosis: { '1a': parseDosis('163'), '2a': parseDosis('164') },
                        rotavirus_3_dosis: { '1a': parseDosis('110'), '2a': parseDosis('111'), '3a': parseDosis('112') }
                    },
                    '1 a < 2 Años': {
                        dpt: { 'R1': parseDosis('9') },
                        influenza: { '1a': parseDosis('115'), '2a': parseDosis('116') },
                        neumococo: { 'R1': parseDosis('172') },
                        polio: { 'R1': parseDosis('8') },
                        spr: { '1a': parseDosis('10'), '2a': parseDosis('180') }
                    },
                    '2 a < 3 Años': { influenza: { '1a': parseDosis('178'), '2a': parseDosis('179') } },
                    '4 a < 7 Años': { dpt: { 'R2': parseDosis('12') }, polio: { 'R2': parseDosis('11') } }
                },
                suplementacion_micronutrientes: {
                    '6 Meses a < 1 Año': { vitamina_a: { '1a': parseDosis('27') }, vitaminas_y_minerales_espolvoreados: { '1a': parseDosis('100') } },
                    '1 a < 2 Años': { vitaminas_y_minerales_espolvoreados: { '1a': parseDosis('101'), '2a': parseDosis('102') }, desparasitante: { '1a': parseDosis('219'), '2a': parseDosis('220') } },
                    '2 a < 3 Años': { vitaminas_y_minerales_espolvoreados: { '1a': parseDosis('103'), '2a': parseDosis('104') }, desparasitante: { '1a': parseDosis('52'), '2a': parseDosis('53') } },
                    '3 a < 4 Años': { vitaminas_y_minerales_espolvoreados: { '1a': parseDosis('105'), '2a': parseDosis('106') }, desparasitante: { '1a': parseDosis('64'), '2a': parseDosis('65') } },
                    '4 a < 5 Años': { vitaminas_y_minerales_espolvoreados: { '1a': parseDosis('107'), '2a': parseDosis('108') }, desparasitante: { '1a': parseDosis('76'), '2a': parseDosis('77') } },
                    '5 a < 6 Años': { desparasitante: { '1a': parseDosis('221'), '2a': parseDosis('222') } }
                },
                monitoreo_crecimiento: {
                    '0_a_28_dias': parseCrecimiento('74'), '1_mes': parseCrecimiento('75'), '2_meses': parseCrecimiento('76'), '3_meses': parseCrecimiento('77'), '4_meses': parseCrecimiento('78'), '5_meses': parseCrecimiento('79'), '6_meses': parseCrecimiento('80'), '7_meses': parseCrecimiento('81'), '8_meses': parseCrecimiento('82'), '9_meses': parseCrecimiento('83'), '10_meses': parseCrecimiento('84'), '11_meses': parseCrecimiento('85'), '12_meses': parseCrecimiento('86'), '13_meses': parseCrecimiento('87'), '14_meses': parseCrecimiento('88'), '15_meses': parseCrecimiento('89'), '16_meses': parseCrecimiento('90'), '17_meses': parseCrecimiento('91'), '18_meses': parseCrecimiento('92'), '19_meses': parseCrecimiento('93'), '20_meses': parseCrecimiento('94'), '21_meses': parseCrecimiento('95'), '22_meses': parseCrecimiento('96'), '23_meses_29_dias': parseCrecimiento('97'),
                    '2_a_<_3_primer_control': parseCrecimiento('98'), '2_a_<_3_segundo_control': parseCrecimiento('99'), '2_a_<_3_tercer_control': parseCrecimiento('100'), '2_a_<_3_cuarto_control': parseCrecimiento('101'),
                    '3_a_<_4_primer_control': parseCrecimiento('102'), '3_a_<_4_segundo_control': parseCrecimiento('103'),
                    '4_a_<_5_primer_control': parseCrecimiento('104'), '4_a_<_5_segundo_control': parseCrecimiento('105')
                }
            };
        };

        // --- HELPER: OBTENER HORA SERVIDOR (HEAD REQUEST) ---
        const obtenerFechaServidor = async () => {
            try {
                // cache: 'no-store' asegura que si generas otro PDF en 1 min, no use la hora vieja guardada en memoria
                const response = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });

                const dateHeader = response.headers.get('date');
                if (!dateHeader) throw new Error("Header Date no encontrado");

                // Retornar objeto con formateado y objeto fecha crudo para calcular edad
                const d = new Date(dateHeader);
                return {
                    formatted: d.toLocaleString('es-GT', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                        hour12: false
                    }),
                    raw: d
                };
            } catch (e) {
                console.warn("⚠️ No se pudo obtener hora servidor, usando hora local:", e);
                // Fallback a hora local
                const d = new Date();
                return {
                    formatted: d.toLocaleString('es-GT', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                        hour12: false
                    }),
                    raw: d
                };
            }
        };

        // ==========================================
        // GENERADOR PDF (MODIFICADO PARA PREVIEW)
        // ==========================================
        const generatePDF = async (mode = 'download') => {
            try {
                const serverTimeData = await obtenerFechaServidor();
                const fechaEmision = serverTimeData.formatted;
                const rawDateObj = serverTimeData.raw;

                const jsPDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
                if (!jsPDF) { alert("Cargando librería... Intenta de nuevo."); return; }

                const data = collectData();
                if (!data.datos_nino.nombre) { alert("⚠️ Falta nombre del niño."); return; }

                const doc = new jsPDF({ unit: 'pt', format: 'letter' });
                const margin = 36;
                const pageW = doc.internal.pageSize.getWidth();
                const contentW = pageW - (margin * 2);
                let cursorY = margin;

                const getNested = (obj, args) => args.reduce((o, k) => (o && o[k] !== undefined) ? o[k] : null, obj);

                // Función de formateo de nombre MEJORADA: Soporta 1 apellido (sin coma)
                const formatName = (name) => {
                    if (!name) return "";
                    // Si tiene coma, asume formato "APELLIDOS, NOMBRES"
                    if (name.includes(',')) {
                        const p = name.split(',');
                        return `${p[1].trim()} ${p[0].trim()}`;
                    }
                    // Si NO tiene coma, asume formato "APELLIDO NOMBRES..."
                    // Toma la primera palabra como Apellido y el resto como Nombre
                    const parts = name.trim().split(/\s+/);
                    if (parts.length > 1) {
                        const apellido = parts[0];
                        const nombres = parts.slice(1).join(' ');
                        return `${nombres} ${apellido}`;
                    }
                    // Si solo es una palabra, devuélvela tal cual
                    return name;
                };

                const formatWeight = (l, o) => (l && o) ? `${parseInt(l)}.${parseInt(o)}` : "--";

                // --- HELPER: LOGICA DE TAB (NUEVO) ---
                const checkTAB = (sexo, ageMonths, talla, lbs, oz) => {
                    if (ageMonths < 6) return false; // Solo aplica desde los 6 meses

                    const isMale = (sexo || "").includes("Masculino");
                    const isUnder2 = ageMonths < 24;

                    // Seleccionar tabla
                    let table = null;
                    if(isMale && isUnder2) table = TAB_TABLES.m_0_2;
                    else if(!isMale && isUnder2) table = TAB_TABLES.f_0_2;
                    else if(isMale && !isUnder2) table = TAB_TABLES.m_2_5;
                    else if(!isMale && !isUnder2) table = TAB_TABLES.f_2_5;

                    if(!table) return false;

                    // Calcular Peso en Kg (Redondeado a 2 decimales para coincidir con límite superior TAB exacto)
                    // CORRECCION V37.4: Usar factor 2.2 y redondeo a 2 decimales
                    const totalKg = (parseInt(lbs) + (parseInt(oz)/16)) / 2.2;
                    const weightToCheck = parseFloat(totalKg.toFixed(2));

                    // Calcular Talla Lookup (Redondeo a 0.5 hacia arriba: 65.1 -> 65.5, 65.6 -> 66.0)
                    // ceil(val * 2) / 2 hace exactamente eso.
                    // 65.0 * 2 = 130 -> 130 / 2 = 65.0
                    // 65.1 * 2 = 130.2 -> 131 / 2 = 65.5
                    // 65.4 * 2 = 130.8 -> 131 / 2 = 65.5
                    // 65.6 * 2 = 131.2 -> 132 / 2 = 66.0
                    const lookupHeight = Math.ceil(parseFloat(talla) * 2) / 2;

                    // Buscar en tabla
                    const rowData = table.get(lookupHeight);
                    if(!rowData) return false; // Talla fuera de rango

                    // Lógica de Comparación:
                    // Si Peso < LimiteTAB AND Peso >= LimiteDAM -> Es TAB
                    // CORRECCION V37.2: Se cambio > por >= en rowData.dam para incluir el limite inferior exacto.

                    if (weightToCheck < rowData.tab && weightToCheck >= rowData.dam) {
                        return true;
                    }
                    return false;
                };


                const shouldShowGroup = (group, years, months) => {
                    if (group.includes("Influenza")) {
                        if (group.includes("< 1 Año") && months < 6) return false;
                        if (group.includes("1 a < 2") && years < 1) return false;
                        if (group.includes("2 a < 3") && years < 2) return false;
                        return true;
                    }
                    const mY = group.match(/^(\d+)\s+a\s+</);
                    if (mY) return years >= parseInt(mY[1]);
                    const mM = group.match(/^(\d+)\s+Meses/);
                    if (mM) return months >= parseInt(mM[1]);
                    const singleM = group.match(/^(\d+)\s+Meses/);
                    if (singleM) return months >= parseInt(singleM[1]);
                    return true;
                };

                const checkPage = (h, onNewPage = null) => {
                    if (cursorY + h > doc.internal.pageSize.getHeight() - margin - 20) {
                        doc.setFontSize(7); doc.setTextColor(150);
                        doc.text("Fuentes: SIGSA 5a - Generador PDF hecho por Jonatan H. PSJ", pageW/2, doc.internal.pageSize.getHeight() - 20, {align:'center'});
                        doc.addPage();
                        cursorY = margin;
                        if(onNewPage) onNewPage();
                        return true;
                    }
                    return false;
                };

                const drawBadge = (x, y, text, bgColor, textColor, borderColor, fontSize=8) => {
                    doc.setFontSize(fontSize); doc.setFont("helvetica", "bold");
                    const w = doc.getTextWidth(text) + 12;
                    doc.setFillColor(bgColor);
                    doc.setDrawColor(borderColor || bgColor); // Si no hay borde especifico, usa el fondo
                    doc.setLineWidth(0.5); // Borde delgado
                    doc.roundedRect(x, y, w, fontSize + 6, 3, 3, 'FD');
                    doc.setTextColor(textColor);
                    doc.text(text, x + 6, y + fontSize + 1);
                    return w;
                };

                const drawNoRecords = () => {
                    cursorY += 10;
                    doc.setFontSize(14);
                    doc.setTextColor(Palette.TEXT_LABEL);
                    doc.setFont("helvetica", "bold");
                    doc.text("SIN REGISTROS", pageW / 2, cursorY + 15, { align: 'center' });
                    cursorY += 30;
                };

                const isFemale = (data.datos_nino.sexo || "").includes("Femenino");
                const colorMain = isFemale ? Palette.PINK_500 : Palette.BLUE_700;
                const colorLight = isFemale ? Palette.PINK_50 : Palette.BLUE_50;

                // 2. HEADER CON FECHA
                doc.setFillColor(colorMain); doc.rect(margin, cursorY, 4, 55, 'F');
                doc.setDrawColor(colorLight); doc.setFillColor(colorLight);
                doc.circle(margin + 25, cursorY + 25, 15, 'FD');
                doc.setFontSize(12); doc.setTextColor(colorMain); doc.setFont("helvetica", "bold");
                doc.text("CS", margin + 17, cursorY + 29);
                doc.setFontSize(16); doc.setTextColor(Palette.TEXT_PRIMARY);
                doc.text("Reporte de Cuadernillo 5a", margin + 50, cursorY + 15);
                doc.setFontSize(10); doc.setTextColor(Palette.TEXT_SECONDARY); doc.setFont("helvetica", "normal");
                doc.text("Ministerio de Salud Pública y Asistencia Social (MSPAS)", margin + 50, cursorY + 30);

                // === FECHA EMISIÓN EN CABECERA ===
                doc.setFontSize(9); doc.setTextColor("#000000"); doc.setFont("helvetica", "bold");
                doc.text(`Emitido el ${fechaEmision}`, margin + 50, cursorY + 44);
                // =================================

                drawBadge(pageW - margin - 60, cursorY, "SIGSA 5A", colorMain, "#ffffff", colorMain, 10);
                cursorY += 75; // Ajustado por la línea extra de fecha

                // DATOS NIÑO
                const cardH = 220;
                const wChild = (contentW * 0.65) - 10;
                doc.setDrawColor(Palette.BORDER_CARD); doc.setFillColor(Palette.BG_CARD);
                doc.roundedRect(margin, cursorY, wChild, cardH, 5, 5, 'FD');

                doc.setFillColor(colorMain); doc.circle(margin + 20, cursorY + 20, 3, 'F');

                doc.setFontSize(12); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "bold");

                // TITULO DINÁMICO NIÑO/NIÑA
                const titleNino = isFemale ? "Datos de la Niña" : "Datos del Niño";
                doc.text(titleNino, margin + 30, cursorY + 24);

                doc.line(margin+15, cursorY+35, margin+wChild-15, cursorY+35);
                let cy = cursorY + 55;
                doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL); doc.text("NOMBRE", margin+20, cy);
                doc.setFontSize(10); doc.setTextColor(Palette.TEXT_PRIMARY); doc.text(formatName(data.datos_nino.nombre), margin+20, cy+12);

                cy += 35; doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL);
                drawIcon(doc, 'RUP', margin+20, cy-12, 14); doc.text("RUP - SIGSA WEB", margin+38, cy);
                doc.text("ESTADO AL NACER", margin+140, cy);

                // --- ETIQUETA SEXO AGREGADA ---
                doc.text("SEXO", margin + 225, cy);

                doc.setFontSize(9); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "normal"); doc.text(data.datos_nino.rup || "--", margin+20, cy+12);

                const rn = data.monitoreo_crecimiento['0_a_28_dias'];
                let stNac="No indica", bgN=Palette.BORDER_CARD, txN=Palette.TEXT_SECONDARY, bdN=Palette.BORDER_CARD;
                if(rn && rn.Prematuro) { stNac="Prematuro"; bgN=Palette.YELLOW_200; txN=Palette.YELLOW_700; bdN=Palette.YELLOW_700; }
                else if(rn && rn['A Termino']) { stNac="A Termino"; bgN=Palette.ORANGE_50; txN=Palette.ORANGE_600; bdN=Palette.ORANGE_600; }
                else if(rn && rn['N/D']) { stNac="Normal"; bgN=Palette.GREEN_50; txN=Palette.GREEN_600; bdN=Palette.GREEN_600; }
                drawBadge(margin+140, cy+2, stNac, bgN, txN, bdN, 8);

                // BADGE SEXO (Reubicado a la par de Estado al Nacer)
                const sexLabel = data.datos_nino.sexo || "N/A";
                // Aprox margin + 225 para que quede a la derecha de "Prematuro/Termino"
                drawBadge(margin + 225, cy + 2, sexLabel, sexLabel.includes("Masc") ? Palette.BLUE_500 : Palette.PINK_500, "#fff", sexLabel.includes("Masc") ? Palette.BLUE_500 : Palette.PINK_500);

                cy += 30; doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL); doc.text("FECHA NACIMIENTO", margin+20, cy); doc.text("EDAD", margin+140, cy);
                doc.setFontSize(9); doc.setTextColor(Palette.TEXT_PRIMARY); doc.text(data.datos_nino.fecha_nacimiento || "--", margin+20, cy+12); doc.text(`${data.datos_nino.edad_anios}a ${data.datos_nino.edad_meses}m ${data.datos_nino.edad_dias}d`, margin+140, cy+12);
                cy += 30;
                const addrH = 60, addrW = wChild - 30, addrX = margin + 15;
                doc.setFillColor(Palette.BLUE_50); doc.setDrawColor(Palette.BLUE_100); doc.roundedRect(addrX, cy, addrW, addrH, 4, 4, 'FD');
                drawIcon(doc, 'UBICACION', addrX + 5, cy + 2, 8); doc.setFontSize(6); doc.setTextColor(Palette.BLUE_700); doc.setFont("helvetica", "bold"); doc.text("DIRECCIÓN", addrX + 16, cy + 8);
                let rowY = cy + 18; doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL); doc.setFont("helvetica", "bold"); doc.text("Departamento:", addrX + 5, rowY); doc.text("Municipio:", addrX + (addrW/2), rowY);
                doc.setFontSize(8); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "normal"); doc.text(data.datos_nino.departamento || "", addrX + 65, rowY); doc.text(data.datos_nino.municipio || "", addrX + (addrW/2) + 45, rowY);
                rowY += 15; doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL); doc.setFont("helvetica", "bold"); doc.text("Comunidad:", addrX + 5, rowY);
                doc.setFontSize(8); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "normal"); let comClean = (data.datos_nino.comunidad || "").trim(); if(comClean.includes(" - ")) comClean = comClean.split(" - ").pop(); doc.text(comClean.substring(0,45), addrX + 55, rowY);
                rowY += 15; doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL); doc.setFont("helvetica", "bold"); doc.text("Dirección Exacta:", addrX + 5, rowY);
                doc.setFontSize(8); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "normal"); doc.text(doc.splitTextToSize(data.datos_nino.direccion_exacta || "", addrW - 80), addrX + 75, rowY);

                // DATOS RELACIÓN
                const xMom = margin + wChild + 20, wMom = contentW - wChild - 20;
                doc.setDrawColor(Palette.BORDER_CARD); doc.setFillColor(Palette.BG_CARD); doc.roundedRect(xMom, cursorY, wMom, cardH, 5, 5, 'FD');
                doc.setFillColor(colorMain); doc.circle(xMom + 20, cursorY + 20, 3, 'F');
                doc.setFontSize(12); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "bold"); doc.text("Datos de Relacion", xMom + 30, cursorY + 24);
                doc.line(xMom+15, cursorY+35, xMom+wMom-15, cursorY+35);
                cy = cursorY + 55;
                const printParent = (lbl, val, fechaNac) => {
                    if(val) {
                        doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL); doc.text(lbl, xMom+20, cy);
                        doc.setFontSize(9); doc.setTextColor(Palette.TEXT_PRIMARY);
                        const lines = doc.splitTextToSize(val.trim(), wMom - 40);
                        doc.text(lines, xMom+20, cy+12);

                        // RESTAURADO Y MEJORADO: IMPRIMIR FECHA NACIMIENTO + EDAD
                        if(fechaNac) {
                            const ageStr = getAge(fechaNac, rawDateObj);
                            doc.setFontSize(8); doc.setTextColor(Palette.TEXT_SECONDARY);
                            doc.text(`${fechaNac}    ${ageStr}`, xMom+20, cy + 14 + (lines.length * 10));
                        }

                        cy += (25 + lines.length * 10);
                    }
                };
                printParent("MADRE", data.datos_relacion.madre.nombre, data.datos_relacion.madre.fecha_nacimiento);
                printParent("PADRE", data.datos_relacion.padre.nombre, data.datos_relacion.padre.fecha_nacimiento);
                printParent("RESPONSABLE", data.datos_relacion.responsable_nino.nombre, data.datos_relacion.responsable_nino.fecha_nacimiento);
                cursorY += cardH + 40;

                // --- FUNCIONES DE DIBUJO DE CABECERAS PARA REPETICIÓN ---
                const drawMonitoringHeader = () => {
                    drawIcon(doc, 'MONITOREO', margin, cursorY-15, 20);
                    doc.setFontSize(11); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "bold");
                    doc.text("Monitoreo de Crecimiento", margin+25, cursorY);
                    cursorY += 15;
                    const cols = [100, 60, 60, 60, 70, 70, 70];
                    const sCols = cols.map(c => c * (contentW / 490));
                    doc.setFillColor(Palette.GRAY_100); doc.rect(margin, cursorY-10, contentW, 20, 'F');

                    // CORRECCIÓN V28: Texto Negro y Negrita en Encabezados
                    doc.setFontSize(7); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "bold");
                    let cx = margin + 5;
                    ["EDAD", "FECHA", "LIBRAS.OZ", "TALLA", "P/E", "T/E", "P/T"].forEach((h, i) => { doc.text(h, cx, cursorY+2); cx += sCols[i]; });
                    cursorY += 15;
                };

                const drawSectionHeader = (title, iconType) => {
                    drawIcon(doc, iconType, margin, cursorY-15, 20);
                    doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFontSize(11); doc.setFont("helvetica", "bold");
                    doc.text(title, margin+25, cursorY);
                    cursorY += 20;
                };

                // 4. MONITOREO DE CRECIMIENTO
                checkPage(200);
                drawMonitoringHeader();

                let hasGrowth = false;
                Object.keys(data.monitoreo_crecimiento).forEach(k => { if(data.monitoreo_crecimiento[k]?.fecha) hasGrowth = true; });

                if (!hasGrowth) {
                    drawNoRecords();
                } else {
                    const sCols = [100, 60, 60, 60, 70, 70, 70].map(c => c * (contentW / 490));
                    const rowH = 24;
                    let visualRowIndex = 0;

                    // Para calcular edad aproximada en meses para cada fila
                    // Asumimos un orden cronológico aproximado basado en los keys
                    const AGE_MAP = {
                        '0_a_28_dias': 0, '1_mes': 1, '2_meses': 2, '3_meses': 3, '4_meses': 4, '5_meses': 5,
                        '6_meses': 6, '7_meses': 7, '8_meses': 8, '9_meses': 9, '10_meses': 10, '11_meses': 11,
                        '12_meses': 12, '13_meses': 13, '14_meses': 14, '15_meses': 15, '16_meses': 16, '17_meses': 17,
                        '18_meses': 18, '19_meses': 19, '20_meses': 20, '21_meses': 21, '22_meses': 22, '23_meses_29_dias': 23,
                        '2_a_<_3_primer_control': 24, '2_a_<_3_segundo_control': 27, '2_a_<_3_tercer_control': 30, '2_a_<_3_cuarto_control': 33,
                        '3_a_<_4_primer_control': 36, '3_a_<_4_segundo_control': 42,
                        '4_a_<_5_primer_control': 48, '4_a_<_5_segundo_control': 54
                    };

                    Object.keys(data.monitoreo_crecimiento).forEach((k) => {
                        const row = data.monitoreo_crecimiento[k];
                        if(!row || !row.fecha) return;

                        checkPage(rowH + 5, () => drawMonitoringHeader());

                        const isEven = visualRowIndex % 2 === 0;
                        let rowBg = isEven ? "#ffffff" : "#f8fafc";
                        let sideCol = null;
                        const dStr = JSON.stringify(row.diagnostico).toUpperCase();

                        if(dStr.includes("SEVER") || dStr.includes("MUY BAJO") || dStr.includes("RCS") || dStr.includes("DAS")) { rowBg=Palette.RED_50; sideCol=Palette.RED_600; }
                        else if(dStr.includes("MODERA") || dStr.includes("PESO BAJO") || dStr.includes("RCM") || dStr.includes("DAM")) { rowBg=Palette.ORANGE_50; sideCol=Palette.ORANGE_600; }
                        else if(dStr.includes("OBESIDAD")) { rowBg=Palette.DIAG_OBESIDAD.bg; sideCol=Palette.DIAG_OBESIDAD.tx; }
                        else if(dStr.includes("SOBREPESO")) { rowBg=Palette.BLUE_50; sideCol=Palette.BLUE_500; }

                        // Overwrite Background if TAB is detected in P/T later? No, usually generic background is fine unless we want row highlight.
                        // Let's keep row background generic unless requested otherwise.

                        doc.setFillColor(rowBg); doc.rect(margin, cursorY-10, contentW, rowH, 'F');
                        if(sideCol) { doc.setFillColor(sideCol); doc.rect(margin, cursorY-10, 3, rowH, 'F'); }
                        doc.setDrawColor(Palette.LINE_SEPARATOR); doc.setLineWidth(0.5); doc.line(margin, cursorY + 14, margin + contentW, cursorY + 14);

                        // CORRECCIÓN V28: Primera Columna en NEGRITA y Oscura
                        doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFontSize(8); doc.setFont("helvetica", "bold");
                        let cx = margin + 5;
                        doc.text(k.replace(/_/g, ' ').replace(/anios/g, 'Años').replace('control','Control').replace(/(\b[a-z](?!\s))/g, x => x.toUpperCase()).replace(/</g, '< '), cx, cursorY+5); cx += sCols[0];

                        // CORRECCIÓN V28: Datos en Normal y Gris
                        doc.setFont("helvetica", "normal"); doc.setTextColor(Palette.TEXT_SECONDARY);
                        doc.text(row.fecha, cx, cursorY+5); cx += sCols[1];
                        doc.text(formatWeight(row.libras, row.onzas), cx, cursorY+5); cx += sCols[2];
                        doc.text(row.talla || "--", cx, cursorY+5); cx += sCols[3];

                        // CORRECCIÓN LOGICA RCCM CON LLAVES NUEVAS <
                        const isToddler = k.includes("2_a_<_3") || k.includes("3_a_<_4") || k.includes("4_a_<_5");
                        const types = ['peso_edad', 'longitud_edad', 'peso_longitud'];

                        // ESTIMACION DE EDAD PARA LOGICA TAB
                        const approxAge = AGE_MAP[k] !== undefined ? AGE_MAP[k] : 0;

                        types.forEach((type, idx) => {
                            let rawVal = row.diagnostico[type];
                            if(rawVal && rawVal !== "--") {
                                let cSet = Palette.DIAG_NORMAL; let val = "NORMAL"; const du = rawVal.toUpperCase();

                                if(du.includes("NORMAL")) {
                                    cSet = Palette.DIAG_NORMAL;
                                    // --- INYECCION DE LOGICA TAB ---
                                    if (type === 'peso_longitud') {
                                        const isTAB = checkTAB(data.datos_nino.sexo, approxAge, row.talla, row.libras, row.onzas);
                                        if (isTAB) {
                                            cSet = Palette.DIAG_TAB;
                                            val = "TAB";
                                        }
                                    }
                                    // -------------------------------
                                }
                                else if(du.includes("SEVER") || du.includes("MUY BAJO")) { cSet = Palette.DIAG_SEVERO; if(type==='peso_edad') val="PBS"; else if(type==='longitud_edad') val="RCS"; else val="DAS"; }
                                else if(du.includes("MODERA") || du.includes("PESO BAJO")) { cSet = Palette.DIAG_MODERADO; if(type==='peso_edad') val="PBM"; else if(type==='longitud_edad') val="RCM"; else val="DAM"; }
                                else if(du.includes("SOBREPESO")) { cSet = Palette.DIAG_SOBREPESO; val="SOBREPESO"; }
                                else if(du.includes("OBESIDAD")) { cSet = Palette.DIAG_OBESIDAD; val="OBESIDAD"; }

                                if (type === 'longitud_edad' && isToddler) { if (val === "RCM") val = "RCCM"; if (val === "RCS") val = "RCCS"; }

                                drawBadge(cx, cursorY-6, val, cSet.bg, cSet.tx, cSet.bd, 7);
                            }
                            cx += sCols[4+idx];
                        });
                        cursorY += rowH; visualRowIndex++;
                    });
                }

                // 5. VACUNAS
                cursorY += 30; checkPage(100);
                drawSectionHeader("Registro de Vacunación", 'VACUNACION');

                const ea = parseInt(data.datos_nino.edad_anios || 0);
                const em = parseInt(data.datos_nino.edad_total_meses || 0);
                const VACCINE_GROUPS = [
                    { t: "0 Meses", items: [['< 1 Año', 'bcg', '1a', 'Bcg (1a)'], ['< 1 Año', 'hepatitis_b', '1a', 'Hepatitis B (1a)']] },
                    { t: "2 Meses", items: [['< 1 Año', 'ipv1', '1a', 'IPV 1 (1a)'], ['< 1 Año', 'neumococo', '1a', 'Neumococo (1a)'], ['< 1 Año', 'pentavalente', '1a', 'Pentavalente (1a)'], ['< 1 Año', 'rotavirus_2_dosis', '1a', 'Rotavirus 2 Dosis (1a)']] },
                    { t: "4 Meses", items: [['< 1 Año', 'polio', '2a', 'Polio (2a)'], ['< 1 Año', 'neumococo', '2a', 'Neumococo (2a)'], ['< 1 Año', 'pentavalente', '2a', 'Pentavalente (2a)'], ['< 1 Año', 'rotavirus_2_dosis', '2a', 'Rotavirus 2 Dosis (2a)']] },
                    { t: "6 Meses", items: [['< 1 Año', 'polio', '3a', 'Polio (3a)'], ['< 1 Año', 'pentavalente', '3a', 'Pentavalente (3a)']] },
                    { t: "< 1 Año Influenza", items: [['< 1 Año', 'influenza', '1a', 'Influenza (1a)'], ['< 1 Año', 'influenza', '2a', 'Influenza (2a)']] },
                    { t: "12 Meses", items: [['1 a < 2 Años', 'neumococo', 'R1', 'Neumococo (R1)'], ['1 a < 2 Años', 'spr', '1a', 'Spr (1a)']] },
                    { t: "18 Meses", items: [['1 a < 2 Años', 'dpt', 'R1', 'DPT R1'], ['1 a < 2 Años', 'polio', 'R1', 'Polio (R1)'], ['1 a < 2 Años', 'spr', '2a', 'Spr (2a)']] },
                    { t: "1 a < 2 Años Influenza", items: [['1 a < 2 Años', 'influenza', '1a', 'Influenza (1a)'], ['1 a < 2 Años', 'influenza', '2a', 'Influenza (2a)']] },
                    { t: "2 a < 3 Años Influenza", items: [['2 a < 3 Años', 'influenza', '1a', 'Influenza (1a)'], ['2 a < 3 Años', 'influenza', '2a', 'Influenza (2a)']] },
                    { t: "4 a < 7 Años", items: [['4 a < 7 Años', 'dpt', 'R2', 'DPT R2'], ['4 a < 7 Años', 'polio', 'R2', 'Polio (R2)']] }
                ];

                let hasVaccines = false;
                VACCINE_GROUPS.forEach(grp => { if(shouldShowGroup(grp.t, ea, em)) { grp.items.forEach(item => { if(getNested(data.registro_vacunacion, [item[0], item[1], item[2]])?.fecha) hasVaccines = true; }); }});

                if(!hasVaccines) {
                    drawNoRecords();
                } else {
                    VACCINE_GROUPS.forEach(grp => {
                        if(!shouldShowGroup(grp.t, ea, em)) return;

                        checkPage(50, () => drawSectionHeader("Registro de Vacunación", 'VACUNACION'));

                        drawBadge(margin, cursorY, grp.t, Palette.BLUE_50, Palette.BLUE_700, Palette.BLUE_50, 8);
                        cursorY += 25;
                        let col = 0; const colW = (contentW - 20) / 2;
                        grp.items.forEach(item => {
                            const [gKey, vKey, dKey, label] = item;
                            const dose = getNested(data.registro_vacunacion, [gKey, vKey, dKey]);
                            const date = dose ? dose.fecha : "";
                            const bx = margin + (col * (colW + 20));
                            if(date) {
                                doc.setDrawColor(Palette.BORDER_CARD); doc.setFillColor(Palette.BG_CARD); doc.roundedRect(bx, cursorY, colW, 20, 3, 3, 'S');
                                doc.setFontSize(8); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "bold"); doc.text(label, bx+10, cursorY+13);
                                doc.setTextColor(Palette.BLUE_700); doc.setFont("courier", "bold");
                                const dw = doc.getTextWidth(date) + 10; doc.setFillColor(Palette.BG_PAGE); doc.roundedRect(bx + colW - dw - 5, cursorY + 2, dw, 16, 2, 2, 'F'); doc.text(date, bx + colW - dw, cursorY + 13);
                            } else {
                                doc.setDrawColor(Palette.BORDER_CARD); doc.setFillColor(Palette.GRAY_100); doc.roundedRect(bx, cursorY, colW, 20, 3, 3, 'F');
                                doc.setFontSize(8); doc.setTextColor(Palette.TEXT_SECONDARY); doc.setFont("helvetica", "bold"); doc.text(label, bx+10, cursorY+13);
                                doc.setFontSize(7); doc.setTextColor(Palette.TEXT_LABEL); doc.setFont("helvetica", "normal"); doc.text("Sin registro", bx + colW - 60, cursorY+13);
                            }
                            col++; if(col > 1) { col=0; cursorY += 25; }
                        });
                        if(col === 1) cursorY += 25;
                        cursorY += 10;
                    });
                }

                cursorY += 20;

                // 6. SUPLEMENTACIÓN (> 6 MESES)
                if (em >= 6) {
                    checkPage(100);
                    drawSectionHeader("Suplementación", 'SUPLEMENTACION');

                    const SUP_GROUPS = [
                        {t:"6 Meses a < 1 Año", items:[['vitaminas_y_minerales_espolvoreados','1a','VME - Chispitas (Unica)'], ['vitamina_a','1a','Vitamina A (Unica)']]},
                        {t:"1 a < 2 Años", items:[['vitaminas_y_minerales_espolvoreados','1a','VME - Chispitas (1a)'], ['desparasitante','1a','Desparasitante (1a)'], ['vitaminas_y_minerales_espolvoreados','2a','VME - Chispitas (2a)'], ['desparasitante','2a','Desparasitante (2a)']]},
                        {t:"2 a < 3 Años", items:[['vitaminas_y_minerales_espolvoreados','1a','VME - Chispitas (1a)'], ['desparasitante','1a','Desparasitante (1a)'], ['vitaminas_y_minerales_espolvoreados','2a','VME - Chispitas (2a)'], ['desparasitante','2a','Desparasitante (2a)']]},
                        {t:"3 a < 4 Años", items:[['vitaminas_y_minerales_espolvoreados','1a','VME - Chispitas (1a)'], ['desparasitante','1a','Desparasitante (1a)'], ['vitaminas_y_minerales_espolvoreados','2a','VME - Chispitas (2a)'], ['desparasitante','2a','Desparasitante (2a)']]},
                        {t:"4 a < 5 Años", items:[['vitaminas_y_minerales_espolvoreados','1a','VME - Chispitas (1a)'], ['desparasitante','1a','Desparasitante (1a)'], ['vitaminas_y_minerales_espolvoreados','2a','VME - Chispitas (2a)'], ['desparasitante','2a','Desparasitante (2a)']]},
                        {t:"5 a < 6 Años", items:[['desparasitante','1a','Desparasitante (1a)'], ['desparasitante','2a','Desparasitante (2a)']]}
                    ];

                    let hasSupplements = false;
                    SUP_GROUPS.forEach(grp => { if(shouldShowGroup(grp.t, ea, em)) { grp.items.forEach(item => { if(getNested(data.suplementacion_micronutrientes, [grp.t, item[0], item[1]])?.fecha) hasSupplements = true; }); }});

                    if(!hasSupplements) {
                        drawNoRecords();
                    } else {
                        SUP_GROUPS.forEach(grp => {
                            if(!shouldShowGroup(grp.t, ea, em)) return;

                            checkPage(50, () => drawSectionHeader("Suplementación", 'SUPLEMENTACION'));

                            drawBadge(margin, cursorY, grp.t, Palette.ORANGE_50, Palette.ORANGE_600, Palette.ORANGE_50, 8);
                            cursorY += 25;
                            let col = 0; const colW = (contentW - 20) / 2;
                            grp.items.forEach(item => {
                                const [k, d, l] = item;
                                const dose = getNested(data.suplementacion_micronutrientes, [grp.t, k, d]);
                                const date = dose ? dose.fecha : "";
                                const bx = margin + (col * (colW + 20));
                                if(date) {
                                    doc.setDrawColor(Palette.ORANGE_100); doc.setFillColor(Palette.ORANGE_50); doc.roundedRect(bx, cursorY, colW, 20, 3, 3, 'FD');
                                    doc.setFontSize(8); doc.setTextColor(Palette.TEXT_PRIMARY); doc.setFont("helvetica", "bold"); doc.text(l, bx+10, cursorY+13);
                                    doc.setTextColor(Palette.ORANGE_600); doc.setFont("courier", "bold"); doc.text(date, bx+colW-70, cursorY+13);
                                } else {
                                    doc.setDrawColor(Palette.BORDER_CARD); doc.setFillColor(Palette.GRAY_100); doc.roundedRect(bx, cursorY, colW, 20, 3, 3, 'FD');
                                    doc.setFontSize(8); doc.setTextColor(Palette.TEXT_LABEL); doc.setFont("helvetica", "bold"); doc.text(l, bx+10, cursorY+13);
                                    doc.setFont("helvetica", "normal"); doc.text("Sin registro", bx+colW-60, cursorY+13);
                                }
                                col++; if(col > 1) { col=0; cursorY += 25; }
                            });
                            if(col === 1) cursorY += 25;
                            cursorY += 10;
                        });
                    }
                }

                // 7. ALIMENTO COMPLEMENTARIO (> 6 MESES)
                if (em >= 6) {
                    const ALIM_KEYS = ["6_meses", "7_meses", "8_meses", "9_meses", "10_meses", "11_meses", "12_meses", "13_meses", "14_meses", "15_meses", "16_meses", "17_meses", "18_meses", "19_meses", "20_meses", "21_meses", "22_meses", "23_meses_29_dias"];
                    let alimList = []; let alimCount = 1;
                    ALIM_KEYS.forEach(key => {
                        const control = data.monitoreo_crecimiento[key];
                        if (control && control.entrega_alimento_complementario === true && control.fecha) {
                            const lblName = key.replace(/_/g, ' ').replace('29_dias', '').replace(/\b\w/g, l => l.toUpperCase());
                            const label = `${lblName} (${alimCount}a)`;
                            alimList.push({ label: label, date: control.fecha });
                            alimCount++;
                        }
                    });

                    cursorY += 30; checkPage(100);
                    drawSectionHeader("Alimento Complementario", 'ALIMENTACION');

                    checkPage(40, () => drawSectionHeader("Alimento Complementario", 'ALIMENTACION'));
                    drawBadge(margin, cursorY, "Entregas (6m a < 2a)", Palette.PURPLE_100, Palette.PURPLE_600, Palette.PURPLE_100, 8);
                    cursorY += 25;

                    if (alimList.length > 0) {
                        const colW = contentW;
                        alimList.forEach(item => {
                            checkPage(30, () => drawSectionHeader("Alimento Complementario", 'ALIMENTACION'));
                            doc.setDrawColor(Palette.PURPLE_100); doc.setFillColor(Palette.PURPLE_50); doc.roundedRect(margin, cursorY, colW, 20, 3, 3, 'FD');
                            doc.setFontSize(8); doc.setTextColor(Palette.TEXT_SECONDARY); doc.setFont("helvetica", "normal"); doc.text(item.label, margin + 10, cursorY + 13);
                            doc.setTextColor(Palette.PURPLE_600); doc.setFont("courier", "bold"); doc.text(item.date, margin + colW - 70, cursorY + 13);
                            cursorY += 25;
                        });
                    } else {
                        drawNoRecords();
                    }
                }

                const finalName = formatName(data.datos_nino.nombre || "NINO");
                const safeName = finalName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
                const filename = `Reporte_${safeName}.pdf`;

                // ==========================================
                // LÓGICA DE SALIDA (PREVIEW VS DOWNLOAD)
                // ==========================================
                if (mode === 'preview') {
                    const blob = doc.output('blob');
                    const blobUrl = URL.createObjectURL(blob);

                    // MODIFICACIÓN V36: Ventana maximizada (usando dimensiones de pantalla)
                    const win = window.open('', '_blank', `width=${screen.availWidth},height=${screen.availHeight},top=0,left=0,scrollbars=yes,resizable=yes`);

                    if (!win) {
                        alert("⚠️ Por favor permite las ventanas emergentes para ver la previsualización.");
                        return;
                    }

                    // Escribir HTML en la ventana emergente
                    // MODIFICACIÓN V36: Agregado #zoom=100 en el iframe src
                    win.document.write(`
                        <html>
                            <head>
                                <title>Previsualización - ${finalName}</title>
                                <style>
                                    body { margin: 0; display: flex; flex-direction: column; height: 100vh; background: #525659; font-family: 'Segoe UI', Arial, sans-serif; }
                                    .toolbar { background: #323639; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 10; }
                                    .title { font-weight: bold; font-size: 14px; }
                                    .actions { display: flex; gap: 10px; }
                                    .btn { padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 13px; cursor: pointer; border: none; transition: background 0.2s; display: inline-flex; align-items: center; gap: 5px; }
                                    .btn-download { background: #16a34a; color: white; }
                                    .btn-download:hover { background: #15803d; }
                                    .btn-close { background: #dc2626; color: white; }
                                    .btn-close:hover { background: #b91c1c; }
                                    iframe { flex: 1; border: none; background: white; width: 100%; height: 100%; display: block; }
                                </style>
                            </head>
                            <body>
                                <div class="toolbar">
                                    <span class="title">📄 Vista Previa: ${finalName}</span>
                                    <div class="actions">
                                        <a href="${blobUrl}" download="${filename}" class="btn btn-download">⬇️ Descargar PDF</a>
                                        <button onclick="window.close()" class="btn btn-close">✖️ Cerrar</button>
                                    </div>
                                </div>
                                <iframe src="${blobUrl}#zoom=100" type="application/pdf"></iframe>
                            </body>
                        </html>
                    `);
                    win.document.close();

                    // LIMPIEZA DE MEMORIA AUTOMÁTICA
                    // Revisa cada segundo si la ventana se cerró. Si se cerró, revoca el Blob URL.
                    const timer = setInterval(() => {
                        if (win.closed) {
                            clearInterval(timer);
                            URL.revokeObjectURL(blobUrl);
                            console.log("🧹 Memoria liberada (Blob eliminado).");
                        }
                    }, 1000);

                } else {
                    // Modo original (Descarga Directa)
                    doc.save(filename);
                }

            } catch(e) {
                alert("Error: " + e.message);
                console.error(e);
            }
        };

        const injectButton = () => {
            if (!document.getElementById('btnPDFv14')) {
                const btn = document.createElement('button');
                btn.id = 'btnPDFv14';
                btn.innerHTML = "📄 PDF";
                btn.style = `position: fixed; top: 155px; left: 20px; background: #dc2626; color: white; border: 2px solid white; border-radius: 8px; padding: 8px 12px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.5); cursor: pointer; z-index: 2147483647; font-family: Arial; font-size: 13px;`;
                btn.onclick = () => generatePDF('download'); // Llamada explicita modo download
                document.body.appendChild(btn);
            }

            // SEGUNDO BOTÓN: PREVISUALIZAR
            if (!document.getElementById('btnPreviewV35')) {
                const btnPreview = document.createElement('button');
                btnPreview.id = 'btnPreviewV35';
                btnPreview.innerHTML = "👁️ Ver";
                // Posicionado debajo del botón PDF (top 155 + unos 45px = 200px)
                btnPreview.style = `position: fixed; top: 200px; left: 20px; background: #0ea5e9; color: white; border: 2px solid white; border-radius: 8px; padding: 8px 12px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.5); cursor: pointer; z-index: 2147483647; font-family: Arial; font-size: 13px;`;
                btnPreview.onclick = () => generatePDF('preview'); // Llamada explicita modo preview
                document.body.appendChild(btnPreview);
            }
        };

        injectButton();
        setInterval(injectButton, 1500);
        if (typeof Sys !== 'undefined' && Sys.WebForms) Sys.WebForms.PageRequestManager.getInstance().add_endRequest(() => setTimeout(injectButton, 500));
    }

    String.prototype.title = function() { return this.charAt(0).toUpperCase() + this.slice(1); };
})();