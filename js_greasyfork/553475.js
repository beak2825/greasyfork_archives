// ==UserScript==
// @name         SII Compacto → Completo (Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Interruptor para redirigir desde "formCompacto" a "formCompleto" en el SII. Diseño minimalista verde/rojo.
// @author       Tú
// @license      MIT
// @match        https://www4.sii.cl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553475/SII%20Compacto%20%E2%86%92%20Completo%20%28Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553475/SII%20Compacto%20%E2%86%92%20Completo%20%28Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'siiRedirectEnabled';
    let enabled = GM_getValue(STORAGE_KEY, true);
    const currentUrl = window.location.href;

    // Determinar si debemos mostrar el botón
    function shouldShowButton() {
        return currentUrl.includes('sifmConsultaInternet');
    }

    // Determinar si debemos aplicar la redirección
    function shouldRedirect() {
        return currentUrl.includes('formCompacto');
    }

    // Función de redirección
    function redirectIfEnabled() {
        if (!enabled || !shouldRedirect()) return;

        const params = new URLSearchParams(window.location.search);
        const folio = params.get("folio");
        const codInt = params.get("codInt");
        const form = params.get("form");

        if (folio && codInt && form) {
            const formClean = parseInt(form, 10).toString();
            const newUrl = `https://www4.sii.cl/rfiInternet/?opcionPagina=formCompleto&folio=${folio}&codInt=${codInt}&form=${formClean}`;
            window.location.replace(newUrl);
        }
    }

    // UI Components
    function createSwitchUI() {
        if (document.getElementById('siiRedirectSwitchWrap')) return;
        if (!shouldShowButton()) return;

        const wrap = document.createElement('div');
        wrap.id = 'siiRedirectSwitchWrap';
        wrap.style.cssText = `
            position: fixed;
            right: 14px;
            top: 14px;
            z-index: 99999;
            user-select: none;
            display: flex;
            align-items: center;
            padding: 0;
            margin: 0;
        `;

        const tooltip = document.createElement('span');
        tooltip.id = 'siiRedirectSwitchTooltip';
        tooltip.textContent = enabled ? 'Redirección SII: ON' : 'Redirección SII: OFF';
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
        input.id = 'siiRedirectSwitchInput';
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
        input.addEventListener('change', function() {
            enabled = this.checked;
            GM_setValue(STORAGE_KEY, enabled);
            updateSwitchAppearance();

            if (shouldRedirect()) {
                window.location.reload();
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

        function updateSwitchAppearance() {
            tooltip.textContent = enabled ? 'Redirección SII: ON' : 'Redirección SII: OFF';
            slider.style.background = enabled ? '#3BC14A' : '#E74C3C';
            sliderKnob.style.transform = enabled ? 'translateX(22px)' : 'none';
            input.checked = enabled;
        }

        // Build structure
        slider.appendChild(sliderKnob);
        label.appendChild(input);
        label.appendChild(slider);
        wrap.appendChild(tooltip);
        wrap.appendChild(label);
        document.body.appendChild(wrap);
    }

    // Initialize
    function init() {
        redirectIfEnabled();
        if (shouldShowButton()) {
            createSwitchUI();
        }
    }

    // Launch when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();