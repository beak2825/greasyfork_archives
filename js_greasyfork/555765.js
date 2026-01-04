// ==UserScript==
// @name         ProgramizX
// @namespace    http://tampermonkey.net/
// @version      3.0
// @icon         https://i.ibb.co/B5Ks6Fvp/descarga-19.webp
// @description  Mejoras inteligentes para Programiz
// @author       7anvz
// @match        https://www.programiz.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555765/ProgramizX.user.js
// @updateURL https://update.greasyfork.org/scripts/555765/ProgramizX.meta.js
// ==/UserScript==

(function() {
'use strict';

let fullscreenActivated = false;

// Función para verificar si estamos en una ruta de compilador
function isCompilerRoute() {
    const path = window.location.pathname;
    return path.includes('/online-compiler') ||
           path.includes('/csharp-programming') ||
           path.includes('/python-programming') ||
           path.includes('/java-programming') ||
           path.includes('/cpp-programming') ||
           path.includes('/c-programming');
}

// Función para obtener la extensión del archivo basado en la ruta
function getFileExtension() {
    const path = window.location.pathname;
    if (path.includes('csharp-programming')) return '.cs';
    if (path.includes('python-programming')) return '.py';
    if (path.includes('java-programming')) return '.java';
    if (path.includes('cpp-programming')) return '.cpp';
    if (path.includes('c-programming')) return '.c';
    return '.txt';
}

// Función para obtener el nombre del archivo
function getFileName() {
    const extension = getFileExtension();
    const langMap = {
        '.cs': 'program',
        '.py': 'script',
        '.java': 'Main',
        '.cpp': 'program',
        '.c': 'program'
    };
    return (langMap[extension] || 'code') + extension;
}

// SVG Icons
const downloadSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
</svg>`;

const startSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
</svg>`;

// Función para aplicar todos los estilos CSS (CORREGIDO)
function applyCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .bn-sale-banner { display: none !important; }
        body.bn-sale-active .container .wrapper { height: calc(128vh - 96px) !important; }
        body.bn-sale-active .sidebar-wrapper { height: calc(128vh - 198px) !important; }

        /* BOTÓN DESCARGAR - ESTILOS BASE */
        .download-code-btn {
            justify-content: center !important;
            gap: 6px !important;
            font-weight: 500 !important;
            font-size: 13px !important;
            line-height: 20px !important;
            align-items: center !important;
            margin-left: 12px !important;
            width: auto !important;
            height: 32px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            padding: 6px 12px !important;
            display: flex !important;
            white-space: nowrap !important;
            transition: all 0.2s ease !important;
            min-width: 100px !important;
        }

        /* MODO OSCURO */
        .dark-mode .download-code-btn {
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            background: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
        }

        .dark-mode .download-code-btn:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            border-color: rgba(255, 255, 255, 0.6) !important;
        }

        /* MODO CLARO */
        .container:not(.dark-mode) .download-code-btn {
            border: 1px solid rgba(0, 0, 0, 0.2) !important;
            background: rgba(0, 0, 0, 0.05) !important;
            color: #333333 !important;
        }

        .container:not(.dark-mode) .download-code-btn:hover {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
        }

        /* BOTÓN START - ESTILOS BASE */
        .desktop-run-button.run {
            justify-content: center !important;
            gap: 6px !important;
            font-weight: 500 !important;
            font-size: 13px !important;
            line-height: 20px !important;
            align-items: center !important;
            margin-left: 8px !important;
            width: auto !important;
            height: 32px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            padding: 6px 12px !important;
            display: flex !important;
            white-space: nowrap !important;
            transition: all 0.2s ease !important;
            min-width: 80px !important;
        }

        /* MODO OSCURO */
        .dark-mode .desktop-run-button.run {
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            background: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
        }

        .dark-mode .desktop-run-button.run:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            border-color: rgba(255, 255, 255, 0.6) !important;
        }

        /* MODO CLARO */
        .container:not(.dark-mode) .desktop-run-button.run {
            border: 1px solid rgba(0, 0, 0, 0.2) !important;
            background: rgba(0, 0, 0, 0.05) !important;
            color: #333333 !important;
        }

        .container:not(.dark-mode) .desktop-run-button.run:hover {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
        }

        /* BOTÓN RUN MÓVIL - TAMAÑO CORREGIDO */
        .mobile-top-bar-run-button.run {
            justify-content: center !important;
            align-items: center !important;
            width: 32px !important;
            height: 28px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            padding: 6px !important;
            display: flex !important;
            transition: all 0.2s ease !important;
            margin-left: 6px !important;
        }

        /* MODO OSCURO */
        .dark-mode .mobile-top-bar-run-button.run {
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            background: rgba(255, 255, 255, 0.1) !important;
        }

        .dark-mode .mobile-top-bar-run-button.run:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            border-color: rgba(255, 255, 255, 0.6) !important;
        }

        /* MODO CLARO */
        .container:not(.dark-mode) .mobile-top-bar-run-button.run {
            border: 1px solid rgba(0, 0, 0, 0.2) !important;
            background: rgba(0, 0, 0, 0.05) !important;
        }

        .container:not(.dark-mode) .mobile-top-bar-run-button.run:hover {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
        }

        .mobile-top-bar-run-button.run img {
            width: 14px !important;
            height: 14px !important;
        }

        .dark-mode .mobile-top-bar-run-button.run img {
            filter: invert(1) !important;
        }

        .container:not(.dark-mode) .mobile-top-bar-run-button.run img {
            filter: invert(1) !important;
        }

        /* BOTÓN DESCARGAR MÓVIL - TAMAÑO CORREGIDO */
        .mobile-download-btn {
            justify-content: center !important;
            align-items: center !important;
            margin-left: 6px !important;
            width: 32px !important;
            height: 28px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            padding: 6px !important;
            display: flex !important;
            transition: all 0.2s ease !important;
        }

        /* MODO OSCURO */
        .dark-mode .mobile-download-btn {
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            background: rgba(255, 255, 255, 0.1) !important;
        }

        .dark-mode .mobile-download-btn:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            border-color: rgba(255, 255, 255, 0.6) !important;
        }

        /* MODO CLARO */
        .container:not(.dark-mode) .mobile-download-btn {
            border: 1px solid rgba(0, 0, 0, 0.2) !important;
            background: rgba(0, 0, 0, 0.05) !important;
        }

        .container:not(.dark-mode) .mobile-download-btn:hover {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
        }

        /* ICONOS SVG */
        .download-icon, .start-icon, .mobile-download-icon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .download-icon svg, .start-icon svg, .mobile-download-icon svg {
            width: 14px !important;
            height: 14px !important;
        }

        div .header {
            display: none;
        }

        /* ELIMINAR BOTÓN RUN MÓVIL ANTIGUO */
        .mobile-run-button.run {
            display: none !important;
        }

        /* RESPONSIVE MEJORADO - PANTALLA DIVIDIDA */
        @media (max-width: 1200px) {
            .download-text, .start-text, .mobile-download-text {
                display: none !important;
            }

            .download-code-btn, .desktop-run-button.run {
                width: 32px !important;
                min-width: 32px !important;
                height: 28px !important;
                padding: 6px !important;
                margin-left: 6px !important;
            }

            .download-icon svg, .start-icon svg, .mobile-download-icon svg {
                width: 14px !important;
                height: 14px !important;
            }

            /* Asegurar que los botones se alineen correctamente */
            .options-wrapper {
                display: flex !important;
                gap: 6px !important;
                align-items: center !important;
            }

            .mobile-download-btn, .mobile-top-bar-run-button.run {
                margin-left: 10px !important;
                width: 28px !important;
                height: 26px !important;
                padding: 4px !important;
            }

            .mobile-download-icon svg {
                width: 12px !important;
                height: 12px !important;
            }

            .mobile-top-bar-run-button.run img {
                width: 12px !important;
                height: 12px !important;
            }
        }

        /* RESPONSIVE - MÓVIL */
        @media (max-width: 1024px) {
            .desktop-top-bar__btn-wrapper .download-code-btn {
                display: none !important;
            }
            .mobile-top-bar .mobile-download-btn {
                display: flex !important;
            }
        }

        /* RESPONSIVE EXTREMO - PANTALLAS MUY PEQUEÑAS */
        @media (max-width: 768px) {
            .mobile-download-btn, .mobile-top-bar-run-button.run {
                width: 24px !important;
                height: 24px !important;
                padding: 1px !important;
                margin: 6px;
            }

            .mobile-download-icon svg {
                width: 11px !important;
                height: 11px !important;
            }

            .mobile-top-bar-run-button.run img {
                width: 11px !important;
                height: 11px !important;
            }

            .options-wrapper {
                gap: 4px !important;
            }
        }

        /* ESTADOS OCULTOS */
        .download-code-btn.hidden, .mobile-download-btn.hidden {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Función para extraer el código del editor ACE
function getCodeFromEditor() {
    const aceContent = document.querySelector('.ace_content');
    if (!aceContent) return null;

    const textLines = aceContent.querySelectorAll('.ace_line');
    let code = '';
    textLines.forEach(line => {
        code += (line.textContent || line.innerText) + '\n';
    });
    return code.trim();
}

// Función para descargar el código
function downloadCode() {
    if (!isCompilerRoute()) return;

    const code = getCodeFromEditor();
    if (!code) {
        alert('No se pudo encontrar el código en el editor');
        return;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para modificar el botón Run a Start
function modifyRunButton() {
    const runButton = document.querySelector('.desktop-run-button.run');
    if (runButton && !runButton.querySelector('.start-icon')) {
        runButton.innerHTML = `<span class="start-icon">${startSVG}</span><span class="start-text">Start</span>`;

        const originalOnClick = runButton.onclick;
        if (originalOnClick) {
            runButton.onclick = originalOnClick;
        }
    }
}

// Función para crear botones de descarga
function createDownloadButtons() {
    // Botón desktop
    const desktopWrapper = document.querySelector('.desktop-top-bar__btn-wrapper');
    if (desktopWrapper && !desktopWrapper.querySelector('.download-code-btn')) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-code-btn' + (isCompilerRoute() ? '' : ' hidden');
        downloadBtn.innerHTML = `<span class="download-icon">${downloadSVG}</span><span class="download-text">Download</span>`;
        downloadBtn.onclick = downloadCode;

        const shareButton = desktopWrapper.querySelector('.share-button');
        if (shareButton) {
            shareButton.parentNode.insertBefore(downloadBtn, shareButton.nextSibling);
        } else {
            desktopWrapper.appendChild(downloadBtn);
        }
    }

    // Botón móvil - MEJORADO
    const mobileTopBar = document.querySelector('.mobile-top-bar');
    if (mobileTopBar && !mobileTopBar.querySelector('.mobile-download-btn')) {
        const optionsWrapper = mobileTopBar.querySelector('.options-wrapper');
        if (optionsWrapper) {
            const mobileBtn = document.createElement('button');
            mobileBtn.className = 'mobile-download-btn' + (isCompilerRoute() ? '' : ' hidden');
            mobileBtn.innerHTML = `<span class="mobile-download-icon">${downloadSVG}</span><span class="mobile-download-text">Save</span>`;
            mobileBtn.onclick = downloadCode;

            // Insertar al inicio del options-wrapper
            const firstChild = optionsWrapper.firstChild;
            if (firstChild) {
                optionsWrapper.insertBefore(mobileBtn, firstChild);
            } else {
                optionsWrapper.appendChild(mobileBtn);
            }
        }
    }

    // Eliminar botón run móvil antiguo
    const oldMobileRunBtn = document.querySelector('.mobile-run-button.run');
    if (oldMobileRunBtn) {
        oldMobileRunBtn.remove();
    }

    // Modificar botón Run a Start
    modifyRunButton();
}

// Observar cambios de modo oscuro/claro
function observeThemeChanges() {
    const themeObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                // Forzar actualización de estilos cuando cambia la clase
                const container = document.querySelector('.container');
                if (container) {
                    // Los estilos CSS se aplican automáticamente
                    console.log('Modo cambiado:', container.classList.contains('dark-mode') ? 'oscuro' : 'claro');
                }
            }
        });
    });

    const container = document.querySelector('.container');
    if (container) {
        themeObserver.observe(container, { attributes: true, attributeFilter: ['class'] });
    }
}

