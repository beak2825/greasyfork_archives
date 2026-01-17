// ==UserScript==
// @name         KoGaMa Background Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia el fondo de KoGaMa al que tu quieras.
// @author       Haden
// @match        https://www.kogama.com/*
// @match        https://kogama.com/*
// @grant        none
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/562943/KoGaMa%20Background%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/562943/KoGaMa%20Background%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
    function changeBackgroundToGray() {
        const savedColor1 = localStorage.getItem('kogama-bg-color1') || '#8B1538';
        const savedColor2 = localStorage.getItem('kogama-bg-color2') || '#2D0A1F';
        const savedAngle = localStorage.getItem('kogama-bg-angle') || '135';

        const style = document.createElement('style');
        style.id = 'kogama-gray-background';
        style.textContent = `
            /* Cambiar fondo del body a degradado personalizado */
            body {
                background: linear-gradient(${savedAngle}deg, ${savedColor1} 0%, ${savedColor2} 100%) !important;
                background-attachment: fixed !important;
                background-repeat: no-repeat !important;
                min-height: 100vh !important;
            }

            /* Cambiar fondo del body en mobile */
            body#root-page-mobile {
                background: linear-gradient(${savedAngle}deg, ${savedColor1} 0%, ${savedColor2} 100%) !important;
                background-attachment: fixed !important;
            }

            /* Cambiar fondo del contenedor principal si existe */
            #root,
            .App,
            [data-reactroot] {
                background: transparent !important;
            }

            /* Overlay sutil para mejor contraste */
            body::before {
                content: '' !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.05) !important;
                pointer-events: none !important;
                z-index: -1 !important;
            }
        `;

        document.head.appendChild(style);

        console.log('✅ Fondo de Kogama cambiado');
    }

    function updateBackground(color1, color2, angle) {
        const existingStyle = document.getElementById('kogama-gray-background');
        if (existingStyle) {
            existingStyle.remove();
        }

        localStorage.setItem('kogama-bg-color1', color1);
        localStorage.setItem('kogama-bg-color2', color2);
        localStorage.setItem('kogama-bg-angle', angle);

        changeBackgroundToGray();
    }

    function addSettingsButton() {
        const headerList = document.querySelector('ol._3hI0M');
        if (!headerList || headerList.querySelector('#kogama-settings-btn')) return;

        const settingsLi = document.createElement('li');
        settingsLi.className = '_3WhKY';
        settingsLi.innerHTML = `
            <div>
                <button id="kogama-settings-btn" class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-10ikxin"
                        tabindex="0"
                        type="button"
                        aria-label="Configuración de Fondo"
                        style="transform: none; transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path>
                    </svg>
                    <span class="MuiTouchRipple-root css-4mb1j7"></span>
                </button>
            </div>
        `;

        const lastItem = headerList.lastElementChild;
        headerList.insertBefore(settingsLi, lastItem);
        const settingsBtn = settingsLi.querySelector('#kogama-settings-btn');
        settingsBtn.addEventListener('click', showSettingsModal);

        console.log('✅ Botón de configuración agregado al header');
    }

    function showSettingsModal() {
        let modal = document.getElementById('kogama-settings-modal');
        if (modal) {
            modal.remove();
        }

        const currentColor1 = localStorage.getItem('kogama-bg-color1') || '#8B1538';
        const currentColor2 = localStorage.getItem('kogama-bg-color2') || '#2D0A1F';
        const currentAngle = localStorage.getItem('kogama-bg-angle') || '135';

        modal = document.createElement('div');
        modal.id = 'kogama-settings-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            animation: fadeIn 0.2s ease-in-out;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #2C2E3B;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #444; padding-bottom: 15px;">
                <h2 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">Configuración de Fondo</h2>
                <button id="close-settings-modal" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;">×</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 14px;">Color 1:</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="color1-picker" value="${currentColor1}"
                           style="width: 60px; height: 40px; border: 2px solid #555; background: #1a1b26; cursor: pointer; border-radius: 4px;">
                    <input type="text" id="color1-text" value="${currentColor1}"
                           style="flex: 1; padding: 10px; border: 1px solid #555; background: #1a1b26; color: white; border-radius: 4px; font-size: 14px; font-family: monospace;">
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 14px;">Color 2:</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="color2-picker" value="${currentColor2}"
                           style="width: 60px; height: 40px; border: 2px solid #555; background: #1a1b26; cursor: pointer; border-radius: 4px;">
                    <input type="text" id="color2-text" value="${currentColor2}"
                           style="flex: 1; padding: 10px; border: 1px solid #555; background: #1a1b26; color: white; border-radius: 4px; font-size: 14px; font-family: monospace;">
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 14px;">
                    Ángulo: <span id="angle-value" style="color: white; font-weight: 600;">${currentAngle}°</span>
                </label>
                <input type="range" id="angle-slider" min="0" max="360" value="${currentAngle}"
                       style="width: 100%; cursor: pointer;">
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                    <span style="color: #666; font-size: 12px;">0°</span>
                    <span style="color: #666; font-size: 12px;">90°</span>
                    <span style="color: #666; font-size: 12px;">180°</span>
                    <span style="color: #666; font-size: 12px;">270°</span>
                    <span style="color: #666; font-size: 12px;">360°</span>
                </div>
            </div>

            <div style="margin-bottom: 20px; padding: 15px; background: #1a1b26; border-radius: 6px; border: 1px solid #555;">
                <label style="color: #aaa; display: block; margin-bottom: 8px; font-size: 13px;">Vista Previa:</label>
                <div id="gradient-preview" style="width: 100%; height: 100px; border-radius: 4px; background: linear-gradient(${currentAngle}deg, ${currentColor1} 0%, ${currentColor2} 100%);"></div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="reset-colors-btn" style="
                    background: #555;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s;
                ">
                    Restablecer
                </button>
                <button id="apply-colors-btn" style="
                    background: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s;
                ">
                    Aplicar
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        const color1Picker = modal.querySelector('#color1-picker');
        const color1Text = modal.querySelector('#color1-text');
        const color2Picker = modal.querySelector('#color2-picker');
        const color2Text = modal.querySelector('#color2-text');
        const angleSlider = modal.querySelector('#angle-slider');
        const angleValue = modal.querySelector('#angle-value');
        const preview = modal.querySelector('#gradient-preview');
        const closeBtn = modal.querySelector('#close-settings-modal');
        const resetBtn = modal.querySelector('#reset-colors-btn');
        const applyBtn = modal.querySelector('#apply-colors-btn');

        function updatePreview() {
            const c1 = color1Picker.value;
            const c2 = color2Picker.value;
            const angle = angleSlider.value;
            preview.style.background = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
        }

        // Event listeners para color pickers
        color1Picker.addEventListener('input', () => {
            color1Text.value = color1Picker.value;
            updatePreview();
        });

        color2Picker.addEventListener('input', () => {
            color2Text.value = color2Picker.value;
            updatePreview();
        });

        // Event listener para el slider de ángulo
        angleSlider.addEventListener('input', () => {
            angleValue.textContent = `${angleSlider.value}°`;
            updatePreview();
        });

        // Event listeners para text inputs
        color1Text.addEventListener('input', () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(color1Text.value)) {
                color1Picker.value = color1Text.value;
                updatePreview();
            }
        });

        color2Text.addEventListener('input', () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(color2Text.value)) {
                color2Picker.value = color2Text.value;
                updatePreview();
            }
        });

        // Hover effects
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '0.7';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '1';
        });

        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.background = '#666';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.background = '#555';
        });

        applyBtn.addEventListener('mouseenter', () => {
            applyBtn.style.background = '#45a049';
        });
        applyBtn.addEventListener('mouseleave', () => {
            applyBtn.style.background = '#4CAF50';
        });

        // Botón de cerrar
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // Botón de restablecer
        resetBtn.addEventListener('click', () => {
            color1Picker.value = '#8B1538';
            color1Text.value = '#8B1538';
            color2Picker.value = '#2D0A1F';
            color2Text.value = '#2D0A1F';
            angleSlider.value = '135';
            angleValue.textContent = '135°';
            updatePreview();
        });

        applyBtn.addEventListener('click', () => {
            updateBackground(color1Picker.value, color2Picker.value, angleSlider.value);
            modal.remove();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            changeBackgroundToGray();
            addSettingsButton();
        });
    } else {
        changeBackgroundToGray();
        addSettingsButton();
    }

    // Observador para asegurar que el fondo se mantenga y el botón esté presente
    const observer = new MutationObserver(() => {
        if (!document.getElementById('kogama-gray-background')) {
            changeBackgroundToGray();
        }
        addSettingsButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
