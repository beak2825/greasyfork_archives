// ==UserScript==
// @name         Drawaria - Imagen fija y panel movible
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Carga, mueve, redimensiona y fija una imagen sobre el lienzo en Drawaria.online. El panel también se puede mover libremente por la pantalla para no estorbar al dibujar.
// @author       Tú
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554026/Drawaria%20-%20Imagen%20fija%20y%20panel%20movible.user.js
// @updateURL https://update.greasyfork.org/scripts/554026/Drawaria%20-%20Imagen%20fija%20y%20panel%20movible.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        // Crear panel flotante
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.background = 'rgba(255,255,255,0.95)';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '10px';
        panel.style.zIndex = '9999';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        panel.style.cursor = 'move';
        panel.innerHTML = `
            <div id="panelHeader" style="cursor: move; font-weight: bold; margin-bottom: 5px;">📌 Imagen de referencia</div>
            <input type="file" id="imageInput" accept="image/*"><br><br>
            <button id="toggleLock">Fijar imagen</button>
            <button id="removeOverlay">Quitar imagen</button>
        `;
        document.body.appendChild(panel);

        // Hacer el panel movible
        let isPanelDragging = false;
        let panelOffsetX = 0, panelOffsetY = 0;

        const header = panel.querySelector('#panelHeader');
        header.addEventListener('mousedown', (e) => {
            isPanelDragging = true;
            panelOffsetX = e.clientX - panel.offsetLeft;
            panelOffsetY = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isPanelDragging) {
                panel.style.left = (e.clientX - panelOffsetX) + 'px';
                panel.style.top = (e.clientY - panelOffsetY) + 'px';
                panel.style.right = 'auto'; // para que no se quede pegado a la derecha
            }
        });

        document.addEventListener('mouseup', () => {
            isPanelDragging = false;
        });

        // Contenedor de imagen
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '100px';
        container.style.left = '100px';
        container.style.zIndex = '1000';
        container.style.cursor = 'move';
        container.style.resize = 'both';
        container.style.overflow = 'hidden';
        container.style.border = '2px dashed #888';
        container.style.background = 'transparent';
        container.style.width = '300px';
        container.style.height = '300px';
        container.style.opacity = '0.5';
        container.style.display = 'none';

        const overlay = document.createElement('img');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.objectFit = 'contain';
        overlay.draggable = false;

        container.appendChild(overlay);
        document.body.appendChild(container);

        // Cargar imagen
        document.getElementById('imageInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(event) {
                overlay.src = event.target.result;
                container.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });

        // Quitar imagen
        document.getElementById('removeOverlay').addEventListener('click', () => {
            overlay.src = '';
            container.style.display = 'none';
        });

        // Fijar imagen
        let isLocked = false;
        document.getElementById('toggleLock').addEventListener('click', () => {
            isLocked = !isLocked;
            container.style.pointerEvents = isLocked ? 'none' : 'auto';
            container.style.border = isLocked ? 'none' : '2px dashed #888';
            document.getElementById('toggleLock').textContent = isLocked ? 'Desbloquear imagen' : 'Fijar imagen';
        });

        // Mover imagen
        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener('mousedown', function(e) {
            if (isLocked) return;
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging && !isLocked) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    });
})();
