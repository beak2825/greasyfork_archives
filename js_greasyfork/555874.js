// ==UserScript==
// @name         KoGaMa Redux
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  This script applies a custom theme to the KoGaMa.com website, restoring the look and layout of the 2022 interface.
// @author       Haden (discord: haden_31)
// @match        https://www.kogama.com/*
// @match        https://kogama.com/*
// @grant        none
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/555874/KoGaMa%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/555874/KoGaMa%20Redux.meta.js
// ==/UserScript==


(function() {
    document.documentElement.style.visibility = 'hidden';
    document.documentElement.style.opacity = '0';
    
    function showPage() {
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
        document.documentElement.style.transition = 'opacity 0.3s ease-in-out';
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showPage);
    } else {
        showPage();
    }

    'use strict';

    if (window.location.pathname === '/' || 
        window.location.pathname === '' || 
        window.location.pathname === '/games' || 
        window.location.pathname === '/games/') {
        window.location.href = 'https://www.kogama.com/games/popular';
        return;
    }
    
    if (window.location.pathname.startsWith('/games/') && 
        !window.location.pathname.includes('/popular') && 
        !window.location.pathname.includes('/featured') && 
        !window.location.pathname.includes('/new') && 
        !window.location.pathname.includes('/likes') &&
        !window.location.pathname.includes('/play/')) {
        const params = new URLSearchParams(window.location.search);
        window.location.href = `https://www.kogama.com/games/popular?${params.toString()}`;
        return;
    }

    function replaceGradient() {
        const gradientDivs = document.querySelectorAll('div._3qqiG');
        gradientDivs.forEach(div => {
            if (div.style.background && div.style.background.includes('linear-gradient')) {
                div.style.background = 'linear-gradient(180deg, #7bb2ef, #90bcf7 50%, #b0d0f7)';
            }
        });
    }

    function addFriendsButton() {
        const friendListDiv = document.querySelector('._2E1AL ._1pEP2');
        if (friendListDiv && !friendListDiv.querySelector('.friend-list-button')) {
            const button = document.createElement('button');
            button.className = 'friend-list-button';
            button.innerHTML = '<svg viewBox="0 0 640 512"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>';
            button.onclick = function() {
                try {
                    const profileLink = document.querySelector('a[href^="/profile/"]');
                    if (profileLink) {
                        const profileUrl = profileLink.getAttribute('href');
                        const userId = profileUrl.split('/')[2]; // /profile/ID/
                        if (userId) {
                            window.location.href = `https://www.kogama.com/profile/${userId}/friends/`;
                        } else {
                            console.log('No se pudo encontrar el ID del usuario');
                        }
                    } else {
                        console.log('No se encontró el enlace del perfil');
                    }
                } catch (error) {
                    console.error('Error al abrir la lista de amigos:', error);
                }
            };
            
            friendListDiv.appendChild(button);
        }
    }

    function addOnlineHeader() {
        const targetDiv = document.querySelector('._1Yhgq');
        if (targetDiv) {
            if (!targetDiv.querySelector('header.OnlineHeader')) {
                const header = document.createElement('header');
                header.className = 'OnlineHeader';
                header.textContent = 'Offline';
                header.style.padding = '10px 15px';
                header.style.fontWeight = 'bold';
                header.style.color = '#767678';
                header.style.backgroundColor = '#161A1E';
                header.style.borderBottom = '1px solid #202225';
                
                const hr = targetDiv.querySelector('hr');
                if (hr) {
                    hr.insertAdjacentElement('afterend', header);
                } else {
                    targetDiv.insertBefore(header, targetDiv.firstChild);
                }
            }
        }
    }

    function removeElements() {
        document.querySelectorAll('.tRx6U, ._6cutH').forEach(el => el.remove());
        
        addOnlineHeader();
        
        addFriendsButton();
        
        const friendButtonObserver = new MutationObserver((mutations) => {
            if (!document.querySelector('._2E1AL ._1pEP2 .friend-list-button')) {
                addFriendsButton();
            }
        });
        
        friendButtonObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeElements);
    } else {
        removeElements();
    }
    
    const elementObserver = new MutationObserver(removeElements);
    elementObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgFilter.style.position = 'absolute';
    svgFilter.style.width = '0';
    svgFilter.style.height = '0';
    svgFilter.innerHTML = `
        <defs>
            <filter id="1A1A1Ato161A1E" color-interpolation-filters="sRGB">
                <!-- Convert #1A1A1A (26,26,26) to #161A1E (22,26,30) -->
                <feColorMatrix type="matrix" 
                    values="1 0 0 0 0.23
                            0 1 0 0 0.15
                            0 0 1 0 0.15
                            0 0 0 1 0" />
            </filter>
        </defs>
    `;
    document.body.appendChild(svgFilter);
    
    const style = document.createElement('style');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceGradient);
    } else {
        replaceGradient();
    }
    
    const gradientObserver = new MutationObserver((mutations) => {
        replaceGradient();
    });
    
    gradientObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
    
    style.textContent = `
        /* Aplicar filtro para cambiar #1A1A1A a #161A1E */
        html {
            filter: url('#1A1A1Ato161A1E') !important;
        }
        
        *:not(img) {
            border-radius: 0 !important;
        }

        ._1ZdZA {
            background: transparent !important;
            background-color: transparent !important;
            color: white !important;
        }

        ._1ZdZA svg {
            color: white !important;
        }
        
        /* Alinear Friend List a la izquierda */
        ._1pEP2 {
            text-align: left !important;
            padding-left: 15px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        
        /* Estilo para el botón de amigos */
        .friend-list-button {
            background: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 10px 0 0 !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 16px !important;
            height: 16px !important;
        }
        
        .friend-list-button svg {
            width: 100% !important;
            height: 100% !important;
            fill: #767678 !important;
            transition: fill 0.2s !important;
        }
        
        .friend-list-button:hover svg {
            fill: #ffffff !important;
        }

        /* Contenedor de la tarjeta de juego */
        .gmqKr {
            position: relative !important;
            overflow: visible !important;
        }

        /* Asegurar que la imagen tenga el ancho completo del contenedor */
        ._2-0Gj {
            width: 100% !important;
            display: block !important;
        }

        ._2UAMr {
            width: 100% !important;
            height: auto !important;
            display: block !important;
        }

        /* Estilos para el elemento de información */
        ._2SAzV {
            opacity: 0;
            transition: opacity 0.3s ease;
            background: #0B0C0F !important;
            background-color: #0B0C0F !important;
            padding: 16px 16px 12px !important; /* Reducido el padding superior e inferior */
            min-height: fit-content !important;
            position: relative;
            width: 100% !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }

        ._2SAzV:hover {
            opacity: 1;
        }

        /* Ampliar hitbox hacia arriba para activar el hover */
        /* Ajustar el espaciado del texto dentro de ._2SAzV */
        ._2SAzV .rLxDb {
            margin-bottom: 10px !important;
            font-size: 0.9em !important; /* Tamaño de fuente más pequeño */
            line-height: 1.2 !important; /* Interlineado ajustado */
        }

        /* Convertir texto de botones de navegación a mayúsculas */
        ._21Sfe {
            text-transform: uppercase !important;
        }

        /* Actualizar color del selector especificado */
        ._3TORb ._1lvYU ._1taAL ._3zDi-._1mEz4 {
            color: hsl(0, 0%, 100%) !important;
        }
        
        /* Estilo para el header en _3TORb ._1Yhgq */
        ._3TORb ._1Yhgq header {
            font-size: 1em;
            color: #767678 !important;
            font-weight: 700;
            padding: 1em;
        }

        /* Prevenir que el logo se agrande al pasar el cursor */
        header img,
        [class*="logo"] img,
        .MuiButtonBase-root img {
            transform: none !important;
            transition: none !important;
        }

        /* Asegurar que los iconos y texto de likes/jugadas tengan espaciado consistente */
        ._2SAzV ._3O9Z3 {
            display: flex !important;
            gap: 16px !important;
            margin: 0 !important;
            padding: 0 !important;
            color: #6D6D6F !important;
        }

        ._2SAzV ._3O9Z3 li {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            margin: 0 !important;
            color: #6D6D6F !important;
            font-size: 1.75em !important; /* Tamaño de fuente reducido para contadores */
        }

        ._2SAzV::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: -120px; /* altura extra de hitbox hacia arriba */
            height: 120px;
            pointer-events: auto;
        }

        /* Ocultar tooltips en la sección de juegos */
        [role="tooltip"],
        .MuiTooltip-popper,
        .MuiTooltip-tooltip {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        
        /* Desactivar animación de escala/transform en cards de juegos */
        .gmqKr,
        .gmqKr:hover,
        .gmqKr:focus,
        .gmqKr:focus-visible {
            transform: none !important;
            transition: none !important;
        }

        /* Quitar redondeo en imágenes de cards de juegos */
        .gmqKr,
        .gmqKr *,
        ._2-0Gj,
        ._2-0Gj *,
        img._2UAMr {
            border-radius: 0 !important;
        }
        ._2-0Gj,
        .gmqKr {
            overflow: visible !important;
        }

        ._2udT7 {
            display: none !important;
        }

        /* Estilos adicionales de Discord */
        ._375XK .F3PyX {
            transition: all 300ms;
            background: #23272A !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        .badge-name {
            transition: all 300ms;
            background: linear-gradient(45deg, #23272A, #23272A, #7289DA, #7289DA) !important;
            background-position: 1% 100% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        .xp-level a .level-progress .level-progress-fullfil {
            background-color: #7289DA;
            background-image: linear-gradient(90deg, #7289DA 70px, #23272A 150px) !important;
        }

        ._1lvYU {
            background-color: #161A1E !important;
        }

        ._2E1AL {
            transition: all 300ms;
            background: #161A1E !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        #profile-news-feed ul.news-feed-thumbs > li.item {
            background-color: #23272A !important;
            color: #ffffff !important;
        }

        .modal-content {
            background-color: #23272A !important;
        }

        .modal-content button.pure-button.pure-button-xsmall {
            transition: all 300ms;
            background: linear-gradient(45deg, #F9A602, #F9A602, #23272A, #23272A) !important;
            color: #fff !important;
            background-position: 1% 50% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        .modal-content button.delete.pure-button.pure-button-error.pure-button-xsmall {
            transition: all 300ms;
            background: linear-gradient(45deg, #E50000, #E50000, #23272A, #23272A) !important;
            color: #fff !important;
            background-position: 1% 50% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        .modal-content button.invite.pure-button.pure-button-success.pure-button-xsmall {
            transition: all 300ms;
            background: linear-gradient(45deg, hsl(227, 58%, 65%), hsl(227, 58%, 65%), #23272A, #23272A) !important;
            color: #fff !important;
            background-position: 1% 50% !important;
            background-size: 300% 300% !important;
        }

        div.accept_or_cancel > button.accept {
            transition: background 300ms;
            background: linear-gradient(45deg, #8BC34A, #8BC34A, #23272A, #23272A) !important;
            background-position: 0% 75% !important;
            background-size: 300% 300% !important;
            width: 66.1px;
            height: 26.2px;
        }

        div.accept_or_cancel > .cancel {
            transition: background 300ms;
            background: linear-gradient(45deg, #E50000, #E50000, #23272A, #23272A) !important;
            background-position: 0% 75% !important;
            background-size: 300% 300% !important;
            width: 66.1px;
            height: 26.2px;
        }

        .pure-button-primary,
        .pure-button-selected,
        .help-label .text,
        .button-switch2 .active,
        a.pure-button-success,
        a.pure-button-primary,
        a.pure-button-selected,
        .pure-button-success {
            transition: all 300ms;
            background: linear-gradient(45deg, hsl(227, 58%, 65%), hsl(227, 58%, 65%), #23272A, #23272A) !important;
            color: #fff !important;
            background-position: 1% 50% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            border: none;
            width: auto;
        }

        .pure-button-small {
            transition: all 300ms;
            background: linear-gradient(45deg, hsl(227, 58%, 65%), hsl(227, 58%, 65%), #23272A, #23272A) !important;
            background-position: 1% 100% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        #root-page-mobile #header-notify-toggle #notify .container {
            background-color: #23272A;
        }

        body#root-page-mobile header#pageheader #profile-extended {
            background-color: #23272a;
        }
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
        }

        ._2XaOw {
            background: #23272A;
        }
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
        }

        ::-moz-selection {
            background: #2C2F33;
            color: #99AAB5;
        }

        .background-avatar, .section-top-background {
            background: #2C2F33 !important;
            width: auto;
            height: auto;
            size: 100%
        }

        .xp-level .level-progress {
            background-color: #23272A !important;
        }

        body#root-page-mobile {
            background: linear-gradient(180deg, #27333E 0%, #161B1F 100%) !important;
            background-attachment: fixed !important;
            filter: none;
        }

        body {
            background: linear-gradient(180deg, #27333E 0%, #161B1F 100%) !important;
            background-attachment: fixed !important;
        }

        .shop-price {
            transition: all 300ms;
            background: linear-gradient(45deg, hsl(227, 58%, 65%), hsl(227, 58%, 65%), #23272A, #23272A) !important;
            background-position: 1% 50% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        #mobile-page #news-post .post-content .post-body {
            background-color: #23272A;
            box-shadow: 0 5px 0px rgba(114, 137, 218, 1);
            color: #fffc;
        }

        .xp-bar .progress {
            background-color: #23272A;
        }

        .xp-bar .progress .progression-bar {
            background-image: linear-gradient(90deg, #7289DA 70px, #23272A 150px) !important;
        }

        ._3bs9d ._2-MCS {
            background-color: #23272A !important;
        }

        .btn-success {
            transition: all 300ms;
            background: linear-gradient(45deg, hsl(227, 58%, 65%), hsl(227, 58%, 65%), #2C2F33, #2C2F33) !important;
            color: #fff !important;
            background-position: 1% 50% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            border: none;
            width: auto;
            box-shadow: 0 5px 0px rgba(0, 0, 0, 0)
        }

        .box.box-white {
            background-color: #23272A
        }

        ._2jxuA ._1cijc.false {
            transition: all 300ms;
            background: linear-gradient(45deg, #2C2F33, #2C2F33, #7289DA, #7289DA) !important;
            color: #fff !important;
            background-position: 0% 100% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            border: none;
            width: auto;
            box-shadow: 0 5px 0px rgba(0, 0, 0, 0)
        }

        .profile-created-date {
            color: #FFFFFF !important;
            transition: all 300ms;
            background: linear-gradient(45deg, hsl(227, 58%, 65%), hsl(227, 58%, 65%), #23272A, #23272A) !important;
            background-position: 1% 50% !important;
            background-size: 300% 300% !important;
            text-decoration: none;
            width: auto;
            border: none;
        }

        header#pageheader {
            background-image: url(https://dummyimage.com/600x400/23272a/23272a);
            background-size: 100%;
            background-repeat: repeat;
            opacity: 0.2;
            transition-property: all;
            transition-duration: 200ms;
            transition-timing-function: ease;
            transition-delay: 100ms;
        }

        footer ._10NTD {
            padding: 16px 40px;
            background-color: #262A2D !important;
        }

        footer ._2-9Ih {
            padding: 40px 40px 14px;
            color: hsla(0,0%,100%,.55);
            background-color: #2D3134 !important;
        }

        footer .m15P- {
            background-color: #2D3134 !important;
            padding: 16px 40px;
        }
    `;

    if (window.location.pathname.includes('/profile')) {
        style.textContent += `
            ._2jGhB .MuiPaper-root,
            ._2jGhB .MuiCard-root,
            ._2jGhB .css-1udp1s3 {
                background-color: #E2E3E4 !important;
            }
            ._2jGhB .MuiCardHeader-root,
            ._2jGhB .MuiCardHeader-root *,
            ._2jGhB .MuiCardContent-root,
            ._2jGhB .MuiCardContent-root *,
            ._2jGhB .MuiTypography-root,
            ._2jGhB .MuiTypography-root * {
                color: #4A4B4B !important;
            }
            /* Refuerzo de color con !important para evitar textos blancos */
            ._2jGhB a,
            ._2jGhB .MuiLink-root,
            ._2jGhB span,
            ._2jGhB p,
            ._2jGhB h1, ._2jGhB h2, ._2jGhB h3, ._2jGhB h4, ._2jGhB h5, ._2jGhB h6,
            ._2jGhB .MuiTypography-root,
            ._2jGhB .MuiTypography-root * {
                color: #4A4B4B !important;
            }
            /* Iconos que heredan currentColor */
            ._2jGhB [class*="MuiIcon"],
            ._2jGhB [class*="MuiIcon"] svg,
            ._2jGhB [class*="MuiIcon"] path {
                color: #4A4B4B !important;
                fill: #4A4B4B !important;
                stroke: #4A4B4B !important;
            }
            /* Excepción: título sobre la imagen del card (e.g., WAR 4) en blanco */
            ._2jGhB .MuiCardMedia-root ._1SvHr a,
            ._2jGhB .MuiCardMedia-root ._1SvHr a:hover {
                color: #FFFFFF !important;
            }
            /* Botones dentro de _2jGhB */
            ._2jGhB .MuiButton-root,
            ._2jGhB .MuiIconButton-root {
                color: #4A4B4B !important;
                background: transparent !important;
                background-color: transparent !important;
            }
            ._2jGhB .MuiButton-root:hover,
            ._2jGhB .MuiIconButton-root:hover {
                background-color: #E6E9ED !important;
            }
        `;
    }

    if (window.location.pathname.includes('/marketplace')) {
        style.textContent += `
            /* Ocultar mensaje de bienvenida y botones específicos */
            ._3Niqz .MuiPaper-root,
            button._1lHdo._3EVLv,
            button[class*="_1lHdo"][class*="_3EVLv"] {
                display: none !important;
            }
            
            /* Mover los enlaces de navegación más a la izquierda */
            ._2qwYN {
                margin-left: -200px !important;
                padding-left: 0 !important;
            }
            
            /* Estilo base para los enlaces de navegación */
            ._2qwYN a._1lHdo,
            ._2qwYN ._1lHdo {
                color: #5C666E;
                text-transform: uppercase;
                font-weight: bold;
                margin: 0 10px;
                padding: 0 !important;
                cursor: pointer;
                text-decoration: none;
                display: inline !important;
                background: none !important;
                border: none !important;
                box-shadow: none !important;
                outline: none !important;
                -webkit-box-shadow: none !important;
                -moz-box-shadow: none !important;
                line-height: 1 !important;
                height: auto !important;
                width: auto !important;
                min-width: 0 !important;
                min-height: 0 !important;
                position: relative;
            }
            
            /* Ocultar imágenes y contadores */
            ._2qwYN a._1lHdo img,
            ._2qwYN a._1lHdo ._1KeEV {
                display: none !important;
            }
            
            /* Efecto hover - solo cambio de color */
            ._2qwYN a._1lHdo:hover,
            ._2SOJN ._2qwYN ._1lHdo:hover {
                color: #DBDDDE !important;
                background: none !important;
                background-color: transparent !important;
            }
        `;
    }

    if (window.location.pathname.includes('/games/play')) {
        style.textContent += `
            .css-1rbdj9p {
                color: #394551 !important;
            }
            ._3Wsxf .css-bho9d5 {
                color: #394551 !important;
            }
            .MuiChip-root.MuiChip-filledPrimary,
            .MuiChip-root.MuiChip-filledDefault,
            .css-srzahu,
            .css-1u23iwy {
                background: transparent !important;
                background-color: transparent !important;
                box-shadow: none !important;
            }
            .css-1u23iwy {
                color: #848A90 !important;
            }
            .css-srzahu {
                color: #FF370F !important;
            }
            /* Hover de tarjetas */
            .css-1rbdj9p:hover {
                background-color: #E6E9ED !important;
            }
            /* Forzar color gris en el SVG indicado solo dentro de ._2-zAt */
            ._2-zAt path[d="M480.07 96H160a160 160 0 1 0 114.24 272h91.52A160 160 0 1 0 480.07 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z"] {
                fill: #848A90 !important;
                stroke: #848A90 !important;
                color: #848A90 !important;
            }
            /* Robust override in case of currentColor on icon within ._2-zAt */
            ._2-zAt [class*="MuiChip-icon"],
            ._2-zAt [class*="MuiChip-icon"] svg,
            ._2-zAt [class*="MuiChip-icon"] path {
                color: #848A90 !important;
                fill: #848A90 !important;
                stroke: #848A90 !important;
            }
            /* Segundo SVG solo dentro de ._20b6j */
            ._20b6j path[d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6 5.4-12 12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6 5.4-12 12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"] {
                fill: #848A90 !important;
                stroke: #848A90 !important;
                color: #848A90 !important;
            }
            /* Robust override in case of currentColor on icon within ._20b6j */
            ._20b6j [class*="MuiChip-icon"],
            ._20b6j [class*="MuiChip-icon"] svg,
            ._20b6j [class*="MuiChip-icon"] path {
                color: #848A90 !important;
                fill: #848A90 !important;
                stroke: #848A90 !important;
            }
            /* Estilo para el ícono de jugadores en /games/play */
            .MuiChip-colorPrimary .MuiChip-icon,
            .MuiChip-colorPrimary .MuiChip-icon svg,
            .MuiChip-colorPrimary .MuiChip-icon path {
                color: #FF370F !important;
                fill: #FF370F !important;
                stroke: #FF370F !important;
            }
            
            /* Excepción: recolorear ese SVG dentro de ._1MdW0 a #FF370F */
            ._1MdW0 path[d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm-19.47 340.65C282.43 407.01 255.72 416 226.86 416 154.71 416 96 368.26 96 290.75c0-38.61 24.31-72.63 72.79-130.75 6.93 7.98 98.83 125.34 98.83 125.34l58.63-66.88c4.14 6.85 7.91 13.55 11.27 19.97 27.35 52.19 15.81 118.97-33.43 153.42z"] {
                color: #FF370F !important;
                fill: #FF370F !important;
                stroke: #FF370F !important;
            }
        `;
    }

    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(style);
        });
    }

    console.log('Script de Kogama: Bordes redondeados eliminados');

    function removeNodesByClass() {
        try {
            document.querySelectorAll('._2udT7').forEach(el => el.remove());
        } catch (e) {}
    }

    function adjustNavButtonsPosition() {
        try {
            const contentContainer = document.querySelector('.C_CFq');
            const buttonContainer = document.querySelector('.custom-nav-buttons');
            if (!contentContainer || !buttonContainer) return;
            const rect = contentContainer.getBoundingClientRect();
            buttonContainer.style.marginLeft = `${-rect.left}px`;
            buttonContainer.style.width = '100vw';
        } catch (_) {}
    }

    const TARGET_RGB = 'rgb(18, 18, 18)'; // #121212
    const NEW_COLOR = '#CCD1D9';

    function isVisible(el) {
        try {
            if (!(el instanceof Element)) return false;
            const rects = el.getClientRects();
            if (rects.length === 0) return false;
            const style = getComputedStyle(el);
            return style.visibility !== 'hidden' && style.display !== 'none' && style.opacity !== '0';
        } catch (_) { return false; }
    }

    function fixColorsOnElement(el) {
        try {
            if (!isVisible(el)) return;
            const cs = getComputedStyle(el);
            const map = [
                ['color', 'color'],
                ['backgroundColor', 'backgroundColor'],
                ['borderTopColor', 'borderTopColor'],
                ['borderRightColor', 'borderRightColor'],
                ['borderBottomColor', 'borderBottomColor'],
                ['borderLeftColor', 'borderLeftColor'],
                ['outlineColor', 'outlineColor']
            ];
            for (const [prop, styleProp] of map) {
                if (cs[prop] === TARGET_RGB) {
                    el.style[styleProp] = NEW_COLOR;
                }
            }
            const fill = cs.fill;
            if (fill === TARGET_RGB) {
                el.style.fill = NEW_COLOR;
            }
            const stroke = cs.stroke;
            if (stroke === TARGET_RGB) {
                el.style.stroke = NEW_COLOR;
            }
        } catch (_) {}
    }

    function applyPlayColorFix(root = document) {
        try {
            if (!root) return;
            if (root instanceof Element) fixColorsOnElement(root);
            const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
            all.forEach(fixColorsOnElement);
        } catch (_) {}
    }

    function applyPlayColorFixIfPlay(root = document) {
        if (window.location.pathname.includes('/games/play')) {
            applyPlayColorFix(root);
        }
    }

    function fixProfileOverlay(root = document) {
        try {
            const nodes = (root.querySelectorAll ? root.querySelectorAll('._33DXe') : []);
            nodes.forEach(el => {
                const bg = el.style && el.style.backgroundImage ? el.style.backgroundImage : '';
                if (!bg) return;
                const replaced = bg
                    .replace(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0?\.5\s*\)/gi, 'rgba(0, 0, 0, 0)');
                if (replaced !== bg) {
                    el.style.backgroundImage = replaced;
                }
            });
        } catch (_) {}
    }

    function applyProfileOverlayFixIfProfile(root = document) {
        if (window.location.pathname.includes('/profile')) {
            fixProfileOverlay(root);
        }
    }

    function addNavigationButtons() {
        const contentContainer = document.querySelector('.C_CFq');
        if (!contentContainer) return;

        let buttonContainer = document.querySelector('.custom-nav-buttons');
        if (buttonContainer) return; // Ya existe

        buttonContainer = document.createElement('div');
        buttonContainer.className = 'custom-nav-buttons';
        buttonContainer.style.cssText = `
            display: flex;
            gap: 2px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            width: 100vw;
            margin-left: 0;
            padding-left: 24px;
        `;

        const currentPath = window.location.pathname;
        const isPopular = currentPath.includes('/popular') || currentPath === '/games/' || currentPath === '/';
        const isFeatured = currentPath.includes('/featured');
        const isNew = currentPath.includes('/new');
        const isLikes = currentPath.includes('/likes');

        const buttons = [
            {
                svg: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"></path></svg>',
                text: 'POPULAR',
                url: 'https://www.kogama.com/games/popular',
                active: isPopular
            },
            {
                svg: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>',
                text: 'FEATURED',
                url: 'https://www.kogama.com/games/featured/',
                active: isFeatured
            },
            {
                svg: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M323.56 51.2c-20.8 19.3-39.58 39.59-56.22 59.97C240.08 73.62 206.28 35.53 168 0 69.74 91.17 0 209.96 0 281.6 0 408.85 100.29 512 224 512s224-103.15 224-230.4c0-53.27-51.98-163.14-124.44-230.4zm-19.47 340.65C282.43 407.01 255.72 416 226.86 416 154.71 416 96 368.26 96 290.75c0-38.61 24.31-72.63 72.79-130.75 6.93 7.98 98.83 125.34 98.83 125.34l58.63-66.88c4.14 6.85 7.91 13.55 11.27 19.97 27.35 52.19 15.81 118.97-33.43 153.42z"></path></svg>',
                text: 'HOT NEW',
                url: 'https://www.kogama.com/games/new/',
                active: isNew
            },
            {
                svg: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>',
                text: 'LIKES',
                url: 'https://www.kogama.com/games/likes/',
                active: isLikes
            }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.innerHTML = `${btn.svg} <span style="margin-left: 6px;">${btn.text}</span>`;
            button.style.cssText = `
                display: flex;
                align-items: center;
                padding: 8px 16px;
                background: transparent;
                color: ${btn.active ? 'white' : '#5D666E'};
                border: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;

            button.addEventListener('click', () => {
                window.location.href = btn.url;
            });

            button.addEventListener('mouseenter', () => {
                button.style.color = 'white';
            });
            button.addEventListener('mouseleave', () => {
                button.style.color = btn.active ? 'white' : '#5D666E';
            });

            buttonContainer.appendChild(button);
        });

        contentContainer.insertBefore(buttonContainer, contentContainer.firstChild);
        adjustNavButtonsPosition();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addNavigationButtons();
            removeNodesByClass();
            adjustNavButtonsPosition();
            applyPlayColorFixIfPlay();
            applyProfileOverlayFixIfProfile();
        });
    } else {
        addNavigationButtons();
        removeNodesByClass();
        adjustNavButtonsPosition();
        applyPlayColorFixIfPlay();
        applyProfileOverlayFixIfProfile();
    }

    const observer = new MutationObserver(() => {
        addNavigationButtons();
        removeNodesByClass();
        adjustNavButtonsPosition();
        applyPlayColorFixIfPlay();
        applyProfileOverlayFixIfProfile();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', adjustNavButtonsPosition);

    function addIconsToMarketplaceLinks() {
        if (!window.location.pathname.includes('/marketplace')) return;

        const avatarLink = Array.from(document.querySelectorAll('._2qwYN a._1lHdo, ._2qwYN ._1lHdo'))
            .find(el => el.textContent.trim().toLowerCase().includes('avatar'));
        
        if (avatarLink && !avatarLink.querySelector('.icon-avatar')) {
            const userSvg = document.createElement('span');
            userSvg.className = 'icon-avatar';
            userSvg.style.display = 'inline-block';
            userSvg.style.marginRight = '8px';
            userSvg.style.verticalAlign = 'middle';
            userSvg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
            avatarLink.insertBefore(userSvg, avatarLink.firstChild);
        }

        const modelsLink = Array.from(document.querySelectorAll('._2qwYN a._1lHdo, ._2qwYN ._1lHdo'))
            .find(el => el.textContent.trim().toLowerCase().includes('model'));
        
        if (modelsLink && !modelsLink.querySelector('.icon-model')) {
            const cubeSvg = document.createElement('span');
            cubeSvg.className = 'icon-model';
            cubeSvg.style.display = 'inline-block';
            cubeSvg.style.marginRight = '8px';
            cubeSvg.style.verticalAlign = 'middle';
            cubeSvg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.33-.19.73-.19 1.07 0l7.9 4.44c.32.17.6.5.6.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15z"/></svg>';
            modelsLink.insertBefore(cubeSvg, modelsLink.firstChild);
        }
    }

    const marketplaceObserver = new MutationObserver(() => {
        if (window.location.pathname.includes('/marketplace')) {
            addIconsToMarketplaceLinks();
        }
    });

    marketplaceObserver.observe(document.body, { childList: true, subtree: true });

    function updateActiveButton() {
        document.querySelectorAll('._2qwYN a').forEach(btn => {
            btn.style.color = '';
            const icon = btn.querySelector('span:first-child');
            if (icon) icon.style.color = '';
        });

        if (window.location.pathname.includes('/marketplace/avatar')) {
            const avatarBtn = document.querySelector('._2qwYN a[href$="/marketplace/avatar/"]');
            if (avatarBtn) {
                avatarBtn.style.color = '#DADCDE';
                const icon = avatarBtn.querySelector('span:first-child');
                if (icon) icon.style.color = '#DADCDE';
            }
        } else if (window.location.pathname.includes('/marketplace/model')) {
            const modelBtn = document.querySelector('._2qwYN a[href$="/marketplace/model/"]');
            if (modelBtn) {
                modelBtn.style.color = '#DADCDE';
                const icon = modelBtn.querySelector('span:first-child');
                if (icon) icon.style.color = '#DADCDE';
            }
        }
    }

    function modifyMarketplaceSections() {
        if (!window.location.pathname.includes('/marketplace')) return;
        
        updateActiveButton();
        
        if (!document.getElementById('marketplace-hover-styles')) {
            const style = document.createElement('style');
            style.id = 'marketplace-hover-styles';
            style.textContent = `
                .marketplace-section-link {
                    color: #5C666E !important;
                    text-transform: uppercase !important;
                    font-weight: bold !important;
                    text-decoration: none !important;
                    cursor: pointer !important;
                    font-size: 0.9em !important; /* Texto más pequeño */
                    position: relative !important;
                    padding-right: 15px !important;
                    display: inline-block !important;
                    letter-spacing: 0.5px !important;
                }
                .marketplace-section-link:hover {
                    color: #DADCDE !important;
                }
                .marketplace-section-link::after {
                    content: ' ➔'; /* Espacio + flecha derecha larga */
                    position: absolute;
                    right: -12px;
                    top: 0;
                    font-size: 1em;
                    line-height: 1.4;
                    opacity: 0; /* Ocultar por defecto */
                }
                .marketplace-section-link:hover::after {
                    opacity: 1; /* Mostrar solo en hover */
                }
                /* Eliminar efecto de escala en los items del marketplace */
                .MuiGrid-root.MuiGrid-item._2R7lC,
                .MuiGrid-root.MuiGrid-item._2R7lC > div,
                .MuiGrid-root.MuiGrid-item._2R7lC > div > a,
                .MuiGrid-root.MuiGrid-item._2R7lC > div > a > .MuiPaper-root {
                    transform: none !important;
                    transition: none !important;
                    will-change: auto !important;
                }
                
                /* Deshabilitar cualquier transformación en hover */
                .MuiGrid-root.MuiGrid-item._2R7lC:hover,
                .MuiGrid-root.MuiGrid-item._2R7lC:hover > div,
                .MuiGrid-root.MuiGrid-item._2R7lC:hover > div > a,
                .MuiGrid-root.MuiGrid-item._2R7lC:hover > div > a > .MuiPaper-root {
                    transform: none !important;
                }
                
                /* Cambiar color del título al pasar el cursor */
                .MuiGrid-root.MuiGrid-item._2R7lC:hover ._2uIZL span {
                    color: #23252F !important;
                }
                
                /* Ocultar siempre el contenedor de likes y carrito */
                ._31KNN {
                    display: none !important;
                }
                
                /* Estilo para el precio en la imagen */
                ._2eW3Y {
                    position: relative;
                }
                .shop-price {
                    display: none;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0, 0, 0, 0.2) !important;
                    color: #FFD700 !important;
                    text-align: center;
                    padding: 6px 0;
                    font-size: 13px !important;
                    text-decoration: none !important;
                    font-weight: bold !important;
                    backdrop-filter: blur(2px);
                }
                .shop-price img {
                    width: 14px;
                    height: 14px;
                    vertical-align: middle;
                    margin-right: 4px;
                }
                .shop-price .caption {
                    color: #FFD700 !important;
                    vertical-align: middle;
                }
                .MuiGrid-root.MuiGrid-item._2R7lC:hover .shop-price {
                    display: block;
                }
            `;
            document.head.appendChild(style);
        }
        
        function addViewButtons() {
            document.querySelectorAll('._2R7lC').forEach(item => {
                const imageContainer = item.querySelector('._2eW3Y');
                if (imageContainer && !imageContainer.querySelector('.shop-price')) {
                    const priceDiv = document.createElement('div');
                    priceDiv.className = 'shop-price';
                    const isModelSection = window.location.pathname.includes('/model/') || 
                                         document.querySelector('.qq-Cy')?.textContent?.includes('Models');
                    const isModelItem = item.querySelector('a[href*="/model/"]') || 
                                      item.closest('a[href*="/model/"]');
                    const price = (isModelSection || isModelItem) ? '10' : '140';
                    priceDiv.innerHTML = `
                        <img src="//static.kogstatic.com/0000/42dab41e08902eb6f0df99211ef4375c21d759d6/d8d0c409a16489800ffb50008620b118.svg" alt="Gold" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;">
                        <span class="caption">${price} Gold</span>
                    `;
                    imageContainer.appendChild(priceDiv);
                }
            });
        }
        
        const viewButtonObserver = new MutationObserver(addViewButtons);
        viewButtonObserver.observe(document.body, { childList: true, subtree: true });
        
        addViewButtons();
        
        const avatarSections = document.querySelectorAll('.qq-Cy');
        avatarSections.forEach(section => {
            if (section.textContent && section.textContent.includes('Avatars')) {
                section.innerHTML = `
                    <a href="/marketplace/avatar/" class="marketplace-section-link">
                        AVATARS
                    </a>
                `;
            }
        });

        const modelSections = document.querySelectorAll('.qq-Cy');
        modelSections.forEach(section => {
            if (section.textContent && section.textContent.includes('Models')) {
                section.innerHTML = `
                    <a href="/marketplace/model/" class="marketplace-section-link">
                        MODELS
                    </a>
                `;
            }
        });
    }

    const sectionObserver = new MutationObserver(() => {
        modifyMarketplaceSections();
    });

    if (window.location.pathname.includes('/marketplace')) {
        addIconsToMarketplaceLinks();
        modifyMarketplaceSections();
        sectionObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('popstate', updateActiveButton);
})();