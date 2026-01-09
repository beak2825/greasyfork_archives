// ==UserScript==
// @name         YMS Occupied Counter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Cuenta espacios ocupados en YMS
// @author       dnaldair
// @match        https://*.amazon.com/yms/shipclerk*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/tuusuariorio/YMS Occupied Counter
// @downloadURL https://update.greasyfork.org/scripts/561834/YMS%20Occupied%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/561834/YMS%20Occupied%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOTAL_SPACES = 175;

    function createCountPanel() {
        const panel = document.createElement('div');
        panel.id = 'count-pt-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 200px;
            background: #1a1a1a;
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            min-width: 150px;
            font-size: 12px;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 3px;">Espacios Ocupados:</div>
            <div id="occupied-count" style="font-size: 18px; font-weight: bold;">0</div>
            <div style="margin-top: 5px;">Ocupación:</div>
            <div id="percentage" style="font-size: 18px; font-weight: bold; color: #4CAF50;">0%</div>
            <div id="debug-info" style="font-size: 10px; color: #888; margin-top: 5px;"></div>
        `;

        document.body.appendChild(panel);
    }

    function checkAndCount() {
        try {
            // Contar espacios sin necesidad de activar los checkboxes
            const occupiedSpaces = document.querySelectorAll('div.location.ng-scope').length;

            // Redondear el porcentaje a la decena más cercana
            const exactPercentage = (occupiedSpaces / TOTAL_SPACES) * 100;
            const roundedPercentage = Math.round(exactPercentage / 10) * 10;

            // Actualizar el panel
            document.getElementById('occupied-count').textContent = occupiedSpaces;
            const percentageElement = document.getElementById('percentage');
            percentageElement.textContent = `${roundedPercentage}%`;

            // Cambiar color según el porcentaje
            if (roundedPercentage >= 90) {
                percentageElement.style.color = '#FF0000';
            } else if (roundedPercentage >= 80) {
                percentageElement.style.color = '#FFA500';
            } else {
                percentageElement.style.color = '#4CAF50';
            }

            document.getElementById('debug-info').textContent =
                `Actualizado: ${new Date().toLocaleTimeString()}`;

        } catch (error) {
            console.error('Error:', error);
        }
    }

    function init() {
        createCountPanel();

        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 Actualizar';
        refreshButton.style.cssText = `
            position: fixed;
            top: 130px;
            right: 200px;
            padding: 8px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
            transition: background-color 0.3s;
        `;

        refreshButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#45a049';
        });

        refreshButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4CAF50';
        });

        refreshButton.addEventListener('click', checkAndCount);

        document.body.appendChild(refreshButton);

        // Ejecutar el conteo inmediatamente
        setTimeout(checkAndCount, 1000);
    }

    // Iniciar cuando la página esté lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
