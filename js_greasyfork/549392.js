// ==UserScript==
// @name         Perplexity Playground Reimagined
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Restores the appearance of Perplexity Labs Playground on perplexity.ai, including precise layout, colors, and button placements.
// @author       YouTubeDrawaria
// @match        https://www.perplexity.ai/*
// @icon         https://web.archive.org/web/20250804233216im_/https://playground.perplexity.ai/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549392/Perplexity%20Playground%20Reimagined.user.js
// @updateURL https://update.greasyfork.org/scripts/549392/Perplexity%20Playground%20Reimagined.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define color variables para emular el tema oscuro del Playground
    GM_addStyle(`
        :root {
            /* Mimic Playground dark mode colors more closely */
            --playground-background-base: #1f1f1d; /* html background-color */
            --playground-background-offset: #2D2D2D; /* input background, chat bubble background */
            --playground-border-color: rgba(255, 255, 255, 0.1); /* common border color */
            --playground-text-foreground: #E0E0E0; /* main text color */
            --playground-text-off: #999; /* quieter text, placeholder */
            --playground-super-blue: #0A84FF; /* send button color */
            --playground-button-bg: #333; /* model selector button background */
            --playground-button-border: #555; /* model selector button border */
            --playground-scrollbar-thumb: #3D3D3B; /* for scrollbars in dark mode */
            --playground-disabled-button-bg: #666; /* disabled button background */
            --playground-disabled-button-text: #999; /* disabled button text/icon */
            --playground-header-button-bg: #2D2D2D; /* Background for sonar/try perplexity buttons */
            --playground-header-button-border: rgba(255, 255, 255, 0.15); /* Border for sonar/try perplexity buttons */
        }

        /* Fondo global para el tema oscuro */
        html.dark, body.dark, .dark main {
            background-color: var(--playground-background-base) !important;
        }
        .md\\:bg-underlay,
        .bg-base { /* Fondo principal de la aplicación */
            background-color: var(--playground-background-base) !important;
        }
        /* Asegura que componentes específicos también usen el fondo base si aparecen fuera del contenido central */
        .border-subtlest.ring-subtlest.divide-subtlest.bg-offset {
            background-color: var(--playground-background-base) !important;
        }

        /* Oculta completamente la barra lateral izquierda */
        .group\\/sidebar {
            display: none !important;
        }

        /* Ajusta el contenedor principal para que ocupe todo el ancho y centre el contenido */
        .isolate.flex.h-dvh {
            width: 100% !important;
            max-width: none !important;
        }
        .erp-tab\\:p-0.md\\:gap-xs.erp-tab\\:gap-0.lg\\:py-sm.lg\\:pe-sm.isolate.flex.h-auto.max-h-screen.min-w-0.grow.flex-col {
            width: 100% !important;
            max-width: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        /* Ajusta el contenedor de contenido desplazable para que esté centrado y sea ancho */
        .mx-auto.size-full.max-w-screen-md.px-md.md\\:px-lg,
        .erp-sidecar\\:px-md.sm\\:px-md.md\\:px-lg.isolate.mx-auto.size-full.sm\\:max-w-screen-md {
            max-width: 960px !important; /* Más ancho que el predeterminado, similar al contenido principal del Playground */
            margin-left: auto !important;
            margin-right: auto !important;
            padding-left: 16px !important; /* Añade algo de relleno */
            padding-right: 16px !important; /* Añade algo de relleno */
        }

        /* Reutiliza y estiliza el encabezado móvil como el encabezado principal del Playground */
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden {
            display: flex !important; /* Siempre visible */
            position: sticky !important;
            top: 0 !important;
            z-index: 20 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 12px 24px !important; /* Coincide con el relleno del Playground */
            border-bottom: 1px solid var(--playground-border-color) !important;
            background-color: var(--playground-background-base) !important; /* Asegura un fondo consistente */
        }
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden > div:first-child { /* Lado izquierdo (logo y texto) */
            margin-left: 0 !important;
        }
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden .gap-x-sm.flex.items-center { /* Lado derecho (botones) */
            margin-right: 0 !important;
            margin-left: auto !important; /* Empuja a la derecha */
            gap: 8px !important; /* Espacio entre los botones del header */
        }
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden .font-sans.text-base.text-foreground {
            color: var(--playground-text-foreground) !important;
            font-size: 14px !important; /* Tamaño de fuente para el texto "Perplexity Playground" */
        }
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden .tabler-icon {
            color: var(--playground-text-foreground) !important;
        }

        /* Estilo para los botones "sonar" y "Try Perplexity" en el encabezado */
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden .gap-sm.flex.items-center a[role="button"] {
            background-color: var(--playground-header-button-bg) !important;
            border: 1px solid var(--playground-header-button-border) !important;
            border-radius: 8px !important;
            height: 32px !important; /* Coincide con la captura */
            padding: 0 12px !important; /* Relleno lateral */
            font-size: 14px !important;
            color: var(--playground-text-foreground) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important; /* Espacio entre icono y texto */
        }
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden .gap-sm.flex.items-center a[role="button"] svg {
            color: var(--playground-text-foreground) !important;
            width: 16px !important;
            height: 16px !important;
        }
        /* Estilo específico para el botón "Try Perplexity" (azul) */
        .py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden .gap-sm.flex.items-center a[href="https://www.perplexity.ai/"] {
            background-color: var(--playground-super-blue) !important;
            color: white !important;
            border-color: var(--playground-super-blue) !important; /* Asegura un borde azul */
        }

        /* Oculta el encabezado de escritorio predeterminado (el gran logo y texto en el centro) */
        .mb-lg.bottom-0.flex.w-full.items-center.justify-center.pb-3.text-center.md\\:absolute {
            display: none !important;
        }

        /* Relleno del área principal de contenido del chat */
        .scrollable-container.scrollbar-subtle.flex.flex-1.basis-0.overflow-auto {
            padding-top: 20px !important; /* Añade espacio en la parte superior del contenido desplazable */
            padding-bottom: 20px !important; /* Añade espacio en la parte inferior */
            flex-direction: column !important; /* Apila los elementos normalmente */
            justify-content: flex-start !important; /* Comienza desde la parte superior */
        }

        /* Estilo específico para la burbuja del mensaje de chat inicial */
        #playground-initial-message {
            background-color: transparent !important;
            border: none !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            width: 100%; /* Asegura que ocupe todo el ancho del área de contenido */
            box-sizing: border-box;
            padding: 16px !important; /* Coincide con el relleno del contenido */
        }
        #playground-initial-message .max-w-full.text-right {
             max-width: fit-content !important; /* Se ajusta al contenido */
             text-align: left !important; /* Alinea el texto a la izquierda */
             margin-left: 0 !important; /* Elimina cualquier margen automático que lo empuje a la derecha */
        }
        #playground-initial-message .px-md.py-sm.max-w-full {
             background-color: var(--playground-background-offset) !important; /* Coincide con el fondo de la entrada */
             border: 1px solid var(--playground-border-color) !important;
             color: var(--playground-text-foreground) !important;
             border-radius: 8px !important; /* Esquinas redondeadas para la burbuja */
             box-shadow: none !important;
             max-width: fit-content !important;
             padding: 10px 16px !important; /* Relleno interno ajustado para la burbuja */
        }
        #playground-initial-message .font-sans.text-base.font-medium.text-textOff {
            color: var(--playground-text-off) !important; /* Texto más tenue para el mensaje "served by" */
        }
        #playground-initial-message .prose p {
            color: var(--playground-text-foreground) !important; /* Asegura que el texto del mensaje principal sea claro */
            margin-top: 4px !important; /* Pequeño margen para el texto debajo de la información del modelo */
            margin-bottom: 0 !important;
        }
        #playground-initial-message button { /* Botón de Copiar para el mensaje inicial */
            display: inline-flex !important; /* Hace visible el botón de copiar */
            background-color: transparent !important;
            border: none !important;
            color: var(--playground-text-off) !important;
            box-shadow: none !important;
            padding: 4px 8px !important;
            font-size: 14px !important;
            border-radius: 6px !important;
            margin-left: 0 !important; /* Ajusta la posición si es necesario */
            margin-top: 4px !important; /* Espacio debajo de la burbuja */
        }
        #playground-initial-message button:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: var(--playground-text-foreground) !important;
        }
        #playground-initial-message button svg {
            color: var(--playground-text-off) !important;
        }
        #playground-initial-message button:hover svg {
            color: var(--playground-text-foreground) !important;
        }

        /* Ajustes para el área de contenido principal */
        .flex.h-full.grow > div.grow { /* Contenedor alrededor del área de contenido principal */
            width: 100%;
        }
        .md\\:px-md.mx-auto.flex.h-full.w-full.max-w-screen-lg.grow.flex-col {
            max-width: 100% !important; /* Permite que el ancho máximo interno lo controle */
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        /* Contenedor del footer para la caja de entrada */
        .sticky.bottom-0.z-20.border-t {
            background-color: var(--playground-background-base) !important; /* Coincide con el fondo general */
            border-top: 1px solid var(--playground-border-color) !important;
            padding: 16px !important; /* Relleno consistente para el área del footer */
            box-shadow: none !important;
        }
        /* Oculta los elementos debajo de la entrada que muestran "0.00 sec" y el selector de modelo original */
        .md\\:px-md.mx-auto.max-w-screen-lg > .gap-md.p-md.flex.flex-col.justify-between {
            display: none !important; /* Oculta la antigua sección del temporizador/modelo */
        }


        /* Estilos para toda la barra de entrada */
        .bg-raised.w-full.outline-none.flex.items-center.border.rounded-2xl.dark\\:bg-offset {
            background-color: var(--playground-background-offset) !important;
            border-color: var(--playground-border-color) !important;
            border-width: 1px !important;
            border-style: solid !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            padding: 8px !important; /* Relleno para toda la barra de entrada combinada */
            max-width: 960px !important; /* Coincide con el ancho del contenido */
            margin-left: auto !important;
            margin-right: auto !important;
            display: flex !important; /* Lo convierte en un contenedor flex */
            align-items: center !important; /* Alinea los elementos verticalmente */
            gap: 8px !important; /* Espacio entre los elementos */
        }

        /* Elimina el relleno interno del antiguo contenedor de la cuadrícula */
        .bg-raised.w-full.outline-none.flex.items-center.border.rounded-2xl.dark\\:bg-offset > .px-3\\.5.grid-rows-1fr-auto.grid.grid-cols-3 {
            padding: 0 !important;
            display: contents !important; /* Hace que sus hijos sean hijos directos del contenedor flex padre */
        }

        /* Estilo del Textarea */
        #ask-input {
            flex-grow: 1 !important; /* Permite que ocupe el espacio disponible */
            min-height: 40px !important; /* Altura mínima para la entrada */
            height: auto !important; /* Permite altura dinámica */
            background-color: transparent !important;
            color: var(--playground-text-foreground) !important;
            font-size: 16px !important;
            line-height: 24px !important;
            padding: 0 !important;
            font-family: 'FKGroteskNeue', sans-serif !important; /* Asegura que la fuente coincida */
            font-weight: 400 !important;
            resize: none !important; /* Evita que el usuario cambie el tamaño */
            margin-left: 0 !important; /* Eliminar margen si lo tiene */
            margin-right: 0 !important; /* Eliminar margen si lo tiene */
        }
        #ask-input + div > div { /* Placeholder */
            color: var(--playground-text-off) !important;
            /* El texto "Ask anything..." debe estar centrado verticalmente con la altura de la caja */
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            width: 100%;
            text-align: left; /* Alineación del placeholder */
            padding-left: 0 !important;
        }
        /* Elimina los botones del textarea (adjuntar, dictado, etc.) */
        div.gap-sm.flex.col-start-1.row-start-2, /* Mode radio buttons, already hidden but ensure no visual remains */
        div.flex.items-center.justify-self-end.col-start-3.row-start-2 > div:not(:has(button[aria-label="Submit"])) { /* All input controls except the submit button */
             display: none !important;
        }

        /* Botón de limpiar chat */
        #playground-clear-chat-button {
            background-color: transparent !important;
            border: none !important;
            color: var(--playground-text-off) !important; /* Color del icono */
            padding: 0 !important; /* Sin relleno extra */
            height: 32px !important;
            width: 32px !important;
            aspect-ratio: 1 / 1 !important;
            flex-shrink: 0 !important; /* Evita que se encoja */
            display: inline-flex !important; /* Asegura que se muestre */
            align-items: center !important;
            justify-content: center !important;
            order: -1; /* Lo coloca a la izquierda */
        }
        #playground-clear-chat-button:hover {
            background-color: rgba(255, 255, 255, 0.05) !important; /* Efecto hover */
            color: var(--playground-text-foreground) !important;
        }
        #playground-clear-chat-button svg {
            color: var(--playground-text-off) !important;
        }
        #playground-clear-chat-button:hover svg {
            color: var(--playground-text-foreground) !important;
        }

        /* Contenedor para el icono de velocidad, texto de tiempo y selector de modelo */
        #playground-right-controls-wrapper {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important; /* Espacio entre los elementos */
            flex-shrink: 0 !important;
            margin-left: auto !important; /* Empuja este grupo a la derecha */
            padding-left: 8px !important; /* Un poco de padding a la izquierda del grupo */
            border-left: 1px solid var(--playground-border-color) !important; /* Línea divisoria */
        }

        /* Estilo para el icono de velocidad (gauge-max) */
        #playground-right-controls-wrapper .fa-gauge-max {
            color: var(--playground-super-blue) !important; /* El icono azul de la captura */
            font-size: 16px !important;
        }


        /* Estilo para la visualización del temporizador */
        .playground-timer-display {
            display: flex !important;
            align-items: baseline !important; /* Alinea el texto "0.00" y "sec" */
            gap: 2px !important;
            flex-shrink: 0 !important;
            font-family: 'BerkeleyMono-Regular', monospace !important; /* Usa fuente monoespaciada */
            font-size: 11px !important; /* Tamaño de fuente más pequeño */
            line-height: 1rem !important; /* Coincide con la altura de línea */
            color: var(--playground-text-foreground) !important;
            padding-right: 8px; /* Espacio antes del selector de modelo */
            border-right: 1px solid var(--playground-border-color) !important; /* Línea divisoria */
        }
        .playground-timer-display .inline.text-2xs.md\\:text-xs.tracking-wide.font-mono.leading-none.uppercase.text-foreground {
            color: var(--playground-text-foreground) !important;
            font-size: inherit !important;
            line-height: inherit !important;
        }
        .playground-timer-display .inline.text-2xs.md\\:text-xs.tracking-wide.font-mono.leading-none.uppercase.text-textOff {
            color: var(--playground-text-off) !important;
            font-size: inherit !important;
            line-height: inherit !important;
            text-transform: uppercase !important; /* Asegura mayúsculas */
        }

        /* Estilo del selector de modelo y su flecha personalizada */
        #lamma-select-wrapper {
            background-color: var(--playground-background-offset) !important; /* Fondo dentro del contenedor flex */
            border: 1px solid var(--playground-border-color) !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
            height: 32px !important;
            padding: 0 8px !important; /* Relleno visual alrededor del select */
            position: relative !important;
        }
        #lamma-select {
            background-color: transparent !important;
            border: none !important;
            color: var(--playground-text-foreground) !important;
            font-size: 14px !important;
            line-height: 1.2 !important; /* Ajusta line-height para que quepa bien */
            padding: 0 !important;
            appearance: none !important; /* Elimina la flecha desplegable nativa */
            cursor: pointer !important;
            min-width: 80px !important;
            max-width: 120px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            flex-grow: 1 !important; /* Permite que el select crezca dentro de su wrapper */
            margin-right: 4px !important; /* Espacio para la flecha personalizada */
        }
        /* Flecha personalizada para el select (este es el div que contiene el SVG) */
        #lamma-select + div {
            display: block !important;
            position: absolute !important;
            right: 8px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            pointer-events: none !important;
            color: var(--playground-text-off) !important;
            width: 16px !important; /* Tamaño del icono de la flecha */
            height: 16px !important;
        }
        #lamma-select + div svg {
            color: var(--playground-text-off) !important;
        }


        /* Estilo del botón de enviar (icono de flecha arriba) */
        button[aria-label="Submit"] {
            display: flex !important;
            background-color: var(--playground-super-blue) !important;
            color: white !important;
            border-radius: 8px !important;
            height: 32px !important;
            width: 32px !important;
            padding: 0 !important;
            aspect-ratio: 1 / 1 !important;
            flex-shrink: 0 !important;
            align-items: center !important;
            justify-content: center !important;
        }
        button[aria-label="Submit"] svg {
            color: white !important;
            width: 16px !important; /* Tamaño del icono */
            height: 16px !important;
        }
        button[aria-label="Submit"][disabled] {
            background-color: var(--playground-disabled-button-bg) !important;
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }
        button[aria-label="Submit"][disabled] svg {
            color: var(--playground-disabled-button-text) !important;
        }

        /* Oculta los botones flotantes de la esquina inferior derecha (idioma, ayuda) */
        .bottom-md.right-md.m-sm.fixed.hidden.md\\:block {
            display: none !important;
        }

        /* Ajustes para los selectores de fuentes del Playground */
        @font-face{font-family:'FKGroteskNeue';src:url('https://web.archive.org/web/20250804233215im_/https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2') format('woff2');font-display:swap;}
        @font-face{font-family:'FKGrotesk';src:url('https://web.archive.org/web/20250804233215im_/https://r2cdn.perplexity.ai/fonts/FKGrotesk.woff2') format('woff2');font-display:swap;}
        @font-face{font-family:'BerkeleyMono-Regular';src:url('https://web.archive.org/web/20250804233215im_/https://r2cdn.perplexity.ai/fonts/BerkeleyMono-Regular.woff2') format('woff2');font-display:swap;}

        html, :host {
            font-family: 'FKGroteskNeue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica Neue, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
        }
        code, kbd, pre, samp, .font-mono {
            font-family: 'BerkeleyMono-Regular', ui-monospace, SFMono-Regular, monospace !important;
        }
        .font-display {
            font-family: 'FKGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica Neue, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
        }

        /* Oculta el botón del menú lateral */
        button:has(svg.tabler-icon-menu-2) {
            display: none !important;
        }

    `);

    // Cambiar favicon
    function changeFavicon(src) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = src;
    }
    changeFavicon("https://web.archive.org/web/20250804233216im_/https://playground.perplexity.ai/favicon.ico");

    function applyPlaygroundLayout() {
        const root = document.getElementById('root');
        if (!root) {
            console.warn("Perplexity root element not found.");
            return;
        }

        // --- Manipulación del Encabezado ---
        const mobileHeader = document.querySelector('.py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden');
        if (mobileHeader) {
            mobileHeader.remove();
            root.prepend(mobileHeader);

            const logoSvgContainer = mobileHeader.querySelector('.h-auto.group.w-24');
            if (logoSvgContainer) {
                 logoSvgContainer.classList.remove('w-24');
                 logoSvgContainer.classList.add('w-12');
            }
            const logoSvg = mobileHeader.querySelector('.h-auto.group.w-12 > svg');
            if (logoSvg) {
                const pplxPlaygroundSvgPath = `M59.4967 39.8367C30.9654 39.8367 7.83624 62.9671 7.83624 91.5C7.83624 120.033 30.9654 143.163 59.4967 143.163C83.9985 143.163 104.516 126.105 109.823 103.216H117.84C112.399 130.466 88.3457 151 59.4967 151C26.6376 151 0 124.361 0 91.5C0 58.639 26.6376 32 59.4967 32C91.0393 32 116.849 56.5473 118.866 87.5817H155.879L123.292 54.9276L128.838 49.3918L161.428 82.0483L161.387 35.9218L169.223 35.9149L169.264 82.0641L201.87 49.3918L207.416 54.9276L174.829 87.5817H221V95.4183H174.771L207.416 128.131L201.87 133.667L169.281 101.011L169.321 147.157L161.485 147.163L161.444 100.993L128.838 133.667L123.292 128.131L155.937 95.4183H129.748V95.3791H84.6892V95.4183H59.495V87.5817H111.011C109.008 60.8792 86.7098 39.8367 59.4967 39.8367Z`;
                const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                newSvg.setAttribute('viewBox', '0 0 300 187');
                newSvg.setAttribute('fill', 'none');
                newSvg.innerHTML = `<path d="${pplxPlaygroundSvgPath}" class="block fill-foreground"></path>`;
                logoSvgContainer.innerHTML = '';
                logoSvgContainer.appendChild(newSvg);
            }

            const textDiv = document.createElement('div');
            textDiv.className = 'font-sans text-base text-foreground selection:bg-super/50 selection:text-foreground dark:selection:bg-super/10 dark:selection:text-super';
            textDiv.innerHTML = '<span class="hidden font-mono text-[14px] font-bold uppercase tracking-widest md:inline">Perplexity Playground</span>';

            const logoContainer = mobileHeader.querySelector('.h-auto.group.w-12');
            if (logoContainer && logoContainer.parentElement) {
                logoContainer.parentElement.style.display = 'flex';
                logoContainer.parentElement.style.alignItems = 'center';
                logoContainer.parentElement.insertBefore(textDiv, logoContainer.nextSibling);
            }

            let titleElement = mobileHeader.querySelector('.font-sans.text-base.text-foreground');
            if (titleElement) {
                titleElement.innerHTML = '';
                const perplexitySpan = document.createElement('span');
                perplexitySpan.classList.add('font-bold');
                perplexitySpan.textContent = 'Perplexity';
                titleElement.appendChild(perplexitySpan);

                const playgroundSpan = document.createElement('span');
                playgroundSpan.classList.add('font-normal');
                playgroundSpan.textContent = ' Playground';
                titleElement.appendChild(playgroundSpan);
            }

            const existingButtonsContainer = mobileHeader.querySelector('.gap-x-sm.flex.items-center');
            if (existingButtonsContainer) {
                existingButtonsContainer.innerHTML = '';

                const sonarButton = document.createElement('a');
                sonarButton.setAttribute('role', 'button');
                sonarButton.setAttribute('target', '_blank');
                sonarButton.setAttribute('href', 'https://www.perplexity.ai/sonar');
                sonarButton.className = 'bg-offsetPlus text-foreground md:hover:text-textOff font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out font-sans select-none items-center relative group/button justify-center text-center items-center rounded-lg cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 pl-2.5 pr-3';
                sonarButton.innerHTML = `<div class="flex items-center min-w-0 font-medium gap-1.5 justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-external-link "><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path><path d="M11 13l9 -9"></path><path d="M15 4h5v5"></path></svg></div><div class="text-align-center relative truncate leading-loose -mb-px">sonar</div></div>`;
                existingButtonsContainer.appendChild(sonarButton);

                const tryPerplexityButton = document.createElement('a');
                tryPerplexityButton.setAttribute('role', 'button');
                tryPerplexityButton.setAttribute('href', 'https://www.perplexity.ai/');
                tryPerplexityButton.className = 'bg-super text-inverse hover:opacity-80 font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out font-sans select-none items-center relative group/button justify-center text-center items-center rounded-lg cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 pl-3 pr-3';
                tryPerplexityButton.innerHTML = `<div class="flex items-center min-w-0 font-medium gap-1.5 justify-center"><div class="text-align-center relative truncate leading-loose -mb-px">Try Perplexity</div></div>`;
                existingButtonsContainer.appendChild(tryPerplexityButton);
            }
        }

        // --- Burbuja de mensaje inicial ---
        const chatContentArea = document.querySelector('.mx-auto.size-full.max-w-screen-md.px-md.md\\:px-lg');
        if (chatContentArea && !document.getElementById('playground-initial-message')) {
            const initialMessageHtml = `
                <div id="playground-initial-message">
                    <div class="px-md py-sm max-w-full break-words rounded-lg border text-left shadow-sm [word-break:break-word] border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-offset">
                        <div class="font-sans text-base font-medium text-textOff selection:bg-super/50 selection:text-foreground dark:selection:bg-super/10 dark:selection:text-super">LLM served by Perplexity Playground</div>
                        <div class="font-sans text-base text-foreground selection:bg-super/50 selection:text-foreground dark:selection:bg-super/10 dark:selection:text-super">
                            <div class="relative"><div class="prose text-pretty dark:prose-invert inline leading-normal break-words min-w-0 [word-break:break-word]"><p class="my-0">Hello! How can I help you?</p></div></div>
                        </div>
                    </div>
                    <div class="ml-sm mt-xs gap-x-xs flex max-w-full items-start">
                        <button type="button" class="focus-visible:bg-offsetPlus hover:bg-offsetPlus text-textOff hover:text-foreground dark:hover:bg-offsetPlus font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out font-sans select-none items-center relative group/button justify-center text-center items-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 pl-2.5 pr-3" data-state="closed">
                            <div class="flex items-center min-w-0 font-medium gap-1.5 justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-copy "><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"></path><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"></path></svg></div><div class="text-align-center relative truncate leading-loose -mb-px">Copy</div></div>
                        </button>
                    </div>
                </div>
            `;
            const scrollArea = chatContentArea.querySelector('.scrollable-container');
            if(scrollArea) {
                scrollArea.insertAdjacentHTML('afterbegin', initialMessageHtml);
            } else {
                 chatContentArea.insertAdjacentHTML('afterbegin', initialMessageHtml);
            }
        }


        // --- Reconstrucción de la barra de entrada y el footer ---

        const mainInputWrapper = document.querySelector('.sticky.bottom-0.z-20.border-t');
        const mainInputBar = document.getElementById('ask-input').closest('.bg-raised.w-full.outline-none.flex.items-center.border.rounded-2xl');

        if (!mainInputWrapper || !mainInputBar) {
            console.error("No se pudieron encontrar elementos esenciales para la reconstrucción de la barra de entrada.");
            return;
        }

        // --- Extracción de elementos ---
        const oldFooterInfoContainer = document.querySelector('.md\\:px-md.mx-auto.max-w-screen-lg > .gap-md.p-md.flex.flex-col.justify-between > .gap-x-md.gap-y-sm.flex.flex-wrap');
        let timerDisplayElement, modelSelectorDivElement, modelSelectElement, modelSelectArrowElement, speedIconElement;

        if (oldFooterInfoContainer) {
            speedIconElement = oldFooterInfoContainer.querySelector('svg.fa-gauge-max');
            if (speedIconElement) {
                // Clonar el icono para usarlo en la nueva ubicación
                speedIconElement = speedIconElement.closest('div').cloneNode(true);
                speedIconElement.classList.remove('font-sans', 'text-base', 'text-super'); // Limpiar clases innecesarias
                speedIconElement.querySelector('svg').classList.add('fa-gauge-max'); // Asegurar que el icono tenga su clase
            }

            timerDisplayElement = oldFooterInfoContainer.querySelector('.pl-md'); // Contiene "0.00 sec"
            modelSelectorDivElement = oldFooterInfoContainer.querySelector('.md\\:pl-md'); // Contiene select#lamma-select

            if (timerDisplayElement && modelSelectorDivElement) {
                modelSelectElement = modelSelectorDivElement.querySelector('#lamma-select');
                modelSelectArrowElement = modelSelectorDivElement.querySelector('#lamma-select + div');

                // Asegúrate de que el contenedor del temporizador no esté vacío
                if (timerDisplayElement.children.length === 0) {
                    timerDisplayElement.innerHTML = `<div class="inline text-2xs md:text-xs tracking-wide font-mono leading-none uppercase text-foreground">0.00</div><div class="inline text-2xs md:text-xs tracking-wide font-mono leading-none uppercase text-textOff"> <!-- -->sec</div>`;
                }
                timerDisplayElement.classList.add('playground-timer-display');
                timerDisplayElement.classList.remove('pl-md');
                // Remove original speedometer icon from its initial position
                 const originalSpeedIconParent = oldFooterInfoContainer.querySelector('div.font-sans.text-base.text-super');
                 if (originalSpeedIconParent) {
                     originalSpeedIconParent.remove();
                 }

                // Crea un contenedor visual para el select de modelo para aplicar el estilo de "botón"
                const modelSelectWrapper = document.createElement('div');
                modelSelectWrapper.id = 'lamma-select-wrapper';
                modelSelectWrapper.appendChild(modelSelectElement);
                if (modelSelectArrowElement) {
                    modelSelectWrapper.appendChild(modelSelectArrowElement);
                }

            } else {
                console.warn("No se encontró el temporizador o el selector de modelo en el contenedor de información del footer antiguo.");
            }
        } else {
            console.warn("No se encontró el contenedor de información del footer antiguo.");
        }

        // C. Botón de limpiar chat
        const clearChatButton = document.getElementById('playground-clear-chat-button');
        if (clearChatButton) {
            clearChatButton.remove(); // Quítalo de su posición original si ya fue creado
        } else {
            // Si no existe, créalo con el SVG correcto
            const newClearChatButton = document.createElement('button');
            newClearChatButton.id = 'playground-clear-chat-button';
            newClearChatButton.setAttribute('type', 'button');
            newClearChatButton.setAttribute('aria-label', 'Clear Chat');
            newClearChatButton.className = 'focus-visible:bg-offsetPlus hover:bg-offsetPlus text-textOff hover:text-foreground dark:hover:bg-offsetPlus font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button font-semimedium justify-center text-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 ease-outExpo origin-center whitespace-nowrap inline-flex text-base h-8 aspect-square';
            newClearChatButton.innerHTML = `<div class="flex items-center min-w-0 font-medium gap-1.5 justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-trash "><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg></div></div>`;
            clearChatButton = newClearChatButton;
        }

        if (clearChatButton) {
            clearChatButton.addEventListener('click', () => {
                const inputElement = document.getElementById('ask-input');
                if (inputElement) {
                    inputElement.innerHTML = '<p><br></p>';
                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    const responseContainer = document.querySelector('.scrollable-container .w-full:not(#playground-initial-message)');
                    if (responseContainer) {
                        responseContainer.innerHTML = '';
                    }
                }
            });
        }


        // D. Botón de enviar (icono de flecha arriba)
        let sendButton = mainInputBar.querySelector('button[aria-label="Submit"]');
        if (!sendButton) {
            // Este es el botón deshabilitado. Necesitamos clonarlo y modificar su SVG.
            // O encontrar el botón azul si ya está renderizado
            sendButton = document.querySelector('.bg-super.text-inverse.hover\\:opacity-80.font-sans.h-8'); // Intenta encontrar el botón activo
            if (!sendButton) {
                // Si aún no lo encontramos, creamos uno con el SVG de flecha arriba
                const newSendButton = document.createElement('button');
                newSendButton.setAttribute('aria-label', 'Submit');
                newSendButton.setAttribute('type', 'button');
                newSendButton.className = 'bg-super text-inverse hover:opacity-80 font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button font-semimedium justify-center text-center items-center rounded-lg cursor-pointer active:scale-[0.97] active:duration-150 ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-[9/8]';
                newSendButton.innerHTML = `<div class="flex items-center min-w-0 gap-two justify-center"><div class="flex shrink-0 items-center justify-center size-4"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-arrow-up "><path d="M12 5l0 14"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path></svg></div></div>`;
                sendButton = newSendButton;
            } else {
                // Si encontramos el botón activo (el azul), asegurarnos de que su SVG sea la flecha arriba
                const sendSvg = sendButton.querySelector('svg');
                if (sendSvg && !sendSvg.classList.contains('tabler-icon-arrow-up')) {
                    sendSvg.setAttribute('width', '16');
                    sendSvg.setAttribute('height', '16');
                    sendSvg.setAttribute('viewBox', '0 0 24 24');
                    sendSvg.setAttribute('fill', 'none');
                    sendSvg.setAttribute('stroke', 'currentColor');
                    sendSvg.setAttribute('stroke-width', '1.7999999999999998');
                    sendSvg.setAttribute('stroke-linecap', 'round');
                    sendSvg.setAttribute('stroke-linejoin', 'round');
                    sendSvg.classList.add('tabler-icon', 'tabler-icon-arrow-up');
                    sendSvg.innerHTML = '<path d="M12 5l0 14"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path>';
                }
            }
        }


        // --- Reestructuración de la barra de entrada principal ---
        mainInputBar.classList.remove('grid', 'items-center', 'pt-3', 'pb-3', 'gap-y-md');
        mainInputBar.classList.add('flex', 'items-center', 'gap-sm');
        mainInputBar.innerHTML = ''; // Limpia el contenido para reordenar

        // Crear el contenedor para los controles derechos
        const rightControlsWrapper = document.createElement('div');
        rightControlsWrapper.id = 'playground-right-controls-wrapper';

        if (speedIconElement && timerDisplayElement && modelSelectElement && modelSelectWrapper) {
            rightControlsWrapper.appendChild(speedIconElement);
            rightControlsWrapper.appendChild(timerDisplayElement);
            rightControlsWrapper.appendChild(modelSelectWrapper);
        }

        // Añadir elementos en el orden correcto a mainInputBar
        if (clearChatButton) mainInputBar.appendChild(clearChatButton);

        const askInputDiv = document.getElementById('ask-input').closest('div.overflow-hidden.relative.flex.h-full.w-full');
        if (askInputDiv) mainInputBar.appendChild(askInputDiv);

        mainInputBar.appendChild(rightControlsWrapper);

        if (sendButton) mainInputBar.appendChild(sendButton);


        // Asegurarse de que el input de texto tenga el placeholder correcto
        const askInputPlaceholder = document.querySelector('#ask-input + div > div');
        if (askInputPlaceholder) {
            askInputPlaceholder.textContent = 'Ask anything...';
        }

    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.getElementById('root') && document.getElementById('ask-input') && document.querySelector('.py-md.h-headerHeight.flex.items-center.justify-between.border-b.md\\:hidden')) {
            applyPlaygroundLayout();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();