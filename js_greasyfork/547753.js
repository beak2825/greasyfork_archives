// ==UserScript==
// @name         Abrir no Google Earth Pro
// @namespace    http://tampermonkey.net/
// @version      Final-Simplificado
// @description  Adiciona um único botão ao menu de contexto para enviar coordenadas ao Google Earth Pro.
// @author       PJ H
// @match        *://mapear.esteio.com.br/*
// @match        http://10.72.200.50/sede/paginas/index.php*
// @match        http://192.168.2.147/sede/paginas/index.php?pagina=edificacao
// @match        http://mapear.esteio.com.br/fortal-v3/paginas/
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/547753/Abrir%20no%20Google%20Earth%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/547753/Abrir%20no%20Google%20Earth%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MENU_ID = '#map-context-menu';

    // Envia as coordenadas para o servidor local que abre o Google Earth Pro.
    function sendToEarthPro(lat, lng) {
        console.log(`%c[Earth Pro] Enviando coordenadas: Lat: ${lat}, Lng: ${lng}`, 'color: #00695c; font-weight: bold;');
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:3000/open-in-ge",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ lat: lat, lng: lng }),
            onload: (response) => console.log("[Earth Pro] Resposta do servidor:", response.responseText),
            onerror: (error) => {
                console.error("[Earth Pro] Erro ao conectar com o servidor local:", error);
                alert("Não foi possível conectar ao servidor local. Verifique se ele está em execução.");
            }
        });
    }

    // Função que adiciona apenas o nosso botão
    function addEarthProButton(panel) {
        // Verifica se o botão já existe para não adicionar de novo
        if (panel.querySelector('#tm-earth-pro-btn')) return;

        // Lê o texto do painel para extrair as coordenadas
        const text = panel.innerText;
        const latMatch = text.match(/Lat:\s*([-.\d]+)/i);
        const lngMatch = text.match(/Lng:\s*([-.\d]+)/i);

        if (!latMatch || !lngMatch) return;

        const lat = parseFloat(latMatch[1]);
        const lng = parseFloat(lngMatch[1]);

        // Cria o botão para o Earth Pro
        const earthProBtn = document.createElement('button');
        earthProBtn.id = 'tm-earth-pro-btn'; // ID único para nosso botão
        earthProBtn.textContent = '🛰️ Abrir no Earth Pro';

        // Estilo do botão
        Object.assign(earthProBtn.style, {
            cursor: 'pointer',
            backgroundColor: '#00695c',
            color: 'white',
            border: 'none',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '4px',
            width: '100%',
            textAlign: 'center',
            fontSize: '14px',
            fontFamily: 'inherit'
        });

        earthProBtn.addEventListener('click', () => {
            sendToEarthPro(lat, lng);
        });

        // Adiciona uma linha divisória e o botão ao menu
        panel.appendChild(document.createElement('hr'));
        panel.appendChild(earthProBtn);
    }

    // Observa quando o painel aparece ou atualiza
    const mo = new MutationObserver(() => {
        const panel = document.querySelector(MENU_ID);
        if (panel && panel.style.display !== 'none') {
            addEarthProButton(panel);
        }
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

})();