// ==UserScript==
// @name         SII Ventana Eliminator (Optimized)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Minimal green/red slider at top-right; toggles auto-removal of SII modal. Clean, modern design with persistent state.
// @author       Shiro341
// @license      MIT
// @match        https://misiir.sii.cl/cgi_misii/siihome.cgi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553474/SII%20Ventana%20Eliminator%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553474/SII%20Ventana%20Eliminator%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MODAL_ID = 'myMainCorreoVigente';
    const STORAGE_KEY = 'eliminarModalCorreoActivo';
    let observer = null;
    const enabled = localStorage.getItem(STORAGE_KEY) === '1';

    // Función para verificar si es móvil/tablet
    function isMobileView() {
        return window.innerWidth <= 767;
    }

    // Optimized modal handling
    function toggleModal(show) {
        const modal = document.getElementById(MODAL_ID);
        if (!modal) return;

        modal.style.display = show ? '' : 'none';
        modal.setAttribute('aria-hidden', show ? 'false' : 'true');
    }

    // MutationObserver para detectar cambios eficientemente
    function setupObserver() {
        if (observer) return;

        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    if (document.getElementById(MODAL_ID)) {
                        toggleModal(false);
                    }
                }
                else if (mutation.attributeName === 'style') {
                    const modal = document.getElementById(MODAL_ID);
                    if (modal && modal.style.display !== 'none') {
                        toggleModal(false);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    }

    // Actualizar posición del switch
    function updateSwitchPosition() {
        const wrap = document.getElementById('siiSwitchWrap');
        if (!wrap) return;

        if (isMobileView()) {
            wrap.style.position = 'fixed';
            wrap.style.right = ''; // Limpiar right
            wrap.style.right = '60px'; // Mover 20px desde la izquierda
        } else {
            wrap.style.position = 'absolute';
            wrap.style.left = ''; // Limpiar left
            wrap.style.right = '14px'; // Posición original desde la derecha
        }
    }

    // UI Components
    function createSwitchUI() {
        if (document.getElementById('siiSwitchWrap')) return;

        const wrap = document.createElement('div');
        wrap.id = 'siiSwitchWrap';

        // Aplicar estilos iniciales
        if (isMobileView()) {
            wrap.style.cssText = `
                position: fixed;
                right: 40px;
                top: 14px;
                z-index: 99999;
                user-select: none;
                display: flex;
                align-items: center;
                padding: 0;
                margin: 0;
            `;
        } else {
            wrap.style.cssText = `
                position: absolute;
                right: 14px;
                top: 14px;
                z-index: 99999;
                user-select: none;
                display: flex;
                align-items: center;
                padding: 0;
                margin: 0;
            `;
        }

        const tooltip = document.createElement('span');
        tooltip.id = 'siiSwitchTooltip';
        tooltip.textContent = enabled ? 'Auto-Eliminación SII: ON' : 'Auto-Eliminación SII: OFF';
        tooltip.style.cssText = `
            position: absolute;
            right: calc(100% + 8px);
            top: 50%;
            transform: translateY(-50%);
            background: rgba(30,30,30,0.94);
            color: #fff;
            padding: 4px 12px;
            font-size: 13px;
            border-radius: 5px;
            white-space: nowrap;
            transition: opacity 0.18s;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
        `;

        const label = document.createElement('label');
        label.style.cssText = `
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
            cursor: pointer;
        `;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'siiSwitchInput';
        input.checked = enabled;
        input.style.cssText = `
            opacity: 0;
            width: 0;
            height: 0;
        `;

        const slider = document.createElement('span');
        slider.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${enabled ? '#3BC14A' : '#E74C3C'};
            transition: 0.3s;
            border-radius: 24px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.125);
        `;

        const sliderKnob = document.createElement('span');
        sliderKnob.style.cssText = `
            position: absolute;
            height: 18px;
            width: 18px;
            left: 3px;
            top: 3px;
            background: #fff;
            transition: 0.3s;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.125);
            transform: ${enabled ? 'translateX(22px)' : 'none'};
        `;

        // Event handlers
        input.addEventListener('change', () => {
            const newState = input.checked;
            localStorage.setItem(STORAGE_KEY, newState ? '1' : '0');
            tooltip.textContent = newState ?
                'Auto-Eliminación SII: ON' : 'Auto-Eliminación SII: OFF';
            slider.style.background = newState ? '#3BC14A' : '#E74C3C';
            sliderKnob.style.transform = newState ? 'translateX(22px)' : 'none';

            if (newState) {
                setupObserver();
                toggleModal(false);
            } else {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
                toggleModal(true);
            }
        });

        label.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });

        label.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });

        // Build structure
        slider.appendChild(sliderKnob);
        label.appendChild(input);
        label.appendChild(slider);
        wrap.appendChild(tooltip);
        wrap.appendChild(label);
        document.body.appendChild(wrap);

        // Listen for resize events
        window.addEventListener('resize', updateSwitchPosition);
    }

    // Initialize
    function init() {
        createSwitchUI();
        if (enabled) {
            setupObserver();
            toggleModal(false);
        }
    }

    // Launch when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();