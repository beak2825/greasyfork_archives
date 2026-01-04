// ==UserScript==
// @name         Drawaria - Panel negro y rojo + imagen fija
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Panel compacto y estilizado para cargar, mover y fijar imagen sobre el lienzo en Drawaria.online para calcar fácilmente sin estorbar al dibujar.
// @author       Tú
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554027/Drawaria%20-%20Panel%20negro%20y%20rojo%20%2B%20imagen%20fija.user.js
// @updateURL https://update.greasyfork.org/scripts/554027/Drawaria%20-%20Panel%20negro%20y%20rojo%20%2B%20imagen%20fija.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        // Panel flotante estilizado
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.background = '#111'; // fondo negro
        panel.style.color = '#f00'; // texto rojo
        panel.style.border = '1px solid #f00';
        panel.style.padding = '6px';
        panel.style.zIndex = '9999';
        panel.style.borderRadius = '6px';
        panel.style.boxShadow = '0 0 10px rgba(255,0,0,0.4)';
        panel.style.cursor = 'move';
        panel.style.fontSize = '12px';
        panel.style.width = '160px';
        panel.innerHTML = `
            <div id="panelHeader" style="cursor: move; font-weight: bold; margin-bottom: 4px;">🖼 Imagen guía</div>
            <input type="file" id="imageInput" accept="image/*" style="width:100%; font-size:10px;"><br><br>
            <button id="toggleLock" style="width:100%; background:#f00; color:#fff; border:none; padding:4px; margin-bottom:4px;">Fijar imagen</button>
            <button id="removeOverlay" style="width:100%; background:#333; color:#f00; border:none; padding:4px;">Quitar imagen</button>
        `;
        document.body.appendChild(panel);

        // Mover panel
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
                panel.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', () => {
            isPanelDragging = false;
        });

        // Imagen sobre el lienzo
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '100px';
        container.style.left = '100px';
        container.style.zIndex = '1000';
        container.style.cursor = 'move';
        container.style.resize = 'both';
        container.style.overflow = 'hidden';
        container.style.border = '2px dashed #f00';
        container.style.background = 'transparent';
        container.style.width = '250px';
        container.style.height = '250px';
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
            container.style.border = isLocked ? 'none' : '2px dashed #f00';
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
