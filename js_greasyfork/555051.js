// ==UserScript==
// @name         Drawaria Avatar Mii Builder
// @namespace    YoutubeDrawariaAvatarMiiBuilder
// @version      4.4
// @description  Transforms the Drawaria Avatar Builder UI into a Wii Channel Mii Editor.
// @author       YouTubeDrawaria
// @match        https://*.drawaria.online/avatar/builder/
// @match        https://drawaria.online/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://cdn.miiwiki.org/8/85/Default_Male_Mii.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555051/Drawaria%20Avatar%20Mii%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/555051/Drawaria%20Avatar%20Mii%20Builder.meta.js
// ==/UserScript==

(($, undefined) => {
    // --- VARIABLES Y FUNCIONES CORS (EXTRAÍDAS DE TU CÓDIGO) ---
    const corsDomains = {
      image: [
        'imgur.com', 'i.imgur.com', 'ibb.co', 'i.ibb.co',
        'githubusercontent.com', 'unsplash.com', 'pexels.com',
        'pixabay.com', 'cdn.dribbble.com', 'images.unsplash.com',
        'media.giphy.com', 'giphy.com', 'tenor.com', 'c.tenor.com',
        'cdn.miiwiki.org', 'pbs.twimg.com', 'khrome.wordpress.com', 'www.miicharacters.com', 'i.pinimg.com', 'images.nintendolife.com', 'encrypted-tbn0.gstatic.com' // Dominios Mii añadidos
      ],
    };

    const corsProxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
      'https://api.codetabs.com/v1/proxy?quest='
    ];

    function getCorsEnabledUrl(originalUrl, type) {
      const domains = corsDomains[type] || [];
      return domains.some(domain => originalUrl.includes(domain)) ||
             originalUrl.startsWith('data:') ||
             originalUrl.startsWith('blob:');
    }

    // **NUEVA FUNCIÓN CLAVE:** Carga la imagen a través de proxy y devuelve una Blob URL.
    async function getCorsBypassImageUrl(originalUrl) {
        if (originalUrl.startsWith('data:') || originalUrl.startsWith('blob:')) {
            return originalUrl; // Ya es seguro
        }

        for (const proxy of corsProxies) {
            try {
                const proxyUrl = proxy + encodeURIComponent(originalUrl);
                const response = await fetch(proxyUrl);

                if (!response.ok) continue;

                const blob = await response.blob();
                if (blob.size === 0) continue;

                return URL.createObjectURL(blob); // Retorna la URL local (blob:...)

            } catch (error) {
                console.warn(`❌ Proxy ${proxy} falló para imagen: ${error}`);
                continue;
            }
        }

        console.error(`❌ Todos los proxies fallaron para cargar: ${originalUrl}. Usando URL directa.`);
        return originalUrl; // Falla segura (puede causar CORS error)
    }

    // --- URLs de Imágenes Mii Proporcionadas ---
    const MII_URLS = {
        BASE_MALE: "https://cdn.miiwiki.org/8/85/Default_Male_Mii.png",
        BASE_FEMALE: "https://cdn.miiwiki.org/2/2b/Default_Female_Mii.png",
        TWITTER_MII: "https://pbs.twimg.com/profile_images/1940066429899886592/MdFIytQ8_400x400.jpg",
        KHROME_MII: "https://khrome.wordpress.com/wp-content/uploads/2012/10/23e90-hni_0013.jpg",
        MARIO_MII: "https://www.miicharacters.com/miis/large/22223_mario.jpg",
        PINTEREST_MII: "https://i.pinimg.com/474x/a0/b5/26/a0b526999ce2b35596a7635863de0894.jpg",
        NINTENDO_LIFE_MII: "https://images.nintendolife.com/762252b2a9312/one-of-many.300x.jpg",
        ENCRYPTED_MII: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_96fzxWKWhEqd46jC-ZvOsZpVJsP3HNokhg&s",
    };

    // --- ESTRUCTURA DE DATOS MII ---
    const MII_COMPONENT_DATA = {
        'face': [
            { name: 'Mii Base Hombre', drawariaId: 'MII_BASE_M', src: MII_URLS.BASE_MALE, layer: 'base' },
            { name: 'Mii Base Mujer', drawariaId: 'MII_BASE_F', src: MII_URLS.BASE_FEMALE, layer: 'base' },
            { name: 'Mii de Twitter', drawariaId: 'TWITTER_STYLE', src: MII_URLS.TWITTER_MII, layer: 'base' },
            { name: 'Mii de Khrome', drawariaId: 'KHROME_STYLE', src: MII_URLS.KHROME_MII, layer: 'base' },
        ],
        'eyes': [
            { name: 'Mii Mario', drawariaId: 'MII_MARIO', src: MII_URLS.MARIO_MII, layer: 'base' },
            { name: 'Mii Pinterest', drawariaId: 'MII_PIN_STYLE', src: MII_URLS.PINTEREST_MII, layer: 'base' },
        ],
        'mouth': [
            { name: 'Mii NintendoLife', drawariaId: 'NINTENDOLIFE', src: MII_URLS.NINTENDO_LIFE_MII, layer: 'base' },
            { name: 'Mii Encrypted', drawariaId: 'ENCRYPTED_STYLE', src: MII_URLS.ENCRYPTED_MII, layer: 'base' },
        ],
        'accessories': [
            { name: 'Mii Vacio', drawariaId: 'EMPTY_SLOT', src: MII_URLS.BASE_MALE, layer: 'base' },
            { name: 'Mii Base Mujer', drawariaId: 'MII_BASE_F', src: MII_URLS.BASE_FEMALE, layer: 'base' },
        ]
    };

    const MII_PAGES = [
        { name: 'Cara y Pelo', partKey: 'face', icon: '👤' },
        { name: 'Ojos y Cejas', partKey: 'eyes', icon: '👁️' },
        { name: 'Nariz y Boca', partKey: 'mouth', icon: '👃' },
        { name: 'Extras y Color', partKey: 'accessories', icon: '🎨' }
    ];
    let currentPage = 0;
    const AVATAR_SAVE_KEY = 'avatarsave_builder';

    // **ESTADO INICIAL DEL AVATAR MII**
    let currentMiiState = {
        'base': { drawariaId: MII_COMPONENT_DATA.face[0].drawariaId, src: MII_COMPONENT_DATA.face[0].src, blobUrl: null },
        'hair': { drawariaId: null, src: null, blobUrl: null },
        'brows': { drawariaId: null, src: null, blobUrl: null },
        'eyes': { drawariaId: null, src: null, blobUrl: null },
        'nose': { drawariaId: null, src: null, blobUrl: null },
        'mouth': { drawariaId: null, src: null, blobUrl: null },
        'accessories': { drawariaId: null, src: null, blobUrl: null },
        'shirt': { drawariaId: null, src: null, blobUrl: null },
    };

    const DRAW_ORDER_KEYS = ['base', 'shirt', 'hair', 'brows', 'eyes', 'nose', 'mouth', 'accessories'];

    // --- FUNCIÓN DE RENDERIZADO EN EL NUEVO CANVAS (MODIFICADA) ---
    const MiiCanvasRenderer = async () => {
        const canvas = document.getElementById('avatar-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Cargar y dibujar de forma secuencial y asíncrona
        const loadAndDraw = async (index) => {
            if (index >= DRAW_ORDER_KEYS.length) return;

            const layerKey = DRAW_ORDER_KEYS[index];
            const partToDraw = currentMiiState[layerKey];

            if (!partToDraw || !partToDraw.src) {
                 await loadAndDraw(index + 1);
                 return;
            }

            // **PASO CLAVE:** Cargar la imagen usando el proxy para obtener una blobUrl
            if (!partToDraw.blobUrl) {
                partToDraw.blobUrl = await getCorsBypassImageUrl(partToDraw.src);
            }

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                ctx.drawImage(img, 0, 0, W, H);
                loadAndDraw(index + 1);
            };
            img.onerror = () => {
                console.error(`❌ Error al dibujar imagen (Blob/CORS) para capa: ${layerKey}`);
                loadAndDraw(index + 1);
            };
            // Usamos la blobUrl segura (o la URL directa si falla el proxy)
            img.src = partToDraw.blobUrl || partToDraw.src;
        };

        await loadAndDraw(0);
    };

    // --- FUNCIÓN DE ACTUALIZACIÓN DEL COMPONENTE (MODIFICADA) ---
    const updateAvatarComponent = (partLayer, componentName, drawariaId, src) => {
        // 1. SOBREESCRIBIR LA BASE y marcar para recarga CORS.
        currentMiiState['base'] = { drawariaId: drawariaId, src: src, blobUrl: null }; // blobUrl = null fuerza la recarga CORS

        // Borrar las capas superiores para evitar la superposición de Mii completos
        DRAW_ORDER_KEYS.forEach(key => {
            if (key !== 'base') {
                currentMiiState[key] = { drawariaId: null, src: null, blobUrl: null };
            }
        });

        // 2. Manipular el objeto de guardado de Drawaria (HIPOTÉTICO)
        if (window.ACCOUNT_AVATARSAVE) {
             window.ACCOUNT_AVATARSAVE['selectedMiiStyle_id'] = drawariaId;
        }

        // 3. Renderizar el nuevo estado en el canvas Mii
        MiiCanvasRenderer();
    };

    // --- LÓGICA DE NAVEGACIÓN Y RENDERIZADO DE PÁGINA ---
    const displayMiiPage = (index) => {
        currentPage = index;
        const page = MII_PAGES[index];
        const $selector = $('#miiComponentSelector');

        $('#miiPageIndicator').text(`${index + 1}/${MII_PAGES.length}`);
        $selector.empty();

        let html = `<div class="MiiGridHeader">${page.icon} Componentes de ${page.name}</div>`;
        html += '<div class="MiiGrid">';

        const allComponents = MII_COMPONENT_DATA[page.partKey] || [];
        allComponents.forEach(component => {
            const isSelected = currentMiiState.base.drawariaId === component.drawariaId ? 'selected' : '';

            html += `
                <div
                    class="MiiChannelSlot MiiButton ${isSelected}"
                    data-layer="${component.layer}"
                    data-name="${component.name}"
                    data-drawariaid="${component.drawariaId}"
                    data-src="${component.src}"
                    title="${component.name}"
                >
                    <img src="${component.src}" alt="${component.name}" class="MiiComponentImage" onerror="this.src='https://via.placeholder.com/70x70.png?text=ERROR'">
                </div>
            `;
        });

        html += '</div>';
        $selector.html(html);

        // Agregar listeners a los nuevos slots
        $('.MiiChannelSlot').on('click', function() {
            const layer = $(this).data('layer');
            const name = $(this).data('name');
            const drawariaId = $(this).data('drawariaid');
            const src = $(this).data('src');

            $('.MiiChannelSlot').removeClass('selected');
            $(this).addClass('selected');

            updateAvatarComponent(layer, name, drawariaId, src);
        });
    };

    // --- LÓGICA DE GUARDADO ---
    const saveAvatarChanges = () => {
        const $saveButton = $('#miiSaveButton');
        $saveButton.text('Guardando...');

        const currentAvatarSave = window.ACCOUNT_AVATARSAVE;

        if (!currentAvatarSave) {
            alert('Error: No se pudo obtener el estado del avatar.');
            $saveButton.text('Guardar');
            return;
        }

        $.ajax({
            url: window.LOGGEDIN ? '/saveavatar' : '/uploadavatarimage',
            type: 'POST',
            data: {
                [AVATAR_SAVE_KEY]: JSON.stringify(currentAvatarSave),
                'fromeditor': true,
            },
        })
        .done((data) => {
             $saveButton.text('¡Guardado OK!');
             setTimeout(() => {
                 // **LIMPIEZA:** Liberar las blob URLs creadas para evitar fugas de memoria.
                 DRAW_ORDER_KEYS.forEach(key => {
                     if (currentMiiState[key] && currentMiiState[key].blobUrl && currentMiiState[key].blobUrl.startsWith('blob:')) {
                         URL.revokeObjectURL(currentMiiState[key].blobUrl);
                     }
                 });
                 window.location.href = new URL(window.location.href).origin;
             }, 1000);
        })
        .fail((_jqXHR, _textStatus, errorThrown) => {
            alert(`Error al guardar: ${errorThrown}.`);
            $saveButton.text('Guardar');
        });
    };

    // --- FUNCIÓN DE INICIALIZACIÓN ---
    const MiiBuilderInit = () => {
        // Ocultar elementos de Drawaria
        $('header').hide();
        $('.List, .Panel:not(.preview)').hide();
        $('canvas.main').hide();

        const $previewPanel = $('.Panel.preview');
        $previewPanel.wrap('<div id="originalDrawariaPreviewWrapper" style="display:none;"></div>');

        // Inyectar el nuevo HTML y el NUEVO CANVAS
        const $miiUI = $(`
            <div id="miiContainer">
                <div id="miiContent">
                    <div id="miiAvatarArea">
                        <div id="miiAvatarWrapper">
                            <canvas id="avatar-canvas" width="400" height="400"></canvas>
                        </div>
                    </div>
                    <div id="miiEditorArea" class="MiiPanel">
                        <!-- Indicador de página -->
                        <div id="miiPageHeader">
                            <button id="miiPrevPage" class="MiiNavButton MiiButton">◀</button>
                            <span id="miiPageIndicator">1/${MII_PAGES.length}</span>
                            <button id="miiNextPage" class="MiiNavButton MiiButton">▶</button>
                        </div>

                        <!-- Cuadrícula de componentes -->
                        <div id="miiComponentSelector"></div>

                        <!-- Controles de Movimiento/Escala/Color (PLACEHOLDERS) -->
                        <div id="miiControlsPanel">
                            <div class="MiiControlGroup">
                                <span class="MiiControlLabel">Posición/Escala</span>
                                <div class="MiiControlGrid">
                                    <button class="MiiSmallButton MiiButton">↑</button>
                                    <button class="MiiSmallButton MiiButton">↔</button>
                                    <button class="MiiSmallButton MiiButton">↗</button>
                                    <button class="MiiSmallButton MiiButton">↓</button>
                                </div>
                            </div>
                            <div class="MiiControlGroup">
                                <span class="MiiControlLabel">Color</span>
                                <div class="MiiColorPalette">
                                    <div class="MiiColorSlot" style="background-color: #333;"></div>
                                    <div class="MiiColorSlot" style="background-color: #f7a83d;"></div>
                                    <div class="MiiColorSlot" style="background-color: #d10000;"></div>
                                    <div class="MiiColorSlot" style="background-color: #007cff;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="miiFooterBar">
                    <button id="miiQuitButton" class="MiiQuitButton MiiButton" onclick="window.location.href = '/';">Quit</button>
                    <div id="miiDate">Mar. 08-05</div>
                    <button id="miiSaveButton" class="MiiSaveButton MiiButton">Guardar</button>
                </div>
            </div>
        `);

        $('main').css({
            'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center',
            'padding': '0', 'margin': '0', 'min-height': '100vh'
        }).append($miiUI);

        // 4. Agregar listeners para navegación y guardado.
        $('#miiPrevPage').on('click', () => {
            if (currentPage > 0) displayMiiPage(currentPage - 1);
        });
        $('#miiNextPage').on('click', () => {
            if (currentPage < MII_PAGES.length - 1) displayMiiPage(currentPage + 1);
        });
        $('#miiSaveButton').on('click', saveAvatarChanges);

        // 6. Cargar la primera página y dibujar el estado inicial.
        displayMiiPage(0);
        MiiCanvasRenderer();
    };

    // --- PUNTO DE ENTRADA ---
    $(() => {
        applyMiiVibeStyles();

        const mainObserver = new MutationObserver(() => {
            if ($('main').length && $('.Panel.preview').length) {
                MiiBuilderInit();
                mainObserver.disconnect();
            }
        });

        mainObserver.observe(document, { childList: true, subtree: true });
    });

    // Resto de estilos CSS (sin cambios)
    const applyMiiVibeStyles = () => {
        const style = `
            /* GENERAL MII VIBE */
            body, html {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(180deg, #cce8ff, #e3f7ff);
                color: #333;
                overflow: hidden;
            }
            .App > header, .App > main > div:not(#miiContainer) {
                display: none !important;
            }
            .Panel {
                box-shadow: none !important;
            }

            /* CONTENEDOR PRINCIPAL MII */
            #miiContainer {
                width: 1000px;
                height: 700px;
                max-width: 95vw;
                max-height: 95vh;
                margin: auto;
                display: flex;
                flex-direction: column;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
            }

            /* BARRA SUPERIOR E INFERIOR (EL BLANCO REDONDEADO DE WII) */
            .MiiPanel {
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(5px);
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                padding: 15px;
                margin: 10px;
            }
            #miiFooterBar {
                background: white;
                height: 80px;
                border-top: 2px solid #00b8ff;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                padding: 0 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 24px;
                font-weight: bold;
                color: #007cff;
            }

            /* ÁREA DE CONTENIDO */
            #miiContent {
                flex-grow: 1;
                display: flex;
                padding: 20px;
                background: linear-gradient(135deg, #e0f8ff, #cbf0ff);
            }
            #miiAvatarArea {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #miiAvatarWrapper {
                width: 400px;
                height: 400px;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                background: linear-gradient(135deg, #4edaff, #007cff);
            }

            /* ÁREA DEL EDITOR DE COMPONENTES */
            #miiEditorArea {
                width: 450px;
                height: 100%;
                display: flex;
                flex-direction: column;
                margin-left: 20px;
                padding: 10px;
            }
            #miiPageHeader {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }

            /* BOTONES GENERALES (MII BUTTONS) - Estilo en relieve */
            .MiiButton {
                padding: 10px 15px;
                font-size: 16px;
                font-weight: bold;
                color: #333;
                background: linear-gradient(180deg, #f0f0f0, #e8e8e8);
                border: 2px solid #ccc;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.1s;
                text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
                box-shadow: 0 3px 0 #b3b3b3;
            }
            .MiiButton:hover {
                background: linear-gradient(180deg, #fff, #f0f0f0);
                box-shadow: 0 3px 0 #888;
                transform: translateY(-1px);
            }
            .MiiButton:active {
                box-shadow: 0 0 0 #b3b3b3;
                transform: translateY(3px);
            }

            /* BOTONES DE GUARDAR/SALIR */
            .MiiQuitButton {
                background: linear-gradient(180deg, #f77, #d00);
                color: white;
                border-color: #a00;
                box-shadow: 0 3px 0 #700;
            }
            .MiiSaveButton {
                background: linear-gradient(180deg, #9f9, #080);
                color: white;
                border-color: #050;
                box-shadow: 0 3px 0 #030;
            }

            /* CUADRÍCULA DE COMPONENTES MII CON IMÁGENES */
            .MiiGridHeader {
                font-size: 14px;
                font-weight: bold;
                color: #007cff;
                margin-bottom: 10px;
            }
            .MiiGrid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                flex-grow: 1;
                overflow-y: auto;
                padding-right: 5px;
            }
            .MiiChannelSlot {
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px;
                border-color: #aaa;
                box-shadow: 0 3px 0 #999;
            }
            .MiiComponentImage {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                pointer-events: none;
            }
            .MiiChannelSlot.selected {
                border: 3px solid #00f2ff;
                box-shadow: 0 0 15px rgba(0, 200, 255, 0.8), 0 3px 0 #999;
                transform: translateY(-1px);
            }

            /* PANELES DE CONTROL ADICIONALES */
            #miiControlsPanel {
                display: flex;
                justify-content: space-around;
                align-items: flex-start;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                margin-top: 15px;
            }
            .MiiControlGroup { text-align: center; }
            .MiiControlLabel {
                display: block;
                font-size: 12px;
                color: #555;
                margin-bottom: 5px;
            }
            .MiiControlGrid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5px;
            }
            .MiiSmallButton {
                padding: 5px 10px;
                font-size: 14px;
            }
            .MiiColorPalette { display: flex; gap: 5px; }
            .MiiColorSlot {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                border: 2px solid #fff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
                cursor: pointer;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);
    };
})(window.jQuery.noConflict(true));