// FUNCIÓN ULTRA-RÁPIDA PARA FULLSCREEN
function activateFullscreenFast() {
    if (fullscreenActivated) return;

    const fullscreenButton = document.querySelector('#toggle-expanded-mode-desktop');
    if (fullscreenButton) {
        fullscreenButton.click();
        fullscreenActivated = true;

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            document.body.clientHeight;
        }, 50);
    }
}

// Función para manejar cambios de tamaño de ventana
function handleResize() {
    const mobileBtn = document.querySelector('.mobile-download-btn');
    const desktopBtn = document.querySelector('.download-code-btn');

    if (window.innerWidth <= 1024) {
        if (mobileBtn) mobileBtn.classList.toggle('hidden', !isCompilerRoute());
        if (desktopBtn) desktopBtn.classList.add('hidden');
    } else {
        if (desktopBtn) desktopBtn.classList.toggle('hidden', !isCompilerRoute());
        if (mobileBtn) mobileBtn.classList.add('hidden');
    }
}

// Función para ocultar banners
function hideSaleBanner() {
    const banners = document.querySelectorAll('.bn-sale-banner');
    banners.forEach(banner => banner.style.display = 'none');
}

// Observador mejorado para detectar cambios
const observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.matches && node.matches('#toggle-expanded-mode-desktop') && !fullscreenActivated) {
                        setTimeout(activateFullscreenFast, 10);
                    }
                    if (node.matches && (node.matches('.desktop-top-bar__btn-wrapper') || node.matches('.mobile-top-bar') || node.matches('.desktop-run-button.run') || node.matches('.options-wrapper'))) {
                        setTimeout(() => {
                            createDownloadButtons();
                            modifyRunButton();
                        }, 10);
                    }
                    if (node.matches && node.matches('.bn-sale-banner')) {
                        hideSaleBanner();
                    }
                }
            }
        }
    }
});

// INICIALIZACIÓN RÁPIDA
function initializeFast() {
    applyCustomStyles();
    hideSaleBanner();
    createDownloadButtons();
    observeThemeChanges();

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', () => {
        fullscreenActivated = !!document.fullscreenElement;
    });

    setTimeout(activateFullscreenFast, 300);
    observer.observe(document.body, { childList: true, subtree: true });
    handleResize();
}

// Detector de cambios de ruta
let currentUrl = location.href;
setInterval(() => {
    if (location.href !== currentUrl) {
        currentUrl = location.href;
        setTimeout(() => {
            createDownloadButtons();
            handleResize();
            if (!fullscreenActivated) {
                setTimeout(activateFullscreenFast, 200);
            }
        }, 100);
    }
}, 500);

// INICIAR
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFast);
} else {
    initializeFast();
}

})();