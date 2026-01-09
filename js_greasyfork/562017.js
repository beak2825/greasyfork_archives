// ==UserScript==
// @name         Extractor de Código BloxDrop
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copia el código fuente (DOM) completo de BloxDrop al portapapeles con un clic para análisis de bots.
// @author       Xaixon & Gemini
// @match        *://bloxdrop.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562017/Extractor%20de%20C%C3%B3digo%20BloxDrop.user.js
// @updateURL https://update.greasyfork.org/scripts/562017/Extractor%20de%20C%C3%B3digo%20BloxDrop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear el botón de extracción
    const btn = document.createElement('button');
    btn.innerText = 'COPIAR CÓDIGO (DOM)';
    
    // Estilo tipo "Hacker" para que no se pierda en la interfaz
    Object.assign(btn.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '1000000',
        backgroundColor: '#ff0000',
        color: '#ffffff',
        border: '2px solid #fff',
        padding: '12px 20px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(255,0,0,0.5)'
    });

    document.body.appendChild(btn);

    btn.onclick = () => {
        // Crear un área de texto invisible para copiar
        const el = document.createElement('textarea');
        el.value = document.documentElement.outerHTML;
        document.body.appendChild(el);
        el.select();
        
        try {
            document.execCommand('copy');
            btn.innerText = '¡COPIADO!';
            btn.style.backgroundColor = '#00ff00';
            setTimeout(() => {
                btn.innerText = 'COPIAR CÓDIGO (DOM)';
                btn.style.backgroundColor = '#ff0000';
            }, 2000);
        } catch (err) {
            alert('Error al copiar. Intenta usar el modo lectura o un marcador.');
        }
        
        document.body.removeChild(el);
    };
})();